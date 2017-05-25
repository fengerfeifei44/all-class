/**
 * Created by Administrator on 2016/12/7.
 */
var http=require('http'),
    url=require('url'),
    fs=require('fs');
var server1=http.createServer(function(request,response){
    console.log(request.url,true)
    var urlObj=url.parse(request.url,true),
       pathname=urlObj.pathname,//请求的路径目录名称
        query=urlObj.query;//问好传参
    var reg=/\.([0-9a-zA-Z]+)/i;
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIMX='text/plain';
        switch (suffix){
            case 'HTML':
                suffixMIMX='text/html';
                break;
            case 'CSS':
                suffixMIMX='text/css';
                break;
            case 'JS':
                suffixMIMX='text/javascript';
                break;
        }
    }
    var conFire='file is not found!';
    try{
        conFire=fs.readFileSync('.'+pathname,'utf-8')
    }catch(e){

    }
    response.writeHead(200,{'content-type':suffixMIMX+';charset=utf-8;'})
    response.end(conFire);
});
server1.listen(80,function(){
    console.log('OK')
})