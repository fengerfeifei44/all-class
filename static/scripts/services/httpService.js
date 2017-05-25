define(['angularAMD', 'ngload!ui.bootstrap', 'angular-confirm'], function (angularAMD) {
    'use strict';
    angularAMD.service('httpService',
    function ($http, $q, $location, $window, $confirm) {

        $http.defaults.withCredentials = true;

        return ({
            get: getService,
            getWithCache: getServiceWithCache,
            post: postService,
            getRemote: getRemoteService,
            getRemoteWithCache: getRemoteServiceWithCache,
            postRemote: postRemoteService,
            baseUri: getBaseUri(),
            remoteUri: getRemoteUri(),
            getCookie: getCookie,
        });

        function getBaseUri() {
            return "/"
        };

        function getRemoteUri() {
            return "http://10.95.3.60:18002/";
        }

        function getService(serviceGroup, serviceName, action, data) {
            return baseService(serviceGroup, serviceName, action, 'GET', data, false);
        };

        function getServiceWithCache(serviceGroup, serviceName, action, data) {
            return baseService(serviceGroup, serviceName, action, 'GET', data, true);
        };

        function postService(serviceGroup, serviceName, action, data) {
            return baseService(serviceGroup, serviceName, action, 'POST', data, false);
        };

        function getRemoteService(serviceGroup, serviceName, action, data) {
            return baseRemoteService(serviceGroup, serviceName, action, 'GET', data, false);
        };

        function getRemoteServiceWithCache(serviceGroup, serviceName, action, data) {
            return baseRemoteService(serviceGroup, serviceName, action, 'GET', data, true);
        };

        function postRemoteService(serviceGroup, serviceName, action, data) {

            return baseRemoteService(serviceGroup, serviceName, action, 'POST', data, false);
        };

        function baseRemoteService(serviceGroup, serviceName, action, method, data, withCache) {
            var requestUrl = getRemoteUri() + serviceGroup + "/" + serviceName + "/" + action
            var request;
            if (method == 'POST') {
                requestUrl = requestUrl + "?tokenID=" + getCookie("Tescomm_Access_Token");
                request = $http({
                    method: method,
                    url: requestUrl,
                    data: data,
                    cache: withCache
                });
            } else {
                data.tokenID = getCookie("Tescomm_Access_Token");
                request = $http({
                    method: method,
                    url: requestUrl,
                    params: data,
                    cache: withCache
                });
            }
            return (request.then(handleSuccess, handleError));
        };

        function baseService(serviceGroup, serviceName, action, method, data, withCache) {
            var requestUrl = getBaseUri() + serviceGroup + "/" + serviceName + "/" + action
            var request;

            if (method == 'POST') {
                request = $http({
                    method: method,
                    url: requestUrl,
                    data: data,
                    cache: withCache
                });
            } else {
                request = $http({
                    method: method,
                    url: requestUrl,
                    params: data,
                    cache: withCache
                });
            }
            return (request.then(handleSuccess, handleError));
        };

        function handleError(response) {
            return ($q.reject(response.data.Message));
        }

        function handleSuccess(response) {
            return (response.data);
        }

        function getCookie(cookieName) {
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(cookieName + "=")
                if (c_start != -1) {
                    c_start = c_start + cookieName.length + 1
                    var c_end = document.cookie.indexOf(";", c_start)
                    if (c_end == -1) c_end = document.cookie.length
                    return unescape(document.cookie.substring(c_start, c_end))
                }
            }
            return ""
        }
    });
})