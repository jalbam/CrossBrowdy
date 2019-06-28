// CrossBrowdy by Joan Alba Maldonado (workindalian@gmail.com).

/**
 * @file Main CrossBrowdy file.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */

 
//CrossBrowdy constants and variables:
/**
 * Keeps the name of the script (the main script will use this name with the ".js" extension). Case sensitive.
 *	@constant
 *  @type {string}
 *  @default
 */
var CB_NAME = "CrossBrowdy";

/**
 * CrossBrowdy version.
 *	@constant
 *  @type {string}
 */
var CB_VERSION = "0.99.43.1";

/**
 * Keeps the CrossBrowdy "this" context.
 *	@constant
 *  @type {Object}
 */
var CB_this = this;

/**
 * Two-dimensional object defined by the user with the desired options for CrossBrowdy and its modules. The options supported are the ones used by the {@link CB_Configuration} object.
	<br>
	First-level indexes should belong to the module name (or to "CrossBrowdy", for general options) and second-level indexes should belong to the option name.
	<br>
	Example:
	<br>
	{
		CrossBrowdy:
		{
			CB_console_ALLOW_ALERTS: false
		},
		CrossBase:
		{
			SLCANVAS_LOAD : true,
			FLASHCANVAS_LOAD : true
		}
	}
 
 *	@constant CB_OPTIONS
 *  @type {Object}
 *  @default undefined
 */

/**
 * Static class to manage the configuration. It will be overwritten with the values defined in {@link CB_OPTIONS} (if any).
	<br>
	First-level indexes should belong to the module name and second-level indexes should belong to the option name.
	<br>
	Follows the same format as {@link CB_OPTIONS}.
 * @namespace
*/
var CB_Configuration = {};

/**
  Property that contains an object with the options for the main script.
  * @namespace CB_Configuration.CrossBrowdy
 */
CB_Configuration[CB_NAME] =
{
	/**
	 * Default path of the script (path can be changed when {@link CB_init} is called)
	 *  @memberof CB_Configuration.CrossBrowdy
	 *	@constant
	 *  @type {string}
	 *  @default {@link CB_NAME} + "/"
	 */
	SCRIPT_PATH_DEFAULT: "../" + CB_NAME + "/",
	
	
	/**
	 * Defines whether to show the splash screen in the beginning by default or not.
	 *  @memberof CB_Configuration.CrossBrowdy
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	SHOW_SPLASH_SCREEN_DEFAULT: true,
	
	
	/**
	 * Defines whether to send statistics or not.
	 *  @memberof CB_Configuration.CrossBrowdy
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	STATS: false,
	
	
	/**
	 * URL to send the statistics if {@link CB_Configuration.CrossBrowdy.STATS} is enabled.
	 *  @memberof CB_Configuration.CrossBrowdy
	 *	@constant
	 *  @type {string}
	 *  @default
	 */
	STATS_URL: "http://www.crossbrowdy.com/stats/CB_stats.php",
	
	
	/**
	 * Defines whether to allow the use of alert()'s as a fallback when using {@link CB_console} and neither the console nor a DIV element with "CB_console" id are found.
	 *  @memberof CB_Configuration.CrossBrowdy
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_console_ALLOW_ALERTS: true,
	
	
	/**
	 * Default milliseconds before firing the timeout callback for the {@link CB_includeJSFile} function.
	 *  @memberof CB_Configuration.CrossBrowdy
	 *	@constant
	 *  @type {int}
	 *  @default
	 */
	CB_includeJSFile_TIMEOUT_MS_DEFAULT: 90000
};



/**
 * It will contain the CrossBrowdy path when it finally loads.
 *	@var
 *  @readonly
 *  @type {string}
 *  @default {@link CB_scriptPathCalculate}();
 */
var CB_scriptPath = CB_scriptPathCalculate(); //Can be modified later.


//Applies the options set by the user (if any):
CB_applyOptions(CB_NAME, CB_this);


//Needed modules:
/**
 * Static class that contains all the modules and the tools to manage them.
 *  @namespace
 */
var CB_Modules = {};
CB_Modules.modules = {};

/**
 * Enum which defines possible module statuses.
 *  @memberof CB_Modules
 *  @readonly
 *  @enum {integer} CB_Modules.STATUSES
 */
CB_Modules.STATUSES =
{
	/** The module has failed to load. */
	FAILED: -1,
	/** The module has an unkwnown status. */
	UNKNOWN : 0,
	/** The module is not loaded yet. Default status. */
	UNLOADED : 1,
	/** The module is being loading. */
	LOADING : 2,
	/** The module has loaded successfully (coudl be not ready yet). */
	LOADED : 3,
	/** The module has loaded successfully and it is ready to be used. */
	READY : 4
};

/**
 * Callback that is called before loading a file and should return true if we want to load the file or false otherwise.
 *  @memberof CB_Modules
 *  @callback CB_Modules.neededFile_LOAD_CHECKER
 *  @param {string} filepath - Filepath of the needed file (including the filename).
 *  @param {CB_Modules.NEEDED_FILE} neededFile - Object that contains the needed file.
 *  @returns {boolean} - Returns true if we want to load the file or false otherwise.
 */

