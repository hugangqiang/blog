let nodemailer = require('nodemailer');
let url=require('url');
let axios=require('axios');
let express = require('express');
let router = express.Router();

const path = require('path');
const fs = require('fs');
const multer  = require('multer');
//加密
const md5 = require('md5');

//数据表
const User = require('../models/User');
const Content = require('../models/Content');
const Message = require('../models/Message');
const Github = require('../models/Github');
const Qq = require('../models/Qq');
const Ip = require('../models/Ip');
//统一返回格式
let responseData;
let userImg;
router.use( function(req, res, next){
    responseData = {
        code: 0,
        message: ''
    };
    userImgSrc = [
        '/public/images/userImg/1.jpg',
        '/public/images/userImg/2.jpg',
        '/public/images/userImg/3.jpg',
        '/public/images/userImg/4.jpg',
        '/public/images/userImg/5.jpg',
        '/public/images/userImg/6.jpg',
        '/public/images/userImg/7.jpg',
        '/public/images/userImg/8.jpg',
        '/public/images/userImg/9.jpg',
        '/public/images/userImg/10.jpg',
        '/public/images/userImg/11.jpg',
        '/public/images/userImg/12.jpg',
        '/public/images/userImg/13.jpg',
        '/public/images/userImg/14.jpg',
        '/public/images/userImg/15.jpg',
        '/public/images/userImg/16.jpg',
        '/public/images/userImg/17.jpg',
        '/public/images/userImg/18.jpg',
        '/public/images/userImg/19.jpg',
        '/public/images/userImg/20.jpg',
        '/public/images/userImg/21.jpg',
        '/public/images/userImg/22.jpg',
        '/public/images/userImg/23.jpg',
        '/public/images/userImg/24.jpg',
        '/public/images/userImg/25.jpg'
    ];
    next();
});

//用户注册
router.post('/user/register',function(req,res,next){

    let user = req.body;
    user.password = md5(user.password);

    User.findOne({
        userName: user.userName
    }).then(function ( userInfo ) {
        if( userInfo ){
            //userInfo不为null表示数据库中又该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json( responseData );
            return;
        }
        //保存用户注册的信息到数据库中
        return new User({
            userName: user.userName,
            userEmail: user.userEmail,
            password: user.password,
            addTime: new Date(),
            userImg: userImgSrc[Math.floor(Math.random()*userImgSrc.length)]
        }).save();

    }).then(function( newUserInfo ){
        //token
        req.cookies.set('token', newUserInfo._id);
        responseData.message = '注册成功';
        res.json( responseData );
        return;
    });
});
//用户登录
router.post('/user/login',function(req,res,next){
    let user = req.body;
    user.password = md5(user.password);
    //数据验证
    User.findOne({
        userName: user.userName,
        password: user.password
    }).then(function ( userInfo ) {
        if( !userInfo ){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json( responseData );
            return;
        }
        //用户名和密码正确的
        //token
        req.cookies.set('token', userInfo._id);
        responseData.message = '登录成功';
        res.json( responseData );
        return;
    })
});
//github登录
router.get('/user/github',function(req,res,next){
    let code = req.query.code;
    let src = "https://github.com/login/oauth/access_token?client_id=7ca065386fbcffcaace2&client_secret=e09114dc25147d0f739ab426b09de5a78b44fa9d&code="+code;
    let token;
    axios.post(src).then(function (access) {
        let resUrl = url.parse('?'+ access.data, true).query
        token = resUrl.access_token;
        if(typeof(token) != "undefined"){
            axios.get('https://api.github.com/user?access_token='+token).then(function(datas){
                Github.findOne({
                    userName: datas.data.name
                }).then(function ( userInfo ) {
                    if( userInfo ){
                        //userInfo不为null表示数据库中又该记录
                        req.cookies.set('token', userInfo._id);
                        
                        res.redirect("/");
                        return;
                    }
                    //保存用户注册的信息到数据库中
                    return new Github({
                        userName: datas.data.name,
                        userEmail: datas.data.email,
                        addTime: new Date(),
                        userImg: datas.data.avatar_url
                    }).save();

                }).then(function( newUserInfo ){
                    //token
                    req.cookies.set('token', newUserInfo._id);

                    res.redirect("/");
                    return;
                });
            });
        }else{
            res.redirect("/");
            return;
        }
    });
    
});

//qq登录
router.get('/user/qq',function(req,res,next){
    if(req.query.state == "hu"){
        let code = req.query.code;
        let src = "https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=101432076&client_secret=3c7ef3dc2f1f44dc772ab3232d73bde0&code="+code+"&redirect_uri=http://hugangqiang.com/api/user/qq";
        let token;
        axios.get(src).then(function (access) {
            let resUrl = url.parse('?'+ access.data, true).query
            token = resUrl.access_token;
            if(typeof(token) != "undefined"){
                axios.get('https://graph.qq.com/oauth2.0/me?access_token='+token).then(function(datas){
                    function callback(obj){
                        return obj.openid;
                    }
                    let openid = eval(datas.data);
                    axios.get('https://graph.qq.com/user/get_user_info?access_token='+ token +'&oauth_consumer_key=101432076&openid='+openid).then(function(qqInfo){
                        Qq.findOne({
                            openid: openid
                        }).then(function ( userInfo ) {
                            if( userInfo ){
                                //userInfo不为null表示数据库中又该记录
                                req.cookies.set('token', userInfo._id);
                                res.redirect("/");
                                return;
                            }
                            //保存用户注册的信息到数据库中
                            return new Qq({
                                openid: openid,
                                userName: qqInfo.data.nickname,
                                gender: qqInfo.data.gender,
                                province: qqInfo.data.province,
                                addTime: new Date(),
                                userImg: qqInfo.data.figureurl_qq_1
                            }).save();

                        }).then(function( newUserInfo ){
                            //token
                            req.cookies.set('token', newUserInfo._id);

                            res.redirect("/");
                            return;
                        });
                    })
                    
                });
            }else{
                res.redirect("/");
                return;
            }
        });
    }else{
        res.redirect("/");
        return;
    }
    
});
//找回密码
router.post('/user/findpass',function (req, res) {
    
    res.json( responseData );
    return;
});

