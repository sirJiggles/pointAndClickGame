/* Mover function, for all things that move */

core.Mover = function(){
	
	// introduce physics
	this.location = new core.Vector2D;
	this.velocity = new core.Vector2D;
	this.acceleration = new core.Vector2D;

	this.moving = false;
	this.target = new core.Vector2D;
	this.originalTarget = new core.Vector2D;
	this.newTarget = false;

	this.debugDot = new core.DebugDot;

	if(this.graph){
		core.GraphManager.call(this);
	}

}

// inherit all the graph manager functions
core.Mover.prototype = Object.create(core.GraphManager.prototype);

core.Mover.prototype.constructor = core.Mover;

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

	if(distance < (core.graphMagnifier / 2) && this.graph){
		this.processTarget();
	}

	var steering = new core.Vector2D(desired);
	steering.sub(this.velocity);

	this.applyForce(steering);
}

/* This function is usually called in some update and will only run if moving */
core.Mover.prototype.move = function(){

	if (!this.moving){
		return false;
	}
	
	if(core.debugMode){
		this.debugDot.clear();
	}

	if(this.graph){
		this.updateGraph();
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

	this.newTarget = false;

}
