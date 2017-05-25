(function () {
    var content = document.getElementById('content');
    //获取所有的客户信息，展示在页面上
    ajax({
        type: 'get',
        url: '/getAllList',
        dataType: 'json',
        cache: false,
        success: function (result) {
            //console.log(result)
            if (result && result.code == 0) {
                bindHTML(result.data)
            }
        }
    })
    //绑定数据
    function bindHTML(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var cur = data[i];
            str += '<li>';
            str += '<span>' + cur.id + '</span>';
            str += '<span>' + cur.name + '</span>'
            str += '<span>';
            str += '<a href="detail.html?id=' + cur.id + '" >修改</a>';
            str += '<a href="javascript:;" data-id=' + cur.id + '>删除</a>';
            str += '</span>';
            str += '</li>';
        }
        content.innerHTML = str;
    }

    //删除某一项
    content.onclick = function (e) {
        e = e || window.event;
        var tar = e.target || e.srcElement;
        if (tar.tagName.toUpperCase() === 'A' && tar.innerHTML === '删除') {
            var curID = tar.getAttribute('data-id');
           var flag=window.confirm('确定要删除编号为['+curID+']这一项吗')
            if(flag){
                ajax({
                    url:'/removeInfo?id='+curID,
                    type:'get',
                    cache:false,
                    dataType:'json',
                    success:function(result){
                        if(result && result.code===0){
                            content.removeChild(tar.parentNode.parentNode)
                        }
                    }
                })
            }
        }

    }

})()
/*
var curID = tar.getAttribute('data-id');
var flag = window.confirm('确定删除编号为[' + curID + ']项吗)
if (flag) {
    content.removeChild(tar.parentNode.parentNode);
}*/
