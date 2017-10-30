#API文档
##1.IaaS接入API
###1.1 IaaS接入列表
####  `GET` /iaas
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页码</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页的记录数</td>
   </tr>
</table>

#### **request example**
  
    pageNum=1&pageSize=15

#### **response**
<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>total</td>
      <td>总记录数</td>
   </tr>
   <tr>
      <td>rows</td>
      <td>记录列表</td>
   </tr>
   <tr>
      <td>rows.id</td>
      <td>IaaS的ID</td>
   </tr>
   <tr>
      <td>rows.type</td>
      <td>IaaS类型</td>
   </tr>
   <tr>
      <td>rows.name</td>
      <td>IaaS名称</td>
   </tr>
   <tr>
      <td>rows.url</td>
      <td>IaaS的API地址</td>
   </tr>
   <tr>
      <td>rows.username</td>
      <td>IaaS的用户名</td>
   </tr>
   <tr>
      <td>rows.template_id</td>
      <td>IaaS的模板ID</td>
   </tr>
   <tr>
      <td>rows.cpu</td>
      <td>IaaS主机的CPU数量</td>
   </tr>
   <tr>
      <td>rows.memory</td>
      <td>IaaS主机的内存大小</td>
   </tr>
   <tr>
      <td>rows.disk</td>
      <td>IaaS主机的磁盘大小</td>
   </tr>
    <tr>
      <td>rows.min</td>
      <td>IaaS缓存的主机数量</td>
   </tr>
    <tr>
      <td>rows.max</td>
      <td>IaaS创建的主机数量上限</td>
   </tr>
    <tr>
      <td>rows.timestamp</td>
      <td>IaaS创建的时间</td>
   </tr>
   <tr>
      <td>rows.properties</td>
      <td>IaaS自定义属性</td>
   </tr>
   <tr>
      <td>rows.properties.key</td>
      <td>IaaS自定义属性的键</td>
   </tr>
   <tr>
      <td>rows.properties.value</td>
      <td>IaaS自定义属性的值</td>
   </tr>
</table>
 
#### **response example**
``` js 
    {
      "total": 30,
      "rows": [
        {
          "id": "123",
          "type": "OpenStack",
          "name": "iaas001",
          "url": "http://127.0.0.1:8080",
          "username": "user_001",
          "template_id": "uuid",
          "cpu": 2,
          "memory": 1024,
          "disk": 1024,
          "min": 2,
          "max": 10,
          "timestamp": "yyyy-MM-dd HH:mm:ss",
          "properties": [
            {
              "key": "key001",
              "value": "value001"
            }
          ]
        }
      ]
    }
```
### 1.2 获取IaaS接入类型
#### `GET` /iaas/type
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td></td>
     <td> 记录列表</td>
   </tr>
</table>

#### **response example**
``` js 
    [
      "OpenStack",
      "vSphere"
    ]
```

###1.3 新增IaaS接入
####  `POST` /iaas
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>IaaS名称</td>
   </tr>
   <tr>
     <td>url</td>
     <td>IaaS的API地址</td>
   </tr>
   <tr>
     <td>username</td>
     <td>IaaS用户名</td>
   </tr>
   <tr>
     <td>userpwd</td>
     <td>IaaS密码</td>
   </tr>
   <tr>
     <td>type</td>
     <td>IaaS类型</td>
   </tr>
   <tr>
     <td>template_id</td>
     <td>IaaS的模板类型</td>
   </tr>
   <tr>
     <td>cpu</td>
     <td>IaaS主机的CPU数量</td>
   </tr>
   <tr>
     <td>memory</td>
     <td>IaaS主机的内存大小</td>
   </tr>
   <tr>
     <td>disk</td>
     <td>IaaS主机的磁盘大小</td>
   </tr>
   <tr>
     <td>min</td>
     <td>IaaS主机的缓存数量</td>
   </tr>
   <tr>
     <td>max</td>
     <td>IaaS创建的主机数量上限</td>
   </tr>
   <tr>
     <td>properties</td>
     <td>IaaS的自定义属性</td>
   </tr>
</table>
  
#### **request example**

    name=iaas001&url=http://127.0.0.1:8080&username=user_001&userpwd=userpwd&type=OpenStack&template_id=uuid&cpu=2&memory=1024&disk=1024&min=2&max=10,
    properties=aaa=aaa,bbb=bbb

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
</table>

#### **response example**
 
``` js 
    {
      "result": true
    }
    或
    {
      "result": false
    }
```

### 1.4 删除IaaS接入
####  `DELETE` /iaas
#### **request** 

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>iaas_ids</td>
     <td>要删除的IaaS的ID</td>
   </tr>
</table>

#### **request example**

    iaas_ids=uuid001,uuid002

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
</table>

#### **response example**  

``` js 
    {
      "result": true
    }
    或
    {
      "result": false
    }
```

###1.5 更新IaaS接入
####  `PUT` /iaas/{iaas_id}
#### **request** 

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>IaaS名称</td>
   </tr>
   <tr>
     <td>template_id</td>
     <td>IaaS模板ID</td>
   </tr>
   <tr>
     <td>cpu</td>
     <td>IaaS主机的CPU数量</td>
   </tr>
   <tr>
     <td>memory</td>
     <td>IaaS主机的内存大小</td>
   </tr>
   <tr>
     <td>disk</td>
     <td>IaaS主机的磁盘大小</td>
   </tr>
   <tr>
     <td>min</td>
     <td>IaaS缓存的主机数量</td>
   </tr>
   <tr>
     <td>max</td>
     <td>IaaS创建的主机数量上限</td>
   </tr>
   <tr>
     <td>properties</td>
     <td>IaaS的自定义属性</td>
   </tr>
</table>

#### **request example** 
    name=iaas01&template_id=uuid&cpu=2&memory=1024&disk=1024&min=2&max=10,properties=aaa=aaa,bbb=bbb

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
</table>

#### **response example**  

``` js 
    {
      "result": true
    }
    或
    {
      "result": false
    }
```

###1.6 获取单个IaaS详情
####  GET /iaas/{iaas_id}
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
   <tr>
     <td>id</td>
     <td>IaaS的ID</td>
   </tr>
   <tr>
     <td>type</td>
     <td>IaaS类型</td>
   </tr>
   <tr>
     <td>name</td>
     <td>IaaS名称</td>
   </tr>
   <tr>
     <td>url</td>
     <td>IaaS的API地址</td>
   </tr>
   <tr>
     <td>username</td>
     <td>IaaS的用户名</td>
   </tr>
   <tr>
     <td>cpu</td>
     <td>IaaS主机的CPU数量</td>
   </tr>
   <tr>
     <td>memory</td>
     <td>IaaS主机的内存大小</td>
   </tr>
   <tr>
     <td>disk</td>
     <td>IaaS主机的磁盘大小</td>
   </tr>
   <tr>
     <td>min</td>
     <td>IaaS缓存的主机数量</td>
   </tr>
   <tr>
     <td>max</td>
     <td>IaaS创建的主机数量上限</td>
   </tr>
   <tr>
     <td>timestamp</td>
     <td>IaaS创建的时间</td>
   </tr>
   <tr>
     <td>properties</td>
     <td>IaaS自定义属性</td>
   </tr>
   <tr>
     <td>properties.key</td>
     <td>IaaS自定义属性的键</td>
   </tr>
   <tr>
     <td>properties.value</td>
     <td>IaaS自定义属性的值</td>
   </tr>
</table>
#### **response example**  
``` js 
    {
      "id": "123",
      "type": "OpenStack",
      "name": "iaas001",
      "url": "http://127.0.0.1:8080",
      "username": "user_001",
      "template_id": "uuid",
      "cpu": 2,
      "memory": 1024,
      "disk": 1024,
      "min": 2,
      "max": 10,
      "timestamp": "yyyy-MM-dd HH:mm:ss",
      "properties": [
        {
          "key": "key001",
          "value": "value001"
        }
      ]
    }
```

### 1.7 获取主机列表
####  GET /iaas/{iaas_id}/vm
#### **request** 

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页码</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页的记录数</td>
   </tr>
</table>
#### **request example**

    pageNum=1&pageSize=15

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>total</td>
     <td>总记录数</td>
   </tr>
   <tr>
     <td>rows</td>
     <td>记录列表</td>
   </tr>
   <tr>
     <td>rows.id</td>
     <td>主机ID</td>
   </tr>
   <tr>
     <td>rows. iaas_vm_id</td>
     <td>主机在IaaS中的ID</td>
   </tr>
   <tr>
     <td>rows.ip</td>
     <td>主机IP</td>
   </tr>
   <tr>
     <td>rows.status</td>
     <td>主机状态</td>
   </tr>
   <tr>
     <td>rows.cpu</td>
     <td>主机的CPU数量</td>
   </tr>
   <tr>
     <td>rows.memory</td>
     <td>主机的内存大小</td>
   </tr>
   <tr>
     <td>rows.disk</td>
     <td>主机的磁盘大小</td>
   </tr>
   <tr>
     <td>rows.timestamp</td>
     <td>主机创建的时间</td>
   </tr>
</table>

#### **response example**  
``` js 
    {
      "total": 30,
      "rows": [
        {
          "id": "123",
          "iaas_id": "uuid001",
          "iaas_vm_id": "uuid001",
          "ip": "127.0.0.1",
          "status": "0",
          "cpu": 2,
          "memory": 1024,
          "disk": 1024,
          "timestamp": "yyyy-MM-dd HH:mm:ss"
        }
      ]
    }
```


##2.集群管理API
###2.1 集群列表
####  GET /cluster
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页码</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页的记录数</td>
   </tr>
</table>

#### **request example**

    pageNum=1&pageSize=15

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>total</td>
     <td>总记录数</td>
   </tr>
   <tr>
     <td>rows</td>
     <td>记录列表</td>
   </tr>
   <tr>
     <td>rows.id</td>
     <td>集群ID</td>
   </tr>
   <tr>
     <td>rows.name</td>
     <td>集群名称</td>
   </tr>
   <tr>
     <td>rows.host_num</td>
     <td>集群的主机数量</td>
   </tr>
</table>


#### **response example**  
``` js 
    {
      "total": 30,
      "rows": [
        {
          "id": "123",
          "name": "cluster001",
          "host_num": 3
        }
      ]
    }
```

###2.2 新增集群
####  POST /cluster
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>页码</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>集群名称</td>
   </tr>
   <tr>
     <td>network_kind</td>
     <td>网络类型</td>
   </tr>
   <tr>
     <td>network_type</td>
     <td>网段类型</td>
   </tr>
   <tr>
     <td>network</td>
     <td>网段</td>
   </tr>
</table>

#### **request example**

    name=cluster001&network_kind=OVS&network_type=default&network=192.168.1.0/24
  
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
</table>  
  
#### **response example**  
``` js 
    {
      "result": true
    }
    或
    {
      "result": false
    }
``` 
 
###2.3 删除集群
####  DELETE /cluster/{id}    
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
</table>  
  
#### **response example**  
``` js 
   {
      "result": true
    }
    或
    {
      "result": false
    }
``` 

###2.4 更新集群
####  PUT cluster/{id}     
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>集群名称</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页的记录数</td>
   </tr>
</table>

#### **request example**

    name=cluster001 

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
</table>  

#### **response example**  
``` js 
   {
      "result": true
    }
    或
    {
      "result": false
    }
``` 

###2.5 获取单个集群详情
####  GET /cluster/{id} 
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>集群ID</td>
   </tr>
   <tr>
     <td>name</td>
     <td>集群名称</td>
   </tr>
   <tr>
   <td>host_num</td>
     <td>集群的主机数量</td>
   </tr>
   <tr>
     <td>network</td>
     <td>集群的网段</td>
   </tr>
   <tr>
     <td>network_kind</td>
     <td>集群的网络类型</td>
   </tr>
</table>  

#### **response example**  
``` js 
   {
      "id": "123",
      "name": "cluster001",
      "host_num": 3,
      "network": "192.168.1.0/24",
      "network_kind": "OVS"
    }
``` 
  
###2.6 获取单个集群的主机列表
####  GET /cluster/{id}/nodes    
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页码</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页的记录数</td>
   </tr>
   <tr>
     <td>labels</td>
     <td>主机标签的key</td>
   </tr>
</table>

#### **request example**

    pageNum=1&pageSize=15&labels=a,b,c 

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>total</td>
     <td>总记录数</td>
   </tr>
   <tr>
     <td>rows</td>
     <td>记录列表</td>
   </tr>
   <tr>
     <td>rows.id</td>
     <td>主机ID</td>
   </tr>
   <tr>
     <td>rows.name</td>
     <td>主机名称</td>
   </tr>
   <tr>
     <td>rows.labels</td>
     <td>主机标签</td>
   </tr>
   <tr>
     <td>rows.ip</td>
     <td>主机IP</td>
   </tr>
   <tr>
     <td>rows.timestamp</td>
     <td>主机创建时间</td>
   </tr>
</table>   

#### **response example**  
``` js 
   {
      "total": 30,
      "rows": [
        {
          "id": "123",
          "name": "node001",
          "labels": "a=1,b=2",
          "ip": "10.0.1.2",
          "timestamp": "2016-04-07 19:47:08"
        }
      ]
    }
``` 

##3.  svn 接口
###3.1 查询镜像仓库实际存在的镜像列表
####  `GET`  /svn/ws/registry/real/allImages
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>registryId</td>
     <td>仓库类型</td>
   </tr>
   <tr>
     <td>userName</td>
     <td>用户名</td>
    </tr>
</table>
	
#### **response example**

    [
		"admin/hantest5",
		"base/cpu1",
		"admin/logapp",
		"admin/tomcat",
		"zhangliaf/image0222"
	]
	
###3.2 查询所有的仓库信息
####  `GET`  /svn/ws/registry/list
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>domain</td>
     <td>域名</td>
   </tr>
   <tr>
     <td>id</td>
     <td>id</td>
    </tr>
	<tr>
     <td>nginx_port</td>
     <td>查询接口端口</td>
    </tr>
	<tr>
     <td>registry_port</td>
     <td>仓库镜像接口</td>
    </tr>
	<tr>
     <td>registry_name</td>
     <td>仓库名称</td>
    </tr>
	<tr>
     <td>url</td>
     <td>镜像仓库地址全称</td>
    </tr>
	<tr>
     <td>username</td>
     <td>用户名</td>
    </tr>
</table>

#### **response example**

	[{
	  "domain": "registry.paas",
	  "id": 1,
	  "nginx_port": "6000",
	  "password": "123456",
	  "registry_name": "private_registry",
	  "registry_port": "443",
	  "url": "repository://admin:123456@registry.paas",
	  "userName": "admin"
	},
	{
	  "domain": "registry.paasPublic",
	  "id": 2,
	  "nginx_port": "6001",
	  "password": "123456",
	  "registry_name": "public_registry",
	  "registry_port": "444",
	  "url": "repository://admin:123456@registry.paasPublic",
	  "userName": "admin"
	}]
	
###3.3 查询仓库实际镜像的所有tag
####  `GET`  /svn/ws/registry/real/allTags
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>registryId</td>
     <td>仓库类型</td>
   </tr>
   <tr>
     <td>image</td>
     <td>镜像名</td>
    </tr>
	<tr>
     <td>userName</td>
     <td>用户名</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>查询结果是否正确true false</td>
   </tr>
   <tr>
      <td>rows[]</td>
      <td>标签列表</td>
   </tr>
   <tr>
      <td>description_resource</td>
      <td>镜像资源描述</td>
   </tr>
</table>

#### **response example**

	{
	  "result": true,
	  "rows": ["latest",
		  "1.0",
		  "2.0",
		  "monitor6"],
	  "description_resource": "aaa"
	} 
  
###3.4 检查仓库中是否存在该镜像
####  `GET`  /svn/ws/registry/checkImage
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>domain</td>
     <td>仓库域名registry.paas:443</td>
   </tr>
   <tr>
     <td>imageName</td>
     <td>镜像全称 admin/test:latest</td>
   </tr>
</table>

#### **response example**

	{
		"result":false,
		"reason":"no such image"
	}
	{
		"result":true
	}
	
###3.5 注册镜像信息到paas
####  `POST`  /svn/ws/registry/registResource
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
   <tr>
     <td>registry</td>
     <td>仓库名称  registry.paas:443</td>
   </tr>
   <tr>
     <td>image</td>
     <td>镜像名称</td>
   </tr>
   <tr>
     <td>tag</td>
     <td>标签</td>
    </tr>
	<tr>
     <td>startPort</td>
     <td>启动端口</td>
    </tr>
	<tr>
     <td>startScript</td>
     <td>启动脚本</td>
    </tr>
	<tr>
     <td>deploy_timeout</td>
     <td>部署超时时间</td>
    </tr>
	<tr>
     <td>start_timeout</td>
     <td>启动超时时间</td>
    </tr>
	<tr>
     <td>stop_timeout</td>
     <td>停止超时时间</td>
    </tr>
	<tr>
     <td>destroy_timeout</td>
     <td>卸载超时时间</td>
    </tr>
	<tr>
     <td>description</td>
     <td>版本描述</td>
    </tr>
	<tr>
     <td>description_resource</td>
     <td>镜像描述</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>reason</td>
      <td>错误原因</td>
   </tr>
</table>

