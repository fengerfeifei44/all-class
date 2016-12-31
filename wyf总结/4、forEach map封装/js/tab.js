/**
 * Created by Administrator on 2016/12/5.
 */
Array.prototype.myForEach=function(context,callback){
    context=context||window;
    if('forEach' in window){
        this.forEach(context,callback);
    }else{
        for(var i=0;i<this.length;i++){
            this.call(context,this[i],i,this);
        }
    }
}
Array.prototype.myMap=function(context,callback){
    context=context||window;
    if('map' in window){
        return this.map(context,callback);
    }else{
        var ary=[];
        for(var i=0;i<this.length;i++){
            var res=this.call(context,this[i],i,this);
            ary.push(res);
        }
        return ary;
    }
}