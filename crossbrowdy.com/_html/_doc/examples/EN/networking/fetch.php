<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example managing Fetch:
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
?>

Additional file used (inside the &quot;data&quot; folder):
<a href="<?php echo $dirPath; ?>data/test_fetch_text.txt" target="_blank">test_fetch_text.txt</a>.

<?php
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>