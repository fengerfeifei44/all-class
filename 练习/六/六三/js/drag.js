/**
 * Created by Administrator on 2016/11/30.
 */
var oDiv=document.getElementById('box');
ev.on(oDiv,'mousedown',down);
function down(e){
    e=e||window.event;
    this.l=this.offsetLeft;
    this.t=this.offsetTop;
    this.x=e.clientX;
    this.y=e.clientY;
    this.Move=ev.processThis(move,this);
    this.Up=ev.processThis(up,this)
    if(this.setCapture){
        this.setCapture();
        ev.on(this,'mousemove',move);
        ev.on(this,'mouseup',up);
    }else{
        ev.on(document,'mousemove',this.Move);
        ev.on(document,'mouseup',this.Up);
        e.preventDefault();
    }
    ev.fire(this,'selfDown',e)

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
        ev.off(this,'mousemove',move);
        ev.off(this,'mouseup',up);
    }else{
        ev.off(document,'mousemove',this.Move);
        ev.off(document,'mouseup',this.Up);
    }
    ev.fire(this,'selfUp',e)
}
