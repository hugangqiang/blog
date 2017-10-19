const mongoose = require('mongoose');
let ipsSchema = require('../schemas/ips');

module.exports = mongoose.model('IP',ipsSchema);