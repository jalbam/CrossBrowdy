/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Sets a viewport for the first time:
	toggleViewport();
	
	//Starts showing the information:
	showInformation();
	
	//Manages some screen events (use "null" as the first parameter to remove them):
	CB_Screen.onResize(function(e) { showScreenEventsInformation("Screen resized (using 'onResize' event)!"); });
	CB_Screen.onResizeOrZoom(function() { showScreenEventsInformation("Screen resized or zoom changed!"); });
	CB_Screen.onFullScreenChange(function() { showScreenEventsInformation("Full screen mode changed!"); });
	CB_Screen.onOrientationChange(function() { showScreenEventsInformation("Screen orientation changed!"); });
	CB_Screen.onFocusChange(function() { showScreenEventsInformation("Screen focus changed!"); });
	CB_Screen.onVisibilityChange(function() { showScreenEventsInformation("Screen visibility changed!"); });
	CB_Screen.onScrollLeft(function() { showScreenEventsInformation("Screen scroll left changed!"); });
	CB_Screen.onScrollTop(function() { showScreenEventsInformation("Screen scroll top changed!"); });
}


//Shows the screen information:
function showInformation()
{
	//Cleans the buffer:
	storeMessageBuffer_buffer = "";

	CB_Elements.id("force_scroll").style.left = (CB_Screen.getWindowWidth() + 100) + "px";
	CB_Elements.id("force_scroll").style.top = (CB_Screen.getWindowHeight() + 100) + "px";

	//Checks whether the main window is focused or not:
	if (CB_Screen.isFocused()) { storeMessageBuffer("Screen is focused!"); }
	else
	{
		storeMessageBuffer("Screen is not focused! Trying to focus it...");

		//Tries to focus the main window (only some clients will support this):
		CB_Screen.focus();
	}

	//Checks whether the main window is visible or not:
	if (CB_Screen.isVisible()) { storeMessageBuffer("Screen is visible!"); }
	else { storeMessageBuffer("Screen is not visible!"); }

	//Gets the current and previous screen resolution (in pixels):
	var screenWidth = CB_Screen.getWidth(); //Uses 'window.screen.width' internally
	var screenHeight = CB_Screen.getHeight(); //Uses 'window.screen.height' internally.
	storeMessageBuffer("Screen resolution: " + screenWidth + "x" + screenHeight);
	var screenWidthPrevious = CB_Screen.getWidthPrevious(); //Gets the previous width before resizing the window.
	var screenHeightPrevious = CB_Screen.getHeightPrevious(); //Gets the previous height before resizing the window.
	storeMessageBuffer("* Previous screen resolution: " + screenWidthPrevious + "x" + screenHeightPrevious);

	//Gets the current and previous window resolution (in pixels):
	var windowWidth = CB_Screen.getWindowWidth(); //Uses 'window.innerWidth' (or fallbacks to 'document.documentElement.clientWidth' or 'document.body.clientWidth') internally.
	var windowHeight = CB_Screen.getWindowHeight(); //Uses 'window.innerWidth' (or fallbacks to 'document.documentElement.clientWidth' or 'document.body.clientWidth') internally.
	storeMessageBuffer("Window size: " + windowWidth + "x" + windowHeight);
	var windowWidthPrevious = CB_Screen.getWindowWidthPrevious(); //Gets the previous width before resizing the window.
	var windowHeightPrevious = CB_Screen.getWindowHeightPrevious(); //Gets the previous height before resizing the window.
	storeMessageBuffer("* Previous window size: " + windowWidthPrevious + "x" + windowHeightPrevious);

	//Gets the current and previous available screen resolution (in pixels):
	var screenAvailableWidth = CB_Screen.getAvailableWidth(); //Uses 'window.screen.availWidth' internally.
	var screenAvailableHeight = CB_Screen.getAvailableHeight(); //Uses 'window.screen.availHeight' internally.
	storeMessageBuffer("Screen available size: " + screenAvailableWidth + "x" + screenAvailableHeight);
	var screenAvailableWidthPrevious = CB_Screen.getAvailableWidthPrevious(); //Gets the previous width before resizing the window.
	var screenAvailableHeightPrevious = CB_Screen.getAvailableHeightPrevious(); //Gets the previous height before resizing the window.
	storeMessageBuffer("* Previous screen available size: " + screenAvailableWidthPrevious + "x" + screenAvailableHeightPrevious);

	//Gets the current and previous pixel ratio and zoom level:
	var screenPixelRatio = CB_Screen.getPixelRatio();
	storeMessageBuffer("Pixel ratio: " + screenPixelRatio);
	var screenPixelRatioPrevious = CB_Screen.getPixelRatioPrevious(); //Gets the previous pixel ratio (before resizing the window or zooming).	
	storeMessageBuffer("* Previous pixel ratio: " + screenPixelRatioPrevious);
	var screenZoomLevel = CB_Screen.getZoom();
	storeMessageBuffer("Zoom level: " + screenZoomLevel);
	var screenZoomLevelPrevious = CB_Screen.getZoomPrevious(); //Gets the previous zoom level (before resizing the window or zooming).
	storeMessageBuffer("* Previous zoom level: " + screenZoomLevelPrevious);

	//Gets the current color depth:
	var screenColorDepth = CB_Screen.getColorDepth();
	storeMessageBuffer("Depth colour: " + screenColorDepth);

	//Gets the current left and top position of the scroll used by the screen (main window):
	var windowScrollLeft = CB_Screen.getScrollLeft(); //Uses 'CB_Elements.getScrollLeftById' internally.
	var windowScrollTop = CB_Screen.getScrollTop(); //Uses 'CB_Elements.getScrollTopById' internally.
	storeMessageBuffer("Window scroll position: (" + windowScrollLeft + ", " + windowScrollTop + ")");

	//Checks whether the screen is in landscape or portrait mode:
	if (CB_Screen.isLandscape()) { storeMessageBuffer("The screen is using landscape mode!"); }
	else { storeMessageBuffer("The screen is using portrait mode!"); }

	//Shows the current screen orientation:
	storeMessageBuffer("Current screen orientation: " + CB_Screen.getOrientation());

	//Checks whether the current client is compatible with the FullScreen API:
	if (CB_Screen.isFullScreenAPICompatible()) { storeMessageBuffer("Compatible with FullScreen API!"); }
	else { storeMessageBuffer("Not compatible with FullScreen API!"); }

	//Checks whether the screen is currently in full screen mode:
	if (CB_Screen.isFullScreen()) { storeMessageBuffer("It is full screen!"); }
	else { storeMessageBuffer("It is not full screen!"); }
	
	//Prints the messages which are in the buffer:
	printBuffer();
	
	//Calls itself again:
	setTimeout(showInformation, 1);
}


