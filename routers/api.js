
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
var Message = require('../models/Message');

//统一返回格式
var responseData;

router.use( function(req, res, next){
    responseData = {
        code: 0,
        message: ''
    };
    next();
});

//用户注册
router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //用户是否为空
    if( username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json( responseData );
        return;
    }
    //密码是否为空
    if( password == ''){
        responseData.code = 1;
        responseData.message = '密码不能为空';
        res.json( responseData );
        return;
    }
    //两次输入的密码必须一致
    if( password != repassword ){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json( responseData );
        return;
    }
    //用户是否已经注册了
    User.findOne({
        username: username
    }).then(function ( userInfo ) {
        if( userInfo ){
            //userInfo不为null表示数据库中又该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json( responseData );
            return;
        }
        //保存用户注册的信息到数据库中
        var user = new User({
            userImg: '0',
            username: username,
            password: password
        });
        return user.save();
    }).then(function( newUserInfo ){
        responseData.message = '注册成功';
        req.cookies.set('userInfo', JSON.stringify({
            _id: newUserInfo,
            userImg: newUserInfo.userImg,
            username: newUserInfo.username
        }));
        res.json( responseData );
        return;
    });
});

//登录
router.post('/user/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if( username == '' || password == '' ){
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json( responseData );
        return;
    }
    //数据验证
    User.findOne({
        username: username,
        password: password
    }).then(function ( userInfo ) {
        if( !userInfo ){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json( responseData );
            return;
        }
        //用户名和密码正确的
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo,
            userImg: userInfo.userImg,
            username: userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo,
            userImg: userInfo.userImg,
            username: userInfo.username
        }));
        res.json( responseData );
        return;
    })
});

//退出
router.get('/user/logout',function (req, res) {
    req.cookies.set('userInfo', null);
    res.json( responseData );
});
//用户图标
router.post('/user/userImg/edit',function (req, res) {

    //获取要修改的用户的信息，并且用表单的形式展现出来
    var id = req.userInfo._id._id || '';
    //获取要修改的用户信息
    User.update({
        _id: id
    },{
        userImg: req.body.userImg
    }).then(function () {
        User.findOne({
            _id: id
        }).then(function(userInfo){
            responseData.userInfo = {
                _id: userInfo,
                userImg: userInfo.userImg,
                username: userInfo.username
            };
            req.cookies.set('userInfo', JSON.stringify({
                _id: userInfo,
                userImg: userInfo.userImg,
                username: userInfo.username
            }));
            res.json( responseData );
            return;
        });
    });
});

//获取文章的所有评论
router.get('/comment',function (req, res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function(content){
        responseData.data = content.comments;
        res.json(responseData);
    });
});
//评论提交
router.post('/comment/post',function(req, res){
    //内容的id
    var contentId = req.body.contentid || '';

    if( req.body.content == ''){
        responseData.code = 1;
        responseData.message = '说点什么吧！';
        res.json( responseData );
        return;
    }

    var postData = {
        userImg: req.userInfo.userImg,
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        content.comments.push( postData );
        return content.save();
    }).then(function(newContent){
       responseData.message = '评论成功';
       responseData.data = newContent;
       res.json(responseData);
    });
});

//获取文章的所有留言
router.get('/message',function (req, res) {
    Message.find().then(function(message){
        responseData.data = message;
        res.json(responseData);
    });
});
//留言
router.post('/message/post',function(req,res){
    //留言内容是否为空
    if( req.body.message == ''){
        responseData.code = 1;
        responseData.message = '说点什么吧！';
        res.json( responseData );
        return;
    }

    new Message({
        message: req.body.message,
        addTime: new Date(),
        userImg: req.userInfo.userImg,
        user: req.userInfo.username
    }).save().then(function( newmessage ){
        responseData.message = '以提交留言';
        Message.find().then(function(message){
            responseData.data = message;
            res.json( responseData );
        });
    });
});
module.exports = router;
