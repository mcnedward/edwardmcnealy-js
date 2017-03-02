const request = require('request'),
      mcnedward = require('./mcnedward'),
      path = require('path'),
      fs = require('fs'),
      mapboxAccessToken = "pk.eyJ1IjoiZWR3YXJkbWNuZWFseSIsImEiOiJjaXo3bmszcG0wMGZzMzNwZGd2d2szdmZqIn0.1ycNDtJkOf2K0bBa6tG04g";

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

module.exports = {
  map: (req, res) => {
    var centerLat = req.query.centerLat,
        centerLng = req.query.centerLng,
        zoom = req.query.zoom,
        width = req.query.width,
        height = req.query.height;
    var mapUrl = "https://api.mapbox.com/styles/v1/mapbox/streets-v8/static/" + centerLng + "," + centerLat + "," + zoom + ",0,0/" + width + "x" + height + "?access_token=" + mapboxAccessToken;
    res.send(mapUrl);
  },
  mapBounds: (req, res) => {
    var fileName = path.join(__dirname, '..', 'data', 'tz_json', 'bounding_boxes.json');
    fileResponse(req, res, fileName);
  },
  polygons: (req, res) => {
    var zone = req.params.zone;
    var fileName = path.join(__dirname, '..', 'data', 'tz_json', 'polygons', zone + '.json');
    // var fileName = __dirname + '/data/tz_json/polygons/' + zone + '.json';
    fileResponse(req, res, fileName);
  },
  hoverRegions: (req, res) => {
    var fileName = path.join(__dirname, '..', 'data', 'tz_json', 'hover_regions.json');
    // var fileName = __dirname + '/data/tz_json/hover_regions.json';
    fileResponse(req, res, fileName);
  }
}