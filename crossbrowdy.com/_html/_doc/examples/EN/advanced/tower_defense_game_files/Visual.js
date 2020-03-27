var Visual = {}; //Class to manage visual things (screen, sprites, etc.).


//Defines the default refresh rate for the game loop (it will affect the FPS):
Visual.LOOP_REFRESH_RATE = 1; //Minimum is 1, which is as fast as possible.
Visual.RENDERING_CYCLES_PER_LOOP = 10; //Number of rendering cycles per loop (it will affect the FPS).


//Sets the desired sprites scene data (can be modified dynamically):
Visual._spritesGroupsData = null;
Visual.getSpritesGroupsData = function()
{
	if (typeof(Visual._spritesGroupsData) === "undefined" || Visual._spritesGroupsData === null)
	{
		//Personalizes the 'data' object used by the 'CB_GraphicSprites.SPRITE_OBJECT' object to display the FPS:
		CB_GEM.options.FPS_SPRITE_DATA =
		{
			fontSize: "12px",
			fontFamily: "courier",
			style: "#ffff00",
			fontStyle: "normal",
			fontVariant: "normal",
			fontWeight: "bold"
		};
		
		//Sprites groups data:
		Visual._spritesGroupsData =
		{
			//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
			id: "my_sprites_groups_1",
			srcWidth: 512,
			srcHeight: 512,
			data: { loop: true, onlyUseInMap: false, avoidClearingCanvas: true },
			
			//Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups that will be used (their "parent" property will be set to point the current 'CB_GraphicSpritesScene' object which contains them):
			spritesGroups:
			[
				//Information panel:
				{
					id: "info",
					srcType: CB_GraphicSprites.SRC_TYPES.TEXT,
					top: 15,
					zIndex: 3,
					data:
					{
						fontSize: "16px",
						fontFamily: "courier",
						style: "#ffaa00",
						fontWeight: "bold"
					},
					sprites: [ { id: "info_sprite" } ]
				},
				
				//Map sprites:
				{
					id: "map_sprites",
					data:
					{
						onlyUseInMap: true,
						parseIntTop: true,
						parseIntLeft: true
					},
					sprites:
					[
						//Unwalkable and unbuildable soil sprites:
						{
							id: "soil_unwalkable_unbuildable",
							subSprites:
							[
								{
									id: "soil_unwalkable_unbuildable_1",
									src: "img/soil_unwalkable_unbuildable_1.gif"
								}
							]
						},

						//Unwalkable and buildable soil sprites:
						{
							id: "soil_unwalkable_buildable",
							subSprites:
							[
								{
									id: "soil_unwalkable_buildable_1",
									src: "img/soil_unwalkable_buildable_1.gif"
								}
							]
						},

						//Walkable soil (enemy's path) sprites:
						{
							id: "path",
							subSprites:
							[
								{
									id: "path_1",
									src: "img/path_1.gif"
								}
							]
						},

						//Destiny (enemies will want to reach this target) sprites:
						{
							id: "destiny",
							subSprites:
							[
								{
									id: "destiny_1",
									src: "img/destiny_1.gif"
								}
							]
						}

					]
				},
				
				//Map (for current level):
				{
					id: "map",
					srcType: CB_GraphicSprites.SRC_TYPES.MAP,
					data:
					{
						//References sprites or sub-sprites by their index or identifier. Define a "parentId" (parent identifier of the 'CB_GraphicSprites' object or of the 'CB_GraphicSprites.SPRITE_OBJECT' object) to improve performance.
						elementsData:
						{
							//Each property name is an alias which can be used in the map (in the "src" property).
							
							//Blank space (it will be filled randomly with non-walkable and non-buildable symbols, just decoration):
							" ":
							{
								id: "soil_unwalkable_unbuildable_1",
								parentId: "soil_unwalkable_unbuildable"
							},

							//Unwalkable and buildable soil:
							"-":
							{
								id: "soil_unwalkable_buildable_1",
								parentId: "soil_unwalkable_buildable"
							},
							
							//Walkable soil (enemy's path) sprites:
							"$":
							{
								id: "path_1",
								parentId: "path"
							},
							
							//Destiny (there can only be one). Enemies will want to reach this target:
							"@":
							{
								id: "destiny_1",
								parentId: "destiny"
							},
							
							//TODO: Add all towers and their upgrade levels (in all kinds of soil).
							
							//Tower type 0:
							"-00": //Upgrade level 0.
							{
								id: "destiny_1",
								parentId: "destiny"
							},
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
							},
						beforeDrawingElement:
							function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
							{
								var skipDrawing = false;

								if (!CB_isArray(Visual._drawnMapElements)) { Visual._drawnMapElements = []; }
								if (!CB_isArray(Visual._drawnMapElements[y])) { Visual._drawnMapElements[y] = []; }
								if (!CB_isArray(Visual._drawnMapElements[y][x])) { Visual._drawnMapElements[y][x] = {}; }
								
								//If the element is unwalkable and buildable:
								if (Game.Levels.getTypeFromSymbol(mapElement.src[y][x]) === Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_BUILDABLE)
								{
									Visual._drawnMapElements[y][x].drawn = false;
									if (Input.mouseData.column === x && Input.mouseData.row === y) { element.data.filter = "sepia(0.5)"; }
									else { element.data.filter = "none"; }
								}
								
								//Defines whether to draw this element or skip drawing it:
								if (y > 1 && Visual._drawnMapElements[y][x].drawn === true) { skipDrawing = true; }
								else
								{
									Visual._drawnMapElements[y][x].drawn = true;
									Visual._drawnMapElements[y][x].elementData = { x: element._attributes.left, y: element._attributes.top };
								}
						
								return skipDrawing ? null : element; //Same as 'element'. Must return the element to draw. Return null to skip drawing it.
							}

					},
					sprites:
					[
						//Maps (current level) with string aliases:
						{
							id: "current", //Current map which will be displayed.
							src: Game.Levels._loadData(0) //Using a copy of the array as this one could be modified to adapt it to the screen.
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
		"Coins: " + Game.data.coins + "\n" +
		"Vitality: " + Game.data.vitality + "\n" +
		"Score: " + Game.data.score + "\n" +
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
		Game.Levels.loadSource(Game.Levels._loadData(Game.data.level, true)); //Using a copy of the array as this one could be modified to adapt it to the screen.
	}

	if (graphicSpritesSceneObject instanceof CB_GraphicSpritesScene)
	{
		//Resizes the current map which is being displayed according to the new screen size:
		var mapCurrent = graphicSpritesSceneObject.getById("map").getById("current").src;
		if (CB_isArray(mapCurrent))
		{
			var maxWidthFound = mapCurrent[0].length; //As the map was filled with unwalkable tiles already, all rows have the same width (same columns).
			graphicSpritesSceneObject.getById("map").getById("current").left = (CB_Screen.getWindowWidth() - Visual._ELEMENTS_WIDTH * maxWidthFound) / 2;
			graphicSpritesSceneObject.getById("map").getById("current").top = (CB_Screen.getWindowHeight() - Visual._ELEMENTS_HEIGHT * mapCurrent.length) / 2;
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
	
	//Clears the array to draw all the elements again and resets their data:
	Visual._drawnMapElements = [];

	//Fires the onMouseMove event "manually":
	CB_Events.executeByName(document, "mousemove");
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