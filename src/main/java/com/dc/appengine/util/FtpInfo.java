package com.dc.appengine.util;

import java.net.URI;
/**
 * ftp封装信息类
 * @author hannn
 *
 */
public class FtpInfo {
	private String ip;
	private int port;
	private String file;
	private String userName="";
	private String password="";
	public FtpInfo(String url){
		URI uri=URI.create(url);
		String schema=uri.getScheme();
		if(!"ftp".equals(schema)){
			System.out.println("not a ftp url");
			return ;
		}
		String userInfo=uri.getUserInfo();

		ip=uri.getHost();
		port=uri.getPort();
		if(port<=0){
			port=21;
		}
		file=uri.getPath();
		if(userInfo.contains(":")){
			userName=userInfo.split(":")[0];
			password=userInfo.split(":")[1];
		}else{
			userName=userInfo;
		}
	}
	
	
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
	public String getFile() {
		return file;
	}
	public void setFile(String file) {
		this.file = file;
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
	
}
