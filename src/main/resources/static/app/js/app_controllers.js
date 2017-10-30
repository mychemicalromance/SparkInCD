

/* 控制器 */

var mControllers=angular.module('mControllers',['ngResource']);

/* ------------------------------webController------------------------------ */

mControllers.controller('webCtrl',
  ['$rootScope', '$scope', '$state', '$window', '$timeout', 'cfpLoadingBar','toggleStateService',
  function($rootScope, $scope, $state, $window, $timeout, cfpLoadingBar,toggleStateService) {

    var thBar;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        if($('.wrapper > section').length)  
          thBar = $timeout(function() {
            cfpLoadingBar.start();
          }, 0);  
    });
     

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          
          
        event.targetScope.$watch("$viewContentLoaded", function () {
          $timeout.cancel(thBar);
          cfpLoadingBar.complete();
        });
    });

    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
        $rootScope.currTitle = $state.current.title;
      });

    $rootScope.currTitle = $state.current.title;
    $rootScope.pageTitle = function() {
      var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
      document.title = title;
      return title;
    };  

}]);

/* ------------------------------formedit------------------------------ */

mControllers.controller('FormxEditableController', ['$scope', 'editableOptions', 'editableThemes',
function($scope, editableOptions, editableThemes) {

	  editableOptions.theme = 'bs3';
	  
	  editableThemes.bs3.inputClass = 'input-sm';
	  editableThemes.bs3.buttonsClass = 'btn-sm';
	  editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success" ng-click="save();editlabel($data);"><span class="fa fa-check"></span></button>';
	  editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">'+
	                                   '<span class="fa fa-times text-muted"></span>'+
	                                 '</button>';    
}]);


/* ------------------------------左侧菜单栏------------------------------ */

/*mControllers.controller('SidebarController', ['$rootScope','$scope','$http','$state',
  function($rootScope,$scope,$http){

    $scope.loadSidebarMenu = function() {
     // 
      var menuJson = '/cloudui/ws/user/getPolicies',
          menuURL  = menuJson + '?v=' + (new Date().getTime());  
      $http.get(menuURL,{params:{userName:$rootScope.user.name}})
        .success(function(items) {
           $scope.menuItems = items;
        })
     };

     $scope.loadSidebarMenu();
     
     $scope.loginout=function(){
    	 $http.get('/cloudui/ws/user/logout'+'?v='+(new Date().getTime()))
    	 .success(function(data){
            if(data=='true')
            {
            	window.location='app/pages/login.html';
            }else
            {
            	return false;
            }
    	 })
     }

}]);*/

mControllers.controller('SidebarController', ['$rootScope','$scope','$http','$state','Utils',
  function($rootScope,$scope,$http,$state,Utils){
	 
	var collapseList = [];

    // demo: when switch from collapse to hover, close all items
    $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
      if ( newVal === false && oldVal === true) {
        closeAllBut(-1);
      }
    });


    // Check item and children active state
    

    // Load menu from json file
    // ----------------------------------- 
    $scope.loginout=function(){
       $http.get('/cloudui/ws/user/logout'+'?v='+(new Date().getTime()))
       .success(function(data){
            if(data=='true')
            {
              window.location='app/pages/login.html';
            }else
            {
              return false;
            }
       })
     }
     

    $scope.loadSidebarMenu = function() {

      var menuJson = '/cloudui/ws/user/getPolicies',
          menuURL  = menuJson + '?v=' + (new Date().getTime());  
      $http.get(menuURL,{params:{userName:$rootScope.user.name}})
        .success(function(items) {
           $scope.menuItems = items;
        })
        .error(function(data, status, headers, config) {
          alert('加载菜单失败');
        });
 
     };

     $scope.loadSidebarMenu();

    // Handle sidebar collapse items
    // ----------------------------------- 

    $scope.addCollapse = function($index, item) {

      collapseList[$index] = $rootScope.app.layout.asideHover ? true : !$rootScope.isActive(item);
    };

    $scope.isCollapse = function($index) {
      return (collapseList[$index]);
    };

    $scope.toggleCollapse = function($index, isParentItem) {
 
      // collapsed sidebar doesn't toggle drodopwn
      if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) return true;

      // make sure the item index exists
      if( angular.isDefined( collapseList[$index] ) ) {
        if ( ! $scope.lastEventFromChild ) {
          collapseList[$index] = !collapseList[$index];
          closeAllBut($index);
        }
      }
      else if ( isParentItem ) {
        closeAllBut(-1);
      }
      
      $scope.lastEventFromChild = isChild($index);

      return true;
    
    };

    function closeAllBut(index) {
      index += '';
      for(var i in collapseList) {
        if(index < 0 || index.indexOf(i) < 0)
          collapseList[i] = true;
      }
    }

    function isChild($index) {
      return (typeof $index === 'string') && !($index.indexOf('-') < 0);
    }
    
}]);

/* -------------------------------权限管理---------------------------------------- */

/* ****用户管理**** */  

mControllers.controller('limitUserCtrl',['$scope','$http','$state','ngDialog','Notify',
    function($scope,$http,$state,ngDialog,Notify){
  
  // 用户列表  
  $scope.pageSize=10;
  $scope.onPageChange = function ()
  {   
      $http.get('/cloudui/ws/admins/listUsers'+'?v=' + (new Date().getTime()),{
        params:
	      {
	        pageSize:$scope.pageSize,
	        pageNum:$scope.pageNum,
	        key:$scope.searchval||''
	      }
      }).success(function(data){
		   $scope.userlist = data;
		   $scope.listoff=data.total>0?true:false;
		   $scope.warninginfo='提示：暂无用户';
		   $scope.pageCount=Math.ceil($scope.userlist.total/$scope.pageSize);
		   if($scope.pageCount==0)
		   {
		     $scope.pageCount=1;
		   }
     }).error(function(){
	     $scope.listoff=false;
	     $scope.warninginfo='暂无结果';
    })
  }

  // 搜素用户
    
  $scope.searchUser=function(e)
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
  // 新建用户弹窗
  $scope.openCreateUser=function(){
      ngDialog.open({
        template: 'app/views/dialog_createuser.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-sm',
        //scope: $scope,
        closeByDocument:false,
        cache:false,
        controller:'createUserCtrl'
      });
  }
  // 删除用户  
  $scope.delUser=function(param){
     ngDialog.openConfirm({
        template:
             '<p class="modal-header">您确定要删除此用户吗?</p>' +
             '<div class="modal-body text-right">' +
               '<button type="button" class="btn btn-default mr20"  ng-click="closeThisDialog(0)">取消' +
               '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
             '</button></div>',
       plain: true,
       closeByDocument:false,
       className: 'ngdialog-theme-default'
     }).then(function(){
        $http({
              method  : 'POST',
              url     : '/cloudui/ws/admins/delUser',   
              data    : $.param({userName:param.userName}),
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
        }).then(function(response){
            if(response.data.result)
            {
               Notify.alert(
                     '<em class="fa fa-check"></em> '+response.data.message ,
                     {status: 'success'}
               );
               $state.go('app.limit.user',{},{reload:true});
            }else{
               Notify.alert(
                     '<em class="fa fa-times"></em> '+response.data.message ,
                     {status: 'danger'}
               );
            }
        })
     })
  }
  
  // 修改用户密码弹窗
  $scope.openChangePassword=function(user){
	  console.log(user)
      ngDialog.open({
        template: 'app/views/dialog_changeUserPassword.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        scope: $scope,
        closeByDocument:false,
        data:{userInfo:user},
        cache:false,
        controller:'changeUserPasswordCtrl'
      });
  }

  $scope.modifyUser = function(user){
    console.log(user)
    ngDialog.open({
            template: 'app/views/dialog_modifyUser.html'+'?action='+(new Date().getTime()),
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument:false,
            data:{userInfo:user},
            cache:false,
            controller:'modifyUserCtrl'
          });
  }

}])

mControllers.controller('modifyUserCtrl',['$scope','$http','ngDialog','$state','Notify','$filter',function($scope,$http,ngDialog,$state,Notify,$filter){
            $scope.userInfo=$scope.ngDialogData.userInfo;
            $scope.selectedapp = $scope.userInfo.appName.split(";");
            $scope.appsList=function(){
                            $http.get('/cloudui/ws/admins/appList?v=' + (new Date().getTime())).success(function(data){
                              if(data != null && data.length > 0){
                              $scope.hasApps=true;
                                 for(var i = 0; i< data.length; i++){
                                     var selected = $filter('filter')($scope.selectedapp,data[i].app_name).length>0?true:false;
                                     if(selected){
                                        $("<option value='"+data[i].app_id+"' selected = 'selected'>"+data[i].app_name+"</option>").appendTo("#optionalApps");
                                     }else{
                                        $("<option value='"+data[i].app_id+"'>"+data[i].app_name+"</option>").appendTo("#optionalApps");
                                     }

                                 };
                                 $("#optionalApps").chosen({
                                    no_results_text:"没有搜索到此系统"
                                 });
                             }else{
                              $scope.hasApps=false;
                             }
                           })
                       }
            $scope.appsList();

            $scope.modifyUserFn=function(){
                if($scope.modifyUserForm.$valid) {
                    var RSA=$http.get('/cloudui/ws/RSA'+'?v='+(new Date().getTime())).success(function(data){
                       $scope.modulus=data.modulus;
                       $scope.exponent=data.exponent;
                      })

                      RSA.then(function(res){
                         $scope.modulus=res.data.modulus;
                         $scope.exponent=res.data.exponent;
                         var key = RSAUtils.getKeyPair($scope.exponent, '', $scope.modulus);
                         pwd = "";
                         if($scope.password){
                            pwd = RSAUtils.encryptedString(key, $scope.password);
                         }
                         // 修改
                         $http({
                              method  : 'POST',
                              url     : '/cloudui/ws/admins/modifyUser',
                              data    : $.param({
                                 id:$scope.userInfo.ID,
                                 password:pwd,
                                 appIds:$scope.apps.join(';'),
                                 workId:$scope.userInfo.userName
                              }),
                              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                           }).then(function(response) {
                                if ( !response.data.result ) {

                                  Notify.alert(
                                          '<em class="fa fa-times"></em> '+response.data.message ,
                                          {status: 'danger'}
                                  );
                                }else{
                                   Notify.alert(
                                            '<em class="fa fa-check"></em> '+response.data.message ,
                                            {status: 'success'}
                                    );
                                    ngDialog.close();
                                    $state.go('app.limit.user',{},{reload:true});
                                }
                           },function(x) {
                                $scope.authMsg = '服务器请求错误';
                           })
                      })
                }else{
                      $scope.modifyUserForm.password.$dirty = true;
                      $scope.modifyUserForm.password_confirm.$dirty = true;
                }
            }
}])

/* ****修改用户密码 **** */
mControllers.controller('changeUserPasswordCtrl',['$scope','$http','ngDialog','Notify',function($scope,$http,ngDialog,Notify){
	 
	$scope.userInfo=$scope.ngDialogData.userInfo;
	 
	$scope.changepasswordUserFn=function(){
		if($scope.changepasswordForm.$valid) {
			var RSA=$http.get('/cloudui/ws/RSA'+'?v='+(new Date().getTime())).success(function(data){
          	   $scope.modulus=data.modulus;
          	   $scope.exponent=data.exponent;
             })
             
             RSA.then(function(res){
            	 $scope.modulus=res.data.modulus;
            	 $scope.exponent=res.data.exponent;
            	 var key = RSAUtils.getKeyPair($scope.exponent, '', $scope.modulus);
            	 pwd = RSAUtils.encryptedString(key, $scope.password);
            	 // 修改
            	 $http({
                     method  : 'POST',
                     url     : '/cloudui/ws/admins/updatePassword',
                     data    : $.param({
                    	 id:$scope.userInfo.ID,
                    	 password:pwd
                     }),   
                     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
                  }).then(function(response) {  
                       if ( !response.data.result ) {
                         
                         Notify.alert(
                                 '<em class="fa fa-times"></em> '+response.data.message ,
                                 {status: 'danger'}
                         );
                       }else{
                    	   Notify.alert(
                                   '<em class="fa fa-check"></em> '+response.data.message ,
                                   {status: 'success'}
                           );
                           ngDialog.close();
                       }  
                  },function(x) {
                       $scope.authMsg = '服务器请求错误';
                  })
             })
		}else{
		      $scope.changepasswordForm.password.$dirty = true;
		      $scope.changepasswordForm.password_confirm.$dirty = true;
		}
	}
}])

/* ****新建用户**** */

mControllers.controller('createUserCtrl',['$scope','$http','$stateParams','$state','ngDialog','Notify',
        function($scope,$http,$stateParams,$state,ngDialog,Notify){
   $scope.appsList=function(){
                $http.get('/cloudui/ws/admins/appList?v=' + (new Date().getTime())).success(function(data){
                  if(data != null && data.length > 0){
                  $scope.hasApps=true;
                     for(var i = 0; i< data.length; i++){
                         $("<option value='"+data[i].app_id+"'>"+data[i].app_name+"</option>").appendTo("#optionalApps");
                     };
                     $("#optionalApps").chosen({
                        no_results_text:"没有搜索到此系统"
                     });
                 }else{
                  $scope.hasApps=false;
                 }
               })
           }
   $scope.appsList();
   $scope.user = {};
   $scope.authMsg = '';
   $scope.createUserFn = function(obj) {
    $scope.authMsg = '';
    if($scope.createUserForm.$valid) {
      // 验证用户是否存在
      if($scope.apps){
       $http({
                     method  : 'POST',
                     url     : '/cloudui/ws/admins/isExitUser',
                     data    : $.param({userName:$scope.user.name}),
                     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
         }).success(function(data){

            if(data.result)
            {
             var RSA=$http.get('/cloudui/ws/RSA'+'?v='+(new Date().getTime())).success(function(data){
                   $scope.modulus=data.modulus;
                   $scope.exponent=data.exponent;
                })

                RSA.then(function(res){
                   $scope.modulus=res.data.modulus;
                   $scope.exponent=res.data.exponent;
                   var key = RSAUtils.getKeyPair($scope.exponent, '', $scope.modulus);
                   pwd = RSAUtils.encryptedString(key, $scope.user.password);
                  // 创建用户
                  $http({
                    method  : 'POST',
                    url     : '/cloudui/ws/admins/createUser',
                    data    : $.param({
                      username:$scope.user.name,
                      password:pwd,
                      appid:$scope.apps.join(';')
                    }),
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
                 }).then(function(response) {
                      if ( !response.data.result ) {
                        $scope.authMsg =response.data.message;
                      }else{
                          ngDialog.close();
                          $state.go('app.limit.user',{},{ reload: true });
                      }
                 },function(x) {
                      $scope.authMsg = '服务器请求错误';
                 })

               })

            }else
            {
               $scope.authMsg = '此用户已存在，请重新命名！';
            }
         })
      }else{
        Notify.alert(
             '请选择应用系统' ,
             {status: 'info'}
         );
      }
    }else {
      $scope.createUserForm.name.$dirty = true;
      $scope.createUserForm.password.$dirty = true;
      $scope.createUserForm.apps.$dirty = true;
    }
  };
}])

/* ****角色管理**** */

mControllers.controller('limitRoleCtrl',['$rootScope','$scope','$http','ngDialog','$state','Notify',function($rootScope,$scope,$http,ngDialog,$state,Notify){
  // 角色列表   
  $http.get('/cloudui/ws/admins/listRoles'+'?v='+(new Date().getTime())).
  success(function(data){
      $scope.rolelist=data;
  })
  // 新建角色弹窗
  $scope.openCreateRole=function(){
      ngDialog.open({
        template: 'app/views/dialog_createrole.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        scope: $scope,
        closeByDocument:false,
        cache:false,
        controller:'createRoleCtrl'
      });
  }

  // 删除角色  
  $scope.delRole=function(index,param){
     ngDialog.openConfirm({
        template:
             '<p class="modal-header">您确定要删除此角色吗?</p>' +
             '<div class="modal-body text-right">' +
               '<button type="button" class="btn btn-default mr20"  ng-click="closeThisDialog(0)">取消' +
               '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
             '</button></div>',
       plain: true,
       closeByDocument:false,
       className: 'ngdialog-theme-default'
     }).then(function(){
        $http({
              method  : 'POST',
              url     : '/cloudui/ws/admins/delRole',   
              data    : $.param({roleName:param}),   
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
        }).then(function(response){
            if(response.data.result)
            {
               Notify.alert(
                     '<em class="fa fa-check"></em> '+response.data.message ,
                     {status: 'success'}
               );
               $scope.rolelist.splice(index,1);
            }else{
               Notify.alert(
                     '<em class="fa fa-times"></em> '+response.data.message ,
                     {status: 'danger'}
               );
            }
        })
     })
  }
  
//权限树 
  $scope.viewLimit=function(currole){
	  $scope.currole=currole;
	  $scope.treeoff=false;
	  $http({
	      method:'post',
	      url:'/cloudui/ws/admins/getPolicysOfRole',
		  //url:'server/getPolicysOfRole',
	      data:$.param({
	    	  roleId:currole.roleId
	      }),
	      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
	   }).success(function(data){
		   $scope.treeoff=true;
		   $scope.my_data=[];
		   angular.forEach(data,function(val,key){
			   var obj={};
			   obj.label=val.policy.text;
			   obj.id=val.policy.page_id;
			   obj.checked=val.have;
			   obj.children=[];
			   angular.forEach(val.policy.policyChild,function(val2,key2){
				   var objchild={};
				   objchild.label=val2.text;
				   objchild.id=val2.id;
				   objchild.checked=val2.flag;
				   objchild.children=[];
				   angular.forEach(val2.policyMenu,function(val3,key3){
					   var objchildmenu={};
					   objchildmenu.label=val3.title;
					   objchildmenu.id=val3.id;
					   objchildmenu.checked=val3.menu_flag;			   
					   objchild.children.push(objchildmenu);
					})
				   obj.children.push(objchild);
			   });
			   
			   if(val.policy.policyMenu!=null){
				   angular.forEach(val.policy.policyMenu,function(val3,key3){
					   var objchild1={};
					   objchild1.id=val3.id;
					   objchild1.label=val3.title;
					   objchild1.checked=val3.menu_flag;
					   obj.children.push(objchild1);
				   });
				   
			   }
			   
			   $scope.my_data.push(obj)

		   })

		   var tree;
		   $scope.my_tree = tree = {};
		     
	   })
  }
  

 
   $scope.savetree=function(savedata,role){
      
     var policyIdsarr=[];
	 var policyChildIdsarr=[];
     var menuIdsarr=[];
 
     angular.forEach(savedata,function(val,key){
 
    	 if(val.checked)
    	 {
    		 policyIdsarr.push(val.id) 
    	 }
    	 
    	 angular.forEach(val.children,function(val2,key2){
    		 if(val2.checked){
    			 policyChildIdsarr.push(val2.id);
    		 }
			 
			 angular.forEach(val2.children,function(val3,key3){

				 if(val3.checked){
					 menuIdsarr.push(val3.id);
				 }
 
			})
		 
    	 })
     })

     $http({
	  	  method:'post',
	  	  url:'/cloudui/ws/admins/savePolicysOfRole',
	  	  data: $.param({
	  		roleId:role,
	  	    policyIds:policyIdsarr.join(','),
			policyChildIds:policyChildIdsarr.join(','),
	  	    menuIds:menuIdsarr.join(',')
	  	  }),
	  	  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	    }).success(function(data){
	    	if(data.result)
	    	{
	    		Notify.alert(
                 '<em class="fa fa-check"></em> '+data.message ,
                 {status: 'success'}
                );
	    		
	    		$state.go('app.limit.role',{},{reload:true});
	    		
	    	}else{
	    		Notify.alert(
                    '<em class="fa fa-times"></em> 分配权限失败' ,
                    {status: 'danger'}
                );
	    	}
	 })
   }
}])



/* ****新建角色用户**** */

mControllers.controller('createRoleCtrl',['$rootScope','$scope','$http','ngDialog','$state',function($rootScope,$scope,$http,ngDialog,$state){
   
   $scope.role = {};
 
   $scope.authMsg = '';
 

   $scope.createRoleFn = function(obj) {
     
    $scope.authMsg = '';
   
    if($scope.createRoleForm.$valid) {
      // 验证角色是否存在
      $http({
              method  : 'POST',
              url     : '/cloudui/ws/admins/isExitRole',   
              data    : $.param({roleName:$scope.role.name}),   
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      }).success(function(data){

         if(data.result)
         {
            // 创建角色 
            $http({
              method  : 'POST',
              url     : '/cloudui/ws/admins/createRole',
              data    : $.param({
                roleName:$scope.role.name
              }),   
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
           }).then(function(response) {  
                if ( !response.data.result ) {
                  $scope.authMsg =response.data.message;
                }else{
                    ngDialog.close();
                    $state.go('app.limit.role',{},{ reload: true });
                }  
           },function(x) {
                $scope.authMsg = '服务器请求错误';
           })
         }else
         {
            $scope.authMsg = '此角色已存在，请重新命名！';
         }
      })

    }
    else { 
      $scope.createRoleForm.name.$dirty = true;
    }
  };
}])

/* ****菜单管理**** */

mControllers.controller('limitMenuCtrl',['$scope','$http','ngDialog','Notify',function($scope,$http,ngDialog,Notify){
   
   //菜单列表   
   $http.get('/cloudui/ws/admins/getAllPolicyChilds'+'?v='+(new Date().getTime())).
   success(function(data){
       $scope.menulist=data;
   })
   // 新建权限弹窗
  $scope.openCreateLimit=function(){
      ngDialog.open({
        template: 'app/views/dialog_createlimit.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        cache:false,
        closeByDocument:false,
        scope: $scope,
        controller:'createLimitCtrl'
      });
  }
  // 编辑权限弹窗
  $scope.openEditLimit=function(param){
      ngDialog.open({
        template: 'app/views/dialog_editlimit.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        cache:false,
        closeByDocument:false,
        data:{info:param},
        controller:'editLimitCtrl'
      });
  }
  // 删除权限
  $scope.delLimit=function(index,id,pid){
     ngDialog.openConfirm({
        template:
             '<p class="modal-header">您确定要删除此权限吗?</p>' +
             '<div class="modal-body text-right">' +
               '<button type="button" class="btn btn-default mr20"  ng-click="closeThisDialog(0)">取消' +
               '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
             '</button></div>',
       plain: true,
       closeByDocument:false,
       className: 'ngdialog-theme-default'
     }).then(function(){
        $http({
              method  : 'POST',
              url     : '/cloudui/ws/admins/delPolicyChild',   
              data    : $.param({
            	  policyChildId:id,
            	  pId:pid
              }),   
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
        }).then(function(response){
            if(response.data.result)
            {
               Notify.alert(
                     '<em class="fa fa-check"></em> '+response.data.message ,
                     {status: 'success'}
               );
               $scope.menulist.splice(index,1);
            }else{
               Notify.alert(
                     '<em class="fa fa-times"></em> '+response.data.message ,
                     {status: 'danger'}
               );
            }
        })
     })
  }
}])

/* ****创建权限**** */ 

mControllers.controller('createLimitCtrl',['$scope','$http','ngDialog','$state',function($scope,$http,ngDialog,$state){
  
   $scope.limit = {};
 
   $scope.authMsg = '';
   
   // 一级菜单
   
   $http.get('/cloudui/ws/admins/listPolicysTemp'+'?v='+(new Date().getTime())).
   success(function(data){
	   $scope.parentMenuList=data;
   })
 

   $scope.createLimitFn = function() {
     
    $scope.authMsg = '';
   
    if($scope.createLimitForm.$valid) {

      var policyInfos=angular.toJson({
         text:$scope.limit.text,
         icon:$scope.limit.icon,
         sref:$scope.limit.sref,
        /* title:$scope.limit.title,*/
         type:$scope.limit.type,
         serialNum:$scope.limit.serialNum
      })
      
      // 创建权限   
      $http({
        method  : 'POST',
        url     : '/cloudui/ws/admins/createPolicyChild',
        data    : $.param({
          policyInfos:policyInfos,
          policytext:$scope.limit.parent||''
        }),   
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      }).then(function(response){
          if ( !response.data.result ) {
            $scope.authMsg =response.data.message;
          }else{
              ngDialog.close();
              $state.go('app.limit.menu',{},{ reload: true });
          }
      },function(x) {
         $scope.authMsg = '服务器请求错误';
      })
    }
    else { 
      $scope.createLimitForm.text.$dirty = true;
      $scope.createLimitForm.icon.$dirty = true;
      $scope.createLimitForm.sref.$dirty = true;
      $scope.createLimitForm.title.$dirty = true;
      $scope.createLimitForm.type.$dirty = true;
    }
  };
}])

/* ****编辑权限**** */

mControllers.controller('editLimitCtrl',['$scope','$http','ngDialog','$state',function($scope,$http,ngDialog,$state){
  
     var menuinfo=$scope.ngDialogData.info;

     $scope.limit={};

     $scope.authMsg = '';
     
      // 一级菜单
     
     $http.get('/cloudui/ws/admins/listPolicysTemp'+'?v='+(new Date().getTime())).
     success(function(data){
       $scope.parentMenuList=data;
     })
    
     $scope.limit.text=menuinfo.text;
     $scope.limit.icon=menuinfo.icon;
     $scope.limit.sref=menuinfo.sref;
     /*$scope.limit.title=menuinfo.title;*/
     $scope.limit.type=menuinfo.type; 
     $scope.limit.serialNum=menuinfo.serialNum;
     $scope.limit.parent=menuinfo.parent_id;
     $scope.parent_id=menuinfo.parent_id;
     $scope.editLimitFn = function() {
     
       $scope.authMsg = '';
   
       if($scope.editLimitForm.$valid) {

          var policyInfos=angular.toJson({
             policyId:menuinfo.id,
             text:$scope.limit.text,
             icon:$scope.limit.icon,
             sref:$scope.limit.sref,
             /*title:$scope.limit.title,*/
             type:$scope.limit.type,
             serialNum:$scope.limit.serialNum,
             parent_id:$scope.limit.parent||0
          })
      
          // 编辑权限   
          $http({
            method  : 'POST',
            url     : '/cloudui/ws/admins/modifyPolicy',
            data    : $.param({
              policyInfos:policyInfos
            }),   
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
          }).then(function(response){
              if ( !response.data.result ) {
                $scope.authMsg =response.data.message;
              }else{
                  ngDialog.close();
                  $state.go('app.limit.menu',{},{ reload: true });
              }
          },function(x) {
             $scope.authMsg = '服务器请求错误';
          })
        }
    else { 
      $scope.editLimitForm.text.$dirty = true;
      $scope.editLimitForm.icon.$dirty = true;
      $scope.editLimitForm.sref.$dirty = true;
      $scope.editLimitForm.title.$dirty = true;
      $scope.editLimitForm.type.$dirty = true;
    }
  };
   
}])

/* -------------------------------主页---------------------------------------- */

mControllers.controller('homeCtrl',['$rootScope','$scope','$http','$interval',function($rootScope,$scope,$http,$interval){
	
	$scope.$on('$destroy', function() {
	     $interval.cancel($scope.timer);        
	});
	
	// 环境主机、服务监控
	$scope.clusterMonitorFn=function(val){
		$http.get('/cloudui/ws/monitor/getStatus/'+val.id+'?v='+(new Date().getTime()))
		.success(function(state){
			val.nodeState=state.hostStatus;
			val.serverState=state.serviceStatus;
			val.appState=state.appStatus;
		})
	}
	
	
	if($rootScope.user.roleId=='1'){ // 平台管理员

		// 应用数、环境数、主机数
		$http.get('/cloudui/ws/admins/getMainPageCountOfAdmin'+'?v='+(new Date().getTime())).
		success(function(data){
			$scope.appMonitor=data;
		})

		// 应用下环境列表
		
		$scope.search={};
		
		$scope.pageSize=10;
   
	   $scope.onPageChange = function (pageNum)
	   {
		  
	     $http.get('/cloudui/ws/admins/getAllClusterListByPage'+'?v=' + (new Date().getTime()),{
          params:
              {
                pageNum:pageNum,
                pageSize:$scope.pageSize,
                key:$scope.search.searchval
              }
          }).success(function(data){
        	
        	angular.forEach(data.rows,function(val,key){
        		$scope.clusterMonitorFn(val);
        	})
        	
        	$scope.timer= $interval(function(){
        		angular.forEach(data.rows,function(val,key){
            		$scope.clusterMonitorFn(val);
            	})
            },5000)
         
            $scope.envMonitorlist = data;
            $scope.envMonitorlistoff=data.total>0?true:false;
            $scope.warninginfo='提示：暂无环境';
            $scope.pageCount=Math.ceil(data.total/$scope.pageSize);
            if($scope.pageCount==0)
	        {
	          $scope.pageCount=1;
	        }
          }).error(function(){
	         $scope.envMonitorlistoff=false;
	         $scope.warninginfo='暂无结果';
	     })
	   }
	   
	   $scope.searchCluster=function(e)
	    {
	      var keycode = window.event?e.keyCode:e.which;
	        if(keycode==13)
	        {
	          $scope.onPageChange(1); 
	        }
	        if($scope.search.searchval.length==0)
	        {
	           $scope.onPageChange(1); 
	        }
	    }
	
     
	}else{
		// 环境下的主机数
		$http.get('/cloudui/ws/admins/getMainPageCount'+'?v='+(new Date().getTime())).
		success(function(data){
			$scope.clusterMonitor=data;
		})
		
		$scope.curEnv={};
		$scope.curEnv.name=$rootScope.app.choseenv.name;
		$scope.curEnv.id=$rootScope.app.choseenv.id;
		 
		$scope.clusterMonitorFn($scope.curEnv);
		
    	$scope.timer= $interval(function(){
    		$scope.clusterMonitorFn($scope.curEnv);
        },5000)
	}
 
}])

/* -------------------------------应用视图----------------------------------------- */

/* *****应用列表***** */

