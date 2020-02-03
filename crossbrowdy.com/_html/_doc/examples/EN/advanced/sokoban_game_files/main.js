/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

//Path to the graphic rendering engine module:
var CB_GEM_PATH = CB_GEM_PATH || "../simple_game_engine_files/";

var CB_GEM_DEBUG_MESSAGES = false; //Defines whether to shows debug messages or not.


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
	//NOTE: most of the data will be calculated automatically and dynamically.
	CB_GEM.data = //Data stored in the game engine module (can be exported to save the game status):
	{
		//General data:
		soundEnabled: true, //Set to false to disable sound.
		musicEnabled: true, //Set to false to disable music.
		vibrationEnabled: true, //Set to false to disable sound.
		musicLoaded: false,
		musicChecked: false,
		gameStarted: false,
		level: 0,
		//Player data:
		player:
		{
			movementsLevel: 0,
			movementsTotal: 0,
			x: 0,
			y: 0,
			xPrevious: 0,
			yPrevious: 0
		},
		//Steps (movements) performed (to undo/redo them):
		steps:
		{
			pointer: 0, //Pointer to the current step (movement).
			data: [] //Array with the steps (movements) performed.
		}
	};
	
	//Defines the callback function to call before drawing an element to rotate it (it will be used in the "beforeDrawing" of some elements):
	var beforeDrawingRotate = function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
	{
		//If it has been called for a 'CB_GraphicSprites' object:
		if (element.isSprites)
		{
			var rotations = [ 0, 90, 180, 270 ];
			this.getCurrent().data.rotation = rotations[(x + y) % rotations.length];
		}
		return this; //Same as 'element'. Must return the element to draw.
	};

	//Sets the desired sprites scene data (can be modified dynamically):
	CB_GEM.spritesGroupsData =
	{
		//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_groups_1",
		srcWidth: 40,
		srcHeight: 40,
		data: { loop: true, onlyUseInMap: false },
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
					//Rotates the bottles before drawing them:
					beforeDrawing: beforeDrawingRotate
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
				data: { onlyUseInMap: true },
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
					beforeDrawing: beforeDrawingRotate
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
				//Object with any additional data desired which can be any kind:
				//NOTE: it will always have a "that" property pointing to the 'CB_GraphicSprites.SPRITES_OBJECT' object where it belongs to and a function in its "getThis" property returning the same value (added automatically).
				data: //Object with any additional data desired which can be any kind. Default: CB_combineJSON(this.parent.data, this.data) || this.parent.data || { 'that' : CB_GraphicSprites.SPRITES_OBJECT, 'getThis' = function() { return this.that; } }.
				{
					onlyUseInMap: true,
					skipAfter: 500,
					//Creates a loop to repeat sprites (grouped by pairs):
					pointerNext:
						function (sprite, canvasContext, CB_GraphicSpritesObject, drawingMap)
						{
							//If the index of the sprite is even, the next sprite will be the one in the next index:
							if (sprite.position % 2 === 0) { return sprite.position + 1; }
							//...otherwise, the next sprite will be the previous one:
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
						"+": //Holes with a piece inside:
						{
							id: "cup_filled_sprite",
							parentId: "cup_sprites"
						},
						"*": //Main character (player) above a hole:
						{
							id: "player_sprites"
						}
					},
					elementsWidth:
						function(alias, element, elementData, elementMapParent, elementLoopHeightDefault, x, y)
						{
							return ELEMENTS_WIDTH;
						},
					elementsHeight:
						function(alias, element, elementData, elementMapParent, elementLoopHeightDefault, x, y)
						{
							return ELEMENTS_HEIGHT;
						}
				},
				sprites:
				[
					//Maps with string aliases:
					//'map_current' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "map_current", //Current map which will be displayed (it will be modified according to the position of the player and the other elements).
						src: CB_Arrays.copy(LEVELS[0]) //Using a copy of the array as this one will be modified by the game when elements move.
					}
				]
			}
		]
	};
	
	//Defines the callbacks for the game loop:
	CB_GEM.onLoopStart = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop starts, before rendering the graphics (if it returns false, it will skip rendering in this loop):
	{
		//Manages input:
		manageInput();
	};
	
	CB_GEM.onLoopEnd = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop ends, after rendering the graphics (not executed if the 'CB_GEM.onLoopStart' function returned false):
	{
		if (!CB_GEM.data.gameStarted) { return; }
		
		//If the player has been moved:
		if (CB_GEM.data.player.xPrevious !== CB_GEM.data.player.x || CB_GEM.data.player.yPrevious !== CB_GEM.data.player.y)
		{
			CB_GEM.data.player.xPrevious = CB_GEM.data.player.x;
			CB_GEM.data.player.yPrevious = CB_GEM.data.player.y;

			//Updates the information shown:
			updateInfo(graphicSpritesSceneObject);
			
			//If the current map has all cups filled, jumps to the next level:
			var mapCurrent = graphicSpritesSceneObject.getById("map_group").getById("map_current").src;
			var allHolesFilled = true;
			for (var y = mapCurrent.length - 1; y >= 0; y--)
			{
				for (var x = mapCurrent[y].length - 1; x >= 0; x--)
				{
					if (mapCurrent[y][x] === "-" || mapCurrent[y][x] === "*") { allHolesFilled = false; break; } //An unfilled hole has been found (note that some variants could consider the level done when all bottles has been put in place).
				}
				if (!allHolesFilled) { break; }
			}

			if (allHolesFilled)
			{
				
				//Loads the next level (loops when final level is reached):
				loadLevel(CB_GEM.data.level + 1);
			}
		}
	};
	
	//Modifies the default refresh rate for the game loop (it will affect the FPS):
	CB_GEM.options.REFRESH_RATE = 33; //A refresh rate of 33 is about 30 FPS (Frames Per Second), which is good enough for this game.
	
	//Starts the game engine module:
	CB_GEM.begin
	(
		//onStart:
		function(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectBuffer, FPSSprites) //'FPSSprites' contains the 'CB_GraphicSprites.SPRITES_OBJECT' object used to display the FPS counter.
		{
			//Sets the events to the toolbar and its icons:
			var toolbarIconEvent = function()
			{
				if (this.id === "button_restart") { restartLevel("RESTART"); }
				else if (this.id === "button_undo") { stepUndo("STEP_UNDO"); }
				else if (this.id === "button_redo") { stepRedo("STEP_REDO"); }
				else if (this.id === "button_fullscreen") { fullScreenToggle(); }
			};
			var toolbarIconsIDs = [ "button_undo", "button_redo", "button_restart", "button_fullscreen" ]; //Identifiers of the toolbar icons.
			var toolbarIconElement = null;
			for (var x = toolbarIconsIDs.length - 1; x >= 0; x--)
			{
				toolbarIconElement = CB_Elements.id(toolbarIconsIDs[x]);
				if (toolbarIconElement !== null)
				{
					toolbarIconElement.style.draggable = false;
					toolbarIconElement.style.touchAction = "none";
					CB_Elements.contextMenuDisable(toolbarIconElement);
					CB_Elements.preventSelection(toolbarIconElement);
					CB_Events.on(toolbarIconElement, "mousedown", toolbarIconEvent);
				}
			}
			
			//Fills the level selector and set its events:
			var levelSelector = CB_Elements.id("level_selector");
			var levelOptionLoop = null;
			if (levelSelector !== null)
			{
				CB_Events.on(levelSelector, "change", function() { loadLevel(levelSelector.value || levelSelector.selectedIndex); });
				
				for (var x = 0; x < LEVELS.length; x++)
				{
					levelOptionLoop = document.createElement("option");
					levelOptionLoop.id = levelOptionLoop.name = levelOptionLoop.value = levelOptionLoop.text = levelOptionLoop.textContent = levelOptionLoop.innerText = x;
					levelSelector.appendChild(levelOptionLoop);
				}
				
				levelSelector.disabled = true; //At first, it will be disabled (since the game has not started yet).
			}

			//Sets the events to the screen controls:
			var screenControls = CB_Elements.id("controls");
			if (screenControls !== null)
			{
				screenControls.style.draggable = false;
				screenControls.style.touchAction = "none";
				CB_Elements.contextMenuDisable(screenControls);
				CB_Elements.preventSelection(screenControls);
			}
			var movePlayerButtonEvent = function() { if (this.id) { manageInput(this.id.replace("screen_button_", "").toUpperCase()); } };
			var screenButtonsIDs = [ "screen_button_up", "screen_button_down", "screen_button_left", "screen_button_right" ]; //Identifiers of the screen buttons.
			var buttonElement = null;
			for (var x = screenButtonsIDs.length - 1; x >= 0; x--)
			{
				buttonElement = CB_Elements.id(screenButtonsIDs[x]);
				if (buttonElement !== null)
				{
					buttonElement.style.draggable = false;
					buttonElement.style.touchAction = "none";
					CB_Elements.contextMenuDisable(buttonElement);
					CB_Elements.preventSelection(buttonElement);
					CB_Events.on(buttonElement, "mousedown", movePlayerButtonEvent);
				}
			}
			
			FPSSprites.setDisabled(false); //Set to true to hide FPS counter.
	
			resizeElements(graphicSpritesSceneObject); //Updates all visual elements according to the screen size.

			updateInfo(graphicSpritesSceneObject); //Shows the information for the first time.
	
			//Updates all when the screen is resized or changes its orientation:
			CB_GEM.onResize = function(graphicSpritesSceneObject, CB_REM_dataObject, CB_CanvasObject, CB_CanvasObjectBuffer)
			{
				resizeElements(graphicSpritesSceneObject);
				updateInfo(graphicSpritesSceneObject);
			};
			
			//If possible, sets the touch events (when swiping):
			var HammerJS = CB_Touch.getHammerJSObject();
			if (HammerJS !== null)
			{
				HammerJS = new HammerJS(document);
				HammerJS.on("swipeup", function(e) { CB_console("Swipe UP! Scale: " + e.scale); manageInput("UP"); });
				HammerJS.on("swipedown", function(e) { CB_console("Swipe DOWN! Scale: " + e.scale); manageInput("DOWN"); });
				HammerJS.on("swipeleft", function(e) { CB_console("Swipe LEFT! Scale: " + e.scale); manageInput("LEFT"); });
				HammerJS.on("swiperight", function(e) { CB_console("Swipe RIGHT! Scale: " + e.scale); manageInput("RIGHT"); });
				HammerJS.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
			}

			CB_Elements.hideById("loading"); //Hides the loading message.
			
			//If music is enabled, shows the music loader:
			if (CB_GEM.data.musicEnabled)
			{
				CB_Events.removeByName(CB_Elements.id("button_load_check_music"), "click"); //Removes the previous event handler from the button (if any).
				CB_Events.on(CB_Elements.id("button_load_check_music"), "click", prepareMusic); //Attaches the event to the button to load the music.
				CB_Elements.showById("music_loader_checker"); //Shows the music loader.
			}
			//...otherwise, if music is disabled, shows the start button directly:
			else
			{
				CB_Elements.showById("start_button"); //Shows the start button.
			}
			
			//Sets the event for the debug checkbox:
			var debugCheckbox = CB_Elements.id("debug_checkbox");
			if (debugCheckbox !== null)
			{
				debugCheckbox.checked = !!CB_GEM_DEBUG_MESSAGES;
				CB_Events.on(debugCheckbox, "change", function() { CB_GEM_DEBUG_MESSAGES = !!debugCheckbox.checked; updateInfo(graphicSpritesSceneObject); });
			}
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
	
	//Loads the first level and resets any data:
	loadLevel(0, true);
	
	//Prepares the sound effects and plays one of them (recommended to do this through a user-driven event):
	try
	{
		prepareSoundFx(); //Prepares sound effects to be used later.
		playSoundFx("start");
	}
	catch(E)
	{
		CB_console("Error preparing sounds or playing sound with 'start' ID: " + E);
		CB_GEM.data.soundEnabled = false; //If it fails, disables the sound.
	}

	CB_Device.Vibration.start(100); //Makes the device vibrate.

	//Enables the level selector:
	var levelSelector = CB_Elements.id("level_selector");
	if (levelSelector !== null)
	{
		levelSelector.disabled = false;
	}

	//Sets the game as started:
	CB_GEM.data.gameStarted = true; //When set to true, starts the game automatically as the game loops detect it.
}


//Ends the game:
function gameEnd(message)
{
	if (!CB_GEM.data.gameStarted) { return; }

	//Disables the level selector:
	var levelSelector = CB_Elements.id("level_selector");
	if (levelSelector !== null)
	{
		levelSelector.disabled = true;
	}
		
	message = CB_trim(message);
	CB_GEM.data.gameStarted = false;
	CB_Elements.insertContentById("start_button", (message !== "" ? message + "<br />" : "") + "Start game!")
	CB_Elements.showById("start_button"); //Shows the start button again.
}


//Loads the desired level:
function loadLevel(level, resetAllMovements)
{
	//Sanitizes the level number:
	level = level || 0;
	if (level < 0) { level = 0; }
	level %= LEVELS.length; //When the number given is bigger than the levels, it will start again from the beginning.
	
	//Resets the data:
	CB_GEM.data.level = level;
	CB_GEM.data.player.movementsLevel = 0;
	if (resetAllMovements) { CB_GEM.data.player.movementsTotal = 0; }
	
	//Selects the corresponding level in the level selector:
	var levelSelector = CB_Elements.id("level_selector");
	if (levelSelector !== null)
	{
		levelSelector.value = levelSelector.selectedIndex = level;
		if (levelSelector.options && levelSelector.options[level]) { levelSelector.options[level].selected = true; }
		
		//Blurs the level selector (just in case it was selected):
		if (typeof(levelSelector.blur) === "function")
		{
			CB_console("Blurring level selector...");
			levelSelector.blur();
		}
	}
	
	//Loads the new map:
	CB_GEM.graphicSpritesSceneObject.getById("map_group").getById("map_current").src = CB_Arrays.copy(LEVELS[level]); //Using a copy of the array as this one will be modified by the game when elements move.
	
	//Finds and updates the position of the player:
	updatePlayerPosition(LEVELS[level]);
	
	//Resets and stores the data of the current map status as the first step (movement):
	CB_GEM.data.steps.pointer = 0;
	CB_GEM.data.steps.data = [];
	
	//Stores the data of the current position(to be able to undo it later):
	stepStore();
	
	//Updates all visual elements according to the screen size:
	resizeElements(CB_GEM.graphicSpritesSceneObject);

	//Shows the information for the first time:
	updateInfo(CB_GEM.graphicSpritesSceneObject);
	
	//Plays the song corresponding to the level:
	playMusic(songTitles[level % songTitles.length]);
}


//Restarts a level:
function restartLevel()
{
	CB_console("Restarting level " + CB_GEM.data.level + "...");
	loadLevel(CB_GEM.data.level);
}


//Updates the information shown:
function updateInfo(graphicSpritesSceneObject)
{
	graphicSpritesSceneObject.getById("info").get(0).src =
		"Level: " + CB_GEM.data.level + "\n" +
		"Movements:\n" +
			" Current level: " + CB_GEM.data.player.movementsLevel + "\n" +
			" Total: " + CB_GEM.data.player.movementsTotal +
		(!CB_Screen.isLandscape() ? "\n\nLandscape screen recommended!" : "") +
		(
			CB_GEM_DEBUG_MESSAGES ?
				"\n\nPlayer coordinates: " + CB_GEM.data.player.x + "," + CB_GEM.data.player.y + " (previous: " + CB_GEM.data.player.xPrevious + "," + CB_GEM.data.player.yPrevious + ")" +
				"\nSteps stored (length): " + CB_GEM.data.steps.data.length + " (pointer: " + CB_GEM.data.steps.pointer + ")"
			: ""
		);
}


//Resizes all visual elements according to the screen size:
var ELEMENTS_WIDTH = 40; //It will be updated automatically according to the screen size.
var ELEMENTS_HEIGHT = 40; //It will be updated automatically according to the screen size.
function resizeElements(graphicSpritesSceneObject)
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
			ELEMENTS_WIDTH = ELEMENTS_HEIGHT = Math.min(ELEMENTS_WIDTH, ELEMENTS_HEIGHT);
			graphicSpritesSceneObject.getById("map_group").getById("map_current").left = (CB_Screen.getWindowWidth() - ELEMENTS_WIDTH * maxWidthFound) / 2;
			graphicSpritesSceneObject.getById("map_group").getById("map_current").top = (CB_Screen.getWindowHeight() - ELEMENTS_HEIGHT * mapCurrent.length) / 2;
		}
		
		//Resizes the FPS and the information text:
		var fontSize = parseInt(Math.min(CB_Screen.getWindowWidth(), CB_Screen.getWindowHeight()) * 0.07) + "px";
		CB_GEM.graphicSpritesSceneObject.getById("fps_group").getById("fps").data.fontSize = parseInt(fontSize) / 1.5 + "px";
		CB_GEM.graphicSpritesSceneObject.getById("info").get(0).top = parseInt(fontSize) / 2;
		CB_GEM.graphicSpritesSceneObject.getById("info").get(0).data.fontSize = parseInt(fontSize) / 2.5 + "px";
	}

	//Resizes the toolbar and its icons:
	var toolbar = CB_Elements.id("toolbar");
	var toolbarIconMargin = parseInt(Math.min(CB_Screen.getWindowWidth(), CB_Screen.getWindowHeight()) * 0.08) + "px";
	if (toolbar !== null)
	{
		toolbar.style.right = toolbarIconMargin;
		toolbar.style.top = toolbarIconMargin;
	}
	var toolbarIconsIDs = [ "button_undo", "button_redo", "button_restart", "button_fullscreen", "level_selector" ]; //Identifiers of the toolbar icons.
	var toolbarIconElement = null;
	var toolbarIconWidthAndHeight = parseInt(Math.min(CB_Screen.getWindowWidth(), CB_Screen.getWindowHeight()) * 0.12) + "px";
	for (var x = toolbarIconsIDs.length - 1; x >= 0; x--)
	{
		toolbarIconElement = CB_Elements.id(toolbarIconsIDs[x]);
		if (toolbarIconElement !== null)
		{
			
			toolbarIconElement.style.width = toolbarIconWidthAndHeight;
			toolbarIconElement.style.height = toolbarIconElement.style.lineHeight = toolbarIconWidthAndHeight;
			
			if (toolbarIconElement.id === "level_selector")
			{
				toolbarIconElement.style.fontSize = toolbarIconElement.style.lineHeight = parseInt(toolbarIconWidthAndHeight) / 4 + "px";
			}
		}
	}
	
	//Resizes the screen controls:
	var screenControls = CB_Elements.id("controls");
	if (screenControls !== null)
	{
		screenControls.style.right = toolbarIconMargin;
		screenControls.style.bottom = toolbarIconMargin;
	}
	var screenButtonsIDs = [ "screen_button_up", "screen_button_down", "screen_button_left", "screen_button_right" ]; //Identifiers of the screen buttons.
	var buttonElement = null;
	for (var x = screenButtonsIDs.length - 1; x >= 0; x--)
	{
		buttonElement = CB_Elements.id(screenButtonsIDs[x]);
		if (buttonElement !== null)
		{
			buttonElement.style.width = toolbarIconWidthAndHeight;
			buttonElement.style.height = buttonElement.style.lineHeight = toolbarIconWidthAndHeight;
		}
	}
	
	//Resizes the font of the start button:
	var startButton = CB_Elements.id("start_button");
	if (startButton !== null) { startButton.style.fontSize = parseInt(toolbarIconWidthAndHeight) / 4 + "px"; }
}


