const path = require('path'),
  manifest = require('./rev-manifest.json');
modules = path.join(__dirname, 'node_modules');

module.exports = function (env) {

  function getPath(srcName, type, env) {
    if (env === 'prod') {
      // Get from the manifest
      srcName = manifest[srcName];
    }
    return path.join(__dirname, 'public', type, srcName);
  }

  var bundle = [
    // Libraries
    {
      url: '/js/angular-ui-router',
      path: path.join(modules, 'angular-ui-router', 'release', 'angular-ui-router.min.js')
    },
    {
      url: '/js/ui-bootstrap',
      path: path.join(modules, 'angular-ui-bootstrap', 'dist', 'ui-bootstrap-tpls.min.js')
    },
    {
      url: '/js/angular-recaptcha',
      path: path.join(modules, 'angular-recaptcha', 'release', 'angular-recaptcha.min.js')
    },
    {
      url: '/js/knockout',
      path: path.join(modules, 'knockout', 'build', 'output', 'knockout-latest.js')
    },
    {
      url: '/js/moment',
      path: path.join(modules, 'moment', 'min', 'moment.min.js')
    },
    {
      url: '/js/moment-timezone',
      path: path.join(modules, 'moment-timezone', 'builds', 'moment-timezone-with-data.min.js')
    },
    {
      url: '/js/lib',
      path: path.join(__dirname, 'public', 'js', 'lib', 'lib.min.js')
    },
    {
      url: '/js/bootstrap-datetimepicker',
      path: path.join(__dirname, 'public', 'js', 'lib', 'bootstrap-datetimepicker.min.js')
    },
    {
      url: '/css/font-awesome',
      path: path.join(__dirname, 'public', 'css', 'font-awesome.min.css')
    },
    // My app
    {
      url: '/js/app',
      path: getPath('app.min.js', 'js', env)
    },
    {
      url: '/js/color-zones',
      path: getPath('color-zones.min.js', 'js', env)
    },
    {
      url: '/js/apod',
      path: getPath('apod.min.js', 'js', env)
    },
    {
      url: '/js/solar-system',
      path: getPath('solar-system.min.js', 'js', env)
    },
    {
      url: '/js/utils',
      path: getPath('utils.min.js', 'js', env)
    },
    {
      url: '/js/renderer',
      path: getPath('renderer.min.js', 'js', env)
    },
    // My styles, fonts, and images
    {
      url: '/css/style',
      path: path.join(__dirname, 'public', 'css', manifest['style.css'])
    },
    {
      url: '/css/portfolioStyle',
      path: path.join(__dirname, 'public', 'css', manifest['portfolioStyle.css'])
    },
    {
      url: '/fonts',
      path: path.join(__dirname, 'public', 'fonts')
    },
    {
      url: '/img',
      path: path.join(__dirname, 'public', 'img')
    }
  ]
  return bundle;
}