var app = angular.module('mcnedward', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'vcRecaptcha'])
.config([ '$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

	$stateProvider
    .state('app', {
      url: '/',
      templateUrl: 'core/home.html',
      controller: 'ContactCtrl',
      title: 'Edward McNealy'
    })
		.state('ii', {
			url: '/inheritance-inquiry/',
			templateUrl: 'ii/ii.html',
			controller: 'IICtrl',
			title: 'Inheritance Inquiry'
		})
		.state('parser', {
			url: '/parser/',
			templateUrl: 'parser/parser.html',
			controller: 'ParserCtrl',
			title: 'Parser'
		})
		.state('colorZones', {
			url: '/color-zones/',
			templateUrl: 'colorZones/colorZones.html',
			controller: 'ColorZonesCtrl',
			title: 'Color Zones'
		})
		.state('bramble', {
			url: '/bramble/',
			templateUrl: 'bramble/bramble.html',
			title: 'Bramble'
		})
		.state('keepfit', {
			url: '/keepfit/',
			templateUrl: 'keepfit/keepfit.html',
			title: 'KeepFit'
		})
		.state('blackjack', {
			url: '/blackjack/',
			templateUrl: 'blackjack/blackjack.html',
			controller: 'BlackjackCtrl',
			title: 'Blackjack'
		})
		.state('numberPrinter', {
			url: '/numberprinter/',
			templateUrl: 'numberPrinter/numberPrinter.html',
			controller: 'NumberPrinterCtrl',
			title: 'Number Printer'
		});

	$urlRouterProvider.otherwise('/');
  $urlRouterProvider.when(/ii/, ['$state','$match', function ($state, $match) {
    $state.go('ii');
  }]);

	$locationProvider.html5Mode(true);

}]);
app.run([function() {
	$(document).ready(function() {
		$(document).on('focus.material', '.form-group-material .form-control:input', function (e) {
		    var $formGroup = $(e.target);
		    if (!$formGroup.hasClass('touched')) {
		      $formGroup.addClass('touched');
		    }
		});

		$(document).on('focusout.material', '.form-group-material .form-control:input', function (e) {
		    var $formGroup = $(e.target);
		    if ($formGroup.val() === '') {
		      $formGroup.removeClass('touched');
		    }
		    if ($formGroup.hasClass('dirty') && $formGroup.val() === '') {
		      $formGroup.removeClass('dirty');
		    }
		});

		$(document).on('keydown.material', '.form-group-material .form-control:input', function (e) {
			var $formGroup = $(e.target);
			if (!$formGroup.hasClass('dirty') && $formGroup.val() !== '') {
				$formGroup.addClass('dirty');
			}
		});
	});
}]);