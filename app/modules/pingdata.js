// { date: '2015:08:03:22:11:01',
//   dropped: Boolean,
//   unreachable: Boolean }

var mongoose = require('mongoose');

var schema = new mongoose.Schema({ date: String, dropped: Boolean, unreachable: Boolean },{ collection: 'pingdata' });
module.exports = mongoose.model('pingdata', schema);

