(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.services:NotificationService
     * @description
     * # NotificationService
     *
     * @returns {{
     *      getAll: Function,
     *      remove: Function,
     *      getById: Function
     * }}
     *
     * @constructor
     */
    function NotificationService($q, $translate, TripsService, ProductService) {

        /**
         * Next trip from today
         * @type {null}
         * @private
         */
        var _nextTrip = null;

        /**
         * Products on wishlist
         * @type {null}
         * @private
         */
        var _wishlistEntries = 0;

        /**
         * Trip list grouped by the year month
         * @type {null}
         * @private
         */
        var _tripGroups = [];

        /**
         * Get message by num entries, singular or plural / no entries
         * @param key
         * @param num
         * @returns {*}
         */
        function getMessageByNumEntries(key, num) {
            var message;
            switch (num) {
                case 1:
                    message = $translate.instant(key + '-singular', {count: num});
                    break;
                default:
                    message = $translate.instant(key + '-plural', {count: num});
                    break;
            }

            return message;
        }

        /**
         * Get message by num days, singular, plural or today
         * @param days
         * @returns {*}
         */
        function getMessageByNumDays(days) {
            var message;
            switch (days) {
                case 0:
                    message = $translate.instant('home.nextTrip-today', {count: days});
                    break;
                case 1:
                    message = $translate.instant('home.nextTrip-singular', {count: days});
                    break;
                default:
                    message = $translate.instant('home.nextTrip-plural', {count: days});
                    break;
            }

            return message;
        }

        /**
         * Get num messages
         * @returns {number}
         */
        function getNumMessages() {
            //TODO: get num messages
            return 0;
        }

        /**
         * Format date with time reset
         * @param date
         * @returns {number}
         */
        function formatDate(date) {
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        }

        /**
         * Set next trip
         * @param trip
         */
        function setNextTrip(trip) {
            var today = formatDate(new Date());
            var startDate = formatDate(new Date(trip.doc.startDate));

            if(!_nextTrip && startDate >= today) {
                _nextTrip = trip;
            }
        }

        /**
         * Get num days
         * @returns {number}
         */
        function getNumDays() {

            _nextTrip = null;
            for (var group in _tripGroups) {
                if (_tripGroups[group].trips) {
                    _tripGroups[group].trips.forEach(setNextTrip);
                }
            }

            if(!_nextTrip) {
                return false;
            }

            var today = new Date();
            var startDate = new Date(_nextTrip.doc.startDate);

            // one day in seconds => hours * minutes * seconds * milliseconds
            var day = 24 * 60 * 60 * 1000;

            return Math.round(Math.abs((today.getTime() - startDate.getTime()) / (day)));
        }

        /**
         * Filter products by trip and set wish list entries
         * @param object
         * @returns {boolean}
         */
        function filterProductsByTrip(object) {
            //console.log('filterProductsByTrip => ', object);
            if (object.doc.trip && typeof(object.doc.trip) !== null) {
                return true;
            } else {
                _wishlistEntries++;
                return false;
            }
        }

        /**
         * Get next trip from list
         * @returns {null}
         */
        function getNextTrip() {
            return _nextTrip;
        }

        /**
         * Get user notifications
         * @returns {Function|promise}
         */
        function getNotifications() {

            var defer = $q.defer();

            ProductService.getTrips()
                .then(function (response) {
                    _tripGroups = TripsService.groupByYearMonth(response);
                    return ProductService.getProducts();
                })
                .then(function (response) {
                    _wishlistEntries = 0;
                    response.filter(filterProductsByTrip);

                    var notifications = [];
                    var numMessages = getNumMessages();

                    if (numMessages) {
                        notifications.push({
                            id: 1,
                            type: '',
                            message: $translate.instant('home.messages') + getMessageByNumEntries('home.messages', numMessages)
                        });
                    }

                    if (_wishlistEntries) {
                        notifications.push({
                            id: 2,
                            type: 'wishlist',
                            message: $translate.instant('home.products') + getMessageByNumEntries('home.products', _wishlistEntries)
                        });
                    }

                    var numDays = getNumDays();
                    if (numDays !== false) {
                        notifications.push({
                            id: 3,
                            type: 'trip',
                            message: $translate.instant('home.nextTrip') + getMessageByNumDays(numDays)
                        });
                    }

                    defer.resolve(notifications);
                })
                .catch(function(error) {
                    defer.reject(error);
                });

            return defer.promise;
        }

        /**
         * Has a trip list
         * @returns {boolean}
         */
        function hasTriplistEntries() {
            return (getNumDays() !== false) ? true : false;
        }

        /**
         * Has items in wishlist
         * @returns {boolean}
         */
        function hasWishlistEntries() {
            return (_wishlistEntries) ? true : false;
        }

        return {
            getNextTrip: getNextTrip,
            getNotifications: getNotifications,
            hasTriplistEntries: hasTriplistEntries,
            hasWishlistEntries: hasWishlistEntries
        };
    }

    NotificationService.$inject = [
        '$q',
        '$translate',
        'TripsService',
        'ProductService'
    ];

    angular
        .module('Shopeur')
        .factory('NotificationService', NotificationService);

})();