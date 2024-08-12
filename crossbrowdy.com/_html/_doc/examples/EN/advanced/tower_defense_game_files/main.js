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
	logMessage("CrossBrowdy and all needed modules loaded. Starting game...");
	
	//Makes some DOM element non-draggable, non-selectable, etc.:
	makeElementSolidById("music_loader_checker");
	makeElementSolidById("loading");
	makeElementSolidById("debug_switch");
	makeElementSolidById("start_button");
	makeElementSolidById("CB_console");
	makeElementSolidById("crossbrowdy_info");
	makeElementSolid(document.body); //CrossBrowdy will create the 'document.body' property for those clients which do not have it natively.

	Game.init(); //Initializes the Game class.
	
	//Defines needed data:
	CB_GEM.data = Game.data; //Data stored in the game engine module (can be exported to save the game status).
	
	//Sets the desired sprites scene data (can be modified dynamically):
	CB_GEM.spritesGroupsData = Visual.getSpritesGroupsData();
	
	//Defines the callbacks for the game loop:
	CB_GEM.onLoopStart = Game.onLoopStart; //When the game loop starts, before rendering the graphics (if it returns false, it will skip rendering in this loop).
	CB_GEM.onLoopEnd = Game.onLoopEnd; //When the game loop ends, after rendering the graphics (not executed if the 'CB_GEM.onLoopStart' function returned false).
	
	//Modifies the default refresh rate for the game loop and the number of cycles per loop (it will affect the FPS):
	CB_GEM.options.LOOP_REFRESH_RATE = Visual.LOOP_REFRESH_RATE;
	CB_GEM.options.RENDERING_CYCLES_PER_LOOP = Visual.RENDERING_CYCLES_PER_LOOP;
	
	//Starts the game engine module:
	CB_GEM.begin
	(
		//onStart:
		function(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectBuffer, FPSSprites) //'FPSSprites' contains the 'CB_GraphicSprites.SPRITES_OBJECT' object used to display the FPS counter.
		{
			FPSSprites.setDisabled(false); //Set to true to hide FPS counter.
	
			CB_REM.DEFAULT_FILTER = null; //No default canvas filter when no one is found.
	
			//Game.Levels.loadSource(0);
			Visual.resizeElements(graphicSpritesSceneObject); //Updates all visual elements according to the screen size.
			Visual.updateInfo(graphicSpritesSceneObject); //Shows the information for the first time.
	
			//Updates all when the screen is resized or changes its orientation:
			CB_GEM.onResize = function(graphicSpritesSceneObject, CB_REM_dataObject, CB_CanvasObject, CB_CanvasObjectBuffer)
			{
				Visual.resizeElements(graphicSpritesSceneObject, false, true);
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
		function(error) { logMessage("Error: " + error); }
	);
}


//Places a message in the console:
function logMessage(message)
{
	return CB_console("[TOWER_DEFENSE_GAME] " + message);
}


//Makes a DOM element non-draggable, non-selectable, etc.:
function makeElementSolid(element)
{
	if (element !== null)
	{
		element.style.draggable = false;
		element.style.touchAction = "none";
		CB_Elements.contextMenuDisable(element);
		CB_Elements.preventSelection(element);
	}
	return element;
}


//Makes a DOM element non-draggable, non-selectable, etc. by its identifier:
function makeElementSolidById(elementId)
{
	return makeElementSolid(CB_Elements.id(elementId));
}