#### **response example**

	{\"result\":true }
	{"result":false,"reason":"you have already regist this image version"}
	
###3.6 分页查询已注册镜像信息
####  `GET`  /svn/ws/registry/getImagesByPage
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>registryId</td>
     <td>仓库类型</td>
   </tr>
   <tr>
     <td>keyword</td>
     <td>关键词</td>
    </tr>
	<tr>
     <td>pageSize</td>
     <td>页面大小</td>
    </tr>
	<tr>
     <td>pageNum</td>
     <td>页码</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>rows.image_name</td>
     <td>镜像名称</td>
   </tr>
   <tr>
     <td>rows.last_id</td>
     <td>最新版本id</td>
    </tr>
	<tr>
     <td>rows.laste_tag</td>
     <td>最新版本名称</td>
    </tr>
	<tr>
     <td>rows.laster_time</td>
     <td>最后更新时间</td>
    </tr>
	<tr>
     <td>rows.version_num</td>
     <td>版本数量</td>
    </tr>
	<tr>
     <td>total</td>
     <td>镜像总量</td>
    </tr>
</table>

#### **response example**
   
	{
	  rows:[{
		"image_name": "admin/test",
		"last_id": 10,
		"last_tag": "tt5",
		"last_time": "2016-06-30 20:26:33",
		"version_num": 4
	  },
	  {
		"image_name": "admin/test2",
		"last_id": 11,
		"last_tag": "latest",
		"last_time": "2016-07-01 09:23:51",
		"version_num": 1
	  },
	  {
		"image_name": "admin/test3",
		"last_id": 12,
		"last_tag": "latest",
		"last_time": "2016-07-01 09:23:56",
		"version_num": 1
	  },
	  {
		"image_name": "admin/test4",
		"last_id": 16,
		"last_tag": "1.2",
		"last_time": "2016-07-01 09:24:15",
		"version_num": 4
	  },
	  {
		"image_name": "admin/test5",
		"last_id": 21,
		"last_tag": "latest",
		"last_time": "2016-07-01 09:26:05",
		"version_num": 5
	  }],
	  "total": 6
	}
  
###3.7 在应用部署时提供已注册镜像列表
####  `GET`  /svn/ws/registry/getImageListForDeploy 
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>registryId</td>
     <td>镜像仓库类型</td>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>registry</td>
      <td>仓库地址</td>
   </tr>
   <tr>
      <td>rows</td>
      <td>镜像名称</td>
   </tr>
</table>

#### **response example**

	{
		“registry”:"admin:123456@registry.paas:443" ,
		rows:
			[
				"admin/test",
				"admin/han",
				"admin/hahah"
			]
	}
  
###3.8 根据已选已注册镜像 列出已注册的tag列表
####  `GET`  /svn/ws/registry/real/getTagListForDeploy 
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>registryId</td>
     <td>仓库类型</td>
   </tr>
   <tr>
     <td>imageName</td>
     <td>镜像名称</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>id标识</td>
   </tr>
   <tr>
     <td>tag</td>
     <td>标签</td>
    </tr>
	<tr>
     <td>startPort</td>
     <td>启动端口</td>
    </tr>
	<tr>
     <td>deploy_timeout</td>
     <td>部署超时</td>
    </tr>
	<tr>
     <td>start_timeout</td>
     <td>启动超时时间</td>
    </tr>
	<tr>
     <td>stop_timeout</td>
     <td>停止超时时间</td>
    </tr>
	<tr>
     <td>destroy_timeout</td>
     <td>卸载超时时间</td>
    </tr>
</table>

#### **response example**

	[
	  {
		"id":1,
		"tag":"1.0",
		"startPort":"8080",
		"startScript":"bash /tomcat/bin/start.sh",
		"deploy_timeout":"6000",
		"start_timeout":"6000",
		"stop_timeout":"6000",
		"destroy_timeout":"6000"
	  },
	  {
		"id":2,
		"tag":"1.1",
		"startPort":"8080",
		"startScript":"bash /tomcat/bin/start.sh",
		"deploy_timeout":"6000",
		"start_timeout":"6000",
		"stop_timeout":"6000",
		"destroy_timeout":"6000"
	  }
	]

###3.9 同步paas用户到仓库(添加用户，修改密码)
####  `POST`  POST /svn/ws/datacenter/updateRegistryUser
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userName</td>
     <td>用户名</td>
   </tr>
   <tr>
     <td>password</td>
     <td>密码</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>
      
###3.10  显示镜像的基本信息
####  `GET`  /svn/ws/registry/imageInfo
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户Id</td>
   </tr>
   <tr>
     <td>registryId</td>
     <td>仓库类型</td>
    </tr>
	<tr>
     <td>imageName</td>
     <td>镜像名称</td>
    </tr>
</table>
       
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>image_name</td>
      <td>镜像名称</td>
   </tr>
   <tr>
      <td>last_id</td>
      <td>最新镜像id</td>
   </tr>
	<tr>
     <td>laste_time</td>
     <td>最新版本上传时间</td>
    </tr>
	<tr>
     <td>version_num</td>
     <td>版本数量</td>
    </tr>
</table>

#### **response example**

	{
		"image_name": "test/portal",
		"last_id": 37,
		"last_tag": "2.0",
		"last_time": "2016-09-03 15:33:31",
		"version_num": 3,
		"description": "aaa"
	}
	
###3.11  分页显示版本列表 
####  `GET`  svn/ws/registry/getTagListByPage
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
	<tr>
     <td>imageName</td>
     <td>镜像名称</td>
    </tr>
	<tr>
     <td>registryId</td>
     <td>仓库类型</td>
    </tr>
	<tr>
     <td>pageSize</td>
     <td>页面大小</td>
    </tr>
	<tr>
     <td>pageNum</td>
     <td>页码</td>
    </tr>
	<tr>
     <td>keyword</td>
     <td>搜索关键词</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>imageName</td>
      <td>镜像名称</td>
   </tr>
   <tr>
      <td>registryId</td>
      <td>仓库类型</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>页面大小</td>
    </tr>
	<tr>
     <td>pageNum</td>
     <td>页码</td>
    </tr>
	<tr>
     <td>keyword</td>
     <td>搜索关键词</td>
    </tr>
   <tr>
     <td>rows.createDate</td>
     <td>镜像创建时间</td>
    </tr>
   <tr>
     <td>rows.deploy_timeout</td>
     <td>部署超时时间</td>
    </tr>
   <tr>
     <td>rows.startPort</td>
     <td>启动端口</td>
    </tr>
   <tr>
     <td>rows. startScript</td>
     <td>启动脚本位置</td>
    </tr>
   <tr>
     <td>rows.start_tiemout</td>
     <td>启动超时时间</td>
    </tr>
   <tr>
     <td>rows.destroy_timeout</td>
     <td>卸载超时时间</td>
    </tr>
   <tr>
     <td>rows.tag</td>
     <td>标签</td>
    </tr>
   <tr>
     <td>rows.description</td>
     <td>描述</td>
    </tr>
   <tr>
     <td>total</td>
     <td>总数</td>
    </tr>
</table>

#### **response example**

	{
		"imageName": "test/portal",
		"pageNum": 3,
		"pageSize": 1,
		"registryId": 1,
		"rows": [
			{
				"createDate": "2016-09-01 16:11:39",
				"deploy_timeout": "60000",
				"destroy_timeout": "60000",
				"id": 31,
				"startPort": 5086,
				"startScript": "bash /home/configcenter/ws/config-tools/test/edit-configs.sh portal.json ../portal-config.sh /home/DevPortal/bin/startDevPortal.sh",
				"start_timeout": "60000",
				"stop_timeout": "60000",
				"tag": "esb",
				"description": "heiheihei"
			}
		],
		"total": 3
	}

###3.12  版本详情修改
####  `POST`  /svn/ws/registry/updateVersionInfo
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
   <tr>
     <td>versionId</td>
     <td>版本id</td>
   </tr>
   <tr>
     <td>deploy_timeout</td>
     <td>部署超时时间</td>
    </tr>
   <tr>
     <td>startPort</td>
     <td>启动端口</td>
    </tr>
   <tr>
     <td>startScript</td>
     <td>启动脚本</td>
    </tr>
   <tr>
     <td>start_tiemout</td>
     <td>启动超时时间</td>
    </tr>
   <tr>
     <td>destroy_timeout</td>
     <td>卸载超时时间</td>
    </tr>
   <tr>
     <td>description</td>
     <td>版本信息描述</td>
    </tr>
</table>

#### **response example**

	{
		"result":true 
	}
	{
		"result":false,
		"reason":"have no permission to update this version"
	}
###3.13  删除版本
####在删除最后一个版本时  整个镜像被删除
####  `GET`  /svn/ws/registry/deleteVersion
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
   <tr>
     <td>versionId</td>
     <td>版本id</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>成功与否</td>
   </tr>
   <tr>
      <td>reason</td>
      <td>失败原因</td>
   </tr>
</table>

#### **response example**

	{
		"result":true
	}
	{
		"result":false,
		"reason":"no such version"
	}


##4. Master应用管理接口
###4.1 应用注册
####  `POST`  /application/operation/create/app
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th colspan="2" >名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td colspan="2" >appName</td>
     <td>应用</td>
	 <td></td>
   </tr>
   <tr>
     <td colspan="2" >accessPort</td>
     <td>访问端口</td>
	 <td></td>
   </tr>
   <tr>
     <td colspan="2" >deps</td>
     <td>依赖应用</td>
	 <td>Map类型</td>
   </tr>
   <tr>
     <td colspan="2" >env</td>
     <td>环境变量</td>
	 <td>Map类型</td>
   </tr>
   <tr>
     <td colspan="2" >fromTemplate</td>
     <td>是否来自模板</td>
	 <td>默认 false</td>
   </tr>
   <tr>
	 <td rowspan="6">imageInfo</td>
     <td>accessPort</td>
     <td>访问端口</td>
	 <td></td>
   </tr>
   <tr>
	 <td>cmd</td>
     <td>启动脚本</td>
	 <td></td>
   </tr>
   <tr>
	 <td>image</td>
     <td>镜像地址</td>
	 <td></td>
   </tr>
   <tr>
	 <td>imageTag</td>
     <td>镜像标签</td>
	 <td></td>
   </tr>
   <tr>
	 <td>logDir</td>
     <td>日志目录</td>
	 <td></td>
   </tr>
   <tr>
	 <td>volumes</td>
     <td>卷映射目录</td>
	 <td>Map类型</td>
   </tr>
   <tr>
	 <td colspan="2">netModel</td>
     <td>网络模型</td>
	 <td>none（默认模式）,host（主机模式）</td>
   </tr>
   <tr>
	 <td rowspan="10">strategyInfo</td>
     <td>cpuQuota</td>
     <td>cpu配额</td>
	 <td></td>
   </tr>
   <tr>
     <td>cpus</td>
     <td>cpu核数</td>
	 <td></td>
   </tr>
   <tr>
     <td>shareHost</td>
     <td>是否共享主机</td>
	 <td></td>
   </tr>
   <tr>
     <td>sameHost</td>
     <td>是否同一主机</td>
	 <td></td>
   </tr>
   <tr>
     <td>shareCpu</td>
     <td>是否共享cpu</td>
	 <td></td>
   </tr><tr>
     <td>replicas</td>
     <td>实例个数</td>
	 <td></td>
   </tr><tr>
     <td>memory</td>
     <td>内存</td>
	 <td></td>
   </tr><tr>
     <td>labels</td>
     <td>标签</td>
	 <td>Mab格式</td>
   </tr>
   <tr>
     <td>isolate</td>
     <td>是否隔离</td>
	 <td>默认true</td>
   </tr>
   <tr>
     <td>imageUpdateType</td>
     <td>镜像更新类型</td>
	 <td>always（总是更新），never（从不更新）, ifnotpresent（不是最新时更新）</td>
   </tr>
   <tr>
     <td colspan="2">userId</td>
     <td>用户Id</td>
	 <td>该参数需要放到请求头中</td>
   </tr>
</table>     

#### **request example**

	{
		"accessPort": 8080,
		"appName": "hsn_testcpu",
		"deps": [],
		"env": {},
		"fromTemplate": false,
		"imageInfo": {
			"accessPort": 8080,
			"cmd": "bash /tomcat/bin/start.sh",
			"image": "repository://admin:aaa111@registry.paas:443/test/cpu1:2.0",
			"imageTag": {
				"createDate": 1474421911000,
				"deploy_timeout": "180000",
				"destroy_timeout": "120000",
				"id": 1,
				"registryId": "1",
				"startPort": 8080,
				"startScript": "bash /tomcat/bin/start.sh",
				"start_timeout": "120000",
				"stop_timeout": "120000",
				"tag": "2.0"
			},
			"logDir": "",
			"volumes": []
		},
		"netModel": "none",
		"strategyInfo": {
			"cpuQuota": 8,
			"cpus": 3,
			"imageUpdateType": "always",
			"isolate": true,
			"labels": {},
			"memory": 128,
			"replicas": 1,
			"sameHost": true,
			"shareCpu": true,
			"shareHost": true
		},
		"userId": 1
	}
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.2 更新应用集群及关联部署版本
####  `GET`  /application/doOperationAppClusterUpdate
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>clusterId</td>
     <td>集群的UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>versionId</td>
     <td>应用版本的id</td>
	 <td></td>
   </tr>
</table>

#### **request example**

	appId=cd5a07a1-293c-4322-a5e1-973d048a7f63&clusterId=b6cfcbea-9c9e-4cc8-88c6-51510936a351&versionId=12

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.3  应用部署
####  `POST`  /application/operation/rollingUpdateToNewVersion/app/{appId}
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>oldVersionId</td>
     <td>新版本vesionId</td>
	 <td>部署时，值为-1，部署当前版本</td>
   </tr>
   <tr>
     <td>newVersionId</td>
     <td>旧版本vesionId</td>
	 <td>部署时，值为-1，部署当前版本</td>
   </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.4 应用启动
####  `GET`  /application/operation/start/app/{appId}
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
</table>  

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.5  应用停止
####  `GET`  /application/operation/stop/app/{appId}
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
</table>  

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.6  应用卸载
####  `GET`  /application/operation/destroy/app/{appId}
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
</table>

#### **response** 

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.7  应用删除
####  `DELETE`  /application/operation/delete/app/{appId}
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
</table> 

#### **response** 

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.8  应用列表查询
####  `GET`  /application/listOperationApps
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appName</td>
     <td>应用名称</td>
	 <td></td>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
	 <td></td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>分页查询，页大小</td>
	 <td></td>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>分页查询，页号</td>
	 <td></td>
   </tr>
</table>

#### **request_example**
	appName =test&userId=1&pageNum=1&pageSize=50

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
      <td>rows</td>
      <td>应用记录集合</td>
	  <td></td>
   </tr>
   <tr>
      <td>total</td>
      <td>应用总数</td>
	  <td></td>
   </tr>
   <tr>
      <td>appId</td>
      <td>应用UUID</td>
	  <td></td>
   </tr>
   <tr>
      <td>appName</td>
      <td>应用名称</td>
	  <td></td>
   </tr>
   <tr>
      <td>clusterName</td>
      <td>集群名称</td>
	  <td></td>
   </tr>
   <tr>
      <td>instancesNumber</td>
      <td>应用部署的实例数</td>
	  <td></td>
   </tr>
   <tr>
      <td>status</td>
      <td>应用状态</td>
	  <td></td>
   </tr>
   <tr>
      <td>updateTime</td>
      <td>应用更新时间</td>
	  <td></td>
   </tr>
</table>

#### **response example**  
   
	{
		"rows": [
			{
				"appId": "b6cfcbea-9c9e-4cc8-88c6-51510936a351",
				"appName": "ter_tess",
				"clusterName": "cluster174",
				"instancesNumber": 1,
				"status": "DEPLOYED",
				"updateTime": "1476691188000"
			},
			{
				"appId": "cd5a07a1-293c-4322-a5e1-973d048a7f63",
				"appName": "hsn_testcpu",
				"clusterName": "",
				"instancesNumber": 0,
				"status": "FREE",
				"updateTime": "1476861180000"
			}
		]"total": 2
	}

###4.9  应用详情
####  `GET`  /application/getOperationAppdetail
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
</table>

#### **request_example**  

	appId=444db067-0231-4e9d-b260-c2efdd2c4dd2

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
      <td>appId</td>
      <td>应用UUID</td>
	  <td></td>
   </tr>
   <tr>
      <td>appName</td>
      <td>应用版本记录集合</td>
	  <td></td>
   </tr>
   <tr>
      <td>clusterName</td>
      <td>集群名称</td>
	  <td></td>
   </tr>
   <tr>
      <td>accessType</td>
      <td>应用访问方式</td>
	  <td></td>
   </tr>
   <tr>
      <td>status</td>
      <td>应用状态</td>
	  <td></td>
   </tr>
   <tr>
      <td>deployTime</td>
      <td>应用部署时间</td>
	  <td></td>
   </tr>
   <tr>
      <td>url</td>
      <td>应用访问url</td>
	  <td></td>
   </tr>
</table>

#### **response example** 
    
	{
		"accessType": "",
		"appId": "b6cfcbea-9c9e-4cc8-88c6-51510936a351",
		"appName": "ter_tess",
		"clusterName": "cluster174",
		"deployTime": 1476691188000,
		"status": "DEPLOYED",
		"url": ""
	}

###4.10  应用版本列表查询
####  `GET`  /application/listOperationAppVersions
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>分页查询，页大小</td>
	 <td></td>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>分页查询，页号</td>
	 <td></td>
   </tr>
</table>  

#### **request_example**

	appId=444db067-0231-4e9d-b260-c2efdd2c4dd2&pageNum=1&pageSize=50

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>rows</td>
     <td>应用版本记录集合</td>
	 <td></td>
   </tr>
   <tr>
     <td>total</td>
     <td>应用版本总数</td>
	 <td></td>
   </tr>
   <tr>
     <td>id</td>
     <td>版本记录主键id</td>
	 <td></td>
   </tr>
   <tr>
     <td>instancesNumber</td>
     <td>版本关联的实例数</td>
	 <td></td>
   </tr>
   <tr>
     <td>isCurrentVersion</td>
     <td>是否是当前版本</td>
	 <td></td>
   </tr>
   <tr>
     <td>versionId</td>
     <td>版本id</td>
	 <td></td>
   </tr>
   <tr>
     <td>versionNumber</td>
     <td>版本号</td>
	 <td></td>
   </tr>
</table>  
   
#### **response example**
    
	{
		"rows": [
			{
				"id": 215,
				"instancesNumber": 1,
				"isCurrentVersion": true,
				"versionId": 215,
				"versionNumber": "v215"
			}
		],
		"total": 1,
	}
	
###4.11  应用维护实例数
####  `POST`  /application/maintainAppInstances
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>scaleCount</td>
     <td>版本伸缩值记录</td>
	 <td>Map,key 值为版本号，value值为实例数</td>
   </tr>
</table>

#### **request_example**

	appId=d2768e8d-d754-4656-b2f7-5b34c996f9ef& scaleCount={"versionId1":"count1"}
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.12  应用实例列表查询
####  `GET`  /instance/list/{appId}
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>分页查询，页大小</td>
	 <td></td>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>分页查询，页号</td>
	 <td></td>
   </tr>
</table>

#### **request_example**

	pageNum=1&pageSize=50

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>rows</td>
     <td>应用实例记录集合</td>
	 <td></td>
   </tr>
   <tr>
     <td>total</td>
     <td>应用实例总数</td>
	 <td></td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>deployTime</td>
     <td>实例部署时间</td>
	 <td></td>
   </tr>
   <tr>
     <td>ip</td>
     <td>实例宿主机ip</td>
	 <td></td>
   </tr>
   <tr>
     <td>lxcIp</td>
     <td>实例容器ip</td>
	 <td></td>
   </tr>
   <tr>
     <td>lxcName</td>
     <td>容器名</td>
	 <td></td>
   </tr>
   <tr>
     <td>status</td>
     <td>实例状态</td>
	 <td></td>
   </tr>
   <tr>
     <td>versionId</td>
     <td>实例版本id</td>
	 <td></td>
   </tr>
</table>
 
#### **response example**
    
	{
		"rows": [
			{
				"instanceId": "444db067-0231-4e9d-b260-c2efdd2c4dd2",
				"deployTime": "2016-10-25 15:10:15",
				"ip": "10.1.108.132",
				"lxcIp": "192.168.1.41",
				"lxcName": "CN41",
				"status": "RUNNING",
				"versionId": 125
			},
			{
				"deployTime": "2016-10-25 15:10:15",
				"instanceId": "df6e56a8-2917-4bc4-86f9-0748dcf9b84d",
				"ip": "10.1.108.132",
				"lxcIp": "192.168.1.8",
				"lxcName": "CN8",
				"status": "RUNNING",
				"versionId": 125
			}
		],
		"total": 2
	}
	
###4.13  应用实例日志查询
####  `GET`  /log/query
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>keyWord</td>
     <td>查询关键字</td>
	 <td></td>
   </tr>
   <tr>
     <td>fromDate</td>
     <td>查询起始日期</td>
	 <td>时间戳</td>
   </tr>
   <tr>
     <td>toDate</td>
     <td>查询截止日期</td>
	 <td>时间戳</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>分页查询，页大小</td>
	 <td></td>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>查询关键字</td>
	 <td>分页查询，页号</td>
   </tr>
</table>

#### **request_example**
 
	appId=d2768e8d-d754-4656-b2f7-5b34c996f9ef&fromDate=1477324800000&instanceId=2f3291fd-a7fb-439f-91f3-516ac77c9f5d&keyWord=ddd&pageNum=1&pageSize=1000&toDate=1477411140000

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>msg</td>
      <td>日志内容</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" msg ":""
	}
	或
	{
		"result": false,
		" msg": ""
	}

###4.14  应用实例日志导出(cloudui接口)
####  `GET`  /apps/exportInstanceLog
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>keyWord</td>
     <td>查询关键字</td>
	 <td></td>
   </tr>
   <tr>
     <td>fromDate</td>
     <td>查询起始日期</td>
	 <td>时间戳</td>
   </tr>
   <tr>
     <td>toDate</td>
     <td>查询截止日期</td>
	 <td>时间戳</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>分页查询，页大小</td>
	 <td></td>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>查询关键字</td>
	 <td>分页查询，页号</td>
   </tr>
</table>

#### **request_example**

	appId=d2768e8d-d754-4656-b2f7-5b34c996f9ef&fromDate=1477324800000&instanceId=2f3291fd-a7fb-439f-91f3-516ac77c9f5d&keyWord=ddd&pageNum=1&pageSize=1000&toDate=1477411140000

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>导出文件</td>
     <td>.log类型文件</td>
   </tr>
</table>

###4.15  控制台登陆
####  `GET`  /application/getGateOneUrl
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
</table> 

#### **request_example**

	appId=124b9300-0aef-492c-995a-61fdfbc7372d

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>url</td>
      <td>GateOne的url</td>
   </tr>
   <tr>
      <td>message</td>
      <td>结果提示信息</td>
   </tr>
</table>

#### **response example**    

	{
		"result": true,
		"url":"http://127.0.0.1:8090"
	}
	或
	{
		"result": false,
		"message": failedInfo
	}

###4.16  负载策略创建
####  `POST`  /serviceLoadbalancer/operationLoadbalancerCreate
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>name</td>
     <td>负载均衡器名称</td>
	 <td>对外发布时，值为空“”；不外发布时，值为空二级负载器名称</td>
   </tr>
   <tr>
     <td>id</td>
     <td>负载均衡器id</td>
	 <td>对外发布时，值为空“”；不外发布时，值为空二级负载器id</td>
   </tr>
   <tr>
     <td>lbalancerApps</td>
     <td>负载均衡器和应用对应关系</td>
	 <td>List类型，主要存放应用的负载策略信息</td>
   </tr>
   <tr>
     <td>fromTemplate</td>
     <td>策略是否来自模板</td>
	 <td>默认为false</td>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用的UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>lbalancerStrategies</td>
     <td>应用负载策略</td>
	 <td>List类型，存放引用的负载策略信息</td>
   </tr>
   <tr>
     <td>contextIn</td>
     <td>应用访问接入上下文载策略</td>
	 <td>值与contextOut一致</td>
   </tr>
   <tr>
     <td>contextOut</td>
     <td>应用访问接出上下文</td>
	 <td>值与contextIn一致</td>
   </tr>
   <tr>
     <td>protocolType</td>
     <td>应用访问协议</td>
	 <td>http/https/tcp</td>
   </tr>
   <tr>
     <td>sourcePort</td>
     <td>应用访问接入端口</td>
	 <td></td>
   </tr>
   <tr>
     <td>targetPort</td>
     <td>应用访问接出端口</td>
	 <td></td>
   </tr>
   <tr>
     <td>isTwoway</td>
     <td>是否双向认证</td>
	 <td>protocolType 为https时，可选项，默认为false</td>
   </tr>
   <tr>
     <td>loadType</td>
     <td>负载策略类型</td>
	 <td>值1 (轮询)，值2(优先权重)，值3(回话保持)</td>
   </tr>
   <tr>
     <td>weightValues</td>
     <td>应用实例权重值</td>
	 <td>List类型，loadType为2时，必填项，默认为空[]</td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>weight</td>
     <td>权重值</td>
	 <td>取值范围1-10，默认为1</td>
   </tr>
   <tr>
     <td>isPublic</td>
     <td>是否对外发布</td>
	 <td>True 对外发布, false 不对外发布</td>
   </tr>
</table>

#### **request example**   
	{
		"fromTemplate": false,
		"id": -1,
		"lbalancerApps": [
			{
				"appId": "4735ec6c-8eca-47b8-9f07-e1c5dfd30407",
				"lbalancerStrategies": [
					{
						"contextIn": "testcpu",
						"contextOut": "testcpu",
						"protocolType": "http",
						"sourcePort": 1234,
						"targetPort": 8080,
						"isTwoway": false
					}
				],
				"loadType": "1",
				"weightValues": [
					{
						" instanceId": "74f94216-1be4-47d5-837a-8ff89a0eb894 ",
						" weight ": "1"
					}
				],
				"public": true
			}
		],
		"name": ""
	}

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		"message": failedInfo
	}

###4.17  负载策略更新
####  `POST`  /serviceLoadbalancer/operationLoadbalancerUpdate
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>name</td>
     <td>负载均衡器名称</td>
	 <td>对外发布时，值为空“”；不外发布时，值为空二级负载器名称</td>
   </tr>
   <tr>
     <td>id</td>
     <td>负载均衡器id</td>
	 <td>对外发布时，值为-1；不外发布时，值为空二级负载器id</td>
   </tr>
   <tr>
     <td>fromTemplate</td>
     <td>策略是否来自模板</td>
	 <td>默认为false</td>
   </tr>
   <tr>
     <td>lbalancerApps</td>
     <td>负载均衡器和应用对应关系</td>
	 <td>List类型，主要存放应用的负载策略信息</td>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用的UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>lbalancerStrategies</td>
     <td>应用负载策略</td>
	 <td>List类型，存放引用的负载策略信息</td>
   </tr>
   <tr>
     <td>lbalancerStrategies.id</td>
     <td>策略id</td>
	 <td>数据库已存在策略id,若策略是新增的，则值为-1</td>
   </tr>
   <tr>
     <td>contextIn</td>
     <td>应用访问接入上下文</td>
	 <td>值与contextOut一致</td>
   </tr>
   <tr>
     <td>contextOut</td>
     <td>应用访问接出上下文</td>
	 <td>值与contextIn一致</td>
   </tr>
   <tr>
     <td>protocolType</td>
     <td>应用访问协议</td>
	 <td>http/https/tcp</td>
   </tr>
   <tr>
     <td>sourcePort</td>
     <td>应用访问接入端口</td>
	 <td></td>
   </tr>
   <tr>
     <td>targetPort</td>
     <td>应用访问接出端口</td>
	 <td></td>
   </tr>
   <tr>
     <td>isTwoway</td>
     <td>是否双向认证</td>
	 <td>protocolType 为https时，可选项，默认为false</td>
   </tr>
   <tr>
     <td>loadType</td>
     <td>负载策略类型</td>
	 <td>值1 (轮询)，值2(优先权重)，值3(回话保持)</td>
   </tr>
   <tr>
     <td>weightValues</td>
     <td>应用实例权重值</td>
	 <td>List类型，loadType为2时，必填项，默认为空[]</td>
   </tr>
   <tr>
     <td>weightValues.id</td>
     <td>权重id</td>
	 <td>数据库已存在权重记录id,若权重是新增的，则值为-1</td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>weight</td>
     <td>权重值</td>
	 <td>取值范围1-10，默认为1</td>
   </tr>
   <tr>
     <td>isPublic</td>
     <td>是否对外发布</td>
	 <td>True 对外发布, false 不对外发布</td>
   </tr>
</table>

