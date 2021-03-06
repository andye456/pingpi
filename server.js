//********************************************************************//
//   RASPBERRY PI version!!!!!
//********************************************************************//


// This is running on the Raspberry Pi and is used to collect ping data and output it in
// JSON format when the URL is called.

// server.js

console.log("****** Must run as root *******");

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var ping = require ("net-ping");
fs = require('fs');

var appConf = {
	default_gateway: null,
	mask:null,
	ssid:null,
	password:null,
	lanip:null,
	lanport:null,
	extip:null,
	timeperiod:null
};


var appConf = [];

// configuration =================
// connect to mongoDB database on localhost 
var database = require('./config/database');
mongoose.connect(database.url); // url comes from the require above.

// Get connection status
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log('Mongodb connection success!!');
});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// load the routes
require('./app/routes')(app);
//var interval=5000; // default time period

// Currently this is only read at startup when it is called from main body below the function
// need to call it on update of UI
var readConfigFile = function(req,res) {
	
		readConfigFromFile("/home/pi/.pingpirc", function(result) {
				console.log("res from server.js = "+result);
				var jsonVals=JSON.parse(result);
				appConf=jsonVals;
				// listen (start app with node server.js) ======================================
				console.log(">>>"+appConf["default_gateway"]);
				app.listen(appConf["lanport"]);
				console.log("App listening on port "+appConf["lanport"]);

				//interval=appConf["timeperiod"];
				console.log("time set to: "+appConf["timeperiod"])
				setInterval(writePingDataToMongo,appConf["timeperiod"]);
				
		});
}

var echoConfig = function() {
	console.log("Echoing config");
	console.log("length = "+appConf.length);
	for(x in appConf) {
		console.log("appConf["+x+"] = "+appConf[x]);
	}
}

readConfigFile();
echoConfig();


// read the data file with temp val every $timeperiod seconds
//var run = setInterval(writePingDataToMongo,interval); // every 5 seconds


var options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 1,
    sessionId: (process.pid % 65535),
    timeout: 4000,
    ttl: 128
};



var session = ping.createSession(options);

function writePingDataToMongo() {
	console.log("PING!\n");
	var target = "2.127.252.242";
	session.pingHost (target, function (error, target, sent, rcvd) {
	var ms = rcvd - sent;

	if(error) {
		if (error instanceof ping.RequestTimedOutError) {
			//console.log (target + ": Not alive");
			// Only log data if ping has been unsuccessful - only interested if dropped=true
			var pingobj = {'date':getDateTime(), 'dropped':true};		
			// Insert some data into the Mongodb
			db.collection('pingdata').insert(pingobj, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					console.log('Inserted %d documents into the "pingdata" collection. The documents inserted with "_id" are:', result.length, result);
				}
			});
		} else {
			var pingobj = {'date':getDateTime(), 'unreachable':true};
			db.collection('pingdata').insert(pingobj, function (err, result) {
				if (err) {
					console.log(err);
					} else {
						console.log('Inserted %d documents into the "pingdata" collection. The documents inserted with "_id" are:', result.length, result);
					}
			});
		}
	} else {
		//console.log (target + ": Alive (ms=" + ms + ")");

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

    return year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec;

}



