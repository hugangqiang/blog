let mongoose = require('mongoose');

//内容的表结构
module.exports = new mongoose.Schema({
    //内容标题
    title: String,
    //留言用户图标
    userImg: String,
    //关联字段-用户的id
    user: {
        type: String,
        ref: 'User'
    },
    addTime: {
        type: Date,
        default: ''
    },
    //阅读量
    views: {
        type: Number,
        default: 0
    },
    //赞
    laud: {
        type: Number,
        default: 0
    },
    //简介
    description: {
        type: String,
        default: ''
    },
    //标题图片
    titleImg: {
        type: String,
        default: ''
    },
    //内容
    content: {
        type: String,
        default: ''
    },

    //评论
    comments: {
        type: Array,
        default: []
    }
});