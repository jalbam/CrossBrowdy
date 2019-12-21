/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Orientation management:
	if (CB_Device.Orientation.isSupported())
	{
		CB_console("The Device Orientation Event (used by the Device Orientation API or compatible ones) is supported.");
		CB_Elements.insertContentById("orientation_supported", "Yes");

		//Checks when the orientation changes:
		var orientationChangedTimes = 0;
		CB_Device.Orientation.onChange
		(
			//Orientation is obtained successfully:
			function(data) //Data will be normalized automatically.
			{
				var output =
					"Times fired: " + (++orientationChangedTimes) + "\n" +
					"Alpha: " + data.alpha + "\n" +
					"Beta: " + data.beta + "\n" +
					"Gamma: " + data.gamma + "\n" +
					"Absolute: " + (data.absolute ? "yes" : "no");
				CB_console(output);
				CB_Elements.insertContentById("orientation_data", CB_nl2br(output));
			}
		);
	}
	else
	{
		CB_console("The Device Orientation Event (used by the Device Orientation API or compatible ones) is not supported.");
		CB_Elements.insertContentById("orientation_supported", "No");
	}
	

	//Checks whether the compass / magnetometer needs calibration:
	if (CB_Device.Orientation.isCompassNeedsCalibrationSupported())
	{
		CB_console("The 'compassNeedsCalibration' feature is supported.");
		CB_Elements.insertContentById("compassneedscalibration_supported", "Yes");
		CB_Device.Orientation.onCompassNeedsCalibration(function() { CB_console("Compass needs calibration!"); CB_Elements.insertContentById("compassneedscalibration", "Yes"); });
	}	
	else
	{
		CB_console("The 'compassNeedsCalibration' feature is not supported.");
		CB_Elements.insertContentById("compassneedscalibration_supported", "No");
	}
	

	//Physical movements management:
	if (CB_Device.Motion.isSupported())
	{
		CB_console("The Device Motion Event (used by the Device Orientation API or compatible ones) is supported.");
		CB_Elements.insertContentById("motion_supported", "Yes");

		//Checks physical movements and their speed:
		var motionChangedTimes = 0;
		CB_Device.Motion.onChange
		(
			//Motion is obtained successfully:
			function(data) //Data will be normalized automatically.
			{
				output =
					"Times fired: " + (++motionChangedTimes) + "\n" +
					"Acceleration in x: "  + data.acceleration.x + "\n" +
					"Acceleration in y: "  + data.acceleration.y + "\n" +
					"Acceleration in z: "  + data.acceleration.z + "\n" +
					"Acceleration in x (with gravity): "  + data.accelerationIncludingGravity.x + "\n" +
					"Acceleration in y (with gravity): "  + data.accelerationIncludingGravity.y + "\n" +
					"Acceleration in z (with gravity): "  + data.accelerationIncludingGravity.z + "\n" +
					"Interval: "  + data.interval + "\n" +
					"Rotation Rate Alpha: "  + data.rotationRate.alpha + "\n" +
					"Rotation Rate Beta: "  + data.rotationRate.beta + "\n" +
					"Rotation Rate Gamma: "  + data.rotationRate.gamma;
				CB_console(output);
				CB_Elements.insertContentById("motion_data", CB_nl2br(output));
			}
		);
	}
	else
	{
		CB_console("The Device Motion Event (used by the Device Orientation API or compatible ones) is not supported.");
		CB_Elements.insertContentById("motion_supported", "No");
	}	
}