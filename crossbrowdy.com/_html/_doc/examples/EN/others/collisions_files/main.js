CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	printMessage("Creating canvas...");
	
	//Creates the canvas:
	var onLoadCanvas = function()
	{
		printMessage("Canvas loaded!");

		//Processes the elements:
		processElements(this);
	};
	myCanvas = new CB_Canvas
	(
		"my_canvas", //canvasId. Unique required parameter.
		"2d", //contextType. NOTE: some emulation methods only support "2d". Default: "2d".
		250, //canvasWidth. Use 'CB_Screen.getWindowWidth()' for complete width. Default: CB_Canvas.WIDTH_DEFAULT.
		250, //canvasHeight. Use 'CB_Screen.getWindowHeight()' for complete height. Default: CB_Canvas.HEIGHT_DEFAULT.
		onLoadCanvas, //onLoad.
		function(error) { printMessage("Canvas object problem! Error: " + error); } //onError.
	);
}


//Shows a message:
function printMessage(message)
{
	message = CB_trim(message);
	if (message.indexOf("COLLISION: ") !== -1) { message = '<span class="message_collision">' + message + '</span>'; }
	if (message === "") { CB_Elements.insertContentById("messages", ""); }
	else
	{
		CB_Elements.appendContentById("messages", message + "<br />");
		CB_Elements.id("messages").scrollTop = CB_Elements.id("messages").scrollHeight; //Scrolls to the bottom.
	}
}


//Processes the elements:
var inputIds =
[
	"point_a_x", "point_a_y",
	"point_b_x", "point_b_y",
	
	"rectangle_a_x", "rectangle_a_y", "rectangle_a_width", "rectangle_a_height",
	"rectangle_b_x", "rectangle_b_y", "rectangle_b_width", "rectangle_b_height",
	
	"circle_a_x", "circle_a_y", "circle_a_radius",
	"circle_b_x", "circle_b_y", "circle_b_radius",
	
	"ellipse_a_x", "ellipse_a_y", "ellipse_a_radius_x", "ellipse_a_radius_y",
	
	"line_x1", "line_y1", "line_x2", "line_y2",
	
	"segment_x1", "segment_y1", "segment_x2", "segment_y2"
];
var lastElementsData = {};
function processElements(CB_CanvasObject)
{
	//Sanitize inputs and extract their values:
	var elementsData = {};
	var elementsDataChanged = false;
	for (var x = inputIds.length - 1; x >= 0; x--)
	{
		CB_Elements.id(inputIds[x]).value = elementsData[inputIds[x]] = sanitizeNumber(inputIds[x], CB_CanvasObject);
		if (elementsData[inputIds[x]] !== lastElementsData[inputIds[x]]) { elementsDataChanged = true; }
	}
	
	if (elementsDataChanged)
	{
		printMessage(""); //Clears the previous messages (if any).
		printMessage("Processing the elements...");
		
		printMessage("Elements data sanitized: " + JSON.stringify(elementsData));
		
		//Draws the elements in the canvas:
		drawElements(elementsData, CB_CanvasObject);
		
		//Checks collisions of the elements:
		checkElementsCollisions(elementsData);
		
		lastElementsData = elementsData;
	}
	
	//Calls itself again:
	setTimeout(function() { processElements(CB_CanvasObject); }, 1);
}


//Sanitize inputs to only allow numeric values:
function sanitizeNumber(idElement, CB_CanvasObject)
{
	var value = parseFloat(CB_Elements.id(idElement).value);
	value = isNaN(value) ? 0 : value;
	if (idElement.indexOf("_x") !== -1)
	{
		var canvasWidth = CB_CanvasObject.getWidth();
		if (value < 0) { value = 0; }
		else if (value > canvasWidth) { value = canvasWidth; }
	}
	else if (idElement.indexOf("_y") !== -1)
	{
		var canvasHeight = CB_CanvasObject.getHeight();
		if (value < 0) { value = 0; }
		else if (value > canvasHeight) { value = canvasHeight; }
	}
	return value;
}


