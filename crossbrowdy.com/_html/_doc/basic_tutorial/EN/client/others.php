<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here are some other interesting functions:
</p>
	
<pre><code class="language-javascript">
	//Managing the "document" object(s):
	var doc = CB_Client.getDocument(false); //Gets the first "document" object found. Without parameters, it will use the value set on the "CB_Configuration.CrossBase.MIND_IFRAMES" constant.
	var docBase = CB_Client.getDocumentBase(); //Gets the topmost "document" object (same as using "CB_Client.getDocument(true)"). Useful when it is running inside one or more IFRAME elements.
	
	//Managing the "window" object(s):
	var win = CB_Client.getWindow(false); //Gets the first "window" object found. Without parameters, it will use the value set on the "CB_Configuration.CrossBase.MIND_IFRAMES" constant.
	var winBase = CB_Client.getWindowBase(); //Gets the topmost "window" object (same as using "CB_Client.getWindow(true)"). Useful when it is running inside one or more IFRAME elements.
	var windowsArray = CB_Client.getWindowParents(); //Gets all the "window" objects, parents and last son (main one) in an array (with the topmost parent in the highest index). Useful when it is running inside one or more IFRAME elements.
	
	//Managing the document title:
	var currentTitle = CB_Client.getTitle(); //Gets the current document title.
	CB_Client.setTitle("New title"); //Sets "New title" as the document title.

	//Others:
	var boundingRectMarginLeft = CB_Client.getBoundingClientRectMargin("left"); //Gets the starting pixel of left coordinates for "getBoundingClientRect" (it's not 0 in some Internet Explorer versions).
	var boundingRectMarginTop = CB_Client.getBoundingClientRectMargin("top"); //Gets the starting pixel of top coordinates for "getBoundingClientRect" (it's not 0 in some Internet Explorer versions).
</code></pre>
	
<p>
	Note that many of the functions support a "mindIframes" parameter to decide whether to have or not into account that it could be running inside one or more <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe" target="_blank">IFRAME</a> elements. Without setting this parameter, by default it will use the value set on the <a href="_html/_doc/api/CB_Configuration.CrossBase.html#.MIND_IFRAMES" target="_blank">CB_Configuration.CrossBase.MIND_IFRAMES</a> constant.
</p>
	
<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Client.html" target="_blank">CB_Client</a> static class.
</p>