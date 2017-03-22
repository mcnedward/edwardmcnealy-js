const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      fileUpload = require('express-fileupload'),
      path = require('path'),
      routes = require('./routes/routes'),
      sources = require('./sources')
      modules = path.join(__dirname, 'node_modules'),
      lib = path.join(__dirname, 'public', 'js', 'lib'),
      oneDay = 31536000,
      cacheOptions = {
        maxAge: oneDay,
        etag: true
      },
      port = 8484;

global.environment = 'dev';

var bundle = sources(global.environment);
for (var i = 0; i < bundle.length; i++) {
  var item = bundle[i];
  app.use(item.url, express.static(item.path, cacheOptions));
}
// Views
app.use(express.static(path.join(__dirname, 'public', 'views')));

app.use(fileUpload());
app.use(compression({ level: 1 }));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended: true})); 

// API Routes
app.use('/api', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
})

app.listen(port, function() {
  console.log('edwardmcnealy.com listening on port ' + port + '!');
})
