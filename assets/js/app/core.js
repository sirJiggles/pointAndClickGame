/* This is the main container for the game, should be the only real global var */

var core = {

	// set all the properties of the core
	canvas		: document.getElementById('layerOne'),
	canvasTwo	: document.getElementById('layerTwo'),
	debugCanvas	: document.getElementById('debugLayer'),
	interval	: 1000 / 60,
    lastTime	: (new Date()).getTime(),
    currentTime	: 0,
    delta		: 0,
    state 	 	: {
    	sprites: []
    },
    debugMode 	: true,
    currentChar	: null,
    graph 		: null,
    graphMagnifier : 200,

	// init function
	init: function(){

		// init the math utils
		core.maths = new core.MathUtils();

		// set up some canvases for now
		var width = $(window).innerWidth(),
			height = $(window).innerWidth();
		core.canvas.width = width;
		core.canvas.height = height;
		core.canvasTwo.width = width;
		core.canvasTwo.height = height;
		core.debugCanvas.width = width;
		core.debugCanvas.height = height;

		// set up the graph for the level, this is magnified by say 100 for now
		core.graph = new Graph([
			[1,1,1,0,1],
			[0,1,1,0,1],
			[0,0,1,1,1],
			[1,1,1,0,0]
		]);

		if(core.debugMode){

			// show the graph
			var ctx = core.canvasTwo.getContext('2d');

			for(var i = 0; i < core.graph.input.length; i++){
				for(var j = 0; j < core.graph.input[i].length; j++){
					ctx.beginPath();
					ctx.fillStyle = (core.graph.input[i][j] == 1) ? 'blue' : 'red';
					ctx.rect( (j * core.graphMagnifier),(i * core.graphMagnifier),core.graphMagnifier,core.graphMagnifier);
					ctx.fill();
				}
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
			graph 			: core.graph
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
			core.currentChar.newTarget = true;

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