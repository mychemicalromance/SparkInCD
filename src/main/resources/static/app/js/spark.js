/* *****spark应用列表***** */
mControllers.controller('sparkList',['$scope','$http','ngDialog',function($scope,$http,ngDialog){
    // 获取spark应用列表 
    $scope.pageSize=10;
    $scope.onPageChange = function ()
    {   
      $http.get('/cloudui/ws/spark/listSparkApps'+'?v=' + (new Date().getTime()),{
      params:
          {
            pageSize:$scope.pageSize,
            pageNum:$scope.pageNum,
            keyword:$scope.searchval||''
          }
     }).success(function(data){
       $scope.applist = data;
       $scope.listoff=data.total>0?true:false;
       $scope.warninginfo='提示：暂无spark应用';
       $scope.pageCount=Math.ceil($scope.applist.total/$scope.pageSize);
       if($scope.pageCount==0)
       {
         $scope.pageCount=1;
       }
     }).error(function(){
         $scope.listoff=false;
         $scope.warninginfo='暂无结果';
      })
    }
    
    // 搜素应用
    $scope.searchApp=function(e)
    {
      var keycode = window.event?e.keyCode:e.which;
        if(keycode==13)
        {
          $scope.pageNum=1;
          $scope.onPageChange(); 
        }
        if($scope.searchval.length==0)
        {
           $scope.pageNum=1;
           $scope.onPageChange(); 
        }
    }
    
    // 升级
    $scope.openResourceUpgrade = function (id,name) {
        ngDialog.open({
          template: 'app/views/dialog_spark_resource_upgrade.html'+'?action='+(new Date().getTime()),
          className: 'ngdialog-theme-default ngdialog-lg',
          data:{id:id,name:name},
          scope: $scope,
          closeByDocument:false,
          cache:false,
          controller:'sparkResourceUpgrade'
        });
     };
     // 下载
     $scope.downloadFn=function(id){
    	 window.location.href="/cloudui/ws/spark/downloadSpark"+'?v='+(new Date().getTime())+'&id='+id
     }
    
}])

