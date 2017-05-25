/**
 * Created by Administrator on 2016/12/8.
 */
function ajax(options){
    var _default={
        Type:'get',
        url:null,
        async :true,
        dataType:'text',
        cache:true,
        success:null,
        error:null,
        data:null
    }
    for(var key in options){
        if(options.hasOwnProperty(key)){
            _default[key]=options[key];
        }
    }
    var xhr=new XMLHttpRequest;
    if(_default.url===false){
        var char=_default.url.indexOf('?')===-1?'?':'&';
        _default.url+=char+'_='+Math.random();
    }
    xhr.open(_default.type,_default.url,_default.async);
    xhr.onreadystatechange=function(){
        if(xhr.status==200){
            if(xhr.readyState===4){
                var result=xhr.responseText;
                switch (_default.dataType){
                    case 'xml':
                        result=xhr.responseXML;
                        break;
                    case 'json':
                        result='JSON'in window?JSON.parse(result):eval('('+result+')');
                        break;
                }
                _default.success&&_default.success.call(xhr,result);
            }
            return;
        }
        _default.error && _default.error.call(xhr,xhr.responseText);
    }
    xhr.send(_default.data)
}