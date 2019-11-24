//Properties:
CB_REM.IMAGES_CACHE_ENABLED = true; //Determines whether to use images cache or not.
CB_REM.BUFFER_RECOMMENDED = true; //Determines whether using buffer is recommended or not. This value will be calculated and changed automatically when the module initializes (as it is only recommended when native canvas is supported or for some emulation methods).
CB_REM.prototype.FPS = 0; //Stores the FPS counter (cleared each second).
CB_REM.prototype._FPS_timeout = null; //Timeout for each call to the 'CB_REM#_FPS_clear' method (which clears the FPS counter).
CB_REM.prototype._onUpdatedFPS = null; //Callback to run when the FPS have been counted (each second).


//Initialization function for the main static properties (it will be called automatically when the module loads):
CB_REM._init = function()
{
	CB_REM.BUFFER_RECOMMENDED = CB_Client.supportsCanvas() || CB_Canvas.bestEmulation() === "DHTML"; //Using buffer is only recommended when native canvas is supported or for some emulation methods (as some emulation methods flicker more or do not work at all with buffer).
	if (CB_REM.DEBUG_MESSAGES) { CB_console("RENDERING_ENGINE_MODULE recommends using buffer: " + (CB_REM.BUFFER_RECOMMENDED ? "Yes" : "No")); }
}


//Initialization function for the main instance properties (it will be called automatically by the constructor):
CB_REM.prototype._init = function()
{
	return this;
}


//Stops counting the FPS:
CB_REM.prototype.stopFPSCounter = function()
{
	clearTimeout(this._FPS_timeout);
}


//Clears the FPS (Frames Per Second) counter (called automatically):
CB_REM.prototype.startFPSCounter = function()
{
	clearTimeout(this._FPS_timeout);
	if (typeof(this._onUpdatedFPS) === "function") { this._onUpdatedFPS.call(this, this.FPS); }
	this.FPS = 0;
	var that = this;
	this._FPS_timeout = setTimeout(function() { that.startFPSCounter.call(that); }, 1000);
}


//Sets a callback to run when FPS is refreshed (before clearing it):
CB_REM.prototype.onUpdatedFPS = function(callback)
{
	this._onUpdatedFPS = callback;
}


//Stores an image in the internal cache:
CB_REM._IMAGES_CACHE = {}; //It will keep the images cached (read-only).
CB_REM.prototype.cacheImage = function(element, reload, onLoad)
{
	//If we do not want to reload and the image is already in the internal cache, calls the 'onLoad' function (if any) and exits:
	if (!reload && CB_REM._IMAGES_CACHE[element.src]) { if (typeof(onLoad) === "function") { onLoad(element, image); } return; }
	
	//Creates and loads the image from the element (sprite or sub-sprite):
	var image = new Image();
	image.onload = function()
	{
		//Loads the image in the internal cache:
		CB_REM._IMAGES_CACHE[element.src] = image;
		
		//Calls the 'onLoad' function (if any):
		if (typeof(onLoad) === "function") { onLoad(element, image); }
	};
	image.src = element.src;
}


//Stores the needed images in the internal cache (performance purposes):
CB_REM.prototype._cacheImages_timeout = null; //Keeps internal timeout for 'CB_REM#cacheImages' (read-only).
CB_REM.prototype.cacheImages = function(CB_GraphicSpritesSceneObject, reload, onLoad)
{
	clearTimeout(this._cacheImages_timeout);
	
	var imagesNeeded = 0;
	var imagesLoaded = 0;
	var imageOnLoad = function(element, image) { imagesLoaded++; };
	
	//Loops each 'CB_GraphicSprites' object in the 'CB_GraphicSpritesScene' object:
	var that = this;
	CB_GraphicSpritesSceneObject.forEach //Same as 'CB_GraphicSpritesSceneObject.forEachGraphicSprites', 'CB_GraphicSpritesSceneObject.executeAll' and 'CB_GraphicSpritesSceneObject.executeFunctionAll'.
	(
		function(graphicSprites, position, graphicSpritesArray, delay) //functionEach.
		{
			//Loops each sprite:
			graphicSprites.forEach
			(
				function(sprite, position, graphicSpritesArray, delay) //functionEach.
				{
					if (sprite.srcType === CB_GraphicSprites.SRC_TYPES.IMAGE)
					{
						that.cacheImage(sprite, reload, imageOnLoad);
						imagesNeeded++;
					}
					
					//Loops each sub-sprite:
					sprite.forEach
					(
						function(subSprite, position, graphicSpritesArray, delay) //functionEach.
						{
							if (subSprite.srcType === CB_GraphicSprites.SRC_TYPES.IMAGE)
							{
								that.cacheImage(subSprite, reload, imageOnLoad);
								imagesNeeded++;
							}
						}
					);
				}
			)
		},
		true //Loops using z-index order (ascending order).
	);

	//Starts checking the number of loaded images and calls 'onLoad' when finishes:
	var checkImagesLoaded = function()
	{
		if (imagesLoaded >= imagesNeeded) { if (typeof(onLoad) === "function") { onLoad(imagesLoaded); } return; } //Calls 'onLoad' and finishes.
		else { this._cacheImages_timeout = setTimeout(checkImagesLoaded, 1); } //Continues checking.
	};
	checkImagesLoaded();
}