/* *****spark应用添加***** */
mControllers.controller('sparkAdd',['$rootScope','$scope','$http','FileUploader','Notify','ngDialog','$state','$timeout','$filter',function($rootScope,$scope,$http,FileUploader,Notify,ngDialog,$state,$timeout,$filter){
	  $scope.sparkVersions = ['1.6','2.1'];
	  $scope.formdata={}; // 表单数据
	  
	  $scope.isDisabled=false;
	  
	  // 验证表单
	  $scope.submitted = false;
	  $scope.validateInput = function(name, type) {
	      var input = $scope.addSparkForm[name];
	      return (input.$dirty || $scope.submitted) && input.$error[type];
	  };
      
	  var uploader = $scope.uploader = new FileUploader({
	      url: '/cloudui/ws/spark/uploadSpark'
	  });
	  
	  $scope.isloading=true;

	  // FILTERS

	  uploader.filters.push({
		    name: 'customFilter',
		    fn: function(item /*{File|FileLikeObject}*/, options) {
		  	    
		  	      var nameArr=item.name.split('.');
		          
		          var name=item.name.split('.'+nameArr[nameArr.length-1])[0];
		          
		          var reg=/^[^<>,'";:\?[\]{}()*&%$#@!\s]+$/;
		
		          if(!reg.test(name)){
		      	   return reg.test(name);
		          } 
		          return this.queue.length < 1;
		    }
	  });

	  // CALLBACKS

	  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
	   
		  var nameArr=item.name.split('.');
	    
	      var name=item.name.split('.'+nameArr[nameArr.length-1])[0];
	    
	      var reg=/^[^<>,'";:\?[\]{}()*&%$#@!\s]+$/;
	    
	      if(!reg.test(name)){
	  	      Notify.alert(
		         '<em class="fa fa-check"></em> 上传包名称包含空格或特殊字符，请重新命名!',
		          {status: 'success'}
		       );
	      }else{ 
	    
			  Notify.alert(
		         '<em class="fa fa-check"></em> 只能添加一个文件!',
		          {status: 'success'}
		      );
	      }
	      
	      $scope.isloading=false;
	      
		  $timeout(function(){
	      	   $scope.isloading=true;
	      })
	  };

	  uploader.onAfterAddingFile=function(fileItem){
		  $scope.isloading=false;
		  
		  $timeout(function(){
	      	   $scope.isloading=true;
	      })
	      
	      fileItem.remove=function(){
		      this.uploader.removeFromQueue(this);
		      $scope.uploadData=null;
		  }
	  }


	  uploader.onSuccessItem = function(fileItem, response, status, headers) {
		  
	      if(response.result){
	    	  
	    	 $scope.isDisabled=false;
	    	  
	         $scope.uploadData=response;
	         
	         $scope.hasConfigArr=[];
	         
	          for(var i=0;i<$scope.uploadData.functionList.length;i++)
	          {
	        	  
	        	  if(angular.equals({},$scope.uploadData.functionList[i].functionConfigs))
	        	  {
	        		  $scope.hasConfigArr.push('true');
	        	  }else{
	        		  $scope.hasConfigArr.push('false'); 
	        	  }
	          }
	          
	          $scope.noConfigArr=$filter('filter')($scope.hasConfigArr,'true');
	          
	          if($scope.noConfigArr.length==$scope.uploadData.functionList.length){
	        	  $scope.isGo=true;
	          }else{
	        	  $scope.isGo=false;
	          }
	          
	      }else{
	    	 $scope.isDisabled=true;
	         Notify.alert(
	             '<em class="fa fa-times"></em> '+response.msg ,
	             {status: 'danger'}
	         );
	      }
	      
	  };
	  
	  $scope.$watch('isGo',function(newval,oldval){
		  if(newval){
			  Notify.alert(
                 '<em class="fa fa-check"></em> 当前包没有配置内容应用直接保存，后续可通配置管理添加配置!',
                 {status: 'success'}
              );
		  }
	  })
	  
	  // 查看应用函数
	  $scope.viewFunConfig=function(appName,funMark,funConfigs){

		  if(angular.equals({},funConfigs)){
			  Notify.alert(
                  '<em class="fa fa-check"></em> 此函数中没有配置！',
                  {status: 'success'}
              );
		  }else{
			  ngDialog.open({
			        template: 'app/views/dialog_spark_function_config.html'+'?action='+(new Date().getTime()),
			        className: 'ngdialog-theme-default',
			        scope: $scope,
			        closeByDocument:false,
			        cache:false,
			        data:{ 
			        	appName:appName,
			        	funMark:funMark,
			        	funConfigs:funConfigs
			        },
			        controller:'sparkFunConfigs'
			   });
		  }
		  
	  }
	  // 发布spark应用
	  $scope.addSparkFn=function(){
		  if(uploader.queue.length>0){
		       if(uploader.progress==100){
		    	   $scope.submitted = true; 
		    	   if($scope.addSparkForm.$valid){
		    		   $rootScope.app.layout.isShadow=true;
		    		   $http.post('/cloudui/ws/spark/submit',{
		    			   "name":$scope.formdata.name,
                           "description":$scope.formdata.description,
                           "resourceVerisonId":$scope.uploadData.resourceVerisonId,
                           "sparkVersion":$scope.formdata.sparkVersion
		    		   }).success(function(data){
		                	$rootScope.app.layout.isShadow=false;
		                	
		                    if(data.result)
		                    {
		                    	  console.log($scope.isGo)
		                    	  if($scope.isGo){
		                    		  $state.go('app.spark',{},{reload:true}); 
		                    	  }else{
		                    		
		                    		  // 发布进度
		                        	  
	                        		  var dialogSchedule=ngDialog.open({
	                        	        template: 'app/views/dialog_spark_releaseSchedule.html'+'?action='+(new Date().getTime()),
	                        	        className: 'ngdialog-theme-default',
	                        	        scope: $scope,
	                        	        closeByDocument:false,
	                        	        cache:false,
	                        	        data:{ 
	                        	        	appId:data.id
	                        	        },
	                        	        controller:'sparkReleaseSchedule'
	                        	      });

	                        		  dialogSchedule.closePromise.then(function(){
	                        			  $state.go('app.spark_monitor',{appId:data.id,appName:data.name},{reload:true});
	                        		  })
		                    	  }
	                        	  
		            
	                          }else
	                          {
	                              Notify.alert(
	                                '<em class="fa fa-times"></em> '+data.msg ,
	                                {status: 'danger'}
	                              );
	                          }
		                  })
		    	   }
		    	   
		     
	              
		                 
		        }else if(uploader.progress==0){
		            Notify.alert(
		               '<em class="fa fa-check"></em> 请上传您的资源包!',
		                {status: 'success'}
		             );
		        }else{
		            Notify.alert(
		               '<em class="fa fa-check"></em> 文件正在上传，请稍等!',
		                {status: 'success'}
		            ); 
		        }
		    }else{
		       Notify.alert(
		         '<em class="fa fa-check"></em> 请添加资源包!',
		          {status: 'success'}
		       );
		    }  
		}
}])

/*　*****spark应用函数配置***** */
mControllers.controller('sparkFunConfigs',['$scope','$http','ngDialog',function($scope,$http,ngDialog){
	$scope.appName=$scope.ngDialogData.appName;
	$scope.funMark=$scope.ngDialogData.funMark;
    $scope.funConfigs=$scope.ngDialogData.funConfigs;
    
    $scope.funConfigsList=[];
    
    angular.forEach($scope.funConfigs,function(val,key){
    	 
    	var obj={};
    	obj.province=key;
    	obj.serviceConfigs=[];
    	angular.forEach(val.serviceParams,function(serviceVal,serviceKey){
    		var serviceObj={};
    		serviceObj.key=serviceKey;
    		serviceObj.val=serviceVal;
    		obj.serviceConfigs.push(serviceObj);
    	})
    	
    	obj.systemConfigs=[];
    	angular.forEach(val.systemParams,function(systemVal,systemKey){
    		var systemObj={};
    		systemObj.key=systemKey;
    		systemObj.val=systemVal;
    		obj.systemConfigs.push(systemObj);
    	})
    	
    	$scope.funConfigsList.push(obj);
    })

}])
/*　*****发布进度***** */
mControllers.controller('sparkReleaseSchedule',['$scope','$http','ngDialog','$state','$interval',function($scope,$http,ngDialog,$state,$interval){
	 
	$scope.$on('$destroy', function() {
	     $interval.cancel($scope.timer);        
	});
	
	 $scope.appId=$scope.ngDialogData.appId; // 应用id
	 $scope.fnId=$scope.ngDialogData.fnId; // 函数id
	 $scope.configVersionIds=$scope.ngDialogData.configVersionIds;
	 
	 // 状态中文显示
	 $scope.showText=function(param){
         console.log(param);
		 if(param){
			 switch(param)
		       {
		         case 'Submitted':
		         var text='提交完成';
		         break;
		         case 'ACCEPTED':
		         var text='申请资源';
		         break;
		         case 'RUNNING':
		         var text='正在运行';
		         break;
		         case 'FINISHED':
			     var text='已完成';
			     break;
		         case 'FAILED':
			     var text='失败';
			     break;
		         case 'KILLED':
		         var text='已停止';
		         break;
		       }
		       return text;
		 }else{
			 return '正在提交';
		 }
		
	 }
	 
	 // 获取发布进度configVersionIds
	 $scope.getReleaseSchedule=function(){
		 
	    
		 if($scope.configVersionIds){
			 $scope.data={
			     sparkId:$scope.appId,
			     functionId:$scope.fnId||'',
			     configVersionIds:angular.toJson($scope.configVersionIds)
             }
		 }else{
			 $scope.data={
				sparkId:$scope.appId,
			    functionId:$scope.fnId||'' 
			 }
		 }
 
		 
		 $http.get('/cloudui/ws/spark/getSubmitSchedule'+'?v='+(new Date().getTime()),{
			 params:$scope.data
		 }).success(function(data){
			 $scope.releaseSchedule=data;
		 })
	 }
	 
	 $scope.getReleaseSchedule();
	 
	 // 实时查看进度
	 
	 $scope.timer=$interval(function(){
		 $scope.getReleaseSchedule();
	 },5000)

}])
/*　*****配置管理***** */
mControllers.controller('sparkConfig',['$scope','$http','$stateParams','Notify','ngDialog',function($scope,$http,$stateParams,Notify,ngDialog){
	
	$scope.appName=$stateParams.name;
	
	// 获取spark应用下的函数
	$http.get('/cloudui/ws/spark/listSparkFunctions'+'?v='+(new Date().getTime()),{
		params:{
			id:$stateParams.id
		}
	}).success(function(funData){
		if(funData.result){
			$scope.sparkFunData=funData;
			$scope.sparkFunData.functionList[0].active=true;
			$scope.curfun=$scope.sparkFunData.functionList[0];
		}else{
			Notify.alert(
              '<em class="fa fa-times"></em> '+data.msg ,
              {status: 'danger'}
            );
		}	
	})
	
	// 函数下的省
	$scope.getProvice=function(id){
	      $http.get('/cloudui/ws/spark/listFunctionConfigs'+'?v='+(new Date().getTime()),{
	        params:{
	        	 "id":id,
	        	 "keyword":"",
	        	 "pageNum": 1,
	        	 "pageSize": 10000
	        }
	      }).success(function(data){
	    	  if(data.result){
	    		  $scope.proviceList=data.rows;
	    	  }else{
	    		  Notify.alert(
    	              '<em class="fa fa-times"></em> '+data.msg ,
    	              {status: 'danger'}
	    	      ); 
	    	  }
	      })
	}
	
	
   // fun切换
   $scope.$watch('curfun',function(newval,oldval){
       if(newval)
       { 
          $scope.getProvice(newval.id); 
          $scope.changeVersion(newval,$scope.sparkFunData.functionList);
       }
   })
   
   $scope.changeVersion=function(item,arr){
	   for(var i=0;i<arr.length;i++)
	   {
		   arr[i].active=false;
	   }
	   item.active=true;
	   $scope.curfun=item;
   }
   
   // 获取省配置
   $scope.getProviceConfigs=function(isShow,provice){
	   if(isShow){
		   $http.get('/cloudui/ws/spark/getProvinceConfigs'+'?v='+(new Date().getTime()),{
			   params:{
				   id:provice.id
			   }
		   }).
		   success(function(data){
			   if(data.result){
			 
				   provice.systemConfigs=[];
 
				   angular.forEach(data.systemParams,function(val,key){
					   angular.forEach(val,function(cVal,cKey){
						   var systemObj={};
						   if(cKey!=='id'){
						    	systemObj.key=cKey;
					    	    systemObj.val=cVal;
					    	    provice.systemConfigs.push(systemObj);
						    }  
					   })    
				   })
				   
				   provice.serviceConfigs=[];
				   
				   angular.forEach(data.serviceParams,function(val,key){
					   angular.forEach(val,function(cVal,cKey){
						   var serviceObj={};
						   if(cKey!=='id'){
						    	serviceObj.key=cKey;
							    serviceObj.val=cVal;
							    provice.serviceConfigs.push(serviceObj);
						   }
					   })     
				   })
				    
			   }else{
				   Notify.alert(
    	              '<em class="fa fa-times"></em> '+data.msg ,
    	              {status: 'danger'}
	    	       );
			   }
		   })
	   }
   }
   
   // 配置批量导入
   $scope.updateConfig=function(fn,appname){
	   ngDialog.open({
	        template: 'app/views/dialog_config_inject.html'+'?action='+(new Date().getTime()),
	        className: 'ngdialog-theme-default ngdialog-lg',
	        data:{fnData:fn,appName:appname},
	        scope: $scope,
	        closeByDocument:false,
	        cache:false,
	        controller:'sparkConfigInject'
	   });
   }
   
// 向左滑动
   var leftnum=1;
   $scope.moveLeft=function(){ 
	  
	  var offsetLeft=angular.element('#listul')[0].offsetLeft;
	  
	 
	  var allWidth=($scope.sparkFunData.functionList.length-4)*220;
	  
	   if(Math.abs(offsetLeft)>=allWidth){
		   return false;
	   }
	   
	   angular.element('#listul').animate({'left':(offsetLeft-220)+'px','right':0})
	   
   }
   // 向右滑动
   
   $scope.moveRight=function(){ 
	   var offsetLeft=angular.element('#listul')[0].offsetLeft;
		  
	  var allWidth=($scope.sparkFunData.functionList.length-4)*220;
	  
	  if(offsetLeft>=0){
		 
		   return false;
	   } 
	   
	   angular.element('#listul').animate({'left':(offsetLeft+220)+'px','right':0})
	   
   }

}])
/*　*****配置批量导入***** */
mControllers.controller('sparkConfigInject',['$rootScope','$scope','$http','FileUploader','Notify','ngDialog','$state','$timeout',function($rootScope,$scope,$http,FileUploader,Notify,ngDialog,$state,$timeout){
	 
	$scope.fnData=$scope.ngDialogData.fnData;
	$scope.appName=$scope.ngDialogData.appName;
	
	var uploader = $scope.uploader = new FileUploader({
	      url: '/cloudui/ws/spark/uploadConfigs',
	      formData:[
   	         {
   	        	sparkName:$scope.appName,
   	        	funMark:$scope.fnData.functionMark
   	         }  
   	      ]
	});
	 
	$scope.isloading=true;
	
	$scope.isDisabled=false;

	// FILTERS

	uploader.filters.push({
	    name: 'customFilter',
	    fn: function(item /*{File|FileLikeObject}*/, options) {
	  	    
	  	      var nameArr=item.name.split('.');
	          
	          var name=item.name.split('.'+nameArr[nameArr.length-1])[0];
	          
	          var fileType=nameArr[nameArr.length-1];
	          
	          var reg=/^[^<>,'";:\?[\]{}()*&%$#@!\s]+$/;
	
	          if(fileType!=='zip'){
	          	   return false;
	          }else if(!reg.test(name)){
	      	       return reg.test(name);
	          } 
	          
	          return this.queue.length < 1;
	    }
	});

	// CALLBACKS

	uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
	   
		  var nameArr=item.name.split('.');
	    
	      var name=item.name.split('.'+nameArr[nameArr.length-1])[0];
	      
	      var fileType=nameArr[nameArr.length-1];
	    
	      var reg=/^[^<>,'";:\?[\]{}()*&%$#@!\s]+$/;
	    
	      if(this.queue.length<1){
              if(fileType!=='zip'){
                   Notify.alert(
			            '<em class="fa fa-check"></em> 请添加ZIP类型的资源包!',
			             {status: 'success'}
			         );
              }else{
                   if(!reg.test(name)){
			  	      Notify.alert(
				         '<em class="fa fa-check"></em> 上传包名称包含空格或特殊字符，请重新命名!',
				          {status: 'success'}
				       );
				    }
              }
	      }else{
	      	  Notify.alert(
		         '<em class="fa fa-check"></em> 只能添加一个文件!',
		          {status: 'success'}
		      );
	      }
	      
	      $scope.isloading=false;
	      
	      $timeout(function(){
	      	   $scope.isloading=true;
	      })
	      console.log(123)
	      
	  };

	  uploader.onAfterAddingFile=function(fileItem){
		  
          $scope.isloading=false;
	      
	      $timeout(function(){
	      	   $scope.isloading=true;
	      })
	      
	      fileItem.remove=function(){
		      this.uploader.removeFromQueue(this);
		      $scope.uploadData=null;
		  }
	  }


	  uploader.onSuccessItem = function(fileItem, response, status, headers) {
		  
	      if(response.result){
	    	  $scope.isDisabled=false;
	         $scope.uploadData=response;
	         $scope.funConfigsList=[];
	         
	         angular.forEach(response.functionConfigs,function(val,key){
	         	 
	         	var obj={};
	         	obj.province=key;
	         	obj.serviceConfigs=[];
	         	angular.forEach(val.serviceParams,function(serviceVal,serviceKey){
	         		var serviceObj={};
	         		serviceObj.key=serviceKey;
	         		serviceObj.val=serviceVal;
	         		obj.serviceConfigs.push(serviceObj);
	         	})
	         	
	         	obj.systemConfigs=[];
	         	angular.forEach(val.systemParams,function(systemVal,systemKey){
	         		var systemObj={};
	         		systemObj.key=systemKey;
	         		systemObj.val=systemVal;
	         		obj.systemConfigs.push(systemObj);
	         	})
	         	
	         	$scope.funConfigsList.push(obj);
	         })
	      }else{
	    	 $scope.isDisabled=true;
	         Notify.alert(
	             '<em class="fa fa-times"></em> '+response.msg ,
	             {status: 'danger'}
	         );
	      }
	      
	  };
	  
	  $scope.addFnconfig=function(closeThisDialog){
		  if(uploader.queue.length>0){
		       if(uploader.progress==100){
		    	  
		    		   $rootScope.app.layout.isShadow=true;
		    		   $http.post('/cloudui/ws/spark/submitFunction',{
		    			   "fileid":$scope.uploadData.fileid,
	                       "id":$scope.fnData.id,
	                       "functionConfigs":$scope.uploadData.functionConfigs
		    		   }).success(function(submitdata){
		                	      $rootScope.app.layout.isShadow=false;
		                          if(submitdata.result)
		                          {  
		                        	  console.log(submitdata.configVersionIds)
		                        	  // 发布进度
	
	                        		  var dialogSchedule=ngDialog.open({
	                        	        template: 'app/views/dialog_spark_releaseSchedule.html'+'?action='+(new Date().getTime()),
	                        	        className: 'ngdialog-theme-default',
	                        	        scope: $scope,
	                        	        closeByDocument:false,
	                        	        cache:false,
	                        	        data:{ 
	                        	        	appId:submitdata.id,
	                        	            fnId:$scope.fnData.id,
	                        	            configVersionIds:submitdata.configVersionIds
	                        	        },
	                        	        controller:'sparkReleaseSchedule'
	                        	      });
	                        		  
	                        		
	                        		  dialogSchedule.closePromise.then(function(){
	                        			  ngDialog.close();
	                        			  $state.go('app.spark_monitor',{appId:submitdata.id,appName:$scope.appName,funMark:$scope.fnData.functionMark},{reload:true});
	                        		  })
	                        		  
	                        		 
		            
		                          }else
		                          {
		                              Notify.alert(
		                                '<em class="fa fa-times"></em> '+submitdata.msg ,
		                                {status: 'danger'}
		                              );
		                          }
		                  })
        
		        }else if(uploader.progress==0){
		            Notify.alert(
		               '<em class="fa fa-check"></em> 请上传您的资源包!',
		                {status: 'success'}
		             );
		        }else{
		            Notify.alert(
		               '<em class="fa fa-check"></em> 文件正在上传，请稍等!',
		                {status: 'success'}
		            ); 
		        }
		    }else{
		       Notify.alert(
		         '<em class="fa fa-check"></em> 请添加资源包!',
		          {status: 'success'}
		       );
		    }  
		}
}])
/*　*****spark应用资源包升级***** */
mControllers.controller('sparkResourceUpgrade',['$rootScope','$scope','$http','FileUploader','Notify','ngDialog','$timeout','$state','$filter',function($rootScope,$scope,$http,FileUploader,Notify,ngDialog,$timeout,$state,$filter){

	var uploader = $scope.uploader = new FileUploader({
	      url: '/cloudui/ws/spark/uploadpackage',
	      formData:[
  	         {
  	        	 sparkName:$scope.ngDialogData.name
  	         }  
  	      ]
	});
	
	$scope.isloading=true;
	
	$scope.isDisabled=false;

	  // FILTERS

	  uploader.filters.push({
		    name: 'customFilter',
		    fn: function(item /*{File|FileLikeObject}*/, options) {
		  	    
		  	      var nameArr=item.name.split('.');
		          
		          var name=item.name.split('.'+nameArr[nameArr.length-1])[0];
		          
		          var fileType=nameArr[nameArr.length-1];
		          
		          var reg=/^[^<>,'";:\?[\]{}()*&%$#@!\s]+$/;
		          
		          var type=angular.element('input[name="type"]:checked').val();
		
		          if((type=='increment')&&(fileType!=='jar')){
		               return false;
			       }else if((type=='full')&&(fileType!=='zip')){
		               return false;
			       }else if(!reg.test(name)){
		      	     return reg.test(name);
		           }
	           
                  return this.queue.length < 1;
		    }
	  });

	  // CALLBACKS

	  uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
	   
		  var nameArr=item.name.split('.');
	    
	      var name=item.name.split('.'+nameArr[nameArr.length-1])[0];
	      
	      var fileType=nameArr[nameArr.length-1];
	    
	      var reg=/^[^<>,'";:\?[\]{}()*&%$#@!\s]+$/;
	      
	      var type=angular.element('input[name="type"]:checked').val();
	    
	      if(this.queue.length<1){
              if(type=='increment'){
	              if(fileType!=='jar'){
	                  Notify.alert(
			            '<em class="fa fa-check"></em> 增量包只上传spark应用程序jar包，平台只加载jar文件!',
			             {status: 'success'}
			         );
	              }else{
	              	  if(!reg.test(name)){
				  	      Notify.alert(
					         '<em class="fa fa-check"></em> 上传包名称包含空格或特殊字符，请重新命名!',
					          {status: 'success'}
					       );
				      }
	              }
		      }else if(type=='full'){
	              if(fileType!=='zip'){
	                  Notify.alert(
			            '<em class="fa fa-check"></em> 全量包升级上传zip包，加载应用jar和依赖jar 平台只保留最新版本的包!',
			             {status: 'success'}
			         );
	              }else{
	              	  if(!reg.test(name)){
				  	      Notify.alert(
					         '<em class="fa fa-check"></em> 上传包名称包含空格或特殊字符，请重新命名!',
					          {status: 'success'}
					       );
				      }
	              }
		      }
	      }else{
	      	  Notify.alert(
		         '<em class="fa fa-check"></em> 只能添加一个文件!',
		          {status: 'success'}
		      );
	      }
	      
          $scope.isloading=false;
	      
		  $timeout(function(){
	      	   $scope.isloading=true;
	      })
	  };

	  uploader.onAfterAddingFile=function(fileItem){
		  
          $scope.isloading=false;
	      
		  $timeout(function(){
	      	   $scope.isloading=true;
	      })
	      
	      fileItem.remove=function(){
		      this.uploader.removeFromQueue(this);
		      $scope.uploadData=null;
		  }
	  }
	  
	  uploader.onSuccessItem = function(fileItem, response, status, headers) {
		 
	      if(response.result){
	    	 
	    	 $scope.isDisabled=false;
	    	  
	         $scope.fileid=response.fileid;
	         var type=angular.element('input[name="type"]:checked').val();
	         console.log(type)
	         
	         if(type=="increment"){
	        	 $scope.uploadData=null
	         }else{
	        	 $scope.uploadData=response;
	        	 console.log($scope.uploadData);
	        	 $scope.hasConfigArr=[];
		         
		          for(var i=0;i<$scope.uploadData.functionList.length;i++)
		          {
		        	  
		        	  if(angular.equals({},$scope.uploadData.functionList[i].functionConfigs))
		        	  {
		        		  $scope.hasConfigArr.push('true');
		        	  }else{
		        		  $scope.hasConfigArr.push('false'); 
		        	  }
		          }
		          
		          $scope.noConfigArr=$filter('filter')($scope.hasConfigArr,'true');
		          
		          if($scope.noConfigArr.length==$scope.uploadData.functionList.length){
		        	  $scope.isGo=true;
		          }else{
		        	  $scope.isGo=false;
		          }
	         }
	      }else{
	    	 $scope.isDisabled=true;
	         Notify.alert(
	             '<em class="fa fa-times"></em> '+response.msg ,
	             {status: 'danger'}
	         );
	      }
	      
	  };
	  
	  $scope.$watch('isGo',function(newval,oldval){
		  if(newval){
			  Notify.alert(
                 '<em class="fa fa-check"></em> 当前包没有配置内容应用直接升级，后续可通配置管理添加配置!',
                 {status: 'success'}
              );
		  }
	  })
	  
	  // 查看应用函数
	  $scope.viewFunConfig=function(appName,funMark,funConfigs){

		  if(angular.equals({},funConfigs)){
			  Notify.alert(
                  '<em class="fa fa-check"></em> 此函数中没有配置！',
                  {status: 'success'}
              );
		  }else{
			  ngDialog.open({
			        template: 'app/views/dialog_spark_function_config.html'+'?action='+(new Date().getTime()),
			        className: 'ngdialog-theme-default',
			        scope: $scope,
			        closeByDocument:false,
			        cache:false,
			        data:{ 
			        	appName:appName,
			        	funMark:funMark,
			        	funConfigs:funConfigs
			        },
			        controller:'sparkFunConfigs'
			   });
		  }
		  
	  }
	  
	  // 升级
	  $scope.upgradeFn=function(){
		  if(uploader.queue.length>0){
		       if(uploader.progress==100){
		    	   
		    	   $rootScope.app.layout.isShadow=true;
                    
                   var type=angular.element('input[name="type"]:checked').val();
                   if(type=='increment'){
                	   var url='/cloudui/ws/spark/upgradeSpark';
                   }else if(type=='full'){
                	   var url='/cloudui/ws/spark/upgradeSpark';
                   }
          
                   $http.post(url,{
                	   "fileid":$scope.fileid,
            		   "id":$scope.ngDialogData.id,
            		   "type":type
                   }).success(function(data){
                	   $rootScope.app.layout.isShadow=false;
                	   if(data.result){
                		   if(type=='increment'){
                			   Notify.alert(
                                       '<em class="fa fa-check"></em> '+data.msg ,
                                       {status: 'success'}
                                );
                        		 
                			   
                               // 发布进度
	                        	  
                       		  var dialogSchedule=ngDialog.open({
                       	        template: 'app/views/dialog_spark_releaseSchedule.html'+'?action='+(new Date().getTime()),
                       	        className: 'ngdialog-theme-default',
                       	        scope: $scope,
                       	        closeByDocument:false,
                       	        cache:false,
                       	        data:{ 
                       	        	appId:$scope.ngDialogData.id
                       	        },
                       	        controller:'sparkReleaseSchedule'
                       	      });

                       		  dialogSchedule.closePromise.then(function(){
                       			ngDialog.close();
                       			  $state.go('app.spark_monitor',{appId:$scope.ngDialogData.id,appName:$scope.ngDialogData.name},{reload:true});
                       		  })
                		   }else{
                			   Notify.alert(
                                       '<em class="fa fa-check"></em> '+data.msg ,
                                       {status: 'success'}
                               );
                        	   
                			  if($scope.isGo){
                				  ngDialog.close();
	                    		  $state.go('app.spark',{},{reload:true}); 
	                    	  }else{
	                    		
	                    		  // 发布进度
	                        	  
                        		  var dialogSchedule=ngDialog.open({
                        	        template: 'app/views/dialog_spark_releaseSchedule.html'+'?action='+(new Date().getTime()),
                        	        className: 'ngdialog-theme-default',
                        	        scope: $scope,
                        	        closeByDocument:false,
                        	        cache:false,
                        	        data:{ 
                        	        	appId:$scope.ngDialogData.id
                        	        },
                        	        controller:'sparkReleaseSchedule'
                        	      });

                        		  dialogSchedule.closePromise.then(function(){
                        			  ngDialog.close();
                        			  $state.go('app.spark_monitor',{appId:$scope.ngDialogData.id,appName:$scope.ngDialogData.name},{reload:true});
                        		  })
	                    	  }
                		   }
                		   
                	   }else{
                		   Notify.alert(
                               '<em class="fa fa-times"></em> '+data.msg ,
                               {status: 'danger'}
                            );
                	   }
                   })
		        }else if(uploader.progress==0){
		            Notify.alert(
		               '<em class="fa fa-check"></em> 请上传您的资源包!',
		                {status: 'success'}
		             );
		        }else{
		            Notify.alert(
		               '<em class="fa fa-check"></em> 文件正在上传，请稍等!',
		                {status: 'success'}
		            ); 
		        }
		    }else{
		       Notify.alert(
		         '<em class="fa fa-check"></em> 请添加资源包!',
		          {status: 'success'}
		       );
		    }  
		}
}])
/*　*****spark应用运行监控***** */
mControllers.controller('sparkMonitor',['$scope','$http','$stateParams','$filter','Notify','ngDialog','$interval',function($scope,$http,$stateParams,$filter,Notify,ngDialog,$interval){
	
	$scope.$on('$destroy', function() {
		 $interval.cancel($scope.timer);  
	});
	
	// 状态
	$scope.stateList=[
	   {"value":"ALL","text":"所有"},
	   {"value":"Submitted","text":"提交完成"},
	   {"value":"ACCEPTED","text":"申请资源"},
	   {"value":"RUNNING","text":"正在运行"},
	   {"value":"FINISHED","text":"已完成"},
	   {"value":"FAILED","text":"失败"},
	   {"value":"KILLED","text":"已停止"}
    ]
	$scope.state="ALL";
	
	$scope.appId=$stateParams.appId;
	
	$scope.appname=$stateParams.appName||'';
	
	$scope.fnMark=$stateParams.funMark||'';
	// 获取spark应用监控列表
	$scope.pageSize=10;
	$scope.checkappId=[];
	$scope.onPageChange = function (appname)
    {    
	  $('#applisttable thead').find('input[type="checkbox"]').prop('checked',false);
      $http.get('/cloudui/ws/spark/listSparkInstances'+'?v=' + (new Date().getTime()),{
      params:
          {
    	    "id":$scope.appId||'',
    	    "sparkName":$scope.appname||'',
            "functionMark":$scope.fnMark||'',
            "configVersionName":$scope.provincename||'',
            "status":$scope.state,
        	"pageNum":$scope.pageNum,
            "pageSize":$scope.pageSize
          }
     }).success(function(data){
       
       $scope.sparklist = data;
       $scope.listoff=data.rows.length>0?true:false;
       $scope.warninginfo='提示：暂无监控的spark应用';
       $scope.pageCount=Math.ceil($scope.sparklist.total/$scope.pageSize);
       if($scope.pageCount==0){
    	   $scope.pageCount=1;
       }
     }).error(function(){
         $scope.listoff=false;
         $scope.warninginfo='暂无结果';
     })
    }
	
	$scope.timer=$interval(function(){
		$scope.onPageChange();
	},10000)
	
	// 查询
	$scope.querylog=function(){
		$scope.appId='';
		$scope.pageNum=1;
		
		$interval.cancel($scope.timer); 
		
		$scope.timer=$interval(function(){
			$scope.onPageChange();
		},10000)
	   
		$scope.onPageChange();
	}
	
	
	// 启动、停止、重启
	$scope.doFn=function(params,notify,url)
	{
		ngDialog.openConfirm({
            template:
                '<p class="modal-header">'+notify+'</p>' +
                '<div class="modal-body text-right">' +
                  '<button type="button" class="btn btn-default mr20" ng-click="closeThisDialog(0)">取消' +
                  '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
                '</button></div>',
            plain: true,
            closeByDocument:false,
            className: 'ngdialog-theme-default'
        })
        .then(
        function(){
        	 
        	 if(angular.isObject(params)){
        		 var strParams=params.join(','); 
        	 }else{
        		 var strParams=params;
        	 }
        	 
        	  $http.post(url,{
        		  sparkInstanceIds:strParams
        	  }).success(function(data){
        		 /* $scope.pageNum=1;
        	  	  $('#applisttable thead').find('input[type="checkbox"]').prop('checked',false);
        	  	  $scope.onPageChange();*/
        		  if(data.result)
        		  {
        			  Notify.alert(
		                '<em class="fa fa-check"></em> '+data.msg ,
		                {status: 'success'}
		              );
        		  }else{
        			  Notify.alert(
	    	              '<em class="fa fa-times"></em> '+data.msg ,
	    	              {status: 'danger'}
    		    	  );
        		  }
        	  })
             
           }
        )   
	}

	$scope.openDoFn=function(params,notify1,notify2,url){
	       
	       if(params)
	       {
	          $scope.doFn(params,notify2,url);
	       }else
	       {
	    	   var checkboxEle=$('#applisttable tbody').find('input[type="checkbox"]:checked');
	    	   
	           var checkbox=[];
	    
	           angular.forEach(checkboxEle,function(val,key){
	                checkbox.push(val.id);  
	           })
	              
	          if(checkbox.length==0)
	          {
	             Notify.alert(
	                notify1 ,
	                {status: 'success'}
	             );
	          }else
	          {
	             $scope.doFn(checkbox,notify2,url);
	          }
	       }
   } 
	
   $scope.start=function(params){
	   $scope.openDoFn(params,'请选择您要启动的应用!','您确定要启动这些应用吗?','/cloudui/ws/spark/startBatch') 
   }
   
   $scope.stop=function(params){
	   $scope.openDoFn(params,'请选择您要停止的应用!','您确定要停止这些应用吗?','/cloudui/ws/spark/killBatch') 
   }
   
   $scope.restart=function(params){
	   $scope.openDoFn(params,'请选择您要重启的应用!','您确定要重启这些应用吗?','/cloudui/ws/spark/restartBatch') 
   }
   
   $scope.sparkError=function(data){
	   if(data){
		   ngDialog.open({
	           template: 'app/views/dialog_sparkErrorLog.html'+'?action='+(new Date().getTime()),
	           className: 'ngdialog-theme-default ngdialog-lg',
	           scope: $scope,
	           closeByDocument:false,
	           cache: false,
	           data:{error:data},
	           controller:'sparkErrorCtrl'
	       }); 
	   }else{
		   Notify.alert(
              '没有错误日志' ,
              {status: 'success'}
           );
	   }  
   }
}])


// 错误日志
mControllers.controller('sparkErrorCtrl',['$scope',function($scope){
	$scope.errorData=$scope.ngDialogData.error;
}])