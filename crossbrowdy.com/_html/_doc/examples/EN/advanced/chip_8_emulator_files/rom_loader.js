/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

var supportedFileAPI = (window.File && window.FileReader && window.FileList && window.Blob); //Used to check whether the client supports the File API or not.


//Sets the events for the file selector:
function prepareFileSelector()
{
	var fileSelector = CB_Elements.id("file_selector");
	if (fileSelector !== null)
	{
		CB_Events.on(fileSelector, "change", function(e) { e = CB_Events.normalize(e); loadROMLocally(e, fileSelector.value || fileSelector.selectedIndex); });
	}
}


//Sets the events for the ROM selector and fills it:
function prepareROMSelector()
{
	setROMsData(); //Sets the ROMs data.
	
	var ROMSelector = CB_Elements.id("rom_selector");
	if (ROMSelector !== null)
	{
		var optionLoop = null;
		for (var ROMId in ROMs)
		{
			optionLoop = document.createElement("option");
			optionLoop.id = optionLoop.name = optionLoop.value = optionLoop.text = optionLoop.textContent = optionLoop.innerText = ROMId;
			ROMSelector.appendChild(optionLoop);
		}
		var ROMSelectorLastValue = null;
		CB_Events.on
		(
			ROMSelector,
			"change",
			function(e)
			{
				//If a ROM is selected, tries to load it:
				ROMSelector.value = ROMSelector.value || ROMSelector.selectedIndex; //Cross-browser fix.
				if (ROMSelector.value && ROMSelector.value !== "none" && ROMs[ROMSelector.value])
				{
					ROMSelectorLastValue = ROMSelector.value;
					loadROMXHR(ROMSelector.value, ROMs[ROMSelector.value].cyclesPerLoop, ROMs[ROMSelector.value].keysMapping);
				}
				//...otherwise, if no ROM is selected, selects the current ROM again (if any):
				else if (ROMSelectorLastValue !== null) { ROMSelector.value = ROMSelector.selectedIndex = ROMSelectorLastValue; }
				//...otherwise, it does not select any ROM:
				else { ROMSelector.value = ROMSelector.selectedIndex = 0; }
				
				//Blurs the ROM selector (just in case it was selected):
				if (typeof(ROMSelector.blur) === "function")
				{
					CB_console("Blurring level selector...");
					ROMSelector.blur();
				}
			}
		);
	}
}


