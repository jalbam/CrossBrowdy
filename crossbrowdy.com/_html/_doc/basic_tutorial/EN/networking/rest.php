<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Although it is possible to make REST calls through the <a href="api/CB_Net.XHR.html#.callREST" target="_blank">CB_Net.XHR.callREST</a> function, it is recommended to use the powerful <a href="api/CB_Net.REST.html" target="_blank">CB_Net.REST</a> static class instead to make things easier.
	Here is an example of REST management:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Defines a REST action called "my_action":
	CB_Net.REST.actions["my_action"] = 
	{
		//URL of the REST server:
		"serverURL" : "http://URL_of_the_REST_server", //If not provided, it will use 'CB_Net.REST.SERVER_URL_DEFAULT'.
		
		//Route (path to the resource):
		"route" : "/whoever/whoever2?whatever3=whatever3_data", //If provided, it will be attached at the end of the server URL.
		
		//HTTP method to use:
		"method" : "GET", //If not provided, it will use 'CB_Net.REST.method_DEFAULT'.
		
		//Data to send:
		"data" : //If not provided, it will use 'CB_Net.REST.data_DEFAULT'.
			function(actionName, additionalData)
			{
				//Do things...
				var data = "dataItem3=dataItem3_value&whateverItem=whateverItem_value"; //It must return a string as query parameters or a string containing a JSON format object.
				return data;
			},
		
		//Function to call when the REST action succeeds (ignored if it was aborted on time):
		"callbackOk" : //If not provided, it will use 'CB_Net.REST.callbackOk_DEFAULT'.
			function(actionName, XHR, callbackError, additionalData)
			{
				CB_console(actionName + " REST action succeeded! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
				CB_console(CB_Net.XHR.getResponseContent(XHR)); //Shows the content received.
			},
		
		//Function to call when the REST action fails:
		"callbackError" : //If not provided, it will use 'CB_Net.REST.callbackError_DEFAULT'.
			function(actionName, XHR, additionalData)
			{
				CB_console(actionName + " REST action failed! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
			}
	};

	//Performs the REST action through the default proxy server (defined in 'CB_Configuration.CrossBase.CB_Net_XHR_PROXY_URL'):
	var additionalData = {"additional_data" : "whatever"};
	var XHR = CB_Net.REST.actionProcess("my_action", additionalData); //It also sends additional data (this is optional) that will be useful for all the callbacks.

	//Performs the REST action directly, without proxy:
	var XHR_2 = CB_Net.REST.actionProcess("my_action", additionalData, null, null, true);
	
	//Performs the REST action to the desired server (ignoring 'serverURL' defined in the action), through the default proxy (defined in 'CB_Configuration.CrossBase.CB_Net_XHR_PROXY_URL'):
	var XHR_3 = CB_Net.REST.actionProcess("my_action", additionalData, null, "http://another_REST_server_URL");
	
	//Aborts the REST action (marks it as aborted):
	CB_Net.REST.actionAbort(XHR);

	//Checks whether the action has been marked as aborted or not:
	if (CB_Net.REST.actionIsAborted(XHR))
	{
		CB_console("Action was marked as aborted!");
		
		//Tries to cancel the REST action abortion (if it is not too late):
		CB_Net.REST.actionAbortCancel(XHR);
	}
	else { CB_console("Action was not marked as aborted!"); }
</code></pre>
<p>
	The URL of the proxy used (if we do not avoid using it) can be defined in the <a href="api/CB_Configuration.CrossBase.html#.CB_Net_XHR_PROXY_URL" target="_blank">CB_Configuration.CrossBase.CB_Net_XHR_PROXY_URL</a> parameter. By default, it points to a proxy already provided by CrossBrowdy.
	Note that, for safety reasons, the default proxy only allows to request the URLs defined in the '$allowedURLs' array in the 'CB_proxy.config.php' file. Just edit it to allow other URLs.
</p>
<p>
	Read about the <a href="api/CB_Net.XHR.html#.callProxy" target="_blank">CB_Net.XHR.callProxy</a> function to get more information about its usage, the proxy used, how to create your own one if you want, etc.
</p>

<p>
	REST actions are highly configurable. This is an example:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Defines a REST action called "my_action_2":
	CB_Net.REST.actions["my_action_2"] = 
	{
		//URL of the REST server:
		"serverURL" : "http://URL_of_the_REST_server", //If not provided, it will use 'CB_Net.REST.SERVER_URL_DEFAULT'.

		//Route (path to the resource):
		"route" : "/whoever/whoever2?whatever3={{whatever3_wildcard}}", //If provided, it will be attached at the end of the server URL.
		
		//Function that returns an object to replace wildcards in the route:
		"routeWildcardData" : //If not provided, it will use 'CB_Net.REST.routeWildcardData_DEFAULT'.
			function(actionName, additionalData)
			{
				//Do things...
				return { "whatever3_wildcard" : "whatever3_data" }; //It must return an object to match wildcard name and wildcard value to replace.
			},
		
		//HTTP method to use:
		"method" : "GET", //If not provided, it will use 'CB_Net.REST.method_DEFAULT'.

		//Data URL to send:
		"dataURL" :  //If not provided, it will use 'CB_Net.REST.dataURL_DEFAULT'.
			function(actionName, additionalData)
			{
				//Do things...
				return "url_data1=value1&url_data2=value2"; //It must return a string which will be query parameters.
			},

		//Data to send:
		"data" : //If not provided, it will use 'CB_Net.REST.data_DEFAULT'.
			function(actionName, additionalData)
			{
				//Do things...
				var data = "dataItem3=dataItem3_value&whateverItem=whateverItem_value"; //It must return a string as query parameters or a string containing a JSON format object.
				return data;
			},
	
		//Define the headers to send:
		"headers" : //If not provided, it will use 'CB_Net.REST.headers_DEFAULT'.
			function(actionName, additionalData)
			{
				//Do things...
				return {
					"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8" //It must return an object with the headers and their value.
				};
			},
	
		//Response type expected:
		"responseType" : null, //If not provided, it will use 'CB_Net.REST.responseType_DEFAULT' (unless it is set to null).
	
		//Defines whether to avoid using proxy or not:
		"avoidProxy" : false, //If not provided, it will use 'CB_Net.REST.avoidProxy_DEFAULT'.
	
		//Defines whether to force JSON in the response from the proxy or not:
		"forceJSON" : true, //If not provided, it will use 'CB_Net.REST.forceJSON_DEFAULT' (unless it is set to null).
		
		//Defines whether to get headers from the proxy in the response or not:
		"getHeaders" : false, //If not provided, it will use 'CB_Net.REST.getHeaders_DEFAULT' (unless it is set to null).

		//Defines whether the proxy should return the headers in one dimension or not:
		"getHeadersOneDimension" : false, //If not provided, it will use 'CB_Net.REST.getHeadersOneDimension_DEFAULT' (unless it is set to null).
		
		//Defines whether the proxy should return the value of the headers in one dimension or not:
		"getHeadersOneDimensionValues" :  false, //If not provided, it will use 'CB_Net.REST.getHeadersOneDimensionValues_DEFAULT' (unless it is set to null).
		
		//Defines whether the proxy (if used) should forward the headers transparently or not:
		"transparentHeaders" : false, //If not provided, it will use 'CB_Net.REST.transparentHeaders_DEFAULT' (unless it is set to null).
		
		//Defines whether the proxy (if used) should forward the HTTP status transparently or not:
		"transparentStatus" : true, //If not provided, it will use 'CB_Net.REST.transparentStatus_DEFAULT' (unless it is set to null).
		
		//Function called before performing the REST action to decide whether to proceed or not:
		"callbackBefore" : //If not provided, it will use 'CB_Net.REST.callbackBefore_DEFAULT'.
			function(actionName, additionalData)
			{
				//Do things...
				return true; //Must return true if we want to perform the action or false otherwise.
			},
		
		//Defines the HTTP status from the response to consider it a successful call:
		"allowedSuccessStatuses" : [ 200, 201 ], //If not provided, it will use 'CB_Net.REST.allowedSuccessStatuses_DEFAULT'.
		
		//Function to call when the REST action succeeds (ignored if it was aborted on time):
		"callbackOk" : //If not provided, it will use 'CB_Net.REST.callbackOk_DEFAULT'.
			function(actionName, XHR, callbackError, additionalData)
			{
				CB_console(actionName + " REST action succeeded! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
				CB_console(CB_Net.XHR.getResponseContent(XHR)); //Shows the content received.
			},
		
		//Function to call when the REST action fails:
		"callbackError" : //If not provided, it will use 'CB_Net.REST.callbackError_DEFAULT'.
			function(actionName, XHR, additionalData)
			{
				CB_console(actionName + " REST action failed! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
			}
	};
</code></pre>

<p>
	It is also possible to redefine default options for REST actions:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Modifies the default value to use when the 'serverURL' option is not provided:
	CB_Net.REST.SERVER_URL_DEFAULT = "http://any_REST_server";

	//Modifies the default value to use when the 'routeWildcardData' option is not provided:
	CB_Net.REST.routeWildcardData_DEFAULT =
		function(actionName, additionalData)
		{
			//Do things...
			return { "wildcard1" : "value1", "wildcard2" : "value2" }; //It must return an object to match wildcard name and wildcard value to replace.
		};

	//Modifies the default value to use when the 'method' option is not provided:
	CB_Net.REST.method_DEFAULT = "PUT";
	
	//Modifies the default value to use when the 'dataURL' option is not provided:
	CB_Net.REST.dataURL_DEFAULT = 
		function(actionName, additionalData)
		{
			//Do things...
			return "url_data1=value1&url_data2=value2"; //It must return a string which will be query parameters.
		};
	
	//Modifies the default value to use when the 'data' option is not provided:
	CB_Net.REST.data_DEFAULT = 
		function(actionName, additionalData)
		{
			//Do things...
			var data = "dataItem3=dataItem3_value&whateverItem=whateverItem_value"; //It must return a string as query parameters or a string containing a JSON format object.
			return data;
		};
	
	//Modifies the default value to use when the 'headers' option is not provided:
	CB_Net.REST.headers_DEFAULT = 
		function(actionName, additionalData)
		{
			//Do things...
			return {
				"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8" //It must return an object with the headers and their value.
			};
		};

	//Modifies the default value to use when the 'responseType' option is not provided:
	CB_Net.REST.responseType_DEFAULT = "text";
	
	//Modifies the default value to use when the 'avoidProxy' option is not provided:
	CB_Net.REST.avoidProxy_DEFAULT = false;
	
	//Modifies the default value to use when the 'forceJSON' option is not provided:
	CB_Net.REST.forceJSON_DEFAULT = true;
	
	//Modifies the default value to use when the 'getHeaders' option is not provided:
	CB_Net.REST.getHeaders_DEFAULT = true;
	
	//Modifies the default value to use when the 'getHeadersOneDimension' option is not provided:
	CB_Net.REST.getHeadersOneDimension_DEFAULT = false;
	
	//Modifies the default value to use when the 'getHeadersOneDimensionValues' option is not provided:
	CB_Net.REST.getHeadersOneDimensionValues_DEFAULT = false;
	
	//Modifies the default value to use when the 'transparentHeaders' option is not provided:
	CB_Net.REST.transparentHeaders_DEFAULT = false;
	
	//Modifies the default value to use when the 'transparentStatus' option is not provided:
	CB_Net.REST.transparentStatus_DEFAULT = true;

	//Modifies the default value to use when the 'callbackBefore' option is not provided:
	CB_Net.REST.callbackBefore_DEFAULT =
		function(actionName, additionalData)
		{
			//Do things...
			return true; //Must return true if we want to perform the action or false otherwise.
		};

	//Modifies the default value to use when the 'allowedSuccessStatuses' option is not provided:
	CB_Net.REST.allowedSuccessStatuses_DEFAULT = [200, 201];
	
	//Modifies the default value to use when the 'callbackOk' option is not provided:
	CB_Net.REST.callbackOk_DEFAULT =
		function(actionName, XHR, callbackError, additionalData)
		{
			CB_console(actionName + " REST action succeeded! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
			CB_console(CB_Net.XHR.getResponseContent(XHR)); //Shows the content received.
		};
	
	//Modifies the default value to use when the 'callbackError' option is not provided:
	CB_Net.REST.callbackError_DEFAULT =
		function(actionName, XHR, additionalData)
		{
			CB_console(actionName + " REST action failed! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
		};
</code></pre>

<p>
	Finally, it is also possible to redefine permanent options for REST actions. These permanent options will always be used in each action in combination with the options defined in the action, if any, or with the default ones:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Sets a permanent "routeWildcardData" that will be used always (used after the one from the action or the default one):
	CB_Net.REST.routeWildcardData_PERMANENT =
		function(actionName, additionalData)
		{
			//Do things...
			return { "wildcard1" : "value1", "wildcard2" : "value2" }; //It must return an object to match wildcard name and wildcard value to replace.
		};

	//Sets a permanent "dataURL" that will be used always (attached before the one from the action or the default one):
	CB_Net.REST.dataURL_PERMANENT =
		function(actionName, additionalData)
		{
			//Do things...
			return "url_data1=value1&url_data2=value2"; //It must return a string which will be query parameters.
		};
	
	//Sets a permanent "data" that will be used always (used after the one from the action or the default one and attached at the beginning):
	CB_Net.REST.data_PERMANENT = 
		function(actionName, additionalData)
		{
			//Do things...
			var data = "dataItem3=dataItem3_value&whateverItem=whateverItem_value"; //It must return a string as query parameters or a string containing a JSON format object.
			return data;
		};

	//Sets a permanent "headers" that will be used always (used after the one from the action or the default one and attached at the beginning):
	CB_Net.REST.headers_PERMANENT =
		function(actionName, additionalData)
		{
			//Do things...
			return { //It must return an object with the headers and their value:
				"Cache-Control" : "no-cache",
				"Pragma" : "no-cache"
			}
		};
	
	//Sets a permanent "callbackBefore" that will be used always (used before the one from the action or the default one):
	CB_Net.REST.callbackBefore_PERMANENT =
		function(actionName, additionalData)
		{
			//Do things...
			return true; //Must return true if we want to perform the action or false otherwise.
		};
	
	//Sets a permanent "allowedSuccessStatuses" that will be used always (attached before the one from the action or the default one):
	CB_Net.REST.allowedSuccessStatuses_PERMANENT = [200, 201, 206];

	//Sets a permanent "callbackOk" that will be used always (used before the one from the action or the default one):
	CB_Net.REST.callbackOk_PERMANENT =
		function(actionName, XHR, callbackError, additionalData)
		{
			CB_console(actionName + " REST action succeeded! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
			CB_console(CB_Net.XHR.getResponseContent(XHR)); //Shows the content received.
		};
	
	//Sets a permanent "callbackError" that will be used always (used before the one from the action or the default one):
	CB_Net.REST.callbackError_PERMANENT =
		function(actionName, XHR, additionalData)
		{
			CB_console(actionName + " REST action failed! Status code is: " + CB_Net.XHR.getStatusCode(XHR));
		};
</code></pre>

<p>
	It is important to note that the name of the action and the value set in the "additionalData" parameter when calling <a href="api/CB_Net.REST.html#.actionProcess" target="_blank">CB_Net.REST.actionProcess</a> will be sent to all callbacks just in case we need it.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Net.html" target="_blank">CB_Net</a> and the <a href="api/CB_Net.REST.html" target="_blank">CB_Net.REST</a> static classes.
</p>