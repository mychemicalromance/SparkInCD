package com.dc.appengine;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;

/**
 * Created by yangzhec on 2016/12/8.
 * 将这个类配置在META-INF/spring.factories中就可以在启动是加载，执行postProcessEnvironment方法
 */
public class PAASEnvironmentPostProcessor implements EnvironmentPostProcessor {
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment configurableEnvironment, SpringApplication springApplication) {

    	String str = "PAASConfigs";
        Map<String,Object> map = new HashMap<String,Object>();
        Properties prop = ConfigUtil.loadFromPaasConfigCenter();
        for(Map.Entry<Object,Object> entry:prop.entrySet()){
            String key = (String) entry.getKey();
            String value = (String) entry.getValue();
            map.put(key,value);
        }
        MapPropertySource mps =  new MapPropertySource(str, map);
        MutablePropertySources sources = configurableEnvironment.getPropertySources();
        String name = findPropertySource(sources);
        if (sources.contains(name)) {
            sources.addBefore(name, mps);
        }else {
            sources.addFirst(mps);
        }
    }

    private String findPropertySource(MutablePropertySources sources) {
        return "PAAS.CONFIG";
    }
}
