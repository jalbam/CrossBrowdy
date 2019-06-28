/**
 * @file Pointer management. Contains the {@link CB_Pointer} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */


/**
 * Static class to manage the pointer, using the [Pointer API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events} if available and falling back to internal emulation otherwise. It will return itself if it is tried to be instantiated.
 * @namespace
 */
var CB_Pointer = function() { return CB_Pointer; };
{
	//Events to emulate Pointer API in web clients that do not support it:
	CB_Pointer._eventEquivalents =
	{
		//Note: "MSPointerHover", which was different from "MSPointerOver" (note the "H") is deprecated and it does not have any equivalent now.
		pointerdown			: { mouse: "mousedown",		touch: "touchstart",	IE : "MSPointerDown", 			touchFired: false },
		pointerup			: { mouse: "mouseup",		touch: "touchend",		IE : "MSPointerUp", 			touchFired: false },
		pointercancel		: { mouse: null,			touch: "touchcancel",	IE : "MSPointerCancel", 		touchFired: false },
		pointerenter		: { mouse: "mouseenter",	touch: null,			IE : "MSPointerEvent", 			touchFired: false },
		pointerleave		: { mouse: "mouseleave",	touch: null, 			IE : "MSPointerLeave", 			touchFired: false },
		pointerover			: { mouse: "mouseover",		touch: null, 			IE : "MSPointerOver", 			touchFired: false },
		pointerout			: { mouse: "mouseout",		touch: null, 			IE : "MSPointerOut", 			touchFired: false },
		pointermove			: { mouse: "mousemove",		touch: "touchmove", 	IE : "MSPointerMove", 			touchFired: false },
		gotpointercapture	: { mouse : null, 			touch: null,			IE : "MSGotPointerCapture", 	touchFired: false },
		lostpointercapture	: { mouse : null, 			touch: null,			IE : "MSLostPointerCapture",	touchFired: false }
	};

	CB_Pointer._POINTER_TYPE_TOUCH = "touch";
	CB_Pointer._POINTER_TYPE_MOUSE = "mouse";
	CB_Pointer._POINTER_TYPE_PEN = "pen";
	
	CB_Pointer.initialized = false; //It will tells whether the object has been initialized or not.
	
	
	//Initializes all values:
	CB_Pointer.init = function()
	{
		if (CB_Pointer.initialized) { return CB_Pointer; }

		//The object has been initialized:
		CB_Pointer.initialized = true;
		
		//Creates aliases for the lock functions:
		CB_Pointer.isLockSupported = CB_Mouse.isLockSupported;
		CB_Pointer.isLocked = CB_Mouse.isLocked;
		CB_Pointer.wasLocked = CB_Mouse.wasLocked;
		CB_Pointer.getLockElement = CB_Mouse.getLockElement;
		CB_Pointer.lock = CB_Mouse.lock;
		CB_Pointer.unlock = CB_Mouse.unlock;
		CB_Pointer.onLockChange = CB_Mouse.onLockChange;
		CB_Pointer.onLockError = CB_Mouse.onLockError;

		//Normalizes some properties (if possible):
		if (navigator && typeof(navigator.pointerEnabled) === "undefined")
		{
			if (navigator.msPointerEnabled)
			{
				navigator.pointerEnabled = true;
				navigator.maxTouchPoints = navigator.msMaxTouchPoints;
			}
			//else { navigator.maxTouchPoints = 1; } //Assumes it is just capable to perform one touch at the same time.
		}
		
		//TODO.
		
		return CB_Pointer;
	}
	
	
	/**
	 * Tries to return the given [pointer event]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent} with some properties normalized (since different clients can use different values) and perhaps some new properties added (in the case they were missing), when possible. The new attached methods and properties may include polyfills, etc. It also calls the {@link CB_Events.normalize} function internally. Some properties added or affected could be "POINTER_TYPE_TOUCH", "POINTER_TYPE_MOUSE", "POINTER_TYPE_PEN", "[pointerId]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId}", "[pointerType]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType}", "[pressure]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure}", "[tangentialPressure]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure}", "[tiltX]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX}", "[tiltY]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY}", "[width]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width}", "[height]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height}", "[currentTarget]{@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget}", "[isPrimary]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary}", "[twist]{@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist}", etc.
	 *  @function
	 *  @param {Event} e - Pointer event object. If not provided, it will use the value of "event", "window.event", "Event" or an empty object ("{}").
	 *  @returns {Event} Returns the pointer event object normalized.
	 *  @todo Think about using Object.defineProperty with "writable: true" as option to prevent some web clients problems that have read only properties.
	 *  @todo Maybe e.width and e.height should be both 1 as default (?).
	 */
	CB_Pointer.normalizeEvent = function(e)
	{
		e = CB_Events.normalize(e);

		//NOTE: Think about using Object.defineProperty with writable: true as option to prevent some web clients problems that have readonly properties.
		
		if (typeof(e.POINTER_TYPE_TOUCH) === "undefined") { e.POINTER_TYPE_TOUCH = CB_Pointer._POINTER_TYPE_TOUCH; }
		if (typeof(e.POINTER_TYPE_MOUSE) === "undefined") { e.POINTER_TYPE_MOUSE = CB_Pointer._POINTER_TYPE_MOUSE; }
		if (typeof(e.POINTER_TYPE_PEN) === "undefined") { e.POINTER_TYPE_PEN = CB_Pointer._POINTER_TYPE_PEN; }
		if (typeof(e.pointerType) === "undefined")
		{
			if (typeof(e.screenX) !== "undefined") { e.pointerType = e.POINTER_TYPE_TOUCH;	} //Touch events have screenX property and mouse ones do not (unless I am wrong!).
			else { e.pointerType = e.POINTER_TYPE_MOUSE; } //Assumed a mouse event.
		}
		if (typeof(e.pressure) === "undefined") { e.pressure = (typeof(e.force) !== "undefined" && e.force !== null) ? e.force : CB_Touch.DEFAULT_FORCE; }
		if (typeof(e.tangentialPressure) === "undefined") { e.tangentialPressure = 0; } //TODO: maybe it would be better to use e.pressure.
		if (typeof(e.twist) === "undefined") { e.twist = 0; }
		if (typeof(e.tiltX) === "undefined") { e.tiltX = 0; }
		if (typeof(e.tiltY) === "undefined") { e.tiltY = 0; }
		if (typeof(e.width) === "undefined") { e.width = 0; } //TODO: maybe e.width and e.height should be both 1 as default (?).
		if (typeof(e.height) === "undefined") { e.height = 0; }
		if (typeof(e.currentTarget) === "undefined") { e.currentTarget = e.target; }
		if (typeof(e.isPrimary) === "undefined") { e.isPrimary = true; }
		if (typeof(e.pointerId) === "undefined") { e.pointerId = 1; }
		
		return e;
	}

	
	/**
	 * Sets the desired value for the CSS' style [pointer-events]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events} property of a given element.
	 *  @function
	 *  @param {Element} element - Element whose CSS' style "[pointer-events]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events}" property we want to edit.
	 *  @param {string} value - CSS code for the CSS' style "[pointer-events]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events}" property.
	 *  @param {boolean} [important=false] - If set to true, it will add the " !important" text to the "[pointer-events]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events}" property.
	 */
	CB_Pointer.setPointerEventsProperty = function(element, value, important)
	{
		try
		{
			value = CB_trim(value);
			value = (important && value.toLowerCase().indexOf("!important") === -1) ? value + " !important" : value;
			element.style.pointerEvents = value;
		} catch (e) { CB_console("Cannot execute CB_Pointer.setPointerEventsProperty: " + e); }
	}
	
	
	/**
	 * Sets a function to execute when the "[onPointerDown]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointerdown}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onDown = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("pointerdown", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when the "[onPointerUp]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointerup}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onUp = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("pointerup", callbackFunction, keepOldFunction, useCapture, target);
	}

	
	/**
	 * Sets a function to execute when the "[onPointerCancel]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointercancel}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onCancel = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("pointercancel", callbackFunction, keepOldFunction, useCapture, target);
	}
	
	
	/**
	 * Sets a function to execute when the "[onPointerEnter]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointerenter}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onEnter = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("pointerenter", callbackFunction, keepOldFunction, useCapture, target);
	}
	

	/**
	 * Sets a function to execute when the "[onPointerLeave]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointerleave}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onLeave = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("pointerleave", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when the "[onPointerOver]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointerover}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onOver = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("pointerover", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when the "[onPointerOut]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointerout}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onOut = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("pointerout", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when the "[onPointerMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointermove}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onMove = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("pointermove", callbackFunction, keepOldFunction, useCapture, target);
	}

	
	/**
	 * Sets a function to execute when the "[onGotPointerCapture]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/ongotpointercapture}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onGotPointCapture = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("gotpointercapture", callbackFunction, keepOldFunction, useCapture, target);
	}
	

	/**
	 * Sets a function to execute when the "[onLostPointerCapture]{@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onlostpointercapture}" event is fired or removes it. More information: [Pointer events]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events}.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the event object (already normalized by the {@link CB_Pointer.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Pointer.onLostPointCapture = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Pointer._setEvent("lostpointercapture", callbackFunction, keepOldFunction, useCapture, target);
	}
	
	
	//Sets a function to execute when a pointer event happens:
	CB_Pointer._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture, target)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; } //If not set, it keeps old function by default.
		if (typeof(target) === "undefined" || target === null) { target = document; }
		
		eventName = eventName.toLowerCase();
		
		if (typeof(CB_Pointer._eventEquivalents[eventName]) === "undefined" || CB_Pointer._eventEquivalents[eventName] === null) { return false; }
		
		//If a function has been sent:
		if (typeof(eventFunction) === "function")
		{
			var oldEventName = null;
			var eventFunctionWrapper =
				function(e)
				{
					try
					{
						if (CB_trim(CB_Elements.getStyleProperty(target, "pointerEvents", true)).toLowerCase().indexOf("none") !== -1) { return; } //Exists if the pointerEvents is "none".
					} catch (e) {}
					e.usingEmulation = e.usingEmulation || false;
					e = CB_Pointer.normalizeEvent(e);
					
					e.typeReal = e.type;
					try { e.type = oldEventName || e.type; } catch (e) { }
					e.typeEmulated = oldEventName;
					
					if (typeof(eventFunction) === "function") { return eventFunction(e); }
					return true;
				};
			
			var newEventFunctionWrapper = null;
			
			//If the Pointer API is not supported:
			if (!navigator || !navigator.pointerEnabled || typeof(target.onpointerdown) === "undefined")
			{
				//If the Pointer API is supported with the MS prefix (IE) and an equivalent event has been found:
				if (navigator && navigator.msPointerEnabled && typeof(target.onmspointerdown) !== "undefined" && CB_Pointer._eventEquivalents[eventName].IE)
				{
					oldEventName = eventName;
					eventName = CB_Pointer._eventEquivalents[eventName].IE;
				}
				//...otherwise, uses emulation:
				else
				{
					//If the event can be emulated with a touch event:
					if (CB_Pointer._eventEquivalents[eventName].touch)
					{
						oldEventName = eventName;
						newEventFunctionWrapper =
							function(e)
							{
								CB_Pointer._eventEquivalents[eventName].touchFired = true; //Sets as already fired by a touch event.
								if (typeof(eventFunctionWrapper) === "function")
								{
									//Dispatches the event for each touch:
									e = CB_Touch.normalizeEvent(e);
									for (var x = 0; x < e.changedTouches.length; x++)
									{
										try
										{
											e.clientX = e.changedTouches[0].clientX;
											e.clientY = e.changedTouches[0].clientY;
											e.pageX = e.changedTouches[0].pageX;
											e.pageY = e.changedTouches[0].pageY;
											e.force = e.changedTouches[0].force;
											e.currentTarget = e.changedTouches[0].currentTarget;// || target;
											e.isPrimary = (x === 0); //Maybe this is not totally right! TODO: try to find out whether this is right or not.
											e.pointerId = (x + 1); //Because 0 is the id for the mouse.
											e.pointerType = CB_Pointer._POINTER_TYPE_TOUCH;
											e.usingEmulation = true;
											
											eventFunctionWrapper(e);
											
											//TODO: see whether is possible to calculate tiltX and tiltY with radiusX, radiusY and rotationAngle.
											//TODO: calculate e.offsetX and e.offsetY from touch events.
										} catch (e) {}
									}
								}
								return true;
							};
						//If able, adds the function given to the emulation event:
						CB_Events.add(target, CB_Pointer._eventEquivalents[eventName].touch, newEventFunctionWrapper, useCapture, keepOldFunction, true);
					}
					//If the event can be emulated with a mouse event:
					if (CB_Pointer._eventEquivalents[eventName].mouse)
					{
						oldEventName = eventName;
						newEventFunctionWrapper =
							function(e)
							{
								//If a touch event already fired, deletes the event and exits:
								if (CB_Pointer._eventEquivalents[eventName].touchFired)
								{
									//Only deletes it if the defined touch and mouse events are different:
									if (CB_Pointer._eventEquivalents[eventName].mouse !== CB_Pointer._eventEquivalents[eventName].touch) { CB_Events.removeByName(target, CB_Pointer._eventEquivalents[eventName].mouse); }
									return true;
								}
								e = CB_Mouse.normalizeEvent(e);
								e.pointerId = 0;
								e.isPrimary = true;
								e.currentTarget = e.currentTarget || target;
								e.pointerType = CB_Pointer._POINTER_TYPE_MOUSE;
								e.usingEmulation = true;
								if (typeof(eventFunctionWrapper) === "function") { return eventFunctionWrapper(e); }
								return true;
							};
						//If able, adds the function given to the emulation event:
						CB_Events.add(target, CB_Pointer._eventEquivalents[eventName].mouse, newEventFunctionWrapper, useCapture, keepOldFunction, true);
					}
				}
			}
			
			//If able, adds the function given to the event (only if no emulation event was defined before):
			if (typeof(newEventFunctionWrapper) !== "function")
			{
				CB_Events.add(target, eventName, eventFunctionWrapper, useCapture, keepOldFunction, true);
			}
		}
		//...but if the function given is null, it will cancel the event:
		else if (eventFunction === null)// && eventFunctionHolder !== null)
		{
			//If the Pointer API is not supported:
			if (!navigator || !navigator.pointerEnabled || typeof(target.onpointerdown) === "undefined")
			{
				//If the Pointer API is supported with the MS prefix (IE) and an equivalent event has been found:
				if (navigator && navigator.msPointerEnabled && typeof(target.onmspointerdown) !== "undefined" && CB_Pointer._eventEquivalents[eventName].IE)
				{
					CB_Events.removeByName(target, "MS" + CB_Pointer._eventEquivalents[eventName].IE);
				}
				//...otherwise, uses emulation:
				else
				{
					//If the event can be emulated with a touch event:
					if (CB_Pointer._eventEquivalents[eventName].touch)
					{
						CB_Events.removeByName(target, CB_Pointer._eventEquivalents[eventName].touch);
					}
					//If the event can be emulated with a mouse event:
					if (CB_Pointer._eventEquivalents[eventName].mouse)
					{
						CB_Events.removeByName(target, CB_Pointer._eventEquivalents[eventName].mouse);
					}
				}
			}
			CB_Events.removeByName(target, eventName);
		}
	}
	
}