package com.dc.appengine.dao.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;

@Component("ftpsourceDao")
public class FtpDao{
	private static final Logger log = LoggerFactory.getLogger(FtpDao.class);
	@Resource
	SqlSessionTemplate sqlSessionTemplate;

	@SuppressWarnings("unchecked")
	public Map<String, Object> checkPublicResource(String resourceName) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("resourceName", resourceName);
		Object re = sqlSessionTemplate.selectOne("ftp.checkPublicResource", param);
		if (re == null) {
			return null;
		}
		return (Map<String, Object>) re;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> checkPrivateResource(String resourceName, String userId, String appId) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("resourceName", resourceName);
		param.put("userId", userId);
		param.put("appId", appId);
		Object re = sqlSessionTemplate.selectOne("ftp.checkPrivateResource", param);
		if (re == null) {
			return null;
		}
		return (Map<String, Object>) re;
	}

	public int checkPackage(String packagePath) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("packagePath", packagePath);
		Object re = sqlSessionTemplate.selectOne("ftp.checkPackage", param);
		int reg = 0;
		if (re != null) {
			reg = 1;
		}
		return reg;
	}

	public int checkVersion(String versionName, int resourceId) {
		if (resourceId == 0) {
			return 0;
		}
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("versionName", versionName);
		param.put("resourceId", resourceId);
		Object re = sqlSessionTemplate.selectOne("ftp.checkVersion", param);
		int reg = 0;
		if (re != null) {
			return Integer.valueOf(re.toString());
		}
		return reg;
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getPublicResourceList(String keyword, int startNum, int pageSize) {
		Map<String, Object> param = new HashMap<String, Object>();
		if (keyword != null) {
			param.put("keyword", keyword);
		}
		param.put("startNum", startNum);
		if (pageSize == 0) {
			pageSize = Integer.MAX_VALUE;
		}
		param.put("pageSize", pageSize);
		List<?> list = sqlSessionTemplate.selectList("ftp.getPublicResourceList", param);
		if (list == null || list.size() == 0) {
			return Collections.emptyList();
		}
		return (List<Map<String, Object>>) list;
	}

	public int getPublicResourceNum(String keyword) {
		Map<String, Object> param = new HashMap<String, Object>();
		if (keyword != null) {
			param.put("keyword", keyword);
		}
		Object obj = sqlSessionTemplate.selectOne("ftp.getPublicResourceNum", param);
		if (obj == null) {
			return 0;
		}
		return Integer.valueOf(obj.toString());
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getUserResourceList(String userId, String appId, String keyword, int startNum,
			int pageSize) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("userId", userId.split(","));
		param.put("appId", appId);
		if (keyword != null) {
			param.put("keyword", keyword);
		}
		param.put("startNum", startNum);
		if (pageSize == 0) {
			pageSize = Integer.MAX_VALUE;
		}
		param.put("pageSize", pageSize);
		List<?> list = sqlSessionTemplate.selectList("ftp.getUserResourceList", param);
		if (list == null || list.size() == 0) {
			return Collections.emptyList();
		}
		return (List<Map<String, Object>>) list;
	}

	public int getUserResourceNum(String userId, String appId, String keyword) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("userId", userId.split(","));
		param.put("appId", appId);
		if (keyword != null) {
			param.put("keyword", keyword);
		}
		Object obj = sqlSessionTemplate.selectOne("ftp.getUserResourceNum", param);
		if (obj == null) {
			return 0;
		}
		return Integer.valueOf(obj.toString());
	}

	public int addResource(String resourceName, int userId, int appId, String description) {
		Map<String, Object> param = new HashMap<String, Object>();
		boolean isPrivate = false;
		String resourceType = "app";
		if (userId != 0 || appId != 0) {
			param.put("userId", userId);
			param.put("appId", appId);
			resourceType = "topo";
			isPrivate = true;
		}
		param.put("resourceName", resourceName);
		param.put("resourceType", resourceType);
		param.put("resourceDescription", description);
		int resourceId = 0;
		Object obj = sqlSessionTemplate.insert("ftp.addResource", param);
		if (obj != null) {
			resourceId = Integer.valueOf(obj.toString());
		}
		if (isPrivate) {
			param.put("resourceId", resourceId);
			sqlSessionTemplate.insert("ftp.addResourceReg", param);
		}
		return resourceId;
	}

	/**
	 * 
	 * @param resourceId
	 * @param packagePath
	 *            包路径
	 * @param versionName
	 *            版本名称
	 * @param description
	 *            版本描述
	 * @param obtheParam(deployTimeout,startTimeout,stopTimeout,destroyTimeout,
	 *            startPort,command)
	 * @return
	 */
	public int addVersion(int resourceId, String packagePath, String versionName, String description,
			Map<String, Object> obtheParam) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("resourceId", resourceId);
		param.put("packagePath", packagePath);
		param.put("versionName", versionName);
		param.put("description", description);
		param.putAll(obtheParam);
		Object obj = sqlSessionTemplate.insert("ftp.addVersion", param);
		if (obj == null) {
			return 0;
		}
		return Integer.valueOf(obj.toString());
	}

	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getVersionList(int resourceId, String keyword, int pageSize, int startNum) {
		Map<String, Object> param = new HashMap<String, Object>();
		if (pageSize == 0) {
			pageSize = Integer.MAX_VALUE;
			startNum = 0;
		}
		param.put("resourceId", resourceId);
		param.put("pageSize", pageSize);
		param.put("startNum", startNum);
		if (keyword == null || "".equals(keyword)) {
			keyword = null;
		}
		param.put("keyword", keyword);
		List<?> list = sqlSessionTemplate.selectList("ftp.getVersionList", param);
		if (list == null) {
			return Collections.emptyList();
		}
		return (List<Map<String, Object>>) list;
	}

	public int getVersionNum(int resourceId, String keyword) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("keyword", keyword);
		param.put("resourceId", resourceId);
		Object obj = sqlSessionTemplate.selectOne("ftp.getVersionNum", param);
		if (obj == null) {
			return 0;
		}
		return Integer.valueOf(obj.toString());
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> getVersionInfo(int versionId) {
		Object obj = sqlSessionTemplate.selectOne("ftp.getVersionInfo", versionId);
		if (obj == null) {
			return null;
		}
		return (Map<String, Object>) obj;
	}
	public void updateVersion(Map<String,Object> param){
		 sqlSessionTemplate.update("ftp.updateVersionInfo", param);
	}
	public void deleteResource(int resourceId) {
		sqlSessionTemplate.delete("ftp.deleteResource", resourceId);
		sqlSessionTemplate.delete("ftp.deleteReg", resourceId);
	}

	public void deleteVersion(int versionId) {
		sqlSessionTemplate.delete("ftp.deleteVersion", versionId);
	}
	@SuppressWarnings("unchecked")
	public String addResourceConfig(Map<String, Object> payload) {
		String configId = UUID.randomUUID().toString();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("configId", configId);
		map.put("configs", JSON.toJSONString(payload.get("config")));
		StringBuilder sb= new StringBuilder();
		
		List<String> list=(List<String>)payload.get("topos");
		if(list==null){
			sb.append("nocheckedname");
		}else{
			for(int i=0;i<list.size();i++){
				sb.append(list.get(i));
				if(i!=0){
					sb.append(",");
				}
			}
		}
		
		map.put("topoNames",sb.toString());
		map.put("typoType", payload.get("topoType"));
		map.remove("config");
		sqlSessionTemplate.insert("ftp.setTopoConfig", map);
		return configId;
	}

	public void connectConfigToTopo(String configId, int resourceVersionId) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("configId", configId);
		param.put("resourceVersionId", resourceVersionId);
		sqlSessionTemplate.update("ftp.connectConfigToTopo",param);
	}
	@SuppressWarnings("unchecked")
	public Map<String,Object> getTopoConfig(int resourceVersionId ){
		Object obj=sqlSessionTemplate.selectOne("ftp.getTopoConfig",resourceVersionId);
		if(obj==null || "".equals(obj)){
			return null;
		}
		Map<String,Object> result=(Map<String,Object>)obj;
		Object type=result.get("type");
		result.put("topoType",type );
		result.remove("type");
		
		return result;
	}
	@SuppressWarnings("unchecked")
	public Map<String,Object> getResourceInfo(int resourceId){
		Object obj=sqlSessionTemplate.selectOne("ftp.getResourceInfo",resourceId);
		if(obj==null || "".equals(obj)){
			return null;
		}
		return (Map<String,Object>)obj;
	}

	public void saveSparkPackage(Map<String,Object> param){
		sqlSessionTemplate.insert("ftp.saveSparkPackage",param);
	}

	public String queryByPackagePath(String packagePath){
		return (String) sqlSessionTemplate.selectOne("ftp.queryByPackagePath",packagePath);
	}

	public Map<String, Object> getSparkVersionInfo(String versionId) {
		Object obj = sqlSessionTemplate.selectOne("ftp.getSparkVersionInfo", versionId);
		if (obj == null) {
			return null;
		}
		return (Map<String, Object>) obj;
	}
	
	public int updateSparkVersionInfo(Map<String,Object> param) {
		 return sqlSessionTemplate.update("ftp.updateSparkVersionInfo", param);
	}

	public Map<String, Object> findBySparkId(String sparkId) {
		// TODO Auto-generated method stub
		Object obj = sqlSessionTemplate.selectOne("ftp.findBySparkId", sparkId);
		if (obj == null) {
			return null;
		}
		return (Map<String, Object>) obj;
	}
}
