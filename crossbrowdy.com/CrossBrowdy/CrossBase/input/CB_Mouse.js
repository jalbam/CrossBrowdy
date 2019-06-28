/**
 * @file Mouse and related management. Contains the {@link CB_Mouse} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */
 

/**
 * Static class to manage the mouse and related. It will return itself if it is tried to be instantiated.
 * @namespace
 */
var CB_Mouse = function() { return CB_Mouse; };
{
	CB_Mouse.initialized = false; //It will tells whether the object has been initialized or not.
	
	CB_Mouse._x = 0; //Keeps the X position of the mouse (relative to the window).
	CB_Mouse._y = 0; //Keeps the X position of the mouse (relative to the window).
	CB_Mouse._xMovement = 0; //Keeps the X movement of the mouser when its pointer is locked.
	CB_Mouse._yMovement = 0; //Keeps the Y movement of the mouser when its pointer is locked.
	CB_Mouse._buttonsDown = { LEFT : false, MIDDLE : false, RIGHT : false }; //Object with the buttons of the mouse which being pressed.
	
	CB_Mouse._isLockedNow = false; //Contains whether the mouse pointer is locked or not.
	CB_Mouse._isLockedPrevious = false; //Contains whether the mouse pointer was locked before or not.
	CB_Mouse._lockElement = null; //Contains the element that the mouse pointer is locked to (if any).
	
	//CB_Mouse._showingCursor = {}; //Tells whether the cursor is showing or not (by default is showing).
	
	/**
	  Property that keeps an object to manage the mouse cursor using a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} containing an image for clients that do not support changing the cursor image by CSS.
	  <br />
	  Caution: Performance could be dramatically decreased while using this workaround.
	  * @namespace CB_Mouse.CursorImage
	 */
	CB_Mouse.CursorImage = {}; //Keeps the cursor object.
	CB_Mouse.CursorImage._cursorImageDiv = null; //DIV that contains the IMG tag for the fake cursor image.
	CB_Mouse.CursorImage._cursorImage = null; //IMG that contains the fake cursor image.
	CB_Mouse.CursorImage._showCursorImage = false; //Defines whether the fake cursor image is shown or not.
	CB_Mouse.CursorImage._cursorImageSpriteAnimationTimeout = null;
	
	
	//Initializes all values:
	CB_Mouse.init = function()
	{
		if (CB_Mouse.initialized) { return CB_Mouse; }
			
		//The object has been initialized:
		CB_Mouse.initialized = true;
		
		//Adds event that updates X and Y position of the mouse when it moves (and moves the cursor image if it is necessary):
		CB_Events.add(document, "mousemove", function(e) { e = CB_Mouse.normalizeEvent(e); CB_Mouse.getX(e); CB_Mouse.getY(e); CB_Mouse.CursorImage.move(); }, true, true, false);
		CB_Events.add(window, "scroll", CB_Mouse.CursorImage.move, true, true, false);
		
		//Sets the event that will check if a button is down:
		CB_Events.add(document, "mousedown",
											function(e)
											{
												e = CB_Mouse.normalizeEvent(e);
												//Uses setCapture/releaseCapture to force IE and Firefox to release mouse buttons when dragging outside the web client window:
												//if (typeof(document.body) !== "undefined" && typeof(document.body.setCapture) !== "undefined")
												if (typeof(e.target) !== "undefined" && typeof(e.target.setCapture) !== "undefined")
												{
													//document.body.setCapture();
													e.target.setCapture();
												}
												CB_Mouse._updateButtonsDown(e, true);
											}
											, true, true, false);
											
		//Sets the event that will check if a button is released:
		CB_Events.add(document, "mouseup",
										function(e)
										{
											e = CB_Mouse.normalizeEvent(e);
											//Uses setCapture/releaseCapture to force IE and Firefox to release mouse buttons when dragging outside the web client window:
											//if (typeof(document.body) !== "undefined" && typeof(document.body.releaseCapture) !== "undefined")
											if (typeof(e.target) !== "undefined" && typeof(e.target.releaseCapture) !== "undefined")
											{
												//document.body.releaseCapture();
												e.target.releaseCapture();
											}
											CB_Mouse._updateButtonsDown(e, false);
										}
										, true, true, false);

		//Sets the event for when the lock pointer status changes:
		var onPointerLockChange =
			function()
			{
				CB_Mouse.isLocked(true); //Also updates the cache of the current lock element (if any).
			};
		CB_Events.add(document, "pointerlockchange", onPointerLockChange, true, true, false);
		CB_Events.add(document, "mozpointerlockchange", onPointerLockChange, true, true, false);
		CB_Events.add(document, "webkitpointerlockchange", onPointerLockChange, true, true, false);
		CB_Events.add(document, "pointerlocklost", onPointerLockChange, true, true, false);
		CB_Events.add(document, "webkitpointerlocklost", onPointerLockChange, true, true, false);
		CB_Events.add(document, "mozpointerlocklost", onPointerLockChange, true, true, false);
										
		//Clears buttonsDown array when the mouse leaves the web client:
		//CB_Events.add(window, "mouseleave", function() { CB_Mouse._buttonsDown = { LEFT : false, MIDDLE : false, RIGHT : false }; }, true, true, false);
		//CB_Events.add(document, "mouseout", function() { CB_Mouse._buttonsDown = { LEFT : false, MIDDLE : false, RIGHT : false }; }, true, true, false);
		
		//Sets the focus to force a mousemove event and get the proper mouse coordinates (some web clients at the start don't get the proper mouse coordinates):
		CB_Screen.focus();

		return CB_Mouse;
	}


	/**
	 * Tries to return the given [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} with some properties normalized (since different clients can use different values) and perhaps some new properties added (in the case they were missing), when possible. The new attached methods and properties may include polyfills, etc. It also calls the {@link CB_Events.normalize} function internally. Some properties added or affected could be [deltaX]{@link https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX}, [deltaY]{@link https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY}, [deltaZ]{@link https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ}, [force]{@link https://developer.mozilla.org/es/docs/Web/API/MouseEvent/webkitForce}, [clientX]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX}, [clientY]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY}, etc.
	 *  @function
	 *  @param {Event} e - [Mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent}. If not provided, it will use the value of "event", "window.event", "Event" or an empty object ("{}").
	 *  @returns {Event} Returns the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} normalized.
	 *  @todo Add more properties and methods to normalize ([pageX]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX}, [pageY]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY}, [offsetX]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX}, [offsetY]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetY}, etc.).
	 */
	CB_Mouse.normalizeEvent = function(e)
	{
		e = CB_Events.normalize(e);

		//If wheel event is not supported, normalizes the event:
		var onWheelEventName = CB_Mouse._getOnWheelEventName();
		if (onWheelEventName !== "wheel")
		{
			if (typeof(e.type) !== "undefined" && e.type === "MozMousePixelScroll")
			{
				e.deltaMode = 0;
			}
			else
			{
				e.deltaMode = 1;
			}
			
			if (typeof(e.deltaX) === "undefined") { e.deltaX = 0; }
			if (typeof(e.deltaZ) === "undefined") { e.deltaZ = 0; }
			if (typeof(e.deltaY) === "undefined")
			{
				if (onWheelEventName === "mousewheel" && typeof(e.wheelDelta) !== "undefined")
				{
					e.deltaY = -(1/40 * e.wheelDelta);
					//e.deltaY = e.wheelDelta / -40;
					//e.deltaY = e.wheelDelta / 120;
					if (typeof(e.wheelDeltaX) !== "undefined")
					{
						event.deltaX = -(1/40 * e.wheelDeltaX);
					}
				}
				else if (typeof(e.detail) !== "undefined")
				{
					e.deltaY = e.detail;
					//e.deltaY = -40 * e.detail;
					//e.deltaY = e.detail * -120;
					//e.deltaY = -e.detail / 3;
				}
				else
				{
					e.deltaY = 0;
				}
			}
		}
		
		//Normalizes the force property (if any):
		if (typeof(e.force) === "undefined" || e.force === null || isNaN(e.force))
		{
			if (typeof(e.webkitForce) !== "undefined" && e.webkitForce !== null && !isNaN(e.webkitForce)) { e.force = e.webkitForce; }
			else if (CB_Touch._force !== null) { e.force = CB_Touch._force; } //Uses force detected by Pressure.js.
		}
		if (!e.forceNormalized) { e.force = CB_Touch.normalizeForce(e.force); }
		e.forceNormalized = true;
		
		//TODO: add more properties and methods to normalize (pageX, pageY, offsetX, offsetY, ).
		
		//Normalize other properties:
		//* Source: http://www.jacklmoore.com/notes/mouse-position/
		if (typeof(e.clientX) === "undefined" && typeof(e.pageX) !== "undefined") { e.clientX = e.pageX; }
		if (typeof(e.clientY) === "undefined" && typeof(e.pageY) !== "undefined") { e.clientY = e.pageY; }
		if (document.body && document.documentElement)
		{
			if (typeof(e.pageX) === "undefined" && typeof(e.clientX) !== "undefined")
			{
				if (typeof(document.body.scrollLeft) !== "undefined" && typeof(document.documentElement.scrollLeft) !== "undefined")
				{
					e.pageX = e.clientX + (document.body.scrollLeft) + document.documentElement.scrollLeft;
				}
				else if (typeof(document.body.scrollWidth) !== "undefined" && typeof(document.documentElement.scrollWidth) !== "undefined")
				{
					e.pageX = e.clientX + (document.body.scrollWidth) + document.documentElement.scrollWidth;
				}
			}
			if (typeof(e.pageY) === "undefined" && typeof(e.clientY) !== "undefined")
			{
				if (typeof(document.body.scrollTop) !== "undefined" && typeof(document.documentElement.scrollTop) !== "undefined")
				{
					e.pageY = e.clientY + (document.body.scrollTop) + document.documentElement.scrollTop;
				}
				else if (typeof(document.body.scrollHeight) !== "undefined" && typeof(document.documentElement.scrollHeight) !== "undefined")
				{
					e.pageY = e.clientY + (document.body.scrollHeight) + document.documentElement.scrollHeight;
				}
			}
		}
		try
		{
			var targetStyle = CB_Elements.getStyle(e.target, true);
		} catch (E) {}
		if (targetStyle !== null && typeof(e.clientX) !== "undefined" && e.clientX !== null && typeof(e.clientY) !== "undefined" && e.clientY !== null)
		{
			try
			{
				e.offsetX = e.clientX - parseInt(targetStyle['borderLeftWidth'], 10) - CB_Client.getBoundingClientRectMargin("left");
				e.offsetY = e.clientY - parseInt(targetStyle['borderTopWidth'], 10) - CB_Client.getBoundingClientRectMargin("top");
			} catch (E) {}
		}
		
		return e;
	}
	
	
	CB_Mouse._getOnWheelEventNameReturnCache = null;
	CB_Mouse._getOnWheelEventName = function()
	{
		if (typeof(CB_Mouse._getOnWheelEventNameReturnCache) === "undefined" || CB_Mouse._getOnWheelEventNameReturnCache === null)
		{
			CB_Mouse._getOnWheelEventNameReturnCache =
													("onwheel" in document.createElement("div")) ? "wheel" : //"wheel" supported.
													(typeof(document.onmousewheel) !== "undefined") ? "mousewheel" : //"onmousewheel" supported.
													"DOMMouseScroll"; //assumes "DOMMouseScroll" support.
		}
		return CB_Mouse._getOnWheelEventNameReturnCache;
	}
	
	
	//Returns which button is down given a mouse event:
	CB_Mouse._updateButtonsDown = function(e, buttonDown)
	{
		e = CB_Mouse.normalizeEvent(e);
		
 		var buttonsDown = CB_Mouse._buttonsDown;

 		if (e.which)
		{
			if (e.which === 1) { buttonsDown.LEFT = buttonDown; }
			else if (CB_Client.getBrowser() === "Opera" && CB_Client.getBrowserVersionMain() < 8)
			{
				if (e.which === 2) { buttonsDown.RIGHT = buttonDown; }
				else if (e.which === 3) { buttonsDown.MIDDLE = buttonDown; }
			}
			else
			{
				if (e.which === 2) { buttonsDown.MIDDLE = buttonDown; }
				else if (e.which === 3) { buttonsDown.RIGHT = buttonDown; }
			}
	 	}
 		else if (e.button)
		{
			if (CB_Client.getBrowser() === "Explorer")
		  	{
				//TODO: think about performing bitwise operations.
				if (e.button === 1) { buttonsDown.LEFT = buttonDown; }
				else if (e.button === 2) { buttonsDown.RIGHT = buttonDown; }
				else if (e.button === 3) { buttonsDown.LEFT = buttonsDown.RIGHT = buttonDown; }
				else if (e.button === 4) { buttonsDown.MIDDLE = buttonDown; }
				else if (e.button === 5) { buttonsDown.LEFT = buttonsDown.MIDDLE = buttonDown; }
				else if (e.button === 6) { buttonsDown.RIGHT = buttonsDown.MIDDLE = buttonDown; }
				else if (e.button === 7) { buttonsDown.LEFT = buttonsDown.RIGHT = buttonsDown.MIDDLE = buttonDown; }
				//else if (e.button === 0) { buttonsDown.LEFT = buttonsDown.RIGHT = buttonsDown.MIDDLE = false; }
			}
			else
			{
				if (e.button === 0) { buttonsDown.LEFT = buttonDown; }
				else if (e.button === 1) { buttonsDown.MIDDLE = buttonDown; }
				else if (e.button === 2) { buttonsDown.RIGHT = buttonDown; }
			}
	 	}

		CB_Mouse._buttonsDown = buttonsDown;
	}


	/**
	 * Tells what mouse buttons are down (LEFT, MIDDLE and/or RIGHT buttons).
	 *  @function
	 *  @returns {Object} Returns an object using the following format (where "true" means that the button is being pressed): { LEFT : boolean, MIDDLE : boolean, RIGHT : boolean }
	 */
	CB_Mouse.getButtonsDown = function()
	{
		return CB_Mouse._buttonsDown;
	}


	/**
	 * Gets and returns the X coordinate (horizontal position) of the mouse (relative to the window in desktop) in pixels.
	 *  @function
	 *  @param {Event} [e] - [Mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent}. If not provided, the returning value will use the previously-cached value (updated the last time that the [onMouseMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event was fired).
	 *  @param {boolean} [ignoreScroll=false] - If set to true, the horizontal scroll position will not be added to the returning value.
	 *  @param {boolean} [ignoreLock=false] - If set to true, it will ignore whether the cursor is being locked or not. Otherwise, if set to false and the cursor is locked, the returning value will only have in mind the position in the locking element.
	 *  @returns {number} Returns the X coordinate (horizontal position) of the mouse (relative to the window in desktop) in pixels.
	 */
	CB_Mouse.getX = function(e, ignoreScroll, ignoreLock)
	{
		//If this function has not been called from an event, we return stored values:
		if (!e)
		{
			if (CB_Mouse.isLocked(false) && !ignoreLock) { return CB_Mouse.getXMovement(e); }
			else
			{
				if (ignoreScroll) { return CB_Mouse._x; }
				else { return CB_Mouse._x + CB_Screen.getScrollLeft(); }
			}
		}

		var mouseX = 0;

	    //If it is compatible with the W3C draft:
    	if (typeof(e.x) !== "undefined") { mouseX = e.x; }
	    //...otherwise, if we are using Internet Explorer:
    	else if (typeof(e.clientX) !== "undefined")
        {
        	mouseX = e.clientX;// + document.body.scrollLeft;
        }
        //...otherwise we don't use Internet Explorer:
        else if (typeof(e.pageX) !== "undefined")
        {
	        //document.captureEvents(Event.MOUSEMOVE);
			mouseX = e.pageX;
        }
		
        //If the coordinate is lower than zero, it should be zero:
        if (mouseX < 0) { mouseX = 0; }

        //We set the value for the property of the class:
        CB_Mouse._x = mouseX;
		
		//Updates the mose movement (useful when the mouse pointer is locked):
		CB_Mouse._xMovement = CB_Mouse.getXMovement(e);
		
		//If the mouse pointer is locked and we do not want to ignore it:
		if (CB_Mouse.isLocked(false) && !ignoreLock)
		{
			return CB_Mouse._xMovement;
		}
		//...otherwise, returns the normal position instead of the movement:
		else
		{
			if (ignoreScroll) { return CB_Mouse._x; }
			else { return CB_Mouse._x + CB_Screen.getScrollLeft(); }
		}
	}


	/**
	 * Gets and returns the Y coordinate (vertical position) of the mouse (relative to the window in desktop) in pixels.
	 *  @function
	 *  @param {Event} [e] - [Mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent}. If not provided, the returning value will use the previously-cached value (updated the last time that the [onMouseMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event was fired).
	 *  @param {boolean} [ignoreScroll=false] - If set to true, the vertical scroll position will not be added to the returning value.
	 *  @param {boolean} [ignoreLock=false] - If set to true, it will ignore whether the cursor is being locked or not. Otherwise, if set to false and the cursor is locked, the returning value will only have in mind the position in the locking element.
	 *  @returns {number} Returns the Y coordinate (vertical position) of the mouse (relative to the window in desktop) in pixels.
	 */
	CB_Mouse.getY = function(e, ignoreScroll, ignoreLock)
	{
		//If this function has not been called from an event, we return stored values:
		if (!e)
		{
			if (CB_Mouse.isLocked(false) && !ignoreLock) { return CB_Mouse.getYMovement(e); }
			else
			{
				if (ignoreScroll) { return CB_Mouse._y; }
				else { return CB_Mouse._y + CB_Screen.getScrollTop(); }
			}
		}

		var mouseY = 0;

	    //If it is compatible with the W3C draft:
    	if (typeof(e.y) !== "undefined") { mouseY = e.y; }
	    //...otherwise, if we are using Internet Explorer:
    	else if (typeof(e.clientY) !== "undefined")
        {
        	mouseY = e.clientY;// + document.body.scrollTop;
        }
        //...otherwise we don't use Internet Explorer:
        else if (typeof(e.pageY) !== "undefined")
        {
	        //document.captureEvents(Event.MOUSEMOVE);
    	    mouseY = e.pageY;
        }

        //If the coordinate is lower than zero, it should be zero:
        if (mouseY < 0) { mouseY = 0; }

        //We set the value for the property of the class:
        CB_Mouse._y = mouseY;
		
		//Updates the mose movement (useful when the mouse pointer is locked):
		CB_Mouse._yMovement = CB_Mouse.getYMovement(e);
		
		//If the mouse pointer is locked and we do not want to ignore it:
		if (CB_Mouse.isLocked(false) && !ignoreLock)
		{
			return CB_Mouse._yMovement;
		}
		//...otherwise, returns the normal position instead of the movement:
		else
		{
			if (ignoreScroll) { return CB_Mouse._y; }
			else { return CB_Mouse._y + CB_Screen.getScrollTop(); }
		}
	}

	
	/**
	 * Gets and returns the current X coordinate (horizontal position) in pixels of the mouse relative to a given X position. The returning value uses the previously-cached value (updated the last time that the [onMouseMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event was fired).
	 *  @function
	 *  @param {number} x - The X coordinate (horizontal position) in pixels. The returning value will be calculated relatively to it.
	 *  @param {boolean} [ignoreScroll=false] - If set to true, the horizontal scroll position will not be added to the returning value.
	 *  @returns {number} Returns the current X coordinate (horizontal position) in pixels of the mouse relative to a given X position.
	 *  @todo Think about allowing to define an "e" parameter with the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent}. 
	 */
	CB_Mouse.getXRelative = function(x, ignoreScroll)
	{
		//Gets the X position of the mouse:
		var mouseX = CB_Mouse.getX(null, ignoreScroll);
		
		if (ignoreScroll) { x -= CB_Screen.getScrollLeft(); }
		
		var mouseRelativeX = mouseX - x;

		return mouseRelativeX;
	}


	/**
	 * Gets and returns the current Y coordinate (vertical position) in pixels of the mouse relative to a given Y position. The returning value uses the previously-cached value (updated the last time that the [onMouseMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event was fired).
	 *  @function
	 *  @param {number} y - The Y coordinate (vertical position) in pixels. The returning value will be calculated relatively to it.
	 *  @param {boolean} [ignoreScroll=false] - If set to true, the vertical scroll position will not be added to the returning value.
	 *  @returns {number} Returns the current Y coordinate (vertical position) in pixels of the mouse relative to a given Y position.
	 *  @todo Think about allowing to define an "e" parameter with the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent}.
	 */
	CB_Mouse.getYRelative = function(y, ignoreScroll)
	{
		//Gets the Y position of the mouse:
		var mouseY = CB_Mouse.getY(null, ignoreScroll);
		
		if (ignoreScroll) { y -= CB_Screen.getScrollTop(); }
		
		var mouseRelativeY = mouseY - y;

		return mouseRelativeY;
	}


	/**
	 * Returns the current X (horizontal) movement (useful when the mouse pointer is locked) in pixels. More information: [MouseEvent.movementX]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX}.
	 *  @function
	 *  @param {Event} [e] - [Mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent}. If not provided, the returning value will use the previously-cached value (updated the last time that the [onMouseMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event was fired).
	 *  @returns {number} Returns the current X (horizontal) movement (useful when the mouse pointer is locked) in pixels.
	 */
	CB_Mouse.getXMovement = function(e)
	{
		//If this function has been called from an event, updates the current values:
		if (e) { CB_Mouse._xMovement = e.movementX || e.mozMovementX || e.webkitMovementX || 0; }
		return CB_Mouse._xMovement;
	}

	
	/**
	 * Returns the current Y (vertical) movement (useful when the mouse pointer is locked) in pixels. More information: [MouseEvent.movementY]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY}.
	 *  @function
	 *  @param {Event} [e] - [Mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent}. If not provided, the returning value will use the previously-cached value (updated the last time that the [onMouseMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event was fired).
	 *  @returns {number} Returns the current Y (vertical) movement (useful when the mouse pointer is locked) in pixels.
	 */
	CB_Mouse.getYMovement = function(e)
	{
		//If this function has been called from an event, updates the current values:
		if (e) { CB_Mouse._yMovement = e.movementY || e.mozMovementY || e.webkitMovementY || 0; }
		return CB_Mouse._yMovement;
	}
	

	/**
	 * Sets a function to execute when a click happens ([onMouseMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Mouse.onMove = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Mouse._setEvent("mousemove", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when a click happens ([onClick]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Mouse.onClick = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Mouse._setEvent("click", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when a click happens ([onDblClick]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Mouse.onDblClick = CB_Mouse.onDoubleClick = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Mouse._setEvent("dblclick", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when a mouse button is down ([onMouseDown]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Mouse.onButtonDown = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Mouse._setEvent("mousedown", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when a mouse button is up ([onMouseUp]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Mouse.onButtonUp = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Mouse._setEvent("mouseup", callbackFunction, keepOldFunction, useCapture, target);
	}

	
	/**
	 * Sets a function to execute when a mouse leaves a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} ([onMouseLeave]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=window] - The target where we want to attach the event listener.
	 */
	CB_Mouse.onLeave = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Mouse._setEvent("mouseleave", callbackFunction, keepOldFunction, useCapture, target);
	}
	
	
	/**
	 * Sets a function to execute when a mouse is over a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} ([onMouseOver]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Mouse.onOver = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Mouse._setEvent("mouseover", callbackFunction, keepOldFunction, useCapture, target);
	}
	
	
	/**
	 * Sets a function to execute when a mouse gets out of a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} ([onMouseOut]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Mouse.onOut = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Mouse._setEvent("mouseout", callbackFunction, keepOldFunction, useCapture, target);
	}
	

	/**
	 * Sets a function to execute when the mouse wheel is used ([onWheel]{@link https://developer.mozilla.org/en-US/docs/Web/Events/wheel}, [onMouseWheel]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousewheel_event} or [DOMMouseScroll]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/DOMMouseScroll_event} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Mouse.onWheel = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		var onWheelEventName = CB_Mouse._getOnWheelEventName();

		var valueToReturn = CB_Mouse._setEvent(onWheelEventName, callbackFunction, keepOldFunction, useCapture, target);
		
		//If DOMMouseScroll is detected, adds MozMousePixelScroll event for older Firefox versions:
		if (onWheelEventName === "DOMMouseScroll")
		{
			valueToReturn = CB_Mouse._setEvent("MozMousePixelScroll", callbackFunction, keepOldFunction, useCapture, target);
        }
		
		return valueToReturn;
	}

	
	CB_Mouse.isLockSupportedReturnCache = null;
	/**
	 * Tells whether mouse pointer lock is supported or not. More information: [Pointer Lock API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API}.
	 *  @function
	 *  @returns {boolean} Returns whether mouse pointer lock is supported or not.
	 */
	CB_Mouse.isLockSupported = function()
	{
		if (CB_Mouse.isLockSupportedReturnCache === null)
		{
			CB_Mouse.isLockSupportedReturnCache = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document || (navigator && (navigator.pointer || navigator.webkitPointer || navigator.mozPointer));
		}
		return CB_Mouse.isLockSupportedReturnCache;
	}
	
	
	/**
	 * Tells whether the mouse pointer is locked or not. More information: [Pointer Lock API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API}.
	 *  @function
	 *  @param {boolean} [avoidCache=false] - Used as the parameter to call the {@link CB_Mouse.getLockElement} function internally.
	 *  @returns {boolean} Returns whether the mouse pointer is locked or not.
	 */
	CB_Mouse.isLocked = function(avoidCache)
	{
		CB_Mouse._isLockedPrevious = CB_Mouse._isLockedNow;
		var isLockedNow = (CB_Mouse.getLockElement(avoidCache) !== null);
		if (!isLockedNow && navigator)
		{
			navigator.pointer = navigator.pointer || navigator.webkitPointer || navigator.mozPointer;
			if (navigator.pointer)
			{
				if (typeof(navigator.pointer.isLocked) === "function") { isLockedNow = navigator.pointer.isLocked(); }
				else if (typeof(navigator.pointer.islocked) === "function") { isLockedNow = navigator.pointer.islocked(); }
				else if (typeof(navigator.pointer.isLocked) !== "undefined") { isLockedNow = navigator.pointer.isLocked; }
			}
		}
		CB_Mouse._isLockedNow = isLockedNow;
		return CB_Mouse._isLockedNow;
	}


	/**
	 * Tells whether the mouse pointer was locked before or not when the {@link CB_Mouse.isLocked} function was called the last time. More information: [Pointer Lock API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API}.
	 *  @function
	 *  @returns {boolean} Returns whether the mouse pointer was locked before or not when the {@link CB_Mouse.isLocked} function was called the last time.
	 */
	CB_Mouse.wasLocked = function()
	{
		return CB_Mouse._isLockedPrevious;
	}
	
	
	/**
	 * Gets the lock element for the mouse pointer (if any) or null otherwise. More information: [Pointer Lock API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API}.
	 *  @function
	 *  @param {boolean} [avoidCache=false] - If set to false, the returning value will use the previously-cached value (updated when this function is called with this parameter set to true or the [onPointerLockChange]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerlockchange_event} or analog event is fired or when the {@link CB_Mouse.lock} or {@link CB_Mouse.unlock} functions are called successfully).
	 *  @returns {Element|null} Returns the lock element for the mouse pointer (if any) or null otherwise.
	 */
	CB_Mouse.getLockElement = function(avoidCache)
	{
		if (avoidCache)
		{
			if (typeof(document.pointerLockElement) !== "undefined" && document.pointerLockElement !== null) { CB_Mouse._lockElement = document.pointerLockElement; }
			else if (typeof(document.mozPointerLockElement) !== "undefined" && document.mozPointerLockElement !== null) { CB_Mouse._lockElement = document.mozPointerLockElement; }
			else if (typeof(document.webkitPointerLockElement) !== "undefined" && document.webkitPointerLockElement !== null) { CB_Mouse._lockElement = document.webkitPointerLockElement; }
			else { CB_Mouse._lockElement = null; }
			return CB_Mouse._lockElement;
		}
		else { return CB_Mouse._lockElement; }
	}
	
	
	/**
	 * Locks the mouse pointer (if possible). More information: [Pointer Lock API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API}.
	 *  @function
	 *  @param {Element} target - The [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} that the mouse pointer will be locked to.
	 *  @param {function} callbackOk - Function callback that will be called (without parameters) if the mouse pointer could be locked successfully.
	 *  @param {function} callbackError - Function callback that will be called (without parameters) if the mouse pointer could not be locked successfully.
	 *  @returns {Element|null} Returns the current lock element for the mouse pointer (if any) or null otherwise.
	 */
	CB_Mouse.lock = function(target, callbackOk, callbackError)
	{
		if (typeof(target) !== "undefined" && target !== null)
		{
			target.requestPointerLock = target.requestPointerLock || target.mozRequestPointerLock || target.webkitRequestPointerLock;
			if (typeof(target.requestPointerLock) === "function")
			{
				target.requestPointerLock();
				if (CB_Mouse.isLocked(true)) //Also updates CB_Mouse.isLocked cache.
				{
					if (typeof(callbackOk) === "function") { callbackOk(); }
				}
				else if (typeof(callbackError) === "function") { callbackError(); }
				return CB_Mouse.getLockElement(true);
			}
			else if (navigator)
			{
				navigator.pointer = navigator.pointer || navigator.webkitPointer || navigator.mozPointer;
				if (navigator.pointer && typeof(navigator.pointer.lock) === "function")
				{
					navigator.pointer.lock(target,	callbackOk, callbackError);
					CB_Mouse.isLocked(true); //Updates CB_Mouse.isLocked cache.
					return CB_Mouse.getLockElement(true);
				}
			}
		}
		if (typeof(callbackError) === "function") { callbackError(); }
		CB_Mouse.isLocked(true); //Updates CB_Mouse.isLocked cache.
		return null;
	}

	
	/**
	 * Unlocks the mouse pointer (if possible). More information: [Pointer Lock API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API}.
	 *  @function
	 *  @returns {boolean} Returns true if the mouse pointer has been unlocked or false otherwise.
	 */
	CB_Mouse.unlock = function()
	{
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
		if (typeof(document.exitPointerLock) === "function")
		{
			document.exitPointerLock();
		}
		else if (navigator)
		{
			navigator.pointer = navigator.pointer || navigator.webkitPointer || navigator.mozPointer;
			if (navigator.pointer && typeof(navigator.pointer.unlock) === "function")
			{
				navigator.pointer.unlock();
			}
		}
		return (!CB_Mouse.isLocked(true));
	}
	

	/**
	 * Sets a function to execute when the mouse pointer lock functionality changes its state (it has been either locked or unlocked, using [pointerlockchange]{@link [onPointerLockChange]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerlockchange_event}}, [mozpointerlockchange]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API} or [webkitpointerlockchange]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API} event) or removes it. More information: [Pointer Lock API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API}. 
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 */
	CB_Mouse.onLockChange = function(callbackFunction, keepOldFunction, useCapture)
	{
		CB_Mouse._setEvent("pointerlockchange", callbackFunction, keepOldFunction, useCapture, document);
		CB_Mouse._setEvent("mozpointerlockchange", callbackFunction, keepOldFunction, useCapture, document);
		CB_Mouse._setEvent("webkitpointerlockchange", callbackFunction, keepOldFunction, useCapture, document);
	}


	/**
	 * Sets a function to execute when the mouse pointer fails to either lock or unlock (using [pointerlockerror]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/pointerlockerror_event}, [mozpointerlockerror]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API} or [webkitpointerlockerror]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API} event) or removes it. More information: [Pointer Lock API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API}. 
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first and unique parameter received for this function will be the [mouse event object]{@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent} (already normalized by the {@link CB_Mouse.normalizeEvent} function). If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 */
	CB_Mouse.onLockError = function(callbackFunction, keepOldFunction, useCapture)
	{
		CB_Mouse._setEvent("pointerlockerror", callbackFunction, keepOldFunction, useCapture, document);
		CB_Mouse._setEvent("mozpointerlockerror", callbackFunction, keepOldFunction, useCapture, document);
		CB_Mouse._setEvent("webkitpointerlockerror", callbackFunction, keepOldFunction, useCapture, document);
	}
	

	//Sets a function to execute when a desired event is fired:
	CB_Mouse._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture, target)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; } //If not set, it keeps old function by default.
		if (typeof(target) === "undefined" || target === null)
		{
			if (eventName === "mouseleave") { target = window; }
			else { target = document; }
		}

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
					e = CB_Mouse.normalizeEvent(e);
					CB_Mouse.getX(e); //Updates mouse X position.
					CB_Mouse.getY(e); //Updates mouse Y position.
					
					if (eventName === "mousedown" || eventName === "mouseup")
					{
						CB_Mouse._updateButtonsDown(e, (eventName === "mousedown")); //Updates buttons down.
					}
					
					if (typeof(eventFunction) === "function") { return eventFunction(e); }
					
					return true;
				},
				useCapture,
				keepOldFunction,
				true
			);
		}
		//...but if the function given is null, it will cancel the event:
		else if (eventFunction === null)
		{
			CB_Events.removeByName(target, eventName);
		}
	}
	

	/**
	 * Tells whether the mouse is over a given [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} or not.
	 *  @function
	 *  @param {Element} element - The [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} where we want to know whether the mouse is over or not.
	 *  @returns {boolean} Returns whether the mouse is over the given [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} or not.
	 */
	CB_Mouse.isOverElement = function(element)
	{
		var mouseX = CB_Mouse.getX();
		var mouseY = CB_Mouse.getY();
		
		var collision = CB_Collisions.isPointOverElement(mouseX, mouseY, element);
		
		return collision;
	}


	/**
	 * Tells whether the mouse is over a given line (infinite line) or not.
	 *  @function
	 *  @param {number} lineX1 - The X coordinate (horizontal position) of the first pixel of the line.
	 *  @param {number} lineY1 - The Y coordinate (vertical position) of the first pixel of the line.
	 *  @param {number} lineX2 - The X coordinate (horizontal position) of the second pixel of the line.
	 *  @param {number} lineY2 - The Y coordinate (vertical position) of the second pixel of the line.
	 *  @param {number} [tolerance=1] - The amount of loss of precision we can tolerate to consider a collision.
	 *  @param {Element} [element] - If a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} is given, the mouse coordinates will be calculated relatively to the position of this [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}.
	 *  @returns {boolean} Returns whether the mouse is over the given line (infinite line) or not.
	 *  @todo Think about using a "width" parameter (apart from the "tolerance" parameter).
	 */
	CB_Mouse.isOverLine = function(lineX1, lineY1, lineX2, lineY2, tolerance, element)
	{
		if (typeof(tolerance) === "undefined" || tolerance === null) { tolerance = 1; }
		
		var mouseX = CB_Mouse.getX();
		var mouseY = CB_Mouse.getY();
		
		if (typeof(element) !== "undefined" && element !== null)
		{
			var elementLeft = CB_Elements.getLeft(element);
			var elementTop = CB_Elements.getTop(element);
			
			mouseX = CB_Mouse.getXRelative(elementLeft);
			mouseY = CB_Mouse.getYRelative(elementTop);
		}
		
		var collision = CB_Collisions.isPointOverLine(mouseX, mouseY, lineX1, lineY1, lineX2, lineY2, tolerance);
		
		return collision;
	}


	/**
	 * Tells whether the mouse is over a given line segment or not.
	 *  @function
	 *  @param {number} lineX1 - The X coordinate (horizontal position) of the first pixel of the line segment.
	 *  @param {number} lineY1 - The Y coordinate (vertical position) of the first pixel of the line segment.
	 *  @param {number} lineX2 - The X coordinate (horizontal position) of the second pixel of the line segment.
	 *  @param {number} lineY2 - The Y coordinate (vertical position) of the second pixel of the line segment.
	 *  @param {number} [tolerance=1] - The amount of loss of precision we can tolerate to consider a collision.
	 *  @param {Element} [element] - If a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} is given, the mouse coordinates will be calculated relatively to the position of this [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}.
	 *  @returns {boolean} Returns whether the mouse is over the given line segment or not.
	 *  @todo Think about using a "width" parameter (apart from the "tolerance" parameter).
	 */
	CB_Mouse.isOverSegment = function(lineX1, lineY1, lineX2, lineY2, tolerance, element)
	{
		if (typeof(tolerance) === "undefined" || tolerance === null) { tolerance = 1; }
		
		var mouseX = CB_Mouse.getX();
		var mouseY = CB_Mouse.getY();

		if (typeof(element) !== "undefined" && element !== null)
		{
			var elementLeft = CB_Elements.getLeft(element);
			var elementTop = CB_Elements.getTop(element);
			
			mouseX = CB_Mouse.getXRelative(elementLeft);
			mouseY = CB_Mouse.getYRelative(elementTop);
		}
		
		var collision = CB_Collisions.isPointOverSegment(mouseX, mouseY, lineX1, lineY1, lineX2, lineY2, tolerance);
		
		return collision;
	}


	/**
	 * Tells whether the mouse is over a given rectangle or not.
	 *  @function
	 *  @param {number} rectangleX - The X coordinate (horizontal position) of the first pixel of the rectangle (upper left corner).
	 *  @param {number} rectangleY - The Y coordinate (vertical position) of the first pixel of the rectangle (upper left corner).
	 *  @param {number} rectangleWidth - The width of the rectangle in pixels.
	 *  @param {number} rectangleHeight - The height of the rectangle in pixels.
	 *  @param {Element} [element] - If a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} is given, the mouse coordinates will be calculated relatively to the position of this [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}.
	 *  @returns {boolean} Returns whether the mouse is over the given rectangle or not.
	 */
	CB_Mouse.isOverRectangle = function(rectangleX, rectangleY, rectangleWidth, rectangleHeight, element)
	{
		var mouseX = CB_Mouse.getX();
		var mouseY = CB_Mouse.getY();

		if (typeof(element) !== "undefined" && element !== null)
		{
			var elementLeft = CB_Elements.getLeft(element);
			var elementTop = CB_Elements.getTop(element);
			
			mouseX = CB_Mouse.getXRelative(elementLeft);
			mouseY = CB_Mouse.getYRelative(elementTop);
		}
		
		var collision = CB_Collisions.isPointOverRectangle(mouseX, mouseY, rectangleX, rectangleY, rectangleWidth, rectangleHeight);
		
		return collision;
	}


	/**
	 * Tells whether the mouse is over a given circle or not.
	 *  @function
	 *  @param {number} centreX - The X coordinate (horizontal position) of the center of the circle in pixels.
	 *  @param {number} centreY - The Y coordinate (vertical position) of the center of the circle in pixels.
	 *  @param {number} radius - The radius of the circle in pixels.
	 *  @param {Element} [element] - If a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} is given, the mouse coordinates will be calculated relatively to the position of this [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}.
	 *  @returns {boolean} Returns whether the mouse is over the given circle or not.
	 *  @
	 */
	CB_Mouse.isOverCircle = function(centreX, centreY, radius, element)
	{
		var mouseX = CB_Mouse.getX();
		var mouseY = CB_Mouse.getY();

		if (typeof(element) !== "undefined" && element !== null)
		{
			var elementLeft = CB_Elements.getLeft(element);
			var elementTop = CB_Elements.getTop(element);
			
			mouseX = CB_Mouse.getXRelative(elementLeft);
			mouseY = CB_Mouse.getYRelative(elementTop);
		}
		
		var collision = CB_Collisions.isPointOverCircle(mouseX, mouseY, centreX, centreY, radius);
		
		return collision;
	}

	
	/**
	 * Hides the mouse cursor in a given [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} by changing its internal CSS code of the [style.cursor]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor} property.
	 *  @function
	 *  @param {Element} [element=document.body] - If a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} is given, the mouse cursor will be hidden when it is over this [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}. Otherwise, it will be hidden in the whole document (using [document.body]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/body} as element).
	 *  @param {boolean} [recursive=true] - If it is set to true, all the child [DOM elements]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} will also be affected.
	 *  @todo Check whether the path used in the "url" is right or not (now it uses the {@link CB_scriptPath} variable).
	 */
	CB_Mouse.hide = function(element, recursive)
	{
		var CSS = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2P4//8/IwAI/QL/+TZZdwAAAABJRU5ErkJggg=='), url(" + CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/cursors/almost_blank.png), url(" + CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/cursors/blank.gif), url(" + CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/cursors/blank.cur), none";
		if (CB_Client.getBrowser() === "Explorer")
		{
			CSS = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2P4//8/IwAI/QL/+TZZdwAAAABJRU5ErkJggg=='), url(" + CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/cursors/blank.cur), url(" + CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/cursors/blank.gif), url(" + CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/cursors/almost_blank.png), none";
		}
		CB_Mouse.setCSS(CSS, element, recursive);
		//CB_Mouse._showingCursor[element||document.body] = false;
	}


	/**
	 * Restores (unhides) the mouse cursor in a given [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} by changing its internal CSS code of the [style.cursor]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor} property to the default one (using "default" as the CSS code).
	 *  @function
	 *  @param {Element} [element=document.body] - If a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} is given, the mouse cursor will be restored (unhidden) when it is over this [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}. Otherwise, it will be restored (unhidden) in the whole document (using [document.body]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/body} as the "element").
	 *  @param {boolean} [recursive=true] - If it is set to true, all the child [DOM elements]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} will also be affected.
	 */
	CB_Mouse.restore = function(element, recursive)
	{
		var CSS = "default";
		CB_Mouse.setCSS(CSS, element, recursive);
		//CB_Mouse._showingCursor[element||document.body] = true;
	}
	

	/*
	CB_Mouse.isShowing = function(element)
	{
		return CB_Mouse._showingCursor[element||document.body];
	}
	*/
	
	
	/**
	 * Sets the desired CSS code for the [style.cursor]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor} property of the given [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}.
	 *  @function
	 *  @param {string} [CSS=""] - CSS code for the [style.cursor]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor} property of the given [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}. If not given, an empty string will be used.
	 *  @param {Element} [element=document.body] - If a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} is given, the CSS code updated will affect the given [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}. Otherwise, it will affect the whole document (using [document.body]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/body} as the "element").
	 *  @param {boolean} [recursive=true] - If it is set to true, all the child [DOM elements]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} will also be affected.
	 */
	CB_Mouse.setCSS = function(CSS, element, recursive)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(CSS) === "undefined" || CSS === null) { CSS = ""; }
		if (typeof(element) === "undefined" || element === null) { element = document.body; }
		if (typeof(recursive) === "undefined" || recursive === null) { recursive = true; } //It is recursive by default.
		
		//Sets the CSS style for the given element:
		if (typeof(element) !== "undefined" && element !== null && typeof(element.style) !== "undefined" && element.style !== null)
		{
			element.style.cursor = CSS;
		}
		
		//If it is recursive, it affects the children of the given element:
		if (recursive)
		{
			var elementsChildren = element.childNodes;        
			var elementsChildrenLength = elementsChildren.length;
			for (var x = 0; x < elementsChildrenLength; x++)
			{
				CB_Mouse.setCSS(CSS, elementsChildren[x], true);
			}
		}
	}
	
	
	/**
	 * Uses an [IMG element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img} inside a [DIV element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div} (fakes the cursor) to simulate the mouse cursor (following its movements). If it was already called before and a fake cursor is already being used, the {@link CB_Mouse.CursorImage.hide} function must be called before in order to start using a different fake cursor image.
	   <br />
	   Caution: Performance could be dramatically decreased while using this workaround.
	 *  @function
	 *  @param {boolean} [showCursorImage=true] - If set to true and a valid cursor image is given, the fake cursor functionality will be used. Otherwise, the fake cursor will stop being used.
	 *  @param {string} [cursorImage] - If a valid image path is given and "showCursorImage" is set to true, the fake cursor functionality will be used with the given image. Otherwise, the fake cursor will stop being used.
	 *  @param {number} [cursorImageWidth=32] - Width in pixels of the cursor image.
	 *  @param {number} [cursorImageHeight=32] - Height in pixels of the cursor image.
	 *  @param {boolean} [hideNormalCursor=true] - If set to true, hides the system cursor (calls the {@link CB_Mouse.hide} function internally). Otherwise, shows the system cursor (calls the {@link CB_Mouse.restore} function internally).
	 *  @param {boolean} [isSprite=false] - Defines whether the cursor will be animated (using sprites) or not. If so, the cursorImage must be an image containing sprites horizontally (their individual width is defined by the "cursorImageWidth" parameter). Once the last sprite is reached, it returns to the first one automatically and continues to the next one again (without stopping).
	 *  @param {number} [numberOfFrames=1] - Number of frames (sprites) being used from the cursor image ("cursorImage" parameter). Used when the "isSprite" parameter is set to true.
	 *  @param {number} [framesMs=100] - Number of milliseconds between each frame (between one sprite and next one). Used when the "isSprite" parameter is set to true.
	 *  @param {Element} [divElement=CB_Elements.id("CB_fakeCursorImageDiv")] - The ID of the [DIV element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div} that will contain the image of the fake cursor (uses a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} with "CB_fakeCursorImageDiv" ID by default).
	 *  @param {Element} [imageElement=CB_Elements.id("CB_fakeCursorImage")] - The ID of the [IMG element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img} that will contain the fake cursor (uses a [DOM element]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement} with "CB_fakeCursorImage" ID by default).
	 *  @todo Allow defining an "onMove" parameter (a callback) to be able to call the "move" method with non-default parameters, etc.
	 */
	CB_Mouse.CursorImage.set = function(showCursorImage, cursorImage, cursorImageWidth, cursorImageHeight, hideNormalCursor, isSprite, numberOfFrames, framesMs, divElement, imageElement)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(showCursorImage) === "undefined" || showCursorImage === null) { showCursorImage = true; } //Shows the image by default.
		if (typeof(hideNormalCursor) === "undefined" || hideNormalCursor === null) { hideNormalCursor = true; } //Hides the cursor by default (unless we want to hide the image).
		if (typeof(cursorImageWidth) === "undefined" || cursorImageWidth === null) { cursorImageWidth = 32; } //If not set, uses the default width.
		if (typeof(cursorImageHeight) === "undefined" || cursorImageHeight === null) { cursorImageHeight = 32; } //If not set, uses the default height.
		if (typeof(numberOfFrames) === "undefined" || numberOfFrames === null) { numberOfFrames = 1; } //By default, the number of frames is only one.
		if (typeof(framesMs) === "undefined" || framesMs === null) { framesMs = 100; } //Sets the number of milliseconds between frames by default.
		
		//Select the image element or creates it if it doesn't exist yet:
		var CB_fakeCursorImageDiv = divElement || CB_Elements.id("CB_fakeCursorImageDiv");
		var CB_fakeCursorImage = imageElement || CB_Elements.id("CB_fakeCursorImage");
		if (typeof(CB_fakeCursorImageDiv) === "undefined" || CB_fakeCursorImageDiv === null || typeof(CB_fakeCursorImage) === "undefined" || CB_fakeCursorImage === null)
		{
			CB_fakeCursorImageDiv = document.createElement("div"); //Creathes the DIV element.
			CB_fakeCursorImageDiv.setAttribute("id", "CB_fakeCursorImageDiv"); //Sets DIV element id.
			CB_fakeCursorImage = document.createElement("img"); //Creathes the IMG element.
			CB_fakeCursorImage.setAttribute("id", "CB_fakeCursorImage"); //Sets IMG element id.
			CB_fakeCursorImageDiv.style.position = CB_fakeCursorImage.style.position = "absolute"; //DIV and IMG position is absolute.
			CB_fakeCursorImageDiv.style.visibility = "hidden"; //First it will be hidden.
			CB_fakeCursorImageDiv.style.zIndex = CB_fakeCursorImage.style.zIndex = 999999;
			
			CB_fakeCursorImageDiv.style.overflow = "hidden";
			
			CB_fakeCursorImageDiv.appendChild(CB_fakeCursorImage); //DIV will contains the IMG element.
			document.body.appendChild(CB_fakeCursorImageDiv); //BODY will contains the DIV.
		}
		
		//If we don't want to show the image (or the image has not been given), we hide it:
		if (!showCursorImage || typeof(cursorImage) === "undefined" || cursorImage === null)
		{
			CB_fakeCursorImageDiv.style.visibility = "hidden";
			CB_Mouse.CursorImage._showCursorImage = false;
			CB_Mouse.CursorImage._cursorImageSpriteAnimation(false); //Stops the possible sprite animation.

			//If set, restores the normal cursor:
			if (!hideNormalCursor) { CB_Mouse.restore(); }
		}
		//...otherwise, forces it to follow the cursor:
		else if (!CB_Mouse.CursorImage._showCursorImage)
		{
			//Sets the image given as the SRC:
			if (CB_fakeCursorImage.src !== cursorImage)
			{
				CB_fakeCursorImage.src = cursorImage;
			}

			//The image (sprite or not) has to start with 0px in its left:
			CB_fakeCursorImage.style.left = "0px";
			
			//Sets the proper width and height:
			if (isSprite) //If it is a sprite, the IMG will be wider than the DIV:
			{
				CB_fakeCursorImageDiv.style.width = cursorImageWidth + "px";
				CB_fakeCursorImage.style.width = (cursorImageWidth * numberOfFrames) + "px";
				CB_fakeCursorImageDiv.style.height = CB_fakeCursorImage.style.height = cursorImageHeight + "px";
			}
			else //...otherwise, if it is not a sprite, the use of pixels is not mandatory:
			{
				if (!isNaN(cursorImageWidth)) { cursorImageWidth += "px"; } //If it is a number, they are considered pixels.
				if (!isNaN(cursorImageHeight)) { cursorImageHeight += "px"; } //If it is a number, they are considered pixels.
				CB_fakeCursorImageDiv.style.width = CB_fakeCursorImage.style.width = cursorImageWidth;
				CB_fakeCursorImageDiv.style.height = CB_fakeCursorImage.style.height = cursorImageHeight;
			}
			
			//Forces the image to follow the cursor:
			CB_Mouse.CursorImage._showCursorImage = true;
			
			//Stores the DIV and IMG elements:
			CB_Mouse.CursorImage._cursorImageDiv = CB_fakeCursorImageDiv;
			CB_Mouse.CursorImage._cursorImage = CB_fakeCursorImage;

			//Refreshes the image coordinates:
			CB_Mouse.CursorImage.move();
			
			//Show the image:
			CB_fakeCursorImageDiv.style.visibility = "visible";

			//If set, hides the cursor:
			if (hideNormalCursor) { CB_Mouse.hide(); }
			//...otherwise, shows it:
			else { CB_Mouse.restore(); }

			//If it is a sprite, starts the animation:
			if (isSprite)
			{
				CB_Mouse.CursorImage._cursorImageSpriteAnimation(true, cursorImageWidth, numberOfFrames, framesMs);
			}
		}
	}

	
	/**
	 * Gets the [DIV element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div} that contains the [IMG element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img} of the fake cursor (if any).
	 *  @function
	 *  @returns {Element} Returns the [DIV element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div} that contains the [IMG element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img} of the fake cursor (if any).
	 */
	CB_Mouse.CursorImage.get = function()
	{
		return CB_Mouse.CursorImage._cursorImageDiv;		
	}
	
	
	/**
	 * Gets the [IMG element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img} of the fake cursor (if any).
	 *  @function
	 *  @returns {Element} Returns the [IMG element]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img} of the fake cursor (if any).
	 */
	CB_Mouse.CursorImage.getImage = function()
	{
		return CB_Mouse.CursorImage._cursorImage;
	}
	
	
	//Tells whether the fake cursor is showing or not:
	/*
	CB_Mouse.CursorImage.isShowing = function()
	{
		return CB_Mouse.CursorImage._showCursorImage;
	}
	*/
	
	
	/**
	 * Hides the fake cursor image.
	 *  @function
	 *  @param {boolean} [showNormalCursor=true] - If set to true, restores (shows) the system cursor (calls the {@link CB_Mouse.restore} function internally).
	 */
	CB_Mouse.CursorImage.hide = function(showNormalCursor)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(showNormalCursor) === "undefined" || showNormalCursor === null) { showNormalCursor = true; } //Shows normal cursor by default.
		
		//If it is being displayed, hides the fake cursor image:
		if (CB_Mouse.CursorImage._showCursorImage)
		{
			CB_Mouse.CursorImage.set(false, null, null, null, !showNormalCursor);
		}
	}
	

	/**
	 * Moves the fake cursor image (if it is not hidden). Automatically called when the [onMouseMove]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event} event is fired.
	 *  @function
	 *  @param {number} [x=CB_Mouse.getX(null, false)] - The X coordinate (horizontal position) in pixels where the fake cursor image wants to be moved to. If not provided, it will use the value returned by calling CB_Mouse.getX(null, false) internally.
	 *  @param {number} [y=CB_Mouse.getY(null, false)] - The Y coordinate (vertical position) in pixels where the fake cursor image wants to be moved to. If not provided, it will use the value returned by calling CB_Mouse.getY(null, false) internally.
	 */
	CB_Mouse.CursorImage.move = function(x, y)
	{
		if (CB_Mouse.CursorImage._showCursorImage)
		{
			if (typeof(CB_Mouse.CursorImage._cursorImageDiv) !== "undefined" && CB_Mouse.CursorImage._cursorImageDiv !== null)
			{
				CB_Mouse.CursorImage._cursorImageDiv.style.left = (x || CB_Mouse.getX(null, false)) + "px";
				CB_Mouse.CursorImage._cursorImageDiv.style.top = (y || CB_Mouse.getY(null, false)) + "px";
			}
		}
	}
	
	
	//Starts or stops the sprite animation for the fake cursor image:
	CB_Mouse.CursorImage._cursorImageSpriteAnimation = function(runAnimation, cursorImageWidth, numberOfFrames, framesMs)
	{
		//If the number of frames is 1, it doesn't need to do anything:
		if (numberOfFrames <= 1) { return; }
		
		//If set, stops the animation:
		if (!runAnimation)
		{
			clearTimeout(CB_Mouse.CursorImage._cursorImageSpriteAnimationTimeout);
			CB_Mouse.CursorImage._cursorImageSpriteAnimationTimeout = null;
		}
		//...otherwise, the animation starts or continues it:
		else
		{
			//Continues to next frame after the given milliseconds:
			CB_Mouse.CursorImage._cursorImageSpriteAnimationTimeout =
				CB_symmetricCall
				(
					function()
					{
						if (CB_Mouse.CursorImage._cursorImageSpriteAnimationTimeout !== null)
						{
							var cursorImageLeft = CB_Elements.getStylePropertyInteger(CB_Mouse.CursorImage._cursorImage, "left")[0] - cursorImageWidth;
							cursorImageLeft %= (cursorImageWidth * numberOfFrames);
							CB_Mouse.CursorImage._cursorImage.style.left = cursorImageLeft + "px";

							CB_Mouse.CursorImage._cursorImageSpriteAnimation(runAnimation, cursorImageWidth, numberOfFrames, framesMs);
						}
					},
					framesMs,
					"CB_MOUSE_CURSOR_IMAGE"
				);
		}
	}
} //End of the static class CB_Mouse.