

// 定义初始模块

var App = angular.module('app', [
    'ngRoute',
    'mControllers',
    'ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'tmh.dynamicLocale',
    'ui.utils'
]);



App.run(["$rootScope","$state", "$stateParams",  '$window', '$templateCache','$location','$http','$filter','$route',function ($rootScope, $state, $stateParams, $window, $templateCache,$location,$http,$filter,$route) {
 
	 
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$storage = $window.localStorage;

 
 // 定义全局作用域

  $rootScope.app = {
    name: '中国人寿实时计算平台',
    description: '中国人寿实时计算平台',
    layout: {
      isShadow: false,
      isCollapsed: false
    },
    viewAnimation: 'ng-fadeInUp'
  };

  
  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams) {

	  $rootScope.curPath=$location.path();

      $rootScope.isActive=function(item){

            if(!item) return;

            var foundActive=false;

            var sref=item.type?item.type:item.sref||item;
           
            if($rootScope.curPath.indexOf(sref)==-1)
            {
              foundActive=true;
            }
       
              return !foundActive;
      } 



          $rootScope.getMenuItemPropClasses = function(item) {
             
              if(item.policyChild){
                   return   ($rootScope.isActive(item) ? ' active' : '') ;
              }else{
                    return   ($rootScope.isActive(item) ? ' active single' : '') ;
              }
           
                  
          };

  });


 
  // 用户信息
  var userPromise=$http.post('/cloudui/ws/user/userInfo').
  success(function(data){
      $rootScope.user = data;
  })

  

  userPromise.then(function(resp){
 
      if(resp.data.roleId!=='1') // 应用管理员和开发测试人员
      {
        $rootScope.getEnv();

        // 获取某应用下的环境列表
         $http.get('/cloudui/ws/admins/findClusterList'+'?v='+(new Date().getTime())).
          success(function(data){
             $rootScope.envList=data;
             if($rootScope.app.envsession=='null')
             {
               $rootScope.setEnv($rootScope.envList[0].id,$rootScope.envList[0].name);
             }else{           
              $rootScope.app.choseenv=$filter('filter')($rootScope.envList,$rootScope.app.envsession.name)[0];   
             }
          })
      }else if(resp.data.roleId=='1'){ // 平台管理员 

          $rootScope.getApp();
          
          // 获取应用列表
          $http.get('/cloudui/ws/user/getAppListByUser'+'?v='+(new Date().getTime()),{
            params:{
            userName:resp.data.name
         }
        }).success(function(data){

            $rootScope.appList=data;
 
            if($rootScope.app.appsession=='null')
            {
               $rootScope.setApp($rootScope.appList[0].app_id,$rootScope.appList[0].app_name);
            }else{   

              for(var i=0;i<$rootScope.appList.length;i++)
              {
            	  if($rootScope.appList[i].app_name==$rootScope.app.appsession.appName){
            		  $rootScope.app.choseapp=$rootScope.appList[i];
            	  }
              }
              
            }
        })
      }
  })

 

  /* 环境session start */

   
  $rootScope.changeEnv=function(env){
      $rootScope.setEnv(env.id,env.name);
  }
 
  // 设置环境session

  $rootScope.setEnv=function(id,name){
    
     $rootScope.app.envsession={}
     $rootScope.app.envsession.name=name;
     $rootScope.app.envsession.id=id;
    
     $rootScope.app.choseenv=$filter('filter')($rootScope.envList,name)[0];

     $http.get('/cloudui/ws/user/setClusterSession'+'?v='+(new Date().getTime()),{
      params:{
         clusterId:id,
         clusterName:name
      }
     })
  }
  
 
  // 获取环境session 
  $rootScope.getEnv=function(){
    $http.get('/cloudui/ws/user/getClusterSession'+'?v='+(new Date().getTime()))
    .success(function(data){
         $rootScope.app.envsession=data; 
    })
  }

  /* 环境session end */

  /* 应用session start */

  $rootScope.changeApp=function(app){
      $rootScope.setApp(app.app_id,app.app_name);
  }
 
  // 设置应用session

  $rootScope.setApp=function(id,name,isload){
     $rootScope.app.appsession={}
     $rootScope.app.appsession.appName=name;
     $rootScope.app.appsession.id=id;

     if(!isload){

    	 var envStateArr=['app.env.nodes','app.env.service','app.env.monitor','app.env.user','app.nodesystem',
    	             'app.addnode','app.node','app.config_storm','app.serverDetail','app.deployComponent.monitor',
    	             'app.deployComponent.instance','app.deployComponent.log','app.deployComponent.scale'           
    	 ]
    	 var topologyStateArr=['app.topology_versionlist','app.resource_topo_version_detail','app.config_topology_version_detail']
    	 var sparkMonitor=['app.spark_monitor'];
    	 var curState=$rootScope.$state.current.name;
    	 
    	 if(curState){
    		 isEnv=$filter('filter')(envStateArr,curState);
        	 isTopo=$filter('filter')(topologyStateArr,curState);
        	 isSparkMonitor=$filter('filter')(sparkMonitor,curState);
        	 if(isEnv.length>0){
        		 $window.location.href='/cloudui/index.html#/appview/env_list';
        	 }else if(isTopo.length>0){
        		 $window.location.href='/cloudui/index.html#/topology_list';
        	 }else if(isSparkMonitor.length>0){
        		 $window.location.href='/cloudui/index.html#/spark_monitoring///';
        	 }else{
        		 $window.location.reload();
        	 }
    	 }

     }
     
     for(var i=0;i<$rootScope.appList.length;i++)
     {
    	 if($rootScope.appList[i].app_name==name){
    		 $rootScope.app.choseapp=$rootScope.appList[i];
    	 }
     }


     $http.get('/cloudui/ws/user/setAppSession'+'?v='+(new Date().getTime()),{
      params:{
         appId:id,
         appName:name
      }
     })
  }
  
 
  // 获取应用session 
  $rootScope.getApp=function(){
    $http.get('/cloudui/ws/user/getAppSession'+'?v='+(new Date().getTime()))
    .success(function(data){
         $rootScope.app.appsession=data; 
    })
  }

  /* 应用session end */
  

}]);




// 定义常量

