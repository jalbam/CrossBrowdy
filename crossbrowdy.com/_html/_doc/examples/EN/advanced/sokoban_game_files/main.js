//Path to the graphic rendering engine module:
var CB_GEM_PATH = CB_GEM_PATH || "../simple_game_engine_files/";

var CB_GEM_DEBUG_MESSAGES = true; //Shows debug messages.

//Adds the game engine module to CrossBrowdy:
var CB_GEM_MODULE_NEEDED_MODULES = {};
CB_GEM_MODULE_NEEDED_MODULES[CB_GEM_PATH + "game_engine_module.js"] = { load: true, mandatory: true, absolutePath: true };
CB_Modules.addNeededModule(CB_NAME, "GAME_ENGINE_MODULE", CB_GEM_MODULE_NEEDED_MODULES);

CB_init(main); //It will call the "main" function when ready


//This function will be called when CrossBrowdy is ready:
function main()
{
	CB_console("CrossBrowdy and all needed modules loaded. Starting game...");
	
	//Defines needed data:
	var goalsToNextLevel = 3;
	CB_GEM.data = //Data stored in the game engine module (can be exported to save the game status):
	{
		//Note: most of the data will be calculated automatically and dynamically.
		soundEnabled: true, //Set to false to disable sound.
		gameStarted: false,
		level: 1,
		player:
		{
			movementsLevel: 0,
			movementsTotal: 0,
			x: 0,
			y: 0
		}
	};
	
	//Sets the desired sprites scene data (can be modified dynamically):
	CB_GEM.spritesGroupsData =
	{
		//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_groups_1",
		srcWidth: 40,
		srcHeight: 40,
		data: { loop: true, clearPreviousFirst: true, onlyUseInMap: false },
		//Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups that will be used (their "parent" property will be set to point the current 'CB_GraphicSpritesScene' object which contains them):
		spritesGroups:
		[
			{
				id: "info",
				srcType: CB_GraphicSprites.SRC_TYPES.TEXT,
				top: 15,
				zIndex: 3,
				data:
				{
					fontSize: "16px",
					fontFamily: "courier",
					style: "#8800ff",
					fontWeight: "bold"
				},
				sprites: [ { id: "info_sprite" } ]
			},
			//'bottle_sprites' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "bottle_sprites",
				data:
				{
					rotationUseDegrees: true,
					onlyUseInMap: true,
					//Rotates the stone walls before drawing them:
					beforeDrawing:
						function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
						{
							//If it has been called for a 'CB_GraphicSprites' object:
							if (element.isSprites)
							{
								var rotations = [ 0, 180 ];
								this.getCurrent().data.rotation = rotations[(x + y) % rotations.length];
							}
							return this; //Same as 'element'. Must return the element to draw.
						}
				},
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'bottle_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "bottle_sprite",
						src: "img/bottle.gif"
					}
				]
			},
			//'cup_sprites' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "cup_sprites",
				data:
				{
					rotationUseDegrees: true,
					onlyUseInMap: true,
					//Rotates the stone walls before drawing them:
					beforeDrawing:
						function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
						{
							//If it has been called for a 'CB_GraphicSprites' object:
							if (element.isSprites)
							{
								var rotations = [ 0, 180 ];
								this.getCurrent().data.rotation = rotations[(x + y) % rotations.length];
							}
							return this; //Same as 'element'. Must return the element to draw.
						}
				},
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'cup_empty_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "cup_empty_sprite",
						src: "img/cup_empty.gif"
					},
					//'cup_filled_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "cup_filled_sprite",
						src: "img/cup_filled.gif"
					}
				]
			},
			//'stone_sprites' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "stone_sprites",
				src: "img/stone.gif",
				data:
				{
					rotationUseDegrees: true,
					onlyUseInMap: true,
					//Rotates the stone walls before drawing them:
					beforeDrawing:
						function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
						{
							//If it has been called for a 'CB_GraphicSprites' object:
							if (element.isSprites)
							{
								var rotations = [ 0, 180 ];
								this.getCurrent().data.rotation = rotations[(x + y) % rotations.length];
							}
							return this; //Same as 'element'. Must return the element to draw.
						}
				},
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'stone_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "stone_sprite"
					}
				]
			},
			//'player_sprites' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "player_sprites", //Identifier of the sprites group (also used for the 'CB_GraphicSprites' object). Optional but recommended. It should be unique. If not provided, it will be calculated automatically.
				width: 80, //Width of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.width || CB_GraphicSprites.WIDTH_DEFAULT.
				height: 80, //Height of the destiny. Unit agnostic (only numeric values allowed). Default: this.parent.height || CB_GraphicSprites.HEIGHT_DEFAULT.
				zIndex: 2, //The z-index for the destiny. Only numeric values allowed. Default: this.parent.zIndex || CB_GraphicSprites.ZINDEX_DEFAULT.
				//Object with any additional data desired which can be any kind:
				//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
				data: //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
				{
					onlyUseInMap: true,
					skipAfter: 500,
					pointerNext:
						function (sprite, canvasContext, CB_GraphicSpritesObject, drawingMap)
						{
							if (sprite.position % 2 === 0) { return sprite.position + 1; }
							else { return sprite.position - 1; }
						}
				},
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'player_down_1_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "player_down_1_sprite",
						src: "img/player_down_1.gif"
					},
					//'player_down_2_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "player_down_2_sprite",
						src: "img/player_down_2.gif"
					},
					//'player_up_1_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "player_up_1_sprite",
						src: "img/player_up_1.gif"
					},
					//'player_up_2_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "player_up_2_sprite",
						src: "img/player_up_2.gif"
					},
					//'player_left_1_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "player_left_1_sprite",
						src: "img/player_left_1.gif"
					},
					//'player_left_2_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "player_left_2_sprite",
						src: "img/player_left_2.gif"
					},
					//'player_right_1_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "player_right_1_sprite",
						src: "img/player_right_1.gif"
					},
					//'player_right_2_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "player_right_2_sprite",
						src: "img/player_right_2.gif"
					}
				]
			},
			//'map_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "map_group",
				srcType: CB_GraphicSprites.SRC_TYPES.MAP,
				data:
				{
					//References sprites or sub-sprites by their index or identifier. Define a "parentId" (parent identifier of the 'CB_GraphicSprites' object or of the 'CB_GraphicSprites.SPRITE_OBJECT' object) to improve performance.
					elementsData:
					{
						//Each property name is an alias which can be used in the map (in the "src" property).
						"@": //Main character (player):
						{
							id: "player_sprites"
						},
						"#": //Walls:
						{
							id: "stone_sprites"
						},
						"$": //Pieces to move:
						{
							id: "bottle_sprites"
						},
						"-": //Empty holes to put pieces in:
						{
							id: "cup_empty_sprite",
							parentId: "cup_sprites"
						},
						"*": //Holes with a piece inside:
						{
							id: "cup_filled_sprite",
							parentId: "cup_sprites"
						},
						"+": //Main character (player) above a hole:
						{
							id: "player_sprites"
						}
					},
					elementsWidth:
						function(alias, element, elementData, elementMapParent, elementLoopHeightDefault, x, y)
						{
							return ELEMENTS_WIDTH; //It can be either a number or a function returning a number. The function will be called before drawing the element (sprite or sub-sprite) in each loop.
						},
					elementsHeight:
						function(alias, element, elementData, elementMapParent, elementLoopHeightDefault, x, y)
						{
							return ELEMENTS_HEIGHT; //It can be either a number or a function returning a number. The function will be called before drawing the element (sprite or sub-sprite) in each loop.
						},
					//Renews the internal cache by creating a new copy of the cached element ('CB_GraphicSprites', 'CB_GraphicSprites.SPRITE_OBJECT' or 'CB_GraphicSprites.SUBSPRITE_OBJECT') every time it is rendered:
					renewCache: true //Necessary to resize the map when the screen size changes.
				},
				sprites:
				[
					//Maps with string aliases:
					//'map_current' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "map_current", //Current map which will be displayed (it will be modified according to the position of the player and the other elements).
						src: LEVELS[0]
					},
					//'map_1' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "map_1",
						src: LEVELS[0]
					},
					//'map_2' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "map_2",
						src: LEVELS[1]
					}
				]
			}
		]
	};
	

	//Defines the callbacks for the game loop:
	CB_GEM.onLoopStart = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop starts (before rendering the graphics):
	{
		//Manages input:
		manageInput();
		
		//If the game has not started, exits:
		if (!CB_GEM.data.gameStarted) { return; }
		//...otherwise, proceeds:
		else
		{
			//TODO.
		}
	};
	
	CB_GEM.onLoopEnd = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop ends (after rendering the graphics):
	{
		if (!CB_GEM.data.gameStarted) { return; }
		
		//TODO.
	};
	
	//Starts the game engine module:
	CB_GEM.begin
	(
		//onStart:
		function(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectBuffer, FPSSprites) //'FPSSprites' contains the 'CB_GraphicSprites.SPRITES_OBJECT' object used to display the FPS counter.
		{
			FPSSprites.setDisabled(false); //Set to true to hide FPS counter.
	
			resizeElements(graphicSpritesSceneObject, true); //Updates all visual elements according to the screen size.

			updateInfo(graphicSpritesSceneObject); //Shows the information for the first time.
	
			//Updates all when the screen is resized:
			CB_Screen.onResize(function() {	resizeElements(graphicSpritesSceneObject); updateInfo(graphicSpritesSceneObject); });
			
			CB_Elements.hideById("loading"); //Hides the loading message.
			CB_Elements.showById("start_button"); //Shows the start button.
		},
		
		//onError:
		function(error) { CB_console("Error: " + error); }
	);
}


