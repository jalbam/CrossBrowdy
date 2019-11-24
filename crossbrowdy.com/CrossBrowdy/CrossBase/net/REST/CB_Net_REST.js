/**
 * @file [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} client, services and related management. Contains the {@link CB_Net.REST} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */

if (typeof(CB_Net) === "undefined") { var CB_Net = function() { return CB_Net; }; }

/**
 * Static class to manage [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} services and related. It will return itself if it is tried to be instantiated.
 * @namespace
 * @todo Think about accepting an onAbort function as option (with also default and permanent).
 */
CB_Net.REST = function() { return CB_Net.REST; };
{
	CB_Net.REST.initialized = false; //It will tells whether the object has been initialized or not.


	/**
	 * Defines the URL for the default [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} server to use when the "serverURL" parameter is not available. Used by the {@link CB_Net.XHR.callREST} function as the default "serverURL" parameter.
	 *	@var
	 *  @type {string}
	 *  @default
	 */
	CB_Net.REST.SERVER_URL_DEFAULT = "http://localhost/CrossBrowdy/tests/net/fake_rest_server/index.php"; //CHANGE THIS!

	
	/**
	 * Default value when the "avoidProxy" parameter is not available. Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {boolean}
	 *  @default
	 */
	CB_Net.REST.avoidProxy_DEFAULT = false;
	
	
	/**
	 * Default "method" for [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} actions. Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {string}
	 *  @default
	 */
	CB_Net.REST.method_DEFAULT = "GET";

	
	/**
	 * Default "responseType" for [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} actions when it is not provided and it is not null. Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {string}
	 *  @default
	 */
	CB_Net.REST.responseType_DEFAULT = "text";

	
	/**
	 * Callback returning an object that will be used for parsing the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} route. The object returned should follow the same rules as the "JSONObject" parameter of the {@link CB_renderString} function.
	 *  @callback CB_Net.REST.actionProcess_ROUTE_WILDCARD_DATA
	 *  @param {string} actionName - The name of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed. It should be the name of an index defined in the {@link CB_Net.REST.actions} object whose value should be a {@link CB_Net.REST.actionProcess_ACTIONS} object.
	 *  @param {*} additionalData - Any additional data associated to the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed (belongs to the "additionalData" parameter used when the {@link CB_Net.REST.actionProcess} function was called).
	 *  @returns {Object|null} It should return an object containing the wildcards that will be used to parse the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} route of the action being performed. Return null in the case that we do not want to modify anything. The object returned (if any) will be used as the "JSONObject" parameter of the {@link CB_renderString} function (the first parameter will be the route which should be a string) when it is called by {@link CB_Net.REST.actionProcess} internally.
	 */

	
	/**
	 * Permanent function (must return a [JSON]{@link https://en.wikipedia.org/wiki/JSON} object or null if we do not want to modify it) to execute the same way as the "routeWildcardData" parameter (if other "routeWildcardData" are provided or set, they will be executed before this one). The function assigned by default returns null. Used by the {@link CB_Net.REST.actionProcess} function. This is permanent for each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_ROUTE_WILDCARD_DATA}
	 *  @default
	 */
	CB_Net.REST.routeWildcardData_PERMANENT =
		function(actionName, additionalData)
		{
			return null;
		};


	/**
	 * Default "routeWildcardData" for [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} actions (must be a function returning a [JSON]{@link https://en.wikipedia.org/wiki/JSON} object or null if we do not want to modify the route). The function assigned by default returns null. Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_ROUTE_WILDCARD_DATA}
	 *  @default
	 */
	CB_Net.REST.routeWildcardData_DEFAULT =
		function(actionName, additionalData)
		{
			return null;
		};


	/**
	 * Tells whether to force [JSON]{@link https://en.wikipedia.org/wiki/JSON} response by default or not. Used by the {@link CB_Net.REST.actionProcess} function when the REST action does not provided it and it is not null, as the "forceJSON" option.
	 *	@var
	 *  @type {boolean}
	 *  @default
	 */
	CB_Net.REST.forceJSON_DEFAULT = true;


	/**
	 * Tells whether get response [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} by default or not. Used by the {@link CB_Net.REST.actionProcess} function when the REST action does not provided it and it is not null, as the "getHeaders" option.
	 *	@var
	 *  @type {boolean}
	 *  @default
	 */
	CB_Net.REST.getHeaders_DEFAULT = false;

	
	/**
	 * Tells whether to get response [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} in one-dimension array by default or not (needs "getHeaders" set to true). Used by the {@link CB_Net.REST.actionProcess} function when the REST action does not provided it and it is not null, as the "getHeadersOneDimension" option.
	 *	@var
	 *  @type {boolean}
	 *  @default
	 */
	CB_Net.REST.getHeadersOneDimension_DEFAULT = false;

	
	/**
	 * Tells whether to get response [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} values in one-dimension (just one value per key) by default or not (needs "getHeaders" set to true). Used by the {@link CB_Net.REST.actionProcess} function when the REST action does not provided it and it is not null, as the "getHeadersOneDimensionValues" option.
	 *	@var
	 *  @type {boolean}
	 *  @default
	 */
	CB_Net.REST.getHeadersOneDimensionValues_DEFAULT = false;
	
	
	/**
	 * Callback returning an object containing the [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} which will be used as the "headers" parameter when the {@link CB_Net.XHR.callREST} function is called internally by {@link CB_Net.REST.actionProcess}.
	 *  @callback CB_Net.REST.actionProcess_HEADERS
	 *  @param {string} actionName - The name of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed. It should be the name of an index defined in the {@link CB_Net.REST.actions} object whose value should be a {@link CB_Net.REST.actionProcess_ACTIONS} object.
	 *  @param {*} additionalData - Any additional data associated to the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed (belongs to the "additionalData" parameter used when the {@link CB_Net.REST.actionProcess} function was called).
	 *  @returns {CB_Net.XHR.HEADERS|null} It should return an object containing the [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers}. Return null in the case that we do not want to add anything. The object returned (if any) will be used as the "headers" parameter of the {@link CB_Net.XHR.callREST} function when it is called by {@link CB_Net.REST.actionProcess} internally.
	 */
	 

	/**
	 * Permanent function (must be a function returning a {@link CB_Net.XHR.HEADERS} object with the [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers}) to execute the same way as the "headers" parameter. The function assigned by default returns { "Cache-Control" : "no-cache", "Pragma" : "no-cache" }. Used by the {@link CB_Net.REST.actionProcess} function. This is permanent for each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_HEADERS}
	 *  @default
	 */
	CB_Net.REST.headers_PERMANENT =
		function(actionName, additionalData)
		{
			return {
				"Cache-Control" : "no-cache",
				"Pragma" : "no-cache"
			}
		};


	/**
	 * Default "headers" for [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} actions (must be a function returning a {@link CB_Net.XHR.HEADERS} object with the [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers}). The function assigned by default returns { "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8" }. Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_HEADERS}
	 *  @default
	 */
	CB_Net.REST.headers_DEFAULT =
		function(actionName, additionalData)
		{
			return {
				"Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
			};
		};

		
	/**
	 * Tells whether get status transparently from the server by default or not. Used by the {@link CB_Net.REST.actionProcess} function when the REST action does not provided it and it is not null, as the "transparentStatus" option.
	 *	@var
	 *  @type {boolean}
	 *  @default
	 */
	CB_Net.REST.transparentStatus_DEFAULT = true;


	/**
	 * Tells whether get [HTTP headers]{@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers} transparently from the server by default or not. Used by the {@link CB_Net.REST.actionProcess} function when the REST action does not provided it and it is not null, as the "transparentHeaders" option.
	 *	@var
	 *  @type {boolean}
	 *  @default
	 */
	CB_Net.REST.transparentHeaders_DEFAULT = true;


	/**
	 * Callback returning a string containing the URL (GET) data which will be used as the "dataURL" parameter when the {@link CB_Net.XHR.callREST} function is called internally by {@link CB_Net.REST.actionProcess}.
	 *  @callback CB_Net.REST.actionProcess_DATA_URL
	 *  @param {string} actionName - The name of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed. It should be the name of an index defined in the {@link CB_Net.REST.actions} object whose value should be a {@link CB_Net.REST.actionProcess_ACTIONS} object.
	 *  @param {*} additionalData - Any additional data associated to the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed (belongs to the "additionalData" parameter used when the {@link CB_Net.REST.actionProcess} function was called).
	 *  @returns {string} It should return a string containing the URL (GET) data. Return an empty string in the case that we do not want to add anything. The string returned (if any) will be used as the "dataURL" parameter of the {@link CB_Net.XHR.callREST} function when it is called by {@link CB_Net.REST.actionProcess} internally.
	 */
	
	
	/**
	 * Permanent function (must return a string in URL/GET parameters format) to execute the same way as the "dataURL" parameter. The function assigned by default returns an empty string (""). Used by the {@link CB_Net.REST.actionProcess} function. The returning data will be placed in the beginning of the URL, followed by the rest of the "dataURL" desired (if any). NOTE: remember to use {@link CB_Net.URLValueEncode} if needed. This is permanent for each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_DATA_URL}
	 *  @default
	 */
	CB_Net.REST.dataURL_PERMANENT = //NOTE: remember to use CB_Net.URLValueEncode if needed.
		function(actionName, additionalData)
		{
			return "";
		};

		
	/**
	 * Default "dataURL" for [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} actions (must return a string in URL/GET parameters format). The function assigned by default returns an empty string (""). Used by the {@link CB_Net.REST.actionProcess} function. NOTE: remember to use {@link CB_Net.URLValueEncode} if needed.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_DATA_URL}
	 *  @default
	 */
	CB_Net.REST.dataURL_DEFAULT = //NOTE: remember to use CB_Net.URLValueEncode if needed.
		function(actionName, additionalData)
		{
			return "";
		};


	/**
	 * Callback returning the data (string or object) which will be used as the "data" parameter when the {@link CB_Net.XHR.callREST} function is called internally by {@link CB_Net.REST.actionProcess}. The values returned by all functions that are mean to return the data should always return the same type of data (all strinngs or all objects) since {@link CB_Net.REST.actionProcess} will use the {@link CB_combineAutomatically} function to combine them.
	 *  @callback CB_Net.REST.actionProcess_DATA
	 *  @param {string} actionName - The name of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed. It should be the name of an index defined in the {@link CB_Net.REST.actions} object whose value should be a {@link CB_Net.REST.actionProcess_ACTIONS} object.
	 *  @param {*} additionalData - Any additional data associated to the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed (belongs to the "additionalData" parameter used when the {@link CB_Net.REST.actionProcess} function was called).
	 *  @returns {string|Object} It should return a string or object containing the data. Return null or an empty string (recommended) in the case that we do not want to add anything. The value returned (if any) will be used as the "data" parameter of the {@link CB_Net.XHR.callREST} function when it is called by {@link CB_Net.REST.actionProcess} internally.
	 */
		

	/**
	 * Permanent function (must return a string in URL/GET parameters format or a [JSON]{@link https://en.wikipedia.org/wiki/JSON} format string) to execute the same way as the "data" parameter. The function assigned by default returns an empty string (""). Used by the {@link CB_Net.REST.actionProcess} function. The values returned by all functions that are mean to return the data should always return the same type of data (all strinngs or all objects) since {@link CB_Net.REST.actionProcess} will use the {@link CB_combineAutomatically} function to combine them. This is permanent for each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action. NOTE: remember to use {@link CB_Net.URLValueEncode} if needed.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_DATA}
	 *  @default
	 */
	CB_Net.REST.data_PERMANENT = //NOTE: remember to use CB_Net.URLValueEncode if needed.
		function(actionName, additionalData)
		{
			return "";
		};

		
	/**
	 * Default "data" for [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} actions (must return a string in URL/GET parameters format or a [JSON]{@link https://en.wikipedia.org/wiki/JSON} format string). The function assigned by default returns an empty string (""). Used by the {@link CB_Net.REST.actionProcess} function. The values returned by all functions that are mean to return the data should always return the same type of data (all strinngs or all objects) since {@link CB_Net.REST.actionProcess} will use the {@link CB_combineAutomatically} function to combine them. NOTE: remember to use {@link CB_Net.URLValueEncode} if needed.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_DATA}
	 *  @default
	 */
	CB_Net.REST.data_DEFAULT = //NOTE: remember to use CB_Net.URLValueEncode if needed.
		function(actionName, additionalData)
		{
			return "";
		};


	/**
	 * Permanent values for the "allowedSuccessStatuses" parameter, containing the statuses to considerer a successful [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action (must be a numeric array of integers). Used by the {@link CB_Net.REST.actionProcess} function. This is permanent for each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *	@var
	 *  @type {array}
	 *  @default
	 */
	CB_Net.REST.allowedSuccessStatuses_PERMANENT = [];

		
	/**
	 * Default "allowedSuccessStatuses", containing the statuses to considerer a successful [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action (must be a numeric array of integers). Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {array}
	 *  @default
	 */
	CB_Net.REST.allowedSuccessStatuses_DEFAULT = [200, 201, 206];


	/**
	 * Callback that will be run before performing a [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action and must return a boolean defining whether we want to continue performing the action (returning true) or not (returning false).
	 *  @callback CB_Net.REST.actionProcess_CALLBACK_BEFORE
	 *  @param {string} actionName - The name of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed. It should be the name of an index defined in the {@link CB_Net.REST.actions} object whose value should be a {@link CB_Net.REST.actionProcess_ACTIONS} object.
	 *  @param {*} additionalData - Any additional data associated to the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed (belongs to the "additionalData" parameter used when the {@link CB_Net.REST.actionProcess} function was called).
	 *  @returns {boolean} It should return true in the case that we want to continue performing the current [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action or false otherwise.
	 */

	
	/**
	 * Permanent callback function before performing each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action returning a boolean (to decide whether to do it or not). Executed before the default or the set "callbackBefore" function (if any). The function assigned by default returns true. Used by the {@link CB_Net.REST.actionProcess} function. This is permanent for each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_CALLBACK_BEFORE}
	 *  @default
	 */
	CB_Net.REST.callbackBefore_PERMANENT =
		function(actionName, additionalData)
		{
			return true; //Must return true if we want to perform the action.
		};
		
		
	/**
	 * Default "callbackBefore", containing a callback function before performing each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action returning a boolean (to decide whether to do it or not). The function assigned by default returns true. Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_CALLBACK_BEFORE}
	 *  @default
	 */
	CB_Net.REST.callbackBefore_DEFAULT =
		function(actionName, additionalData)
		{
			return true; //Must return true if we want to perform the action.
		};

		
		
	/**
	 * Callback that will be run when the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action has been performed successfully.
	 *  @callback CB_Net.REST.actionProcess_CALLBACK_OK
	 *  @param {string} actionName - The name of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed. It should be the name of an index defined in the {@link CB_Net.REST.actions} object whose value should be a {@link CB_Net.REST.actionProcess_ACTIONS} object.
	 *  @param {Object} [XHR] - The [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} object that has been used to perform the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *  @param {CB_Net.REST.actionProcess_CALLBACK_ERROR} callbackError - The error callback function associated to the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed, just in case we want to call it.
	 *  @param {*} additionalData - Any additional data associated to the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed (belongs to the "additionalData" parameter used when the {@link CB_Net.REST.actionProcess} function was called).
	 */
		
		
	/**
	 * Permanent callback function when each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action has been successful. Used by the {@link CB_Net.REST.actionProcess} function. Executed before the default or the set "callbackOk" function (if any). This is permanent for each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_CALLBACK_OK}
	 *  @default
	 */
	CB_Net.REST.callbackOk_PERMANENT =
		function(actionName, XHR, callbackError, additionalData)
		{
			//Do things here.
		};
		

	/**
	 * Default "callbackOk", containing a callback function when the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action has been successful. Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_CALLBACK_OK}
	 *  @default
	 */
	CB_Net.REST.callbackOk_DEFAULT =
		function(actionName, XHR, callbackError, additionalData)
		{
			//Do things here.
		};


	/**
	 * Callback that will be run when the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action has been performed successfully.
	 *  @callback CB_Net.REST.actionProcess_CALLBACK_ERROR
	 *  @param {string} actionName - The name of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed. It should be the name of an index defined in the {@link CB_Net.REST.actions} object whose value should be a {@link CB_Net.REST.actionProcess_ACTIONS} object.
	 *  @param {Object} [XHR] - The [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} object that has been used to perform the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *  @param {*} additionalData - Any additional data associated to the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed (belongs to the "additionalData" parameter used when the {@link CB_Net.REST.actionProcess} function was called).
	 */

		
	/**
	 * Permanent callback function when an error happens processing any [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action. Used by the {@link CB_Net.REST.actionProcess} function. Executed before the default or the set "callbackError" function (if any). This is permanent for each [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_CALLBACK_ERROR}
	 *  @default
	 */
	CB_Net.REST.callbackError_PERMANENT =
		function(actionName, XHR, additionalData)
		{
			//Do things here.
		};
		
		
	/**
	 * Default "callbackError", containing a callback function when an error happens processing the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action. Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {CB_Net.REST.actionProcess_CALLBACK_ERROR}
	 *  @default
	 */
	CB_Net.REST.callbackError_DEFAULT =
		function(actionName, XHR, additionalData)
		{
			//Do things here.
		};

		
	/**
	 * Object that represents a [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action.
	 *  @memberof CB_Net.REST
	 *  @typedef {Object} CB_Net.REST.actionProcess_ACTIONS
	 *  @property {string} route - The [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} route (path). Belongs to the "route" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally. It is mandatory.
	 *  @property {CB_Net.REST.actionProcess_CALLBACK_BEFORE} [callbackBefore={@link CB_Net.REST.callbackBefore_DEFAULT}] - Callback run before performing the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action which will decide whether to continue with it or not.
	 *  @property {boolean} [avoidProxy={@link CB_Net.REST.avoidProxy_DEFAULT}] - Belongs to the "avoidProxy" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally.
	 *  @property {CB_Net.REST.actionProcess_ROUTE_WILDCARD_DATA} [routeWildcardData={@link CB_Net.REST.routeWildcardData_DEFAULT}] - Callback returning an object that will be used for parsing the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} route. The object returned should follow the same rules as the "JSONObject" parameter of the {@link CB_renderString} function.
	 *  @property {CB_Net.REST.actionProcess_DATA_URL} [dataURL={@link CB_Net.REST.dataURL_DEFAULT}] - Belongs to the "dataURL" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally.
	 *  @property {CB_Net.REST.actionProcess_DATA} [data={@link CB_Net.REST.data_DEFAULT}] - Belongs to the "data" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally.
	 *  @property {CB_Net.REST.actionProcess_HEADERS} [headers={@link CB_Net.REST.headers_DEFAULT}] - Belongs to the "headers" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally.
	 *  @property {array} [allowedSuccessStatuses={@link CB_Net.REST.allowedSuccessStatuses_DEFAULT}] - Belongs to the "allowedSuccessStatuses" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally.
	 *  @property {CB_Net.REST.actionProcess_CALLBACK_ERROR} [callbackError={@link CB_Net.REST.callbackError_DEFAULT}] - Callback run when the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action has not been performed successfully.
	 *  @property {CB_Net.REST.actionProcess_CALLBACK_OK} [callbackOk={@link CB_Net.REST.callbackOk_DEFAULT}] - Callback run when the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action has been performed successfully.
	 *  @property {string} [serverURL={@link CB_Net.REST.SERVER_URL_DEFAULT}] - Belongs to the "serverURL" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally.
	 *  @property {string} [method={@link CB_Net.REST.method_DEFAULT}] - Belongs to the "method" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally.
	 *  @property {string} [responseType={@link CB_Net.REST.responseType_DEFAULT}] - Belongs to the "responseType" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally and will be sent even it is null. If it is undefined, it will use the value of {@link CB_Net.REST.responseType_DEFAULT} instead.
	 *  @property {boolean} [forceJSON={@link CB_Net.REST.forceJSON_DEFAULT}] - Belongs to the "forceJSON" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally and will be sent even it is null. If it is undefined, it will use the value of {@link CB_Net.REST.forceJSON_DEFAULT} instead.
	 *  @property {boolean} [getHeaders={@link CB_Net.REST.getHeaders_DEFAULT}] - Belongs to the "getHeaders" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally and will be sent even it is null. If it is undefined, it will use the value of {@link CB_Net.REST.getHeaders_DEFAULT} instead.
	 *  @property {boolean} [getHeadersOneDimension={@link CB_Net.REST.getHeadersOneDimension_DEFAULT}] - Belongs to the "getHeadersOneDimension" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally and will be sent even it is null. If it is undefined, it will use the value of {@link CB_Net.REST.getHeadersOneDimension_DEFAULT} instead.
	 *  @property {boolean} [getHeadersOneDimensionValues={@link CB_Net.REST.getHeadersOneDimensionValues_DEFAULT}] - Belongs to the "getHeadersOneDimensionValues" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally and will be sent even it is null. If it is undefined, it will use the value of {@link CB_Net.REST.getHeadersOneDimensionValues_DEFAULT} instead.
	 *  @property {boolean} [transparentStatus={@link CB_Net.REST.transparentStatus_DEFAULT}] - Belongs to the "transparentStatus" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally and will be sent even it is null. If it is undefined, it will use the value of {@link CB_Net.REST.transparentStatus_DEFAULT} instead.
	 *  @property {boolean} [transparentHeaders={@link CB_Net.REST.transparentHeaders_DEFAULT}] - Belongs to the "transparentHeaders" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally and will be sent even it is null. If it is undefined, it will use the value of {@link CB_Net.REST.transparentHeaders_DEFAULT} instead.
	 */

	 
	/**
	 * List of [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} actions. Each property name is the name of the action and its value is a {@link CB_Net.REST.actionProcess_ACTIONS} object. Used by the {@link CB_Net.REST.actionProcess} function.
	 *	@var
	 *  @type {Object}
	 *  @default
	 */
	CB_Net.REST.actions = {}; //Read the documentation to know how to add new REST actions.

	
	
	//Initializes all values:
	CB_Net.REST.init = function()
	{
		if (CB_Net.REST.initialized) { return CB_Net.REST; }

		//The object has been initialized:
		CB_Net.REST.initialized = true;
		
		//TODO.

		return CB_Net.REST;
	}

	
	/**
	 * Processes a desired [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action (which must be previously defined in the {@link CB_Net.REST.actions} object) by its name.
	 *  @function
	 *  @param {string} actionName - The name of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action that we want to perform. It should be the name of an index defined in the {@link CB_Net.REST.actions} object whose value should be a {@link CB_Net.REST.actionProcess_ACTIONS} object.
	 *  @param {*} [additionalData] - Any additional data desired. It will be passed as a parameter when different callbacks are called internally, as their "additionalData" parameter.
	 *  @param {Object} [XHR] - Used for the "XHR" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally.
	 *  @param {string} [serverURL] - Used for the "serverURL" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally. If provided, the value defined in the "serverURL" parameter of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed (if any) will be ignored.
	 *  @param {boolean} [avoidProxy] - Used for the "avoidProxy" parameter of the {@link CB_Net.XHR.callREST} function when it is called internally. If provided, the value defined in the "avoidProxy" parameter of the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action being performed (if any) and the default one defined in {@link CB_Net.REST.avoidProxy_DEFAULT} (if any) will be both ignored.
	 *  @returns {Object|null} Returns null if the {@link CB_Net.XHR.callREST} function is not called at all (because [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} is not supported or the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action object cannot be found or the route is not well defined or the "callbackBefore" returns false, etc.). Otherwise, returns the same that the {@link CB_Net.XHR.callREST} function returns (called internally).
	 */
	CB_Net.REST.actionProcess = function(actionName, additionalData, XHR, serverURL, avoidProxy)
	{
		if (!CB_Net.XHR.supported()) { return null; }
		
		if (typeof(CB_Net.REST.actions[actionName]) === "undefined" || CB_Net.REST.actions[actionName] === null) { return null; }
		else if (typeof(CB_Net.REST.actions[actionName]["route"]) === "undefined" || CB_Net.REST.actions[actionName]["route"] === null) { return null; }
		
		//Performs the previous callback (if any):
		var callbackBeforeReturn = typeof(CB_Net.REST.callbackBefore_PERMANENT === "function") ? CB_Net.REST.callbackBefore_PERMANENT(actionName, additionalData) : null;
		if (callbackBeforeReturn !== false)
		{
			if (typeof(CB_Net.REST.actions[actionName]["callbackBefore"]) === "function") { callbackBeforeReturn = CB_Net.REST.actions[actionName]["callbackBefore"](actionName, additionalData); }
			else if (typeof(CB_Net.REST.actions[actionName]["callbackBefore"]) === "undefined" && typeof(CB_Net.REST.callbackBefore_DEFAULT) === "function") { callbackBeforeReturn = CB_Net.REST.callbackBefore_DEFAULT(actionName, additionalData); }
		}
		if (callbackBeforeReturn === false) { return null; } //If we do not want to perform the action, exists and returns NULL.
		
		serverURL = CB_trim(serverURL);
		if (serverURL === "" && typeof(CB_Net.REST.actions[actionName]["serverURL"]) !== "undefined" && CB_isString(CB_Net.REST.actions[actionName]["serverURL"]))
		{
			serverURL = CB_trim(CB_Net.REST.actions[actionName]["serverURL"]);
		}
		
		if (avoidProxy !== true && avoidProxy !== false)
		{
			if (typeof(CB_Net.REST.actions[actionName]["avoidProxy"]) !== "undefined" && (CB_Net.REST.actions[actionName]["avoidProxy"] === true || CB_Net.REST.actions[actionName]["avoidProxy"] === false)) { avoidProxy = CB_Net.REST.actions[actionName]["avoidProxy"]; }
			else if (typeof(CB_Net.REST.avoidProxy_DEFAULT) !== "undefined" && (CB_Net.REST.avoidProxy_DEFAULT === true || CB_Net.REST.avoidProxy_DEFAULT === false)) { avoidProxy = CB_Net.REST.avoidProxy_DEFAULT; }
		}
		
		var route = CB_Net.REST.actions[actionName]["route"];
		var wildcardData = null;
		if (typeof(CB_Net.REST.actions[actionName]["routeWildcardData"]) === "function")
		{
			wildcardData = CB_Net.REST.actions[actionName]["routeWildcardData"](actionName, additionalData);
		}
		else if (typeof(CB_Net.REST.actions[actionName]["routeWildcardData"]) === "undefined" && typeof(CB_Net.REST.routeWildcardData_DEFAULT) === "function")
		{
			wildcardData = CB_Net.REST.routeWildcardData_DEFAULT(actionName, additionalData);
		}
		wildcardData = CB_combineAutomatically(CB_Net.REST.routeWildcardData_PERMANENT(actionName, additionalData), wildcardData, false);
		if (wildcardData !== null) { route = CB_renderString(CB_Net.REST.actions[actionName]["route"], wildcardData); }
		
		//Gets the data for URL (GET):
		var dataURL = "";
		if (typeof(CB_Net.REST.actions[actionName]["dataURL"]) === "function")
		{
			dataURL = CB_Net.REST.actions[actionName]["dataURL"](actionName, additionalData);
		}
		else if (typeof(CB_Net.REST.actions[actionName]["dataURL"]) === "undefined" && typeof(CB_Net.REST.dataURL_DEFAULT) === "function")
		{
			dataURL = CB_Net.REST.dataURL_DEFAULT(actionName, additionalData);
		}
		dataURL = CB_trim(CB_trim(dataURL), ["?", "&", " "]);
		var dataURLPermanent = CB_Net.REST.dataURL_PERMANENT(actionName, additionalData);
		dataURLPermanent = CB_trim(CB_trim(dataURLPermanent), ["?", "&", " "]);
		if (dataURLPermanent !== "") { dataURL = CB_combineAutomatically(dataURLPermanent, dataURL, false); }
		
		//Defines the data:
		var data = "";
		if (typeof(CB_Net.REST.actions[actionName]["data"]) === "function")
		{
			data = CB_Net.REST.actions[actionName]["data"](actionName, additionalData);
		}
		else if (typeof(CB_Net.REST.actions[actionName]["data"]) === "undefined" && typeof(CB_Net.REST.data_DEFAULT) === "function")
		{
			data = CB_Net.REST.data_DEFAULT(actionName, additionalData);
		}
		data = CB_combineAutomatically(CB_Net.REST.data_PERMANENT(actionName, additionalData), data, false);
		
		//Defines the headers:
		var headers = null;
		if (typeof(CB_Net.REST.actions[actionName]["headers"]) === "function")
		{
			headers = CB_Net.REST.actions[actionName]["headers"](actionName, additionalData);
		}
		else if (typeof(CB_Net.REST.actions[actionName]["headers"]) === "undefined" && typeof(CB_Net.REST.headers_DEFAULT) === "function")
		{
			headers = CB_Net.REST.headers_DEFAULT(actionName, additionalData);
		}
		headers = CB_combineAutomatically(CB_Net.REST.headers_PERMANENT(actionName, additionalData), headers, false);
		
		//Defines the allowed statuses considered as successful:
		var allowedSuccessStatuses = CB_Net.REST.allowedSuccessStatuses_DEFAULT;
		if (typeof(CB_Net.REST.actions[actionName]["allowedSuccessStatuses"]) !== "undefined")
		{
			allowedSuccessStatuses = CB_Net.REST.actions[actionName]["allowedSuccessStatuses"];
		}
		allowedSuccessStatuses = CB_combineAutomatically(CB_Net.REST.allowedSuccessStatuses_PERMANENT, allowedSuccessStatuses, true);
		
		//Defines the callback functions:
		var callbackError = 
			function(actionName, XHRObject, additionalData)
			{
				if (typeof(CB_Net.REST.callbackError_PERMANENT) === "function") { CB_Net.REST.callbackError_PERMANENT(actionName, XHRObject, additionalData); }
				if (typeof(CB_Net.REST.actions[actionName]["callbackError"]) === "function")
				{
					CB_Net.REST.actions[actionName]["callbackError"](actionName, XHRObject, additionalData);
				}
				else if (typeof(CB_Net.REST.actions[actionName]["callbackError"]) === "undefined" && typeof(CB_Net.REST.callbackError_DEFAULT) === "function")
				{
					CB_Net.REST.callbackError_DEFAULT(actionName, XHRObject, additionalData);
				}
			};

		var callbackErrorWrapper =
			function(XHRObject)
			{
				if (typeof(callbackError) === "function") { callbackError(actionName, XHRObject, additionalData); }
			};
			
		var callbackOkWrapper =
			function(XHRObject)
			{
				if (CB_Net.REST.actionIsAborted(XHRObject)) { return; }
				if (typeof(CB_Net.REST.callbackOk_PERMANENT) === "function") { CB_Net.REST.callbackOk_PERMANENT(actionName, XHRObject, callbackError, additionalData); }
				if (typeof(CB_Net.REST.actions[actionName]["callbackOk"]) === "function")
				{
					CB_Net.REST.actions[actionName]["callbackOk"](actionName, XHRObject, callbackError, additionalData);
				}
				else if (typeof(CB_Net.REST.actions[actionName]["callbackOk"]) === "undefined" && typeof(CB_Net.REST.callbackOk_DEFAULT) === "function")
				{
					CB_Net.REST.callbackOk_DEFAULT(actionName, XHRObject, callbackError, additionalData);
				}
			};
		
		//Calls the REST server:
		return CB_Net.XHR.callREST
		(
			//typeof(CB_Net.REST.actions[actionName]["serverURL"]) !== "undefined" && CB_isString(CB_Net.REST.actions[actionName]["serverURL"]) && CB_trim(CB_Net.REST.actions[actionName]["serverURL"]) !== "" ? CB_trim(CB_Net.REST.actions[actionName]["serverURL"]) : serverURL, //serverURL
			serverURL, //serverURL
			route, //route
			dataURL, //dataURL
			typeof(CB_Net.REST.actions[actionName]["method"]) !== "undefined" && CB_isString(CB_Net.REST.actions[actionName]["method"]) && CB_trim(CB_Net.REST.actions[actionName]["method"]) !== "" ? CB_trim(CB_Net.REST.actions[actionName]["method"]) : CB_Net.REST.method_DEFAULT, //method
			data, //data
			headers, //headers
			typeof(CB_Net.REST.actions[actionName]["responseType"]) !== "undefined" ? CB_Net.REST.actions[actionName]["responseType"] : CB_Net.REST.responseType_DEFAULT, //responseType
			avoidProxy, //avoidProxy
			typeof(CB_Net.REST.actions[actionName]["forceJSON"]) !== "undefined" ? CB_Net.REST.actions[actionName]["forceJSON"] : CB_Net.REST.forceJSON_DEFAULT, //forceJSON
			typeof(CB_Net.REST.actions[actionName]["getHeaders"]) !== "undefined" ? CB_Net.REST.actions[actionName]["getHeaders"] : CB_Net.REST.getHeaders_DEFAULT, //getHeaders
			typeof(CB_Net.REST.actions[actionName]["getHeadersOneDimension"]) !== "undefined" ? CB_Net.REST.actions[actionName]["getHeadersOneDimension"] : CB_Net.REST.getHeadersOneDimension_DEFAULT, //headersForceOneDimension
			typeof(CB_Net.REST.actions[actionName]["getHeadersOneDimensionValues"]) !== "undefined" ? CB_Net.REST.actions[actionName]["getHeadersOneDimensionValues"] : CB_Net.REST.getHeadersOneDimensionValues_DEFAULT, //headersForceOneDimensionValues
			typeof(CB_Net.REST.actions[actionName]["transparentStatus"]) !== "undefined" ? CB_Net.REST.actions[actionName]["transparentStatus"] : CB_Net.REST.transparentStatus_DEFAULT, //transparentStatus
			typeof(CB_Net.REST.actions[actionName]["transparentHeaders"]) !== "undefined" ? CB_Net.REST.actions[actionName]["transparentHeaders"] : CB_Net.REST.transparentHeaders_DEFAULT, //transparentHeaders
			callbackOkWrapper, //callbackOk
			callbackErrorWrapper, //callbackError
			allowedSuccessStatuses, //allowedSuccessStatuses
			XHR //XHR
		);
	}



	/**
	 * Cancels a [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action (by its [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)}/[XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} request associated) by executing the "abort" method of the given [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} object (if available) and sets its "aborted" property to true if succeeds. When a [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action is aborted, the callbackOk functions associated (if any) will not be called (unless they have been called already).
	 *  @function
	 *  @param {Object} XHR - The [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} object that we want to abort.
	 *  @returns {boolean} Returns true if the "abort" method of the given [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} object could be called and the "aborted" property was set to true. Otherwise, returns false.
	 */
	CB_Net.REST.actionAbort = function(XHR)
	{
		if (typeof(XHR) === "object" && XHR !== null && typeof(XHR.abort) === "function") { XHR.abort(); XHR.aborted = true; return true; }
		return false;
	}


	/**
	 * Tries to revert the abortion of a [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action (by its [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)}/[XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} request associated) by setting the "aborted" property of the given [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} object to false. If this function is called before the "callbackOk" functions associated to the [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action (if any) are called, they could finally be called perhaps (depending on each case, could be different). Have in mind that, after calling {@link CB_Net.REST.actionAbort}, the "abort" method of the [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} object was probably called already (if available).
	 *  @function
	 *  @param {Object} XHR - The [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} object whose abortion we want to cancel.
	 *  @returns {boolean} Returns true if the "aborted" property was set to false. Otherwise, returns false.
	 */
	CB_Net.REST.actionAbortCancel = function(XHR)
	{
		if (typeof(XHR) === "object" && XHR !== null) { XHR.aborted = false; return true; }
		return false;
	}


	/**
	 * Returns whether a [REST]{@link https://en.wikipedia.org/wiki/Representational_state_transfer} action is aborted or not (by its [AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)}/[XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} request associated).
	 *  @function
	 *  @param {Object} XHR - The [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} object that we want to check.
	 *  @returns {boolean} Returns true if the "aborted" property is set to true. Otherwise, returns false.
	 */
	CB_Net.REST.actionIsAborted = function(XHR)
	{
		return (typeof(XHR) === "object" && XHR !== null && XHR.aborted === true);
	}
}