(function () {
    //获取当前页面的URL地址，然后把问号传递过来的参数值获取到
    var curUrl = window.location.href,
        urlObj = curUrl.queryURLParameter(),
        urlId = urlObj['id'],
        userName = document.getElementById('userName'),
        submit = document.getElementById('submit');
    //获取指定客户信息
    if(typeof urlId !=='undefined'){
        ajax({
            url:'/getInfo?id='+urlId,
            type:'get',
            cathe:false,
            dataType:'json',
            success:function(result){
                if(result && result.code===0){
                    userName.value=result['data']['name'];
                }
            }
        })
    }

    submit.onclick = function () {
        var value = userName.value;
        //点击修改客户
       if(typeof urlId!=='undefined'){
           ajax({
               url:'/updateInfo',
               type:'post',
               dataType:'json',
               data:{id:urlId, name:value},
               success:function(result){
                   if(result && result.code===0){
                       window.location.href='index.html'
                   }
               }
           })
           return;
       }
        //点击增加客户
        ajax({
            type: 'post',
            url: '/addInfo',
            dataType: 'json',
            data: {name: value},
            success: function (result) {
                if (result && result.code == 0) {
                    window.location.href = 'index.html'
                }
            }
        })
    }

})()