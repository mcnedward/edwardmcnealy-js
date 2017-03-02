const express = require('express'),
      app = express(),
      fs = require('fs'),
      bodyParser = require('body-parser'),
      fileUpload = require('express-fileupload'),
      request = require('request'),
      path = require('path');

const mapboxAccessToken = "pk.eyJ1IjoiZWR3YXJkbWNuZWFseSIsImEiOiJjaXo3bmszcG0wMGZzMzNwZGd2d2szdmZqIn0.1ycNDtJkOf2K0bBa6tG04g";
const mcnedward = 'http://localhost:8080'; // The server running the Java mcnedward.com
global.environment = 'dev';

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
var modules = __dirname + '/node_modules';
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
app.use('/js/classie', express.static(path.join(modules, './modal-ed/classie' + jsExt)));
app.use('/js/cssParser', express.static(path.join(modules, './modal-ed/cssParser' + jsExt)));
app.use('/js/modernizr', express.static(path.join(modules, './modal-ed/modernizr' + jsExt)));
app.use('/css/tether', express.static(path.join(modules, './tether/dist/css/tether' + cssExt))); 
app.use('/css/bootstrap', express.static(path.join(modules, './bootstrap/dist/css/bootstrap' + cssExt)));
app.use('/css', express.static(path.join(modules, './bootstrap/dist/css')));

// Views
app.use(express.static(path.join(__dirname, './views')));
// Images
app.use('/img', express.static(path.join(__dirname, './public/img')));

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended: true})); 

// API Endpoints
// Color Zones
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

// recaptcha
app.post('/api/recaptcha/verify', (req, res) => {
  var secretResponse = req.query.secretResponse;
  var url = mcnedward + '/api/recaptcha/verify?secretResponse=' + secretResponse;

  request.post(url, (err, response, body) => {
    handleServerResponse(err, response.statusCode, body, res);
  });
})

function handleServerResponse(err, statusCode, body, res, isJson) {
  if (err) {
    console.warn(err);
    res.status(400).send(err);
  } else {
    var result;
    try {
      result = JSON.parse(body);
    } catch(e) {
      result = {};
    }
    if (statusCode === 200) {
      if (isJson) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(result.entity));
      } else {
        res.status(200).send(result.entity);
      }
    } else {
      var message = result.errors && result.errors.length > 0 ? result.errors[0] : 'Something went wrong with your request...';
      res.status(statusCode).send(message);
    }
  }
}

// Parser
app.post('/api/parser/files', (req, res) => {
  if (!req.files || !req.files.files || req.files.files.length === 0) {
    return res.status(400).send('No files were uploaded...');
  }
  var secretResponse = req.query.secretResponse;
  var requestToken = req.query.requestToken;
  var url = mcnedward + '/api/parser/files?secretResponse=' + secretResponse + '&requestToken=' + requestToken;

  var serverRequest = request.post(url, (err, response, body) => {
    handleServerResponse(err, response.statusCode, body, res);
  });
  var form = serverRequest.form();
  var files = req.files.files;
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    form.append('files', file.data, {
      filename: file.name,
      contentType: 'text/plain'
    });
  }
})
app.post('/api/parser/parse', (req, res) => {
  var secretResponse = req.query.secretResponse;
  var requestToken = req.query.requestToken;
  var directory = JSON.stringify(req.body);
  var url = mcnedward + '/api/parser/parse?secretResponse=' + secretResponse + '&requestToken=' + requestToken;

  var options = {
    url: url,
    headers: {
      'content-type': 'application/json'
    },
    body: directory
  };
  request.post(options, (err, response, body) => {
    handleServerResponse(err, response.statusCode, body, res, true);
  });
})
app.get('api/parser/progress', (req, res) => {
  var secretResponse = req.query.secretResponse;
  var requestToken = req.query.requestToken;
  var url = mcnedward + '/api/parser/progress?secretResponse=' + secretResponse + '&requestToken=' + requestToken;

  request.get(url, (err, response, body) => {
    handleServerResponse(err, response.statusCode, body, res);
  })
})

// Number Printer
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
