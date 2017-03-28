#!/usr/bin/env bash

sudo rm lfdev-checkin.apk
#cordova build android --release
ionic cordova:build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore wgbn.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk wgbn
sudo /home/walter/Android/Sdk/build-tools/25.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk lfdev-checkin.apk
