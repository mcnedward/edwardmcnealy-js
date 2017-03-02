const request = require('request'),
      path = require('path'),
      fs = require('fs'),
      appFileName = 'InheritanceInquiry.zip',
      libFileName = 'InheritanceInquiryLib.zip';

function downloadFile(req, res, fileName) {
  var token = req.token;
  if (!token || token === '') {
    res.status(400).send('Could not verify your recaptcha, please try again.');
  } else {
    var filePath = appPath = path.join(__dirname, '..', 'data', 'ii', fileName);
    fs.exists(filePath, (exists) => {
      if (exists) {
        console.log('Downloading: ' + fileName)
        res.download(filePath, fileName);
      } else {
        res.status(404).send('Sorry, could not find the file right now, please try again.');
      }
    })
  }
}
// These routes use the recaptchaRouteController middleware function to verify their recaptcha
module.exports = {
  app: (req, res) => {
    downloadFile(req, res, appFileName);
  },
  library: (req, res) => {
    downloadFile(req, res, libFileName);
  }
}