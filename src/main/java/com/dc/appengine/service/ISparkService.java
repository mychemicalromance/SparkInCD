package com.dc.appengine.service;

import java.util.List;
import java.util.Map;

import javax.ws.rs.core.Response;
import com.dc.appengine.entity.Page;
import com.dc.appengine.entity.Spark;
import com.dc.appengine.entity.SparkFunction;
import com.dc.appengine.entity.SparkInstance;

public interface ISparkService {
	
	Page listSparkApps(int pageSize,int pageNum,String appName,Long userId,String userAppId);
	String checkSpark(String name);
	Spark listSparkFunctions(String id);
	Page listSparkInstances(int pageSize, int pageNum, String id, String sparkName, String functionMark, String configVersionName,
			String status,Long userId,String userAppId);
	String submitFunction(Map<String, Object> body);
	Map<String,Object> updateConfigs(Map<String, Object> body);
	String submit(String name, String existId, String description,
				  String resourceVerisonId, Long userId,Long userAppId,String sparkVersion);
	String listSubmitSchedule(String sparkId, String functionId,List configVersionIdsint,int pageSize,int pageNum);
	void updateSparkInstance(Map<String,Object> param);
	void saveSparkInstance(Map<String,Object> param);
	String killBatch(String instanceIds);
	String restartBatch(String instanceIds);
	String startBatch(String instanceIds);
	public SparkInstance findSparkInstanceById(String id);
	String getProvince();
	String upgradeSpark(String id, String fileid, String type,Long userId,Long appUserId,String sparkVersion);
	Response downloadSpark(String sparkId);
	String checkSparkInstances( String sparkName, String functionMark);
	void submit(String sparkId,String zipParentPath,String userId,String sparkVersion);
	void deleteSparkTasks(List<String> ids);
	void saveSparkTasks(Map<String,Object> messages);
	List<Map<String,Object>> getSparkTasks(int maxCount,String sparkVersion);
	SparkFunction findFunctionById(String functionId);
	List<Map<String, Object>> listAllSparkInstanceInApp(long userAppId);

	String findUserAppNameById(long userAppId);
	public SparkInstance findSparkInstanceByUUId(String uuid);
	String startBatchErrorInstances(String uuids);
	public List<Map<String,Object>> getSparksDetail(String sparkVersion);
	public boolean deleteTmpFile(String resourceVersionId,String sparkId);
	public String doDownloadAndUnzip(String resourceVersionId,String sparkId);
	public List<String> getCommand(SparkFunction fun,int configVersionId,String zipParentPath);
	public List<String> getRemoteSubmitCommand(SparkFunction fun,
			   int configVersionId,
			   List<String> libjars,
			   List<String> binjars,
			   String submitScriptLoc,
			   String submitScript);
	public Map<String,Object> getSparkDetail(String id,String sparkVersion);
}
