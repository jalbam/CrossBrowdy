<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	It is possible to make a device vibrate (through the <a href="https://developer.mozilla.org/docs/Web/API/Vibration_API" target="_blank">Vibration API</a> or compatible ones as <a href="https://github.com/apache/cordova-plugin-vibration" target="_blank">Apache Cordova's Vibration plugin</a>). Here is an example of device vibration management:
</p>
<pre><code class="language-javascript">
	//Device vibration management:
	if (CB_Device.Vibration.isSupported())
	{
		CB_console("The device vibration is supported (through the Vibration API or compatible ones as Apache Cordova's Vibration plugin).");
		 
		//Starts vibrating:
		CB_Device.Vibration.start([2000, 1000, 3000, 1000, 5000]); //Vibrates 2 seconds, waits 1 second, vibrates 3 seconds, waits 1 second and vibrates 5 seconds.
		
		//Stops vibrating (this should normally be done after some time unless we want to stop the previous vibration immediately):
		CB_Device.Vibration.stop(); //The same as calling 'CB_Device.Vibration.start(0)'.
	}
	else
	{
		CB_console("The device vibration is not supported.");
	}
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Device.html" target="_blank">CB_Device</a> and the <a href="_html/_doc/api/CB_Device.Vibration.html" target="_blank">CB_Device.Vibration</a> static classes.
</p>