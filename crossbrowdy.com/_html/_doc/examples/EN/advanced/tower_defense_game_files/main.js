/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

//Path to the graphic rendering engine module:
var CB_GEM_PATH = CB_GEM_PATH || "../simple_game_engine_files/";

//Defines whether to shows debug messages or not:
var CB_GEM_DEBUG_MESSAGES = false;

//Adds the game engine module to CrossBrowdy:
var CB_GEM_MODULE_NEEDED_MODULES = {};
CB_GEM_MODULE_NEEDED_MODULES[CB_GEM_PATH + "game_engine_module.js"] = { load: true, mandatory: true, absolutePath: true };
CB_Modules.addNeededModule(CB_NAME, "GAME_ENGINE_MODULE", CB_GEM_MODULE_NEEDED_MODULES);


CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	showMessage("CrossBrowdy and all needed modules loaded. Starting game...");
	
	Game.init(); //Initializes the Game class.
	
	//Defines needed data:
	CB_GEM.data = Game.data; //Data stored in the game engine module (can be exported to save the game status).
	
	//Sets the desired sprites scene data (can be modified dynamically):
	CB_GEM.spritesGroupsData = Visual.getSpritesGroupsData();
	
	//Defines the callbacks for the game loop:
	CB_GEM.onLoopStart = Game.onLoopStart; //When the game loop starts, before rendering the graphics (if it returns false, it will skip rendering in this loop).
	CB_GEM.onLoopEnd = Game.onLoopEnd; //When the game loop ends, after rendering the graphics (not executed if the 'CB_GEM.onLoopStart' function returned false).
	
	//Modifies the default refresh rate for the game loop (it will affect the FPS):
	CB_GEM.options.REFRESH_RATE = Visual.REFRESH_RATE;
	
	//Starts the game engine module:
	CB_GEM.begin
	(
		//onStart:
		function(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectBuffer, FPSSprites) //'FPSSprites' contains the 'CB_GraphicSprites.SPRITES_OBJECT' object used to display the FPS counter.
		{
			FPSSprites.setDisabled(false); //Set to true to hide FPS counter.
	
			Visual.resizeElements(graphicSpritesSceneObject); //Updates all visual elements according to the screen size.

			Visual.updateInfo(graphicSpritesSceneObject); //Shows the information for the first time.
	
			//Updates all when the screen is resized or changes its orientation:
			CB_GEM.onResize = function(graphicSpritesSceneObject, CB_REM_dataObject, CB_CanvasObject, CB_CanvasObjectBuffer)
			{
				Visual.resizeElements(graphicSpritesSceneObject);
				Visual.updateInfo(graphicSpritesSceneObject);
			};
			
			CB_Elements.hideById("loading"); //Hides the loading message.
			
			//If music is enabled, shows the music loader:
			if (Game.data.musicEnabled)
			{
				CB_Events.removeByName(CB_Elements.id("button_load_check_music"), "click"); //Removes the previous event handler from the button (if any).
				CB_Events.on(CB_Elements.id("button_load_check_music"), "click", Sound.Music.prepare); //Attaches the event to the button to load the music.
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
				CB_Events.on(debugCheckbox, "change", function() { CB_GEM_DEBUG_MESSAGES = !!debugCheckbox.checked; Visual.updateInfo(graphicSpritesSceneObject); });
			}
		},
		
		//onError:
		function(error) { showMessage("Error: " + error); }
	);
}


//Shows a message in the console:
function showMessage(message)
{
	return CB_console("[TOWER_DEFENSE_GAME] " + message);
}