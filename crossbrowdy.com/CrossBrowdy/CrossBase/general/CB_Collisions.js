/**
 * @file Collisions management. Contains the {@link CB_Collisions} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */

 
/**
 * Static class to manage collisions. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Finish many functions for many more kinds of collisions.
 * @todo Add ellipses, triangles, polygons, arcs, etc.
 * @todo Add support to more dimensions (at least to 3D).
 * @todo Add a boolean parameter to functions to return false when collision is just in the border of the element (both elements are attached to each other).
 * @todo Add a boolean parameter and a border parameter to detect collision just when it hits the border (not when it is inside of the object without touching the border), for "hollow" shapes.
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

	
	//TODO: add ellipses, polygons, etc.
	

	/**
	 * Returns whether a given point is colliding with a given DOM element (it will be considered a rectangle).
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {Element} element - The DOM element that we want to check (it will be considered a rectangle).
	 *  @returns {boolean} Returns whether a point is colliding with a given DOM element (it will be considered a rectangle).
	 */
	CB_Collisions.isPointOverElement = function(x, y, element)
	{
		if (typeof(element) === "undefined" || element === null) { return false; }
		return CB_Collisions.isPointOverRectangle(x, y, CB_Elements.getLeft(element), CB_Elements.getTop(element), CB_Elements.getWidth(element), CB_Elements.getHeight(element));
	}


	/**
	 * Returns whether a point is over a line (infinite).
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} lineX1 - The "X" coordinate of a first point of the line.
	 *  @param {number} lineY1 - The "Y" coordinate of a first point of the line.
	 *  @param {number} lineX2 - The "X" coordinate of a second point of the line.
	 *  @param {number} lineY2 - The "Y" coordinate of a second point of the line.
	 *  @param {number} [tolerance=0.001] - The amount of loss of precision we can tolerate to consider a collision.
	 *  @returns {boolean} Returns whether a point is over a line (infinite).
	 *  @todo Think about using a "width" parameter (apart from the "tolerance" parameter).
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
	 * Returns whether a point is over a line segment.
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} segmentX1 - The "X" coordinate of the beginning point of the line.
	 *  @param {number} segmentY1 - The "Y" coordinate of the beginning point of the line.
	 *  @param {number} segmentX2 - The "X" coordinate of the end point of the line.
	 *  @param {number} segmentY2 - The "Y" coordinate of the end point of the line.
	 *  @param {number} [tolerance=0.001] - The amount of loss of precision we can tolerate to consider a collision.
	 *  @returns {boolean} Returns whether a point is over a line segment.
	 *  @todo Think about using a "width" parameter (apart from the "tolerance" parameter).
	 */
	CB_Collisions.isPointOverSegment = function(x, y, segmentX1, segmentY1, segmentX2, segmentY2, tolerance)
	{
		var rectangleX1 = lineX1;
		var rectangleY1 = lineY1;
		var rectangleX2 = lineX2;
		var rectangleY2 = lineY2;

		if (lineX2 < lineX1)
		{
			rectangleX1 = lineX2;
			rectangleX2 = lineX1;
		}
		if (lineY2 < lineY1)
		{
			rectangleY1 = lineY2;
			rectangleY2 = lineY1;
		}

		if (CB_Collisions.isPointOverRectangle(x, y, rectangleX1, rectangleY1, rectangleX2 - rectangleX1 /*rectangleWidth*/, rectangleY2 - rectangleY1 /*rectangleHeight*/))
		{
			return CB_Collisions.isPointOverLine(x, y, lineX1, lineY1, lineX2, lineY2, tolerance);
		}

		return false;
	}


	/**
	 * Returns whether a point is colliding with a rectangle.
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} rectangleX - The "X" coordinate of the upper left corner of the rectangle.
	 *  @param {number} rectangleY - The "Y" coordinate of the upper left corner of the rectangle.
	 *  @param {number} rectangleWidth - The width of the rectangle.
	 *  @param {number} rectangleHeight - The height of the rectangle.
	 *  @returns {boolean} Returns whether a point is colliding with a rectangle.
	 */
	CB_Collisions.isPointOverRectangle = function(x, y, rectangleX, rectangleY, rectangleWidth, rectangleHeight)
	{
		if (x >= rectangleX && x <= rectangleX + rectangleWidth)
		{
			if (y >= rectangleY && y <= rectangleY + rectangleHeight)
			{
				return true;
			}
		}

		return false;
	}


	//Function that returns whether a point is colliding with a circle:
	/**
	 * Returns whether a point is colliding with a circle.
	 *  @function
	 *  @param {number} x - The "X" coordinate of the point.
	 *  @param {number} y - The "Y" coordinate of the point.
	 *  @param {number} centreX - The "X" coordinate of the center of the circle.
	 *  @param {number} centreY - The "Y" coordinate of the center of the circle.
	 *  @param {number} radius - The radius of the circle.
	 *  @returns {boolean} Returns whether a point is colliding with a circle.
	 */
	CB_Collisions.isPointOverCircle = function(x, y, centreX, centreY, radius)
	{
		//If the distance is lower than the radius, there is a collision:
		return (Math.sqrt( Math.pow(centreX - x, 2) + Math.pow(centreY - y, 2) ) < radius);
	}


	//Function that returns whether a line is over another line:
	CB_Collisions.isLineOverLine = function()
	{

	}

	//Function that returns whether a line segment is over another line segment:
	CB_Collisions.isSegmentOverSegment = function()
	{

	}

	//Function that returns whether a rectangle is over another rectangle:
	CB_Collisions.isRectangleOverRectangle = function()
	{

	}


	//Function that returns whether a circle is over another circle:
	CB_Collisions.isCircleOverCircle = function()
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


	//Function that returns whether a rectangle is over a circle:
	CB_Collisions.isRectangleOverCircle = function()
	{

	}


	//Function that returns whether a line is inside another line:
	CB_Collisions.isLineInsideLine = function()
	{

	}


	//Function that returns whether a rectangle is inside another rectangle:
	CB_Collisions.isRectangleInsideRectangle = function()
	{

	}


	//Function that returns whether a circle is inside another circle:
	CB_Collisions.isCircleInsideCircle = function()
	{

	}


	//Function that returns whether a line is inside a line segment:
	CB_Collisions.isLineInsideSegment = function()
	{

	}


	//Function that returns whether a line is inside a rectangle:
	CB_Collisions.isLineInsideRectangle = function()
	{

	}


	//Function that returns whether a line is inside a circle:
	CB_Collisions.isLineInsideCircle = function()
	{

	}


	//Function that returns whether a rectangle is inside a circle:
	CB_Collisions.isRectangleInsideCircle = function()
	{

	}


	//Function that returns whether a line segment is inside a rectangle:
	CB_Collisions.isSegmentInsideRectangle = function()
	{

	}


	//Function that returns whether a line segment is inside a circle:
	CB_Collisions.isSegmentInsideCircle = function()
	{

	}

}