/**
 * Object that contains a needed file for a module.
 *  @memberof CB_Modules
 *  @typedef {Object} CB_Modules.NEEDED_FILE
 *  @property {boolean} [load=false] - Defines whether to load the file or not.
 *  @property {boolean} [mandatory=false] - Defines whether the file is mandatory. If the file is not mandatory, its module could be declared as loaded successfully before the file is loaded (and maybe never will).
 *  @property {boolean} [absolutePath=false] - Defines whether the path of the file is relative to the path of the main script or absolute.
 *  @property {CB_Modules.neededFile_LOAD_CHECKER} [loadChecker] - Callback that will be called when the file tries to be loaded and should return true if the file needs to be loaded.
 *  @property {string} [id] - Desired string to identify the file.
 *  @property {array} [requires] - Array of strings with the IDs of the files that must be loaded before loading this file. The file will not be loaded until the required files are loaded first.
 */

 /**
 * Object that contains the needed files for a module. Each property will represent a needed file.
 *  @memberof CB_Modules
 *  @typedef {Object} CB_Modules.NEEDED_FILES
 *  @property {CB_Modules.NEEDED_FILE} path_to_the_file - Object that contains a needed file for a module. The property name must be either the path to the file or a variable containing it. Tto use a variable, the name of the property must start with "VALUEOF_" and continue with the name of the variable. In the case that the variable is an object, each property must be separated by a dot (".").
 */

 
 /**
 * Object that contains a needed module for a parent module.
 *  @memberof CB_Modules
 *  @typedef {Object} CB_Modules.NEEDED_MODULE
 *  @property {string} name - Name of the module.
 *  @property {CB_Modules.NEEDED_FILES} neededFiles - Object containing the needed files.
 */
 
 /**
 * Callback for the different events of a module.
 *  @memberof CB_Modules
 *  @callback CB_Modules.CALLBACK
 *  @param {string} scriptPath - The value for the "scriptPath" parameter used by {@link CB_init} when it was called.
 */
 
/**
 * Object that contains a module.
 *  @memberof CB_Modules
 *  @typedef {Object} CB_Modules.MODULE
 *  @property {string} name - Name of the module.
 *  @property {CB_Modules.STATUSES} status - Module status.
 *  @property {CB_Modules.CALLBACK} onCall - Callback for when the module is called to be loaded.
 *  @property {CB_Modules.CALLBACK} onLoad - Callback for when the module loads successfully.
 *  @property {CB_Modules.CALLBACK} onReady - Callback for when the module is totally ready.
 *  @property {CB_Modules.CALLBACK} onFail - Callback for when the module fails to load. NOT IMPLEMENTED YET.
 *  @property {CB_Modules.NEEDED_FILES} neededFiles - Object containing the needed files.
 *  @property {array} neededModules - Array of {@link CB_Modules.NEEDED_MODULE} objects, containing the needed modules.
 *  @property {string} credits - Credits of the module.
 */

//Main module basic configuration:
/**
 * Contains all the modules, one per property.
 *  @var CB_Modules.modules
 *  @type {Object}
 *  @property {CB_Modules.MODULE} name_of_the_module - Object that contains the module data. The property name must be the name of the module.
 */
CB_Modules.modules[CB_NAME] =
{
	//Name of the module:
	"name" : CB_NAME,
	//Status (UNKNOWN, UNLOADED, LOADING, LOADED, READY or FAILED):
	"status" : CB_Modules.STATUSES.UNLOADED,
	//Function to call as soon as the module is called (before loading its scripts):
	"onCall" :
		function(scriptPathGiven)
		{
			if (CB_Configuration[CB_NAME].STATS) { CB_sendStats(); } //If we want, includes the file for statistics purposes.
			CB_Modules.setStatus(CB_NAME, CB_Modules.STATUSES.LOADED);
		}, 
	//Callback function to call when the module has been loaded successfully:
	"onLoad" :
		function(scriptPathGiven)
		{
			CB_Modules.setStatus(CB_NAME, CB_Modules.STATUSES.READY);
		},
	//Callback function to call when the module is ready:
	"onReady" :
		function(scriptPathGiven)
		{
			CB_scriptPath = scriptPathGiven; //The path given was correct so we set it.
			CB_ready = true; //Set as it's ready.
		},
	//Callback function to call when module has not been loaded successfully:
	//"onFail" => null,
	//Needed files:
	"neededFiles" : null, //Format: "needed_file" : { load: needs_to_be_loaded, [mandatory: needed_to_begin_CrossBrowdy], [absolutePath: relative_to_CrossBrowdy_path_or_absolute], [loadChecker: function that will be called and return true if the file needs to be loaded], [id: file_identifier_string], [requires: array_with_required_ids_of_files_required] }
	//Needed modules:
	"neededModules" :
		[
			{
				"name" : "CrossBase",
				//Format: "needed_file" : { load: needs_to_be_loaded, [mandatory: needed_to_begin_CrossBrowdy], [absolutePath: relative_to_CrossBrowdy_path_or_absolute], [loadChecker: function that will be called and return true if the file needs to be loaded], [id: file_identifier_string], [requires: array_with_required_ids_of_files_required] }
				"neededFiles" : { "CrossBase/CrossBase.js" : { load: true, mandatory: true } }
			}
		],
	//Credits:
	"credits" : "[CB] " + CB_NAME + " " + CB_VERSION + " by Joan Alba Maldonado<br />"
};

//Sets default credits:
/**
 * Default credits.
 *	@var
 *  @readonly
 *  @type {string}
 *  @default
 */
var CB_CREDITS_DEFAULT = "";
CB_addCredits(CB_Modules.modules[CB_NAME]["credits"]);


//If now() static function not available, uses getTime() method:
if (!Date.now) { Date.now = function() { return new Date().getTime(); }; }


/**
 * Attaches the given credits to the default ones (to {@link CB_CREDITS_DEFAULT}).
 *  @function
 *  @param {string} credits - Path to the JS file.
 *  @returns {string} Returns the default credits after attaching the given ones.
 */
 function CB_addCredits(credits)
 {
	 return CB_CREDITS_DEFAULT += credits;
 }
 

/**
 * Alias for the "console" function which fallbacks to a DOM element with "CB_console" id (its CSS "style" attribute will be modified if needed, which means that its "display" property will be set to "block" if it is "none" and its "visibility" property to "visible" regardless its previous value) or even to an alert when it is not available ("alert" will only be used as a fallback in the case that the {@link CB_console_ALLOW_ALERTS} parameter is set to true).
 *  @function
 *  @param {string} message - Message to display
 */
