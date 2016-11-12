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

function appController($scope) {
  $scope.items = [
    {name: "name 1", location: "location 1"},
    {name: "name 3", location: "location 3"},
    {name: "name 2", location: "location 2"}
  ];
};

TodoApp.controller("appController", appController);
