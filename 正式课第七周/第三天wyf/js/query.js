/**
 * Created by Administrator on 2016/12/9.
 */
String.prototype.queryURLParameter=function (){
    var reg=/([^&=?#]+)=([^&=?#]+)/g;
    var obj={};
    this.replace(reg,function(){
        obj[arguments[1]]=arguments[2];
    })
    return obj;
}



    /*(function(pro){
    function queryURLParameter(){
        var reg=/([^&=?#]+)=([^&=?#]+)/g;
        var obj={};
        this.replace(reg,function(){
            obj[arguments[1]]=arguments[2];
        })
        return obj;
    }
    pro.queryURLParameter=queryURLParameter;
})(String.prototype)*/