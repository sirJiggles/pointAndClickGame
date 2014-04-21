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
    	sprites: [],
    	sounds: {},
    },
    resizeTimer : null,
    debugMode 	: false,
    currentChar	: null,
    graph 		: null,
    graphWidthMagnifier : null,
    graphHeightMagnifier: null,
    graphSize : 10,
    width : $('#game-inner').innerWidth(),
    height: $('#game-inner').innerHeight(),

	// init function
	init: function(){

		// init the math utils
		core.maths = new core.MathUtils();

		core.resizeCanvs();

		// Sample graph for a level, all graphs for the game are 10 by 10 this is to allow us a ref to be able to resize
		core.graph = new Graph([
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,1,1,1,1,0],
			[0,0,0,0,1,1,0,0,1,0],
			[0,1,1,1,1,1,1,1,1,0],
			[0,0,1,1,1,1,1,1,1,0],
			[0,1,1,1,0,0,1,1,1,0],
			[0,1,1,1,0,0,1,1,0,0],
			[0,1,1,1,1,1,1,1,0,0],
			[0,0,1,0,1,1,1,0,0,0],
			[0,0,0,0,0,0,0,0,0,0]
		]);

		// Sample bg sounds
		core.state.sounds['heaven'] = new Audio('/assets/sounds/heaven.ogg');
		console.log(core.state.sounds['heaven']);
		core.playSound('heaven', true);

		// draw the degbug info
		if(core.debugMode){
			core.updateDebug();
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
			x				: 500,
			y				: 500,
			once			: false,
			topSpeed		: 30,
			graph 			: core.graph
		};

		var mozart = new core.SpriteSheet(mozartOptions).start();
		core.state.sprites.push(mozart);
		core.currentChar = core.state.sprites[0];

		//set up the click listener
		$('#canvas-wrapper').click(function(evt){

			// get the location of the click
			var offset = $(this).offset(); 
			var newX = evt.pageX - offset.left,
				newY = evt.pageY - offset.top;
			// set the current active char to have a new target and be moving toward it
			core.currentChar.target = new core.Vector2D(newX, newY);
			core.currentChar.originalTarget = new core.Vector2D(newX, newY);
			core.currentChar.moving = true;
			core.currentChar.newTarget = true;

		});

		//set the initial scale of the sprites based on the start width and height
		core.xRatio = core.width / 1024;
		core.yRatio = core.height / 1024;
		core.updateSprites(false);

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
	}, // end the game loop

	// handle any window resize here
	resizeWindowCallback: function(){

		var previousWidth = core.width,
			previousHeight = core.height;

		core.width =  $('#game-inner').innerWidth();
		core.height = $('#game-inner').innerHeight();

		core.xRatio = core.width / previousWidth;
		core.yRatio = core.height / previousHeight;

		core.updateSprites(true);

		core.resizeCanvs();

		if(core.debugMode){
			core.updateDebug();
		}
    },

    // a debug function only for debug mode redraw updates
    updateDebug: function(){

    	// show the graph
		var ctx = core.canvasTwo.getContext('2d');

		for(var i = 0; i < core.graph.input.length; i++){
			for(var j = 0; j < core.graph.input[i].length; j++){
				ctx.beginPath();
				ctx.fillStyle = (core.graph.input[i][j] == 1) ? 'blue' : 'red';
				ctx.rect( (j * core.graphWidthMagnifier),(i * core.graphHeightMagnifier),core.graphWidthMagnifier,core.graphHeightMagnifier);
				ctx.fill();
			}
		}	
    },

    updateSprites: function(locationAlso){
   
   		// update the location, speed and the size of the sprites
    	for(var i = 0; i < core.state.sprites.length; i ++){
    		var sprite = core.state.sprites[i];
    		sprite.moving = false;
    		if(typeof sprite.location !== 'undefined' && locationAlso){
    			sprite.location.x *= core.xRatio;
    			sprite.location.y *= core.yRatio;
    		}
    		// set the height to be the same as width to maintain the aspect ratio
    		sprite.outputHeight *= core.xRatio;
    		sprite.outputWidth *= core.xRatio;
    		sprite.topSpeed *= core.xRatio;
    	}
    },

    resizeCanvs: function(){
    	// resize all of the canvases on the screen to be the same as the window or 'core'
		core.canvas.width = core.width;
		core.canvas.height = core.height;
		core.canvasTwo.width = core.width;
		core.canvasTwo.height = core.height;
		core.debugCanvas.width = core.width;
		core.debugCanvas.height = core.height;

		// work out based on the width and the height of the window what the ratio of widths and heights for the graph is
		core.graphWidthMagnifier = core.width / core.graphSize;
		core.graphHeightMagnifier = core.height / core.graphSize;
    },

    playSound: function(name, loop){
    	
    	core.state.sounds[name].play();
    	if(loop){
    		core.state.sounds[name].loop = true;
    	}
    }

} // end the core