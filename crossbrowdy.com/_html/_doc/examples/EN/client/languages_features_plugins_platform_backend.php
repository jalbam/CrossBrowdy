<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This can be your first app using CrossBrowdy:
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
	
	//Let's try the example:
	echo '<div class="try_example">' . getTryExampleLink() . '</div>';
?>

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>