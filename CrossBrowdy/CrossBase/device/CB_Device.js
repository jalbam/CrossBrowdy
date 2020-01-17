/**
 * @file Device management. Contains the {@link CB_Device} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */
 

/**
 * Static class to manage the device. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Think about defining a parameter on many of the events to disable automatic normalization of the event object.
 */
var CB_Device = function() { return CB_Device; };
{
	CB_Device.initialized = false; //It will tells whether the object has been initialized or not.


	//Initializes all values:
	CB_Device.init = function()
	{
		if (CB_Device.initialized) { return CB_Device; }

		//The object has been initialized:
		CB_Device.initialized = true;
		
		//If now() static function not available, uses getTime() method:
		if (!Date.now) { Date.now = function() { return new Date().getTime(); }; }
		
		//If desired and it is possible, changes the CB_Device.getTime method to use high precission:
		if (CB_Configuration.CrossBase.CB_Device_getTime_HIGH_PRECISION && window.performance && window.performance.timing && window.performance.timing.navigationStart) //window.performance.now is always available (polyfilled).
		{
			CB_Device.getTime = function() { return window.performance.timing.navigationStart + window.performance.now() || Date.now(); };
		}
		
		//Initializes sub-classes:
		CB_Device.Battery.init();
		
		return CB_Device;
	}

	
	/**
	 * Gets a timestamp in milliseconds (elapsed since 1st of January 1970 00:00:00 UTC) representing the current time. Using high precision if the {@link CB_Configuration.CrossBase.CB_Device_getTime_HIGH_PRECISION} option is true (it would return '[window.performance.timing.navigationStart]{@link https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart} + [window.performance.now]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance/now}()', where '[window.performance.now]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance/now}' could be polyfilled) or normal precision otherwise (it would return '[Date.now]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now}()', where '[Date.now]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now}' could be polyfilled).
	 *  @function
	 *  @returns {integer} Returns a timestamp in milliseconds (elapsed since 1st of January 1970 00:00:00 UTC) representing the current time or zero (0) if it was not possible.
	 */
	CB_Device.getTime = function() //Can be replaced in CB_Device.init to use high precision.
	{
		return Date.now();
	};
	

	/**
	 * Gets the time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin}. If possible, it uses [window.performance.now]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance/now}, which could be polyfilled (if it is polyfilled it will not have high precision timing but, if it is not, time precision/resolution will depend on the client).
	 *  @function
	 *  @returns {number} Returns the time elapsed since the [time origin]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#The_time_origin}. If possible, it uses [window.performance.now]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance/now}, which could be polyfilled (if it is polyfilled it will not have high precision timing but, if it is not, time precision/resolution will depend on the client).
	 */
	CB_Device.getTiming = function() //Can be replaced in CB_Device.init to use high precision.
	{
		return window.performance.now();
	};


	//Sets a function to execute when a desired event is fired:
	CB_Device._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture, target)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; } //If not set, it keeps old function by default.
		if (typeof(target) === "undefined" || target === null)
		{
			target = window;
		}

		//If a function has been sent:
		if (typeof(eventFunction) === "function")
		{
			//If able, adds the function given to the event:
			CB_Events.add(target, eventName, eventFunction, useCapture, keepOldFunction, true);
		}
		//...but if the function given is null, it will cancel the event:
		else if (eventFunction === null)
		{
			CB_Events.removeByName(target, eventName);
		}
	}

	
} //End of the static class CB_Device.


/**
 * Static class to manage the device's location. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Normalize more differences between web clients.
 */
