package com.dc.appengine.util;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import com.dc.appengine.ConfigUtil;


public class FtpTransferer {
	private String resourcePath;
	private String uploadDir;
	private String tmpDir;
	private static Properties properties = new Properties();
	private FtpUtil util;

	public FtpTransferer(String url) {
		util = new FtpUtil();
		String[] parts = URIParser.parse(url);
		util.setIp(parts[2]);
		if(!parts[3].equals("-1")) {
			util.setPort(Integer.parseInt(parts[3]));
		} else {
			util.setPort(21);
		}
		String[] info = parts[1].split(":");
		util.setUserName(info[0]);
		util.setPassword(info[1]);
		util.setTimeout(Integer.valueOf(ConfigUtil.configs.getProperty("ftp.timeOut")));
		setUploadDir(ConfigUtil.configs.getProperty("ftp.uploadDir"));
		setTmpDir(ConfigUtil.configs.getProperty("ftp.tmpDir"));
		setResourcePath(parts[4]);
	}

	public boolean open() {
		return util.connect();
	}

	public void close() {
		util.disconnect();
	}

	public String getRemotePath(String path, String name) {
		String s = path + "/" + name;
		s = s.replaceAll("//", "/");
		if (s.endsWith("/")) {
			s = s.substring(0, s.length() - 1);
		}
		s = uploadDir + s;
		return s;
	}

	public String getLocalPath(String path, String name) {
		String s = path + "/" + name;
		s = s.replaceAll("//", "/");
		if (s.endsWith("/")) {
			s = s.substring(0, s.length() - 1);
		}
		if (!tmpDir.isEmpty()) {
			s = tmpDir + "/" + s;
		}
		return s;
	}

	public boolean delete(String path, String fileName) {
		return util.delete(path, fileName);
	}

	public String upload(File tmpFile, String path) {
		return util.upload(tmpFile, path, tmpFile.getName());
	}

	public File download(String remotePath, String localPath) {
		if (localPath.startsWith(uploadDir)) {
			localPath = localPath.substring(uploadDir.length());

		}
		String s = util.download(tmpDir + "/" + localPath, remotePath);
		File file = null;
		if (s.equals("true")) {
			file = new File(tmpDir + "/" + localPath);
		} else {
			file = null;
		}
		return file;
	}

	public void downloadContainer(String remotePath, String localPath) {
		if (localPath.startsWith(uploadDir)) {
			localPath = localPath.substring(uploadDir.length());
		}
		util.download(localPath, remotePath);
	}

	public boolean deleteDir(String dir) {
		return util.deleteDir(dir);
	}

	public void removeTmpFiles(File file, String dir) {
		try {
			FileUtil.forceDelete(file);
			FileUtil.deleteDirectory(new File(dir));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getUploadDir() {
		return uploadDir;
	}

	public void setUploadDir(String uploadDir) {
		this.uploadDir = uploadDir;
	}

	public String getTmpDir() {
		return tmpDir;
	}

	public void setTmpDir(String tmpDir) {
		this.tmpDir = tmpDir;
	}

	public FtpUtil getUtil() {
		return util;
	}

	public void setUtil(FtpUtil util) {
		this.util = util;
	}

	
	public void uploadDir(File tmpFile, String toDir) {
		util.uploadDir(tmpFile, toDir);
	}

	
	public boolean delete(String path) {
		path = path.replaceAll("\\\\", "/");
		int i = path.lastIndexOf("/");
		if (i >= 0) {
			return delete(path.substring(0, i), path.substring(i + 1));
		} else {
			return delete("/", path);
		}
	}

	
	public boolean checkFileExistence(String path, String fileName) {
		return util.checkFileExistence(uploadDir + path, fileName);
	}

	
	public String upload(String filePathLocal, String filePathRemote,
			String fileNameRemote) {
		File tmpFile = new File(filePathLocal);
		if (filePathRemote.startsWith("/")) {
			filePathRemote = filePathRemote.substring(1);
		}
		return util.upload(tmpFile, uploadDir + filePathRemote, fileNameRemote);
	}

	
	public String getRelativePath(String path) {
		if (!uploadDir.isEmpty() && path.startsWith(uploadDir)) {
			return path.substring(uploadDir.length());
		}
		return path;
	}

	
	public void deleteTmpFile(File patchFile) {
		patchFile.delete();
	}

	
	public boolean isDirectory(String path) {
		return util.isDirectory(path);
	}

	public static String getProperty(String key) {
		return properties.getProperty(key);
	}
	public String getResourcePath() {
		return resourcePath;
	}

	public void setResourcePath(String resourcePath) {
		this.resourcePath = resourcePath;
	}
}
