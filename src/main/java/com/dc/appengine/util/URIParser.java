package com.dc.appengine.util;

import java.net.URI;
import java.net.URISyntaxException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class URIParser {
	private static Logger log = LoggerFactory.getLogger(URIParser.class);
	
	public static String[] parse(String s) {
		try {
			URI uri = new URI(s);
			String[] result = new String[6];
			result[0] = uri.getScheme();
			result[1] = uri.getUserInfo();
			result[2] = uri.getHost();
			result[3] = String.valueOf(uri.getPort());
			result[4] = uri.getPath();
			result[5] = uri.getQuery();
			return result;
		} catch (URISyntaxException e) {
			log.error("错误的URI格式：" + s, e);
			e.printStackTrace();
		}
		return null;
	}
}
