//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var assert = require('assert');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://192.168.1.17:27017/beerdata';
//var url = 'mongodb://192.168.1.17:27017/pingdata';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);
    getBeerTemp(db, function() {
      db.close();
    });
  }
});

var deleteData = function(db, callback) {
	//db.collection('beerdata').remove();
	db.collection('pingdata').remove();
}

var getBeerTemp = function(db, callback) {
   //var cursor =db.collection('beerdata').find( );
   var cursor =db.collection('pingdata').find( );
   console.log('getting data');
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
        callback();
      }
   });
};

var setBeerTemp = function(db, callback) {
    // Get the documents collection
    //var collection = db.collection('beertemp');
    var collection = db.collection('pingdate');

    //Create some data

    var date1=getDateTime();

    var temp1obj = {"date": date1, temp: 22.5};
    var temp2obj = {"date": date1, temp: 22.0};
    var temp3obj = {"date": date1, temp: 22.35};

    // Insert some data
    db.collection('beerdata').insertOne(temp3obj, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "beertemp" collection. The documents inserted with "_id" are:', result.length, result);
      }
    });

};



function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;

}
