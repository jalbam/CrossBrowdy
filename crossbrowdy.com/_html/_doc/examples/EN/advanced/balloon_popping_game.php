<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example of a simple balloon popping game (using the <a href="<?php echo examplesLink("advanced", "simple_game_engine"); ?>" target="_blank">Game engine module from the previous example</a>).
</p>

<p>
	Balloons will appear constantly on the screen. Just press on each (click or tap) to explode them. The more you explode, the higher the score you will get and the faster the game will become.
	If the number of balloons on the screen (not exploded yet) reaches the maximum allowed, you will lose.
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