//Processes the sprites groups (a 'CB_GraphicSprites' object):
CB_REM.prototype.renderGraphicScene_lastCB_GraphicSpritesSceneObject = null; //Keeps the last given "CB_GraphicSpritesSceneObject" when the 'renderGraphicScene' method was called the last time (it could be modified internally).
CB_REM.prototype.renderGraphicScene_lastData = null; //Keeps the last given "data" when the 'renderGraphicScene' method was called the last time (it could be modified internally).
CB_REM.prototype.renderGraphicScene = function(CB_GraphicSpritesSceneObject, data, useBuffer, alternateBuffer)
{
	//If we do not use buffer or we want to use buffer but alternating between canvas (their visibility):
	if (!useBuffer || useBuffer && alternateBuffer && data.CB_CanvasObject.isBuffer === true)
	{
		data.CB_CanvasObject.isBuffer = false;
		data.CB_CanvasObjectBuffer.isBuffer = true;
		
		var CB_CanvasObjectBackup = data.CB_CanvasObject;
		data.CB_CanvasObject = data.CB_CanvasObjectBuffer;
		data.CB_CanvasObjectBuffer = CB_CanvasObjectBackup;
		
		var CB_CanvasObjectContextBackup = data.CB_CanvasObjectContext;
		data.CB_CanvasObjectContext = data.CB_CanvasObjectBufferContext;
		data.CB_CanvasObjectBufferContext = CB_CanvasObjectContextBackup;
	}
	else
	{
		data.CB_CanvasObject.isBuffer = true;
		data.CB_CanvasObjectBuffer.isBuffer = false;
	}
	
	//Saves the context (reduces flickering):
	data.CB_CanvasObjectBufferContext.save();

	//Sets the text baseline at top:
	data.CB_CanvasObjectBufferContext.textBaseline = "top"; //Needed for clearing previous text.

	//Clears the canvas:
	data.CB_CanvasObjectBuffer.clear(false);

	//Perform an action (execute a function) for each 'CB_GraphicSprites' object (being able to introduce a delay between each call):
	var that = this;
	CB_GraphicSpritesSceneObject.forEach //Same as 'CB_GraphicSpritesSceneObject.forEachGraphicSprites', 'CB_GraphicSpritesSceneObject.executeAll' and 'CB_GraphicSpritesSceneObject.executeFunctionAll'.
	(
		function(graphicSprites, position, graphicSpritesArray, delay) //functionEach.
		{
			that.drawGraphicSpritesObject(this, data.CB_CanvasObjectBufferContext, data.CB_CanvasObjectContext, useBuffer, CB_GraphicSpritesSceneObject);
		},
		true //Loops using z-index order (ascending order).
	);

	//Restores the context (reduces flickering):
	data.CB_CanvasObjectBufferContext.restore();
	
	//If we are using buffer, shows the buffer and hides the other:
	if (useBuffer)
	{
		//If we do not want to alternate between canvas (their visibility):
		if (!alternateBuffer)
		{
			//Copies the content from the canvas buffer to the displaying one:
			data.CB_CanvasObjectContext.save();
			data.CB_CanvasObject.clear(false);
			data.CB_CanvasObjectContext.drawImage(data.CB_CanvasObjectBuffer.get(), 0, 0);
			data.CB_CanvasObjectContext.restore();
		}
		//...otherwise, if we want to alternate between canvas (their visibility):
		else
		{
			//Shows the canvas buffer and hides the other one:
			CB_Elements.show
			(
				data.CB_CanvasObjectBuffer.get(), //element.
				"block", //displayValue.
				false, //checkValues.
				false, //computed.
				//As soon as it is shown, hides the other canvas:
				function(element) //onShow.
				{
					CB_Elements.hide
					(
						data.CB_CanvasObject.get(), //element.
						false, //checkValues.
						false, //computed.
						//As soon as it is hidden, gets its content copied from the showing canvas:
						function(element) //onHide.
						{
							data.CB_CanvasObjectContext.save();
							//data.CB_CanvasObjectContext.textBaseline = "top"; //Needed for clearing previous text.
							data.CB_CanvasObject.clear(true);
							data.CB_CanvasObjectContext.drawImage(data.CB_CanvasObjectBuffer.get(), 0, 0);
							data.CB_CanvasObjectContext.restore();
						}
					);
				}
			);
		}
	}
	
	this.FPS++; //Increments FPS counter (erased each second).
	
	//Saves the last parameters used (they could have been modified from the given ones):
	this.renderGraphicScene_lastCB_GraphicSpritesSceneObject = CB_GraphicSpritesSceneObject;
	this.renderGraphicScene_lastData = data;
}


//Advances to the next sprite until the current one is pointed and returns it:
CB_REM.prototype.getCurrentSprite = function(CB_GraphicSpritesObject, returnValueOnFail, canvasContext, drawingMap)
{
	if (!CB_GraphicSpritesObject) { return returnValueOnFail; }
	
	var sprite = sprite = CB_GraphicSpritesObject.getCurrent(); //Gets the current sprite (the one indicated by the pointer).
	
	if (!sprite) { return returnValueOnFail; }
	
	if (sprite._timeDisappeared && sprite.data.timeResetAndEnableAfter !== null && sprite._timeDisappeared + sprite.data.timeResetAndEnableAfter < CB_Device.getTiming()) { sprite.setDisabled(false); sprite.setTime(); sprite._timeDisappeared = null; } //Resets the time property.
	if (!sprite._timeDisappeared && sprite.data.duration !== null && sprite.getTimeElapsed() > sprite.data.duration) { sprite.setDisabled(true); sprite._timeDisappeared = CB_Device.getTiming(); this.clearElementSpace(sprite, canvasContext); } //Disables the sprite and clears it from the canvas..
	
	var spritesLength = CB_GraphicSpritesObject.getSprites(false, []).length;
	if (spritesLength > 0)
	{
		var pointerCurrent = CB_GraphicSpritesObject.getPointer();
		var pointerNext = typeof(sprite.data.pointerNext) === "function" ? sprite.data.pointerNext.call(sprite, sprite) : !isNaN(sprite.data.pointerNext) ? parseInt(sprite.data.pointerNext) : pointerCurrent + 1;
		if (sprite.data.loop) { pointerNext %= spritesLength; }
		else if (pointerNext >= spritesLength) { pointerNext = spritesLength - 1; }
		var pointersChecked = [];
		while (spritesLength > 0 && pointerNext !== pointerCurrent && (sprite === null || sprite.isDisabled() || sprite.data.skipAfter !== null && sprite.getTimeElapsed() > sprite.data.skipAfter || sprite.data.duration !== null && sprite.getTimeElapsed() > sprite.data.duration || !drawingMap && sprite.data.onlyUseInMap))
		{
			pointersChecked[pointersChecked.length] = pointerNext;
			sprite = CB_GraphicSpritesObject.get(pointerNext, null);
			if (sprite._timeDisappeared && sprite.data.timeResetAndEnableAfter !== null && sprite._timeDisappeared + sprite.data.timeResetAndEnableAfter < CB_Device.getTiming()) { sprite.setDisabled(false); sprite.setTime(); sprite._timeDisappeared = null; } //Resets the time property.
			if (!sprite._timeDisappeared && sprite.data.duration !== null && sprite.getTimeElapsed() > sprite.data.duration) { sprite.setDisabled(true); sprite._timeDisappeared = CB_Device.getTiming(); } //Disables the sprite.
			if (typeof(sprite.data.pointerNext) === "function") { pointerNext = sprite.data.pointerNext.call(sprite, sprite, canvasContext, CB_GraphicSpritesObject, drawingMap); }
			else if (!isNaN(sprite.data.pointerNext)) { pointerNext = parseInt(sprite.data.pointerNext); }
			else { pointerNext++; }
			if (sprite.data.loop) { pointerNext %= spritesLength; }
			else if (pointerNext >= spritesLength) { break; }
			if (CB_Arrays.indexOf(pointersChecked, pointerNext) !== -1) { break; } //Prevents dead loops.
		}
		
		if (sprite !== null && sprite.position !== pointerCurrent)
		{
			CB_GraphicSpritesObject.setPointer(sprite.position);
			sprite._clearPreviousFirstPerformed = false;
		}
	}
	return sprite || returnValueOnFail;
}


