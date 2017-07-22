(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:TeaserService
     * @description
     * # TeaserService
     *
     * @returns {{
     *      getAll: getAll,
     *      remove: remove,
     *      getById: getById
     * }}
     *
     * @constructor
     */
    function TeaserService() {

        /**
         * Some fake testing data
         * @type {*[]}
         * @private
         */
        var _teasers = [{
            id: 0,
            text: 'Welcome to Shopeur. You can either start by adding a product to your wishlist or creating a new trip.',
            image: 'assets/images/erklaerscreen_home.jpg'
        }, {
            id: 1,
            text: 'Organize your trips - define destinations, shopping spots and your trip dates.',
            image: 'assets/images/erklaerscreen_trips.jpg'
        }, {
            id: 2,
            text: 'Add your disered product by uploading a picture and selecting brand and size.',
            image: 'assets/images/erklaerscreen_newproduct.jpg'
        }, {
            id: 3,
            text: 'Easily collect and manage your disered products in your personal wishlist.',
            image: 'assets/images/erklaerscreen_wishlist.jpg'
        }];

        /**
         * Get all teasers
         * @returns {*[]}
         */
        function getAll() {
            return angular.copy(_teasers);
        }

        /**
         * Remove given teaser
         * @param teaser
         */
        function remove(teaser) {
            _teasers.splice(_teasers.indexOf(teaser), 1);
        }

        /**
         * Get teaser by id
         * @param id
         * @returns {*}
         */
        function getById(id) {

            var filtered = _teasers.filter(function (teaser) {
                return teaser.id === id;
            });

            if (filtered.length > 0) {
                return angular.copy(filtered[0]);
            } else {
                return null;
            }
        }

        return {
            getAll: getAll,
            remove: remove,
            getById: getById
        };
    }

    TeaserService.$inject = [];

    angular
        .module('Shopeur')
        .factory('TeaserService', TeaserService);

})();