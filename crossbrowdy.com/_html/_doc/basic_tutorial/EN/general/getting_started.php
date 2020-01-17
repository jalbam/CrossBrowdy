<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	After <a href="download.php">downloading</a> CrossBrowdy and placing it in your working folder (for this example, inside a subfolder called &quot;<i>CrossBrowdy</i>&quot;), create an HTML file with the following content:
</p>

<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;script src="CrossBrowdy/CrossBrowdy.js" type="text/javascript" language="javascript"&gt;&lt;/script&gt;&lt;!-- "type" and "language" parameters for legacy clients. --&gt;
</code></pre>

<p>
	The recommended place to include this main script file is inside the head section (inside the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head" target="_blank">&lt;head&gt; tag</a>) of the document.
</p>

<p>
	Alternatively, you can also use the last CrossBrowdy version by including the CrossBrowdy main script file which is available online:
</p>

<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;script src="https://crossbrowdy.com/CrossBrowdy/CrossBrowdy.js" type="text/javascript" language="javascript"&gt;&lt;/script&gt;&lt;!-- "type" and "language" parameters for legacy clients. --&gt;
</code></pre>

<p>
	Have in mind that including the CrossBrowdy main file which is online should never be done for production. This <a href="https://en.wikipedia.org/wiki/Inline_linking" target="_blank">hotlinking method</a> can be useful just for testing purposes. Some features might not work properly using this way and availability cannot be always guaranteed.
</p>

<p>
	After that, then just start the CrossBrowdy framework using JavaScript language, inside the same file:
</p>
	
<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;script type="text/javascript" language="javascript"&gt;
		CB_init(main); //It will start CrossBrowdy and it will call the "main" function when ready.

		//This function will be called when CrossBrowdy is ready:
		function main()
		{
			//Now, you can start using CrossBrowdy here...
			CB_console("CrossBrowdy started!");
		}
	&lt;/script&gt;
</code></pre>

<p>
	If desired, the <a href="api/global.html#CB_init" target="_blank">CB_init</a> function can accept more parameters:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//It will start CrossBrowdy and it will call the "main" function when ready:
	CB_init
	(
		//Callback for when CrossBrowdy is loaded successfully:
		main, //mainFunction. Optional but recommended.
		
		//Path where the main script is located. If not provided (it is undefined or null), it will try to calculate it calling the 'CB_scriptPathCalculate' function internally:
		null, //scriptPath. Optional. Default: CB_scriptPathCalculate().
		
		//Function to call when any of the required files fails to load (because of an error or because its timeout was fired):
		//Note: it could be called more than once, for each file which failed loading.
		function (filepath, callbackOk, callbackError, timeoutMs, asynchronously, CB_filesRequested, CB_filesLoaded) //onErrorLoadingFile. Optional.
		{
			CB_console(filepath); //The 'filepath' parameter when 'CB_includeJSFile' was called internally (if any).
			CB_console(callbackOk); //The 'callbackOk' parameter when 'CB_includeJSFile' was called internally (if any).
			CB_console(callbackError); //The 'callbackError' parameter when 'CB_includeJSFile' was called internally (if any).
			CB_console(timeoutMs); //The 'timeoutMs' parameter when 'CB_includeJSFile' was called internally (if any).
			CB_console(asynchronously); //The 'asynchronously' parameter when 'CB_includeJSFile' was called (if any).
			CB_console(CB_filesRequested); //Object whose indexes are all the filepaths of the script files requested so far and the value is true when the file is still loading (or to be loaded in the future), false if it was loaded successfully (the most likely) or null if it failed to load.
			CB_console(CB_filesLoaded); //Numeric array whose values are the filepaths of the script files loaded successfully so far.
		},
		
		//Defines whether to show the splash screen or not:
		true //showSplashScreen. Optional. Default: CB_Configuration.CrossBrowdy.SHOW_SPLASH_SCREEN_DEFAULT.
	);
</code></pre>

<p>
	Finally and optionally, you can create a DOM element with &quot;<i>CB_console</i>&quot; ID which CrossBrowdy will use in the case that the client does not support <a href="https://developer.mozilla.org/en-US/docs/Web/API/Console" target="_blank">console</a>:
</p>

<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;!-- The "CB_console" element will be used automatically in the case that the client does not support console: --&gt;
	&lt;div id="CB_console" style="display:none; visibility:hidden; overflow:scroll;"&gt;
		&lt;span style="font-weight:bold;"&gt;Console:&lt;/span&gt;&lt;br /&gt;
	&lt;/div&gt;
</code></pre>

<p>
	Note that CrossBrowdy will modify the CSS &quot;<i>style</i>&quot; attribute of this DOM element if needed, setting the &quot;<i>display</i>&quot; property to &quot;<i>block</i>&quot; if it is &quot;<i>none</i>&quot; and its &quot;<i>visibility</i>&quot; property to &quot;<i>visible</i>&quot; regardless its previous value.
</p>

<p>
	Here you have a complete example to start with:
</p>
<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;!DOCTYPE html&gt;
	&lt;html&gt;
		&lt;head&gt;
			&lt;meta http-equiv="content-type" content="text/html; charset=utf-8" /&gt;
			&lt;title&gt;My first CrossBrowdy project!&lt;/title&gt;
			&lt;script src="CrossBrowdy/CrossBrowdy.js" type="text/javascript" language="javascript"&gt;&lt;/script&gt;&lt;!-- "type" and "language" parameters for legacy clients. --&gt;
			&lt;script type="text/javascript" language="javascript"&gt;
				CB_init(main); //It will call the "main" function when ready.

				//This function will be called when CrossBrowdy is ready:
				function main()
				{
					//Now, you can start using CrossBrowdy here...
					CB_console("CrossBrowdy started!");
				}
			&lt;/script&gt;
		&lt;/head&gt;
		&lt;body&gt;
			&lt;!-- The "CB_console" element will be used automatically in the case that the client does not support console: --&gt;
			&lt;div id="CB_console" style="display:none; visibility:hidden; overflow:scroll;"&gt;
				&lt;span style="font-weight:bold;"&gt;Console:&lt;/span&gt;&lt;br /&gt;
			&lt;/div&gt;
		&lt;/body&gt;
	&lt;/html&gt;
</code></pre>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/global.html#CB_init" target="_blank">CB_init</a> and <a href="api/global.html#CB_console" target="_blank">CB_console</a> functions.
</p>