(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:TripCtrl
     * @description
     * # TripCtrl
     *
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $timeout
     * @param $translate
     * @param $ionicLoading
     * @param $ionicPopup
     * @param ProductService
     * @param TripsService
     * @constructor
     */
    function TripCtrl($scope, $rootScope, $state, $timeout, $translate, $ionicLoading, $ionicPopup, ProductService, TripsService) {

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
         * Is in edit mode flag
         * @type {boolean}
         */
        vm.editMode = false;

        /**
         * Selectable brands
         * @type {Array}
         */
        vm.brands = [];

        /**
         * Selectable destinations
         * @type {Array}
         */
        vm.destinations = [];

        /**
         * The minimum value for a date fields at midnight.
         * @type {Date}
         */
        vm.minDate = new Date().toISOString().substring(0, 10);

        /**
         * Current trip in edit mode
         * @type {null}
         * @private
         */
        var _trip = null;

        /**
         * Open a modal select box directive
         * The $timeout is for smoother transition and will run an $apply to the cycle if necessary
         * @param selector
         */
        function openSelect(selector) {
            if($state.params.data && $state.params.data.brand) {
                $timeout(function() {
                    var select = document.querySelector(selector);
                    angular.element(select).triggerHandler('click');
                }, 250);
            }
        }

        /**
         * Check if is a valid date
         * @param date
         * @returns {boolean}
         */
        function isValidDate(date) {
            return !isNaN(Date.parse(date));
        }

        $scope.$on('$ionicView.beforeEnter', function () {
            //console.debug('Trip state params => ', $stateParams.data, data.stateParams.data, $state.params.data);

            vm.form = {};
            vm.brands = [];
            vm.destinations = [];

            vm.editMode = ($state.params.data && $state.params.data.doc) ? true : false;

            ProductService.getBrands()
                .then(function (brands) {
                    TripsService.getStoresByDestination()
                        .then(function (stores) {
                            brands.forEach(function (brand) {
                                stores.rows.forEach(function (store) {
                                    if (brand.id === store.value.brand_id && !vm.brands.includes(brand)) {
                                        vm.brands.push(brand);
                                    }
                                });
                            });
                        });
                });

            if(vm.editMode) {
                _trip = $state.params.data;
                vm.form.brand = (_trip.doc.brand) ? _trip.doc.brand : null;
                vm.form.startDate = (_trip.doc.startDate) ? new Date(_trip.doc.startDate) : null;
                vm.form.endDate = (_trip.doc.endDate) ? new Date(_trip.doc.endDate) : null;
            } else {

                $ionicLoading.show({
                    templateUrl: 'templates/loading/sync.html',
                    delay: 500
                });

                var brandId = null;
                if($state.params.data && $state.params.data.brand) {
                    vm.form.brand = $state.params.data.brand;
                    brandId = $state.params.data.brand.id;
                }

                TripsService.getDestinationsByBrand(brandId)
                    .then(function(response) {
                        vm.destinations = response;
                        $timeout(function () {
                            $ionicLoading.hide();
                            openSelect('#destinationsSelect');
                        }, 3000);
                    });
            }

            $rootScope.$emit('editModeEvent', vm.editMode);
        });

        /**
         * Show messages
         * @param title
         * @param msg
         */
        vm.showPopup = function (title, msg) {
            $ionicPopup.alert({
                title: title,
                template: msg,
                okType: 'button-calm'
            });
        };

        /**
         * Create a new shopping trip
         */
        vm.create = function () {

            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html',
                delay: 500
            });

            TripsService.create(vm.form)
                .then(function () {
                    $ionicLoading.hide();
                    if($state.params.data && $state.params.data.brand) {
                        $state.go('app.product', {
                            data: {
                                brand: $state.params.data.brand,
                                product: $state.params.data.product,
                                imageURI: $state.params.data.imageURI,
                                tripId: vm.form._id
                            }
                        });
                    } else {
                        $state.go('app.trips');
                    }
                })
                .catch(function (error) {
                    console.warn('Create trip error => ', error);
                    $ionicLoading.hide();
                    vm.showPopup($translate.instant('global.hint'), $translate.instant('global.incomplete-data'));
                });
        };

        /**
         * Update an existing shopping trip
         */
        vm.update = function () {
            //console.log('update trip => ', _trip.doc, vm.form);

            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html',
                delay: 500
            });

            // Check if brand is changed
            if(!angular.equals(_trip.doc.brand, vm.form.brand)) {
                _trip.doc.brand = vm.form.brand;
            }

            // If 'startDate' is not a valid date remove it and do not update doc date properties
            if(!isValidDate(_trip.doc.startDate) && !isValidDate(vm.form.startDate)) {
                delete _trip.doc.startDate;
            } else {
                _trip.doc.startDate = vm.form.startDate;
            }

            // If 'endDate' is not a valid date remove it and do not update doc date properties
            if(!isValidDate(_trip.doc.endDate) && !isValidDate(vm.form.endDate)) {
                delete _trip.doc.endDate;
            } else {
                _trip.doc.endDate = vm.form.endDate;
            }

            TripsService.update(_trip.doc)
                .then(function () {
                    $ionicLoading.hide();
                    $state.go('app.trips');
                })
                .catch(function (error) {
                    console.warn('TripsService update error => ', error);
                });
        };

        /**
         * Brand changed handler
         */
        vm.onBrandChanged = function () {
            console.debug('Brand changed => ', vm.form.brand);

            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html'
            });

            TripsService.getDestinationsByBrand(vm.form.brand.id)
                .then(function(response) {
                    $ionicLoading.hide();
                    vm.destinations = response;
                });
        };

        /**
         * Destination changed handler
         */
        vm.onDestinationChanged = function () {
            console.debug('Destination changed => ', vm.form.destination);

            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html',
                delay: 500
            });

            var id = vm.form.destination.value.city_id;
            TripsService.getCityById(id)
                .then(function(response) {
                    vm.form.city = response;
                    return TripsService.getCountryById(vm.form.city.value.country_id);
                })
                .then(function(response) {
                    vm.form.country = response;
                    $ionicLoading.hide();
                })
                .catch(function (error) {
                    $ionicLoading.hide();
                    console.warn('onDestinationChanged changed => ', error);
                });
        };

        /**
         * Create trip event listener
         * @type {*|(function())}
         */
        vm.createTripListener = $rootScope.$on('createTripEvent',
            function () {
                vm.create();
            }
        );

        /**
         * Update trip event listener
         * @type {*|(function())}
         */
        vm.updateTripListener = $rootScope.$on('updateTripEvent',
            function () {
                vm.update();
            }
        );

        /**
         * Get end date minimum
         * @returns {string}
         */
        vm.getEndDateMin = function() {

            if(!vm.form.startDate) {
                return false;
            }

            var startDate = vm.form.startDate;
            var timezoneOffset = Math.abs(startDate.getTimezoneOffset() / 60);
            startDate.setHours(timezoneOffset, 0, 0, 0);

            return startDate.toISOString().substring(0, 10);
        };

        /**
         * Watcher for "vm.form.startDate"
         * If "endDate" undefined or invalid date, change to "startDate"
         */
        $scope.$watch('vm.form.startDate', function () {
            if(isNaN(vm.form.endDate)) {
                vm.form.endDate = vm.form.startDate;
            }
        });

        /**
         * Watcher for "vm.form.endDate"
         * If "newValue" is undefined or invalid date, change to "startDate"
         */
        $scope.$watch('vm.form.endDate', function (newValue) {
            if (isNaN(newValue) && vm.form.startDate) {
                vm.form.endDate = vm.form.startDate;
            }
        });

        /**
         * Need to unbind listeners each time the $scope is destroyed
         */
        $scope.$on('$destroy', vm.createTripListener);
        $scope.$on('$destroy', vm.updateTripListener);
    }

    TripCtrl.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        '$timeout',
        '$translate',
        '$ionicLoading',
        '$ionicPopup',
        'ProductService',
        'TripsService'
    ];

    angular
        .module('Shopeur')
        .controller('TripCtrl', TripCtrl);

})();
