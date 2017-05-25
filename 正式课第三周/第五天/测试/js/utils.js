/**
 * Created by xiaoxue on 2016/11/15.
 */
var utils={
    makeArray:function (arg){
        if("computedStyle" in window){
            return Array.prototype.slice.call(arg);
        }
        var ary=[];
        for(var i=0;i<arg.length;i++){
            ary.push(arg[i]);
        }
        return ary;
    },
    win:function (attr,value){
        if(value===undefined){
         return   document.documentElement[attr]=document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value;
    },
    offset:function(curEle){
        var pre=curEle.offsetParent;
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        while(pre){
            if(window.navigator.userAgent.indexOf("MSIE 8")===-1){
                l+=pre.clientLeft;
                t+=pre.clientTop;
            }
            l+=pre.offsetLeft;
            t+=pre.offsetTop;
            pre=pre.offsetParent;
        }
        return{left:l,top:t}
    },
    rnd:function(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(m)||isNaN(n)){
            return Math.random();
        }
        if(n>m){
            var tmp=n;
            n=m;
            m=tmp;
        }
        return Math.round(Math.random()*(m-n)+n)
    }
}