CB_Device.Location = function() { return CB_Device.Location; };
{
	/**
	 * Keeps the last watch ID that gets the location constantly. Used by the {@link CB_Device.Location.getConstantly} function.
	 *	@var
	 *  @readonly
	 *  @type {integer|null}
	 *  @default
	 */
	CB_Device.Location.getConstantly_lastId = null;
	
	
	/**
	 * Keeps the "WakeLock" ([MozWakeLock]{@link https://developer.mozilla.org/docs/Web/API/MozWakeLock}) object to be able to release the lock related with the GPS (so far, only works in Firefox/Firefox OS). Used by the {@link CB_Device.Location.keepAwake} function.
	 *	@var
	 *  @readonly
	 *  @type {Object|null}
	 *  @default
	 */
	CB_Device.Location.keepAwake_locationLockGPS = null;
	
	
	/**
	 * Keeps the callback function used when location can be gotten successfully for the {@link CB_Device.Location.get} function.
	 *	@var
	 *  @readonly
	 *  @type {function|null}
	 *  @default
	 */
	CB_Device.Location.get_callbackOk = null;
	
	
	/**
	 * Keeps the callback function used when there is an error getting the location for the {@link CB_Device.Location.get} function.
	 *	@var
	 *  @readonly
	 *  @type {function|null}
	 *  @default
	 */
	CB_Device.Location.get_callbackError = null;
	
	
	/**
	 * Keeps the last options used by the {@link CB_Device.Location.get} function.
	 *	@var
	 *  @readonly
	 *  @type {Object|undefined}
	 *  @default
	 */
	CB_Device.Location.get_options = undefined;
	
	
	/**
	 * Keeps the callback function used when location can be gotten successfully for the {@link CB_Device.Location.getConstantly} function.
	 *	@var
	 *  @readonly
	 *  @type {function|null}
	 *  @default
	 */
	CB_Device.Location.getConstantly_callbackOk = null;
	
	
	/**
	 * Keeps the callback function used when there is an error getting the location for the {@link CB_Device.Location.getConstantly} function.
	 *	@var
	 *  @readonly
	 *  @type {function|null}
	 *  @default
	 */
	CB_Device.Location.getConstantly_callbackError = null;
	
	
	/**
	 * Keeps the last options used by the {@link CB_Device.Location.getConstantly} function.
	 *	@var
	 *  @readonly
	 *  @type {Object|undefined}
	 *  @default
	 */
	CB_Device.Location.getConstantly_options = undefined;
	
	
	/**
	 * Tells whether the [Geolocation API]{@link https://developer.mozilla.org/docs/Web/API/Geolocation} (or compatible one as [Apache Cordova's Geolocation plugin]{@link https://github.com/apache/cordova-plugin-geolocation}) is supported or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.Location.isSupported = function()
	{
		return (window.navigator && "geolocation" in navigator && typeof(navigator.geolocation.getCurrentPosition) !== "undefined");
	}
	
	
	CB_Device.Location._getFirstTime = false;
	/**
	 * Gets the current position. Uses the [Geolocation API]{@link https://developer.mozilla.org/docs/Web/API/Geolocation} (or compatible one as [Apache Cordova's Geolocation plugin]{@link https://github.com/apache/cordova-plugin-geolocation}).
	 *  @function
	 *  @param {function} [callbackOk] - Callback that will be called if it gets the location successfully. Following the same rules as the first parameter of the native [getCurrentPosition]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/getCurrentPosition} function.
	 *  @param {function} [callbackError] - Callback that will be called if there is any error getting the location. Following the same rules as the second parameter of the native [getCurrentPosition]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/getCurrentPosition} function.
	 *  @param {Object} [options] - Object that represents the desired options. This parameter will be ignored if "keepOldOptions" is set to true. Following the same rules as the third parameter of the native [getCurrentPosition]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/getCurrentPosition} function.
	 *  @param {boolean} [keepOldCallbackOk=true] - If it is set to false, it will not keep the old previous "callbackOk" (if any) which was/were set in previous calls to this function.
	 *  @param {boolean} [keepOldCallbackError=true] - If it is set to false, it will not keep the old previous "callbackError" (if any) which was/were set in previous calls to this function.
	 *  @param {boolean} [keepOldOptions=false] - If it is set to true, it will ignore the given options and it will try to use the old previous options (if any) which were set in previous calls to this function.
	 *  @returns {undefined|false} Returns false in the case that [Geolocation API]{@link https://developer.mozilla.org/docs/Web/API/Geolocation} (or compatible one as [Apache Cordova's Geolocation plugin]{@link https://github.com/apache/cordova-plugin-geolocation}) is not supported or undefined otherwise.
	 */
	CB_Device.Location.get = function(callbackOk, callbackError, options, keepOldCallbackOk, keepOldCallbackError, keepOldOptions)
	{
		if (typeof(keepOldCallbackOk) === "undefined" || keepOldCallbackOk === null) { keepOldCallbackOk = true; } //If not set, it keeps old ok function by default.
		if (typeof(keepOldCallbackError) === "undefined" || keepOldCallbackError === null) { keepOldCallbackError = true; } //If not set, it keeps old error function by default.
		
		if (CB_Device.Location.isSupported() && typeof(callbackOk) === "function")
		{
			if (!keepOldCallbackOk)
			{
				CB_Device.Location.get_callbackOk = callbackOk;
			}
			else
			{
				var callbackOkOld = CB_Device.Location.get_callbackOk;
				CB_Device.Location.get_callbackOk =
					function(locationObject)
					{
					   if (typeof(callbackOkOld) === "function") { callbackOkOld(locationObject); }
					   if (typeof(callbackOk) === "function") { callbackOk(locationObject); }
					};
			}

			if (!keepOldCallbackError)
			{
				CB_Device.Location.get_callbackError = callbackError;
			}
			else
			{
				var callbackErrorOld = CB_Device.Location.get_callbackError;
				CB_Device.Location.get_callbackError =
					function(error)
					{
					   if (typeof(callbackErrorOld) === "function") { callbackErrorOld(error); }
					   if (typeof(callbackError) === "function") { callbackError(error); }
					};
			}
			
			if (!keepOldOptions) { CB_Device.Location.get_options = options; }
			
			if (CB_Device.Location._getFirstTime === true)
			{
				CB_Device.Location._getFirstTime = false;
				navigator.geolocation.getCurrentPosition(function(){}, function(){}, {}); //Hack. Source: Niels Steenbeek @ http://stackoverflow.com/questions/3397585/navigator-geolocation-getcurrentposition-sometimes-works-sometimes-doesnt
			}
			
			return navigator.geolocation.getCurrentPosition(CB_Device.Location.get_callbackOk, CB_Device.Location.get_callbackError, CB_Device.Location.get_options);
		}
		
		return false;
	}


	CB_Device.Location._getConstantlyFirstTime = true;
	/**
	 * Starts or stops getting the current position constantly (real-time) every time it changes. Uses the [Geolocation API]{@link https://developer.mozilla.org/docs/Web/API/Geolocation} (or compatible one as [Apache Cordova's Geolocation plugin]{@link https://github.com/apache/cordova-plugin-geolocation}).
	 *  @function
	 *  @param {function|integer} [callbackOkOrId={@link CB_Device.Location.getConstantly_lastId}] - In the case that we want to start getting the position, use a function callback that will be called every time it gets the location successfully (using the native [watchPosition]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/watchPosition} function). To stop getting the position, use the watch ID that we want to stop (using the native [clearWatch]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/clearWatch} function). Following the same rules as the first parameter of the native [watchPosition]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/watchPosition} function (when we want to start watching) or the first parameter of [clearWatch]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/clearWatch} function (when we want to stop watching).
	 *  @param {function} [callbackError] - Callback that will be called if there is any error getting the location. Only used when we want to start getting the current position ("callbackOkOrId" is a function). Following the same rules as the second parameter of the native [watchPosition]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/watchPosition} function.
	 *  @param {Object} [options] - Object that represents the desired options. This parameter will be ignored if "keepOldOptions" is set to true. Only used when we want to start getting the current position ("callbackOkOrId" is a function). Following the same rules as the third parameter of the native [watchPosition]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/watchPosition} function.
	 *  @param {boolean} [keepOldCallbackOk=true] - If it is set to false, it will not keep the old previous "callbackOk" (if any) which was/were set in previous calls to this function. Only used when we want to start getting the current position ("callbackOkOrId" is a function).
	 *  @param {boolean} [keepOldCallbackError=true] - If it is set to false, it will not keep the old previous "callbackError" (if any) which was/were set in previous calls to this function. Only used when we want to start getting the current position ("callbackOkOrId" is a function).
	 *  @param {boolean} [keepOldOptions=false] - If it is set to true, it will ignore the given options and it will try to use the old previous options (if any) which were set in previous calls to this function. Only used when we want to start getting the current position ("callbackOkOrId" is a function).
	 *  @returns {integer|undefined|false} Returns false in the case that [Geolocation API]{@link https://developer.mozilla.org/docs/Web/API/Geolocation} (or compatible one as [Apache Cordova's Geolocation plugin]{@link https://github.com/apache/cordova-plugin-geolocation}) is not supported. In the case that we want to start getting the current position ("callbackOkOrId" is a function), it will return the watch ID that has been created. In the case that we want to stop getting the position ("callbackOkOrId" is a watch ID), it will return undefined.
	 */
	CB_Device.Location.getConstantly = function(callbackOkOrId, callbackError, options, keepOldCallbackOk, keepOldCallbackError, keepOldOptions)
	{
		//If either callback function has been given, starts getting the position constantly:
		if (typeof(callbackOkOrId) === "function")
		{
			if (typeof(keepOldCallbackOk) === "undefined" || keepOldCallbackOk === null) { keepOldCallbackOk = true; } //If not set, it keeps old ok function by default.
			if (typeof(keepOldCallbackError) === "undefined" || keepOldCallbackError === null) { keepOldCallbackError = true; } //If not set, it keeps old error function by default.

			if (CB_Device.Location.isSupported() && typeof(navigator.geolocation.watchPosition) !== "undefined")
			{
				if (!keepOldCallbackOk)
				{
					CB_Device.Location.getConstantly_callbackOk = callbackOkOrId;
				}
				else
				{
					var callbackOkOld = CB_Device.Location.getConstantly_callbackOk;
					CB_Device.Location.getConstantly_callbackOk =
						function(locationObject)
						{
						   if (typeof(callbackOkOld) === "function") { callbackOkOld(locationObject); }
						   if (typeof(callbackOkOrId) === "function") { callbackOkOrId(locationObject); }
						};
				}

				if (!keepOldCallbackError)
				{
					CB_Device.Location.getConstantly_callbackError = callbackError;
				}
				else
				{
					var callbackErrorOld = CB_Device.Location.getConstantly_callbackError;
					CB_Device.Location.getConstantly_callbackError =
						function(error)
						{
						   if (typeof(callbackErrorOld) === "function") { callbackErrorOld(error); }
						   if (typeof(callbackError) === "function") { callbackError(error); }
						};
				}
				
				if (!keepOldOptions) { CB_Device.Location.getConstantly_options = options; }

				if (CB_Device.Location._getConstantlyFirstTime === true)
				{
					CB_Device.Location._getConstantlyFirstTime = false;
					navigator.geolocation.watchPosition(function(){}, function(){}, {}); //Hack. Source: Niels Steenbeek @ http://stackoverflow.com/questions/3397585/navigator-geolocation-getcurrentposition-sometimes-works-sometimes-doesnt
				}
				
				CB_Device.Location.getConstantly_lastId = navigator.geolocation.watchPosition(CB_Device.Location.getConstantly_callbackOk, CB_Device.Location.getConstantly_callbackError, CB_Device.Location.getConstantly_options);
				
				return CB_Device.Location.getConstantly_lastId;
			}
		}
		//...otherwise, stops getting the position constantly:
		else
		{
			if (window.navigator && "geolocation" in navigator && typeof(navigator.geolocation.clearWatch) !== "undefined")
			{
				//if (typeof(callbackOkOrId) === "undefined" || callbackOkOrId === null) { callbackOkOrId = CB_Device.Location.getConstantly_lastId; }
				if (isNaN(callbackOkOrId) || CB_trim(callbackOkOrId) === "") { callbackOkOrId = CB_Device.Location.getConstantly_lastId; }
				return navigator.geolocation.clearWatch(callbackOkOrId);
			}
		}
		
		return false;
	}


	/**
	 * Stops getting the current position constantly (real-time) every time it changes. Uses the [Geolocation API]{@link https://developer.mozilla.org/docs/Web/API/Geolocation} (or compatible one as [Apache Cordova's Geolocation plugin]{@link https://github.com/apache/cordova-plugin-geolocation}).
	 *  @function
	 *  @param {integer} [id={@link CB_Device.Location.getConstantly_lastId}] - The watch ID that we want to stop. Following the same rules as the first parameter of the native [clearWatch]{@link https://developer.mozilla.org/docs/Web/API/Geolocation/clearWatch} function.
	 *  @param {boolean} [keepOldCallbackOk=false] - If it is set to false, it will not remove the current "callbackOk" (if any) which was/were set previously.
	 *  @param {boolean} [keepOldCallbackError=false] - If it is set to false, it will remove the current "callbackError" (if any) which was/were set previously.
	 *  @param {boolean} [keepOldOptions=false] - If it is set to false, it will remove the current "options" (if any) which were set previously.
	 *  @returns {undefined|false} Returns false in the case that [Geolocation API]{@link https://developer.mozilla.org/docs/Web/API/Geolocation} (or compatible one as [Apache Cordova's Geolocation plugin]{@link https://github.com/apache/cordova-plugin-geolocation}) is not supported or undefined otherwise.
	 */
	CB_Device.Location.getConstantlyDisable = function(id, keepOldCallbackOk, keepOldCallbackError, keepOldOptions)
	{
		//if (typeof(id) === "function") { id = undefined; } //Prevents calling CB_Device.Location.getConstantly with a function as parameter since that is for starting the watcher.
		if (isNaN(id) || !id) { id = undefined; } //Prevents calling CB_Device.Location.getConstantly with a function as parameter since that is for starting the watcher.
		if (!keepOldCallbackOk) { CB_Device.Location.getConstantly_callbackOk = null; }
		if (!keepOldCallbackError) { CB_Device.Location.getConstantly_callbackError = null; }
		if (!keepOldOptions) { CB_Device.Location.getConstantly_options = undefined; }
		return CB_Device.Location.getConstantly(id);
	}

	
	/**
	 * Keeps or stops keeping the application getting the position, even when the application is invisible or screen is locked, by using [requestWakeLock]{@link https://developer.mozilla.org/docs/Web/API/Navigator/requestWakeLock} (so far, only works in Firefox/Firefox OS).
	 *  @function
	 *  @param {boolean} [keepAwake=true] - Defines whether we want to keep it awake or stop doing it.
	 *  @param {Object} [lock={@link CB_Device.Location.keepAwake_locationLockGPS}] - The "WakeLock" ([MozWakeLock]{@link https://developer.mozilla.org/docs/Web/API/MozWakeLock}) object that we want to unlock. It will be used only when "keepAwake" is set to false.
	 *  @returns {undefined|Object|false} Returns false in the case that "WakeLock" ([MozWakeLock]{@link https://developer.mozilla.org/docs/Web/API/MozWakeLock}) is not supported or something went wrong. Returns the "WakeLock" ([MozWakeLock]{@link https://developer.mozilla.org/docs/Web/API/MozWakeLock}) object in the case that we wanted to keep it awake ("keepAwake" is set to true). Returns undefined in the case that we do not want it to keep it awake ("keepAwake" is set to false and the lock is a valid "WakeLock" object).
	 */
	CB_Device.Location.keepAwake = function(keepAwake, lock)
	{
		if (typeof(keepAwake) === "undefined" || keepAwake === null) { keepAwake = true; }
		
		//If we want to lock the device to keep it awake:
		if (keepAwake)
		{
			if (window.navigator && typeof(window.navigator.requestWakeLock) !== "undefined")
			{
				CB_Device.Location.keepAwake_locationLockGPS = window.navigator.requestWakeLock("gps"); //So far, only works in Firefox/Firefox OS.
				return CB_Device.Location.keepAwake_locationLockGPS;
			}
		}
		//...otherwise, if we want to release the lock that keeps the device awake:
		else
		{
			if (typeof(lock) === "undefined" || lock === null)
			{
				if (typeof(CB_Device.Location.keepAwake_locationLockGPS) !== "undefined" && CB_Device.Location.keepAwake_locationLockGPS !== null) { lock = CB_Device.Location.keepAwake_locationLockGPS; }
				else { return false; }
			}
			if (typeof(lock.unlock) !== "undefined") { return lock.unlock(); } //So far, only works in Firefox/Firefox OS.
		}
		return false;
	}

} //End of the static class CB_Device.Location.


