define([ 'scripts/services/httpService'],
function (exportService) {
    return ['$scope', '$state', 'httpService', 
    function ($scope, $state, httpService) {
        $scope.flex = function () {            
            $(".sidebar").toggleClass("col-md-2");
            $(".sidebar").toggleClass("sidebar-flex");
            $(".sidebar").toggleClass("col-sm-2");
            $(".sidebar").toggleClass("col-xs-2");
            $(".main").toggleClass("col-sm-10");
            $(".main").toggleClass("col-md-10");
            $(".main").toggleClass("col-xs-10");
            $(".sidebar").toggleClass("col-md-1");
            $(".main").toggleClass("col-md-11");
            $(".sidebar").toggleClass("col-sm-1");
            $(".main").toggleClass("col-sm-11");
            $(".sidebar").toggleClass("col-xs-1");
            $(".main").toggleClass("col-xs-11");
            
           
            var imgObj=$("img.flex").attr("src");
            if (imgObj== "imgs/flex.png"){ 
                $("img.flex").attr("src", "imgs/flex2.png");
            }else{ 
                $("img.flex").attr("src", "imgs/flex.png");
            }
            
        }


        $("#menu li").click(function (event) {
            $("#menu li").eq($(this).index()).addClass("selectLi").siblings().removeClass('selectLi');
            document.cookie = "li=" + $(this).index();
            $("#menu li span.lineIcon").css("display", "none");
            

            $("#menu li:eq(0)").children("img.accountImg").attr('src', 'imgs/accountS.png');
            $("#menu li:eq(1)").children("img.moneyImg").attr('src', 'imgs/money.png');
            $("#menu li:eq(2)").children("img.adContentImg").attr('src', 'imgs/adcontent.png');
            $("#menu li:eq(3)").children("img.adEffectImg").attr('src', 'imgs/adeffect.png');
            $("#menu li:eq(4)").children("img.blackListImg").attr('src', 'imgs/blacklist.png');
            $("#menu li:eq(5)").children("img.systemLoginImg").attr('src', 'imgs/systemlogin.png');
            $("#menu li:eq(6)").children("img.usrfeedback3").attr('src', 'imgs/usrfeedback3.png');
            $("#menu li:eq(7)").children("img.tactics").attr('src', 'imgs/tactics.png');
            $("#menu li:eq(8)").children("img.platMo").attr('src', 'imgs/platMonitor1.png');
            //console.log($(this));
            $(this).children("span.lineIcon").css("display", "inline-block");
            switch ($(this).index()) {
                case 0:
                    $(this).children("img").attr('src', 'imgs/account.png');
                    break;
                case 1:
                    $(this).children("img").attr('src', 'imgs/moneyS.png');
                    break;
                case 2:
                    $(this).children("img").attr('src', 'imgs/adContentS.png');
                    break;
                case 3:
                    $(this).children("img").attr('src', 'imgs/adEffectS.png');
                    break;
                case 4:
                    $(this).children("img").attr('src', 'imgs/blackS.png');
                    break;
                case 5:
                    $(this).children("img").attr('src', 'imgs/systemS.png');
                    break;
                case 6:
                    $(this).children("img").attr('src', 'imgs/usrfeedback2.png');
                    break;
                case 7:
                    $(this).children("img").attr('src', 'imgs/tactics2.png');
                    break;
                case 8:
                    $(this).children("img").attr('src', 'imgs/platMonitor.png');
                    break;
            }

        })
       

        $(function () {
            
            var path = window.location.hash;
            var pathAry = path.split("/");
            //console.log(pathAry);
            //["#", "main", "marketingData", "accountManage"]
            var last = pathAry[pathAry.length - 1];
            //console.log(last);
            if (last == "accountManage") {
                $("#menu li").eq(0).addClass("selectLi");
                $("#menu li:eq(0)").children("img.accountImg").attr('src', 'imgs/account.png');
                $("#menu li").eq(0).children("span.lineIcon").css("display", "inline-block");
               
            } else if (last == "moneyManage") {
                
                $("#menu li").eq(1).addClass("selectLi");
                $("#menu li:eq(1)").children("img.moneyImg").attr('src', 'imgs/moneyS.png');
                $("#menu li").eq(1).children("span.lineIcon").css("display", "inline-block");
            } else if (last == "adContentManage") {
               
                $("#menu li").eq(2).addClass("selectLi");
                $("#menu li:eq(2)").children("img.adContentImg").attr('src', 'imgs/adContentS.png');
                $("#menu li").eq(2).children("span.lineIcon").css("display", "inline-block");
            } else if (last == "adEffect") {
               
                $("#menu li").eq(3).addClass("selectLi");
                $(".selectLi").find("img.adEffectImg").attr('src', 'imgs/adEffectS.png');
                $("#menu li").eq(3).children("span.lineIcon").css("display", "inline-block");
            } else if (last == "blackList") {
                $("#menu li").eq(4).addClass("selectLi");
                $("#menu li:eq(4)").children("img.blackListImg").attr('src', 'imgs/blackS.png');
                $("#menu li").eq(4).children("span.lineIcon").css("display", "inline-block");
            } else if (last == "systemLogin") {
                $("#menu li").eq(5).addClass("selectLi");
                $("#menu li:eq(5)").children("img.systemLoginImg").attr('src', 'imgs/systemS.png');
                $("#menu li").eq(5).children("span.lineIcon").css("display", "inline-block");
            } else if (last == "UsrFeedbackDetail") {
                $("#menu li").eq(6).addClass("selectLi");
                $("#menu li:eq(6)").children("img.usrfeedback2").attr('src', 'imgs/usrfeedback2.png');
                $("#menu li").eq(6).children("span.lineIcon").css("display", "inline-block");
            } else if (last == "webset") {
                $("#menu li").eq(7).addClass("selectLi");
                $("#menu li:eq(7)").children("img.tactics").attr('src', 'imgs/tactics2.png');
                $("#menu li").eq(7).children("span.lineIcon").css("display", "inline-block");
            } else if (last == "platMonitor") {
                $("#menu li").eq(8).addClass("selectLi");
                $("#menu li:eq(8)").children("img.tactics").attr('src', 'imgs/platMonitor.png');
                $("#menu li").eq(8).children("span.lineIcon").css("display", "inline-block");
            }

          
        });

    }]
});

         









