
define(['scripts/services/httpService', 'scripts/requireHelper/requireNotification', 'scripts/requireHelper/requireConfirm', 'scripts/requireHelper/requireUiBootstrap', 'scripts/requireHelper/requireConfirm', 'angular-confirm', 'bower_components/customUI/js/fixUI'],
function (exportService) {
    return ['$scope', 'httpService', 'Notification', '$confirm', '$uibModal',
    function ($scope, httpService, Notification, $confirm, $uibModal) {
        $scope.information = true;
        $scope.activity = false;
        $scope.messageType = 2;
        $scope.linkMess = false;
     
        //选择信息
        $scope.messageClick = function () {
            $scope.information = true;
            $scope.activity = false;
            $scope.messageType = 2;
            $scope.message_conf = "";
            $scope.link_mess = "";
            $scope.linkMess = false;
        }
        //选择活动
        $scope.activityClick = function () {
            $scope.activity = true;
            $scope.information = false;
            $scope.messageType = 1;
            $scope.message_conf = "";
            $scope.link_mess = "";
            $scope.linkMess = true;
        }

        $scope.publishClick = function () {
            httpService.get("DAAS", 'UserAccountService', 'InsertUsermessage', { AD_ACCOUNT_ID: "", AD_ACCOUNT_NAME: "", MESSAGE_CONT: $scope.message_conf, MESSAGE_TYPE: $scope.messageType, LINK_MESS: $scope.link_mess , MESSAGE_LEVEL:1}).then(function (data) {
                if (data == true) {
                    Notification.success({ message: "发布成功！", delay: 5000 });
                    $scope.message_conf = "";
                    $scope.link_mess = "";
                }
                else
                    Notification.error({ message: "发布失败!", delay: 5000 });
            }, function (errorMessage) {
                Notification.error({ message: errorMessage, delay: 5000 });
                console.log("error:" + errorMessage)
            });
        }
     




   
        


 

    }]


});








