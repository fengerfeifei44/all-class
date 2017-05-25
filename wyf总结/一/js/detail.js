(function(pro){
    function queryURLParameter(){
        var reg=/([^=?&#]+)=([^=?&#]+)/gi;
        var obj={};
        this.replace(reg,function(){
            obj[arguments[1]]=arguments[2];
        });
        return obj;
    }
    pro.queryURLParameter=queryURLParameter;

}(String.prototype));
(function(){
    var submit=document.getElementById('submit');
    var userName=document.getElementById('userName');
    var url=window.location.href;
    var urlObj=url.queryURLParameter();
    var curId=urlObj['id'];
    if(typeof curId !== 'undefined'){
        ajax({
            url:'/getInfo?id='+curId,
            type:'get',
            dataType:'json',
            success:function(result){
                if(result && result.code===0){
                    userName.value=result.data.name;
                }
            }
        })
    }
    //修改客户信息
    submit.onclick=function(){
        if(typeof curId !=='undefined'){
            ajax({
                url:'/updateInfo',
                type:'post',
                dataType:'json',
                data:{id:curId,name:userName.value},
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
            data:{name:userName.value},
            success:function(reslult){
                if(reslult && reslult.code==0){
                    console.log(1)
                    window.location.href='index.html'
                }
            }
        })

    }

}())