var CB_console;
if (typeof(console) !== "undefined" && typeof(console.log) !== "undefined")
{
	if (typeof(console.log.apply) !== "undefined")
	{
		CB_console = function() { console.log.apply(console, arguments); };
	}
	else
	{
		CB_console = console.log;
	}
}
else
{
	CB_console =
		function(message)
		{
			message += "";
			var CB_consoleElement = document.getElementById("CB_console");
			if (CB_consoleElement !== null)
			{
				CB_consoleElement.style.visibility = "visible";
				if (CB_consoleElement.style.display === "none") { CB_consoleElement.style.display = "block"; }
				CB_consoleElement.innerHTML += message.replace(/\n/gi, "<br />") + "<br />";
				CB_consoleElement.scrollTop = CB_consoleElement.scrollHeight;
			}
			else if (CB_Configuration[CB_NAME].CB_console_ALLOW_ALERTS) { alert(message); }
		};
	console = { log : CB_console };
}


var CB_filesRequested = {};
var CB_filesLoaded = [];
var CB_filesLoadedIds = {};
/**
 * Callback for when the file is included successfully or fails to load.
 *  @callback CB_includeJSFile_CALLBACK
 *  @param {string} filepath - The filepath parameter when CB_includeJSFile was called (if any).
 *  @param {CB_includeJSFile_CALLBACK} callbackOk - The callbackOk parameter when CB_includeJSFile was called (if any).
 *  @param {CB_includeJSFile_CALLBACK} callbackTimeout - The callbackTimeout parameter when CB_includeJSFile was called (if any).
 *  @param {integer} timeoutMs - The timeoutMs parameter when CB_includeJSFile was called (if any).
 */
  
/**
 * Includes a JavaScript file to the current document.
 *  @function
 *  @param {string} filepath - Path to the JS file.
 *  @param {CB_includeJSFile_CALLBACK} [callbackOk] - Callback for when the file is included successfully.
 *  @param {CB_includeJSFile_CALLBACK} [callbackTimeout] - Callback for when the file cannot be included after the defined timeout.
 *  @param {integer} [timeoutMs={@link CB_Configuration.CrossBrowdy.CB_includeJSFile_TIMEOUT_MS_DEFAULT}] - Timeout in milliseconds to consider that the inclusion of the file has failed.
 */
function CB_includeJSFile(filepath, callbackOk, callbackTimeout, timeoutMs, fileId, fileRequires, notMandatory)
{
	//If the file requires another one and it has still not loaded, calls the function again after a while:
	if (fileRequires && typeof(fileRequires.length) !== "undefined" && fileRequires.length > 0)
	{
		for (var x = 0; x < fileRequires.length; x++)
		{
			if (!CB_filesLoadedIds[fileRequires[x]])
			{
				setTimeout(function() { CB_includeJSFile(filepath, callbackOk, callbackTimeout, timeoutMs, fileId, fileRequires, notMandatory); }, 10);
				return;
			}
		}
	}
	
	//Stores the file as not loaded in the array:
	if (!notMandatory) { CB_filesRequested[filepath] = true; }
	
	var parentElement = document.getElementsByTagName("head") || document.head || document.getElementsByTagName("body") || document.body || document.documentElement;
	if (parentElement && typeof(parentElement[0]) === "undefined") { parentElement = [parentElement]; }
	if (typeof(parentElement) === "undefined" || parentElement === null || typeof(parentElement[0]) === "undefined" || parentElement[0] === null)
	{
		CB_console("[ERROR] <HEAD> tag not found! (CB_includeJSFile)");
		if (typeof(callbackTimeout) === "function") { callbackTimeout(filepath, callbackOk, callbackTimeout, timeoutMs); }
		return;
	}
	
	parentElement = parentElement[0];

    var scriptTag = document.createElement("script");
    scriptTag.src = filepath;
    scriptTag.language = "javascript";
	scriptTag.type = "text/javascript";

	parentElement.appendChild(scriptTag);

	var onLoadExecuted = false;
	var onLoad =
		function()
		{
			this.onreadystatechange = this.onload = null;
			setTimeout
			(
				function()
				{
					if (timeoutExecuted) { return; } //Exists if the timeout has already been executed.
					onLoadExecuted = true;
					
					//Stores the file as already loaded in the array:
					CB_filesRequested[filepath] = false;
					CB_filesLoaded[CB_filesLoaded.length] = filepath;
					if (fileId) { CB_filesLoadedIds[fileId] = true; }

					//If defined, calls the OK function:
					if (typeof(callbackOk) === "function") { callbackOk(filepath, callbackOk, callbackTimeout, timeoutMs); }
				},
				10
			);
		};
		
	if (scriptTag.readyState)
	{
		scriptTag.onreadystatechange =
			function()
			{
				var rs = this.readyState;
				if (rs === "loaded" || rs === "complete") { onLoad(); }
			};
	}
	else { scriptTag.onload = onLoad; }
	
	//Starts counting for the timeout:
	var timeoutExecuted = false;
	var callbackTimeoutTimeout = setTimeout
	(
		function()
		{
			if (onLoadExecuted) { return; } //Exists if the onLoad has been already executed.
			timeoutExecuted = true;
			if (typeof(callbackTimeout) === "function") { callbackTimeout(filepath, callbackOk, callbackTimeout, timeoutMs); }
		},
		timeoutMs || CB_Configuration[CB_NAME].CB_includeJSFile_TIMEOUT_MS_DEFAULT
	);
	
	return { scriptElement: scriptTag, timeoutFailure: callbackTimeoutTimeout };
}


