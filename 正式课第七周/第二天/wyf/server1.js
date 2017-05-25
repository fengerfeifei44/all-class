/**
 * Created by Administrator on 2016/12/9.
 */
var http=require('http'),
    url=require('url'),
    fs=require('fs');
var server=http.createServer(function(request,response){
    var urlObj=url.parse(request.url,true),
        pathname=urlObj.pathname,
        query=urlObj.query;
    var reg=/\.([0-9a-zA-Z]+)+/i;
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase();
        var suffixMIME='text/plain';
        switch (suffix){
            case 'HTML':
                suffixMIME='text/html';
                break;
            case 'CSS':
                suffixMIME='text/css';
                break;
            case 'JS':
                suffixMIME='text/javascript';
                break;
        }
        var conFile='file is not found!';
        try{
            conFile=fs.readFileSync('.'+pathname,'utf-8');
        }catch(e){

        }

        response.writeHead(200,{'content-type':suffixMIME+';charset:utf-8'})
        response.end(conFile);
    }
})
server.listen(80,function(){
    console.log('server in success,server is listening 80 prot!')
})