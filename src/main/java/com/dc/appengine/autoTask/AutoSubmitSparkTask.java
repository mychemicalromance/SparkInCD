package com.dc.appengine.autoTask;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;

import org.apache.commons.collections4.map.LRUMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.dc.appengine.ConfigUtil;
import com.dc.appengine.entity.SparkFunction;
import com.dc.appengine.service.ISparkService;
import com.dc.appengine.service.impl.SparkService;
import com.dc.appengine.sparkInCD.SpringBeanUtil;
import com.dc.appengine.util.RedisUtil;
import com.dc.appengine.util.ScpTo;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

import redis.clients.jedis.Jedis;

public class AutoSubmitSparkTask implements Runnable {

	private static final Logger log = LoggerFactory.getLogger(AutoSubmitSparkTask.class);
	private ISparkService sparkService;
	public static final String remoteSubmitPrefix = "spark_remote_submit_";
	private static LRUMap<Long, Long> lru = new LRUMap<>(32);
	
	public AutoSubmitSparkTask(ISparkService sparkService){
		this.sparkService = sparkService;
	}

	public void execute() {
		boolean appLock = false;
		String uuid = UUID.randomUUID().toString();
		try {
			// 获取spark应用锁
			Jedis jedis = RedisUtil.getNewJedis(Integer.valueOf(ConfigUtil.configs.getProperty("redis.rcdb")));
			// 获取应用锁
			appLock = "OK".equals(jedis.set("sparkTask", Math.random() + "", "NX", "EX", 60)) ? true : false;// 获取应用锁，不存在，则创建锁
																												// timeout
																												// 60秒
			if (!appLock) {
				log.error("执行提交任务锁已存在，本次执行跳过");
				return;// 获取锁失败，退出
			}
			List<String> deleteTaskIds = new ArrayList<>();
			CountDownLatch countDownv16 = realExec("1.6", deleteTaskIds);
			CountDownLatch countDownv21 = realExec("2.1", deleteTaskIds);
			// 删除spark任务，注意，此处确定某个任务可以在本次任务中执行就将任务删除可能是不合理的，应该在实例创建成功时再将任务从数据库中删除
			// 后续如果需要更改，在此处创建spark实例，因为创建实例的速度很快。
			if (deleteTaskIds.size() > 0)
				sparkService.deleteSparkTasks(deleteTaskIds);
			jedis.del("sparkTask");
			appLock = false;
			log.error(uuid + "删除锁" + new Date());

			if (countDownv16 != null) {
				countDownv16.await();
			}
			if (countDownv21 != null) {
				countDownv21.await();
			}

		} catch (Exception e) {
			log.error("auto submit spark  task error!", e);
			e.printStackTrace();
		} finally {
			if (appLock) {
				RedisUtil.getNewJedis(Integer.valueOf(ConfigUtil.configs.getProperty("redis.rcdb"))).del("sparkTask");
			}
		}
	}

	// 真正的执行逻辑
	private CountDownLatch realExec(String sparkVersion, List<String> deleteTaskIds) {
		// 检测出可以正常连通的node
		List<Map<String, String>> remoteNodes = executeRemoteSubmitNodes(sparkVersion);
		// 是否能够执行远程任务，如果可用node是空列表，那么就不能执行远程任务，遇到远程任务就跳过
		boolean canExecuteRemoteTask = remoteNodes.size() != 0;
		if (!canExecuteRemoteTask) {
			return null;
		}
		// 设置redis中记录正在执行的任务数目，如果不存在，设置为0
		checkRedisRemoteNode(remoteNodes);
		Jedis jedis = RedisUtil.getNewJedis(Integer.valueOf(ConfigUtil.configs.getProperty("redis.rcdb")));
		int maxTaskNum = Integer.valueOf(ConfigUtil.configs.getProperty("spark_submit_thread_num"));
		// 可以执行的任务总数
		int executeNum = 0;
		// 可以使用的node
		List<RemoteNode> available = new ArrayList<>();
		for (Map<String, String> node : remoteNodes) {
			String remoteHost = node.get("host").toString();
			String uname = node.get("uname").toString();
			String auth = node.get("auth").toString();
			String submitScriptLoc = node.get("submitScriptLoc").toString();
			int nowValue = Integer.valueOf(jedis.get(remoteSubmitPrefix + remoteHost));
			if (nowValue < maxTaskNum) {
				// 这个host可以执行远程任务
				int rest = maxTaskNum - nowValue;
				// rangeFrom和rangeTo是下标
				int rangeFrom = executeNum;
				int rangeTo = executeNum + rest - 1;
				RemoteNode remoteNode = new RemoteNode(remoteHost, uname, auth, rangeFrom, rangeTo, submitScriptLoc);
				available.add(remoteNode);
				executeNum += rest;
			}
		}
		if (executeNum == 0) {
			return null;
		}
		// 从数据库中取得对应版本的任务
		List<Map<String, Object>> tasks = sparkService.getSparkTasks(executeNum, sparkVersion);
		if (tasks.size() == 0) {
			return null;
		}
		for (int i = 0; i < tasks.size(); i++) {
			Map<String, Object> task = tasks.get(i);
			for (RemoteNode remoteNode : available) {
				if (remoteNode.contain(i)) {
					String message = (String) task.get("message");
					remoteNode.tasks.add(JSON.parseObject(message, new TypeReference<Map<String, Object>>() {
					}));
					// 标记为可删除
					deleteTaskIds.add(task.get("id").toString());
				}
			}
		}
		/*for (RemoteNode rn : available) {
			int i = rn.tasks.size();
			if (i > 0) {
				// 将值增加，可以保证远程node同时执行的任务数目，任务执行完成则减一
				jedis.incrBy(remoteSubmitPrefix + rn.host, i);
			}
		}*/
		CountDownLatch countDown = new CountDownLatch(tasks.size());
		for (RemoteNode remoteNode : available) {
			for (Map<String, Object> task : remoteNode.tasks) {
				// 执行远程提交任务
				task.put("host", remoteNode.host);
				task.put("uname", remoteNode.uname);
				task.put("auth", remoteNode.auth);
				task.put("submitScriptLoc", remoteNode.submitScriptLoc);

				// 如果需要创建实例，在此处创建
				String sparkId = (String) task.get("sparkId");
				String userId = task.get("userId").toString();
				String functionId = (String) task.get("functionId");
				int confVersionId = (int) task.get("confVersionId");
				boolean create = (boolean) task.get("create");
				if (create) {
					Map<String, Object> params = new HashMap<>();
					params.put("uuid", UUID.randomUUID() + "");
					params.put("sparkId", sparkId);
					params.put("functionId", functionId);
					params.put("confVersionId", confVersionId);
					params.put("updateTime", new Date());
					params.put("name", "");
					params.put("userId", Long.valueOf(userId));
					params.put("sparkVersion", sparkVersion);
					params.put("status", "Created");
					this.sparkService.saveSparkInstance(params);
				}
				SparkService.service.execute(new SparkRemoteSubmitTask(task, countDown, sparkService));
				//提交一个任务，正在执行的任务数加一
				jedis.incrBy(remoteSubmitPrefix + remoteNode.host, 1);
			}
		}
		return countDown;
	}

