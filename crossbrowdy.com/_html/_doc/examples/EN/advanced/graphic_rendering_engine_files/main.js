/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

var CB_REM_DEBUG_MESSAGES = true; //Shows debug messages.

//Adds the rendering engine module to CrossBrowdy:
CB_Modules.addNeededModule(CB_NAME, "RENDERING_ENGINE_MODULE", { "rendering_engine_module.js" : { load: true, mandatory: true, absolutePath: true } });

var FORCED_EMULATION_METHOD = null; //Forces an emulation mode which can be 'SILVERLIGHT', 'FLASH', 'DHTML' or 'VML' (testing purposes). Use null or undefined to disable it.

//If desired, sets the needed options to force emulation:
if (FORCED_EMULATION_METHOD)
{
	var CB_OPTIONS = { CrossBase: {} };
	CB_OPTIONS.CrossBase.CB_Canvas_PREFERRED_EMULATION_METHODS = [ FORCED_EMULATION_METHOD ];
	if (FORCED_EMULATION_METHOD === "SILVERLIGHT") { CB_OPTIONS.CrossBase.SLCANVAS_LOAD = true; }
	else if (FORCED_EMULATION_METHOD === "FLASH") { CB_OPTIONS.CrossBase.FLASHCANVAS_LOAD = true; } //Note: Flash emulation will not work if native canvas is supported.
	else if (FORCED_EMULATION_METHOD === "DHTML") { CB_OPTIONS.CrossBase.CANBOX_LOAD = true; }
	else if (FORCED_EMULATION_METHOD === "VML") { CB_OPTIONS.CrossBase.EXCANVAS_LOAD = CB_OPTIONS.CrossBase.CANVAS_TEXT_LOAD = true; }
}

