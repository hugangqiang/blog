//加载express模块
var express = require('express');

var path = require('path');
//加载模板处理模板
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载富文本
var ueditor = require("ueditor");

//加载cookies模块
var Cookies = require('cookies');
//创建app应用
var app = express();
//获取用户模型
var User = require('./models/User');

//设置静态文件托管
//当用户发访问url以/public开始，那么直接返回__dirname + '/public'下的文件
app.use('/public',express.static(__dirname + '/public'));

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板的内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine,第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine','html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

//bodyParser设置
app.use( bodyParser.urlencoded({extended: true}) );

app.use(bodyParser.json());

app.use("/public/ueditor/ue", ueditor(path.join(__dirname, '/'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if(req.query.action === 'uploadimage'){
        var foo = req.ueditor;

        var imgname = req.ueditor.filename;

        var img_url = '/public/img/content/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = '/public/img/content/';
        res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/public/ueditor/nodejs/config.json')
    }
}));
//设置cookie
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    //解析登录用户的cookie信息
    req.userInfo = {};
    if( req.cookies.get('userInfo') ){
        try{
            req.userInfo = JSON.parse( req.cookies.get('userInfo'));
            //获取当前登录用户是否是管理员
            User.findById( req.userInfo._id ).then(function ( userInfo ) {
                req.userInfo.isAdmin = Boolean( userInfo.isAdmin );
                next();
            })
        }catch(e){

        }
    }else{
        next();
    }
});

//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));


//连接数据库
mongoose.connect('mongodb://localhost:27017/blog',function( err ){
    if( err ){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        //监听http请求shiyindong1988
        app.listen(8080);
    }
});


