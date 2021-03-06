var http=require('http'),
    url=require('url'),
    fs=require('fs');
var server1=http.createServer(function(req,res){
    var urlObj=url.parse(req.url,true),
        pathname=urlObj.pathname,
        query=urlObj.query;
    var reg=/\.([0-9a-zA-Z]+)/i;
    if(reg.test(pathname)){
        var suffix=reg.exec(pathname)[1].toLowerCase(),
            suffixMIME='text/plain';
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
        var conFile='file is not find',
            status=404;
        try{
            conFile=fs.readFileSync('.'+pathname,'utf-8');
            status=200;
        }catch(e){

        }
        res.writeHead(status,{'content-type':suffixMIME+';charset=utf-8'});
        res.end(conFile);
        return;
    }
    //获取所有客户信息
    var customData=fs.readFileSync('./json/custom.json','utf-8');
    customData=customData.length==0?'[]':customData;
    customData=JSON.parse(customData);
    var result={code:1,msg:'error',data:null};
    if(pathname==='/getAllList'){
        if(customData.length>0){
            result={
                code:0,
                msg:'success',
                data:customData
            };
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }
    //删除客户信息

    if(pathname==='/removeInfo'){
        var queryID=query['id'];
        customData.forEach(function(item,index){
            if(item['id']==queryID){
                customData.splice(index,1);
                fs.writeFileSync('./json/custom.json',JSON.stringify(customData),'utf-8');
                result={
                    code:0,
                    msg:'success'
                };
                return false;
            }
            console.log(customData);
        });
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));

    }


})
server1.listen(80,function(){
    console.log('server1 is listening 80 port')
})