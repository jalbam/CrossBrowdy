/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

//Path to the graphic rendering engine module:
var CB_GEM_PATH = CB_GEM_PATH || "../simple_game_engine_files/";

var CB_GEM_DEBUG_MESSAGES = true; //Defines whether to shows debug messages or not.

//Adds the game engine module to CrossBrowdy:
var CB_GEM_MODULE_NEEDED_MODULES = {};
CB_GEM_MODULE_NEEDED_MODULES[CB_GEM_PATH + "game_engine_module.js"] = { load: true, mandatory: true, absolutePath: true };
CB_Modules.addNeededModule(CB_NAME, "GAME_ENGINE_MODULE", CB_GEM_MODULE_NEEDED_MODULES);


CB_init(main); //It will call the "main" function when ready


//This function will be called when CrossBrowdy is ready:
function main()
{
	CB_console("CrossBrowdy and all needed modules loaded. Starting game...");
	
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
	var balloonsAppearingMsInitial = 1300;
	var ballonsPerLoopInitial = 1;
	CB_GEM.data = //Data stored in the game engine module (can be exported to save the game status):
	{
		soundEnabled: true,
		musicEnabled: true,
		gameStarted: false,
		ballonsPerLoopInitial: ballonsPerLoopInitial, //Initial number of ballons appearing per loop.
		balloonsPerLoop: ballonsPerLoopInitial, //Number of ballons appearing per loop.
		loopsToIncreaseBalloonsPerLoopCounter: 0, //Internal counter of the number of loops before the 'loopsToIncreaseBalloonsPerLoop' gets increased.
		balloonsAppearingMsInitial: balloonsAppearingMsInitial, //Initial milliseconds to wait before creating a new balloon.
		balloonsAppearingMs: balloonsAppearingMsInitial, //Milliseconds to wait before creating a new balloon.
		balloonsIdCounter: 0,
		balloonsCounter: 0,
		balloonsPopped: 0,
		score: 0
	};
	var loopsToIncreaseBalloonsPerLoop = 50; //Number of loops necessary to increase (by one) the number of balloons per loop.
	var balloonsAppearingMsMinimum = 150; //Minimum of milliseconds to wait to create another new balloon. The 'CB_GEM.data.balloonsAppearingMs' integer will never be lower than this value.
	var balloonsAppearingMsDecreasingPerLoop = 2; //Number of milliseconds that will be decreased from the 'CB_GEM.data.balloonsAppearingMs' integer (to increase speed after a balloon appears).
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
			gameEnd("Game over :(<br />Score: " + CB_GEM.data.score);
			return;
		}
		
		//Gets the current timing:
		timingNow = CB_Device.getTiming();
		
		//If enough time has elapsed, creates a new balloon:
		if (timingNow - timingLastTime >= CB_GEM.data.balloonsAppearingMs)
		{
			for (var x = 0; x < CB_GEM.data.balloonsPerLoop; x++)
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
			}
			
			graphicSpritesSceneObject.getById("info").getById("info_sprite").zIndex = CB_GEM.data.balloonsIdCounter + 1; //Increments z-index of the information panel to keep it above all.
			
			CB_GEM.data.balloonsAppearingMs -= balloonsAppearingMsDecreasingPerLoop;
			if (CB_GEM.data.balloonsAppearingMs < balloonsAppearingMsMinimum) { CB_GEM.data.balloonsAppearingMs = balloonsAppearingMsMinimum; }
			
			CB_GEM.data.loopsToIncreaseBalloonsPerLoopCounter++;
			if (CB_GEM.data.loopsToIncreaseBalloonsPerLoopCounter > loopsToIncreaseBalloonsPerLoop) { CB_GEM.data.balloonsPerLoop++; CB_GEM.data.loopsToIncreaseBalloonsPerLoopCounter = 0; }
			
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
			if (keyCode === CB_Keyboard.keys.ESC[0]) { gameEnd("Game aborted<br />Score: " + CB_GEM.data.score); }
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
	CB_GEM.data.balloonsPerLoop = CB_GEM.data.ballonsPerLoopInitial;
	CB_GEM.data.balloonsAppearingMs = CB_GEM.data.balloonsAppearingMsInitial;
	CB_GEM.data.loopsToIncreaseBalloonsPerLoopCounter = 0;
	
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


