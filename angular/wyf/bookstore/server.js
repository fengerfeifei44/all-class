/**
 * Created by Administrator on 2017/1/13.
 */
var http=require('http');
var fs=require('fs');
var url=require('url');
var mime=require('mime');
function readFile(callback) {
    fs.readFile('./books.json','utf8',function (err,data) {
        if(err||data==''){
            callback([])
        }else {
            callback(JSON.parse(data))
        }
    })
}
function writeFile(data,callback) {
    fs.writeFile('./books.json',JSON.stringify(data),callback);
}
http.createServer(function (req,res) {
    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;

    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/^\/books(\/\d+)?$/.test(pathname)){
        var id=/^\/books(\/\d+)?$/.exec(pathname)[1];
        switch (req.method){
            case 'GET':
                if(id){
                    readFile(function (data) {
                        var book=data.find(function (item) {
                            return item.id==id.slice(1);
                        });

                            res.end(JSON.stringify(book))

                    })

                }else {
                    readFile(function (data) {
                        res.end(JSON.stringify(data));
                    })
                }
                break;
            case 'POST':
                var str='';
                res.on('data',function (data) {
                    str+=data;
                });
                res.on('end',function () {
                    var book=JSON.parse(str);
                    readFile(function (data) {
                       book.id=data.length?data[data.length-1].id+1:1;
                       data.push(book);
                       writeFile(data,function () {
                           res.end(JSON.stringify(book));
                       })
                    })
                })
                break;
            case 'PUT':
                if(id){
                   var str='';
                   req.on('data',function (data) {
                       str+=data;
                   });
                   req.on('end',function () {
                       var book=JSON.parse(str);
                       readFile(function (data) {
                            data=data.map(function (item) {
                               if(item.id==id.slice(1)){
                                   return book;
                               }
                               return item;
                           })
                           writeFile(data,function () {
                               res.end(JSON.stringify(book));
                           })
                       })
                   })
               }
                break;
            case 'DELETE':
                if(id){
                    readFile(function (data) {
                        data=data.filter(function (item) {
                           return item.id!=id.slice(1);
                       });
                       writeFile(data,function () {
                           res.end(JSON.stringify({}));
                       })
                    })
                }
                break;
        }
    }else {
        fs.exists('.'+pathname,function (falg) {
            if(falg){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else {
                res.statusCode=404;
                res.end('not found')
            }
        })
    }
}).listen(80);