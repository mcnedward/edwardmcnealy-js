const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      fileUpload = require('express-fileupload'),
      path = require('path'),
      routes = require('./routes/routes'),
      port = 8484;

global.environment = 'production';

const modules = path.join(__dirname, 'node_modules'),
      lib = path.join(__dirname, 'public', 'js', 'lib'),
      oneDay = 86400000,
      options = {
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
app.use('/js/tether', express.static(path.join(modules, 'tether', 'dist', 'js', 'tether' + jsExt), options));
app.use('/js/bootstrap', express.static(path.join(modules, 'bootstrap', 'dist', 'js', 'bootstrap' + jsExt), options));
app.use('/js/jquery', express.static(path.join(modules, 'jquery', 'dist', 'jquery' + jsExt), options));
app.use('/js/angular', express.static(path.join(modules, 'angular', 'angular' + jsExt), options));
app.use('/js/angular-ui-router', express.static(path.join(modules, 'angular-ui-router', 'release', 'angular-ui-router' + jsExt), options));
app.use('/js/angular-animate', express.static(path.join(modules, 'angular-animate', 'angular-animate' + jsExt), options));
app.use('/js/ui-bootstrap', express.static(path.join(modules, 'angular-ui-bootstrap', 'dist', 'ui-bootstrap-tpls' + jsExt), options));
app.use('/js/angular-recaptcha', express.static(path.join(modules, 'angular-recaptcha', 'release', 'angular-recaptcha' + jsExt), options));
app.use('/js/knockout', express.static(path.join(modules, 'knockout', 'build', 'output', 'knockout-latest' + jsExt), options));
app.use('/js/moment', express.static(path.join(modules, 'moment', 'min', 'moment' + jsExt), options));
app.use('/js/moment-timezone', express.static(path.join(modules, 'moment-timezone', 'builds', 'moment-timezone-with-data' + jsExt), options));
app.use('/js/classie', express.static(path.join(lib, 'classie' + jsExt), options));
app.use('/js/cssParser', express.static(path.join(lib, 'cssParser' + jsExt), options));
app.use('/js/modernizr', express.static(path.join(lib, 'modernizr' + jsExt), options));
app.use('/css/tether', express.static(path.join(modules, 'tether', 'dist', 'css', 'tether' + cssExt), options)); 
app.use('/css/bootstrap', express.static(path.join(modules, 'bootstrap', 'dist', 'css', 'bootstrap' + cssExt), options));
app.use('/css', express.static(path.join(modules, 'bootstrap', 'dist', 'css'), options));
// My stuff
app.use('/js/app', express.static(path.join(__dirname, 'public', 'js', 'app.min.js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), options));
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), options));
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts'), options));
app.use('/img', express.static(path.join(__dirname, 'public', 'img'), options));
app.use(express.static(path.join(__dirname, 'app', 'views')));

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended: true})); 

// API Routes
app.use('/api', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'app', 'views', 'index.html'));
})

app.listen(port, function() {
  console.log('edwardmcnealy.com listening on port ' + port + '!');
})
