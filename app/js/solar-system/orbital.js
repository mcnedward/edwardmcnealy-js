function Orbital(parent, options) {
  var self = this;

  self.x = 0;
  self.y = 0;
  self.name = 'Orbital';
  self.parentOrbital = parent;
  self.radius = options.radius;
  self.distance = options.distance;
  self.level = options.level;
  self.color = options.color ? options.color : randomColor();
  self.children = [];

  var speed = random(0.02, 0.04),
      angle = random(0, Math.PI);

  self.createChildren = function(orbitalOptions) {
    var orbitalOption = orbitalOptions[self.level];

    var minSize = parseInt(orbitalOption.minSize()),
        maxSize = parseInt(orbitalOption.maxSize()),
        minDistance = parseInt(orbitalOption.minDistance()),
        maxDistance = parseInt(orbitalOption.maxDistance()),
        count = orbitalOption.count();

    var previousDistance = 0;
    for (var i = 0; i < count; i++) {
      var max = maxSize * (0.3 * i);
      if (maxSize < minSize) maxSize = minSize + 1;
      
      var radius = randomInt(minSize, maxSize);
      var distance = randomInt(minDistance, maxDistance) + previousDistance;
      previousDistance = distance;

      var childOptions = {
        radius: radius,
        distance: distance,
        level: orbitalOption.level(),
        color: orbitalOption.color()
      };

      var child = new Orbital(self, childOptions);
      self.children.push(child);

      if (self.level < 2) {
        child.createChildren(orbitalOptions);
      }
    }
  }

  self.setPosition = function(x, y) {
    self.x = x;
    self.y = y;
  }
  self.setName = function(name) {
    self.name = name;
  }

  self.update = () => {
    angle += speed;
  }

  self.render = (renderer, parent) => {
    var x, y;
    if (parent) {
      var r = self.radius + self.distance + (parent.radius * 0.5);
      self.x = parent.x + r * Math.cos(angle);
      self.y = parent.y + r * Math.sin(angle);
    }

    renderer.ellipse(self.x, self.y, self.radius, self.color);
  }
}