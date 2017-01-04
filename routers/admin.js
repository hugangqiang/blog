
var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var Message = require('../models/Message');
var Link = require('../models/Link');

router.use(function(req,res,next){
    if( !req.userInfo.isAdmin ){
        res.render('admin/prevent');
        return;
    }
    next();
});



//首页
router.get('/', function(req, res, next){
    res.render('admin/index',{
        userInfo: req.userInfo
    })
});
//用户管理
router.get('/user',function (req, res) {
    //从数据库中读取所有用户数据
    //limit(Number):限制获取的数据条数
    //skip(1):忽略数据的条数

    var page = Number( req.query.page || 1 );
    var limit = 10;
    var pages = 0;

    User.count().then(function (count) {

        //计算总页数
        pages = Math.ceil( count/limit );
        //取值不超过pages
        page = Math.min( page, pages );
        //取值不小于1
        page = Math.max( page, 1 );
        var skip = (page - 1)*limit;

        User.find().sort({ _id: -1 }).limit(limit).skip(skip).then( function( users ){
            res.render('admin/user_index',{
                userInfo: req.userInfo,
                users: users,

                count: count,
                limit: limit,
                pages: pages,
                page: page,
                admin: 'user'
            })
        });
    })
});
//修改用户
router.get('/user/edit',function (req, res) {
    //获取要修改的用户的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    //获取要用户的信息
    User.findOne({
        _id: id
    }).then(function (user) {
        if( !user ){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '用户不存在'
            });
        }else{
            res.render('admin/user_edit',{
                userInfo: req.userInfo,
                user: user
            });
        }
    });
});
//用户的修改保存
router.post('/user/edit',function (req, res) {

    //获取要修改的用户的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    //获取post提交过来的用户名
    var username = req.body.username || '';

    //当用户信息是否为空
    if( req.body.userImg == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '用户图标不能为空'
        });
        return;
    }
    //当用户名称是否为空
    if( req.body.username == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '用户名不能为空'
        });
        return;
    }
    if( req.body.password == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '密码不能为空'
        });
        return;
    }
    //获取要修改的用户信息
    User.findOne({
        _id: id
    }).then(function (user) {
        if (user) {
            //要修改的分类名称是否已经在数据库中存在
            return User.findOne({
                _id: {$ne: id},
                username: username
            });
        }
    }).then(function (sameUser) {
        if( sameUser ){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名用户'
            });
            return Promise.reject();
        }else{
            return User.update({
                _id: id
            },{
                userImg: req.body.userImg,
                username: req.body.username,
                password: req.body.password,
                isAdmin: req.body.isAdmin
            });
        }
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/user'
        });
    })
});
//用户删除
router.get('/user/del', function (req, res) {
    //获取要删除的分类id
    var id = req.query.id || '';

    User.remove({
        _id: id
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/user'
        });
    });
});
//分类首页
router.get('/category',function (req, res) {

    var page = Number( req.query.page || 1 );
    var limit = 10;
    var pages = 0;

    Category.count().then(function (count) {

        //计算总页数
        pages = Math.ceil( count/limit );
        //取值不超过pages
        page = Math.min( page, pages );
        //取值不小于1
        page = Math.max( page, 1 );
        var skip = (page - 1)*limit;
        //sort()排序，1升序，-1降序
        Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then( function( categories ){
            res.render('admin/category_index',{
                userInfo: req.userInfo,
                categories: categories,

                count: count,
                limit: limit,
                pages: pages,
                page: page,
                admin: 'category'
            })
        });
    })
});
//分类添加
router.get('/category/add',function (req, res) {

    res.render('admin/category_add',{
        userInfo: req.userInfo
    });
});
//分类的保存
router.post('/category/add',function(req, res){

    var name = req.body.name || '';

    if( name == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return;
    }
    //数据库中是否已经存在同名称
    Category.findOne({
        name: name
    }).then(function (rs) {
        if(rs){
            //数据库中已经存在该类了
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类已经存在了'
            });
            return Promise.reject();
        }else{
            //不存在可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then(function( newCategory ){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        });
    });
});
//分类修改
router.get('/category/edit',function (req, res) {
    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {
        if( !category ){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        }else{
            res.render('admin/category_edit',{
                userInfo: req.userInfo,
                category: category
            });
        }
    });
});
//分类的修改保存
router.post('/category/edit',function (req, res) {
    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';
    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            //当用户是否有修改
            if( name == category.name ){
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            }else{
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function (sameCategory) {
        if( sameCategory ){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            });
            return Promise.reject();
        }else{
            return Category.update({
                _id: id
            },{
                name: name
            });
        }
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })
});
//分类删除
router.get('/category/del', function (req, res) {
    //获取要删除的分类id
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    });
});
//内容首页
router.get('/content',function(req, res){

    var page = Number( req.query.page || 1 );
    var limit = 10;
    var pages = 0;

    Content.count().then(function (count) {

        //计算总页数
        pages = Math.ceil( count/limit );
        //取值不超过pages
        page = Math.min( page, pages );
        //取值不小于1
        page = Math.max( page, 1 );
        var skip = (page - 1)*limit;
        //sort()排序，1升序，-1降序
        Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate('category').then( function( contents ){
            res.render('admin/content_index',{
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                limit: limit,
                pages: pages,
                page: page,
                admin: 'content'
            })
        });
    })
});
//内容添加
router.get('/content/add',function(req, res){
    Category.find().sort({_id: -1}).then(function (categories) {
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories: categories
        })
    });
});
//内容保存
router.post('/content/add',function (req, res) {
    if( req.body.category == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }
    if( req.body.title == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }
    if( req.body.description == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容简介不能为空'
        });
        return;
    }
    if( req.body.content == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容不能为空'
        });
        return;
    }

    //保存数据到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        userImg: req.userInfo.userImg,
        user: req.userInfo.username,
        description: req.body.description,
        content: req.body.content
    }).save().then(function (rs) {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        });
    });
});
//修改内容
router.get('/content/edit',function (req, res) {
    var id = req.query.id || '';
    var categories = [];

    Category.find().sort({_id: -1}).then(function (rs) {
        categories = rs;
        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function (content) {
        if(!content){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '指定内容不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo: req.userInfo,
                categories: categories,
                content: content
            });
        }
    });
});
//保存修改内容
router.post('/content/edit',function (req, res) {
    var id = req.query.id || '';
    if( req.body.category == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        });
        return;
    }
    if( req.body.title == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }
    if( req.body.description == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容简介不能为空'
        });
        return;
    }
    if( req.body.content == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容不能为空'
        });
        return;
    }
    Content.update({
        _id: id
    },{
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function () {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    });
});
//内容删除
router.get('/content/del',function(req, res){
    //获取要删除的内容id
    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    });
});
//留言首页
router.get('/message',function (req, res) {
    //从数据库中读取所有用户数据
    //limit(Number):限制获取的数据条数
    //skip(1):忽略数据的条数

    var page = Number( req.query.page || 1 );
    var limit = 10;
    var pages = 0;

    Message.count().then(function (count) {

        //计算总页数
        pages = Math.ceil( count/limit );
        //取值不超过pages
        page = Math.min( page, pages );
        //取值不小于1
        page = Math.max( page, 1 );
        var skip = (page - 1)*limit;

        Message.find().sort({
            addTime: -1
        }).limit(limit).skip(skip).then( function( messages ){
            res.render('admin/message_index',{
                userInfo: req.userInfo,
                messages: messages,
                count: count,
                limit: limit,
                pages: pages,
                page: page,
                admin: 'message'
            })
        });
    })
});
//留言回复
router.get('/message/reply',function(req, res){
    res.render('admin/message_reply',{
        userInfo: req.userInfo
    })
});
//留言回复保存
router.post('/message/reply',function (req, res) {
    var id = req.query.id || '';
    if( req.body.reply == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '回复内容不能为空'
        });
        return;
    }
    //保存数据到数据库
    Message.update({
        _id: id
    },{
        reply: req.body.reply
    }).then(function () {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/message'
        })
    });
});
//留言删除
router.get('/message/del',function(req, res){
    //获取要删除的内容id
    var id = req.query.id || '';

    Message.remove({
        _id: id
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/message'
        });
    });
});

