package com.dc.appengine.sparkInCD;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.dc.appengine.autoTask.AutoSubmitSparkTask;
import com.dc.appengine.service.ISparkService;

@Component
public class DoTask {	
	/*@Scheduled(fixedRate = 10000)
	public void timerRate() {
		System.out.println(new Date()+"timerRate");
	}*/
	@Scheduled(initialDelay=10000,fixedDelay = 3000)
	public void timerDelay(){
		ISparkService sparkService = (ISparkService) SpringBeanUtil.getBean("sparkService");
		if(sparkService == null)
			return;
		new AutoSubmitSparkTask(sparkService).execute();
	}
	
}