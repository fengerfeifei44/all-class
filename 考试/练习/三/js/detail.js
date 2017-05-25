(function(pro){
    function queryURLParameter(){
        var reg=/([^=?&#]+)=([^=?&#]+)/g,
            obj={};
        this.replace(reg,function(){
            obj[arguments[1]]=arguments[2];
        });
        return obj;
    }
    pro.queryURLParameter=queryURLParameter;
})(String.prototype);
(function(){
    var submit=document.getElementById('submit'),
        userName=document.getElementById('userName'),
        url=window.location.href,
        urlObg=url.queryURLParameter(),
        curId=urlObg.id;
    if(typeof curId !== 'undefined'){
        ajax({
            url:'/getInfo?id='+curId,
            type:'get',
            cache:false,
            dataType:'json',
            success:function(result){

                if(result && result.code===0){

                    userName.value=result.data.name;
                }
            }
        })
    }
    submit.onclick=function(){

        if(typeof curId !== 'undefined'){
           console.log(curId)
            ajax({
                url:'/updateInfo',
                type:'post',
                dataType:'json',
                data:{id:curId,name:userName.value},
                success:function(result){
                    console.log(result)
                    if(result && result.code == 0){
                        window.location.href='index.html';
                    }
                }
            });
            return;
        }
        ajax({
            url:'/addInfo',
            type:'post',
            dataType:'json',
            data:{name:userName.value},
            success:function(result){
                if(result && result.code == 0){

                    window.location.href='index.html';
                }
            }
        })
    }
})();