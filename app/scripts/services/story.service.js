(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:StoryService
     * @description
     * # StoryService
     *
     * @param PouchDBService
     * @returns {{getAll: getAll, remove: remove, getById: getById}}
     * @constructor
     */
    function StoryService(PouchDBService) {

        /**
         * All stories
         * @type {*[]}
         * @private
         */
        var _stories = [];

        /**
         * Get all stories
         * @returns {*[]}
         */
        function getAll() {
            var opt = {
                include_docs: true,
                startkey: 'Story-',
                endkey: 'Story-\uffff'
            };
            return PouchDBService.allDocs(opt);
        }

        /**
         * Remove given story
         * @param story
         */
        function remove(story) {
            _stories.splice(_stories.indexOf(story), 1);
        }

        /**
         * Get story by id
         * @param id
         * @returns {*}
         */
        function getById(id) {

            var filtered = _stories.filter(function (story) {
                return story.id === id;
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

    StoryService.$inject = [
        'PouchDBService'
    ];

    angular
        .module('Shopeur')
        .factory('StoryService', StoryService);

})();