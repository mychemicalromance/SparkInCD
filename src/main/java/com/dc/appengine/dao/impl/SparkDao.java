package com.dc.appengine.dao.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Component;

import com.dc.appengine.dao.ISparkDAO;
import com.dc.appengine.entity.Page;
import com.dc.appengine.entity.Spark;
import com.dc.appengine.entity.SparkFunction;
import com.dc.appengine.entity.SparkInstance;
import com.dc.appengine.util.MessageHelper;

@Component("sparkDao")
public class SparkDao implements ISparkDAO {
	@Resource
	SqlSessionTemplate sqlSessionTemplate;
	
	@Override
	public Integer countApps(Map param) {
		// TODO Auto-generated method stub
		return (Integer)this.sqlSessionTemplate.selectOne("spark.countSpark", param);
	}

	@Override
	public List<Spark> listSparkApps(Page page) {
		// TODO Auto-generated method stub
		return this.sqlSessionTemplate.selectList("spark.listSparkApps", page);
	}

	@Override
	public Boolean checkSpark(String name) {
		// TODO Auto-generated method stub
		return (Boolean)this.sqlSessionTemplate.selectOne("spark.checkSpark", name);
	}

	@Override
	public Spark findSparkById(String id) {
		// TODO Auto-generated method stub
		return (Spark)this.sqlSessionTemplate.selectOne("spark.findSparkById", id);
	}

	@Override
	public Integer countAppInstances(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return (Integer)this.sqlSessionTemplate.selectOne("spark.countSparkInstance", params);
	}

	@Override
	public List<Map<String, Object>> listSparkInstances(Page page) {
		// TODO Auto-generated method stub
		return this.sqlSessionTemplate.selectList("spark.listSparkInstances", page);
	}

	@Override
	public List<Map<String, Object>> listSparkInstancesByfunctionId(String functionId) {
		// TODO Auto-generated method stub
		return  this.sqlSessionTemplate.selectList("spark.listSparkInstancesByfunctionId", functionId);
	}

	@Override
	public SparkFunction findFunctionById(String functionId) {
		// TODO Auto-generated method stub
		return (SparkFunction) this.sqlSessionTemplate.selectOne("spark.findFunctionById", functionId);
	}

	@Override
	public void saveSparkInstance(Map<String, Object> param) {
		this.sqlSessionTemplate.insert("spark.saveSparkInstance",param);
	}

	@Override
	public void updateSparkInstance(Map<String, Object> param) {
		this.sqlSessionTemplate.update("spark.updateSparkInstance",param);
	}

	@Override
	public String saveSpark(Map<String, Object> params) {
		// TODO Auto-generated method stub
		int count= (Integer)this.sqlSessionTemplate.insert("spark.saveSpark", params);
		if(count ==1){
			return params.get("sparkId").toString();
		}
		 return null;
	}

	@Override
	public String saveSparkFunction(Map<String, Object> params) {
		// TODO Auto-generated method stub
		int count = (Integer)this.sqlSessionTemplate.insert("spark.saveSparkFunction", params);
		if(count ==1){
			return params.get("fuctionId").toString();
		}
		 return null;
	}

	@Override
	public SparkInstance findSparkInstanceById(String id) {
		// TODO Auto-generated method stub
		return (SparkInstance) this.sqlSessionTemplate.selectOne("spark.findSparkInstanceById", id);
	}

	@Override
	public SparkInstance findSparkInstance(String sparkId, String functionId, int confVersionId) {
		return (SparkInstance) this.sqlSessionTemplate.selectOne("spark.findSparkInstance",
				MessageHelper.wrapMessage("sparkId",sparkId,"functionId",functionId,"confVersionId",confVersionId));
	}

	@Override
	public List<Map<String, String>> getSparkProvince() {
		// TODO Auto-generated method stub
		return this.sqlSessionTemplate.selectList("spark.getSparkProvince");
	}

	@Override
	public List<SparkFunction> listSparkFunction(String sparkId) {
		// TODO Auto-generated method stub
		return this.sqlSessionTemplate.selectList("spark.listSparkFunction",sparkId);
	}
	public void deleteSparkInstanceByFunId(String funId) {
		this.sqlSessionTemplate.delete("spark.deleteSparkInstanceByFunId",funId);
	}

	@Override
	public void deleteSparkFun(String funId) {
		this.sqlSessionTemplate.delete("spark.deleteSparkFun",funId);
	}

	@Override
	public void updateSparkInstanceConfVersion(String uuid, int confVersionId) {
		this.sqlSessionTemplate.update("spark.updateSparkInstanceConfVersion",
				MessageHelper.wrapMessage("uuid",uuid,"confVersionId",confVersionId));
	}

	@Override
	public void deleteSparkTasks(List<String> ids) {
		// TODO Auto-generated method stub
		this.sqlSessionTemplate.delete("spark.deleteSparkMessages",ids);
	}

	@Override
	public void saveSparkTasks(Map<String, Object> messages) {
		// TODO Auto-generated method stub
		if(messages.containsKey("messages")&&((List)messages.get("messages")).size()==0){
			return;
		}
		this.sqlSessionTemplate.insert("spark.addSparkMessages", messages);
	}

	@Override
	public List<Map<String, Object>> getSparkTasks(int maxCount,String sparkVersion) {
		List<Map<String,Object>> list = this.sqlSessionTemplate.selectList("spark.listSparkTask",
						MessageHelper.wrapMessage("maxCount",maxCount,"sparkVersion",sparkVersion));
		if(list==null){
			list = Collections.EMPTY_LIST;
		}
		return list;
	}

	@Override
	public List<Map<String, Object>> listAllSparkInstanceInApp(long userAppId) {
		return this.sqlSessionTemplate.selectList("spark.listAllSparkInstanceInApp", userAppId);
	}

	@Override
	public String findUserAppNameById(long userAppId) {
		return (String) this.sqlSessionTemplate.selectOne("spark.findUserAppNameById",userAppId);
	}

	@Override
	public SparkInstance findSparkInstanceByUUId(String id) {
		// TODO Auto-generated method stub
		return (SparkInstance) this.sqlSessionTemplate.selectOne("spark.findSparkInstanceByUUId", id);
	}
	
}
