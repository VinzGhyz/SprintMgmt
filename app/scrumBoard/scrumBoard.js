'use strict';

angular.module('sprintMgmt.scrumBoard', ['ngRoute', 'dndLists', 'LocalStorageModule'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/scrum-board', {
		templateUrl: 'scrumBoard/scrumBoard.html',
		controller: 'scrumBoardCtrl'
	});
}])

.controller('scrumBoardCtrl', ['$scope', '$timeout', 'ScrumBoardTitle', 'ScrumBoardModel', function($scope, $timeout, ScrumBoardTitle, ScrumBoardModel) {
	
	$scope.title = ScrumBoardTitle.title;
	$scope.editingTitle = false;
	ScrumBoardTitle.bind($scope);

	$scope.editTitle = function() {
		$scope.editingTitle = true;
		$timeout(function() { angular.element(document.getElementsByClassName('sprint-title-edit')).focus(); });
	};

	$scope.models = ScrumBoardModel.models;
	$scope.$on('ScrumBoardModel::dataAcquired', function() { ScrumBoardModel.bind($scope); });

	/**
	 * dnd-dragging determines what data gets serialized and send to the receiver
	 * of the drop. While we usually just send a single object, we send the array
	 * of all selected items here.
	 */
	 $scope.getSelectedItemsIncluding = function(list, item) {
		item.selected = true;
		return list.items.filter(function(item) { return item.selected; });
	};

	/**
	 * We set the list into dragging state, meaning the items that are being
	 * dragged are hidden. We also use the HTML5 API directly to set a custom
	 * image, since otherwise only the one item that the user actually dragged
	 * would be shown as drag image.
	 */
	 $scope.onDragstart = function(list, event) {
		 list.dragging = true;
		 event.dataTransfer.effectAllowed = "all";
	 };

	/**
	 * In the dnd-drop callback, we now have to handle the data array that we
	 * sent above. We handle the insertion into the list ourselves. By returning
	 * true, the dnd-list directive won't do the insertion itself.
	 */
	 $scope.onDrop = function(list, items, index) {
		angular.forEach(items, function(item) { item.selected = false; });
		list.items = list.items.slice(0, index)
								.concat(items)
								.concat(list.items.slice(index));
		return true;
	}

	/**
	 * Last but not least, we have to remove the previously dragged items in the
	 * dnd-moved callback.
	 */
	 $scope.onMoved = function(list) {
		list.items = list.items.filter(function(item) { return !item.selected; });
	};

	$scope.addItem = function(list) {
		list.items.push({label: "", editing: true});
		// Set focus on the input, timeout necessary as we have to wait for the input to be inserted in the DOM
		$timeout(function() { 
			angular.element(document.getElementsByClassName('stories-edit editing')).focus();
		});

	};

	$scope.saveItem = function(item) {
		item.editing = false;
		item.selected = false;
	};

}])

.factory('ScrumBoardModel', ['localStorageService', '$http', '$rootScope', '$timeout', function(localStorageService, $http, $rootScope, $timeout) {
	/**
	 * Data is loaded from a static JSON file if no updated copy is found in localStorage
	 */
	if (!localStorageService.get('models')) {
		$http.get('data.json')
			 .then(function successCallback(response) {
			 	localStorageService.set('models', response.data);
			 	$rootScope.$broadcast('ScrumBoardModel::dataAcquired');
			 }, function errorCallback(error) {
			 	alert('Unable to get the data, request failed with code '+ error.status +': '+ error.statusText);
			 });
	} else {
		$timeout(function() { $rootScope.$broadcast('ScrumBoardModel::dataAcquired'); });
	}

	var models = localStorageService.get('models');

	return {
		models: models,
		bind: function($scope) {
			localStorageService.bind($scope, 'models');
		}
	}
}])

.factory('ScrumBoardTitle', ['localStorageService', function(localStorageService) {
	if (!localStorageService.get('title')) { localStorageService.set('title', 'Active Sprint 001'); }

	var title = localStorageService.get('title');

	return {
		title: title,
		bind: function($scope) {
			localStorageService.bind($scope, 'title');
		}
	}
}]);
