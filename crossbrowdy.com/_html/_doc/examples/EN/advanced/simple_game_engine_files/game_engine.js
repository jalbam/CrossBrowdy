/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

//Defines the needed properties:
CB_GEM.REM = CB_GEM.REM || null; //It will store the CB_REM object (Graphic Rendering Engine Module object).
CB_GEM.REM_renderGraphicScene_data = null; //It will store the "data" parameter when calling the 'CB_GEM.REM#renderGraphicScene' method internally.
CB_GEM.REM_renderGraphicScene_useBuffer = null; //It will store the "useBuffer" parameter when calling the 'CB_GEM.REM#renderGraphicScene' method internally.
CB_GEM.graphicSpritesSceneObject = null; //It will store the CB_GraphicSpritesScene object.
CB_GEM.CB_CanvasObject = null; //It will store the CB_Canvas element (the main canvas and the one for the buffer can be internally-alternated automatically if desired).
CB_GEM.CB_CanvasObjectContext = null; //It will store the context of the CB_Canvas element.
CB_GEM.CB_CanvasObjectBuffer = null; //It will store the CB_Canvas element used as the buffer (the main canvas and the one for the buffer can be internally-alternated automatically if desired).
CB_GEM.CB_CanvasObjectBufferContext = null; //It will store the context of the CB_Canvas element used as the buffer.

//Sets the desired options:
CB_GEM.options = CB_GEM.options || {};
CB_GEM.options.REFRESH_RATE = CB_GEM.options.REFRESH_RATE || 16; //A refresh rate of 16 is about 60 FPS (Frames Per Second).
CB_GEM.options.canvasId = CB_GEM.options.canvasId || "my_canvas";
CB_GEM.options.canvasBufferId = CB_GEM.options.canvasBufferId || "my_canvas_buffer";
CB_GEM.options.contextMenuDisable = CB_GEM.options.contextMenuDisable === true || CB_GEM.options.contextMenuDisable === false ? CB_GEM.options.contextMenuDisable : true; //Disables the context menu (when pressing mouse's right button) by default.
CB_GEM.options.overwriteViewPort = CB_GEM.options.overwriteViewPort === true || CB_GEM.options.overwriteViewPort === false ? CB_GEM.options.overwriteViewPort : true; //Overwrites the view port ('viewport' meta-tag) by default.

//Sets some options:
var CB_OPTIONS = CB_OPTIONS || { CrossBrowdy: {} };
CB_OPTIONS.CrossBrowdy = CB_OPTIONS.CrossBrowdy || {};
CB_OPTIONS.CrossBrowdy.CB_console_ALLOW_ALERTS = false; //It will not show alerts in the browsers that doesn't have console.

//If desired, sets the needed options to force emulation:
if (CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD) //Forces an emulation mode which can be 'SILVERLIGHT', 'FLASH', 'DHTML' or 'VML' (testing purposes). Use null or undefined to disable it.
{
	CB_OPTIONS.CrossBase = CB_OPTIONS.CrossBase || {};
	CB_OPTIONS.CrossBase.CB_Canvas_PREFERRED_EMULATION_METHODS = [ CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD ];
	if (CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD === "SILVERLIGHT") { CB_OPTIONS.CrossBase.SLCANVAS_LOAD = true; }
	else if (CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD === "FLASH") { CB_OPTIONS.CrossBase.FLASHCANVAS_LOAD = true; } //Note: Flash emulation will not work if native canvas is supported.
	else if (CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD === "DHTML") { CB_OPTIONS.CrossBase.CANBOX_LOAD = true; }
	else if (CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD === "VML") { CB_OPTIONS.CrossBase.EXCANVAS_LOAD = CB_OPTIONS.CrossBase.CANVAS_TEXT_LOAD = true; }
}


