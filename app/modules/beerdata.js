// { date: '2015:08:03:22:11:01',
//   temp: 22 }
var mongoose = require('mongoose');

var schema = new mongoose.Schema({ date: String, temp: Number },{ collection: 'beerdata' });
module.exports = mongoose.model('beerdata', schema);

