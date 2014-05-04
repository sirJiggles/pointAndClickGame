/* JS file to configure passport in the server */
(function(){

	// vars needed to set up the auth
	var passport = require('passport'),
		User = require('../models/User'),
  		util = require('util'),
  		facebookStrategy = require('passport-facebook').Strategy,
  		twitterStrategy =  require('passport-twitter').Strategy,
  		localStrategy = require('passport-local').Strategy;


	// Set up passport for logging in via facebook (will change later to use database)
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
 
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
            done(err, user);
        });
	});

	// set up connecting via facebook
	passport.use(new facebookStrategy({
			clientID: process.env.facebookAppid,
			clientSecret: process.env.facebookSecret,
			callbackURL: process.env.url + "/auth/facebook/callback"
		},
		function(accessToken, refreshToken, profile, done) {

			// find the user in the database based on their facebook id
	        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err){
	                return done(err);
                }

				// if the user is found, then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
	                // if there is no user found with that facebook id, create them
	                var newUser = new User();

					// set all of the facebook information in our user model
	                newUser.facebook.id    = profile.id; 	                
	                newUser.facebook.token = accessToken;	                
	                newUser.facebook.username  = profile.name.givenName + ' ' + profile.name.familyName;

					// save our user to the database
	                newUser.save(function(err) {
	                    if (err){
	                        throw err;
                        }
	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
	            }

	        });
		}
	));

	// set up twitter authentification
	passport.use(new twitterStrategy({
		consumerKey: process.env.twitterCustomerKey,
		consumerSecret: process.env.twitterCustomerSecret,
		callbackURL: process.env.url + "/auth/twitter/callback"
		},
	  	function(token, tokenSecret, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {
				User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

		            if (err){
		                return done(err);
	                }

					// if the user is found then log them in
		            if (user) {
		                return done(null, user); // user found, return that user
		            } else {
		                // if there is no user, create them
		                var newUser = new User();

						// set all of the user data that we need
		                newUser.twitter.id          = profile.id;
		                newUser.twitter.token       = tokenSecret;
		                newUser.twitter.username    = profile.username;
		                newUser.twitter.displayName = profile.displayName;

						// save our user into the database
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

	// set up local registering
	passport.use('local-signup', new localStrategy(
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
		                    return done(null, newUser, {message: 'Account created :D'});
		                });
		            }

		        });    
			});
		}
	));

	// system for logging in locally
	passport.use('local-login', new localStrategy(
		function(username, password, done) {
			process.nextTick(function () {
		        User.findOne({ 'local.username' :  username }, function(err, user) {
		            // if there are any errors, return the error before anything else
		            if (err){
		                return done(err);
	                }

		            // if no user is found, return the message
		            if (!user){
		                return done(null, false, { message: 'Username not found in the system' });
	                }
					// if the user is found but the password is wrong
		            if (!user.validPassword(password)){
		                return done(null, false, { message: 'Oops! Wrong password.'}); 
	                }
		            // all is well, return successful user
		            return done(null, user);
		        });
	        });
		}
	));

	// function to check if is authenticated
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { 
			return next(); 
		}
	  	res.redirect('/');
	}

	// export an interface for this module
	module.exports.passport = passport;
	module.exports.ensureAuthenticated = ensureAuthenticated;

})();