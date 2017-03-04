/**
 * Created by Edward on 10/15/2016.
 */
'use strict';

angular.module('mcnedward')
.factory('recaptchaService', [
   function () {
	
	var recaptchaService = {}
	
	recaptchaService.verify = function(secretResponse, successCallback, errorCallback) {
		if (secretResponse == null) {
			errorCallback('Sorry, but something went wrong with the reCaptcha. Please refresh the page and try again.');
			return;
		}
    fetch('/api/recaptcha/verify?secretResponse=' + secretResponse, {method: 'POST'}).then((response) => {
      var ok = response.ok;
      response.text().then((text) => {
        if (ok) {
          successCallback(secretResponse, text);
        } else {
          errorCallback(text);
        }
      });
    })
	}

	return recaptchaService;
}]);