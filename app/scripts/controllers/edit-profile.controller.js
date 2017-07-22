(function () {

    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:EditProfileCtrl
     * @description
     * # EditProfileCtrl
     *
     * @param $q
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $ionicActionSheet
     * @param ProfileService
     * @param CameraService
     * @param $ionicLoading
     * @param $ionicPopup
     * @param $translate
     * @constructor
     */
    function EditProfileCtrl($q, $scope, $rootScope, $state, $ionicActionSheet, ProfileService, CameraService, $ionicLoading, $ionicPopup, $translate) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Available colors
         * @type {Array}
         */
        vm.colors = [];

        /**
         * Image file path
         * @type {string}
         */
        vm.imageURI = '';

        /**
         * Handle action sheet selection
         * @param type
         */
        function addImageByType(type) {

            $scope.hideSheet();
            var defer = $q.defer();

            CameraService.save(type, vm.form)
                .then(function (response) {
                    defer.resolve(response);
                })
                .catch(function (error) {
                    defer.reject(error);
                }
            );

            return defer.promise;
        }

        /**
         * Handle photo / library
         * @param index
         */
        function clickHandler(index) {
            addImageByType(index)
                .then(function (fileEntry) {
                    vm.form.image = fileEntry.name;
                    vm.imageURI = vm.form.imageURI = fileEntry.nativeURL  + '?rand=' + new Date().getTime();
                })
                .catch(function (error) {
                    console.warn('CameraService save error => ', error);
                }
            );
        }

        /**
         * Get form / profile data
         * @type {*}
         */
        function getProfile() {
            var defer = $q.defer();
            ProfileService.getProfile()
                .then(function (response) {
                    vm.form = response.profile;
                    vm.colors = response.colors;
                    vm.imageURI = response.image  + '?rand=' + new Date().getTime();
                })
                .catch(function (error) {
                    defer.reject(error);
                });
        }

        /**
         * Get selected colors
         * @returns {Array}
         */
        function getSelectedColors() {
            var ids = [];
            angular.forEach(vm.colors, function (color) {
                if (color.checked === true) {
                    this.push(color);
                }
            }, ids);

            return ids;
        }

        /**
         * Refresh data when this page is active, listen to the $ionicView.beforeEnter event:
         * http://ionicframework.com/docs/api/directive/ionView/
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            getProfile();
        });

        /**
         * Save profile
         * TODO: Validate and save data
         */
        vm.save = function () {

            $ionicLoading.show({
                templateUrl: 'templates/loading/server.html',
                delay: 500
            });

            vm.form.colors = getSelectedColors();

            ProfileService.saveProfile(vm.form)
                .then(function () {
                    $ionicLoading.hide();
                    $state.go('app.profile');
                })
                .catch(function (error) {
                    $ionicLoading.hide();

                    if (error.data && error.data.message) {
                        vm.showPopup(error.data.name, error.data.message);
                    } else {
                        vm.showPopup('ERROR', $translate.instant('global.error'));
                    }
                });
        };

        vm.showPopup = function (title, msg) {
            $ionicPopup.alert({
                title: title,
                template: msg,
                okType: 'button-calm'
            });
        };

        /**
         * Remove image from profile
         */
        vm.delete = function () {
            CameraService.remove(vm.form.image);
            vm.form.image = vm.form.imageURI = vm.imageURI = null;
        };

        /**
         * Slide-up pane to choose picture from camera or library
         */
        vm.select = function () {
            $scope.hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: $translate.instant('camera-options.take-photo')},
                    {text: $translate.instant('camera-options.from-library')}
                ],
                titleText: $translate.instant('camera-options.add-image'),
                cancelText: $translate.instant('camera-options.cancel'),
                buttonClicked: clickHandler
            });
        };

        /**
         * Save profile event listener
         * @type {*|(function())}
         */
        vm.saveProfilelistener = $rootScope.$on('saveProfileEvent',
            function () {
                vm.save();
            }
        );

        /**
         * Need to unbind listeners each time the $scope is destroyed
         */
        $scope.$on('$destroy', vm.saveProfilelistener);

    }

    EditProfileCtrl.$inject = [
        '$q',
        '$scope',
        '$rootScope',
        '$state',
        '$ionicActionSheet',
        'ProfileService',
        'CameraService',
        '$ionicLoading',
        '$ionicPopup',
        '$translate'
    ];

    angular
        .module('Shopeur')
        .controller('EditProfileCtrl', EditProfileCtrl);

})();