//Draws the elements in the canvas:
function drawElements(elementsData, CB_CanvasObject)
{
	printMessage("Trying to draw the elements...");

	//Clears the canvas:
	CB_CanvasObject.clear(true, "#ffffff"); //Clears the canvas keeping the transform and using desired background colour.
	
	//Gets the "context" object to start working with the canvas:
	var canvasContext = CB_CanvasObject.getContext();
	if (!canvasContext) { printMessage("ERROR: canvas context could not be obtained! Drawing cannot be performed."); return; }

	var canvasWidth = CB_CanvasObject.getWidth();
	var canvasHeight = CB_CanvasObject.getHeight();

	canvasContext.globalAlpha = 0.3;

	//Draws the points:
	canvasContext.fillStyle = "#ff0000";
	canvasContext.fillRect(elementsData.point_a_x, elementsData.point_a_y, 1, 1);
	canvasContext.fillStyle = "#0000ff";
	canvasContext.fillRect(elementsData.point_b_x, elementsData.point_b_y, 1, 1);
	
	//Draw label for the points (they are difficult to see):
	//Note: SLCanvas doesn't support font property and fillText method:
	canvasContext.fillStyle = "#00aaaa";
	canvasContext.strokeStyle = "#003300";
	canvasContext.font = "10px arial";
	canvasContext.fillText("Point A", elementsData.point_a_x < canvasWidth - 38 ? elementsData.point_a_x + 2 : elementsData.point_a_x - 38, elementsData.point_a_y > 12 ? elementsData.point_a_y + 2 : elementsData.point_a_y + 12);
	canvasContext.fillText("Point B", elementsData.point_b_x < canvasWidth - 38 ? elementsData.point_b_x + 2 : elementsData.point_b_x - 38, elementsData.point_b_y > 12 ? elementsData.point_b_y + 2 : elementsData.point_b_y + 12);
	
	//Draws the rectangles:
	canvasContext.fillStyle = "#00ff00";
	canvasContext.fillRect(elementsData.rectangle_a_x, elementsData.rectangle_a_y, elementsData.rectangle_a_width, elementsData.rectangle_a_height);
	canvasContext.fillStyle = "#00ffff";
	canvasContext.fillRect(elementsData.rectangle_b_x, elementsData.rectangle_b_y, elementsData.rectangle_b_width, elementsData.rectangle_b_height);

	//Draws the circles:
	canvasContext.fillStyle = "#ffff00";
	canvasContext.beginPath();
	canvasContext.arc(elementsData.circle_a_x, elementsData.circle_a_y, elementsData.circle_a_radius, 0, Math.PI * 2, true);
	canvasContext.closePath();
	canvasContext.fill();
	canvasContext.fillStyle = "#ff00ff";
	canvasContext.beginPath();
	canvasContext.arc(elementsData.circle_b_x, elementsData.circle_b_y, elementsData.circle_b_radius, 0, Math.PI * 2, true);
	canvasContext.closePath();
	canvasContext.fill();

	//Draws the ellipse:
	canvasContext.fillStyle = "#ccbbaa";
	canvasContext.beginPath();
	canvasContext.arc(elementsData.circle_a_x, elementsData.circle_a_y, elementsData.circle_a_radius, 0, Math.PI * 2, true);
	canvasContext.ellipse(elementsData.ellipse_a_x, elementsData.ellipse_a_y, elementsData.ellipse_a_radius_x, elementsData.ellipse_a_radius_y, 0, 2, 11, false);
	canvasContext.closePath();
	canvasContext.fill();
	
	//Draws the line:
	//NOTE: using the slope-of-a-rect formula: y = mx + n (m = "slope", n = "value of 'y' when 'x' = 0").
	var yDifference = (elementsData.line_y2 - elementsData.line_y1);
	var xDifference = (elementsData.line_x2 - elementsData.line_x1);
	var m = 0; //Slope. By default, it will be default as no slope (horizontal line).
	var n = elementsData.line_y1; //value of 'y' when 'x' = 0.
	//If there is no horizontal difference between the points, the line is vertical:
	if (xDifference === 0) { m = null; n = undefined; } //Infinite slope (vertical line). The 'null' will be considered infinite.
	//...otherwise, if there is vertical difference between the points, the line is neither vertical nor horizontal:
	else if (yDifference !== 0)
	{
		m = yDifference / xDifference; //Slope.
		//var n = (-m + elementsData.line_y1) / elementsData.line_x1; //Value of 'y' when 'x' = 0. Calculus: y = mx + n => elementsData.line_y1 = m * elementsData.line_x1 + n => n = (-m + elementsData.line_y1) / elementsData.line_x1.
		var n = (-m + yDifference) / xDifference; //Value of 'y' when 'x' = 0. Calculus: y = mx + n => elementsData.line_y1 = m * elementsData.line_x1 + n => n = (-m + elementsData.line_y1) / elementsData.line_x1.
	}
	
	//No slope (horizontal line):
	var xFirst = 0;
	var yFirst = Math.max(0, Math.min(elementsData.line_y1, canvasHeight)); //y = n = elementsData.line_y1 = elementsData.line_y2, when x = 0.
	var xLast = canvasWidth; //To the limit.
	var yLast = Math.max(0, Math.min(elementsData.line_y2, canvasHeight));

	//Infinite slope (vertical line):
	if (m === null)
	{
		xFirst = Math.max(0, Math.min(elementsData.line_x1, canvasWidth));
		yFirst = 0;
		xLast = Math.max(0, Math.min(elementsData.line_x1, canvasWidth));
		yLast = canvasHeight; //To the limit.
	}
	//Normal slope:
	else if (m !== 0)
	{
		xFirst = 0;
		yFirst = n;
		if (yFirst > 0 || yFirst < canvasHeight) //If the first "y" starts in the middle of the canvas:
		{
			xFirst = -n / m; //y = mx + n => 0 = mx + n => x = (0 - n) / m = -n / m
			yFirst = 0;
		}

		xLast = canvasWidth;
		yLast = m * xLast + n; //y = mx + n.
		if (yLast < canvasHeight) //If the last "y"  does not reach the canvas bottom:
		{
			yLast = canvasHeight; //x = elementsData.line_x2 * 10000, y = mx + n => y = (m * elementsData.line_x2 * 10000) + n.
			xLast = (yLast - n) / m; //y = mx + n => x = (y - n) / m.
		}
	}

	canvasContext.strokeStyle = "#3512ad";
	canvasContext.beginPath();
	canvasContext.moveTo(xFirst, yFirst);
	canvasContext.lineWidth = 1;
	canvasContext.lineTo(xLast, yLast); //x = elementsData.line_x2 * 10000, y = mx + n => y = (m * elementsData.line_x2 * 10000) + n.
	canvasContext.closePath();
	canvasContext.stroke();

	//Draws the segment:
	canvasContext.strokeStyle = "#35ad12";
	canvasContext.beginPath();
	canvasContext.moveTo(elementsData.segment_x1, elementsData.segment_y1);
	canvasContext.lineWidth = 1;
	canvasContext.lineTo(elementsData.segment_x2, elementsData.segment_y2);
	canvasContext.closePath();
	canvasContext.stroke(); 
}


