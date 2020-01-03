<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	With CrossBrowdy, you can manage physical movements in the device.
</p>

<p>
	You can detect whether the device supports physical movements management easily (through the <a href="https://developer.mozilla.org/docs/Web/API/DeviceMotionEvent" target="_blank">Device Motion Event</a> used by the <a href="https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation" target="_blank">Device Orientation API</a> or compatible ones):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Physical movements management support detection:
	if (CB_Device.Motion.isSupported())
	{
		CB_console("The Device Motion Event (used by the Device Orientation API or compatible ones) is supported.");
		
		//Do things here...
	}
	else
	{
		CB_console("The Device Motion Event (used by the Device Orientation API or compatible ones) is not supported.");
	}
</code></pre>

<p>
	To set an event handler to manage physical movements and their speed (normally, detected by an accelerometer):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Checks physical movements and their speed (use "null" as the first parameter to remove them):
	CB_Device.Motion.onChange
	(
		//Motion is obtained successfully:
		function(data) //Data will be normalized automatically.
		{
			CB_console
			(
				"Motion obtained successfully:\n" +
				"Acceleration in x: "  + data.acceleration.x + "\n" +
				"Acceleration in y: "  + data.acceleration.y + "\n" +
				"Acceleration in z: "  + data.acceleration.z + "\n" +
				"Acceleration in x (with gravity): "  + data.accelerationIncludingGravity.x + "\n" +
				"Acceleration in y (with gravity): "  + data.accelerationIncludingGravity.y + "\n" +
				"Acceleration in z (with gravity): "  + data.accelerationIncludingGravity.z + "\n" +
				"Interval: "  + data.interval + "\n" +
				"Rotation Rate Alpha: "  + data.rotationRate.alpha + "\n" +
				"Rotation Rate Beta: "  + data.rotationRate.beta + "\n" +
				"Rotation Rate Gamma: "  + data.rotationRate.gamma
			);
		}
	);
</code></pre>
<p>
	Note that CrossBrowdy will try to normalize automatically the data of the event object received to minimize the differences across different clients, so you will normally not have to worry about this.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Device.html" target="_blank">CB_Device</a> and the <a href="api/CB_Device.Motion.html" target="_blank">CB_Device.Motion</a> static classes.
</p>