package com.dc.appengine;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

/**
 * Created by yangzhec on 2016/12/12. 这个类是从配置中心拉取配置的工具类
 */
public class ConfigUtil {
	
	public static Properties configs = new Properties();
	
	public static Properties loadFromPaasConfigCenter() {
		// 下面的环境变量在部署的时候都写在容器的环境变量中，可以直接使用，
		// 如果是debug环境，那么就从命令行参数中读取这些配置
		Properties properties = new Properties();
		File f = new File("./config.properties");
		try {
			properties.load(new FileReader(f));
			configs.load(new FileReader(f));
			System.out.println(properties);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return properties;
	}
}
