'use strict'

angular.module('ngmodal', ['ui.bootstrap'])
	.controller('PageCtrl', function($scope, $modal){
		$scope.testnames = [
							{id:1, "name":"Test1 Name1", "email":"test1@name.com"},
							{id:1, "name":"Test2 Name2", "email":"test2@name.com"},
							{id:1, "name":"Test3 Name3", "email":"test3@name.com"},
							{id:1, "name":"Test4 Name4", "email":"test4@name.com"},
							{id:1, "name":"Test5 Name5", "email":"test5@name.com"}
						];

		$scope.openNameInfo = function(name){
			var nameModalInstance = $modal.open({
				templateUrl: 'partials/namemodal.html',
				controller: 'ModalController',
				resolve: {
					selectedName: function () {
					  return name;
					}
				}
			});

			nameModalInstance.result.then(function(selectedName){
				$scope.selectedName = selectedName;
			});
		}
	})
	.controller('ModalController', function($scope, $modalInstance, selectedName){
		$scope.selectedName = selectedName;
		$scope.modalClose = function(){
			$modalInstance.dismiss('cancel');
		}
	})