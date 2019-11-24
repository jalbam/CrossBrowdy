/**
 * @file Controllers (gamepads, joysticks, remotes, etc.) management. Contains the {@link CB_Controllers} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */


/**
 * Static class to manage different controllers (gamepads, joysticks, remotes, etc.). It will return itself if it is tried to be instantiated. It uses [gamepad-plus]{@link https://github.com/MozillaReality/gamepad-plus}.
 * @namespace CB_Controllers
 * @todo Find a way to do button mapping (so we could use names as LEFT, RIGHT, etc.) and normalization for most web clients and gamepads (without forgetting proprietary ones as WII U, etc.).
 * @todo Consider using always a numeric index instead of the ID of the gamepad (array instead of object), which could be a string, for CB_Controllers._gamepads (for optimization purposes).
 */
//* Source: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
CB_Controllers = function() { return CB_Controllers; };
{
	CB_Controllers.initialized = false; //It will tells whether the object has been initialized or not.
	CB_Controllers._gamePadHaveEvents = "ongamepadconnected" in window;
	CB_Controllers._gamepads = {}; //Object that keeps the indexes of the current gamepads and the gamepad objects as their values.
	CB_Controllers._eventsHolder = {}; //Keeps the functions to fire for every special event (if any).	
	
	
	//Initializes all values:
	CB_Controllers.init = function()
	{
		if (CB_Controllers.initialized) { return CB_Controllers; }
		
		//Initializes proprietary controllers:
		CB_Controllers_Proprietary["WII_U"].init();
		CB_Controllers_Proprietary["WII"].init();
		
		//The object has been initialized:
		CB_Controllers.initialized = true;

		//TODO: use gamepad-plus to make it compatible with more web clients (and do not forget keyEventsEnabled property).
		
		if (!CB_Controllers._gamePadHaveEvents)
		{
			var gamePadPolling = function() { CB_Controllers._gamePadScanAll(); setTimeout(gamePadPolling, 500); };
			gamePadPolling();
		}
		else
		{
			CB_Events.add(CB_Client.getWindow(), "gamepadconnected", CB_Controllers._gamePadConnectHandler, true, true, false);
			CB_Events.add(CB_Client.getWindow(), "gamepaddisconnected", CB_Controllers._gamePadDisconnectHandler, true, true, false);
		}
		
		return CB_Controllers;
	}
	
	
	//Handler to execute when a gamepad is connected (using GamePad API):
	//* Source: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
	CB_Controllers._gamePadConnectHandler = function(e)
	{
		CB_Controllers._gamePadAdd(e.gamepad);
	}


	//Handler to execute when a gamepad is disconnected (using GamePad API):
	//* Source: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
	CB_Controllers._gamePadDisconnectHandler = function(e)
	{
		CB_Controllers._gamePadRemove(e.gamepad);
	}

	
	//Adds a new gamepad (using GamePad API):
	//* Source: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
	CB_Controllers._gamePadAdd = function(gamepad)
	{
		CB_Controllers._gamepads[gamepad.index] = gamepad;
		
		//See https://github.com/luser/gamepadtest/blob/master/index.html
		//requestAnimationFrame(CB_Controllers._gamePadUpdateAll);
		CB_Controllers._gamePadUpdateAll();
		
		//If there is any, executes the desired event:
		if (typeof(CB_Controllers._eventsHolder["onConnect"]) === "function") { CB_Controllers._eventsHolder["onConnect"](gamepad, CB_Controllers._gamepads); }
	}


	//Removes a gamepad (using GamePad API):
	//* Source: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
	CB_Controllers._gamePadRemove = function(gamepad)
	{
		//CB_Controllers._gamepads[gamepad.index] = undefined;
		delete CB_Controllers._gamepads[gamepad.index];
		
		//If there is any, executes the desired event:
		if (typeof(CB_Controllers._eventsHolder["onDisconnect"]) === "function") { CB_Controllers._eventsHolder["onDisconnect"](gamepad, CB_Controllers._gamepads); }
	}


	//Updates the status of all gamepads, if any (using GamePad API):
	//* Source: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
	CB_Controllers._gamePadUpdateAllTimeout = null;
	CB_Controllers._gamePadUpdateAll = function()
	{
		//TODO: normalize, when possible, values for different web clients and gamepads.
		
		clearTimeout(CB_Controllers._gamePadUpdateAllTimeout);
		
		if (!CB_Controllers._gamePadHaveEvents) { CB_Controllers._gamePadScanAll(); }
		
		var i = 0;
		
		for (var j in CB_Controllers._gamepads)
		{
			var controller = CB_Controllers._gamepads[j];

			//for (i = 0; i < controller.buttons.length; i++)
			for (i in controller.buttons)
			{
				if (typeof(controller.buttons[i]) !== "object" || controller.buttons[i] === null)
				{
					controller.buttons[i] =
					{
						value: controller.buttons[i],
						pressed: controller.buttons[i] == 1.0
					};
				}
			}

			/*
			for (i = 0; i < controller.axes.length; i++)
			{
				var a = axes[i];
				a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
				a.setAttribute("value", controller.axes[i] + 1);
			}*/
		}

		//requestAnimationFrame(CB_Controllers._gamePadUpdateAll);
		CB_Controllers._gamePadUpdateAllTimeout = setTimeout(CB_Controllers._gamePadUpdateAll, 1);
	}


	//Scans all gamepads, if any (using GamePad API):
	//* Source: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
	CB_Controllers._gamePadScanAll = function()
	{
		var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : (navigator.webkitGamepads ? navigator.webkitGamepads : []));
		
		//Looks for new connected ones:
		for (var i = 0; i < gamepads.length; i++)
		{
			if (gamepads[i])
			{
				//if (gamepads[i].index in CB_Controllers._gamepads) { CB_Controllers._gamepads[gamepads[i].index] = gamepads[i]; }
				if (typeof(CB_Controllers._gamepads[gamepads[i].index]) !== "undefined") { CB_Controllers._gamepads[gamepads[i].index] = gamepads[i]; }
				else { CB_Controllers._gamePadAdd(gamepads[i]); }
			}
		}
		
		//Looks for disconnected ones:
		//for (i = 0; i < CB_Controllers._gamepads.length; i++)
		for (i in CB_Controllers._gamepads)
		{
			if (CB_Controllers._gamepads[i])
			{
				if (typeof(gamepads[CB_Controllers._gamepads[i].index]) === "undefined") { CB_Controllers._gamePadRemove(CB_Controllers._gamepads[i]); }
			}
		}
	}

	
	/**
	 * Sets a function to execute when a gamepad is connected (["onGamepadConnected"]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/ongamepadconnected} event is fired) or removes it. More information: [Gamepad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first parameter received for this function will be the gamepad object affected and the second parameter will be an object containing all current gamepads objects (properties will be the index of each gamepad). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *	@todo Make it compatible with proprietary ones (if possible).
	 */
	CB_Controllers.onConnect = function(callbackFunction, keepOldFunction)
	{
		return CB_Controllers._setSpecialEventFunction("onConnect", callbackFunction, keepOldFunction);
	}


	/**
	 * Sets a function to execute when a gamepad is disconnected (["onGamepadDisconnected"]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/ongamepaddisconnected} event is fired) or removes it. More information: [Gamepad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first parameter received for this function will be the gamepad object affected and the second parameter will be an object containing all current gamepads objects (properties will be the index of each gamepad). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *	@todo Make it compatible with proprietary ones (if possible).
	 */
	CB_Controllers.onDisconnect = function(callbackFunction, keepOldFunction)
	{
		return CB_Controllers._setSpecialEventFunction("onDisconnect", callbackFunction, keepOldFunction);
	}
	
	
	//Sets a function to execute when an event happens (a non-existing event on JavaScript):
	CB_Controllers._setSpecialEventFunction = function(eventName, eventFunction, keepOldFunction)
	{
		//If no function has been sent, cancel all previous functions and exits:
		if (typeof(eventFunction) !== "function")
		{
			if (eventFunction === null) { CB_Controllers._eventsHolder[eventName] = null; }
			return;
		}

		//If not set, it keeps old function by default:
		if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; }
		
		//If we don't want to keep the old function:
		if (!keepOldFunction)
		{
			CB_Controllers._eventsHolder[eventName] = eventFunction;
		}
		//...otherwise if we want to keep the old function, we keep it:
		else
		{
			//Stores old function:
			var eventFunctionOld = CB_Controllers._eventsHolder[eventName]; //Stores old function of eventFunctionHolder.
			CB_Controllers._eventsHolder[eventName] =
				function(e)
				{
				   if (typeof(eventFunctionOld) === "function") { eventFunctionOld(e); }
				   eventFunction(e);
				};
		}
	}

	
	
	//Finds and returns a desired property from one or more gamepads:
	CB_Controllers._findProperty = function(findFunction, valueIfNotFound, gamepadId, gamepadIdNumeric, caseSensitive, avoidProprietary, extraData)
	{
		if (typeof(findFunction) !== "function") { findFunction = CB_Controllers._findButtonsDown; }
		if (typeof(valueIfNotFound) === "undefined") { valueIfNotFound = {}; }
		
		if (avoidProprietary !== true && avoidProprietary !== false) { avoidProprietary = CB_Configuration[CB_BASE_NAME].CB_Controllers_avoidProprietary_DEFAULT; }
		
		gamepadId = CB_trim(gamepadId);
		if (gamepadId !== "")
		{
			if (gamepadIdNumeric || !isNaN(gamepadId) && (typeof(gamepadIdNumeric) === "undefined" || gamepadIdNumeric === null))
			{
				gamepadIdNumeric = true;
				gamepadId = parseInt(gamepadId);
			}
		}
		
		var gamepads = CB_Controllers.getGamePads(avoidProprietary);
		
		var properties = valueIfNotFound;
		
		//If desired, just gets the buttons down from the devices compatible with the HTML5 Gamepad API:
		if (avoidProprietary) { properties = findFunction(gamepadId, gamepadIdNumeric, caseSensitive, gamepads, extraData); }
		//...otherwise, also gets from the ones which use a proprietary API:
		else
		{
			//Gets the buttons down from the devices compatible with the HTML5 Gamepad API:

			properties = findFunction(gamepadId, gamepadIdNumeric, caseSensitive, gamepads.standard.gamepads, extraData);

			//Adds also the buttons down from the devices which use a proprietary API:
			var propertiesProprietary;
			for (var proprietarySystem in gamepads)
			{
				if (proprietarySystem === "standard") { continue; } //Just checks proprietary systems.
				for (var devicesType in gamepads[proprietarySystem])
				{
					propertiesProprietary = findFunction(gamepadId, gamepadIdNumeric, caseSensitive, gamepads[proprietarySystem][devicesType], extraData);
					for (var propertyIndex in propertiesProprietary)
					{
						if (!properties[propertyIndex]) { properties[propertyIndex] = propertiesProprietary[propertyIndex]; }
					}
				}
			}
		}
		
		return properties;
	}


	//Returns an array with the axes from a given devices object (sub-objects returned by the CB_Controllers.getGamePads function):
	CB_Controllers._findAxes = function(gamepadId, gamepadIdNumeric, caseSensitive, devicesObject, extraData)
	{
		var axes = [];
		
		//Gets the pressed buttons from the desired gamepad ID (or from all the gamepads if there is no gamepad ID given):
		var axesLoopLength, y;
		for (var x in devicesObject)
		{
			if (devicesObject[x].usingPrototype) { continue; } //Skips non-real status objects.
			if
			(
				gamepadId === ""
				|| gamepadIdNumeric && gamepadId === parseInt(x)
				|| !gamepadIdNumeric && (caseSensitive && CB_trim(devicesObject[x].id) === gamepadId || !caseSensitive && CB_trim(devicesObject[x].id).toLowerCase() === gamepadId.toLowerCase())
			)
			{
				if (CB_isArray(devicesObject[x].axes))
				{
					axesLoopLength = devicesObject[x].axes.length;
					for (y = 0; y < axesLoopLength; y++)
					{
						if (!axes[y]) { axes[y] = devicesObject[x].axes[y]; }
					}
				}
			}
		}

		return axes;
	}
	
	
	/**
	 * Gets an array with information about the status of the axes of a given gamepad (or from all if none is given).
	 *  @function
	 *  @param {integer|string} [gamepadId=""] - If an empty string is given, all gamepads available will be checked. Otherwise, it will only check the gamepad with the given ID (if any). When more than one gamepad is checked, the first axes values found which are not zero (0) will have priority.
	 *  @param {boolean} [gamepadIdNumeric=false|true] - If the "gamepadId" parameter is an empty string, this parameter will be ignored. Otherwise, if the "gamepadId" parameter is not empty and this parameter is set to true, the gamepadId parameter will be converted to integer using "parseInt" internally. By default, this parameter is false unless the given "gamepadId" is numeric.
	 *  @param {boolean} [caseSensitive=false] - Defines whether the "gamepadId" given should match the ID of the gamepad being case sensitive or not. This parameter will only be considered when the "gamepadIdNumeric" parameter is set to false.
	 *  @param {boolean} [avoidProprietary={@link CB_Configuration.CrossBase.CB_Controllers_avoidProprietary_DEFAULT}] - If set to true, proprietary gamepads will not be checked (performance will be faster).
	 *  @returns {array} Returns an array with information about the status of the axes of a given gamepad (or from all if none is given).
	 */
	CB_Controllers.getAxes = function(gamepadId, gamepadIdNumeric, caseSensitive, avoidProprietary)
	{
		return CB_Controllers._findProperty(CB_Controllers._findAxes, [], gamepadId, gamepadIdNumeric, caseSensitive, avoidProprietary);
	}

	
	//Returns an object with the the buttons down from a given devices object (sub-objects returned by the CB_Controllers.getGamePads function):
	CB_Controllers._findAxesDown = function(gamepadId, gamepadIdNumeric, caseSensitive, devicesObject, extraData)
	{
		var axes = [];
		
		if (isNaN(extraData.minimumValue) || extraData.minimumValue === null) { extraData.minimumValue = 0.5; }
		if (isNaN(extraData.maximumValue) || extraData.maximumValue === null) { extraData.maximumValue = extraData.minimumValue <= 0 ? -0.5 : 1; }
		if (extraData.maximumValue < extraData.minimumValue)
		{
			extraData._minimumValueBackup = extraData.minimumValue;
			extraData.minimumValue = extraData.maximumValue;
			extraData.maximumValue = extraData._minimumValueBackup;
		}
		
		//Gets the pressed buttons from the desired gamepad ID (or from all the gamepads if there is no gamepad ID given):
		var axesLoopLength, y;
		for (var x in devicesObject)
		{
			if (devicesObject[x].usingPrototype) { continue; } //Skips non-real status objects.
			if
			(
				gamepadId === ""
				|| gamepadIdNumeric && gamepadId === parseInt(x)
				|| !gamepadIdNumeric && (caseSensitive && CB_trim(devicesObject[x].id) === gamepadId || !caseSensitive && CB_trim(devicesObject[x].id).toLowerCase() === gamepadId.toLowerCase())
			)
			{
				if (CB_isArray(devicesObject[x].axes))
				{
					axesLoopLength = devicesObject[x].axes.length;
					for (y = 0; y < axesLoopLength; y++)
					{
						if (!axes[y] && devicesObject[x].axes[y] !== null && !isNaN(devicesObject[x].axes[y]) && devicesObject[x].axes[y] >= extraData.minimumValue && devicesObject[x].axes[y] <= extraData.maximumValue) { axes[y] = devicesObject[x].axes[y]; }
					}
				}
			}
		}

		return axes;
	}
	
	
	/**
	 * Gets an array with the axes pressed of a given gamepad (or from all if none is given). If more than one gamepad is pressing the same axis, it will return the value of the first one found.
	 *  @function
	 *  @param {integer|string} [gamepadId=""] - If an empty string is given, all gamepads available will be checked. Otherwise, it will only check the gamepad with the given ID (if any).
	 *  @param {float} [minimumValue=0.5] - The minimum value (included) that the checked axis or axes must have to consider them to be pressed.
	 *  @param {float} [maximumValue=1|-0.5] - The maximum value (included) that the checked axis or axes must have to consider them to be pressed. The default value will be -0.5 if the given "minimumValue" is negative or zero (0) or it will be 1 otherwise.
	 *  @param {boolean} [gamepadIdNumeric=false|true] - If the "gamepadId" parameter is an empty string, this parameter will be ignored. Otherwise, if the "gamepadId" parameter is not empty and this parameter is set to true, the gamepadId parameter will be converted to integer using "parseInt" internally. By default, this parameter is false unless the given "gamepadId" is numeric.
	 *  @param {boolean} [caseSensitive=false] - Defines whether the "gamepadId" given should match the ID of the gamepad being case sensitive or not. This parameter will only be considered when the "gamepadIdNumeric" parameter is set to false.
	 *  @param {boolean} [avoidProprietary={@link CB_Configuration.CrossBase.CB_Controllers_avoidProprietary_DEFAULT}] - If set to true, proprietary gamepads will not be checked (performance will be faster).
	 *  @returns {Object} Returns an array with the axes pressed of a given gamepad (or from all if none is given). If more than one gamepad is pressing the same axis, it will return the value of the first one found.
	 */
	CB_Controllers.getAxesDown = function(gamepadId, minimumValue, maximumValue, gamepadIdNumeric, caseSensitive, avoidProprietary)
	{
		return CB_Controllers._findProperty(CB_Controllers._findAxesDown, [], gamepadId, gamepadIdNumeric, caseSensitive, avoidProprietary, { minimumValue: minimumValue, maximumValue: maximumValue });
	}

	
	/**
	 * Returns whether a given axis or axes are being pressed or not (accepts one index or more than one with an array).
	 *  @function
	 *  @param {integer|array} axisNumber - Number with the index of the axis or array of numbers with the indexes of the axes that we want to check.
	 *  @param {integer|string} [gamepadId=""] - If an empty string is given, all gamepads available will be checked. Otherwise, it will only check the gamepad with the given ID (if any).
	 *  @param {float} [minimumValue=0.5] - The minimum value (included) that the checked axis or axes must have to consider them to be pressed.
	 *  @param {float} [maximumValue=1|-0.5] - The maximum value (included) that the checked axis or axes must have to consider them to be pressed. The default value will be -0.5 if the given "minimumValue" is negative or zero (0) or it will be 1 otherwise.
	 *  @param {boolean} [allPressed=false] - If set to true, the function will return true only in the case that all given axes are being pressed. In the case that this parameter is set to true and the "gamepadId" parameter is set to an empty string, it will not have in mind whether the axes are pressed by a unique gamepad or by different ones as long as all axes are pressed.
	 *  @param {boolean} [gamepadIdNumeric=false|true] - If the "gamepadId" parameter is an empty string, this parameter will be ignored. Otherwise, if the "gamepadId" parameter is not empty and this parameter is set to true, the gamepadId parameter will be converted to integer using "parseInt" internally. By default, this parameter is false unless the given "gamepadId" is numeric.
	 *  @param {boolean} [caseSensitive=false] - Defines whether the "gamepadId" given should match the ID of the gamepad being case sensitive or not. This parameter will only be considered when the "gamepadIdNumeric" parameter is set to false.
	 *  @param {boolean} [avoidProprietary={@link CB_Configuration.CrossBase.CB_Controllers_avoidProprietary_DEFAULT}] - If set to true, proprietary gamepads will not be checked (performance will be faster).
	 *  @returns {boolean} If the "allPressed" parameter is false, returns true if the given code or any of the given codes is pressed. If the "allPressed" parameter is set to true, it will return true only in the case that all given axes are being pressed. In the case that the "allPressed" parameter is set to true and the gamepadId parameter is set to an empty string, it will not have in mind whether the axes are pressed by a unique gamepad or by different ones as long as all axes are pressed.
	 *  @todo Make it compatible with proprietary gamepads (if possible).
	 */
	CB_Controllers.isAxisDown = function(axesNumbers, gamepadId, minimumValue, maximumValue, allPressed, gamepadIdNumeric, caseSensitive, avoidProprietary)
	{
		//TODO: make it compatible with proprietary gamepads (if possible).
		//TODO: consider to have in mind the axis.
		var isDown = false;
		
		//If the parameter given is not an array, we force it to be an array:
		if (!CB_isArray(axesNumbers)) { axesNumbers = [axesNumbers]; }

		//Gets the pressed buttons from the desired gamepad ID (or from all the gamepads if there is no gamepad ID given):
		var axesAll = CB_Controllers.getAxesDown(gamepadId, minimumValue, maximumValue, gamepadIdNumeric, caseSensitive, avoidProprietary);

		//Checks whether the buttons given are being pressed or not (checking whether all are pressed, if desired):
		var axesNumbersLength = axesNumbers.length;
		for (var x = 0; x < axesNumbersLength; x++)
		{
			//If the code given is a number, it exists in the axesAll array and it is being pressed:
			if (typeof(axesNumbers[x]) !== "undefined" && axesNumbers[x] !== null && !isNaN(axesNumbers[x]) && typeof(axesAll[axesNumbers[x]]) !== "undefined")
			{
				isDown = true;
				if (!allPressed) { break; } //If the user does not want to know whether all are keys given are pressed, with one is enough so it exits.
			}
			//...otherwise, if the user wanted to know whether all given keys were pressed:
			else if (allPressed)
			{
				//Not all given keys are pressed so it exits:
				isDown = false;
				break;
			}
		}
		
		return isDown;
	}


	//Returns an object with the the buttons down from a given devices object (sub-objects returned by the CB_Controllers.getGamePads function):
	CB_Controllers._findButtons = function(gamepadId, gamepadIdNumeric, caseSensitive, devicesObject, extraData)
	{
		var buttons = {};
		
		//Gets the pressed buttons from the desired gamepad ID (or from all the gamepads if there is no gamepad ID given):
		for (var x in devicesObject)
		{
			if (devicesObject[x].usingPrototype) { continue; } //Skips non-real status objects.
			if
			(
				gamepadId === ""
				|| gamepadIdNumeric && gamepadId === parseInt(x)
				|| !gamepadIdNumeric && (caseSensitive && CB_trim(devicesObject[x].id) === gamepadId || !caseSensitive && CB_trim(devicesObject[x].id).toLowerCase() === gamepadId.toLowerCase())
			)
			{
				for (var buttonCode in devicesObject[x].buttons)
				{
					if (typeof(devicesObject[x].buttons[buttonCode].pressed) === "undefined") { continue; } //Skips properties which do not contain button objects.
					buttons[buttonCode] =
					{
						"pressed" : devicesObject[x].buttons[buttonCode].pressed,
						"touched" : devicesObject[x].buttons[buttonCode].touched,
						"value" : devicesObject[x].buttons[buttonCode].value
					};
				}
			}
		}

		return buttons;
	}
	
	
	/**
	 * Gets an object with all the buttons of a given gamepad (or from all if none is given).
	 *  @function
	 *  @param {integer|string} [gamepadId=""] - If an empty string is given, all gamepads available will be checked. Otherwise, it will only check the gamepad with the given ID (if any).
	 *  @param {boolean} [gamepadIdNumeric=false|true] - If the "gamepadId" parameter is an empty string, this parameter will be ignored. Otherwise, if the "gamepadId" parameter is not empty and this parameter is set to true, the gamepadId parameter will be converted to integer using "parseInt" internally. By default, this parameter is false unless the given "gamepadId" is numeric.
	 *  @param {boolean} [caseSensitive=false] - Defines whether the "gamepadId" given should match the ID of the gamepad being case sensitive or not. This parameter will only be considered when the "gamepadIdNumeric" parameter is set to false.
	 *  @param {boolean} [avoidProprietary={@link CB_Configuration.CrossBase.CB_Controllers_avoidProprietary_DEFAULT}] - If set to true, proprietary gamepads will not be checked (performance will be faster).
	 *  @returns {Object} Returns an object with all the buttons of a given gamepad (or from all if none is given). The indexes will be the button code and the values will be an object with information about the button (with properties such as "pressed", "value", etc.).
	 */
	CB_Controllers.getButtons = function(gamepadId, gamepadIdNumeric, caseSensitive, avoidProprietary)
	{
		return CB_Controllers._findProperty(CB_Controllers._findButtons, {}, gamepadId, gamepadIdNumeric, caseSensitive, avoidProprietary);
	}

	
	
	//Returns an object with the the buttons down from a given devices object (sub-objects returned by the CB_Controllers.getGamePads function):
	CB_Controllers._findButtonsDown = function(gamepadId, gamepadIdNumeric, caseSensitive, devicesObject, extraData)
	{
		var buttonsDown = {};
		
		//Gets the pressed buttons from the desired gamepad ID (or from all the gamepads if there is no gamepad ID given):
		for (var x in devicesObject)
		{
			if (devicesObject[x].usingPrototype) { continue; } //Skips non-real status objects.
			if
			(
				gamepadId === ""
				|| gamepadIdNumeric && gamepadId === parseInt(x)
				|| !gamepadIdNumeric && (caseSensitive && CB_trim(devicesObject[x].id) === gamepadId || !caseSensitive && CB_trim(devicesObject[x].id).toLowerCase() === gamepadId.toLowerCase())
			)
			{
				for (var buttonCode in devicesObject[x].buttons)
				{
					if (devicesObject[x].buttons[buttonCode].pressed)
					{
						buttonsDown[buttonCode] = true;
					}
				}
			}
		}

		return buttonsDown;
	}
	
	
	/**
	 * Gets an object with the buttons pressed of a given gamepad (or from all if none is given).
	 *  @function
	 *  @param {integer|string} [gamepadId=""] - If an empty string is given, all gamepads available will be checked. Otherwise, it will only check the gamepad with the given ID (if any).
	 *  @param {boolean} [gamepadIdNumeric=false|true] - If the "gamepadId" parameter is an empty string, this parameter will be ignored. Otherwise, if the "gamepadId" parameter is not empty and this parameter is set to true, the gamepadId parameter will be converted to integer using "parseInt" internally. By default, this parameter is false unless the given "gamepadId" is numeric.
	 *  @param {boolean} [caseSensitive=false] - Defines whether the "gamepadId" given should match the ID of the gamepad being case sensitive or not. This parameter will only be considered when the "gamepadIdNumeric" parameter is set to false.
	 *  @param {boolean} [avoidProprietary={@link CB_Configuration.CrossBase.CB_Controllers_avoidProprietary_DEFAULT}] - If set to true, proprietary gamepads will not be checked (performance will be faster).
	 *  @returns {Object} Returns an object with the buttons pressed of a given gamepad (or from all if none is given).
	 */
	CB_Controllers.getButtonsDown = function(gamepadId, gamepadIdNumeric, caseSensitive, avoidProprietary)
	{
		return CB_Controllers._findProperty(CB_Controllers._findButtonsDown, {}, gamepadId, gamepadIdNumeric, caseSensitive, avoidProprietary);
	}

	
	/**
	 * Returns whether a given button or buttons are being pressed or not (accepts one key code or more than one with an array).
	 *  @function
	 *  @param {integer|array} buttonCodes - Number with the button code or array of numbers with the button codes that we want to check.
	 *  @param {integer|string} [gamepadId=""] - If an empty string is given, all gamepads available will be checked. Otherwise, it will only check the gamepad with the given ID (if any).
	 *  @param {boolean} [allPressed=false] - If set to true, the function will return true only in the case that all given buttons are being pressed. In the case that this parameter is set to true and the "gamepadId" parameter is set to an empty string, it will not have in mind whether the buttons are pressed by a unique gamepad or by different ones as long as all buttons are pressed.
	 *  @param {boolean} [gamepadIdNumeric=false|true] - If the "gamepadId" parameter is an empty string, this parameter will be ignored. Otherwise, if the "gamepadId" parameter is not empty and this parameter is set to true, the gamepadId parameter will be converted to integer using "parseInt" internally. By default, this parameter is false unless the given "gamepadId" is numeric.
	 *  @param {boolean} [caseSensitive=false] - Defines whether the "gamepadId" given should match the ID of the gamepad being case sensitive or not. This parameter will only be considered when the "gamepadIdNumeric" parameter is set to false.
	 *  @param {boolean} [avoidProprietary={@link CB_Configuration.CrossBase.CB_Controllers_avoidProprietary_DEFAULT}] - If set to true, proprietary gamepads will not be checked (performance will be faster).
	 *  @returns {boolean} If the "allPressed" parameter is false, returns true if the given code or any of the given codes is pressed. If the "allPressed" parameter is set to true, it will return true only in the case that all given buttons are being pressed. In the case that the "allPressed" parameter is set to true and the gamepadId parameter is set to an empty string, it will not have in mind whether the buttons are pressed by a unique gamepad or by different ones as long as all buttons are pressed.
	 *  @todo Make it compatible with proprietary gamepads (if possible).
	 */
	CB_Controllers.isButtonDown = function(buttonCodes, gamepadId, allPressed, gamepadIdNumeric, caseSensitive, avoidProprietary)
	{
		//TODO: make it compatible with proprietary gamepads (if possible).
		//TODO: consider to have in mind the axis.
		var isDown = false;
		
		//If the parameter given is not an array, we force it to be an array:
		if (!CB_isArray(buttonCodes)) { buttonCodes = [buttonCodes]; }

		//Gets the pressed buttons from the desired gamepad ID (or from all the gamepads if there is no gamepad ID given):
		var buttonsDown = CB_Controllers.getButtonsDown(gamepadId, gamepadIdNumeric, caseSensitive, avoidProprietary);
		
		//Checks whether the buttons given are being pressed or not (checking whether all are pressed, if desired):
		var buttonCodesLength = buttonCodes.length;
		for (var x = 0; x < buttonCodesLength; x++)
		{
			//If the code given is a number, it exists in the buttonsDown array and it is being pressed:
			if (typeof(buttonCodes[x]) !== "undefined" && buttonCodes[x] !== null && !isNaN(buttonCodes[x]) && typeof(buttonsDown[buttonCodes[x]]) !== "undefined" && buttonsDown[buttonCodes[x]])
			{
				isDown = true;
				if (!allPressed) { break; } //If the user does not want to know whether all are keys given are pressed, with one is enough so it exits.
			}
			//...otherwise, if the user wanted to know whether all given keys were pressed:
			else if (allPressed)
			{
				//Not all given keys are pressed so it exits:
				isDown = false;
				break;
			}
		}
		
		return isDown;
	}


	/**
	 * Returns an object with the current gamepad objects, if any (using the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API} for non-proprietary gamepads).
	 *  @function
	 *  @param {boolean} [avoidProprietary={@link CB_Configuration.CrossBase.CB_Controllers_avoidProprietary_DEFAULT}] - If set to true, proprietary gamepads which do not use the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API} (as WII, WI U gamepads, etc.) will not be included in the returning object and it will only include the ones detected by the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API}. Otherwise, if set to true, the returning object will contain one property called "standard" which will contain an object with the "gamepads" property with the gamepad objects that use the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API} and possibly different properties (one per each proprietary system) and inside of them an object with the "gamepads" property and maybe also other properties for other kind of devices which will include the status objects of those devices for each proprietary system. For gamepads that support the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API}, the indexes will be the identifier for each gamepad and the value its gamepad object. For proprietary gamepads, it will contain the returning value of the "getGamePads" function of each proprietary API.
	 *  @returns {Object} Returns an object with the current gamepad objects, if any (using the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API} for non-proprietary gamepads).
	 *  @todo The proprietary ones should return better-normalized values to simulate the [GamePad API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API}.
	 */
	CB_Controllers.getGamePads = function(avoidProprietary)
	{
		if (avoidProprietary !== true && avoidProprietary !== false) { avoidProprietary = CB_Configuration[CB_BASE_NAME].CB_Controllers_avoidProprietary_DEFAULT; }
		
		CB_Controllers._gamePadUpdateAll(); //Updates and normalizes all.
		
		if (!avoidProprietary)
		{
			//TODO: the proprietary ones should return normalize values to simulate the GamePad API.
			return {
				standard: { "gamepads" : CB_Controllers._gamepads },
				WII_U : CB_Controllers_Proprietary["WII_U"].getGamePads(),
				WII : CB_Controllers_Proprietary["WII"].getGamePads()
			};
		}
		
		return CB_Controllers._gamepads;
	}
	
	
	//TODO: find a way to do button mapping (so we could use names as LEFT, RIGHT, etc.) and normalization for most web clients and gamepads (without forgetting proprietary ones as WII U, etc.).
}