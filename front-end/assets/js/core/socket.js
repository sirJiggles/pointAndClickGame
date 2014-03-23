/* Websocket test */

// when the server sends a collision event
appVars.socket.on('collision', function (data) {
	console.log(data);
});

// ask the server got a collision event at x:50
appVars.socket.emit('requestCollition', { x: 50 });
