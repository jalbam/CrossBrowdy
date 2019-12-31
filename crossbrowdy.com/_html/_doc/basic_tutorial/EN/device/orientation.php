<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	With CrossBrowdy, you can know the device orientation every moment.
</p>

<p>
	You can detect whether the device supports orientation management easily (through the <a href="https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent" target="_blank">Device Orientation Event</a> used by the <a href="https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation" target="_blank">Device Orientation API</a> or compatible ones):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Orientation management support detection:
	if (CB_Device.Orientation.isSupported())
	{
		CB_console("The Device Orientation Event (used by the Device Orientation API or compatible ones) is supported.");
		
		//Do things here...
	}
	else
	{
		CB_console("The Device Orientation Event (used by the Device Orientation API or compatible ones) is not supported.");
	}
</code></pre>

<p>
	To set an event handler called each time that the orientation changes (normally, detected by a gyroscope):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Checks when the orientation changes (use "null" as the first parameter to remove them):
	CB_Device.Orientation.onChange
	(
		//Orientation is obtained successfully:
		function(data) //Data will be normalized automatically.
		{
			CB_console
			(
				"Orientation obtained successfully:\n" +
				"Alpha: " + data.alpha + "\n" +
				"Beta: " + data.beta + "\n" +
				"Gamma: " + data.gamma + "\n" +
				"Absolute: " + (data.absolute ? "yes" : "no")
			);
		}
	);
</code></pre>
<p>
	Note that CrossBrowdy will try to normalize automatically the data of the event object received to minimize the differences across different clients, so you will normally not have to worry about this.
</p>

<p>
	Finally, some devices will also allow you to detect whether the compass / magnetometer (not gyroscope) needs calibration:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Checks whether the compass / magnetometer needs calibration (use "null" as the first parameter to remove them):
	if (CB_Device.Orientation.isCompassNeedsCalibrationSupported())
	{
		CB_Device.Orientation.onCompassNeedsCalibration(function() { CB_console("Compass needs calibration!"); });
	}
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Device.html" target="_blank">CB_Device</a> and the <a href="_html/_doc/api/CB_Device.Orientation.html" target="_blank">CB_Device.Orientation</a> static classes.
</p>