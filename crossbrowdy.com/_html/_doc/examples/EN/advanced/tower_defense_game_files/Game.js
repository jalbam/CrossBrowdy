var Game = {}; //Class to manage game logic.
Game.Levels = {}; //Class to manage game levels.


//Game data:
//NOTE: most of the data will be calculated automatically and dynamically.
Game.data =
{
	//General data:
	soundEnabled: false, //Set to false to disable sound.
	musicEnabled: false, //Set to false to disable music.
	vibrationEnabled: true, //Set to false to disable vibration.
	musicLoaded: false,
	musicChecked: false,
	gameStarted: false,
	levelSucceeded: false,
	level: 0,
	levelEnemyWave: 0,
	levelEnemyWaveEndedTs: null,
	levelEnemyWaveLastEnemyPointer: 0,
	levelEnemyWaveLastEnemyCreatedTs: null,
	score: 0,
	coins: 0,
	vitality: 100,
	enemies: [],
	towers: [],
	_godMode: true,
	levelMap: null //Array with the current map.
};


//Initializes the class:
Game.init = function()
{
	//Gets the levels:
	Game.Levels.data = _LEVELS;
	
	//Initializes the 'Input' class:
	Input.init();
}


//Executed each game loop, before rendering graphics:
Game.onLoopStart = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop starts, before rendering the graphics (if it returns false, it will skip rendering in this loop):
{
	//Manages input:
	Input.manage();
	
	//Updates the information panel:
	Visual.updateInfo(CB_GEM.graphicSpritesSceneObject);
	
	if (!Game.data.gameStarted) { return; }

	//If vitality is empty, ends the game:
	if (!Game.data._godMode && Game.data.vitality <= 0) { Game.end("Game over!"); return; }

	//Determines whether the level has been passed successfully or not:
	var levelPassed = false;

	//Determines whether to start a new enemy wave:
	var createNewEnemy = false;

	//If there was no enemy yet, it will be the first wave:
	if (Game.data.levelEnemyWaveLastEnemyCreatedTs === null)
	{
		logMessage("First wave of the level!");
		Game.data.enemies = [];
		createNewEnemy = true;
	}
	//...otherwise, if there are still enemies to appear for the current wave:
	else if (Game.data.levelEnemyWaveLastEnemyPointer < Game.Levels.data[Game.data.level].enemyWaves[Game.data.levelEnemyWave].enemies.length)
	{
		//If the time to wait for next enemy has been reached, creates next enemy:
		if (CB_Device.getTiming() >= Game.data.levelEnemyWaveLastEnemyCreatedTs + Game.Levels.data[Game.data.level].enemyWaves[Game.data.levelEnemyWave].timeBetweenEnemies)
		{
			logMessage("New enemy can be created for the current wave");
			createNewEnemy = true;
		}
	}
	//...otherwise, if there are no more enemies to release:
	else if (Game.getEnemiesAlive().length === 0)
	{
		//If there are still enemy waves to come (it is not the last one):
		if (Game.data.levelEnemyWave + 1 < Game.Levels.data[Game.data.level].enemyWaves.length)
		{
			//If the time to wait for the next wave has been reached, starts a new wave:
			if (Game.data.levelEnemyWaveEndedTs !== null && CB_Device.getTiming() >= Game.data.levelEnemyWaveEndedTs + Game.Levels.data[Game.data.level].enemyWaves[Game.data.levelEnemyWave].timeFromLastEnemyToNextWave)
			{
				Game.data.levelEnemyWaveEndedTs = null;
				Game.data.enemies = [];
			
				//Manage pointers:
				Game.data.levelEnemyWaveLastEnemyPointer = 0;
				Game.data.levelEnemyWave++;
				
				createNewEnemy = true;
				
				logMessage("The time for next wave has been reached. Starting new wave #" + (Game.data.levelEnemyWave) + "...");
			}
			//...otherwise, the current wave has ended so we store the time (if not done yet):
			else if (Game.data.levelEnemyWaveEndedTs === null)
			{
				logMessage("Wave #" + Game.data.levelEnemyWave + " ended");
				//Stores the time when the current wave has been ended:
				Game.data.levelEnemyWaveEndedTs = CB_Device.getTiming();
				
			}
		}
		//...otherwise, the level has been successfully finished:
		else
		{
			levelPassed = true;
		}
	}

	//If a new enemy is needed, creates it:
	if (createNewEnemy)
	{
		//Creates the new enemy:
		Game.data.enemies[Game.data.enemies.length] =
			new Enemy
			(
				Game.Levels.data[Game.data.level].enemyWaves[Game.data.levelEnemyWave].enemies[Game.data.levelEnemyWaveLastEnemyPointer].type,
				Game.Levels.data[Game.data.level].enemyWaves[Game.data.levelEnemyWave].enemies[Game.data.levelEnemyWaveLastEnemyPointer].level
			);

		//Stores the time when the current enemy has been created:
		Game.data.levelEnemyWaveLastEnemyCreatedTs = CB_Device.getTiming();
		
		//Increases the enemy pointer for the current wave:
		Game.data.levelEnemyWaveLastEnemyPointer++;
	}
	else if (levelPassed)
	{
		Game.data.levelSucceeded = true; 
		Game.data.score += Game.data.vitality >= 100 ? 1000 : 500;
		Game.end("Congratulations! You survived successfully" + (Game.data.vitality >= 100 ? " (undamaged!!!)" : ""));
	}

	//Perform steps for each enemy:
	for (var x = 0; x < Game.data.enemies.length; x++)
	{
		Game.data.enemies[x].loopStep();
	}
};


