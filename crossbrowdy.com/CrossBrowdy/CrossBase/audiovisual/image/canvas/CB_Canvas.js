/**
 * @file Canvas management (including emulation fallbacks). Contains the {@link CB_Canvas} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */


/**
 * Class to manage a canvas.
 *  @class
 *  @classdesc Class to manage a canvas. For clients which do not support native [canvas]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas}, it provides [Adobe Flash (formerly Macromedia Flash)]{@link https://en.wikipedia.org/wiki/Adobe_Flash_Player} emulation with [FlashCanvas]{@link https://github.com/everlaat/flashcanvas}, Microsoft Silverlight emulation with [SLCanvas]{@link https://slcanvas.codeplex.com/}, VML emulation with [ExplorerCanvas]{@link https://github.com/arv/explorercanvas} (reinforced with [canvas-text]{@link https://github.com/PhenX/canvas-text}) and DHTML (DOM elements) emulation with [CanBox]{@link https://github.com/robertinglin/CanBox}.
	NOTE:
		To make the VML emulation work without errors (using [ExplorerCanvas]{@link https://github.com/arv/explorercanvas}), it is recommended to always load [FlashCanvas]{@link https://github.com/everlaat/flashcanvas} (which already includes [ExplorerCanvas]{@link https://github.com/arv/explorercanvas}) in your HTML code (without using lazy-load, as [ExplorerCanvas]{@link https://github.com/arv/explorercanvas} does not support it). This is recommended even when we are not going to use [Adobe Flash (formerly Macromedia Flash)]{@link https://en.wikipedia.org/wiki/Adobe_Flash_Player} emulation with [FlashCanvas]{@link https://github.com/everlaat/flashcanvas}.
		This is an example (should be placed before loading the main "CrossBrowdy" script):
			&lt;!-- Loads FlashCanvas (Flash emulation) before CrossBrowdy. Needed also to use ExplorerCanvas (VML emulation) without problems: --&gt;
			&lt;script type="text/javascript" src="CrossBrowdy/CrossBase/audiovisual/image/canvas/FlashCanvas/pro/bin/flashcanvas.js"&gt;&lt;/script&gt;&lt;!-- FlashCanvas/ExplorerCanvas do not support lazy load. --&gt;
 *  @param {string} canvasId - The desired ID for the canvas.
 *  @param {('2d'|'webgl'|'experimental-webgl'|'webgl2'|'experimental-webgl2'|'bitmaprenderer')} [contextType='2d'] - The contextType desired by default. More information: [HTMLCanvasElement.getContext]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext}. Note that most emulation methods will only support "2d".
 *  @param {integer} [canvasWidth={@link CB_Canvas.WIDTH_DEFAULT}] - The desired width (horizontal size) in pixels for the canvas.
 *  @param {integer} [canvasHeight={@link CB_Canvas.HEIGHT_DEFAULT}] - The desired height (vertical size) in pixels for the canvas.
 *  @param {function} [onLoad] - Callback function that will be called when the canvas is finally loaded. It will not receive parameters, being "this" the {@link CB_Canvas} object itself.
 *  @param {function} [onError] - Callback function that will be called when there is an error creating or loading the canvas. Being "this" the {@link CB_Canvas} object itself, the unique parameter received will be a string describing the error (if it could be determined).
 *  @param {Element} [canvasParent=document.body] - The parent element desired to adopt the canvas.
 *  @param {array} [alternativeCanvasEmulationPreferredOrder={@link CB_Configuration.CrossBase.CB_Canvas_PREFERRED_EMULATION_METHODS}] - Numeric array listing the desired alternative emulation methods for rendering the canvas, in order of preference. Supported emulation methods: "FLASH", "VML", "DHTML" and "SILVERLIGHT".
 *  @param {boolean} [forceFirstEmulationMethod=false] - If set to true, it will force to use the first alternative emulation method desired (even when this alternative emulation method could be not supported and even when native [canvas]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas} support could be supported).
 *  @param {boolean} [addOtherMethods=true] - If set to true, it will add other alternative methods (if any is missing) at the end of the desired alternative emulation methods so they will also be checked and used if the previous ones are not finally used. The order they will be added will be the one used in the {@link CB_Configuration.CrossBase.CB_Canvas_PREFERRED_EMULATION_METHODS} constant.
 *  @param {boolean} [allowFlashCanvasLocally={@link CB_Configuration.CrossBase.FLASHCANVAS_ALLOW_RUN_LOCALLY_DEFAULT}] - If set to true, it will allow to use [Adobe Flash (formerly Macromedia Flash)]{@link https://en.wikipedia.org/wiki/Adobe_Flash_Player} emulation (if needed) even when it is running locally. Uses the {@link CB_Client.isRunningLocally} function internally.
 *  @returns {CB_Canvas} Returns a new {@link CB_Canvas} object.
 */
var CB_Canvas = function(canvasId, contextType, canvasWidth, canvasHeight, onLoad, onError, canvasParent, alternativeCanvasEmulationPreferredOrder, forceFirstEmulationMethod, addOtherMethods, allowFlashCanvasLocally)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_Canvas)) { return new CB_Canvas(canvasId, contextType, canvasWidth, canvasHeight, canvasParent, alternativeCanvasEmulationPreferredOrder, forceFirstEmulationMethod, addOtherMethods, allowFlashCanvasLocally); }
	
	//Properties:
	this._parent = undefined; //The parents of the canvas.
	this._id = undefined; //The ID of the canvas element.
	this.canvas = undefined; //Canvas element itself.
	this.context = undefined; //Context of the canvas element.
	this._contextType = undefined; //Type of the context of the canvas element.
	this._supported = false; //Defines whether Canvas works.
	this._width = undefined; //Canvas width.
	this._height = undefined; //Canvas height.
	this._mode = "NONE"; //Stores the mode used for the canvas ('NONE', 'NORMAL', 'FLASH', 'SILVERLIGHT', 'VML' or 'DHTML').
	this._ready = false; //Stores whether the canvas is ready to be used or not (useful for SLCanvas).
	this._loading = true; //Stores whether the canvas is loading or not (useful for SLCanvas).

	
	//Calls the constructor of the object when creates an instance:
	return this._init(canvasId, contextType, canvasWidth, canvasHeight, onLoad, onError, canvasParent, alternativeCanvasEmulationPreferredOrder, forceFirstEmulationMethod, addOtherMethods, allowFlashCanvasLocally);
}


