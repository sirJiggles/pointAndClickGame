/* Login controller */
(function(){

	var init = function(app, auth){
		// get /login
		app.get('/login', function(req, res){
			res.render('login', { user: req.user });
		});
	}

	module.exports.init = init;

})();