var mongoose = require('mongoose');

//友情链接的表结构
module.exports = new mongoose.Schema({
    logo: String,
    name: String,
    href: String
});