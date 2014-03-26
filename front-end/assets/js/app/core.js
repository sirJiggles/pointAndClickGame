/* This is the main container for the game, should be the only real global var */

var core = {

	// set all the properties of the core
	width		: 500,
	height		: 500,
	socket		: io.connect('http://localhost:3000'),
	canvas		: document.getElementById('layerOne'),
	interval	: 1000 / 60,
    lastTime	: (new Date()).getTime(),
    currentTime	: 0,
    delta		: 0,
    guybrush 	: null,

	// init function
	init: function(){
		// set things up before starting the game

		// lets do some funky guybrush animation for now
		var guybrushOptions = {
			file			: 'assets/img/gb_walk.png',
			frames			: 5,
			width			: 104,
			height			: 150,
			speed			: 200,
			canvas			: core.canvas,
			outputWidth 	: 52,
			outputHeight	: 72,
			x				: 20,
			y				: 50,
			once			: false
		};

		core.guybrush = new core.SpriteSheet(guybrushOptions);

		core.gameLoop();
	},

	// update function this is called each frame
	update: function(dt){
		
		// update guybrush
		core.guybrush.update(dt);

	},

	// simple debuging helper
	debug: function(msg, lvl){
		console.log('================== DEBUG MSG ===============');
		console.log(msg);
		if(typeof lvl !== 'undefined'){
			console.log(' WARNING LVL: '+lvl);
		}
		console.log('================= END DEBUG ================');
	},

	// game loop function
	gameLoop: function(){

		// shim layer with setTimeout fallback
		window.requestAnimFrame = (function(){
		  return  window.requestAnimationFrame       ||
		          window.webkitRequestAnimationFrame ||
		          window.mozRequestAnimationFrame    ||
		          function(callback){
		            window.setTimeout(callback, core.interval);
		          };
		})();

		(function animloop(){
			
			core.currentTime = (new Date()).getTime();
    		core.delta = (core.currentTime - core.lastTime);

			// if at least 1 frame has passed in time (1000/fps)
    		if(core.delta > core.interval) {

				// step the game
				core.update(core.delta);

    			// set the last time
				core.lastTime = core.currentTime - (core.delta % core.interval);
			}

			// call this again on animation frame
			requestAnimFrame(animloop);

		})();
	} // end the game loop

} // end the core