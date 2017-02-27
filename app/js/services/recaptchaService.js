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
    fetch('/api/recaptcha/verify?secretResponse=' + secretResponse, {method: 'POST'}).then((response) => {
      if (!response.ok) {
        errorCallback('Token is missing...');
        return;
      }
      response.text().then((token) => {
        successCallback(secretResponse, token);
      })
    })
	}

	return recaptchaService;
}]);