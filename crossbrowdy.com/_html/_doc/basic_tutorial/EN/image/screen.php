<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here are some examples of screen management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Checks whether the main window is focused or not:
	if (CB_Screen.isFocused()) { CB_console("Screen is focused!"); }
	else
	{
		CB_console("Screen is not focused! Trying to focus it...");
		
		//Tries to focus the main window (only some clients will support this):
		CB_Screen.focus();
	}
	
	//Checks whether the main window is visible or not:
	if (CB_Screen.isVisible()) { CB_console("Screen is visible!"); }
	else { CB_console("Screen is not visible!"); }
	
	//Gets the current and previous screen resolution (in pixels):
	var screenWidth = CB_Screen.getWidth(); //Uses 'window.screen.width' internally
	var screenHeight = CB_Screen.getHeight(); //Uses 'window.screen.height' internally.
	var screenWidthPrevious = CB_Screen.getWidthPrevious(); //Gets the previous width before resizing the window.
	var screenHeightPrevious = CB_Screen.getHeightPrevious(); //Gets the previous height before resizing the window.

	//Gets the current and previous window resolution (in pixels):
	var windowWidth = CB_Screen.getWindowWidth(); //Uses 'window.innerWidth' (or fallbacks to 'document.documentElement.clientWidth' or 'document.body.clientWidth') internally.
	var windowHeight = CB_Screen.getWindowHeight(); //Uses 'window.innerWidth' (or fallbacks to 'document.documentElement.clientWidth' or 'document.body.clientWidth') internally.
	var windowWidthPrevious = CB_Screen.getWindowWidthPrevious(); //Gets the previous width before resizing the window.
	var windowHeightPrevious = CB_Screen.getWindowHeightPrevious(); //Gets the previous height before resizing the window.
	
	//Gets the current and previous available screen resolution (in pixels):
	var screenAvailableWidth = CB_Screen.getAvailableWidth(); //Uses 'window.screen.availWidth' internally.
	var screenAvailableHeight = CB_Screen.getAvailableHeight(); //Uses 'window.screen.availHeight' internally.
	var screenAvailableWidthPrevious = CB_Screen.getAvailableWidthPrevious(); //Gets the previous width before resizing the window.
	var screenAvailableHeightPrevious = CB_Screen.getAvailableHeightPrevious(); //Gets the previous height before resizing the window.
	
	//Gets the current and previous pixel ratio and zoom level:
	var screenPixelRatio = CB_Screen.getPixelRatio();
	var screenZoomLevel = CB_Screen.getZoom();
	var screenPixelRatioPrevious = CB_Screen.getPixelRatioPrevious(); //Gets the previous pixel ratio (before resizing the window or zooming).
	var screenZoomLevelPrevious = CB_Screen.getZoomPrevious(); //Gets the previous zoom level (before resizing the window or zooming).
	
	//Gets the current color depth:
	var screenColorDepth = CB_Screen.getColorDepth();

	//Gets the current left and top position of the scroll used by the screen (main window):
	var windowScrollLeft = CB_Screen.getScrollLeft(); //Uses 'CB_Elements.getScrollLeftById' internally.
	var windowScrollTop = CB_Screen.getScrollTop(); //Uses 'CB_Elements.getScrollTopById' internally.
	
	//Checks whether the screen is in landscape or portrait mode:
	if (CB_Screen.isLandscape()) { CB_console("The screen is using landscape mode!"); }
	else { CB_console("The screen is using portrait mode!"); }
	
	//Tries to force the screen to use an orientation (locking it):
	CB_Screen.lockOrientation //Equivalent to 'CB_Screen.setOrientation'.
	(
		"landscape", //orientationMode.
		function() { CB_console("Orientation locked!"); }, //onSuccess. Optional.
		function(error) { CB_console("Orientation could not be locked! Error: " + error); } //onError. Optional.
	);
	
	//Shows the current screen orientation:
	CB_console("Current screen orientation: " + CB_Screen.getOrientation());
	
	//Tries to unlock the previously-locked screen orientation:
	CB_Screen.unlockOrientation(function(error) { alert("Orientation could not be unlocked! Error: " + error); }); //Equivalent to 'CB_Screen.unsetOrientation()'.
	
	//Checks whether the current client is compatible with the FullScreen API:
	if (CB_Screen.isFullScreenAPICompatible()) { CB_console("Compatible with FullScreen API!"); }
	else { CB_console("Not compatible with FullScreen API!"); }
	
	//Tries to set full screen mode (recommended to be called through an event fired by the user as 'onClick' or 'onTouchStart', etc.):
	CB_Screen.setFullScreen(); //Uses the Fullscreen API and fallbacks to other methods internally, including NW.js, Electron ones, when not available.

	//Checks whether the screen is currently in full screen mode:
	if (CB_Screen.isFullScreen()) { CB_console("It is full screen!"); }
	else { CB_console("It is not full screen!"); }
	
	//Tries to disable full screen mode:
	CB_Screen.setFullScreen(false); //Uses the Fullscreen API and fallbacks to other methods internally, including NW.js, Electron ones, when not available.
	
	//Tries to keeps the screen awake and prevents it from turning off:
	//NOTE: it uses different methods internally as Apache Cordova's Insomnia plugin, Standby API, Mozilla's Wake Lock API, new W3C's Wake Lock API, old W3C's Wake Lock API, NoSleep.js library (it should be activated by an event fired by the user as 'onClick' or 'onTouchStart', etc.)...
	CB_Screen.keepAwake(function() { CB_console("Keep awake set successfully!"); }, function() { CB_console("Keep awake could not be set successfully!"); });
	
	//Stops keeping the screen awake:
	CB_Screen.keepAwakeDisable(function() { CB_console("Keep awake disabled successfully!"); }, function() { CB_console("Keep awake could not be disabled successfully!"); });
	
	//Sets the desired "viewport" meta tag dynamically:
	CB_Screen.setViewport
	(
		"device-width", //'width'. Optional.
		"device-height", //'height'. Optional.
		false, //'userScalable'. Optional.
		1, //'initialScale'. Optional.
		1, //'minimumScale'. Optional.
		1, //'maximumScale'. Optional.
		"device-dpi", //'targetDensityDPI'. Optional.
		"no" //'shrinkToFit'. Optional.
	);
	
	//Manages some screen events (use "null" as the first parameter to remove them):
	CB_Screen.onResize(function(e) { CB_console("Screen resized (using 'onResize' event)!"); });
	CB_Screen.onResizeOrZoom(function() { CB_console("Screen resized or zoom changed!"); });
	CB_Screen.onFullScreenChange(function() { CB_console("Full screen mode changed!"); });
	CB_Screen.onOrientationChange(function() { CB_console("Screen orientation changed!"); });
	CB_Screen.onFocusChange(function() { CB_console("Screen focus changed!"); });
	CB_Screen.onVisibilityChange(function() { CB_console("Screen visibility changed!"); });
	CB_Screen.onScrollLeft(function() { CB_console("Screen scroll left changed!"); });
	CB_Screen.onScrollTop(function() { CB_console("Screen scroll top changed!"); });
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Screen.html" target="_blank">CB_Screen</a> static class.
</p>