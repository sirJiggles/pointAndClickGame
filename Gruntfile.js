module.exports = function(grunt) {

	// Load the tasks form the custom node modules we have installed
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');
  	grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-shell');

  	// define our sass and js locations
  	var sasslocations = ['public/assets/sass/*.scss', 
						'public/assets/sass/views/*.scss', 
						'public/assets/sass/includes/*.scss',
						'public/assets/sass/partials/*.scss'];

  	var jsLocations= ['public/assets/js/script.js',
  					'public/assets/js/site-script.js',
					'public/assets/js/vendor/*.js',
					'public/assets/js/app/*.js',
					'public/assets/js/app/**/*.js',
					'public/assets/js/ui.js'];

  	// start the config for grunt
	grunt.initConfig({

		clean:{
			dev: ['public/assets/css'],
			build: ['public/assets/css']
		},
		compass: {
		  	dev: {
		    	options: {
					cssDir: 'public/assets/css',
					sassDir: 'public/assets/sass',
					imagesDir: 'public/assets/img',
					javascriptsDir: 'public/assets/js',
					outputStyle:'expanded',
					assetCacheBuster: false
			    }
			},
			build:{

				options: {
					cssDir: 'public/assets/css',
					sassDir: 'public/assets/sass',
					imagesDir: 'public/assets/img',
					javascriptsDir: 'public/assets/js',
					outputStyle:'compressed'
			    }
				
			}
		},
		shell:{
			dev: {
				command: ['juicer merge -s public/assets/js/script.js --force -m ""',
						'juicer merge -s public/assets/js/site-script.js --force -m ""'].join('&&')
			},
			build: {
				command: ['juicer merge -s public/assets/js/script.js --force',
						'juicer merge -s public/assets/js/site-script.js --force'].join('&&')
			}
		},
		watch: {
			compass: {
				files: sasslocations,
				tasks: ['compass:dev']
			},
			shell:{
				files: jsLocations,
				tasks: ['shell:dev']
			}
		}

	})


	// create some new tasks for dev and buid, these pass round different vars to the config settings
    grunt.registerTask('dev', [
      'clean:dev',
      'compass:dev',
      'shell:dev',
      'watch'
    ]);

    grunt.registerTask('build', [
      'clean:build',
      'compass:build',
      'shell:build',
      'watch'
    ]);


  	grunt.registerTask('default', ['build']);
	
};