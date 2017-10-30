package com.dc.appengine.service.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.annotation.PostConstruct;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.dc.appengine.ConfigUtil;
import com.dc.appengine.dao.ISparkDAO;
import com.dc.appengine.dao.impl.ConfigDao;
import com.dc.appengine.dao.impl.FtpDao;
import com.dc.appengine.entity.Page;
import com.dc.appengine.entity.Spark;
import com.dc.appengine.entity.SparkFunction;
import com.dc.appengine.entity.SparkInstance;
import com.dc.appengine.service.ISparkService;
import com.dc.appengine.sparkInCD.FtpProperties;
import com.dc.appengine.util.Constants;
import com.dc.appengine.util.FileUtil;
import com.dc.appengine.util.FtpTransferer;
import com.dc.appengine.util.MessageHelper;
import com.dc.appengine.ws.client.HadoopYarnRestClient;

@Service("sparkService")
@Configuration
@EnableConfigurationProperties(FtpProperties.class)
@AutoConfigureBefore(FtpProperties.class)
public class SparkService implements ISparkService {
	private static final Logger log=LoggerFactory.getLogger(SparkService.class);

	public static ExecutorService service = Executors.newCachedThreadPool();
	public static Map<String,String> provinceMap = new HashMap<>();
	private HadoopYarnRestClient yarnClient=new HadoopYarnRestClient();
	@Autowired
	@Qualifier("sparkDao")
	private ISparkDAO dao;
	
	@Autowired
	@Qualifier("configDao")
	private ConfigDao configDao;

	@Autowired
	@Qualifier("configservice")
	private ConfigsService configsService;
	
	@Autowired
	@Qualifier("ftpsourceDao")
	private FtpDao ftpsourceDao;
	
	@Autowired
	@Qualifier("ftpService")
	private FtpResourceService ftpService;
	
	@Autowired
	private FtpProperties ftpProperties;
	
	@PostConstruct
    public void initMethod(){
        System.out.println(">>>>>>>>>initMethod start<<<<<<<<<<<");
        List<Map<String,String>> list = dao.getSparkProvince();
        for(Map<String,String> one:list){
			provinceMap.put(one.get("name").toString(), one.get("code").toString());
			provinceMap.put(one.get("code").toString(),one.get("name").toString());
		}
        System.out.println(provinceMap);
        System.out.println(">>>>>>>>>initMethod end<<<<<<<<<<<");
    }
	
	@Override
	public Page listSparkApps(int pageSize, int pageNum, String appName, Long userId, String userAppId) {
		List<Long> userIds = new ArrayList<Long>();
		userIds.add(userId);
		Map<String,Object> param = new HashMap<>();
		param.put("name", appName);
		param.put("userIds", userIds);
		param.put("userAppId", userAppId);
		Page page = new Page(pageSize, dao.countApps(param));
		page.setStartRowNum(pageSize*(pageNum-1));
		page.setEndRowNum(pageSize*pageNum);
		page.setObjCondition(param);
		List<Spark> apps = dao.listSparkApps(page);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (Spark oneApp : apps) {
			oneApp.setUpdateTime(sdf.format(oneApp.getModifyTime()));
		}
		page.setRows(apps);
		return page;
	}

	@Override
	public String checkSpark(String name) {
		// TODO Auto-generated method stub
		if(dao.checkSpark(name)){
			return MessageHelper.wrap("result", false, "msg", "该spark 应用名称已被使用！");
		};
		return MessageHelper.wrap("result", true, "msg", "该spark 应用名称还未被使用！");
	}

	@Override
	public Spark listSparkFunctions(String id) {
		// TODO Auto-generated method stub
		Spark spark = dao.findSparkById(id);
		if(spark !=null){
			spark.setResult(true);
		}
		return spark;
	}

	@Override
	public Page listSparkInstances(int pageSize, int pageNum, String id,String sparkName,String functionMark, String configVersionName,
			String status,Long userId, String userAppId) {
		List<Long> userIds = new ArrayList<Long>();
		userIds.add(userId);
		Map<String, Object> condition = new HashMap<>();
		condition.put("userIds", userIds);
		condition.put("userAppId", userAppId);
		condition.put("sparkName", sparkName);
		condition.put("sparkId", id);
		condition.put("functionMark", functionMark);
		condition.put("configVersion", configVersionName);
		condition.put("status", status);
		Page page = new Page(pageSize, dao.countAppInstances(condition));
		page.setStartRowNum(pageSize*(pageNum-1));
		page.setEndRowNum(pageSize*pageNum);
		page.setObjCondition(condition);
		List<Map<String, Object>> instances = dao.listSparkInstances(page);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (Map<String, Object> instance : instances) {
			instance.put("update", sdf.format(instance.get("updateTime")));
		}
		page.setRows(instances);
		return page;
	}

