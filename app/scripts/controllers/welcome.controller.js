(function () {

    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller: WelcomeCtrl
     * @description
     * # WelcomeCtrl
     *
     * @param $state
     * @param TeaserService
     * @param PouchDBService
     * @param $ionicLoading
     * @param $scope
     * @param $ionicSlideBoxDelegate
     * @param AuthenticateService
     * @constructor
     */
    function WelcomeCtrl($state, TeaserService, PouchDBService, $ionicLoading, $scope, $ionicSlideBoxDelegate, AuthenticateService) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * HowTo / teaser list
         * @type {null}
         */
        vm.teasers = null;

        /**
         * Refresh data when this page is active, listen to the $ionicView.beforeEnter event:
         * http://ionicframework.com/docs/api/directive/ionView/
         */
        $scope.$on('$ionicView.beforeEnter',
            function () {

                $ionicLoading.show({
                    templateUrl: 'templates/loading/sync.html',
                    delay: 500
                });

                vm.teasers = TeaserService.getAll();
                $ionicSlideBoxDelegate.update();

                PouchDBService.sync()
                    .then(function () {
                        $ionicLoading.hide();
                        if (AuthenticateService.keepLoggedIn()) {
                            $state.go('app.home');
                        }
                    });
            }
        );

        /**
         * User login
         */
        vm.login = function () {
            $state.go('app.login');
        };

        /**
         * User sign up
         */
        vm.signup = function () {
            $state.go('app.sign-up');
        };

        /**
         * Slider has changed
         */
        vm.slideHasChanged = function () {

        };
    }

    WelcomeCtrl.$inject = [
        '$state',
        'TeaserService',
        'PouchDBService',
        '$ionicLoading',
        '$scope',
        '$ionicSlideBoxDelegate',
        'AuthenticateService'
    ];

    angular
        .module('Shopeur')
        .controller('WelcomeCtrl', WelcomeCtrl);

})();