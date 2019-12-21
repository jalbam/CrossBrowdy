<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example of a simple <a href="https://en.wikipedia.org/wiki/CHIP-8" target="_blank">CHIP-8</a> emulator (using the <a href="<?php echo examplesLink("advanced", "simple_game_engine_files"); ?>" target="_blank">Game engine module from the previous example</a>).
</p>

<p>
	You can use one or more gamepads (depending on the ROM loaded), the keyboard, the mouse or a touch screen to control the emulator and its software.
</p>

<p>
	The purpose of this example is to show different ways to use <a href="http://www.crossbrowdy.com/" target="_blank">CrossBrowdy</a> and some of its multiple features.
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();

	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>