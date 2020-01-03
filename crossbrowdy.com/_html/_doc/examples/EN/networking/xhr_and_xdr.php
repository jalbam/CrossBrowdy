<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example managing XHR (AJAX) and XDR (Cross-domain requests):
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
?>

<p>
	Additional files used (inside the &quot;data&quot; folder):
	<a href="<?php echo $dirPath; ?>data/generic.txt" target="_blank">generic.txt</a> and
	<a href="<?php echo $dirPath; ?>data/binary.zip" target="_blank">binary.zip</a>.
</p>

<?php	
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>