//退出
router.get('/user/logout',function (req, res) {
    req.cookies.set('token', null);
    res.json( responseData );
    return;
});


//文章点赞
router.post('/laud',function(req,res){
    Content.findOne({
        _id: req.body.id
    }).then(function ( content ) {
        content.laud++;
        return content.save();
    }).then(function(laud){
        responseData.message = laud.laud;
        res.json(responseData);
        return;
    });
});
//文章浏览
router.post('/view',function(req,res){
    Content.findOne({
        _id: req.body.id
    }).then(function ( content ) {
        content.views++;
        return content.save();
    }).then(function(view){
        responseData.message = view.views;
        res.json(responseData);
        return;
    });
});

//ip
router.post('/ip',function(req,res){
    Ip.findOne({
        cip: req.body.cip
    }).then(function ( ip ) {
        if(ip){
            res.json(responseData);
            return;
        }
        new Ip({
            cip: req.body.cip,
            cname: req.body.cname,
            cid: req.body.cid
        }).save();
        res.json(responseData);
        return;
    });
});


//获取文章的所有留言
router.get('/message',function (req, res) {
    Message.find().then(function(message){
        responseData.data = message;
        res.json(responseData);
    });
});
//ajax跳转
router.post('/pageAjax',function (req, res) {
    res.json(responseData);
});
//留言
router.post('/message',function(req,res){
    //留言内容是否为空
    let userName = req.body.userName;
    let userEmail= req.body.userEmail;
    let userImg = "/public/images/userImg/none.png";

    if( typeof(userEmail) == "undefined" ){
        userEmail = req.userInfo.userEmail;
        userImg = req.userInfo.userImg;
        userName = req.userInfo.userName;
    }

    new Message({
        addTime: new Date(),
        message: req.body.content,
        ip: req.body.ip,
        userImg: userImg,
        user: userName,
        email: userEmail
    }).save().then(function( newmessage ){
        responseData.message = '留言成功！';
        Message.find().then(function(message){
            responseData.data = message;
            res.json( responseData );
        });
    });
});


//获取文章的所有评论
router.get('/comment',function (req, res) {
    let contentId = req.query.id || '';
    Content.findOne({
        _id: contentId
    }).then(function(content){
        responseData.data = content.comments;
        res.json(responseData);
    });
});
//评论提交
router.post('/comment',function(req, res){
    //内容的id
    let contentId = req.body.id || '';

    let userName = req.body.userName;
    let userEmail= req.body.userEmail;
    let userImg = "/public/images/userImg/none.png";

    if( typeof(userEmail) == "undefined" ){
        userEmail = req.userInfo.userEmail;
        userImg = req.userInfo.userImg;
        userName = req.userInfo.userName;
    }

    let postData = {
        addTime: new Date(),
        message: req.body.content,
        ip: req.body.ip,
        userImg: userImg,
        user: userName,
        email: userEmail
    };

    Content.findOne({
        _id: contentId
    }).then(function (content) {
        content.comments.push( postData );

        return content.save();
    }).then(function(newContent){
       responseData.message = '评论成功';
       responseData.data = newContent.comments;
       res.json(responseData);
    });
});


//mail发送
router.post('/email/password',function(req, res){
    let transporter = nodemailer.createTransport({
        service: 'qq',
        port: 465, // SMTP 端口
        secureConnection: true, // 使用 SSL
        auth: {
            user: '1586638991@qq.com',
            //这里密码不是qq密码，是你设置的smtp密码
            pass: 'nfkusnktizecbacc'
        }
    });
    let mailOptions = {
        from: 'hi@hugangqiang.com', // 发件地址
        to: '', // 收件列表
        subject: '找回密码-胡钢强-前端博客', // 标题
        text: '找回密码-胡钢强-前端博客', // 标题
        html: '<b>Hello world ?</b>' // html 内容
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });
})
//图片上传

let createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};
let uploadFolder = './public/images/upload';
createFolder(uploadFolder);
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间轴+字段名;
        cb(null,  Date.now() + file.originalname.substring(file.originalname.indexOf('.')));
    }
});
// 通过 storage 选项来对 上传行为 进行定制化
let upload = multer({ storage: storage }).any();
router.post('/upload/img',function(req,res){

    upload(req, res, function (err) {
        //添加错误处理
        if (err) {
            console.log(err);
            return;
        }
        req.file = req.files[0];
        let tmp_path = req.file.path;
        fs.createReadStream(tmp_path);
        responseData.message = req.file.filename;
        res.json( responseData );
        res.end();
    });
});

module.exports = router;
