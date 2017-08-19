(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:ForgotPasswordCtrl
     * @description
     * # ForgotPasswordCtrl
     *
     * @param $state
     * @param ApiService
     * @param $translate
     * @param $ionicLoading
     * @param $ionicPopup
     * @constructor
     */
    function ForgotPasswordCtrl($state, ApiService, $translate, $ionicLoading, $ionicPopup) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * The trip form model
         * @type {{}}
         */
        vm.form = {};

        /**
         *
         * @type {boolean}
         */
        vm.success = false;

        /**
         * API call to recover password
         */
        vm.requestPassword = function () {

            $ionicLoading.show({
                templateUrl: 'templates/loading/server.html',
                delay: 500
            });

            ApiService.post('api/v1/recover', {email: vm.form.email}, {sendToken: false})
            // ApiService.get('69dGq7/a34a3c772988cc01d416be7ae51c76bafde4f797/files/snippet.json', {email: vm.form.email}, {sendToken: false})
                .then(function () {
                    $ionicLoading.hide();

                    // show the success message
                    vm.showPopup('', $translate.instant('forgotPassword.success')).then(function () {
                        $state.go('app.login');
                    });
                })
                .catch(function (err) {
                    $ionicLoading.hide();

                    // check if there is an error message contains a data object
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
         *
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
         * Go to login page
         */
        vm.login = function () {
            $state.go('app.login');
        };

        /**
         * Show popup message and return a promise
         *
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

    ForgotPasswordCtrl.$inject = [
        '$state',
        'ApiService',
        '$translate',
        '$ionicLoading',
        '$ionicPopup'
    ];

    angular.module('Shopeur')
        .controller('ForgotPasswordCtrl', ForgotPasswordCtrl);

})();