//Starts the game:
function gameStart(graphicSpritesSceneObject)
{
	if (CB_GEM.data.gameStarted) { return; }

	graphicSpritesSceneObject = graphicSpritesSceneObject || CB_GEM.graphicSpritesSceneObject;
	if (!graphicSpritesSceneObject) { return; }
	
	//Hides the start button:
	CB_Elements.hideById("start_button");
	
	//Resets data:
	//TODO.
	
	//Updates all visual elements according to the screen size:
	resizeElements(graphicSpritesSceneObject, true);

	//Shows the information for the first time:
	updateInfo(graphicSpritesSceneObject);
	
	//Prepares the sound effects and plays one of them (recommended to do this through a user-driven event):
	prepareSoundFx(); //Prepares sound effects to be used later.
	playSoundFx("start");
	
	//Sets the game as started:
	CB_GEM.data.gameStarted = true; //When set to true, starts the game automatically as the game loops detect it.
}


//Ends the game:
function gameEnd(message)
{
	if (!CB_GEM.data.gameStarted) { return; }
		
	message = CB_trim(message);
	CB_GEM.data.gameStarted = false;
	CB_Elements.insertContentById("start_button", (message !== "" ? message + "<br />" : "") + "Start game!")
	CB_Elements.showById("start_button"); //Shows the start button again.
}


