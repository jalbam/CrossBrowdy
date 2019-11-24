<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here are some other functions to manage the device:
</p>
<pre><code class="language-javascript">
	//Gets a timestamp in milliseconds (elapsed since 1st of January 1970 00:00:00 UTC) representing the current time:
	var currentTimestamp = CB_Device.getTime(); //If possible and the CB_Configuration.CrossBase.CB_Device_getTime_HIGH_PRECISION option is enabled, it will use high resolution time which is more precise.
	
	//Gets the time elapsed since the "time origin" (https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin):
	var currentTiming = CB_Device.getTiming(); //If possible, it will use high resolution time which is more precise.
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Device.html" target="_blank">CB_Device</a> static class.
</p>