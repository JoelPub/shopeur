(function () {

    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:SettingsCtrl
     * @description
     * # SettingsCtrl
     *
     * @param $state
     * @param $window
     * @param $ionicLoading
     * @param AuthenticateService
     * @param PouchDBService
     * @param LocalStorageService
     * @param AppDBService
     * @constructor
     */
    function SettingsCtrl($state, $window, $ionicLoading, AuthenticateService, PouchDBService, LocalStorageService, AppDBService) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Set cache to false in the state configuration in order to
         * always get the cuerrent value
         * @type {*}
         */
        vm.isLoggedIn = AuthenticateService.keepLoggedIn();

        /**
         * Toggle stay logged in
         */
        vm.loggedToggleChange = function () {
            AuthenticateService.keepLoggedIn(vm.isLoggedIn);
        };

        /**
         * Logout handler
         */
        vm.logout = function () {
            AuthenticateService.logout();
            $state.go('app.welcome');
        };

        /**
         * Reset local couch db
         */
        vm.dbReset = function () {

            $ionicLoading.show({
                templateUrl: 'templates/loading/request.html',
                delay: 500
            });

            PouchDBService.destroy()
                .then(function () {
                    return AppDBService.destroy();
                })
                .then(function () {
                    // delete settings from the local storage
                    LocalStorageService.setItem('access_token', null);
                    LocalStorageService.setItem('profile', {});
                    LocalStorageService.setItem('settings.keepLoggedId', null);

                    // navigate to the welcome site and reload
                    // for a fresh start
                    $state.go('app.welcome').then(function () {
                        $window.location.reload(true);
                    });
                })
                .catch(function (error) {
                    console.warn('CouchDB destroy error => ', error);
                }
            );
        };

        /**
         * Sync local couch db
         */
        vm.dbSync = function() {
            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html',
                delay: 500
            });

            PouchDBService.sync()
                .then(function () {
                    $ionicLoading.hide();
                })
                .catch(function(error) {
                    console.warn('Sync error...', error);
                });
        };

    }

    SettingsCtrl.$inject = [
        '$state',
        '$window',
        '$ionicLoading',
        'AuthenticateService',
        'PouchDBService',
        'LocalStorageService',
        'AppDBService'
    ];

    angular
        .module('Shopeur')
        .controller('SettingsCtrl', SettingsCtrl);

})();