//Executed each game loop, after rendering graphics:
Game.onLoopEnd = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop ends, after rendering the graphics (not executed if the 'CB_GEM.onLoopStart' function returned false):
{
	if (!Game.data.gameStarted) { return; }
	
	//TODO.
};


//Starts the game:
Game._startExecuted = false;
Game.start = function(graphicSpritesSceneObject)
{
	if (Game.data.gameStarted) { return; }

	graphicSpritesSceneObject = graphicSpritesSceneObject || CB_GEM.graphicSpritesSceneObject;
	if (!graphicSpritesSceneObject) { return; }
	
	//Hides the start button:
	CB_Elements.hideById("start_button");
	
	if (!Game._startExecuted)
	{
		//Loads the first level and resets any data:
		Game.Levels.load(0);
		
		//Prepares the sound effects and plays one of them (recommended to do this through a user-driven event):
		try
		{
			Sound.FX.prepare(); //Prepares sound effects to be used later.
			Sound.FX.play("start");
		}
		catch(E)
		{
			logMessage("Error preparing sounds or playing sound with 'start' ID: " + E);
			Game.data.soundEnabled = false; //If it fails, disables the sound.
		}

		//Enables the level selector:
		var levelSelector = CB_Elements.id("level_selector");
		if (levelSelector !== null)
		{
			levelSelector.disabled = false;
		}
	}
	else
	{
		//Loads the next level and resets any data::
		Game.Levels.loadNext();
	}

	if (Game.data.vibrationEnabled) { CB_Device.Vibration.start(100); } //Makes the device vibrate.

	Game._startExecuted = true;

	//Sets the game as started:
	Game.data.gameStarted = true; //When set to true, starts the game automatically as the game loops detect it.
}


//Ends the game:
Game.end = function(message)
{
	if (!Game.data.gameStarted) { return; }

	//Disables the level selector:
	var levelSelector = CB_Elements.id("level_selector");
	if (levelSelector !== null)
	{
		levelSelector.disabled = true;
	}
		
	message = CB_trim(message);
	Game.data.gameStarted = false;
	var buttonText = "Start game!";
	if (Game.data.levelSucceeded) { buttonText = (Game.data.level >= Game.Levels.data.length - 1) ? "All levels passed!<br />Restart game" : "Continue playing"; }
	CB_Elements.insertContentById("start_button", (message !== "" ? message + "<br />" : "") + buttonText)
	CB_Elements.showById("start_button"); //Shows the start button again.
}


