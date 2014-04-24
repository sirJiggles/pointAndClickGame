core.Room = function(){

}

// get the json data for the room and start to get it all ready
core.Room.prototype.prepareRoom = function(level, room){

	// sanity checking
	if(typeof level === 'undefined' || typeof room === 'undefined'){
		core.debug('Tried to init a room without a level and room', 'FATAL');
		return false;
	}

	// get the JSON for the room
	$.getJSON('assets/data/levels/'+level+'/'+room+'.json', function(data,status){

		if(status !== 'success'){
			core.debug('Unable to load JSON room data', 'FATAL');
			return false;
		}

		// make sure we have all we need for the room
		if(typeof data.gridPos === 'undefined' || typeof data.music === 'undefined' || typeof data.graph === 'undefined'){
			core.debug('Unable to load the room '+level+'/'+room, 'FATAL');
			return false;
		}

		// set up the music
		core.state.sounds[data.music.name] = new Audio('assets/sounds/'+data.music.file);
		core.playSound(data.music.name, data.music.loop);

		// sort out the doors on the room
		var doors = new core.DoorGenerator(data.doors, level, room);

		// create the graph for the char
		var graph = new Graph(data.graph);

		// check what the main char for this room is and attach the graph to it
		$.getJSON('assets/data/chars.json', function(charData, charStatus){
			if(charStatus !== 'success'){ 
				core.debug('Unable to load the chars file for the room', 'FATAL');
				return false;
			}
			if(typeof charData[data.char] === 'undefined'){
				core.debug('Could not find the char for this room in char JSON file', 'FATAL');
				return false;
			}

			var charOptions = charData[data.char];
			charOptions.graph = graph;

			// set the location to be the grid pos passed in
			charOptions.x = (core.graphWidthMagnifier * data.gridPos[1]) + (core.graphWidthMagnifier / 2);
			charOptions.y = (core.graphHeightMagnifier * data.gridPos[0]) + (core.graphWidthMagnifier / 2);

			var mainChar = new core.SpriteSheet(charOptions).start();
			core.state.sprites.push(mainChar);
			core.currentChar = mainChar;
			// set the sprite ratio
			core.updateSprites(false);
		});
	});
};

core.Room.prototype.clear = function() {

};