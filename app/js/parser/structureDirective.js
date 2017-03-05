/**
 * Created by Edward on 2/28/2016.
 */

angular.module('mcnedward')
.directive('structure', ['$rootScope', function($rootScope) {
  'use strict';
		
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			title: '@',
			contents: '=',
		},
		controller: function($scope, $element, $timeout) {
		},
		link: function(scope, element, attrs) {
		},
		templateUrl: 'parser/structure.html'
	};
}]);