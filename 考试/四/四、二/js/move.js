/**
 * Created by Administrator on 2016/11/16.
 */
(function(){
    var zhufengEffort={
        Linear:function(t,b,c,d){
            return t*c/d+b;
        }
    }
    function move(curEle,target,callback){
        var begin={},change={};
        var duration=1000;
        var time=null;
        for(var attr in target){
            begin[attr]=utils.css(curEle,attr);
            change[attr]=target[attr]-begin[attr];
        }
        var timer=setInterval(function(){
            if(time+10>=duration){
                utils.css(curEle,target);
                clearInterval(timer);
                if(typeof callback=='function')callback.call(curEle);
                return;
            }
            time+=10;
            for(var attr in target){
                var curPos=zhufengEffort.Linear(time,begin[attr],change[attr],duration);
                utils.css(curEle,attr,curPos)
            }
        },10)
    }
    window.inamate=move;
})()
