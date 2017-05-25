/**
 * Created by Administrator on 2016/11/4.
 */
var utils={
    /**
     * 获得去JSON数据的字符串格式转化为对象格式
     * @param jsonStr
     * @returns {Object}
     */
    jsonParse:function(jsonStr){
        return "JSON" in window? JSON.parse(jsonStr):eval("("+jsonStr+")");
    },
    /**
     * 类数组转数组
     * @param arg
     * @returns {*}
     */
    makeArray:function makeArray(arg){
        try{
            return Array.prototype.slice.call(arg);
        }catch(e){
            var ary=[];
            for(var i=0;i<arg.length;i++){
                ary.push(arg[i]);
            }
            return ary;
        }
    },

    /**
     * 获取上一个哥哥元素节点
     * @param curEle
     * @returns {*}
     */
    prev:function prev(curEle){
        if(curEle.previousElementSibling){
            return curEle.previousElementSibling;
        }
       var pre=curEle.previousSibling;
        while(pre&&pre.nodeType!==1){
            pre=pre.previousSibling;
        }
        return pre;
    },
    children:function children(curEle){
        var aChild=curEle.childNodes;
        var ary=[];
        for(var i=0;i<aChild.length;i++){
            if(aChild[i].nodeType==1){
                ary.push(aChild[i]);
            }
        }
        return ary;
    },
    hasPubProperty:function(attr,obj){
        return "attr" in obj && !obj.hasOwnProperty(attr);
    }
};
