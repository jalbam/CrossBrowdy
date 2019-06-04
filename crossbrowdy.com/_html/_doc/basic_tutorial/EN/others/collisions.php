<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here are some examples of collisions management:
</p>
<pre><code class="language-javascript">
	//Defines a point with its coordinates:
	var myPoint = { x: 20, y: 30 };
	
	//Collision with an element (considered a rectangle):
	var element = CB_Elements.id("my_element"); //Equivalent to document.getElementById("my_element").
	if (CB_Collisions.isPointOverElement(myPoint.x, myPoint.y, element)) { CB_console("The point is over the element whose ID is 'my_element'."); }
	
	//Other collisions:
	if (CB_Collisions.isPointOverRectangle(myPoint.x, myPoint.y, 20, 30, 100, 80))
	{
		CB_console("The point is over a rectangle whose left upper corner coordinates start at (20, 30) and whose width is 100 and height is 80.");
	}
	if (CB_Collisions.isPointOverCircle(myPoint.x, myPoint.y, 20, 30, 100))
	{
		CB_console("The point is over a circle whose center is in (20, 30) pixel coordinates and its radius is 100 pixels.");
	}
	if (CB_Collisions.isPointOverLine(myPoint.x, myPoint.y, 0, 0, 100, 100))
	{
		CB_console("The point is over an infinite line which cross both the (0, 0) and (100, 100) coordinates.");
	}
	if (CB_Collisions.isPointOverSegment(myPoint.x, myPoint.y, 200, 500, 700, 600))
	{
		CB_console("The point is over a line segment which starts in the (200, 500) and ends in the (700, 600) coordinates.");
	}
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Collisions.html" target="_blank">CB_Collisions</a> static class.
</p>