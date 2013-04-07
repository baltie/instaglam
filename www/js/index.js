"use strict";

window.App = (function () {
    var me = this;
    
    function App() {        
        $("#cameraButton").on("click", $.proxy(this.onCameraButtonClick, this));

        if (typeof cordova !== "undefined" && cordova !== null) {
            $(document).on("deviceready", $.proxy(this.onDeviceReady, this));
        } else {
            this.onDeviceReady();
        }
    }

    App.prototype.onDeviceReady = function () {
        console.log("Device ready!");

        $(window).on("resize", $.proxy(this.onResize, this));
        this.onResize();
    };

    App.prototype.onResize = function () {
        console.log("resize");
        this.$imageCanvas = $("#imageCanvas");
        this.imageCanvas = this.$imageCanvas.get(0);
        this.$glamCanvas = $("#glamCanvas");
        this.glamCanvas = this.$glamCanvas.get(0);

        this.imageCanvas.style.width = Math.floor($(window).width()) + "px";
        this.imageCanvas.style.height = Math.floor($(window).height()) + "px";

        console.log($(window).width() + "," + $(window).height());
        console.log(this.$imageCanvas.width() + "," + this.$imageCanvas.height());
    };

    App.prototype.onCameraButtonClick = function () {
        console.log("Camera button click");
        navigator.camera.getPicture($.proxy(this.onPhotoSuccess, this), this.onPhotoFail, {
            quality: 90,
            destinationType: navigator.camera.DestinationType.FILE_URI
        });
    };

    App.prototype.onPhotoSuccess = function (imageUri) {
        var that = this;
        console.log("Uri: " + imageUri);

        this.imageObject = new window.Image();
        this.imageObject.onload = function () {
            console.log("Image size: " + this.width + "," + this.height);
            that.imageCanvas.width = this.width;
            that.imageCanvas.height = this.height;
            
            var ctx = that.imageCanvas.getContext("2d");
            ctx.drawImage(this, 0, 0, this.width, this.height);
        };
        this.imageObject.src = imageUri;
    };

    App.prototype.onPhotoFail = function(message) {
        console.error("Photo failed: " + message);
    };
    
    return App;
})();