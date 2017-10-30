package com.dc.appengine.autoTask;

import com.dc.appengine.ConfigUtil;
import com.dc.appengine.entity.SparkInstance;
import com.dc.appengine.service.ISparkService;
import com.dc.appengine.service.impl.SparkService;
import com.dc.appengine.sparkInCD.SpringBeanUtil;
import com.dc.appengine.util.RedisUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AutoSynchronizeSparkTask implements Runnable {

	private static final String SYNC_STATUS = "SynchronizeSparkApplicationStatus";

	private static final Logger log = LoggerFactory.getLogger(AutoSynchronizeSparkTask.class);

	private ISparkService sparkService;
	
	public AutoSynchronizeSparkTask(ISparkService sparkService){
		this.sparkService = sparkService;
	}

	public void execute() {
		boolean gotLock = false;
		try {
			Jedis jedis = RedisUtil.getNewJedis(Integer.valueOf(ConfigUtil.configs.getProperty("redis.rcdb")));
			log.error("进入任务，开始尝试加锁");
			if (jedis == null) {
				log.error("jedis为null，返回");
				return;
			}
			String SYNCTASK_LOCK_TIMEOUT = ConfigUtil.configs.getProperty("SYNCTASK_LOCK_TIMEOUT");
			if (SYNCTASK_LOCK_TIMEOUT == null || SYNCTASK_LOCK_TIMEOUT.equals("")) {
				SYNCTASK_LOCK_TIMEOUT = "60000";
			}
			gotLock = "OK".equals(
					jedis.set(SYNC_STATUS, Math.random() + "", "NX", "PX", Integer.valueOf(SYNCTASK_LOCK_TIMEOUT)))
							? true : false;
			if (!gotLock) {
				log.error("同步状态任务锁已存在");
				return;// 获取锁失败，本次任务退出
			}
			log.error("同步状态任务锁加锁成功");
			dosync();
		} finally {
			if (gotLock) {
				long l = RedisUtil.getNewJedis(Integer.valueOf(ConfigUtil.configs.getProperty("redis.rcdb")))
						.del(SYNC_STATUS);
				if (l > 0) {
					log.error("同步状态任务锁存在并且删除成功");
				} else {
					log.error("同步状态任务锁不存在");
				}
			}
		}
	}

	private void dosync() {
		try {
			List<Map<String, Object>> apps = new ArrayList<>();
			// 1.6版本
			String v16yarnIp = ConfigUtil.configs.getProperty("hadoop-yarnIp");
			if (v16yarnIp != null) {
				apps.addAll(sparkService.getSparksDetail("1.6"));
			}
			// 2.1版本
			String v21yarnIp = ConfigUtil.configs.getProperty("hadoop-yarnIp-v2.1");
			if (v21yarnIp != null) {
				apps.addAll(sparkService.getSparksDetail("2.1"));
			}
			for (Map<String, Object> app : apps) {
				SparkInstance instance = sparkService.findSparkInstanceById(app.get("id").toString());
				if (instance != null) {
					log.debug("update spark instance");
					Map<String, Object> param = new HashMap<>();
					param.put("id", app.get("id").toString());
					param.put("status", app.get("state").toString());
					param.put("confVersionId", instance.getConfVersionId());
					param.put("sparkId", instance.getSparkId());
					param.put("functionId", instance.getFunctionId());
					sparkService.updateSparkInstance(param);
				}
			}

		} catch (Exception e) {
			log.error("auto maintain task error!", e);
			e.printStackTrace();
		}
	}

	@Override
	public void run() {
		execute();
	}
}