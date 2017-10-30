package com.dc.appengine.sparkInCD;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ftp")
public class FtpProperties {
	private String url;
    private String user;
    private String pwd;
    private String port;
    
    
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getPort() {
		return port;
	}
	public void setPort(String port) {
		this.port = port;
	}
	
	public String getFtpAddr(){
		return "ftp://"+this.user+":"+this.pwd+"@"+this.url+":"+this.port;
	}
}