/*
//Static properties and functions:
CB_Canvas._MODES = { "NONE" : 0, "VML" : 1, "FLASH" : 2, "SILVERLIGHT" : 3, "DHTML" : 4 }; //Defines rendering mode.
CB_Canvas._MODES_STRING = [ "NONE", "VML", "FLASH", "SILVERLIGHT", "DHTML" ];
CB_Canvas.getModeString =
	function(mode)
	{
		if (typeof(CB_Canvas._MODES_STRING[mode]) !== "undefined") { return CB_Canvas._MODES_STRING[mode]; }
		else { return "UNKNOWN"; }
	};
*/


//Constants:
/**
 * Default canvas width in pixels.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_Canvas.WIDTH_DEFAULT = 320; //Default canvas width.
/**
 * Default canvas height in pixels.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_Canvas.HEIGHT_DEFAULT = 240; //Default canvas height.

CB_Canvas.prototype._allowedContextTypes = ["2d", "webgl", "experimental-webgl", "webgl2", "experimental-webgl2", "bitmaprenderer"]; //Allowed context types.


//Constructor:
CB_Canvas.prototype._init = function(canvasId, contextType, canvasWidth, canvasHeight, onLoad, onError, canvasParent, alternativeCanvasEmulationPreferredOrder, forceFirstEmulationMethod, addOtherMethods, allowFlashCanvasLocally)
{	
	//If they have not been sent, uses default parameters:
	if (typeof(canvasParent) === "undefined" || canvasParent === null) { canvasParent = document.body; }
	
	//Gets the best emulation method:
	alternativeCanvasEmulation = CB_Canvas.bestEmulation(alternativeCanvasEmulationPreferredOrder, forceFirstEmulationMethod, addOtherMethods, allowFlashCanvasLocally);

	//Defines the parent given:
	this._parent = canvasParent;

	//Defines the canvas element by using the ID given:
	this.setId(canvasId);
	this.set(this.getId(), canvasWidth, canvasHeight, onLoad, onError, alternativeCanvasEmulation, forceFirstEmulationMethod);
	
	//Detects whether Canvas works:
	if (this.isSupported())
	{
		//Defines the canvas context:
		this.setContextType(contextType);
		this.getContext(this.getContextType());
	}
	else
	{
		//There is no mode unless we are using Silverlight (since SLCanvas needs time to load):
		if (this._mode !== "SILVERLIGHT" && !this._loading)
		{
			this._mode = "NONE"; //This will be changed when SLCanvas loads (if it does).
		}
	}
	
	return this;
}


/**
 * Tells whether the current client needs canvas emulation or not. Uses {@link CB_Client.supportsCanvas} internally.
 *  @function
 *  @returns {boolean} Returns whether the current client needs canvas emulation or not.
 */
CB_Canvas.needsEmulation = function()
{
	return !CB_Client.supportsCanvas();
}


/**
 * Calculates and returns the best alternative canvas emulation.
 *  @function
 *  @param {array|string} [preferredOrder={@link CB_Configuration.CrossBase.CB_Canvas_PREFERRED_EMULATION_METHODS}] - Numeric array listing the desired alternative emulation methods for rendering the canvas, in order of preference. Possible emulation methods: "FLASH", "VML", "DHTML" and "SILVERLIGHT". It can also be a string with the unique desired canvas emulation method or with "NO" or "NONE" value (meaning no emulation method is desired and then the returning value will always be "NONE").
 *  @param {boolean} [forceFirstEmulationMethod=false] - If set to true, it will force to return the first alternative emulation method desired which is detected as supported without being too strict (even when this alternative emulation method could be not really supported and even when native [canvas]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas} support could be supported).
 *  @param {boolean} [addOtherMethods=true] - If set to true, it will add other alternative methods (if any is missing) at the end of the desired alternative emulation methods so they will also be checked and used if the previous ones are not finally used. The order they will be added will be the one used in the {@link CB_Configuration.CrossBase.CB_Canvas_PREFERRED_EMULATION_METHODS} constant.
 *  @param {boolean} [allowFlashCanvasLocally={@link CB_Configuration.CrossBase.FLASHCANVAS_ALLOW_RUN_LOCALLY_DEFAULT}] - If set to true, it will allow to use [Adobe Flash (formerly Macromedia Flash)]{@link https://en.wikipedia.org/wiki/Adobe_Flash_Player} emulation (if needed) even when it is running locally. Uses the {@link CB_Client.isRunningLocally} function internally.
 *  @returns {'NONE'|'FLASH'|'SILVERLIGHT'|'VML'|'DHTML'} Returns "NONE" if no canvas emulation is needed/supported (and no emulation method is forced). Otherwise, it returns the best emulation method calculated ("FLASH", "SILVERLIGHT", "VML" or "DHTML").
 */