//Loads a desired ROM through XHR (AJAX):
var XHR = null;
var XHRError = false;
var XHRAllowedSuccessStatuses = null; //Array that will filled later with the status codes which will be used to consider an XHR request as successful.
function loadROMXHR(ROMId, cyclesPerLoop, keysMapping)
{
	if (!CB_GEM.data.emulatorStarted) { return; }

	if (typeof(ROMs[ROMId]) === "undefined" || !CB_isString(ROMs[ROMId].file)) { CB_console("Cannot find the file for the ROM whose ID is '" + ROMId + "'"); return; }

	XHRError = false;

	emulatorPaused = true; //Pauses the emulator.
	
	//Hides the "Waiting for any key" and the error message (just in case they were showing):
	waitingForKey = false;
	CB_Elements.hideById("waiting_for_any_key");
	CB_Elements.hideById("error");

	CB_Elements.showById("loading_rom"); //Shows the loading message.

	//Disables the toolbar icons:
	enableElements([ "button_reset", "button_pause", "button_fullscreen", "button_file_selector", "file_selector", "rom_selector", "cpl_input" ], false);
	
	CB_console("Trying to request the '" + ROMsPath + ROMs[ROMId].file + "' file through XHR (AJAX)...");
	
	var getFileSuccessFunction = function(XHR, getFileErrorFunction)
	{
		if (!XHR.response)
		{
			//NOTE: for older clients which do not support binary requests, we would have to convert the AJAX response into a typed array. Not done to make the example simpler.
			CB_console("Response is empty! Failed to get the binary data.");
			getFileErrorFunction.call(this, this, getFileSuccessFunction);
			return;
		}

		CB_console("The '" + ROMsPath + ROMs[ROMId].file + "' file has been loaded successfully! Response: ");
		CB_console(XHR.response);
		
		loadROMContent(new Uint8Array(XHR.response), cyclesPerLoop, keysMapping, ROMId); //CrossBrowdy will polyfill 'Uint8Array' when needed, automatically.
	};
	
	var getFileErrorFunction = function(XHR, getFileSuccessFunction)
	{
		CB_console("ERROR getting the '" + ROMsPath + ROMs[ROMId].file + "' file!");
		CB_console(XHR.response);
		CB_Elements.hideById("loading_rom");
		XHRError = emulatorError = true;
		CB_Elements.showById("error");
		var ROMSelector = CB_Elements.id("rom_selector");
		if (ROMSelector !== null) { ROMSelector.value = ROMSelector.selectedIndex = "none"; }
		
		//Enables the toolbar icons:
		enableElements([ "button_pause", "button_fullscreen", "button_file_selector", "file_selector", "rom_selector", "cpl_input" ], true);
	};
	
	XHRAllowedSuccessStatuses = XHRAllowedSuccessStatuses || (CB_Client.isRunningOnElectron() || CB_Client.isRunningOnNWjs() ? [0, 200, 201] : [200, 201])
	XHR = CB_Net.XHR.callBinary
	(
		//Parameters ("null" or "undefined" ones will get their default value, if needed, automatically):
		ROMsPath + ROMs[ROMId].file, //URL. Unique mandatory parameter.
		null, //data. It can be either a string (like URL parameters) or a JSON object. Default: undefined.
		null, //headers. Default: { "Content-Type" : "text/plain; charset=x-user-defined", "Cache-Control" : "no-cache", "Pragma" : "no-cache" }.
		null, //blobOrArrayBuffer. Default: 'arraybuffer'.
		null, //callbackFunction. Default: undefined. If provided, it will ignore both "callbackFunctionOK" and "callbackFunctionError".
		getFileSuccessFunction, //callbackFunctionOK. Default: undefined. Ignored if "callbackFunction" is provided.
		getFileErrorFunction, //callbackFunctionError. Default: undefined. Ignored if "callbackFunction" is provided.
		XHRAllowedSuccessStatuses, //allowedSuccessStatuses. Default: 200.
		XHR //XHR. Default: undefined. When not provided, it will try to create a new XHR object internally and it will be returned.
	);
}


//Loads a desired ROM which is placed locally:
function loadROMLocally(e, filePath)
{
	if (!CB_GEM.data.emulatorStarted) { return; }
	else if (!supportedFileAPI)
	{
		alert("Cannot load local files because File API is not supported!");
		return;
	}
	else if (!e || !e.target || !e.target.files || !e.target.files.length)
	{
		CB_console("Cannot load the '" + filePath + "' local file from the event");
		return;
	}
	
	XHRError = false;
	
	var ROMSelector = CB_Elements.id("rom_selector");
	if (ROMSelector !== null) { ROMSelector.value = ROMSelector.selectedIndex = "none"; }
	
	//Hides the "Waiting for any key" and the error message (just in case they were showing):
	waitingForKey = false;
	CB_Elements.hideById("waiting_for_any_key");
	CB_Elements.hideById("error");

	CB_Elements.showById("loading_rom"); //Shows the loading message.

	//Disables the toolbar icons:
	enableElements([ "button_reset", "button_pause", "button_fullscreen", "button_file_selector", "file_selector", "rom_selector", "cpl_input" ], false);
	
	emulatorPaused = true; //Pauses the emulator.
	
	CB_console("Trying to request '" + filePath + "' locally...");

	var file = e.target.files[0];

    CB_console("Name: " + file.name);
	CB_console("Type: " + file.type);
	CB_console("Size: " + file.size);

	var fileReader = new FileReader();

	fileReader.onload = function(e)
	{
		CB_console("The '" + file.name + "' file has been loaded successfully! Result: ");
		CB_console(fileReader.result);
		loadROMContent(new Uint8Array(fileReader.result)); //CrossBrowdy will polyfill 'Uint8Array' when needed, automatically.
	};
	
	fileReader.onerror = function(e)
	{
		CB_console("ERROR getting the '" + file.name + "' file!");
		CB_console(fileReader.error);
		CB_Elements.hideById("loading_rom");
		emulatorError = true;
		CB_Elements.showById("error");
	};

	fileReader.readAsArrayBuffer(file);    
}