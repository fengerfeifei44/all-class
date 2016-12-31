/**
 * Created by Administrator on 2016/12/3.
 */
function Tab(opt){
    if(!opt.id) return;
    this.default={
        duration:2000,
        url:"json/data.txt"
    }
    for(var attr in opt){
        this.default[attr]=opt[attr]
    }
    this.oBox=document.getElementById(this.default.id);
    this.oBanner=this.oBox.getElementsByTagName('div')[0];
    this.aDiv=this.oBanner.getElementsByTagName('div');
    this.aImg=this.oBox.getElementsByTagName('img');
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    console.log(this.oBox)
    this.aLi=this.oUl.getElementsByTagName('li');
    this.oLeft=this.oBox.getElementsByTagName('a')[0];
    this.oRight=this.oBox.getElementsByTagName('a')[1];
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
        //图片轮播
        clearInterval(this.timer)
        this.timer=setInterval(function(){
            _this.autoMove();
        },this.default.duration)
        //焦点轮播
        //鼠标移出停止 移出继续
        this.overout()
        //点击焦点手动切换
        this.handleChange();
        //点击按钮切换
        this.leftRight();

    },
    getData:function(){
        var _this=this;
        var xml=new XMLHttpRequest;
        xml.open('get',this.default.url,false);
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
            strDiv+='<div><img src="" realImg='+this.data[i].imgSrc+' alt=""/></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>'
        }
        strDiv+='<div><img src="" realImg='+this.data[0].imgSrc+' alt=""/></div>';
        this.oBanner.innerHTML=strDiv;
        this.oUl.innerHTML=strLi;
        this.oBanner.style.width=this.aDiv[0].offsetWidth*this.aDiv.length+'px';
    },
    lazyImg:function(){
        var _this=this;
        for(var i=0;i<this.aImg.length;i++){
            (function(index){
                var cur=_this.aImg[index]
                var tmpImg=new Image;
                tmpImg.src=cur.getAttribute('realImg');
                tmpImg.onload=function(){
                    cur.src=this.src;
                    tmpImg=null;
                }
            })(i)
        }

    },
    autoMove:function(){
        if(this.n>=this.aDiv.length-1){
            this.n=0;
            utils.css(this.oBanner,'left',-this.n*1000);
        }
        this.n++;
        animate({
            id:this.oBanner,
            target:{
                left:-this.n*1000
            }
        })
        this.bannerTip();
    },
    bannerTip:function(){
        var tmp=this.n==this.aLi.length?0:this.n;
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].className=i==tmp?"on":null;
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
            },_this.default.duration)
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
                        }
                    })
                    _this.bannerTip();
                }
            })(i)
        }
    },
    leftRight:function(){
        var _this=this;
        this.oRight.onclick=function(){
            _this.autoMove();
        }
        this.oLeft.onclick=function(){
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
            })
            _this.bannerTip();
        }
    }


}