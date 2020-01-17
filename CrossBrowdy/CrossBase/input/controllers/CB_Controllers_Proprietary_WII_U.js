/**
 * @file Nintendo Wii U gamepad and remotes (Wiimotes) management. Contains the {@link CB_Controllers_Proprietary.WII_U} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */

/**
 * Static class to manage the Nintendo Wii U gamepad and remotes. It will return itself if it is tried to be instantiated. NOTE: This class is still under development.
 * @namespace CB_Controllers_Proprietary.WII_U
 * @todo Function or option that returns an array with the pressed buttons (LEFT: true, L: true, R: false, etc.). Use the bitmasks of CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS and CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.
 */
//* Source: http://wiiubrew.org/wiki/Internet_Browser and https://www.nintendo.com/wiiu/built-in-software/browser-specs/extended-functionality/
if (typeof(CB_Controllers_Proprietary) === "undefined") { var CB_Controllers_Proprietary = {}; }
CB_Controllers_Proprietary.WII_U = function() { return CB_Controllers_Proprietary.WII_U; };
{
	CB_Controllers_Proprietary.WII_U.initialized = false; //It will tells whether the object has been initialized or not.
	
	/**
	 * Keeps the "wiiu" object (if any).
	 *	@var
	 *  @readonly
	 *  @type {Object}
	 *  @default
	 */
	CB_Controllers_Proprietary.WII_U.wiiuObject = null;

	/**
	 * Keeps the last return value of the {@link CB_Controllers_Proprietary.WII_U.getGamePadStatus} function (if any). The value should be the last status object returned.
	 *	@var
	 *  @readonly
	 *  @type {Object}
	 *  @default
	 */
	CB_Controllers_Proprietary.WII_U.gamepadLastStatus = null; //Last read status for the gamepad.
	

	/**
	 * Keeps an array with numeric indexes (should be from 0 to 7 maximum) that belong to each remote number and whose values contain the last return value of the {@link CB_Controllers_Proprietary.WII_U.getRemoteStatus} function (if any). Each value should be the last status object returned.
	 *	@var
	 *  @readonly
	 *  @type {array}
	 *  @default
	 */
	CB_Controllers_Proprietary.WII_U.remoteLastStatus = []; //Last read status for the remote.
	
	/**
	 * Object which keeps the values for the Nintendo Wii U gamepad's buttons (bitmasks).
	 *  @memberof CB_Controllers_Proprietary.WII_U
	 *  @name GAMEPAD_BUTTONS
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} LEFT_STICK_LEFT - LEFT on the LEFT STICK. Default action: Scroll/Pan.
	 *  @property {number} LEFT_STICK_RIGHT - RIGHT on the LEFT STICK. Default action: Scroll/Pan.
	 *  @property {number} LEFT_STICK_UP - UP on the LEFT STICK. Default action: Scroll/Pan.
	 *  @property {number} LEFT_STICK_DOWN - DOWN on the LEFT STICK. Default action: Scroll/Pan.
	 *  @property {number} LEFT_STICK_CLICK - CLICK on the LEFT STICK. Default action: Hide/show bottom toolbar.
	 *  @property {number} RIGHT_STICK_LEFT - LEFT on the RIGHT STICK. Default action: Zoom.
	 *  @property {number} RIGHT_STICK_RIGHT - RIGHT on the RIGHT STICK. Default action: Zoom.
	 *  @property {number} RIGHT_STICK_UP - UP on the RIGHT STICK. Default action: Zoom.
	 *  @property {number} RIGHT_STICK_DOWN - DOWN on the RIGHT STICK. Default action: Zoom.
	 *  @property {number} RIGHT_STICK_CLICK - CLICK on the RIGHT STICK. Default actionn: Toggle zoom in/out on center of screen.
	 *  @property {number} TV - "TV" button.
	 *  @property {number} A - "A" button. Send the "Enter" key (keyCode 13).
	 *  @property {number} B - "B" button. Default action: Back to previous page (hold B: Close current tab).
	 *  @property {number} X - "X" button. Default action: Toggle curtain mode.
	 *  @property {number} Y - "Y" button. Default action: View bookmarks.
	 *  @property {number} LEFT - LEFT button on the control pad. Default action: Select links / form fields.
	 *  @property {number} RIGHT - RIGHT button on the control pad. Default action: Select links / form fields.
	 *  @property {number} UP - UP button on the control pad. Default action: Select links / form fields.
	 *  @property {number} DOWN - DOWN button on the control pad. Default action: Select links / form fields.
	 *  @property {number} ZL - "ZL" button. Default action: Switch to previous tab (hold ZL+ZR: Tilt scrolling).
	 *  @property {number} ZR - "ZR" button. Default action: Switch to next tab (hold ZL+ZR: Tilt scrolling).
	 *  @property {number} L - "L" button. Default action: Back to previous page.
	 *  @property {number} R - "R" button. Default action: Forward to next page.
	 *  @property {number} START - "START" button.
	 *  @property {number} PLUS - Alias for {@link CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.START}.
	 *  @property {number} SELECT - "SELECT" button.
	 *  @property {number} MINUS - Alias for {@link CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.SELECT}.
	 *  @property {number} HOME - HOME button. Default action: Quit browser.
	 */
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS = {};
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.LEFT_STICK_LEFT = 0x40000000; //1073741824. Default action: Scroll/Pan.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.LEFT_STICK_RIGHT = 0x20000000; //536870912. Default action: Scroll/Pan.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.LEFT_STICK_UP = 0x10000000; //268435456. Default action: Scroll/Pan.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.LEFT_STICK_DOWN = 0x08000000; //134217728. Default action: Scroll/Pan.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.LEFT_STICK_CLICK = 0x00040000; //262144. Default action: Hide/show bottom toolbar.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.RIGHT_STICK_LEFT = 0x04000000; //67108864. Default action: Zoom.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.RIGHT_STICK_RIGHT = 0x02000000; //33554432. Default action: Zoom.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.RIGHT_STICK_UP = 0x01000000; //16777216. Default action: Zoom.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.RIGHT_STICK_DOWN = 0x00800000; //8388608. Default action: Zoom.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.RIGHT_STICK_CLICK = 0x00020000; //131072. Default actionn: Toggle zoom in/out on center of screen.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.TV = 0x00010000; //65536.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.A = 0x00008000; //32768. Default action: Send the "Enter" key (keyCode 13).
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.B = 0x00004000; //16384. Default action: Back to previous page (hold B: Close current tab).
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.X = 0x00002000; //8192. Default action: Toggle curtain mode.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.Y = 0x00001000; //4096. Default action: View bookmarks.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.LEFT = 0x00000800; //2048. Default action: Select links / form fields.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.RIGHT = 0x00000400; //1024. Default action: Select links / form fields.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.UP = 0x00000200; //512. Default action: Select links / form fields.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.DOWN = 0x00000100; //256. Default action: Select links / form fields.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.ZL = 0x00000080; //128. Default action: Switch to previous tab (hold ZL+ZR: Tilt scrolling).
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.ZR = 0x00000040; //64. Default action: Switch to next tab (hold ZL+ZR: Tilt scrolling).
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.L = 0x00000020; //32. Default action: Back to previous page.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.R = 0x00000010; //16. Default action: Forward to next page.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.START = CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.PLUS = 0x00000008; //8.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.SELECT = CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.MINUS = 0x00000004; //4.
	CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS.HOME = 0x00000002; //2. Default action: Quit browser.


	/**
	 * Object which keeps the values for the Nintendo Wii U remote's buttons (bitmasks).
	 *  @memberof CB_Controllers_Proprietary.WII_U
	 *  @name REMOTE_BUTTONS
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} UP - UP button.
	 *  @property {number} DOWN - DOWN button.
	 *  @property {number} LEFT - LEFT button.
	 *  @property {number} RIGHT - RIGHT button.
	 *  @property {number} A - "A" button.
	 *  @property {number} B - "B" button.
	 *  @property {number} ONE - "1" button.
	 *  @property {number} _1 - Alias for {@link CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.ONE}.
	 *  @property {number} 1 - Alias for {@link CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.ONE}.
	 *  @property {number} TWO - "2" button.
	 *  @property {number} _2 - Alias for {@link CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.TWO}.
	 *  @property {number} 2 - Alias for {@link CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.TWO}.
	 *  @property {number} PLUS - PLUS ("+") button.
	 *  @property {number} MINUS - MINUS ("-") button.
	 *  @property {number} HOME - HOME button.
	 */
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS = {};
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.UP = 0x00000800; //2048.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.DOWN = 0x00000400; //1024.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.LEFT = 0x00000100; //256.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.RIGHT = 0x00000200; //512.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.A = 0x00000008; //8.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.B = 0x00000004; //4.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.ONE = CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS._1 = CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS["1"] = 0x00000001; //1.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.TWO = CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS._2 = CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS["2"] = 0x00000002; //2.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.PLUS = 0x00001000; //4096.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.MINUS = 0x00000010; //16.
	CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.HOME = 0x00000080; //128.

	
	//Initializes all values:
	CB_Controllers_Proprietary.WII_U.init = function()
	{
		if (CB_Controllers_Proprietary.WII_U.initialized) { return CB_Controllers_Proprietary.WII_U; }
			
		//The object has been initialized:
		CB_Controllers_Proprietary.WII_U.initialized = true;

		//If it does not exist any property, creates it (empty object):
		if (typeof(wiiu) === "undefined" || wiiu === null) { var wiiu = {}; }
		if (typeof(wiiu.gamepad) === "undefined" || wiiu.gamepad === null)
		{
			wiiu.gamepad =
			{
				usingPrototype: true, //This property will not exist in the case it is using the real API.
				
				//General:
				isDataValid: 0, //After a successful update, wiiu.gamepad.isDataValid will be set to 1. If no update has happened yet, or if the GamePad is not connected, it will be set to 0.
				isEnabled: 0, //If the GamePad is connected wiiu.gamepad.isEnabled will be set to 1, else it will be set to 0.
				
				//Touch screen:
				tpTouch: 0, //1 if touch is present.
				tpValidity: 3, //0 = X and Y coordinates valid, 1 = X coordinate invalid, 2 = Y coordinate invalid, 3 = X and Y coordinates invalid.
				tpX: undefined, //X position in screen coordinates.
				tpY: undefined, //Y position in screen coordinates.
				contentX: undefined, //X position in page coordinates.
				contentY: undefined, //Y position in page coordinates.
				
				//Analog sticks (from -1.0 to 1.0):
				lStickX: 0, //GamePad Left Control Stick X deflection.
				lStickY: 0, //GamePad Left Control Stick Y deflection.
				rStickX: 0, //GamePad Right Control Stick X deflection.
				rStickY: 0, //GamePad Right Control Stick Y deflection.
				
				//Buttons:
				hold: 0, //Bitmask (to use with properties of CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS).
				
				//Accelerometer (acceleration forces in Gs. When held level and motionless, the force of gravity will cause these variables to contain the vector (0.0, -1.0, 0.0)):
				accX: undefined, //Force on X (horizontal) axis.
				accY: undefined, //Force on Y (depth) axis.
				accZ: undefined, //Force on Z (vertical) axis.

				//Gyroscope (when the GamePad is motionless these values hover around 0.0):
				gyroX: undefined, //Rotation speed around X (horizontal) axis.
				gyroY: undefined, //Rotation speed around Y (depth) axis.
				gyroZ: undefined, //Rotation speed around Z (vertical) axis.

				//Angle (if properly calibrated, angleX and angleZ should hover around 0.0 when the GamePad is held level, but as the gyroscopes have limited range and resolution the alignment will drift with use):
				//Note: A change of 1.0 in these values represents a complete revolution around the specified axis. Multiple revolutions around the same axis will cause the value to continuously increase or decrease.
				angleX: undefined, //Rotation around X (horizontal) axis.
				angleY: undefined, //Rotation around Y (depth) axis.
				angleZ: undefined, //Rotation around Z (vertical) axis.

				//Orientation:
				//Note: This is a basis of 3 perpendicular unit vectors; each vector has length 1.0 and points along the relevant axis of the GamePad relative to an arbitrary starting orientation in three-dimensional space.
				//X (horizontal) axis:
				dirXx: undefined,
				dirXy: undefined,
				dirXz: undefined,
				//Y (depth) axis:
				dirYx: undefined,
				dirYy: undefined,
				dirYz: undefined,
				//Z (vertical) axis:
				dirZx: undefined,
				dirZy: undefined,
				dirZz: undefined
			};
		}
		if (typeof(wiiu.gamepad.update) !== "function") { wiiu.gamepad.update = function() { return wiiu.gamepad; }; }
		
		if (typeof(wiiu.remote) === "undefined" || wiiu.remote === null)
		{
			var remoteFakeObject =
			{
				usingPrototype: true, //This property will not exist in the case it is using the real API.
						
				//General:
				isDataValid: 0, //If the specified Wii Remote returns valid data, wiiu.remote.isDataValid will be set to 1. If no update has happened yet, or if the selected Wii Remote is not connected, it will be set to 0.
				
				//Buttons:
				held: 0, //Bitmask (to use with properties of CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS).
				
				//Accelerometer (acceleration forces in Gs. When held level and motionless, the force of gravity will cause these variables to contain the vector (0.0, -1.0, 0.0)):
				accX: undefined, //Force on X (horizontal) axis
				accY: undefined, //Force on Y (depth) axis
				accZ: undefined, //Force on Z (vertical) axis 
				
				//Pointer (track the Wii Remote's cursor on the screen):
				setCursorViewable: function(n, enable) { return null; }, //Enable or disable the display of a Wii Remote's cursor.
				dpdX: undefined, //X position in screen coordinates
				dpdY: undefined, //Y position in screen coordinates
				dpdDistance: undefined, //Distance between Wii Remote and Sensor Bar
				contentX: undefined, //X position in page coordinates
				contentY: undefined, //Y position in page coordinates
				isCursorViewable: 0, //1 if cursor display is enabled
				dpdValidity: 3, //0 = X and Y coordinates valid, 1 = X coordinate invalid, 2 = Y coordinate invalid, 3 = X and Y coordinates invalid.
				
				//Motion Plus:
				//Note: Basis of 3 perpendicular unit vectors; Each vector has length 1.0 and points along the relevant axis of the GamePad relative to an arbitrary starting orientation in three-dimensional space.
				//X (horizontal) axis
				mplsDirXx: undefined,
				mplsDirXy: undefined,
				mplsDirXz: undefined,
				//Y (depth) axis
				mplsDirYx: undefined,
				mplsDirYy: undefined,
				mplsDirYz: undefined,
				//Z (vertical) axis
				mplsDirZx: undefined,
				mplsDirZy: undefined,
				mplsDirZz: undefined,
				//The following variables are also available to track the motion of the Wii Remote:
				mplsAngX: undefined, //Rotation around X (horizontal) axis.
				mplsAngY: undefined, //Rotation around Y (depth) axis.
				mplsAngZ: undefined, //Rotation around Z (vertical) axis.
				mplsVelX: undefined, //Movement speed along X (horizontal) axis.
				mplsVelY: undefined, //Movement speed along Y (depth) axis.
				mplsVelZ: undefined, //Movement speed along Z (vertical) axis.
				mplsRollX: undefined, //TODO: ? (Source: http://wiiubrew.org/wiki/Internet_Browser).
				mplsRollY: undefined //TODO: ?.
			};
			
			wiiu.remote =
			{
				_devices: [remoteFakeObject]
			};
		}
		if (typeof(wiiu.remote.update) !== "function") { wiiu.remote.update = function(n) { return typeof(wiiu.remote._devices[n]) === "undefined" ? remoteFakeObject : wiiu.remote._devices[n]; }; }
		
		//Stores the object (maybe fake one):
		CB_Controllers_Proprietary.WII_U.wiiuObject = wiiu;

		//Gets the status for the first time:
		CB_Controllers_Proprietary.WII_U.getGamePadStatus();
		
		return CB_Controllers_Proprietary.WII_U;
	}
	
	
	/**
	 * Normalizes the given gamepad status object, adding missing properties.
	 *  @function
	 *  @param {object} gamepadStatusObject - The gamepad status object that we want to normalize.
	 *  @returns {Object} Returns the given gamepad status object but normalized, adding missing properties.
	 */
	 CB_Controllers_Proprietary.WII_U.normalizeGamepad = function(statusObject)
	 {
		if (typeof(statusObject) === "undefined" || statusObject === null) { statusObject = {}; }
		
		//Sets the "id" and "index" properties:
		statusObject.index = 0;
		statusObject.id = "WII_U_GAMEPAD_0";
		
		//Sets its "connected" property:
		statusObject.connected = !!statusObject.isEnabled;
		
		//Updates the "timestamp" property if the data has been updated:
		if (statusObject.isDataValid) { statusObject.timestamp = window.performance.now(); }
		
		//Sets the "buttons" property:
		if (typeof(statusObject.buttons) === "undefined" || statusObject.buttons === null) { statusObject.buttons = {}; }
		for (var buttonName in CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS)
		{
			if (typeof(statusObject.buttons[buttonName]) === "undefined" || statusObject.buttons[buttonName] === null) { statusObject.buttons[buttonName] = {}; }
			statusObject.buttons[buttonName].pressed = statusObject.buttons[buttonName].touched = !!(statusObject.hold & CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS[buttonName]); //statusObject.hold is a bitmask with the buttons pressed.
			statusObject.buttons[buttonName].value = statusObject.buttons[buttonName].pressed ? 1 : 0;
		}
		
		//Sets the "axes" property:
		if (typeof(statusObject.axes) === "undefined" || statusObject.axes === null) { statusObject.axes = [0, 0, 0, 0, 0, 0]; }
		
		//Axes for LEFT, RIGHT, UP and DOWN:
		statusObject.axes[0] = 0;
		if (statusObject.buttons.LEFT.pressed) { statusObject.axes[0] += -1; }
		if (statusObject.buttons.RIGHT.pressed) { statusObject.axes[0] += 1; }
		statusObject.axes[1] = 0;
		if (statusObject.buttons.UP.pressed) { statusObject.axes[1] += -1; }
		if (statusObject.buttons.DOWN.pressed) { statusObject.axes[1] += 1; }

		//Axes for LEFT, RIGHT, UP and DOWN of the LEFT STICK and their value:
		statusObject.axes[2] = statusObject.lStickX || 0;
		statusObject.buttons.LEFT_STICK_LEFT.value = 0;
		statusObject.buttons.LEFT_STICK_RIGHT.value = 0;
		if (statusObject.axes[2] < 0) { statusObject.buttons.LEFT_STICK_LEFT.value = statusObject.axes[2] * -1; }
		else if (statusObject.axes[2] > 0) { statusObject.buttons.LEFT_STICK_RIGHT.value = statusObject.axes[2]; }
		statusObject.axes[3] = statusObject.lStickY || 0;
		statusObject.buttons.LEFT_STICK_UP.value = 0;
		statusObject.buttons.LEFT_STICK_DOWN.value = 0;
		if (statusObject.axes[3] < 0) { statusObject.buttons.LEFT_STICK_UP.value = statusObject.axes[3] * -1; }
		else if (statusObject.axes[3] > 0) { statusObject.buttons.LEFT_STICK_DOWN.value = statusObject.axes[3]; }

		
		
		//Axes for LEFT, RIGHT, UP and DOWN of the RIGHT STICK and their value:
		statusObject.axes[4] = statusObject.rStickX || 0;
		statusObject.buttons.RIGHT_STICK_LEFT.value = 0;
		statusObject.buttons.RIGHT_STICK_RIGHT.value = 0;
		if (statusObject.axes[4] < 0) { statusObject.buttons.RIGHT_STICK_LEFT.value = statusObject.axes[4] * -1; }
		else if (statusObject.axes[4] > 0) { statusObject.buttons.RIGHT_STICK_RIGHT.value = statusObject.axes[4]; }

		statusObject.axes[5] = statusObject.rStickY || 0;
		statusObject.buttons.RIGHT_STICK_UP.value = 0;
		statusObject.buttons.RIGHT_STICK_DOWN.value = 0;
		if (statusObject.axes[5] < 0) { statusObject.buttons.RIGHT_STICK_UP.value = statusObject.axes[5] * -1; }
		else if (statusObject.axes[5] > 0) { statusObject.buttons.RIGHT_STICK_DOWN.value = statusObject.axes[5]; }

		
		//Updates the rest of the properties:
		statusObject.mapping = "";
		statusObject.vibrationActuator = null;
	
		return statusObject;
	 }

	 
	/**
	 * Normalizes the given remote status object, adding missing properties.
	 *  @function
	 *  @param {object} gamepadStatusObject - The remote status object that we want to normalize.
	 *  @param {integer} [n=0] - Number of the remote whose status we want to get, from 0 to 7 (both numbers included, 8 in total). It will be used as its identifier.
	 *  @returns {Object} Returns the given remote status object but normalized, adding missing properties.
	 */
	 CB_Controllers_Proprietary.WII_U.normalizeRemote = function(statusObject, n)
	 {
		if (typeof(statusObject) === "undefined" || statusObject === null) { statusObject = {}; }
	
		//Sets the "id" and "index" properties:
		statusObject.index = n ? n : 0;
		statusObject.id = "WII_U_REMOTE_" + statusObject.index;
		
		//Sets its "connected" property:
		if (!statusObject.connected) { statusObject.connected = !!statusObject.isDataValid; }
		
		//Updates the "timestamp" property if the data has been updated:
		if (statusObject.isDataValid) { statusObject.timestamp = window.performance.now(); }
		
		//Sets the "buttons" property:
		if (typeof(statusObject.buttons) === "undefined" || statusObject.buttons === null) { statusObject.buttons = {}; }
		for (var buttonName in CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS)
		{
			if (typeof(statusObject.buttons[buttonName]) === "undefined" || statusObject.buttons[buttonName] === null) { statusObject.buttons[buttonName] = {}; }
			statusObject.buttons[buttonName].pressed = statusObject.buttons[buttonName].touched = !!(statusObject.held & CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS[buttonName]); //statusObject.held is a bitmask with the buttons pressed.
			statusObject.buttons[buttonName].value = statusObject.buttons[buttonName].pressed ? 1 : 0;
		}
		
		//Sets the "axes" property:
		if (typeof(statusObject.axes) === "undefined" || statusObject.axes === null) { statusObject.axes = [0, 0]; }
		
		//Axes for LEFT, RIGHT, UP and DOWN:
		statusObject.axes[0] = 0;
		if (statusObject.buttons.LEFT.pressed) { statusObject.axes[0] += -1; }
		if (statusObject.buttons.RIGHT.pressed) { statusObject.axes[0] += 1; }
		statusObject.axes[1] = 0;
		if (statusObject.buttons.UP.pressed) { statusObject.axes[1] += -1; }
		if (statusObject.buttons.DOWN.pressed) { statusObject.axes[1] += 1; }
		
		//Updates the rest of the properties:
		statusObject.mapping = "";
		statusObject.vibrationActuator = null;
		
		return statusObject;
	 }

	
	/**
	 * Returns an object with the current status of each button of the gamepad. Already calls {@link CB_Controllers_Proprietary.WII_U.normalizeGamepad} automatically.
	 *  @function
	 *  @returns {Object} Returns an object with the current status of each button of the gamepad.
	 */
	CB_Controllers_Proprietary.WII_U.getGamePadStatus = function()
	{
		return CB_Controllers_Proprietary.WII_U.gamepadLastStatus = CB_Controllers_Proprietary.WII_U.normalizeGamepad(CB_Controllers_Proprietary.WII_U.wiiuObject.gamepad.update());
	}
	

	/**
	 * Returns an object with the current status of each button of the desired remote. Already calls {@link CB_Controllers_Proprietary.WII_U.normalizeRemote} automatically.
	 *  @function
	 *  @param {integer} [n=0] - Number of the remote whose status we want to get, from 0 to 7 (both numbers included, 8 in total).
	 *  @returns {Object} Returns an object with the current status of each button of the desired remote.
	 *  @todo Check documentation to see whether the first index should be 0 or 1 and maximum 7 or 8.
	 */
	CB_Controllers_Proprietary.WII_U.getRemoteStatus = function(n)
	{
		if (typeof(n) === "undefined" || n === null || !isNaN(n) || n < 0) { n = 0; } //TODO: check documentation to see whether the minimum should be 0 or 1 and maximum 7 or 8.
		else if (n > 8) { n = 7; }
		return CB_Controllers_Proprietary.WII_U.remoteLastStatus[n] = CB_Controllers_Proprietary.WII_U.normalizeRemote(CB_Controllers_Proprietary.WII_U.wiiuObject.remote.update(n), n);
	}
	

	/**
	 * Returns an object with the gamepad and all remotes simulating the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API}. Uses the {@link CB_Controllers_Proprietary.WII_U.getRemoteStatus} and {@link CB_Controllers_Proprietary.WII_U.getRemoteStatus} internally so the objects will be normalized already.
	 *  @function
	 *  @returns {Object} Returns an object with two properties: "gamepads" and "remotes". Each of those two properties will have an object as value whose names will be the index of the device and the value an object with the status of that device. In the case of the gamepad (which is unique), there will only be one index ("0", zero). In the case of the remotes, it will contain the status objects of all the remotes. The number of remotes is 8 (index from "0" to "7"). Simulating the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API}. Those status objects which are not using the real API will have a property called "usingPrototype" set to true.
	 *  @todo Check the documentation to find out the maximum number of remotes allowed and find out whether the first index should be 0 or 1 and last one 7 or 8.
	 */
	CB_Controllers_Proprietary.WII_U.getGamePads = function()
	{
		//TODO: normalize all to simulate GamePad API.
		return {
			"gamepads" : { "0" : CB_Controllers_Proprietary.WII_U.getGamePadStatus() },
			"remotes" :
			{
				//TODO: check the documentation to find out the maximum number of remotes allowed.
				"0" : CB_Controllers_Proprietary.WII_U.getRemoteStatus(0),
				"1" : CB_Controllers_Proprietary.WII_U.getRemoteStatus(1),
				"2" : CB_Controllers_Proprietary.WII_U.getRemoteStatus(2),
				"3" : CB_Controllers_Proprietary.WII_U.getRemoteStatus(3),
				"4" : CB_Controllers_Proprietary.WII_U.getRemoteStatus(4),
				"5" : CB_Controllers_Proprietary.WII_U.getRemoteStatus(5),
				"6" : CB_Controllers_Proprietary.WII_U.getRemoteStatus(6),
				"7" : CB_Controllers_Proprietary.WII_U.getRemoteStatus(7)
			}
		};
	}

	
	//TODO: function or option that returns an array with the pressed buttons (LEFT: true, L: true, R: false, etc.). Use the bitmasks of CB_Controllers_Proprietary.WII_U.GAMEPAD_BUTTONS and CB_Controllers_Proprietary.WII_U.REMOTE_BUTTONS.

}