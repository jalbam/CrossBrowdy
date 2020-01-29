/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Ambient light sensor management:
	if (CB_Device.AmbientLight.isSupported())
	{
		CB_console("The ambient light detection is supported (through the Ambient Light Sensor API or the Ambient Light Sensor Events ('ondevicelight') or 'onlightlevel' event or compatible ones).");
		CB_Elements.insertContentById("light_sensor", "Yes");

		//Gets the ambient light now and also every time it changes:
		CB_Device.AmbientLight.onChange(function(data) { CB_console("Light detected: " + data.value); CB_Elements.insertContentById("light_level", data.value); }); //Data will be normalized automatically.
	}
	else
	{
		CB_console("The ambient light detection is not supported.");
		CB_Elements.insertContentById("light_sensor", "No");
	}
	
	//Proximity sensor management:
	if (CB_Device.Proximity.isSupported())
	{
		CB_console("The proximity detection is supported (through the Proximity Sensor API or the Proximity Sensor Events as 'ondeviceproximity' or 'onuserproximity' or compatible ones).");
		CB_Elements.insertContentById("proximity_sensor", "Yes");

		//Gets the proximity now and also every time it changes:
		CB_Device.Proximity.onChange(function(data) { CB_console("Proximity detected: " + data.value); CB_Elements.insertContentById("proximity_level", data.value); }); //Data will be normalized automatically.
	}
	else
	{
		CB_console("The proximity detection is not supported.");
		CB_Elements.insertContentById("proximity_sensor", "No");
	}
}