//Input management (some controllers can also fire keyboard events):
var _inputProcessedLastTime = 0;
var _playerIgnoreInputMs = 150; //Number of milliseconds that the input will be ignored after the player has been moved (to avoid moving or processing the input too fast).
function manageInput(action)
{
	//If not enough time has been elapsed since the last movement, exits (to avoid moving or processing the input too fast):
	if (CB_Device.getTiming() < _inputProcessedLastTime + _playerIgnoreInputMs) { return; }

	//If the game has not started:
	if (!CB_GEM.data.gameStarted)
	{
		//If return, space or a button (button 1, 2 or 3) or axis from any gamepad is pressed, starts the game:
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.ENTER) || CB_Keyboard.isKeyDown(CB_Keyboard.keys.SPACEBAR) || CB_Controllers.isButtonDown([1, 2, 3]) || CB_Controllers.getAxesDown().length > 0 || CB_Controllers.getAxesDown("", -1).length > 0)
		{
			if (!CB_GEM.data.musicEnabled || CB_GEM.data.musicLoaded && CB_GEM.data.musicChecked) { gameStart(CB_GEM.graphicSpritesSceneObject); }
			else if (CB_GEM.data.musicLoaded) { checkMusic(); }
			else { prepareMusic(); }
			
			_inputProcessedLastTime = CB_Device.getTiming(); //As we have processed the input, updates the time with the new one (to avoid moving or processing the input too fast).
			
			return;
		}
	}
	//...otherwise, if the game has started, manages the input to move the player (if possible):
	else
	{
		var actionPerformed = false;
		
		//After pressing the ESC key, ends the game:
		if (action === "ABORT" || CB_Keyboard.isKeyDown(CB_Keyboard.keys.ESC) || CB_Controllers.isButtonDown(9))
		{
			gameEnd("Game aborted");
			actionPerformed = true;
		}
		//...otherwise, if we want to go to the previous level, goes there:
		else if (action === "PREVIOUS_LEVEL" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.O]) || CB_Controllers.isButtonDown(4) || CB_Controllers.isButtonDown(7))
		{
			loadLevel(CB_GEM.data.level > 0 ? CB_GEM.data.level - 1 : 0);
			actionPerformed = true;
		}
		//...otherwise, if we want to go to the next level, goes there:
		else if (action === "NEXT_LEVEL" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.P]) || CB_Controllers.isButtonDown(5) || CB_Controllers.isButtonDown(6))
		{
			loadLevel(CB_GEM.data.level < LEVELS.length -1 ? CB_GEM.data.level + 1 : LEVELS.length - 1); //It will not cycle (when reaches last level, will not go to the first one).
			actionPerformed = true;
		}
		//...otherwise, if we want to restart the level, restarts it:
		else if (action === "RESTART" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.R, CB_Keyboard.keys.F9]) || CB_Controllers.isButtonDown(3))
		{
			restartLevel();
			actionPerformed = true;
		}
		//...otherwise, if we want to undo a step, undoes it (if possible):
		else if (action === "STEP_UNDO" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.Z, CB_Keyboard.keys.U, CB_Keyboard.keys.F2]) || CB_Controllers.isButtonDown(1))
		{
			stepUndo();
			actionPerformed = true;
		}
		//...otherwise, if we want to repeat a step, repeats it (if possible):
		else if (action === "STEP_REDO" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.Y, CB_Keyboard.keys.N, CB_Keyboard.keys.F4]) || CB_Controllers.isButtonDown(2))
		{
			stepRedo();
			actionPerformed = true;
		}
		//...otherwise, if we want to toggle full screen, we try it:
		//NOTE: some browsers will fail to enable full screen mode if it is not requested through a user-driven event (as "onClick", "onTouchStart", etc.).
		else if (action === "FULL_SCREEN_TOGGLE" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.F]) || CB_Controllers.isButtonDown(8))
		{
			fullScreenToggle();
			actionPerformed = true;
		}
		//...otherwise, if we want to focus the level selector, we do it:
		else if (action === "FOCUS_LEVEL_SELECTOR" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.L, CB_Keyboard.keys.J, CB_Keyboard.keys.ENTER]) || CB_Controllers.isButtonDown(0))
		{
			var levelSelector = CB_Elements.id("level_selector");
			if (levelSelector !== null && typeof(levelSelector.focus) === "function")
			{
				CB_console("Focusing level selector...");
				levelSelector.focus();
				actionPerformed = true;
			}
		}
		
		//If an action has performed already, just exits:
		if (actionPerformed)
		{
			_inputProcessedLastTime = CB_Device.getTiming(); //As we have processed the input, updates the time with the new one (to avoid moving or processing the input too fast).
			return;
		}
		
		//Manages player movement:
		var mapCurrent = CB_GEM.graphicSpritesSceneObject.getById("map_group").getById("map_current").src;

		//Position where the player will be moved to (if possible):
		var xDestiny = CB_GEM.data.player.x;
		var yDestiny = CB_GEM.data.player.y;
		
		//Position where the piece would be moved to (in the case that there was one piece or a hole with a piece inside in the destiny):
		var xDestinyPiece = xDestiny;
		var yDestinyPiece = yDestiny;
		
		//Up:
		if (action === "UP" || CB_Keyboard.isKeyDown([CB_Keyboard.keys.UP, CB_Keyboard.keys.W]) || CB_Controllers.isAxisDown(1, "", -1))
		{
			if (CB_GEM.data.player.y > 0)
			{
				yDestiny = CB_GEM.data.player.y - 1;
				if (yDestiny > 1) { yDestinyPiece = yDestiny - 1; }
				action = "UP";
			}
		}
		//Down:
		else if (action === "DOWN" || CB_Keyboard.isKeyDown([CB_Keyboard.keys.DOWN, CB_Keyboard.keys.S]) || CB_Controllers.isAxisDown(1))
		{
			if (CB_GEM.data.player.y < mapCurrent.length - 1)
			{
				yDestiny = CB_GEM.data.player.y + 1;
				if (yDestiny < mapCurrent.length - 1) { yDestinyPiece = yDestiny + 1; }
				action = "DOWN";
			}
		}
		//Left:
		else if (action === "LEFT" || CB_Keyboard.isKeyDown([CB_Keyboard.keys.LEFT, CB_Keyboard.keys.A]) || CB_Controllers.isAxisDown(0, "", -1))
		{
			if (CB_GEM.data.player.x > 0)
			{
				xDestiny = CB_GEM.data.player.x - 1;
				if (xDestiny > 0) { xDestinyPiece = xDestiny - 1; }
				action = "LEFT";
			}
		}
		//Right:
		else if (action === "RIGHT" || CB_Keyboard.isKeyDown([CB_Keyboard.keys.RIGHT, CB_Keyboard.keys.D]) || CB_Controllers.isAxisDown(0))
		{
			if (CB_GEM.data.player.x < mapCurrent[CB_GEM.data.player.y].length - 1)
			{
				xDestiny = CB_GEM.data.player.x + 1;
				if (xDestiny < mapCurrent[CB_GEM.data.player.y].length - 1) { xDestinyPiece = xDestiny + 1; }
				action = "RIGHT";
			}
		}

		//If the destiny position is different from the current one (we want to move the player):
		if (xDestiny !== CB_GEM.data.player.x || yDestiny !== CB_GEM.data.player.y)
		{
			//Checks whether it is possible to move the player or not:
			var playerCanMove = false;
			var destinyHasPieceToMove = false;
			var cellDestiny = mapCurrent[yDestiny][xDestiny];
			switch (cellDestiny)
			{
				//If the destiny has a blank space (nothing) or an empty hole, the player can be moved:
				case " ": case "-":
					playerCanMove = true;
				break;
				//...otherwise, if the destiny has a piece or a hole with a piece inside:
				case "$": case "+":
					//If there is a blank space, the player can be moved:
					if ((xDestinyPiece !== CB_GEM.data.player.x || yDestinyPiece !== CB_GEM.data.player.y) && (mapCurrent[yDestinyPiece][xDestinyPiece] === " " || mapCurrent[yDestinyPiece][xDestinyPiece] === "-"))
					{
						playerCanMove = true;
						destinyHasPieceToMove = true;
					}
				break;
			}

			//If possible, moves the player:
			if (playerCanMove)
			{
				//If there is a piece to move, also moves it:
				if (destinyHasPieceToMove)
				{
					mapCurrent[yDestinyPiece][xDestinyPiece] = mapCurrent[yDestinyPiece][xDestinyPiece] === "-" ? "+" : "$"; //Has in mind whether there was an empty hole or a blank space in the destiny of the piece to move.
					
					//Reproduces the corresponding sound, depending on whether a hole was filled or not:
					if (mapCurrent[yDestinyPiece][xDestinyPiece] === "+") { playSoundFx("hole_filled"); }
					else { playSoundFx("piece_moving"); }
				}
				mapCurrent[CB_GEM.data.player.y][CB_GEM.data.player.x] = mapCurrent[CB_GEM.data.player.y][CB_GEM.data.player.x] === "@" ? " " : "-"; //Has in mind whether there was an empty hole or not behind the player before moving.
				mapCurrent[yDestiny][xDestiny] = mapCurrent[yDestiny][xDestiny] === "-" || mapCurrent[yDestiny][xDestiny] === "+" ? "*" : "@"; //Has in mind whether there is an empty hole or not in the new position.
				CB_GEM.data.player.x = xDestiny;
				CB_GEM.data.player.y = yDestiny;
				_inputProcessedLastTime = CB_Device.getTiming(); //As we have processed the input, updates the time with the new one (to avoid moving or processing the input too fast).
				
				//Changes the sprite of the player (in the 'CB_GraphicSpritesScene' object being used by the current map):
				CB_REM._MAP_ELEMENTS_CACHE["map_current"].CB_GraphicSpritesSceneObject.getById("player_sprites").setPointer(CB_GEM.graphicSpritesSceneObject.getById("player_sprites").getById("player_" + action.toLowerCase() + "_1_sprite").position);
				
				//Increases the movement counters:
				CB_GEM.data.player.movementsLevel++;
				CB_GEM.data.player.movementsTotal++;
				
				//Stores the data of the step (movement) which has been performed (to be able to undo/redo it later):
				stepStore();
			}
			//...otherwise, if it is not possible to move:
			else
			{
				if (CB_GEM.data.vibrationEnabled) { CB_Device.Vibration.start(100); } //Makes the device vibrate, if desired.
				playSoundFx("cannot_move"); //Reproduces the corresponding sound.
			}
		}
	}
}


