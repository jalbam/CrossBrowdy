/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Checks whether XHR (AJAX) is supported:
	if (CB_Net.XHR.supported())
	{
		CB_console("XHR (AJAX) is supported.");
		CB_Elements.insertContentById("ajax", "Yes");

		CB_Elements.insertContentById("call_generic", "Loading...");
		CB_Elements.insertContentById("call_binary", "Loading...");
		CB_Elements.insertContentById("call_proxy", "Loading...");
		CB_Elements.insertContentById("call_proxy_headers", "Loading...");

		//Performs the XHR (AJAX) calls:
		callGeneric();
		callBinary();
		callProxy();
	}
	else
	{
		CB_console("XHR (AJAX) is not supported.");
		CB_Elements.insertContentById("ajax", "No");
	}
}


//Called when the request succeeds:
function OK(XHR, callbackFunctionError, type, contentBytes)
{
	CB_console("AJAX call succeeded! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
	CB_console("Content: " + CB_Net.XHR.getResponseContent(XHR));
	CB_Elements.insertContentById("call_" + type, "[OK] [" + CB_Net.XHR.getStatusCode(XHR) + "] Content: " + CB_Net.XHR.getResponseContent(XHR) + (contentBytes ? " " + contentBytes : ""));
};


//Called when the request does not succeed:
function error(XHR, callbackFunctionOK, type)
{
	CB_console("AJAX call failed! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
	CB_console("Content: " + CB_Net.XHR.getResponseContent(XHR));
	CB_Elements.insertContentById("call_" + type, "[ERROR] [" + CB_Net.XHR.getStatusCode(XHR) + "] Content: " + CB_Net.XHR.getResponseContent(XHR));
};


//Performs a generic call:
function callGeneric()
{
	//Defines the function called when the request succeeds (the status is in the "allowedSuccessStatuses" provided, which is 200 by default):
	var successFunction = function(XHR, callbackFunctionError)
	{
		OK(XHR, callbackFunctionError, "generic");
	};

	//Defines the function called when the request does not succeed (the status is not in the "allowedSuccessStatuses" provided, which is 200 by default):
	var errorFunction = function(XHR, callbackFunctionOK)
	{
		error(XHR, callbackFunctionOK, "generic");
	};

	//Performs an AJAX call:
	var XHR = CB_Net.XHR.call
	(
		//Parameters ("null" or "undefined" ones will get their default value, if needed, automatically):
		"data/generic.txt", //URL. Unique mandatory parameter.
		"GET", //method. Default: 'POST'.
		"parameter1=value1&parameter2=value2", //data. It can be either a string (like URL parameters) or a JSON object. Default: undefined.
		{ "Content-Type" : "text/plain; charset=x-user-defined", "Cache-Control" : "no-cache", "Pragma" : "no-cache" }, //headers. Default: undefined.
		null, //responseType. Default: undefined.
		null, //mimeType. Default: undefined.
		null, //callbackFunction. Default: undefined. If provided, it will ignore both "callbackFunctionOK" and "callbackFunctionError".
		successFunction, //callbackFunctionOK. Default: undefined. Ignored if "callbackFunction" is provided.
		errorFunction, //callbackFunctionError. Default: undefined. Ignored if "callbackFunction" is provided.
		[200, 201], //allowedSuccessStatuses. Default: 200.
		null, //asynchronous. Default: true.
		null //XHR. Default: undefined. When not provided, it will try to create a new XHR object internally and it will be returned.
	);
}


//Performs a call for a binary file:
function callBinary()
{
	//Requests a binary file asynchronously:
	var successFunction = function(XHR, callbackFunctionError)
	{
		CB_console("AJAX call succeeded! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
		var contentBytes = new Uint8Array(XHR.response);
		OK(XHR, callbackFunctionError, "binary", contentBytes);
		CB_console(contentBytes);
	};
	var errorFunction = function(XHR, callbackFunctionOK)
	{
		error(XHR, callbackFunctionOK, "binary");
	};
	var XHR = CB_Net.XHR.callBinary
	(
		//Parameters ("null" or "undefined" ones will get their default value, if needed, automatically):
		"data/binary.zip", //URL. Unique mandatory parameter.
		null, //data. It can be either a string (like URL parameters) or a JSON object. Default: undefined.
		null, //headers. Default: { "Content-Type" : "text/plain; charset=x-user-defined", "Cache-Control" : "no-cache", "Pragma" : "no-cache" }.
		null, //blobOrArrayBuffer. Default: 'arraybuffer'.
		null, //callbackFunction. Default: undefined. If provided, it will ignore both "callbackFunctionOK" and "callbackFunctionError".
		successFunction, //callbackFunctionOK. Default: undefined. Ignored if "callbackFunction" is provided.
		errorFunction, //callbackFunctionError. Default: undefined. Ignored if "callbackFunction" is provided.
		[200, 201], //allowedSuccessStatuses. Default: 200.
		null //XHR. Default: undefined. When not provided, it will try to create a new XHR object internally and it will be returned.
	);
}


//Performs a XDR (Cross-domain requests) through the proxy:
function callProxy()
{
	//Performing a call through a proxy asynchronously:
	var successFunction = function(XHR, callbackFunctionError)
	{
		OK(XHR, callbackFunctionError, "proxy");
		//Shows the headers received:
		CB_console(CB_Net.XHR.getResponseHeaders(XHR));
		CB_Elements.insertContentById("call_proxy_headers", JSON.stringify(CB_Net.XHR.getResponseHeaders(XHR)));
	};
	var errorFunction = function(XHR, callbackFunctionOK)
	{
		error(XHR, callbackFunctionOK, "proxy");
	};
	var XHR = CB_Net.XHR.callProxy
	(
		"http://www.dhtmlgames.com/", //URL. Unique mandatory parameter. It will be passed to the proxy through the "p_url" parameter.
		null, //method. Default: 'POST'. It will be passed to the proxy through the "p_method" parameter.
		null, //data. It can be either a string (like URL parameters) or a JSON object. Default: undefined. It will be passed to the proxy through the "p_data" parameter.
		null, //headers. Default: undefined. It will be passed to the proxy through the "p_headers" parameter.
		null, //responseType. Default: undefined.
		true, //forceJSON. Default: false. It will be passed to the proxy through the "p_force_json" parameter (with "yes" value).
		true, //getHeaders. Default: false. It will be passed to the proxy through the "p_get_headers" parameter (with "yes" value).
		null, //headersForceOneDimension. Default: false. It will be passed to the proxy through the "p_get_headers_on_dimension" parameter (with "yes" value).
		null, //headersForceOneDimensionValues. Default: false. It will be passed to the proxy through the "p_get_headers_on_dimension_values" parameter (with "yes" value).
		true, //transparentStatus. Default: false. It will be passed to the proxy through the "p_transparent_status" parameter (with "yes" value).
		null, //transparentHeaders. Default: false. It will be passed to the proxy through the "p_transparent_headers" parameter (with "yes" value).
		null, //callbackFunction. Default: undefined. If provided, it will ignore both "callbackFunctionOK" and "callbackFunctionError".
		successFunction, //callbackFunctionOK. Default: undefined. Ignored if "callbackFunction" is provided.
		errorFunction, //callbackFunctionError. Default: undefined. Ignored if "callbackFunction" is provided.
		null, //allowedSuccessStatuses. Default: 200.
		null //XHR. Default: undefined. When not provided, it will try to create a new XHR object internally and it will be returned.
	);
}