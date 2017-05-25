/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年8月21日

******************************************************************/

define(['angular'], function (ng) {
    angular.module('angular-confirm', ['ui.bootstrap'])
      .controller('ConfirmModalController', ['$scope', '$uibModalInstance', 'data', function ($scope, $uibModalInstance, data) {
          $scope.data = angular.copy(data);

          $scope.ok = function () {
              $uibModalInstance.close();
          };

          $scope.cancel = function () {
              $uibModalInstance.dismiss('cancel');
          };

      }])
      .value('$confirmModalDefaults', {
          template: '<div id="window-title" class="modal-header">{{data.title}}<div class="detail-close pull-right" ng-click="cancel()"><i class="fa fa-times"></i></div></div>' +
          '<div class="modal-body" style="text-align:center"><i class="spriteicon warn"></i>{{data.text}}</div>' +
          '<div class="modal-footer" style="text-align:center">' +
          '<button class="btn btn-blue btn-rounded" ng-click="ok()">{{data.ok}}</button>' +
          '<button class="btn btn-default btn-rounded" ng-click="cancel()" ng-show="!data.unShowCancle">{{data.cancel}}</button>' +
          '</div>',
          controller: 'ConfirmModalController',
          backdrop: 'static',
          animation:false,
          defaultLabels: {
              title: '消息确认',
              ok: '确定',
              cancel: '取消'
          }
      })
      .factory('$confirm', ['$uibModal', '$confirmModalDefaults', function ($uibModal, $confirmModalDefaults) {
          return function (data, settings) {
              settings = angular.extend($confirmModalDefaults, (settings || {}));

              data = angular.extend({}, settings.defaultLabels, data || {});

              if ('templateUrl' in settings && 'template' in settings) {
                  delete settings.template;
              }

              settings.resolve = {
                  data: function () {
                      return data;
                  }
              };

              return $uibModal.open(settings).result;
          };
      }])
      .directive('confirm', ['$confirm', function ($confirm) {
          return {
              priority: 1,
              restrict: 'A',
              scope: {
                  confirmIf: "=",
                  ngClick: '&',
                  confirm: '@',
                  confirmSettings: "=",
                  confirmTitle: '@',
                  confirmOk: '@',
                  confirmCancel: '@'
              },
              link: function (scope, element, attrs) {


                  element.unbind("click").bind("click", function ($event) {

                      $event.preventDefault();

                      if (angular.isUndefined(scope.confirmIf) || scope.confirmIf) {

                          var data = { text: scope.confirm };
                          if (scope.confirmTitle) {
                              data.title = scope.confirmTitle;
                          }
                          if (scope.confirmOk) {
                              data.ok = scope.confirmOk;
                          }
                          if (scope.confirmCancel) {
                              data.cancel = scope.confirmCancel;
                          }
                          $confirm(data, scope.confirmSettings || {}).then(scope.ngClick);
                      } else {

                          scope.$apply(scope.ngClick);
                      }
                  });

              }
          }
      }]);
});