#### **request example** 
  
	{
		"fromTemplate": false,
		"id": -1,
		"lbalancerApps": [
			{
				"appId": "4735ec6c-8eca-47b8-9f07-e1c5dfd30407",
				"lbalancerStrategies": [
					{
						"id":-1,
						"contextIn": "testcpu1",
						"contextOut": "testcpu1",
						"protocolType": "http",
						"sourcePort": 1234,
						"targetPort": 8080,
						"isTwoway": false
					},
					{
					"id":12,
                    "contextIn": "testcpu2",
                    "contextOut": "testcpu2",
                    "protocolType": "https",
                    "sourcePort": 1235,
                    "targetPort": 8081,
                    "twoway": true
					}
				],
				"loadType": "1",
				"weightValues": [
					{
						"id":-1,
						" instanceId": "74f94216-1be4-47d5-837a-8ff89a0eb894 ",
						" weight ": "1"
					},
					{
						"id":12,
						" instanceId": "88f94216-1be4-47d5-837a-8ff89a0eb877 ",
					" weight ": "2"
					}

				],
				"public": true
			}
		],
		"name": ""
	}

####  **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}


####4.18  负载策略查询
####  `GET`  /serviceLoadbalancer/getOperationLoadbalancer
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
</table>

#### **request_example**

	appId=88f94216-1be4-47d5-837a-8ff89a0eb877

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>name</td>
     <td>负载均衡器名称</td>
	 <td>对外发布时，值为空“”；不外发布时，值为空二级负载器名称</td>
   </tr>
   <tr>
     <td>id</td>
     <td>负载均衡器id</td>
	 <td>对外发布时，值为-1；不外发布时，值为空二级负载器id</td>
   </tr>
   <tr>
     <td>fromTemplate</td>
     <td>策略是否来自模板</td>
	 <td>默认为false</td>
   </tr>
   <tr>
     <td>lbalancerApps</td>
     <td>负载均衡器和应用对应关系</td>
	 <td>List类型，主要存放应用的负载策略信息</td>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用的UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>lbalancerStrategies</td>
     <td>应用负载策略</td>
	 <td>List类型，存放引用的负载策略信息</td>
   </tr>
   <tr>
     <td>lbalancerStrategies.id</td>
     <td>策略id</td>
	 <td>数据库已存在策略id,若策略是新增的，则值为-1</td>
   </tr>
   <tr>
     <td>contextIn</td>
     <td>应用访问接入上下文</td>
	 <td>值与contextOut一致</td>
   </tr>
   <tr>
     <td>contextOut</td>
     <td>应用访问接出上下文</td>
	 <td>值与contextIn一致</td>
   </tr>
   <tr>
     <td>protocolType</td>
     <td>应用访问协议</td>
	 <td>http/https/tcp</td>
   </tr>
   <tr>
     <td>sourcePort</td>
     <td>应用访问接入端口</td>
	 <td></td>
   </tr>
   <tr>
     <td>targetPort</td>
     <td>应用访问接出端口</td>
	 <td></td>
   </tr>
   <tr>
     <td>isTwoway</td>
     <td>是否双向认证</td>
	 <td>protocolType 为https时，可选项，默认为false</td>
   </tr>
   <tr>
     <td>loadType</td>
     <td>负载策略类型</td>
	 <td>值1 (轮询)，值2(优先权重)，值3(回话保持)</td>
   </tr>
   <tr>
     <td>weightValues</td>
     <td>应用实例权重值</td>
	 <td>List类型，loadType为2时，必填项，默认为空[]</td>
   </tr>
   <tr>
     <td>weightValues.id</td>
     <td>权重id</td>
	 <td>数据库已存在权重记录id,若权重是新增的，则值为-1</td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>ip</td>
     <td>实例宿主机ip</td>
	 <td></td>
   </tr>
   <tr>
     <td>lxc_ip</td>
     <td>实例容器ip</td>
	 <td></td>
   </tr>
   <tr>
     <td>weight</td>
     <td>权重值</td>
	 <td>取值范围1-10，默认为1</td>
   </tr>
   <tr>
     <td>isPublic</td>
     <td>是否对外发布</td>
	 <td>True 对外发布, false 不对外发布</td>
   </tr>
</table>

#### **response example**
    
	{
		"message": {
			"id": -1,
			"isPublic": true,
			"lisenterJson": [
				{
					"context": "TestWebServer/",
					"id": 185,
					"isTwoway": false,
					"potocolType": "http",
					"sourcePort": 15599,
					"targetPort": 8080
				}
			],
			"name": "loadbalancer",
			"strategyType": "1",
			"weightValues": [
				{
					"instanceId": "74f94216-1be4-47d5-837a-8ff89a0eb894",
					"ip": "10.1.153.173",
					"lxc_ip": "192.168.1.6",
					"weight": "1"
				},
				{
					"instanceId": "f0831292-9f1f-4684-af3e-7ff421872aaa",
					"ip": "10.1.153.173",
					"lxc_ip": "192.168.1.5",
					"weight": "1"
				}
			]
		},
		"result": true
	}
	或
	{
		"result": false,
		"message": failedInfo
	}

###4.19  负载策略删除
####  `DELETE`  /serviceLoadbalancer/operationLoadbalancerDelete
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>id</td>
     <td>负载均衡器id</td>
	 <td>对外发布值为-1，不对外发布为负载均衡器id</td>
   </tr>
</table>

#### **request_example**

	appId=88f94216-1be4-47d5-837a-8ff89a0eb877& id=1234

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.20  负载策略源端口校验
####  `GET`  /serviceLoadbalancer/isExistSourcePort
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>lbId</td>
     <td>负载均衡器id</td>
	 <td>对外发布值为-1，不对外发布为负载均衡器id</td>
    </tr>
	<tr>
     <td>id</td>
     <td>负载策略主键id</td>
	 <td>数据库已存在策略id,若策略是新增的，则值为空""</td>
    </tr>
	<tr>
     <td>context</td>
     <td>应用访问上下文</td>
	 <td></td>
    </tr>
	<tr>
     <td>protocolType</td>
     <td>应用访问协议</td>
	 <td>http/https/tcp</td>
    </tr>
	<tr>
     <td>sourcePort</td>
     <td>应用访问接入端口</td>
	 <td></td>
    </tr>
	<tr>
     <td>isPublic</td>
     <td>是否对外发布</td>
	 <td>True 对外发布, false 不对外发布</td>
    </tr>
</table>

#### **request_example**

	appId=88f94216-1be4-47d5-837a-8ff89a0eb877& id=1234

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}


###4.21  创建端口映射
####  `POST`  /application/createOperationAppPortsMapping
#### **request**
<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appPorts</td>
     <td>映射端口集合</td>
	 <td>List类型</td>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
    </tr>
	<tr>
     <td>container_port</td>
     <td>容器内部端口</td>
	 <td></td>
    </tr>
	<tr>
     <td>protocol</td>
     <td>协议类型</td>
	 <td>tcp或udp</td>
    </tr>
</table>

#### **request_example**

	[
	  {
	   "appId": "124b9300-0aef-492c-995a-61fdfbc7372d",
	   "container_port": 8224,
	   "protocol": "tcp"
	  }
	]

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.22  查看端口映射列表
####  `GET`  /application/getOperationAppPorts
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
</table>  

#### **request_example**

	appId=124b9300-0aef-492c-995a-61fdfbc7372d

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>appPorts</td>
     <td>映射端口集合</td>
	 <td>List类型</td>
    </tr>
	<tr>
     <td>container_port</td>
     <td>容器内部端口</td>
	 <td></td>
    </tr>
	<tr>
     <td>protocol</td>
     <td>协议类型</td>
	 <td>tcp或udp</td>
    </tr>
	<tr>
     <td>result</td>
     <td>执行结果</td>
	 <td></td>
    </tr>
	<tr>
     <td>message</td>
     <td>结果提示信息</td>
	 <td></td>
    </tr>
</table>

#### **response example**    
	[
	  {
	   "appId": "124b9300-0aef-492c-995a-61fdfbc7372d",
	   "container_port": 8224,
	   "protocol": "tcp"
	  }
	]
	或
	{
		"result": false,
		"message": failedInfo
	}

###4.23  查看实例端口映射列表
####  `GET`  /application/getOperationAppPortsMapping
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>containerPort</td>
     <td>容器内部端口</td>
	 <td></td>
    </tr>
</table>   

#### **request_example**

	appId=124b9300-0aef-492c-995a-61fdfbc7372d&containerPort=8080

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>appPorts</td>
     <td>映射端口集合</td>
	 <td>List类型</td>
    </tr>
	<tr>
     <td>instanceId</td>
     <td>实例UUID</td>
	 <td></td>
    </tr>
	<tr>
     <td>container_port</td>
     <td>容器内部端口</td>
	 <td></td>
    </tr>
	<tr>
     <td>host_port</td>
     <td>宿主机映射端口</td>
	 <td></td>
    </tr>
	<tr>
     <td>protocol</td>
     <td>协议类型</td>
	 <td>tcp 或udp</td>
    </tr>
	<tr>
     <td>result</td>
     <td>执行结果</td>
	 <td></td>
    </tr>
	<tr>
     <td>message</td>
     <td>结果提示信息</td>
	 <td></td>
    </tr>
</table>

#### **response example**    
	[
		{
			"appId": "124b9300-0aef-492c-995a-61fdfbc7372d",
			"container_port": 8224,
			"host_ip": "10.1.153.173",
			"host_port": 7000,
			"instanceId": "9247688e-3362-46c4-8556-e01df0507027",
			"protocol": "tcp"
		}
	]
	或
	{
		"result": false,
		"message": failedInfo
	}

###4.24  端口映射端口删除
####  `POST`  /application/deleteOperationAppPortsMapping
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>appPort</td>
     <td>容器记录</td>
	 <td>Map</td>
    </tr>
	<tr>
     <td>container_port</td>
     <td>容器端口</td>
	 <td></td>
    </tr>
	<tr>
     <td>protocol</td>
     <td>协议类型</td>
	 <td>tcp 或udp</td>
    </tr>
</table>

#### **request_example**

	{
		"appId": "124b9300-0aef-492c-995a-61fdfbc7372d",
		"container_port": 8224,
		"protocol": "tcp"
	}
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.25  端口映射端口校验
####  `GET`  /application/isExistContainer
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>containerPort</td>
     <td>容器端口</td>
	 <td></td>
    </tr>
</table>

#### **request_example**

	appId=88f94216-1be4-47d5-837a-8ff89a0eb877&containerPort=8080

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.26  创建外部网络映射
####  `POST`  /application/createOperationAppPortsMapping
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>outgoing_ips</td>
     <td>外部网络记录</td>
	 <td>List类型</td>
    </tr>
	<tr>
     <td>outIp</td>
     <td>外部网络ip</td>
	 <td></td>
    </tr>
	<tr>
     <td>port</td>
     <td>外部网络端口</td>
	 <td>非必填项，不填时，值为""</td>
    </tr>
	<tr>
     <td>protocol</td>
     <td>协议类型</td>
	 <td>tcp 或udp</td>
    </tr>
</table>

#### **request example**

	appId=124b9300-0aef-492c-995a-61fdfbc7372d&
	outgoing_ips=[
		{
			"outIp": "10.126.3.163",
			"port": 3306,
			"protocol": "udp"
		}
	]

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}


###4.27  查看外部网络列表
####  `GET`  /application/getOperationAppOutGoingIPs
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
</table>

#### **request_example**

	appId=124b9300-0aef-492c-995a-61fdfbc7372d

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>outgoing_ips</td>
     <td>外部网络记录</td>
	 <td>List类型</td>
    </tr>
	<tr>
     <td>outIp</td>
     <td>外部网络ip</td>
	 <td></td>
    </tr>
	<tr>
     <td>port</td>
     <td>外部网络端口</td>
	 <td>选项，不填时，值为""</td>
    </tr>
	<tr>
      <td>result</td>
      <td>执行结果</td>
	  <td></td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
	  <td></td>
   </tr>
</table>

#### **response example**
    
	{
		"appId": "124b9300-0aef-492c-995a-61fdfbc7372d",
		"outgoing_ips": [
			{
				"outIp": "10.126.3.163",
				"port": "3306",
				"protocol": "udp"
			}
		]
	}
	或
	{
		"result": false,
		"message": failedInfo
	}

###4.28  外部网络映射删除
####  `POST`  /application/deleteOperationAppOutGoingIPs
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>outgoing_ip</td>
     <td>外部网络ip</td>
	 <td></td>
    </tr>
	<tr>
     <td>port</td>
     <td>外部网络端口</td>
	 <td>非必填项，不填时，值为""</td>
    </tr>
	<tr>
     <td>protocol</td>
     <td>协议类型</td>
	 <td>tcp 或udp</td>
    </tr>
</table>

#### **request_example**

	appId=124b9300-0aef-492c-995a-61fdfbc7372d&outgoing_ip=10.126.3.163&port=3306&protocol=udp
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.29  外部网络映射校验
####  `GET`  /application/isExistIp
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用UUID</td>
	 <td></td>
   </tr>
   <tr>
     <td>outgoing_ip</td>
     <td>外部网络ip</td>
	 <td></td>
    </tr>
	<tr>
     <td>port</td>
     <td>外部网络端口</td>
	 <td>非必填项，不填时，值为""</td>
    </tr>
	<tr>
     <td>protocol</td>
     <td>协议类型</td>
	 <td>tcp 或udp</td>
    </tr>
</table>

#### **request_example**

	appId=88f94216-1be4-47d5-837a-8ff89a0eb877&outIp=10.126.3.161&port=3306&protocol=tcp

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###4.30  应用更新版本
####  `POST`  /application/operation/update/app
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th colspan="2">名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td colspan="2">appId</td>
     <td>应用唯一主键</td>
	 <td></td>
   </tr>
   <tr>
     <td colspan="2">appName</td>
     <td>应用</td>
	 <td></td>
    </tr>
	<tr>
     <td colspan="2">accessPort</td>
     <td>访问端口</td>
	 <td></td>
    </tr>
	<tr>
     <td colspan="2">deps</td>
     <td>依赖应用</td>
	 <td>Map类型</td>
    </tr>
	<tr>
     <td colspan="2">env</td>
     <td>环境变量</td>
	 <td>Map类型</td>
    </tr>
	<tr>
     <td colspan="2">fromTemplate</td>
     <td>是否来自模板</td>
	 <td>默认 false</td>
    </tr>
	<tr>
	 <td rowspan="7">imageInfo</td>
     <td>accessPort</td>
     <td>访问端口</td>
	 <td></td>
    </tr>
	<tr>
     <td>cmd</td>
     <td>启动脚本</td>
	 <td></td>
    </tr>
	<tr>
     <td>image</td>
     <td>镜像地址</td>
	 <td></td>
    </tr>
	<tr>
     <td>imageTag</td>
     <td>镜像标签</td>
	 <td></td>
    </tr>
	<tr>
     <td>logDir</td>
     <td>日志目录</td>
	 <td></td>
    </tr>
	<tr>
     <td>volumes</td>
     <td>卷映射目录</td>
	 <td>Map类型</td>
    </tr>
	<tr>
     <td>netModel</td>
     <td>网络模型</td>
	 <td>none（默认模式）,host（主机模式</td>
    </tr>
	<tr>
	 <td rowspan="10">strategyInfo</td>
     <td>cpuQuota</td>
     <td>cpu配额</td>
	 <td></td>
    </tr>
	<tr>
     <td>cpus</td>
     <td>cpu核数</td>
	 <td></td>
    </tr>
	<tr>
     <td>imageUpdateType</td>
     <td>镜像更新类型</td>
	 <td>always（总是更新），never（从不更新）, ifnotpresent（不是最新时更新）</td>
    </tr>
	<tr>
     <td>isolate</td>
     <td>是否隔离</td>
	 <td>默认true</td>
    </tr><tr>
     <td>labels</td>
     <td>标签</td>
	 <td>Map格式</td>
    </tr>
	<tr>
     <td>memory</td>
     <td>内存</td>
	 <td></td>
    </tr>
	<tr>
     <td>replicas</td>
     <td>实例个数</td>
	 <td></td>
    </tr>
	<tr>
     <td>sameHost</td>
     <td>是否同一主机</td>
	 <td></td>
    </tr>
	<tr>
     <td>shareCpu</td>
     <td>是否共享cpu</td>
	 <td></td>
    </tr>
	<tr>
     <td>shareHost</td>
     <td>是否共享主机</td>
	 <td></td>
    </tr>
	<tr>
	 <td colspan="2">userId</td>
     <td>用户Id</td>
     <td>该参数需要放到请求头中</td>
	 <td></td>
    </tr>
</table>

#### **request example**
	{
	"appId":"767da2b2-2be2-4e7a-84c2-176cd4e791e7",
	"accessPort": 8080,
		"appName": "hsn_testcpu",
		"deps": [],
		"env": {},
		"fromTemplate": false,
		"imageInfo": {
			"accessPort": 8080,
			"cmd": "bash /tomcat/bin/start.sh",
			"image": "repository://admin:aaa111@registry.paas:443/test/cpu1:2.0",
			"imageTag": {
				"createDate": 1474421911000,
				"deploy_timeout": "180000",
				"destroy_timeout": "120000",
				"id": 1,
				"registryId": "1",
				"startPort": 8080,
				"startScript": "bash /tomcat/bin/start.sh",
				"start_timeout": "120000",
				"stop_timeout": "120000",
				"tag": "2.0"
			},
			"logDir": "",
			"volumes": []
		},
		"netModel": "none",
		"strategyInfo": {
			"cpuQuota": 8,
			"cpus": 3,
			"imageUpdateType": "always",
			"isolate": true,
			"labels": {},
			"memory": 128,
			"replicas": 1,
			"sameHost": true,
			"shareCpu": true,
			"shareHost": true
		},
		"userId": 1
	}
	
####  **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}


###4.31  更新滚动升级/灰度发布
####  `POST`  /application/operation/gatedlaunch/app/request
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
	  <th>说明</th>
   </tr>
   <tr>
     <td>oldVersionId</td>
     <td>旧版本ID</td>
	 <td></td>
   </tr>
   <tr>
     <td>newVersionId</td>
     <td>新版本ID</td>
	 <td></td>
    </tr>
	<tr>
     <td>runningOldVersionNum</td>
     <td>运行中的旧版本实例数目</td>
	 <td></td>
    </tr>
	<tr>
     <td>runningNewVersionNum</td>
     <td>运行中的新版本实例数目</td>
	 <td></td>
    </tr>
	<tr>
     <td>afterUpdatedOldNum</td>
     <td>预期的旧版本实例数目</td>
	 <td></td>
    </tr>
	<tr>
     <td>afterUpdatedNewNum</td>
     <td>预期的新版本实例数目</td>
	 <td></td>
    </tr>
</table>

#### **request example**

	Form提交
	oldVersionId:412
	newVersionId:432
	runningOldVersionNum:10
	runningNewVersionNum:0
	afterUpdatedOldNum:5
	afterUpdatedNewNum:5
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

##5. Master模板管理接口
###5.1 创建模板资源
####  `POST`  /application/createTemplate
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>templateName</td>
     <td>模板名称</td>
   </tr>
   <tr>
     <td>description</td>
     <td>模板描述</td>
    </tr>
	<tr>
     <td>source</td>
     <td>具体内容</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###5.2 部署模板
#### **部署模板分两步，首先创建模板包含的应用，然后调用应用部署接口部署这些应用**
#### 14.2.1 
####  `GET`  /application/deployTemplate
#### **request example**

	templateInfoUUID=176cd4e791e7&clusterId=cluster1&templateName=test
	templateInfoUUID为模板资源的唯一主键
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

####5.2.2
####  `GET`  /application/deployAppsInTemplate
#### **request example**

	templateUUID=176cd4e791e7-176cd4e791e7
	templateUUID为已部署模板的唯一主键
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###5.3 启动模板
####  `GET`  / application/startTemplate
#### **request example**

	templateUUID=176cd4e791e7-176cd4e791e7
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###5.4 停止模板
####  `GET`  /application/stopTemplate
#### **request example**

	templateUUID=176cd4e791e7-176cd4e791e7
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###5.5 卸载模板
####  `GET`/application/destoryTemplate
#### **request example**

	templateUUID=176cd4e791e7-176cd4e791e7
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###5.6 删除模板
####  `DELETE`  /application/deleteTemplate
#### **request example**

	templateUUID=176cd4e791e7-176cd4e791e7
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###5.7 模板资源列表
####  `GET`  /application/listTemplates
#### **request example**

	templateName=test& pageNum=1& pageSize=10
	
#### **Response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>startRowNum</td>
     <td>开始行（包含）</td>
   </tr>
   <tr>
     <td>endRowNum</td>
     <td>结束行（不包含）</td>
    </tr>
	<tr>
     <td>objCondition</td>
     <td>查询条件</td>
    </tr>
	<tr>
     <td>pageNumber</td>
     <td>第几页</td>
    </tr>
	<tr>
     <td>pageSize</td>
     <td>每页多少条记录</td>
    </tr>
	<tr>
     <td>total</td>
     <td>总记录数</td>
    </tr>
	<tr>
     <td>totalPageNum</td>
     <td>总页数</td>
    </tr>
	<tr>
     <td>rows</td>
     <td>具体内容</td>
    </tr>
</table>

###5.8 已部署模板列表
####  `GET`  /application/ listDeployedTemplates
#### **request example**

	templateName=test& pageNum=1& pageSize=10
	
#### **Response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>startRowNum</td>
     <td>开始行（包含）</td>
   </tr>
   <tr>
     <td>endRowNum</td>
     <td>结束行（不包含）</td>
    </tr>
	<tr>
     <td>objCondition</td>
     <td>查询条件</td>
    </tr>
	<tr>
     <td>pageNumber</td>
     <td>第几页</td>
    </tr>
	<tr>
     <td>pageSize</td>
     <td>每页多少条记录</td>
    </tr>
	<tr>
     <td>total</td>
     <td>总记录数</td>
    </tr>
	<tr>
     <td>totalPageNum</td>
     <td>总页数</td>
    </tr>
	<tr>
     <td>rows</td>
     <td>具体内容</td>
    </tr>
</table>

###5.9 模板包含的应用列表
####  `GET`  /application/ listTemplateApps
#### **request example**

	templateUUID=e87566-ac764-ff9985

#### **Response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>startRowNum</td>
     <td>开始行（包含）</td>
   </tr>
   <tr>
     <td>endRowNum</td>
     <td>结束行（不包含）</td>
    </tr>
	<tr>
     <td>objCondition</td>
     <td>查询条件</td>
    </tr>
	<tr>
     <td>pageNumber</td>
     <td>第几页</td>
    </tr>
	<tr>
     <td>pageSize</td>
     <td>每页多少条记录</td>
    </tr>
	<tr>
     <td>total</td>
     <td>总记录数</td>
    </tr>
	<tr>
     <td>totalPageNum</td>
     <td>总页数</td>
    </tr>
	<tr>
     <td>rows</td>
     <td>具体内容</td>
    </tr>
</table>

###5.10  删除模板资源
####  `DELETE`  /application/ deleteTemplateInfo
#### **request example**

	templateInfoUUID= e87566-ac764-ff9985

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example**
    
	{
		"result": true,
		" message ":successedInfo
	}
	或
	{
		"result": false,
		" message ": failedInfo
	}

###5.11  应用导出为模板
####  `GET`  /application/templateExport
#### **request example**

	appIds= 3f6ce285-8ecb-4d6d-99f5-976eb6aad536, 537437ac-908c-4e44-995b-a0b81cbe021c

