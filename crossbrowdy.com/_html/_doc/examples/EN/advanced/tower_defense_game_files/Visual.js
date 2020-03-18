var Visual = {}; //Class to manage visual things (screen, sprites, etc.).


//Defines the default refresh rate for the game loop (it will affect the FPS):
Visual.REFRESH_RATE = 1; //Minimum is 1, which is as fast as possible.


//Sets the desired sprites scene data (can be modified dynamically):
Visual._spritesGroupsData = null;
Visual.getSpritesGroupsData = function()
{
	if (typeof(Visual._spritesGroupsData) === "undefined" || Visual._spritesGroupsData === null)
	{
		Visual._spritesGroupsData =
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
						onlyUseInMap: true
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
						onlyUseInMap: true
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
							" ": //Blank space. It will be filled randomly with non-walkable symbols (just decoration):
							{
								id: "stone_sprites"
							},
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
								return Visual._ELEMENTS_WIDTH;
							},
						elementsHeight:
							function(alias, element, elementData, elementMapParent, elementLoopHeightDefault, x, y)
							{
								return Visual._ELEMENTS_HEIGHT;
							}
					},
					sprites:
					[
						//Maps with string aliases:
						//'map_current' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
						{
							id: "map_current", //Current map which will be displayed (it will be modified according to the position of the player and the other elements).
							src: Game.Levels._loadData(0) //Using a copy of the array as this one will be modified by the game when elements move.
						}
					]
				}
			]
		};
	}
	
	return Visual._spritesGroupsData;
}


//Updates the information shown:
Visual.updateInfo = function(graphicSpritesSceneObject)
{
	graphicSpritesSceneObject.getById("info").get(0).src =
		"Level: " + Game.data.level + "\n" +
		(!CB_Screen.isLandscape() ? "\n\nLandscape screen recommended!" : "") +
		(
			CB_GEM_DEBUG_MESSAGES ?
			"" //TODO.
			: ""
		);
}


//Resizes all visual elements according to the screen size:
Visual._ELEMENTS_WIDTH = 40; //It will be updated automatically according to the screen size.
Visual._ELEMENTS_HEIGHT = 40; //It will be updated automatically according to the screen size.
Visual.resizeElements = function(graphicSpritesSceneObject, avoidFillingMap)
{
	//If desired, loads the map again (it will be filled with unwalkable tiles if needed):
	if (!avoidFillingMap)
	{
		CB_GEM.graphicSpritesSceneObject.getById("map_group").getById("map_current").src = Game.Levels._loadData(Game.data.level, true); //Using a copy of the array as this one could be modified to adapt it to the screen.
	}

	if (graphicSpritesSceneObject instanceof CB_GraphicSpritesScene)
	{
		//Resizes the current map which is being displayed according to the new screen size:
		var mapCurrent = graphicSpritesSceneObject.getById("map_group").getById("map_current").src;
		if (CB_isArray(mapCurrent))
		{
			var maxWidthFound = mapCurrent[0].length; //As the map was filled with unwalkable tiles already, all rows have the same width (same columns).
			graphicSpritesSceneObject.getById("map_group").getById("map_current").left = (CB_Screen.getWindowWidth() - Visual._ELEMENTS_WIDTH * maxWidthFound) / 2;
			graphicSpritesSceneObject.getById("map_group").getById("map_current").top = (CB_Screen.getWindowHeight() - Visual._ELEMENTS_HEIGHT * mapCurrent.length) / 2;
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
	var screenControlsToggler = CB_Elements.id("controls_toggler");
	if (screenControlsToggler !== null)
	{
		screenControlsToggler.style.right = "0px";
		screenControlsToggler.style.bottom = toolbarIconMargin;
		screenControlsToggler.style.width = (parseInt(toolbarIconWidthAndHeight) / 2) + "px";
		screenControlsToggler.style.height = screenControlsToggler.style.lineHeight = (parseInt(toolbarIconWidthAndHeight) / 2) + "px";
		screenControlsToggler.style.fontSize = parseInt(toolbarIconWidthAndHeight) / 4 + "px";
	}
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


//Toggles full screen mode:
//NOTE: some browsers will fail to enable full screen mode if it is not requested through a user-driven event (as "onClick", "onTouchStart", etc.).
Visual.fullScreenToggle = function()
{
	showMessage("Toggling full screen mode...");
	//If it is using full screen mode already, disables it:
	if (CB_Screen.isFullScreen())
	{
		showMessage("Full screen mode detected. Trying to restore normal mode...");
		CB_Screen.setFullScreen(false); //Uses the Fullscreen API and fallbacks to other methods internally, including NW.js, Electron ones, when not available.
	}
	//...otherwise, requests full screen mode:
	else
	{
		showMessage("Normal mode detected. Trying to enable full screen mode...");
		CB_Screen.setFullScreen(true, undefined, true); //Allows reloading into another (bigger) window (for legacy clients).
	}
}