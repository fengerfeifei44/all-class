/**
 * Created by Administrator on 2016/11/26.
 */
function bind(ele,type,fn){
    if(ele.addEventListener){
        ele.addEventListener(type,fn)
    }else{

    }

}
function unbind(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn)
    }else{
        var a=ele[type+'aEvent'];
        if(a && a.length){
            for(var i=0;i<a.length;i++){

            }

        }
    }

}