<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example managing arrays, objects and JSON:
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
	
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>