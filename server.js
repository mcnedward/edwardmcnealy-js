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
var jsExt, cssExt;
if (global.environment === 'dev') {
  jsExt = '.js';
  cssExt = '.css';
} else if (global.environment === 'production') {
  jsExt = '.min.js';
  cssExt = '.min.css';
}
// Modules and libraries
app.use('/js/tether', express.static(path.join(modules, 'tether', 'dist', 'js', 'tether' + jsExt), cacheOptions));
app.use('/js/bootstrap', express.static(path.join(modules, 'bootstrap', 'dist', 'js', 'bootstrap' + jsExt), cacheOptions));
app.use('/js/jquery', express.static(path.join(modules, 'jquery', 'dist', 'jquery' + jsExt), cacheOptions));
app.use('/js/angular', express.static(path.join(modules, 'angular', 'angular' + jsExt), cacheOptions));
app.use('/js/angular-ui-router', express.static(path.join(modules, 'angular-ui-router', 'release', 'angular-ui-router' + jsExt), cacheOptions));
app.use('/js/angular-animate', express.static(path.join(modules, 'angular-animate', 'angular-animate' + jsExt), cacheOptions));
app.use('/js/ui-bootstrap', express.static(path.join(modules, 'angular-ui-bootstrap', 'dist', 'ui-bootstrap-tpls' + jsExt), cacheOptions));
app.use('/js/angular-recaptcha', express.static(path.join(modules, 'angular-recaptcha', 'release', 'angular-recaptcha' + jsExt), cacheOptions));
app.use('/js/knockout', express.static(path.join(modules, 'knockout', 'build', 'output', 'knockout-latest' + jsExt), cacheOptions));
app.use('/js/moment', express.static(path.join(modules, 'moment', 'min', 'moment' + jsExt), cacheOptions));
app.use('/js/moment-timezone', express.static(path.join(modules, 'moment-timezone', 'builds', 'moment-timezone-with-data' + jsExt), cacheOptions));
app.use('/js/classie', express.static(path.join(lib, 'classie' + jsExt), cacheOptions));
app.use('/js/cssParser', express.static(path.join(lib, 'cssParser' + jsExt), cacheOptions));
app.use('/js/modernizr', express.static(path.join(lib, 'modernizr' + jsExt), cacheOptions));
app.use('/css/tether', express.static(path.join(modules, 'tether', 'dist', 'css', 'tether' + cssExt), cacheOptions)); 
app.use('/css/bootstrap', express.static(path.join(modules, 'bootstrap', 'dist', 'css', 'bootstrap' + cssExt), cacheOptions));
app.use('/css/font-awesome', express.static(path.join(__dirname, 'public', 'css', 'font-awesome.min.css'), cacheOptions));
// My stuff
app.use('/js/app', express.static(path.join(__dirname, 'public', 'js', manifest['app.min.js'])));
app.use('/css/style', express.static(path.join(__dirname, 'public', 'css', manifest['style.css']), cacheOptions));
app.use('/css/portfolioStyle', express.static(path.join(__dirname, 'public', 'css', manifest['portfolioStyle.css']), cacheOptions));
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts'), cacheOptions));
app.use('/img', express.static(path.join(__dirname, 'public', 'img'), cacheOptions));
app.use(express.static(path.join(__dirname, 'public', 'views')));

app.use(fileUpload());
app.use(compression({
  level: 1
}));
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
