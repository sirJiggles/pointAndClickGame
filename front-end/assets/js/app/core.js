/* This is the main container for the game, should be the only real global var */

var core = {

	// set all the properties of the core
	width		: 500,
	height		: 500,
	socket		: io.connect('http://localhost:3000'),
	layerOne	: document.getElementById('layerOne'),
	interval	: 1000 / 60,
    lastTime	: (new Date()).getTime(),
    currentTime	: 0,
    delta		: 0,
    guybrush	: null,

	// init function
	init: function(){
		// set things up before starting the game

		// lets do some funky guybrush animation for now
		this.guybrush = new core.SpriteSheet('assets/img/gb_walk.png', 6, 105, 150, core.layerOne);

		// for now just run it on a loop
		window.setInterval(function(){
			core.guybrush.update();
		}, 150);

		core.gameLoop();
	},

	// update function this is called each frame
	update: function(){
		
		

	},

	// simple debuging helper
	debug: function(msg, lvl){
		console.log('================== DEBUG MSG ===============');
		console.log(msg);
		if(typeof lvl !== undefined){
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
		            window.setTimeout(callback, 1000 / 60);
		          };
		})();

		(function animloop(){
			
			core.currentTime = (new Date()).getTime();
    		core.delta = (core.currentTime - core.lastTime);

			// if at least 1 frame has passed in time (1000/fps)
    		if(core.delta > core.interval) {

				// step the game
				core.update();

    			// set the last time
				core.lastTime = core.currentTime - (core.delta % core.interval);
			}

			// call this again on animation frame
			requestAnimFrame(animloop);

		})();
	} // end the game loop

} // end the core