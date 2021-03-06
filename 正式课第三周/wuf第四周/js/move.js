/**
 * Created by Administrator on 2016/11/15.
 */
(function(){
    var zhu={
        Linear:function(t,b,c,d){
            return t*c/d+b;
        }
    }
    function move(curEle,target,callback){
        var begin={},change={};
        var duration=1000;
        var time=null;
        for(var attr in target){
            begin[attr]=utils.getCss(curEle,attr);
            change[attr]=target[attr]-begin[attr];
        }
        var timer=setInterval(function(){
            if(time>=duration){
                utils.css(curEle,target);
                clearInterval(timer);
                callback.call(curEle);
                return;
            }
            time+=10;
            for(var attr in change){
                var curPos=zhu.Linear(time,begin[attr],change[attr],duration);
                utils.css(curEle,attr,curPos);
            }

        },10)
    }
    window.imate=move;
})()