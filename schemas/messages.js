let mongoose = require('mongoose');

//留言的表结构
module.exports = new mongoose.Schema({
    //留言内容
    message: {
        type: String,
        default: ''
    },
    reply: {
        content: String,
        user: String,
        userImg: String,
        addTime: Date
    },
    ip: Object,
    //留言用户图标
    userImg: String,
    //留言用户的名称
    user: String,
    //留言用户的邮箱
    email: String,
    //添加时间
    addTime: {
        type: Date,
        default: ''
    }
});