// { date: '2015:08:03:22:11:01',
//   success: true,
//   pingtime: 230 }

var mongoose = require('mongoose');

var schema = new mongoose.Schema({ date: String, dropped: Boolean },{ collection: 'pingdata' });
module.exports = mongoose.model('pingdata', schema);

