/* Mover function, for all things that move */

core.Mover = function(){
	
	// introduce physics
	this.location = new core.Vector2D;
	this.velocity = new core.Vector2D;
	this.acceleration = new core.Vector2D;

	this.moving = false;
	this.target = new core.Vector2D;
	this.originalTarget = new core.Vector2D;

	this.debugDot = new core.DebugDot;
	this.secondDebugDog = new core.DebugDot({'color':'yellow'});

}

// apply force function (accleration gets added the force)
core.Mover.prototype.applyForce = function(force){
	// could introduce mass here :D

	this.acceleration.add(force);
}

/* Seek function to move toward something */
core.Mover.prototype.seek = function(optionalTarget){

	// get the desired location vector
	var desired = new core.Vector2D( (typeof optionalTarget !== 'undefined') ? optionalTarget : this.target);
	desired.sub(this.location);

	// work out how far we are from the target
	var distance = desired.mag();

	// ring around the target
	if(distance < 50){
		// the speed depends on the distance from the target (give some easing)
		desired.mult(0.5);
	}else{
		// continue to move as fast as possible to target
		desired.normalize();
		desired.mult(this.topSpeed);
	}


	if(distance < 150 && this.path){
			// if we are on the start or end of our current path
			//if(this.location.x == this.path.start || this.location.x == this.path.end){
		this.switchPathCheck();

	}

	if(distance < 10 && !this.path){
		//stop moving we are as close as we want to get right now
		this.moving = false;
	}

	var steering = new core.Vector2D(desired);
	steering.sub(this.velocity);

	this.applyForce(steering);
}

/* This function is usually called in some update and will only run if moving */
core.Mover.prototype.move = function(){

	if (this.moving){

		if(core.debugMode){
			this.debugDot.clear();
		}

		if(this.path){
			this.stickToPath();
		}
		
		// move toward target (whatever it may be)
		this.seek();

		// to keep track of what to clear (for sprite sheets);
		if(typeof this.lastLocation !== 'undefined'){

			// work out if moving left or right
			this.flipped = (this.lastLocation.x > this.location.x) ? true : false;

			this.lastLocation = new core.Vector2D(this.location);
		}

		// send forces down the chain
		this.velocity.add(this.acceleration);
		this.location.add(this.velocity);

		// clear acceleration
		this.acceleration.mult(0);

	} // end if moving

}

// this is the function that keeps a target on a path segment
core.Mover.prototype.stickToPath = function(){

	// create a vector based on the velocity (50 pixels long)
	var predict = new core.Vector2D(this.velocity);
	predict.normalize();
	predict.mult(20);

	// create a vector 25 pixels in the future based on velocity and location
	var predictedLocation = new core.Vector2D(this.location);
	predictedLocation.add(predict);

	if(core.debugMode){
		this.debugDot.draw(this.target);
		this.secondDebugDog.draw(predictedLocation);
	}

	// stop from running of the end of the path
	if(this.flipped){
		if(predictedLocation.x < this.path.start.x){
			this.target = this.location;
			return false;
		}
	}else{
		if(predictedLocation.x > this.path.end.x){
			this.target = this.location;
			return false;
		}
	}

	// the normal point is the point on the line perpendicular to the current location
	var normalPoint = core.maths.getNormalPoint(this.path, predictedLocation);

	// work out how far we are away from the normal point
	var distance = normalPoint.dist(predictedLocation);

	// if we are to far from the path seek our new target
	if(distance > this.path.radius){

		// set our new target on the current pat segment
		this.setTargetOnPath();
	}

}

/* 	this function checks the direction we are heading and the original target to determin
	if we should use the normal of the original target (on the line) or the start / end of the line
	as the new target location */
core.Mover.prototype.setTargetOnPath = function(){
	// check if on last path segment (closest to target)
	if(this.flipped){
		if( this.path.start.x < this.originalTarget.x ){
			// on the last segment
			var targetNormal = core.maths.getNormalPoint(this.path, this.originalTarget);
			this.target = targetNormal;
		}else{
			this.target = this.path.start;
		}
	}else{
		if( this.path.end.x > this.originalTarget.x ){
			var targetNormal = core.maths.getNormalPoint(this.path, this.originalTarget);
			this.target = targetNormal;
		}else{
			this.target = this.path.end;
		}
	}
}

/*	this is the function that will check if we can / should switch to another path segment and which
	we should switch to (based on the original target) it will also put our */
core.Mover.prototype.switchPathCheck = function(){


	var foundPaths = [];

	// check for path points in the area to find what paths are connected
	for(var i = 0; i < this.pathSegments.length; i++){
		// path checking point 
		var pathCheckPoint = (this.flipped) ? this.pathSegments[i].end : this.pathSegments[i].start;
		if( core.maths.aboutTheSame(this.location, pathCheckPoint, 100) ){
			foundPaths.push(this.pathSegments[i]);
		}
	}

	// set the closest to be the distance from the current location by default
	var shortestDistance = this.location.dist(this.originalTarget);
	var closest = null;

	// now for each of the paths we are close to check if which one has the closest oposit side to the main target
	for(var i = 0; i < foundPaths.length; i++){
		var pathCheckPoint = (this.flipped) ? foundPaths[i].start : foundPaths[i].end;
		var distanceToEnd = pathCheckPoint.dist(this.originalTarget);

		if(distanceToEnd < shortestDistance){
			closest = foundPaths[i];
		}
	}

	// if we have a path that is closer
	if(closest){
		this.path = closest;
	}

}