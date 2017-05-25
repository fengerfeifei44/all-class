/**
 * Created by Administrator on 2017/1/17.
 */
var http=require('http');
var fs=require('fs');
var url=require('url');
var mime=require('mime');
function readBooks(callback) {
    var obj={};
    fs.readFile('./books.json','utf8',function (err,data) {
        if(err||data==''){
            callback([])
        }else {
            callback(JSON.stringify(data))
        }
    });
    return obj;
};
function writeBooks(data,callback) {
    fs.writeFile('./books.json',JSON.stringify(data),callback)
}
http.createServer(function (req,res) {
    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/^\/books(\/d+)?$/.test(pathname)){
        var id=/^\/books(\/d+)?$/.exec(pathname)[1];
        switch (req.method){
            case 'GET':
                if(id){
                    readBooks(function (data) {
                        data=data.find(function (item) {
                            return item.id==id.slice(1);
                        });
                        return JSON.stringify(data);
                    })
                }else {
                    readBooks(function (data) {
                        return JSON.stringify(data);
                    })
                }
                break;
            case 'POST':
                var str='';
                req.on('data',function (data) {
                    str+=data;
                });
                req.on('end',function () {
                    str=JSON.parse(str);
                    readBooks(function (data) {
                        str.id=data.length?data[data.length-1].id+1:1;
                        data.push(str);
                        writeBooks(data,function () {

                            res.end(JSON.stringify(str));
                        })
                    })
                })
                break;
            case 'PUT':
                if(id){
                    var book='';
                    req.on('data',function (data) {
                        book+=data;
                    });
                    req.on('end',function () {
                        book=JSON.parse(book);
                        readBooks(function (data) {
                            data=data.map(function (item) {
                                if(item.id==id.slice(1)){
                                    return book;
                                }
                                return item;
                            });
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
                            return item.id!==id.slice(1);
                        });
                        writeBooks(data,function () {
                            res.end(JSON.stringify({}));
                        })
                    })
                }
                break;

        }
    }else {
        fs.exists('.'+pathname,function (flag) {
            if(flag){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('./index.html').pipe(res);
            }else {
                res.statusCode=404;
                res.end('not found')
            }
        })
    }

}).listen(80);
