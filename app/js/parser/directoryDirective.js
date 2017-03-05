/**
 * Created by Edward on 2/28/2016.
 */
angular.module('mcnedward')
.directive('directory', ['$rootScope',
	function($rootScope) {
  'use strict';
		
	return {
		restrict: 'AE',
		transclude: true,
		scope: {
			name: '=',
			id: '=',
			directories: '=',
			classes: '='
		},
		link: function(scope, element, attrs) {
			scope.selectClass = function(directoryId, classId) {
				$rootScope.$broadcast('selectClass', {
					directoryId: directoryId,
					classId: classId
				});
			};
			
			// If there is no name, this is a temporary directory used only for the upload
			scope.isRealDirectory = scope.name !== null && scope.name !== "";
			scope.showContents = false;
		},
		templateUrl: 'parser/directory.html'
	};
}]);