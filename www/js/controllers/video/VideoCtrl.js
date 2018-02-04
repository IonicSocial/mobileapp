(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('VideoCtrl', VideoCtrl);

  function VideoCtrl($http,$scope,MediaManager,MediaService,$ionicHistory,ResourceProvider,$cordovaCamera,$ionicLoading,$state)
  {
    var fileLocalPath = "";
    var loading = "";

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.videoDetails = function (videoid) {
      $state.go('app.videodetails', {videoId: videoid});
    };

    $scope.videos = [];

    $scope.showVideos = function () {
      MediaService.getMedia(3).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            for (var i = 0; i < resp.data.length; i++) {
              //$scope.videos.push({url: ResourceProvider.MEDIA_PATH + resp.data[i].mediapath ,artist: '',title:resp.data[i].description,id: resp.data[i].mediaid});
              $scope.videos.push({id: resp.data[i].mediaid, src: ResourceProvider.MEDIA_PATH +"thumb/"+ resp.data[i].thumbpath});
            }
          }
        }
      });
    };

    var uploadSuccess = function (resp) {
      $ionicLoading.hide();
      // console.log(res);
      $scope.$apply(function () {

        var mediaInfo=JSON.parse(resp.response);
        //  //$scope.photos.push({id: res.response, src: fileLocalPath});
        $scope.videos.push({src: ResourceProvider.MEDIA_PATH +"thumb/"+ mediaInfo.thumbpath, id: mediaInfo.mediaid});
      });
    }

    var uploadFail = function (error) {
      $ionicLoading.hide();
      alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
    }

    var captureError = function (e) {
      console.log('captureError', e);
    }

    var captureSuccess = function (e) {
      var FILE_URI = e[0].localURL;    //e[0].fullPath
      UploadVideo(FILE_URI);
    }


    $scope.recordVideo = function () {
      navigator.device.capture.captureVideo(captureSuccess, captureError);
    }

    $scope.showVideos();

    $scope.selectVideoFromGallery = function () {

      var options = {
        quality : 100,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY ,
        mediaType: Camera.MediaType.ALLMEDIA,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };


      $cordovaCamera.getPicture(options).then(function (FILE_URI) {

        UploadVideo(FILE_URI);

      }, function (err) {
        // An error occured. Show a message to the user
      });

    }

    var UploadVideo = function (FILE_URI)
    {

      var params = new Object();
      params.userID = $http.defaults.headers.common['UserID'];
      params.uploadedFrom = $http.defaults.headers.common['UserID'];
      params.mediaType = "3";

      // headers
      params.headers = {Authorization: $http.defaults.headers.common['Authorization']};

      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = FILE_URI.substr(FILE_URI.lastIndexOf('/') + 1);
      options.mimeType = "image/mp4";
      options.params = params;

      $ionicLoading.show({
        template: 'Uploading...'
      });

      //  options.chunkedMode = false;
      //   options.headers = {Connection: "close"};
      var ft = new FileTransfer();

      ft.upload(FILE_URI, encodeURI(ResourceProvider.MEDIA_API), uploadSuccess, uploadFail, options);
    }

  }

})();
