var app = angular.module('mcnedward', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'vcRecaptcha'])
.config([ '$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

	$stateProvider
    .state('app', {
      url: '/',
      templateUrl: 'home',
      title: 'Edward McNealy'
    })
		.state('ii', {
			url: '/inheritance-inquiry',
			templateUrl: 'js/components/ii/iiMain.html',
			controller: 'IICtrl',
			title: 'Inheritance Inquiry'
		})
		.state('bramble', {
			url: '/bramble',
			templateUrl: 'js/components/bramble/bramble.html',
			title: 'Bramble'
		})
		.state('keepfit', {
			url: '/keepfit',
			templateUrl: 'js/components/keepfit/keepfit.html',
			title: 'KeepFit'
		})
		.state('parser', {
			url: '/parser',
			templateUrl: 'js/components/parser/parser.html',
			controller: 'ParserCtrl',
			title: 'Parser'
		})
		.state('blackjack', {
			url: '/blackjack',
			templateUrl: 'js/components/blackjack/blackjack.html',
			controller: 'BlackjackCtrl',
			title: 'Blackjack'
		})
		.state('numberPrinter', {
			url: '/numberprinter',
			templateUrl: 'js/components/numberPrinter/numberPrinter.html',
			controller: 'NumberPrinterCtrl',
			title: 'Number Printer'
		});

	$urlRouterProvider.otherwise('/');
	$urlRouterProvider.when('/ii', '/inheritance-inquiry');

	$locationProvider.html5Mode(true);

}]);