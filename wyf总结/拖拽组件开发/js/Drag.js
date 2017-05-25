/**
 * Created by Administrator on 2016/12/4.
 */
(function(){
    EventEmitter=Class.extend({
        init:function(){},
        on:function(type,fn){
            if(!this[type]){
                this[type]=[];
            }
            var a=this[type];
            for(var i=0;i<a.length;i++){
                if(a[i]==fn)return;
            }
            a.push(fn)
        },
        fire:function(type,e){
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
        },
        off:function(type,fn){
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
    })
    window.Drag=EventEmitter.extend({
        init:function(ele){
            this._super();
            this.ele=ele;
            this.x=this.y=this.l=this.t=null;
            this.DOWN=processThis(this.down,this);
            this.MOVE=processThis(this.move,this);
            this.UP=processThis(this.up,this);
            on(this.ele,'mousedown',this.DOWN)
        },
        zIndex:0,
        down:function(e){
            e=e||window.event;
            this.l=this.ele.offsetLeft;
            this.t=this.ele.offsetTop;
            this.x=e.clientX;
            this.y=e.clientY;
            this.ele.style.zIndex=++Drag.prototype.zIndex;
            if(this.ele.setCapture){
                on(this.ele,'mousemove',this.MOVE);
                on(this.ele,'mouseup',this.UP);
            }else{
                on(document,'mousemove',this.MOVE);
                on(document,'mouseup',this.UP);
                e.preventDefault();
            }
            this.fire('selfDown',e)

        },
        move:function(e){
            e=e||window.event;
            this.ele.style.left=this.l+e.clientX-this.x+'px';
            this.ele.style.top=this.t+e.clientY-this.y+'px';
            this.fire('selfMove',e)

        },
        up:function(e){
            if(this.ele.releaseCapture){
                off(this.ele,'mousemove',this.MOVE);
                off(this.ele,'mouseup',this.UP);
            }else{
                off(document,'mousemove',this.MOVE);
                off(document,'mouseup',this.UP);
            }
            this.fire('selfUp',e)
        },
        //提升层级
      /*  creaseIndex:function(){
            this.on('selfDown',function(){

            })
            return this;
        },*/
        //限制范围
        range:function(opt){
            this.opt=opt;
            this.on('selfMove',this.addRange);
            return this;
        },
        addRange:function(e){
            var l=this.l+e.clientX-this.x;
            var t=this.t+e.clientY-this.y;
            var opt=this.opt;
            if(l<=opt.left){
                l=opt.left;
            }else if(l>=opt.right){
                l=opt.right
            }
            if(t<=opt.top){
                t=opt.top
            }else if(t>=opt.bottom){
                t=opt.bottom
            }
            this.ele.style.left=l+'px';
            this.ele.style.top=t+'px';
            return this;
        },
        //弹跳
        jump:function(){
            this.on('selfDown',this.clearEffect);
            this.on('selfMove',this.getSpeedX);
            this.on('selfUp',this.fly);
            this.on('selfUp',this.drop);
            return this;
        },
        clearEffect:function(){
            clearTimeout(this.flytimer);
            clearTimeout(this.dropTimer);
            return this;
        },
        getSpeedX:function(e){
            if(!this.prev){
                this.prev=e.clientX;
            }else{
                this.speedX=e.clientX-this.prev;
                this.prev=e.clientX;
            }
            return this;
        },
        fly:function(){
          clearTimeout(this.flytimer);
            this.speedX*=.95;
            var l=this.ele.offsetLeft+this.speedX;
            var maxL=utils.win('clientWidth')-this.ele.offsetWidth;
            if(l>=maxL){
                l=maxL;
                this.speedX*=-1;
            }else if(l<=0){
                l=0;
                this.speedX*=-1;
            }
            if(Math.abs(this.speedX)>=0.5){
                this.ele.style.left=l+'px';
                this.flyTimer=setTimeout(processThis(this.fly,this),10);
            }
            return this;
        },
        drop:function(){
            clearTimeout(this.dropTimer);
            if(!this.speedY){
                this.speedY=9.8;
            }else{
                this.speedY+=9.8;
            }
            this.speedY*=.95;
            var t=this.ele.offsetTop+this.speedY;
            var maxT=utils.win('clientHeight')-this.ele.offsetHeight;
            if(t>=maxT){
                t=maxT;
                this.speedY*=-1;
                this.tmp++;
            }else{
                this.tmp=0;
            }
            if(this.tmp<2){
                this.ele.style.top=t+'px';
                this.dropTimer=setTimeout(processThis(this.drop,this),10);
            }
            return this;
        },
        //照片墙
        photo:function(aEle){
            this.aLi=aEle;
            for(var i=0;i<aEle.length;i++){
                var oLi=aEle[i];
                oLi.oldColor=utils.css(oLi,'background');
                oLi.l=oLi.offsetLeft;
                oLi.t=oLi.offsetTop
            }
            this.on('selfMove',this.hited);
            this.on('selfUp',this.changePos);
        },
        isHited:function(l,r){
            if(l.offsetLeft+l.offsetWidth<r.offsetLeft||l.offsetTop+l.offsetHeight<r.offsetTop||l.offsetLeft>r.offsetLeft+r.offsetWidth||l.offsetTop>r.offsetTop+r.offsetHeight){
                return false;
            }else{
                return true;
            }
        },
        hited:function(){
            this.ary=[];
            for(var i=0;i<this.aLi.length;i++){
                var oLi=this.aLi[i];
                if(this.ele==oLi) continue;
                if(this.isHited(this.ele,oLi)){
                    this.ary.push(oLi);
                    oLi.style.background='red';
                }else{
                    oLi.style.background=oLi.oldColor;
                }

            }
        },
        changePos:function(){
            var ary=this.ary;
        if(ary.length){
            for(var i=0;i<ary.length;i++){
                var oLi=ary[i];
                oLi.dis=Math.pow(this.ele.offsetLeft-oLi.offsetLeft,2)+Math.pow(this.ele.offsetTop-oLi.offsetTop,2);
                oLi.style.background=oLi.oldColor;
            }
            ary.sort(function(a,b){
                return a.dis-b.dis;
            })
            var shortest=ary[0];
            shortest.style.background='yellow';
            this.ele.style.background='yellow';
            animate({
                id:this.ele,
                target:{
                    left:shortest.l,
                    top:shortest.t
                },
                effect:3
            })
            animate({
                id:shortest,
                target:{
                    left:this.ele.l,
                    top:this.ele.t
                },
                effect:3
            })
            var l=this.ele.l,t=this.ele.t;
            this.ele.l=shortest.l;this.ele.t=shortest.t;
            shortest.l=l;shortest.t=t;
           }else{
            animate({
                id:this.ele,
                target:{
                    left:this.ele.l,
                    top:this.ele.t
                },
                effect:3
            })
        }
        }


    })
})()
