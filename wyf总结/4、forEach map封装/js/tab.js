/**
 * Created by Administrator on 2016/12/5.
 */
/**
 * 遍历数组中的每一项，没有返回值undefined
 * @param callback 中有三个参数item（每一项的值） index（每一项的索引） input(数组)
 * @param context 改变回调函数中的this指向
 */
Array.prototype.myForEach=function(callback,context){
    context=context||window;
    if('forEach' in window){
        this.forEach(callback,context);
    }else{
        for(var i=0;i<this.length;i++){
            callback.call(context,this[i],i,this);
        }
    }
}
/**
 * 遍历数组中的每一项，有返回值，把回调函数的返回值放进一个数组里，
 * @param callback 中有三个参数item（每一项的值） index（每一项的索引） input(数组)
 * @param context 改变回调函数中的this指向
 */
Array.prototype.myMap=function(callback,context){
    context=context||window;
    if('map' in window){
        return this.map(callback,context);
    }else{
        var ary=[];
        for(var i=0;i<this.length;i++){
            var res=callback.call(context,this[i],i,this);
            ary.push(res);
        }
        return ary;
    }
}