package com.dc.appengine.ws.server;

import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.dc.appengine.ConfigUtil;
import com.dc.appengine.entity.Page;
import com.dc.appengine.entity.Spark;
import com.dc.appengine.entity.SparkInstance;
import com.dc.appengine.service.ISparkService;
import com.dc.appengine.service.impl.FtpResourceService;
import com.dc.appengine.service.impl.SparkService;
import com.dc.appengine.util.FileUtil;
import com.dc.appengine.util.FileWorker;
import com.dc.appengine.util.MD5Util;
import com.dc.appengine.util.MessageHelper;

@Path("spark")
public class SparkRestService {
	private static final Logger log = LoggerFactory.getLogger(SparkRestService.class);
	
	@Autowired
	@Qualifier("sparkService")
	private ISparkService sparkService;
	
	@Autowired
	@Qualifier("ftpService")
	private FtpResourceService ftpService;
	
	@GET
	@Path("hello")
	public String hello(){
		return "hello,see you again.";
	}
	
	@POST
	@Path("uploadSpark")
	public String uploadSpark(@FormDataParam("file") InputStream fileInputStream,
							  @FormDataParam("file") FormDataContentDisposition disposition){
		String tmpid= FileWorker.getInstance().uploadFileForNextOp(fileInputStream, disposition.getFileName());
		Map<String,Object> result= new HashMap<String,Object>();
		if(StringUtils.isEmpty(tmpid)){
			result.put("result",false);
			result.put("msg","upload file error:file not found");
			return JSON.toJSONString(result);
		}else{
			//上传成功，首先解析，然后上传到ftp，并insert到数据库中
			//解析包...
			List list = FileUtil.parsePackage(FileWorker.getInstance().workDir+"/"+tmpid+"/"+disposition.getFileName(),
					SparkService.provinceMap);
			if(list == null){
				result.put("result",false);
				result.put("msg","parse file error");
				return JSON.toJSONString(result);
			}else if(list.size() == 0){
				result.put("result",false);
				result.put("msg","未解析出函数列表");
				return JSON.toJSONString(result);
			}else if(list.size()==2 && list.get(0).equals(Boolean.TRUE)){
				result.put("result",false);
				result.put("msg",list.get(1));
				return JSON.toJSONString(result);
			}
			result.put("functionList",list);
			//上传ftp并注册
			String uploadResult = uploadSparkAppToFtp(tmpid);
			Map<String,Object> map = JSON.parseObject(uploadResult,new TypeReference<Map<String, Object>>(){});
			boolean success = (boolean) map.get("result");
			if(success){
				result.put("resourceVerisonId",map.get("versionId").toString());
				result.put("result",true);
			}else{
				//-1为上传失败，有可能解析成功，上传失败，上传失败本地包也会被删除
				result.put("resourceVerisonId","-1");
				result.put("result",false);
			}
		}
		return JSON.toJSONString(result);
	}
	
	private String uploadSparkAppToFtp(String tmpid){
		Map<String,Object> result = new HashMap<>();
		String fileName = FileWorker.getInstance().getWorkSource(tmpid);
		if(StringUtils.isEmpty(fileName)){
			result.put("result",false);
			result.put("message","file not found");
			return JSON.toJSONString(result);
		}else{
			String uuid = UUID.randomUUID().toString();
			String remotePath = "/"+uuid+"/"+fileName;
			//计算MD5值，保存在数据库当中
			String workRoot = ConfigUtil.configs.getProperty("workPath");
			File workDir = new File(workRoot + "/" + tmpid);
			if (!workDir.exists() || !workDir.isDirectory()) {
				log.error("work dir is not found");
				result.put("result",false);
				result.put("message","file not found");
				return JSON.toJSONString(result);
			}
			File[] files = workDir.listFiles();
			String md5 = null;
			try {
				md5 = MD5Util.md5(files[0]);
			} catch (Exception e) {
				e.printStackTrace();
				log.error("md5 error");
				result.put("result",false);
				result.put("message","md5 error");
				return JSON.toJSONString(result);
			}
			//上传完毕后会删除
			boolean success = ftpService.uploadResource(tmpid,remotePath);
			if(success){
				Map<String,Object> param = new HashMap<>();
				String id = UUID.randomUUID().toString();
				param.put("id",id);
				param.put("packagePath",remotePath);
				param.put("md5",md5);
				String existId = ftpService.queryByPackagePath(remotePath);
				if(StringUtils.isEmpty(existId)){
					ftpService.saveSparkPackage(param);
					result.put("versionId",id);
				}else{
					result.put("versionId",existId);
				}
				result.put("result",true);
				result.put("message","upload success,local file is deleted.");
			}else{
				result.put("result",false);
				result.put("message","upload failed!");
			}

		}
		return JSON.toJSONString(result);
	}
	
