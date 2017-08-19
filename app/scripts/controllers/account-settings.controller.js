(function () {

    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:AccountSettingsCtrl
     * @description
     * # AccountSettingsCtrl
     *
     * @param $scope
     * @param $rootScope
     * @param LocalStorageService
     * @param $ionicPopup
     * @param $translate
     * @param ApiService
     * @param $state
     * @constructor
     */
    function AccountSettingsCtrl($scope, $rootScope, LocalStorageService, $ionicPopup, $translate, ApiService, $state) {

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
         * Get form / profile data
         * @type {*}
         */
        function getUser() {
            var user = LocalStorageService.getItem('user');
            vm.form.email = user.email;
        }

        /**
         * Refresh data when this page is active, listen to the $ionicView.beforeEnter event:
         * http://ionicframework.com/docs/api/directive/ionView/
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            getUser();
        });

        /**
         * Save profile
         */
        vm.save = function () {

            console.info('*** Save Account => ', vm.form);

            var pwd1 = vm.form.password1;
            var pwd2 = vm.form.password2;

            // validate the passwords
            if(pwd1 !== pwd2) {
                vm.showPopup($translate.instant('error.alert'), $translate.instant('error.password-check'));
                return;
            }

            // get the current user
            var user = LocalStorageService.getItem('user');

            // update users email address
            user.email = vm.form.email;
            LocalStorageService.setItem('user', user);

            // prepare the params to submit
            var params = {
                id: user.id,
                email: vm.form.email
            };

            // if the password is not empty then add it to the request params
            if(pwd1 && pwd1 !== '') {
                params.new_password = pwd1;
            }

            // Update account
            ApiService.post('api/v1/update-account', params)
            // ApiService.get('xR5BeM/ce7cfe4ec8c2f8973524f75da71060317fba09f5/files/snippet.json', params)
                .then(function(response) {
                    // Account was successfully updated
                    console.info('ApiService account updated => ', response);
                    $state.go('app.profile');
                });
        };

		/**
		 * open popup for error messages
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
         * Save account settings event listener
         * @type {*|(function())}
         */
        vm.saveAccountSettingslistener = $rootScope.$on('saveAccountSettingsEvent', vm.save);

        $scope.$on('$destroy', vm.saveAccountSettingslistener);
    }

    AccountSettingsCtrl.$inject = [
        '$scope',
        '$rootScope',
        'LocalStorageService',
        '$ionicPopup',
        '$translate',
        'ApiService',
        '$state'
    ];

    angular
        .module('Shopeur')
        .controller('AccountSettingsCtrl', AccountSettingsCtrl);

})();
