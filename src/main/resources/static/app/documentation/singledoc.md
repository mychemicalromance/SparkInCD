#单点安装部署手册

##1	引言
###1.1	编写说明

 为神州数码云服务平台Sm@rtPAAS系统的最终用户，系统管理员，开发人员以及测试人员等提供产品的安装部署说明。

###1.2	适用范围

 本文档使用者为神州数码运服务平台Sm@rtPAAS系统的最终用户，系统管理员，开发人员以及测试人员等。

###1.3	术语解释

 Sm@rtPAAS：神州数码工程院自主研发的平台即服务产品。

##2	安装环境要求
###2.1	网络环境要求

 平台部署环境应该使用千兆网环境。部署环境的机器间可以互相通信。

###2.2	硬件环境要求

 服务器配置推荐为PC Server、也可以使用IBM、HP等服务器。

###2.3	软件环境要求

 客户端操作系统：Windows XP或者Windows 7等。

 客户端浏览器：IE7以上以及Chrome等主流浏览器。

 服务器端操作系统：Ubuntu14.04或者Redhat7.1，内核版本为3.10.0及以上。

 Java虚拟机：JDK1.7.0_79 

 数据库： MySql Server 5.1或以上版本，字符集为UTF-8。

 IAAS：采用vSphere管理软件或者独立的虚拟化管理软件。

##3	部署拓扑和规划
###3.1	平台部署拓扑

<div class="img-center">
![](/cloudui/app/documentation/images/image004.gif)
<p>图3.1-1 部署拓扑图</p >
</div>

Sm@rtPAAS系统部署拓扑可参照上图，也可以根据实际生产情况，调整部署方式。
 
###3.2	硬件规划

<table class="table table-bordered table-striped">
	<tr>
		<th>资源名称</th>
		<th>操作系统</th>
		<th>设备要求*数量</th>
		<th>备注</th>
	</tr>
    <tr>
        <td>ngnix</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（4C/8G）*1</td>
		<td>ngnix</td>
	</tr>
	<tr>
		<td>云负载、云路由</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（8C/16G）*1</td>
		<td>Loadbalance,router，agent</td>
	</tr>
	<tr>
		<td>云流水</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（8C/16G）*1</td>
		<td>Elasticsearch,index</td>
	</tr>
	<tr>
		<td>云管理</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（8C/16G）*1</td>
		<td>Master,svn,adapter,cloudui,mom,ci</td>
	</tr>
	<tr>
		<td>云监控</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（8C/16G）*1</td>
		<td>Monitor</td>
	</tr>
	<tr>
		<td>代码仓库</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（8C/16G）*1</td>
		<td>svn,jenkins</td>
	</tr>
	<tr>
		<td>镜像仓库</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（8C/16G）*1</td>
		<td>Docker repository</td>
	</tr>
	<tr>
		<td>应用资源池</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（8C/16G）*1</td>
		<td>Node</td>
	</tr>
	<tr>
		<td>数据库</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（8C/16G）*1</td>
		<td>Mysql</td>
	</tr>
	<tr>
		<td>非关系数据库</td>
		<td>CentOS7.2/Redhat 7.1</td>
		<td>X86（8C/16G）*1</td>
		<td>mongodb，redis</td>
    </tr>
</table>


表3.2-1 硬件配置规划

##4	基础环境安装
 注：Sm@rtPaas安装包放在tomcat容器中，cd /tomcat/bin 启动tomcat容器startup.sh 
在tomcat目录tomcat\webapps\centos下，首先执行脚本bash ip_sed.sh，然后修改configure.txt

 此配置文件要在部署paas之前修改。
 
 \#镜像仓库服务器IP地址
 
 registryip=10.126.3.163                                  （修改成安装镜像仓库服务器的ip）
 
 \#配置数据库数据存放目录
 
 mysql_datadir=/data                                       （修改成数据库存放的数据的目录，磁盘大的目录）
 
 搭建配置中心时需要先安装数据库，以下是配置中心连接数据库信息填写:
 
 \#配置中心数据库的ip
 
 serverip=10.126.3.161                                     （修改成配置中心数据库的地址）
 
 \#配置中心的数据库名
 
 dbname=configcenter                                        （修改成配置中心数据库名）
 
 \#配置中心数据库的用户名
 
 dbuser=root                                                （修改成配置中心数据库用户名）
 
 \#配置中心数据库的密码
 
 dbpasswd=mysql                                            （修改成配置中心数据库密码）
 
 \#安装node时需要在profile里添加配置中心信息，请完善一下配置中心的信息
 
 ConfigHost=10.126.3.161                                   （修改成安装配置中心的地址）
 
 ConfigPort=9000                                             
 
 ConfigUser1=paas                                           （修改成安装配置中心的用户名）
 
 ConfigPassword1=aaa111                                     （修改成安装配置中心的密码）
 
 ha_ConfigUser=paas2
 
 ha_ConfigPassword=aaa111
 
 \#mysql集群配置填写
 
 master_ip=
 
 slave_ip=
 
 \#填写一个与mysql服务器在同一网段但是没有被占用的IP地址作为mysql集群中keepalive的虚拟IP
 
 virtualip=
 
 \#填写一个与nginx服务器在同一网段但是没有被占用的IP地址作为nginx集群中keepalive的虚拟IP
 
 nginxVip=
 
 \#安装redis机器的ip
 
