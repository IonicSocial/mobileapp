(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('AudioCtrl', AudioCtrl);

  function AudioCtrl($http,$scope,$cordovaCamera,MediaManager,$ionicHistory,MediaService,ResourceProvider,$state,$ionicPopup,$ionicLoading)
  {
    var fileLocalPath="";

    $scope.goBack=function(){
      $ionicHistory.goBack();
    };

    $scope.selectAudioFromGallery = function() {

      var options = {
        quality : 100,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY ,
        mediaType: Camera.MediaType.ALLMEDIA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(FILE_URI) {

        if(FILE_URI.substr(FILE_URI.lastIndexOf('.') + 1)!="mp3")
        {
          $ionicPopup.alert({title: 'Alert',template: 'Select mp3 file'});
          return;
        }

        fileLocalPath=FILE_URI;

        UploadMedia(FILE_URI);

      }, function(err) {
        // An error occured. Show a message to the user
      });

    }





    /*
     $scope.tracks = [
     {
     url: 'http://www.stephaniequinn.com/Music/Handel%20-%20Entrance%20of%20the%20Queen%20of%20Sheba.mp3',
     artist: 'Genesis',
     title: 'Land of Confusion',
     id:12
     },
     {
     url: 'http://54.187.92.157/SocialAppM2/media/0e6c0a38-6c26-40f9-9f15-798c2f2c7516_9524574d-4e4d-4fa2-b2b1-5d534f58b278.mp3',
     c: 'Genesis',
     title: 'Tonight. Tonight. Tonight',
     id:122

     }
     ];

     */

    $scope.tracks = [];
    $scope.audios=[];
  
    $scope.showAudios=function() {
      MediaService.getMedia(2).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            for (var i = 0; i < resp.data.length; i++) {
              $scope.tracks.push({url: ResourceProvider.MEDIA_PATH + resp.data[i].mediapath ,artist: ' ',title:resp.data[i].description,id: resp.data[i].mediaid});
            }
          }
        }
      });
    };


    $scope.showAudios();

    $scope.editAudio=function(audioid){
      $state.go('app.audiodetails',{ photoId:audioid});
    }

    var urlprefix = '/android_asset/www/audio/';

    $scope.dynamicTrack = {};

    $scope.sound = {name:""};

    var captureError = function(e) {
      console.log('captureError' ,e);
    }

    var captureSuccess = function(e) {
      console.log('captureSuccess');console.dir(e);

      $scope.sound.file = e[0].localURL;
      $scope.sound.filePath = e[0].fullPath;
      //$scope.tracks.push({url:$scope.sound.file,title:'', artist:''});

      var FILE_URI= e[0].localURL;

      UploadMedia(FILE_URI);
    }


    $scope.recordAudio = function() {
      navigator.device.capture.captureAudio(
        captureSuccess,captureError);
    }

    $scope.play = function() {
      if(!$scope.sound.file) {
        navigator.notification.alert("Record a sound first.", null, "Error");
        return;
      }
      var media = new Media($scope.sound.file, function(e) {
        media.release();
      }, function(err) {
        console.log("media err", err);
      });
      media.play();
    }

    $scope.stopPlayback = function() {
      MediaManager.stop();
    };

    $scope.playTrack = function(index) {
      $scope.dynamicTrack = $scope.tracks[index];

      $scope.togglePlayback = !$scope.togglePlayback;
    };

    var UploadMedia = function (FILE_URI)
    {
      var params = new Object();
      params.userID = $http.defaults.headers.common['UserID'];
      params.uploadedFrom = $http.defaults.headers.common['UserID'];
      params.mediaType = "2";

      // headers
      params.headers = {Authorization: $http.defaults.headers.common['Authorization']};

      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = FILE_URI.substr(FILE_URI.lastIndexOf('/') + 1);
      options.mimeType = "audio/amr";
      options.params = params;

      //  options.chunkedMode = false;
      //   options.headers = {Connection: "close"};
      var ft = new FileTransfer();

      $ionicLoading.show({ template: 'Uploading...'});

      ft.upload(FILE_URI, encodeURI(ResourceProvider.MEDIA_API), uploadSuccess, uploadFail, options);
    }

    var uploadSuccess = function (resp) {
      $ionicLoading.hide();
      var mediaInfo=JSON.parse(resp.response);
      $scope.$apply(function(){
        var mediaInfo=JSON.parse(resp.response);
        $scope.tracks.push({url: ResourceProvider.MEDIA_PATH +mediaInfo.mediapath ,artist: ' ',title:' ',id: mediaInfo.mediaid});

      });
    }

    var uploadFail = function (error) {
      alert("An error has occurred: Code = " + error.code);
    }


  }

})();