//Draws the current sprite of a 'CB_GraphicSprites' object:
CB_REM.prototype.drawGraphicSpritesObject = function(CB_GraphicSpritesObject, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, attributesSpritesGroup, attributesSprite, attributesSubSprites, usingRelativePosition, onDrawSprite, onDrawSubSprite)
{
	if (!CB_GraphicSpritesObject) { return false; }

	if (attributesSpritesGroup) { CB_GraphicSpritesObject.spritesGroup = CB_combineArraysOrObjects(CB_GraphicSpritesObject.spritesGroup, attributesSpritesGroup, false, true); }
	
	var sprite = this.getCurrentSprite(CB_GraphicSpritesObject, null, canvasContext, drawingMap); //Gets the current sprite (advancing/looping the pointer if needed).
	
	//Draws the current sprite:
	return this.drawSprite(sprite, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, undefined, attributesSprite, attributesSubSprites, usingRelativePosition, onDrawSprite, onDrawSubSprite);
}


//Draws a sprite:
CB_REM.prototype.drawSprite = function(sprite, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, attributesSpritesGroup, attributesSprite, attributesSubSprites, usingRelativePosition, onDrawSprite, onDrawSubSprite)
{
	if (sprite === null) { return false; }
	
	if (sprite.time === 0) { sprite.setTime(); } //If not set, sets the current time in the "time" property.
	
	if (!sprite._timeDisappeared && sprite.data.duration !== null && sprite.getTimeElapsed() > sprite.data.duration)
	{
		this.clearElementSpace(sprite, canvasContext);
		return false;
	} 

	if (attributesSpritesGroup) { sprite.parent = CB_combineArraysOrObjects(sprite.parent, attributesSpritesGroup, false, true); }
	if (attributesSprite) { sprite = CB_combineArraysOrObjects(sprite, attributesSprite, false, true); }

	//Draws the sprite:
	var drawnSprite = this.drawElement(sprite, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, onDrawSprite);
	
	var calculateAttributesSubSprites = false;
	if (drawingMap && typeof(attributesSubSprites) !== "object" || attributesSubSprites === null) { calculateAttributesSubSprites = true; }
	
	if (usingRelativePosition) { sprite._usingRelativePosition = true; }
	
	//If it has sub-sprites, loops through them and draws them:
	if (sprite.subSprites && sprite.subSprites.length)
	{
		var that = this;
		sprite.forEach //Same as 'sprite.executeAll' and 'sprite.executeFunctionAll'.
		(
			function(subSprite, position, graphicSpritesArray, delay)
			{
				if (calculateAttributesSubSprites)
				{
					attributesSubSprites = {};

					if (!isNaN(sprite.width) && !isNaN(subSprite._widthOriginal && !isNaN(sprite._widthOriginal)) && sprite._widthOriginal > 0)
					{
						attributesSubSprites.width = subSprite._widthOriginal / sprite._widthOriginal * sprite.width;
					}
					else { attributesSubSprites.width = subSprite.width; }
					
					if (!isNaN(sprite.height) && !isNaN(subSprite._heightOriginal && !isNaN(sprite._heightOriginal)) && sprite._heightOriginal > 0)
					{
						attributesSubSprites.height = subSprite._heightOriginal / sprite._heightOriginal * sprite.height;
					}
					else { attributesSubSprites.height = subSprite.height; }
					
					if (!isNaN(subSprite._leftOriginal) && !isNaN(sprite._leftOriginal) && !isNaN(sprite.width) && !isNaN(sprite._widthOriginal) && sprite._widthOriginal > 0)
					{
						attributesSubSprites.left = (subSprite._leftOriginal - sprite._leftOriginal) * (sprite.width / sprite._widthOriginal);
					}
					else { attributesSubSprites.left = subSprite.left; }

					if (!isNaN(subSprite._topOriginal) && !isNaN(sprite._topOriginal) && !isNaN(sprite.height) && !isNaN(sprite._heightOriginal) && sprite._heightOriginal > 0)
					{
						attributesSubSprites.top = (subSprite._topOriginal - sprite._topOriginal) * (sprite.height / sprite._heightOriginal);
					}
					else { attributesSubSprites.top = subSprite.top; }
					
					attributesSubSprites.width = parseInt(attributesSubSprites.width);
					attributesSubSprites.height = parseInt(attributesSubSprites.height);
					attributesSubSprites.left = parseInt(attributesSubSprites.left);
					attributesSubSprites.top = parseInt(attributesSubSprites.top);
				}
				
				that.drawSubSprite(this, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, undefined, undefined, attributesSubSprites, calculateAttributesSubSprites ? false : usingRelativePosition, onDrawSubSprite); //Draws the sub-sprite.
			},
			true //Loops using z-index order (ascending order).
		);
	}
	
	return drawnSprite;
}


//Draws a sub-sprite:
CB_REM.prototype.drawSubSprite = function(subSprite, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, attributesSpritesGroup, attributesSprite, attributesSubSprites, usingRelativePosition, onDrawSubSprite)
{
	if (subSprite === null) { return; }
	
	if (subSprite.time === 0) { subSprite.setTime(); } //If not set, sets the current time in the "time" property.
	
	if (subSprite._timeDisappeared && subSprite.data.timeResetAndEnableAfter !== null && subSprite._timeDisappeared + subSprite.data.timeResetAndEnableAfter < CB_Device.getTiming())
	{
		subSprite.setDisabled(false);
		subSprite.setTime(); //Resets the time property of the sub-sprite object.
		subSprite._timeDisappeared = null;
	}

	//If the sub-sprite is disabled, exits:
	if (subSprite.isDisabled()) { return; }
	
	//The "duration" for sub-sprites indicates when the sub-sprite must be disabled:
	if (!subSprite._timeDisappeared && subSprite.data.duration !== null && subSprite.getTimeElapsed() > subSprite.data.duration)
	{
		//Disables the sub-sprite and exits:
		subSprite.setDisabled(true);
		subSprite._timeDisappeared = CB_Device.getTiming();
		this.clearElementSpace(subSprite, canvasContext);
		return;
	}

	if (attributesSpritesGroup) { subSprite.parent.parent = CB_combineArraysOrObjects(subSprite.parent.parent, attributesSpritesGroup, false, true); }
	if (attributesSprite) { subSprite.parent = CB_combineArraysOrObjects(subSprite.parent, attributesSprite, false, true); }	
	if (attributesSubSprites) { subSprite = CB_combineArraysOrObjects(subSprite, attributesSubSprites, false, true); }

	if (usingRelativePosition) { subSprite._usingRelativePosition = true; }

	//Draws the sub-sprite:
	return this.drawElement(subSprite, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, onDrawSubSprite);
}


//Clears a desired part:
CB_REM.prototype.clearElementSpace = function(element, canvasContext)
{
	if (typeof(element) === "undefined" || element === null) { return; }
	
	//If the element is an image:
	if (element.srcType === CB_GraphicSprites.SRC_TYPES.IMAGE) { canvasContext.clearRect(element._leftRelative, element._topRelative, element.width, element.height); }
	//...otherwise, if it is text:
	else if (element.srcType === CB_GraphicSprites.SRC_TYPES.TEXT)
	{
		var lineHeight = parseFloat(element.data.fontSize) || element.height;
		var textLines = (element.src + "").split("\n");
		var textTop = null;
		for (var x = 0; x < textLines.length; x++)
		{
			textTop = element._topRelative + x * lineHeight;
			canvasContext.clearRect(element._leftRelative, textTop, parseFloat(canvasContext.measureText(textLines[x]).width) || element.width, lineHeight);
		}
	}
}


