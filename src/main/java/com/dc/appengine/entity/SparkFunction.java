package com.dc.appengine.entity;

import java.util.Date;

public class SparkFunction {
	private String id;
	private String sparkId;
	private String functionName;
	private String functionMark;
	private Date modifyTime;
	private String updateTime;
	private String description;
	private String resourceVerId;
	private int configId;
	private String submitCommand;
	private String params;
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
	public String getFunctionName() {
		return functionName;
	}
	public void setFunctionName(String functionName) {
		this.functionName = functionName;
	}
	public String getResourceVerId() {
		return resourceVerId;
	}
	public void setResourceVerId(String resourceVerId) {
		this.resourceVerId = resourceVerId;
	}
	public int getConfigId() {
		return configId;
	}
	public void setConfigId(int configId) {
		this.configId = configId;
	}
	public String getSubmitCommand() {
		return submitCommand;
	}
	public void setSubmitCommand(String submitCommand) {
		this.submitCommand = submitCommand;
	}
	public String getParams() {
		return params;
	}
	public void setParams(String params) {
		this.params = params;
	}
	public String getFunctionMark() {
		return functionMark;
	}
	public void setFunctionMark(String functionMark) {
		this.functionMark = functionMark;
	}
	
}
