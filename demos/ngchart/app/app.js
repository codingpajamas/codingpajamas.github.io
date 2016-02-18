'use strict'

var app = angular.module('d3App', [])

app.service('Data', function($http, $q){
	this.get = function(){
		var deferred = $q.defer();

		$http.get('/demos/ngchart/data/db.json')
			.then(function(json){
				deferred.resolve(json.data);
			}, function(){
				deferred.reject();
			}
		);

		return deferred.promise;
	}
});

app.controller('MainCtrl', ['$scope', 'Data', function($scope, Data){
	$scope.resultData = [];
	$scope.superData = [];
	$scope.superKeys = [];

	Data.get().then(function(data){
		$scope.superData = data.superdata; 
		$scope.superKeys = _.keys(_.head($scope.superData)); 
		
		
	});


}]);