CB_Canvas.bestEmulation = function(preferredOrder, forceFirstEmulationMethod, addOtherMethods, allowFlashCanvasLocally)
{
	//If not given, sets the default parameters:
	if (typeof(addOtherMethods) === "undefined" || addOtherMethods === null) { addOtherMethods = true; }
	if (typeof(allowFlashCanvasLocally) === "undefined" || allowFlashCanvasLocally === null) { allowFlashCanvasLocally = CB_Configuration[CB_BASE_NAME].FLASHCANVAS_ALLOW_RUN_LOCALLY_DEFAULT; }

	//If we don't want to force emulation and we don't need any emulation, exits:
	if (!forceFirstEmulationMethod && !CB_Canvas.needsEmulation())
	{
		return "NONE";
	}

	//Defines all allowed canvas emulation methods and the default order or preference (to use in case it was not provided):
	var allEmulationMethods = CB_Configuration[CB_BASE_NAME].CB_Canvas_PREFERRED_EMULATION_METHODS;
	
	//If not given, uses the default order of preference:
	if (typeof(preferredOrder) === "undefined" || preferredOrder === null)
	{
		//If we want to force the first emulation method, we exit returning the first one:
		//if (forceFirstEmulationMethod) { return allEmulationMethods[0]; } //We can be sure it is a valid one.
		preferredOrder = allEmulationMethods; //Uses the default order with all methods.
		addOtherMethods = false; //There is no need to add other methods since it contains all.
	}
	//...if the preferred order is not an array, we force it to be one:
	else if (!CB_isArray(preferredOrder)) { preferredOrder = [(preferredOrder+"").toUpperCase()]; } //Parses it as a string and to upper case.

	//If the user doesn't want any emulation method, we exit:
	if (preferredOrder[0] === "NO" || preferredOrder[0] === "NONE") { return "NONE"; }
	
	//If not all emulation methods has been given in the preferred order, adds them (at the end) if we wanted:
	if (addOtherMethods && preferredOrder !== allEmulationMethods || preferredOrder[0] === "AUTO") //We don't need to add them if already has all methods.
	{
		var allEmulationMethodsLength = allEmulationMethods.length;
		for (var x = 0; x < allEmulationMethodsLength; x++)
		{
			//If the current emulation method of this loop is not in the given preferred order, we add it at the end of the array:
			if (CB_indexOf(preferredOrder, allEmulationMethods[x]) === -1) { preferredOrder[preferredOrder.length] = allEmulationMethods[x]; }
		}
	}

	//Check the emulation methods availability according to the preferred order given:
	var preferredOrderLength = preferredOrder.length;
	var chosenEmulationMethod = "NONE";
	var currentEmulationMethod;
	for (x = 0; x < preferredOrderLength; x++)
	{
		currentEmulationMethod = CB_trim(preferredOrder[x]).toUpperCase();

		//If we want to force the first emulation method and it is available (not being strict):
		if (forceFirstEmulationMethod && CB_Canvas.supportsEmulationMethod(currentEmulationMethod, false))
		{
			chosenEmulationMethod = currentEmulationMethod;
			break;
		}
		//...otherwise, if the method is available (being strict):
		else if (CB_Canvas.supportsEmulationMethod(currentEmulationMethod, true))
		{
			chosenEmulationMethod = currentEmulationMethod;
			break;
		}
	}

	//Returns the chosen emulation method (if any):
	return chosenEmulationMethod;
}


/**
 * Tells whether the current client is compatible with a given canvas emulation method or not.
 *  @function
 *  @param {string} emulationMethod - Emulation method we want to check. Possible emulation methods: "FLASH", "VML", "DHTML" and "SILVERLIGHT".
 *  @param {boolean} [strictMode=true] - If set to true, the compatibility will be checked more carefully. If set to false (not recommended), the method could return true even when sometimes the canvas emulation method is not totally supported by the current client.
 *  @returns {boolean} Returns whether the current client is compatible with the given canvas emulation method or not.
 */
CB_Canvas.supportsEmulationMethod = function(emulationMethod, strictMode)
{
	//If not given, uses the default parameters:
	if (typeof(strictMode) === "undefined" || strictMode === null) { strictMode = true; }
	
	emulationMethod = CB_trim(emulationMethod).toUpperCase();
	
	var isAvailable = false;

	//If we want to try Flash (FlashCanvas):
	if (emulationMethod === "FLASH")
	{
		//If FlashCanvas is present:
		var FlashCanvas = window.FlashCanvas || undefined;
		if (typeof(FlashCanvas) !== "undefined")
		{
			//If we don't want to be strict, the method is supported:
			if (!strictMode) { isAvailable = true; }
			//...otherwise, if Flash is installed and version is 9 or newer:
			else if (CB_Client.supportsFlash() && CB_Client.getFlashVersion()[0] >= 9)
			{
				//If the script is not running locally or it is running but we allow running FlashCanvas anyway:
				if (!CB_Client.isRunningLocally() || CB_Client.isRunningLocally() && allowFlashCanvasLocally)
				{
					isAvailable = true;
				}
			}
			
		}
	}
	//...otherwise, if we want to try SILVERLIGHT (SLCanvas):
	else if (emulationMethod === "SILVERLIGHT")
	{
		//If SLCanvas is present:
		var slcanvas = window.slcanvas || undefined;
		if (typeof(slcanvas) !== "undefined")
		{
			//If we don't want to be strict, the method is supported:
			if (!strictMode) { isAvailable = true; }
			//...otherwise, if Silverlight is installed:
			if (CB_Client.supportsSilverlight())
			{
				isAvailable = true;
			}
		}
	}
	//...otherwise, if we want to try VML (ExplorerCanvas):
	else if (emulationMethod === "VML")
	{
		//If ExplorerCanvas is present:
		var G_vmlCanvasManager = window.G_vmlCanvasManager || undefined;
		if (typeof(G_vmlCanvasManager) !== "undefined" && G_vmlCanvasManager.initElement.toString().indexOf("macromedia") === -1) //We make sure that the object has not been created by FlashCanvas.
		{
			//If we don't want to be strict, the method is supported:
			if (!strictMode) { isAvailable = true; }
			//...otherwise, if we are not using Internet Explorer 5 (ExplorerCanvas doesn't work with IE5/IE5.5):
			if (navigator.appVersion.indexOf("MSIE 5") === -1)
			{
				isAvailable = true;
			}
		}
	}
	//...otherwise, if we want to try DHTML (Canbox):
	else if (emulationMethod === "DHTML")
	{
		//If Canbox is present:
		var _CanboxManager = window._CanboxManager || undefined;
		if (typeof(_CanboxManager) !== "undefined")
		{
			//If we don't want to be strict, the method is supported:
			if (!strictMode) { isAvailable = true; }
			//...otherwise, if we are not using Internet Explorer 5 (Canbox doesn't work with IE5/IE5.5):
			else if (navigator.appVersion.indexOf("MSIE 5") === -1)
			{
				isAvailable = true;
			}
		}
	}
	
	return isAvailable;
}