	@Override
	public String submitFunction(Map<String, Object> body) {
		String fileId=body.get("fileId").toString();
		String functionId=body.get("id").toString();
		String functionConfigs=body.get("functionConfigs").toString();
		SparkFunction function = dao.findFunctionById(functionId);
		String sparkId = function.getSparkId();
		Boolean update = (Boolean) body.get("result");
		String restartProvinces = body.get("restartProvinces").toString();
		String startProvinces =body.get("startProvinces").toString();
		String[] restartList={};
		List<String> confVerisonlist= new ArrayList();
		if(!"".equals(restartProvinces)){
			restartList=restartProvinces.split(",");//configVersionId list
			confVerisonlist=new ArrayList<String>(Arrays.asList(restartList));
		}
		String[] startList={};
		if(!"".equals(startProvinces)){
			startList=startProvinces.split(",");
			confVerisonlist.addAll(new ArrayList<String>(Arrays.asList(startList)));
		}
		if(update){
			//批量启动应用实例
			List<Map<String,Object>> list = dao.listSparkInstancesByfunctionId(functionId);
			String instanceIds="";//记录需要重启的实例
			String errorInstanceUUIDs="";//异常实例的uuid
			for(Map<String,Object> instance:list){
				String uuid=instance.get("uuid").toString();
				Object id=instance.get("id");
				String confVersionId=instance.get("conf_versionId").toString();
				List<String> listN = new ArrayList(Arrays.asList(restartList));
				if(id == null || "".equals(id)){//异常实例
					if(listN.size() !=0 && listN.contains(confVersionId)){
						errorInstanceUUIDs=errorInstanceUUIDs+uuid+",";
					}
				}else{
					if(listN.size() !=0 && listN.contains(confVersionId)){
						instanceIds=instanceIds+id+",";
					}
				}
			}
			if(!"".equals(instanceIds) && instanceIds.length() >0){
				instanceIds = instanceIds.substring(0, instanceIds.length()-1);
			}
			if(!"".equals(errorInstanceUUIDs) && errorInstanceUUIDs.length() >0){
				errorInstanceUUIDs = errorInstanceUUIDs.substring(0, errorInstanceUUIDs.length()-1);
			}
			String result ="";
			String zipPath="";
			//重启异常spark实例
			if(!"".equals(errorInstanceUUIDs)){
				this.startBatchErrorInstances(errorInstanceUUIDs);
			}
			//重启spark实例
			if(!"".equals(instanceIds)){
				result =this.restartBatch(instanceIds);
				Map<String ,Object> resultMap=JSON.parseObject(result, new TypeReference<Map<String ,Object>>(){});
				zipPath=resultMap.get("zipParentPath").toString();
			}
			//submit新实例
			List<String> startVersionIds = new ArrayList(Arrays.asList(startList));
			Spark spark = dao.findSparkById(sparkId);
			String userId = spark.getUserId()+"";
			for(String versionId:startVersionIds){
				this.submit(sparkId, zipPath, userId, functionId, versionId);
			}
		}else{
			return MessageHelper.wrap("result", false, "msg", "配置更新失败！");
		}
		return MessageHelper.wrap("result", true, "msg", "submit 成功！","id",function.getSparkId(),"functionId",functionId,"configVersionIds",confVerisonlist);
	}

	@Override
	public Map<String,Object> updateConfigs(Map<String, Object> body){
		String fileId=body.get("fileId").toString();
		String functionId=body.get("id").toString();
		String userId=body.get("userId").toString();
		String functionConfigs=body.get("functionConfigs").toString();
		SparkFunction function = dao.findFunctionById(functionId);
		int configId = function.getConfigId();
		String sparkId = function.getSparkId();

		Map<String,Object> result = new HashMap<String, Object>();
		result.put("result", false);
		String restartProvinces="";//记录需重启的spark实例配置版本
		String startProvinces="";//记录需submit的spark实例配置版本
		// 增加新配置
		Map<String,Object> configVersions=JSON.parseObject(functionConfigs, 
				new TypeReference<Map<String,Object>>(){});
		for(Map.Entry<String,Object> one:configVersions.entrySet()){
			String province=one.getKey().toString();
			Map<String,Object> provinceConfig=(Map<String,Object>)one.getValue();
			Map<String,Object> sysConfig=(Map<String,Object>)provinceConfig.get("systemParams");	
			Map<String,Object> serviceConfig=(Map<String,Object>)provinceConfig.get("serviceParams");
			Map<String,Object> configParam = new HashMap<>();
			int versionId =configDao.getVersionIdByName(configId, province);
			boolean oneNew=false;
			 //清除旧配置
			if(versionId !=0){
				// 删除配置列表
				configDao.clearConfig(versionId);
				// 删除配置
				configDao.deleteVersion(versionId);
			}else{
				oneNew=true;
			}
			SparkInstance sparkInstance = dao.findSparkInstance(sparkId,functionId,versionId);
			versionId =configDao.addConfigVersionSpark(configId, province);
			if(oneNew){
				startProvinces=startProvinces+versionId+",";
			}else{
				restartProvinces=restartProvinces+versionId+",";
			}
			configParam.put("versionId", versionId);
			List<Map<String,Object>> configs =new ArrayList<>();
			 for (Map.Entry<String,Object> sysOne : sysConfig.entrySet()) {
				 Map<String,Object> config = new HashMap<>();
				 config.put("key", "system." + sysOne.getKey());
				 config.put("value", sysOne.getValue());
				 config.put("type", "spark");
				 config.put("description", province);
				 configs.add(config);
		        }  
			 for (Map.Entry<String,Object> serviceOne : serviceConfig.entrySet()) {
				 Map<String,Object> config = new HashMap<>();
				 config.put("key", serviceOne.getKey());
				 config.put("value", serviceOne.getValue());
				 config.put("type", "spark");
				 config.put("description", province);
				 configs.add(config);
		        }  
			 configParam.put("configs", configs);
			 System.out.println(JSON.toJSONString(configParam));
			 configDao.addLines(configParam);
			if(sparkInstance!=null){
				sparkInstance.setConfVersionId(versionId);
				dao.updateSparkInstanceConfVersion(sparkInstance.getUuid(),sparkInstance.getConfVersionId());
			}
		}
		result.put("result", true);
		if(!"".equals(restartProvinces)){
			restartProvinces = restartProvinces.substring(0, restartProvinces.lastIndexOf(","));
		}
		if(!"".equals(startProvinces)){
			startProvinces=startProvinces.substring(0, startProvinces.lastIndexOf(","));
		}
		result.put("restartProvinces", restartProvinces);
		result.put("startProvinces", startProvinces);
		return result;
	
	}

