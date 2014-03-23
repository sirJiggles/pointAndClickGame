
// resize callback
function resizeWindowCallback(){
    appVars.tablet = $(window).width() <= 850 ? true : false;
    appVars.mobile = $(window).width() <= 600 ? true : false;
    appVars.desktop = $(window).width() >= 960 ? true : false;
    appVars.largeScreen = $(window).width() >= 1530 ? true : false;

    if(!appVars.imagesSwapped && !appVars.mobile){
         $.each( $('img'), function(index, obj){
            if($(this).attr('data-high-res')){
                $(this).attr('src', $(this).attr('data-high-res'));
                appVars.imagesSwapped = true;
            }
        });
    }

}

// create external links function
function externalLinks(){
	 $('a.ext, .ext a').each(function() {
        if ($(this).attr('title') !== undefined && $(this).attr('title') !== "") {
            var extTitle = $(this).attr('title');
            $(this).attr('title', extTitle + ' (opens in a new window)');
        } else {
            $(this).attr('title', 'This link will open in a new window');
        }
        }).bind({
            'click':function() { window.open($(this).attr('href')); return false; },
            'keypress':function(e) { if (e.keyCode == 13){window.open($(this).attr('href')); return false;} }
    });
}