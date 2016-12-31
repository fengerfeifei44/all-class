/**
 * Created by Administrator on 2016/11/17.
 */
(function(){
    //获取元素
    var oBox=document.getElementById('box');
    var oBanner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBanner.getElementsByTagName('div');
    var aImg=oBox.getElementsByTagName('img');
    var oUl=oBox.getElementsByTagName('ul')[0];
    var aLi=oBox.getElementsByTagName('li');
    var oLeft=oBox.getElementsByTagName('a')[0];
    var oRight=oBox.getElementsByTagName('a')[1];
    var timer=null;
    var n=0;
    var data=null;
    //获取数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        }
        xml.send();
        console.log(data);

    }
    //绑定数据
    bind();
    function bind(){
        var strDiv='';
        var strLi='';
        for(var i=0;i<data.length;i++){
            strDiv+='<div><img src="" realImg="'+data[i].imgSrc+'" alt=""/></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>'
        }
        strDiv+='<div><img src="" realImg="'+data[0].imgSrc+'" alt=""/></div>';
        oBanner.innerHTML=strDiv;
        oBanner.style.width=aDiv[0].offsetWidth*aDiv.length+'px';

        oUl.innerHTML=strLi;
    }
    //图片延迟加载
    setTimeout(lazyImg,500);
    function lazyImg(){
        for(var i=0;i<aImg.length;i++){
            var tmpImg=new Image;
            tmpImg.index=i;
            tmpImg.src=aImg[i].getAttribute('realImg');
            tmpImg.onload=function(){
                aImg[this.index].src=this.src;
                //console.log(index)
                tmpImg=null;
            }
        }
    }
    //function lazyImg(){
    //    for(var i=0;i<aImg.length;i++){
    //        (function(index){
    //            var tmpImg=new Image;
    //            tmpImg.src=aImg[i].getAttribute('realImg');
    //            tmpImg.onload=function(){
    //                aImg[index].src=this.src;
    //                tmpImg=null;
    //            }
    //        })(i)
    //    }
    //}
    //图片自动轮播

    clearInterval(timer);
    timer=setInterval(autoMove,1500);
    function autoMove(){
        if(n>=aDiv.length-1){
            n=0;
            utils.css(oBanner,'left',-n*1000);
        }
        n++;
        animate({
            id:oBanner,
            target:{
                left:-n*1000
            }

        })
        bannerTip();
    }
    //焦点自动轮播
    function bannerTip(){
        var tmp=n==aLi.length?0:n;
        for(var i=0;i<aLi.length;i++){
            aLi[i].className=i==tmp?"on":null;
        }
    }
    //鼠标移入停止移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oLeft.style.display=oRight.style.display='block';
    }
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,1500);
        oLeft.style.display=oRight.style.display='none';
    }
    //点击焦点
    handleChange()
    function handleChange(){
        for(var i=0;i<aLi.length;i++){
            aLi[i].index=i;
            aLi[i].onclick=function(){
                n=this.index;
                animate({
                    id:oBanner,
                    target:{
                        left:-n*1000
                    }

                })
                bannerTip();
            }
        }
    }
    //点击左右按钮
    oRight.onclick=autoMove;
    oLeft.onclick=function(){
        n--;
        animate({
            id:oBanner,
            target:{
                left:-n*1000
            }

        });
        bannerTip();
    }
})()
