﻿
define(['scripts/services/httpService', 'scripts/requireHelper/requireNotification', 'scripts/requireHelper/requireConfirm', 'scripts/requireHelper/requireUiBootstrap', 'scripts/requireHelper/requireConfirm', 'angular-confirm', 'bower_components/customUI/js/fixUI'],
function (exportService) {
    return ['$scope', 'httpService', 'Notification', '$confirm', '$uibModal',
    function ($scope, httpService, Notification, $confirm, $uibModal) {
        $scope.perItems = 16;    //页码显示的数量
        $scope.totalItems = 0//总数据量
        $scope.currentPage = 1;//当前页面
        $scope.numPages = 0;//页码
        $scope.maxSize = 5;//页码最多显示个数
        $scope.Load_Time = new Date();
        $scope.recharge_date = new Date();
        $scope.usr = false;
        $scope.showRechargeModel = false;
        $scope.recharge = true;
        $scope.refund = false;
        $scope.discountShow = true;
        $scope.numShow = true;
        $scope.rechargeType = 0;//交易类型（默认充值0 充值 1 退款）
        var maxNum = 1000000; //最大处理的数字
        function GetData() {
            $scope.searchContent = $scope.searchContent == "" ? undefined : $scope.searchContent;
            httpService.post("DAAS", "UserAccountService", "GetUsrReChargingListByName", {
                page: $scope.currentPage, pagesize: $scope.perItems, name: $scope.searchContent
            }).then(function (data) {
                //console.log(data);
                $scope.usrReChargingListData = data.Items;
                $scope.responseData = data;
                $scope.pageNumber = data.PageCount;
                //for (var i = 0; i <= $scope.usrReChargingListData.length; i++) {
                //    var cur = $scope.usrReChargingListData[i];
                //    cur.Site_Num = parseInt(cur.Show_Num / 200);
                //}
                for (var i = 0; i < $scope.usrReChargingListData.length; i++) {
                    var cur = $scope.usrReChargingListData[i];
                    cur.Site_Num_Deal = parseInt(cur.Show_Num / 200);          
                }

                $scope.totalItems = data.TotalCount;//总数据量
            }, function (e) {
                console.log("error:" + e)
            });
        }
        $scope.searchDis = function () {
            $(".searchIcon").css("display", "none");
        }
        $scope.searchShow = function () {
            if ($scope.searchContent == "" || $scope.searchContent == null) {
                $(".searchIcon").css("display", "block");
            }

        }
        //当新建充值记录的时候初始化数据为空
        $scope.addRecharge = function () {
           
            $('#myModal5').modal('show');
            $scope.Usr_Account_Name = "";
            $scope.bandName = "";
            $scope.cardNo = "";
            $scope.recharge_balance = "";
            $scope.discount = "";
            $scope.moneyBig = "";
            $scope.Show_Num = "";
            $scope.Site_Num = "";
            $scope.recharge = true;
            $scope.refund = false;
            $scope.discountShow = true;
            $scope.numShow = true;
            $scope.rechargeType = 0;


        }
        //交易类型为充值时，折扣和展示数显示
        $scope.rechargeS = function () {
            $scope.recharge = true;
            $scope.refund = false;
            $scope.discountShow = true;
            $scope.numShow = true;
            $scope.rechargeType = 0;

        }
        //交易类型为退款时，折扣和展示数隐藏
        $scope.refundS = function () {
            $scope.refund = true;
            $scope.recharge = false;
            $scope.discountShow = false;
            $scope.numShow = false;
            $scope.rechargeType = 1;
        }


        //根据用户输入的值获取所有相关的用户名
        $scope.userShow = function () {
            httpService.post("DAAS", "UserAccountService", "GetUsrAccountList", {
                page: 1, pagesize: 5, name: $scope.Usr_Account_Name
            }).then(function (data) {
                //console.log(data);
                $scope.userAccountData = data.Items;
                if ($scope.userAccountData.length > 0) {
                    $scope.usr = true;
                }
                $scope.totalItems = data.TotalCount;//总数据量
            }, function (e) {
                console.log("error:" + e)
            });

        }
      


        $scope.clickSelectUser = function (event) {
            $("#inputEmail3").val($(event.target).text());
            $scope.Usr_Account_Name = $("#inputEmail3").val()
            $scope.usr = false;
        }
        $scope.disappear = function (event) {
            //var e = $(event.target);
            //console.log(e);
           $scope.usr = false;
        }
        $scope.usrInput = function (e) {
            e = e || window.event;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        };

        //将用户输入的金额转换为文字显示
        $scope.money = function () {
           
            $scope.moneyBig = changeNumMoneyToChinese($scope.recharge_balance);
        }
       // 获取 （点击数/展示数）的值
        httpService.get("DAAS", "UserAccountService", "GetAdBaseSet", { key: "ad_clickpershow" }).then(function (data) {
            $scope.ad_clickpershow = data.dict_id;
        }, function (errorMessage) {
            Notification.info({ message: errorMessage, delay: 5000 });
            console.log("error:" + errorMessage)
        });
        // 获取 （展示数/元）的值
        httpService.get("DAAS", "UserAccountService", "GetAdBaseSet", { key: "ad_showperdollar" }).then(function (data) {
            $scope.ad_showperdollar = data.dict_id;
        }, function (errorMessage) {
            Notification.info({ message: errorMessage, delay: 5000 });
            console.log("error:" + errorMessage)
        });


        $scope.rechargeMoney = $scope.changeDiscount = function () {
          
            if ($scope.recharge_balance == "" || $scope.recharge_balance == null) {
                $scope.Site_Num = "";
                $scope.Show_Num = "";
                return false;
            }else{
             var regB = /^[+]?(\d|([1-9]\d+))(\.\d+)?$/;
                
            if (!regB.test($scope.recharge_balance)) {
                //Notification.info({ message: "请输入有效金额(数字)!", delay: 5000 });
                $scope.Site_Num = "";
                $scope.Show_Num = "";
                return "";
            }
            $scope.recharge_balance1 = parseFloat($scope.recharge_balance);
            //if (isNaN($scope.recharge_balance1)) {
            //    Notification.info({ message: "请输入有效金额(数字)！", delay: 5000 });
            //    return false;
            //}      
            //$scope.recharge_balance2 = $scope.recharge_balance1.toFixed(2);
           
        }

           if ($scope.discount == "" || $scope.discount == null) {
                $scope.Site_Num = "";
                $scope.Show_Num = "";

                return false;
            }else if ($scope.discount < 10 || $scope.discount > 100) {
                $scope.Site_Num = "";
                $scope.Show_Num = "";
                //Notification.error({ message: "请输入正确的折扣数", delay: 5000 });
                return false;
            } else {
                //toFixed
                //var reg = /^[0-9]\d*(\.\d+)?$/;
                $scope.recharge_balance1 = parseFloat($scope.recharge_balance);
               
                $scope.discount2 = parseFloat($scope.discount);
                $scope.discount1 = $scope.discount / 100;
                $scope.Show_Num = (($scope.recharge_balance1) / ($scope.discount1)) * $scope.ad_showperdollar;
                $scope.Show_Num = parseInt($scope.Show_Num);
                //console.log($scope.Site_Num = (($scope.recharge_balance) / ($scope.discount1)) * $scope.ad_showperdollar * $scope.ad_clickpershow);
                $scope.Site_Num = $scope.Show_Num * $scope.ad_clickpershow;
                $scope.Site_Num = parseInt($scope.Site_Num);

               //$scope.recharge_balance = parseFloat($scope.recharge_balance);
               //$scope.discount2 = parseFloat($scope.discount);
               //$scope.discount1 = $scope.discount / 100;
               //$scope.Site_Num = ($scope.recharge_balance) / ($scope.discount1);
               //$scope.Site_Num = parseInt($scope.Site_Num);
               //$scope.Show_Num = (($scope.recharge_balance) / ($scope.discount1)) * 200;
               //$scope.Show_Num = parseInt($scope.Show_Num);
           }
            
        }
        


        // 将数字转换成货币形式
        function changeNumMoneyToChinese(money) {
            var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
            var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
            var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
            var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
            var cnInteger = "整"; //整数金额时后面跟的字符
            var cnIntLast = "元"; //整型完以后的单位
            
            var IntegerNum; //金额整数部分
            var DecimalNum; //金额小数部分
            var ChineseStr = ""; //输出的中文金额字符串
            var parts; //分离金额后用的数组，预定义
            if (money == ""||money==undefined) {
                return "";
            }
            money = parseFloat(money);
            //if (money >= maxNum) {
            //    Notification.error({ message: "最大充值金额为100万，请分次输入", delay: 5000 });
            //    return "";
            //}
            if (money == 0) {
                ChineseStr = cnNums[0] + cnIntLast + cnInteger;
                return ChineseStr;
            }
            money = money.toString(); //转换为字符串
            if (money.indexOf(".") == -1) {
                IntegerNum = money;
                DecimalNum = '';
            } else {
                parts = money.split(".");
                IntegerNum = parts[0];
                DecimalNum = parts[1].substr(0, 4);
            }
            if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
                var zeroCount = 0;
                var IntLen = IntegerNum.length;
                for (var i = 0; i < IntLen; i++) {
                    var n = IntegerNum.substr(i, 1);
                    var p = IntLen - i - 1;
                    var q = p / 4;
                    var m = p % 4;
                    if (n == "0") {
                        zeroCount++;
                    } else {
                        if (zeroCount > 0) {
                            ChineseStr += cnNums[0];
                        }
                        zeroCount = 0; //归零
                        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                    }
                    if (m == 0 && zeroCount < 4) {
                        ChineseStr += cnIntUnits[q];
                    }
                }
                ChineseStr += cnIntLast;
                //整型部分处理完毕
            }
            if (DecimalNum != '') { //小数部分
                var decLen = DecimalNum.length;
                for (var i = 0; i < decLen; i++) {
                    var n = DecimalNum.substr(i, 1);
                    if (n != '0') {
                        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
                    }
                }
            }
            if (ChineseStr == '') {
                ChineseStr += cnNums[0] + cnIntLast + cnInteger;
            } else if (DecimalNum == '') {
                ChineseStr += cnInteger;
            }
            return ChineseStr;

        }

        $scope.usrMessage=function() {
            httpService.post("DAAS", "UserAccountService", "GetUsrAccountByName", {
                userName: $scope.Usr_Account_Name
            }).then(function (data) {
                // console.log(data);
                if (data.length > 0) {
                        $scope.userData = data;         
                        $scope.Usr_Account_Id = data[0].USR_ACCOUNT_ID;
                        $scope.oldShowNum = data[0].SHOW_NUM;
                        $scope.oldSiteNum = data[0].SITE_NUM;
                        if ($scope.oldShowNum == null) {

                            $scope.oldShowNum = 0;
                        }

                        if ($scope.oldSiteNum == null) {
                            $scope.oldSiteNum = 0;
                        }
                        console.log($scope.userData)
                        return $scope.userData;
                    
                } 
                
               

            }, function (e) {

                console.log("error:" + e)
            });
        }
        function validate() {
            var regMoney = /^\d+$/;
            //toFixed
            //var regB = /^[0-9]\d*(\.\d+)?$/;
            if ($scope.Usr_Account_Name == "" || $scope.Usr_Account_Name == null) {
                Notification.info({ message: "请输入用户名", delay: 5000 });
                return false;
            }
            if ($scope.recharge_balance == "" || $scope.recharge_balance == null) {
                Notification.info({ message: "请输入金额", delay: 5000 });
                return false;
            }
            if ($scope.recharge_balance <= 0) {
                Notification.info({ message: "充值金额不能小于等于0", delay: 5000 });
                return "";
            }
            if ($scope.recharge_balance > maxNum) {
                Notification.info({ message: "最大充值金额为100万，请分次输入", delay: 5000 });
                return "";
            }
            var regB = /^[+]?(\d|([1-9]\d+))(\.\d+)?$/;
            //$scope.rechargeMoney();
            if (!regB.test($scope.recharge_balance)) {
                Notification.info({ message: "请输入有效金额(数字)!", delay: 5000 });
                return "";
            }
            $scope.recharge_balance1 = parseFloat($scope.recharge_balance);
            //if (isNaN($scope.recharge_balance1)) {
            //    Notification.info({ message: "请输入有效金额(数字)！", delay: 5000 });
            //    return false;
            //}
           
            if ($scope.discount == "" || $scope.discount == null) {
                Notification.info({ message: "请输入折扣", delay: 5000 });
                return false;
            }
            if ($scope.discount < 10 || $scope.discount > 100) {
                Notification.info({ message: "折扣数取值范围在10-100之间", delay: 5000 });
                return false;
            }         
        }
        function validateBack() {
            if ($scope.Usr_Account_Name == "" || $scope.Usr_Account_Name == null) {
                Notification.info({ message: "请输入用户名", delay: 5000 });
                return false;
            }
            
            if ($scope.recharge_balance == "" || $scope.recharge_balance == null) {
                Notification.info({ message: "请输入金额", delay: 5000 });
                return false;
            }
            var regB = /^[+]?(\d|([1-9]\d+))(\.\d+)?$/;
            //$scope.rechargeMoney();
            if (!regB.test($scope.recharge_balance)) {
                Notification.info({ message: "请输入有效金额(数字)!", delay: 5000 });
                return "";
            }
            $scope.recharge_balance1 = parseFloat($scope.recharge_balance);
            //if (isNaN($scope.recharge_balance1)) {
            //    Notification.info({ message: "请输入有效金额(数字)！", delay: 5000 });
            //    return false;
            //}
            
           
        }
        
      

//保存新建的充值记录
        $scope.saveRecharge = function () {
            $scope.MessageText = "保存成功";
            console.log($scope.Usr_Account_Name)
            if ($scope.recharge == true) {
                if (validate() == false) {
                    return;
                }
            }
            if ($scope.refund == true) {       
                if (validateBack() == false) {
                    return;
                }
            }     
            httpService.post("DAAS", "UserAccountService", "GetUsrAccountByName", {
                userName: $scope.Usr_Account_Name
            }).then(function (data) {
                if (data.length > 0) {
                    $scope.userData = data;
                    $scope.Usr_Account_Id = data[0].USR_ACCOUNT_ID;
                    $scope.oldShowNum = data[0].SHOW_NUM;
                    $scope.oldSiteNum = data[0].SITE_NUM;
                    if ($scope.oldShowNum == null) {

                        $scope.oldShowNum = 0;
                    }

                    if ($scope.oldSiteNum == null) {
                        $scope.oldSiteNum = 0;
                    }
                    
                    if ($scope.rechargeType == 0) {
                        //$scope.recharge_balance = parseFloat($scope.recharge_balance);
                        
                        //var regB = /^[0-9]\d*(\.\d+)?$/;
                        //var regB = /^[+]?(\d|([1-9]\d+))(\.\d+)?$/;
                        //$scope.rechargeMoney();
                        //if (!regB.test($scope.recharge_balance)) {
                        //    Notification.info({ message: "请输入输入有效金额(数字)!", delay: 5000 });
                        //    return "";
                        //}
                        $scope.recharge_balance1= parseFloat($scope.recharge_balance);
                        //if (isNaN($scope.recharge_balance1)) {
                        //    Notification.info({ message: "请输入有效金额(数字)！", delay: 5000 });
                        //    return false;
                        //}
                        
                        //$scope.recharge_balance2 = $scope.recharge_balance1.toFixed(2);
                        //$scope.recharge_balance2 = parseFloat($scope.recharge_balance1);
                        
                        $scope.discount = parseFloat($scope.discount);            
                        $scope.discount3 = $scope.discount / 10;
                        $scope.discount2 = $scope.discount / 100;
                        $scope.Show_Num = (($scope.recharge_balance1) / ($scope.discount2)) * $scope.ad_showperdollar;
                        $scope.Show_Num = parseInt($scope.Show_Num);
                       
                        $scope.Site_Num = $scope.Show_Num * $scope.ad_clickpershow;
                        $scope.Site_Num = parseInt($scope.Site_Num);

                        //$scope.Site_Num = ($scope.recharge_balance3) / ($scope.discount2);
                        //$scope.Show_Num = (($scope.recharge_balance3) / ($scope.discount2)) * 200;
                        //$scope.Show_Num = parseInt($scope.Show_Num);
                        //$scope.Site_Num = parseInt($scope.Site_Num);
                    } else if ($scope.rechargeType == 1) {
                        $scope.discount3 = undefined;
                        $scope.Site_Num = undefined;
                        if ($scope.oldShowNum == 0) {
                            Notification.info({ message: "新用户第一次交易不能退款", delay: 5000 });
                            return;
                        }
                        if ($scope.showBack > $scope.oldShowNum) {
                            Notification.info({ message: "展示数不能大于剩余展示数" + $scope.oldShowNum, delay: 5000 });

                            return;
                        }
                        $scope.Show_Num = $scope.showBack;
                        
                    }
                   
                    httpService.post("DAAS", "UserAccountService", "AddUsrReCharging", {
                        name: $scope.Usr_Account_Name, id: $scope.Usr_Account_Id, recharge_balance: $scope.recharge_balance1, discount: $scope.discount3, showNum: $scope.Show_Num, siteNum: $scope.Site_Num, oldShowNum: $scope.oldShowNum, oldSiteNum: $scope.oldSiteNum, recharge_type: $scope.rechargeType
                    }).then(function (data) {

                        Notification.success({ message: $scope.MessageText, delay: 5000 });
                        GetData();
                        $scope.cancel();
                        var messgecontent = "";
                        var messageType = 3;
                        if ($scope.rechargeType == 0)
                            messgecontent = "充值" + $scope.recharge_balance + "元，获得" + $scope.Show_Num + "展示数";
                        else {
                            messgecontent = "退款" + $scope.recharge_balance + "元";
                            messageType = 4;
                        }
                        httpService.get("DAAS", 'UserAccountService', 'InsertUsermessage', { AD_ACCOUNT_ID: $scope.Usr_Account_Id, AD_ACCOUNT_NAME: $scope.Usr_Account_Name, MESSAGE_CONT: messgecontent, MESSAGE_TYPE: messageType, LINK_MESS: "", MESSAGE_LEVEL: "" }).then(function (data) {

                        }, function (e) {
                        });
                    }, function (e) {
                        console.log("error:" + e)
                    });
                    
                } else {
                    Notification.error({ message: "用户名不正确", delay: 5000 });
                }



            }, function (e) {

                console.log("error:" + e)
            });
           
        }
        $scope.cancel = function () {
           
            $('#myModal5').modal('hide');
         
        }

        //如果是从账号管理页面查看充值记录就根据ID查询充值记录，如果是初始化页面是根据名称查询充值记录。
        function getCookie(link) {
            var strCookie = document.cookie;
            //S alert(strCookie);
            var arrCookie = strCookie.split("; ");
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split("=");
                if (arr[0] == "link") return arr[1];
            }
            return "";
        }
        var linkCookie = getCookie("link");
        //console.log(linkCookie);

        if (linkCookie !== "userAccount") {
            GetData();
            
        } else {
            
            httpService.post("DAAS", "UserAccountService", "GetUsrReChargingListById", {
                page: $scope.currentPage, pagesize: $scope.perItems, id: userAccountId
            }).then(function (data) {
                //console.log(data);
                $scope.usrReChargingListData = data.Items;
                for (var i = 0; i < $scope.usrReChargingListData.length; i++) {
                    var cur = $scope.usrReChargingListData[i];
                    cur.Site_Num = parseInt(cur.Show_Num / 200);
                }

                $scope.totalItems = data.TotalCount;//总数据量
            }, function (e) {
                console.log("error:" + e)
            });
        }



       //根据用户账号名称进行搜索
        $scope.search = function () {
            
           
            //$scope.searchContent = $scope.searchContent == "" ? undefined : $scope.searchContent;
            GetData();
            //httpService.post("DAAS", "UserAccountService", "GetUsrReChargingListByName", {
            //    page: $scope.currentPage, pagesize: $scope.perItems, name: $scope.searchContent
            //}).then(function (data) {
            //    //console.log(data);
            //    $scope.usrReChargingListData = data.Items;

            //    $scope.totalItems = data.TotalCount;//总数据量
            //}, function (e) {
            //    console.log("error:" + e)
            //});
        }


        //实现分页
        $scope.pageChanged = function (page, pageCount) {
            $scope.currentPage = page;//当前页面
            GetData();

        };
        $scope.sure = function () {
            console.log($scope.ye);
            //console.log($scope.pageNumber)
            $scope.ye = Number($scope.ye);
            if ($scope.ye && $scope.ye > 0 && $scope.ye <= $scope.pageNumber) {
                $scope.currentPage = $scope.ye;
                GetData();
            } else {
                $scope.ye = "";
            }

        }
        document.cookie = "link=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    }]


});








