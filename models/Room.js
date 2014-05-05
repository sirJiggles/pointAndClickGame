/* Room model */

var mongoose = require('mongoose');

var roomSchema = {
	graph: Array,
	char: String,
	music: String,
	background: String,
	doors: String
}

module.exports = mongoose.model('Room', roomSchema);