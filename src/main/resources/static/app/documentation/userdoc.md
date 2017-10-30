#用户使用手册

##1 系统登录

在浏览器地址栏中输入：[http://10.126.3.163:5085/cloudui/index.html](http://10.126.3.163:5085/cloudui/index.html)（此url中的ip地址为cloudui应用所在的地址）将展现如下登录界面，输入用户名、密码，点击“登录”按钮，进入。

<div class="img-center">
![](/cloudui/app/documentation/images/image002.png)
<p>图1.1-1 登录界面</p>
</div>

登录成功之后的总览界面显示如下：

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image003.jpg)
<p>图1.1-2 系统总览页面</p>
</div>

##2 IAAS接入管理
平台可以支持IAAS方式接入虚拟机的方式。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image004.jpg)
</div>
 
###2.1 IAAS接入
“IAAS接入管理”-->“IAAS接入”。完善页面列出的信息，点击“接入”按钮。接入成功之后就会在“IAAS接入管理”的列表中看到相应信息。

<div class="img-center"> 
![](/cloudui/app/documentation/images/userdoc/image005.jpg)
</div>

###2.2 IAAS删除
“IAAS接入管理”--> “选中列表中的记录”-->“IAAS删除”。
##3 权限管理
只有使用管理员的身份登录之后，才可以在左侧看到“权限管理”的菜单，进行权限管理的操作。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image006.jpg)
</div>

除管理员之外的其他角色的用户登录之后是看不到“权限管理”的菜单的。

管理员可以在“权限管理”中进行用户管理、角色管理、菜单管理。如下图所示。

<div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image007.jpg)
 </div>
 
###3.1 用户管理
“权限管理”->“用户管理”，点击“创建用户”，目前管理员创建的用户默认都是运维人员角色。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image008.jpg)
</div> 
                       
###3.2 角色管理
“权限管理”->“角色管理”，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image009.jpg)
</div>
 
点击“新建角色”按钮，输入角色名称，点击确定按钮之后即可创建一个新的角色。

点击“删除”按钮，会有判断，如果已经有用户关联了该角色则不可删除该角色，如果没有用户是该角色则可以删除。

点击“查看权限”按钮，可以为不同的角色设置不同的访问权限，不勾选的权限菜单名称是不能被对应的角色访问的。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image010.jpg)
</div>

###3.3 菜单管理
“权限管理”->“菜单管理”，在菜单管理中可以对页面左侧菜单进行新建、编辑、删除等一系列的操作。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image011.jpg)
</div>
                 
##4 集群管理
###4.1 新建/删除集群
“集群管理”->“新建集群”。新建集群的时候可以选择两种方式：第一种是直接完成，这样的话页面上只有一个已创建的集群名称；第二种是完成并添加主机，这种方式是创建完集群之后直接跳转到添加主机的页面（添加主机部分的操作在下一小节介绍）。

集群创建完成之后会显示在集群列表中。
 
 <div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image012.jpg)
 </div>
 
“集群管理”->“删除集群”。通过“删除集群”可以删除已添加的集群信息。
###4.2 添加主机
“集群管理”->“添加主机”。

点击添加主机按钮的时候，首先需要选择以哪种方式添加主机，“主机模式”或者是“IAAS模式”。

<div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image013.jpg)
 </div>
 
如果选择“IAAS模式”，那么会从IAAS接入列表中的主机中进行选择添加；

如果选择“主机模式”，那么首先需要选择机器的操作系统类型。
 
 <div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image014.jpg)
 </div>
 
选择完操作系统的类型之后，会跳转到完善主机信息的页面，需要填写“主机名称”和“主机IP”。还可以根据需要填写“主机标签”。信息填写完成之后，需要登录到机器上执行“节点安装命令”（即页面上红色部分显示的命令）进行节点安装。安装完成之后就会在该集群中查看到已添加的主机信息。
 
 <div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image015.jpg)
 </div>
 
