/* Mover function, for all things that move */

core.Mover = function(){
	
	// introduce physics
	this.location = new core.Vector2D;
	this.velocity = new core.Vector2D;
	this.acceleration = new core.Vector2D;

	this.moving = false;
	this.target = new core.Vector2D;
	this.desired = new core.Vector2D;
	this.steering = new core.Vector2D;

	this.targetChange = false;
	this.oldTarget = null;
	//used to check if we are trying to head back to the same loc
	this.oldNormal = new core.Vector2D;

	this.debugDot = new core.DebugDot;

}

// apply force function (accleration gets added the force)
core.Mover.prototype.applyForce = function(force){
	// could introduce mass here :D

	this.acceleration.add(force);
}

/* Seek function to move toward something */
core.Mover.prototype.seek = function(){

	// get the desired location vector
	this.desired = new core.Vector2D(this.target);
	this.desired.sub(this.location);

	// work out how far we are from the target
	var distance = this.desired.mag();

	// ring around the target
	if(distance < 20){
		// the speed depends on the distance from the target (give some easing)
		this.desired.mult(0.5);
	}else{
		// continue to move as fast as possible to target
		this.desired.normalize();
		this.desired.mult(this.topSpeed);
	}

	this.steering = new core.Vector2D(this.desired);
	this.steering.sub(this.velocity);

	this.applyForce(this.steering);
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

		// if we are at the station
		if(this.location.x == this.target.x && this.location.y == this.target.y){
			this.moving = false;
		}
	} // end if moving

}

// this is the function that keeps a target on a path segment
core.Mover.prototype.stickToPath = function(){

	this.debugDot.clear();

	// create a vector based on the velocity (25 pixels long)
	var predict = new core.Vector2D(this.velocity);
	predict.normalize();
	predict.mult(50);

	// create a vector 25 pixels in the future based on velocity and location
	var predictedLocation = new core.Vector2D(this.location);
	predictedLocation.add(predict);

	this.debugDot.draw(this.location);

	// the normal point is the point on the line perpendicular to the current location
	var normalPoint = core.maths.getNormalPoint(this.path, predictedLocation);

	// work out how far we are away from the normal point
	var distance = normalPoint.dist(predictedLocation);

	// if we are to far from the path seek our new target
	if(distance > this.path.radius){

		// save the old target for later( the global move )
		this.oldTarget = new core.Vector2D(this.target);
		this.targetChange = true;

		// if the new and the old normal are about the same stop moving
		if(core.maths.aboutTheSame(this.oldNormal, normalPoint, 10)){
			// gone as far as we can go
			this.moving = false;

		}else{
			this.oldNormal = normalPoint;

			// shift the normal point a little further down the path (so we can create a new target)
			var dir = new core.Vector2D(this.path.start);
			dir.sub(this.path.end);
			dir.normalize();
			dir.mult(20);

			var newTarget = new core.Vector2D(dir);
			newTarget.add(normalPoint);

			this.target = newTarget;
		}

	}else{

		if(this.targetChange){
			// go back to using old target (back on track)
			this.target = new core.Vector2D(this.oldTarget);
			this.targetChange = false;
		}
	}
}