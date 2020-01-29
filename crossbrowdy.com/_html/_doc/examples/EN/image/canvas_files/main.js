/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Checks whether canvas would be need to be emulated or not:
	if (CB_Canvas.needsEmulation()) { CB_Elements.insertContentById("canvas_needs_emulation", "Yes"); }
	else { CB_Elements.insertContentById("canvas_needs_emulation", "No (natively supported)"); }

	//Checks what emulation methods are supported, one by one:
	if (CB_Canvas.supportsEmulationMethod("FLASH")) { CB_Elements.appendContentById("canvas_supported_emulation_methods", "<br />FLASH"); }
	if (CB_Canvas.supportsEmulationMethod("VML")) { CB_Elements.appendContentById("canvas_supported_emulation_methods", "<br />VML"); }
	if (CB_Canvas.supportsEmulationMethod("SILVERLIGHT")) { CB_Elements.appendContentById("canvas_supported_emulation_methods", "<br />SILVERLIGHT"); }
	if (CB_Canvas.supportsEmulationMethod("DHTML")) { CB_Elements.appendContentById("canvas_supported_emulation_methods", "<br />DHTML (DOM)"); }
	if (CB_trim(CB_Elements.id("canvas_supported_emulation_methods").innerHTML) === "") { CB_Elements.insertContentById("canvas_supported_emulation_methods", "NONE"); }

	//Calculate and returns the best canvas emulation method (can return "NONE", "FLASH", "SILVERLIGHT", "VML" or "DHTML"):
	var bestEmulationMethod = CB_Canvas.bestEmulation(); //Calculates the best among all possible ones.
	CB_Elements.insertContentById("canvas_best_emulation_method", bestEmulationMethod);
	
	//Checks the canvas status constantly:
	var myCanvas = undefined;
	var checkStatusLastMessage = null;
	var checkStatus = function()
	{
		var continueChecking = true;
		var statusMessage = "Canvas object is neither loading nor ready!";
		if (typeof(myCanvas) !== "undefined" && myCanvas !== null)
		{
			//Checks whether the canvas object is still loading or ready or nothing yet:
			if (myCanvas.isLoading()) { statusMessage = "Canvas object is still loading... "; }
			else if (myCanvas.isReady()) { statusMessage = "Canvas object is ready! 'onLoad' should have been called already."; continueChecking = false; }
		}
		if (statusMessage !== checkStatusLastMessage) { printMessage(statusMessage); checkStatusLastMessage = statusMessage; }
		if (continueChecking) { setTimeout(checkStatus, 1); }
	};
	checkStatus();
	
	//Defines the function to call once the canvas object has been created successfully:
	var onLoadCanvas = function()
	{
		printMessage("Canvas loaded!");

		//Shows the rendering method used to create the canvas:
		var renderingMode = this.getMode()
		if (renderingMode === "NORMAL") { printMessage("Using native canvas rendering"); }
		else if (renderingMode === "FLASH") { printMessage("Using Flash emulation"); }
		else if (renderingMode === "SILVERLIGHT") { printMessage("Using Silverlight emulation"); }
		else if (renderingMode === "VML") { printMessage("Using VML emulation"); }
		else if (renderingMode === "DHTML") { printMessage("Using DHTML (DOM) emulation"); }
		else { printMessage("Rendering method could not be found"); } //It could be "NONE" when no rendering method could be used, but then the "onLoad" function would have not been called.

		//Draws something:
		draw(this);
	};

	//Creates a canvas object for the canvas whose ID is "my_canvas" with the desired context type ("2d"), width and height and using callback functions (recommended):
	myCanvas = new CB_Canvas
	(
		"my_canvas", //canvasId. Unique required parameter.
		"2d", //contextType. NOTE: some emulation methods only support "2d". Default: "2d".
		300, //canvasWidth. Use 'CB_Screen.getWindowWidth()' for complete width. Default: CB_Canvas.WIDTH_DEFAULT.
		300, //canvasHeight. Use 'CB_Screen.getWindowHeight()' for complete height. Default: CB_Canvas.HEIGHT_DEFAULT.
		onLoadCanvas, //onLoad.
		function(error) { printMessage("Canvas object problem! Error: " + error); } //onError.
	);
}


//Prinst a message:
function printMessage(message)
{
	CB_Elements.appendContentById("messages", message + "<br />");
}


//Draws something into the canvas:
function draw(CB_CanvasObject)
{
	printMessage("Trying to draw something...");

	//Clears the canvas:
	CB_CanvasObject.clear(true, "#aaddaa"); //Clears the canvas keeping the transform and using desired background colour.
	
	//Gets the "context" object to start working with the canvas:
	var canvasContext = CB_CanvasObject.getContext();
	if (!canvasContext) { printMessage("ERROR: canvas context could not be obtained! Drawing cannot be performed."); return; }

	//Draw something:
	canvasContext.fillStyle = "#ff0000";
	canvasContext.fillRect(20, 10, 200, 50);
	
	canvasContext.lineWidth = 5;
	canvasContext.fillStyle = "#ff22ff";
	canvasContext.strokeStyle = "#cc3300";
	canvasContext.fillRect(2, 1, 200, 50);
	
	canvasContext.lineWidth = 20;
	canvasContext.fillStyle = "#aa22ff";
	canvasContext.strokeStyle = "#cc33dd";
	canvasContext.fillRect(2, 1, 20, 5);
	
	//Note: SLCanvas doesn't support font property and fillText method:
	canvasContext.fillStyle = "#00aaaa";
	canvasContext.strokeStyle = "#003300";
	canvasContext.font = "10px arial";
	canvasContext.fillText("Hello, CrossBrowdy!", 10, 30);
	
	canvasContext.fillStyle = "#00ff00";
	canvasContext.arc(20, 40, 8, 0, Math.PI * 2, true);
	canvasContext.fill();
	
	canvasContext.strokeStyle = "#3512ad";
	canvasContext.beginPath();
	canvasContext.moveTo(20, 80);
	canvasContext.lineWidth = 1;
	canvasContext.lineTo(300, 30);
	canvasContext.stroke();
	
	CB_CanvasObject.disableAntiAliasing(); //Disables anti-aliasing to avoid problems with adjacent sprites.
	var image = new Image();
	image.onload = function()
	{
		canvasContext.drawImage(image, 38 * 2, 0, 37, 36, 72, 72, 38 * 3, 36 * 3);
	};
	image.src = "img/bird_sprites.gif";
}