
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
        //$scope.effective = 7;
        function GetData() {
            httpService.post("DAAS", "UserAccountService", "GetUsrBlackList", {
                page: $scope.currentPage, pagesize: $scope.perItems
            }).then(function (data) {
                //console.log(data);
                $scope.blackListData = data.Items; 
                //console.log($scope.effective);     
                $scope.totalItems = data.TotalCount;//总数据量
            }, function (e) {
                console.log("error:" + e)
            });
        }
        GetData();
        getBlackTime();
        //获得黑名单时间
        function getBlackTime() {
            httpService.get("DAAS", "UserAccountService", "Getblacktime").then(function (data) {
                //console.log(data);
                $scope.effective = data.DICT_ID;
            }, function (e) {
                console.log("error:" + e)
            });
        }
      //新增黑名单
        $scope.addBlack = function () {
            $('#addBlackUsr').modal('show');
            $scope.idAdd = "";
            $scope.oldidAdd = "";
            $scope.comReasonAdd = "";
            $scope.commentInfoAdd = "";

        
        }
        $scope.saveAddBlack = function () {
            var regUsrId = /^[a-zA-Z0-9\u4e00-\u9fa5][\w\._\u4e00-\u9fa5]*$/;
            var regText = /^[a-zA-Z0-9\._]?[\w\.\u4e00-\u9fa5]*$/;
           
            if ($scope.idAdd == "") {
                Notification.error({ message: "请输入用户ID", delay: 5000 });
                return;
            }
            if (!regUsrId.test($scope.idAdd)) {
                Notification.error({ message: "用户ID由字母、数字、下划线、点、中文组成，并且只能以字母、数字或者中文开头", delay: 3000 });
                return false;
            }
            
            if (!regText.test($scope.comReasonAdd)) {
                Notification.error({ message: "投诉原因由字母、数字、下划线、中文组成", delay: 3000 });
                return false;
            }
            if (!regText.test($scope.commentInfoAdd)) {
                Notification.error({ message: "备注由字母、数字、下划线、中文组成", delay: 3000 });
                return false;
            }

              
           

            $scope.MessageText = "保存成功";
            $scope.comReasonAdd = $scope.comReasonAdd == "" ? undefined : $scope.comReasonAdd;
            $scope.commentInfoAdd = $scope.commentInfoAdd == "" ? undefined : $scope.commentInfoAdd;
            httpService.post("DAAS", "UserAccountService", "AddUsrBlackList", {
                id: $scope.idAdd, oldid: undefined, comReason: $scope.comReasonAdd, commentInfo: $scope.commentInfoAdd, type: 0
            }).then(function (data) {
                if (data.result == true) {
                    Notification.success({ message: data.msg, delay: 5000 });
                   
                } else {
                    Notification.error({ message: data.msg, delay: 5000 });
                }
                
                $('#addBlackUsr').modal('hide');
                GetData();
               
            }, function (e) {
                console.log("error:" + e)
            });
        }



        //删除黑名单
        $scope.getids = function () {
            var ids = "";

            if ($scope.blackListData) {
                for (var i = 0; i < $scope.blackListData.length; i++) {
                    if ($scope.blackListData[i].IsChecked == true) {
                        if (ids == "")
                            ids = $scope.blackListData[i].Usr_Id;
                        else
                            ids = ids + "," + $scope.blackListData[i].Usr_Id;
                    }
                }
            }

            return ids;
        }
       
        $scope.deleteBlack = function (id) {
            var selectedId = $scope.getids();
            if (selectedId == "") {
                Notification.info({ message: "请选择要删除的数据", delay: 5000 });
                return;
            }
            $confirm({ text: '是否要删除所选区域' })

                 .then(function () {
                     httpService.post("DAAS", "UserAccountService", "DeleteBlackList", {
                         ids: selectedId
                     }).then(function (data) {
                         GetData();
                     }, function (e) {
                         console.log("error:" + e)
                     });
                 })
        }
       

        $scope.submit = function () {
            //console.log($scope.effective);
            $scope.effective = parseInt($scope.effective);
            $scope.MessageText = "提交成功";
            var reg = /\d+/;
            if (reg.test($scope.effective)) {
                httpService.post("DAAS", "UserAccountService", "UpdateBlackListLife", {
                    lifeCycle: $scope.effective
                }).then(function (data) {
                    Notification.success({ message: $scope.MessageText, delay: 5000 });
                    GetData();
                    getBlackTime();
                }, function (e) {
                    console.log("error:" + e)
                });
            } else {
                Notification.error({ message: "输入格式不正确", delay: 5000 });
            }
           
        }








     

        //实现分页
        $scope.pageChanged = function (page, pageCount) {
            $scope.currentPage = page;//当前页面
            GetData();

        };


    }]

    
});








