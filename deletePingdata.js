//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var assert = require('assert');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://192.168.1.17:27017/beerdata';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);
    deleteData(db, function() {
      db.close();
    });
  }
});

var deleteData = function(db, callback) {
	db.collection('beerdata').remove();
}

