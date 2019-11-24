CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Starts showing the mouse information:
	showMouseInformation();
	
	//Setting mouse events:
	CB_Mouse.onMove(function(e) { showMouseEventsInformation("Mouse moved!"); });
	CB_Mouse.onWheel(function(e) { showMouseEventsInformation("Mouse wheel used!"); });
	CB_Mouse.onButtonDown(function(e) { showMouseEventsInformation("Button down!"); });
	CB_Mouse.onButtonUp(function(e) { showMouseEventsInformation("Button up!"); });
	CB_Mouse.onClick(function(e) { showMouseEventsInformation("Click!"); });
	CB_Mouse.onDblClick(function(e) { showMouseEventsInformation("Double click!"); });
	CB_Mouse.onLeave(function(e) { showMouseEventsInformation("The 'onLeave' event was fired!"); });
	CB_Mouse.onOut(function(e) { showMouseEventsInformation("The 'onOut' event was fired!"); });
	CB_Mouse.onOver(function(e) { showMouseEventsInformation("The 'onOver' event was fired!"); });
	CB_Mouse.onLockChange(function(e) { showMouseEventsInformation("Lock status changed!"); });
	CB_Mouse.onLockError(function(e) { showMouseEventsInformation("Lock error!"); });
	

	//Starts showing touch information:
	var maxTouchPoints = CB_Touch.getMaxTouchPoints(); //Maximum of touch points supported by the device (or null if it was not possible to calculate).
	CB_Elements.insertContentById("touch_max_touch_points", maxTouchPoints || "Unknown");
	showTouchInformation();

	//Setting touch events:
	//Note: the pressure will be tried to be calculated automatically and added to the "force" property of the touch event object received by all the touch events.
	CB_Touch.onCancel(function(e) { showTouchEventsInformation("The 'onCancel' event was fired!"); });
	CB_Touch.onEnd(function(e) { showTouchEventsInformation("The 'onEnd' event was fired!"); });
	CB_Touch.onEnter(function(e) { showTouchEventsInformation("The 'onEnter' event was fired!"); });
	CB_Touch.onLeave(function(e) { showTouchEventsInformation("The 'onLeave' event was fired!"); });
	CB_Touch.onMove(function(e) { showTouchEventsInformation("The 'onMove' event was fired!"); });
	CB_Touch.onStart(function(e) { showTouchEventsInformation("The 'onStart' event was fired!"); });
	
	
	//Setting pointer events:
	CB_Pointer.onDown(function(e) { showPointerEventsInformation("The 'onDown' event has been fired!", e); });
	CB_Pointer.onUp(function(e) { showPointerEventsInformation("The 'onUp' event has been fired!", e); });
	CB_Pointer.onMove(function(e) { showPointerEventsInformation("The 'onMove' event has been fired!", e); });
	CB_Pointer.onOver(function(e) { showPointerEventsInformation("The 'onOver' event has been fired!", e); });
	CB_Pointer.onOut(function(e) { showPointerEventsInformation("The 'onOut' event has been fired!", e); });
	CB_Pointer.onEnter(function(e) { showPointerEventsInformation("The 'onEnter' event has been fired!", e); });
	CB_Pointer.onLeave(function(e) { showPointerEventsInformation("The 'onLeave' event has been fired!", e); });
	CB_Pointer.onCancel(function(e) { showPointerEventsInformation("The 'onCancel' event has been fired!", e); });
	CB_Pointer.onGotPointCapture(function(e) { showPointerEventsInformation("The 'onGotPointCapture' event has been fired!", e); });
	CB_Pointer.onLostPointCapture(function(e) { showPointerEventsInformation("The 'onLostPointCapture' event has been fired!", e); });

	
	//Displays the default screen (mouse information) at the beginning:
	displayScreen(maxTouchPoints ? "touch" : "mouse");
}


//Displays the desired screen:
var screens = ["mouse", "touch", "pointer"];
function displayScreen(screen)
{
	var element;
	for (var x = 0; x < screens.length; x++)
	{
		element = CB_Elements.id(screens[x] + "_information");
		if (element === null) { continue; }
		if (screens[x] === screen) { element.style.visibility = "visible"; element.style.display = "block"; }
		else { element.style.visibility = "hidden"; element.style.display = "none"; }
	}
}


