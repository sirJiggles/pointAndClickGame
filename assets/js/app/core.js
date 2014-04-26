/* This is the main container for the game, should be the only real global var */

var core = {

	// set all the properties of the core
	canvases		: 	[
							document.getElementById('sprites'),
							document.getElementById('graph'),
							document.getElementById('debugLayer')
						],
	interval		: 	1000 / 60,
    lastTime		: 	(new Date()).getTime(),
    currentTime		: 	0,
    delta			: 	0,
    state 	 		: 	{
			    			sprites 	: [],
			    			sounds 		: [],
			    			unlocked 	: [],
			    			room 		: null	
						},
    resizeTimer 	: 	null,
    debugMode 		: 	false,
    currentChar		: 	null,
    graphWidthMagnifier: null,
    graphHeightMagnifier: null,
    playSounds		: 	true,
    graphSize		: 	10,
    width 			: 	$('#game-wrapper').innerWidth(),
    height 			: 	$('#game-wrapper').innerHeight(),
    widthToHeight	:   4 / 3,

	// init function
	init: function(){

		// init the math utils
		core.maths = new core.MathUtils();

		// start the game
		core.play();

		// for now spoof the authentication on the rooms
		core.state.unlocked.push([0,1]);

		// set the scene sizes up
		core.resizeWindowCallback();

		// init room one level one
		core.state.room = new core.Room();
		core.state.room.prepareRoom(0,0);

		// draw the degbug info
		if(core.debugMode){
			core.updateDebug();
		}

	},

	// update function this is called each frame
	update: function(dt){

		if(core.currentChar){
			core.currentChar.update(dt);
		}
		
	},

	pause: function(){
		requestAnimFrame = null;
	},

	play: function(){
		core.gameLoop();
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
			previousHeight = core.height,
			wrapper = $('#game-wrapper'),
			inner = $('#game-inner');

		core.width =  $(wrapper).innerWidth();
		core.height = $(wrapper).innerHeight();

		var newWidthToHeight = core.width / core.height;
		if(newWidthToHeight > core.widthToHeight){
			core.width = core.height * core.widthToHeight;
		}else{
			core.height = core.width / core.widthToHeight;
		}

		$(inner).css({
			'width': core.width,
			'height': core.height,
			'margin-top':-core.height / 2,
			'margin-left':-core.width / 2
		});

		$('.inventory').css({
			'width': core.width,
			'margin-left':-core.width / 2
		});

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
		var ctx = core.canvases[1].getContext('2d');
		if(core.currentChar){
			for(var i = 0; i < core.currentChar.graph.input.length; i++){
				for(var j = 0; j < core.currentChar.graph.input[i].length; j++){
					ctx.beginPath();
					ctx.fillStyle = (core.currentChar.graph.input[i][j] == 1) ? 'rgba(35,176,204,0.5)' : 'rgba(240,86,94,0.5)';
					ctx.rect( (j * core.graphWidthMagnifier),(i * core.graphHeightMagnifier),core.graphWidthMagnifier,core.graphHeightMagnifier);
					ctx.fill();
				}
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
    		sprite.clear();
    	}

    },

    clearScreen: function(){
    	for(var i = 0; i < core.state.sprites.length; i ++){
    		core.state.sprites[i].clear();
    	}
    	core.resizeCanvs();
    },

    resizeCanvs: function(){
    	// resize all of the canvases on the screen to be the same as the window or 'core'
    	for(var i = 0; i < core.canvases.length; i ++){
    		core.canvases[i].width = core.width;
    		core.canvases[i].height = core.height;
    	}

		// work out based on the width and the height of the window what the ratio of widths and heights for the graph is
		core.graphWidthMagnifier = core.width / core.graphSize;
		core.graphHeightMagnifier = core.height / core.graphSize;
    },

    playSound: function(index, loop){
    	if(!core.playSounds){ return; }
    	core.state.sounds[index].play();
		if(loop){
    		core.state.sounds[index].loop = true;
    	}
    	
    },
    stopSound:  function(index){
    	core.state.sounds[index].pause();	
    },
    clearSounds: function(){
    	for(var i = 0; i < core.state.sounds.length; i++){
    		core.state.sounds[i].pause();
    	}
    	// reset the array
    	core.state.sounds = [];
    },

    // sanity check utils function
    sanityCheck : function(vars){
    	for(var i = 0; i < vars.length; i ++){
    		if(typeof vars[i] === 'undefined'){
    			return false;
    		}
    	}
    	return true;
    }

} // end the core