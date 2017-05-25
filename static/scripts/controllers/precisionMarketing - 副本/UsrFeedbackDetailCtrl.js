define(['scripts/services/httpService'],
    function () {
        return ['$scope', 'httpService',
        function ($scope, httpService) {
            $scope.perItems = 19;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.numPages = 0;
            $scope.maxSize = 5;
            function GetUsrFeedBackList() {
                httpService.post("DAAS", "UserAccountService", "GetUsrFeedBackInfList", {
                                                                
                    page:$scope.currentPage,pagesize:$scope.perItems
                }).then(function (data) {
                    //console.log(data);
                    $scope.UsrFeedList = data.Items;
                    $scope.totalItems = data.TotalCount;
                }, function (e) {
                    console.log("error:" + e);
                })
            }
            GetUsrFeedBackList();
            $scope.pageChanged = function (page, pageCount) {
                $scope.currentPage = page;//当前页面
                GetUsrFeedBackList();
            }
        }];
    });