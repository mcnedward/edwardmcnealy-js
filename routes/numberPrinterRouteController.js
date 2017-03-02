const request = require('request'),
      mcnedward = require('./mcnedward');

module.exports = {
  convert: (req, res) => {
    var number = req.query.number;
    var url = mcnedward.url + '/api/number-printer?number=' + number;

    request.post(url, (err, response, body) => {
      mcnedward.handleServerResponse(err, response.statusCode, body, res);
    });
  }
}