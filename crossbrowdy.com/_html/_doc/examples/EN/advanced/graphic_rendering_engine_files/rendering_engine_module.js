/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

//Constants and variables:
var CB_REM = function() { if (this === window || !(this instanceof CB_REM)) { return new CB_REM(); } return this._init(); }; //Rendering Engine Module main object and constructor.
CB_REM_PATH = CB_this.CB_REM_PATH || ""; //Path to the graphic rendering engine module.
CB_REM.DEBUG_MESSAGES = !!CB_this.CB_REM_DEBUG_MESSAGES; //Sets whether to show debug messages or not.


//Module basic configuration:
CB_Modules.modules["RENDERING_ENGINE_MODULE"] =
{
	//Name of the module:
	"name" : "RENDERING_ENGINE_MODULE",

	//Status (UNKNOWN, UNLOADED, LOADING, LOADED, READY or FAILED):
	"status" : CB_Modules.STATUSES.UNLOADED,

	//Function to call as soon as the module is called (before loading its files):
	"onCall" :
		function(scriptPathGiven)
		{
			//If a 'CB_REM_PATH' is given, updates the needed files to search for them in the desired path:
			if (CB_REM_PATH)
			{
				CB_Modules.modules["RENDERING_ENGINE_MODULE"].neededFiles = {};
				CB_Modules.modules["RENDERING_ENGINE_MODULE"].neededFiles[CB_REM_PATH + "rendering_engine.js"] = { load: true, mandatory: true, absolutePath: true };
			}
			
			if (CB_REM.DEBUG_MESSAGES) { CB_console("[CB_REM] RENDERING_ENGINE_MODULE called"); }
			CB_Modules.setStatus("RENDERING_ENGINE_MODULE", CB_Modules.STATUSES.LOADED);
		},

	//Callback function to call when the module has been loaded successfully:
	"onLoad" :
		function(scriptPathGiven)
		{
			if (CB_REM.DEBUG_MESSAGES) { CB_console("[CB_REM] RENDERING_ENGINE_MODULE loaded"); }
			
			//Sets the module ready when CrossBase module is ready:
			var checkCrossBaseReady =
				function()
				{
					//If CrossBase module is not ready yet:
					if (!CB_Modules.modules["CrossBase"] || CB_Modules.modules["CrossBase"].status !== CB_Modules.STATUSES.READY)
					{
						return setTimeout(checkCrossBaseReady, 1); //Calls this checking function again.
					}
					//...otherwise, if CrossBase module is ready, proceeds:
					else
					{
						CB_REM._init(); //Calls initialization function.
						CB_Modules.setStatus("RENDERING_ENGINE_MODULE", CB_Modules.STATUSES.READY); //Sets the RENDERING_ENGINE_MODULE as ready.
					}
				};
			checkCrossBaseReady();
		},

	//Callback function to call when the module is ready:
	"onReady" :
		function(scriptPathGiven)
		{
			if (CB_REM.DEBUG_MESSAGES) { CB_console("[CB_REM] RENDERING_ENGINE_MODULE ready"); }
		},

	//Needed files:
	"neededFiles" :
		{
			//Filepaths:
			"rendering_engine.js" : { load: true, mandatory: true, absolutePath: true } //Needs to be loaded. Mandatory. Relative path.
		},

	//Credits:
	"credits" : "[CB] - RENDERING_ENGINE_MODULE by Joan Alba Maldonado" //Credits will be shown in the console when loading.
};


if (CB_REM.DEBUG_MESSAGES) { CB_console("[CB_REM] rendering_engine_module.js (RENDERING_ENGINE_MODULE file) inserted in the document"); }