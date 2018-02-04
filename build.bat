cordova build --release android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore E:\SocialApp\Code\mobi\platforms\android\build\outputs\apk\android-release-unsigned.apk mobilwoow

CD E:\android-sdk_r24.0.2-windows\android-sdk-windows\build-tools\20.0.0


zipalign -v 4 E:\SocialApp\Code\mobi\platforms\android\build\outputs\apk\android-release-unsigned.apk E:\SocialApp\Code\mobi\platforms\android\build\outputs\apk\Mobiwoow-Release-Signed-Aligened.apk


CD E:\SocialApp\Code\mobi