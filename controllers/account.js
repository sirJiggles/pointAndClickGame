/* Account controller */
(function(){

	var init = function(app, auth){
		// get account route
		app.get('/account', auth.ensureAuthenticated, function(req, res){
	  		res.render('account', { user: req.user });
		});
	}

	module.exports.init = init;

})();