const path = require('path');
//加载express模块
const express = require('express');
const nunjucks = require('nunjucks');


//加载数据库模块
const mongoose = require('mongoose');
//加载cookies模块
const Cookies = require('cookies');
const bodyParser = require('body-parser');
//数据表
const User = require('./models/User');
const Github = require('./models/Github');
const Qq = require('./models/Qq');
//创建app应用
const app = express();


//设置静态文件托管
//当用户发访问url以/public开始，那么直接返回__dirname + '/public'下的文件
app.use('/public',express.static(__dirname + '/public'));

let env = nunjucks.configure(path.join(__dirname, 'views'), { // 设置模板文件的目录，为views
    autoescape: true,
    express: app,
    noCache: true,
    web: {
        useCache: false
    }
});
app.set('view engine', 'html'); // 模板文件的后缀名字为html
//自定义过滤器
env.addFilter('date', function(str,style) {
    let date = new Date(str);
    function p(s) {
        return s < 10 ? '0' + s: s;
    }
    if( style == "文字" ){
        return date.getFullYear() + '年' + p((date.getMonth() + 1)) + '月' + p(date.getDate()) + '日  ' + p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
    }else{
        return date.getFullYear() + '-' + p((date.getMonth() + 1)) + '-' + p(date.getDate()) + '  ' + p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
    }
});

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));


//设置cookieb
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    req.userInfo = {};
    if( req.cookies.get('token') ){
        try{
            //获取当前登录用户信息
            User.findById( req.cookies.get('token') ).then(function ( userInfo ) {
                if(!userInfo){
                    Github.findById( req.cookies.get('token') ).then(function ( userGitInfo ) {
                        if(!userGitInfo){
                            Qq.findById( req.cookies.get('token') ).then(function ( userQqInfo ) {
                                req.userInfo =  userQqInfo;
                                next();
                            })
                        }else{
                            req.userInfo =  userGitInfo;
                            next();
                        }
                    })
                }else{
                    req.userInfo =  userInfo;
                    next();
                }
                
            })
        }catch(e){}
    }else{
        next();
    }
});
//根据不同的功能划分模块
app.use('/',require('./routers/main'));
app.use('/api',require('./routers/api'));
app.use('/admin',require('./routers/admin'));



//连接数据库
mongoose.connect('mongodb://数据库用户名:数据库密码@服务器地址加端口/blog',{useMongoClient: true},function( err ){
    if( err ){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        //监听http请求8080端口
        app.listen(8080);
    }
});
