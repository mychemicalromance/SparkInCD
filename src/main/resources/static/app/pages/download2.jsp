<%@page language="java" contentType="application/x-msdownload"  pageEncoding="utf-8"%>
<%@page import="java.util.*,java.io.*,com.alibaba.fastjson.JSON"  %>
<%
 String site=new String("/cloudui/index.html");
 response.setStatus(response.SC_moved_TEMPORARILY);
 response.setHeader("Location",site);
%>
<%

//获取参数
String filename=request.getParameter("filename");
Map<String,Object> dataAll=JSON.parseObject(request.getParameter("data"));
List<Map<String,Object>> rows=(List<Map<String,Object>>)dataAll.get("rows");
Map<String,List<Map<String,Object>>> sort= new HashMap<String,List<Map<String,Object>>>();
for(Map<String,Object> unit:rows){
	String type=(String)unit.get("type");
	List<Map<String,Object>> list=null;
	if(sort.containsKey(type)){
		list=sort.get(type);
	}else{
		list= new ArrayList<Map<String,Object>>();
	}
	list.add(unit);
	sort.put(type, list);
	
}
response.addHeader("Content-Disposition","attachment;filename=" +filename);  
OutputStream outp = null; 
BufferedWriter bw=null;
OutputStreamWriter bufw=null;
try{  
  	outp = response.getOutputStream();  
  	byte[] b = new byte[1024];  
 	int i = 0;  
	bufw= new OutputStreamWriter(outp);
	bw= new BufferedWriter(bufw);
	bw.write("##################################################");
	bw.newLine();
	bw.write("#本次导出包含不同模块的key value信息  不允许直接用作本系统的导入#");
	bw.newLine();
	bw.write("##################################################");
	bw.newLine();
	Map<String,List<Map<String,Object>>> sorts= new HashMap<String,List<Map<String,Object>>>();
	for(Map<String,Object> unit:rows){
		String type=(String)unit.get("type");
		List<Map<String,Object>> list=null;
		if(sorts.containsKey(type)){
			list=sorts.get(type);
		}else{
			list= new ArrayList<Map<String,Object>>();
		}
		list.add(unit);
		sorts.put(type, list);
		
	}
	
	for(String type:sorts.keySet()){
		bw.write("#####"+type+"#####");
		bw.newLine();
		for(Map<String,Object> unit:sort.get(type)){
			String description=(String)unit.get("description");
			if(description!=null && description.length()>0 && !"".equals(description.trim())){
				bw.write("#"+description);
				bw.newLine();
			}
			String key=(String)unit.get("key");
			String value=(String)unit.get("value");
			bw.write(key+"="+value);
			bw.newLine();
		}
	}
	outp.flush();    
	out.clear();  
	out = pageContext.pushBody();  
}catch(Exception e){  
		System.out.println("Error!");  
		e.printStackTrace();  
	}  
finally  
{  
bw.close();
bufw.close();

}  
%>