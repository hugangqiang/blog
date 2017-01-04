
var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');
var Link = require('../models/Link');
var Message = require('../models/Message');

//处理通用数据
var data;
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: [],
        news: []
    };
    Category.find().then(function (categories) {
        data.categories = categories;
    });
    Content.find().limit( 5 ).populate(['category']).sort({
        addTime: -1
    }).then(function( news ){
        data.news = news;
    });
    Link.find().then(function (links) {
        data.links = links;
    });
    Message.find().limit( 5 ).sort({
        addTime: -1
    }).then(function( Message ){
        data.messageNews = Message;
        next();
    });
});

//首页
router.get('/',function(req,res,next){
    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number( req.query.page || 1 );
    data.limit = 15;
    data.pages = 0;

    var where = {};
    if( data.category ){
        where.category = data.category;
    }
   //读取所有的分类信息
   Content.where( where ).count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);

        var skip = (data.page - 1) * data.limit;
        return Content.where( where ).find().limit( data.limit ).skip( skip ).populate(['category']).sort({
            addTime: -1
        });

   }).then(function (contents) {
       data.contents = contents;
       res.render('main/index',data);
   })
});
//首页内容评论
router.get('/view',function (req, res) {
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).populate(['category']).then(function ( content ) {
        data.content = content;

        content.views++;
        content.save();

        res.render('main/view',data);
    });
});

//关于
router.get('/about',function(req,res,next){
    res.render('main/about', data);
});

//留言
router.get('/contact',function(req,res,next){
    res.render('main/contact', data);
});

//服务
router.get('/serve',function(req,res,next){
    res.render('main/serve', data);
});

//处理404
router.get('*',function(req,res,next){
    res.render('main/404', data);
});
module.exports = router;
