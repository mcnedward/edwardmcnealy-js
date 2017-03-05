# edwardmcnealy

## Helpful Hints

### Server Commands
On edwardmcnealy.com, the node server is being ran by pm2. Here are some useful commands.

Start the server:
* pm2 start /opt/node/edwardmcnealy/server.js -i 0 --name "edwardmcnealy"

Restart the server:
* pm2 restart edwardmcnealy

Show the server status:
* pm2 show edwardmcnealy

Show logs:
* pm2 logs edwardmcnealy --lines 1000

### Installing
When doing a clean install of the server (with npm install) a few of the dependencies are named weird, so you have to manually resolve some issues.
* Knockout names it's minified js file with .debug, so I need to rename it to knockout-latest.min.js
* There's something with angular-ui-bootstrap (update this next time I install and have to fix it)
* The following 3 dependencies are not included with node, so make sure they, along with their minified versions, exist in public/js/lib. You might need to run the gulp build-scripts task.
  - classie.js
  - cssParser.js
  - modernizr.js

### Warnings
Linux file names are case sensitive, so make sure any file you try to access is typed strongly.
