/**
 * Copyright 2000-2012 DigitalChina. All Rights Reserved.
 */
package com.dc.appengine.util;

import org.apache.commons.compress.archivers.ArchiveException;
import org.apache.commons.compress.archivers.ArchiveInputStream;
import org.apache.commons.compress.archivers.ArchiveStreamFactory;
import org.apache.commons.compress.archivers.jar.JarArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipFile;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

import java.io.*;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.*;

/**
 * 文件工具类
 * @author liubingj
 */
public class FileUtil {
	
	private static Logger LOG = Logger.getLogger( FileUtil.class );
	 private static byte[] _byte = new byte[1024] ;
	private static final FileUtil SINGLE_INSTANCE = new FileUtil();
	
	public static FileUtil getInstance() {
		return SINGLE_INSTANCE;
	}
	
	public static File createDirectory(String tpmPathStr){
		File path=new File(tpmPathStr);
		if(!path.exists()){
			path.mkdirs();
		}
		return path;
	}

	/**
	 * @param file
	 */
	public String read( File file, String charset ) {
		final byte[] content = read( file );
		return content == null ? "" : new String( content );
	}
	
	public byte[] read( File file ) {
		if ( ! ( file.exists() && file.isFile() ) ) {
			throw new IllegalArgumentException( "The file not exist or not a file" );
		}
		FileInputStream fis = null;
		byte[] content = null;
		try {
			fis = new FileInputStream( file );
			content = new byte[ fis.available() ];
			fis.read( content );
		} catch ( FileNotFoundException e ) {
			LOG.error( e.getMessage(), e );
		} catch ( IOException e ) {
			LOG.error( e.getMessage(), e );
		} finally {
			if ( fis != null ) {
				try {
					fis.close();
				} catch ( IOException e ) {
					LOG.error( e.getMessage(), e );
				}
				fis = null;
			}
		}
		return content;
	}

	
	//解析spark应用包
		public static List parsePackage(String file,Map<String,String> provinceMap){
			Boolean error = false;
			String message = "";
			Map<String,Map> record = new HashMap<>();
			Map<String,Map> functionConfigRecord = new HashMap<>();
			try (ZipFile zip = new ZipFile(file)) {
				Enumeration<ZipArchiveEntry> zipArchives = zip.getEntries();
				while(zipArchives.hasMoreElements()) {
					ZipArchiveEntry zae = zipArchives.nextElement();
					String name = zae.getName();
					if(name.equals("config/function_list.properties")){
						List<String> list = IOUtils.readLines(zip.getInputStream(zae),"utf-8");
						for(String line:list){
							if(line.startsWith("#")){
								continue;
							}
							String[] each = line.split(" ");
							if(each.length !=3){
								System.out.println("skip function:"+line);
								continue;
							}
							String functionMark = each[0];
							String functionName = each[1];
							String description = each[2];
							Map<String,Object> eachFun = new HashMap<>();
							eachFun.put("functionMark",functionMark);
							eachFun.put("functionName",functionName);
							eachFun.put("description",description);
							eachFun.put("functionConfigs",new HashMap<>());
							record.put(functionMark,eachFun);
						}
					}else if(name.startsWith("config/") && name.endsWith(".properties")){
						String simpleName = name.replaceFirst("config/","").replace(".properties","");
						String[] strs = simpleName.split("_");
						if(strs.length != 2){
							error = true;
							message="配置文件:"+simpleName+"有误";
							List l = new ArrayList();
							l.add(error);
							l.add(message);
							return l;
						}
						String mark = strs[0];
						String province = strs[1];
						if(!functionConfigRecord.containsKey(mark)){
							functionConfigRecord.put(mark,new HashMap<String,Object>());
						}
						Map<String,Object> functionConfigs = functionConfigRecord.get(mark);
						Properties properties = new Properties();
						properties.load(zip.getInputStream(zae));
						Map<String,String> systemParams = new HashMap<>();
						Map<String,String> serviceParams = new HashMap<>();
						Map<String,Object> funConfig = new HashMap<>();
						if(!provinceMap.containsKey(province)){
							error = true;
							message="配置文件:"+simpleName+"有误";
							List l = new ArrayList();
							l.add(error);
							l.add(message);
							return l;
						}
						String provinceName = provinceMap.get(province);
						functionConfigs.put(provinceName,funConfig);
						funConfig.put("systemParams",systemParams);
						funConfig.put("serviceParams",serviceParams);
						for(Map.Entry<Object,Object> entry:properties.entrySet()){
							String key = (String) entry.getKey();
							String val = (String) entry.getValue();
							if(key.startsWith("system.")){
								systemParams.put(key.replaceFirst("system.",""),val);
							}else{
								serviceParams.put(key,val);
							}
						}

					}
				}
				//遍历完成
				for(Map.Entry<String,Map> r:record.entrySet()){
					String mark = r.getKey();
					Map eachFun = r.getValue();
					if(functionConfigRecord.containsKey(mark)){
						Map map = (Map) eachFun.get("functionConfigs");
						map.putAll(functionConfigRecord.get(mark));
					}
				}
				List list = new ArrayList();
				list.addAll(record.values());
				return list;
			}catch (Exception e){
				e.printStackTrace();
			}
			return null;
		}
		public static Boolean unZipFile(String filePath,String targetPath){
			File warFile = new File(filePath);
			Boolean result=true;
			try {
				//获得输出流
				BufferedInputStream bufferedInputStream = new BufferedInputStream(
						new FileInputStream(warFile));
				ArchiveInputStream in = new ArchiveStreamFactory()
						.createArchiveInputStream(ArchiveStreamFactory.JAR,
								bufferedInputStream);
				JarArchiveEntry entry = null;
				//循环遍历解压
				while ((entry = (JarArchiveEntry) in.getNextEntry()) != null) {
					if (entry.isDirectory()) {
						new File(targetPath, entry.getName()).mkdir();
					} else {
						OutputStream out = FileUtils.openOutputStream(new File(
								targetPath, entry.getName()));
						IOUtils.copy(in, out);
						out.close();
					}
				}
				in.close();
			} catch (FileNotFoundException e) {
				System.err.println("未找到war文件");
				result=false;
			} catch (ArchiveException e) {
				System.err.println("不支持的压缩格式");
				result=false;
			} catch (IOException e) {
				System.err.println("文件写入发生错误");
				result=false;
			}
			return result;
		}		
		public static void writeFile(String filePath,String content,String fileName) {
	        FileOutputStream fos = null;
	        try {
	        	File file = new File(filePath+File.separator+fileName);
	        	File fileParent=new File(file.getParent());
	        	if(!fileParent.exists()){
	        		fileParent.mkdirs();
	        	}
	        	if(file.exists()){
	        		file.delete();
	        	}
	            fos = new FileOutputStream(file);
	            byte[] in=content.getBytes("utf-8");
	            fos.write(in);
	            fos.flush();
	        } catch (IOException e) {
	            e.printStackTrace();
	        } finally {
	            try {
	            	if(fos !=null)
	            	fos.close();
	            } catch (IOException e) {
	                e.printStackTrace();
	            }
	        }
	    }
		/**
		 * 压缩文件或路径
		 * 
		 * @param zip
		 *            压缩的目的地址
		 * @param srcFiles
		 *            压缩的源文件
		 */
		public static void zipFile(String zip, String srcPath) {
			try {
				File source = new File(srcPath);
				File[] srcFiles = source.listFiles();
				if (zip.endsWith(".zip") || zip.endsWith(".ZIP")) {
					ZipOutputStream _zipOut = new ZipOutputStream(new FileOutputStream(new File(zip)));
					_zipOut.setEncoding("GBK");
					for (File _f : srcFiles) {
						handlerFile(zip, _zipOut, _f, "");
					}
					_zipOut.close();
				} else {
					System.out.println("target file[" + zip + "] is not .zip type file");
				}
			} catch (FileNotFoundException e) {
			} catch (IOException e) {
			}
		}

