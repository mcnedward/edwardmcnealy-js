const request = require('request'),
      mcnedward = require('./mcnedward');

module.exports = {
  verify: (req, res) => {
    var secretResponse = req.query.secretResponse;
    var url = mcnedward.url + '/api/recaptcha/verify?secretResponse=' + secretResponse;

    request.post(url, (err, response, body) => {
      mcnedward.handleServerResponse(err, response.statusCode, body, res);
    });
  }
}