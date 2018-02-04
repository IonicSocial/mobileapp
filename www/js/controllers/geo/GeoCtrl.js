(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('GeoCtrl', GeoCtrl);

  function GeoCtrl($http,$scope,$cordovaCamera,$ionicHistory,$ionicPopup,MediaService,ResourceProvider,$state,locationFactory,$ionicLoading)
  {

    var geocodingRequired=false;

    function getGeoLocation(){
      navigator.geolocation.getCurrentPosition(setCurrentPosition, showGPSError, {
        maximumAge: 30000,
        timeout: 10000,
        enableHighAccuracy: true
      });
    }

    function setCurrentPosition (position) {
      locationFactory.setLocation(position.coords.latitude, position.coords.longitude);
    };

    function showGPSError (error) {
      var content;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          content = "User denied the request for Geolocation."
          break;
        case error.POSITION_UNAVAILABLE:
          content = "Location information is unavailable."
          break;
        case error.TIMEOUT:
          content = "The request to get user location timed out."
          break;
        case error.UNKNOWN_ERROR:
          content = "An unknown error occurred."
          break;
      }

      /*
      $ionicPopup.confirm({
        title: "GPS Error",
        cssClass: "background-color: #4BAF33",
        content: content
      });
      */
    };

    $scope.photos=[];

    var fileLocalPath="";

    $scope.photoDetails =function  (geoId){
      $state.go('app.geodetails',{ geoId:geoId});
    };

    $scope.showPhoto=function() {
      MediaService.getMedia(4).then(function (resp) {
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

        //get user current geo location
        getGeoLocation();
        var currentLocation=locationFactory.getLocation();

        var latitude=currentLocation.Latitude;
        var longitude=currentLocation.Longitude;

        var params = new Object();
        params.userID = $http.defaults.headers.common['UserID'];
        params.uploadedFrom = $http.defaults.headers.common['UserID'] ;
        params.mediaType = "4";

        if(latitude!="" && mediaSourceType==Camera.PictureSourceType.CAMERA) {
          params.latitude = latitude;
          params.longitude = longitude;
        }
        else
        {
          geocodingRequired=true;
        }

        // headers
        params.headers = {Authorization: $http.defaults.headers.common['Authorization']};

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = FILE_URI.substr(FILE_URI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params = params;

        var ft = new FileTransfer();

        $ionicLoading.show({ template: 'Uploading...'});

        ft.upload(FILE_URI, encodeURI(ResourceProvider.MEDIA_API), imageUploadSuccess, fail, options);

      }, function(err) {
        $ionicLoading.hide();
      });

    }

    var imageUploadSuccess = function (resp) {

      var mediaInfo=JSON.parse(resp.response);

      $ionicLoading.hide();
      if(geocodingRequired)
      {
        //$ionicPopup.alert({title: 'Alert',template: 'Unable to get GPS location. Enter your address to get GPS info.'});
        $state.go('app.geocoding',{ geoId:mediaInfo.mediaid});
      }
      else{
            $scope.$apply(function(){
              $scope.photos.push({id: mediaInfo.mediaid, src: ResourceProvider.MEDIA_PATH + mediaInfo.mediapath});
            });
      }
    }

    var fail = function (error) {
      alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
    }


  }

})();
