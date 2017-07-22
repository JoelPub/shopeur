(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:WishlistCtrl
     * @description
     * # WishlistCtrl
     *
     * @param $scope
     * @param $state
     * @param $rootScope
     * @param ProductService
     * @param AppDBService
     * @param $ionicPopup
     * @param $translate
     * @constructor
     */
    function WishlistCtrl($scope, $state, $rootScope, ProductService, AppDBService, $ionicPopup, $translate) {

        var vm = this;

        /**
         * Wishlist items
         * @type {null}
         */
        vm.products = null;

        /**
         * Show delete button in list
         * @type {boolean}
         */
        vm.showDelete = false;

        /**
         * Show reorder button in list
         * @type {boolean}
         */
        vm.showReorder = false;

        /**
         * Get wish list products
         * For now a product have to be assigned to a trip
         */
        function getProducts() {
            ProductService.getProducts()
                .then(function (response) {
                    vm.products = response;
                })
                .catch(function (error) {
                    console.warn('ProductService get products error => ', error);
                });
        }

        /**
         * On before enter view handler
         * Get all products
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            getProducts();
        });

        /**
         * Edit item
         * @param item
         */
        vm.edit = function (item) {
            vm.editMode = true;
            $rootScope.$emit('editModeEvent', vm.editMode);
            $state.go('app.product', {data: item});
        };

        /**
         * Tells productCtrl that editMode is true
         */
        vm.newProduct = function () {
            vm.editMode = false;
            $rootScope.$emit('editModeEvent', vm.editMode);
            $state.go('app.product', {data: null});
        };

        /**
         * Delete item
         * @param item
         */
        vm.delete = function (item) {

            var confirmPopup = $ionicPopup.confirm({
                title: $translate.instant('global.confirm'),
                template: $translate.instant('product.confirm-delete'),
                okType: 'button-calm',
                cancelType: 'button-red'
            });

            confirmPopup
                .then(function (res) {
                    if (res) {
                        vm.products.splice(vm.products.indexOf(item), 1);
                        AppDBService.deleteItem(item.doc);
                    }
                });
        };

        /**
         * Reorder item
         * @param item
         * @param fromIndex
         * @param toIndex
         */
        vm.reorder = function (item, fromIndex, toIndex) {
            vm.products.splice(fromIndex, 1);
            vm.products.splice(toIndex, 0, item);
        };

        // main button events
        $rootScope.$on('newProductEvent', vm.newProduct);
    }

    WishlistCtrl.$inject = [
        '$scope',
        '$state',
        '$rootScope',
        'ProductService',
        'AppDBService',
        '$ionicPopup',
        '$translate'
    ];

    angular
        .module('Shopeur')
        .controller('WishlistCtrl', WishlistCtrl);

})();
