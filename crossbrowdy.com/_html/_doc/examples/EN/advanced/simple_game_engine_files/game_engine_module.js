/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

//Constants and variables:
var CB_GEM = CB_this.CB_GEM || {}; //Game Engine Module object.
CB_GEM.PATH = CB_this.CB_GEM_PATH || ""; //Path to the game rendering engine module.
CB_GEM.REM_PATH = CB_GEM.REM_PATH || "../graphic_rendering_engine_files/"; //Path to the graphic rendering engine module.
CB_GEM.DEBUG_MESSAGES = !!CB_this.CB_GEM_DEBUG_MESSAGES; //Sets whether to show debug messages or not.


//Module basic configuration:
CB_Modules.modules["GAME_ENGINE_MODULE"] =
{
	//Name of the module:
	"name" : "GAME_ENGINE_MODULE",

	//Status (UNKNOWN, UNLOADED, LOADING, LOADED, READY or FAILED):
	"status" : CB_Modules.STATUSES.UNLOADED,

	//Function to call as soon as the module is called (before loading its files):
	"onCall" :
		function(scriptPathGiven)
		{
			if (CB_GEM.PATH)
			{
				CB_Modules.modules["GAME_ENGINE_MODULE"].neededFiles = {};
				CB_Modules.modules["GAME_ENGINE_MODULE"].neededFiles[CB_GEM.PATH + "game_engine.js"] = { load: true, mandatory: true, absolutePath: true };
			}
			
			//Adds the rendering engine module to the game engine module:
			CB_this.CB_REM_DEBUG_MESSAGES = CB_GEM.DEBUG_MESSAGES;
			CB_this.CB_REM_PATH = CB_GEM.REM_PATH;
			var CB_REM_MODULE_NEEDED_MODULES = {};
			CB_REM_MODULE_NEEDED_MODULES[CB_GEM.REM_PATH + "rendering_engine_module.js"] = { load: true, mandatory: true, absolutePath: true };
			CB_Modules.modules["GAME_ENGINE_MODULE"].neededModules = null;
			CB_Modules.addNeededModule("GAME_ENGINE_MODULE", "RENDERING_ENGINE_MODULE", CB_REM_MODULE_NEEDED_MODULES);

			if (CB_GEM.DEBUG_MESSAGES) { CB_console("GAME_ENGINE_MODULE called"); }
			CB_Modules.setStatus("GAME_ENGINE_MODULE", CB_Modules.STATUSES.LOADED);
		},

	//Callback function to call when the module has been loaded successfully:
	"onLoad" :
		function(scriptPathGiven)
		{
			if (CB_GEM.DEBUG_MESSAGES) { CB_console("GAME_ENGINE_MODULE loaded"); }
			
			//Sets the module ready when CrossBase module is ready:
			var checkRenderingEngineReady =
				function()
				{
					//If CrossBase module is not ready yet:
					if (!CB_Modules.modules["RENDERING_ENGINE_MODULE"] || CB_Modules.modules["RENDERING_ENGINE_MODULE"].status !== CB_Modules.STATUSES.READY)
					{
						return setTimeout(checkRenderingEngineReady, 1); //Calls this checking function again.
					}
					//...otherwise, if CrossBase module is ready, proceeds:
					else
					{
						CB_GEM._init(); //Calls initialization function.
						
						//Applies the options set by the user (if any):
						CB_applyOptions("CrossBrowdy");
						CB_applyOptions("CrossBase");
						
						CB_Modules.setStatus("GAME_ENGINE_MODULE", CB_Modules.STATUSES.READY); //Sets the GAME_ENGINE_MODULE as ready.
					}
				};
			checkRenderingEngineReady();
		},

	//Callback function to call when the module is ready:
	"onReady" :
		function(scriptPathGiven)
		{
			if (CB_GEM.DEBUG_MESSAGES) { CB_console("GAME_ENGINE_MODULE ready"); }
		},

	//Needed files:
	"neededFiles" :
		{
			//Filepaths:
			"game_engine.js" : { load: true, mandatory: true, absolutePath: true } //Needs to be loaded. Mandatory. Relative path.
		},

	//Needed modules:
	"neededModules" :
		[
			{
				"name" : "RENDERING_ENGINE_MODULE",
				"neededFiles" : { "rendering_engine_module.js" : { load: true, mandatory: true, absolutePath: true } }
			}
		],

	//Credits:
	"credits" : "[CB] - GAME_ENGINE_MODULE by Joan Alba Maldonado" //Credits will be shown in the console when loading.
};


if (CB_GEM.DEBUG_MESSAGES) { CB_console("game_engine_module.js (GAME_ENGINE_MODULE file) inserted in the document"); }