/**
 * Created by Administrator on 2016/12/14.
 */
(function(pro){
    function queryURLParameter(){
        var obj={},
            reg=/([^?=&#]+)=([^?=&#]+)/i;
        this.replace(reg,function(){
            obj[arguments[1]]=arguments[2];
        })
        return obj;
    }
    pro.queryURLParameter=queryURLParameter;
}(String.prototype));
(function(){
    var username=document.getElementById('username');
    var submit=document.getElementById('submit');
    var url=window.location.href;
    var urlObj=url.queryURLParameter();
    var curId=urlObj['id'];
    //3、获取指定客户
    if(typeof curId !== 'undefined'){
            ajax({
                url:'/getInfo?id='+curId,
                type:'get',
                dataType:'json',
                success:function(result){
                    if(result && result.code===0){
                        username.value=result['data']['name']
                    }
                }
            })
        }
    submit.onclick=function(){
        //4、修改客户信息
        if(typeof curId !=='undefined'){
            ajax({
                url:'/updateInfo',
                type:'post',
                dataType:'json',
                data:{id:curId,name:username.value},
                success:function(result){
                    if(result && result.code ===0){
                        window.location.href='index.html';
                    }
                }
            })
            return;
        }
        //增加客户信息
        ajax({
            url:'/addInfo',
            type:'post',
            dataType:'json',
            data:{name:username.value},
            success:function(result){
                if(result && result.code ===0){
                    window.location.href='index.html';
                }
            }
        })
    }

}())