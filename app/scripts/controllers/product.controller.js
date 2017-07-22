(function () {

    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:ProductCtrl
     * @description
     * # ProductCtrl
     *
     * @param $q
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $translate
     * @param $ionicActionSheet
     * @param $ionicLoading
     * @param $ionicPopup
     * @param $ionicScrollDelegate
     * @param ProductService
     * @param CameraService
     * @param AppDBService
     * @param LocalStorageService
     * @param LanguageService
     * @param StateHistoryService
     * @constructor
     */
    function ProductCtrl($q, $scope, $rootScope, $state, $translate, $ionicActionSheet, $ionicLoading, $ionicPopup, $ionicScrollDelegate, ProductService, CameraService, AppDBService, LocalStorageService, LanguageService, StateHistoryService) {

        /**
         * View model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Form model
         * @type {null}
         */
        vm.form = {};

        /**
         * Saved trips
         * @type {null}
         */
        vm.trips = null;

        /**
         * Brands to select
         */
        vm.brands = null;

        /**
         * All categories
         * @type {null}
         */
        vm.categories = null;

        /**
         * All colors
         * @type {null}
         */
        vm.colors = null;

        /**
         * Image file path
         * @type {string}
         */
        vm.imageURI = '';

        /**
         *
         * @type {null}
         */
        vm.product = null;

        /**
         * Edit mode status
         * @type {boolean}
         */
        vm.editMode = false;

        /**
         * Default product header src
         * @type {string}
         */
        vm.defaultImgSrc = null;

        /**
         * Returns an empty element item
         * to set a product back to the wishlist
         */
        function getWishlistItem() {
            var languageKeys = LanguageService.getAll();
            var wishlistItem = {
                id: null,
                doc: {
                    translations: {}
                }
            };

            languageKeys.map(function (langKey) {
                var shortKey = langKey.substring(0, 2);
                wishlistItem.doc.translations[shortKey] = {
                    longName: $translate.instant('menu.wishlist', null, null, langKey)
                };
            });

            return wishlistItem;
        }

        /**
         * Set the product values
         */
        function setProductValues() {
            //console.info('setProductValues => ', $state.params.data);

            vm.editMode = ($state.params.data.doc) ? true : false;

            vm.product = $state.params.data.doc;

            vm.brands = vm.product.trip ? vm.product.trip.doc.brands : vm.brands;
            vm.form.selectedTrip = vm.product.trip;
            vm.form.selectedBrand = vm.product.brand;
            vm.form.selectedCategory = vm.product.category;
            //vm.form.selectedColor = vm.product.color;
            vm.form.size = vm.product.size;
            vm.form.productCode = vm.product.productCode;
            vm.form.image = vm.product.image;
            vm.imageURI = vm.product.imageURI + '?rand=' + new Date().getTime();

            // Get all trips with status 0 => not pre ordered
            ProductService.getTrips(vm.product.brand.id, 0)
                .then(function (res) {
                    // add the wishlist item to the trips list
                    res.unshift(getWishlistItem());
                    vm.trips = res;
                });
        }

        /**
         * Set the trip where the new product should be attached to
         */
        function setTripValues() {
            vm.brands = $state.params.data.doc.brands;
            vm.form.selectedTrip = $state.params.data;
        }

        /**
         * Get trip from "vm.trips" by id
         * @param id
         * @returns {*}
         */
        function getTripById(id) {
            return vm.trips.find(function (trip) {
                return trip.id === id;
            }, 0);
        }

        /**
         * Helper func to adjust the scroll view.
         * it is used after the user have set some values in to the form
         */
        function adjustScrollView() {
            $ionicScrollDelegate.scrollBy(0, 100, true);
        }

        /**
         * Handle action sheet selection
         * @param type
         */
        function addImageByType(type) {

            $scope.hideSheet();
            var defer = $q.defer();

            CameraService.save(type)
                .then(function (response) {
                    defer.resolve(response);
                })
                .catch(function (error) {
                    defer.reject(error);
                }
            );

            return defer.promise;
        }

        /**
         * Handle photo / library
         * @param index
         */
        function clickHandler(index) {
            addImageByType(index)
                .then(function (fileEntry) {
                    vm.form.image = fileEntry.name;
                    CameraService.getImageUrl(fileEntry.name)
                        .then(function (response) {
                            vm.imageURI = response.image  + '?rand=' + new Date().getTime();
                        })
                        .catch(function (error) {
                            // Local file not found, set fallback image
                            vm.imageURI = error.image  + '?rand=' + new Date().getTime();
                        });
                })
                .catch(function (error) {
                    console.warn('CameraService save error => ', error);
                }
            );
        }

        /**
         * Show aler messages
         * @param title
         * @param msg
         */
        function showAlert(title, msg) {
            $ionicPopup.alert({
                title: title,
                template: msg,
                okType: 'button-calm'
            });
        }

        /**
         * Refresh data when this page is active, listen to the $ionicView.beforeEnter event:
         * http://ionicframework.com/docs/api/directive/ionView/
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            console.debug('Product beforeEnter => ', $state.params.data);

            vm.form = {};
            vm.imageURI = '';

            ProductService.getCategories()
                .then(function (response) {
                    vm.categories = response.rows;
                });

            ProductService.getBrands()
                .then(function (response) {
                    //console.log('getBrands => ', response);
                    vm.brands = response;

                    // Get all trips with status 0 => not pre ordered
                    return ProductService.getTrips(null, 0);
                })
                .then(function (response) {
                    //console.log('getTrips => ', response);

                    // Add the wish-list item to the trips list
                    response.unshift(getWishlistItem());
                    vm.trips = response;

                    if ($state.params.data && $state.params.data.doc) {
                        var docType = $state.params.data.doc.type;
                        if (docType === 'product') {
                            setProductValues();
                        } else if (docType === 'trip') {
                            setTripValues();
                        }
                    } else if ($state.params.data && $state.params.data.brand && $state.params.data.tripId) {
                        vm.form.selectedBrand = $state.params.data.brand;
                        vm.form.selectedTrip = getTripById($state.params.data.tripId);
                        vm.brands = vm.form.selectedTrip.doc.brands;

                        if($state.params.data.product && $state.params.data.product.image && $state.params.data.imageURI) {
                            vm.form.image = $state.params.data.product.image;
                            vm.imageURI = $state.params.data.imageURI + '?rand=' + new Date().getTime();
                        }
                    }

                    // Set default image source here to prevent view / image flickering
                    if(!vm.form.selectedBrand) {
                        vm.defaultImgSrc = 'assets/images/dresses.jpg';
                    }
                });
        });

        /**
         * Brands changed handler
         */
        vm.onBrandsChanged = function () {
            console.debug('onBrandsChanged => ', vm.form.selectedBrand);

            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html',
                delay: 500
            });

            var brandId;
            if (vm.form.selectedBrand) {
                brandId = vm.form.selectedBrand.id;
            }

            // Get all trips with status 0 => not pre ordered
            ProductService.getTrips(brandId, 0)
                .then(function (res) {
                    res.unshift(getWishlistItem());
                    vm.trips = res;
                    $ionicLoading.hide();
                });

            adjustScrollView();
        };

        /**
         * Trips changed handler
         */
        vm.onTripsChanged = function () {
            console.debug('onTripsChanged => ', vm.form.selectedTrip);

            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html',
                delay: 500
            });

            // wishlist selection
            if (vm.form.selectedTrip.id === null) {
                vm.form.selectedTrip = null;

                ProductService.getBrands()
                    .then(function (response) {
                        vm.brands = response;
                        $ionicLoading.hide();
                    });
            } else {
                vm.brands = vm.form.selectedTrip.doc.brands;
                $ionicLoading.hide();
            }

            adjustScrollView();
        };

        /**
         * Categories changed handler
         */
        vm.onCategoriesChanged = function () {
            adjustScrollView();
        };

        /**
         * Colors changed handler
         */
        vm.onColorsChanged = function () {
            adjustScrollView();
        };

        /**
         * Delete product image
         */
        vm.delete = function () {
            CameraService.remove(vm.form.image);
            vm.form.image = null;
            vm.imageURI = '';
            vm.save();
        };

        /**
         * Slide-up pane to choose picture from camera or library
         */
        vm.select = function () {
            $scope.hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: $translate.instant('camera-options.take-photo')},
                    {text: $translate.instant('camera-options.from-library')}
                ],
                titleText: $translate.instant('camera-options.add-image'),
                cancelText: $translate.instant('camera-options.cancel'),
                buttonClicked: clickHandler
            });
        };

        /**
         * Create product
         * @returns {boolean}
         */
        vm.create = function () {

            if (!vm.form.selectedBrand || !vm.imageURI && !vm.form.productCode) {
                showAlert($translate.instant('global.hint'), $translate.instant('global.incomplete-data'));
                return false;
            }

            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html',
                delay: 500
            });

            CameraService.getImageUrl(vm.form.image)
                .then(function (response) {
                    var imageUrl = response.image;
                    var imageName = imageUrl.split('/').pop();
                    var user = LocalStorageService.getItem('user');

                    var product = {
                        _id: 'Product-' + chance.hash({length: 16, casing: 'upper'}),
                        created: new Date(),
                        type: 'product',
                        status: 0,
                        trip: vm.form.selectedTrip,
                        brand: vm.form.selectedBrand,
                        category: vm.form.selectedCategory,
                        size: vm.form.size,
                        productCode: vm.form.productCode,
                        imageURI: imageUrl + '?rand=' + new Date().getTime(),
                        image: imageName,
                        user: user.id
                    };

                    AppDBService.put(product)
                        .then(function () {
                            $ionicLoading.hide();

                            var trip = vm.form.selectedTrip;
                            if (!trip) {
                                $state.go('app.wishlist');
                            } else {
                                $state.go('app.trip-detail', {data: trip});
                            }
                        })
                        .catch(function (error) {
                            console.warn('Save product error => ', error);
                            $ionicLoading.hide();
                            showAlert($translate.instant('global.create'), $translate.instant('global.error'));
                        }
                    );
                });
        };

        /**
         * Update product
         */
        vm.update = function () {

            $ionicLoading.show({
                templateUrl: 'templates/loading/sync.html',
                delay: 500
            });

            CameraService.getImageUrl(vm.form.image)
                .then(function (response) {

                    if (response.error || response.image === 'assets/images/dummypic.jpg' && !vm.form.productCode) {
                        $ionicLoading.hide();
                        showAlert($translate.instant('global.hint'), $translate.instant('global.incomplete-data'));
                        return false;
                    }

                    vm.imageURI = response.image + '?rand=' + new Date().getTime();

                    var user = LocalStorageService.getItem('user');
                    var attributes = {
                        trip: vm.form.selectedTrip,
                        brand: vm.form.selectedBrand,
                        category: vm.form.selectedCategory,
                        size: vm.form.size,
                        productCode: vm.form.productCode,
                        imageURI: vm.imageURI,
                        image: vm.form.image,
                        status: vm.product.status,
                        type: vm.product.type,
                        user: user.id
                    };

                    AppDBService.update(vm.product._id, attributes)
                        .then(function () {
                            vm.product = null;
                            var trip = vm.form.selectedTrip;

                            $ionicLoading.hide();

                            if (!trip) {
                                $state.go('app.wishlist');
                            } else {
                                $state.go('app.trip-detail', {data: trip});
                            }
                        }).catch(function () {
                            $ionicLoading.hide();
                            showAlert($translate.instant('global.update'), $translate.instant('global.error'));
                        });
                })
                .catch(function(error) {
                    console.warn('Update product error => ', error);
                });
        };

        /**
         * Create product event listener
         * @type {*|(function())}
         */
        vm.createProductListener = $scope.$on('createProductEvent',
            function () {
                vm.create();
            }
        );

        /**
         * Update product event listener
         * @type {*|(function())}
         */
        vm.updateProductListener = $scope.$on('updateProductEvent',
            function () {
                vm.update();
            }
        );

        /**
         * Edit mode listener
         */
        vm.editModeListener = $rootScope.$on('editModeEvent',
            function (event, status) {
                vm.editMode = status;
            }
        );

        /**
         * Go and create a new trip
         */
        vm.createTrip = function () {
            $state.go('app.trip', {
                data: {
                    brand: vm.form.selectedBrand,
                    product: vm.form,
                    imageURI: vm.imageURI
                }
            });
        };

        /**
         * Cancel create / update
         */
        vm.goBack = function () {
            StateHistoryService.goBack();
        };

        /**
         * Need to unbind listeners each time the $scope is destroyed
         */
        $scope.$on('$destroy', vm.createProductListener);
        $scope.$on('$destroy', vm.updateProductListener);
        $scope.$on('$destroy', vm.editModeListener);
    }

    ProductCtrl.$inject = [
        '$q',
        '$scope',
        '$rootScope',
        '$state',
        '$translate',
        '$ionicActionSheet',
        '$ionicLoading',
        '$ionicPopup',
        '$ionicScrollDelegate',
        'ProductService',
        'CameraService',
        'AppDBService',
        'LocalStorageService',
        'LanguageService',
        'StateHistoryService'
    ];

    angular.module('Shopeur')
        .controller('ProductCtrl', ProductCtrl);
})();
