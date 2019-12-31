<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Different devices will use different ways to know their current location, as for example GPS or wifi, etc. You do not need to worry about this as all will be done internally.
</p>

<p>
	You can detect whether the device supports geolocation management (through <a href="https://developer.mozilla.org/docs/Web/API/Geolocation" target="_blank">Geolocation API</a> or compatible ones as <a href="https://github.com/apache/cordova-plugin-geolocation" target="_blank">Apache Cordova's Geolocation plugin</a>) easily:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Geolocation management support detection:
	if (CB_Device.Location.isSupported())
	{
		CB_console("The Geolocation API (or compatible ones as Apache Cordova's Geolocation plugin) is supported.");
		
		//Do things here...
	}
	else
	{
		CB_console("The Geolocation API (or compatible ones as Apache Cordova's Geolocation plugin) is not supported.");
	}
</code></pre>

<p>
	Here is an example of geolocation management, to get the position once:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets the position once:
	CB_Device.Location.get
	(
		//Position is obtained successfully:
		function(data) { CB_console(data); }, //Shows the object with the location information. Data will be normalized automatically.
		//Position cannot be obtained successfully:
		function(error) { CB_console(error); }, //Shows the error object.
		//Options:
		{ enableHighAccuracy: false } //Without high accuracy.
	);
</code></pre>

<p>
	The position can also be gotten constantly, as soon as it changes:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets the position constantly (as soon as it changes):
	var watchID = CB_Device.Location.getConstantly
	(
		//Position is obtained successfully:
		function(data) { CB_console(data); }, //Shows the object with the location information. Data will be normalized automatically.
		//Position cannot be obtained successfully:
		function(error) { CB_console(error); }, //Shows the error object.
		//Options (optional):
		{
			enableHighAccuracy: true, //Optional. Requests high accuracy.
			timeout: 99999, //Optional. Default: Infinity.
			maximumAge: 0 //Optional.
		} 
	);
	
	//Stops getting the position constantly:
	CB_Device.Location.getConstantlyDisable(watchID); //This should be done after some time, not immediately.
</code></pre>

<p>
	Note that CrossBrowdy will try to normalize automatically the data of the event object received to minimize the differences across different clients, so you will normally not have to worry about this.
</p>

<p>
	Some devices will also allow to keep getting the position always, even when the app is invisible or screen is locked:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Sets an awake lock which tries to keep getting the position, even when the app is invisible or screen is locked:
	var keepAwakeLock = CB_Device.Location.keepAwake();
	if (keepAwakeLock)
	{
		CB_console("Awake lock set!");
		
		//Tries to stop the awake lock (this should be done after some time to see the difference, not immediately):
		keepAwakeLock = CB_Device.Location.keepAwake(false, keepAwakeLock);
		if (typeof(keepAwakeLock) === "undefined") { CB_console("Awake lock stopped!"); }
	}
	else { CB_console("Awake lock could not be set!"); }
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Device.html" target="_blank">CB_Device</a> and the <a href="_html/_doc/api/CB_Device.Location.html" target="_blank">CB_Device.Location</a> static classes.
</p>