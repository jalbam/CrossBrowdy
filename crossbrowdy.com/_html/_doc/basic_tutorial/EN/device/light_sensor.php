<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	It is possible to get information from the ambient light sensor of a device (through the <a href="https://w3.org/TR/ambient-light/" target="_blank">Ambient Light Sensor API</a> or the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Events" target="_blank">Ambient Light Sensor Events (&quot;ondevicelight&quot;)</a> or <a href="https://modernweb.com/introduction-to-the-ambient-light-api/" target="_blank">&quot;onlightlevel&quot; event</a> or compatible ones). Here is an example:
</p>
<pre><code class="language-javascript">
	//Ambient light sensor management:
	if (CB_Device.AmbientLight.isSupported())
	{
		CB_console("The ambient light detection is supported (through the Ambient Light Sensor API or the Ambient Light Sensor Events ('ondevicelight') or 'onlightlevel' event or compatible ones).");
		
		//Gets the ambient light:
		CB_Device.AmbientLight.get(function(data) { CB_console("Light detected: " + data.value); }); //Data will be normalized automatically.
	}
	else
	{
		CB_console("The ambient light detection is not supported.");
	}
</code></pre>
<p>
	Note that CrossBrowdy will try to normalize automatically the data of the event object received to minimize the differences across different clients, so you will normally not have to worry about this.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Device.html" target="_blank">CB_Device</a> and the <a href="_html/_doc/api/CB_Device.AmbientLight.html" target="_blank">CB_Device.AmbientLight</a> static classes.
</p>