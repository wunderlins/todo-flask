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

TodoApp.factory("globals", function($window, $http) {
	var factory = {
		urls: [];
	};
	
	return factory;
});


TodoApp.factory("node", ["globals", "$http", function(globals, $http) {
	var factory = {
		response: null,
		error: null,
		status: null,
		data: null,
		scope: null
	};
	
	function success_callback(response) {
		factory.response = response;
		factory.data = [];
		factory.status = response.status;
		factory.error = false;
		
		var r = []
		for (e in response.data) {
			el = {name: e, value: response.data[e], mutable: false};
			if (el["name"] == "name" || el["name"] == "comment")
				el.mutable = true;
			r[r.length] = el;
		}
		factory.data = r;
	}

	function error_callback(response) {
		factory.response = response;
		factory.data = [];
		factory.status = response.status;
		factory.error = true;
		console.log("error in node.fetch, result: " + response.statusText)
	}

	factory.fetch = function(id) {
		//console.log(globals.urls.by_id + id)
		$http.get(globals.urls.by_id + id).then(success_callback, error_callback);
	};
	
	return factory;
}]);

function _appController($scope, $window, nodes_service, node, globals) {
	$scope.node = node.data;
	$scope.tree = []

	$scope.$watch(function(){
		return node.response;
	}, function(newValue, oldValue){
		$scope.node = node.data;
	});
	
	$scope.get_all = function() {
		nodes_service.fetch(globals.urls.all, function(response) {
			$scope.items = response.data;
		}, function(response) {
			$scope.last_code = response.status;
			$scope.items = [];
		});	
	}
	
	$scope.get_by_strid = function(strid) {
		var id = strid.substr(1, strid.length)
		node.fetch(id);
	}	
	
	$scope.get_by_id = function(id) {
		node.fetch(id);
	}	
	
	$scope.init = function(u){
		globals.urls = u;
		$scope.get_all();
	}

}
TodoApp.controller("appController", ['$scope', '$window', 'nodes_service', 'node', 'globals', _appController]);
