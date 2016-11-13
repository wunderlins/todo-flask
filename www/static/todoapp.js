/* 
 * License: GPL2
 * Author: Simon Wunderlin
 * Copyright, 2015, simon Wunderlin
 */
"use strict";
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
		urls: []
	};
	
	return factory;
});

TodoApp.factory("node", ["globals", "$http", function(globals, $http) {
	var factory = {
		response: null,
		error: null,
		data: null
	};
	
	function success_callback(response) {
		factory.response = response;
		factory.data = [];
		factory.error = false;
		
		var r = [];
		var e, el = null;
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
		factory.error = true;
		console.log("error in node.fetch, result: " + response.statusText)
	}

	factory.fetch = function(id) {
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
			$scope.tree = response.data;
		}, function(response) {
			$scope.tree = [];
		});	
	}
	
	$scope.get_by_id = function(id) {
		if (id.substr(0, 1) == 'n') // handle string ids starting with 'n'
			var id = id.substr(1, id.length)
		node.fetch(id);
	}	
	
	$scope.init = function(u){
		globals.urls = u;
		$scope.get_all();
	}

}
TodoApp.controller("appController", ['$scope', '$window', 'nodes_service', 'node', 'globals', _appController]);
