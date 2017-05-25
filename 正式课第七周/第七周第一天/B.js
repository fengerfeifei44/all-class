/**
 * Created by Administrator on 2016/12/6.
 */
/*var a=require('./A');
var  res=a.sum(1,2,3,4,'5','6px')
console.log(res);*/
var a=require('./A')
function avg(){
    var res=a.sum.apply(null,arguments);
    return res/arguments.length;
}
module.exports={
    avg:avg
}