App
  .constant('APP_COLORS', {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2'
  })
  .constant('APP_MEDIAQUERY', {
    'desktopLG':             1200,
    'desktop':                992,
    'tablet':                 768,
    'mobile':                 480
  })
  .constant('APP_REQUIRES', {
    scripts: {
      'icons': [ 'vendor/fontawesome/css/font-awesome.min.css',
                 'vendor/simple-line-icons/css/simple-line-icons.css' ],
      'modernizr': ['vendor/modernizr/modernizr.js'],
      'loaders.css':['vendor/loaders.css/loaders.css'],
      'spinkit': ['vendor/spinkit/css/spinkit.css'],
      'filestyle':['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
      'whirl':['vendor/whirl/dist/whirl.css'],
      'jquery':['vendor/highchart/jquery-3.2.1.min.js'],
      'highchart':['vendor/highchart/highcharts.js'],
      'highcharts-more':['vendor/highchart/highcharts-more.js'],
      'bootstrap-menu':['vendor/bootstrap-menu/bootstrap-submenu.min.css'
      ],
      'moment':['vendor/daterangepicker/moment.min.js'],
      'daterangepicker':[
          'vendor/daterangepicker/daterangepicker-bs3.css',
          'vendor/daterangepicker/daterangepicker.js'
      ],
      'timepicker':[
         'vendor/timepicker/timepicker.css',
         'vendor/timepicker/bootstrap-timepicker.min.js'
      ],
      'istevenMultiSelect':['vendor/isteven-multi-select/isteven-multi-select.css',
                            'vendor/isteven-multi-select/isteven-multi-select.js'],
      'parsley': ['vendor/parsleyjs/dist/parsley.min.js'],
      'codemirror':['vendor/codemirror/lib/codemirror.js',
                    'vendor/codemirror/lib/codemirror.css'],
	  'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
	                             'vendor/codemirror/mode/xml/xml.js',
	                             'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
	                             'vendor/codemirror/mode/css/css.js']                     
    },
    modules: [
      {
        name: 'ngDialog',                  
        files: ['vendor/ngDialog/js/ngDialog.min.js',
                'vendor/ngDialog/css/ngDialog.min.css',
                'vendor/ngDialog/css/ngDialog-theme-default.min.css'] 
      },
      {
       name: 'ui.codemirror',             
       files: ['vendor/angular-ui-codemirror/ui-codemirror.js']
      },
      {
       name: 'ui.bootstrap-slider',       
       files: [
         'vendor/slider/bootstrap-slider.min.js',
         'vendor/slider/bootstrap-slider.min.css',
         'vendor/slider/slider.js']
      },
      {
        name: 'localytics.directives',     
        files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                'vendor/chosen_v1.2.0/chosen.min.css',
                'vendor/angular-chosen-localytics/chosen.js']
      },
      {
        name: 'xeditable',                 
        files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                'vendor/angular-xeditable/dist/css/xeditable.css']
      },
      {
    	name: 'angularBootstrapNavTree',   
    	files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
             'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css'
    	]
      },
      {
        name: 'angularFileUpload',         
        files: ['vendor/angular-file-upload/angular-file-upload.js']
      }
    ]
  })
;


