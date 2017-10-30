package com.dc.appengine.util;

public class Constants {
	
	/**
	 * 数据库配置文件位置
	 */
	public static final String DB_CONFIG="db.config.dir";
	/**
	 * sql语句文件位置
	 */
	public static final String MASTER_SQL_PROPERTIES="AppMaster.sql.file";
	
	public final class SparkStatus{

		public static final String RUNNING = "RUNNING";
		public static final String KILLED = "KILLED";
		public static final String ACCEPTED = "ACCEPTED";
		public static final String FAILED = "FAILED";

	}
}
