(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:InspiredCtrl
     * @description
     * # InspiredCtrl
     *
     * @param $scope
     * @param $translate
     * @param InspiredService
     * @constructor
     */
    function InspiredCtrl($scope, $translate, InspiredService) {

        var vm = this;
        vm.inspirations = [];

        /**
         * Refresh data when this page is active, listen to the $ionicView.beforeEnter event:
         * http://ionicframework.com/docs/api/directive/ionView/
         */
        $scope.$on('$ionicView.beforeEnter',
            function () {
                vm.inspirations = InspiredService.getAll();
                //console.log(vm.inspirations);
            }
        );
    }

    InspiredCtrl.$inject = [
        '$scope',
        '$translate',
        'InspiredService'
    ];

    angular
        .module('Shopeur')
        .controller('InspiredCtrl', InspiredCtrl);

})();
