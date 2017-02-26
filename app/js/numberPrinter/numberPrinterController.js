/**
 * Created by Edward on 11/8/2014.
 */
'use strict';
angular.module('mcnedward')
.controller('NumberPrinterCtrl', ['$rootScope', '$scope', '$window', 'requestService',
	function NumberPrinterCtrl($rootScope, $scope, $window, requestService) {
	
  $scope.result = '';

	$scope.convertToEnglish = function() {
		convert((json) => {
      $scope.result = json.englishWord;
      $scope.$apply();
    });
	}
	
	$scope.convertToRomanNumeral = function() {
    convert((json) => {
      $scope.result = json.romanNumeral;
      $scope.$apply();
    });
	}

  function convert(callback) {
    clearText();
		var number = $scope.number;
		if (number == '') {
			$scope.errorMessage = 'You need to enter something!';
			return;
		}
    return fetch('/api/number-printer/convert?number=' + number).then((response) => {
      if (response.ok) {
        response.json().then(callback);
        return;
      }
      response.text().then((text) => {
        $scope.errorMessage = text;
        $scope.$apply();
      });
    }).catch((error) => {
      $scope.errorMessage = error;
      $scope.$apply();
    });
  }
	
	function clearText() {
		$scope.result = '';
		$scope.errorMessage = '';
	}
}]);
