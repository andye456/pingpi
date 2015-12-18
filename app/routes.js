// Routes ==================================================
// api ---------------------------------------------------------------------
// get the pingdata schema def
var ping = require('./modules/pingdata');
// get the config schema def
var conf = require('./modules/configdata');

console.log('routes loaded');
module.exports = function(app) {


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
	
	// This queries the db to find out how many dropped = true.
	var getDropped = function(req,res) {
		if (req.body.start != "" && req.body.end != "") {
			ping.find(
				{ date : { $gte: req.body.start, $lt: req.body.end },
				   $or: [ {dropped: true}, {unreachable: true} ] 
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
		
	
	// place holder for getting the config
	var getConfig = function(req,res) {
		console.log("getting config");
		/*
		conf.find(function(err,c) {
			if(err) {
				console.log("Delete error "+err);
			} else {
				res.json(c);
			}
		});
		*/
		res.json(readConfigFromFile());
	}
	
	// Called from post function below
	var	setConfig = function(req,res) {
		conf.create({

			gatewayip   :	req.body.gatewayip,
			mask		:	req.body.mask,
			port		:	req.body.port,
			wpasid		:	req.body.wpasid,
			wpapass		:	req.body.wpapass,
			extping		:	req.body.extping,
			timeperiod	:	req.body.timeperiod
		}, 
		function(err,config) {
			if(err)
				console.log("Error"+err);
		
			console.log("gatewayip   :"	+req.body.gatewayip	+"\nmask		:"	+req.body.mask+"\nport		:"	+req.body.port+"\nwpasid		:"	+req.body.wpasid+"\nwpapass		:"	+req.body.wpapass+"\nextping		:"	+req.body.extping+"\ntimeperiod	:"	+req.body.timeperiod);
		
			
		});
	}
	
	// polace holder for setting the config
	// gatewayip,mask,port,wpasid,wpapass,extping
	app.post('/api/configdata', function(req,res) {
		setConfig(req,res);
	});
	
	
	app.get('/api/configdata', function(req,res) {
	
		var filename="/home/pi/.pingpirc-test";
		var strVals="{";
		fs.readFile(filename, 'utf8', function(err, data) {
			if (err) throw err;
			//console.log('OK: ' + filename);
			var lines = data.split('\n');
			for(var line = 0; line < lines.length-1; line++){
				var vals=lines[line].split("=");

				//console.log("line"+line+" "+lines[line]);
				//console.log("key = "+vals[0]+" val="+vals[1]);
				if(line != lines.length-2)
					strVals+="\"" +vals[0]+ "\":\"" +vals[1]+ "\",";
				else
					strVals+="\"" +vals[0]+ "\":\"" +vals[1]+ "\"";
					
			}
			strVals+="}";
			var jsonVals=JSON.parse(strVals);
			console.log(jsonVals);
			res.json(jsonVals);
			//console.log(data)
		});	
	
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
	
	app.get('/api/dropped/', function(req,res) {
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

