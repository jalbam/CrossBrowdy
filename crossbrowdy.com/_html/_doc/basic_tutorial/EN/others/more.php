<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here are some other interesting functions:
</p>
<pre><code class="language-javascript">
	//Calls a function once as it was one of the calls of a "symmetric" interval of a series of calls, having in mind the time taken by previous calls:
	CB_symmetricCall(function(timeCalled) { CB_console("Function called!"); }, 1000, "interval_id"); //Similar to 'requestAnimationFrame'.
	
	//Clears the stored last time used by 'CB_symmetricCall' for a given symmetric interval identifier:
	CB_symmetricCallClear("interval_id");
</code></pre>

<p>
	Note that many other features
	(such as
	<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now" target="_blank">Date.now</a>,
	<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">Promise</a>,
	<a href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame" target="_blank">requestAnimationFrame</a>,
	etc.)
	will be present even when they are not natively supported, using polyfills automatically when needed.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about some <a href="_html/_doc/api/global.html" target="_blank">global functions and variables</a>.
</p>