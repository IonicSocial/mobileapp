(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('MenuCtrl', MenuCtrl);

  function MenuCtrl($scope, $state)
  {
    $scope.GoProfile= function () {
      $state.go('app.profile');
    }
    $scope.GoHome= function () {
      $state.go('app.dash');
    }
    $scope.LogOut= function () {
      ionic.Platform.exitApp();
    }
  }

})();