	public String doDownloadAndUnzip(String resourceVersionId,String sparkId){
		//首先检测文件夹在不在，如果在，返回
		Map<String,Object>parms = ftpService.getSparkVersionInfo(resourceVersionId);
		String url = parms.get("url").toString();//ftp://admin:admin@10.127.0.1:21/sparkApp/spark.zip
		//下载包
		FtpTransferer transferer = null;
		transferer = new FtpTransferer(url);
		//首先检测文件夹是否存在
		File file = new File(transferer.getTmpDir()+File.separator+sparkId);
		if(file.isDirectory() && file.exists()){
			return file.getAbsolutePath();
		}
		boolean testResult = transferer.open();
		if (!testResult) {
			log.error("无法连接存储目标！");
			return null;
		}
		String remotePath=transferer.getResourcePath();
		String [] files = remotePath.split("/");
		String instanceId=sparkId;
		File sparkzip = transferer.download(remotePath, instanceId+File.separator+files[files.length-1]);
		String zipParentPath=sparkzip.getParentFile().getAbsolutePath();
		//解压包
		Boolean unzipR=FileUtil.unZipFile(sparkzip.getAbsolutePath(), zipParentPath);
		if(unzipR){
			return zipParentPath;
		}else{
			return null;
		}
	}

	@Override
	public String submit(String name, String existId, String description,
						 String resourceVersionId, final Long userId, Long userAppId,String sparkVersion) {
		Map<String,Object> parms = ftpService.getSparkVersionInfo(resourceVersionId);
		String url = parms.get("url").toString();//ftp://admin:admin@10.127.0.1:21/sparkApp/spark.zip
		String msg="操作正在执行";
		//下载包
		FtpTransferer transferer = null;
		transferer = new FtpTransferer(url);
		boolean testResult = transferer.open();
		if (!testResult) {
			log.error("无法连接存储目标！");
			return MessageHelper.wrap("result",false,"msg","无法连接存储目标！");
		}
		String remotePath=transferer.getResourcePath();
		String [] files = remotePath.split("/");
		boolean firstSubmit = existId == null;
		final String sparkId= firstSubmit ? UUID.randomUUID().toString() : existId;
		File sparkzip = transferer.download(remotePath, sparkId + File.separator+files[files.length-1]);
		final String zipParentPath=sparkzip.getParentFile().getAbsolutePath();
		//解压包
		Boolean unzipR=FileUtil.unZipFile(sparkzip.getAbsolutePath(), zipParentPath);
		//存应用
		if(firstSubmit){
			saveSpark(sparkId,name,description,userId,userAppId,sparkVersion);
		}
		//存配置
		List<Map<String,Object>> list = FileUtil.parsePackage(sparkzip.getAbsolutePath(),SparkService.provinceMap);
	   //存function和配置
		String saveFunctionC=saveSparkFunction(list,sparkId,resourceVersionId);
		//更新resourceVersion
		Map<String, Object> params = new HashMap<>();
		params.put("sparkId", sparkId);
		params.put("versionId", resourceVersionId);
		String result = ftpService.updateSparkVersionInfo(params);
		if(result.contains("false")){
			return MessageHelper.wrap("result",false,"msg","关联资源失败！");
		}
		if(saveFunctionC.contains("false")){
			msg=result;
		}
		//调用submit方法
		//submit(sparkId,zipParentPath,userId+"");
		return MessageHelper.wrap("result",true,"msg",msg,"id",sparkId,"name",name,"zipParentPath",zipParentPath,"userId",userId);
	}


	//提交spark应用中的所有函数，首先生成命令，然后执行，执行完毕后保存数据库，然后异步读取到applicationid时回调更新数据库
	@Override
	public void submit(String sparkId,String zipParentPath,String userId,String sparkVersion){
		Spark spark = this.listSparkFunctions(sparkId);
		List<SparkFunction> funList = spark.getFunctionList();
		List<Map<String,Object>> messages = new ArrayList<>();
		long timestamp = new Date().getTime();
		for(SparkFunction fun:funList){
			int configId = fun.getConfigId();
			List<Map<String,Object>> confVersions = configDao.getVersionList(configId);
			for(Map<String,Object> confVersion:confVersions){
				int confVersionId = Integer.parseInt(confVersion.get("id").toString());
				String message = MessageHelper.wrap("sparkId",sparkId,"userId",userId,
						"functionId",fun.getId(),"confVersionId",confVersionId,"create",true,
						"timestamp",timestamp,"sparkVersion",sparkVersion);
				Map<String,Object> map = new HashMap<>();
				map.put("id",UUID.randomUUID().toString());
				map.put("message",message);
				map.put("sparkVersion",sparkVersion);
				messages.add(map);
			}
		}
		Map<String,Object> params = new HashMap<>();
		params.put("messages",messages);
		dao.saveSparkTasks(params);
	}

