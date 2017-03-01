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
		
		var url = '/api/parser/files?secretResponse=' + secretResponse + '&requestToken=' + token;
    return fetch(url, {
      method: 'POST',
      body: formData
    });
	}

	parserService.parseFiles = function(directory, secretResponse, token) {
		var url = '/api/parser/parse?secretResponse=' + secretResponse + '&requestToken=' + token; 
		return fetch(url, {
      method: 'POST',
      data: directory
    });
	}

	parserService.getUploadProgress = function(secretResponse, token, responseFunction) {
    return fetch('/api/parser/progress?secretResponse=' + secretResponse + '&requestToken=' + token);
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
