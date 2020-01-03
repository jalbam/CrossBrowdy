<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	For clients which do not support native <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas" target="_blank">canvas</a>, CrossBrowdy provides automatic fallback to
	Adobe Flash emulation with <a href="https://github.com/everlaat/flashcanvas" target="_blank">FlashCanvas</a>,
	Microsoft Silverlight emulation with <a href="https://slcanvas.codeplex.com/" target="_blank">SLCanvas</a>,
	VML emulation with <a href="https://github.com/arv/explorercanvas" target="_blank">ExplorerCanvas</a> (reinforced with <a href="https://github.com/PhenX/canvas-text" target="_blank">canvas-text</a>)
	and DHTML (DOM elements) emulation with <a href="https://github.com/robertinglin/CanBox" target="_blank">CanBox</a>.
</p>

<p>
	When no emulation method is forced on purpose, CrossBrowdy will automatically calculate and use the best emulation method for the current client.
</p>

<p>
	To make the VML emulation work without errors (using
	<a href="https://github.com/arv/explorercanvas" target="_blank">ExplorerCanvas</a>), it is recommended to always load
	<a href="https://github.com/everlaat/flashcanvas" target="_blank">FlashCanvas</a> (which already includes
	<a href="https://github.com/arv/explorercanvas" target="_blank">ExplorerCanvas</a>) in your HTML code (without using lazy-load, as
	<a href="https://github.com/arv/explorercanvas" target="_blank">ExplorerCanvas</a> does not support it).
	This is recommended even when we are not going to use
	Adobe Flash emulation with <a href="https://github.com/everlaat/flashcanvas" target="_blank">FlashCanvas</a>.
	This is an example (should be placed before loading the main "CrossBrowdy" script):
</p>
<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;!-- Loads FlashCanvas (Flash emulation) before CrossBrowdy. Needed also to use ExplorerCanvas (VML emulation) without problems: --&gt;
	&lt;script type="text/javascript" src="CrossBrowdy/CrossBase/audiovisual/image/canvas/FlashCanvas/pro/bin/flashcanvas.js"&gt;&lt;/script&gt;&lt;!-- FlashCanvas/ExplorerCanvas do not support lazy load. --&gt;
</code></pre>

<p>
	For legacy clients not compatible with native <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas" target="_blank">canvas</a>, some emulation methods will require you to create the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas" target="_blank">canvas</a> element in HTML directly (instead of dynamically with JavaScript). Doing so will maximize compatibility with most clients:
</p>
<pre><code class="language-html line-numbers match-braces rainbow-braces">
	&lt;canvas id="canvas_id"&gt;if you read this, canvas is not working&lt;/canvas&gt;&lt;!-- Some emulation methods will require the canvas element created in HTML (not dynamically by JavaScript). --&gt;
</code></pre>

<p>
	Here is the JavaScript code with some examples creating canvas (<a href="api/CB_Canvas.html" target="_blank">CB_Canvas</a>) objects:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Creates a canvas object for the canvas whose id is "canvas_id" with the default values:
	var myCanvas = new CB_Canvas("canvas_id");
	
	//Creates a canvas object for the canvas whose id is "canvas_id_2" with the desired context type ("2d"):
	var myCanvas_2 = new CB_Canvas("canvas_id_2", "2d");
	
	//Creates a canvas object for the canvas whose id is "canvas_id_3" with the desired context type ("2d"), width and height:
	var myCanvas_3 = new CB_Canvas("canvas_id_3", "2d", CB_Screen.getWindowWidth(), CB_Screen.getWindowHeight());
	
	//Creates a canvas object for the canvas whose id is "canvas_id_4" with the desired context type ("2d"), width and height and using callback functions (recommended):
	var myCanvas_4 = new CB_Canvas
	(
		"canvas_id_4", //canvasId. Unique required parameter.
		"2d", //contextType. Default: "2d".
		CB_Screen.getWindowWidth(), //canvasWidth. Default: CB_Canvas.WIDTH_DEFAULT.
		CB_Screen.getWindowHeight(), //canvasHeight. Default: CB_Canvas.HEIGHT_DEFAULT.
		function() { CB_console("Canvas loaded!"); }, //onLoad.
		function(error) { CB_console("Canvas object problem! Error: " + error); } //onError.
	);
	
	//Creates a canvas object setting all possible parameters:
	var myCanvas_5 = new CB_Canvas
	(
		"canvas_id_5", //canvasId. Unique required parameter.
		"2d", //contextType. Default: "2d".
		CB_Screen.getWindowWidth(), //canvasWidth. Default: CB_Canvas.WIDTH_DEFAULT.
		CB_Screen.getWindowHeight(), //canvasHeight. Default: CB_Canvas.HEIGHT_DEFAULT.
		function() { CB_console("Canvas loaded!"); }, //onLoad.
		function(error) { CB_console("Canvas object problem! Error: " + error); }, //onError.
		document.body, //canvasParent. Default: document.body.
		[ "FLASH", "VML", "DHTML", "SILVERLIGHT" ], //alternativeCanvasEmulationPreferredOrder. Default: CB_Configuration.CrossBase.CB_Canvas_PREFERRED_EMULATION_METHODS.
		false, //forceFirstEmulationMethod. Default: false.
		true, //addOtherMethods. Default: true.
		false //allowFlashCanvasLocally. Default: CB_Configuration.CrossBase.FLASHCANVAS_ALLOW_RUN_LOCALLY_DEFAULT.
	);
</code></pre>

