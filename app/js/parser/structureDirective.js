/**
 * Created by Edward on 2/28/2016.
 */
'use strict';

angular.module('mcnedward')
.directive('structure', ['$rootScope', function($rootScope) {
		
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
		templateUrl: 'app/components/parser/structure.html'
	};
}]);