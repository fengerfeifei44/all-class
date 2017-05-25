/**
 * Created by Administrator on 2016/12/7.
 */
var http=require('http'),
    url=require('url'),
    fs=require('fs');
var server1=http.createServer(function(request,response){
    var urlObj=url.parse(request.url,true);
    var pathname=urlObj.pathname;
    var query=urlObj.query;
    var reg=/\.([0-9a-zA-Z]+)/i;
    if(reg.exec(pathname)){
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIME='text/plain';
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
    }

    response.writeHead(200,{'content-type':suffixMIME+';charset=utf-8;'});
    response.end(conFile);

})
server1.listen(80,function(){
    console.log('server is success,listening on 80 port!');
})