	@Override
	public void run() {
		execute();
	}

	@Deprecated
	private void prepare(List<Map<String, Object>> jobs) {
		// 准备环境，拼命令
		for (Map<String, Object> job : jobs) {
			String sparkId = (String) job.get("sparkId");
			String functionId = (String) job.get("functionId");
			SparkFunction fun = sparkService.findFunctionById(functionId);
			String resourceVersionId = fun.getResourceVerId();
			if (job.containsKey("timestamp")) {
				Long timestamp = Long.valueOf(job.get("timestamp").toString());
				if (lru.containsKey(timestamp)) {
					continue;
				} else {
					sparkService.deleteTmpFile(resourceVersionId, sparkId);
					lru.put(timestamp, timestamp);
				}
			} else {
				sparkService.deleteTmpFile(resourceVersionId, sparkId);
			}
		}
		for (Map<String, Object> job : jobs) {
			String functionId = (String) job.get("functionId");
			String sparkId = (String) job.get("sparkId");
			SparkFunction fun = sparkService.findFunctionById(functionId);
			String resourceVersionId = fun.getResourceVerId();
			String zipParentPath = sparkService.doDownloadAndUnzip(resourceVersionId, sparkId);
			int confVersionId = (int) job.get("confVersionId");
			List<String> submitCommand = sparkService.getCommand(fun, confVersionId, zipParentPath);
			String command = org.springframework.util.StringUtils.collectionToDelimitedString(submitCommand, " ");
			String classPath = AutoSubmitSparkTask.class.getResource("/").getPath();
			String fileParentPath = classPath + "spark/";
			String fileName = fun.getId() + "_" + confVersionId + "_start";
			// "echo $! > "
			// +fileParentPath+fileName+".pid"+System.getProperty("line.separator")+"echo
			// $!"+System.getProperty("line.separator")+"tail -f
			// "+fileParentPath+fileName+".out";
			// String
			// commandSh="#!/bin/bash"+System.getProperty("line.separator")+"nohup
			// "+command+" >> "+fileParentPath+fileName+".out"+" 2>&1 &"
			// +System.getProperty("line.separator")+echo;
			StringBuffer commandSh = new StringBuffer();
			commandSh.append("#!/bin/bash" + System.getProperty("line.separator"));
			// commandSh.append("echo \"PID of this script:
			// $$\""+System.getProperty("line.separator"));
			commandSh.append("echo \"PID of this script: $$\" > " + fileParentPath + fileName + ".pid"
					+ System.getProperty("line.separator"));// 输出pid
			commandSh.append("exec " + command);// 执行命令,父子进程用同一进程id
			job.put("command", command);
			job.put("commandSh", commandSh.toString());
			job.put("fileParentPath", fileParentPath);
			job.put("fileName", fileName);
		}
	}

