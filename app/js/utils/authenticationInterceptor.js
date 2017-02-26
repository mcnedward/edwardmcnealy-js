/**
 * Created by Edward on 6/9/2014.
 */

'use strict';

angular.module('mcnedward')
.factory('authInterceptor', ['$rootScope', '$q', '$window', 'userService', function($rootScope, $q, $window, userService) {

	function createErrorMessage(response) {
		var errorMessage = '';
		if (response.data) {
			var status = response.data.status;
			var message = response.data.message;
			errorMessage = 'Hmmm...response status ' + response.status + ' - ' + status + ' (' + message + ').';
		} else {
			errorMessage = 'Hmmm...response status ' + response.status + '.';
		}
		console.log(errorMessage);
		return errorMessage;
	}

	return {
		request: function(config) {
			var authToken = userService.getAuthToken();
			var user = userService.getUser();

			config.headers = config.headers || {};
			// If there is authData set in sessionStorage, add the token and id to the headers
			if (authToken) {
				config.headers.AuthToken = authToken;
				config.headers.AuthId = user.email;
			}
			return config;
		},
		response: function(response) {
			if (response.status === 401) {
				console.log('Not authorized!');
			}
			return response || $q.when(response);
		},
		responseError: function(response) {
			if (response) {
				if (response.status == 401) { // An authorization exception was thrown from server
					if (response.data.status == 'Unauthorized') {
						$rootScope.$broadcast('authRequired');
					}
				}
				else if (response.status == 404) { // Not found
					createErrorMessage(response);
					// Show 404 page here
				}
				else {
					var message = response.message ? response.message : 'Something went wrong...';
					var file = response.fileName && response.lineNumber ? '\nCheck file ' + response.fileName + ' at line number ' + response.lineNumber : '';
				}
			}
			else
				console.log("Error getting a response from the server...");
			return $q.reject(response);
		}
	};
}]);