//Stores a step (movement) data:
function stepStore()
{
	CB_console("Saving movement (step) data for #" + CB_GEM.data.steps.pointer + "...");
	
	//Stores the data of the step (movement) which is being performed (to be able to undo/redo later):
	CB_GEM.data.steps.data = CB_GEM.data.steps.data.slice(0, CB_GEM.data.steps.pointer); //Removes any possible further steps stored.
	CB_GEM.data.steps.data[CB_GEM.data.steps.pointer] =
	{
		map: CB_Arrays.copy(CB_GEM.graphicSpritesSceneObject.getById("map_group").getById("map_current").src),
		player:
		{
			x: CB_GEM.data.player.x,
			y: CB_GEM.data.player.y,
			xPrevious: CB_GEM.data.player.xPrevious,
			yPrevious: CB_GEM.data.player.yPrevious
		}
	};
	
	CB_GEM.data.steps.pointer = CB_GEM.data.steps.data.length;
	CB_console("Movement (step) data pointer set to " + CB_GEM.data.steps.pointer);
}


//Undoes a step (movement):
function stepUndo()
{
	CB_console("Trying to undo last step (movement)...");
	
	if (CB_GEM.data.steps.pointer <= 1) { CB_console("No more steps (movements) to undo!"); return; }

	//Loads the data of the previous step:
	var dataLoaded = stepLoadData(CB_GEM.data.steps.pointer - 2);
	
	//If the data was loaded, decreases the step (movement) pointer:
	if (dataLoaded)
	{
		//Decreases the movement counters:
		CB_GEM.data.player.movementsLevel--;
		CB_GEM.data.player.movementsTotal--;
		
		//Decreases the step (movement) pointer:
		CB_GEM.data.steps.pointer--;
		
		CB_console("Movement (step) data pointer set to " + CB_GEM.data.steps.pointer);
	}
	else { CB_console("It was not be possible to load the data for #" + (CB_GEM.data.steps.pointer - 2) + "."); }
}


