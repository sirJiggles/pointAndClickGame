/* JS file to configure passport in the server */
(function(){

	// vars needed to set up the auth
	var passport = require('passport'),
		apiKeys = require('./api-keys').keys,
  		util = require('util'),
  		facebookStrategy = require('passport-facebook').Strategy,
  		twitterStrategy =  require('passport-twitter').Strategy,
  		localStrategy = require('passport-local').Strategy;

	var users = [
	    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
	  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
	];


	// Set up passport for logging in via facebook (will change later to use database)
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
 
	passport.deserializeUser(function(obj, done) {
		findById(id, function (err, user) {
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

				// Find the user by username.  If there is no user with the given
				// username, or the password is not correct, set the user to `false` to
				// indicate failure and set a flash message.  Otherwise, return the
				// authenticated `user`.
				findByUsername(username, function(err, user) {
					if (err) { return done(err); }
					if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
					if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
					return done(null, user);
				})
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

	// functions for finding users
	function findById(id, fn) {
		var idx = id - 1;
		if (users[idx]) {
			fn(null, users[idx]);
		} else {
			fn(new Error('User ' + id + ' does not exist'));
		}
	}

	function findByUsername(username, fn) {
		for (var i = 0, len = users.length; i < len; i++) {
			var user = users[i];
			if (user.username === username) {
			  return fn(null, user);
			}
		}
		return fn(null, null);
	}

	// export an interface for this module
	module.exports.passport = passport;
	module.exports.ensureAuthenticated = ensureAuthenticated;

})();