/**
 * Static class to manage the device's orientation. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Normalize more differences between web clients.
 */
CB_Device.Orientation = function() { return CB_Device.Orientation; };
{
	/**
	 * Keeps the last watch ID that gets the compass heading constantly using the [Apache Cordova's Device Orientation plugin]{@link https://github.com/apache/cordova-plugin-device-orientation}. Used by the {@link CB_Device.Orientation.cordova_getCompassConstantly} function.
	 *	@var
	 *  @readonly
	 *  @type {integer|null}
	 *  @default
	 */
	CB_Device.Orientation.cordova_getCompassConstantly_lastId = null;

	
	/**
	 * Tells whether the [Device Orientation Event]{@link https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent} (used by the [Device Orientation API]{@link https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation} or compatible one) is supported or not.
	 *  @function
	 *  @returns {boolean}
	 *  @todo Think about using the "ondeviceorientationabsolute" event.
	 */
	CB_Device.Orientation.isSupported = function()
	{
		return ("DeviceOrientationEvent" in window || "ondeviceorientation" in window);
	}

	
	/**
	 * Tells whether the [MozOrientation API]{@link https://developer.mozilla.org/docs/Web/Events/MozOrientation} is supported or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.Orientation.isMozOrientationSupported = function()
	{
		return ("MozOrientation" in window);
	}
	
	
	/**
	 * Sets a function to execute for the [Device Orientation Event]{@link https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent} (used by the [Device Orientation API]{@link https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation} or compatible one) or removes it. Falls back to the [MozOrientation API]{@link https://developer.mozilla.org/docs/Web/Events/MozOrientation} if possible.
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. The event object received will already be normalized by the {@link CB_Device.Orientation.normalizeEvent} function automatically. Following the same rules as in {@link https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @returns {undefined|false} Returns false in the case that neither the [Device Orientation API]{@link https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation} (or compatible one) nor the [MozOrientation API]{@link https://developer.mozilla.org/docs/Web/Events/MozOrientation} are supported or undefined otherwise.
	 *  @todo Think about using the "deviceorientationabsolute" event.
	 */
	CB_Device.Orientation.onChange = function(eventFunction, keepOldFunction, useCapture)
	{
		if (CB_Device.Orientation.isSupported())
		{
			return CB_Device.Orientation._setEvent("deviceorientation", eventFunction, keepOldFunction, useCapture, window);
		}
		else if (CB_Device.Orientation.isMozOrientationSupported())
		{
			return CB_Device.Orientation._setEvent("MozOrientation", eventFunction, keepOldFunction, useCapture, window);
		}
		else { return false; }
	}
	
	
	//Sets a function to execute when a desired event is fired:
	CB_Device.Orientation._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture, target)
	{
		var wrapperFunction = eventFunction;
		if (typeof(eventFunction) === "function")
		{
			wrapperFunction = function(e)
			{
				e = CB_Device.Orientation.normalizeEvent(e, eventName);
				return eventFunction(e);
			};
		}
		CB_Device._setEvent(eventName, wrapperFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Normalizes the data gotten from the [Device Orientation Event]{@link https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent} produced by different clients to try to match the [Device Orientation API]{@link https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation} and follow always the same rules as much as possible.
	 *  @function
	 *  @param {Event} e - The event object that we want to normalize.
	 *  @param {('deviceorientation'|'MozOrientation')} eventName - The name of the event that we want to normalize. Case sensitive.
	 *  @returns {Event} Returns the given event object again but normalized (if possible).
	 *  @todo Think about using the "deviceorientationabsolute" event.
	 *  @todo Normalize more differences between web clients.
	 */
	CB_Device.Orientation.normalizeEvent = function(e, eventName)
	{
		e = CB_Events.normalize(e);
		if (typeof(e) !== "undefined" && e !== null)
		{
			if (eventName === "deviceorientation")
			{
				if (e.webkitCompassHeading) { e.alpha = /*360 - */e.webkitCompassHeading; } //Source: https://mobiforge.com/design-development/html5-mobile-web-device-orientation-events and https://dev.opera.com/articles/w3c-device-orientation-usage/
			}
			else if (eventName === "MozOrientation")
			{
				if (!e.gamma && !e.beta) //For FF3.6+ (Source: https://developer.mozilla.org/en-US/docs/Web/Events/MozOrientation)
				{
					e.gamma = -(e.x * (180 / Math.PI));
					e.beta = -(e.y * (180 / Math.PI));
				}
			}
			//TODO: there are still more differences between web clients!
		}
		return e;
	}
	
	
	/**
	 * Tells whether the [Compass Needs Calibration Event]{@link https://w3c.github.io/deviceorientation/spec-source-orientation.html#compassneedscalibration} (used by the [Device Orientation API]{@link https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation} or compatible one) is supported or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.Orientation.isCompassNeedsCalibrationSupported = function()
	{
		return ("CompassNeedsCalibration" in window || "oncompassneedscalibration" in window); //return ("DeviceMotionEvent" in window || "ondevicemotion" in window);
	}

	
	/**
	 * Sets a function to execute for the [Compass Needs Calibration Event]{@link https://w3c.github.io/deviceorientation/spec-source-orientation.html#compassneedscalibration} (used by the [Device Orientation API]{@link https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation} or compatible one) or removes it.
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. Following the same rules as in {@link https://w3c.github.io/deviceorientation/spec-source-orientation.html#compassneedscalibration}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @returns {undefined|false} Returns false in the case that the [Compass Needs Calibration Event]{@link https://w3c.github.io/deviceorientation/spec-source-orientation.html#compassneedscalibration} is not supported or undefined otherwise.
	 */
	CB_Device.Orientation.onCompassNeedsCalibration = function(eventFunction, keepOldFunction, useCapture)
	{
		if (!CB_Device.Orientation.isCompassNeedsCalibrationSupported()) { return false; }
		return CB_Device._setEvent("compassneedscalibration", eventFunction, keepOldFunction, useCapture, window);
	}
	
	
	/**
	 * Tells whether the [Apache Cordova's Device Orientation plugin]{@link https://github.com/apache/cordova-plugin-device-orientation} is available or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.Orientation.cordova_isCompassSupported = function()
	{
		return (typeof(navigator) !== "undefined" && navigator !== null && navigator.compass && navigator.compass.getCurrentHeading && navigator.compass.watchHeading && navigator.compass.clearWatch);
	}
	
	
	/**
	 * Gets the compass heading using the [Apache Cordova's Device Orientation plugin]{@link https://github.com/apache/cordova-plugin-device-orientation}. Uses "navigator.compass.getCurrentHeading" internally.
	 *  @function
	 *  @param {function} callbackOk - The function that will be called when it succeeds getting the compass heading. Following the same rules as in {@link https://github.com/apache/cordova-plugin-device-orientation} ("navigator.compass.getCurrentHeading" function).
	 *  @param {function} callbackError - The function that will be called if there is any error getting the compass heading. Following the same rules as in {@link https://github.com/apache/cordova-plugin-device-orientation} ("navigator.compass.getCurrentHeading" function).
	 *  @returns {undefined|false} Returns false in the case that the [Apache Cordova's Device Orientation plugin]{@link https://github.com/apache/cordova-plugin-device-orientation} is not supported or undefined otherwise.
	 *  @todo Add a function to normalize the event and call it automatically.
	 */
	CB_Device.Orientation.cordova_getCompass = function(callbackOk, callbackError)
	{
		if (!CB_Device.Orientation.cordova_isCompassSupported()) { return false; }
		navigator.compass.getCurrentHeading(callbackOk, callbackError);
	}


	/**
	 * Starts or stops getting the compass heading constantly at a regular interval. Uses the [Apache Cordova's Device Orientation plugin]{@link https://github.com/apache/cordova-plugin-device-orientation} ("navigator.compass.watchHeading" and "navigator.compass.clearWatch" functions).
	 *  @function
	 *  @param {function|integer} [callbackOkOrId={@link CB_Device.Orientation.cordova_getCompassConstantly_lastId}] - In the case that we want to start getting the compass heading, use a function callback that will be called regularly when the compass heading is gotten successfully (using the "navigator.compass.watchHeading" function). To stop getting the compass heading, use the watch ID that we want to stop (using the "navigator.compass.clearWatch" function). Following the same rules as the first parameter of the "navigator.compass.watchHeading" function (when we want to start watching) or the first parameter of "navigator.compass.clearWatch" function (when we want to stop watching) described in {@link https://github.com/apache/cordova-plugin-device-orientation}.
	 *  @param {function} [callbackError] - Callback that will be called if there is any error getting the compass heading. Only used when we want to start getting the compass heading ("callbackOkOrId" is a function). Following the same rules as the second parameter of the "navigator.compass.watchHeading" function described in {@link https://github.com/apache/cordova-plugin-device-orientation}.
	 *  @param {Object} [options] - Object that represents the desired options. Only used when we want to start getting the compass heading ("callbackOkOrId" is a function). Following the same rules as the third parameter of the "navigator.compass.watchHeading" function described in {@link https://github.com/apache/cordova-plugin-device-orientation}.
	 *  @returns {integer|undefined|false} Returns false in the case that [Apache Cordova's Device Orientation plugin]{@link https://github.com/apache/cordova-plugin-device-orientation} is not supported. In the case that we want to start getting the compass heading ("callbackOkOrId" is a function), it will return the watch ID that has been created. In the case that we want to stop getting the compass heading ("callbackOkOrId" is a watch ID), it will return undefined.
	 *  @todo Add a function to normalize the event and call it automatically.
	 *  @todo Add parameters to keep old callbacks and options.
	 */
	CB_Device.Orientation.cordova_getCompassConstantly = function(callbackOkOrId, callbackError, options) //Note: options can be an object with two optional properties ("frequency" and "filter").
	{
		if (!CB_Device.Orientation.cordova_isCompassSupported()) { return false; }
		
		//If either callback function has been given, starts getting the compass heading constantly:
		if (typeof(callbackOkOrId) === "function")
		{
			CB_Device.Orientation.cordova_getCompassConstantly_lastId = navigator.compass.watchHeading(callbackOkOrId, callbackError, options);
			return CB_Device.Orientation.cordova_getCompassConstantly_lastId;
		}
		//...otherwise, stops getting the compass heading constantly:
		else
		{
			//if (typeof(callbackOkOrId) === "undefined" || callbackOkOrId === null) { callbackOkOrId = CB_Device.Orientation.cordova_getCompassConstantly_lastId; }
			if (isNaN(callbackOkOrId) || CB_trim(callbackOkOrId) === "") { callbackOkOrId = CB_Device.Orientation.cordova_getCompassConstantly_lastId; }
			navigator.compass.clearWatch(callbackOkOrId);
			return;
		}
		return false;
	}


	/**
	 * Stops getting the compass heading constantly at a regular interval. Uses the [Apache Cordova's Device Orientation plugin]{@link https://github.com/apache/cordova-plugin-device-orientation} ("navigator.compass.clearWatch" function).
	 *  @function
	 *  @param {integer} [id={@link CB_Device.Orientation.cordova_getCompassConstantly_lastId}] - The watch ID that we want to stop. Following the same rules as the first parameter of the "navigator.compass.clearWatch" function described in {@link https://github.com/apache/cordova-plugin-device-orientation}.
	 *  @returns {undefined|false} Returns false in the case that [Apache Cordova's Device Orientation plugin]{@link https://github.com/apache/cordova-plugin-device-orientation} is not supported or undefined otherwise.
	 *  @todo Add parameters to keep old callbacks and options.
	 */
	CB_Device.Orientation.cordova_getCompassConstantlyDisable = function(id)
	{
		if (typeof(id) === "function") { id = undefined; } //Prevents calling CB_Device.Orientation.cordova_getCompassConstantly with a function as parameter since that is for starting the watcher.
		return CB_Device.Orientation.cordova_getCompassConstantly(id);
	}

} //End of the static class CB_Device.Orientation.


/**
 * Static class to manage the device's motion. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Normalize more differences between web clients.
 */
CB_Device.Motion = function() { return CB_Device.Motion; };
{
	/**
	 * Keeps the last watch ID that gets the acceleration constantly using the [Apache Cordova's Device Motion plugin]{@link https://github.com/apache/cordova-plugin-device-motion}. Used by the {@link CB_Device.Motion.cordova_getAccelerationConstantly} function.
	 *	@var
	 *  @readonly
	 *  @type {integer|null}
	 *  @default
	 */
	CB_Device.Motion.cordova_getAccelerationConstantly_lastId = null;

	
	/**
	 * Tells whether the [Device Motion Event]{@link https://developer.mozilla.org/docs/Web/API/DeviceMotionEvent} (used by the [Device Orientation API]{@link https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation} or compatible one) is supported or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.Motion.isSupported = function()
	{
		return ("DeviceMotionEvent" in window || "ondevicemotion" in window);
	}

	
	/**
	 * Sets a function to execute for the [Device Motion Event]{@link https://developer.mozilla.org/docs/Web/API/DeviceMotionEvent} (used by the [Device Orientation API]{@link https://developer.mozilla.org/docs/Web/API/Detecting_device_orientation} or compatible one) or removes it.
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. Following the same rules as in {@link https://developer.mozilla.org/docs/Web/API/DeviceMotionEvent}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @returns {undefined|false} Returns false in the case that the [Device Motion Event]{@link https://developer.mozilla.org/docs/Web/API/DeviceMotionEvent} is not supported or undefined otherwise.
	 */
	CB_Device.Motion.onChange = function(eventFunction, keepOldFunction, useCapture)
	{
		if (!CB_Device.Motion.isSupported()) { return false; }
		return CB_Device._setEvent("devicemotion", eventFunction, keepOldFunction, useCapture, window);
	}


	/**
	 * Tells whether the [Apache Cordova's Device Motion plugin]{@link https://github.com/apache/cordova-plugin-device-motion} is available or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.Motion.cordova_isAccelerationSupported = function()
	{
		return (typeof(navigator) !== "undefined" && navigator !== null && navigator.accelerometer && navigator.accelerometer.getCurrentAcceleration && navigator.accelerometer.watchAcceleration && navigator.accelerometer.clearWatch);
	}
	

	/**
	 * Gets the acceleration using the [Apache Cordova's Device Motion plugin]{@link https://github.com/apache/cordova-plugin-device-motion}. Uses "navigator.accelerometer.getCurrentAcceleration" internally.
	 *  @function
	 *  @param {function} callbackOk - The function that will be called when it succeeds getting the acceleration. The event object received will already be normalized by the {@link CB_Device.Motion.cordova_getAccelerationNormalized} function automatically. Following the same rules as in {@link https://github.com/apache/cordova-plugin-device-motion} ("navigator.accelerometer.getCurrentAcceleration" function).
	 *  @param {function} callbackError - The function that will be called if there is any error getting the acceleration. Following the same rules as in {@link https://github.com/apache/cordova-plugin-device-motion} ("navigator.accelerometer.getCurrentAcceleration" function).
	 *  @returns {undefined|false} Returns false in the case that the [Apache Cordova's Device Motion plugin]{@link https://github.com/apache/cordova-plugin-device-motion} is not supported or undefined otherwise.
	 */
	CB_Device.Motion.cordova_getAcceleration = function(callbackOk, callbackError)
	{
		if (!CB_Device.Motion.cordova_isAccelerationSupported()) { return false; }
		var callbackOkWrapper = function(e) { e = CB_Device.Motion.cordova_getAccelerationNormalized(e); if (typeof(callbackOk) === "function") { callbackOk(e); } } //Normalizes the event.
		navigator.accelerometer.getCurrentAcceleration(callbackOkWrapper, callbackError);
	}


	/**
	 * Starts or stops getting the acceleration constantly at a regular interval. Uses the [Apache Cordova's Device Motion plugin]{@link https://github.com/apache/cordova-plugin-device-motion} ("navigator.accelerometer.watchAcceleration" and "navigator.accelerometer.clearWatch" functions).
	 *  @function
	 *  @param {function|integer} [callbackOkOrId={@link CB_Device.Motion.cordova_getAccelerationConstantly_lastId}] - In the case that we want to start getting the acceleration, use a function callback that will be called regularly when the acceleration is gotten successfully (using the "navigator.accelerometer.watchAcceleration" function) and the event object received will already be normalized by the {@link CB_Device.Motion.cordova_getAccelerationNormalized} function automatically. To stop getting the acceleration, use the watch ID that we want to stop (using the "navigator.accelerometer.clearWatch" function). Following the same rules as the first parameter of the "navigator.accelerometer.watchAcceleration" function (when we want to start watching) or the first parameter of "navigator.accelerometer.clearWatch" function (when we want to stop watching) described in {@link https://github.com/apache/cordova-plugin-device-motion}.
	 *  @param {function} [callbackError] - Callback that will be called if there is any error getting the acceleration. Only used when we want to start getting the acceleration ("callbackOkOrId" is a function). Following the same rules as the second parameter of the "navigator.accelerometer.watchAcceleration" function described in {@link https://github.com/apache/cordova-plugin-device-motion}.
	 *  @param {Object} [options] - Object that represents the desired options. Only used when we want to start getting the acceleration ("callbackOkOrId" is a function). Following the same rules as the third parameter of the "navigator.accelerometer.watchAcceleration" function described in {@link https://github.com/apache/cordova-plugin-device-motion}.
	 *  @returns {integer|undefined|false} Returns false in the case that [Apache Cordova's Device Motion plugin]{@link https://github.com/apache/cordova-plugin-device-motion} is not supported. In the case that we want to start getting the acceleration ("callbackOkOrId" is a function), it will return the watch ID that has been created. In the case that we want to stop getting the acceleration ("callbackOkOrId" is a watch ID), it will return undefined.
	 *  @todo Add parameters to keep old callbacks and options.
	 */
	CB_Device.Motion.cordova_getAccelerationConstantly = function(callbackOkOrId, callbackError, options) //Note: options can be an object with an optional property ("frequency").
	{
		if (!CB_Device.Motion.cordova_isAccelerationSupported()) { return false; }
		
		//If either callback function has been given, starts getting the acceleration constantly:
		if (typeof(callbackOkOrId) === "function")
		{
			var callbackOkOrIdWrapper = function(e) { e = CB_Device.Motion.cordova_getAccelerationNormalized(e); if (typeof(callbackOkOrId) === "function") { callbackOkOrId(e); } } //Normalizes the event.
			CB_Device.Motion.cordova_getAccelerationConstantly_lastId = navigator.accelerometer.watchAcceleration(callbackOkOrIdWrapper, callbackError, options);
			return CB_Device.Motion.cordova_getAccelerationConstantly_lastId;
		}
		//...otherwise, stops getting the acceleration constantly:
		else
		{
			//if (typeof(callbackOkOrId) === "undefined" || callbackOkOrId === null) { callbackOkOrId = CB_Device.Motion.cordova_getAccelerationConstantly_lastId; }
			if (isNaN(callbackOkOrId) || CB_trim(callbackOkOrId) === "") { callbackOkOrId = CB_Device.Motion.cordova_getAccelerationConstantly_lastId; }
			navigator.accelerometer.clearWatch(callbackOkOrId);
			return;
		}
		return false;
	}


	/**
	 * Stops getting the acceleration constantly at a regular interval. Uses the [Apache Cordova's Device Motion plugin]{@link https://github.com/apache/cordova-plugin-device-motion} ("navigator.accelerometer.clearWatch" function).
	 *  @function
	 *  @param {integer} [id={@link CB_Device.Motion.cordova_getAccelerationConstantly_lastId}] - The watch ID that we want to stop. Following the same rules as the first parameter of the "navigator.accelerometer.clearWatch" function described in {@link https://github.com/apache/cordova-plugin-device-motion}.
	 *  @returns {undefined|false} Returns false in the case that [Apache Cordova's Device Motion plugin]{@link https://github.com/apache/cordova-plugin-device-motion} is not supported or undefined otherwise.
	 *  @todo Add parameters to keep old callbacks and options.
	 */
	CB_Device.Motion.cordova_getAccelerationConstantlyDisable = function(id)
	{
		if (typeof(id) === "function") { id = undefined; } //Prevents calling CB_Device.Motion.cordova_getAccelerationConstantly with a function as parameter since that is for starting the watcher.
		return CB_Device.Motion.cordova_getAccelerationConstantly(id);
	}
	
	
	/**
	 * Normalizes the data gotten from the [Apache Cordova's Device Motion plugin]{@link https://github.com/apache/cordova-plugin-device-motion} to try to match the [Device Motion Event]{@link https://developer.mozilla.org/docs/Web/API/DeviceMotionEvent} and follow always the same rules as much as possible.
	 *  @function
	 *  @param {Object} accelerometerData - The acceleration object that we want to normalize.
	 *  @returns {Event} Returns the given acceleration object again but normalized (if possible).
	 *  @todo Normalize the values without gravity too (accelerometerData.acceleration.x, accelerometerData.acceleration.y, accelerometerData.acceleration.z) if possible (needs gyroscope probably) and maybe more properties.
	 */
	CB_Device.Motion.cordova_getAccelerationNormalized = function(accelerometerData)
	{
		if (typeof(accelerometerData) !== "undefined" && accelerometerData !== null)
		{
			if (typeof(accelerometerData.accelerationIncludingGravity) === "undefined" || accelerometerData.accelerationIncludingGravity === null)
			{
				accelerometerData.accelerationIncludingGravity = {};
				if (typeof(accelerometerData.x) !== "undefined") { accelerometerData.accelerationIncludingGravity.x = accelerometerData.x; }
				if (typeof(accelerometerData.y) !== "undefined") { accelerometerData.accelerationIncludingGravity.y = accelerometerData.y; }
				if (typeof(accelerometerData.z) !== "undefined") { accelerometerData.accelerationIncludingGravity.z = accelerometerData.z; }
			}
			//TODO: normalize the values without gravity too (accelerometerData.acceleration.x, accelerometerData.acceleration.y, accelerometerData.acceleration.z) if possible (needs gyroscope probably) and maybe more properties.
		}
		return accelerometerData;
	}

} //End of the static class CB_Device.Motion.


/**
 * Static class to manage the device's battery. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Normalize more differences between web clients.
 */
CB_Device.Battery = function() { return CB_Device.Battery; };
{
	CB_Device.Battery._cordova_level = null; //Keeps the battery level for Apache Cordova.
	CB_Device.Battery._cordova_isPlugged = null; //Keeps whether the device is plugged in or not for Apache Cordova.

	
	//Initializes all values:
	CB_Device.Battery.init = function()
	{
		//Adds the event listener to let Apache Cordova get the battery level:
		CB_Events.add(window, "batterystatus", function(batteryStatus) { CB_Device.Battery._cordova_level = batteryStatus.level; CB_Device.Battery._cordova_isPlugged = batteryStatus.isPlugged; }, true, true, false);
	}
	
	
	/**
	 * Tells whether the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) is available or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.Battery.isSupported = function()
	{
		return !!(window.navigator && (typeof(navigator.getBattery) === "function" || navigator.battery || navigator.webkitBattery || navigator.mozBattery || navigator.msBattery));
	}
	

	/**
	 * Gets the battery object ([BatteryManager]{@link https://developer.mozilla.org/docs/Web/API/BatteryManager}) using the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) if available or falling back to [Apache Cordova's Battery Status plugin]{@link https://github.com/apache/cordova-plugin-battery-status} emulating the object if possible or a fake object otherwise. It could be synchronous or asynchronous depending on the client.
	   <br />
	   When the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) is not available, the generated object will always contain null values for the "onchargingchange", "onchargingtimechage", "ondischargingtimechange" and "onlevelchange" properties. The "charging" and "level" properties will be tried to be calculated by using [Apache Cordova's Battery Status plugin]{@link https://github.com/apache/cordova-plugin-battery-status} if possible.
	   <br />
	   The return will be synchronous only when [getBattery]{@link https://developer.mozilla.org/docs/Web/API/Navigator/getBattery} function is not available. The best practice is to ignore the immediate return value and just trust the first parameter passed to the "callbackOk" function once it is called, since this one will be the final battery object (real or fake).
	 *  @function
	 *  @param {function} [callbackOk] - The callback function that will be called once the final battery object (real or fake one) is gotten (passed as the first and unique parameter). Highly recommended since it is the unique way to always get the final battery object (due the fact that some clients will execute the function asynchronously).
	 *  @param {boolean} [chargingOnFail] - Desired value for the "charging" property of the fake battery object when neither the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) nor [Apache Cordova's Battery Status plugin]{@link https://github.com/apache/cordova-plugin-battery-status} are available. It should follow the same rules as the real property of the [BatteryManager]{@link https://developer.mozilla.org/docs/Web/API/BatteryManager} object.
	 *  @param {float} [levelOnFail] - Desired value for the "level" property of the fake battery object when neither the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) nor [Apache Cordova's Battery Status plugin]{@link https://github.com/apache/cordova-plugin-battery-status} are available. It should follow the same rules as the real property of the [BatteryManager]{@link https://developer.mozilla.org/docs/Web/API/BatteryManager} object.
	 *  @param {integer} [chargingTimeOnFail] - Desired value for the "chargingTime" property of the fake battery object when the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) is not available. It should follow the same rules as the real property of the [BatteryManager]{@link https://developer.mozilla.org/docs/Web/API/BatteryManager} object.
	 *  @param {integer} [dischargingTimeOnFail] - Desired value for the "dischargingTime" property of the fake battery object when the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) is not available. It should follow the same rules as the real property of the [BatteryManager]{@link https://developer.mozilla.org/docs/Web/API/BatteryManager} object.
	 *  @returns {Object|Promise} Returns the battery object (fake or real) synchronously only when the native [getBattery]{@link https://developer.mozilla.org/docs/Web/API/Navigator/getBattery} function is not available. Otherwise it returns a [Promise]{@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise} (the result of calling [navigator.getBattery()]{@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery}.then(callbackOk)). It is highly recommended to ignore this returned value.
	 */
	CB_Device.Battery.get = function(callbackOk, chargingOnFail, levelOnFail, chargingTimeOnFail, dischargingTimeOnFail)
	{
		var batteryObject = null;
		if (window.navigator)
		{
			if (typeof(navigator.getBattery) === "function") { return navigator.getBattery().then(callbackOk); }
			else if (typeof(navigator.battery) !== "undefined") { batteryObject = navigator.battery; }
			else if (typeof(navigator.webkitBattery) !== "undefined") { batteryObject = navigator.webkitBattery; }
			else if (typeof(navigator.mozBattery) !== "undefined") { batteryObject = navigator.mozBattery; }
			else if (typeof(navigator.msBattery) !== "undefined") { batteryObject = navigator.msBattery; }
		}
		if (typeof(batteryObject) === "undefined" || batteryObject === null)
		{
			batteryObject =
				{
					"charging" : typeof(CB_Device.Battery._cordova_isPlugged) !== "undefined" && CB_Device.Battery._cordova_isPlugged !== null ? CB_Device.Battery._cordova_isPlugged : chargingOnFail,
					"level" :  typeof(CB_Device.Battery._cordova_level) !== "undefined" && CB_Device.Battery._cordova_level !== null && !isNaN(CB_Device.Battery._cordova_level) ? CB_Device.Battery._cordova_level / 100 : levelOnFail,
					"chargingTime" : chargingTimeOnFail,
					"dischargingTime" : dischargingTimeOnFail,
					"onchargingchange" : null,
					"onchargingtimechage" : null,
					"ondischargingtimechange" : null,
					"onlevelchange" : null
				};
		}
		if (typeof(callbackOk) === "function") { callbackOk(batteryObject); }
		return batteryObject;
	}
	
	
	/**
	 * Returns whether the battery is charging or not. Using the {@link CB_Device.Battery.get} function internally. It could be synchronous or asynchronous depending on the client.
	   <br />
	   The return will be synchronous only sometimes (when it is asynchronous it will just return a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}), following the same rules as the {@link CB_Device.Battery.get} function which is called internally. The best practice is to ignore the immediate return value and just trust the first parameter passed to the "callbackOk" function once it is called, since this one will be the final value that we want to get (real or fake).
	 *  @function
	 *  @param {function} [callbackOk] - The callback function that will be called once the final value (real or fake one) is gotten (passed as the first and unique parameter). Highly recommended since it is the unique way to always get the final value (due the fact that some clients will execute the function asynchronously).
	 *  @param {boolean} [valueOnFail] - Desired value to use when it fails getting the real one. It should follow the same rules as the real "charging" property of the [BatteryManager]{@link https://developer.mozilla.org/docs/Web/API/BatteryManager} object.
	 *  @returns {boolean|Promise} Returns the desired value only when the function is executed synchronously (following the same rules as the {@link CB_Device.Battery.get} function which is called internally). It is highly recommended to ignore this returned value.
	 */
	CB_Device.Battery.isCharging = function(callbackOk, valueOnFail)
	{
		var objectOrPromise = CB_Device.Battery.get(function(batteryObject) { if (typeof(callbackOk) === "function") { callbackOk(batteryObject.charging); } }, valueOnFail);
		if (typeof(objectOrPromise) !== "undefined" && objectOrPromise !== null && typeof(objectOrPromise.charging) !== "undefined") { return objectOrPromise.charging; }
		return objectOrPromise;
	}


	/**
	 * Returns tha current charging level of the battery. Using the {@link CB_Device.Battery.get} function internally. It could be synchronous or asynchronous depending on the client.
	   <br />
	   The return will be synchronous only sometimes (when it is asynchronous it will just return a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}), following the same rules as the {@link CB_Device.Battery.get} function which is called internally. The best practice is to ignore the immediate return value and just trust the first parameter passed to the "callbackOk" function once it is called, since this one will be the final value that we want to get (real or fake).
	 *  @function
	 *  @param {function} [callbackOk] - The callback function that will be called once the final value (real or fake one) is gotten (passed as the first and unique parameter). Highly recommended since it is the unique way to always get the final value (due the fact that some clients will execute the function asynchronously).
	 *  @param {float} [valueOnFail] - Desired value to use when it fails getting the real one. It should follow the same rules as the real "level" property of the [BatteryManager]{@link https://developer.mozilla.org/docs/Web/API/BatteryManager} object.
	 *  @returns {float|Promise} Returns the desired value only when the function is executed synchronously (following the same rules as the {@link CB_Device.Battery.get} function which is called internally). It is highly recommended to ignore this returned value.
	 */
	CB_Device.Battery.getLevel = function(callbackOk, valueOnFail)
	{
		var objectOrPromise = CB_Device.Battery.get(function(batteryObject) { if (typeof(callbackOk) === "function") { callbackOk(batteryObject.level); } }, undefined, valueOnFail).level;
		if (typeof(objectOrPromise) !== "undefined" && objectOrPromise !== null && typeof(objectOrPromise.level) !== "undefined") { return objectOrPromise.level; }
		return objectOrPromise;
	}


	/**
	 * Returns the time (in seconds) that the battery needs to be completely charged. Using the {@link CB_Device.Battery.get} function internally. It could be synchronous or asynchronous depending on the client.
	   <br />
	   The return will be synchronous only sometimes (when it is asynchronous it will just return a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}), following the same rules as the {@link CB_Device.Battery.get} function which is called internally. The best practice is to ignore the immediate return value and just trust the first parameter passed to the "callbackOk" function once it is called, since this one will be the final value that we want to get (real or fake).
	 *  @function
	 *  @param {function} [callbackOk] - The callback function that will be called once the final value (real or fake one) is gotten (passed as the first and unique parameter). Highly recommended since it is the unique way to always get the final value (due the fact that some clients will execute the function asynchronously).
	 *  @param {integer} [valueOnFail] - Desired value to use when it fails getting the real one. It should follow the same rules as the real "chargingTime" property of the [BatteryManager]{@link https://developer.mozilla.org/docs/Web/API/BatteryManager} object.
	 *  @returns {integer|Promise} Returns the desired value only when the function is executed synchronously (following the same rules as the {@link CB_Device.Battery.get} function which is called internally). It is highly recommended to ignore this returned value.
	 */
	CB_Device.Battery.getChargingTime = function(callbackOk, valueOnFail)
	{
		var objectOrPromise = CB_Device.Battery.get(function(batteryObject) { if (typeof(callbackOk) === "function") { callbackOk(batteryObject.chargingTime); } }, undefined, undefined, valueOnFail).chargingTime;
		if (typeof(objectOrPromise) !== "undefined" && objectOrPromise !== null && typeof(objectOrPromise.chargingTime) !== "undefined") { return objectOrPromise.chargingTime; }
		return objectOrPromise;
	}


	/**
	 * Returns the time (in seconds) that the battery needs to be completely discharged (or when the device will shutdown, depending on the client). Using the {@link CB_Device.Battery.get} function internally. It could be synchronous or asynchronous depending on the client.
	   <br />
	   The return will be synchronous only sometimes (when it is asynchronous it will just return a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}), following the same rules as the {@link CB_Device.Battery.get} function which is called internally. The best practice is to ignore the immediate return value and just trust the first parameter passed to the "callbackOk" function once it is called, since this one will be the final value that we want to get (real or fake).
	 *  @function
	 *  @param {function} [callbackOk] - The callback function that will be called once the final value (real or fake one) is gotten (passed as the first and unique parameter). Highly recommended since it is the unique way to always get the final value (due the fact that some clients will execute the function asynchronously).
	 *  @param {integer} [valueOnFail] - Desired value to use when it fails getting the real one. It should follow the same rules as the real "dischargingTime" property of the [BatteryManager]{@link https://developer.mozilla.org/docs/Web/API/BatteryManager} object.
	 *  @returns {integer|Promise} Returns the desired value only when the function is executed synchronously (following the same rules as the {@link CB_Device.Battery.get} function which is called internally). It is highly recommended to ignore this returned value.
	 */
	CB_Device.Battery.getDischargingTime = function(callbackOk, valueOnFail)
	{
		var objectOrPromise = CB_Device.Battery.get(function(batteryObject) { if (typeof(callbackOk) === "function") { callbackOk(batteryObject.dischargingTime); } }, undefined, undefined, undefined, valueOnFail).dischargingTime;
		if (typeof(objectOrPromise) !== "undefined" && objectOrPromise !== null && typeof(objectOrPromise.dischargingTime) !== "undefined") { return objectOrPromise.dischargingTime; }
		return objectOrPromise;
	}
	
  
	/**
	 * Sets a function to execute when the "onchargingchange" event of the battery is fired or removes it. This should happen whenever the charging status changes (is charging now but before it was not or vice versa). Using the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one).
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. Following the same rules as in {@link https://developer.mozilla.org/docs/Web/Events/chargingchange}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @returns {undefined|false|Promise} Returns false when the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) is not available. Returns a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} when the native [getBattery]{@link https://developer.mozilla.org/docs/Web/API/Navigator/getBattery} function is available. Otherwise, it returns undefined.
	 */
	CB_Device.Battery.onChargingChange = function(eventFunction, keepOldFunction, useCapture)
	{
		return CB_Device.Battery._setEvent("chargingchange", eventFunction, keepOldFunction, useCapture)
	}

	
	/**
	 * Sets a function to execute when the "onchargingtimechage" event of the battery is fired or removes it. This should happen whenever the charging time changes. Using the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one).
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. Following the same rules as in {@link https://developer.mozilla.org/docs/Web/Events/chargingtimechange}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @returns {undefined|false|Promise} Returns false when the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) is not available. Returns a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} when the native [getBattery]{@link https://developer.mozilla.org/docs/Web/API/Navigator/getBattery} function is available. Otherwise, it returns undefined.
	 */
	CB_Device.Battery.onChargingTimeChange = function(eventFunction, keepOldFunction, useCapture)
	{
		return CB_Device.Battery._setEvent("chargingtimechage", eventFunction, keepOldFunction, useCapture)
	}
	
	
	/**
	 * Sets a function to execute when the "ondischargingtimechange" event of the battery is fired or removes it. This should happen whenever the discharging time changes. Using the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one).
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. Following the same rules as in {@link https://developer.mozilla.org/docs/Web/Events/dischargingtimechange}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @returns {undefined|false|Promise} Returns false when the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) is not available. Returns a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} when the native [getBattery]{@link https://developer.mozilla.org/docs/Web/API/Navigator/getBattery} function is available. Otherwise, it returns undefined.
	 */
	CB_Device.Battery.onDischargingTimeChange = function(eventFunction, keepOldFunction, useCapture)
	{
		return CB_Device.Battery._setEvent("dischargingtimechange", eventFunction, keepOldFunction, useCapture)
	}

	
	/**
	 * Sets a function to execute when the "onlevelchange" event of the battery is fired or removes it. This should happen when the battery level changes. Using the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one).
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. Following the same rules as in {@link https://developer.mozilla.org/docs/Web/Events/levelchange}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @returns {undefined|false|Promise} Returns false when the [Battery Status API]{@link https://developer.mozilla.org/docs/Web/API/Battery_Status_API} (or compatible one) is not available. Returns a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} when the native [getBattery]{@link https://developer.mozilla.org/docs/Web/API/Navigator/getBattery} function is available. Otherwise, it returns undefined.
	 */
	CB_Device.Battery.onLevelChange = function(eventFunction, keepOldFunction, useCapture)
	{
		return CB_Device.Battery._setEvent("levelchange", eventFunction, keepOldFunction, useCapture)
	}

	
	//Sets an event for the Battery Status API (Battery API):
	CB_Device.Battery._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture)
	{
		if (!CB_Device.Battery.isSupported()) { return false; }
		if (window.navigator && typeof(navigator.getBattery) === "function")
		{
			return navigator.getBattery().then
			(
				function(batteryObject)
				{
					CB_Device._setEvent
					(
						eventName,
						function(e) { if (typeof(eventFunction) === "function") { eventFunction(batteryObject, eventName, e); } },
						keepOldFunction,
						useCapture,
						batteryObject
					);
				}
			);
		}
		var eventFunctionWrapper = eventFunction;
		if (typeof(eventFunction) === "function") 
		{
			eventFunctionWrapper = function(e) { eventFunction(CB_Device.Battery.get(), eventName, e); };
		}
		return CB_Device._setEvent(eventName, eventFunctionWrapper, keepOldFunction, useCapture, navigator.battery || navigator.webkitBattery || navigator.mozBattery || navigator.msBattery);
	}
	

	/**
	 * Sets a function to execute when the "batterystatus" event of the battery is fired or removes it. Using the [Apache Cordova's Battery Status plugin]{@link https://github.com/apache/cordova-plugin-battery-status}.
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. Following the same rules as in {@link https://github.com/apache/cordova-plugin-battery-status}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 */
	CB_Device.Battery.cordova_onChange = function(eventFunction, keepOldFunction, useCapture)
	{
		return CB_Device._setEvent("batterystatus", eventFunction, keepOldFunction, useCapture, window);
	}

	
	/**
	 * Sets a function to execute when the "batterylow" event of the battery is fired or removes it. Using the [Apache Cordova's Battery Status plugin]{@link https://github.com/apache/cordova-plugin-battery-status}.
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. Following the same rules as in {@link https://github.com/apache/cordova-plugin-battery-status}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 */
	CB_Device.Battery.cordova_onLow = function(eventFunction, keepOldFunction, useCapture)
	{
		return CB_Device._setEvent("batterylow", eventFunction, keepOldFunction, useCapture, window);
	}

	
	/**
	 * Sets a function to execute when the "batterycritical" event of the battery is fired or removes it. Using the [Apache Cordova's Battery Status plugin]{@link https://github.com/apache/cordova-plugin-battery-status}.
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. Following the same rules as in {@link https://github.com/apache/cordova-plugin-battery-status}. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 */
	CB_Device.Battery.cordova_onCritical = function(eventFunction, keepOldFunction, useCapture)
	{
		return CB_Device._setEvent("batterycritical", eventFunction, keepOldFunction, useCapture, window);
	}

} //End of the static class CB_Device.Battery.


