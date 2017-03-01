/**
 * Created by Edward on 11/9/2014.
 */
'use strict';

angular.module('mcnedward')
.factory('requestService', ['$rootScope', '$injector', '$http', '$q', '$location', 'userService',
                               function($rootScope, $injector, $http, $q, $location, userService) {
	
	var requestService = {};
	
	// Method for sending request
	requestService.sendRequest = function(url, method, options) {
		var deferred = $q.defer(),
			timedOut = false;
		
		var http = $injector.get('$http');
		
		var httpRequest = http({
			method: method,
			url: url,
			data: options && options.data ? options.data : null,
			cache: options && options.data ? options.cache : false,
			headers: options && options.data ? options.headers : {},
			responseType: options && options.data ? options.responseType : null
		});
		if (options && options.transformRequest) {
			httpRequest.transformRequest = options.transformRequest
		}

    return httpRequest;
    // .then((response) => {
    //   if (response.ok) {
    //     deferred.resolve(response);
    //   }
    // })
		
		// httpRequest.success(function(data, status, headers, config) {
		// 	var result = {
		// 		data: data,
		// 		headers: headers(),
		// 		status: status,
		// 		config: config
		// 	};
		// 	deferred.resolve(result);
		// });
		// httpRequest.error(function(data, status, headers, config) {
		// 	var result = {
		// 			data: data,
		// 			headers: headers,
		// 			status: status,
		// 			config: config
		// 		};
		// 	if (status && (status == 401 || status == 403)) {
		// 		if (!userService.isLoggedIn()) {
		// 			$rootScope.$broadcast('authRequired');
		// 		}
		// 	}
		// 	return deferred.reject(result);
		// });
		
		return deferred.promise;
	};
	
	return requestService;
}]);