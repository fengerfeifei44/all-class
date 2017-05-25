/**
 * Created by Administrator on 2017/1/11.
 */
var http=require('http');
var fs=require('fs');
var url=require('url');
var mime=require('mime');
var userList=[
    {name:'张三',age:8,id:1},
    {name:'李四',age:10,id:2}
]
var querystring=require('querystring');
http.createServer(function (req,res) {
    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./3 angular-resource.html').pipe(res);
    }else if(/^\/user(\/\d+)?$/.test(pathname)){
        var id=/^\/user(\/\d+)?$/.exec(pathname)[1];

           switch (req.method){
               case 'GET':
                   if(id){
                      var uid=id.slice(1);
                      var result=userList.find(function (item) {
                          return item.id==uid;
                      });
                      if(result){
                          res.end(JSON.stringify(result));
                      }else {
                          res.end(JSON.stringify(''));
                      }
                   }else {
                       res.end(JSON.stringify(userList))
                   };
                   break;
               case 'POST':
                  var str='';
                  req.on('data',function (data) {
                      str+=data;
                  });
                  req.on('end',function () {
                      str=JSON.parse(str);
                      str.id=userList.length?userList[userList.length-1].id+1:1;
                      userList.push(str);
                      res.end(JSON.stringify(str));
                  });
                   break;
               case 'DELETE':
                   var uid=id.slice(1);
                   userList=userList.filter(function (item) {
                       return item.id!=uid;
                   });
                   res.end(JSON.stringify({}));
                   break;
               case 'PUT':
                   if(id){
                     var uid=id.slice(1);
                     var str='';
                     req.on('data',function (data) {
                         str+=data;
                     });
                     req.on('end',function () {
                         str=JSON.parse(str);
                         userList=userList.map(function (item) {
                             if(item.id==str.id){
                                 return str;
                             }
                             return item;
                         });
                         res.end(JSON.stringify(str));
                     })
                   }else {

                   }

                   break;
           }

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
}).listen(3000)