#### **Response example**

	{
	  "apps":[
		{
		  "accessPort":2181,
		  "appType":"app",
		  "cmd":"bash /bin/entrypoint.sh",
		  "config":[
			{
			  "description":"",
			  "key":"tickTime",
			  "value":"2000"
			},
			{
			  "description":"",
			  "key":"dataDir",
			  "value":"/var/zookeeper"
			},
			{
			  "description":"对应启动端口",
			  "key":"clientPort",
			  "value":"2181"
			},
			{
			  "description":"",
			  "key":"initLimit",
			  "value":"5"
			},
			{
			  "description":"",
			  "key":"syncLimit",
			  "value":"2"
			},
			{
			  "description":"",
			  "key":"server.1",
			  "value":"localhost:1121:1122"
			},
			{
			  "description":"",
			  "key":"server.2",
			  "value":"localhost:1221:1222"
			},
			{
			  "description":"",
			  "key":"server.3",
			  "value":"localhost:1321:1322"
			}
		  ],
		  "deps":[],
		  "envs":{},
		  "imageInfo":{
			"deploy_timeout":"600000",
			"destroy_timeout":"60000",
			"image":"repository://admin:aaa111@registry.paas:443/test/zookeeper:latest",
			"registryId":"1",
			"start_timeout":"60000",
			"stop_timeout":"60000"
		  },
		  "imageUpdateType":"always",
		  "isLbalancer":false,
		  "isPublic":false,
		  "link":{},
		  "logDirs":"",
		  "name":"zoo1",
		  "needInit":false,
		  "netModel":"host",
		  "nodeCluster":"",
		  "nodes":"",
		  "priority":0,
		  "replicas":1,
		  "strategies":{
			"cpuQuota":"6",
			"cpus":"1",
			"labels":{},
			"memory":"128",
			"replicas":"1",
			"sameHost":true,
			"shareCpu":true,
			"shareHost":true
		  },
		  "useLoadBalance":false,
		  "volumes":[]
		},
		{
		  "accessPort":2181,
		  "appType":"app",
		  "cmd":"bash /bin/entrypoint.sh",
		  "config":[
			{
			  "description":"",
			  "key":"tickTime",
			  "value":"2000"
			},
			{
			  "description":"",
			  "key":"dataDir",
			  "value":"/var/zookeeper"
			},
			{
			  "description":"对应启动端口",
			  "key":"clientPort",
			  "value":"2182"
			},
			{
			  "description":"",
			  "key":"initLimit",
			  "value":"5"
			},
			{
			  "description":"",
			  "key":"syncLimit",
			  "value":"2"
			},
			{
			  "description":"",
			  "key":"server.1",
			  "value":"localhost:1121:1122"
			},
			{
			  "description":"",
			  "key":"server.2",
			  "value":"localhost:1221:1222"
			},
			{
			  "description":"",
			  "key":"server.3",
			  "value":"localhost:1321:1322"
			}
		  ],
		  "deps":[],
		  "envs":{},
		  "imageInfo":{
			"deploy_timeout":"600000",
			"destroy_timeout":"60000",
			"image":"repository://admin:aaa111@registry.paas:443/test/zookeeper:latest",
			"registryId":"1",
			"start_timeout":"60000",
			"stop_timeout":"60000"
		  },
		  "imageUpdateType":"always",
		  "isLbalancer":false,
		  "isPublic":false,
		  "link":{},
		  "logDirs":"",
		  "name":"zoo2",
		  "needInit":false,
		  "netModel":"host",
		  "nodeCluster":"",
		  "nodes":"",
		  "priority":0,
		  "replicas":1,
		  "strategies":{
			"cpuQuota":"10",
			"cpus":"1",
			"labels":{},
			"memory":"128",
			"replicas":"1",
			"sameHost":true,
			"shareCpu":true,
			"shareHost":true
		  },
		  "useLoadBalance":false,
		  "volumes":[]
		}
	  ]
	}

##6. Master任务管理接口
###6.1. 新建任务
#### `POST` /application/ jobs/saveJob
#### **Request** 
``` js
     {
	  "name": "test",
	  "description": "test test",
	  "network": "none",
	  "taskCmd": "change everything",
	  "shareCpu": true,
	  "cpuQuota": "",
	  "cpuNumber": "",
	  "optionsMmx": 1212,
	  "image": "repository://admin:aaa111@registry.paas:443/test/zookeeper:latest",
	  "imageTag": {
	    "createDate": 1476871133000,
	    "deploy_timeout": "600000",
	    "destroy_timeout": "60000",
	    "id": 17,
	    "startPort": 2181,
	    "startScript": "bash /bin/entrypoint.sh",
	    "start_timeout": "60000",
	    "stop_timeout": "60000",
	    "tag": "latest",
	    "registryId": "1"
	  },
	  "dockerVolumes": [{
	    "host_dir": "/tte",
	    "container_dir": "/mmh",
	    "rw": "ro"
	  }]
	}
```
#### **response**
<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>
 
#### **response example**
``` js
    {
	"result": true,
	" message ":successedInfo
    }
```
或
``` js
    {
	"result": false,
	" message ": failedInfo
    }
```

###6.2. 更新任务
#### `POST` /application/ jobs/updateJob
#### **Request** 
``` js
    { 
	  "uuid": "90714963-b54b-4b9e-89c4-be67c7614b8f",
	  "name": "test",
	  "description": "test test",
	  "network": "none",
	  "taskCmd": "change everything",
	  "shareCpu": true,
	  "cpuQuota": "",
	  "cpuNumber": "",
	  "optionsMmx": 1212,
	  "image": "repository://admin:aaa111@registry.paas:443/test/zookeeper:latest",
	  "imageTag": {
	    "createDate": 1476871133000,
	    "deploy_timeout": "600000",
	    "destroy_timeout": "60000",
	    "id": 17,
	    "startPort": 2181,
	    "startScript": "bash /bin/entrypoint.sh",
	    "start_timeout": "60000",
	    "stop_timeout": "60000",
	    "tag": "latest",
	    "registryId": "1"
	  },
	  "dockerVolumes": [{
	    "host_dir": "/tte",
	    "container_dir": "/mmh",
	    "rw": "ro"
	  }]
    }
```
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
</table>

#### **response example** 
   
``` js
    {
	"result": true,
	" message ":successedInfo
    }
```
或
``` js
    {
	"result": false,
	" message ": failedInfo
    }
```
###6.3. 删除任务
#### `DELETE` /application/ jobs/deleteJob
	uuid=90714963-b54b-4b9e-89c4-be67c7614b8f

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>提示信息</td>
   </tr>
 </table>  
 
#### **response example**
``` js
    {
	"result": true,
	" message ":successedInfo
    }
```
或
``` js
    {
	"result": false,
	" message ": failedInfo
    }
```
###6.4. 任务列表
#### `GET` /application/ jobs/listJobs
	name=test& pageNum=1& pageSize=10
#### **Response**
<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>startRowNum</td>
      <td>开始行（包含）</td>
   </tr>
   <tr>
      <td>endRowNum</td>
      <td>结束行（不包含）</td>
   </tr>
   <tr>
      <td>objCondition</td>
      <td>查询条件</td>
   </tr>
   <tr>
      <td>pageNumber</td>
      <td>第几页</td>
   </tr>
   <tr>
      <td>pageSize</td>
      <td>每页多少条记录</td>
   </tr>
   <tr>
      <td>total</td>
      <td>总记录数</td>
   </tr>
   <tr>
      <td>totalPageNum</td>
      <td>总页数</td>
   </tr>
   <tr>
      <td>rows</td>
      <td>具体内容</td>
   </tr>
</table>

###6.5. 查看任务详情
#### `GET` /application/ jobs/findJobByUUID
	uuid=90714963-b54b-4b9e-89c4-be67c7614b8f
#### **resoponse**
``` js
    {
	  "cpuNumber": 5,
	  "cpuQuota": 21,
	  "description": "yangzhe",
	  "dockerVolumes": [{
	    "container_dir": "/ggg",
	    "host_dir": "/lll",
	    "rw": "ro"
	  },
	  {
	    "container_dir": "/ttt",
	    "host_dir": "/mmm",
	    "rw": "ro"
	  }],
	  "id": 9,
	  "image": "repository://admin:aaa111@registry.paas:443/test/cpu1:2.0",
	  "innerConnect": false,
	  "name": "yangzhe",
	  "network": "host",
	  "optionsMmx": 222,
	  "outerConnect": false,
	  "shareCpu": false,
	  "taskCmd": "lalalalalalalalalalalalalalalalala",
	  "updateTime": "2016-10-20 10:19:57",
	  "userId": 3,
	  "uuid": "90714963-b54b-4b9e-89c4-be67c7614b8f"
    }
```
##7. 监控API
###7.1. 应用API
####7.1.1. 应用状态
#####  `GET` /app/status/{appId}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用的appId</td>
   </tr>
</table>

##### **request example**
  
     GET /app/status/d91a355e-488f-4937-bd4e-e3ce76a34617
 
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appCpu</td>
     <td> 应用的cpu使用率</td>
   </tr>
   <tr>
     <td>appId</td>
     <td>appId</td>
   </tr>
   <tr>
     <td>appMem</td>
     <td>应用的内存使用率</td>
   </tr>
   <tr>
     <td>appMemTotal</td>
     <td>应用可用最大内存</td>
   </tr>
   <tr>
     <td>appMemUsage</td>
     <td>应用使用内存（M）</td>
   </tr>
   <tr>
     <td>cpu</td>
     <td>cpu使用率</td>
   </tr>
   <tr>
     <td>exception</td>
     <td>应用是否异常</td>
   </tr>
   <tr>
     <td>instanceNo</td>
     <td>应用实例数</td>
   </tr>
   <tr>
     <td>linkCount</td>
     <td>应用连接数</td>
   </tr>
   <tr>
     <td>netIO</td>
     <td>网络IO</td>
   </tr>
   <tr>
     <td>running</td>
     <td>应用运行状态</td>
   </tr>
   <tr>
     <td>usedMem</td>
     <td>内存使用量</td>
   </tr>
   <tr>
     <td>set</td>
     <td>实例信息</td>
   </tr>
</table>

##### **response example**
``` js 
    {
    "appCpu":0,
    "appId":"d91a355e-488f-4937-bd4e-e3ce76a34617",
    "appMem":99.87,
    "appMemTotal":128,
    "appMemUsage":127.83,
    "cpu":0,
    "exception":true,
    "instanceNo":"1",
    "linkCount":0,
    "netIO":"0.04/0.0",
    "running":true,
    "set":[
        {
            "appCpu":0,
            "appId":"d91a355e-488f-4937-bd4e-e3ce76a34617",
            "appMem":0.8,
            "cpu":0,
            "diskIO":"0.0/0.0",
            "instanceId":"2608724e-25a1-4725-a15e-ebe1d6bdcd40",
            "linkCount":0,
            "lxcName":"CN3",
            "masterStopped":false,
            "memlimits":128,
            "mongoMaster":false,
            "netIO":"0.04/0.0",
            "neuopstat":"21",
            "port":8080,
            "running":true,
            "totalMem":15836,
            "usedMem":127.83
        }
    ],
    "usedMem":127.83
}
```
   
####7.1.2. 应用平均响应时间
#####  `GET` /app/avgtime/{appId}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用的appId</td>
   </tr>
</table>

##### **request example**
  
     GET /app/avgtime/4d507740-ca9d-4425-9a5f-293a1e02da3a

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>operstamp</td>
     <td>时间戳</td>
   </tr>
   <tr>
     <td>versions</td>
     <td>版本列表</td>
   </tr> 
   <tr>
     <td>versions.value</td>
     <td>平均响应时间</td>
   </tr> 
   <tr>
     <td>versions.versionId</td>
     <td>版本号</td>
   </tr>
</table>

``` js 
    {
    "operstamp":1477280307853,
    "versions":[
        {
            "value":"0.000",
            "versionId":"v179"
        },
        {
            "value":"0.000",
            "versionId":"v175"
        }
    ]
} }
``` 
  
####7.1.3. 应用平均响应时间(范围)
#####  `GET` /app/avgtime/range/{appId} 
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用的appId</td>
   </tr>
</table>  

##### **request example**
  
     GET /app/avgtime/range/4d507740-ca9d-4425-9a5f-293a1e02da3a

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>operstamp</td>
     <td>时间戳</td>
   </tr>
   <tr>
     <td>versions</td>
     <td>版本列表</td>
   </tr> 
   <tr>
     <td>versions.value</td>
     <td>平均响应时间</td>
   </tr> 
   <tr>
     <td>versions.versionId</td>
     <td>版本号</td>
   </tr>
</table>

``` js 
    [
    {
        "operstamp":1477287827827,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287832843,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287837840,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287842845,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287847847,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287852861,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287857849,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287862845,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287867842,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287872842,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287877848,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287882847,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287887845,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287892828,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287897877,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287902844,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287907849,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287912833,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287917839,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    },
    {
        "operstamp":1477287922844,
        "versions":[
            {
                "value":"0.000",
                "versionId":"v179"
            },
            {
                "value":"0.000",
                "versionId":"v175"
            }
        ]
    }
]
``` 

###7.2. 实例API
####7.2.1. 实例状态
#####  `GET` /instance/status/{appId}/{instanceId}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用的appId</td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例id</td>
   </tr>
</table>  

##### **request example**
  
     GET /instance/status/89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4/fb03b0f2-1e08-4849-90a1-aff8b69e9814
  
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用Id</td>
   </tr>
   <tr>
     <td>appCpu</td>
     <td>应用的cpu使用率</td>
   </tr> 
   <tr>
     <td>appMem</td>
     <td>应用的内存使用率</td>
   </tr> 
   <tr>
     <td>cpu</td>
     <td>cpu使用率</td>
   </tr>
   <tr>
     <td>diskInput</td>
     <td>磁盘读速度</td>
   </tr>
   <tr>
     <td>diskOutput</td>
     <td>磁盘写速度</td>
   </tr>
   <tr>
     <td>linkCount</td>
     <td>应用连接数</td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例id</td>
   </tr>
   <tr>
     <td>lxcName</td>
     <td>实例容器名</td>
   </tr>
   <tr>
     <td>masterStopped</td>
     <td>是否停止</td>
   </tr>
   <tr>
     <td>mongoMaster</td>
     <td>是否为主节点</td>
   </tr> 
   <tr>
     <td>netInput</td>
     <td>网络读速度</td>
   </tr> 
   <tr>
     <td>netoutput</td>
     <td>网络写速度</td>
   </tr> 
   <tr>
     <td>operstamp</td>
     <td>时间戳</td>
   </tr> 
   <tr>
     <td>port</td>
     <td>访问端口</td>
   </tr> 
   <tr>
     <td>running</td>
     <td>运行状态</td>
   </tr> 
   <tr>
     <td>totalMem</td>
     <td>主机内存总量</td>
   </tr> 
   <tr>
     <td>usedMem</td>
     <td>内存使用量</td>
   </tr> 
</table>

``` js 
    {
    "appCpu":0,
    "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
    "appMem":2.8,
    "cpu":0,
    "diskInput":0,
    "diskOutput":0,
    "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
    "linkCount":0,
    "lxcName":"CN35",
    "masterStopped":false,
    "memlimits":128,
    "mongoMaster":false,
    "netInput":0,
    "netOutput":0,
    "neuopstat":"21",
    "operstamp":1477301342542,
    "port":8080,
    "running":true,
    "totalMem":2719,
    "usedMem":78.79
}
``` 

####7.2.2. 实例状态(范围)
#####  `GET` /instance/status/range/{appId}/{instanceId}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用的appId</td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例id</td>
   </tr>
</table>  

##### **request example**
  
     GET /instance/status/range/89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4/fb03b0f2-1e08-4849-90a1-aff8b69e9814

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用Id</td>
   </tr>
   <tr>
     <td>appCpu</td>
     <td>应用的cpu使用率</td>
   </tr>
   <tr>
     <td>appMem</td>
     <td>应用的内存使用率</td>
   </tr>
   <tr>
     <td>cpu</td>
     <td>cpu使用率</td>
   </tr>
   <tr>
     <td>diskInput </td>
     <td>磁盘读速度</td>
   </tr>
   <tr>
     <td>diskOutput </td>
     <td>磁盘写速度</td>
   </tr>
   <tr>
     <td>linkCount </td>
     <td>应用连接数</td>
   </tr>
   <tr>
     <td>instanceId</td>
     <td>实例id</td>
   </tr>
   <tr>
     <td>lxcName</td>
     <td>实例容器名</td>
   </tr>
   <tr>
     <td>masterStopped</td>
     <td>是否停止</td>
   </tr>
   <tr>
     <td>mongoMaster</td>
     <td>是否为主节点</td>
   </tr>
   <tr>
     <td>netInput</td>
     <td>网络读速度</td>
   </tr>
   <tr>
     <td>netoutput</td>
     <td>网络写速度</td>
   </tr>
   <tr>
     <td>operstamp</td>
     <td>时间戳</td>
   </tr>
   <tr>
     <td>port</td>
     <td>访问端口</td>
   </tr>
   <tr>
     <td>running</td>
     <td>运行状态</td>
   </tr>
   <tr>
     <td>totalMem</td>
     <td>主机内存总量</td>
   </tr>
   <tr>
     <td>usedMem</td>
     <td>内存使用量</td>
   </tr>
</table>
 
 
``` js 
    [
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301411899,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301412466,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301413897,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301414468,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301415923,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301416468,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301417902,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301418469,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301419907,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301420539,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301421899,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301422471,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301423904,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.03,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301424472,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301425910,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301426476,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301427994,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301428474,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.04,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301429901,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    },
    {
        "appCpu":0,
        "appId":"89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
        "appMem":2.8,
        "cpu":0,
        "diskInput":0,
        "diskOutput":0,
        "instanceId":"fb03b0f2-1e08-4849-90a1-aff8b69e9814",
        "linkCount":0,
        "lxcName":"CN35",
        "masterStopped":false,
        "memlimits":128,
        "mongoMaster":false,
        "netInput":0.04,
        "netOutput":0,
        "neuopstat":"21",
        "operstamp":1477301430562,
        "port":8080,
        "running":true,
        "totalMem":2719,
        "usedMem":78.79
    }
]
``` 

###7.3. 主机API
####7.3.1. 主机状态
#####  `GET` /host/status/{vmId}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>vmId</td>
     <td>主机id</td>
   </tr>
</table>  

##### **request example**
  
     GET /host/status/10.1.108.132

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>cpu</td>
     <td>cpu使用率</td>
   </tr>
   <tr>
     <td>diskInput</td>
     <td>磁盘读速度</td>
   </tr>
   <tr>
     <td>diskOutput</td>
     <td>磁盘写速度</td>
   </tr> 
   <tr>
     <td>mem</td>
     <td>内存使用率</td>
   </tr> 
   <tr>
     <td>memtotal</td>
     <td>内存总量</td>
   </tr> 
   <tr>
     <td>memusage</td>
     <td>内存使用量</td>
   </tr> 
   <tr>
     <td>netInput</td>
     <td>网络读速度</td>
   </tr>
   <tr>
     <td>netoutput</td>
     <td>网络写速度</td>
   </tr>
   <tr>
     <td>operstamp</td>
     <td>时间戳</td>
   </tr>
   <tr>
     <td>running</td>
     <td>运行状态</td>
   </tr>
   <tr>
     <td>vmId</td>
     <td>主机id</td>
   </tr>
</table>

``` js 
    {
    "cpu":15, 
    "diskInput":0,
    "diskOutput":0,
    "mem":0.64,
    "memtotal":2719,
    "memusage":1745,
    "netInput":2.04,
    "netOutput":10.27,
    "operstamp":1477293689022,
    "running":true,
    "vmId":"10.1.108.132"
}
```

####7.3.2. 主机状态(范围)
#####  `GET` /host/status/range/{vmId}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>vmId</td>
     <td>主机id</td>
   </tr>
</table>  

##### **request example**
  
     GET /host/status/range/10.1.108.132

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>cpu</td>
     <td>cpu使用率</td>
   </tr>
   <tr>
     <td>diskInput</td>
     <td>磁盘读速度</td>
   </tr>
   <tr>
     <td>diskOutput</td>
     <td>磁盘写速度</td>
   </tr> 
   <tr>
     <td>mem</td>
     <td>内存使用率</td>
   </tr> 
   <tr>
     <td>memtotal</td>
     <td>内存总量</td>
   </tr> 
   <tr>
     <td>memusage</td>
     <td>内存使用量</td>
   </tr> 
   <tr>
     <td>netInput</td>
     <td>网络读速度</td>
   </tr>
   <tr>
     <td>netoutput</td>
     <td>网络写速度</td>
   </tr>
   <tr>
     <td>operstamp</td>
     <td>时间戳</td>
   </tr>
   <tr>
     <td>running</td>
     <td>运行状态</td>
   </tr>
   <tr>
     <td>vmId</td>
     <td>主机id</td>
   </tr>
</table>


``` js 
    [
    {
        "cpu":9,
        "dickOutput":0,
        "diskInput":0.03,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":1.04,
        "netOutput":5.45,
        "operstamp":1477293727026,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":9,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1745,
        "netInput":1.29,
        "netOutput":5.62,
        "operstamp":1477293728824,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":9,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1745,
        "netInput":1.29,
        "netOutput":5.62,
        "operstamp":1477293729023,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":13,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":0.72,
        "netOutput":0.68,
        "operstamp":1477293730828,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":13,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":0.72,
        "netOutput":0.68,
        "operstamp":1477293731023,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":10,
        "dickOutput":0,
        "diskInput":0.06,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":1.1,
        "netOutput":5.77,
        "operstamp":1477293732824,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":10,
        "dickOutput":0,
        "diskInput":0.06,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":1.1,
        "netOutput":5.77,
        "operstamp":1477293733026,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":7,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1743,
        "netInput":1.22,
        "netOutput":7.56,
        "operstamp":1477293734823,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":7,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1743,
        "netInput":1.22,
        "netOutput":7.56,
        "operstamp":1477293735018,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":10,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1745,
        "netInput":0.89,
        "netOutput":0.64,
        "operstamp":1477293736907,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":10,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1745,
        "netInput":0.89,
        "netOutput":0.64,
        "operstamp":1477293737026,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":10,
        "dickOutput":0,
        "diskInput":0.12,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":1.24,
        "netOutput":5.8,
        "operstamp":1477293738826,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":10,
        "dickOutput":0,
        "diskInput":0.12,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":1.24,
        "netOutput":5.8,
        "operstamp":1477293739027,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":10,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":0.92,
        "netOutput":0.96,
        "operstamp":1477293740826,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":10,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":0.92,
        "netOutput":0.96,
        "operstamp":1477293741029,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":10,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":0.92,
        "netOutput":0.96,
        "operstamp":1477293742823,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":7,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":1.39,
        "netOutput":8.61,
        "operstamp":1477293743127,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":7,
        "dickOutput":0,
        "diskInput":0,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":1.39,
        "netOutput":8.61,
        "operstamp":1477293744852,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":8,
        "dickOutput":0,
        "diskInput":0.05,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":1.08,
        "netOutput":1.1,
        "operstamp":1477293745026,
        "running":true,
        "vmId":"10.1.108.132"
    },
    {
        "cpu":8,
        "dickOutput":0,
        "diskInput":0.05,
        "diskOutput":0,
        "mem":0.64,
        "memtotal":2719,
        "memusage":1744,
        "netInput":1.08,
        "netOutput":1.1,
        "operstamp":1477293746826,
        "running":true,
        "vmId":"10.1.108.132"
    }
]
```

