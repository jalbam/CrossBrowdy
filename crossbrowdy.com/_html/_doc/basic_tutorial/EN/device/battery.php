<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	It is possible to get information about the battery of a device and manage some events.	Here is an example of device battery management (through the <a href="https://developer.mozilla.org/docs/Web/API/Battery_Status_API" target="_blank">Battery Status API</a> or compatible ones):
</p>
<pre><code class="language-javascript">
	//Battery management through the Battery Status API or compatible ones:
	if (CB_Device.Battery.isSupported())
	{
		CB_console("The battery management is supported through the Battery Status API or compatible ones.");
		
		//Shows the object which contains information about the battery status:
		CB_Device.Battery.get(function(batteryObject) { CB_console(batteryObject); });
		
		//Checks whether the battery is charging or not:
		CB_Device.Battery.isCharging
		(
			function(isCharging)
			{
				if (isCharging) { CB_console("The battery is charging"); }
				else { CB_console("The battery is not charging"); }
			}
		);

		//Shows the battery charging level:
		CB_Device.Battery.getLevel(function(level) { CB_console("Battery level: " + level); });
		
		//Shows the battery charging time:
		CB_Device.Battery.getChargingTime(function(chargingTime) { CB_console("Battery charging time: " + chargingTime); });
		
		//Shows the battery discharging time:
		CB_Device.Battery.getDischargingTime(function(dischargingTime) { CB_console("Battery discharging time: " + dischargingTime); });
		
		//Managing battery events (the first parameter received, 'batteryObject', can be used to get the battery information):
		CB_Device.Battery.onChargingChange
		(
			function(batteryObject, eventName, e) { CB_console("Charging status changed (probably charger was plugged/unplugged)!"); }
		);
		CB_Device.Battery.onLevelChange
		(
			function(batteryObject, eventName, e) { CB_console("Level changed!"); }
		);
		CB_Device.Battery.onChargingTimeChange
		(
			function(batteryObject, eventName, e) { CB_console("Charging time changed!"); }
		);
		CB_Device.Battery.onDischargingTimeChange
		(
			function(batteryObject, eventName, e) { CB_console("Discharging time changed!"); }
		);
	}
	else
	{
		CB_console("The battery management is not supported through the Battery Status API or compatible ones.");
	}
</code></pre>

<p>
	When the <a href="https://developer.mozilla.org/docs/Web/API/Battery_Status_API" target="_blank">Battery Status API</a> or compatible ones are not available, it is still possible to manage the battery through the <a href="https://github.com/apache/cordova-plugin-battery-status" target="_blank">Apache Cordova's Battery Status plugin</a>:
</p>
<pre><code class="language-javascript">
	//Battery management through the Apache Cordova's Battery Status plugin:
	CB_Device.Battery.cordova_onChange
	(
		function(cordova_batteryObject)
		{
			CB_console("Battery status changed!"); }
			if (cordova_batteryObject.isPlugged) { CB_console("The battery is charging"); }
			else { CB_console("The battery is not charging"); }
		);
	CB_Device.Battery.cordova_onLow
	(
		function(cordova_batteryObject) { CB_console("Battery level is low! Level: " + cordova_batteryObject.level); }
	);
	CB_Device.Battery.cordova_onCritical
	(
		function(cordova_batteryObject) { CB_console("Battery level is critical! Level: " + cordova_batteryObject.level); }
	);
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Device.html" target="_blank">CB_Device</a> and the <a href="_html/_doc/api/CB_Device.Battery.html" target="_blank">CB_Device.Battery</a> static classes.
</p>