var myREM = null; //It will store the CB_REM object.

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Function to execute when a canvas is created:
	var canvasLoaded = 0;
	var onLoadCanvas = function()
	{
		if (CB_REM.DEBUG_MESSAGES) { CB_console("Canvas '" + this.getId() + "' loaded! Mode used: " + this.getMode()); }

		canvasLoaded++;

		//Gets the "context" object to start working with the canvas:
		var canvasContext = this.getContext();
		if (!canvasContext) { CB_console("ERROR: canvas context could not be obtained! Drawing cannot be performed."); return; }

		//Stores the canvas in the 'canvases' object:
		canvases[this.getId()] = this;

		//If both canvas (normal and buffer) have been created, proceeds with the rendering:
		if (canvasLoaded >= 2)
		{
			//When the screen changes its size or its orientation, both canvases will be re-adapted:
			var onResizeOrChangeOrientationTimeout = null;
			var onResizeOrChangeOrientation = function()
			{
				clearTimeout(onResizeOrChangeOrientationTimeout);
				onResizeOrChangeOrientationTimeout = setTimeout //NOTE: needs a delay as some clients on iOS update the screen size information in two or more steps (last step is the correct value).
				(
					function()
					{
						//Resizes the canvas:
						canvases["my_canvas"].setWidth(CB_Screen.getWindowWidth());
						canvases["my_canvas"].setHeight(CB_Screen.getWindowHeight());
						canvases["my_canvas"].clear(); canvases["my_canvas"].disableAntiAliasing();
						
						//Resizes the buffer canvas:
						canvases["my_canvas_buffer"].setWidth(CB_Screen.getWindowWidth());
						canvases["my_canvas_buffer"].setHeight(CB_Screen.getWindowHeight());
						canvases["my_canvas_buffer"].clear();
						canvases["my_canvas_buffer"].disableAntiAliasing();
					}
				);
			};
			CB_Screen.onResize(onResizeOrChangeOrientation);

			//Clears both canvas:
			canvases["my_canvas"].clear();
			canvases["my_canvas_buffer"].clear();
			
			//Disables anti-aliasing to avoid problems with adjacent sprites:
			canvases["my_canvas"].disableAntiAliasing();
			canvases["my_canvas_buffer"].disableAntiAliasing();
			
			//Creates the sprites groups:
			var graphicSpritesSceneObject = createSpritesGroups();

			//Caches all needed images (performance purposes) and starts rendering sprites groups when all are loaded:
			myREM = new CB_REM();
			myREM.cacheImages
			(
				graphicSpritesSceneObject, //CB_GraphicSpritesSceneObject.
				undefined, //reload.
				function(imagesLoaded) //onLoad.
				{
					//Starts clearing the FPS (Frames Per Second) counter each second:
					myREM.startFPSCounter();

					//Show the FPS (Frames Per Second) every time there is a new value:
					myREM.onUpdatedFPS(function(FPS) { graphicSpritesSceneObject.getById("fps_group").getById("fps").src = "FPS: " + FPS; });
					
					//Processes the sprites groups:
					if (CB_REM.DEBUG_MESSAGES) { CB_console("Starts processing graphic sprites scene ('CB_GraphicSpritesScene' object) constantly..."); }
					
					processSpritesGroups(graphicSpritesSceneObject, canvases["my_canvas"], canvases["my_canvas"].getContext(), canvases["my_canvas_buffer"], canvases["my_canvas_buffer"].getContext());
				}
			);
		}
	};
	
	//Creates the canvases:
	var canvases = {};
	canvases["my_canvas"] = new CB_Canvas
	(
		"my_canvas", //canvasId. Unique required parameter.
		"2d", //contextType. NOTE: some emulation methods only support "2d". Default: "2d".
		CB_Screen.getWindowWidth(), //canvasWidth. Use 'CB_Screen.getWindowWidth()' for complete width. Default: CB_Canvas.WIDTH_DEFAULT.
		CB_Screen.getWindowHeight(), //canvasHeight. Use 'CB_Screen.getWindowHeight()' for complete height. Default: CB_Canvas.HEIGHT_DEFAULT.
		onLoadCanvas, //onLoad.
		function(error) { CB_console("Canvas object problem! Error: " + error); }, //onError.
		undefined, undefined, !!FORCED_EMULATION_METHOD, !!FORCED_EMULATION_METHOD //Forces emulation method.
	);
	canvases["my_canvas_buffer"] = new CB_Canvas
	(
		"my_canvas_buffer", //canvasId. Unique required parameter.
		"2d", //contextType. NOTE: some emulation methods only support "2d". Default: "2d".
		CB_Screen.getWindowWidth(), //canvasWidth. Use 'CB_Screen.getWindowWidth()' for complete width. Default: CB_Canvas.WIDTH_DEFAULT.
		CB_Screen.getWindowHeight(), //canvasHeight. Use 'CB_Screen.getWindowHeight()' for complete height. Default: CB_Canvas.HEIGHT_DEFAULT.
		onLoadCanvas, //onLoad.
		function(error) { CB_console("Canvas object problem! Error: " + error); }, //onError.
		undefined, undefined, !!FORCED_EMULATION_METHOD, !!FORCED_EMULATION_METHOD //Forces emulation method.
	);
}


