/**
 * @file Screen management. Contains the {@link CB_Screen} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */


/**
 * Static class to manage the screen. It will return itself if it is tried to be instantiated. It can use [detect-zoom]{@link https://github.com/tombigel/detect-zoom} and [NoSleep.js]{@link https://github.com/richtr/NoSleep.js?utm_source=recordnotfound.com}.
 * @namespace
 */
var CB_Screen = function() { return CB_Screen; };
{
	CB_Screen._screenWidth = 0; //Screen width resolution.
	CB_Screen._screenHeight = 0; //Screen height resolution.
	CB_Screen._previousScreenWidth = 0; //Previous screen width resolution.
	CB_Screen._previousScreenHeight = 0; //Previous screen height resolution.
	CB_Screen._screenAvailableWidth = 0; //Screen available width resolution.
	CB_Screen._screenAvailableHeight = 0; //Screen available height resolution.
	CB_Screen._previousScreenAvailableWidth = 0; //Previous screen available width resolution.
	CB_Screen._previousScreenAvailableHeight = 0; //Previous screen available height resolution.
	CB_Screen._windowWidth = 0; //Window width resolution.
	CB_Screen._windowHeight = 0; //Window height resolution.
	CB_Screen._previousWindowWidth = 0; //Previous window width resolution.
	CB_Screen._previousWindowHeight = 0; //Previous window height resolution.
	CB_Screen._screenColorDepth = 0; //Screen color depth.
	CB_Screen._scrollLeft = null; //Left scroll value.
	CB_Screen._scrollTop = null; //Top scroll value.
	CB_Screen._previousScrollLeft = null; //Previous left scroll value.
	CB_Screen._previousScrollTop = null; //Previous top scroll value.
	CB_Screen._zoom = 1; //Zoom applied to the web.
	CB_Screen._pixelRatio = 1; //Pixel ratio multiplied by the zoom.
	CB_Screen._previousZoom = 0; //Zoom applied to the web.
	CB_Screen._previousPixelRatio = 0; //Pixel ratio multiplied by the zoom.
	CB_Screen._isLandscape = null; //Tells whether web is displayed in landscape or portrait position.
	CB_Screen._isVisible = null; //Tells whether web is visible or not.
	CB_Screen._isFocused = null; //Tells whether web is focused or not (has lost the focus).
	CB_Screen._isFullScreen = null; //Tells whether full screen mode is enabled or not.
	CB_Screen._screenLock = null; //Keeps the MozWakeLock object to be able to release the lock related with the screen (so far, only works in Firefox/Firefox OS).
	CB_Screen._noSleep = null; //Keeps the last NoSleep object for the NoSleep.js library.
	CB_Screen._noSleepEnabled = false; //Boolean to keeps the status of the noSleep.js object (enabled or disabled).
	
	CB_Screen._eventsHolder = {}; //Keeps the functions to fire for every special event (if any).
	/*
	CB_Screen.onResizeFunction; //Function that is executed when window is resized (onResize event).
	CB_Screen.onScrollLeftFunction; //Function that is executen when scroll left is changed.
	CB_Screen.onScrollTopFunction; //Function that is executen when scroll top is changed.
	CB_Screen.onVisibilityChangeFunction; //Function that is executed when window gets or losts the visibility.
	CB_Screen.onFocusChangeFunction; //Function that is executed when window gets or losts the focus.
	CB_Screen.onResizeOrZoomFunction; //Function that is executed when window is resized or zoom is applied.
	CB_Screen.onOrientationChangeFunction; //Function that is executed when orientation changes (landscape or portrait).
	CB_Screen.onFullScreenChangeFunction; //Function that is executed when full screen mode changes.
	*/
	
	CB_Screen._storedScreenWidth = 0; //Old screen available width resolution (internal use only).
	CB_Screen._storedScreenHeight = 0; //Old screen available height resolution (internal use only).
	CB_Screen._storedScreenAvailableWidth = 0; //Old screen available width resolution (internal use only).
	CB_Screen._storedScreenAvailableHeight = 0; //Old screen available height resolution (internal use only).
	CB_Screen._storedWindowWidth = 0; //Old window width resolution (internal use only).
	CB_Screen._storedWindowHeight = 0; //Old window height resolution (internal use only).
	CB_Screen._storedZoom = 0; //Zoom applied to the web.
	CB_Screen._storedPixelRatio = 0; //Pixel ratio multiplied by the zoom.

	CB_Screen._refreshTimeout = null; //It will store the timeout that refresh screen properties all the time.
	CB_Screen.initialized = false; //It will tells whether the object has been initialized or not.


	//Initializes all values:
	CB_Screen.init = function()
	{
		if (CB_Screen.initialized) { return CB_Screen; }

		//Sets that the object has already been initialized:
		CB_Screen.initialized = true;
		
		//Stores first values for both old window width and height:
		CB_Screen._storedScreenWidth = CB_Screen._screenWidth;
		CB_Screen._storedScreenHeight = CB_Screen._screenHeight;
		CB_Screen._storedScreenAvailableWidth = CB_Screen._screenAvailableWidth;
		CB_Screen._storedScreenAvailableHeight = CB_Screen._screenAvailableHeight;
		CB_Screen._storedWindowWidth = CB_Screen._windowWidth;
		CB_Screen._storedWindowHeight = CB_Screen._windowHeight;
		
		//It also stores for both zoom level and pixel ratio:
		CB_Screen._storedZoom = CB_Screen._zoom;
		CB_Screen._storedPixelRatio = CB_Screen._pixelRatio;

		//Sets the handler for the scroll event:
		CB_Events.add(window, "scroll", function() { CB_Screen.getScrollTop(); CB_Screen.getScrollLeft(); }, true, true,	false);
		
		//It will check all the time if visibility changes:
		CB_Screen._isVisible = true; //By default, window is visible. NOTE: this can produce a false positive if the script is loading being not visible.
		if ("hidden" in document) { CB_Events.add(document, "visibilitychange", CB_Screen._visibilityChanged, true, true, false); } //document.addEventListener("visibilitychange", CB_Screen._visibilityChanged); }
		else if ("mozHidden" in document) { CB_Events.add(document, "mozvisibilitychange", CB_Screen._visibilityChanged, true, true, false); } //document.addEventListener("mozvisibilitychange", CB_Screen._visibilityChanged); }
		else if ("webkitHidden" in document) { CB_Events.add(document, "webkitvisibilitychange", CB_Screen._visibilityChanged, true, true, false); } //document.addEventListener("webkitvisibilitychange", CB_Screen._visibilityChanged); }
		else if ("msHidden" in document) { CB_Events.add(document, "msvisibilitychange", CB_Screen._visibilityChanged, true, true, false); } // document.addEventListener("msvisibilitychange", CB_Screen._visibilityChanged); }
		//else if ("onfocusin" in document) { document.onfocusin = document.onfocusout = CB_Screen._visibilityChanged; }
		//else if ("onfocusin" in document) { document.onfocusin = document.onfocusout = function() { CB_Screen._visibilityChanged(); CB_Screen._focusChanged(); } }
		//else { window.onfocus = window.onblur = CB_Screen._visibilityChanged; }
		//else { window.onfocus = window.onblur = function() { CB_Screen._visibilityChanged(); CB_Screen._focusChanged(); } }
		
		//It will check all the time if focus changes:
		CB_Screen._isFocused = true; //By default, window is focused. NOTE: this can produce a false positive if the script is loading being not visible.
		
		
		var focusOrBlurEventWorks = false;
		try //Using catch due some web clients doesn't allow to manipulate the window object of parent iframes:
		{
			CB_Events.add(CB_Client.getWindow(), "focus", function() { focusOrBlurEventWorks = true; CB_Screen._focusChanged(true); }, true, true, false);
			CB_Events.add(CB_Client.getWindow(), "blur", function() { focusOrBlurEventWorks = true; CB_Screen._focusChanged(false); }, true, true, false);
		}
		catch(E)
		{
			CB_Events.add(window, "focus", function() { focusOrBlurEventWorks = true; CB_Screen._focusChanged(true); }, true, true, false);
			CB_Events.add(window, "blur", function() { focusOrBlurEventWorks = true; CB_Screen._focusChanged(false); }, true, true, false);
		}
		
		CB_Events.add(document, "mousedown", function() { if (focusOrBlurEventWorks) { return; } CB_Screen._focusChanged(true); }, true, true, false); //Mouse click will set focus too (IE8 fix).
		CB_Events.add(document, "click", function() { if (focusOrBlurEventWorks) { return; } CB_Screen._focusChanged(true); }, true, true, false); //Click will set focus too (IE8 fix).
		//CB_Events.add(document, "keydown", function() { if (focusOrBlurEventWorks) { return; } CB_Screen._focusChanged(true); }, true, true, false); //Key down event will set focus too (IE8 fix).
		//CB_Events.add(document, "mousemove", function() { if (focusOrBlurEventWorks) { return; } CB_Screen._focusChanged(true); }, true, true, false); //Mouse movemenet will set focus too (IE8 fix).
		
		//Starts running the loop:
		CB_Screen._mainLoop();
		
		return CB_Screen;
	}

	
	//Loop to watch the screen changes:
	CB_Screen._mainLoop = function()
	{
		//Cancels the timeout (if any):
		clearTimeout(CB_Screen._refreshTimeout);

		CB_Screen.getWidth(); //Defines screen width resolution.
		CB_Screen.getHeight(); //Defines screen height resolution.
		CB_Screen.getWidthPrevious(); //Defines previous window width resolution.
		CB_Screen.getHeightPrevious(); //Defines previous window height resolution.
		CB_Screen.getAvailableWidth(); //Defines screen available width resolution.
		CB_Screen.getAvailableHeight(); //Defines screen available height resolution.
		CB_Screen.getAvailableWidthPrevious(); //Defines previous window width resolution.
		CB_Screen.getAvailableHeightPrevious(); //Defines previous window height resolution.
		CB_Screen.getWindowWidth(); //Defines window width resolution.
		CB_Screen.getWindowHeight(); //Defines window height resolution.
		CB_Screen.getWindowWidthPrevious(); //Defines previous window width resolution.
		CB_Screen.getWindowHeightPrevious(); //Defines previous window height resolution.
		CB_Screen.getColorDepth(); //Defines screen color depth.
		//CB_Screen.getScrollLeft(); //Defines scroll left (and executes defined function if it changes).
		//CB_Screen.getScrollTop(); //Defines scroll top (and executes defined function if it changes).
		CB_Screen.getZoom(); //Defines zoom level.
 		CB_Screen.getPixelRatio(); //Defines pixel ratio multiplied by the zoom level.
		CB_Screen.isLandscape(); //Defines whether device is in landscape or portrait position (and executes defined function if it changes).
		CB_Screen.isFullScreen(); //Defines whether it's in full screen mode or not (and executes defined function if it changes).
		
		//Executes the function defined for Resize and Zoom events (if any):
		CB_Screen._processOnResizeOrZoomFunction();

		//Executes the function defined for Full screen change event (if any):
		//CB_Screen.onFullScreenChangeFunction(CB_Screen.onFullScreenChangeFunction, false);
		
		//Executes the function again:
		CB_Screen._refreshTimeout = setTimeout(CB_Screen._mainLoop, 1); //Calls itself again to update values all the time.
	}
	
	
	/**
	 * Gets the current screen width (horizontal resolution). Uses the [window.screen.width]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/width} property internally, when possible.
	 *  @function
	 *  @returns {number} Returns the current screen width (horizontal resolution) in pixels.
	 */
	CB_Screen.getWidth = function()
	{
		if (screen && screen.width && !isNaN(screen.width))
		{
			CB_Screen._screenWidth = screen.width;
		}

		return CB_Screen._screenWidth;
	}


	/**
	 * Gets the current screen height (vertical resolution). Uses the [window.screen.height]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/height} property internally, when possible.
	 *  @function
	 *  @returns {number} Returns the current screen height (vertical resolution) in pixels.
	 */
	CB_Screen.getHeight = function()
	{
		if (screen && screen.height && !isNaN(screen.height))
		{
			CB_Screen._screenHeight = screen.height;
		}

		return CB_Screen._screenHeight;
	}


	/**
	 * Gets the previous screen width (horizontal resolution). Calculated through the [window.screen.width]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/width} property internally, when possible. Useful when the resolution (screen size and/or orientation) changed.
	 *  @function
	 *  @returns {number} Returns the previous screen width (horizontal resolution) in pixels.
	 */
	CB_Screen.getWidthPrevious = function()
	{
		if (CB_Screen._previousScreenWidth === 0) { CB_Screen._previousScreenWidth = CB_Screen.getWidth(); }
		return CB_Screen._previousScreenWidth;
	}


	/**
	 * Gets the previous screen height (vertical resolution). Calculated through the [window.screen.height]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/height} property internally, when possible. Useful when the resolution (screen size and/or orientation) changed.
	 *  @function
	 *  @returns {number} Returns the previous screen height (vertical resolution) in pixels.
	 */
	CB_Screen.getHeightPrevious = function()
	{
		if (CB_Screen._previousScreenHeight === 0) { CB_Screen._previousScreenHeight = CB_Screen.getHeight(); }
		return CB_Screen._previousScreenHeight;
	}


	/**
	 * Gets the current available screen width (horizontal resolution). Uses the [window.screen.availWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/availWidth} property internally, when possible.
	 *  @function
	 *  @returns {number} Returns the current available screen width (horizontal resolution) in pixels.
	 */
	CB_Screen.getAvailableWidth = function()
	{
		if (screen && screen.availWidth && !isNaN(screen.availWidth))
		{
			CB_Screen._screenAvailableWidth = screen.availWidth;
		}

		return CB_Screen._screenAvailableWidth;
	}


	/**
	 * Gets the current available screen height (vertical resolution). Uses the [window.screen.availHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/availHeight} property internally, when possible.
	 *  @function
	 *  @returns {number} Returns the current available screen height (vertical resolution) in pixels.
	 */
	CB_Screen.getAvailableHeight = function()
	{
		if (screen && screen.availHeight && !isNaN(screen.availHeight))
		{
			CB_Screen._screenAvailableHeight = screen.availHeight;
		}

		return CB_Screen._screenAvailableHeight;
	}


	/**
	 * Gets the previous available screen width (horizontal resolution). Useful when the resolution (screen size and/or orientation) changed. Uses the [window.screen.availWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/availWidth} property internally, when possible.
	 *  @function
	 *  @returns {number} Returns the previous available screen width (horizontal resolution) in pixels.
	 */
	CB_Screen.getAvailableWidthPrevious = function()
	{
		if (CB_Screen._previousScreenAvailableWidth === 0) { CB_Screen._previousScreenAvailableWidth = CB_Screen.getAvailableWidth(); }
		return CB_Screen._previousScreenAvailableWidth;
	}


	/**
	 * Gets the previous available screen height (vertical resolution). Useful when the resolution (screen size and/or orientation) changed. Uses the [window.screen.availHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/availHeight} property internally, when possible.
	 *  @function
	 *  @returns {number} Returns the previous available screen height (vertical resolution) in pixels.
	 */
	CB_Screen.getAvailableHeightPrevious = function()
	{
		if (CB_Screen._previousScreenAvailableHeight === 0) { CB_Screen._previousScreenAvailableHeight = CB_Screen.getAvailableHeight(); }
		return CB_Screen._previousScreenAvailableHeight;
	}


	/**
	 * Gets the current window width (horizontal resolution). Internally, uses the [window.innerWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth} if possible and fallbacks to [document.documentElement.clientWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth} or [document.body.clientWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth} property otherwise, when possible.
	 *  @function
	 *  @returns {number} Returns the current window width (horizontal resolution) in pixels.
	 */
	CB_Screen.getWindowWidth = function()
	{
		if (window && window.innerWidth && !isNaN(window.innerWidth))
		{
			CB_Screen._windowWidth = window.innerWidth;
		}
		else if (document && document.documentElement && document.documentElement.clientWidth && !isNaN(document.documentElement.clientWidth) && document.documentElement.clientWidth > 0)
     	{
			CB_Screen._windowWidth = document.documentElement.clientWidth;
		}
		else if (document && document.body && document.body.clientWidth && !isNaN(document.body.clientWidth) && document.body.clientWidth > 0)
		{
			CB_Screen._windowWidth = document.body.clientWidth;
		}
		return CB_Screen._windowWidth;
	}


	/**
	 * Gets the current window height (vertical resolution). Internally, uses the [window.innerHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight} if possible and fallbacks to [document.documentElement.clientHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight} or [document.body.clientHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight} property otherwise, when possible.
	 *  @function
	 *  @returns {number} Returns the current window height (vertical resolution) in pixels.
	 */
	CB_Screen.getWindowHeight = function()
	{
		if (window && window.innerHeight && !isNaN(window.innerHeight))
		{
			CB_Screen._windowHeight = window.innerHeight;
		}
		else if (document && document.documentElement && document.documentElement.clientHeight && !isNaN(document.documentElement.clientHeight) && document.documentElement.clientHeight > 0)
     	{
			CB_Screen._windowHeight = document.documentElement.clientHeight;
		}
		else if (document && document.body && document.body.clientHeight && !isNaN(document.body.clientHeight) && document.body.clientHeight > 0)
		{
			CB_Screen._windowHeight = document.body.clientHeight;
		}
		return CB_Screen._windowHeight;
	}


	/**
	 * Gets the previous window width (horizontal resolution). Useful when the resolution (screen size and/or orientation) or window size changed. Internally, uses the [window.innerWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth} if possible and fallbacks to [document.documentElement.clientWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth} or [document.body.clientWidth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth} property otherwise, when possible.
	 *  @function
	 *  @returns {number} Returns the previous window width (horizontal resolution) in pixels.
	 */
	CB_Screen.getWindowWidthPrevious = function()
	{
		if (CB_Screen._previousWindowWidth === 0) { CB_Screen._previousWindowWidth = CB_Screen.getWindowWidth(); }
		return CB_Screen._previousWindowWidth;
	}


	/**
	 * Gets the previous window height (vertical resolution). Useful when the resolution (screen size and/or orientation) or window size changed. Internally, uses the [window.innerHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight} if possible and fallbacks to [document.documentElement.clientHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight} or [document.body.clientHeight]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight} property otherwise, when possible.
	 *  @function
	 *  @returns {number} Returns the previous window height (vertical resolution) in pixels.
	 */
	CB_Screen.getWindowHeightPrevious = function()
	{
		if (CB_Screen._previousWindowHeight === 0) { CB_Screen._previousWindowHeight = CB_Screen.getWindowHeight(); }
		return CB_Screen._previousWindowHeight;
	}


	/**
	 * Gets the current color depth. Uses the [window.screen.colorDepth]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/colorDepth} property internally, when possible.
	 *  @function
	 *  @returns {number} Returns the current color depth.
	 */
	CB_Screen.getColorDepth = function()
	{
		if (screen && screen.colorDepth && !isNaN(screen.colorDepth))
		{
			CB_Screen._screenColorDepth = screen.colorDepth;
		}
		return CB_Screen._screenColorDepth;
	}


	/**
	 * Gets the current scroll left position (horizontal scroll) of the screen (main window). Uses the {@link CB_Elements.getScrollLeftById} function internally.
	 *  @function
	 *  @returns {number|null} Returns the current scroll left position (horizontal scroll) of the screen (main window). It could return null if something fails.
	 */
	CB_Screen.getScrollLeft = function()
	{
		CB_Screen._previousScrollLeft = CB_Screen._scrollLeft;
		return CB_Elements.getScrollLeftById
		(
			window, //elementId
			function(scrollLeft, scrollLeftPrevious, scrollWidth, visiblePixels, scrollRelative, scrollRelativePrevious) //onScrollLeftChanges:
			{
				//If there is any defined function:
				if (typeof(CB_Screen._eventsHolder["onScrollLeft"]) === "function")
				{
					//Sets the new and old positions (just in case the function needs it):
					CB_Screen._previousScrollLeft = CB_Screen._scrollLeft;
					CB_Screen._scrollLeft = scrollLeft;
					
					//Executes the function:
					CB_Screen._eventsHolder["onScrollLeft"]();
				}
			},
			true, //fireFirstTime
			false, //fireAlways
			null, //timeoutMs
			true, //returnNullOnFail
			undefined //timeout
		);
	}


	/**
	 * Gets the current scroll top position (vertical scroll) of the screen (main window). Uses the {@link CB_Elements.getScrollTopById} function internally.
	 *  @function
	 *  @returns {number|null} Returns the current scroll top position (vertical scroll) of the screen (main window). It could return null if something fails.
	 */
	CB_Screen.getScrollTop = function()
	{
		CB_Screen._previousScrollTop = CB_Screen._scrollTop;
		return CB_Elements.getScrollTopById
		(
			window, //elementId
			function(scrollTop, scrollTopPrevious, scrollHeight, visiblePixels, scrollRelative, scrollRelativePrevious) //onScrollTopChanges:
			{
				//If there is any defined function:
				if (typeof(CB_Screen._eventsHolder["onScrollTop"]) === "function")
				{
					//Sets the new and old positions (just in case the function needs it):
					CB_Screen._previousScrollTop = CB_Screen._scrollTop;
					CB_Screen._scrollTop = scrollTop;
					
					//Executes the function:
					CB_Screen._eventsHolder["onScrollTop"]();
				}
			},
			true, //fireFirstTime
			false, //fireAlways
			null, //timeoutMs
			true, //returnNullOnFail
			undefined //timeout
		);
	}


	/**
	 * Gets the current zoom level of the screen (main window). Uses [detect-zoom]{@link https://github.com/tombigel/detect-zoom} internally.
	 *  @function
	 *  @returns {number} Returns the current zoom level of the screen (main window). Default zoom level is 1 (one) even when it fails.
	 *  @todo Find a better and more-compatible way to detect zoom which supports as many web clients as possible.
	 */
	CB_Screen.getZoom = function()
	{
		//if (typeof(detectZoom) !== "undefined" && detectZoom !== null && detectZoom && typeof(detectZoom.zoom) !== "undefined" && detectZoom.zoom !== null && detectZoom.zoom && typeof(detectZoom.zoom) === "function")
		if (typeof(detectZoom) !== "undefined" && detectZoom !== null && typeof(detectZoom.zoom) === "function")
		{
			CB_Screen._zoom = detectZoom.zoom();
			//if (CB_Screen._zoom === null || CB_Screen._zoom === 0 || !CB_Screen._zoom) { CB_Screen._zoom = 1; }
			if (!CB_Screen._zoom) { CB_Screen._zoom = 1; }
		//} else { CB_Screen._zoom = CB_Screen._previousZoom = 0; }
		} else { CB_Screen._zoom = CB_Screen._previousZoom = 1; }
		return CB_Screen._zoom;
	}

	
	/**
	 * Gets the previous zoom level of the screen (main window). Useful when the zoom changed. Uses [detect-zoom]{@link https://github.com/tombigel/detect-zoom} internally.
	 *  @function
	 *  @returns {number} Returns the previous zoom level of the screen (main window). Default previous zoom level is 0 (zero) even when it fails.
	 */
	CB_Screen.getZoomPrevious = function()
	{
		return CB_Screen._previousZoom;
	}
	

	/**
	 * Gets the current pixel ratio of the screen (main window). Uses [detect-zoom]{@link https://github.com/tombigel/detect-zoom} internally.
	 *  @function
	 *  @returns {number} Returns the current pixel ratio of the screen (main window). Default pixel ratio is 1 (one) even when it fails.
	 *  @todo Find a better and more-compatible way to detect pixel ratio which supports as many web clients as possible.
	 */
	CB_Screen.getPixelRatio = function()
	{
		//if (typeof(detectZoom) !== "undefined" && detectZoom !== null && detectZoom && typeof(detectZoom.device) !== "undefined" && detectZoom.device !== null && detectZoom.device && typeof(detectZoom.device) === "function")
		if (typeof(detectZoom) !== "undefined" && detectZoom !== null && typeof(detectZoom.device) === "function")
		{
			CB_Screen._pixelRatio = detectZoom.device();
		//} else { CB_Screen._pixelRatio = CB_Screen._previousPixelRatio = 0; }
			//if (CB_Screen._pixelRatio === null || CB_Screen._pixelRatio === 0 || !CB_Screen._pixelRatio) { CB_Screen._pixelRatio = 1; }
			if (!CB_Screen._pixelRatio) { CB_Screen._pixelRatio = 1; }
		} else { CB_Screen._pixelRatio = CB_Screen._previousPixelRatio = 1; }
		return CB_Screen._pixelRatio;
	}

	
	/**
	 * Gets the previous pixel ratio of the screen (main window). Useful when the zoom/pixel-ratio changed. Uses [detect-zoom]{@link https://github.com/tombigel/detect-zoom} internally.
	 *  @function
	 *  @returns {number} Returns the previous pixel ratio of the screen (main window). Default previous pixel ratio is 0 (zero) even when it fails.
	 *  @todo Find a better and more-compatible way to detect pixel ratio which supports as many web clients as possible.
	 */
	CB_Screen.getPixelRatioPrevious = function()
	{
		return CB_Screen._previousPixelRatio;
	}


	/**
	 * Tells whether the screen (main window) is in landscape position.
	 *  @function
	 *  @returns {boolean} Returns whether the screen is in landscape position.
	 */
	CB_Screen.isLandscape = function()
	{
		var isLandscape = false;
		
		if (CB_Screen.getWindowWidth() > CB_Screen.getWindowHeight())
		{
			isLandscape = true;
		}

		//If it's not the first time and position has been changed, calls the onOrientationChange function (if any):
		if (CB_Screen._isLandscape !== null && CB_Screen._isLandscape !== isLandscape)
		{
			//If there is any defined function:
			if (typeof(CB_Screen._eventsHolder["onOrientationChange"]) === "function")
			{
				//Sets the new position (just in case the function needs it):
				CB_Screen._isLandscape = isLandscape;
				//Executes the function:
				CB_Screen._eventsHolder["onOrientationChange"]();
			}
		}
		
		//Sets the new position:
		CB_Screen._isLandscape = isLandscape;
		
		return CB_Screen._isLandscape;
	}


	//Sets whether the web is visible (called every time that visibility changes):
	CB_Screen._visibilityChanged = function(e)
	{
		var isVisible = true; //By default is visible.

        //if (!e) { e = window.event; }
        e = CB_Events.normalize(e);

//        if (e.type === "focus" || e.type === "focusin")
        {
//            isVisible = true;
        }
//        else if (e.type === "blur" || e.type === "focusout")
        {
//            isVisible = false;
        }
//        else
        {
			var hidden = "";
			if (typeof(document.hidden) !== "undefined")
			{
		    	hidden = "hidden";
			}
			else if (typeof(document.mozHidden) !== "undefined")
			{
			    hidden = "mozHidden";
			}
			else if (typeof document.msHidden !== "undefined")
			{
			    hidden = "msHidden";
			}
			else if (typeof document.webkitHidden !== "undefined")
			{
				hidden = "webkitHidden";
			}
			//if (hidden !== "") { isVisible = document[hidden] ? false : true; }
			if (hidden !== "") { isVisible = !document[hidden]; }
        }

		//Calls the onVisibilityChange function (if any):
		if (typeof(CB_Screen._eventsHolder["onVisibilityChange"]) === "function")
		{
			//Sets the new visibility (just in case the function needs it):
			CB_Screen._isVisible = isVisible;
			//Executes the function:
			CB_Screen._eventsHolder["onVisibilityChange"]();
		}
		
		//Sets the new visibility:
		CB_Screen._isVisible = isVisible;
	}


	/**
	 * Tells whether the main window is visible or not.
	 *  @function
	 *  @returns {boolean} Returns whether the main window is visible or not.
	 */
	CB_Screen.isVisible = function()
	{
		return CB_Screen._isVisible;
	}


/*
	//Called every time that focus is lost:
	CB_Screen.focusLost = function()
	{
		//Focus has not been recovered (yet):
		CB_Screen.focusRecovered = false;
		
		//If focus is not recovered, set as not focused:
		setTimeout(
					function()
					{
						if (!CB_Screen.focusRecovered)
						{
							CB_Screen._focusChanged(false);
						}
					}, 500);

		return;
	}
*/

	//Sets whether the web is focused (called every time that focus changes):
	CB_Screen._focusChanged = function(isFocused)
	{
		//If is focused, the focus has been recovered:
		//if (isFocused) { CB_Screen.focusRecovered = true; }

		//Calls the onFocusChange function (if any):
		if (typeof(CB_Screen._eventsHolder["onFocusChange"]) === "function")
		{
			//Sets whether is focused or not (just in case the function needs it):
			CB_Screen._isFocused = isFocused;
			//Executes the function:
			CB_Screen._eventsHolder["onFocusChange"]();
		}
		
		//Sets whether is focused or not:
		CB_Screen._isFocused = isFocused;
	}


	/**
	 * Tells whether the main window is focused or not.
	 *  @function
	 *  @returns {boolean} Returns whether the main window is focused or not.
	 */
	CB_Screen.isFocused = function()
	{
		return CB_Screen._isFocused;
	}


	/**
	 * Sets the focus to the main window (if possible).
	 *  @function
	 */
	CB_Screen.focus = function()
	{
		//try { CB_Client.getWindow(true).focus(); } catch(E) {}
		CB_Client.getWindow(false).focus();
	}


	/**
	 * Sets a function to execute when the left scroll position (horizontal scroll) is changed in the screen (main window) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired, with no parameters. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 */
	CB_Screen.onScrollLeft = function(callbackFunction, keepOldFunction)
	{
		return CB_Screen._setSpecialEventFunction("onScrollLeft", callbackFunction, keepOldFunction);
	}


	/**
	 * Sets a function to execute when the top scroll position (vertical scroll) is changed in the screen (main window) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired, with no parameters. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 */
	CB_Screen.onScrollTop = function(callbackFunction, keepOldFunction)
	{
		return CB_Screen._setSpecialEventFunction("onScrollTop", callbackFunction, keepOldFunction);
	}


	/**
	 * Sets a function to execute when the screen (main window) orientation is changed (portrait or landscape) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired, with no parameters. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 */
	CB_Screen.onOrientationChange = function(callbackFunction, keepOldFunction)
	{
		return CB_Screen._setSpecialEventFunction("onOrientationChange", callbackFunction, keepOldFunction);
	}


	/**
	 * Sets a function to execute when the screen (main window) visibility is changed or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired, with no parameters. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 */
	CB_Screen.onVisibilityChange = function(callbackFunction, keepOldFunction)
	{
		return CB_Screen._setSpecialEventFunction("onVisibilityChange", callbackFunction, keepOldFunction);
	}


	/**
	 * Sets a function to execute when the screen (main window) focus is changed or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired, with no parameters. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 */
	CB_Screen.onFocusChange = function(callbackFunction, keepOldFunction)
	{
		return CB_Screen._setSpecialEventFunction("onFocusChange", callbackFunction, keepOldFunction);
	}


	/**
	 * Sets a function to execute when the screen (main window) is resized ([onResize]{@link https://developer.mozilla.org/en-US/docs/Web/Events/resize} event) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired, with no parameters. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 */
	CB_Screen.onResize = function(callbackFunction, keepOldFunction, useCapture)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; } //If not set, it keeps old function by default.
		
		//If a function has been sent:
		if (typeof(callbackFunction) === "function")
		{
			//If able, adds the function given to the event:
		    var functionToAdd =
				function()
				{
					CB_Screen.init(); //Updates screen properties.
					if (typeof(callbackFunction) === "function") { return callbackFunction(); }
					return true;
				};
			///////CB_Screen._eventsHolder["onResize"] = functionToAdd;
			CB_Events.add(window, "resize", functionToAdd, useCapture, keepOldFunction, true);
		}
		//...but if the function given is null, it will cancel the event:
		else if (callbackFunction === null)/////// && CB_Screen._eventsHolder["onResize"] !== null)
		{
			//CB_Events.remove(window, "resize", CB_Screen._eventsHolder["onResize"], useCapture);
			CB_Events.removeByName(window, "resize");
			////////CB_Screen._eventsHolder["onResize"] = null;
		}
	}


	//Sets a function to execute when window is resized or zoom is applied:
	CB_Screen._processOnResizeOrZoomFunction = function()
	{
		//If there is no function to process, exits:
		if (typeof(CB_Screen._eventsHolder["onResizeOrZoom"]) !== "function")  { return; }
		
		//If this is the first time, set stored values:
		if (CB_Screen._storedScreenWidth === 0) { CB_Screen._storedScreenWidth = CB_Screen.getWidth(); }
		if (CB_Screen._storedScreenHeight === 0) { CB_Screen._storedScreenHeight = CB_Screen.getHeight(); }
		if (CB_Screen._storedScreenAvailableWidth === 0) { CB_Screen._storedScreenAvailableWidth = CB_Screen.getAvailableWidth(); }
		if (CB_Screen._storedScreenAvailableHeight === 0) { CB_Screen._storedScreenAvailableHeight = CB_Screen.getAvailableHeight(); }
		if (CB_Screen._storedWindowWidth === 0) { CB_Screen._storedWindowWidth = CB_Screen.getWindowWidth(); }
		if (CB_Screen._storedWindowHeight === 0) { CB_Screen._storedWindowHeight = CB_Screen.getWindowHeight(); }
		if (CB_Screen._storedZoom === 0) { CB_Screen._storedZoom = CB_Screen.getZoom(); }
		if (CB_Screen._storedPixelRatio === 0) { CB_Screen._storedPixelRatio = CB_Screen.getPixelRatio(); }

		//If the window has been resized or zoomed, stores the previous values:
		var windowResizedOrZoomed = false;

		if (CB_Screen._storedWindowWidth !== CB_Screen.getWindowWidth() || CB_Screen._storedWindowHeight !== CB_Screen.getWindowHeight() || CB_Screen._storedZoom !== CB_Screen.getZoom() || CB_Screen._storedPixelRatio !== CB_Screen.getPixelRatio())
		{
			//Window has been resized or zoomed:
			windowResizedOrZoomed = true;

			//Stores the previous width and height:
			CB_Screen._previousWindowWidth = CB_Screen._storedWindowWidth;
			CB_Screen._previousWindowHeight = CB_Screen._storedWindowHeight;
			CB_Screen._previousScreenWidth = CB_Screen._storedScreenWidth;
			CB_Screen._previousScreenHeight = CB_Screen._storedScreenHeight;
			CB_Screen._previousScreenAvailableWidth = CB_Screen._storedScreenAvailableWidth;
			CB_Screen._previousScreenAvailableHeight = CB_Screen._storedScreenAvailableHeight;


			//If the zoom has been changed, stores the previous zoom and pixel ratio:
			if (CB_Screen._storedZoom !== CB_Screen.getZoom() || CB_Screen._storedPixelRatio !== CB_Screen.getPixelRatio())
			{
				CB_Screen._previousZoom = CB_Screen._storedZoom;
				CB_Screen._previousPixelRatio = CB_Screen._storedPixelRatio;
			}

			//Stores the current window width and height:
			CB_Screen._storedScreenWidth = CB_Screen.getWidth();
			CB_Screen._storedScreenHeight = CB_Screen.getHeight();
			CB_Screen._storedScreenAvailableWidth = CB_Screen.getAvailableWidth();
			CB_Screen._storedScreenAvailableHeight = CB_Screen.getAvailableHeight();
			CB_Screen._storedWindowWidth = CB_Screen.getWindowWidth();
			CB_Screen._storedWindowHeight = CB_Screen.getWindowHeight();
			
			//Stores the current zoom and pixel ratio:
			CB_Screen._storedZoom = CB_Screen.getZoom();
			CB_Screen._storedPixelRatio = CB_Screen.getPixelRatio();
		}

		//If the window has been resized or zoomed, executes the function:
		if (windowResizedOrZoomed)
		{
			CB_Screen.init(); //It also refresh CB_Screen properties before calling the function.
			CB_Screen._eventsHolder["onResizeOrZoom"](); //Executes the function.
		}
	}

	
	/**
	 * Sets a function to execute when the screen (main window) is resized or the zoom is changed, or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired, with no parameters. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 */
	CB_Screen.onResizeOrZoom = function(onResizeOrZoomFunction, keepOldFunction)
	{
		return CB_Screen._setSpecialEventFunction("onResizeOrZoom", onResizeOrZoomFunction, keepOldFunction);
	}
	

	/**
	 * Sets a function to execute when full screen mode is changed (enabled or disabled) or removes it.
	 *  @function
	 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired, with no parameters. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 */
	CB_Screen.onFullScreenChange = function(onFullScreenChangeFunction, keepOldFunction)
	{
		return CB_Screen._setSpecialEventFunction("onFullScreenChange", onFullScreenChangeFunction, keepOldFunction);
	}
	
	
	//Sets a function to execute when an event happens (a non-existing event on JavaScript):
	CB_Screen._setSpecialEventFunction = function(eventName, eventFunction, keepOldFunction)
	{
		//If no function has been sent, cancel all previous functions and exits:
		if (typeof(eventFunction) !== "function")
		{
			if (eventFunction === null) { CB_Screen._eventsHolder[eventName] = null; }
			return;
		}

		//If not set, it keeps old function by default:
		if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; }
		
		//If we don't want to keep the old function:
		if (!keepOldFunction)
		{
			CB_Screen._eventsHolder[eventName] = eventFunction;
		}
		//...otherwise if we want to keep the old function, we keep it:
		else
		{
			//Stores old function:
			var eventFunctionOld = CB_Screen._eventsHolder[eventName]; //Stores old function of eventFunctionHolder.
			CB_Screen._eventsHolder[eventName] =
				function() //TODO: remember to use "e" in the case it uses parameters in the future.
				{
				   if (typeof(eventFunctionOld) === "function") { eventFunctionOld(); }
				   eventFunction();
				};
		}
	}
	

	/**
	 * Tells whether the web client is compatible with the [FullScreen API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API} or not.
	 *  @function
	 *  @returns {boolean} Returns whether the web client is compatible with the [FullScreen API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API} or not.
	 */
	CB_Screen.isFullScreenAPICompatible = function()
	{
		if (document.documentElement) { element = document.documentElement; }
		else { element = document.body; }
		
		var isFullScreenAPICompatible = false;
		
		//Gets the function compatible with Fullscreen API (if any):
		var callFullScreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen
							|| element.oRequestFullScreen || element.msRequestFullscreen || element.msRequestFullScreen || element.webkitEnterFullScreen
							|| element.webkitEnterFullscreen;

		if (typeof(callFullScreen) !== "undefined" && callFullScreen) { isFullScreenAPICompatible = true; }
		
		return isFullScreenAPICompatible;
	}


	/**
	 * Toggles between full screen and normal mode. Uses the [Fullscreen API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API} and fallbacks to other methods internally, including [NW.js (formerly node-webkit)]{@link https://nwjs.io/} and [Electron (Electron.js)]{@link https://electronjs.org/} ones, when not available. Recommended to be called through an event fired by the user as onclick or ontouchstart, etc.
	 *  @function
	 *  @param {boolean} [useFullScreen=true] - If set to true, it will try to enable full screen mode. Otherwise, it will try to enable normal mode.
	 *  @param {Element} [element=document.documentElement|document.body] - Element which we want to use in full screen mode. By default uses the whole document body. Only used when the "useFullScreen" parameter is set to true. If an element is provided, it will use neither [NW.js (formerly node-webkit)]{@link https://nwjs.io/} nor [Electron (Electron.js)]{@link https://electronjs.org/} methods.
	 *  @param {boolean} [allowReload=false] - If set to true and "useFullScreen" is set to true but it fails to enable full screen normally, it will try to reload the entire current document again in a new bigger window. Useful for very old web clients. Only used when the "useFullScreen" parameter is set to true.
	 */
	CB_Screen.setFullScreen = function(useFullScreen, element, allowReload)
	{
		var documentBase = CB_Client.getDocumentBase();
		
		//Defines default parameters:
		if (typeof(useFullScreen) === "undefined" || useFullScreen === null) { useFullScreen = true; } //By default, full screen mode will be used:
		var elementGiven = true; //Tells whether an element was given or not (useful for NW.js and Electron).
		if (typeof(element) === "undefined" || element === null)
		{
			//if (documentBase.documentElement) { element = documentBase.documentElement; }
			//else { element = documentBase.body; }
			if (document.documentElement) { element = document.documentElement; }
			else { element = document.body; }
			elementGiven = false;
		}

		//If we want full screen mode:
		if (useFullScreen)
		{
			var fullScreenApplied = false;
			
			if (!elementGiven)
			{
				//Tries to use NW.js (node-webkit) if available to enter full screen:
				if (CB_Client.isRunningOnNWjs())
				{
					if (typeof(nw) !== "undefined" && nw !== null && nw.Window && typeof(nw.Window.get) === "function")
					{
						try
						{
							var win = nw.Window.get();
							if (win !== null)
							{
								win.enterFullscreen();
								fullScreenApplied = win.isFullscreen;
								if (!fullScreenApplied)
								{
									win.enterKioskMode();
									fullScreenApplied = win.isKioskMode;
								}
							}
						} catch(E) { fullScreenApplied = false; }
					}
					if (!fullScreenApplied && typeof(require) === "function")
					{
						var gui = require("nw.gui");
						if (typeof(gui) !== "undefined" && gui !== null && typeof(gui.Window) !== "undefined" && gui.Window !== null && typeof(gui.Window.get) === "function")
						{
							try
							{
								var win = gui.Window.get();
								if (win !== null)
								{
									win.enterFullscreen();
									fullScreenApplied = win.isFullscreen;
									if (!fullScreenApplied)
									{
										win.enterKioskMode();
										fullScreenApplied = win.isKioskMode;
									}
								}
							} catch(E) { fullScreenApplied = false; }
						}
					}
				}

				//Tries to use Electron (Electron.js) if available to enter full screen:
				if (CB_Client.isRunningOnElectron() && typeof(require) === "function")
				{
					try
					{
						fullScreenApplied = require("electron").remote.getCurrentWindow().setFullScreen(true);
					}
					catch(E)
					{
						try
						{
							fullScreenApplied = require("electron").remote.getCurrentWindow().setSimpleFullScreen(true);
						}
						catch(E) { fullScreenApplied = false; }
					}
				}
			}
			
			if (!fullScreenApplied)
			{
				//Gets the function compatible with Fullscreen API (if any):
				var callFullScreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen
									|| element.oRequestFullScreen || element.msRequestFullscreen || element.msRequestFullScreen || element.webkitEnterFullScreen
									|| element.webkitEnterFullscreen;

				//If there is any function compatible with Fullscreen API, we call it:
				if (typeof(callFullScreen) !== "undefined" && callFullScreen)
				{
					if (Element.ALLOW_KEYBOARD_INPUT)
					{
						callFullScreen.call(element, Element.ALLOW_KEYBOARD_INPUT); //For Webkit.
					}
					else { callFullScreen.call(element); }
					fullScreenApplied = true;
				}
				//..otherwise, we try to use ActiveX (if it's not already in full screen):
				else if (typeof(window.ActiveXObject) !== "undefined")
				{
					try
					{
						var wscript = new ActiveXObject("WScript.Shell");
						//If ActiveX object has been created:
						if (wscript !== null)
						{
							//ActiveX object working, so we press the key:
							wscript.SendKeys("{F11}");
							fullScreenApplied = true;
						}
					}
					//If ActiveX is not enabled or has not been accepted:
					catch(E) { fullScreenApplied = false; }
				}
			}

			//If the full screen mode has not been applied, we try to resize the window:
			if (!fullScreenApplied)
			{
				/*
				if (typeof(window.fullscreen) !== "undefined")
				{
					try { window.fullscreen = true; }
					catch(E) {  }
				}
				*/

                //if (typeof(top.window.outerWidth) !== "undefined" && typeof(screen.availWidth) !== "undefined" && top.window.outerWidth !== null && screen.availWidth !== null)
                var screenAvailableWidth = CB_Screen.getAvailableWidth();
				if (typeof(top.window.outerWidth) !== "undefined" && top.window.outerWidth !== null && screenAvailableWidth > 0)
                {
					//top.window.outerWidth = screen.availWidth;
					top.window.outerWidth = screenAvailableWidth;
				}
                //if (typeof(top.window.outerHeight) !== "undefined" && typeof(screen.availHeight) !== "undefined" && top.window.outerHeight !== null && screen.availHeight !== null)
                var screenAvailableHeight = CB_Screen.getAvailableHeight();
				if (typeof(top.window.outerHeight) !== "undefined" && top.window.outerHeight !== null && screenAvailableHeight > 0)
                {
					//top.window.outerHeight = screen.availHeight;
					top.window.outerHeight = screenAvailableHeight;
				}

/*				
	var hdiff;
	window.resizeTo(screen.width/2,screen.height/2)
	window.moveTo(0,10)

	hdiff=window.screenTop;
	window.moveTo(-6,-hdiff+6);
	window.resizeTo(screen.width+13,screen.height+hdiff+26)
*/

				var screenWidth = CB_Screen.getWidth();
				var screenHeight = CB_Screen.getHeight();

				try
				{
					//window.moveTo(0, 0); //GIVES PROBLEMS WHEN YOU USE THE SCRIPT ON AN IFRAME!!!
					//window.resizeTo(screenWidth, screenHeight); //GIVES PROBLEMS WHEN YOU USE THE SCRIPT ON AN IFRAME!!!
				} catch(E) {}

//////////////////


				//If the full screen mode is still not applied and we allow to reload web:
				if (allowReload && !(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform))) //Checks whether it is not iOS.
				{
					var currentWindow = window.self;
					currentWindow.opener = window.self;
					var newWindow = window.open("" + window.location, "CB_fullScreenWindow", "type=fullWindow, fullscreen=yes, scrollbars=auto, toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=no, channelmode=1");
					//currentWindow.location.href = "about:blank";
					newWindow.focus();
					//currentWindow.close();
					//newWindow.focus();
				}
			}
		}
		//...otherwise, if we want normal screen mode (not full screen):
		else
		{
			var fullScreenLeft = false;
			
			if (!elementGiven)
			{
				//Tries to use NW.js (node-webkit) if available to leave full screen:
				if (CB_Client.isRunningOnNWjs())
				{
					if (typeof(nw) !== "undefined" && nw !== null && nw.Window && typeof(nw.Window.get) === "function")
					{
						try
						{
							var win = nw.Window.get();
							if (win !== null)
							{
								win.leaveFullscreen();
								fullScreenLeft = !win.isFullscreen;
								if (!fullScreenLeft)
								{
									win.leaveKioskMode();
									fullScreenLeft = !win.isKioskMode;
								}
							}
						} catch(E) { fullScreenLeft = false; }
					}
					if (!fullScreenLeft && typeof(require) === "function")
					{
						var gui = require("nw.gui");
						if (typeof(gui) !== "undefined" && gui !== null && typeof(gui.Window) !== "undefined" && gui.Window !== null && typeof(gui.Window.get) === "function")
						{
							try
							{
								var win = gui.Window.get();
								if (win !== null)
								{
									win.leaveFullscreen();
									fullScreenLeft = !win.isFullscreen;
									if (!fullScreenLeft)
									{
										win.leaveKioskMode();
										fullScreenLeft = !win.isKioskMode;
									}
								}
							} catch(E) { fullScreenLeft = false; }
						}
					}
				}

				
				//Tries to use Electron (Electron.js) if available to leave full screen:
				if (CB_Client.isRunningOnElectron() && typeof(require) === "function")
				{
					try
					{
						fullScreenLeft = require("electron").remote.getCurrentWindow().setFullScreen(true);
					}
					catch(E)
					{
						try
						{
							fullScreenLeft = require("electron").remote.getCurrentWindow().setSimpleFullScreen(true);
						}
						catch(E) { fullScreenLeft = false; }
					}
				}
			}
			
			if (!fullScreenLeft)
			{
				//Gets the function compatible with Fullscreen API (if any):
				var cancelFullScreen = documentBase.exitFullscreen || documentBase.cancelFullScreen || documentBase.mozCancelFullScreen
										|| documentBase.webkitCancelFullScreen || documentBase.oCancelFullScreen || documentBase.msExitFullscreen
										|| documentBase.msExitFullScreen || documentBase.msCancelFullScreen
										|| documentBase.webkitExitFullScreen || documentBase.webkitExitFullscreen;
				var useDocumentBase = true;
				if (typeof(cancelFullScreen) === "undefined" || cancelFullScreen === null)
				{
					cancelFullScreen = document.exitFullscreen || document.cancelFullScreen || document.mozCancelFullScreen
											|| document.webkitCancelFullScreen || document.oCancelFullScreen || document.msExitFullscreen
											|| document.msExitFullScreen || document.msCancelFullScreen
											|| document.webkitExitFullScreen || document.webkitExitFullscreen;
					useDocumentBase = false;
				}

				//If there is any function compatible with Fullscreen API, we call it:
				if (typeof(cancelFullScreen) !== "undefined" && cancelFullScreen)
				{
					cancelFullScreen.call(useDocumentBase ? documentBase : document);
				}
				//..otherwise, we try to use ActiveX (if it's not in full screen already):
				else if (typeof(window.ActiveXObject) !== "undefined" && !CB_Screen.isFullScreen())
				{
					try
					{
						var wscript = new ActiveXObject("WScript.Shell");
						//If ActiveX object has been created:
						if (wscript !== null)
						{
							//ActiveX object working, so we press the key:
							wscript.SendKeys("{F11}");
						}
					}
					//If ActiveX is not enabled or has not been accepted:
					catch(E) {}
				}
			}
		}
	}

	/**
	 * Tells whether we are in full screen mode or not. Uses the [Fullscreen API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API} and fallbacks to other methods internally, including [NW.js (formerly node-webkit)]{@link https://nwjs.io/} and [Electron (Electron.js)]{@link https://electronjs.org/} ones, when not available.
	 *  @function
	 *  @param {number} [allowedWidthMarginPercentage=CB_Configuration.CrossBase.CB_Screen_isFullScreen_ALLOWED_WIDTH_MARGIN_PERCENTAGE] - Allowed width margin, in percentage, of the total screen available to detect whether it is in full screen or not. Needed by old web clients without [Fullscreen API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API} support, mainly.
	 *  @param {number} [allowedHeightMarginPercentage=CB_Configuration.CrossBase.CB_Screen_isFullScreen_ALLOWED_HEIGHT_MARGIN_PERCENTAGE] - Allowed height margin, in percentage, of the total screen available to detect whether it is in full screen or not. Needed by old web clients without [Fullscreen API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API} support, mainly.
	 *  @returns {boolean} Returns whether we are in full screen mode or not.
	 */
	CB_Screen.isFullScreen = function(allowedWidthMarginPercentage, allowedHeightMarginPercentage)
	{
		//Gets the variable compatible with Fullscreen API (if any):
		var documentBase = CB_Client.getDocumentBase();
		/*
		var isFullScreenApplied = (documentBase.fullScreenElement && documentBase.fullScreenElement !== null)
								|| (documentBase.fullscreenElement && documentBase.fullscreenElement !== null)
								|| (documentBase.msFullscreenElement && documentBase.msFullscreenElement !== null)
								|| documentBase.fullScreen || documentBase.mozFullScreen || documentBase.fullScreen
								|| documentBase.webkitIsFullScreen || documentBase.oIsFullScreen || documentBase.msIsFullscreen
								|| documentBase.msIsFullScreen || documentBase.webkitDisplayingFullScreen
								|| documentBase.webkitDisplayingFullscreen;
		*/
		
		var isFullScreenApplied = false;
		
		//Tries to use NW.js (node-webkit) to detect whether we are in fullscreen mode or not:
		if (CB_Client.isRunningOnNWjs())
		{
			if (typeof(nw) !== "undefined" && nw !== null && nw.Window && typeof(nw.Window.get) === "function")
			{
				try
				{
					var win = nw.Window.get();
					if (win !== null)
					{
						isFullScreenApplied = win.isFullscreen || win.isKioskMode;
					}
				} catch(E) { isFullScreenApplied = false; }
			}
			if (!isFullScreenApplied && typeof(require) === "function")
			{
				var gui = require("nw.gui");
				if (typeof(gui) !== "undefined" && gui !== null && typeof(gui.Window) !== "undefined" && gui.Window !== null && typeof(gui.Window.get) === "function")
				{
					try
					{
						var win = gui.Window.get();
						if (win !== null)
						{
							if (win !== null)
							{
								isFullScreenApplied = win.isFullscreen || win.isKioskMode;
							}
						}
					} catch(E) { isFullScreenApplied = false; }
				}
			}
		}
		
		
		//Tries to use Electron (Electron.js) to detect whether we are in fullscreen mode or not:
		if (CB_Client.isRunningOnElectron() && typeof(require) === "function")
		{
			try
			{
				isFullScreenApplied = (require("electron").remote.getCurrentWindow().isFullScreen() === true);
			}
			catch(E)
			{
				isFullScreenApplied = false;
			}
		}
	
		
		if (!isFullScreenApplied)
		{
			isFullScreenApplied = documentBase.fullScreenElement || documentBase.fullscreenElement || documentBase.msFullscreenElement
									|| documentBase.fullScreen || documentBase.mozFullScreen || documentBase.fullScreen
									|| documentBase.webkitIsFullScreen || documentBase.oIsFullScreen || documentBase.msIsFullscreen
									|| documentBase.msIsFullScreen || documentBase.webkitDisplayingFullScreen
									|| documentBase.webkitDisplayingFullscreen;
			//var useDocumentBase = true;
			if (typeof(isFullScreenApplied) === "undefined" || isFullScreenApplied === null)
			{
				/*
				isFullScreenApplied = (document.fullScreenElement && document.fullScreenElement !== null)
										|| (document.fullscreenElement && document.fullscreenElement !== null)
										|| (document.msFullscreenElement && document.msFullscreenElement !== null)
										|| document.fullScreen || document.mozFullScreen || window.fullScreen
										|| document.webkitIsFullScreen || document.oIsFullScreen || document.msIsFullscreen
										|| document.msIsFullScreen || document.webkitDisplayingFullScreen
										|| document.webkitDisplayingFullscreen;
				*/
				isFullScreenApplied = document.fullScreenElement || document.fullscreenElement || document.msFullscreenElement
										|| document.fullScreen || document.mozFullScreen || window.fullScreen
										|| document.webkitIsFullScreen || document.oIsFullScreen || document.msIsFullscreen
										|| document.msIsFullScreen || document.webkitDisplayingFullScreen
										|| document.webkitDisplayingFullscreen;
				//useDocumentBase = false;
			}

			//If there is not compatibility with Fullscreen API, we use other methods:
			if (typeof(isFullScreenApplied) === "undefined" || isFullScreenApplied === null)
			{
				if (CB_Client.getBrowser() === "Explorer") //Only IE since Chrome would do false positives:
				{
					//if (typeof(window.screenTop) !== "undefined" && window.screenTop !== null && !window.screenTop)
					if (window.screenTop)
					{
						isFullScreenApplied = true;
					}
					//else if (typeof(window.screenY) !== "undefined" && window.screenY !== null && !window.screenY)
					else if (window.screenY)
					{
						isFullScreenApplied = true;
					}
				}
				if ("standalone" in window.navigator && window.navigator.standalone) //For some WebKit browsers.
				{
					isFullScreenApplied = true;
				}
				
				if (typeof(document.fullscreenElement) !== "undefined")
				{
					if (document.fullscreenElement === null) { isFullScreenApplied = false; }
				}
			}

			//If there is still not compatibility with Fullscreen API and the methods above didn't work, we use other methods:
			if (typeof(isFullScreenApplied) === "undefined" || isFullScreenApplied === null)
			//if (typeof(isFullScreenApplied) === "undefined" || isFullScreenApplied === null)
			{
				//If the web client is not compatible with Fullscreen API (except the ones which are but don't detect full screen mode when we press F11):
				var element = documentBase.body;

				if (documentBase.documentElement) { element = documentBase.documentElement; }
				//TODO: Add more browsers in callFullScreen that are compatible with Fullscreen API but don't detect fullscreen when you press F11.
				var callFullScreen = element.mozRequestFullScreen;// || element.msRequestFullScreen;
				if (typeof(callFullScreen) === "undefined")
				{
					//We will check the size of the window (having mind zoom level):
					var currentZoom = CB_Screen.getZoom();

					//Gets the available screen size (or the screen size if it's not avaiable):
					var screenAvailableWidth_ = CB_Screen.getAvailableWidth();
					//if (typeof(screenAvailableWidth_) === "undefined" || screenAvailableWidth_ === null || screenAvailableWidth_ === 0) { screenAvailableWidth_ = CB_Screen.getWidth(); }
					if (!screenAvailableWidth_) { screenAvailableWidth_ = CB_Screen.getWidth(); }
					var screenAvailableHeight_ = CB_Screen.getAvailableHeight();
					//if (typeof(screenAvailableHeight_) === "undefined" || screenAvailableHeight_ === null || screenAvailableHeight_ === 0) { screenAvailableHeight_ = CB_Screen.getHeight(); }
					if (!screenAvailableHeight_) { screenAvailableHeight_ = CB_Screen.getHeight(); }

					//Gets the previous available screen size (or the previous screen size if it's not available):
					var previousScreenAvailableWidth_ = CB_Screen.getAvailableWidthPrevious();
					//if (typeof(previousScreenAvailableWidth_) === "undefined" || previousScreenAvailableWidth_ === null || previousScreenAvailableWidth_ === 0) { previousScreenAvailableWidth_ = CB_Screen.getWidthPrevious(); }
					if (!previousScreenAvailableWidth_) { previousScreenAvailableWidth_ = CB_Screen.getWidthPrevious(); }
					var previousScreenAvailableHeight_ = CB_Screen.getAvailableHeightPrevious();
					//if (typeof(previousScreenAvailableHeight_) === "undefined" || previousScreenAvailableHeight_ === null || previousScreenAvailableHeight_ === 0) { previousScreenAvailableHeight_ = CB_Screen.getHeightPrevious(); }
					if (!previousScreenAvailableHeight_) { previousScreenAvailableHeight_ = CB_Screen.getHeightPrevious(); }

	/*
					//Sets an allowed margin:
					var allowedWidthMargin = 0.034 * CB_Screen.getWidth();//50; //Maximum width margin allowed.
					if (allowedWidthMargin <= 0) { allowedWidthMargin = 50; }
					var allowedHeightMargin = 0.035 * CB_Screen.getHeight(); //42; //Maximum height margin allowed.
					if (allowedHeightMargin <= 0) { allowedHeightMargin = 42; }
	*/

					//Determine whether zoom affects screen available size or not:
					var zoomAffectsScreenSize = false;
					//If the page has not been zoomed yet:
					if (CB_Screen.getZoomPrevious() === 0)
					{
						zoomAffectsScreenSize = false;
					}
					//...otherwise, if has already been zoomed:
					else
					{
						//If screen available size changed form last time, zoom affects it:
						if (screenAvailableWidth_ !== previousScreenAvailableWidth_)// && previousScreenAvailableWidth_ !== CB_Screen._storedScreenAvailableWidth)
						{
							zoomAffectsScreenSize = true;
						}
						if (screenAvailableHeight_ !== previousScreenAvailableHeight_)// && previousScreenAvailableHeight_ !== CB_Screen._storedScreenAvailableHeight)
						{
							zoomAffectsScreenSize = true;
						}
					}

					//If it's Internet Explorer, zooms will affect the screen available size:
					//TODO: Add more browsers here that zoom affects the screen available size (specially the ones which are not compatible with the Fullscreen API or they don't think they are in Fullscreen mode when you press F11).
					//if (typeof(document.attachEvent) !== "undefined" && document.attachEvent)
					if (CB_Client.getBrowser() === "Explorer" || typeof(document.msFullscreenElement) !== "undefined")
					{
						zoomAffectsScreenSize = true;
					}
					if (CB_Client.getBrowser() === "Chrome") //Chrome versions not compatible with FullScreen API.
					{
						zoomAffectsScreenSize = false;//true;
					}


					//If the zoom affects the screen available size:
					if (zoomAffectsScreenSize)
					{
						//We try to calculate the real screen available size (having in mind the zoom):
						screenAvailableWidth_ *= currentZoom;
						screenAvailableHeight_ *= currentZoom;
					}

					//Sets an allowed margin:
					if (typeof(allowedWidthMarginPercentage) === "undefined" || allowedWidthMarginPercentage === null || isNaN(allowedWidthMarginPercentage) || allowedWidthMarginPercentage < 0 || allowedWidthMarginPercentage >= 100) { allowedWidthMarginPercentage = CB_Configuration[CB_BASE_NAME].CB_Screen_isFullScreen_ALLOWED_WIDTH_MARGIN_PERCENTAGE; }
					if (typeof(allowedHeightMarginPercentage) === "undefined" || allowedHeightMarginPercentage === null || isNaN(allowedHeightMarginPercentage) || allowedHeightMarginPercentage < 0 || allowedHeightMarginPercentage >= 100) { allowedHeightMarginPercentage = CB_Configuration[CB_BASE_NAME].CB_Screen_isFullScreen_ALLOWED_HEIGHT_MARGIN_PERCENTAGE; }
					var allowedWidthMargin = (allowedWidthMarginPercentage / 100) * screenAvailableWidth_;//50; //Maximum width margin allowed.
					if (allowedWidthMargin <= 0) { allowedWidthMargin = 50; }
					var allowedHeightMargin = (allowedHeightMarginPercentage / 100) * screenAvailableHeight_; //42; //Maximum height margin allowed.
					if (allowedHeightMargin <= 0) { allowedHeightMargin = 42; }

					//We get the real window size (having in mind the zoom):
					var windowWidth = CB_Screen.getWindowWidth() * currentZoom;
					var windowHeight = CB_Screen.getWindowHeight() * currentZoom;

					//We round the sizes having in mind that zoom can be not exact:
					windowWidth = Math.ceil(windowWidth);
					windowHeight = Math.ceil(windowHeight);
					screenAvailableWidth_ = Math.floor(screenAvailableWidth_);
					screenAvailableHeight_ = Math.floor(screenAvailableHeight_);
					
					//If it's full screen (having in mind allowed margin):
					if (Math.ceil(windowWidth + allowedWidthMargin) >= screenAvailableWidth_ && Math.ceil(windowHeight + allowedHeightMargin) >= screenAvailableHeight_)
					{
						isFullScreenApplied = true;
					}
					else
					{
						isFullScreenApplied = false;
					}
				}
				else { isFullScreenApplied = false; } //If the web client is compatible with Fullscreen API (except the ones which are but don't detect full screen mode when we press F11), it's not in full screen mode.
			}

			//Casts the variable to boolean type:
			//isFullScreenApplied = (isFullScreenApplied) ? true : false;
			isFullScreenApplied = !!(isFullScreenApplied);

			//If it's not the first time and full screen mode has been changed, calls the onFullScreenChange function (if any):
			if (CB_Screen._isFullScreen !== null && CB_Screen._isFullScreen !== isFullScreenApplied)
			{
				//If there is any defined function:
				if (typeof(CB_Screen._eventsHolder["onFullScreenChange"]) === "function")
				{
					//Sets the new position (just in case the function needs it):
					CB_Screen._isFullScreen = isFullScreenApplied;
					//Executes the function:
					CB_Screen._eventsHolder["onFullScreenChange"]();
				}
			}
		}
		
		//Sets the new position:
		CB_Screen._isFullScreen = isFullScreenApplied;
		
		return CB_Screen._isFullScreen;//isFullScreenApplied;
	}


	CB_Screen.unlockOrientation_unsetOrientation_timeout = null;
	/**
	 * Alias for {@link CB_Screen.unlockOrientation}.
	 *  @function CB_Screen.unsetOrientation
	 *  @see {@link CB_Screen.unlockOrientation}
	 */
	/**
	 * Function that unlocks the screen orientation. Using the [unlock]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/unlock} function and fallbacks to the [unlockOrientation]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/unlockOrientation} function of the [Screen Orientation API]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation} internally.
	 *  @function
	 *  @param {function} [onError] - Callback function that will be called if the orientation has not been unlocked successfully. Unique parameter received will be an error object (probably a [DOMException]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMException}, depending on the client) with the error.
	 *  @returns {boolean} Returns the same that the [unlock]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/unlock} function returns (undefined, normally), if available. Otherwise, returns the same boolean as the [unlockOrientation]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/unlockOrientation} function (true if the unlocking action has been performed successfully), if available. Otherwise, returns false when the [Screen Orientation API]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation} is not available.
	 */
	CB_Screen.unlockOrientation = CB_Screen.unsetOrientation = function(onError)
	{
		clearTimeout(CB_Screen.unlockOrientation_unsetOrientation_timeout);
		var orientationBefore = CB_Screen.getOrientation();
		var onErrorCalled = false;
		try
		{
			var returnValue = false;
			orientationObject = CB_Screen.getOrientationObject();
			if (orientationObject !== null && typeof(orientationObject.unlock) !== "undefined" && orientationObject.unlock !== null)
			{
				try
				{
					returnValue = orientationObject.unlock(); //Attaching an error-catch to prevent Chrome desktop exception.
				} catch(E) { returnValue = false; }
			}
			else if (typeof(screen) !== "undefined" && screen !== null)
			{
				//Using IF because of Firefox bug ("TypeError: 'mozUnlockOrientation' called on an object that does not implement interface Screen."):
				if (screen.unlockOrientation)
				{
					returnValue = screen.unlockOrientation();
				}
				else if (screen.mozUnlockOrientation)
				{
					returnValue = screen.mozUnlockOrientation();
				}
				else if (screen.webkitUnlockOrientation)
				{
					returnValue = screen.webkitUnlockOrientation();
				}
				else if (screen.oUnlockOrientation)
				{
					returnValue = screen.oUnlockOrientation();
				}
				else if (screen.msUnlockOrientation)
				{
					returnValue = screen.msUnlockOrientation();
				}
				else if (typeof(Screen) !== "undefined" && Screen !== null && Screen.msUnlockOrientation)
				{
					returnValue = Screen.msUnlockOrientation();
				}
				else if (screen.khtmlUnlockOrientation)
				{
					returnValue = screen.khtmlUnlockOrientation();
				}
				/*
				else if (screen.orientation && screen.orientation.unlock)
				{
					return screen.orientation.unlock();
				}
				*/
			}
			
			if (returnValue === false && typeof(onError) === "function") { onErrorCalled = true; onError({ message: "Orientation mode could not be unlocked." }); }
		}
		catch(E)
		{
			if (!onErrorCalled && typeof(onError) === "function") { onErrorCalled = true; onError({ message: "Orientation mode could not be unlocked." }); }
			returnValue = false;
		}
		
		//If no error happened, checks after some time:
		if (!onErrorCalled)
		{
			CB_Screen.unlockOrientation_unsetOrientation_timeout = setTimeout
			(
				function()
				{
					if (onErrorCalled) { return; }
					var orientationNow = CB_Screen.getOrientation();
					if (orientationNow === orientationBefore) //Orientation is the same one.
					{
						if (typeof(onError) === "function") { onErrorCalled = true; onError({ message: "Orientation did not change after trying to unlock it (it is still '" + orientationBefore + "')." }); }
					}
				}, 1000 //Unlocking process can take some time so it waits a while.
			);
		}
		
		return returnValue;
	}

	
	/**
	 * Alias for {@link CB_Screen.lockOrientation}.
	 *  @function CB_Screen.setOrientation
	 *  @see {@link CB_Screen.lockOrientation}
	 */
	/**
	 * Function that forces a desired screen orientation. Using the [lock]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock} function and fallbacks to the [lockOrientation]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation} function of the [Screen Orientation API]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation} internally.
	 *  @function
	 *  @param {'default'|'any'|'natural'|'landscape'|'portrait'|'portrait-primary'|'portrait-secondary'|'landscape-primary'|'landscape-secondary'} orientationMode - Desired orientation. Internally, "default" and "natural" will be exchanged and "any" will be transformed to "default", depending on the internal function used. Values "default", "any" and "natural" are not recommended because they are not supported in all web clients.
 	 *  @param {function} [onSuccess] - Callback function with no parameters that will be called if the orientation has been set successfully.
	 *  @param {function} [onError] - Callback function that will be called if the orientation has not been set successfully. Unique parameter received will be an error object (probably a [DOMException]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMException}, depending on the client) with the error.
	 *  @returns {boolean} Returns the same [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} that the [lock]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock} function returns, if available. Otherwise, returns the same boolean as the [lockOrientation]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation} function (true if the locking action has been performed successfully), if available. Otherwise, returns false when the [Screen Orientation API]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation} is not available.
	 *  @todo Transform values of "default", "any" and "natural" to "portrait", "landscape", etc. when the web clients do not support it (calculating current orientation and trying to guess natural/default one, etc.).
	 */
	CB_Screen.lockOrientation = CB_Screen.setOrientation = function(orientationMode, onSuccess, onError)
	{
		clearTimeout(CB_Screen.unlockOrientation_unsetOrientation_timeout);
		try
		{
			var returnValue = false;
			orientationMode = CB_trim(orientationMode).toLowerCase();
			var orientationObject = CB_Screen.getOrientationObject();
			if (orientationObject !== null && typeof(orientationObject.lock) !== "undefined" && orientationObject.lock !== null)
			{
				if (orientationMode === "default") { orientationMode = "natural"; }
				//return orientationObject.lock(orientationMode).then(onSuccess)["catch"](typeof(onError) === "function" ? onError : function() {}); //Attaching an error-catch to prevent Chrome desktop exception.
				
				try
				{
					returnValue = orientationObject.lock(orientationMode).then(onSuccess)["catch"](typeof(onError) === "function" ? onError : function() {}); //Attaching an error-catch to prevent Chrome desktop exception.
					return returnValue;
				}
				catch(E)
				{
					try
					{
						returnValue = orientationObject.lock(orientationMode); //Attaching an error-catch to prevent Chrome desktop exception.
					} catch(E) { returnValue = false; }
				}
			}
			else if (typeof(screen) !== "undefined" && screen !== null)
			{
				if (orientationMode === "natural") { orientationMode = "default"; }
				else if (orientationMode === "any") { orientationMode = "default"; }
				
				//Using IF because of Firefox bug (TypeError: 'mozLockOrientation' called on an object that does not implement interface Screen.):
				if (screen.lockOrientation)
				{
					returnValue = screen.lockOrientation(orientationMode);
				}
				else if (screen.mozLockOrientation)
				{
					returnValue = screen.mozLockOrientation(orientationMode);
				}
				else if (screen.webkitLockOrientation)
				{
					returnValue = screen.webkitLockOrientation(orientationMode);
				}
				else if (screen.oLockOrientation)
				{
					returnValue = screen.oLockOrientation(orientationMode);
				}
				else if (screen.msLockOrientation)
				{
					returnValue = screen.msLockOrientation(orientationMode);
				}
				else if (typeof(Screen) !== "undefined" && Screen !== null && Screen.msLockOrientation)
				{
					returnValue = Screen.msLockOrientation(orientationMode);
				}
				else if (screen.khtmlLockOrientation)
				{
					returnValue = screen.khtmlLockOrientation(orientationMode);
				}
				
			}
			if (returnValue === true && typeof(onSucess) === "function") { onSuccess(); }
			else if (returnValue === false && typeof(onError) === "function") { onError({ message: "Orientation mode could not be locked." }); }
		
			return returnValue;
		}
		catch(E)
		{
			if (typeof(onError) === "function") { onError({ message: "Orientation mode could not be locked." }); }
			return false;
		}
	}


	/**
	 * Gets the [screen orientation object]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation} of the [Screen Orientation API]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}.
	 *  @function
	 *  @returns {Object} Returns the [screen orientation object]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation} of the [Screen Orientation API]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}.
	 */
	CB_Screen.getOrientationObject = function()
	{
		if (typeof(screen) !== "undefined")
		{
			var orientationObject = screen.orientation || screen.mozOrientation
										|| screen.webkitOrientation || screen.oOrientation || screen.msOrientation
										|| screen.khtmlOrientation || null;
			if (typeof(orientationObject) !== "undefined" && orientationObject !== null)
			{
				return orientationObject;
			}
		}
		return null;
	}

	
	CB_Screen.getOrientation_map = //* Map and map implementation by Christian Maniewski from: https://github.com/chmanie/o9n/blob/master/index.js
	{
		'90': 'landscape-primary',
		'-90': 'landscape-secondary',
		'0': 'portrait-primary',
		'180': 'portrait-secondary'
	};
	CB_Screen.getOrientation_getMql = function() //* Function by Christian Maniewski from: https://github.com/chmanie/o9n/blob/master/index.js
	{
		if (typeof(window.matchMedia) !== "function") { return {}; }
		return window.matchMedia('(orientation: landscape)');
	};
	/**
	 * Gets the current orientation from the [screen orientation object]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation} of the [Screen Orientation API]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}.
	 *  @function
	 *  @returns {string} Returns a string with the current orientation from the [screen orientation object]{@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation} of the [Screen Orientation API]{@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}. If cannot be found, it will return "landscape-primary" as default.
	 */
	CB_Screen.getOrientation = function()
	{
		var orientationObject = CB_Screen.getOrientationObject();
		var orientation = "";
		if (orientationObject !== null)
		{
			if (typeof(orientationObject) === "string") { orientation = orientationObject; }
			else if (typeof(orientationObject.type) === "string") { orientation = orientationObject.type; }
		}
		if (orientation === "")
		{
			orientation = CB_Screen.getOrientation_map[window.orientation + ""] || (CB_Screen.getOrientation_getMql().matches ? "landscape-primary" : "portrait-primary");
		}
		return orientation; //TODO: Think about using CB_trim();
	}
	
	
	/**
	 * Sets the [Viewport]{@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag} meta tag dynamically with the desired options. If the [Viewport]{@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag} meta tag already exists, it will be updated. Otherwise, it will create a new one (and append it to the [HEAD]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head} tag, if found).
	 *  @function
	 *  @param {string|integer} [width] - Desired value for the "width" parameter.
	 *  @param {string|integer} [height] - Desired value for the "height" parameter.
	 *  @param {string|boolean} [userScalable='no'] - Desired value for the "user-scalable" parameter.
	 *  @param {number} [initialScale] - Desired value for the "initial-scale" parameter.
	 *  @param {number} [minimumScale] - Desired value for the "minimum-scale" parameter.
	 *  @param {number} [maximumScale] - Desired value for the "maximum-scale" parameter.
	 *  @param {string} [shrinkToFit] - Desired value for the "shrink-to-fit" parameter.
	 *  @param {string|number} [targetDensityDPI] - Desired value for the "target-densitydpi" parameter.
	 *  @returns {Node|null} Returns the DOM element which belongs to the [Viewport]{@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag} meta tag affected (it will have been just created if no one existed before). If a [Viewport]{@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag} meta tag could not be created or modified, returns null.
	 */
	CB_Screen.setViewport = function(width, height, userScalable, initialScale, minimumScale, maximumScale, shrinkToFit, targetDensityDPI)
	{
		//Finds the meta tag viewport (if any):
		var viewport = CB_Elements.id("viewport");
		if (typeof(viewport) === "undefined" || viewport === null)
		{
			//if (typeof(document.querySelector) !== "undefined" && document.querySelector !== null && document.querySelector)
			if (document.querySelector)
			{
				viewport = document.querySelector("meta[name=viewport]");
			}
			else
			{
				var metaTags = CB_Elements.tag("meta", document, false);
				for (var x = metaTags.length - 1; x >= 0; x--) //Finds the last one.
				{
					if (metaTags[x].name.toLowerCase() === "viewport")
					{
						viewport = metaTags[x];
						break;
					}
				}
			}
		}
	
		//Prepare the given parameters:
		width = CB_trim(width);
		height = CB_trim(height);
		userScalable = CB_trim(userScalable).toLowerCase();
		initialScale = CB_trim(initialScale);
		minimumScale = CB_trim(minimumScale);
		maximumScale = CB_trim(maximumScale);
		targetDensityDPI = CB_trim(targetDensityDPI);
		if (shrinkToFit === true) { shrinkToFit = "yes"; }
		else if (shrinkToFit === false) { shrinkToFit = "no"; }
		shrinkToFit = CB_trim(shrinkToFit);
	
		//Sets the content for the meta tag viewport (according to the parameters given):
		var viewportContent = "";
	
		if (width !== "") { viewportContent += "width=" + width; }
	
		if (height !== "") { if (CB_trim(viewportContent) !== "") { viewportContent += ", "; } viewportContent += "height=" + height; }

		if (userScalable && userScalable !== "no" && userScalable !== 0 && userScalable !== "0") { userScalable = 1; } //userScalable = "yes"; }
		else { userScalable = 0; } //userScalable = "no"; }
		if (CB_trim(viewportContent) !== "") { viewportContent += ", "; }
		viewportContent += "user-scalable=" + (userScalable === 0 ? "no" : "yes");
		viewportContent += ", user-scalable=" + userScalable;
	
		if (initialScale !== "") { viewportContent += ", initial-scale=" + initialScale; }
	
		if (minimumScale !== "") { viewportContent += ", minimum-scale=" + minimumScale; }
	
		if (maximumScale !== "") { viewportContent += ", maximum-scale=" + maximumScale; }
	
		if (targetDensityDPI !== "") { viewportContent += ", target-densitydpi=" + targetDensityDPI; }
		
		if (shrinkToFit !== "") { viewportContent += ", shrink-to-fit=" + shrinkToFit; }
	
		//If the meta tag already exists, just updates it:
		if (typeof(viewport) !== "undefined" && viewport !== null && typeof(viewport.setAttribute) !== "undefined" && viewport.setAttribute !== null)
		{
			viewport.setAttribute("content", viewportContent);
			return viewport;
		}
		//...otherwise, it will create it:
		else
		{
			viewport = document.createElement('meta');
			viewport.name = "viewport";
			viewport.id = "viewport";
			viewport.content = viewportContent;
			var headTag = CB_Elements.tag("head", document, false);
			if (typeof(headTag) !== "undefined" && headTag !== null && typeof(headTag[0]) !== "undefined" && headTag[0] !== null)
			{
				headTag[0].appendChild(viewport);
				return viewport;
			}
		}
		return null;
	}

	
	/**
	 * Keeps the screen awake and prevents it from turning off. Uses different methods internally: [Apache Cordova's Insomnia plugin]{@link https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin}, [Standby API]{@link https://lists.w3.org/Archives/Public/public-device-apis/2014Feb/att-0001/Standby_API_Specification.pdf}, [Mozilla's Wake Lock API]{@link https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/API/Wake_Lock_API}, [new W3C's Wake Lock API]{@link https://w3.org/TR/wake-lock/}, [old W3C's Wake Lock API]{@link https://w3.org/TR/2016/WD-wake-lock-20160714/}, [NoSleep.js library]{@link https://github.com/richtr/NoSleep.js?utm_source=recordnotfound.com} (it should be activated by an event fired by the user as onclick or ontouchstart, etc.)...
	 *  @function
	 *  @param {function} [callbackOk] - Function that will be called if the action has been performed successfully, without parameters.
	 *  @param {function} [callbackError] - Function that will be called if the action has not been performed successfully, without parameters.
	 *  @returns {boolean} If it uses the [new W3C's Wake Lock API]{@link https://w3.org/TR/wake-lock/} internally, it will return a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}. Otherwise, it will return a boolean depending on whether the internal method has been called successfully or not. The fact that the internal method has been called successfully does not mean that the action will perform successfully so it is recommended to relay on the "callbackOk" and "callbackError" functions and ignore this returning value.
	 *  @todo Pay attention since many internal functions as the [new W3C's Wake Lock API]{@link https://w3.org/TR/wake-lock/} are still experimental and not well-tested.
	 */
	CB_Screen.keepAwake = function(callbackOk, callbackError)
	{
		//Using Apache Cordova's Insomnia plugin:
		if (typeof(window.plugins) !== "undefined" && typeof(window.plugins.insomnia) !== "undefined" && typeof(window.plugins.insomnia.allowSleepAgain) !== "undefined")
		{
			try
			{
				window.plugins.insomnia.keepAwake(callbackOk, callbackError);
				return true;
			} catch(E) { }
		}
		//Using Standby API:
		if (window.navigator && typeof(navigator.wakeLock) !== "undefined" && navigator.wakeLock !== null && typeof(navigator.wakeLock.request) !== "undefined")
		{
			try
			{
				navigator.wakeLock.request("display").then(callbackOk, callbackError); //navigator.wakeLock.request("screen").then(callbackOk, callbackError);
				return true;
			} catch(E) { }
		}
		//Using Mozilla's Wake Lock API:
		if (window.navigator && typeof(window.navigator.requestWakeLock) !== "undefined") //So far, only works in Firefox/Firefox OS.
		{
			try
			{
				CB_Screen._screenLock = window.navigator.requestWakeLock("screen");
				if (typeof(callbackOk) === "function") { callbackOk(); }
				return CB_Screen._screenLock;
			} catch(E) { }
		}
		//Using the W3C's Wake Lock API:
		if (window.navigator && typeof(window.navigator.getWakeLock) !== "undefined")
		{
			return navigator.getWakeLock("screen").then
			(
				function(wakeLock)
				{
					var request = wakeLock.createRequest();
					if (typeof(callbackOk) === "function") { callbackOk(); }
				},
				callbackError
			);
		}
		//Using the old W3C's Wake Lock API:
		if (typeof(screen) !== "undefined" && screen !== null && typeof(screen.keepAwake) !== "undefined")
		{
			try
			{
				screen.keepAwake = true;
				if (typeof(callbackOk) === "function") { callbackOk(); }
				return true;
			} catch(E) { }
		}
		//Using NoSleep.js library (it should be activated by an event fired by the user as onclick or ontouchstart, etc.):
		if (typeof(NoSleep) !== "undefined")
		{
			//if (typeof(CB_Screen._noSleep) === "undefined" || CB_Screen._noSleep === null) { CB_Screen._noSleep = new NoSleep(); }
			if (CB_Screen._noSleep) { CB_Screen._noSleep.disable(); } //Fix. Source: https://github.com/richtr/NoSleep.js/issues/75.
			CB_Screen._noSleep = new NoSleep(); //Needs to create a new one to work on some iOS versions. Source: https://github.com/richtr/NoSleep.js/issues/75.

			//Fix for iOS (Source: https://github.com/richtr/NoSleep.js/issues/75): 
			if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) //Checks whether it is iOS.
			{
				CB_Events.add
				(
					document,
					"visibilitychange",
					function()
					{
						if (CB_Screen._noSleepEnabled === true && document.visibilityState === "visible")
						{
							CB_Screen.keepAwake(); //CB_Screen.keepAwake(callbackOk, callbackError);
						}
					},
					true,
					true,
					false
				);
			}

			try
			{
				CB_Screen._noSleep.enable();
				CB_Screen._noSleepEnabled = true;
				if (typeof(callbackOk) === "function") { callbackOk(); }
				return true;
			} catch(E) {}
		}
		
		if (typeof(callbackError) === "function") { callbackError(); }
		return false;
	}
	
	
	//Function that lets the screen sleep again (also uses Apache Cordova with insomnia plugin):
	/**
	 * Lets the screen sleep again and stops preventing it from turning off. Uses different methods internally: [Apache Cordova's Insomnia plugin]{@link https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin}, [Standby API]{@link https://lists.w3.org/Archives/Public/public-device-apis/2014Feb/att-0001/Standby_API_Specification.pdf}, [Mozilla's Wake Lock API]{@link https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/API/Wake_Lock_API}, [new W3C's Wake Lock API]{@link https://w3.org/TR/wake-lock/}, [old W3C's Wake Lock API]{@link https://w3.org/TR/2016/WD-wake-lock-20160714/}, [NoSleep.js library]{@link https://github.com/richtr/NoSleep.js?utm_source=recordnotfound.com} (it should be activated by an event fired by the user as onclick or ontouchstart, etc.)...
	 *  @function
	 *  @param {function} [callbackOk] - Function that will be called if the action has been performed successfully, without parameters.
	 *  @param {function} [callbackError] - Function that will be called if the action has not been performed successfully, without parameters.
	 *  @returns {boolean} If it uses the [new W3C's Wake Lock API]{@link https://w3.org/TR/wake-lock/} internally, it will return a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}. Otherwise, it will return a boolean depending on whether the internal method has been called successfully or not. The fact that the internal method has been called successfully does not mean that the action will perform successfully so it is recommended to relay on the "callbackOk" and "callbackError" functions and ignore this returning value.
	 *  @todo Pay attention since many internal functions as the [new W3C's Wake Lock API]{@link https://w3.org/TR/wake-lock/} are still experimental and not well-tested.
	 */
	CB_Screen.keepAwakeDisable = function(callbackOk, callbackError)
	{
		//Using Apache Cordova's Insomnia plugin:
		if (typeof(window.plugins) !== "undefined" && typeof(window.plugins.insomnia) !== "undefined" && typeof(window.plugins.insomnia.allowSleepAgain) !== "undefined")
		{
			try
			{
				window.plugins.insomnia.allowSleepAgain(callbackOk, callbackError);
				return true;
			} catch(E) { }
		}
		//Using Standby API:
		if (window.navigator && typeof(navigator.wakeLock) !== "undefined" && navigator.wakeLock !== null && typeof(navigator.wakeLock.release) !== "undefined")
		{
			try
			{
				navigator.wakeLock.release("display"); //navigator.wakeLock.release("screen");
				if (typeof(callbackOk) === "function") { callbackOk(); }
				return true;
			} catch(E) { }
		}
		//Using Mozilla's Wake Lock API:
		if (window.navigator && typeof(window.navigator.requestWakeLock) !== "undefined") //So far, only works in Firefox/Firefox OS.
		{
			if (typeof(lock) === "undefined" || lock === null)
			{
				if (typeof(CB_Screen._screenLock) !== "undefined" && CB_Screen._screenLock !== null) { lock = CB_Screen._screenLock; }
			}
			if (typeof(lock.unlock) !== "undefined")
			{
				try
				{
					if (typeof(callbackOk) === "function") { callbackOk(); }
					return lock.unlock();
				} catch(E) { }
			}
		}
		//Using the W3C's Wake Lock API:
		if (window.navigator && typeof(window.navigator.getWakeLock) !== "undefined")
		{
			navigator.getWakeLock("screen").then
			(
				function(wakeLock)
				{
					var request = wakeLock.createRequest();
					request.cancel();
					//setTimeout(function() { request.cancel(); }, 10);
					if (typeof(callbackOk) === "function") { callbackOk(); }
				},
				callbackError
			);
		}
		//Using the old W3C's Wake Lock API:
		if (typeof(screen) !== "undefined" && screen !== null && typeof(screen.keepAwake) !== "undefined")
		{
			try
			{
				screen.keepAwake = false;
				if (typeof(callbackOk) === "function") { callbackOk(); }
				return true;
			} catch(E) { }
		}
		//Using NoSleep.js library:
		if (typeof(NoSleep) !== "undefined")
		{
			//if (typeof(CB_Screen._noSleep) === "undefined" || CB_Screen._noSleep === null) { CB_Screen._noSleep = new NoSleep(); }
			CB_Screen._noSleep = new NoSleep(); //Needs to create a new one to work on some iOS versions. Source: https://github.com/richtr/NoSleep.js/issues/75.
			try
			{
				CB_Screen._noSleep.disable();
				CB_Screen._noSleepEnabled = false;
				if (typeof(callbackOk) === "function") { callbackOk(); }
				return true;
			} catch(E) { }
		}
		
		if (typeof(callbackError) === "function") { callbackError(); }
		return false;
	}
	

} //End of the static class CB_Screen.

//CB_ScreenFileLoaded = true; //This file has been loaded.
//CB_filesNeeded["screen/CB_Screen.js"] = true; //This file has been loaded.