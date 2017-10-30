package com.dc.appengine.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dc.appengine.ConfigUtil;

public class FileWorker {
	private static FileWorker instance = null;
	public String workDir = null;

	public static FileWorker getInstance() {
		synchronized (FileWorker.class) {
			if (instance == null) {
				instance = new FileWorker();
			}
			return instance;
		}
	}

	private FileWorker() {
		// 获取workdir
		workDir = ConfigUtil.configs.getProperty("workPath");
		if (workDir == null || "".equals(workDir)) {
			log.error("cannot get the upload tempdir");
			return;
		}
		clear();
		// 初始化线程池 用来加载倒计时任务
	}

	private static Logger log = LoggerFactory.getLogger(FileWorker.class);

	public void clear() {
		if (workDir.length() == 1) {
			return;
		}
		if ("/home".equals(workDir) || "/root".equals(workDir)) {
			return;
		}
		File dir = new File(workDir);
		if (!dir.exists() || !dir.isDirectory()) {
			return;
		}
		for (File file : dir.listFiles()) {
			try {
				FileUtil.forceDelete(file);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public String uploadFileForNextOp(InputStream is, String fileName) {
		print("receiving file[" + fileName + "] from client");
		String fileId = UUID.randomUUID().toString();
		String destFilePath = workDir + "/" + fileId;
		File f = new File(destFilePath);
		if (!f.exists()) {
			f.mkdirs();
		}
		boolean writeOk = writeFile(is, destFilePath + "/" + fileName);
		if (!writeOk) {
			return "";
		}
		print(fileName + " upload ok");
		return fileId;

	}

	private boolean writeFile(InputStream is, String destPath) {
		FileOutputStream out = null;
		try {
			File destFile = new File(destPath);
			destFile.createNewFile();
			out = new FileOutputStream(destFile);
			byte[] buffer = new byte[1024];
			int rc = 0;
			while ((rc = is.read(buffer, 0, buffer.length)) > 0) {
				out.write(buffer, 0, rc);
			}
			out.flush();
		} catch (Exception e) {
			log.error("文件写入失败");
			return false;
		} finally {
			try {
				is.close();
				if (out != null) {
					out.close();
				}
			} catch (IOException e1) {

			}
		}
		return true;
	}

	public static void print(String msg) {
		System.out.println(msg);
		log.debug(msg);
	}

	public String getWorkSource(String fileId) {
		String workRoot = ConfigUtil.configs.getProperty("workPath");
		File workDir = new File(workRoot + File.separator + fileId);
		if (!workDir.exists() || !workDir.isDirectory()) {
			log.error("work dir is not found");
			return null;
		}
		File[] files = workDir.listFiles();
		if (files.length == 1) {
			return files[0].getName();
		} else {
			log.error("file num in workdir [" + workDir.getAbsolutePath() + "] is not 1");
		}
		return null;
	}

	// upload file
	public boolean uploadFileToftp(String workId, String remoteUrl, boolean deleteWork) {
		String workDir = ConfigUtil.configs.getProperty("workPath");
		String ftpHome = ConfigUtil.configs.getProperty("ftphome");
		boolean needUpload = false;
		if (ftpHome == null || "".equals(ftpHome.trim()) || "false".equals(ftpHome)) {
			needUpload = true;
		}

		File dir = new File(workDir + "/" + workId);
		if (!dir.exists() || !dir.isDirectory()) {
			print("local folder not found");
			return false;
		}

		String localFileName = getWorkSource(workId);
		String localFileFullPath = workDir + "/" + workId + "/" + localFileName;

		FtpInfo ftp = new FtpInfo(remoteUrl);
		print("start to upload file[" + localFileFullPath + "] to " + remoteUrl);
		if (needUpload) {
			boolean re = FtpUtil.upload(ftp, localFileFullPath);
			if (!re) {
				print("upload file[" + localFileFullPath + "] error");
				return re;
			} else {
				print("upload file[" + localFileFullPath + "] ok");
			}
		} else {

			String ftpPath = ftpHome + "/" + ftp.getFile();
			print("start tp upload(cp) file[" + localFileFullPath + "] ->" + ftpPath);
			boolean copyr = CopyFileUtil.copyFile(localFileFullPath, ftpPath, true);
			if (!copyr) {
				print("upload file[" + localFileFullPath + "] error");
				return copyr;
			}
			print("copy result is" + copyr);
		}

		if (deleteWork) {
			try {
				FileUtil.forceDelete(dir);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return true;
	}
}
