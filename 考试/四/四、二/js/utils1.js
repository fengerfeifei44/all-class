/**
 * Created by xiaoxue on 2016/11/15.
 */
var utils={
    makeArray:function makeArray(arg){
        if("getComputedStyle" in window){
            return Array.prototype.slice.call(arg);
        }else{
            var ary=[];
            for(var i=0;i<arg.length;i++){
                ary.push(arg[i]);
            }
            return ary;
        }

    },
    win: function win(attr,value){
        if(value===undefined){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value;
    },
    offset:function offset(curEle){
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        var par=curEle.offsetParent;
        while(par){
            if(window.navigator.userAgent.indexOf('MSIE 8') == -1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:l,top:t}
    },
    rnd: function (n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();//当返回0-1之间的随机小数，说明参数传错了；
        }
        if(n>m){
            var tmp=m;
            m=n;
            n=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }
}
