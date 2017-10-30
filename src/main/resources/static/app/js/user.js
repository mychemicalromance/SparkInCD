/* 控制器 */

var userControllers = angular.module('userControllers', []);

/* 密码一致验证 */
 
userControllers.directive('equalpassword', function($http) {
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
        	elm.bind('keydown', function() {
        		scope.$watch(function(){
            		if(scope.account.password!==scope.account.account_password_confirm)
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

/* 登录 */

userControllers.controller('LoginFormController', ['$scope', '$http', function($scope, $http) {
 
  // 用户角色
  $scope.roleList=[
    {
      'text':'平台管理员',
      'roleId':'1'
    },
    {
      'text':'应用管理员',
      'roleId':'2'
    }/*,
    {
      'text':'开发测试人员',
      'roleId':'3'
    }*/
  ]

  $scope.roletype=$scope.roleList[0].roleId;

  $scope.$watch('roletype',function(newval,oldval){
	$scope.authMsg='';
    if(newval==1)
    {
        $scope.isShow=false;
    }else{
        $scope.isShow=true;
        if($scope.account.username&&$scope.account.username.length>0){
        	 
        	$scope.getProjectList(newval,$scope.account.username);
        }
    }
  })
  
  $scope.$watch('account.username',function(newval,oldval){
	  $scope.authMsg='';
	  if(newval&&newval.length>0&&($scope.roletype!=='1')){
		  
		  $scope.getProjectList($scope.roletype,newval);
	  }
  })
 

  // 项目列表
 
  $scope.getProjectList=function(usertype,username){
	  $http.get('/cloudui/ws/user/getAppListByUser'+'?v='+(new Date().getTime()),{
         params:{
            userName:username
         }
       }).success(function(data){
	        if(data.result)
	        {
	           //$scope.isShow=false;
	        	$scope.projectList=[];
	        }else{
	             //$scope.isShow=true;
	            $scope.projectList=data;
	            $scope.account.project=$scope.projectList[0].app_name;
	        }   
	   })
  }

  // 绑定表单的所有数据
  $scope.account = {};
  // 错误信息
  $scope.authMsg = '';

  $scope.login = function() {

    $scope.authMsg = '';

    if($scope.loginForm.$valid) {
    	
       var RSA=$http.get('/cloudui/ws/RSA'+'?v='+(new Date().getTime())).success(function(data){
    	   $scope.modulus=data.modulus;
    	   $scope.exponent=data.exponent;
       })
       
       RSA.then(function(res){
    	   $scope.modulus=res.data.modulus;
    	   $scope.exponent=res.data.exponent;
    	   var key = RSAUtils.getKeyPair($scope.exponent, '', $scope.modulus);
    	   pwd = RSAUtils.encryptedString(key,md5($scope.account.password));
    	   
    	   if($scope.account.project){
	          var dataurl='username='+$scope.account.username+'&password='+pwd+'&appname='+$scope.account.project+'&roleId='+$scope.roletype;
	       }else{
	          var dataurl='username='+$scope.account.username+'&password='+pwd+'&roleId='+$scope.roletype;
	       }
    	   
    	   $http({
	          method  : 'POST',
	          url     : '/cloudui/ws/user/login',
	          data    : dataurl,  
	          headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
	       })
	       .then(function(response) {
	          // 通过返回数据，没通过返回错误信息
	          if(response.data.result){
	              window.location='../../index.html#home'
	          }else{
	             $scope.authMsg = response.data.message;
	          }
	          }, function(x) {
	          $scope.authMsg = '服务器请求错误';
	        });
    	   
       })

    }
    else {
      // 用户直接点击登录设置脏值
      $scope.loginForm.account_username.$dirty = true;
      $scope.loginForm.account_password.$dirty = true;
    }
  };

}]);


/* 注册 */

userControllers.controller('RegisterFormController', ['$scope', '$http',function($scope, $http) {
	 
  // 绑定表单的所有数据
  $scope.account = {};
  // 错误信息
  $scope.authMsg = '';
    
  $scope.register = function() {
    $scope.authMsg = '';
    if($scope.registerForm.$valid) {
    	
    	var RSA=$http.get('/cloudui/ws/RSA'+'?v='+(new Date().getTime())).success(function(data){
     	   $scope.modulus=data.modulus;
     	   $scope.exponent=data.exponent;
        })
        
        RSA.then(function(res){
     	   $scope.modulus=res.data.modulus;
     	   $scope.exponent=res.data.exponent;
     	   var key = RSAUtils.getKeyPair($scope.exponent, '', $scope.modulus);
     	   pwd = RSAUtils.encryptedString(key, $scope.account.password);
     	   
     	   $http({
        	  method  : 'POST',
              url     : '/cloudui/ws/user/signin',
              data    : 'username='+$scope.account.username+'&password='+pwd+'&appname='+$scope.account.appname,   
              headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
          })
          .then(function(response) {
              // 通过返回数据，没通过返回错误信息
              if ( response.data.result) {
                  window.location='login.html'
              }else{
            	  $scope.authMsg = response.data.message;
              }
            }, function(x) {
              $scope.authMsg = '服务器请求错误';
            });
        })
    }
    else {
      // 用户直接点击注册设置脏值
      $scope.registerForm.account_username.$dirty = true;
      $scope.registerForm.account_password.$dirty = true;
      $scope.registerForm.account_agreed.$dirty = true;
      $scope.registerForm.account_password_confirm.$dirty = true;
      $scope.registerForm.appname.$dirty = true;
      
    }
  };

}]);