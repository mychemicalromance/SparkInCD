package com.dc.appengine.sparkInCD;

import org.springframework.context.ApplicationContext;

public class SpringBeanUtil {
	private static ApplicationContext applicationContext = null;

	public static void setApplicationContext(ApplicationContext applicationContext) {
		if (SpringBeanUtil.applicationContext == null) {
			SpringBeanUtil.applicationContext = applicationContext;
		}

	}

	// 获取applicationContext
	public static ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	// 通过name获取 Bean.
	public static Object getBean(String name) {
		if(applicationContext == null)
			return null;
		return getApplicationContext().getBean(name);

	}

	// 通过class获取Bean.
	public static <T> T getBean(Class<T> clazz) {
		return getApplicationContext().getBean(clazz);
	}

	// 通过name,以及Clazz返回指定的Bean
	public static <T> T getBean(String name, Class<T> clazz) {
		return getApplicationContext().getBean(name, clazz);
	}
}
