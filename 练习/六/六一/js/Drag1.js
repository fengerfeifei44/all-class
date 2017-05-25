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
        if(a[i]==fn)return;
    }
    a.push(fn);
}
EventEmitter.prototype.off=function(type,fn){
    var a=this[type];
    if(a && a.length){
        for(var i=0;i<a.length;i++){
            if(a[i]==fn){
                a[i]=null;
                break;
            }
        }
    }
}
EventEmitter.prototype.fire=function(type,e){
    var a=this[type];
    if(a && a.length){
        for(var i=0;i<a.length;i++){
            if(typeof a[i]=='function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}
function Drag(ele){
    this.ele=ele;
    this.DOWN=processThis(this.down,this)
    this.MOVE=processThis(this.move,this)
    this.UP=processThis(this.up,this)
    this.x=this.y=this.l=this.t=null;
    on(this.ele,'mousedown',this.DOWN);
}
Drag.prototype=new EventEmitter();
Drag.prototype.constructor=Drag;
Drag.prototype.down=function(e){
    e=e||window.event;
    this.l=this.ele.offsetLeft;
    this.t=this.ele.offsetTop;
    this.x=e.clientX;
    this.y=e.clientY;
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,'mousemove', this.MOVE)
        on(this.ele,'mouseup',this.UP)
    }else{
        on(document,'mousemove', this.MOVE)
        on(document,'mouseup',this.UP)
        e.preventDefault();
    }
    this.fire('selfDown',e)

};
Drag.prototype.move=function(e){
    e=e||window.event;
    this.ele.style.left=this.l+e.clientX-this.x+'px';
    this.ele.style.top=this.t+e.clientY-this.y+'px';
    this.fire('selfMove',e)
}
Drag.prototype.up=function(e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove', this.MOVE)
        off(this.ele,'mouseup',this.UP)
    }else{
        off(document,'mousemove', this.MOVE)
        off(document,'mouseup',this.UP)
    }
    this.fire('selfUp',e)
};
Drag.prototype.range=function(opt){
    this.opt=opt;
   this.on('selfMove',this.addRange);
}
Drag.prototype.addRange=function(e){
    var l=this.l+e.clientX-this.x;
    var t=this.t+e.clientY-this.y;
    var opt=this.opt;
    if(l<=opt.left){
        l=opt.left;
    }else if(l>=opt.right){
        l=opt.right;
    }
    if(t<=opt.top){
        t=opt.top;
    }else if(t>=opt.bottom){
        t=opt.bottom;
    }
    this.ele.style.left=l+'px';
    this.ele.style.top=t+'px';
}
Drag.prototype.border=function(){
    this.on('selfDown',this.showBorder);
    this.on('selfMove',this.dragBorder);
    this.on('selfUp',this.hideBorder)
}
Drag.prototype.showBorder=function(){


}
Drag.prototype.dragBorder=function(){

}
Drag.prototype.hideBorder=function(){

}
