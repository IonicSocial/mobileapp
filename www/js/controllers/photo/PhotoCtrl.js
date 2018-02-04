(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('PhotoCtrl', PhotoCtrl);

  function PhotoCtrl($http,$scope,$cordovaCamera,$ionicHistory,MediaService,ResourceProvider,$state)
  {

    $scope.photos=[];

    $scope.photoDetails =function  (photoid){
      $state.go('app.photodetails',{ photoId:photoid});
    };

    $scope.showPhoto=function() {
      MediaService.getMedia(1).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            for (var i = 0; i < resp.data.length; i++) {
              $scope.photos.push({id: resp.data[i].mediaid, src: ResourceProvider.MEDIA_PATH + resp.data[i].mediapath});
            }
          }
        }
      });
    };

    $scope.showPhoto();

    $scope.selectCamera=function(){


      $scope.selectPicture(Camera.PictureSourceType.CAMERA);
    };
    $scope.selectGallery=function(){
      $scope.selectPicture(Camera.PictureSourceType.PHOTOLIBRARY);
    };
    $scope.goBack=function(){
      $ionicHistory.goBack();
    };

    var fileLocalPath="";

    $scope.selectPicture = function(mediaSourceType) {
      var options = {
        quality : 100,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : mediaSourceType,
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(FILE_URI) {

        var params = new Object();
        params.userID = $http.defaults.headers.common['UserID'];
        params.uploadedFrom = $http.defaults.headers.common['UserID'] ;
        params.mediaType = "1";

        // headers
        params.headers = {Authorization: $http.defaults.headers.common['Authorization']};

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = FILE_URI.substr(FILE_URI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params = params;

        //  options.chunkedMode = false;
        //   options.headers = {Connection: "close"};
        var ft = new FileTransfer();

        /*
         ft.onprogress = function(progressEvent) {
         if (progressEvent.lengthComputable) {
         loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
         } else {
         loadingStatus.increment();
         }
         };
         */

        fileLocalPath=FILE_URI;

        ft.upload(FILE_URI, encodeURI(ResourceProvider.MEDIA_API), win, fail, options);

      }, function(err) {
        // An error occured. Show a message to the user
      });

    }

    var win = function (resp) {
      var mediaInfo=JSON.parse(resp.response);
      $scope.$apply(function(){
        $scope.photos.push({id: mediaInfo.mediaid, src: ResourceProvider.MEDIA_PATH + mediaInfo.mediapath});
      });
    }

    var fail = function (error) {
      alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
    }

  }

})();
