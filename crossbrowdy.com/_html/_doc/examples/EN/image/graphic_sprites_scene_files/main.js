CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	printMessage("Creating canvas...");
	
	//Creates the canvas:
	var onLoadCanvas = function()
	{
		printMessage("Canvas loaded!");

		//Gets the "context" object to start working with the canvas:
		var canvasContext = this.getContext();
		if (!canvasContext) { printMessage("ERROR: canvas context could not be obtained! Drawing cannot be performed."); return; }

		//Clears the canvas:
		this.clear();

		//Disables anti-aliasing to avoid problems with adjacent sprites:
		this.disableAntiAliasing();

		//Creates the sprites groups:
		createSpritesGroups();

		//Processes the sprites groups:
		processSpritesGroups(this, canvasContext);
	};
	myCanvas = new CB_Canvas
	(
		"my_canvas", //canvasId. Unique required parameter.
		"2d", //contextType. NOTE: some emulation methods only support "2d". Default: "2d".
		CB_Screen.getWindowWidth(), //canvasWidth. Use 'CB_Screen.getWindowWidth()' for complete width. Default: CB_Canvas.WIDTH_DEFAULT.
		250, //canvasHeight. Use 'CB_Screen.getWindowHeight()' for complete height. Default: CB_Canvas.HEIGHT_DEFAULT.
		onLoadCanvas, //onLoad.
		function(error) { printMessage("Canvas object problem! Error: " + error); } //onError.
	);
}


//Shows a message:
function printMessage(message)
{
	if (message === "") { CB_Elements.insertContentById("messages", ""); }
	else { message = message.indexOf("\n") === -1 ? message + "\n" : message; CB_Elements.appendContentById("messages", CB_nl2br(message)); }
	CB_Elements.id("messages").scrollTop = CB_Elements.id("messages").scrollHeight; //Scrolls to the bottom.
}


//Creates the sprites groups:
myGraphicSpritesScene = null; //It will store the 'CB_GraphicSpritesScene' globally.
function createSpritesGroups()
{
	//Defines the sprites groups information ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
	/*
		Note:
			1) Sprites groups, sprites and sub-sprites are always automatically ordered internally by their z-index (remember to use the 'setZIndex' method of each if you want to modify it). The elements of the scene will be rendered respecting this order.
			2) We will use 'duration' in the 'data' property to disable sprite or sub-sprite objects (if it is set to null, it will never be disabled).
			3) We will use 'skipAfter' in the 'data' property of a sprite to jump to the next one (if it is set to null, it will never jump automatically).
	*/
	var spritesGroupsData =
	{
		//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_groups_1", //Identifier of the sprites groups object (also used for the 'CB_GraphicSpritesScene' object). Optional but recommended. It should be unique. By default, it is generated automatically.
		srcWidth: 40, //The value for the "srcWidth" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.WIDTH_SOURCE_DEFAULT.
		srcHeight: 40, //The value for the "srcHeight" property which will be used as default if not provided (or the provided one was wrong) in the given 'CB_GraphicSprites.SPRITES_OBJECT' objects. Default: CB_GraphicSprites.HEIGHT_SOURCE_DEFAULT.
		data: { skipAfter: null, duration: null, loop: true, clearRect: false }, //Object with any additional data desired which can be any kind. Default: { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
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
				width: 180, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
				height: 160, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
				//Object with any additional data desired which can be any kind:
				//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
				data: { skipAfter: 600, clearRect: true }, //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
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
								left: 320, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: 180, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 40, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 40, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: 300 },
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
								data: { duration: null }
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
								left: 320, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: 180, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 40, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 40, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: 300 },
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
								left: 320, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: 180, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 40, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 40, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: 300 },
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
								left: 320, //Left (horizontal) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
								top: 180, //Top (vertical) position in the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
								width: 40, //Width of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
								height: 40, //Height of the destiny (inside the sprite). Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
								data: { duration: 300 },
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
				left: 100, //Left (horizontal) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.LEFT_DEFAULT.
				top: 80, //Top (vertical) position in the destiny (inside the sprites group). Unit agnostic (only numeric values allowed). Default: CB_GraphicSprites.TOP_DEFAULT.
				width: 160, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
				height: 160, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
				zIndex: 2, //The z-index for the destiny. Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
				data: { duration: 5000 },
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'ranisima_sprites_sprite_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "ranisima_sprites_sprite_1" //Identifier for the sprite. Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
					}
				]
			}
		]
	 };

	//Creates the graphic sprites object:
	myGraphicSpritesScene = new CB_GraphicSpritesScene(spritesGroupsData);	
}