// 初始路由信息

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  
  $locationProvider.html5Mode(false);

  // 设置初始路由

  $urlRouterProvider.otherwise('/home');

  // 路由配置
    
  $stateProvider
    .state('app', {
        url: '/',
        abstract: true,
        cache:'false', 
        templateUrl: helper.basepath('app.html'+'?action='+(new Date().getTime())),
        controller: 'webCtrl',
        resolve: helper.resolveFor('icons','ngDialog','whirl','loaders.css')
    })
    /* 主页 */
    .state('app.home', {
        url: 'home',
        title: '主页',
        cache:'false', 
        templateUrl: helper.basepath('home.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('highchart','highcharts-more'),
        controller:'homeCtrl'
    })
    /* 应用视图 */
    .state('app.view', {
        url: 'appview',
        title: '应用视图',
        cache:'false', 
        templateUrl: helper.basepath('view.html'+'?action='+(new Date().getTime())),
        controller: 'viewCtrl'
    })
    /* 系统下的应用 */
    .state('app.view-app', {
        url: 'applist/:appname/:appid',
        title: '系统下的应用列表',
        cache:'false', 
        templateUrl: helper.basepath('view-applist.html'+'?action='+(new Date().getTime())),
        controller: 'viewApplist'
    })
    .state('app.view-subApps', {
        url: 'subApps/:appname/:appid',
        title: '成员系统管理',
        cache:'false',
        templateUrl: helper.basepath('view-subApps.html'+'?action='+(new Date().getTime())),
        controller: 'viewSubApps'
    })
    /* 环境搭建向导 */
    .state('app.env_guide', {
        url: 'appview/env_guide',
        title: '环境搭建向导',
        cache:'false', 
        templateUrl: helper.basepath('env_guide.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('parsley'),
        controller:'envGuideCtrl'
    })
    /* 环境列表 */
    .state('app.env_list', {
        url: 'appview/env_list',
        title: '环境列表',
        cache:'false', 
        templateUrl: helper.basepath('env_list.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('highchart','highcharts-more','parsley'),
        controller:'envListCtrl'
    })
    /* 环境详情 */
    .state('app.env', {
        url: 'appview/env/:clusterid',
        cache:'false', 
        abstract: true,
        templateUrl: helper.basepath('cluster.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('xeditable'),
        controller:"envDetailCtrl"
    })
    .state('app.env.nodes', {
        url: '/nodes',
        title: '主机列表',
        cache:'false', 
        controller:"nodesListCtrl",
        templateUrl: helper.basepath('nodeslist.html'+'?action='+(new Date().getTime()))
    })
    .state('app.env.service', {
        url: '/service',
        title: '服务列表',
        cache:'false', 
        controller:"serverListCtrl",
        templateUrl: helper.basepath('serverlist.html'+'?action='+(new Date().getTime()))
    })
    .state('app.env.monitor', {
        url: '/monitor',
        title: '环境监控',
        cache:'false', 
        controller:"envMonitorCtrl",
        resolve: helper.resolveFor(/*'jquery',*/'highchart','highcharts-more'),
        templateUrl: helper.basepath('cluster-monitoring.html'+'?action='+(new Date().getTime()))
    })
    .state('app.env.user', {
        url: '/user',
        title: '用户列表',
        cache:'false', 
        controller:"envUserCtrl",
        resolve: helper.resolveFor('localytics.directives'),
        templateUrl: helper.basepath('cluster-user.html'+'?action='+(new Date().getTime()))
    })
    /* 添加主机 */
    .state('app.nodesystem', {
        url: 'appview/:clustername/:clusterid/nodesystem',
        title: '操作系统',
        cache:'false', 
        controller:'nodesystemController',
        templateUrl: helper.basepath('nodesystem.html'+'?action='+(new Date().getTime()))
    })
    .state('app.addnode', {
        url: 'appview/:clustername/:clusterid/:os_version/addnode',
        title: '添加主机',
        cache:'false', 
        templateUrl: helper.basepath('addnode.html'+'?action='+(new Date().getTime())),
        controller:'addNode',
        resolve: helper.resolveFor('loaders.css')
    })
    /* 主机详情 */
    .state('app.node', {
        url: 'appview/:clusterid/node/:nodeid',
        title: '主机详情',
        cache:'false', 
        templateUrl: helper.basepath('node.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('xeditable',/*'jquery',*/'highchart','highcharts-more'),
        controller:"nodeController"
    })
    /* 服务配置 */
    .state('app.config_storm', {
    	url: 'appview/serverconfig',
        title: '服务配置',
        cache:'false', 
        templateUrl: helper.basepath('config_storm.html'+'?action='+(new Date().getTime())),
        controller:'configStorm',
        params:{args:{}}
    })
    /* 服务中的组件 */
    .state('app.serverDetail', {
        url: 'appview/:serverid',
        cache:'false', 
        templateUrl: helper.basepath('templatedeploydetail.html'+'?action='+(new Date().getTime())),
        controller:'componetByServerCtrl'
    })
    /* 服务中的组件详情 */
    .state('app.deployComponent', {
        url: 'appview/:appid',
        abstract: true,
        templateUrl: helper.basepath('appdetail.html'+'?action='+(new Date().getTime())),
        controller:"deployComponent"
    })
    .state('app.deployComponent.monitor', {
        url: '/monitor',
        cache:'false', 
        title: '监控',
        controller:"deployComponentMonitorCtrl",
        templateUrl: helper.basepath('app-monitoring.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('highchart','highcharts-more')
    })
    .state('app.deployComponent.instance', {
        url: '/instance',
        title: '实例',
        cache:'false', 
        controller:"appinstanceController",
        templateUrl: helper.basepath('app-instance.html'+'?action='+(new Date().getTime())),
    })
    .state('app.deployComponent.log', {
        url: '/applog',
        title: '日志',
        cache:'false', 
        controller:"applogController",
        resolve: helper.resolveFor('moment','daterangepicker'),
        templateUrl: helper.basepath('app-log.html'+'?action='+(new Date().getTime())),
    })
    .state('app.deployComponent.scale', {
        url: '/scale',
        title: '自动伸缩',
        cache:'false', 
        controller:'scaleController', 
        resolve: helper.resolveFor('timepicker'),
        templateUrl: helper.basepath('app-scale.html'+'?action='+(new Date().getTime())),
    })
    /* 添加服务介质 */
    .state('app.assembly_create', {
        url: 'assembly_create',
        title: '创建服务介质',
        cache:'false', 
        templateUrl: helper.basepath('assembly_create.html'+'?action='+(new Date().getTime())),
        controller:'assemblyCreateCtrl',
        resolve: helper.resolveFor('localytics.directives','ui.bootstrap-slider','bootstrap-menu','parsley','angularFileUpload','filestyle')
    })
    /* 服务介质列表 */
    .state('app.listassembly', {
        url: 'listassembly',
        title: '服务介质列表',
        cache:'false', 
        templateUrl: helper.basepath('listapps.html'+'?action='+(new Date().getTime())),
        controller:'assemblyListCtrl'
    })
    /* 服务介质版本列表 */
    .state('app.assembly_version', {
        url: ':assemblyid/assembly_version',
        title: '服务介质版本列表',
        controller:"assemblyVersionCtrl",
        templateUrl: helper.basepath('assembly-version.html'+'?action='+(new Date().getTime())),
        params:{args:{}}
    })
    /* 服务介质版本更新 */
    .state('app.assembly_update', {
        url: 'assembly_update/:id',
        title: '更新服务介质版本',
        cache:'false', 
        templateUrl: helper.basepath('assembly_update.html'+'?action='+(new Date().getTime())),
        controller:'assemblyUpdateCtrl',
        resolve: helper.resolveFor('localytics.directives','ui.bootstrap-slider','bootstrap-menu','parsley','angularFileUpload','filestyle')
    })
    /* 服务介质版本资源包 */
    .state('app.resource_component_version_detail', {
        url: ':id/assembly_resource/:resourceVesionId',
        title: '服务介质版本资源包',
        cache:'false', 
        templateUrl: helper.basepath('resource_version_detail.html'+'?action='+(new Date().getTime())),
        controller:'resourceVersionDetail'
    })
    /* 服务介质版本配置 */
    .state('app.config_component_version_detail', {
        url: ':id/assembly_config/:configVersionid',
        title: '配置版本详情',
        cache:'false', 
        templateUrl: helper.basepath('config_version_detail.html'+'?action='+(new Date().getTime())),
        controller:'configVersionDetail',
        resolve: helper.resolveFor('xeditable')
    })
    /* 创建服务编排 */
    .state('app.createtemplate', {
        url: 'template/create',
        title: '创建模板',
        cache:'false', 
        templateUrl: helper.basepath('createtemplate.html'+'?action='+(new Date().getTime())),
        controller:'createtemplate',
        resolve: helper.resolveFor('codemirror', 'ui.codemirror', 'codemirror-modes-web','localytics.directives')
    })
    /* 服务编排列表 */
    .state('app.template_list', {
        url: 'template_list',
        title: '编排模板列表',
        cache:'false', 
        templateUrl: helper.basepath('template_list.html'+'?action='+(new Date().getTime())),
        controller:'templateListCtrl'
    })
    /* 服务编排详情 */
    .state('app.templatedetail', {
        url: 'template/:templateid',
        title: '模板详情',
        cache:'false', 
        templateUrl: helper.basepath('templatedetail.html'+'?action='+(new Date().getTime())),
        controller:'templateDetailCtrl',
        resolve: helper.resolveFor('codemirror', 'ui.codemirror', 'codemirror-modes-web')
    })
    /* 服务编排配置 */
    .state('app.config_template', {
        url: ':templatename/:templateid/config_template',
        title: '模板配置',
        cache:'false', 
        templateUrl: helper.basepath('config_template.html'+'?action='+(new Date().getTime())),
        controller:'configTemplateCtrl',
        resolve: helper.resolveFor('xeditable')
    }) 
    /* 创建应用组件 */
    .state('app.topology_create', {
        url: 'topology_create',
        title: '创建拓扑',
        cache:'false', 
        templateUrl: helper.basepath('topology_create.html'+'?action='+(new Date().getTime())),
        controller:'topologyCreateCtrl',
        resolve: helper.resolveFor('localytics.directives','ui.bootstrap-slider','bootstrap-menu','parsley','angularFileUpload','filestyle')
    })
    /* 应用组件列表 */
    .state('app.topology_list', {
        url: 'topology_list',
        title: '拓扑列表',
        cache:'false', 
        templateUrl: helper.basepath('topology_list.html'+'?action='+(new Date().getTime())),
        controller:'topologyListCtrl'
    })
    /* 应用组件版本列表 */
    .state('app.topology_versionlist', {
        url: ':id/topology_versionlist',
        title: '拓扑版本列表',
        cache:'false', 
        templateUrl: helper.basepath('topology_version.html'+'?action='+(new Date().getTime())),
        controller:'topologyVersionListCtrl'
    })
    /* 应用组件版本更新 */
    /*.state('app.topology_update', {
        url: ':id/:v/topology_update',
        title: '更新拓扑版本',
        cache:'false', 
        templateUrl: helper.basepath('topology_update.html'+'?action='+(new Date().getTime())),
        controller:'topologyUpdateCtrl',
        resolve: helper.resolveFor('localytics.directives','ui.bootstrap-slider','bootstrap-menu','parsley','angularFileUpload','filestyle')
    })*/
    /* 应用组件版本资源包 */
    .state('app.resource_topo_version_detail', {
        url: ':id/topology_resource/:resourceVesionId',
        title: 'top资源版本详情',
        cache:'false', 
        templateUrl: helper.basepath('resource_version_detail.html'+'?action='+(new Date().getTime())),
        controller:'resourceVersionDetail'
    })
     /* 应用组件版本配置 */
    .state('app.config_topology_version_detail', {
        url: ':id/topology_config/:configVersionid',
        title: '配置版本详情',
        cache:'false', 
        templateUrl: helper.basepath('config_version_detail.html'+'?action='+(new Date().getTime())),
        controller:'configVersionDetail',
        resolve: helper.resolveFor('xeditable')
    })
    /* -----by wpeng ------*/
    /* Maven组件管理 */
    .state('app.customMavenComp', {
        url: 'custom/maven',
        title: 'Maven组件管理',
        cache:'false', 
        templateUrl: helper.basepath('custom/maven_comp_view.html'+'?action='+(new Date().getTime())),
        controller:'mavenCompController'
    })
    /* Maven组件管理 */
    .state('app.sp_create_conf', {
    	url: 'custom/sp_create_conf',
    	title: 'sp_create_conf',
    	cache:'false', 
    	templateUrl: helper.basepath('custom/sp_create_conf.html'+'?action='+(new Date().getTime())),
    	controller:'sp_create_confController'
    })
    /* SP-kafka 环境查询 */
    .state('app.spkafkaEnv', {
        url: 'custom/spkafkaEnv',
        title: 'SP-kafka环境',
        cache:'false', 
        templateUrl: helper.basepath('custom/sp_kafka_env.html'+'?action='+(new Date().getTime())),
        controller:'spkafkaEnvCtrl'
    })
    /* 向Kafka发消息 */
    .state('app.customProKafka', {
        url: 'custom/kafkaProducer',
        title: '向Kafka发数',
        cache:'false', 
        abstract: true,
        templateUrl: helper.basepath('custom/kafka_producer.html'+'?action='+(new Date().getTime())),
        controller:'KPController'
    })
    .state('app.customProKafka.skafka', {
        url: '/skafka',
        title: 'Kafka',
        cache:'false', 
        templateUrl: helper.basepath('custom/kafka_producer_info.html'+'?action='+(new Date().getTime())),
        controller:'kafkaProducerController',
        resolve:{
        		sendTypes:function () {
		                return{
		                stype:"kafka"
		                }
		            }
        		}
    })
    .state('app.customProKafka.shttp', {
        url: '/shttp',
        title: 'HTTP',
        cache:'false', 
        templateUrl: helper.basepath('custom/kafka_producer_info2.html'+'?action='+(new Date().getTime())),
        controller:'kafkaProducerController',
        resolve:{
    		sendTypes:function () {
	                return{
	                stype:"http"
	                }
	            }
    		}
    })
    /* 环境数据重置 */
    .state('app.envDataReset', {
    	url: 'custom/envDataReset',
    	title: 'envDataReset',
    	cache:'false', 
    	templateUrl: helper.basepath('custom/envDataReset.html'+'?action='+(new Date().getTime())),
    	controller:'envDataResetController'
    })
     /* 实时监控 */
    .state('app.monitor', {
        url: 'monitoring',
        title: '实时监控',
        cache:'false', 
        abstract: true, 
        templateUrl: helper.basepath('monitor.html'+'?action='+(new Date().getTime())),
        controller:'monitorCtrl'
    })
    .state('app.monitor.links', {
        url: '/links',
        title: '快速链接',
        cache:'false', 
        templateUrl: helper.basepath('monitor_links.html'+'?action='+(new Date().getTime())),
        controller:'monitorLinksController'
    })
    .state('app.monitor.kconsumerMon', {
        url: '/kconsumerMon',
        title: 'Kafka消费情况',
        cache:'false', 
        templateUrl: helper.basepath('custom/kafka_consumer_monitor.html'+'?action='+(new Date().getTime())),
        controller:'kConsumerMonitorCtrl'
    })
    /* 暂没用 */
    .state('app.sp_create_date', {
    	url: 'custom/sp_create_date',
    	title: 'sp_create_date',
    	cache:'false', 
    	templateUrl: helper.basepath('custom/sp_create_date.html'+'?action='+(new Date().getTime())),
    	controller:'sp_create_dateController'
    })
    /* -----by wpeng end ------*/
    /* 应用组件监控  */
    .state('app.topo_monitor', {
        url: 'topo_monitor',
        title: '拓扑监控',
        cache:'false', 
        templateUrl: helper.basepath('topo_monitor.html'+'?action='+(new Date().getTime())),
        controller:'topoMonitor'
    })
    /* spark管理 */
    .state('app.spark', {
        url: 'spark_manage/list',
        title: 'spark应用管理',
        cache:'false', 
        templateUrl: helper.basepath('spark_list.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('angularFileUpload','filestyle'),
        controller:'sparkList'
    })
    .state('app.spark_add', {
        url: 'spark_manage/add',
        title: 'spark应用管理添加',
        cache:'false', 
        templateUrl: helper.basepath('spark_add.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('angularFileUpload','filestyle'),
        controller:'sparkAdd'
    })
    .state('app.spark_config', {
        url: 'spark_manage/:name/:id/config',
        title: 'spark配置管理',
        cache:'false', 
        templateUrl: helper.basepath('spark_config.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('angularFileUpload','filestyle'),
        controller:'sparkConfig'
    })
    .state('app.spark_resource_upgrade', {
        url: 'spark_manage/resource_upgrade',
        title: 'spark应用资源包升级',
        cache:'false', 
        templateUrl: helper.basepath('spark_resource_upgrade.html'+'?action='+(new Date().getTime())),
        controller:'sparkResourceUpgrade'
    })
    .state('app.spark_monitor', {
        url: 'spark_monitoring/:appName/:appId/:funMark',
        title: 'spark应用运行监控',
        cache:'false', 
        templateUrl: helper.basepath('spark_monitor.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('spinkit'),
        controller:'sparkMonitor'
    })
    /* 权限管理 */
    .state('app.limit', {
        url: 'limit',
        title: '权限管理',
        cache:'false', 
        abstract: true,
        templateUrl: helper.basepath('limit.html'+'?action='+(new Date().getTime()))
    })
    .state('app.limit.user', {
        url: '/user',
        title: '用户管理',
        cache:'false', 
        templateUrl: helper.basepath('limit-user.html'+'?action='+(new Date().getTime())),
        controller:'limitUserCtrl'
    })
    .state('app.limit.role', {
        url: '/role',
        title: '角色管理',
        cache:'false', 
        templateUrl: helper.basepath('limit-role.html'+'?action='+(new Date().getTime())),
        resolve: helper.resolveFor('angularBootstrapNavTree'),
        controller:'limitRoleCtrl'
    })
    .state('app.limit.menu', {
        url: '/menu',
        title: '菜单管理',
        cache:'false', 
        templateUrl: helper.basepath('limit-menu.html'+'?action='+(new Date().getTime())),
        controller:'limitMenuCtrl'
    })
    /* 设置 */
    .state('app.settings', {
        url: 'settings',
        title: '个人信息',
        cache:'false', 
        controller:'settingsCtrl',
        templateUrl: helper.basepath('settings.html'+'?action='+(new Date().getTime()))
    })
    /* ----------------------------------------------------  */
    /* 服务资源 */
    .state('app.resource_server_list', {
        url: 'resource_server',
        title: '服务资源列表',
        cache:'false', 
        templateUrl: helper.basepath('resource_server_list.html'+'?action='+(new Date().getTime())),
        controller:'resourceServerListCtrl'
    })
    .state('app.resource_server_detail', {
        url: 'resource_server/:resourceId',
        abstract: true,
        cache:'false', 
        templateUrl: helper.basepath('resource_server_detail.html'+'?action='+(new Date().getTime())),
        controller:'resourceServerDetailCtrl'
    })
    .state('app.resource_server_detail.overview', {
        url: '/overview',
        title: '资源概述',
        cache:'false', 
        templateUrl: helper.basepath('resource_server_overview.html'+'?action='+(new Date().getTime()))
    })
    .state('app.resource_server_detail.version', {
        url: '/version',
        title: '资源版本',
        cache:'false', 
        templateUrl: helper.basepath('resource_server_version.html'+'?action='+(new Date().getTime())),
        controller:'resourceServerVersion'
    })
    /* 服务介质配置 */
    .state('app.config_component', {
        url: 'config_component',
        title: '服务介质配置列表',
        cache:'false', 
        templateUrl: helper.basepath('config_assembly_list.html'+'?action='+(new Date().getTime())),
        controller:'configComponentListCtrl'
    }) 
    .state('app.config_component_detail', {
        url: 'config_component/:configid/:configVersion',
        title: '服务介质配置详情',
        cache:'false', 
        templateUrl: helper.basepath('config_assembly.html'+'?action='+(new Date().getTime())),
        controller:'configComponentDetailCtrl',
        resolve: helper.resolveFor('xeditable')
    })
    .state('app.config_component_version_add', {
        url: 'config_component/:type/addversion/:configname/:configid',
        title: '服务介质配置版本添加',
        cache:'false', 
        controller:'configComponentVersionAddCtrl',
        templateUrl: helper.basepath('config_assembly_version_add.html'+'?action='+(new Date().getTime()))
    })
    /* 拓扑资源 */
    .state('app.resource_topo_list', {
        url: 'resource_topo',
        title: '拓扑资源列表',
        cache:'false', 
        templateUrl: helper.basepath('resource_topo_list.html'+'?action='+(new Date().getTime())),
        controller:'resourceTopoListCtrl'
    })
    .state('app.resource_topo_detail', {
        url: 'resource_topo/:resourceId',
        abstract: true,
        cache:'false', 
        templateUrl: helper.basepath('resource_topo_detail.html'+'?action='+(new Date().getTime())),
        controller:'resourceServerDetailCtrl'
    })
    .state('app.resource_topo_detail.overview', {
        url: '/overview',
        title: '资源概述',
        cache:'false', 
        templateUrl: helper.basepath('resource_topo_overview.html'+'?action='+(new Date().getTime()))
    })
    .state('app.resource_topo_detail.version', {
        url: '/version',
        title: '资源版本',
        cache:'false', 
        templateUrl: helper.basepath('resource_topo_version.html'+'?action='+(new Date().getTime())),
        controller:'resourceServerVersion'
    }) 
    /* 拓扑配置 */
    .state('app.config_topology', {
        url: 'config_topo',
        title: '配置列表',
        cache:'false', 
        templateUrl: helper.basepath('config_topo_list.html'+'?action='+(new Date().getTime())),
        controller:'configTopologyListCtrl'
    })
    .state('app.config_topology_detail', {
        url: 'config_topo/:configid/:configVersion',
        title: '配置详情',
        cache:'false', 
        templateUrl: helper.basepath('config_topo.html'+'?action='+(new Date().getTime())),
        controller:'configComponentDetailCtrl',
        resolve: helper.resolveFor('xeditable')
    })
    .state('app.config_topology_version_add', {
        url: 'config_topo/:type/addversion/:configname/:configid',
        title: '配置版本添加',
        cache:'false', 
        controller:'configComponentVersionAddCtrl',
        templateUrl: helper.basepath('config_assembly_version_add.html'+'?action='+(new Date().getTime()))
    })
    ;

}])
.config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
     
    $ocLazyLoadProvider.config({
      debug: false,
      events: true, 
      modules: APP_REQUIRES.modules
    });

}])

;




// 在路由切换时加载所需要资源

App.provider('RouteHelpers', ['APP_REQUIRES',function (appRequires) {

  this.basepath = function (uri) {
    return 'app/views/' + uri;
  };

  this.resolveFor = function () {
    var _args = arguments;
    return {
      deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
       
        var promise = $q.when(1);  

        for(var i=0, len=_args.length; i < len; i ++){
          promise = andThen(_args[i]);
        }
        return promise;

        
        function andThen(_arg) {
          
          if(typeof _arg == 'function')
              return promise.then(_arg);
          else
              return promise.then(function() {
                
                var whatToLoad = getRequired(_arg);
               
                if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                 
                return $ocLL.load( whatToLoad );
              });
        }
       
        function getRequired(name) {
          if (appRequires.modules)
              for(var m in appRequires.modules)
                  if(appRequires.modules[m].name && appRequires.modules[m].name === name)
                      return appRequires.modules[m];
          return appRequires.scripts && appRequires.scripts[name];
        }

      }]};
  }; // resolveFor

   
  this.$get = function(){
    return {
      basepath: this.basepath
    }
  };

}]);

// 右侧滑出模块
App.directive('toggleState', ['toggleStateService', function(toggle) {
  'use strict';
  
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var $body = $('body');
     
      $(element)
        .on('click', function (e) {
          e.preventDefault();
          var classname = attrs.toggleState;
          
          if(classname) {
            if( $body.hasClass(classname) ) {
              $body.removeClass(classname);
              $body.removeClass('shadow');
              if( ! attrs.noPersist)
                toggle.removeState(classname);
            }
            else {
              $body.addClass(classname);
              $body.addClass('shadow');
              if( ! attrs.noPersist)
                toggle.addState(classname);
            }
            
          }

      });
    }
  };
  
}]);

