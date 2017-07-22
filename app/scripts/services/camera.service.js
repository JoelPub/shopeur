(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:CameraService
     * @description
     * # CameraService
     *
     * @param $q
     * @param $cordovaFile
     * @param $cordovaCamera
     * @param $ionicLoading
     * @returns {{save: save, remove: remove, getImageUrl: getImageUrl, getImageDataURI: getImageDataURI}}
     * @constructor
     */
    function CameraService($q, $cordovaFile, $cordovaCamera, $ionicLoading) {

        var _profileImage = null;

        /**
         * Get a random string as filename to make sure the file has an unique name inside the data directory
         * @returns {string}
         */
        function randId() {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        /**
         * Get camera options by type
         * @param type
         * @returns {{destinationType: number, sourceType: *, allowEdit: boolean, encodingType: number, popoverOptions: Function, saveToPhotoAlbum: boolean}}
         */
        function getCameraOptionsByType(type) {
            var source;
            switch (type) {
                case 0:
                    source = Camera.PictureSourceType.CAMERA;
                    break;
                case 1:
                    source = Camera.PictureSourceType.PHOTOLIBRARY;
                    break;
            }
            return {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: source,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                cameraDirection: 1,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true

            };
        }

        /**
         * Get camera picture and save it
         * @param type
         * @param form
         * @returns {*}
         */
        function save(type, form) {
            return $q(function (resolve, reject) {
                var options = getCameraOptionsByType(type);

                $ionicLoading.show({
                    templateUrl: 'templates/loading/request.html',
                    delay: 500
                });

                $cordovaCamera.getPicture(options).then(function (imageURI) {

                    var path = imageURI.substr(0, imageURI.lastIndexOf('/') + 1);
                    var file = imageURI.substr(imageURI.lastIndexOf('/') + 1);

                    // Check if the image uri contains random param that needs to be deleted
                    if (file.indexOf('?') > -1) {
                        file = file.split('?')[0];
                    }

                    var newPath = cordova.file.dataDirectory;
                    var newFile = (form) ? 'user-' + form.user_id + '-image.jpg' : randId() + file;

                    $cordovaFile.moveFile(path, file, newPath, newFile)
                        .then(function (fileEntry) {
                            $ionicLoading.hide();
                            resolve(fileEntry);
                        }, function (error) {
                            $ionicLoading.hide();
                            console.warn('$cordovaFile.copyFile error => ', error);
                            reject(error);
                    }
                    );
                }, function (error) {
                    console.warn('$cordovaCamera.getPicture error => ', error);
                    $ionicLoading.hide();
                    reject(error);
                });
            });
        }

        /**
         * Remove image from local file system
         * @param image
         */
        function remove(image) {
            console.info('Remove local profile image => ', image);
            $cordovaFile.removeFile(cordova.file.dataDirectory, image)
                .then(function (success) {
                    console.info('$cordovaFile.removeFile successfully => ', success);
                }, function (error) {
                    console.warn('$cordovaFile.removeFile error => ', error);
                });
        }

        /**
         * Download remote file
         * Usage:
         * - Add and save plugin to config.xml "ionic plugin add cordova-plugin-file-transfer --save"
         * - Inject $cordovaFileTransfer, ApiService and LocalStorageService
         */
        /*function download() {

            var remoteHost = ApiService.baseApiUrl();
            var remotePath = LocalStorageService.getItem('remote_file_path');
            var remoteUrl = remoteHost + '/' + remotePath + '/' + _profileImage;
            var localFile = cordova.file.dataDirectory + _profileImage;

            $cordovaFileTransfer.download(remoteUrl, localFile,
                function(entry) {
                    console.info('Download success => ', entry);

                },
                function(error) {
                    console.warn('Download error => ', error);
                });
        }*/

        /**
         * Returns the fallback image
         * @returns {string}
         */
        function getFallbackImage() {
            return 'assets/images/avatar.jpg';
        }

        /**
         * Resolve local profile image
         */
        function resolveLocalFile() {
            var defer = $q.defer();
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory + _profileImage,
                function (fileEntry) {
                    //console.info('resolveLocalFile successfully => ', fileEntry);
                    defer.resolve({
                        fileEntry: fileEntry,
                        image: fileEntry.nativeURL
                    });
                },
                function (event) {
                    console.warn('resolveLocalFile failed => ', event);
                    // TODO: handle missing file resolve it with fallback image, download remote profile image, see download() action above...
                    defer.resolve({
                        error: event,
                        image: getFallbackImage()
                    });
                });

            return defer.promise;
        }

        /**
         * Returns the local image url
         * @param image
         * @returns {*}
         */
        function getImageUrl(image) {

            _profileImage = image;
            var defer = $q.defer();

            // Check if on device and image is set
            if(typeof cordova !== 'undefined' && typeof image !== 'undefined') {
                resolveLocalFile()
                    .then(function(response) {
                        defer.resolve(response);
                    })
                    .catch(function(error) {
                        defer.reject(error);
                    });
            } else {
                defer.resolve({
                    image: 'assets/images/dummypic.jpg'
                });
            }

            return defer.promise;
        }

        /**
         * Returns the base64 data of the image
         * @param url
         */
        function getImageDataURI(url) {
            var defer = $q.defer();
            var image = new Image();
            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext('2d').drawImage(this, 0, 0);

                defer.resolve(canvas.toDataURL('image/jpeg', 1.0));
            };
            image.src = url;
            return defer.promise;
        }

        return {
            save: save,
            remove: remove,
            getImageUrl: getImageUrl,
            getImageDataURI: getImageDataURI,
            getFallbackImage: getFallbackImage
        };
    }

    CameraService.$inject = [
        '$q',
        '$cordovaFile',
        '$cordovaCamera',
        '$ionicLoading'
    ];

    angular
        .module('Shopeur')
        .factory('CameraService', CameraService);
})();