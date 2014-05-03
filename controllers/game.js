/* Game controller */
(function(){

	var init = function(app, auth){

		// get request on index route
		app.get('/game', function(req, res){
			// if there is no login
			if(!req.user){
				res.redirect('/');
				return false;
			}
	  		res.render('game', { user: req.user });
		});
	}

	module.exports.init = init;

})();