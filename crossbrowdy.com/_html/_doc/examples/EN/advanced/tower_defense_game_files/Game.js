var Game = {}; //Class to manage game logic.
Game.Levels = {}; //Class to manage game levels.


//Game data:
//NOTE: most of the data will be calculated automatically and dynamically.
Game.data =
{
	//General data:
	soundEnabled: true, //Set to false to disable sound.
	musicEnabled: true, //Set to false to disable music.
	vibrationEnabled: true, //Set to false to disable sound.
	musicLoaded: false,
	musicChecked: false,
	gameStarted: false,
	level: 0
};


//Initializes the class:
Game.init = function()
{
	Game.Levels.data = _LEVELS;	
}


//Executed each game loop, before rendering graphics:
Game.onLoopStart = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop starts, before rendering the graphics (if it returns false, it will skip rendering in this loop):
{
	//Manages input:
	Input.manage();

	//TODO.
};


//Executed each game loop, after rendering graphics:
Game.onLoopEnd = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop ends, after rendering the graphics (not executed if the 'CB_GEM.onLoopStart' function returned false):
{
	if (!Game.data.gameStarted) { return; }
	
	//TODO.
};


//Starts the game:
Game.start = function(graphicSpritesSceneObject)
{
	if (Game.data.gameStarted) { return; }

	graphicSpritesSceneObject = graphicSpritesSceneObject || CB_GEM.graphicSpritesSceneObject;
	if (!graphicSpritesSceneObject) { return; }
	
	//Hides the start button:
	CB_Elements.hideById("start_button");
	
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
		showMessage("Error preparing sounds or playing sound with 'start' ID: " + E);
		Game.data.soundEnabled = false; //If it fails, disables the sound.
	}

	if (Game.data.vibrationEnabled) { CB_Device.Vibration.start(100); } //Makes the device vibrate.

	//Enables the level selector:
	var levelSelector = CB_Elements.id("level_selector");
	if (levelSelector !== null)
	{
		levelSelector.disabled = false;
	}

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
	CB_Elements.insertContentById("start_button", (message !== "" ? message + "<br />" : "") + "Start game!")
	CB_Elements.showById("start_button"); //Shows the start button again.
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


//Fills the level array with unwalkable tiles the rows needed (to adapt it to the screen) and returns it:
Game.Levels._loadDataRoundingFunction = null;
Game.Levels._loadDataRows = function(levelData, maxWidthFound, fillOverflow)
{
	var levelHeight = levelData.length;
	var rowsNeeded = Math.ceil((CB_Screen.getWindowHeight() / Visual._ELEMENTS_HEIGHT) - levelHeight);

	if (rowsNeeded > 0)
	{
		if (fillOverflow) { Game.Levels._loadDataRoundingFunction = Math.ceil; }
		else { Game.Levels._loadDataRoundingFunction = Math.floor; }
		for (var x = 0; x < Game.Levels._loadDataRoundingFunction(rowsNeeded / 2); x++)
		{
			levelData.unshift(Game.Levels._getArrayFilled(" ", 0, maxWidthFound - 1));
		}
		for (; x >= 1; x--)
		{
			levelData[levelData.length] = Game.Levels._getArrayFilled(" ", 0, maxWidthFound - 1);
		}
	}
	return levelData;
}


//Fills the level array with unwalkable tiles the columns needed (to adapt it to the screen) and returns it:
Game.Levels._loadDataColumns = function(levelData, fillOverflow)
{
	if (fillOverflow) { Game.Levels._loadDataRoundingFunction = Math.ceil; }
	else { Game.Levels._loadDataRoundingFunction = Math.floor; }

	levelHeight = levelData.length;
	var columnsNeeded = 0;
	for (var x = 0; x < levelHeight; x++)
	{
		columnsNeeded = Math.ceil((CB_Screen.getWindowWidth() / Visual._ELEMENTS_WIDTH) - levelData[x].length);
		
		if (columnsNeeded > 0)
		{
			for (var y = 0; y < Game.Levels._loadDataRoundingFunction(columnsNeeded / 2); y++)
			{
				levelData[x].unshift(" ");
			}
			for (; y >= 1; y--)
			{
				levelData[x][levelData[x].length] = " ";
			}
		}
	}
	return levelData;
}


//Fills the level array with unwalkable tiles if needed (to adapt it to the screen) and returns it (using an internal cache when possible):
Game.Levels._loadDataCache = [];
Game.Levels._fillOverflowDefault = true;
Game.Levels._loadData = function(level, avoidCache)
{
	//If it was not adapted and cached before, does it:
	if (avoidCache || typeof(Game.Levels._loadDataCache[level]) === "undefined" || Game.Levels._loadDataCache[level] === null)
	{
		//Adapts the level to the screen filling the missing data with blank spaces:
		var levelData = CB_Arrays.copy(Game.Levels.data[level]);
		
		var levelHeight = levelData.length;
		var maxWidthFound = 1;
		for (var x = 0; x < levelHeight; x++)
		{
			if (levelData.length && levelData[x].length > maxWidthFound) { maxWidthFound = levelData[x].length; }
		}
		
		Visual._ELEMENTS_HEIGHT = parseInt(CB_Screen.getWindowHeight() / levelHeight);
		Visual._ELEMENTS_WIDTH = parseInt(CB_Screen.getWindowWidth() / maxWidthFound);
		Visual._ELEMENTS_WIDTH = Visual._ELEMENTS_HEIGHT = Math.min(Visual._ELEMENTS_WIDTH, Visual._ELEMENTS_HEIGHT);

		Game.Levels._loadDataRows(levelData, maxWidthFound, Game.Levels._fillOverflowDefault);
		Game.Levels._loadDataColumns(levelData, Game.Levels._fillOverflowDefault);
		
		//Caches the level:
		Game.Levels._loadDataCache[level] = levelData;
	}
	
	return Game.Levels._loadDataCache[level];
}


//Loads the desired level:
Game.Levels.load = function(level)
{
	//Sanitizes the level number:
	level = level || 0;
	if (level < 0) { level = 0; }
	level %= Game.Levels.data.length; //When the number given is bigger than the levels, it will start again from the beginning.
	
	//Resets the data:
	Game.data.level = level;
	
	//Loads the new map:
	CB_GEM.graphicSpritesSceneObject.getById("map").getById("current").src = Game.Levels._loadData(level); //Using a copy of the array as this one could be modified to adapt it to the screen.
	
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
	showMessage("Restarting level " + Game.data.level + "...");
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