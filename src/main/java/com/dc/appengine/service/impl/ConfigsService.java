package com.dc.appengine.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.dc.appengine.dao.ISparkDAO;
import com.dc.appengine.dao.impl.ConfigDao;
import com.dc.appengine.entity.Page;
import com.dc.appengine.entity.SparkFunction;

@Service("configservice")
public class ConfigsService {
	private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	@Autowired
	@Qualifier("configDao")
	private ConfigDao configDao;

	@Autowired
	@Qualifier("sparkDao")
	private ISparkDAO sparkDao;

	private Logger log = LoggerFactory.getLogger(ConfigsService.class);

	/**
	 * 分页获取所有配置资源
	 * 
	 * @param pageSize
	 * @param pageNum
	 * @param userIds
	 * @param type
	 *            （default component） component template topo app
	 * @param keyword
	 *            搜索关键词
	 * @return
	 */
	public String getConfigByPage(String userIds, String appId, int pageSize, int pageNum, String type,
			String keyword) {
		int start = 0;
		if (pageNum != 0) {
			start = pageSize * (pageNum - 1);
		}
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("userId", userIds.split(","));
		param.put("appId", appId);
		param.put("type", type);
		param.put("pageSize", pageSize);
		param.put("pageNum", pageNum);
		param.put("start", start);
		param.put("keyword", keyword);
		int num = configDao.getConfigNum(param);
		List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
		if (num != 0) {
			rows = configDao.getConfigByPage(param);
		}
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("rows", rows);
		result.put("total", num);
		result.put("pageSize", pageSize);
		result.put("pageNum", pageNum);
		result.put("keyword", keyword);
		result.put("type", type);
		return JSON.toJSONString(result, SerializerFeature.WriteDateUseDateFormat);
	}

	//
	// 检查config名字是否被注册
	public int checkConfig(int userId, int appId, String configName, String type) {
		// return configDao.checkName(configName,type);
		Map<String, Object> result = getConfigByName(userId, appId, configName, type);
		if (result == null || !result.containsKey("id")) {
			return 0;
		}
		return Integer.valueOf(result.get("id").toString());
	}

	/**
	 * 添加一份新配置
	 * 
	 * @param configName
	 * @param type
	 * @param userId
	 * @param description
	 * @return
	 */
	public int addNewConfig( String userId, String appId,String configName, String type, String description) {

		return configDao.addNewConfig(userId, appId, configName, type, description);
	}

	/**
	 * 根据当前配置 生成新的版本名称 v1 v2 ->v3
	 * 
	 * @param configId
	 * @return
	 */
	public String generateNewVrsionName(int configId) {
		List<String> list = getVersionNames(configId);
		int newIndex = 1;
		if (list.size() != 0) {
			Collections.sort(list);
			String lastV = list.get(list.size() - 1);
			newIndex = Integer.valueOf(lastV.replace("v", "")) + 1;
		}
		return "v" + newIndex;
	}

	/**
	 * 注册一个新版本
	 * 
	 * @param configId
	 * @param versionName
	 * @return
	 */
	public int addNewVersion(int configId, String versionName) {
		// check
		boolean c = configDao.checkVersionName(configId, versionName);
		if (c) {
			return 0;
		}
		// add
		return configDao.addConfigVersion(configId, versionName);
	}

	/**
	 * 获取配置的所有版本
	 * 
	 * @param configId
	 * @return
	 */
	public List<Map<String, Object>> getVersionList(int configId) {
		List<Map<String, Object>> list = configDao.getVersionList(configId);
		if (list == null) {
			return Collections.emptyList();
		}
		return list;
	}

	/**
	 * 根据配置资源的id获取所有版本信息（名称 v1 v2 v3）
	 * 
	 * @param configId
	 * @return
	 */
	public List<String> getVersionNames(int configId) {
		List<String> list = new ArrayList<String>();
		List<Map<String, Object>> listM = getVersionList(configId);

		for (Map<String, Object> unit : listM) {
			String version = unit.get("version").toString();
			if (version == null) {
				continue;
			}
			list.add(version);
		}
		return list;
	}

	

	/**
	 * 删除一个版本的配置 私有
	 * 
	 * @param versionId
	 * @return
	 */
	private boolean delVersionById(int versionId) {
		// 删除配置列表
		configDao.clearConfig(versionId);
		// 删除配置
		configDao.deleteVersion(versionId);
		return true;
	}

