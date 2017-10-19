const mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({
    //用户名
    userName: String,
    password: String,
    userEmail: String,
    qq: String,
    github: String,
    isAdmin: {
        type: String,
        default: 'author'
    },
    //注册时间
    addTime: {
        type: Date,
        default: ''
    },
    userImg: String
});