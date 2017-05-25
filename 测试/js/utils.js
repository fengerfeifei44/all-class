/**
 * Created by Administrator on 2016/11/10.
 */
var utils={
    getCss:function(curEle,attr){
        var val='';
        var reg='';
        if('getComputedStyle' in window){
            val=getComputedStyle(curEle,null)[attr];
        }else{
            if(attr='opacity'){
                val=curEle.currentStyle['filter'];
                reg=/^alpha\(opacity[=:](\d+(\.\d+)?)\)$/;
                return reg.test(val)?val.exec(val)[1]/100:0.1;
            }else{
                val=curEle.currentStyle[attr];
            }
        }
        reg=/(^right|left|bottom|top|height|width|((margin|padding)(right|left|bottom|top)?))$/gi;
        return reg.test(attr)?parseFloat(val):val;
    },
    win:function(attr,valur){
        if(valur===undefined){
            return document.documentElement[attr]||document.body[attr];
        }else{
            document.documentElement[attr]=document.body[attr]=valur;
        }
    },
    offset:function(curEle){
        var pre=curEle.offsetParent;
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        while(pre){
            if(window.navigator.userAgent.indexOf('MSIE 8')===-1){
                l+=pre.clientLeft;
                t+=pre.clientTop;
            }
            l+=pre.offsetLeft;
            t+=pre.offsetTop;
            pre=pre.offsetParent;
        }
        return{left:l,top:t}
    }

}