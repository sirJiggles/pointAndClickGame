/* Index controller */
(function(){

	var init = function(app, auth){

		// get request on index route
		app.get('/', function(req, res){
	  		res.render('index', { user: req.user });
		});
	}

	module.exports.init = init;

})();