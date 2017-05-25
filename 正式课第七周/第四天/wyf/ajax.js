/**
 * Created by Administrator on 2016/12/10.
 */
(function(){
    function ajax(options) {
        //判断传进来的数是否为对象
        if (!tools.isType(options,'Object')) {
            throw new TypeError('参数类型错误');
        }
        var xhr = tools.getXHR();
        var type = options.type || 'get';
        var url = options.url || '/';
        var async = !!(options.async === undefined ? true : options.async);
        //是否为get方法
        var isGet = /^get|delete|head$/ig.test(type);
        //把data格式化为请求参数的格式
        var data = tools.param(options.data);
        //get系列方法，需要将data格式为请求参数的格式 拼接到url后面
        if (isGet && data) {
            url = tools.appendToURL(url, data);
            data = null;
        }
        //解决get缓存问题
        if (isGet && options.cache === false) {
            var rand = Math.random();
            url = tools.appendToURL(url, '_=' + rand);
        }
        xhr.open(type, url, async, options.username, options.password);
        //自定义响应头
        if (xhr.setRequestHeader && tools.isType(options.headers, 'Object')) {
            for (var header in options.headers) {
                if (!options.headers.hasOwnProperty(header)) continue;
                xhr.setRequestHeader(header, options[header])
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var responseText = xhr.responseText;
                if (/^2\d{2}/.test(xhr.status) || xhr.status === 304) {
                    if (options.dataType === 'json') {
                        try {
                            responseText = tools.JSONParse(responseText);
                        } catch (e) {
                            typeof options.error === 'function' && options.error(e);
                            return;
                        }
                    }
                    typeof options.success === 'function' && options.success(responseText);

                } else {
                    typeof options.error === 'function' && options.error(xhr.status);
                }
            }

        };
        xhr.send(data);
        return xhr;
    }

        var tools={
            //判断数据类型
            isType:function(data,type){
                return Object.prototype.toString.call(data)==='[object ' +type+']';
            },
            //创建XML实例兼容浏览器
            getXHR:(function(){
                var list=[
                    function(){

                        return new XMLHttpRequest();

                    },
                    function(){
                        return new ActiveXObject('Microsoft.XMLHTTP');
                    },
                    function(){
                        return new ActiveXObject('Msxml2.XMLHTTP');
                    },
                    function(){
                        return new ActiveXObject('Msxml3.XMLHTTP');
                    }
                ]
                var xhr=null;
                while(xhr = list.shift()){
                    try{
                        xhr();
                        return xhr;
                    }catch(e){

                    }
                }
                throw  new  ReferenceError('当前浏览器不支持ajax功能');
            })(),
            //将data格式化为请求参数的格式
            param:function(data){
                if(this.isType(data,'String')){
                    return data;
                }
                if(data===null || data===undefined){
                    return '';
                }
                if(this.isType(data,'Object')){
                    var ary=[];
                    for (var attr in data){
                        if(!data.hasOwnProperty(attr))continue;
                        ary.push(attr +'='+data[attr]);
                    }
                    return ary.join('&');
                }
                return String(data);
            },
            //把参数拼接到url后面
            appendToURL:function(url,padString){
                //把用户传过来的参数格式化一下
                padString=tools.param(padString);
                var hasQuery=/\?/.test(url);
                return url + (hasQuery ? '&' : '?') + padString;
            },
            JSONParse:function (jsonString){
                return 'JSON'in window?JSON.parse(jsonString):eval('('+jsonString+')');
            }
        }
    this.ajax=ajax;
}())