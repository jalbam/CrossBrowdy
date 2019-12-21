/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */
/* Documentation source: http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/ */
/* Some code by Rodrigo Navarro taken (modified) from: https://github.com/reu/chip8.js/blob/master/src/cpu.js */

var EMULATOR_DEBUG = false;

var EMULATOR_CYCLES_PER_LOOP_DEFAULT = 2; //Number of CPU cycles per emulator loop by default. The higher the number, the faster it will be.
var emulatorCyclesPerLoop = EMULATOR_CYCLES_PER_LOOP_DEFAULT; //Number of CPU cycles per emulator loop, currently used. The higher the number, the faster it will be.

var lastROMIdLoaded = null; //It will keep the last ROM identifier loaded (if any).
var lastROMContentLoaded = null; //It will keep the last ROM content loaded.

var screenBitMap = null; //Array that will point to the bitmap used by the graphic rendering engine.

var emulatorPaused = true; //Defines whether the emulator is paused or not.

var emulatorError = false; //Defines whether any error has been detected or not (to stop emulation).

var emulatorInitialized = false; //Defines whether the emulator has been initialized (with all necessary values) or not.

var opcode = null; //It will store the current opcode being executed.
var mem = null; //Memory content. It will be a 'Uint8Array' typed array of 4096 bytes (initialized later as typed arrays might need to be polyfilled by CrossBrowdy first).
var v = null; //V registers (V0, V1, V2... to VE). It will be a 'Uint8Array' typed array of 16 bytes (initialized later as typed arrays might need to be polyfilled by CrossBrowdy first)
var i = null; //Index register.
var pc = null; //Program counter.
var stack = new Array(16); //Stack content.
var sp = null; //Stack pointer.

var timerDelay = null; //Countdown 60Hz timer for delays.
var timerSound = null; //Countdown 60Hz timer for sounds.

var drawFlag = false; //Flag to define whether to draw the screen or not.
var screenRendered = true; //Flag to check whether the screen has been rendered by the graphic rendering engine or not.

var waitingForKey = false;

var CPS = 0; //Last cycles per second performed.
var cyclesCounter = 0; //Number of cycles performed. It will be cleared automatically each second.

var KEYS_MAP_DEFAULT = null; //It will keep the keys mapping (for keyboard and controllers) by default. Filled automatically later.
var keysMap = KEYS_MAP_DEFAULT; //It will keep the keys mapping (for keyboard and controllers) for the current ROM.

//Font set used for the memory:
var fontSet =
[ 
	0xF0, 0x90, 0x90, 0x90, 0xF0, //0.
	0x20, 0x60, 0x20, 0x20, 0x70, //1.
	0xF0, 0x10, 0xF0, 0x80, 0xF0, //2.
	0xF0, 0x10, 0xF0, 0x10, 0xF0, //3.
	0x90, 0x90, 0xF0, 0x10, 0x10, //4.
	0xF0, 0x80, 0xF0, 0x10, 0xF0, //5.
	0xF0, 0x80, 0xF0, 0x90, 0xF0, //6.
	0xF0, 0x10, 0x20, 0x40, 0x40, //7.
	0xF0, 0x90, 0xF0, 0x90, 0xF0, //8.
	0xF0, 0x90, 0xF0, 0x10, 0xF0, //9.
	0xF0, 0x90, 0xF0, 0x90, 0x90, //A.
	0xE0, 0x90, 0xE0, 0x90, 0xE0, //B.
	0xF0, 0x80, 0x80, 0x80, 0xF0, //C.
	0xE0, 0x90, 0x90, 0x90, 0xE0, //D.
	0xF0, 0x80, 0xF0, 0x80, 0xF0, //E.
	0xF0, 0x80, 0xF0, 0x80, 0x80  //F.
];



