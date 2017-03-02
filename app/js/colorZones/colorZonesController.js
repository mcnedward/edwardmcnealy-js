'use strict';
angular.module('mcnedward')
.controller('ColorZonesCtrl', ['$rootScope', '$scope',
	function ColorZonesCtrl($rootScope, $scope) {

  $(document).ready(function () {
    $scope.renderer = new Renderer();
    var timeZoneService = new TimeZoneService($scope.renderer.width());
    var colorPicker = new ColorPicker();
    var model = new ColorZonesViewModel($scope.renderer, timeZoneService, colorPicker);
    // Figure out why I need this override here...
    ko.options.useOnlyNativeEvents = true;
    ko.applyBindings(model, $('#main')[0]);

    var tooltipService = new TooltipService([
      { id: $('#canvasContainer'), timeout: 8 },
      { id: $('#hoursControl'), timeout: 3 },
      { id: $('#minutesControl'), timeout: 3 },
      { id: $('#secondsControl'), timeout: 3 },
      { id: $('#opacityControl'), timeout: 4 },
      { id: $('#showTimesControl'), timeout: 6 },
      { id: $('#showColorsControl'), timeout: 6 }
    ]);
    tooltipService.loadToolips();
  });

  $rootScope.$on('stopRendering', () => {
    $scope.renderer.stopRendering(true);
  })
  
}]);