redisip=10.126.3.163                                        （修改成安装redis的地址）

\#安装etcd容器的名称

etcdName=etcd                                                （安装etcd的容器的名称）

\#安装etcd的机器的url地址

etcdIp=10.1.108.132                                          （安装etcd的机器的ip）

\#安装etcd的配置，如"etcd=http://127.0.0.1:2380"

etcdClusterList=                                              (安装etcd的配置)

###4.1	时间同步服务器的配置

注：选择一台持续集成服务器部署时钟同步服务端（ntpd），在其它服务器上配置时钟同步客户端。

1、	Ntp服务端配置：（首先确认要安装的这台机器的时间是否正确，用sudo date -s time，设置时间）

修改ntp配置文件(sudo vi /etc/ntp.conf)，将该文件中原有的server项全部注释掉，添加如下内容，标红的要修改成宿主机的实际网段地址：

server 127.127.1.0 stratum 5

restrict 10.31.23.0 mask 255.255.255.0 notrap nomodify

然后重新启动ntpd服务：
		
	test@localhost:~$ sudo service ntpd restart

2、	Ntp客户端配置：

执行sudo ntpdate -v IP命令验证是否可以正常同步时间，IP为ntp服务器的IP地址。

如能正常同步，则增加一条定时任务，执行sudo crontab -e ，编辑添加如下行：

0 * * * * /usr/sbin/ntpdate IP >> /var/log/ntpdate.log

（IP为ntp服务器的ip地址）
保存即可。如上任务表示每小时与ntp服务器进行一次时间同步。

###4.2	mysql的安装

注：用root用户安装mysql

	在安装mysql的服务器上执行如下命令，ip修改成安装包服务器的ip

	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/mysql_install-master.sh && bash mysql_install-master.sh

###4.3	MongoDB安装

	在安装mongodb的服务器上执行如下命令，ip修改成安装包服务器的ip

	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/mongodb_install.sh && source mongodb_install.sh

###4.4	Redis安装

	在安装redis的服务器上执行如下命令，ip修改成安装包服务器的ip

	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/redis_install.sh && source redis_install.sh

###4.5	svn代码仓库安装

	在安装SVN代码库的服务器上执行如下命令，ip修改成安装包服务器的ip

	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/subversion_install.sh && bash subversion_install.sh

##5	PAAS平台的安装部署	
###5.1	配置中心安装
####5.1.1	执行数据库脚本
	在安装mysql的服务器上执行如下命令，ip修改成安装包服务器的ip

	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/database_install.sh.sh && bash database_install.sh.sh

####5.1.2	执行安装配置中心脚本

	在安装配置中心的服务器上执行如下命令，ip修改成安装包服务器的ip

	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/configcenter_install.sh && source configcenter_install.sh

####5.1.3	验证安装成功

	登录配置中心地址http://127.0.0.1:9000/configcenter （ip修改成实际的搭建配置中心的虚拟机ip）


###5.2	镜像仓库安装


	在安装镜像仓库的服务器上执行如下命令，ip修改成安装包服务器的ip

	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/registry_basic_install.sh && bash registry_basic_install.sh

###5.3	Jenkins安装

	在安装jenkins的服务器上执行如下命令，ip修改成安装包服务器的ip

	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/jenkins_install.sh && source jenkins_install.sh

###5.4	安装Sm@rtPaas
####5.4.1	通过配置中心修改paas配置

	1.登录配置中心，注册一个配置中心的账号。角色要选测试人员。
	
<div class="img-center">
	![](/cloudui/app/documentation/images/image005.png)
</div>

	2.用注册的用户登录配置中心，选择常用配置master

<div class="img-center">
	![](/cloudui/app/documentation/images/image007.png)
</div>
	
依据环境清单修改配置:
	
键：oneLevelIps  值：127.0.0.1                           (将ip修改成实际搭建云路由的ip地址)

键：mongo.addresses   值：127.0.0.1:27017                (将ip修改成实际搭建mongodb的ip地址)

键：redis.ip     值：127.0.0.1                           (将ip修改成实际搭建redis的ip地址)

键：monitorUrl   值：http://127.0.0.1:5088/monitor/ws   (将ip修改成实际搭建云监控的ip地址)

键：jdbc.url     值：jdbc:mysql://127.0.0.1:3306/paas?useUnicode=true&characterEncoding=UTF-8                         
	
(将ip修改成实际搭建mysql的地址，数据库修改成实际的paas数据库名)
	
键：momip        值：127.0.0.1                            (将ip修改成实际搭建mom的ip地址) 

	3.选择常用配置router,依据环境清单修改配置:
	
<div class="img-center">
 ![](/cloudui/app/documentation/images/image009.png)
</div>
 
