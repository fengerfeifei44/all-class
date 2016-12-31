/**
 * Created by Administrator on 2016/12/13.
 */
(function(pro){
    function queryURLParameter(){
        var obj={};
        var reg=/([^?=&#]+)=([^?=&#]+)/g;
        this.replace(reg,function(){
            obj[arguments[1]]=arguments[2];
        });
        return obj;
    }
    pro.queryURLParameter=queryURLParameter;
}(String.prototype));
(function(){
    var submit=document.getElementById('submit');
    var username=document.getElementById('userName');
    var url=window.location.href;
    var urlObj=url.queryURLParameter();
    var curId=urlObj['id'];
    console.log(curId)
    //3、获取指定客户
    if(typeof curId !=='undefined'){
        ajax ({
            url:'/getInfo?id='+curId,
            type:'get',
            dataType:'json',
            cache:'false',
            success:function(result){
                if(result && result.code===0){
                    username.value=result['data']['name'];

                }
            }
        })
    }
    //2、新增加客户信息
    submit.onclick=function(){
        if(typeof curId!=='undefined'){
            ajax({
                url:'/updateInfo',
                type:'post',
                dataType:'json',
                data:{id:curId,name:username.value},
                success:function(result){
                    if(result && result.code==0){
                        window.location.href='index.html'
                    }
                }
            })
            return;
        }
        ajax({
            url:'/addInfo',
            type:'post',
            dataType:'json',
            data:{name:username.value},
            success:function(result){
                if(result && result.code==0){
                    window.location.href='index.html'
                }
            }
        })
    }
}())