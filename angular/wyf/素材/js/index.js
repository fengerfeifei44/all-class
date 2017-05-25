/**
 * Created by Administrator on 2017/1/5.
 */
(function(){
    var winW=document.documentElement.clientWidth,
        desW=640,
        htmlFont=winW/desW*100;
    if(winW>=640){
        $('.musicBox').css({width:desW,margin:'0 auto'});
        window.htmlFont=100;
        return;
    }
    window.htmlFont=htmlFont;
    document.documentElement.style.fontSize=htmlFont+'px'
})();