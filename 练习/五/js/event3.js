/**
 * Created by Administrator on 2016/11/28.
 */
function on(ele,type,fn){
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
    }else{
        if(!ele[type+'onEvent']){
            ele[type+'onEvent']=[];
            ele.attachEvent('on'+type,function(){
                run.call(ele)
            })
        }
        var  a=ele[type+'onEvent'];
        for(var i=0;i<a.length;i++){
            if(a[i]==fn) return;
        }
        a.push(fn);
    }
}
function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false)
    }else{
        var a=ele[type+'onEvent'];
        if(a && a.length){
            for(var i=0;i<a.length;i++){
                if(a[i]==fn){
                    a[i]=null;
                    break;
                }
            }
        }
    }
}
function run(){
    var e=window.event;
    e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
    e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
    e.target=e.target||e.srcElement;
    e.preventDefault=function(){
        e.returnValue=false;
    };
    e.stopPropagation=function(){
        e.cancelable=true;
    }
    var a=this[e.type+'onEvent'];
    if(a&&a.length){
        for(var i=0;i<a.length;i++){
            if(typeof a[i]=='function'){
                a[i].call(this,e)
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}

