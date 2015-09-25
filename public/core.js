// public/core.js
// create our angular app and inject ui.bootstrap


/*
How this works....
Basically this is client side Javascript and is called from the HTML
When the buttons are pressed in the UI filterDate() and filterPingData() are called
*/


var beerApp = angular.module('graphApp', ['ui.bootstrap']);
beerApp.controller('GraphCtrl',function($scope, $http, $interval, $timeout) {

	var startDate = new Date();
	var endDate = new Date();
    	$scope.formData = {};
	$scope.pingData = {};

    // when landing on the page, get all beerdata and load into the $scope.beerdata variable

	// Called when index.html is loaded this set the values in the start/end boxes to todays date
	$scope.init = function() {
//		$scope.formData.start=getStartDate(0);
//		$scope.formData.end=getEndDate(0);
//		$scope.reload();
		$scope.pingData.start=getStartDate(0);
		$scope.pingData.end=getEndDate(0);
		$scope.reloadPingData();
		$scope.totalDropped();
	};

		// This should load the page with todays date when the page is first opened
//    $http.get('/api/beerdata')
//        .success(function(data) {
//			createChart(data);
//		})
//        .error(function(data) {
//            console.log('Error: ' + data);
//
//    });

		// Reloads the page with whatever the start/end boxes are set to
		$scope.reload = function() {
	        $http.post('/api/beerdata', $scope.formData)
            .success(function(data) {
					createChart(data);
					console.log(data);
					})
						.error(function(data) {
                console.log('Error: ' + data);
					});
		
		};

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
    $scope.filterData = function(diff) {
				$scope.formData.start = getStartDate(diff);
				$scope.formData.end = getEndDate(diff);
        $http.post('/api/beerdata', $scope.formData)
            .success(function(data) {
					createChart(data);
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
	var createChart = function(data) {
		// This sets beerdata so that it can be used in the HTML page as beerdata
		//$scope.beerdata = data;
		$scope.chart = c3.generate({
			bindto: '#chart',
			data: {
    			xFormat: '%Y-%m-%dT%H:%M:%S', // This must go here
				// Uses the JSON data returned in callback from the URL /api/beerdata
				json: data,

				keys: {
						x: 'date', // This is the x-axis values
	  					value: ['temp'] // This is the y-axis values
				},

			},
			axis: {
				x: {
					type: 'timeseries',
					label: 'Date/time',
					tick: {
						format: '%Y-%m-%d %H:%M:%S',
						rotate: 90
					}					
				}
			}
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
	  				value: ['dropped'] // This is the y-axis values
				},
				types: {
					['dropped']: 'bar'
				}
						
			},
			axis: {
				x: {
					type: 'timeseries',
					label: 'Date/time',
					tick: {
						format: '%Y-%m-%d %H:%M:%S',
						rotate: 90,
						culling: {
							max: 10
						}
						
					}					
				}
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


