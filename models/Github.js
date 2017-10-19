const mongoose = require('mongoose');
let githubsSchema = require('../schemas/githubs');

module.exports = mongoose.model('gitUser',githubsSchema);