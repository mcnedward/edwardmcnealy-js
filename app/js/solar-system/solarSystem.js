function SolarSystem(renderer) {
  var self = this;

  self.sunOptions = ko.observable(new OrbitalOptions('sun', renderer));
  self.planetOptions = ko.observable(new OrbitalOptions('planet', renderer));
  self.moonOptions = ko.observable(new OrbitalOptions('moon', renderer));

  var sun,
      stars;
  const starCount = 500,
        starRadius = 0.5,
        starColor = '#ffffff';
  self.generateSolarSystem = function() {
    sun = new Orbital(null, {
      level: self.sunOptions().level(),
      radius: self.sunOptions().radius(),
      color: self.sunOptions().color(),
    });
    sun.setName('The Sun');

    var orbitalOptions = [self.sunOptions(), self.planetOptions(), self.moonOptions()];
    sun.createChildren(orbitalOptions);

    // Create the stars every time as well, in case the view size has changed
    stars = [];
    for (var i = 0; i < starCount; i++) {
      var x = randomInt(renderer.originX, renderer.width);
      var y = randomInt(renderer.originY, renderer.height);
      stars.push({x: x, y: y});
    }

    // Save the current options
    self.sunOptions().save();
    self.planetOptions().save();
    self.moonOptions().save();
  };
  self.generateSolarSystem();

  self.resetToDefault = () => {
    self.sunOptions().save(true);
    self.planetOptions().save(true);
    self.moonOptions().save(true);
    self.generateSolarSystem();
  };

  renderer.render(() => {
    renderStars();
    sun.update();
    sun.render(renderer);
    renderChildren(renderer, sun);
  });

  function renderStars() {
    for (var i = 0, l = stars.length; i < l; i++) {
      var star = stars[i];
      star.x += 1;
      star.y += 0.5;
      renderer.ellipse(star.x, star.y, starRadius, starColor);

      if (star.x > renderer.width) {
        star.x = renderer.originX;
      }
      if (star.y > renderer.height) {
        star.y = renderer.originY;
      }
    }
  }

  function renderChildren(renderer, orbital) {
    for (var i = 0; i < orbital.children.length; i++) {
      var child = orbital.children[i];
      child.update();
      child.render(renderer, orbital);
      renderChildren(renderer, child);
    }
  }
}