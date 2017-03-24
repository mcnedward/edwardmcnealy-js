function AstroPicOfDay(service) {
  var self = this;

  self.fromDate = ko.observable(moment().subtract(1, 'M'));
  self.toDate = ko.observable(moment());
  self.loading = ko.observable(true);
  self.loadCount = ko.observable();
  self.apods = ko.observableArray();
  self.rows = ko.observableArray();
  self.error = ko.observable();
  var alertError = $('#alertError');
  const dateFormat = 'YYYY-MM-DD';

  /**
   * Creates the grids for the apods. Should only be called once all APIs have finished (check self.loadCount())
   * @param {*[]} apods - An array of apod objects
   */
  function layoutImages(apods) {
    // Clear the old
    self.rows.removeAll();
    // Sort by date
    self.apods.sort((left, right) => {
      var leftDate = moment(left.date);
      var rightDate = moment(right.date);
      return leftDate.isSame(rightDate) ? 0 : (leftDate.isAfter(rightDate) ? 1 : -1);
    });

    var cols = [];
    for (var i = 1; i <= apods.length; i++) {
      cols.push(apods[i - 1]);
      if (i % 7 === 0) {
        // Create a row of 12
        self.rows.push(cols);
        cols = [];
      }
    }
    if (cols.length > 0) {
      self.rows.push(cols);
    }
    self.loading(false);

    // Toggle the tooltips, need the timeout...
    setTimeout(() => {
      $('[data-toggle="popover"]').popover({
        trigger: 'focus',
        container: 'body'
      });
    }, 500);
  }

  function loadImages() {
    self.apods.removeAll();
    var dayDiff = moment(self.toDate()).diff(moment(self.fromDate()), 'd');
    self.loadCount(dayDiff);
    var fromDate = moment(self.fromDate());
    for (var i = 0; i <= self.loadCount(); i++) {
      var requestDate = fromDate.format(dateFormat);
      service.getApod(requestDate, successCallback, errorCallback);
      fromDate.add(1, 'd');
    }
  }
  loadImages();

  ko.computed(() => {
    var apodCount = self.apods().length;
    if (apodCount >= self.loadCount()) {
      // All images should be ready (might need to update this, in case some of the images could not be loaded)
      layoutImages(self.apods());
    }
  });

  var rawFromDate;
  // Validate the fromDate
  ko.computed(() => {
    var fromDate = moment(self.fromDate());
    if (rawFromDate && rawFromDate.isSame(fromDate, 'day')) {
      // No change, so nothing to do here
      return;
    }
    var monthBefore = moment(self.toDate.peek()).subtract(1, 'M');
    if (fromDate.isBefore(monthBefore, 'day')) {
      showError('Too far in the past!');
      self.fromDate(rawFromDate);
      return;
    }
    var dayBefore = moment(self.toDate.peek()).subtract(1, 'd');
    if (fromDate.isAfter(dayBefore, 'day')) {
      showError('Too far in the future!');
      self.fromDate(rawFromDate);
      return;
    }
    if (rawFromDate) {
      // Don't load images if this is the first time
      loadImages();
    }
    rawFromDate = moment(self.fromDate.peek());
  });
  var rawToDate;
  // Validate the toDate
  ko.computed(() => {
    var toDate = moment(self.toDate());
    if (rawToDate && rawToDate.isSame(toDate, 'day')) {
      // No change, so nothing to do here
      return;
    }
    var monthAfter = moment(self.fromDate.peek()).add(1, 'M');
    if (toDate.isAfter(monthAfter, 'day')) {
      showError('Too far in the future!');
      self.toDate(rawToDate);
      return;
    }
    var dayAfter = moment(self.fromDate.peek()).add(1, 'd');
    if (toDate.isBefore(dayAfter, 'day')) {
      showError('Too far in the past!');
      self.toDate(rawToDate);
      return;
    }
    if (rawToDate) {
      // Don't load images if this is the first time
      loadImages();
    }
    rawToDate = moment(self.toDate.peek());
  });

  function successCallback(apod) {
    self.apods.push(apod);
  }
  function errorCallback(text) {
    showError(text);
  }
  function showError(text) {
    self.error(text);
    alertError.fadeIn('slow');
  }
  self.closeAlertError = () => {
    alertError.fadeOut('slow');
  };
}