//Defines the symbol types (performance and simplification purposes):
Game.Levels.SYMBOL_TYPES_numberOfTowerTypes = 6;
Game.Levels.SYMBOL_TYPES =
{
	//TODO: add the rest of the types.
	"SOIL_UNWALKABLE_UNBUILDABLE": " ",
	"SOIL_UNWALKABLE_BUILDABLE": "-",
	"SOIL_WALKABLE": "$",
	"ORIGIN": "*",
	"DESTINY": "@",
	"TOWER": "!"
};
for (var x = 0; x < Game.Levels.SYMBOL_TYPES_numberOfTowerTypes; x++)
{
	Game.Levels.SYMBOL_TYPES["TOWER_" + x] = Game.Levels.SYMBOL_TYPES.TOWER + x;
}


//Returns a new array filled with the given value:
Game.Levels._getArrayFilled = function(value, start, end)
{
	start = start > 0 ? start : 0;
	end = end > 0 ? end : 0;
	if (start >= end) { return [ value ]; }
	var array = new Array(end - start); //The array will grow later if needed.
	for (var x = start; x <= end; x++)
	{
		array[x] = value;
	}
	return array;
}


//Fills the level array with unwalkable and unbuildable tiles the rows needed (to adapt it to the screen) and returns it:
Game.Levels._loadDataRowsRoundingFunction = null;
Game.Levels.addedRowsAndColumns = { rows: { top: 0, bottom: 0 }, columns: { left: 0, right: 0 } };
Game.Levels._loadDataRows = function(levelData, maxWidthFound, fillOverflow)
{
	var levelHeight = levelData.length;
	var rowsNeeded = Math.ceil((CB_Screen.getWindowHeight() / Visual._ELEMENTS_HEIGHT) - levelHeight);

	Game.Levels.addedRowsAndColumns.rows.top = Game.Levels.addedRowsAndColumns.rows.bottom = 0;

	if (rowsNeeded > 0)
	{
		if (fillOverflow) { Game.Levels._loadDataRowsRoundingFunction = Math.ceil; }
		else { Game.Levels._loadDataRowsRoundingFunction = Math.floor; }
		for (var x = 0; x < Game.Levels._loadDataRowsRoundingFunction(rowsNeeded / 2); x++)
		{
			levelData.unshift(Game.Levels._getArrayFilled(Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE, 0, maxWidthFound - 1));
			Game.Levels.addedRowsAndColumns.rows.top++;
		}
		for (; x >= 1; x--)
		{
			levelData[levelData.length] = Game.Levels._getArrayFilled(Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE, 0, maxWidthFound - 1);
			Game.Levels.addedRowsAndColumns.rows.bottom++;
		}
	}
	return levelData;
}


//Fills the level array with same (if not destiny) or unwalkable and unbuildable tiles the columns needed (to adapt it to the screen) and returns it:
Game.Levels._loadDataColumnsRoundingFunction = null;
Game.Levels._loadDataColumns = function(levelData, fillOverflow)
{
	if (fillOverflow) { Game.Levels._loadDataColumnsRoundingFunction = Math.ceil; }
	else { Game.Levels._loadDataColumnsRoundingFunction = Math.floor; }

	Game.Levels.addedRowsAndColumns.columns.left = Game.Levels.addedRowsAndColumns.columns.right = 0;

	levelHeight = levelData.length;
	var columnsNeededTotal = 0;
	var columnsNeededToAdd = 0;
	for (var x = 0; x < levelHeight; x++)
	{
		columnsNeededTotal = Math.ceil(CB_Screen.getWindowWidth() / Visual._ELEMENTS_WIDTH);
		columnsNeededToAdd = columnsNeededTotal - levelData[x].length;
		if (columnsNeededToAdd > 0)
		{
			var columnsAddedLoop = 0;
			for (var y = 0; y < Game.Levels._loadDataColumnsRoundingFunction(columnsNeededToAdd / 2); y++)
			{
				//Extends the last tile with unwalkable and unbuildable soil:
				levelData[x].unshift(Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE);
				columnsAddedLoop++;
			}
			if (columnsAddedLoop > Game.Levels.addedRowsAndColumns.columns.left) { Game.Levels.addedRowsAndColumns.columns.left = columnsAddedLoop; }
			columnsAddedLoop = 0;
			for (; y > 1 || levelData[x].length < columnsNeededTotal; y--)
			{
				//Extends the last tile with unwalkable and unbuildable soil:
				levelData[x][levelData[x].length] = Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE;
				columnsAddedLoop++;
			}
			if (columnsAddedLoop > Game.Levels.addedRowsAndColumns.columns.right) { Game.Levels.addedRowsAndColumns.columns.right = columnsAddedLoop; }
		}
	}
	return levelData;
}

