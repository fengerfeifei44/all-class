/**
 * Created by Administrator on 2016/11/2.
 */
var utils={
    jsonParse: function jsonParse(str){
    return "JSON" in window?JSON.parse(str):eval("("+str+")");
}
};