	/**
	 * 根据配置版本id获取配置信息
	 * 
	 * @param versionId
	 * @return
	 * @returnfield (id configId version last_update_time name)
	 */
	public Map<String, Object> getVersionInfo(int versionId) {
		return configDao.getVersionInfo(versionId);
	}

	/**
	 * 根据configId vx 获取版本名称
	 * 
	 * @param configId
	 * @param versionName
	 * @return
	 */
	public int getVersionIdByName(int configId, String versionName) {
		return configDao.getVersionIdByName(configId, versionName);
	}

	/**
	 * 根据配置名获取配置id
	 * 
	 * @param name
	 * @return
	 */
	public int getConfigIdByName(String name) {
		return configDao.getconfigIdByName(name);
	}

	/**
	 * 根据配置名 配置版本 获取版本id
	 * 
	 * @param configName
	 * @param versionName
	 * @return
	 */
	public int getVersionIdByName(String configName, String versionName) {
		int configId = configDao.getconfigIdByName(configName);
		return getVersionIdByName(configId, versionName);
	}

	
	/**
	 * 深度拷贝
	 * 
	 * @param fromId
	 * @param userId
	 * @param name
	 *            copy result name
	 * @param toType
	 *            component-> template ->app
	 * @return
	 */
	public int deepCopy(int fromId, int userId, String name, String toType) {
		if (toType == null || "".equals(toType)) {
			toType = "component";
		}
		// 创建一份配置 app_configs-add(name) v1
		String toname = "";
		if (name == null || "".equals(name)) {
			Map<String, Object> configInfo = configDao.getConfigInfoByVersionId(fromId);
			String fromname = "";
			if (configInfo.get("name") == null) {
				fromname = UUID.randomUUID().toString();
			} else {
				fromname = configInfo.get("name").toString();
			}
			toname = fromname;
		} else {
			toname = name;
		}

		int configId = addNewConfig(userId + "", "0", toname, toType, "");
		// 添加版本
		String versionName = generateNewVrsionName(configId);
		int versionId = addNewVersion(configId, versionName);
		boolean success = clone(fromId, versionId);
		if (success) {
			return versionId;
		}
		return 0;
	}


