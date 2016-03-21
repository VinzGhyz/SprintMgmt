'use strict';

angular.module('sprintMgmt.scrumBoard', ['ngRoute', 'dndLists', 'LocalStorageModule'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/scrum-board', {
		templateUrl: 'scrumBoard/scrumBoard.html',
		controller: 'scrumBoardCtrl'
	});
}])

.controller('scrumBoardCtrl', ['$scope', '$timeout', 'ScrumBoardTitle', 'ScrumBoardModel', function($scope, $timeout, ScrumBoardTitle, ScrumBoardModel) {
	
	/**
	 * Set title from its model, either loaded from the localStorage or manually set to 
	 * its default value then bind the changes to localStorage so they're reflected with every change
	 */
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
	 * of the drop.
	 */
	 $scope.getSelectedItemsIncluding = function(list, item) {
		item.selected = true;
		return list.items.filter(function(item) { return item.selected; });
	};

	/**
	 * Set the list into dragging state, then use the actual event to access the 
	 * HTML5 Drag and Drop API and make it a legitimate drag-and-drop component
	 */
	 $scope.onDragstart = function(list, event) {
		 list.dragging = true;
		 event.dataTransfer.effectAllowed = "all";
	 };

	/**
	 * Handle the drop event, removing the selected attribute and inserting elements in their
	 * new destination list
	 */
	 $scope.onDrop = function(list, items, index) {
		angular.forEach(items, function(item) { item.selected = false; });
		list.items = list.items.slice(0, index)
					.concat(items)
					.concat(list.items.slice(index));
		return true;
	}

	/**
	 * Remove the previously dragged items in the callback triggered for moved elements
	 */
	 $scope.onMoved = function(list) {
		list.items = list.items.filter(function(item) { return !item.selected; });
	};
	
	/**
	 * Add an item to the list, then set the focus to the input for ease of edition
	 */
	$scope.addItem = function(list) {
		list.items.push({label: "", editing: true});
		$timeout(function() { angular.element(document.getElementsByClassName('stories-edit editing')).focus(); });

	};
	
	/**
	 * Once the item exits its edition mode, set those attributes back to normal. As the ScrumBoardModel is bound
	 * to the localStorageService, changes are automatically saved locally
	 */
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
	/**
	 * Sprint title is loaded from a localStorage, otherwise it is set to a hardcoded value
	 */
	if (!localStorageService.get('title')) { localStorageService.set('title', 'Active Sprint 001'); }

	var title = localStorageService.get('title');

	return {
		title: title,
		bind: function($scope) {
			localStorageService.bind($scope, 'title');
		}
	}
}]);