###4.3 查看集群
“集群管理”->“查看集群”-->“主机列表”。已添加的主机可在主机列表中查看到如下图所示。  

<div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image016.jpg)
 </div>
 
当主机上没有已部署的应用时，可以选中主机列表中主机的记录，点击“删除主机”，即可删除该主机的信息。

点击主机的名称，可以查看详细的主机信息，以及主机的CPU使用率、内存使用量、磁盘吞吐量、网络带宽等监控信息。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image017.jpg)
</div>

“集群管理”->“查看集群”-->“集群监控”。集群监控中可以看到这个集群的监控信息，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image018.jpg)
</div>

“集群管理”->“查看集群”-->“用户列表”。可以为当前的运维人员用户创建自己集群中的开发测试角色的用户。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image019.jpg)
</div>
 
新建用户的时候可以选择新建用户或者添加已有用户。
新建用户即新建一个用户，该用户仅可使用当前的集群进行应用管理的操作；添加已有用户是指当前运维人员有多个可用的集群，在其他集群中已经创建了某个开发测试角色的用户，但是也想让这个开发测试人员使用当前集群，那么将那个用户作为已有用户添加进来即可。
##5 应用管理
###5.1 创建应用
“应用管理”-->“创建应用”，根据页面提示填写创建应用所需的信息，点击“创建应用”按钮。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image020.jpg)
</div>
 
创建应用的页面有个“高级设置选项”，点击即可展开，在高级设置中，可以设置关联的应用、外部网络、实例配额、环境变量、日志目录（输入应用日志的打印目录以便应用日志查询时使用）、挂载点（可指定宿主机路径和容器内路径相互映射）等信息。如下图所示。

<div class="img-center"> 
 ![](/cloudui/app/documentation/images/userdoc/image021.jpg)
 </div>
 
创建成功的应用可以在应用列表中查看到，刚刚创建成功的应用状态为“FREE”如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image022.jpg)
</div>
 
###5.2 应用部署
对于“FREE”状态的应用，可以进行部署操作，在应用列表中，点击对应应用的“查看”按钮，就可以进入应用详情的页面，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image023.jpg)
</div>
 
点击“部署”按钮，就可以对应用进行部署操作。创建应用时填写的实例数是几个就会部署几个实例。部署完成之后，应用的状态会显示为“DEPLOYED”，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image024.jpg)
</div> 
    
点击“实例”标签页，也可以看到该应用中的实例也都是“DEPLOYED”状态。

<div class="img-center"> 
![](/cloudui/app/documentation/images/userdoc/image025.jpg)
</div>

###5.3 应用启动
已部署的应用，可以点击启动按钮，启动成功之后，应用的状态会显示为“RUNNING”，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image026.jpg)
</div>

点击“实例”标签页，也可以看到该应用对应的实例状态也都是“RUNNING”，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image027.jpg)
</div> 

###5.4 应用停止
对于“RUNNING”状态的应用，可以点击“停止”按钮，对应用进行停止。停止操作成功之后，应用的状态会变成“DEPLOYED”。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image028.jpg)
</div>
 
点击“实例”标签页，也可以看到该应用中的实例的状态也都是“DEPLOYED”，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image029.jpg)
</div>
 
###5.5 应用卸载
对于“DEPLOYED”状态的应用，可以点击“卸载”按钮进行卸载。卸载成功之后，应用的状态会显示成“FREE”，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image030.jpg)
</div>

点击“实例”标签页，会看到卸载之后得应用不再有实例信息。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image031.jpg)
</div>
 
###5.6 应用更新
点击“更新”按钮可以更新应用版本，更新时可以修改镜像版本、应用端口等信息，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image032.jpg)
</div>
 
应用版本更新成功之后，在应用详情中的标签页中可以看到应用的多个版本展示，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image033.jpg)
</div>
 
###5.7 应用维护实例数   
维护应用实例数的前提是，应用的状态必须是“RUNNING”，非running状态的应用不允许维护实例数的操作。页面会有提示，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image034.jpg)
</div>

