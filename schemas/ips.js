const mongoose = require('mongoose');

//ip的表结构
module.exports = new mongoose.Schema({
    //ip
    cip: String,
    cname: String,
    cid: String

});