		/**
		 * @param zip
		 *            压缩的目的地址
		 * @param zipOut
		 * @param srcFile
		 *            被压缩的文件信息
		 * @param path
		 *            在zip中的相对路径
		 * @throws IOException
		 */
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
					InputStream _in = new FileInputStream(srcFile);
					zipOut.putNextEntry(new ZipEntry(path + srcFile.getName()));
					int len = 0;
					while ((len = _in.read(_byte)) > 0) {
						zipOut.write(_byte, 0, len);
					}
					_in.close();
					zipOut.closeEntry();
				}
			}
		}
		
		/**
		 * 删除临时目录及其下所有文件
		 * @param dir
		 * @return
		 */
		public static void delDirectory(File dir) {
			
			if(dir.isDirectory()){
				File[] delFile = dir.listFiles();
				if(delFile.length==0) {  //若目录下没有文件则直接删除
					dir.delete();
				}else {
					for(File subFile : delFile) {
						if(subFile.isDirectory()){
							delDirectory(subFile);  //递归删除 (若有子目录的话)
						}else {
							subFile.delete();
						}
					}
				}
			}
			dir.delete();
			
		}
		public static void delFile(File file){
			if(file.exists()){
				if(file.isFile()){
					file.delete();
				} else {
					File[] files = file.listFiles();
					for(File f:files){
						delFile(f);
					}
					file.delete();
				}
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
}