####7.3.3. 主机内应用数
#####  `GET` /host /app/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>vmId</td>
     <td>主机id</td>
   </tr>
</table>  

##### **request example**
  
     GET /host/app/10.1.108.132 

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appnum</td>
     <td>应用数</td>
   </tr>
</table>

``` js 
    {
    "appnum":8
}
```

####7.3.4. 集群状态
#####  `GET` /host/cluster/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>集群id</td>
   </tr>
</table>  
 
##### **request example**
  
     GET /host/cluster/3a14ed9d-1ec5-4530-9a93-b61d8a5781cf  

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>cpu</td>
     <td>cpu使用率</td>
   </tr>
   <tr>
     <td>diskInput</td>
     <td>磁盘读速度</td>
   </tr>
   <tr>
     <td>diskOutput</td>
     <td>磁盘写速度</td>
   </tr>
   <tr>
     <td>mem</td>
     <td>内存使用率</td>
   </tr>
   <tr>
     <td>memtotal</td>
     <td>内存总量</td>
   </tr>
   <tr>
     <td>memusage</td>
     <td>内存使用量</td>
   </tr>
   <tr>
     <td>netInput</td>
     <td>网络读速度</td>
   </tr>
   <tr>
     <td>netoutput</td>
     <td>网络写速度</td>
   </tr>
   <tr>
     <td>stopNum</td>
     <td>停止主机数</td>
   </tr>
   <tr>
     <td>runningNum</td>
     <td>运行中主机数</td>
   </tr>
   <tr>
     <td>id</td>
     <td>集群id</td>
   </tr>
   <tr>
     <td>hosts</td>
     <td>主机列表</td>
   </tr>
</table>

``` js 
    {
    "cpu":3.25,
    "dickOutput":0,
    "diskInput":0,
    "diskOutput":0,
    "hosts":[
        {
            "cpu":3,
            "dickOutput":0,
            "diskInput":0.03,
            "diskOutput":0,
            "mem":0.02,
            "memtotal":128664,
            "memusage":3069,
            "netInput":46.46,
            "netOutput":42.36,
            "operstamp":1477293859121,
            "running":true,
            "vmId":"10.1.153.173"
        },
        {
            "cpu":4,
            "dickOutput":0,
            "diskInput":0.17,
            "diskOutput":0,
            "mem":0.64,
            "memtotal":2719,
            "memusage":1742,
            "netInput":0.81,
            "netOutput":0.6,
            "operstamp":1477293859121,
            "running":true,
            "vmId":"10.1.108.132"
        },
        {
            "cpu":5,
            "dickOutput":0,
            "diskInput":0,
            "diskOutput":0,
            "mem":0.24,
            "memtotal":3629,
            "memusage":858,
            "netInput":1.52,
            "netOutput":1,
            "operstamp":1477293859121,
            "running":true,
            "vmId":"10.1.153.153"
        },
        {
            "cpu":1,
            "dickOutput":0,
            "diskInput":0.04,
            "diskOutput":0,
            "mem":0.11,
            "memtotal":15836,
            "memusage":1742,
            "netInput":3.96,
            "netOutput":5.83,
            "operstamp":1477293859121,
            "running":true,
            "vmId":"10.126.3.86"
        }
    ],
    "id":"3a14ed9d-1ec5-4530-9a93-b61d8a5781cf",
    "mem":4,
    "memtotal":150848,
    "memusage":7411,
    "netInput":0,
    "netOutput":0,
    "runningNum":4,
    "stopNum":0
}
``` 
  
####7.3.5. 集群内应用信息
#####  `GET` /host/cluster/app/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>集群id</td>
   </tr>
</table>  

##### **request example**
  
     GET /host/cluster/app/3a14ed9d-1ec5-4530-9a93-b61d8a5781cf  
 
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appid</td>
     <td>appid</td>
   </tr>
   <tr>
     <td>appname</td>
     <td>应用名称</td>
   </tr>
   <tr>
     <td>instnum</td>
     <td>实例数</td>
   </tr>
</table>

``` js 
    [
    {
        "appid":"040f7f8e-32ef-4765-b400-fd36bd256550",
        "appname":"syh_1host_1inst",
        "instnum":2
    },
    {
        "appid":"124b9300-0aef-492c-995a-61fdfbc7372d",
        "appname":"testa_1021",
        "instnum":1
    }
]
```

###7.4. 平台组件监控API
####7.4.1. 平台组件状态
#####  `GET` /component/status/{pageNum}/{pageSize}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页面</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页记录数</td>
   </tr>
</table>  

##### **request example**
  
     GET /component/status/1/10 


<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>component</td>
     <td>组件名称</td>
   </tr>
   <tr>
     <td>ip</td>
     <td>组件所在主机ip</td>
   </tr>
   <tr>
     <td>nodeId</td>
     <td>主机id</td>
   </tr>
   <tr>
     <td>running</td>
     <td>组件运行状态</td>
   </tr>
</table>

``` js 
    {
    "endRowNum":9,
    "pageNumber":1,
    "pageSize":10,
    "rows":[
        {
            "component":"svn",
            "ip":"10.126.3.161",
            "nodeId":7,
            "running":false
        },
        {
            "component":"loadbalance",
            "ip":"10.126.3.161",
            "nodeId":7,
            "running":false
        },
        {
            "component":"adapter",
            "ip":"10.126.3.161",
            "nodeId":7,
            "running":false
        },
        {
            "component":"master",
            "ip":"10.126.3.161",
            "nodeId":7,
            "running":false
        },
        {
            "component":"journal",
            "ip":"10.126.3.161",
            "nodeId":7,
            "running":false
        },
        {
            "component":"cloudui",
            "ip":"10.126.3.161",
            "nodeId":7,
            "running":false
        },
        {
            "component":"router",
            "ip":"10.126.3.161",
            "nodeId":7,
            "running":false
        }
    ],
    "startRowNum":0,
    "total":7,
    "totalPageNum":1
}
```

####7.4.2. 平台组件列表
#####  `GET` /component/address/get/{pageNum}/{pageSize}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页面</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页记录数</td>
   </tr>
</table>  

##### **request example**
  
     GET /component/address/get/1/10 

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>主机id</td>
   </tr>
   <tr>
     <td>ip</td>
     <td>主机ip</td>
   </tr>
   <tr>
     <td>name</td>
     <td>主机名称</td>
   </tr>
   <tr>
     <td>port</td>
     <td>探测端口</td>
   </tr>
</table>


``` js 
    {
    "endRowNum":9,
    "pageNumber":1,
    "pageSize":10,
    "rows":[
        {
            "id":7,
            "ip":"10.126.3.161",
            "name":"node1",
            "port":65534
        }
    ],
    "startRowNum":0,
    "total":1,
    "totalPageNum":1
}
```  

####7.4.3. 添加平台组件地址
#####  `POST` /component/address/add
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>ip</td>
     <td>主机ip</td>
   </tr>
   <tr>
     <td>name</td>
     <td>主机名称</td>
   </tr>
   <tr>
     <td>port</td>
     <td>探测端口</td>
   </tr>
</table>  
  
##### **request example**
  
     POST /component/address/add
	ip:127.0.0.1
	name: test
	port:65534
  

####7.4.4. 删除平台组件地址
#####  `POST` /component/address/delete
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>ip</td>
     <td>主机ip</td>
   </tr>
   <tr>
     <td>name</td>
     <td>主机名称</td>
   </tr>
   <tr>
     <td>port</td>
     <td>探测端口</td>
   </tr>
</table>  

##### **request example**
  
     POST /component/address/add
	ip:127.0.0.1
	port:65534


  
###7.5. 告警策略API
####7.5.1. 应用告警策略
#####  `GET` category/app/{id} 
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>应用的appid</td>
   </tr>
   <tr>
     <td>name</td>
     <td>主机名称</td>
   </tr>
</table>    

##### **request example**
  
     GET category/app/4d507740-ca9d-4425-9a5f-293a1e02da3a

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>策略id</td>
   </tr>
   <tr>
      <td>isrunning</td>
      <td>是否开启</td>
   </tr>
   <tr>
      <td>mtime</td>
      <td>监控周期</td>
   </tr>
   <tr>
      <td>name</td>
      <td>策略名称</td>
   </tr>
   <tr>
      <td>person</td>
      <td>告警人列表</td>
   </tr>
   <tr>
      <td>resource</td>
      <td>资源列表</td>
   </tr>
   <tr>
      <td>rule</td>
      <td>规则列表</td>
   </tr>
   <tr>
      <td>type</td>
      <td>监控类型</td>
   </tr>
   <tr>
      <td>userId</td>
      <td>用户id</td>
   </tr>
</table>


``` js 
    {
    "id":53,
    "isrunning":1,
    "mtime":10,
    "name":"syh_cpuwan",
    "person":[
        {
            "id":49,
            "name":"testa",
            "type":"email",
            "userId":0,
            "value":"aa@aa.com",
            "warnType":0
        }
    ],
    "resource":[
        {
            "resourceId":"4d507740-ca9d-4425-9a5f-293a1e02da3a",
            "resourceName":"syh1021"
        }
    ],
    "rule":[
        {
            "categoryId":0,
            "count":0,
            "id":209,
            "metadataId":5,
            "metadataName":"mem_max",
            "period":2,
            "value":"80"
        },
        {
            "categoryId":0,
            "count":0,
            "id":211,
            "metadataId":1,
            "metadataName":"cpu_max",
            "period":2,
            "value":"20"
        },
        {
            "categoryId":0,
            "count":0,
            "id":213,
            "metadataId":9,
            "metadataName":"apprunningstate",
            "period":2,
            "value":"stop"
        },
        {
            "categoryId":0,
            "count":0,
            "id":215,
            "metadataId":10,
            "metadataName":"instancerunningstate",
            "period":2,
            "value":"stop"
        },
        {
            "categoryId":0,
            "count":0,
            "id":217,
            "metadataId":14,
            "metadataName":"accesstimes_max",
            "period":0,
            "value":"{"time":30,"value":"10"}"
        }
    ],
    "type":1,
    "userId":3
}
```
  
####7.5.2. 主机告警策略
#####  `GET` /category/host/{id} 
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>主机id</td>
   </tr>
</table>    
 
##### **request example**
  
     GET /category/host/026f9bec-2825-4115-9520-fc1ae86360db

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>策略id</td>
   </tr>
   <tr>
      <td>isrunning</td>
      <td>是否开启</td>
   </tr>
   <tr>
      <td>mtime</td>
      <td>监控周期</td>
   </tr>
   <tr>
      <td>name</td>
      <td>策略名称</td>
   </tr>
   <tr>
      <td>person</td>
      <td>告警人列表</td>
   </tr>
   <tr>
      <td>resource</td>
      <td>资源列表</td>
   </tr>
   <tr>
      <td>rule</td>
      <td>规则列表</td>
   </tr>
   <tr>
      <td>type</td>
      <td>监控类型</td>
   </tr>
   <tr>
      <td>userId</td>
      <td>用户id</td>
   </tr>
</table>

``` js 
    {
    "id":69,
    "isrunning":0,
    "mtime":8,
    "name":"hostc",
    "person":[
        {
            "id":49,
            "name":"testa",
            "type":"email",
            "userId":0,
            "value":"aa@aa.com",
            "warnType":0
        }
    ],
    "resource":[
        {
            "resourceId":"026f9bec-2825-4115-9520-fc1ae86360db",
            "resourceName":"10.1.153.173"
        }
    ],
    "rule":[
        {
            "categoryId":0,
            "count":0,
            "id":231,
            "metadataId":3,
            "metadataName":"cpu_max",
            "period":1,
            "value":"80"
        }
    ],
    "type":0,
    "userId":3
}
```  

####7.5.3. 策略规则
#####  `GET` /category/rules/ {categoryId}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>categoryId</td>
     <td>策略id</td>
   </tr>
</table>   

##### **request example**
  
     GET /category/rules/49
  
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>categoryId</td>
      <td>策略id</td>
   </tr>
   <tr>
      <td>id</td>
      <td>规则id</td>
   </tr>
   <tr>
      <td>metadataId</td>
      <td>元数据id</td>
   </tr>
   <tr>
      <td>metagataName</td>
      <td>元数据名称</td>
   </tr>
   <tr>
      <td>period</td>
      <td>连续周期数</td>
   </tr>
   <tr>
      <td>value</td>
      <td>值</td>
   </tr>
</table>

``` js 
    [
    {
        "categoryId":0,
        "count":0,
        "id":151,
        "metadataId":14,
        "metadataName":"accesstimes_max",
        "period":0,
        "value":"{"time":60,"value":"10"}"
    }
]
```   
 
####7.5.4. 策略资源列表1
#####  `GET` /category/resources/type/{id}/user/{userId}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
   <tr>
     <td>id</td>
     <td>资源类型</td>
   </tr>
</table>   

##### **request example**
  
     GET /category/resources/type/0/user/1
  
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>resourceId</td>
      <td>资源id</td>
   </tr>
   <tr>
      <td>iresourceName</td>
      <td>资源名称</td>
   </tr>
</table>  


``` js 
    [
    {
        "resourceId":"0da26123-3a53-49b2-993e-1987be3aa112",
        "resourceName":"10.126.3.86"
    },
    {
        "resourceId":"25b27764-2051-4a83-891d-3dc74ab6dfda",
        "resourceName":"10.1.108.132"
    },
    {
        "resourceId":"6e248f3c-8cb9-4693-88ed-4d65b1cf801b",
        "resourceName":"10.1.153.153"
    }
]
```

####7.5.5. 策略资源列表2
#####  `GET` /{cid}/resources/type/{id}/user/{userId}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
   <tr>
     <td>id</td>
     <td>资源类型</td>
   </tr>
   <tr>
     <td>cid</td>
     <td>策略id</td>
   </tr>
</table>   

##### **request example**
  
     GET /category/69/resources/type/0/user/1

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>resourceId</td>
      <td>资源id</td>
   </tr>
   <tr>
      <td>iresourceName</td>
      <td>资源名称</td>
   </tr>
</table>  

``` js 
    [
    {
        "resourceId":"0da26123-3a53-49b2-993e-1987be3aa112",
        "resourceName":"10.126.3.86"
    },
    {
        "resourceId":"25b27764-2051-4a83-891d-3dc74ab6dfda",
        "resourceName":"10.1.108.132"
    },
    {
        "resourceId":"6e248f3c-8cb9-4693-88ed-4d65b1cf801b",
        "resourceName":"10.1.153.153"
    },
    {
        "resourceId":"026f9bec-2825-4115-9520-fc1ae86360db",
        "resourceName":"10.1.153.173"
    }
]
```


####7.5.6. 策略列表
#####  `GET` /category /all/{userId}/{pageNum}/{pageSize}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页码</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页条数</td>
   </tr>
</table>  

##### **request example**
  
     GET /category/all/1/1/10

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>rows</td>
      <td>策略列表</td>
   </tr>
   <tr>
      <td>total</td>
      <td>记录总数</td>
   </tr>
</table>   
  

``` js 
    {
    "rows":[
        {
            "id":47,
            "isrunning":0,
            "mtime":3,
            "name":"test111",
            "person":[
                {
                    "id":49,
                    "name":"testa",
                    "type":"email",
                    "userId":0,
                    "value":"aa@aa.com",
                    "warnType":0
                }
            ],
            "resource":[
                {
                    "resourceId":"76fa5226-a81c-4d9f-b5cf-a0a30313aafe",
                    "resourceName":"redis1"
                },
                {
                    "resourceId":"4f8e0ea2-7951-4f5b-94cd-e20ccadfa752",
                    "resourceName":"storm"
                }
            ],
            "rule":[
                {
                    "categoryId":0,
                    "count":0,
                    "id":149,
                    "metadataId":1,
                    "metadataName":"cpu_max",
                    "period":2,
                    "value":"2"
                }
            ],
            "type":1,
            "userId":3
        },
        {
            "id":49,
            "isrunning":0,
            "mtime":10,
            "name":"kevin1_app1_m",
            "person":[
                {
                    "id":51,
                    "name":"kevin1",
                    "type":"message",
                    "userId":0,
                    "value":"15501121568",
                    "warnType":0
                }
            ],
            "resource":[
                {
                    "resourceId":"70d69dfa-f972-43de-aa22-f778e3c3e36d",
                    "resourceName":"kevin1_app1"
                }
            ],
            "rule":[
                {
                    "categoryId":0,
                    "count":0,
                    "id":151,
                    "metadataId":14,
                    "metadataName":"accesstimes_max",
                    "period":0,
                    "value":"{"time":60,"value":"10"}"
                }
            ],
            "type":1,
            "userId":7
        },
        {
            "id":51,
            "isrunning":0,
            "mtime":10,
            "name":"zbptest",
            "person":[
                {
                    "id":53,
                    "name":"zbptest",
                    "type":"message",
                    "userId":0,
                    "value":"13455556666",
                    "warnType":0
                }
            ],
            "resource":[
                {
                    "resourceId":"2353b519-c64b-439f-86a5-a52b2ad530af",
                    "resourceName":"zbptest"
                }
            ],
            "rule":[
                {
                    "categoryId":0,
                    "count":0,
                    "id":155,
                    "metadataId":9,
                    "metadataName":"apprunningstate",
                    "period":1,
                    "value":"stop"
                },
                {
                    "categoryId":0,
                    "count":0,
                    "id":157,
                    "metadataId":10,
                    "metadataName":"instancerunningstate",
                    "period":1,
                    "value":"stop"
                }
            ],
            "type":1,
            "userId":13
        },
        {
            "id":53,
            "isrunning":1,
            "mtime":10,
            "name":"syh_cpuwan",
            "person":[
                {
                    "id":49,
                    "name":"testa",
                    "type":"email",
                    "userId":0,
                    "value":"aa@aa.com",
                    "warnType":0
                }
            ],
            "resource":[
                {
                    "resourceId":"4d507740-ca9d-4425-9a5f-293a1e02da3a",
                    "resourceName":"syh1021"
                }
            ],
            "rule":[
                {
                    "categoryId":0,
                    "count":0,
                    "id":209,
                    "metadataId":5,
                    "metadataName":"mem_max",
                    "period":2,
                    "value":"80"
                },
                {
                    "categoryId":0,
                    "count":0,
                    "id":211,
                    "metadataId":1,
                    "metadataName":"cpu_max",
                    "period":2,
                    "value":"20"
                },
                {
                    "categoryId":0,
                    "count":0,
                    "id":213,
                    "metadataId":9,
                    "metadataName":"apprunningstate",
                    "period":2,
                    "value":"stop"
                },
                {
                    "categoryId":0,
                    "count":0,
                    "id":215,
                    "metadataId":10,
                    "metadataName":"instancerunningstate",
                    "period":2,
                    "value":"stop"
                },
                {
                    "categoryId":0,
                    "count":0,
                    "id":217,
                    "metadataId":14,
                    "metadataName":"accesstimes_max",
                    "period":0,
                    "value":"{"time":30,"value":"10"}"
                }
            ],
            "type":1,
            "userId":3
        },
        {
            "id":67,
            "isrunning":0,
            "mtime":10,
            "name":"yxyxyx",
            "person":[
                {
                    "id":49,
                    "name":"testa",
                    "type":"email",
                    "userId":0,
                    "value":"aa@aa.com",
                    "warnType":0
                }
            ],
            "resource":[

            ],
            "rule":[
                {
                    "categoryId":0,
                    "count":0,
                    "id":229,
                    "metadataId":15,
                    "metadataName":"componentwarn",
                    "period":1,
                    "value":""
                }
            ],
            "type":3,
            "userId":3
        },
        {
            "id":69,
            "isrunning":0,
            "mtime":8,
            "name":"hostc",
            "person":[
                {
                    "id":49,
                    "name":"testa",
                    "type":"email",
                    "userId":0,
                    "value":"aa@aa.com",
                    "warnType":0
                }
            ],
            "resource":[
                {
                    "resourceId":"026f9bec-2825-4115-9520-fc1ae86360db",
                    "resourceName":"10.1.153.173"
                }
            ],
            "rule":[
                {
                    "categoryId":0,
                    "count":0,
                    "id":231,
                    "metadataId":3,
                    "metadataName":"cpu_max",
                    "period":1,
                    "value":"80"
                }
            ],
            "type":0,
            "userId":3
        }
    ],
    "total":6
}
```

####7.5.7. 策略详情（根据策略id）
#####  `GET` /category/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>策略id</td>
   </tr>
</table>  

##### **request example**
  
     GET /category/47  
 
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>策略id</td>
   </tr>
   <tr>
      <td>isrunning</td>
      <td>是否开启</td>
   </tr>
   <tr>
      <td>mtime</td>
      <td>监控周期</td>
   </tr>
   <tr>
      <td>person</td>
      <td>告警人员列表</td>
   </tr>
   <tr>
      <td>resource</td>
      <td>资源列表</td>
   </tr>
   <tr>
      <td>rule</td>
      <td>规则列表</td>
   </tr>
   <tr>
      <td>type</td>
      <td>监控类型</td>
   </tr>
   <tr>
      <td>userId</td>
      <td>用户id</td>
   </tr>
</table> 


``` js 
    {
    "id":47,
    "isrunning":0,
    "mtime":3,
    "name":"test111",
    "person":[
        {
            "id":49,
            "name":"testa",
            "type":"email",
            "userId":0,
            "value":"aa@aa.com",
            "warnType":0
        }
    ],
    "resource":[
        {
            "resourceId":"76fa5226-a81c-4d9f-b5cf-a0a30313aafe",
            "resourceName":"redis1"
        },
        {
            "resourceId":"4f8e0ea2-7951-4f5b-94cd-e20ccadfa752",
            "resourceName":"storm"
        }
    ],
    "rule":[
        {
            "categoryId":0,
            "count":0,
            "id":149,
            "metadataId":1,
            "metadataName":"cpu_max",
            "period":2,
            "value":"2"
        }
    ],
    "type":1,
    "userId":3
}
```

####7.5.8. 策略详情（根据策略名称）
#####  `GET` /name/{name}/{pageNum}/{pageSize}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>策略名称</td>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页码</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页记录数</td>
   </tr>
</table>  

##### **request example**
  
     GET /category/name/test/1/10 
  
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>策略id</td>
   </tr>
   <tr>
      <td>isrunning</td>
      <td>是否开启</td>
   </tr>
   <tr>
      <td>mtime</td>
      <td>监控周期</td>
   </tr>
   <tr>
      <td>person</td>
      <td>告警人员列表</td>
   </tr>
   <tr>
      <td>resource</td>
      <td>资源列表</td>
   </tr>
   <tr>
      <td>rule</td>
      <td>规则列表</td>
   </tr>
   <tr>
      <td>type</td>
      <td>监控类型</td>
   </tr>
   <tr>
      <td>userId</td>
      <td>用户id</td>
   </tr>
</table> 

