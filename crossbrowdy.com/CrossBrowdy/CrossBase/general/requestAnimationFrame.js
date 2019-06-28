'use strict';

// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavic, Darius Bacon

// MIT license

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

(function() {
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());


// Updated requestAnimationFrame polyfill that uses new high-resolution timestamp by Tim Hall
//
// References:
// http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
//
// Note by Tim Hall: this is my initial stab at it, *requires additional testing*
var hasPerformance = !!(window.performance && window.performance.now);
// Add new wrapper for browsers that don't have performance
if (!hasPerformance)
{
	// Store reference to existing rAF and initial startTime
	var rAF = window.requestAnimationFrame,
	startTime = +new Date;
	 
	// Override window rAF to include wrapped callback
	window.requestAnimationFrame = function(callback, element)
	{
		// Wrap the given callback to pass in performance timestamp
		var wrapped = function(timestamp)
		{
			// Get performance-style timestamp
			var performanceTimestamp = (timestamp < 1e12) ? timestamp : timestamp - startTime;
			return callback(performanceTimestamp);
		};
		 
		// Call original rAF with wrapped callback
		rAF(wrapped, element);
	}
}