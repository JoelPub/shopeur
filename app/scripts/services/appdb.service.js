(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:AppDBService
     * @description
     * # AppDBService local app couchdb service provider
     *
     * @constructor
     */
    function AppDBService() {

        /**
         * Pouch provider
         * @param $q
         * @returns {{deleteItem: deleteItem, allDocs: allDocs, update: update, query: query, put: put, destroy: destroy}}
         */
        this.$get = function ($q) {

            var _db = new PouchDB('appdb', {auto_compaction: true});

            // For dev purposes.
            if (env.couchDBDebug) {
                console.info('debug couch => ', env.couchDBDebug);
                _db.sync(env.couchDBDebug, {live: true});
            }

            /**
             * Put doc in local app db
             * @param doc
             * @returns {*}
             */
            function put(doc) {
                return $q.when(_db.post(doc));
            }

            /**
             * Get all docs from local app db
             * @param options
             * @returns {*}
             */
            function allDocs(options) {
                return $q.when(_db.allDocs(options));
            }

            /**
             * Query local app db
             * @param name
             * @param opt
             * @returns {*}
             */
            function query(name, opt) {
                return $q.when(_db.query(name, opt));
            }

            /**
             * Update doc
             * @param docId
             * @param attributes
             * @returns {*}
             */
            function update(docId, attributes) {
                return $q.when(_db.get(docId)
                    .then(function (doc) {

                        var tmp = {
                            _id: docId,
                            _rev: doc._rev
                        };

                        Object.keys(attributes).forEach(function(key) {
                            tmp[key] = attributes[key];
                        });

                        $q.when(_db.put(tmp));
                    })
                    .catch(function (error) {
                        console.warn('document update error', error);
                    }));
            }

            /**
             * Delete doc
             * @param doc
             */
            function deleteItem(doc) {
                return $q.when(_db.remove(doc));
            }

            /**
             * destroy the appdb
             */
            function destroy() {
                return $q.when(_db.destroy());
            }

            return {
                deleteItem: deleteItem,
                allDocs: allDocs,
                update: update,
                query: query,
                put: put,
                destroy: destroy
            };
        };

        this.$get.$inject = [
            '$q'
        ];
    }

    angular.module('Shopeur')
        .provider('AppDBService', AppDBService);

})();
