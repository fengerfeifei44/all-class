/**
 * Created by Administrator on 2016/11/21.
 */
(function(){
    var oBox=document.getElementById('box');
    var oBanner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBanner.getElementsByTagName('div');
    var aImg=oBox.getElementsByTagName('img');
    var oUl=oBox.getElementsByTagName('ul')[0];
    var aLi=oBox.getElementsByTagName('li');
    var oBtnLeft=oBox.getElementsByTagName('a')[0];
    var oBtnRight=oBox.getElementsByTagName('a')[1];
    var data=null;
    var timer=null;
    var n=0;
    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText)
            }
        }
        xml.send();
        console.log(data)
    }
    bind();
    function bind(){
        var strDiv='';
        var strLi='';
        for(var i=0;i<data.length;i++){
            strDiv+='<div><img src="" realImg="'+data[i].imgSrc+'" alt=""/></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>'
        }
        oUl.innerHTML=strLi;
        oBanner.innerHTML=strDiv;
    }
    //延迟加载
    lazyImg();
    function lazyImg(){
        for(var i=0;i<aImg.length;i++){
            (function(index){
                var tmp=new Image;
                tmp.src=aImg[i].getAttribute('realImg');
                tmp.onload=function(){
                    aImg[index].src=this.src;
                    tmp=null;
                    utils.css(aDiv[0],'opacity',1);
                    animate({
                        id:aDiv[0],
                        target:{
                            opacity:1
                        }
                    })
                }
            })(i)
        }
    }
    //图片渐隐渐现
    clearInterval(timer);
    timer=setInterval(autoMove,2000);
    function autoMove(){
        if(n>=aDiv.length-1){
            n=-1;
        }
        n++;
        setBanner();
    }
    function setBanner(){
        for(var i=0;i<aDiv.length;i++){
            if(i==n){
                utils.css(aDiv[i],'z-index',1);
                animate({
                    id:aDiv[i],
                    target:{
                        opacity:1
                    },
                    callback:function(){
                        var siblings=utils.siblings(this);
                        for(var i=0;i<siblings.length;i++){
                            utils.css(siblings[i],'opacity',0)
                        }
                    }
                })
            }else{
                utils.css(aDiv[i],'zIndex',0)
            }
            bannerTip();
        }
    }
    //焦点轮播
    function bannerTip(){
        for(var i=0;i<aLi.length;i++){
            aLi[i].className=i==n?"on":null;
        }
    }
    //鼠标移入停止，移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oBtnLeft.style.display=oBtnRight.style.display='block';
    }
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,2000);
        oBtnLeft.style.display=oBtnRight.style.display='none';
    }
    //点击焦点切换
    handleChange();
    function handleChange(){
        for(var i=0;i<aLi.length;i++){
            (function(index){
                aLi[i].onclick=function(){
                    n=index;
                    setBanner();
                }
            })(i)
        }

    }
    //点击按钮切换
    oBtnRight.onclick=function(){
        autoMove();
    }
    oBtnLeft.onclick=function(){
        if(n<=0){
            n=aDiv.length;
        }
        n--;
        setBanner();
    }
})()
