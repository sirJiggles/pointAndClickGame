/* Class for the sprites */

core.SpriteSheet = function(options){

	
	// These are the args we will neeed by default
	if( !core.sanityCheck([options.file, options.frames, options.width, options.height]) ){
		core.debug('Call to sprite sheet with '+options.file+ ' failed, missing required options', 'FATAL');
		return false;
	}

	//  construct al the props of he class
	this.img = new Image();
	this.img.src = options.file;
	this.frames = options.frames;
	this.width = options.width;
	this.height = options.height;
	this.canvas = (typeof options.canvas !== 'undefined') ? options.canvas : core.canvases[0];
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

	this.location = new core.Vector2D(options.x, options.y);
	this.lastLocation = new core.Vector2D(this.location);
	this.lastRenderLocation = new core.Vector2D(this.location);

	this.flipped = true;

	// a graph to work out the path logic for the sprite (if it needs it)
	this.graph = (typeof options.graph !== 'undefined') ? options.graph : null;

	// call the constructor of the parent class (this gives us location etc)
	core.Mover.call(this);

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

	if(!core.sanityCheck([dt])){return false;}

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

	this.lastRenderLocation = new core.Vector2D(this.location);

	// clear the space that was last drawn
	this.ctx.clearRect(	this.lastRenderLocation.x - this.outputWidth * 2,
						this.lastRenderLocation.y - this.outputHeight * 2,
						this.outputWidth * 4,
						this.outputHeight * 4);

	var nextFrameLoc = (!this.flipped) ? this.width * this.currentFrame : (this.width * this.currentFrame) + (this.width * (this.frames + 1) );
	// draw the new image
	this.ctx.drawImage( this.img, 
						nextFrameLoc, 
						0, 
						this.width, 
						this.height, 
						this.location.x - (this.outputWidth / 2), 
						this.location.y - (this.outputHeight / 2), 
						this.outputWidth, 
						this.outputHeight);

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

// clear the whole canvas
core.SpriteSheet.prototype.clear = function() {
	this.ctx.clearRect(0,0,core.width,core.height);
};
