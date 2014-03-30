/* Mover function, for all things that move */

core.Mover = function(){
	
	// introduce physics
	this.location = new core.Vector2D;
	this.velocity = new core.Vector2D;
	this.acceleration = new core.Vector2D;

	this.moving = false;
	this.target = new core.Vector2D;

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
	}else if(distance < 10){
		// stop moving
		this.moving = false;
	}else{
		// continue to move as fast as possible to target
		desired.normalize();
		desired.mult(this.topSpeed);
	}

	var steering = new core.Vector2D(desired);
	steering.sub(this.velocity);

	this.applyForce(steering);
}

/* This function is usually called in some update and will only run if moving */
core.Mover.prototype.move = function(){

	if (this.moving){

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

	this.debugDot.clear();

	// create a vector based on the velocity (50 pixels long)
	var predict = new core.Vector2D(this.velocity);
	predict.normalize();
	predict.mult(20);

	// create a vector 25 pixels in the future based on velocity and location
	var predictedLocation = new core.Vector2D(this.location);
	predictedLocation.add(predict);

	if(core.debugMode){
		this.debugDot.draw(this.target);
		//this.secondDebugDog.draw(predictedLocation);
	}

	// the normal point is the point on the line perpendicular to the current location
	var normalPoint = core.maths.getNormalPoint(this.path, predictedLocation);

	// work out how far we are away from the normal point
	var distance = normalPoint.dist(predictedLocation);

	// if we are to far from the path seek our new target
	if(distance > this.path.radius){

		// shift the normal point a little further down the path (so we can create a new target)
		// also if we are moving left or right depeonds on the dir of the projected point
		var dir = new core.Vector2D( (this.flipped) ? this.path.start : this.path.end);
		dir.sub((this.flipped) ? this.path.end : this.path.start);
		dir.normalize();
		//how far down the ling to project
		dir.mult(100);

		var newTarget = new core.Vector2D(dir);
		newTarget.add(normalPoint);

		this.secondDebugDog.draw(newTarget);

		// call the seek function to apply the force of this new target
		this.seek(newTarget);

		// the target must have been off the path, to rectify this get the normal of the target (from the path)
		var targetNormal = core.maths.getNormalPoint(this.path, this.target);
		this.target = targetNormal;
	}

}