``` js 
    {
    "rows":[
        {
            "id":47,
            "isrunning":0,
            "mtime":3,
            "name":"test111",
            "person":[
                {
                    "id":49,
                    "name":"testa",
                    "type":"email",
                    "userId":0,
                    "value":"aa@aa.com",
                    "warnType":0
                }
            ],
            "resource":[
                {
                    "resourceId":"76fa5226-a81c-4d9f-b5cf-a0a30313aafe",
                    "resourceName":"redis1"
                },
                {
                    "resourceId":"4f8e0ea2-7951-4f5b-94cd-e20ccadfa752",
                    "resourceName":"storm"
                }
            ],
            "rule":[
                {
                    "categoryId":0,
                    "count":0,
                    "id":149,
                    "metadataId":1,
                    "metadataName":"cpu_max",
                    "period":2,
                    "value":"2"
                }
            ],
            "type":1,
            "userId":3
        },
        {
            "id":51,
            "isrunning":0,
            "mtime":10,
            "name":"zbptest",
            "person":[
                {
                    "id":53,
                    "name":"zbptest",
                    "type":"message",
                    "userId":0,
                    "value":"13455556666",
                    "warnType":0
                }
            ],
            "resource":[
                {
                    "resourceId":"2353b519-c64b-439f-86a5-a52b2ad530af",
                    "resourceName":"zbptest"
                }
            ],
            "rule":[
                {
                    "categoryId":0,
                    "count":0,
                    "id":155,
                    "metadataId":9,
                    "metadataName":"apprunningstate",
                    "period":1,
                    "value":"stop"
                },
                {
                    "categoryId":0,
                    "count":0,
                    "id":157,
                    "metadataId":10,
                    "metadataName":"instancerunningstate",
                    "period":1,
                    "value":"stop"
                }
            ],
            "type":1,
            "userId":13
        }
    ],
    "total":2
}
```

####7.5.9. 策略名是否存在
#####  `GET` /category /exists/{name}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>策略名称</td>
   </tr>
</table>  

##### **request example**
  
     GET /category/exists/test111 
 
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>0或1</td>
      <td>不存在时返回0，存在时返回1</td>
   </tr>
</table> 


####7.5.10.  启动策略
#####  `GET` /category /start/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>策略id</td>
   </tr>
</table>  

##### **request example**
  
     GET /category /start/67


####7.5.11.  停止策略
#####  `GET` /category /stop/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>策略id</td>
   </tr>
</table>  

##### **request example**
  
     GET /category /stop/67


####7.5.7.  删除策略
#####  `DELETE` /category /{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>策略id</td>
   </tr>
</table>  

##### **request example**
  
     DELETE /category /47

``` js 
    {
    "result":true,
    "message":"success"
}
或者
{
    "result":false,
    "message":"正在执行，先停止再更新"
}
```

####7.5.13.  创建策略
#####  `POST` /category
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>策略名称</td>
   </tr>
   <tr>
     <td>resourceType</td>
     <td>绑定资源类型</td>
   </tr>
   <tr>
     <td>mtime</td>
     <td>监控周期</td>
   </tr>
   <tr>
     <td>personids</td>
     <td>告警人员id（多个以“,”分隔）</td>
   </tr>
   <tr>
     <td>resourceids</td>
     <td>绑定资源id（多个以“,”分隔）</td>
   </tr>
   <tr>
     <td>rules</td>
     <td>规则列表（list）</td>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
</table>  

##### **request example**
  
     POST /category
     resourceids:43
     personids: 49
     name: yxyxyx
     resourceType: 3
     mtime: 10
     userId: 3
     rules: [{"metadataId":15,"value":"stop","period":"1"}]

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>categoryId</td>
      <td>策略id</td>
   </tr>
</table>   
  
 
####7.5.14.  解绑资源
#####  `PUT` /category/resource/unbind 
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>策略id</td>
   </tr>
   <tr>
     <td>resourceid</td>
     <td>资源id</td>
   </tr>
</table>   
 
##### **request example**
  
     PUT /category/resource/unbind
     resourceid: 43
     id: 49


``` js 
    {
    "result":true,
    "message":"success"
}
```

####7.5.15.  更新策略
#####  `PUT` /category
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>策略名称</td>
   </tr>
   <tr>
     <td>resourceType</td>
     <td>绑定资源类型</td>
   </tr>
   <tr>
     <td>mtime</td>
     <td>监控周期</td>
   </tr>
   <tr>
     <td>personids</td>
     <td>告警人员id（多个以“,”分隔）</td>
   </tr>
   <tr>
     <td>resourceids</td>
     <td>绑定资源id（多个以“,”分隔）</td>
   </tr>
   <tr>
     <td>rules</td>
     <td>规则列表（list）</td>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
</table>  

##### **request example**
  
     POST /category
     resourceids:43
     personids: 49
     name: yxyxyx
     resourceType: 3
     mtime: 10
     userId: 3
     rules: [{"metadataId":15,"value":"stop","period":"1"}]

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>详细信息</td>
   </tr>
</table>   


``` js 
    {
    "result":true,
    "message":"success"
}
或者
{
    "result":false,
    "message":"正在执行，先停止再更新"
}
```  
 
####7.5.16.  更新告警人
#####  `PUT`  /category/person
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>策略id</td>
   </tr>
   <tr>
     <td>personids</td>
     <td>告警人员id（多个以“,”分隔）</td>
   </tr>
</table>  

##### **request example**
  
     PUT /category/person
     id:43
     personids: 49

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>详细信息</td>
   </tr>
</table>   

``` js 
    {
    "result":true,
    "message":"success"
}
或者
{
    "result":false,
    "message":"正在执行，先停止再更新"
}
```
  
####7.5.17.  更新关联资源
#####  `PUT`  /category/resource
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>策略id</td>
   </tr>
   <tr>
     <td>resourceids</td>
     <td>资源id（多个以“,”分隔）</td>
   </tr>
</table>  

##### **request example**
  
     PUT /category/person
     id:43
     personids: 49

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>详细信息</td>
   </tr>
</table>   

``` js 
   {
    "result":true,
    "message":"success"
}
或者
{
    "result":false,
    "message":"正在执行，先停止再更新"
}
```

####7.5.18.  更新告警规则
#####  `PUT`  /category/rule
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>策略id</td>
   </tr>
   <tr>
     <td>ruleids</td>
     <td>告警规则列表</td>
   </tr>
</table> 
 
##### **request example**
  
     PUT /category/rule
     id:43
     ruleids: [{"metadataId":15,"value":"stop","period":"1"}]

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>message</td>
      <td>详细信息</td>
   </tr>
</table>   

``` js 
   {
    "result":true,
    "message":"success"
}
或者
{
    "result":false,
    "message":"正在执行，先停止再更新"
}
```
 
####7.5.19.  创建告警规则
#####  `POST` /category/rule
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>WarnRule</td>
     <td>告警规则</td>
   </tr>
</table> 
 
##### **request example**
  
     POST /category/rule
     {"metadataId":15,"value":"stop","period":"1"}

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>ruleId</td>
      <td>规则id</td>
   </tr>
</table>   


###7.6. 告警人员API
####7.6.1. 告警人员列表
#####  `GET` /person/all/{userId}/{pageNum}/{pageSize}  
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页面</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页记录数</td>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
</table> 

##### **request example**
  
     GET /person/all/1/1/10

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>告警人员id</td>
   </tr>
   <tr>
      <td>name</td>
      <td>告警人员姓名</td>
   </tr>
   <tr>
      <td>value</td>
      <td>联系方式</td>
   </tr>
   <tr>
      <td>type</td>
      <td>联系方式</td>
   </tr>
</table>


``` js 
   {
    "rows":[
        {
            "id":49,
            "name":"testa",
            "type":"email",
            "userId":0,
            "value":"aa@aa.com",
            "warnType":0
        },
        {
            "id":51,
            "name":"kevin1",
            "type":"message",
            "userId":0,
            "value":"15501121568",
            "warnType":0
        },
        {
            "id":53,
            "name":"zbptest",
            "type":"message",
            "userId":0,
            "value":"13455556666",
            "warnType":0
        }
    ],
    "total":3
}
```  
 
####7.6.2. 告警人员
#####  `GET` /person/user/{userId}  
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
</table> 

##### **request example**
  
     GET /person/user/1

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>告警人员id</td>
   </tr>
   <tr>
      <td>name</td>
      <td>告警人员姓名</td>
   </tr>
   <tr>
      <td>value</td>
      <td>联系方式</td>
   </tr>
   <tr>
      <td>type</td>
      <td>联系方式</td>
   </tr>
</table>


``` js 
   [
    {
        "id":49,
        "name":"testa",
        "type":"email",
        "userId":0,
        "value":"aa@aa.com",
        "warnType":0
    },
    {
        "id":51,
        "name":"kevin1",
        "type":"message",
        "userId":0,
        "value":"15501121568",
        "warnType":0
    },
    {
        "id":53,
        "name":"zbptest",
        "type":"message",
        "userId":0,
        "value":"13455556666",
        "warnType":0
    }
]
```   

####7.6.3. 告警人员信息
#####  `GET` /person/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>告警人员id</td>
   </tr>
</table> 

##### **request example**
  
     GET /person/51
 
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>告警人员id</td>
   </tr>
   <tr>
      <td>name</td>
      <td>告警人员姓名</td>
   </tr>
   <tr>
      <td>value</td>
      <td>联系方式</td>
   </tr>
   <tr>
      <td>type</td>
      <td>联系方式</td>
   </tr>
</table>


``` js 
   {
    "id":49,
    "name":"testa",
    "type":"email",
    "userId":0,
    "value":"aa@aa.com",
    "warnType":0
}
``` 


####7.6.4. 告警人员查询
#####  `GET` /person/name/{name}/{pageNum}/{pageSize}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageNum</td>
     <td>页面</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>每页记录数</td>
   </tr>
   <tr>
     <td>name</td>
     <td>告警人员姓名</td>
   </tr>
</table> 

##### **request example**
  
     GET /person/name/test/1/1

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>告警人员id</td>
   </tr>
   <tr>
      <td>name</td>
      <td>告警人员姓名</td>
   </tr>
   <tr>
      <td>value</td>
      <td>联系方式</td>
   </tr>
   <tr>
      <td>type</td>
      <td>联系方式</td>
   </tr>
</table>
  
 ``` js 
   {
    "rows":[
        {
            "id":49,
            "name":"testa",
            "type":"email",
            "userId":0,
            "value":"aa@aa.com",
            "warnType":0
        }
    ],
    "total":2
}
``` 

####7.6.5. 告警人员是否存在
#####  `GET` /person/exists/{name}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>告警人员姓名</td>
   </tr>
</table> 

##### **request example**
  
     GET /person/exists/test

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>0或1</td>
      <td>不存在时返回0，存在时返回1</td>
   </tr>
</table>


####7.6.6. 添加告警人员
#####  `POST` /person
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>WarnPerson</td>
     <td>告警人员</td>
   </tr>
</table>


##### **request example**
  
     POST /person
 
``` js 
   {
    "id":49,
    "name":"testa",
    "type":"email",
    "userId":1,
    "value":"aa@aa.com",
    "warnType":0
}
``` 

####7.6.7. 删除告警人员
#####  `DELETE` /person/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>告警人员id</td>
   </tr>
</table>

##### **request example**
  
     DELETE /person/19


####7.6.8. 更新告警人员
#####  `PUT` /person
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>WarnPerson</td>
     <td>告警人员</td>
   </tr>
</table>

##### **request example**
  
     PUT /person

``` js 
   {
    "id":49,
    "name":"testa",
    "type":"email",
    "userId":1,
    "value":"aa@aa.com",
    "warnType":0
}
```


###7.7. 告警规则API
####7.7.1. 规则元数据
#####  `GET` /rule/rulemetas
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>id</th>
      <th>元数据id</th>
   </tr>
   <tr>
     <td>name</td>
     <td>名称</td>
   </tr>
   <tr>
     <td>sequence</td>
     <td>序号</td>
   </tr>
   <tr>
     <td>type</td>
     <td>监控类型</td>
   </tr>
</table>

``` js 
   [
    {
        "id":2,
        "name":"cpu_min",
        "sequence":"1-2",
        "type":1
    },
    {
        "id":3,
        "name":"cpu_max",
        "sequence":"0-3",
        "type":0
    },
    {
        "id":4,
        "name":"cpu_min",
        "sequence":"0-4",
        "type":0
    },
    {
        "id":5,
        "name":"mem_max",
        "sequence":"1-5",
        "type":1
    },
    {
        "id":6,
        "name":"mem_min",
        "sequence":"1-6",
        "type":1
    },
    {
        "id":7,
        "name":"mem_max",
        "sequence":"0-7",
        "type":0
    },
    {
        "id":8,
        "name":"mem_min",
        "sequence":"0-8",
        "type":0
    },
    {
        "id":1,
        "name":"cpu_max",
        "sequence":"1-1",
        "type":1
    },
    {
        "id":9,
        "name":"apprunningstate",
        "sequence":"1-9",
        "type":1
    },
    {
        "id":10,
        "name":"instancerunningstate",
        "sequence":"1-10",
        "type":1
    },
    {
        "id":11,
        "name":"hostrunningstate",
        "sequence":"0-11",
        "type":0
    },
    {
        "id":12,
        "name":"logscan",
        "sequence":"1-11",
        "type":1
    },
    {
        "id":13,
        "name":"accesstimes_min",
        "sequence":"1-12",
        "type":1
    },
    {
        "id":14,
        "name":"accesstimes_max",
        "sequence":"1-13",
        "type":1
    },
    {
        "id":15,
        "name":"componentwarn",
        "sequence":"3-14",
        "type":3
    }
]
```


####7.7.2. 规则详情
#####  `GET` /rule/{id}  
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>id</th>
      <th>元数据id</th>
   </tr>
</table>  
  
##### **request example**
  
     GET /rule/153  


<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>id</th>
      <th>规则id</th>
   </tr>
   <tr>
      <th>metadata</th>
      <th>元数据</th>
   </tr>
   <tr>
      <th>metadataId</th>
      <th>元数据id</th>
   </tr>
   <tr>
      <th>period</th>
      <th>连续周期数</th>
   </tr>
   <tr>
      <th>value</th>
      <th>告警阀值</th>
   </tr>
</table>  
 
response


``` js 
   {
    "categoryId":0,
    "count":0,
    "id":153,
    "metadata":{
        "id":9,
        "name":"apprunningstate",
        "sequence":"1-9",
        "type":1
    },
    "metadataId":9,
    "period":1,
    "value":"stop"
}
```


####7.7.3. 创建规则
#####  `POST` /rule
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>id</th>
      <th>规则id</th>
   </tr>
   <tr>
      <th>metadata</th>
      <th>元数据</th>
   </tr>
   <tr>
      <th>metadataId</th>
      <th>元数据id</th>
   </tr>
   <tr>
      <th>period</th>
      <th>连续周期数</th>
   </tr>
   <tr>
      <th>value</th>
      <th>告警阀值</th>
   </tr>
</table>  

##### **request example**
  
     POST /rule
  
 
``` js 
   {
    "categoryId":0,
    "count":0,
    "id":153,
    "metadata":{
        "id":9,
        "name":"apprunningstate",
        "sequence":"1-9",
        "type":1
    },
    "metadataId":9,
    "period":1,
    "value":"stop"
}
``` 
##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>0或1</th>
      <th>失败返回0，成功时返回1</th>
   </tr>
</table>   

####7.7.4. 删除规则
#####  `DELETE` /rule/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>id</th>
      <th>规则id</th>
   </tr>
</table>  
  
##### **request example**
  
     DELETE /rule/159  
 

response


####7.7.5. 更新规则
#####  `PUT` /rule/{id}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>id</th>
      <th>规则id</th>
   </tr>
   <tr>
      <th>metadata</th>
      <th>元数据</th>
   </tr>
   <tr>
      <th>metadataId</th>
      <th>元数据id</th>
   </tr>
   <tr>
      <th>period</th>
      <th>连续周期数</th>
   </tr>
   <tr>
      <th>value</th>
      <th>告警阀值</th>
   </tr>
</table>

##### **request example**
  
     /rule/159 

``` js

{
    "categoryId":0,
    "count":0,
    "id":159,
    "metadata":{
        "id":9,
        "name":"apprunningstate",
        "sequence":"1-9",
        "type":1
    },
    "metadataId":9,
    "period":1,
    "value":"stop"
}
```

###7.8. 告警历史API
####7.8.1. 查询告警历史
#####  `GET` /history/{id}/user/{userId}/content/{content}/{pageNum}/{pageSize}
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>pageNum</th>
      <th>页码</th>
   </tr>
   <tr>
      <th>pageSize</th>
      <th>每页记录数</th>
   </tr>
   <tr>
      <th>userId</th>
      <th>用户id</th>
   </tr>
   <tr>
      <th>id</th>
      <th>告警资源id</th>
   </tr>
   <tr>
      <th>content</th>
      <th>内容</th>
   </tr>
</table>  

##### **request example**
  
     GET /history/4d507740-ca9d-4425-9a5f-293a1e02da3a/user/1/content/stop/1/10

##### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>operstamp</th>
      <th>时间戳</th>
   </tr>
   <tr>
      <th>userId</th>
      <th>用户id</th>
   </tr>
   <tr>
      <th>id</th>
      <th>告警资源id</th>
   </tr>
   <tr>
      <th>content</th>
      <th>内容</th>
   </tr>
</table>


``` js 
   {
    "rows":[
        {
            "content":"4d507740-ca9d-4425-9a5f-293a1e02da3a,app run status:stop",
            "id":"4d507740-ca9d-4425-9a5f-293a1e02da3a",
            "operstamp":1477291463000,
            "userId":"3"
        }
    ],
    "total":1
}
``` 
 
####7.8.2. 创建告警历史
#####  `POST` /history  
##### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <th>pageNum</th>
      <th>页码</th>
   </tr>
   <tr>
      <th>pageSize</th>
      <th>每页记录数</th>
   </tr>
   <tr>
      <th>userId</th>
      <th>用户id</th>
   </tr>
   <tr>
      <th>id</th>
      <th>告警资源id</th>
   </tr>
   <tr>
      <th>content</th>
      <th>内容</th>
   </tr>
</table>  
 
##### **request example**
  
     POST /history
	content:4d507740-ca9d-4425-9a5f-293a1e02da3a,app run status:stop
	id:4d507740-ca9d-4425-9a5f-293a1e02da3a
	userId:3

	
##8.  Paas 配置中心
###8.1 配置中心模板（角色）列表
####  `GET`  /configcenter/ws/configcenter/ws/model /getmodelList
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>模板编号</td>
   </tr>
   <tr>
      <td>modelname</td>
      <td>模板名称</td>
   </tr>
   <tr>
      <td>description</td>
      <td>描述</td>
   </tr>
</table>

#### **response example**

	[ 
	  {
		"description": "dev 适合于开发人员使用的配置文件 部署方式为all_in_one",
		"id": 1,
		"modelname:"开发人员"
	  },
	  {
		"description":"测试人员部署分为4个模块managerruntimenodemonitorr",
		"id":3,
		"modelname":"测试人员"
	  }
	]

###8.2 添加模板
####  `POST`  /configcenter/ws/configcenter/ws/model /addModel
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>modelname</td>
     <td>模板名称</td>
   </tr>
	<tr>
     <td>description</td>
     <td>描述</td>
    </tr>
</table>

#### **response example**

	{
		"result":ok
	}
	{
		"result":false,
		"reason":失败原因
	}

###8.3 更新模板信息 
####  `POST`  /configcenter/ws/configcenter/ws/model/updateModel
#### **request**
<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>模板编号</td>
    </tr>
   <tr>
     <td>modelname</td>
     <td>模板名称</td>
   </tr>
	<tr>
     <td>description</td>
     <td>描述</td>
    </tr>
</table>

#### **response example**

	{
		"result":ok
	}
	{
		"result":false,
		"reason":失败原因
	}

###8.4 检查模板是否存在
####  `GET`  /configcenter/ws/configcenter/ws/model/checkModel
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>modelid</td>
     <td>模板编号</td>
   </tr>
</table>

#### **response example**

	ok
	
###8.5 删除模板 
####  `GET`  /configcenter/ws/configcenter/ws/model/delModel
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id </td>
     <td>模板编号</td>
   </tr>
</table>

#### **response example**

	ok

###8.6 获取模板详细配置列表
####  `GET`  /configcenter/ws/configcenter/ws/model/getModel
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>modelid</td>
     <td>模板编号</td>
   </tr>
	<tr>
     <td>module</td>
     <td>模块名</td>
    </tr>
	<tr>
     <td>type</td>
     <td>类型 all,normal等 下面接口可以动态添加</td>
    </tr>
	<tr>
     <td>iscommon</td>
     <td>是否常用</td>
    </tr>
	<tr>
     <td>keyword</td>
     <td>搜索关键词</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>键值对编号</td>
   </tr>
   <tr>
      <td>key</td>
      <td>键</td>
   </tr>
	<tr>
     <td>value</td>
     <td>值</td>
    </tr>
	<tr>
     <td>description</td>
     <td>描述</td>
    </tr>
	<tr>
     <td>dynamic</td>
     <td>是否支持动态下发</td>
    </tr>
	<tr>
     <td>model_id</td>
     <td>模型id</td>
    </tr>
	<tr>
     <td>module</td>
     <td>模块</td>
    </tr>
	<tr>
     <td>type</td>
     <td>类型</td>
    </tr>
</table>

#### **response example**

	[{
	  "description": "",
	  "dynamic": 1,
	  "id": 598,
	  "iscommon": 1,
	  "key": "key1",
	  "model_id": 1,
	  "module": "master",
	  "type": "normal",
	  "value": "value1"
	},
	{
	  "description": "",
	  "dynamic": 0,
	  "id": 599,
	  "iscommon": 1,
	  "key": "key2",
	  "model_id": 1,
	  "module": "master",
	  "type": "jdbc",
	  "value": "value2"
	}]
	
###8.7 保存模板信息  
####  `GET`  /configcenter/ws/configcenter/ws/model/save
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>module</td>
     <td>模块名</td>
   </tr>
	<tr>
     <td>rows</td>
     <td>key=value多行添加 修改 删除等信息</td>
    </tr>
	<tr>
     <td>rows.id</td>
     <td>需要修改或删除的id</td>
    </tr>
	<tr>
     <td>rows[].iscommon</td>
     <td>是否常用的键</td>
    </tr>
	<tr>
     <td>rows[].dynamic</td>
     <td>是否支持动态下发</td>
    </tr>	
	<tr>
     <td>rows[].key</td>
     <td>键</td>
    </tr>	
	<tr>
     <td>rows[].value</td>
     <td>值</td>
    </tr>
	<tr>
     <td>rows[].description</td>
     <td>描述</td>
    </tr>
	<tr>
     <td>rows[].insert</td>
     <td>是否是用来插入的行</td>
    </tr>
	<tr>
     <td>rows[].del</td>
     <td>是否是用来删除的行</td>
    </tr>
	<tr>
     <td>modelid</td>
     <td>模板id</td>
    </tr>
</table>

