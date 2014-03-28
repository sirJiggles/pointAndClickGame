/* Mover function, for all things that move */

core.Mover = function(){
	
	// introduce physics
	this.location = new core.Vector2D;
	this.velocity = new core.Vector2D;
	this.acceleration = new core.Vector2D;

	this.moving = false;
	this.target = new core.Vector2D;

}

// apply force function (accleration gets added the force)
core.Mover.prototype.applyForce = function(force){
	// could introduce mass here :D

	this.acceleration.add(force);
}

/* Function to move to, this is called on anything we want to move somewhere */
core.Mover.prototype.moveTo = function(x, y){

	this.target.x = x;
	this.target.y = y;

	// clear the velocity (move at same speed constantly)
	this.velocity.mult(0);

	// get the desired location vector
	var desired = new core.Vector2D;
	desired.sub(this.target, this.location);
	desired.normalize();
	desired.mult(this.topSpeed);

	var steering = new core.Vector2D;
	steering.sub(desired, this.velocity);
	this.applyForce(steering);

	this.moving = true;
}

/* This function is usually called in some update and will only run if moving */
core.Mover.prototype.move = function(){

	if (this.moving){

		console.log(this.location.x);

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