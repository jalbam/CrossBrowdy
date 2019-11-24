<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example of a simple game engine (using the <a href="<?php echo examplesLink("advanced", "graphic_rendering_engine"); ?>" target="_blank">Graphic rendering engine module from the previous example</a>):
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
?>

Additional file used (inside the &quot;img&quot; folder):
<a href="<?php echo $dirPath; ?>img/bird_sprites.gif" target="_blank">bird_sprites.gif</a>,
<a href="<?php echo $dirPath; ?>img/panda_1.gif" target="_blank">panda_1.gif</a>,
<a href="<?php echo $dirPath; ?>img/panda_2.gif" target="_blank">panda_2.gif</a>,
<a href="<?php echo $dirPath; ?>img/seta.gif" target="_blank">seta.gif</a> and
<a href="<?php echo $dirPath; ?>img/sol.gif" target="_blank">sol.gif</a>.

<?php
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>