####5.7.1 单一版本维护实例数
对于只有一个版本的应用，维护实例数的时候，点击“维护”按钮，根据需要输入想要保持的最终实例数即可（此处填写的是最终实例数的个数，不是想要增加或者减少的增量数值），如下图所示，维护操作成功结束之后，该应用中将会有3个实例。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image035.jpg)
</div> 

####5.7.2 多个版本维护实例数
对于存在多个版本的应用，进行维护实例数的操作的时候，需要分别填写各个版本所需要维护的实例数，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image036.jpg)
</div>

###5.8 应用升级/回退/灰度发布
####5.8.1 应用升级/回退
当应用存在多个版本的时候，可以点击“升级/回退”按钮，完成版本的升级或者回退。如下图所示，升级之前V255版本上有两个实例，V277版本上没有实例，进行升级/回退操作的时候，在V277版本处填写2，那么V255版本中的实例数会自动变成0。这样就能够实现该应用的全部实例由原有版本升级到新版本。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image037.jpg)
</div>
  
与升级操作同理，应用回退也是实现的应用的全部实例由新版本会退到原有版本的过程，其实也可以理解为应用全部实例在不同版本之间的切换。上述升级过程是有V255版本切换到了V277版本，那么回退的时候就可以由V277再变成V255版本，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image038.jpg)
</div>
 
####5.8.2 应用灰度发布
 应用的灰度发布可以理解为应用的多个版本并存，也就是升级/回退的时候，不是全部实例都升级或者回退到了另一个版本，而是部分实例的版本更新了，还有一部分原有实例仍然是旧版本，如下图所示。

<div class="img-center"> 
 ![](/cloudui/app/documentation/images/userdoc/image039.jpg)
 </div>
 
 操作成功之后，可以在应用的版本列表中看到，每一个版本中都有版本实例存在，这样就实现了应用的灰度发布，如下图所示。
 
 <div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image040.jpg)
 </div>
 
###5.9 应用监控
 “应用管理”-->“应用详情”-->“监控”标签页。可以查看应用的监控数据，比如CPU使用率、内存使用率、平均响应时间、任务队列（应用正在进行的实例操作队列）、历史记录等信息，如下两图所示。
 
 <div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image041.jpg)
 ![](/cloudui/app/documentation/images/userdoc/image042.jpg)
 </div>
 
###5.10  应用日志
 “应用管理”-->“应用详情”-->“日志”标签页。可根据查询条件查看应用日志。查询到的多条日志分页显示，可分页查看。如下图所示。

 <div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image043.jpg)
</div>
 
###5.11  应用控制台
“应用管理”-->“应用详情”-->“控制台”标签页。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image044.jpg)
 </div>
 
点击“登录”按钮，会弹出连接shell的页面，如下图所示。

<div class="img-center"> 
 ![](/cloudui/app/documentation/images/userdoc/image045.jpg)
 </div>
 
右侧五角星的标志是书签按钮，点击“书签”，会展示出可登录的实例名称。如下图所示。

<div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image046.jpg)
 </div>
 
选中其中一个实例，输入用户名、密码即可登录shell控制台。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image047.jpg)
</div>
 
###5.12  应用负载
####5.12.1  一级负载
“应用管理”-->“应用详情”-->“负载”标签页。点击“创建策略”按钮，如下图所示。

<div class="img-center"> 
 ![](/cloudui/app/documentation/images/userdoc/image048.jpg)
 </div>
 
“通道（是否对外发布）”选项选择“是”代表的是一级负载策略。负载策略可以选择轮询、优先权重、会话保持等策略。点击“添加端口映射”按钮配置负载：端口即为访问应用对外暴露的端口；协议可以选择https、http以及tcp类型；上下文即为应用访问的上下文；双向认证勾选即为是，不勾选即为否；默认目标端口即为应用本身启动的访问端口。填写完信息之后，点击“创建”按钮即可。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image049.jpg)
 </div>
 
