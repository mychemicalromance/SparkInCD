package com.dc.appengine.entity;

import java.util.Date;
import java.util.List;

public class Spark {
	private String id;
	private String name;
	private Date modifyTime;
	private String updateTime;
	private String description;
	private List<SparkFunction> functionList;
	private Boolean result;
	private Integer userId;
	private String sparkVersion;
	
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public Boolean getResult() {
		return result;
	}
	public void setResult(Boolean result) {
		this.result = result;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	public List<SparkFunction> getFunctionList() {
		return functionList;
	}
	public void setFunctionList(List<SparkFunction> functionList) {
		this.functionList = functionList;
	}

	public String getSparkVersion() {
		return sparkVersion;
	}

	public void setSparkVersion(String sparkVersion) {
		this.sparkVersion = sparkVersion;
	}
}
