var mongoose = require('mongoose');
var messagesSchema = require('../schemas/messages');

module.exports = mongoose.model('Message',messagesSchema);