/**
 * @file Web client (browser or engine) management. Contains the {@link CB_Client} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */

 
/**
 * Static class to manage the current client. It will return itself if it is tried to be instantiated. It can use [BrowserDetect]{@link https://quirksmode.org/js/detect.html} ([source code rescued]{@link https://gist.github.com/mitchellhislop/2018348}).
 * @namespace
 * @todo Think about implementing a getDocumentParents function (similar to {@link CB_Client.getWindowParents}).
 * @todo Think about implementing "onClose" event (to fire when app/web is going to be closed).
 */
var CB_Client = function() { return CB_Client; };
{
	CB_Client.initialized = false; //It will tells whether the object has been initialized or not.
	
	
	//Initializes all values:
	CB_Client.init = function()
	{
		//If this is the fist time:
		if (CB_Client.initialized) { return CB_Client; }

		//The object has been initialized:
		CB_Client.initialized = true;

		return CB_Client;
	}


	//Returns the most preferred language:
	CB_Client._getLanguagePreferred =
		function(allowNavigatorLanguages, PHPAcceptedLanguagesFirst)
		{
			return CB_Client._getLanguagesPreferred(allowNavigatorLanguages, PHPAcceptedLanguagesFirst)[0];
		};

	/**
	 * Returns the most preferred language as a string.
	 *  @function
	 *  @param {boolean} [allowNavigatorLanguages={@link CB_Configuration.CrossBase.CB_Client_allowNavigatorLanguages_DEFAULT}] - Defines whether to allow using the [window.navigator.languages]{@link https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages} property (if not available, it will proceed normally).
	 *  @param {boolean} [PHPAcceptedLanguagesFirst={@link CB_Configuration.CrossBase.CB_Client_PHPAcceptedLanguagesFirst_DEFAULT}] - If it is set to true, it will try to return the accepted languages found out by [PHP]{@link https://en.wikipedia.org/wiki/PHP} (if [PHP]{@link https://en.wikipedia.org/wiki/PHP} is available) in [$_SERVER]{@link http://php.net/manual/en/reserved.variables.server.php}['HTTP_ACCEPT_LANGUAGE'] or it will proceed normally otherwise.
	 *  @returns {string}
	 *  @todo Use other back-end ways to calculate the language (using Node.js, for example).
	 */
	CB_Client.getLanguage = function(allowNavigatorLanguages, PHPAcceptedLanguagesFirst)
	{
		return CB_Client._getLanguagePreferred(allowNavigatorLanguages, PHPAcceptedLanguagesFirst);
	}


	//Returns the most preferred languages (an array):
	CB_Client._getLanguagesPreferred =
		function(allowNavigatorLanguages, PHPAcceptedLanguagesFirst)
		{
			if (typeof(PHPAcceptedLanguagesFirst) !== true && PHPAcceptedLanguagesFirst !== false) { PHPAcceptedLanguagesFirst = CB_Configuration[CB_BASE_NAME].CB_Client_PHPAcceptedLanguagesFirst_DEFAULT; }
			if (PHPAcceptedLanguagesFirst && typeof(CB_PHPAcceptedLanguages) !== "undefined" && CB_isArray(CB_PHPAcceptedLanguages) && CB_PHPAcceptedLanguages.length > 0) { return CB_PHPAcceptedLanguages; }
			if (allowNavigatorLanguages !== true && allowNavigatorLanguages !== false) { allowNavigatorLanguages = CB_Configuration[CB_BASE_NAME].CB_Client_allowNavigatorLanguages_DEFAULT; }
			if (allowNavigatorLanguages && window.navigator.languages) { return window.navigator.languages; }
			var languages = [];
			if (window.navigator.language && CB_indexOf(languages, window.navigator.language) === -1) { languages[languages.length] = window.navigator.language; }
			if (window.navigator.userLanguage && CB_indexOf(languages, window.navigator.userLanguage) === -1) { languages[languages.length] = window.navigator.userLanguage; }
			if (window.navigator.browserLanguage && CB_indexOf(languages, window.navigator.browserLanguage) === -1) { languages[languages.length] = window.navigator.browserLanguage; }
			if (window.navigator.systemLanguage && CB_indexOf(languages, window.navigator.systemLanguage) === -1) { languages[languages.length] = window.navigator.systemLanguage; }
			if (languages.length > 0) { return languages; }
			else { return [CB_Configuration[CB_BASE_NAME].CB_Client_language_DEFAULT]; }
		};
		
	/**
	 * Returns the most preferred languages as an array of strings.
	 *  @function
	 *  @param {boolean} [allowNavigatorLanguages={@link CB_Configuration.CrossBase.CB_Client_allowNavigatorLanguages_DEFAULT}] - Defines whether to allow using the [window.navigator.languages]{@link https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages} property (if not available, it will proceed normally).
	 *  @param {boolean} [PHPAcceptedLanguagesFirst={@link CB_Configuration.CrossBase.CB_Client_PHPAcceptedLanguagesFirst_DEFAULT}] - If it is set to true, it will try to return the accepted languages found out by [PHP]{@link https://en.wikipedia.org/wiki/PHP} (if [PHP]{@link https://en.wikipedia.org/wiki/PHP} is available) in [$_SERVER]{@link http://php.net/manual/en/reserved.variables.server.php}['HTTP_ACCEPT_LANGUAGE'] or it will proceed normally otherwise.
	 *  @returns {array}
	 *  @todo Use other back-end ways to calculate languages (using Node.js, for example).
	 */
	CB_Client.getLanguages = function(allowNavigatorLanguages, PHPAcceptedLanguagesFirst)
	{
		return CB_Client._getLanguagesPreferred(allowNavigatorLanguages, PHPAcceptedLanguagesFirst);
	}
	
	
	/**
	 * Sets a function to execute when the [languagechange]{@link https://developer.mozilla.org/en-US/docs/Web/Events/languagechange} event is fired (only for some web clients) or removes it.
	 *  @function
	 *  @param {function|null} eventFunction - Function that represents the event listener that will be called when the event is fired. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether to also keep the previous listeners or remove them otherwise.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 */
	CB_Client.onLanguageChanges = function(eventFunction, keepOldFunction, useCapture)
	{
		CB_Client._setEvent("languagechange", eventFunction, keepOldFunction, useCapture, window);
	}
	

	/**
	 * Alias for {@link CB_Client.get}.
	 *  @function CB_Client.getBrowser
	 *  @see {@link CB_Client.get}
	 */	
	/**
	 * Returns the current web client (if possible) as a string. It uses [BrowserDetect]{@link https://quirksmode.org/js/detect.html} ([source code rescued]{@link https://gist.github.com/mitchellhislop/2018348}) internally.
	 *  @function
	 *  @returns {string}
	 */
	CB_Client.get = CB_Client.getBrowser = function()
	{
		return BrowserDetect.browser;
	}


	/**
	 * Alias for {@link CB_Client.getVersion}.
	 *  @function CB_Client.getBrowserVersion
	 *  @see {@link CB_Client.getVersion}
	 */	
	/**
	 * Returns the current web client version (if possible) as a string. It uses [BrowserDetect]{@link https://quirksmode.org/js/detect.html} ([source code rescued]{@link https://gist.github.com/mitchellhislop/2018348}) internally.
	 *  @function
	 *  @returns {string}
	 */
	CB_Client.getVersion = CB_Client.getBrowserVersion = function()
	{
		return BrowserDetect.version + "";
	}


	/**
	 * Alias for {@link CB_Client.getVersionMain}.
	 *  @function CB_Client.getBrowserVersionMain
	 *  @see {@link CB_Client.getVersionMain}
	 */	
	/**
	 * Returns the current web client main version (first number), if possible, as an integer. It uses [BrowserDetect]{@link https://quirksmode.org/js/detect.html} ([source code rescued]{@link https://gist.github.com/mitchellhislop/2018348}) internally.
	 *  @function
	 *  @returns {integer}
	 */
	CB_Client.getVersionMain = CB_Client.getBrowserVersionMain = function()
	{
		return parseInt(CB_Client.getBrowserVersion().split(".")[0]);
	}


	CB_Client._getWindowParentsReturnCache; //Stores the return result in order to optimize the execution next times.
	/**
	 * Returns all the [window]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window} objects, parents and last son (main one) in an array (with the topmost parent in the highest index). Useful in case the script is running in an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more.
	 *  @function
	 *  @returns {array}
	 */
	CB_Client.getWindowParents = function()
	{
		//If it is not the first time we execute this function, uses the cache to return always the same:
		if (typeof(CB_Client._getWindowParentsReturnCache) !== "undefined" && CB_Client._getWindowParentsReturnCache !== null)
		{
			return CB_Client._getWindowParentsReturnCache;
		}
		
		var windowParents = [ window.self ];
		try
		{
			if (typeof(window.parent) !== "undefined" && window.parent !== null)
			{
				var currentParent = windowParents[0];//windowParents[windowParents.length - 1];
				while (typeof(currentParent.parent) !== "undefined" && currentParent !== currentParent.parent)
				{
					currentParent = currentParent.parent;
					windowParents[windowParents.length] = currentParent;
				}
				///////windowBase = currentParent;
			}
		} catch(E) {}
		
		CB_Client._getWindowParentsReturnCache = windowParents;
		
		return windowParents;
	}

	
	CB_Client._getWindowBaseReturnCache; //Stores the return result in order to optimize the execution next times.
	/**
	 * Returns the [window]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window} object of the first parent (the topmost one). Useful in case the script is running in an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more.
	 *  @function
	 *  @returns {Object}
	 */
	CB_Client.getWindowBase = function()
	{
		//If it is not the first time we execute this function, uses the cache to return always the same:
		if (typeof(CB_Client._getWindowBaseReturnCache) !== "undefined" && CB_Client._getWindowBaseReturnCache !== null)
		{
			return CB_Client._getWindowBaseReturnCache;
		}

		//By default, uses the current window object:
		var windowBase = window.self; //window;
		
		//Tries to get the topmost window (it can fail if it is not in the same domain or it is running locally):
		try
		{
			//If defined, we use window.top to get the topmost window:
			if (typeof(window.top) !== "undefined" && window.top !== null) { windowBase = window.top; }
			//...otherwise, we get all the parents and chose the last one (which will be the topmost):
			else
			{
				var windowParents = CB_Client.getWindowParents();
				windowBase = windowParents[windowParents.length - 1];
			}
		} catch(E) {}

		CB_Client._getWindowBaseReturnCache = windowBase;
		
		return windowBase;
	}

	
	CB_Client._getWindowReturnCache; //Stores the return result in order to optimize the execution next times.
	/**
	 * Returns the [window]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window} object (having in mind whether the script is running in one [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more, if we want).
	 *  @function
	 *  @param {boolean} [mindIframes={@link CB_Configuration.CrossBase.MIND_IFRAMES}] - If set to true, it will try to get and return the topmost [window]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window} object. Useful in case the script is running in an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more.
	 *  @returns {Object}
	 */
	CB_Client.getWindow = function(mindIframes)
	{
		if (typeof(mindIframes) === "undefined" || mindIframes === null) { mindIframes = CB_Configuration[CB_BASE_NAME].MIND_IFRAMES; }
		
		//If it is not the first time we execute this function, uses the cache to return always the same:
		if (!mindIframes) { return window.self; }
		else if (typeof(CB_Client._getWindowReturnCache) !== "undefined" && CB_Client._getWindowReturnCache !== null)
		{
			return CB_Client._getWindowReturnCache;
		}
		
		//Gets the window chosen (if we arrived here, it means we mind iframes):
		CB_Client._getWindowReturnCache = CB_Client.getWindowBase(); //Stores the window chosen in the cache:
		
		return CB_Client._getWindowReturnCache;
	}


	/**
	 * Returns the [document]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/document} object of the first parent (the topmost one). Useful in case the script is running in an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more.
	 *  @function
	 *  @returns {Object}
	 */
	CB_Client.getDocumentBase = function()
	{
		//By default, uses the current document object:
		var documentBase = document;
		
		//Tries to get the document object of the topmost window (it can fail if it is not in the same domain or it is running locally):
		try { documentBase = CB_Client.getWindowBase().document; } catch(E) {}
		
		return documentBase;
	}
	
	
	/**
	 * Returns the [document]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/document} object (having in mind whether the script is running in one [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more, if we want).
	 *  @function
	 *  @param {boolean} [mindIframes={@link CB_Configuration.CrossBase.MIND_IFRAMES}] - If set to true, it will try to get and return the topmost [document]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/document} object. Useful in case the script is running in an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more.
	 *  @returns {Object}
	 */
	CB_Client.getDocument = function(mindIframes)
	{
		if (typeof(mindIframes) === "undefined" || mindIframes === null) { mindIframes = CB_Configuration[CB_BASE_NAME].MIND_IFRAMES; }
		
		var documentChosen = document;
		if (mindIframes) { documentChosen = CB_Client.getDocumentBase(); }
		
		return documentChosen;
	}


	/**
	 * Tells whether the [canvas]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas} element is supported natively or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Client.supportsCanvas = function()
	{
		return CB_Configuration[CB_BASE_NAME]._supportsCanvas();
	}
	
	
	CB_Client._supportsCSS3TransformReturnCache;
	/**
	 * Tells whether [CSS3]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3} [transform]{@link https://developer.mozilla.org/en-US/docs/Web/CSS/transform} is supported natively or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Client.supportsCSS3Transform = function()
	{
		if (typeof(CB_Client._supportsCSS3TransformReturnCache) === "undefined" || CB_Client._supportsCSS3TransformReturnCache === null)
		{
			var documentBodyStyle = document.body.style;
			CB_Client._supportsCSS3TransformReturnCache = (typeof(documentBodyStyle.transform) !== "undefined" || typeof(documentBodyStyle.WebkitTransform) !== "undefined" || typeof(documentBodyStyle.MozTransform) !== "undefined"  || typeof(documentBodyStyle.OTransform) !== "undefined" || typeof(documentBodyStyle.MsTransform) !== "undefined" || typeof(documentBodyStyle.KhtmlTransform) !== "undefined");
		}
		
		return CB_Client._supportsCSS3TransformReturnCache;
	}


	/**
	 * Function that tells whether [PHP]{@link https://en.wikipedia.org/wiki/PHP} is available or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Client.supportsPHP = function()
	{
		return (typeof(CB_supportedPHP) !== "undefined" && CB_supportedPHP === "YES");
	}

	
	/**
	 * Returns the available version of [PHP]{@link https://en.wikipedia.org/wiki/PHP} (if any), as either an array of strings or as a string.
	 *  @function
	 *  @param {boolean} [asString=false] - If set to true, returns the version as a string.
	 *  @returns {array|string}
	 */
	CB_Client.getPHPVersion = function(asString)
	{
		if (typeof(CB_PHPVersion) === "undefined") { CB_PHPVersion = 0; }
		return asString ? (CB_PHPVersion + "") : (CB_PHPVersion + "").split(".");
	}


	/**
	 * Function that tells whether [Node.js]{@link https://en.wikipedia.org/wiki/Node.js} is available (checks the availability of [process.versions.node]{@link https://nodejs.org/api/process.html#process_process_versions}) or not.
	 *  @function
	 *  @returns {boolean}
	 */
	//* Source: Dan. B. @ http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
	CB_Client.supportsNodeJS = function()
	{
		return (typeof(process) === "object" && process !== null && typeof(process.versions) === "object" && typeof(process.versions.node) !== "undefined");
    }


	/**
	 * Returns the available version of [Node.js]{@link https://en.wikipedia.org/wiki/Node.js} (if any), as either an array of strings or as a string.
	 *  @function
	 *  @param {boolean} [asString=false] - If set to true, returns the version as a string.
	 *  @returns {array|string}
	 */
	CB_Client.getNodeJSVersion = function(asString)
	{
		if (typeof(process) === "object" && process !== null && CB_isString(process.version))
		{
			return asString ? process.version : process.version.replace(CB_regularExpressionString("-", true, true), ".").split(".");
		}
		else { return asString ? "0.0.0" : [0, 0, 0]; }
    }


	/**
	 * Function that tells whether [Microsoft Silverlight]{@link https://en.wikipedia.org/wiki/Microsoft_Silverlight} plugin is available or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Client.supportsSilverlight = function()
	{
		var isSilverlightInstalled = false;
		try
		{
			isSilverlightInstalled = !!(new ActiveXObject("AgControl.AgControl"));
		}
		catch(E)
		{
			if (navigator.plugins["Silverlight Plug-In"])
			{
				isSilverlightInstalled = true;
			}
			else { isSilverlightInstalled = false; }
		}

		return isSilverlightInstalled;
	}

	
	/**
	 * Returns the available version of [Microsoft Silverlight]{@link https://en.wikipedia.org/wiki/Microsoft_Silverlight} plugin (if any), as either an array of strings or as a string.
	 *  @function
	 *  @param {boolean} [asString=false] - If set to true, returns the version as a string.
	 *  @returns {array|string}
	 */
	CB_Client.getSilverlightVersion = function(asString)
	{
		if (navigator.plugins["Silverlight Plug-In"] && navigator.plugins["Silverlight Plug-In"].description && CB_isString(navigator.plugins["Silverlight Plug-In"].description) && CB_trim(navigator.plugins["Silverlight Plug-In"].description) !== "")
		{
			return asString ? navigator.plugins["Silverlight Plug-In"].description : navigator.plugins["Silverlight Plug-In"].description.replace(CB_regularExpressionString("-", true, true), ".").split(".");
		}
		else { return asString ? "0.0.0" : [0, 0, 0]; }
    }



	/**
	 * Function that tells whether [Adobe Flash (formerly Macromedia Flash)]{@link https://en.wikipedia.org/wiki/Adobe_Flash_Player} plugin is available or not.
	 *  @function
	 *  @returns {boolean}
	 */
	CB_Client.supportsFlash = function()
	{
		var isFlashInstalled = false;

		if ("ActiveXObject" in window)
		{
			try
			{
				isFlashInstalled = !!(new ActiveXObject("ShockwaveFlash.ShockwaveFlash"));
			}
			catch(E) { isFlashInstalled = false; }
		}

		if (!isFlashInstalled && typeof(navigator.mimeTypes) !== "undefined")
		{
			var mime = navigator.mimeTypes['application/x-shockwave-flash']
			if (typeof(mime) !== "undefined" && mime !== null && mime.enabledPlugin)
			{
				isFlashInstalled = true;//!!mime;
			}
		}
		
		if (!isFlashInstalled && typeof(navigator.plugins) !== "undefined")
		{
			var plugin = navigator.plugins["Shockwave Flash"];
			isFlashInstalled = !!plugin;
		}

		return isFlashInstalled;
	}


	/**
	 * Returns the available version of [Adobe Flash (formerly Macromedia Flash)]{@link https://en.wikipedia.org/wiki/Adobe_Flash_Player} plugin, if any, as either an array of strings or as a string.
	 *  @function
	 *  @param {boolean} [asString=false] - If set to true, returns the version as a string.
	 *  @returns {array|string}
	 */
	CB_Client.getFlashVersion = function(asString)
	{
		var version = "0.0.0";
		
		try
		{
			try
			{
				var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
				try { axo.AllowScriptAccess = 'always'; }
				catch(E) { return asString ? '6.0.0' : '6.0.0'.split('.'); }
			}
			catch(E) {}
			version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
			version = version.replace(CB_regularExpressionString(",", true, true), ".");
			return asString ? version : version.split('.');
		}
		catch(E)
		{
			try
			{
				if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)
				{
					version = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
					version = version.replace(CB_regularExpressionString(",", true, true), ".");
					return asString ? version : version.split('.');
				}
			} catch(E) {}
		}
		
		return asString ? version : version.split('.');
	}


	/**
	 * Tells whether the script is running locally (using "file:" protocol) or not.
	 *  @function
	 *  @param {boolean} [mindIframes={@link CB_Configuration.CrossBase.MIND_IFRAMES}] - If set to true, it will try to check the protocol of the topmost [window]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window} object. Useful in case the script is running in an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more.
	 *  @returns {boolean}
	 */
	CB_Client.isRunningLocally = function(mindIframes)
	{
		if (typeof(mindIframes) === "undefined" || mindIframes === null) { mindIframes = CB_Configuration[CB_BASE_NAME].MIND_IFRAMES; }
		
		var isRunningLocally = false; //We assume that the script is not running locally by default.
		var protocolUsed = "";

		try
		{
			var windowObject = CB_Client.getWindow(mindIframes);
			if (typeof(windowObject.location) !== "undefined" && typeof(windowObject.location.protocol) !== "undefined")
			{
				protocolUsed = windowObject.location.protocol;
			}
		}
		catch(E)
		{
			if (typeof(window.location) !== "undefined" && typeof(window.location.protocol) !== "undefined")
			{
				protocolUsed = window.location.protocol;
			}
		}

		if (protocolUsed === "file:") { isRunningLocally = true; }
		//else if (protocolUsed === "http:" || protocolUsed === "https:") { isRunningLocally = false; }
		
		return isRunningLocally;
	}


	CB_Client._isRunningOnNWjsReturnCache = null;
	/**
	 * Tells whether the script is running on [NW.js (formerly node-webkit)]{@link https://nwjs.io/} or not.
	 *  @function
	 *  @returns {boolean}
	 */
	//* Source: Kuf @ http://stackoverflow.com/questions/31968355/detect-if-web-app-is-running-in-nwjs
	CB_Client.isRunningOnNWjs = function()
	{
		if (typeof(CB_Client._isRunningOnNWjsReturnCache) !== "undefined" && CB_Client._isRunningOnNWjsReturnCache !== null) { return CB_Client._isRunningOnNWjsReturnCache; }
		if (typeof(nw) !== "undefined" && nw !== null) { return CB_Client._isRunningOnNWjsReturnCache = true; }
		try
		{
			return CB_Client._isRunningOnNWjsReturnCache = (typeof(require) === "function" && (typeof(nw) !== "undefined" && nw !== null && nw.App || typeof(require("nw.gui")) !== "undefined"));
		}
		catch(E) { return CB_Client._isRunningOnNWjsReturnCache = false; }
	}


	CB_Client._isRunningOnElctronReturnCache = null;
	/**
	 * Tells whether the script is running on [Electron (Electron.js)]{@link https://electronjs.org/} or not.
	 *  @function
	 *  @returns {boolean}
	 */
	//* Source: cheton @ https://github.com/cheton/is-electron/blob/master/index.js
	CB_Client.isRunningOnElectron = function()
	{
		if (typeof(CB_Client._isRunningOnElectronReturnCache) !== "undefined" && CB_Client._isRunningOnElectronReturnCache !== null) { return CB_Client._isRunningOnElectronReturnCache; }
		//if (typeof(nw) !== "undefined" && nw !== null) { return CB_Client._isRunningOnElectronReturnCache = true; }
		try
		{
			return CB_Client._isRunningOnElectronReturnCache = (typeof(navigator) === "object" && navigator !== null && typeof(navigator.userAgent) === "string" && navigator.userAgent.indexOf("Electron") !== -1);
		}
		catch(E) { return CB_Client._isRunningOnElectronReturnCache = false; }
	}

	
	/**
	 * Exits and finishes the script. In a browser, it will try to close the window or at least abandon it redirecting to an empty one (or to a desired URL). In an app ([NW.js (formerly node-webkit)]{@link https://nwjs.io/}/[Electron (Electron.js)]{@link https://electronjs.org/}/[Apache Cordova]{@link https://cordova.apache.org/}/[Adobe PhoneGap]{@link https://phonegap.com/}/[Appcelerator Titanium SDK]{@link https://en.wikipedia.org/wiki/Appcelerator_Titanium}/[Appcelerator TideSDK (Titanium Desktop)]{@link https://github.com/appcelerator-archive/titanium_desktop}/[Weixin (WeChat)]{@link https://en.wikipedia.org/wiki/WeChat}/etc.), it will try to close the app.
	 *  @function
	 *  @param {boolean} [allowWindowCloseFallback=true] - Defines whether to allow using the [window.close]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/close} method as a fallback.
	 *  @param {boolean} [allowRedirectionFallback=true] - Defines whether to redirect the current client as a fallback (to the URL defined in the "redirectionAddress" parameter).
	 *  @param {boolean} [redirectionAddress='about:blank'] - Defines the URL where the current client will be redirected to in the case that the window cannot be closed. Only used if the "allowRedirectionFallback" parameter is set to true.
	 *  @todo Have in mind iframes (think about it).
	 */
	CB_Client.exit = function(allowWindowCloseFallback, allowRedirectionFallback, redirectionAddress)
	{
		if (typeof(allowRedirectionFallback) === "undefined" || allowRedirectionFallback === null) { allowRedirectionFallback = true; }
		if (typeof(allowWindowCloseFallback) === "undefined" || allowWindowCloseFallback === null) { allowWindowCloseFallback = true; }
		if (typeof(redirectionAddress) === "undefined" || redirectionAddress === null) { redirectionAddress = "about:blank"; }
		
		var useFallback = true;
		
		//Tries to use NW.js (node-webkit) if available to quit the app:
		if (CB_Client.isRunningOnNWjs())
		{
			if (typeof(nw) !== "undefined" && nw !== null && nw.App && typeof(nw.App.closeAllWindows) === "function") { try { nw.App.closeAllWindows(); useFallback = false; } catch(E) { useFallback = true; } }
			if (useFallback && typeof(require) === "function")
			{
				try
				{
					var gui = require("nw.gui");
					if (typeof(gui) !== "undefined" && gui !== null && gui.App)
					{
						if (typeof(gui.App.closeAllWindows) === "function") { try { gui.App.closeAllWindows(); useFallback = false; } catch(E) { useFallback = true; } }
						if (useFallback && typeof(gui.App.quit) === "function") { try { gui.App.quit(); useFallback = false; } catch(E) { useFallback = true; } }
					}
				}
				catch(E) { useFallback = true; }
			}
			if (useFallback && typeof(nw) !== "undefined" && nw !== null && nw.App && typeof(nw.App.quit) === "function") { try { nw.App.quit(); useFallback = false; } catch(E) { useFallback = true; } }
		}
		
		//Tries to use Electron (Electron.js) if available to quit the app:
		if (CB_Client.isRunningOnElectron() && typeof(require) === "function")
		{
			try
			{
				var app = require('app');
				app.on("window-all-closed", app.quit);
				app.quit();
				useFallback = false;
			}
			catch(E) { useFallback = true; }
		}
		
		//If able, uses PhoneGap with navigator.app:
		if (typeof(navigator) !== "undefined" && typeof(navigator.app) !== "undefined" && typeof(navigator.app.exitApp) !== "undefined")
		{
			try { navigator.app.exitApp(); useFallback = false; } catch(E) { useFallback = true; }
		}
		
		//If able uses PhoneGap with navigator.device:
		if (typeof(navigator) !== "undefined" && typeof(navigator.device) !== "undefined" && typeof(navigator.device.exitApp) !== "undefined")
		{
			try { navigator.device.exitApp(); useFallback = false; } catch(E) { useFallback = true; }
		}
		
		//If able uses WeixinJSBridge (Weixin / Wechat JavaScript Bridge):
		if (typeof(WeixinJSBridge) !== "undefined" && typeof(WeixinJSBridge.call) !== "undefined")
		{
			//WeixinJSBridge.invoke("closeWindow", {}, function(e){});
			try { WeixinJSBridge.call("closeWindow"); useFallback = false; } catch(E) { useFallback = true; }
		}
		
		//If able uses Titanium/TideSDK:
		if (typeof(Ti) !== "undefined" && typeof(Ti.App) !== "undefined" && typeof(Ti.App.exit) !== "undefined")
		{
			try { Ti.App.exit(); useFallback = false; } catch(E) { useFallback = true; }
		}

		//If we want to close using the fallback:
		if (useFallback)
		{
			//Uses redirection if it is allowed:
			if (allowRedirectionFallback)
			{
				setTimeout(function() { location.href = redirectionAddress; }, 200); //Lets a little bit time to process window.close() (if allowed).
			}
			
			//Uses window.close() if it is allowed:
			if (allowWindowCloseFallback)
			{
				try
				{
					
					//if (navigator.userAgent.indexOf('MSIE') !== -1 && (navigator.appVersion.indexOf("MSIE 5") !== -1 || navigator.appVersion.indexOf("MSIE 6") !== -1))
					//{
						//CB_Client.getWindow().opener = top;
						//CB_Client.getWindow().close();
					//}
					//else
					//{
						//var ventana = CB_Client.getWindow().open("", "_self");
						//ventana.close();
					//}
					
					
					var thisWindow = window.open(allowRedirectionFallback ? redirectionAddress : "", "_self", "", "true");
					thisWindow.opener = top;
					CB_windowCloseEncapsulated = thisWindow.close;
					CB_windowCloseEncapsulated();
					
					//if (navigator.userAgent.indexOf('MSIE') !== -1 && (navigator.appVersion.indexOf("MSIE 5") !== -1 || navigator.appVersion.indexOf("MSIE 6") !== -1))
					//{
						//window.opener = top;
						//window.close();
					//}
					
						//var thisWindow = window.parent.open(allowRedirectionFallback ? redirectionAddress : location.href, "_self");
						//window.parent.close();

					
					//else
					//{
						//var thisWindow = CB_Client.getWindow(true).open(allowRedirectionFallback ? redirectionAddress : "", "_self", "", "true");
						//thisWindow.opener = CB_Client.getWindow().top;
						//CB_windowCloseEncapsulated = thisWindow.close;
						//CB_windowCloseEncapsulated();
					//}
				}
				catch(E)
				{
					try
					{
						var thisWindow = window.open(allowRedirectionFallback ? redirectionAddress : location.href, "_self");
						thisWindow.close();
					}
					catch(E)
					{
						try
						{
							window.opener = top;
							window.close();
						}
						catch(E)
						{
							try
							{
								window.opener = window;
								window.close();
							}
							catch(E)
							{
								try
								{
									window.opener = "CB_TryingToCloseWindow";
									window.close();
								}
								catch(E)
								{
									try { window.close(); } catch(E) { }
								}
							}
						}
					}
				}
			}
		}
	}


	/**
	 * Redirects the current client to the desired location (having in mind whether the script is running in one [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more, if we want).
	 *  @function
	 *  @param {string} address - The address where we want to go.
	 *  @param {string} [getData] - Any URL (GET) variables we want to send (as for example "data1=value1&data2=value2").
	 *  @param {boolean} [mindIframes={@link CB_Configuration.CrossBase.MIND_IFRAMES}] - If set to true, it will try to redirect the topmost [window]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window} object. Useful in case the script is running in an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more.
	 */
	CB_Client.redirectTo = function(address, getData, mindIframes)
	{
		getData = CB_ltrim(CB_trim(getData), ["&", "?"]);
		if (getData !== "")
		{
			if (address.indexOf("?") === -1) { getData = "?" + getData; }
			else { getData = "&" + getData; }
		}
		
		try { CB_Client.getWindow(mindIframes).location = address + getData; }
		catch(E) { window.location = address + getData; }
	}

	

	/**
	 * Returns the current URL, if possible (having in mind whether the script is running in one [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more, if we want).
	 *  @function
	 *  @param {boolean} [mindIframes={@link CB_Configuration.CrossBase.MIND_IFRAMES}] - If set to true, it will try to get the location of the topmost [window]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window} object. Useful in case the script is running in an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more.
	 *  @returns {string}
	 */
	CB_Client.getLocation = function(mindIframes)
	{
		var address = "";
		try
		{
			address = CB_Client.getWindow(mindIframes).location.href;
		}
		catch(E) { address = ""; }
		if (!address) { address = window.location.href; }
		return address;
	}	
	
	/**
	 * Returns the given address without the file (for example, if "http://whatever.com/index.html" is given, it will return "http://whatever.com/").
	 *  @function
	 *  @param {string} address - The address that we want to filter.
	 *  @param {string} [fallbackURL] - The address that we want it to return in the case that the given one is not allowed (used when "allowsLocal" does not allow a local address). If it contains a file, it will not be stripped out.
	 *  @param {boolean} [allowsLocal=true] - Defines whether to allow returning a local address or not. If it is set to false and the address is local, it will return the "fallbackURL" instead (without stripping out the file, if any).
	 *  @returns {string}
	 */
	CB_Client.getAddressWithoutFile = function(address, fallbackURL, allowsLocal)
	{
		if (allowsLocal !== true && allowsLocal !== false) { allowsLocal = true; }
		
		address = CB_trim(address);
		address = CB_rtrim(address.substring(0, address.lastIndexOf("/")), "/") + "/";

		if (allowsLocal || address.indexOf("://localhost") === -1 && address.indexOf("://127.0.0.1") === -1 && address.indexOf("://192.168") === -1 || !CB_isString(fallbackURL))
		{
			return address;
		}
		else { return fallbackURL; }
	}	

	
	/**
	 * Returns the current URL without the file (for example, if "http://whatever.com/index.html" is the current URL, it will return "http://whatever.com/"), if possible (having in mind whether the script is running in one [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more, if we want).
	 *  @function
	 *  @param {string} [fallbackURL] - The address that we want it to return in the case that the current one is not allowed (used when "allowsLocal" does not allow a local address). If it contains a file, it will not be stripped out.
	 *  @param {boolean} [allowsLocal=true] - Defines whether to allow returning a local address or not. If it is set to false and the current address is local, it will return the "fallbackURL" instead (without stripping out the file, if any).
     *  @param {boolean} [mindIframes={@link CB_Configuration.CrossBase.MIND_IFRAMES}] - If set to true, it will try to get the location of the topmost [window]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window} object. Useful in case the script is running in an [iframe]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} or more.
	 *  @returns {string}
	 */
	CB_Client.getLocationWithoutFile = function(fallbackURL, allowsLocal, mindIframes)
	{
		return CB_Client.getAddressWithoutFile(CB_Client.getLocation(mindIframes), fallbackURL, allowsLocal);
	}	

	
	//var firstTimeShit = 0;
	/**
	 * Gets the starting pixel of top or left coordinates for [getBoundingClientRect]{@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect} (it's not 0 in some Internet Explorer versions).
	 *  @function
	 *  @param {('left'|'top')} [leftOrTop='left'] - String that defines whether we want it to return the values for "left" or for "top".
	 *  @returns {integer}
	 */
	CB_Client.getBoundingClientRectMargin = function(leftOrTop)
	{
		leftOrTop = leftOrTop.toLowerCase();
		if (leftOrTop === "" || leftOrTop !== "left" && leftOrTop !== "top") { leftOrTop = "left"; }

		var getBoundingClientRectMarginDiv = CB_Elements.id("getBoundingClientRectMarginDiv");
		if (getBoundingClientRectMarginDiv === null)
		{
			var getBoundingClientRectMarginDiv = document.createElement("div");
			getBoundingClientRectMarginDiv.id = "getBoundingClientRectMarginDiv";
			getBoundingClientRectMarginDiv.style.position = "absolute";
			getBoundingClientRectMarginDiv.style.width = getBoundingClientRectMarginDiv.style.height = "0px";
			getBoundingClientRectMarginDiv.style.visibility = "hidden";
			getBoundingClientRectMarginDiv.style.left = "0px";
			getBoundingClientRectMarginDiv.style.top = "0px";
			var tagBody = CB_Elements.tag("body", document);
			if (typeof(tagBody) !== "undefined" && tagBody !== null && typeof(tagBody[0]) !== "undefined" && tagBody[0] !== null)
			{
				tagBody[0].appendChild(getBoundingClientRectMarginDiv);
				//firstTimeShit = true;
			}
		}
		
		if (typeof(getBoundingClientRectMarginDiv.getBoundingClientRect) !== "undefined" && getBoundingClientRectMarginDiv.getBoundingClientRect !== null)
		{
			var rectMargin = getBoundingClientRectMarginDiv.getBoundingClientRect();
			var margin = 0;
			if (typeof(rectMargin[leftOrTop]) !== "undefined" && rectMargin[leftOrTop] !== null && !isNaN(rectMargin[leftOrTop]))
			{
				margin = rectMargin[leftOrTop];
			}
		}
		
		if (margin < 0)
		{
			if (leftOrTop === "left") { margin += CB_Screen.getScrollLeft(); }
			else { margin += CB_Screen.getScrollTop(); }
			if (margin < 0) { margin = 0; }
		}
		
		return margin;
	}
	
	
	/**
	 * Tries to change the [document title]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/title} and returns it.
	 *  @function
	 *  @param {newTitle} newTitle - The desired new title.
	 *  @returns {string}
	 */
	CB_Client.setTitle = function(newTitle)
	{
		CB_Client.getDocumentBase().title = newTitle;
		//Chrome and Opera fix:
		var tagTitle = CB_Elements.tag("title");
		if (typeof(tagTitle) !== "undefined" && tagTitle !== null && typeof(tagTitle[0]) !== "undefined" && tagTitle[0] !== null)
		{
			tagTitle = tagTitle[0];
			try { tagTitle.innerHTML = newTitle; } catch(E) {} //Catch to avoid IE8 error.
		}
		titleCurrent = CB_Client.getTitle();
		return titleCurrent;
	}


	/**
	 * Returns the current [document title]{@link https://developer.mozilla.org/en-US/docs/Web/API/Document/title}.
	 *  @function
	 *  @returns {string}
	 */
	CB_Client.getTitle = function()
	{
		var title = CB_trim(CB_Client.getDocumentBase().title);
		if (title === "")
		{
			//Chrome and Opera fix:
			var tagTitle = CB_Elements.tag("title");
			if (typeof(tagTitle) !== "undefined" && tagTitle !== null && typeof(tagTitle[0]) !== "undefined" && tagTitle[0] !== null)
			{
				tagTitle = tagTitle[0];
				try { title = tagTitle.innerHTML; } catch(E) { title = ""; } //Catch to avoid IE8 error.
			}
		}
		return title;
	}
	
	
	//Sets a function to execute when a desired event is fired:
	CB_Client._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture, target)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; } //If not set, it keeps old function by default.
		if (typeof(target) === "undefined" || target === null)
		{
			target = window;
		}

		//If a function has been sent:
		if (typeof(eventFunction) === "function")
		{
			//If able, adds the function given to the event:
			CB_Events.add
			(
				target,
				eventName,
				function(e)
				{
					e = CB_Events.normalize(e);
					if (typeof(eventFunction) === "function") { return eventFunction(e); }
					return true;
				},
				useCapture,
				keepOldFunction,
				true
			);
		}
		//...but if the function given is null, it will cancel the event:
		else if (eventFunction === null)
		{
			CB_Events.removeByName(target, eventName);
		}
	}


}