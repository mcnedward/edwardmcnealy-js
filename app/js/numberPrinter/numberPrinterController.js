/**
 * Created by Edward on 11/8/2014.
 */
angular.module('mcnedward')
.controller('NumberPrinterCtrl', ['$scope',
	function NumberPrinterCtrl($scope) {
  'use strict';
	
  $scope.result = '';

	$scope.convertToEnglish = function() {
		convert((json) => {
      $scope.result = json.englishWord;
      $scope.$apply();
    });
	};
	
	$scope.convertToRomanNumeral = function() {
    convert((json) => {
      $scope.result = json.romanNumeral;
      $scope.$apply();
    });
	};

  function convert(callback) {
    clearText();
		var number = $scope.number;
		if (number === '') {
			$scope.errorMessage = 'You need to enter something!';
			return;
		}
    return fetch('/api/number-printer?number=' + number).then((response) => {
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
