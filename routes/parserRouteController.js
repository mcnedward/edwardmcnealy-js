const request = require('request'),
      mcnedward = require('./mcnedward');

module.exports = {
  files: (req, res) => {
    if (!req.files || !req.files.files || req.files.files.length === 0) {
      return res.status(400).send('No files were uploaded...');
    }
    var secretResponse = req.query.secretResponse;
    var requestToken = req.query.requestToken;
    var url = mcnedward.url + '/api/parser/files?secretResponse=' + secretResponse + '&requestToken=' + requestToken;

    var serverRequest = request.post(url, (err, response, body) => {
      mcnedward.handleServerResponse(err, response.statusCode, body, res);
    });
    var form = serverRequest.form();
    var files = req.files.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      form.append('files', file.data, {
        filename: file.name,
        contentType: file.mimetype
      });
    }
  },
  parse: (req, res) => {
    var secretResponse = req.query.secretResponse;
    var requestToken = req.query.requestToken;
    var directory = JSON.stringify(req.body);
    var url = mcnedward.url + '/api/parser/parse?secretResponse=' + secretResponse + '&requestToken=' + requestToken;

    var options = {
      url: url,
      headers: {
        'content-type': 'application/json'
      },
      body: directory
    };
    request.post(options, (err, response, body) => {
      mcnedward.handleServerResponse(err, response.statusCode, body, res, true);
    });
  },
  progress: (req, res) => {
    var secretResponse = req.query.secretResponse;
    var requestToken = req.query.requestToken;
    var url = mcnedward.url + '/api/parser/progress?secretResponse=' + secretResponse + '&requestToken=' + requestToken;

    request.get(url, (err, response, body) => {
      mcnedward.handleServerResponse(err, response.statusCode, body, res);
    })
  }
}