	public List<Map<String, Object>> getConfigList(int versionId) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("versionId", versionId);
		List<Map<String, Object>> list = configDao.getConfigList(param);
		if (list != null && list.size() > 0) {
			for (Map<String, Object> unit : list) {
				Object type = unit.get("type");
				if (type == null) {
					unit.put("type", "");
				}
			}
		}
		return list;
	}

	public List<Map<String, Object>> getConfigList(String keyword, int versionId) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("versionId", versionId);
		param.put("keyword", keyword);
		List<Map<String, Object>> list = configDao.getConfigList(param);
		return list;
	}

	/**
	 * 前台获取配置列表接口
	 * 
	 * @param versionId
	 * @param keyword
	 * @return
	 */
	public String getConfigList(int versionId, String keyword) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("versionId", versionId);
		param.put("keyword", keyword);
		List<Map<String, Object>> list = configDao.getConfigList(param);
		// 需要遍历list查看是否有引用的配置

		if (list != null && list.size() > 0) {
			for (Map<String, Object> unit : list) {
				Object type = unit.get("type");
				if (type == null) {
					unit.put("type", "");
				}

			}

		}
		param.put("total", list.size());
		param.put("rows", list);
		param.put("configId", null);
		Map<String, Object> info2 = configDao.getVersionInfo(versionId);
		param.putAll(info2);
		return JSON.toJSONString(param, SerializerFeature.WriteDateUseDateFormat);
	}

	/**
	 * 添加一行
	 * 
	 * @param versionId
	 * @param key
	 * @param value
	 * @param type
	 * @param description
	 * @return
	 */
	public String addLine(int versionId, String key, String value, Object type, Object description) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("versionId", versionId);
		param.put("key", key);
		param.put("value", value);
		param.put("type", type);
		param.put("description", description);
		Map<String, Object> line = configDao.checkKey(param);
		if (line != null) {
			return "{\"result\":false,\"msg\":\"key already exists\"}";
		}
		configDao.addLine(param);
		return "{\"result\":true}";
	}

	/**
	 * 添加或更新一行
	 * 
	 * @param versionId
	 * @param id
	 * @param key
	 * @param value
	 * @param type
	 * @param description
	 * @return
	 */
	public String updateLine(int versionId, long id, String key, String value, String type, String description) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("id", id);
		param.put("versionId", versionId);
		param.put("key", key);
		param.put("value", value);
		param.put("type", type);
		param.put("description", description);
		Map<String, Object> line = configDao.checkKey(param);
		if (line != null) {
			return "{\"result\":false,\"msg\":\"key already exists\"}";
		}
		configDao.updateLine(param);
		return "{\"result\":true}";
	}

	// 根据key设置值
	public String setValue(int versionId, String key, String value) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("versionId", versionId);
		param.put("key", key);
		param.put("value", value);
		Map<String, Object> line = configDao.checkKey(param);
		if (line == null) {
			return "{\"result\":false,\"msg\":\"cannot get key[" + key + "]\"}";
		}
		configDao.setValue(versionId, key, value);
		return "{\"result\":true}";
	}

	// 删除一行
	public String delLine(long id) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("id", id);
		configDao.delLine(param);
		return "{\"result\":true}";
	}

	/**
	 * 检测是properties 还是yaml格式 仅数云使用
	 * 
	 * @param content
	 * @return
	 */
	public String typeScanner(String content) {
		String type = "properties";
		String PRO_TEST = "=";
		int pro_count = 0;
		String YAML_TEST = ":";
		int yaml_count = 0;
		for (String line : content.split("\n")) {
			if (line.startsWith("#")) {
				continue;
			}
			if (line.contains(YAML_TEST)) {
				yaml_count++;
			}
			if (line.contains(PRO_TEST)) {
				pro_count++;
			}
		}
		if (pro_count < yaml_count) {
			type = "yaml";
		}
		return type;
	}

	/**
	 * 批量导入配置
	 * 
	 * @param versionId
	 * @param content
	 * @param type
	 * @return
	 */
	public String batchImport(int versionId, String content, String type) {
		String mark = "";
		List<Map<String, Object>> errorList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> doList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> insertList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> updateList = new ArrayList<Map<String, Object>>();
		for (String line : content.split("\n")) {
			// 检查行的合法性
			if (line.startsWith("#")) {
				mark = mark + line.substring(1);
			} else if (line.contains("=") && line.indexOf("#") != 0) {
				Map<String, Object> addUnit = new HashMap<String, Object>();
				String key = line.substring(0, line.indexOf("="));
				String value = null;
				String nearMark = "";
				String extra = line.substring(line.indexOf("=") + 1);

				if (extra != null) {
					value = extra.trim();
				}
				nearMark = nearMark + mark;
				mark = "";// 清空
				addUnit.put("line", line);
				key = key.trim();
				if (key == null || "".equals(key)) {
					Map<String, Object> temp = new HashMap<String, Object>();
					temp.put("line", line);
					temp.put("reason", "null key is not allow");
					errorList.add(temp);
					continue;
				}
				addUnit.put("key", key.trim());
				addUnit.put("type", type);
				if(value != null){
					addUnit.put("value", value.trim());
				}
				
				addUnit.put("description", nearMark.trim());
				doList.add(addUnit);
			} else if (line.trim() == null || "".equals(line.trim())) {
				continue;
			} else {
				Map<String, Object> temp = new HashMap<String, Object>();
				temp.put("line", line);
				temp.put("reason", "format_error");
				errorList.add(temp);
			}

		}
		// 添加队列
		for (Map<String, Object> unit : doList) {
			unit.put("versionId", versionId);
			long id = checkKey(unit);
			if (id != 0) {
				unit.put("id", id);
				// 更新值
				configDao.updateLine(unit);
				updateList.add(unit);
				continue;
			}
			configDao.addLine(unit);
			insertList.add(unit);
		}
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("insertnum", insertList.size());
		result.put("updatenum", updateList.size());
		result.put("errornum", errorList.size());

		// result.put("insert", insertList);
		// result.put("update", updateList);
		result.put("error", errorList);
		result.put("result", errorList.size() == 0);
		return JSON.toJSONString(result);
	}

	/**
	 * 根据新的配置更新出 新的版本
	 * 
	 * @param fromVersionId
	 * @param configs
	 * @return
	 */
	public int updateNewVersion(int configId, List<Map<String, Object>> configs) {
		String newVersion = generateNewVrsionName(configId);
		int newVersionId = addNewVersion(configId, newVersion);
		if (newVersionId == 0) {
			return 0;
		}
		for (Map<String, Object> unit : configs) {
			if (unit.get("key") == null || "".equals(unit.get("key"))) {
				continue;
			}
			String key = unit.get("key").toString();
			String value = unit.get("value") == null ? "" : unit.get("value").toString();

			addLine(newVersionId, key, value, unit.get("type"), unit.get("description"));
		}
		return newVersionId;
	}

	/**
	 * 检查key是否已经被占用
	 * 
	 * @param param
	 * @return
	 */
	private long checkKey(Map<String, Object> param) {
		Map<String, Object> result = configDao.checkKey(param);
		if (result == null) {
			return 0l;
		} else {
			return Long.valueOf(result.get("id").toString());
		}
	}

	/**
	 * 主动下发配置接口
	 * 
	 * @param client
	 * @param configId
	 * @param clientUrl
	 * @param content
	 * @return
	 * @throws Exception
	 */
	public String sendConfig(int configId) {
		List<String> list = configDao.getClients(configId);
		if (list == null || list.size() == 0) {
			return "{\"result\":false,\"msg\":\"no client regist\"}";
		}
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("configId", configId);

		List<Map<String, Object>> configList = configDao.getConfigList(param);
		Client client = ClientBuilder.newClient();
		client.register(MultiPartFeature.class);
		client.register(JacksonJsonProvider.class);

		for (String clientUrl : list) {
			try {
				sendConfig(client, configId, clientUrl, JSON.toJSONString(configList));
			} catch (Exception e) {

				return "{\"result\":false,\"msg\":\"client " + clientUrl + " not reached\"}";
			}
		}
		return "{\"result\":true}";

	}

	// 记录申请配置客户端ip
	public boolean addClient(int configId, String clientUrl) {
		List<String> list = configDao.getClients(configId);
		if (list == null || list.size() == 0) {
			configDao.addClient(configId, clientUrl);
			return true;
		}

		for (String cli : list) {
			if (clientUrl.equals(cli)) {
				return false;
			}
		}
		configDao.addClient(configId, clientUrl);
		return true;

	}

	private boolean sendConfig(Client client, int configId, String clientUrl, String content) throws Exception {
		if (!clientUrl.startsWith("http://")) {
			clientUrl = "http://" + clientUrl;
		}
		Form form = new Form();
		form.param("content", content);
		WebTarget web = client.target(clientUrl);
		web.request().post(Entity.entity(form, MediaType.APPLICATION_FORM_URLENCODED_TYPE), String.class);
		return true;

	}

	public List<Map<String, Object>> getApps(String userId) {
		return configDao.getApps(userId);
	}

	/**
	 * 获取版本列表
	 * 
	 * @param configId
	 * @return
	 */
	public List<Map<String, Object>> getVersions(int configId) {
		return configDao.getVersions(configId);
	}

	/**
	 * 模板导出时使用 国寿已废弃
	 * 
	 * @param versionId
	 * @return
	 */
	public List<Map<String, Object>> exportConfigs(int versionId) {
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("configId", versionId);
		List<Map<String, Object>> list = configDao.getConfigList(param);
		if (list == null) {
			list = Collections.emptyList();
		}
		for (Map<String, Object> unit : list) {
			unit.remove("id");
			unit.remove("configId");
		}
		return list;
	}

	/**
	 * 将某一版本的配置拷贝给另一版本
	 * 
	 * @param fromId
	 * @param toId
	 * @return
	 */
	public boolean clone(int fromId, int toId) {
		return configDao.clone(fromId, toId);
	}

	/**
	 * 获取配置信息
	 * 
	 * @param configId
	 * @return 字段 id name USERID type description configId versionNum lastTime
	 *         lastVersion
	 */
	public Map<String, Object> getConfigInfo(int configId) {
		return configDao.getConfigInfo(configId);
	}

	/**
	 * 根据版本id获取配置id
	 * 
	 * @param versionId
	 * @return
	 */
	public int getConfigIdByVersionId(int versionId) {
		return configDao.getConfigIdByVersion(versionId);
	}

	/**
	 * 根据key的id获取配置版本id
	 * 
	 * @param keyId
	 * @return
	 */
	public int getConfigIdByKeyId(long keyId) {
		return configDao.getConfigIdByKey(keyId);
	}

	/**
	 * 获取当前用户是否有写权限 国寿版废弃
	 * 
	 * @param configId
	 * @param userIds
	 * @return
	 */
	public boolean hasWritePermision(int configId, List<Long> userIds) {
		if (userIds.contains(1) || userIds.contains(1l)) {
			return true;
		}
		Map<String, Object> unit = configDao.getConfigInfo(configId);
		if (unit == null) {
			return false;
		}
		if (unit.get("userId") == null) {
			return true;
		}
		long userId = Long.parseLong(unit.get("userId").toString());
		for (long id : userIds) {
			if (id == userId) {
				return true;
			}
		}
		return false;
	}

	private boolean isTopo(String name) {
		String regex = "^[a-f0-9]{8}(\\-[a-f0-9]{4}){4}[a-f0-9]{8}";
		Pattern p = Pattern.compile(regex);
		Matcher m = p.matcher(name);
		return m.find();
	}

	public Map<String, Object> getConfigByName(int userId, int appId, String name, String type) {
		if (!"topo".equals(type)) {
			appId = 0;
		}
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("userId", userId);
		param.put("appId", appId);
		param.put("name", name);
		param.put("type", type);
		return configDao.getConfigByName(param);
	}

	public String getProvinceConfigs(int versionId) {

		Map<String, Object> param = new HashMap<String, Object>();
		param.put("versionId", versionId);
		List<Map<String, Object>> list = configDao.getConfigList(param);
		// 需要遍历list查看是否有引用的配置
		List<Map<String,Object>> sysList=new ArrayList<>();
		List<Map<String,Object>> serviceList=new ArrayList<>();
		if (list != null && list.size() > 0) {
			for (Map<String, Object> unit : list) {
				Object id=unit.get("id");
				String key=unit.get("key").toString();
				Object value = unit.get("value");
				if(key.startsWith("system")){
					Map<String,Object> sysUnit=new HashMap<>();
					String keyNew =key.substring(key.indexOf(".")+1);
					sysUnit.put(keyNew, value);
					sysUnit.put("id", id);
					sysList.add(sysUnit);
				}else{
					Map<String,Object> serviceUnit=new HashMap<>();
					serviceUnit.put(key, value);
					serviceUnit.put("id", id);
					serviceList.add(serviceUnit);
				}
			}

		}
		param.put("systemParams", sysList);
		param.put("serviceParams", serviceList);
		param.put("result", true);
		return JSON.toJSONString(param, SerializerFeature.WriteDateUseDateFormat);
	}

	public Page listFunctionConfigs(int pageSize, int pageNum, String keyword, String id) {
		Map<String, Object> config= new HashMap<>();
		SparkFunction function = sparkDao.findFunctionById(id);
		config.put("configId", function.getConfigId());
		config.put("version", keyword);
		Page page = new Page(pageSize, configDao.countVersion(config));
		page.setStartRowNum(pageSize*(pageNum-1));
		page.setEndRowNum(pageSize*pageNum);
		page.setObjCondition(config);
		List<Map<String, Object>> configVersions = configDao.listFunctionConfigs(page);
		List<Map<String, Object>> list= new ArrayList<>();
		for(Map<String, Object> oneMap:configVersions){
			Map<String, Object> map = new HashMap<>();
			map.put("id", oneMap.get("id"));
			map.put("configId", oneMap.get("configId"));
			map.put("province", oneMap.get("version"));
			map.put("updateTime", sdf.format(oneMap.get("last_update_time")));
			list.add(map);
		}
		page.setRows(list);
		return page;
	}

	public String getConfigSpark(int versionId) {
		// TODO Auto-generated method stub
		Map<String, Object> param = new HashMap<String, Object>();

		// param.put("configId", configId);
		param.put("versionId", versionId);
		List<Map<String, Object>> list = configDao.getConfigList(param);

		if (list != null && list.size() > 0) {
			for (Map<String, Object> unit : list) {
				Object typeObj = unit.get("type");
				String type = "";
				if (typeObj != null) {
					type = typeObj.toString();
				}
				unit.put("type", type);
				// 需要解析的话不是显示 不需要id
				unit.remove("id");
				String key = unit.get("key").toString();
				String value = unit.get("value").toString();
				unit.put("value", value);
			}

		}
		param.remove("versionId");
		param.put("total", list.size());
		param.put("rows", list);
		param.put("configId", null);
		return JSON.toJSONString(param, SerializerFeature.WriteDateUseDateFormat);
	}
	
	public boolean delConfig(int configId) {
		// 遍历版本 逐个删除
		List<Map<String, Object>> list = getVersionList(configId);
		for (Map<String, Object> unit : list) {
			Object obj = unit.get("id");
			if (obj != null) {
				int versionId = Integer.valueOf(obj.toString());
			}
		}
		// 真正去删除版本
		for (Map<String, Object> unit : list) {
			Object obj = unit.get("id");
			if (obj != null) {
				int versionId = Integer.valueOf(obj.toString());
				delVersionById(versionId);
			}
		}
		// 删除config
		configDao.delConfig(configId);
		return true;

	}
}
