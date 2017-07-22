(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:ProductService
     * @description
     * # ProductService
     *
     * @param $q
     * @param $filter
     * @param $translate
     * @param AppDBService
     * @param ProfileService
     * @param PouchDBService
     * @param LocalStorageService
     * @returns {{getTrips: getTrips, getBrands: getBrands, getCategories: getCategories, getColors: getColors, getProducts: getProducts, getProductsByTrip: getProductsByTrip, groupByBrand: groupByBrand, removeProductsFromTrip: removeProductsFromTrip}}
     * @constructor
     */
    function ProductService($q, $filter, $translate, AppDBService, ProfileService, PouchDBService, LocalStorageService) {

        /**
         * Get all shopping trips and filter by status if needed
         * Status: 0 => not pre ordered
         * Status: 1 => is pre ordered
         * Status: 2 => TBD
         *
         * @param brandId
         * @param status
         * @returns {Function|promise}
         */
        function getTrips(brandId, status) {
            var defer = $q.defer();
            var opt = {
                include_docs: true,
                startkey: 'Trip-',
                endkey: 'Trip-\uffff'
            };

            AppDBService.allDocs(opt)
                .then(function (res) {
                    var trips = [];
                    var user = LocalStorageService.getItem('user');
                    for (var i = 0; i < res.rows.length; i++) {
                        var row = res.rows[i];

                        // Check if the user is the owner of the trip
                        if (row.doc.user !== user.id) {
                            continue;
                        }

                        // Add only the trips with the given status param
                        if (status !== undefined && row.doc.status !== status) {
                            continue;
                        }


                        // Add the trip to the list if the brandId param is empty and
                        // the trip doesn't have any brands
                        // NOTE: no products can be attached to this trip then

                        if (row.doc.brands.length === 0 && !brandId) {
                            trips.push(row);
                        }

                        for (var j = 0; j < row.doc.brands.length; j++) {
                            var brand = row.doc.brands[j];

                            if (!brandId || (brandId === brand.id)) {
                                trips.push(row);
                                break;
                            }
                        }
                    }

                    defer.resolve(trips);
                });

            return defer.promise;
        }

        /**
         * Get all products
         * @returns {*}
         */
        function getProducts() {
            var defer = $q.defer();
            var opt = {
                include_docs: true,
                startkey: 'Product-',
                endkey: 'Product-\uffff'
            };

            var user = LocalStorageService.getItem('user');
            AppDBService.allDocs(opt)
                .then(function (res) {
                    var tmp = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        var row = res.rows[i];
                        if (row.doc.user !== user.id) {
                            continue;
                        }
                        tmp.push(row);
                    }
                    defer.resolve(tmp);
                })
                .catch(function (err) {
                    defer.reject(err);
                });

            return defer.promise;
        }

        /**
         * Get current language key
         * @returns {string}
         */
        function getLanguage() {
            return $translate.use().substring(0, 2);
        }

        /**
         * Get all brands order by title
         * @returns {*}
         */
        function getBrands() {
            var defer = $q.defer();
            var options = {
                include_docs: true,
                startkey: 'Brand-',
                endkey: 'Brand-\uffff'
            };

            PouchDBService.allDocs(options)
                .then(function (response) {
                    var rows = $filter('orderBy')(response.rows, 'doc.translations["' + getLanguage() + '"]["title"]', false);

                    var brands = [];
                    for (var i = 0; i < rows.length; i++) {
                        brands.push(rows[i].doc);
                    }

                    defer.resolve(brands);
                })
                .catch(function (err) {
                    defer.reject(err);
                });

            return defer.promise;
        }

        /**
         * Is pre ordered product
         * @param trip
         * @param product
         * @returns {*}
         */
        function isPreordered(trip, product) {

            var _isPreordered = false;
            var _found = null;

            trip.doc.preorders.forEach(function(preorder) {
                _found = preorder.products.find(function(obj) {
                    return (obj.id === product.id);
                });

                if(_found) {
                    _isPreordered = true;
                }
            });

            return _isPreordered;
        }

        /**
         * Get products by trip
         * @param trip
         * @returns {*} vm.trip.doc.preorders
         */
        function getProductsByTrip(trip) {

            var defer = $q.defer();
            var products = [];

            getProducts()
                .then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        var product = response[i];
                        if (product.doc.trip && product.doc.trip.id === trip.id && !isPreordered(trip, product)) {
                            products.push(product);
                        }
                    }
                    defer.resolve(products);
                });

            return defer.promise;
        }

        /**
         * Get all categories order by title
         * @returns {*|Function|promise}
         */
        function getCategories() {
            var defer = $q.defer();
            var options = {
                include_docs: true,
                startkey: 'Category-',
                endkey: 'Category-\uffff'
            };

            PouchDBService.allDocs(options)
                .then(function (response) {
                    defer.resolve({
                        rows: $filter('orderBy')(response.rows, 'doc.translations["' + getLanguage() + '"]["title"]', false)
                    });
                })
                .catch(function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        /**
         * Get all colors
         * @returns {*}
         */
        function getColors() {
            var defer = $q.defer();

            ProfileService.getColors()
                .then(function (response) {
                    defer.resolve(response);
                })
                .catch(function (error) {
                    console.warn('getColors error => ', error);
                }
            );

            return defer.promise;
        }

        /**
         * Group products by brand
         * @param brands
         * @param products
         */
        function groupByBrand(brands, products) {
            var res = [];
            for (var i = 0; i < brands.length; i++) {
                var tmp = {};
                tmp.brand = brands[i];
                tmp.products = [];
                for (var j = 0; j < products.length; j++) {
                    var p = products[j];
                    if (p.doc.brand.id === tmp.brand.id) {
                        tmp.products.push(p);
                    }
                }
                res.push(tmp);
            }

            return res;
        }

        /**
         * remove products that are attached to a trip.
         * so they can be listed in the wishlist after the trip is deleted
         * @param tripId
         */
        function removeProductsFromTrip(tripId) {
            var defer = $q.defer();
            getProductsByTrip(tripId)
                .then(function (response) {
                    var promises = [];
                    for (var i = 0; i < response.length; i++) {
                        var product = response[i];
                        delete product.doc.trip;
                        promises.push(AppDBService.put(product.doc));
                    }
                    return $q.all(promises);
                })
                .then(function () {
                    defer.resolve();
                });

            return defer.promise;
        }

        return {
            getTrips: getTrips,
            getBrands: getBrands,
            getCategories: getCategories,
            getColors: getColors,
            getProducts: getProducts,
            getProductsByTrip: getProductsByTrip,
            groupByBrand: groupByBrand,
            removeProductsFromTrip: removeProductsFromTrip
        };
    }

    ProductService.$inject = [
        '$q',
        '$filter',
        '$translate',
        'AppDBService',
        'ProfileService',
        'PouchDBService',
        'LocalStorageService'
    ];

    angular.module('Shopeur')
        .factory('ProductService', ProductService);
})();
