package com.dc.appengine.autoTask;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by yangzhec on 2017/9/11.
 */
class RemoteNode{
    String host;
    String uname;
    String auth;
    List<Map<String,Object>> tasks;
    int rangeFrom;
    int rangeTo;
    String submitScriptLoc;

    boolean contain(int index){
        return index>=rangeFrom&&index<=rangeTo;
    }

    RemoteNode(String host,String uname,String auth,int rangeFrom,int rangeTo,String submitScriptLoc){
        this.host = host;
        this.uname = uname;
        this.auth = auth;
        this.rangeFrom = rangeFrom;
        this.rangeTo = rangeTo;
        this.tasks = new ArrayList<>();
        this.submitScriptLoc = submitScriptLoc;
    }
}
