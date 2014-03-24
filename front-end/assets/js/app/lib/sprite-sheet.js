/* This is the class to handle our test spriting */

core.SpriteSheet = function(src, frames, w, h, canvas){
	
	// we will exit if we do not have all required args to create a new sprite sheet
	if( typeof src === 'undefined' || 
		typeof frames === 'undefined' ||
		typeof w === 'undefined' ||
		typeof h === 'undefined' ||
		typeof canvas === 'undefined'){
		return false;
	}

	// set up the new image for this instance of the sprite sheet
	this.img = new Image();
	this.frames = frames;
	this.src = src;
	this.w = w;
	this.h = h;
	this.canvas = canvas;
	this.ctx = null;
	this.currentFrame = 0;

	// after constructing class call the init
	this.init();
}

// polymorphism
// core.SpriteSheet.prototype = Object.create(class.prototype);

core.SpriteSheet.prototype.init = function(){
	this.img.src = this.src;
	this.ctx = this.canvas.getContext('2d');
}

// as a note this system is designed to deal with sprite sheets that are looong ;)
core.SpriteSheet.prototype.update = function(){

	// clear the rect
	this.ctx.clearRect(0,0,this.w,this.h);

	// draw the new image
	this.ctx.drawImage(this.img, this.w * this.currentFrame, 0, this.w, this.h, 0, 0, this.w, this.h);
    
    // if at the end of the aniamtion sequence, reset it    
    if (this.currentFrame == this.frames) {
      this.currentFrame = 0;
    } else {
      this.currentFrame ++;
    }

}