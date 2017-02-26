/**
 * Created by Edward on 10/15/2016.
 */
'use strict';

angular.module('mcnedward')
.factory('recaptchaService', ['$rootScope', 'requestService',
   function ($rootScope, requestService) {
	
	var recaptchaService = {}
	
	recaptchaService.verify = function(secretResponse, successCallback, errorCallback) {
		if (secretResponse == null) {
			errorCallback('Sorry, but something went wrong with the reCaptcha. Please refresh the page and try again.');
			return;
		}
		var url = '/api/captcha/verify?secretResponse=' + secretResponse;
		requestService.sendRequest(url, 'POST').then(
			function(response) {
				var data = response.data;
				var token = data ? data.entity : null;
				if (!token || token === '') {
					errorCallback('Token is missing...');
					return;
				}
				successCallback(secretResponse, token);
			},
			function(errorResponse) {
				var errorMessage = '', 
					data = errorResponse.data,
					errors = data.errors ? data.errors : [];
				
				if (errors.length > 0) {
					for (var i = 0; i < errors.length; i++) {
						errorMessage += errors[i];
					}
				} else {
					errorMessage = 'Something went wrong when trying verify your reCaptcha... Please try again.';
				}
				errorCallback(errorMessage);
			});
	}

	return recaptchaService;
}]);