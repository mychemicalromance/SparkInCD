package com.dc.appengine.autoTask;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.dc.appengine.ConfigUtil;
import com.dc.appengine.autoTask.AutoSubmitSparkTask;
import com.dc.appengine.entity.SparkFunction;
import com.dc.appengine.util.RedisUtil;
import com.dc.appengine.util.ScpTo;
import com.dc.appengine.service.ISparkService;
import com.dc.appengine.service.impl.FtpResourceService;
import com.dc.appengine.sparkInCD.SpringBeanUtil;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import org.apache.commons.collections4.map.LRUMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;


public class SparkRemoteSubmitTask implements Runnable{
    private static final Logger log = LoggerFactory.getLogger(SparkRemoteSubmitTask.class);
    private Map<String,Object> task;
    private CountDownLatch countDown;
    private ISparkService sparkService;

    public SparkRemoteSubmitTask(Map<String,Object> task,
                                 CountDownLatch countDown,
                                 ISparkService sparkService){
        this.task = task;
        this.countDown = countDown;
        this.sparkService = sparkService;
    }
    @Override
    public void run() {
        JSch jsch = null;
        Session session = null;
        final Map<String,Object> params = new HashMap<>();
        String sparkId = (String) task.get("sparkId");
        String functionId = (String) task.get("functionId");
        int confVersionId = (int) task.get("confVersionId");
        params.put("sparkId",sparkId);
        params.put("functionId",functionId);
        params.put("confVersionId",confVersionId);
        //首先获取远程主机sesion，如果获取不到，任务设置为失败，退出
        try{
            String host = task.get("host").toString();
            String uname = task.get("uname").toString();
            String auth = task.get("auth").toString();
            jsch = new JSch();
            session = jsch.getSession(uname, host, 22);
            session.setPassword(auth);
            session.setConfig("StrictHostKeyChecking", "no");
            session.connect();
            execute(session);
        }catch(JSchException e){
            log.error(task.get("host") +" get connection:",e);
            params.put("errorlog",task.get("host")+" connect failed");
            params.put("status","FAILED");
            sparkService.updateSparkInstance(params);
        }catch (Exception e){
            log.error("SparkRemoteSubmitTask execute:",e);
            params.put("errorlog", getExceptionDetail(e));
            params.put("status","FAILED");
            sparkService.updateSparkInstance(params);
        }finally {
            if(session!=null){
                session.disconnect();
            }
            countDown.countDown();
            //任务做完，将redis中的数目减一，领取任务加一，做完之后减一
            RedisUtil.getNewJedis(Integer.valueOf(ConfigUtil.configs.getProperty("redis.rcdb")))
                    .decr(AutoSubmitSparkTask.remoteSubmitPrefix+task.get("host").toString());
        }
    }

