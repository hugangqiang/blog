
(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$menu = $('#menu'),
			$sidebar = $('#sidebar'),
			$main = $('#main');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// IE<=9: Reverse order of main and sidebar.
			if (skel.vars.IEVersion <= 9)
				$main.insertAfter($sidebar);

		// Menu.
			$menu
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-menu-visible'
				});

		// Search (header).
			var $search = $('#search'),
				$search_input = $search.find('input');

			$body
				.on('click', '[href="#search"]', function(event) {

					event.preventDefault();

					// Not visible?
						if (!$search.hasClass('visible')) {

							// Reset form.
								$search[0].reset();

							// Show.
								$search.addClass('visible');

							// Focus input.
								$search_input.focus();

						}

				});

			$search_input
				.on('keydown', function(event) {

					if (event.keyCode == 27)
						$search_input.blur();

				})
				.on('blur', function() {
					window.setTimeout(function() {
						$search.removeClass('visible');
					}, 100);
				});

		// Intro.
			var $intro = $('#intro');

			// Move to main on <=large, back to sidebar on >large.
				skel
					.on('+large', function() {
						$intro.prependTo($main);
					})
					.on('-large', function() {
						$intro.prependTo($sidebar);
					});

	});
    $('#sign').appendTo($('body'));
	$('#menu .log-btn').on('click',function(){
        $('body').removeClass('is-menu-visible');
		$('body').addClass('is-login-visible');
        $('#sign').show();
	});
    $('#header .login .log-btn').on('click',function(){
        $('body').removeClass('is-menu-visible');
        $('body').addClass('is-login-visible');
        $('#sign').show();
    });
	$('#sign .close').on('click',function(){
		$('body').removeClass('is-login-visible');
        $('#sign').hide();
	});
    $('#sign .login .switch').on('click',function () {
        $('#sign').css({
            transition :'1s',
            transform: 'rotateY(180deg)'
        })
    });
    $('#sign .register .switch').on('click',function () {
        $('#sign').css({
            transition :'1s',
            transform: 'rotateY(0deg)'
        })
    });
    if(localStorage.getItem("rememberme") && localStorage.getItem("rememberme") != ''){
        let userInfo = JSON.parse(localStorage.getItem("rememberme"));
        $('#sign .login').find('[name = username]').val(userInfo.userName);
        $('#sign .login').find('[name = password]').val(userInfo.password);
    }

    function login(){
        let userName = $('#sign .login').find('[name = username]').val();
        let password = $('#sign .login').find('[name = password]').val();
        if(userName == '' ){
            $('#sign .login .warning').html('用户名不能为空！');
            return;
        }
        if( password == '' ){
            $('#sign .login .warning').html('密码不能为空！');
            return;
        }
        let reg = /[a-zA-Z]/;
        if( !reg.test(userName )){
            $('#sign .login .warning').html('请输入英文用户名！');
            return;
        }
        if( password.length < 6 ){
            $('#sign .login .warning').html('请输入6位或以上的密码');
            return;
        }

        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                userName: userName,
                password: password
            },
            dataType: 'json',
            success: function (result) {
                $('#sign .login .warning').html( result.message );
                if( !result.code ){
                    //登录成功
                    if($('#rememberme').is(':checked')){
                        localStorage.setItem("rememberme",'{"userName":"'+ userName +'","password":"'+password+'"}');
                    }else{
                        localStorage.setItem("rememberme",'');
                    }
                    window.location.reload();
                }
            }
        });
    }
    function register(){
        let userName = $('#sign .register').find('[name = username]').val();
        let userEmail = $('#sign .register').find('[name = useremail]').val();
        let password = $('#sign .register').find('[name = password]').val();
        let repassword = $('#sign .register').find('[name = repassword]').val();
        if(userName == '' ){
            $('#sign .register .warning').html('用户名不能为空！');
            return;
        }
        if(userEmail == '' ){
            $('#sign .register .warning').html('邮箱不能为空！');
            return;
        }
        if(password == '' ){
            $('#sign .register .warning').html('密码不能为空！');
            return;
        }
        let reg = /[a-zA-Z]/;
        if( !reg.test(userName )){
            $('#sign .register .warning').html('请输入英文用户名！');
            return;
        }
        let regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!regEmail.test(userEmail ) ){
            $('#sign .register .warning').html('请输入正确的邮箱！');
            return;
        }
        if( password.length < 6 ){
            $('#sign .register .warning').html('请输入6位或以上的密码');
            return;
        }
        if( password != repassword ){
            $('#sign .register .warning').html('两次输入的密码不一致');
            return;
        }
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                userName: userName,
                userEmail: userEmail,
                password: password
            },
            dataType: 'json',
            success: function (result) {
                $('#sign .register .warning').html( result.message );
                if( !result.code ){
                    //注册成功
                    window.location.reload();
                }
            }
        });
    }
    function logout(){
        $.ajax({
            url: '/api/user/logout',
            success: function (result) {
                if( !result.code ){
                    window.location.reload();
                }
            }
        })
    }
    $('#sign .login .login-btn').on('click',login);

    $('#sign .login input').bind('keypress',function(event){
        if (event.keyCode == 13) {
            login();
        }
    });

    $('#sign .register input').bind('keypress',function(event){
        if (event.keyCode == 13) {
            register();
        }
    });
    $('#sign .register .register-btn').on('click',register);
    //退出
    $('.logout').on('click', logout);

    if(!localStorage.getItem("vipasd")){
        $.ajax({
            type: "post",
            url: "/api/ip",
            data: returnCitySN,
            dataType: "json",
            success: function(result){
                if( !result.code ){
                    localStorage.setItem("vipasd",'0');
                }
            }
        })
    }
    function getQueryStr(name) {  
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
        var r = window.location.search.substr(1).match(reg);  
        if (r != null) return unescape(r[2]);  
        return null;  
    } 
    $('.githublogin').on('click',function(){
        window.location.href= 'https://github.com/login/oauth/authorize?client_id=7ca065386fbcffcaace2&scope=user:email';
    });

    $('.qqlogin').on('click',function(){
        window.location.href= 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101432076&redirect_uri=http://hugangqiang.com/api/user/qq&state=hu';
    })

console.log([
    "                   _ooOoo_",
    "                  o8888888o",
    "                  88\" . \"88",
    "                  (| -_- |)",
    "                  O\\  =  /O",
    "               ____/`---'\\____",
    "             .'  \\\\|     |//  `.",
    "            /  \\\\|||  :  |||//  \\",
    "           /  _||||| -:- |||||-  \\",
    "           |   | \\\\\\  -  /// |   |",
    "           | \\_|  ''\\---/''  |   |",
    "           \\  .-\\__  `-`  ___/-. /",
    "         ___`. .'  /--.--\\  `. . __",
    "      .\"\" '<  `.___\\_<|>_/___.'  >'\"\".",
    "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
    "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /",
    "======`-.____`-.___\\_____/___.-`____.-'======",
    "                   `=---='",
    "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
    "            前端QQ交流群:60339262            "
].join('\n'));

})(jQuery);