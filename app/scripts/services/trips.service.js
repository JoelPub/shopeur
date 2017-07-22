(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:TripsService
     * @description
     * # TripsService
     *
     * @param $q
     * @param $filter
     * @param $translate
     * @param AppDBService
     * @param PouchDBService
     * @param LocalStorageService
     * @returns {{getBrandById: getBrandById, getCountries: getCountries, getDestinationsByBrand: getDestinationsByBrand, getCitiesByCountry: getCitiesByCountry, getDestinationsByCity: getDestinationsByCity, create: create, update: update, remove: remove, groupByYearMonth: groupByYearMonth}}
     * @constructor
     */
    function TripsService($q, $filter, $translate, AppDBService, PouchDBService, LocalStorageService) {

        /**
         * Get current language key
         * @returns {string}
         */
        function getLanguage() {
            return $translate.use().substring(0, 2);
        }

        /**
         * Get cities by country id via design doc query
         * @param id
         * @returns {*}
         */
        function getCitiesByCountry(id) {
            var defer = $q.defer();
            PouchDBService.query('cities/by_country', {key: id})
                .then(function (response) {
                    var cities = $filter('orderBy')(response.rows, 'value.translations["' + getLanguage() + '"]["name"]', false);
                    defer.resolve(cities);
                })
                .catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }

        /**
         * Get all countries with cities
         * @returns {*|Function|promise}
         */
        function getCountries() {
            var defer = $q.defer();
            var options = {
                include_docs: true,
                startkey: 'Country-',
                endkey: 'Country-\uffff'
            };

            var countries = [];
            PouchDBService.allDocs(options)
                .then(function (response) {
                    countries = $filter('orderBy')(response.rows, 'doc.translations["' + getLanguage() + '"]["name"]', false);

                    var promises = [];
                    countries.forEach(function (country) {
                        promises.push(getCitiesByCountry(country.doc.id));
                    });

                    return $q.all(promises);
                })
                .then(function(response) {
                    countries.forEach(function (country, key) {
                        country.cities = response[key];
                        country.destinations = [];
                    });

                    defer.resolve(countries);
                })
                .catch(function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        /**
         * Get destination by city id via design doc query
         * @param id
         * @returns {*}
         */
        function getDestinationsByCity(id) {
            var defer = $q.defer();
            PouchDBService.query('destinations/by_city', {key: id})
                .then(function (response) {
                    var destinations = $filter('orderBy')(response.rows, 'value.translations["' + getLanguage() + '"]["location"]', false);
                    defer.resolve(destinations);
                })
                .catch(function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        /**
         * Get stores by destination id via design doc query
         * @param id
         * @returns {*}
         */
        function getStoresByDestination(id) {
            return PouchDBService.query('stores/by_destination', {key: id});
        }

        /**
         * Get countries with destinations by brandId, if brandId is not set get all available destinations
         * @param brandId
         * @returns {promise}
         */
        function getDestinationsByBrand(brandId) {

            var defer = $q.defer();
            var countries = [];

            getCountries()
                .then(function (response) {
                    countries = response;
                    countries.forEach(function (country) {
                        country.cities.forEach(function (city) {
                            getDestinationsByCity(city.value.id)
                                .then(function (destinations) {
                                    destinations.forEach(function (destination) {
                                        getStoresByDestination(destination.value.id)
                                            .then(function (stores) {
                                                stores.rows.forEach(function (store) {

                                                    if(country.destinations.includes(destination)) {
                                                        return;
                                                    }

                                                    if (destination.value.id === store.value.destination_id) {
                                                        if (store.value.brand_id === brandId || brandId === null) {
                                                            country.destinations.push.apply(country.destinations, [destination]);
                                                        }
                                                    }
                                                });
                                            });
                                    });
                                });
                        });
                    });

                    defer.resolve(countries);
                })
                .catch(function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        /**
         * Get city by id via design doc query
         * @param id
         * @returns {Function|promise}
         */
        function getCityById(id) {
            var defer = $q.defer();
            PouchDBService.query('city/by_id', {key: id})
                .then(function (response) {
                    defer.resolve(response.rows[0]);
                })
                .catch(function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        /**
         * Get country by id via design doc query
         * @param id
         * @returns {Function|promise}
         */
        function getCountryById(id) {
            var defer = $q.defer();
            PouchDBService.query('country/by_id', {key: id})
                .then(function (response) {
                    defer.resolve(response.rows[0]);
                })
                .catch(function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        /**
         * Get brand by id via design doc query
         * @param id
         * @returns {*}
         */
        function getBrandById(id) {
            return PouchDBService.query('brand/by_id', {key: id});
        }

        /**
         * set the translations of the trip. currently
         * only the name of the city is translated
         *
         * @param trip
         * @returns {{}}
         */
        function getTripTranslations(trip) {
            var date = $filter('date')(trip.startDate, 'MM/dd/yyyy');
            var cityTranslations = trip.city.value.translations;
            var tripTranslations = {};
            for (var key in cityTranslations) {
                /* jshint -W069 */
                tripTranslations[key] = {};
                tripTranslations[key]['longName'] = cityTranslations[key]['name'] + ' ' + (date ? date : '');
            }
            return tripTranslations;
        }

        /**
         * Create shopping trip and put into local db
         * @param trip
         */
        function create(trip) {

            var defer = $q.defer();

            var valid = true;
            valid = trip.country ? true : false;
            valid = trip.city ? true : false;
            valid = trip.destination ? true : false;
            //valid = trip.startDate ? true : false;
            //valid = trip.endDate ? true : false;

            // Only save the trip if the data are complete
            if (!valid) {
                defer.reject('Trip data not complete!');
                return defer.promise;
            }

            trip._id = 'Trip-' + chance.hash({length: 16, casing: 'upper'});
            trip.created = new Date();
            trip.type = 'trip';
            trip.stores = [];
            trip.brands = [];
            trip.preorders = [];

            // Set trip translations
            trip.translations = getTripTranslations(trip);

            // Store the current user id
            var user = LocalStorageService.getItem('user');
            trip.user = user.id;

            // Set the default status to 0
            trip.status = 0;

            // If no start date is set remove date properties
            if(!trip.startDate) {
                delete trip.startDate;
            }

            // If no end date is set remove date properties
            if(!trip.endDate) {
                delete trip.endDate;
            }

            getStoresByDestination(Number(trip.destination.value.id))
                .then(function (response) {
                    var promises = [];
                    for (var i = 0; i < response.rows.length; i++) {
                        var row = response.rows[i];
                        trip.stores.push(row.value);
                        promises.push(getBrandById(row.value.brand_id));
                    }
                    //console.log('stores', trip.stores);
                    return $q.all(promises);
                })
                .then(function (response) {
                    //console.log('brands', response);
                    for (var i = 0; i < response.length; i++) {
                        var brand = response[i].rows[0].value;
                        brand.store = trip.stores[i];
                        trip.brands.push(brand);
                    }
                    return AppDBService.put(trip);
                })
                .then(function (response) {
                    defer.resolve(response);
                })
                .catch(function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        /**
         * Update an existing shopping trip
         * @param trip
         */
        function update(trip) {
            // Set trip translations
            trip.translations = getTripTranslations(trip);
            return AppDBService.put(trip);
        }

        /**
         * Delete an existing shopping trip
         * @param trip
         */
        function remove(trip) {
            return AppDBService.deleteItem(trip);
        }

        /**
         * Group the trips by their year month
         */
        function groupByYearMonth(trips) {
            var tripGroups = {};
            for (var i = 0; i < trips.length; i++) {

                var trip = trips[i];
                var startDate = new Date(trip.doc.startDate);

                /**
                 * Months ranges from 0 - 11
                 * Workaround for the 1st day of the month
                 * TODO: Improve date
                 */
                startDate.setDate(startDate.getUTCDay() + 2);
                var month = startDate.getUTCMonth() + 1;
                var year = startDate.getUTCFullYear();

                var key = (trip.doc.startDate) ? year + '/' + month : $translate.instant('trips.planned');

                if (!tripGroups[key]) {
                    var currentDate = new Date();
                    currentDate.setUTCFullYear(year);
                    currentDate.setUTCMonth(month - 1);
                    currentDate.setDate(0);

                    tripGroups[key] = {
                        title: key,
                        timestamp: (trip.doc.startDate) ? currentDate.getTime() : 0,
                        trips: []
                    };
                }
                tripGroups[key].trips.push(trip);
            }

            var groups = [];
            for (var tripGroup in tripGroups) {
                var group = tripGroups[tripGroup];
                group.trips = $filter('orderBy')(group.trips, 'doc.startDate', false);
                groups.push(group);
            }

            return $filter('orderBy')(groups, 'timestamp', false);
        }

        return {
            getBrandById: getBrandById,
            getCountryById: getCountryById,
            getCountries: getCountries,
            getDestinationsByBrand: getDestinationsByBrand,
            getCityById: getCityById,
            getCitiesByCountry: getCitiesByCountry,
            getDestinationsByCity: getDestinationsByCity,
            getStoresByDestination: getStoresByDestination,
            create: create,
            update: update,
            remove: remove,
            groupByYearMonth: groupByYearMonth
        };
    }

    TripsService.$inject = [
        '$q',
        '$filter',
        '$translate',
        'AppDBService',
        'PouchDBService',
        'LocalStorageService'
    ];

    angular.module('Shopeur')
        .factory('TripsService', TripsService);
})();