    private void execute(final Session session){

        final String yarnPort = ConfigUtil.configs.getProperty("hadoop-yarnPort");
        String sparkId = (String) task.get("sparkId");
        String functionId = (String) task.get("functionId");
        int confVersionId = (int) task.get("confVersionId");
        final String sparkVersion = task.get("sparkVersion").toString();

        //开始执行任务
        final Map<String,Object> params = new HashMap<>();
        params.put("sparkId",sparkId);
        params.put("functionId",functionId);
        params.put("confVersionId",confVersionId);

        //session获取成功，然后拼接命令
        String remote_spark_submit_workdir = null;
        if(sparkVersion.equals("1.6")){
            remote_spark_submit_workdir = ConfigUtil.configs.getProperty("remote_spark_submit_workdir_1.6");
        }else if(sparkVersion.equals("2.1")){
            remote_spark_submit_workdir = ConfigUtil.configs.getProperty("remote_spark_submit_workdir_2.1");
        }
        if(remote_spark_submit_workdir == null || remote_spark_submit_workdir.trim().equals("")){
            remote_spark_submit_workdir = "/home/remote_spark_submit_workdir/";
        }
        if(!remote_spark_submit_workdir.endsWith("/")){
            remote_spark_submit_workdir = remote_spark_submit_workdir+"/";
        }
        FtpResourceService ftpService = (FtpResourceService) SpringBeanUtil.getBean("ftpService");
        SparkFunction fun = sparkService.findFunctionById(functionId);
        String resourceVersionId = fun.getResourceVerId();
        Map<String,Object>parms = ftpService.getSparkVersionInfo(resourceVersionId);
        String url = parms.get("url").toString();//ftp://admin:admin@10.127.0.1:21/sparkApp/spark.zip
        String md5 = parms.get("md5").toString();
        List<String> libjars;
        List<String> binjars;
        try{
            URI uri = new URI(url);
            String ftpServer = uri.getHost();
            int port = uri.getPort();
            String u = uri.getUserInfo().split(":")[0];
            String pd = uri.getUserInfo().split(":")[1];
            String paths = uri.getPath();
            int lastIndex = paths.lastIndexOf("/");
            String path = paths.substring(0,lastIndex+1);
            String filename = paths.substring(lastIndex+1);
            String parentPath = remote_spark_submit_workdir+sparkId;
            List<String> args = new ArrayList<>();
            args.add(ftpServer);args.add(port+"");args.add(u);args.add(pd);
            args.add(path);args.add(filename);
            args.add(parentPath);
            args.add(md5);
            String downloadAndUnzipCommand = "java -jar "+remote_spark_submit_workdir+"spark_remote_util.zip "+
                    org.springframework.util.StringUtils.collectionToDelimitedString(args," ");
            String packageResult = ScpTo.execShortCommand(session,downloadAndUnzipCommand);
            //分析结果
            if(packageResult.startsWith("error")){
                //远程执行错误，记录错误，返回
                log.error(packageResult);
                params.put("status","FAILED");
                params.put("errorlog",packageResult);
                sparkService.updateSparkInstance(params);
                return;
            }else if(packageResult.startsWith("{") && packageResult.endsWith("}")){
                //如果执行正常，返回的结果是标准的json
                Map<String,List<String>> jars = JSON.parseObject(packageResult,new TypeReference<Map<String, List<String>>>(){});
                libjars = jars.get("lib");
                binjars = jars.get("bin");
                //远程包准备完成
            }else{
                //未知异常，记录错误，返回
                log.error(packageResult);
                params.put("status","FAILED");
                params.put("errorlog","unknown error");
                sparkService.updateSparkInstance(params);
                return;
            }

        } catch (URISyntaxException e) {
            params.put("status","FAILED");
            params.put("errorlog","uri syntax error");
            sparkService.updateSparkInstance(params);
            e.printStackTrace();
            return;
        }
        String submitScriptLoc = task.get("submitScriptLoc").toString();
        String sparkScript = null;
        if(sparkVersion.equals("1.6")){
            sparkScript = "spark-submit";
        }else if(sparkVersion.equals("2.1")){
            sparkScript = "spark2-submit";
        }
        List<String> submitCommand = sparkService.getRemoteSubmitCommand(fun,confVersionId,
                libjars,binjars,submitScriptLoc,sparkScript);
        log.error("SparkRemoteSubmitTask submitCommand:",JSON.toJSONString(submitCommand));
        ChannelExec channel = null;
        //生成脚本，合并输出流和错误流，然后执行脚本
        try{
            channel = (ChannelExec) session.openChannel("exec");
            //-l参数指的是一个登陆shell命令，尾部2>&1重定向错误流
            String command = "bash -l -c 'echo \"PID of this script:$$\";exec "+
                    org.springframework.util.StringUtils.collectionToDelimitedString(submitCommand," ")+"' 2>&1";
            log.error("Command:"+command);
            channel.setCommand(command);
            final InputStream out = channel.getInputStream();
            channel.connect();
            //正常退出
            final AtomicBoolean normalExit = new AtomicBoolean(false);
            //记录错误日志，只记录一百行
            final LRUMap<Integer, String> lru = new LRUMap<>(100);
            final AtomicInteger pid = new AtomicInteger(-1);
            Runnable r1 = new Runnable() {
                @Override
                public void run() {
                    try (BufferedReader br = new BufferedReader(new InputStreamReader(out))) {
                        String str = null;
                        int line = 0;
                        while ((str = br.readLine()) != null) {
                            lru.put(line++,str);
                            if(str.startsWith("PID of this script:")){
                                //记录pid，后续需要kill进程
                                pid.set(Integer.parseInt(str.substring(str.lastIndexOf(":")+1)));
                            }else if(str.contains("Submitted")){
                                String s = "Submitted application ";
                                int length = s.length();
                                int index = str.indexOf(s);
                                String applicationId = str.substring(index+length,str.length());
                                params.put("id",applicationId);
                                String yarnIp = null;
                                if(sparkVersion.equals("1.6")){
                                    yarnIp = ConfigUtil.configs.getProperty("hadoop-yarnIp");
                                }else if(sparkVersion.equals("2.1")){
                                    yarnIp = ConfigUtil.configs.getProperty("hadoop-yarnIp-v2.1");
                                }
                                StringBuilder uiLink = new StringBuilder("http://").append(yarnIp).append(":").append(yarnPort)
                                        .append("/proxy/").append(applicationId);
                                params.put("uiLink",uiLink.toString());
                                StringBuilder detailLink=new StringBuilder("http://").append(yarnIp).append(":").append(yarnPort)
                                        .append("/cluster/app/").append(applicationId);
                                params.put("detailLink",detailLink.toString());
                                params.put("status","Submitted");
                                params.put("updateTime",new Date());
                                Map<String,Object> map = sparkService.getSparkDetail(applicationId,sparkVersion);
                                params.put("name",map.get("name"));
                                sparkService.updateSparkInstance(params);
                                normalExit.set(true);
                                Thread.sleep(1000);
                                ScpTo.execShortCommand(session,"kill -9 "+pid.get());
                                break;
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            };
            Thread t1 = new Thread(r1);
            t1.start();
            while(t1.isAlive()){
                try {
                    t1.join();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            StringBuilder errInfo = new StringBuilder();
            if(!normalExit.get()){
                //如果没有正常结束，可能是执行命令时直接报错，也有可能是命令被正常执行了，但是执行过程中报错了。
                log.error("提交命令没有正常退出");
                for(Map.Entry<Integer,String> entry:lru.entrySet()){
                    errInfo.append(System.lineSeparator()).append(entry.getValue());
                }
                params.put("errorlog",errInfo.toString());
                params.put("status","FAILED");
                sparkService.updateSparkInstance(params);
            }
        } catch (JSchException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(channel!=null){
                channel.disconnect();
            }
        }
    }
    
    public static String getExceptionDetail(Exception e){
		StackTraceElement[] stes = e.getStackTrace();
		int m = Math.min(10, stes.length);
		StringBuilder sb = new StringBuilder();
		sb.append(e.getMessage()+" exception message maybe null...");
		for(int i = 0;i<m;i++){
			sb.append(System.lineSeparator()).append(stes[i].toString());
		}
		log.error(sb.toString());
		return e.getMessage();
	}
}
