angular.module("eliteApp", ["ionic", "angular-data.DSCacheFactory", 'ngCordova'])


.run(function ($ionicPlatform, DSCacheFactory, $cordovaPush, $cordovaDialogs, $rootScope, $http, $cordovaDevice, apictrl) {
    // $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    //if (window.cordova && window.cordova.plugins.Keyboard) {
    //    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //}
    //if (window.StatusBar) {
    //    // org.apache.cordova.statusbar required
    //    StatusBar.styleDefault();
    //}

    // Push Notification
    document.addEventListener("deviceready", function () {


        var pushNotification = window.plugins.pushNotification;
        console.log(pushNotification);
        if (ionic.Platform.isAndroid()) {
            pushNotification.register(
                successHandler,
                errorHandler,
                {
                    senderID: "774696930133",
                    ecb: "window.onNotificationGCM"
                });
        } 
        else if (ionic.Platform.isIOS()) {
            pushNotification.register(
              successHandler,
              errorHandler,
              {
                  "badge": "true",
                  "sound": "true",
                  "alert": "true",
                  ecb: "window.onNotifationAPN"
              });
        }

        function successHandler(result) {
            console.log("device registered : " + result);
        }
        // result contains any error description text returned from the plugin call
        function errorHandler(error) {
            console.log('error when registering device : ' + error);
        }
    });
    window.onNotificationGCM = function (e) {
        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    console.log("Regid " + e.regid);
                    //Post
                    var device = {
                        Token: e.regid,
                        Platform: $cordovaDevice.getPlatform(),
                        UdId: $cordovaDevice.getUUID(),
                        OsVersion: $cordovaDevice.getVersion()
                    }
                    apictrl.postdeviceinfo(device);
                }
                break;

            case 'message':
                if (e.foreground) {
                    $cordovaDialogs.alert(e.payload.message, "Push Notification Received");
                    // on Android soundname is outside the payload.
                    // On Amazon FireOS all custom attributes are contained within payload
                    //var soundfile = e.soundname || e.payload.sound;
                    //if the notification contains a soundname, play it.
                    // var my_media = new Media("/android_asset/www/" + soundfile);
                    // my_media.play();
                }
                else {  // otherwise we were launched because the user touched a notification in the notification tray.
                    if (e.coldstart) {
                        console.log("notification is in coldstart");
                        //JSON.stringify(e.payload.msgcnt);
                        //alert("touch notification tray");
                        $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    }
                    else {
                        console.log("notification is in notification tray");
                        //JSON.stringify(e.payload.msgcnt);
                        //alert("touch notification tray");
                        $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                    }
                }
                console.log("notification is in notification tray for gcm or amazon");
                //alert(e.payload.msgcnt);
                $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                ////Only works for GCM
                $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                ////Only works on Amazon Fire OS
                //$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
                break;

            case 'error':
                console.log("ERROR -> MSG: " + e.msg);
                //alert('<li>ERROR -> MSG:' + e.msg + '</li>');
                break;

            default:
                console.log("Unknown, an event was received and we do not know what it is");
                //alert('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                break;
        }
    }

    window.onNotifationAPN = function (e) {

        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    alert.log("Regid " + e.regid);
                    //Post
                    var device = {
                        Token: e.regid,
                        Platform: $cordovaDevice.getPlatform(),
                        UdId: $cordovaDevice.getUUID(),
                        OsVersion: $cordovaDevice.getVersion()
                    }
                    apictrl.postdeviceinfo(device);
                }
                break;

            case 'message':
                if (e.foreground) {
                    $cordovaDialogs.alert(e.payload.message, "Push Notification Received");
                    // on Android soundname is outside the payload.
                    // On Amazon FireOS all custom attributes are contained within payload
                    //var soundfile = e.soundname || e.payload.sound;
                    //if the notification contains a soundname, play it.
                    // var my_media = new Media("/android_asset/www/" + soundfile);
                    // my_media.play();
                }
                else {  // otherwise we were launched because the user touched a notification in the notification tray.
                    if (e.coldstart) {
                        console.log("notification is in coldstart");
                        //JSON.stringify(e.payload.msgcnt);
                        //alert("touch notification tray");
                        $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    }
                    else {
                        console.log("notification is in notification tray");
                        //JSON.stringify(e.payload.msgcnt);
                        //alert("touch notification tray");
                        $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                    }
                }
                console.log("notification is in notification tray for gcm or amazon");
                //alert(e.payload.msgcnt);
                $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                ////Only works for GCM
                $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                ////Only works on Amazon Fire OS
                //$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
                break;

            case 'error':
                console.log("ERROR -> MSG: " + e.msg);
                //alert('<li>ERROR -> MSG:' + e.msg + '</li>');
                break;

            default:
                console.log("Unknown, an event was received and we do not know what it is");
                //alert('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                break;
        }
    }
})


.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            abstract: true,
            url: "/home",
            templateUrl: "www/app/home/home.html"
        })
        .state('home.mainpage', {
            url: "/mainpage",
            templateUrl: "www/app/home/mainpage.html"
        })
        .state('home.lecture', {
            url: "/lectures",
            templateUrl: "www/app/home/lecture.html"
        })
        .state('home.news', {
            url: "/news",
            templateUrl: "www/app/home/news.html"
        })
        .state('home.newsdisplay', {
            url: "/news/:id",
            templateUrl: "www/app/home/newsdisplay.html"
        })
        .state('home.viewlecture', {
            url: "/lecture/:id",
            templateUrl: "www/app/home/viewlecture.html"
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home/mainpage');

});