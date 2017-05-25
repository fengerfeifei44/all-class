/**
 * Created by Administrator on 2016/12/5.
 */
function ScreenSwitch(ele,oele,aDiv,aLi){
    this.ele=ele;
    this.oele=oele;
    this.aDiv=aDiv;
    this.aLi=aLi;
    this.n=0;
    this.isWheel=true;
    this.timer=null;
    this.init();

}
ScreenSwitch.prototype={
    constructor:ScreenSwitch,
    init:function(){
        this.changeScreen();
    },
    changeScreen:function(){
        var _this=this;
        wheel(this.ele,function(bOk){
            if(_this.isWheel){
                if(bOk){
                    if(_this.n>=_this.aDiv.length-1)return;
                    _this.n++;
                }else{
                    if(_this.n<=0)return;
                    _this.n--;
                }
                _this.isWheel=false;
                animate({
                    id:_this.oele,
                    target:{
                        top:-_this.n*utils.win('clientHeight')
                    },
                    effect:4,
                    callback:function(){
                        clearTimeout(_this.timer);
                        _this.timer=setTimeout(function(){
                            _this.isWheel=true;
                        },600)
                    }
                });
                _this.bannerTip();
            }
        })

    },
    bannerTip:function(){
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].className=i==this.n?'on':null;
        }
    }
}