<p>
	Since some canvas emulation methods can be asynchronous, it is recommended to always use callbacks when creating the canvas (<a href="api/CB_Canvas.html" target="_blank">CB_Canvas</a>) object and start working with it only once it loads (when the "onLoad" function is called). Here is an example with more methods:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Defines the function to call once the canvas object has been created successfully:
	var onLoadCanvas = function()
	{
		CB_console("Canvas loaded!");
		
		//Shows the rendering method used to create the canvas:
		var renderingMode = this.getMode()
		if (renderingMode === "NORMAL") { CB_console("Using native canvas rendering"); }
		else if (renderingMode === "FLASH") { CB_console("Using Flash emulation"); }
		else if (renderingMode === "SILVERLIGHT") { CB_console("Using Silverlight emulation"); }
		else if (renderingMode === "VML") { CB_console("Using VML emulation"); }
		else if (renderingMode === "DHTML") { CB_console("Using DHTML (DOM) emulation"); }
		else { CB_console("Rendering method could not be found"); } //It could be "NONE" when no rendering method could be used, but then the "onLoad" function would have not been called.
		
		//Gets the current canvas width and height:
		var canvasWidth = this.getWidth();
		var canvasHeight = this.getHeight();
		
		//Sets the desired canvas width and height:
		this.setWidth(canvasWidth - 10);
		this.setHeight(canvasWidth + 20);

		//Gets the canvas ID:
		var canvasId = this.getId();
		
		//Sets the canvas ID (not recommended as some emulation methods could have problems):
		this.setId(canvasId + "_123");
		
		//Gets the canvas DOM element used (could be different types depending on the emulation method):
		var canvasElement = this.get();
		
		//Gets the context type being used:
		var canvasContextType = this.getContextType();
		
		//Changes the context type being used previously:
		this.setContextType("webgl"); //NOTE: some emulation methods only support "2d".
		
		//Gets the "context" object to start working with the canvas:
		var canvasContext = this.getContext();
	
		//Clears the canvas (different ways):
		this.clear();
		this.clear(true); //Clears the canvas keeping the transform.
		this.clear(false, "#000000"); //Clears the canvas using black colour background.
		
		//Disables anti-aliasing to avoid problems with adjacent sprites:
		this.disableAntiAliasing();
	};
	
	//Creates a canvas object for the canvas whose id is "canvas_id_4" with the desired context type ("2d"), width and height and using callback functions (recommended):
	var myCanvas = new CB_Canvas
	(
		"canvas_id", //canvasId. Unique required parameter.
		"2d", //contextType.
		CB_Screen.getWindowWidth(), //canvasWidth.
		CB_Screen.getWindowHeight(), //canvasHeight.
		onLoadCanvas, //onLoad.
		function(error) { CB_console("Canvas object problem! Error: " + error); } //onError.
	);
	
	//Checks whether the canvas object is still loading or not:
	if (myCanvas.isLoading()) { CB_console("Canvas object is still loading!"); }
	else { CB_console("Canvas object is not in loading process!"); }
	
	//Checks whether the canvas object is ready to work with or not:
	if (myCanvas.isReady()) { CB_console("Canvas object is ready! 'onLoad' should have been called already."); }
	else { CB_console("Canvas object is not ready!"); }
</code></pre>

<p>
	Once the canvas (<a href="api/CB_Canvas.html" target="_blank">CB_Canvas</a>) object is created, we can also force it to re-load again with new options (not recommended for some emulation methods):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Re-loads the canvas with the desired options (not recommended for some emulation methods):
	myCanvas.set
	(
		"canvas_id", //canvasId. Unique required parameter.
		CB_Screen.getWindowWidth(), //canvasWidth.
		CB_Screen.getWindowHeight(), //canvasHeight.
		function() { CB_console("Canvas loaded!"); }, //onLoad.
		function(error) { CB_console("Canvas object problem! Error: " + error); } //onError.
		[ "FLASH", "VML", "DHTML", "SILVERLIGHT" ], //alternativeCanvasEmulationPreferredOrder.
		false // forceEmulation.
	);
</code></pre>
	
<p>
	Finally, the <a href="api/CB_Canvas.html" target="_blank">CB_Canvas</a> class provides some interesting static methods (most times they will be not needed as they are already called internally when creating a new object):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Checks whether canvas would be need to be emulated or not:
	if (CB_Canvas.needsEmulation()) { CB_console("Canvas should be emulated!"); }
	else { CB_console("Canvas is supported natively! There is no need for any emulation method."); }
	
	//Checks what emulation methods are supported, one by one:
	if (CB_Canvas.supportsEmulationMethod("FLASH")) { CB_console("Canvas can be emulated through FLASH"); }
	if (CB_Canvas.supportsEmulationMethod("VML")) { CB_console("Canvas can be emulated through VML"); }
	if (CB_Canvas.supportsEmulationMethod("SILVERLIGHT")) { CB_console("Canvas can be emulated through SILVERLIGHT"); }
	if (CB_Canvas.supportsEmulationMethod("DHTML")) { CB_console("Canvas can be emulated through DHTML (DOM)"); }
	
	//Calculate and returns the best canvas emulation method (can return "NONE", "FLASH", "SILVERLIGHT", "VML" or "DHTML"):
	var bestEmulationMethod = CB_Canvas.bestEmulation(); //Calculates the best among all possible ones.
	var bestEmulationMethod_2 = CB_Canvas.bestEmulation(["FLASH", "SILVERLIGHT"]); //Calculates the best between "FLASH" and "SILVERLIGHT".
</code></pre>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Canvas.html" target="_blank">CB_Canvas</a> class.
</p>