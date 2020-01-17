/**
 * @file Sockets and related management. Contains the {@link CB_Net.Sockets} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */
 

if (typeof(CB_Net) === "undefined") { var CB_Net = function() { return CB_Net; }; }

/**
 * Static class to manage sockets and related. It will return itself if it is tried to be instantiated. It uses [SockJS-client]{@link https://github.com/sockjs/sockjs-client}.
 * @namespace
 */
CB_Net.Sockets = function() { return CB_Net.Sockets; };
{
	CB_Net.Sockets.initialized = false; //It will tells whether the object has been initialized or not.

	/**
	  Property that contains the functions and properties related with the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library.
	  * @namespace CB_Net.Sockets.SockJS
	 */
	CB_Net.Sockets.SockJS = {}; //Keeps the methods and properties related to SockJS library.

	/**
	 * Keeps the last SockJS created.
	 *	@var
	 *  @readonly
	 *  @type {Object|null}
	 *  @default
	 */
	CB_Net.Sockets.SockJS.websocketLast = null; //Keeps the last websocket object.
	
	
	//Initializes all values:
	CB_Net.Sockets.init = function()
	{
		if (CB_Net.Sockets.initialized) { return CB_Net.Sockets; }

		//The object has been initialized:
		CB_Net.Sockets.initialized = true;

		//TODO.

		return CB_Net.Sockets;
	}

	
	/**
	 * Alias for {@link CB_Net.Sockets.SockJS.listen}.
	 *  @function CB_Net.Sockets.SockJS.open
	 *  @see {@link CB_Net.Sockets.SockJS.listen}
	 */
	/**
	 * Creates the websockets object and sets the listeners. Using the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library internally.
	 *  @function
	 *  @param {string} serverURL - The URL of the SockJS server. This will be used as the first parameter when it calls the constructor of SockJS internally. Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation (the parameter is called "url").
	 *  @param {function} [onOpen] - Function for the event "onopen" used by the SockJS object. Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation.
	 *  @param {function} [onClose] - Function for the event "onclose" used by the SockJS object. Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation.
	 *  @param {function} [onMessage] - Function for the event "onmessage" used by the SockJS object. Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation.
	 *  @param {function} [onError] - Function for the event "onerror" used by the SockJS object. Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation.
	 *  @param {Object} [options] - The desired options for the SockJS object. This will be used as the third parameter when it calls the constructor of SockJS internally. Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation (the parameter is called "options").
	 *  @param {array} [protocols] - This will be used as the second parameter when it calls the constructor of SockJS internally. Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation (the parameter is called "_reserved").
	 *  @returns {Object|null} Returns a SockJS object. Read the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation for more information. In the case of error, returns null.
	 */
	CB_Net.Sockets.SockJS.listen = function(serverURL, onOpen, onClose, onMessage, onError, options, protocols)
	{
		try
		{
			var websocket = new SockJS(serverURL, protocols || undefined, options || undefined); //Creates the SockJS object.
			
			if (typeof(websocket) === "undefined" || websocket === null)
			{
				if (typeof(onError) === "function") { onError({ "error" : "CANNOT OPEN THE CONNECTION TO " + serverURL }); }
				return null;
			}
			
			if (typeof(onOpen) === "function") { websocket.onopen = onOpen; } //Example: function webSocketsOnOpen(evt) { CB_console(websocket.transport); }
			if (typeof(onClose) === "function") { websocket.onclose = onClose; } //Example: function webSocketsOnClose(evt) { CB_console("Websocket closed. Reason: " + evt.reason); }
			if (typeof(onMessage) === "function") { websocket.onmessage = onMessage; } //Example: function webSocketsOnMessage(evt) { CB_console(evt.data); }
			if (typeof(onError) === "function") { websocket.onerror = onError; } //Example: function webSocketsOnError(evt) { CB_console("Websocket error: " + JSON.stringify(evt)); }

			CB_Net.Sockets.SockJS.websocketLast = websocket; //Stores the object as the last one.
			
			return websocket;
		}
		catch(E)
		{
			if (typeof(onError) === "function") { onError({ "error" : "ERROR CALLING 'listen': " + E }); }
			return null;
		}
	}

	
	/**
	 * Sends a websockets message. Using the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library internally.
	 *  @function
	 *  @param {string} message - The message that we want to send. This will be used as the first and unique parameter when it calls the "send" function of the SockJS object internally. Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation.
	 *  @param {function} [websocket={@link CB_Net.Sockets.SockJS.websocketLast}] - The SockJS object that we want to use. If not provided, it will try to use the last one created (if any) which is stored in {@link CB_Net.Sockets.SockJS.websocketLast}.
	 *  @param {function} [onError] - Function for the event "onerror" used by the SockJS object. If provided, it will replace the previous one (if any). Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation.
	 *  @returns {undefined|false} Returns undefined (the same as the "send" function of the SockJS object) if the SockJS has been used or false otherwise.
	 */
	CB_Net.Sockets.SockJS.send = function(message, websocket, onError)
	{
		websocket = websocket || CB_Net.Sockets.SockJS.websocketLast;
		if (typeof(websocket) !== "undefined" && websocket !== null && typeof(websocket.send) === "function")
		{
			if (typeof(onError) === "function") { websocket.onerror = onError; } //Example: function webSocketsOnError(evt) { CB_console("Websocket error: " + JSON.stringify(evt)); }
			var returnValue = false;
			try
			{
				returnValue = websocket.send(message);
			}
			catch(E)
			{
				if (typeof(onError) === "function") { onError({ "error" : "ERROR CALLING 'send': " + E }); }
				returnValue = false;
			}
			return returnValue;
		}
		else
		{
			if (typeof(onError) === "function") { onError({ "error" : "CANNOT FIND WEBSOCKETS OBJECT" }); }
			return false;
		}
	}

	
	/**
	 * Tries to close the websockets connection. Using the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library internally.
	 *  @function
	 *  @param {function} [websocket={@link CB_Net.Sockets.SockJS.websocketLast}] - The SockJS object that we want to use. If not provided, it will try to use the last one created (if any) which is stored in {@link CB_Net.Sockets.SockJS.websocketLast}.
	 *  @param {function} [onError] - Function for the event "onerror" used by the SockJS object. If provided, it will replace the previous one (if any). Following the same rules as in the [SockJS client]{@link https://github.com/sockjs/sockjs-client} library documentation.
	 *  @returns {undefined|false} Returns undefined (the same as the "close" function of the SockJS object) if the SockJS has been used or false otherwise.
	 */
	CB_Net.Sockets.SockJS.close = function(websocket, onError)
	{
		websocket = websocket || CB_Net.Sockets.SockJS.websocketLast;
		if (typeof(websocket) !== "undefined" && websocket !== null && typeof(websocket.close) === "function")
		{
			if (typeof(onError) === "function") { websocket.onerror = onError; } //Example: function webSocketsOnError(evt) { CB_console("Websocket error: " + JSON.stringify(evt)); }
			var returnValue = false;
			try
			{
				returnValue = websocket.close();
				if (websocket === CB_Net.Sockets.SockJS.websocketLast) { CB_Net.Sockets.SockJS.websocketLast = null; }
			}
			catch(E)
			{
				if (typeof(onError) === "function") { onError({ "error" : "ERROR CALLING 'close': " + E }); }
				returnValue = false;
			}
			return returnValue;
		}
		else
		{
			if (typeof(onError) === "function") { onError({ "error" : "CANNOT FIND WEBSOCKETS OBJECT" }); }
			return false;
		}
	}
	
}