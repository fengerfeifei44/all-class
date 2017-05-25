/**
 * Created by Administrator on 2017/1/6.
 */
(function(){
    var winW=document.documentElement.clientWidth;
    var desW=640;
    var htmlFont=winW/desW*100;
    if(winW>=desW){
        $('.musicBox').css({
            width:desW,
            margin:'0 auto'
        });
        window.htmlFont=htmlFont;
        return;
    }
    document.documentElement.fontSize=htmlFont+'px';
})();
(function(){
    var winH=document.documentElement.clientHeight;
    var headerH=$('.header')[0].offsetHeight;
    var footerH=$('.footer')[0].offsetHeight;
    $('.main').css('height',winH-headerH-footerH-htmlFont*.8);
})()