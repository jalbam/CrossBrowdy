'use strict';

if (!Date.now) { Date.now = function() { return new Date().getTime(); } }


// @license http://opensource.org/licenses/MIT
// copyright Paul Irish 2015
// Added code by Aaron Levine from: https://gist.github.com/Aldlevine/3f716f447322edbb3671
// Some modifications by Joan Alba Maldonado.
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values
// if you want values similar to what you'd get with real perf.now, place this towards the head of the page
// but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed
// Gist: https://gist.github.com/jalbam/cc805ac3cfe14004ecdf323159ecf40e
// TODO: Think about adding vendor prefixes.
(function()
{
	if (window.performance && window.performance.now) { return; }

	window.performance = window.performance || {};

	if
	(
		window.performance.timing && window.performance.timing.navigationStart &&
		window.performance.mark &&
		window.performance.clearMarks &&
		window.performance.getEntriesByName
	)
	{
		window.performance.now = function()
		{
			window.performance.clearMarks('__PERFORMANCE_NOW__');
			window.performance.mark('__PERFORMANCE_NOW__');
			return window.performance.getEntriesByName('__PERFORMANCE_NOW__')[0].startTime;
		};
	}
	else if ("now" in window.performance === false)
	{
		var nowOffset = Date.now();

		if (window.performance.timing && window.performance.timing.navigationStart)
		{
			nowOffset = window.performance.timing.navigationStart
		}

		window.performance.now = function now()
		{
			return Date.now() - nowOffset;
		}
	}
})();


// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavic, Darius Bacon and Joan Alba Maldonado.
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// Added high resolution timing. This window.performance.now() polyfill can be used: https://gist.github.com/jalbam/cc805ac3cfe14004ecdf323159ecf40e
// MIT license
// Gist: 
(function() {
	var vendors = ['webkit', 'moz', 'ms', 'o'], vp = null;
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame && !window.cancelAnimationFrame; x++)
	{
		vp = vendors[x];
		window.requestAnimationFrame = window.requestAnimationFrame || window[vp + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window.cancelAnimationFrame || window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
	}
	if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) //iOS6 is buggy.
	{
		var lastTime = 0;
		window.requestAnimationFrame = function(callback, element)
		{
			var now = window.performance.now();
			var nextTime = Math.max(lastTime + 16, now); //First time will execute it immediately but barely noticeable and performance is gained.
			return setTimeout(function() { callback(lastTime = nextTime); }, nextTime - now);
		};
		window.cancelAnimationFrame = clearTimeout;
	}
}());