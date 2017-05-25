var indexReg = /index/;
var registerReg = /register/;
var detailReg = /detail/;
var searchReg = /search/;
var url = window.location.href;
var limit = 10;
var offset = 0;
var total = 0;
var loadFlag = true;
var localKey = 'userInfo';
var voteFn = {
    /**
     * [首页初始化]
     * @return {[type]} [null]
     */
    indexInit: function() {
        this.userInfoManage();//用户登录保存信息
        this.requestHomeFirstData();//第一次加载数据
        this.loadMore();//加载更多
        this.voteManage();//点击投票
        this.indexDealSearch();//搜索
    },
    /**
     * [报名初始化]
     * @return {[type]} [null]
     */
    registerInit: function() {
        this.registerSendData();//发送注册信息
    },
    /**
     * [详情初始化]
     * @return {[type]} [null]
     */
    detailInit: function() {
        this.getDetailPageData();//得到详情页信息
    },
    /**
     * [搜索初始化]
     * @return {[type]} [null]
     */
    searchInit: function() {
        this.userInfoManage();//注册信息，是否注册或者登录
        this.voteManage();//投票
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
    /*点击搜索获得里边信息，跳转页面*/
    indexDealSearch: function() {
        $('.search span').click(function(event) {
            console.log('kkk')
            var content = $('.search input').val();
            window.location = '/vote/search?content=' + content;
        });
    },
    /**
     * [获取搜索页数据]
     * @return {[type]} [null]
     */
    /*显示详情页信息*/
    getDetailPageData: function() {
        var content = this;
        var id = /detail\/(\d+)/.exec(url)[1];
        this.requestData('/vote/all/detail/data?id=' + id, 'GET', function(data) {
            $('.personal').html(content.detaiTopStr(data.data));
            $('.vflist').html(content.detailVoterStr(data.data.vfriend));
        })
    },
    /**
     * [detaiTopStr description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    /*详情页表头拼接*/
    detaiTopStr: function(obj) {
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
    /*详情页身体字符串拼接*/
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
    /*点击投票 事件委托*/
    voteManage: function() {
        var content = this;
        $('.content').on('click', '.btn', function(event) {
            var userInfo = content.getStorage(localKey);
            var btnEle = event.target;
            var $numEle = $(btnEle).siblings('.vote').children('span');
            var voteNum = parseInt($numEle.html());
            if (userInfo) {
                var selfId = userInfo.id;
                var voterId = $(event.target).attr('data-id');
                content.requestData(' /vote/index/poll?id=' + voterId + '&voterId=' + selfId, 'GET', function(data) {
                    if (data.errno === 0) {
                        $numEle.html(++voteNum + '票');
                        $numEle.addClass('bounceIn');
                    } else {
                        alert(data.msg);
                    }
                })
            } else {
                $('.mask').show();
            }
        });
    },
    /*用户登录及保存用户信息*/
    userInfoManage: function() {
        var content = this;
        var userInfo = this.getStorage(localKey);
        if (userInfo) {
            $('.register').html('个人主页').click(function(event) {
                window.location = '/vote/detail/' + userInfo.id;
            });
            $('.sign_in span').html('已登入');
            $('.no_signed').hide();
            $('.username').html(userInfo.name);
        }
        $('.sign_in').click(function(event) {
            $('.mask').show();
        });
        $('.mask').click(function(event) {
            if (event.target.className === 'mask') {
                $(this).hide();
            }
        });
        $('.dropout').click(function(event) {
            content.deleteStorage(localKey);
            window.location.reload();//重新刷新页面
        });
        $('.subbtn').click(function(event) {
            var sendData = content.getSubmitData();
            if (sendData) {
                content.requestData('/vote/index/info', 'POST', function(data) {
                    console.log(data);
                    if (data.errno === 0) {
                        content.setStorage(localKey, {
                            name: data.user.username,
                            id: data.user.id
                        })
                        window.location.reload();
                    } else {
                        alert(data.msg);
                    }
                }, sendData);
            }
        });
    },
    /*获取用户登录的信息*/
    getSubmitData: function() {
        var usernum = $('.usernum').val();
        var userPassword = $('.user_password').val();
        if (!usernum) {
            alert('请输入id号');
            return false;
        }
        if (!userPassword) {
            alert('请输入密码');
            return false;
        }
        return {
            password: userPassword,
            id: usernum
        }
    },
    setStorage: function(key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    },
    getStorage: function(key) {
        return JSON.parse(localStorage.getItem(key));
    },
    deleteStorage: function(key) {
        localStorage.removeItem(key);
    },
    /*把注册的信息发送给后台*/
    registerSendData: function() {
        var content = this;
        $('.rebtn').click(function(event) {
            var sendData = content.getRegisterData();
            if (sendData) {
                content.requestData('/vote/register/data', 'POST', function(data){
                    alert(data.msg);
                    if (data.errno === 0) {
                        content.setStorage(localKey, {
                            name: sendData.username,
                            id: data.id
                        })
                        window.location = '/vote/index';
                    }
                }, sendData)
            }
        });
    },
    /*获取用户注册信息*/
    getRegisterData: function() {
        var username = $('.username').val();
        var initialPassword = $('.initial_password').val();
        var confirmPassword = $('.confirm_password').val();
        var mobile = $('.mobile').val();
        var description = $('.description').val();
        var gender = 'boy';
        if (!username) {
            alert('请输入用户名～');
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
    /*第一次获取首页数据*/
    requestHomeFirstData: function() {
        var content = this;
        this.requestData('/vote/index/data?limit=' + limit + '&offset=' + offset, 'GET', function(data) {
            $('.coming').html(content.indexUsersStr(data.data.objects));
            total = data.data.total;
        });
    },
    /*获取更多数据*/
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
    /*首页绑定数据，字符串拼接方法*/
    indexUsersStr: function(arrs) {
        var str = ''
        for(var i = 0; i < arrs.length; i++) {
            str += '<li> '
                +'<div class="head">'
                +'   <a href="/vote/detail/' + arrs[i].id + '">'
                +'      <img src="' + arrs[i].head_icon + '" alt="">'
                +'   </a>'
                +'</div>'
                +'<div class="up">'
                +'   <div class="vote">'
                +'      <span>' + arrs[i].vote + '票</span>'
                +'   </div>'
                +'   <div class="btn" data-id=' + arrs[i].id + '>'
                +'      投TA一票'
                +'   </div>'
                +'</div>'
                +'<div class="descr">'
                +'   <a href="/vote/detail/' + arrs[i].id + '">'
                +'     <div>'
                +'        <span>' + arrs[i].username + '</span>'
                +'        <span>|</span>'
                +'        <span>编号#' + arrs[i].id + '</span>'
                +'      </div>'
                +'      <p>' + arrs[i].description + '</p>'
                +'   </a>'
                +'</div>  '
                +'</li>'
        }
        return str;
    },
   /*Ajax获取数据方法*/
    requestData: function(url, type, callback, data)  {
        data = data || '';
        $.ajax({
            url: url,
            type: type,
            dataType: 'json',
            data: data,
            success: callback
        })
    }
}
$(document).ready(function($) {
    if (indexReg.test(url)) {
        voteFn.indexInit();
    } else if (registerReg.test(url)) {
        voteFn.registerInit();
    } else if (detailReg.test(url)) {
        voteFn.detailInit();
    } else if (searchReg.test(url)) {
        voteFn.searchInit();
    }
});
