(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:InspiredService
     * @description
     * # InspiredService
     *
     * @returns {{
     *      getAll: Function,
     *      remove: Function,
     *      getById: Function
     * }}
     *
     * @constructor
     */
    function InspiredService() {

        /**
         * Some fake testing data
         * @type {*[]}
         * @private
         */
        var _items = [{
            id: 0,
            image: 'assets/images/Zeitmeister-Sport-Herren-Automatik-versilbertes-Zifferblatt.jpg'
        }, {
            id: 1,
            image: 'assets/images/Wempe-Zeitmeister-Fliegeruhr-Keramik-Chronograph.jpg'
        }, {
            id: 2,
            image: 'assets/images/wempe-4_collier_420_594_01-e1438510305486.jpg'
        }, {
            id: 3,
            image: 'assets/images/Schiffsuhr-Quarzwerk-Tidenanzeige-arabische-Ziffern-Bremen-II-Wempe.jpg'
        }, {
            id: 4,
            image: 'assets/images/Presse_WM6500091.jpg'
        }, {
            id: 5,
            image: 'assets/images/79121-0.jpg'
        }, {
            id: 6,
            image: 'assets/images/603_Ring-Krone-BY-KIM.jpg'
        }, {
            id: 7,
            image: 'assets/images/406_Ring-Voyage-BY-KIM.jpg'
        }];

        /**
         * Get all items
         * @returns {*[]}
         */
        function getAll() {
            return angular.copy(_items);
        }

        /**
         * Remove given item
         * @param item
         */
        function remove(item) {
            _items.splice(_items.indexOf(item), 1);
        }

        /**
         * Get item by id
         * @param id
         * @returns {*}
         */
        function getById(id) {

            var filtered = _items.filter(function (item) {
                return item.id === id;
            });

            if (filtered.length > 0) {
                return angular.copy(filtered[0]);
            } else {
                return null;
            }

            /*for (var i = 0; i < _items.length; i++) {
             if (_items[i].id === parseInt(itemId)) {
             return _items[i];
             }
             }
             return null;*/
        }

        return {
            getAll: getAll,
            remove: remove,
            getById: getById
        };
    }

    InspiredService.$inject = [];

    angular
        .module('Shopeur')
        .factory('InspiredService', InspiredService);

})();