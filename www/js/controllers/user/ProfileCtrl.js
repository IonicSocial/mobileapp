(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('ProfileCtrl', ProfileCtrl);

  function ProfileCtrl($scope,FaceBookUserService,GoogleUserService)
  {

    if(window.localStorage.loginbyfacebook=="true")
    {
      $scope.userInfo=FaceBookUserService.getUser()
    }
    if(window.localStorage.loginbygoogle=="true")
    {
      $scope.userInfo=GoogleUserService.getUser()
    }
    else
    {
      $scope.userin = {
        name : "test",
        email : "test@test.com"
      };
      $scope.userInfo=$scope.userin;
    }

  }

})();
