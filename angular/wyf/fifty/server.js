/**
 * Created by Administrator on 2017/1/11.
 */
var http=require('http');
var fs=require('fs');
var url=require('url');
var mime=require('mime');
var querystring=require('querystring');
http.createServer(function (req,res) {
    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./form.html').pipe(res);
    }else if(pathname=='/form'){
        var str='';
        res.on('data',function (data) {
            str+=data;
        });
        res.on('end',function () {
            var obj=querystring.parse(str);
            res.statusCode=302;
            if(obj.username=='123'&&obj.password=='123'){
                res.setHeader('Location','http://www.baidu.com');
            }else {
                res.setHeader('Location','http://www.baidu.com');
            }
        })

    }else if(pathname=='/jsonp'){
        var callback=urlObj.query.callback;
        var data=JSON.stringify({name:'你好'});
        res.end(`${callback}(${data})`)
    }else {
        fs.exists('.'+pathname,function (flag) {
            if(flag){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else {
                res.statusCode=404;
                res.end('not found');
            }
        })
    }
}).listen(3333)