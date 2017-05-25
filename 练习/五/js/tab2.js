/**
 * Created by Administrator on 2016/11/25.
 */
function Tab(opt){
    if(!opt.id) return;
    this.defaultOpt={
        duration:2000,
        url:'json/data.txt',
        effect:0
    }
    for(var attr in opt){
        this.defaultOpt[attr]=opt[attr]
    }
    this.$box=$("#"+this.defaultOpt.id);
    this.$banner=this.$box.children('.banner');
    this.$aDiv=null;
    this.$aImg=null;
    this.$ul=this.$box.children('ul');
    this.$aLi=null;
    this.$left=this.$box.find('.left');
    this.$right=this.$box.find('.right');
    this.timer=null;
    this.data=null;
    this.n=0
    this.init();
}
Tab.prototype={
    constructor:Tab,
    init:function(){
        var _this=this;
        //1、获取数据
        this.getData();
        //2、绑定数据
        this.bind();
        //3、延迟加载
        this.lazyImg();
        //4、图片渐隐渐现
        this.timer=setInterval(function(){
            _this.autoMove();
        },this.defaultOpt.duration)
        //5、焦点自动轮播
        //6、鼠标移入停止移出继续
        this.overout();
        //7、点击焦点手动轮播
        this.handleChange();
        //8、点击左右按钮轮播
        this.leftRight();
    },
    getData:function(){
        var _this=this;
        $.ajax({
            type:'GET',
            url:_this.defaultOpt.url,
            async :false,
            dataType:'json',
            success:function(val){
                _this.data=val;
            }
        })
        console.log(this.data)
    },
    bind:function(){
        var strDiv='';
        var strLi='';
        $.each(this.data,function(index,item){
            strDiv+='<div><img src="" realImg="'+item.imgSrc+'" alt=""/></div>';
            strLi+=index==0?'<li class="on"></li>':'<li></li>'
        })
        this.$banner.html(strDiv);
        this.$ul.html(strLi);
        this.$aDiv=this.$banner.children('div');
        this.$aImg=this.$box.find('img');
        this.$aLi=this.$ul.children('li');
    },
    lazyImg:function(){
        var _this=this;
        $.each(this.$aImg,function(index,item){
            var tmpImg=new Image;
            tmpImg.src=$(item).attr('realImg')
            tmpImg.onload=function(){
                $(item).attr('src',this.src)
                tmpImg=null;
                _this.$aDiv.first().css('zIndex',1).animate({opacity:1})
            }
        })
    },
    autoMove:function(){
        if(this.n>=this.$aDiv.length-1){
            this.n=-1;
        }
        this.n++;
        this.setBanner();
    },
    setBanner:function(){
        var _this=this
        $.each(this.$aDiv,function(index,item){
            if(index==_this.n){
                $(item).css('zIndex',1).siblings().css('zIndex',0);
                $(item).animate({opacity:1},function(){
                    $(item).siblings().animate({opacity:0})
                })
            }
        })
        this.bannerTip();
    },
    bannerTip:function(){
        var _this=this
        $.each(this.$aLi,function(index,item){
           item.className=index==_this.n?"on":null
        })
    },
    overout:function(){
        var _this=this;
        this.$box.mouseover(function(){
            clearInterval(_this.timer);
            _this.$left.show();
            _this.$right.show();
        })
        this.$box.mouseout(function(){
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
            _this.setBanner();
        })
    },
    leftRight:function(){
        var _this=this;
        this.$right.click(function(){
            _this.autoMove();
        })
        this.$left.click(function(){
            if(_this.n<=0){
                _this.n=_this.$aDiv.length;
            }
            _this.n--;
            _this.setBanner();
        })
    }
}
