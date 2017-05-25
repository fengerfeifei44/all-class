
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


        function GetData() {
            httpService.post("DAAS", "UserAccountService", "GetSystemLogList", {
                page: $scope.currentPage, pagesize: $scope.perItems
            }).then(function (data) {
                //console.log(data);
                $scope.systemLogListData = data.Items;
                $scope.totalItems = data.TotalCount;//总数据量
            }, function (e) {
                console.log("error:" + e)
            });
        }
        GetData();



        //实现分页
        $scope.pageChanged = function (page, pageCount) {
            $scope.currentPage = page;//当前页面
            GetData();

        };


    }]


});








