/**
 * @file Collisions management. Contains the {@link CB_Collisions} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */

 
/**
 * Static class to manage collisions. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Finish many functions for many more kinds of collisions.
 * @todo Add triangles, polygons, arcs, etc.
 * @todo Add support to more dimensions (at least to 3D).
 * @todo Add lacking "touching" functions, equivalent to the "over" ones.
 * @todo Add a boolean parameter and a border parameter to detect collision just when it hits the border (not when it is inside of the object without touching the border), for "hollow" shapes.
 * @todo Think about adding function aliases with reversed names (for example, "isElementOverPoint" that points to "isPointOverElement", etc.). Think about whether the aliases should or not have some parameters in reversed order.
 */
var CB_Collisions = function() { return CB_Collisions; };
{
	CB_Collisions.initialized = false; //It will tells whether the object has been initialized or not.


	//Initializes all values:
	CB_Collisions.init = function()
	{
		if (CB_Collisions.initialized) { return CB_Collisions; }

		//The object has been initialized:
		CB_Collisions.initialized = true;
		
		//TODO.

		return CB_Collisions;
	}

	
	//TODO: add polygons, arcs, etc.
	

	/**
	 * Tells the distance between two points.
	 *  @function
	 *  @param {number} x - The "X" coordinate of the first point.
	 *  @param {number} y - The "Y" coordinate of the first point.
	 *  @param {number} x2 - The "X" coordinate of the second point.
	 *  @param {number} y2 - The "Y" coordinate of the second point.
	 *  @returns {number|null} Returns the distance between the two points. In the case that it could not be calculated, returns null.
	 */
	CB_Collisions.getDistancePoints = function(x, y, x2, y2)
	{
		var distance = parseFloat(Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2)));
		return isNaN(distance) ? null : distance;
	}
	

	/**
	 * Tells whether a given point is over a given DOM element (it will be considered a rectangle).
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {Element} element - The DOM element that we want to check (it will be considered a rectangle).
	 *  @returns {boolean} Returns whether the point is over the given DOM element (it will be considered a rectangle).
	 */
	CB_Collisions.isPointOverElement = function(x, y, element)
	{
		if (typeof(element) === "undefined" || element === null) { return false; }
		return CB_Collisions.isPointOverRectangle(x, y, CB_Elements.getLeft(element), CB_Elements.getTop(element), CB_Elements.getWidth(element), CB_Elements.getHeight(element));
	}


	/**
	 * Tells whether a given point is touching (maybe over) a given DOM element (it will be considered a rectangle). This will also return true if they are adjacent (next to each other).
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {Element} element - The DOM element that we want to check (it will be considered a rectangle).
	 *  @returns {boolean} Returns whether the point is touching (maybe over) the given DOM element (it will be considered a rectangle). This will also return true if they are adjacent (next to each other).
	 */
	CB_Collisions.isPointTouchingElement = function(x, y, element)
	{
		if (typeof(element) === "undefined" || element === null) { return false; }
		return CB_Collisions.isPointTouchingRectangle(x, y, CB_Elements.getLeft(element), CB_Elements.getTop(element), CB_Elements.getWidth(element), CB_Elements.getHeight(element));
	}


	/**
	 * Tells whether a point is over a line (infinite).
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} lineX1 - The "X" coordinate of a first point of the line.
	 *  @param {number} lineY1 - The "Y" coordinate of a first point of the line.
	 *  @param {number} lineX2 - The "X" coordinate of a second point of the line.
	 *  @param {number} lineY2 - The "Y" coordinate of a second point of the line.
	 *  @param {number} [tolerance=0.001] - The amount of loss of precision we can tolerate to consider a collision.
	 *  @returns {boolean} Returns whether the point is over the line (infinite).
	 *  @todo Think about using a "width" parameter (apart from the "tolerance" parameter).
	 *  @todo Create a CB_Collisions.isPointTouchingLine function.
	 */
	CB_Collisions.isPointOverLine = function(x, y, lineX1, lineY1, lineX2, lineY2, tolerance)
	{
		if (typeof(tolerance) === "undefined" || tolerance === null) { tolerance = 0.001; }

		//If the line is vertical (infinite slope) or just a point:
		if (lineX1 === lineX2)
		{
			//If the point is in the same X axis:
			if (x === lineX1)
			{
				//If the line has the same Y at both ends, it's in fact just a point:
				if (lineY1 === lineY2)
				{
					//If the point is in the same Y axis:
					if (y === lineY1) { return true; } //The line is a point and the point given is the same one.
				}
				else if (lineY1 < lineY2)
				{
					if (y >= lineY1 && y <= lineY2) { return true; }
				}
				else //lineY1 > lineY2
				{
					if (y >= lineY2 && y <= lineY1) { return true; }
				}
			}
		}
		else
		{
			var slope = (lineY2 - lineY1) / (lineX2 - lineX1);
			var yIntercept = lineY1 - slope * lineX1;
			if (Math.abs(y - (slope * x + yIntercept)) <= tolerance)
			{
				return true;
			}
		}

		return false;
	}


	/**
	 * Tells whether a point is over a line segment.
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} segmentX1 - The "X" coordinate of the beginning point of the line.
	 *  @param {number} segmentY1 - The "Y" coordinate of the beginning point of the line.
	 *  @param {number} segmentX2 - The "X" coordinate of the end point of the line.
	 *  @param {number} segmentY2 - The "Y" coordinate of the end point of the line.
	 *  @param {number} [tolerance=0.001] - The amount of loss of precision we can tolerate to consider a collision.
	 *  @returns {boolean} Returns whether the point is over the line segment.
	 *  @todo Think about using a "width" parameter (apart from the "tolerance" parameter).
	 *  @todo Create a CB_Collisions.isPointTouchingSegment function.
	 */
	CB_Collisions.isPointOverSegment = function(x, y, segmentX1, segmentY1, segmentX2, segmentY2, tolerance)
	{
		var rectangleX1 = segmentX1;
		var rectangleY1 = segmentY1;
		var rectangleX2 = segmentX2;
		var rectangleY2 = segmentY2;

		if (segmentX2 < segmentX1)
		{
			rectangleX1 = segmentX2;
			rectangleX2 = segmentX1;
		}
		if (segmentY2 < segmentY1)
		{
			rectangleY1 = segmentY2;
			rectangleY2 = segmentY1;
		}

		if (CB_Collisions.isPointOverRectangle(x, y, rectangleX1, rectangleY1, rectangleX2 - rectangleX1 /*rectangleWidth*/, rectangleY2 - rectangleY1 /*rectangleHeight*/))
		{
			return CB_Collisions.isPointOverLine(x, y, segmentX1, segmentY1, segmentX2, segmentY2, tolerance);
		}

		return false;
	}


	/**
	 * Tells whether a point is over a rectangle.
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} rectangleX - The "X" coordinate of the upper left corner of the rectangle.
	 *  @param {number} rectangleY - The "Y" coordinate of the upper left corner of the rectangle.
	 *  @param {number} rectangleWidth - The width of the rectangle.
	 *  @param {number} rectangleHeight - The height of the rectangle.
	 *  @returns {boolean} Returns whether the point is over the rectangle.
	 *  @todo Think about using a "rotation" parameter to accept rotated rectangles.
	 */
	CB_Collisions.isPointOverRectangle = function(x, y, rectangleX, rectangleY, rectangleWidth, rectangleHeight)
	{
		return (x > rectangleX && x < rectangleX + rectangleWidth && y > rectangleY && y < rectangleY + rectangleHeight);
	}


	/**
	 * Tells whether a point is touching (maybe over) a rectangle. This will also return true if they are adjacent (next to each other).
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} rectangleX - The "X" coordinate of the upper left corner of the rectangle.
	 *  @param {number} rectangleY - The "Y" coordinate of the upper left corner of the rectangle.
	 *  @param {number} rectangleWidth - The width of the rectangle.
	 *  @param {number} rectangleHeight - The height of the rectangle.
	 *  @returns {boolean} Returns whether the point is touching (maybe over) the rectangle. This will also return true if they are adjacent (next to each other).
	 *  @todo Think about using a "rotation" parameter to accept rotated rectangles.
	 */
	CB_Collisions.isPointTouchingRectangle = function(x, y, rectangleX, rectangleY, rectangleWidth, rectangleHeight)
	{
		/*
		if (x >= rectangleX && x <= rectangleX + rectangleWidth)
		{
			if (y >= rectangleY && y <= rectangleY + rectangleHeight)
			{
				return true;
			}
		}
		return false;
		*/
		return (x >= rectangleX && x <= rectangleX + rectangleWidth && y >= rectangleY && y <= rectangleY + rectangleHeight);
	}


	/**
	 * Tells whether a point is over a circle.
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} centreX - The "X" coordinate of the center of the circle.
	 *  @param {number} centreY - The "Y" coordinate of the center of the circle.
	 *  @param {number} radius - The radius of the circle.
	 *  @returns {boolean} Returns whether the point is over the circle.
	 */
	CB_Collisions.isPointOverCircle = function(x, y, centreX, centreY, radius)
	{
		//If the distance is lower than the radius, there is a collision:
		//return (Math.sqrt(Math.pow(centreX - x, 2) + Math.pow(centreY - y, 2)) < radius);
		return CB_Collisions.getDistancePoints(centreX, centreY, x, y) < radius;
	}


	/**
	 * Tells whether a point is touching (maybe over) a circle. This will also return true if they are adjacent (next to each other).
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} centreX - The "X" coordinate of the center of the circle.
	 *  @param {number} centreY - The "Y" coordinate of the center of the circle.
	 *  @param {number} radius - The radius of the circle.
	 *  @returns {boolean} Returns whether the point is touching (maybe over) the circle. This will also return true if they are adjacent (next to each other).
	 */
	CB_Collisions.isPointTouchingCircle = function(x, y, centreX, centreY, radius)
	{
		//If the distance is lower than the radius, there is a collision:
		//return (Math.sqrt(Math.pow(centreX - x, 2) + Math.pow(centreY - y, 2)) < radius);
		return CB_Collisions.getDistancePoints(centreX, centreY, x, y) <= radius;
	}


	/**
	 * Tells whether a point is over an ellipse.
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} centreX - The "X" coordinate of the center of the ellipse.
	 *  @param {number} centreY - The "Y" coordinate of the center of the ellipse.
	 *  @param {number} radiusX - The X (horizontal) radius of the ellipse.
	 *  @param {number} radiusY - The Y (vertical) radius of the ellipse.
	 *  @param {number} [rotation=0] - The ellipse rotation. The value given will be considered either degrees or radians depending on the given "rotationUseDegrees" parameter (by default, it is considered radians). Not implemented yet!
	 *  @param {boolean} [rotationUseDegrees=false] - Defines whether the "rotation" given should be considered degrees or not (radians). Not implemented yet!
	 *  @returns {boolean} Returns whether the point is over the ellipse.
	 *  @todo Make the "rotation" parameter work (check https://math.stackexchange.com/questions/426150/what-is-the-general-equation-of-the-ellipse-that-is-not-in-the-origin-and-rotate).
	 */
	CB_Collisions.isPointOverEllipse = function(x, y, centreX, centreY, radiusX, radiusY, rotation, rotationUseDegrees)
	{
		if (typeof(rotation) === "undefined" || rotation === null || isNaN(rotation)) { rotation = 0; }
		if (rotationUseDegrees && rotation !== 0) { rotation *= Math.PI / 180 }
		
		var dx = x - centreX;
		var dy = y - centreY;
		return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) < 1;
	}


	/**
	 * Tells whether a point is touching (maybe over) a ellipse. This will also return true if they are adjacent (next to each other).
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} centreX - The "X" coordinate of the center of the ellipse.
	 *  @param {number} centreY - The "Y" coordinate of the center of the ellipse.
	 *  @param {number} radiusX - The X (horizontal) radius of the ellipse.
	 *  @param {number} radiusY - The Y (vertical) radius of the ellipse.
	 *  @param {number} [rotation=0] - The ellipse rotation. The value given will be considered either degrees or radians depending on the given "rotationUseDegrees" parameter (by default, it is considered radians). Not implemented yet!
	 *  @param {boolean} [rotationUseDegrees=false] - Defines whether the "rotation" given should be considered degrees or not (radians). Not implemented yet!
	 *  @returns {boolean} Returns whether the point is touching (maybe over) the ellipse. This will also return true if they are adjacent (next to each other).
	 *  @todo Make the "rotation" parameter work (check https://math.stackexchange.com/questions/426150/what-is-the-general-equation-of-the-ellipse-that-is-not-in-the-origin-and-rotate).
	 */
	CB_Collisions.isPointTouchingEllipse = function(x, y, centreX, centreY, radiusX, radiusY, rotation, rotationUseDegrees)
	{
		if (typeof(rotation) === "undefined" || rotation === null || isNaN(rotation)) { rotation = 0; }
		if (rotationUseDegrees && rotation !== 0) { rotation *= Math.PI / 180 }
		
		var dx = x - centreX;
		var dy = y - centreY;
		return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;
	}


	/**
	 * Tells whether a rectangle is over another rectangle.
	 *  @function
	 *  @param {number} rectangleX - The "X" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleY - The "Y" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleWidth - The width of the first rectangle.
	 *  @param {number} rectangleHeight - The height of the first rectangle.
	 *  @param {number} rectangleX2 - The "X" coordinate of the upper left corner of the second rectangle.
	 *  @param {number} rectangleY2 - The "Y" coordinate of the upper left corner of the second rectangle.
	 *  @param {number} rectangleWidth2 - The width of the second rectangle.
	 *  @param {number} rectangleHeight2 - The height of the second rectangle.
	 *  @returns {boolean} Returns whether the rectangle is over the other rectangle.
	 *  @todo Think about using "rotation" and "rotation2" parameters to accept rotated rectangles.
	 */
	CB_Collisions.isRectangleOverRectangle = function(rectangleX, rectangleY, rectangleWidth, rectangleHeight, rectangleX2, rectangleY2, rectangleWidth2, rectangleHeight2)
	{
		return (
			Math.max(rectangleX, rectangleX2) < Math.min(rectangleX + rectangleWidth, rectangleX2 + rectangleWidth2) &&
			Math.max(rectangleY, rectangleY2) < Math.min(rectangleY + rectangleHeight, rectangleY2 + rectangleHeight2)
		);
	}


	/**
	 * Tells whether a rectangle is touching (maybe over) another rectangle. This will also return true if they are adjacent (next to each other).
	 *  @function
	 *  @param {number} rectangleX - The "X" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleY - The "Y" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleWidth - The width of the first rectangle.
	 *  @param {number} rectangleHeight - The height of the first rectangle.
	 *  @param {number} rectangleX2 - The "X" coordinate of the upper left corner of the second rectangle.
	 *  @param {number} rectangleY2 - The "Y" coordinate of the upper left corner of the second rectangle.
	 *  @param {number} rectangleWidth2 - The width of the second rectangle.
	 *  @param {number} rectangleHeight2 - The height of the second rectangle.
	 *  @returns {boolean} Returns whether the rectangle is touching (maybe over) the other rectangle. This will also return true if they are adjacent (next to each other).
	 *  @todo Think about using "rotation" and "rotation2" parameters to accept rotated rectangles.
	 */
	CB_Collisions.isRectangleTouchingRectangle = function(rectangleX, rectangleY, rectangleWidth, rectangleHeight, rectangleX2, rectangleY2, rectangleWidth2, rectangleHeight2)
	{
		return (
			Math.max(rectangleX, rectangleX2) <= Math.min(rectangleX + rectangleWidth, rectangleX2 + rectangleWidth2) &&
			Math.max(rectangleY, rectangleY2) <= Math.min(rectangleY + rectangleHeight, rectangleY2 + rectangleHeight2)
		);
	}


	/**
	 * Tells whether a rectangle is over a given DOM element (it will be considered a rectangle).
	 *  @function
	 *  @param {number} rectangleX - The "X" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleY - The "Y" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleWidth - The width of the first rectangle.
	 *  @param {number} rectangleHeight - The height of the first rectangle.
 	 *  @param {Element} element - The DOM element that we want to check (it will be considered a rectangle).
	 *  @returns {boolean} Returns whether the rectangle is over the given DOM element (it will be considered a rectangle).
	 *  @todo Think about using a "rotation" parameter to accept rotated rectangles.
	 */
	CB_Collisions.isRectangleOverElement = function(rectangleX, rectangleY, rectangleWidth, rectangleHeight, element)
	{
		if (typeof(element) === "undefined" || element === null) { return false; }
		return CB_Collisions.isRectangleOverRectangle(rectangleX, rectangleY, rectangleWidth, rectangleHeight, CB_Elements.getLeft(element), CB_Elements.getTop(element), CB_Elements.getWidth(element), CB_Elements.getHeight(element));
	}


	/**
	 * Tells whether a rectangle is touching (maybe over) a given DOM element (it will be considered a rectangle). This will also return true if they are adjacent (next to each other).
	 *  @function
	 *  @param {number} rectangleX - The "X" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleY - The "Y" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleWidth - The width of the first rectangle.
	 *  @param {number} rectangleHeight - The height of the first rectangle.
 	 *  @param {Element} element - The DOM element that we want to check (it will be considered a rectangle).
	 *  @returns {boolean} Returns whether the rectangle is touching (maybe over) the given DOM element (it will be considered a rectangle). This will also return true if they are adjacent (next to each other).
	 *  @todo Think about using a "rotation" parameter to accept rotated rectangles.
	 */
	CB_Collisions.isRectangleTouchingElement = function(rectangleX, rectangleY, rectangleWidth, rectangleHeight, element)
	{
		if (typeof(element) === "undefined" || element === null) { return false; }
		return CB_Collisions.isRectangleTouchingRectangle(rectangleX, rectangleY, rectangleWidth, rectangleHeight, CB_Elements.getLeft(element), CB_Elements.getTop(element), CB_Elements.getWidth(element), CB_Elements.getHeight(element));
	}


	/**
	 * Tells whether two given DOM elements are over each other (they will be considered a rectangle).
	 *  @function
 	 *  @param {Element} element - The first DOM element that we want to check (it will be considered a rectangle).
	 *  @param {Element} element2 - The second DOM element that we want to check (it will be considered a rectangle).
	 *  @returns {boolean} Returns whether the two given DOM elements are over each other (they will be considered a rectangle).
	 */
	CB_Collisions.isElementOverElement = function(element, element2)
	{
		if (typeof(element) === "undefined" || element === null) { return false; }
		return CB_Collisions.isRectangleOverElement(CB_Elements.getLeft(element), CB_Elements.getTop(element), CB_Elements.getWidth(element), CB_Elements.getHeight(element), element2);
	}


	/**
	 * Tells whether two given DOM elements are touching each other, maybe over each other (they will be considered a rectangle). This will also return true if they are adjacent (next to each other).
	 *  @function
 	 *  @param {Element} element - The first DOM element that we want to check (it will be considered a rectangle).
	 *  @param {Element} element2 - The second DOM element that we want to check (it will be considered a rectangle).
	 *  @returns {boolean} Returns whether the two given DOM elements are touching each other, maybe over each other (they will be considered a rectangle). This will also return true if they are adjacent (next to each other).
	 */
	CB_Collisions.isElementTouchingElement = function(element, element2)
	{
		if (typeof(element) === "undefined" || element === null) { return false; }
		return CB_Collisions.isRectangleTouchingElement(CB_Elements.getLeft(element), CB_Elements.getTop(element), CB_Elements.getWidth(element), CB_Elements.getHeight(element), element2);
	}


	/**
	 * Tells whether a circle is over another circle.
	 *  @function
	 *  @param {number} centreX - The "X" coordinate of the center of the first circle.
	 *  @param {number} centreY - The "Y" coordinate of the center of the first circle.
	 *  @param {number} radius - The radius of the first circle.
	 *  @param {number} centreX2 - The "X" coordinate of the center of the second circle.
	 *  @param {number} centreY2 - The "Y" coordinate of the center of the second circle.
	 *  @param {number} radius2 - The radius of the second circle.
	 *  @returns {boolean} Returns whether the circle is over the other circle.
	 */
	CB_Collisions.isCircleOverCircle = function(centreX, centreY, radius, centreX2, centreY2, radius2)
	{
		//return (Math.sqrt(Math.pow(centreX - centreX2, 2) + Math.pow(centreY - centreY2, 2)) < radius + radius2); 
		return CB_Collisions.getDistancePoints(centreX, centreY, centreX2, centreY2) < radius + radius2;
	}


	/**
	 * Tells whether a circle is touching (maybe over) another circle. This will also return true if they are adjacent (next to each other).
	 *  @function
	 *  @param {number} centreX - The "X" coordinate of the center of the first circle.
	 *  @param {number} centreY - The "Y" coordinate of the center of the first circle.
	 *  @param {number} radius - The radius of the first circle.
	 *  @param {number} centreX2 - The "X" coordinate of the center of the second circle.
	 *  @param {number} centreY2 - The "Y" coordinate of the center of the second circle.
	 *  @param {number} radius2 - The radius of the second circle.
	 *  @returns {boolean} Returns whether the circle is touching (maybe over) the other circle. This will also return true if they are adjacent (next to each other).
	 */
	CB_Collisions.isCircleTouchingCircle = function(centreX, centreY, radius, centreX2, centreY2, radius2)
	{
		//return (Math.sqrt(Math.pow(centreX - centreX2, 2) + Math.pow(centreY - centreY2, 2)) <= radius + radius2); 
		return CB_Collisions.getDistancePoints(centreX, centreY, centreX2, centreY2) <= radius + radius2;
	}


	/**
	 * Tells whether a circle is over a given rectangle.
	 *  @function
	 *  @param {number} centreX - The "X" coordinate of the center of the first circle.
	 *  @param {number} centreY - The "Y" coordinate of the center of the first circle.
	 *  @param {number} radius - The radius of the first circle.
	 *  @param {number} rectangleX - The "X" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleY - The "Y" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleWidth - The width of the first rectangle.
	 *  @param {number} rectangleHeight - The height of the first rectangle.
	 *  @returns {boolean} Returns whether the circle is over the rectangle.
	 *  @todo Think about using a "rotation" parameter to accept rotated rectangles.
	 */
	//* Source (modified): markE at https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
	CB_Collisions.isRectangleOverCircle = function(centreX, centreY, radius, rectangleX, rectangleY, rectangleWidth, rectangleHeight)
	{
		var distanceX = Math.abs(centreX - rectangleX - rectangleWidth / 2);
		var distanceY = Math.abs(centreY - rectangleY - rectangleHeight / 2);

		if (distanceX > rectangleWidth / 2 + radius) { return false; }
		if (distanceY > rectangleHeight / 2 + radius) { return false; }

		if (distanceX < rectangleWidth / 2) { return true; } 
		if (distanceY < rectangleHeight / 2) { return true; }

		var dx = distanceX - rectangleWidth / 2;
		var dy = distanceY - rectangleHeight / 2;
		
		return (dx * dx + dy * dy < radius * radius);
	}


	/**
	 * Tells whether a circle is touching (maybe over) a given rectangle.
	 *  @function
	 *  @param {number} rectangleX - The "X" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleY - The "Y" coordinate of the upper left corner of the first rectangle.
	 *  @param {number} rectangleWidth - The width of the first rectangle.
	 *  @param {number} rectangleHeight - The height of the first rectangle.
	 *  @param {number} centreX - The "X" coordinate of the center of the first circle.
	 *  @param {number} centreY - The "Y" coordinate of the center of the first circle.
	 *  @param {number} radius - The radius of the first circle.
	 *  @returns {boolean} Returns whether the circle is touching (maybe over) the rectangle. This will also return true if they are adjacent (next to each other).
	 *  @todo Think about using a "rotation" parameter to accept rotated rectangles.
	 //* Source (modified): markE at https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
	 */
	CB_Collisions.isRectangleTouchingCircle = function(rectangleX, rectangleY, rectangleWidth, rectangleHeight, centreX, centreY, radius)
	{
		var distanceX = Math.abs(centreX - rectangleX - rectangleWidth / 2);
		var distanceY = Math.abs(centreY - rectangleY - rectangleHeight / 2);

		if (distanceX > rectangleWidth / 2 + radius) { return false; }
		if (distanceY > rectangleHeight / 2 + radius) { return false; }

		if (distanceX <= rectangleWidth / 2) { return true; } 
		if (distanceY <= rectangleHeight / 2) { return true; }

		var dx = distanceX - rectangleWidth / 2;
		var dy = distanceY - rectangleHeight / 2;
		
		return (dx * dx + dy * dy <= radius * radius);
	}


	/**
	 * Tells whether a line (infinite) is over a given circle.
	 *  @function
	 *  @param {number} lineX1 - The "X" coordinate of a first point of the line.
	 *  @param {number} lineY1 - The "Y" coordinate of a first point of the line.
	 *  @param {number} lineX2 - The "X" coordinate of a second point of the line.
	 *  @param {number} lineY2 - The "Y" coordinate of a second point of the line.
	 *  @param {number} centreX - The "X" coordinate of the center of the first circle.
	 *  @param {number} centreY - The "Y" coordinate of the center of the first circle.
	 *  @param {number} radius - The radius of the first circle.
	 *  @returns {boolean} Returns whether the line (infinite) is over the circle.
	 */
	//* Source (modified): https://github.com/mattdesl/line-circle-collision
	CB_Collisions.isLineOverCircle = function(lineX1, lineY1, lineX2, lineY2, centreX, centreY, radius)
	{
		if (CB_Collisions.isPointOverCircle(lineX1, lineY1, centreX, centreY, radius)) { return true; }
		else if (CB_Collisions.isPointOverCircle(lineX2, lineY2, centreX, centreY, radius)) { return true; }

		var dx = lineX2 - lineX1;
		var dy = lineY2 - lineY1;
		
		var lcx = centreX - lineX1;
		var lcy = centreY - lineY1;
		
		var dLen2 = dx * dx + dy * dy;
		var px = dx;
		var py = dy;
		
		if (dLen2 > 0)
		{
			var dp = (lcx * dx + lcy * dy) / dLen2;
			px *= dp;
			py *= dp;
		}
		
		var pLen2 = px * px + py * py;
		
		return CB_Collisions.isPointOverCircle(lineX1 + px, lineY1 + py, centreX, centreY, radius) && pLen2 < dLen2 && (px * dx + py * dy) > 0; //TODO: test it well (some equal signs removed).
	}


	/**
	 * Tells whether a line (infinite) is touching (maybe over) a given circle.
	 *  @function
	 *  @param {number} lineX1 - The "X" coordinate of a first point of the line.
	 *  @param {number} lineY1 - The "Y" coordinate of a first point of the line.
	 *  @param {number} lineX2 - The "X" coordinate of a second point of the line.
	 *  @param {number} lineY2 - The "Y" coordinate of a second point of the line.
	 *  @param {number} centreX - The "X" coordinate of the center of the first circle.
	 *  @param {number} centreY - The "Y" coordinate of the center of the first circle.
	 *  @param {number} radius - The radius of the first circle.
	 *  @returns {boolean} Returns whether the line (infinite) is touching (maybe over) the circle.
	 */
	//* Source (modified): https://github.com/mattdesl/line-circle-collision
	CB_Collisions.isLineTouchingCircle = function(lineX1, lineY1, lineX2, lineY2, centreX, centreY, radius)
	{
		if (CB_Collisions.isPointTouchingCircle(lineX1, lineY1, centreX, centreY, radius)) { return true; }
		else if (CB_Collisions.isPointTouchingCircle(lineX2, lineY2, centreX, centreY, radius)) { return true; }

		var dx = lineX2 - lineX1;
		var dy = lineY2 - lineY1;
		
		var lcx = centreX - lineX1;
		var lcy = centreY - lineY1;
		
		var dLen2 = dx * dx + dy * dy;
		var px = dx;
		var py = dy;
		
		if (dLen2 > 0)
		{
			var dp = (lcx * dx + lcy * dy) / dLen2;
			px *= dp;
			py *= dp;
		}
		
		var pLen2 = px * px + py * py;
		
		return CB_Collisions.isPointTouchingCircle(lineX1 + px, lineY1 + py, centreX, centreY, radius) && pLen2 <= dLen2 && (px * dx + py * dy) >= 0;
	}


	//Function that returns whether a line is over another line:
	CB_Collisions.isLineOverLine = function()
	{

	}

	//Function that returns whether a line segment is over another line segment:
	CB_Collisions.isSegmentOverSegment = function()
	{

	}


	//Function that returns whether a line is over a segment:
	CB_Collisions.isLineOverSegment = function()
	{

	}


	//Function that returns whether a line is over a rectangle:
	CB_Collisions.isLineOverRectangle = function()
	{

	}

	//Function that returns whether a line is over a circle:
	CB_Collisions.isLineOverCircle = function()
	{

	}


	//Function that returns whether a line segment is over a rectangle:
	CB_Collisions.isSegmentOverRectangle = function()
	{

	}

	//Function that returns whether a line segment is over a circle:
	CB_Collisions.isSegmentOverCircle = function()
	{

	}


	//Function that returns whether a line is touching (maybe over) another line:
	CB_Collisions.isLineTouchingLine = function()
	{

	}


	//Function that returns whether a line is touching (maybe over) a line segment:
	CB_Collisions.isLineTouchingSegment = function()
	{

	}


	//Function that returns whether a line is touching (maybe over) a rectangle:
	CB_Collisions.isLineTouchingRectangle = function()
	{

	}


	//Function that returns whether a line segment is touching (maybe over) a rectangle:
	CB_Collisions.isSegmentTouchingRectangle = function()
	{

	}


	//Function that returns whether a line segment is touching (maybe over) a circle:
	CB_Collisions.isSegmentTouchingCircle = function()
	{

	}

}