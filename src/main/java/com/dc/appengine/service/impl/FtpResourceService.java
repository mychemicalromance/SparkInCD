package com.dc.appengine.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.dc.appengine.ConfigUtil;
import com.dc.appengine.dao.impl.FtpDao;
import com.dc.appengine.sparkInCD.FtpProperties;
import com.dc.appengine.util.FileUtil;
import com.dc.appengine.util.FileWorker;
import com.dc.appengine.util.FtpInfo;
import com.dc.appengine.util.FtpUtil;
import com.dc.appengine.util.MD5Util;
import com.dc.appengine.util.MessageHelper;

@Service("ftpService")
@AutoConfigureBefore(FtpProperties.class)
@Configuration
@EnableConfigurationProperties(FtpProperties.class)
public class FtpResourceService {
	private static final Logger log = LoggerFactory.getLogger(FtpResourceService.class);
	
	@Autowired
	@Qualifier("ftpsourceDao")
	private FtpDao ftpDao;
	
	@Autowired
	private FtpProperties ftpProperties;

	public boolean uploadResource(String workId, String remotePath) {
		String ftpAddr = ftpProperties.getFtpAddr();
		String remoteUrl = ftpAddr.toString() + remotePath;
		return FileWorker.getInstance().uploadFileToftp(workId, remoteUrl, true);
	}

	public String queryByPackagePath(String packagePath) {
		return ftpDao.queryByPackagePath(packagePath);
	}

	public void saveSparkPackage(Map<String, Object> param) {
		ftpDao.saveSparkPackage(param);
	}
	
	public String updateSparkVersionInfo(Map<String, Object> parms){
		int count = ftpDao.updateSparkVersionInfo(parms);
		if(count !=0){
			return MessageHelper.wrap("result",true,"message","更新成功");
		}
		return MessageHelper.wrap("result",false,"message","更新失败");
	}

	// 全量更新增量更新，ftp路径不变
	public String uploadResource(String sparkId, String workId, String type) throws IOException {
		Map<String, Object> result = new HashMap<>();
		result.put("result", false);
		result.put("msg", "file upload fail!");
		Map<String, Object> resource = ftpDao.findBySparkId(sparkId);
		String packagePath = resource.get("PACKAGE_PATH").toString();
		String id = resource.get("ID").toString();
		String fileName = packagePath.substring(packagePath.lastIndexOf("/") + 1);
		String ftpAddr = ftpProperties.getFtpAddr();
		FtpInfo ftp = new FtpInfo(ftpAddr.toString());
		String md5 = null;
		if ("increment".equals(type)) {
			String uuid = UUID.randomUUID().toString();
			String localPath = ConfigUtil.configs.getProperty("workPath") + File.separator + uuid;
			String filePath = localPath + File.separator + fileName;
			String ftpFilePath = packagePath.substring(1);
			if (!FtpUtil.fileExists(ftp, ftpFilePath)) {
				log.error(ftpFilePath + " file is not exit!");
				result.put("result", false);
				result.put("msg", ftpFilePath + " is not exit on ftpServer!");
				return JSON.toJSONString(result);
			}
			;
			Boolean resultD = FtpUtil.download(ftp, filePath, ftpFilePath);
			if (resultD) {
				// 解压zip
				if (FtpUtil.unZipFile(filePath, localPath)) {
					String workDir = ConfigUtil.configs.getProperty("workPath");
					File dir = new File(workDir + File.separator + workId);
					if (!dir.exists() || !dir.isDirectory()) {
						result.put("result", false);
						result.put("msg", "file" + workId + " is not exit!");
					}
					String localFileName = FileWorker.getInstance().getWorkSource(workId);
					String localFileFullPath = workDir + File.separator + workId + File.separator + localFileName;
					// 合并zip
					FtpUtil.cleanDirectory(new File(localPath + File.separator + "bin"), ".jar");
					FtpUtil.moveFile(workDir + File.separator + workId, localPath + File.separator + "bin",
							localFileName);
					// 删除上传的补丁包
					FileUtil.forceDelete(dir);
					// 压缩zip
					FtpUtil.zipFile(localPath + File.separator + fileName, localPath);
					try {
						md5 = MD5Util.md5(new File(localPath + File.separator + fileName));
					} catch (Exception e) {
						e.printStackTrace();
						result.put("result", false);
						result.put("msg", "md5 failed");
						return JSON.toJSONString(result);
					}
				}
				String remoteUrl = ftpAddr + packagePath;
				if (!"/".equals(packagePath) || !File.separator.equals(packagePath)) {
					FtpUtil.deleteFile(ftp, packagePath);
				}
				// 放到ftp上去
				if (FileWorker.getInstance().uploadFileToftp(uuid, remoteUrl, true)) {
					result.put("result", true);
					result.put("msg", "file upload seccuss!");
				}
				;
			}

		} else if ("full".equals(type)) {
			if (!"/".equals(packagePath) || !File.separator.equals(packagePath)) {
				FtpUtil.deleteFile(ftp, packagePath);
			}
			String remoteUrl = ftpAddr + packagePath;
			// 计算md5值
			String workRoot = ConfigUtil.configs.getProperty("workPath");
			File workDir = new File(workRoot + "/" + workId);
			try {
				md5 = MD5Util.md5(workDir.listFiles()[0]);
			} catch (Exception e) {
				e.printStackTrace();
				result.put("result", false);
				result.put("msg", "md5 failed");
				return JSON.toJSONString(result);
			}
			// 放到ftp上去
			if (FileWorker.getInstance().uploadFileToftp(workId, remoteUrl, true)) {
				result.put("result", true);
				result.put("msg", "file upload seccuss!");
			}
		}
		// 更新MD5值
		Map<String, Object> params = new HashMap<>();
		params.put("md5", md5);
		params.put("versionId", id);
		ftpDao.updateSparkVersionInfo(params);
		return JSON.toJSONString(result);
	}
	
	public Map<String, Object> getSparkVersionInfo(String versionId) {
		Map<String, Object> param = ftpDao.getSparkVersionInfo(versionId);
		if (param == null) {
			return null;
		} else {
//			Map<String, Object> map = registryService.getRegistryById(3);
			String ftpAddr = ftpProperties.getFtpAddr();
			String url = ftpAddr + "" + param.get("packagePath");
			param.put("url", url);
		}
		return param;
	}
}
