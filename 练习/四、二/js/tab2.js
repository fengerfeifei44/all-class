/**
 * Created by Administrator on 2016/11/17.
 */
(function(){
    var oBox=document.getElementById('div');
    var oBanner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBanner.getElementsByTagName('div');
    var aLi=document.getElementsByTagName('li');
    var oLeft=document.getElementsByTagName('a')[0];
    var oRight=document.getElementsByTagName('a')[1];
    var timer=null;
    var n=0;
    //图片轮播
    oBanner.innerHTML+='<div><img src="img/banner1.jpg" alt=""/></div>';
    oBanner.style.width=aDiv[0].offsetWidth*aDiv.length+"px";
    clearInterval(timer);
    timer=setInterval(autoMove,1500);
    //自动轮播
    function autoMove(){
        if(n>=aDiv.length-1){
            n=0;
            utils.css(oBanner,'left',-n*1000)
        }
        n++;
        animate({
                id:oBanner,
                target:{
                    left:-n*1000
                }
            });
        bannerTip();
    }
    //焦点轮播
    function bannerTip(){
        var tmp=n==aLi.length?0:n;
        console.log(tmp)
        for(var i=0;i<aLi.length;i++){

            aLi[i].className=i===tmp?"on":null;
        }
    }
    //鼠标移入停止 移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oLeft.style.display=oRight.style.display='block';
    }
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,1500);
        oLeft.style.display=oRight.style.display='none';
    }
    //鼠标点击焦点自动切换
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
                });
                bannerTip();
            }
        }
    }
    //鼠标点击左右按钮切换
    oRight.onclick=autoMove;
    oLeft.onclick=function(){
        if(n<=0){
            n=aDiv.length-1;
            utils.css(oBanner,'left',-n*1000)
        }
        n--;
        animate({
            id:oBanner,
            target:{
                left:-n*1000
            }
        });
        bannerTip()
    }
})()