//Resets the status of the memory, registers, etc.:
function resetStatus(ROMContent)
{
	emulatorPaused = true; //Pauses the emulator.
	
	CB_console("Resetting status...");
	
	emulatorError = false;
	
	//Hides the "Waiting for any key" and the error message (just in case they were showing):
	waitingForKey = false;
	CB_Elements.hideById("waiting_for_any_key");
	CB_Elements.hideById("error");
	
	//If it was not created before, creates the typed arrays:
	mem = mem || new Uint8Array(4096);
	v = v || new Uint8Array(16)
	
	for (var x = 0; x < 16; x++) { v[x] = stack[x] = 0; mem[x] = fontSet[x]; } //Clears the V registers and the stack and loads the first part of the the font set into the memory.
	for (; x < 80; x++) { mem[x] = fontSet[x]; } //Loads the font set into the memory.
	
	//If there is ROM content to load, loads it:
	if (ROMContent && ROMContent.length)
	{
		for (; x < 512; x++) { mem[x] = 0; } //Clear the memory until 512 (0x200), without including it.
		CB_console("Filling the memory with the ROM...");
		var lastPositionROM = 512 + ROMContent.length;
		var ROMContentPointer = 0;
		for (; x < lastPositionROM; x++) { mem[x] = ROMContent[ROMContentPointer++]; }
		lastROMContentLoaded = ROMContent;
	}
	for (; x < 4096; x++) { mem[x] = 0; } //Clears the rest of the memory (if any).
	
	opcode = 0;
	i = 0;
	pc = 0x200; //Program counter starts at 0x200 (512).
	_pcPrevious = null;
	sp = 0;
	timerDelay = 0;
	timerSound = 0;
	
	//Initialize/clears the screen (its bitmap):
	clearScreen();
	
	//Defines the keys mapping by default:
	if (KEYS_MAP_DEFAULT === null)
	{
		KEYS_MAP_DEFAULT =
		{
			0x1:
			{
				keys: [ CB_Keyboard.keys._1 ],
				controllers: { gamepadIndex: "", axis: { index: 0, min: -1, max: -0.5 }	}
			},
			0x2:
			{
				keys: [ CB_Keyboard.keys._2 ],
				controllers: { gamepadIndex: "", axis: { index: 0, min: 0.5, max: 1 } }
			},
			0x3:
			{
				keys: [ CB_Keyboard.keys._3 ],
				controllers: { gamepadIndex: "", axis: { index: 1, min: -1, max: -0.5 }	}
			},
			0xC:
			{
				keys: [ CB_Keyboard.keys._4 ],
				controllers: { gamepadIndex: "", axis: { index: 1, min: 0.5, max: 1 } }
			},
			0x4:
			{
				keys: [ CB_Keyboard.keys.Q ],
				controllers: { gamepadIndex: "", buttons: [ 0 ]	}
			},
			0x5:
			{
				keys: [ CB_Keyboard.keys.W ],
				controllers: { gamepadIndex: "", buttons: [ 1 ]	}
			},
			0x6:
			{
				keys: [ CB_Keyboard.keys.E ],
				controllers: { gamepadIndex: "", buttons: [ 2 ]	}
			},
			0xD:
			{
				keys: [ CB_Keyboard.keys.R ],
				controllers: { gamepadIndex: "", buttons: [ 3 ]	}
			},
			0x7:
			{
				keys: [ CB_Keyboard.keys.A ],
				controllers: { gamepadIndex: "", buttons: [ 4 ] }
			},
			0x8:
			{
				keys: [ CB_Keyboard.keys.S ],
				controllers: { gamepadIndex: "", buttons: [ 5 ] }
			},
			0x9:
			{
				keys: [ CB_Keyboard.keys.D ],
				controllers: { gamepadIndex: "", buttons: [ 6 ]	}
			},
			0xE:
			{
				keys: [ CB_Keyboard.keys.F ],
				controllers: { gamepadIndex: "", buttons: [ 7 ]	}
			},
			0xA:
			{
				keys: [ CB_Keyboard.keys.Z ],
				controllers: { gamepadIndex: "", buttons: [ 8 ]	}
			},
			0x0:
			{
				keys: [ CB_Keyboard.keys.X ],
				controllers: { gamepadIndex: "", buttons: [ 9 ] }
			},
			0xB:
			{
				keys: [ CB_Keyboard.keys.C ],
				controllers: { gamepadIndex: "", buttons: [ 10 ] }
			},
			0xF:
			{
				keys: [ CB_Keyboard.keys.V ],
				controllers: { gamepadIndex: "", buttons: [ 11 ] }
			}
		};
	}
	
	emulatorInitialized = true;
}


