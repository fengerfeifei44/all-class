/**
 * Created by Administrator on 2016/12/1.
 */
function EventEmitter(){}
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
};
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
                a[i].call(this,e)
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}
function Drag(ele){
    this.ele=ele;
    this.l=this.t=this.x=this.y=null;
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    this.DOWN=processThis(this.down,this);
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
        on(this.ele,'mouseup',this.UP);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
        e.preventDefault();
    }
    this.fire('selfDown',e)
}
Drag.prototype.move=function(e){
    e=e||window.event;
    this.ele.style.left=this.l+e.clientX-this.x+'px';
    this.ele.style.top=this.t+e.clientY-this.y+'px';
    this.fire('selfMove',e)
}
Drag.prototype.up=function(){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
    this.fire('selfUp');
}
Drag.prototype.jump=function(){
    this.on('selfDown',this.clearEffect).on('selfMove',this.getSpeedX)
        .on('selfUp',this.fly).on('selfUp',this.drop)
}
Drag.prototype.clearEffect=function(){
    clearTimeout(this.flytimer);
}
Drag.prototype.getSpeedX=function(e){
    if(!this.ele.prev){
        this.ele.prev=e.clientX;
    }else{
        this.speedX=e.clientX-this.ele.prev;
        this.ele.prev=e.clientX;
    }
}
Drag.prototype.fly=function(){
    clearTimeout(this.flytimer);
    this.speedX*=0.95;
    var l=this.ele.offsetLeft+this.speedX;
    var maxL=this.ele.offsetParent.offsetWidth-this.ele.offsetWidth;
    if(l>=maxL){
        l=maxL;
        this.speedX*=-1;
    }else if(l<=0){
        l=0;
        this.speedX*=-1;
    }
    if(Math.abs(this.speedX)>=0.5){
        this.ele.style.left=l+'px';
        this.flytimer=setTimeout(processThis(this.fly,this),10);
    }
}
Drag.prototype.drop=function(){
    clearTimeout(this.dropTimer)
    if(!this.speedY){
        this.speedY=9.8;
    }else{
        this.speedY+=9.8;
    }
    var t=this.ele.offsetTop+this.speedY;
    var maxT=utils.win('clientWidth')-this.ele.offsetHeight;
    if(t>=maxT){
        t=maxT;
        this.speedY*=-1;
        this.tmp++;
    }else{
        this.tmp=0
    }
    if(this.tmp<2){
        this.ele.style.top=+'px';
        this.dropTimer=setTimeout(processThis(drop,this),10);
    }
}
//照片墙
Drag.prototype.photo=function(aEle){
    this.aLi=aEle;
    this.on('selfDown',this.creaseIndex);
    this.on('selfMove',this.hited);
    this.on('selfUp',this.changePos);
}
Drag.prototype.zIndex=0;
Drag.prototype.creaseIndex=function(){
    this.ele.style.zIndex=++Drag.prototype.zIndex;
}
Drag.prototype.isHited=function(l,r){
    if(l.offsetLeft+l.offsetWidth<r.offsetLeft||l.offsetTop+l.offsetHeight<r.offsetTop||
    l.offsetLeft>r.offsetLeft+r.offsetWidth||l.offsetTop>r.offsetTop+r.offsetHeight){
        return false;
    }else{
        return true;
    }
}
Drag.prototype.hited=function(){
    var aLi=this.aLi;
    this.ary=[];
    for(var i=0;i<aLi.length;i++){
        var oLi=aLi[i];
        if(this.ele===oLi) continue;
        if(this.isHited(this.ele,oLi)){
            this.ary.push(oLi);
            oLi.style.background='red';
        }else{
            oLi.style.background=oLi.oldColor;

        }
    }
}
Drag.prototype.changePos=function(){
    var ary=this.ary;
    if(ary && ary.length){
        for(var i=0;i<ary.length;i++){
            var oLi=ary[i];
            oLi.dis=Math.pow(this.ele.offsetLeft-oLi.offsetLeft,2)+Math.pow(this.ele.offsetTop-oLi.offsetTop,2);
            oLi.style.background=oLi.oldColor;
        }
        ary.sort(function(a,b){
            return a.dis-b.dis;
        })
        var shortest=ary[0];
        this.ele.style.background='yellow';
        shortest.style.background='yellow';
        animate({
            id:this.ele,
            target:{
                left:shortest.l,
                top:shortest.t,
            },
            duration:500,
            effect:3
        })
        animate({
            id:shortest,
            target:{
                left:this.ele.l,
                top:this.ele.t,
            },
            duration:500,
            effect:3
        })
        var l=this.ele.l,t=this.ele.t;
        this.ele.l=shortest.l;this.ele.t=shortest.t;
        shortest.l=l;shortest.t=t;
        this.ary=[];
    }else{
        animate({
            id:this.ele,
            target:{
                left:this.ele.l,
                top:this.ele.t,
            },
            duration:500,
            effect:3
        })
    }
}