/**
 * Sets the desired identifier (ID) of the canvas element. Since this method is called by the constructor already, it is not needed to be called unless the canvas element wants to be defined again through the {@link CB_Canvas#set} method. Note that changing the ID after the canvas has been set could lead to some problems when using certain emulation methods so it is not recommended.
 *  @function
 *  @param {string} canvasId - Identifier (ID) for the canvas element.
 */
CB_Canvas.prototype.setId = function(canvasId)
{
	this._id = CB_trim(canvasId);
	if (typeof(this.canvas) !== "undefined" && this.canvas !== null && typeof(this.canvas.setAttribute) === "function")
	{
		this.canvas.setAttribute("id", canvasId);
	}
}


/**
 * Returns the identifier (ID) of the canvas element.
 *  @function
 *  @returns {string} Returns the identifier (ID) of the canvas element.
 */
CB_Canvas.prototype.getId = function()
{
	return this._id;
}


/**
 * Defines the canvas element. Since this method is called by the constructor already, it is not needed to be called unless the canvas element wants to be defined again.
 *  @function
 *  @param {string} canvasId - The desired ID for the canvas.
 *  @param {integer} [canvasWidth={@link CB_Canvas.WIDTH_DEFAULT}] - The desired width (horizontal size) in pixels for the canvas.
 *  @param {integer} [canvasHeight={@link CB_Canvas.HEIGHT_DEFAULT}] - The desired height (vertical size) in pixels for the canvas.
 *  @param {function} [onLoad] - Callback function that will be called when the canvas is finally loaded. It will not receive parameters, being "this" the {@link CB_Canvas} object itself.
 *  @param {function} [onError] - Callback function that will be called when there is an error creating or loading the canvas. Being "this" the {@link CB_Canvas} object itself, the unique parameter received will be a string describing the error (if it could be determined).
 *  @param {string} [alternativeCanvasEmulation={@link CB_Canvas.bestEmulation}()] - Emulation method we want to use in the case that the native [canvas]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas} is not supported or if the "forceEmulation" parameter is set to true. Possible emulation methods: "FLASH", "VML", "DHTML" and "SILVERLIGHT".
 *  @param {boolean} [forceEmulation=false] - If set to true, it will force to use the emulation method defined in the "alternativeCanvasEmulation" parameter (even when this alternative emulation method could be not supported and even when native [canvas]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas} support could be supported).
 */
