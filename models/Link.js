var mongoose = require('mongoose');
var linksSchema = require('../schemas/links');

module.exports = mongoose.model('Link',linksSchema);