	private List<Map<String, String>> executeRemoteSubmitNodes(String sparkVersion) {
		// 首先获取配置的远程提交node列表，格式为
		// host://admin:admin@10.127.0.1/datafs/cloudera/parcels/SPARK2-2.1.0.cloudera1-1.cdh5.7.0.p0.120904/bin/
		// 是一个标准的URI，这样方便取各种信息
		String remote_spark_submit_nodes = null;
		String remote_spark_submit_workdir = null;
		if (sparkVersion.equals("1.6")) {
			remote_spark_submit_nodes = ConfigUtil.configs.getProperty("remote_spark_submit_nodes_1.6");
			remote_spark_submit_workdir = ConfigUtil.configs.getProperty("remote_spark_submit_workdir_1.6");
		} else if (sparkVersion.equals("2.1")) {
			remote_spark_submit_nodes = ConfigUtil.configs.getProperty("remote_spark_submit_nodes_2.1");
			remote_spark_submit_workdir = ConfigUtil.configs.getProperty("remote_spark_submit_workdir_2.1");
		}

		if (remote_spark_submit_workdir == null || remote_spark_submit_workdir.trim().equals("")) {
			remote_spark_submit_workdir = "/home/remote_spark_submit_workdir/";
		}
		if (!remote_spark_submit_workdir.endsWith("/")) {
			remote_spark_submit_workdir = remote_spark_submit_workdir + "/";
		}
		if (remote_spark_submit_nodes == null || remote_spark_submit_nodes.trim().equals("")) {
			log.error("remote_spark_submit_nodes is null");
			return Collections.EMPTY_LIST;
		}
		String utilPackage = null;
		String packageName = "spark_remote_util.zip";
		try {
			File f = new File("./"+packageName);
			utilPackage = f.toPath().toRealPath().toString();
		} catch (Exception e) {
			e.printStackTrace();
			log.error(packageName + " is not found");
			return Collections.EMPTY_LIST;
		}
		String[] nodeinfos = remote_spark_submit_nodes.split(";");
		List<Map<String, String>> nodes = new ArrayList<>();
		for (String nodeinfo : nodeinfos) {
			String uname;
			String auth;
			String host;
			String submitScriptLoc;
			try {
				URI u = new URI(nodeinfo);
				uname = u.getUserInfo().split(":")[0];
				auth = u.getUserInfo().split(":")[1];
				host = u.getHost();
				submitScriptLoc = u.getPath();
				if (submitScriptLoc == null || submitScriptLoc.equals("")) {
					log.error(host + " submitScriptLoc is null,skip it");
					continue;
				}
				if (!submitScriptLoc.endsWith("/")) {
					submitScriptLoc = submitScriptLoc + "/";
				}
			} catch (URISyntaxException e) {
				e.printStackTrace();
				continue;
			}
			JSch jsch = null;
			Session session = null;
			try {
				jsch = new JSch();
				session = jsch.getSession(uname, host, 22);
				session.setPassword(auth);
				session.setConfig("StrictHostKeyChecking", "no");
				session.connect();
				String workdirexist = ScpTo.execShortCommand(session, "(test -d " + remote_spark_submit_workdir
						+ " && echo exist)" + "||(mkdir -p " + remote_spark_submit_workdir + " && echo created)");
				if (workdirexist.equals("exist")) {
					log.error(host + " " + remote_spark_submit_workdir + " exist");
				} else if (workdirexist.equals("created")) {
					log.error(host + " " + remote_spark_submit_workdir + " created");
				} else if (workdirexist.equals("error")) {
					log.error(host + " create work dir error");
				} else {
					log.error(host + ":" + workdirexist);
					continue;
				}
				String exist = ScpTo.execShortCommand(session,
						"test -f " + remote_spark_submit_workdir + packageName + " && echo 'y' || echo 'n'");
				if (exist.equals("n")) {
					boolean b = ScpTo.scpTo(session, utilPackage, remote_spark_submit_workdir + packageName);
					if (!b) {
						log.error(host + "transfer util package failed");
						continue;
					} else {
						log.error(host + "transfer util package success");
						Map<String, String> node = new HashMap<>();
						node.put("host", host);
						node.put("uname", uname);
						node.put("auth", auth);
						// 提交脚本位置
						node.put("submitScriptLoc", submitScriptLoc);
						nodes.add(node);
					}
				} else {
					Map<String, String> node = new HashMap<>();
					node.put("host", host);
					node.put("uname", uname);
					node.put("auth", auth);
					// 提交脚本位置
					node.put("submitScriptLoc", submitScriptLoc);
					nodes.add(node);
				}
			} catch (JSchException e) {
				e.printStackTrace();
			} finally {
				if (session != null) {
					session.disconnect();
				}
			}

		}
		return nodes;
	}

	public void checkRedisRemoteNode(List<Map<String, String>> nodes) {
		Jedis jedis = RedisUtil.getNewJedis(Integer.valueOf(ConfigUtil.configs.getProperty("redis.rcdb")));
		for (Map<String, String> node : nodes) {
			String host = node.get("host").toString();
			// ConfigHelper.getValue("spark_submit_thread_num")
			jedis.setnx(remoteSubmitPrefix + host, 0 + "");
		}
	}
}
