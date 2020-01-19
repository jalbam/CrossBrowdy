<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	You can create your own CrossBrowdy module easily. This is an example:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Module basic configuration:
	CB_Modules.modules["MY_MODULE"] =
	{
		//Name of the module:
		"name" : "MY_MODULE",

		//Status (UNKNOWN, UNLOADED, LOADING, LOADED, READY or FAILED):
		"status" : CB_Modules.STATUSES.UNLOADED,

		//Function to call as soon as the module is called (before loading its files):
		"onCall" : 
			function(scriptPathGiven)
			{
				//Do things...
				CB_Modules.setStatus("MY_MODULE", CB_Modules.STATUSES.LOADED);
			},

		//Callback function to call when the module has been loaded successfully:
		"onLoad" :
			function(scriptPathGiven)
			{
				//Do things...
				CB_Modules.setStatus("MY_MODULE", CB_Modules.STATUSES.READY);
			},
		
		//Callback function to call when the module is ready:
		"onReady" :
			function(scriptPathGiven)
			{
				//Do things...
			},

		//Needed files:
		"neededFiles" :
			{
				//Filepaths:
				"not_mandatory.js" : { load: true, mandatory: false }, //Needs to be loaded. Not mandatory. Relative path.
				"mandatory.js" : { load: true, mandatory: true, absolutePath: true }, //Needs to be loaded. Mandatory (CrossBrowdy will not begin without it). Absolute path.
				
				"file1.js" : { load: true, id: "file1" }, //Identifier is "file1" (needed to be required by other files).
				"file2.js" : { load: true, id: "file2" }, //Identifier is "file2" (needed to be required by other files).
				"file3.js" : { load: true, requires: ["file1", "file2"] }, //Requires "file1" and "file2".
				
				"with_checker.js" : //Using a checker:
				{
					load: true,
					loadChecker:
						function(filepath, neededFile)
						{
							var load = true;
							
							//Do things...
							
							return load; //The file will load only if it returns "true".
						}
				},
				
				//Dynamic filepaths (using variables):
				"VALUEOF_myVar" : { load: true, mandatory: true }, //The filepath will be searched in "myVar".
				"VALUEOF_myObject.mySubObject.myProperty" : { load: true, mandatory: true } //The filepath will be searched in "myObject.mySubObject.myProperty".
			},
			
		//Needed modules:
		"neededModules" :
			[
				{
					"name" : "ANOTHER_MODULE",
					"neededFiles" : { "ANOTHER_MODULE/ANOTHER_MODULE.js" : { load: true, mandatory: true } } //Same format as the previous "neededFiles".
				}
			],
		
		//Credits:
		"credits" : "[CB] MY_MODULE by Joan Alba Maldonado<br />" //Credits will be shown in the console when loading.
	};
</code></pre>

<p>
	Then, if the previous code above was stored in a file called '<i>MY_MODULE.js</i>' inside a folder called '<i>MY_MODULE_FOLDER</i>', we can add the module to CrossBrowdy this way:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
//Adds the module to CrossBrowdy:
CB_Modules.addNeededModule(CB_NAME, "MY_MODULE", { "MY_MODULE_FOLDER/MY_MODULE.js" : { load: true, mandatory: true } });
</code></pre>
<p>
	Note that the module must be created and added before CrossBrowdy starts loading (before calling the <a href="api/global.html#CB_init" target="_blank">CB_init</a> function). It could also be done during the CrossBrowdy loading process, for example using the multiple callback functions through events, but the main objective of this example is to keep it simple.
</p>

<p>
	Here are some other interesting examples regarding modules management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets a desired module object:
	var myModule = CB_Modules.get("MY_MODULE");
	
	//Gets the desired property of a given module:
	var myModuleProperty = CB_Modules.getProperty("MY_MODULE", "property_name");
	
	//Edits a desired property with the desired value of a given module:
	CB_Modules.editProperty("MY_MODULE", "property_name", "property_value", "scalar", iterateArray); //Value type can be "array", "object" or "scalar", being 'iterateArray' a boolean to define whether to loop through the given array (if any) or not.
	
	//Adds the desired "neededFiles" to a given module:
	CB_Modules.addNeededFiles("MY_MODULE", { "PATH/FILE.js" : { load: true, mandatory: true } });
	
	//Add some credits to the default ones (not needed normally as the credits from an attached module will be shown automatically already):
	CB_addCredits("[CB] Place credits here&lt;br /&gt;");
	
	//Gets the default credits:
	var credits = CB_credits();
	var creditsNoHTML = CB_credits(undefined, false); //Strips any HTML character (replacing BR tags with new line characters).
</code></pre>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Modules.html" target="_blank">CB_Modules</a> object.
</p>