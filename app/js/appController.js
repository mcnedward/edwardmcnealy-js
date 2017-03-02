'use strict';
angular.module('mcnedward')
.controller('AppCtrl', [ '$rootScope', '$scope', '$state', '$timeout',
	function AppCtrl($rootScope, $scope, $state, $timeout) {
		$rootScope.inRoot = true;
		$rootScope.appTitle = "Edward McNealy";

		$rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
      $rootScope.appTitle = toState.title && toState.title !== '' ? toState.title : 'Edward McNealy';
      if (fromState.name === 'app') {
        // Scroll up to the top when going away from the main app
        $timeout(function() {
          $('html, body').animate({
            scrollTop : $('#scrollhere').offset().top + 2
          }, 1);
        });
      } else if (fromState.name === 'colorZones') {
        // The color zones need to stop rendering since we're no longer on that page
        $rootScope.$broadcast('stopRendering');
      }
      
      $rootScope.inRoot = toState.name === 'app' || toState.name === '';
      $rootScope.useContainerFluid = toState.name == 'colorZones' || toState.name == 'parser';
      $rootScope.useContainer = !$rootScope.inRoot && !$rootScope.useContainerFluid;

      // Update Google Analytics
      ga('set', 'page', toState.name === 'app' ? '/index.html' : toState.url + '.html');
      ga('send', 'pageview');
    });
    $("#loader").fadeOut(200);
}]);
	