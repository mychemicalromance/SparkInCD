package com.dc.appengine.sparkInCD;

import org.glassfish.jersey.server.ResourceConfig;

import com.dc.appengine.ws.server.SparkRestService;

public class JerseyConfig extends ResourceConfig {
	public JerseyConfig() {
		register(org.glassfish.jersey.media.multipart.MultiPartFeature.class);
		register(SparkRestService.class);
	}
}