//Shows the mouse information constantly:
function showMouseInformation()
{
	//Updates some mouse information:
	CB_Elements.insertContentById("mouse_coordinates", CB_Mouse.getX() + ", " + CB_Mouse.getY());
	CB_Elements.insertContentById("mouse_coordinates_lock", CB_Mouse.getXMovement() + ", " + CB_Mouse.getYMovement());
	CB_Elements.insertContentById("mouse_buttons", JSON.stringify(CB_Mouse.getButtons()));
	
	//Changes the background colour of the desired element when the mouse is over it:
	var backgroundColor = "#aa99dd";
	var element = CB_Elements.id("mouse_lock_element");
	if (CB_Mouse.isOverElement(element)) { backgroundColor = "#aa0000"; } //For advanced collisions, the CB_Collisions static class can be used.
	element.style.backgroundColor = backgroundColor;
	
	//Calls itself again:
	setTimeout(showMouseInformation, 1);
}


//Shows mouse events information:
function showMouseEventsInformation(message)
{
	//Updates mouse events information:
	CB_Elements.insertContentById("mouse_penultimate_event", CB_Elements.id("mouse_last_event").innerHTML);
	CB_Elements.insertContentById("mouse_last_event", message);
}


//Locks/unlocks the mouse:
function mouseLockUnlock()
{
	if (CB_Mouse.isLocked()) { mouseUnlock(); }	
	else { mouseLock(); }	
}


//Locks the mouse:
function mouseLock()
{
	//Pointer Lock API management:
	if (CB_Mouse.isLockSupported())
	{
		CB_console("Pointer Lock API is supported.");

		//Some examples:
		var element = CB_Elements.id("mouse_lock_element"); //Equivalent to document.getElementById("my_element").
		var elementLock = //Locked element can also be obtained with the 'CB_Mouse.getLockElement' function.
			CB_Mouse.lock
			(
				//Element to lock the mouse to:
				element,
				//Callback when lock is performed successfully:
				function() { CB_console("Mouse locked!"); },
				//Callback when lock is not performed successfully:
				function() { CB_console("Mouse could not be locked!"); }
			);
	}
	else
	{
		CB_console("Pointer Lock API is not supported.");
	}
}


//Unlocks the mouse:
function mouseUnlock()
{
	CB_Mouse.unlock(); //Unlocks the mouse.
}


//Hides the mouse cursor:
function mouseHide()
{
	CB_console("Hiding mouse cursor...");
	CB_Mouse.hide(); //Hides the cursor. Useful to simulate the Pointer Lock API.
	CB_Mouse.onButtonUp(mouseRestore);
}


//Restores (shows again) the mouse cursor:
function mouseRestore()
{
	CB_console("Restoring mouse cursor...");
	CB_Mouse.restore(); //Hides the cursor. Useful to simulate the Pointer Lock API.
}


//Changes the cursor aspect (using CSS internally):
function mouseChangeCursor(extension)
{
	var CSS = "url(cursors/cursor." + extension + "), auto";
	CB_Mouse.setCSS(CSS);
}


//Changes the cursor aspect (using DHTML internally):
function mouseChangeCursorDHTML()
{
	CB_console("Using DHTML to fake the mouse cursor...");
	var cursorImage = "ranisima.gif"
	var cursorImageWidth = 40;
	var cursorImageHeight = 40;
	CB_Mouse.CursorImage.set(true, "cursors/" + cursorImage, cursorImageWidth, cursorImageHeight);
	CB_Mouse.onButtonUp(mouseChangeCursorDHTMLStop);
}


//Changes the cursor aspect (using DHTML internally), using a sprites-based animation:
function mouseChangeCursorDHTMLSprites()
{
	CB_console("Using DHTML to fake the mouse cursor (using sprites)...");
	var cursorImage = "bird_sprites.gif";
	var cursorImageWidth = 38;
	var cursorImageHeight = 36;
	var numberOfFrames = 4;
	var framesMs = 10;
	CB_Mouse.CursorImage.set(true, "cursors/" + cursorImage, cursorImageWidth, cursorImageHeight, true, true, numberOfFrames, framesMs);
	CB_Mouse.onButtonUp(mouseChangeCursorDHTMLStop);
}


