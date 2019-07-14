<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	This is an example managing WebSockets (internally, it uses the <a href="https://github.com/sockjs/sockjs-client" target="_blank">SockJS client library</a>):
</p>

<?php
	//Show all files:
	echo getFilesCodeAll();
	
	//Let's try the example:
	echo '<p class="try_example">' . getTryExampleLink() . '</p>';
?>

For testing this example, you can easily get an open-source and free <a href="https://github.com/sockjs/sockjs-client" target="_blank">SockJS</a> server here: <a href="https://github.com/jalbam/sockjs_test_server_nwjs" target="_blank">SockJS test server on NW.js</a>.

<p>
	You can check the <a href="guides<?php echo $PHPExtension; ?>" target="_blank">Guides & Tutorials</a> category as well as the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> in the case you need more information.
</p>