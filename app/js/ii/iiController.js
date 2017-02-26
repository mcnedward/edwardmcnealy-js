/**
 * Created by Edward on 10/7/2014.
 */
'use strict';
angular.module('mcnedward')
.controller('IICtrl', ['$rootScope', '$scope', '$window', 'requestService', 'recaptchaService', 'modalService',
	function IICtrl($rootScope, $scope, $window, requestService, recaptchaService, modalService) {
	
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
	function download(downloadUrl, type) {
		var anchor = angular.element('<a/>');
		anchor.css({display: 'none'});
		angular.element(document.body).append(anchor);
		anchor.attr({
		    href: downloadUrl,
		    target: '_blank'
		})[0].click();
		// Trigger Google Analytic event
		ga('send', 'event', 'Inheritance Inquiry', 'Download', type);
	}
	function downloadApp(secretResponse, token) {
		var downloadUrl = '/api/ii/app?secretResponse=' + secretResponse + '&requestToken=' + token;
		download(downloadUrl, 'App');
	}
	function downloadLib(secretResponse, token) {
		var downloadUrl = '/api/ii/lib?secretResponse=' + secretResponse + '&requestToken=' + token;
		download(downloadUrl, 'Library');
	}
	
	$scope.openDownloadForApp = function() {
		clearAppError();
		modalService.showModal('downloadAppModal');
	}
	$scope.openDownloadForLib = function() {
		clearLibError();
		modalService.showModal('downloadLibModal');
	}
	
	$scope.downloadIIApp = function(form, iiAppInfo) {
		if ($scope.isAppFormSubmitted) return;
		form.$setSubmitted();
		if (form.$invalid) return;
		$scope.isAppFormSubmitted = true;
		form.$setPristine();
		form.$setUntouched();
		clearAppError();
		
		recaptchaService.verify(iiAppInfo.recaptchaResponse, downloadApp, showAppError);
	}
	$scope.downloadIILib = function(form, iiLibInfo) {
		if ($scope.isLibFormSubmitted) return;
		form.$setSubmitted();
		if (form.$invalid) return;
		$scope.isLibFormSubmitted = true;
		form.$setPristine();
		form.$setUntouched();
		clearLibError();

		recaptchaService.verify(iiLibInfo.recaptchaResponse, downloadLib, showLibError);
	}
	
}]);