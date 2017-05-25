/**
 * Created by Administrator on 2016/11/29.
 */
var oDiv=document.getElementsByTagName('div')[0];
var tmp=0;
on(oDiv,'mousedown',down);

function down(e){
    this.l=this.offsetLeft;
    this.t=this.offsetTop;
    this.x= e.clientX;
    this.y= e.clientY;
    if(this.setCapture){
        this.setCapture();
        on(this,'mousemove',move);
        on(this,'mouseup',up)
    }else{
        this.Move=processThis(move,this);
        this.Up=processThis(up,this);
        on(document,'mousemove',this.Move);
        on(document,'mouseup',this.Up);
        e.preventDefault();
    }
    fire(oDiv,'selfDown',e)
   /* clearTimeout(this.flytimer);
    clearTimeout(this.dropTimer);*/
}
function move(e){
    e=e||window.event;
    this.style.left=this.l+ e.clientX-this.x+'px';
    this.style.top=this.t+ e.clientY-this.y+'px';
   /* if(!this.prev){
        this.prev= e.clientX;
    }else{
        this.speedX= e.clientX-this.prev;
        this.prev= e.clientX;
    }*/
    fire(oDiv,'selfMove',e)
}
function up(e){
    if(this.releaseCapture){
        this.releaseCapture();
        off(this,'mousemove',move);
        off(this,'mouseup',up)
    }else{
        off(document,'mousemove',this.Move);
        off(document,'mouseup',this.Up);
    }
    /*fly.call(this);
    drop.call(this);
*/
}
function fly(){
    clearTimeout(this.flytimer);
    this.speedX*=0.96;
    var l=this.offsetLeft+this.speedX;
    var maxL=utils.win('clientWidth')-this.offsetWidth;
    if(l>=maxL){
        l=maxL;
        this.speedX*=-1;
    }else if(l<=0){
        l=0;
        this.speedX*=-1;
    }
    if(Math.abs(this.speedX)>=0.5){
        this.style.left=l+'px';
        this.flytimer=setTimeout(processThis(fly,this),10);
    }

};
function drop(){
    clearTimeout(this.dropTimer);
    if(!this.speedY){
        this.speedY=9.8;
    }else{
        this.speedY+=9.8;
    }
    this.speedY*=0.95;
    var t=this.offsetTop+this.speedY;
    var maxT=utils.win('clientHeight')-this.offsetHeight;
    if(t>=maxT){
        t=maxT;
        this.speedY*=-1;
        tmp++;
    }else{
        tmp=0;
    }if(tmp<2){
        this.style.top=t+'px';
        this.dropTimer=setTimeout(processThis(drop,this),10);
        console.log(this.speedY)
    }

}