CB_Canvas.prototype.set = function(canvasId, canvasWidth, canvasHeight, onLoad, onError, alternativeCanvasEmulation, forceEmulation)
{
	//If not given, sets the default parameters:
	if (typeof(canvasWidth) === "undefined" || canvasWidth === null || isNaN(canvasWidth)) { canvasWidth = CB_Canvas.WIDTH_DEFAULT; }
	if (typeof(canvasHeight) === "undefined" || canvasHeight === null || isNaN(canvasHeight)) { canvasHeight = CB_Canvas.HEIGHT_DEFAULT; }
	if (typeof(alternativeCanvasEmulation) === "undefined" || alternativeCanvasEmulation === null || CB_trim(alternativeCanvasEmulation).toUpperCase() === "AUTO") { alternativeCanvasEmulation = CB_Canvas.bestEmulation(); }
	alternativeCanvasEmulation = CB_trim(alternativeCanvasEmulation).toUpperCase();

	//Just in case there was a previous onload (action) listener before (used in SLCanvas), we kill it:
	if (typeof(this.canvas) !== "undefined" && typeof(this.canvas.action) === "function")
	{
		this.canvas.action = function() {};
	}
	
	//The canvas is still not ready and it is loading:
	this._ready = false;
	this._loading = true;

	//If the element with the ID given exists, just takes it:
	this.canvas = CB_Elements.id(canvasId);
	
	//this._mode = "unknown"; //Mode is still unknown (unless we create the element later).
	this._mode = "NORMAL";

	var needsEmulation = CB_Canvas.needsEmulation();

	//If we are going to use DHTML emulation (forced or needed):
	if ((needsEmulation || forceEmulation) && alternativeCanvasEmulation === "DHTML")
	{
		//Canbox doesn't work with an existing "canvas" TAG, so we have to destroy it and create a DIV with that id:
		//CB_Elements.idRemove(canvasId); //Destroys the existing element.
		if (this.canvas !== null)
		{
			//this.canvas.outerHTML = this.canvas.outerHTML.replace(/canvas/g, "div");
			CB_Elements.idRemove(canvasId);
			this.canvas = null;
		}
		
		//this.canvas = null; //We force to create a new element.
	}
	
	//If the element already exists, in determines the emulation mode (if any):
	if (typeof(this.canvas) !== "undefined" && this.canvas !== null)
	{
		//this._mode = "NORMAL";
		//If the element is using FlashCanvas (Flash) emulation:
		//var G_vmlCanvasManager = window.G_vmlCanvasManager || undefined;
		//if (this.canvas.innerHTML.indexOf("flashcanvas") !== -1) { this._mode = "FLASH"; }
		//...otherwise, if ExplorerCanvas (VML) is available, the element must be using it:
		//else if (typeof(G_vmlCanvasManager) !== "undefined") { this._mode = "VML"; }
	}
	//...otherwise, it will try to create the element with the ID given:
	else
	{
		//Creates the canvas:
		var tagName = "canvas"; //By default, the tag name is "canvas".
		if ((needsEmulation || forceEmulation) && alternativeCanvasEmulation === "DHTML") { tagName = "div"; } //If we are using DHTML emulation, it is better if the tag name is "div" (to make it work in web clients with canvas support).
		this.canvas = document.createElement(tagName);
		
		this.canvas.setAttribute("id", canvasId);
		this.canvas.innerHTML = "CrossBrowdy canvas not supported! (no emulation)";

		this._parent.appendChild(this.canvas);
		this.canvas = CB_Elements.id(canvasId);
	}

	//If we need emulation:
	if (needsEmulation || forceEmulation)
	{
		//If the emulation method is available (it will be only if we need it), we apply it:
		if (CB_Canvas.supportsEmulationMethod(alternativeCanvasEmulation, false)) //Not being strict.
		{
			this._mode = alternativeCanvasEmulation;
			try { this.canvas.innerHTML = ""; } catch(E) {}

			//If we want to use Flash (FlashCanvas), inits the canvas properly:
			if (alternativeCanvasEmulation === "FLASH")
			{
				this.canvas = FlashCanvas.initElement(this.get());
				//Provides the canvas context with some methods (in case it needs it):
				this.prepareContext();
			}
			//...otherwise, if we want to use Silverlight (SLCanvas), inits the canvas properly:
			else if (alternativeCanvasEmulation === "SILVERLIGHT")
			{
				var that = this;
				var functionOnLoad =
					function(sender)
					{
						if (that.isSupported())
						{
							that._mode = "SILVERLIGHT";
							//Provides the canvas context with some methods (in case it needs it):
							that.prepareContext();
							//The canvas is ready for use:
							that._ready = true;
							that._loading = false;
							//Calls the onLoad function (if any):
							if (typeof(onLoad) === "function") { onLoad.call(that); }
						}
						else
						{
							//Calls the onError function (if any):
							//if (typeof(onError) === "function") { onLoad.call(this); }
							if (typeof(onError) === "function") { onError.call(that, "'" + alternativeCanvasEmulation + "' canvas emulation failed."); }
						}
					};
				var SLCanvasDiv = slcanvas.createCanvasDiv(canvasWidth, canvasHeight, functionOnLoad);
				CB_Elements.idRemove(canvasId);
				SLCanvasDiv.setAttribute("id", canvasId);
			
				//IE5/5+, IE6, IE7 and IE8 (I still have to check other newer IE versions) doesn't send keyboard events to the web client when a Silverlight object is clicked. So we have to put a transparent div over it that prevents to click it in order to not focus the Silverlight object:
				if (CB_Client.supportsSilverlight() && navigator.userAgent.indexOf('MSIE') !== -1 && (navigator.appVersion.indexOf("MSIE 5") !== -1 || navigator.appVersion.indexOf("MSIE 6") !== -1 || navigator.appVersion.indexOf("MSIE 7") !== -1 || navigator.appVersion.indexOf("MSIE 8") !== -1))
				{
					var SLCanvasDivForeground = document.createElement("div");
					SLCanvasDivForeground.style.position = "absolute";
					SLCanvasDivForeground.style.padding = "0px";
					SLCanvasDivForeground.style.filter = 'alpha(opacity=0)';
					SLCanvasDivForeground.style.backgroundColor = "#ffffff";
					SLCanvasDivForeground.style.border = "0px";
					SLCanvasDivForeground.innerHTML = "";

					//It will always check if the canvas is moved, in order to be always placed above it:
					setInterval(
								function()
								{
									if (SLCanvasDivForeground !== null && SLCanvasDiv !== null)
									{
										SLCanvasDivForeground.style.top = CB_Elements.getTop(SLCanvasDiv) + "px";
										SLCanvasDivForeground.style.left = CB_Elements.getLeft(SLCanvasDiv) + "px";
										SLCanvasDivForeground.style.width = CB_Elements.getWidth(SLCanvasDiv) + "px";
										SLCanvasDivForeground.style.height = CB_Elements.getHeight(SLCanvasDiv) + "px";
										var zIndex = SLCanvasDiv.currentStyle.zIndex;
										if (typeof(zIndex) !== "undefined" && zIndex !== null && !isNaN(zIndex)) { zIndex++; }
										SLCanvasDivForeground.style.zIndex = zIndex;
									}
								}, 100);
				
					document.body.appendChild(SLCanvasDivForeground);
				}
				
				//Sets the new canvas:
				this.canvas = SLCanvasDiv;
				this._parent.appendChild(this.canvas);
			}
			//...otherwise, if we want to use VML (ExplorerCanvas), inits the canvas properly:
			else if (alternativeCanvasEmulation === "VML")
			{
				this.canvas = G_vmlCanvasManager.initElement(this.get());

				//Provides the canvas context with some methods (in case it needs it):
				this.prepareContext();
			}
			//...otherwise, if we want to use DHTML (Canbox), inits the canvas properly:
			else if (alternativeCanvasEmulation === "DHTML")
			{
				//try
				//{
					this.canvas = _CanboxManager.initElement(this.get());
				//} catch(E) {}
				//Provides the canvas context with some methods (in case it needs it):
				this.prepareContext();
			}
			else
			{
				this.canvas.innerHTML = "CrossBrowdy canvas not supported! (with " + alternativeCanvasEmulation + " emulation)";
			}
		}
		else
		{
			try { this.canvas.innerHTML = "CrossBrowdy canvas not supported! (without emulation)"; } catch(E) {}
			if (alternativeCanvasEmulation !== "NONE") { this.canvas.innerHTML += " - tried " + alternativeCanvasEmulation + " but failed"; }
		}
	}
	
	//Defines canvas width and height:
	this.setWidth(canvasWidth);
	this.setHeight(canvasHeight);

	//If the canvas is supported (it worked) and we are not using SLCanvas (because it needs time to be ready):
	if (this.isSupported())
	{
		//The canvas is ready and not loading anymore:
		this._ready = true;
		this._loading = false;
		//Calls the onLoad function (if any):
		if (typeof(onLoad) === "function") { onLoad.call(this); }
	}
	//...otherwise, if we didn't used the Silverlight emulation method (SLCanvas):
	else if (alternativeCanvasEmulation !== "SILVERLIGHT")
	{
		//If we are here it means that canvas is not supported and it is not loading anymore:
		this._loading = false;
		//Calls the onError function (if any):
		//if (typeof(onError) === "function") { onLoad.call(this); }
		if (typeof(onError) === "function") { onError.call(this,  "'" + alternativeCanvasEmulation + "' canvas emulation failed!"); }
	}
}



