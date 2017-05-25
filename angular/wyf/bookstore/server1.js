/**
 * Created by Administrator on 2017/1/12.
 */
var http=require('http');
var fs=require('fs');
var url=require('url');
var mime=require('mime');
//负责读取books.json的文件
function readBooks(callback) {
    fs.readFile('./books.json','utf8',function (err,data) {
        if(err||data==''){
            callback([]);
        }else {
            callback(JSON.parse(data));
        }
    })
}
//负责向books.json的文件里写入内容
function writeBooks(data,callback) {
    fs.writeFile('./books.json',JSON.stringify(data),callback);
}

http.createServer(function (req,res) {
    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/^\/books(\/\d+)?$/.test(pathname)){
        var id=pathname.match(/^\/books(\/\d+)?$/)[1];
        switch (req.method){
            case 'GET':
                if(id){
                    readBooks(function (data) {
                       var book=data.find(function (item) {
                            return item.id==id.slice(1);
                        });
                        res.end(JSON.stringify(book))
                    })

                }else {
                    readBooks(function (data) {
                        res.end(JSON.stringify(data));
                    })
                }
                break;
            case 'POST':
                var str='';
                req.on('data',function (data) {
                    str+=data;
                });
                req.on('end',function () {
                    var book=JSON.parse(str);
                    readBooks(function (data) {
                        console.log(100)
                        book.id=data.length?parseInt(data[data.length-1].id)+1:1;
                        data.push(book);
                        writeBooks(data,function () {
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
                        readBooks(function (data) {
                          data= data.map(function (item) {
                              if(item.id==id.slice(1)){
                                  return book;
                              }
                              return item;
                           }) ;
                          writeBooks(data,function () {
                              res.end(JSON.stringify(book));
                          })
                        })
                    })
                }
                break;
            case 'DELETE':
                if(id){
                    readBooks(function (data) {
                        data=data.filter(function (item) {
                            return item.id!=id.slice(1);
                        });
                        writeBooks(data,function () {
                           res.end(JSON.stringify({}));
                        })
                    })
                }
                break;
        }
    }else{
        fs.exists('.'+pathname,function (flag) {
            if(flag){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else {
                res.statusCode=404;
                res.end('');
            }
        })
    }
}).listen(80);
