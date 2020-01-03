<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here are some examples of collisions management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Defines two points with its coordinates:
	var myPoint = { x: 20, y: 30 };
	var myPoint2 = { x: 30, y: 50 };
	
	//Distance between two points:
	CB_console("The distance between 'myPoint' and 'myPoint2' is: " + CB_Collisions.getDistancePoints(myPoint.x, myPoint.y, myPoint2.x, myPoint2.y));
	
	//A point and a DOM element (considered a rectangle):
	var element = CB_Elements.id("my_element"); //Equivalent to document.getElementById("my_element").
	if (CB_Collisions.isPointOverElement(myPoint.x, myPoint.y, element)) { CB_console("The point is over the element whose ID is 'my_element'."); }
	if (CB_Collisions.isPointTouchingElement(myPoint.x, myPoint.y, element)) { CB_console("The point is touching (maybe over) the element whose ID is 'my_element'."); } //Also if they are adjacent (next to each other).
	
	//A rectangle and a DOM element (considered a rectangle):
	if (CB_Collisions.isRectangleOverElement(20, 30, 100, 80, element)) { CB_console("The rectangle whose left upper corner coordinates start at (20, 30) and whose width is 100 and height is 80 is over the element whose ID is 'my_element'."); }
	if (CB_Collisions.isRectangleTouchingElement(20, 30, 100, 80, element)) { CB_console("The rectangle whose left upper corner coordinates start at (20, 30) and whose width is 100 and height is 80 is touching (maybe over) the element whose ID is 'my_element'.");	} //Also if they are adjacent (next to each other).
	
	//Two DOM elements (considered a rectangle):
	var element2 = CB_Elements.id("my_element_2");
	if (CB_Collisions.isElementOverElement(element, element2)) { CB_console("The element whose ID is 'my_element' is over the element whose ID is 'my_element_2'."); }
	if (CB_Collisions.isElementTouchingElement(element, element2)) { CB_console("The element whose ID is 'my_element' is touching (maybe over) the element whose ID is 'my_element_2'."); } //Also if they are adjacent (next to each other).
	
	//A point and a rectangle:
	if (CB_Collisions.isPointOverRectangle(myPoint.x, myPoint.y, 20, 30, 100, 80)) { CB_console("The point is over a rectangle whose left upper corner coordinates start at (20, 30) and whose width is 100 and height is 80."); }
	if (CB_Collisions.isPointTouchingRectangle(myPoint.x, myPoint.y, 20, 30, 100, 80)) { CB_console("The point is touching (maybe over) a rectangle whose left upper corner coordinates start at (20, 30) and whose width is 100 and height is 80."); } //Also if they are adjacent (next to each other).
	
	//A point and a circle:
	if (CB_Collisions.isPointOverCircle(myPoint.x, myPoint.y, 20, 30, 100)) { CB_console("The point is over a circle whose center is in (20, 30) pixel coordinates and its radius is 100 pixels.");	}
	if (CB_Collisions.isPointTouchingCircle(myPoint.x, myPoint.y, 20, 30, 100)) { CB_console("The point is touching (maybe over) a circle whose center is in (20, 30) pixel coordinates and its radius is 100 pixels."); } //Also if they are adjacent (next to each other).

	//A point and an ellipse:
	if (CB_Collisions.isPointOverEllipse(myPoint.x, myPoint.y, 20, 30, 100, 200)) { CB_console("The point is over a ellipse whose center is in (20, 30) pixel coordinates and its horizontal and vertical radii are 100 and 200 pixels respectively.");	}
	if (CB_Collisions.isPointTouchingEllipse(myPoint.x, myPoint.y, 20, 30, 100, 200)) { CB_console("The point is touching (maybe over) a ellipse whose center is in (20, 30) pixel coordinates and its horizontal and vertical radii are 100 and 200 pixels respectively."); } //Also if they are adjacent (next to each other).
	
	//A point and a line (infinite):
	if (CB_Collisions.isPointOverLine(myPoint.x, myPoint.y, 0, 0, 100, 100)) { CB_console("The point is over an infinite line which cross both the (0, 0) and (100, 100) coordinates."); }
	
	//A point and a line segment (limited):
	if (CB_Collisions.isPointOverSegment(myPoint.x, myPoint.y, 200, 500, 700, 600)) { CB_console("The point is over a line segment which starts in the (200, 500) and ends in the (700, 600) coordinates."); }
	
	//Two rectangles:
	if (CB_Collisions.isRectangleOverRectangle(20, 30, 100, 80, 50, 70, 120, 90))
	{
		CB_console("The rectangle whose left upper corner coordinates start at (20, 30) and whose width is 100 and height is 80 is over the rectangle whose left upper corner coordinates start at (50, 70) and whose width is 120 and height is 90.");
	}
	if (CB_Collisions.isRectangleTouchingRectangle(20, 30, 100, 80, 50, 70, 120, 90)) //Also if they are adjacent (next to each other).
	{
		CB_console("The rectangle whose left upper corner coordinates start at (20, 30) and whose width is 100 and height is 80 is touching (maybe over) the rectangle whose left upper corner coordinates start at (50, 70) and whose width is 120 and height is 90.");
	}
	
	//Two circles:
	if (CB_Collisions.isCircleOverCircle(20, 30, 100, 50, 70, 200))
	{
		CB_console("The circle whose center is in (20, 30) pixel coordinates and its radius is 100 pixels is over the circle whose center is in (50, 70) pixel coordinates and its radius is 200 pixels.");
	}
	if (CB_Collisions.isCircleTouchingCircle(20, 30, 100, 50, 70, 200)) //Also if they are adjacent (next to each other).
	{
		CB_console("The circle whose center is in (20, 30) pixel coordinates and its radius is 100 pixels is touching (maybe over) the circle whose center is in (50, 70) pixel coordinates and its radius is 200 pixels.");
	}

	//NOTE: for other types of collisions, check the API documentation.
</code></pre>
<p>
	For some collisions with the mouse cursor, you can use the <a href="api/CB_Mouse.html" target="_blank">CB_Mouse</a> static class. To get more information, read the <a href="<?php echo basicTutorialLink("input", "mouse"); ?>" target="_blank"><?php echo $basicTutorial["input"]["topics"]["mouse"][$language]; ?></a> topic of the basic tutorial.
</p>


<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Collisions.html" target="_blank">CB_Collisions</a> static class.
</p>