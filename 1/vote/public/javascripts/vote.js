

var url=window.location.href;
var indexReg=/index/;
var registerReg = /register/;
var searchReg = /search/;
var detailReg = /detail/;
var limit=10;
var total=0;
var offset=0;
var localKey='userInfo';
var voteFn={

    
    indexInit:function () {
        this.userInfoManage();
       this.requestHomeFirstData();
        this.loadMore();
       this.voteManage();
       this.indexDealSearch();

    },
    registerInit:function () {
        this.registerSendData();


    },
    detailInit:function () {
        console.log(1)
        this.getDetailPageData();
    },
    searchInit: function() {
        console.log(1)
        this.userInfoManage();
        this.voteManage();
        this.searchPage();
    },
    /**
     * [搜索请求]
     * @return {[type]} [null]
     */
    searchPage: function() {
        var content = this;
        var reg = /content=([\w\W]*)/;
        var searchContent = reg.exec(url)[1];
        this.requestData('/vote/index/search?content=' + searchContent, 'GET', function(data) {
            console.log(data)
            var rcData = data.data;
            if (rcData.length) {
                $('.coming').html(content.indexUsersStr(rcData));
            } else {
                $('.noData').show();
            }
        })
    },
    /**
     * [首页的搜索事件绑定]
     * @return {[type]} [null]
     */
    indexDealSearch: function() {
        $('.search span').click(function(event) {
            console.log('kkk')
            var content = $('.search input').val();
            window.location = '/vote/search?content=' + content;
        });
    },
    getDetailPageData: function() {
        var content = this;
        var id = /detail\/(\d+)/.exec(url)[1];
        console.log(id);
        this.requestData('/vote/all/detail/data?id=' + id, 'GET', function(data) {
            $('.personal').html(content.detailTopStr(data.data));
            $('.vflist').html(content.detailVoterStr(data.data.vfriend));
        })
    },
    detailTopStr: function(obj) {
        var str = '';
        str = '<div class="pl">'
            +'		<div class="head">'
            +'			<img src="' + obj.head_icon + '" alt="">'
            +'			</div>'
            +'			<div class="p_descr">'
            +'			<p>' + obj.username + '</p>'
            +'			<p>编号#' + obj.id + '</p>'
            +'		</div>'
            +'	</div>'
            +'	<div class="pr">'
            +'		<div class="p_descr pr_descr">'
            +'			<p>' + obj.rank + '名</p>'
            +'			<p>' + obj.vote + '票</p>'
            +'		</div>'
            +'	</div>'
            +'	<div class="motto">'
            +'		' + obj.description + ''
            +'	</div>'
        return str;
    },
    detailVoterStr: function(objs) {
        var str = '';
        for(var i=0; i<objs.length; i++) {
            str += '<li>'
                +'<div class="head">'
                +'<img src="' + objs[i].head_icon + '" alt="">'
                +'</div>'
                +'<div class="up">'
                +'<div class="vote">'
                +'<span>投了一票</span>'
                +'</div>'
                +'</div>'
                +'<div class="descr">'
                +'<h3>' + objs[i].username + '</h3>'
                +'<p>编号#' + objs[i].id + '</p>'
                +'</div>'
                +'</li>'
        }
        return str;
    },
    voteManage:function () {
        var content=this;
        $('.content').on('click','.btn',function (event) {
            var userInfo=content.getStorage(localKey);
            var id=userInfo.id;
            var voterId=$(event.target).attr('data-id');
            var voteNum=$(event.target).siblings('.vote').children('span')
            var number=parseInt(voteNum.html());
            console.log(number);
            if(userInfo){
                content.requestData('/vote/index/poll?id='+voterId+'&voterId='+id,'GET',function (data) {
                    if(data.errno===0){
                        voteNum.html(number+1+'票');
                        voteNum.addClass('bounceIn');
                        /*alert(data.msg);
                         window.location.reload();*/
                    }else {
                        alert(data.msg);
                    }

                })
            }else {
                $('.mask').show();
            }
        })
    },
    userInfoManage:function () {
        var content=this;
        var userInfo=this.getStorage(localKey);
        if(userInfo){
            $('.register').html('个人主页').click(function (event) {
                window.location='/vote/detail/'+userInfo.id;
            });
            $('.sign_in span').html('已登入');
            $('.no_signed').hide();
            $('.username').html(userInfo.name);
        }
        $('.sign_in').click(function (event) {
            $('.mask').show();
        })
        $('.mask').click(function (event) {
            if(event.target.className==='mask'){
                $(this).hide();
            }
        })
        $('.dropout').click(function (event) {
            content.deleteStorage(localKey);
            window.location=url;
        })

        $('.subbtn').click(function (event) {
           var sendData=content.getSubmitData();
           if(sendData){
               content.requestData('/vote/index/info','POST',function (data) {
                   if(data.errno===0){
                       console.log(data)
                       content.setStorage(localKey,{
                           name:data.user.username,
                           id:data.user.id
                       })
                       window.location = url;
                   }else {
                       alert(data.msg);
                   }
               },sendData);
           }
        })
    },
    getSubmitData:function () {
        var usernum=$('.usernum').val();
        var userPassword=$('.user_password').val();
        if(!usernum){
            alert('请输入id号');
            return false;
        }
        if(!userPassword){
            alert('请输入密码');
            return false;
        }
        return {
            password:userPassword,
            id:usernum
        }
    },
    setStorage:function (key,obj) {
        localStorage.setItem(key,JSON.stringify(obj));
    },
    getStorage:function (key) {
        return JSON.parse(localStorage.getItem(key));
    },
    deleteStorage:function (key) {
        localStorage.removeItem(key);
    },
    registerSendData: function() {
        var content = this;
        $('.rebtn').click(function(event) {
            var sendData = content.getRegisterData();
            if (sendData) {
                content.requestData('/vote/register/data', 'POST', function(data){
                    alert(data.msg);
                    if (data.errno === 0) {

                        content.setStorage(localKey,{
                            name:sendData.username,
                            id:data.id
                        })
                        window.location = '/vote/index';
                    }
                }, sendData)
            }
        });
    },
    getRegisterData:function () {
        var username=$('.username').val();
        var initialPassword=$('.initial_password').val();
        var confirmPassword=$('.confirm_password').val();
        var mobile = $('.mobile').val();
        var description = $('.description').val();
        var gender = 'boy';
        if(!username){
            alert('请输入用户名');
            return false;
        }
        if (!initialPassword) {
            alert('请输入密码');
            return false;
        }
        if (initialPassword != confirmPassword) {
            alert('两次输入的密码不一致');
            return false;
        }
        if (!/^\d{11}$/.test(mobile)) {
            alert('请输入正确格式的手机号码');
            return false;
        }
        $('input[type=radio]')[0].checked ? gender = 'boy' : gender = 'girl';
        return {
            username: username,
            mobile: mobile,
            description: description,
            gender: gender,
            password: initialPassword
        }
    },
    requestHomeFirstData:function () {
        var content=this;
        this.requestData('/vote/index/data?limit=' + limit + '&offset=' + offset,'GET',function (data) {
            $('.coming').html(content.indexUsersStr(data.data.objects));
            total=data.data.total;
        })
    },
    loadMore: function() {
        var content = this;
        loadMore({
            callback: function(load) {
                offset = offset + limit;
                if (offset < total) {
                    content.requestData('/vote/index/data?limit=' + limit + '&offset=' + offset, 'GET', function(data) {
                        /*延时是为了更好的演示效果*/
                        setTimeout(function(){
                            $('.coming').append(content.indexUsersStr(data.data.objects));
                            load.reset();
                        }, 500)
                    });
                } else {
                    load.complete();
                    /*延时是为了更好的演示效果*/
                    setTimeout(function(){
                        load.reset();
                    }, 500)
                }
            }
        });

        // window.onscroll = function() {
        // 	var winHeight = document.documentElement.clientHeight || document.body.clientHeight;
        // 	var scrHeight = document.documentElement.scrollTop || document.body.scrollTop;
        // 	var allHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        // 	if (winHeight + scrHeight >= allHeight && loadFlag) {
        // 		loadFlag = false;
        // 		offset = offset + limit;
        // 		if (offset < total) {
        // 			content.requestData('/vote/index/data?limit=' + limit + '&offset=' + offset, 'GET', function(data) {
        // 				$('.coming').append(content.indexUsersStr(data.data.objects));
        // 				loadFlag = true;
        // 			});
        // 		} else {
        // 			$('.loadmore').html('内容已全部加载完了～');
        // 			loadFlag = true;
        // 		}
        // 	}
        // }
    },


    indexUsersStr:function (arrs) {
        var str='';
        for (var i=0;i<arrs.length;i++){
            str+=' <li> '
                +'<div class="head">'
                +'<a href="/vote/detail/' + arrs[i].id + '">'
                +'<img src="' + arrs[i].head_icon + '" alt="">'
                +'</a>'
                +'</div>'
                +'<div class="up">'
                +'<div class="vote">'
                +'<span>' + arrs[i].vote + '票</span>'
                +'</div>'
                +' <div class="btn" data-id=' + arrs[i].id + '>'
                +'投TA一票'
                +' </div>'
                +'</div>'
                +'<div class="descr">'
                +'<a href="/vote/detail/' + arrs[i].id + '">'
                +'<div>'
                +'<span>' + arrs[i].username + '</span>'
                +'<span>|</span>'
                +' <span>编号#' + arrs[i].id + '</span>'
                +' </div>'
                +' <p>' + arrs[i].description + '</p>'
                +' </a>'
                +'</div>'
                +'</li>'
        }
        return str;
    },


    requestData:function (url,type,callback,data) {
           data=data||'';
           $.ajax({
               url:url,
               type:type,
               dataType:'json',
               data:data,
               success:callback
           })
       }

}
$(document).ready(function ($) {
  if(indexReg.test(url)){
      voteFn.indexInit();
  }else if(registerReg.test(url)){
      voteFn.registerInit();
  }else if(detailReg.test(url)){
      voteFn.detailInit();
  }else if(searchReg.test(url)){
      voteFn.searchInit();
  }
})
