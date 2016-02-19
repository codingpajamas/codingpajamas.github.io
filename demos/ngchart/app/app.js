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

		console.log(data)

		$scope.superData = data.superdata; 
		$scope.superKeys = _.keys(_.head($scope.superData)); 
		
		
	});


}]);





/*
var idata = [];
$('#usersbycountry tbody tr').each(function(){ 
    idata.push({'name':$.trim($(this).find('td:nth-child(2)').text()), 'users':$.trim($(this).find('td:nth-child(3)').text()), 'population':$.trim($(this).find('td:nth-child(6)').text())});
})
document.write(JSON.stringify(idata))
*/