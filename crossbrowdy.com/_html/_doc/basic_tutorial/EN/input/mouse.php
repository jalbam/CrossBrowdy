<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of mouse management with CrossBrowdy:
</p>
<pre><code class="language-javascript">
	//Managing buttons pressed currently (this should normally be in a loop, checking constantly):
	var buttonsDown = CB_Mouse.getButtons(); //Same as 'CB_Mouse.getButtonsDown'.
	if (buttonsDown.LEFT) { CB_console("LEFT button is being pressed"); }
	if (buttonsDown.MIDDLE) { CB_console("MIDDLE button is being pressed"); }
	if (buttonsDown.RIGHT) { CB_console("RIGHT button is being pressed"); }

	//Getting mouse coordinates:
	var mouseX = CB_Mouse.getX(); //Current horizontal coordinates of the mouse.
	var mouseXRelative = CB_Mouse.getXRelative(15); //Current horizontal coordinates of the mouse, relative to the given x-axis coordinates (15).
	var mouseY = CB_Mouse.getY();//Current vertical coordinates of the mouse.
	var mouseYRelative = CB_Mouse.getYRelative(30); //Current vertical coordinates of the mouse, relative to the given y-axis coordinates (30).

	//Managing mouse events (use "null" as the first parameter to remove them):
	CB_Mouse.onMove(function(e) { CB_console("Mouse moved!"); });
	CB_Mouse.onWheel(function(e) { CB_console("Mouse wheel used!"); });
	CB_Mouse.onButtonDown(function(e) { CB_console("Button down!"); });
	CB_Mouse.onButtonUp(function(e) { CB_console("Button up!"); });
	CB_Mouse.onClick(function(e) { CB_console("Click!"); });
	CB_Mouse.onDblClick(function(e) { CB_console("Double click!"); });
	CB_Mouse.onLeave(function(e) { CB_console("The 'onLeave' event was fired!"); });
	CB_Mouse.onOut(function(e) { CB_console("The 'onOut' event was fired!"); });
	CB_Mouse.onOver(function(e) { CB_console("The 'onOver' event was fired!"); });
</code></pre>

Some simple collisions can be managed easily:
<pre><code class="language-javascript">
	//Collision with an element (considered a rectangle):
	var element = CB_Elements.id("my_element"); //Equivalent to document.getElementById("my_element").
	if (CB_Mouse.isOverElement(element)) { CB_console("The mouse is over the element whose ID is 'my_element'."); }

	//Other collisions:
	if (CB_Mouse.isOverRectangle(20, 30, 100, 80))
	{
		CB_console("The mouse is over a rectangle whose left upper corner coordinates start at (20, 30) and whose width is 100 and height is 80.");
	}
	if (CB_Mouse.isOverCircle(20, 30, 100))
	{
		CB_console("The mouse is over a circle whose center is in (20, 30) pixel coordinates and its radius is 100 pixels.");
	}
	if (CB_Mouse.isOverLine(0, 0, 100, 100)) //Note that a fifth parameter can also be given to specify desired "tolerance".
	{
		CB_console("The mouse is over an infinite line which cross both the (0, 0) and (100, 100) coordinates.");
	}
	if (CB_Mouse.isOverSegment(200, 500, 700, 600)) //Note that a fifth parameter can also be given to specify desired "tolerance".
	{
		CB_console("The mouse is over a line segment which starts in the (200, 500) and ends in the (700, 600) coordinates.");
	}
</code></pre>

<p>
	The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API" target="_blank">Pointer Lock API</a> is also supported:
</p>
<pre><code class="language-javascript">
	//Pointer Lock API management:
	if (CB_Mouse.isLockSupported())
	{
		CB_console("Pointer Lock API is supported.");
		
		//Managing some events:
		CB_Mouse.onLockChange(function(e) { CB_console("Lock status changed!"); });
		CB_Mouse.onLockError(function(e) { CB_console("Lock error!"); });
		
		//Some examples:
		var element = CB_Elements.id("my_element"); //Equivalent to document.getElementById("my_element").
		var elementLock =
			CB_Mouse.lock
			(
				//Element to lock the mouse to:
				element,
				//Callback when lock is performed successfully:
				function() { CB_console("Mouse locked!"); },
				//Callback when lock is not performed successfully:
				function() { CB_console("Mouse could not be locked!"); }
			);
		var elementLock_2 = CB_Mouse.getLockElement(); //Should contain the same as elementLock and element variables.
		
		if (CB_Mouse.isLocked()) { CB_console("Mouse is currently locked."); }
		
		var xMovement = CB_Mouse.getXMovement(); //Gets the horizontal movement.
		var yMovement = CB_Mouse.getYMovement(); //Gets the vertical movement.
		
		CB_Mouse.unlock(); //Unlocks the mouse.
	}
	else
	{
		CB_console("Pointer Lock API is not supported.");
	}	
</code></pre>


<p>
	The mouse cursor can also be managed:
</p>
<pre><code class="language-javascript">
	//Showing and hiding the mouse cursor:
	CB_Mouse.hide(); //Hides the cursor. Useful to simulate the Pointer Lock API.
	CB_Mouse.restore(); //Shows the cursor again.
	
	//Modifying the aspect of the mouse cursor, using CSS:
	var CSS = "url(my/cursors/my_cursor.png), url(my/cursors/my_cursor.gif), url(my/cursors/my_cursor.cur)";
	CB_Mouse.setCSS(CSS);
	
	//Modifying the aspect of the mouse cursor, using DHTML internally, for legacy clients (it also support image sprites, read the API for more information):
	CB_Mouse.CursorImage.set(true, "my/cursors/my_cursor.gif", 20, 30); //Shows the desired image (20 width, 30 height) as the mouse cursor.
	CB_Mouse.CursorImage.hide(); //Stops simulating the mouse cursor by DHTML.
</code></pre>


<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Mouse.html" target="_blank">CB_Mouse</a> and the <a href="_html/_doc/api/CB_Mouse.CursorImage.html" target="_blank">CB_Mouse.CursorImage</a> static classes.
</p>