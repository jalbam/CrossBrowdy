CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Manages the keyboard (also compatible with some TV remotes, gamepads and controllers which fire key codes):
	CB_Keyboard.onKeyDown(function(e, keyCode) { CB_Elements.insertContentById("last_key_down", keyCode); }); //Event fired when a key is down (pressed).
	CB_Keyboard.onKeyUp(function(e, keyCode) { CB_Elements.insertContentById("last_key_up", keyCode); }); //Event fired when a key is up (released).
	showKeyboardInformation(); //Starts showing the information constantly.
	
	//Manages the gamepads and controllers which use HTML5 Gamepad API or proprietary API:
	CB_Controllers.onConnect(function(gamepad) { CB_Elements.insertContentById("last_gamepad_connected", "#" + gamepad.index + " (" + gamepad.id + ")"); updateGamepadsInformation(); }); //Event fired when a gamepad is connected.
	CB_Controllers.onDisconnect(function(gamepad) { CB_Elements.insertContentById("last_gamepad_disconnected", "#" + gamepad.index + " (" + gamepad.id + ")"); updateGamepadsInformation(); }); //Event fired when a gamepad is disconnected.
	showGamepadsButtonsInformation(); //Starts showing the information constantly.
}


//Shows the keyboard information (also compatible with some TV remotes, gamepads and controllers which fire key codes):
function showKeyboardInformation()
{
	//Shows the information:
	CB_Elements.insertContentById("keys_down", getKeysDown());
	CB_Elements.insertContentById("key_up", CB_Keyboard.isKeyDown(CB_Keyboard.keys.UP) ? "Yes" : "No");
	CB_Elements.insertContentById("key_down", CB_Keyboard.isKeyDown(CB_Keyboard.keys.DOWN) ? "Yes" : "No");
	CB_Elements.insertContentById("key_left", CB_Keyboard.isKeyDown(CB_Keyboard.keys.LEFT) ? "Yes" : "No");
	CB_Elements.insertContentById("key_right", CB_Keyboard.isKeyDown(CB_Keyboard.keys.RIGHT) ? "Yes" : "No");
	CB_Elements.insertContentById("left_or_right", CB_Keyboard.isKeyDown([CB_Keyboard.keys.LEFT, CB_Keyboard.keys.RIGHT]) ? "Yes" : "No");
	CB_Elements.insertContentById("left_and_right", CB_Keyboard.isKeyDown([CB_Keyboard.keys.LEFT, CB_Keyboard.keys.RIGHT], true) ? "Yes" : "No");
	CB_Elements.insertContentById("last_keys_pressed", CB_Keyboard.getKeysPressed());
	CB_Elements.insertContentById("last_typed_string", CB_Keyboard.getTypedString());
	
	//Calls itself again:
	setTimeout(showKeyboardInformation, 1);
}


//Returns the key downs (as a string):
function getKeysDown()
{
	var output = "";
	
	var keysDown = CB_Keyboard.getKeysDown();
	for (var keyCode in keysDown)
	{
		if (keysDown[keyCode])
		{
			output += keyCode + ", ";
		}
	}
	
	return CB_rtrim(output, [" ", ","]);
}


function updateGamepadsInformation()
{
	var controllersAll = CB_Controllers.getGamePads(); //Object with two properties ("standard", containing gamepads that use the HTML5 GamePad API, and "proprietary" the gamepad objects for each proprietary system).
	
	//Shows information about the gamepads compatible with the HTML5 Gamepad API:
	var gamepadsStandardInfo = "";
	for (var gamepadIndex in controllersAll.standard.gamepads)
	{
		gamepadsStandardInfo += "#" + gamepadIndex + " (" + controllersAll.standard.gamepads[gamepadIndex].id + "), ";
		CB_console(controllersAll.standard.gamepads[gamepadIndex]); //Shows in the console the status object of this device.
	}
	CB_Elements.insertContentById("gamepads_standard", CB_rtrim(gamepadsStandardInfo, [" ", ","]));

	//Shows information about the gamepads compatible with a proprietary API:
	var gamepadsProprietaryInfo = "";
	for (var proprietarySystem in controllersAll)
	{
		if (proprietarySystem === "standard") { continue; }
		gamepadsProprietaryInfo += proprietarySystem;
		for (var gamepadType in controllersAll[proprietarySystem])
		{
			gamepadsProprietaryInfo += " (" + gamepadType + ": ";
			for (var gamepadIndex in controllersAll[proprietarySystem][gamepadType])
			{
				gamepadsProprietaryInfo += gamepadIndex + ", ";
				CB_console(controllersAll[proprietarySystem][gamepadType][gamepadIndex]); //Shows in the console the status object of this device.
			}
			gamepadsProprietaryInfo = CB_rtrim(gamepadsProprietaryInfo, [" ", ","]);
			gamepadsProprietaryInfo += ")";
		}
		gamepadsProprietaryInfo += ", ";
	}
	CB_Elements.insertContentById("gamepads_proprietary", CB_rtrim(gamepadsProprietaryInfo, [" ", ","]));
}