//Loads the given file content which belongs to a ROM:
var loadingROMHidden = false; //Tells whether the loading ROM message has been hidden or not.
function loadROMContent(ROMContent, cyclesPerLoop, keysMapROM, ROMId)
{
	emulatorPaused = true; //Pauses the emulator.
	
	ROMContent = ROMContent || lastROMContentLoaded;
	if (!ROMContent)
	{
		loadingROMHidden = true;
		CB_Elements.hideById("loading_rom");
		CB_Elements.showById("error");
		CB_console("Cannot load/reload ROM content. It is empty!");
		return;
	}

	//If not given a ROM id, tries to identify the ROM through its data:
	if (!CB_isString(ROMId) || !ROMId)
	{
		CB_console("ROM identifier not given. Trying to identify the ROM...")
		ROMId = getROMIdFromROMContent(ROMContent);
		if (ROMId !== null)
		{
			CB_console("* ROM identified with ID: " + ROMId);
			
			//If possible, select the ROM in the ROM selector:
			if (ROMs[ROMId])
			{
				var ROMSelectorElement = CB_Elements.id("rom_selector");
				if (ROMSelectorElement !== null)
				{
					ROMSelectorElement.value = ROMSelectorElement.selectedIndex = ROMId;
					CB_console("ROM selector set to: " + (ROMSelectorElement.value || ROMSelectorElement.selectedIndex) + " (index: " + ROMSelectorElement.selectedIndex + ")");
				}
			}
		}
		else { CB_console("* ROM could not be identified!"); }
	}

	//If a ROM identifier is set, fills the non-given data (if possible):
	lastROMIdLoaded = null;
	if (CB_isString(ROMId) && ROMId !== "")
	{
		if (ROMs[ROMId])
		{
			CB_console("ROM ID given (" + ROMId + ") found. Loading needed data...");
			CB_console
			(
				"Title / ROM ID: " + ROMId + "\n" +
				"Author: " + (ROMs[ROMId].author || "Unknown") + "\n" +
				"Year: " + (ROMs[ROMId].year || "Unknown") + "\n" +
				"File: " + ROMs[ROMId].file + "\n" +
				"Cycles per loop: " + (ROMs[ROMId].cyclesPerLoop ? ROMs[ROMId].cyclesPerLoop : EMULATOR_CYCLES_PER_LOOP_DEFAULT + " (default)") + "\n" +
				"Keys mapping: " + (ROMs[ROMId].keysMapping ? JSON.stringify(ROMs[ROMId].keysMapping) : "no")
			);
			if (!cyclesPerLoop) { cyclesPerLoop = ROMs[ROMId].cyclesPerLoop; CB_console("Cycles per loop (" + cyclesPerLoop + ") loaded from the data of the given ROM ID (" + ROMId + ")!"); }
			if (!keysMapROM) { keysMapROM = ROMs[ROMId].keysMapping; CB_console("Keys map loaded from the data of the given ROM ID (" + ROMId + ")!"); }
			lastROMIdLoaded = ROMId;
		}
		else { CB_console("ROM with ID " + ROMId + " not found!"); }
	}

	loadingROMHidden = false; //Marks the loading message as showing.
	CB_Elements.showById("loading_rom"); //Loading message will be showing already when loading the ROM for the first time but not when resetting.

	CB_console("Loading the following ROM:");
	CB_console(JSON.stringify(ROMContent));
	
	//Resets the status of the memory, registers, etc. and loads the ROM content into the memory:
	resetStatus(ROMContent);
	
	CB_console("Memory:");
	CB_console(JSON.stringify(mem));
	
	//If given (and it is greater than zero), sets the desired cycles per loop:
	emulatorCyclesPerLoop = cyclesPerLoop || EMULATOR_CYCLES_PER_LOOP_DEFAULT;
	CB_console("Cycles per loop set to: " + emulatorCyclesPerLoop);

	var CPLInputElement = CB_Elements.id("cpl_input");
	if (CPLInputElement !== null) { CPLInputElement.value = emulatorCyclesPerLoop; }

	//Enables toolbar icons (including the reset button):
	enableElements([ "button_reset", "button_pause", "button_fullscreen", "button_file_selector", "file_selector", "rom_selector", "cpl_input" ], true);
	
	//If given, sets the keys mapping desired:
	keysMap = CB_copyObject(KEYS_MAP_DEFAULT);
	var keyMapped = false;
	for (var keyCode in keysMap)
	{
		keyMapped = false;
		if (keysMapROM && keysMapROM[keyCode])
		{
			CB_console(keyCode + " key specially mapped for this ROM...");
			if (keysMapROM[keyCode].keys || keysMapROM[keyCode].keys === null)
			{
				keysMap[keyCode].keys = keysMapROM[keyCode].keys;
				keyMapped = !(keysMapROM[keyCode].keys === null);
				CB_console("* Keys: ");
				CB_console(keysMap[keyCode].keys);
			}
			if (keysMapROM[keyCode].controllers || keysMapROM[keyCode].controllers === null)
			{
				keysMap[keyCode].controllers = keysMapROM[keyCode].controllers;
				keyMapped = !(keysMapROM[keyCode].controllers === null);
				CB_console("* Controller(s): ");
				CB_console(JSON.stringify(keysMap[keyCode].controllers));
			}
		}
		if (keyMapped)
		{
			CB_Elements.addClassById("screen_button_" + keyCode, "used", true); //Only adds the class in the case it is not being used already.
			CB_console(keyCode + " screen button highlighted.");
		}
		else
		{
			CB_Elements.removeClassById("screen_button_" + keyCode, "used");
			CB_console(keyCode + " screen button NOT highlighted.");
		}
	}
	
	emulatorPaused = false; //Starts the emulator.
}


