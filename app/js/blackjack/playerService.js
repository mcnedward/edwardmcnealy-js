/**
 * Created by Edward on 11/24/2014.
 */
'use strict';
angular.module('mcnedward')
.service('playerService', ['$rootScope', function($rootScope) {
	var playerService = {},
		users = {};

	function updateUser(user) {
		users[user.type] = user;
		localStorage.users = JSON.stringify(users);
	}
	function updateUsers(users) {
		for (var i = 0; i < users.length; i++) {
			var user = users[i];
			updateUser(user);
		}
	}
	
	playerService.getPlayer = function() {
		return users['player'];
	}
	playerService.getDealer = function() {
		return users['dealer'];
	}
	playerService.resetUsers = function() {
		initUsers();
	}	
	// Find the user based on the passed in user's type, then update
	playerService.updateUser = function(user) {
		updateUser(user);
	}
	// Update all playerService
	playerService.updateUsers = function(users) {
		updateUsers(users);
	}
	playerService.addCard = function(user, card) {
		user.cards.push(card);
		user.handValue = user.handValue + card.value;
		if (user.handValue > 21) {
			adjustForAces(user);
		}
		if (user.handValue == 21) {
			$rootScope.$broadcast('21', user);
			$rootScope.hit21 = true;
		}
	}
	playerService.addChip = function(amount) {
		users.player.chips['chip' + amount + 's']++;
		users.player.bet = users.player.bet + amount;
		updateUser(users.player);
	}
	playerService.clearBet = function() {
		users.player.bet = 0;
		users.player.chips = getChips();	
	}
	playerService.userWon = function(userType) {
		var player = users.player;
		var dealer = users.dealer;
		if (userType == 'player') {
			player.wins = player.wins + 1;
			dealer.loses = dealer.loses + 1;
			player.money += player.bet;
		} else {
			dealer.wins = dealer.wins + 1;
			player.loses = player.loses + 1;
			player.money -= player.bet;
		}
		player.bet = 0;
		player.chips = getChips();
		updateUsers([player, dealer]);
	}
	
	// Called when service is created, and when a new deck is dealt
	function initUsers() {
		function clearHand(user) {
			user.cards = [];
			user.handValue = 0;	
		}
		// Get users from localStorage. This converts their tables back to a jQuery element as well
		function getSavedUsers() {
			var savedUsers = JSON.parse(localStorage.users);
			savedUsers.player.table = $(savedUsers.player.table.selector);
			savedUsers.dealer.table = $(savedUsers.dealer.table.selector);
			return savedUsers;
		}
		// If users already exist, use them
		if (localStorage.users && localStorage.users.length > 2) {
			var savedUsers = getSavedUsers();
			var player = savedUsers.player;
			var dealer = dealer = savedUsers.dealer;
			clearHand(player);
			clearHand(dealer);
			updateUsers([player, dealer]);
		} else {
			users['player'] = {
				table: $('#pTable'),
				cards: [],
				handValue: 0,
				type: 'player',
				money: 1000,
				bet: 0,
				chips: getChips(),
				wins: 0,
				loses: 0,
			};
			users['dealer'] = {
				table: $('#dTable'),
				cards: [],
				handValue: 0,
				type: 'dealer',
				wins: 0,
				loses: 0,
			};
			localStorage.users = JSON.stringify(users);
		}
	}
  initUsers();
	
	function getChips() {
		return {
			chip5s: 0,
			chip10s: 0,
			chip25s: 0,
			chip100s: 0,
			chip500s: 0,
		};
	}
	
	// Check the user's hand for Aces. If there is an ace with the value of 11, change the value to 1
	// If the hand value is over 21 after adjusting, the player busts
	function adjustForAces(user) {
		for (var x = 0; x < user.cards.length; x++) {
			if (user.cards[x].name == 'Ace') {
				// If ace card not already adjusted, fix that
				if (user.cards[x].value == 11) {
					user.cards[x].value = 1;
					updateUserHandValue(user);
				}
				// Stop spinning if hand value less than 21
				if (user.handValue < 21)
					break;
			}
		}
		if (user.handValue > 21) {
			$rootScope.$broadcast('busted', user);
		}
	}
	
	function updateUserHandValue(user) {
		var value = 0;
		for (var x = 0; x < user.cards.length; x++) {
			value = value + user.cards[x].value;
		}
		user.handValue = value;
		updateUser = user;
	}
	
	return playerService;
}]);