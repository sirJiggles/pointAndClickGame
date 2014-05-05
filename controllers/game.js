/* Game controller */
(function(){

	var init = function(app, auth){

		// get request on index route
		app.get('/game', auth.ensureAuthenticated, function(req, res){
	  		res.render('game', { user: req.user, nav:false });
		});
	}

	module.exports.init = init;

})();