/**
 * Created by Edward on 6/9/2016.
 */
'use strict';

angular.module('mcnedward')
.factory('userService', [function() {

	var userService = {};

	var savedUser = null;

	userService.clearCache = function() {
		localStorage.removeItem('user');
		this.savedUser = null;
	}

	userService.isLoggedIn = function() {
		return this.getAuthToken() != null;
	}

	userService.isAdmin = function() {
		if (!this.savedUser)
			this.getUser();
		if (this.savedUser.userRoles && this.savedUser.userRoles.indexOf('ADMIN') != -1)
				return true;
		else
			return false;
	}

	userService.save = function(user) {
		if (user && user.authToken != '') {
			localStorage.user = JSON.stringify(user);
			this.savedUser = user;
		} else {
			console.log('No user to save.');
		}
	}

	userService.update = function() {
		this.save(this.getUser());
	}

	userService.getUser = function() {
		if (!this.savedUser) {
			this.savedUser = localStorage.user ? JSON.parse(localStorage.user) : [];
		}
		return this.savedUser;
	}

	userService.getAuthToken = function() {
		if (!this.savedUser)
			this.getUser();
		if (this.savedUser.authToken && this.savedUser.authToken != '') {
			return this.savedUser.authToken;
		} else {
			return null;
		}
	}

	return userService;
}]);