//Performs the emulation loop:
var emulationLoopTimeout = null;
function emulationLoop()
{
	var performed = true;
	if (!emulatorError && emulatorInitialized)
	{
		for (var j = 0; j < emulatorCyclesPerLoop && performed; j++)
		{
			performed = performCycle();
			cyclesCounter++;
		}
		if (!performed)
		{
			//If not hidden, hides the loading ROM message:
			if (!loadingROMHidden)
			{
				loadingROMHidden = true; //Marks the loading message as hidden.
				CB_Elements.hideById("loading_rom"); //Hides the loading message.
			}
		
			CB_console("Emulator cannot process more cycles due to an error.");
			emulatorError = true;
			CB_Elements.showById("error");
		}
	}

	emulationLoopTimeout = CB_symmetricCall(emulationLoop, 1, "emulationLoopTimeout");
};


//Performs a CPU cycle:
var a, b; //It will execute the opcode's argument being executed.
function performCycle()
{
	//Decodes and performs the current opcode:
	opcode = mem[pc] << 8 | mem[pc + 1];
	a = (opcode & 0x0F00) >> 8;
    b = (opcode & 0x00F0) >> 4;
	
	if (!emulatorPaused)
	{
		pc += 2;
		var opcodeFound = performOpcode(opcode, a, b);
		if (!opcodeFound)
		{
			emulatorPaused = true;
			CB_console("Opcode could not be found! Emulator paused.");
			return false;
		}
	}
	
	//If desired, draws/updates the screen:
	if (drawFlag)
	{
		if (EMULATOR_DEBUG) { CB_console("Drawing/updating screen..."); }
		drawScreen();
		screenRendered = false;
		drawFlag = false;
	}

	//Update timers:
	if (!emulatorPaused)
	{
		if (timerDelay > 0) { timerDelay--; }
		if (timerSound > 0)
		{
			if (timerSound === 1) { playSoundFx("beep"); } //Plays a "beep" sound.
			timerSound--;
		}
	}
	else if (waitingForKey)
	{
		//If not hidden, hides the loading ROM message:
		if (!loadingROMHidden)
		{
			loadingROMHidden = true; //Marks the loading message as hidden.
			CB_Elements.hideById("loading_rom"); //Hides the loading message.
		}
		
		CB_console("Waiting for any key...");
		CB_Elements.showById("waiting_for_any_key");
		for (var keyCode in keysMap)
		{
			if (isKeyPressed(keyCode))
			{
				v[vRegisterToStoreKey] = keyCode;
				emulatorPaused = false;
				waitingForKey = false;
				CB_Elements.hideById("waiting_for_any_key");
				break;
			}
		}
	}

	return true;
}


