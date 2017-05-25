define(['scripts/services/httpService', 'scripts/requireHelper/requireNotification', 'bootstrap'], function () {
    return ['$scope', 'httpService', 'Notification', function ($scope, httpService, Notification) {
        $scope.perItems = 9;    //页码显示的数量
        $scope.totalItems = 0//总数据量
        $scope.currentPage = 1;//当前页面
        $scope.numPages = 0;//页码
        $scope.maxSize = 5;//页码最多显示个数
        $scope.ADstatus = '4';
        $scope.interval = 5;


        function GetData() {
            $scope.AdName = $scope.AdName === "" ? undefined : $scope.AdName;
            if ($scope.ADstatus == "") { $scope.ADstatus = null };
            httpService.get("DAAS", 'ADAccountService', 'AllAdAccount', { page: $scope.currentPage, pagesize: $scope.perItems, status: $scope.ADstatus, ad_desc: $scope.AdName }).then(function (data) {
                $scope.totalItems = data.TotalCount;//总数据量
                //$scope.advert = dealData(data.Items, $scope.ADstatus);
                $scope.advert = data.Items;
                $scope.responseData = data;
                $scope.pageNumber = data.PageCount;
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
                        case 2:
                            o.ad_status_text = '待投放';
                            break;
                        case 3:
                            o.ad_status_text = '投放结束';
                            break;
                        case 4:
                            o.ad_status_text = '待审核';
                            break;
                        case 5:
                            o.ad_status_text = '审核不通过';
                            break;

                    }
                }
          
            }, function (errorMessage) {
                Notification.info({ message: errorMessage, delay: 5000 });
                console.log("info:" + errorMessage)
            });
        }
        GetData();
        $scope.searchDis = function () {
            $(".searchIcon").css("display", "none");
        }
        $scope.searchShow = function () {
            if ($scope.AdName == "" || $scope.AdName == null) {
                $(".searchIcon").css("display", "block");
            }

        }
        $scope.changeTabs = function ($event, status) {
            $('.adChange .active').removeClass("active");
            //console.log($($event.target));
            $($event.target).parent().addClass("active");
            $scope.ADstatus = status;
            if (status != 4) {
                $(".checkDiv").css("display", "none");
                $(".adListCon").css("width", "100%");
            } else {
                $(".checkDiv").css("display", "block");
                $(".adListCon").css("width", "89%");
            }
            GetData();
          
        }


        //点击搜索按钮按广告名称查询数据
        $scope.searchAD = function () {
            $scope.AdName = $scope.AdName === "" ? undefined : $scope.AdName;
            $scope.ADstatus = $scope.ADstatus === null ? undefined : $scope.ADstatus;
            //httpService.post("DAAS", 'ADAccountService', 'AllAdAccount', { page: $scope.currentPage, pagesize: $scope.perItems, status: $scope.ADstatus, ad_desc: $scope.AdName }).then(function (data) {
            //    console.log(data);
            //    $scope.totalItems = data.TotalCount;//总数据量
            //    $scope.advert = data.Items;
            //});
            GetData();
        }
      
        $scope.submit = function () {
            //console.log($scope.interval);
           window.intervalDeal = parseInt($scope.interval);
           
            var reg = /\d+/;
            if (reg.test($scope.interval)) {
                httpService.post("DAAS", 'ADAccountService', 'UpdateInterval', { dict_id: $scope.interval }).then(function (data) {
                    Notification.success({ message: "提交成功", delay: 5000 });
                    GetData();
                    
                }, function (errorMessage) {
                    Notification.error({ message: errorMessage, delay: 5000 });
                    console.log("error:" + errorMessage)
                });
            } else {
                Notification.error({ message: "输入格式不正确", delay: 5000 });
            }

        }

        if (window.intervalDeal == null) {
            $scope.interval = 5;
        } else {
            $scope.interval = window.intervalDeal;
        }
       
        
       
        //$scope.ADstatus = '5';
        $scope.statusSelect = function () {
            //$scope.options = $("#statusSelect option:selected");  //获取选中的项

            //$scope.ad_status_text = $scope.options.text();   //拿到选中项的文本
            GetData();
        }
        $scope.modalClick = function (event) {
            var imgUrl = $(event.target).html();
            var img = new Image();
            img.src = imgUrl;
            $('#M2Image').attr('src', 'imgs/load.gif');
            $('#M2cover').height(280);
            if (imgUrl != '') {
                //$scope.adImgUrl = imgUrl;
                img.onload = function () {                    
                    $('#M2cover').height(img.height * 360 / img.width);
                    $('#M2Image').attr('src', imgUrl);
                }                
            }
            //$('#myModal1').modal('show');
        }
        $scope.verifyClick = function ($event, status, imgurlstr, Hrefstr, CHARGING_TYPE, show_num, ad_desc, ad_id, AD_ACCOUNT_ID, AD_ACCOUNT_NAME) {
            if (status != 4) return;
            $('#myModal').modal('show');
            //var imgUrl = $($event.target).parents('tr').find('.imgurl').html();
            $scope.ad_id = $($event.target).parents('tr').find('.adId').html();
            $scope.ad_charging_type = CHARGING_TYPE;
            $scope.ad_show_num = show_num;
            $scope.ad_desc = ad_desc;
            $scope.adID = ad_id;
            $scope.AD_ACCOUNT_ID = AD_ACCOUNT_ID;
            $scope.AD_ACCOUNT_NAME = AD_ACCOUNT_NAME;
            $('#adImgUrl1').attr('src', 'imgs/load.gif');
            $('#adImgUrl2').attr('src', 'imgs/load.gif');
            $('.adImgHref1').attr("href", '#');
            $('.adImgHref2').attr("href", '#');
            $scope.adImgHref1 = '';
            $scope.adImgHref2 = '';
            var img1 = new Image();
            var img2 = new Image();
            if (imgurlstr.split('|').length == 2) {
                $('.adModal2').show();
                $('.adModal1').show();                
                img1.src = imgurlstr.split('|')[0];
                img2.src = imgurlstr.split('|')[0];
                img1.onload = function () {
                    $('#adImgUrl1').attr('src', imgurlstr.split('|')[0]);
                }
                img2.onload = function () {
                    $('#adImgUrl2').attr('src', imgurlstr.split('|')[1]);
                }
                
            } else {
                img1.src = imgurlstr;
                img1.onload = function () {
                    $('#adImgUrl1').attr('src', imgurlstr);
                }
                $('.adModal2').hide();
            }
            if (Hrefstr.split("|").length == 2) {
                $('.adImgHref1').attr("href", Hrefstr.split("|")[0]);
                $('.adImgHref2').attr("href", Hrefstr.split("|")[1]);
                $scope.adImgHref1 = Hrefstr.split("|")[0];
                $scope.adImgHref2 = Hrefstr.split("|")[1];
            } else {
                $('.adImgHref1').attr("href", Hrefstr);
                $('.adImgHref2').attr("href", Hrefstr);
                $scope.adImgHref1 = Hrefstr;
                $scope.adImgHref2 = Hrefstr;
            }
            //$scope.MUrl = '#myModal';
        }
        $scope.agreeClick = function () {
            httpService.get("DAAS", 'ADAccountService', 'UpdateAdStatus', { ad_id: $scope.adID, ad_status: '0', type: $scope.ad_charging_type, show_num: $scope.ad_show_num }).then(function (data) {
                //$scope.advert = dealData(data);
                GetData();
                Notification.success({ message: "审核通过", delay: 5000 });
                var messgecontent = "广告"+$scope.ad_desc + "审核通过";
                httpService.get("DAAS", 'UserAccountService', 'InsertUsermessage', { AD_ACCOUNT_ID: $scope.AD_ACCOUNT_ID, AD_ACCOUNT_NAME: $scope.AD_ACCOUNT_NAME, MESSAGE_CONT: messgecontent, MESSAGE_TYPE: 0, LINK_MESS: "", MESSAGE_LEVEL: "" }).then(function (data) {

                }, function (e) {
                });

            }, function (e) {
                Notification.error({ message: "审核失败，请稍后重试", delay: 5000 });
            });
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

        $scope.disagreeClick = function () {
            $scope.AD_COMMENTS= $scope.AD_COMMENTS==null?"":$scope.AD_COMMENTS;
            if ($scope.AD_COMMENTS == "") {
                Notification.error({ message: "请输入不通过原因", delay: 5000 });
                return;
            }
            $('#myModal').modal('hide');
            httpService.get("DAAS", 'ADAccountService', 'UpdateAdStatus', { ad_id: $scope.adID, ad_status: '5', AD_COMMENTS: $scope.AD_COMMENTS, CHARGING_TYPE: $scope.ad_charging_type, show_num: $scope.ad_show_num }).then(function (data) {
                Notification.success({ message: "审核不通过", delay: 5000 });
                GetData();
                var messgecontent = "广告" + $scope.ad_desc + "审核不通过";
                httpService.get("DAAS", 'UserAccountService', 'InsertUsermessage', { AD_ACCOUNT_ID: $scope.AD_ACCOUNT_ID, AD_ACCOUNT_NAME: $scope.AD_ACCOUNT_NAME, MESSAGE_CONT: messgecontent, MESSAGE_TYPE: 0, LINK_MESS: "",MESSAGE_LEVEL: "" }).then(function (data) {

                }, function (errorMessage) {
                    Notification.error({ message: errorMessage, delay: 5000 });
                    console.log("error:" + errorMessage)
                });
            }, function (e) {
                Notification.error({ message: "审核失败，请稍后重试", delay: 5000 });
            });
        }
    }]
});