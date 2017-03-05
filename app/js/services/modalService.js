/**
 * Created by Edward on 10/18/2014.
 */
angular.module('mcnedward')
.factory('modalService', ['$timeout',
  function ($timeout) {
  'use strict';
		
	var modalService = {};
	var overlay, modal, close;

	function removeModal( hasPerspective ) {
		classie.remove( modal, 'md-show' );
	}

	function removeModalHandler() {
		removeModal(); 
	}
	
	modalService.showModal = function(modalId) {
		modal = document.querySelector('#' + modalId);
		classie.add( modal, 'md-show' );
		
		overlay = document.querySelector('#overlay-' + modalId);
		overlay.removeEventListener( 'click', removeModalHandler );
		overlay.addEventListener( 'click', removeModalHandler );
		
		close = modal.querySelector('.cancel-btn');
		close.addEventListener( 'click', function( ev ) {
			ev.stopPropagation();
			removeModalHandler();
		});	
	};
	modalService.closeModal = function() {
		removeModalHandler();
	};
	modalService.isOpen = function() {
		return modal !== undefined;
	};
	
	function showLoading(show) {
		var loadingDiv = $('#pageLoader');
		if (show) {
			loadingDiv.show();
		}
		else {
			loadingDiv.hide();
		}
	}
	
	return modalService;

}]);