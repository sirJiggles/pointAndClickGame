/* Level model */

var mongoose = require('mongoose');

var levelSchema = {
	rooms : Array
}

module.exports = mongoose.model('Level', levelSchema);