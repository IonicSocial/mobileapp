(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('SignUpCtrl', SignUpCtrl);

 function SignUpCtrl($scope, $stateParams,UserService,$ionicHistory,$ionicPopup,$state,$http)
  {

    $scope.userRegisterInfo={};
    $scope.userRegisterInfo.name="";
    $scope.userRegisterInfo.password="";
    $scope.userRegisterInfo.email="";
    $scope.userRegisterInfo.confirmpassword="";

    var emailRegex=new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$");
    //var strongRegex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,6})");
    var strongRegex = new RegExp("^(?=.{6,6})");

    $scope.signUpUser=function(userRegisterInfo){

      console.log(userRegisterInfo);

      if($scope.userRegisterInfo.name=="" || $scope.userRegisterInfo.email=="" ){
        $ionicPopup.alert({title: 'Alert',template: 'Enter required field'});
        return ;
      }

      if(!emailRegex.test( $scope.userRegisterInfo.email) ){
        $ionicPopup.alert({title: 'Alert',template: 'Enter valid email'});
        return ;
      }

      if($scope.userRegisterInfo.password.length!=6){
        $ionicPopup.alert({title: 'Alert',template: 'Password should contains 6 characters'});
        return ;
      }

      // if(!strongRegex.test($scope.userRegisterInfo.password))
      // {
      //   $ionicPopup.alert({title: 'Alert',template: 'Password must contains 1 uppercase alphabetical character,1 number and 1 special character  '});
      //  return;
      // }

      if($scope.userRegisterInfo.password!=$scope.userRegisterInfo.confirmpassword){
        $ionicPopup.alert({title: 'Alert',template: 'Password and confirm password should be same'});
        return ;
      }

      UserService.signUp($scope.userRegisterInfo).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {

            switch (resp.data.status) {
              case 1:
                $ionicPopup.alert({title: 'Alert',template: 'Usuario registrado correctamente'});

                //create userlogininfo modal
                var userLoginInfo={};
                userLoginInfo={username:$scope.userRegisterInfo.email,password:$scope.userRegisterInfo.password,grant_type:'password'};

                //automatically login
                UserService.login(userLoginInfo).then(function (response) {
                  if (response !== undefined && response !== null) {
                    if (response.data !== undefined && response.data !== null) {
                      if(response.data.access_token) {

                        $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.access_token;

                        userInformation(userLoginInfo.username);

                      }
                    }
                  }
                });

                break;
              case 2:
                $ionicPopup.alert({title: 'Alert',template: 'User already exits'});
                break;
              case -1:
                $ionicPopup.alert({title: 'Alert',template: 'Invalid data'});
                break;
              case 0:
                $ionicPopup.alert({title: 'Alert',template: 'Incorrect login/password'});
                break;
              default:
            }
          }
        }
      });

    };

    $scope.goBack=function(){
      $state.go('app.login');
    };

    var userInformation=function(email) {
      UserService.userInformation(email).then(function (response) {
        if (response !== undefined && response !== null) {
          if (response.data !== undefined && response.data !== null) {
            $http.defaults.headers.common['UserID'] = response.data.userid;
            $state.go('app.dash');
          }
        }
      });
    }

}

})();