//Fills the level data with default tiles when not defined and returns it:
Game.Levels._loadDataSetDefault = function(levelData)
{
	for (var r = 0; r < levelData.length; r++)
	{
		for (var c = 0; c < levelData[r].length; c++)
		{
			if (levelData[r][c].length === 1)
			{
				if (levelData[r][c] === Game.Levels.SYMBOL_TYPES.ORIGIN)
				{
					levelData[r][c] = levelData[r][c] + Game.Levels.SYMBOL_TYPES.SOIL_WALKABLE + "0";
				}
				else if (levelData[r][c] === Game.Levels.SYMBOL_TYPES.DESTINY)
				{
					levelData[r][c] = levelData[r][c] + Game.Levels.SYMBOL_TYPES.SOIL_WALKABLE + "0";
				}
				else if (levelData[r][c] === Game.Levels.SYMBOL_TYPES.TOWER)
				{
					levelData[r][c] = levelData[r][c] + "0" + Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_BUILDABLE + "0_0";
				}
				else { levelData[r][c] = levelData[r][c] + "0"; }
			}
		}
	}

	return levelData;
}

//Prepares level data and returns it (using an internal cache when possible):
Game.Levels._loadDataCache = [];
Game.Levels._fillOverflowRowsDefault = true;
Game.Levels._fillOverflowColumnsDefault = true;
Game.Levels._loadData = function(level, avoidCache)
{
	//If it was not adapted and cached before, does it:
	if (avoidCache || typeof(Game.Levels._loadDataCache[level]) === "undefined" || Game.Levels._loadDataCache[level] === null)
	{
		//Adapts the level to the screen filling the missing data with blank spaces:
		var levelData = CB_Arrays.copy(Game.Levels.data[level].map);
		
		var levelHeight = levelData.length;
		var maxWidthFound = 1;
		for (var x = 0; x < levelHeight; x++)
		{
			if (levelData.length && levelData[x].length > maxWidthFound) { maxWidthFound = levelData[x].length; }
		}
		
		//Resizes the elements according to the screen size:
		Visual._ELEMENTS_HEIGHT = Math.ceil(CB_Screen.getWindowHeight() / levelHeight);
		Visual._ELEMENTS_WIDTH = Math.ceil(CB_Screen.getWindowWidth() / maxWidthFound);
		Visual._ELEMENTS_WIDTH = Visual._ELEMENTS_HEIGHT = Math.min(Visual._ELEMENTS_WIDTH, Visual._ELEMENTS_HEIGHT);
		
		if (typeof(CB_GEM) !== "undefined" && CB_GEM.graphicSpritesSceneObject)
		{
			CB_GEM.graphicSpritesSceneObject.forEach
			(
				function(spritesGroup)
				{
					if (spritesGroup.id.indexOf("enemy_") === -1) { return; } //TO DO: also affect tower sprites.
					spritesGroup.forEach
					(
						function(sprite)
						{
							sprite.forEach
							(
								function (subSprite)
								{
									subSprite.width = subSprite.id.indexOf("vitality") !== -1 && subSprite.data._enemyObject ? subSprite.data._enemyObject.vitality / subSprite.data._enemyObject.levelVitality[subSprite.data._enemyObject.level] * Visual._ELEMENTS_WIDTH : Visual._ELEMENTS_WIDTH;
									subSprite.height = subSprite.id.indexOf("vitality") !== -1 ? Visual._ELEMENTS_HEIGHT / 15 : Visual._ELEMENTS_HEIGHT;
								}
							);
						}
					);
				}
			);
		}

		Game.Levels._loadDataRows(levelData, maxWidthFound, Game.Levels._fillOverflowRowsDefault);
		Game.Levels._loadDataColumns(levelData, Game.Levels._fillOverflowColumnsDefault);
		
		Game.Levels._loadDataSetDefault(levelData);
		
		//Caches the level:
		Game.Levels._loadDataCache[level] = levelData;
	}
	
	return Game.Levels._loadDataCache[level];
}


