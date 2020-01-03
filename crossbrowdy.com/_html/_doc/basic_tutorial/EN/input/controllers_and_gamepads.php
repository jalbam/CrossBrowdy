<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	CrossBrowdy helps you to manage controllers and gamepads which either have proprietary API or are compatible with the
	<a href="https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API" target="_blank">HTML5 Gamepad API</a>.
	It will try to use native support first but it will end trying to use internal fallbacks automatically to emulate the
	<a href="https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API" target="_blank">HTML5 Gamepad API</a> if needed
	(including polyfilled methods that should be native).
</p>

<p>
	Here you will find some examples of controllers and gamepads management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Using the HTML5 Gamepad API (it will emulate it internally automatically, if needed):
	var controllersStandard = CB_Controllers.getGamePads(true); //Object whose indexes are the identifier of each gamepad and the value a GamePad object (respecting HTML5 GamePad API).
	var controllersAll = CB_Controllers.getGamePads(); //Object with two properties ("standard", containing gamepads that use the HTML5 GamePad API, and "proprietary" the gamepad objects for each proprietary system).
	var controllersStandard_2 = controllersAll.standard.gamepads; //Contains the same as controllersStandard.
	var controllersWii = controllersAll.WII; //The same as calling CB_Controllers_Proprietary["WII"].getGamePads().
	var controllersWiiU = controllersAll.WII_U; //The same as calling CB_Controllers_Proprietary["WII_U"].getGamePads().
	
	//Using some proprietary controllers API:
	var controllersWii_2 = CB_Controllers_Proprietary.WII.getGamePads(); //Same as controllersWii.
	var controllersWiiU_2 = CB_Controllers_Proprietary.WII_U.getGamePads(); //Same as controllersWiiU.
</code></pre>

<p>
	You can easily check if one or more axes are being pressed currently:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Managing axes pressed currently (this should normally be in a loop, checking constantly):
	if (CB_Controllers.isAxisDown([0, 1]))
	{
		CB_console("Axes 0 or 1 (maybe both) is being pressed in some or all gamepads");
	}

	if (CB_Controllers.isAxisDown([0, 1], "", 0.5, 1))
	{
		CB_console("Axes 0 or 1 (maybe both) is being pressed in some or all gamepads and their value is between 0.5 and 1 (both included).");
	}
	
	if (CB_Controllers.isAxisDown([2, 3], 1))
	{
		CB_console("Axes 2 or 3 (maybe both) is being pressed in gamepad whose index is '1'");
	}
	
	if (CB_Controllers.isAxisDown([2, 3], 2, -1, -0.5, true))
	{
		CB_console("Axes 2 and 3 are both being pressed in gamepad whose index is '2' and their value is between -1 and -0.5 (both included).");
	}
	
	if (CB_Controllers.isAxisDown([2, 3], "", -1, -0.5, true))
	{
		CB_console("Axes 2 and 3 are both being pressed, regardless they are being pressed in the same gamepad or in different ones and their value is between -1 and -0.5 (both included).");
	}
</code></pre>

<p>
	You can easily check if one or more buttons are being pressed currently:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Managing buttons pressed currently (this should normally be in a loop, checking constantly):
	if (CB_Controllers.isButtonDown([2, 3]))
	{
		CB_console("Button 2 or 3 (maybe both) is being pressed in some or all gamepads");
	}
	
	if (CB_Controllers.isButtonDown([2, 3], 1))
	{
		CB_console("Button 2 or 3 (maybe both) is being pressed in gamepad whose index is '1'");
	}
	
	if (CB_Controllers.isButtonDown([2, 3], 2, true))
	{
		CB_console("Button 2 and 3 are both being pressed in gamepad whose index is '2'");
	}
	
	if (CB_Controllers.isButtonDown([2, 3], "", true))
	{
		CB_console("Button 2 and 3 are both being pressed, regardless they are being pressed in the same gamepad or in different ones");
	}
</code></pre>

Finally, some events can be managed:
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Managing gamepad events (use "null" as the first parameter to remove them):
	CB_Controllers.onConnect(function(gamepad) { CB_console("Gamepad #" + gamepad.index + " (" + gamepad.id + ") connected!"); });
	CB_Controllers.onDisconnect(function(gamepad) { CB_console("Gamepad #" + gamepad.index + " (" + gamepad.id + ") disconnected!"); });
</code></pre>

<p>
	Note that many devices will fire keyboard events although they are not real keyboards. This happens with many platforms and devices as for example with Nintendo Wii, Sony PlayStation (Vita, 3, 4), some TV remotes, etc. as well as with many others. CrossBrowdy already has this into account and include many of them in the <a href="api/CB_Keyboard.keys.html" target="_blank">CB_Keyboard.keys</a> object.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Controllers.html" target="_blank">CB_Controllers</a> and <a href="api/CB_Controllers_Proprietary.html" target="_blank">CB_Controllers_Proprietary</a> static classes.
</p>