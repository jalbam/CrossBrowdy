<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here is an example of WebSockets management (through the <a href="https://github.com/sockjs/sockjs-client" target="_blank">SockJS client library</a>):
</p>
<pre><code class="language-javascript">
	//Tries to starts a connection to the WebSockets (SockJS) server:
	var websocket = CB_Net.Sockets.SockJS.listen
	(
		//Defines the server address:
		"http://WebSockets_server_URL:port/example",
		
		//Defines the handler for the "onOpen" event (optional):
		function webSocketsOnOpen(evt)
		{
			CB_console("The 'onOpen' event was fired!");
			CB_console(websocket.transport); //Shows the "transport".
		},
		
		//Defines the handler for the "onClose" event (optional):
		function webSocketsOnClose(evt)
		{
			CB_console("The 'onClose' event was fired! Reason: " + evt.reason);
		},
		
		//Defines the handler for the "onMessage" event (optional):
		function webSocketsOnMessage(evt)
		{
			CB_console("The 'onMessage' event was fired! Data received: " + evt.data);
		},
		
		//Defines the handler for the "onError" event (optional):
		function webSocketsOnError(evt)
		{
			CB_console("The 'onError' event was fired!");
			CB_console(evt); //Prints whole event object.
		},
		
		//Other parameters (internal usage recommended):
		undefined, //options
		undefined //protocols
	);

	//Tries to send a message to the server (if 'websocket' is not provided, it will use the last one created (stored in 'CB_Net.Sockets.SockJS.websocketLast'):
	CB_Net.Sockets.SockJS.send
	(
		//Message to send:
		"Hello, WebSockets! This is a test...",
		
		//WebSockets object to use (optional):
		websocket, //If not provided, it will use the last one created (stored in 'CB_Net.Sockets.SockJS.websocketLast').
		
		//Defines a handler for the "onError" event (optional):
		function(evt) { CB_console("Failed to send the message!"); CB_console(evt); } //Prints the event object.
	);
	
	//Tries to close the connection:
	CB_Net.Sockets.SockJS.close
	(
		//WebSockets object to use (optional):
		websocket, //If not provided, it will use the last one created (stored in 'CB_Net.Sockets.SockJS.websocketLast').
		
		//Defines a handler for the "onError" event (optional):
		function(evt) { CB_console("Failed to close the connection!"); CB_console(evt); } //Prints the event object.
	);
</code></pre>

To get more information about the usage of this feature, read the <a href="https://github.com/sockjs/sockjs-client" target="_blank">SockJS client library</a> documentation.

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Net.html" target="_blank">CB_Net</a>, the <a href="_html/_doc/api/CB_Net.Sockets.html" target="_blank">CB_Net.Sockets</a> and the <a href="_html/_doc/api/CB_Net.Sockets.SockJS.html" target="_blank">CB_Net.Sockets.SockJS</a> static classes.
</p>