/**
 * Alias for {@link CB_Canvas#prepareContext}.
 *  @function CB_Canvas.prototype.normalizeContext
 *  @see {@link CB_Canvas#prepareContext}
 */
/**
 * Provides the canvas [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} with some methods and properties, in case it needs it (as some canvas emulation methods lack of some methods and properties). Since this method is called by the {@link CB_Canvas#set} method already (and this one is called by the constructor automatically), it is not needed to be called again normally.
 *  @function
 *  @param {RenderingContext|Object} [context={@link CB_Canvas#getContext}()] - The [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} object that we want to prepare (different type if a canvas emulation method is being used). If not defined, calls the {@link CB_Canvas#getContext} method internally.
 *  @returns {RenderingContext|Object} Returns the canvas [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} (different type if a canvas emulation method is being used).
 *  @todo Add more methods and properties needed by some emulation methods.
 */
CB_Canvas.prototype.prepareContext = CB_Canvas.prototype.normalizeContext = function(context)
{
	//Gets the context:
	if (typeof(context) === "undefined" || context === null) { context = this.getContext(); }

	//If the context is not defined or null, exits the function:
	if (typeof(context) === "undefined" || context === null) { return; }

	//Canbox doesn't support setTransform, so we create a fake function in order not to crash:
	try
	{
		if (typeof(context.setTransform) === "undefined")
		{
			context.setTransform = function() {}
		}
	} catch(E) { CB_console("The 'setTransform' method could not be added to the given canvas context."); }

	try
	{
		//SLCanvas doesn't support font, so we create a fake function in order not to crash:
		if (typeof(context.font) === "undefined")
		{
			context.font = "10px sans-serif";
		}
	} catch(E) { CB_console("The 'font' property could not be added to the given canvas context."); }

	try
	{
		//SLCanvas doesn't support fillText, so we create a fake function in order not to crash:
		if (typeof(context.fillText) === "undefined")
		{
			context.fillText = function() {}
		}
	} catch(E) { CB_console("The 'fillText' method could not be added to the given canvas context."); }
	
	try
	{
		//Internet Explorer 11 (and lower) does not support "ellipse" method, so we try to simulate it:
		if (typeof(context.drawEllipse) === "undefined")
		{
			context.drawEllipse = this._context_drawEllipse;
		}
	} catch(E) { CB_console("The 'ellipse' method could not be added to the given canvas context."); }
	
	return context;
}


/**
 * Returns the canvas element (if any).
 *  @function
 *  @returns {Element|null} Returns the canvas element (if any). If not found, null will be returned.
 */
CB_Canvas.prototype.get = function()
{
	return this.canvas || null;
}


 /**
 * Defines and returns the canvas [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext}. It could call the {@link CB_Canvas#prepareContext} method internally.
 *  @function
 *  @param {('2d'|'webgl'|'experimental-webgl'|'webgl2'|'experimental-webgl2'|'bitmaprenderer')} [contextType=CB_Canvas#._contextType|'2d'] - The [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} type desired. More information: [HTMLCanvasElement.getContext]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext}. Note that most emulation methods will only support "2d".
 *  @returns {RenderingContext|Object} Returns the canvas [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} (different type if a canvas emulation method is being used).
 */
