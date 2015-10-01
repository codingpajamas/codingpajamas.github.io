'use strict'

angular.module('ngmodal', ['ui.bootstrap'])
	.controller('PageCtrl', function($scope, $modal){
		$scope.persons = [
							{id:1, "name":"Test1 Name1", "email":"test1@name.com"},
							{id:1, "name":"Test2 Name2", "email":"test2@name.com"},
							{id:1, "name":"Test3 Name3", "email":"test3@name.com"},
							{id:1, "name":"Test4 Name4", "email":"test4@name.com"},
							{id:1, "name":"Test5 Name5", "email":"test5@name.com"}
						];

		$scope.openNameInfo = function(person){
			var nameModalInstance = $modal.open({
				templateUrl: 'partials/namemodal.html',
				controller: 'ModalController',
				resolve: {
					selectedPerson: function () {
					  return person;
					}
				}
			});

			nameModalInstance.result.then(function(selectedPerson){
				$scope.selectedPerson = selectedPerson;
			});
		}
	})
	.controller('ModalController', function($scope, $modalInstance, selectedPerson){
		$scope.person = selectedPerson;
		$scope.modalClose = function(){
			$modalInstance.dismiss('cancel');
		}
	})