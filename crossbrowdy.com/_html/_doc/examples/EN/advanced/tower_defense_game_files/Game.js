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
	if (CB_GEM.data.gameStarted) { return; }

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
		CB_GEM.data.soundEnabled = false; //If it fails, disables the sound.
	}

	if (CB_GEM.data.vibrationEnabled) { CB_Device.Vibration.start(100); } //Makes the device vibrate.

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
Game.end = function(message)
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
Game.Levels.load = function(level)
{
	if (!Game.data.gameStarted) { showMessage("Level cannot be loaded. Game did not start yet!"); return CB_GEM.data.level || 0; }
	
	//Sanitizes the level number:
	level = level || 0;
	if (level < 0) { level = 0; }
	level %= Game.Levels.data.length; //When the number given is bigger than the levels, it will start again from the beginning.
	
	//Resets the data:
	CB_GEM.data.level = level;
	
	//Loads the new map:
	CB_GEM.graphicSpritesSceneObject.getById("map_group").getById("map_current").src = CB_Arrays.copy(Game.Levels.data[level]); //Using a copy of the array as this one will be modified by the game when elements move.
	
	//Updates all visual elements according to the screen size:
	Visual.resizeElements(CB_GEM.graphicSpritesSceneObject);

	//Shows the information for the first time:
	Visual.updateInfo(CB_GEM.graphicSpritesSceneObject);
	
	//Plays the song corresponding to the level:
	Sound.Music.playByLevel(level);
	
	return level;
}


//Restarts a level:
Game.Levels.restart = function()
{
	showMessage("Restarting level " + CB_GEM.data.level + "...");
	return Game.Levels.load(CB_GEM.data.level);
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