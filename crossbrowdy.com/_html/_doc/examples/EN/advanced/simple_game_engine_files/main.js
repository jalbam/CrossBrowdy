/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

//Defines whether to shows debug messages or not:
var CB_GEM_DEBUG_MESSAGES = true;

//Adds the game engine module to CrossBrowdy:
CB_Modules.addNeededModule(CB_NAME, "GAME_ENGINE_MODULE", { "game_engine_module.js" : { load: true, mandatory: true, absolutePath: true } });


CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	CB_console("CrossBrowdy and all needed modules loaded. Starting game engine example...");
	
	//Sets the desired sprites scene data (can be modified dynamically):
	var pandaLeftDefault = 100;
	var pandaTopDefault = 100;
	var pandaWidthDefault = 100;
	var pandaHeightDefault = 100;
	CB_GEM.spritesGroupsData =
	{
		//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_groups_1", //Identifier of the sprites groups object (also used for the 'CB_GraphicSpritesScene' object). Optional but recommended. It should be unique. By default, it is generated automatically.
		srcWidth: 40, //The value for the "srcWidth" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
		srcHeight: 40, //The value for the "srcHeight" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
		data: { loop: true }, //Object with any additional data desired which can be any kind. Default: { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
		//Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups that will be used (their "parent" property will be set to point the current 'CB_GraphicSpritesScene' object which contains them):
		spritesGroups:
		[
			//'panda_sprites' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				
				id: "panda_sprites", //Identifier of the sprites group (also used for the 'CB_GraphicSprites' object). Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
				left: pandaTopDefault, //Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
				top: pandaTopDefault, //Top (vertical) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
				width: pandaWidthDefault, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
				height: pandaHeightDefault, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
				//Object with any additional data desired which can be any kind:
				//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
				data: { skipAfter: 500, positionAbsolute: true }, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
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
									duration: null
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
					}
				 ]
			}
		]
	};

	//Sets the desired options for the game engine module:
	CB_GEM.setOptions
	(
		{
			LOOP_REFRESH_RATE: 16, //A refresh rate of 16 is about 60 FPS (Frames Per Second) when the cycles per loop is set to 1. Default: 16.
			RENDERING_CYCLES_PER_LOOP: 1, //The number of rendering cycles per loop. It will affect the FPS.
			CANVAS_FORCED_EMULATION_METHOD: undefined, //Forces a canvas emulation mode which can be 'SILVERLIGHT', 'FLASH', 'DHTML' or 'VML' (testing purposes). Use null or undefined to disable it. Default: undefined.
			canvasId: "my_canvas", //Identifier for the canvas element. Default: 'my_canvas'.
			canvasBufferId: "my_canvas_buffer" //Identifier for the buffer canvas element. Default: 'my_canvas_buffer'.
		}
	);
	
	//Defines the callbacks for the game loop:
	CB_GEM.data = //Data stored in the game engine module (can be exported to save the game status):
	{
		pandaLeft: pandaLeftDefault,
		pandaTop: pandaTopDefault,
		pandaLeftPrevious: 0,
		pandaTopPrevious: 0,
		pandaWidth: pandaWidthDefault,
		pandaHeight: pandaHeightDefault,
		pixelsMovement: 5
	};
	var moving = false;
	var panda = null;
	CB_GEM.onLoopStart = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop starts, before rendering the graphics (if it returns false, it will skip rendering in this loop):
	{
		//Moves the panda according to the input received through the keyboard (and controllers that fire keyboard events):
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.UP)) { CB_GEM.data.pandaTop -= CB_GEM.data.pixelsMovement; }
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.DOWN)) { CB_GEM.data.pandaTop += CB_GEM.data.pixelsMovement; }
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.LEFT)) { CB_GEM.data.pandaLeft -= CB_GEM.data.pixelsMovement; }
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.RIGHT)) { CB_GEM.data.pandaLeft += CB_GEM.data.pixelsMovement; }
		
		panda = CB_GEM.graphicSpritesSceneObject.getById("panda_sprites");
		
		if (CB_GEM.data.pandaLeft < 0) { CB_GEM.data.pandaLeft = 0; }
		else if (CB_GEM.data.pandaLeft > CB_GEM.CB_CanvasObject.getWidth() - panda.getCurrent().width) { CB_GEM.data.pandaLeft = CB_GEM.CB_CanvasObject.getWidth() - panda.getCurrent().width; }
		if (CB_GEM.data.pandaTop < 0) { CB_GEM.data.pandaTop = 0; }
		else if (CB_GEM.data.pandaTop > CB_GEM.CB_CanvasObject.getHeight() - panda.getCurrent().height) { CB_GEM.data.pandaTop = CB_GEM.CB_CanvasObject.getHeight() - panda.getCurrent().height; }
		
		moving = false;
		if (CB_GEM.data.pandaLeft !== CB_GEM.data.pandaLeftPrevious) { panda.setPropertyCascade("left", CB_GEM.data.pandaLeft); moving = true; }
		if (CB_GEM.data.pandaTop !== CB_GEM.data.pandaTopPrevious) { panda.setPropertyCascade("top", CB_GEM.data.pandaTop); moving = true; }
		
		CB_GEM.data.pandaLeftPrevious = CB_GEM.data.pandaLeft;
		CB_GEM.data.pandaTopPrevious = CB_GEM.data.pandaTop;
		
		if (moving) { CB_GEM.data.pixelsMovement++ } //Accelerates.
		else { CB_GEM.data.pixelsMovement = 5; } //Restores normal speed.
	};
	
	CB_GEM.onLoopEnd = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop ends, after rendering the graphics (not executed if the 'CB_GEM.onLoopStart' function returned false):
	{
		//Changes the panda size according to whether it is moving or not:
		if (moving)
		{
			CB_GEM.data.pandaWidth = panda.getCurrent().width - 1;
			CB_GEM.data.pandaHeight = panda.getCurrent().height - 1;
		}
		else
		{
			CB_GEM.data.pandaWidth = pandaWidthDefault;
			CB_GEM.data.pandaHeight = pandaHeightDefault;
		}
		
		panda.setPropertyCascade("width", CB_GEM.data.pandaWidth);
		panda.setPropertyCascade("height", CB_GEM.data.pandaHeight);
	};
	
	//Sets some keyboard events (some controllers can also fire keyboard events):
	CB_Keyboard.onKeyDown
	(
		function(e, keyCode)
		{
			//After pressing the ESC key, stops or starts the game loop (depending on its current status):
			if (keyCode === CB_Keyboard.keys.ESC[0]) { gameLoopStartStop(); }
			//...otherwise, after pressing the SPACEBAR key, it will show the current data in the console:
			else if (keyCode === CB_Keyboard.keys.SPACEBAR[0]) { getGameData(); } //Not stringified.
		}
	);
	
	//Starts the game engine module:
	CB_GEM.begin
	(
		//onStart:
		function(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectBuffer, FPSSprites) //'FPSSprites' contains the 'CB_GraphicSprites.SPRITES_OBJECT' object used to display the FPS counter.
		{
			FPSSprites.setDisabled(false); //Set to true to hide FPS counter.
			FPSSprites.getCurrent().data.fontSize = "18px"; //Sets the font size for the FPS counter.
			FPSSprites.getCurrent().data.style = "#ff0000"; //Sets the font colour for the FPS counter.
		},
		
		//onError:
		function(error) { CB_console("Error: " + error); }
	);
}


//Starts the game loop if not started (is stopped) or stops it otherwise:
function gameLoopStartStop()
{
	if (CB_GEM.stopped) { CB_console("Starting game loop..."); CB_GEM.loopStart(); }
	else { CB_console("Stopping game loop..."); CB_GEM.loopStop(); }
}


//Function that prints the game data in the console:
function getGameData(stringified)
{
	CB_console("Showing current data (" + (stringified ? "stringified" : "object") + "):");
	var data = CB_GEM.getData(stringified);
	CB_console(data);
	alert(stringified ? data : JSON.stringify(data));
}