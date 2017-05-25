/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司
* 创建人: 林俊杰
* 创建时间: 2015年11月23日
* 版本: WebFramework v2.0
* 描述: RequireJs配置文件

******************************************************************/

require.config({
    packages: [
       {
           name: 'echarts',
           location: 'bower_components/echarts/src',
           main: 'bower_components',
           lib: '.'
       }
    ],
    baseUrl: './',
    paths: {
        'angular': 'bower_components/angular/angular.min',
        'angular-route': 'bower_components/angular-route/angular-route.min',
        'angular-ui-router': 'bower_components/angular-ui-router/angular-ui-router.min',
        'angular-animate': 'bower_components/angular-animate/angular-animate.min',
        'angularAMD': 'bower_components/angularAMD/angularAMD.min',
        'ngload': 'bower_components/angularAMD/ngload.min',
        'jQuery': 'bower_components/jQuery/jQuery-2.1.3.min',
        'bootstrap': 'bower_components/bootstrap/js/bootstrap.min',
        'ui.bootstrap': 'bower_components/ui-bootstrap-tpls/ui-bootstrap-tpls-1.1.0.min',
       'leaflet': 'bower_components/leaflet/leaflet',
        'ui-notification': 'bower_components/angular-ui-notification/angular-ui-notification.min',
        'angular-confirm': 'bower_components/angular-confirm/angular-confirm',
        'datetimepicker': 'bower_components/jeDate/bootstrap-datetimepicker',
        'datetimepicker-zn': 'bower_components/jeDate/bootstrap-datetimepicker.zh-CN',
        'kendo-angular': 'bower_components/kendo/kendo.all.min',
        'kendo-czh': "bower_components/kendo/cultures/kendo.culture.zh-CN.min",
        'kendo-mzh': "bower_components/kendo/messages/kendo.messages.zh-CN.min"
    },

    map: {
        '*': {
            'css': 'bower_components/require-css/css.min'
        }
    },

    shim: {
        'angular-route': {
            deps: ['angular']
        },
        'angular-animate': {
            deps: ['angular']
        },
        'angularAMD': {
            deps: ['angular']
        },
        'ngload': {
            deps: ['angularAMD']
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jQuery']
        },
        'ui.bootstrap': {
            deps: ['angular']
        },
        'angular': {
            deps: ['jQuery']
        },
        'kendo-angular': {
            deps: ['jQuery', 'angular']
        },
        'kendo-czh': {
            deps: ['kendo-angular']
        },
        'kendo-mzh': {
            deps: ['kendo-angular']
        },
        'multiselect': {
            deps: ['jQuery', 'kendo-angular', 'kendo-czh', 'kendo-mzh']
        },
       
        'ui-notification': {
            deps: ['angular']
        }
    },

    deps: ['scripts/app']
});