/**
 * Static class to manage the device's vibration. It will return itself if it is tried to be instantiated.
 * @namespace
 */
CB_Device.Vibration = function() { return CB_Device.Vibration; };
{
	/**
	 * Tells whether the [Vibration API]{@link https://developer.mozilla.org/docs/Web/API/Vibration_API} (or compatible one as [Apache Cordova's Vibration plugin]{@link https://github.com/apache/cordova-plugin-vibration}) is available or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.Vibration.isSupported = function()
	{
		return (window.navigator && "vibrate" in navigator && typeof(navigator.vibrate) === "function");
	}
	
	
	/**
	 * Makes the device vibrate using the [Vibration API]{@link https://developer.mozilla.org/docs/Web/API/Vibration_API} (or compatible one as [Apache Cordova's Vibration plugin]{@link https://github.com/apache/cordova-plugin-vibration}).
	 *  @function
	 *  @param {integer|array} [vibration] - The vibration pattern which can be either a single integer value or an array of integers. Following the same rules as the first parameter of the native [vibrate]{@link https://developer.mozilla.org/docs/Web/API/Navigator/vibrate} function.
	 *  @returns {undefined|false} Returns false in the case that [Vibration API]{@link https://developer.mozilla.org/docs/Web/API/Vibration_API} (or compatible one as [Apache Cordova's Vibration plugin]{@link https://github.com/apache/cordova-plugin-vibration}) cannot be used or undefined otherwise.
	 */
	CB_Device.Vibration.start = function(vibration)
	{
		navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
		if (navigator.vibrate)
		{
			return navigator.vibrate(vibration);
		}
		return false;
	}
	
	
	/**
	 * Makes the device stop vibrating using the [Vibration API]{@link https://developer.mozilla.org/docs/Web/API/Vibration_API} (or compatible one as [Apache Cordova's Vibration plugin]{@link https://github.com/apache/cordova-plugin-vibration}).
	 *  @function
	 *  @returns {undefined|false} Returns false in the case that [Vibration API]{@link https://developer.mozilla.org/docs/Web/API/Vibration_API} (or compatible one as [Apache Cordova's Vibration plugin]{@link https://github.com/apache/cordova-plugin-vibration}) cannot be used or undefined otherwise.
	 */
	CB_Device.Vibration.stop = function()
	{
		return CB_Device.Vibration.start(0);
	}

} //End of the static class CB_Device.Vibration.



