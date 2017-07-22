(function () {
    'use strict';

    /**
     * @ngdoc services
     * @name Shopeur.DbQueryService
     * @description
     * # DbQueryService
     *
     * @param $q
     * @param $filter
     * @param $translate
     * @param dbService
     * @returns {{create: (Function|*), update: (Function|*), getAll: (Function|*), getById: (Function|*), deleteById: (Function|*)}}
     * @constructor
     */
    function DbQueryService($q, $filter, $translate, dbService) {

        var self = this;
        self.insertId = null;

        /**
         * Create
         * @param table
         * @param model
         * @returns {Function|promise}
         */
        self.create = function (table, model) {
            var defer = $q.defer();

            if (!model.createdAt) {
                var format = ($translate.use() === 'de-DE') ? 'dd.MM.yyyy' : 'yyyy-MM-dd';
                model.createdAt = $filter('date')(new Date(), format);
                model.updatedAt = model.createdAt;
            }

            dbService.insert(table, [model])
                .then(function (result) {
                    console.info('dbService insert => ', result);
                    self.insertId = result[0].insertId;
                    self.getAll(table)
                        .then(function (data) {
                            defer.resolve(data);
                        })
                        .catch(function (error) {
                            defer.reject(error);
                        }
                    );
                })
                .catch(function (error) {
                    defer.reject(error);
                }
            );
            return defer.promise;
        };

        /**
         * Update
         * @param table
         * @param model
         * @returns {*}
         */
        self.update = function (table, model) {

            if (!model) {
                return false;
            }

            var _model = angular.copy(model);

            var format = ($translate.use() === 'de-DE') ? 'dd.MM.yyyy' : 'yyyy-MM-dd';
            _model.updatedAt = $filter('date')(new Date(), format);

            var columns = Object.keys(_model);
            columns.reverse();

            if (_model.id) {
                columns.pop();
            }

            columns = columns.toString() + '=?';
            columns = columns.replace(/,/g, '=?,');

            var values = Object.keys(_model).map(function (key) {
                return _model[key];
            });
            values.reverse();

            if (!_model.id) {
                values.push(self.insertId);
            }

            //console.log('BINDING => ', columns, values);

            var defer = $q.defer();
            dbService.query('UPDATE ' + table + ' SET ' + columns + ' WHERE id=?', values)
                .then(function () {
                    self.getAll(table)
                        .then(function (data) {
                            defer.resolve(data);
                        })
                        .catch(function (error) {
                            defer.reject(error);
                        }
                    );
                })
                .catch(function (error) {
                    console.warn('DB Query update error => ', error);
                    defer.reject(error);
                }
            );
            return defer.promise;
        };

        /**
         * Get all
         * @param table
         * @returns {*}
         */
        self.getAll = function (table) {
            var defer = $q.defer();
            dbService.query('SELECT * FROM ' + table + ' LIMIT ?', [99999])
                .then(function (result) {
                    var res = dbService.fetchAll(result);
                    defer.resolve(res);
                })
                .catch(function (error) {
                    defer.reject(error);
                }
            );
            return defer.promise;
        };

        /**
         * Get by id
         * @param table
         * @param id
         * @returns {*}
         */
        self.getById = function (table, id) {
            var defer = $q.defer();
            dbService.query('SELECT * FROM ' + table + ' WHERE id = ?', [id])
                .then(function (result) {
                    if (result.rows.length) {
                        var res = dbService.fetch(result);
                        defer.resolve(res);
                    } else {
                        defer.resolve();
                    }
                })
                .catch(function (error) {
                    defer.reject(error);
                }
            );
            return defer.promise;
        };

        /**
         * Delete by id
         * @param table
         * @param id
         * @returns {*}
         */
        self.deleteById = function (table, id) {
            var defer = $q.defer();
            dbService.query('DELETE FROM ' + table + ' WHERE id = ?', [id])
                .then(function () {
                    self.getAll(table)
                        .then(function (data) {
                            defer.resolve(data);
                        })
                        .catch(function (error) {
                            defer.reject(error);
                        }
                    );
                })
                .catch(function (error) {
                    defer.reject(error);
                }
            );
            return defer.promise;
        };

        /**
         * Public api
         */
        return {
            create: self.create,
            update: self.update,
            getAll: self.getAll,
            getById: self.getById,
            deleteById: self.deleteById
        };
    }

    DbQueryService.$inject = [
        '$q',
        '$filter',
        '$translate',
        'dbService'
    ];

    angular
        .module('Shopeur')
        .factory('DbQueryService', DbQueryService);

})();
