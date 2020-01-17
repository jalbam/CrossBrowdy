/**
 * @file Nintendo Wii remotes (Wiimotes) management. Contains the {@link CB_Controllers_Proprietary.WII} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */

 /**
 * Static class to manage proprietary controller APIs.
 * @namespace CB_Controllers_Proprietary
*/ 

/**
 * Static class to manage the Nintendo Wii remotes (Wiimotes). It will return itself if it is tried to be instantiated. It uses [wii-js]{@link https://github.com/ryanmcgrath/wii-js}. NOTE: This class is still under development.
 * @namespace CB_Controllers_Proprietary.WII
 * @todo Find a way to know how to check when a button is released.
 * @todo Update values of CB_Controllers_Proprietary.WII._wiimotes[x].UP, etc.
 * @todo Do not forget x and y properties (?).
 */
//* Source: https://github.com/ryanmcgrath/wii-js
if (typeof(CB_Controllers_Proprietary) === "undefined") { var CB_Controllers_Proprietary = {}; }
CB_Controllers_Proprietary.WII = function() { return CB_Controllers_Proprietary.WII; };
{
	CB_Controllers_Proprietary.WII.initialized = false; //It will tells whether the object has been initialized or not.

	//Generic template object that represents the status of a Wiimote:
	CB_Controllers_Proprietary.WII._wiimoteInfoTemplate = //For buttons: true = pressed, false = released, undefined = unknown.
	{
		usingPrototype: true, //This property will not exist in the case it is using the real API.
		
		connected: false,
		
		realObject: undefined,
		id: undefined,
		
		index: undefined,

		buttons:
		{
			UP: { pressed: false, touched: false, value: 0 },
			DOWN: { pressed: false, touched: false, value: 0 },
			LEFT: { pressed: false, touched: false, value: 0 },
			RIGHT: { pressed: false, touched: false, value: 0 },
			A: { pressed: false, touched: false, value: 0 },
			B: { pressed: undefined, touched: false, value: 0 },
			C: { pressed: undefined, touched: false, value: 0 },
			Z: { pressed: undefined, touched: false, value: 0 },
			_1: { pressed: false, touched: false, value: 0 },
			_2: { pressed: false, touched: false, value: 0 },
			PLUS: { pressed: false, touched: false, value: 0 },
			MINUS: { pressed: false, touched: false, value: 0 }
		},
		
		axes: [0, 0],

		horizontal: true,
		roll: undefined,
		distance: undefined,
		x: undefined,
		y: undefined,
		
		mapping: "",
		
		timestamp: window.performance.now(),
		
		vibrationActuator: null
		
		//... maybe more properties will be added.
	};
	CB_Controllers_Proprietary.WII._wiimoteInfoTemplate.buttons["ONE"] = CB_Controllers_Proprietary.WII._wiimoteInfoTemplate.buttons["1"] = CB_Controllers_Proprietary.WII._wiimoteInfoTemplate.buttons._1;
	CB_Controllers_Proprietary.WII._wiimoteInfoTemplate.buttons["TWO"] = CB_Controllers_Proprietary.WII._wiimoteInfoTemplate.buttons["2"] = CB_Controllers_Proprietary.WII._wiimoteInfoTemplate.buttons._2;
	
	//It will store the objects that represent the possible four Wiimotes (if any):
	CB_Controllers_Proprietary.WII._wiimotes = //NOTE: Using object instead of array to respect the CB_Controllers standard.
	{
		"0" : CB_Controllers_Proprietary.WII._wiimoteInfoTemplate,
		"1" : CB_Controllers_Proprietary.WII._wiimoteInfoTemplate,
		"2" : CB_Controllers_Proprietary.WII._wiimoteInfoTemplate,
		"3" : CB_Controllers_Proprietary.WII._wiimoteInfoTemplate
	}; 
	CB_Controllers_Proprietary.WII._wiimotes["0"].index = 0;
	CB_Controllers_Proprietary.WII._wiimotes["1"].index = 1;
	CB_Controllers_Proprietary.WII._wiimotes["2"].index = 2;
	CB_Controllers_Proprietary.WII._wiimotes["3"].index = 3;
	CB_Controllers_Proprietary.WII._wiimotes["0"].id = "WII_REMOTE_0";
	CB_Controllers_Proprietary.WII._wiimotes["1"].id = "WII_REMOTE_1";
	CB_Controllers_Proprietary.WII._wiimotes["2"].id = "WII_REMOTE_2";
	CB_Controllers_Proprietary.WII._wiimotes["3"].id = "WII_REMOTE_3";
	
	
	//Initializes all values:
	CB_Controllers_Proprietary.WII.init = function()
	{
		if (CB_Controllers_Proprietary.WII.initialized) { return CB_Controllers_Proprietary.WII; }
			
		//The object has been initialized:
		CB_Controllers_Proprietary.WII.initialized = true;
		
		if (typeof(Wii) !== "undefined" && Wii.Remote)
		{
			//Sets the events that work for all controllers:
			//TODO: find a way to know how to check when a button is released.
			//TODO: update values of CB_Controllers_Proprietary.WII._wiimotes[x].UP, etc.
			for (var x = 0; x < 4; x++)
			{
				//NOTE: orientation scheme can be changed setting CB_Controllers_Proprietary.WII._wiimotes[index] to false.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject = new Wii.Remote(x + 1, {horizontal: true});

				
				//TODO: Update "timestamp" property.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_up", function() {  }); //"UP" pressed.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_down", function() {  }); //"DOWN" pressed.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_left", function() {  }); //"LEFT" pressed.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_right", function() {  }); //"RIGHT" pressed.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_a", function() {  }); //"A" pressed.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_1", function() { /* Remember ._1 and ["1"] */ }); //"1" pressed. Note: On controller 1, this triggers a menu (read https://github.com/ryanmcgrath/wii-js).
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_2", function() { /* Remember ._2 and ["2"] */ }); //"2" pressed.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_plus", function() {  }); //"PLUS" ("+") pressed.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_minus", function() {  }); //"MINUS" ("-") pressed.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("roll_change", function() {  }); //The roll of the controller (balance) changed. You can get the current roll in radians with "this.roll"; positive is upright, negative is the other.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("distance_change", function() {  }); //The distance of the wiimote (in meters) from the TV/sensor bar has changed. This event isn't totally reliable, but should work for most cases.
				
				//Events for extra controllers that do not work on the primary controller:
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_b", function() {  }); //"B" pressed.
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_c", function() {  }); //"C" pressed (on the Nunchuk).
				CB_Controllers_Proprietary.WII._wiimotes[x].realObject.when("pressed_z", function() {  }); //"Z" pressed (on the Nunchuk).

				//TODO: do not forget x and y properties (?).
			}
			
			//Starts the main listener:
			Wii.listen();
		}

		return CB_Controllers_Proprietary.WII;
	}
	

	/**
	 * Returns an object with all gamepads simulating the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API}.
	 *  @function
	 *  @returns {Object} Returns an object with the "remotes" property which contains another object whose properties are the index of each device and the value an object with the status of that device. The number of remotes is 4 (index from "0" to "3"). Simulating the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API}. Those status objects which are not using the real API will have a property called "usingPrototype" set to true.
	 */
	CB_Controllers_Proprietary.WII.getGamePads = function()
	{
		//TODO: normalize all to simulate GamePad API.
		return { "remotes" : CB_Controllers_Proprietary.WII._wiimotes };
	}

}