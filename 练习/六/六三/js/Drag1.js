/**
 * Created by Administrator on 2016/11/30.
 */
function EventEmitter(){};
EventEmitter.prototype.on=function(type,fn){
    if(!this[type]){
        this[type]=[];
    }
    var a=this[type];
    for(var i=0;i<a.length;i++){
        if(a[i]==fn) return;
    }
    a.push(fn);
    return this;
}
EventEmitter.prototype.fire=function(type,e){
    var a=this[type];
    if(a && a.length){
        for(var i=0;i<a.length;i++) {
            if(typeof a[i] == "function"){
                a[i].call(this,e)
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }

}
EventEmitter.prototype.off=function(type,fn){
    var a=this[type];
    if(a && a.length){
        for(var i=0;i<a.length;i++){
            a[i]=null;
            break;
        }
    }
}
function Drag(ele){
    this.ele=ele;
    this.l=this.t=this.x=this.y=null;
    this.DOWN=processThis(this.down,this);
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    on(this.ele,'mousedown',this.DOWN);
}
Drag.prototype=new EventEmitter;
Drag.prototype.constructor=Drag;
Drag.prototype.down=function(e){
    e=e||window.event;
    this.l=this.ele.offsetLeft;
    this.t=this.ele.offsetTop;
    this.x=e.clientX;
    this.y=e.clientY;
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,'mousemove',this.MOVE);
        on(this.ele,'mouseup',this.UP)
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
        e.preventDefault();
    }
    this.fire('selfDown',e);
};
Drag.prototype.move=function(e){
    e=e||window.event;
    this.ele.style.left=this.l+e.clientX-this.x+'px';
    this.ele.style.top=this.y+e.clientY-this.y+'px';
    this.fire('selfMove',e)
};
Drag.prototype.up=function(){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP)
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
    this.fire('selfUp');
};
//以下为升级内容 范围限定
Drag.prototype.range=function(opt){
    this.opt=opt;
    this.on('selfMove',this.addRange)
}
Drag.prototype.addRange=function(e){
    var l=this.l+e.clientX-this.x;
    var t=this.t+e.clientY-this.y;
    if(l<=this.opt.left){
        l=this.opt.left;
    }else if(l>=this.opt.right){
        l=this.opt.right;
    }
    if(t<=this.opt.top){
        t=this.opt.top;
    }else if(t>=this.opt.bottom){
        t=this.opt.bottom;
    }
    this.ele.style.left=l+'px';
    this.ele.style.top=t+'px';
}
//虚线框
Drag.prototype.border=function(){
    this.on('selfDown',this.addBorder)
    this.on('selfMove',this.dragBorder)
    this.on('selfUp',this.hideBorder)
}
Drag.prototype.addBorder=function(){
    this.ele.style.border="2px dashed orange";
    this.oldColor=utils.getCss(this.ele,'background');
    this.oldHtml=this.ele.innerHTML;
}
Drag.prototype.dragBorder=function(){
    this.ele.style.background='none';
    this.ele.innerHTML='';
}
Drag.prototype.hideBorder=function(){
    this.ele.style.background=this.oldColor;
    this.ele.innerHTML=this.oldHtml;
}
