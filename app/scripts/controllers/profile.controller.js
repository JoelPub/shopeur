(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:ProfileCtrl
     * @description
     * # ProfileCtrl
     *
     * @param $scope
     * @param ProfileService
     * @constructor
     */
    function ProfileCtrl($scope, ProfileService) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * User profile
         * @type {null}
         */
        vm.profile = null;

        /**
         * User avatar
         * @type {string}
         */
        vm.avatar = '';

        /**
         * User welcome message
         * @type {string}
         */
        vm.message = '';

        /**
         * User name by locale, forename and surname, otherwise the username (email) will be used
         * en, de   => forename surname
         * zh       => surname forename
         * @type {string}
         */
        vm.localeName = '';

        /**
         * Selected colors from profile
         * @type {null}
         */
        vm.colors = null;

        /**
         * Refresh data when this page is active, listen to the $ionicView.beforeEnter event:
         * http://ionicframework.com/docs/api/directive/ionView/
         */
        $scope.$on('$ionicView.beforeEnter',
            function () {

                vm.message = ProfileService.getMessage();

                ProfileService.getProfile()
                    .then(function (response) {
                        vm.profile = response.profile;
                        vm.avatar = response.image  + '?rand=' + new Date().getTime();
                        vm.localeName = ProfileService.getLocaleName();
                        vm.colors = response.colors;
                    });
            }
        );
    }

    ProfileCtrl.$inject = [
        '$scope',
        'ProfileService'
    ];

    angular
        .module('Shopeur')
        .controller('ProfileCtrl', ProfileCtrl);

})();
