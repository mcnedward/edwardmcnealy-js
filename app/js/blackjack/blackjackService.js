/**
 * Created by Edward on 11/24/2014.
 */
'use strict';
angular.module('mcnedward')
.service('blackjackService', ['$rootScope', 'playerService', function($rootScope, playerService) {
	
	var blackjackService = {};
	var suits = ['clubs', 'spades', 'diamonds', 'hearts'];
	var cards = [];
	
	function createCard(suit, value) {
		var name, srcName;
		if (value == 1 || value > 10) {
			switch (value) {
				case 1:
					name = 'Ace';
					value = 11;
					break;
				case 11:
					name = 'Jack';
					value = 10;
					break;
				case 12:
					name = 'Queen';
					value = 10;
					break;
				case 13:
					name = 'King';
					value = 10;
					break;
			}
			srcName = suit.substring(0, 1).toLowerCase() + name.substring(0, 1).toLowerCase();
		} else {
			name = value;
			srcName = suit.substring(0, 1).toLowerCase() + value;
		}
		var id = suit + name;
		return {
			suit: suit,
			name: name,
			value: value,
			id: id,
			isFaceDown: false,
			src: 'img/blackjack/card/' + srcName + '.png',
		};
	}
	
	function createCards() {
		cards = [];
		for (var i = 0; i < suits.length; i++) {
			for (var value = 1; value < 14; value++) {
				var card = createCard(suits[i], value);
				cards.push(card);
			}
		}
	}
	
	blackjackService.dealCards = function() {
		shuffle();
		//fixDeck();
		for (var x = 0; x < 4; x++) {
			if ((x % 2) == 0) {
				dealCard(playerService.getPlayer());
			} else {
				if (x == 3)
					dealCard(playerService.getDealer(), true);
				else
					dealCard(playerService.getDealer());
			}
		}
	}
	
	function dealCard(user, faceDown) {
		var card = cards[0];
		if (faceDown)
			card.isFaceDown = faceDown;
		playerService.addCard(user, card);
		
		cards.splice(cards.indexOf(card), 1);
	}
	
	blackjackService.hitMe = function(user) {
		dealCard(user);
	}
	
	blackjackService.stay = function() {
		var dealer = playerService.getDealer();
		for (var x = 0; x < dealer.cards; x++) {
			if (dealer.cards[x].isFaceDown) {
				dealer.cards[x].faceDown = false;
			}
		}
		while (dealer.handValue < 17) {
			dealCard(dealer);
		}
		if (dealer.handValue > 21) {
			$rootScope.$broadcast('dealerBusted');
		} else if (dealer.handValue > playerService.getPlayer().handValue) {
			$rootScope.$broadcast('dealerWon');
		} else if (dealer.handValue == playerService.getPlayer().handValue) {
			$rootScope.$broadcast('push');
		} else {
			$rootScope.$broadcast('playerWon');
		}
		$rootScope.$broadcast('showCards');
	}
	
	// Fischer-Yates shuffle
	function shuffle() {
		createCards();
		
		var cardsCopy = [], cardsCount = cards.length, i;

		// While there are still cards in original deck...
		while (cardsCount) {
			// Pick a random card
			i = Math.floor(Math.random() * cards.length);
			var card = cards[i];
			// If not already shuffled, move it to the new array.
			if (i in cards) {
				cardsCopy.push(card);
				delete cards[i];
				cardsCount--;
			}
		}
		cards = cardsCopy;
		return cards;
	}
	
	function fixDeck() {
		cards.push(createCard('clubs', 1));
		cards.push(createCard('clubs', 1));
		cards.push(createCard('clubs', 10));
		cards.push(createCard('clubs', 9));
		cards.push(createCard('clubs', 1));
		cards.push(createCard('clubs', 7));
		cards.push(createCard('clubs', 10));
		cards.push(createCard('clubs', 9));
	}
	
	// Spin through dealer's cards and flip any face downs
	blackjackService.flipCards = function() {
		for (var c = 0; c < playerService.getDealer().cards.length; c++) {
			var card = playerService.getDealer().cards[c];
			if (card.isFaceDown) {
				card.isFaceDown = false;
				playerService.getDealer().table.find($('#' + card.id)).attr('src', card.src);
			}			
		}
	}

	return blackjackService;
}]);