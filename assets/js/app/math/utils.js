/* handy math functions */
core.MathUtils = function(){
	
}

// Get the angle between two vectors */
core.MathUtils.prototype.angleBetween = function(v1, v2){
	if(typeof v1 !== 'object' && typeof v2 !== 'object'){
		core.debug('call to angle between with incorrect types', 'Warning');
		return false;
	}

	var dot = v1.dot(v2);
	var theta = Math.acos(dot / (v1.mag() * v2.mag()));
	return theta;
}

// get the normal point between start and end of path for a position vector (scalar projection)
core.MathUtils.prototype.getNormalPoint = function(path, predictedLoc){

	// vector from the start of the line to the predicted location
	var startToVehicle = new core.Vector2D(path.start);
	startToVehicle.sub(predictedLoc);

	// vector from start to end of line segment
	var startToEnd = new core.Vector2D(path.start);
	startToEnd.sub(path.end);

	startToEnd.normalize();
	// A.B = ||A|| * 1 * cos(theta)
	startToEnd.mult(startToVehicle.dot(startToEnd));

	var normalPoint = new Vector2D(path.start);
	normalPoint.add(startToEnd);

	return normalPoint;
}