	public List<String> getRemoteSubmitCommand(SparkFunction fun,
											   int configVersionId,
											   List<String> libjars,
											   List<String> binjars,
											   String submitScriptLoc,
											   String submitScript){
		Map<String,Object> confVersion = configDao.getVersionInfo(configVersionId);
		//对每一份配置都生成命令，然后提交
		int confVersionId = Integer.parseInt(confVersion.get("id").toString());
		String provinceName = (String) confVersion.get("version");
		String provinceCode = provinceMap.get(provinceName);
		Map<String, Object> param = new HashMap<>();
		param.put("versionId", confVersionId);
		param.put("keyword", "system.");
		//获取所有system参数
		List<Map<String, Object>> configDetail = configDao.getConfigList(param);
		List<String> submitCommand = new ArrayList<>();
		submitCommand.add(submitScriptLoc+submitScript);
		submitCommand.add("--class");
		submitCommand.add(fun.getFunctionName());
		String systemProp = systemProperties(configDetail);
		if(StringUtils.isNotEmpty(systemProp)){
			submitCommand.add(systemProp);
		}
		if(libjars.size()>0){
			submitCommand.add("--jars");
			submitCommand.add(org.springframework.util.StringUtils.collectionToDelimitedString(libjars,","));
		}
		submitCommand.add(org.springframework.util.StringUtils.collectionToDelimitedString(binjars,","));
		//添加省，configversionId,master地址
		submitCommand.add(fun.getFunctionMark()+"_"+provinceCode);
		submitCommand.add(confVersionId+"");
		String Config_port = ConfigUtil.configs.getProperty("server.port");
		String Config_host = System.getenv("HOST_IP");
		submitCommand.add("http://"+Config_host+":"+Config_port);
		log.error(org.springframework.util.StringUtils
				.collectionToDelimitedString(submitCommand," "));
		return submitCommand;
	}

	public List<String> getCommand(SparkFunction fun,int configVersionId,String zipParentPath){
		Map<String,Object> confVersion = configDao.getVersionInfo(configVersionId);
		//对每一份配置都生成命令，然后提交
		int confVersionId = Integer.parseInt(confVersion.get("id").toString());
		String provinceName = (String) confVersion.get("version");
		String provinceCode = provinceMap.get(provinceName);
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("versionId", confVersionId);
		param.put("keyword", "system.");
		//获取所有system参数
		List<Map<String, Object>> configDetail = configDao.getConfigList(param);
		List<String> submitCommand = new ArrayList<>();
		submitCommand.add("spark-submit");
		submitCommand.add("--class");
		submitCommand.add(fun.getFunctionName());
		String systemProp = systemProperties(configDetail);
		if(StringUtils.isNotEmpty(systemProp)){
			submitCommand.add(systemProp);
		}
		String jars = listJars(zipParentPath,"lib");
		if(StringUtils.isNotEmpty(jars)){
			submitCommand.add("--jars");
			submitCommand.add(jars);
		}
		submitCommand.add(listJars(zipParentPath,"bin"));
		//添加省，configversionId,master地址
		submitCommand.add(fun.getFunctionMark()+"_"+provinceCode);
		submitCommand.add(confVersionId+"");
		String Config_port = ConfigUtil.configs.getProperty("server.port");
		String Config_host = System.getenv("HOST_IP");
		submitCommand.add("http://"+Config_host+":"+Config_port);
		log.error(org.springframework.util.StringUtils
				.collectionToDelimitedString(submitCommand," "));
		return submitCommand;
	}

	private static String listJars(String zipParentPath,String subFolder){
		File file = new File(zipParentPath+File.separator+subFolder);
		List<String> jars = new ArrayList<>();
		if(file.exists()){
			File[] files = file.listFiles();
			if(files != null){
				for(File f:files){
					if(f.getName().endsWith(".jar")){
						jars.add(f.getAbsolutePath());
					}
				}
			}
		}
		return org.springframework.util.StringUtils
				.collectionToDelimitedString(jars,",");
	}

	private static String systemProperties(List<Map<String,Object>> configDetail){
		List<String> props = new ArrayList<>();
		for(Map<String,Object> map:configDetail){
			String key = (String) map.get("key");
			String value = (String) map.get("value");
			if(key.startsWith("system.conf_")){
				props.add(key.replaceFirst("system.conf_","--conf ")+"="+value);
			}else if(key.startsWith("system.")){
				String realKey = key.replaceFirst("system.","--");
				props.add(realKey);
				props.add(value);
			}
		}
		return org.springframework.util.StringUtils
				.collectionToDelimitedString(props," ");
	}


	
    public String saveSpark(String sparkId,String name,String description,Long userId,Long userAppId,String sparkVersion){
    	Map<String,Object> spark = new HashMap<>();
		spark.put("sparkId", sparkId);
		spark.put("name", name);
		spark.put("description", description);
		spark.put("userId", userId);
		spark.put("userAppId", userAppId);
		spark.put("sparkVersion",sparkVersion);
		return dao.saveSpark(spark);
	}
	
	
    public String saveSparkFunction(List<Map<String,Object>> list,
			String sparkId,String resourceVersionId){
		StringBuffer result = new StringBuffer();
		for(Map<String,Object> function:list){
			Boolean submit=false;
			Map<String,Object> configList = (Map<String,Object>)function.get("functionConfigs");
			Iterator<Map.Entry<String,Object>> it = configList.entrySet().iterator();
			Map<String,Object> param= new HashMap<String,Object>();
			param.put("configName",function.get("functionName"));
			param.put("description",function.get("functionName"));
			param.put("type","spark");
			param.put("userId",-1);
			param.put("appId",-1);
			int configId = configDao.addConfigSpark(param);
			while(it.hasNext()){
				submit=true;
				Entry entry = it.next();
				String province = entry.getKey().toString();
				Map<String,Object> provinceConfig= (Map<String,Object>)entry.getValue();
				Map<String,Object> sysConfig=(Map<String,Object>)provinceConfig.get("systemParams");	
				Map<String,Object> serviceConfig=(Map<String,Object>)provinceConfig.get("serviceParams");
				Map<String,Object> configParam = new HashMap<>();
				int versionId =configDao.addConfigVersionSpark(configId, province);
				configParam.put("versionId", versionId);
				List<Map<String,Object>> configs =new ArrayList<>();
				 for (Map.Entry<String,Object> one : sysConfig.entrySet()) {
					 Map<String,Object> config = new HashMap<>();
					 config.put("key","system."+ one.getKey());
					 config.put("value", one.getValue());
					 config.put("type", "spark");
					 config.put("description", province);
					 configs.add(config);
			        }  
				 for (Map.Entry<String,Object> one : serviceConfig.entrySet()) {
					 Map<String,Object> config = new HashMap<>();
					 config.put("key", one.getKey());
					 config.put("value", one.getValue());
					 config.put("type", "spark");
					 config.put("description", province);
					 configs.add(config);
			        }  
				 configParam.put("configs", configs);
				 System.out.println(JSON.toJSONString(configParam));
				 configDao.addLines(configParam);
			}
			if(!submit){
				result.append(function.get("fuctionMark")+"配置为空\r\n");
			}
			String functionId=UUID.randomUUID().toString();
			function.put("fuctionId", functionId);
			function.put("sparkId", sparkId);
			function.put("resourceVerId", resourceVersionId);
			function.put("configId", configId);
			dao.saveSparkFunction(function);
		}
		if(result.length() !=0){
			result.append("false");
		}
		return result.toString();
	}

