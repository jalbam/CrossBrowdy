/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

//Path to the graphic rendering engine module:
var CB_GEM_PATH = CB_GEM_PATH || "../simple_game_engine_files/";

var CB_GEM_DEBUG_MESSAGES = true; //Shows debug messages.

//Adds the game engine module to CrossBrowdy:
var CB_GEM_MODULE_NEEDED_MODULES = {};
CB_GEM_MODULE_NEEDED_MODULES[CB_GEM_PATH + "game_engine_module.js"] = { load: true, mandatory: true, absolutePath: true };
CB_Modules.addNeededModule(CB_NAME, "GAME_ENGINE_MODULE", CB_GEM_MODULE_NEEDED_MODULES);


CB_init(main); //It will call the "main" function when ready


//This function will be called when CrossBrowdy is ready:
function main()
{
	CB_console("CrossBrowdy and all needed modules loaded. Starting game...");
	
	//Prepares the background music (to play it later):
	prepareMusic();
	
	//Defines the events to detect the input:
	var pointerX = null;
	var pointerY = null;
	CB_Pointer.onDown(function(e) { pointerX = e.clientX; pointerY = e.clientY; }); //Gets the pointer coordinates.
	var pointerCoordinatesClear = function (e) { pointerX = pointerY = null; }; //Clears the pointer coordinates.
	CB_Pointer.onUp(pointerCoordinatesClear);
	CB_Pointer.onCancel(pointerCoordinatesClear);
	CB_Pointer.onLeave(pointerCoordinatesClear);
	CB_Pointer.onOut(pointerCoordinatesClear);

	//Defines needed data:
	var balloonsAppearingMsInitial = 1500;
	CB_GEM.data = //Data stored in the game engine module (can be exported to save the game status):
	{
		soundEnabled: true,
		musicEnabled: true,
		gameStarted: false,
		balloonsAppearingMsInitial: balloonsAppearingMsInitial, //Milliseconds to wait before creating a new balloon.
		balloonsAppearingMs: balloonsAppearingMsInitial, //Milliseconds to wait before creating a new balloon.
		balloonsIdCounter: 0,
		balloonsCounter: 0,
		balloonsPopped: 0,
		score: 0
	};
	var balloonsAppearingMsMinimum = 150; //Minimum of milliseconds to wait to create another new balloon. The 'CB_GEM.data.balloonsAppearingMs' integer will never be lower than this value.
	var balloonsAppearingMsDecreasingPerLoop = 1; //Number of milliseconds that will be decreased from the 'CB_GEM.data.balloonsAppearingMs' integer (to increase speed after a balloon appears).
	var balloonsCounterMax = 150;
	var balloonWidth = 40;
	var balloonHeight = 50;
	var balloonLeft = null;
	var balloonLeftMin = balloonWidth;
	var balloonLeftMax = CB_Screen.getWindowWidth() - balloonWidth;
	var balloonTop = null;
	var balloonTopMin = balloonHeight;
	var balloonTopMax = CB_Screen.getWindowHeight() - balloonHeight;
	var balloonColor = null;
	
	//Updates the limits when the screen is resized or changes its orientation:
	CB_GEM.onResize = function(graphicSpritesSceneObject, CB_REM_dataObject, CB_CanvasObject, CB_CanvasObjectBuffer)
	{
		balloonLeftMax = CB_Screen.getWindowWidth() - balloonWidth;
		balloonTopMax = CB_Screen.getWindowHeight() - balloonHeight;
	};

	//Sets the desired sprites scene data (can be modified dynamically):
	CB_GEM.spritesGroupsData =
	{
		//'my_sprites_groups_1' ('CB_GraphicSpritesScene.SPRITES_GROUPS_OBJECT' object). Some missing or non-valid properties will get a default value:
		id: "my_sprites_groups_1", //Identifier of the sprites groups object (also used for the 'CB_GraphicSpritesScene' object). Optional but recommended. It should be unique. By default, it is generated automatically.
		//Numeric array containing 'CB_GraphicSprites.SPRITES_OBJECT' objects with all the sprites groups that will be used (their "parent" property will be set to point the current 'CB_GraphicSpritesScene' object which contains them):
		spritesGroups:
		[
			{
				id: "info",
				srcType: CB_GraphicSprites.SRC_TYPES.TEXT,
				src:
					"Score: 0\n" +
					"Balloons popped: 0\n" +
					"Balloons shown: 0 (max limit: " + balloonsCounterMax + ")",
				top: 15,
				zIndex: balloonsCounterMax + 2,
				data:
				{
					fontSize: "16px",
					fontFamily: "courier",
					style: "#ffff00",
					fontWeight: "bold",
					stroke: true
				},
				sprites: [ { id: "info_sprite" } ]
			}
		]
	};

	//Defines the callbacks for the game loop:
	var timingLastTime = 0;
	var timingNow = null;
	CB_GEM.onLoopStart = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop starts, before rendering the graphics (if it returns false, it will skip rendering in this loop):
	{
		if (!CB_GEM.data.gameStarted) { return; }
		if (CB_GEM.data.balloonsCounter >= balloonsCounterMax)
		{
			gameEnd("Game over :(");
			return;
		}
		
		//Gets the current timing:
		timingNow = CB_Device.getTiming();
		
		//If enough time has elapsed, creates a new balloon:
		if (timingNow - timingLastTime >= CB_GEM.data.balloonsAppearingMs)
		{
			//Inserts the new balloon:
			balloonLeft = Math.floor(Math.random() * (balloonLeftMax - balloonLeftMin)) + balloonLeftMin;
			balloonTop = Math.floor(Math.random() * (balloonTopMax - balloonTopMin)) + balloonTopMin;
			balloonColor = //Random balloon colour (not too dark):
				Math.floor(Math.random() * (255 - 80)) + ", " + //Red.
				Math.floor(Math.random() * (255 - 80)) + ", " + //Green.
				Math.floor(Math.random() * (255 - 80)); //Blue.
			graphicSpritesSceneObject.insert
			(
				//'CB_GraphicSprites.SPRITES_OBJECT' object for the balloon (to create the internal 'CB_GraphicSprites' object with its internal sprite and sub-sprite):
				{
					id: "balloon_" + CB_GEM.data.balloonsIdCounter,
					srcType: CB_GraphicSprites.SRC_TYPES.ELLIPSE,
					data: { isBalloon: true, radiusX: balloonWidth, radiusY: balloonHeight, startAngle: 2, endAngle: 11, style: "rgba(" + balloonColor + ", 0.8)" },
					left: balloonLeft,
					top: balloonTop,
					zIndex: CB_GEM.data.balloonsIdCounter + 1,
					sprites:
					[
						//'CB_GraphicSprites.SPRITE_OBJECT' object with the ellipse representing the balloon (one single sprite):
						{
							id: "balloon_" + CB_GEM.data.balloonsIdCounter + "_sprite",
							subSprites:
							[
								{
									//'CB_GraphicSprites.SUBSPRITE_OBJECT' object for the text with the identifier of the balloon (one single sub-sprite):
									id: "ballon_" + CB_GEM.data.balloonsIdCounter + "_identifier",
									srcType: CB_GraphicSprites.SRC_TYPES.TEXT,
									src: CB_GEM.data.balloonsIdCounter + 1,
									left: -parseFloat(CB_REM_dataObject.CB_CanvasObjectContext.measureText(CB_GEM.data.balloonsIdCounter + "").width) || 0,
									top: -9,
									data:
									{
										fontSize: "18px",
										fontFamily: "courier",
										style: "#000000",
										fontWeight: "bold"
									}
								}
							]
						}
					]
				}
			);
			
			CB_GEM.data.balloonsIdCounter++;
			CB_GEM.data.balloonsCounter++;

			graphicSpritesSceneObject.getById("info").getById("info_sprite").zIndex = CB_GEM.data.balloonsIdCounter + 1; //Increments z-index of the information panel to keep it above all.
			
			CB_GEM.data.balloonsAppearingMs -= balloonsAppearingMsDecreasingPerLoop;
			if (CB_GEM.data.balloonsAppearingMs < balloonsAppearingMsMinimum) { CB_GEM.data.balloonsAppearingMs = balloonsAppearingMsMinimum; }
			
			timingLastTime = timingNow; //Updates the last timing when the last balloon was created.
			
			updateInfo(graphicSpritesSceneObject, balloonsCounterMax); //Updates the information shown.
		}
	};
	
	CB_GEM.onLoopEnd = function(graphicSpritesSceneObject, CB_REM_dataObject, expectedCallingTime) //When the game loop ends, after rendering the graphics (not executed if the 'CB_GEM.onLoopStart' function returned false):
	{
		if (!CB_GEM.data.gameStarted) { return; }
		
		if (pointerX === null || pointerY === null) { return; } //If the screen is not being touched, exits.
		
		//Loops through all the balloons in the 'CB_GraphicSpritesScene' object (using reversed z-index order):
		var balloonPopped = false;
		CB_GEM.graphicSpritesSceneObject.forEach
		(
			function(graphicSpritesObject) //functionEach.
			{
				if (graphicSpritesObject.spritesGroup.data.isBalloon)
				{
					if (balloonPopped) { return; } //Only allows to pop once balloon per touch.
					
					//Checks whether a balloon has been pressed:
					if (CB_Collisions.isPointOverEllipse(pointerX, pointerY, graphicSpritesObject.spritesGroup.left, graphicSpritesObject.spritesGroup.top, graphicSpritesObject.spritesGroup.data.radiusX, graphicSpritesObject.spritesGroup.data.radiusY))
					{
						balloonPopped = true;
						pointerCoordinatesClear(); //Clears the pointer coordinates (to prevent to explode more balloons in the next loop with the same action).
						CB_GEM.graphicSpritesSceneObject.removeById(graphicSpritesObject.id); //Removes the balloon.
						CB_GEM.data.balloonsCounter--;
						CB_GEM.data.balloonsPopped++;
						CB_GEM.data.score += balloonsAppearingMsInitial - CB_GEM.data.balloonsAppearingMs + 1; //The faster they appear, the higher is the score you get.
						playSoundFx("balloon_explosion"); //Plays the explosion sound.
						CB_Device.Vibration.start(100); //Makes the device vibrate.
						updateInfo(graphicSpritesSceneObject, balloonsCounterMax); //Updates the information shown.
					}
				}
			},
			false, //orderedByZIndex.
			0, //delayBetweenEach.
			CB_Arrays.copy(CB_GEM.graphicSpritesSceneObject.spritesGroups.itemsByZIndex).reverse() //graphicSpritesObjects.
		);
	};
	
	//Sets some keyboard events (some controllers can also fire keyboard events):
	CB_Keyboard.onKeyDown
	(
		function(e, keyCode)
		{
			//After pressing the ESC key, ends the game:
			if (keyCode === CB_Keyboard.keys.ESC[0]) { gameEnd("Game aborted"); }
		}
	);
	
	//Starts the game engine module:
	CB_GEM.begin
	(
		//onStart:
		function(graphicSpritesSceneObject, CB_CanvasObject, CB_CanvasObjectBuffer, FPSSprites) //'FPSSprites' contains the 'CB_GraphicSprites.SPRITES_OBJECT' object used to display the FPS counter.
		{
			FPSSprites.setDisabled(false); //Set to true to hide FPS counter.
			FPSSprites.getCurrent().data.fontSize = "18px"; //Sets the font size for the FPS counter.
			FPSSprites.getCurrent().data.style = "#ff0000"; //Sets the font colour for the FPS counter.
			
			CB_Elements.hideById("loading"); //Hides the loading message.
			CB_Elements.showById("start_button"); //Shows the start button.
		},
		
		//onError:
		function(error) { CB_console("Error: " + error); }
	);
}