//Creates the sprites groups:
function createSpritesGroups()
{
	//Defines the sprites groups information ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
	/*
		Note:
			1) Sprites groups, sprites and sub-sprites are always automatically ordered internally by their z-index (remember to use the 'setZIndex' method of each if you want to modify it). The elements of the scene will be rendered respecting this order.
			2) We will use 'duration' in the 'data' property to disable a sprite or sub-sprite (if it is set to null, it will never be disabled). If used in a 'CB_GraphicSprites' object, it will affect its current sprite being pointed.
			3) We will use the 'timeResetAndEnableAfter' in the 'data' property to enable again a sprite or sub-sprite (if it is set to null, it will never be enabled). It also resets the 'time' property of the sprite or sub-sprite. If used in a 'CB_GraphicSprites' object, it will affect its current sprite being pointed.
			4) We will use 'skipAfter' in the 'data' property of a sprite to jump to the next one (if it is set to null, it will never jump automatically). * If used in a 'CB_GraphicSprites' object, it will affect its current sprite being pointed.
			5) We can use 'beforeDrawing' and 'afterDrawing' callbacks defined in the 'data' object to be called before drawing an element or after doing it, respectively. For bitmaps, a 'beforeDrawingElement' callback can be used to call before drawing each map element.
			6) We can set 'onlyUseInMap' to true in the 'data' object to just draw that element when it is being drawn as a part of a map (a map is an element whose 'srcType' equals to 'CB_GraphicSprites.SRC_TYPES.MAP').
			7) We can set 'loop' to true in the 'data' object to loop sprites infinitely instead of stopping at the last one.
			8) We can set a number (which belongs to the index of a sprite) or a function returning a number in the 'pointerNext' property of the 'data' object to indicate the desired next sprite.
			9) We can set 'positionAbsolute' to true in the 'data' object to do not have in mind the element's parent position to calculate the position of the element.
			10) We can set 'hidden' to true in the 'data' object to skip that element so it will not be drawn.
			11) To rotate an element, we can set the 'rotation' property in the 'data' object to rotate that element:
				* If the 'rotationUseDegrees' property is set to true, the value set in 'rotation' will be considered degrees, otherwise it will be considered radians.
				* To set the coordinates of the rotation axis (for rotation the canvas, internally), use the 'rotationX' and 'rotationY' properties. If any of them is not set, the rotation coordinate will be considered the center (horizontal or vertical) of the element.
			12) Some properties in the 'data' object can be either a static value or a callback function (as for example the 'style' property).
			13) The 'clearPreviousFirst' property in the 'data' object can be set to true to accomplish the following:
				* If it is a sprite, it will clean the space used by the previous sprite before drawing this sprite.
				* If it is a sub-sprite, it will clean the space that will be used by this sub-sprite.
				* If used in a 'CB_GraphicSprites' object, it will affect its current sprite being pointed.
	*/
	var spritesGroupsData =
	{
		//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_groups_1", //Identifier of the sprites groups object (also used for the 'CB_GraphicSpritesScene' object). Optional but recommended. It should be unique. By default, it is generated automatically.
		srcWidth: 40, //The value for the "srcWidth" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
		srcHeight: 40, //The value for the "srcHeight" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
		data: { skipAfter: null, duration: null, timeResetAndEnableAfter: null, loop: true, clearPreviousFirst: false }, //Object with any additional data desired which can be any kind. Default: { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
		//Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups that will be used (their "parent" property will be set to point the current 'CB_GraphicSpritesScene' object which contains them):
		spritesGroups:
		[
			//'bird_sprites' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "bird_sprites", //Identifier of the sprites group (also used for the 'CB_GraphicSprites' object). Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
				src: "img/bird_sprites.gif", //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
				srcWidth: 38, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
				srcHeight: 36, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
				left: 300, //Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
				width: 190, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
				height: 160, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
				//Object with any additional data desired which can be any kind:
				//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
				data: { skipAfter: 600, clearPreviousFirst: true, onlyUseInMap: false /* Set to true to only display in maps */ }, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'bird_sprite_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "bird_sprite_1", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//'bird_sprite_1_subsprite_1' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "bird_sprite_1_subsprite_1", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: "img/sol.gif",
								srcLeft: 0, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 0, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: 80, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: 80, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: 20, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: 170, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 40, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 40, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: 200, timeResetAndEnableAfter: 200 },
								zIndex: 2
							},
							//'bird_sprite_1_subsprite_2' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "bird_sprite_1_subsprite_2", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: "img/seta.gif",
								srcLeft: 0, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 0, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: 40, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: 40, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								top: 200, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 12, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 12, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data:
								{
									duration: null,
									beforeDrawing:
										function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
										{
											this.height = this.width = this.width === 12 ? 15 : 12;
											if (drawingMap && this._attributes)
											{
												this.data._alternating = !this.data._alternating;
												this._attributes.width = this.data._alternating ? 60 : 50;
												this._attributes.height = this.data._alternating ? 90 : 80;
											}
											return this; //Same as 'element'. Must return the element to draw.
										},
									afterDrawing:
										function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement, onDrawn) //Called after drawing the element.
										{
											//Here we could perform any tasks.
										}
								}
							}
						]
					},
					//'bird_sprite_2' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "bird_sprite_2", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						srcLeft: 38, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//'bird_sprite_2_subsprite_1' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "bird_sprite_2_subsprite_1", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: "img/sol.gif",
								srcLeft: 0, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 0, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: 80, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: 80, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: 20, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: 170, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 40, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 40, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: 200, timeResetAndEnableAfter: 200 },
								zIndex: 2
							},
							//'bird_sprite_2_subsprite_1' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "bird_sprite_2_subsprite_2", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: "img/seta.gif",
								srcLeft: 0, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 0, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: 40, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: 40, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								top: 200, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 12, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 12, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: null }
							}
						]
					},
					//'bird_sprite_3' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "bird_sprite_3", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						srcLeft: 38 * 2, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//'bird_sprite_2_subsprite_1' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "bird_sprite_3_subsprite_1", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: "img/sol.gif",
								srcLeft: 0, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 0, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: 80, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: 80, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: 20, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: 170, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 40, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 40, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: 200, timeResetAndEnableAfter: 200 },
								zIndex: 2
							},
							//'bird_sprite_2_subsprite_1' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "bird_sprite_3_subsprite_2", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: "img/seta.gif",
								srcLeft: 0, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 0, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: 40, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: 40, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								top: 200, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 12, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 12, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: null }
							}
						]
					},
					//'bird_sprite_4' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "bird_sprite_4", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						srcLeft: 38 * 3, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
						//Numeric array containing 'CB_GraphicSprites.SUBSPRITE_OBJECT' objects with the sub-sprites that this sprite uses:
						subSprites:
						[
							//'bird_sprite_2_subsprite_1' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "bird_sprite_4_subsprite_1", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: "img/sol.gif",
								srcLeft: 0, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 0, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: 80, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: 80, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								left: 20, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: 170, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 40, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 40, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: 200, timeResetAndEnableAfter: 200 },
								zIndex: 2
							},
							//'bird_sprite_2_subsprite_4' ('CB_GraphicSprites.SUBSPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the parent sprite:
							{
								id: "bird_sprite_4_subsprite_2", //Identifier for the sub-sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
								src: "img/seta.gif",
								srcLeft: 0, //Left (horizontal) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcLeft || CB_GraphicSprites.LEFT_SOURCE_DEFAULT.
								srcTop: 0, //Top (vertical) position in the original source (having in mind its real width and height). Unit agnostic (only numeric values allowed). Default: this.parent.srcTop || CB_GraphicSprites.TOP_SOURCE_DEFAULT.
								srcWidth: 40, //Width of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcWidth || CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
								srcHeight: 40, //Height of the original source. Unit agnostic (only numeric values allowed). Default: this.parent.srcHeight || CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
								top: 200, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 12, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 12, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: null }
							}
						]
					}
				]
			},
			//'panda_sprites' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "panda_sprites", //Identifier of the sprites group (also used for the 'CB_GraphicSprites' object). Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
				width: 80, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
				height: 80, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
				zIndex: 3, //The z-index for the destiny. Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
				//Object with any additional data desired which can be any kind:
				//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
				data: { skipAfter: 500 }, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'panda_sprites_sprite_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "panda_sprites_sprite_1", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						src: "img/panda_1.gif" //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
					},
					//'panda_sprites_sprite_2' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "panda_sprites_sprite_2", //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
						src: "img/panda_2.gif" //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
					}
				]
			},
			//'ranisima_sprites' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "ranisima_sprites", //Identifier of the sprites group (also used for the 'CB_GraphicSprites' object). Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
				src: "img/ranisima.gif", //Source of origin. Can be a path or identifier of an image, text, bitmap, 3D object, etc. Optional but recommended. Default: this.parent.src || "".
				left: 110, //Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
				top: 80, //Top (vertical) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
				width: 160, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
				height: 160, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
				zIndex: 2, //The z-index for the destiny. Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
				data:
				{
					rotation: 0,
					rotationX: undefined,
					rotationY: undefined,
					rotationUseDegrees: true,
					duration: 1000,
					timeResetAndEnableAfter: 250,
					clearPreviousFirst: true,
					opacity: 0.2,
					beforeDrawing:
						function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
						{
							element.data.rotation++;
							return element;
						}
				},
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'ranisima_sprites_sprite_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "ranisima_sprites_sprite_1" //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
					}
				]
			},
			//'text_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "text_group",
				srcType: CB_GraphicSprites.SRC_TYPES.TEXT,
				zIndex: 3,
				data: { skipAfter: 2000, clearPreviousFirst: true },
				sprites:
				[
					//'text_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "text_1",
						src: "Hello, CrossBrowdy!",
						left: 100,
						top: 24,
						data:
						{
							fontSize: "26px",
							fontFamily: "courier",
							style: "#ffff00",
							fontStyle: "normal",
							fontVariant: "normal",
							fontWeight: "bold",
							caption: null,
							smallCaption: null,
							icon: null,
							menu: null,
							messageBox: null,
							statusBar: null
						}
					},
					//'text_2' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "text_2",
						src: "Stroke text",
						left: 100,
						top: 60,
						data:
						{
							fontSize: "48px",
							fontFamily: "arial",
							style: "#ff0000",
							stroke: true,
							fontStyle: "italic",
							fontVariant: "small-caps",
							fontWeight: "lighter",
							caption: null,
							smallCaption: null,
							icon: null,
							menu: null,
							messageBox: null,
							statusBar: null
						}
					}
				]
			},
			//'fps_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "fps_group",
				srcType: CB_GraphicSprites.SRC_TYPES.TEXT,
				zIndex: 3,
				sprites:
				[
					//'fps' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "fps",
						src: "FPS: Calculating...",
						left: 110,
						top: 0,
						data:
						{
							fontSize: "26px",
							fontFamily: "courier",
							style: "#aa00dd",
							fontStyle: "normal",
							fontVariant: "normal",
							fontWeight: "bold",
							caption: null,
							smallCaption: null,
							icon: null,
							menu: null,
							messageBox: null,
							statusBar: null
						}
					}
				]
			},
			//'pixel_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "pixel_group",
				srcType: CB_GraphicSprites.SRC_TYPES.PIXEL,
				sprites:
				[
					//'pixel_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "pixel_1",
						left: 85,
						top: 25,
						data:
						{
							style: "#ff00ff"
						},
						subSprites:
						[
							{
								id: "pixel_1_subsprite_1",
								top: 2
							},
							{
								id: "pixel_1_subsprite_2",
								top: 4
							},
							{
								id: "pixel_1_subsprite_3",
								top: 6
							},
							{
								id: "pixel_1_subsprite_4",
								top: 8
							}
						]
					}
				]
			},
			//'rectangle_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "rectangle_group",
				srcType: CB_GraphicSprites.SRC_TYPES.RECTANGLE,
				sprites:
				[
					//'rectangle_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "rectangle_1",
						left: 400,
						top: 170,
						width: 60,
						height: 60,
						data:
						{
							style: "#00aa00"
						},
						subSprites:
						[
							{
								id: "rectangle_1_subsprite_1",
								left: 70,
								data:
								{
									style:
									function(element, canvasContext, canvasBufferContext, userBuffer)
									{
										var gradient = canvasContext.createLinearGradient(element.left, element.top, element.left + element.width, element.top + element.height);
										gradient.addColorStop(0, "#aa0000");
										gradient.addColorStop(1, "#aaaa00");
										return gradient;
									}
								}
							},
							{
								id: "rectangle_1_subsprite_2",
								left: 140,
								data:
								{
									stroke: true,
									style:
									function(element, canvasContext, canvasBufferContext, userBuffer)
									{
										var gradient = canvasContext.createLinearGradient(element.left, element.top, element.left + element.width, element.top + element.height);
										gradient.addColorStop(0, "#00aa00");
										gradient.addColorStop(1, "#00ffaa");
										return gradient;
									}
								}
							},
							{
								id: "rectangle_1_subsprite_3",
								left: 210,
								data:
								{
									style:
									function(element, canvasContext, canvasBufferContext, userBuffer)
									{
										var src = "img/seta.gif";
										var image = CB_REM._IMAGES_CACHE[src];
										if (!image)
										{
											image = new Image()
											image.src = src;
										}
										return canvasContext.createPattern(image, 'repeat');
									}
								}
							}
						]
					}
				]
			},
			//'circle_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "circle_group",
				srcType: CB_GraphicSprites.SRC_TYPES.CIRCLE,
				data: { radius: 30, style: "#00aa00", opacity: 0.5 },
				sprites:
				[
					//'circle_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "circle_1",
						left: 35,
						top: 120,
						subSprites:
						[
							{
								id: "circle_1_subsprite_1",
								top: 70,
								data:
								{
									style:
									function(element, canvasContext, canvasBufferContext, userBuffer)
									{
										var gradient = canvasContext.createRadialGradient(element.left, element.top, 10, element.left + 10, element.top + 10, 80);
										gradient.addColorStop(0, "red");
										gradient.addColorStop(0.5, "black");
										return gradient;
									}
								}
							},
							{
								id: "circle_1_subsprite_2",
								top: 140,
								data: { style: "#aa0000", stroke: true }
							}
						]
					}
				]
			},
			//'arc_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "arc_group",
				srcType: CB_GraphicSprites.SRC_TYPES.ARC,
				data: { radius: 10, startAngle: 2, endAngle: 11, style: "#00aa00" },
				sprites:
				[
					//'arc_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "arc_1",
						left: 80,
						top: 150,
						subSprites:
						[
							{
								id: "arc_1_subsprite_1",
								top: 30
							},
							{
								id: "arc_1_subsprite_2",
								top: 60,
								data: { style: "#aa0000", stroke: true }
							}
						]
					}
				]
			},
			//'ellipse_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "ellipse_group",
				srcType: CB_GraphicSprites.SRC_TYPES.ELLIPSE,
				data: { radiusX: 3, radiusY: 8, ellipseRotation: 20, startAngle: 2, endAngle: 11, anticlockwise: false, style: "#00aa00" },
				sprites:
				[
					//'ellipse_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "ellipse_1",
						left: 350,
						top: 100,
						subSprites:
						[
							{
								id: "ellipse_1_subsprite_1",
								top: 20
							},
							{
								id: "ellipse_1_subsprite_2",
								top: 40,
								data: { style: "#aa0000", stroke: true }
							}
						]
					}
				]
			},
			//'triangle_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "triangle_group",
				srcType: CB_GraphicSprites.SRC_TYPES.TRIANGLE,
				data: { x1: 3, y1: 8, x2: 20, y2: 2, style: "#00aa00" }, //The (x1, y1) and (x2, y2) points are relative to the element left and top.
				sprites:
				[
					//'triangle_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "triangle_1",
						left: 370,
						top: 190,
						subSprites:
						[
							{
								id: "triangle_1_subsprite_1",
								top: 20
							},
							{
								id: "triangle_1_subsprite_2",
								top: 40,
								data: { style: "#aa0000", stroke: true }
							}
						]
					}
				]
			},
			//'segment_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "segment_group",
				srcType: CB_GraphicSprites.SRC_TYPES.SEGMENT,
				width: 10,
				data: { x1: 3, y1: 8, x2: 200, y2: 20, style: "#00aa00" }, //The (x1, y1) and (x2, y2) points are relative to the element left and top.
				sprites:
				[
					//'segment_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "segment_1",
						left: 370,
						top: 250,
						subSprites:
						[
							{
								id: "segment_1_subsprite_1",
								top: 20
							},
							{
								id: "segment_1_subsprite_2",
								top: 40,
								data: { style: "#aa0000" }
							}
						]
					}
				]
			},
			//'bezier_curve_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "bezier_curve_group",
				srcType: CB_GraphicSprites.SRC_TYPES.BEZIER_CURVE,
				width: 5,
				data: { x1: 0, y1: 50, x2: 220, y2: 20, x3: 100, y3: 10, style: "#00aa00" }, //The (x1, y1), (x2, y2) and (x3, y3) points are relative to the element left and top.
				sprites:
				[
					//'bezier_curve_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "bezier_curve_1",
						left: 0,
						top: 280,
						subSprites:
						[
							{
								id: "bezier_curve_1_subsprite_1",
								top: 30
							},
							{
								id: "bezier_curve_1_subsprite_2",
								top: 60,
								data: { style: "#aa0000" }
							}
						]
					}
				]
			},
			//'quadratic_bezier_curve_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "quadratic_bezier_curve_group",
				srcType: CB_GraphicSprites.SRC_TYPES.QUADRATIC_BEZIER_CURVE,
				width: 2,
				data: { x1: 0, y1: 50, x2: 220, y2: 20, style: "#00aa00" }, //The (x1, y1) and (x2, y2) points are relative to the element left and top.
				sprites:
				[
					//'quadratic_bezier_curve_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "quadratic_bezier_curve_1",
						left: 150,
						top: 250,
						subSprites:
						[
							{
								id: "quadratic_bezier_curve_1_subsprite_1",
								top: 30
							},
							{
								id: "quadratic_bezier_curve_1_subsprite_2",
								top: 60,
								data: { style: "#aa0000" }
							}
						]
					}
				]
			},
			//'bitmap_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "bitmap_group",
				srcType: CB_GraphicSprites.SRC_TYPES.BITMAP,
				top: 340,
				left: 300,
				width: 10, //It will be updated when calling 'beforeDrawingElement'.
				height: 10, //It will be updated when calling 'beforeDrawingElement'.
				data:
				{
					beforeDrawingElement:
						function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
						{
							this.width = 30;
							this.height = 20;
							return this; //Same as 'element'. Must return the element to draw.
						}
				},
				sprites:
				[
					//Maps with string aliases:
					//'bitmap_current' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "bitmap_current", //Current map which will be displayed (it will be modified according to the position of the player and the other elements).
						src:
						[
							[	true,	true,	true,	true,	true	],
							[	true,	false,	true,	false,	true	],
							[	true,	false,	true,	false,	true	]
						]
					}
				]
			},
			//'map_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "map_group",
				src: //Map with string aliases:
				[
					[ "#", "$", "@", "#", "", "@", "", "|", "!" ],
					[ 3, "%", "#", "@", "#", "@", "!", "", 1 ]
				],
				srcType: CB_GraphicSprites.SRC_TYPES.MAP,
				left: 20,
				top: 400,
				width: 20,
				height: 20,
				data:
				{
					//References sprites or sub-sprites by their index or identifier. Define a "parentId" (parent identifier of the 'CB_GraphicSprites' object or of the 'CB_GraphicSprites.SPRITE_OBJECT' object) to improve performance.
					elementsData:
					{
						//Each property name is an alias which can be used in the map (in the "src" property).
						"1" : { index: 1, leftDependsOnPreviousElement: true, topDependsOnPreviousElement: true, parentId: "circle_1" }, //Has in mind the position of the last element to calculate its left and top.
						"3" : { index: 3, leftDependsOnPreviousElement: true, topDependsOnUpperElement: true, parentId: "bird_sprites" }, //Has in mind the position of the last element to calculate its left but to calculate its top has in mind the element above.
						"|":
						{
							id: "bird_sprites",
							leftDependsOnPreviousElement: true, //Has in mind the left position of the last element to calculate its left.
							topDependsOnPreviousElement: true //Has in mind the top position of the last element to calculate its top.
						},
						"@": { id: "panda_sprites_sprite_1" },
						"#": { id: "panda_sprites_sprite_2" },
						"$": //If defined left and/or top, the position will always be that one (fixed).
						{
							id: "bird_sprite_2_subsprite_1",
							width: 120,
							height: 50,
							left: function(alias, element, elementData, elementMapParent, elementLoopLeftNext, x, y) { return 500; }, //It can be either a number or a function returning a number. The function will be called before drawing the element (sprite or sub-sprite) in each loop.
							top: 0, //It can be either a number or a function returning a number. The function will be called before drawing the element (sprite or sub-sprite) in each loop.
 							//Renews the internal cache by creating a new copy of the cached element ('CB_GraphicSprites', 'CB_GraphicSprites.SPRITE_OBJECT' or 'CB_GraphicSprites.SUBSPRITE_OBJECT') every time it is rendered:
							renewCache: true
						},
						"%":
						{
							id: "bird_sprite_1",
 							//Renews the internal cache by creating a new copy of the cached element ('CB_GraphicSprites', 'CB_GraphicSprites.SPRITE_OBJECT' or 'CB_GraphicSprites.SUBSPRITE_OBJECT') every time it is rendered:
							renewCache: true,
							destroyOnRewnew: true //Destroys the previous stored element before renewing the internal cache.
						},
						"!":
						{
							id: "bird_sprite_1_subsprite_2",
							width: function(alias, element, elementData, elementMapParent, elementLoopWidthDefault, x, y) { return 50; }, //It can be either a number or a function returning a number. The function will be called before drawing the element (sprite or sub-sprite) in each loop.
							height: 80, //It can be either a number or a function returning a number. The function will be called before drawing the element (sprite or sub-sprite) in each loop.
							leftDependsOnPreviousElement: true, //Has in mind the left position of the last element to calculate its left.
							topDependsOnPreviousElement: true, //Has in mind the top position of the last element to calculate its top.
 							//Renews the internal cache by creating a new copy of the cached element ('CB_GraphicSprites', 'CB_GraphicSprites.SPRITE_OBJECT' or 'CB_GraphicSprites.SUBSPRITE_OBJECT') every time it is rendered:
							renewCache: true
						}
					},
					elementsWidth: 40, //It can be either a number or a function returning a number. The function will be called before drawing the element (sprite or sub-sprite) in each loop.
					elementsHeight: function(alias, element, elementData, elementMapParent, elementLoopHeightDefault, x, y) { return 50; }, //It can be either a number or a function returning a number. The function will be called before drawing the element (sprite or sub-sprite) in each loop.
					/*
						Note:
							The "elementsLeft" and "elementsTop" properties can also be defined and can be either a number or a function returning a number. The function will be called before drawing the element (sprite or sub-sprite) in each loop.
							Uncomment them try:
					*/
					//elementsLeft: function(alias, element, elementData, elementMapParent, elementLoopLeftNext, x, y) { return 200; },
					//elementsTop: 20,
					skipAfter: 5000
				},
				sprites:
				[
					//'map_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "map_1"
					},
					//'map_2' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "map_2",
						src:
						[
							[ "", "%", "@", "#", "@", "#", "!" ],
							[ "$", "@", "#", "@", "|", "" ]
						]
					},
					//'map_3' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "map_3",
						left: 120,
						top: 100
					},
					//'map_4' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "map_4",
						left: 120,
						top: 100,
						src:
						[
							[ "", "%", "@", "#", "@", "#", "!" ],
							[ "$", "@", "#", "@", "|", "" ]
						]
					}
				]
			}
		]
	 };

	//Creates the graphic sprites object:
	return new CB_GraphicSpritesScene(spritesGroupsData);	
}


