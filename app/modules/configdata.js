// { date: '2015:08:03:22:11:01',
//   dropped: Boolean,
//   unreachable: Boolean }

var mongoose = require('mongoose');

var schema = new mongoose.Schema({date:String, gatewayip:String, mask:String, port:String, wpasid: String, wpapass: String, extping: String, timeperiod: String});
module.exports = mongoose.model('configdata', schema);

