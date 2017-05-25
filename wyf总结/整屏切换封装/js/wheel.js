/**
 * Created by Administrator on 2016/12/4.
 */
(function(){
    window.wheel=function(ele,cb){
        function dir(e){
            e=e||window.event;
            var bOk=null;
            if(e.wheelDelta){//IE浏览器，
                bOk=e.wheelDelta<0?true:false;
            }else{//火狐
                bOk=e.detail>0?true:false;
            }
            cb && cb.call(ele,bOk);
            e.preventDefault?e.preventDefault():e.returnValue=false;//阻止系统滚轮
        }
        if(window.navigator.userAgent.toLocaleLowerCase().indexOf('firefox')!==-1){
            ele.addEventListener('DOMMouseScroll',dir,false)
        }else{
            ele.onmousewheel=dir;
        }
    }
})()