//Main initialization function (internal usage only, it will be called automatically when the module loads and gets ready):
CB_GEM._init = function()
{
	//If we want to, tries to keeps the screen awake and prevents it from turning off (must be executed through a user-driven event as onClick, etc.):
	if (!CB_GEM.options.allowScreenSleep)
	{
		var keepAwakeEventExecuted = false;
		var keepAwakeEvent = function()
		{
			if (!keepAwakeEventExecuted)
			{
				keepAwakeEventExecuted = true;
				CB_Screen.keepAwake(function() { CB_console("Keep awake set successfully!"); }, function() { CB_console("Keep awake could not be set successfully!"); });
				CB_Events.remove(document, "click", keepAwakeEvent, true);
				CB_Events.remove(document, "touchstart", keepAwakeEvent, true);
			}
		};
		CB_Events.add(document, "click", keepAwakeEvent, true, true, true);
		CB_Events.add(document, "touchstart", keepAwakeEvent, true, true, true);
	}
};


//This function will be called when CrossBrowdy is ready:
CB_GEM.begin = function(onStart, onError, avoidLoopStart)
{
	//If desired, overwrites the view port ('viewport' meta-tag):
	if (CB_GEM.options.overwriteViewPort)
	{
		CB_console("Overwring/creating 'viewport' meta-tag...");
		//Changes the viewport:
		CB_Screen.setViewport
		(
			"device-width", //'width'. Optional.
			"device-height", //'height'. Optional.
			false, //'userScalable'. Optional.
			"1.0", //'initialScale'. Optional.
			"1.0", //'minimumScale'. Optional.
			"1.0", //'maximumScale'. Optional.
			"device-dpi", //'targetDensityDPI'. Optional.
			"no" //'shrinkToFit'. Optional.
		);
	}
	
	//Function to execute when a canvas is created:
	var canvasLoaded = 0;
	var onLoadCanvas = function()
	{
		if (CB_GEM.DEBUG_MESSAGES) { CB_console("Canvas '" + this.getId() + "' loaded! Mode used: " + this.getMode()); }

		canvasLoaded++;

		//Gets the "context" object to start working with the canvas:
		var canvasContext = this.getContext();
		if (!canvasContext)
		{
			CB_console("ERROR: canvas context could not be obtained! Drawing cannot be performed.");
			if (typeof(onError) === "function") { onError.call(CB_GEM, "No canvas context found"); }
			return;
		}

		//Prevents canvas dragging and default touch actions:
		this.get().style.draggable = false;
		this.get().style.touchAction = "none";

		//Stores the canvas in the 'canvases' object:
		canvases[this.getId()] = this;

		//If both canvas (normal and buffer) have been created, proceeds with the rendering:
		if (canvasLoaded >= 2)
		{
			//If desired, disables the context menu for both canvases:
			if (CB_GEM.options.contextMenuDisable)
			{
				CB_console("Disabling context menu for different items...");
				CB_Elements.contextMenuDisable(); //Affects 'document' (whole document).
				CB_Elements.contextMenuDisable(canvases[CB_GEM.options.canvasId].get());
				CB_Elements.contextMenuDisable(canvases[CB_GEM.options.canvasBufferId].get());
			}
			
			//Disables some undesired effects/behaviour:
			if (document.body && document.body.style)
			{
				document.body.style.zoom = 1; //Disables zoom under some circumstances for some web clients.
				document.body.style.touchAction = document.body.style.msTouchAction = "none"; //Prevents default touch actions for some web clients.
			}
			
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
						canvases[CB_GEM.options.canvasId].setWidth(CB_Screen.getWindowWidth());
						canvases[CB_GEM.options.canvasId].setHeight(CB_Screen.getWindowHeight());
						canvases[CB_GEM.options.canvasId].clear();
						canvases[CB_GEM.options.canvasId].disableAntiAliasing();
						
						//Resizes the buffer canvas:
						canvases[CB_GEM.options.canvasBufferId].setWidth(CB_Screen.getWindowWidth());
						canvases[CB_GEM.options.canvasBufferId].setHeight(CB_Screen.getWindowHeight());
						canvases[CB_GEM.options.canvasBufferId].clear();
						canvases[CB_GEM.options.canvasBufferId].disableAntiAliasing();
						
						//Calls the 'onResize' event set, if any:
						if (typeof(CB_GEM.onResize) === "function")
						{
							CB_GEM.onResize.call(CB_GEM, CB_GEM.graphicSpritesSceneObject, CB_GEM.REM_renderGraphicScene_data, canvases[CB_GEM.options.canvasId], canvases[CB_GEM.options.canvasBufferId]);
						}
					},
					100
				);
			};
			CB_Screen.onResize.call(CB_GEM, onResizeOrChangeOrientation);

			//Clears both canvas:
			canvases[CB_GEM.options.canvasId].clear();
			canvases[CB_GEM.options.canvasBufferId].clear();
			
			//Disables anti-aliasing to avoid problems with adjacent sprites:
			canvases[CB_GEM.options.canvasId].disableAntiAliasing();
			canvases[CB_GEM.options.canvasBufferId].disableAntiAliasing();
			
			//Creates the sprites groups:
			CB_GEM.graphicSpritesSceneObject = CB_GEM._createSpritesGroups();

			//Caches all needed images (performance purposes) and starts rendering sprites groups when all are loaded:
			CB_GEM.REM = new CB_REM();
			
			CB_GEM.REM.cacheImages
			(
				CB_GEM.graphicSpritesSceneObject, //CB_GraphicSpritesSceneObject.
				undefined, //reload.
				function(imagesLoaded) //onLoad.
				{
					//Starts clearing the FPS (Frames Per Second) counter each second:
					CB_GEM.REM.startFPSCounter();

					//Gets the 'CB_GraphicSprites.SPRITES_OBJECT' object used to display the FPS counter:
					var FPSSprites = CB_GEM.graphicSpritesSceneObject.getById("fps_group").getById("fps");

					//Calls the 'onStart' callback (if any):
					if (typeof(onStart) === "function") { onStart.call(CB_GEM, CB_GEM.graphicSpritesSceneObject, canvases[CB_GEM.options.canvasId], canvases[CB_GEM.options.canvasBufferId], FPSSprites); }
					
					//Show the FPS (Frames Per Second) every time there is a new value:
					CB_GEM.REM.onUpdatedFPS(function(FPS) { FPSSprites.src = "FPS: " + FPS; });
					
					//Creates the empty callbacks if they do not exist:
					if (typeof(CB_GEM.onLoopStart) !== "function") { CB_GEM.onLoopStart = function() {}; }
					if (typeof(CB_GEM.onLoopEnd) !== "function") { CB_GEM.onLoopEnd = function() {}; }

					//Stores the canvases and the contexts:
					CB_GEM.CB_CanvasObject = canvases[CB_GEM.options.canvasId];
					CB_GEM.CB_CanvasObjectContext = canvases[CB_GEM.options.canvasId].getContext();
					CB_GEM.CB_CanvasObjectBuffer = canvases[CB_GEM.options.canvasBufferId];
					CB_GEM.CB_CanvasObjectBufferContext = canvases[CB_GEM.options.canvasBufferId].getContext();
					
					//If we do not want to avoid starting the game loop, starts it:
					if (!avoidLoopStart) { CB_GEM.loopStart(); }
				}
			);
		}
	};
	
	//Creates the canvases:
	var canvases = {};
	canvases[CB_GEM.options.canvasId] = new CB_Canvas
	(
		CB_GEM.options.canvasId, //canvasId. Unique required parameter.
		"2d", //contextType. NOTE: some emulation methods only support "2d". Default: "2d".
		CB_Screen.getWindowWidth(), //canvasWidth. Use 'CB_Screen.getWindowWidth()' for complete width. Default: CB_Canvas.WIDTH_DEFAULT.
		CB_Screen.getWindowHeight(), //canvasHeight. Use 'CB_Screen.getWindowHeight()' for complete height. Default: CB_Canvas.HEIGHT_DEFAULT.
		onLoadCanvas, //onLoad.
		function(error) { CB_console("Canvas object problem! Error: " + error); if (typeof(onError) === "function") { onError.call(CB_GEM, error); } }, //onError.
		undefined, undefined, !!CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD, !!CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD //Forces emulation method.
	);
	canvases[CB_GEM.options.canvasBufferId] = new CB_Canvas
	(
		CB_GEM.options.canvasBufferId, //canvasId. Unique required parameter.
		"2d", //contextType. NOTE: some emulation methods only support "2d". Default: "2d".
		CB_Screen.getWindowWidth(), //canvasWidth. Use 'CB_Screen.getWindowWidth()' for complete width. Default: CB_Canvas.WIDTH_DEFAULT.
		CB_Screen.getWindowHeight(), //canvasHeight. Use 'CB_Screen.getWindowHeight()' for complete height. Default: CB_Canvas.HEIGHT_DEFAULT.
		onLoadCanvas, //onLoad.
		function(error) { CB_console("Canvas object problem! Error: " + error); if (typeof(onError) === "function") { onError.call(CB_GEM, error); } }, //onError.
		undefined, undefined, !!CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD, !!CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD //Forces emulation method.
	);
}


