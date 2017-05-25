(function(pro){
    function queryURLParameter(){
        var reg=/([^?&=#]+)=([^?&=#]+)/g,
            obj={};
        this.replace(reg,function(){
            obj[arguments[1]]=arguments[2];
        });
        reg=/#([^?&=#]+)/;
        this.replace(reg,function(){
            obj['HASH']=arguments[1];
        })
        return obj;
    }
    function formatDate(temp){
         temp=temp||'{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var ary=this.match(/\d+/g);
        temp=temp.replace(/\{(\d+)\}/g,function(){
            var index=arguments[1],
                item=parseFloat(ary[index])||0;
            item<10?item='0'+item:null;
            return item;
        })
        return temp;

    }
   // 2016-12-22.formatDate('{1}-{2}')
    pro.queryURLParameter=queryURLParameter;
    pro.formatDate=formatDate;
})(String.prototype);
~function(){
    var $header=$('.header'),
        $main=$('.main'),
        $menu=$main.children('.menu');
    /*computedMainHeight计算main区域的高度*/
    function computedMainHeight(){
        var winH=$(window).outerHeight(),
            headerH=$header.outerHeight(),
            tarH=winH-headerH-40;
        $main.css('height',tarH);
        $menu.css('height',tarH-2)
    }
    computedMainHeight();
    $(window).on('resize',computedMainHeight);

}();

var menuRender=(function(){
    var menuExample=null,
        $menu=$('.menu'),
        $link=$menu.find('a'),
        /*children子代筛选 find后代筛选 filter同级筛选*/
        HASH=null;
    var $menuPlan=$.Callbacks();
    //实现局部滚动
    $menuPlan.add(function(){
        menuExample = new IScroll('.menu',{
            mouseWheel:true,
            scrollbars:true,
            fadeScrollbars:true,
            /*useTransform:false,
             useTransition:false,
             bounce:false*/

        });
    });
    //获取哈希值
    $menuPlan.add(function(){
        HASH= window.location.href.queryURLParameter()['HASH'];
        HASH=HASH ||'nba';
        var $tarLink=$link.filter('[href="#'+HASH+'"]');
        $tarLink=$tarLink.length===0?$link.eq(0):$tarLink;
        $tarLink.addClass('bg');
        menuExample.scrollToElement($tarLink[0],0);
        calendarRender.init($tarLink.attr('data-cid'));
    });
    //给所有的A标签绑定点击事件
    $menuPlan.add(function(){
        $link.on('click',function(){
            /* $(this).addClass('bg').parent().siblings().children('a').removeClass('bg');*/
            var _this=this;
            $link.each(function(index,item){
                _this===item ? $(item).addClass('bg'):$(item).removeClass('bg');
            })
            calendarRender.init($(this).attr('data-cid'));
        });

    });

    return {
        init:function(){
            $menuPlan.fire();

        }
    }
})()


var calendarRender=(function(){
    var $calendar=$('.calendar'),
        $wrapper=$calendar.find('.wrapper');
    var $calendarPlan=$.Callbacks();
    var $link=null;
    var $btn=$calendar.find('.btn');
    var maxL=0,minL=0;
    //数据绑定
    $calendarPlan.add(function(today,data,cid){
        console.log(1);
        var $calTemplate=$('#calTemplate');
        var template=$calTemplate.html();
        var res=ejs.render(template,{calendarDate:data});
        $wrapper.html(res).css('width',data.length*110);
         $link=$wrapper.find('a');
        minL=-(data.length-7)*110;

    });
    //定位到今天的位置
    $calendarPlan.add(function(today,data,cid){
        var $tarLink=$link.filter('[data-time="'+today+'"]');
        if($tarLink.length===0){
            today=today.replace(/-/g,'');
            $link.each(function(index,item){
                var itemTime=$(item).attr('data-time').replace(/-/g,'');
                if(itemTime>today){
                    $tarLink=$(item);
                    return false;
                }
            });
        }
        if($tarLink===0){
            $tarLink=$link.eq($link.length-1);
        }
        $tarLink.addClass('bg');
        var tarIndex=$tarLink.parent().index(),
            curL=-tarIndex*110+330;
       curL=curL>maxL?maxL:(curL<minL?minL:curL);
        $wrapper.css('left',curL);
        //获取到起始的日期和结束的日期，然后控制地下列表的数据改变
        var strIn=Math.abs(curL/110),
            enrIn=strIn+6;
        var startTime=$link.eq(strIn).attr('data-time'),
            endTime=$link.eq(enrIn).attr('data-time');

        matchRender.init(startTime,endTime,cid);
    });
    //实现左右切换 http://matchweb.sports.qq.com/kbs/calendar?columnId=10000
    $calendarPlan.add(function(today,data,cid){
        $btn.on('click',function(){
            var curL=parseFloat($wrapper.css('left'));
            if(curL%110!==0){
                curL=Math.round(curL/110)*110;
            }
            $(this).hasClass('btnLeft')?curL+=770:curL-=770;
            curL=curL>maxL?maxL:(curL<minL?minL:curL);
            $wrapper.stop().animate({left:curL},300,function(){
                var curLeft=parseFloat($wrapper.css('left')),
                    strIn=Math.abs(curLeft/110),
                    endIn=strIn+6;
                $link.each(function(index,item){
                    index==strIn?$(item).addClass('bg'):$(item).removeClass('bg');
                })
                var starTime=$link.eq(strIn).attr('data-time'),
                    endTime=$link.eq(endIn).attr('data-time');
                matchRender.init(starTime,endTime,cid);
            })
        })

    })
     return {
         init:function(cid){
             $.ajax({
                 url:'http://matchweb.sports.qq.com/kbs/calendar?columnId=' + cid,
                 type:'get',
                 dataType:'jsonp',
                 success:function(result){
                     if(result && result.code===0){
                         console.log(result)
                         result=result['data'];
                         var today=result['today'],
                             data=result['data'];
                         $calendarPlan.fire(today,data,cid);
                     }
                 }
             });

         }
     }
})();
var matchRender=(function() {
    return {
        init:function(startTime,endTime,cid){

        }
    }


}());
menuRender.init();