<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example about processing and synthesizing audio:
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