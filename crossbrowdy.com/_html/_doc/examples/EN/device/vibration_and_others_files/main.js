/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Shows the current time:
	showCurrentTime();

	
	//Device vibration management:
	if (CB_Device.Vibration.isSupported())
	{
		CB_console("The device vibration is supported (through the Vibration API or compatible ones as Apache Cordova's Vibration plugin).");
		CB_Elements.insertContentById("vibration_api", "Yes");
		CB_Elements.showById("vibration_controls");
	}
	else
	{
		CB_console("The device vibration is not supported.");
		CB_Elements.insertContentById("vibration_api", "No");
	}
}


//Shows the current time:
function showCurrentTime()
{
	//Gets a timestamp in milliseconds (elapsed since 1st of January 1970 00:00:00 UTC) representing the current time:
	var currentTimestamp = CB_Device.getTime(); //If possible and the CB_Configuration.CrossBase.CB_Device_getTime_HIGH_PRECISION option is enabled, it will use high resolution time which is more precise.
	CB_Elements.insertContentById("timestamp", currentTimestamp);

	//Gets the time elapsed since the "time origin" (https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin):
	var currentTiming = CB_Device.getTiming(); //If possible, it will use high resolution time which is more precise.
	CB_Elements.insertContentById("timing", currentTiming);
	
	//Calls itself again:
	setTimeout(showCurrentTime, 1);
}


//Vibrates once:
function vibrateOnce()
{
	CB_Device.Vibration.start(1000); //Vibrates 1 second.
}


//Vibrates more times:
function vibrateMoreTimes()
{
	CB_Device.Vibration.start(1000); //Vibrates 1 second.
	CB_Device.Vibration.start([2000, 1000, 3000, 1000, 5000]); //Vibrates 2 seconds, waits 1 second, vibrates 3 seconds, waits 1 second and vibrates 5 seconds.
}


//Stops vibration:
function vibrateStop()
{
	//Stops vibrating:
	CB_Device.Vibration.stop(); //The same as calling 'CB_Device.Vibration.start(0)'.
}