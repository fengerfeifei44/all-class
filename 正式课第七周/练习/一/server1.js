/**
 * Created by Administrator on 2016/12/14.
 */
var http=require('http'),
    url=require('url'),
    fs=require('fs');
var server1=http.createServer(function(req,res){
    var urlObj=url.parse(req.url,true),
        pathname=urlObj.pathname,
        query=urlObj.query;
    var reg=/\.([0-9a-zA-Z]+)/i;
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toLowerCase();
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
        var conFile='file is not found',
            status=404;
        try{
             conFile=fs.readFileSync('.'+pathname,'utf-8');
            status=200;
        }catch(e){

        }
        res.writeHead(status,{'content-type':suffixMIME+';charset=utf-8;'})
        res.end(conFile);
        return;
    };
    //API
    var customData=fs.readFileSync('./json/custom.json','utf-8')

})
server1.listen(80,function(){
    console.log('hello world!')
})