//Redoes a step (movement):
function stepRedo()
{
	CB_console("Trying to redo last step (movement)...");
	
	if (CB_GEM.data.steps.pointer >= CB_GEM.data.steps.data.length) { CB_console("No more steps (movements) to redo!"); return; }
	
	//Loads the data of the current pointer:
	var dataLoaded = stepLoadData(CB_GEM.data.steps.pointer);
	
	//If the data was loaded, increases the step (movement) pointer:
	if (dataLoaded)
	{
		//Increases the movement counters:
		CB_GEM.data.player.movementsLevel++;
		CB_GEM.data.player.movementsTotal++;

		//Increases the step (movement) pointer:
		CB_GEM.data.steps.pointer++;
		
		CB_console("Movement (step) data pointer set to " + CB_GEM.data.steps.pointer);
	}
	else { CB_console("It was not be possible to load the data for #" + CB_GEM.data.steps.pointer + "."); }
}


//Loads the step (movement) data desired:
function stepLoadData(pointer)
{
	if (typeof(pointer) === "undefined" || pointer === null) { pointer = CB_GEM.data.steps.pointer; }
	
	CB_console("Trying to load data from step #" + pointer + "...");
	
	var stepData = CB_GEM.data.steps.data[pointer];
	//If there is no data, exits:
	if (!stepData) { CB_console("Data from step #" + pointer + " not found!"); return false; }
	//...otherwise, if there is a whole map stored, restores it and exits:
	else if (CB_isArray(stepData.map) && stepData.player)
	{
		CB_console("Restoring whole map for step #" + pointer + "...");
		CB_GEM.graphicSpritesSceneObject.getById("map_group").getById("map_current").src = CB_Arrays.copy(stepData.map);
		CB_console("Restoring coordinates: " + stepData.player.x + "," + stepData.player.y + " (previous: " + stepData.player.xPrevious + "," + stepData.player.yPrevious + ")...");
		CB_GEM.data.player.x = stepData.player.x;
		CB_GEM.data.player.y = stepData.player.y;
		CB_GEM.data.player.xPrevious = stepData.player.xPrevious;
		CB_GEM.data.player.yPrevious = stepData.player.yPrevious;
		return true;
	}
	
	return false;
}


