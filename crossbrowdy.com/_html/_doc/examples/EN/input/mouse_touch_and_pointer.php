<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	An example managing mouse, touch and pointer:
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
?>

<p>
	Additional files used (inside the &quot;cursors&quot; folder):
	<a href="<?php echo $dirPath; ?>cursors/cursor.ani" target="_blank">cursor.ani</a>,
	<a href="<?php echo $dirPath; ?>cursors/cursor.cur" target="_blank">cursor.cur</a>,
	<a href="<?php echo $dirPath; ?>cursors/cursor.gif" target="_blank">cursor.gif</a>,
	<a href="<?php echo $dirPath; ?>cursors/cursor.png" target="_blank">cursor.png</a>,
	<a href="<?php echo $dirPath; ?>cursors/ranisima.gif" target="_blank">ranisima.gif</a> and
	<a href="<?php echo $dirPath; ?>cursors/bird_sprites.gif" target="_blank">bird_sprites.gif</a>.
</p>

<?	
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>