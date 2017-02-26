/**
 * Created by Edward on 10/11/2016.
 */
'use strict';
angular.module('mcnedward')
.controller('ContactCtrl', ['$scope', 'requestService',
	function ContactCtrl($scope, requestService) {

	$scope.contactInfo = {};
	$scope.isFormSubmitted = false;
	$scope.contactSuccessMessage = '';
	$scope.contactErrorMessage = '';
	function clear() {
		$scope.contactSuccessMessage = '';
		$scope.contactErrorMessage = '';
	}
	function showError(message) {
		$scope.contactErrorMessage = message;
	}
	function handleErrorResponse(errorResponse) {
		var errorMessage = '', 
		data = errorResponse.data,
		errors = data.errors ? data.errors : [];
	
		if (errors.length > 0) {
			for (var i = 0; i < errors.length; i++) {
				errorMessage += errors[i];
			}
		} else {
			errorMessage = 'Something went wrong when trying to send your message... Please try again.';
		}
		showError(errorMessage);
		$scope.isisFormSubmitted = false;
	}
	function sendMessage(secretResponse, token, contactInfo) {
		var url = '/api/contact?secretResponse=' + secretResponse + '&requestToken=' + token;
		requestService.sendRequest(url, 'POST', {data: contactInfo}).then(
			function(response) {
				var responseMessage = response.data ? response.data.entity : null;
				if (responseMessage === null) {
					console.log('No response...');
					return;					
				}
				$scope.contactSuccessMessage = responseMessage;
				// Trigger Google Analytic event
				ga('send', 'event', 'Contact', 'Email', 'From: ' + contactInfo.email + ' - Subject: ' + contactInfo.subject);
			}, function (errorResponse) {
				handleErrorResponse(errorResponse);
			});
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
		if (grecaptcha == null) {
			showError(reCaptchaError);
			return;
		}
		var secretResponse = contactInfo.recaptchaResponse;
		if (secretResponse == null) {
			showError(reCaptchaError);
			return;
		}

		$scope.contactSuccessMessage = 'Sending...';		
		var url = '/api/captcha/verify?secretResponse=' + secretResponse;
		requestService.sendRequest(url, 'POST').then(
			function(response) {
				var data = response.data;
				var token = data ? data.entity : null;
				if (!token || token === '') {
					showError('Token is missing...');
					$scope.isFormSubmitted = false;
					return;
				}
				sendMessage(secretResponse, token, contactInfo);
			},
			function(errorResponse) {
				handleErrorResponse(errorResponse);
			});
	}
	
	$scope.checkLength = function(value) {
		var length = value ? value.length : 0;
		if (!length) length = 0;
		return length;
	}
	$scope.emailMaxLength = 100;
	$scope.subjectMaxLength = 100;
	$scope.messageMaxLength = 1000;
	$scope.subjectLength = function() { return $scope.checkLength($scope.contactInfo.subject); };
	$scope.messageLength = function() { return $scope.checkLength($scope.contactInfo.message); };
	
}]);