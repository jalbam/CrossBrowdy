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
			//'towers_defense_game_sprites_groups' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
			id: "towers_defense_game_sprites_groups",
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
						parseIntLeft: true,
						filter: "none"
					},
					sprites:
					[
						//Unwalkable and unbuildable soil sprites:
						{
							id: "soil_unwalkable_unbuildable",
							subSprites:
							[
								{
									id: "soil_unwalkable_unbuildable_0",
									src: "img/soil_unwalkable_unbuildable_0.gif"
								}
							]
						},

						//Unwalkable and buildable soil sprites:
						{
							id: "soil_unwalkable_buildable",
							subSprites:
							[
								{
									id: "soil_unwalkable_buildable_0",
									src: "img/soil_unwalkable_buildable_0.gif"
								}
							]
						},

						//Walkable soil (enemy's path) sprites:
						{
							id: "path",
							subSprites:
							[
								{
									id: "path_0",
									src: "img/path_0.gif"
								}
							]
						},

						//Destiny (enemies will want to reach this target) sprites:
						{
							id: "destiny",
							subSprites:
							[
								{
									id: "destiny_0",
									src: "img/destiny_0.gif"
								}
							]
						},
						
						//Origin (enemies will appear in any of them) sprites:
						{
							id: "origin",
							subSprites:
							[
								{
									id: "origin_0",
									src: "img/origin_0.gif"
								}
							]
						}
					]
				},
				
				//Towers sprites:
				{
					id: "towers_sprites",
					data:
					{
						onlyUseInMap: true,
						parseIntTop: true,
						parseIntLeft: true
					},
					sprites:
					[
						//Tower #0 sprites:
						// TO DO: Add subSprits for each upgrade level. AND REMEMBER SOIL TYPE.
						{
							id: "tower_0",
							subSprites:
							[
								{
									id: "soil_unwalkable_buildable_0",
									src: "img/soil_unwalkable_buildable_0.gif",
									disabled: false
								},
								{
									id: "tower_0_level_0",
									src: "img/tower_0_level_0.gif",
									disabled: false
								}		
							]
						}
					]
				},

				//Enemy type #0 sprites:
				{
					id: "enemy_0_sprites_group",
					zIndex: 2,
					srcWidth: 38,
					srcHeight: 36,
					sprites:
					[
						{
							id: "enemy_0_sprites",
							subSprites:
							[
								{
									id: "enemy_0_subsprites",
									src: "img/enemy_0_sprites.gif",
									disabled: true
								}
							]
						}
					]
				},

				//Enemy type #1 sprites:
				{
					id: "enemy_1_sprites_group",
					zIndex: 2,
					srcWidth: 38,
					srcHeight: 36,
					sprites:
					[
						{
							id: "enemy_1_sprites",
							subSprites:
							[
								{
									id: "enemy_1_subsprites",
									src: "img/enemy_1_sprites.gif",
									disabled: true
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
						elementsDataParsePropertyNames: true,
						
						//References sprites or sub-sprites by their index or identifier. Define a "parentId" (parent identifier of the 'CB_GraphicSprites' object or of the 'CB_GraphicSprites.SPRITE_OBJECT' object) to improve performance.
						elementsData:
						{
							//Each property name is an alias which can be used in the map (in the "src" property).
							
							//Unwalkable and non-buildable (just decoration):
							"{{SOIL_UNWALKABLE_UNBUILDABLE}}0":
							{
								id: "soil_unwalkable_unbuildable_0",
								parentId: "soil_unwalkable_unbuildable"
							},
							"{{SOIL_UNWALKABLE_UNBUILDABLE}}1":
							{
								id: "soil_unwalkable_unbuildable_1",
								parentId: "soil_unwalkable_unbuildable"
							},

							//Unwalkable and buildable soils:
							"{{SOIL_UNWALKABLE_BUILDABLE}}0":
							{
								id: "soil_unwalkable_buildable_0",
								parentId: "soil_unwalkable_buildable",
								clickable: true
							},
							"{{SOIL_UNWALKABLE_BUILDABLE}}1":
							{
								id: "soil_unwalkable_buildable_1",
								parentId: "soil_unwalkable_buildable"
							},
							
							//Walkable soils (enemy's paths) sprites:
							"{{SOIL_WALKABLE}}0":
							{
								id: "path_0",
								parentId: "path",
							},
							"{{SOIL_WALKABLE}}1":
							{
								id: "path_1",
								parentId: "path"
							},
							
							//Destiny (there can only be one per map). Enemies will want to reach this target:
							"{{DESTINY}}{{SOIL_WALKABLE}}0":
							{
								id: "destiny_0",
								parentId: "destiny"
							},
							"{{DESTINY}}{{SOIL_WALKABLE}}1":
							{
								id: "destiny_1",
								parentId: "destiny"
							},

							//Origin (there can be many per map). Enemies could appear in any of them:
							"{{ORIGIN}}{{SOIL_WALKABLE}}0":
							{
								id: "origin_0",
								parentId: "origin"
							},
							"{{ORIGIN}}{{SOIL_WALKABLE}}1":
							{
								id: "origin_1",
								parentId: "origin"
							},

							//Tower type 0:
							"{{TOWER_0}}{{SOIL_UNWALKABLE_BUILDABLE}}0_0": //Upgrade level 0 (no upgrades).
							{
								id: "tower_0",
								clickable: true
							}
							
							//TODO: Add all towers and their upgrade levels (in all kinds of soil).
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
								if (typeof(Visual._drawnMapElements[y][x]) === "undefined") { Visual._drawnMapElements[y][x] = {}; }
								
								//If the element is unwalkable and buildable:
								if (Game.Levels.getTypeFromSymbols(mapElement.src[y][x]) === Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_BUILDABLE)
								{
								}
								else if (Game.Levels.getTypeFromSymbols(mapElement.src[y][x]) === Game.Levels.SYMBOL_TYPES.TOWER)
								{
									// TO DO: Enable desired soil and disable undesired towers/towers levels.
									/////////////element.getById("soil_unwalkable_buildable_0").setDisabled(true);
									//////////element.getById("tower_0_level_0").setDisabled(false);
								}
								
								if (Input.mouseData.column === x && Input.mouseData.row === y)
								{
									element.data.filter = mapElement.data.elementsData[mapElement.src[y][x]].clickable ? "sepia(0.5)" : "sepia(0.2)";
								}
								else
								{
									element.data.filter = "none";
								}
								Visual._drawnMapElements[y][x].drawn = false;
								
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
	
	//Parses elementsData property names when required:
	for (var x = 0; x < Visual._spritesGroupsData.spritesGroups.length; x++)
	{
		if (typeof(Visual._spritesGroupsData.spritesGroups[x].data) !== "undefined" && Visual._spritesGroupsData.spritesGroups[x].data.elementsDataParsePropertyNames)
		{
			for (var propertyName in Visual._spritesGroupsData.spritesGroups[x].data.elementsData)
			{
				var propertyNameParsed = CB_renderString(propertyName, Game.Levels.SYMBOL_TYPES, true);
				Visual._spritesGroupsData.spritesGroups[x].data.elementsData[propertyNameParsed] = CB_copyObject(Visual._spritesGroupsData.spritesGroups[x].data.elementsData[propertyName]);
				delete Visual._spritesGroupsData.spritesGroups[x].data.elementsData[propertyName];
			}
		}
	}
	
	
	return Visual._spritesGroupsData;
}


//Updates the information shown:
Visual.updateInfo = function(graphicSpritesSceneObject)
{
	graphicSpritesSceneObject.getById("info").get(0).src =
		"Level: " + (Game.data.level + 1) + "\n" +
		"Coins: " + Game.data.coins + "\n" +
		"Vitality: " + Game.data.vitality + "\n" +
		"Score: " + Game.data.score + "\n" +
		"Wave: " + (Game.data.levelEnemyWave + 1) + "/" + Game.Levels.data[Game.data.level].enemyWaves.length + "\n" +
		"* Enemies of this wave (pointer): " + Game.data.levelEnemyWaveLastEnemyPointer + "/" + Game.Levels.data[Game.data.level].enemyWaves[Game.data.levelEnemyWave].enemies.length + "\n" +
		"* Enemies alive: " + Game.getEnemiesAlive().length + "\n" +
		(!CB_Screen.isLandscape() ? "\n\nLandscape screen recommended!" : "") +
		(
			CB_GEM_DEBUG_MESSAGES ?
			"" //TODO.
			: ""
		);
}


//Resizes all visual elements according to the screen size:
Visual._ELEMENTS_WIDTH_DEFAULT = 40; //Default element's width.
Visual._ELEMENTS_HEIGHT_DEFAULT = 40; //Default element's height.
Visual._ELEMENTS_WIDTH = Visual._ELEMENTS_WIDTH_DEFAULT; //It will be updated automatically according to the screen size.
Visual._ELEMENTS_HEIGHT = Visual._ELEMENTS_HEIGHT_DEFAULT; //It will be updated automatically according to the screen size.
Visual.resizeElements = function(graphicSpritesSceneObject, avoidFillingMap)
{
	//If desired, loads the map again (it will be filled with unwalkable tiles if needed):
	if (!avoidFillingMap)
	{
		Game.Levels.loadSource(Game.Levels._loadData(Game.data.level, true)); //Using a copy of the array as this one could be modified to adapt it to the screen.
	}

	if (graphicSpritesSceneObject instanceof CB_GraphicSpritesScene)
	{
		//Locates the current map which is being displayed according to the new screen size:
		var mapCurrent = graphicSpritesSceneObject.getById("map").getById("current");
		if (CB_isArray(mapCurrent.src))
		{
			var maxWidthFound = mapCurrent.src[0].length; //As the map was filled with unwalkable tiles already, all rows have the same width (same columns).
			mapCurrent.left = (CB_Screen.getWindowWidth() - Visual._ELEMENTS_WIDTH * maxWidthFound) / 2;
			mapCurrent.top = (CB_Screen.getWindowHeight() - Visual._ELEMENTS_HEIGHT * mapCurrent.src.length) / 2;
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

	//Updates enemies position:
	CB_Arrays.forEach(Game.data.enemies, function(enemy) { enemy._spritesUpdateCoordinates(); });
	//TO DO: update towers position too.
	
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