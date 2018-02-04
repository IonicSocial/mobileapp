(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('GeoCodingCtrl', GeoDetailsCtrl);

  function GeoDetailsCtrl($scope,$cordovaCamera,$timeout,GoogleCodingService,$ionicLoading,$ionicHistory,MediaService,ResourceProvider,$state,$stateParams,$ionicPopup,locationFactory)
  {
    $scope.googleCodingDetails={};
    $scope.googleCodingDetails.address1="";
    $scope.googleCodingDetails.address2="";
    $scope.googleCodingDetails.city="";
    $scope.googleCodingDetails.zip="";
    $scope.googleCodingDetails.latitude="";
    $scope.googleCodingDetails.longitude="";

    $scope.goBack=function(){
      $ionicHistory.goBack();
    };

    $scope.data = {
      clientSide: '0'
    };

    $scope.ShowlatlongInfo=false;

      $scope.getPhotoDetails=function(mediaid){

      $ionicLoading.show({ template: 'Downloading photo...'});

      MediaService.getMediaDetails(mediaid).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {


            $scope.googleCodingDetails.address1=resp.data.address1;
            $scope.googleCodingDetails.address2=resp.data.address2;
            $scope.googleCodingDetails.city=resp.data.city;
            $scope.googleCodingDetails.zip=resp.data.zip;
            $scope.googleCodingDetails.latitude=resp.data.latitude;
            $scope.googleCodingDetails.longitude=resp.data.longitude;
          }
        }
        $ionicLoading.hide();
      });
    };

    var mediaid=$stateParams.geoId;

    $scope.getPhotoDetails(mediaid);

    $scope.getLatLong=function(googleCodingDetails){

      $ionicLoading.show({ template: 'Fetching Lat/Long...'});

    var address="";

    if($scope.googleCodingDetails.address1)
      address=address+$scope.googleCodingDetails.address1+",";

      if($scope.googleCodingDetails.address2)
        address=address+$scope.googleCodingDetails.address2+",";

      if($scope.googleCodingDetails.city)
        address=address+$scope.googleCodingDetails.city+",";

      if($scope.googleCodingDetails.zip)
        address=address+$scope.googleCodingDetails.zip+",";

      GoogleCodingService.getLatLong(address).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {

            $scope.locationList = [];

            for(var i=0; i<resp.data.results.length;i++)
            {
              $scope.ShowlatlongInfo=true;
              $scope.locationList.push({ text: resp.data.results[i].formatted_address +", Lat/long:"+resp.data.results[i].geometry.location.lat+","+resp.data.results[i].geometry.location.lng, value: resp.data.results[i].geometry.location.lat+","+resp.data.results[i].geometry.location.lng });
              $scope.latlongInfo=true;
            }
          }
        }
        $ionicLoading.hide();
      });
    };

    $scope.saveLocationInfo=function(googleCodingDetails)
    {

      if($scope.data.clientSide!="0")
      {
        var lotlong=$scope.data.clientSide.split(",");

        googleCodingDetails.latitude=lotlong[0];
        googleCodingDetails.longitude=lotlong[1];
      }

      $ionicLoading.show({ template: 'Saving address...'});

      MediaService.updateMediaLocation(mediaid,googleCodingDetails ).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            $state.go('app.geodetails',{ geoId:mediaid});
          }
        }
        $ionicLoading.hide();
      });
    }

  }

})();
