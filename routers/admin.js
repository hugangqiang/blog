
let express = require('express');
let router = express.Router();


//数据表
const Content = require('../models/Content');
const Message = require('../models/Message');
const User = require('../models/User');
const Github = require('../models/Github');
const Qq = require('../models/Qq');

let data;
let responseData;
//验证是否是管理员
router.use(function(req,res,next){
    if(typeof(req.userInfo._id) == 'undefined'){
        res.render('main/prevent');
        return;
    }else{
        if( req.userInfo.isAdmin != 'admin' ){
            res.render('main/prevent',{
                userInfo: req.userInfo
            });
            return;
        }
    }
    data = {
        userInfo: req.userInfo
    };
    responseData = {
        code: 0,
        message: ''
    };
    next();

});




//首页
router.get('/', function(req, res, next){
    res.render('admin/index',data)
});



//用户首页
router.get('/user',function(req, res){
    Github.find().then(function (users) {
        return users;
    }).then(function(githubs){
        User.find().then(function (users) {
            return users;
        }).then(function(users){
            Qq.find().then(function(qqs){
                res.render('admin/user_index',{
                    users: users,
                    githubs: githubs,
                    qqs: qqs,
                    userInfo: req.userInfo
                });
            })
            
        })
    })
    
    
});
//修改用户
router.get('/user/edit',function (req, res) {
    let id = req.query.id || '';
    User.findOne({
        _id: id
    }).then(function (user) {
        res.render('admin/User_edit',{
            userInfo: req.userInfo,
            user: user
        });
    });
});
//保存修改用户
router.post('/user/edit',function (req, res) {
    let id = req.body._id || '';
    User.update({
        _id: id
    },{
        isAdmin: req.body.isAdmin
    }).then(function () {
        res.json(responseData);
        return;
    });
});
//用户删除
router.get('/user/del',function(req, res){
    //获取要删除的内容id
    let id = req.query.id || '';
    User.remove({
        _id: id
    }).then(function(){
        res.json(responseData);
        return;
    });
});

//修改github用户
router.get('/userGit/edit',function (req, res) {
    let id = req.query.id || '';
    Github.findOne({
        _id: id
    }).then(function (user) {
        res.render('admin/userGit_edit',{
            userInfo: req.userInfo,
            user: user
        });
    });
});
//保存github修改用户
router.post('/userGit/edit',function (req, res) {
    let id = req.body._id || '';
    Github.update({
        _id: id
    },{
        isAdmin: req.body.isAdmin
    }).then(function () {
        res.json(responseData);
        return;
    });
});
//github用户删除
router.get('/userGit/del',function(req, res){
    //获取要删除的内容id
    let id = req.query.id || '';
    Github.remove({
        _id: id
    }).then(function(){
        res.json(responseData);
        return;
    });
});

//修改QQ用户
router.get('/userQq/edit',function (req, res) {
    let id = req.query.id || '';
    Qq.findOne({
        _id: id
    }).then(function (user) {
        res.render('admin/userQq_edit',{
            userInfo: req.userInfo,
            user: user
        });
    });
});
//保存QQ修改用户
router.post('/userQq/edit',function (req, res) {
    let id = req.body._id || '';
    Qq.update({
        _id: id
    },{
        isAdmin: req.body.isAdmin
    }).then(function () {
        res.json(responseData);
        return;
    });
});
//QQ用户删除
router.get('/userQq/del',function(req, res){
    //获取要删除的内容id
    let id = req.query.id || '';
    Qq.remove({
        _id: id
    }).then(function(){
        res.json(responseData);
        return;
    });
});

//内容首页
router.get('/content',function(req, res){

    let page = Number( req.query.page || 1 );
    let limit = 10;
    let pages = 0;

    Content.count().then(function (count) {

        //计算总页数
        pages = Math.ceil( count/limit );
        //取值不超过pages
        page = Math.min( page, pages );
        //取值不小于1
        page = Math.max( page, 1 );
        let skip = (page - 1)*limit;
        //sort()排序，1升序，-1降序
        Content.find().sort({ addTime: -1 }).limit(limit).skip(skip).then( function( contents ){
            res.render('admin/content_index',{
                contents: contents,
                count: count,
                limit: limit,
                pages: pages,
                page: page,
                userInfo: req.userInfo,
                admin: 'content'
            })
        });
    })
});
//内容添加
router.get('/content/add',function(req, res){
    res.render('admin/content_add',data)
});
//内容保存
router.post('/content/add',function (req, res) {

    //保存数据到数据库
    new Content({
        userImg: req.userInfo.userImg,
        user: req.userInfo.userName,
        title: req.body.title,
        titleImg: req.body.titleImg,
        description: req.body.description,
        content: req.body.content,
        addTime: new Date()
    }).save().then(function (rs) {
        res.json(responseData);
        return;
    });
});
//修改内容
router.get('/content/edit',function (req, res) {
    let id = req.query.id || '';

    Content.findOne({
        _id: id
    }).then(function (content) {
        res.render('admin/content_edit',{
            userInfo: req.userInfo,
            content: content
        });
    });
});
//保存修改内容
router.post('/content/edit',function (req, res) {
    let id = req.body._id || '';
    Content.update({
        _id: id
    },{
        userImg: req.userInfo.userImg,
        user: req.userInfo.userName,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function () {
        res.json(responseData);
        return;
    });
});
//内容删除
router.get('/content/del',function(req, res){
    //获取要删除的内容id
    let id = req.query.id || '';
    Content.remove({
        _id: id
    }).then(function(){
        res.json(responseData);
        return;
    });
});


//留言首页
router.get('/message',function(req, res){

    let page = Number( req.query.page || 1 );
    let limit = 10;
    let pages = 0;

    Message.count().then(function (count) {

        //计算总页数
        pages = Math.ceil( count/limit );
        //取值不超过pages
        page = Math.min( page, pages );
        //取值不小于1
        page = Math.max( page, 1 );
        let skip = (page - 1)*limit;
        //sort()排序，1升序，-1降序
        Message.find().sort({ _id: -1 }).limit(limit).skip(skip).then( function( messages ){
            res.render('admin/message_index',{
                messages: messages,
                count: count,
                limit: limit,
                pages: pages,
                page: page,
                userInfo: req.userInfo,
                admin: 'message'
            })
        });
    })
});
router.get('/message/reply',function (req, res) {
    let id = req.query.id || '';
    Message.find({
        _id: id
    }).then(function(message){
        res.render('admin/message_rep', {
            userInfo: req.userInfo,
            message: message[0]
        });

    })
});
router.post('/message/reply',function (req, res) {
    let id = req.body.id || '';
    
    //保存数据到数据库
    Message.update({
        _id: id
    },{
        reply: {
            content: req.body.reply,
            user: req.userInfo.userName,
            userImg: req.userInfo.userImg,
            addTime: new Date()
        }
    }).then(function () {
        res.json(responseData);
        return;
    });
});

//内容删除
router.get('/message/del',function(req, res){
    //获取要删除的内容id
    let id = req.query.id || '';
    Message.remove({
        _id: id
    }).then(function(){
        res.json(responseData);
        return;
    });
});
module.exports = router;
