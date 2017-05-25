define(['scripts/services/httpService',
    'scripts/requireHelper/requireNotification',
    'scripts/requireHelper/requireUiBootstrap',
    'scripts/requireHelper/requireConfirm'], function () {
        return ['$scope', '$timeout', '$location', 'httpService', '$confirm', 'Notification', '$window', '$state', function ($scope, $timeout, $location, httpService, $confirm, Notification, $window, $state) {

            $(function () {
                $("ul.dropdown-menu").on("click", "[data-stopPropagation]", function (e) {
                    e.stopPropagation();
                });
            });

            //获取登录人员信息
            //httpService.post("DAAS", "MenuService", "GetCurrentUser", {}).then(
            //function (data) {
            //    $scope.currentUser = data;
                

            //})
            httpService.post("DAAS", "MenuService", "GetCurrentUser", {}).then(
            function (data) {
                $scope.currentUser = data;
            }, function (e) {
                location.href = "/login.html";
            })
          

            //修改秘密
            $scope.changePwd = function () {
                $scope.changePwdUri = $location.absUrl();
                $window.location.href = httpService.remoteUri + "index.html#/changePwd?uid=" + $scope.currentUser.Id + "&redirect_uri=" + $scope.changePwdUri
            }


            //注销
            $scope.cancel = function () {
               
                $scope.changePwdUri = $location.absUrl();
                $window.location.href = httpService.baseUri + "logout";
             
            }
            //$scope.returnMain = function () {
            //    function getCookie(li) {
            //        var strCookie = document.cookie;
            //        //S alert(strCookie);
            //        var arrCookie = strCookie.split("; ");
            //        for (var i = 0; i < arrCookie.length; i++) {
            //            var arr = arrCookie[i].split("=");
            //            if (arr[0] == "li") return arr[1];
            //        }
            //        return "";
            //    }
            //    var index = Number(getCookie("li"));
            //    if (index == 0) {
            //        $("#menu li:eq(0)").children("img.accountImg").attr('src', 'imgs/accountS.png');
            //    } else if (index == 1) {
            //        $("#menu li:eq(1)").children("img.moneyImg").attr('src', 'imgs/money.png');
            //    } else if (index == 2) {
            //        $("#menu li:eq(2)").children("img.adContentImg").attr('src', 'imgs/adcontent.png');
            //    } else if (index == 3) {
            //        $(".selectLi").find("img.adEffectImg").attr('src', 'imgs/adeffect.png');
            //    } else if (index == 4) {
            //        $("#menu li:eq(4)").children("img.blackListImg").attr('src', 'imgs/blacklist.png');
            //    } else if (index == 5) {
            //        $("#menu li:eq(5)").children("img.systemLoginImg").attr('src', 'imgs/systemlogin.png');
            //    } else if (index == 6) {
            //        $("#menu li:eq(6)").children("img.usrfeedback3").attr('src', 'imgs/usrfeedback3.png');
            //    } else if (index == 7) {
            //        $("#menu li:eq(7)").children("img.tactics").attr('src', 'imgs/tactics.png');
            //    }
            //    $("#menu li").eq(0).addClass("selectLi").siblings().removeClass('selectLi');
            //    $("#menu li span.lineIcon").css("display", "none");
            //    $("#menu li").eq(0).children("span.lineIcon").css("display", "inline-block");
            //    $("#menu li").eq(0).children("img").attr('src', 'imgs/account.png');
            //    document.cookie = "li=0";
             
            //}


            $("#menu>li").click(function (event) {
                //$("#menu li").eq($(this).index()).addClass("selectLi").siblings().removeClass('selectLi');
                document.cookie = "li=" + $(this).index();
                $("#menu>li span.lineIcon").css("display", "none");
                $(this).children("span.lineIcon").css("display", "inline-block");
            })
            $(function () {
                var path = window.location.hash;
                var pathAry = path.split("/");
                //console.log(pathAry);
                //["#", "main", "marketingData", "accountManage"]
                var last = pathAry[pathAry.length - 1];
                //console.log(last);
                if (last == "adContentManage") {
                    $("#menu>li").eq(0).children("span.lineIcon").css("display", "inline-block");

                } else if (last == "adEffect") {

                    $("#menu>li").eq(1).children("span.lineIcon").css("display", "inline-block");

                } else if (last == "blackList") {
                    $("#menu>li").eq(2).children("span.lineIcon").css("display", "inline-block");
                } else if (last == "moneyManage") {

                    $("#menu>li").eq(3).children("span.lineIcon").css("display", "inline-block");
                } else if (last == "accountManage") {
                    $("#menu>li").eq(4).children("span.lineIcon").css("display", "inline-block");
                }
                else if (last == "systemLogin") {
                    $("#menu>li").eq(4).children("span.lineIcon").css("display", "inline-block");
                } else if (last == "UsrFeedbackDetail") {
                    $("#menu>li").eq(4).children("span.lineIcon").css("display", "inline-block");
                }



            });

















            $('.dropdown-toggle').dropdown();

            





        }]
    });