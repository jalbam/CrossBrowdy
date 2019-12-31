<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of keyboard management with CrossBrowdy:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Managing keys pressed currently (this should normally be in a loop, checking constantly):
	var keysDown = CB_Keyboard.getKeysDown(); //Object with the detected keys, being the index the key codes and the value true (being pressed currently) or false (released).
	if (CB_Keyboard.isKeyDown([CB_Keyboard.keys.LEFT, CB_Keyboard.keys.UP, CB_Keyboard.keys.SPACEBAR]))
	{
		CB_console("Some or all of the keys (LEFT arrow, UP arrow or SPACEBAR) are being pressed");
	}
	if (CB_Keyboard.isKeyDown([CB_Keyboard.keys.A, CB_Keyboard.keys.S, CB_Keyboard.keys.CTRL], true))
	{
		CB_console("All of the keys ('A', 'S' and CTRL) are being pressed at the same time");
	}
	CB_Keyboard.clearKeysDown(true); //Clears the "CB_Keyboard.keysDown" object, keeping just the pressed keys.
	CB_Keyboard.clearKeysDown(false); //Clears the "CB_Keyboard.keysDown" object totally, without keeping any key.
	
	//Managing keys pressed recently (they are cleared automatically after a certain time if no key is pressed):
	var keysPressed = CB_Keyboard.getKeysPressed(); //Numeric array with the detected keys pressed recently, being the values the key codes.
	CB_Keyboard.clearKeysPressed(true); //Clears the "CB_Keyboard.keysPressed" array, keeping just the pressed keys.
	CB_Keyboard.clearKeysPressed(false); //Clears the "CB_Keyboard.keysPressed" array totally, without keeping any key.
	CB_Keyboard.getKeysPressedExpiration(); //Returns the number of milliseconds that must elapse without pressing any key to clear the "CB_Keyboard.keysPressed" array automatically.
	CB_Keyboard.setKeysPressedExpiration(500); //Sets the number of milliseconds that must elapse without pressing any key to clear the "CB_Keyboard.keysPressed" array automatically.
	
	//Managing string typed recently (it is cleared automatically after a certain time if no key is pressed):
	var typedString = CB_Keyboard.getTypedString(); //String typed recently.
	var typedStringCodes = CB_Keyboard.getTypedStringCodes(); //Numeric array with the key codes of the string typed recently.
	CB_Keyboard.clearTypedString(true); //Clears the "CB_Keyboard.typedString" string and "CB_Keyboard.typedStringCodes" array, keeping just the values that belong to the pressed keys.
	CB_Keyboard.clearTypedString(false); //Clears the "CB_Keyboard.typedString" string and "CB_Keyboard.typedStringCodes" array totally.
	CB_Keyboard.getTypedStringExpiration(); //Returns the number of milliseconds that must elapse without pressing any key to clear the "CB_Keyboard.typedString" string and "CB_Keyboard.typedStringCodes" array automatically.
	CB_Keyboard.setTypedStringExpiration(500); //Sets the number of milliseconds that must elapse without pressing any key to clear "CB_Keyboard.typedString" string and "CB_Keyboard.typedStringCodes" array automatically.
	 
	//Keyboard events management (use "null" as the first parameter to remove them):
	CB_Keyboard.onKeyDown(function(e, keyCode) { CB_console("Key down ('onKeyDown' event)! Key code: " + keyCode); });
	CB_Keyboard.onKeyUp(function(e, keyCode) { CB_console("Key up ('onKeyUp' event)! Key code: " + keyCode); });
	CB_Keyboard.onKeyPress(function(e, keyCode) { CB_console("Key pressed ('onKeyPress' event)!"); })
</code></pre>

<p>
	Note that many devices will fire keyboard events although they are not real keyboards. This happens with many platforms and devices as for example with Nintendo Wii, Sony PlayStation (Vita, 3, 4), some TV remotes, etc. as well as with many others. CrossBrowdy already has this into account and include many of them in the <a href="_html/_doc/api/CB_Keyboard.keys.html" target="_blank">CB_Keyboard.keys</a> object.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Keyboard.html" target="_blank">CB_Keyboard</a> static class and the <a href="_html/_doc/api/CB_Keyboard.keys.html" target="_blank">CB_Keyboard.keys</a> object.
</p>