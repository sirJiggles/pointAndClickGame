var express = require('express'),
	app = express(),
	player = require('./routes/player');

// set up the server on port 3000
var server = app.listen(3000, function(){
	console.log('Server up and running on port %d', server.address().port);
});

var io = require('socket.io').listen(server);

// main wrapper for when someone is connected to the game
io.sockets.on('connection', function (socket) {
	player.sockets(socket);
});