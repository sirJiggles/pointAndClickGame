/* This is the JS file that the site (not the game) uses 
 * require all js files in order using juicer
 * 
 * @depends vendor/jquery-2.1.0.min.js
 */

 // On load
$(window).load(function () {

	// flash messanger functionality
	if($('.flash-msg').length > 0){
		window.setTimeout(function(){
			$('.flash-msg').fadeOut('slow');
		}, 4000);
	}
	
});
