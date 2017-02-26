'use strict';
angular.module('mcnedward')
.controller('AppCtrl', [ '$rootScope', '$scope', '$state', '$timeout',
	function AppCtrl($rootScope, $scope, $state, $timeout) {
		$rootScope.hideMainImg = false;
		$rootScope.appTitle = "Edward McNealy";
		var header = $('#mHeader');

		// The headerShowing boolean here is used to show and hide the header
		// Need to set it false on every state change
		var headerShowing = false;
		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				$rootScope.appTitle = toState.title && toState.title !== '' ? toState.title : 'Edward McNealy';
				headerShowing = false;
				if (fromState.name !== "") {
					$timeout(function() {
						$('html, body').animate({
							scrollTop : $('#scrollhere').offset().top + 2
						}, 1);
					});
				}
				if (toState.name === 'app') {
					$rootScope.hideMainImg = false;
					if (fromState.name === "") header.hide();
				} else {
					// Scroll to the top if not on the main page
					$(this).scrollTop(0);
					$rootScope.hideMainImg = true;
				}
				if (toState.name === 'parser')
					$rootScope.isParser = true;
				
				// Update Google Analytics
				ga('set', 'page', toState.name === 'app' ? '/index.html' : toState.url + '.html');
				ga('send', 'pageview');
			});

		// checkLoggedIn();
		// function checkLoggedIn() {
		// 	if (userService.isLoggedIn()) {
		// 		$rootScope.userLoggedIn = true;
		// 		$rootScope.user = userService.getUser();
		// 	}
		// }
		// // This callback is activated after successful login
		// $rootScope.$on('authChanged', function() {
		// 	checkLoggedIn();
		// });
		// $rootScope.$on('authRequired', function() {
		// 	modalService.showModal('loginModal');
		// 	$scope.modalMessage = 'You\'ll need to login first.';
		// });
		// $scope.openLoginModal = function() {
		// 	modalService.showModal('loginModal');
		// }
		// $scope.logout = function() {
		// 	$rootScope.userLoggedIn = false;
		// 	$rootScope.user = null;
		// 	userService.clearCache();
		// 	$rootScope.$broadcast('authChanged');
		// };

		// Load background image
		if (!$rootScope.hideMainImg) {
			var src = "img/core/lochNessDark.jpg";
			var img = new Image();
			img.onload = function () {
				$('#mainImage').css('background-image', 'url(' + src + ')');
				$('#mainImage').animate({ opacity: 1 }, { duration: 300 });
			}
			img.src = src;
		}
		$(window).scroll(function() {
			if ($(window).scrollTop() >= $(window).height()) {
				// Main content is fully shown and welcome image is hidden, so show header
				if (!headerShowing) {
					headerShowing = true;
					header.show('fast', 'swing');
				}
			} else {
				if (!$rootScope.hideMainImg) {
					if (headerShowing) {
						headerShowing = false;
						header.hide('fast', 'swing');
					}
				} else {
					if (!headerShowing) {
						headerShowing = true;
						header.show('fast', 'swing');
					}
				}
			}
		});
}]);
	