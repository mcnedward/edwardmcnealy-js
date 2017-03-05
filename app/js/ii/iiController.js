/**
 * Created by Edward on 10/7/2014.
 */
angular.module('mcnedward')
.controller('IICtrl', ['$scope', 'modalService',
	function IICtrl($scope, modalService) {
  'use strict';
	
	$scope.iiInfo = {};
	$scope.isFormSubmitted = false;
	
	function showAppError(errorMessage) {
		$scope.showAppError = true;
		$scope.appError = error;
	}
	function showLibError(errorMessage) {
		$scope.showLibError = true;
		$scope.libError = error;
	}
	function clearAppError(errorMessage) {
		$scope.showAppError = false;
		$scope.appError = '';
	}
	function clearLibError(errorMessage) {
		$scope.showLibError = false;
		$scope.libError = '';
	}
	
	$scope.openDownloadForApp = function() {
		clearAppError();
		modalService.showModal('downloadAppModal');
	};
	$scope.openDownloadForLib = function() {
		clearLibError();
		modalService.showModal('downloadLibModal');
	};

	$scope.downloadIIApp = function(form, iiAppInfo) {
		if ($scope.isAppFormSubmitted) return;
		form.$setSubmitted();
		if (form.$invalid) return;
		$scope.isAppFormSubmitted = true;
		form.$setPristine();
		form.$setUntouched();
		clearAppError();

    var downloadUrl = '/api/ii/app?secretResponse=' + iiAppInfo.recaptchaResponse;
    window.location.href = downloadUrl;
	};
	$scope.downloadIILib = function(form, iiLibInfo) {
		if ($scope.isLibFormSubmitted) return;
		form.$setSubmitted();
		if (form.$invalid) return;
		$scope.isLibFormSubmitted = true;
		form.$setPristine();
		form.$setUntouched();
		clearLibError();

    var downloadUrl = '/api/ii/lib?secretResponse=' + iiLibInfo.recaptchaResponse;
    window.location.href = downloadUrl;
	};
	
}]);