	//支持分页查询，pageSize=8000表示不支持分页查询
	@Override
	public String listSubmitSchedule(String sparkId, String functionId,List configVersionIds,int pageSize,int pageNum) {
		pageNum=1;
		pageSize = 8000;
		Map<String, Object> condition = new HashMap<>();
		condition.put("sparkId", sparkId);
		condition.put("functionId", functionId);
		Page page = new Page(pageSize, dao.countAppInstances(condition));
		page.setStartRowNum(pageSize*(pageNum-1));
		page.setEndRowNum(pageSize*pageNum);
		page.setObjCondition(condition);
		List<Map<String, Object>> instances = dao.listSparkInstances(page);
		Map<String, Object> result = new HashMap<>();
        String sparkName="";
        Boolean updateConfig=false;
        if(configVersionIds !=null && configVersionIds.size()>0){
        	updateConfig=true;
		}
        List<Map<String, Object>> rows = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (Map<String, Object> instance : instances) {
			String confVersionId=instance.get("conf_versionId")+"";
			instance.put("update", sdf.format(instance.get("updateTime")));
			if("".equals(sparkName)){
				sparkName=instance.get("sparkName").toString();
			}
			if(updateConfig && configVersionIds.contains(confVersionId)){
				rows.add(instance);
			}else if(!updateConfig){
				rows.add(instance);
			}
		}
		result.put("id", sparkId);
		result.put("name", sparkName);
		result.put("functionList", rows);
		return JSON.toJSONString(result, SerializerFeature.WriteDateUseDateFormat);
	}

	@Override
	public void updateSparkInstance(Map<String, Object> param) {
		dao.updateSparkInstance(param);
	}

	@Override
	public void saveSparkInstance(Map<String, Object> param) {
		dao.saveSparkInstance(param);
	}


	//批量kill yarn上面运行的任务
	public String killBatch(String instanceIds) {
		String[] ids=instanceIds.split(",");
		List<String> success = new ArrayList<>();
		List<String> error = new ArrayList<>();
		for(String id:ids){
			Map<String,Object> map = putSparkStatus(id,"KILLED");
			if(map.size()==0){
				error.add(id);
			}else if(map.containsKey("state")){
				success.add(id);
			}else if(map.containsKey("RemoteException")){
				error.add(id);
			}else{
				error.add(id);
			}
		}
		return MessageHelper.wrap("result",true,"msg","停止成功！","successIds",success,"errorIds",error);
	}

	@Override
	public String restartBatch(String instanceIds) {
		String killResult = this.killBatch(instanceIds);
		Map<String,Object> map = JSON.parseObject(killResult,new TypeReference<Map<String, Object>>(){});
		List<String> successIds = (List<String>) map.get("successIds");
		List<String> errorIds = (List<String>) map.get("errorIds");
		List<String> realSuccess = new ArrayList<>();
		log.error("successId:"+successIds);
		log.error("errorIds:"+errorIds);
		Iterator<String> it = successIds.iterator();
		while(it.hasNext()){
			String id = it.next();
			SparkInstance sparkInstance = this.findSparkInstanceById(id);
			if(sparkInstance == null){
				errorIds.add(id);
				continue;
			}
			Map<String, Object> app = getSparkDetail(id,sparkInstance.getSparkVersion());
			if(Constants.SparkStatus.KILLED.equals(app.get("state"))
					|| "FINISHED".equals(app.get("state"))
					|| Constants.SparkStatus.FAILED.equals(app.get("state"))){
				this.startBatch(id);
				realSuccess.add(id);
			}else{
				errorIds.add(id);
			}
		}
		StringBuilder msg = new StringBuilder();
		if(errorIds.size()>0){
			msg.append("重启中遇到错误的应用有:"+JSON.toJSONString(getDriverNameAndVersion(errorIds)));
		}
		if(realSuccess.size()>0){
			msg.append("重启成功的应用有:"+JSON.toJSONString(getDriverNameAndVersion(realSuccess)));
		}
		return MessageHelper.wrap("result",true,"msg",msg.toString(),"zipParentPath","");
	}

