(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('GeoDetailsCtrl', GeoDetailsCtrl);

  function GeoDetailsCtrl($scope,$cordovaCamera,$timeout,$ionicLoading,$ionicHistory,MediaService,ResourceProvider,$state,$stateParams,$ionicPopup,locationFactory)
  {

    var createMap = function(latitude,longitude) {

      $timeout(function(){

          var myLatlng = new google.maps.LatLng(latitude, longitude);
          var mapOptions = {
            center: myLatlng,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          var map = new google.maps.Map(document.getElementById("map"), mapOptions);
          map.setCenter(new google.maps.LatLng(latitude, longitude));
          map.setOptions({draggable: false});

          createMarker(map,latitude, longitude);
        }
      )
    };

    var createMarker = function(map, lat, long) {
      //creating marker
      var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        map: map,
        title: 'You here'
        //labelContent: centerName
      });
      /* var infowindow = new google.maps.InfoWindow({
       content: "<strong>" + centerName + "</strong>"
       });


       google.maps.event.addListener(myLocation, 'click', function() {
       infowindow.open(map, myLocation);
       });
       */

    };


    $scope.getPhotoDetails=function(mediaid){

      $ionicLoading.show({ template: 'Downloading photo...'});

      MediaService.getMediaDetails(mediaid).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            $scope.imgFullPath=ResourceProvider.MEDIA_PATH + "/"+ resp.data.mediapath ;
            $scope.mediaDetails=resp.data;

            createMap(resp.data.latitude, resp.data.longitude);

          }
        }
        $ionicLoading.hide();
      });
    };

    var mediaid=$stateParams.geoId;

    $scope.getPhotoDetails(mediaid);

    $scope.goBack=function(){
      $state.go('app.geo');
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

    $scope.enterGeoInfo=function(mediaDetails){
      $state.go('app.geocoding',{ geoId:mediaDetails.mediaid});
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
                $state.go('app.geo', {}, {reload: true});
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
