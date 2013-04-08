"use strict";

window.App = (function () {
    function App() {        
        $("#cameraButton").on("click", $.proxy(this.onCameraButtonClick, this));
        $("#glamButton").on("click", $.proxy(this.onGlamButtonClick, this));

        if (typeof cordova !== "undefined" && cordova !== null) {
            $(document).on("deviceready", $.proxy(this.onDeviceReady, this));
        } else {
            this.onDeviceReady();
        }
    }

    App.prototype.onDeviceReady = function () {
        console.log("Device ready!");

        this.image = document.getElementById("image");
        this.imageCanvas = document.createElement("canvas");
        
        $(window).on("resize", $.proxy(this.onResize, this));
        this.onResize();
    };

    App.prototype.onResize = function () {
        console.log("resize");

        this.image.style.visibility = "visible";
        this.image.style.width = Math.floor($(window).width()) + "px";
        this.image.style.height = Math.floor($(window).height()) + "px";
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

        this.imageObject = new window.Image();
        this.imageObject.onload = function () {
            that.imageCanvas.width = this.width;
            that.imageCanvas.height = this.height;
            
            var ctx = that.imageCanvas.getContext("2d");
            ctx.drawImage(this, 0, 0, this.width, this.height);

            that.copyCanvasToImage();
        };
        this.imageObject.src = imageUri;
    };

    App.prototype.onPhotoFail = function(message) {
        console.error("Photo failed: " + message);
    };
    
    App.prototype.onGlamButtonClick = function () {
        console.log("Glam button click");

        var tophatImage = document.getElementById("tophatImage");
        var targetWidth = this.imageCanvas.width * 0.8;
        var targetHeight = targetWidth * tophatImage.height / tophatImage.width;
        var x = (this.imageCanvas.width / 2.0) - (targetWidth / 2.0);

        var ctx = this.imageCanvas.getContext("2d");
        ctx.drawImage(tophatImage, x, 20, targetWidth, targetHeight);

        this.copyCanvasToImage();
    };

    App.prototype.copyCanvasToImage = function() {
        var dataUrl = this.imageCanvas.toDataURL("image/jpeg", 0.3);
        console.log("Data url (" + dataUrl.length + "): " + dataUrl.substr(0, 20));
        this.image.src = dataUrl;
    };

    return App;
})();