//Starts the game:
function gameStart()
{
	if (CB_GEM.data.gameStarted) { return; }
	
	//Hides the start button:
	CB_Elements.hideById("start_button");
	
	//Removes all balloons from the 'CB_GraphicSpritesScene' object:
	CB_GEM.graphicSpritesSceneObject.forEach
	(
		function(graphicSpritesObject) //functionEach.
		{
			if (graphicSpritesObject.spritesGroup.data.isBalloon)
			{
				CB_GEM.graphicSpritesSceneObject.removeById(graphicSpritesObject.id);
			}
		},
		false, //orderedByZIndex.
		0, //delayBetweenEach.
		CB_Arrays.copy(CB_GEM.graphicSpritesSceneObject.spritesGroups.items) //graphicSpritesObjects.
	);
	
	//Resets the variables:
	CB_GEM.data.balloonsIdCounter = 0;
	CB_GEM.data.balloonsCounter = 0;
	CB_GEM.data.balloonsPopped = 0;
	CB_GEM.data.score = 0;
	CB_GEM.data.balloonsAppearingMs = CB_GEM.data.balloonsAppearingMsInitial;
	
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
	
	CB_Device.Vibration.start(100); //Makes the device vibrate.

	//Starts playing the background music (recommended to do this through a user-driven event):
	playMusic(); //If it was playing already, it will not do anything.
	
	//Sets the game as started:
	CB_GEM.data.gameStarted = true; //When set to true, starts the game automatically as the game loops detect it.
}


