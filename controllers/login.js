/* Login controller */
(function(){

	var init = function(app, auth){

		app.get('/login', function(req, res){
			res.render('login', { user: req.user, message: req.session.messages });
		});

		app.post('/login', function(req, res, next) {
			auth.passport.authenticate('local', function(err, user, info) {
				if (err) { return next(err) }
				if (!user) {
					req.session.messages =  [info.message];
					return res.redirect('/login')
				}
				req.logIn(user, function(err) {
					if (err) { return next(err); }
					return res.redirect('/');
				});
			})(req, res, next);
		});

	}

	module.exports.init = init;

})();