	private List<String> getDriverNameAndVersion(List<String> ids){
		List<String> driverName = new ArrayList<>();
		if(ids == null){
			return driverName;
		}
		for(String id:ids){
			SparkInstance sparkInstance = this.findSparkInstanceById(id);
			if(sparkInstance != null){
				int confVersionId = sparkInstance.getConfVersionId();
				Map<String,Object> confInfo = configDao.getVersionInfo(confVersionId);
				String versionName = (String) confInfo.get("version");
				driverName.add(sparkInstance.getDriverName()+"_"+versionName);
			}
		}
		return driverName;
	}


	//提交完成后删除解压的包这个问题需要考虑升级包时的操作，随后要改成解压到固定的地方，等彻底清除这个sparkId时再删除这个解压的文件夹。
	@Override
	public String startBatch(String instanceIds) {
		String[] ids=instanceIds.split(",");
		List<Map<String,Object>> messages = new ArrayList<>();
		long timestamp = new Date().getTime();
		for(String id:ids){
			SparkInstance instance = dao.findSparkInstanceById(id);
			String sparkVersion = instance.getSparkVersion();
			String sparkId = instance.getSparkId();
			int confVersionId = instance.getConfVersionId();
			String functionId = instance.getFunctionId();
			SparkFunction fun = dao.findFunctionById(functionId);
			if(instance !=null){
				Map<String, Object> app = getSparkDetail(id,sparkVersion);
				String status = app.get("state").toString();
				if(Constants.SparkStatus.KILLED.equals(status) ||
						"FINISHED".equals(app.get("state"))
						|| Constants.SparkStatus.FAILED.equals(app.get("state"))){
					String message = MessageHelper.wrap("sparkId",sparkId,"userId",-1,
							"functionId",fun.getId(),"confVersionId",confVersionId,
							"create",false,"timestamp",timestamp,"sparkVersion",sparkVersion);
					Map<String,Object> map = new HashMap<>();
					map.put("id",UUID.randomUUID().toString());
					map.put("message",message);
					map.put("sparkVersion",sparkVersion);
					messages.add(map);
				}
			}
		}
		//保存任务队列
		Map<String,Object> params = new HashMap<>();
		params.put("messages",messages);
		dao.saveSparkTasks(params);
		return MessageHelper.wrap("result",true,"msg","正在启动");
	}
	
	//获取spark应用详情
	public Map<String,Object> getSparkDetail(String id,String sparkVersion){
		Map<String, Object> spark= new HashMap<>();
		try {
			WebTarget webTarget = null;
			if(sparkVersion.equals("1.6")){
				webTarget = yarnClient.getWebResource();
			}else if(sparkVersion.equals("2.1")){
				webTarget = yarnClient.getWebResource2();
			}
			String result = webTarget.path("/ws/v1/cluster/apps/").path(id).
					request().get(String.class);
			Map<String, Object> map =JSON.parseObject(result, new TypeReference<Map<String, Object>>(){});
			Map<String, Object> app = (Map<String, Object>)map.get("app");
			spark.putAll(app);
		} catch (Exception e) {
			log.error("请求应用详情出错",e);
		}
		return spark;
	}

	public Map<String,Object> putSparkStatus(String id,String op){
		SparkInstance instance = this.findSparkInstanceById(id);
		if(instance==null){
			return Collections.EMPTY_MAP;
		}
		WebTarget webTarget = null;
		if(instance.getSparkVersion().equals("1.6")){
			webTarget = yarnClient.getWebResource();
		}else if(instance.getSparkVersion().equals("2.1")){
			webTarget = yarnClient.getWebResource2();
		}
		Map<String, Object> map= new HashMap<>();
		try {
			Map<String, Object> param= new HashMap<>();
			param.put("state", op);
			String result = webTarget.path("/ws/v1/cluster/apps/").path(id).path("/state").
					request().put(Entity.entity(JSON.toJSONString(param), MediaType.APPLICATION_JSON), String.class);
			map =JSON.parseObject(result, new TypeReference<Map<String, Object>>(){});
		} catch (Exception e) {
			log.error("请求应用详情出错",e);
		}
		return map;
	}
		
	//获取sparks应用详情
	public List<Map<String,Object>> getSparksDetail(String sparkVersion){
		try {
			WebTarget webTarget = null;
			if(sparkVersion.equals("1.6")){
				webTarget = yarnClient.getWebResource();
			}else if(sparkVersion.equals("2.1")){
				webTarget = yarnClient.getWebResource2();
			}
			log.error("开始请求spark应用状态");
			String result = webTarget.path("/ws/v1/cluster/apps").request().get(String.class);
			log.error("请求spark应用状态正常结束");
			Map<String, Object> map =JSON.parseObject(result, new TypeReference<Map<String, Object>>(){});
			Map<String, Object> apps = (Map<String, Object>)map.get("apps");
			List<Map<String,Object>> app = (List<Map<String,Object>>)apps.get("app");
			return app;
		} catch (Exception e) {
			log.error("请求应用详情出错",e);
			log.error("请求spark应用状态异常："+e.getMessage());
		}
		return Collections.EMPTY_LIST;
	}


	@Override
	public SparkInstance findSparkInstanceById(String id) {
		// TODO Auto-generated method stub
		return dao.findSparkInstanceById(id);
	}

	@Override
	public String getProvince() {
		// TODO Auto-generated method stub
		List<Map<String,String>> list = dao.getSparkProvince();
		if(list ==null){
			list=new ArrayList<>();
		}
		return JSON.toJSONString(list);
	}

