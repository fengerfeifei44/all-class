
define(['scripts/services/httpService', 'scripts/requireHelper/requireNotification', 'scripts/requireHelper/requireConfirm', 'scripts/requireHelper/requireUiBootstrap', 'scripts/requireHelper/requireConfirm', 'angular-confirm', 'bower_components/customUI/js/fixUI'],
function (exportService) {
    return ['$scope', 'httpService', 'Notification', '$confirm', '$uibModal',
    function ($scope, httpService, Notification, $confirm, $uibModal) {
        $scope.picIP = "";       //图片服务IP
        $scope.picPort = 0;     //图片服务端口
        $scope.picShow = false;
        $scope.monitorIP = "";       //中央监控IP
        $scope.monitorPort = 0;     //中央监控端口
        $scope.monitorShow = false;
        $scope.agentIP = "";       //代理服务IP
        $scope.agentPort = 0;     //代理服务端口
        $scope.agentShow = false;
        $scope.redisIP = "";       //redis服务IP
        $scope.redisPort = 0;     //redis服务端口
        $scope.redisShow = false;
        $scope.adInterval = 0;
        $scope.effective=5
        $scope.dollarNum = 0;
        $scope.clickNum = 0;


        $scope.edit = function (id) {
            switch (id) {
                case 1:
                    $scope.picShow = true;
                    break;
                case 2:
                    $scope.monitorShow = true;
                    break;
                case 3:
                    $scope.agentShow = true;
                    break;
                case 4:
                    $scope.redisShow = true;
                    break;
            }
        }
        //激活事件
        $scope.active = function (id) {
            switch (id) {
                case 1:
                    if (isPort($scope.picPort) && isIP($scope.picIP)) {
                        activeService($scope.picIP, $scope.picPort);
                    }
                    break;
                case 2:
                    if (isPort($scope.monitorPort) && isIP($scope.monitorIP)) {
                        activeIPPORT($scope.monitorIP, $scope.monitorPort, "content");
                    }
                    break;
                case 3:
                    if (isPort($scope.agentPort) && isIP($scope.agentIP)) {
                        activeIPPORT($scope.agentIP, $scope.agentPort, "agency");
                    }
                    break;
                case 4:
                    if (isPort($scope.redisPort) && isIP($scope.redisIP)) {

                    }
                    break;
            }
        }
        //激活内容服务和代理服务
        function activeIPPORT(ip,port,active) {
            httpService.post("DAAS", "UserAccountService", "ActiveIPPORT", { ip: ip, port: port,active:active}).then(function (data) {
                if (data.success=="true") {
                    Notification.success({ message: "激活成功！", delay: 1000 });
                    $scope.cancle(id);
                }
                else {
                    Notification.error({ message: "激活失败！", delay: 1000 });
                }
            }, function (e) {
                console.log("error:" + e)
            });
        }
        //修改保存事件
        $scope.save = function (id) {
            switch (id) {
                case 1:
                    if (isPort($scope.picPort) && isIP($scope.picIP)) {
                        updateConfig(id, $scope.picIP, $scope.picPort);
                    }
                    break;
                case 2:
                    if (isPort($scope.monitorPort) && isIP($scope.monitorIP)) {
                        updateConfig(id, $scope.monitorIP, $scope.monitorPort);
                    }
                    break;
                case 3:
                    if (isPort($scope.agentPort) && isIP($scope.agentIP)) {
                        updateConfig(id, $scope.agentIP, $scope.agentPort);
                    }
                    break;
                case 4:
                    if (isPort($scope.redisPort) && isIP($scope.redisIP)) {
                        updateConfig(id, $scope.redisIP, $scope.redisPort);
                    }
                    break;
            }
        }

        //取消事件
        $scope.cancle = function (id) {
            switch (id) {
                case 1:
                    $scope.picShow = false;
                    break;
                case 2:
                    $scope.monitorShow = false;
                    break;
                case 3:
                    $scope.agentShow = false;
                    break;
                case 4:
                    $scope.redisShow = false;
                    break;
            }
        }
        //验证端口号
        function isPort(str) {
            var parten = /^(\d)+$/g;
            if (parten.test(str) && parseInt(str) <= 65535 && parseInt(str) >= 0) {
                return true;
            } else {
                return false;
            }
        }
        //验证IP
        function isIP(ip) {
            var reIp = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
            if (ip == "") {
                Notification.error({ message: "请输入IP地址", delay: 5000 });
                return false;
            }
            if (reIp.test(ip)) {
                if (!(RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)) {
                    Notification.error({ message: "请输入正确的IP地址，如：10.3.45.10", delay: 3000 });
                    return false;
                }
                else
                    return true;
            }
            else {
                Notification.error({ message: "请输入正确的IP地址，如：10.3.45.10", delay: 3000 });
                return false;
            }
        }
        //验证是否是数字
        function isNum(num) {
            var parten = /^(\d)+$/g;
            if (parten.test(num) && parseInt(num) >= 0) {
                return true;
            } else {
                return false;
            }
        }
        //更新配置IP端口号
        function updateConfig(id, ip, port) {
            httpService.post("DAAS", "UserAccountService", "UpdateConfigIPByID", {
                id: id, ip_addr: ip, ip_port: port
            }).then(function (data) {
                if (data) {
                    Notification.success({ message: "保存成功！", delay: 1000 });
                    //$scope.cancle(id);
                }
                else {
                    Notification.error({ message: "编辑失败！", delay: 1000 });
                }
            }, function (e) {
                console.log("error:" + e)
            });
        }
        //激活IP/PORT服务配置
        function activeService(ip, port) {

            httpService.post("DAAS", "UserAccountService", "PicActiveService", { ip: ip, port: port }).then(function (data) {
                if (data) {
                    Notification.success({ message: "激活成功！", delay: 1000 });
                    $scope.cancle(id);
                }
                else {
                    Notification.error({ message: "激活失败！", delay: 1000 });
                }
            }, function (e) {
                console.log("error:" + e)
            });
        };
        //获得所有IP配置信息
        function getAllConfigInfo() {

            httpService.post("DAAS", "UserAccountService", "GetConfigIPList", {}).then(function (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        switch (data[i].IP_CONF_TYPE_ID) {
                            case 1:
                                $scope.picIP = data[i].IP_ADDR;
                                $scope.picPort = data[i].IP_PORT;
                                break;
                            case 2:
                                $scope.monitorIP = data[i].IP_ADDR;
                                $scope.monitorPort = data[i].IP_PORT;
                                break;
                            case 3:
                                $scope.agentIP = data[i].IP_ADDR;
                                $scope.agentPort = data[i].IP_PORT;
                                break;
                            case 4:
                                $scope.redisIP = data[i].IP_ADDR;
                                $scope.redisPort = data[i].IP_PORT;
                                break;
                        }
                    }

                } else {

                }
            }, function (e) {
                console.log("error:" + e)
            });
        }
        //调用方法
        getAllConfigInfo();

        $scope.adSubmit = function () {
            $scope.adInterval = parseInt($scope.adInterval);
            var reg = /\d+/;
            if (reg.test($scope.adInterval)) {
                httpService.post("DAAS", 'ADAccountService', 'UpdateInterval', { dict_id: $scope.adInterval }).then(function (data) {
                    if (data) {
                        Notification.success({ message: "提交成功", delay: 5000 });
                        getInterval();
                    } else {
                        Notification.error({ message: "提交失败，请稍后重试！", delay: 5000 });
                    }
                    
                }, function (e) {
                    Notification.error({ message: "提交失败，请稍后重试！", delay: 5000 });
                });
            } else {
                Notification.error({ message: "请输入数字", delay: 5000 });
            }
            console.log($scope.adInterval);
        }

        $scope.blackSubmit = function () {
            $scope.effective = parseInt($scope.effective);
            $scope.MessageText = "提交成功";
            var reg = /\d+/;
            if (reg.test($scope.effective)) {
                httpService.post("DAAS", "UserAccountService", "UpdateBlackListLife", {
                    lifeCycle: $scope.effective
                }).then(function (data) {
                    Notification.success({ message: $scope.MessageText, delay: 5000 });
                    getBlackTime();
                }, function (e) {
                    console.log("error:" + e)
                });
            } else {
                Notification.error({ message: "请输入数字", delay: 5000 });
            }

        }
        getBlackTime();
        getInterval();
        getAdClickSet();
        getAdDollarSet();
        //获得黑名单时间
        function getBlackTime() {
            httpService.get("DAAS", "UserAccountService", "Getblacktime").then(function (data) {
                $scope.effective = data.DICT_ID;
            }, function (e) {
                console.log("error:" + e)
            });
        }
        //获得广告投放间隔
        function getInterval() {
            httpService.get("DAAS", "UserAccountService", "GetInterval").then(function (data) {
                $scope.adInterval = data.dict_id;
                //$('#Text1').val(data.DICT_ID);
            }, function (e) {
                console.log("error:" + e)
            });
        }
        //获得广告点击数设置
        function getAdClickSet() {
            httpService.get("DAAS", "UserAccountService", "GetAdBaseSet", { key: "ad_click_set" }).then(function (data) {
                $scope.clickNum = data.dict_id;
            }, function (e) {
                console.log("error:" + e)
            });
        }
        //获得广告钱数设置
        function getAdDollarSet() {
            httpService.get("DAAS", "UserAccountService", "GetAdBaseSet", { key: "ad_dollar_set" }).then(function (data) {
                $scope.dollarNum = data.dict_id;
            }, function (e) {
                console.log("error:" + e)
            });
        }
        //基础价格配置
        $scope.baseSet = function () {
            if (isNum($scope.dollarNum) && isNum($scope.clickNum)) {
                var showper = parseFloat(1000 / $scope.dollarNum);
                var clickper = parseFloat($scope.clickNum / 1000);
                var num = 1;
                httpService.get("DAAS", "UserAccountService", "UpdateAdBaseSet", { dict_id: $scope.clickNum, key: "ad_click_set" }).then(function (data) {

                }, function (e) {
                    console.log("error:" + e)
                });
                httpService.get("DAAS", "UserAccountService", "UpdateAdBaseSet", { dict_id: $scope.dollarNum, key: "ad_dollar_set" }).then(function (data) {

                }, function (e) {
                    console.log("error:" + e)
                });
                httpService.get("DAAS", "UserAccountService", "UpdateAdBaseSet", { dict_id: clickper, key: "ad_clickpershow" }).then(function (data) {

                }, function (e) {
                    console.log("error:" + e)
                });
                httpService.get("DAAS", "UserAccountService", "UpdateAdBaseSet", { dict_id: showper, key: "ad_showperdollar" }).then(function (data) {

                }, function (e) {
                    console.log("error:" + e)
                });
                Notification.success({ message: "提交成功", delay: 10000 });
            }
            else {
                Notification.error({ message: "请输入整数", delay: 1000 });
            }
        }

    }];
})