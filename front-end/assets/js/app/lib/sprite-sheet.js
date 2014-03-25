/* This is the class to handle our test spriting */

core.SpriteSheet = function(options){

	
	// These are the args we will neeed by default
	if( typeof options.file === 'undefined' || 
		typeof options.frames === 'undefined' ||
		typeof options.width === 'undefined' ||
		typeof options.height === 'undefined' ||
		typeof options.canvas === 'undefined'){

		core.debug('Call to sprite sheet with '+options.file+ ' failed, missing required options', 'FATAL');

		return false;
	}

	//  construct al the props of he class
	this.img = new Image();
	this.img.src = options.file;
	this.frames = options.frames;
	this.width = options.width;
	this.height = options.height;
	this.canvas = options.canvas;
	this.speed = (typeof options.speed !== 'undefined') ? options.speed : 0; 
	this.once =  (typeof options.once !== 'undefined') ? options.once : true
	this.x = options.x;
	this.y = options.y;
	this.outputHeight = (typeof options.outputHeight !== 'undefined') ? options.outputHeight : options.height;
	this.outputWidth = (typeof options.outputWidth !== 'undefined') ? options.outputWidth : options.width;
	this.ctx = this.canvas.getContext('2d');
	this.currentFrame = 0;
	this._index = 0;
	this.done = false;
}

// polymorphism
// core.SpriteSheet.prototype = Object.create(class.prototype);

core.SpriteSheet.prototype.reset = function(){
	this.done = false;
}

// update function
core.SpriteSheet.prototype.update = function(dt){

	if(typeof dt === 'undefined'){return false;}

	if(!this.done){
		// update the index based on the delta and speed
		console.log(dt);
		this._index += Math.floor(this.speed * dt);
		this.render();
		console.log(this._index);
	}
}

// render function
core.SpriteSheet.prototype.render = function(){

	// if we have something that will move move to the next frame (based on speed)
	if(this.speed > 0){
		var curIndex = Math.floor(this._index)
		this.currentFrame = curIndex % this.frames;

		// if we are done and we only want to run once we will set done flag to true and exit,
		// in this case render will not be called
		if(this.once && (curIndex >= this.frames)){
			this.done = true;
			return false;
		}
	}

	// clear the rect
	this.ctx.clearRect(	this.x,
						this.y,
						this.outputWidth,
						this.outputHeight);

	// draw the new image
	this.ctx.drawImage( this.img, 
						this.width * this.currentFrame, 
						0, 
						this.width, 
						this.height, 
						this.x, 
						this.y, 
						this.outputWidth, 
						this.outputHeight );

}