var express = require('express'),
	auth = require('./config/auth'),
	routes = require('./config/routes'),
	mongoose = require('mongoose'),
	app = express(),
	controller = null;

// connect to mongo db
mongoose.connect(process.env.dbUrl);

// configure Express
app.configure(function() {
	app.set('views', __dirname + '/public/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', require('ejs-locals'));
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: process.env.passportSecret }));
	app.use(auth.passport.initialize());
	app.use(auth.passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/public/'));
});

// when the router has finished loading the controllers
routes.walker.on("end", function(){
	// include all of the controllers actions
	for(index in routes.controllers){
		controller = require('./controllers/'+routes.controllers[index]);
		controller.init(app, auth);
	}

	// now start the server
	var server = app.listen(process.env.PORT, function(){
		console.log('Server up and running on port %d', server.address().port);
	});
});