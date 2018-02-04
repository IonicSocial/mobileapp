(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('TextToCtrl', TextToCtrl);

  function TextToCtrl($scope,$ionicLoading,$timeout,$state,TextToService,$ionicHistory)
  {
    $scope.textToDetail={};

    $scope.goBack=function(){
      $ionicHistory.goBack();
    };

    TextToService.getTextTo().then(function(resp) {
      if (resp !== undefined && resp !== null) {
        if (resp.data !== undefined && resp.data !== null) {
          if(resp.data.length>0)
          {
            $scope.textToDetail= resp.data[0];
          }
        }
      }
    });

    $scope.saveTextTo=function(){

      $ionicLoading.show({template: 'Saving data...'});

      TextToService.saveTextTo($scope.textToDetail).then(function(resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {

            if(resp.data==true)
            {
              $ionicLoading.hide();
            }
          }
        }
      });
    }

  }

})();