//Processes the sprites groups:
var processSpritesGroupsTimer = null;
function processSpritesGroups(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectContext, CB_CanvasObjectBuffer, CB_CanvasObjectBufferContext)
{
	//Renders the scene:
	myREM.renderGraphicScene
	(
		graphicSpritesSceneObject, //graphicSpritesSceneObject. Mandatory. The 'CB_GraphicSpritesScene' object to render.
		//data:
		{
			"CB_CanvasObject": CB_CanvasObject, //Main canvas. Mandatory.
			"CB_CanvasObjectContext": CB_CanvasObjectContext, //Context of the main canvas. Mandatory.
			"CB_CanvasObjectBuffer": CB_CanvasObjectBuffer, //Buffer canvas. Mandatory if "useBuffer" is set to true.
			"CB_CanvasObjectBufferContext": CB_CanvasObjectBufferContext //Context of the buffer canvas. Optional. Mandatory if "useBuffer" is set to true.
		},
		!FORCED_EMULATION_METHOD && CB_REM.BUFFER_RECOMMENDED, //useBuffer. Optional. Default: false. Defines whether to use canvas buffer.
		true //alternateBuffer. Optional. Default: false. Defines whether to alternate visibility between canvas or not (if not, it will copy the buffer canvas content to the visible canvas always).
	);

	//Calls itself again:
	processSpritesGroupsTimer = CB_symmetricCall //Note: we could also use 'requestAnimationFrame'.
	(
		function() { processSpritesGroups(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectContext, CB_CanvasObjectBuffer, CB_CanvasObjectBufferContext); },
		16, //About 60 FPS (Frames Per Second).
		"processSpritesGroupsTimerId"
	);
}