/**
 * Created by Edward on 2/19/15.
 */
angular.module('mcnedward')
.directive('playingCard',	function() {
  'use strict';
		
	return {
		scope: {
			card: '='
		},
		restrict: 'AE',
		replace: 'true',
		controller: function($scope) {
			$scope.$on('playerBusted', function() {
				if ($scope.card.isFaceDown) {
					$('#' + $scope.card.id).attr('src', $scope.card.src);
				}
			});
			$scope.$on('showCards', function() {
				$('#' + $scope.card.id).attr('src', $scope.card.src);
			});
		},
		link: function(scope, element, attrs) {
			if (scope.card.isFaceDown)
				element.attr('src', 'img/blackjack/card/b2fv.jpg');
			else
				element.attr('src', scope.card.src);
        },
		template: '<img id="{{card.id}}" class="card-img"/>'
	};
});
