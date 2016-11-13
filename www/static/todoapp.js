/* 
 * License: GPL2
 * Author: Simon Wunderlin
 * Copyright, 2015, simon Wunderlin
 */
var TodoApp = angular.module("TodoApp", []);

// prevent collision with flask template variable notation which 
// also uses {{ and }}
TodoApp.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
});

TodoApp.factory("nodes_service", function($window, $http) {
	var factory = {};
	var items = {};
	
	factory.fetch_all = function(url, callback) {
		$http.get(url).success(callback);
	};
	
	return factory;
});

function _appController($scope, $window, nodes_service) {
	console.log(url_getcy)
	$scope.getnode = url_getcy;
	$scope.get_all = function() {
		nodes_service.fetch_all('/_/get/cy', function(data) {
			$scope.items = data;
		});	
	}
	
	//$scope.get_all();
}
TodoApp.controller("appController", ['$scope', '$window', 'nodes_service', _appController]);