//Clears a previous element:
CB_REM.prototype.clearPreviousElement = function(element, canvasContext, useBuffer)
{
	if (useBuffer) { return; } //There is no need to clean previous things if we are using buffer.
	if (typeof(element) === "undefined" || element === null) { return; }
	else if (element._clearPreviousFirstPerformed) { return; }
	this.clearElementSpace(typeof(element.getPrevious) === "function" ? element.getPrevious() : element, canvasContext);
	element._clearPreviousFirstPerformed = true;
}


//Function to call when the element has been drawn (internal usage):
CB_REM._elementDrawn = function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement, onDrawn, avoidAfterDrawing)
{
	//If there is a 'onDrawn' callback set, calls it:
	if (typeof(onDrawn) === "function") { onDrawn.call(element, element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement, onDrawn); }

	//If set, calls the 'afterDrawing' callback:
	if (!avoidAfterDrawing && element && element.data && typeof(element.data.afterDrawing) === "function")
	{
		element.data.afterDrawing.call(element, element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement, onDrawn);
	}
};


//Draws an element (sprite or sub-sprite):
CB_REM._ELEMENT_ATTRIBUTES_EMPTY = { left: 0, top: 0, width: 0, height: 0 }; //Empty element attributes, used to clean them (internal usage).
CB_REM.prototype.drawElement_currentMap = null; //It will store a two-dimensional array representing map being drawn or the last one drawn, with the elements.
CB_REM.prototype._onDrawMapElement = null; //It will store the 'onDrawn' callback for each map element (internal usage).
CB_REM.prototype.drawElement = function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, onDrawn, avoidAfterDrawing)
{
	if (!element || typeof(element.isDisabled) !== "function" || element.isDisabled() || !element.data || element.data.hidden) { return false; }
	
	//If not desired, it will not be drawn:
	if (!drawingMap && element.data.onlyUseInMap) { return false; }

	//If desired, clears the space it will use before drawing it:
	if (element.data.clearPreviousFirst) { this.clearPreviousElement(element, canvasContext, useBuffer); }

	//Gets the desired style (can be a function):
	var style = typeof(element.data.style) === "function" ? element.data.style.call(element, element, canvasContext, canvasBufferContext, useBuffer) : element.data.style;
	
	//Applies the desired options:
	canvasContext.globalCompositeOperation = element.data.globalCompositeOperation || "source-over";
	canvasContext.globalAlpha = !isNaN(parseFloat(element.data.opacity)) ? parseFloat(element.data.opacity) : 1;

	//Calculates and sets left and top position relative to the parent element(s):
	element._leftRelative = element.left;
	element._topRelative = element.top;
	if (!element._usingRelativePosition && !element.data.positionAbsolute)
	{
		var parentLoop = element;
		while (parentLoop = parentLoop.parent)
		{
			if (parentLoop.left) { element._leftRelative += parentLoop.left; }
			if (parentLoop.top) { element._topRelative += parentLoop.top; }
		}
	}

	//If set, calls the 'beforeDrawing' callback (unless we are drawing a map as map elements will use this callback in their loop):
	//if (!drawingMap && typeof(element.data.beforeDrawing) === "function")
	if (typeof(element.data.beforeDrawing) === "function")
	{
		element = element.data.beforeDrawing.call(element, element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap);
		if (!element || typeof(element.isDisabled) !== "function" || element.isDisabled()) { return false; }
	}

	//If we want to rotate the element, proceeds:
	var rotated = false;
	if (element.data.rotation)
	{
		canvasContext.save();
		
		var translationX = null;
		if (!isNaN(parseFloat(element.data.rotationX))) { translationX = parseFloat(element.data.rotationX); }
		else { translationX = element._leftRelative + element.width / 2; element._leftRelative = element.width / 2 * -1; }
		var translationY = null;
		if (!isNaN(parseFloat(element.data.rotationY))) { translationY = parseFloat(element.data.rotationY); }
		else { translationY = element._topRelative + element.height / 2; element._topRelative = element.height / 2 * -1; }
		
		canvasContext.translate(translationX, translationY);
		canvasContext.rotate(element.data.rotationUseDegrees && element.data.rotation !== 0 ? element.data.rotation * Math.PI / 180 : element.data.rotation);
		
		rotated = true;
	}

	//If the element is an image:
	var drawn = true; //Defines whether the element was finally drawn or not.
	switch (element.srcType)
	{
		//Image:
		case CB_GraphicSprites.SRC_TYPES.IMAGE:
			if (!element.src) { return false; } //Exists if there is no source.
			var image = CB_REM._IMAGES_CACHE[element.src];
			if (CB_REM.IMAGES_CACHE_ENABLED && image)
			{
				this.drawImage(image, element.srcLeft, element.srcTop, element.srcWidth, element.srcHeight, element._leftRelative, element._topRelative, element.width, element.height, canvasContext, null);
			}
			else
			{
				image = new Image();
				image.onload = function()
				{
					this.drawImage(image, element.srcLeft, element.srcTop, element.srcWidth, element.srcHeight, element._leftRelative, element._topRelative, element.width, element.height, canvasContext, null);
					
					//If we are not drawing a map (as map elements will manage callbacks in their loop):
					if (!drawingMap)
					{
						//If there is an 'onDrawn' callback set, calls it:
						if (typeof(onDrawn) === "function") { onDrawn.call(element, element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, false); }
					
						//If set, calls the 'afterDrawing' callback:
						if (typeof(element.data.afterDrawing) === "function")
						{
							element.data.afterDrawing.call(element, element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, false);
						}
					}
				};
				image.src = element.src;
				CB_REM._IMAGES_CACHE[element.src] = image;
				drawn = false;
			}
			break;
		//Text:
		case CB_GraphicSprites.SRC_TYPES.TEXT:
			if (!CB_isString(element.src) && isNaN(element.src) || element.src === null) { return; } //Exists if there is no source (but allows 0 value).
			canvasContext.font = 
							(element.data.fontStyle ? element.data.fontStyle + " " : "") + (element.data.fontVariant ? element.data.fontVariant + " " : "") + (element.data.fontWeight ? element.data.fontWeight + " " : "") +
							(element.data.fontSize ? element.data.fontSize + " " : "") +  (element.data.fontFamily ? element.data.fontFamily + " " : "") + (element.data.caption ? element.data.caption + " " : "") +
							(element.data.icon ? element.data.icon + " " : "") + (element.data.menu ? element.data.menu + " " : "") + (element.data.messageBox ? element.data.messageBox + " " : "") +
							(element.data.smallCaption ? element.data.smallCaption + " " : "") + (element.data.statusBar ? element.data.statusBar + " " : "");
			var lineHeight = parseFloat(element.data.fontSize) || element.height;
			var textLines = (element.src + "").split("\n");
			var textTop = null;

			if (element.data.stroke)
			{
				canvasContext.lineWidth = element.data.lineWidth || 1;
				canvasContext.strokeStyle = style;
				for (var x = 0; x < textLines.length; x++)
				{
					textTop = element._topRelative + x * lineHeight;
					canvasContext.strokeText(textLines[x], element._leftRelative, textTop);
				}
			}
			else
			{
				canvasContext.fillStyle = style;
				for (var x = 0; x < textLines.length; x++)
				{
					textTop = element._topRelative + x * lineHeight;
					canvasContext.fillText(textLines[x], element._leftRelative, textTop);
				}
			}
			break;
		//Segment (finite line):
		case CB_GraphicSprites.SRC_TYPES.SEGMENT:
			canvasContext.lineWidth = element.data.lineWidth || element.width || 1;
			canvasContext.strokeStyle = style;
			canvasContext.beginPath();
			canvasContext.moveTo(element._leftRelative + element.data.x1, element._topRelative + element.data.y1);
			canvasContext.lineTo(element._leftRelative + element.data.x2, element._topRelative + element.data.y2);
			canvasContext.closePath();
			canvasContext.stroke(); 
			break;
		//Pixel (1x1 rectangle):
		case CB_GraphicSprites.SRC_TYPES.PIXEL:
			canvasContext.fillStyle = style;
			canvasContext.fillRect(element._leftRelative, element._topRelative, 1, 1);
			break;
		//Rectangle:
		case CB_GraphicSprites.SRC_TYPES.RECTANGLE:
			if (element.data.stroke)
			{
				canvasContext.lineWidth = element.data.lineWidth || 1;
				canvasContext.strokeStyle = style;
				canvasContext.strokeRect(element._leftRelative, element._topRelative, element.width, element.height);
			}
			else
			{
				canvasContext.fillStyle = style;
				canvasContext.fillRect(element._leftRelative, element._topRelative, element.width, element.height);
			}
			break;
		//Circle:
		case CB_GraphicSprites.SRC_TYPES.CIRCLE:
			if (element.data.stroke)
			{
				canvasContext.lineWidth = element.data.lineWidth || 1;
				canvasContext.strokeStyle = style;
				canvasContext.beginPath();
				canvasContext.arc(element._leftRelative, element._topRelative, element.data.radius, 0, Math.PI * 2, true);
				canvasContext.closePath();
				canvasContext.stroke();
			}
			else
			{
				canvasContext.fillStyle = style;
				canvasContext.beginPath();
				canvasContext.arc(element._leftRelative, element._topRelative, element.data.radius, 0, Math.PI * 2, true);
				canvasContext.closePath();
				canvasContext.fill();
			}
			break;
		//Arc:
		case CB_GraphicSprites.SRC_TYPES.ARC:
			if (element.data.stroke)
			{
				canvasContext.lineWidth = element.data.lineWidth || 1;
				canvasContext.strokeStyle = style;
				canvasContext.beginPath();
				canvasContext.arc(element._leftRelative, element._topRelative, element.data.radius, element.data.startAngle, element.data.endAngle, true);
				canvasContext.closePath();
				canvasContext.stroke();
			}
			else
			{
				canvasContext.fillStyle = style;
				canvasContext.beginPath();
				canvasContext.arc(element._leftRelative, element._topRelative, element.data.radius, element.data.startAngle, element.data.endAngle, true);
				canvasContext.closePath();
				canvasContext.fill();
			}
			break;
		//Ellipse:
		case CB_GraphicSprites.SRC_TYPES.ELLIPSE:
			if (element.data.stroke)
			{
				canvasContext.lineWidth = element.data.lineWidth || 1;
				canvasContext.strokeStyle = style;
				canvasContext.beginPath();
				canvasContext.ellipse(element._leftRelative, element._topRelative, element.data.radiusX, element.data.radiusY, element.data.ellipseRotation || 0, element.data.startAngle, element.data.endAngle, element.data.anticlockwise);
				canvasContext.closePath();
				canvasContext.stroke();
			}
			else
			{
				canvasContext.fillStyle = style;
				canvasContext.beginPath();
				canvasContext.ellipse(element._leftRelative, element._topRelative, element.data.radiusX, element.data.radiusY, element.data.ellipseRotation || 0, element.data.startAngle, element.data.endAngle, element.data.anticlockwise);
				canvasContext.closePath();
				canvasContext.fill();
			}
			break;
		//Triangle:
		case CB_GraphicSprites.SRC_TYPES.TRIANGLE:
			if (element.data.stroke)
			{
				canvasContext.lineWidth = element.data.lineWidth || 1;
				canvasContext.strokeStyle = style;
				canvasContext.beginPath();
				canvasContext.moveTo(element._leftRelative, element._topRelative);
				canvasContext.lineTo(element._leftRelative + element.data.x1, element._topRelative + element.data.y1);
				canvasContext.lineTo(element._leftRelative + element.data.x2, element._topRelative + element.data.y2);
				canvasContext.closePath();
				canvasContext.stroke();
			}
			else
			{
				canvasContext.fillStyle = style;
				canvasContext.beginPath();
				canvasContext.moveTo(element._leftRelative, element._topRelative);
				canvasContext.lineTo(element._leftRelative + element.data.x1, element._topRelative + element.data.y1);
				canvasContext.lineTo(element._leftRelative + element.data.x2, element._topRelative + element.data.y2);
				canvasContext.closePath();
				canvasContext.fill();
			}
			break;
		//Bezier curve:
		case CB_GraphicSprites.SRC_TYPES.BEZIER_CURVE:
			canvasContext.lineWidth = element.data.lineWidth || element.width || 1;
			canvasContext.strokeStyle = style;
			canvasContext.beginPath();
			canvasContext.moveTo(element._leftRelative, element._topRelative);
			canvasContext.bezierCurveTo(element._leftRelative + element.data.x1, element._topRelative + element.data.y1, element._leftRelative + element.data.x2, element._topRelative + element.data.y2, element._leftRelative + element.data.x3, element._topRelative + element.data.y3);
			canvasContext.stroke(); 
			break;
		//Quadratic Bezier curve:
		case CB_GraphicSprites.SRC_TYPES.QUADRATIC_BEZIER_CURVE:
			canvasContext.lineWidth = element.data.lineWidth || element.width || 1;
			canvasContext.strokeStyle = style;
			canvasContext.beginPath();
			canvasContext.moveTo(element._leftRelative, element._topRelative);
			canvasContext.quadraticCurveTo(element._leftRelative + element.data.x1, element._topRelative + element.data.y1, element._leftRelative + element.data.x2, element._topRelative + element.data.y2);
			canvasContext.stroke(); 
			break;
		//Map (bitmap, image map, etc.):
		case CB_GraphicSprites.SRC_TYPES.MAP:
			if (element.src.length && element.data.elementsData && CB_GraphicSpritesSceneObject)
			{
				//If there is still not cache for this map, creates it:
				if (typeof(CB_REM._MAP_ELEMENTS_CACHE[element.id]) === "undefined" || CB_REM._MAP_ELEMENTS_CACHE[element.id] === null)
				{
					CB_REM._createCacheMapElement(element.id, CB_GraphicSpritesSceneObject);
				}
				
				var CB_GraphicSpritesSceneObjectCopy = CB_REM._MAP_ELEMENTS_CACHE[element.id].CB_GraphicSpritesSceneObject;
				
				var elementLoopData = null;
				var elementIndexOrId = null;
				var elementLoop = null;
				var elementsWidthDefault = element.width / element.src.length;
				var elementsHeightDefault = element.height / element.src.length;
				var elementLoopLeftNext = null;
				var elementLoopTopNext = null;
				this.drawElement_currentMap = [];
				var lastElementX = -1;
				var lastElementY = -1;
				for (var y = 0; y < element.src.length; y++)
				{
					this.drawElement_currentMap[lastElementY + 1] = [];
					for (var x = 0; x < element.src[y].length; x++)
					{
						if (!element.src[y][x]) { continue; }
						elementLoopData = element.data.elementsData[element.src[y][x]] || null;
						if (elementLoopData === null) { continue; }
						
						//Sets any missing property to the element's data:
						//TODO: copy more properties.
						if (elementLoopData.renewCache !== true && elementLoopData.renewCache !== false) { elementLoopData.renewCache = element.data.renewCache; }
						
						elementIndexOrId = elementLoopData.id || (!isNaN(parseInt(elementLoopData.index)) ? parseInt(elementLoopData.index) : null);
						if (elementIndexOrId === null) { continue; }

						//Tries to get the map element:
						elementLoop = CB_REM._getMapElement(elementIndexOrId, elementLoopData, element, CB_GraphicSpritesSceneObjectCopy, x, y, elementsWidthDefault, elementsHeightDefault);
						
						if (elementLoop === null) { continue; }
						
						//Calculates the width, height, left and top attributes:
						elementLoop._attributes = elementLoop._attributes || {};
						elementLoop._attributes.width = elementLoop.width;
						elementLoop._attributes.height = elementLoop.height;
						elementLoop._attributes.left =
							element._leftRelative +
							(
								typeof(element.data.elementsLeft) === "function" ? element.data.elementsLeft(element.src[y][x], elementLoop, elementLoopData, element, elementLoopLeftNext, x, y) :
								!isNaN(parseFloat(element.data.elementsLeft)) ? parseFloat(element.data.elementsLeft) :
								typeof(elementLoopData.left) === "function" ? elementLoopData.left(element.src[y][x], elementLoop, elementLoopData, element, elementLoopLeftNext, x, y) :
								(
									!isNaN(parseFloat(elementLoopData.left)) ? parseFloat(elementLoopData.left) :
									elementLoopData.leftDependsOnPreviousElement ? elementLoopLeftNext || 0 :
									x * elementLoop.width
								)
							);
						elementLoopLeftNext = elementLoop._attributes.left - element._leftRelative + elementLoop.width;

						elementLoop._attributes.top =
							element._topRelative +
							(
								typeof(element.data.elementsTop) === "function" ? element.data.elementsTop(element.src[y][x], elementLoop, elementLoopData, element, elementLoopTopNext, x, y) :
								!isNaN(parseFloat(element.data.elementsTop)) ? parseFloat(element.data.elementsTop) :
								typeof(elementLoopData.top) === "function" ? elementLoopData.top(element.src[y][x], elementLoop, elementLoopData, element, elementLoopTopNext, x, y) :
								(
									!isNaN(parseFloat(elementLoopData.top)) ? parseFloat(elementLoopData.top) :
									elementLoopData.topDependsOnPreviousElement ? elementLoopTopNext || 0 :
									elementLoopData.topDependsOnUpperElement ?
									(
										(
										lastElementY === -1 && lastElementX !== -1 && typeof(this.drawElement_currentMap[0][lastElementX]) !== "undefined" && this.drawElement_currentMap[0][lastElementX] !== null ? this.drawElement_currentMap[0][lastElementX]._attributes.top + this.drawElement_currentMap[0][lastElementX]._attributes.height || 0 :
										lastElementY !== -1 && typeof(this.drawElement_currentMap[lastElementY][lastElementX + 1]) !== "undefined" && this.drawElement_currentMap[lastElementY][lastElementX + 1] !== null ? this.drawElement_currentMap[lastElementY][lastElementX + 1]._attributes.top + this.drawElement_currentMap[lastElementY][lastElementX + 1]._attributes.height || 0 :
										0) - element._topRelative
									) : y * elementLoop.height
								)
							);

						//If set, calls the 'beforeDrawing' callback:
						if (elementLoop.data && typeof(elementLoop.data.beforeDrawing) === "function")
						{
							elementLoop = elementLoop.data.beforeDrawing.call(elementLoop, elementLoop, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, true, x, y, element);
							if (!elementLoop || typeof(elementLoop.isDisabled) !== "function" || elementLoop.isDisabled()) { continue; }
						}

						this._onDrawMapElement = function() { CB_REM._elementDrawn(elementLoop, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, true, x, y, element, undefined, true); }

						//Draws the element:
						if (elementLoop.isSprites) //The element is a 'CB_GraphicSprites' object.
						{
							this.drawGraphicSpritesObject(elementLoop, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObjectCopy, true, CB_REM._ELEMENT_ATTRIBUTES_EMPTY, elementLoop._attributes, undefined, elementLoopData.leftDependsOnPreviousElement, this._onDrawMapElement);
						}
						else if (elementLoop.isSprite) //The element is a sprite ('CB_GraphicSprites.SPRITE_OBJECT' object).
						{
							this.drawSprite(elementLoop, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObjectCopy, true, CB_REM._ELEMENT_ATTRIBUTES_EMPTY, elementLoop._attributes, undefined, elementLoopData.leftDependsOnPreviousElement, this._onDrawMapElement);
						}
						else //The element is a sub-sprite ('CB_GraphicSprites.SUBSPRITE_OBJECT' object).
						{
							this.drawSubSprite(elementLoop, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObjectCopy, true, CB_REM._ELEMENT_ATTRIBUTES_EMPTY, CB_REM._ELEMENT_ATTRIBUTES_EMPTY, elementLoop._attributes, elementLoopData.leftDependsOnPreviousElement, this._onDrawMapElement);
						}
						
						//Stores the current element in the cached map:
						this.drawElement_currentMap[lastElementY + 1][++lastElementX] = elementLoop;
						
						elementLoopTopNext = elementLoop._attributes.top - element._topRelative;
					}
					
					if (elementLoop === null) { continue; }
					else
					{
						lastElementX = -1;
						lastElementY++;
						elementLoopLeftNext = null;
						elementLoopTopNext += elementLoop.height;
					}
				}
			}
			else { drawn = false; }
			break;
	}

	//If the element has a rotation, restores the canvas (as the canvas itself rotated, indeed):
	if (rotated)
	{
		canvasContext.translate(translationX * -1, translationY * -1);
		canvasContext.restore();
	}

	//If it was drawn, calls the 'onDrawn' and 'element.data.afterDrawing' callbacks (if any):
	if (drawn)
	{
		CB_REM._elementDrawn(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, undefined, undefined, undefined, onDrawn, avoidAfterDrawing);
	}
	
	return drawn;
}


