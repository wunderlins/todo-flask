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
		
	factory.fetch = function(url, callback, err_callback) {
		$http.get(url).then(callback, err_callback);
	};
	
	return factory;
});

function _appController($scope, $window, nodes_service) {
	$scope.last_code = 0;
	$scope.get_all = function() {
		nodes_service.fetch($scope.urls.all, function(response) {
			$scope.items = response.data;
		}, function(response) {
			$scope.last_code = response.status;
			console.log(response)
			$scope.items = []
		});	
	}
	
	$scope.get_by_id = function(id) {
		nodes_service.fetch($scope.urls.by_id + id, function(response) {
			var data = response.data;
			var r = []
			for (e in data) {
				el = {name: e, value: data[e], mutable: false};
				if (el["name"] == "name" || el["name"] == "comment")
					el.mutable = true;
				r[r.length] = el;
			}
			$scope.item = r;
		}, function(response) {
			$scope.item = [];
			$scope.last_code = response.status;
			console.log(response)
		});	
	}	
	
	$scope.init = function(u){
		$scope.urls = u;
		$scope.get_all();
	}
	
	$scope.item = []
	
}
TodoApp.controller("appController", ['$scope', '$window', 'nodes_service', _appController]);
