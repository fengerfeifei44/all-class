/**
 * Created by Administrator on 2016/11/16.
 */
var utils={
    makeArray:function(arg){
        if("getComputedStyle" in window){
            return Array.prototype.slice.call(arg);
        }
        var ary=[];
        for(var i=0;i<arg.length;i++){
            ary.push(arg[i]);
        }
        return ary;
    },
    win:function(attr,value){
        if(value==undefined){
            return document.documentElement[attr]||document.body[attr];
        }
            document.documentElement[attr]=document.body[attr]=value;

    },
    offset:function(curEle){
        var par=curEle.offsetParent;
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;

        while(par){
            if(window.navigator.userAgent.indexOf("MSIE 8")==-1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent;
        }
        return{left:l,top:t}
    },
    rnd:function(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n)||isNaN(m)){
            return Math.random();
        }
        if(n>m){
            var tmp=m;
            m=n;
            n=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }
}