//Shows screen events information:
function showScreenEventsInformation(message)
{
	//Updates screen events information:
	CB_Elements.insertContentById("screen_penultimate_event", CB_Elements.id("screen_last_event").innerHTML);
	CB_Elements.insertContentById("screen_last_event", message);
}


//Stores the desired message in the buffer (to be printed later):
var storeMessageBuffer_buffer = "";
function storeMessageBuffer(message)
{
	storeMessageBuffer_buffer += message + "<br />";
}


//Prints the string in the buffer:
function printBuffer()
{
	CB_Elements.insertContentById("container", storeMessageBuffer_buffer, null, true);
}


//Locks the orientation:
function lockOrientation(orientation)
{
	//Tries to force the screen to use an orientation (locking it):
	CB_Screen.lockOrientation //Equivalent to 'CB_Screen.setOrientation'.
	(
		orientation, //orientationMode.
		function() { CB_Elements.insertContentById("lock_information", "Orientation " + orientation + " locked!"); }, //onSuccess. Optional.
		function(error) { CB_Elements.insertContentById("lock_information", "Orientation " + orientation + " could not be locked! Error: " + error.message); } //onError. Optional.
	);
}

//Unlocks the orientation:
function unlockOrientation()
{
	//Tries to unlock the previously-locked screen orientation:
	CB_Screen.unlockOrientation(function(error) { CB_Elements.insertContentById("lock_information", "Orientation could not be unlocked! Error: " + error.message); }); //Equivalent to 'CB_Screen.unsetOrientation()'.
}


//Tries to set full-screen mode:
function setFullScreen(allowsReload)
{
	//Tries to set full screen mode (recommended to be called through an event fired by the user as 'onClick' or 'onTouchStart', etc.):
	//Note: uses the Fullscreen API and fallbacks to other methods internally, including NW.js, Electron ones, when not available.
	if (!allowsReload)
	{
		CB_Screen.setFullScreen(); 
	}
	else
	{
		CB_Screen.setFullScreen(true, undefined, true); //Allows reloading into another (bigger) window (for legacy clients).
	}
}


//Tries to exit full-screen mode:
function exitFullScreen()
{
	//Tries to disable full screen mode:
	CB_Screen.setFullScreen(false); //Uses the Fullscreen API and fallbacks to other methods internally, including NW.js, Electron ones, when not available.
}


//Enables keep awake mode:
function keepAwake(enable)
{
	if (enable)
	{
		//Tries to keeps the screen awake and prevents it from turning off:
		//NOTE: it uses different methods internally as Apache Cordova's Insomnia plugin, Standby API, Mozilla's Wake Lock API, new W3C's Wake Lock API, old W3C's Wake Lock API, NoSleep.js library (it should be activated by an event fired by the user as 'onClick' or 'onTouchStart', etc.)...
		CB_Screen.keepAwake
		(
			function() { CB_Elements.insertContentById("keep_awake_information", "Keep awake set successfully!"); },
			function() { CB_Elements.insertContentById("keep_awake_information", "Keep awake could not be set successfully!"); }
		);
	}
	else
	{
		//Stops keeping the screen awake:
		CB_Screen.keepAwakeDisable
		(
			function() { CB_Elements.insertContentById("keep_awake_information", "Keep awake disabled successfully!"); },
			function() { CB_Elements.insertContentById("keep_awake_information", "Keep awake could not be disabled successfully!"); }
		);
	}
}


//Changes the current "viewport" meta:
var originalViewport = false;
function toggleViewport()
{
	//Sets the desired "viewport" meta tag dynamically:
	if (!originalViewport)
	{
		//Goes back to the original viewport:
		CB_Screen.setViewport
		(
			"device-width", //'width'. Optional.
			false, //'userScalable'. Optional.
			1, //'initialScale'. Optional.
			1, //'minimumScale'. Optional.
			1 //'maximumScale'. Optional.
		);
	}
	else
	{
		//Changes the viewport:
		CB_Screen.setViewport
		(
			800, //'width'. Optional.
			600, //'height'. Optional.
			true, //'userScalable'. Optional.
			2, //'initialScale'. Optional.
			0.1, //'minimumScale'. Optional.
			10, //'maximumScale'. Optional.
			"device-dpi" //'targetDensityDPI'. Optional.
		);
	}
	
	originalViewport = !originalViewport;
}