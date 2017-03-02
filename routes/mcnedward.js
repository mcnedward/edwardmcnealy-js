/**
 * Handles the server response from mcnedward.com.
 * @param {*} err 
 * @param {*} statusCode 
 * @param {*} body 
 * @param {*} res 
 * @param {*} isJson 
 */
module.exports = {
  url: 'http://localhost:8080',
  handleServerResponse: (err, statusCode, body, res, isJson) => {
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
}