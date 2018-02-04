(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('AssignCtrl', AssignCtrl);

  function AssignCtrl($scope,$state,$ionicHistory)
  {
    $scope.goBack=function(){
      $ionicHistory.goBack();
    };

    $scope.addAssign =function  (){
      $state.go('app.addassign');
    };

    $scope.assignDetails =function  (assignid){
      $state.go('app.assigndetails',{ assignid:assignid});
    };

  }

})();
