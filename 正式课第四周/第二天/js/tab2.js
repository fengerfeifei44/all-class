/**
 * Created by 39753 on 2016/11/16.
 */
(function(){
    //获取元素
    var oBox=document.getElementById('box');
    var oBoxInner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBoxInner.getElementsByTagName('div');
    var aLi=oBox.getElementsByTagName('li');
    var oBtnLeft=oBox.getElementsByTagName('a')[0];
    var oBtnRight=oBox.getElementsByTagName('a')[1];
    var n=0;
    var timer=null;
    oBoxInner.innerHTML+='<div><img src="img/banner1.jpg" alt=""></div>';
    oBoxInner.style.width=aDiv[0].offsetWidth*aDiv.length+'px';
    //1.图片自动轮播
    clearInterval(timer);
    timer=setInterval(autoMove,2000);
    function autoMove(){
        if(n>=aDiv.length-1){
            n=0;
            utils.css(oBoxInner,'left',-n*1000);
        }
        n++;
        //utils.css(oBoxInner,'left',-n*1000);
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            },
            duration:1000,
            effect:['Bounce','easeOut']
        })
        bannerTip();
    }
    //2.焦点自动轮播
    function bannerTip(){
        var tmp=n>=aLi.length?0:n;
        for(var i=0; i<aLi.length; i++){
            aLi[i].className=i==tmp?'on':null;
        }
    }

    //3.鼠标移入停止移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oBtnLeft.style.display=oBtnRight.style.display='block';
    };
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,2000);
        oBtnLeft.style.display=oBtnRight.style.display='none';
    };
    //4.点击焦点手动切换
    handleChange();
    function handleChange(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].index=i;
            aLi[i].onclick=function(){
                n=this.index;
                animate({
                    id:oBoxInner,
                    target:{
                        left:-n*1000
                    },
                    duration:1000
                });
                bannerTip();
            }
        }
    }
    //5.点击左右按钮进行切换
    oBtnRight.onclick=autoMove;
    oBtnLeft.onclick=function(){
        if(n<=0){
            n=aDiv.length-1;
            utils.css(oBoxInner,'left',-n*1000);
        }
        n--;
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            },
            duration:1000
        });
        bannerTip();
    }

})();