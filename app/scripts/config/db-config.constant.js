(function() {
    'use strict';

    /**
     * @ngdoc constant
     * @name Shopeur.DB_CONFIG
     * @description
     * # DB_CONFIG
     */
    angular.module('Shopeur')

        .constant('DB_CONFIG', {
            name: 'Shopeur',
            tables: {
                trips: {
                    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                    country: 'TEXT',
                    city: 'TEXT',
                    destination: 'TEXT',
                    startDate: 'DATE',
                    endDate: 'DATE',
                    createdAt: 'DATE',
                    updatedAt: 'DATE'
                },
                products: {
                    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                    trip: 'TEXT',
                    brand: 'TEXT',
                    category: 'TEXT',
                    color: 'TEXT',
                    size: 'TEXT',
                    code: 'TEXT',
                    amount: 'INTEGER',
                    image: 'TEXT',
                    createdAt: 'DATE',
                    updatedAt: 'DATE'
                }
            }
        });

})();