<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	CrossBrowdy will support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank">Fetch API</a> natively or it will fallback back automatically to a polyfill internally, so you do not need to worry at all. Here is an example of Fetch management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//For modern clients:
	CB_Net.Fetch.get("whatever/test_fetch_text.txt").then
	(
		//Treats the response as text:
		function(response) { return response.text(); }
	).then
	(
		//Displays the content received:
		function(content) { CB_console("Content received: " + content); }
	).catch
	(
		//Displays the error:
		function(error) { CB_console(error); }
	);
	
	//For all clients, including legacy ones (to prevent errors because of using "catch" since it is a reserved word):
	CB_Net.Fetch.get("whatever/test_fetch_text.txt").then
	(
		//Treats the response as text:
		function(response) { return response.text(); }
	).then
	(
		//Displays the content received:
		function(content) { CB_console("Content received: " + content); },
		//Displays the error:
		function(error) { CB_console(error); }
	);
	
	//Another way for all clients, including legacy ones (to prevent errors because of using "catch" since it is a reserved word):
	CB_Net.Fetch.get("whatever/test_fetch_text.txt").then
	(
		//Treats the response as text:
		function(response) { return response.text(); }
	).then
	(
		//Displays the content received:
		function(content) { CB_console("Content received: " + content); }
	)["catch"]
	(
		//Displays the error:
		function(error) { CB_console(error); }
	);
</code></pre>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Net.html" target="_blank">CB_Net</a> and the <a href="api/CB_Net.Fetch.html" target="_blank">CB_Net.Fetch</a> static classes.
</p>