(function () {

    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:StateHistoryService
     * @description
     * # StateHistoryService saves the state history with its state params
     *
     * @param $state
     * @param $rootScope
     * @returns {{goBack: goBack}}
     * @constructor
     */
    function StateHistoryService($state, $rootScope) {

        // initial set the current state for the first history item
        var _history = [{
            state: $state.current,
            params: $state.current.params
        }];

        var _addToHistory = true;

        /**
         * event handler for the successfull state change. Here the states and the params are stored
         * @param event
         * @param toState
         * @param toParams
         */
        function onStateChangeSuccess(event, toState, toParams) {
            if (!_addToHistory) {
                _addToHistory = true;
                return;
            }

            _history.push({
                state: toState,
                params: toParams
            });
        }

        /**
         * read the state history and remove the last item.
         * then set the state to move to the last available state
         */
        function goBack() {
            _history.pop();
            // do not track states that is coming history
            var lastItem = _history[_history.length - 1];
            _addToHistory = false;
            if (lastItem) {
                $state.go(lastItem.state.name, lastItem.params);
            }
        }

        /**
         * State change handler
         */
        $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

        return {
            goBack: goBack
        };
    }

    StateHistoryService.$inject = [
        '$state',
        '$rootScope'
    ];

    angular.module('Shopeur')
        .factory('StateHistoryService', StateHistoryService);

})();
