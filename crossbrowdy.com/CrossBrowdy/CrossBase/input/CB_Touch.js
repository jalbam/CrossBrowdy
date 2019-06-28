/**
 * @file Touch events management. Contains the {@link CB_Touch} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */
 

/**
 * Static class to manage the [touch events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Touch_events}. It will return itself if it is tried to be instantiated. It can also use [Pressure.js]{@link https://pressurejs.com/} and [Hammer.js]{@link https://hammerjs.github.io/}.
 * @namespace
 */
var CB_Touch = function() { return CB_Touch; };
{
	CB_Touch._data = null; //Stores the information about the touch points.
	CB_Touch._force = null; //Stores the force of the touch point (just one, using Pressure.js).

	/**
	 * Default value for the force attribute if no one is detected.
	 *	@var
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	CB_Touch.DEFAULT_FORCE = 1; //Default value for the force attribute if no one is detected.

	CB_Touch._hammerJSObject = null; //Stores the Hammer.js object (if any).
	CB_Touch._pressureJSObject = null; //Stores the Pressure.js object (if any).
	
	CB_Touch.initialized = false; //It will tells whether the object has been initialized or not.

	
	//Initializes all values:
	CB_Touch.init = function()
	{
		if (CB_Touch.initialized) { return CB_Touch; }

		//The object has been initialized:
		CB_Touch.initialized = true;
		
		//Gets the touch data constantly:
		CB_Events.add(document, "touchstart", function(e) { CB_Touch._data = CB_Touch.normalizeEvent(e) || null; }, true, true, false);
		CB_Events.add(document, "touchenter", function(e) { CB_Touch._data = CB_Touch.normalizeEvent(e) || null; }, true, true, false);
		CB_Events.add(document, "touchmove", function(e) { CB_Touch._data = CB_Touch.normalizeEvent(e) || null; }, true, true, false);
		CB_Events.add(document, "touchend", function(e) { CB_Touch._force = 0; CB_Touch._data = null; }, true, true, false);
		CB_Events.add(document, "touchleave", function(e) { CB_Touch._force = 0; CB_Touch._data = null; }, true, true, false);
		
		//Gets and stores the Hammer.js object (if any):
		CB_Touch._hammerJSObject = (typeof(Hammer) !== "undefined" && Hammer !== null) ? Hammer : null;
		
		//Gets and stores the Pressure.js object (if any):
		CB_Touch._pressureJSObject = (typeof(Pressure) !== "undefined" && Pressure !== null) ? Pressure : null;
		
		//Gets the touch force (using pressure.js) constantly:
		if (CB_Touch._pressureJSObject !== null && typeof(CB_Touch._pressureJSObject.set) === "function")
		{
			CB_Touch._pressureJSObject.set
			(
				document,
				{
					//start: function(event) { },
					end: function() { CB_Touch._force = 0; },
					//startDeepPress: function(event) { },
					//endDeepPress: function() { },
					change: function(force, event) { CB_Touch._force = typeof(force) !== "undefined" && !isNaN(force) ? force : null; }//,
					//unsupported: function() { }
				}
			);
		}

		return CB_Touch;
	}

	
	//Allows for interpolating a value from one range of values to another:
	//* Source: Pressure.js by Stuart Yamartino and Arduino documentation: https://www.arduino.cc/en/Reference/Map
	CB_Touch._map = function _map(x, in_min, in_max, out_min, out_max) { return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min; };


	/**
	 * Normalizes the given "force" property value across different clients. The new attached methods and properties may include polyfills, etc. This function is called by {@link CB_Touch.normalizePoint} automatically.
	 *  @function
	 *  @param {number} force - Force value to be normalized.
	 *  @returns {Event} Returns the force value normalized.
	 *  @todo Not all web clients are the same, so not all should be normalized.
	 */
	//* Source: Pressure.js by Stuart Yamartino.
	CB_Touch.normalizeForce = function(force)
	{
		//TODO: not all web clients are the same! so not all should normalize.
		if (typeof(force) === "undefined" || force === null || isNaN(force)) { return CB_Touch.DEFAULT_FORCE; }
		force = CB_Touch._map(force, 1, 3, 0, 1);
		force = force > 0.999 ? 1 : force;
		force = Math.abs(force);
		return force;
	}
	
	
	/**
	 * Tries to return the [touch event]{@link https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent} object with some properties normalized (since different clients can use different values), when possible. It also calls the {@link CB_Events.normalize} and {@link CB_Touch.normalizePoints} functions internally. Some properties affected could be [targetTouches]{@link https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches}, [touches]{@link https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches}, [changedTouches]{@link https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches}, etc.
	 *  @function
	 *  @param {Event} e - [Touch event]{@link https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent} object. If not provided, it will use the value of "event", "window.event", "Event" or an empty object ("{}").
	 *  @returns {Event} Returns the [touch event]{@link https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent} object normalized.
	 *  @todo Add more properties and methods to normalize (if needed)
	 */
	CB_Touch.normalizeEvent = function(e)
	{
		e = CB_Events.normalize(e);
		
		//TODO: add more properties and methods to normalize (if needed).
		
		//Normalize the points:
		e.targetTouches = CB_Touch.normalizePoints(e.targetTouches);
		e.touches = CB_Touch.normalizePoints(e.touches);
		e.changedTouches = CB_Touch.normalizePoints(e.changedTouches);
		
		return e;
	}
	
	
	/**
	 * Normalizes a given list of points. Calls {@link CB_Touch.normalizePoint} internally. This function is called by {@link CB_Touch.normalizeEvent} automatically.
	 *  @function
	 *  @param {TouchList|array} points - [TouchList]{@link https://developer.mozilla.org/en-US/docs/Web/API/TouchList} or array with the points ([Touch objects]{@link https://developer.mozilla.org/en-US/docs/Web/API/Touch}) to be normalized.
	 *  @returns {TouchList|array} Returns the given points normalized.
	 */
	CB_Touch.normalizePoints = function(points)
	{
		if (typeof(points) === "undefined" || points === null || typeof(points) === "undefined" || points === null) { return []; }
		for (var x = 0; x < points.length; x++)
		{
			points[x] = CB_Touch.normalizePoint(points[x]);
		}
		return points;
	}
	
	
	/**
	 * Normalizes a given point. Calls {@link CB_Touch.normalizeForce} internally. This function is called by {@link CB_Touch.normalizePoints} automatically.
	 *  @function
	 *  @param {Touch} point - [Touch object]{@link https://developer.mozilla.org/en-US/docs/Web/API/Touch} to be normalized.
	 *  @returns {Touch} Returns the given point normalized.
	 */
	CB_Touch.normalizePoint = function(point)
	{
		if (typeof(point) !== "undefined" && point !== null)
		{
			if (typeof(point.force) === "undefined" || point.force === null || isNaN(point.force))
			{
				if (typeof(point.webkitForce) !== "undefined" && point.webkitForce !== null && !isNaN(point.webkitForce)) { point.force = point.webkitForce; }
				else if (CB_Touch._force !== null) { point.force = CB_Touch._force; } //Uses force detected by Pressure.js.
				else { e.force = CB_Touch.DEFAULT_FORCE; }
			}
			point.force = CB_Touch.normalizeForce(point.force);
		}
		return point;
	}
	
	
	/**
	 * Returns the last [touch event]{@link https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent} object (if any), processed by {@link CB_Touch.normalizeEvent} internally, which was used in the last touch event fired, if that touch event was [touchstart]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event}, [touchenter]{@link https://w3.org/TR/2011/WD-touch-events-20110505/#the-touchenter-event} or [touchmove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event}. The [touchend]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event} and [touchleave]{@link https://w3.org/TR/2011/WD-touch-events-20110505/#the-touchleave-event} events set it to "null".
	 *  @function
	 *  @returns {Event|null} Returns the last [touch event]{@link https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent} affected, if any.
	 */
	CB_Touch.getData = function()
	{
		return CB_Touch._data;
	}
	
	
	/**
	 * Returns the maximum of touch points supported by the device (if possible).
	 *  @function
	 *  @returns {integer|null} Maximum touch points supported by the device (if possible). If it cannot be detected, returns null.
	 */
	CB_Touch.getMaxTouchPoints = function()
	{
		if (window.navigator)
		{
			if (window.navigator.maxTouchPoints) { return window.navigator.maxTouchPoints; }
			else if (window.navigator.msMaxTouchPoints) { return window.navigator.msMaxTouchPoints; }
		}
		return null;
	}
	
	
	/**
	 * Sets a function to execute when the [onTouchStart]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event} event is fired or removes it. More information: [Touch events]{@link https://developer.mozilla.org/en-US/docs/DOM/Touch_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Touch.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Touch.onStart = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Touch._setEvent("touchstart", callbackFunction, keepOldFunction, useCapture, target);
	}
	

	/**
	 * Sets a function to execute when the [onTouchEnd]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event} event is fired or removes it. More information: [Touch events]{@link https://developer.mozilla.org/en-US/docs/DOM/Touch_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Touch.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Touch.onEnd = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Touch._setEvent("touchend", callbackFunction, keepOldFunction, useCapture, target);
	}

	
	/**
	 * Sets a function to execute when the [onTouchCancel]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event} event is fired or removes it. More information: [Touch events]{@link https://developer.mozilla.org/en-US/docs/DOM/Touch_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Touch.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Touch.onCancel = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Touch._setEvent("touchcancel", callbackFunction, keepOldFunction, useCapture, target);
	}
	
	
	/**
	 * Sets a function to execute when the [onTouchEnter]{@link https://w3.org/TR/2011/WD-touch-events-20110505/#the-touchenter-event} event is fired or removes it. More information: [Touch events]{@link https://developer.mozilla.org/en-US/docs/DOM/Touch_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Touch.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Touch.onEnter = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Touch._setEvent("touchenter", callbackFunction, keepOldFunction, useCapture, target);
	}

	
	/**
	 * Sets a function to execute when the [onTouchLeave]{@link https://w3.org/TR/2011/WD-touch-events-20110505/#the-touchleave-event} event is fired or removes it. More information: [Touch events]{@link https://developer.mozilla.org/en-US/docs/DOM/Touch_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Touch.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Touch.onLeave = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Touch._setEvent("touchleave", callbackFunction, keepOldFunction, useCapture, target);
	}

	
	/**
	 * Sets a function to execute when the [onTouchMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event} event is fired or removes it. More information: [Touch events]{@link https://developer.mozilla.org/en-US/docs/DOM/Touch_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Touch.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Touch.onMove = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Touch._setEvent("touchmove", callbackFunction, keepOldFunction, useCapture, target);
	}
	

	//Sets a function to execute when a touch event happens:
	CB_Touch._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture, target)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; } //If not set, it keeps old function by default.
		if (typeof(target) === "undefined" || target === null) { target = document; }
		
		//If a function has been sent:
		if (typeof(eventFunction) === "function")
		{
			//If able, adds the function given to the event:
			CB_Events.add
			(
				target,
				eventName,
				function(e)
				{
					e = CB_Touch.normalizeEvent(e);
					
					//TODO.
					
					if (typeof(eventFunction) === "function") { return eventFunction(e); }
					return true;
				},
				useCapture,
				keepOldFunction,
				true
			);
		}
		//...but if the function given is null, it will cancel the event:
		else if (eventFunction === null)// && eventFunctionHolder !== null)
		{
			CB_Events.removeByName(target, eventName);
		}
	}
	

	/**
	* Returns the [Hammer.js]{@link https://hammerjs.github.io/} object (if any). Useful for managing touch gestures.
	 *  @function
	 *  @returns {Object} Returns the [Hammer.js]{@link https://hammerjs.github.io/} object (if any).
	 */
	CB_Touch.getHammerJSObject = function()
	{
		return CB_Touch._hammerJSObject;
	}

	
	/**
	* Returns the [Pressure.js]{@link https://pressurejs.com/} object (if any). Useful for managing [Force Touch/3D Touch]{@link https://en.wikipedia.org/wiki/Force_Touch} and [Pointer Pressure]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure} features.
	 *  @function
	 *  @returns {Object} Returns the [Pressure.js]{@link https://pressurejs.com/} object (if any).
	 */
	CB_Touch.getPressureJSObject = function()
	{
		return CB_Touch._pressureJSObject;
	}

	
	CB_Touch._delayTimeout = {};
	CB_Touch._delayPerforming = {};
	CB_Touch._delayMsDefault = 200;
	/**
	* First time, this function will return true. Next calls, with same index, returns false during the previously-defined time set in the previous call and true after that delay. After the first call, next calls of this function with same index will be ignored (returning always false) until the delay provided expires. If it is called after a previous call with the same index and the delay of the previous call already expired, it will act as it was the first call again. Useful, for example, to prevent the [onTouchStart]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event} event to fire twice or more when a layer (container) is closed and behind there is another one with also the [onTouchStart]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event} event.
	 *  @function
	 *  @param {integer} [delayMs=CB_Touch._delayMsDefault] - Delay desired in milliseconds. For same indexes, this parameter will be ignored if there was a previous call to this function whose delay did not expire yet.
	 *  @param {integer|string} [index=0] - Desired index to identify the process.
	 *  @returns {boolean} First time, this function will return true. Next calls with the same index, returns false during the given time and true after that delay. After the first call, next calls with same index of this function will be ignored (returning always false) until the delay provided expires. If it is called after a previous call with the same index and the delay of the previous call already expired, it will act as it was the first call again.
	 */
	CB_Touch.delay = function(delayMs, index)
	{
		if (!index) { index = 0; }
		if (CB_Touch._delayPerforming[index]) { return false; }
		clearTimeout(CB_Touch._delayTimeout[index]);
		CB_Touch._delayPerforming[index] = true;
		if (typeof(delayMs) === "undefined" || delayMs === null || isNaN(delayMs)) { delayMs = CB_Touch._delayMsDefault; }
		CB_Touch._delayTimeout[index] = setTimeout(function() { CB_Touch._delayPerforming[index] = false; }, delayMs);
		return true;
	}
	
}