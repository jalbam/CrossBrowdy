/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

//Path to the graphic rendering engine module:
var CB_GEM_PATH = CB_GEM_PATH || "../simple_game_engine_files/";

var CB_GEM_DEBUG_MESSAGES = false; //Defines whether to shows debug messages or not.

//Adds the game engine module to CrossBrowdy:
var CB_GEM_MODULE_NEEDED_MODULES = {};
CB_GEM_MODULE_NEEDED_MODULES[CB_GEM_PATH + "game_engine_module.js"] = { load: true, mandatory: true, absolutePath: true };
CB_Modules.addNeededModule(CB_NAME, "GAME_ENGINE_MODULE", CB_GEM_MODULE_NEEDED_MODULES);

CB_init(main); //It will call the "main" function when ready


//This function will be called when CrossBrowdy is ready:
function main()
{
	CB_console("CrossBrowdy and all needed modules loaded. Starting emulator...");
	
	//Defines needed data:
	//NOTE: most of the data will be calculated automatically and dynamically.
	CB_GEM.data = //Data stored in the game engine module (can be exported to save the status):
	{
		//General data:
		soundEnabled: true, //Set to false to disable sound.
		PIXELS_USE_GRADIENT: true,
		PIXELS_COLOR_FIRST: "#aaddaa", //First colour for the gradient. If PIXELS_USE_GRADIENT is set to false, this will be the unique colour of the pixels.
		PIXELS_COLOR_LAST: "#118811", //Last colour for the gradient. Ignored if PIXELS_USE_GRADIENT is set to false.
		SCREEN_BORDER_COLOR: "#000000"
	};

	//Sets the desired sprites scene data (can be modified dynamically):
	CB_GEM.spritesGroupsData =
	{
		//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_groups_1",
		srcWidth: 40,
		srcHeight: 40,
		data: { loop: true, onlyUseInMap: false },
		//Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups that will be used (their "parent" property will be set to point the current 'CB_GraphicSpritesScene' object which contains them):
		spritesGroups:
		[
			{
				id: "info",
				srcType: CB_GraphicSprites.SRC_TYPES.TEXT,
				top: 15,
				zIndex: 3,
				data:
				{
					fontSize: "12px",
					fontFamily: "courier",
					style: "#ffffaa",
					fontWeight: "bold"
				},
				sprites: [ { id: "info_sprite" } ]
			},
			//'border_sprites' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "border_sprites",
				srcType: CB_GraphicSprites.SRC_TYPES.RECTANGLE,
				data: { style: CB_GEM.data.SCREEN_BORDER_COLOR, stroke: true },
				//Numeric array containing 'CB_GraphicSprites.SPRITE_OBJECT' objects with all the sprites that will be used:
				sprites:
				[
					//'border_sprite' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "border_sprite"
					}
				]
			},
			//'bitmap_group' ('CB_GraphicSprites.SPRITES_OBJECT' object). Some missing or non-valid properties will will be inherited from the parent ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object):
			{
				id: "bitmap_group",
				srcType: CB_GraphicSprites.SRC_TYPES.BITMAP,
				width: 10, //It will be updated automatically according to the screen size.
				height: 10, //It will be updated automatically according to the screen size.
				data:
				{
					clearPreviousFirst: true,
					style: CB_GEM.data.PIXELS_COLOR_FIRST,
					gradientLeftOffset: 0, //Used to create a "blink" effect.
					beforeDrawingElement:
						function(element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) //Called before drawing the element.
						{
							//If desired and possible, it will draw the pixel with a personalized style (for the current ROM):
							CB_GEM.data._pixelsStyleTemp = CB_GEM.data._pixelsStyleTemp || {};
							CB_GEM.data._pixelsStyleTemp.stroke = null;
							CB_GEM.data._pixelsStyleTemp.first = null;
							CB_GEM.data._pixelsStyleTemp.last = null;
							if (lastROMIdLoaded && ROMs[lastROMIdLoaded] && typeof(ROMs[lastROMIdLoaded].pixelsColorizer) === "function")
							{
								CB_GEM.data._pixelsStyleTemp =
									ROMs[lastROMIdLoaded].pixelsColorizer.call(this, element, canvasContext, canvasBufferContext, useBuffer, CB_GraphicSpritesSceneObject, drawingMap, x, y, mapElement) ||
									CB_GEM.data._pixelsStyleTemp; //If the 'pixelsColorizer' returns null, keeps the pixels unaltered (null for 'first' and 'last').
							}
							
							//If we want to use gradient, it will add a "blink" effect:
							if (CB_GEM.data.PIXELS_USE_GRADIENT)
							{
								var gradient = canvasContext.createLinearGradient(element.data.gradientLeftOffset + x, y, element.width * 64, element.height * 32);
								element.data.gradientLeftOffset++;
								if (element.data.gradientLeftOffset > 100) { element.data.gradientLeftOffset = 0; }
								gradient.addColorStop(0, CB_GEM.data._pixelsStyleTemp.first || CB_GEM.data.PIXELS_COLOR_LAST);
								gradient.addColorStop(1, CB_GEM.data._pixelsStyleTemp.last || CB_GEM.data.PIXELS_COLOR_FIRST);
								this.data.style = gradient;
							}
							else { this.data.style = CB_GEM.data._pixelsStyleTemp.first || CB_GEM.data.PIXELS_COLOR_FIRST; }
							this.data.stroke = !!CB_GEM.data._pixelsStyleTemp.stroke;
							return this; //Same as 'element'. Must return the element to draw.
						}
				},
				sprites:
				[
					//Maps with string aliases:
					//'bitmap_current' ('CB_GraphicSprites.SPRITE_OBJECT' object). Some missing or non-valid properties will be inherited from the sprites group:
					{
						id: "bitmap_current", //Current map which will be displayed (it will be modified according to the position of the player and the other elements).
						src:
						[
							//NOTE: using 'CB_Arrays.forEach' to replace spaces with 'false' and other symbols with 'true' (an two-dimensional array of booleans is needed by source type 'CB_GraphicSprites.SRC_TYPES.BITMAP'):
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("*****      ***      *** *********      ***       ***       *****".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("***** ******** ******** ********* ******** ************ ********".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("***** ******** ******** ********* ******** ************ ********".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("*****      ***      *** *********      *** ************ ********".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("********** *** ******** ********* ******** ************ ********".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("********** *** ******** ********* ******** ************ ********".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("*****      ***      ***       ***      ***       ****** ********".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("******************************  ********************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("***************************** ** *******************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("**************************** **** ******************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("*************************** ****** *****************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("***************************        *****************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("************************** ******** ****************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("************************** ******** ****************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("*********************    ****    *** *** ***********************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("********************* *** *** ** ***  *  ***********************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("********************* *** *** ** *** * * ***********************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("*********************    **** ** *** *** ***********************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("*********************  ****** ** *** *** ***********************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("********************* * ***** ** *** *** ***********************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("********************* ** ****    *** *** ***********************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; }),
							CB_Arrays.forEach("****************************************************************".split(""), function(v, i, a) { a[i] = v === " " ? false : true; })
						]
					}
				]
			}
		]
	};
	
	//Defines the callbacks for the loop:
	CB_GEM.onLoopStart = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the loop starts (before rendering the graphics):
	{
		manageInput(); //Manages any possible input (for the UI, not for the emulator).
		
		if (!CB_GEM.data.emulatorStarted) { return; }
		else if (emulatorPaused) { return; }
		else if (screenRendered) { CB_GEM.REM.FPS++; return false; } //Returns false to avoid rendering the screen (the FPS counter needs to be increased manually in we want to count this loop as a frame).
	};
	
	CB_GEM.onLoopEnd = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the loop ends (after rendering the graphics):
	{
		screenRendered = true; //When the loop ends, the screen must have been rendered.
	};
	
	//Modifies the default refresh rate for the loop (it will affect the FPS but not the emulation cycle as it will be processed separately):
	CB_GEM.options.REFRESH_RATE = 1;
	
	//Starts the engine module:
	CB_GEM.begin
	(
		//onStart:
		function(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectBuffer, FPSSprites) //'FPSSprites' contains the 'CB_GraphicSprites.SPRITES_OBJECT' object used to display the FPS counter.
		{
			//Sets the events to the toolbar and its icons:
			var toolbarIconEvent = function()
			{
				if (!CB_GEM.data.emulatorStarted) { return; }
				if (this.id === "button_reset") { loadROMContent(undefined, undefined, undefined, lastROMIdLoaded); }
				else if (this.id === "button_file_selector")
				{
					if (!supportedFileAPI)
					{
						alert("Cannot load local files because File API is not supported!");
						return;
					}
					CB_Elements.id("file_selector").click();
				}
				else if (this.id === "button_fullscreen") { fullScreenToggle(); }
				else if (this.id === "button_pause") { emulatorEnd("Emulator paused"); }
			};
			var toolbarIconsIDs = [ "button_reset", "button_pause", "button_fullscreen", "button_file_selector", "cpl_input" ]; //Identifiers of the toolbar icons.
			var toolbarIconElement = null;
			for (var x = toolbarIconsIDs.length - 1; x >= 0; x--)
			{
				toolbarIconElement = CB_Elements.id(toolbarIconsIDs[x]);
				if (toolbarIconElement !== null)
				{
					makeElementSolid(toolbarIconElement);
					CB_Events.on(toolbarIconElement, "click", toolbarIconEvent);
					if (toolbarIconsIDs[x] === "cpl_input")
					{
						var CPLInputOnChange = function()
						{
							var CPL = parseInt(this.value);
							if (isNaN(CPL)) { CPL = emulatorCyclesPerLoop; }
							else if (CPL < 1) { CPL = 1; } //Minimum is 1 CPL.
							else if (CPL > 10000) { CPL = 10000; } //Maximum are 10000 CPL.
							if (CPL !== emulatorCyclesPerLoop) { emulatorCyclesPerLoop = CPL; CB_console("CPL (Cycles Per Loop) set to: " + emulatorCyclesPerLoop); }
							this.value = CPL;
						};
						CB_Events.on(toolbarIconElement, "change", CPLInputOnChange);
					}
				}
			}
			
			//Prepares to allow using the file selector and the ROM selector (and fills it):
			prepareFileSelector();
			prepareROMSelector();
			
			//Sets the events to the screen controls:
			var screenControlsButtonPressEvent = function() { if (!CB_GEM.data.emulatorStarted || !emulatingROM() || !this.id) { return; } screenButtonPress(parseInt(this.id.replace("screen_button_", "")), true, this); };
			var screenControlsButtonReleaseEvent = function() { if (this.id) { screenButtonPress(parseInt(this.id.replace("screen_button_", "")), false, this); } };
			var screenControlsToggler = CB_Elements.id("controls_toggler");
			if (screenControlsToggler !== null)
			{
				makeElementSolid(screenControlsToggler);
			}
			var screenControls = CB_Elements.id("controls");
			if (screenControls !== null)
			{
				makeElementSolid(screenControls);
			}
			var buttonElement = null;
			for (var x = 0; x < 16; x++)
			{
				buttonElement = CB_Elements.id("screen_button_" + x);
				if (buttonElement !== null)
				{
					makeElementSolid(buttonElement);
					CB_Events.on(buttonElement, "touchstart", screenControlsButtonPressEvent);
					CB_Events.on(buttonElement, "mousedown", screenControlsButtonPressEvent);
					CB_Events.on(buttonElement, "touchend", screenControlsButtonReleaseEvent);
					CB_Events.on(buttonElement, "touchcancel", screenControlsButtonReleaseEvent);
					CB_Events.on(buttonElement, "mouseup", screenControlsButtonReleaseEvent);
				}
			}
			
			//Prevents selection for the message elements:
			CB_Elements.preventSelection(CB_Elements.id("loading"));
			CB_Elements.preventSelection(CB_Elements.id("loading_rom"));
			CB_Elements.preventSelection(CB_Elements.id("waiting_for_any_key"));
			CB_Elements.preventSelection(CB_Elements.id("error"));
			
			FPSSprites.setDisabled(false); //Set to true to hide FPS counter.
			FPSSprites.getCurrent().data.fontSize = "18px"; //Sets the font size for the FPS counter.
			FPSSprites.getCurrent().data.style = "#dddddd"; //Sets the font colour for the FPS counter.
	
			resizeElements(graphicSpritesSceneObject); //Updates all visual elements according to the screen size.

			//Starts showing the information constantly:
			setInterval(updateInfo, 1);
	
			//Updates all when the screen is resized or changes its orientation:
			CB_GEM.onResize = function(graphicSpritesSceneObject, CB_REM_dataObject, CB_CanvasObject, CB_CanvasObjectBuffer)
			{
				resizeElements(graphicSpritesSceneObject);
			};

			//Sets the screen array:
			screenBitMap = arrayBooleansToNumbers(graphicSpritesSceneObject.getById("bitmap_group").getById("bitmap_current").src);

			CB_Elements.hideById("loading"); //Hides the loading message.
			
			CB_Elements.showById("start_button"); //Shows the start button.
			
			//Sets the event for the debug checkbox:
			var debugCheckbox = CB_Elements.id("debug_checkbox");
			if (debugCheckbox !== null)
			{
				debugCheckbox.checked = !!CB_GEM_DEBUG_MESSAGES;
				CB_Events.on(debugCheckbox, "change", function() { CB_GEM_DEBUG_MESSAGES = !!debugCheckbox.checked; updateInfo(); });
			}
		},
		
		//onError:
		function(error) { CB_console("Error: " + error); }
	);
}


//Starts the emulator:
var CPSEraserInterval = null;
function emulatorStart(graphicSpritesSceneObject)
{
	if (CB_GEM.data.emulatorStarted) { return; }

	graphicSpritesSceneObject = graphicSpritesSceneObject || CB_GEM.graphicSpritesSceneObject;
	if (!graphicSpritesSceneObject) { return; }
	
	//Hides the start button:
	CB_Elements.hideById("start_button");
	
	//Enables toolbar icons:
	enableElements([ "button_pause", "button_fullscreen", "button_file_selector", "file_selector", "rom_selector", emulatingROM() || emulatorError && !XHRError ? "button_reset" : undefined, emulatingROM() ? "cpl_input" : undefined ], true); //Reset button and CPL are only enabled if a ROM is being emulated.
	
	//Shows hand (pointer) mouse cursor for screen buttons (as they will be enabled):
	var screenButtonElements = CB_Elements.classes("screen_button");
	if (screenButtonElements !== null)
	{
		for (var x = 0; x < screenButtonElements.length; x++)
		{
			CB_Elements.removeClass(screenButtonElements[x], "disabled");
		}
	}
	
	//Prepares the sound effects and plays one of them (recommended to do this through a user-driven event):
	try
	{
		prepareSoundFx(); //Prepares sound effects to be used later.
		playSoundFx("start");
	}
	catch(E)
	{
		CB_console("Error preparing sounds or playing sound with 'start' ID: " + E);
		CB_GEM.data.soundEnabled = false; //If it fails, disables the sound.
	}

	//Sets the emulator as started:
	CB_GEM.data.emulatorStarted = true;
	
	//Starts the interval to clear the CPS counter:
	clearInterval(CPSEraserInterval);
	CPSEraserInterval = setInterval(function() { CPS = cyclesCounter; cyclesCounter = 0; updateInfo(CPS); }, 1000);
	
	//Starts the emulation loop (independent from the game rendering engine loop):
	emulationLoopTimeout = CB_symmetricCall(emulationLoop, 1, "emulationLoopTimeout");
}


//Ends the emulator:
function emulatorEnd(message)
{
	if (!CB_GEM.data.emulatorStarted) { return; }

	//Clears the emulation loop timeout and the CPS (Cycles Per Second) counter:
	CPS = 0;
	clearTimeout(emulationLoopTimeout);
	CB_symmetricCallClear("emulationLoopTimeout"); //Clears the stored last time used by 'CB_symmetricCall' for the given "emulationLoopTimeout" symmetric interval identifier.

	//Disables toolbar icons:
	enableElements([ "button_pause", "button_reset", "button_fullscreen", "button_file_selector", "file_selector", "rom_selector", "cpl_input" ], false);

	//Shows normal (default) mouse cursor for screen buttons (as they will be disabled):
	var screenButtonElements = CB_Elements.classes("screen_button");
	if (screenButtonElements !== null)
	{
		for (var x = 0; x < screenButtonElements.length; x++)
		{
			CB_Elements.addClass(screenButtonElements[x], "disabled", true); //Only adds the class in the case it is not being used already.
		}
	}

	message = CB_trim(message);
	CB_GEM.data.emulatorStarted = false;
	CB_Elements.insertContentById("start_button", (message !== "" ? message + "<br />" : "") + "Continue emulation!")
	CB_Elements.showById("start_button"); //Shows the start button again.
}


//Updates the information shown:
var _updateInfoLastCPS = 0;
function updateInfo(lastCPS)
{
	CB_GEM.graphicSpritesSceneObject.getById("info").get(0).src =
		"Cycles per second: " + (lastCPS || _updateInfoLastCPS) + "\n" +
		"Cycles per loop: " + emulatorCyclesPerLoop +
		(!CB_GEM.data.emulatorStarted || emulatorPaused ? "\nEmulator paused!" : "") +
		(waitingForKey ? "\nWAITING FOR ANY KEY!" : "") +
		(
			CB_GEM_DEBUG_MESSAGES ?
				"\nLast opcode: " + opcode +
				"\n* First argument (a): " + a +
				"\n* Second argument (b): " + b +
				"\nProgram Counter (pc): " + pc +
				"\nIndex register (i): " + i +
				"\nV flags:\n " + v +
				"\nStack:\n " + stack +
				"\nStack Pointer (sp): " + sp +
				"\nTimer delay: " + timerDelay +
				"\nTimer sound: " + timerSound +
				"\nLast ROM ID: " + lastROMIdLoaded
			: ""
		);
	
	_updateInfoLastCPS = lastCPS || _updateInfoLastCPS || 0;
}


//Resizes all visual elements according to the screen size:
function resizeElements(graphicSpritesSceneObject)
{
	if (graphicSpritesSceneObject instanceof CB_GraphicSpritesScene)
	{
		//Resizes the current map which is being displayed according to the new screen size:
		var ELEMENTS_WIDTH = CB_Screen.getWindowWidth() * 0.80 / 64;
		var ELEMENTS_HEIGHT = CB_Screen.getWindowHeight() * 0.80 / 32;
		ELEMENTS_WIDTH = ELEMENTS_HEIGHT = Math.min(ELEMENTS_WIDTH, ELEMENTS_HEIGHT);
		graphicSpritesSceneObject.getById("bitmap_group").getById("bitmap_current").left = (CB_Screen.getWindowWidth() - ELEMENTS_WIDTH * 64) / 2;
		graphicSpritesSceneObject.getById("bitmap_group").getById("bitmap_current").top = (CB_Screen.getWindowHeight() - ELEMENTS_HEIGHT * 32) / 2;
	
		graphicSpritesSceneObject.getById("bitmap_group").getById("bitmap_current").width = ELEMENTS_WIDTH;
		graphicSpritesSceneObject.getById("bitmap_group").getById("bitmap_current").height = ELEMENTS_HEIGHT;
	
		//Resizes the border:
		graphicSpritesSceneObject.getById("border_sprites").getById("border_sprite").left = graphicSpritesSceneObject.getById("bitmap_group").getById("bitmap_current").left;
		graphicSpritesSceneObject.getById("border_sprites").getById("border_sprite").top = graphicSpritesSceneObject.getById("bitmap_group").getById("bitmap_current").top;
		graphicSpritesSceneObject.getById("border_sprites").getById("border_sprite").width = ELEMENTS_WIDTH * 64;
		graphicSpritesSceneObject.getById("border_sprites").getById("border_sprite").height = ELEMENTS_HEIGHT * 32;
		
		//Locates the toolbar:
		var toolbar = CB_Elements.id("toolbar");
		if (toolbar !== null)
		{
			toolbar.style.left = graphicSpritesSceneObject.getById("bitmap_group").getById("bitmap_current").left + "px";
		}
	}

	//Resizes the toolbar and its icons:
	var toolbarIconMargin = parseInt(Math.min(CB_Screen.getWindowWidth(), CB_Screen.getWindowHeight()) * 0.08) + "px";
	var toolbarIconWidthAndHeight = parseInt(Math.min(CB_Screen.getWindowWidth(), CB_Screen.getWindowHeight()) * 0.07) + "px";
	var toolbarIconsIDs = [ "button_reset", "button_pause", "button_fullscreen", "button_file_selector", "rom_selector", "cpl_input" ]; //Identifiers of the toolbar icons.
	var toolbarIconElement = null;
	for (var x = toolbarIconsIDs.length - 1; x >= 0; x--)
	{
		toolbarIconElement = CB_Elements.id(toolbarIconsIDs[x]);
		if (toolbarIconElement !== null)
		{
			toolbarIconElement.style.height = toolbarIconWidthAndHeight;
			toolbarIconElement.style.fontSize = toolbarIconElement.style.lineHeight = parseInt(toolbarIconWidthAndHeight) / 2 + "px";
			if (toolbarIconElement.id !== "rom_selector" && toolbarIconElement.id !== "cpl_input")
			{
				toolbarIconElement.style.width = toolbarIconWidthAndHeight;
			}
		}
	}
	
	//Resizes the screen controls:
	var screenControlsToggler = CB_Elements.id("controls_toggler");
	if (screenControlsToggler !== null)
	{
		screenControlsToggler.style.right = "0px";
		screenControlsToggler.style.bottom = toolbarIconMargin;
		screenControlsToggler.style.width = (parseInt(toolbarIconWidthAndHeight) / 2) + "px";
		screenControlsToggler.style.height = screenControlsToggler.style.lineHeight = (parseInt(toolbarIconWidthAndHeight) / 2) + "px";
		screenControlsToggler.style.fontSize = parseInt(toolbarIconWidthAndHeight) / 4 + "px";
	}
	var screenControls = CB_Elements.id("controls");
	if (screenControls !== null)
	{
		screenControls.style.right = toolbarIconMargin;
		screenControls.style.bottom = toolbarIconMargin;
	}
	var buttonElement = null;
	for (var x = 0; x < 16; x++)
	{
		buttonElement = CB_Elements.id("screen_button_" + x);
		if (buttonElement !== null)
		{
			buttonElement.style.width = toolbarIconWidthAndHeight;
			buttonElement.style.height = buttonElement.style.lineHeight = toolbarIconWidthAndHeight;
			buttonElement.style.fontSize = buttonElement.style.lineHeight = parseInt(toolbarIconWidthAndHeight) / 2 + "px";
		}
	}

	//Resizes the message when loading a ROM:
	var loadingROMElement = CB_Elements.id("loading_rom");
	if (loadingROMElement !== null)
	{
		 loadingROMElement.style.fontSize = loadingROMElement.style.lineHeight = parseInt(toolbarIconWidthAndHeight) * 2 + "px";
		 loadingROMElement.style.left = (CB_Screen.getWindowWidth() / 2 - parseInt(loadingROMElement.style.fontSize) * 6 / 2) + "px";
		 loadingROMElement.style.top = (CB_Screen.getWindowHeight() / 2 - parseInt(loadingROMElement.style.fontSize) / 2) + "px";
	}
	
	//Resizes the message when waiting for any key:
	var waitingForAnyKeyElement = CB_Elements.id("waiting_for_any_key");
	if (waitingForAnyKeyElement !== null)
	{
		waitingForAnyKeyElement.style.fontSize = waitingForAnyKeyElement.style.lineHeight = parseInt(toolbarIconWidthAndHeight) * 1.8 + "px";
		waitingForAnyKeyElement.style.left = (CB_Screen.getWindowWidth() / 2 - parseInt(waitingForAnyKeyElement.style.fontSize) * 8 / 2) + "px";
		waitingForAnyKeyElement.style.top = (CB_Screen.getWindowHeight() / 2 - parseInt(waitingForAnyKeyElement.style.fontSize) / 2) + "px";
	}

	//Resizes the message when a error happened:
	var errorElement = CB_Elements.id("error");
	if (errorElement !== null)
	{
		 errorElement.style.fontSize = errorElement.style.lineHeight = parseInt(toolbarIconWidthAndHeight) * 2 + "px";
		 errorElement.style.left = (CB_Screen.getWindowWidth() / 2 - parseInt(errorElement.style.fontSize) * 2.5 / 2) + "px";
		 errorElement.style.top = (CB_Screen.getWindowHeight() / 2 - parseInt(errorElement.style.fontSize) / 2) + "px";
	}
	
	//Resizes the FPS and the information text:
	CB_GEM.graphicSpritesSceneObject.getById("fps_group").getById("fps").data.fontSize = parseInt(toolbarIconWidthAndHeight) / 2.5 + "px";
	CB_GEM.graphicSpritesSceneObject.getById("info").get(0).data.fontSize = parseInt(toolbarIconWidthAndHeight) / 3 + "px";
	if (CB_Screen.isLandscape())
	{
		CB_GEM.graphicSpritesSceneObject.getById("fps_group").getById("fps").top = 1;
		CB_GEM.graphicSpritesSceneObject.getById("info").get(0).top = parseInt(toolbarIconWidthAndHeight) / 1.4;
	}
	else
	{
		CB_GEM.graphicSpritesSceneObject.getById("fps_group").getById("fps").top = parseInt(toolbarIconWidthAndHeight) + 2;
		CB_GEM.graphicSpritesSceneObject.getById("info").get(0).top = parseInt(toolbarIconWidthAndHeight) * 1.5;
	}
	
	//Resizes the font of the start button:
	var startButton = CB_Elements.id("start_button");
	if (startButton !== null) { startButton.style.fontSize = parseInt(toolbarIconWidthAndHeight) / 3 + "px"; }
	
	//Forces screen rendering again (just in case):
	screenRendered = false;
}


//Input management (some controllers can also fire keyboard events) for the UI (not for the emulator):
var _inputProcessedLastTime = 0;
var _ignoreInputMs = 150; //Number of milliseconds that the input will be ignored after an input has been processed (to avoid processing the input too fast).
function manageInput(action)
{
	//If not enough time has been elapsed since the last movement, exits (to avoid moving or processing the input too fast):
	if (CB_Device.getTiming() < _inputProcessedLastTime + _ignoreInputMs) { return; }

	var actionPerformed = false;

	//If the emulator has not started:
	if (!CB_GEM.data.emulatorStarted)
	{
		//If return, space or a button (button 1, 2 or 3) or axis from any gamepad is pressed, starts the emulator:
		if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.ENTER) || CB_Keyboard.isKeyDown(CB_Keyboard.keys.SPACEBAR) || CB_Controllers.isButtonDown([1, 2, 3]) || CB_Controllers.getAxesDown().length > 0 || CB_Controllers.getAxesDown("", -1).length > 0)
		{
			actionPerformed = true;
			emulatorStart();
		}
	}
	else if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.ESC))
	{
		actionPerformed = true;
		emulatorEnd("Emulator paused");
		
	}
	else if (CB_Keyboard.isKeyDown(CB_Keyboard.keys.T))
	{
		actionPerformed = true;
		screenControlsToggle();
	}
	
	if (actionPerformed)
	{
		_inputProcessedLastTime = CB_Device.getTiming(); //As we have processed the input, updates the time with the new one (to avoid processing the input too fast).		
	}
}


//Sets a screen button as pressed:
function screenButtonPress(buttonCode, pressed, screenButtonElement) //Button codes go from 0 to 15.
{
	pressed = !!pressed;
	screenButtonsPressed[buttonCode] = pressed;
	screenButtonElement = screenButtonElement || CB_Elements.id("screen_button_" + buttonCode);
	if (screenButtonElement !== null)
	{
		if (pressed) { CB_Elements.addClass(screenButtonElement, "pressed", true); } //Only adds the class in the case it is not being used already.
		else { CB_Elements.removeClass(screenButtonElement, "pressed"); }
	}
}


//Returns whether a given screen button is being pressed or not:
var screenButtonsPressed = new Array(15); //It will keep the screen buttons status.
for (var x = 0; x < 16; x++) { screenButtonsPressed[x] = false; }
function isScreenButtonDown(keyCode) //'keyCode' is an hexadecimal code used by CHIP-8.
{
	return screenButtonsPressed[keyCode];
}


//Prepares sound effects:
var sfx = null; //Global object to play the sounds.
var prepareSoundFxExecuted = false;
function prepareSoundFx()
{
	if (prepareSoundFxExecuted) { return; }

	prepareSoundFxExecuted = true;
	
	var jsfxObject = CB_Speaker.getJsfxObject(); //Gets the 'jsfx' object.
	if (jsfxObject !== null)
	{
		//Defines the sound effects:
		var library =
		{
			"start":
				jsfx.Preset.Select,
			"beep":
				{ "Volume": { "Sustain": 0.05, "Decay": 0.2, "Punch": 1, "Master": 0.25 } }
		};

		//Loads the sound effects:
		sfx = CB_AudioDetector.isAPISupported("WAAPI") ? jsfxObject.Live(library) : jsfxObject.Sounds(library); //Uses AudioContext (Web Audio API) if available.
	}
}


//Plays the desired sound effect (by its identifier):
function playSoundFx(id)
{
	if (!sfx || typeof(sfx[id]) !== "function") { return; }
	else if (!CB_GEM.data.soundEnabled) { return; }

	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	sfx[id]();
}


//Toggles full screen mode:
//NOTE: some browsers will fail to enable full screen mode if it is not requested through a user-driven event (as "onClick", "onTouchStart", etc.).
function fullScreenToggle()
{
	CB_console("Toggling full screen mode...");
	//If it is using full screen mode already, disables it:
	if (CB_Screen.isFullScreen())
	{
		CB_console("Full screen mode detected. Trying to restore normal mode...");
		CB_Screen.setFullScreen(false); //Uses the Fullscreen API and fallbacks to other methods internally, including NW.js, Electron ones, when not available.
	}
	//...otherwise, requests full screen mode:
	else
	{
		CB_console("Normal mode detected. Trying to enable full screen mode...");
		CB_Screen.setFullScreen(true, undefined, true); //Allows reloading into another (bigger) window (for legacy clients).
	}
}


//Enables or disables desired elements:
function enableElements(elementsIDsArray, enable)
{
	if (CB_isArray(elementsIDsArray))
	{
		var elementLoop = null;
		for (var x = elementsIDsArray.length - 1; x >= 0; x--)
		{
			elementLoop = CB_Elements.id(elementsIDsArray[x]);
			if (elementLoop !== null)
			{
				elementLoop.disabled = !enable;
			}
		}
	}
}


//Toggles screen controls (make them show or hide):
function screenControlsToggle()
{
	CB_console("Toggling screen controls...");
	CB_Elements.showHideById
	(
		"controls", //element.
		undefined, //displayValue.
		true, //checkValues.
		false, //computed.
		undefined, //onToggleDisplay. Calls the function after showing/hiding the element.
		function(element, displayValue) //onShow. Calls the function after showing the element.
		{
			CB_console("Controls shown!");
			CB_Elements.setClassById("controls_toggler", "");
		},
		function(element, displayValue) //onHide. Calls the function after hiding the element.
		{
			CB_console("Controls hidden!");
			CB_Elements.setClassById("controls_toggler", "controls_hidden");
		}
	);
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