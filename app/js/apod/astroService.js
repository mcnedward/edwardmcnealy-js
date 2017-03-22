function AstroService() {
  var self = this;

  const apodKey = 'apods';

  /**
   * Gets an Apod, with the callback containing the apod on success, and the errCallback containing a string error message. The apodDate must be a string in the format YYYY-MM-DD.
   */
  self.getApod = (apodDate, callback, errCallback) => {
    // First try and get the image from local storage
    var apod = getApod(apodDate);
    if (apod !== null) {
      callback(apod);
      return;
    }
    requestApod(apodDate, callback, errCallback);
  }

  function requestApod(apodDate, callback, errCallback) {
    fetch('/api/apod?date=' + apodDate).then((response) => {
      if (!response.ok) {
        response.text().then((text) => {
          errCallback(text);
        });
        return;
      }
      response.json().then((data) => {
        var apod = new Apod(data);
        // Save the apod in local storage
        saveApod(apod);
        callback(apod);
      });
    });
  }

  /**
   * Gets an Apod from local storage. The apodDate must be a string in the format YYYY-MM-DD.
   * @param {*string} apodDate 
   */
  function getApod(apodDate) {
    var apodsString = localStorage.getItem(apodKey);
    if (apodsString) {
      var apods = JSON.parse(apodsString);
      return apods[apodDate] ? apods[apodDate] : null;
    }
    return null;
  }

  function saveApod(apod) {
    var apods;
    var apodsString = localStorage.getItem(apodKey);
    if (apodsString) {
      apods = JSON.parse(apodsString);
    }
    if (!apods) {
      apods = {};
    }
    apods[apod.date] = apod;
    localStorage.setItem(apodKey, JSON.stringify(apods));
  }

}