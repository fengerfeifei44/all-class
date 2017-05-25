define(['scripts/services/httpService', 'scripts/requireHelper/requireNotification'],
    function () {
        return ['$scope', 'httpService', 'Notification',
        function ($scope, httpService,Notification) {
            $scope.perItems = 9;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.numPages = 0;
            $scope.maxSize = 5;
            $scope.adId = "";
            $scope.adName = "";
            $scope.replyContent = "";
            $scope.time = "";
            function GetUsrFeedBackList() {
                httpService.post("DAAS", "UserAccountService", "GetUsrFeedBackInfList", {
                                                                
                    page:$scope.currentPage,pagesize:$scope.perItems
                }).then(function (data) {
                    //console.log(data);
                    $scope.UsrFeedList = data.Items;
                    $scope.responseData = data;
                    $scope.pageNumber = data.PageCount;
                    $scope.totalItems = data.TotalCount;
                }, function (errorMessage) {
                    Notification.info({ message: errorMessage, delay: 5000 });
                    console.log("info:" + errorMessage)
                });
            }
            GetUsrFeedBackList();
            $scope.pageChanged = function (page, pageCount) {
                $scope.currentPage = page;//当前页面
                GetUsrFeedBackList();
            }
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

            $scope.modalClick = function (reply,adId,adName,time)
            {
                if (reply == false) {
                    $('#myModal2').modal('show');
                    $scope.adId = adId;
                    $scope.adName = adName;
                    $scope.time = time;
                }
                else {
                    $('#myModal2').modal('hide');
                    $scope.adId = "";
                    $scope.adName = "";
                    $scope.time = "";
                } 
            }
            $scope.replay = function () {
                if ($scope.replyContent == "") {
                    Notification.error({ message: "请填写回复内容", delay: 1000 });
                }
                else {
                    httpService.post("DAAS", "UserAccountService", "ReplyUserFeedBack", {
                        adId:$scope.adId,adName:$scope.adName,message:$scope.replyContent,time:$scope.time
                    }).then(function (data) {
                        if (data == true) {
                            Notification.success({ message: "提交成功", delay: 5000 });
                            GetUsrFeedBackList()
                            $('#myModal2').modal('hide');
                        }
                        else
                            Notification.error({ message: "保存失败", delay: 1000 });
                    }, function (errorMessage) {
                        Notification.info({ message: errorMessage, delay: 5000 });
                        console.log("info:" + errorMessage)
                    });

                }
            }
        }];
    });