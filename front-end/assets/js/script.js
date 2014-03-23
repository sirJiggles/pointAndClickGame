
/*
 * Main javascript file
 * 
 * require all js files in order using juicer
 * 
 * @depends vendor/jquery-2.1.0.min.js
 * @depends core/vars.js
 * @depends app-functions.js
 * @depends core/socket.js
 */

// On ready
$(window).ready(function () {
    
     // Generic resize function
    $(window).resize(function(){
        clearTimeout(appVars.resizeTimer);
        appVars.resizeTimer = setTimeout(resizeWindowCallback, 500);
    });

});

// On load
$(window).load(function(){
    // External link class JS
    //externalLinks();
    resizeWindowCallback();
});