//Function that includes all required files:
CB_Modules._includeAllRequiredFiles = function(CB_scriptPathGiven, neededFiles, callbackOk)
{
	//Parses the neededFiles object to turn variable keys into the real value of those variables:
	var currentValue = null;
	var allIndexes = null;
	var allIndexesLength = 0;
	var x = 0;
	for (var currentFile in neededFiles)
	{
		if (currentFile.substring(0, 8) === "VALUEOF_")
		{
			allIndexes = currentFile.substring(8).split(".");
			allIndexesLength = allIndexes.length;
			currentValue = CB_this;//window;
			for (var x = 0; x < allIndexesLength; x++)
			{
				if (typeof(currentValue[allIndexes[x]]) !== "undefined" && currentValue[allIndexes[x]] !== null) { currentValue = currentValue[allIndexes[x]]; }
				else { break; }
			}
			if (typeof(currentValue) !== "string" && !(currentValue instanceof String)) { currentValue = ""; }
			
			if (currentValue !== "") { neededFiles[currentValue] = { load: neededFiles[currentFile].load, loadChecker: neededFiles[currentFile].loadChecker, mandatory: neededFiles[currentFile].mandatory, id: neededFiles[currentFile].id, requires: neededFiles[currentFile].requires }; }

			neededFiles[currentFile].load = false; //It contains the key without parsing, so we set as we don't need it to load it to ignore it.
			neededFiles[currentFile].disabled = true; //Disables it.
		}
	}

	//Includes all files needed:
	var neededFilesPending = 0;
	for (currentFile in neededFiles)
	{
		if (neededFiles[currentFile].disabled) { continue; }
		
		//Performs the load checker that can change the load property (if any):
		if (typeof(neededFiles[currentFile].loadChecker) === "function" && neededFiles[currentFile].load) { neededFiles[currentFile].load = neededFiles[currentFile].loadChecker(currentFile, neededFiles[currentFile]); }
		
		//If the file needs to be loaded, we load it:
		if (neededFiles[currentFile].load)
		{
			new function(currentFile) //Creates a new scope because we are in a loop.
			{
				var functionWhenLoad = null;
				if (neededFiles[currentFile].mandatory) //Only increases and decreases counter for mandatory files.
				{
					neededFilesPending++;
					functionWhenLoad =
						function(filepath, callbackOk, callbackTimeout, timeoutMs)
						{
							neededFilesPending--;
							if (typeof(neededFiles) !== "undefined" && neededFiles !== null && typeof(neededFiles[currentFile]) !== "undefined" && neededFiles[currentFile] !== null)
							{
								neededFiles[currentFile].load = false; //We have loaded it and don't need to load it more. 
							}
						};
				}
				var scriptPath = CB_scriptPathGiven;
				if (neededFiles[currentFile].absolutePath) { scriptPath = ""; }
				CB_includeJSFile(scriptPath + currentFile, functionWhenLoad, undefined, undefined, neededFiles[currentFile].id, neededFiles[currentFile].requires);
			}(currentFile);
		}
	}
	
	//Interval that will check when all the modules has been loaded:
	var allRequiredFilesLoaded =
		function()
		{
			if (neededFilesPending <= 0 && typeof(callbackOk) === "function")
			{
				callbackOk();
			}
			else if (typeof(callbackOk) === "function")
			{
				setTimeout(allRequiredFilesLoaded, 1);
			}
		};
	allRequiredFilesLoaded();
}



//Function that includes all required modules:
CB_Modules._includeAllRequiredModules = function(CB_scriptPathGiven, modules, callbackOk)
{
	if (typeof(modules) === "undefined" || modules === null) { return; }

	var modulesLength = modules.length;
	var neededModulesPending = 0;
	for (var x = 0; x < modulesLength; x++)
	{
		if (typeof(modules[x].name) !== "undefined" && typeof(modules[x].neededFiles) !== "undefined" && modules[x].neededFiles)
		{
			neededModulesPending++;
			new function(moduleName) //Closure to keep moduleName value for every loop.
			{
				CB_Modules._includeAllRequiredFiles
				(
					CB_scriptPathGiven,
					modules[x]["neededFiles"],
					function()
					{
						setTimeout
						(
							function()
							{
								CB_Modules._initializeModule(CB_scriptPathGiven, moduleName);
								neededModulesPending--;
							},
							10
						);
					}
				);
			}(modules[x].name);
		}
	}

	//Interval that will check when all the modules has been loaded:
	var allRequiredModulesLoaded =
		function()
		{
			if (neededModulesPending <= 0 && typeof(callbackOk) === "function")
			{
				callbackOk();
			}
			else if (typeof(callbackOk) === "function")
			{
				setTimeout(allRequiredModulesLoaded, 1);
			}
		};
	allRequiredModulesLoaded();
}



//Tells the number of required files loaded:
CB_Modules._numberFilesLoaded = function(neededFiles, onlyMandatory)
{
	//Checks all files needed:
	var numberNeededFilesLoaded = 0;
	for (var currentFile in neededFiles)
	{
		//Checks whether the needed file has been loaded:
		if (neededFiles[currentFile].load)
		{
			if (!onlyMandatory || neededFiles[currentFile].mandatory)
			{
				numberNeededFilesLoaded++;
			}
		}
	}
	return numberNeededFilesLoaded;
}


//Checks whether all required files have been loaded:
CB_Modules._allFilesLoaded = function(neededFiles, onlyMandatory)
{
	//Checks all files needed:
	var allFilesNeededIncluded = true;
	for (var currentFile in neededFiles)
	{
		//If the file has not been included yet, exits the bucle:
		if (neededFiles[currentFile].load)
		{
			if (!onlyMandatory || neededFiles[currentFile].mandatory)
			{
				allFilesNeededIncluded = false; break;
			}
		}
	}
	return allFilesNeededIncluded;
}


//Checks whether all required modules have been loaded:
CB_Modules._allModulesLoaded = function(neededModules, onlyMandatory)
{
	if (typeof(neededModules) === "undefined" || neededModules === null) { return true; }
	var allModulesNeededIncluded = true;
	var neededModulesLength = neededModules.length;
	for (var x = 0; x < neededModulesLength; x++)
	{
		if (typeof(neededModules[x].name) !== "undefined" && typeof(neededModules[x].neededFiles) !== "undefined" && neededModules[x].neededFiles)
		{
			if (!CB_Modules._allFilesLoaded(neededModules[x].neededFiles, onlyMandatory)) { allModulesNeededIncluded = false; break; }
		}
	}
	return allModulesNeededIncluded;
}


//Checks whether a given module is ready or not:
CB_Modules._moduleReady = function(moduleName)
{
	return (CB_Modules._getModuleStatus(moduleName) === CB_Modules.STATUSES.READY);
}


