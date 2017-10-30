package com.dc.appengine.entity;

import java.io.Serializable;
import java.util.List;

import org.apache.ibatis.type.Alias;
@Alias("page")
public class Page implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	private int pageSize=-1;
	private int pageNumber=-1;
	private int total=-1;
	private int totalPageNum=-1;
	private int startRowNum=-1;
	private int endRowNum=-1;
	private String queryWord;
	private Object objCondition;
	/*
	 * 权限配置约束条件
	 */
	private Object authCondition;
	@SuppressWarnings("unchecked")
	private List rows;
	private Long userId;
	private String appId;
	
	public Page(){
		
	}
	public Page(int pageSize,int total){
		this.pageSize=pageSize;
		this.total=total;
		int mod=total%pageSize;
		totalPageNum=mod==0?(total/pageSize):(total/pageSize)+1;
		pageNumber=1;
		startRowNum=1;
		endRowNum=pageSize;
	}

	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	public int getPageNumber() {
		return pageNumber;
	}
	public void setPageNumber(int pageNumber) {
		this.pageNumber = pageNumber;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public int getTotalPageNum() {
		return totalPageNum;
	}
	public void setTotalPageNum(int totalPageNum) {
		this.totalPageNum = totalPageNum;
	}
	public int getStartRowNum() {
		return startRowNum;
	}
	public void setStartRowNum(int startRowNum) {
		this.startRowNum = startRowNum;
	}
	public int getEndRowNum() {
		return endRowNum;
	}
	public void setEndRowNum(int endRowNum) {
		this.endRowNum = endRowNum;
	}

	public String getQueryWord() {
		return queryWord;
	}
	public void setQueryWord(String queryWord) {
		this.queryWord = queryWord;
	}
	public void setObjCondition(Object objCondition) {
		this.objCondition = objCondition;
	}

	public Object getObjCondition() {
		return objCondition;
	}
	public Object getAuthCondition() {
		return authCondition;
	}
	public void setAuthCondition(Object authCondition) {
		this.authCondition = authCondition;
	}
	@SuppressWarnings("unchecked")
	public void setRows(List rows) {
		this.rows = rows;
	}
	@SuppressWarnings("unchecked")
	public List getRows() {
		return rows;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	
}
