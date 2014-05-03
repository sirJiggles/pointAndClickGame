/* JS file to configure passport in the server */
(function(){

	// vars needed to set up the auth
	var passport = require('passport'),
  		util = require('util'),
  		facebookStrategy = require('passport-facebook').Strategy,
  		fbAppID = '285819028259357',
  		fbSecret = 'cbd519394e5d96fbee7406659f313fa1';

	// Set up passport for logging in via facebook (will change later to use database)
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	passport.use(new facebookStrategy({
			clientID: fbAppID,
			clientSecret: fbSecret,
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