//Checks whether all required modules are ready:
CB_Modules._allModulesReady = function(neededModules)
{
	if (typeof(neededModules) === "undefined" || neededModules === null) { return true; }
	var allModulesNeededReady = true;
	var neededModulesLength = neededModules.length;
	for (var x = 0; x < neededModulesLength; x++)
	{
		if (typeof(neededModules[x].name) !== "undefined" && typeof(neededModules[x].neededFiles) !== "undefined" && neededModules[x].neededFiles)
		{
			if (!CB_Modules._moduleReady(neededModules[x].name)) { allModulesNeededReady = false; break; }
		}
	}
	return allModulesNeededReady;
}


//Returns the status of a given module:
CB_Modules._getModuleStatus = function(moduleName)
{
	if (typeof(CB_Modules.modules[moduleName]) !== "undefined" && typeof(CB_Modules.modules[moduleName].status) !== "undefined")
	{
		return CB_Modules.modules[moduleName].status;
	}
	else { return CB_Modules.STATUSES.UNKNOWN; }
}


/**
 * Sets a status for a given module.
 *  @memberof CB_Modules
 *  @function
 *  @param {string} moduleName - Name of the module.
 *  @param {integer} status - The desired status. Must be a value that exists in the {@link CB_Modules.STATUSES} enum.
 *  @returns {boolean} It will return true if succeeded or false otherwise.
 */
CB_Modules.setStatus = function(moduleName, status)
{
	if (typeof(CB_Modules.modules[moduleName]) !== "undefined")
	{
		CB_Modules.modules[moduleName].status = status;
	}
}


//Function that initializes a module:
//var CB_allFilesLoadedInterval; //Interval that checks if CrossBrowdy is ready or not.
CB_Modules._initializeModule = function(CB_scriptPathGiven, moduleName)
{
	//It the module still does not exist (status is unknown), tries to load it again after some time:
	if (CB_Modules._getModuleStatus(moduleName) === CB_Modules.STATUSES.UNKNOWN) { setTimeout(function() { CB_Modules._initializeModule(CB_scriptPathGiven, moduleName); }, 1); return; }
	
	CB_Modules.setStatus(moduleName, CB_Modules.STATUSES.LOADING);
	
	if (typeof(CB_Modules.modules[moduleName]["onCall"]) === "function")
	{
		CB_Modules.modules[moduleName]["onCall"](CB_scriptPathGiven);
	}

	//Applies default path if it was not sent:
	if (typeof(CB_scriptPathGiven) === "undefined" || CB_scriptPathGiven === null)
	{
		CB_scriptPathGiven = CB_scriptPathCalculate();
	}

	//Includes required files:
	CB_Modules._includeAllRequiredFiles(CB_scriptPathGiven, CB_Modules.modules[moduleName]["neededFiles"]);

	//Includes required modules:
	CB_Modules._includeAllRequiredModules(CB_scriptPathGiven, CB_Modules.modules[moduleName]["neededModules"]);
	
	//Show credits in console:
	CB_console(CB_credits(CB_Modules.modules[moduleName]["credits"], false));

	//Interval that checks if CrossBrowdy is ready (and initializes the static objects):
	var onLoadProcessed = false;
	var onReadyProcessed = false;
	var CB_allFilesLoadedCheck =
		function()
		{
			var loopAgain = true;
			//If all files needed are loaded (mandatory files only):
			if (CB_Modules._allFilesLoaded(CB_Modules.modules[moduleName]["neededFiles"], true))
			{
				//If all needed modules are loaded (mandatory module files only):
				if (CB_Modules._allModulesLoaded(CB_Modules.modules[moduleName]["neededModules"], true))
				{
					//If defined, executes the onLoad function of the module:
					if (!onLoadProcessed && typeof(CB_Modules.modules[moduleName]["onLoad"]) === "function")
					{
						onLoadProcessed = true;
						CB_Modules.modules[moduleName]["onLoad"](CB_scriptPathGiven);
					}
					
					//If all needed modules are ready:
					if (CB_Modules._allModulesReady(CB_Modules.modules[moduleName]["neededModules"]))
					{
						//If the module itself is ready:
						if (CB_Modules._moduleReady(moduleName))
						{
							//If defined, executes the onReady function of the module:
							if (!onReadyProcessed && typeof(CB_Modules.modules[moduleName]["onReady"]) === "function")
							{
								onReadyProcessed = true;
								CB_Modules.modules[moduleName]["onReady"](CB_scriptPathGiven);
							}
							loopAgain = false;
						}
					}
				}
			}
			if (loopAgain) { setTimeout(CB_allFilesLoadedCheck, 1); }
		};
	CB_allFilesLoadedCheck();
}


/**
 * Returns a {@link CB_Modules.MODULE} object for module management.
 *  @memberof CB_Modules
 *  @function
 *  @param {string} moduleName - Name of the desired module.
 *  @returns {CB_Modules.MODULE|null} If found, it will return the {@link CB_Modules.MODULE} object desired. Otherwise, it will return null.
 */
CB_Modules.get = function(moduleName)
{
	if (typeof(CB_Modules.modules[moduleName]) !== "undefined")
	{
		return CB_Modules.modules[moduleName];
	}
	return null;
}


/**
 * Gets the value of a desired module property (or returns null).
 *  @memberof CB_Modules
 *  @function
 *  @param {string} moduleName - Name of the desired module.
 *  @param {string} property - Name of the desired property.
 *  @returns {*|null} If found, it will return the value of the desired module property. Otherwise, it will return null.
 */
CB_Modules.getProperty = function(moduleName, property)
{
	var module = CB_Modules.get(moduleName);
	if (module !== null && typeof(module[property]) !== "undefined")
	{
		return module[property];
	}
	return null;
}


