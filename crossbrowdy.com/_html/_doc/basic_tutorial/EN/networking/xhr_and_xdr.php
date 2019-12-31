<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of using XHR (AJAX):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Checks whether XHR (AJAX) is supported:
	if (CB_Net.XHR.supported())
	{
		CB_console("XHR (AJAX) is supported.");
		
		//Defines the function called when the request succeeds (the status is in the "allowedSuccessStatuses" provided, which is 200 by default):
		var successFunction = function(XHR, callbackFunctionError)
		{
			CB_console("AJAX call succeeded! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
			CB_console("Content: " + CB_Net.XHR.getResponseContent(XHR));
		};
		
		//Defines the function called when the request does not succeed (the status is not in the "allowedSuccessStatuses" provided, which is 200 by default):
		var errorFunction = function(XHR, callbackFunctionOK)
		{
			CB_console("AJAX call failed! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
			CB_console("Content: " + CB_Net.XHR.getResponseContent(XHR));
		};
		
		//Performs an AJAX call:
		var XHR = CB_Net.XHR.call
		(
			//Parameters ("null" or "undefined" ones will get their default value, if needed, automatically):
			"path_to/whatever.txt", //URL. Unique mandatory parameter.
			"GET", //method. Default: 'POST'.
			"parameter1=value1&amp;parameter2=value2", //data. It can be either a string (like URL parameters) or a JSON object. Default: undefined.
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
	else
	{
		CB_console("XHR (AJAX) is not supported.");
	}
</code></pre>

<p>
	A way to perform an XHR (AJAX) request for a binary file:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Requests a binary file asynchronously:
	var successFunction = function(XHR, callbackFunctionError)
	{
		CB_console("AJAX call succeeded! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
		var contentBytes = new Uint8Array(XHR.response);
		CB_console(contentBytes);
	};
	var errorFunction = function(XHR, callbackFunctionOK)
	{
		CB_console("AJAX call failed! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
	};
	var XHR = CB_Net.XHR.callBinary
	(
		//Parameters ("null" or "undefined" ones will get their default value, if needed, automatically):
		"path_to/my_binary_file.ext", //URL. Unique mandatory parameter.
		null, //data. It can be either a string (like URL parameters) or a JSON object. Default: undefined.
		null, //headers. Default: { "Content-Type" : "text/plain; charset=x-user-defined", "Cache-Control" : "no-cache", "Pragma" : "no-cache" }.
		null, //blobOrArrayBuffer. Default: 'arraybuffer'.
		null, //callbackFunction. Default: undefined. If provided, it will ignore both "callbackFunctionOK" and "callbackFunctionError".
		successFunction, //callbackFunctionOK. Default: undefined. Ignored if "callbackFunction" is provided.
		errorFunction, //callbackFunctionError. Default: undefined. Ignored if "callbackFunction" is provided.
		[200, 201], //allowedSuccessStatuses. Default: 200.
		null //XHR. Default: undefined. When not provided, it will try to create a new XHR object internally and it will be returned.
	);
</code></pre>
	
<p>
	Sending form data through XHR (AJAX) easily:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Performing a common call with form data asynchronously:
	var XHR = CB_Net.XHR.callForm
	(
		"path_to/whatever.ext", //URL. Unique mandatory parameter.
		dataToSend, //data. It can be either a string (like URL parameters) or a JSON object. Default: undefined.
		null, //headers. Default: { "Content-Type" : "application/x-www-form-urlencoded; charset=" + charset, "Cache-Control" : "no-cache", "Pragma" : "no-cache" }.
		null, //responseType. Default: undefined.
		null, //charset. Default: 'UTF-8'.
		null, //callbackFunction. Default: undefined. If provided, it will ignore both "callbackFunctionOK" and "callbackFunctionError".
		successFunction, //callbackFunctionOK. Default: undefined. Ignored if "callbackFunction" is provided.
		errorFunction, //callbackFunctionError. Default: undefined. Ignored if "callbackFunction" is provided.
		[200, 201], //allowedSuccessStatuses. Default: 200.
		null //XHR. Default: undefined. When not provided, it will try to create a new XHR object internally and it will be returned.
	);
</code></pre>

<p>
	It is possible to perform XDR (Cross-domain requests) through a proxy (a default one is already provided by CrossBrowdy):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Performing a call through a proxy asynchronously:
	var successFunction = function(XHR, callbackFunctionError)
	{
		CB_console("AJAX call succeeded! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
		CB_console(CB_Net.XHR.getResponseHeaders(XHR)); //Shows the headers received.
		CB_console(CB_Net.XHR.getResponseContent(XHR)); //Shows the content received.
	};
	var errorFunction = function(XHR, callbackFunctionOK)
	{
		CB_console("AJAX call failed! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
	};
	var XHR = CB_Net.XHR.callProxy
	(
		desiredURL, //URL. Unique mandatory parameter. It will be passed to the proxy through the "p_url" parameter.
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
</code></pre>

<p>
	The URL of the proxy used can be defined in the <a href="_html/_doc/api/CB_Configuration.CrossBase.html#.CB_Net_XHR_PROXY_URL" target="_blank">CB_Configuration.CrossBase.CB_Net_XHR_PROXY_URL</a> parameter. By default, it points to a proxy already provided by CrossBrowdy.
	Read about the <a href="_html/_doc/api/CB_Net.XHR.html#.callProxy" target="_blank">CB_Net.XHR.callProxy</a> function to get more information about its usage, the proxy used, how to create your own one if you want, etc.
</p>

<p>
	It is also possible to perform a REST request:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Performing a REST call asynchronously:
	var XHR = CB_Net.XHR.callREST
	(
		URL, //serverURL. Default: CB_Net.REST.SERVER_URL_DEFAULT.
		"route/resource/desired", //route. Default: undefined.
		"parameter1=value1&amp;parameter2=value2", //dataURL. It has to be a string (like URL parameters). Default: undefined.
		null, //method. Default: 'POST'.
		{ "parameter3" : "value3", "whatever" : 123 }, //data. It can be either a string (like URL parameters) or a JSON object. Default: undefined.
		null, //headers. Default: undefined.
		null, //responseType. Default: undefined.
		null, //avoidProxy. Default: false. If set to false, it will perform the call through a proxy (using 'CB_Net.XHR.callProxy' internally).
		null, //forceJSON. Default: false. It will be used as the "forceJSON" parameter when calling 'CB_Net.XHR.callProxy' internally (only if "avoidProxy" is false).
		null, //getHeaders. Default: false. It will be used as the "getHeaders" parameter when calling 'CB_Net.XHR.callProxy' internally (only if "avoidProxy" is false).
		null, //headersForceOneDimension. Default: false. It will be used as the "headersForceOneDimension" parameter when calling 'CB_Net.XHR.callProxy' internally (only if "avoidProxy" is false).
		null, //headersForceOneDimensionValues. Default: false. It will be used as the "headersForceOneDimensionValues" parameter when calling 'CB_Net.XHR.callProxy' internally (only if "avoidProxy" is false).
		true, //transparentStatus. Default: false. It will be used as the "transparentStatus" parameter when calling 'CB_Net.XHR.callProxy' internally (only if "avoidProxy" is false).
		null, //transparentHeaders. Default: false. It will be used as the "transparentHeaders" parameter when calling 'CB_Net.XHR.callProxy' internally (only if "avoidProxy" is false).
		successFunction, //callbackFunctionOK. Default: undefined.
		errorFunction, //callbackFunctionError. Default: undefined.
		null, //allowedSuccessStatuses. Default: 200.
		null //XHR. Default: undefined. When not provided, it will try to create a new XHR object internally and it will be returned.
	);
</code></pre>
<p>
	Have into account that it is recommended to use the <a href="_html/_doc/api/CB_Net.REST.html" target="_blank">CB_Net.REST</a> static class instead to perform REST calls easier and in a much more powerful way. To get more information, read the <a href="<?php echo basicTutorialLink("networking", "rest"); ?>" target="_blank"><?php echo $basicTutorial["networking"]["topics"]["rest"][$language]; ?></a> topic of the basic tutorial.
</p>

<p>
	Finally, it may also be useful to get a new XHR object:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets a new XHR object:
	var XHR = CB_Net.XHR.get();
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Net.html" target="_blank">CB_Net</a> and the <a href="_html/_doc/api/CB_Net.XHR.html" target="_blank">CB_Net.XHR</a> static classes.
</p>