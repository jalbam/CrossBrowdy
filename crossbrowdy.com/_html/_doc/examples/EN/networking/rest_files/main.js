/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Defines a REST action called "my_action":
	CB_Net.REST.actions["my_action"] =
	{
		//URL of the REST server:
		"serverURL" : "https://crossbrowdy.com", //If not provided, it will use 'CB_Net.REST.SERVER_URL_DEFAULT'.

		//Route (path to the resource):
		"route" : "/guides?whatever3=whatever3_data", //If provided, it will be attached at the end of the server URL.

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


	//Defines a REST action called "my_action_2":
	CB_Net.REST.actions["my_action_2"] =
	{
		//URL of the REST server:
		"serverURL" : "https://crossbrowdy.com", //If not provided, it will use 'CB_Net.REST.SERVER_URL_DEFAULT'.

		//Route (path to the resource):
		"route" : "/download?whatever3={{whatever3_wildcard}}", //If provided, it will be attached at the end of the server URL.

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
		"forceJSON" : false, //If not provided, it will use 'CB_Net.REST.forceJSON_DEFAULT' (unless it is set to null).

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
	

	//Sets a permanent "callbackOk" that will be used always (used before the one from the action or the default one):
	CB_Net.REST.callbackBefore_PERMANENT =
		function(actionName, XHR, callbackError, additionalData)
		{
			CB_Elements.insertContentById(actionName + "_response", "Loading...");
		};
	
	//Sets a permanent "callbackOk" that will be used always (used before the one from the action or the default one):
	CB_Net.REST.callbackOk_PERMANENT =
		function(actionName, XHR, callbackError, additionalData)
		{
			CB_Elements.insertContentById(actionName + "_response", "[OK] [status=" + CB_Net.XHR.getStatusCode(XHR) + "] Response: " + escapeHTML(CB_Net.XHR.getResponseContent(XHR)));
		};

	//Sets a permanent "callbackError" that will be used always (used before the one from the action or the default one):
	CB_Net.REST.callbackError_PERMANENT =
		function(actionName, XHR, additionalData)
		{
			CB_Elements.insertContentById(actionName + "_response", "[ERROR] [status=" + CB_Net.XHR.getStatusCode(XHR) + "] Response: " + escapeHTML(CB_Net.XHR.getResponseContent(XHR)));
		};
}


//Performs the desired REST action:
var XHRs = { "my_action" : null, "my_action_2" : null }; //It will store the used XHR objects.
function call(actionName)
{
	//If it was aborted, tries to cancel the REST action abortion:
	if (CB_Net.REST.actionIsAborted(XHRs[actionName]))
	{
		CB_console("XHR for the " + actionName + " action was aborted. Tries to cancel abortion...");
		CB_Net.REST.actionAbortCancel(XHRs[actionName]);
	}

	//Performs the REST action through the default proxy server (defined in 'CB_Configuration.CrossBase.CB_Net_XHR_PROXY_URL'):
	var additionalData = {"additional_data" : "whatever"};
	XHRs[actionName] = CB_Net.REST.actionProcess(actionName, additionalData, XHRs[actionName]); //It also sends additional data (this is optional) that will be useful for all the callbacks.
}


//Aborts the given XHR call:
function abort(actionName)
{
	XHR = XHRs[actionName];
	if (!XHR) { CB_console("XHR not available! Cannot be aborted."); }
	
	//Aborts the REST action (marks it as aborted):
	CB_Net.REST.actionAbort(XHR);
	
	//Checks whether the action has been marked as aborted or not:
	if (CB_Net.REST.actionIsAborted(XHR))
	{
		CB_console("Action was marked as aborted!");
		CB_Elements.appendContentByIdBeginning(actionName + "_response", "[ABORTED] "); //Appends the text at the beginning of its content.
		//CB_Elements.insertContentById(actionName + "_response", "[ABORTED] " + CB_Elements.id(actionName + "_response").innerHTML);
		
	}
	else { CB_console("Action was not marked as aborted!"); }
}


//Escapes HTML code (just a little):
function escapeHTML(code)
{
	return (code + "").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}