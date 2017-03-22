const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      fileUpload = require('express-fileupload'),
      path = require('path'),
      routes = require('./routes/routes'),
      manifest = require('./rev-manifest.json')
      port = 8484;

global.environment = 'production';

const modules = path.join(__dirname, 'node_modules'),
      lib = path.join(__dirname, 'public', 'js', 'lib'),
      oneDay = 31536000,
      cacheOptions = {
        maxAge: oneDay,
        etag: true
      };
// Modules and libraries
app.use('/js/angular-ui-router', express.static(path.join(modules, 'angular-ui-router', 'release', 'angular-ui-router.min.js'), cacheOptions));
app.use('/js/ui-bootstrap', express.static(path.join(modules, 'angular-ui-bootstrap', 'dist', 'ui-bootstrap-tpls.min.js'), cacheOptions));
app.use('/js/angular-recaptcha', express.static(path.join(modules, 'angular-recaptcha', 'release', 'angular-recaptcha.min.js'), cacheOptions));
app.use('/js/knockout', express.static(path.join(modules, 'knockout', 'build', 'output', 'knockout-latest.js'), cacheOptions));
app.use('/js/moment', express.static(path.join(modules, 'moment', 'min', 'moment.min.js'), cacheOptions));
app.use('/js/moment-timezone', express.static(path.join(modules, 'moment-timezone', 'builds', 'moment-timezone-with-data.min.js'), cacheOptions));
app.use('/js/lib', express.static(path.join(lib, 'lib.min.js'), cacheOptions));
app.use('/css/font-awesome', express.static(path.join(__dirname, 'public', 'css', 'font-awesome.min.css'), cacheOptions));
// My stuff
// Javascript
app.use('/js/app', express.static(path.join(__dirname, 'public', 'js', manifest['app.min.js'])));
app.use('/js/color-zones', express.static(path.join(__dirname, 'public', 'js', manifest['color-zones.min.js'])));
app.use('/js/apod', express.static(path.join(__dirname, 'public', 'js', manifest['apod.min.js'])));
app.use('/js/utils', express.static(path.join(__dirname, 'public', 'js', manifest['utils.min.js'])));
// CSS
app.use('/css/style', express.static(path.join(__dirname, 'public', 'css', manifest['style.css']), cacheOptions));
app.use('/css/portfolioStyle', express.static(path.join(__dirname, 'public', 'css', manifest['portfolioStyle.css']), cacheOptions));
// Fonts
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts'), cacheOptions));
// Images
app.use('/img', express.static(path.join(__dirname, 'public', 'img'), cacheOptions));
// Views
app.use(express.static(path.join(__dirname, 'public', 'views')));

app.use(fileUpload());
app.use(compression({ level: 1 }));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended: true})); 

// API Routes
app.use('/api', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
})

app.listen(port, function() {
  console.log('edwardmcnealy.com listening on port ' + port + '!');
})
