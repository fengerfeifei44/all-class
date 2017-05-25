define(['angularAMD', 'css!bower_components/angular-ui-notification/angular-ui-notification.min.css', 'ngload!ui-notification', 'scripts/services/httpService'], function (angularAMD) {
    'use strict';
    angularAMD.service('configService',
    function (httpService, Notification) {

        var appId = "Strike";

        //获取评分人组织机构字典定义-开始
        function getRaterDept() {
            var promise = httpService.postRemote('Manage', 'DictsService', 'GetDictsByApp', { dicType: "RaterDept", appId: appId }).then(function (data) {
                var result = ""
                if (data) {
                    result = data[0].Name;
                }
                return result;
            },
            function (errorMessage) {
                Notification.error({ message: errorMessage, delay: 5000 });
            });
            return promise;
        }
        //获取评分人组织机构字典定义-结束


        //获取用户菜单权限-开始
        function getUserMenus() {
            var promise = httpService.postRemote('Open', 'OAuth', 'GetUserRight', { token: httpService.getCookie("Tescomm_Access_Token"), app: appId }).then(function (data) {
                return generateMenu(data);
            },
            function (errorMessage) {
                Notification.error({ message: errorMessage, delay: 5000 });
            });
            return promise;
        }

        function generateMenu(userMenus) {
            var result = new Array();
            for (var menuItem in userMenus) {
                if (!userMenus[menuItem].Pid && !userMenus[menuItem].IsDefault) {
                    result.push(userMenus[menuItem]);
                }
            }
            findChildrens(result, userMenus);
            return result;
        }

        function findChildrens(filterMenus, fullMenus) {
            for (var menuItem in filterMenus) {
                var Childrens = findMenuItem(fullMenus, filterMenus[menuItem].Id);
                filterMenus[menuItem].Childrens = Childrens;
                if (Childrens && Childrens.length > 0) {
                    findChildrens(Childrens, fullMenus);
                }
            }
        }

        function findMenuItem(userMenus, id) {
            var result = new Array();

            for (var menuItem in userMenus) {
                if (userMenus[menuItem].Pid == id) {
                    result.push(userMenus[menuItem]);
                }
            }

            return result.sort(function (a, b) {
                return a.Order_No - b.Order_No
            });
        }
        //获取用户菜单权限-结束

        return ({
            appId: appId,
            raterDept: getRaterDept,
            getUserMenus: getUserMenus
        });

    });
})