	@POST
	@Path("upgradeSpark")
	public String upgradeSpark(@Context HttpServletRequest request,String body){
		try {
			Map<String,Object> map=JSON.parseObject(body, new TypeReference<Map<String,Object>>(){});
			if(map.get("fileid")==null){
				return MessageHelper.wrap("result",false,"msg","应用发布失败,未找到上传文件！");
			}
			String fileid=map.get("fileid").toString();
			String id=map.get("id").toString();
			String type=map.get("type").toString();
			//上传ftp
			String resultUpload = uploadSparkPatch(id,fileid,type);
			if(!resultUpload.contains("true")){
				return resultUpload;
			}
			//升级
			Spark spark = sparkService.listSparkFunctions(id);
			String result= sparkService.upgradeSpark(id,fileid,type,1L,1L,spark.getSparkVersion());
			return result;
		} catch (Exception e) {
			return MessageHelper.wrap("result",false,"msg","应用发布失败！");
		}
	}
	
	private String uploadSparkPatch(String sparkId,String tmpid,String type){
		Map<String,Object> result = new HashMap<>();
		try {
			String fileName = FileWorker.getInstance().getWorkSource(tmpid);
			if(StringUtils.isEmpty(fileName)){
				result.put("result",false);
				result.put("msg","file not found");
			}else{
				//上传完毕后会删除
				String upload = ftpService.uploadResource(sparkId,tmpid,type);
				return upload;
			}
		} catch (Exception e) {
			// TODO: handle exception
			log.error(e.getMessage(),e);
			result.put("result",false);
			result.put("msg","upload failed!");
		}
		return JSON.toJSONString(result);
	}
	
	@GET
	@Path("checkSpark")
	public String checkSpark(@QueryParam("name") String name) {
		if (log.isDebugEnabled()) {
			log.debug("receive check spark name  request: name=" + name);
		}
		try {
			String result= sparkService.checkSpark(name);
			return result;
		} catch (Exception e) {
			log.error("failed to check spark name", e);
			return MessageHelper.wrap("result", false, "msg", "spark 应用名称 校验失败！");
		}
	}

	@GET
	@Path("listSparkApps")
	public String listSparkApps(@QueryParam("pageSize") int pageSize, @QueryParam("pageNum") int pageNum,
			@QueryParam("keyword") String keyword, @QueryParam("userId") Long userId,@QueryParam("userAppId") String userAppId) {
		if (log.isDebugEnabled()) {
			log.debug("receive querying spark application request: keyword=" + keyword + ", pageNum=" + pageNum
					+ ", pageSize=" + pageSize + ", userId=" + userId+ ", userAppId=" + userAppId);
		}

		try {
			Page page = sparkService.listSparkApps(pageSize, pageNum, keyword, userId,userAppId);
			return JSON.toJSONString(page);
		} catch (Exception e) {
			log.error("failed to query operation application", e);
			return MessageHelper.wrap("total", 0, "rows", null);
		}
	}
	
