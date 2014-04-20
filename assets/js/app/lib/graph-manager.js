// Class to handle any graphs that may be attached to a sprite
core.GraphManager = function(){
	
	// this is where we will store our path being processed
	this.graphPath = [];
}

core.GraphManager.prototype.getRoute = function() {
	
	// scale using magnifier to get index in graph array
	var startX = Math.floor(this.location.x / core.graphWidthMagnifier),
		startY = Math.floor(this.location.y / core.graphHeightMagnifier),
		endX = Math.floor(this.target.x / core.graphWidthMagnifier),
		endY = Math.floor(this.target.y / core.graphHeightMagnifier);

	// sanity check a condition that will only happen if you click of the grid
	if (typeof this.graph.nodes[startY] === 'undefined' || typeof this.graph.nodes[endY] === 'undefined'){
		return false;
	}
	if (typeof this.graph.nodes[startY][startY] === 'undefined' || typeof this.graph.nodes[endY][endX] === 'undefined'){
		return false;
	}

	var start = this.graph.nodes[startY][startX],
		end = this.graph.nodes[endY][endX];
	// using the super cool a star work out the current path
	this.graphPath = astar.search(this.graph.nodes, start, end);

};

core.GraphManager.prototype.updateGraph = function(){

	// if the target has changed get a new route
	if(this.newTarget){
		this.getRoute();

		if(this.graphPath.length > 0){
			this.setNextTarget();
		}else{
			// prevent the move and reset
			this.moving = false;
			this.target = this.lastLocation;
		}
	}

	
}

core.GraphManager.prototype.setNextTarget = function(){

	if ( typeof this.graphPath[0] === 'undefined' ){
		return false;
	}
	// set the new target to be the center of the next cell on route to final target
	this.target.x = (this.graphPath[0].y * core.graphWidthMagnifier) + core.graphWidthMagnifier / 2;
	this.target.y = (this.graphPath[0].x * core.graphHeightMagnifier) + core.graphHeightMagnifier / 2;
}

// this is called when the mover has reached the target, if its the original target stop moving
// if its not remove it from the list of remaining targets and set the next one up
core.GraphManager.prototype.processTarget = function(){

	// handle if reached target
	if( core.maths.aboutTheSame( this.location, this.originalTarget, core.graphWidthMagnifier / 2) ){
		this.moving = false;
		return false;
	}

	// handle setting of new target
	if( core.maths.aboutTheSame( this.location, this.target, core.graphWidthMagnifier ) ){
		this.graphPath.splice(0, 1);
		this.setNextTarget();
	}
}