/**
 * Modifies a desired property of a given module.
 *  @memberof CB_Modules
 *  @function
 *  @param {string} moduleName - Name of the module which contains the property to modify.
 *  @param {string} property - Name of the property to modify.
 *  @param {*} value - Value desired for the property.
 *  @param {('array'|'object'|'scalar')} [type='scalar']
		Type that the property uses.
		If it is "array", the given "value" will be attached at the end of the array (all in a new single index if the "iterateArray" parameter is set to false, or each value in a new index otherwise).
		If it is "object", the given "value" and the given "property" to modify will be treated as objects and the members of the "value" will be copied one by one (overwriting previous members in the case they existed).
		If it is "scalar" or any other, the given "property" value will be replaced with the given "value".
 *  @param {boolean} [iterateArray=false] - If is set to true and the given "type" is "array", the given "value" will be considered an array and will be iterated to copy each of its values to a new index in the destiny. Otherwise, if it is set to false and the given "type" is "array", the given "value" will be attached at the end of the array in a new single index.
 *  @returns {boolean} It will return true if succeeded or false otherwise.
 */
CB_Modules.editProperty = function(moduleName, property, value, type, iterateArray)
{
	if (typeof(moduleName) === "undefined" || moduleName === null || moduleName === "") { return false; }
	if (typeof(property) === "undefined" || property === null || property === "") { return false; }
	if (typeof(type) === "undefined" || type === null) { type = "scalar"; }
	type += "";
	type = type.toLowerCase();

	var modified = false;
	
	var module = CB_Modules.get(moduleName);
	if (module !== null)
	{
		var propertyValue = CB_Modules.getProperty(moduleName, property);
		if (type === "array")
		{
			if (propertyValue === null) { module[property] = []; }
			if (!iterateArray)
			{
				module[property][module[property].length] = value;
				modified = true;
			}
			else
			{
				var valueLength = value.length;
				for (var x = 0; x < valueLength; x++)
				{
					module[property][module[property].length] = value[x];
				}
				if (x > 0) { modified = true; }
			}
		}
		else if (type === "object")
		{
			if (propertyValue === null) { module[property] = {}; }
			for (var propertyName in value)
			{
				module[property][propertyName] = value[propertyName];
				modified = true;
			}
		}
		else
		{
			if (propertyValue === null) { module[property] = null; }
			module[property] = value;
			modified = true;
		}
	}
	return modified;
}


/**
 * Attaches one module to another one.
 *  @memberof CB_Modules
 *  @function
 *  @param {string} moduleNameParent - Name of the parent module where the new child module will be attached to.
 *  @param {string} moduleName - Name of the new child module which will be attached to the given parent.
 *  @param {CB_Modules.NEEDED_FILES} neededFiles - The "neededFiles" parameter for the new child module.
 *  @returns {boolean} It will return true if succeeded or false otherwise.
 */
CB_Modules.addNeededModule = function(moduleNameParent, moduleName, neededFiles)
{
	return CB_Modules.editProperty(moduleNameParent, "neededModules", { "name" : moduleName, "neededFiles" : neededFiles }, "array");
}


/**
 * Attaches files to a module.
 *  @memberof CB_Modules
 *  @function
 *  @param {string} moduleName - Name of the module which will contain the new files.
 *  @param {CB_Modules.NEEDED_FILES} neededFiles - The "neededFiles" parameter for the module.
 *  @returns {boolean} It will return true if succeeded or false otherwise.
 */
CB_Modules.addNeededFiles = function(moduleName, neededFiles)
{
	return CB_Modules.editProperty(moduleName, "neededFiles", neededFiles, "object");
}


var CB_scriptPathCalculateLastReturn = CB_this.CB_scriptPathCalculateLastReturn || null;
/**
 * Tries to calculate and returns the path where the script is located.
 *  @function
 *  @returns {string} If it cannot be calculated, it will returns the value of {@link CB_Configuration[CB_NAME].SCRIPT_PATH_DEFAULT}.
 */
function CB_scriptPathCalculate()
{
	if (typeof(CB_scriptPathCalculateLastReturn) !== "undefined" && CB_scriptPathCalculateLastReturn !== null) { return CB_scriptPathCalculateLastReturn; }
	
	//Gets the "SCRIPT" DOM elements:
	var scriptElements = [];
	var tagName = "script";
	if (typeof(document.getElementsByTagName) !== "undefined" && document.getElementsByTagName !== null)
	{
		scriptElements = document.getElementsByTagName(tagName);
	}
	else if (document.querySelectorAll)
	{
		scriptElements = document.querySelectorAll(tagName);
	}
	else if (document.querySelectorAll)
	{
		scriptElements = document.querySelectorAll(tagName);
	}
	else if (typeof(document.all) !== "undefined" && document.all !== null)
	{
		scriptElements = document.all.tags(tagName);
	}
	else if (document.layers)
	{
		var allElements = document.layers;
		
		//Obtains all elements with the given tag name:
		var allElementsLength = allElements.length;
	
		var elementCurrent;
		for (var x = 0; x < allElementsLength; x++)
		{
			elementCurrent = allElements[x];
			if (elementCurrent !== null && typeof(elementCurrent.tagName) !== "undefined")
			{
				if (CB_trim(elementCurrent.tagName).toLowerCase() === tagName)
				{
					scriptElements.push(elementCurrent);
				}
			}
		}
		//scriptElements = document.layers[tagName];
	}
	
	var scriptFileName = CB_NAME + ".js";
	for (var x = 0, scriptElementsLength = scriptElements.length; x < scriptElementsLength; x++)
	{
		if (scriptElements[x].src && scriptElements[x].src.length)
		{
			var src = scriptElements[x].src;
			if (src.substring(src.length - scriptFileName.length, src.length) === scriptFileName)
			{
				CB_scriptPathCalculateLastReturn = src.substring(0, src.length - scriptFileName.length);
				return CB_scriptPathCalculateLastReturn;
			}
		}
	}
	
	return CB_Configuration[CB_NAME].SCRIPT_PATH_DEFAULT;
}


var CB_ready = false; //Defines weather CrossBrowdy is ready or not.
var CB_initWait = true;
var CB_initWaitMs = 50;
var CB_readyInterval; //Interval that will execute the main function when CrossBrowdy is ready.
var CB_deviceReady = false;
/**
 * Callback for when the script is loaded successfully. Without parameters.
 *  @callback CB_init_CALLBACK
 */

