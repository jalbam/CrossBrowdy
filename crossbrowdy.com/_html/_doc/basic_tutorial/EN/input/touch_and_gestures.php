<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of touch management with CrossBrowdy:
</p>
<pre><code class="language-javascript">
	//Some useful functions:
	var maxTouchPointsOrNull = CB_Touch.getMaxTouchPoints(); //Maximum of touch points supported by the device (or null if it was not possible to calculate).
	var myBoolean = CB_Touch.delay(250); //First time, it will return true.
	var myBoolean_2 = CB_Touch.delay(); //Next calls, returns false if the defined time (250 milliseconds) did not expire yet (and first parameter would be ignored) or true otherwise (and will act as the first time again).
	
	//Managing touch events:
	//Note: the pressure will be tried to be calculated automatically and added to the "force" property of the touch event object received by all the touch events.
	CB_Touch.onCancel(function(e) { CB_console("The 'onCancel' event was fired!"); });
	CB_Touch.onEnd(function(e) { CB_console("The 'onEnd' event was fired!"); });
	CB_Touch.onEnter(function(e) { CB_console("The 'onEnter' event was fired!"); });
	CB_Touch.onLeave(function(e) { CB_console("The 'onLeave' event was fired!"); });
	CB_Touch.onMove(function(e) { CB_console("The 'onMove' event was fired!"); });
	CB_Touch.onStart(function(e) { CB_console("The 'onStart' event was fired!"); });
	var lastTouchEventObjectOrNull = CB_Touch.getData(); //Touch event object received by the last touch event fired, if it was "onTouchStart", "onTouchEnter" or "onTouchMove". The "onTouchEnd" and "onTouchLeave" events set it to "null".
</code></pre>

<p>
	Note that the <a href="_html/_doc/api/CB_Touch.html#.delay" target="_blank">CB_Touch.delay</a> function can be useful, for example, to prevent the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event" target="_blank">onTouchStart</a> event to fire twice or more when a layer (container) is closed and behind there is another one with also the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event" target="_blank">onTouchStart</a> event.
</p>

<p>
	Gestures and pressure can also be managed thanks to the <a href="https://hammerjs.github.io/" target="_blank">Hammer.js</a> and <a href="https://pressurejs.com/" target="_blank">Pressure.js</a> libraries:
</p>
<pre><code class="language-javascript">
	//Gets the Hammer.js object (if any), useful for managing touch gestures:
	var HammerJSObject = CB_Touch.getHammerJSObject();
	//Do things with 'HammerJSObject'...
	
	//Gets the Pressure.js object (if any), useful for managing Force Touch/3D Touch and Pointer Pressure features:
	var PressureJSObject = CB_Touch.getPressureJSObject();
	//Do things with 'PressureJSObject'...
</code></pre>

Read the documentation of the <a href="https://hammerjs.github.io/" target="_blank">Hammer.js</a> and <a href="https://pressurejs.com/" target="_blank">Pressure.js</a> libraries to get more information about how to use them.

<p>
	It is important to have into account that pressure will be tried to be calculated automatically and added to the "force" property of the touch event object received by all the touch events managed by CrossBrowdy. So, for common usage, it is very likely that you do not need to use the <a href="_html/_doc/api/CB_Touch.html#.getPressureJSObject" target="_blank">CB_Touch.getPressureJSObject</a> function at all.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Touch.html" target="_blank">CB_Touch</a> static class.
</p>