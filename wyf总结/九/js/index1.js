(function(){
    var content=document.getElementById('content');
   //1、获取客户信息
    //获取数据
    ajax({
        url:'/getAllList',
        type:'get',
        dataType:'json',
        cache:false,
        success:function(result){
            if(result && result.code===0){
                bind(result.data)
                console.log(result.data)
            }
        }

    })
    //绑定数据
    function bind(data){
        var str='';
        for(var i=0;i<data.length;i++){
            var cur=data[i]
            str+='<li>\
                <span>'+cur['id']+'</span>\
                <span>'+cur['name']+'</span>\
                <span>\
                <a href="">修改</a>\
                <a href="" data-id="'+cur['id']+'">删除</a>\
                </span>\
                </li>'
        }
        content.innerHTML=str;
    }
    //2、删除客户信息
    content.onclick=function(e){
        e=e||window.event;
        var target=e.target||e.srcElement;
        var tagName=target.tagName.toUpperCase();
        if(tagName==='A'&& target.innerHTML==='删除'){
            var curId=target.getAttribute('data-id');
            var flag=window.confirm('确定要删除id为['+curId+']的内容吗？')
            if(flag){
                ajax({
                    url:'/removeInfo?id='+curId,
                    type:'get',
                    dataType:'json',
                    cache:false,
                    success:function(result){
                        if(result && result.code===0){
                            content.removeChild(target.parentNode.parentNode)

                        }
                    }
                })
            }
        }


    }
    /*content.onclick=function(e){
        e=e||window.event;
        var tar=e.target||e.srcElement;
        if(tar.tagName.toLowerCase()==='a'&& tar.innerHTML==='删除'){
            var curId=tar.getAttribute('data-id');
            var flag=window.confirm('确定要删除编号为'+curId+'的内容吗？');
            if(flag){
                ajax({
                    url:'/removeInfo?id='+curId,
                    type:'get',
                    dataType:'json',
                    cache:false,
                    success:function(result){
                        if(result && result.code===0){
                            content.removeChild(tar.parentNode.parentNode);
                        }
                    }
                })
            }
        }
    }*/


}())