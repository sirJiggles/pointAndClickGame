/* Class that mover inherits, but it contains all of the path logic */

core.PathManager = function(){
	this.pathsToCheck = null;
	this.onLastSegment = false;

	this.secondDebugDot = new core.DebugDot({'color':'yellow'});
	this.thirdDebugDot = new core.DebugDot({'color':'pink'});
	this.fourthDebugDot = new core.DebugDot({'color':'black'});
	this.fithDebugDot = new core.DebugDot({'color':'red'});


}

// this is the function that keeps a target on a path segment
core.PathManager.prototype.stickToPath = function(){

	// create a vector based on the velocity (50 pixels long)
	var predict = new core.Vector2D(this.velocity);
	predict.normalize();
	predict.mult(20);

	// create a vector 25 pixels in the future based on velocity and location
	var predictedLocation = new core.Vector2D(this.location);
	predictedLocation.add(predict);

	if(core.debugMode){
		this.debugDot.draw(this.target);
		this.secondDebugDot.draw(predictedLocation);
	}

	// if a new location has been clicked run the switch path check
	if(this.newTarget){
		//this.switchPathCheck();
	}else{
		if(this.flipped){
			if( predictedLocation.x < this.path.start.x ){
				var switchedPaths = this.switchPathCheck();
				if(!switchedPaths){
					this.target = this.path.start;
				}
			}
		}else{
			if(predictedLocation.x > this.path.end.x){
				var switchedPaths = this.switchPathCheck();
				if(!switchedPaths){
					this.target = this.path.end;
				}
			}
		}
		// check if we are about to run of the end of the path, if we are do the path swich check
		/*if( (predictedLocation.x < this.path.start.x) || (predictedLocation.x > this.path.end.x) ){
			console.log('called');
			var switchedPaths = this.switchPathCheck();
			if(!switchedPaths){
				// prevent leaving the end of the path
				if( (predictedLocation.x < this.path.start.x) ) { 
					this.target = this.path.start;
				}else{
					this.target = this.path.end;
				}
			}
		}*/
	}

	// the normal point is the point on the line perpendicular to the current location
	var normalPoint = core.maths.getNormalPoint(this.path, predictedLocation);

	// work out how far we are away from the normal point
	var distance = normalPoint.dist(predictedLocation);

	// if we are to far from the path seek our new target
	if(distance > this.path.radius){

		// set our new target on the current pat segment
		this.setTargetOnPath();
	}

}

/* 	this function checks the direction we are heading and the original target to determin
	if we should use the normal of the original target (on the line) or the start / end of the line
	as the new target location */
core.PathManager.prototype.setTargetOnPath = function(){
	// check if on last path segment (closest to target)
	if( (this.path.start.x < this.originalTarget.x) || (this.path.end.x > this.originalTarget.x) ){
		var targetNormal = core.maths.getNormalPoint(this.path, this.originalTarget);
		this.target = targetNormal;
		this.onLastSegment = true;
	}else{
		this.target = (this.flipped) ? this.path.start : this.path.end;
	}
}

/*	this is the function that will check if we can / should switch to another path segment and which
	we should switch to (based on the original target) it will also put our */
core.PathManager.prototype.switchPathCheck = function(){

	// make a copy of the path segments, this is so we can deduct paths that we have already checked from the array
	this.pathsToCheck = this.pathSegments.slice(0);

	var foundPaths = this.getPathsCloseTo(this.path);

	// set the closest to be the distance from the current location by default
	var shortestDistance = this.location.dist(this.originalTarget);
	var closest = null;

	// now for each of the paths we are close to check if which one has the closest oposit side to the main target
	for(var i = 0; i < foundPaths.length; i++){
		
		var pathMiddle = core.maths.getMiddlePoint(foundPaths[i].start, foundPaths[i].end);
		var directionShortestDistance = pathMiddle.dist(this.originalTarget);

		if(core.debugMode){ this.thirdDebugDot.draw(pathMiddle); }

		// do another depth check
		var subFoundPaths = this.getPathsCloseTo(foundPaths[i]);

		for(var j = 0; j < subFoundPaths.length; j++){
			var subPathMiddle = core.maths.getMiddlePoint(subFoundPaths[j].start, subFoundPaths[j].end);
			var subDist = subPathMiddle.dist(this.originalTarget);
			if(subDist < directionShortestDistance){
				directionShortestDistance = subDist;
			}

			if(core.debugMode){ this.fourthDebugDot.draw(subPathMiddle); }

			// last depth check (not clean but should work :( )
			var subsubFoundPaths =  this.getPathsCloseTo(subFoundPaths[j]);
			for(var z = 0; z < subsubFoundPaths.length; z++){
				var subSubPathMiddle = core.maths.getMiddlePoint(subsubFoundPaths[z].start, subsubFoundPaths[z].end);
				var subSubDist = subSubPathMiddle.dist(this.originalTarget);
				if(subSubDist < directionShortestDistance){
					directionShortestDistance = subSubDist;
				}

				if(core.debugMode){ this.fithDebugDot.draw(subSubPathMiddle); }
			}
		}

		if(directionShortestDistance < shortestDistance){
			// set the new record
			shortestDistance = directionShortestDistance;
			closest = foundPaths[i];
		}
	}

	// if we have a path that is closer
	if(closest){
		// have a new closest path, so switch the target
		this.path = closest;
		//this.target = (this.flipped) ? this.path.start : this.path.end;
		return true;
	}else{
		// trying to run off the end of the path
		return false;
	}
}

// mThis function gets all path segments close to a point
core.PathManager.prototype.getPathsCloseTo = function(path){

	var found = [],
		factor = 100;

	var i = this.pathsToCheck.length;

	while(i--){
		// dont check the path we are on
		if (this.pathsToCheck[i] !== this.path){ 

			var close = false;

			// check for any connecting paths around this path 
			if( core.maths.aboutTheSame(path.end, this.pathsToCheck[i].start, factor) ){
				close = true;
			}
			if( core.maths.aboutTheSame(path.start, this.pathsToCheck[i].end, factor) ){
				close = true;
			}
			if( core.maths.aboutTheSame(path.start, this.pathsToCheck[i].start, factor) ){
				close = true;
			}
			if( core.maths.aboutTheSame(path.end, this.pathsToCheck[i].end, factor) ){
				close = true;
			}

			if(close){
				found.push(this.pathsToCheck[i]);
				this.pathsToCheck.splice(i, 1);
			}
			
		}else{
			// remove the path we are on from the check
			this.pathsToCheck.splice(i, 1);
		}
	}

	return found;
}

