function OrbitalOptions(type, renderer) {
  var self = this;

  self.type = type;

  self.level = ko.observable().extend({numeric: 0});
  self.radius = ko.observable().extend({numeric: 0});
  self.minSize = ko.observable().extend({numeric: 0});
  self.maxSize = ko.observable().extend({numeric: 0});
  self.minDistance = ko.observable().extend({numeric: 0});
  self.maxDistance = ko.observable().extend({numeric: 0});
  self.minCount = ko.observable().extend({numeric: 0});
  self.maxCount = ko.observable().extend({numeric: 0});
  var _color, _useRandomColor;

  self.count = () => {
    return randomInt(self.minCount(), self.maxCount());
  }

  self.color = () => {
    return _useRandomColor ? randomColor() : _color;
  }

  ko.computed(() => {
    if (self.minSize() > self.maxSize()) {
      self.minSize(self.maxSize());
    }
    if (self.maxSize() < self.minSize()) {
      self.maxSize(self.minSize());
    }
  });

  ko.computed(() => {
    if (self.minDistance() > self.maxDistance()) {
      self.minDistance(self.maxDistance());
    }
  });
  ko.computed(() => {
    var maxDistance = (renderer.width / 2) / self.minCount();
    if (self.maxDistance() > maxDistance) {
      self.maxDistance(maxDistance);
    }
  })

  ko.computed(() => {
    if (self.minCount() > self.maxCount()) {
      self.minCount(self.maxCount());
    }
  });
  ko.computed(() => {
    if (self.maxCount() < self.minCount()) {
      self.maxCount(self.minCount());
    }
  });

  self.save = (useDefault) => {
    var options;
    if (useDefault) {
      // Reset everything to the defaults
      options = defaultOptions[self.type];
      create(options);
    } else {
      options = {
        level: self.level(),
        radius: self.radius(),
        minSize: self.minSize(),
        maxSize: self.maxSize(),
        minDistance: self.minDistance(),
        maxDistance: self.maxDistance(),
        minCount: self.minCount(),
        maxCount: self.maxCount(),
        color: self.color(),
        useRandomColor: _useRandomColor
      };
    }
    localStorage.setItem(self.type, JSON.stringify(options));
  }

  const defaultOptions = {
    sun: {
      level: 1,
      radius: 25,
      color: '#FDB813'
    },
    planet: {
      level: 2,
      minSize: 10,
      maxSize: 15,
      minDistance: 20,
      maxDistance: 100,
      minCount: 1,
      maxCount: 6
    },
    moon: {
      level: 3,
      minSize: 2,
      maxSize: 7,
      minDistance: 10,
      maxDistance: 30,
      minCount: 0,
      maxCount: 3,
      color: '#d3d3d3'
    }
  }

  var options = localStorage.getItem(self.type) ? JSON.parse(localStorage.getItem(self.type)) : defaultOptions[self.type];
  create(options);

  function create(options) {
    self.level(options.level);
    self.radius(options && options.radius ? parseInt(options.radius, 10) : 0);
    self.minSize(options && options.minSize ? parseInt(options.minSize, 10) : 10);
    self.maxSize = ko.observable(options && options.maxSize ? parseInt(options.maxSize, 10) : 10);
    self.minDistance(options && options.minDistance ? parseInt(options.minDistance, 10) : 10);
    self.maxDistance(options && options.maxDistance ? parseInt(options.maxDistance, 10) : 10);
    self.minCount(options && options.minCount ? parseInt(options.minCount, 10) : 1);
    self.maxCount(options && options.maxCount ? parseInt(options.maxCount, 10) : 1);
    _color = options && options.color ? options.color : null;
    _useRandomColor = options && options.useRandomColor ? options.useRandomColor : (_color === null);
  }
}
ko.extenders.numeric = function (target, precision) {
  //create a writable computed observable to intercept writes to our observable
  var result = ko.pureComputed({
    read: target,  //always return the original observables value
    write: function (newValue) {
      var current = target(),
        roundingMultiplier = Math.pow(10, precision),
        newValueAsNum = isNaN(newValue) ? 0 : +newValue,
        valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

      //only write if it changed
      if (valueToWrite !== current) {
        target(valueToWrite);
      } else {
        //if the rounded value is the same, but a different value was written, force a notification for the current field
        if (newValue !== current) {
          target.notifySubscribers(valueToWrite);
        }
      }
    }
  }).extend({ notify: 'always' });

  //initialize with current value to make sure it is rounded appropriately
  result(target());

  //return the new computed observable
  return result;
};