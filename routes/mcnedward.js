/**
 * Handles the server response from mcnedward.com.
 * @param {*} err 
 * @param {*} statusCode 
 * @param {*} body 
 * @param {*} res 
 * @param {*} isJson 
 * @param {*} callback If the callback is defined, we're using this as a middleware function, and we should call callback to continue. 
 */
module.exports = {
  url: 'http://localhost:8080',
  handleServerResponse: (err, statusCode, body, res, isJson, callback) => {
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
        var responseData;
        if (isJson) {
          res.setHeader('Content-Type', 'application/json');
          responseData = JSON.stringify(result.entity);
        } else {
          responseData = result.entity;
        }
        if (callback) {
          callback(responseData);
          return;
        } else {
          res.status(200).send(responseData);
        }
      } else {
        var message = result.errors && result.errors.length > 0 ? result.errors[0] : 'Something went wrong with your request...';
        res.status(statusCode).send(message);
      }
    }
  }
}