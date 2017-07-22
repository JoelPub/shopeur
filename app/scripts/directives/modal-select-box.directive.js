(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name Shopeur.directive:modalSelectBox
     *
     * @description
     * A modal select directive with default or grouped list items and search option
     *
     * @example
     * List with default list items
     * <modal-select-box id="modalSelectId"
     *                   model="vm.selected"
     *                   model-change="vm.changedHandler()"
     *                   modal-title="Select a ..."
     *                   data="vm.model"
     *                   ---
     *                   item-label="title"
     *                   item-icon="logo_file"
     *                   item-id="_id"
     *
     *                   or
     *
     *                   item-label="doc.longName"
     *                   item-icon=""
     *                   item-id="doc._id"
     *                   ---
     *                   placeholder="Please select..."
     *                   show-label-in-list="true | false">
     * </modal-select-box>
     *
     * Grouped list with nested subitems and search field
     * <modal-select-box id="modalSelectId"
     *                   model="vm.selected"
     *                   model-change="vm.changedHandler()"
     *                   modal-title="Select a ..."
     *                   data="vm.model"
     *                   group-item-label="doc.translations.name"
     *                   group-item-icon="doc.icon_file"
     *                   group-item-id="doc._id"
     *                   ---
     *                   item-label="title"
     *                   item-icon="logo_file"
     *                   item-id="_id"
     *
     *                   or
     *
     *                   item-label="doc.longName"
     *                   item-icon=""
     *                   item-id="doc._id"
     *                   ---
     *                   placeholder="Please select..."
     *                   show-label-in-list="true | false"
     *                   searchable-list="true | false">
     * </modal-select-box>
     */
    function modalSelectBox() {

        function controller($scope, $element, $attrs, $ionicModal, $timeout, $translate) {

            /* jshint validthis: true */
            var vm = this;
            vm.modal = null;
            vm.selectedLabel = null;
            vm.listItemUrl = null;

            /**
             * Removes and reset modal
             */
            function removeModal() {
                vm.modal.remove();
                vm.modal = null;
            }

            /**
             * Initialize and open modal
             */
            vm.showSelectModal = function () {
                //console.log('showSelectModal => ', vm.model, vm.data, vm.data.length);
                if (vm.data.length) {

                    vm.listItemUrl = (vm.groupItemId) ? 'templates/directives/modal-select-box.grouped-item.html' : 'templates/directives/modal-select-box.default-item.html';

                    $timeout(function() {
                        vm.modal = $ionicModal.fromTemplateUrl('templates/directives/modal-select-box.html', {
                            scope: $scope,
                            animation: 'scale-in'
                        }).then(function (modal) {
                            vm.modal = modal;
                            vm.modal.show();
                        });
                    }, 500);
                }
            };

            /**
             * Close modal
             */
            vm.closeSelectModal = function () {
                vm.modal.hide();
                removeModal();
            };

            /**
             * Set selected item and close modal
             * @param item
             */
            vm.selectItem = function (item) {

                vm.model = item;
                vm.closeSelectModal();

                $timeout(function () {
                    vm.changeHandler();
                }, 500);
            };

            /**
             * Return object value, if translation is set use current app language key
             * Language key is e.g. "en-US" substring to => "en" (line 134)
             * For missing translations use "en" as fallback (line 135)
             * @param object
             * @param key
             * @returns {*}
             */
            vm.getObjectValue = function (object, key) {

                if (!key) {
                    return false;
                }

                return key.split('.').reduce(function (a, b) {

                    if (b === 'translations') {
                        var langKey = $translate.use().substring(0, 2);
                        return (a[b][langKey] ? a[b][langKey] : a[b].en);
                    }

                    return a[b];
                }, object);
            };

            /**
             * Destroy modal when finished
             */
            $scope.$on('$destroy', function () {
                if (vm.modal) {
                    removeModal();
                }
            });

            /**
             * Watcher for "vm.model"
             */
            $scope.$watch('vm.model', function (model) {
                if (model) {
                    vm.selectedLabel = vm.getObjectValue(model, vm.itemLabel);
                } else {
                    vm.selectedLabel = null;
                }
            });
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                id: '@',
                model: '=',
                changeHandler: '&modelChange',
                modalTitle: '@',
                data: '=',
                groupItemLabel: '@',
                groupItemIcon: '@',
                groupItemId: '@',
                itemLabel: '@',
                itemIcon: '@',
                itemId: '@',
                placeholder: '@',
                showLabelInList: '=',
                searchableList: '='
            },
            bindToController: true,
            templateUrl: 'templates/directives/modal-select-box.input.html',
            controller: controller,
            controllerAs: 'vm'
        };
    }

    modalSelectBox.$inject = [];

    angular.module('Shopeur')
        .directive('modalSelectBox', modalSelectBox);

})();