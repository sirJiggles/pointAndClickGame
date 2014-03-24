/* Websocket test */

// when the server sends a collision event
core.socket.on('collision', function (data) {
	console.log(data);
});

// ask the server got a collision event at x:50
core.socket.emit('requestCollition', { x: 50 });
