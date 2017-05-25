~function (pro) {
    function queryURLParameter() {
        var reg = /([^?&=#]+)=([^?&=#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        reg = /#([^?=&#]+)/;
        this.replace(reg, function () {
            obj['HASH'] = arguments[1];
        });
        return obj;
    }

    function formatDate(temp) {
        temp = temp || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var ary = this.match(/\d+/g);
        temp = temp.replace(/\{(\d+)\}/g, function () {
            var index = arguments[1],
                item = parseFloat(ary[index]) || 0;
            item < 10 ? item = '0' + item : null;
            return item;
        });
        return temp;
    }

    pro.queryURLParameter = queryURLParameter;
    pro.formatDate = formatDate;
}(String.prototype);
var navRender=(function(){
    var $header=$('.header'),
        $menu=$header.children('.menu'),
        $nav=$('.nav');
    var isBlock=false;
    return {
        init:function(){
            $menu.tap(function(){
                if(!isBlock){
                    isBlock=true;
                    $nav.css({
                        padding:'.1rem 0',
                        height:'2.22rem'
                    });
                    return;
                }
                if(isBlock) {
                    isBlock = false;
                    $nav.css({
                        padding: 0,
                        height: 0
                    });
                }
            })
        }
    }
})();
navRender.init();
var matchRender=(function(){
    var $matchPlan=$.Callbacks();
    var $match=$('.match');
    //数据绑定；
    $matchPlan.add(function(matchInfo){
        var template=$("#matchTemplate").html();
         var result=ejs.render(template,{matchInfo:matchInfo});
        $match.html(result);
        //获取需要的元素
        var $process=$('.progress'),
            $supportLeft=$('.supportLeft'),
            $supportRight=$('.supportRight');
        //计算进度条
    $matchPlan.add(computedProcess);
        function computedProcess(flag){
            var left=parseFloat($supportLeft.html()),
                right=parseFloat($supportRight.html());
            $process.css('transition','1s');
            window.setTimeout(function(){
                $process.css('width',(left/(left+right))*100+'%');

                $process.addClass('bg');
            },flag===false?0:500)
        }
     //点击支持：思路：如果已经点击过，进入页面，显示进度条，支持的那个背景颜色变，如果没有点击过，背景为灰色，点击支持

     var isTab=false;
    $matchPlan.add(function(){

        var supportInfo=localStorage.getItem('supportInfo');
        if(supportInfo){
            supportInfo=JSON.parse(supportInfo);
            supportInfo.type==1?$supportLeft.addClass('bg'):$supportRight.addClass('bg');
            return;
        }

        $supportLeft.add($supportRight).tap(function(){
            console.log(1)
            if(isTab) return;
            var num=$(this).html();
            num++;
            $(this).html(num).addClass('bg');
            isTab=true;
            computedProcess(false);
            //->告诉服务器我支持的是谁
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1469151&type=' + $(this).attr('data-type'),
                type: 'get',
                dataType: 'jsonp'
            });

            //->向本地存储一些信息,下一次打开页面判断信息是否存在,存在的话不让在点击支持了,而且上一次点击的是谁,让谁有选中的样式
            var obj = {
                type: $(this).attr('data-type')
            };
            localStorage.setItem('supportInfo', JSON.stringify(obj));
        });
    });

    });
    return {
        init:function(){
            //获取数据
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1469151',
                type:'get',
                dataType:'jsonp',
                success:function(result){
                    //数据的格式化操作
                    if(result && result[0]==0){
                        result=result[1];
                        var matchInfo=result['matchInfo'];
                        matchInfo['leftSupport']=result['leftSupport'];
                        matchInfo['rightSupport']=result['rightSupport'];
                        $matchPlan.fire(matchInfo);
                        console.log(result)
                    }
                }
            })
        }
    }
})();
matchRender.init();
