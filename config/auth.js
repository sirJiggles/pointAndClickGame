/* JS file to configure passport in the server */
(function(){

	// vars needed to set up the auth
	var passport = require('passport'),
		apiKeys = require('./api-keys').keys,
		User = require('../models/User'),
  		util = require('util'),
  		facebookStrategy = require('passport-facebook').Strategy,
  		twitterStrategy =  require('passport-twitter').Strategy,
  		localStrategy = require('passport-local').Strategy;


	// Set up passport for logging in via facebook (will change later to use database)
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
 
	passport.deserializeUser(function(obj, done) {
		User.findById(id, function(err, user) {
            done(err, user);
        });
	});

	// set up connecting via facebook
	passport.use(new facebookStrategy({
			clientID: apiKeys.facebook.appid,
			clientSecret: apiKeys.facebook.secret,
			callbackURL: "http://localhost:3001/auth/facebook/callback"
		},
		function(accessToken, refreshToken, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {
			  
				// To keep the example simple, the user's Facebook profile is returned to
				// represent the logged-in user.  In a typical application, you would want
				// to associate the Facebook account with a user record in your database,
				// and return that user instead.
				return done(null, profile);
			});
		}
	));

	// set up twitter authentification
	passport.use(new twitterStrategy({
		consumerKey: apiKeys.twitter.customerKey,
		consumerSecret: apiKeys.twitter.customerSecret,
		callbackURL: "http://localhost:3001/auth/twitter/callback"
		},
	  	function(token, tokenSecret, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {

				// To keep the example simple, the user's Twitter profile is returned to
				// represent the logged-in user.  In a typical application, you would want
				// to associate the Twitter account with a user record in your database,
				// and return that user instead.
				return done(null, profile);
			});
	  	}
	));

	// set up local registering
	passport.use(new localStrategy(
		function(username, password, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {

				// find a user whose email is the same as the forms email
				// we are checking to see if the user trying to login already exists
		        User.findOne({ 'local.username' :  username }, function(err, user) {
		            // if there are any errors, return the error
		            if (err){
		                return done(err);
	                }

		            // check to see if theres already a user with that email
		            if (user) {
		                return done(null, false, { message: 'Username: '+username+' already taken, please try again' });
		            } else {

						// if there is no user with that username then create it
		                var newUser = new User();

		                // set the user's local credentials
		                newUser.local.username = username;
		                newUser.local.password = newUser.generateHash(password);

						// save the user
		                newUser.save(function(err) {
		                    if (err){
		                        throw err;
	                        }
		                    return done(null, newUser);
		                });
		            }

		        });    
			});
		}
	));


	// function to check if is authenticated
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { 
			return next(); 
		}
	  	res.redirect('/login');
	}

	// export an interface for this module
	module.exports.passport = passport;
	module.exports.ensureAuthenticated = ensureAuthenticated;

})();