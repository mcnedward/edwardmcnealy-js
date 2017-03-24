angular.module('mcnedward')
.controller('SolarSystemCtrl', ['$rootScope', '$scope',
	function SolarSystemCtrl($rootScope, $scope) {
  'use strict';

  var renderer;
  $(document).ready(function () {
      renderer = new Renderer();
      var solarSystem = new SolarSystem(renderer);
      ko.applyBindings(solarSystem);
  });

  $rootScope.$on('stopRendering', () => {
    renderer.stopRendering(true);
  });
  
}]);