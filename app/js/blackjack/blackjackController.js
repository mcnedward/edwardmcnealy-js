/**
 * Created by Edward on 11/8/2014.
 */
angular.module('mcnedward')
.controller('BlackjackCtrl', ['$rootScope', '$scope', '$window', 'blackjackService', 'playerService',
	function BlackjackCtrl($rootScope, $scope, $window, blackjackService, playerService) {
  'use strict';
	
	$scope.player = playerService.getPlayer();
	$scope.dealer = playerService.getDealer();

	$rootScope.$on('busted', function(event, args) {
		var user = args;
		if (user.type == 'player') {
			$scope.message = 'You busted...';
			playerService.userWon('dealer');
		}
		if (user.type == 'dealer') {
			$scope.message = 'Dealer busted! You win!';
			playerService.userWon('player');
		}
		blackjackService.flipCards();
		updateUsers(true);
		toggleOptions(false);
	});
	$rootScope.$on('dealerWon', function() {
		$scope.message = 'Dealer wins...';
		playerService.userWon('dealer');
		updateUsers(true);
		toggleOptions(false);
	});
	$rootScope.$on('playerWon', function() {
		$scope.message = 'You win!';
		playerService.userWon('player');
		updateUsers(true);
		toggleOptions(false);
	});
	$rootScope.$on('push', function() {
		$scope.message = 'Push.';
		updateUsers(true);
		toggleOptions(false);
	});
	$rootScope.$on('21', function(event, args) {
		var user = args;
		if (user.type == 'player') {
			$scope.message = 'You got 21! You win!';
			playerService.userWon('player');
		}
		if (user.type == 'dealer') {
			$scope.message = 'Dealer got 21...';
			playerService.userWon('dealer');
		}
		blackjackService.flipCards();
		updateUsers(true);
		toggleOptions(false);
	});
	
	for (var x = 0; x < 3; x++) {
		var card = $('<img>');
		if (x == 2) {
			card.attr('src', 'img/blackjack/card/b2fv.jpg');
			card.attr('id', 'startCard');
			card.addClass('card-img');
		}
		else {
			card.attr('src', 'img/blackjack/card/b2pl.jpg');
			card.addClass('card-img');
		}
		$('#startCards').append(card);
	}
	
	$scope.dealCards = function() {
		$scope.message = '';
		// Remove hidden placeholder cards
		$('.empty-card').css('display', 'none');
		playerService.resetUsers();
		// Reset hit21 every time new deck is dealt
		$rootScope.hit21 = false;
		blackjackService.dealCards();
		if (!$rootScope.hit21) {
			updateUsers();
			toggleOptions(true);
		}
	};
	
	// Scope functions
	$scope.hitMe = function() {
		blackjackService.hitMe($scope.player);
		updateUsers();
	};
	$scope.stay = function() {
		blackjackService.stay();
		updateUsers();
	};
	$scope.addChip = function(amount) {
		$scope.message = '';
		if ($scope.stopBets) {
			$scope.message = 'You can"t place any more bets now!';
			return;
		}
		if ($scope.player.money < ($scope.player.bet + amount)) {
			$scope.message = 'You don"t have the money to place that bet!';
			return;
		}
		playerService.addChip(amount);
		updateUsers();
	};
	$scope.clearBet = function() {
		$scope.message = '';
		if ($scope.stopBets) {
			if ($scope.player.bet > 0)
				$scope.message = 'You can"t back out now!';
			return;
		}			
		playerService.clearBet();
	};
	
	function updateUsers(save) {
		$scope.player = playerService.getPlayer();
		$scope.dealer = playerService.getDealer();
		if (save) {
			saveUsers();
		}
	}
	function saveUsers() {
		playerService.updateUsers([$scope.player, $scope.dealer]);
	}
	
	function toggleOptions(optionsOn) {
		if (optionsOn) {
			$('#options').show();
			$('#startCards').hide();
			// Disable bets
			$scope.stopBets = true;			
		} else {
			$('#options').hide();
			$('#startCards').show();
			// Enable bets
			$scope.stopBets = false;				
		}
	}
}]);
