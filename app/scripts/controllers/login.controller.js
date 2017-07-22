(function () {

    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:LoginCtrl
     * @description
     * # LoginCtrl
     *
     * @param $state
     * @param AuthenticateService
     * @param $ionicPopup
     * @param $translate
     * @param $ionicLoading
     * @constructor
     */
    function LoginCtrl($state, AuthenticateService, $ionicPopup, $translate, $ionicLoading) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Login credentials
         * @type {{}}
         */
        vm.credentials = {};

        /**
         * Kepp logged in state
         * @type {*}
         */
        vm.keepLoggedIn = AuthenticateService.keepLoggedIn(true);

        /**
         * User authenticate
         */
        vm.go = function() {

            $ionicLoading.show({
                templateUrl: 'templates/loading/server.html',
                delay: 500
            });

            AuthenticateService.authenticate(vm.credentials)
                .then(function() {
                    $ionicLoading.hide();
                    $state.go('app.home');
                })
                .catch(function(err) {
                    $ionicLoading.hide();

                    // check if the error contains a data object
                    // if not just show the global error message
                    if(err.data) {
                        vm.showErrorMessage(err.data);
                    } else {
                        vm.showPopup('ERROR', $translate.instant('global.error'));
                    }
                });
        };

        /**
         * User forgot password
         */
        vm.forgot = function() {
            $state.go('app.forgot-password');
        };

        /**
         * User sign up
         */
        vm.signup = function() {
            $state.go('app.sign-up');
        };

		/**
		 * Show Dialog
         *
         * @param title
         * @param msg
         */
        vm.showPopup = function(title, msg) {
            $ionicPopup.alert({
                title: title,
                template: msg,
                okType: 'button-calm'
            });
        };

        /**
         * Show error message coming from the
         * login process
         * @param data
         */
        vm.showErrorMessage = function(data) {
            var msg = '';
            for(var key in data) {
                msg += data[key] + '<br/>';
            }

            $translate('error.alert')
                .then(function(value) {
                        vm.showPopup(value, msg);
                    }
                );
        };

        /**
         * Toggle the 'stay logged in' settings
         */
        vm.toggleStayLoggedIn = function() {
            AuthenticateService.keepLoggedIn(vm.keepLoggedIn);
        };
    }

    LoginCtrl.$inject = [
        '$state',
        'AuthenticateService',
        '$ionicPopup',
        '$translate',
        '$ionicLoading'
    ];

    angular
        .module('Shopeur')
        .controller('LoginCtrl', LoginCtrl);

})();