<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Using the <a href="api/CB_Pointer.html" target="_blank">CB_Pointer</a> static class is a good way to deal with any pointer event (it could also come from a mouse or be a touch event). Internally, it uses the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank">Pointer API</a> if available and falls back to emulation otherwise.
</p>

<p>
	Here is an example of pointer management with CrossBrowdy:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Managing pointer events (use "null" as the first parameter to remove them):
	CB_Pointer.onDown(function(e) { CB_console("The 'onDown' event has been fired!"); });
	CB_Pointer.onUp(function(e) { CB_console("The 'onUp' event has been fired!"); });
	CB_Pointer.onMove(function(e) { CB_console("The 'onMove' event has been fired!"); });
	CB_Pointer.onOver(function(e) { CB_console("The 'onOver' event has been fired!"); });
	CB_Pointer.onOut(function(e) { CB_console("The 'onOut' event has been fired!"); });
	CB_Pointer.onEnter(function(e) { CB_console("The 'onEnter' event has been fired!"); });
	CB_Pointer.onLeave(function(e) { CB_console("The 'onLeave' event has been fired!"); });
	CB_Pointer.onCancel(function(e) { CB_console("The 'onCancel' event has been fired!"); });
	CB_Pointer.onGotPointCapture(function(e) { CB_console("The 'onGotPointCapture' event has been fired!"); });
	CB_Pointer.onLostPointCapture(function(e) { CB_console("The 'onLostPointCapture' event has been fired!"); });
	
	//Sets the desired value for the CSS' style pointer-events property of a given element:
	var element = CB_Elements.id("my_element"); //Equivalent to document.getElementById("my_element").
	CB_Pointer.setPointerEventsProperty(element, "visibleStroke"); //Sets the "visibleStroke" as value.
</code></pre>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Pointer.html" target="_blank">CB_Pointer</a> static class.
</p>