#### **request example**

	[{
	  "id": "",
	  "type": "normal",
	  "iscommon": "1",
	  "dynamic": 0,
	  "insert": true,
	  "key": "key3",
	  "value": "value3",
	  "description": ""
	},
	{
	  "description": "",
	  "dynamic": 1,
	  "id": 598,
	  "iscommon": 1,
	  "key": "key1",
	  "model_id": 1,
	  "module": "master",
	  "type": "normal",
	  "value": "value1",
	  "del": true
	},
	{
	  "description": "",
	  "dynamic": 0,
	  "id": 599,
	  "iscommon": 1,
	  "key": "key2",
	  "model_id": 1,
	  "module": "master",
	  "type": "jdbc",
	  "value": "123"
	}]

#### **response example**

	{
		"result":ok
	}
	{
		"result":false,
		"reason":失败原因
	}
	
###8.8 模块列表
####  `GET`  /configcenter/ws/configcenter/ws/model/moduleList
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>模块序列号</td>
   </tr>
   <tr>
      <td>name</td>
      <td>模块名称</td>
   </tr>
</table>

#### **response example**

	[{
	  "id": 1,
	  "name": "master"
	},
	{
	  "id": 2,
	  "name": "router"
	},
	{
	  "id": 3,
	  "name": "Loadbalance"
	}]
	
###8.9 删除模块
####  `GET`  /configcenter/ws/configcenter/ws/model/delModel
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>模板编号</td>
   </tr>
</table>

#### **response example**

	成功：ok

###8.10  添加模块
####  `POST`  /configcenter/ws/configcenter/ws/model/ addModule
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>模块名</td>
   </tr>
</table>

#### **response example**

	{
		"result":ok
	}
	{
		"result":false,
		"reason":失败原因
	}
	
###8.11  类型列表
####  `GET`  /configcenter/ws/configcenter/ws/model/ typeList
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>模块序列号</td>
   </tr>
   <tr>
      <td>name</td>
      <td>模块类型</td>
   </tr>
</table>

###8.12  添加类型信息 
####  `POST`  /configcenter/ws/configcenter/ws/model/ addType
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>id</td>
      <td>模块序列号</td>
   </tr>
   <tr>
      <td>modelname</td>
      <td>模板名称</td>
   </tr>
   <tr>
      <td>description</td>
      <td>描述</td>
   </tr>
</table>

###8.13  删除类型
####  `GET`  /configcenter/ws/configcenter/ws/model/delType
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>typeids</td>
     <td>要删除的类型id列表</td>
   </tr>
</table>

#### **response example**

	{
		"result":ok
	}
	{
		"result":false,
		"reason":失败原因
	}
	
###8.14  更新类型信息
####  `POST`  /configcenter/ws/configcenter/ws/model/updateType
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>类型编号</td>
   </tr>
   <tr>
     <td>type</td>
     <td>类型名称</td>
   </tr>
   <tr>
     <td>description</td>
     <td>描述</td>
   </tr>
</table>

#### **response example**

	{
		"result":ok
	}
	{
		"result":false,
		"reason":失败原因
	}

###8.15  模板批量导入接口
####  `POST`  /configcenter/ws/configcenter/ws/model/ injectModelConfigs
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>module</td>
     <td>模块名</td>
   </tr>
	<tr>
     <td>type</td>
     <td>类型名称</td>
    </tr>
	<tr>
     <td>modelid</td>
     <td>模型id</td>
    </tr>
	<tr>
     <td>repeat_op</td>
     <td>行重复时操作 1：更新值 2：报错</td>
    </tr>
	<tr>
     <td>content</td>
     <td>导入的内容 #a的值 \n a=1000 \n b=b</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>error[].line</td>
      <td>错误的输入行</td>
   </tr>
   <tr>
      <td>error[]:reason</td>
      <td>错误的原因</td>
   </tr>
	<tr>
     <td>errornum</td>
     <td>错误的行数</td>
    </tr>
	<tr>
     <td>insertnum</td>
     <td>插入行的数量</td>
    </tr>
	<tr>
     <td>insert[]</td>
     <td>插入的行信息</td>
    </tr>
	<tr>
     <td>update[]</td>
     <td>更新的行的信息</td>
    </tr>
	<tr>
     <td>updatenum</td>
     <td>更新行数量</td>
    </tr>
	<tr>
     <td>result</td>
     <td>在errornum为0时为true 否则为false</td>
    </tr>
</table>

#### **response example**

	{
	  "error": [{
		"line": "dasd",
		"reason": "format_error"
	  },
	  {
		"line": "das",
		"reason": "format_error"
	  }],
	  "errornum": 2,
	  "insert": [{
		"description": "",
		"dynamic": 0,
		"iscommon": 0,
		"key": "d",
		"line": "d=das",
		"modelid": "3",
		"module": "svn",
		"type": "normal",
		"value": "das"
	  }],
	  "insertnum": 1,
	  "result": "error",
	  "update": [{
		"description": "a value",
		"id": 601,
		"key": "a",
		"line": "a=a100",
		"modelid": "3",
		"module": "svn",
		"type": "normal",
		"value": "a100"
	  }],
	  "updatenum": 1
	}

###8.16  用户注册
####  `POST`  /configcenter/ws/configcenter/ws/user/personRegister
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>nickName</td>
     <td>昵称</td>
   </tr>
	<tr>
     <td>passwd</td>
     <td>MD5后的密码</td>
    </tr>
	<tr>
     <td>passwd2</td>
     <td>MD5后的重复密码</td>
    </tr>
	<tr>
     <td>email</td>
     <td>邮箱</td>
    </tr>
	<tr>
     <td>usertype</td>
     <td>用户类型id  对应模板id</td>
    </tr>
</table>

#### **response example**

	{
		"result":ok
	}
	{
		"result":false,
		"reason":失败原因
	}

###8.17  检查用户名
####  `GET`  /configcenter/ws/configcenter/ws/user/checkName
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>昵称</td>
   </tr>
</table>

#### **response example**

	{
		"result":true，
		"msg":可以使用
	}
	{
		"result":false,
		"msg":已占用  不可使用
	}

###8.18 登录
####  `GET`  /configcenter/ws/configcenter/ws/user/login
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>昵称</td>
   </tr>
	<tr>
     <td>pwd</td>
     <td>MD5后的密码</td>
    </tr>
</table>

#### **response example**

	ok_user 普通用户登陆成功
	ok_admin  管理员登录成功
	错误信息
	
###8.18  用户列表
####  `GET`  /configcenter/ws/configcenter/ws/user/configcenter/ws/configcenter/ws/userList
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>email</td>
      <td>邮箱</td>
   </tr>
   <tr>
      <td>id</td>
      <td>用户id</td>
   </tr>
   <tr>
      <td>inum</td>
      <td>拥有配置的数量</td>
   </tr>
   <tr>
      <td>modelname</td>
      <td>使用模型的名称（角色）</td>
   </tr>
   <tr>
      <td>username</td>
      <td>用户名</td>
   </tr>
</table>

#### **response example**

	[{
	  "email": "paasA@qq.com",
	  "id": 10,
	  "inum": 0,
	  "modelname": "测试人员",
	  "username": "paasA"
	},
	{
	  "email": "paasB@qq.com",
	  "id": 11,
	  "inum": 0,
	  "modelname": "测试人员",
	  "username": "paasB"
	},
	{
	  "email": "paas@163.com",
	  "id": 13,
	  "inum": 5,
	  "modelname": "测试人员",
	  "username": "paas"
	},
	{
	  "email": "paas@163.com",
	  "id": 15,
	  "inum": 0,
	  "modelname": "克隆用户",
	  "username": "paas_clone_1"
	},
	{
	  "email": "aaa@qq.com",
	  "id": 17,
	  "inum": 0,
	  "modelname": "测试人员",
	  "username": "aaa111"
	},
	{
	  "email": "test@test.com",
	  "id": 18,
	  "inum": 2,
	  "modelname": "开发人员",
	  "username": "test"
	}]

###8.19  删除用户
####  `GET`  /configcenter/ws/configcenter/ws/user/configcenter/ws/configcenter/ws/userDel
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>id</td>
     <td>待删除用户id</td>
   </tr>
</table>
  
#### **response example**

	成功：success
	失败：error
	
###8.20  判断用户是否是被克隆的
####  `GET`  /configcenter/ws/configcenter/ws/user/ifclone
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userid</td>
     <td>用户id</td>
   </tr>
</table>
  
#### **response example**

	clone 克隆的账户
	main 主账户

###8.21  克隆用户
####  `GET`  /configcenter/ws/configcenter/ws/user/cloneUser  
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>username</td>
     <td>用户名</td>
   </tr>
	<tr>
     <td>clonePassword</td>
     <td>是否克隆主账户密码 1是</td>
    </tr>
	<tr>
     <td>password</td>
     <td>MD5后的密码 如果clonsePassword为1 本字段为空</td>
    </tr>
	<tr>
     <td>description</td>
     <td>描述</td>
    </tr>
</table>

#### **response example**

	成功：success
	失败：失败原因
	
###8.22  删除克隆用户
####  `GET`  /configcenter/ws/configcenter/ws/user/delCloneRelation
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userid</td>
     <td>用户id</td>
   </tr>
</table>
  
#### **response example**
 
	成功：success
	失败：失败原因

###8.23 当前用户下的克隆用户列表
####  `GET`  /configcenter/ws/configcenter/ws/user/clonelist
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>clonedate</td>
      <td>克隆日期</td>
   </tr>
   <tr>
      <td>clonefrom</td>
      <td>从哪个id的用户克隆来的</td>
   </tr>
	<tr>
     <td>clonepassword</td>
     <td>是否克隆的密码</td>
    </tr>
	<tr>
     <td>description</td>
     <td>描述</td>
    </tr>
	<tr>
     <td>id </td>
     <td>用户标识id</td>
    </tr>
	<tr>
     <td>username</td>
     <td>用户名</td>
    </tr>
</table>

#### **response example**

	[{
	  "clonedate": "2016-08-18 04:09:46",
	  "clonefrom": 13,
	  "clonepassword": 1,
	  "description": "",
	  "id": 27,
	  "userid": 15,
	  "username": "paas_clone_1"
	}]

###8.24  当前用户下的配置列表
####  `GET`  /configcenter/ws/config/getConfigs
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>module</td>
     <td>模块名称</td>
   </tr>
	<tr>
     <td>type</td>
     <td>类型</td>
    </tr>
	<tr>
     <td>iscommon</td>
     <td>是否常用</td>
    </tr>
	<tr>
     <td>keyword</td>
     <td>搜索关键词</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>description</td>
     <td>描述</td>
   </tr>
	<tr>
     <td>id</td>
     <td>id序列号</td>
    </tr>
	<tr>
     <td>key</td>
     <td>键</td>
    </tr>
	<tr>
     <td>value</td>
     <td>值</td>
    </tr>
	<tr>
     <td>iscommon</td>
     <td>是否常用</td>
    </tr>
	<tr>
     <td>userid</td>
     <td>所属用户</td>
    </tr>
	<tr>
     <td>type</td>
     <td>类型</td>
    </tr>
	<tr>
     <td>dynamic</td>
     <td>是否支持下发</td>
    </tr>
</table>

#### **response example**

	[{
	  "description": "",
	  "dynamic": 0,
	  "id": 7604,
	  "iscommon": 1,
	  "key": "jdbc.ip",
	  "module": "master",
	  "type": "normal",
	  "userid": 13,
	  "value": "127.0.0.1"
	},
	{
	  "description": "",
	  "dynamic": 0,
	  "id": 7605,
	  "iscommon": 1,
	  "key": "jdbc.port",
	  "module": "master",
	  "type": "normal",
	  "userid": 13,
	  "value": "5091"
	}]
	
###8.25  配置保存修改
####  `GET`  /configcenter/ws/config/save
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>module</td>
     <td>模块名</td>
   </tr>
	<tr>
     <td>rows</td>
     <td>key=value多行添加 修改 删除等信息</td>
    </tr>
	<tr>
     <td>rows.id</td>
     <td>需要修改或删除的id</td>
    </tr>
	<tr>
     <td>rows[].iscommon</td>
     <td>是否常用的键</td>
    </tr>
	<tr>
     <td>rows[].dynamic</td>
     <td>是否支持动态下发</td>
    </tr>
	<tr>
     <td>rows[].key</td>
     <td>键</td>
    </tr>
	<tr>
     <td>rows[].value</td>
     <td>值</td>
    </tr>
	<tr>
     <td>rows[].description</td>
     <td>描述</td>
    </tr>
	<tr>
     <td>rows[].insert</td>
     <td>true or false  是否是用来插入的行</td>
    </tr>
	<tr>
     <td>rows[].del</td>
     <td>true or false  是否是用来删除的行</td>
    </tr>
</table>

#### **response example**

	成功：success
	失败：error

###8.26  下发配置
####  `GET`  /configcenter/ws/config/sendConfig
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>module</td>
     <td>模块名</td>
   </tr>
</table>

#### **response example**

	成功：success
	失败：失败原因
	
###8.27  外部获取配置的接口
####  `GET`  /configcenter/ws/config/getConfig
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>hostIp</td>
     <td>主机ip</td>
   </tr>
	<tr>
     <td>hostPort</td>
     <td>主机端口</td>
    </tr>
	<tr>
     <td>userName</td>
     <td>用户名</td>
    </tr>
	<tr>
     <td>passWord</td>
     <td>密码</td>
    </tr>
	<tr>
     <td>moduleType</td>
     <td>模块</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>message</td>
      <td>申请失败错误信息</td>
   </tr>
   <tr>
      <td>module</td>
      <td>模块</td>
   </tr>
	<tr>
     <td>result</td>
     <td>true、false</td>
    </tr>
	<tr>
     <td>content</td>
     <td>内容</td>
    </tr>
	<tr>
     <td>content.key</td>
     <td>键</td>
    </tr>
	<tr>
     <td>content.value</td>
     <td>值</td>
    </tr>
	<tr>
     <td>content.description</td>
     <td>描述</td>
    </tr>
</table>

#### **response example**

	{
	  "content": {
		"normal": [{
		  "description": "",
		  "dynamic": 0,
		  "id": 7606,
		  "iscommon": 1,
		  "key": "master.ip",
		  "module": "router",
		  "type": "normal",
		  "userid": 13,
		  "value": "${master#jdbc.ip}"
		},
		{
		  "description": "",
		  "dynamic": 0,
		  "id": 7607,
		  "iscommon": 1,
		  "key": "master.port",
		  "module": "router",
		  "type": "normal",
		  "userid": 13,
		  "value": "${lll}"
		},
		{
		  "description": "",
		  "dynamic": 0,
		  "id": 7608,
		  "iscommon": 1,
		  "key": "master.ll",
		  "module": "router",
		  "type": "normal",
		  "userid": 13,
		  "value": "#{master#jdbc.port}"
		}]
	  },
	  "message": "success",
	  "module": "router",
	  "result": "true"
	}
	
###8.28 批量导入
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>module</td>
     <td>模块名</td>
   </tr>
	<tr>
     <td>type </td>
     <td>类型名称</td>
    </tr>
	<tr>
     <td>repeat_op</td>
     <td>行重复时操作 1：更新值 2：报错</td>
    </tr>
	<tr>
     <td>content</td>
     <td>导入的内容 #a的值 \n a=1000 \n b=b</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>error[].line</td>
      <td>错误的输入行</td>
   </tr>
   <tr>
      <td>error[]:reason</td>
      <td>错误的原因</td>
   </tr>
	<tr>
     <td>errornum</td>
     <td>错误的行数</td>
    </tr>
	<tr>
     <td>insertnum</td>
     <td>插入行的数量</td>
    </tr>
	<tr>
     <td>insert[]</td>
     <td>插入的行信息</td>
    </tr>
	<tr>
     <td>update[]</td>
     <td>更新的行的信息</td>
    </tr>
	<tr>
     <td>updatenum</td>
     <td>更新行数量</td>
    </tr>
	<tr>
     <td>result</td>
     <td>在errornum为0时为true 否则为false</td>
    </tr>
</table>

##9.  应用配置中心
###9.1 分页获取拥有配置的应用
####  `GET`  /masterl/ws/configs/getAppsByPage
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id</td>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>页面大小</td>
    </tr>
	<tr>
     <td>pageNum</td>
     <td>页码</td>
    </tr>
	<tr>
     <td>keyword</td>
     <td>搜索关键词</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageSize</td>
     <td>页面大小</td>
    </tr>
	<tr>
     <td>pageNum</td>
     <td>页码</td>
    </tr>
	<tr>
     <td>rows[]</td>
     <td>数据</td>
    </tr>
	<tr>
     <td>total</td>
     <td>总数量</td>
    </tr>
	<tr>
     <td>rows.appName</td>
     <td>应用名</td>
    </tr>
	<tr>
     <td>rows.id</td>
     <td>配置id</td>
    </tr>
	<tr>
     <td>last_update_time</td>
     <td>最后更新时间</td>
    </tr>
	<tr>
     <td>versionId</td>
     <td>版本id</td>
    </tr>
</table>

#### **response example**

	{
	  "pageNum": 1,
	  "pageSize": 10,
	  "rows": [{
		"appName": "kevin1021",
		"id": 13,
		"last_update_time": "2016-10-21 14:28:56",
		"version": "v173",
		"versionId": 173
	  },
	  {
		"appName": "storm",
		"id": 11,
		"last_update_time": "2016-10-21 10:49:59",
		"version": "v151",
		"versionId": 151
	  },
	  {
		"appName": "testa_1021",
		"id": 15,
		"last_update_time": "2016-10-21 14:48:59",
		"version": "v189",
		"versionId": 189
	  },
	  {
		"appName": "testredisapp",
		"id": 21,
		"last_update_time": "2016-10-24 17:08:14",
		"version": "v233",
		"versionId": 233
	  },
	  {
		"appName": "zbpredis1",
		"id": 19,
		"last_update_time": "2016-10-24 16:53:54",
		"version": "v231",
		"versionId": 231
	  }],
	  "total": 5
	}
	
###9.2 获取应用配置详情
####  `GET`  /masterl/ws/configs/getConfigList
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>versionId</td>
     <td>应用版本id</td>
   </tr>
   <tr>
     <td>keyword</td>
     <td>搜索关键词</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appName</td>
     <td>应用名称</td>
   </tr>
   <tr>
     <td>last_update_time</td>
     <td>最后更新时间</td>
    </tr>
	<tr>
     <td>total</td>
     <td>总数</td>
    </tr>
	<tr>
     <td>version</td>
     <td>版本名称</td>
    </tr>
	<tr>
     <td>rows[]</td>
     <td>数据</td>
    </tr>
	<tr>
     <td>rows.description</td>
     <td>键值对描述</td>
    </tr>
	<tr>
     <td>rows.id</td>
     <td>键值对id</td>
    </tr>
	<tr>
     <td>key</td>
     <td>键值对key</td>
    </tr>
	<tr>
     <td>value</td>
     <td>值</td>
    </tr>

</table>

#### **response example**

	{
	  "appName": "storm",
	  "id": 11,
	  "last_update_time": "2016-10-21 10:49:59",
	  "rows": [{
		"description": "zookeeper",
		"id": 81,
		"key": "storm.zookeeper.servers",
		"value": "[\"localhost\"]"
	  },
	  {
		"description": "",
		"id": 83,
		"key": "storm.zookeeper.port",
		"value": "2181"
	  },
	  {
		"description": "",
		"id": 85,
		"key": "storm.local.dir",
		"value": "/data/storm/data"
	  },
	  {
		"description": "master地址",
		"id": 87,
		"key": "nimbus.host",
		"value": "localhost"
	  },
	  {
		"description": "",
		"id": 89,
		"key": "supervisor.slots.ports",
		"value": "[6700,6701,6702]"
	  }],
	  "total": 5,
	  "version": "v151"
	}
	
###9.3 添加一行配置
####  `POST`  /masterl/ws/configs/addLine
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>versionId</td>
     <td>应用版本id</td>
   </tr>
   <tr>
     <td>key</td>
     <td>键</td>
    </tr>
	<tr>
     <td>value</td>
     <td>值</td>
    </tr>
	<tr>
     <td>description</td>
     <td>描述</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>msg</td>
      <td>错误信息</td>
   </tr>
</table>

#### **response example**

	{
		"result":true
	}
	或
	{
		"result":false,
		”msg”:“config has already exist”
	}
	
###9.4 更新一行配置
####如果该配置没有则添加一行  
####  `POST`  /masterl/ws/configs/updateLine
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>versionId</td>
     <td>应用版本id</td>
   </tr>
   <tr>
     <td>key</td>
     <td>键</td>
    </tr>
	<tr>
     <td>value</td>
     <td>值</td>
    </tr>
	<tr>
     <td>description</td>
     <td>描述</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>msg</td>
      <td>错误信息</td>
   </tr>
</table>

#### **response example**

	{
		"result":true
	}
	或
	{
		"result":false,
		”msg”:“db error”
	}

###9.5 删除一行
####  `POST`  /masterl/ws/configs/deleteLine
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>versionId</td>
     <td>应用版本id</td>
   </tr>
   <tr>
      <td>id</td>
      <td>键id</td>
   </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
   <tr>
      <td>msg</td>
      <td>错误信息</td>
   </tr>
</table>

#### **response example**

	{
		"result":true
	}
	{
		"result":false,
		”msg”:“db error”
	}
	
###9.6 批量导入配置
####  `POST`  /masterl/ws/configs/injectConfigs
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>versionId</td>
     <td>应用版本id</td>
   </tr>
   <tr>
      <td>content</td>
      <td>导入内容key1=value2\n #description of key2\n key2=a\n</td>
   </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>true false 如果errornum==0 则为true</td>
   </tr>
   <tr>
      <td>insertnum</td>
      <td>新增的行数</td>
   </tr>
   <tr>
      <td>updatenum</td>
      <td>更新的行数</td>
   </tr>
   <tr>
      <td>error.line</td>
      <td>错误的行内容</td>
   </tr>
   <tr>
      <td>reason</td>
      <td>出错原因</td>
   </tr>
</table>

#### **response example**

	{
	  "error": [{
		"line": "ddd",
		"reason": "format_error"
	  }],
	  "errornum": 1,
	  "insertnum": 1,
	  "result": false,
	  "updatenum": 1
	}
	
###9.7 申请配置
####  `POST`  /masterl/ws/configs/getConfig
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userName</td>
     <td>paas用户名</td>
   </tr>
   <tr>
     <td>password</td>
     <td>密码</td>
    </tr>
	<tr>
     <td>appName</td>
     <td>应用名</td>
    </tr>
	<tr>
     <td>appVersion</td>
     <td>应用版本</td>
    </tr>
	<tr>
     <td>clientUrl</td>
     <td>配置下发地址</td>
    </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appName</td>
     <td>应用名</td>
   </tr>
   <tr>
     <td>rows.key</td>
     <td>键</td>
    </tr>
	<tr>
     <td>rows.value</td>
     <td>值</td>
    </tr>
	<tr>
     <td>rows.description</td>
     <td>描述</td>
    </tr>
	<tr>
     <td>id</td>
     <td>id序列号</td>
    </tr>
	<tr>
     <td>last_update_time</td>
     <td>最后更新时间</td>
    </tr>
	<tr>
     <td>rows[]</td>
     <td>数据</td>
    </tr>
	<tr>
     <td>total</td>
     <td>总数</td>
    </tr>
	<tr>
     <td>version</td>
     <td>版本名称</td>
    </tr>	
</table>

