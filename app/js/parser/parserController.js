/**
 * Created by Edward on 2/26/2016.
 */
'use strict';

angular.module('mcnedward')
.controller('ParserCtrl', ['$rootScope', '$scope', '$window', 'parserService', 'recaptchaService',
  function ParserCtrl($rootScope, $scope, $window, parserService, recaptchaService) {

    $scope.uploadInfo = {};
    $scope.isFormSubmitted = false;
    $scope.isParsingComplete = false;
    $scope.fileUploadMessage = "Click to choose a Java file or project to parse!";
    $scope.errorMessage = "";
    $scope.fileSelected = false;
    var errorParsingMessage = "Something went wrong parsing files...Please try again.";
    var errorUploadingMessage = "Something went wrong uploading files...Please try again.";

    $('#file-upload').change(function () {
      var files = this.files;
      if (!files || files.length == 0) {
        console.log('No files selected...');
        return;
      }
      var fileName = files[0].name;
      $scope.files = files;

      $scope.fileName = fileName;
      $scope.fileSelected = true;
      $scope.$apply();
    });

    function errorHandler(message, error) {
      var errorMessage = '';
      var data = error && error.data ? error.data : null,
        errors = data && data.errors ? data.errors : [];
      if (errors.length > 0) {
        for (var i = 0; i < errors.length; i++) {
          errorMessage += errors[i];
        }
      } else {
        errorMessage = message;
      }
      $scope.handleError(errorMessage, error);
      $scope.parsingComplete = false;
    }

    function uploadFiles(secretResponse, token) {
      $scope.secretResponse = secretResponse;
      $scope.token = token;
      parserService.uploadFiles($scope.files, secretResponse, token).then(
        function (response) {
          var uploadResponse = response.data.entity;
          $scope.uploadDirectory.token = uploadResponse.token;
          $scope.uploadDirectory.fileIds = uploadResponse.fileIds;
          try {
            // Send back the uploadResponse along with the directory structure
            // This is when the actual parsing of the files will happen
            parserService.parseFiles($scope.uploadDirectory, secretResponse, token).then(
              function (response) {
                var directoryResponse = response.data.entity;
                parserService.saveDirectory(directoryResponse);

                $scope.load(false);
                $scope.fileSelected = false;
                $scope.isParsingComplete = true;

                $scope.uploadDirectory = {};
                $scope.directory = directoryResponse;
                var classObject = findFirstFileInDirectory(directoryResponse);
                $scope.classObject = classObject;
                styleLineNumbers(classObject);
              }, function (error) {
                errorHandler(errorParsingMessage, error);
              });
          } catch (error) {
            errorHandler(errorParsingMessage, error);
          }
        }, function (error) {
          errorHandler(errorUploadingMessage, error);
        });
    }

    $scope.uploadFile = function (form, uploadInfo) {
      if ($scope.isFormSubmitted) return;
      form.$setSubmitted();
      if (form.$invalid) return;
      $scope.isFormSubmitted = true;
      form.$setPristine();
      form.$setUntouched();
      $scope.load(true);
      recaptchaService.verify(uploadInfo.recaptchaResponse, uploadFiles, errorHandler);
    }

    $scope.selectClassObject = function (file) {
      for (var i = 0; i < $scope.classObjects.length; i++) {
        var cObject = $scope.classObjects[i];
        if (cObject.fileName === file.fileName) {
          $scope.classObject = cObject;
        }
        // This should be safe since we should always have the same number of fileNames and classObjects
        $scope.fileNames[i].isSelected = false;
      }
      file.isSelected = true;
      styleLineNumbers($scope.classObject);
    }

    $scope.filesDropped = function (directory) {
      $scope.fileName = directory.name ? directory.name : directory.uploadFiles.length + ' Files';
      $scope.files = directory.uploadFiles;
      $scope.fileSelected = true;
      $scope.uploadDirectory = directory;
      $scope.$apply();	// Need to apply because this is coming from the fileUploadDirective
    }

    $scope.moveToLine = function (content) {
      var lineNumber = content.lineNumber;
      var element = $('#' + lineNumber);
      element.effect("highlight", {}, 3000);
      $('html, body').animate({
        scrollTop: element.offset().top - 200
      }, 500);
    }
    $rootScope.$on('selectClass', function (e, args) {
      var classObject = searchDirectory($scope.directory, args.directoryId, args.classId);
      if (classObject) {
        $scope.classObject = classObject;
        styleLineNumbers(classObject);
      } else {
        $scope.errorMessage = 'Could not find class.';
      }
    });
    function searchDirectory(directory, directoryId, classId) {
      if (directoryId == directory.id) {
        if (directory.classes) {
          var classObject = searchClassesInDirectory(directory.classes, classId)
          if (classObject) return classObject;
        }
      }
      for (var i = 0; i < directory.directories.length; i++) {
        var childDirectory = directory.directories[i];
        var classObject = searchDirectory(childDirectory, directoryId, classId);
        if (classObject) return classObject;
      }
    }
    function searchClassesInDirectory(classes, classId) {
      for (var i = 0; i < classes.length; i++) {
        var c = classes[i];
        if (c.id == classId) {
          return c;
        }
      }
    }
    function findFirstFileInDirectory(directory) {
      if (directory.classes && directory.classes.length > 0) {
        return directory.classes[0];
      }
      if (directory.directories) {
        for (var i = 0; i < directory.directories.length; i++) {
          classObject = findFirstFileInDirectory(directory.directories[i]);
          if (classObject) return classObject;
        }
      }
      return null;
    }

    // FOR DEBUGGING PURPOSES!
    $scope.directory = parserService.getDirectory();
    if ($scope.directory) {
      $scope.isParsingComplete = true;
      var classObject = findFirstFileInDirectory($scope.directory);
      if (classObject) {
        $scope.classObject = classObject;
        styleLineNumbers(classObject);
      } else {
        $scope.errorMessage = 'Could not find any files in directory ' + $scope.directory.name + '.';
      }
    }

    function setFileNames(classObjects) {
      var fileNames = [];
      angular.forEach(classObjects, function (value, key) {
        fileNames.push({
          fileName: value.fileName,
          isSelected: false
        });
      });
      $scope.fileNames = fileNames;
    }

    // Thanks to: https://jsfiddle.net/tovic/AbpRD/
    function styleLineNumbers(classObject) {
      var pre;
      $('#classContent').empty();
      if (classObject.codeTag) {
        pre = classObject.codeTag;
      } else {
        pre = $('<code/>', {
          id: 'code',
          text: classObject.classContent
        });
        var preLength = pre.length;
        for (var i = 0; i < preLength; i++) {
          pre[i].innerHTML = '<span class="line-number"></span>' + pre[i].innerHTML + '<span class="cl"></span>';
          var num = pre[i].innerHTML.split(/\n/).length;
          for (var j = 0; j < num; j++) {
            var lineNumberElement = pre[i].getElementsByTagName('span')[0];
            var number = j + 1;
            lineNumberElement.innerHTML += '<span id="' + number + '">' + number + '</span>';
          }
        }
        // Cache the code tag to avoid parsing again for multiple selects
        classObject.codeTag = pre;
      }
      pre.appendTo('#classContent');
    }

    // Source: http://stackoverflow.com/questions/5902822/stopping-fixed-position-scrolling-at-a-certain-point
    $.fn.followTo = function (pos) {
      var $this = this,
        $window = $(window),
        $classContent = $('#classContentContainer');

      $window.scroll(function (e) {
        if ($window.scrollTop() > pos) {
          $this.removeClass('class-structure');
          $this.addClass('class-structure-fixed');
          $classContent.addClass('class-content-fixed');
        } else {
          $this.removeClass('class-structure-fixed');
          $classContent.removeClass('class-content-fixed');
          $this.addClass('class-structure');
        }
      });
    };
    $('#classStructure').followTo(380);

  }]);
