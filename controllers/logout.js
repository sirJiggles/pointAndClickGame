/* Logout controller */
(function(){

	var init = function(app, auth){
		// get /logout
		app.get('/logout', function(req, res){
			req.logout();
			res.redirect('/');
		});
	}

	module.exports.init = init;

})();