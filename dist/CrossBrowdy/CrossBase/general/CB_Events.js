/**
 * @file Events management. Contains the {@link CB_Events} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */
 

/**
 * Static class to manage events. It will return itself if it is tried to be instantiated.
 * @namespace
 */
var CB_Events = function() { return CB_Events; };
{
	CB_Events.initialized = false; //It will tells whether the object has been initialized or not.
	
	CB_Events._stored = []; //Array that stores the events (so we could delete all from one type if we wanted).

	
	//Initializes all values:
	CB_Events.init = function()
	{
		if (CB_Events.initialized) { return CB_Events; }

		//The object has been initialized:
		CB_Events.initialized = true;

		//TODO.
		
		return CB_Events;
	}

	/**
	 * Gets the right event object for the current web client and normalizes it attaching to it some methods and properties if they were not present (as preventDefault, stopPropagation, target, etc.). The new attached methods and properties may include polyfills, etc.
	 *  @function
	 *  @param {Event} e - Event object. If not provided, it will use the value of "event", "window.event", "Event" or an empty object ("{}").
	 *  @returns {Event} Returns the event object normalized.
	 */
	CB_Events.normalize = function(e)
	{
		if (!e)
		{
			if (typeof(event) !== "undefined") { e = event; }
			else if (typeof(window.event) !== "undefined") { e = window.event; }
			else if (typeof(Event) !== "undefined") { e = Event; }
			if (!e) { e = {}; }
		}
		
		try { e._writable = true; } catch(E) { e._writable = false; }
		if (!e._writable) { e = CB_copyObject(e); } //If the event object cannot be written, copies it.

		//NOTE: Think about using Object.defineProperty with writable: true as option to prevent some web client problems that have readonly properties.
		
		//If not supported, adds preventDefault compatibility to the event object:
		if (typeof(e.preventDefault) === "undefined" || e.preventDefault === null)
		{
			if ("returnValue" in e)
			{
				e.preventDefault = function() { e.returnValue = false; return false; };
			}
			else if (typeof(window.event) !== "undefined" && "returnValue" in window.event)
			{
				e.preventDefault = function() { window.event.returnValue = false; return false; };
			}
			else { e.preventDefault = function() { return false; } }
		}

		//If not supported, adds stopPropagation compatibility to the event object:
		if (typeof(e.stopPropagation) === "undefined" || e.stopPropagation === null)
		{
			if (typeof(e.cancelBubble) !== "undefined" && e.cancelBubble !== null)
			{
				 e.stopPropagation = function() { e.cancelBubble = true; };
			}
			else if (typeof(window.event) !== "undefined" && typeof(window.event.cancelBubble) !== "undefined")
			{
				 e.stopPropagation = function() { window.event.cancelBubble = true; };	
			}
			else { e.stopPropagation = function() { } }
		}
		
		//If not supported, adds the target property to the object:
		if (typeof(e.target) === "undefined" && typeof(e.srcElement) !== "undefined")
		{
			e.target = e.srcElement;
		}
		
		//Prevents Safari bug (source: http://www.quirksmode.org/js/events_properties.html):
		if (typeof(e.target) !== "undefined" && typeof(e.target.nodeType) !== "undefined" && e.target.nodeType === 3)
		{
			try
			{
				e.target = e.target.parentNode;
			} catch(E) {}
		}
		
		//Adds target property (if possible):
		if (typeof(e.target) === "undefined" && typeof(e.srcElement) !== "undefined") { e.target = e.srcElement; }
		
		return e;
	}


	/**
	 * Returns the type of an event, if any (otherwise, returns an empty string).
	 *  @function
	 *  @param {Event} e - Event object.
	 *  @returns {string}
	 */
	CB_Events.getType = function(e)
	{
		e = CB_Events.normalize(e);
		if (typeof(e.type) !== "undefined" && e.type !== null) { return e.type; }
		else { return ""; }
	}


	/**
	 * Removes an event listener (even if it is not erasable).
	 *  @function
	 *  @param {Object} eventTarget - The target whose event listener we want to remove.
	 *  @param {string} eventName - The name of the event that we want to remove.
	 *  @param {function} eventFunction - The function (event listener) of the event that we want to remove.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to remove was defined to use capture or not.
	 */
	CB_Events.remove = function(eventTarget, eventName, eventFunction, useCapture)
	{
		//If the target (node) is null or is not an object, exits:
		if (typeof(eventTarget) === "undefined" || eventTarget === null || typeof(eventTarget) !== "object") { return; }

		//If not defined, set default value for useCapture parameter:
		if (useCapture !== true && useCapture !== false) { useCapture = false; }

		//Removes the event from the array:
		CB_Events._storedClear(eventTarget, eventName, eventFunction, useCapture);
		
		//Removes the event:
		if (typeof(eventTarget.addEventListener) !== "undefined" && eventTarget.removeEventListener)
		{
			eventTarget.removeEventListener(eventName, eventFunction, useCapture);
		}
		else if (typeof(eventTarget.attachEvent) !== "undefined" && eventTarget.detachEvent)
		{
			eventTarget.detachEvent("on" + eventName, eventFunction);
		}
	}


	/**
	 * Alias for {@link CB_Events.on}.
	 *  @function CB_Events.add
	 *  @see {@link CB_Events.on}
	 */	
	/**
	 * Adds an event listener.
	 *  @function
	 *  @param {Object} eventTarget - The target where we want to attach the event listener.
	 *  @param {string} eventName - The name of the event that we want to add.
	 *  @param {function} eventFunction - The function (event listener) of the event that we want to add.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {boolean} [keepOldEventFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [erasable=true] - Defines whether the event listener will be erasable by {@link CB_Events.removeAll} or {@link CB_Events.removeByName} functions later or not (it will always be erasable if we force delete).
	 *  @todo Try to simulate "useCapture" when the "addEventListener" method is not available.
	 */
	CB_Events.on = CB_Events.add = function(eventTarget, eventName, eventFunction, useCapture, keepOldEventFunction, erasable)
	{
		//If the target (node) is null or is not an object, exits:
		if (typeof(eventTarget) === "undefined" || eventTarget === null || typeof(eventTarget) !== "object") { return; }

		//If not defined, set default values for optional parameters:
		if (useCapture !== true && useCapture !== false) { useCapture = false; }
		if (typeof(keepOldEventFunction) === "undefined" || keepOldEventFunction === null) { keepOldEventFunction = true; }
		if (typeof(erasable) === "undefined" || erasable === null) { erasable = true; }

		//If we don't want to keep the old event functions, we delete them:
		if (!keepOldEventFunction)
		{
			CB_Events.removeByName(eventTarget, eventName);
		}

		//Adds the new event listeners:
		if (typeof(eventTarget.addEventListener) !== "undefined" && eventTarget.addEventListener)
		{
			eventTarget.addEventListener(eventName, eventFunction, useCapture);
		}
		else if (typeof(eventTarget.attachEvent) !== "undefined" && eventTarget.attachEvent)
		{
			eventTarget.attachEvent("on" + eventName, eventFunction);
		}
		//else if (eventTarget && typeof( eval("eventTarget.on" + eventName) ) !== "undefined")
		else if (eventTarget && typeof(eventTarget["on" + eventName]) !== "undefined")
		{
			var newEventFunction =
				function(e)
				{
					//e = CB_Events.normalize(e);
					return CB_Events.executeByName(eventTarget, eventName, e);
				}
			eventTarget["on" + eventName] = newEventFunction;
		}

		//Stores the event (so we could delete all from one type if we wanted):
		CB_Events._store(eventTarget, eventName, eventFunction, useCapture, erasable);
		
		//If we mind Iframes:
		if (CB_Configuration[CB_BASE_NAME].MIND_IFRAMES)
		{
			//If the event is "keydown", "keyup", "keypress", "mousedown" or "click":
			eventName = eventName.toLowerCase();
			if (eventName === "keydown" || eventName === "keyup" || eventName === "keydown" || eventName === "mousedown" || eventName === "click")
			{
				try
				{
					var eventTargetParents = [];
					//If the event is the main window object (no one of its possible parents):
					if (eventTarget === window)
					{
						eventTargetParents = CB_Client.getWindowParents();
					}
					//...otherwise if the event is the main document object (no one of its possible parents):
					else if (eventTarget === document)
					{
						eventTargetParents = CB_Client.getWindowParents().slice(0);
						CB_forEach
						(
							eventTargetParents,
							function(element, index, array)
							{
								if (index > 0) { array[index] = element.document; }
							}
						);
					}
					
					//If there are parents, applies the same event listener to them:
					if (eventTargetParents.length > 1)
					{
						CB_forEach
						(
							eventTargetParents,
							function(element, index, array)
							{
								if (index > 0)
								{
									CB_Events.add(element, eventName, eventFunction, useCapture, keepOldEventFunction, erasable);
								}
							}
						);
					}
				} catch(E) { }
			}
		}
	}


	/**
	 * Object that contains an event handler.
	 *  @memberof CB_Events
	 *  @typedef {Object} CB_Events.EVENT_HANDLER
	 *  @property {Object} eventTarget - The target of the event.
	 *  @property {string} eventName - The name of the event.
	 *  @property {function} eventFunction - The event listener.
	 *  @property {boolean} useCapture - Defines whether the event listener was defined to use capture or not.
	 *  @property {boolean} erasable - Defines whether the event handler is erasable (without forcing delete) or not.
	 */

    //Function that stores an event (so we could delete all from one type if we wanted):
	CB_Events._store = function(eventTarget, eventName, eventFunction, useCapture, erasable)
	{
		var x = CB_Events._stored.length;
		CB_Events._stored[x] = new Array(5);
		CB_Events._stored[x]["eventTarget"] = eventTarget;
		CB_Events._stored[x]["eventName"] = eventName;
		CB_Events._stored[x]["eventFunction"] = eventFunction; //Stores the function.
		CB_Events._stored[x]["useCapture"] = useCapture; //Stores the capture mode.
		CB_Events._stored[x]["erasable"] = erasable; //Stores whether is erasable or not.
	}


	//Function that clears (deletes) a stored event:
	CB_Events._storedClear = function(eventTarget, eventName, eventFunction, useCapture)
	{
		var CB_storedEventsLength = CB_Events._stored.length
		for (var x = 0; x < CB_storedEventsLength; x++)
		{
			//If the target (node) exists:
			if (eventTarget === CB_Events._stored[x]["eventTarget"])
			{
				//If the event exists
				if (eventName === CB_Events._stored[x]["eventName"])
				{
					//If the function (event handler) exists:
					if (eventFunction === CB_Events._stored[x]["eventFunction"])
					{
						//If it's the same capture mode:
						if (useCapture === CB_Events._stored[x]["useCapture"])
						{
							CB_Events._stored[x] = Array(5); //Clears the array (deletes the stored event).
							break; //It exits so that way only one element will be cleared.
						}
					}
				}
			}
		}
	}


	/**
	 * Deletes all handlers for an specific event from a node (target).
	 *  @function
	 *  @param {Object} eventTarget - The target whose event listeners we want to remove.
	 *  @param {string} eventName - The name of the event whose event listeners we want to remove.
	 *  @param {boolean} [forceDelete=false] - If it is set to true, it will remove any listener (even the ones which were added as not erasable).
	 */
	CB_Events.removeByName = function(eventTarget, eventName, forceDelete)
	{
		var CB_storedEventsLength = CB_Events._stored.length;
		for (var x = 0; x < CB_storedEventsLength; x++)
		{
			//If the target (node) exists:
			if (eventTarget === CB_Events._stored[x]["eventTarget"])
			{
				//If the event exists
				if (eventName === CB_Events._stored[x]["eventName"])
				{
					//Removes the element if is erasable or is in force delete mode:
					if (forceDelete || CB_Events._stored[x]["erasable"])
					{
						CB_Events.remove(eventTarget, eventName, CB_Events._stored[x]["eventFunction"], CB_Events._stored[x]["useCapture"]);
					}
				}
			}
		}
	}


	/**
	 * Removes all event listeners.
	 *  @function
	 *  @param {boolean} [forceDelete=false] - If it is set to true, it will remove all event listeners (even the ones which were added as not erasable).
	 */
	CB_Events.removeAll = function(forceDelete)
	{
		//For every targets (nodes):
		var CB_storedEventsLength = CB_Events._stored.length;
		for (var x = 0; x < CB_storedEventsLength; x++)
		{
			//If the event has not been cleared before:
			if (typeof(CB_Events._stored[x]["eventTarget"]) !== "undefined" && typeof(CB_Events._stored[x]["eventName"]) !== "undefined")
			{
				CB_Events.removeByName(CB_Events._stored[x]["eventTarget"], CB_Events._stored[x]["eventName"], forceDelete);
			}
		}
	}


	/**
	 * Executes all event listeners for an specific event from a node (target).
	 *  @function
	 *  @param {Object} eventTarget - The target whose event listeners we want to execute. It will be the value of "this" for every call to each listener.
	 *  @param {string} eventName - The name of the event whose event listeners we want to execute.
	 *  @param {Event} [e] - Event object that will be passed as the first and unique parameter for every call to each listener.
	 *  @param {*} [returnOnNothingExecuted] - The value that will be returned by the function if nothing is executed.
	 *  @returns {boolean} Returns the result of doing the AND operator of all return values of each listener executed. If only one listener is executed, it will return the result of doing the AND operator with its returning value and "true". Returns the value of the "returnOnNothingExecuted" parameter if nothing is executed.
	 */
	CB_Events.executeByName = function(eventTarget, eventName, e, returnOnNothingExecuted)
	{
		var CB_storedEventsLength = CB_Events._stored.length;
		var returnValue = true;
		var somethingExecuted = false;
		for (var x = 0; x < CB_storedEventsLength; x++)
		{
			//If the target (node) exists:
			if (eventTarget === CB_Events._stored[x]["eventTarget"])
			{
				//If the event exists
				if (eventName === CB_Events._stored[x]["eventName"])
				{
					//if an event function exists:
					if (typeof(CB_Events._stored[x]["eventFunction"]) === "function")
					{
						returnValue = CB_Events._stored[x]["eventFunction"].call(eventTarget, e) && returnValue;
						somethingExecuted = true;
					}
				}
			}
		}
		return somethingExecuted ? returnValue : returnOnNothingExecuted;
	}


	/**
	 * Returns all handlers for an specific event from a node (target), if any.
	 *  @function
	 *  @param {Object} eventTarget - The target whose event listeners we want to get.
	 *  @param {string} eventName - The name of the event whose event listeners we want to get.
	 *  @param {boolean} [onlyWithFunction=false] - Defines whether to return only the handlers which have a function as the listener.
	 *  @returns {array} Returns an array of {@link CB_Events.EVENT_HANDLER} objects.
	 */
	CB_Events.getByName = function(eventTarget, eventName, onlyWithFunction)
	{
		var found = [];
		var CB_storedEventsLength = CB_Events._stored.length;
		for (var x = 0; x < CB_storedEventsLength; x++)
		{
			//If the target (node) exists:
			if (eventTarget === CB_Events._stored[x]["eventTarget"])
			{
				//If the event exists
				if (eventName === CB_Events._stored[x]["eventName"])
				{
					if (!onlyWithFunction || typeof(CB_Events._stored[x]["eventFunction"]) === "function")
					{
						found[found.length] = CB_Events._stored[x];
					}
				}
			}
		}
		return found;
	}
	
	
	/**
	 * Returns all stored event handlers (if any).
	 *  @function
	 *  @returns {array} Returns an array of {@link CB_Events.EVENT_HANDLER} objects.
	 */
	CB_Events.getAll = function()
	{
		return CB_Events._stored;
	}
}