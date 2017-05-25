(function(){

    var content=document.getElementById('content');
    ajax({
        url:'/getAllList',
        type:'get',
        cache:false,
        dataType:'json',
        success:function(result){
            if(result && result.code==0){
                console.log(1)
                bind(result.data)
            }
        }
    });
    function bind(data){
        var str='';
        console.log(1)
        data.forEach(function(item,index){
            str+='<li>\
                <span>'+item.id+'</span>\
                <span>'+item.name+'</span>\
                <span>\
                <a href="detail.html?id='+item.id+'">修改</a>\
                <a href="javascript:;" data-id="'+item.id+'">删除</a>\
                </span>\
                </li>'
        });

        content.innerHTML=str;
    }
    content.onclick=function(e){
        e=e||window.event;
        var tar=e.target||e.srcElement;
        if(tar.tagName.toLowerCase()==='a'&&tar.innerHTML=='删除'){
            var curId=tar.getAttribute('data-id');
            var flag=window.confirm('确定要删除编号为'+curId+'的内容吗');
            if(flag){
                ajax({
                    url:'/removeInfo?id='+curId,
                    type:'get',
                    cache:false,
                    dataType:'json',
                    success:function(result){
                        if(result && result.code==0){
                            content.removeChild(tar.parentNode.parentNode);
                        }
                    }
                })
            }
        }
    }
})()