//Draws an image from an element (sprite or sub-sprite):
CB_REM.prototype.drawImage = function(image, srcLeft, srcTop, srcWidth, srcHeight, left, top, width, height, canvasContext, canvasBufferContext)
{
	canvasContext.drawImage(image, srcLeft, srcTop, srcWidth, srcHeight, left, top, width, height);
	if (typeof(canvasBufferContext) !== "undefined" && canvasBufferContext !== null) //Received the canvas buffer's context because it was called through the "onload" event of the image and the current canvas displaying could be the buffer one.
	{
		canvasBufferContext.drawImage(image, srcLeft, srcTop, srcWidth, srcHeight, left, top, width, height);
	}
}


//Creates (or resets) and returns the cache for a map which contains the elements and the copy of the given 'CB_GraphicSpritesScene' object:
CB_REM._MAP_ELEMENTS_CACHE = {}; //Stores a cache with elements which are sprite or sub-sprite objects (read-only).
CB_REM._createCacheMapElement = function(elementId, CB_GraphicSpritesSceneObject)
{
	CB_REM._MAP_ELEMENTS_CACHE[elementId] = {};
	CB_REM._MAP_ELEMENTS_CACHE[elementId].CB_GraphicSpritesSceneObject = CB_GraphicSpritesSceneObject.getCopy(false, false);
	CB_REM._MAP_ELEMENTS_CACHE[elementId].CB_GraphicSpritesSceneObject.forEach //Keeps some of the original attributes.
	(
		function (CB_GraphicSpritesObject)
		{
			if (!CB_GraphicSpritesObject) { return; }
			CB_GraphicSpritesObject._widthOriginal = CB_GraphicSpritesObject.width;
			CB_GraphicSpritesObject._heightOriginal = CB_GraphicSpritesObject.height;
			CB_GraphicSpritesObject._leftOriginal = CB_GraphicSpritesObject.left;
			CB_GraphicSpritesObject._topOriginal = CB_GraphicSpritesObject.top;
			CB_GraphicSpritesObject.forEach
			(
				function (sprite)
				{
					if (!sprite) { return; }
					sprite._widthOriginal = sprite.width;
					sprite._heightOriginal = sprite.height;
					sprite._leftOriginal = sprite.left;
					sprite._topOriginal = sprite.top;
					sprite.forEach
					(
						function (subSprite)
						{
							if (!subSprite) { return; }
							subSprite._widthOriginal = subSprite.width;
							subSprite._heightOriginal = subSprite.height;
							subSprite._leftOriginal = subSprite.left;
							subSprite._topOriginal = subSprite.top;
						}
					);
				}
			);
		}
	);
	CB_REM._MAP_ELEMENTS_CACHE[elementId].elements = {};
	return CB_REM._MAP_ELEMENTS_CACHE[elementId];
}


