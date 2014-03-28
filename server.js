var express = require('express'),
	app = express();

// this tells express to use static files (like index.html) from this dir
// it also works for all the assets in that dir
app.use('/', express.static(__dirname + '/'));

// set up the server on port 3001
var server = app.listen(3001, function(){
	console.log('Server up and running on port %d', server.address().port);
});