//友链首页
router.get('/link',function(req, res){

    var page = Number( req.query.page || 1 );
    var limit = 10;
    var pages = 0;

    Link.count().then(function (count) {

        //计算总页数
        pages = Math.ceil( count/limit );
        //取值不超过pages
        page = Math.min( page, pages );
        //取值不小于1
        page = Math.max( page, 1 );
        var skip = (page - 1)*limit;
        //sort()排序，1升序，-1降序
        Link.find().sort({ _id: -1 }).limit(limit).skip(skip).then( function( links ){
            res.render('admin/link_index',{
                userInfo: req.userInfo,
                links: links,
                count: count,
                limit: limit,
                pages: pages,
                page: page,
                admin: 'link'
            })
        });
    })
});
//友链添加
router.get('/link/add',function(req, res){
    res.render('admin/link_add',{
        userInfo: req.userInfo
    })
});
//友链保存
router.post('/link/add',function (req, res) {
    if( req.body.logo == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '请上传友链logo'
        });
        return;
    }
    if( req.body.name == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '友链名称不能为空'
        });
        return;
    }
    if( req.body.href == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '友链链接不能为空'
        });
        return;
    }
    //保存数据到数据库
    new Link({
        logo: req.body.logo,
        name: req.body.name,
        href: req.body.href
    }).save().then(function (rs) {
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/link'
        });
    });
});
//友链删除
router.get('/link/del',function(req, res){
    //获取要删除的内容id
    var id = req.query.id || '';

    Link.remove({
        _id: id
    }).then(function(){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/link'
        });
    });
});
module.exports = router;
