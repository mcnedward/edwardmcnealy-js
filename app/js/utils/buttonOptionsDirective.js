/**
 * Created by Edward on 2/19/15.
 */
angular.module('mcnedward')
.directive('buttonoptions', [
	function() {
  'use strict';

	return {
		scope: {
			confirmAction: '&',
			cancelAction: '&'
		},
		restrict: 'AE',
		replace: 'true',
		controller: function($scope) {
			$scope.confirm = function() {
				$scope.confirmAction();
			};
			$scope.cancel = function() {
				$scope.cancelAction();
			};
		},
		link: function(scope, element, attrs) {
			scope.title = attrs.confirmTitle;
			scope.cancelTitle = attrs.cancelTitle ? attrs.cancelTitle : 'X';
			if (attrs.confirmClass) scope.confirmClass = attrs.confirmClass;
        },
		// template: '<div class="button-div"><span id="confirmBtn" class="ebtn ebtn-green confirmBtn" ng-click="confirm()" ng-class="confirmClass" style="width:75%;white-space:nowrap;text-overflow:ellpsis;">{{title}}</span><span class="ebtn ebtn-red cancelBtn" ng-click="cancel()" style="width:25%">{{cancelTitle}}</span></div>'
		template: '<div class="btn-group">' +
			'<button data-ng-click="confirm()" class="btn ebtn-green">{{title}}</button>' + 
			'<button data-ng-click="cancel()" class="btn ebtn-red cancelBtn">{{cancelTitle}}</button></div>'
	};
}]);
app.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind('keydown keypress', function(event) {
			if(event.which === 13) {
				scope.$apply(function(){
					scope.$eval(attrs.ngEnter, {'event': event});
				});
				event.preventDefault();
			}
		});
	};
});
