package com.dc.appengine.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;

import org.apache.commons.compress.archivers.ArchiveException;
import org.apache.commons.compress.archivers.ArchiveInputStream;
import org.apache.commons.compress.archivers.ArchiveStreamFactory;
import org.apache.commons.compress.archivers.jar.JarArchiveEntry;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.log4j.Logger;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

public class FtpUtil {
	private static Logger logger = Logger.getLogger(FtpUtil.class);
	private static byte[] _byte = new byte[1024] ;
	private String ip;
	private int port;
	private String userName;
	private String password;
	private FTPClient client;
	private String root;
	private String pwd;

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setTimeout(int timeout) {
		client.setConnectTimeout(timeout);
		client.setDataTimeout(timeout);
		client.setDefaultTimeout(timeout);
//		try {
//			client.setSoTimeout(timeout);
//		} catch (SocketException e) {
//			e.printStackTrace();
//		}
	}

	public FtpUtil() {
		client = new FTPClient();
	}

	/**
	 * ftp上传
	 * 
	 * @param is
	 *            本地数据流
	 * @param path
	 *            上传目的目录
	 * @param fileName
	 *            上传后保存名称
	 * @return
	 */
	public String upload(InputStream is, String path, String fileName) {
		if (fileName.startsWith("/")) {
			fileName = fileName.substring(1);
		}
		try {
			cdRoot();
			cd(path);
			client.setBufferSize(1024);
			client.setControlEncoding("UTF-8");
			client.setFileType(FTP.BINARY_FILE_TYPE);
			client.enterLocalPassiveMode();
			boolean result = client.appendFile(fileName, is);
			if (!result) {
				logger.error("FTP 上传数据失败！");
			}
			return String.valueOf(result);
		} catch (IOException e) {
			logger.error("FTP 上传数据出错！", e);
			e.printStackTrace();
		}
		return "false";
	}
	