//Gets a map element from the internal cache or searches it in the given 'CB_GraphicSpritesScene' object (and caches the element):
CB_REM._getMapElement = function(elementIndexOrId, elementData, mapElement, CB_GraphicSpritesSceneObject, mapX, mapY, elementsWidthDefault, elementsHeightDefault)
{
	var element = null;
	
	var elementCacheIndex = elementData.parentId ? elementData.parentId + "_" + elementIndexOrId : elementIndexOrId;
	
	//If we want to renew the cache for this element, tries to find it in the cache:
	if (!elementData.renewCache)
	{
		element = CB_REM._MAP_ELEMENTS_CACHE[mapElement.id].elements[elementCacheIndex] || null;
	}
	
	//If found in the cache, returns it and exits:
	if (element !== null) { return element; }
	//...otherwise, finds the element in the 'CB_GraphicSpritesScene' object and caches it:
	else
	{
		element = CB_REM._findElement(elementIndexOrId, elementData, mapElement, CB_GraphicSpritesSceneObject);
		if (element !== null)
		{
			//Calculates the width and height attributes:
			element.width =
				typeof(elementData.width) === "function" ? elementData.width(mapElement.src[mapY][mapX], element, elementData, mapElement, elementsWidthDefault, mapX, mapY) :
				!isNaN(parseFloat(elementData.width)) ? parseFloat(elementData.width) :
				typeof(mapElement.data.elementsWidth) === "function" ? mapElement.data.elementsWidth(mapElement.src[mapY][mapX], element, elementData, mapElement, elementsWidthDefault, mapX, mapY) :
				!isNaN(parseFloat(mapElement.data.elementsWidth)) ? parseFloat(mapElement.data.elementsWidth) :
				element.width ||
				elementsWidthDefault;
			element.height =
				typeof(elementData.height) === "function" ? elementData.height(mapElement.src[mapY][mapX], element, elementData, mapElement, elementsHeightDefault, mapX, mapY) :
				!isNaN(parseFloat(elementData.height)) ? parseFloat(elementData.height) :
				typeof(mapElement.data.elementsHeight) === "function" ? mapElement.data.elementsHeight(mapElement.src[mapY][mapX], element, elementData, mapElement, elementsHeightDefault, mapX, mapY) :
				!isNaN(mapElement.data.elementsHeight) ? parseFloat(mapElement.data.elementsHeight) :
				element.height ||
				elementsHeightDefault;

			//Stores the element in the cache:
			if (elementData.destroyOnRewnew && CB_REM._MAP_ELEMENTS_CACHE[mapElement.id].elements[elementCacheIndex] !== element)
			{
				if (typeof(CB_REM._MAP_ELEMENTS_CACHE[mapElement.id].elements[elementCacheIndex]) !== "undefined" && CB_REM._MAP_ELEMENTS_CACHE[mapElement.id].elements[elementCacheIndex] !== null)
				{
					if (typeof(CB_REM._MAP_ELEMENTS_CACHE[mapElement.id].elements[elementCacheIndex].destructor) === "function")
					{
						CB_REM._MAP_ELEMENTS_CACHE[mapElement.id].elements[elementCacheIndex].destructor();
					}
				}
			}
			CB_REM._MAP_ELEMENTS_CACHE[mapElement.id].elements[elementCacheIndex] = element;
		}
	}
	
	return element;
}


