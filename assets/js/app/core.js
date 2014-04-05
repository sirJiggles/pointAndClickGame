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
    debugMode 	: true,
    currentChar	: null,
    debugCanvas	: document.getElementById('debugLayer'),
    pathLength 	: 200,

	// init function
	init: function(){

		// init the math utils
		core.maths = new core.MathUtils();

		// set things up before starting the game
		core.canvas.width = $(window).innerWidth();
		core.canvas.height = $(window).innerWidth();

		core.canvasTwo.width = $(window).innerWidth();
		core.canvasTwo.height = $(window).innerWidth();

		core.debugCanvas.width = $(window).innerWidth();
		core.debugCanvas.height = $(window).innerWidth();

		// create some path segments for the fake lvl
		var radius = 10;
		var paths = [
			new core.PathSeg({x:-10,y:400}, {x:200,y:400}, radius),
			new core.PathSeg({x:200,y:400}, {x:400,y:200}, radius),
			new core.PathSeg({x:400,y:200}, {x:600,y:200}, radius),
			new core.PathSeg({x:600,y:200}, {x:800,y:0}, radius),
			new core.PathSeg({x:600,y:200}, {x:800,y:400}, radius),
			new core.PathSeg({x:200,y:400}, {x:400,y:600}, radius),
			new core.PathSeg({x:400,y:600}, {x:600,y:600}, radius),
			new core.PathSeg({x:600,y:600}, {x:800,y:800}, radius)
		];
		 

		// draw the paths on the screen for debug mode
		if(core.debugMode){
			var ctx = this.canvasTwo.getContext('2d');
			for(var i = 0; i < paths.length; i ++){
				ctx.moveTo(paths[i].start.x, paths[i].start.y);
				ctx.lineTo(paths[i].end.x, paths[i].end.y);
				ctx.stroke();
			}
			
		}

		// set up the mozart sprite
		var mozartOptions = {
			file			: 'assets/img/mozart.png',
			frames			: 5,
			width			: 136,
			height			: 297,
			speed			: 120,
			outputWidth 	: 72,
			outputHeight	: 158,
			x				: 0,
			y				: 400,
			once			: false,
			topSpeed		: 30,
			path 			: paths[0],
			pathSegments 	: paths
		};

		core.state.sprites['mozart'] = new core.SpriteSheet(mozartOptions).start();
		core.currentChar = core.state.sprites['mozart'];

		//set up the click listener
		$(window).click(function(evt){

			// get the location of the click
			var newX = evt.pageX,
				newY = evt.pageY;

			// set the current active char to have a new target and be moving toward it
			core.currentChar.target = new core.Vector2D(newX, newY);
			core.currentChar.originalTarget = new core.Vector2D(newX, newY);
			core.currentChar.moving = true;

		});

		
		core.gameLoop();
	},

	// update function this is called each frame
	update: function(dt){

		core.currentChar.update(dt);
		
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