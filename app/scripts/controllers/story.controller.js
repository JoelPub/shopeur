(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:StoryCtrl
     * @description
     * # StoryCtrl
     *
     * @param $scope
     * @constructor
     */
    function StoryCtrl($scope) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Current story
         * @type {{}}
         */
        vm.story = {};

        /**
         * Refresh data when this page is active, listen to the $ionicView.beforeEnter event:
         * http://ionicframework.com/docs/api/directive/ionView/
         */
        $scope.$on('$ionicView.beforeEnter', function (event, data) {
            //console.debug('Story => ', data.stateParams.data);
            vm.story = data.stateParams.data;
        });
    }

    StoryCtrl.$inject = [
        '$scope'
    ];

    angular.module('Shopeur')
        .controller('StoryCtrl', StoryCtrl);

})();