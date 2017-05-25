/**
 * Created by Administrator on 2016/11/3.
 */
var utils= {
    jsonParse: function jsonParse(str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    },
    makeArray:function makeArray(arg){
        var ary=[];
        try{
            ary=Array.prototype.slice.call(arg);
        }catch (e){
            for(var i=0; i<arg.length; i++){
                ary.push(arg[i]);
            }
        }
        return ary;
    }
};