CB_REM._findElement = function(elementIndexOrId, elementData, mapElement, CB_GraphicSpritesSceneObject)
{
	var element = null;
	
	//Tries to find the ID or index among the 'CB_GraphicSprites' objects which are in 'CB_GraphicSpritesScene' object:
	if (!elementData.parentId || elementData.parentId === CB_GraphicSpritesSceneObject.id)
	{
		if (elementData.id) { element = CB_GraphicSpritesSceneObject.getById(elementIndexOrId, null); }
		else { element = CB_GraphicSpritesSceneObject.get(elementIndexOrId, null); }
	}
	
	if (element !== null && elementData.renewCache) //'CB_GraphicSprites' object found.
	{
		//Makes a copy of the 'CB_GraphicSprites' to renew it:
		element = element.getCopy(false, false);
		element.parent.spritesGroups.items[element.position] = element;
		element.parent.spritesGroups.itemsByZIndex[element.positionByZIndex] = element;
		element.data = element.spritesGroup.data;
	}
	else
	{
		//Loops each 'CB_GraphicSprites' object in the 'CB_GraphicSpritesScene' object:
		CB_GraphicSpritesSceneObject.forEach
		(
			function(graphicSprites, position, graphicSpritesArray, delay) //functionEach.
			{
				if (element !== null) { return; } //Element (sprite or sub-sprite) found.
				
				//Tries to find the ID or index among the sprites ('CB_GraphicSprites.SPRITES_OBJECT' objects) which are in the current 'CB_GraphicSprites' object:
				if (!elementData.parentId || elementData.parentId === graphicSprites.id)
				{
					if (elementData.id) { element = graphicSprites.getById(elementIndexOrId, null); }
					else { element = graphicSprites.get(elementIndexOrId, null); }
				}
				
				if (element !== null) //Element (sprite) found.
				{
					element = CB_copyObject(element);
					element.subSprites = CB_Arrays.copy(element.subSprites);
					element.subSpritesByZIndex = CB_Arrays.copy(element.subSpritesByZIndex);
					element.forEach
					(
						function(subSprite, index)
						{
							//element.subSprites[index] = CB_copyObject(subSprite);
							//element.subSpritesByZIndex[subSprite.positionByZIndex] = element.subSprites[index];
							element.subSprites[index].parent = element;
							element.subSprites[index].container = element.container;
						}
					);
					element.parent.sprites[element.position] = element;
					element.parent.spritesByZIndex[element.positionByZIndex] = element;
					return;
				}
				
				//Loops each sprite:
				graphicSprites.forEach
				(
					function(sprite, position, graphicSpritesArray, delay) //functionEach.
					{
						if (element !== null) { return; } //Element (sub-sprite) found.
						
						//Tries to find the ID or index among the sub-sprites ('CB_GraphicSprites.SUBSPRITES_OBJECT' objects) which are in the current 'CB_GraphicSprites.SPRITES_OBJECT' object:
						if (!elementData.parentId || elementData.parentId === sprite.id)
						{
							if (elementData.id) { element = sprite.getById(elementIndexOrId, null); }
							else { element = sprite.get(elementIndexOrId, null); }
						}
						
						if (element !== null) //Element (sub-sprite) found.
						{
							element = CB_copyObject(element);
							element.parent.subSprites[element.position] = element;
							element.parent.subSpritesByZIndex[element.positionByZIndex] = element;
							return;
						}
					},
					true //Loops using z-index order (ascending order).
				);
			},
			true //Loops using z-index order (ascending order).
		);
	}

	return element;
}



