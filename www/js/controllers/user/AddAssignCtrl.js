(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('AddAssignCtrl', AddAssignCtrl);

  function AddAssignCtrl($http,$scope,$ionicHistory)
  {
    $scope.goBack=function(){
      $ionicHistory.goBack();
    };
  }

})();
