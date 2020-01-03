<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>


<p>
	Touch gestures can be managed thanks to the <a href="https://hammerjs.github.io/" target="_blank">Hammer.js</a> library. Here is an example:
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
	
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

Read the documentation of the <a href="https://hammerjs.github.io/" target="_blank">Hammer.js</a> library to get more information about how to use it.

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>