// 文件上传
App.directive('filestyle', function() {
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {
      var options = $element.data();
      
      // old usage support
        options.classInput = $element.data('classinput') || options.classInput;
      
      $element.filestyle(options);
    }]
  };
});

// 流程表单
App.directive('formWizard', ["$parse", function($parse){
      return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attribute) {
        	 
          var validate = $parse(attribute.validateSteps)(scope),
              wiz = new Wizard(attribute.steps, !!validate, element);

          scope.wizard = wiz.init();

        }
      };

      function Wizard (quantity, validate, element) {
       
        
        var self = this;
        self.quantity = parseInt(quantity,10);
        self.validate = validate;
        self.element = element;
        
        self.init = function() {
          self.createsteps(self.quantity);
          self.go(1); // always start at fist step
          return self;
        };

        self.go = function(step,params) {
        	
        	/*console.log(step);
        	console.log(params);
        	console.log((arguments.length==1)||((arguments.length>1)&&params));*/
            if((arguments.length==1)||((arguments.length>1)&&params)){
            	/*console.log(angular.isDefined(self.steps[step]));*/
               if ( angular.isDefined(self.steps[step]) ) {
               /* console.log(self.validate);
                console.log(step);
                console.log(self.validate && step !== 1);*/
                if(self.validate && step !== 1) {
                  var form = $(self.element),
                      group = form.children().children('div').get(step - 2);
                  /* console.log(form);
                   console.log(group);
                   console.log(form.parsley().validate( group.id ));
                   console.log(false === form.parsley().validate( group.id ));*/
                  if (false === form.parsley().validate( group.id )) {
                    return false;
                  }
                }

                self.cleanall();
                self.steps[step] = true;
              }
            } 
        };

        self.active = function(step) {
          return !!self.steps[step];
        };

        self.cleanall = function() {
          for(var i in self.steps){
            self.steps[i] = false;
          }
        };

        self.createsteps = function(q) {
          self.steps = [];
          for(var i = 1; i <= q; i++) self.steps[i] = false;
        };

      }

    }]);