//Updates the information shown:
function updateInfo(graphicSpritesSceneObject)
{
	graphicSpritesSceneObject.getById("info").get(0).src =
		"Level: " + CB_GEM.data.level + "\n" +
		"Movements: " + CB_GEM.data.player.movementsLevel + " in the current level. " +
		"Total: " + CB_GEM.data.player.movementsTotal + "\n" +
		(!CB_Screen.isLandscape() ? "\nLandscape screen recommended!" : "");
}


//Resizes all visual elements according to the screen size:
var ELEMENTS_WIDTH = 40; //It will be updated automatically according to the screen size.
var ELEMENTS_HEIGHT = 40; //It will be updated automatically according to the screen size.
function resizeElements(graphicSpritesSceneObject, firstTime)
{
	if (graphicSpritesSceneObject instanceof CB_GraphicSpritesScene)
	{
		//Resizes the current map which is being displayed according to the new screen size:
		var mapCurrent = graphicSpritesSceneObject.getById("map_group").getById("map_current").src;
		if (CB_isArray(mapCurrent))
		{
			ELEMENTS_HEIGHT = CB_Screen.getWindowHeight() / mapCurrent.length;
			var maxWidthFound = 1;
			for (var x = 0; x < mapCurrent.length; x++)
			{
				if (mapCurrent.length && mapCurrent[x].length > maxWidthFound) { maxWidthFound = mapCurrent[x].length; }
			}
			ELEMENTS_WIDTH = CB_Screen.getWindowWidth() / maxWidthFound;
		}
	}
}


//Input management (some controllers can also fire keyboard events):
function manageInput()
{
	if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.ESC)) { gameEnd("Game aborted"); } //After pressing the ESC key, ends the game.
	else
	{
		//If return, space or a button (button 1, 2 or 3) or axis from any gamepad is pressed, starts the game (if it has not stared already):
		if (!CB_GEM.data.gameStarted && (CB_Keyboard.isKeyDown(CB_Keyboard.keys.ENTER) || CB_Keyboard.isKeyDown(CB_Keyboard.keys.SPACEBAR) || CB_Controllers.isButtonDown([1, 2, 3]) || CB_Controllers.getAxesDown().length > 0 || CB_Controllers.getAxesDown("", -1).length > 0))
		{
			gameStart(CB_GEM.graphicSpritesSceneObject);
			return;
		}
		
		//TODO.
	}
}


//Prepares sound effects:
var sfx = null; //Global object to play the sounds.
var prepareSoundFxExecuted = false;
function prepareSoundFx()
{
	if (prepareSoundFxExecuted) { return; }

	prepareSoundFxExecuted = true;
	
	var jsfxObject = CB_Speaker.getJsfxObject(); //Gets the 'jsfx' object.
	if (jsfxObject !== null)
	{
		//Defines the sound effects:
		var library =
		{
			"start":
				jsfx.Preset.Coin
			//TODO.
		};

		//Loads the sound effects:
		sfx = CB_AudioDetector.isAPISupported("WAAPI") ? jsfxObject.Live(library) : jsfxObject.Sounds(library); //Uses AudioContext (Web Audio API) if available.
	}
}


//Plays the desired sound effect (by its identifier):
function playSoundFx(id)
{
	if (!sfx || typeof(sfx[id]) !== "function") { return; }
	else if (!CB_GEM.data.soundEnabled) { return; }

	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	sfx[id]();
}