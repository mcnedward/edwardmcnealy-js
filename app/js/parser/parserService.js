/**
 * Created by Edward on 2/26/2016.
 */
'use strict';

angular.module('mcnedward')
.service('parserService', ['$rootScope', 'requestService', '$http',
                           function($rootScope, requestService, $http) {

	var parserService = {};

	parserService.uploadFiles = function(files, secretResponse, token) {
		var formData = new FormData();
		angular.forEach(files, function(value, key) {
			formData.append('files', value);
		});
		
		var url = 'parser/files?secretResponse=' + secretResponse + '&requestToken=' + token;
        return requestService.sendRequest(url, 'POST', {data: formData, headers: {"Content-Type": undefined}, transformRequest: angular.identity});
	}

	parserService.parseFiles = function(directory, secretResponse, token) {
		var url = 'parser/parse?secretResponse=' + secretResponse + '&requestToken=' + token; 
		return requestService.sendRequest(url, 'POST', {data: directory});
	}

	parserService.getUploadProgress = function(secretResponse, token, responseFunction) {
		var url = 'parser/progress?secretResponse=' + secretResponse + '&requestToken=' + token;
		requestService.sendRequest(url, 'GET').then(
		function(response) {
			responseFunction(response);
		}, function(error) {
			console.log(error.message ? error.message : 'Something went wrong getting the progress...');
		});
	}

	parserService.saveClasses = function(classObjects) {
		if (classObjects) {
			localStorage.classObjects = JSON.stringify(classObjects);
			parserService.classObjects = classObjects;
		} else
			console.log('No classObjects to save...');
	}
	parserService.getClasses = function() {
		var classObjects = localStorage.classObjects ? JSON.parse(localStorage.classObjects) : null;
		return classObjects;
	}

	parserService.saveDirectory = function(directory) {
		if (directory) {
			localStorage.directory = JSON.stringify(directory);
			parserService.directory = directory;
		} else
			console.log('No directory to save...');
	}
	parserService.getDirectory = function() {
		var directory = localStorage.directory ? JSON.parse(localStorage.directory) : null;
		return directory;
	}

	return parserService;
}]);
