/**
 * Created by Administrator on 2016/11/17.
 */
function MyTab(id,url){
    this.id=id;
    this.url=url;
    this.oBox=document.getElementById(id);
    this.oBanner=this.oBox.getElementsByTagName('div')[0];
    this.aDiv=this.oBanner.getElementsByTagName('div');
    this.aImg=this.oBox.getElementsByTagName('img');
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    this.aLi=this.oBox.getElementsByTagName('li');
    this.oLeft=this.oBox.getElementsByTagName('a')[0];
    this.oRight=this.oBox.getElementsByTagName('a')[1];
    this.timer=null;
    this.n=0;
    this.data=null;
    this.init();
}
MyTab.prototype={
    constructor:MyTab,
    init:function(){
        var _this=this;
        //1、获取数据
        this.getData();
        //2、绑定数据
        this.bind();
        //3、图片加载
        this.lazyImg();
        //4、图片轮播
        this.timer=setInterval(function(){
            _this.autoMove();
        },2000);
        //5、焦点轮播
        //6、鼠标移入停止 移出继续
        this.overout();
        //7、点击焦点手动切换
        this.handleChange();
        //8、点击左右按钮手动切换
        this.leftRight();

    },
    getData:function(){
        var _this=this;
        var xml=new XMLHttpRequest;
        xml.open('get',this.url,false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText)
            }
        }
        xml.send();
        //console.log(_this.data)

    },
    bind:function(){
        var strDiv='';
        var strLi='';
        for(var i=0;i<this.data.length;i++){
            strDiv+='<div><img src="" realImg="'+this.data[i].imgSrc+'" alt=""/></div>';
            strLi+=i===0?'<li class="on"></li>':'<li></li>';
        }
        strDiv+='<div><img src="" realImg="'+this.data[0].imgSrc+'" alt=""/></div>';
        this.oBanner.innerHTML=strDiv;
        this.oUl.innerHTML=strLi;
        this.oBanner.style.width=this.aDiv[0].offsetWidth*this.aDiv.length+'px';

    },
    lazyImg:function(){
        for(var i=0;i<this.aImg.length;i++){
            var _this=this;
            (function(index){
                var tmpImg=new Image;
                tmpImg.src=_this.aImg[index].getAttribute('realImg');
                tmpImg.onload=function(){
                    _this.aImg[index].src=this.src;
                    tmpImg=null;
                }
            })(i)
        }
    },
    autoMove:function(){
        if(this.n>=this.aDiv.length-1){
            this.n=0;
            utils.css(this.oBanner,'left',-this.n*1000)
        }
        this.n++;
       animate({
           id:this.oBanner,
           target:{
               left:-this.n*1000
           },
           duration:500
       });
        this.bannerTip();
    },
    bannerTip:function(){
        var tmp=this.n==this.aLi.length?0:this.n;
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].className=i==tmp?"on":"none";
        }
    },
    overout:function(){
        var _this=this;
        this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            _this.oLeft.style.display=_this.oRight.style.display='block';
        }
        this.oBox.onmouseout=function(){
            _this.timer=setInterval(function(){
                _this.autoMove();
            },2000);
            _this.oLeft.style.display=_this.oRight.style.display='none';
        }
    },
    handleChange:function(){
        var _this=this;
        for(var i=0;i<this.aLi.length;i++){
            (function(index){
               _this.aLi[i].onclick=function(){
                   _this.n=index;
                   animate({
                       id:_this.oBanner,
                       target:{
                           left:-_this.n*1000
                       },
                       duration:500
                   });
                   _this.bannerTip();
               }

            })(i)
        }
    },
    leftRight:function(){
        var _this=this;
        this.oLeft.onclick=function(){
            if(_this.n<=0){
                _this.n=_this.aLi.length;
                utils.css(_this.oBanner,"left",-_this.n*1000);
            }
            _this.n--;
            animate({
                id:_this.oBanner,
                target:{
                    left:-_this.n*1000
                },
                duration:500
            });
            _this.bannerTip();

        }
        this.oRight.onclick=function(){
            _this.autoMove();
        }
    }



}