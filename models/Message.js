const mongoose = require('mongoose');
let messagesSchema = require('../schemas/messages');

module.exports = mongoose.model('Message',messagesSchema);