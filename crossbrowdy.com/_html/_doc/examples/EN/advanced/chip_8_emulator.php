<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example of a simple <a href="https://en.wikipedia.org/wiki/CHIP-8" target="_blank">CHIP-8</a> emulator (using the <a href="<?php echo examplesLink("advanced", "simple_game_engine"); ?>" target="_blank">Game engine module from the previous example</a>).
</p>

<p>
	You can use one or more gamepads (depending on the ROM loaded), the keyboard, the mouse or a touch screen to control the emulator and its software.
</p>

<p>
	This emulator includes some fancy features as for example automatic ROM identification and personalized theme (different visual style) depending on the ROM being emulated.
	If desired, you can easily enhance these features for more ROMs.
</p>

<p>
	The purpose of this example is to show different ways to use <a href="https://crossbrowdy.com/" target="_blank">CrossBrowdy</a> and some of its multiple features.
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
?>

<p>
	Additional files used (inside the &quot;ROMs&quot; folder) which belong to the different ROMs (<a href="https://en.wikipedia.org/wiki/CHIP-8" target="_blank">CHIP-8</a> software) downloaded from <a href="https://github.com/dmatlack/chip8/tree/master/roms/games" target="_blank">here</a>:
	<a href="<?php echo $dirPath; ?>ROMs/Blinky [Hans Christian Egeberg, 1991].ch8" target="_blank" download>Blinky [Hans Christian Egeberg, 1991].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Brix [Andreas Gustafsson, 1990].ch8" target="_blank" download>Brix [Andreas Gustafsson, 1990].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Pong [Paul Vervalin, 1990].ch8" target="_blank" download>Pong [Paul Vervalin, 1990].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Space Intercept [Joseph Weisbecker, 1978].ch8" target="_blank" download>Space Intercept [Joseph Weisbecker, 1978].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Space Invaders [David Winter].ch8" target="_blank" download>Space Invaders [David Winter].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Syzygy [Roy Trevino, 1990].ch8" target="_blank" download>Syzygy [Roy Trevino, 1990].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Tetris [Fran Dachille, 1991].ch8" target="_blank" download>Tetris [Fran Dachille, 1991].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Tic-Tac-Toe [David Winter].ch8" target="_blank" download>Tic-Tac-Toe [David Winter].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Vertical Brix [Paul Robson, 1996].ch8" target="_blank" download>Vertical Brix [Paul Robson, 1996].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Wipe Off [Joseph Weisbecker].ch8" target="_blank" download>Wipe Off [Joseph Weisbecker].ch8</a>,
	<a href="<?php echo $dirPath; ?>ROMs/Worm V4 [RB-Revival Studios, 2007].ch8" target="_blank" download>Worm V4 [RB-Revival Studios, 2007].ch8</a> and
	<a href="<?php echo $dirPath; ?>ROMs/ZeroPong [zeroZshadow, 2007].ch8" target="_blank" download>ZeroPong [zeroZshadow, 2007].ch8</a>.
</p>

<?php
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>