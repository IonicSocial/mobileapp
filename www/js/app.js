// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova', 'ngCordovaOauth','ionic-audio', 'ngVideo','starter.controllers', 'starter.services'])
//.constant('RESOURCES', { host: 'http://54.187.92.157/SocialAppM2'})
.constant('RESOURCES', { host: 'http://192.168.56.1:8091'})
//.constant('RESOURCES', { host: 'http://10.0.3.2:8091'})
.provider('ResourceProvider', ['RESOURCES', function(RESOURCES) {
  this.data = {
    RESOURCES: RESOURCES.host ,
    USER_API: RESOURCES.host + '/api/account/',
    TOKEN_API: RESOURCES.host + '/token',
    MEDIA_API: RESOURCES.host + '/api/media',
    TEXTTO_API: RESOURCES.host + '/api/textto',
    MEDIA_PATH: RESOURCES.host + '/media/',
    MEDIA_DETAILS_PATH: RESOURCES.host + '/api/media/MediaDetails',
    MEDIA_LOCATION_UPDATE_PATH: RESOURCES.host + '/api/media/UpdateLocation'
  };
  this.$get = function() {
    return this.data;
  };
}])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})
  .config( [    //use this code for show image from other source
    '$compileProvider',
    function( $compileProvider )
    {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
      // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
      })

      .state('app.login', {
        url: '/login',
        abstract: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      })
      .state('app.signup', {
        url: '/signup',
        views: {
          'menuContent': {
            templateUrl: 'templates/signup.html',
            controller: 'SignUpCtrl'
          }
        }
      })
      .state('app.dash', {
        url: '/dash',
        views: {
          'menuContent': {
            templateUrl: 'templates/dash.html',
            controller: 'DashCtrl'
          }
        }
      })
      .state('app.textto', {
        url: '/textto',
        views: {
          'menuContent': {
            templateUrl: 'templates/textto.html',
            controller: 'TextToCtrl'
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      })
      .state('app.photo', {
        url: '/photo',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/photolist.html',
            controller: 'PhotoCtrl'
          }
        }
      })
      .state('app.photodetails', {
        url: '/photodetails/{photoId}',
        views: {
          'menuContent': {
            templateUrl: 'templates/photoDetails.html',
            controller: 'PhotoDetailsCtrl'
          }
        }
      })
      .state('app.audio', {
        url: '/audio',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/audiolist.html',
            controller: 'AudioCtrl'
          }
        }
      })
      .state('app.audiodetails', {
        url: '/audiodetails/{audioId}',
        views: {
          'menuContent': {
            templateUrl: 'templates/audioDetails.html',
            controller: 'AudioDetailsCtrl'
          }
        }
      })
      .state('app.video', {
        url: '/video',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/videoList.html',
            controller: 'VideoCtrl'
          }
        }
      })
      .state('app.videodetails', {
        url: '/videodetails/{videoId}',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/videoDetails.html',
            controller: 'VideoDetailsCtrl'
          }
        }
      })
      .state('app.geo', {
        url: '/geo',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/geoList.html',
            controller: 'GeoCtrl'
          }
        }
      })
      .state('app.geodetails', {
        url: '/geodetails/{geoId}/{gps}',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/geoDetails.html',
            controller: 'GeoDetailsCtrl'
          }
        }
      })
      .state('app.geocoding', {
        url: '/geocoding/{geoId}/{gps}',
        views: {
          'menuContent': {
            templateUrl: 'templates/geoCoding.html',
            controller: 'GeoCodingCtrl'
          }
        }
      })
      .state('app.assign', {
        url: '/assign',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/assignList.html',
            controller: 'AssignCtrl'
          }
        }
      })
      .state('app.addassign', {
        url: '/addassign',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/addAssign.html',
            controller: 'AddAssignCtrl'
          }
        }
      })
      .state('app.assigndetails', {
        url: '/assigndetails/{assignId}',
        views: {
          'menuContent': {
            templateUrl: 'templates/assignDetails.html',
            controller: 'AssignDetailsCtrl'
          }
        }
      })
      .state('app.calendar', {
        url: '/calendar',
        cache:false,
        views: {
          'menuContent': {
            templateUrl: 'templates/calendar.html',
            controller: 'CalendarCtrl'
          }
        }
      })
      .state('app.renew', {
        url: '/renew',
        views: {
          'menuContent': {
            templateUrl: 'templates/renew.html',
            controller: 'RenewCtrl'
          }
        }
      })
     ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
  });