CB_Canvas.prototype.getContext = function(contextType)
{
	//Defines 2D if any other context type has defined:
	if (typeof(contextType) === "undefined" || contextType === null)
	{
		contextType = this._contextType;
		if (typeof(contextType) === "undefined" || contextType === null)
		{
			contextType = "2d";
		}
	}
	
	contextType = CB_trim(contextType).toLowerCase();
	
	//If the context type inserted is not allowed, uses the "2d" type by default:
	//if (contextType === "" || contextType !== "webgl" && contextType !== "2d")
	if (CB_indexOf(CB_Canvas.prototype._allowedContextTypes, contextType) === -1) { contextType = "2d"; }
	
	if (typeof(this.get().getContext) === "function")
	{
		try //Uses try-catch to avoid some problems with some web clients (as BeZilla / Bon Echo 2.0.0.22Pre on Haiku OS):
		{
			return this.context = this.prepareContext(this.get().getContext(contextType));
			//////////////return this.context = this.get().getContext(contextType);
		} catch(E) { return this.context = null; }
	}
	else { return this.context = null; }
}


/**
 * Defines the desired canvas [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} type. Internally, it only defines the {@link CB_Canvas#._contextType} property.
 *  @function
 *  @param {('2d'|'webgl'|'experimental-webgl'|'webgl2'|'experimental-webgl2'|'bitmaprenderer')} [contextType='2d'] - The [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} type desired. More information: [HTMLCanvasElement.getContext]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext}. Note that most emulation methods will only support "2d".
 *  @returns {string} Returns the context type just applied.
 */
CB_Canvas.prototype.setContextType = function(contextType)
{
	contextType = CB_trim(contextType).toLowerCase();
	
	//If the context type inserted is not allowed, uses the "2d" type by default:
	if (CB_indexOf(CB_Canvas.prototype._allowedContextTypes, contextType) === -1) { contextType = "2d"; }
	
	this._contextType = contextType;
	
	return this._contextType;
}


 /**
 * Tells the current canvas [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} type used. Internally, it returns the value of the {@link CB_Canvas#._contextType} property.
 *  @function
 *  @returns {string} Tells the current canvas [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} type used. More information: [HTMLCanvasElement.getContext]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext}.
 */
CB_Canvas.prototype.getContextType = function()
{
	return this._contextType;
}


/**
 * Tells whether the canvas works or not. The internal test used could be not totally reliable.
 *  @function
 *  @returns {boolean} Returns whether the canvas works or not. The internal test used could be not totally reliable.
 */
CB_Canvas.prototype.isSupported = function()
{
	//this._supported = (this.canvas && this.canvas.getContext) ? true : false;
	//return this._supported;

	if (this.canvas && this.canvas.getContext)
	{
		try //Uses try-catch to avoid some problems with some web clients (as BeZilla / Bon Echo 2.0.0.22Pre on Haiku OS):
		{
			this._supported = (typeof(this.canvas.getContext("2d")) !== "undefined" && this.canvas.getContext("2d") !== null);
		} catch(E) { this._supported = false; }
	}
	return this._supported || false;
}


/**
 * Defines the desired canvas width.
 *  @function
 *  @param {integer} [canvasWidth={@link CB_Canvas.WIDTH_DEFAULT}] - The desired width (horizontal size) in pixels for the canvas.
 *  @returns {number} Returns the canvas width (horizontal size) being used in pixels. It could return zero (0) if cannot be calculated.
 */
CB_Canvas.prototype.setWidth = function(canvasWidth)
{
	//Is not defined or it is wrong, uses default size:
	if (typeof(canvasWidth) === "undefined" || canvasWidth === null || isNaN(canvasWidth))
	{
		canvasWidth = CB_Canvas.WIDTH_DEFAULT;
	}
	
	//Detects if a percentage has been received:
	/*
	canvasWidth = canvasWidth.toString();
	var isPercentage = false;
	if (canvasWidth.indexOf("%") !== -1) { isPercentage = true; }
	canvasWidth = canvasWidth.replace("%", "");
	canvasWidth = canvasWidth.replace("px", "");
	*/
	
	//Applies changes to the canvas:
	var canvas = this.get();
	if (typeof(canvas) !== "undefined" && canvas !== null)
	{
		//this._width = canvasWidth + (isPercentage ? "%" : "");
		this._width = canvasWidth;
		//this.get().style.width = this._width + (isPercentage ? "%" : "px");
		canvas.style.width = canvasWidth + "px";
		canvas.setAttribute('width', canvasWidth);
		//this.get().setAttribute('width', canvasWidth);
	}
	
	return this.getWidth();
}


/**
 * Tells the canvas width (horizontal size) being used in pixels.
 *  @function
 *  @returns {number} Returns the canvas width (horizontal size) being used in pixels. It could return zero (0) if cannot be calculated.
 */
CB_Canvas.prototype.getWidth = function()
{
	return this._width || 0;
}


/**
 * Defines the desired canvas height.
 *  @function
 *  @param {integer} [canvasHeight={@link CB_Canvas.HEIGHT_DEFAULT}] - The desired height (vertical size) in pixels for the canvas.
 *  @returns {number} Returns the canvas height (vertical size) being used in pixels. It could return zero (0) if cannot be calculated.
 */
CB_Canvas.prototype.setHeight = function(canvasHeight)
{
	//Is not defined or it is wrong, uses default size:
	if (typeof(canvasHeight) === "undefined" || canvasHeight === null || isNaN(canvasHeight))
	{
		canvasHeight = CB_Canvas.HEIGHT_DEFAULT;
	}

	//Detects if a percentage has been received:
	/*
	canvasHeight = canvasHeight.toString();
	var isPercentage = false;
	if (canvasHeight.indexOf("%") !== -1) { isPercentage = true; }
	canvasHeight = canvasHeight.replace("%", "");
	canvasHeight = canvasHeight.replace("px", "");
	*/

	//Applies changes to the canvas:
	var canvas = this.get();
	if (typeof(canvas) !== "undefined" && canvas !== null)
	{
		//this._height = canvasHeight.toString() + (isPercentage ? "%" : "");
		this._height = canvasHeight;
		//this.get().style.height = this._height + (isPercentage ? "%" : "px");
		canvas.style.height = canvasHeight + "px";
		canvas.setAttribute('height', canvasHeight);
		//this.get().setAttribute('height', this._height);
	}
	
	return this.getHeight();
}