//Loads the desired map source for the current map:
Game.Levels.loadSource = function(source)
{
	Game.data.levelMap = CB_GEM.graphicSpritesSceneObject.getById("map").getById("current").src = source;
}


//Loads the desired level:
Game.Levels.load = function(level)
{
	//Sanitizes the level number:
	level = level || 0;
	if (level < 0) { level = 0; }
	level %= Game.Levels.data.length; //When the number given is bigger than the levels, it will start again from the beginning.
	
	//Resets the data:
	Game.data.vitality = 100;
	Game.data.coins = 0;
	Game.data.level = level;
	Game.data.levelEnemyWave = 0;
	Game.data.levelEnemyWaveEndedTs = null;
	Game.data.levelEnemyWaveLastEnemyPointer = 0;
	Game.data.levelEnemyWaveLastEnemyCreatedTs = null;
	Game.data.enemies = [];
	Game.data.towers = [];
	Game.data.levelSucceeded = false;
	if (level === 0) { Game.data.score = 0; }

	//Loads the new map:
	Game.Levels.loadSource(Game.Levels._loadData(level)); //Using a copy of the array as this one could be modified to adapt it to the screen.
	
	//Updates all visual elements according to the screen size:
	Visual.resizeElements(CB_GEM.graphicSpritesSceneObject, true);

	//Shows the information for the first time:
	Visual.updateInfo(CB_GEM.graphicSpritesSceneObject);
	
	//Plays the song corresponding to the level:
	Sound.Music.playByLevel(level);

	return level;
}


//Restarts a level:
Game.Levels.restart = function()
{
	logMessage("Restarting level " + Game.data.level + "...");
	return Game.Levels.load(Game.data.level);
}


//Goes to the previous level:
Game.Levels.loadPrevious = function()
{
	return Game.Levels.load(Game.data.level > 0 ? Game.data.level - 1 : 0);
}


//Goes to the next level (when reaches last level, it will not go to the first one):
Game.Levels.loadNext = function()
{
	return Game.Levels.load(Game.data.level < Game.Levels.data.length -1 ? Game.data.level + 1 : Game.Levels.data.length - 1);
}


//Returns the map symbol which is in the given row and column from the given current (or current one if no one is given) or the value of 'returnOnFail' if not possible:
Game.Levels.getSymbolsFromMap = function(column, row, mindTowerType, asString, returnOnFail, mapArray)
{
	if (typeof(mapArray) === "undefined" || mapArray === null || !CB_isArray(mapArray))
	{
		mapArray = Game.data.levelMap;
	}
	
	if (typeof(mapArray[row]) !== "undefined" && typeof(mapArray[row][column]) !== "undefined")
	{
		return Game.Levels.getTypeFromSymbols(Game.data.levelMap[row][column], mindTowerType, asString, returnOnFail);
	}
	
	return null;
}


//Returns the type of the map symbol which is in the given row and column from the given current (or current one if no one is given) or the value of 'returnOnFail' if not possible:
Game.Levels.getSymbolsTypeFromMap = function(column, row, mindTowerType, asString, returnOnFail, mapArray)
{
	return Game.Levels.getSymbolsFromMap(column, row, mindTowerType, asString, returnOnFail, mapArray);
}


//Returns the type of the given map symbol or the value of 'returnOnFail' if not possible:
Game.Levels.getTypeFromSymbols = function(symbol, mindTowerType, asString, returnOnFail)
{
	var type = null;

	symbol = symbol || "";

	var firstCharacter = symbol.charAt(0);
	
	if (firstCharacter === Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_BUILDABLE) { type = "SOIL_UNWALKABLE_BUILDABLE"; }
	else if (firstCharacter === Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE) { type = "SOIL_UNWALKABLE_UNBUILDABLE"; }
	else if (firstCharacter === Game.Levels.SYMBOL_TYPES.SOIL_WALKABLE) { type = "SOIL_WALKABLE"; }
	else if (firstCharacter === Game.Levels.SYMBOL_TYPES.DESTINY) { type = "DESTINY"; }
	else if (firstCharacter === Game.Levels.SYMBOL_TYPES.ORIGIN) { type = "ORIGIN"; }
	else if (firstCharacter === Game.Levels.SYMBOL_TYPES.TOWER)
	{
		type = "TOWER";
		if (mindTowerType && typeof(Game.Levels.SYMBOL_TYPES["TOWER_" + symbol.charAt(1)]) !== "undefined") { type = "TOWER_" + symbol.charAt(1); }
	}
	if (type !== null && !asString)
	{
		type = Game.Levels.SYMBOL_TYPES[type];
	}
	return type === null ? returnOnFail : type;
}


