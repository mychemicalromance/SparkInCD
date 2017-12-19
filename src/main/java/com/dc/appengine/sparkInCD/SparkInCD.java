package com.dc.appengine.sparkInCD;

import java.io.IOException;

import javax.servlet.Filter;

import org.glassfish.jersey.servlet.ServletContainer;
import org.glassfish.jersey.servlet.ServletProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.session.web.http.DefaultCookieSerializer;
import com.dc.appengine.filter.SessionFilter;
import com.dc.appengine.util.RedisUtil;

@SpringBootApplication
@ComponentScan(basePackages = "com.dc.appengine")
@EnableScheduling
public class SparkInCD extends SpringBootServletInitializer {
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(SparkInCD.class);
	}
	
	@Bean
	public DefaultCookieSerializer defaultCookieSerializer(){
	    DefaultCookieSerializer defaultCookieSerializer = new DefaultCookieSerializer();
	    defaultCookieSerializer.setCookiePath("/");
	    return defaultCookieSerializer;
	}
	
	@Bean(name = "sessionFilter")
	public Filter sessionFilter() {
		return new SessionFilter();
	}
	
	@Bean
	public FilterRegistrationBean sessionFilterRegistration() {
		FilterRegistrationBean registration = new FilterRegistrationBean();
		registration.setFilter(sessionFilter());
		registration.addUrlPatterns("/*");
		registration.setName("sessionFilter");
		registration.setOrder(1);
		return registration;
	}

	public static void main(String[] args) throws IOException {
		ApplicationContext context = SpringApplication.run(SparkInCD.class, args);
		SpringBeanUtil.setApplicationContext(context);
		System.out.println("--------------SpringBeanUtil.setApplicationContext(context)----------------");
		RedisUtil.init();
	}

	@Bean
	public ServletRegistrationBean jerseyServlet() {
		ServletRegistrationBean registration = new ServletRegistrationBean(new ServletContainer(), "/ws/*");
		registration.addInitParameter(ServletProperties.JAXRS_APPLICATION_CLASS, JerseyConfig.class.getName());
		return registration;
	}
}
