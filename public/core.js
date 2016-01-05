// public/core.js
// create our angular app and inject ui.bootstrap


/*
How this works....
Basically this is client side Javascript and is called from the HTML
When the buttons are pressed in the UI filterDate() and filterPingData() are called
*/


var beerApp = angular.module('graphApp', ['ui.bootstrap']);
beerApp.controller('GraphCtrl',function($scope, $http, $interval, $timeout, $log) {

	var startDate = new Date();
	var endDate = new Date();
    	$scope.formData = {};
	$scope.pingData = {};

    // when landing on the page, get all beerdata and load into the $scope.beerdata variable

	// Called when index.html is loaded this set the values in the start/end boxes to todays date
	$scope.init = function() {

		$scope.pingData.start=getStartDate(0);
		$scope.pingData.end=getEndDate(0);
		$scope.reloadPingData();
		$scope.totalDropped();
		$scope.readConfig();
	};

	// Bound to the form input
	$scope.config = {
	gatewayip : null,
	mask : null,
	port : null,
	wpasid : null,
	wpapass : null,
	extping : null
	};

	// This is called on startup and whenever the config dropdown is activated
	// it reads the current config and populates the collection above - which are then bound to the form inputs.
	$scope.readConfig = function() {
		// This is just a hard-coded stub, the routes should be called which gets the real values from the files etc.
		
	// Reads from the REST API.
		$http.get('/api/configdata', $scope.config)
			.success(function(data) {
				//$scope.config=data;
				$scope.config.gatewayip = data.default_gateway;
				$scope.config.mask = data.mask;
				$scope.config.wpasid = data.ssid;
				$scope.config.wpapass = data.password;
				$scope.config.lanip = data.lanip;
				$scope.config.port = data.lanport;
				$scope.config.extping = data.extip; // google.com
				$scope.config.timeperiod = data.timeperiod;
				
		});
				
	};


	$scope.writeConfig = function() {
			console.log("write config");
		$http.post('/api/configdata', $scope.config)
		.success(function(data){
		//	$scope.config=data;
		//					alert("written config");
		})
		.error(function(data){
			console.log("Error: "+data);
		});
	};

	// Show/hide the settings dialog	
	$scope.tab = false; 	
	$scope.toggle = function() {
	
		if($scope.tab)
			$scope.tab = false;
		else
			$scope.tab=true;
	};



		// Reloads the page with whatever the start/end boxes are set to

		$scope.reloadPingData = function() {
	        $http.post('/api/pingdata', $scope.pingData)
            .success(function(data) {
					createPingChart(data);
					console.log(data);
					})
						.error(function(data) {
                console.log('Error: ' + data);
					});
		
		};
		
		
		

   // when submitting the add form, send the text to the node API
    $scope.filterPingData = function(diff) {
				$scope.pingData.start = getStartDate(diff);
				$scope.pingData.end = getEndDate(diff);
        $http.post('/api/pingdata', $scope.pingData)
            .success(function(pdata) {
					createPingChart(pdata);
					// if a $scope function is called from this script then need to use $scope
					$scope.totalDropped();
					console.log(pdata);
					})
						.error(function(pdata) {
                console.log('Error: ' + pdata);
					});
				

    };

		$scope.totalDropped = function() {
	        $http.post('/api/dropped', $scope.pingData)
            .success(function(data) {
					$scope.fails = data;
					console.log(data);
					})
						.error(function(data) {
                console.log('Error: ' + data);
					});

		}


	// Create the c3 chart from the data read from the REST call to /api/beerdata
	var createPingChart = function(pdata) {
		// This sets beerdata so that it can be used in the HTML page as beerdata
	//	$scope.pingdata = pdata;
		$scope.pingchart = c3.generate({
			bindto: '#pingchart',
			data: {
    			xFormat: '%Y-%m-%dT%H:%M:%S', // This must go here
				// Uses the JSON data returned in callback from the URL /api/beerdata
				json: pdata,

				keys: {
						x: 'date', // This is the x-axis values
	  				value: ['dropped','unreachable'] // This is the y-axis values
				},
				types: {
					['dropped']: 'bar',
					['unreachable']: 'bar'
				},
				color: { ['dropped']: function(color, d) {
    			var color = d3.rgb("#55AAFF");
    			if (d.index % 2 == 0) {
      			color = color.darker(1.2);
    			}
    			return color;
  			},
				['unreachable']: '#ff0000'
				}
			},
				bar: {
		    width: 10
    	},
    	
			axis: {
				x: {
					type: 'timeseries',
					label: 'Date/time',
					tick: {
						format: '%Y-%m-%d %H:%M:%S',
						rotate: 90
						//fit: true
						//count: 10
						
					}					
				}
			},
    	zoom: {
      	enabled: true,
      	rescale: true,
      	extent: [1, 100]
    	}
		});
		
	}

	var period=0;

	var getStartDate = function(diff) {
	  period=period+diff
		if(diff==999) {
			period=0;
		}
		var date = new Date(new Date().setDate(new Date().getDate()+period));

		var year = date.getFullYear();

		var month = date.getMonth() + 1;
		month = (month < 10 ? "0" : "") + month;

		var day  = date.getDate();
		day = (day < 10 ? "0" : "") + day;

		return year + "-" + month + "-" + day + "T00:00:00";

	}

	var getEndDate = function(diff) {
		var date = new Date(new Date().setDate(new Date().getDate()+period));

		var year = date.getFullYear();

		var month = date.getMonth() + 1;
		month = (month < 10 ? "0" : "") + month;

		var day  = date.getDate();
		day = (day < 10 ? "0" : "") + day;

		return year + "-" + month + "-" + day + "T23:59:59";

	}

});