// 定义全选指令

App.directive('checkAll', function() {
  'use strict';
  
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element){
      
      $element.on('change', function() {
    	   
    	  $scope.checkappId=[];
    	  
        var $this = $(this),
            index= $this.index() + 1,
            checkbox = $this.find('input[type="checkbox"]'),
            table = $this.parents('table');
        // Make sure to affect only the correct checkbox column
        table.find('tbody > tr > td:nth-child('+index+') input[type="checkbox"]')
          .prop('checked', checkbox[0].checked);
        
        var eleArr=table.find('tbody > tr > td:nth-child('+index+') input[type="checkbox"]');
        
        if(checkbox[0].checked){
      	  for(var i=0;i<eleArr.length;i++)
      	  {
      		 $scope.checkappId.push(eleArr[i].getAttribute('save-id'));
      	  } 
        }else{
      	  $scope.checkappId=[];
        }
        

      });
    }]
  };

});

App.directive('assemblyVersion', function($http) {
  'use strict';
  
  return {
    restrict: 'E',
    replace:true,
    template:'<select class="form-control" ng-model="versionId" ng-options="v.versionId as v.versionNumber for v in vlist"></select>',
    scope:{
        assemblyId: '=',
        versionId:'='
    },
    link:function(scope,element,attr){
       $http.get('/cloudui/ws/apps/listOperationAppVersions'+ '?v=' + (new Date().getTime()),{
        params:
            {
              pageNum:1,
              pageSize:10000,
              appId:scope.assemblyId
            }
       }).success(function(data){
           scope.vlist=data.rows;
           scope.versionId=scope.vlist[0].versionId;
       })
    }
  };

});

// save

