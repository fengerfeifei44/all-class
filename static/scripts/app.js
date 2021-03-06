
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
        }))
            //.state('main.marketingData', angularAMD.route({
            //url: '/marketingData',
            //templateUrl: 'views/marketingData.html',
            //controllerUrl: 'scripts/controllers/marketingDataCtrl'
            //}))
            .state('main.accountManage', angularAMD.route({
            url: '/accountManage',
            templateUrl: 'views/marketing/accountManage.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/accountManageCtrl'

        }))
         .state('main.moneyManage', angularAMD.route({
             url: '/moneyManage',
             templateUrl: 'views/marketing/moneyManage.html',
             controllerUrl: 'scripts/controllers/precisionMarketing/moneyManageCtrl'

         }))
       .state('main.adContentManage', angularAMD.route({
           url: '/adContentManage',
           templateUrl: 'views/marketing/adContentManage.html',
           controllerUrl: 'scripts/controllers/precisionMarketing/adContentManageCtrl'

       }))
       .state('main.adEffect', angularAMD.route({
           url: '/adEffect',
           templateUrl: 'views/marketing/adEffect.html',
           controllerUrl: 'scripts/controllers/precisionMarketing/adEffectCtrl'

       }))
        .state('main.blackList', angularAMD.route({
            url: '/blackList',
            templateUrl: 'views/marketing/blackList.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/blackListCtrl'

        }))
        .state('main.systemLogin', angularAMD.route({
            url: '/systemLogin',
            templateUrl: 'views/marketing/systemLogin.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/systemLoginCtrl'

        }))
        .state('main.UsrFeedbackDetail', angularAMD.route({
            url: '/UsrFeedbackDetail',
            templateUrl: 'views/marketing/UsrFeedbackDetail.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/UsrFeedbackDetailCtrl'

        })).state('main.webset', angularAMD.route({
            url: '/webset',
            templateUrl: 'views/marketing/webSet.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/webSetCtrl'
        })).state('main.platMonitor', angularAMD.route({
            url: '/platMonitor',
            templateUrl: 'views/marketing/platMonitor.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/platMonitorCtrl'
        })).state('main.configManage', angularAMD.route({
            url: '/configManage',
            templateUrl: 'views/marketing/configManage.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/configManageCtrl'
        })).state('main.newsRelease', angularAMD.route({
            url: '/newsRelease',
            templateUrl: 'views/marketing/newsRelease.html',
            controllerUrl: 'scripts/controllers/precisionMarketing/newsReleaseCtrl'
        }))


        
       
        $urlRouterProvider.otherwise('/main/accountManage');

    }]);

    return angularAMD.bootstrap(app);
});

