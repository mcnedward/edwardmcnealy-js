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
      $rootScope.isParser = toState.name === 'parser';
      $rootScope.useContainerFluid = toState.name === 'colorZones';

      // Update Google Analytics
      ga('set', 'page', toState.name === 'app' ? '/index.html' : toState.url + '.html');
      ga('send', 'pageview');
    });
    
    $("#loader").fadeOut(200);

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
}]);
	