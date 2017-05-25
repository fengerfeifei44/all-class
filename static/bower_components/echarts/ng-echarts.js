/******************************************************************

 * Copyright (C): 北京泰合佳通信息技术有限公司广东分公司
 *
 * 描述: 基于AngularJS 封装 Echarts指令
 *
 *      使用ng-echarts指令, 主要配置如下两个变量：
 *      1.ecOption：和echarts中的option一样，因此你直接可以把官网的例子拷进来用;
 *      2.ecConfig：echarts相关的参数的配置项, 具体如下:
 *      2.1 chartList：指定按需加载图形类型, 共有17种类型图表, 要确保图表正确显示必须正确加载图形组件, 注意要确保正确性;
 *          ['bar','line','scatter','pie','radar','venn','treemap','tree','map','k','force','chord','gauge','funnel','eventriver','wordcloud','heatmap']
 *      2.2 theme：图表样式主题,用于控制显示风格,提供了14种风格,根据需要指定一种;
 *          macarons, infographic, shine, dark, blue, green, red, gray, helianthus, roma, mint, macarons2, sakura, default
 *      2.3 event：绑定事件, 用于关联事件进行一些特殊的处理;
 *      2.4 dataLoaded：数据是否加载（用于Loading）用于控制是否显示加载提示;
 *      2.5 loadingOption：加载效果配置项同Echarts官网;
 *      2.6 connect:添加联动图表, 如果需要联动,需要给统计图对象指定ID,并且确保设置正确的联动对象ID.

 ******************************************************************/

define(['bower_components/echarts/init', 'angularAMD'], function (echarts, angularAMD) {

    angularAMD.directive('ngEcharts', function () {
        var charts = [];
        var connectList = [];
        return {
            controller: ['$scope','$element', function($scope,$element){
                $scope.chart = echarts.init($element[0]);

                this.getChart = function(){
                    return $scope.chart;
                };

                this.showLoading = function (loadingOption) {

                    var op = loadingOption || {
                            text : '数据加载中',
                            effect : 'bubble',
                            textStyle : {
                                fontSize : 20
                            }
                        };
                    $scope.chart.showLoading(op);
                };

                this.hideLoading = function () {
                    $scope.chart.hideLoading();
                };
            }],
            link: function(scope,element,attrs,ctrl){
                var chart = scope.chart;
                var downChartOk = false;
                var downThemeOk = false;
                var theme = {};
                var connectOk = false;

                //connectList[attrs.id] = scope.config.connect;
                connectList.push({key: attrs.id, value: scope.config.connect});
                charts[attrs.id] = chart;

                // 加载图表JS
                var downlist = [];
                if (scope.config.chartList && echarts.Paths)
                {
                    scope.config.chartList.forEach(function(item){
                        downlist.push(echarts.Paths[item]);
                    });
                    require(downlist, function() {
                        downChartOk = true;
                        downTheme(scope.config.theme);
                    });
                }

                // 加载样式JS
                function downTheme(name){
                    var themeName = name ? name : 'default';
                    require(['bower_components/echarts/theme/' + themeName], function (th) {
                        theme = th;
                        downThemeOk = true;
                        refreshChart();
                    });
                }

                // 建立联动
                function connect() {
                    if (connectList && connectList.length > 0) {
                        for (var i in connectList) {
                            var others = [];
                            for (index in connectList[i]['value']) {
                                others.push(charts[connectList[i]['value'][index]]);
                            }
                            charts[connectList[i]['key']].connect(others);
                        }
                        connectOk = true;
                        console.log('connect....');
                    }
                }


                function refreshChart(){
                    if(!downThemeOk){
                        downTheme(scope.config.theme);
                    }
                    if(scope.config && scope.config.dataLoaded === false){
                        ctrl.showLoading(scope.config.loadingOption);
                    }

                    if(scope.config && scope.config.dataLoaded && downChartOk && downThemeOk){
                        chart.setOption(scope.option,true);
                        chart.setTheme(theme);
                        chart.resize();
                        ctrl.hideLoading();
                        downThemeOk = false;
                        if (!connectOk) {
                            connect();
                        }
                    }
                };

                //事件绑定
                function bindevent(){
                    if(angular.isArray(scope.config.event)){
                        angular.forEach(scope.config.event,function(value,key){
                            for(var e in value){
                                chart.on(e,value[e]);
                            }
                        });
                    }
                }

                if(scope.config.event){
                    bindevent();
                }

                //自定义参数 -
                // event 定义事件
                // theme 主题
                // dataLoaded 数据是否加载

                scope.$watch(
                    function () { return scope.config; },
                    function (value) {if (value) {refreshChart();}},
                    true
                );

                //图表原生option
                scope.$watch(
                    function () { return scope.option; },
                    function (value) {if (value) {refreshChart();}},
                    true
                );
            },
            scope:{
                option:'=ecOption',
                config: '=ecConfig',
            },
            restrict:'EA'
        }
    })
});
