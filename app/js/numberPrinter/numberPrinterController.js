/**
 * Created by Edward on 11/8/2014.
 */
'use strict';
angular.module('mcnedward')
.controller('NumberPrinterCtrl', ['$rootScope', '$scope', '$window', 'requestService',
	function NumberPrinterCtrl($rootScope, $scope, $window, requestService) {
	
	$scope.number = {};
	$scope.convertToEnglish = function() {
		clearText();
		var number = $scope.number.search;
		if (number == '') {
			$scope.errorMessage = 'You need to enter something!';
			return;
		}
		requestService.sendRequest('/numberprinter/convert?number=' + number, 'POST').then(
			function(response) {
				var englishWord = response.data.entity.englishWord;
				$scope.result = englishWord;
			},
			function(error) {
				var errorMessage = error.data.errors[0];
				$scope.errorMessage = errorMessage;
			}
		);
	}
	
	$scope.convertToRomanNumeral = function() {
		clearText();
		var number = $scope.number.search;
		if (number == '') {
			$scope.errorMessage = 'You need to enter something!';
			return;
		}
		requestService.sendRequest('/numberprinter/convert?number=' + number, 'POST').then(
			function(response) {
				var romanNumeral = response.data.entity.romanNumeral;
				$scope.result = romanNumeral;
			},
			function(error) {
				var errorMessage = error.data.errors[0];
				$scope.errorMessage = errorMessage;
			}
		);
	}
	
	function clearText() {
		$scope.result = '';
		$scope.errorMessage = '';
	}
}]);
