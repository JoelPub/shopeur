(function () {

    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:SignUpCtrl
     * @description
     * # SignUpCtrl
     *
     * @param $state
     * @param SignupService
     * @param $ionicPopup
     * @param $ionicLoading
     * @param $translate
     * @constructor
     */
    function SignUpCtrl($state, SignupService, $ionicPopup, $ionicLoading, $translate) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Form model
         * @type {{}}
         */
        vm.user = {};

        /**
         * Create account
         */
        vm.createAccount = function () {

            var pwd1 = vm.user.password1;
            var pwd2 = vm.user.password2;

            if (pwd1 !== pwd2) {
                vm.showPopup($translate.instant('error.alert'), $translate.instant('error.password-check'));
                return;
            }

            $ionicLoading.show({
                templateUrl: 'templates/loading/server.html',
                delay: 500
            });

            vm.user.password = vm.user.password1;
            delete vm.user.password1;
            delete vm.user.password2;

            SignupService.register(vm.user)
                .then(function () {
                    $ionicLoading.hide();
                    vm.showPopup('', $translate.instant('signup.success')).then(function () {
                        $state.go('app.login');
                    });
                })
                .catch(function (err) {
                    $ionicLoading.hide();

                    // check if the error contains a data object
                    // if not just show the global error message
                    if (err.data) {
                        vm.showErrorMessage(err.data);
                    } else {
                        vm.showPopup('ERROR', $translate.instant('global.error'));
                    }
                });
        };

        /**
         * Show error message coming from the
         * registration process
         * @param data
         */
        vm.showErrorMessage = function (data) {
            var msg = '';
            for (var key in data) {
                msg += data[key] + '<br/>';
            }

            $translate('error.alert')
                .then(function (value) {
                    vm.showPopup(value, msg);
                }
            );
        };

        /**
         * Go to the login state
         */
        vm.login = function () {
            $state.go('app.login');
        };

        /**
         * Show popup message and return a promise
         * @param title
         * @param msg
         * @returns $q promise
         */
        vm.showPopup = function (title, msg) {
            return $ionicPopup.alert({
                title: title,
                template: msg,
                okType: 'button-calm'
            });
        };
    }

    SignUpCtrl.$inject = [
        '$state',
        'SignupService',
        '$ionicPopup',
        '$ionicLoading',
        '$translate'
    ];

    angular
        .module('Shopeur')
        .controller('SignUpCtrl', SignUpCtrl);

})();