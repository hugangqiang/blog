var mongoose = require('mongoose');

//留言的表结构
module.exports = new mongoose.Schema({
    //留言内容
    message: {
        type: String,
        default: ''
    },
    reply: {
        type: String,
        default: ''
    },
    //留言用户图标
    userImg: String,
    //留言用户的名称
    user: String,
    //添加时间
    addTime: {
        type: Date,
        default: ''
    }
});