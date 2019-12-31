<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	It is possible to get information from the proximity sensor of a device (through the
	<a href="https://w3.org/TR/proximity/" target="_blank">Proximity Sensor API</a> or the
	Proximity Sensor Events as <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/ondeviceproximity" target="_blank">&quot;ondeviceproximity&quot;</a> or
	<a href="https://developer.mozilla.org/en-US/docs/Web/API/UserProximityEvent" target="_blank">&quot;onuserproximity&quot;</a> or compatible ones). Here is an example:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Proximity sensor management:
	if (CB_Device.Proximity.isSupported())
	{	
		CB_console("The proximity detection is supported (through the Proximity Sensor API or the Proximity Sensor Events as 'ondeviceproximity' or 'onuserproximity' or compatible ones).");
		
		//Gets the proximity:
		CB_Device.Proximity.get(function(data) { CB_console("Proximity detected: " + data.value); }); //Data will be normalized automatically.
	}
	else
	{
		CB_console("The proximity detection is not supported.");
	}
</code></pre>
<p>
	Note that CrossBrowdy will try to normalize automatically the data of the event object received to minimize the differences across different clients, so you will normally not have to worry about this.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Device.html" target="_blank">CB_Device</a> and the <a href="_html/_doc/api/CB_Device.Proximity.html" target="_blank">CB_Device.Proximity</a> static classes.
</p>