(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:PouchDBService
     * @description
     * # PouchDBService
     *
     * @constructor
     */
    function PouchDBService() {

        /**
         * Local db name
         * @type {null}
         * @private
         */
        var _localDB = null;

        /**
         * Remote db url
         * @type {string}
         * @private
         */
        var _remoteDB = null;

        /**
         * Remote db sequence number
         * @type {number}
         * @private
         */
        var _lastSeq = 0;

        /**
         * Set local db name
         * @param db
         */
        this.setLocalDB = function (db) {
            _localDB = db;
        };

        /**
         * Set remote db url
         * @param dbHost
         */
        this.setRemoteDB = function (dbHost) {
            _remoteDB = dbHost;
        };

        /**
         * Provider getter function
         * @param $q
         * @param $ionicPopup
         * @param $ionicLoading
         * @returns {{localDB: localDB, remoteDB: remoteDB, sync: sync, allDocs: allDocs, query: query, destroy: destroy, getAttachment: getAttachment, hasChanges: hasChanges, lastSeq: lastSeq}}
         */
        this.$get = function ($q, $ionicPopup, $ionicLoading) {

            if (!_localDB) {
                /*global error */
                throw error('db name can not be empty');
            }

            /**
             * Remote pouch db
             */
            var _rdb = new PouchDB(_remoteDB);

            /**
             * Local pouch db
             */
            var _db = new PouchDB(_localDB, {auto_compaction: true});

            /**
             * Get local db
             * @returns {*}
             */
            function localDB() {
                return _localDB;
            }

            /**
             * Get remote db
             * @returns {*}
             */
            function remoteDB() {
                return _remoteDB;
            }

            /**
             * Get db sequence number
             * @returns {number}
             */
            function lastSeq() {
                return _lastSeq;
            }

            /**
             * Sync local db
             * @returns {Function|promise}
             */
            function sync() {
                return $q.when(_db.replicate.from(_remoteDB)
                    .on('change', function (info) {
                        console.info('PouchDBService change => ', info);
                    })
                    .on('paused', function () {
                        console.info('PouchDBService paused');
                    })
                    .on('active', function () {
                        console.info('PouchDBService active');
                    })
                    .on('denied', function (info) {
                        console.info('PouchDBService denied => ', info);
                    })
                    .on('complete', function (info) {
                        console.info('PouchDBService complete => ', info);
                        _lastSeq = info.last_seq;
                    })
                    .on('error', function (error) {
                        // just continue the app if the sync fails
                        console.warn('PouchDBService error => ', error);
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'PouchDB Service Error!',
                            template: error.message,
                            okType: 'button-calm'
                        });
                    }));
            }

            /**
             * Get db changes
             */
            function hasChanges() {
                return $q.when(_rdb.changes({
                        since: 'now',
                        include_docs: true,
                        attachments: true
                    })
                );
            }

            /**
             * Get all local documents
             * @param options
             * @returns {Function|promise}
             */
            function allDocs(options) {
                return $q.when(_db.allDocs(options));
            }

            /**
             * Query local db
             * @param name
             * @param opt
             * @returns {Function|promise}
             */
            function query(name, opt) {
                return $q.when(_db.query(name, opt));
            }

            /**
             * Destroy local pouch db
             * @returns {Function|promise}
             */
            function destroy() {
                return $q.when(_db.destroy());
            }

            /**
             * Get an attachment of a document
             * @param docId
             * @param attachmentId
             * @returns {*}
             */
            function getAttachment(docId, attachmentId) {
                return $q.when(_db.getAttachment(docId, attachmentId));
            }

            return {
                localDB: localDB,
                remoteDB: remoteDB,
                sync: sync,
                allDocs: allDocs,
                query: query,
                destroy: destroy,
                getAttachment: getAttachment,
                hasChanges: hasChanges,
                lastSeq: lastSeq
            };
        };

        this.$get.$inject = [
            '$q',
            '$ionicPopup',
            '$ionicLoading'
        ];
    }

    angular.module('Shopeur')
        .provider('PouchDBService', PouchDBService);
})();