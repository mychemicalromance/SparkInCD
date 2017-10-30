package com.dc.appengine.entity;

import java.util.Date;

public class SparkInstance {

	private String id;
	private String sparkId;
	private String functionId;
	private String driverName;
	private Date modifyTime;
	private String updateTime;
	private String description;
	private String userName;
	private int confVersionId;
	private int userId;
	private String uiLink;
	private String detailLink;
	private String status;
	private String uuid;
	private String errorLog;
	private String sparkVersion;
	
	
	public String getErrorLog() {
		return errorLog;
	}
	public void setErrorLog(String errorLog) {
		this.errorLog = errorLog;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getModifyTime() {
		return modifyTime;
	}
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	public String getSparkId() {
		return sparkId;
	}
	public void setSparkId(String sparkId) {
		this.sparkId = sparkId;
	}
	public int getConfVersionId() {
		return confVersionId;
	}
	public void setConfVersionId(int confVersionId) {
		this.confVersionId = confVersionId;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getUiLink() {
		return uiLink;
	}
	public void setUiLink(String uiLink) {
		this.uiLink = uiLink;
	}
	public String getDetailLink() {
		return detailLink;
	}
	public void setDetailLink(String detailLink) {
		this.detailLink = detailLink;
	}
	public String getDriverName() {
		return driverName;
	}
	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getFunctionId() {
		return functionId;
	}
	public void setFunctionId(String functionId) {
		this.functionId = functionId;
	}

	public String getSparkVersion() {
		return sparkVersion;
	}

	public void setSparkVersion(String sparkVersion) {
		this.sparkVersion = sparkVersion;
	}
}
