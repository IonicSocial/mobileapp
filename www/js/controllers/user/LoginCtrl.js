(function() {
  'use strict';
  angular
    .module('starter.controllers')
    .controller('LoginCtrl', LoginCtrl);

  function LoginCtrl($scope, $ionicHistory,$ionicPopup,$ionicSideMenuDelegate, $state, $q, FaceBookUserService,FaceBookService,GoogleUserService,$ionicLoading, $location,$http, UserService,GoogleService, $cordovaOauth)
  {

    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $scope.userLoginInfo={};
    $scope.userLoginInfo={username:'',password:'',grant_type:'password'};

    //local login start
    $scope.login=function(){

      $ionicLoading.show({ template: 'Logging in...'});

      UserService.login($scope.userLoginInfo).then(function (response) {
        if (response !== undefined && response !== null) {
          if (response.data !== undefined && response.data !== null) {
            if(response.data.access_token) {

              $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.access_token;

              $scope.userInformation($scope.userLoginInfo.username);

            }
          }
        }
      }, function (response) {
        $ionicLoading.hide();
        $ionicPopup.alert({title: 'Alert',template: 'wrong information'});
      });

    };

    $scope.userInformation=function(email){
      UserService.userInformation(email).then(function (response) {
        if (response !== undefined && response !== null) {
          if (response.data !== undefined && response.data !== null) {
            $http.defaults.headers.common['UserID'] = response.data.userid;
            $ionicLoading.hide();
            $state.go('app.dash');
          }
        }
      });

    };
    //local login end


    //facebook login start ...................

    // get Authorization token from server start

    var getAuthorizationFromServer=function(facebookLoginInfo){
      FaceBookService.login(facebookLoginInfo).then(function (response) {
        if (response !== undefined && response !== null) {
          if (response.data !== undefined && response.data !== null) {

            //login to application if got access token
            if(response.data.access_token) {

              $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.access_token;
              $http.defaults.headers.common['UserID'] = response.data.userid;
              $ionicLoading.hide();

              $state.go('app.dash');
            }
            //show alert message if user already exists
            if(response.data.status==2) {
              $ionicLoading.hide();
              $ionicPopup.alert({title: 'Alert',template: 'User already exits.'});
            }
          }
        }
      }, function (response) {
        $ionicPopup.alert({title: 'Alert',template: 'Unable to fetch information. Try again'});
        $ionicLoading.hide();
      });
    }
    //get Authorization token from server end

    // This is the success callback from the login method
    var fbLoginSuccess = function(response) {
      if (!response.authResponse){
        fbLoginError("Cannot find the authResponse from facebook.");
        return;
      }

      var authResponse = response.authResponse;

      console.log(response);

      getFacebookProfileInfo(authResponse)
        .then(function(profileInfo) {
          // For the purpose of this example I will store user data on local storage

          console.log(profileInfo);

          FaceBookUserService.setUser({
            authResponse: authResponse,
            userID: profileInfo.id,
            name: profileInfo.name,
            email: profileInfo.email,
            picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });

          //create facebookLogin model
          var facebookLoginInfo={username:profileInfo.email,token:authResponse.accessToken,userid:profileInfo.id};

          getAuthorizationFromServer(facebookLoginInfo);

        }, function(fail){
          // Fail get profile info
          console.log('profile info fail', fail);
          $ionicPopup.alert({title: 'Alert',template: 'Fail get profile info from facebook. Try again'});
        });
    };

    // This is the fail callback from the login method
    var fbLoginError = function(error){
      console.log('fbLoginError', error);
      $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function (response) {
          console.log(response);
          info.resolve(response);
        },
        function (response) {
          console.log(response);
          info.reject(response);
        }
      );
      return info.promise;
    };

    //facebook login entry point
    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
      facebookConnectPlugin.getLoginStatus(function(success){
        if(success.status === 'connected'){
          // The user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          console.log('success', success);
          var email=success.authResponse.email;

          //get email from facebook profile if not avaliable in success object
          if(email== undefined)
          {
            getFacebookProfileInfo(success.authResponse)
              .then(function(profileInfo) {
                email=profileInfo.email;

                var facebookLoginInfo={username:email,token:success.authResponse.accessToken,userid:success.authResponse.userID};
                getAuthorizationFromServer(facebookLoginInfo);

              });
          }
          else
          {
            var facebookLoginInfo={username:email,token:success.authResponse.accessToken,userid:success.authResponse.userID};
            getAuthorizationFromServer(facebookLoginInfo);
          }

        } else {
          // If (success.status === 'not_authorized') the user is logged in to Facebook,
          // but has not authenticated your app
          // Else the person is not logged into Facebook,
          // so we're not sure if they are logged into this app or not.

          console.log('getLoginStatus', success.status);

          $ionicLoading.show({
            template: 'Logging in...'
          });

          // Ask the permissions you need. You can learn more about
          // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      });
    };

    //facebook login end ...................

    //Google plus login code start ...................

    // This method is executed when the user press the "Sign in with Google" button
    $scope.googleSignIn = function() {

      window.localStorage.loginbyfacebook=false;
      window.localStorage.loginbygoogle=true;

      var requestToken = "";
      var accessToken = "";
      var clientId = "5337926917-q1pb8a08heitun92b3u5nlh09fkbsole.apps.googleusercontent.com";
      var clientSecret = "VWpQikpjE9Q2khK3sLbsXxi6";

      $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

      var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/userinfo.profile email&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');

      $ionicLoading.show({
        template: 'Logging in...'
      });

      ref.addEventListener('loadstart', function(event) {
        if((event.url).startsWith("http://localhost/callback")) {
          requestToken = (event.url).split("code=")[1];
          $http({method: "post", url: "https://accounts.google.com/o/oauth2/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
            .success(function(data) {

              GetGoogleUserInfo(data.access_token);

            })
            .error(function(data, status) {
              $ionicPopup.alert({title: 'Alert',template: 'Fail to login google.'});
            });
          ref.close();
        }
      });

      if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
          return this.indexOf(str) == 0;
        };
      }

    };

    function GetGoogleUserInfo(accesstoken)
    {
      $http({method: "get", url: "https://www.googleapis.com/oauth2/v1/userinfo?access_token="+ accesstoken })
        .success(function(user_data) {

          GoogleUserService.setUser({
            userID: user_data.id,
            name: user_data.given_name+ user_data.family_name,
            email: user_data.email,
            picture: user_data.picture,
            accessToken: accesstoken,
            idToken: user_data.id
          })

          var googleLoginInfo={username:user_data.email,token:accesstoken,userid:user_data.id};

          GoogleService.login(googleLoginInfo).then(function (response) {
            if (response !== undefined && response !== null) {
              if (response.data !== undefined && response.data !== null) {

                //login to application if got access token
                if(response.data.access_token) {
                  $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.access_token;
                  $http.defaults.headers.common['UserID'] = response.data.userid;
                  $ionicLoading.hide();
                  $state.go('app.dash');

                }
                //show alert message if user already exists
                if(response.data.status==2) {
                  $ionicLoading.hide();
                  $ionicPopup.alert({title: 'Alert',template: 'User already exits.'});
                }
              }
            }
          }, function (response) {
            $ionicPopup.alert({title: 'Alert',template: 'Unable to login into server.  Try again'});
            $ionicLoading.hide();
          });

        })
        .error(function(data, status) {
          $ionicPopup.alert({title: 'Alert',template: 'Unable to fetch user info from google. Try again'});
          $ionicLoading.hide();
        });
    }
    //Google plus login code end................

  }

})();

