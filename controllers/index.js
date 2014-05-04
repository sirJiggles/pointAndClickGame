/* Index controller */
(function(){

	var init = function(app, auth){

		// get request on index route
		app.get('/', function(req, res){
			var navVar = (typeof req.user === 'undefined') ? true : undefined;
			req.session.messages = (typeof req.user === 'undefined') ? '' : req.session.messages;
	  		res.render('index', { 
	  			user: req.user,
	  			nav: navVar,
	  			message: req.session.messages
	  		});
		});

		app.post('/', function(req, res, next) {
			auth.passport.authenticate('local-signup', function(err, user, info) {
				if (err) { return next(err) }
				if (!user) {
					req.session.messages =  [info.message];
					return res.redirect('/');
				}
				req.logIn(user, function(err) {
					if (err) { return next(err); }
					req.session.messages = null;
					return res.redirect('/');
				});
			})(req, res, next);
		});
	}

	module.exports.init = init;

})();