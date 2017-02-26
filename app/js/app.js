var app = angular.module('mcnedward', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'vcRecaptcha'])
.config([ '$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

	$stateProvider
    .state('app', {
      url: '/',
      templateUrl: 'core/home.html',
      title: 'Edward McNealy'
    })
		.state('ii', {
			url: '/inheritance-inquiry',
			templateUrl: 'ii/ii.html',
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