const express = require('express'),
      app = express(),
      fs = require('fs'),
      bodyParser = require('body-parser'),
      fileUpload = require('express-fileupload'),
      request = require('request'),
      path = require('path'),
      routes = require('./routes/routes');

global.environment = 'dev';

// App
var scriptDir, jsExt, cssExt;
if (global.environment === 'dev') {
  scriptDir = '/app';
  jsExt = '.js';
  cssExt = '.css';

  app.use('/tz_json', express.static(__dirname + '/tz_json'));  // This probably shouldn't be part of production
  
  // Modules
  var modules = __dirname + '/node_modules';
  var lib = path.join(__dirname, 'lib');
  app.use('/js/tether', express.static(path.join(modules, './tether/dist/js/tether' + jsExt)));
  app.use('/js/bootstrap', express.static(path.join(modules, './bootstrap/dist/js/bootstrap' + jsExt)));
  app.use('/js/jquery', express.static(path.join(modules, './jquery/dist/jquery' + jsExt)));
  app.use('/js/angular', express.static(path.join(modules, './angular/angular' + jsExt)));
  app.use('/js/angular-ui-router', express.static(path.join(modules, './angular-ui-router/release/angular-ui-router' + jsExt)));
  app.use('/js/angular-animate', express.static(path.join(modules, './angular-animate/angular-animate' + jsExt)));
  app.use('/js/ui-bootstrap', express.static(path.join(modules, './angular-ui-bootstrap/dist/ui-bootstrap-tpls' + jsExt)));
  app.use('/js/angular-recaptcha', express.static(path.join(modules, './angular-recaptcha/release/angular-recaptcha' + jsExt)));
  app.use('/js/knockout', express.static(path.join(modules, './knockout/build/output/knockout-latest' + jsExt)));
  app.use('/js/moment', express.static(path.join(modules, './moment/min/moment' + jsExt)));
  app.use('/js/moment-timezone', express.static(path.join(modules, './moment-timezone/builds/moment-timezone-with-data' + jsExt)));
  app.use('/js/classie', express.static(path.join(lib, 'classie' + jsExt)));
  app.use('/js/cssParser', express.static(path.join(lib, 'cssParser' + jsExt)));
  app.use('/js/modernizr', express.static(path.join(lib, 'modernizr' + jsExt)));
  app.use('/css/tether', express.static(path.join(modules, './tether/dist/css/tether' + cssExt))); 
  app.use('/css/bootstrap', express.static(path.join(modules, './bootstrap/dist/css/bootstrap' + cssExt)));
  app.use('/css', express.static(path.join(modules, './bootstrap/dist/css')));

} else if (global.environment === 'production') {
  scriptDir = '/public';
  jsExt = '.min.js';
  cssExt = '.min.css';
}
app.use('/js', express.static(__dirname + '/' + scriptDir + '/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/fonts', express.static(__dirname + '/public/fonts')); 
app.use('/img', express.static(path.join(__dirname, './public/img')));
// Views
app.use(express.static(path.join(__dirname, './app/views')));

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended: true})); 

// API Routes
app.use('/api', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/views/index.html'));
})

function fileResponse(req, res, fileName) {
  fs.readFile(fileName, 'utf8', function (err, data) {
    // TODO Handle errors!
    if (err) {
      console.trace('Hmmm... Something went wrong when trying to read the file: ' + err);
      return;
    }
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(data));
  });
}

app.listen(3000, function() {
  console.log('edwardmcnealy.com listening on port 3000!');
})
