/**
 * Created by Administrator on 2016/11/12.
 */
var utils=(function(){
    var flag="getComputed" in window;
    return{
        getByClass:function(strClass,parent){
            parent=parent||document;
            if(flag){
                return this.makeArray(parent.getElementsByClassName(strClass));
            }
            var ary=[];
            var aryClass=strClass.replace(/(^ +)|( +$)/g,"").split(/\s+/g);
            var nodeList=parent.getElementsByTagName("*");
            for(var i=0;i<nodeList.length;i++){
                var cur=nodeList[i];
                var bOk=true;
                for(var j=0;j<aryClass.length;i++){
                    var reg=new RegExp("(^| +)"+aryClass[j]+"( +|$)","g");
                    if(!reg.test(cur.className)){
                        flag=false;
                        break;
                    }
                }
                if(bOk){
                    ary.push(cur);
                }
            }
            return ary;
        },
        hasClass:function(curEle,cName){
            var reg=new RegExp("(^| +)"+cName+"( +|$)","g");
            return reg.test(curEle.className);
        },
        addClass:function(curEle,strClass){
            var aryClass=strClass.replace(/(^| +)|( +|$)/g,"").split(/\s+/g);
            for(var i=0;i<aryClass.length;i++){
                if(!this.hasClass(curEle,aryClass[i])){
                    curEle.className+=" "+aryClass[i];
                    curEle.className=curEle.className.replace(/(^| +)|( +|$)/g,"").replace(/\s+/g,"")
                }
            }
        },
        removeClass:function(curEle,strClass){
            var aryClass=strClass.replace(/(^ +)|( +$)/g,"").split(/\s+/g);
            for(var i=0;i<aryClass.length;i++){
                var reg=new RegExp("(^| +)"+aryClass[i]+"( +|$)","g");
                if(reg.test(curEle.className)){
                    curEle.className=curEle.className.replace(reg," ").replace(/(^ +)|( +$)/g,"").replace(/\s+/g,"");
                }
            }
        },
        getCss:function(curEle,attr){
            var val=null;
            var reg=null;
            if(flag){
                val=getComputedStyle(curEle,null)[attr];
            }else{
                if(attr=="opacity"){
                    val=curEle.currentStyle["filter"]
                    reg=/alpha\(opacity[=:](\d+(\.\d+)?)\)$/gi;
                    return reg.test(val)?reg.exec(val)[1]/100:1;
                }else{
                    val=curEle.currentStyle[attr];
                }
            }
            reg=/^(right|left|top|bottom|width|height|((margin|padding)(right|left|top|bottom)?))$/gi;
            return reg.test(attr)?parseFloat(val):val;

        },
        setCss:function(curEle,attr,value){
            if(attr=='float'){
                curEle.style.cssFloat=value;
                curEle.style.styleFloat=value;
                return;
            }
            if(attr=='opacity'){
                curEle.style.opacity=value;
                curEle.style.filter="alpha(opacity="+value*100+")";
                return;
            }
            var reg=/^([+-])?(\d+(\.\d+)?)(px|pt|rem|em|%)?$/;
            if(reg.test(value)){
                if(Number(value)||Number(value)==0){
                    value=value+"px";
                }
            }

            curEle.style[attr]=value;
        },
        setGroupCss:function(curEle,opt){
            if(Object.prototype.toString.call(opt)!=="[object Object]") return;
            for(var attr in opt){
                this.setCss(curEle,attr,opt[attr])
            }
        },
        css:function(curEle){
            var argTwo=arguments[1];
            if(typeof argTwo=="string"){
                var argThree=arguments[2]
                if(typeof argThree==="undefined"){
                  return  this.getCss(curEle,argTwo);
                }else{
                    this.setCss(curEle,argTwo,argThr);
                }
            }
            if(Object.prototype.toString.call(argTwo)==="[object Object]"){
                this.setGroupCss(curEle,argTwo);
            }
        },
        win:function(attr,value){
            if(value===undefined){
                return document.documentElement[attr]||document.body[attr];
            }else{
                document.documentElement[attr]=document.body[attr]=value;
            }
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
            return{left:l,top:t};
        },
        rnd:function(n,m){
            n=Number(n);
            m=Number(m);
            if(isNaN(n)||isNaN(m)){
                return Math.random();
            }
            if(n>m){
                var tmp=n;
                n=m;
                m=tmp;
            }
            return Math.round(Math.random()*(m-n)+n);
        },
        makeArray:function(arg){
            var ary=[];
            if(flag){
               ary= Array.prototype.slice.call(arg);
            }else{
                for(var i=0;i<arg.length;i++){
                    ary.push(arg[i]);
                }
            }
            return ary;
        },
        jsonParse:function(jsonStr){
            return "JSON" in window? JSON.parse(jsonStr):eval('('+jsonStr+')');
        }


    }


})();