负载策略添加完成之后，还可以点击“更新负载”对其进行更新，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image050.jpg)
</div>
 
####5.12.2  二级负载
  “应用管理”-->“应用详情”-->“负载”标签页。点击“创建策略”按钮，“通道（是否对外发布）”选项选择“否”代表的是二级负载策略。
  二级负载是为应用的多个实例之间提供的一种负载策略，所以只有当应用的实例数大于等于2的时候，擦可以添加二级负载策略。
  
  负载均衡器的名称可以自定义填写。如下图所示。

<div class="img-center">  
  ![](/cloudui/app/documentation/images/userdoc/image051.jpg)
</div>

###5.13  应用端口
 “应用管理”-->“应用详情”-->“端口”标签页。添加完一级负载策略之后，会将策略中的端口映射出来，如下图所示。

 <div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image052.jpg)
 </div>
 
 并且通过负载策略映射的端口不可删除。删除的时候会有提示。
 
 <div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image053.png)
 </div>
 
 点击“查看”按钮可以查看端口映射的详细信息，如下图所示。

 <div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image054.jpg)
 </div>
 
另外还可以手动“添加端口映射”。手动添加完成之后，点击“创建”按钮即可。手动添加的端口也可以手动删除。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image055.jpg)
</div>
 
###5.14  外部网络
 “应用管理”-->“应用详情”-->“外部网络”标签页。可以通过添加外部网络IP地址信息，为应用提供容器内部到外部某个IP地址的访问。填写的时候端口是选填项，可以不填写。填写端口的时候只可以访问该IP所在机器的该端口，不填写端口的时候可以访问整个IP。添加外部网络页面如下图所示。

 <div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image056.jpg)
</div>
 
###5.15  伸缩策略
 “应用管理”-->“应用详情”-->“伸缩策略”标签页。应用进行自动伸缩分为“计划模式”和“自动模式”。想要伸缩策略生效的话，必须勾选“自动伸缩”右侧的方框，勾选之后才表示伸缩已开启，取消勾选即为伸缩关闭。如下图所示。
 
 <div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image057.jpg)
 </div>
 
设置“计划模式”策略时页面如下图所示。 “默认值”表示的是一旦伸缩开始该应用需要保持的实例个数；点击“添加计划”按钮即可配置某一时间段内期望的实例个数。那么在伸缩开启之后，计划时间段内会维持计划数，非计划时间段内会保持默认值。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image058.jpg)
 </div>
 
设置“自动模式”策略时页面如下图所示。点击“添加指标”按钮，可以选择“CPU使用率”和“实例最大最小值”这两个维度进行配置。下图中的策略设置表示CPU使用率达到80%开始扩展实例数、达到20%开始收缩实例数，实例数达到8停止扩展实例数、达到2停止收缩实例数。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image059.jpg)
 </div>
 
 上面是分别对两种伸缩模式进行了配置，至于具体是哪一种策略生效，还需要在模式选择中进行选择。如下图所示。

 <div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image060.png) 
 </div>
 
 然后点击“保存”按钮，就会开启已选择的伸缩模式。
##6 应用模板
###6.1 导出应用模板
“应用管理”-->“选中要导出模板的应用”-->“导出应用模板”。就会导出一个应用模板的txt文本。

如果是一个没有依赖关系的应用，那么直接选中该应用直接导出即可。如果是又互相关联的多个应用则需要同时选中彼此依赖的多个应用，再导出模板。

###6.2 新建编排
“应用模板”-->“新建编排”。自定义填写模板名称及模板描述，将导出好的模板复制粘贴到模板编排的空白处，点击“创建模板”即可。页面如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image061.jpg)
 </div>
 
创建成功之后，就会在模板资源列表中看到创建好的模板。页面如下图所示。
 
 <div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image062.jpg)
 </div>
 
点击“查看”按钮，可以查看应用模板的详情信息，页面如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image063.jpg)
</div>
 
