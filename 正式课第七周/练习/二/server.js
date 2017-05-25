/**
 * Created by Administrator on 2016/12/20.
 */
var http=require('http');
var url=require('url');
var fs=require('fs');
var server1=http.createServer(function(req,res){
    var urlObj=url.parse(req.url,true);
    var pathName=urlObj.pathname;
    var query=urlObj.query;
    var reg=/\.([^0-9a-zA-Z]+)/;
    if(reg.test(pathName)){
        var suffix=reg.exec(pathName)[1].toLowerCase();
        var suffixMIME='text/plain';
        switch (suffix){
            case 'html':
                suffixMIME='text/html';
                break;
            case 'css':
                suffixMIME='text/css';
                break;
            case 'js':
                suffixMIME='text/javascript';
                break;
        }
        var conFile='file is not found';
        var status=404;
        try{
            conFile=fs.readFileSync('.'+pathName,'utf-8');
            status=200;
        }
        res.writeHead(status,{'content-type':suffixMIME+';charset=utf-8;'})
    }
})