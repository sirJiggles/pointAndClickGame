/* Socket routes for the player resource */

exports.sockets = function(socket) {
	
	socket.on('requestCollition', function (data) {
		//process the collisoin based on the data
		socket.emit('collision', { name:'collided' });
	});
};