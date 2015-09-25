// Routes ==================================================
// api ---------------------------------------------------------------------
    // get all todos
// get the beerdata schema definition
var data = require('./models/beerdata');
var ping = require('./models/pingdata');

console.log('routes loaded');
module.exports = function(app) {


	var getFromMongo = function(req,res) {
		// If the values of the start and end dates are set in the UI then apply them to the database search
		if (req.body.start != "" && req.body.end != "") {
			data.find(
				{ date : { $gte: req.body.start, $lt: req.body.end } },
			 	function(err, beervals) {

				if (err) {
					res.send(err);
					console.log(err);
					} else {
						res.json(beervals);
					}			
			});
		} else {
			data.find(
				function(err, beervals) {
				
				if (err) {
					res.send(err);
					console.log(err);
				} else {
					res.json(beervals);				
				}
			});
		}

	};

	var getPingFromMongo = function(req,res) {
		// If the values of the start and end dates are set in the UI then apply them to the database search
		if (req.body.start != "" && req.body.end != "") {
			ping.find(
				{ date : { $gte: req.body.start, $lt: req.body.end } },
			 	function(err, pingvals) {

				if (err) {
					res.send(err);
					console.log(err);
					} else {
						res.json(pingvals);
					}			
			});
		} else {
			ping.find(
				function(err, pingvals) {
				
				if (err) {
					res.send(err);
					console.log(err);
				} else {
					res.json(pingvals);				
				}
			});
		}

	};
	
	// This queries the db to find out how many ping have a 0 pingtime as this means that it failed.
	var getDropped = function(req,res) {
		if (req.body.start != "" && req.body.end != "") {
			ping.find(
				{ date : { $gte: req.body.start, $lt: req.body.end },
				  pingtime: 0
				},
			 	function(err, pingvals) {

				if (err) {
					res.send(err);
					console.log(err);
				} else {
					res.json(pingvals);
				}			
			});
		}
	}

	app.get('/api/beerdata', function(req, res) {
		getFromMongo(req,res);
	});
	
	// Will send the time values back to the server to filter the data returned from the database.
	app.post('/api/beerdata/', function(req,res) {
		getFromMongo(req,res);
	});

	app.get('/api/pingdata/', function(req,res) {
		getPingFromMongo(req,res);
	});	

	app.post('/api/pingdata/', function(req,res) {
		getPingFromMongo(req,res);
	});
	
	app.post('/api/dropped/', function(req,res) {
		getDropped(req,res);
	});
    // application -------------------------------------------------------------

	app.get('*', function(req, res) {
		// load the single view file (angular will handle the page changes on the front-end)
		res.sendfile('../public/index.html'); 
    });
/*
	app.use(function(req,res,next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
    });
*/
};

