/******************************************************************

 * Copyright (C): 北京泰合佳通信息技术有限公司广东分公司
 *
 * 描述: 基于 ng-echarts 指令的使用示例
 *      ng-echarts只需要两个变量：
 *      1.ecOption：也就是echarts中的option，因此你直接可以把官网的例子拷进来用
 *      2.ecConfig：其他参数的配置项
 *          2.1 chartList：指定按需加载图形类型
 *          ['bar','line','scatter','pie','radar','venn','treemap','tree','map','k','force','chord','gauge','funnel','eventriver','wordcloud','heatmap']
 *          2.2 theme：图表主题
 *          macarons, infographic, shine, dark, blue, green, red, gray, helianthus, roma, mint, macarons2, sakura, default
 *          2.3 event：绑定事件
 *          2.4 dataLoaded：数据是否加载（用于Loading）
 *          2.5 loadingOption：加载效果配置项同官网
 *          2.6 connect:添加联动图表, 如果需要联动,需要给统计图对象指定ID,并且确保设置正确的联动对象ID.
 *
 ******************************************************************/

define(['datetimepicker', 'scripts/services/httpService', 'ngload!ui.bootstrap',  'bower_components/echarts/ng-echarts', 'kendo-czh', 'kendo-mzh', 'css!bower_components/Kendo/styles/kendo.common-material.min', 'css!bower_components/Kendo/styles/kendo.material.min', 'ngload!kendo-angular'], function () {
    'use strict'
    return ['$scope', '$http', 'httpService', function ($scope, $http, httpService) {
        //日期控件
        $scope.MyDateFormat = "yyyy-MM-dd";
        $scope.countData = [];
        $scope.DateSelectorOptions = {
                start: "month",
                depth: "year",
                format: "yyyy-MM-dd",
                culture: "zh-CN",
                 
        };
        var totalSuccRate;
        var singleDate;
        var now = new Date();
        $scope.datastart = get7DaysBefore(now);
        $scope.dataend = dealAdDate(now);
        $scope.TestSuccRate;
        //初始化echarts图形
        $scope.pieConfig = {
            chartList: ['line', 'bar'],
            dataLoaded: true,
        };
        $scope.pieHourConfig = {
            chartList: ['line', 'bar'],
            dataLoaded: true,
            event: []
        };
      
        function getSuccRateData() {
            var reg = /\d{4}-\d{1,2}-\d{1,2}/;
            if (!reg.test($scope.datastart)) {
                $scope.datastart = dealAdDate($scope.datastart)
            }
            if (!reg.test($scope.dataend)) {
                $scope.dataend = dealAdDate($scope.dataend)
            }
            httpService.post("DAAS", 'PlatService', 'GetTotalSuccRateByTime', { timeBegin: $scope.datastart, timeEnd: $scope.dataend }).then(function (data) {
                if (data != null)
                    totalSuccRate = "总成功率：" + data.totalsuccrate * 100 + "%";
                httpService.post("DAAS", 'PlatService', 'GetAdSuccRateByTime', { timeBegin: $scope.datastart, timeEnd: $scope.dataend }).then(function (data) {
                    $scope.SuccDataList = data;
                    var arr = dealData(data);
                    if (singleDate.length == 0)
                        singleDate = [0];
                    if (arr) {
                        $scope.pieOption = {
                            title: {
                                text: '广告推送成功率',
                                textStyle: {
                                    fontWeight: 500,
                                    color: '#3598fd'
                                },
                                subtext: totalSuccRate
                            },
                            tooltip: {
                                trigger: 'axis',
                                formatter: '{b0}: {c0}%'
                            },
                            legend: {
                                data: ['成功率']

                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    dataZoom: {
                                        yAxisIndex: 'none'
                                    },
                                    mark: { show: true },
                                    dataView: { show: true, readOnly: false },
                                    magicType: { show: true, type: ['line', 'bar'] },
                                    restore: { show: true },
                                    saveAsImage: { show: true }
                                }
                            },
                            //dataZoom: {
                            //    show: true,
                            //    realtime: true,
                            //    start: 0,
                            //    end: 100
                            //},
                            calculable: false,
                            xAxis: 
                                {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: singleDate
                                }
                            ,
                            yAxis: 
                                {
                                    type: 'value',

                                    axisLabel: {
                                        formatter: '{value} %'
                                    }
                                }
                            ,
                            series: [
                                {
                                    name: '成功率',
                                    type: 'line',
                                    data: arr.succRateData,
                                    symbolSize: 3,
                                    symbol: 'emptyCircle'
                                    //markPoint: {
                                    //    data: [
                                    //        { type: 'max', name: '最大成功率' },
                                    //        { type: 'min', name: '最小成功率' }
                                    //    ]
                                    //},
                                    //markLine: {
                                    //    data: [
                                    //        { type: 'average', name: '平均成功率' }
                                    //    ]
                                    //}  
                                },

                            ]

                        }
                    }
                }, function (e) {
                    console.log(e);
                });
            },function(e){
                console.log(e);
            });
          
        }

        function getTestSuccRateData()
        {
            httpService.post("DAAS", 'PlatService', 'GetTestSuccRate', {}).then(function (data) {
                if (data != null)
                    var num = data.testSuccRate.toFixed(4);
                    $scope.TestSuccRate = num * 100 + "%";
            }, function (e) {
                console.log(e);
            });
        }

        function dealData(data) {
            singleDate = [];
            var succArr = {};
            succArr.xNumbers = [];
            succArr.succRateData = [];
            if (data.length == 0)
            {
                succArr.xNumbers = [0];
                succArr.succRateData = [0];
                return succArr;
            }
            $.each(data, function (i, o) {
                if (o.date_time == null) {
                    o.date_time = 0;
                }
                //else {
                   // var result = new Date(parseInt(o.date_time.slice(6, 19)));
                //    o.date_time = convertDateByTime(o.date_time)
                //}
                var date = o.date_time.replace(new RegExp("/", 'gm'), '-');
                succArr.xNumbers.push(date);
                if (o.succRate == null)
                    o.succRate = 0;
                succArr.succRateData.push(o.succRate);
            });
            for (var i = 0; i < succArr.xNumbers.length; i++)
            {
                var curDate = succArr.xNumbers[i];
                var datetimes = curDate.split(" ");
                singleDate.push(datetimes[0]);
            }
            return succArr;
        }
   
        //点击日期按钮根据不同的日期展现相关的数据
        $scope.searchClick = function () {
            getSuccRateData();
        }

        $scope.searchTestClick = function () {
            getTestSuccRateData();
        }

        getSuccRateData();
 
        function convertDateByTime(time) {
            
            var year = time.getFullYear();
            var month = time.getMonth() + 1;    //月
            month = month < 10 ? '0' + month : month;
            var date = time.getDate();
            date = date < 10 ? '0' + date : date;
            return year + '-' + month + '-' + date;

        }

        function dealAdDate(now) {
            var year = now.getFullYear();       //年  
            var month = now.getMonth() + 1;     //月
            month = month < 10 ? '0' + month : month;
            var day = now.getDate();
            day = day < 10 ? '0' + day : day;
            return year + '-' + month + '-' + day;
        }
        function get7DaysBefore(date) {
            var date = date || new Date(),
                timestamp, newDate;
            if (!(date instanceof Date)) {
                date = new Date(date.replace(/-/g, '-'));
            }
            timestamp = date.getTime();
            newDate = new Date(timestamp - 7 * 24 * 3600 * 1000);
            var m = newDate.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = newDate.getDate();
            d = d < 10 ? '0' + d : d;
            return [newDate.getFullYear(), m, d].join('-');
        }            
    }];

});
