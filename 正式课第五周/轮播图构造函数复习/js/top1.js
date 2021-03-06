/**
 * Created by Administrator on 2016/11/27.
 */
function Top(opt){
    if(!opt.id)return;
    this.defaultOpt={
        duration:1000
    }
    for(var attr in opt){
        this.defaultOpt[attr]=opt[attr]
    }
    this.$btn=$('#'+this.defaultOpt.id);
    this.init();
}
Top.prototype={
    constructor:Top,
    init:function(){
        this.goHome();
        this.sideHide();
    },
    goHome:function(){
        var _this=this;
        this.$btn.click(function(){
            _this.$btn.hide();
            $(window).off('scroll');
            var target=$(window).scrollTop();
            var interval=10;
            var step=target/_this.defaultOpt.duration*interval;
            clearInterval(timer);
            var timer=setInterval(function(){
                var curTop=$(window).scrollTop();
                if(curTop<=0){
                    clearInterval(timer);
                    $(window).on('scroll',function(){
                        _this.computedDisplay();
                    },interval)
                }
                curTop-=step;
                $(window).scrollTop(curTop)
            },interval)
        })
    },
    sideHide(){
        var _this=this;
        $(window).on('scroll',function(){
            _this.computedDisplay();
        })
    },
    computedDisplay:function(){
        if($(window).scrollTop()>=$(window).height()){
            this.$btn.show()
        }else{
            this.$btn.hide()
        }
    }
}
