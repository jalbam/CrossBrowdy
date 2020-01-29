/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Geolocation management support detection:
	if (CB_Device.Location.isSupported())
	{
		CB_console("The Geolocation API (or compatible ones as Apache Cordova's Geolocation plugin) is supported.");

		CB_Elements.showById("controls");

		CB_Elements.insertContentById("geolocation_supported", "Yes");
		
		//Gets the position once:
		CB_Device.Location.get
		(
			//Position is obtained successfully:
			function(data) { showData(data, "once"); }, //Shows the object with the location information. Data will be normalized automatically.
			//Position cannot be obtained successfully:
			function(error) { showError(error, "once"); }, //Shows the error object.
			//Options:
			{ enableHighAccuracy: false } //Without high accuracy.
		);
	}
	else
	{
		CB_console("The Geolocation API (or compatible ones as Apache Cordova's Geolocation plugin) is not supported.");
		CB_Elements.insertContentById("geolocation_supported", "No");
	}
}


//Starts getting the location constantly:
var watchID = null;
var keepAwakeLock = null;
function getLocationConstantly()
{
	if (watchID || keepAwakeLock) { getLocationConstantlyStop(); } //If it was enabled, stops it first.
	
	CB_console("Starts getting the location constantly...");
	
	CB_Elements.insertContentById("location_constantly", "No data. Waiting...");
	
	//Gets the position constantly (as soon as it changes):
	watchID = CB_Device.Location.getConstantly
	(
		//Position is obtained successfully:
		function(data) { showData(data, "constantly", watchID); }, //Shows the object with the location information. Data will be normalized automatically.
		//Position cannot be obtained successfully:
		function(error) { showError(error, "constantly", watchID); }, //Shows the error object.
		//Options:
		{ enableHighAccuracy: true } //Requests high accuracy.
	);
	
	//Sets an awake lock which tries to keep getting the position, even when the app is invisible or screen is locked:
	keepAwakeLock = CB_Device.Location.keepAwake();
	if (keepAwakeLock) { CB_console("Awake lock set!");	}
	else { CB_console("Awake lock could not be set!"); }
}


//Stops getting the location constantly:
function getLocationConstantlyStop()
{
	//If it was enabled, exits:
	if (!watchID)
	{
		CB_console("Cannot be stopped if it is not enabled yet.");
		CB_Elements.insertContentById("location_constantly", "Cannot be stopped if it is not enabled yet.");
		return;
	} 
	
	CB_console("Stops getting the location constantly [watchID=" + watchID + "]...");
	
	//Stops getting the position constantly:
	watchID = CB_Device.Location.getConstantlyDisable(watchID);
	
	//Tries to stop the awake lock:
	keepAwakeLock = CB_Device.Location.keepAwake(false, keepAwakeLock);
	if (typeof(keepAwakeLock) === "undefined") { CB_console("Awake lock stopped!"); }
	
	CB_Elements.insertContentById("location_constantly", "[STOPPED]");
}


//Shows the data in the desired element:
function showData(data, dataType, watchID)
{
	CB_console("Data received:");
	var output = "Data: { ";
		output += "coords: { ";
			output += "latitude: " + data.coords.latitude + ", ";
			output += "longitude: " + data.coords.longitude + ", ";
			output += "accuracy: " + data.coords.accuracy + ", ";
			output += "altitude: " + data.coords.altitude + ", ";
			output += "altitudeAccuracy: " + data.coords.altitudeAccuracy + ", ";
			output += "heading: " + data.coords.heading + ", ";
			output += "speed: " + data.coords.speed;
		output += " }, ";
		output += "timestamp: " + data.timestamp;
	output += " }";
	if (!isNaN(watchID)) { output = "[watchID=" + watchID + "] " + output; CB_console("watchID=" + watchID); }
	CB_console(data);
	CB_Elements.insertContentById("location_" + dataType, output);
}


//Shows the error in the desired element:
function showError(error, dataType, watchID)
{
	CB_console("Error: ");
	var output = error;
	if (!isNaN(watchID)) { output = "[watchID=" + watchID + "] " + error; CB_console("watchID=" + watchID); }
	CB_console(output);
	CB_Elements.insertContentById("location_" + dataType, "ERROR: " + output);
	
}