//Creates the sprites groups:
CB_GEM._createSpritesGroups = function()
{
	//Sanitizes sprites group data:
	CB_GEM.spritesGroupsData = CB_GEM.spritesGroupsData || { id: "my_sprites_groups_1", srcWidth: 40, srcHeight: 40, data: { skipAfter: null, duration: null, timeResetAndEnableAfter: null, loop: true, clearPreviousFirst: false } };
	CB_GEM.spritesGroupsData.spritesGroups = CB_GEM.spritesGroupsData.spritesGroups || [];
	
	//Adds the sprites group to show the FPS (Frames Per Second):
	CB_GEM.spritesGroupsData.spritesGroups[CB_GEM.spritesGroupsData.spritesGroups.length] =
		//'fps_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
		{
			id: "fps_group",
			srcType: CB_GraphicSprites.SRC_TYPES.TEXT,
			zIndex: Number.MAX_SAFE_INTEGER || 999999999999,
			sprites:
			[
				//'fps' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
				{
					id: "fps",
					src: "FPS: Calculating...",
					left: 0,
					top: 0,
					data:
					{
						fontSize: "12px",
						fontFamily: "courier",
						style: "#aa5522",
						fontStyle: "normal",
						fontVariant: "normal",
						fontWeight: "bold"
					}
				}
			]
		};
	
	//Creates the graphic sprites object:
	return new CB_GraphicSpritesScene(CB_GEM.spritesGroupsData);	
}