	@Override
	public String upgradeSpark(String id, String fileid, String type,Long userId,Long userAppId,String sparkVersion) {
		List<String> ins = new ArrayList<>();
		List<String> errorInsUUID = new ArrayList<>();
		Spark spark = this.listSparkFunctions(id);
		userId=Long.valueOf(spark.getUserId()+"");
		String name = spark.getName();
		List<SparkFunction> functions = spark.getFunctionList();
		String resourceVersionId = null;
		for(SparkFunction function:functions){
			resourceVersionId = function.getResourceVerId();
			List<Map<String, Object>> sparkInstances = dao.listSparkInstancesByfunctionId(function.getId());
			for(Map<String,Object> map:sparkInstances){
				Object instanceId=map.get("id");
				//如果实例有applicationId
				if(instanceId !=null && !"".equals(instanceId)){
					ins.add(instanceId.toString());
				}else{
					errorInsUUID.add(map.get("uuid").toString());
				}
			}
		}
		log.error("需要kill的ins:"+ins);
		if(ins.size()>0){
			String result = this.killBatch(org.springframework.util.StringUtils
					.collectionToDelimitedString(ins,","));
			log.error(result);
		}
		if("increment".equals(type)){
			if(errorInsUUID.size() >0){
				this.startBatchErrorInstances(org.springframework.util.StringUtils
						.collectionToDelimitedString(errorInsUUID,","));
			}
			if(ins.size()>0){
				this.startBatch(org.springframework.util.StringUtils
						.collectionToDelimitedString(ins,","));
			}
			return MessageHelper.wrap("result",true,"msg","操作正在执行");
		}else if("full".equals(type)){
			//删除funlist 配置，sparkInstance，然后重新submit一次
			for(SparkFunction function:functions){
				int confId = function.getConfigId();
				String funId = function.getId();
				dao.deleteSparkInstanceByFunId(funId);
				configsService.delConfig(confId);
				dao.deleteSparkFun(funId);
			}
			String s = this.submit(name,spark.getId(),spark.getDescription(),resourceVersionId,userId,userAppId,sparkVersion);
			Map<String,Object> map = JSON.parseObject(s,new TypeReference<Map<String, Object>>(){});
			if(map.get("result")!=null && (boolean)map.get("result")){
				return s;
			}
			return MessageHelper.wrap("result",false,"msg","submit失败");
		}
		return MessageHelper.wrap("result",true,"msg","操作正在执行");
	}
	@Override
	public Response downloadSpark(String sparkId) {
		// TODO Auto-generated method stub
		Spark s = dao.findSparkById(sparkId);
		String finalName = s.getName()+".zip";
		List<SparkFunction> functions = dao.listSparkFunction(sparkId);
		String resVersionId=functions.get(0).getResourceVerId();
		Map<String,Object> parms = ftpService.getSparkVersionInfo(resVersionId);
		String url = parms.get("url").toString();//ftp://admin:admin@10.127.0.1:21/sparkApp/spark.zip
		//下载包
		FtpTransferer transferer = null;
		try {
			transferer = new FtpTransferer(url);
			boolean testResult = transferer.open();
			if (!testResult) {
				log.error("无法连接存储目标！");
				return null;
			}
			String remotePath=transferer.getResourcePath();
			String [] files = remotePath.split("/");
			String instanceId="download"+File.separator+sparkId;
			File instanceFile = new File(instanceId);
			if(instanceFile.exists()){
				FileUtil.delDirectory(instanceFile);
			}
			File file = transferer.download(remotePath, instanceId+File.separator+files[files.length-1]);
			String zipParentPath=file.getParentFile().getAbsolutePath();
//			//解压包
			Boolean unzipR=FileUtil.unZipFile(file.getAbsolutePath(), zipParentPath);
			if(unzipR){
				//functions写配置
				if(file == null || !file.exists()) {
					throw new FileNotFoundException("获取资源包失败，资源包文件丢失！");
				}
				FileUtil.delFile(file);
				String writeFunction="";
				for(SparkFunction function:functions){
					String functionMark = function.getFunctionMark();
					String functionName = function.getFunctionName();
					String functionDescription = function.getDescription();
					writeFunction =writeFunction+functionMark+" "+functionName+" "+functionDescription+"\n";
					int configId=function.getConfigId();
					Map configInfo = configDao.getConfigInfo(configId);
					List<Map<String,Object>> versions = configDao.getVersions(configId);
					for(Map<String,Object> version:versions){
						//写example_510000.properties
						String configContent="";
						String province = version.get("version").toString();
						String provinceCode=provinceMap.get(province).toString();
						int versionId= (Integer) version.get("id");
						version.put("versionId", versionId);
						List<Map<String,Object>> configList =configDao.getConfigList(version);
						for(Map<String,Object> config:configList){
							String key= config.get("key").toString();
							String value= config.get("value").toString();
							String description=config.get("description").toString();
							configContent =configContent+key+"="+value+"\n";
						}
						FileUtil.writeFile(zipParentPath+File.separator+"config", configContent, functionMark+"_"+provinceCode+".properties");
					}
				}
				//写function_list.properties
				FileUtil.writeFile(zipParentPath+File.separator+"config", writeFunction, "function_list.properties");
				FileUtil.zipFile(file.getAbsolutePath(), zipParentPath);
			}
			String fileName = URLEncoder.encode(file.getName(), "UTF-8");
			ResponseBuilder rb = Response.ok(file, MediaType.APPLICATION_OCTET_STREAM);
			rb.header("Content-Disposition", "attachment; filename="
					+ finalName);
			rb.header("fileName", finalName);
			return rb.build();
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if(transferer !=null){
				transferer.close();
			}
		}
		return null;
	}
	public boolean deleteTmpFile(String resourceVersionId,String sparkId){
		//删除包，重新下载解压
		Map<String,Object> parms = ftpService.getSparkVersionInfo(resourceVersionId);
		String url = parms.get("url").toString();//ftp://admin:admin@10.127.0.1:21/sparkApp/spark.zip
		//下载包
		FtpTransferer transferer = null;
		transferer = new FtpTransferer(url);
		//首先检测文件夹是否存在
		File file = new File(transferer.getTmpDir()+File.separator+sparkId);
		if(file.exists()){
//			file.delete();
			FileUtil.delFile(file);
		}
		return true;
	}
	//提交spark应用新实例
	private void submit(String sparkId,String zipParentPath,String userId,String functionId,String versionId){
		Spark spark = this.listSparkFunctions(sparkId);
		SparkFunction fun = dao.findFunctionById(functionId);
		//重新下载zip
		if("".equals(zipParentPath)){
			zipParentPath = doDownloadAndUnzip(fun.getResourceVerId(),sparkId);
		}
		int configId = fun.getConfigId();
		List<Map<String,Object>> confVersions = configDao.getVersionList(configId);
		int confVersionId = Integer.parseInt(versionId);
		List<Map<String,Object>> messages = new ArrayList<>();
		String message = MessageHelper.wrap("sparkId",sparkId,"userId",userId,
				"functionId",fun.getId(),"confVersionId",confVersionId,"create",true,"sparkVersion",spark.getSparkVersion());
		Map<String,Object> map = new HashMap<>();
		map.put("id",UUID.randomUUID().toString());
		map.put("message",message);
		map.put("sparkVersion",spark.getSparkVersion());
		messages.add(map);
		Map<String,Object> params = new HashMap<>();
		params.put("messages",messages);
		dao.saveSparkTasks(params);
	}

