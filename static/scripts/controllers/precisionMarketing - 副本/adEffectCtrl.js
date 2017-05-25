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
        $scope.perItems = 8;    //页码显示的数量
        $scope.totalItems = 0//总数据量
        $scope.currentPage = 1;//当前页面
        $scope.numPages = 0;//页码
        $scope.maxSize = 5;//页码最多显示个数
        //$scope.AD_STATUS = "6";
        //日期控件
        $scope.MyDateFormat = "yyyy-MM-dd";
        $scope.countData = [];
        $scope.DateSelectorOptions = {
                start: "month",
                depth: "year",
                format: "yyyy-MM-dd",
                culture: "zh-CN",
                 
        };

        //$("#date1").datetimepicker({
        //    minView: "month", //选择日期后，不会再跳转去选择时分秒 
        //    format: "yyyy-mm-dd", //选择日期后，文本框显示的日期格式 
        //     language: 'zh-CN', //汉化 
            
        //    autoclose: true //选择日期后自动关闭 
        //});
        //$("#date2").datetimepicker({
        //    minView: "month", //选择日期后，不会再跳转去选择时分秒 
        //    format: "yyyy-mm-dd", //选择日期后，文本框显示的日期格式 
        //    language: 'zh-CN', //汉化 
           
        //    autoclose: true //选择日期后自动关闭 
        //});
        var now = new Date();

        $scope.datastart = get7DaysBefore(now);
        $scope.dataend = dealAdDate(now);
        
        //初始化echarts图形
        $scope.pieConfig = {
            chartList: ['line', 'bar'],
            dataLoaded: true,
            event: [{
                click: onClick

            }
            ]
        };
        $scope.pieHourConfig = {
            chartList: ['line', 'bar'],
            dataLoaded: true,
            event: []
        };
        $scope.isHour = false;
        //给折线图绑定点击事件
        function onClick(param) {
            $scope.$apply(function () {
                $scope.dayTime = param.name;
                if (param.name.length > 2) {
                    searchHourChart();
                }
                
            })
           
        }
        function searchHourChart() {
            if ($scope.countData.length == 0) return;
            var advertChart1 = dealADEffectHourData($scope.countData);
            var obj = createObject(advertChart1);
            if (advertChart1.showNumbers.length == 0) {
                advertChart1.showNumbers = [0];
            }
            if (advertChart1.peopleNumbers.length == 0) {
                advertChart1.peopleNumbers = [0];
            }
            if (advertChart1) {
                $scope.pieOption = {
                    title: {
                        text: '广告展示情况',
                        subtext: $scope.dayTime + '至' + $scope.dayTime

                    },
                    animation:false,
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: obj.dataTitle
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            //mark: { show: true },
                            //dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: obj.series
                }

            }
        }
        //点击日期按钮根据不同的日期展现相关的数据
        $scope.searchClick = function () {
            GetCountData();
            searchHourChart();
        }
       
        function GetData() {
            $scope.AdName = $scope.AdName === "" ? undefined : $scope.AdName;
            console.log($scope.AD_STATUS);
            $scope.AD_STATUS = $scope.AD_STATUS ==="" ? undefined : $scope.AD_STATUS;
            httpService.post("DAAS", 'ADAccountService', 'AllAdAccount', { page: $scope.currentPage, pagesize: $scope.perItems, status: $scope.AD_STATUS, ad_desc: $scope.AdName }).then(function (data) {
                $scope.totalItems = data.TotalCount;//总数据量
                $scope.advert = data.Items;
                for (var i = 0; i < $scope.advert.length; i++) {
                    var o = $scope.advert[i];
                    o.ad_status = Number(o.ad_status);
                    switch (o.ad_status) {
                        case 0:
                            o.ad_status_text = '投放中';
                            break;
                        case 1:
                            o.ad_status_text = '已暂停';
                            break;
                        //case 2:
                        //    o.ad_status_text = '待投放';
                        //    break;
                        case 3:
                            o.ad_status_text = '投放结束';
                            break;
                        //case 4:
                        //    o.ad_status_text = '待审核';
                        //    break;
                        //case 5:
                        //    o.ad_status_text = '审核不通过';
                        //    break;

                    }
                }
                setTimeout(function () {
                    $("table tbody tr").eq(0).addClass("orange");
                },10)
                
                $scope.adEffectId = data.Items[0].ad_id;
                $scope.chargingType = data.Items[0].CHARGING_TYPE;
                GetCountData()
            });
        }

       
        //点击搜索按钮按广告名称查询数据
        $scope.searchAD = function () {
            //$scope.AdName = $scope.AdName === "" ? undefined : $scope.AdName;
            //$scope.AD_STATUS = $scope.AD_STATUS === "6" ? undefined : $scope.AD_STATUS;
            //$scope.AD_STATUS = $scope.AD_STATUS === null ? undefined : $scope.AD_STATUS;        
            GetData();
        }

        //切换不同的状态获取取相关的数据
        $scope.statusSelect = function () {   
            //$scope.AdName = $scope.AdName === "" ? undefined : $scope.AdName;
            //$scope.AD_STATUS = $scope.AD_STATUS === null ? undefined : $scope.AD_STATUS;
            GetData();
        }
        //当点击表格中的某一个广告时根据广告ID让折线图按天展现数据
        $scope.lineShow = function (id, index,CHARGING_TYPE) {           
            $("table tbody tr").removeClass("orange");
            $("table tbody tr").eq(index).addClass("orange");
            $scope.adEffectId = id;
            $scope.chargingType = CHARGING_TYPE;
            GetCountData();
        }
       
        //获得统计数据
        function GetCountData() {
            var reg = /\d{4}-\d{1,2}-\d{1,2}/;
            if (!reg.test($scope.datastart)) {
                $scope.datastart = dealAdDate($scope.datastart)

            }
            if (!reg.test($scope.dataend)) {
                $scope.dataend = dealAdDate($scope.dataend)

            }

            $scope.dataend1 = dealAdDateEnd($scope.dataend)
            httpService.post("DAAS", 'UserAccountService', 'GetCountData', { ad_id: $scope.adEffectId, dtbegin: $scope.datastart, dtend: $scope.dataend1 }).then(function (data) {
                $scope.countData = data;                
                var arr = dealADEffectData(data);
                searchHourChart();
                //searchHourChart();
                var obj = createObject(arr);
                if (arr.showNumbers.length == 0) {
                    arr.showNumbers = [0];
                }
                if (arr.peopleNumbers.length == 0) {
                    arr.peopleNumbers = [0];
                }
                if (ary.length == 0) {
                    ary = [0];
                }
                if (arr) {
                    $(".lineChart").css("visibility", "visible");
                    $scope.pieOption = {
                        title: {
                            text: '广告展示情况',
                            subtext: $scope.datastart + '至' + $scope.dataend
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: obj.dataTitle
                        },
                        animation:false,
                        toolbox: {
                            show: true,
                            feature: {
                                //mark: { show: true },
                                //dataView: { show: true, readOnly: false },
                                magicType: { show: true, type: ['line', 'bar'] },
                                restore: { show: true },
                                saveAsImage: { show: true}
                            }
                        },
                        calculable: false,
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: ary
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: obj.series

                    }
                }
            }, function (e) {
                console.log(e);
            });
        }
        function createObject(arr) {
            var returnObject = {};
            var series = [];
            var dataTitle = [];

            if ($scope.chargingType == 0) {
                dataTitle = ['展示数', "人数"];
                series = [
                            {
                                name: '展示数',
                                type: 'line',
                                symbolSize: 3,
                                symbol: 'emptyCircle',
                                data: arr.showNumbers,

                            },
                            {
                                name: '人数',
                                type: 'line',
                                symbolSize: 3,
                                symbol: 'emptyCircle',
                                data: arr.peopleNumbers,

                            }];
            } else {
                dataTitle = ['点击数', "人数"];
                series = [
                            {
                                name: '点击数',
                                type: 'line',
                                symbolSize: 3,
                                symbol: 'emptyCircle',
                                data: arr.showNumbers,

                            },
                            {
                                name: '人数',
                                type: 'line',
                                symbolSize: 3,
                                symbol: 'emptyCircle',
                                data: arr.peopleNumbers,

                            }
                ];
            }
            returnObject.dataTitle = dataTitle;
            returnObject.series = series;
            return returnObject;
        }



        //格式化从后台接收的数据
        var ary;
        function dealADEffectHourData(data) {
            //console.log(data.length);
            // if (data.length == 0) return;
            var arrobj = {};
            arrobj.showNumbers = [];
            arrobj.peopleNumbers = [];
            if (data.length == 0) return arrobj;

            $.each(data, function (i, o) {
                if (o.DATE_TIME == null) {
                    o.Date_time = 0

                }
                var dateTimeNew = o.DATE_TIME.replace(new RegExp("/", 'gm'), '-');
                if (dateTimeNew.split(" ")[0] == $scope.dayTime) {
                     if (o.AD_STAT_DAY_NUM == null) {                    
                        arrobj.showNumbers = [o.AD_STAT_00_NUM.split("|")[0], o.AD_STAT_01_NUM.split("|")[0], o.AD_STAT_02_NUM.split("|")[0], o.AD_STAT_03_NUM.split("|")[0], o.AD_STAT_04_NUM.split("|")[0], o.AD_STAT_05_NUM.split("|")[0], o.AD_STAT_06_NUM.split("|")[0], o.AD_STAT_07_NUM.split("|")[0], o.AD_STAT_08_NUM.split("|")[0], o.AD_STAT_09_NUM.split("|")[0], o.AD_STAT_10_NUM.split("|")[0], o.AD_STAT_11_NUM.split("|")[0], o.AD_STAT_12_NUM.split("|")[0], o.AD_STAT_13_NUM.split("|")[0], o.AD_STAT_14_NUM.split("|")[0], o.AD_STAT_15_NUM.split("|")[0], o.AD_STAT_16_NUM.split("|")[0], o.AD_STAT_17_NUM.split("|")[0], o.AD_STAT_18_NUM.split("|")[0], o.AD_STAT_19_NUM.split("|")[0], o.AD_STAT_20_NUM.split("|")[0], o.AD_STAT_21_NUM.split("|")[0], o.AD_STAT_22_NUM.split("|")[0], o.AD_STAT_23_NUM.split("|")[0]];
                        arrobj.peopleNumbers = [o.AD_STAT_00_NUM.split("|")[0], o.AD_STAT_01_NUM.split("|")[0], o.AD_STAT_02_NUM.split("|")[0], o.AD_STAT_03_NUM.split("|")[0], o.AD_STAT_04_NUM.split("|")[0], o.AD_STAT_05_NUM.split("|")[0], o.AD_STAT_06_NUM.split("|")[0], o.AD_STAT_07_NUM.split("|")[0], o.AD_STAT_08_NUM.split("|")[0], o.AD_STAT_09_NUM.split("|")[0], o.AD_STAT_10_NUM.split("|")[0], o.AD_STAT_11_NUM.split("|")[0], o.AD_STAT_12_NUM.split("|")[0], o.AD_STAT_13_NUM.split("|")[0], o.AD_STAT_14_NUM.split("|")[0], o.AD_STAT_15_NUM.split("|")[0], o.AD_STAT_16_NUM.split("|")[0], o.AD_STAT_17_NUM.split("|")[0], o.AD_STAT_18_NUM.split("|")[0], o.AD_STAT_19_NUM.split("|")[0], o.AD_STAT_20_NUM.split("|")[0], o.AD_STAT_21_NUM.split("|")[0], o.AD_STAT_22_NUM.split("|")[0], o.AD_STAT_23_NUM.split("|")[0]];
                    } else {
                        arrobj.showNumbers = [o.AD_STAT_00_NUM.split("|")[0], o.AD_STAT_01_NUM.split("|")[0], o.AD_STAT_02_NUM.split("|")[0], o.AD_STAT_03_NUM.split("|")[0], o.AD_STAT_04_NUM.split("|")[0], o.AD_STAT_05_NUM.split("|")[0], o.AD_STAT_06_NUM.split("|")[0], o.AD_STAT_07_NUM.split("|")[0], o.AD_STAT_08_NUM.split("|")[0], o.AD_STAT_09_NUM.split("|")[0], o.AD_STAT_10_NUM.split("|")[0], o.AD_STAT_11_NUM.split("|")[0], o.AD_STAT_12_NUM.split("|")[0], o.AD_STAT_13_NUM.split("|")[0], o.AD_STAT_14_NUM.split("|")[0], o.AD_STAT_15_NUM.split("|")[0], o.AD_STAT_16_NUM.split("|")[0], o.AD_STAT_17_NUM.split("|")[0], o.AD_STAT_18_NUM.split("|")[0], o.AD_STAT_19_NUM.split("|")[0], o.AD_STAT_20_NUM.split("|")[0], o.AD_STAT_21_NUM.split("|")[0], o.AD_STAT_22_NUM.split("|")[0], o.AD_STAT_23_NUM.split("|")[0]];
                        arrobj.peopleNumbers = [o.AD_STAT_00_NUM.split("|")[1], o.AD_STAT_01_NUM.split("|")[1], o.AD_STAT_02_NUM.split("|")[1], o.AD_STAT_03_NUM.split("|")[1], o.AD_STAT_04_NUM.split("|")[1], o.AD_STAT_05_NUM.split("|")[1], o.AD_STAT_06_NUM.split("|")[1], o.AD_STAT_07_NUM.split("|")[1], o.AD_STAT_08_NUM.split("|")[1], o.AD_STAT_09_NUM.split("|")[1], o.AD_STAT_10_NUM.split("|")[1], o.AD_STAT_11_NUM.split("|")[1], o.AD_STAT_12_NUM.split("|")[1], o.AD_STAT_13_NUM.split("|")[1], o.AD_STAT_14_NUM.split("|")[1], o.AD_STAT_15_NUM.split("|")[1], o.AD_STAT_16_NUM.split("|")[1], o.AD_STAT_17_NUM.split("|")[1], o.AD_STAT_18_NUM.split("|")[1], o.AD_STAT_19_NUM.split("|")[1], o.AD_STAT_20_NUM.split("|")[1], o.AD_STAT_21_NUM.split("|")[1], o.AD_STAT_22_NUM.split("|")[1], o.AD_STAT_23_NUM.split("|")[1]];
                    }
                }
               
                
            });

            return arrobj;
        }
        function dealADEffectData(data) {
            ary = [];
            //console.log(data.length);
           // if (data.length == 0) return;
            var arrobj = {};
            arrobj.xNumbers = [];
            arrobj.showNumbers = [];
            arrobj.peopleNumbers = [];
            if (data.length == 0) {
                arrobj.xNumbers = [0];
                arrobj.showNumbers = [0];
                arrobj.peopleNumbers = [0];
                return arrobj;
            }
            $.each(data, function (i, o) {
                if (o.DATE_TIME == null) {
                    o.Date_time = 0

                }
                var dateTimeNew = o.DATE_TIME.replace(new RegExp("/",'gm'),'-');
                arrobj.xNumbers.push(dateTimeNew);
                if (o.AD_STAT_DAY_NUM == null) {
                    o.SHOW_NUM = 0;
                    o.AD_DELIVERY_USR_NUM = 0;
                } else {
                    o.SHOW_NUM = o.AD_STAT_DAY_NUM;
                    o.AD_DELIVERY_USR_NUM = o.AD_STAT_DAY_user_NUM;
                }
                arrobj.showNumbers.push(o.SHOW_NUM);
                arrobj.peopleNumbers.push(o.AD_DELIVERY_USR_NUM);
            });
            for (var i = 0; i < arrobj.xNumbers.length; i++) {
                var cur = arrobj.xNumbers[i];

                var a = cur.split(" ");
                var b = a[0];
                var c = a[1];

                ary.push(b);
                //console.log(ary);

            }
            return arrobj;
        }
        function dealAdDate(now) {
            var year = now.getFullYear();       //年  
            var month = now.getMonth() + 1;     //月
            month = month < 10 ? '0' + month : month;
            var day = now.getDate();
            day = day < 10 ? '0' + day : day;
            return year + '-' + month + '-' + day;
        }
        function dealAdDateEnd(now) {
            var reg = /\d{4}-\d{1,2}-\d{1,2}/;
            if (reg.test(now)) {
                now = new Date(now);
            }
          
            var time = now.getTime() + 1 * 24 * 60 * 60 * 1000;//时间
            var result = new Date(time);
            var year = result.getFullYear();
            var month = result.getMonth() + 1;    //月
            month = month < 10 ? '0' + month : month;
            var date = result.getDate();
            date = date < 10 ? '0' + date : date;
            return year + '-' + month + '-' + date;
            
        }
        function dealDate(now) {
            var year = now.getFullYear();       //年  
            var month = now.getMonth() + 1;     //月
            month = month < 10 ? '0' + month : month;
            var day = now.getDate();
            day = day < 10 ? '0' + day : day;
           // return year + '-' + month + '-' + day;
           
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
           return(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
            
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
        GetData();
        //实现分页
        $scope.pageChanged = function (page, pageCount) {
            $scope.currentPage = page;//当前页面
            GetData();
           
           

        };
    }];

});