键：masterRest    值：http://127.0.0.1:5011/master/ws  （将ip修改成实际搭建master的ip地址）

	4.选择常用配置svn,依据环境清单修改配置:
	
<div class="img-center">
 ![](/cloudui/app/documentation/images/image011.png)
</div>
 
键：imageRegistryHost.ip     值：127.0.0.1             (将ip修改成安装镜像仓库主机ip)

键：imageRegistryHost.user     值：root              (将配置修改成实际安装镜像仓库主机用户名)

键：imageRegistryHost.password    值：root              (将密码修改成实际的安装镜像仓库主机密码)

键：imageRegistryHost.remoteScriptLocation     值：home/test/registryScript       (修改成实际的安装镜像仓库脚本存放位置)

	5.选择常用配置adapter,依据环境清单修改配置:
<div class="img-center">
 ![](/cloudui/app/documentation/images/image013.png)
 </div>
 
键：paas.mom.in       值：tcp:// 127.0.0.1:4141?NodeService.out

（将ip修改成实际搭建mom的ip地址）

键：paas.mom.out      值：tcp:// 127.0.0.1:4141?NodeService.in

(将ip修改成实际搭建mom的ip地址)

键：paas.mom.topic    值：tcp:// 127.0.0.1:4141?nodeparams 

(将ip修改成实际搭建mom的ip地址)

键：etcd.address      值：127.0.0.1          (将ip修改成实际搭建etcd的ip地址)

	6.选择常用配置node,依据环境清单修改配置:
	
<div class="img-center">
 ![](/cloudui/app/documentation/images/image015.png)
 </div>
 
键：localDockerVolumeDirN     值：/home/test/volume   (将此地址修改成实际要映射到宿主机的目录，用来存放应用的日志，选择磁盘大且有创建目录权限的路径)

键：adapterRestN     值：http://127.0.0.1:5011/Adapter/ws   (将ip修改成实际安装云管理的ip)

	7.选择常用配置cloudui,依据环境清单修改配置:
	
<div class="img-center">
 ![](/cloudui/app/documentation/images/image017.png)
</div>
 
键:monitorBasePath   值：http://127.0.0.1:9080   
(将ip修改成实际搭建云监控ip)

键: shell.address值：wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/{os_version}/nodeovs_install.sh && source nodeovs_install.sh   
(将ip修改成实际放置Smart@paas安装脚本服务器的ip)

	8.选择常用配置monitor,依据环境清单修改配置:
	
<div class="img-center">
 ![](/cloudui/app/documentation/images/image019.png)
 </div>
 
键：monitorjdbc_url  值： 
jdbc:mysql://127.0.0.1:3306/paas?useUnicode=true&characterEncoding=UTF-8&useOldAliasMetadataBehavior=true 

（将ip修改成实际搭建mysql的地址，数据库修改成实际的paas数据库名）

键：masterRest        值：http://127.0.0.1:5091/masterl/ws  (将ip修改成实际搭建云管理的ip)

键：adapterRest       值：http://127.0.0.1:5011/Adapter/ws  (将ip修改成实际搭建云管理的ip)

键：mongodb.ip        值：127.0.0.1 
(将ip修改成实际搭建mongodb的ip)

键：elk.ip            值：127.0.0.1 
(将ip修改成实际搭建云流水的ip)

	9.选择常用配置ci,依据环境清单修改配置:
	
<div class="img-center">
 ![](/cloudui/app/documentation/images/image021.png)
 </div>
 
键：jenkinsHost       值：http://127.0.0.1:8080     (将此ip修改成实际搭建jenkins的ip)

####5.4.2	执行安装云管理的脚本

	在安装云管理的服务器上执行如下命令，ip修改成部署包服务器的ip
 
	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/manager_install1.sh && source manager_install1.sh

####5.4.3	执行安装云负载、云路由的脚本

	在安装云负载、云路由的服务器上执行如下命令，ip修改成安装包服务器的ip
 
wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/routerovs_install1.sh && source routerovs_install1.sh

####5.4.4	执行安装云流水的脚本
 
	在安装云流水的服务器上执行如下命令，ip修改成安装包服务器的ip
 
	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/journal_install1.sh && source journal_install1.sh

###5.5	安装Sm@rtNode
####5.5.1	Node安装

 在搭建好paas后。点击新建集群，点击添加主机，在安装node的机器上执行节点安装的命令
 
 <div class="img-center">
  ![](/cloudui/app/documentation/images/image023.png)
  </div>
 
####5.5.2	检查是否安装成功

	在安装路径下cd All_In_One/bin 下，查看日志是否报错 
 
	tail  -f  nodeLog.log

###5.6	安装Sm@rtMonitor
####5.6.1	Sm@rtMonitor安装

	在安装云监控的服务器上执行如下命令，ip修改成安装包服务器的ip
 
	wget -N -nH --cut-dirs=1 http://127.0.0.1:8080/centos/monitor_install.sh && source monitor_install.sh

####5.6.2	检查是否安装成功

	在安装路径下cd monitor/MonitorProbe/bin 下，查看日志是否报错 
 
	tail  -f  monitor.log

