/**
 * Created by Administrator on 2017/1/20.
 */
(function () {
    let desW=640;
    let winW=document.documentElement.clientWidth;
    let ratio=winW/desW;
    let oMain=document.querySelector('.main');
    if(winW>desW){
        oMain.style.margin='0 auto';
        oMain.style.width=desW+'px';
        return;
    }
    document.documentElement.style.fontSize=ratio*100+'px';
})()