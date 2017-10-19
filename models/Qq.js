const mongoose = require('mongoose');
let qqsSchema = require('../schemas/qqs');

module.exports = mongoose.model('qqUser',qqsSchema);