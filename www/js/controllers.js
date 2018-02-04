angular.module('starter.controllers', [])

  .controller('DashCtrl', function($scope,$rootScope, $state,$ionicPopup) {





  })


  /*
  .controller('MenuCtrl', function($scope, $state) {
    $scope.GoProfile= function () {
      $state.go('app.profile');
    }
    $scope.GoHome= function () {
      $state.go('app.dash');
    }
    $scope.LogOut= function () {
      ionic.Platform.exitApp();
    }
  })
*/
  /*
  .controller('LoginCtrl', function($scope, $ionicHistory,$ionicPopup,$ionicSideMenuDelegate, $state, $q, FaceBookUserService,FaceBookService,GoogleUserService,$ionicLoading, $location,$http, UserService,GoogleService, $cordovaOauth,$ionicHistory) {

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

  })
   */


  /*
 .controller('TextToCtrl', function($scope,$ionicLoading,$timeout,$state,TextToService,$ionicHistory) {

    $scope.textToDetail={};

    $scope.goBack=function(){
      $ionicHistory.goBack();
    };

     TextToService.getTextTo().then(function(resp) {
       if (resp !== undefined && resp !== null) {
         if (resp.data !== undefined && resp.data !== null) {
           if(resp.data.length>0)
           {
             $scope.textToDetail= resp.data[0];
           }
         }
       }
     });

      $scope.saveTextTo=function(){

        $ionicLoading.show({template: 'Saving data...'});

        TextToService.saveTextTo($scope.textToDetail).then(function(resp) {
          if (resp !== undefined && resp !== null) {
            if (resp.data !== undefined && resp.data !== null) {

              if(resp.data==true)
              {
                $ionicLoading.hide();
              }
            }
          }
        });
      }
  })

*/
/*
    .controller('PhotoCtrl', function($http,$scope,$cordovaCamera,$ionicHistory,MediaService,ResourceProvider,$state) {

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


        ft.onprogress = function(progressEvent) {
          if (progressEvent.lengthComputable) {
            loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
          } else {
            loadingStatus.increment();
          }
        };


     //   fileLocalPath=FILE_URI;

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

})

*/

  /*
  .controller('PhotoDetailsCtrl', function($scope,$cordovaCamera,$ionicHistory,MediaService,ResourceProvider,$state,$stateParams,$ionicPopup) {

    $scope.getPhotoDetails=function(mediaid){
      MediaService.getMediaDetails(mediaid).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            $scope.imgFullPath=ResourceProvider.MEDIA_PATH + "/"+ resp.data.mediapath ;
            $scope.mediaDetails=resp.data;
          }
        }
      });
    };

    var mediaid=$stateParams.photoId;

    $scope.getPhotoDetails(mediaid);

    $scope.goBack=function(){
      $state.go('app.photo');
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
                $state.go('app.photo', {}, {reload: true});
              }
            }
          });
          //service end
        }
      });

    };
    //delete photo end

  })

  */
/*
  .controller('AudioCtrl', function($http,$scope,$cordovaCamera,MediaManager,$ionicHistory,MediaService,ResourceProvider,$state,$ionicPopup,$ionicLoading) {

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


  })


  .controller('AudioDetailsCtrl', function($http,$scope,MediaService) {


  })

  //video controllers
  .controller('VideoCtrl', function($http,$scope,MediaManager,MediaService,$ionicHistory,ResourceProvider,$cordovaCamera,$ionicLoading,$state) {

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

  })

  .controller('VideoDetailsCtrl', function($http,$scope,$state,$ionicHistory,MediaManager,video,ngVideoOptions,ngVideoPlaylist,$stateParams,MediaService,ResourceProvider,$ionicPopup) {

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

  })



  .controller('GeoCtrl', function($http,$scope,$cordovaCamera,$ionicHistory,MediaService,ResourceProvider,$state,$ionicLoading) {

    $scope.photos=[];

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
        params.mediaType = "4";

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


         ft.onprogress = function(progressEvent) {
         if (progressEvent.lengthComputable) {
         loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
         } else {
         loadingStatus.increment();
         }
         };


        fileLocalPath=FILE_URI;

        $ionicLoading.show({ template: 'Uploading...'});
        ft.upload(FILE_URI, encodeURI(ResourceProvider.MEDIA_API), win, fail, options);

      }, function(err) {
          $ionicLoading.hide();
      });

    }

    var win = function (resp) {
      $ionicLoading.hide();
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

  })


  .controller('GeoDetailsCtrl', function($scope,$cordovaCamera,$timeout,$ionicLoading,$ionicHistory,MediaService,ResourceProvider,$state,$stateParams,$ionicPopup,locationFactory) {

      navigator.geolocation.getCurrentPosition(setCurrentPosition, showGPSError, {
        maximumAge: 30000,
        timeout: 10000,
        enableHighAccuracy: false
      });

    function setCurrentPosition (position) {

      $scope.latitude=position.coords.latitude;
      $scope.longitude=position.coords.longitude;

      locationFactory.setLocation(position.coords.latitude, position.coords.longitude);
      createMap(locationFactory.getLocation());
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
      $ionicPopup.confirm({
        title: "GPS Error",
        cssClass: "background-color: #4BAF33",
        content: content
      });
    };

    var createMap = function(locationInformation) {

      $timeout(function(){

          var myLatlng = new google.maps.LatLng(locationInformation.Latitude, locationInformation.Longitude);
          var mapOptions = {
            center: myLatlng,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          var map = new google.maps.Map(document.getElementById("map"), mapOptions);
          map.setCenter(new google.maps.LatLng(locationInformation.Latitude, locationInformation.Longitude));
          map.setOptions({draggable: false});

         createMarker(map, locationInformation.Latitude, locationInformation.Longitude);
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


    };


    $scope.getPhotoDetails=function(mediaid){

      $ionicLoading.show({ template: 'Downloading photo...'});

      MediaService.getMediaDetails(mediaid).then(function (resp) {
        if (resp !== undefined && resp !== null) {
          if (resp.data !== undefined && resp.data !== null) {
            $scope.imgFullPath=ResourceProvider.MEDIA_PATH + "/"+ resp.data.mediapath ;
            $scope.mediaDetails=resp.data;
          }
        }
        $ionicLoading.hide();
      });
    };

    var mediaid=$stateParams.geoId;

    $scope.getPhotoDetails(mediaid);

    $scope.goBack=function(){
      $state.go('app.photo');
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
                $state.go('app.photo', {}, {reload: true});
              }
            }
          });
          //service end
        }
      });

    };
    //delete photo end

  })

  .controller('AssignCtrl', function($http,$scope,$state,$ionicHistory) {

    $scope.goBack=function(){
      $ionicHistory.goBack();
    };

    $scope.addAssign =function  (){
      $state.go('app.addassign');
    };

    $scope.assignDetails =function  (assignid){
      $state.go('app.assigndetails',{ assignid:assignid});
    };

  })

  .controller('AddAssignCtrl', function($http,$scope,$ionicHistory) {

    $scope.goBack=function(){
      $ionicHistory.goBack();
    };

  })
 */

;
