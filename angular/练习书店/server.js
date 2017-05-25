/**
 * Created by QW on 2017/1/16.
 */
var http=require('http');
var fs=require('fs');
var url=require('url');
var path=require('path');
var mime=require('mime');
var server=http.createServer(function(req,res){
    var urlObj=url.parse(req.url,true);
    var pathname=urlObj.pathname;
    if(pathname=='/'){
      res.setHeader('content-type','text/html;charset=utf8');
        fs.createReadStream('./index.html').pipe(res);
    }else if(/^\/books(\/\d+)?$/.test(pathname)){
        var id=/^\/books(\/\d+)?$/.exec(pathname)[1]
        switch(req.method){
            case 'GET':
                if(id){

                }else{
                   readBooks(function(data){
                       res.end(JSON.stringify(data))
                   })
                }
                break;
            case 'POST':
                var str='';
                req.on('data',function(data){
                    str+=data
                });
                req.on('end',function(){
                    var book=JSON.parse(str);
                    readBooks(function(data){
                        book.id=data.length?parseInt(data[data.length-1].id)+1:1;
                        data.push(book);
                        fs.writeFile('./books.json',JSON.stringify(data),function(){
                            res.end(JSON.stringify(book));
                        })
                    })
                });
                break;
        }
    }else{
        fs.exists('.'+pathname,function(flag){
            if(flag){
                res.setHeader('content-type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(res);
            }else{
                res.statusCode=404;
                res.end('not Found')
            }
        })
    }

});
server.listen(8080,function(){
    console.log('8080 is listening')
});

//用到的自己封装的方法
/**
 * 读取文件内容并转为json格式的对象
 * @param cb
 */
function readBooks(cb){
    fs.readFile('./books.json','utf8',function(err,data){
        if(err||data==''){
            cb([])
        }else{
            cb(JSON.parse(data))
        }
    })
}