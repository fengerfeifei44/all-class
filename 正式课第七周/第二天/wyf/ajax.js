/**
 * Created by Administrator on 2016/12/9.
 */
function ajax(options){
    var _default={
        type:'get',
        url:null,
        async :true,
        dataType:'text',
        cache:true,
        success:null,
        error:null
    }
    for(var key in options){
        if(options.hasOwnProperty(key)){
            _default[key]=options[key];
        }
    }
    var xhr=new XMLHttpRequest;
    if(_default.cache===false){
        var char=_default.url.indexOf('?')===-1?'?':'&';
        _default.url=char+'_='+Math.random();
    }
    xhr.open(_default.type,_default.url,_default.async);
    xhr.onreadystatechange=function(){
        if(xhr.status===200){
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
                _default.success && _default.success(xhr,result);

            }
            return;
        }
        _default.error && _default.error(xhr,xhr.responseText);
    }
    xhr.send(_default.data)
}