angular.module('mcnedward')
.controller('AppCtrl', [ '$rootScope', '$state', '$timeout', '$location', '$anchorScroll',
	function AppCtrl($rootScope, $state, $timeout, $location, $anchorScroll) {
    'use strict';

		$rootScope.inRoot = true;
		$rootScope.appTitle = "Edward McNealy";

		$rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      $rootScope.appTitle = toState.title && toState.title !== '' ? toState.title : 'Edward McNealy';
      if (fromState.name === 'app') {
        // Scroll up to the top when going away from the main app
        adjustScroll('scrollhere');
      } else {
        adjustScroll(fromState.name);
      }
      if (fromState.name === 'colorZones') {
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

    $('#loader').fadeOut(200);

    function adjustScroll(id) {
      if (!id || id === '') return;
      $timeout(function() {
        $('html, body').animate({
          scrollTop : $('#' + id).offset().top + 2
        }, 1);
      });
    }
}]);
	