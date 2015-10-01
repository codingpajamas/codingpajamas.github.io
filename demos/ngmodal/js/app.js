'use strict'

angular.module('ngmodal', ['ui.bootstrap'])
	.controller('PageCtrl', function($scope, $modal){
		$scope.persons = [
							{id:1, "name":"FirstName1 Name1", "email":"FirstName1@name.com"},
							{id:1, "name":"FirstName2 Name2", "email":"FirstName2@name.com"},
							{id:1, "name":"FirstName3 Name3", "email":"FirstName3@name.com"},
							{id:1, "name":"FirstName4 Name4", "email":"FirstName4@name.com"},
							{id:1, "name":"FirstName5 Name5", "email":"FirstName5@name.com"}
						];

		$scope.openNameInfo = function(person){
			var nameModalInstance = $modal.open({
				templateUrl: 'partials/namemodal.html',
				controller: 'ModalController',
				size: 'sm',
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