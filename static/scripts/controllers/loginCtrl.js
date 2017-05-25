define(['scripts/services/httpService',
    'scripts/requireHelper/requireNotification',
    'scripts/requireHelper/requireUiBootstrap',
    'scripts/requireHelper/requireConfirm'], function () {
        return ['$scope', '$timeout', '$location', 'httpService', '$confirm', 'Notification', '$window', '$state', function ($scope, $timeout, $location, httpService, $confirm, Notification, $window, $state) {
            if ($.cookie("lose") == "loseE") {
                Notification.error({ message: "请重新登录", delay: 5000 });
            }
          

        }]
    });