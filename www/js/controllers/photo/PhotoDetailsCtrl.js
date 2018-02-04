(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('PhotoDetailsCtrl', PhotoDetailsCtrl);

  function PhotoDetailsCtrl($scope,$cordovaCamera,$ionicHistory,MediaService,ResourceProvider,$state,$stateParams,$ionicPopup)
  {

    $scope.getPhotoDetails=function(mediaid){
      MediaService.getMediaDetails(mediaid).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            $scope.imgFullPath=ResourceProvider.MEDIA_PATH + "/"+ resp.data.mediapath ;
            $scope.mediaDetails=resp.data;
          }
        }
      });
    };

    var mediaid=$stateParams.photoId;

    $scope.getPhotoDetails(mediaid);

    $scope.goBack=function(){
      $state.go('app.photo');
    };

    $scope.savePhotoDetails=function(mediaDetails){

      MediaService.saveMediaDetails(mediaDetails).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            console.log(resp.data);
            $ionicPopup.alert({title: 'Alert',template: 'Save success'});
            return resp.data;
          }
        }
      });
    };

    //delete photo start
    $scope.deletePhoto=function(mediaDetails){

      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete',
        template: 'Are you sure you want to delete the photo?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          //service start
          MediaService.deleteMedia(mediaDetails.mediaid).then(function (resp) {
            if (resp !== undefined && resp !== null) {
              if (resp.data !== undefined && resp.data !== null) {
                console.log(resp.data);
                $state.go('app.photo', {}, {reload: true});
              }
            }
          });
          //service end
        }
      });

    };
    //delete photo end

  }

})();
