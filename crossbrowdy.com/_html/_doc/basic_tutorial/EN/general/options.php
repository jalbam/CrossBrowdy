<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Some options can be set before starting the CrossBrowdy framework (before calling the <a href="api/global.html#CB_init" target="_blank">CB_init</a> function). This is an example:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Sets desired options before starting:
	var CB_OPTIONS =
	{
		//Options for CrossBrowdy (general options):
		CrossBrowdy:
		{
			CB_console_ALLOW_ALERTS: false //It will not use alert()'s as a fallback when using 'CB_console' and neither the 'console' object nor a DOM element with "CB_console" ID are found.
		},
		//Options for the CrossBase module (main module):
		CrossBase:
		{
			CB_LOAD_SLCANVAS: true //Forces to load SLCanvas.
		}
	};
	
	//Starts CrossBrowdy:
	CB_init(main); //It will call the "main" function when ready.
</code></pre>

<p>
	Note that some options belong to the CrossBrowdy framework and others belong to CrossBase which is its main module (base module). It is also possible to use the <a href="api/global.html#CB_NAME" target="_blank">CB_NAME</a> constant for "CrossBrowdy" and the <a href="api/global.html#CB_NAME" target="_blank">CB_BASE_NAME</a> constant for "CrossBase".
</p>

<p>
	The options allowed are the same ones that support the <a href="api/CB_Configuration.html" target="_blank">CB_Configuration</a> object.
</p>
	
<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/global.html#CB_OPTIONS" target="_blank">CB_OPTIONS</a> and <a href="api/CB_Configuration.html" target="_blank">CB_Configuration</a> objects.
</p>