//Checks collisions of the elements:
function checkElementsCollisions(elementsData)
{
	printMessage("Processing elements to check collisions...");
	
	//Distance between two points:
	printMessage("The distance between 'Point A' and 'Point B' is: " + CB_Collisions.getDistancePoints(elementsData.point_a_x, elementsData.point_a_y, elementsData.point_b_x, elementsData.point_b_y));
	
	//A point and a rectangle:
	if (CB_Collisions.isPointOverRectangle(elementsData.point_a_x, elementsData.point_a_y, elementsData.rectangle_a_x, elementsData.rectangle_a_y, elementsData.rectangle_a_width, elementsData.rectangle_a_height))
	{
		printMessage("COLLISION: The point is over a rectangle whose left upper corner coordinates start at (" + elementsData.point_a_x + ", " + elementsData.point_a_y + ") and whose width is " + elementsData.rectangle_a_width + " and height is " + elementsData.rectangle_a_height + ".");
	}
	if (CB_Collisions.isPointTouchingRectangle(elementsData.point_a_x, elementsData.point_a_y, elementsData.rectangle_a_x, elementsData.rectangle_a_y, elementsData.rectangle_a_width, elementsData.rectangle_a_height)) //Also if they are adjacent (next to each other).
	{
		printMessage("COLLISION: The point is touching (maybe over) a rectangle whose left upper corner coordinates start at (" + elementsData.point_a_x + ", " + elementsData.point_a_y + ") and whose width is " + elementsData.rectangle_a_width + " and height is " + elementsData.rectangle_a_height + ".");
	}
	
	//A point and a circle:
	if (CB_Collisions.isPointOverCircle(elementsData.point_a_x, elementsData.point_a_y, elementsData.circle_a_x, elementsData.circle_a_y, elementsData.circle_a_radius))
	{
		printMessage("COLLISION: The point is over a circle whose center is in (" + elementsData.circle_a_x + ", " + elementsData.circle_a_y + ") pixel coordinates and its radius is " + elementsData.circle_a_radius + " pixels.");
	}
	if (CB_Collisions.isPointTouchingCircle(elementsData.point_a_x, elementsData.point_a_y, elementsData.circle_a_x, elementsData.circle_a_y, elementsData.circle_a_radius)) //Also if they are adjacent (next to each other).
	{
		printMessage("COLLISION: The point is touching (maybe over) a circle whose center is in (" + elementsData.circle_a_x + ", " + elementsData.circle_a_y + ") pixel coordinates and its radius is " + elementsData.circle_a_radius + " pixels.");
	}

	//A point and an ellipse:
	if (CB_Collisions.isPointOverEllipse(elementsData.point_a_x, elementsData.point_a_y, elementsData.ellipse_a_x, elementsData.ellipse_a_y, elementsData.ellipse_a_radius_x, elementsData.ellipse_a_radius_y))
	{
		printMessage("COLLISION: The point is over a ellipse whose center is in (" + elementsData.ellipse_a_x + ", " + elementsData.ellipse_a_y + ") pixel coordinates and its horizontal and vertical radii are " + elementsData.ellipse_a_radius_x + " and " + elementsData.ellipse_a_radius_y + " pixels respectively.");
	}
	if (CB_Collisions.isPointTouchingEllipse(elementsData.point_a_x, elementsData.point_a_y, elementsData.ellipse_a_x, elementsData.ellipse_a_y, elementsData.ellipse_a_radius_x, elementsData.ellipse_a_radius_y)) //Also if they are adjacent (next to each other).
	{
		printMessage("COLLISION: The point is touching (maybe over) a ellipse whose center is in (" + elementsData.ellipse_a_x + ", " + elementsData.ellipse_a_y + ") pixel coordinates and its horizontal and vertical radii are " + elementsData.ellipse_a_radius_x + " and " + elementsData.ellipse_a_radius_y + " pixels respectively.");
	}
	
	//A point and a line (infinite):
	if (CB_Collisions.isPointOverLine(elementsData.point_a_x, elementsData.point_a_y, elementsData.line_x1, elementsData.line_y1, elementsData.line_x2, elementsData.line_y2))
	{
		printMessage("COLLISION: The point is over an infinite line which cross both the (" + elementsData.line_x1 + ", " + elementsData.line_y1 + ") and (" + elementsData.line_x2 + ", " + elementsData.line_y2 + ") coordinates.");
	}
	
	//A point and a line segment (limited):
	if (CB_Collisions.isPointOverSegment(elementsData.point_a_x, elementsData.point_a_y, elementsData.segment_x1, elementsData.segment_y1, elementsData.segment_x2, elementsData.segment_y2))
	{
		printMessage("COLLISION: The point is over a line segment which starts in the (" + elementsData.segment_x1 + ", " + elementsData.segment_y1 + ") and ends in the (" + elementsData.segment_x2 + ", " + elementsData.segment_y2 + ") coordinates.");
	}
	
	//Two rectangles:
	if (CB_Collisions.isRectangleOverRectangle(elementsData.rectangle_a_x, elementsData.rectangle_a_y, elementsData.rectangle_a_width, elementsData.rectangle_a_height, elementsData.rectangle_b_x, elementsData.rectangle_b_y, elementsData.rectangle_b_width, elementsData.rectangle_b_height))
	{
		printMessage("COLLISION: The rectangle whose left upper corner coordinates start at (" + elementsData.point_a_x + ", " + elementsData.point_a_y + ") and whose width is " + elementsData.rectangle_a_width + " and height is " + elementsData.rectangle_a_height + " is over the rectangle whose left upper corner coordinates start at (" + elementsData.point_b_x + ", " + elementsData.point_b_y + ") and whose width is " + elementsData.rectangle_b_width + " and height is " + elementsData.rectangle_b_height + ".");
	}
	if (CB_Collisions.isRectangleTouchingRectangle(elementsData.rectangle_a_x, elementsData.rectangle_a_y, elementsData.rectangle_a_width, elementsData.rectangle_a_height, elementsData.rectangle_b_x, elementsData.rectangle_b_y, elementsData.rectangle_b_width, elementsData.rectangle_b_height)) //Also if they are adjacent (next to each other).
	{
		printMessage("COLLISION: The rectangle whose left upper corner coordinates start at (" + elementsData.point_a_x + ", " + elementsData.point_a_y + ") and whose width is " + elementsData.rectangle_a_width + " and height is " + elementsData.rectangle_a_height + " is touching (maybe over) the rectangle whose left upper corner coordinates start at (" + elementsData.point_b_x + ", " + elementsData.point_b_y + ") and whose width is " + elementsData.rectangle_b_width + " and height is " + elementsData.rectangle_b_height + ".");
	}
	
	//Two circles:
	if (CB_Collisions.isCircleOverCircle(elementsData.circle_a_x, elementsData.circle_a_y, elementsData.circle_a_radius, elementsData.circle_b_x, elementsData.circle_b_y, elementsData.circle_b_radius))
	{
		printMessage("COLLISION: The circle whose center is in (" + elementsData.circle_a_x + ", " + elementsData.circle_a_y + ") pixel coordinates and its radius is " + elementsData.circle_a_radius + " pixels is over the circle whose center is in (" + elementsData.circle_b_x + ", " + elementsData.circle_b_y + ") pixel coordinates and its radius is " + elementsData.circle_b_radius + " pixels.");
	}
	if (CB_Collisions.isCircleTouchingCircle(elementsData.circle_a_x, elementsData.circle_a_y, elementsData.circle_a_radius, elementsData.circle_b_x, elementsData.circle_b_y, elementsData.circle_b_radius)) //Also if they are adjacent (next to each other).
	{
		printMessage("COLLISION: The circle whose center is in (" + elementsData.circle_a_x + ", " + elementsData.circle_a_y + ") pixel coordinates and its radius is " + elementsData.circle_a_radius + " pixels is touching (maybe over) the circle whose center is in (" + elementsData.circle_b_x + ", " + elementsData.circle_b_y + ") pixel coordinates and its radius is " + elementsData.circle_b_radius + " pixels.");
	}
}