//Ends the game:
function gameEnd(message)
{
	if (!CB_GEM.data.gameStarted) { return; }
		
	message = CB_trim(message);
	CB_GEM.data.gameStarted = false;
	CB_Elements.insertContentById("start_button", (message !== "" ? message + "<br />" : "") + "Start game!")
	CB_Elements.showById("start_button"); //Shows the start button again.
}


//Updates the information shown:
function updateInfo(graphicSpritesSceneObject, balloonsCounterMax)
{
	graphicSpritesSceneObject.getById("info").get(0).src =
		"Score: " + CB_GEM.data.score + "\n" +
		"Balloons popped: " + CB_GEM.data.balloonsPopped + "\n" +
		"Balloons shown: " + CB_GEM.data.balloonsCounter + " (max limit: " + balloonsCounterMax + ")";
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
			"balloon_explosion":
				jsfx.Preset.Explosion
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


//Prepares background music:
var timbreJSObject = null; //Global 'T' object to play the sounds.
var bufferResult = null; //Global 'result'.
function prepareMusic()
{
	//Audio processing and synthesizing (taken from https://mohayonao.github.io/timbre.js/reich.html):
	timbreJSObject = CB_Speaker.getTimbreJSObject(); //Gets the 'T' object.
	if (timbreJSObject !== null)
	{
		timbreJSObject.rec
		(
			function(output)
			{
				var midis = [69, 71, 72, 76, 69, 71, 72, 76].scramble();
				var msec  = timbreJSObject.timevalue("bpm120 l8");
				var synth = timbreJSObject
				(
					"OscGen",
					{ env: timbreJSObject("perc", { r: msec, ar: true }) }
				);

				timbreJSObject
				(
					"interval",
					{ interval: msec },
					function(count)
					{
						if (count < midis.length)
						{
							synth.noteOn(midis[count], 100);
						}
						else { output.done(); }
					}
				).start();

				output.send(synth);
			}
		).then
		(
			function(result) { bufferResult = result; }
		);
	}
}


//Plays the background music:
var playingMusic = false;
function playMusic()
{
	if (timbreJSObject === null || playingMusic) { return; }
	else if (!CB_GEM.data.musicEnabled) { return; }

	try
	{
		var L = timbreJSObject("buffer", { buffer: bufferResult, loop: true });
		var R = timbreJSObject("buffer", { buffer: bufferResult, loop: true });
	}
	catch(E)
	{
		CB_GEM.data.musicEnabled = false;
		CB_console("Cannot create buffer. Error: " + E);
		return;
	}

	playingMusic = true;

	var num = 400;
	var duration = L.duration;

	R.pitch = (duration * (num - 1)) / (duration * num);

	//Plays the audio:
	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	timbreJSObject
	(
		"delay",
		{ time: "bpm120 l16", fb: 0.1, cross: true },
		timbreJSObject("pan", { pos: -0.6 }, L),
		timbreJSObject("pan", { pos: +0.6 }, R)
	).play();
}