package com.dc.appengine.dao.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Component;

import com.dc.appengine.entity.Page;

@Component("configDao")
public class ConfigDao{
	@Resource
	SqlSessionTemplate sqlSessionTemplate;
	
	public boolean checkName( String configName,String type){
		 Map<String,Object> param= new HashMap<String,Object>();
		 param.put("type", type);
		 param.put("configName", configName);
		 Object obj=sqlSessionTemplate.selectOne("configs.checkName",param);
		 if(obj!=null){
			 int num=Integer.valueOf(obj.toString());
			 return num >0;
		 }
		return false;
	}
	
	public int addNewConfig(String userId,String appId,String configName ,String type,String description){
		Map<String,Object> param= new HashMap<String,Object>();
		param.put("configName",configName);
		param.put("description",description);
		param.put("type",type);
		param.put("userId",userId);
		param.put("appId",appId);
		Object obj=sqlSessionTemplate.insert("configs.addNewConfig",param);
		if(obj==null){
			return 0;
		}
		return Integer.valueOf(param.get("id").toString());
	}
	public boolean checkVersionName(int configId,String versionName){
		 Map<String,Object> param= new HashMap<String,Object>();
		 param.put("configId", configId);
		 param.put("versionName", versionName);
		 Object obj=sqlSessionTemplate.selectOne("configs.checkVersion",param);
		 if(obj!=null){
			 int num=Integer.valueOf(obj.toString());
			 return num >0;
		 }
		return false;
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> getVersionList(int configId ){
		 Map<String,Object> param= new HashMap<String,Object>();
		 param.put("configId", configId);
		 Object obj=sqlSessionTemplate.selectList("configs.getVersionList",param);
		 if(obj==null){
			 return Collections.emptyList();
		 }
		 return (List<Map<String,Object>>)obj;
		 
 
	}
	public int addConfigVersion(int configId,String versionName){
		Map<String,Object> param= new HashMap<String,Object>();
		param.put("configId", configId);
		param.put("versionName", versionName);
		Object obj=sqlSessionTemplate.insert("configs.addVersion",param);
		if(obj==null){
			return 0;
		}
		Object ID=param.get("id");
		if(ID!=null){
			return Integer.valueOf(ID.toString());
		}
		return 0;
	}
	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> getConfigList(Map<String,Object> param){
		Object obj=sqlSessionTemplate.selectList("configs.getConfigList",param);
		if(obj==null){
			return Collections.EMPTY_LIST;
		}
		return (List<Map<String,Object>>)obj;
	}
	@SuppressWarnings("unchecked")
	public Map<String,Object> checkPair(int versionId){
		Object obj=sqlSessionTemplate.selectOne("configs.checkPair",versionId);
		if(obj==null){
			return null;
		}
		return (Map<String,Object> ) obj;
	}
	public int getVersionId(int configId){
		Object obj=sqlSessionTemplate.selectOne("configs.checkVersionId",configId);
		if(obj==null){
			return 0;
		}
		return (Integer)obj;
	}
	public int addPair(int versionId){
		Map<String,Object> param= new HashMap<String,Object>();
		param.put("versionId", versionId);
		param.put("id", -1);
		Object obj=sqlSessionTemplate.insert("configs.addPair",param);
		if(obj==null){
			return 0;
		}
		Object ID=param.get("id");
		return (Integer)ID;
	}
	@SuppressWarnings("unchecked")
	public Map<String,Object> checkKey(Map<String,Object> param){
		Object obj=null;
		if(param.containsKey("id")){
			obj=sqlSessionTemplate.selectOne("configs.checkUpdateKey",param);
		}else{
			obj=sqlSessionTemplate.selectOne("configs.checkKey",param);
		}
		if(obj==null){
			return null;
		}
		return (Map<String,Object>)obj;
	}
	public String getValue(String key,int versionId){
		Map<String,Object> param= new HashMap<String,Object>();
		param.put("versionId", versionId);
		param.put("key",key);
		Object obj=sqlSessionTemplate.selectOne("configs.getValue",param);
		if(obj==null){
			return null;
		}
		return (String)obj;
	}
	public String setValue(int versionId,String key,String value){
		Map<String,Object> param= new HashMap<String,Object>();
		param.put("versionId", versionId);
		param.put("key",key);
		param.put("value",value);
		Object obj=sqlSessionTemplate.selectOne("configs.setValue",param);
		if(obj==null){
			return null;
		}
		return (String)obj;
	}
	public void addLine(Map<String,Object> param){
		sqlSessionTemplate.insert("configs.addLine",param);
		int versionId=Integer.valueOf(param.get("versionId").toString());
		sqlSessionTemplate.update("configs.updateOpTime",versionId);
	}
	public  void updateLine(Map<String,Object> param){
		sqlSessionTemplate.update("configs.updateLine",param);
		int versionId=Integer.valueOf(param.get("versionId").toString());
		sqlSessionTemplate.update("configs.updateOpTime",versionId);
	}
	public void delLine(Map<String,Object> param){
		long id=Long.valueOf(param.get("id").toString());
		sqlSessionTemplate.delete("configs.delLine",id);
	 
	}
	public List<String> getClients(int configId){
		Object obj=sqlSessionTemplate.selectList("configs.getClients",configId);
		if(obj==null){
			return Collections.emptyList();
		}
		@SuppressWarnings("unchecked")
		List<String> list=(List<String>)obj;
		return list;
	}
	public void addClient(int configId,String clientUrl){
		Map<String,Object> map= new HashMap<String,Object>();
		map.put("configId", configId);
		map.put("clientUrl", clientUrl);
		sqlSessionTemplate.insert("configs.addClient",map);
	}
	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> getApps(String userId){
		Map<String,Object> param=new HashMap<String,Object>();
		param.put("userId",userId.split(","));
		Object obj=sqlSessionTemplate.selectList("configs.getApps",param);
		if(obj==null){
			return Collections.emptyList();
		}
		return (List<Map<String,Object>>)obj;
	}
	public List<Map<String,Object>> getVersions(int configId){
		Object obj=sqlSessionTemplate.selectList("configs.getVersions",configId);
		if(obj==null){
			return Collections.emptyList();
		}
		List<Map<String,Object>> list=(List<Map<String,Object>>)obj;
		return list;
	}
//	public Map<String,Object> getVersionInfo(int configId){
//		Object obj=sqlSessionTemplate.selectOne("configs.getVersionInfo",configId);
//		if(obj==null){
//			return null;
//		}
//		Map<String,Object> result=(Map<String,Object>)obj;
//		result.put("version", "v"+result.get("version") );
//		result.put("last_update_time", result.get("last_update_time").toString().replace(".0", ""));
//		return result;
//	}
	public void clearClient(int configId){
		sqlSessionTemplate.delete("configs.clearClient",configId);
	}
	public void clearConfig(int verionId){
		sqlSessionTemplate.delete("configs.clearConfig",verionId);
	}
	public void delConfig(int configId){
		sqlSessionTemplate.delete("configs.delConfig",configId);
	}
	public void deleteVersion(int versionId){
		sqlSessionTemplate.delete("configs.deleteVersion",versionId);
	}
	public boolean clone(int fromId,int toId){
		if(checkInit(toId)){
			return false;
		}
		Map<String,Object> param= new HashMap<String,Object>();
		param.put("fromId", fromId);
		param.put("toId", toId);
		sqlSessionTemplate.selectOne("configs.clone",param);
		return checkInit(toId);
	}
	public boolean checkInit(int versionId){
		Map<String,Object> param= new HashMap<String,Object>();
		param.put("versionId", versionId);
		Object obj=sqlSessionTemplate.selectOne("configs.checkInit",param);
		if(obj==null){
			return true;
		}
		int num=Integer.valueOf(obj.toString());
		return num>0;
	}
	public Map<String,Object> getVersionInfo(int versionId){
		Object obj=sqlSessionTemplate.selectOne("configs.getVersionInfo",versionId);
		if(obj==null){
			return new HashMap<String,Object>();
		}
		return (Map<String,Object>)obj;
	}
	public int getVersionIdByName(int configId,String versionName){
		Map<String,Object> param= new HashMap<String,Object>();
		param.put("configId",configId);
		param.put("versionName", versionName);
		Object obj=sqlSessionTemplate.selectOne("configs.getVersionIdByName",param);
		if(obj==null){
			return 0;
		}
		return Integer.valueOf(obj.toString());
	}
	public Map<String,Object> getConfigInfo(int configId){
		Object obj=sqlSessionTemplate.selectOne("configs.getConfigInfo",configId);
		if(obj==null){
			return null;
		}
		Map<String,Object> map=(Map<String,Object>)obj;
		return map;
	}
	public List<Map<String,Object>> getConfigByPage( Map<String,Object> param){
		Object obj=sqlSessionTemplate.selectList("configs.getConfigsByPage",param);
		if(obj==null){
			return Collections.emptyList();
		}
		return (List<Map<String,Object>>)obj;
	}
	public int getConfigNum( Map<String,Object> param){
		Object obj=sqlSessionTemplate.selectOne("configs.getConfigsNum",param);
		if(obj==null){
			return 0;
		}
		return (Integer)obj;
	}
	
	public int getConfigIdByVersion( int versionId){
		Object obj=sqlSessionTemplate.selectOne("configs.getConfigIdByVersion",versionId);
		if(obj==null){
			return 0;
		}
		return (Integer)obj;
	}
	public int getConfigIdByKey( long keyId){
		Object obj=sqlSessionTemplate.selectOne("configs.getConfigIdByKey",keyId);
		if(obj==null){
			return 0;
		}
		return (Integer)obj;
	}
	public Map<String,Object> getConfigInfoByVersionId(int versionId){
		Object obj=sqlSessionTemplate.selectOne("configs.getConfigInfoByVersionId",versionId);
		if(obj==null){
			return null;
		}
		Map<String,Object> map=(Map<String,Object>)obj;
		return map;
	}
	public int getconfigIdByName(String configName){
		Object obj=sqlSessionTemplate.selectOne("configs.getconfigIdByName",configName);
		if(obj==null){
			return 0;
		}
		return (Integer)obj;
	}
	@SuppressWarnings("unchecked")
	public Map<String,Object> getConfigByName(Map<String,Object> param){
		Object obj=sqlSessionTemplate.selectOne("configs.getConfigByName",param);
		if(obj==null){
			return null;
		}
		Map<String,Object> map=(Map<String,Object>)obj;
		return map;
	}
	public int countVersion(Map<String, Object> config) {
		// TODO Auto-generated method stub
		return (Integer)sqlSessionTemplate.selectOne("configs.countVersion",config);
	}
	public List<Map<String, Object>> listFunctionConfigs(Page page) {
		// TODO Auto-generated method stub
		return sqlSessionTemplate.selectList("configs.listFunctionConfigs",page);
	}
	public int addLines(Map<String,Object> param) {
		// TODO Auto-generated method stub
		int result= (int) sqlSessionTemplate.insert("configs.addLines",param);
		int versionId=Integer.valueOf(param.get("versionId").toString());
		sqlSessionTemplate.update("configs.updateOpTime",versionId);
		return result;
	}
	
	public int addConfigSpark(Map<String,Object> param){
		Object obj=sqlSessionTemplate.insert("configs.addNewConfig",param);
		if(obj==null){
			return 0;
		}
		return Integer.valueOf(param.get("id").toString());
	}
	
	public int addConfigVersionSpark(int configId,String versionName){
		Map<String,Object> param= new HashMap<String,Object>();
		param.put("configId", configId);
		param.put("versionName", versionName);
		Object obj=sqlSessionTemplate.insert("configs.addVersion",param);
		if(obj==null){
			return 0;
		}
		Object ID=param.get("id");
		if(ID!=null){
			return Integer.valueOf(ID.toString());
		}
		return 0;
	}
}
