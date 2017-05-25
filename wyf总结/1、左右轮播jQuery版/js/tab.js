/**
 * Created by Administrator on 2016/12/5.
 */
function Tab(opt){
    if(!opt.id)return;
    this.defaultOpt={
        duration:2000,
    }
    for(var attr in opt){
        this.defaultOpt[attr]=opt[attr];
    }
    this.$oBox=$("#"+this.defaultOpt.id);
    this.$obanner=this.$oBox.find(".banner");
    this.$aDiv=null;
    this.$aImg=null;
    this.$oUl=this.$oBox.find('ul');
    this.$aLi=null;
    this.$left=this.$oBox.find('#left');
    this.$right=this.$oBox.find('#right');
    this.data=null;
    this.timer=null;
    this.n=0;
    this.init();
}
Tab.prototype={
    constructor:Tab,
    init:function(){
        var _this=this;
        //获取数据
        this.getData();
        //绑定数据
        this.bind();
        //图片延迟加载
        setTimeout(function(){
            _this.lazyImg();
        },500)
        //图片自动轮播
        this.timer=setInterval(function(){
            _this.autoMove();
        },this.defaultOpt.duration)
        //焦点自动轮播
        //鼠标移入停止，移出继续
        this.overout();
        //点击焦点手动切换
        this.handleChange();
        //点击左右按钮切换
        this.leftRight();
    },
    getData:function(){
        var _this=this;
        $.ajax({
            type:"get",
            url:this.defaultOpt.url,
            dataType:'json',
            async:false,
            success:function(val){
                _this.data=val;
            }
        })
    },
    bind:function(){
        var strDiv='';
        var strLi='';
        var _this=this;
        $.each(this.data,function(index,item){
            strDiv+='<div><img src="" realImg="'+_this.data[index].imgSrc+'" alt=""/></div>';
            strLi+=index==0?'<li class="on"></li>':'<li></li>';
        })
       // this.$obanner.width()=this.$aDiv.first().outerHeight()*this.$aDiv.length+'px';
        strDiv+='<div><img src="" realImg="'+_this.data[0].imgSrc+'" alt=""/></div>';
        this.$obanner.html(strDiv);
        this.$oUl.html(strLi);
        this.$aDiv=this.$obanner.children('div');
        this.$aImg=this.$oBox.find('img');
        this.$aLi=this.$oUl.children('li');
        this.$obanner.css({'width':this.$aDiv.first().outerWidth()*this.$aDiv.length})
    },
    lazyImg:function(){
        var _this=this;
        $.each(this.$aImg,function(index,item){
            var tmpImg=new Image;
            tmpImg.src=item.getAttribute('realImg');
            tmpImg.onload=function(){
                item.src=tmpImg.src;
                tmpImg=null;
            }
        })
    },
    autoMove:function(){
        if(this.n>=this.$aDiv.length-1){
            this.n=0;
            this.$obanner.css({"left":-this.n*1000})
        }
        this.n++;
        this.$obanner.animate({
            left:-this.n*1000
        })
        this.bannerTip();
    },
    bannerTip:function(){
        var tmp=this.n==this.$aLi.length?0:this.n;
        $.each(this.$aLi,function(index,item){
            item.className=index==tmp?'on':null;
        })

    },
    overout:function(){
        var _this=this;
        this.$oBox.on('mouseover',function(){
            clearInterval(_this.timer);
            _this.$left.show();
            _this.$right.show();
        })
        this.$oBox.on('mouseout',function(){
            _this.timer=setInterval(function(){
                _this.autoMove();
            },_this.defaultOpt.duration)
            _this.$left.hide();
            _this.$right.hide();
        })
    },
    handleChange:function(){
        var _this=this;
       this.$aLi.click(function(){
           _this.n=$(this).index();
           console.log(_this.n)
           _this.$obanner.animate({
               left:-_this.n*1000
           })
           _this.bannerTip();
       })
    },
    leftRight:function(){
        var _this=this;
        this.$right.click(function(){
            _this.autoMove();
        })
        this.$left.click(function(){
            if(_this.n<=0){
                _this.n=_this.$aLi.length
                _this.$obanner.css({"left":-_this.n*1000})
            }
            _this.n--;
            _this.$obanner.animate({
                left:-_this.n*1000
            })
            _this.bannerTip();
        })
    }
}