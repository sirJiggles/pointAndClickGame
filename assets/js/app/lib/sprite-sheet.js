/* Class for the sprites */

core.SpriteSheet = function(options){

	
	// These are the args we will neeed by default
	if( typeof options.file === 'undefined' || 
		typeof options.frames === 'undefined' ||
		typeof options.width === 'undefined' ||
		typeof options.height === 'undefined'){

		core.debug('Call to sprite sheet with '+options.file+ ' failed, missing required options', 'FATAL');

		return false;
	}

	//  construct al the props of he class
	this.img = new Image();
	this.img.src = options.file;
	this.frames = options.frames;
	this.width = options.width;
	this.height = options.height;
	this.canvas = (typeof options.canvas !== 'undefined') ? options.canvas : core.canvas;
	// how fast in ms between each frame
	this.speed = (typeof options.speed !== 'undefined') ? options.speed : 500; 
	this.once =  (typeof options.once !== 'undefined') ? options.once : true
	this.outputHeight = (typeof options.outputHeight !== 'undefined') ? options.outputHeight : options.height;
	this.outputWidth = (typeof options.outputWidth !== 'undefined') ? options.outputWidth : options.width;
	this.ctx = this.canvas.getContext('2d');
	this.currentFrame = 0;
	this.timePassed = 0;
	this.done = true;
	this.topSpeed = (typeof options.topSpeed !== 'undefined') ? options.topSpeed : 10;

	// call the constructor of the parent class (this gives us location etc)
	core.Mover.call(this);

	this.location = new core.Vector2D(options.x, options.y);
	this.lastLocation = new core.Vector2D(this.location);

	this.flipped = false;

	// current path
	this.path = (typeof options.path !== 'undefined') ? options.path : null;

	// an array of all the path segments for the sprite to move on
	this.pathSegments = (typeof options.pathSegments !== 'undefined') ? options.pathSegments : null;;

	return this;

}

// inherits all the mover functions
core.SpriteSheet.prototype = Object.create(core.Mover.prototype);
core.SpriteSheet.prototype.constructor = core.SpriteSheet;

// start and stop functions for sprite sheets
core.SpriteSheet.prototype.start = function(){
	this.done = false;
	return this;
}

core.SpriteSheet.prototype.stop = function(first_argument) {
	this.done = true;
	return this;
};

// update function
core.SpriteSheet.prototype.update = function(dt){

	if(typeof dt === 'undefined'){return false;}

	if(!this.done){
		// update the index based on the delta
		this.timePassed += Math.floor(dt);

		// if we are due another re-draw
		if(this.timePassed >= this.speed){
			this.render();
			this.timePassed = 0;
		}
	}
}

// render function
core.SpriteSheet.prototype.render = function(){

	// clear the space that was last drawn
	this.ctx.clearRect(	this.lastLocation.x,
						this.lastLocation.y,
						this.outputWidth * 4,
						this.outputHeight * 4);

	// draw the new image
	this.ctx.drawImage( this.img, 
						this.width * this.currentFrame, 
						0, 
						this.width, 
						this.height, 
						this.location.x, 
						this.location.y, 
						this.outputWidth, 
						this.outputHeight );

	// update the current frame
	if(this.currentFrame < this.frames){
		this.currentFrame ++;
	}else{
		// we have completed a full animation sequence
		this.currentFrame = 0;
		if(this.once){
			this.done = true;
			return false;
		}
	}

	// run any mover code
	this.move();
}