mControllers.controller('viewCtrl',['$rootScope','$scope','$http','ngDialog',function($rootScope,$scope,$http,ngDialog){
    // 获取应用列表 
    $scope.pageSize=10;
    $scope.onPageChange = function ()
    {   
      $http.get('/cloudui/ws/user/getAppList'+'?v=' + (new Date().getTime()),{
      params:
          {
            userName:$rootScope.user.name,
            pageSize:$scope.pageSize,
            pageNum:$scope.pageNum,
            key:$scope.searchval||''
          }
     }).success(function(data){
       $scope.applist = data;
       $scope.applistoff=data.total>0?true:false;
       $scope.warninginfo='提示：暂无应用';
       $scope.pageCount=Math.ceil($scope.applist.total/$scope.pageSize);
       if($scope.pageCount==0)
       {
         $scope.pageCount=1;
       }
     }).error(function(){
         $scope.applistoff=false;
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
    
    // 添加/更新应用
    $scope.openAddOrUpdateApp=function(name){
      ngDialog.open({
        template: 'app/views/dialog_addorupdateapp.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        scope: $scope,
        closeByDocument:false,
        data:{name:name},
        cache:false,
        controller:'addOrUpdateAppCtrl'
      });
    }

    // 新建环境弹出框
    $scope.openCreateCluster = function () {
      ngDialog.open({
        template: 'app/views/dialog_createcluster.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        scope: $scope,
        closeByDocument:false,
        cache:false,
        controller:'createEnvCtrl'
      });
   };
   
   
  
}])

/* *****系统下的应用***** */
mControllers.controller('viewApplist',['$rootScope','$scope','$http','$stateParams','$filter',function($rootScope,$scope,$http,$stateParams,$filter){
	$scope.appname=$stateParams.appname;
	$http.get('/cloudui/ws/apps/viewApplication'+'?v='+(new Date().getTime()),{
		params:{
			userAppId:$rootScope.app.appsession.id
		}
	}).success(function(data){
		$scope.appList=data;
		$scope.stormAppNum=$filter('filter')($scope.appList,'storm').length;
		$scope.sparkAppNum=$filter('filter')($scope.appList,'spark').length;
	})
}])

//成员系统管理
mControllers.controller('viewSubApps',['$scope','$http',
                        '$stateParams','$filter','ngDialog','Notify','$state',function($scope,
                                                                    $http,$stateParams,$filter,ngDialog,Notify,$state){
	    $scope.appname=$stateParams.appname;
	    $scope.appid = $stateParams.appid;
	    $scope.checkappId=[]; // 选中的应用
        // 获取成员系统列表
        $scope.pageSize=10;
        $scope.onPageChange = function ()
        {
          $http.get('/cloudui/ws/apps/listSubApps'+'?v=' + (new Date().getTime()),{
          params:
              {
                pageNum:$scope.pageNum,
                pageSize:$scope.pageSize,
                superUserAppId:$stateParams.appid
              }
         }).success(function(data){
        	 angular.forEach(data.rows,function(val,key){
        		 var ischecked=$filter('filter')($scope.checkappId,val.appId).length>0?true:false;
        		 data.rows[key].ischecked=ischecked;
        	 })

        	 $scope.applist = data;
        	 $scope.applistoff=data.total>0?true:false;
             $scope.warninginfo='提示：暂无成员系统';
             $scope.pageCount=Math.ceil($scope.applist.total/$scope.pageSize);
             if($scope.pageCount==0)
             {
            	 $scope.pageCount=1;
             }
         }).error(function(){
             $scope.applistoff=false;
             $scope.warninginfo='暂无结果';
          })
        }

        // 添加成员系统弹窗
        $scope.addSubApp=function(){
              ngDialog.open({
                template: 'app/views/dialog_addsubapp.html'+'?action='+(new Date().getTime()),
                className: 'ngdialog-theme-default ngdialog-sm',
                closeByDocument:false,
                cache:false,
                data:{appid:$scope.appid},
                controller:'addSubAppCtrl'
              });
        }

        $scope.modifySubApp=function(param){
            ngDialog.open({
                template: 'app/views/dialog_modifysubapp.html'+'?action='+(new Date().getTime()),
                className: 'ngdialog-theme-default ngdialog-sm',
                closeByDocument:false,
                cache:false,
                data:{subapp:param},
                controller:'modifySubAppCtrl'
              });
        }

        //删除成员系统
          $scope.delSubApp=function(param){
             ngDialog.openConfirm({
                template:
                     '<p class="modal-header">您确定要删除此成员系统吗?</p>' +
                     '<div class="modal-body text-right">' +
                       '<button type="button" class="btn btn-default mr20"  ng-click="closeThisDialog(0)">取消' +
                       '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
                     '</button></div>',
               plain: true,
               closeByDocument:false,
               className: 'ngdialog-theme-default'
             }).then(function(){
                $http({
                      method  : 'DELETE',
                      url     : '/cloudui/ws/apps/delSubApp?ids='+param.id
                }).then(function(response){
                    if(response.data.result)
                    {
                       Notify.alert(
                             '<em class="fa fa-check"></em> '+response.data.message ,
                             {status: 'success'}
                       );
                       $state.go('app.view-subApps',{appname:$scope.appname,appid:$scope.appid},{reload:true});
                    }else{
                       Notify.alert(
                             '<em class="fa fa-times"></em> '+response.data.message ,
                             {status: 'danger'}
                       );
                    }
                })
             })
          }

          $scope.deleteSubApps=function(){
               console.log($scope.checkappId);
               if($scope.checkappId.length == 0){
                    Notify.alert(
                         '<em class="fa fa-times"></em> '+请选择需要删除的成员系统 ,
                         {status: 'danger'}
                    );
               }else{
                    $http({
                          method  : 'DELETE',
                          url     : '/cloudui/ws/apps/delSubApp?ids='+$scope.checkappId.join(",")
                    }).then(function(response){
                        if(response.data.result)
                        {
                           Notify.alert(
                                 '<em class="fa fa-check"></em> '+response.data.message ,
                                 {status: 'success'}
                           );
                           $state.go('app.view-subApps',{appname:$scope.appname,appid:$scope.appid},{reload:true});
                        }else{
                           Notify.alert(
                                 '<em class="fa fa-times"></em> '+response.data.message ,
                                 {status: 'danger'}
                           );
                        }
                    })
               }
          }
}])

mControllers.controller('modifySubAppCtrl',['$scope','$http','$stateParams','$state','ngDialog','Notify','$filter',function(
                                                $scope,$http,$stateParams,$state,ngDialog,Notify,$filter){
    $scope.superUserAppId = $scope.ngDialogData.subapp.superUserAppId;
    $scope.subApp = $scope.ngDialogData.subapp.subUserAppId;
    $scope.subAppName = $scope.ngDialogData.subapp.subAppName;
    $scope.selectedenv = $scope.ngDialogData.subapp.envs;
   //可用的环境列表
   $scope.envList=function(){
                $http.get('/cloudui/ws/admins/findClusterList?v=' + (new Date().getTime()))
                .success(function(data){
                  if(data != null && data.length > 0){
                  $scope.hasEnvs=true;
                     for(var i = 0; i< data.length; i++){
                        var selected=$filter('filter')($scope.selectedenv,data[i].id).length>0?true:false;
                        if(selected){
                             $("<option value='"+data[i].id+"' selected = 'selected'>"+data[i].name+"</option>").appendTo("#optionalEnvs");
                        }else{
                             $("<option value='"+data[i].id+"'>"+data[i].name+"</option>").appendTo("#optionalEnvs");
                        }

                     };
                     $("#optionalEnvs").chosen({
                        no_results_text:"没有搜索到此环境"
                     });
                 }else{
                  $scope.hasEnvs=false;
                 }
               })
           }
   $scope.envList();
   $scope.envMsg = '';
   //选择的应用系统非空，选择的环境至少为一个
   $scope.modifySubAppFn = function(obj) {
    if($scope.modifySubAppForm.$valid) {
        $http({
             method  : 'POST',
             url     : '/cloudui/ws/admins/addSubApp',
             data    : $.param({
               superUserAppId:$scope.superUserAppId,
               subUserAppId:$scope.subApp,
               envs:$scope.envs.join(';'),
               newSubApp:false
             }),
             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(function(response) {
               if ( !response.data.result ) {
                 $scope.authMsg =response.data.message;
               }else{
                   ngDialog.close();
                   $state.go('app.view-subApps',{},{ reload: true });
               }
          },function(x) {
               $scope.authMsg = '服务器请求错误';
          })
    }else {
      $scope.modifySubAppForm.envs.$dirty = true;
    }
  };
}])

mControllers.controller('addSubAppCtrl',['$scope','$http','$stateParams','$state','ngDialog','Notify',function($scope,$http,$stateParams,$state,ngDialog,Notify){
    $scope.superUserAppId = $stateParams.appid;
   //可用的环境列表
   $scope.envList=function(){
                $http.get('/cloudui/ws/admins/findClusterList?v=' + (new Date().getTime())).success(function(data){
                  if(data != null && data.length > 0){
                  $scope.hasEnvs=true;
                     for(var i = 0; i< data.length; i++){
                         $("<option value='"+data[i].id+"'>"+data[i].name+"</option>").appendTo("#optionalEnvs");
                     };
                     $("#optionalEnvs").chosen({
                        no_results_text:"没有搜索到此环境"
                     });
                 }else{
                  $scope.hasEnvs=false;
                 }
               })
           }
   //可以添加的成员系统，除去自身和已经添加过的应用系统
   $scope.optionalAppList=function(){
                  $http.get('/cloudui/ws/admins/getOptionalSubAppList?superAppId='+$scope.superUserAppId
                                    +'&v=' + (new Date().getTime())).success(function(data){
                    if(data != null && data.length > 0){
                    $scope.hasOptionalApps=true;
                       for(var i = 0; i< data.length; i++){
                           $("<option value='"+data[i].app_id+"'>"+data[i].app_name+"</option>").appendTo("#optionalSubApps");
                       };
                       $("#optionalSubApps").chosen({
                          no_results_text:"没有搜索到此应用"
                       });
                   }else{
                    $scope.hasOptionalApps=false;
                   }
                 })
             }
   $scope.optionalAppList();
   $scope.envList();
   $scope.envMsg = '';
   $scope.subAppMsg = '';
   //选择的应用系统非空，选择的环境至少为一个
   $scope.addSubAppFn = function(obj) {
    if($scope.addSubAppForm.$valid) {
        $http({
             method  : 'POST',
             url     : '/cloudui/ws/admins/addSubApp',
             data    : $.param({
               superUserAppId:$scope.superUserAppId,
               subUserAppId:$scope.subApp,
               envs:$scope.envs.join(';'),
               newSubApp:true
             }),
             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).then(function(response) {
               if ( !response.data.result ) {
                 $scope.authMsg =response.data.message;
               }else{
                   ngDialog.close();
                   $state.go('app.view-subApps',{},{ reload: true });
               }
          },function(x) {
               $scope.authMsg = '服务器请求错误';
          })
    }else {
      $scope.addSubAppForm.subApp.$dirty = true;
      $scope.addSubAppForm.envs.$dirty = true;
    }
  };
}])



/* ******添加/更新应用***** */

mControllers.controller('addOrUpdateAppCtrl',['$scope','$http','$state','Notify','ngDialog','$window',function($scope,$http,$state,Notify,ngDialog,$window){
   $scope.account = {};
   $scope.authMsg = '';
   $scope.account.name=$scope.ngDialogData.name;
   $scope.addoff=!($scope.account.name); //是否为添加

   $scope.createOrUpdateAppFn = function() {
      if($scope.addoff){
         var url='/cloudui/ws/admins/createApp'
      }else{
        var url='/cloudui/ws/admins/updateApp'
      }
      if($scope.createOrUpdateAppForm.$valid) {
          $http({
              method  : 'POST',
              url     : url,
              data    : $.param({appName:$scope.account.name}),   
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
          })
         .then(function(response) {
              if(response.data.result){
                  ngDialog.close();
                  $state.go('app.view',{},{ reload: true });
                  $window.location.reload();
              }else{
                 $scope.authMsg =response.data.message;
              }
          },function(x) {
            $scope.authMsg = '服务器请求错误';
          })
      }else { 
          $scope.createOrUpdateAppForm.name.$dirty = true;
      }
   }  
}])

/* -------------------------------环境----------------------------------------- */

/* *****创建环境***** */

mControllers.controller('createEnvCtrl',['$rootScope','$scope','$http','$state','ngDialog','$window',function($rootScope,$scope,$http,$state,ngDialog,$window){
   
  $scope.account = {};
 
  $scope.authMsg = '';
  
  $scope.envMsg=function(){
	  $scope.authMsg = '';
  }

  $scope.createclusterFn = function(obj) {
     
    $scope.authMsg = '';
   
    if($scope.createclusterForm.$valid) {
      
       // 验证名字 
      $http.get('/cloudui/ws/cluster/checkName'+ '?name='+$scope.account.name+'&v=' + (new Date().getTime()))  
        .success(function(data) {
           if(data.result)
           {
              // 新增环境     
              $http({
              method  : 'POST',
              url     : '/cloudui/ws/cluster',
              data    : $.param(
            		  {
            			  name:$scope.account.name,
            			  network_kind:'Calico',
                     	  network_type:'default',
            			  network:''
            		  }
              ),   
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
           })
              .then(function(response) {
                // 通过返回数据，没通过返回错误信息
               
                if ( !response.data.result ) {
                  $scope.authMsg = '创建失败，请重新添加环境！';
                }else{
                  ngDialog.close();
               
                  if(obj)
                  {
                     
                     $state.go('app.nodesystem',{clustername:$scope.account.name,clusterid: response.data.id},{ reload: true });
                    
                  }else
                  {
                     $state.go('app.env.nodes',{clusterid:response.data.id},{ reload: true });
                     
                  }
                }
              }, function(x) {
                $scope.authMsg = '服务器请求错误';
              });
              
           }else{
              $scope.authMsg = '此环境已存在，请重新命名！';
           }

        })

    }
    else { 
      $scope.createclusterForm.name.$dirty = true;
      $scope.createclusterForm.network.$dirty = true;
    }
  };

}])


/* *****环境列表***** */
mControllers.controller('envListCtrl', ['$rootScope','$scope','$http','ngDialog','$interval','$state','$q','Notify','chartGuage','$timeout','$stateParams','$window','$filter',
  function($rootScope,$scope,$http,ngDialog,$interval,$state,$q,Notify,chartGuage,$timeout,$stateParams,$window,$filter){
 
	if($rootScope.user.roleId=='2'){
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
	}
	
	
	
  $scope.$on('$destroy', function() {
     $interval.cancel($scope.timer);        
  });

  // 模板部署弹出框
  $scope.opendeploy = function (clusterid,clustername,host) {
	    if(host){
	    	ngDialog.open({
	            template: 'app/views/dialog_deploytemp.html'+'?action='+(new Date().getTime()),
	            className: 'ngdialog-theme-default ngdialog-sm',
	            scope: $scope,
	            closeByDocument:false,
	            cache: false,
	            data:{clusterId:clusterid,clusterName:clustername,host:host},
	            controller:'tempDeployCtrl'
	        });
	    }else{
	    	Notify.alert( 
               '<em class="fa fa-check"></em> 您的环境还没有主机，请先添加主机！', 
               {status: 'info'}
            );
	    }
   };
  
  // 新建环境弹出框
   $scope.openCreateCluster = function () {
      ngDialog.open({
        template: 'app/views/dialog_createcluster.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        scope: $scope,
        closeByDocument:false,
        cache:false,
        controller:'createEnvCtrl'
      });
   };

   // 删除环境
   $scope.opendelCluster=function(params){
      ngDialog.openConfirm({
         template:
              '<p class="modal-header">您确定要删除此环境吗?</p>' +
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
           $http({
              method:'DELETE',
              url:'/cloudui/ws/cluster/'+params
           }).success(function(data){
               if(data.result)
               {
              Notify.alert( 
                   '<em class="fa fa-check"></em> 删除成功！', 
                   {status: 'success'}
                );
                $state.go('app.env_list',{},{reload:true});
                //$window.location.reload();
               }else
               {
                 Notify.alert( 
                    '<em class="fa fa-times"></em> 删除失败！'+data.info+'请先删除环境上的主机', 
                    {status: 'danger'}
                 );
               }
           })
        }
      )
  }
   
  // 环境监控
   
   $scope.clusterMonitorCpuM=function(item)
   {
     $http.get('/cloudui/ws/monitor/host/cluster/'+item.id+'?v='+(new Date().getTime())).success(function(data){
        $rootScope[item.name+'_cpu']=data.cpu;
        $rootScope[item.name+'_mem']=Number(((data.memusage/data.memtotal)*100).toFixed(2));
        
        item.monitor=data;
     })
   }

   // 环境列表 
   
   $scope.nocluster=true;
    
   $scope.pageSize=5;
   
   $scope.onPageChange = function ()
   {
     $http.get('/cloudui/ws/admins/findClusterListOfApp'+'?v=' + (new Date().getTime()),{
          params:
              {
                appId:$rootScope.user.appId||$rootScope.app.appsession.id,
                pageNum:$scope.pageNum,
                pageSize:$scope.pageSize
              }
         }).success(function(data){
            $scope.clusterItems = data;
            if($scope.clusterItems.rows.length>0)
            {
            $scope.nocluster=false;
           
            angular.forEach(data.rows,function(val,key){
           
             if(val.host_num>0)
             {  
                 // 环境上的组件
                 $http.get('/cloudui/ws/monitor/host/cluster/app/'+val.id+'?v='+(new Date().getTime())).
                 success(function(data){
                   val.app=data;    
                 }) 
                 // 环境上的服务
                 $http.get('/cloudui/ws/apps/template/listDeployedTemplates'+'?v=' + (new Date().getTime()),{
			      params:
			          {
			            pageNum:1,
			            pageSize:1,
			            clusterId:val.id
			          }
			     }).success(function(data){
			        val.server=data.total;
			     })
                 // 环境监控  
                 $scope.clusterMonitorCpuM(val);
                 $timeout(function(){
                  
                         chartGuage.chartGaugeFn('#'+val.name+'_cpu',{
                           text:'CPU使用率',
                           series:[{
                               name: 'cpu',
                               data: [0],
                               tooltip: {
                                   valueSuffix: '%'
                               }
                           }]
                           },val.name+'_cpu');
                        
                         chartGuage.chartGaugeFn('#'+val.name+'_mem',{
                         text:'内存使用率',
                         series:[{
                               name: 'mem',
                               data: [0],
                               tooltip: {
                                   valueSuffix: '%'
                               }
                           }]
                       },val.name+'_mem');


                       });
             } 
             })
             $interval.cancel($scope.timer); 
             $scope.timer= $interval(function(){
               angular.forEach(data.rows,function(val,key){
                 if(val.host_num>0)
                 {
                   $scope.clusterMonitorCpuM(val);  
                 }  
               })
             },5000)
            }
            $scope.pageCount=Math.ceil($scope.clusterItems.total/$scope.pageSize);
            if($scope.pageCount==0){
              $scope.pageCount=1;
            }
         })
   }  
}])

/* *****环境详情页***** */

mControllers.controller('envDetailCtrl',['$rootScope','$scope','$http','$stateParams','ngDialog','$interval','$state','Notify','$filter',function($rootScope,$scope,$http,$stateParams,ngDialog,$interval,$state,Notify,$filter){
   
	if($rootScope.user.roleId=='2'){
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
	}
	
	// 部署服务
	$scope.opendeploy = function (clusterid,clustername,host) {
	    if(host){
	    	ngDialog.open({
	            template: 'app/views/dialog_deploytemp.html'+'?action='+(new Date().getTime()),
	            className: 'ngdialog-theme-default ngdialog-sm',
	            scope: $scope,
	            closeByDocument:false,
	            cache: false,
	            data:{clusterId:clusterid,clusterName:clustername,host:host},
	            controller:'tempDeployCtrl'
	        });
	    }else{
	    	Notify.alert( 
               '<em class="fa fa-check"></em> 您的环境还没有主机，请先添加主机！', 
               {status: 'info'}
            );
	    }
   };
	
	
   // 重命名环境弹出框
   $scope.openchangeCluster = function (params) {
      ngDialog.open({
        template: 'app/views/dialog_changecluster.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        scope: $scope,
        closeByDocument:false,
        cache: false,
        data:{name:params},
        controller:'changeEnvnameCtrl'
      });
   };

   // 删除环境
   
   $scope.opendelCluster=function(params){
      ngDialog.openConfirm({
         template:
              '<p class="modal-header">您确定要删除此环境吗?</p>' +
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
           $http({
              method:'DELETE',
              url:'/cloudui/ws/cluster/'+params
           }).success(function(data){
               if(data.result)
               {
                 Notify.alert( 
                	'<em class="fa fa-check"></em> 删除成功！', 
                	{status: 'success'}
                 );
                 $state.go('app.env_list',{},{ reload: true });
               }else
               {
            	  Notify.alert( 
                     '<em class="fa fa-times"></em> 删除失败！'+data.info+'请先删除环境上的主机', 
                     {status: 'danger'}
                  );
               }
          })  
        }
      )
  }

  // 环境基本信息  
 
  $http.get('/cloudui/ws/cluster/'+$stateParams.clusterid).success(function(data){
      $scope.cluster = data; 
  })

}])

/* *****重命名环境***** */

mControllers.controller('changeEnvnameCtrl',['$rootScope','$scope','$http','$state','$stateParams','ngDialog','Notify',function($rootScope,$scope,$http,$state,$stateParams,ngDialog,Notify){
       
  $scope.account = {};

  $scope.account.name=$scope.ngDialogData.name;
 
  $scope.authMsg = '';

  $scope.changeclusterNameFn = function(obj) {
     
    $scope.authMsg = '';

    if($scope.changeclusterNameForm.$valid) {
 
       // 更新验证名字 

      $http.get('/cloudui/ws/cluster/checkNameByID'+'?id='+$stateParams.clusterid+'&name='+$scope.account.name+'&v=' + (new Date().getTime()))  
        .success(function(data) {
           if(data.result)
           {
              // 重命名环境 
              $http({
                 method:'PUT',
                 url:'/cloudui/ws/cluster/'+$stateParams.clusterid,
                 data: $.param({name:$scope.account.name}),   
		         headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
              }).success(function(data){
            	  if(data.result)
                  {
                     Notify.alert(
                        '<em class="fa fa-check"></em> 重命名成功!' ,
                        {status: 'success'}
                     );
                     ngDialog.close();
                     $state.go('app.env.nodes',{clusterid:$stateParams.clusterid},{reload:true});
                  }else{
                     Notify.alert(
                        '<em class="fa fa-times"></em> 重命名失败!' ,
                        {status: 'danger'}
                     );
                  } 
              })
           }else{
              $scope.authMsg = '此环境已存在，请重新命名！';
           }

        })

    }
    else { 
      $scope.changeclusterNameForm.name.$dirty = true;
    }
  };

}])

/* *****环境上的主机列表***** */

mControllers.controller('nodesListCtrl',['$rootScope','$scope','$http','$stateParams','ngDialog','Notify','$state','$filter','$interval',function($rootScope,$scope,$http,$stateParams,ngDialog,Notify,$state,$filter,$interval){

  $scope.$on('$destroy', function() {
	 $interval.cancel($scope.timer);  
  });
	
  $scope.checkappId=[]; // 选中的主机
  
  // 主机列表 
  $scope.pageSize=10;
  $scope.onPageChange = function ()
  {

     $http.get('/cloudui/ws/cluster/'+$stateParams.clusterid+'/nodes'+'?v='+(new Date().getTime()),{
     params:
         {
           pageNum:$scope.pageNum,
           pageSize:$scope.pageSize,
           labels:$scope.searchval||''
         }
    }).success(function(data){
      
      angular.forEach(data.rows,function(val,key){
           var ischecked=$filter('filter')($scope.checkappId,val.id).length>0?true:false;
           data.rows[key].ischecked=ischecked;
      })
           
       $scope.nodeslist = data;
       $scope.nodelistoff=data.rows.length>0?true:false;
       $scope.warninginfo='提示：暂无主机';
       
       $scope.nodeMonitorFn=function(){
    	   angular.forEach($scope.nodeslist.rows,function(val,key){
               
               val.orilabels=val.labels;
               
                 // 主机的cpu、mem
                 $http.get('/cloudui/ws/monitor/host/'+val.ip+'?v='+(new Date().getTime())).success(function(data){
                   
                  data.cpu=Math.ceil(data.cpu);
                    val.monitor=data;    
                 })
                 // 主机上的应用
                 $http.get('/cloudui/ws/monitor/host/app/'+val.ip+'?v='+(new Date().getTime())).success(function(data){
                    val.app=data;    
                 })
                  
             })
       }
       
       $scope.nodeMonitorFn();
       
       $scope.timer=$interval(function(){
       	  $scope.nodeMonitorFn();
       },3000)
       
       $scope.pageCount=Math.ceil($scope.nodeslist.total/$scope.pageSize);
         if($scope.pageCount==0){
           $scope.pageCount=1;
         }
    }).error(function(){
         $scope.nodelistoff=false;
         $scope.warninginfo='暂无结果';
    })
  }

     
   // 按标签名搜索主机
   $scope.searchLabel=function()
   {
       $scope.pageNum=1;
       $scope.onPageChange();
   }
   
  // 增加主机标签弹窗
    $scope.openaddLabelFn = function (params) {
      ngDialog.open({
        template: 'app/views/dialog_nodelabel.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-sm',
        data:{clusterid:$stateParams.clusterid,nodeid:params},
        scope: $scope,
        closeByDocument:false,
        cache:false,
        controller:'addLabelCtrl'
      });
    };
    
    
   // 编辑标签
    
    $scope.getitemid=function(item,id,ev,index){
    	 
       $scope.itemid=id;
       $scope.editlabel=function(data){
          
         var oriarr=item.orilabels.split(',');
        
         var oriarrkey=[];
         angular.forEach(oriarr,function(val,key){
          oriarrkey.push(val.split('=')[0])
         })
        
         var curarr=data.split(',');
         
         var curarrkey=[];
         angular.forEach(curarr,function(val,key){
          curarrkey.push(val.split('=')[0])
         })
      
        var lenarr=[];
         
        for(var i=0;i<oriarrkey.length;i++)
        {
         var isexit=$filter('filter')(curarrkey,oriarrkey[i],true);
         
         if(isexit.length>1)
         {
          lenarr.push(isexit.length) 
         }
        }

       
       if(lenarr.length<=0)
       {

    	   $http({
               method  : 'PUT',
               url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/node/'+$scope.itemid+'/updatelabel',
               data    : $.param({labels:data}),   
             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
           }).success(function(data){
               if(data.result)
               {
                 Notify.alert(
                     '<em class="fa fa-check"></em> 修改成功！' ,
                     {status: 'success'}
                 );
               }else
               {
                 Notify.alert(
                    '<em class="fa fa-times"></em> 修改失败！' ,
                    {status: 'danger'}
                 );
                 $state.go('app.env.nodes',{clusterid:$stateParams.clusterid},{reload:true});
               }
           })
       }else{
             Notify.alert(
                   '有重复的标签key值，请重新输入！' ,
                   {status: 'info'}
              );
             $state.go('app.env.nodes',{clusterid:$stateParams.clusterid},{reload:true});
       }
         

       }
    }
    
   
   // 刷新主机列表
   $scope.refreshNodeList=function()
   {
     $scope.onPageChange();
   }
    
   // 删除主机
   
   $scope.delNodeHttp=function(ids,index){
     $rootScope.app.layout.isShadow=true;
     $http({
           method:'DELETE',
           url:'/cloudui/ws/cluster/deleteNode',
           data: $.param({ids:ids}),   
         headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
          $rootScope.app.layout.isShadow=false;
            if(data.result)
            {
              Notify.alert(
                '<em class="fa fa-check"></em> 删除成功！' ,
                {status: 'success'}
              );
              
              if(index)
              {
                 $scope.nodeslist.rows.splice(index, 1);
              }else{
                $state.go('app.env.nodes',{clusterid:$stateParams.clusterid},{reload:true});
              }
              
              
            }else
            {
              Notify.alert(
                '<em class="fa fa-check"></em> 删除失败！' ,
                {status: 'danger'}
              );
            }
        }) 
   }

   $scope.delNodeFn=function(params,index,state)
   {
    
     var statearr=[];
     if(angular.isObject(params)){
       angular.forEach(params,function(val,key){
              var varstate=eval(val.split('_')[2]);
              statearr.push(varstate)
           })
           var runningState=$filter('filter')(statearr,'false').length>0?true:false;
     }else{
     var runningState=!state; 
     } 
      
     if(runningState){
       Notify.alert(
               '主机有异常，不可删除！' ,
                {status: 'info'}
            );
     }else{
       ngDialog.openConfirm({
             template:
                 '<p class="modal-header">您确定要删除吗?</p>' +
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
            var idsarr=[];
              var ids='';
              var editablearr=[];
            
              if(angular.isObject(params)){
                
                angular.forEach(params,function(val,key){
                   
                    var vareditable=eval(val.split('_')[0]);
                    var varid=val.split('_')[1];
                    editablearr.push(vareditable)
                    idsarr.push(varid);
                  })
                  
                  ids=idsarr.join(',');

                  if($filter('filter')(editablearr,false).length>0)
                  {
                    Notify.alert(
                        '某主机上有正在运行的组件，不可删除！' ,
                       {status: 'info'}
                      );
                  }else
                  {
                    $scope.delNodeHttp(ids);
                  }
              }else{
                var vareditable=eval(params.split('_')[0]);
                  ids=params.split('_')[1];
                
                  if(vareditable)
                  {
                    $scope.delNodeHttp(ids,index);
                  }else
                  {
                    Notify.alert(
                        '主机上有正在运行的组件，不可删除！' ,
                        {status: 'info'}
                      );
                    return false;
                  }
              } 
            }
         )
     }
      
   }

   $scope.openDelNodeFn=function(params,index,state){
    
       if(params)
       {
          $scope.delNodeFn(params,index,state);
       }else
       {
         var checkbox = $scope.checkappId;
          if(checkbox.length==0)
          {
             Notify.alert(
                '请选择您要删除的主机!' ,
                {status: 'info'}
             );
          }else
          {
             $scope.delNodeFn(checkbox);
          }
       }
   }  
   
   // 主机上的组件列表
   
   $scope.openComponentOnNode = function (params) {
      ngDialog.open({
        template: 'app/views/dialog_component_list.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-sm',
        data:{ip:params},
        scope: $scope,
        closeByDocument:false,
        cache:false,
        controller:'nodeAssemblyList'
      });
   };
     
}])

/* *****添加主机标签***** */
mControllers.controller('addLabelCtrl',['$scope','$http','$state','ngDialog','Notify',function($scope,$http,$state,ngDialog,Notify){
	 
    $scope.labellist=[];
    $scope.addLabelFn=function(){
       $scope.inserted = {
          id: $scope.labellist.length+1,
          key: '',
          val: ''
      };
      $scope.labellist.push($scope.inserted);
    }
    $scope.removeLabel=function(index){
      $scope.labellist.splice(index, 1);
    }
    // 验证表单
    $scope.submitted = false;
    $scope.validateInput = function(name, type) {
        var input = $scope.formlabel[name];
        return (input.$dirty || $scope.submitted) && input.$error[type];
     };

    // 提交信息
    $scope.submitLabelForm=function(){
    	$scope.submitted = true;
	    if ($scope.formlabel.$valid) {
	    	if($scope.labellist.length>0){
	            $scope.labels='';
	            angular.forEach($scope.labellist,function(val,key){
	               if(key+1==$scope.labellist.length)
	               {
	                  $scope.labels+=(val.key+'='+val.val);
	               }else
	               {
	                  $scope.labels+=(val.key+'='+val.val)+',';
	               }
	               
	            })

	            if($scope.labels)
	            {
	            	$http({
	            		method:'PUT',
	            		url:'/cloudui/ws/cluster/'+$scope.ngDialogData.clusterid+'/node/'+$scope.ngDialogData.nodeid+'/updatelabel',
	            		data: $.param({labels:$scope.labels}),
	            		headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	            	}).success(function(data){
	            		if(data.result)
            			{
            			   Notify.alert(
            	              '<em class="fa fa-check"></em> 添加成功！' ,
            	              {status: 'success'}
            	           );
            			   ngDialog.close();
            			   if($scope.ngDialogData.node)
            			   {
            				   $state.go('app.node.monitoring',{clusterid:$scope.ngDialogData.clusterid},{reload:true});  
            			   }else
            			   {
            				   $state.go('app.env.nodes',{clusterid:$scope.ngDialogData.clusterid},{reload:true});  
            			   }
            			   
            			}else
        				{
        				   Notify.alert(
                 	         '<em class="fa fa-times"></em> 添加失败！' ,
                 	         {status: 'danger'}
                 	       );
        				}
	            	})
	            }
	        }else
	        {
	        	Notify.alert(
	               '请添加标签!' ,
	               {status: 'info'}
	            );
	        }
	    }else
	    {
	    	Notify.alert(
		      '请输入标签的名称/值!' ,
		      {status: 'info'}
		    );
	    }
      
  

    }

}])

/* *****环境上的服务***** */

mControllers.controller('serverListCtrl',['$rootScope','$scope','$http','ngDialog','Notify','$state','$interval','$stateParams',function($rootScope,$scope,$http,ngDialog,Notify,$state,$interval,$stateParams){

	$scope.$on('$destroy', function() {
		 $interval.cancel($scope.timer);  
	});
	
	
	// 服务列表
    $scope.pageSize=10;

    $scope.onPageChange = function (pageNum)
    {   
      $http.get('/cloudui/ws/apps/template/listDeployedTemplates'+'?v=' + (new Date().getTime()),{
      params:
          {
            pageNum:pageNum,
            pageSize:$scope.pageSize,
            templateName:$scope.searchval,
            clusterId:$stateParams.clusterid
          }
     }).success(function(data){
        $scope.templist = data;
        $scope.listoff=data.total>0?true:false;
        $scope.warninginfo='提示：暂无部署的服务';
        $scope.pageCount=Math.ceil($scope.templist.total/$scope.pageSize);
        if($scope.pageCount==0){
        	$scope.pageCount=1;
        }
       angular.forEach(data.rows,function(val,key){
        	
        	if(val.type=='storm'){
        		$http.get('/cloudui/ws/apps/template/getStormuiUrl'+'?v='+(new Date().getTime()),{
        		params:{
        			templateUUID:val.UUID
        		}
        	    }).success(function(data){
        	    	if(data!=='error'){
        	    		val.uiurl=data;
        	    	}
        	    	 
        	    })
        	}else if(val.type=='spark'){
        		$http.get('/cloudui/ws/apps/template/getSparkUrl'+'?v='+(new Date().getTime()),{
            		params:{
            			templateUUID:val.UUID
            		}
            	}).success(function(data){
            		if(data!=='error'){
        	    		val.uiurl=data;
        	    	}
            	})
        	}
        	 
        	
        }) 
     }).error(function(){
         $scope.listoff=false;
         $scope.warninginfo='暂无结果';
     })
    }
    
    $scope.timer=$interval(function(){
    	$scope.onPageChange($scope.pageNum);
    },3000)

    // 搜素服务
    $scope.searchTemp=function(e)
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

    // 服务启动  
    $scope.startTemp=function(param){
    	 ngDialog.open({
    	      template: 'app/views/dialog_choseServerConfigVersion.html'+'?action='+(new Date().getTime()),
    	      className: 'ngdialog-theme-default ngdialog-sm',
    	      scope: $scope,
    	      closeByDocument:false,
    	      data:{uuid:param},
    	      cache: false,
    	      controller:'choseServerConfigVersionCtrl'
    	 });
    }

    
    // 服务停止
    $scope.stopTemp=function(param){
    	$rootScope.app.layout.isShadow=true;
    	$http.get('/cloudui/ws/apps/template/stopTemplate'+'?v='+(new Date().getTime()),{
    		params:{
    			templateUUID:param
    		}
    	}).success(function(data){
    		$rootScope.app.layout.isShadow=false;
    		if(data.result)
    	    {
    			Notify.alert(
	              '<em class="fa fa-check"></em> '+data.message ,
	              {status: 'success'}
	            );
    	    }else{
    	    	Notify.alert(
	                '<em class="fa fa-times"></em> '+data.message ,
	                {status: 'danger'}
	             );
    	    }
    	})
    }
    // 服务卸载
    $scope.uninstallTemp=function(param){
    	$rootScope.app.layout.isShadow=true;
    	$http.get('/cloudui/ws/apps/template/destroyTemplate'+'?v='+(new Date().getTime()),{
    		params:{
    			templateUUID:param
    		}
    	}).success(function(data){
    		$rootScope.app.layout.isShadow=false;
    		if(data.result)
    	    {
    			Notify.alert(
	              '<em class="fa fa-check"></em> '+data.message ,
	              {status: 'success'}
	            );
    	    }else{
    	    	Notify.alert(
	                '<em class="fa fa-times"></em> '+data.message ,
	                {status: 'danger'}
	             );
    	    }
    	})
    }
    // 服务删除
    $scope.delTemp=function(param){
    	ngDialog.openConfirm({
	         template:
	              '<p class="modal-header">您确定要删除此模板吗?</p>' +
	              '<div class="modal-body text-right">' +
	                '<button type="button" class="btn btn-default mr20" ng-click="closeThisDialog(0)">取消' +
	                '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
	              '</button></div>',
	        plain: true,
	        closeByDocument:false,
	        className: 'ngdialog-theme-default'
	   }) .then(
		    function(){
		     $rootScope.app.layout.isShadow=true;
		      $http.delete('/cloudui/ws/apps/template/deleteTemplate'+'?v='+(new Date().getTime()),{
		 		   params:{
		 			  templateUUID:param 
		 		   }
		 	   }).success(function(data){
		 		  $rootScope.app.layout.isShadow=false;
		 	      if(data.result)
		 		  {
		 	    	  Notify.alert(
		                '<em class="fa fa-check"></em> '+data.message ,
		                {status: 'success'}
		 	          );  
		 		  }else
		 		  {
		 			  Notify.alert(
		                '<em class="fa fa-times"></em> '+data.message ,
		                {status: 'danger'}
		 	          ); 
		 		  }
		 	   })    
	   })
    }
    
    // 服务配置
    $scope.ToServerConfig=function(clustername,clusterid,configid){
    	$state.go('app.config_storm',{args:{
    		clusterName:clustername,
    		clusterId:clusterid,
    		configId:configid
    	}})
    }
}])

/* *****服务启动选择配置***** */

mControllers.controller('choseServerConfigVersionCtrl',['$rootScope','$scope','$http','Notify','ngDialog',function($rootScope,$scope,$http,Notify,ngDialog){
	// 配置版本列表
	$http.get('/cloudui/ws/apps/listTemplateSnapshoots'+'?v='+(new Date().getTime()),{
	     params:{
	       templateUUID:$scope.ngDialogData.uuid
	     }
	 }).success(function(data){
	       $scope.configlist=data;
	       $scope.config=$scope.configlist[0].id;
	 })
	// 启动服务
	$scope.startServer=function(){
		$rootScope.app.layout.isShadow=true;
    	$http.get('/cloudui/ws/apps/template/startTemplate'+'?v='+(new Date().getTime()),{
    		params:{
    			templateUUID:$scope.ngDialogData.uuid,
    			snapshootId:$scope.config
    		}
    	}).success(function(data){
    		$rootScope.app.layout.isShadow=false;
    		ngDialog.close();
    		if(data.result)
    	    {
    			Notify.alert(
	              '<em class="fa fa-check"></em> '+data.message ,
	              {status: 'success'}
	            );
    	    }else{
    	    	Notify.alert(
	                '<em class="fa fa-times"></em> '+data.message ,
	                {status: 'danger'}
	             );
    	    }
    	})
	}
}])

/* *****环境监控*****  */

mControllers.controller('envMonitorCtrl',['$rootScope','$scope','$http','$stateParams','$interval','chartGuage',function($rootScope,$scope,$http,$stateParams,$interval,chartGuage){
	
   $scope.$on('$destroy', function() {
      $interval.cancel($scope.timer);       
   });

   // 集群监控应用列表  
   $scope.clusterappMonitorFn=function()
   {
	   $http.get('/cloudui/ws/monitor/host/cluster/app/'+$stateParams.clusterid+'?v='+(new Date().getTime())).success(function(data){
	      $scope.clusterappMonitor=data; 
          angular.forEach(data,function(val,key){
        	  $http.get('/cloudui/ws/monitor/app/'+val.appid+'?v='+(new Date().getTime())).
        	  success(function(data){
        		  val.monitor=data;
        	  })
          })   
	    }) 
   }
   
   $scope.clusterappMonitorFn();
	   
   // 集群监控  

   $scope.clusterMonitorFn=function()
   {  
      $http.get('/cloudui/ws/monitor/host/cluster/'+$stateParams.clusterid+'?v='+(new Date().getTime())).success(function(data){
           $scope.clusterMonitor=data; 
           $rootScope.clusterCpu=data.cpu;
           $rootScope.clusterMem=Number(((data.memusage/data.memtotal)*100).toFixed(2));;
      }) 
   }

   $scope.clusterMonitorFn();
   $interval.cancel($scope.timer);
   $scope.timer=$interval(function(){
       $scope.clusterMonitorFn();
      // $scope.clusterappMonitorFn();
   },5000)
   chartGuage.chartGaugeFn('#cluster_cpu',{
	    text:'CPU使用率',
	    series:[{
	          name: 'cpu',
	          data: [0],
	          tooltip: {
	              valueSuffix: '%'
	          }
	      }]
	    },'clusterCpu');

	    chartGuage.chartGaugeFn('#cluster_mem',{
	    text:'内存使用率',
	    series:[{
	          name: 'mem',
	          data: [0],
	          tooltip: {
	              valueSuffix: '%'
	          }
	      }]
	    },'clusterMem');
}])

/* *****环境上的用户***** */

mControllers.controller('envUserCtrl',['$scope','$http','$stateParams','ngDialog','Notify','$filter','$state',function($scope,$http,$stateParams,ngDialog,Notify,$filter,$state){
   
  $scope.checkappId=[]; // 选中的用户 
  $scope.pageSize=10; 
  $scope.onPageChange = function ()
  {
     $http.get('/cloudui/ws/cluster/'+$stateParams.clusterid+'/users'+'?v='+(new Date().getTime()),{
     params:
         {
           pageNum:$scope.pageNum,
           pageSize:$scope.pageSize
         }
    }).success(function(data){

       angular.forEach(data.rows,function(val,key){
         var ischecked=$filter('filter')($scope.checkappId,val.ID).length>0?true:false;
         data.rows[key].ischecked=ischecked;
       })

       $scope.userlist = data;
      
       $scope.pageCount=Math.ceil($scope.userlist.total/$scope.pageSize);
       
       if($scope.pageCount==0){
    	   $scope.pageCount=1;
       }
        
    })
  }

  // 添加用户
    
  // 添加老用户弹窗
  $scope.addOldUser=function(){
      
      ngDialog.open({
        template: 'app/views/dialog_addolduser.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-sm',
        closeByEscape: false,
        closeByDocument:false,
        cache:false,
        controller:'addOldUserCtrl'
      }); 
  }
  
  // 更改用户配额
  
  $scope.updateuser=function(item){
	  ngDialog.open({
        template: 'app/views/dialog_updateuser.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        cache:false,
        closeByDocument:false,
        data:{userinfo:item},
        controller:'updateUserCtrl'
       });  
  }

  // 删除用户
   
   $scope.delUserHttp=function(ids,index){
      
     $http({
           method:'DELETE',
           url:'/cloudui/ws/cluster/'+$stateParams.clusterid+'/deleteuser', 
           data: $.param({user_ids:ids}),   
             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
            if(data.result)
            {
              Notify.alert(
                '<em class="fa fa-check"></em> 删除成功！' ,
                {status: 'success'}
              );

              if(index)
              {
                 $scope.userlist.rows.splice(index, 1);
              }else{
                $state.go('app.env.user',{clusterid:$stateParams.clusterid},{reload:true});
              }
              
               
            }else
            {
              Notify.alert(
                '<em class="fa fa-check"></em> 删除失败！' ,
                {status: 'danger'}
              );
            }
        }) 
   }

   $scope.delUserFn=function(params,index)
   {   
       ngDialog.openConfirm({
           template:
               '<p class="modal-header">您确定要删除吗?</p>' +
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

            var ids='';
            
            if(angular.isNumber(params))
            {
              ids=params;
              $scope.delUserHttp(ids,index);
            }else
            {  
              ids=params.join(',');
              $scope.delUserHttp(ids);
            }  
          }
       )
   }

   $scope.openDelUserFn=function(params,index){
       if(params)
       {
          $scope.delUserFn(params,index);
       }else
       {
           
          var checkbox = $scope.checkappId;
         
          if(checkbox.length==0)
          {
             Notify.alert(
                '请选择您要删除的用户!' ,
                {status: 'info'}
             );
          }else
          {
             $scope.delUserFn(checkbox);
          }
       }
   }

}])

/* *****更改用户配额***** */

mControllers.controller('updateUserCtrl',['$scope','$http','ngDialog','$stateParams','$state',function($scope,$http,ngDialog,$stateParams,$state){
   var userinfo=$scope.ngDialogData.userinfo;
   $scope.user = {};
   $scope.user.cpu=userinfo.cpu;
   $scope.user.memory=userinfo.memory;
   $scope.user.disk=userinfo.disk;
   $scope.authMsg = '';
   
   $scope.updateUserFn = function() {
     
    $scope.authMsg = '';
   
    if($scope.updateUserForm.$valid) {
       
        // 提交用户配额
        $http({
          method  : 'PUT', 
          url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/updateuser',
          data    : $.param({
        	ID:userinfo.ID,
            cpu:$scope.user.cpu,
            memory:$scope.user.memory,
            disk:$scope.user.disk
          }),   
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
       }).then(function(response) {  
            if ( !response.data.result ) {
              $scope.authMsg =response.data.info;
            }else{
                ngDialog.close();
                $state.go('app.env.user',{clusterid:$stateParams.clusterid},{ reload: true });
            }  
       },function(x) {
            $scope.authMsg = '服务器请求错误';
       })
       
    }
    else { 
     
      $scope.updateUserForm.cpu.$dirty = true;
      $scope.updateUserForm.memory.$dirty = true;
      $scope.updateUserForm.disk.$dirty = true;
    }
  };
   
}])

/* *****在环境下添加老用户***** */

mControllers.controller('addOldUserCtrl',['$scope','$http','$stateParams','$state','ngDialog','Notify',
function($scope,$http,$stateParams,$state,ngDialog,Notify){
     
	  // 添加新用户弹窗
	  $scope.addNewUser=function(closeThisDialog){
	     
		  closeThisDialog();
		  
	      ngDialog.open({
	        template: 'app/views/dialog_addnewuser.html'+'?action='+(new Date().getTime()),
	        className: 'ngdialog-theme-default',
	        closeByEscape: false,
	        closeByDocument:false,
	        cache:false,
	        controller:'addNewUserCtrl'
	      }); 
	  }
	  
  // 已有用户列表
  $scope.userList=function()
  {     
       $http.get('/cloudui/ws/cluster/'+$stateParams.clusterid+'/userlist'+'?v=' + (new Date().getTime())).success(function(data){
         if(data != null && data.length > 0){  
           
        	$scope.hasOldUser=true;
        	
            for(var i = 0; i< data.length; i++){  

                $("<option value='"+data[i].ID+"'>"+data[i].USERID+"</option>").appendTo("#userd"); 
               
            }  

            $("#userd").chosen({
               no_results_text:"没有搜索到此人"
            });  
                      
        }else{
        	$scope.hasOldUser=false;
        }  

      })
  }
  $scope.userList();
  
  // 添加老用户
  
  $scope.addOldUserFn=function(){

    if($scope.users)
    {
       $http({
              method  : 'POST',
              url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/selectuser',
              data    : $.param({
                user_ids:$scope.users.join(',')
              }),   
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      }).then(function(response) {
         if ( !response.data.result ) {
            $scope.authMsg ='添加用户失败，请重新添加！';
          }else{
              ngDialog.close();
              $state.go('app.env.user',{clusterid:$stateParams.clusterid},{ reload: true });
          }
      })
    }else
    {  
      Notify.alert(
         '请选择要添加的用户' ,
         {status: 'info'}
      );
    }
  }
 
}])


/* *****在环境下添加新用户***** */

mControllers.controller('addNewUserCtrl',['$scope','$http','$stateParams','$state','ngDialog',function($scope,$http,$stateParams,$state,ngDialog){
     
   $scope.user = {};
 
   $scope.authMsg = '';
 
   $scope.addNewUserFn = function() {
     
    $scope.authMsg = '';
   
    if($scope.addNewUserForm.$valid) {
      // 验证用户是否存在
      $http({
              method  : 'POST',
              url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/checkuser',   
              data    : $.param({USERID:$scope.user.name}),   
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
      }).success(function(data){

         if(data.result)
         {
        	 var RSA=$http.get('/cloudui/ws/RSA'+'?v='+(new Date().getTime())).success(function(data){
          	   $scope.modulus=data.modulus;
          	   $scope.exponent=data.exponent;
             })
             
             RSA.then(function(res){
          	   $scope.modulus=res.data.modulus;
          	   $scope.exponent=res.data.exponent;
          	   var key = RSAUtils.getKeyPair($scope.exponent, '', $scope.modulus);
          	   pwd = RSAUtils.encryptedString(key, $scope.user.password);
              
          	   // 添加新用户  
               $http({
                 method  : 'POST',
                 url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/adduser',
                 data    : $.param({
                   USERID:$scope.user.name,
                   USERPASSWORD:pwd,
                   cpu:0,
                   memory:0,
                   disk:0
                 }),   
                 headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
                }).then(function(response) {  
                   if ( !response.data.result ) {
                     $scope.authMsg ='添加用户失败，请重新添加！';
                   }else{
                       ngDialog.close();
                       $state.go('app.env.user',{clusterid:$stateParams.clusterid},{ reload: true });
                   }  
                },function(x) {
                   $scope.authMsg = '服务器请求错误';
                })
              
            })

         }else
         {
            $scope.authMsg = '此用户已存在，请重新命名！';
         }
      })

    }
    else { 
      $scope.addNewUserForm.name.$dirty = true;
      $scope.addNewUserForm.password.$dirty = true;
      $scope.addNewUserForm.cpu.$dirty = true;
      $scope.addNewUserForm.memory.$dirty = true;
      $scope.addNewUserForm.disk.$dirty = true;
    }
  };
}])



/* *****环境搭建向导***** */

mControllers.controller('envGuideCtrl',['$rootScope','$scope','$http','ngDialog','$interval','Notify','$state',function($rootScope,$scope,$http,ngDialog,$interval,Notify,$state){
	
	$scope.formdata={};
	
	$scope.exitauthMsg=''
	
	$scope.authMsg=''
		
    $scope.pagenode=false;
	
	$scope.$on('$destroy', function() {
        $interval.cancel($scope.nodeTimer); 
    });
     
     
     // 创建环境
     
     $scope.createEnv=function(wizard){
    	 
    	 var isExitCluster=($scope.formdata.envName==$scope.cluster);
    	 if($scope.clusterId&&isExitCluster){
    		 wizard.go(2);
    	 }else{
    		 
    		 if($scope.formdata.envName.length>0){
    			// 验证环境名称
            	 $http.get('/cloudui/ws/cluster/checkName'+ '?name='+$scope.formdata.envName+'&v=' + (new Date().getTime()))  
                 .success(function(data) {
                	 
                	 if(data.result)
                	 {
                		 // 添加环境
                		 $http({
                             method  : 'POST',
                             url     : '/cloudui/ws/cluster',
                             data    : $.param(
                               {
                            	 name:$scope.formdata.envName,
                            	 network_kind:'Calico',
                            	 network_type:'default',
                            	 network:''
                            	}
                              ),   
                             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
                          })
                          .then(function(response) {
                               // 通过返回数据，没通过返回错误信息
                               if ( !response.data.result ) {
                                 $scope.authMsg = '创建失败，请重新添加环境！';
                               }else{
                            	   $scope.cluster=$scope.formdata.envName;
                            	   $scope.clusterId=response.data.id;
                            	   wizard.go(2);
                            	   $scope.pagenode=true;
                            	   // 刷新主机列表
                            	   $scope.nodeTimer=$interval(function(){
                            	    	$scope.onPageChange(1);
                            	    },3000)
                               }
                             }, function(x) {
                               $scope.authMsg = '服务器请求错误';
                             }
                         );
                	 }else{
                		 $scope.exitauthMsg = '此环境已存在，请重新命名！'; 
                	 }
                 })
    		 }else{
    			 
    			 wizard.go(2);
    		 }
    		 
    	 }

     }
     
     $scope.envMeg=function(){
    	 $scope.exitauthMsg ='';
     }
     
     // 添加主机弹出框
     $scope.openAddNode = function () {
	    ngDialog.open({
	      template: 'app/views/dialog_addnode.html'+'?action='+(new Date().getTime()),
	      className: 'ngdialog-theme-default ngdialog-lg',
	      scope: $scope,
	      closeByDocument:false,
	      data:{clusterid:$scope.clusterId},
	      cache: false,
	      controller:'addNode'
	    });
     };
     
     // 主机列表

     $scope.pageSize=10;
     $scope.onPageChange = function (pageNum)
     {
    	 $scope.loadoff=true;
		 $http.get('/cloudui/ws/cluster/'+$scope.clusterId+'/nodes'+'?v='+(new Date().getTime()),{
	        params:
	            {
	              pageNum:pageNum,
	              pageSize:$scope.pageSize
	            }
	       }).success(function(data){
	          $scope.nodeslist = data;
	          $scope.nodelistoff=data.rows.length>0?true:false;
	       }).error(function(){
	           $scope.nodelistoff=false;
	       }) 
        
     }

     // 编排模板列表
     $scope.getTempList=function(){
        $http.get('/cloudui/ws/apps/template/listTemplates'+'?v=' + (new Date().getTime()),{
        params:
            {
              pageNum:1,
              pageSize:10000,
              isPublic:false
            }
       }).success(function(data){
          $scope.tempList = data.rows;
          $scope.formdata.temp=$scope.tempList[0];
       })
     }
     
     // 配置参数
     $scope.$watch('formdata.temp',function(newval,oldval){
        if(newval){
        	// 模板下的配置参数
             $scope.paramlist=[];
             angular.forEach(newval.source.input,function(val,key){
               var obj={};
               obj.key=key;
               obj.placeholder=val;
               $scope.paramlist.push(obj);
            })
            // 模板下的组件及实例数
	        $http.get('/cloudui/ws/apps/componentInstanceNum'+'?v='+(new Date().getTime()),{
	        	  params:{
	        		  templateInfoUUID:newval.UUID  
	        	  }
	         }).success(function(data){
	        	 $scope.componentList=[]; 
	        	 angular.forEach(data,function(val,key){
	                 var obj={};
	                 obj.key=key;
	                 obj.val=parseInt(val);
	                 $scope.componentList.push(obj);
	              })
	         })
        }
     })
     
     $scope.setService=function(wizard){
    	 if($scope.nodeslist.total>0){
    		 $scope.getTempList();
        	 wizard.go(3);
    	 }else{
    		 Notify.alert(
  	               '还没有可用的主机节点',
  	               {status: 'info'}
  			 ); 
    	 }	 
     } 
     
    // 获取服务节点
     $scope.getNodes=function(wizard){
    	 // 配置参数 
    	 $scope.input={};
    	 angular.forEach($scope.paramlist,function(val,key){
     	      $scope.input[val.key]=val.val;
     	 })
     	 // 组件实例
     	 $scope.componentInstanceNum={};
	     angular.forEach($scope.componentList,function(val,key){
		      $scope.componentInstanceNum[val.key]=val.val;
	     })
     	 $rootScope.app.layout.isShadow=true;
	     // 创建应用
	     $http.get('/cloudui/ws/apps/template/deployTemplate'+'?v='+(new Date().getTime()),{
			   params:{
				   "templateInfoUUID":$scope.formdata.temp.UUID,
				   "templateName":$scope.formdata.templatename,
			       "input":$scope.input,
			       "clusterId":$scope.clusterId,
			       "componentInstanceNum":$scope.componentInstanceNum
			   }
		  }).success(function(data){
			   var deployTemplateData=data;
			   if(deployTemplateData.result)
			   {
				   // 创建实例
				   $http.get('/cloudui/ws/apps/template/deployAppsInTemplate'+'?v='+(new　Date().getTime()),{
						  params:{
							  templateUUID:deployTemplateData.templateUUID,
							  doDeploy:false
						  }
				   }).success(function(data){
					   var deployAppsInTemplate=data;
					   if(deployAppsInTemplate.result){
						   // 发送命令
						   $http.get('/cloudui/ws/apps/sendDeployCommand'+'?v='+(new Date().getTime()),{
								 params:{
									 templateUUID:deployTemplateData.templateUUID
								 }
						  }).success(function(data){
							  var sendData=data;
							  if(sendData.result){
								  // 获取节点
								  $http.get('/cloudui/ws/apps/findTemplateDeployHosts'+'?v='+(new Date().getTime()),{
										 params:{
											 templateUUID:deployTemplateData.templateUUID
										 }
								  }).success(function(data){
										 var findTemplateDeployHosts=data;
										 $rootScope.app.layout.isShadow=false;
										 $scope.serverNodes=findTemplateDeployHosts;
										 wizard.go(4);
								  })
							  }else{
								  $rootScope.app.layout.isShadow=false;
								  Notify.alert(
							           '<em class="fa fa-check"></em> '+sendData.message ,
							           {status: 'success'}
								  );
							  }
						  })
					   }else{
						   $rootScope.app.layout.isShadow=false;
						   Notify.alert(
					           '<em class="fa fa-check"></em> '+deployAppsInTemplate.message ,
					           {status: 'success'}
						   );
					   }
				   })
			   }else{
				   $rootScope.app.layout.isShadow=false;
				   // 不能进行下一步操作
				   Notify.alert(
		               '<em class="fa fa-check"></em> '+deployTemplateData.message ,
		               {status: 'success'}
				   );
			   }
		   })
    	   
     }
     
     // 完成 
     $scope.finishDeploy=function(){
 		$state.go('app.env.service',{clusterid:$scope.clusterId},{reload:true})
 	}
  
}])

/* ----------------------------主机--------------------------------------- */

/* *****选择主机系统***** */

mControllers.controller('nodesystemController',['$rootScope','$scope','$stateParams','$filter','$http',function($rootScope,$scope,$stateParams,$filter,$http){
	
	if($rootScope.user.roleId=='2'){
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
	}
	
    
	$scope.clusterid=$stateParams.clusterid;

	$scope.clustername=$stateParams.clustername;
	
}])

/* *****添加主机***** */

mControllers.controller('addNode',['$rootScope','$scope','$http','ngDialog','$stateParams','$state','$interval','Notify',function($rootScope,$scope,$http,ngDialog,$stateParams,$state,$interval,Notify){

  $scope.clusterid=$stateParams.clusterid;
	  
  $scope.clustername=$stateParams.clustername;
	
  $scope.formnodeData={};
  
  $scope.getUrl=function(clusterid,os_version){
	 $http.get('/cloudui/ws/cluster/'+clusterid+'/nodeurl'+'?v='+(new Date().getTime()),{
		 params:{os_version:os_version}  
	  }).success(function(data){
		  $scope.scripturl=data;
	  }) 
 }
  
 if($scope.ngDialogData){
	 
	 $scope.nodeSystemList=[
   	     'Ubuntu',
   	     'CentOS'
   	 ]
   	 
   	 $scope.formnodeData.system=$scope.nodeSystemList[0];
	 
	 $scope.$watch('formnodeData.system',function(newval,oldval){
		 if(newval){
			 $scope.getUrl($scope.ngDialogData.clusterid,newval)
		 }
	 })
	 
 }else{
	 $scope.getUrl($stateParams.clusterid,$stateParams.os_version) 
 }
  
  // 验证表单
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
    var input = $scope.formaddnode[name];
    return (input.$dirty || $scope.submitted) && input.$error[type];
  };
  
  $scope.labellist=[];
  
  $scope.addLabelFn=function(){
     $scope.inserted = {
        id: $scope.labellist.length+1,
        key: '',
        val: ''
      };
      $scope.labellist.push($scope.inserted);
  }
  
  $scope.removeLabel=function(index){
    $scope.labellist.splice(index, 1);
  }
  
  
  $scope.$watch('labellist',function(newval,oldval){
	  if($scope.labellist.length>0){
          $scope.formnodeData.labels='';     
          angular.forEach($scope.labellist,function(val,key){
        	 if(val.val&&val.key)
    		 { 
        		 if(key+1==$scope.labellist.length)
                 {
                    $scope.formnodeData.labels+=(val.key+'='+val.val);
                 }else
                 {
                    $scope.formnodeData.labels+=(val.key+'='+val.val)+',';
                 }
    		 }
          })
      }else{
    	  $scope.formnodeData.labels='';   
      }
  },true)
  
  
 $scope.checkNodeName=function(){
	  $scope.authMsg = '';
	  if($scope.formaddnode.name.$valid) {
		  $http.get('/cloudui/ws/cluster/'+($stateParams.clusterid||$scope.ngDialogData.clusterid)+'/checkName',{params:{
              name:$scope.formnodeData.name
           }}).success(function(data){
        	   if(!data.result)
               {
        		   $scope.authMsg = '此主机已存在，请重新命名！';
               }
           })
	  }else { 
	      $scope.formaddnode.name.$dirty = true;
	  }

 }
 
 $scope.sendnodeFn=function(){
	 
	 $rootScope.app.layout.isShadow=true;
	 
	 var RSA=$http.get('/cloudui/ws/RSA'+'?v='+(new Date().getTime())).success(function(data){
  	   $scope.modulus=data.modulus;
  	   $scope.exponent=data.exponent;
     })
     
     RSA.then(function(res){
  	   $scope.modulus=res.data.modulus;
  	   $scope.exponent=res.data.exponent;
  	   var key = RSAUtils.getKeyPair($scope.exponent, '', $scope.modulus);
  	   pwd = RSAUtils.encryptedString(key, $scope.formnodeData.password);
       
  	 $http({
         method:'post',
         url:'/cloudui/ws/cluster/'+($stateParams.clusterid||$scope.ngDialogData.clusterid)+'/nodeexec',
         data: $.param({
        	 ip:$scope.formnodeData.ip,
     		 port:$scope.formnodeData.port,
     		 username:$scope.formnodeData.username,
     		 password:pwd,
     		 cmd:$scope.scripturl.replace(/wget /,'wget -P '+$scope.formnodeData.cmd+' ').replace(/source nodecalico_install.sh/,'source '+$scope.formnodeData.cmd+'/nodecalico_install.sh '+$scope.formnodeData.cmd)+' '+($stateParams.clusterid||$scope.ngDialogData.clusterid)+' '+$scope.formnodeData.name+' '+$scope.formnodeData.labels+' 2>&1'
         }),
         headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data){
    	  $rootScope.app.layout.isShadow=false;
    	   if(data.result){
    		   Notify.alert(
                   '<em class="fa fa-check"></em> '+data.info ,
                   {status: 'success'}
                );
    		   if($scope.ngDialogData){
    			   ngDialog.close();
    		   }else{
    			   $state.go('app.env.nodes',{clusterid:$stateParams.clusterid})
    		   }
    	   }else{
    		   Notify.alert(
                   '<em class="fa fa-times"></em> '+data.info ,
                   {status: 'danger'}
                );
    	   }
     })
     
    })
     
 }

}])


/* *****主机详情页***** */

mControllers.controller('nodeController',['$rootScope','$scope','$http','$stateParams','$interval','ngDialog','$state','Notify','chartGuage','chartArea','$filter',function($rootScope,$scope,$http,$stateParams,$interval,ngDialog,$state,Notify,chartGuage,chartArea,$filter){
	
	$scope.$on('$destroy', function() {
        $interval.cancel($scope.nodecpumemtime); 
        $interval.cancel($scope.nodewarningtime); 
        $interval.cancel($scope.nodehistorytime); 
    });
	
	
	// 增加主机标签弹窗
    $scope.openaddLabelFn = function () {
      ngDialog.open({
        template: 'app/views/dialog_nodelabel.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-sm',
        cache:false,
        closeByDocument:false,
        data:{clusterid:$stateParams.clusterid,nodeid:$stateParams.nodeid,node:true},
        scope: $scope,
        controller:'addLabelCtrl'
      });
    };

    // 删除主机

    $scope.delNodeFn=function(params)
    {
      ngDialog.openConfirm({
          template:
              '<p class="modal-header">您确定要删除吗?</p>' +
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

           $http({
              method:'DELETE',
              url:'/cloudui/ws/cluster/deleteNode',
              data    : $.param({ids:params}),   
	          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
           }).success(function(data){
               if(data.result)
               {
                 Notify.alert(
                   '<em class="fa fa-check"></em> 删除成功！' ,
                   {status: 'success'}
                 );
                 $state.go('app.env.nodes',{clusterid:$stateParams.clusterid},{reload:true});
               }else
               {
                 Notify.alert(
                    '<em class="fa fa-times"></em> 删除失败！' ,
                    {status: 'danger'}
                 );
               }
            })  
         }
      )
  }
 
 //获取单个主机信息 

 $scope.clusterid=$stateParams.clusterid;
 
 $scope.pageSize=10;
  
 $scope.content='';
 
 var promise=$http.get('/cloudui/ws/cluster/'+$stateParams.clusterid+'/node/'+$stateParams.nodeid+ '?v=' + (new Date().getTime())).success(function(data){
      $scope.node = data;
      
      // 主机上的组件
      
      $http.get('/cloudui/ws/apps/getAppsOnNode'+'?v='+(new Date().getTime()),{
  		params:{
  			ip:$scope.node.ip
  		}
  	   }).success(function(data){
  	      $scope.componetList = data;    
  	   })
      
      // 修改主机资源配额（cpu）
      $scope.$watch('node.cpu',function(newval,oldval){

          if(newval==oldval)
          {
             return false;
          }else
          {
    	   	  
        	  $http({
                  method  : 'PUT',
                  url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/node/'+$stateParams.nodeid+'/updateresource', 
                  data    : $.param({cpu:newval}),   
		          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }   
               }).success(function(data){
                  if(data.result)
                  {
                    Notify.alert(
                     '<em class="fa fa-check"></em> 修改成功！' ,
                     {status: 'success'}
                    );
                  }else
                  {
                    Notify.alert(
                      '<em class="fa fa-times"></em> 修改失败！' ,
                      {status: 'danger'}
                    );
                    $state.go('app.node',{clusterid:$stateParams.clusterid,nodeid:$stateParams.nodeid},{reload:true})
                  }
               })
          }
      })
      // 修改主机资源配额（内存）
      $scope.$watch('node.memory',function(newval,oldval){

          if(newval==oldval)
          {
             return false;
          }else
          {
        	  
        	  $http({
                  method  : 'PUT',
                  url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/node/'+$stateParams.nodeid+'/updateresource', 
                  data    : $.param({memory:newval}),   
		          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }   
               }).success(function(data){
                  if(data.result)
                  {
                    Notify.alert(
                     '<em class="fa fa-check"></em> 修改成功！' ,
                     {status: 'success'}
                    );
                  }else
                  {
                    Notify.alert(
                      '<em class="fa fa-times"></em> 修改失败！' ,
                      {status: 'danger'}
                    );
                    $state.go('app.node',{clusterid:$stateParams.clusterid,nodeid:$stateParams.nodeid},{reload:true}) 
                  }
               })
          }
      })
      // 修改主机资源配额（磁盘）
      $scope.$watch('node.disk',function(newval,oldval){

          if(newval==oldval)
          {
             return false;
          }else
          {
        	  
        	  $http({
                  method  : 'PUT',
                  url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/node/'+$stateParams.nodeid+'/updateresource', 
                  data    : $.param({disk:newval}),   
		          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }   
               }).success(function(data){
                  if(data.result)
                  {
                    Notify.alert(
                     '<em class="fa fa-check"></em> 修改成功！' ,
                     {status: 'success'}
                    );
                  }else
                  {
                    Notify.alert(
                      '<em class="fa fa-times"></em> 修改失败！' ,
                      {status: 'danger'}
                    );
                    $state.go('app.node',{clusterid:$stateParams.clusterid,nodeid:$stateParams.nodeid},{reload:true})  
                  }
               })
          }
      })
      // 修改主机名称
      $scope.$watch('node.name',function(newval,oldval){

          if(newval==oldval)
          {
             return false;
          }else
          {
        	  
        	  $http.get('/cloudui/ws/cluster/'+$stateParams.clusterid+'/checkNameByID',{params:{
	                 name:newval,
	                 id:$stateParams.nodeid
	              }}).success(function(data){
	                 if(data.result)
	                 {
	                    $http({
	                       method  : 'PUT',
	                       url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/node/'+$stateParams.nodeid+'/updatename', 
	                       data    : $.param({name:newval}),   
	     		          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }   
	                    }).success(function(data){
	                       if(data.result)
	                       {
	                         Notify.alert(
	                          '<em class="fa fa-check"></em> 修改成功！' ,
	                          {status: 'success'}
	                         );
	                       }else
	                       {
	                         Notify.alert(
	                           '<em class="fa fa-times"></em> 修改失败！' ,
	                           {status: 'danger'}
	                         );
	                       }
	                    })
	                 }
	              })
          }
      })

      // 修改主机标签
      $scope.$watch('node.labels',function(newval,oldval){
          if(newval==oldval)
          {
             return false;
          }else
          { 
        	  var oriarr=oldval.split(',');
              
              var oriarrkey=[];
              
              angular.forEach(oriarr,function(val,key){
                  oriarrkey.push(val.split('=')[0])
              })
              
              var curarr=newval.split(',');
         
	          var curarrkey=[];
	          
	          angular.forEach(curarr,function(val,key){
	          curarrkey.push(val.split('=')[0])
	          })
	          
	          var lenarr=[];
	          
	          for(var i=0;i<oriarrkey.length;i++)
	          {
	           var isexit=$filter('filter')(curarrkey,oriarrkey[i],true);
	           
	           if(isexit.length>1)
	           {
	            lenarr.push(isexit.length) 
	           }
	          }
	          
	          if(lenarr.length<=0)
	          {
	        	  $http({
	                  method  : 'PUT',
	                  url     : '/cloudui/ws/cluster/'+$stateParams.clusterid+'/node/'+$stateParams.nodeid+'/updatelabel',
	                  data    : $.param({labels:newval}),   
			          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	              }).success(function(data){
	                  if(data.result)
	                  {
	                    Notify.alert(
	                      '<em class="fa fa-check"></em> 修改成功！' ,
	                      {status: 'success'}
	                    );
	                  }else
	                  {
	                    Notify.alert(
	                       '<em class="fa fa-times"></em> 修改失败！' ,
	                       {status: 'danger'}
	                    );
	                    $state.go('app.node',{clusterid:$stateParams.clusterid,nodeid:$stateParams.nodeid},{reload:true});
	                  }
	              })
	          }else{
	        	  Notify.alert(
                      '有重复的标签key值，请重新输入！' ,
                      {status: 'info'}
	              ); 
	        	  $state.go('app.node',{clusterid:$stateParams.clusterid,nodeid:$stateParams.nodeid},{reload:true});
	          }
      
              
        	  
          }
      })
  })
  
  $scope.$watch('ipdata',function(newval,oldval){
	 if(newval)
	 {
		 $scope.ipoff=true; 
	 }else
	 {
		 $scope.ipoff=false; 
	 }
  })
  
 
  promise.then(function(data){
	  var ip=data.data.ip;  
	  $scope.ipdata=ip;
	  
      // 主机监控
	  $scope.getNodeMonitorFn=function(){
	      $rootScope.nodeoff=false;
	      $http.get('/cloudui/ws/monitor/host/'+ip+'?v='+(new Date().getTime())).
	      success(function(data){
	         $rootScope.nodeoff=true;
	         $scope.nodeMonitor=data;
	         $rootScope.time=data.operstamp;
	         $rootScope.nodecpu=data.cpu;
	         $rootScope.nodemem=Number(((data.memusage/data.memtotal)*100).toFixed(2));
	         $rootScope.memusage=data.memusage;
	         $rootScope.memusage=data.memusage;
	         $rootScope.dickOutput=data.dickOutput;
	         $rootScope.diskInput=data.diskInput;
	         $rootScope.netOutput=data.netOutput;
	         $rootScope.netInput=data.netInput;
	      })
	 }
	  
	 $scope.getNodeMonitorFn();

     $scope.nodecpumemtime=$interval(function(){
      $scope.getNodeMonitorFn(); 
     },2000)
     
     $scope.nodewarningtime=$interval(function(){
    	 $scope.nodeWarningFn(ip);
     },60000)
     
     $scope.nodehistorytime=$interval(function(){
    	 $scope.onPageChange(ip,'',1);
     },5000)
     
     
     
	 $scope.nodeWarningFn(ip);
     
     // 表盘监控图
     chartGuage.chartGaugeFn('#node_cpu',{
	    text:'CPU使用率',
	    series:[{
	          name: 'cpu',
	          data: [0],
	          tooltip: {
	              valueSuffix: '%'
	          }
	      }]
	  },'nodecpu');
		 
	  chartGuage.chartGaugeFn('#node_mem',{
		    text:'内存使用率',
		    series:[{
		          name: 'mem',
		          data: [0],
		          tooltip: {
		              valueSuffix: '%'
		          }
		      }]
	  },'nodemem');
		   
	  // 折线监控图    
	  Highcharts.setOptions({                                                     
	        global: {                                                               
	            useUTC: false                                                       
	        }                                                                       
	  });
			  
			   
	  $http.get('/cloudui/ws/monitor/host/range/'+ip+'?v='+(new Date().getTime())).
	  success(function(data){
		 $scope.defaultData=data;
	  }).then(function(data){
		  var defaultData=data;
		  // cpu
		  chartArea.chartAreaFn('#cpucontainer',{
		        yAxis: {
		          title: {                                                            
		                    text: 'CPU使用率(%)'                                                   
		                },
		          labels:'%'
		        },
		        series: [
		        {                                                              
		            name: 'cpu使用率(%)',                                                
		            data: (function() { 

		                var dataarr = [],                                                                           
		                    i;                                                          
		                          
		                for (i = -19; i <= 0; i++) {                                    
		                  dataarr.push({                                                 
		                        x: defaultData.data[i+19].operstamp,                                     
		                        y: defaultData.data[i+19].cpu                                      
		                    });                                                         
		                }  

		                return dataarr;                                                    
		            })()                                                                
		        }]  
		      },'time','nodecpu');
			  // 内存 
			  chartArea.chartAreaFn('#memcontainer',{
			        title: {                                                                
			                text: '内存使用量'                                            
			        },
			        yAxis: {
			          title: {                                                            
			                    text: '内存使用量(MB)'                                                   
			                },
			          labels:'MB'
			        },
			        series: [
			        {                                                              
			          name: '内存使用量(MB)',                                                
			          data: (function() {                                                 

			              var dataarr = [],                                                                               
			                  i;                                                          

			              for (i = -19; i <= 0; i++) {                                    
			                dataarr.push({                                                 
			                      x: defaultData.data[i+19].operstamp,                                     
			                      y: defaultData.data[i+19].memusage                                      
			                  });                                                         
			              }  

			              return dataarr;                                                    
			          })()                                                                
			        }]  
			   },'time','memusage');
               // 磁盘
		       chartArea.chartAreaFn('#dickcontainer',{
		        title: {                                                                
		                text: '磁盘吞吐量'                                            
		        },
		        yAxis: {
		          title: {                                                            
		                    text: '磁盘吞吐量(MB)'                                                   
		                },
		          labels:'MB'
		        },
		        series: [
		        {                                                              
		            name: '磁盘吞吐量(读)(MB)',                                            
		            data: (function() {                                                 

		                var dataarr = [],                                                                                
		                    i;                                                          
		                           
		                for (i = -19; i <= 0; i++) {                                    
		                  dataarr.push({                                                 
		                        x: defaultData.data[i+19].operstamp,                                     
		                        y: defaultData.data[i+19].dickOutput                                      
		                    });                                                         
		                }  

		                return dataarr;                                                    
		            })()                                                                
		        },
		        {                                                              
		            name: '磁盘吞吐量(写)(MB)',  
		            color:'#fe8112',                                              
		            data: (function() {                                                 

		                var dataarr = [],                                                                            
		                    i;                                                          

		                for (i = -19; i <= 0; i++) {                                    
		                  dataarr.push({                                                 
		                        x: defaultData.data[i+19].operstamp,                                     
		                        y: defaultData.data[i+19].diskInput                                      
		                    });                                                         
		                }  

		                return dataarr;                                                    
		            })()                                                                
		        }
		        ]  
		      },'time','dickOutput','diskInput');
              // 网络带宽
			  chartArea.chartAreaFn('#netcontainer',{
		        title: {                                                                
		                text: '网络带宽'                                            
		        },
		        yAxis: {
		          title: {                                                            
		                    text: '网络带宽(kB)'                                                   
		                },
		          labels:'KB'
		        },
		        series: [
		        {                                                              
		            name: '网络带宽(出)(KB)',                                                
		            data: (function() {                                                 
	
		                var dataarr = [],                                                                              
		                    i;                                                          
		                           
		                for (i = -19; i <= 0; i++) {                                    
		                  dataarr.push({                                                 
		                        x: defaultData.data[i+19].operstamp,                                     
		                        y: defaultData.data[i+19].netOutput                                      
		                    });                                                         
		                }  
	
		                return dataarr;                                                    
		            })()                                                                
		        },
		        {                                                              
		            name: '网络带宽(进)(KB)',  
		            color:'#fe8112',                                              
		            data: (function() {                                                 
	
		                var dataarr = [],                                                                            
		                    i;                                                          
	
		                for (i = -19; i <= 0; i++) {                                    
		                  dataarr.push({                                                 
		                        x: defaultData.data[i+19].operstamp,                                     
		                        y: defaultData.data[i+19].netInput                                      
		                    });                                                         
		                }  
	
		                return dataarr;                                                    
		            })()                                                                
		        }
		        ]  
		      },'time','netOutput','netInput');
		})
			  
  })
  
  // 主机告警 
 
  $scope.nodeWarningFn=function(params)
  {  
     // 告警策略  
	 $http.get('/cloudui/ws/monitor/category/host/'+$stateParams.nodeid+'?v='+(new Date().getTime())).success(function(data){
	     $scope.nodeStrategyItems=data;
	     if($scope.nodeStrategyItems=='null')
         {
      	   $scope.nodeStrategyItemsoff=false;
         }else
         {
      	   $scope.nodeStrategyItemsoff=true;
         }
	 })

  }
 
 // 主机告警历史
 
 $scope.onPageChange = function (ip,cont,pageNum)
 { 
	   
	   if(!cont)
	   {
	 	  cont='*'
	   }

	   $http.get('/cloudui/ws/monitor/history/0/'+ip+'/user/'+$rootScope.user.id+'/content/'+cont+'/'+pageNum+'/'+$scope.pageSize+'?v=' + (new Date().getTime())).success(function(data){
	     $scope.nodeWarningHisrory = data;
	     $scope.pageCount=Math.ceil($scope.nodeWarningHisrory.total/$scope.pageSize);
	     if($scope.pageCount==0){
	    	 $scope.pageCount=1;
	     }
	    })  
    
 }
 
 // 搜素历史
 $scope.searchHistory=function(ip,params)
 {  
    $scope.onPageChange(ip,params,1);
 }

 // 解绑策略
 $scope.delBindNodeTactic=function(params,isrunning)
 {
  
   if(isrunning==1)
   {
	  Notify.alert(
          '<em class="fa fa-check"></em> 告警策略正在使用，请先停止告警策略，再解绑！' ,
          {status: 'info'}
      );
   }else
   {
	   $http({
	     method:'put',
	     url:'/cloudui/ws/monitor/category/resource/unbind',
	     data: $.param({
	       id:params,
	       resourceid:$stateParams.nodeid
	     }),
	     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	   }).success(function(data){
		   if(data.result)
	      	{
	      		 Notify.alert(
	                   '<em class="fa fa-check"></em> 解绑成功！' ,
	                   {status: 'success'}
	               );
	      		 
	      	    setInterval(function(){ 
			       $scope.$apply(function(){
			    	   $scope.nodeStrategyItemsoff=false;
			       })
			    },1)
	      	 }else
	      	 {
	      		 Notify.alert(
	                   '<em class="fa fa-times"></em> 解绑失败',
	                   {status: 'danger'}
	              ); 
	      	 } 
	   })
   }
 
 }
 
}])

/* 主机上的组件列表 */
mControllers.controller('nodeAssemblyList',['$scope','$http','$stateParams',function($scope,$http,$stateParams){
	$http.get('/cloudui/ws/apps/getAppsOnNode'+'?v='+(new Date().getTime()),{
		params:{
			ip:$scope.ngDialogData.ip
		}
	}).success(function(data){
	      $scope.list = data;    
	})
}])

/* ----------------------------服务介质--------------------------------------- */

/* *****添加安装介质***** */

mControllers.controller('assemblyCreateCtrl',['$rootScope','$scope','$http','$filter','$state','$stateParams','Notify','$timeout','ngDialog',function($rootScope,$scope,$http,$filter,$state,$stateParams,Notify,$timeout,ngDialog){
  
  $scope.formdata={}; // 表单数据
  $scope.labelsarr=[]; //标签
  $scope.envs=[]; // 环境变量集
  
  // 服务介质类型
  $scope.typeList=[ 
     {
    	 "value":"storm_nimbus",
    	 "text":"storm_nimbus"
     },
     {
    	 "value":"storm_supervisor",
    	 "text":"storm_supervisor"
     },
     {
    	 "value":"zk",
    	 "text":"zookeeper"
     }
  ]
  
  $scope.formdata.type=$scope.typeList[0].value;

  // 关联服务介质

   $scope.depsFn=function()
   {
      $http.get('/cloudui/ws/apps/list/apps'+'?v=' + (new Date().getTime())).success(function(data){
       $scope.applist=data;
      })
    }

    $scope.depsFn();

  // 选择关联应用的环境变量
    $scope.dropopen=function(param,defaultval){
        angular.element('.dropdown-menu-right').hide();
        if($scope.applist.length>0)
        {
         angular.element('.dropdown-menu-right').eq(param).show();
        }else
        {
         Notify.alert(
                '您还没有创建应用，请先创建应用!',
                 {status: 'info'}
            ); 
        }
     }

  // 获取资源名称
  $scope.getResourceNameFn=function(name,id,version){
     $scope.resourceName=name;
     $scope.getTags(id,version);
  }

  // 获取资源版本
  $scope.getTags=function(id,version){
    $http.get('/cloudui/ws/apps/file/versionList'+'?v='+(new Date().getTime()),{params:{
       resourceId:id,
       pageSize:0
    }}).success(function(data){
       $scope.resource_version=data.rows;
       if(version)
       {
          $scope.formdata.resourcetag=$filter('filter')($scope.resource_version,version)[0];
       }else{
          $scope.formdata.resourcetag=$scope.resource_version[0];
       } 
    }) 
  }
  
  // 添加新资源
  $scope.openAddResource=function(){
    $rootScope.resourceType='app';
    $rootScope.offsideinclude="app/views/partials/addResourcebar.html"+"?action="+(new Date().getTime());
  }

  $scope.$watch('newResourcedata',function(newval,oldval){
     if(newval){
        $scope.getResourceNameFn(newval.resourceName,newval.resourceId,newval.tag);
     }
  })

  // 选择已有资源
  $scope.openResourceList = function () {
      ngDialog.open({
        template: 'app/views/dialog_resourcelist.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-lg',
        scope: $scope,
        closeByDocument:false,
        cache:false,
        data:{type:'app'},
        controller:'resourceListCtrl'
      });
  };

  // 是否弹出选择资源框
  /*$scope.goResource=function(resourceName){
      if(!resourceName)
      {
        $scope.openResourceList();
      }  
  }*/
  
   //根据资源版本获取端口、command
  $scope.$watch('formdata.resourcetag',function(newval,oldval){
      if(newval)
      {
        $scope.formdata.accessPort=newval.startPort;
        $scope.formdata.cmd=newval.startScript; 
      }
 },true)

  // 获取配置名称
  $scope.getConfigNameFn=function(name,id,version){
     $scope.configName=name;
     $scope.getConfigTags(id,version);
  }

  // 获取配置版本
  $scope.getConfigTags=function(id,version){
    $http.get('/cloudui/ws/apps/configs/getVersions'+'?v='+(new Date().getTime()),{params:{
       configId:id
    }}).success(function(data){
       $scope.config_version=data;
       if(version)
       {
          $scope.formdata.configtag=$filter('filter')($scope.config_version,version)[0];
       }else{
          $scope.formdata.configtag=$scope.config_version[0];
       } 
    }) 
  }

  // 添加新配置
  $scope.openAddConfig=function(){
    $rootScope.configType='component';
    $rootScope.offsideinclude="app/views/partials/addconfigbar.html"+"?action="+(new Date().getTime());
  }

  $scope.$watch('newConfigdata',function(newval,oldval){
     if(newval){
        $scope.getConfigNameFn(newval.name,newval.configId,newval.version);
     }
  })

  // 选择已有配置
  $scope.openConfigList = function () {
      ngDialog.open({
        template: 'app/views/dialog_configlist.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-lg',
        scope: $scope,
        closeByDocument:false,
        cache:false,
        data:{type:'component'},
        controller:'configListCtrl'
      });
  };

  // 是否弹出选择配置框

  /*$scope.goConfig=function(configName){
      if(!configName)
      {
        $scope.openConfigList();
      }  
  }*/

   // 添加 
   $scope.add=function(list){
        var obj={};
        $scope[list].push(obj);   
    }
    // 删除 
   $scope.del=function(list,idx){
        $scope[list].splice(idx,1);
    }

    $scope.createAssemblyFn=function(){
         
       $rootScope.app.layout.isShadow=true;

       // 环境变量传值
       $scope.envsData={};
       angular.forEach($scope.envs,function(val,key){
         $scope.envsData[val.key]=val.val;
       })

       // 标签传值
       $scope.labelsData={};
       angular.forEach($scope.labelsarr,function(val,key){
         $scope.labelsData[val.key]=val.val;
       })

       // 实例配额传值
       $scope.strategiesData={};
       $scope.strategiesData.sameHost=!$scope.formdata.sameHost;
       $scope.strategiesData.shareHost=!$scope.formdata.shareHost;
       $scope.strategiesData.labels=$scope.labelsData;
       $scope.strategiesData.shareCpu=true;
       $scope.strategiesData.cpus=1;
       $scope.strategiesData.memory=128;

       // 提交的数据
       $scope.data={
          appName:$scope.formdata.type+'_'+$scope.formdata.assemblyName,
          description:$scope.formdata.description||'',
          accessPort:$scope.formdata.accessPort,
          cmd:$scope.formdata.cmd,
          /*resourceUpdateType:$scope.formdata.resourceUpdateType,*/
          replicas:Number($scope.formdata.replicas),
          strategies:$scope.strategiesData,
          envs:$scope.envsData,
          logDirs:$scope.formdata.logPaths||'',
          volumes:[],
          outgoing_ips:[],
          deps:[],
          netModel:'host',
          resourceVersionId:$scope.formdata.resourcetag.id,
          confVersionId:$scope.formdata.configtag.id
      }
       
      
      // 创建
      $http.post('/cloudui/ws/apps/create',$scope.data).then(function(response) {   
        $rootScope.app.layout.isShadow=false;
          // 通过返回数据，没通过返回错误信息
          if(response.data.result)
          {
            
            Notify.alert(
                '<em class="fa fa-check"></em> '+response.data.message ,
                {status: 'success'}
            );
            $state.go('app.listassembly',{},{reload:true});

          }else{
            Notify.alert(
                '<em class="fa fa-times"></em> '+response.data.message ,
                {status: 'danger'}
            );
            
          }

          return false;

      }, function(x) {
        $scope.authMsg = '服务器请求错误';
      });
    }
    
    // 查看配置
    
    $scope.openViewConfig=function(version){
    	 
    	if(version){
    		ngDialog.open({
  	          template: 'app/views/dialog_config_version_detail.html'+'?action='+(new Date().getTime()),
  	          className: 'ngdialog-theme-default ngdialog-lg',
  	          cache:false,
  	          scope: $scope,
  	          data:{version:version},
  	          controller:'viewConfig'
  	        });
    	}else{
    		Notify.alert(
                    '请选择配置版本或新添加配置' ,
                    {status: 'success'}
            );
    	}
        
    }
 
}])

/* *****查看服务介质版本配置***** */
mControllers.controller('viewConfig',['$scope','$http',function($scope,$http){
	 
	$http.get('/cloudui/ws/apps/configs/getConfigList'+'?v='+(new Date().getTime()),{
		params:{
			versionId:$scope.ngDialogData.version.id
		}
	}).success(function(data){
		$scope.configlists=data.rows;
	})
	
}])

/* *****服务介质列表***** */

mControllers.controller('assemblyListCtrl',['$rootScope','$scope','$http','$state','Notify','ngDialog','$filter',function($rootScope,$scope,$http,$state,Notify,ngDialog,$filter){
   
	$scope.checkappId=[]; // 选中的应用

    // 获取应用列表 
    $scope.pageSize=10;
    $scope.appName='';

    $scope.onPageChange = function ()
    {   
      $http.get('/cloudui/ws/apps/listOperationApps'+'?v=' + (new Date().getTime()),{
      params:
          {
            pageNum:$scope.pageNum,
            pageSize:$scope.pageSize,
            appName:$scope.searchval
          }
     }).success(function(data){
    	
    	 angular.forEach(data.rows,function(val,key){
    		 var ischecked=$filter('filter')($scope.checkappId,val.appId).length>0?true:false;
    		 data.rows[key].ischecked=ischecked;
    	 })

    	 $scope.applist = data;
    	 $scope.applistoff=data.total>0?true:false;
         $scope.warninginfo='提示：暂无服务介质';
         $scope.pageCount=Math.ceil($scope.applist.total/$scope.pageSize);
         if($scope.pageCount==0)
         {
        	 $scope.pageCount=1;
         }
     }).error(function(){
         $scope.applistoff=false;
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

    // 删除服务介质

    $scope.delApp=function(index,appId)
    {
    	ngDialog.openConfirm({
            template:
                 '<p class="modal-header">您确定要删除此服务介质吗?</p>' +
                 '<div class="modal-body text-right">' +
                   '<button type="button" class="btn btn-default mr20"  ng-click="closeThisDialog(0)">取消' +
                   '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
                 '</button></div>',
           plain: true,
           closeByDocument:false,
           className: 'ngdialog-theme-default'
         }).then(function(){
        	 $http({
                 method:"DELETE",
                 url:'/cloudui/ws/apps/deleteOperationApp/'+appId,
              }).then(function(response){
                 if(response.data.result)
                 {
                	 $scope.applist.rows.splice(index, 1);
                	 Notify.alert(
                       '<em class="fa fa-check"></em> ！'+response.data.message ,
                       {status: 'success'}
                     );
                 }else
                 {
                   Notify.alert(
                     '<em class="fa fa-times"></em> '+response.data.message ,
                     {status: 'danger'}
                   );
                 }
              }) 
         })
    }   

    
    // 添加服务介质
    
    $scope.addAssembly=function(num){
    	if(num>0){
    		$state.go('app.assembly_create',{},{reload:true})
    	}else{
    		Notify.alert(
                '您还没有应用，请先创建应用',
                {status: 'info'}
              );
    	}
    }


}])

/* *****服务介质版本列表***** */

mControllers.controller('assemblyVersionCtrl',['$rootScope','$scope','$http','$stateParams','Notify','$state','ngDialog','$interval',function($rootScope,$scope,$http,$stateParams,Notify,$state,ngDialog,$interval){
   
	$scope.assemblyid=$stateParams.assemblyid;
 
     $scope.pageSize=10;
     $scope.onPageChange = function ()
      { 
      
        $http.get('/cloudui/ws/apps/listOperationAppVersions'+ '?v=' + (new Date().getTime()),{
        params:
            {
              pageNum:$scope.pageNum,
              pageSize:10,
              appId:$stateParams.assemblyid
            }
       }).success(function(data){
          $scope.appVersion = data;
          $scope.pageCount=Math.ceil($scope.appVersion.total/$scope.pageSize);
          if($scope.pageCount==0)
          {
            $scope.pageCount=1;
          }
       })
      }
     

      // 版本删除

      $scope.delVersion=function(num,id)
      {

        ngDialog.openConfirm({
              template:
                   '<p class="modal-header">您确定要删除此版本吗?</p>' +
                   '<div class="modal-body text-right">' +
                     '<button type="button" class="btn btn-default mr20" ng-click="closeThisDialog(0)">取消' +
                     '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
                   '</button></div>',
             plain: true,
             closeByDocument:false,
             className: 'ngdialog-theme-default'
           }).then(function(){
             $http({
                method:'DELETE',
                url:'/cloudui/ws/apps/deleteOperationAppVersion/'+id
               }).success(function(data){
                 if(data.result)
                 {
                 
                   Notify.alert(
                      '<em class="fa fa-check"></em> '+data.message ,
                      {status: 'success'}
                   );
                   $state.go('app.assembly_version',{assemblyid:$stateParams.assemblyid},{reload:true});
                 }else
                 {
                   Notify.alert(
                         '<em class="fa fa-times"></em> '+data.message ,
                         {status: 'danger'}
                     );
                 }
             })
          })
      }

 
      
}])

/* *****服务介质版本更新***** */

mControllers.controller('assemblyUpdateCtrl',['$rootScope','$scope','$http','$filter','$modal','$state','$stateParams','Notify','$timeout','ngDialog','$stateParams',function($rootScope,$scope,$http,$filter,$modal,$state,$stateParams,Notify,$timeout,ngDialog,$stateParams){
  $scope.assemblyVersionId=$stateParams.id; // 组件版本id
  $scope.formdata={}; // 表单数据
  $scope.labelsarr=[]; //标签
  $scope.envs=[]; // 环境变量集
  // 更新机制
  /*$scope.resourceUpdateTypeList=[
       {value:'never',text:'从不更新'},
       {value:'ifnotpresent',text:'不是最新时更新'},
       {value:'always',text:'总是前置重新pull镜像'}
  ]
  $scope.formdata.resourceUpdateType='never';*/

  // 关联应用

   $scope.depsFn=function(depsSelectedArr)
   {
      $http.get('/cloudui/ws/apps/list/apps'+'?v=' + (new Date().getTime())).success(function(data){
       $scope.applist=data;
       if(data != null && data.length > 0){  
           for(var i = 0; i< data.length; i++){  
             $("<option value='"+data[i].APP_ID+"'>"+data[i].APP_NAME+"</option>").appendTo("#st"); 
           }  

            $("#st").chosen({
               no_results_text:"没有搜索到此应用"
            });  
                    
         } 
      })
    }

    $scope.depsFn();

  // 选择关联应用的环境变量
    $scope.dropopen=function(param,defaultval){
        angular.element('.dropdown-menu-right').hide();
        if($scope.applist.length>0)
        {
         angular.element('.dropdown-menu-right').eq(param).show();
        }else
        {
         Notify.alert(
                '您还没有创建应用，请先创建应用!',
                 {status: 'info'}
            ); 
        }
     }

  // 获取资源名称
  $scope.getResourceNameFn=function(name,id,version){
     $scope.resourceName=name;
     $scope.getTags(id,version);
  }

  // 获取资源版本
  $scope.getTags=function(id,version){
    $http.get('/cloudui/ws/apps/file/versionList'+'?v='+(new Date().getTime()),{params:{
       resourceId:id,
       pageSize:0
    }}).success(function(data){
       $scope.resource_version=data.rows;
       if(version)
       {
          $scope.formdata.resourcetag=$filter('filter')($scope.resource_version,version)[0];
       }else{
          $scope.formdata.resourcetag=$scope.resource_version[0];
       } 
    }) 
  }
  
  // 添加新资源
  $scope.openAddResource=function(){
    $rootScope.resourceType='app';
    $rootScope.offsideinclude="app/views/partials/addResourcebar.html"+"?action="+(new Date().getTime());
  }

  $scope.$watch('newResourcedata',function(newval,oldval){
     if(newval){
        $scope.getResourceNameFn(newval.resourceName,newval.resourceId,newval.tag);
     }
  })

  // 选择已有资源
  $scope.openResourceList = function () {
      ngDialog.open({
        template: 'app/views/dialog_resourcelist.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-lg',
        scope: $scope,
        closeByDocument:false,
        cache:false,
        data:{type:'app'},
        controller:'resourceListCtrl'
      });
  };

  // 是否弹出选择资源框
  /*$scope.goResource=function(resourceName){
      if(!resourceName)
      {
        $scope.openResourceList();
      }  
  }*/
  
  //根据资源版本获取端口、command
  $scope.$watch('formdata.resourcetag',function(newval,oldval){
      if(newval)
      {
        $scope.formdata.accessPort=$scope.assemblyInfoData.accessPort||newval.startPort;
        $scope.formdata.cmd=$scope.assemblyInfoData.cmd||newval.startScript; 
      }
 },true)

  // 获取配置名称
  $scope.getConfigNameFn=function(name,id,version){
     $scope.configName=name;
     $scope.getConfigTags(id,version);
  }

  // 获取配置版本
  $scope.getConfigTags=function(id,version){
    $http.get('/cloudui/ws/apps/configs/getVersions'+'?v='+(new Date().getTime()),{params:{
       configId:id
    }}).success(function(data){
       $scope.config_version=data;
       if(version)
       {
          $scope.formdata.configtag=$filter('filter')($scope.config_version,version)[0];
       }else{
          $scope.formdata.configtag=$scope.config_version[0];
       } 
    }) 
  }

  // 添加新配置
  $scope.openAddConfig=function(){
    $rootScope.configType='component';
    $rootScope.offsideinclude="app/views/partials/addconfigbar.html"+"?action="+(new Date().getTime());
  }

  $scope.$watch('newConfigdata',function(newval,oldval){
     if(newval){
        $scope.getConfigNameFn(newval.name,newval.configId,newval.version);
     }
  })

  // 选择已有配置
  $scope.openConfigList = function () {
      ngDialog.open({
        template: 'app/views/dialog_configlist.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-lg',
        scope: $scope,
        closeByDocument:false,
        cache:false,
        data:{type:'component'},
        controller:'configListCtrl'
      });
  };

  // 是否弹出选择配置框

  /*$scope.goConfig=function(configName){
      if(!configName)
      {
        $scope.openConfigList();
      }  
  }*/

   // 添加 
   $scope.add=function(list){
        var obj={};
        $scope[list].push(obj);   
    }
    // 删除 
   $scope.del=function(list,idx){
        $scope[list].splice(idx,1);
    }

   // 应用信息
    $http.get('/cloudui/ws/apps/getAppVersionDetail'+'?v=' + (new Date().getTime()),{
        params:{id:$scope.assemblyVersionId}
    }).success(function(data){
          $scope.assemblyInfoData=data;
          $scope.formdata.accessPort=data.accessPort;
          $scope.formdata.cmd=data.cmd;
          $scope.formdata.replicas=Number(data.replicas);
          $scope.formdata.logPaths=data.logDirs;
          $scope.formdata.sameHost=!data.strategies.sameHost;
          $scope.formdata.shareHost=!data.strategies.shareHost;
          $scope.resourceName=data.resourceName;
          $scope.getTags(data.resourceId,data.resourceVersionName);
          $scope.configName=data.configName;
          $scope.getConfigTags(data.configId,data.configVersionName);
          angular.forEach(data.strategies.labels,function(val,key){
            $scope.labelsarr.push({
               key:key,
               val:val
            })
          })

          angular.forEach(data.envs,function(val,key){
            $scope.envs.push({
               key:key,
               val:val
            })
          })
    })


    $scope.updateAssemblyFn=function(){
         
       $rootScope.app.layout.isShadow=true;

       // 环境变量传值
       $scope.envsData={};
       angular.forEach($scope.envs,function(val,key){
         $scope.envsData[val.key]=val.val;
       })

       // 标签传值
       $scope.labelsData={};
       angular.forEach($scope.labelsarr,function(val,key){
         $scope.labelsData[val.key]=val.val;
       })

       // 实例配额传值
       $scope.strategiesData={};
       $scope.strategiesData.sameHost=!$scope.formdata.sameHost;
       $scope.strategiesData.shareHost=!$scope.formdata.shareHost;
       $scope.strategiesData.labels=$scope.labelsData;
       $scope.strategiesData.shareCpu=true;
       $scope.strategiesData.cpus=1;
       $scope.strategiesData.memory=128;

       // 提交的数据
       $scope.data={
          appId:$scope.assemblyInfoData.appId,
          appName:$scope.assemblyInfoData.appName,
          description:$scope.assemblyInfoData.description,
          accessPort:$scope.formdata.accessPort,
          cmd:$scope.formdata.cmd,
          /*resourceUpdateType:$scope.formdata.resourceUpdateType,*/
          replicas:Number($scope.formdata.replicas),
          strategies:$scope.strategiesData,
          envs:$scope.envsData,
          logDirs:$scope.formdata.logPaths||'',
          volumes:[],
          outgoing_ips:[],
          deps:[],
          netModel:'host',
          resourceVersionId:$scope.formdata.resourcetag.id,
          confVersionId:$scope.formdata.configtag.id
      }
       
      
      //更新
      $http.post('/cloudui/ws/apps/updateOperationApp',$scope.data).then(function(response) {   
        $rootScope.app.layout.isShadow=false;
          // 通过返回数据，没通过返回错误信息
          if(response.data.result)
          {
            
            Notify.alert(
                '<em class="fa fa-check"></em> '+response.data.message ,
                {status: 'success'}
            );
            $state.go('app.assembly_version',{assemblyid:$scope.assemblyInfoData.appId},{reload:true});

          }else{
            Notify.alert(
                '<em class="fa fa-times"></em> '+response.data.message ,
                {status: 'danger'}
            );
            
          }

          return false;

      }, function(x) {
        $scope.authMsg = '服务器请求错误';
      });
    }
    
   // 查看配置
    
    $scope.openViewConfig=function(version){
    	 
    	if(version){
    		ngDialog.open({
  	          template: 'app/views/dialog_config_version_detail.html'+'?action='+(new Date().getTime()),
  	          className: 'ngdialog-theme-default ngdialog-lg',
  	          cache:false,
  	          scope: $scope,
  	          data:{version:version},
  	          controller:'viewConfig'
  	        });
    	}else{
    		Notify.alert(
                    '请选择配置版本或新添加配置' ,
                    {status: 'success'}
            );
    	}
        
    }
 
}])


/* ----------------------------选择资源--------------------------------------- */

/* *****已有资源列表***** */

mControllers.controller('resourceListCtrl',['$scope','$http',function($scope,$http){
   var picname=['tomcat','centos','mysql','redis','django','lamp','mongodb','nginx','node','ubuntu','zookeeper','memcache'];  
   $scope.pageSize=5;
   $scope.search={};
   $scope.onPageChange = function (pageNum)
   { 
      $scope.loadoff=true;
      $http.get('/cloudui/ws/apps/file/resourceList'+ '?v=' + (new Date().getTime()),{
          params:
          {
                pageNum:pageNum,
                pageSize:$scope.pageSize,
                type:$scope.ngDialogData.type,
                keyword:$scope.search.val
          }
      }).success(function(data){
          $scope.loadoff=false;
          $scope.resultoff=data.rows.length>0?true:false;
          $scope.warninginfo='无';
              
          if($scope.resultoff){
            for(var i=0;i<data.rows.length;i++)
            {
               var pic=''
               for(var j=0;j<picname.length;j++)
               {
                  if(data.rows[i].resourceName.indexOf(picname[j])!==-1)
                  {
                    var pic=picname[j]
                  }
               }
               if(!pic){
                 pic='zip' 
               }
               data.rows[i].pic=pic;
               $scope.resourcelist=data;
            }
          }else{
            $scope.resourcelist=data; 
          }
              
          $scope.pageCount=Math.ceil(data.total/$scope.pageSize);
          if($scope.pageCount==0){
                $scope.pageCount=1;
          }
          }).error(function(){
               $scope.resultoff=false;
               $scope.warninginfo='暂无结果';
          })
   }
   //搜素镜像
   $scope.searchResource=function(e)
   {  
     if(e.type=='click')
     {
         $scope.loadoff=false;
         $scope.onPageChange(1); 
     }else if(e.type=='keyup')
     {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13)
        {
           $scope.loadoff=false;
           $scope.onPageChange(1);     
        }
     }
     if($scope.search.val.length==0)
     {
        $scope.onPageChange(1); 
     }
   }
}])

/* *****添加资源***** */

mControllers.controller('addResourceCtrl',['$rootScope','$scope','$http','FileUploader','Notify','$timeout',function($rootScope,$scope,$http,FileUploader,Notify,$timeout){

  $scope.resourceformdata={};

  // 验证表单
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
      var input = $scope.addResourceForm[name];
      return (input.$dirty || $scope.submitted) && input.$error[type];
  };
    
  var uploader = $scope.uploader = new FileUploader({
        url: '/cloudui/ws/apps/file/upload'
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
	 // console.log(fileItem);
	  $scope.isloading=false;
	  
	  $timeout(function(){
      	   $scope.isloading=true;
      })
  }


  uploader.onSuccessItem = function(fileItem, response, status, headers) {
        if(response.result){
           $scope.fileid=response.fileid;
        }else{
           Notify.alert(
               '<em class="fa fa-times"></em> '+response.message ,
               {status: 'danger'}
           );
        }
        
  };

  $scope.addResourceFn=function(){ 
    if(uploader.queue.length>0){
       if(uploader.progress==100){
            $scope.submitted = true; 
            if($scope.addResourceForm.$valid){
            	  $rootScope.app.layout.isShadow=true;
                  $http({
                     method  : 'POST',
                     url     : '/cloudui/ws/apps/file/registResource',
                     data    : $.param({
                        fileid:$scope.fileid, 
                        type:$rootScope.resourceType,
                        resourceName:$scope.resourceformdata.resourceName,
                        description_resource:$scope.resourceformdata.description_resource||'',
                        versionName:$scope.resourceformdata.versionName,
                        startPort:$scope.resourceformdata.startPort||'',
                        startScript:$scope.resourceformdata.startScript||'',
                        description:$scope.resourceformdata.description||'',
                        deploy_timeout:$scope.resourceformdata.deploy_timeout,
                        start_timeout:$scope.resourceformdata.start_timeout,
                        stop_timeout:$scope.resourceformdata.stop_timeout,
                        destroy_timeout:$scope.resourceformdata.destroy_timeout
                      }),   
                     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
                   }).success(function(data){
                	      $rootScope.app.layout.isShadow=false;
                          if(data.result)
                          {
                            $rootScope.newResourcedata=data;
                            angular.element('body').removeClass('offsidebar-open');
                            angular.element('body').removeClass('shadow');   
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

/* *****添加topo包***** */

mControllers.controller('addTopoCtrl',['$rootScope','$scope','$http','FileUploader','Notify',function($rootScope,$scope,$http,FileUploader,Notify){

  $scope.resourceformdata={};

  // 验证表单
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
      var input = $scope.addResourceForm[name];
      return (input.$dirty || $scope.submitted) && input.$error[type];
  };
    
  var uploader = $scope.uploader = new FileUploader({
        url: '/cloudui/ws/apps/file/upload'
  });

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
  };
  
  uploader.onAfterAddingFile=function(fileItem){
	 // console.log(fileItem);
  }


  uploader.onSuccessItem = function(fileItem, response, status, headers) {
        if(response.result){
           $scope.fileid=response.fileid;
        }else{
           Notify.alert(
               '<em class="fa fa-times"></em> '+response.message ,
               {status: 'danger'}
           );
        }
        
  };

  $scope.addResourceFn=function(){ 
    if(uploader.queue.length>0){
       if(uploader.progress==100){
            $scope.submitted = true; 
            if($scope.addResourceForm.$valid){
            	  $rootScope.app.layout.isShadow=true;
                  $http({
                     method  : 'POST',
                     url     : '/cloudui/ws/apps/file/registResource',
                     data    : $.param({
                        fileid:$scope.fileid, 
                        type:$rootScope.resourceType,
                        startScript:$scope.resourceformdata.startScript||'',
                        description:$scope.resourceformdata.description||''
                      }),   
                     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
                   }).success(function(data){
                	      $rootScope.app.layout.isShadow=false;
                          if(data.result)
                          {
                            $rootScope.newResourcedata=data;
                            angular.element('body').removeClass('offsidebar-open');
                            angular.element('body').removeClass('shadow');   
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

/* ----------------------------服务资源--------------------------------------- */

/* *****服务资源列表***** */

mControllers.controller('resourceServerListCtrl',['$scope','$http',function($scope,$http){
	 var picname=['tomcat','centos','mysql','redis','django','lamp','mongodb','nginx','node','ubuntu','zookeeper','memcache'];      
     $scope.pageSize=5;
     $scope.onPageChange = function ()
     {
         $scope.loadoff=true;
         $http.get('/cloudui/ws/apps/file/resourceList'+ '?v=' + (new Date().getTime()),{
         params:
             {
               pageNum:$scope.pageNum,
               pageSize:$scope.pageSize,
               type:'app',
               keyword:$scope.searchval
             }
        }).success(function(data){
          $scope.loadoff=false;
          $scope.resultoff=data.rows.length>0?true:false;
          $scope.warninginfo='提示：无此资源';
          if($scope.resultoff){
              for(var i=0;i<data.rows.length;i++)
                {
                   var pic=''
                   for(var j=0;j<picname.length;j++)
                   {
                    if(data.rows[i].resourceName.indexOf(picname[j])!==-1)
                    {
                      var pic=picname[j]
                    }
                   }

                  if(!pic){
                    pic='zip' 
                  }
                  data.rows[i].pic=pic;
                  $scope.serverResourceList=data;
                } 
            }else{
              $scope.ftplist=data; 
            }
            $scope.pageCount=Math.ceil(data.total/$scope.pageSize);
            if($scope.pageCount==0){
             $scope.pageCount=1;
            }
        }).error(function(){
            $scope.resultoff=false;
            $scope.warninginfo='暂无结果';
        })
    }
    //搜素ftp
    $scope.searchResource=function(e)
    {
        var keycode = window.event?e.keyCode:e.which;
      if(keycode==13)
      {
       $scope.loadoff=false;
         $scope.onPageChange(); 
      }
        if($scope.searchval.length==0)
        {
         $scope.pageNum=1;
           $scope.onPageChange(); 
        }
    }
}])

/* *****版本关联资源包详情***** */

mControllers.controller('resourceVersionDetail',['$scope','$http','$stateParams','ngDialog','$location',function($scope,$http,$stateParams,ngDialog,$location){
	
	$scope.id=$stateParams.id;
	
	// 详情信息
	  $http.get('/cloudui/ws/apps/file/resourceVersionInfo'+'?v='+(new Date().getTime()),{
	    params:{
	    	versionId:$stateParams.resourceVesionId,   
	    } 
	  }).success(function(data){
		  $scope.resourceVesionData=data;
		  $scope.packageName=data.packagePath.split('/')[data.packagePath.split('/').length-1];
 
	  })
	  
	  if($location.path().indexOf('assembly')!==-1){
		  $scope.typeval='assembly';
	  }else if($location.path().indexOf('topo')!==-1){
		  $scope.typeval='topo';
	  }
	  
	  // 编辑弹窗
	  $scope.editVersion = function (id,param) {
	        ngDialog.open({
	          template: 'app/views/dialog_resourcetag.html'+'?action='+(new Date().getTime()),
	          className: 'ngdialog-theme-default',
	          scope: $scope,
	          closeByDocument:false,
	          data:{id,resourceDetail:param,type:$scope.typeval},
	          cache:false,
	          controller:'editResourceTagDetail'
	        });
	   };
	   
	   // 删除资源版本
	    
	   $scope.delversion=function(param,type){
	      $http.get('/cloudui/ws/apps/file/deleteVersion'+'?v='+(new Date().getTime()),{params:{
	        versionId:param
	      }}).success(function(data){
	        if(data.result)
	        {
	          Notify.alert(
	                    '<em class="fa fa-check"></em> 删除成功！' ,
	                    {status: 'success'}
	                );
	          
	          if(type=='app'){
	        	  $state.go('app.resource_server_detail.version',{resourceId:$stateParams.resourceId},{reload:true});
	          }else if(type=='topo'){
	        	  $state.go('app.resource_topo_detail.version',{resourceId:$stateParams.resourceId},{reload:true});
	          }
	          
	         
	        }else
	        {
	           Notify.alert(
	                     '<em class="fa fa-times"></em> 删除失败',
	                     {status: 'danger'}
	                  );
	        }
	      })
	    }
}])

/* *****版本关联资源包编辑***** */

mControllers.controller('editResourceTagDetail',['$scope','$http','Notify','$state','ngDialog','$window',function($scope,$http,Notify,$state,ngDialog,$window){
	//版本信息
	$scope.id=$scope.ngDialogData.id;
	$scope.resourcetag=$scope.ngDialogData.resourceDetail;
	 
	$scope.startPort=$scope.resourcetag.startPort||'';
	$scope.startScript=$scope.resourcetag.startScript||'';
	$scope.description=$scope.resourcetag.description||'';
	
	// 验证表单
    $scope.submitted = false;
    $scope.validateInput = function(name, type) {
        var input = $scope.createResourceForm[name];
        return (input.$dirty || $scope.submitted) && input.$error[type];
    };
     
    // 更新信息
    $scope.updateResourceFn=function(){
    	 
        $scope.submitted = true;
        if ($scope.createResourceForm.$valid) {
        	$http({
          	  method:'post',
          	  url:'/cloudui/ws/apps/file/updateVersion',
          	  data: $.param({
          		versionId:$scope.resourcetag.id,
          		startPort:$scope.startPort,
          		startScript:$scope.startScript,
          		description:$scope.description
          	  }),
          	  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
            	if(data.result)
            	{
            		
            		if($scope.ngDialogData.type=='assembly'){
            			 
            			 $state.go('app.resource_component_version_detail',{id:$scope.id,resourceVesionId:$scope.ngDialogData.resourceDetail.id},{reload:true}); 
            			 
            		}else if($scope.ngDialogData.type=='topo'){
            			 
            			$state.go('app.resource_topo_version_detail',{id:$scope.id,resourceVesionId:$scope.ngDialogData.resourceDetail.id},{reload:true});
            			 
            		}
            		ngDialog.close();
            		Notify.alert(
                        '<em class="fa fa-check"></em> 更新成功！' ,
                        {status: 'success'}
                    );
            		 
            		
            		
            		
            	}else
            	{
            		Notify.alert(
                        '<em class="fa fa-times"></em> '+data.reason ,
                        {status: 'danger'}
                    );
            	}
            })
        }
    }
}])

/* *****资源详情***** */

mControllers.controller('resourceServerDetailCtrl',['$scope','$http','$stateParams',function($scope,$http,$stateParams){
	  // 详情信息
	  $http.get('/cloudui/ws/apps/file/getResourceInfo'+'?v='+(new Date().getTime()),{
	    params:{
	    	resourceId:$stateParams.resourceId,   
	    } 
	  }).success(function(data){
	     $scope.resourceDetail=data;
	  })
}])

/* *****资源版本列表***** */
mControllers.controller('resourceServerVersion',['$scope','$http','$filter','$stateParams','ngDialog','Notify','$state',function($scope,$http,$filter,$stateParams,ngDialog,Notify,$state){
	  
    $scope.pageSize=10;
    $scope.keyword='';

    $scope.onPageChange = function ()
    {   
      $http.get('/cloudui/ws/apps/file/versionList'+'?v=' + (new Date().getTime()),{
      params:
          { 
	          resourceId:$stateParams.resourceId,   
	          pageSize:$scope.pageSize,
	          pageNum:$scope.pageNum,
	          keyword:$scope.keyword
          }
     }).success(function(data){
        $scope.resourcevlist = data;
        $scope.pageCount=Math.ceil($scope.resourcevlist.total/$scope.pageSize);
        if($scope.pageCount==0){
          $scope.pageCount=1;
        }
        
        if($scope.resourcevlist.rows.length==0){
        	$state.go('app.resource',{},{reload:true});
        }
     })
    }

    // 搜素应用
    $scope.searchV=function()
    {
         $scope.pageNum=1;
         $scope.onPageChange();
    }
    // 查看版本信息弹出框
    $scope.dialogresourcev = function (param,type) {
        ngDialog.open({
          template: 'app/views/dialog_resourcetag.html'+'?action='+(new Date().getTime()),
          className: 'ngdialog-theme-default',
          scope: $scope,
          closeByDocument:false,
          data:{resourceDetail:param,type:type},
          cache:false,
          controller:'resourceTagDetail'
        });
    };
    
    // 删除资源版本
    
    $scope.delversion=function(param,type){
      $http.get('/cloudui/ws/apps/file/deleteVersion'+'?v='+(new Date().getTime()),{params:{
        versionId:param
      }}).success(function(data){
        if(data.result)
        {
          Notify.alert(
                    '<em class="fa fa-check"></em> 删除成功！' ,
                    {status: 'success'}
                );
          
          if(type=='app'){
        	  $state.go('app.resource_server_detail.version',{resourceId:$stateParams.resourceId},{reload:true});
          }else if(type=='topo'){
        	  $state.go('app.resource_topo_detail.version',{resourceId:$stateParams.resourceId},{reload:true});
          }
          
         
        }else
        {
           Notify.alert(
                     '<em class="fa fa-times"></em> 删除失败',
                     {status: 'danger'}
                  );
        }
      })
    }
}])

/* *****资源版本详情***** */

mControllers.controller('resourceTagDetail',['$scope','$http','Notify','$state','ngDialog','$window',function($scope,$http,Notify,$state,ngDialog,$window){
	//版本信息
	$scope.resourcetag=$scope.ngDialogData.resourceDetail;
	 
	$scope.startPort=$scope.resourcetag.startPort||'';
	$scope.startScript=$scope.resourcetag.startScript||'';
	$scope.description=$scope.resourcetag.description||'';
	
	// 验证表单
    $scope.submitted = false;
    $scope.validateInput = function(name, type) {
        var input = $scope.createResourceForm[name];
        return (input.$dirty || $scope.submitted) && input.$error[type];
    };
     
    // 更新信息
    $scope.updateResourceFn=function(){
    	 
        $scope.submitted = true;
        if ($scope.createResourceForm.$valid) {
        	$http({
          	  method:'post',
          	  url:'/cloudui/ws/apps/file/updateVersion',
          	  data: $.param({
          		versionId:$scope.resourcetag.id,
          		startPort:$scope.startPort,
          		startScript:$scope.startScript,
          		description:$scope.description
          	  }),
          	  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
            	if(data.result)
            	{
            		if($scope.ngDialogData.type=='app'){
            			 
            			 $state.go('app.resource_server_detail.version',{resourceId:$scope.ngDialogData.resourceDetail.resourceId},{reload:true}); 
            			 
            		}else if($scope.ngDialogData.type=='topo'){
            			 
            			$state.go('app.resource_topo_detail.version',{resourceId:$scope.ngDialogData.resourceDetail.resourceId},{reload:true});
            			 
            		}
            		ngDialog.close();
            		Notify.alert(
                        '<em class="fa fa-check"></em> 更新成功！' ,
                        {status: 'success'}
                    );
            		 
            		
            		
            		
            	}else
            	{
            		Notify.alert(
                        '<em class="fa fa-times"></em> '+data.reason ,
                        {status: 'danger'}
                    );
            	}
            })
        }
    }
}])

/* ----------------------------选择配置--------------------------------------- */

/* *****已有配置列表***** */

mControllers.controller('configListCtrl',['$rootScope','$scope','$http',function($rootScope,$scope,$http){
   var picname=['tomcat','centos','mysql','redis','django','lamp','mongodb','nginx','node','ubuntu','zookeeper','memcache'];  
   $scope.pageSize=5;
   $scope.search={};
   $scope.onPageChange = function (pageNum)
   { 
      $scope.loadoff=true;
      $http.get('/cloudui/ws/apps/configs/list'+ '?v=' + (new Date().getTime()),{
          params:
          {
                type:$scope.ngDialogData.type,
                pageNum:pageNum,
                pageSize:$scope.pageSize,
                keyword:$scope.search.val
          }
      }).success(function(data){
          $scope.loadoff=false;
          $scope.resultoff=data.rows.length>0?true:false;
          $scope.warninginfo='无';
              
          if($scope.resultoff){
            for(var i=0;i<data.rows.length;i++)
            {
               var pic=''
               for(var j=0;j<picname.length;j++)
               {
                  if(data.rows[i].name.indexOf(picname[j])!==-1)
                  {
                    var pic=picname[j]
                  }
               }
               if(!pic){
                 pic='config' 
               }
               data.rows[i].pic=pic;
               $scope.configlist=data;
            }
          }else{
            $scope.configlist=data; 
          }
              
          $scope.pageCount=Math.ceil(data.total/$scope.pageSize);
          if($scope.pageCount==0){
                $scope.pageCount=1;
          }
          }).error(function(){
               $scope.resultoff=false;
               $scope.warninginfo='暂无结果';
          })
   }
   //搜素配置
   $scope.searchConfig=function(e)
   {  
     if(e.type=='click')
     {
         $scope.loadoff=false;
         $scope.onPageChange(1); 
     }else if(e.type=='keyup')
     {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13)
        {
           $scope.loadoff=false;
           $scope.onPageChange(1);     
        }
     }
     if($scope.search.val.length==0)
     {
        $scope.onPageChange(1); 
     }
   }
}])

/* *****添加配置***** */

mControllers.controller('addConfigCtrl',['$rootScope','$scope','$http','$state','Notify',function($rootScope,$scope,$http,$state,Notify){

   // 验证表单
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
      var input = $scope.addConfigForm[name];
      return (input.$dirty || $scope.submitted) && input.$error[type];
  };

  $scope.configparams=[{
        key: '',
        value: '',
        type:'',
        description:''
  }];
  
  // 添加配置
    $scope.addConfig = function() {
      $scope.inserted = {
        key: '',
        value: '',
        type:'',
        description:''
      };
      $scope.configparams.push($scope.inserted);
    };

    // 删除配置
    $scope.delConfig=function(idx){
      $scope.configparams.splice(idx,1);
    }

    
    $scope.submitconfigForm=function(){

      // 配置传值
      
      $scope.configparamsdata=[];
      
      angular.forEach($scope.configparams,function(val,key){
        var configobj=angular.toJson(val);
        $scope.configparamsdata.push(configobj);
      })

      $scope.configparamsdataarr="["+$scope.configparamsdata+"]";
      
      $rootScope.app.layout.isShadow=true;
 
      $http({
              method:'post',
              url:'/cloudui/ws/apps/configs/create',
              data: $.param({
                type:$rootScope.configType,
                configName:$scope.configName,
                description:$scope.description,
                configs:$scope.configparamsdataarr
              }),   
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
        	$rootScope.app.layout.isShadow=false;
	        if(data.result)
	        {
	            $rootScope.newConfigdata=data;
	            angular.element('body').removeClass('offsidebar-open');
	            angular.element('body').removeClass('shadow');  
	        }else
	        {
	             Notify.alert(
	                 '<em class="fa fa-times"></em> '+data.msg ,
	                  {status: 'danger'}
	              );
	        }
      }) 
       
    }
}])

/* ----------------------------编排模板--------------------------------------- */

/* *****编排模板列表***** */

mControllers.controller('templateListCtrl',['$rootScope','$scope','$http','ngDialog','Notify','$state',function($rootScope,$scope,$http,ngDialog,Notify,$state){

  // 模板列表
    $scope.pageSize=10;
    $scope.onPageChange = function (pageNum)
    {   
      $http.get('/cloudui/ws/apps/template/listTemplates'+'?v=' + (new Date().getTime()),{
      params:
          {
            pageNum:pageNum,
            pageSize:$scope.pageSize,
            templateName:$scope.searchval,
            isPublic:false
          }
     }).success(function(data){
        $scope.templist = data;
        $scope.templistoff=data.total>0?true:false;
        $scope.warninginfo='提示：暂无编排模板';
        $scope.pageCount=Math.ceil($scope.templist.total/$scope.pageSize);
        if($scope.pageCount==0){
          $scope.pageCount=1;
        }
     })
    }
 
    // 搜素模板
    
    $scope.searchTemplate=function(e)
    {
         var keycode = window.event?e.keyCode:e.which;
         if(keycode==13)
         {
           $scope.onPageChange(1); 
         }
         if($scope.searchval.length==0)
         {
            $scope.onPageChange(1); 
         }
    }
 
   
   // 模板资源删除
   
   $scope.deltempresource=function(param){
     ngDialog.openConfirm({
           template:
                '<p class="modal-header">您确定要删除此模板吗?</p>' +
                '<div class="modal-body text-right">' +
                  '<button type="button" class="btn btn-default mr20" ng-click="closeThisDialog(0)">取消' +
                  '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
                '</button></div>',
          plain: true,
          closeByDocument:false,
          className: 'ngdialog-theme-default'
     }) .then(
        function(){
         $rootScope.app.layout.isShadow=true;
          $http.delete('/cloudui/ws/apps/template/deleteTemplateInfo'+'?v='+(new Date().getTime()),{
           params:{
             templateInfoUUID:param 
           }
         }).success(function(data){
          $rootScope.app.layout.isShadow=false;
            if(data.result)
          {
              Notify.alert(
                    '<em class="fa fa-check"></em> '+data.message ,
                    {status: 'success'}
                );  
              $state.go('app.template_list',{},{reload:true});
          }else
          {
            Notify.alert(
                    '<em class="fa fa-times"></em> '+data.message ,
                    {status: 'danger'}
                ); 
          }
         })    
     })
   }
   
   
}])

/* *****添加编排模板***** */

mControllers.controller('createtemplate', ['$rootScope','$scope', '$http', '$ocLazyLoad','$state','Notify','$filter','$timeout',function ($rootScope,$scope, $http, $ocLazyLoad,$state,Notify,$filter,$timeout) {

  //验证表单
  $scope.submitted = false;
  $scope.validateInput = function(name, type) {
      var input = $scope.formValidate[name];
      return (input.$dirty || $scope.submitted) && input.$error[type];
  };

  
  $scope.search={};
  
  $scope.checkappId=[]; // 选中的服务介质
  
 
  // 获取服务介质列表 
  $scope.pageSize=5;
  $scope.onappPageChange = function (pageNum)
  {  
    $http.get('/cloudui/ws/apps/listOperationApps'+'?v=' + (new Date().getTime()),{
    params:
        {
          pageNum:pageNum,
          pageSize:$scope.pageSize,
          appName:$scope.search.searchappval||''
        }
   }).success(function(data){
    
     angular.forEach(data.rows,function(val,key){
       var ischecked=$filter('filter')($scope.checkappId,val.appId).length>0?true:false;
       data.rows[key].ischecked=ischecked;
     })

     $scope.applist = data;
     $scope.apppageCount=Math.ceil($scope.applist.total/$scope.pageSize);
     if($scope.apppageCount==0){
         $scope.apppageCount=1;
     }
   })
  }
  
  //搜素服务介质
  $scope.searchApp=function(e)
  {
    var keycode = window.event?e.keyCode:e.which;
    if(keycode==13)
    {
      $scope.onappPageChange(1); 
    }
  }
  
  //依赖
  $scope.depsFn=function(data,id)
  {
    $timeout(function(){
      for(var i = 0; i< data.length; i++){  
            $("<option value='"+data[i].id+"'>"+data[i].name+"</option>").appendTo(id); 
        } 
      $(id).chosen({
          no_results_text:"没有搜索到"
      }); 
    }); 
  }
  // 选中的服务介质
  $scope.choseAppList=[];
  
  $scope.$watch('applist',function(newval,oldval){
       
	  angular.forEach(newval.rows,function(val,key){
		 
        if(val.versionid)
		 {
        	if(val.ischecked){
	 
    			 var isexit=$filter('filter')($scope.choseAppList,val.appId).length>0?true:false;
    		 
    			 if(!isexit)
    			 {
    				 $scope.choseAppList.push(val) 
    			 }

        	}else{
 
        		for(var i=0;i<$scope.choseAppList.length;i++)
	    		 {
	    			 if($scope.choseAppList[i].appId==val.appId)
	    			 {
	    				 $scope.choseAppList.splice(i,1) 
	    			 }
	    		 } 
        	}
			 
		 } 
        
	  })
	   
  },true)
  
  
  // 添加服务介质
  
  $scope.addappFn=function(apparr){
	 
    $scope.appjobchosearr=[];
    $scope.appchosearr=[];
  
  angular.forEach(apparr,function(val,key){
    var obj={};
    obj.id=val.split('&')[0];
    obj.name=val.split('&')[1];
    obj.type="app";
    
    obj.versionId=$filter('filter')($scope.choseAppList,obj.id)[0].versionid;
   
    $scope.appchosearr.push(obj);
    $scope.appjobchosearr.push(obj);
  })

  
  for(var i=0;i<$scope.appchosearr.length;i++)
  {
     var arrappdata=[];
     for(var j=0;j<$scope.appjobchosearr.length;j++)
     {
       var equal=angular.equals($scope.appchosearr[i],$scope.appjobchosearr[j])
       if(!equal)
         {
         arrappdata.push($scope.appjobchosearr[j]) 
         } 
     }
     $scope.depsFn(arrappdata,'#st'+i);
  }

   
 }
  
  
  
  // 创建模板
  
  $scope.createTemp=function(){
	  $http.post('/cloudui/ws/apps/template/createTemplateManually',{
          "templateName":$scope.templateName,
          "description":$scope.description,
          "source":$scope.appjobchosearr,
          "isPublic":false
       }).success(function(data){
         if(data.result)
           {
             Notify.alert(
                   '<em class="fa fa-check"></em> 创建成功！' ,
                   {status: 'success'}
               );
             $state.go('app.template_list',{},{reload:true}); 
           }else
           {
             Notify.alert(
                   '<em class="fa fa-times"></em> 创建失败！' ,
                   {status: 'danger'}
               );
           }
       })
     
  }

}])

/* *****模板详情***** */

mControllers.controller('templateDetailCtrl',['$scope','$http','$stateParams','$ocLazyLoad','$filter',function($scope,$http,$stateParams,$ocLazyLoad,$filter){
  
	$scope.editorOpts = {
	    mode: 'javascript',
	    lineNumbers: true,
	    matchBrackets: true,
	    theme: 'night',
	    viewportMargin: Infinity
	};

    $scope.refreshEditor = 0;

    $scope.loadTheme = function() {
	    var BASE = 'vendor/codemirror/theme/';
	    $ocLazyLoad.load(BASE + $scope.editorOpts.theme + '.css');
	    $scope.refreshEditor = !$scope.refreshEditor;
   };
		  
    $scope.loadTheme($scope.editorOpts.theme);
    
	$http.get('/cloudui/ws/apps/template/getTemplateInfoDetail'+'?v='+(new Date().getTime()),{
    params:{
       templateInfoUUID:$stateParams.templateid
    }
   }).
   success(function(data){
       $scope.templateName=data.templateName;
	   $scope.description=data.description;
	   $scope.updateTime=data.updateTime;
       $scope.code=$filter('json')(data.source);
   })
}])

/* ******部署模板***** */

mControllers.controller('tempDeployCtrl',['$rootScope','$scope','$http','Notify','ngDialog','$state',function($rootScope,$scope,$http,Notify,ngDialog,$state){
	 
	 $scope.stateParams=$scope.ngDialogData;
	   
	 $scope.formdata={}; 
	 
	 // 编排模板列表
	 $scope.getTempList=function(){
	      $http.get('/cloudui/ws/apps/template/listTemplates'+'?v=' + (new Date().getTime()),{
	      params:
	          {
	            pageNum:1,
	            pageSize:10000,
	            isPublic:false
	          }
	     }).success(function(data){
	        $scope.tempList = data.rows;
	        $scope.formdata.temp=$scope.tempList[0];
	     })
	 }
	 $scope.getTempList();
	   
	 $scope.$watch('formdata.temp',function(newval,oldval){
	      if(newval){
	    	   // 模板下的配置参数
	           $scope.paramlist=[];
	           angular.forEach(newval.source.input,function(val,key){
	             var obj={};
	             obj.key=key;
	             obj.placeholder=val;
	             $scope.paramlist.push(obj);
	           })
	          // 模板下的组件及实例数
	         $http.get('/cloudui/ws/apps/componentInstanceNum'+'?v='+(new Date().getTime()),{
	        	  params:{
	        		  templateInfoUUID:newval.UUID  
	        	  }
	          }).success(function(data){
	        	 $scope.componentList=[]; 
	        	 angular.forEach(data,function(val,key){
	                 var obj={};
	                 obj.key=key;
	                 obj.val=parseInt(val);
	                 $scope.componentList.push(obj);
	              })
	          })
	      }
	})  
	 
	$scope.getNodes=function(wizard){
		 // 配置参数
		 $scope.input={};
		 angular.forEach($scope.paramlist,function(val,key){
			      $scope.input[val.key]=val.val;
		  })
		  // 组件实例
		  $scope.componentInstanceNum={};
		   angular.forEach($scope.componentList,function(val,key){
			      $scope.componentInstanceNum[val.key]=val.val;
		  })
		  $rootScope.app.layout.isShadow=true;
		  // 创建应用
		  $http.get('/cloudui/ws/apps/template/deployTemplate'+'?v='+(new Date().getTime()),{
			   params:{
				   "templateInfoUUID":$scope.formdata.temp.UUID,
				   "templateName":$scope.formdata.templatename,
			       "input":$scope.input,
			       "clusterId":$scope.stateParams.clusterId,
			       "componentInstanceNum":$scope.componentInstanceNum
			   }
		  }).success(function(data){
			   var deployTemplateData=data;
			   if(deployTemplateData.result)
			   {
				   // 创建实例
				   $http.get('/cloudui/ws/apps/template/deployAppsInTemplate'+'?v='+(new　Date().getTime()),{
						  params:{
							  templateUUID:deployTemplateData.templateUUID,
							  doDeploy:false
						  }
				   }).success(function(data){
					   var deployAppsInTemplate=data;
					   if(deployAppsInTemplate.result){
						   // 发送命令
						   $http.get('/cloudui/ws/apps/sendDeployCommand'+'?v='+(new Date().getTime()),{
								 params:{
									 templateUUID:deployTemplateData.templateUUID
								 }
						  }).success(function(data){
							  var sendData=data;
							  if(sendData.result){
								  // 获取节点
								  $http.get('/cloudui/ws/apps/findTemplateDeployHosts'+'?v='+(new Date().getTime()),{
										 params:{
											 templateUUID:deployTemplateData.templateUUID
										 }
								  }).success(function(data){
										 var findTemplateDeployHosts=data;
										 $rootScope.app.layout.isShadow=false;
										 $scope.serverNodes=findTemplateDeployHosts;
										 wizard.go(2);
								  })
							  }else{
								  $rootScope.app.layout.isShadow=false;
								  Notify.alert(
							           '<em class="fa fa-check"></em> '+sendData.message ,
							           {status: 'success'}
								  );
							  }
						  })
					   }else{
						   $rootScope.app.layout.isShadow=false;
						   Notify.alert(
					           '<em class="fa fa-check"></em> '+deployAppsInTemplate.message ,
					           {status: 'success'}
						   );
					   }
				   })
			   }else{
				   $rootScope.app.layout.isShadow=false;
				   // 不能进行下一步操作
				   Notify.alert(
		               '<em class="fa fa-check"></em> '+deployTemplateData.message ,
		               {status: 'success'}
				   );
			   }
		   })
	}
	 
	$scope.finishDeploy=function(closeThisDialog){
		closeThisDialog(0);
		$state.go('app.env.service',{clusterid:$scope.stateParams.clusterId},{reload:true})
	}
  
}])

/* *****模板配置***** */
mControllers.controller('configTemplateCtrl',['$scope','$http','$stateParams','Notify','ngDialog','$state',function($scope,$http,$stateParams,Notify,ngDialog,$state){
	$http.get('/cloudui/ws/apps/template/listAllConfigsInTemplateInfo'+'?v='+(new Date().getTime()),{
		params:{
			templateInfoUUID:$stateParams.templateid
		}
	}).success(function(data){
		$scope.tempconfigList=data;
	})
	
	// 添加一行
    $scope.addConfig = function(index) {
      $scope.inserted = {
        key: '',
        value: '',
        description: '',
      };
      $scope.tempconfigList[index].detail.push($scope.inserted);
    };
    
 // 更新添加一行
    $scope.saveConfig = function(data, id,versionId,outindex,innerindex) {
  		if(data.key&&data.value){
  			$http({
  	            method:'post',
  	            url:'/cloudui/ws/apps/configs/updateLine',
  	            data: $.param(
  	            {
  	                versionId:versionId,
  	                id:id||'',
  	                key:data.key,
  	                value:data.value,
  	                type:data.type,
  	                description:data.description
  	              } 
  	            ),   
  	          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  	          }).success(function(data){
  	        if(data.result)
  	        {
  	             Notify.alert(
  	                   '<em class="fa fa-check"></em> 保存成功！' ,
  	                   {status: 'success'}
  	              );
  	             $state.go('app.config_template',{templatename:$stateParams.templatename,templateid:$stateParams.templateid},{reload:true});
  	        }else
  	        {
  	          Notify.alert(
  	               '<em class="fa fa-times"></em> '+data.msg ,
  	                {status: 'danger'}
  	            );
  	          
  	           
  	        }
  	      })
  		}else{
  			Notify.alert(
                 'key或value未填写,请重新添加！' ,
                  {status: 'danger'}
  		    );
  			$scope.tempconfigList[outindex].detail.splice(innerindex,1);
  		}
      
      };
      
      // 删除一行
      $scope.removeConfig = function(id,outindex,innerindex) {
        $http.get('/cloudui/ws/apps/configs/deleteLine'+'?v='+(new Date().getTime()),{
          params:{
            id:id  
          }  
        }).success(function(data){
         if(data.result)
         {
               Notify.alert(
                    '<em class="fa fa-check"></em> 删除成功！' ,
                    {status: 'success'}
                );
                $scope.tempconfigList[outindex].detail.splice(innerindex,1);
         }else
         {
                 Notify.alert(
                    '<em class="fa fa-times"></em> '+data.msg ,
                    {status: 'danger'}
                 );
         }
        })
      };
      
      // 导入
      
      $scope.openinject = function (vid,type) {
    	  $scope.typeval='template';
          ngDialog.open({
            template: 'app/views/dialog_inject.html'+'?action='+(new Date().getTime()),
            className: 'ngdialog-theme-default ngdialog-lg',
            scope: $scope,
            closeByDocument:false,
            data:{vid:vid,type:type},
            cache: false,
            controller:'inject'
          });
     };
     
     $scope.$on('ngDialog.closed', function () {
  	   if($scope.typeval=='template'){
  	  	 $state.go('app.config_template',{templateid:$stateParams.templateid,templatename:$stateParams.templatename},{reload:true}); 
  	   }
        
     });
    
}])


/* ----------------------------服务介质配置--------------------------------------- */

/* *****服务介质配置列表***** */

mControllers.controller('configComponentListCtrl',['$scope','$http','Notify','$state','ngDialog',function($scope,$http,Notify,$state,ngDialog){
   $scope.pageSize=10;
    $scope.onPageChange = function ()
    {
      $http.get('/cloudui/ws/apps/configs/list'+'?v=' + (new Date().getTime()),{
      params:
          {
            type:'component',
            pageNum:$scope.pageNum,
            pageSize:$scope.pageSize,
            keyword:$scope.searchval||''
          }
     }).success(function(data){
        $scope.configlist = data;
        $scope.resultoff=data.rows.length>0?true:false;
        $scope.warninginfo='提示：暂无配置';
        $scope.pageCount=Math.ceil($scope.configlist.total/$scope.pageSize);
        if($scope.pageCount==0){
          $scope.pageCount=1;
        }
     }).error(function(){
         $scope.resultoff=false;
         $scope.warninginfo='暂无结果';
     })
    }  
    
   // 搜素配置
    $scope.searchConfig=function(e)
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
    
    $scope.opendelConfig=function(params){
        ngDialog.openConfirm({
           template:
                '<p class="modal-header">您确定要删除此配置吗?</p>' +
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
            $http.get('/cloudui/ws/apps/configs/delForApp'+'?v='+(new Date().getTime()),{
              params:{
                configId:params
              }
              }).success(function(data){
               if(data.result)
               {
                 Notify.alert(
                         '删除成功!' ,
                         {status: 'success'}
                      );
                 $state.go('app.config_component',{},{reload:true});
               }else
               {
                 Notify.alert(
                         '删除失败,'+data.msg ,
                         {status: 'danger'}
                      ); 
               }
             }) 
          }
        )
    }
    
   
}])

/* *****配置详情***** */

mControllers.controller('configComponentDetailCtrl',['$scope','$http','$stateParams','$state','ngDialog','Notify','$filter','$location',function($scope,$http,$stateParams,$state,ngDialog,Notify,$filter,$location){
   
  if($location.path().indexOf('component')!==-1){
	  $scope.typeval='component';
  }else if($location.path().indexOf('topo')!==-1){
	  $scope.typeval='topo';
  }
  // 添加一行
    $scope.addConfig = function() {
      $scope.inserted = {
        key: '',
        value: '',
        description: '',
      };
      $scope.configlists.push($scope.inserted);
    };

    
    // 导入
    
    $scope.openinject = function (vid,type) {
        ngDialog.open({
          template: 'app/views/dialog_inject.html'+'?action='+(new Date().getTime()),
          className: 'ngdialog-theme-default ngdialog-lg',
          scope: $scope,
          closeByDocument:false,
          data:{vid:vid,type:type},
          cache: false,
          controller:'inject'
        });
   };
   
   // 导出
   $scope.outForm=function()
   {
     $('#outform').submit();   
   }
   
   $scope.$on('ngDialog.closed', function () {
	   
	   if($scope.typeval=='component'){
	  	 $state.go('app.config_component_detail',{configid:$stateParams.configid},{reload:true}); 
	   }else if($scope.typeval=='topo'){
	  	 $state.go('app.config_topology_detail',{configid:$stateParams.configid},{reload:true}); 
	   }
      
   });
   
   
   
   // 参数表单
   
   $scope.$watch('configlists',function(newdata,olddata){
      $scope.datarr=[]
      angular.forEach(newdata,function(val,key){
         
         var dataobj=angular.toJson({
           key:val.key,
           value:val.value,
           type:val.type,
           description:val.description
         })
                
         $scope.datarr.push(dataobj)
       })
      
       $scope.dataS='{"rows":['+$scope.datarr+']}';
       $scope.out_data= $scope.dataS ;
    
     },true)
   
   // 配置基本信息
 
  var configinfo=$http.get('/cloudui/ws/apps/configs/getConfigInfo'+'?v='+(new Date().getTime()),{params:{
    configId:$stateParams.configid
  }}).success(function(data){
    $scope.config=data;
  })
   
   
  // 配置下的版本列表
  $http.get('/cloudui/ws/apps/configs/getVersions'+'?v='+(new Date().getTime()),{
      params:{
        configId:$stateParams.configid
      }
    }).success(function(data){
      $scope.configversionList=data;
      if($stateParams.configVersion){
        $scope.curversion=$filter('filter')($scope.configversionList,$stateParams.configVersion)[0];
      }else{
        $scope.curversion=$scope.configversionList[0];
      }
  })
  
  // 参数展示
  $scope.getParamsFn=function(vid,search){
     $http.get('/cloudui/ws/apps/configs/getConfigList'+'?v='+(new Date().getTime()),{params:{
        versionId:vid,
        keyword:search
     }}).success(function(data){
        $scope.configlists=data.rows;
        $scope.out_filename=data.name+'_'+data.version+'.properties';  
     }) 
   }
  
  // 配置下的参数
  $scope.$watch('curversion',function(newval,oldval){
    if(newval)
    {
      $http.get('/cloudui/ws/apps/configs/getConfigList'+'?v='+(new Date().getTime()),{params:{
        versionId:newval.id,
        keyword:$scope.search
      }}).success(function(data){
        $scope.configlists=data.rows;
     
        $scope.out_filename=data.name+'_'+data.version+'.properties';
       
      })
      $scope.getParamsFn(newval.id,$scope.search);
    }
  })
  
     // 搜素key
   $scope.searchKey=function(e)
   {
         var keycode = window.event?e.keyCode:e.which;
         if(keycode==13)
         {
           $scope.getParamsFn($scope.curversion.id,$scope.search);
         }
         if($scope.search.length==0)
         {
           $scope.getParamsFn($scope.curversion.id,$scope.search);
         }
  }
  
  // 删除配置版本
  
  $scope.delForVersion=function(type){
        ngDialog.openConfirm({
           template:
                '<p class="modal-header">您确定要删除此版本吗?</p>' +
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
            $http.get('/cloudui/ws/apps/configs/delForVersion'+'?v='+(new Date().getTime()),{
              params:{
                versionId:$scope.curversion.id
              }
              }).success(function(data){
               if(data.result)
               {
                 Notify.alert(
                         '删除成功!' ,
                         {status: 'success'}
                      );
                 
                 if(type=='component'){
                	 
                	 $state.go('app.config_component_detail',{configid:$stateParams.configid},{reload:true}); 
                 }else if(type=='topo'){
                	 
                	 $state.go('app.config_topology_detail',{configid:$stateParams.configid},{reload:true}); 
                 }
                 
               
               }else
               {
                 Notify.alert(
                         '删除失败,'+data.msg ,
                         {status: 'danger'}
                   ); 
               }
             }) 
          }
        )
    }

  // 更新添加一行
  $scope.saveConfig = function(data, id) {
		if(data.key&&data.value){
			$http({
	            method:'post',
	            url:'/cloudui/ws/apps/configs/updateLine',
	            data: $.param(
	            {
	                versionId:$scope.curversion.id,
	                id:id||'',
	                key:data.key,
	                value:data.value,
	                type:data.type,
	                description:data.description
	              } 
	            ),   
	          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	          }).success(function(data){
	        if(data.result)
	        {
	             Notify.alert(
	                   '<em class="fa fa-check"></em> 保存成功！' ,
	                   {status: 'success'}
	              );
	        }else
	        {
	          Notify.alert(
	               '<em class="fa fa-times"></em> '+data.msg ,
	                {status: 'danger'}
	            );
	          
	           if($scope.typeval=='component'){
	     	  	 $state.go('app.config_component_detail',{configid:$stateParams.configid},{reload:true}); 
	     	   }else if($scope.typeval=='topo'){
	     	  	 $state.go('app.config_topology_detail',{configid:$stateParams.configid},{reload:true}); 
	     	   }
	        }
	      })
		}else{
			Notify.alert(
               'key或value未填写,请填写！' ,
                {status: 'danger'}
		    );
			$scope.configlists.splice(index,1);
		}
    
    };

    // 删除一行
    $scope.removeConfig = function(id,index) {
      $http.get('/cloudui/ws/apps/configs/deleteLine'+'?v='+(new Date().getTime()),{
        params:{
          id:id  
        }  
      }).success(function(data){
       if(data.result)
       {
        Notify.alert(
                  '<em class="fa fa-check"></em> 删除成功！' ,
                  {status: 'success'}
              );
        $scope.configlists.splice(index,1);
         
       }else
       {
         Notify.alert(
                  '<em class="fa fa-times"></em> '+data.msg ,
                  {status: 'danger'}
               );
       }
      })
    };

    
    
}])

/* *****版本关联资源配置详情***** */

mControllers.controller('configVersionDetail',['$scope','$http','$stateParams','$state','ngDialog','Notify','$filter','$location',function($scope,$http,$stateParams,$state,ngDialog,Notify,$filter,$location){
	  
	$scope.id=$stateParams.id;
	
	$scope.configVersionid=$stateParams.configVersionid;
	
	if($location.path().indexOf('assembly')!==-1){
		  $scope.typeval='component';
	}else if($location.path().indexOf('topo')!==-1){
		  $scope.typeval='topo';	  
	}
	
	// 添加一行
    $scope.addConfig = function() {
      $scope.inserted = {
        key: '',
        value: '',
        description: '',
      };
      $scope.configlists.push($scope.inserted);
    };
    
    // 导入
    
    $scope.openinject = function (vid,type) {
        ngDialog.open({
          template: 'app/views/dialog_inject.html'+'?action='+(new Date().getTime()),
          className: 'ngdialog-theme-default ngdialog-lg',
          scope: $scope,
          closeByDocument:false,
          data:{vid:vid,type:type},
          cache: false,
          controller:'inject'
        });
   };
   
  // 导出
   $scope.outForm=function()
   {
     $('#outform').submit();   
   }
   
   $scope.$on('ngDialog.closed', function () {
	   
	   if($scope.typeval=='component'){
	  	 $state.go('app.config_component_version_detail',{id:$scope.id,configid:$scope.configVersionid},{reload:true}); 
	   }else if($scope.typeval=='topo'){
	  	 $state.go('app.config_topology_version_detail',{id:$scope.id,configid:$scope.configVersionid},{reload:true}); 
	   }
      
   });
   
 // 参数表单
   
   $scope.$watch('configlists',function(newdata,olddata){
      $scope.datarr=[]
      angular.forEach(newdata,function(val,key){
         
         var dataobj=angular.toJson({
           key:val.key,
           value:val.value,
           type:val.type,
           description:val.description
         })
                
         $scope.datarr.push(dataobj)
       })
      
       $scope.dataS='{"rows":['+$scope.datarr+']}';
       $scope.out_data= $scope.dataS ;
    
     },true)
   
   // 配置参数
 
    
    $scope.getParamsFn=function(vid,search){
	     $http.get('/cloudui/ws/apps/configs/getConfigList'+'?v='+(new Date().getTime()),{params:{
	        versionId:vid,
	        keyword:search
	     }}).success(function(data){
	    	$scope.configVersionData=data;
	        $scope.configlists=data.rows;
	        
	        $scope.out_filename=data.name+'_'+data.version+'.properties';  
	        
	     }) 
     }
   
     $scope.getParamsFn($scope.configVersionid,'');
    
     // 搜素key
     $scope.searchKey=function(e)
     {
         var keycode = window.event?e.keyCode:e.which;
         if(keycode==13)
         {
           $scope.getParamsFn($scope.configVersionid,$scope.search);
         }
         if($scope.search.length==0)
         {
           $scope.getParamsFn($scope.configVersionid,$scope.search);
         }
    }
     
  // 删除配置
     
     $scope.delForVersion=function(type){
           ngDialog.openConfirm({
              template:
                   '<p class="modal-header">您确定要删除此配置吗?</p>' +
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
               $http.get('/cloudui/ws/apps/configs/delForVersion'+'?v='+(new Date().getTime()),{
                 params:{
                   versionId:$stateParams.configVersionid
                 }
                 }).success(function(data){
                  if(data.result)
                  {
                    Notify.alert(
                            '删除成功!' ,
                            {status: 'success'}
                         );
                    
                    if(type=='component'){
                   	 
                   	 $state.go('config_component_version_detail',{id:$scope.id,configid:$scope.configVersionid},{reload:true}); 
                    }else if(type=='topo'){
                   	 
                   	 $state.go('app.config_topology_version_detail',{id:$scope.id,configid:$scope.configVersionid},{reload:true}); 
                    }
                    
                  
                  }else
                  {
                    Notify.alert(
                            '删除失败,'+data.msg ,
                            {status: 'danger'}
                      ); 
                  }
                }) 
             }
           )
       }
   
    // 更新添加一行
   $scope.saveConfig = function(data, id) {
 		if(data.key&&data.value){
 			$http({
 	            method:'post',
 	            url:'/cloudui/ws/apps/configs/updateLine',
 	            data: $.param(
 	            {
 	                versionId:$scope.configVersionid,
 	                id:id||'',
 	                key:data.key,
 	                value:data.value,
 	                type:data.type,
 	                description:data.description
 	              } 
 	            ),   
 	          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
 	          }).success(function(data){
 	        if(data.result)
 	        {
 	             Notify.alert(
 	                   '<em class="fa fa-check"></em> 保存成功！' ,
 	                   {status: 'success'}
 	             );
 	             
 	            if($scope.typeval=='component'){
 	            	$state.go('app.config_component_version_detail',{id:$scope.id,configVersionid:$scope.configVersionid},{reload:true});
 	      	    }else if($scope.typeval=='topo'){
 	      	  	    $state.go('app.config_topology_version_detail',{id:$scope.id,configVersionid:$scope.configVersionid},{reload:true}); 
 	      	    }
 	                
 	        }else
 	        {
 	          Notify.alert(
 	               '<em class="fa fa-times"></em> '+data.msg ,
 	                {status: 'danger'}
 	            );
 	          
 	           if($scope.typeval=='component'){
 	     	  	 $state.go('config_component_version_detail',{configid:$scope.configVersionid},{reload:true}); 
 	     	   }else if($scope.typeval=='topo'){
 	     	  	 $state.go('config_topology_version_detail',{configid:$scope.configVersionid},{reload:true}); 
 	     	   }
 	        }
 	      })
 		}else{
 			Notify.alert(
                'key或value未填写,请填写！' ,
                 {status: 'danger'}
 		    );
 			$scope.configlists.splice(index,1);
 		}
     
     };

     // 删除一行
     $scope.removeConfig = function(id,index) {
       $http.get('/cloudui/ws/apps/configs/deleteLine'+'?v='+(new Date().getTime()),{
         params:{
           id:id  
         }  
       }).success(function(data){
        if(data.result)
        {
         Notify.alert(
                   '<em class="fa fa-check"></em> 删除成功！' ,
                   {status: 'success'}
               );
         $scope.configlists.splice(index,1);
          
        }else
        {
          Notify.alert(
                   '<em class="fa fa-times"></em> '+data.msg ,
                   {status: 'danger'}
                );
        }
       })
     };

    
    
}])

/* *****导入配置***** */

mControllers.controller('inject',['$scope','$http','$stateParams','Notify','ngDialog',function($scope,$http,$stateParams,Notify,ngDialog){
 
	
	
  $scope.injectFn=function()
  {
     if($scope.content.indexOf('<reason>')==-1)
     {
      $http({
              method:'post',
              url:'/cloudui/ws/apps/configs/inject',
              data: $.param({
                versionId:$scope.ngDialogData.vid,
                type:$scope.type,
                content:$scope.content 
              }),   
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
        if(data.result)
        {
          Notify.alert(
                      '<em class="fa fa-check"></em> 更新'+data.updatenum+'条，插入'+data.insertnum+'条' ,
                      {status: 'success'}
                );
          $scope.content='';
          ngDialog.close();
        }else
        {
          Notify.alert(
                    '<em class="fa fa-times"></em> 更新'+data.updatenum+'条，插入'+data.insertnum+'条,错误'+data.errornum+'条,请在解决错误后移除reason标签',
                    {status: 'danger'}
                );
          $scope.content='';
          angular.forEach(data.error,function(val,key){
            if(val.reason=='format_error')
            {
              $scope.content+=val.line+'<reason>'+'格式错误'+'</reason>'+'\n';  
            }else
            {
              $scope.content+=val.line+'<reason>'+val.reason+'</reason>'+'\n';
            }
            
          })
        }
      }) 
     }else
     {
       Notify.alert(
                   '问题未解决，请在解决错误后移除reason标签' ,
                   {status: 'info'}
           );
     }
     
  }
}])


/* *****服务介质配置版本添加***** */

mControllers.controller('configComponentVersionAddCtrl',['$scope','$http','$stateParams','$state','Notify',function($scope,$http,$stateParams,$state,Notify){
    
	 
	$scope.configparams=[{
        key: '',
        value: '',
        type:'',
        description:''
  }];
 
  // 添加配置
    $scope.addConfig = function() {
      $scope.inserted = {
        key: '',
        value: '',
        type:'',
        description:''
      };
      $scope.configparams.push($scope.inserted);
    };

    // 删除配置
    $scope.delConfig=function(idx){
      $scope.configparams.splice(idx,1);
    }
    // 配置版本列表
    $http.get('/cloudui/ws/apps/configs/getVersions'+'?v='+(new Date().getTime()),{
        params:{
          configId:$stateParams.configid
        }
    }).success(function(data){
        $scope.configversionList=data;
        $scope.configversion=$scope.configversionList[0].id;
    })
    // 提交
    $scope.submitconfigForm=function(){
         // 配置传值
      
      $scope.configparamsdata=[];
      
      angular.forEach($scope.configparams,function(val,key){
        var configobj=angular.toJson(val);
        $scope.configparamsdata.push(configobj);
      })

      $scope.configparamsdataarr="["+$scope.configparamsdata+"]";
      
        if($scope.copy)
        {
          $scope.data={
        configId:$stateParams.configid,
        createFrom:$scope.configversion,
        configs:[]  
          }
        }else{
          $scope.data={
        configId:$stateParams.configid,
        createFrom:'',
        configs:$scope.configparamsdataarr
           }
        }
        
        $http({
              method:'post',
              url:'/cloudui/ws/apps/configs/addVersion',
              data: $.param($scope.data),   
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
          if(data.result)
          {
            Notify.alert(
                  '<em class="fa fa-check"></em> 创建成功！' ,
                  {status: 'success'}
                );
            if($stateParams.type=='component'){
            	$state.go('app.config_component_detail',{configid:$stateParams.configid},{reload:true});
            }else if($stateParams.type=='topo'){
            	$state.go('app.config_topology_detail',{configid:$stateParams.configid},{reload:true});
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
}])


/* ----------------------------拓扑管理--------------------------------------- */

/* *****创建拓扑***** */

mControllers.controller('topologyCreateCtrl',['$rootScope','$scope','$http','$filter','$state','$stateParams','Notify','FileUploader','$timeout',function($rootScope,$scope,$http,$filter,$state,$stateParams,Notify,FileUploader,$timeout){
 
  $scope.formdata={}; // 表单数据

  var uploader = $scope.uploader = new FileUploader({
      url: '/cloudui/ws/apps/file/upload'
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
	 // console.log(fileItem);
	  $scope.isloading=false;
	  
	  $timeout(function(){
      	   $scope.isloading=true;
      })
  }


  uploader.onSuccessItem = function(fileItem, response, status, headers) {
      if(response.result){
         $scope.fileid=response.fileid;
      }else{
         Notify.alert(
             '<em class="fa fa-times"></em> '+response.message ,
             {status: 'danger'}
         );
      }
      
  };
  
  
  $scope.createTopologyFn=function(){
	  if(uploader.queue.length>0){
	       if(uploader.progress==100){
	    	   
	    	   $rootScope.app.layout.isShadow=true;
	    	   
               $http({
                  method  : 'POST',
                  url     : '/cloudui/ws/apps/file/registResource',
                  data    : $.param({
                     fileid:$scope.fileid, 
                     type:"topo",
                     startScript:$scope.formdata.startScript||'',
                     description:$scope.formdata.description||''
                   }),   
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
                }).success(function(data){
                	   $scope.newResourcedata=data;
                       if($scope.newResourcedata.result)
                       {
                         
                         $http.post('/cloudui/ws/apps/jobs/saveJob',{
                        	 "name":$scope.newResourcedata.resourceName,
                             "type":'host',
                             "description":"",
                             "network":'host',
                             "outerConnect":'',
                             "innerConnect":'',
                             "taskCmd":$scope.formdata.startScript||'',
                             "shareCpu":true,
                             "cpuQuota":'',
                             "cpuNumber":'',
                             "optionsMmx":128,
                             "dockerVolumes":[],
                             "resourceVersionId":$scope.newResourcedata.id,
                             "confVersionId":$scope.newResourcedata.configVersionId
                         }).then(function(response){
                        	 $rootScope.app.layout.isShadow=false;
                        	 if(response.data.result)
                             {
                                     Notify.alert(
                                         '<em class="fa fa-check"></em> '+response.data.message ,
                                         {status: 'success'}
                                     );
                                     $state.go('app.topology_list',{},{reload:true});

                             }else{
                                     Notify.alert(
                                         '<em class="fa fa-times"></em> '+response.data.message ,
                                         {status: 'danger'}
                                     );
                             }
                         })
                       }else
                       {
                    	   $rootScope.app.layout.isShadow=false;
                           Notify.alert(
                             '<em class="fa fa-times"></em> '+$scope.newResourcedata.msg ,
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

/* *****拓扑列表***** */

mControllers.controller('topologyListCtrl',['$scope','$http','Notify','$filter','ngDialog',function($scope,$http,Notify,$filter,ngDialog){
	   
	   $scope.checkappId=[]; // 选中的拓扑

	   // 获取任务列表 
	   $scope.pageSize=10;

	   $scope.onPageChange = function ()
	    {    
	      $http.get('/cloudui/ws/apps/jobs/listJobs'+'?v=' + (new Date().getTime()),{
	      params:
	          {
	            pageNum:$scope.pageNum,
	            pageSize:$scope.pageSize,
	            name:$scope.searchval
	          }
	     }).success(function(data){
	      
	       angular.forEach(data.rows,function(val,key){
	         var ischecked=$filter('filter')($scope.checkappId,val.UUID).length>0?true:false;
	         data.rows[key].ischecked=ischecked;
	       })

	       $scope.tasklist = data;
	       $scope.tasklistoff=data.rows.length>0?true:false;
	       $scope.warninginfo='提示：暂无任务';
	       $scope.pageCount=Math.ceil($scope.tasklist.total/$scope.pageSize);
	       if($scope.pageCount==0){
	    	   $scope.pageCount=1;
	       }
	     }).error(function(){
	         $scope.tasklistoff=false;
	         $scope.warninginfo='暂无结果';
	     })
	    }

	    // 搜素任务
	    $scope.searchTask=function(e)
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

	    // 删除任务 
	    $scope.delTask=function(index,taskid)
	    {
	      ngDialog.openConfirm({
	            template:
	                 '<p class="modal-header">您确定要删除此任务吗?</p>' +
	                 '<div class="modal-body text-right">' +
	                   '<button type="button" class="btn btn-default mr20"  ng-click="closeThisDialog(0)">取消' +
	                   '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
	                 '</button></div>',
	           plain: true,
	           closeByDocument:false,
	           className: 'ngdialog-theme-default'
	         }).then(function(){
	        	 $http.delete('/cloudui/ws/apps/jobs/deleteJob'+'?v='+(new Date().getTime()),{
			 		   params:{
			 			  uuid:taskid
			 		   }
			 	 }).success(function(data){
	                 if(data.result)
	                 {
	                   Notify.alert(
	                     '<em class="fa fa-check"></em> '+data.message ,
	                     {status: 'success'}
	                   );
	                   $scope.tasklist.rows.splice(index, 1);
	                 }else
	                 {
	                   Notify.alert(
	                     '<em class="fa fa-times"></em> '+data.message ,
	                     {status: 'danger'}
	                   );
	                 }
	              }) 
	   
	         })
	    }  


}])

/* *****拓扑版本***** */

mControllers.controller('topologyVersionListCtrl',['$rootScope','$scope','$http','$stateParams','ngDialog','$state','Notify',function($rootScope,$scope,$http,$stateParams,ngDialog,$state,Notify){
	
	$scope.id=$stateParams.id;
	
	$http.get('/cloudui/ws/apps/jobs/listJobVersions'+'?v='+(new Date().getTime()),{
		params:{
			uuid:$stateParams.id
		}
	}).success(function(data){
	  $scope.topologyVersionList=data;	
	})
	// 删除拓扑版本 
	    $scope.delVersion=function(index,taskid,v)
	    {
	      ngDialog.openConfirm({
	            template:
	                 '<p class="modal-header">您确定要删除此版本吗?</p>' +
	                 '<div class="modal-body text-right">' +
	                   '<button type="button" class="btn btn-default mr20"  ng-click="closeThisDialog(0)">取消' +
	                   '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
	                 '</button></div>',
	           plain: true,
	           closeByDocument:false,
	           className: 'ngdialog-theme-default'
	         }).then(function(){
	        	 $http.delete('/cloudui/ws/apps/jobs/deleteJob'+'?v='+(new Date().getTime()),{
			 		   params:{
			 			  uuid:taskid,
			 			  version:v
			 		   }
			 	 }).success(function(data){
	                 if(data.result)
	                 {
	                   Notify.alert(
	                     '<em class="fa fa-check"></em> '+data.message ,
	                     {status: 'success'}
	                   );
	                   $scope.topologyVersionList.splice(index, 1);
	                 }else
	                 {
	                   Notify.alert(
	                     '<em class="fa fa-times"></em> '+data.message ,
	                     {status: 'danger'}
	                   );
	                 }
	              }) 
	   
	         })
	    }
    // 执行任务
    $scope.actionTask=function(uuid,vname){
    	if($rootScope.user.roleId=='1')
    	{
    		ngDialog.open({
  	          template: 'app/views/dialog_chosecluster.html'+'?action='+(new Date().getTime()),
  	          className: 'ngdialog-theme-default',
  	          scope: $scope,
  	          cache: false,
  	          closeByDocument:false,
  	          data:{uuid:uuid,vname:vname},
  	          controller:'chosecluster'
  	       });
    	}else{
    		$scope.actionTaskFn(uuid,vname,$rootScope.app.envsession.id);
    	}
    } 
    
    $scope.actionTaskFn=function(uuid,vname,clusterid){
    	$http.get('/cloudui/ws/apps/executeHostJob'+'?v='+(new Date().getTime()),{
    		params:{
    			jobUUID:uuid,
    			version:vname,
    			clusterId:clusterid
    		}
    	}).success(function(data){
    		if(data.result)
    		{
    			Notify.alert(
                  '<em class="fa fa-check"></em> '+data.message ,
                   {status: 'success'}
                );
    			if($rootScope.user.roleId=='1'){
    				ngDialog.close();
    			}
    			/*$state.go('app.topology_list',{},{reload:true});*/
    		}else{
    			Notify.alert(
                  '<em class="fa fa-times"></em> '+data.message ,
                   {status: 'danger'}
               );
    		}
    	})
    }
    
    
    // 查看结果
    $scope.resultView=function(uuid,vname){
    	if($rootScope.user.roleId=='1')
    	{
    		ngDialog.open({
  	          template: 'app/views/dialog_result_chosecluster.html'+'?action='+(new Date().getTime()),
  	          className: 'ngdialog-theme-default',
  	          scope: $scope,
  	          cache: false,
  	          closeByDocument:false,
  	          data:{uuid:uuid,vname:vname},
  	          controller:'chosecluster'
  	       });
    	}else{
    		$scope.resultViewFn(uuid,vname,$rootScope.app.envsession.id);
    	}
    } 
    
    $scope.resultViewFn=function(uuid,vname,clusterid,closeThisDialog){
    	
    	if(closeThisDialog){
    		closeThisDialog(0);
    	}
    	
    	ngDialog.open({
	          template: 'app/views/dialog_result.html'+'?action='+(new Date().getTime()),
	          className: 'ngdialog-theme-default ngdialog-lg',
	          scope: $scope,
	          closeByDocument:false,
	          cache: false,
	          data:{uuid:uuid,vname:vname,clusterid:clusterid},
	          controller:'resultViewCtrl'
	     });
    }
}])

/* *****选择集群***** */
mControllers.controller('chosecluster',['$rootScope','$scope','$http',function($rootScope,$scope,$http){
	
	 $http.get('/cloudui/ws/admins/findClusterListAll'+'?v=' + (new Date().getTime())).success(function(data){
        $scope.clusterlist=data;
        $scope.chosecluster=$scope.clusterlist[0].id;
     })
     
}])

/* *****查看结果***** */
mControllers.controller('resultViewCtrl',['$rootScope','$scope','$http','ngDialog','$interval',function($rootScope,$scope,$http,ngDialog,$interval){
	
	$scope.$on('$destroy', function() {
	     $interval.cancel($scope.resultTimer);        
	});
	
	
	$scope.getResultFn=function(){
		$http.get('/cloudui/ws/apps/getResults'+'?v='+(new Date().getTime()),{
			params:{
				jobUUID:$scope.ngDialogData.uuid,
				version:$scope.ngDialogData.vname,
				clusterId:$scope.ngDialogData.clusterid||''
			}
		}).success(function(data){
			 $scope.resultData=data; 
		})
	}
	
	$scope.getResultFn();
	
	$scope.resultTimer=$interval(function(){
		$scope.getResultFn();
	},3000)
	
}])

/* *****更新拓扑版本***** */

mControllers.controller('topologyUpdateCtrl',['$rootScope','$scope','$http','$filter','$modal','$state','$stateParams','Notify','$timeout','ngDialog','$stateParams',function($rootScope,$scope,$http,$filter,$modal,$state,$stateParams,Notify,$timeout,ngDialog,$stateParams){
  $scope.topologyVersionId=$stateParams.id; // 拓扑版本id
   
  $scope.formdata={}; // 表单数据
   
   // 获取资源名称
  $scope.getResourceNameFn=function(name,id,version){
     $scope.resourceName=name;
     $scope.getTags(id,version);
  }

  // 获取资源版本
  $scope.getTags=function(id,version){
    $http.get('/cloudui/ws/apps/file/versionList'+'?v='+(new Date().getTime()),{params:{
       resourceId:id,
       pageSize:0
    }}).success(function(data){
       $scope.resource_version=data.rows;
       if(version)
       {
          $scope.formdata.resourcetag=$filter('filter')($scope.resource_version,version)[0];
       }else{
          $scope.formdata.resourcetag=$scope.resource_version[0];
       } 
    }) 
  }
  
  // 添加新资源
  $scope.openAddResource=function(){
    $rootScope.resourceType='topo';
    $rootScope.offsideinclude="app/views/partials/addtopo.html"+"?action="+(new Date().getTime());
  }

  $scope.$watch('newResourcedata',function(newval,oldval){
     if(newval){
        $scope.getResourceNameFn(newval.resourceName,newval.resourceId,newval.tag);
     }
  })

  // 选择已有资源
  $scope.openResourceList = function () {
      ngDialog.open({
        template: 'app/views/dialog_resourcelist.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-lg',
        scope: $scope,
        closeByDocument:false,
        cache:false,
        data:{type:'topo'},
        controller:'resourceListCtrl'
      });
  };

  // 是否弹出选择资源框
  /*$scope.goResource=function(resourceName){
      if(!resourceName)
      {
        $scope.openResourceList();
      }  
  }*/

  // 获取配置名称
  $scope.getConfigNameFn=function(name,id,version){
     $scope.configName=name;
     $scope.getConfigTags(id,version);
  }

  // 获取配置版本
  $scope.getConfigTags=function(id,version){
    $http.get('/cloudui/ws/apps/configs/getVersions'+'?v='+(new Date().getTime()),{params:{
       configId:id
    }}).success(function(data){
       $scope.config_version=data;
       if(version)
       {
          $scope.formdata.configtag=$filter('filter')($scope.config_version,version)[0];
       }else{
          $scope.formdata.configtag=$scope.config_version[0];
       } 
    }) 
  }

  // 添加新配置
  $scope.openAddConfig=function(){
    $rootScope.configType='topo';
    $rootScope.offsideinclude="app/views/partials/addconfigbar.html"+"?action="+(new Date().getTime());
  }

  $scope.$watch('newConfigdata',function(newval,oldval){
     if(newval){
        $scope.getConfigNameFn(newval.name,newval.configId,newval.version);
     }
  })

  // 选择已有配置
  $scope.openConfigList = function () {
      ngDialog.open({
        template: 'app/views/dialog_configlist.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default ngdialog-lg',
        scope: $scope,
        closeByDocument:false,
        cache:false,
        data:{type:'topo'},
        controller:'configListCtrl'
      });
  };

  // 是否弹出选择配置框

  /*$scope.goConfig=function(configName){
      if(!configName)
      {
        $scope.openConfigList();
      }  
  }*/

 
   // 拓扑信息
    $http.get('/cloudui/ws/apps/jobs/getJob'+'?v='+(new Date().getTime()),{
      params:{
        uuid:$stateParams.id,
        version:$stateParams.v
      }
    }).success(function(data){
          $scope.topologyInfoData=data;
          $scope.formdata.cmd=data.taskCmd; 
          $scope.resourceName=data.resourceName;
          $scope.getTags(data.resourceId,data.resourceVersionName);
          $scope.configName=data.configName;
          $scope.getConfigTags(data.configId,data.configVersionName);
    })


    $scope.updateTopologyFn=function(){
         
       $rootScope.app.layout.isShadow=true;
 

       // 提交的数据
      $scope.data={
           "id":$scope.topologyInfoData.id,
           "uuid":$scope.topologyInfoData.uuid,
           "name":$scope.topologyInfoData.name,
           "type":'host',
           "description":$scope.topologyInfoData.description,
           "network":'host',
           "outerConnect":'',
           "innerConnect":'',
           "taskCmd":$scope.formdata.cmd||'',
           "shareCpu":true,
           "cpuQuota":'',
           "cpuNumber":'',
           "optionsMmx":128,
           "dockerVolumes":[],
           "resourceVersionId":$scope.formdata.resourcetag.id,
           "confVersionId":$scope.formdata.configtag.id
      }
           
      // 提交拓扑更新信息
      $http.post('/cloudui/ws/apps/jobs/updateJob',$scope.data).then(function(response) {   
        $rootScope.app.layout.isShadow=false;
          // 通过返回数据，没通过返回错误信息
          if(response.data.result)
          {
            
            Notify.alert(
                '<em class="fa fa-check"></em> '+response.data.message ,
                {status: 'success'}
            );
            $state.go('app.module.list',{},{reload:true});

          }else{
            Notify.alert(
                '<em class="fa fa-times"></em> '+response.data.message ,
                {status: 'danger'}
            );
            $state.go('app.module.list',{},{reload:true});
          }

      }, function(x) {
        $scope.authMsg = '服务器请求错误';
      });
    }
 
}])

/* ----------------------------拓扑资源--------------------------------------- */
 
mControllers.controller('resourceTopoListCtrl',['$scope','$http',function($scope,$http){
	 var picname=['tomcat','centos','mysql','redis','django','lamp','mongodb','nginx','node','ubuntu','zookeeper','memcache'];      
     $scope.pageSize=5;
     $scope.onPageChange = function ()
     {
         $scope.loadoff=true;
         $http.get('/cloudui/ws/apps/file/resourceList'+ '?v=' + (new Date().getTime()),{
         params:
             {
               pageNum:$scope.pageNum,
               pageSize:$scope.pageSize,
               type:'topo',
               keyword:$scope.searchval
             }
        }).success(function(data){
          $scope.loadoff=false;
          $scope.resultoff=data.rows.length>0?true:false;
          $scope.warninginfo='提示：无此资源';
          if($scope.resultoff){
              for(var i=0;i<data.rows.length;i++)
                {
                   var pic=''
                   for(var j=0;j<picname.length;j++)
                   {
                    if(data.rows[i].resourceName.indexOf(picname[j])!==-1)
                    {
                      var pic=picname[j]
                    }
                   }

                  if(!pic){
                    pic='zip' 
                  }
                  data.rows[i].pic=pic;
                  $scope.serverResourceList=data;
                } 
            }else{
              $scope.ftplist=data; 
            }
            $scope.pageCount=Math.ceil(data.total/$scope.pageSize);
            if($scope.pageCount==0){
             $scope.pageCount=1;
            }
        }).error(function(){
            $scope.resultoff=false;
            $scope.warninginfo='暂无结果';
        })
    }
    //搜素ftp
    $scope.searchResource=function(e)
    {
        var keycode = window.event?e.keyCode:e.which;
      if(keycode==13)
      {
       $scope.loadoff=false;
         $scope.onPageChange(); 
      }
        if($scope.searchval.length==0)
        {
         $scope.pageNum=1;
           $scope.onPageChange(); 
        }
    }
}])

/* ----------------------------拓扑配置--------------------------------------- */

/* *****配置列表***** */

mControllers.controller('configTopologyListCtrl',['$scope','$http','Notify','$state','ngDialog',function($scope,$http,Notify,$state,ngDialog){
   $scope.pageSize=10;
    $scope.onPageChange = function ()
    {
      $http.get('/cloudui/ws/apps/configs/list'+'?v=' + (new Date().getTime()),{
      params:
          {
            type:'topo',
            pageNum:$scope.pageNum,
            pageSize:$scope.pageSize,
            keyword:$scope.searchval||''
          }
     }).success(function(data){
        $scope.configlist = data;
        $scope.resultoff=data.rows.length>0?true:false;
        $scope.warninginfo='提示：暂无配置';
        $scope.pageCount=Math.ceil($scope.configlist.total/$scope.pageSize);
        if($scope.pageCount==0){
          $scope.pageCount=1;
        }
     }).error(function(){
         $scope.resultoff=false;
         $scope.warninginfo='暂无结果';
     })
    }  
    
   // 搜素配置
    $scope.searchConfig=function(e)
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
    
    $scope.opendelConfig=function(params){
        ngDialog.openConfirm({
           template:
                '<p class="modal-header">您确定要删除此配置吗?</p>' +
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
            $http.get('/cloudui/ws/apps/configs/delForApp'+'?v='+(new Date().getTime()),{
              params:{
                configId:params
              }
              }).success(function(data){
               if(data.result)
               {
                 Notify.alert(
                         '删除成功!' ,
                         {status: 'success'}
                      );
                 $state.go('app.config_topology',{},{reload:true});
               }else
               {
                 Notify.alert(
                         '删除失败,'+data.msg ,
                         {status: 'danger'}
                      ); 
               }
             }) 
          }
        )
    }
    
   
}])

/* ----------------------------服务配置--------------------------------------- */

mControllers.controller('configStorm',['$rootScope','$scope','$http','$stateParams','$filter','$state','Notify',function($rootScope,$scope,$http,$stateParams,$filter,$state,Notify){
	 
   // 配置版本列表
   $http.get('/cloudui/ws/apps/listTemplateSnapshoots'+'?v='+(new Date().getTime()),{
     params:{
       templateUUID:$stateParams.args.configId
     }
   }).success(function(data){
       $scope.serverVersionList=data;
       $scope.curversion=$scope.serverVersionList[0]; 
       
   })
   // 配置版本详情
   $scope.getVersionDetail=function(templateUUID,snapshootId){
      $http.get('/cloudui/ws/apps/template/listAllConfigs'+'?v='+(new Date().getTime()),{
        params:{
            templateUUID:templateUUID,
            snapshootId:snapshootId
        }
      }).success(function(data){
          $scope.versionDetail=data;
      })
   }
   // 配置版本切换
   $scope.$watch('curversion',function(newval,oldval){
       if(newval)
       {
    	 
          $scope.getVersionDetail($stateParams.args.configId,newval.id);
    	  
	      for(var i=0;i<$scope.serverVersionList.length;i++)
	   	   {
	   		   if($scope.serverVersionList[i].id==newval.id){
	   			   $scope.serverVersionList[i].inUse=true;
	   		   }else{
	   			   $scope.serverVersionList[i].inUse=false;
	   		   }
	   		   
	   	   }
	   	   
	   	  
       }
   })
   
  
   $scope.changeVersion=function(item){
	   
	   $scope.curversion=item;
	   
   }

   // 删除一行
    $scope.removeConfig = function(outindex,innerindex) {
        $scope.versionDetail[outindex].detail.splice(innerindex,1);
    };
    
    // 删除配置
    $scope.delConfig=function(id){
    	$http.delete('/cloudui/ws/apps/deleteTemplateSnapshoot',{
    		params:{
    			id:id
    		}
    	}).success(function(data){
    		if(data.result)
    		{
    			Notify.alert(
	                '<em class="fa fa-check"></em> '+data.message ,
	                {status: 'success'}
    	        );
    			$state.go('app.config_storm',{args:{
    		        clusterName:$stateParams.args.clusterName,
    		        clusterId:$stateParams.args.clusterId,
    		        configId:$stateParams.args.configId
    		    }},{reload:true})
    		}else{
    			Notify.alert(
	                '<em class="fa fa-times"></em> '+data.message ,
	                {status: 'danger'}
    	        );
    		}
    	})
    }
    
 
    
    // 添加一行
    $scope.addConfig = function(outindex) {
        $scope.inserted = {
          key: '',
          value: '',
          type:'',
          description:''
        };
        $scope.versionDetail[outindex].detail.push($scope.inserted);
    };

   // 配置版本更新
   $scope.updateConfig=function(){
      $http.post('/cloudui/ws/apps/template/createNewConfigs',$scope.versionDetail).then(function(response) {
         if(response.data.result)
         {
            Notify.alert(
                '<em class="fa fa-check"></em> '+response.data.message ,
                {status: 'success'}
            );
             
            $state.go('app.config_storm',{args:{
		        clusterName:$stateParams.args.clusterName,
		        clusterId:$stateParams.args.clusterId,
		        configId:$stateParams.args.configId
		    }},{reload:true})

        }else{
            Notify.alert(
                '<em class="fa fa-times"></em> '+response.data.message ,
                {status: 'danger'}
            );
            
        }
      })
   }
   
   // 向左滑动
   var leftnum=1;
   $scope.moveLeft=function(){ 
	  
	  var offsetLeft=angular.element('#listul')[0].offsetLeft;
	  
	 
	  var allWidth=($scope.serverVersionList.length-4)*220;
	  
	   if(Math.abs(offsetLeft)>=allWidth){
		   return false;
	   }
	   
	   angular.element('#listul').animate({'left':(offsetLeft-220)+'px','right':0})
	   
   }
   // 向右滑动
   
   $scope.moveRight=function(){ 
	   var offsetLeft=angular.element('#listul')[0].offsetLeft;
		  
	  var allWidth=($scope.serverVersionList.length-4)*220;
	  
	  if(offsetLeft>=0){
		 
		   return false;
	   } 
	   
	   angular.element('#listul').animate({'left':(offsetLeft+220)+'px','right':0})
	   
   }
}])

/* ----------------------------监控--------------------------------------- */

mControllers.controller('monitorCtrl',['$scope','$http',function($scope,$http){
	
}])

/* ---------by wpeng start------------------- */
/* 快速链接  */
mControllers.controller('monitorLinksController',['$rootScope','$scope','$http','Notify',function($rootScope,$scope,$http,Notify){

	$scope.scopedata={};
	
    if($rootScope.user.roleId=='1'){
    	$http.get('/cloudui/ws/admins/findClusterListOfApp'+'?v='+(new Date().getTime()),{
			 params:
             {
               appId:$rootScope.app.appsession.id,
               pageNum:1,
               pageSize:10000
             }
    	}
    	).
        success(function(data){
            $scope.envlist=data.rows;
            $scope.scopedata.cluster=$scope.envlist[0].id;  
        })
    }else if($rootScope.user.roleId!=='1'){
    	$scope.scopedata.cluster=$rootScope.app.envsession.id;
    }
    
    $scope.$watch('scopedata.cluster',function(newval,oldval){
    	if(newval){
    		$http.get('/cloudui/ws/apps/clusterServiceInfo'+'?v='+(new Date().getTime()),{
    			params:{
    				clusterId:$scope.scopedata.cluster
    			}
    		}).
    		success(function(data){
    			$scope.stormResult=!(data.stormUrl=='error');
    			if($scope.stormResult){
    				$scope.stormui=data.stormUrl;
    			}else{
    				Notify.alert(
	                      '无StormUi' ,
	                      {status: 'info'}
	                 );
    			}
    			
    			$scope.sparkResult=!(data.sparkUrl=='error');
    			if($scope.sparkResult){
    				$scope.sparkui=data.sparkUrl;
    			}else{
    				Notify.alert(
	                      '无SparkUi' ,
	                      {status: 'info'}
	                 );
    			}
    		})
    	}
    })
    
}])

/* maven组件管理  */
mControllers.controller('mavenCompController',['$scope','$http',function($scope,$http){
	//初始化页面
	$http.get('/cloudui/ws/custom/maven/listMavenComp'+'?v=' + (new Date().getTime()),{
	params:{}
	}).success(function(data){
		//alert(data);
		$scope.mavenCompList = data;
		$scope.mavenCompListoff=data.length>0?true:false;
		$scope.warninginfo='提示：暂无组件';
	}).error(function(){
		$scope.mavenCompListoff=false;
		$scope.warninginfo='暂无结果';
	})

	//搜素组件
	    $scope.searchMavenComp=function(e)
	    {
		var keycode = window.event?e.keyCode:e.which;
		if(keycode==13){
			//alert(keycode);
			
		    $http.get('/cloudui/ws/custom/maven/findMavenComp'+'?v=' + (new Date().getTime()),{
			params:
			    {
				  mavenName:$scope.searchMC
			    }
		       }).success(function(data){
		    	   $scope.mavenCompList = data;
					$scope.mavenCompListoff=data.length>0?true:false;
					$scope.warninginfo='提示：暂无组件';
		       }).error(function(){
					$scope.mavenCompListoff=false;
					$scope.warninginfo='暂无结果';
		       })
		}
		
	    }
}])

/* 向Kafka发数 */
mControllers.controller('KPController',['$scope','$http',function($scope,$http){
	
}])
/* 向Kafka发数 kafka/http */
mControllers.controller('kafkaProducerController',['$scope','$http','ngDialog','Notify','sendTypes',function($scope,$http,ngDialog,Notify,sendTypes){
	//初始化页面 //alert(sendTypes.stype);
	var sendType = sendTypes.stype;
	
	$http.get('/cloudui/ws/custom/sendkafka/getSDConf'+'?v=' + (new Date().getTime()),{
	params:{
		stype:sendType
	}
	}).success(function(data){
		//alert(data);
		$scope.confignames = data;
	}).error(function(){
		
	})
	
	$scope.selectedConfigClick=function(e){
		var info = $scope.selectedConfig;
		if(info != null && info != ""){
			if(sendType == "kafka"){
				$scope.sendConfigTarea1 = info.config;
			}else{
				$scope.sendConfigTarea2 = info.config;
			}
            $scope.sendTopic = info.topic;
            $scope.sendKey = info.key;
            $scope.sendMsgInfo = info.msginfo;
            $scope.sendLoopNum = info.loopnum;
            $scope.SendJGTime = info.jgtime;
		}else{
			if(sendType == "kafka"){
				$scope.sendConfigTarea1 = "";
			}else{
				$scope.sendConfigTarea2 = "";
			}
            $scope.sendTopic = "";
            $scope.sendKey = "";
            $scope.sendMsgInfo = "";
            $scope.sendLoopNum = "";
            $scope.SendJGTime = "";
		}
	}
	
	//添加配置
	$scope.addKafkaConfig=function(e){
		var config = "";
		if(sendType == "kafka"){
			config = $scope.sendConfigTarea1;
		}else{
			config = $scope.sendConfigTarea2;
		}
		ngDialog.open({
	        template: 'app/views/custom/dialog_producer_config.html'+'?action='+(new Date().getTime()),
	        className: 'ngdialog-theme-default',
	        scope: $scope,
	        closeByDocument:false,
	        cache:false,
	        data:{sendtype:sendType,sendconfig:config},
	        controller:'addKafkaConfig'
	      });
    }
	
	//发数
    $scope.sendData=function(e){
    	var configs = "";
		if(sendType == "kafka"){
			configs = $scope.sendConfigTarea1;
		}else{
			configs = $scope.sendConfigTarea2;
		}
		var sendloopnum = $scope.sendLoopNum;
		var sendjgtime = $scope.SendJGTime;
		if(sendloopnum == undefined || sendloopnum == ""){
			sendloopnum = 1;
		}
		if(sendjgtime == undefined || sendjgtime == ""){
			sendjgtime = 1;
		}
		
    	$http({
            method  : 'POST',
            url     : '/cloudui/ws/custom/sendkafka/sendData',
            data    : $.param({
              type:sendType,
              config:configs,
              topic:$scope.sendTopic,
              key:$scope.sendKey,
              msginfo:$scope.sendMsgInfo,
              loopnum:sendloopnum,
              jgtime:sendjgtime
            }),   
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
         }).then(function(response) {
        	
        	 if(response.data.result)
             {
                Notify.alert(
                      '<em class="fa fa-check"></em> '+response.data.message ,
                      {status: 'success'}
                );
             }else{
                Notify.alert(
                      '<em class="fa fa-times"></em> '+response.data.message ,
                      {status: 'danger'}
                );
             }
         },function(x) {
              alert('服务器请求错误');
         })
         
    }
    
}])

/* 添加Kafka配置 */
mControllers.controller('addKafkaConfig',['$rootScope','$scope','$http','ngDialog',function($rootScope,$scope,$http,ngDialog){
	sendtype = $scope.ngDialogData.sendtype;
	
	sfg = $scope.ngDialogData.sendconfig;
	sendconfig = "";
	if(sfg != undefined && sfg != ""){
		sendconfig = sfg.replace(/(^\s*)|(\s*$)/g, "");
	}
	
	if(sendconfig != ""){
		if(sendconfig.indexOf("broker") != -1){
			if(sendtype == "kafka"){
				$scope.ConfigTextaarea = sendconfig;
			}else{
				$scope.ConfigTextaarea = "servers.urls = "
			}
		}else{
			if(sendtype != "kafka"){
				$scope.ConfigTextaarea = sendconfig;
			}else{
				$scope.ConfigTextaarea = "metadata.broker.list = "
			}
		}		
	}else if(sendtype=="kafka"){
		$scope.ConfigTextaarea = "metadata.broker.list = ";	
	}else{
		$scope.ConfigTextaarea = "servers.urls = "
	}
	
	//确定
    $scope.addConfigFn=function(e){
    	if(sendtype=="kafka"){
    		$rootScope.sendConfigTarea1 = $scope.ConfigTextaarea;
    	}else{
    		$rootScope.sendConfigTarea2 = $scope.ConfigTextaarea;
    	}
    	
    	ngDialog.close();
    }
}])

/*sp_kafka 环境 */
mControllers.controller('spkafkaEnvCtrl',['$scope','$http','$state',function($scope,$http,$state){

	$http.get('/cloudui/ws/custom/spkafkaEnv/listEnv'+'?v='+(new Date().getTime())).
	success(function(data){
		 $scope.listEnv=data;
		 $scope.desc =1;
	})
}])

/*kafka消费情况 */
mControllers.controller('kConsumerMonitorCtrl',['$scope','$http','ngDialog','Notify',function($scope,$http,ngDialog,Notify){
	
	//选择Topic
	$scope.selectedTopicClick=function(e){
		topicInfo = $scope.selectedTopic;
		configobj = $scope.consumConf;
		if(topicInfo == ""){
			return;
		}
		$http.get('/cloudui/ws/custom/kfcomsum/getOffsetInfo'+'?v=' + (new Date().getTime()),{
			params:
			    {
					bklist:configobj.bklist,
					bkport:configobj.bkport,
					zklist:configobj.zklist,
					zkroot:configobj.zkroot,
					topic:topicInfo.TopicName,
					spoutid:topicInfo.SpoutId
			    }
		       }).success(function(data){
		    	   $scope.listOffset = data;
		       }).error(function(){
					$scope.warninginfo='暂无结果';
					return;
		       })
	}
	
	//编辑配置
	$scope.upConfFun=function(e){
		ngDialog.open({
	        template: 'app/views/custom/dialog_consumer_conf.html'+'?action='+(new Date().getTime()),
	        className: 'ngdialog-theme-default',
	        scope: $scope,
	        closeByDocument:false,
	        cache:false,
	        data:{consumconf:$scope.consumConf},
	        controller:'consumConfCtrl'
	      });
    }
	
	//刷新
	$scope.refreshFun=function(e){
		topicid = $scope.selectedTopic;
		configobj = $scope.consumConf;
		if(topicid == ""){
			return;
		}
		$http.get('/cloudui/ws/custom/kfcomsum/getOffsetInfo'+'?v=' + (new Date().getTime()),{
			params:
			    {
					bklist:configobj.bklist,
					bkport:configobj.bkport,
					zklist:configobj.zklist,
					zkroot:configobj.zkroot,
					topic:topicid.TopicName
			    }
		       }).success(function(data){
		    	   $scope.listOffset = data;
		       }).error(function(){
					$scope.warninginfo='暂无结果';
					return;
		       })
	}
	
}])

/* Kafka消费情况配置 */
mControllers.controller('consumConfCtrl',['$rootScope','$scope','$http','ngDialog','Notify',function($rootScope,$scope,$http,ngDialog,Notify){
	consum_conf = $scope.ngDialogData.consumconf;
	if(consum_conf != undefined){
		$scope.brokerlist = consum_conf.bklist;
    	$scope.brokerport = consum_conf.bkport;
    	$scope.zklist = consum_conf.zklist;
    	$scope.zkroot = consum_conf.zkroot;
	}else{
		$http.get('/cloudui/ws/custom/kfcomsum/getConf'+'?v=' + (new Date().getTime()),{
			params:
			    {}
		       }).success(function(data){
		    	   if(data != null && data != ""){
		    		   $scope.brokerlist = data.bklist;
		    	    	$scope.brokerport = data.bkport;
		    	    	$scope.zklist = data.zklist;
		    	    	$scope.zkroot = data.zkroot;
		    	   }
		       }).error(function(){
		       })
	}
	
	//确定
    $scope.upConfigFn=function(e){
    	brokerlist = $scope.brokerlist;
    	brokerport = $scope.brokerport;
    	zookeeperlist = $scope.zklist;
    	zookeeperroot = $scope.zkroot;
    	confObj = {bklist:brokerlist,bkport:brokerport,zklist:zookeeperlist,zkroot:zookeeperroot};
    	 
    	$rootScope.consumConf = confObj;
    	
    	$http.get('/cloudui/ws/custom/kfcomsum/listTopic'+'?v=' + (new Date().getTime()),{
			params:
			    {
					bklist:brokerlist,
					bkport:brokerport,
					zklist:zookeeperlist,
					zkroot:zookeeperroot
			    }
		       }).success(function(data){
		    	   if(data.result){
		    		   $rootScope.topicnames = data.data;
		    		   ngDialog.close();
		             }else{
		                Notify.alert(
		                      '<em class="fa fa-times"></em> '+data.message ,
		                      {status: 'danger'}
		                );
		             }
		       }).error(function(){
					$scope.warninginfo='暂无结果';
					return;
		       })
		       
    }
    
}])

/** ----- sp-kafka测试数据----- */
mControllers.controller('sp_create_confController',['$scope','$http','$state','ngDialog','Notify',function($scope,$http,$state,ngDialog,Notify){
	
	//初始化数据
	var dbConfList=[];
	$scope.spRunDatalist=dbConfList;
	$http.get('/cloudui/ws/custom/spsenddata/spdatalist'+'?v=' + (new Date().getTime()),{
	}).success(function(e){	
	
		if(e!=""){
			$scope.SenderCount=e.count;	
			$scope.SendertimeGap=e.timegap
			$scope.spRunDatalist=angular.fromJson(e.data).spdatak;
		}
	}).error(function(){
	})

	//删除测试数据
	$scope.deleteSpData = function(spRunData)
	{
		var id=$scope.spRunDatalist.indexOf(spRunData);		
		var aa=[];
		aa=$scope.spRunDatalist;
		aa.splice(id,1);
		$scope.spRunDatalist=aa;
		//alert("删除成功"+id);
		Notify.alert(
                '<em class="fa fa-check"></em> 删除成功'+id ,
                {status: 'success'}
          );
	};
	//插入测试数据  	
	$scope.inSertdataBtn = function(){
		//次数和间隔的默认值
		var count=$scope.SenderCount;

		if(count==0 || count==null){
			count=1;
		}	
		var gap=$scope.SendertimeGap;
		if(gap==0 || gap==null){
			gap=0;
		}
		//无法直接传，加一层  angular.toJson({dbarr:$scope.resetDatajson})
		var spdata={spdatak:$scope.spRunDatalist};
		if(spdata.spdatak!=""){
			$http.get('/cloudui/ws/custom/spsenddata/inSertdata',{
				params:
				{
					SenderCount:count,
					SendertimeGap:gap,
					spdata:spdata
				}
			}).success(function(data){
				
				//alert("data.result---"+data.result);
				
				if(data.result)
	             {
	                Notify.alert(
	                      '<em class="fa fa-check"></em> '+data.message ,
	                      {status: 'success'}
	                );
	             }else{
	                Notify.alert(
	                      '<em class="fa fa-times"></em> '+data.message ,
	                      {status: 'danger'}
	                );
	             }
			}).error(function(){
			})
		}else{
			Notify.alert(
                    '<em class="fa fa-times"></em> 请添加测试数据' ,
                    {status: 'danger'}
              );
		}
	};
	
	//添加数据
	$scope.addSpData = function () {
		ngDialog.open({
			template: 'app/views/custom/dialog_add_spData.html'+'?action='+(new Date().getTime()),
			className: 'ngdialog-theme-default',
			scope: $scope,
			closeByDocument:false,
			data:$scope.spRunDatalist,
			cache:false,
			controller:'sp_create_dateController'
		})}; 
}])

//sp-kafka测试数据  添加
mControllers.controller('sp_create_dateController',['$scope','$http','$state','ngDialog','Notify',function($scope,$http,$state,ngDialog,Notify){	
	  //数据列表
	  var obj=[];
	  obj=$scope.ngDialogData;
	  //初始数据库选项
	  $http.get('/cloudui/ws/custom/spsenddata/getSpDbConf'+'?v=' + (new Date().getTime()),{
	  }).success(function(data){
		  if(data!=null && data!=""){
			  $scope.confignames = data;
		  }
	  }).error(function(){
	  })
	  $scope.selectedDbConfigCli=function(e){
		  var info = $scope.selectedDb;
		  if(info != ""){
			  $scope.dataBaseDetail = info;
		  }
	  }
	  //表字段
	  var tabfield;
	  //确定添加测试数据  
	  $scope.addSpSenderData = function () {
		  if(tabfield == null || tabfield == ""){
			  return;
		  }
		  var dbAndValue={
				  dataBaseDetail:$scope.dataBaseDetail,
				  tableName:$scope.selectedTables.TablesName,
				  tableField:tabfield,
				  val:$scope.conf
		  }
		  ngDialog.close();
		  if(dbAndValue.dataBaseDetail!=null && dbAndValue.tableName!="" && dbAndValue.tableField!=""){
			  obj.push(dbAndValue);
		  }
		  $rootScope.spRunDatalist=obj;
	  };   
	  //取数据库表
	  $scope.openCreateDataBase = function () {
		  $http.get('/cloudui/ws/custom/spsenddata/openDatabase'+'?v=' + (new Date().getTime()),{
			  params:
			  {
				  databaseInfos:$scope.dataBaseDetail
			  }
		  }).success(function(data){
			  
			  if(data!="error" && data!="")
			  {
				  //alert("连接成功");
				 $scope.tablesnames=data;
				 Notify.alert(
			                '<em class="fa fa-check"></em> 连接成功，请选择数据库表',
			                {status: 'success'}
			          );
			  }else{
				  $scope.tablesnames="";
				  $scope.tableStrulist="";
				  tabfield="";
				  alert("配置信息错误，连接不成功");
			  }
		  }).error(function(){
		  })
	  };
	  //选择表，列出表结构
	  $scope.selectedTablesClick = function () {
		  var tablename = $scope.selectedTables;
		  if(tablename != null && tablename != ""){
			  $http.get('/cloudui/ws/custom/spsenddata/tablesDetalis'+'?v='+(new Date().getTime()),{
				  params:
				  {
					  database:$scope.dataBaseDetail,
					  selectedtables:$scope.selectedTables.TablesName
				  }
			  }).
			  success(function(data){
				  if(data!=""){
					  tabfield=data;
					  $scope.tableStrulist=data;
				  }
			  });
		  }else{
			  tabfield="";
			  $scope.tableStrulist=[];
		  }
		  
	  };   
}])

/*------环境重置--------*/
mControllers.controller('envDataResetController',['$scope','$http','$state','ngDialog','Notify',function($scope,$http,$state,ngDialog,Notify){
	
	//获取zookeeper信息
	$http.get('/cloudui/ws/custom/envDataReset/getZKInfo'+'?v=' + (new Date().getTime()),{
 	 }).success(function(data){
 		 if(data != null && data != ""){
 			$scope.zkconfs=data;
 		 }
 	 }).error(function(){
 	 })
 	 
 	 //获取redis信息
	$http.get('/cloudui/ws/custom/envDataReset/getRDInfo'+'?v=' + (new Date().getTime()),{
 	 }).success(function(data){
 		 if(data != null && data != ""){
 			$scope.rdconfs=data;
 		 }
 	 }).error(function(){
 	 })
	
	//获取数据库执行信息
	$http.get('/cloudui/ws/custom/envDataReset/getPrdata'+'?v=' + (new Date().getTime()),{
 	 }).success(function(data){
 		 if(data != null && data != ""){
 			$scope.resetDatajson=data;
 		 }
 	 }).error(function(){
 	 })
 	 
 	$scope.selEnvZKConfigClick=function(e){
		var obj = $scope.selEnvZKConf;
		if(obj != null){
			$scope.ZookeeperConfig = obj.zkconfig;
			$scope.ZookeeperPaths = obj.path;
			
		}else{
			$scope.ZookeeperConfig = "";
			$scope.ZookeeperPaths = "";
			
		}
	}
	
	$scope.selEnvRDConfigClick=function(e){
		var obj = $scope.selEnvRDConf;
		if(obj != null){
			$scope.RedisConfig = obj.rdconfig;
			$scope.redisKeys = obj.keys;
		}else{
			$scope.RedisConfig = "";
			$scope.redisKeys = "";
		}
	}
	
	  //添加属性	
    $scope.addZkRedisConfig = function (data) {
     ngDialog.open({
       template: 'app/views/custom/dialog_add_ZkRdConfig.html'+'?action='+(new Date().getTime()),
       className: 'ngdialog-theme-default',
       scope: $scope,
       closeByDocument:false,
       data:data,
       cache:false,
       controller:'addZkRdConfigController'
     })};  
     
     //添加数据库表
     $scope.addResetTables = function () {
    	 ngDialog.open({
    		 template: 'app/views/custom/dialog_add_ResetTables.html'+'?action='+(new Date().getTime()),
    		 className: 'ngdialog-theme-default',
    		 scope:$scope,
    		 closeByDocument:false,
    		 data:$scope.resetDatajson,
    		 cache:false,
    		 controller:'addResetTablesController'
    	 })};  
    
     //删除数据库表
     $scope.detRetTabss = function(data) {
    	 var id=$scope.resetDatajson.indexOf(data);		
    	 $scope.resetDatajson.splice(id,1);
     };    
     
     //执行清理
     $scope.cleanup = function() {

		var zookeeper=angular.toJson({
				zkconfig:$scope.ZookeeperConfig,
				path:$scope.ZookeeperPaths
			 });
		 var redis=angular.toJson({
			 rdconfig:$scope.RedisConfig,
			 keys:$scope.redisKeys
		 });
		 
		 //无法直接传递数组
		 var dbopinfo = angular.toJson({dbarr:$scope.resetDatajson});
 
		 $http({
	            method  : 'POST',
	            url     : '/cloudui/ws/custom/envDataReset/cleanup',
	            data    : $.param({
	            	zookeeper:zookeeper,
	 				redis:redis,
	 				dbevninfo:dbopinfo
	            }),   
	            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
	         }).then(function(response) {
 
	        	 if(response.data.result){
	                Notify.alert(
	                      '<em class="fa fa-check"></em> '+response.data.message ,
	                      {status: 'success'}
	                );
	             }else{
	                Notify.alert(
	                      '<em class="fa fa-times"></em> '+response.data.message ,
	                      {status: 'danger'}
	                );
	             }
	         },function(x) {
	              alert('服务器请求错误');
	         })
    	 
     }; 
}])



//添加一条数据库表
mControllers.controller('addResetTablesController',['$rootScope','$scope','$http','ngDialog',function($rootScope,$scope,$http,ngDialog){
	$http.get('/cloudui/ws/custom/envDataReset/getDBInfo'+'?v=' + (new Date().getTime()),{
		params:{
		}
		}).success(function(data){
			if(data!=""){
				$scope.dbconfs = data;
			}
			
		}).error(function(){
			
		})
		
	$scope.selEnvDBConfigClick=function(e){
		$scope.rdataBaseConfig = $scope.selEnvDBConf;
	}	
	
	var dbName; //数据库表
	
	//原数据库表数据
	var dajs=$scope.ngDialogData;
	if(dajs == undefined){
		dajs = new Array();
	}
	$scope.rdataBaseConCli=function(){
		$http.get('/cloudui/ws/custom/envDataReset/getTablesjson'+'?v=' + (new Date().getTime()),{
            params:
            {
        	  DatabaseInfo:$scope.rdataBaseConfig
            }	
		}).success(function(data){
			if(data!="" && data!="error"){
				$scope.tablenames=data.tables;
				dbName = data.dbname;
			}
		}).error(function(){
		});
	};
	
	//获取选择的表名称
	var sel_tablenames="";//
	$scope.chk= function (z,x) {//单选或者多选
	    if (x == true) {//选中
	    	if(sel_tablenames == ""){
	    		sel_tablenames = z;
	    	}else{
	    		sel_tablenames = sel_tablenames + ',' + z ;
	    	}
	    }else {
	    	sel_tablenames = sel_tablenames + ",";
	    	sel_tablenames = sel_tablenames.replace(z+',', '');//取消选中
	    	
	    	//检查最后一个字符是否是“,”
		    var laststr = sel_tablenames.charAt(sel_tablenames.length - 1);
		    
		    if(laststr == ","){
		    	sel_tablenames = sel_tablenames.substring(0,sel_tablenames.length - 2);
		    }
	    }
	};
	
	//添加表
	$scope.addResetTablesList=function(){
		if(sel_tablenames!="" && dbName!=null){
			var obj={
					Database:dbName,
					tableName:sel_tablenames,
					retBaseCof:$scope.rdataBaseConfig
				}
				dajs.push(obj);
				$rootScope.resetDatajson=dajs;
				ngDialog.close();
		}
	}
}])


//添加redis zookeeper属性
mControllers.controller('addZkRdConfigController',['$rootScope','$scope','$http','ngDialog',function($rootScope,$scope,$http,ngDialog){
	var configName=$scope.ngDialogData;
	if(configName=='zk'){
		$scope.ConfigZ="注:\n1、zookeeper配置(ip;ip...)";
	}else if(configName=='redis'){
		$scope.ConfigZ="注:\n1、redis单机配置(ip:port)\n2、redis主从配置(name,ip1:port1;ip2:port2;...)\n3、redis集群模式(ip1:port1;ip2:port2;...)";
	}
	$scope.addConfig=function(){
		if(configName=='zk'){
			$rootScope.ZookeeperConfig=$scope.Config;
			
		}else if(configName=='redis'){
			$rootScope.RedisConfig=$scope.Config;
		}
		ngDialog.close();
	}
}])
/* ---------by wpeng end------------------- */


/* ----------------------------主机或服务里的组件--------------------------------------- */

/* *****组件详情***** */

mControllers.controller('deployComponent',['$rootScope','$scope','$http','$stateParams','$interval','ngDialog','$state','Notify','$timeout',function($rootScope,$scope,$http,$stateParams,$interval,ngDialog,$state,Notify,$timeout){
   
	$scope.$on('$destroy', function() {
	     $interval.cancel($scope.appinfoTimer);        
	});

	
   // 组件基本信息  
   $http.get('/cloudui/ws/apps/getOperationAppdetail'+'?v=' + (new Date().getTime()),{params:{appId:$stateParams.appid}}).success(function(data){
       $scope.appinfo=data;
       $scope.extendoff=data.enable;
       $rootScope.status=data.status;
   })
   
   $scope.appinfoTimer=$interval(function(){
	   $http.get('/cloudui/ws/apps/getOperationAppdetail'+'?v=' + (new Date().getTime()),{params:{appId:$stateParams.appid}}).success(function(data){
	       $scope.appinfo=data;
	       $scope.extendoff=data.enable;
	       $rootScope.status=data.status;
	   })
   },5000)
   
   // 开启维护
 
   $scope.openextendoff=function(){
 
	   if($scope.extendoff!==undefined)
	   {
		   $http.get('/cloudui/ws/apps/updateRCScalable'+'?v='+(new Date().getTime()),{
			   params:{			   
				   appId:$stateParams.appid,
				   enable:$scope.extendoff
			   }
		   }).
		   success(function(data){
			   if(data.result)
			   {
				   Notify.alert(
	                  data.message ,
	                  {status: 'success'}
	           	  );
			   }else{
				   Notify.alert(
					  data.message ,
	                  {status: 'danger'}
	           	   );
			   }
		   })
	   }
   }
   

   // 维护实例弹出框

   $scope.openextend = function () {
      ngDialog.open({
        template: 'app/views/dialog_extend.html'+'?action='+(new Date().getTime()),
        className: 'ngdialog-theme-default',
        scope: $scope,
        closeByDocument:false,
        cache: false,
        controller:'extendController'
      });
   };

   // 启动组件  

   $scope.start=function()
   {
	  $rootScope.app.layout.isShadow=true;
      $http.get('/cloudui/ws/apps/start/'+$stateParams.appid+'?v=' + (new Date().getTime())).success(function(data){
    	  $rootScope.app.layout.isShadow=false;
    	  if(data.result)
          {
            Notify.alert(
              '<em class="fa fa-check"></em> '+data.message ,
              {status: 'success'}
            );
            
            $timeout(function(){
            	$http.get('/cloudui/ws/apps/getOperationAppdetail'+'?v=' + (new Date().getTime()),{params:{appId:$stateParams.appid}}).success(function(data){
                	$scope.appinfo=data;
      	    	    $rootScope.status=data.status;
      	    	    $scope.extendoff=data.enable;
                 }) 
            })
            
           
           
          }else
          {
        	 Notify.alert(
                '<em class="fa fa-times"></em> '+data.message ,
                {status: 'danger'}
             );
        	  
          }
      })
   }

   // 停止组件 

   $scope.stop=function()
   {
	  $rootScope.app.layout.isShadow=true;
      $http.get('/cloudui/ws/apps/stop/'+$stateParams.appid+'?v=' + (new Date().getTime())).success(function(data){
    	  $rootScope.app.layout.isShadow=false;
    	  if(data.result)
          {
            Notify.alert(
               '<em class="fa fa-check"></em> '+data.message ,
               {status: 'success'}
            );
            
            $timeout(function(){
            	$http.get('/cloudui/ws/apps/getOperationAppdetail'+'?v=' + (new Date().getTime()),{params:{appId:$stateParams.appid}}).success(function(data){
                	$scope.appinfo=data;
      	    	    $rootScope.status=data.status;
      	    	    $scope.extendoff=data.enable;
                 })
            })
          
          
          }else
          {
        	Notify.alert(
               '<em class="fa fa-times"></em> '+data.message ,
               {status: 'danger'}
            );
        	 
          }
      })
   }

   // 卸载组件 

   $scope.destroy=function()
   {
	  $rootScope.app.layout.isShadow=true;
      $http.get('/cloudui/ws/apps/destroy/'+$stateParams.appid+'?v=' + (new Date().getTime())).success(function(data){
    	  $rootScope.app.layout.isShadow=false;
    	  if(data.result)
          {
        	  Notify.alert(
                '<em class="fa fa-check"></em> '+data.message ,
                {status: 'success'}
              );
        	  
        	  $timeout(function(){
              	$http.get('/cloudui/ws/apps/getOperationAppdetail'+'?v=' + (new Date().getTime()),{params:{appId:$stateParams.appid}}).success(function(data){
                  	$scope.appinfo=data;
        	    	    $rootScope.status=data.status;
                   })
              })
          }else
          {
        	  Notify.alert(
                 '<em class="fa fa-times"></em> '+data.message ,
                 {status: 'danger'}
              );
        	  
          }
      })
   }
   

}])

/* *****维护实例数***** */

mControllers.controller('extendController',['$rootScope','$scope','$http','$state','$stateParams','Notify','ngDialog','$filter',function($rootScope,$scope,$http,$state,$stateParams,Notify,ngDialog,$filter){
    
  $scope.account = {};
 
  $scope.authMsg = '';

  $http.get('/cloudui/ws/apps/listOperationAppVersions'+ '?v=' + (new Date().getTime()),{
      params:
          {
            pageNum:1,
            pageSize:100,
            appId:$stateParams.appid
          }
  }).success(function(data){
        $scope.curv=$filter('filter')(data.rows,true,true)[0];
        $scope.othervlist=$filter('filter')(data.rows,false,true);
        $scope.account.curscaleCount=$scope.curv.instanceNumberRc;
       
        
        angular.forEach($scope.othervlist,function(val,key){
        	if(val.instancesNumber)
        	{
        		$scope.otherv=val;
        	}
        })
        
        $scope.account.otherscaleCount=$scope.otherv.instanceNumberRc;
        
  })
  
  $scope.extendFn = function(obj) {
	     
	    $scope.authMsg = '';
	    
	    $scope.scaleCount={};

	    $scope.scaleCount[$scope.curv.versionId]=$scope.account.curscaleCount;
 
	    if($scope.otherv)
	    {
	    	 $scope.scaleCount[$scope.otherv.versionId]=$scope.account.otherscaleCount;
	    }
	   
	    
	    if($scope.entendForm.$valid) {
	       $http.post('/cloudui/ws/apps/maintainAppInstances',{
	          appId:$stateParams.appid,
	          scaleCount:$scope.scaleCount
	       })
	       .then(function(response) {
	          if(response.data.result)
	          {
	        	  Notify.alert(
	                '<em class="fa fa-check"></em> '+response.data.message ,
	                {status: 'success'}
	              );
	        	  ngDialog.close();
	          }else
	          {
	        	  Notify.alert(
	                 '<em class="fa fa-times"></em> '+response.data.message ,
	                  {status: 'danger'}
	              );
	        	  ngDialog.close();
	          }
	       })

	    }
	    else { 
	      $scope.entendForm.curscaleCount.$dirty = true;
	      $scope.entendForm.otherscaleCount.$dirty = true;
	    }
	  };
	  

}])

/* *****组件监控***** */

mControllers.controller('deployComponentMonitorCtrl',['$rootScope','$scope','$http','$stateParams','$interval','chartGuage','chartArea','Notify','$filter',function($rootScope,$scope,$http,$stateParams,$interval,chartGuage,chartArea,Notify,$filter){
	
	$scope.$on('$destroy', function() {
        $interval.cancel($scope.cpumemtime);   
    });
	
	$scope.getCpuMem=function(){
	      $http.get('/cloudui/ws/monitor/app/'+$stateParams.appid+'?v='+(new Date().getTime())).
	      success(function(data){
	         $rootScope.cpu=data.appCpu;
	         $rootScope.mem=data.appMem;
	         $scope.appMonitor=data;
	      })   
    }
	
	$scope.getCpuMem();

    $scope.cpumemtime=$interval(function(){
      $scope.getCpuMem();
      $scope.monitor();
    },5000)
	   
	 chartGuage.chartGaugeFn('#app_cpu',{
	    text:'CPU使用率',
	    series:[{
	          name: 'cpu',
	          data: [0],
	          tooltip: {
	              valueSuffix: '%'
	          }
	      }]
	  },'cpu');
	 
	  chartGuage.chartGaugeFn('#app_mem',{
	    text:'内存使用率',
	    series:[{
	          name: 'mem',
	          data: [0],
	          tooltip: {
	              valueSuffix: '%'
	          }
	      }]
	  },'mem');

	
	$scope.monitor=function()
	{
 
       // 监控实例列表 
       $http.get('/cloudui/ws/apps/getOperationAppInstances'+ '?v=' + (new Date().getTime()),{
    	   params:{appId:$stateParams.appid}
       }).success(function(data){
           $scope.appMonitorInstance=data;
       })    
   }
	    
    $scope.monitor();
    
}])

/* ----------------------------服务上的组件列表--------------------------------------- */

mControllers.controller('componetByServerCtrl',['$rootScope','$scope','$http','$stateParams','ngDialog','$state','Notify',function($rootScope,$scope,$http,$stateParams,ngDialog,$state,Notify){

	$http.get('/cloudui/ws/apps/template/getTemplateDetail'+'?v='+(new Date().getTime()),{
		params:{
			templateUUID:$stateParams.serverid
		}
	}).
	success(function(data){
		$scope.tempdetail=data;
	})
	
	// 部署模板上的组件
	
	$http.get('/cloudui/ws/apps/template/listTemplateApps'+'?v='+(new Date().getTime()),{
		params:{
			templateUUID:$stateParams.serverid
		}
	}).
	success(function(data){
		$scope.tempapp=data;
	})
	
	// 删除组件
	
	$scope.delComponet=function(index,id)
    {
    	ngDialog.openConfirm({
            template:
                 '<p class="modal-header">您确定要删除此组件吗?</p>' +
                 '<div class="modal-body text-right">' +
                   '<button type="button" class="btn btn-default mr20"  ng-click="closeThisDialog(0)">取消' +
                   '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
                 '</button></div>',
           plain: true,
           closeByDocument:false,
           className: 'ngdialog-theme-default'
         }).then(function(){
        	 $http({
                 method:"DELETE",
                 url:'/cloudui/ws/apps/deleteOperationApp/'+id,
              }).then(function(response){
                 if(response.data.result)
                 {
                	 $scope.tempapp.splice(index, 1);
                	 Notify.alert(
                       '<em class="fa fa-check"></em> ！'+response.data.message ,
                       {status: 'success'}
                     );
                 }else
                 {
                   Notify.alert(
                     '<em class="fa fa-times"></em> '+response.data.message ,
                     {status: 'danger'}
                   );
                 }
              }) 
         })
    }

}])


/* *****组件实例***** */

mControllers.controller('appinstanceController',['$scope','$stateParams','$http','$state','Notify','ngDialog','$interval',function($scope,$stateParams,$http,$state,Notify,ngDialog,$interval){
	
	$scope.$on('$destroy', function() {
		 $interval.cancel($scope.instimer);  
	});
	
    $scope.pageSize=10;
    $scope.onPageChange = function ()
    {
      $http.get('/cloudui/ws/apps/list/instances/'+$stateParams.appid+'?v=' + (new Date().getTime()),{
      params:
          {
            pageNum:$scope.pageNum,
            pageSize:10
          }
     }).success(function(data){
        $scope.appInstance = data;
        $scope.pageCount=Math.ceil($scope.appInstance.total/$scope.pageSize);
        if($scope.pageCount==0){
        	$scope.pageCount=1;
        }
     })
    }
    
    $scope.instimer=$interval(function(){
    	$scope.onPageChange();
    },3000)
    
    // 删除实例
    $scope.delInstance=function(params){
    	ngDialog.openConfirm({
            template:
                 '<p class="modal-header">您确定要删除此实例吗?</p>' +
                 '<div class="modal-body text-right">' +
                   '<button type="button" class="btn btn-default mr20" ng-click="closeThisDialog(0)">取消' +
                   '<button type="button" class="btn btn-success" ng-click="confirm(1)">确定' +
                 '</button></div>',
           plain: true,
           closeByDocument:false,
           className: 'ngdialog-theme-default'
        }).then(function(){
       	 $http({
             method  : 'POST',
             url     : '/cloudui/ws/apps/doOperationInstance',
             data    : $.param({
            	 appId:$stateParams.appid,
            	 instanceId:params,
            	 op:"delete"
             }),   
             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
          }).then(function(response) {
        	  if (response.data.result ) 
        	  {
        		  Notify.alert(
                     '<em class="fa fa-check"></em>'+response.data.message ,
                     {status: 'success'}
                  );
        		  $state.go('app.appdetail.instance',{appid:$stateParams.appid},{reload:true});
        	  }else
        	  {
        		  Notify.alert(
        	         '<em class="fa fa-times"></em>'+response.data.message ,
        	         {status: 'danger'}
        	      );  
        	  }
          }) 
        })
   }
    
 

}])

/* *****组件日志***** */

mControllers.controller('applogController',['$scope','$http','$stateParams','Notify','$timeout',function($scope,$http,$stateParams,Notify,$timeout){
    
	// 所有实例列表
    $http.get('/cloudui/ws/apps/getOperationAppInstances'+ '?v=' + (new Date().getTime()),{
       params:{appId:$stateParams.appid}
    }).success(function(data){
   	$scope.instances=data;
   	$scope.instanceId=data[0].instanceId;
   })
	// 日志查询   
   $scope.queryoff=false;
	$scope.onPageChange = function (param)
	{
		
		
		$http.get('/cloudui/ws/apps/queryInstanceLog'+'?v='+(new Date().getTime()),{
          params:
              {
        	    appId:$stateParams.appid,
  			    instanceId:$scope.instanceId,
  			    keyWord:$scope.keyWord||'',
  			    fromDate:$scope.startdate,   
  			    toDate:$scope.enddate,
                pageNum:param,
                pageSize:$scope.pageSize
              }
        }).success(function(data){
        	if(data.result)
		    {
				var msg=data.msg;
				msg=msg.replace(/\r\n/ig,"<br/>")
				$('.logcont').html(msg);
				$scope.pageCount=Math.ceil(data.total/$scope.pageSize);
				if($scope.pageCount==0){
					$scope.pageCount=1;
				}
				 
		    }else
			{
				Notify.alert(
	              '<em class="fa fa-check"></em> '+data.msg ,
	              {status: 'success'}
	            );
			}
            
            
        })
	}
   $scope.querylog=function(){
		var daterange=$('.daterange').val();
		 
		$scope.startdate=new Date(daterange.split('-')[0]).valueOf();
		$scope.enddate=new Date(daterange.split('-')[1]).valueOf();
		
		$scope.pageSize=1000;
		
	 
		 
		$scope.queryoff=false;
		
		$timeout(function(){
			$scope.queryoff=true;
		},1)
		 
	 
		 
 
	}
    
    // 日志导出
    $scope.exportlog=function(){
		var daterange=$('.daterange').val(); 
		var startdate=new Date(daterange.split('-')[0]).valueOf();
		var enddate=new Date(daterange.split('-')[1]).valueOf();
        var keyWord=$scope.keyWord||'';
		window.location.href = '/cloudui/ws/apps/exportInstanceLog?appId='+$stateParams.appid+'&instanceId='+$scope.instanceId+'&keyWord='+keyWord+'&fromDate='+startdate+'&toDate='+enddate;
    }
}])

/* *****组件伸缩策略***** */

mControllers.controller('scaleController',['$scope','$http','Notify','$stateParams','$timeout','$state',function($scope,$http,Notify,$stateParams,$timeout,$state){
	
	$scope.AUTOMATIC='0'; // 默认模式
	$scope.defaultvalue={};
	// 指标列表
	
    $scope.scalerules=[];
    $scope.scaleplans=[];
    
    $scope.scaleNorms = [
       {value: 'CPU_SCALE_THRESHOLD', text: 'cpu使用率'},
  	   {value: 'INSTANCE_NUMBER', text: '实例最大最小值'}   
  	];
   
  	 
	// 查看伸缩策略
	$http.get('/cloudui/ws/apps/getAutoExtendStrategy'+'?v='+(new Date().getTime()),{
		params:{
			appId:$stateParams.appid
		}
	}).success(function(data){
		 
		$scope.scaleoff=data.enable;
		$scope.defaultvalue.value=data.strategies.SCHEDULE.default;
		 
		var i=0;
		angular.forEach(data.strategies.SCHEDULE,function(val,key){
			
			if(key!=='default')
			{
			
				$scope.scaleplans.push({
					value:val
				})
			
				var t1="#timepicker"+i+"1";
				var t2="#timepicker"+i+"2";
				
				$timeout(function(){
					$(t1).val(key.split('-')[0]);
					$(t2).val(key.split('-')[1]);
				})
				i++;
				 
			}else
			{
				return false;
			}
			
		})
		
		
		
		if(data.strategies.AUTOMATIC)
		{
			$scope.AUTOMATIC='1';
		}else
		{
			$scope.AUTOMATIC='0';
		}
		
		 
		if(data.strategies.CPU)
		{
			$scope.scalerules.push({
				scaleNorm:'CPU',
				startval:data.strategies.CPU.split('-')[0],
				endval:data.strategies.CPU.split('-')[1]
			})
		}
		
		if(data.strategies.INSTANCE_NUMBER)
		{
			$scope.scalerules.push({
				scaleNorm:'INSTANCE_NUMBER',
				startval:data.strategies.INSTANCE_NUMBER.split('-')[0],
				endval:data.strategies.INSTANCE_NUMBER.split('-')[1]
			})
		}
		
		if(data.strategies.CPU_SCALE_THRESHOLD)
		{
			$scope.scalerules.push({
				scaleNorm:'CPU_SCALE_THRESHOLD',
				startval:data.strategies.CPU_SCALE_THRESHOLD.split('-')[0],
				endval:data.strategies.CPU_SCALE_THRESHOLD.split('-')[1]
			})
		}
		
		 
	})
	

    
	
    
    // 添加指标
    $scope.addScaleRule=function(list){
		 if(list=='scalerules'){
			 var obj={
				scaleNorm:'CPU_SCALE_THRESHOLD'	 
			 };
		 }
    	
         $scope[list].push(obj);  
    }
    
    
    // 删除指标
    $scope.delScaleRule=function(list,idx){
      $scope[list].splice(idx,1);
    }
    
    // 开启关闭自动伸缩
    
    $scope.AutoExtend=function(param){
    	$http.get('/cloudui/ws/apps/updateAutoExtendStatus'+'?v='+(new Date().getTime()),{
    		params:{
    			enable:param,
    			appId:$stateParams.appid
    		}
    	}).success(function(data){
    	   if(data.result)
    	   {
    		   Notify.alert(
	               '<em class="fa fa-check"></em> '+data.message ,
	               {status: 'success'}
	             );
    		   
    	   }else
    	   {
    		   Notify.alert(
	               '<em class="fa fa-times"></em> '+data.message ,
	               {status: 'danger'}
	             );
    	   }
    	})
    }
 
     
    // 验证表单
    $scope.submitted = false;
    $scope.validateInput = function(name, type) {
        var input = $scope.formScale[name];
        return (input.$dirty || $scope.submitted) && input.$error[type];
    };
    
    // 提交自动伸缩策略
    $scope.submitScaleForm = function() {
      $scope.submitted = true;
       
      if ($scope.formScale.$valid) {
         $scope.strategies={};
    	 $scope.scheduledata={};
    	 $scope.scheduledata['default']=$scope.defaultvalue.value;
    	 angular.forEach($scope.scaleplans,function(val,key){
    		 var timerange=$('#timepicker'+key+'1').val()+'-'+$('#timepicker'+key+'2').val();		 
    		 $scope.scheduledata[timerange]=val.value; 
    	 })
    	  
    	  
    	 if($scope.AUTOMATIC=='1')
    	 {
    		 $scope.strategies.AUTOMATIC=true;
    	 }else
    	 {
    		 $scope.strategies.AUTOMATIC=false;
    	 }
    	 
    	 $scope.strategies.SCHEDULE=$scope.scheduledata;
    	 angular.forEach($scope.scalerules,function(val,key){
    		 $scope.strategies[val.scaleNorm]=val.startval+'-'+val.endval;
    	 })
    	 
    	 $http.post('/cloudui/ws/apps/saveAutoExtendStrategy',{
    		  appId:$stateParams.appid,
    		  strategies:$scope.strategies
    	  }).success(function(data){
    		   if(data.result)
    		   {
    			   Notify.alert(
		               '<em class="fa fa-check"></em> '+data.message ,
		               {status: 'success'}
		             );
    			   $state.go('app.deployComponent.scale',{appid:$stateParams.appid},{reload:true})
    		   }else
    		   {
    			   Notify.alert(
		               '<em class="fa fa-times"></em> '+data.message ,
		               {status: 'danger'}
		             );  
    		   }
    	  })
    	 
      }
    }
    

	
}])

/* ----------------------------应用组件监控--------------------------------------- */

mControllers.controller('topoMonitor',['$rootScope','$scope','$http','Notify','$state',function($rootScope,$scope,$http,Notify,$state){
	$scope.data={}; 
	 
	if($rootScope.user.roleId=='1'){
		 // 环境列表
		 $http.get('/cloudui/ws/admins/findClusterList'+'?v=' + (new Date().getTime()))
		 .success(function(data){
        	  $scope.envlist=data;
        	  $scope.data.curenv=$scope.envlist[0].id;
          })
	 } 
	
	 $scope.$watch('data.curenv',function(newval,oldval){
		 if(newval){
			 $scope.getTopoMonitorFn(newval);
		 }
	 })

	 $scope.$watch('app.envsession.id',function(newval,oldval){
		 
		 if(newval){
			 $scope.getTopoMonitorFn(newval);
		 }
	 })
	 
	 // 获取拓扑监控列表
	 $scope.getTopoMonitorFn=function(id){
		 $http.get('/cloudui/ws/apps/listTopos'+'?v='+(new Date().getTime()),{
			 params:{
				 clusterId:id
			 }
		 }).success(function(data){
			 $scope.topoMonitorList=data;
		 })
	 }
	 
	 // 拓扑卸载
	 $scope.killTopoFn=function(name,host,index){
		 $http.get('/cloudui/ws/apps/killTopo'+'?v='+(new Date().getTime()),{
			 params:{
				 topoName:name,
				 host:host
			 }
		 }).success(function(data){
			 if(data.result){
				 Notify.alert( 
                   '<em class="fa fa-check"></em> '+data.message, 
                   {status: 'success'}
                 );
				 $scope.topoMonitorList.splice(index, 1);
			 }else{
				 Notify.alert( 
                    '<em class="fa fa-times"></em> '+data.message, 
                    {status: 'danger'}
                 );
			 }
		 })
	 }
}])


/* ****设置个人信息 ***** */

mControllers.controller('settingsCtrl',['$scope','$http','ngDialog',function($scope,$http,ngDialog){
	   // 修改用户密码弹窗
	  $scope.openChangePassword=function(user){
		  console.log(user)
	      ngDialog.open({
	        template: 'app/views/dialog_settingUserPassword.html'+'?action='+(new Date().getTime()),
	        className: 'ngdialog-theme-default',
	        scope: $scope,
	        closeByDocument:false,
	        data:{userInfo:user},
	        cache:false,
	        controller:'settingUserPasswordCtrl'
	      });
	  }
}])

/* ****修改个人密码 **** */
mControllers.controller('settingUserPasswordCtrl',['$scope','$http','ngDialog','Notify',function($scope,$http,ngDialog,Notify){
	 
	$scope.userInfo=$scope.ngDialogData.userInfo;
	 
	$scope.changepasswordUserFn=function(){
		if($scope.changepasswordForm.$valid) {
			var RSA=$http.get('/cloudui/ws/RSA'+'?v='+(new Date().getTime())).success(function(data){
          	   $scope.modulus=data.modulus;
          	   $scope.exponent=data.exponent;
             })
             
             RSA.then(function(res){
            	 $scope.modulus=res.data.modulus;
            	 $scope.exponent=res.data.exponent;
            	 var key = RSAUtils.getKeyPair($scope.exponent, '', $scope.modulus);
            	 pwd = RSAUtils.encryptedString(key, $scope.password);
            	 // 修改
            	 $http({
                     method  : 'POST',
                     url     : '/cloudui/ws/admins/updatePassword',
                     data    : $.param({
                    	 id:$scope.userInfo.id,
                    	 password:pwd
                     }),   
                     headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
                  }).then(function(response) {  
                       if ( !response.data.result ) {
                         
                         Notify.alert(
                                 '<em class="fa fa-times"></em> '+response.data.message ,
                                 {status: 'danger'}
                         );
                         
                       }else{
                    	   
                    	   Notify.alert(
                                   '<em class="fa fa-check"></em> '+response.data.message ,
                                   {status: 'success'}
                           );
                           ngDialog.close();
                           window.location='app/pages/login.html';
                       }  
                  },function(x) {
                       $scope.authMsg = '服务器请求错误';
                  })
             })
		}else{
		      $scope.changepasswordForm.password.$dirty = true;
		      $scope.changepasswordForm.password_confirm.$dirty = true;
		}
	}
}])


/* ----------------------------123ss--------------------------------------- */

var ModalInstanceCtrl = function ($scope, $modalInstance,items) {

   
    $scope.ok = function () {
      $modalInstance.close('closed');
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };
ModalInstanceCtrl.$inject = ["$scope", "$modalInstance"];


(function($, window, document){

    var containers = {},
        messages   = {},

        notify     =  function(options){

            if ($.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? {status:arguments[1]} : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll  = function(group, instantly){
            if(group) {
                for(var id in messages) { if(group===messages[id].group) messages[id].close(instantly); }
            } else {
                for(var id in messages) { messages[id].close(instantly); }
            }
        };

    var Message = function(options){

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid    = "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
                '<a class="close">&times;</a>',
                '<div>'+this.options.message+'</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('alert alert-'+this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if(!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on("click", ".uk-notify-message", function(){
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function() {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({"opacity":0, "margin-top": -1*this.element.outerHeight(), "margin-bottom":0}).animate({"opacity":1, "margin-top": 0, "margin-bottom":marginbottom}, function(){

                if ($this.options.timeout) {

                    var closefn = function(){ $this.close(); };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                    );
                }

            });

            return this;
        },

        close: function(instantly) {

            var $this    = this,
                finalize = function(){
                    $this.element.remove();

                    if(!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }

                    delete messages[$this.uuid];
                };

            if(this.timeout) clearTimeout(this.timeout);

            if(instantly) {
                finalize();
            } else {
                this.element.animate({"opacity":0, "margin-top": -1* this.element.outerHeight(), "margin-bottom":0}, function(){
                    finalize();
                });
            }
        },

        content: function(html){

            var container = this.element.find(">div");

            if(!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function(status) {

            if(!status) {
                return this.currentstatus;
            }

            this.element.removeClass('alert alert-'+this.currentstatus).addClass('alert alert-'+status);

            this.currentstatus = status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "normal",
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };


    $["notify"]          = notify;
    $["notify"].message  = Message;
    $["notify"].closeAll = closeAll;

    return notify;

}(jQuery, window, document));