//Processes the sprites groups:
CB_GEM._processSpritesGroups_timer = null;
CB_GEM._processSpritesGroups = function(expectedCallingTime) //The "expectedCallingTime" parameter is received from the callback used in the 'CB_symmetricCall' function (first time will be zero). Also passed to the callbacks.
{
	if (CB_GEM.stopped) { return; }
	
	//Executes the 'onLoopStart' callback (if any):
	var skipRendering = CB_GEM.onLoopStart.call(CB_GEM, CB_GEM.graphicSpritesSceneObject, CB_GEM.REM_renderGraphicScene_data, expectedCallingTime);
	
	if (skipRendering !== false)
	{
		//Renders the scene:
		CB_GEM.REM.renderGraphicScene
		(
			CB_GEM.graphicSpritesSceneObject, //graphicSpritesSceneObject. Mandatory. The 'CB_GraphicSpritesScene' object to render.
			CB_GEM.REM_renderGraphicScene_data, //data.
			CB_GEM.REM_renderGraphicScene_useBuffer, //useBuffer. Optional. Default: false. Defines whether to use canvas buffer.
			true //alternateBuffer. Optional. Default: false. Defines whether to alternate visibility between canvas or not (if not, it will copy the buffer canvas content to the visible canvas always).
		);

		//Executes the 'onLoopEnd' callback (if any):
		CB_GEM.onLoopEnd.call(CB_GEM, CB_GEM.graphicSpritesSceneObject, CB_GEM.REM_renderGraphicScene_data, expectedCallingTime);
	}

	//Calls itself again:
	CB_GEM._processSpritesGroups_timer = CB_symmetricCall //Note: we could also use 'requestAnimationFrame'.
	(
		function(expectedCallingTime) { CB_GEM._processSpritesGroups(expectedCallingTime); },
		CB_GEM.options.REFRESH_RATE,
		"_processSpritesGroupsTimerId"
	);
}


