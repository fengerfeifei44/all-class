
define(['scripts/common'],
function (angularAMD) {
    'use strict';
    var app = angular.module('webApp', ['ui.router']);

    app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('main', angularAMD.route({
            url: '/main',
            templateUrl: 'views/main.html',
            controllerUrl: 'scripts/controllers/mainCtrl'
        })).state('main.marketingData', angularAMD.route({
            url: '/marketingData',
            templateUrl: 'views/marketingData.html',
            controllerUrl: 'scripts/controllers/marketingDataCtrl'
        })).state('main.marketingData.accountManage', angularAMD.route({
            url: '/accountManage',
            templateUrl: 'views/marketing/accountManage.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/accountManageCtrl'

        }))
         .state('main.marketingData.moneyManage', angularAMD.route({
             url: '/moneyManage',
             templateUrl: 'views/marketing/moneyManage.html',
             controllerUrl: 'scripts/controllers/precisionMarketing/moneyManageCtrl'

         }))
       .state('main.marketingData.adContentManage', angularAMD.route({
           url: '/adContentManage',
           templateUrl: 'views/marketing/adContentManage.html',
           controllerUrl: 'scripts/controllers/precisionMarketing/adContentManageCtrl'

       }))
       .state('main.marketingData.adEffect', angularAMD.route({
           url: '/adEffect',
           templateUrl: 'views/marketing/adEffect.html',
           controllerUrl: 'scripts/controllers/precisionMarketing/adEffectCtrl'

       }))
        .state('main.marketingData.blackList', angularAMD.route({
            url: '/blackList',
            templateUrl: 'views/marketing/blackList.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/blackListCtrl'

        }))
        .state('main.marketingData.systemLogin', angularAMD.route({
            url: '/systemLogin',
            templateUrl: 'views/marketing/systemLogin.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/systemLoginCtrl'

        }))
        .state('main.marketingData.UsrFeedbackDetail', angularAMD.route({
            url: '/UsrFeedbackDetail',
            templateUrl: 'views/marketing/UsrFeedbackDetail.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/UsrFeedbackDetailCtrl'

        })).state('main.marketingData.webset', angularAMD.route({
            url: '/webset',
            templateUrl: 'views/marketing/webSet.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/webSetCtrl'
        })).state('main.marketingData.platMonitor', angularAMD.route({
            url: '/platMonitor',
            templateUrl: 'views/marketing/platMonitor.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/platMonitorCtrl'
        }))

        

        $urlRouterProvider.otherwise('/main/marketingData/accountManage');

    }]);

    return angularAMD.bootstrap(app);
});

