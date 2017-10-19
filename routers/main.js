
let express = require('express');
let router = express.Router();

//数据表
const User = require('../models/User');
const Content = require('../models/Content');
const Message = require('../models/Message');
//处理通用数据
let data;
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo
    };
    Content.find().limit( 3 ).sort({
        laud: -1
    }).then(function( lauds ){
        data.lauds = lauds;
    });
    Message.find().limit( 3 ).sort({
        addTime: -1
    }).then(function( Message ){
        data.messageNews = Message;
    });
    next();
});
//首页
router.get('/', function(req, res, next){
    data.count = 0;
    data.page = Number( req.query.page || 1 );
    data.limit = 15;
    data.pages = 0;
    let where = {};
    Content.where( where ).count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);

        let skip = (data.page - 1) * data.limit;
        return Content.where( where ).find().limit( data.limit ).skip( skip ).sort({
            addTime: -1
        });
    }).then(function (contents) {
        data.contents = contents;
        res.render('main/index',data);
    })
});

//留言
router.get('/message',function(req,res,next){
    res.render('main/message',data);
});
//关于
router.get('/about',function(req,res,next){
    res.render('main/about',data);
});

//文章内页
router.use('/v',function(req,res,next){
    let contentId = req.originalUrl.slice(3);

    
    Content.findOne({
        _id: contentId
    }).then(function ( content ) {
        Content.find().limit( 3 ).sort({
            laud: -1
        }).then(function( lauds ){
            return lauds;
        }).then(function(lauds){
            Message.find().limit( 3 ).sort({
                addTime: -1
            }).then(function( Message ){
                return Message;
            }).then(function(messageNews){
                res.render('main/view',{
                    content: content,
                    lauds: lauds,
                    messageNews: messageNews,
                    userInfo: req.userInfo
                });
            });
        });
        
    });

});
//找回密码
router.get('/findpass',function(req,res,next){
    res.render('main/findpass',data);
});

module.exports = router;
