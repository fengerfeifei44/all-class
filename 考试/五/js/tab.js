/**
 * Created by Administrator on 2016/11/22.
 */
function MyTab(id,url,duration){
    this.id=id;
    this.url=url;
    this.duration=duration;
    this.oBox=document.getElementById(id);
    this.oBanner=this.oBox.getElementsByTagName('div')[0];
    this.aDiv=this.oBanner.getElementsByTagName('div');
    this.aImg=this.oBox.getElementsByTagName('img');
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    this.aLi=this.oUl.getElementsByTagName('li');
    this.oBtnLeft=this.oBox.getElementsByTagName('a')[0];
    this.oBtnRight=this.oBox.getElementsByTagName('a')[1];
    this.data=null;
    this.timer=null;
    this.n=0;
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
        //3、延迟加载
        setTimeout(function(){
            _this.lazyImg();
        },500)
        //4、图片自动轮播
        clearInterval(_this.timer)
        this.timer=setInterval(function(){
            _this.autoMove();
        },this.duration)
        //5、焦点自动轮播
        //6、鼠标移入停止移出继续
        this.overOut()
        //7、点击焦点手动轮播
        this.handleChange();
        //8、点击按钮轮播
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
        console.log(_this.data)
    },
    bind:function(){
        var strDiv='';
        var strLi='';
        for(var i=0;i<this.data.length;i++){
            strDiv+='<div><img src="" realImg="'+this.data[i].imgSrc+'" alt=""/></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>'
        }
        strDiv+='<div><img src="" realImg="'+this.data[0].imgSrc+'" alt=""/></div>';
        this.oBanner.innerHTML=strDiv;
        this.oUl.innerHTML=strLi;
        this.oBanner.style.width=this.aDiv[0].offsetWidth*this.aDiv.length+'px';
    },
    lazyImg:function(){
        var _this=this;
        for(var i=0;i<this.aImg.length;i++){
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
            }

        });
        this.bannerTip();
    },
    bannerTip:function(){
        var tmp=this.n==this.aLi.length?0:this.n;
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].className=i==tmp?"on":null;
        }
    },
    overOut:function(){
        var _this=this;
        this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            _this.oBtnLeft.style.display=_this.oBtnRight.style.display="block";
        }
        this.oBox.onmouseout=function(){
            _this.timer=setInterval(function(){
                _this.autoMove();
            },_this.duration)
            _this.oBtnLeft.style.display=_this.oBtnRight.style.display="none";
        }
    },
    handleChange:function(){
        var _this=this;
        for(var i=0;i<this.aLi.length;i++){
            (function(index){
                _this.aLi[index].onclick=function(){
                    _this.n=index;
                    animate({
                        id:_this.oBanner,
                        target:{
                            left:-_this.n*1000
                        }

                    });
                    _this.bannerTip();
                }
            })(i)
        }
    },
    leftRight:function(){
        var _this=this;
        this.oBtnRight.onclick=function(){
            _this.autoMove();
        }
        this.oBtnLeft.onclick=function(){
            if(_this.n<=0){
                _this.n=_this.aDiv.length-1;
                utils.css(_this.oBanner,'left',-_this.n*1000)
            }
            _this.n--;
            animate({
                id:_this.oBanner,
                target:{
                    left:-_this.n*1000
                }

            });
            _this.bannerTip();
        }
    }
}
