(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:TripDetailCtrl
     * @description
     * # TripDetailCtrl
     *
     * @param $q
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $ionicPopup
     * @param $ionicLoading
     * @param $translate
     * @param ProductService
     * @param PreorderService
     * @param TripsService
     * @param AppDBService
     * @constructor
     */
    function TripDetailCtrl($q, $scope, $rootScope, $state, $ionicPopup, $ionicLoading, $translate, ProductService, PreorderService, TripsService, AppDBService) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Brand group list
         * @type {Array}
         */
        vm.brandGroups = [];

        /**
         * Current trip on update
         */
        vm.trip = null;

        /**
         * Update product list view model
         */
        function updateProductList() {

            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html',
                delay: 500
            });

            ProductService.getProductsByTrip(vm.trip)
                .then(function (response) {
                    vm.brandGroups = ProductService.groupByBrand(vm.trip.doc.brands, response);
                    $ionicLoading.hide();
                })
                .catch(function(error) {
                    console.warn('Get products by trip error => ', error);
                    $ionicLoading.hide();
                });
        }

        /**
         * Helper func for showing dialog
         * @param title
         * @param msg
         */
        function showPopup(title, msg) {
            $ionicPopup.alert({
                title: title,
                template: msg,
                okType: 'button-calm'
            });
        }

        /**
         * Check if trip has products and start / end date
         * @returns {boolean}
         */
        function isValidTrip() {

            if (!vm.trip.doc.startDate || !vm.trip.doc.endDate) {
                showPopup($translate.instant('global.hint'), $translate.instant('tripdetail.no-date'));
                return false;
            }

            if (!PreorderService.countProducts()) {
                showPopup($translate.instant('global.hint'), $translate.instant('tripdetail.no-products'));
                return false;
            }

            return true;
        }

        /**
         * On before enter view handler
         * Set trip and update trip product list
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            //console.debug('Trip detail state params => ', $stateParams.data, data.stateParams.data, $state.params.data);

            if($state.params && $state.params.data) {

                vm.trip = $state.params.data;

                if(!vm.trip.doc.preorders) {
                    vm.trip.doc.preorders = [];
                }

                updateProductList();
            } else {
                $state.go('app.trips');
            }
        });

        /**
         * Edit the trip
         */
        vm.edit = function () {
            $state.go('app.trip', {data: vm.trip});
        };

        /**
         * Delete the trip
         * Remove the products from the deleted trip
         * so they will be listed in the wishlist again
         */
        vm.delete = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: $translate.instant('global.confirm'),
                template: $translate.instant('trips.confirm-delete'),
                okType: 'button-calm',
                cancelType: 'button-red'
            });

            confirmPopup
                .then(function (res) {
                    if (res) {

                        $ionicLoading.show({
                            templateUrl: 'templates/loading/sync.html',
                            delay: 500
                        });

                        TripsService.remove(vm.trip.doc)
                            .then(function () {
                                return ProductService.removeProductsFromTrip(vm.trip);
                            })
                            .then(function () {
                                $ionicLoading.hide();
                                $state.go('app.trips');
                            });
                    } else {
                        // Return empty promise
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    }
                });
        };

        /**
         * Attach a new product to the trip
         */
        vm.addProduct = function () {
            vm.editMode = false;
            $rootScope.$emit('editModeEvent', vm.editMode);
            $state.go('app.product', {data: vm.trip});
        };

        /**
         * Edit an existing product
         * @param item
         */
        vm.editProduct = function (item) {
            vm.editMode = true;
            $rootScope.$emit('editModeEvent', vm.editMode);
            $state.go('app.product', {data: item});
        };

        /**
         * Delete a product from the shopping trip
         * @param item
         */
        vm.deleteProduct = function (item) {
            var confirmPopup = $ionicPopup.confirm({
                title: $translate.instant('global.confirm'),
                template: $translate.instant('product.confirm-delete'),
                okType: 'button-calm',
                cancelType: 'button-red'
            });

            confirmPopup
                .then(function (res) {
                    console.info('deleteProduct => ', item.doc, item, res);
                    if (res) {

                        $ionicLoading.show({
                            templateUrl: 'templates/loading/sync.html',
                            delay: 500
                        });

                        AppDBService.deleteItem(item.doc)
                            .then(function () {
                                $ionicLoading.hide();
                                updateProductList();
                            });
                    } else {
                        $ionicLoading.hide();
                    }
                });
        };

        /**
         * Send product pre-order grouped by brand
         * @param group
         */
        vm.preorder = function (group) {
            console.info('* pre-order => ', group);

            PreorderService.setProducts([group]);

            if(!isValidTrip()) {
                return;
            }

            var confirmPopup = $ionicPopup.confirm({
                title: $translate.instant('tripdetail.preorder-confirmation-title'),
                template: $translate.instant('tripdetail.preorder-confirmation-description', {
                    numProducts: PreorderService.countProducts(),
                    cost: PreorderService.countPreorderCost()
                }),
                okText: $translate.instant('global.ok'),
                okType: 'button-calm',
                cancelText: $translate.instant('global.cancel'),
                cancelType: 'button-red'
            });

            confirmPopup
                .then(function (response) {
                    if (response) {
                        console.info('** Send pre-order => ', response);

                        $ionicLoading.show({
                            templateUrl: 'templates/loading/server.html',
                            delay: 500
                        });

                        PreorderService.send(vm.trip)
                            .then(function (response) {
                                console.info('***** Update trip details => ', response);

                                // Set the trip status to 1
                                //vm.trip.doc.status = 1;

                                // Set trip pre-orders
                                vm.trip.doc.preorders.push({
                                    brand: group.brand,
                                    products: group.products,
                                    user_trip_id: response.data.user_trip_id
                                });

                                // Set the trip / order id
                                //vm.trip.doc.user_trip_id = response.data.user_trip_id;

                                //console.debug('Before trip update => ', vm.trip);
                                return TripsService.update(vm.trip.doc);
                            })
                            .then(function (response) {
                                console.info('****** Pre-order complete => ', response);

                                $ionicLoading.hide();

                                //$state.go('app.home');
                                $rootScope.$broadcast('preorderCompleteEvent', {trip: vm.trip});
                            })
                            .catch(function (error) {
                                console.warn('****** Pre-order error => ', error);
                                $ionicLoading.hide();
                                showPopup('ERROR', $translate.instant('global.error'));
                            });
                    } else {
                        console.info('** Pre-order canceled...');
                    }
                });
        };

        /**
         * Open google map in system browser
         * @param latitude
         * @param longitude
         */
        vm.openMap = function(latitude, longitude) {
            window.open('http://maps.google.com/maps?t=m&q=loc:' + latitude + '+' + longitude, '_system');
        };
    }

    TripDetailCtrl.$inject = [
        '$q',
        '$scope',
        '$rootScope',
        '$state',
        '$ionicPopup',
        '$ionicLoading',
        '$translate',
        'ProductService',
        'PreorderService',
        'TripsService',
        'AppDBService'
    ];

    angular
        .module('Shopeur')
        .controller('TripDetailCtrl', TripDetailCtrl);

})();