	@Override
	public String checkSparkInstances(String sparkName, String functionMark) {
			Map<String, Object> condition = new HashMap<>();
			condition.put("sparkName", sparkName);
			condition.put("functionMark", functionMark);
			Page page = new Page(500, dao.countAppInstances(condition));
			page.setStartRowNum(500*(1-1));
			page.setEndRowNum(500*1);
			page.setObjCondition(condition);
			List<Map<String, Object>> instances = dao.listSparkInstances(page);
			String errorInstances="";
			for (Map<String, Object> instance : instances) {
				Object id = instance.get("id");
				String sparkname = instance.get("sparkName").toString();
				String functionmark = instance.get("functionMark").toString();
				if(functionMark ==null){
					if(sparkName.equals(sparkname) && (id==null || "".equals((String)id))){
						errorInstances=errorInstances+instance.get("sparkName")+"-"+
								instance.get("functionMark")+"-"+instance.get("configVersion")+"\n";
					}
				}else{
					if(sparkname.equals(sparkName) && functionmark.equals(functionMark) && (id==null || "".equals((String)id))){
						errorInstances=errorInstances+instance.get("sparkName")+"-"+
								instance.get("functionMark")+"-"+instance.get("configVersion")+"\n";
					}
				}
			}
			Map<String,Object> result= new HashMap<String,Object>();
			if(!"".equals(errorInstances)){
				result.put("result", false);
				result.put("msg", "存在异常spark实例,请先处理异常实例：【"+errorInstances+"】");
			}else{
				result.put("result", true);
				result.put("msg", "success");
			}
		return JSON.toJSONString(result);
	}

	@Override
	public void deleteSparkTasks(List<String> ids) {
		// TODO Auto-generated method stub
		dao.deleteSparkTasks(ids);
	}

	@Override
	public void saveSparkTasks(Map<String, Object> messages) {
		// TODO Auto-generated method stub
		dao.saveSparkTasks(messages);
	}

	@Override
	public List<Map<String, Object>> getSparkTasks(int maxCount,String sparkVersion) {
		return dao.getSparkTasks(maxCount,sparkVersion);
	}

	@Override
	public SparkFunction findFunctionById(String functionId) {
		return dao.findFunctionById(functionId);
	}

	@Override
	public List<Map<String, Object>> listAllSparkInstanceInApp(long userAppId) {
		return dao.listAllSparkInstanceInApp(userAppId);
	}

	@Override
	public String findUserAppNameById(long userAppId) {
		return dao.findUserAppNameById(userAppId);
	}

	@Override
	public SparkInstance findSparkInstanceByUUId(String id) {
		// TODO Auto-generated method stub
		return dao.findSparkInstanceByUUId(id);
	}

	@Override
	public String startBatchErrorInstances(String uuids) {
		if(uuids !=null && !"".equals(uuids)){
			String[] uuidList = uuids.split(",");
			for(String uuid : uuidList){
			   SparkInstance sparkInstance =dao.findSparkInstanceByUUId(uuid);
			   if(sparkInstance.getId() ==null || "".equals(sparkInstance.getId())){
				   List<Map<String,Object>> messages = new ArrayList<>();
					String message = MessageHelper.wrap(
							"sparkId",sparkInstance.getSparkId(),
							"userId",sparkInstance.getUserId(),
							"functionId",sparkInstance.getFunctionId(),
							"confVersionId",sparkInstance.getConfVersionId(),
							"create",false,
							"sparkVersion",sparkInstance.getSparkVersion());
					Map<String,Object> map = new HashMap<>();
					map.put("id",UUID.randomUUID().toString());
					map.put("message",message);
				   	map.put("sparkVersion",sparkInstance.getSparkVersion());
					messages.add(map);
					Map<String,Object> params = new HashMap<>();
					params.put("messages",messages);
					dao.saveSparkTasks(params);
			   }
			}
		}
		return null;
	}

}