//Stops using DHTML to fake the cursor aspect:
function mouseChangeCursorDHTMLStop()
{
	if (CB_Mouse.CursorImage.isShowing())
	{
		CB_console("Stops using DHTML to fake the mouse cursor (using sprites).");
		CB_Mouse.CursorImage.hide();
	}
}



//Shows the mouse information constantly:
var touchProperties = [ "targetTouches", "touches", "changedTouches" ]; //Different point groups.
function showTouchInformation()
{
	var lastTouchEventObject = CB_Touch.getData(); //Touch event object received by the last touch event fired, if it was "onTouchStart", "onTouchEnter" or "onTouchMove". The "onTouchEnd" and "onTouchLeave" events set it to "null".

	//Updates touch information:
	if (lastTouchEventObject !== null && lastTouchEventObject.touches)
	{
		var data = "", y, points, point;
		for (x = 0; x < touchProperties.length; x++)
		{
			points = lastTouchEventObject[touchProperties[x]];
			if (!points) { continue; }
			data += touchProperties[x] + " (" + points.length + "):";
			for (y = 0; y < points.length; y++)
			{
				point = points[y];
				data += '<p class="point_data">{ ';
				data += "Identifier: " + point.identifier + ", ";
				data += "screenX: " + point.screenX + ", ";
				data += "screenY: " + point.screenY + ", ";
				data += "clientX: " + point.clientX + ", ";
				data += "clientY: " + point.clientY + ", ";
				data += "pageX: " + point.pageX + ", ";
				data += "pageY: " + point.pageY + ", ";
				data += "target: " + point.target + ", ";
				data += "radiusX: " + point.radiusX + ", ";
				data += "radiusY: " + point.radiusY + ", ";
				data += "rotationAngle: " + point.rotationAngle + ", ";
				data += "force: " + point.force;
				data += " }</p>";
			}
			
		}
		CB_Elements.insertContentById("touch_points", data);
	}
	else
	{
		CB_Elements.insertContentById("touch_points", "No data");
	}
	
	//Calls itself again:
	setTimeout(showTouchInformation, 1);
}


//Shows touch events information:
function showTouchEventsInformation(message)
{
	//Updates touch events information:
	CB_Elements.insertContentById("touch_penultimate_event", CB_Elements.id("touch_last_event").innerHTML);
	CB_Elements.insertContentById("touch_last_event", message);
}


//Shows pointer events information:
function showPointerEventsInformation(message, e)
{
	//Updates mouse events information:
	var data = "{ ";
	data += "pointerId: " + e.pointerId + ", ";
	data += "pointerType: " + e.pointerType + ", ";
	data += "currentTarget: " + e.currentTarget + ", ";
	data += "isPrimary: " + e.isPrimary + ", ";
	data += "pressure: " + e.pressure + ", ";
	data += "tangentialPressure: " + e.tangentialPressure + ", ";
	data += "width: " + e.width + ", ";
	data += "height: " + e.height + ", ";
	data += "twist: " + e.twist + ", ";
	data += "tiltX: " + e.tiltX + ", ";
	data += "tiltY: " + e.tiltY + ", ";
	data += "clientX: " + e.clientX + ", ";
	data += "clientY: " + e.clientY + ", ";
	data += "pageX: " + e.pageX + ", ";
	data += "pageY: " + e.pageY + ", ";
	data += "usingEmulation: " + e.usingEmulation + ", ";
	data += "type: " + e.type + ", ";
	data += "typeEmulated: " + e.typeEmulated;
	data += " }";
	CB_Elements.insertContentById("pointer_penultimate_event", CB_Elements.id("pointer_last_event").innerHTML);
	CB_Elements.insertContentById("pointer_last_event", message);
	CB_Elements.insertContentById("pointer_penultimate_event_information", CB_Elements.id("pointer_last_event_information").innerHTML);
	CB_Elements.insertContentById("pointer_last_event_information", data);
}