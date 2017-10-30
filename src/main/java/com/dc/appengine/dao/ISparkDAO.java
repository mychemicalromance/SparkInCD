package com.dc.appengine.dao;

import java.util.List;
import java.util.Map;

import com.dc.appengine.entity.Page;
import com.dc.appengine.entity.Spark;
import com.dc.appengine.entity.SparkFunction;
import com.dc.appengine.entity.SparkInstance;

/**
 * 处理application相关操作的DAO
 * @author yangleiv
 *
 */
public interface ISparkDAO{
	public Integer countApps(Map param);
	public List<Spark> listSparkApps(Page page);
	public Boolean checkSpark(String name);
	public Spark findSparkById(String id);
	public Integer countAppInstances(Map<String, Object> params);
	public List<Map<String, Object>> listSparkInstances(Page page);
	public List<Map<String, Object>> listSparkInstancesByfunctionId(String functionId);
	public SparkFunction findFunctionById(String functionId);
	void saveSparkInstance(Map<String,Object> param);
	void updateSparkInstance(Map<String,Object> param);
	public String saveSpark(Map<String, Object> params);
	public String saveSparkFunction(Map<String, Object> params);
	public SparkInstance findSparkInstanceById(String id);
	SparkInstance findSparkInstance(String sparkId,String functionId,int confVersionId);
	public List<Map<String,String>> getSparkProvince();
	public List<SparkFunction> listSparkFunction(String sparkId);
	void deleteSparkInstanceByFunId(String funId);
	void deleteSparkFun(String funId);
	void updateSparkInstanceConfVersion(String uuid,int confVersionId);
	void deleteSparkTasks(List<String> ids);
	void saveSparkTasks(Map<String,Object> messages);
	List<Map<String,Object>> getSparkTasks(int maxCount,String sparkVersion);
	List<Map<String,Object>> listAllSparkInstanceInApp(long userAppId);
    String findUserAppNameById(long userAppId);
    SparkInstance findSparkInstanceByUUId(String id);
}
