var Input = {}; //Class to manage input.


//It will store the column and row where the mouse is over:
Input.mouseData =
{
	column: -1,
	row: -1
};


//Initializes the class:
Input.init = function()
{
	//Sets the mouse events:
	CB_Mouse.onMove
	(
		function()
		{
			if (!Game.data.gameStarted) { return; }
			
			//Updates the row and column where the mouse is over:
			Input.mouseData = Game.Levels.getSymbolPositionFromCoordinates(CB_Mouse.getX(), CB_Mouse.getY());
			
			//Sets the corresponding mouse cursor:
			if (Game.Levels.getSymbolTypeFromMap(Input.mouseData.column, Input.mouseData.row) === Game.Levels.SYMBOL_TYPES.SOIL_UNWALKABLE_BUILDABLE) { CB_Mouse.setCSS("pointer"); }
			else { CB_Mouse.setCSS(); }
		}
	);
	
	//Sets the touch events:
	//TODO.
}


//Input management (some controllers can also fire keyboard events):
Input._inputProcessedLastTime = 0;
Input._ignoreInputMs = 150; //Number of milliseconds that the input will be ignored after the player has been moved (to avoid moving or processing the input too fast).
Input.manage = function(action)
{
	//If not enough time has been elapsed since the last movement, exits (to avoid moving or processing the input too fast):
	if (CB_Device.getTiming() < Input._inputProcessedLastTime + Input._ignoreInputMs) { return; }

	//If the game has not started:
	if (!Game.data.gameStarted)
	{
		//If return, space or a button (button 1, 2 or 3) or axis from any gamepad is pressed, starts the game:
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.ENTER) || CB_Keyboard.isKeyDown(CB_Keyboard.keys.SPACEBAR) || CB_Controllers.isButtonDown([1, 2, 3]) || CB_Controllers.getAxesDown().length > 0 || CB_Controllers.getAxesDown("", -1).length > 0)
		{
			if (!Game.data.musicEnabled || Game.data.musicLoaded && Game.data.musicChecked) { Game.start(CB_GEM.graphicSpritesSceneObject); }
			else if (Game.data.musicLoaded) { Sound.Music.check(); }
			else { Sound.Music.prepare(); }
			
			Input._inputProcessedLastTime = CB_Device.getTiming(); //As we have processed the input, updates the time with the new one (to avoid moving or processing the input too fast).
			
			return;
		}
	}
	//...otherwise, if the game has started, manages the input to move the player (if possible):
	else
	{
		var actionPerformed = false;
		
		
		//After pressing the ESC key or a specific gamepad button, ends the game:
		if (action === "ABORT" || CB_Keyboard.isKeyDown(CB_Keyboard.keys.ESC) || CB_Controllers.isButtonDown(9))
		{
			Game.end("Game aborted");
			actionPerformed = true;
		}
		//...otherwise, if we want to go to the previous level, goes there:
		else if (action === "PREVIOUS_LEVEL" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.O]) || CB_Controllers.isButtonDown(4) || CB_Controllers.isButtonDown(7))
		{
			Game.Levels.loadPrevious();
			actionPerformed = true;
		}
		//...otherwise, if we want to go to the next level, goes there:
		else if (action === "NEXT_LEVEL" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.P]) || CB_Controllers.isButtonDown(5) || CB_Controllers.isButtonDown(6))
		{
			Game.Levels.loadNext(); //It will not cycle (when reaches last level, will not go to the first one).
			actionPerformed = true;
		}
		//...otherwise, if we want to restart the level, restarts it:
		else if (action === "RESTART" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.R, CB_Keyboard.keys.F9]) || CB_Controllers.isButtonDown(3))
		{
			Game.Levels.restart();
			actionPerformed = true;
		}
		//...otherwise, if we want to toggle full screen, we try it:
		//NOTE: some browsers will fail to enable full screen mode if it is not requested through a user-driven event (as "onClick", "onTouchStart", etc.).
		else if (action === "FULL_SCREEN_TOGGLE" || typeof(action) === "undefined" && CB_Keyboard.isKeyDown([CB_Keyboard.keys.F]) || CB_Controllers.isButtonDown(8))
		{
			Visual.fullScreenToggle();
			actionPerformed = true;
		}
		
		//If an action has performed already, just exits:
		if (actionPerformed)
		{
			Input._inputProcessedLastTime = CB_Device.getTiming(); //As we have processed the input, updates the time with the new one (to avoid moving or processing the input too fast).
			return;
		}
		
		//TODO.
		//var mapCurrent = Game.data.levelMap;
	}
}