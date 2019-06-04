<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	After <a href="download.php">downloading</a> CrossBrowdy and decompressing it in your working folder (inside a subfolder called &quot;<i>CrossBrowdy</i>&quot;), create an HTML file with the following content:
</p>

<pre><code class="language-html">
	&lt;script src="CrossBrowdy/CrossBrowdy.js" type="text/javascript" language="javascript"&gt;&lt;/script&gt;&lt;!-- "type" and "language" parameters for legacy clients. --&gt;
</code></pre>

<p>
	Then just start the CrossBrowdy framework using JavaScript language, from the same file:
</p>
	
<pre><code class="language-javascript">
	CB_init(main); //It will call the "main" function when ready.
		
	//This function will be called when CrossBrowdy is ready:
	function main()
	{
		CB_console("CrossBrowdy started!");
	}
</code></pre>

<p>
	You can create a DOM element with &quot;<i>CB_console</i>&quot; id which CrossBrowdy will use in the case that the client does not support <a href="https://developer.mozilla.org/en-US/docs/Web/API/Console" target="_blank">console</a>:
</p>

<pre><code class="language-html">
	&lt;div id="CB_console" style="visibility:hidden; overflow:scroll;"&gt;
		&lt;span style="font-weight:bold;"&gt;Console:&lt;/span&gt;&lt;br /&gt;
	&lt;/div>
</code></pre>

Note that CrossBrowdy will modify the CSS &quot;<i>style</i>&quot; attribute of this DOM element if needed, setting the &quot;<i>display</i>&quot; property to &quot;<i>block</i>&quot; if it is &quot;<i>none</i>&quot; and its &quot;<i>visibility</i>&quot; property to &quot;<i>visible</i>&quot; regardless its previous value.

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/global.html#CB_init" target="_blank">CB_init</a> and <a href="_html/_doc/api/global.html#CB_console" target="_blank">CB_console</a> functions.
</p>