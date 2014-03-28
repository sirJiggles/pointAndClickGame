/* This is the main container for the game, should be the only real global var */

var core = {

	// set all the properties of the core
	canvas		: document.getElementById('layerOne'),
	interval	: 1000 / 60,
    lastTime	: (new Date()).getTime(),
    currentTime	: 0,
    delta		: 0,
    state 	 	: {
    	sprites: []
    },

	// init function
	init: function(){
		// set things up before starting the game
		core.canvas.width = $(window).innerWidth();
		core.canvas.height = $(window).innerWidth();

		// set up the sprites

		var mozartHoverOptions = {
			file			: 'assets/img/mozart.png',
			frames			: 5,
			width			: 290,
			height			: 632,
			speed			: 140,
			outputWidth 	: 72,
			outputHeight	: 158,
			x				: 200,
			y				: 200,
			once			: false
		};

		core.state.sprites['mozart-hover'] = new core.SpriteSheet(mozartHoverOptions);
		core.state.sprites['mozart-hover'].start();

		//set up the click listener
		$(window).click(function(evt){

			// get the location of the click
			var newX = evt.pageX,
				newY = evt.pageY;

			// set the sprite to moving and set the target
			core.state.sprites['mozart-hover'].moveTo(newX, newY);

			console.log(core.state.sprites['mozart-hover'].target);
		});

		
		core.gameLoop();
	},

	// update function this is called each frame
	update: function(dt){

		core.state.sprites['mozart-hover'].update(dt);
		
		// update all the sprites 
		/*$.each(core.state.sprites, function(index, sprite){
			console.log(sprite);
			sprite.update(dt);
			//sprite.moveTo(500, 500);
		});*/

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