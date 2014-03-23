// Define the appvars used in various functions etc first
var appVars = {
    tablet: $(window).width() <= 850 ? true : false,
    mobile: $(window).width() <= 600 ? true : false,
    desktop: $(window).width() >= 960 ? true : false,
    largeScreen: $(window).width() >= 1530 ? true : false,
    resizeTimer: null,
    imagesSwapped: false,
    socket: io.connect('http://localhost:3000')
}