//Processes the given opcode:
//* Some code by Rodrigo Navarro taken (modified) from: https://github.com/reu/chip8.js/blob/master/src/cpu.js
var _pcPrevious = null; //Keeps the previous PC (Program Counter), to avoid infinite loops.
function performOpcode(opcode, a, b)
{
	var error = false;
	var emptyOpcode = false;
	switch (opcode & 0xF000)
	{

		case 0x000:
			switch(opcode)
			{
				case 0x00E0:
					if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x00E0"); }
					clearScreen();
					break;
					
				case 0x00EE:
					if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x00EE"); }
					pc = stack[--sp];
					break;
					
				default:
					error = true;
					emptyOpcode = true;
					break;
			}
			break;

			case 0x1000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x1000"); }
				_pcPrevious = pc - 2;
				pc = opcode & 0x0FFF;
				//If the previous PC is the same as the new one, restarts the ROM to avoid infinite loop:
				if (_pcPrevious === pc)
				{
					CB_console("Infinite loop detected! Reloading ROM...");
					loadROMContent(undefined, undefined, undefined, lastROMIdLoaded);
				}
				break;

			case 0x2000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x2000"); }
				stack[sp++] = pc;
				pc = opcode & 0x0FFF;
				break;

			case 0x3000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x3000"); }
				if (v[a] == (opcode & 0x00FF)) { pc += 2; }
				break;

			case 0x4000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x4000"); }
				if (v[a] != (opcode & 0x00FF)) { pc += 2; }
				break;

			case 0x5000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x5000"); }
				if (v[a] == v[b]) { pc += 2; }
				break;

			case 0x6000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x6000"); }
				v[a] = opcode & 0x00FF;
				break;

			case 0x7000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x7000"); }
				v[a] += opcode & 0x00FF;
				break;

			case 0x8000:
				switch (opcode & 0x000F)
				{
					case 0x0000:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x000F = " + opcode + " & 0x000F = 0x0000"); }
						v[a] = v[b];
						break;

					case 0x0001:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x000F = " + opcode + " & 0x000F = 0x0001"); }
						v[a] = v[a] | v[b];
						break;

					case 0x0002:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x000F = " + opcode + " & 0x000F = 0x0002"); }
						v[a] = v[a] & v[b];
						break;

					case 0x0003:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x000F = " + opcode + " & 0x000F = 0x0003"); }
						v[a] = v[a] ^ v[b];
						break;

					case 0x0004:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x000F = " + opcode + " & 0x000F = 0x0004"); }
						var sum = v[a] + v[b];
						if (sum > 0xFF) { v[0xF] = 1; }
						else { v[0xF] = 0;	}
						v[a] = sum;
						break;

					case 0x0005:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x000F = " + opcode + " & 0x000F = 0x0005"); }
						if (v[a] > v[b]) { v[0xF] = 1; }
						else { v[0xF] = 0; }
						v[a] = v[a] - v[b];
						break;

					case 0x0006:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x000F = " + opcode + " & 0x000F = 0x0006"); }
						v[0xF] = v[a] & 0x01;
						v[a] = v[a] >> 1;
						break;

					case 0x0007:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x000F = " + opcode + " & 0x000F = 0x0007"); }
						if (v[a] > v[b]) { v[0xF] = 0; }
						else { v[0xF] = 1; }
						v[a] = v[b] - v[a];
						break;

					case 0x000E:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x000F = " + opcode + " & 0x000F = 0x000E"); }
						v[0xF] = v[a] & 0x80;
						v[a] = v[a] << 1;
						break;
						
					default:
						error = true;
						break;
				}
				break;

			case 0x9000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0x9000"); }
				if (v[a] != v[b]) { pc += 2; }
				break;

			case 0xA000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0xA000"); }
				i = opcode & 0x0FFF;
				break;

			case 0xB000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0xB000"); }
				pc = (opcode & 0x0FFF) + v[0];
				break;

			case 0xC000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0xC000"); }
				v[a] = Math.floor(Math.random() * 0xFF) & (opcode & 0x00FF);
				break;

			case 0xD000:
				if (EMULATOR_DEBUG) { CB_console("Executing opcode = " + opcode + " = 0xD000"); }
				var row, col, sprite, height = opcode & 0x000F;
				v[0xF] = 0;
				for (row = 0; row < height; row++)
				{
					sprite = mem[i + row];
					for (col = 0; col < 8; col++)
					{
						if ((sprite & 0x80) > 0)
						{
							if (drawPixel(v[a] + col, v[b] + row)) { v[0xF] = 1; } //Collision.
							
							//If not hidden, hides the loading ROM message (since at least one pixel has been drawn):
							if (!loadingROMHidden)
							{
								loadingROMHidden = true; //Marks the loading message as hidden.
								CB_Elements.hideById("loading_rom"); //Hides the loading message.
							}
						}
						sprite <<= 1;
					}
				}
				drawFlag = true;
				break;

			case 0xE000:
				switch (opcode & 0x00FF)
				{
					case 0x009E:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x009E"); }
						if (isKeyPressed(v[a])) { pc += 2; }
						break;

					case 0x00A1:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x00A1"); }
						if (!isKeyPressed(v[a])) { pc += 2; }
						break;
						
					default:
						error = true;
						break;
				}
				break;

			case 0xF000:
				switch (opcode & 0x00FF)
				{
					case 0x0007:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x0007"); }
						v[a] = timerDelay;
						break;

					case 0x000A:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x000A"); }
						emulatorPaused = true;
						waitingForKey = true;
						vRegisterToStoreKey = a;
						break;

					case 0x0015:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x0015"); }
						timerDelay = v[a];
						break;

					case 0x0018:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x0018"); }
						timerSound = v[a];
						break;

					case 0x0029:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x0029"); }
						i = v[a] * 5;
						break;

					case 0x0033:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x0033"); }
						mem[i]     = parseInt(v[a] / 100);
						mem[i + 1] = parseInt(v[a] % 100 / 10);
						mem[i + 2] = v[a] % 10;
						break;

					case 0x0055:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x0055"); }
						for (var x = 0; x <= a; x++)
						{
							mem[i + x] = v[x];
						}
						break;

					case 0x0065:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x0065"); }
						for (var x = 0; x <= a; x++)
						{
							v[x] = mem[i + x];
						}
						break;

					case 0x001E:
						if (EMULATOR_DEBUG) { CB_console("Executing opcode & 0x00FF = " + opcode + " & 0x00FF = 0x001E"); }
						i += v[a];
						break;
						
					default:
						error = true;
						break;
				}
				break;
		default:
			error = true;
			break;
	}
	
	if (error)
	{
		CB_console("[ERROR] Unknown opcode: " + opcode + " (" + CB_intToBase(opcode, 16) + "), a: " + a + " (" + CB_intToBase(a, 16) + "), b: " + b + " (" + CB_intToBase(b, 16) + ") [pc: " + pc + " (" + CB_intToBase(pc, 16) + ")]");
	}
	else if (EMULATOR_DEBUG)
	{
		CB_console("[OK] Processed opcode: " + opcode + " (" + CB_intToBase(opcode, 16) + "), a: " + a + " (" + CB_intToBase(a, 16) + "), b: " + b + " (" + CB_intToBase(b, 16) + ") [pc: " + pc + " (" + CB_intToBase(pc, 16) + ")]");
	}
	
	return !emptyOpcode;
}


