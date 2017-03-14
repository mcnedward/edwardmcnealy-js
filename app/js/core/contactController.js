/**
 * Created by Edward on 10/11/2016.
 */
angular.module('mcnedward')
.controller('ContactCtrl', ['$scope',	function ContactCtrl($scope) {
  'use strict';

	$scope.contactInfo = {};
	$scope.isFormSubmitted = false;
	$scope.contactSuccessMessage = '';
	$scope.contactErrorMessage = '';

	function clear() {
		$scope.contactSuccessMessage = '';
		$scope.contactErrorMessage = '';
	}
	function showError(message) {
    clear();
		$scope.contactErrorMessage = message;
	}

  $scope.portfolioMouseOver = () => {
    $scope.shouldFade = true;
  }
  $scope.portfolioMouseLeave = () => {
    $scope.shouldFade = false;
  }
	
	$scope.submitContact = function(form, contactInfo) {
		if ($scope.isFormSubmitted) return;
		form.$setSubmitted();
		if (form.$invalid) return;
		$scope.isFormSubmitted = true;
		form.$setPristine();
		form.$setUntouched();
		clear();
		
		var reCaptchaError = 'Sorry, but something went wrong with the reCaptcha. Please refresh the page and try again.';
		if (grecaptcha === null) {
			showError(reCaptchaError);
			return;
		}
		var secretResponse = contactInfo.recaptchaResponse;
		if (secretResponse === null) {
			showError(reCaptchaError);
			return;
		}

		$scope.contactSuccessMessage = 'Sending...';		
		var url = '/api/contact?secretResponse=' + secretResponse;
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactInfo)
    }).then((response) => {
      if (!response.ok) {
        response.text().then((text) => {
          showError(text);
          $scope.isFormSubmitted = false;
          $scope.$apply();
        });
      } else {
        response.text().then((text) => {
          $scope.contactSuccessMessage = text;
          $scope.$apply();
          // Trigger Google Analytic event
          ga('send', 'event', 'Contact', 'Email', 'From: ' + contactInfo.email + ' - Subject: ' + contactInfo.subject);
        });
      }
    });
	};
	
	$scope.checkLength = function(value) {
		var length = value ? value.length : 0;
		if (!length) length = 0;
		return length;
	};
	$scope.emailMaxLength = 100;
	$scope.subjectMaxLength = 100;
	$scope.messageMaxLength = 1000;
	$scope.subjectLength = function() { return $scope.checkLength($scope.contactInfo.subject); };
	$scope.messageLength = function() { return $scope.checkLength($scope.contactInfo.message); };
	
}]);