/**
 * Created by Edward on 2/28/2016.
 */
'use strict';
angular.module('mcnedward')
.directive('dragAndDrop', ['$rootScope', '$timeout', 'parserService', function($rootScope, $timeout, parserService) {
		
	return {
		restrict: 'E',
		link: function(scope, element, attrs) {
			var defaultDragAreaMessage = 'Drag files here!';
			scope.dragAreaMessage = defaultDragAreaMessage;
			scope.dragoverClass = '';
			scope.uploadProgress = 0;

			scope.handleError = function(message, error) {
				scope.fileSelected = false;
				scope.hasError = true;
				scope.load(false);
				scope.dragoverClass = 'dragover-error';
				scope.dragAreaMessage = '';
				scope.dragAreaError = message;
				console.log(error, message);
			}			
			
			var firstTime = true;
			var loading = false;
			scope.load = function(isLoading) {
				scope.dragAreaError = '';
				if (isLoading) {
					loading = true;
					scope.uploadProgress = 0;
					scope.dragAreaMessage = 'Analyzing your files...';
					checkProgress();
				} else {
					loading = false;
					if (scope.hasError) return;
					scope.dragAreaMessage = 'Finished!';
					scope.dragoverClass = '';
					scope.uploadProgress = 100;
					$timeout(function() {
						scope.dragAreaMessage = defaultDragAreaMessage;
						scope.uploadProgress = 0;
					}, 3000);
				}
			}			
			function checkProgress() {
				$timeout(function() {
					parserService.getUploadProgress(scope.secretResponse, scope.token, function(response) {
						scope.uploadProgress = response.data.entity;
						if (loading) {
							checkProgress();
						}
					});
				}, 300);
			}
			
			element.bind('dragenter', function(e) {
				e.stopPropagation();
				e.preventDefault();
				e.originalEvent.dataTransfer.dropEffect = 'copy';
				scope.dragoverClass = 'dragover';
				scope.dragAreaMessage = 'Drop files!';
				scope.dragAreaError = '';
				scope.$apply();
			});
			element.bind('dragleave', function(e) {
				e.stopPropagation();
				e.preventDefault();
				scope.dragoverClass = '';
				scope.dragAreaMessage = 'Drag files here!';
				scope.dragAreaError = '';
				scope.$apply();
			});
			element.bind('dragover', function(e) {
				e.stopPropagation();
				e.preventDefault();
				e.originalEvent.dataTransfer.dropEffect = 'copy';
				scope.dragoverClass = 'dragover';
				scope.dragAreaMessage = 'Drop files!';
				scope.dragAreaError = '';
				scope.$apply();
			});
			element.bind('dragevent', function(e) {
				e.stopPropagation();
				e.preventDefault();
			});
			element.bind('drop', function(e) {
				e.stopPropagation();
				e.preventDefault();
				
				var fileId = 1;	// Unique id for identifying the file in the server cache
				var onError = function(error) {
					console.log(error);
				}
				
				function handleDirectory(item, directory, topDirectory) {
					var reader = item.createReader();
					return new Promise(function(resolve) {
						var iterationAttempts = [];
						(function readDirectory(directory, topDirectory) {
							reader.readEntries(function(entries) {
								if (!entries.length) {
									Promise.all(iterationAttempts).then(function(result) {
										// Everything should be done now!
										resolve(topDirectory);
									}, onError);
								} else {
									iterationAttempts.push(Promise.all(entries.map(function(entry) {
										if (entry.isFile) {
											entry.file(function(file) {
												parentDirectory.uploadFiles.push(file);
												// Add the fileId to the file name, to be stripped server-side
												var newFile = new com.mcnedward.app.parser.File(fileId++, file.name);
												directory.files.push(newFile);
												return newFile;
											}, function(e) {
												console.log(e);
											});
										} else {
											var newDirectory = new com.mcnedward.app.parser.Directory(entry.name, [], []);
											// If this is inside a directory, put it in there!
											if (directory) {
												directory.directories.push(newDirectory);
											} else {
												directory = newDirectory;
											}
											return handleDirectory(entry, newDirectory, topDirectory);
										}
									})));
									// Continue reading for more entries
									readDirectory(directory, topDirectory);
								}
								});
						})(directory, topDirectory);
					});
				}
				
				var event = e.originalEvent;
				if (event) {
					var dataTransfer = event.dataTransfer;
					var items = dataTransfer.items;
					var parentDirectory = new com.mcnedward.app.parser.Directory();
					parentDirectory.uploadFiles = [];	// All of the files to upload
					if (items.length == 1) {
						var item = items[0].webkitGetAsEntry();
						if (item.isFile) {
							handleFiles(items);
						} else {
							parentDirectory.name = item.name;
							handleDirectory(item, parentDirectory, parentDirectory).then(function(result) {
								notifyDirectoryDone(result);
							}, onError);
						}
					} else {
						handleFiles(items);
					}
				}
				
				function handleFiles(items) {
					var webkitItems = [];
					for (var i = 0; i < items.length; i++) {
						webkitItems.push(items[i].webkitGetAsEntry());
					}
					// Need to wrap this in an empty directory
					return new Promise(function(resolve) {
						var iterationAttempts = [];
						iterationAttempts.push(Promise.all(webkitItems.map(function(item) {
							if (item.isFile) {
								return new Promise(function(resolve) {
									item.file(function(file) {
										parentDirectory.uploadFiles.push(file);
										// Add the fileId to the file name, to be stripped server-side
										var newFile = new com.mcnedward.app.parser.File(fileId++, file.name);
										parentDirectory.files.push(newFile);
										resolve(parentDirectory);
										return newFile;
									}, onError);
								});
							} else {
								var newDirectory = new com.mcnedward.app.parser.Directory(item.name, [], []);
								// If this is inside a directory, put it in there!
								if (parentDirectory) {
									parentDirectory.directories.push(newDirectory);
								} else {
									parentDirectory = newDirectory;
								}
								return handleDirectory(item, newDirectory, parentDirectory);
							}
						})));
						Promise.all(iterationAttempts).then(function(result) {
							// Everything should be done now!
							resolve(parentDirectory);
						}, onError);
					}).then(function(result) {
						notifyDirectoryDone(result);
					}, onError);
				}
				
				function notifyDirectoryDone(file) {
					scope.dragoverClass = 'dropped';
					scope.dragAreaMessage = 'Ready for Upload!';
					scope.$apply();
					scope.filesDropped(file);
				}
			});
		},
		templateUrl: 'app/components/parser/fileUpload.html'
	};
}]);