	@GET
	@Path("listSparkFunctions")
	public String listSparkFunctions(@QueryParam("id") String id) {
		if (log.isDebugEnabled()) {
			log.debug("receive querying spark functions request: id=" + id);
		}

		try {
			Spark result = sparkService.listSparkFunctions(id);
			return JSON.toJSONString(result);
		} catch (Exception e) {
			log.error("failed to querying spark functions", e);
			return MessageHelper.wrap("result", false, "msg", "获取spark function list 失败！");
		}
	}
	
	@GET
	@Path("listSparkInstances")
	public String listSparkInstances(@QueryParam("pageSize") int pageSize, @QueryParam("pageNum") int pageNum,
			@QueryParam("id") String id, @QueryParam("functionMark") String functionMark,
			@QueryParam("sparkName") String sparkName,@QueryParam("userId") Long userId,@QueryParam("userAppId") String userAppId,
			@QueryParam("configVersionName") String configVersionName,@QueryParam("status") String status) {
		if (log.isDebugEnabled()) {
			log.debug("receive querying spark instances request: id=" + id + ", functionMark=" + functionMark+ ", configVersionName=" 
		+ configVersionName+", status=" + status+" , pageNum=" + pageNum+ ", pageSize=" + pageSize );
		}

		try {
			Page page = sparkService.listSparkInstances(pageSize, pageNum, id, sparkName,functionMark,configVersionName,status
					,userId,userAppId);
			return JSON.toJSONString(page);
		} catch (Exception e) {
			log.error("failed to query spark instances", e);
			return MessageHelper.wrap("total", 0, "rows", null);
		}
	}
	
	@POST
	@Path("submitFunction")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String submitFunction(String body) {
		if (log.isDebugEnabled()) {
			log.debug("receive querying to submit spark function request: body=" + JSON.toJSONString(body));
		}
		try {
			//map中的userId可能不是spark应用创建者，升级时，以spark应用创建者作为spark实例的操作用户
			Map<String,Object> map=JSON.parseObject(body, new TypeReference<Map<String,Object>>(){});
			Map updateR = sparkService.updateConfigs(map);
			updateR.putAll(map);
			String result = sparkService.submitFunction(updateR);
			return result;
		} catch (Exception e) {
			log.error("failed to to submit spark function", e);
			return MessageHelper.wrap("result", false, "msg", "submit spark function 失败！");
		}
	}
	
	@POST
	@Path("submit")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String submit(@FormParam("name") String name,@FormParam("description") String description,
			@FormParam("resourceVerisonId") String resourceVerisonId,@FormParam("userId") Long userId,
			@FormParam("userAppId") Long userAppId,@FormParam("sparkVersion") String sparkVersion) {
		if (log.isDebugEnabled()) {
			log.debug("receive querying to submit spark request: name=" + name+" description="+description
					+" resourceVerisonId"+resourceVerisonId);
		}
		try {
			String result = sparkService.submit(name,null,description,resourceVerisonId,userId,userAppId,sparkVersion);
			Map<String,Object> map = JSON.parseObject(result,new TypeReference<Map<String, Object>>(){});
			if((boolean)map.get("result")){
				String sparkId = (String) map.get("id");
				String zipParentPath = (String) map.get("zipParentPath");
				sparkService.submit(sparkId,zipParentPath,userId+"",sparkVersion);
			}
			return result;
		} catch (Exception e) {
			log.error("failed to to submit spark function", e);
			return MessageHelper.wrap("result", false, "msg", "submit spark function 失败！");
		}
	}
	@GET
	@Path("listSubmitSchedule")
	public String listSubmitSchedule(@QueryParam("sparkId") String sparkId,
			@QueryParam("functionId") String functionId,@QueryParam("configVersionIds") String configVersionIds,@QueryParam("pageSize") @DefaultValue("10") int pageSize, 
			@QueryParam("pageNum") @DefaultValue("1") int pageNum){
		if (log.isDebugEnabled()) {
			log.debug("receive querying to get  spark submit schedule: sparkId=" + sparkId+
					" functionId="+functionId+" configVersionIds="+configVersionIds);
		}
		try {
			List<String> confVersinIdlist=null;
			if(configVersionIds !=null){
				confVersinIdlist=JSON.parseObject(configVersionIds, new TypeReference<List<String>>(){});
			}
			// TODO Auto-generated method stub
			String result = sparkService.listSubmitSchedule(sparkId,functionId,confVersinIdlist,pageSize,pageNum);
			return result;
		} catch (Exception e) {
			log.error("failed to to submit spark function", e);
			return MessageHelper.wrap("result", false, "msg", "submit spark function 失败！");
		}
	}
	
