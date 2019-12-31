<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example of a simple <a href="https://en.wikipedia.org/wiki/Sokoban" target="_blank">Sokoban game</a> (using the <a href="<?php echo examplesLink("advanced", "simple_game_engine"); ?>" target="_blank">Game engine module from the previous example</a>).
</p>

<p>
	This game is for one player. You can use a gamepad, the keyboard, the mouse or a touch screen (either touching the screen controls or swiping to the desired direction) to control the game.
</p>

<p>
	The purpose of this example is to show different ways to use <a href="http://www.crossbrowdy.com/" target="_blank">CrossBrowdy</a> and some of its multiple features.
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
?>

<p>
	Additional files used (inside the &quot;img&quot; folder):
	<a href="<?php echo $dirPath; ?>img/bottle.gif" target="_blank">bottle.gif</a>,
	<a href="<?php echo $dirPath; ?>img/cup_empty.gif" target="_blank">cup_empty.gif</a>,
	<a href="<?php echo $dirPath; ?>img/cup_filled.gif" target="_blank">cup_filled.gif</a>,
	<a href="<?php echo $dirPath; ?>img/player_down_1.gif" target="_blank">player_down_1.gif</a>,
	<a href="<?php echo $dirPath; ?>img/player_down_2.gif" target="_blank">player_down_2.gif</a>,
	<a href="<?php echo $dirPath; ?>img/player_left_1.gif" target="_blank">player_left_1.gif</a>,
	<a href="<?php echo $dirPath; ?>img/player_left_2.gif" target="_blank">player_left_2.gif</a>,
	<a href="<?php echo $dirPath; ?>img/player_right_1.gif" target="_blank">player_right_1.gif</a>,
	<a href="<?php echo $dirPath; ?>img/player_right_2.gif" target="_blank">player_right_2.gif</a>,
	<a href="<?php echo $dirPath; ?>img/player_up_1.gif" target="_blank">player_up_1.gif</a>,
	<a href="<?php echo $dirPath; ?>img/player_up_2.gif" target="_blank">player_up_2.gif</a> and
	<a href="<?php echo $dirPath; ?>img/stone.gif" target="_blank">stone.gif</a>.
</p>

<p>
	Additional files used (inside the &quot;sound&quot; folder) which belong to music downloaded from <a href="https://icons8.com/music/tag/atmospheric" target="_blank">here</a> (modified to be exported to different audio formats
	and compressed using <a href="https://www.audacityteam.org/download/" target="_blank">Audacity</a>):
</p>
<p>
	&quot;First contact&quot; by Black Lark:
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">black_lark-first_contact-compressed.m4a</a>,
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">black_lark-first_contact-compressed.mp3</a>,
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">black_lark-first_contact-compressed.ogg</a> and
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">black_lark-first_contact-compressed.wav</a>.
</p>
<p>
	&quot;Invisible hand&quot; by Weary Eyes:
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">smokefishe-sorry_for_lying-compressed.m4a</a>,
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">smokefishe-sorry_for_lying-compressed.mp3</a>,
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">smokefishe-sorry_for_lying-compressed.ogg</a> and
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">smokefishe-sorry_for_lying-compressed.wav</a>.
</p>
<p>
	&quot;Sorry for lying&quot; by Smokefishe:
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">weary_eyes-invisible_hand-compressed.m4a</a>,
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">weary_eyes-invisible_hand-compressed.mp3</a>,
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">weary_eyes-invisible_hand-compressed.ogg</a> and
		<a href="<?php echo $dirPath; ?>img/music.mp3" target="_blank">weary_eyes-invisible_hand-compressed.wav</a>.
</p>

<?php
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>