//Finds and updates the position of the player in the given map:
function updatePlayerPosition(mapArray)
{
	CB_GEM.data.player.x = CB_GEM.data.player.xPrevious = 0;
	CB_GEM.data.player.y = CB_GEM.data.player.yPrevious = 0;
	
	var positionFound = false;
	
	if (CB_isArray(mapArray))
	{
		for (var y = mapArray.length - 1; y >= 0; y--)
		{
			if (CB_isArray(mapArray[y]))
			{
				for (var x = mapArray[y].length - 1; x >= 0; x--)
				{
					//Player found:
					if (mapArray[y][x] === "@" || mapArray[y][x] === "*")
					{
						CB_GEM.data.player.x = x;
						CB_GEM.data.player.y = y;
						positionFound = true;
						break;
					}
				}
			}
			if (positionFound) { break; }
		}
	}
	
	return positionFound;
}


//Skips music loader (to play silent mode):
function skipLoadingMusic()
{
	CB_console("Skipping loading music...");
	CB_GEM.data.musicEnabled = false;
	CB_Elements.hideById("music_loader_checker"); //Hides the music loader.
	CB_Elements.showById("start_button"); //Shows the start button.
}


//Prepares sound effects:
var sfx = null; //Global object to play the sounds.
var prepareSoundFxExecuted = false;
function prepareSoundFx(forceReload)
{
	if (!forceReload && prepareSoundFxExecuted) { return; }

	prepareSoundFxExecuted = true;

	CB_console("Preparing sound FX" + (forceReload ? " (forcing reload)" : "") + "...");
	
	var jsfxObject = CB_Speaker.getJsfxObject(); //Gets the 'jsfx' object.
	if (jsfxObject !== null)
	{
		//Defines the sound effects:
		var library =
		{
			"start":
				jsfx.Preset.Coin,
			"cannot_move":
				{ "Volume": { "Sustain": 0.05, "Decay": 0.2, "Punch": 1, "Master": 0.25 } },
			"piece_moving":
				{
					"Generator": { "Func": "noise", "A": 0.89, "B": 1 },
					"Volume": { "Sustain": 0.15, "Decay": 0.051, "Punch": 0.11, "Master": 0.23, "Attack": 0.241 }
				},
			"hole_filled":
				{
					"Frequency": { "Start": 1239 },
					"Generator": { "Func": "saw" },
					"Phaser": { "Offset": 0.56, "Sweep": -0.92 },
					"Volume": { "Master": 0.35, "Sustain": 0, "Decay": 0.321 }
				}
		};

		//Loads the sound effects:
		sfx = CB_AudioDetector.isAPISupported("WAAPI") ? jsfxObject.Live(library) : jsfxObject.Sounds(library); //Uses AudioContext (Web Audio API) if available.
	}
}


