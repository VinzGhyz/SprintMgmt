'use strict';

// Declare app level module which depends on views, and components
angular.module('sprintMgmt', [
  'ngRoute',
  'sprintMgmt.scrumBoard'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/scrum-board'});
}]).
directive('ngEnterSubmit', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnterSubmit);
                });

                event.preventDefault();
            }
        });
    };
});
