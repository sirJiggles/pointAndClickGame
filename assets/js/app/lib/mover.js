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

}

// apply force function (accleration gets added the force)
core.Mover.prototype.applyForce = function(force){
	// could introduce mass here :D

	this.acceleration.add(force);
}

/* Seek function to move toward something */
core.Mover.prototype.seek = function(){

	// get the desired location vector
	this.desired.x = this.target.x;
	this.desired.y = this.target.y;

	this.desired.sub(this.location);
	this.desired.normalize();
	this.desired.mult(this.topSpeed);

	this.steering.x = this.desired.x;
	this.steering.y = this.desired.y;
	this.steering.sub(this.velocity);

	this.applyForce(this.steering);

}

/* This function is usually called in some update and will only run if moving */
core.Mover.prototype.move = function(){

	if (this.moving){

		this.seek();

		// to keep track of what to clear (for sprite sheets);
		if(typeof this.lastLocation !== 'undefined'){
			this.lastLocation.x = this.location.x;
			this.lastLocation.y = this.location.y;
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