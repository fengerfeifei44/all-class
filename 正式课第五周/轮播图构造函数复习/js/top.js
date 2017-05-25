/**
 * Created by Administrator on 2016/11/26.
 */
function Top(opt){
    if(!opt.id) return;
    this.defaultOpt={
        duration:1000
    }
    for(var attr in opt){
        this.defaultOpt[attr]=opt[attr]
    }
    this.id=$('#'+this.defaultOpt.id);
    this.init();
}
Top.prototype={
    constructor:Top,
    init:function(){
        //点击按钮回到顶部
        this.goHome();
        //按钮大于一屏幕隐藏
        //点击按钮立即隐藏
        this.showHide();
    },
    goHome:function(){
        var _this=this;
        this.id.click(function(){
            _this.id.hide();
            $(window).off('scroll');
            var target=$(window).scrollTop();
            var interval=10;
            var step=target/_this.defaultOpt.duration*interval;
            clearInterval(timer);
            var timer=setInterval(function(){
                var curTop=$(window).scrollTop();
                if(curTop<=0){
                    clearInterval(timer)
                    $(window).on("scroll",function(){
                       _this.computedDisplay();
                    })
                    return;
                }
                curTop-=step;
                $(window).scrollTop(curTop)
            },interval)
        })
    },
    showHide:function(){
        var _this=this;
        $(window).on('scroll',function(){
            _this.computedDisplay();
        })
    },
    computedDisplay:function(){
        if($(window).scrollTop()>=$(window).height()){
            this.id.show();
        }else{
            this.id.hide();
        }
    }
}
