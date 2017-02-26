var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
global.environment = 'dev';
const mapboxAccessToken = "pk.eyJ1IjoiZWR3YXJkbWNuZWFseSIsImEiOiJjaXo3bmszcG0wMGZzMzNwZGd2d2szdmZqIn0.1ycNDtJkOf2K0bBa6tG04g";

// App
var scriptDir, jsExt, cssExt;
if (global.environment === 'dev') {
  scriptDir = '/app';
  jsExt = '.js';
  cssExt = '.css';
  app.use('/tz_json', express.static(__dirname + '/tz_json'));  // This probably shouldn't be part of production
  app.use('/js', express.static(__dirname + '/public/lib'));    // Should this lib folder?
} else if (global.environment === 'production') {
  scriptDir = '/public';
  jsExt = '.min.js';
  cssExt = '.min.css';
}
app.use('/js', express.static(__dirname + '/' + scriptDir + '/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/fonts', express.static(__dirname + '/public/fonts')); 

// Modules
var modules = __dirname + '/node_modules/';
app.use('/js/tether', express.static(modules + 'tether/dist/js/tether' + jsExt));
app.use('/js/bootstrap', express.static(modules + 'bootstrap/dist/js/bootstrap' + jsExt));
app.use('/js/jquery', express.static(modules + 'jquery/dist/jquery' + jsExt));
app.use('/js/angular', express.static(modules + 'angular/angular' + jsExt));
app.use('/js/angular-ui-router', express.static(modules + 'angular-ui-router/release/angular-ui-router' + jsExt));
app.use('/js/angular-animate', express.static(modules + 'angular-animate/angular-animate' + jsExt));
app.use('/js/ui-bootstrap', express.static(modules + 'angular-ui-bootstrap/dist/ui-bootstrap-tpls' + jsExt));
app.use('/js/angular-recaptcha', express.static(modules + 'angular-recaptcha/release/angular-recaptcha' + jsExt));
app.use('/js/knockout', express.static(modules + 'knockout/build/output/knockout-latest' + jsExt));
app.use('/js/moment', express.static(modules + 'moment/min/moment' + jsExt));
app.use('/js/moment-timezone', express.static(modules + 'moment-timezone/builds/moment-timezone-with-data' + jsExt));
app.use('/css/tether', express.static(modules + 'tether/dist/css/tether' + cssExt)); 
app.use('/css/bootstrap', express.static(modules + 'bootstrap/dist/css/bootstrap' + cssExt)); 
app.use('/css', express.static(modules + 'bootstrap/dist/css'));

// Views
app.use(express.static(path.join(__dirname, './views')));

// Images
app.use('/img', express.static(path.join(__dirname, './public/img')));

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/json'}));

// API Endpoints
app.get('/api/map', function(req, res) {
  var centerLat = req.query.centerLat,
      centerLng = req.query.centerLng,
      zoom = req.query.zoom,
      width = req.query.width,
      height = req.query.height;
  var mapUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v8/static/" + centerLng + "," + centerLat + "," + zoom + ",0,0/" + width + "x" + height + "?access_token=" + mapboxAccessToken;
  res.send(mapUrl);
})
app.get('/api/map-bounds', function(req, res) {
  var fileName = __dirname + '/tz_json/bounding_boxes.json';
  fileResponse(req, res, fileName);
})
app.get('/api/polygons/:zone', function(req, res) {
  var zone = req.params.zone;
  var fileName = __dirname + '/tz_json/polygons/' + zone + '.json';
  fileResponse(req, res, fileName);
})
app.get('/api/hover-regions', function(req, res) {
  var fileName = __dirname + '/tz_json/hover_regions.json';
  fileResponse(req, res, fileName);
})
app.get('/api/number-printer/convert', (req, res) => {
  var number = req.query.number;
  var result = {
    'englishWord': 'one',
    'romanNumeral': 'I'
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
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
