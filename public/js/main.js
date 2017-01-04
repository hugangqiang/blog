$(function () {

        $('.app-nav').css('height',$(window).height());
        $('.app-login').css('height',$(window).height());
        $('.app-register').css('height',$(window).height());
        //登录注册
        $('.sign').css({
            left:($(window).width()-$('.sign').width())/2,
            top:-$('.sign').height()
        });
        $('.log').on('click',function(){
            $('.sign').show().animate({
                top:($(window).height()-$('.sign').height())/2
            });
        });
        $('.sign .close').on('click',function(){
            $('.sign').css({
                left:($(window).width()-$('.sign').width())/2,
                top:-$('.sign').height()
            }).hide(500);
        });

        $('.login .switch').on('click',function () {
            $('.sign').css({
                transition :'1s',
                transform: 'rotateY(180deg)'
            })
        });
        $('.register .switch').on('click',function () {
            $('.sign').css({
                transition :'1s',
                transform: 'rotateY(0deg)'
            })
        });
        //手机版
        $('.header .app-nav-btn').on('click',function(){
            $('.app-nav').show();
        });
        $('.app-nav .app-close').on('click',function(){
            $('.app-nav').hide();
        });

        $('.app-nav .log-btn').on('click',function () {
            $('.app-nav').hide();
            $('.app-login').show();
        });
        $('.contact-message .log').on('click',function () {
            $('.app-login').show();
        });
        $('.app-nav .reg-btn').on('click',function () {
            $('.app-nav').hide();
            $('.app-register').show();
        });
        $('.app-register .app-close').on('click',function () {
            $('.app-nav').show();
            $('.app-register').hide();
        });
        $('.app-login .app-close').on('click',function () {
            $('.app-nav').show();
            $('.app-login').hide();
        });
        $('.app-login .app-switch').on('click',function () {
            $('.app-login').hide();
            $('.app-register').show();
        });
        $('.app-register .app-switch').on('click',function () {
            $('.app-register').hide();
            $('.app-login').show();
        });
        //置顶
        $(window).scroll(function () {
            if($(window).scrollTop()>100){
                $(".top").show();
            }else{
                $(".top").hide();
            }
        });
        $('.top').on('click',function () {
            $(window).scrollTop(0);
        });
        //注册
        $('.sign .register .register-btn').on('click',function () {
            //通过ajax提交请求
            $.ajax({
                type: 'post',
                url: '/api/user/register',
                data: {
                    username: $('.sign .register').find('[name = username]').val(),
                    password: $('.sign .register').find('[name = password]').val(),
                    repassword: $('.sign .register').find('[name = repassword]').val(),
                },
                dataType: 'json',
                success: function (result) {
                    $('.sign .register .warning').html( result.message );
                    if( !result.code ){
                        //注册成功
                        window.location.reload();
                    }
                }
            });
        });
        //登录
        $('.sign .login .login-btn').on('click',function () {
            //通过ajax提交请求
            $.ajax({
                type: 'post',
                url: '/api/user/login',
                data: {
                    username: $('.sign .login').find('[name = username]').val(),
                    password: $('.sign .login').find('[name = password]').val()
                },
                dataType: 'json',
                success: function (result) {
                    $('.sign .login .warning').html( result.message );

                    if( !result.code ){
                        //登录成功
                        window.location.reload();
                    }
                }
            });
        });
        //手机注册
        $('.app-register .register-btn').on('click',function () {
            //通过ajax提交请求
            $.ajax({
                type: 'post',
                url: '/api/user/register',
                data: {
                    username: $('.app-register').find('[name = username]').val(),
                    password: $('.app-register').find('[name = password]').val(),
                    repassword: $('.app-register').find('[name = repassword]').val(),
                },
                dataType: 'json',
                success: function (result) {
                    $('.app-register .warning').html( result.message );
                    if( !result.code ){
                        //注册成功
                        window.location.reload();
                    }
                }
            });
        });
        //手机登录
        $('.app-login .login-btn').on('click',function () {
            //通过ajax提交请求
            $.ajax({
                type: 'post',
                url: '/api/user/login',
                data: {
                    username: $('.app-login').find('[name = username]').val(),
                    password: $('.app-login').find('[name = password]').val()
                },
                dataType: 'json',
                success: function (result) {
                    $('.app-login .warning').html( result.message );
                    if( !result.code ){
                        //登录成功
                        window.location.reload();
                    }
                }
            });
        });
        //切换图标
        $('.userInfo img').on('click',function () {
            $('.userImg').stop();
           $('.userImg').fadeToggle();
        });
        $('.userImg img').on('click',function () {
            //通过ajax提交请求
            $.ajax({
                type: 'post',
                url: '/api/user/userImg/edit',
                data: {
                    userImg: $(this).index()
                },
                dataType: 'json',
                success: function (result) {
                    if( !result.code ) {
                        //更换成功
                        window.location.reload();
                    }
                }
            });
        });
        //退出
        $('.logout').on('click', function () {
            $.ajax({
                url: '/api/user/logout',
                success: function (result) {
                    if( !result.code ){
                        window.location.reload();
                    }
                }
            })
        });
        //分页
        var prepage = 10;
        var page = 1;
        var pages = 0;
        var comments = [];
        var messages = [];

        //提价评论

        $('.comment .btn-comment').on('click',function(){
            $.ajax({
                type: 'post',
                url: '/api/comment/post',
                data: {
                    contentid: $('.comment').find('[name = contentId]').val(),
                    content: UE.getEditor('editor').getContent()
                },
                dataType: 'json',
                success: function (responseData) {
                     $('.comment .warning').html( responseData.message );
                     setTimeout(function () {
                         UE.getEditor('editor').setContent('');
                         $('.comment .warning').html('');
                     },500);
                    comments = responseData.data.comments.reverse();
                    renderComment();
                }
            });
        });
        
        //每次页面重载的时候获取一下该文章的所有评论
        $.ajax({
            url: '/api/comment',
            data: {
                contentid: $('.comment').find('[name = contentId]').val()
            },
            dataType: 'json',
            success: function (responseData) {
                comments = responseData.data.reverse();
                renderComment();
            }
        });
        $('.comment .pages').delegate('a','click',function () {
            if($(this).parent().hasClass('previous')){
                page--;
            }
            if($(this).parent().hasClass('next')){
                page++;
            }
            renderComment();
        });
        function renderComment() {

            pages = Math.max(Math.ceil(comments.length / prepage),1);
            var start = Math.max(0, (page-1) * prepage);
            var end = Math.min(start + prepage, comments.length);

            $('.comment .pages li').eq(1).html('一共有'+ comments.length +'条数据，每页显示'+prepage+'条数据， 一共'+ pages +'页， 当前第'+ page +'页');
            if( page<=1 ){
                page = 1;
                $('.comment .pages li:first').hide();
            }else{
                $('.comment .pages li:first').show();
            }
            if( page>=pages ){
                page = pages;
                $('.comment .pages li:last').hide();
            }else{
                $('.comment .pages li:last').show();
            }

            var html = '';
            if( comments.length == 0 ){
                html = '<div style="margin-top: 20px; font-size: 24px;">还没有评论，求神评</div>';
            }else{
                for(var i=start; i<end; i++){
                    html += '<div style="position: relative;">'+
                        '<div class="obj-inline-block" style="position: absolute; left: 0; top: 0;">'+
                        '<img class="img-rounded" width="50" height="50" src="/public/img/user-pic/'+ comments[i].userImg +
                        '.png" alt=""></div>'+
                        '<div style="margin-left: 60px; height: 50px;" class="obj-inline-block">'+
                        '<p style="line-height: 25px;">'+ comments[i].username +'</p>'+
                        '<p style="line-height: 25px;">'+ formatDate(comments[i].postTime) +'</p>'+
                        '</div>'+
                        '<div style="word-break : break-all; margin-top:10px;">'+ comments[i].content +'</div>'+
                        '<hr>'+
                        '</div>';
                }
            }
            $('.comment .messagelist').html(html);
        }
        function formatDate(d){
            var date1 = new Date(d);
            return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + '  ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
        }


        //提交留言

        $('.contact-message .btn-message').on('click',function(){
            $.ajax({
                type: 'post',
                url: '/api/message/post',
                data: {
                    message: UE.getEditor('editor').getContent()
                },
                dataType: 'json',
                success: function (responseData) {
                    $('.contact-message .warning').html( responseData.message );
                    setTimeout(function () {
                        UE.getEditor('editor').setContent('');
                        $('.contact-message .warning').html('');
                    },500);
                    messages = responseData.data.reverse();
                    renderMessage();
                }
            });
        });

        //每次页面重载的时候获取留言
        $.ajax({
            url: '/api/message',
            dataType: 'json',
            success: function (responseData) {
                messages = responseData.data.reverse();
                renderMessage();
                renderIndexMessage();
            }
        });

        $('.contact-message .pages').delegate('a','click',function () {
            if($(this).parent().hasClass('previous')){
                page--;
            }
            if($(this).parent().hasClass('next')){
                page++;
            }
            renderMessage();
        });
        function renderMessage() {

            pages = Math.max(Math.ceil(messages.length / prepage),1);
            var start = Math.max(0, (page-1) * prepage);
            var end = Math.min(start + prepage, messages.length);

            $('.contact-message .message-num').html('已经有'+ messages.length +'条留言抢在你前面');
            $('.contact-message .pages li').eq(1).html('一共有'+ messages.length +'条数据，每页显示'+prepage+'条数据， 一共'+ pages +'页， 当前第'+ page +'页');
            if( page<=1 ){
                page = 1;
                $('.contact-message .pages li:first').hide();
            }else{
                $('.contact-message .pages li:first').show();
            }
            if( page>=pages ){
                page = pages;
                $('.contact-message .pages li:last').hide();
            }else{
                $('.contact-message .pages li:last').show();
            }

            var html = '';
            for(var i=start; i<end; i++){
                if(!messages[i].reply){
                    html += '<div style="position: relative;">'+
                        '<div class="obj-inline-block" style="position: absolute; left: 0; top: 0;">'+
                        '<img class="img-rounded" width="50" height="50" src="/public/img/user-pic/'+ messages[i].userImg +
                        '.png" alt=""></div>'+
                        '<div style="margin-left: 60px; height: 50px;" class="obj-inline-block">'+
                        '<p style="line-height: 25px;">'+ messages[i].user +'</p>'+
                        ' <p style="line-height: 25px;">'+ formatDate(messages[i].addTime) +'</p>'+
                        '</div>'+
                        '<div style="word-break : break-all; margin: 10px 0;">'+ messages[i].message +'</div>'+
                        ' <hr>'+
                        '</div>';
                }else{
                    html += '<div style="position: relative;">'+
                                '<div class="obj-inline-block" style="position: absolute; left: 0; top: 0;">'+
                                    '<img class="img-rounded" width="50" height="50" src="/public/img/user-pic/'+ messages[i].userImg +
                                '.png" alt=""></div>'+
                                '<div style="margin-left: 60px; height: 50px;" class="obj-inline-block">'+
                                    '<p style="line-height: 25px;">'+ messages[i].user +'</p>'+
                                    ' <p style="line-height: 25px;">'+ formatDate(messages[i].addTime) +'</p>'+
                                '</div>'+
                                '<div style="word-break : break-all; margin: 10px 0;">'+ messages[i].message +'</div>'+
                                '<div style="word-break : break-all; margin-top: 10px;">' +
                                    '<span style="color: #428bca; margin-right:10px;">管理员回复:</span><span>'+messages[i].reply+'</span>'+
                                '</div>'+
                                ' <hr>'+
                            '</div>';
                }

                $('.contact-message .contact-message-content').html(html);
            }
        }
        function renderIndexMessage(){
            var html = '';
            for(var i=0; i<5; i++){
                html += '<div style="position: relative;">'+
                            '<div class="obj-inline-block" style="position: absolute; left: 0; top: 0;">'+
                                '<img class="img-rounded" width="40" height="40" src="/public/img/user-pic/'+ messages[i].userImg +
                            '.png" alt=""></div>'+
                            '<div style="margin-left: 50px;" class="obj-inline-block">'+
                                '<p style="line-height: 20px;">'+ messages[i].user +'</p>'+
                                '<p style="line-height: 20px;">'+ formatDate(messages[i].addTime) +'</p>'+
                                '<div style="word-break : break-all; margin: 10px 0;">'+ messages[i].message +'</div>'+
                            '</div>'+

                        '</div>';
                $('.messageNew').html(html);
            }
        }


});