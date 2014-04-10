// Class for the navmesh

core.NavMesh = function(){
	
	this.secondDebugDot = new core.DebugDot({'color':'yellow'});
}

// stay in mesh function
core.NavMesh.prototype.stayInMesh = function() {

	// create a vector based on the velocity (20 pixels long)
	var predict = new core.Vector2D(this.velocity);
	predict.normalize();
	predict.mult(20);

	// create a vector 20 pixels in the future based on velocity and location
	var predictedLocation = new core.Vector2D(this.location);
	predictedLocation.add(predict);

	if(core.debugMode){
		this.debugDot.draw(this.target);
		this.secondDebugDot.draw(predictedLocation);
	}

	// check if the predicted location is inside the navmesh, if not we add a force in the oposite direction
	

};