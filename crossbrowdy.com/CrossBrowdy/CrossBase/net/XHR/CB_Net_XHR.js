/**
 * @file [XMLHttpRequest]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} ([XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}, [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)}) and related management. Contains the {@link CB_Net.XHR} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */


if (typeof(CB_Net) === "undefined") { var CB_Net = function() { return CB_Net; }; }
 
/**
 * Static class to manage [XMLHttpRequest]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} ([XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}, [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)}) and related. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Think about providing an easy way to abort XHR (AJAX) calls.
 */
CB_Net.XHR = function() { return CB_Net.XHR; };
{
	CB_Net.XHR.initialized = false; //It will tells whether the object has been initialized or not.
	
	
	//Initializes all values:
	CB_Net.XHR.init = function()
	{
		if (CB_Net.XHR.initialized) { return CB_Net.XHR; }

		//The object has been initialized:
		CB_Net.XHR.initialized = true;
			
		//TODO.

		return CB_Net.XHR;
	}


	CB_Net.XHR._supportedReturnCache = null;
	/**
	 * Returns whether [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)} ([XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}) is available or not.
	 *  @function
	 *  @returns {boolean} Returns true if [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} ([AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)}) objects can be used.
	 */
	CB_Net.XHR.supported = function()
	{
		if (CB_Net.XHR._supportedReturnCache !== null) { return CB_Net.XHR._supportedReturnCache; }
		else
		{
			CB_Net.XHR._supportedReturnCache = (CB_Net.XHR.get() !== null);
			return CB_Net.XHR._supportedReturnCache;
		}
	}


	//Returns an AJAX object:
	//var CB_Net.XHR._getXmlHttpVersionsIE = ["Msxml2.XMLHTTP.7.0", "MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
	CB_Net.XHR._getXmlHttpVersionsIE = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //XmlHttpVersions in order of preference for old IE versions.
	CB_Net.XHR._getXmlHttpVersionsIELastIndexWorked = null; //Defines the last index of CB_XmlHttpVersion that worked (for optimization).
	/**
	 * Returns a new [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)} ([XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}) object, if possible.
	 *  @function
	 *  @returns {Object|null} Returns a new [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)} ([XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}) object if it has been possible to create it or null otherwise.
	 */
	CB_Net.XHR.get = function()
	{
		if (typeof XMLHttpRequest !== "undefined") //if (window.XMLHttpRequest).
		{
			return new XMLHttpRequest();
		}
		else if (typeof(ActiveXObject) !== "undefined")
		{
			if (CB_Net.XHR._getXmlHttpVersionsIELastIndexWorked !== null)
			{
				return new ActiveXObject(CB_Net.XHR._getXmlHttpVersionsIE[CB_Net.XHR._getXmlHttpVersionsIELastIndexWorked]);
			}
			else
			{
				var XHR = null;
				for (var x = 0, getXmlHttpVersionsIELength = CB_Net.XHR._getXmlHttpVersionsIE.length; x < getXmlHttpVersionsIELength; x++)
				{
					try
					{
						XHR = new ActiveXObject(CB_Net.XHR._getXmlHttpVersionsIE[x]);
						CB_Net.XHR._getXmlHttpVersionsIELastIndexWorked = x; //Defines this index as the last working one (for optimization).
						return XHR;
					}
					catch(E) {}
				}
				return null;
			}
		}
		return null;
	}

	
	/**
	 * Object containing the [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} and their values.
	 *  @memberof CB_Net.XHR
	 *  @typedef {Object} CB_Net.XHR.HEADERS
	 *  @property {Object} HTTPHeaderName - Each property name is an [HTTP header]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} and its value is the desired one for this header.
	 *  @example { "Content-Type" : "text/plain; charset=x-user-defined", "Cache-Control" : "no-cache", "Pragma" : "no-cache" }
	 */

	
	/**
	 * Performs an [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)} ([XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}) call.
	 *  @function
	 *  @param {string} URL - The URL that we want to call. It can also contain URL (GET) parameters.
	 *  @param {string} [method='POST'] - The [HTTP method]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods} that will be used to perform the call (GET, POST, PUT, DELETE, etc.).
	 *  @param {string|Object} [data] - The data that we want to send. If a string is given and "GET" method is being used, it will assume they are GET (URL) parameters and will be attached at the end of the URL given. If something which is not a string is given, it will assume it is a [JSON]{@link https://en.wikipedia.org/wiki/JSON} object and will try to convert it into a string (using the [JSON.stringify]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify} function internally) before sending it.
	 *  @param {CB_Net.XHR.HEADERS} [headers] - Object containing the [HTTP header]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} names and their values that we want to send (used internally by the [setRequestHeader]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader} method of the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}).
	 *  @param {string} [responseType] - If provided, it will be used for the [responseType]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType} property of the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} (if available).
	 *  @param {string} [mimeType] - [MIME type]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types} that will be used to override the default one returned by the server. Only used when the client supports the [overrideMimeType]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/overrideMimeType} method of the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}.
	 *  @param {function} [callbackFunction] - Function that will be used for the [onreadystatechange]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange} property of the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}. The unique parameter that it will receive is the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} used by the request. If provided, the "callbackFunctionOK" and "callbackFunctionError" parameters will not be used even they were also provided.
	 *  @param {function} [callbackFunctionOK] - Function that will be called by an internally-created function used in the [onreadystatechange]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange} property of the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} when the [readyState]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState} property is 4 and the [status]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status} property is included in the "allowedSuccessStatuses" desired. The first parameter it will receive is the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} used by the request and the second one will be the "callbackFunctionError" function provided (if any). It will not be used if the parameter "callbackFunction" is provided.
	 *  @param {function} [callbackFunctionError] - Function that will be called by an internally-created function used in the [onreadystatechange]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange} property of the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} when the [readyState]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState} property is 4 and the [status]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status} property is not included in the "allowedSuccessStatuses" desired. The first parameter it will receive is the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} used by the request and the second one will be the "callbackFunctionOk" function provided (if any). It will not be used if the parameter "callbackFunction" is provided.
	 *  @param {integer|array} [allowedSuccessStatuses=200] - An integer or a numeric array with a list of integers with the status or statuses that will be considered as a success call by the "callbackFunctionOK" function (only when it is used) when the response comes.
	 *  @param {boolean} [asynchronous=true] - Defines whether to make a request asynchronously or not. It will be used for the third parameter of the method [open]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open} of the [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}.
	 *  @param {Object} [XHR] - The [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} that we want to use for the call. If not provided, it will try to create a new one internally.
	 *  @returns {Object|null} Returns null if the URL provided was empty or the [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)} ([XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}) object provided is not a valid object or it could not be created a new one internally. Otherwise, it returns the [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)} ([XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}) object used to try to perform the call (even that maybe it failed or will fail later).
	 *  @todo Think about providing a way to choose whether we want the "data" provided to be added to the URL when the "GET" method is used or not.
	 *  @todo Describe better what kind of [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} will the different callbacks receive, as in some cases (as when using [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer}) they can contain some special properties with [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers}, etc.
	 */
	CB_Net.XHR.call = function(URL, method, data, headers, responseType, mimeType, callbackFunction, callbackFunctionOK, callbackFunctionError, allowedSuccessStatuses, asynchronous, XHR)
	{
		var failFunction = function(XHR)
		{
			if (typeof(callbackFunction) === "function") { callbackFunction(XHR); }
			else if (typeof(callbackFunctionError) === "function") { callbackFunctionError(XHR, callbackFunctionOK); }
		};
	
		//If the URL is empty, exits the function:
		URL = CB_trim(URL);
		if (URL === "")
		{
			failFunction({ readyState: 4, status: 400, errorMessage: "URL is empty", originalXHR: XHR });
			return null;
		}

		//If not given, sets the default parameters:
		method = CB_trim(method).toUpperCase();
		if (method === "") { method = "POST"; } //Request method by default.

		if (typeof(headers) !== "object" || headers === null) //Sets headers by default:
		{
			headers = {};
		}
		mimeType = CB_trim(mimeType); //If it was unset or null, it will be an empty string.
		responseType = CB_trim(responseType).toLowerCase(); //If it was unset or null, it will be an empty string.
		if (asynchronous !== false) { asynchronous = true; } //Async by default.

		//By default, allows 200 success status only:
		if (!CB_isArray(allowedSuccessStatuses)) { allowedSuccessStatuses = [200]; }
		
		//Creates the AJAX object:
		if (typeof(XHR) === "undefined" || XHR === null || !XHR) { XHR = CB_Net.XHR.get(); }
		
		//If the XHR object is null, exits the function:
		if (XHR === null)
		{
			failFunction({ readyState: 4, status: 400, errorMessage: "XHR is null", originalXHR: XHR });
			return null;
		}
		
		//Processes the data (if any):
		if (typeof(data) !== "undefined" && data !== null && !CB_isString(data)) //If data is not a string, we assume it is JSON data.
		{
			data = JSON.stringify(data); //data = CB_Net.URLEncode(JSON.stringify(data));
		}
		else
		{
			data = CB_trim(data);
			
			//If there are data and the method is GET, it adds them to the URL:
			if (data !== "" && method === "GET")
			{
				if (CB_indexOf(URL, "?") === -1) { URL += "?" + data; } //There was not ? symbol in the URL, so we add it.
				else { URL += "&" + data; } //There was ? symbol in the URL, so we add the & symbol.
				//TODO: consider setting "data" to null or empty string since we do not need them to send them in the "send" method (we have already added them in the "URL" variable).
			}
		}

		//Opens the connection:
		try //Using try-catch to avoid problems with IE5.5:
		{
			XHR.open(method, URL, asynchronous);
		}
		catch(E)
		{
			var originalXHR = XHR;
			var fakeXHR = { readyState: 4, status: 500, errorMessage: "Failed when using open method", originalXHR: XHR };
			try
			{
				XHR.readyState = 4;
				XHR.status = 500;
				XHR.errorMessage = "Failed when using open method";
			} catch(E) { XHR = fakeXHR; }
			if (XHR.readyState !== 4) { XHR = fakeXHR; } //Some web clients as IE9 will not fail when try to edit properties but they will not end being modified.
			failFunction(XHR);
			return originalXHR;
		}

		//Applies the given headers (if any):
		//if (mimeType !== null) { headers["Content-Type"] = mimeType; }
		for (var headerName in headers)
		{
			XHR.setRequestHeader(headerName, headers[headerName]);
		}

		//Applies the given mime type (if any):
		if (XHR.overrideMimeType && mimeType !== "")
		{
			//XHR.overrideMimeType("text/plain; charset=UTF-8");
			XHR.overrideMimeType(mimeType);
		}
		
		//Applies the given response type (if any):
		if (typeof(XHR.responseType) !== "undefined" && responseType !== "")
		{
			XHR.responseType = responseType;
		}

		/*
		else
		{
			if (responseType === "" || responseType === "text")
			{
				XHR.overrideMimeType("text/plain; charset=UTF-8");
			}
			else if (responseType === "xml")
			{
				XHR.overrideMimeType("text/xml");
			}
			else if (responseType === "arraybuffer")
			{
				//XHR.overrideMimeType("text/plain; charset=x-user-defined");
			}
		}*/

		//If set, defines the callback function:
		if (typeof(callbackFunction) === "function")
		{
			XHR.onreadystatechange = function() { callbackFunction(XHR); };
		}
		//...otherwise, defines the callback functions for OK and error status:
		else
		{
			XHR.onreadystatechange = function()
			{
				//if (XHR.readyState == 4)
				if (XHR.readyState === 4)
				{
					//if (XHR.status == 200 || allowOtherSuccessStatus && XHR.status == 206)
					if (CB_indexOf(allowedSuccessStatuses, parseInt(XHR.status)) !== -1)
					{
						if (typeof(callbackFunctionOK) === "function")
						{
							callbackFunctionOK(XHR, callbackFunctionError);
						}
					}
					//else if (XHR.readyState == 4 && (XHR.status == 0 || XHR.status == 502 || XHR.status == 12002 || XHR.status == 12029 || XHR.status == 12030 || XHR.status == 12031 || XHR.status == 12029 || XHR.status == 12152 || XHR.status == 12159))
					//else if (XHR.status !== 12152 && XHR.status !== 12030 && XHR.status !== 0 && XHR.status !== 12002 && XHR.status !== 12007 && XHR.status !== 12029 && XHR.status !== 12031)
					else
					{
						if (typeof(callbackFunctionError) === "function")
						{
							callbackFunctionError(XHR, callbackFunctionOK);
						}
					}
				}
			}
		}

		//Sends the XHR request:
		XHR.send(data);
		
		//Returns the XHR object:
		return XHR;
	}


	/**
	 * Performs a standard [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} request to send form data by POST (no files). Uses the {@link CB_Net.XHR.call} function internally with "POST" method, asynchronously and "mimeType" parameter not provided.
	 *  @function
	 *  @param {string} URL - Used for the "URL" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {string|Object} [data] - Used for the "data" parameter of the {@link CB_Net.XHR.call} function when it is called internally. 
	 *  @param {CB_Net.XHR.HEADERS} [headers={ "Content-Type" : "application/x-www-form-urlencoded; charset=" + charset, "Cache-Control" : "no-cache", "Pragma" : "no-cache" }] - Object containing the [HTTP header]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} names and their values that we want to send. If not provided, it will use the default one that will include the charset defined by the "charset" parameter. An empty object ({}) can be used if we do not want to send any [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} at all. Used for the "headers" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {string} [responseType] - Used for the [responseType]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType} parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {string} [charset='UTF-8'] - The charset for the "Content-Type" [HTTP header]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} that will be sent by default only when no "headers" parameter is provided.
	 *  @param {function} [callbackFunction] - Used for the "callbackFunction" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {function} [callbackFunctionOK] - Used for the "callbackFunctionOK" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {function} [callbackFunctionError] - Used for the "callbackFunctionError" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {integer|array} [allowedSuccessStatuses=200] - Used for the "allowedSuccessStatuses" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {Object} [XHR] - Used for the "XHR" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @returns {Object|null} Returns the same that the {@link CB_Net.XHR.call} function returns (called internally).
	 */
	CB_Net.XHR.callForm = function(URL, data, headers, responseType, charset, callbackFunction, callbackFunctionOK, callbackFunctionError, allowedSuccessStatuses, XHR)
	{
		//If not given, sets the default parameters:
		charset = CB_trim(charset);
		if (typeof(charset) === "undefined" || charset === "") { charset = "UTF-8"; } //Default charset.
		if (typeof(headers) !== "object" || headers === null)
		{
			headers =
			{
				"Content-Type" : "application/x-www-form-urlencoded; charset=" + charset,
				"Cache-Control" : "no-cache",
				"Pragma" : "no-cache"
			};
		}

		//Makes the AJAX request function and returns the same: 
		return CB_Net.XHR.call
		(
			URL, //URL
			"POST", //method
			data, //data
			headers, //headers
			responseType, //responseType
			null, //mimeType
			callbackFunction, //callbackFunction
			callbackFunctionOK, //callbackFunctionOK
			callbackFunctionError, //callbackFunctionError
			allowedSuccessStatuses, //allowedSuccessStatuses
			true, //asynchronous
			XHR //XHR object
		);
	}


	/**
	 * Performs a standard [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} request for a binary file. Uses the {@link CB_Net.XHR.call} function internally with "GET" method, using "text/plain; charset=x-user-defined" for the "mimeType" parameter and asynchronously.
	 *  @function
	 *  @param {string} URL - Used for the "URL" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {string|Object} [data] - Used for the "data" parameter of the {@link CB_Net.XHR.call} function when it is called internally. 
	 *  @param {CB_Net.XHR.HEADERS} [headers={ "Content-Type" : "text/plain; charset=x-user-defined", "Cache-Control" : "no-cache", "Pragma" : "no-cache" }] - Object containing the [HTTP header]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} names and their values that we want to send. If not provided, it will use the default one. An empty object ({}) can be used if we do not want to send any [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} at all. Used for the "headers" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {'arraybuffer'|'blob'} [blobOrArrayBuffer='arraybuffer'] - Used for the [responseType]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType} parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {function} [callbackFunction] - Used for the "callbackFunction" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {function} [callbackFunctionOK] - Used for the "callbackFunctionOK" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {function} [callbackFunctionError] - Used for the "callbackFunctionError" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {integer|array} [allowedSuccessStatuses=200] - Used for the "allowedSuccessStatuses" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @param {Object} [XHR] - Used for the "XHR" parameter of the {@link CB_Net.XHR.call} function when it is called internally.
	 *  @returns {Object|null} Returns the same that the {@link CB_Net.XHR.call} function returns (called internally).
	 */
	CB_Net.XHR.callBinary = function(URL, data, headers, blobOrArrayBuffer, callbackFunction, callbackFunctionOK, callbackFunctionError, allowedSuccessStatuses, XHR)
	{
		//If not given, sets the default parameters:
		blobOrArrayBuffer = CB_trim(blobOrArrayBuffer).toLowerCase();
		if (typeof(headers) !== "object" || headers === null)
		{
			headers =
			{
				"Content-Type" : "text/plain; charset=x-user-defined",
				"Cache-Control" : "no-cache",
				"Pragma" : "no-cache"
			};
		}
		if (blobOrArrayBuffer !== "blob") //Only allows to be "blob" or "arraybuffer":
		{
			blobOrArrayBuffer = "arraybuffer";
		}
		
		//Makes the AJAX request function and returns the same:
		return CB_Net.XHR.call
		(
			URL, //URL
			"GET", //method
			data, //data
			headers, //headers
			blobOrArrayBuffer, //responseType
			"text/plain; charset=x-user-defined", //mimeType
			callbackFunction, //callbackFunction
			callbackFunctionOK, //callbackFunctionOK
			callbackFunctionError, //callbackFunctionError
			allowedSuccessStatuses, //allowedSuccessStatuses
			true, //asynchronous
			XHR //XHR object
		);
	}


	/**
	 * Performs an [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)} ([XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}) call through the proxy (made with [PHP]{@link https://en.wikipedia.org/wiki/PHP} language and using [cURL]{@link https://en.wikipedia.org/wiki/CURL}, so it will need a server which supports that) to avoid [cross-domain request]{@link https://en.wikipedia.org/wiki/Cross-origin_resource_sharing} limitations of [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)}. Uses the {@link CB_Net.XHR.callForm} function (with "headers" and "charset" parameters not provided) internally to call the proxy.
	 <br />
	 Note: Edit the "CB_proxy.config.php" file to configure the proxy. Apart from configuring it, adding some security measures is highly recommended.
	 *  @function
	 *  @param {string} URL - The URL that we want the proxy to call for us. It can also contain URL (GET) parameters.
	 *  @param {string} [method='POST'] - The [HTTP method]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods} (GET, POST, PUT, DELETE, etc.) that we want the proxy to use for us when performing the call.
	 *  @param {string|Object} [data] - The data that we want to send through the proxy to the final server. If something which is not a string is given, it will assume it is a [JSON]{@link https://en.wikipedia.org/wiki/JSON} object and will try to convert it into a string (using the [JSON.stringify]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify} function internally) before sending it.
	 *  @param {CB_Net.XHR.HEADERS} [headers] - Object ([JSON]{@link https://en.wikipedia.org/wiki/JSON} format) containing the [HTTP header]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} names and their values that we want the proxy to send to the final server. Even if not provided, the proxy could end sending some [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} depending on the [cURL]{@link https://en.wikipedia.org/wiki/CURL} configuration used.
	 *  @param {string} [responseType] - Used for the [responseType]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType} parameter of the {@link CB_Net.XHR.callForm} function when it is called internally.
	 *  @param {boolean} [forceJSON=false] - If it is set to true, the response from the proxy will be a [JSON]{@link https://en.wikipedia.org/wiki/JSON} object with the [status]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status} property containing the [HTTP status]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status} of the reply, the [response]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response} property with the response content itself and the "headers" property (only when "getHeaders" parameters is set to true) with the [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} of the reply, all belonging to the response from the final server.
	 *  @param {boolean} [getHeaders=false] - If it is set to true, the proxy will answer including the [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} from the final server. The [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} will be included in the final response string at the beginning (before the response content) if the "forceJSON" parameter is not set to true or in the "headers" property of the [JSON]{@link https://en.wikipedia.org/wiki/JSON} object that belongs to the response otherwise.
	 *  @param {boolean} [headersForceOneDimension=false] - If it is set to true, the proxy will consider that the [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} of the response from the final server are not multidimensional which means that the final server would never reply the same [HTTP header]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} repeated multiple times (with different values, normally) in different chunks separated by double new lines ("\r\n\r\n"). Default value (false) is recommended. Needs "getHeaders" set to true.
	 *  @param {boolean} [headersForceOneDimensionValues=false] - If it is set to true, the proxy will only consider one value per [HTTP header]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} from the response from the final server. Default value (false) is recommended. Needs "getHeaders" set to true.
	 *  @param {boolean} [transparentStatus=false] - If it is set to true, the proxy will reply us with the same status as the final server in its HTTP response.
	 *  @param {boolean} [transparentHeaders=false] - If it is set to true, the proxy will reply us with the same [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} as the final server in its HTTP response.
	 *  @param {function} [callbackFunction] - Used for the "callbackFunction" parameter of the {@link CB_Net.XHR.callForm} function when it is called internally.
	 *  @param {function} [callbackFunctionOK] - Used for the "callbackFunctionOK" parameter of the {@link CB_Net.XHR.callForm} function when it is called internally.
	 *  @param {function} [callbackFunctionError] - Used for the "callbackFunctionError" parameter of the {@link CB_Net.XHR.callForm} function when it is called internally.
	 *  @param {integer|array} [allowedSuccessStatuses=200] - Used for the "allowedSuccessStatuses" parameter of the {@link CB_Net.XHR.callForm} function when it is called internally.
	 *  @param {Object} [XHR] - Used for the "XHR" parameter of the {@link CB_Net.XHR.callForm} function when it is called internally.
	 *  @returns {Object|null} Returns the same that the {@link CB_Net.XHR.callForm} function returns (called internally).
	 *  @todo Document PHP proxy more.
	 */
	CB_Net.XHR.callProxy = function(URL, method, data, headers, responseType, forceJSON, getHeaders, headersForceOneDimension, headersForceOneDimensionValues, transparentStatus, transparentHeaders, callbackFunction, callbackFunctionOK, callbackFunctionError, allowedSuccessStatuses, XHR)
	{
		//Adds the proxy data and session (for users without cookies enabled) to the data:
		var proxyVariables = "p_url=" + CB_Net.URLValueEncode(URL);
		method = CB_trim(method).toUpperCase();
		if (method === "") { method = "POST"; } //Request method by default.
		proxyVariables += "&p_method=" + CB_Net.URLValueEncode(method);
		if (typeof(headers) === "object" && headers !== null) { proxyVariables += "&p_headers=" + CB_Net.URLValueEncode(JSON.stringify(headers)); }
		if (forceJSON) { proxyVariables += "&p_force_json=yes"; }
		if (getHeaders) { proxyVariables += "&p_get_headers=yes"; }
		if (headersForceOneDimension) { proxyVariables += "&p_get_headers_on_dimension=yes"; }
		if (headersForceOneDimensionValues) { proxyVariables += "&p_get_headers_on_dimension_values=yes"; }
		if (transparentStatus) { proxyVariables += "&p_transparent_status=yes"; }
		if (transparentHeaders) { proxyVariables += "&p_transparent_headers=yes"; }
		
		//proxyVariables += "&" + SESSION_PARAMETER;
		//proxyVariables += "&ajax=true";
		//proxyVariables += "&php_root=" + PROJECT_PATH_FROM_PROXY;
		if (typeof(data) !== "undefined" && data !== null && !CB_isString(data)) //If data is not a string, we assume it is JSON data.
		{
			data = JSON.stringify(data);
		}
		else { data = CB_trim(data); }
		if (data !== "") { data = "p_data=" + CB_Net.URLValueEncode(data) + "&" + proxyVariables; }
		else { data = proxyVariables; }

		//Calls the proxy by post method:
		return CB_Net.XHR.callForm
		(
			CB_Configuration[CB_BASE_NAME].CB_Net_XHR_PROXY_URL, //URL of the proxy.
			data, //data
			null, //headers
			responseType, //responseType
			null, //charset
			callbackFunction, //callbackFunction
			callbackFunctionOK, //callbackFunctionOK
			callbackFunctionError, //callbackFunctionError
			allowedSuccessStatuses, //allowedSuccessStatuses
			XHR //XHR
		);
	}


	/**
	 * Performs a [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} call to a [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} server. Uses the {@link CB_Net.XHR.callProxy} function (without "callbackFunction" parameter provided) internally if we do not want to avoid the proxy or uses the {@link CB_Net.XHR.call} function (asynchronously, with "mimeType" and "callbackFunction" parameters not provided) otherwise.
	 *  @function
	 *  @param {string} [serverURL={@link CB_Net.REST.SERVER_URL_DEFAULT}] - The URL of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} server that we want to call. It should not contain URL (GET) parameters. It can also contain the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} path (route), although it is recommended to set it in the "route" parameter.
	 *  @param {string} [route] - The [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} path (route) we want to request. It can also contain URL (GET) parameters, although it is recommended to set them in the "dataURL" parameter.
	 *  @param {string} [dataURL] - The URL (GET) data that we want to send.
	 *  @param {string} [method='POST'] - Used for the "method" parameter for the {@link CB_Net.XHR.callProxy} function or for the {@link CB_Net.XHR.call} function (if no proxy is allowed) when it is called internally.
	 *  @param {string|Object} [data] - Used for the "data" parameter of the {@link CB_Net.XHR.callProxy} function or of the {@link CB_Net.XHR.call} function (if no proxy is allowed) when it is called internally.
	 *  @param {CB_Net.XHR.HEADERS} [headers=undefined|{ "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8", "Cache-Control" : "no-cache", "Pragma" : "no-cache" }] - Used for the "headers" parameter of the {@link CB_Net.XHR.callProxy} function or of the {@link CB_Net.XHR.call} function (if no proxy is allowed) when it is called internally. If not provided and the {@link CB_Net.XHR.call} function is used (if no proxy is allowed), the default value will be: { "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8", "Cache-Control" : "no-cache", "Pragma" : "no-cache" }
	 *  @param {string} [responseType] - Used for the [responseType]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType} parameter of the {@link CB_Net.XHR.callProxy} function or of the {@link CB_Net.XHR.call} function (if no proxy is allowed) when it is called internally.
	 *  @param {boolean} [avoidProxy=false] - If it is set to true, it will call the {@link CB_Net.XHR.call} internally. Otherwise, it will use the {@link CB_Net.XHR.callProxy} function internally.
	 *  @param {boolean} [forceJSON=false] - Used for the "forceJSON" parameter of the {@link CB_Net.XHR.callProxy} function (if the proxy is allowed) when it is called internally.
	 *  @param {boolean} [getHeaders=false] - Used for the "getHeaders" parameter of the {@link CB_Net.XHR.callProxy} function (if the proxy is allowed) when it is called internally.
	 *  @param {boolean} [headersForceOneDimension=false] - Used for the "headersForceOneDimension" parameter of the {@link CB_Net.XHR.callProxy} function (if the proxy is allowed) when it is called internally.
	 *  @param {boolean} [headersForceOneDimensionValues=false] - Used for the "headersForceOneDimensionValues" parameter of the {@link CB_Net.XHR.callProxy} function (if the proxy is allowed) when it is called internally.
	 *  @param {boolean} [transparentStatus=false] - Used for the "transparentStatus" parameter of the {@link CB_Net.XHR.callProxy} function (if the proxy is allowed) when it is called internally.
	 *  @param {boolean} [transparentHeaders=false] - Used for the "transparentHeaders" parameter of the {@link CB_Net.XHR.callProxy} function (if the proxy is allowed) when it is called internally.
	 *  @param {function} [callbackFunctionOK] - Used for the "callbackFunctionOK" parameter of the {@link CB_Net.XHR.callProxy} function or of the {@link CB_Net.XHR.call} function (if no proxy is allowed) when it is called internally.
	 *  @param {function} [callbackFunctionError] - Used for the "callbackFunctionError" parameter of the {@link CB_Net.XHR.callProxy} function or of the {@link CB_Net.XHR.call} function (if no proxy is allowed) when it is called internally.
	 *  @param {integer|array} [allowedSuccessStatuses=200] - Used for the "allowedSuccessStatuses" parameter of the {@link CB_Net.XHR.callProxy} function or of the {@link CB_Net.XHR.call} function (if no proxy is allowed) when it is called internally.
	 *  @param {Object} [XHR] - Used for the "XHR" parameter of the {@link CB_Net.XHR.callProxy} function or of the {@link CB_Net.XHR.call} function (if no proxy is allowed) when it is called internally.
	 *  @returns {Object|null} When using the proxy is allowed, returns the same that the {@link CB_Net.XHR.callProxy} function returns (called internally). Otherwise, it returns the same that the {@link CB_Net.XHR.call} function returns (called internally).
	 */
	CB_Net.XHR.callREST = function(serverURL, route, dataURL, method, data, headers, responseType, avoidProxy, forceJSON, getHeaders, headersForceOneDimension, headersForceOneDimensionValues, transparentStatus, transparentHeaders, callbackFunctionOK, callbackFunctionError, allowedSuccessStatuses, XHR)
	{
		serverURL = CB_trim(serverURL);
		//if (serverURL === "") { serverURL = CB_trim(CB_Net.REST.SERVER_URL_DEFAULT); }
		if (serverURL === "") { serverURL = CB_Net.REST.SERVER_URL_DEFAULT; }
		serverURL += CB_trim(route);
		
		dataURL = CB_trim(dataURL);
		if (dataURL !== "")
		{
			serverURL = CB_rtrim(serverURL, ["?", "&", " "]);
			if (CB_indexOf(serverURL, "?") !== -1) { serverURL += "&" + dataURL; }
			else { serverURL += "?" + dataURL; }
		}

		if (!avoidProxy)
		{
			return CB_Net.XHR.callProxy
			(
				serverURL, //URL of the REST server.
				method, //method
				data, //data
				headers, //headers
				responseType, //responseType
				forceJSON, //forceJSON
				getHeaders, //getHeaders
				headersForceOneDimension, //headersForceOneDimension
				headersForceOneDimensionValues, //headersForceOneDimensionValues
				transparentStatus, //transparentStatus
				transparentHeaders, //transparentHeaders
				null, //callbackFunction
				callbackFunctionOK, //callbackFunctionOK
				callbackFunctionError, //callbackFunctionError
				allowedSuccessStatuses, //allowedSuccessStatuses
				XHR //XHR
			);
		}
		else
		{
			if (typeof(headers) !== "object" || headers === null)
			{
				headers =
				{
					"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
					"Cache-Control" : "no-cache",
					"Pragma" : "no-cache"
				};
			}

			//Makes the AJAX request function and returns the same: 
			return CB_Net.XHR.call
			(
				serverURL, //URL
				method, //method
				data, //data
				headers, //headers
				responseType, //responseType
				null, //mimeType
				null, //callbackFunction
				callbackFunctionOK, //callbackFunctionOK
				callbackFunctionError, //callbackFunctionError
				allowedSuccessStatuses, //allowedSuccessStatuses
				true, //asynchronous
				XHR //XHR object
			);
		}
	}


	/**
	 * Returns the [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} (it should be an object) from the [JSON]{@link https://en.wikipedia.org/wiki/JSON} response generated by the "getSslPage" function used by the [PHP]{@link https://en.wikipedia.org/wiki/PHP} proxy ("headers" property). Useful to parse the response from the {@link CB_Net.XHR.callProxy} (or {@link CB_Net.XHR.callREST} and related) function when it has been called with the "forceJSON" parameter set to true.
	 *  @function
	 *  @param {Object|string} response - The [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} which contains the [responseText]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText} property or the value of the [responseText]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText} property (string) itself which should contain the [JSON]{@link https://en.wikipedia.org/wiki/JSON} response generated by the "getSslPage" function used by the [PHP]{@link https://en.wikipedia.org/wiki/PHP} proxy. If a string is provided, tries to parse it as a [JSON]{@link https://en.wikipedia.org/wiki/JSON} object. The "headers" property will be tried to be returned from it.
	 *  @param {boolean} [sanitize=true] - If it is set to true and the "headers" property is not found, it will return an empty object ({}) instead of returning null.
	 *  @returns {Object|null} Returns the content of the "headers" property if possible (it should be a {@link CB_Net.XHR.HEADERS} object). If it is not possible, it will return null if the parameter "sanitize" is set to false or an empty object ({}) otherwise.
	 *  @todo Consider adding the parameter "headerNameFirst".
	 */
	CB_Net.XHR.getResponseHeaders = function(response, sanitize) //TODO: Add parameter headerNameFirst
	{
		if (typeof(sanitize) === "undefined" || sanitize === null) { sanitize = true; } //Sanitizes by default.
		var headers = CB_getJSONPropertyValue(response.responseText ? response.responseText : response, "headers", null);
		if (sanitize && headers === null) { return {}; } //If the property is not found or null and we want to sanitize, returns an empty object by default.
		return headers; //Can be NULL.
	}


	/**
	 * Returns the [HTTP status]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status} code from an [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} ([status]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status} property) or from the info array generated by the [PHP]{@link https://en.wikipedia.org/wiki/PHP}'s [curl_getinfo]{@link http://php.net/manual/function.curl-getinfo.php} function ("http_code" index) or from the [JSON]{@link https://en.wikipedia.org/wiki/JSON} response generated by the "getSslPage" function used by the [PHP]{@link https://en.wikipedia.org/wiki/PHP} proxy ([status]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status} property). Useful to parse the response from the {@link CB_Net.XHR.callProxy} (or {@link CB_Net.XHR.callREST} and related) function when it has been called with the "forceJSON" parameter set to true.
	 *  @function
	 *  @param {Object|string} response - The [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} which contains the [status]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status} property or the value of the [responseText]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText} property (string) itself which should contain the [JSON]{@link https://en.wikipedia.org/wiki/JSON} response generated by the "getSslPage" function used by the [PHP]{@link https://en.wikipedia.org/wiki/PHP} proxy. If a string is provided, tries to parse it as a [JSON]{@link https://en.wikipedia.org/wiki/JSON} object. The [status]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status} property will be tried to be returned from it (or the "http_code" property as a fallback).
	 *  @param {boolean} [sanitize=true] - If it is set to true and neither the "status" nor the "http_code" property are found (or is not a number), it will return the value of "statusDefault" instead of returning null.
	 *  @param {boolean} [statusDefault=-1] - Default value to return when the status cannot be found (or is not a number). Only used when the "sanitize" parameter is set to true.
	 *  @returns {integer|*} Returns the content of the [status]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status} (or "http_code") property if possible (it should be an integer). If it is not possible, it will return null if the parameter "sanitize" is set to false or the value of "statusDefault" otherwise.
	 */
	CB_Net.XHR.getStatusCode = function(response, statusDefault, sanitize)
	{
		if (typeof(sanitize) === "undefined" || sanitize === null) { sanitize = true; } //Sanitizes by default.
		if (typeof(statusDefault) === "undefined" || statusDefault === null) { statusDefault = -1; }
		var statusCode = CB_getJSONPropertyValue(response, "status", null);
		if (statusCode === null || isNaN(statusCode)) { statusCode = CB_getJSONPropertyValue(response, "http_code", null); }
		if (sanitize && (statusCode === null || isNaN(statusCode))) { return statusDefault; } //If the property is not found or null and we want to sanitize, returns -1 by default.
		return !isNaN(statusCode) ? parseInt(statusCode) : null; //Can be NULL.
	}


	/**
	 * Returns the response content from an [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} (from its [responseText]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText} property) or from the [JSON]{@link https://en.wikipedia.org/wiki/JSON} response generated by the "getSslPage" function used by the [PHP]{@link https://en.wikipedia.org/wiki/PHP} proxy ([response]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response} property). Useful to parse the response from the {@link CB_Net.XHR.callProxy} (or {@link CB_Net.XHR.callREST} and related) function when it has been called with the "forceJSON" parameter set to true.
	 *  @function
	 *  @param {Object|string} response - The [XHR object]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} which contains the [responseText]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText} property or the value of the [responseText]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText} property (string) itself which should contain the [JSON]{@link https://en.wikipedia.org/wiki/JSON} response generated by the "getSslPage" function used by the [PHP]{@link https://en.wikipedia.org/wiki/PHP} proxy. If a string is provided, tries to parse it as a [JSON]{@link https://en.wikipedia.org/wiki/JSON} object. The [responseText]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText} property (or the [response]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response} property as a fallback) will be tried to be returned from it.
	 *  @param {boolean} [sanitize=true] - If it is set to true and neither the [responseText]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText} nor the [response]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response} properties are found, it will return an empty string ("") instead of returning null.
	 *  @returns {string|null} Returns the content of the [responseText]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText} (or [response]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response}) property if possible. If it is not possible, it will return null if the parameter "sanitize" is set to false or an empty string ("") otherwise.
	 */
	CB_Net.XHR.getResponseContent = function(responseOrXHR, sanitize)
	{
		if (typeof(sanitize) === "undefined" || sanitize === null) { sanitize = true; } //Sanitizes by default.
		var response = null;
		try //Prevents the "InvalidStateError: responseText is only available if responseType is '' or 'text'." error in Firefox.
		{
			response = CB_getJSONPropertyValue(responseOrXHR, "responseText", responseOrXHR);
		}
		catch(E) {}
		response = CB_getJSONPropertyValue(response, "response", response);
		if (sanitize && response === null) { return ""; } //If the property is not found or null and we want to sanitize, returns an empty string by default.
		return response ? response : null;
	}
	
}