//Plays the background music:
var timbreJSObject = null; //Global 'T' object to play the sounds.
var playingMusic = false;
function playMusic()
{
	if (!CB_GEM.data.musicEnabled) { return; }
	
	//Audio processing and synthesizing (taken from https://mohayonao.github.io/timbre.js/satie.html):
	timbreJSObject = CB_Speaker.getTimbreJSObject(); //Gets the 'T' object.
	if (timbreJSObject === null || playingMusic) { return; }

	playingMusic = true;

	var mml0, mml1;
	var env = T("adsr", { d: 3000, s: 0, r: 600 });
	var synth = T("SynthDef", { mul: 0.45, poly: 8 });

	synth.def = function(opts)
	{

		var op1 = T("sin", { freq: opts.freq * 6, fb: 0.25, mul: 0.4 });
		var op2 = T("sin", { freq: opts.freq, phase: op1, mul: opts.velocity / 128 });
		return env.clone().append(op2).on("ended", opts.doneAction).bang();
	};

	var master = synth;
	var mod = T("sin", { freq: 2, add: 3200, mul: 800, kr: 1 });
	master = T("eq", { params: { lf: [800, 0.5, -2], mf: [6400, 0.5, 4] } }, master);
	master = T("phaser", { freq: mod, Q: 2, steps: 4 }, master);
	master = T("delay", { time: "BPM60 L16", fb: 0.65, mix: 0.25 }, master);

	mml0 = "t60 l4 v6 q2 o3";
	mml0 += "[ [g < b0<d0f+2>> d <a0<c+0f+2>>]8 ";
	mml0 += "f+ <a0<c+0f+2>>> b<<b0<d0f+2>> e<g0b2> e<b0<d0g2>> d<f0a0<d2>>";
	mml0 += ">a<<a0<c0e2>> d<g0b0<e2>> d<d0g0b0<e2>> d<c0e0a0<d2>> d<c0f+0a0<d2>>";
	mml0 += "d<a0<c0f2>> d<a0<c0e2>> d<d0g0b0<e2>> d<c0e0a0<d2>> d<c0f+0a0<d2>>";
	mml0 += "| e<b0<e0g2>> f+<a0<c+0f+2>>> b<<b0<d0f+2>> e<<c+0e0a2>> e<a0<c+0f+0a2>>";
	mml0 += "eb0<a0<d>e0b0<d0g>> a0<g2.> d0a0<d2.> ]";
	mml0 += "e<b0<e0g2>> e<a0<d0f0a2>> e<a0<c0f2>> e<<c0e0a2>> e<a0<c0f0a2>>";
	mml0 += "eb0<a0<d>e0b0<d0g>> a0<g2.> d0a0<d2.>";

	mml1 = "t60 v14 l4 o6";
	mml1 += "[ r2. r2. r2. r2.";
	mml1 += "rf+a gf+c+ >b<c+d >a2. f+2.& f+2.& f+2.& f+2.< rf+a gf+c+ >b<c+d >a2.<";
	mml1 += "c+2. f+2. >e2.&e2.&e2.";
	mml1 += "ab<c ed>b< dc>b< d2.& d2d";
	mml1 += "efg acd ed>b <d2.& d2d";
	mml1 += "| g2. f+2.> bab< c+de c+de>";
	mml1 += "f+2. c0e0a0<c2.> d0f+0a0<d2. ]";
	mml1 += "g2. f2.> b<cf edc edc>";
	mml1 += "f2. c0e0a0<c2.> d0f0a0<d2.";

	var audioObject = T("mml", { mml: [mml0, mml1] }, synth).on
	(
		"ended",
		function() { this.stop(); this.start(); } //Starts again (loops).
	).set({ buddies: master }).start();

	playingMusic = audioObject.playbackState === 1;
	if (playingMusic) { CB_console("Playing music..."); }
}