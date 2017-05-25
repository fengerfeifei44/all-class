
define(['scripts/services/httpService', 'scripts/requireHelper/requireNotification', 'scripts/requireHelper/requireConfirm', 'scripts/requireHelper/requireUiBootstrap', 'scripts/requireHelper/requireConfirm', 'angular-confirm', 'bower_components/customUI/js/fixUI'],
function (exportService) {
    return ['$scope', 'httpService', 'Notification', '$confirm', '$uibModal',
    function ($scope, httpService, Notification, $confirm, $uibModal) {
        $scope.perItems = 19;    //页码显示的数量
        $scope.totalItems = 0//总数据量
        $scope.currentPage = 1;//当前页面
        $scope.numPages = 0;//页码
        $scope.maxSize = 5;//页码最多显示个数
        $scope.Load_Time = new Date();
        $scope.recharge_date = new Date();
        $scope.usr = false;
        $scope.showRechargeModel = false;
        function GetData() {
            $scope.searchContent = $scope.searchContent == "" ? undefined : $scope.searchContent;
            httpService.post("DAAS", "UserAccountService", "GetUsrReChargingListByName", {
                page: $scope.currentPage, pagesize: $scope.perItems, name: $scope.searchContent
            }).then(function (data) {
                //console.log(data);
                $scope.usrReChargingListData = data.Items;
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
           
            //console.log($scope.recharge_balance)
            
        }
       

        $scope.rechargeMoney =$scope.changeDiscount=function () {
            //console.log($scope.recharge_balance);
            //if ($scope.recharge_balance ==undefined) {
            //    $scope.moneyBig = "";
            //}
            if ($scope.recharge_balance == "" || $scope.recharge_balance == null) {
                //Notification.error({ message: "请输入充值金额", delay: 5000 });
                $scope.Site_Num = "";
                $scope.Show_Num = "";
                return false;
            }
            else if ($scope.discount == "" || $scope.discount == null) {
                //Notification.error({ message: "请输入折扣", delay: 5000 });
                $scope.Site_Num = "";
                $scope.Show_Num = "";

                return false;
            }
            else if ($scope.discount < 10 || $scope.discount > 100) {
                $scope.Site_Num = "";
                $scope.Show_Num = "";
                //Notification.error({ message: "请输入正确的折扣数", delay: 5000 });
                return false;
            } else {
                
               $scope.recharge_balance = parseFloat($scope.recharge_balance);
               $scope.discount2 = parseFloat($scope.discount);
               $scope.discount1 = $scope.discount / 100;
               $scope.Site_Num = ($scope.recharge_balance) / ($scope.discount1);
               $scope.Site_Num = parseInt($scope.Site_Num);
               $scope.Show_Num = (($scope.recharge_balance) / ($scope.discount1)) * 200;
               $scope.Show_Num = parseInt($scope.Show_Num);
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
            var maxNum = 999999999999999.9999; //最大处理的数字
            var IntegerNum; //金额整数部分
            var DecimalNum; //金额小数部分
            var ChineseStr = ""; //输出的中文金额字符串
            var parts; //分离金额后用的数组，预定义
            if (money == ""||money==undefined) {
                return "";
            }
            money = parseFloat(money);
            if (money >= maxNum) {
                alert('超出最大处理数字');
                return "";
            }
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
            if ($scope.Usr_Account_Name == "" || $scope.Usr_Account_Name == null) {
                Notification.error({ message: "请输入正确的用户名", delay: 5000 });
                return false;
            }
            if ($scope.cardNo == "" || $scope.cardNo == null) {
                Notification.error({ message: "请输入银行账号", delay: 5000 });
                return false;
            }
            if ($scope.recharge_balance == "" || $scope.recharge_balance == null) {
                Notification.error({ message: "请输入充值金额", delay: 5000 });
                return false;
            }
            if ($scope.discount == "" || $scope.discount == null) {
                Notification.error({ message: "请输入折扣", delay: 5000 });

                return false;
            }
            if ($scope.discount < 10 || $scope.discount > 100) {
                Notification.error({ message: "请输入正确的折扣数", delay: 5000 });
                return false;
            }

        }
        
      

//保存新建的充值记录
        $scope.saveRecharge = function () {
            console.log($scope.Usr_Account_Name)
           // $scope.Usr_Account_Name = $("#inputEmail3").val()
            if (validate() == false) {
                return;
            }
           
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
                    $scope.recharge_balance = parseFloat($scope.recharge_balance);
                    $scope.discount = parseFloat($scope.discount);
                    $scope.MessageText = "保存成功";

                    $scope.discount3 = $scope.discount / 10;
                    $scope.discount2 = $scope.discount / 100;
                    $scope.Site_Num = ($scope.recharge_balance) / ($scope.discount2);
                    $scope.Show_Num = (($scope.recharge_balance) / ($scope.discount2)) * 200;
                    $scope.Show_Num = parseInt($scope.Show_Num);
                    $scope.Site_Num = parseInt($scope.Site_Num);


                    httpService.post("DAAS", "UserAccountService", "AddUsrReCharging", {
                        name: $scope.Usr_Account_Name, id: $scope.Usr_Account_Id, bandName: $scope.bandName, cardNo: $scope.cardNo, recharge_balance: $scope.recharge_balance, discount: $scope.discount3, showNum: $scope.Show_Num, siteNum: $scope.Site_Num, loadTime: $scope.Load_Time, recharge_date: $scope.recharge_date, oldShowNum: $scope.oldShowNum, oldSiteNum: $scope.oldSiteNum
                    }).then(function (data) {

                        Notification.success({ message: $scope.MessageText, delay: 5000 });
                        GetData();

                        $scope.cancel();

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
                for (var i = 0; i <= $scope.usrReChargingListData.length; i++) {
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
        document.cookie = "link=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    }]


});








