/**
 * Created by Edward on 2/19/15.
 */
angular.module('mcnedward')
.directive('optionsCard', [
	function() {
  'use strict';

	return {
		scope: {
			type: '@',
			title: '@'
		},
		restrict: 'AE',
		transclude: true,
		link: function(scope, element, attrs) {
		},
		templateUrl: 'solar-system/optionsCard.html'
	};
}]);