App.directive('saveId', function() {
	 'use strict';
	  return {
	    restrict: 'ECA',
	    scope:{
	    	checkappId: '=',
        },
	    link:function(scope,element,attr){
	    	
	    	 element.on('change',function(){
	    		 var eleid=$(this).attr('save-id');
	    		
	    		 if($(this).is(':checked')){
		    		   scope.checkappId.push(eleid) 
		    	 }else
	    	     { 
		    		 for(var i=0;i<scope.checkappId.length;i++)
		    		 {
		    			 if(scope.checkappId[i]==eleid)
		    			 {
		    				 scope.checkappId.splice(i,1) 
		    			 }
		    		 }
	    	     }
	    	 })
	    }
	  };

});

// 负载验证端口每一行

App.directive('validTr', function() {
	 'use strict';
	  return {
	    restrict: 'ECA',
	    scope:{
	    	 
        },
	    link:function(scope,element,attr){
	    	
	     console.log(element)
	    }
	  };

});

//定义全选指令2

App.directive('checkAllList', function() {
  'use strict';
  
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element){


       $element.on('click', function(param) {
     
           var $this = $(this),
           listEle=$this.parent().parent().find('#alllist');
           listEle.find('input[type="checkbox"]').prop('checked',true)
        
       })
    }]
  };

});

// 重置
App.directive('checkAllReset', function() {
  'use strict';
  
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element){


       $element.on('click', function(param) {
  
           var $this = $(this),
           listEle=$this.parent().parent().find('#alllist');
           listEle.find('input[type="checkbox"]').prop('checked',false)
 
       })
    }]
  };

});

// 分页
App.directive('page',function(){
    return {
        restrict:'E',
        templateUrl:'app/views/partials/page.html'+'?action='+(new Date().getTime()),
        scope:{
            onPageChange: '&',
            pageNum: '=',
            pageCount:'='
        }, 
        link:function(scope,element,attr)
        {
           scope.pageNum=1;
           scope.pageChange = function(page) {
              if (page >= 1 && page <= scope.pageCount) {
                scope.pageNum = page;
              } else {
                scope.pageNum = 1;
              }
           }
           
           scope.pageRefresh=function(pagenum){
        	   
        	   scope.pageNum=pagenum;
        	   if(!scope.pageNum)
        	   {
        		   scope.pageNum=1;
        	   }
        	   
        	   
        	   pageData()
           }
            

           function pageData()
           {
              scope.onPageChange();
           }
         
           scope.$watch('pageNum',function(newval,oldval){
             pageData()
           })

           
        }

    }
})

// 日期插件
App.directive('ruledate',function(){
    return {
        restrict:'A',
        link:function(scope,element,attr)
        {
    
            function attrDefault($el, data_var, default_val)
        	{
        		if(typeof $el.data(data_var) != 'undefined')
        		{
        			return $el.data(data_var);
        		}
        		
        		return default_val;
        	}
        	// Date Range Picker
          
        	if($.isFunction($.fn.daterangepicker))
        	{
        		$(".daterange").each(function(i, el)
        		{
        			// Change the range as you desire
        			var ranges = {
        				'Today': [moment(), moment()],
        				'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
        				'Last 7 Days': [moment().subtract('days', 6), moment()],
        				'Last 30 Days': [moment().subtract('days', 29), moment()],
        				'This Month': [moment().startOf('month'), moment().endOf('month')],
        				'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        			};
        			
        			var $this = $(el),
        				opts = {                        
        					format: attrDefault($this, 'format', 'YYYY/DD/MM'),
        					timePicker: attrDefault($this, 'timePicker', false),
        					timePickerIncrement: attrDefault($this, 'timePickerIncrement', false),
        					separator: attrDefault($this, 'separator', ' - '),
        				},
        				min_date = attrDefault($this, 'minDate', ''),
        				max_date = attrDefault($this, 'maxDate', ''),
        				start_date = attrDefault($this, 'startDate', ''),
        				end_date = attrDefault($this, 'endDate', '');
        			
        			if($this.hasClass('add-ranges'))
        			{
        				opts['ranges'] = ranges;
        			}	
        				
        			if(min_date.length)
        			{
        				opts['minDate'] = min_date;
        			}
        				
        			if(max_date.length)
        			{
        				opts['maxDate'] = max_date;
        			}
        				
        			if(start_date.length)
        			{
        				opts['startDate'] = start_date;
        			}
        				
        			if(end_date.length)
        			{
        				opts['endDate'] = end_date;
        			}
        			
        			
        			$this.daterangepicker(opts, function(start, end)
        			{
        				var drp = $this.data('daterangepicker');
        				
        				if($this.is('[data-callback]'))
        				{
        					//daterange_callback(start, end);
        					callback_test(start, end);
        				}
        				
        				if($this.hasClass('daterange-inline'))
        				{
        					$this.find('span').html(start.format(drp.format) + drp.separator + end.format(drp.format));
        				}
        			});
        			
        			if(typeof opts['ranges'] == 'object')
        			{
        				$this.data('daterangepicker').container.removeClass('show-calendar');
        			}
        		});
        		}
         
        	if($.isFunction($.fn.timepicker))
    		{
    			$(".timepicker").each(function(i, el)
    			{
    				var $this = $(el),
    					opts = {
    						template: attrDefault($this, 'template', false),
    						showSeconds: attrDefault($this, 'showSeconds', false),
    						defaultTime: attrDefault($this, 'defaultTime', 'current'),
    						showMeridian: attrDefault($this, 'showMeridian', true),
    						minuteStep: attrDefault($this, 'minuteStep', 15),
    						secondStep: attrDefault($this, 'secondStep', 15)
    					},
    					$n = $this.next(),
    					$p = $this.prev();
    				
    				$this.timepicker(opts);
    				
    				if($n.is('.input-group-addon') && $n.has('a'))
    				{
    					$n.on('click', function(ev)
    					{
    						ev.preventDefault();
    						
    						$this.timepicker('showWidget');
    					});
    				}
    				
    				if($p.is('.input-group-addon') && $p.has('a'))
    				{
    					$p.on('click', function(ev)
    					{
    						ev.preventDefault();
    						
    						$this.timepicker('showWidget');
    					});
    				}
    			});
    		}
        }

    }
})

// 关联环境菜单

App.directive('dropMenu',function($http){
    return {
        restrict:'E',
        replace:true,
        scope:{
            myApp:'=',
            myVal:'='
        },
        templateUrl:'app/views/partials/dropmenu.html'+'?action='+(new Date().getTime()),
        link:function(scope,element,attr)
        {  
             
            $(document).click(function(ev){
            
             if($(ev.target).parents('div').attr('class')=='dropup pull-left')
             {
                if($(ev.target).next().length<=0)
                {
                   $('.dropdown-menu').hide();  
                } 
                ev.stopPropagation();

             }else
             { 
                element.hide();
             }
           });
            
          
            
           scope.envFn=function(appid,verid,index,event){
        	   $('.envul').hide();
        	   $http.get('/cloudui/ws/apps/list/envs/'+appid+'/'+verid+'?v='+(new Date().getTime())).
               success(function(data){ 
              	 scope.envsData=data;
               	$(event.target).next().show();
               
               }) 
           }

           scope.verFn=function(appid,index,event){
        	   $('.verul').hide();
        	   $http.get('/cloudui/ws/apps/list/versions/'+appid+'?v='+(new Date().getTime())).
               success(function(data){ 
              	 scope.versionsData=data;
              	 $(event.target).next().show();
               })
           }
           
           scope.envvalFn=function(appname,vid,env){
        	   if(scope.myVal)
               {
                 var valarr=scope.myVal.split('$');
                 
                 var firstval=valarr[0];

                 if(valarr[1])
                 {
                   var lastval=valarr[1].split('}')[1];
                 }
               } 
        	   
        	   if(!firstval)
               {
                   firstval='';
               }

               if(!lastval)
               {
                   lastval='';
               }
               scope.myVal=firstval+'${'+appname+'#'+vid+'#'+env+'}'+lastval;
           }
           
        }
    }
})


// 按钮权限指令

App.directive('btnfocus', function($http) {
    return {
    	 restrict: 'A',
    	 controller: ["$rootScope","$scope", "$element","Notify","$http", function($rootScope,$scope,$element,Notify,$http){
    	 
    		 $element.on('focus', function(param) { 
    			 $.ajax({
    				    type:       "get",
    				    dataType:   "json",
    				    url:        '/cloudui/ws/admins/isAccess',
    				    data:{userId:$rootScope.user.id,menuId:$element.attr('limit-id')},
    				    beforeSend: function() {
    				    	$element.attr('disabled',true);
    				    },
    				    success: function (data) {
    				    	if(data.result)
		    			    {
    				    		$element.removeAttr('disabled');
		    			    }else{
		    			       $element.attr('disabled',true);
		    		    	   Notify.alert( 
		    		              '您没有此权限！', 
		    		              {status: 'info'}
		    		           ) 
		    		           return false;
		    			    }
    				    }
    		     });
	         })
    	 }]
    };
});



// 验证名字指令
App.directive('validname', function($http) {
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
            elm.bind('keyup', function() {
                $http({method: 'GET', url: '/cloudui/ws/monitor/category/exsits/'+scope.name+'?v='+(new Date().getTime())}).
                success(function(data, status, headers, config) {
                    if(parseInt(data)!==1){
                        ctrl.$setValidity('tacticname',true);
                    }else{
                        ctrl.$setValidity('tacticname',false);
                    }
                }).
                error(function(data, status, headers, config) {
                    ctrl.$setValidity('tacticname', false);
                });
            });
        }
    };
}); 

