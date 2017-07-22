(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:TripsCtrl
     * @description
     * # TripsCtrl
     *
     * @param $q
     * @param ProductService
     * @param $scope
     * @param $state
     * @param TripsService
     * @param $ionicLoading
     * @param $ionicPopup
     * @param $translate
     * @param $rootScope
     * @constructor
     */
    function TripsCtrl($q, ProductService, $scope, $state, TripsService, $ionicLoading, $ionicPopup, $translate, $rootScope) {

        /**
         * View model
         * @type {Shopeur.controller}
         */
        var vm = this;

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
         * Tripps grouped by the year month
         * @type {Array}
         */
        vm.tripGroups = [];

        /**
         * Get all created trips
         */
        function getTrips() {
            ProductService.getTrips()
                .then(function (response) {
                    vm.tripGroups = TripsService.groupByYearMonth(response);
                }).catch(function (error) {
                    console.warn('ProductService get trips error => ', error);
                }
            );
        }

        /**
         * On before enter view handler
         * Get all trips
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            getTrips();
        });

        /**
         * Edit trip
         * @param trip
         */
        vm.edit = function (trip) {
            //alert('Edit trip: ' + trip.id);
            $state.go('app.trip', {data: trip});
        };

        /**
         * Go to trip detail view
         * @param trip
         */
        vm.show = function (trip) {
            //console.log('show trip', trip);
            $state.go('app.trip-detail', {data: trip});
        };

        /**
         * Delete trip
         * @param trip
         */
        vm.delete = function (trip) {
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

                        TripsService.remove(trip.doc)
                            .then(function () {
                                /**
                                 * Remove the products from the deleted trip
                                 * so they will be listed in the wishlist again
                                 */
                                return ProductService.removeProductsFromTrip(trip.id);
                            })
                            .then(function () {
                                getTrips();
                                $ionicLoading.hide();
                            });
                    } else {
                        // Return empty promise
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    }
                })
                .then(function () {
                    $ionicLoading.hide();
                });
        };

        /**
         * Add a new trip
         */
        vm.newTrip = function () {
            $state.go('app.trip');
        };

        /**
         * Listen to the main button events
         */
        $rootScope.$on('newTripEvent', vm.newTrip);
    }

    TripsCtrl.$inject = [
        '$q',
        'ProductService',
        '$scope',
        '$state',
        'TripsService',
        '$ionicLoading',
        '$ionicPopup',
        '$translate',
        '$rootScope'
    ];

    angular
        .module('Shopeur')
        .controller('TripsCtrl', TripsCtrl);

})();