#### **response example**

	{
	  "appName": "storm",
	  "id": 11,
	  "last_update_time": "2016-10-25 10:36:04",
	  "rows": [{
		"description": "zookeeper集群中的一个地址",
		"key": "storm.zookeeper.servers",
		"value": "[\"localhost\"]"
	  },
	  {
		"description": "zookeeper端口",
		"key": "storm.zookeeper.port",
		"value": "2181"
	  },
	  {
		"description": "存储位置",
		"key": "storm.local.dir",
		"value": "/data/storm/data"
	  },
	  {
		"description": "master地址",
		"key": "nimbus.host",
		"value": "localhost"
	  },
	  {
		"description": "这里定义了worker的可用端口，表示每个supervisor有3个work可以使用",
		"key": "supervisor.slots.ports",
		"value": "[6700,6701,6702]"
	  },
	  {
		"description": "",
		"key": "key1",
		"value": "value2"
	  },
	  {
		"description": "description of key2",
		"key": "key2",
		"value": "a"
	  }],
	  "total": 7,
	  "version": "v151"
	}
	
###9.8 主动下发接口
####根据已注册的客户端群发报文
####  `GET`  /masterl/ws/configs/sendConfigs
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>versionId</td>
     <td>版本id</td>
   </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>果是否正确true false</td>
   </tr>
   <tr>
      <td>msg</td>
      <td>错误信息</td>
   </tr>
</table>

#### **response example**

	{
		"result":true
	}
	{
		"result":false,
		”msg”:”no client registry”
	}
	
###9.9 不分页获取全部平台应用
####获取该用户在集群中的所有应用
####  `GET`  /masterl/ws/configs/getApps
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userId</td>
     <td>用户id列表</td>
   </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>appId</td>
      <td>应用主键</td>
   </tr>
   <tr>
      <td>appName</td>
      <td>应用名</td>
   </tr>
   <tr>
      <td>id</td>
      <td>应用的id</td>
   </tr>
</table>

#### **response example**

	[{
	  "appId": "66c39752-be95-4bf0-a6f8-f44eaf90898e",
	  "appName": "chytest132",
	  "id": 41
	},
	{
	  "appId": "89641ec3-ae9f-4cba-ae7e-9c77a2fbe5a4",
	  "appName": "chytest3",
	  "id": 43
	},
	{
	  "appId": "8756c025-a7dc-4f35-8482-d2f0f69ee9a3",
	  "appName": "alnginx",
	  "id": 85
	},
	{
	  "appId": "8265cc61-a8c8-4c54-8b52-af10a86a4440",
	  "appName": "netperf",
	  "id": 105
	},
	{
	  "appId": "7f74074f-32f7-4c5c-84d1-c243a55b4ebd",
	  "appName": "syhprintlog",
	  "id": 109
	},
	{
	  "appId": "4f8e0ea2-7951-4f5b-94cd-e20ccadfa752",
	  "appName": "storm",
	  "id": 121
	},
	{
	  "appId": "eda41436-b7fb-46c7-a9fb-42b0d6e10ef3",
	  "appName": "nphost",
	  "id": 123
	},
	{
	  "appId": "f6d94142-db6a-41c2-993b-d34ffd8b6a1a",
	  "appName": "syh86",
	  "id": 131
	},
	{
	  "appId": "7e4ef772-028b-4e7f-b2e1-d2729103102d",
	  "appName": "kevin1021",
	  "id": 135
	},
	{
	  "appId": "4d507740-ca9d-4425-9a5f-293a1e02da3a",
	  "appName": "syh1021",
	  "id": 137
	},
	{
	  "appId": "4006246e-415d-4331-806e-c5ea288d5287",
	  "appName": "gateone_gateone",
	  "id": 141
	},
	{
	  "appId": "124b9300-0aef-492c-995a-61fdfbc7372d",
	  "appName": "testa_1021",
	  "id": 149
	},
	{
	  "appId": "20336b4b-027a-43b3-a9f1-37e69f1c2bdc",
	  "appName": "ss_testa_1021",
	  "id": 151
	},
	{
	  "appId": "b3ba0083-fddb-4ac4-918b-20705c4ad16f",
	  "appName": "syh_cpu_noshare",
	  "id": 153
	},
	{
	  "appId": "040f7f8e-32ef-4765-b400-fd36bd256550",
	  "appName": "syh_1host_1inst",
	  "id": 157
	},
	{
	  "appId": "1ca7b989-e649-4422-b430-0b36f185eed6",
	  "appName": "chyiperf",
	  "id": 159
	},
	{
	  "appId": "efa7d9ae-8e28-4ae9-b0c3-ceb493e5055f",
	  "appName": "syh_host_noshare",
	  "id": 163
	},
	{
	  "appId": "34ee3b33-6b17-4c45-acc8-22b54185ea79",
	  "appName": "zltest1024",
	  "id": 171
	},
	{
	  "appId": "000112ec-807d-44eb-a931-5883fef392f7",
	  "appName": "zbpredis1",
	  "id": 183
	},
	{
	  "appId": "d2768e8d-d754-4656-b2f7-5b34c996f9ef",
	  "appName": "syh_host",
	  "id": 193
	}]
###9.10  不分页获取应用的版本
####  `GET`  /masterl/ws/configs/getVersions
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>appId</td>
     <td>应用id</td>
   </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>appId</td>
      <td>应用id</td>
   </tr>
   <tr>
      <td>versionId</td>
      <td>版本的id</td>
   </tr>
   <tr>
      <td>versionName</td>
      <td>版本的名称</td>
   </tr>
</table>

#### **response example**

	[{
	  "appId": 41,
	  "versionId": 47,
	  "versionName": "v47"
	},
	{
	  "appId": 41,
	  "versionId": 49,
	  "versionName": "v49"
	}]
	
###9.11  为应用创建配置
####  `POST`  /masterl/ws/configs/create
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>appId</td>
      <td>应用id</td>
   </tr>
   <tr>
      <td>versionId</td>
      <td>版本的id</td>
   </tr>
   <tr>
      <td>description</td>
      <td>描述</td>
   </tr>
   <tr>
      <td>configs</td>
      <td>首次添加的数据</td>
   </tr>
</table>

#### **request example**

	[{
	  key: "key1",
	  value: "value1",
	  description: "sss"
	},
	{
	  key: "key2",
	  value: "value2",
	  description: "ddd"
	}]
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>结果是否正确true false</td>
   </tr>
   <tr>
      <td>msg</td>
      <td>错误信息</td>
   </tr>
</table>

#### **response example**

	{
		"result":true
	}
	{
		"result":false,
		”msg”:“db error”
	}

###9.12 删除应用版本下的配置
####  `POST`  /masterl/ws/configs/delForApp
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>versionId</td>
     <td>版本id</td>
   </tr>
</table>

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>结果是否正确true false</td>
   </tr>
   <tr>
      <td>msg</td>
      <td>错误信息</td>
   </tr>
</table>

#### **response example**

	{
		"result":true
	}
	{
		"result":false,
		”msg”:“db error”
	}


##10.权限管理API
###10.1  运维人员列表
####  GET /listUsers

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>roleId</td>
     <td>用户名</td>
   </tr>
   <tr>
     <td>userId</td>
     <td>角色名称</td>
   </tr>
</table>  
  
#### **response example**  
``` js 
   [
{
"roleId":"运维人员",
"userId":"admin"
},
{
"roleId":"运维人员",
"userId":"admin1"
}
]
``` 

###10.2  新建运维人员
####  POST /createUser    
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>username</td>
     <td>用户名</td>
   </tr>
   <tr>
     <td>password</td>
     <td>密码</td>
   </tr>
   <tr>
     <td>roleid</td>
     <td>角色</td>
   </tr>
   <tr>
     <td>parentid</td>
     <td>父ID</td>
   </tr>
</table>

#### **response example**  

``` js 
    {
      "result": true,
      "message":"创建成功！"
    }
    或
    {
      "result": false,
      "message": "创建失败！"
    }
```
  
###10.3  判断用户是否已存在
####  POST /isExitUser 
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>name</td>
     <td>用户名</td>
   </tr>
</table> 

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
   <tr>
     <td>message</td>
     <td>提示信息</td>
   </tr>
</table>  

#### **response example**  

``` js 
    {
      "result": true,
      "message":"用户不存在！"
    }
    或
    {
      "result": false,
      "message": "用户已存在！"
    }
```
  
###10.4  新建角色
####  POST /新建角色
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>roleName</td>
     <td>角色名称</td>
   </tr>
</table> 
    
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
   <tr>
     <td>message</td>
     <td>提示信息</td>
   </tr>
</table>

#### **response example**  

``` js 
    {
      "result": true,
      "message":"创建成功！"
    }
    或
    {
      "result": false,
      "message": "创建失败！"
    }
```

###10.5  角色列表
####  GET /listRoles    
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>roleId</td>
     <td>角色ID</td>
   </tr>
   <tr>
     <td>name</td>
     <td>角色名称</td>
   </tr>
</table>

#### **response example**  

``` js 
        [
      {
        "roleId":"1",
        "name":"yunwei"
      },
      {
        "roleId":"2",
        "name":"sdmin"
      }
]   
```

###10.6  删除角色
####  POST / delRole   
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>roleId</td>
     <td>角色名称</td>
   </tr>
</table> 

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
   <tr>
     <td>message</td>
     <td>提示信息</td>
   </tr>
</table>

#### **response example**  

``` js 
    {
      "result": true,
      "message":"删除成功！"
    }
    或
    {
      "result": false,
      "message": "删除失败！"
    }
```

###10.7  获取角色的权限列表
####  POST /getPolicysOfRole  
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>Id</td>
     <td>角色名称</td>
   </tr>
</table> 

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>have</td>
     <td>是否有此权限</td>
   </tr>
   <tr>
     <td>page_id</td>
     <td>权限ID</td>
   </tr>
   <tr>
     <td>text</td>
     <td>菜单名称</td>
   </tr>
   <tr>
     <td>icon</td>
     <td>菜单图标</td>
   </tr>
   <tr>
     <td>sref</td>
     <td>菜单链接</td>
   </tr>
   <tr>
     <td>title</td>
     <td>菜单描述</td>
   </tr>
   <tr>
     <td>type</td>
     <td>菜单类型</td>
   </tr>
</table>

#### **response example**  

``` js 
        [
      {
        "have":"true",
        "policy":
{"page_id":"1",
"text":"集群管理",
"icon":"fa fa-cube",
"sref":"/listclusters",
"title":"我的集群",
"type":"cluster"
}
      },
      {
        "have":"true",
        "policy":
{"page_id":"1",
"text":"集群管理",
"icon":"fa fa-cube",
"sref":"/listclusters",
"title":"我的集群",
"type":"cluster"}
        }
]
```
   

###10.8  保存角色的权限
####  POST/savePolicysOfRole  
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>roleId</td>
     <td>角色名称</td>
   </tr>
   <tr>
     <td>policyIds</td>
     <td>多个权限ID</td>
   </tr>
</table> 

#### **response example**  

``` js 
    {
      "result": true,
      "message":"添加成功！"
    }
    或
        {
      "result": false,
      "message": "添加失败！"
    }
```

###10.9  判断角色是否存在 
####  GET/isExitRole 
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>roleId</td>
     <td>角色名称</td>
   </tr>
</table> 
 
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
   <tr>
     <td>message</td>
     <td>提示信息</td>
   </tr>
</table>

#### **response example**  

``` js 
    {
      "result": true,
      "message":"角色不存在！"
    }
    或
    {
      "result": false,
      "message": "角色已存在！"
    }
```

###10.10  添加权限 
####  POST/ createPolicy 
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>page_id</td>
     <td>权限ID</td>
   </tr>
   <tr>
     <td>text</td>
     <td>菜单名称</td>
   </tr>
   <tr>
     <td>icon</td>
     <td>菜单图标</td>
   </tr>
   <tr>
     <td>sref</td>
     <td>菜单链接</td>
   </tr>
   <tr>
     <td>title</td>
     <td>菜单描述</td>
   </tr>
     <td>type</td>
     <td>菜单类型</td>
   </tr>
</table> 
 
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
   <tr>
     <td>message</td>
     <td>提示信息</td>
   </tr>
</table>

#### **response example**  

``` js 
    {
      "result": true,
      "message":"创建成功！"
    }
    或
    {
      "result": false,
      "message": "创建失败！"
    }
```

###10.11  删除权限
####  POST/ delPolicy   
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>policyId</td>
     <td>权限ID</td>
   </tr>
</table> 

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
   <tr>
     <td>message</td>
     <td>提示信息</td>
   </tr>
</table>

#### **response example**  

``` js 
    {
      "result": true,
      "message":"删除成功！"
    }
    或
    {
      "result": false,
      "message": "删除失败！"
    }
```

###10.12  更新权限
####  POST/ modifyPolicy    
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>page_id</td>
     <td>权限ID</td>
   </tr>
   <tr>
     <td>text</td>
     <td>菜单名称</td>
   </tr>
   <tr>
     <td>icon</td>
     <td>菜单图标</td>
   </tr>
   <tr>
     <td>sref</td>
     <td>菜单链接</td>
   </tr>
   <tr>
     <td>title</td>
     <td>菜单描述</td>
   </tr>
     <td>type</td>
     <td>菜单类型</td>
   </tr>
</table> 

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>result</td>
     <td>执行结果</td>
   </tr>
   <tr>
     <td>message</td>
     <td>提示信息</td>
   </tr>
</table>

#### **response example**  

``` js 
    {
      "result": true,
      "message":"更新成功！"
    }
    或
    {
      "result": false,
      "message": "更新失败！"
    }
```

###10.13  权限列表
####  GET/listPolicys
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>page_id</td>
     <td>权限ID</td>
   </tr>
   <tr>
     <td>text</td>
     <td>菜单名称</td>
   </tr>
   <tr>
     <td>icon</td>
     <td>菜单图标</td>
   </tr>
   <tr>
     <td>sref</td>
     <td>菜单链接</td>
   </tr>
   <tr>
     <td>title</td>
     <td>菜单描述</td>
   </tr>
     <td>type</td>
     <td>菜单类型</td>
   </tr>
</table> 

#### **response example**  

``` js 
    [
      {
        "page_id":1,
         "text":"IAAS接入管理",
        "icon":"fa fa-sign-in",
        "sref":"/iaas",
        "title":"IAAS接入管理",
        "type":"iaas"
      },
    {
        "page_id":2,
        "text":"集群管理",
        "icon":"icon-grid",
        "sref":"/listclusters",
        "title":"我的集群",
        "type":"cluster"
      }
]
```

###10.14  登陆时获取用户权限
####  GET/getPolicies 
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>userName</td>
     <td>用户名</td>
   </tr>
</table> 

#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>page_id</td>
     <td>权限ID</td>
   </tr>
   <tr>
     <td>text</td>
     <td>菜单名称</td>
   </tr>
   <tr>
     <td>icon</td>
     <td>菜单图标</td>
   </tr>
   <tr>
     <td>sref</td>
     <td>菜单链接</td>
   </tr>
   <tr>
     <td>title</td>
     <td>菜单描述</td>
   </tr>
   <tr>
     <td>type</td>
     <td>菜单类型</td>
   </tr>
</table>
  
#### **response example**  

``` js 
    [
      {
        "page_id":1,
         "text":"IAAS接入管理",
        "icon":"fa fa-sign-in",
        "sref":"/iaas",
        "title":"IAAS接入管理",
        "type":"iaas"
      },
    {
        "page_id":2,
        "text":"集群管理",
        "icon":"icon-grid",
        "sref":"/listclusters",
        "title":"我的集群",
        "type":"cluster"
      }
]
```
  
  
##11. 持续集成API
###11.1 任务列表
####  `GET`  /jenkins/jobsGet?pageno={pageno}&pagesize={pagesize}
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>pageno</td>
     <td>页码</td>
   </tr>
   <tr>
     <td>pagesize</td>
     <td>每页记录数</td>
    </tr>
</table>

#### **request example**

	pageno=1&pagesize=10
	
#### **response example**
 
	{
		"endRowNum":9,
		"pageNumber":1,
		"pageSize":10,
		"rows":[
			{
				"name":"job1014-c"
			},
			{
				"name":"job1014-testjava"
			}
		],
		"startRowNum":0,
		"total":2,
		"totalPageNum":1
	}
	
###11.2 build列表
####  `GET`  /jenkins/buildsGet?jobname={jobname}&pageno={pageno}&pagesize={pagesize}
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>jobname</td>
     <td>任务名称</td>
    </tr>
   <tr>
     <td>pageno</td>
     <td>页码</td>
   </tr>
   <tr>
     <td>pagesize</td>
     <td>每页记录数</td>
    </tr>
</table>

#### **request example**

	jobname=job1014-c&pageno=1&pagesize=10
	
#### **response example**

	{
		"endRowNum":9,
		"pageNumber":1,
		"pageSize":10,
		"rows":[
			{
				"actions":[
					{
					}
				],
				"artifacts":[
				],
				"building":false,
				"builtOn":"",
				"changeSet":{
				},
				"culprits":[
				],
				"displayName":"#5",
				"duration":1491,
				"estimatedDuration":3457,
				"fingerprint":[
				],
				"fullDisplayName":"job1014-c #5",
				"id":"5",
				"keepLog":false,
				"number":5,
				"queueId":7,
				"result":"SUCCESS",
				"timestamp":1477363348730,
				"url":"http://10.126.3.163:8080/job/job1014-c/5/"
			}
		],
		"startRowNum":0,
		"total":1,
		"totalPageNum":1
	}

###11.3 创建任务
####  `POST`  /jenkins/jobCreate
#### **request**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>jobname</td>
     <td>任务名称</td>
   </tr>
   <tr>
     <td>username</td>
     <td>代码库用户名</td>
    </tr>
	<tr>
     <td>password</td>
     <td>代码库密码</td>
    </tr>
	<tr>
     <td>reptype</td>
     <td>代码库类型</td>
    </tr>
	<tr>
     <td>repurl</td>
     <td>代码库地址</td>
    </tr>
	<tr>
     <td>commands</td>
     <td>构建指令</td>
    </tr>
	<tr>
     <td>params</td>
     <td>自定义参数</td>
    </tr>
</table>

#### **request example**

	commands:bash jenkin.sh
	jobname:job1014-c
	params:
	reptype:svn
	repurl:svn://10.126.3.163/testproject/2-syhtestc
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
</table>

###11.4 删除任务
####  `POST`  /jenkins/jobDelete
<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>jobname</td>
     <td>任务名称</td>
   </tr>
</table>

#### **request example**

	jobname:test
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
</table>

###11.5 获取配置
####  `GET`  /jenkins/configGet?jobname={jobname}
#### **request**
<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>jobname</td>
     <td>任务名称</td>
   </tr>
</table>

#### **request example**

	jobname=job1014-c
	
#### **response example**

	{
		"commands":"bash jenkin.sh;",
		"jobname":"job1014-c",
		"params":"",
		"reptype":"svn",
		"repurl":"svn://10.126.3.163/testproject/2-syhtestc"
	}

###11.6 build任务
####  `POST`  /jenkins/build 
#### **request**
<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>jobname</td>
     <td>任务名称</td>
   </tr>
</table>

#### **request example**

	jobname:test 
	
#### **response**

<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
      <td>result</td>
      <td>执行结果</td>
   </tr>
</table>

###11.7 查询build日志
####  `GET`  /jenkins/buildLog?jobname={jobname}&buildId={buildId}
#### **request**
<table class="table table-bordered table-striped">
   <tr>
      <th>名称</th>
      <th>描述</th>
   </tr>
   <tr>
     <td>jobname</td>
     <td>任务名称</td>
   </tr>
   <tr>
     <td>buildId</td>
     <td>buildId</td>
   </tr>
</table>

#### **request example**

	jobname=job1014-c&buildId=5
	
#### **response example**

	Started by user anonymous<br>Building in workspace /root/.jenkins/jobs/job1014-c/workspace<br>Cleaning up /root/.jenkins/jobs/job1014-c/workspace/.<br>Deleting /root/.jenkins/jobs/job1014-c/workspace/Tiny-WebServer-master/csapp.o<br>Deleting /root/.jenkins/jobs/job1014-c/workspace/Tiny-WebServer-master/tiny<br>Deleting /root/.jenkins/jobs/job1014-c/workspace/Tiny-WebServer-master/cgi-bin/adder<br>Updating svn://10.126.3.163/testproject/2-syhtestc at revision '2016-10-25T10:42:28.730 +0800'<br>At revision 18<br>no change for svn://10.126.3.163/testproject/2-syhtestc since the previous build<br>[workspace] $ /bin/sh -xe /tmp/hudson6406426050411063761.sh<br>+ bash jenkin.sh<br>gcc -O2 -Wall -I . -c csapp.c<br>gcc -O2 -Wall -I . -o tiny tiny.c csapp.o -lpthread<br>tiny.c: 在函数‘main’中:<br>tiny.c:20:29: 警告：未使用的变量‘port’ [-Wunused-variable]<br>     char hostname[MAXLINE], port[MAXLINE];<br>                             ^<br>tiny.c:20:10: 警告：未使用的变量‘hostname’ [-Wunused-variable]<br>     char hostname[MAXLINE], port[MAXLINE];<br>          ^<br>(cd cgi-bin; make)<br>make[1]: 进入目录“/root/.jenkins/jobs/job1014-c/workspace/Tiny-WebServer-master/cgi-bin”<br>gcc -O2 -Wall -I .. -o adder adder.c<br>make[1]: 离开目录“/root/.jenkins/jobs/job1014-c/workspace/Tiny-WebServer-master/cgi-bin”<br>/root/.jenkins/jobs/job1014-c/workspace<br>Warning: '-e' is deprecated, it will be removed soon. See usage.<br>Login Succeeded<br>Sending build context to Docker daemon 339.5 kB
	<br>Step 1 : FROM centos:7.2<br> ---> e0a0b58dd16a<br>Step 2 : MAINTAINER yangxian "yangxian@dcits.com"<br> ---> Using cache<br> ---> 97d80c07dbbb<br>Step 3 : WORKDIR /home<br> ---> Using cache<br> ---> 280812a43bca<br>Step 4 : ADD ./Tiny-WebServer-master ./<br> ---> Using cache<br> ---> 1222dca2176a<br>Step 5 : ENTRYPOINT /bin/bash<br> ---> Using cache<br> ---> de34d8b67d86<br>Successfully built de34d8b67d86<br>Warning: '-e' is deprecated, it will be removed soon. See usage.<br>Login Succeeded<br>The push refers to a repository [registry.paas:443/test/syhtestc]<br>f453bf556e18: Preparing<br>73fe19c34d0b: Preparing<br>202deb3652eb: Preparing<br>c4af1604d3f2: Preparing<br>f453bf556e18: Already exists<br>c4af1604d3f2: Already exists<br>202deb3652eb: Already exists<br>73fe19c34d0b: Already exists<br>Pushing tag for rev [de34d8b67d86] on {https://registry.paas:443/v1/repositories/test/syhtestc/tags/20161025104229}<br>  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current<br>                                 Dload  Upload   Total   Spent    Left  Speed<br>
	  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
	100   215  100    16  100   199    217   2703 --:--:-- --:--:-- --:--:--  2726<br>{"result":true }Finished: SUCCESS<br>