	@POST
	@Path("startBatch")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String startBatch(@FormParam("instanceIds") String instanceIds) {
		if (log.isDebugEnabled()) {
			log.debug("receive querying to  batch start spark request: sparkInstanceIds=" + instanceIds);
		}
		try {
			String sparkInstanceIds="";
			String errorSparkUUIDs="";
			String[] uuids =  instanceIds.split(",");
			for(String uuid:uuids){
				 SparkInstance  sparkInstance = sparkService.findSparkInstanceByUUId(uuid);
				 if(sparkInstance.getId() != null && !"".equals(sparkInstance.getId())){
					 sparkInstanceIds = sparkInstanceIds +sparkInstance.getId()+",";
				 }else{
					 errorSparkUUIDs = errorSparkUUIDs + uuid+",";
				 }
			}
			String result = MessageHelper.wrap("result", true, "msg", "batch start spark 成功！");
			if(!"".equals(errorSparkUUIDs) && errorSparkUUIDs.length() >0){
				sparkService.startBatchErrorInstances(errorSparkUUIDs.substring(0, errorSparkUUIDs.length()-1));
			}
			if(!"".equals(sparkInstanceIds) && sparkInstanceIds.length() >0){
				result =  sparkService.startBatch(sparkInstanceIds.substring(0, sparkInstanceIds.length()-1));
			}
			return result;
		} catch (Exception e) {
			log.error("failed to to batch submit spark", e);
			return MessageHelper.wrap("result", false, "msg", "batch start spark 失败！");
		}
	}
	
	@POST
	@Path("killBatch")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String killBatch(@FormParam("instanceIds") String instanceIds) {
		if (log.isDebugEnabled()) {
			log.debug("receive querying to  batch kill spark request: instanceIds=" + instanceIds);
		}
		try {
			if("".equals(instanceIds) || instanceIds ==null){
				return MessageHelper.wrap("result", false, "msg", "所选应用为空，请选择应用，再停止！");
			}
			String sparkInstanceIds="";
			String errorSparkUUIDs="";
			String[] uuids =  instanceIds.split(",");
			for(String uuid:uuids){
				 SparkInstance  sparkInstance = sparkService.findSparkInstanceByUUId(uuid);
				 if(sparkInstance.getId() != null && !"".equals(sparkInstance.getId())){
					 sparkInstanceIds = sparkInstanceIds +sparkInstance.getId()+",";
				 }else{
					 errorSparkUUIDs = errorSparkUUIDs + uuid+",";
				 }
			}
			String result = MessageHelper.wrap("result", true, "msg", "batch kill spark 成功！");
			if(!"".equals(errorSparkUUIDs) && errorSparkUUIDs.length() >0){//异常实例（id为空的实例）不用停止

			}
			if(!"".equals(sparkInstanceIds) && sparkInstanceIds.length() >0){
				result =  sparkService.killBatch(sparkInstanceIds.substring(0, sparkInstanceIds.length()-1));
			}
			return result;
		} catch (Exception e) {
			log.error("failed to to batch kill spark", e);
			return MessageHelper.wrap("result", false, "msg", "batch kill spark 失败！");
		}
	}
	
