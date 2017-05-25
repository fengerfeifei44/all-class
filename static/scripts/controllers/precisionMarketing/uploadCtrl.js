define(['css!bower_components/angular-ui-notification/angular-ui-notification.min.css',
    'ngload!ui-notification',
    'ngload!ui.bootstrap',
    'angular-confirm',
    'css!bower_components/Kendo/styles/kendo.common-material.min',
    'css!bower_components/Kendo/styles/kendo.material.min',
    'ngload!kendo-angular',
    'kendo-czh',
    'kendo-mzh',
    'scripts/services/httpService',
    'scripts/services/configService'
], function () {
    'use strict';
    return ['$scope', 'Notification', '$uibModalInstance', 'httpService', 'dataModel', "refreshObj",
        function ($scope, Notification, $uibModalInstance, httpService, dataModel, refreshObj) {
            kendo.culture("zh-CN");
            //上传参数
            $scope.uploadParams = {
                saveUrl: dataModel.url + "?row=" + dataModel.row + "&col=" + dataModel.col,
                removeUrl: "remove", autoUpload: false
            }

            $scope.isShow = true;

            //保存
            $scope.onUpload = function (e) {
                $scope.kUpload.disable();
                $scope.$apply($scope.isShow = false);
            }

            //上传成功
            $scope.onSuccess = function (e) {
                $scope.kUpload.enable();
                $scope.$apply($scope.isShow = true);
                var data = JSON.parse(e.XMLHttpRequest.response);
                if (data != "") {
                    if (data[0].message) {   //错误信息
                        var ErrorInfo = "";
                        for (var i = 0; i < data.length; i++) {
                            ErrorInfo += data[i].message.toString();
                        }
                        Notification.error({ message: ErrorInfo, delay: 8000 });
                    } else {   //正确
                        $scope.SuccessList = data;
                        $uibModalInstance.close($scope.SuccessList);
                        Notification.success({ message: "导入成功", delay: 5000 });
                        refreshObj.getData();
                    }
                } else {
                    Notification.error({ message: "导入失败", delay: 5000 });
                }
            }



            //上传失败
            $scope.onError = function (e) {
                $scope.kUpload.enable();
                $scope.$apply($scope.isShow = true);
                var data = JSON.parse(e.XMLHttpRequest.response);
                if (data.Success) {
                    Notification.success({ message: "导入成功", delay: 10000 });
                }
                else {
                    Notification.error({ message: data.Message, delay: 10000 });
                }
            }
            //点击取消按钮事件
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.select = function () {

            }
        }]
});