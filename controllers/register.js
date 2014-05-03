/* Register controller */
(function(){

	var init = function(app, auth){
		// get /register
		app.get('/register', function(req, res){
			res.render('register');
		});
	}

	module.exports.init = init;

})();