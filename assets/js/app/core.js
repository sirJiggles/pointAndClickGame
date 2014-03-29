/* This is the main container for the game, should be the only real global var */

var core = {

	// set all the properties of the core
	canvas		: document.getElementById('layerOne'),
	canvasTwo	: document.getElementById('layerTwo'),
	interval	: 1000 / 60,
    lastTime	: (new Date()).getTime(),
    currentTime	: 0,
    delta		: 0,
    state 	 	: {
    	sprites: []
    },
    currentChar	: null,

	// init function
	init: function(){

		// set things up before starting the game
		core.canvas.width = $(window).innerWidth();
		core.canvas.height = $(window).innerWidth();

		core.canvasTwo.width = $(window).innerWidth();
		core.canvasTwo.height = $(window).innerWidth();

		// draw a path on the sceen for the pug to follow
		var path = new core.PathSeg({x:0,y:100}, {x:700,y:100}, 20);

		// for now just draw it
		var ctx = this.canvasTwo.getContext('2d');
		ctx.moveTo(path.start.x, path.start.y);
		ctx.lineTo(path.end.x, path.end.y);
		ctx.stroke();

		// set up the sprites

		var mozartOptions = {
			file			: 'assets/img/mozart.png',
			frames			: 5,
			width			: 290,
			height			: 632,
			speed			: 140,
			outputWidth 	: 72,
			outputHeight	: 158,
			x				: 200,
			y				: 200,
			once			: false,
			topSpeed		: 20
		};

		core.state.sprites['mozart'] = new core.SpriteSheet(mozartOptions).start();
		core.currentChar = core.state.sprites['mozart'];

		core.currentChar.followPath(path);

		//set up the click listener
		$(window).click(function(evt){

			// get the location of the click
			var newX = evt.pageX,
				newY = evt.pageY;

			// set the current active char to have a new target and be moving toward it
			core.currentChar.target = new core.Vector2D(newX, newY);
			core.currentChar.moving = true;

		});

		
		core.gameLoop();
	},

	// update function this is called each frame
	update: function(dt){

		core.currentChar.update(dt);
		
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