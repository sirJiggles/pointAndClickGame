
/*
 * Main javascript file
 * 
 * require all js files in order using juicer
 * 
 * @depends vendor/jquery-2.1.0.min.js
 * @depends app/core.js
 * @depends app/math/vector-2d.js
 * @depends app/math/utils.js
 * @depends app/lib/mover.js
 * @depends app/lib/sprite-sheet.js
 * @depends app/lib/path-seg.js
 * @depends app/lib/debug-dot.js
 */

// On ready
$(window).ready(function () {
    // start the madness
    core.init();
});
