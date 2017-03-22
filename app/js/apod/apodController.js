angular.module('mcnedward')
.controller('ApodCtrl', ['$rootScope', '$scope',
	function ApodCtrl($rootScope, $scope) {
  'use strict';

  $(document).ready(function () {
    var service = new AstroService();
    var astroPicOfDay = new AstroPicOfDay(service);
    ko.applyBindings(astroPicOfDay, $('#main')[0]);
  });
  
}]);