//Returns the column and row of the map symbol which is in the given pixel coordinates:
Game.Levels.getSymbolsPositionFromCoordinates = function(x, y)
{
	//Looks through the current map:
	for (var r = 0; r < Visual._drawnMapElements.length; r++)
	{
		for (var c = 0; c < Visual._drawnMapElements[r].length; c++)
		{
			if (typeof(Visual._drawnMapElements[r][c]) !== "undefined")
			{
				//If the given coordinates are inside the current column and row (of the loop), return them:
				if (CB_Collisions.isPointOverRectangle(x, y, Visual._drawnMapElements[r][c].elementData.x, Visual._drawnMapElements[r][c].elementData.y, Visual._ELEMENTS_WIDTH, Visual._ELEMENTS_HEIGHT))
				{
					return { column: c, row: r };
				}
			}
		}
	}
	return { column: -1, row: -1 };
}


//Returns the real screen horizontal coordinates for a given coordinates on the original map:
Game.Levels.getRealScreenLeft = function(x)
{
	x = x || 0;
	return (x + Game.Levels.addedRowsAndColumns.columns.left) * Visual._ELEMENTS_WIDTH + CB_GEM.graphicSpritesSceneObject.getById("map").getById("current").left;
}


//Returns the real screen vertical coordinates for a given coordinates on the original map:
Game.Levels.getRealScreenTop = function(y)
{
	y = y || 0;
	return (y + Game.Levels.addedRowsAndColumns.rows.top) * Visual._ELEMENTS_HEIGHT + CB_GEM.graphicSpritesSceneObject.getById("map").getById("current").top;
}


//Returns the horizontal coordinates for a given coordinates on the screen:
Game.Levels.getMapLeft = function(x)
{
	x = x || 0;
	return Math.floor((x - CB_GEM.graphicSpritesSceneObject.getById("map").getById("current").left - Game.Levels.addedRowsAndColumns.columns.left * Visual._ELEMENTS_WIDTH) / Visual._ELEMENTS_WIDTH);
}


//Returns the vertical coordinates for a given coordinates on the screen:
Game.Levels.getMapTop = function(y)
{
	y = y || 0;
	return Math.floor((y - CB_GEM.graphicSpritesSceneObject.getById("map").getById("current").top - Game.Levels.addedRowsAndColumns.rows.top * Visual._ELEMENTS_HEIGHT) / Visual._ELEMENTS_HEIGHT);
}



//Returns the coordinates of the destiny of a given map (assumes there is only one):
Game.Levels._findDestinyOnMapCache = {};
Game.Levels._findDestinyOnMap = function(level)
{
	level = level || Game.data.level;
	
	if (typeof(Game.Levels._findDestinyOnMapCache[level]) !== "undefined")
	{
		return Game.Levels._findDestinyOnMapCache[level];
	}
	
	var map = Game.Levels.data[level].map;
	for (var r = 0; r < map.length; r++)
	{
		for (var c = 0; c < map[r].length; c++)
		{
			if (Game.Levels.getTypeFromSymbols(map[r][c]) === Game.Levels.SYMBOL_TYPES.DESTINY)
			{
				Game.Levels._findDestinyOnMapCache[level] = { x: c, y: r };
				return Game.Levels._findDestinyOnMapCache[level];
			}
		}
	}
	return null;
}