###6.3 模板部署
“应用模板”-->“部署”。就会根据应用模板进行应用的部署操作了。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image064.jpg)
 </div>
 
部署完成之后，会自动跳转到“已部署模板”标签页，已部署模板的名称是根据“模板名称_随机字符串”生成，且按照时间倒序展示在页面上。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image065.jpg)
 </div>
 
部署成功之后，部署好的应用也可以在应用列表中查看到，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image066.jpg)
</div>
 
###6.4 已部署模板的启动/卸载
“应用模板”-->“已部署模板”-->“启动”。就会启动通过模板部署好的应用，启动成功之后，应用的状态就会变成running并进行访问。

还可以点击“已部署模板”中的停止卸载等按钮操作通过模板部署的应用。
##7 镜像仓库
###7.1 私有/公共镜像仓库
私有镜像仓库：私有镜像仓库中的镜像只能由当前用户使用，其他用户没有权限；

平台公共镜像仓库：公共镜像仓库中的镜像可以提供给任意用户使用；每个用户也可以将一些好用的镜像推送到公共仓库中与大家分享。
###7.2 创建镜像
“镜像仓库”-->“创建镜像”，在弹出的页面中完善镜像信息，然后点击“创建”按钮即可。

说明：

1.创建镜像的前提是镜像仓库中已经存在该镜像（至于如何将镜像推到仓库中，可参考镜像推送工具使用说明）；

2.仓库地址在下拉框中选择即可（可以选择私有仓库或者公有仓库）；

3.选择好仓库地址之后，点击镜像名称的下拉框，就会展示出该仓库中现有的所有镜像名称；

4.自定义填写镜像描述；

5.镜像名称选好之后，该镜像的所有版本都会在版本下拉框中展示；

6.自定义填写版本描述；

7.启动探测端口：即为应用镜像中设置好的应用启动时的端口；

8.启动脚本位置：其实需要填写启动命令；

9.部署、启动、停止、卸载的超时时间可根据实际情况进行填写；

<div class="img-center"> 
 ![](/cloudui/app/documentation/images/userdoc/image067.jpg)
 </div>
 
###7.3 镜像详情
在镜像仓库列表中，点击镜像名称，会跳转到镜像详情页面，该页面展示的是镜像概述和版本列表。镜像概述就是创建镜像时用户自定义填写的内容。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image068.jpg)
 </div>
 
点击“版本列表”，可以查看镜像的版本详情。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image069.jpg)
 </div>
 
点击“编辑”按钮，可以修改的镜像信息如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image070.jpg) 
</div>

点击“删除”按钮可以删除镜像的某个版本。
##8 持续集成
###8.1 创建任务
“持续集成”-->“创建任务”。job名称可自定义填写、远程仓库类型可以选择svn或者git、远程仓库地址即为代码在配置库中的地址、构建命令根据实际填写、自定义参数可根据实际需要进行填写、另外还需要填写登录SVN的用户名密码。页面如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image071.jpg)
</div> 

###8.2 触发build
创建成功的任务会显示在任务列表中，点击“查看”按钮可查看该任务的详细信息。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image072.jpg) 
</div>

点击“触发build”按钮可以触发build操作。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image073.jpg)
</div>

###8.3 查看build
每一次触发build操作都会对应一条build记录。点击“查看build”按钮可以查看build的详细记录。build成功会在结果中显示为“SUCCESS”,build失败会在结果中显示“FAILURE”。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image074.jpg) 
</div>

点击查看日志，可以查看每一次build的详细日志。build成功后可在日志中查看生成的镜像名称及标签信息。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image075.jpg) 
</div>

##9 监控告警
###9.1 告警策略
“监控告警”-->“策略列表”标签页-->“创建策略”。创建告警策略时，页面会弹出选择框，分为应用告警和主机告警两种情况。

<div class="img-center"> 
 ![](/cloudui/app/documentation/images/userdoc/image076.jpg)
 </div>
 
 创建好的告警策略可以在策略列表中进行查看，如下图所示。

 <div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image077.jpg)