/**
 * Starts CrossBrowdy.
 *  @function
 *  @param {CB_init_CALLBACK} [mainFunction] - Callback for when the script is loaded successfully. Recommended.
 *  @param {string} [scriptPath={@link CB_scriptPathCalculate}()] - Path where the script is located.
 *  @param {boolean} [showSplashScreen={@link CB_Configuration.CrossBrowdy.SHOW_SPLASH_SCREEN_DEFAULT}] - Defines whether to show the splash screen or not.
 */
function CB_init(mainFunction, scriptPath, showSplashScreen)
{
	//If Cordova is detected, exits this function and it will be called again when the device is ready:
	if ((typeof(window.cordova) !== "undefined") && !CB_deviceReady && document.addEventListener) { document.addEventListener("deviceready", function() { CB_deviceReady = true; CB_init(mainFunction, scriptPath, showSplashScreen) }, false); return; }

	//Applies the options set by the user (if any):
	CB_applyOptions(CB_NAME, this);
	
	if (typeof(showSplashScreen) === "undefined" || showSplashScreen === null) { showSplashScreen = CB_Configuration[CB_NAME].SHOW_SPLASH_SCREEN_DEFAULT; }

	//If defined, shows splash screen:
	if (showSplashScreen) { CB_showSplashScreen(); }
	
	//Executes this same function only after some milliseconds (avoids problems with Internet Explorer and excanvas):
	if (CB_initWait)
	{
		setTimeout(function() { CB_initWait = false; CB_init(mainFunction, scriptPath, showSplashScreen); }, CB_initWaitMs);
		return;
	}
	
	//Applies default path if it was not sent:
	if (typeof(scriptPath) === "undefined" || scriptPath === null)
	{
		scriptPath = CB_scriptPathCalculate();
		//scriptPath = CB_Configuration[CB_NAME].SCRIPT_PATH_DEFAULT;
	}
	
	//Initializes the main module:
	CB_Modules._initializeModule(scriptPath, CB_NAME);
	
	//If defined, the main function will be executed when CrossBrowdy is ready:
	if (typeof(mainFunction) === "function")
	{
		var CB_readyExecute =
			function()
			{
				var loopAgain = true;
				if (CB_ready)
				{
					setTimeout(mainFunction, 1); //Calls the function given.
					if (showSplashScreen) { CB_hideSplashScreen = true; } //If showing, hides splash screen.
					loopAgain = false;
				}
				if (loopAgain) { setTimeout(CB_readyExecute, 1); }
			};
		CB_readyExecute();
	}
}


//Function that applies the given options:
function CB_applyOptions(moduleName)//, containerObject)
{
	if (typeof(CB_OPTIONS) !== "undefined" && typeof(CB_OPTIONS[moduleName]) !== "undefined")
	{
		for (var option in CB_OPTIONS[moduleName])
		{
			CB_Configuration[moduleName][option] = CB_OPTIONS[moduleName][option];
		}
	}
}


/**
 * Returns the credits with the desired format.
 *  @function
 *  @param {string} [credits={@link CB_CREDITS_DEFAULT}] - Desired credits to be shown.
 *  @param {boolean} [html=true] - Strips all HTML tags (if any) when it is false.
 *  @param {boolean} [showPrefix=true] - Defines whether to show the "[CB]" prefix for every line or not (it will remove all "[CB]" occurrences if it is false).
 *  @returns {string}
 */
function CB_credits(credits, html, showPrefix)
{
	if (typeof(html) === "undefined" || html === null) { html = true; }
	if (typeof(showPrefix) === "undefined" || showPrefix === null) { showPrefix = true; }
	if (typeof(credits) === "undefined" || credits === null || credits === "") { credits = CB_CREDITS_DEFAULT; }
	if (!html)
	{
		if (typeof(CB_br2nl) !== "undefined") { credits = CB_br2nl(credits); }
		else { credits = credits.replace(/<br \/>/gi, "\n"); }
		credits = credits.replace(/<[^>]*>?/gm, '');
	}
	if (!showPrefix) { credits = credits.replace(/\[CB\]/gi, ""); }
	return credits;
}


