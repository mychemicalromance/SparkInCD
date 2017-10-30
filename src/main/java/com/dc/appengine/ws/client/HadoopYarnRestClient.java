package com.dc.appengine.ws.client;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

import org.glassfish.jersey.client.ClientProperties;

import com.dc.appengine.ConfigUtil;

public class HadoopYarnRestClient {
	
	private static WebTarget webResource;
	private static WebTarget webResource2;
	
	public synchronized static WebTarget getWebResource(){
		if( webResource == null ){
			Client client = ClientBuilder.newClient();
			String CONNECTYARN_TIMEOUT = ConfigUtil.configs.getProperty("CONNECTYARN_TIMEOUT");
			if(CONNECTYARN_TIMEOUT==null || CONNECTYARN_TIMEOUT.equals("")){
				CONNECTYARN_TIMEOUT = "2000";
			}
			String READDATA_TIMEOUT = ConfigUtil.configs.getProperty("READDATA_TIMEOUT");
			if(READDATA_TIMEOUT == null || READDATA_TIMEOUT.equals("")){
				READDATA_TIMEOUT = "2000";
			}
			client.property(ClientProperties.CONNECT_TIMEOUT,Integer.valueOf(CONNECTYARN_TIMEOUT));
			client.property(ClientProperties.READ_TIMEOUT,Integer.valueOf(READDATA_TIMEOUT));
			webResource = client.target("http://"+ 
					ConfigUtil.configs.getProperty("hadoop-yarnIp")+":" +ConfigUtil.configs.getProperty("hadoop-yarnPort"));
		}
		return webResource;
	}

	//参数为ip和port
	public synchronized static WebTarget getWebResource2(){
		if( webResource2 == null ){
			Client client = ClientBuilder.newClient();
			String CONNECTYARN_TIMEOUT = ConfigUtil.configs.getProperty("CONNECTYARN_TIMEOUT");;
			if(CONNECTYARN_TIMEOUT==null || CONNECTYARN_TIMEOUT.equals("")){
				CONNECTYARN_TIMEOUT = "2000";
			}
			String READDATA_TIMEOUT = ConfigUtil.configs.getProperty("READDATA_TIMEOUT");;
			if(READDATA_TIMEOUT == null || READDATA_TIMEOUT.equals("")){
				READDATA_TIMEOUT = "2000";
			}
			client.property(ClientProperties.CONNECT_TIMEOUT,Integer.valueOf(CONNECTYARN_TIMEOUT));
			client.property(ClientProperties.READ_TIMEOUT,Integer.valueOf(READDATA_TIMEOUT));
			webResource2 = client.target("http://"+ConfigUtil.configs.getProperty("hadoop-yarnIp-v2.1")+":" 
			+ConfigUtil.configs.getProperty("hadoop-yarnPort"));
		}
		return webResource2;
	}
}