// 验证spark应用名称

App.directive('validsparkname', function($http) {
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
            elm.bind('keyup', function() {
            	 /*if(scope.addSparkForm.name.$valid){*/
            		 $http.get('/cloudui/ws/spark/checkSpark'+'?v='+(new Date().getTime()),{
                 		params:{
                 			"name":scope.formdata.name
                 		}
                 	}).success(function(data, status, headers, config){
                 		if(data.result){
                     		ctrl.$setValidity('exitname',true);
                     	}else{
                     		ctrl.$setValidity('exitname',false);
                     	}
                 	}).error(function(data, status, headers, config) {
                         ctrl.$setValidity('exitname', false);
                     });
            	 /*}*/
            	 
            });
        }
    };
});

// 负载实例权重验证
App.directive('validweight', function($http) {
    return {
    	restrict:'A',
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
            elm.bind('keyup', function() {
            	console.log(elm)
            	ctrl.$setValidity('weight',true);
            });
        }
    };
});

  
/*//验证重复输入
App.directive('validequal', function($http) {
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
            elm.bind('keyup', function() {
            	ctrl.$setValidity('ip',true);
            });
        }
    };
}); */

// 弹出框
App.service('Notify', ["$timeout", function($timeout){
    this.alert = alert;

    function alert(msg, opts) {
        if ( msg ) {
            $timeout(function(){
                $.notify(msg, opts || {});
            });
        }
    }

}]);

// 右侧滑出模块

App.service('toggleStateService', ['$rootScope', function($rootScope) {

  var storageKeyName  = 'toggleState';

  // Helper object to check for words in a phrase //
  var WordChecker = {
    hasWord: function (phrase, word) {
      return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
    },
    addWord: function (phrase, word) {
      if (!this.hasWord(phrase, word)) {
        return (phrase + (phrase ? ' ' : '') + word);
      }
    },
    removeWord: function (phrase, word) {
      if (this.hasWord(phrase, word)) {
        return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
      }
    }
  };

  // Return service public methods
  return {
    // Add a state to the browser storage to be restored later
    addState: function(classname){
      var data = angular.fromJson($rootScope.$storage[storageKeyName]);
      
      if(!data)  {
        data = classname;
      }
      else {
        data = WordChecker.addWord(data, classname);
      }

      $rootScope.$storage[storageKeyName] = angular.toJson(data);
    },

    // Remove a state from the browser storage
    removeState: function(classname){
      var data = $rootScope.$storage[storageKeyName];
      // nothing to remove
      if(!data) return;

      data = WordChecker.removeWord(data, classname);

      $rootScope.$storage[storageKeyName] = angular.toJson(data);
    },
    
    // Load the state string and restore the classlist
    restoreState: function($elem) {
      var data = angular.fromJson($rootScope.$storage[storageKeyName]);
      
      // nothing to restore
      if(!data) return;
      $elem.addClass(data);
    }

  };

}]);

// 圆形监控图
App.factory('chartGuage',['$rootScope',function($rootScope){
    return {
        chartGaugeFn: function(id,ops,val){
         
           $(id).highcharts({
              credits: {
                 enabled: false
               },
              chart: {
                  type: 'gauge',
                   margin: [0, 0, 0, 0],
                   spacing: [0, 0, 0, 0],
                  plotBackgroundColor: null,
                  plotBackgroundImage: null,
                  plotBorderWidth: 0,
                  plotShadow: false
              },
              
              title: {
                  text: null
              },
              
              pane: {
                  startAngle: -150,
                  endAngle: 150
              },
                 
              yAxis: {
                  min: 0,
                  max: 100,
                  
                  minorTickInterval: 'auto',
                  minorTickWidth: 1,
                  minorTickLength: 4,
                  minorTickPosition: 'inside',
                  minorTickColor: '#666',
          
                  tickPixelInterval: 30,
                  tickWidth: 2,
                  tickPosition: 'inside',
                  tickLength: 6,
                  tickColor: '#666',
                  labels: {
                      step: 2,
                      rotation: 'auto'
                  },
                  title: {
                      text: ops.text,
                      y:15
                  },
                  plotBands: [{
                      from: 0,
                      to: 50,
                      color: '#55BF3B' // green
                  }, {
                      from: 50,
                      to: 80,
                      color: '#DDDF0D' // yellow
                  }, {
                      from: 80,
                      to: 100,
                      color: '#DF5353' // red
                  }]        
              },
          
             series: ops.series
          
          }, 
   
  function (chart) {
    if (!chart.renderer.forExport) {
    	 
      $rootScope.$watch(val,function(newval,oldval){
    	  
          if(newval=='undefined')
          {
            newval=0;  
          }
         
          var point = chart.series[0].points[0];
          point.update(newval);
      }) 
    }
  }); 
   }
    }
}])

// 曲线监控图
App.factory('chartArea',['$rootScope',function($rootScope){
    return {
        chartAreaFn: function(id,ops,time,val,val2){
        	 
           $(id).highcharts({ 
               credits: {
                 enabled: false
               }, 
              chart: {
                type: 'areaspline',                                                     
                animation: Highcharts.svg,         
                marginRight: 10,
                events: {
                  load: function() {
                     var series = this.series[0];
                     var series2 = this.series[1];
                      $rootScope.$watch('nodeoff',function(newval,oldval){
                        
                       if(newval)
                       {
                       
                    	  var x = $rootScope[time],
                          y = $rootScope[val],  
                          y2 = $rootScope[val2]; 
                    	  
                                 
                          series.addPoint([x, y], true, true);
                          series2.addPoint([x, y2], true, true);
                        
                       }
                      
                     }) 

                  }
                }
              },
              title: {                                                                
                 text: null                                           
              },
              xAxis: {                                                                
                 type: 'datetime',                                                   
                 tickPixelInterval: 10                                              
              }, 
              yAxis: {                                                                
                 title: {                                                            
                   text: ops.yAxis.title.text                                                    
                 },   
                 labels: {
                    formatter: function() {
                       return this.value  +ops.yAxis.labels;
                    }
                 },
                 plotLines: [{                                                       
                    value: 0,                                                       
                    width: 100                                                
                 }],
                 min:0
              }, 
              tooltip: {                                                              
                formatter: function() {                                             
                    return '<b>'+ this.series.name +'</b><br/>'+                
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                    Highcharts.numberFormat(this.y, 2);                         
                }                                                                   
              },
               legend: {
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },                                                                      
              exporting: {                                                            
                enabled: false                                                      
              }, 
              series: ops.series
           })
        } 
    }
}])


