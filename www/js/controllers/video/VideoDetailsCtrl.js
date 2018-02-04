(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('VideoDetailsCtrl', VideoDetailsCtrl);

  function VideoDetailsCtrl($http,$scope,$state,$ionicHistory,MediaManager,video,ngVideoOptions,ngVideoPlaylist,$stateParams,MediaService,ResourceProvider,$ionicPopup)
  {
    $scope.getVideoDetails=function(videoId){
      MediaService.getMediaDetails(videoId).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            // $scope.imgFullPath=ResourceProvider.MEDIA_PATH + "/"+ resp.data.mediapath ;
            $scope.mediaDetails=resp.data;
            ngVideoPlaylist=[];
            video.addSource('mp4', ResourceProvider.MEDIA_PATH + resp.data.mediapath );
          }
        }
      });
    };

    $scope.saveVideoDetails=function(mediaDetails){

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

    var videoId=$stateParams.videoId;

    $scope.getVideoDetails(videoId);

    //video.addSource('mp4', 'http://solidrun.maltegrosse.de/~fritsch/1080i50_h264_mbaff.mp4');

    ngVideoOptions.BUFFER_COLOUR = '#00f';

    //delete photo start
    $scope.deletePhoto=function(mediaDetails){

      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete',
        template: 'Are you sure you want to delete the video?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          //service start
          MediaService.deleteMedia(mediaDetails.mediaid).then(function (resp) {
            if (resp !== undefined && resp !== null) {
              if (resp.data !== undefined && resp.data !== null) {
                console.log(resp.data);
                $state.go('app.video', {}, {reload: true});
              }
            }
          });
          //service end
        }
      });

    };

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

  }

})();
