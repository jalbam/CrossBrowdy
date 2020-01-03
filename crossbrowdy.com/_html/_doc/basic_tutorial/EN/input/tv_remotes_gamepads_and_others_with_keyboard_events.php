<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	CrossBrowdy helps you to manage TV remotes, gamepads and other devices which fire keyboard events. Here is an example:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Input management for some video game consoles and similar and virtual keyboard (or compatible ones) that fire keyboard events:
	var UPKeys = //Note that this is just an example, as all of these key codes are already included in "CB_Keyboard.keys.UP".
	[
		CB_Keyboard.extended.PS3.UP, //Sony PlayStation 3.
		CB_Keyboard.extended.PS4.UP, //Sony PlayStation 4.
		CB_Keyboard.extended.PSVITA.UP, //Sony PlayStation Vita.
		CB_Keyboard.extended.WII.UP, //Nintendo Wii (Wiimote).
		CB_Keyboard.extended.AMAZON_FIRE_TV_GAME_CONTROLLER.UP, //Amazon Fire TV game controller.
		CB_Keyboard.extended.AMAZON_FIRE_TV_REMOTE.UP, //Amazon Fire TV remote control.
		CB_Keyboard.extended.SAMSUNG_TIZEN_TV.UP, //Samsung Tizen TV.
		CB_Keyboard.extended.SAMSUNG_TV.UP, //Samsung TV.
		CB_Keyboard.extended.VK.UP //Smart TV Alliance and virtual keyboard.
	];
	if (CB_Keyboard.isKeyDown(UPKeys)) { CB_console("UP key is being pressed"); } //This should normally be in a loop, checking constantly.
	
	//Input management for some TV remotes and virtual keyboard (or compatible ones) that fire keyboard events:
	var PLAYButtons = //Note that this is just an example, as all of these key codes are already included in "CB_Keyboard.keys.PLAY".
	[
		CB_Keyboard.extended.LG_SMART_TV_LINUX_35230.PLAY, //LG Smart TV (Linux 35230).
		CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MEDIA_PLAY, //Samsung Tizen TV.
		CB_Keyboard.extended.SAMSUNG_TV.PLAY, //Samsung TV.
		CB_Keyboard.extended.VK.PLAY //Smart TV Alliance and virtual keyboard.
	];
	if (CB_Keyboard.isKeyDown(PLAYButtons)) { CB_console("PLAY button is being pressed"); } //This should normally be in a loop, checking constantly.
</code></pre>

<p>
	Note that many devices will fire keyboard events although they are not real keyboards. This happens with many platforms and devices as for example with Nintendo Wii, Sony PlayStation (Vita, 3, 4), some TV remotes, etc. as well as with many others. CrossBrowdy already has this into account and include many of them in the <a href="api/CB_Keyboard.keys.html" target="_blank">CB_Keyboard.keys</a> object.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Keyboard.html" target="_blank">CB_Keyboard</a> static class, the <a href="api/CB_Keyboard.extended.html" target="_blank">CB_Keyboard.extended</a> and <a href="api/CB_Keyboard.keys.html" target="_blank">CB_Keyboard.keys</a> objects.
</p>