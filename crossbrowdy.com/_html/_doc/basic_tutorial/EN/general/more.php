<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Any JavaScript file can be lazy loaded this way:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Includes the desired script:
	CB_includeJSFile
	(
		//Filepath:
		"path/to/script.js",
		//Callback when the file has been loaded successfully. Optional. Belongs to "callbackOk":
		function (filePath, callbackOk, callbackError, timeoutMs)
		{
			CB_console("File loaded!"); //Note that "callbackError" could still be called if we wanted to.
		},
		//Callback when there is any error including the file or it cannot be included after the defined timeout. Optional. Belongs to "callbackError":
		function (filePath, callbackOk, callbackError, timeoutMs)
		{
			CB_console("File could not be loaded on time!"); //Note that "callbackOk" could still be called if we wanted to.
		},
		//Timeout limit in milliseconds. Optional (it will use the value of the "CB_includeJSFile_TIMEOUT_MS_DEFAULT" constant as default). Belongs to "timeoutMs":
		95000,
		//Defines whether to load the file asynchronously or not. Optional (it will be true as default). Belongs to "asynchronously":
		true
	);
</code></pre>

<p>
	If needed, CrossBrowdy version and other things can be checked easily:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	CB_console("CrossBrowdy version is " + CB_VERSION);
	CB_console("Script path used by CrossBrowdy: " + CB_scriptPath);
	CB_console(CB_this); //Shows the "this" context used by CrossBrowdy.
</code></pre>
	
<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about some <a href="api/global.html" target="_blank">global functions and variables</a>.
</p>