//Tells whether a given key code is pressed or not:
function isKeyPressed(keyCode)
{
	return keysMap[keyCode] &&
	(
		CB_Keyboard.isKeyDown(keysMap[keyCode].keys) ||
		isScreenButtonDown(keyCode) ||
		typeof(keysMap[keyCode].controllers) !== "undefined" && keysMap[keyCode].controllers !== null &&
		(
			CB_isArray(keysMap[keyCode].controllers.buttons) && CB_Controllers.isButtonDown(keysMap[keyCode].controllers.buttons, keysMap[keyCode].controllers.gamepadIndex) ||
			keysMap[keyCode].controllers.axis && CB_Controllers.isAxisDown(keysMap[keyCode].controllers.axis.index, keysMap[keyCode].controllers.gamepadIndex, keysMap[keyCode].controllers.axis.min, keysMap[keyCode].controllers.axis.max)
		)
	);
}


//Initialize/clears the screen (its bitmap):
function clearScreen()
{
	CB_console("Clearing screen...");
	for (var y = screenBitMap.length - 1; y >= 0; y--)
	{
		for (var x = screenBitMap[y].length - 1; x >= 0; x--)
		{
			screenBitMap[y][x] = 0;
		}
	}
	drawFlag = true;
}


//Draws the screen with the rendering engine:
function drawScreen()
{
	var bitmapRenderingEngine = CB_GEM.graphicSpritesSceneObject.getById("bitmap_group").getById("bitmap_current").src;
	for (var y = screenBitMap.length - 1; y >= 0; y--)
	{
		for (var x = screenBitMap[y].length - 1; x >= 0; x--)
		{
			bitmapRenderingEngine[y][x] = !!screenBitMap[y][x];
		}
	}
}


//Draws a pixel on the screen:
function drawPixel(x, y)
{
	x %= 64;
	y %= 32;
	screenBitMap[y][x] ^= 1;
	return !screenBitMap[y][x];
}


//Returns a multidimensional array from another given one, changing the boolean values to numbers (0 and 1). Useful for drawing the screen in the graphic rendering engine:
function arrayBooleansToNumbers(array, typedArray)
{
	var newArray = typedArray ? new Uint8Array(64) : [];
	if (CB_isArray(array))
	{
		CB_Arrays.forEach
		(
			array,
			function(value, index, array)
			{
				if (CB_isArray(array[index])) { newArray[index] = arrayBooleansToNumbers(array[index], true); }
				else { newArray[index] = value ? 1 : 0; }
			}
		);
	}
	return newArray;
}


//Returns whether a ROM instruction (opcode in the memory) is being pointed or not:
function emulatingROM()
{
	return (pc && mem[pc] || waitingForKey);
}