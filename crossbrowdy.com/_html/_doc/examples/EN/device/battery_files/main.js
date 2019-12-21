/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Battery management through the Battery Status API or compatible ones:
	if (CB_Device.Battery.isSupported())
	{
		CB_console("The battery management is supported through the Battery Status API or compatible ones.");
		CB_Elements.insertContentById("battery_api", "Yes");

		//Shows the object which contains information about the battery status:
		showBatteryInformation();

		//Checks whether the battery is charging or not:
		CB_Device.Battery.isCharging
		(
			function(isCharging)
			{
				if (isCharging) { CB_console("The battery is charging"); CB_Elements.insertContentById("battery_charging", "Yes"); }
				else { CB_console("The battery is not charging"); CB_Elements.insertContentById("battery_charging", "No"); }
			}
		);

		//Shows the battery charging level:
		CB_Device.Battery.getLevel(function(level) { CB_console("Battery level: " + level); CB_Elements.insertContentById("battery_level", level); });

		//Shows the battery charging time:
		CB_Device.Battery.getChargingTime(function(chargingTime) { CB_console("Battery charging time: " + chargingTime); CB_Elements.insertContentById("battery_charging_time", chargingTime); });

		//Shows the battery discharging time:
		CB_Device.Battery.getDischargingTime(function(dischargingTime) { CB_console("Battery discharging time: " + dischargingTime); CB_Elements.insertContentById("battery_discharging_time", dischargingTime); });

		//Managing battery events (the first parameter received, 'batteryObject', can be used to get the battery information):
		CB_Device.Battery.onChargingChange
		(
			function(batteryObject, eventName, e)
			{
				showBatteryEventsInformation("Charging status changed (probably charger was plugged/unplugged)!");
				CB_Elements.insertContentById("battery_charging", batteryObject.charging ? "Yes" : "No");
			}
		);
		CB_Device.Battery.onLevelChange
		(
			function(batteryObject, eventName, e) { showBatteryEventsInformation("Level changed! Level: " + batteryObject.level); CB_Elements.insertContentById("battery_level", batteryObject.level); }
		);
		var updateChargingDischargingTime = function(batteryObject)
		{
			CB_Elements.insertContentById("battery_charging_time", batteryObject.chargingTime);
			CB_Elements.insertContentById("battery_discharging_time", batteryObject.dischargingTime);
		}
		CB_Device.Battery.onChargingTimeChange(function(batteryObject, eventName, e) { showBatteryEventsInformation("Charging time changed!"); updateChargingDischargingTime(batteryObject); });
		CB_Device.Battery.onDischargingTimeChange(function(batteryObject, eventName, e) { showBatteryEventsInformation("Discharging time changed!"); updateChargingDischargingTime(batteryObject); });
	}
	else
	{
		CB_console("The battery management is not supported through the Battery Status API or compatible ones.");
		CB_Elements.insertContentById("battery_api", "No");
	}
	
	
	//Battery management through the Apache Cordova's Battery Status plugin:
	CB_Device.Battery.cordova_onChange
	(
		function(cordova_batteryObject)
		{
			if (cordova_batteryObject.isPlugged) { showCordovaBatteryEventsInformation("Battery status changed! The battery is charging (charger plugged)."); }
			else { showCordovaBatteryEventsInformation("Battery status changed! The battery is not charging (charger not plugged)."); }
		}
	);
	CB_Device.Battery.cordova_onLow
	(
		function(cordova_batteryObject) { showCordovaBatteryEventsInformation("Battery level is low! Level: " + cordova_batteryObject.level); }
	);
	CB_Device.Battery.cordova_onCritical
	(
		function(cordova_batteryObject) { showCordovaBatteryEventsInformation("Battery level is critical! Level: " + cordova_batteryObject.level); }
	);
}


//Shows battery info:
var currentBatteryObject = null;
var lastOutput = "";
var batteryObjectUpdatedTimes = 1;
function showBatteryInformation()
{
	if (!currentBatteryObject) { CB_Elements.insertContentById("battery_api_object", "No data"); }
	else
	{
		var output = "{ ";
		output += "level: " + currentBatteryObject.level + ", ";
		output += "charging: " + currentBatteryObject.charging + ", ";
		output += "chargingTime: " + currentBatteryObject.chargingTime + ", ";
		output += "dischargingTime: " + currentBatteryObject.dischargingTime;
		output += " }";
		if (output !== lastOutput)
		{
			CB_console("Battery Status API object got: ");
			CB_console(output);
			CB_Elements.insertContentById("battery_api_object", output + " [batteryObjectUpdatedTimes=" + (batteryObjectUpdatedTimes++) + "]");
			lastOutput = output;
		}
	}
	
	//Gets the object which contains information about the battery status:	
	CB_Device.Battery.get(function(batteryObject) { currentBatteryObject = batteryObject; setTimeout(showBatteryInformation, 1); });
}


//Shows battery events information:
function showBatteryEventsInformation(message)
{
	//Updates battery events information:
	CB_Elements.insertContentById("battery_penultimate_event", CB_Elements.id("battery_last_event").innerHTML);
	CB_Elements.insertContentById("battery_last_event", message);
	CB_console(message);
}


//Shows Apache Cordova's Battery Status plugin battery events information:
function showCordovaBatteryEventsInformation(message)
{
	//Updates Apache Cordova's Battery Status plugin battery events information:
	CB_Elements.insertContentById("cordova_battery_penultimate_event", CB_Elements.id("cordova_battery_last_event").innerHTML);
	CB_Elements.insertContentById("cordova_battery_last_event", message);
	CB_console(message);
}