//Defines the properties that will be returned by the CB_REM#getData method by default (if no "propertiesToKeepGraphicSpritesSceneObject" is given):
CB_REM.getData_filterProperties_DEFAULT_PROPERTIES =
{
	spritesScene: ["id", "spritesGroups"],
	spritesGroups: ["id", "byReference_DEFAULT", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "data", /*"spritesGroups",*/ "items"],
	sprites: ["id", "byReference_DEFAULT", "spritesGroup", "zIndex", "pointer", "pointerPrevious", "time", "pointer", "pointerPrevious", "position", "positionByZIndex", "_attributes"],
	spritesGroup: ["id", "byReference_DEFAULT", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "data", "disabled", "sprites"],
	sprite: ["id", "byReference", "time", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "data", "disabled", "position", "positionByZIndex", "subSprites", "_timeDisappeared", "_usingRelativePosition", "_clearPreviousFirstPerformed", "_widthOriginal", "_heightOriginal", "_leftOriginal", "_topOriginal", "_attributes"],
	subSprite: ["id", "byReference", "time", "src", "srcType", "srcLeft", "left", "srcTop", "top", "srcWidth", "width", "srcHeight", "height", "zIndex", "data", "disabled", "position", "positionByZIndex", "_timeDisappeared", "_usingRelativePosition", "_attributes"]
};


//Returns the current data of the rendering engine:
CB_REM.prototype.getData_object = {};
CB_REM.prototype.getData = function(stringify, graphicSpritesSceneObject, avoidGraphicSpritesSceneData, propertiesToKeepGraphicSpritesSceneObject)
{
	//Updates the internal object with the data:
	this.getData_object.data = this.data;
	propertiesToKeepGraphicSpritesSceneObject = (typeof(propertiesToKeepGraphicSpritesSceneObject) === "object" && propertiesToKeepGraphicSpritesSceneObject !== null) ? propertiesToKeepGraphicSpritesSceneObject : CB_REM.getData_filterProperties_DEFAULT_PROPERTIES;
	this.getData_object.GraphicSpritesScene_data = !avoidGraphicSpritesSceneData && graphicSpritesSceneObject instanceof CB_GraphicSpritesScene ? graphicSpritesSceneObject.getCopy(false, false, false, true, propertiesToKeepGraphicSpritesSceneObject) : null;
	
	//Here we could also get other additional data from the rendering engine (as for example this.renderGraphicScene_lastCB_GraphicSpritesSceneObject, etc.)...
	
	//Returns the data (stringified if desired):
	return stringify ? JSON.stringify(this.getData_object) : this.getData_object; //It could be a good idea to stringify functions ('JSON.stringify' method does not).
}


//Restores the given data into the rendering engine:
CB_REM.prototype.setData = function(getDataObject, graphicSpritesSceneObject, avoidGraphicSpritesSceneData)
{
	if (typeof(getDataObject) === "undefined" || getDataObject === null || typeof(getDataObject) !== "object") { return false; }
	
	//Restores the given data:
	this.data = getDataObject.data;
	if (!avoidGraphicSpritesSceneData && getDataObject.GraphicSpritesScene_data instanceof CB_GraphicSpritesScene)
	{
		//Here we would restore the the graphic sprites object...
	}
	//Here we could also restore other additional data from the rendering engine...
	
	return true;
}


//TODO: A 'reset' method could be useful sometimes.


if (CB_REM.DEBUG_MESSAGES) { CB_console("rendering_engine.js inserted in the document"); }