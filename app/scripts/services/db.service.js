(function () {
    'use strict';

    /**
     * @ngdoc services
     * @name Shopeur.DbService
     * @description
     * # DbService
     *
     * @param $windowProvider
     * @returns {{prepare: Function, $get: *[]}}
     * @constructor
     */
    function DbService($windowProvider) {

        var self = this;

        var $window = $windowProvider.$get();

        var $injector = angular.injector(['ng']);
        var $q = $injector.get('$q');

        /**
         * DB object
         * @type {null}
         * @private
         */
        self._db = null;

        /**
         * DB configuration, db name and table schema
         * @type {{name: string, tables: {}}}
         * @private
         */
        self._config = {
            name: '',
            tables: {}
        };

        /**
         * Init service, create db and tables
         */
        self.init = function () {

            if ($window.sqlitePlugin) {
                self._db = $window.sqlitePlugin.openDatabase({name: self._config.name});
            } else if ($window.openDatabase) {
                self._db = $window.openDatabase(self._config.name, '1.0', self._config.name + ' database', 100 * 1024 * 1024);
            }

            for (var tableName in self._config.tables) {
                var defs = [];
                var columns = self._config.tables[tableName];
                for (var columnName in columns) {
                    var type = columns[columnName];
                    defs.push(columnName + ' ' + type);
                }
                var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + defs.join(', ') + ', UNIQUE(id) ON CONFLICT IGNORE)';
                self.query(sql);
            }

            console.info('WebSQL db ready...', self._config);
        };

        /**
         * Insert data
         * @param tableName
         * @param data
         * @returns {*}
         */
        self.insertAll = function (tableName, data) {

            var defer = $q.defer();

            var columns = [],
                bindings = [];

            for (var columnName in self._config.tables[tableName]) {
                columns.push(columnName);
                bindings.push('?');
            }

            var sql = 'INSERT INTO ' + tableName + ' (' + columns.join(', ') + ') VALUES (' + bindings.join(', ') + ')';

            var promises = [];

            for (var i = 0; i < data.length; i++) {
                var values = [];
                for (var j = 0; j < columns.length; j++) {
                    var value = (data[i][columns[j]] === undefined) ? null : data[i][columns[j]];
                    values.push(value);
                }
                promises.push(self.query(sql, values));
            }

            $q.all(promises).then(function (arr) {
                defer.resolve(arr);
            });

            return defer.promise;
        };

        /**
         * Query execution
         * @param sql
         * @param bindings
         * @returns {*}
         */
        self.query = function (sql, bindings) {

            bindings = typeof bindings !== 'undefined' ? bindings : [];
            var deferred = $q.defer();

            if (!self._db) {
                deferred.reject(new Error('WebSQL connection not available!'));
            } else {
                self._db.transaction(function (transaction) {
                    //console.log('executeSql sql', sql, bindings);
                    transaction.executeSql(sql, bindings, function (transaction, result) {
                        //console.log('executeSql', result);
                        deferred.resolve(result);
                    }, function (transaction, error) {
                        //console.log('executeSql error', error);
                        deferred.reject(error);
                    });
                });
            }

            return deferred.promise;
        };

        /**
         * Fetch all data
         * @param result
         * @returns {Array}
         */
        self.fetchAll = function (result) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }

            return output;
        };

        /**
         * Fetch single row
         * @param result
         * @returns {*}
         */
        self.fetch = function (result) {
            return result.rows.item(0);
        };

        return {
            prepare: function (config) {
                console.info('WebSQL db prepare...');
                self._config = config;
                self.init();
            },
            $get: function () {
                return {
                    query: self.query,
                    fetch: self.fetch,
                    fetchAll: self.fetchAll,
                    insert: self.insertAll
                };
            }
        };

    }

    DbService.$inject = [
        '$windowProvider'
    ];

    angular
        .module('Shopeur')
        .provider('dbService', DbService);

})();
