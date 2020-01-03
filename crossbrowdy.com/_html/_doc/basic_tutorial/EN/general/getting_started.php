<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	After <a href="download.php">downloading</a> CrossBrowdy and placing it in your working folder (for this example, inside a subfolder called &quot;<i>CrossBrowdy</i>&quot;), create an HTML file with the following content:
</p>

<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;script src="CrossBrowdy/CrossBrowdy.js" type="text/javascript" language="javascript"&gt;&lt;/script&gt;&lt;!-- "type" and "language" parameters for legacy clients. --&gt;
</code></pre>

<p>
	The recommended place to include this file is inside the head section (inside the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head" target="_blank">&lt;head&gt; tag</a>) of the document.
</p>

<p>
	Alternatively, you can also use the last CrossBrowdy version by including the CrossBrowdy main file which is available online:
</p>

<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;script src="https://crossbrowdy.com/CrossBrowdy/CrossBrowdy.js" type="text/javascript" language="javascript"&gt;&lt;/script&gt;&lt;!-- "type" and "language" parameters for legacy clients. --&gt;
</code></pre>

<p>
	Have in mind that including the CrossBrowdy main file which is online should never be done for production. This method can be useful just for testing purposes. Some features might not work properly using this way and availability cannot be always guaranteed.
</p>

<p>
	Then just start the CrossBrowdy framework using JavaScript language, from the same file:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
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

<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;div id="CB_console" style="display:none; visibility:hidden; overflow:scroll;"&gt;
		&lt;span style="font-weight:bold;"&gt;Console:&lt;/span&gt;&lt;br /&gt;
	&lt;/div>
</code></pre>

Note that CrossBrowdy will modify the CSS &quot;<i>style</i>&quot; attribute of this DOM element if needed, setting the &quot;<i>display</i>&quot; property to &quot;<i>block</i>&quot; if it is &quot;<i>none</i>&quot; and its &quot;<i>visibility</i>&quot; property to &quot;<i>visible</i>&quot; regardless its previous value.

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/global.html#CB_init" target="_blank">CB_init</a> and <a href="api/global.html#CB_console" target="_blank">CB_console</a> functions.
</p>