/**
 * Static class to manage the device's ambient light sensor. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Normalize more differences between web clients.
 */
CB_Device.AmbientLight = function() { return CB_Device.AmbientLight; };
{
	/**
	 * Tells whether the [Ambient Light Sensor API]{@link https://w3.org/TR/ambient-light/} or the [Ambient Light Sensor Events ("ondevicelight")]{@link https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Events} or ["onlightlevel" event]{@link https://modernweb.com/introduction-to-the-ambient-light-api/} are supported or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.AmbientLight.isSupported = function()
	{
		return (typeof(AmbientLightSensor) !== "undefined" || "ondevicelight" in window || "onlightlevel" in window);
	}

	
	/**
	 * Sets the event to get the ambient light or removes it. Uses the [Ambient Light Sensor API]{@link https://w3.org/TR/ambient-light/} or the [Ambient Light Sensor Events ("ondevicelight")]{@link https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Events} or ["onlightlevel" event]{@link https://modernweb.com/introduction-to-the-ambient-light-api/}.
		<br/>
		The given "eventFunction" will receive the event object as the first parameter but this event object will vary depending on the way to get the ambient light which is supported by the client (if any):
		<br />
		First choice, if available, uses the [Ambient Light Sensor API]{@link https://w3.org/TR/ambient-light/} and "event.value" will contain the units in lux.
		<br />
		Second choice, if available, uses the [Ambient Light Sensor Events ("ondevicelight")]{@link https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Events} and "event.value" will contain the units in lux.
		<br />
		Third choice, if available, uses the ["onlightlevel" event]{@link https://modernweb.com/introduction-to-the-ambient-light-api/} and "event.value" will be "" (an empty string), "dim", "normal" or "bright" instead of a number.
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. The event object received will already be normalized by the {@link CB_Device.AmbientLight.normalizeEvent} function automatically. Despite of this, due to the big differences between different clients, the event object received as the first parameter will vary depending on the way to get the ambient light which is supported by the client (if any). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {function} [callbackError] - Callback that will be called if there is any error getting the ambient light. Only used by the [Ambient Light Sensor API]{@link https://w3.org/TR/ambient-light/} (if available).
	 *  @returns {undefined|false} Returns false in the case that no way to get the ambient light is available or undefined otherwise.
	 */
    CB_Device.AmbientLight.get = function(eventFunction, keepOldFunction, useCapture, callbackError)
	{
		if (typeof(AmbientLightSensor) !== "undefined")
		{
			var sensor = new AmbientLightSensor();
			sensor.start();
			sensor.onerror = callbackError;
			//if ("onchange" in sensor) { return CB_Device.AmbientLight._setEvent("change", function(e) { if (typeof(eventFunction) === "function") { e.value = event.reading && typeof(event.reading.illuminance) !== "undefined" ? event.reading.illuminance : e.value; eventFunction.call(sensor, e); } }, keepOldFunction, useCapture, sensor); } //event.reading.illuminance will contain the units in lux.
			//else { return CB_Device.AmbientLight._setEvent("reading", function(e) { if (typeof(eventFunction) === "function") { e.value = sensor ? sensor.illuminance : e.value; eventFunction.call(sensor, e); } }, keepOldFunction, useCapture, sensor); } //sensor.illuminance will contain the units in lux.
			if ("onchange" in sensor) { return CB_Device.AmbientLight._setEvent("change", eventFunction, keepOldFunction, useCapture, sensor, sensor); } //event.reading.illuminance will contain the units in lux.
			else { return CB_Device.AmbientLight._setEvent("reading", eventFunction, keepOldFunction, useCapture, sensor, sensor); } //sensor.illuminance will contain the units in lux.
		}
		else if ("ondevicelight" in window)
		{
			return CB_Device.AmbientLight._setEvent("devicelight", eventFunction, keepOldFunction, useCapture, window); //event.value will contain the units in lux.
		}
		else if ("onlightlevel" in window)
		{
			return CB_Device.AmbientLight._setEvent("lightlevel", eventFunction, keepOldFunction, useCapture, window); //event.value will be "" (an empty string), "dim", "normal" or "bright" instead of a number!
		}
		
		//if (typeof(callbackError) === "function") { callbackError(); }
		return false;
	}
	
	
	//Sets a function to execute when a desired event is fired:
	CB_Device.AmbientLight._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture, target, sensor)
	{
		var wrapperFunction = eventFunction;
		if (typeof(eventFunction) === "function")
		{
			wrapperFunction = function(e)
			{
				e = CB_Device.AmbientLight.normalizeEvent(e, eventName, sensor);
				return eventFunction(e);
			};
		}
		CB_Device._setEvent(eventName, wrapperFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Normalizes the data gotten from the the [Ambient Light Sensor API]{@link https://w3.org/TR/ambient-light/} or the [Ambient Light Sensor Events ("ondevicelight")]{@link https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Events} or ["onlightlevel" event]{@link https://modernweb.com/introduction-to-the-ambient-light-api/} to try to match the [Ambient Light Sensor API]{@link https://w3.org/TR/ambient-light/} and follow always the same rules as much as possible.
	 *  @function
	 *  @param {Event} e - The event object that we want to normalize.
	 *  @param {('change'|'reading'|'devicelight'|'lightlevel')} eventName - The name of the event that we want to normalize. Case sensitive.
	 *  @param {AmbientLightSensor} [sensor] - [AmbientLightSensor]{@link https://w3.org/TR/ambient-light/#ambient-light-sensor-interface} object used by the [Ambient Light Sensor API]{@link https://w3.org/TR/ambient-light/}.
  	 *  @returns {Event} Returns the given event object again but normalized (if possible).
	 *  @todo Normalize more differences between web clients.
	 */
	CB_Device.AmbientLight.normalizeEvent = function(e, eventName, sensor)
	{
		e = CB_Events.normalize(e);
		//Normalizes ambient light sensor data:
		/*
		if (typeof(AmbientLightSensor) !== "undefined" && e && e.reading && typeof(e.reading.illuminance) !== "undefined")
		{
			if (typeof(e.value) === "undefined" || e.value === null)
			{
				e.value = e.reading.illuminance;
			}
		}
		*/
		if (typeof(AmbientLightSensor) !== "undefined" && typeof(sensor) !== "undefined" && sensor !== null)
		{
			if (eventName === "change")
			{
				//e.value = (event.reading && typeof(event.reading.illuminance) !== "undefined") ? event.reading.illuminance : e.value; //event.reading.illuminance will contain the units in lux.
				e.value = (e.reading && typeof(e.reading.illuminance) !== "undefined") ? e.reading.illuminance : e.value; //e.reading.illuminance will contain the units in lux.
			}
			else if (eventName === "reading")
			{
				e.value = sensor ? sensor.illuminance : e.value; //sensor.illuminance will contain the units in lux.
			}
		}
		return e;
	}


} //End of the static class CB_Device.AmbientLight.


/**
 * Static class to manage the device's proximity sensor. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Normalize more differences between web clients.
 */
CB_Device.Proximity = function() { return CB_Device.Proximity; };
{
	/**
	 * Tells whether the [Proximity Sensor API]{@link https://w3.org/TR/proximity/} or the Proximity Sensor Events as ["ondeviceproximity"]{@link https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Events} or ["onuserproximity"]{@link https://developer.mozilla.org/en-US/docs/Web/API/UserProximityEvent} are supported or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Device.Proximity.isSupported = function()
	{
		return (typeof(ProximitySensor) !== "undefined" || "ondeviceproximity" in window || "onuserproximity" in window);
	}

	
	/**
	 * Sets the event to get the proximity or removes it. Uses the [Proximity Sensor API]{@link https://w3.org/TR/proximity/} or the Proximity Sensor Events as ["ondeviceproximity"]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/ondeviceproximity} or ["onuserproximity"]{@link https://developer.mozilla.org/en-US/docs/Web/API/UserProximityEvent}.
		<br/>
		The given "eventFunction" will receive the event object as the first parameter but this event object will vary depending on the way to get the proximity which is supported by the client (if any) and the "detectNear" parameter. It will use the following logic order:
		<br />
		If "detectNear" is not set to true, [Proximity Sensor API]{@link https://w3.org/TR/proximity/} is used as the first option (if available) and "event.value" will contain the units in centimeters (depending on the implementation, "event.near" will also be present, containing a boolean depending on whether an object is near or not).
		<br />
		If "detectNear" is not set to true, [Proximity Sensor Events ("ondeviceproximity")]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/ondeviceproximity} is used as the second option (if available) and "event.value" will contain the units in centimeters.
		<br />
		If "detectNear" is set to true, ["onuserproximity" event]{@link https://developer.mozilla.org/en-US/docs/Web/API/UserProximityEvent} is the unique option used (if available) and "event.near" will be a boolean which tell us whether something is near or not.
	 *  @function
	 *  @param {function|null} eventFunction - The function that will be called when the event is fired. The event object received will already be normalized by the {@link CB_Device.Proximity.normalizeEvent} function automatically. Despite of this, due to the big differences between different clients, the event object received as the first parameter will vary depending on the way to get the proximity which is supported by the client (if any). If a null value is used, the event will be removed.
	 *  @param {boolean} [detectNear=false] - Defines whether we want to detect when a physical object is nearby. If it is set to true, it will use the ["onuserproximity" event]{@link https://developer.mozilla.org/en-US/docs/Web/API/UserProximityEvent}.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
	 *  @param {float} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {function} [callbackError] - Callback that will be called if there is any error getting the proximity. Only used by the [Proximity Sensor API]{@link https://w3.org/TR/proximity/} (if available).
	 *  @returns {undefined|false} Returns false in the case that no way to get the proximity is available or undefined otherwise.
	 */
	CB_Device.Proximity.get = function(eventFunction, detectNear, keepOldFunction, useCapture, callbackError)
	{
		if (!detectNear)
		{
			if (typeof(ProximitySensor) !== "undefined")
			{
				var sensor = new ProximitySensor();
				sensor.start();
				sensor.onerror = callbackError;
				//if ("onchange" in sensor) { return CB_Device._setEvent("change", function(e) { if (typeof(eventFunction) === "function") { e.value = event.reading && typeof(event.reading.distance) !== "undefined" ? event.reading.distance : e.value; eventFunction.call(sensor, e); } }, keepOldFunction, useCapture, sensor); } //event.reading.distance will contain the units in centimeters.
				//else { return CB_Device._setEvent("reading", function(e) { if (typeof(eventFunction) === "function") { e.value = sensor ? sensor.distance : e.value; e.near = sensor ? sensor.near : e.near; eventFunction.call(sensor, e); } }, keepOldFunction, useCapture, sensor); } //sensor.distance will contain the units in centimeters and sensor.near will be a boolean telling whether an object is near or not.
				if ("onchange" in sensor) { return CB_Device.Proximity._setEvent("change", eventFunction, keepOldFunction, useCapture, sensor, sensor); } //event.reading.distance will contain the units in centimeters.
				else { return CB_Device.Proximity._setEvent("reading", eventFunction, keepOldFunction, useCapture, sensor, sensor); } //sensor.distance will contain the units in centimeters and sensor.near will be a boolean telling whether an object is near or not.
			}
			else if ("ondeviceproximity" in window)
			{
				return CB_Device.Proximity._setEvent("deviceproximity", eventFunction, keepOldFunction, useCapture, window); //event.value will contain the units in centimeters.
			}
		}
		else
		{
			if ("onuserproximity" in window)
			{
				return CB_Device.Proximity._setEvent("userproximity", eventFunction, keepOldFunction, useCapture, window); //event.near will be received (boolean).
			}
		}
		
		//if (typeof(callbackError) === "function") { callbackError(); }
		return false;
	}
	
	
	//Sets a function to execute when a desired event is fired:
	CB_Device.Proximity._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture, target, sensor)
	{
		var wrapperFunction = eventFunction;
		if (typeof(eventFunction) === "function")
		{
			wrapperFunction = function(e)
			{
				e = CB_Device.Proximity.normalizeEvent(e, eventName, sensor);
				return eventFunction(e);
			};
		}
		CB_Device._setEvent(eventName, wrapperFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Normalizes the data gotten from the the [Proximity Sensor API]{@link https://w3.org/TR/proximity/} or the Proximity Sensor Events as ["ondeviceproximity"]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/ondeviceproximity} or ["onuserproximity"]{@link https://developer.mozilla.org/en-US/docs/Web/API/UserProximityEvent} to try to match the [Proximity Sensor API]{@link https://w3.org/TR/proximity/} and follow always the same rules as much as possible.
	 *  @function
	 *  @param {Event} e - The event object that we want to normalize.
	 *  @param {('change'|'reading'|'deviceproximity'|'userproximity')} eventName - The name of the event that we want to normalize. Case sensitive.
	 *  @param {ProximitySensor} [sensor] - [ProximitySensor]{@link https://w3.org/TR/proximity/#proximity-sensor-interface} object used by the [Proximity Sensor API]{@link https://w3.org/TR/proximity/}.
	 *  @returns {Event} Returns the given event object again but normalized (if possible).
	 *  @todo Normalize more differences between web clients.
	 */
	CB_Device.Proximity.normalizeEvent = function(e, eventName, sensor)
	{
		e = CB_Events.normalize(e);
		/*
		//Normalizes proximity sensor data:
		if (typeof(ProximitySensor) !== "undefined" && e && event.reading && typeof(event.reading.distance) !== "undefined")
		{
			if (typeof(e.value) === "undefined" || e.value === null)
			{
				e.value = event.reading.distance;
			}
		}
		*/
		if (typeof(ProximitySensor) !== "undefined" && typeof(sensor) !== "undefined" && sensor !== null)
		{
			if (eventName === "change")
			{
				//e.value = (event.reading && typeof(event.reading.distance) !== "undefined") ? event.reading.distance : e.value; //event.reading.distance will contain the units in centimeters.
				e.value = (e.reading && typeof(e.reading.distance) !== "undefined") ? e.reading.distance : e.value; //e.reading.distance will contain the units in centimeters.
			}
			else if (eventName === "reading")
			{
				e.value = sensor ? sensor.distance : e.value; //sensor.distance will contain the units in centimeters.
				e.near = sensor ? sensor.near : e.near; //sensor.near will be a boolean telling whether an object is near or not.
			}
		}
		
		return e;
	}


} //End of the static class CB_Device.Proximity.