//Shows the gamepads' buttons information:
function showGamepadsButtonsInformation()
{
	var controllersAll = CB_Controllers.getGamePads(); //Object with two properties ("standard", containing gamepads that use the HTML5 GamePad API, and "proprietary" the gamepad objects for each proprietary system).
	
	//Shows all buttons being pressed and available axes:
	var buttonsDownOutput = "";
	for (var system in controllersAll)
	{
		buttonsDownOutput += "<h4>" + ((system === "standard") ? "STANDARD (compatible with HTML5 Gamepad API)" : system) + "</h4>";
		for (var gamepadType in controllersAll[system])
		{
			buttonsDownOutput += "<h5>" + gamepadType + "</h5>";
			for (var gamepadIndex in controllersAll[system][gamepadType])
			{
				buttonsDownOutput += "<h6>#" + gamepadIndex + " (" + controllersAll[system][gamepadType][gamepadIndex].id + "):</h6>";

				buttonsDownOutput += "Axis pressed: " + CB_Controllers.getAxes(controllersAll[system][gamepadType][gamepadIndex].id) + "<br />";
				
				buttonsDownOutput += "Buttons pressed: ";
				for (buttonCode in CB_Controllers.getButtonsDown(controllersAll[system][gamepadType][gamepadIndex].id))
				{
					buttonsDownOutput += buttonCode + ", ";
				}
				buttonsDownOutput = CB_rtrim(buttonsDownOutput, [" ", ","]);
			}
		}
	}
	CB_Elements.insertContentById("buttons_down", buttonsDownOutput);
	
	//Shows available buttons (all):
	CB_Elements.insertContentById("buttons_all_any", JSON.stringify(CB_Controllers.getButtons()));
	CB_Elements.insertContentById("buttons_all_gamepad0", JSON.stringify(CB_Controllers.getButtons(0)));
	
	//Managing buttons pressed currently:
	if (CB_Controllers.isButtonDown([1, 2]))
	{
		CB_console("Button 1 or 2 (maybe both) are being pressed in some or all gamepads");
		CB_Elements.insertContentById("one_or_two_any", "Yes");
	}
	else { CB_Elements.insertContentById("one_or_two_any", "No"); }

	if (CB_Controllers.isButtonDown([1, 2], 0))
	{
		CB_console("Button 1 or 2 (maybe both) are being pressed in gamepad whose index is '0'");
		CB_Elements.insertContentById("one_or_two_gamepad0", "Yes");
	}
	else { CB_Elements.insertContentById("one_or_two_gamepad0", "No"); }

	if (CB_Controllers.isButtonDown([1, 2], 0, true))
	{
		CB_console("Button 1 and 2 are both being pressed in gamepad whose index is '0'");
		CB_Elements.insertContentById("one_and_two_gamepad0", "Yes");
	}
	else { CB_Elements.insertContentById("one_and_two_gamepad0", "No"); }

	if (CB_Controllers.isButtonDown([1, 2], "", true))
	{
		CB_console("Button 1 and 2 are both being pressed, regardless they are being pressed in the same gamepad or in different ones");
		CB_Elements.insertContentById("one_and_two_any", "Yes");
	}
	else { CB_Elements.insertContentById("one_and_two_any", "No"); }

	//Calls itself again:
	setTimeout(showGamepadsButtonsInformation, 1);
}