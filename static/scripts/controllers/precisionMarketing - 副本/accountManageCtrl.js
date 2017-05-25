
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
        $scope.Usr_Account_Name = "";
       
        //httpService.post("DAAS", "UserAccountService", "GetUsrAccountList", {
        //    page: $scope.currentPage, pagesize: $scope.perItems, name: undefined
        //}).then(function (data) {
        //    //console.log(data);
        //    $scope.userAccountData = data.Items;
        //    $scope.totalItems = data.TotalCount;//总数据量
        //}, function (e) {
        //    console.log("error:" + e)
        //});
        function GetData() {
            httpService.post("DAAS", "UserAccountService", "GetUsrAccountList", {
                page: $scope.currentPage, pagesize: $scope.perItems, name: undefined
            }).then(function (data) {
                //console.log(data);
                $scope.userAccountData = data.Items;
                $scope.totalItems = data.TotalCount;//总数据量
            }, function (e) {
                console.log("error:" + e)
            });
        }
        GetData();
       
        $scope.addUser = function () {
            $('#myModal6').modal('show');
            $scope.Usr_Account_Name = "";
            $scope.Usr_Password = "";
            $scope.Usr_Password_confirm = "";
            $scope.Contant_Infor1 = "";
            $scope.Contant_Infor2 = "";
            $scope.Contant_Infor3 = "";


        }
        $scope.checkUsr = function () {
          
            httpService.post("DAAS", "UserAccountService", "GetUsrAccountByName", {
                userName: $scope.Usr_Account_Name
            }).then(function (data) {

                if (data.length > 0) {
                    if (data[0].USR_ACCOUNT_NAME == $scope.Usr_Account_Name) {
                        Notification.error({ message: "账号名重复，请更换.", delay: 1000 });
                    }
                    
                } else {
                    //Notification.success({ message: "账号名正确.", delay: 1000 });
                }
                
            }, function (e) {
                console.log("error:" + e)
            });
        }
       

       
        var regTel = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/; 
        var regPa = /^[0-9A-Za-z]{3,12}$/;
        function ValidInput() {  
        
            var regUsrName = /^[a-zA-Z0-9\u4e00-\u9fa5][\w\u4e00-\u9fa5]{0,11}$/;
            if ($scope.Usr_Account_Name == "" || $scope.Usr_Account_Name == null) {
                Notification.error({ message: "请输入用户名", delay: 5000 });
                return false;
            }
            if (!regUsrName.test($scope.Usr_Account_Name)) {
                Notification.error({ message: "用户名由1-12位字母、数字、下划线、中文组成，并且下划线不能开头", delay: 5000 });
                return false;
            }

            if ($scope.Usr_Password == "" || $scope.Usr_Password == null) {
                Notification.error({ message: "请输入密码", delay: 5000 });
                return false;
            }
            if (!regPa.test($scope.Usr_Password)) {
                Notification.error({ message: "密码由3-12位字母、数字组成", delay: 5000 });
                return false;
            }

            if ($scope.Usr_Password_confirm == "" || $scope.Usr_Password_confirm == null) {
                Notification.error({ message: "请输入确认密码", delay: 5000 });
                return false;
            }
            if ($scope.Usr_Password != $scope.Usr_Password_confirm) {
                Notification.error({ message: "两次输入密码不一样", delay: 5000 });
                return false;
            }
            if ($scope.Contant_Infor1 == "" || $scope.Contant_Infor1 == null) {
                Notification.error({ message: "请输入联系方式", delay: 5000 });
                return false;
            }
            if (!(regTel.test($scope.Contant_Infor1))) {
                Notification.error({ message: "联系方式1格式不正确", delay: 1000 });
                return false;
            }
            if ($scope.Contant_Infor2 != "") {
                if (!(regTel.test($scope.Contant_Infor2))) {
                    Notification.error({ message: "联系方式2格式不正确", delay: 1000 });
                    return false;
                }

            }
            if ($scope.Contant_Infor3 != "") {
                if (!(regTel.test($scope.Contant_Infor3))) {
                    Notification.error({ message: "联系方式3格式不正确", delay: 1000 });
                    return false;
                }

            }

           
        }
        $scope.saveAddUser = function () {

           
          
            if (ValidInput() == false) {
                return;
            }
            $scope.MessageText = "保存成功";
            console.log(typeof($scope.Contant_Infor2));
            httpService.post("DAAS", "UserAccountService", "AddUsrAccount", {
                name: $scope.Usr_Account_Name, password: $scope.Usr_Password, infor1: $scope.Contant_Infor1, infor2: $scope.Contant_Infor2, infor3: $scope.Contant_Infor3,
                showNum: $scope.Show_Num, siteNum: $scope.Site_Num, loadTime: $scope.Load_Time
            }).then(function (data) {
               
                Notification.success({ message: $scope.MessageText, delay: 5000 });
                $scope.cancelAdd();
               
                GetData();


            }, function (e) {
                console.log("error:" + e)
            });
       
           
        }
        $scope.cancelAdd = function () {
            $('#myModal6').modal('hide');
         
        }


        
        
        $scope.editUser = function () {
            
            //$('#myModal7').modal('show');
            $scope.Usr_Account_Name_Edit = "";
            $scope.Usr_Password_Edit = "";
            $scope.Usr_Password_Confirm_Edit = "";
            $scope.Contant_Infor1_Edit = "";
            $scope.Contant_Infor2_Edit = "";
            $scope.Contant_Infor3_Edit = "";
            $scope.Usr_Account_Id = "";
            var count = 0;
            //console.log($scope.Usr_Account_Name_Edit);
            $scope.userAccountData.forEach(function (i) {
               
                if (i.IsChecked == true) {
                    count++;
                    var itemselected = i;
                    $scope.Usr_Account_Name_Edit = itemselected.Usr_Account_Name;
                    $scope.Usr_Password_Edit = itemselected.Usr_Password;
                    $scope.Usr_Password_Confirm_Edit = itemselected.Usr_Password;
                    $scope.Contant_Infor1_Edit = itemselected.Contant_Infor1;
                    $scope.Contant_Infor2_Edit = itemselected.Contant_Infor2;
                    $scope.Contant_Infor3_Edit = itemselected.Contant_Infor3;
                    $scope.Usr_Account_Id = itemselected.Usr_Account_Id;
                } 
                
               
            })
            if (count == 0) {
                Notification.info({ message: "无账号可编辑", delay: 5000 });
            } else {
                $('#myModal7').modal('show');
            }
               
            

        }
        function ValidInputEdit() {
           
            
            if ($scope.Usr_Account_Name_Edit == "" || $scope.Usr_Account_Name_Edit == null) {
                Notification.error({ message: "请输入用户名", delay: 5000 });
                return false;
            }
            if ($scope.Usr_Password_Edit == "" || $scope.Usr_Password_Edit == null) {
                Notification.error({ message: "请输入密码", delay: 5000 });
                return false;
            }
            if (!regPa.test($scope.Usr_Password_Edit)) {
                Notification.error({ message: "密码由3-12位字母、数字组成", delay: 5000 });
                return false;
            }

            if ($scope.Usr_Password_Confirm_Edit == "" || $scope.Usr_Password_Confirm_Edit == null) {
                Notification.error({ message: "请输入确认密码", delay: 5000 });
                return false;
            }
            if ($scope.Usr_Password_Edit != $scope.Usr_Password_Confirm_Edit) {
                Notification.error({ message: "两次输入密码不一样", delay: 5000 });
                return false;
            }
            if ($scope.Contant_Infor1_Edit == "" && $scope.Contant_Infor2_Edit == "" && $scope.Contant_Infor3_Edit == "") {
                Notification.error({ message: "请至少输入一种联系方式", delay: 5000 });
                return false;
            }
            if (!(regTel.test($scope.Contant_Infor1_Edit))) {
                Notification.error({ message: "联系方式1格式不正确", delay: 1000 });
                return false;
            }
            if ($scope.Contant_Infor2_Edit != "") {
                if (!(regTel.test($scope.Contant_Infor2_Edit))) {
                    Notification.error({ message: "联系方式2格式不正确", delay: 1000 });
                    return false;
                }

            }
            if ($scope.Contant_Infor3_Edit != "") {
                if (!(regTel.test($scope.Contant_Infor3_Edit))) {
                    Notification.error({ message: "联系方式3格式不正确", delay: 1000 });
                    return false;
                }

            }

            
        }
        $scope.saveEditUser = function () {
            if (ValidInputEdit() == false) {
                return;
            }
            $scope.MessageText = "保存成功";
           
            httpService.post("DAAS", "UserAccountService", "UpdateUsrAccount", {

                usr_account_name: $scope.Usr_Account_Name_Edit,
                usr_password: $scope.Usr_Password_Edit,
                contant_infor1: $scope.Contant_Infor1_Edit,
                contant_infor2: $scope.Contant_Infor2_Edit,
                contant_infor3: $scope.Contant_Infor3_Edit,
                //showNum: $scope.Show_Num,
                //siteNum: $scope.Site_Num,
                //loadTime: $scope.Load_Time,
                usr_account_id: $scope.Usr_Account_Id
            }).then(function (data) {
                Notification.success({ message: $scope.MessageText, delay: 5000 });
                $scope.cancelEdit();
                GetData();
            }, function (e) {
                console.log("error:" + e)
            });
        }
        
        $scope.cancelEdit = function () {
            $('#myModal7').modal('hide');
        }

        $scope.getids = function () {
            var ids = "";
            if ($scope.userAccountData) {
                for (var i = 0; i < $scope.userAccountData.length; i++) {
                    if ($scope.userAccountData[i].IsChecked == true) {
                        if (ids == "")
                            ids = $scope.userAccountData[i].Usr_Account_Id;
                        else
                            ids = ids + "," + $scope.userAccountData[i].Usr_Account_Id;
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
            var selectedId = $scope.getids();
            if (selectedId == "") {
                        Notification.info({ message: "请选择要删除的数据", delay: 5000 });
                        return;
            }
            $confirm({ text: '是否要删除所选区域' })

                 .then(function () {
                     httpService.post("DAAS", "UserAccountService", "DeleteUsrAccouont", {
                         ids: selectedId
                     }).then(function (data) {
                         GetData();
                     }, function (e) {
                         console.log("error:" + e)
                     });
                 })
        }
       
        $scope.searchUserAccount = function () {
            $scope.userAccountName = $scope.userAccountName == "" ? undefined : $scope.userAccountName;
            httpService.post("DAAS", "UserAccountService", "GetUsrAccountList", {
                page: $scope.currentPage, pagesize: $scope.perItems, name: $scope.userAccountName
            }).then(function (data) {
                //console.log(data);
                $scope.userAccountData = data.Items;
                $scope.totalItems = data.TotalCount;//总数据量
            }, function (e) {
                console.log("error:" + e)
            });
        }





       
        $scope.viewRechargeRecord = function (event) {
           
            $("#menu li").eq(1).addClass("selectLi").siblings().removeClass('selectLi');
            $("#menu li span.lineIcon").css("display", "none");
            $("#menu li").eq(1).children("span.lineIcon").css("display", "inline-block");
            $("#menu li").eq(0).children("img").attr('src', 'imgs/accountS.png');
            $("#menu li").eq(1).children("img").attr('src', 'imgs/moneyS.png');
            document.cookie = "li=1";
            console.log(event.target);
            var usrIndex= $(event.target).parent().parent().find("td.usrIndex").text();
            $scope.userAccountData.forEach(function (i) {
                if (i.RowIndex == usrIndex) {
                    var selected = i;     
                    $scope.userId = selected.Usr_Account_Id;
                    window.userAccountId=$scope.userId;
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




        //实现分页
        $scope.pageChanged = function (page, pageCount) {
            $scope.currentPage = page;//当前页面
            GetData();

        };

   
       
    }]
});

        






