var ColorZonesViewModel = function (options) {
  var self = this;

  const hoverZoneColor = '#660d60';
  const timeFormat = 'HH:mm:ss';
  var _hoverTimeZoneKey, _hoverRegionKey;
  var _selectedZoneInfo;
  var _mouseX, _mouseY;
  var renderer = options.renderer;
  var timeZoneService = options.timeZoneService;
  // UI options
  self.colorPicker = ko.observable(options.colorPicker);
  self.opacity = ko.observable(80);
  self.showTimes = ko.observable(false);
  self.colorAllZones = ko.observable(true);
  // Map options
  self.zoom = ko.observable(1);
  self.centerLat = ko.observable(20);
  self.centerLng = ko.observable(0);
  // Cached zones and regions
  self.timeZones = ko.observableArray();
  self.timeZoneRegions = ko.observable({});

  var _textColor = ko.pureComputed(function() {
    return self.colorAllZones() ? 'white' : 'black';
  });

  // Draw Loop
  renderer.render(function() {
    if (self.timeZones().length === 0) return;

    var timeTexts = [];
    // Trigger the intervals to draw all the zones
    for (var i = 0; i < self.timeZones().length; i++) {
      var timeZone = self.timeZones()[i];

      var current = moment().tz(timeZone.name);
      var hours = adjustTime(current.hours());
      var minutes = adjustTime(current.minutes());
      var seconds = adjustTime(current.seconds());

      var red = getColorInterval(self.colorPicker().red, hours, minutes, seconds);
      var green = getColorInterval(self.colorPicker().green, hours, minutes, seconds);
      var blue = getColorInterval(self.colorPicker().blue, hours, minutes, seconds);

      var color = "#" + red + green + blue;
      if (self.colorAllZones()) {
        renderer.polygon(timeZone.coords, color, self.opacity());
      }

      if (timeZone.centroidPolygon === undefined) continue;
      var zoneInfo = {
        textX: timeZone.centroidPolygon.centroid.x,
        textY: timeZone.centroidPolygon.centroid.y,
        time: current.format(timeFormat),
        colorHex: color
      };
      timeTexts.push(zoneInfo);
      if (_hoverTimeZoneKey && _hoverTimeZoneKey !== '' && _hoverTimeZoneKey === timeZone.name) {
        _selectedZoneInfo = zoneInfo;
      }
    }

    var hoverTimeZone = self.timeZoneRegions()[_hoverTimeZoneKey];
    if (hoverTimeZone) {
      $.each(hoverTimeZone, function(index, value) {
        if (!value || !value.coords || value.coords.length === 0) return;
        // Use the color-zone hex when only coloring the hover region
        var hoverColor = self.colorAllZones() ? hoverZoneColor : _selectedZoneInfo.colorHex;
        renderer.polygon(value.coords, hoverColor, 80);
      });

      if (!self.showTimes()) {
        renderer.text(_mouseX, _mouseY - 5, _selectedZoneInfo.time, _textColor(), true);
      }
      renderer.text(_mouseX, _mouseY - 25, _hoverRegionKey, _textColor(), true);
      renderer.text(_mouseX, _mouseY - 45, _selectedZoneInfo.colorHex, _textColor(), true);
    }

    // Need to do this in a separate loop here to have the times drawn on top
    if (!self.showTimes()) return;
    for (var j = 0; j < timeTexts.length; j++) {
      renderer.text(timeTexts[j].textX, timeTexts[j].textY, timeTexts[j].time, _textColor());
    }
  });

  var _mapCallback;
  // Load the map image
  function loadMap(mapCallback) {
    _mapCallback = mapCallback;
    fetch('/api/color-zones/map?centerLat=' + self.centerLat() + '&centerLng=' + self.centerLng() + '&zoom=' + self.zoom() + '&width=' + options.width + '&height=' + options.height)
    .then(function (response) {
      if (!response.ok) {
        console.error('Something went wrong trying to load the map image...');
        return;
      }
      response.text().then(function (mapUrl) {
        renderer.loadImage(mapUrl);
        if (_mapCallback !== undefined)
          _mapCallback();
      });
    });
  }
  loadMap();

  // Load the time zones
  timeZoneService.setup(self.centerLat, self.centerLng, self.zoom); // Pass in the observables
  timeZoneService.loadTimeZones(function(errorMessage) {
    console.error(errorMessage);
  }, self.timeZones, self.timeZoneRegions);

  function adjustTime(interval) {
    if (interval < 10) {
      interval = "0" + interval;
    }
    return interval.toString();
  }

  function getColorInterval(color, hours, minutes, seconds) {
    var interval = self.colorPicker().colors()[color].interval;
    switch (interval) {
      case self.colorPicker().hours:
        return hours;
      case self.colorPicker().minutes:
        return minutes;
      case self.colorPicker().seconds:
        return seconds;
      default:
        console.warn('Could not find an interval for: ' + interval + '...');
    }
  }

  function rayCastTest(points, x, y, zoneName) {
    var rayTest = 0;
    var lastPoint = points[points.length - 1];

    for (var j = 0; j < points.length; j++) {
      var point = points[j];

      if ((lastPoint.y <= y && point.y >= y) || 
          (lastPoint.y > y && point.y < y)) {
        var slope = (point.x - lastPoint.x) / (point.y - lastPoint.y);
        var testPoint = slope * (y - lastPoint.y) + lastPoint.x;
        if (testPoint < x) {
          rayTest++;
        }
      }
      lastPoint = point;
    }
    // If the count is odd, we are in the polygon
    return rayTest % 2 === 1;
  }

  renderer.addMouseOverEvent(function(x, y) {
    if (self.timeZones().length === 0) return;

    var found = false;
    for (var i = 0; i < self.timeZones().length; i++) {
      var zone = self.timeZones()[i];
      var boundingBox = zone.boundingBox;
      if (boundingBox === undefined) return;

      // Source: https://github.com/dosx/timezone-picker
      if (y > boundingBox.xyMax.y && y < boundingBox.xyMin.y &&
          x > boundingBox.xyMin.x && x < boundingBox.xyMax.x) {
        // Mouse is in the zone bounds, so now have to check if it is in one of this zone's regions
        var regions = self.timeZoneRegions()[zone.name];
        for (var key in regions) {
          if (!regions.hasOwnProperty(key)) continue;
          if (rayCastTest(regions[key].coords, x, y)) {
            _hoverTimeZoneKey = zone.name;
            _hoverRegionKey = key;
            _mouseX = x;
            _mouseY = y;
            return;
          }
        }
      }
    }
  }, self.centerLat(), self.centerLng());

  renderer.addMouseScrollEvent(function(zoom) {
    if (zoom > 1) {
      self.zoom(self.zoom() + 1);
    } else {
      self.zoom(self.zoom() - 1);
    }

    if (self.zoom() < 1) {
      // Can't zoom any lower
      self.zoom(1);
      return;
    }
  });
};
