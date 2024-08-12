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
		Visual._spritesGroupsDataBeforeDrawingSprite =
			function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
			{
				//if (!element.data || !element.data._entityObject) { return element; }
				var level = element.data._entityObject && element.data._entityObject.level ? element.data._entityObject.level : 0;
				if (!element.data._spriteDuration) { element.data._spriteDuration = 500 / (level + 1); }
				canvasContext.filter = "hue-rotate(" + (level * 60) + "deg)";

				if (element.data._beforeDrawingLastTS === null || CB_Device.getTiming() - element.data._beforeDrawingLastTS >= element.data._spriteDuration)
				{
					element.srcLeft += element.data._spriteWidth;
					element.srcLeft %= element.data._spriteWidthTotal;
					element.data._beforeDrawingLastTS = CB_Device.getTiming();
				}

				element.width = Visual._ELEMENTS_WIDTH;
				element.height = Visual._ELEMENTS_HEIGHT;

				return element; //Same as 'element'. Must return the element to draw. Return null to skip drawing it.
			};
		Visual._spritesGroupsDataBeforeDrawingSpriteVitality =
			function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
			{
				if (!element.data || !element.data._entityObject) { return null; }
				element.width = element.data._entityObject.vitality / element.data._entityObject.levelVitality[element.data._entityObject.level] * Visual._ELEMENTS_WIDTH;
				element.height = Visual._ELEMENTS_HEIGHT / 15;
				return element;
			};
			
		Visual._spritesGroupsDataBeforeDrawingSpriteTowerBackground =
			function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
			{
				//if (!element.data || !element.data._entityObject) { return null; }
				element.width = Visual._ELEMENTS_HEIGHT;
				element.height = Visual._ELEMENTS_HEIGHT;
		
				//TO DO: detect background type and change its image:
				
				
				//element.width = element.data._entityObject.vitality / element.data._entityObject.levelVitality[element.data._entityObject.level] * Visual._ELEMENTS_WIDTH;
				return element;
			};

		Visual._subSpritesTowerRadiusSeen =
		{
			id: "tower_subsprites_radius_seen",
			zIndex: 3,
			srcType: CB_GraphicSprites.SRC_TYPES.CIRCLE,
			data:
			{
				radius: 200,
				style: "#00aa00",
				opacity: 0.5
			}
		};

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
					zIndex: 10,
					data:
					{
						fontSize: "16px",
						fontFamily: "courier",
						style: "#ffaa00",
						fontWeight: "bold",
						filter: "none"
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
								},
								{
									id: "destiny_1",
									src: "img/destiny_1.gif"
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
								},
								{
									id: "origin_1",
									src: "img/origin_1.gif"
								}
							]
						}
					]
				},
				
				//Tower type #0 sprites:
				{
					id: "tower_0_sprites_group",
					zIndex: 2,
					srcWidth: 38,
					srcHeight: 36,
					data: { onlyUseInMap: true },
					sprites:
					[
						{
							id: "tower_0_sprites",
							subSprites:
							[
								{
									id: "tower_0_subsprites",
									src: "img/tower_0_sprites.gif",
									zIndex: 4,
									disabled: true,
									data:
									{
										rotationUseDegrees: true,
										rotation: 0,
										_beforeDrawingLastTS: null,
										_spriteWidth: 38,
										_spriteWidthTotal: 152,
										_spriteDuration: null, //It will change according to tower level.
										_entityObject: null,
										beforeDrawing: Visual._spritesGroupsDataBeforeDrawingSprite
									}
								},
								{
									id: "tower_0_subsprites_vitality",
									srcType: CB_GraphicSprites.SRC_TYPES.RECTANGLE,
									disabled: true,
									zIndex: 5,
									data:
									{
										style: "#00aa00",
										opacity: 0.6,
										filter: "none",
										_entityObject: null,
										beforeDrawing: Visual._spritesGroupsDataBeforeDrawingSpriteVitality
									}
								},
								{
									id: "tower_0_subsprites_background",
									srcWidth: 512,
									srcHeight: 512,
									src: "img/soil_unwalkable_unbuildable_0.gif",
									disabled: true,
									data:
									{
										_entityObject: null,
										beforeDrawing: Visual._spritesGroupsDataBeforeDrawingSpriteTowerBackground
									}
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
									disabled: true,
									data:
									{
										rotationUseDegrees: true,
										rotation: 0,
										_beforeDrawingLastTS: null,
										_spriteWidth: 38,
										_spriteWidthTotal: 152,
										_spriteDuration: null, //It will change according to enemy level.
										_entityObject: null,
										beforeDrawing: Visual._spritesGroupsDataBeforeDrawingSprite
									}
								},
								{
									id: "enemy_0_subsprites_vitality",
									srcType: CB_GraphicSprites.SRC_TYPES.RECTANGLE,
									disabled: true,
									zIndex: 3,
									data:
									{
										style: "#00aa00",
										opacity: 0.6,
										filter: "none",
										_entityObject: null,
										beforeDrawing: Visual._spritesGroupsDataBeforeDrawingSpriteVitality
									}
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
									disabled: true,
									data:
									{
										rotationUseDegrees: true,
										rotation: 0,
										_beforeDrawingLastTS: null,
										_spriteWidth: 38,
										_spriteWidthTotal: 152,
										_spriteDuration: null, //It will change according to enemy level.
										beforeDrawing: Visual._spritesGroupsDataBeforeDrawingSprite
									}
								},
								{
									id: "enemy_1_subsprites_vitality",
									srcType: CB_GraphicSprites.SRC_TYPES.RECTANGLE,
									disabled: true,
									zIndex: 3,
									data:
									{
										style: "#00aa00",
										opacity: 0.6,
										filter: "none",
										_entityObject: null,
										beforeDrawing: Visual._spritesGroupsDataBeforeDrawingSpriteVitality
									}
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
						elementsDataParsePropertyNames: true, //Defines whether to parse or not wildcards in property names.
						
						//References sprites or sub-sprites by their index or identifier. Define a "parentId" (parent identifier of the 'CB_GraphicSprites' object or of the 'CB_GraphicSprites.SPRITE_OBJECT' object) to improve performance.
						elementsData:
						{
							//Each property name is an alias which can be used in the map (in the "src" property). Wildcards will be parsed later intarnally.
							
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
								id: "tower_0_sprites",
								parentId: "tower_0_sprites_group",
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
								if (!Visual._drawnMapElements[y][x]) { Visual._drawnMapElements[y][x] = {}; }

								//Visual._drawnMapElements[y][x].elementData = { x: null, y: null };

								//If the element is unwalkable and buildable:
								if (Game.Levels.getTypeFromSymbols(mapElement.src[y][x]) === Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_BUILDABLE)
								{
									Visual._drawnMapElements[y][x].drawn = false; //Forces redraw.
								}
								else if (Game.Levels.getTypeFromSymbols(mapElement.src[y][x]) === Game.Levels.SYMBOL_TYPES.TOWER)
								{
									element.data._entityObject = Game.findTowerByPosition(x, y);
									element.disabled = false;
									element.forEach
									(
										function (subSprite)
										{
											if (subSprite.disabled)
											{
												subSprite.disabled = false;
												subSprite.data._entityObject = element.data._entityObject;
											}
										}
									);

									//TO DO: mind tower type (or not):
									//TO DO: center circle!!!
									var towerSeenCircle = CB_copyObject(Visual._subSpritesTowerRadiusSeen);
									towerSeenCircle.id += element.data._entityObject.id;
									towerSeenCircle.disabled = false;
									towerSeenCircle.data.style = "#00aa00";
									towerSeenCircle.top = element.top + Visual._ELEMENTS_WIDTH / 2 - CB_GEM.graphicSpritesSceneObject.getById("map").getById("current").top;
									towerSeenCircle.left = element.left + Visual._ELEMENTS_HEIGHT / 2 - CB_GEM.graphicSpritesSceneObject.getById("map").getById("current").left;
									towerSeenCircle.data.radius = element.data._entityObject.getRadiusSeen(true);
									mapElement.insertSubSprites( [ towerSeenCircle ] );

									// TO DO: Enable desired soil and disable undesired towers/towers levels.
									//element.getById("soil_unwalkable_buildable_0").setDisabled(true);
									//////////element.getById("tower_0_level_0").setDisabled(false);
									Visual._drawnMapElements[y][x].drawn = false; //Forces redraw.
									//return null;
								}
								else
								{
									Visual._drawnMapElements[y][x].drawn = false; //Forces redraw.
								}
								
								if (Input.mouseData.column === x && Input.mouseData.row === y)
								{
									element.data.filter = mapElement.data.elementsData[mapElement.src[y][x]].clickable ? "sepia(0.5)" : "none";
								}
								else
								{
									element.data.filter = "none";
								}

								//Defines whether to draw this element or skip drawing it:
								if (y > 1 && Visual._drawnMapElements[y][x].drawn === true) { skipDrawing = true; }
								else
								{
									Visual._drawnMapElements[y][x].drawn = true;
									Visual._drawnMapElements[y][x].elementData = { x: element._attributes.left, y: element._attributes.top, symbol: mapElement.src[y][x] }
									//Visual._drawnMapElements[y][x].elementData.x = element._attributes.left;
									//Visual._drawnMapElements[y][x].elementData.y = element._attributes.top;
								}

								return skipDrawing ? null : element; //Same as 'element'. Must return the element to draw. Return null to skip drawing it.
							}

					},
					sprites:
					[
						//Maps (current level) with string aliases:
						{
							id: "current", //Current map which will be displayed.
							src: null, //Will be using a copy of the array as this one could be modified to adapt it to the screen.
							subSprites: []
						}
					]
				}
			]
		};
	}
	
	//Parses elementsData property names (wildcards) when required:
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
		"Score: " + Game.data.score + "\n" +
		"Vitality: " + Game.data.vitality + "\n" +
		"Wave: " + (Game.data.levelEnemyWave + 1) + "/" + Game.Levels.data[Game.data.level].enemyWaves.length + "\n" +
		"* Enemies of this wave: " + Game.data.enemies.length + "/" + Game.Levels.data[Game.data.level].enemyWaves[Game.data.levelEnemyWave].enemies.length + " (" + Game.getEnemiesAlive().length + " alive)\n" +
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
Visual._ELEMENTS_WIDTH_PREVIOUS = Visual._ELEMENTS_WIDTH; //Stores the previous value of Visual._ELEMENTS_WIDTH. Updates after finishing resize.
Visual._ELEMENTS_HEIGHT_PREVIOUS = Visual._ELEMENTS_HEIGHT_PREVIOUS; //Stores the previous value of Visual._ELEMENTS_HEIGHT. Updates after finishing resize.
Visual._mapCurrentLeft = 0;
Visual._mapCurrentTop = 0;
Visual._mapCurrentLeftPrevious = 0;
Visual._mapCurrentTopPrevious = 0;
Visual.resizeElements = function(graphicSpritesSceneObject, avoidFillingMap, currentLevel)
{
	//If desired, loads the map again (it will be filled with unwalkable tiles if needed):
	if (!avoidFillingMap)
	{
		Game.Levels.loadSource(Game.Levels._loadData(Game.data.level, true, currentLevel)); //Using a copy of the array as this one could be modified to adapt it to the screen.
	}

	if (graphicSpritesSceneObject instanceof CB_GraphicSpritesScene)
	{
		//Locates the current map which is being displayed according to the new screen size:
		var mapCurrent = graphicSpritesSceneObject.getById("map").getById("current");
		if (CB_isArray(mapCurrent.src))
		{
			var maxWidthFound = mapCurrent.src[0].length; //As the map was filled with unwalkable tiles already, all rows have the same width (same columns).
			Visual._mapCurrentLeftPrevious = mapCurrent.left;
			Visual._mapCurrentTopPrevious = mapCurrent.top;
			Visual._mapCurrentLeft = mapCurrent.left = (CB_Screen.getWindowWidth() - Visual._ELEMENTS_WIDTH * maxWidthFound) / 2;
			Visual._mapCurrentTop = mapCurrent.top = (CB_Screen.getWindowHeight() - Visual._ELEMENTS_HEIGHT * mapCurrent.src.length) / 2;
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

	//Updates entities position:
	Enemy.walkPixelsUpdated = false;
	CB_Arrays.forEach(Game.data.enemies, function(enemy) { enemy._spritesUpdateCoordinates(null, null, null, null, null, true); });
	//CB_Arrays.forEach(Game.data.towers, function(tower) { tower._spritesUpdateCoordinates(null, null, null, null, null, true); });

	//Resize entities:
	Visual.resizeEntities(graphicSpritesSceneObject);
	
	//Clears the array to draw all the elements again and resets their data:
	Visual._drawnMapElements = [];

	//Fires the onMouseMove event "manually":
	CB_Events.executeByName(document, "mousemove");
	
	//Stores the previous width and size (for the next resize process):
	Visual._ELEMENTS_WIDTH_PREVIOUS = Visual._ELEMENTS_WIDTH;
	Visual._ELEMENTS_HEIGHT_PREVIOUS = Visual._ELEMENTS_HEIGHT;
}


//Resizes entities (enemies and towers) according to the screen:
Visual.resizeEntities = function(graphicSpritesSceneObject)
{
	if (!graphicSpritesSceneObject) { return; }

	graphicSpritesSceneObject.forEach
	(
		function(spritesGroup)
		{
			if (spritesGroup.id.indexOf("enemy_") === -1 && spritesGroup.id.indexOf("tower_") === -1) { return; }
			spritesGroup.forEach
			(
				function(sprite)
				{
					sprite.forEach
					(
						function (subSprite)
						{
							subSprite.width = subSprite.id.indexOf("vitality") !== -1 && subSprite.data._entityObject ? subSprite.data._entityObject.vitality / subSprite.data._entityObject.levelVitality[subSprite.data._entityObject.level] * Visual._ELEMENTS_WIDTH : Visual._ELEMENTS_WIDTH;
							subSprite.height = subSprite.id.indexOf("vitality") !== -1 ? Visual._ELEMENTS_HEIGHT / 15 : Visual._ELEMENTS_HEIGHT;
						}
					);
				}
			);
		}
	);
}


//Toggles full screen mode:
//NOTE: some browsers will fail to enable full screen mode if it is not requested through a user-driven event (as "onClick", "onTouchStart", etc.).
Visual.fullScreenToggle = function()
{
	logMessage("Toggling full screen mode...");
	//If it is using full screen mode already, disables it:
	if (CB_Screen.isFullScreen())
	{
		logMessage("Full screen mode detected. Trying to restore normal mode...");
		CB_Screen.setFullScreen(false); //Uses the Fullscreen API and fallbacks to other methods internally, including NW.js, Electron ones, when not available.
	}
	//...otherwise, requests full screen mode:
	else
	{
		logMessage("Normal mode detected. Trying to enable full screen mode...");
		CB_Screen.setFullScreen(true, undefined, true); //Allows reloading into another (bigger) window (for legacy clients).
	}
}