//Tells whether a given map symbol is walkable/destiny or not:
Game.Levels._isWalkableOrDestiny = function(symbol)
{
	return Game.Levels.getTypeFromSymbols(symbol) === Game.Levels.SYMBOL_TYPES.SOIL_WALKABLE || Game.Levels.getTypeFromSymbols(symbol) === Game.Levels.SYMBOL_TYPES.DESTINY;
}


//Returns the best path for a given origin and destiny in the desired map:
Game.Levels._calculatePathPointsToDestinyDirections = [ "up", "down", "left", "right" ];
Game.Levels._calculatePathPointsToDestinyCache = [];
Game.Levels._calculatePathPointsToDestiny = function(originX, originY, destinyX, destinyY, map, level, avoidCache, steps, stepsCounter, directionPrevious, stepsPrevious)
{
	level = (typeof(level) !== "undefined" && level !== null && !isNaN(level)) ? level : Game.data.level;

	if (!avoidCache)
	{
		if (typeof(Game.Levels._calculatePathPointsToDestinyCache[level]) !== "undefined")
		{
			if (typeof(Game.Levels._calculatePathPointsToDestinyCache[level][destinyX + "," + destinyY]) !== "undefined")
			{
				if (typeof(Game.Levels._calculatePathPointsToDestinyCache[level][destinyX + "," + destinyY][originX + "," + originY]) !== "undefined")
				{
					return Game.Levels._calculatePathPointsToDestinyCache[level][destinyX + "," + destinyY][originX + "," + originY];
				}
			}
		}
	}

	if (typeof(Game.Levels._calculatePathPointsToDestinyCache[level]) === "undefined")
	{
		Game.Levels._calculatePathPointsToDestinyCache[level] = [];
	}
	if (typeof(Game.Levels._calculatePathPointsToDestinyCache[level][destinyX + "," + destinyY]) === "undefined")
	{
		Game.Levels._calculatePathPointsToDestinyCache[level][destinyX + "," + destinyY] = {};
	}

	map = map || Game.Levels.data[level].map;
	
	stepsCounter = stepsCounter || 0;
	steps = steps || { stepsCounter: 0 };

	steps.x = originX;
	steps.y = originY;

	steps.stepsCounter += stepsCounter;

	steps.pathPoints = stepsPrevious && CB_isArray(stepsPrevious.pathPoints) ? CB_Arrays.copy(stepsPrevious.pathPoints) : [];
	steps.pathPoints[steps.pathPoints.length] = { x: originX, y: originY, direction: directionPrevious || null };

	//If destiny is found:
	if (originX === destinyX && originY === destinyY)
	{
		steps.destiny = true;
		steps.stepsCounterTotal = steps.stepsCounter;
		//Stores the returning value into the cache:
		Game.Levels._calculatePathPointsToDestinyCache[level][destinyX + "," + destinyY][originX + "," + originY] = steps;
		return steps;
	}

	var mapCopy = null;

	var destinyFound = false;

	//Going up:
	if (originY > 0)
	{
		if (Game.Levels._isWalkableOrDestiny(map[originY - 1][originX]))
		{
			mapCopy = CB_Arrays.copy(map);
			mapCopy[originY - 1][originX] = Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE; //Avoid repeating same step.
			steps["up"] = Game.Levels._calculatePathPointsToDestiny(originX, originY - 1, destinyX, destinyY, mapCopy, level, true, steps["up"], stepsCounter + 1, "up", steps);
			if (steps["up"] === null) { delete steps["up"]; }
		}
	}

	//Going down:
	if (originY < map.length - 1)
	{
		if (Game.Levels._isWalkableOrDestiny(map[originY + 1][originX]))
		{
			mapCopy = CB_Arrays.copy(map);
			mapCopy[originY + 1][originX] = Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE; //Avoid repeating same step.
			steps["down"] = Game.Levels._calculatePathPointsToDestiny(originX, originY + 1, destinyX, destinyY, mapCopy, level, true, steps["down"], stepsCounter + 1, "down", steps);
			if (steps["down"] === null) { delete steps["down"]; }
		}
	}

	//Going to the left side:
	if (originX > 0)
	{
		if (Game.Levels._isWalkableOrDestiny(map[originY][originX - 1]))
		{
			mapCopy = CB_Arrays.copy(map);
			mapCopy[originY][originX - 1] = Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE; //Avoid repeating same step.
			steps["left"] = Game.Levels._calculatePathPointsToDestiny(originX - 1, originY, destinyX, destinyY, mapCopy, level, true, steps["left"], stepsCounter + 1, "left", steps);
			if (steps["left"] === null) { delete steps["left"]; }
		}
	}

	//Going to the right side:
	if (originX < map[originY].length - 1)
	{
		if (Game.Levels._isWalkableOrDestiny(map[originY][originX + 1]))
		{
			mapCopy = CB_Arrays.copy(map);
			mapCopy[originY][originX + 1] = Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_UNBUILDABLE; //Avoid repeating same step.
			steps["right"] = Game.Levels._calculatePathPointsToDestiny(originX + 1, originY, destinyX, destinyY, mapCopy, level, true, steps["right"], stepsCounter + 1, "right", steps);
			if (steps["right"] === null) { delete steps["right"]; }
		}
	}

	//A dead end was found (no destiny could be reached and cannot perform more movements):
	if (!steps["up"] && !steps["down"] && !steps["left"] && !steps["right"])
	{
		steps = null;
	}
	else
	{
		//Removes longest paths:
		var directionLoop = null;
		var stepsCounterTotalMin = null;
		var directionKept = null;
		for (var x = 0; x < Game.Levels._calculatePathPointsToDestinyDirections.length; x++)
		{
			directionLoop = Game.Levels._calculatePathPointsToDestinyDirections[x];
			if (!steps[directionLoop]) { continue; }
			else if (stepsCounterTotalMin === null || steps[directionLoop].stepsCounterTotal < stepsCounterTotalMin)
			{
				if (directionKept !== null) { delete steps[directionKept]; }
				directionKept = directionLoop;
				stepsCounterTotalMin = steps[directionLoop].stepsCounterTotal;
			}
			else if (steps[directionLoop].stepsCounterTotal > stepsCounterTotalMin) { delete steps[directionLoop];	}
		}
		
		//If more than one path remains, means they cost the same steps:
		var pathsRemain = 0;
		for (var x = 0; x < Game.Levels._calculatePathPointsToDestinyDirections.length; x++)
		{
			directionLoop = Game.Levels._calculatePathPointsToDestinyDirections[x];
			if (steps[directionLoop]) { pathsRemain++; }
		}
		if (pathsRemain > 1)
		{
			//If there is a path following the same direction, we will choose it and remove the rest:
			if (directionPrevious && steps[directionPrevious])
			{
				for (var x = 0; x < Game.Levels._calculatePathPointsToDestinyDirections.length; x++)
				{
					directionLoop = Game.Levels._calculatePathPointsToDestinyDirections[x];
					if (directionLoop === directionPrevious) { directionKept = directionLoop; continue; }
					else if (!steps[directionLoop]) { continue; }
					else { delete steps[directionLoop]; }
				}
			}
			//...otherwise, we remove all except one:
			else
			{
				for (var x = 0; x < Game.Levels._calculatePathPointsToDestinyDirections.length && pathsRemain > 1; x++)
				{
					directionLoop = Game.Levels._calculatePathPointsToDestinyDirections[x];
					if (!steps[directionLoop]) { continue; }
					else { delete steps[directionLoop]; }
					directionKept = directionLoop;
					pathsRemain--;
				}
			}
		}
		
		if (directionKept)
		{
			steps.stepsCounterTotal = steps[directionKept].stepsCounterTotal;
			steps.pathPointsTotal = steps[directionKept].pathPointsTotal || steps[directionKept].pathPoints;
		}
	}

	//Stores the returning value into the cache:
	Game.Levels._calculatePathPointsToDestinyCache[level][destinyX + "," + destinyY][originX + "," + originY] = steps;
	
	return steps;
}


//Returns the number of enemies still alive:
Game.getEnemiesAlive = function()
{
	var enemiesAlive = [];
	
	for (var x = 0; x < Game.data.enemies.length; x++)
	{
		if (!Game.data.enemies[x].isDead) { enemiesAlive[enemiesAlive.length] = Game.data.enemies[x]; }
	}
	
	return enemiesAlive;
}