	@POST
	@Path("restartBatch")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String restartBatch(@FormParam("instanceIds") String instanceIds) {
		if (log.isDebugEnabled()) {
			log.debug("receive querying to  batch start spark request: instanceIds=" + instanceIds);
		}
		try {
			String sparkInstanceIds="";
			String errorSparkUUIDs="";
			String[] uuids =  instanceIds.split(",");
			for(String uuid:uuids){
				 SparkInstance  sparkInstance = sparkService.findSparkInstanceByUUId(uuid);
				 if(sparkInstance.getId() != null && !"".equals(sparkInstance.getId())){
					 sparkInstanceIds = sparkInstanceIds +sparkInstance.getId()+",";
				 }else{
					 errorSparkUUIDs = errorSparkUUIDs + uuid+",";
				 }
			}
			String result = MessageHelper.wrap("result", true, "msg", "batch restart spark 成功！");
			if(!"".equals(errorSparkUUIDs) && errorSparkUUIDs.length() >0){//异常实例（id为空的实例）直接启动
				sparkService.startBatchErrorInstances(errorSparkUUIDs.substring(0, errorSparkUUIDs.length()-1));
			}
			if(!"".equals(sparkInstanceIds) && sparkInstanceIds.length() >0){
				result =  sparkService.restartBatch(sparkInstanceIds.substring(0, sparkInstanceIds.length()-1));
			}
			return result;
		} catch (Exception e) {
			log.error("failed to to batch resubmit spark", e);
			return MessageHelper.wrap("result", false, "msg", "batch restart spark 失败！");
		}
	}
	
	@GET
	@Path("getProvince")
	public String getProvince(){
		try {
			// TODO Auto-generated method stub
			String result = sparkService.getProvince();
			return result;
		} catch (Exception e) {
			log.error("failed to to submit spark function", e);
			return MessageHelper.wrap("result", false, "msg", "submit spark function 失败！");
		}
	}
	
	@POST
	@Path("upgradeSpark")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String upgradeSpark(@FormParam("id") String id,
							   @FormParam("fileid") String fileid,
							   @FormParam("type") String type,
							   @FormParam("userId") String userId,
							   @FormParam("userAppId") String userAppId) {
		if (log.isDebugEnabled()) {
			log.debug("receive querying to  upgrade spark request: id=" + id+" fileid="+fileid+" type"+type);
		}
		Spark spark = sparkService.listSparkFunctions(id);
		try {
			String result = sparkService.upgradeSpark(id,fileid,type,Long.valueOf(userId),Long.valueOf(userAppId),spark.getSparkVersion());
			if(type.equals("full")){
				Map<String,Object> map = JSON.parseObject(result,new TypeReference<Map<String, Object>>(){});
				if(map.containsKey("result") && (boolean)map.get("result")){
					String sparkId = (String) map.get("id");
					String zipParentPath = (String) map.get("zipParentPath");
					userId = map.get("userId")+"";
					sparkService.submit(sparkId,zipParentPath,userId+"",spark.getSparkVersion());
				}
			}
			return result;
		} catch (Exception e) {
			log.error("failed to to upgrade spark request", e);
			return MessageHelper.wrap("result", false, "msg", "upgrade spark request 失败！");
		}
	}
	
	@POST
	@Path("downloadSpark")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response downloadSpark(@QueryParam("sparkId") String sparkId) throws Exception {
		Response s = sparkService.downloadSpark(sparkId);
		if(s == null) {
			if(log.isDebugEnabled()){
				log.debug("返回消息：获取资源包失败！资源sparkId：" + sparkId);
			}
			return null;
		} else {
			if(log.isDebugEnabled()){
				log.debug("返回消息：获取资源包成功！资源sparkId：" + sparkId);
			}
		}
		return s;
	}
	
	@GET
	@Path("checkSparkInstances")
	public String checkSparkInstances(@QueryParam("functionMark") String functionMark,
			@QueryParam("sparkName") String sparkName){
		try {
			// TODO Auto-generated method stub
			String result = sparkService.checkSparkInstances(sparkName, functionMark);
			return result;
		} catch (Exception e) {
			log.error("failed to to submit spark function", e);
			return MessageHelper.wrap("result", false, "msg", "检测spark实例失败！");
		}
	}
}