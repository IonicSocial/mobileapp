angular.module('starter.services', [])
  .service('UserService', function($http,ResourceProvider,$httpParamSerializerJQLike) {

    this.signUp = function(register) {
      console.log(register);
      return $http({method: "post", url: ResourceProvider.USER_API+"Register",data:register})
    };

    this.login=function (userLoginInfo){
      return $http({method: "post",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: ResourceProvider.TOKEN_API,
        data:"username="+encodeURIComponent(userLoginInfo.username)+"&password="+encodeURIComponent(userLoginInfo.password)+"&grant_type=password"
      })
    };

    this.userInformation = function(email) {
      return $http({method: "post", url: ResourceProvider.USER_API+"/UserInformation?email="+email})
    };

    var isUserExists = function(email) {
      window.localStorage.starter_google_user = JSON.stringify(user_data);
    };

    var forgot = function(email) {
      window.localStorage.starter_google_user = JSON.stringify(user_data);
    };

  })
  .service('MediaService', function($http,ResourceProvider) {

    this.getMedia = function(mediaType) {
      return $http({method: "get", url: ResourceProvider.MEDIA_API+"?mediaType="+mediaType})
    };

    this.deleteMedia = function(mediaid) {
      return $http({method: "delete", url: ResourceProvider.MEDIA_API+"?mediaid="+mediaid})
    };

    this.getMediaDetails = function(mediaid) {
      return $http({method: "get", url: ResourceProvider.MEDIA_DETAILS_PATH+"?mediaid="+mediaid})
    };

    this.saveMediaDetails = function(mediaDetails) {

      console.log(mediaDetails);
      return $http({method: "put", url: ResourceProvider.MEDIA_API,data:mediaDetails})
    };

    this.updateMediaLatLong = function(mediaid,lat,long) {

      console.log(lat+long);
      return $http({method: "put", url: ResourceProvider.MEDIA_LOCATION_UPDATE_PATH+"?mediaid="+mediaid+"&latitude="+lat+"&longitude="+long})
    };

    this.updateMediaLocation = function(mediaid,googleCodingDetails) {


      return $http({method: "put", url: ResourceProvider.MEDIA_LOCATION_UPDATE_PATH+"?mediaid="+mediaid,
        data:googleCodingDetails

        })
    };

  })
.service('TextToService',function($http,ResourceProvider) {

    this.getTextTo = function() {
      return $http({method: "get", url: ResourceProvider.TEXTTO_API })
    };

    this.saveTextTo = function(textto){
      return $http({method: "put",data:textto, url: ResourceProvider.TEXTTO_API })
    };
  })
  .service('FaceBookUserService', function() {
    var setUser = function(user_data) {
      window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function(){
      return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    return {
      getUser: getUser,
      setUser: setUser
    };
  })
  .service('GoogleUserService', function() {
    var setUser = function(user_data) {
      window.localStorage.starter_google_user = JSON.stringify(user_data);
    };

    var getUser = function(){
      return JSON.parse(window.localStorage.starter_google_user || '{}');
    };

    return {
      getUser: getUser,
      setUser: setUser
    };
  })

  .service('FaceBookService', function($http,ResourceProvider,$httpParamSerializerJQLike) {

    this.login=function (facebookLoginInfo){
      return $http({method: "post",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: ResourceProvider.USER_API+"FacebookLogin",
        data:"username="+encodeURIComponent(facebookLoginInfo.username)+"&token="+encodeURIComponent(facebookLoginInfo.token)+"&userid="+encodeURIComponent(facebookLoginInfo.userid)
      })
    };

  })
  .service('GoogleService', function($http,ResourceProvider,$httpParamSerializerJQLike) {

    this.login=function (facebookLoginInfo){
      return $http({method: "post",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: ResourceProvider.USER_API+"GoogleLogin",
        data:"username="+encodeURIComponent(facebookLoginInfo.username)+"&token="+encodeURIComponent(facebookLoginInfo.token)+"&userid="+encodeURIComponent(facebookLoginInfo.userid)
      })
    };

  })
  .service('GoogleCodingService', function($http,ResourceProvider,$httpParamSerializerJQLike) {

    this.getLatLong = function(address) {
      return $http({
        method: "get",
        headers: {
          'Authorization': undefined,'UserID': undefined
        },
        url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address + "&key=AIzaSyAvxEHvKzN8ReUk02nqll1U17lFNM2IoP8" })
    };

  })
  .factory('locationFactory', function() {
    var locationData = {
      Latitude: '',
      Longitude: ''
    };
    return {
      getLocation: function() {
        return locationData;
      },
      setLocation: function(latitude, longitude) {
        locationData.Latitude = latitude;
        locationData.Longitude = longitude;
      }
    };
  })
;