//Plays the desired sound effect (by its identifier):
function playSoundFx(id)
{
	if (!CB_GEM.data.soundEnabled) { return; }
	else if (!sfx || typeof(sfx[id]) !== "function")
	{
		CB_console("Sound FX '" + id + "' cannot be played! An user-driven event might be needed to be fired before being able to play sounds.");
		prepareSoundFx(true); //Forces reloading sounds.
		if (!sfx || typeof(sfx[id]) !== "function") { return; }
	}

	CB_console("Playing sound FX: " + id);

	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	sfx[id]();
}


//Prepares background music:
var audioFileSpritesPool = null; //Global 'CB_AudioFileSpritesPool' object to play the music.
var songTitles = []; //Array to keep the title of all the loaded songs.
var prepareMusicExecuted = false;
function prepareMusic()
{
	if (!CB_GEM.data.musicEnabled) { return; }
	else if (prepareMusicExecuted) { return; }
	prepareMusicExecuted = true;
	
	CB_console("Preparing music...");
	
	CB_Elements.hideById("button_load_check_music"); //Hides the music loader button.
	
	//Defines the audios in different audio files (providing different formats and paths):
	//NOTE: CrossBrowdy will choose the best one(s) for the current client automatically.
	var currentURL = location.href;
	currentURL = currentURL.substring(0, currentURL.lastIndexOf("/") !== -1 ? currentURL.lastIndexOf("/") : currentURL.length) + "/";
	var audioURIs =
	{
		//NOTE: not using data URIs to keep the example simpler.
		"black_lark-first_contact" :
		{
			"audio/mpeg" :
			[
				currentURL + "sound/black_lark-first_contact-compressed.mp3", //Absolute path.
				"sound/black_lark-first_contact-compressed.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "sound/black_lark-first_contact-compressed.ogg", //Absolute path.
				"sound/black_lark-first_contact-compressed.ogg" //Relative path.
			],
			"audio/mp4" :
			[
				currentURL + "sound/black_lark-first_contact-compressed.m4a", //Absolute path.
				"sound/black_lark-first_contact-compressed.m4a" //Relative path.
			],
			"audio/wav" :
			[
				currentURL + "sound/black_lark-first_contact-compressed.wav", //Absolute path.
				"sound/black_lark-first_contact-compressed.wav" //Relative path.
			]
		},
		"smokefishe-sorry_for_lying" :
		{
			"audio/mpeg" :
			[
				currentURL + "sound/smokefishe-sorry_for_lying-compressed.mp3", //Absolute path.
				"sound/smokefishe-sorry_for_lying-compressed.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "sound/smokefishe-sorry_for_lying-compressed.ogg", //Absolute path.
				"sound/smokefishe-sorry_for_lying-compressed.ogg" //Relative path.
			],
			"audio/mp4" :
			[
				currentURL + "sound/smokefishe-sorry_for_lying-compressed.m4a", //Absolute path.
				"sound/smokefishe-sorry_for_lying-compressed.m4a" //Relative path.
			],
			"audio/wav" :
			[
				currentURL + "sound/smokefishe-sorry_for_lying-compressed.wav", //Absolute path.
				"sound/smokefishe-sorry_for_lying-compressed.wav" //Relative path.
			]
		},
		"weary_eyes-invisible_hand" :
		{
			"audio/mpeg" :
			[
				currentURL + "sound/weary_eyes-invisible_hand-compressed.mp3", //Absolute path.
				"sound/weary_eyes-invisible_hand-compressed.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "sound/weary_eyes-invisible_hand-compressed.ogg", //Absolute path.
				"sound/weary_eyes-invisible_hand-compressed.ogg" //Relative path.
			],
			"audio/mp4" :
			[
				currentURL + "sound/weary_eyes-invisible_hand-compressed.m4a", //Absolute path.
				"sound/weary_eyes-invisible_hand-compressed.m4a" //Relative path.
			],
			"audio/wav" :
			[
				currentURL + "sound/weary_eyes-invisible_hand-compressed.wav", //Absolute path.
				"sound/weary_eyes-invisible_hand-compressed.wav" //Relative path.
			]
		}
	};

	//Defines the sprites information:
	/*	NOTE:
		If "startAt" is not provided, it will use the value of 0 (zero) which means that it will start from the beginning.
		If "stopAt" is not provided (not recommended), it will use the whole duration of the file (which means until it reaches its end).
		Due to some possible problems between clients with different audio APIs calculating the duration of an audio file, it is recommended to always set the "stopAt" property even when we want it to stop at the end of the audio.
	*/
	var audioSprites =
	{
		//Sprite group identifiers (case-sensitive):
		"black_lark-first_contact" :
		{
			//Sprite identifiers (case-sensitive), specifying where they start and where they stop:
			"ALL" :
			{
				"startAt" : 0,
				"stopAt" : null //Until the end. Note that the recommended way is to always provide the quantity in milliseconds as explained above.
			}
		},
		"smokefishe-sorry_for_lying" :
		{
			"ALL" :
			{
				"startAt" : 0,
				"stopAt" : null //Until the end. Note that the recommended way is to always provide the quantity in milliseconds as explained above.
			}
		},
		"weary_eyes-invisible_hand" :
		{
			"ALL" :
			{
				"startAt" : 0,
				"stopAt" : null //Until the end. Note that the recommended way is to always provide the quantity in milliseconds as explained above.
			}
		}
	};

	//Defines the function to call when an audio file sprites object has any error:
	var onErrorSpritesGroup = function(error)
	{
		CB_console("[CB_AudioFileSprites] Audio file sprites object (" + this.id + ") failed: " + error);
	};

	//Defines the function to call when an audio file sprites object is created or expanding:
	var onCreateSpritesGroup = function(audioFileObjectsToCheck)
	{
		CB_console("[CB_AudioFileSprites] Audio file sprites object (CB_AudioFileSprites) with ID " + this.id + " (status: " + this.getStatusString() + ") created or expanding! CB_AudioFile objects that still need to be checked: " + audioFileObjectsToCheck);
		if (CB_Arrays.indexOf(songTitles, this.id) === -1) { songTitles[songTitles.length] = this.id; } //Adds the song to the songs array (if it did not exist yet).
		this.onLoad = null; //Prevents to execute this function again (otherwise, it could be executed again after the object grows automatically to create more 'CB_AudioFile' objects).
	};

	//Defines the function to call when an audio file sprites pool object has any error:
	var onError = function(error)
	{
		CB_console("[CB_AudioFileSpritesPool] Audio file sprites pool object failed: " + error);
		
		//Lets continue anyway:
		skipLoadingMusic();
	};

	//Defines the function to call when the audio file sprites pool object is created:
	var onCreate = function(audioFileObjectsToCheck)
	{
		CB_console("[CB_AudioFileSpritesPool] Audio file sprites pool object with ID " + this.id + " (status: " + this.getStatusString() + ") created! CB_AudioFile objects that still need to be checked: " + audioFileObjectsToCheck);
		if (audioFileObjectsToCheck > 0)
		{
			CB_console("[CB_AudioFileSpritesPool] The 'audioFileSpritesPool.checkPlayingAll' method can be called now, to check all the CB_AudioFile objects.");
			CB_GEM.data.musicLoaded = true;
			showMusicChecker(); //Shows the music checker.
		}
		this.onLoad = null; //Prevents to execute this function again (otherwise, it could be executed again after the object grows automatically to create more 'CB_AudioFile' objects).
	};

	//Defines the data for the audio file sprites pool object with all possible options:
	var audioFileSpritesPoolData =
	{
		//Identifier for the audio file sprites pool object:
		id: "songs", //Optional. Will be stored in 'audioFileSpritesPool.id'.

		//Sprites groups (each will create a CB_AudioFileSprites object internally):
		"spritesGroups" :
		{
			//Sprites group "black_lark-first_contact" (it will be used as its ID) which will create a CB_AudioFileSprites object internally:
			"black_lark-first_contact" : //This object has the same format that uses the 'audioFileSpritesPool.insertSpritesGroup' method (indeed, it is called internally).
			{
				//Defines the same audio but in different audio files (providing different formats, paths and data URIs):
				"URIs" : audioURIs["black_lark-first_contact"],

				//Defines the sprites information:
				"sprites" : audioSprites["black_lark-first_contact"],

				//Sets a function to call when the audio file sprites object is created successfully:
				onLoad: onCreateSpritesGroup, //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["black_lark-first_contact"].onLoad'.

				//Sets a function to call when an error happens with the audio file sprites object:
				onError: onErrorSpritesGroup //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["black_lark-first_contact"].onError'.
			},

			//Sprites group "smokefishe-sorry_for_lying" (it will be used as its ID) which will create a CB_AudioFileSprites object internally:
			"smokefishe-sorry_for_lying" : //This object has the same format that uses the 'audioFileSpritesPool.insertSpritesGroup' method (indeed, it is called internally).
			{
				//Defines the same audio but in different audio files (providing different formats, paths and data URIs):
				"URIs" : audioURIs["smokefishe-sorry_for_lying"],

				//Defines the sprites information:
				"sprites" : audioSprites["smokefishe-sorry_for_lying"],

				//Sets a function to call when the audio file sprites object is created successfully:
				onLoad: onCreateSpritesGroup, //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["smokefishe-sorry_for_lying"].onLoad'.

				//Sets a function to call when an error happens with the audio file sprites object:
				onError: onErrorSpritesGroup //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["smokefishe-sorry_for_lying"].onError'.
			},
			
			//Sprites group "weary_eyes-invisible_hand" (it will be used as its ID) which will create a CB_AudioFileSprites object internally:
			"weary_eyes-invisible_hand" : //This object has the same format that uses the 'audioFileSpritesPool.insertSpritesGroup' method (indeed, it is called internally).
			{
				//Defines the same audio but in different audio files (providing different formats, paths and data URIs):
				"URIs" : audioURIs["weary_eyes-invisible_hand"],

				//Defines the sprites information:
				"sprites" : audioSprites["weary_eyes-invisible_hand"],

				//Sets a function to call when the audio file sprites object is created successfully:
				onLoad: onCreateSpritesGroup, //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["weary_eyes-invisible_hand"].onLoad'.

				//Sets a function to call when an error happens with the audio file sprites object:
				onError: onErrorSpritesGroup //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["weary_eyes-invisible_hand"].onError'.
			}
		},

		/* General options for the audio file sprites pool object (can be overridden when they are specified in the options of a sprites group): */

		//Defines whether we want to check all CB_AudioFile objects automatically or manually (we will need to call the 'checkPlayingAll' method):
		checkManually: true, //Optional. Default: CB_AudioFileCache.checkManually_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.checkManually'.

		//Sets a function to call when the audio file sprites pool object is created successfully:
		onLoad: onCreate, //Optional but recommended. Will be stored in 'audioFileSpritesPool.onLoad'.

		//Sets a function to call when an error happens with the audio file sprites pool object:
		onError: onError, //Optional but recommended. Will be stored in 'audioFileSpritesPool.onError'.
		
		//As only one sound/sprite (a song) will be played at once, we do not need to cache automatically at all. We can save resources this way:
		
		//Minimum CB_AudioFile objects that will be needed internally:
		minimumAudioFiles: 1, //Optional. Default: CB_AudioFileCache.minimumAudioFiles_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.minimumAudioFiles'.

		//Maximum CB_AudioFile objects that will be created internally:
		maximumAudioFiles: 1, //Optional. Default: CB_AudioFileCache.maximumAudioFiles_DEFAULT. Set to undefined to use the default one. Set to null to have no maximum. Will be stored in 'audioFileSpritesPool.maximumAudioFiles'.

		//Minimum free CB_AudioFile objects that will be needed internally. One CB_AudioFile object is free when it is not being played.
		minimumAudioFilesFree: 0, //Optional. Default: parseInt(audioFileSpritesPool.minimumAudioFiles * 0.25 + 0.5). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.minimumAudioFilesFree'.

		//Defines the number of new CB_AudioFile objects to create automatically when they are needed:
		newAudioFilesWhenNeeded: 0 //Optional. Default: Math.min(parseInt(audioFileSpritesPool.minimumAudioFiles * 0.1 + 0.5), 1). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.newAudioFilesWhenNeeded'.
	};

	//Creates the audio file sprites pool object:
	//NOTE: it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	audioFileSpritesPool = new CB_AudioFileSpritesPool(audioFileSpritesPoolData);

	//Checks the status constantly and shows the progress (optional):
	var lastProgress = null, currentProgress = null;
	var lastStatus = null, currentStatus = null;
	var checkLoadingContinue = true;
	var checkLoading = function()
	{
		//Shows the progress (if there were any changes):
		currentProgress = audioFileSpritesPool.getProgress();
		if (currentProgress !== lastProgress)
		{
			CB_console("[CB_AudioFileSpritesPool] Progress: " + currentProgress);
			CB_Elements.insertContentById("music_progress", "Please, wait. Music loading/checking progress: " + CB_numberFormat(currentProgress, 2, true) + "%"); //Shows the music loading progress.
			lastProgress = currentProgress;
		}

		//Shows the status (if there were any changes):
		//NOTE: it would also be possible to use the 'audioFileSpritesPool.getStatusString' method which returns a string with the current status.
		currentStatus = audioFileSpritesPool.getStatus();
		if (currentStatus !== lastStatus)
		{
			if (currentStatus === CB_AudioFileSpritesPool.UNLOADED) { CB_console("[CB_AudioFileSpritesPool] Unloaded"); }
			else if (currentStatus === CB_AudioFileSpritesPool.ABORTED) { CB_console("[CB_AudioFileSpritesPool] Aborted!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileSpritesPool.FAILED) { CB_console("[CB_AudioFileSpritesPool] Failed!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileSpritesPool.LOADING) { CB_console("[CB_AudioFileSpritesPool] Loading..."); }
			else if (currentStatus === CB_AudioFileSpritesPool.UNCHECKED) { CB_console("[CB_AudioFileSpritesPool] Unchecked! The 'audioFileSpritesPool.checkPlayingAll' method needs to be called."); }
			else if (currentStatus === CB_AudioFileSpritesPool.CHECKING) { CB_console("[CB_AudioFileSpritesPool] Checking..."); }
			else if (currentStatus === CB_AudioFileSpritesPool.LOADED) { CB_console("[CB_AudioFileSpritesPool] Loaded! Now you can use the audio file sprites pool object freely."); checkLoadingContinue = false; }
			lastStatus = currentStatus;
		}

		if (checkLoadingContinue) { checkLoadingInterval = setTimeout(checkLoading, 1); }
	};
	var checkLoadingInterval = setTimeout(checkLoading, 1);
}


//Shows the music checker:
var showMusicCheckerCalled = false; //To prevent showing the checker again.
function showMusicChecker()
{
	if (!CB_GEM.data.musicEnabled) { return; }
	else if (showMusicCheckerCalled) { return; }
	showMusicCheckerCalled = true;
	CB_Elements.insertContentById("music_progress", ""); //Empties the progress shown.
	CB_Elements.insertContentById("button_load_check_music", "Step 2:<br />Check music");
	CB_Events.removeByName(CB_Elements.id("button_load_check_music"), "click"); //Removes the previous event handler from the button.
	CB_Events.on(CB_Elements.id("button_load_check_music"), "click", checkMusic); //Attaches the event to the button to check the music.	
	CB_Elements.showById("button_load_check_music"); //Shows the music checker button.
}


//Checks the music:
function checkMusic()
{
	if (!CB_GEM.data.musicEnabled) { return; }
	else if (!(audioFileSpritesPool instanceof CB_AudioFileSpritesPool)) { CB_console("[CB_AudioFileSpritesPool] Music cannot be checked because 'audioFileSpritesPool' is not a 'CB_AudioFileSpritesPool' object!"); return; }
	
	CB_console("[CB_AudioFileSpritesPool] Checking music (status: " + audioFileSpritesPool.getStatusString() + ")...");
	CB_Elements.hideById("button_load_check_music"); //Hides the music checker button.
	
	//If the "checkManually" option was set to true, we need to check all the CB_AudioFile objects manually (by calling their 'checkPlaying' method):
	audioFileSpritesPool.checkPlayingAll
	(
		//callbackOk. Optional but recommended:
		function(performedActions, uncheckedObjects)
		{
			CB_console("[CB_AudioFileSpritesPool] Audio file sprites pool object checked successfully!");
			CB_console("[CB_AudioFileSpritesPool] Performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			CB_console("[CB_AudioFileSpritesPool] Unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
			CB_GEM.data.musicChecked = true;
			CB_Elements.hideById("music_loader_checker"); //Hides the music checker.
			CB_Elements.showById("start_button"); //Shows the start button.
		},
		//callbackError. Optional but recommended:
		function(errors, performedActions, uncheckedObjects)
		{
			CB_console("[CB_AudioFileSpritesPool] Audio file sprites pool object failed to be checked!");
			for (var spritesGroupID in errors)
			{
				CB_console("[CB_AudioFileSpritesPool] " + spritesGroupID + " => " + errors[spritesGroupID].error);
				CB_console("[CB_AudioFileSpritesPool] * Performed actions (number of CB_AudioFile objects that can be played): " + errors[spritesGroupID].checked);
				CB_console("[CB_AudioFileSpritesPool] * Unchecked CB_AudioFile objects before calling this method: " + errors[spritesGroupID].needed);
			}
			CB_console("[CB_AudioFileSpritesPool] Total performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			CB_console("[CB_AudioFileSpritesPool] Total unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
			
			//Lets continue anyway:
			skipLoadingMusic();
		}
	);	
}


//Plays the desired song:
/*
	NOTE:
		Music downloaded from https://icons8.com/music/tag/atmospheric (modified to be exported to different audio formats and compressed using Audacity (https://www.audacityteam.org/download/):
			"First contact" by Black Lark.
			"Invisible hand" by Weary Eyes.
			"Sorry for lying" by Smokefishe.
*/
function playMusic(id)
{
	if (!CB_GEM.data.musicEnabled) { return; }
	else if (!(audioFileSpritesPool instanceof CB_AudioFileSpritesPool)) { CB_console("[CB_AudioFileSpritesPool] Music cannot be played because 'audioFileSpritesPool' is not a 'CB_AudioFileSpritesPool' object!"); return; }
	
	//Stops any possible song playing currently:
	stopMusic();

	//Gets the internal CB_AudioFileSprites object that belongs to the desired sprites group (gets the desired song):
	var audioFileSpritesGroup = audioFileSpritesPool.getSpritesGroup(id); //Returns null if not found.

	if (audioFileSpritesGroup !== null)
	{
		//Plays the sprite desired ("ALL" which corresponds to the whole song):
		audioFileSpritesGroup.playSprite("ALL", true); //Also loops.
	}
}


//Stops any song:
function stopMusic()
{
	if (!(audioFileSpritesPool instanceof CB_AudioFileSpritesPool)) { CB_console("[CB_AudioFileSpritesPool] Music cannot be stopped because 'audioFileSpritesPool' is not a 'CB_AudioFileSpritesPool' object!"); return; }
	
	//Stops any possible song playing currently:
	audioFileSpritesPool.stopAll();
}


//Toggles full screen mode:
//NOTE: some browsers will fail to enable full screen mode if it is not requested through a user-driven event (as "onClick", "onTouchStart", etc.).
function fullScreenToggle()
{
	CB_console("Toggling full screen mode...");
	//If it is using full screen mode already, disables it:
	if (CB_Screen.isFullScreen())
	{
		CB_console("Full screen mode detected. Trying to restore normal mode...");
		CB_Screen.setFullScreen(false); //Uses the Fullscreen API and fallbacks to other methods internally, including NW.js, Electron ones, when not available.
	}
	//...otherwise, requests full screen mode:
	else
	{
		CB_console("Normal mode detected. Trying to enable full screen mode...");
		CB_Screen.setFullScreen(true, undefined, true); //Allows reloading into another (bigger) window (for legacy clients).
	}
}