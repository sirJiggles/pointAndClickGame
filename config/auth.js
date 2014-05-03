/* JS file to configure passport in the server */
(function(){

	// vars needed to set up the auth
	var passport = require('passport'),
		apiKeys = require('./api-keys').keys,
  		util = require('util'),
  		facebookStrategy = require('passport-facebook').Strategy,
  		twitterStrategy =  require('passport-twitter').Strategy;

	// Set up passport for logging in via facebook (will change later to use database)
	passport.serializeUser(function(user, done) {
		done(null, user);
	});
 
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
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