</div>
 
####9.1.1 应用告警
资源类型选择“应用”，即可为应用创建告警策略。页面如下图所示。

<div class="img-center"> 
 ![](/cloudui/app/documentation/images/userdoc/image078.jpg)
 </div>
 
策略名称：自定义填写；

资源列表：在下拉框中选择应用；

监控周期：根据需求填写；

监控规则：根据应用的实际情况进行选择和设置，可同时设置多条规则；

告警通知人：点击输入框会自动展示出已经创建的告警通知人（参考9.2小节），根据需要选择即可；
####9.1.2 主机告警
资源类型选择“主机”，即可为集群中的主机创建告警策略。页面如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image079.jpg)
 </div>
 
策略名称：自定义填写；

资源列表：在下拉框中选择集群中的合主机名称；

监控周期：根据需求填写；

监控规则：根据应用的实际情况进行选择和设置，可同时设置多条规则；

告警通知人：点击输入框会自动展示出已经创建的告警通知人（参考9.2小节），根据需要选择即可；
####9.1.3 主机告警
资源类型选择“平台组件”，即可为平台组件创建告警策略。页面如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image080.jpg)
 </div>
 
策略名称：自定义填写；

资源列表：在下拉框中选择要监控的平台组件对应的主机名称；

监控周期：根据需求填写；

监控规则：根据应用的实际情况进行选择和设置，可同时设置多条规则；

告警通知人：点击输入框会自动展示出已经创建的告警通知人（参考9.2小节），根据需要选择即可；

###9.2 告警通知人
“监控告警”-->“告警通知人”标签页-->“创建通知人”。通知类型可以选择“email”或者“message”两种方式。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image081.jpg)
 </div>
 
通知人创建成功之后，可以在告警通知人列表中查看到记录。如下图所示。

<div class="img-center"> 
 ![](/cloudui/app/documentation/images/userdoc/image082.jpg)
 </div>
 
##10 平台组件监控
在“平台组件监控”模块中可以进行平台组件配置和平台组件监控。

备注：要想对平台组件进行监控，那么平台各组件所在的机器上均需安装probe组件。
###10.1  平台组件配置
“平台组件监控”-->“平台组件配置”，如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image083.jpg)
 </div>
 
点击“添加主机”按钮，可以添加想要监控的平台模块所在的主机信息。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image084.jpg)
</div>
 
名称：可以自定义填写；

IP：按照实际中平台模块所属的主机实际IP进行填写；

端口：目前探测平台组件的probe模块使用的探测端口是65534，所以暂时均填写65534即可。

###10.2  平台组件监控
 “平台组件监控”-->“平台组件监控”，如下图所示。可以监控在告警策略中添加的平台组件所在主机上的组件状态。
 
 <div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image085.jpg)
 </div>
 
##11 配置中心
此处的配置中心可以理解为平台为其上的应用提供的获取各自特殊配置的一个功能。
###11.1  新建配置
“配置中心”——>“新建配置”。页面如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image086.jpg)
 </div>
 
创建成功之后，可以在配置列表中查看到。该列表中展示的顺序是按照应用的首字母排序的。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image087.jpg)
</div>

###11.2  查看配置
“配置中心”——>“查看”按钮。可以查看配置的详细信息。如下图所示。

<div class="img-center">
![](/cloudui/app/documentation/images/userdoc/image088.jpg)
 </div>
 
点击“下发”按钮即可将配置下发给应用。

点击“导入”按钮，可以填写配置的具体值，“确定”即可。如下图所示。
 
 <div class="img-center">
 ![](/cloudui/app/documentation/images/userdoc/image089.jpg)
 </div>
 
配置信息的格式可参考如下：

	#备注1

	key1=value1

	#备注2

	key2=value2

点击“导出”按钮，可以将该应用该版本的当前配置导出到一个后缀名为“.properties”的文件中。
