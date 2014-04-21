core.Room = function(level, room){

	// sanity checking
	if(typeof level === 'undefined' || typeof room === 'undefined'){
		core.debug('Tried to init a room without a level and room', 'FATAL');
		return false;
	}

	this.sounds = {};
	this.sprites = {};
	this.graph = [];
	this.level = level;
	this.room = room;

	this.prepareRoom();
}

// get the json data for the room and start to get it all ready
core.Room.prototype.prepareRoom = function(){

	// get the JSON for the room
	$.getJSON('assets/data/levels/'+this.level+'/'+this.room+'.json', function(data,status){

		if(status === 'success'){

			// make sure we have all we need for the room
			// @TODO

			// set up the music
			core.state.sounds[data.music.name] = new Audio('/assets/sounds/'+data.music.file);
			core.playSound(data.music.name, data.music.loop);

			var graph = new Graph(data.graph);

			// check what the main char for this room is and attach the graph to it
			$.getJSON('assets/data/chars.json', function(charData, charStatus){
				if(charStatus !== 'success'){ 
					core.debug('Unable to load the chars file', 'FATAL');
					return false;
				}
				var charOptions = charData[data.char];
				charOptions.graph = graph;
				charOptions.x = data.startX;
				charOptions.y = data.startY;
				var mainChar = new core.SpriteSheet(charOptions).start();
				core.state.sprites.push(mainChar);
				core.currentChar = mainChar;

			});

		}else{
			core.debug('Unable to load the room '+this.level+'/'+this.room, 'FATAL');
		}
	});
}

core.Room.prototype.start = function(){

}