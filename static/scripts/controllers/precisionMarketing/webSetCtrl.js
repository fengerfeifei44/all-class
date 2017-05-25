
define(['scripts/controllers/precisionMarketing/uploadCtrl', 'scripts/services/httpService', 'scripts/requireHelper/requireNotification', 'scripts/requireHelper/requireConfirm', 'scripts/requireHelper/requireUiBootstrap', 'scripts/requireHelper/requireConfirm', 'angular-confirm', 'bower_components/customUI/js/fixUI'],
function (uploadCtrl,exportService) {
    return ['$scope', 'httpService', 'Notification', '$confirm', '$uibModal',
    function ($scope, httpService, Notification, $confirm, $uibModal) {
        $scope.perItems = 16;    //页码显示的数量
        $scope.totalItems = 0//总数据量
        $scope.currentPage = 1;//当前页面
        $scope.numPages = 0;//页码
        $scope.maxSize = 5;//页码最多显示个数
        $scope.Load_Time = new Date();
        $scope.Usr_Account_Name = "";
        $scope.edit_pc_adress_y = 'left';
        $scope.pc_adress_y = 'left';        
        function GetData() {            
            var obj = {};
            obj.page = $scope.currentPage;
            obj.pagesize = $scope.perItems;
            if ($scope.SWEB_CONTENT != null && $scope.SWEB_CONTENT != "") {
                obj.WEB_CONTENT = $scope.SWEB_CONTENT;
            }
            httpService.post("DAAS", "UserAccountService", "SearchWebSet", obj).then(function (data) {
                //console.log(data);
                $scope.userAccountData = data.Items;
                $scope.responseData = data;
                $scope.pageNumber = data.PageCount;
                $scope.totalItems = data.TotalCount;//总数据量
            }, function (errorMessage) {
                Notification.info({ message: errorMessage, delay: 5000 });
                console.log("info:" + errorMessage)
            });
        }
        GetData();
        $scope.addUser = function () {
            $('#myModal6').modal('show');
            $scope.WEB_CONTENT = "";
            $scope.WEB_HOST = "";
            $scope.JS_CONTENT = "";
            $scope.AD_PC_POSITION = "";
            $scope.AD_APP_POSITION = 'center';
        }
        //选中全部/取消全部选中
        $scope.CheckAll = function () {
            for (var i = 0; i < $scope.userAccountData.length; i++) {
                $scope.userAccountData[i].IsChecked = $scope.ischeckall;
            }
        }
        var regWeb = /^[a-zA-Z0-9\u4e00-\u9fa5][\w\.\u4e00-\u9fa5]*$/;
        //var regHost = /^[a-zA-Z0-9\u4e00-\u9fa5]?[\w\.\u4e00-\u9fa5]*$/;
        //var regHost = /^[a-zA-Z0-9\u4e00-\u9fa5]?[\w\.\u4e00-\u9fa5]*$/;
        //var regPath = /[a-zA-z]+:\/\/[^\s]*/;
        var regHost = /^[^@#$&*￥]*$/;
        //var regPath = /^[a-zA-Z0-9][^\s\u4e00-\u9fa5]*$/;
        $scope.saveAddUser = function () {
            
            $scope.MessageText = "保存成功";
            if ($scope.WEB_CONTENT == "" || $scope.WEB_CONTENT == null) {
                Notification.error({ message: "请输入网站名称", delay: 5000 });
                return false;
            }
            if (!regWeb.test($scope.WEB_CONTENT)) {
                Notification.error({ message: "网站名称由字母、数字、下划线、中文组成，并且下划线不能开头", delay: 5000 });
                return false;
            }
            if ($scope.WEB_HOST != "" && $scope.WEB_HOST != null) {
                if (!regHost.test($scope.WEB_HOST)) {
                    Notification.error({ message: "请输入正确的网站地址，如：http://www.baidu.com", delay: 5000 });
                    return false;
                }
            }
           

            if ($scope.JS_CONTENT == "" || $scope.JS_CONTENT == null) {
                Notification.error({ message: "请输入JS路径", delay: 5000 });
                return false;
            }
            if (!regHost.test($scope.JS_CONTENT)) {
                Notification.error({ message: "请输入正确的js路径，如：http://js/jquery.js", delay: 5000 });
                return false;
            }

            var wsm = {};
            wsm.WEB_CONTENT = $scope.WEB_CONTENT;
            wsm.WEB_HOST = $scope.WEB_HOST;
            wsm.JS_CONTENT = $scope.JS_CONTENT;
            if ($scope.pc_adress_x == null) {
                $scope.pc_adress_x = "";
            }
            wsm.AD_PC_POSITION = $scope.pc_adress_y + ' ' + $scope.pc_adress_x;
           
            wsm.AD_APP_POSITION = $scope.AD_APP_POSITION;
            httpService.post("DAAS", "UserAccountService", "addWebSet", {
                wsm:wsm
            }).then(function (data) {
                if (data.result) {
                    $('#myModal6').modal('hide');
                    Notification.success({ message: $scope.MessageText, delay: 5000 });
                    GetData();
                } else {
                    $('#myModal6').modal('show');
                    Notification.error({ message: data.msg, delay: 5000 });
                }
            }, function (e) {
                Notification.error({ message: "与服务器断开连接", delay: 5000 });
            });
        }





        $scope.editUser = function () {
            //$('#myModal7').modal('show');
            var count = 0;
            $scope.userAccountData.forEach(function (i) {
                if (i.IsChecked == true) {
                    count++;
                    var itemselected = i;
                    $scope.edit_WEB_CONTENT = itemselected.WEB_CONTENT;
                    $scope.edit_WEB_JS_ID = itemselected.WEB_JS_ID;
                    $scope.edit_WEB_HOST = itemselected.WEB_HOST;
                    $scope.edit_JS_CONTENT = itemselected.JS_CONTENT;
                    $scope.edit_pc_adress_y = itemselected.AD_PC_POSITION.split(" ")[0];
                    $scope.edit_pc_adress_x = itemselected.AD_PC_POSITION.split(" ")[1];
                    $scope.edit_AD_APP_POSITION = itemselected.AD_APP_POSITION;
                }
            })
            if (count == 0) {
                Notification.info({ message: "无账号可编辑", delay: 5000 });
            } else {
                $('#myModal7').modal('show');
            }


        }

        $scope.saveEditUser = function () {

            $scope.MessageText = "保存成功";

            if ($scope.edit_WEB_CONTENT == "" || $scope.edit_WEB_CONTENT == null) {
                Notification.error({ message: "请输入网站名称", delay: 5000 });
                return false;
            }
            if (!regWeb.test($scope.edit_WEB_CONTENT)) {
                Notification.error({ message: "网站名称由字母、数字、下划线、中文组成，并且下划线不能开头", delay: 5000 });
                return false;
            }
            if (!regHost.test($scope.edit_WEB_HOST)) {
                Notification.error({ message: "网站地址由字母、数字、下划线、中文组成，并且下划线不能开头", delay: 5000 });
                return false;
            }

            if ($scope.edit_JS_CONTENT == "" || $scope.edit_JS_CONTENT == null) {
                Notification.error({ message: "请输入JS路径", delay: 5000 });
                return false;
            }
            if (!regHost.test($scope.edit_JS_CONTENT)) {
                Notification.error({ message: "请输入正确的js路径", delay: 5000 });
                return false;
            }


            var wsm = {};
            wsm.WEB_CONTENT = $scope.edit_WEB_CONTENT;
            wsm.WEB_HOST = $('#edit_WEB_HOST').val();
            wsm.JS_CONTENT = $scope.edit_JS_CONTENT;
            wsm.AD_PC_POSITION = $scope.edit_AD_PC_POSITION;
            wsm.AD_PC_POSITION = $scope.edit_pc_adress_y + ' ' + $('#edit_pc_adress_x').val() ;
            wsm.AD_APP_POSITION = $scope.edit_AD_APP_POSITION;
            wsm.WEB_JS_ID = $scope.edit_WEB_JS_ID;
            httpService.post("DAAS", "UserAccountService", "modifyWebSet", { wsm: wsm }).then(function (data) {
                if (data.result) {
                    $('#myModal7').modal('hide');
                    Notification.success({ message: $scope.MessageText, delay: 5000 });
                    GetData();
                } else {
                    Notification.error({ message: data.msg, delay: 5000 });
                }
            }, function (e) {
                Notification.error({ message: "与服务器断开连接", delay: 5000 });
            });
        }


        $scope.getids = function () {
            var ids = [];
            if ($scope.userAccountData) {
                for (var i = 0; i < $scope.userAccountData.length; i++) {
                    if ($scope.userAccountData[i].IsChecked == true) {
                        ids.push($scope.userAccountData[i]);
                    }
                }
            }

            return ids;
        }
        //$scope.getids = function () {
        //    var ids = [];
        //    if ($scope.userAccountData) {
        //        for (var i = 0; i < $scope.userAccountData.length; i++) {
        //            if ($scope.userAccountData[i].IsChecked == true) {

        //                    ids.push( $scope.userAccountData[i].Usr_Account_Id);

        //            }
        //        }
        //    }

        //    return ids;
        //}

        $scope.delete = function (id) {
            var objAry = $scope.getids();
            if (objAry.length==0) {
                Notification.info({ message: "请选择要删除的数据", delay: 5000 });
                return;
            }
            $confirm({ text: '是否要删除所选内容' })
                 .then(function () {
                     httpService.post("DAAS", "UserAccountService", "deleteWebset", {
                         wsms: objAry
                     }).then(function (data) {
                         if (data.result) {
                             GetData();
                             Notification.success({ message: "删除成功", delay: 5000 });
                         } else {
                             Notification.success({ message: data.msg, delay: 5000 });
                         }
                         
                     }, function (e) {
                         Notification.error({ message: "操作失败，请重试", delay: 5000 });
                     });
                 })
        }

        $scope.searchUserAccount = function () {
            GetData();
        }
        $scope.viewRechargeRecord = function (event) {

            console.log(event.target);
            var usrIndex = $(event.target).parent().parent().find("td.usrIndex").text();
            $scope.userAccountData.forEach(function (i) {
                if (i.RowIndex == usrIndex) {
                    var selected = i;
                    $scope.userId = selected.Usr_Account_Id;
                    window.userAccountId = $scope.userId;
                    //httpService.post("DAAS", "UserAccountService", "GetUsrReChargingListById", {
                    //    page: $scope.currentPage, pagesize: $scope.perItems, id: $scope.userId
                    //}).then(function (data) {
                    //    //console.log(data);
                    //    alert(1)
                    //    $scope.usrReChargingListData = data.Items;

                    //    $scope.totalItems = data.TotalCount;//总数据量
                    //}, function (e) {
                    //    console.log("error:" + e)
                    //});
                }
            })

            document.cookie = "link=userAccount";


        }
        $scope.fileUpload = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '/views/marketing/upload.html',
                    controller: uploadCtrl,
                    backdrop: 'static',
                    resolve: {
                        dataModel: function () {
                            return {
                                url: httpService.baseUri + 'DAAS/UserAccountService/ImportWebSetData',
                                row: 1,
                                col: 0
                            };
                        },
                        refreshObj: function () {
                            return {
                                getData: function () {
                                    GetData();
                                }
                            }
                        }
                    }
                });
                modalInstance.result.then(
                   //保存事件
                    function (SuccessList) {
                        if (SuccessList != "") {
                            //$scope.batchId = SuccessList[0]["id"];
                        } else {
                            $scope.GridSource = SuccessList;
                            
                        }
                    },
                   //取消事件
                   function () {

                   });
            }
        //$scope.fileUpload = function () {
        //    $('#fileModal').modal('show');
        //}
        $scope.searchDis = function () {
            $(".searchIcon").css("display", "none");
        }
        $scope.searchShow = function () {
            if ($scope.SWEB_CONTENT == "" || $scope.SWEB_CONTENT ==null) {
                $(".searchIcon").css("display", "block");
            }
           
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


    }]
});








