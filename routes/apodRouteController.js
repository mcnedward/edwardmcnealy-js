const request = require('request'),
  apiKey = 'yBP7s9oe5rIrLKmTV3CjZzxFlR8WeifXAhvQkxBC',
  apodUrl = 'https://api.nasa.gov/planetary/apod';

module.exports = {
  apod: (req, res) => {
    try {
      request.get(apodUrl + '?date=' + req.query.date + '&api_key=' + apiKey, (err, response, body) => {
        if (err) {
          console.warn(err);
          res.status(400).send(err);
        } else {
          if (response.statusCode === 200) {
            res.status(200).send(body);
          } else {
            var data = JSON.parse(body)
            var message;
            if (data && data.msg) {
              message = data.msg;
            } else if (data && data.error && data.error.message) {
              message = data.error.message;
            } else {
              console.warn('Data response from NASA API: ', data);
              message = 'Something went wrong when trying to get the Astronomy Picture of the Day, please try again later.';
            }
            console.log('Message: ' + message);
            res.status(400).send(message);
          }
        }
      });
    } catch (e) {
      console.error('Error in apodRouteController: ', e);
      res.status(400).send('Something went wrong when trying to get the Astronomy Picture of the Day, please try again later.');
    }
  }
}