App.factory('httpInterceptor',['$q','$injector',function($q,$injector){
	var httpInterceptor ={
		'response':function(response){  
		    return response;
		 },	
		'responseError':function(response){
			 
			  if (response.status == 401) { 
		          var rootScope = $injector.get('$rootScope'); 
		          var state = $injector.get('$rootScope').$state.current.name; 
		          rootScope.stateBeforLogin = state; 
		        
		          window.location.href="/cloudui/app/pages/login.html";
		          return $q.reject(response); 
		        } else if (response.status === 404) { 
		          //alert("404!"); 
		          return $q.reject(response); 
		        } else if(response.status === 403){
		        	alert('403： 无权限的请求！')
		        } else if(response.status === 400){
		        	alert('400 错误的请求！')
		        }
			 
		}
	}
	return httpInterceptor;
}])



App.config(function($httpProvider){
 $httpProvider.interceptors.push('httpInterceptor');
})



App.directive('sidebar', ['$rootScope', '$window', 'Utils', function($rootScope, $window, Utils) {

  var $win  = $($window);
  var $body = $('body');
  var $scope;
  var $sidebar;
  var currentState = $rootScope.$state.current.name;

  return {
    restrict: 'EA',
    template: '<nav class="sidebar" ng-transclude></nav>',
    transclude: true,
    replace: true,
    link: function(scope, element, attrs) {
      
      $scope   = scope;
      $sidebar = element;

      var eventName = Utils.isTouch() ? 'click' : 'mouseenter' ;
      var subNav = $();
      $sidebar.on( eventName, '.nav > li', function() {

        if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) {

          subNav.trigger('mouseleave');
          subNav = toggleMenuItem( $(this) );

          // Used to detect click and touch events outside the sidebar          
          sidebarAddBackdrop();

        }

      });

      scope.$on('closeSidebarMenu', function() {
        removeFloatingNav();
      });

      // Normalize state when resize to mobile
      $win.on('resize', function() {
        if( ! Utils.isMobile() )
          $body.removeClass('aside-toggled');
      });

      // Adjustment on route changes
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        currentState = toState.name;
        // Hide sidebar automatically on mobile
        $('body.aside-toggled').removeClass('aside-toggled');

        $rootScope.$broadcast('closeSidebarMenu');
      });

      // Allows to close
      if ( angular.isDefined(attrs.sidebarAnyclickClose) ) {

        $('.wrapper').on('click.sidebar', function(e){
          // don't check if sidebar not visible
          if( ! $body.hasClass('aside-toggled')) return;

          // if not child of sidebar
          if( ! $(e.target).parents('.aside').length ) {
            $body.removeClass('aside-toggled');          
          }

        });
      }

    }
  };

  function sidebarAddBackdrop() {
    var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
    $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {
      removeFloatingNav();
    });
  }

  // Open the collapse sidebar submenu items when on touch devices 
  // - desktop only opens on hover
  function toggleTouchItem($element){
    $element
      .siblings('li')
      .removeClass('open')
      .end()
      .toggleClass('open');
  }

  // Handles hover to open items under collapsed menu
  // ----------------------------------- 
  function toggleMenuItem($listItem) {

    removeFloatingNav();

    var ul = $listItem.children('ul');
    
    if( !ul.length ) return $();
    if( $listItem.hasClass('open') ) {
      toggleTouchItem($listItem);
      return $();
    }

    var $aside = $('.aside');
    var $asideInner = $('.aside-inner'); // for top offset calculation
    // float aside uses extra padding on aside
    var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
    var subNav = ul.clone().appendTo( $aside );
    
    toggleTouchItem($listItem);

    var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
    var vwHeight = $win.height();

    subNav
      .addClass('nav-floating')
      .css({
        position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
        top:      itemTop+79,
        bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
      });

    subNav.on('mouseleave', function() {
      toggleTouchItem($listItem);
      subNav.remove();
    });

    return subNav;
  }

  function removeFloatingNav() {
    $('.dropdown-backdrop').remove();
    $('.sidebar-subnav.nav-floating').remove();
    $('.sidebar li.open').removeClass('open');
  }

}]);



App.service('Utils', ["$window", "APP_MEDIAQUERY", function($window, APP_MEDIAQUERY) {
    'use strict';
    
    var $html = angular.element("html"),
        $win  = angular.element($window),
        $body = angular.element('body');

    return {
      // DETECTION
      support: {
        transition: (function() {
                var transitionEnd = (function() {

                    var element = document.body || document.documentElement,
                        transEndEventNames = {
                            WebkitTransition: 'webkitTransitionEnd',
                            MozTransition: 'transitionend',
                            OTransition: 'oTransitionEnd otransitionend',
                            transition: 'transitionend'
                        }, name;

                    for (name in transEndEventNames) {
                        if (element.style[name] !== undefined) return transEndEventNames[name];
                    }
                }());

                return transitionEnd && { end: transitionEnd };
            })(),
        animation: (function() {

            var animationEnd = (function() {

                var element = document.body || document.documentElement,
                    animEndEventNames = {
                        WebkitAnimation: 'webkitAnimationEnd',
                        MozAnimation: 'animationend',
                        OAnimation: 'oAnimationEnd oanimationend',
                        animation: 'animationend'
                    }, name;

                for (name in animEndEventNames) {
                    if (element.style[name] !== undefined) return animEndEventNames[name];
                }
            }());

            return animationEnd && { end: animationEnd };
        })(),
        requestAnimationFrame: window.requestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.msRequestAnimationFrame ||
                               window.oRequestAnimationFrame ||
                               function(callback){ window.setTimeout(callback, 1000/60); },
        touch: (
            ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
            (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
            (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
            (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
            false
        ),
        mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
      },
      // UTILITIES
      isInView: function(element, options) {

          var $element = $(element);

          if (!$element.is(':visible')) {
              return false;
          }

          var window_left = $win.scrollLeft(),
              window_top  = $win.scrollTop(),
              offset      = $element.offset(),
              left        = offset.left,
              top         = offset.top;

          options = $.extend({topoffset:0, leftoffset:0}, options);

          if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
              left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
            return true;
          } else {
            return false;
          }
      },
      langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
      isTouch: function () {
        return $html.hasClass('touch');
      },
      isSidebarCollapsed: function () {
        return $body.hasClass('aside-collapsed');
      },
      isSidebarToggled: function () {
        return $body.hasClass('aside-toggled');
      },
      isMobile: function () {
        return $win.width() < APP_MEDIAQUERY.tablet;
      }
    };
}]);


/* 密码一致验证 */

App.directive('equalpassword', function($http) {
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
        	elm.bind('keydown', function() {
        		scope.$watch(function(){
            		if(scope.password!==scope.password_confirm)
                	{	 
                		 ctrl.$setValidity('equal',false);
                	}else{
                		ctrl.$setValidity('equal',true);
                	}
            	})
        	})
 
        }
    };
}); 



 


