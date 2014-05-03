/* 	Here we will load all the controllers in the package into an array for the main serevr file */

(function(){

	// deifne our options and set up the walker
	var fs = require('fs'),
		walk = require('walk'),
		options = {
    		followLinks: false,
		    // directories with these keys will be skipped
		  	filters: []
  		},
  		walker = walk.walk("controllers", options),
  		controllers = [];

	walker.on("file", function (root, fileStats, next) {
		// push the file to the array that we will include in the main server file
		controllers.push(fileStats.name.split('.')[0]);
		next();
  	});

  	module.exports.walker = walker;
	module.exports.controllers = controllers;
})();