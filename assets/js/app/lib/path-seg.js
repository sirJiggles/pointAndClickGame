/* this is the class for a path segment */

core.PathSeg = function(from, to, radius){
	
	// snaity checking
	if( typeof from !== 'object' ||
		typeof to !== 'object' ||
		typeof radius !== 'number'){
			core.debug('Could not create path segment incorrect args', 'Fatal');
	};

	// set up the start and end of the path segment
	this.start = new core.Vector2D(from.x, from.y);
	this.end = new core.Vector2D(to.x, to.y);

	// radius is the imagined width of the path (how far to try to stick to)
	this.radius = radius;
}