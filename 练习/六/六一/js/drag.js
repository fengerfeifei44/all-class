/**
 * Created by Administrator on 2016/11/29.
 */
var oDiv=document.getElementsByTagName('div')[0];
ev.on(oDiv,'mousedown',down)
function down(e){
    e=e||window.event;
    this.l=this.offsetLeft;
    this.t=this.offsetTop;
    this.x=e.clientX;
    this.y=e.clientY;
    this.MOVE=ev.processThis(move,this);
    this.UP=ev.processThis(up,this);
    if(this.setCapture){
        this.setCapture();
        ev.on(oDiv,'mousemove',move);
        ev.on(oDiv,'mouseup',up);
    }else{
        ev.on(document,'mousemove',this.MOVE);
        ev.on(document,'mouseup',this.UP);
        e.preventDefault();
    }
    ev.fire(this,'selfDown',e);

}
function move(e){
    e=e||window.event;
    this.style.left=this.l+e.clientX-this.x+'px';
    this.style.top=this.t+e.clientY-this.y+'px';
    ev.fire(this,'selfMove',e);
}
function up(e){
    if(this.releaseCapture){
        this.releaseCapture();
        ev.off(oDiv,'mousemove',move);
        ev.off(oDiv,'mouseup',up);
    }else{
        ev.off(document,'mousemove',this.MOVE);
        ev.off(document,'mouseup',this.UP);
    }
    ev.fire(oDiv,'selfUp',e);

}