/**
 * Tells the canvas height (vertical size) being used in pixels.
 *  @function
 *  @returns {number} Returns the canvas height (vertical size) being used in pixels. It could return zero (0) if cannot be calculated.
 */
CB_Canvas.prototype.getHeight = function()
{
	return this._height || 0;
}


/**
 * Tells the mode used to create the canvas.
 *  @function
 *  @returns {'NONE'|'NORMAL'|'FLASH'|'SILVERLIGHT'|'VML'|'DHTML'} Returns the mode used to create the canvas. Returns "NONE" if no method is used yet (possible when no method is supported at all or when it is still loading). Returns "NORMAL" if native [canvas]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas} is used (no canvas emulation method).
 */
CB_Canvas.prototype.getMode = function()
{
	return this._mode || "NONE";
}


/**
 * Tells whether the canvas is ready to be used or not. Some canvas emulation methods can take some time until they are ready to be used.
 *  @function
 *  @returns {boolean} Returns whether the canvas is ready to be used or not.
 */
CB_Canvas.prototype.isReady = function()
{
	return this._ready;
}


/**
 * Tells whether the canvas is loading or not. Some canvas emulation methods can take some time until they finish loading.
 *  @function
 *  @returns {boolean} Returns whether the canvas is loading or not.
 */
CB_Canvas.prototype.isLoading = function()
{
	return this._loading;
}


/**
 * Alias for {@link CB_Canvas#clear}.
 *  @function CB_Canvas.prototype.clearCanvas
 *  @see {@link CB_Canvas#clear}
 */
/**
 * Clear the canvas entirely.
 *  @function
 *  @param {boolean} [keepTransform=false] - If set to true, it will [save]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save} and [restore]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore} the current transformation.
 *  @param {string} [backgroundFillStyle] - The style used (color, gradient, pattern...) to fill the canvas background. If defined, it will be used as the value for the [fillStyle]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle} property of the [context]{@link https://developer.mozilla.org/en-US/docs/Web/API/RenderingContext} object, internally.
 *  @returns {boolean} Returns true if the action could be performed or false  otherwise.
 */
CB_Canvas.prototype.clear = CB_Canvas.prototype.clearCanvas = function(keepTransform, backgroundFillStyle)
{
	//Gets the context:
	var context = this.getContext();

	//If the context is not defined or null, exits the function:
	if (typeof(context) === "undefined" || context === null) { return false; }
	
	//If defined, saves the current transform:
	if (keepTransform)
	{
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
	}

	//this.get().width = this.get().width + 1; //+1 for WebKit compatibility.
	//this.get().width = this.get().width;

	context.clearRect(0, 0, this.getWidth(), this.getHeight());

	if (typeof(backgroundFillStyle) !== "undefined" && backgroundFillStyle !== null)
	{
		context.globalAlpha = 1;
		context.fillStyle = backgroundFillStyle;
		context.fillRect(0, 0, this.getWidth(), this.getHeight());
	}
	/*
	else
	{
		context.clearRect(0, 0, this.getWidth(), this.getHeight());
	}
	*/
	
	//If defined, restores the transform:
	if (keepTransform)
	{
		context.restore();
	}
	
	return true;
}


/**
 * Disables anti-aliasing. Useful to work with image sprites (to avoid problems showing adjacent ones), for example.
 *  @function
 *  @param {boolean} [performTranslate=false] - If set to true, it will also call the [transform]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform} method.
 *  @returns {boolean} Returns true if the action could be performed or false  otherwise.
 */
CB_Canvas.prototype.disableAntiAliasing = function(performTranslate)
{
	//Gets the context:
	var context = this.getContext();

	//If the context is not defined or null, exits the function:
	if (typeof(context) === "undefined" || context === null) { return false; }

	if (performTranslate) { context.translate(0.5, 0.5); /*context.lineWidth = 0.5;*/ }
	context.khtmlImageSmoothingEnabled = false;
	context.oImageSmoothingEnabled = false;
	context.msImageSmoothingEnabled = false;
	context.webkitImageSmoothingEnabled = false;
	context.mozImageSmoothingEnabled = false;
	context.imageSmoothingEnabled = false;
	
	return true;
}


//Internet Explorer 11 (and lower) does not support "ellipse" method, so we try to simulate it:
//* Solution by Steve Tranby. Source: https://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas/2173084#2173084
//TODO: Add parameters and modify their order to mimic (polyfill) the native ellipse function (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ellipse).
CB_Canvas.prototype._context_drawEllipse = function drawEllipse(x, y, w, h) //NOTE: must be called being "this" the canvas context desired.
{
	var kappa = .5522848;
	var ox = (w / 2) * kappa; //Control point offset horizontal.
	var oy = (h / 2) * kappa; //Control point offset vertical.
	var xe = x + w; //x-end.
	var ye = y + h; //y-end.
	var xm = x + w / 2; //x-middle.
	var ym = y + h / 2; //y-middle.

	this.beginPath();
	this.moveTo(x, ym);
	this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	//this.closePath(); // not used correctly, see comments (use to close off open path)
	//this.stroke();
};

//CB_CanvasFileLoaded = true; //This file has been loaded.
//CB_filesNeeded["screen/canvas/CB_Canvas.js"] = true; //This file has been loaded.