	public static boolean deleteFile(FtpInfo ftp, String filePath) {
		FTPClient ftpClient = getClient(ftp);
		boolean re = false;
		try {
			// 250 删除成功 550 删除失败
			re = ftpClient.deleteFile(filePath);
			if (!re) {
				int ddt = ftpClient.rmd(filePath);
				if (ddt == 250) {
					re = true;
				}
			}
			System.out.println(ftpClient.user("paas"));
		} catch (IOException e) {
			logger.error("delete  failed");
		} finally {
			try {
				ftpClient.disconnect();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return re;
	}
	
	public static void zipFile(String zip, String srcPath) {
		try {
			File zipFile = new File(zip);
			if(zipFile.exists()){
				zipFile.delete();
			}
			File source = new File(srcPath);
			File[] srcFiles = source.listFiles();
			if (zip.endsWith(".zip") || zip.endsWith(".ZIP")) {
				ZipOutputStream _zipOut =null;
				try {
					_zipOut = new ZipOutputStream(new FileOutputStream(zipFile));
					_zipOut.setEncoding("GBK");
					for (File _f : srcFiles) {
						handlerFile(zip, _zipOut, _f, "");
					}
				} finally {
					if(_zipOut !=null){
						_zipOut.close();
					}
				}
				for (File _f : srcFiles) {
					delDirectory(_f);
				}
			} else {
				System.out.println("target file[" + zip + "] is not .zip type file");
			}
		} catch (FileNotFoundException e) {
		} catch (IOException e) {
		}
	}
	
	public static void delDirectory(File dir) {
		if (dir.isDirectory()) {
			File[] delFile = dir.listFiles();
			if (delFile.length == 0) { // 若目录下没有文件则直接删除
				dir.delete();
			} else {
				for (File subFile : delFile) {
					if (subFile.isDirectory()) {
						delDirectory(subFile); // 递归删除 (若有子目录的话)
					} else {
						subFile.delete();
					}
				}
			}
		}
		dir.delete();
	}
	
	private static void handlerFile(String zip, ZipOutputStream zipOut, File srcFile, String path) throws IOException {
		System.out.println(" begin to compression file[" + srcFile.getName() + "]");
		if (!"".equals(path) && !path.endsWith(File.separator)) {
			path += File.separator;
		}
		if (!srcFile.getPath().equals(zip)) {
			if (srcFile.isDirectory()) {
				File[] _files = srcFile.listFiles();
				if (_files.length == 0) {
					zipOut.putNextEntry(new ZipEntry(path + srcFile.getName() + File.separator));
					zipOut.closeEntry();
				} else {
					for (File _f : _files) {
						handlerFile(zip, zipOut, _f, path + srcFile.getName());
					}
				}
			} else {
				InputStream _in =null;
				try {
				    _in = new FileInputStream(srcFile);
					zipOut.putNextEntry(new ZipEntry(path + srcFile.getName()));
					int len = 0;
					while ((len = _in.read(_byte)) > 0) {
						zipOut.write(_byte, 0, len);
					}
				} finally {
					if(_in !=null){
						_in.close();
					}
					if(zipOut !=null){
						zipOut.closeEntry();
					}
					// TODO: handle finally clause
				}
			}
		}
	}
	
	public static void moveFile(String srcPath, String destDirPath, String remoteName) {
		File srcFile = FileUtil.createDirectory(srcPath + File.separator + remoteName);
		File destDir = FileUtil.createDirectory(destDirPath);

		InputStream is = null;
		OutputStream os = null;
		int resp = 0;

		if (srcFile.exists() && destDir.exists() && destDir.isDirectory()) {
			try {
				is = new FileInputStream(srcFile);
				String destFile = destDirPath + File.separator + remoteName;
				File dFile = new File(destFile);
				if (dFile.exists()) {
					dFile.delete();
				}
				dFile.createNewFile();
				os = new FileOutputStream(dFile);
				byte[] buffer = new byte[1024];
				while ((resp = is.read(buffer)) != -1) {
					os.write(buffer, 0, resp); // 注意此处不能用os.write(buffer),会出现多写乱码
												// resp表示有多少读取多少字节数
				}
				os.flush();
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}finally{
				if(os !=null){
					try {
						os.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				if(is !=null){
					try {
						is.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		}
	}
	
	public static void cleanDirectory(File directory, String type) throws IOException {
		if (!directory.exists()) {
			String message = directory + " does not exist";
			throw new IllegalArgumentException(message);
		}

		if (!directory.isDirectory()) {
			String message = directory + " is not a directory";
			throw new IllegalArgumentException(message);
		}

		File[] files = directory.listFiles();
		if (files == null) { // null if security restricted
			throw new IOException("Failed to list contents of " + directory);
		}

		IOException exception = null;
		for (int i = 0; i < files.length; i++) {
			File file = files[i];
			try {
				if (type != null && file.getName().endsWith(type)) {
					forceDelete(file);
				} else {
					forceDelete(file);
				}
			} catch (IOException ioe) {
				exception = ioe;
			}
		}

		if (null != exception) {
			throw exception;
		}
	}
	
	public static void forceDelete(File file) throws IOException {
    	if(!file.exists())
    		return;
        if (file.isDirectory()) {
            deleteDirectory(file);
        } else {
            if (!file.delete()) {
                String message =
                    "Unable to delete file: " + file;
                throw new IOException(message);
            }
        }
    }
	
	public static void cleanDirectory(File directory) throws IOException {
        if (!directory.exists()) {
            String message = directory + " does not exist";
            throw new IllegalArgumentException(message);
        }

        if (!directory.isDirectory()) {
            String message = directory + " is not a directory";
            throw new IllegalArgumentException(message);
        }

        File[] files = directory.listFiles();
        if (files == null) {  // null if security restricted
            throw new IOException("Failed to list contents of " + directory);
        }

        IOException exception = null;
        for (int i = 0; i < files.length; i++) {
            File file = files[i];
            try {
                forceDelete(file);
            } catch (IOException ioe) {
                exception = ioe;
            }
        }

        if (null != exception) {
            throw exception;
        }
    }
	
	public static void deleteDirectory(File directory) throws IOException {
        if (!directory.exists()) {
            return;
        }

        cleanDirectory(directory);
        if (!directory.delete()) {
            String message =
                "Unable to delete directory " + directory + ".";
            throw new IOException(message);
        }
    }
	
	private static void deleteDirectoryOnExit(File directory) throws IOException {
		if (!directory.exists()) {
			return;
		}

		cleanDirectoryOnExit(directory);
		directory.deleteOnExit();
	}
	
	private static void cleanDirectoryOnExit(File directory) throws IOException {
        if (!directory.exists()) {
            String message = directory + " does not exist";
            throw new IllegalArgumentException(message);
        }

        if (!directory.isDirectory()) {
            String message = directory + " is not a directory";
            throw new IllegalArgumentException(message);
        }

        File[] files = directory.listFiles();
        if (files == null) {  // null if security restricted
            throw new IOException("Failed to list contents of " + directory);
        }

        IOException exception = null;
        for (int i = 0; i < files.length; i++) {
            File file = files[i];
            try {
                forceDeleteOnExit(file);
            } catch (IOException ioe) {
                exception = ioe;
            }
        }

        if (null != exception) {
            throw exception;
        }
    }
	
	public static void forceDeleteOnExit(File file) throws IOException {
        if (file.isDirectory()) {
            deleteDirectoryOnExit(file);
        } else {
            file.deleteOnExit();
        }
    }
	
	public static Boolean unZipFile(String filePath, String targetPath) {
		File warFile = new File(filePath);
		Boolean result = true;
		BufferedInputStream bufferedInputStream =null;
		ArchiveInputStream in =null;
		try {
			// 获得输出流
			bufferedInputStream = new BufferedInputStream(new FileInputStream(warFile));
			in = new ArchiveStreamFactory().createArchiveInputStream(ArchiveStreamFactory.JAR,
					bufferedInputStream);
			JarArchiveEntry entry = null;
			// 循环遍历解压
			while ((entry = (JarArchiveEntry) in.getNextEntry()) != null) {
				if (entry.isDirectory()) {
					new File(targetPath, entry.getName()).mkdir();
				} else {
					OutputStream out = null;
					try {
						out = FileUtils.openOutputStream(new File(targetPath, entry.getName()));
						IOUtils.copy(in, out);
					} finally {
						if(out !=null){
							out.close();
						}
					}
				}
			}
			in.close();
			in= null;
		} catch (FileNotFoundException e) {
			System.err.println("未找到war文件");
			result = false;
		} catch (ArchiveException e) {
			System.err.println("不支持的压缩格式");
			result = false;
		} catch (IOException e) {
			System.err.println("文件写入发生错误");
			result = false;
		}finally{
			if(in !=null){
				try {
					in.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(bufferedInputStream !=null){
				try {
					bufferedInputStream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return result;
	}
	
	public static Boolean download(FtpInfo ftp, String localPath, String remotePath) {
		FileOutputStream fos = null;
		FTPClient ftpClient = getClient(ftp);
		try {
			File localFile = new File(localPath);
			File parent = localFile.getParentFile();
			if (!parent.exists()) {
				parent.mkdirs();
			} else {
				if (localFile.exists()) {
					localFile.delete();
				}
			}
			fos = new FileOutputStream(localFile);
			ftpClient.setBufferSize(1024);
			ftpClient.setControlEncoding("UTF-8");
			ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
			ftpClient.enterLocalPassiveMode();
			if (ftpClient.retrieveFile("/" + remotePath, fos)) {
				return true;
			} else {
				logger.error("FTP 下载文件失败！");
			}
		} catch (IOException e) {
			logger.error("FTP 下载文件出错！", e);
			e.printStackTrace();
		} finally {
			if (fos != null) {
				try {
					fos.flush();
					fos.close();

				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return false;
	}
	
	public static FTPClient getClient(FtpInfo info) {
		FTPClient ftpClient = new FTPClient();
		logger.debug("初始化ftp客户端.....");
		ftpClient.setControlEncoding("UTF-8");
		ftpClient.setDefaultPort(info.getPort());
		ftpClient.setDataTimeout(120000);
		ftpClient.setBufferSize(1024);
		logger.debug("ftp 开始连接....");
		try {
			ftpClient.connect(info.getIp());
		} catch (SocketException e) {
			logger.debug("ftp 连接失败" + e.getMessage());
			return null;
		} catch (IOException e) {
			logger.debug("ftp 连接失败" + e.getMessage());
			return null;
		}
		try {
			logger.debug("ftp 登录....");
			ftpClient.login(info.getUserName(), info.getPassword());
		} catch (IOException e) {
			logger.debug("ftp 登录失败" + e.getMessage());
		}
		try {
			ftpClient.initiateListParsing("/");
		} catch (Exception e) {
			try {
				ftpClient.disconnect();
			} catch (IOException e1) {
			}
			logger.debug("ftp 登录失败" + e.getMessage());
			return null;
		}
		return ftpClient;

	}
	
	public static boolean upload(FtpInfo ftp, String localFile) {
		FTPClient ftpClient = getClient(ftp);
		File localF = new File(localFile);
		if (!localF.exists()) {
			return false;
		}
		if (ftpClient == null) {
			logger.debug("connect ftp error!");
			return false;
		}
		InputStream ins = null;
		String filePath = ftp.getFile();
		try {
			if (filePath != null) {
				String remotePath = filePath.substring(0, filePath.lastIndexOf("/"));
				File remoteF = new File(remotePath);
				if (!remoteF.exists()) {
					ftpClient.mkd(remotePath);
				}
			}
			ins = new FileInputStream(localF);
			ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
			ftpClient.storeFile(ftp.getFile(), ins);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		} finally {
			try {
				ftpClient.disconnect();
			} catch (IOException e) {
				e.printStackTrace();
			}
			if (ins != null) {
				try {
					ins.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return true;
	}

	public boolean rename(String path, String oldName, String newName) {
		try {
			cdRoot();
			cd(path);
			boolean result = client.rename(oldName, newName);
			if (!result) {
				logger.error("FTP 重命名文件失败！");
			}
			return result;
		} catch (IOException e) {
			logger.error("FTP 重命名文件出错！", e);
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * ftp上传文件
	 * 
	 * @param file
	 *            本地文件
	 * @param destDir
	 *            上传目的目录
	 * @param destName
	 *            上传后保存名称
	 * @return
	 */
	public String upload(File file, String path, String destName) {
//		logger.info("ftp upload dest name: " + destName);
		if (destName.startsWith("/")) {
			destName = destName.substring(1);
		}
		InputStream is = null;
		try {
			is = new FileInputStream(file);
//			logger.info("before cdRoot() pwd: "
//					+ client.printWorkingDirectory());
			cdRoot();
//			logger
//					.info("after cdRoot() pwd: "
//							+ client.printWorkingDirectory());
			cd(path);
//			logger.info("after cd(" + path + ") pwd: "
//					+ client.printWorkingDirectory());
			client.setBufferSize(1024);
			client.setControlEncoding("UTF-8");
			client.setFileType(FTP.BINARY_FILE_TYPE);
			client.enterLocalPassiveMode();
			boolean result = client.storeFile(destName, is);
			if (!result) {
				logger.error("FTP 上传文件失败！");
			}
			return String.valueOf(result);
		} catch (FileNotFoundException e) {
			logger.error("创建文件输入流失败！", e);
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return "false";
	}

	/**
	 * ftp下载
	 * 
	 * @param localPath
	 *            下载后本地保存路径
	 * @param remotePath
	 *            远程文件路径
	 * @return
	 */
	public String download(String localPath, String remotePath) {
		FileOutputStream fos = null;
		try {
			File localFile = new File(localPath);
			File parent = localFile.getParentFile();
			if (!parent.exists()) {
				parent.mkdirs();
			} else {
				if (localFile.exists()) {
					localFile.delete();
				}
			}
			fos = new FileOutputStream(localFile);
			client.setBufferSize(1024);
			client.setControlEncoding("UTF-8");
			client.setFileType(FTP.BINARY_FILE_TYPE);
			client.enterLocalPassiveMode();
			if (client.retrieveFile("/"+remotePath, fos)) {
				return "true";
			} else {
				logger.error("FTP 下载文件失败！");
			}
		} catch (IOException e) {
			logger.error("FTP 下载文件出错！", e);
			e.printStackTrace();
		} finally {
			if (fos != null) {
				try {
					fos.flush();
					fos.close();

				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return "false";
	}

	public InputStream download(String remotePath) {
		try {
			client.setBufferSize(1024);
			client.setControlEncoding("UTF-8");
			client.enterLocalPassiveMode();
			InputStream is = client.retrieveFileStream(remotePath);
			client.completePendingCommand();
			return is;
		} catch (IOException e) {
			logger.error("FTP 下载出错！", e);
			e.printStackTrace();
		}
		return null;
	}

	public boolean connect() {
		try {
			client.connect(ip, port);
			boolean result = client.login(userName, password);
			if (!result) {
				logger.error("FTP 登陆失败！");
			} else {
				root = client.printWorkingDirectory();
				pwd = root;
			}
			return result;
		} catch (IOException e) {
			logger.error("FTP 连接异常！", e);
			e.printStackTrace();
		}
		return false;
	}

	public boolean disconnect() {
		try {
			boolean result = client.logout();
			if (!result) {
				logger.error("FTP 退出登陆失败！");
			}
			client.disconnect();
			return result;
		} catch (IOException e) {
			logger.error("FTP连接关闭异常！", e);
			e.printStackTrace();
		}
		return false;
	}

	public void cd(String dir) {
		try {
			dir = dir.replaceAll("\\\\", "/");
			String[] dirs = dir.split("/");
			for (String d : dirs) {
				if (!client.changeWorkingDirectory(d)) {
					boolean b = false;
					try {
						b = client.makeDirectory(d);
					} catch (Exception e) {
						logger.error("FTP 创建路径失败: " + d);
						e.printStackTrace();
					}
					if (b) {
						boolean result = client.changeWorkingDirectory(d);
						if (!result) {
							logger.error("FTP 切换路径失败: " + d);
							break;
						}
						pwd = client.printWorkingDirectory();
					} else {
						break;
					}
				}
			}
		} catch (IOException e) {
			logger.error("FTP 切换路径出错！", e);
			e.printStackTrace();
		}
	}

	public void cdup() {
		try {
			boolean result = client.changeToParentDirectory();
			if (!result) {
				logger.error("FTP 切换到上级目录失败！");
			}
			pwd = client.printWorkingDirectory();
		} catch (IOException e) {
			logger.error("FTP 切换到上级目录出错！", e);
			e.printStackTrace();
		}
	}

	public boolean mkdirs(String dirs) {
		try {
			dirs = new String(dirs.getBytes(), "ISO-8859-1");
			String[] d = dirs.split("/");
			if (d.length > 0) {
				for (int i = 0; i < d.length; i++) {
					if (d[i].equals(".") || d[i].equals("/")) {
						continue;
					}
					if (!client.changeWorkingDirectory(d[i])) {
						boolean result = client.makeDirectory(d[i]);
						if (!result) {
							logger.error("FTP 创建目录失败: " + dirs);
							break;
						}
						client.changeWorkingDirectory(d[i]);
						pwd = client.printWorkingDirectory();
					}
				}
			}
			return true;
		} catch (IOException e) {
			logger.error("FTP 创建路径出错！", e);
			e.printStackTrace();
		}
		return false;
	}

	public boolean delete(String path, String fileName) {
		try {
			cdRoot();
			cd(path);
			boolean result = client.deleteFile(fileName);
			if (!result) {
				boolean exist = checkFileExistence(path, fileName);
				if (exist) {
					logger.error("FTP 删除文件失败！文件：" + path + "/" + fileName);
				}
			}
			return result;
		} catch (IOException e) {
			logger.error("FTP 删除文件出错！文件：" + path + "/" + fileName, e);
			e.printStackTrace();
		}
		return false;
	}

	public String pwd() {
		return pwd;
	}

	private void cdRoot() {
		try {
			boolean result = client.changeWorkingDirectory(root);
			if (!result) {
				logger.error("FTP 切换到根目录失败！");
			}
			pwd = client.printWorkingDirectory();
		} catch (IOException e) {
			logger.error("FTP 切换到根目录出错！", e);
			e.printStackTrace();
		}
	}

	public String downloadDir(String tmpFilePath, String toDir) {
		File f = new File(toDir);
		f.mkdirs();
		try {
			cdRoot();
			cd(tmpFilePath);
			client.setListHiddenFiles(true);
			client.enterLocalPassiveMode();
			FTPFile[] files = client.listFiles();
			if (files != null && files.length > 0) {
				for (FTPFile file : files) {
					if (file.getName().equals(".")
							|| file.getName().equals("..")) {
						continue;
					}
					if (file.isDirectory()) {
						downloadDir(tmpFilePath + "/" + file.getName(), toDir
								+ "/" + file.getName());
						cdup();
					} else {
						download(f.getAbsolutePath() + "/" + file.getName(),
								file.getName());
					}
				}
			}
			client.setListHiddenFiles(false);
			return f.getPath();
		} catch (IOException e) {
			logger.error("FTP 下载目录出错！", e);
			e.printStackTrace();
		}
		return null;
	}

	public void uploadDir(File dir, String toDir) {
		cdRoot();
		mkdirs(toDir);
		try {
			File[] files = dir.listFiles();
			if (files != null && files.length > 0) {
				for (File f : files) {
					if (f.isDirectory()) {
						uploadDir(f, toDir + "/" + f.getName());
						cdup();
					} else {
						delete(toDir, f.getName());
						uploadToCurDir(f, f.getName());
					}
				}
			}
		} catch (Exception e) {
			logger.error("FTP 上传目录出错！", e);
			e.printStackTrace();
		}
	}

	private boolean uploadToCurDir(File f, String name) {
		InputStream is = null;
		try {
			is = new FileInputStream(f);
			client.printWorkingDirectory();
			client.setBufferSize(1024);
			client.setControlEncoding("UTF-8");
			client.setFileType(FTP.BINARY_FILE_TYPE);
			client.enterLocalPassiveMode();
			boolean result = client.storeFile(name, is);
			if (!result) {
				logger.error("FTP 上传到当前目录失败！");
			}
			return result;
		} catch (IOException e) {
			logger.error("FTP 上传到当前目录出错！", e);
			e.printStackTrace();
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return false;
	}

	public boolean deleteDir(String dir) {
		try {
			cdRoot();
			cd(dir);
			client.setListHiddenFiles(true);
			client.enterLocalPassiveMode();
			FTPFile[] files = client.listFiles();
			if (files != null && files.length > 0) {
				for (FTPFile file : files) {
					if (file.getName().equals(".")
							|| file.getName().equals("..")) {
						continue;
					}
					if (file.isDirectory()) {
						deleteDir(dir + "/" + file.getName());
					} else {
						delete(dir, file.getName());
					}
				}
			}
			client.setListHiddenFiles(false);
			cdup();
			if (dir.endsWith("/")) {
				dir = dir.substring(0, dir.length() - 1);
			}
			String pathName = dir.substring(dir.lastIndexOf("/") + 1);
			boolean b = client.removeDirectory(pathName);
			if (!b) {
				logger.error("FTP 删除目录失败: " + dir);
			}
			return b;
		} catch (IOException e) {
			logger.error("FTP 删除目录出错！", e);
			e.printStackTrace();
		}
		return false;
	}

	public boolean checkFileExistence(String path, String fileName) {
		try {
			cdRoot();
			cd(path);
			String[] names = client.listNames();
			if (names != null && names.length > 0) {
				for (String s : names) {
					if (fileName.equals(s)) {
						return true;
					}
				}
			}
			return false;
		} catch (IOException e) {
			logger.error("FTP 检查文件是否存在出错！", e);
			e.printStackTrace();
		}
		return false;
	}

	public String getRoot() {
		return root;
	}

	public void setRoot(String root) {
		this.root = root;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public boolean isDirectory(String path) {
		try {
			cdRoot();
			client.setBufferSize(1024);
			client.setControlEncoding("UTF-8");
			client.enterLocalPassiveMode();
			FTPFile[] files = client.listFiles(path);
			if (files != null && files.length > 0) {
				if (files.length == 1 && files[0].isFile()
						&& path.endsWith(files[0].getName())) {
					return false;
				}
			}
			return true;
		} catch (IOException e) {
		}
		return false;
	}
	
	public static boolean fileExists(FtpInfo ftp, String filePath) {
		FTPClient ftpClient = getClient(ftp);
		File fileObj = new File(filePath);
		String fileName = fileObj.getName();
		if (fileName == null || "".equals(fileName)) {
			return false;
		}
		String parentPath = fileObj.getParent();
		System.out.println(parentPath + "   " + fileName);
		try {
			ftpClient.changeWorkingDirectory(parentPath);
			FTPFile[] ftpfiles = ftpClient.listFiles();
			for (FTPFile file : ftpfiles) {
				if (fileName.equals(file.getName())) {
					return true;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}
}
