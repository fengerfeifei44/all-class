/**
 * Created by Administrator on 2016/11/3.
 */
var utils={
    //���ܣ�������ת����
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
    //���ܣ����ݽ���
     jsonParse:function jsonParse(jsonStr){
         return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
     }
};