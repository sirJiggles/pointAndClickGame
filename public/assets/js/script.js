
/*
 * Main javascript file
 * 
 * require all js files in order using juicer
 * 
 * @depends vendor/jquery-2.1.0.min.js
 * @depends vendor/a-star.js
 * @depends app/core.js
 * @depends app/math/vector-2d.js
 * @depends app/math/utils.js
 * @depends app/lib/graph-manager.js
 * @depends app/lib/mover.js
 * @depends app/lib/sprite-sheet.js
 * @depends app/lib/debug-dot.js
 * @depends app/lib/room.js
 * @depends app/lib/door-generator.js
 * @depends ui.js
 */

// On ready
$(window).ready(function () {
    // start the madness
    core.init();
});

// On resize
$(window).resize(function(){
    clearTimeout(core.resizeTimer);
    core.resizeTimer = setTimeout(core.resizeWindowCallback, 20);
});