//Show a splash screen:
var CB_showSplashScreenInterval; //Checks when the body is ready to show the splash screen.
var CB_hideSplashScreen = false;
var CB_showSplashScreenExecuted = false;
function CB_showSplashScreen()
{
	if (CB_showSplashScreenExecuted) { return; }
	CB_showSplashScreenExecuted = true;
	var CB_showSplashScreenShow =
		function()
		{
			var loopAgain = true;
			var bodyTag = document.getElementsByTagName("body");
			if (typeof(bodyTag) !== "undefined" && bodyTag !== null && typeof(bodyTag[0]) !== "undefined" && bodyTag[0] !== null)
			{
				bodyTag = bodyTag[0];
				if (!CB_hideSplashScreen && document.getElementById("CB_splashScreenDiv") === null)
				{
					var splashScreenDivPosition = "fixed";
					var additionalCSS = "";
					//if (window.navigator.appName === "Microsoft Internet Explorer")
					if (navigator.userAgent.indexOf("MSIE") !== -1 && (navigator.appVersion.indexOf("MSIE 5") !== -1 || navigator.appVersion.indexOf("MSIE 6") !== -1 || navigator.appVersion.indexOf("MSIE 7") !== -1 || navigator.appVersion.indexOf("MSIE 8") !== -1))
					{
						/*
						if (typeof(document.compatMode) !== "undefined" && document.compatMode === "BackCompat" || typeof(document.documentMode) !== "undefined" && document.documentMode == 5)
						{
							additionalCSS = " _position:absolute; _top:expression(eval(document.body.scrollTop));";
						}
						else if (navigator.appVersion.indexOf("MSIE 8") === -1)
						{
							splashScreenDivPosition = "absolute";
						}
						*/
						
						//If it is not IE8 (but IE5, IE6 or IE7) or it is in quirks mode ("fixed" property is not supported in IE8 when it is in quirks mode):
						if (navigator.appVersion.indexOf("MSIE 8") === -1 || typeof(document.compatMode) !== "undefined" && document.compatMode === "BackCompat" || typeof(document.documentMode) !== "undefined" && document.documentMode == 5)
						{
							splashScreenDivPosition = "absolute";
							//additionalCSS = " _position:absolute; _top: expression(eval(document.compatMode && document.compatMode=='CSS1Compat') ? documentElement.scrollTop +(documentElement.clientHeight-this.clientHeight) : document.body.scrollTop +(document.body.clientHeight-this.clientHeight));";
							additionalCSS = " _position:absolute; _top: expression(eval(document.compatMode && document.compatMode=='CSS1Compat') ? documentElement.scrollTop : document.body.scrollTop);";
							additionalCSS += " _left: expression(eval(document.compatMode && document.compatMode=='CSS1Compat') ? documentElement.scrollLeft : document.body.scrollLeft);";
						}
						
						bodyTag.style.width = bodyTag.style.height = "100%";
					}
					var splashScreenDiv = '\
											<div id="CB_splashScreenDiv" onmousedown="return false;" style="position:' + splashScreenDivPosition + '; top:0px; left:0px; width:100%; height:100%; background-color:#cccccc; z-index:999; opacity:0.95; transition:opacity 1000ms; -moz-transition:opacity 1000ms; -webkit-transition:opacity 1000ms; -o-transition:opacity 1000ms; -khtml-transition:opacity 1000ms; -ms-transition:opacity 1000ms;' + additionalCSS + '">\
												<table style="padding:0px; border:#ffffff solid 10px; width:100%; height:100%;">\
													<tr>\
														<td align="center" style="text-align:center; font-size:13px; font-family:terminal; color:#ffffff;">\
															<table style="width:100%; height:30px; background:#aa0000; margin:0px; padding:0px; width:100%; height:30px; line-height:30px; border:0px;">\
																<tr>\
																	<td align="center" valign="middle" style="text-align:center; font-size:25px; font-family:terminal; color:#ffffff;">\
																		CrossBrowdy<span style="font-size:10px;">' + CB_VERSION + '</span>\
																	</td>\
																</tr>\
															</table>\
															<div style="font-family:arial; font-size:9px; line-height:10px; color:#696969; text-align:center;">\
																		<div style="display:block; width:55%; text-align:left; margin:0px auto 0px auto;">\
																			<div style="font-family:verdana; text-align:center;" id="CB_splashScreenDivCredits">' + CB_credits(CB_Modules.modules[CB_NAME]["credits"], true, false).replace(/<br \/>/i, "").replace(/<br \/>/gi, ". ").replace(/- /i, "</div>").replace(/- /gi, "") + '</div>\
															</div>\
															* <span id="CB_splashScreenDivLoadingBlink" style="color:#000000;">Loading...</span> *\
															<br />\
															<div id="CB_splashScreenDivLoader" style="color:#ffffff; text-align:center;"></div>\
														</td>\
													</tr>\
												</table>\
											</div>\
										  ';
					bodyTag.innerHTML += splashScreenDiv;
				}
				else if (CB_hideSplashScreen && document.getElementById("CB_splashScreenDiv") !== null)
				{
					var CB_splashScreenDiv = document.getElementById("CB_splashScreenDiv");
					CB_splashScreenDiv.style.opacity = 0;
					setTimeout(function() { CB_splashScreenDiv.style.visibility = "hidden"; }, 1000);
					loopAgain = false;
				}
				if (document.getElementById("CB_splashScreenDivLoadingBlink") !== null)
				{
					document.getElementById("CB_splashScreenDivLoadingBlink").style.visibility = (document.getElementById("CB_splashScreenDivLoadingBlink").style.visibility === "visible") ? "hidden" : "visible";
				}
				if (document.getElementById("CB_splashScreenDivLoader") !== null)
				{
					var loader = "";
					for (var file in CB_filesRequested)
					{
						if (CB_filesRequested[file]) { loader += '<span style="color:#aa0000;">Loading</span> ' + file; }
						//else { loader += file + ' <span style="color:#0000aa;">Loaded!</span>'; }
						loader += "<br />";
					}
					//if (typeof(CB_filesLoaded[CB_filesLoaded.length - 1]) !== "undefined") { loader += CB_filesLoaded[CB_filesLoaded.length - 1] + ' <span style="color:#aa0000;">Loaded</span>'; }
					document.getElementById("CB_splashScreenDivLoader").innerHTML = loader;
				}
			}
			if (loopAgain) { setTimeout(CB_showSplashScreenShow, 1); }
		};
		CB_showSplashScreenShow();
}


//Sends the statistics:
function CB_sendStats()
{
	//Gets the information:
	//var OS = "";
	var url = "";
	if (typeof(window.location) !== "undefined")
	{
		url = window.location;
		if (typeof(encodeURIComponent) !== "undefined") { url = encodeURIComponent(url); }
		else if (typeof(escape) !== "undefined") { url = escape(url); }
	}
	
		/*
	txt = "<p>Browser CodeName: " + navigator.appCodeName + "</p>";
	txt+= "<p>Browser Name: " + navigator.appName + "</p>";
	txt+= "<p>Browser Version: " + navigator.appVersion + "</p>";
	txt+= "<p>Cookies Enabled: " + navigator.cookieEnabled + "</p>";
	txt+= "<p>Browser Language: " + navigator.language + "</p>";
	txt+= "<p>Browser Online: " + navigator.onLine + "</p>";
	txt+= "<p>Platform: " + navigator.platform + "</p>";
	txt+= "<p>User-agent header: " + navigator.userAgent + "</p>";
	txt+= "<p>User-agent language: " + navigator.systemLanguage + "</p>";	
		*/
	
	//Sends the information by including the statistics file:
	CB_includeJSFile(CB_Configuration[CB_NAME].STATS_URL + "?cb=yes&url=" + url, undefined, undefined, undefined, undefined, undefined, true);
}