//Processes the sprites groups:
function processSpritesGroups(CB_CanvasObject, canvasContext)
{
	//Perform an action (execute a function) for each 'CB_GraphicSprites' object (being able to introduce a delay between each call):
	printMessage(""); //Clears the messages.
	var sprite = null;
	myGraphicSpritesScene.forEach //Same as 'myGraphicSpritesScene.forEachGraphicSprites', 'myGraphicSpritesScene.executeAll' and 'myGraphicSpritesScene.executeFunctionAll'.
	(
		function(graphicSprites, position, graphicSpritesArray, delay) //functionEach.
		{
			//Shows information about the sprites groups object:
			printMessage("'CB_GraphicSprites' object in position #" + position + " (id: '" + this.id + "'):");
			
			sprite = this.getCurrent(); //Gets the current sprite (the one indicated by the pointer).
			printMessage("* Sprite object id: '" + sprite.id + "':");

			drawSprite(sprite, canvasContext); //Draws the sprite.
			
			printMessage("\n");
		},
		true //Loops using z-index order (ascending order).
	);

	//Calls itself again:
	setTimeout(function() { processSpritesGroups(CB_CanvasObject, canvasContext); }, 16); //Note that for processing sprites it is more recommended to use 'CB_symmetricCall' or 'requestAnimationFrame' instead of 'setTimeout'.
}


//Draws a sprite:
function drawSprite(sprite, canvasContext)
{
	//The "duration" for sprites indicates when the sprite must be disabled:
	if (sprite.data.duration !== null && sprite.getTimeElapsed() > sprite.data.duration)
	{
		//Disables the sprite and exits:
		sprite.setDisabled(true);
		canvasContext.clearRect(sprite.left, sprite.top, sprite.width, sprite.height);
		return;
	} 

	//The "skipAfter" for sprites indicates when it has to advance to the next one (if it is null, it will do it immediately):
	if (sprite.isDisabled() || sprite.data.skipAfter !== null && sprite.getTimeElapsed() > sprite.data.skipAfter) { sprite = sprite.setNext(true); } //Gets the next sprite (loops).
	
	//Draws the sprite:
	drawElement(sprite, canvasContext);
	
	//If it has sub-sprites, loops through them and draws them:
	if (sprite.subSprites && sprite.subSprites.length)
	{
		sprite.forEach //Same as 'sprite.executeAll' and 'sprite.executeFunctionAll'.
		(
			function(subSprite, position, graphicSpritesArray, delay)
			{
				printMessage("** Sub-sprite object in position #" + position + " (id: '" + this.id + "')" + ((subSprite.isDisabled()) ? " [DISABLED] (duration expired)" : ""));
				drawSubSprite(this, canvasContext); //Draws the sub-sprite.
			},
			true //Loops using z-index order (ascending order).
		);
	}
	//...otherwise, if it does not have sub-sprites:
	else
	{
		printMessage("** No sub-sprites.");
	}
}


//Draws a sub-sprite:
function drawSubSprite(subSprite, canvasContext)
{
	//If the sub-sprite is disabled, exits:
	if (subSprite.isDisabled()) { return; }
	
	//The "duration" for sub-sprites indicates when the sub-sprite must be disabled:
	if (subSprite.data.duration !== null && subSprite.parent.getTimeElapsed() > subSprite.data.duration)
	{
		//Disables the sub-sprite and exits:
		subSprite.setDisabled(true);
		canvasContext.clearRect(subSprite.left, subSprite.top, subSprite.width, subSprite.height);
		return;
	} 
	
	//Draws the sub-sprite:
	drawElement(subSprite, canvasContext);
}


//Draws an element (sprite or sub-sprite):
var _IMAGES_CACHE = {};
var _IMAGES_CACHE_ENABLED = true;
function drawElement(element, canvasContext)
{
	if (!element.src) { return; } //Exists if there is no source.
	var image = _IMAGES_CACHE[element.src];
	if (_IMAGES_CACHE_ENABLED && image)
	{
		drawImage(image, element, canvasContext);
	}
	else
	{
		image = new Image();
		image.onload = function()
		{
			drawImage(image, element, canvasContext);
		};
		image.src = element.src;
		_IMAGES_CACHE[element.src] = image;
	}
}


//Draws an image from an element (sprite or sub-sprite):
function drawImage(image, element, canvasContext)
{
	if (element.data.clearRect) { canvasContext.clearRect(element.left, element.top, element.width, element.height); } //If desired, clears the space it will use before drawing it.
	canvasContext.drawImage(image, element.srcLeft, element.srcTop, element.srcWidth, element.srcHeight, element.left, element.top, element.width, element.height);
}