//Starts the game loop:
CB_GEM.loopStart = function()
{
	//Defines the "data" used by the rendering engine:
	CB_GEM.REM_renderGraphicScene_data =
	{
		"CB_CanvasObject": CB_GEM.CB_CanvasObject, //Main canvas. Mandatory.
		"CB_CanvasObjectContext": CB_GEM.CB_CanvasObjectContext, //Context of the main canvas. Mandatory.
		"CB_CanvasObjectBuffer": CB_GEM.CB_CanvasObjectBuffer, //Buffer canvas. Mandatory if "useBuffer" is set to true.
		"CB_CanvasObjectBufferContext": CB_GEM.CB_CanvasObjectBufferContext //Context of the buffer canvas. Optional. Mandatory if "useBuffer" is set to true.
	};

	//Defines whether to use buffer or not:
	CB_GEM.REM_renderGraphicScene_useBuffer = !CB_GEM.options.CANVAS_FORCED_EMULATION_METHOD && CB_REM.BUFFER_RECOMMENDED;

	//Starts processing the sprites groups:
	CB_GEM.stopped = false;
	if (CB_GEM.DEBUG_MESSAGES) { CB_console("Starts processing graphic sprites scene ('CB_GraphicSpritesScene' object) constantly..."); }
	CB_GEM._processSpritesGroups(0);
}


//Stops the game loop:
CB_GEM.loopStop = function()
{
	//Stops processing the sprites groups:
	clearTimeout(CB_GEM._processSpritesGroups_timer);
	CB_GEM.stopped = true;
}


//Returns the current data of the game engine:
CB_GEM.getData_object = {};
CB_GEM.getData = function(stringify, avoidRenderingEngineData, avoidGraphicSpritesSceneData, propertiesToKeepGraphicSpritesSceneObject) //Note: to save/restore we should never forget the audio status.
{
	//Updates the internal object with the data:
	CB_GEM.getData_object.data = CB_GEM.data;
	CB_GEM.getData_object.REM_data = avoidRenderingEngineData ? null : CB_GEM.REM.getData(false, CB_GEM.graphicSpritesSceneObject, avoidGraphicSpritesSceneData, propertiesToKeepGraphicSpritesSceneObject);
	
	//Returns the data (stringified if desired):
	return stringify ? JSON.stringify(CB_GEM.getData_object) : CB_GEM.getData_object; //It could be a good idea to stringify functions ('JSON.stringify' method does not).
}


//Restores the given data into the game engine:
CB_GEM.setData = function(getDataObject, graphicSpritesSceneObject, avoidGraphicSpritesSceneData)
{
	if (typeof(getDataObject) === "undefined" || getDataObject === null || typeof(getDataObject) !== "object") { return false; }
	
	//Restores the given data:
	CB_GEM.data = getDataObject.data;
	CB_GEM.REM.setData(getDataObject.REM_data, graphicSpritesSceneObject);
	
	return true;
}


//TODO: A 'reset' method could be useful sometimes.


if (CB_GEM.DEBUG_MESSAGES) { CB_console("game_engine.js inserted in the document"); }