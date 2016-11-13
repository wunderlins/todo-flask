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
	
	factory.getItems = function(callback) {
		$http.get('/_/get/cy').success(callback);
	};
	
	return factory;
});

TodoApp.controller("appController", function appController($scope, $window, nodes_service) {
	//$scope.items = nodes_service.getItems();
	nodes_service.getItems(function(data) {$scope.items = data;});
});
