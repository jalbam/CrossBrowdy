CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	CB_console("Ready!");
}


//Starts a WebSockets connection:
var websocket = null;
function start()
{
	//Tries to starts a connection to the WebSockets (SockJS) server:
	showEventsInformation("Trying to open the connection...");
	websocket = CB_Net.Sockets.SockJS.listen
	(
		//Defines the server address:
		CB_Elements.id("server").value,

		//Defines the handler for the "onOpen" event (optional):
		function webSocketsOnOpen(evt)
		{
			showEventsInformation("The 'onOpen' event was fired! websocket.transport=" + websocket.transport);
		},

		//Defines the handler for the "onClose" event (optional):
		function webSocketsOnClose(evt)
		{
			showEventsInformation("The 'onClose' event was fired! Reason: " + evt.reason);
			websocket = null;
		},

		//Defines the handler for the "onMessage" event (optional):
		function webSocketsOnMessage(evt)
		{
			showEventsInformation("The 'onMessage' event was fired! Data received: " + evt.data);
		},

		//Defines the handler for the "onError" event (optional):
		function webSocketsOnError(evt)
		{
			showEventsInformation("The 'onError' event was fired! evt = " + JSON.stringify(evt));
		},

		//Other parameters (internal usage recommended):
		undefined, //options
		undefined //protocols
	);
}


//Sends a message through the WebSockets connection:
function send()
{
	//Tries to send a message to the server (if 'websocket' is not provided, it will use the last one created (stored in 'CB_Net.Sockets.SockJS.websocketLast'):
	showEventsInformation("Trying to send the message...");
	CB_Net.Sockets.SockJS.send
	(
		//Message to send:
		CB_Elements.id("message").value,

		//WebSockets object to use (optional):
		websocket, //If not provided, it will use the last one created (stored in 'CB_Net.Sockets.SockJS.websocketLast').

		//Defines a handler for the "onError" event (optional):
		function(evt) { showEventsInformation("Failed to send the message! evt = " + JSON.stringify(evt)); } //Prints the event object.
	);	
}


//Stops the WebSockets connection:
function stop()
{
	//Tries to close the connection:
	showEventsInformation("Trying to close the connection...");
	CB_Net.Sockets.SockJS.close
	(
		//WebSockets object to use (optional):
		websocket, //If not provided, it will use the last one created (stored in 'CB_Net.Sockets.SockJS.websocketLast').

		//Defines a handler for the "onError" event (optional):
		function(evt) { showEventsInformation("Failed to close the connection! evt = " + JSON.stringify(evt)); } //Prints the event object.
	);	
}


//Shows events information:
function showEventsInformation(message)
{
	//Updates events information:
	CB_Elements.insertContentById("penultimate_event", CB_Elements.id("last_event").innerHTML);
	CB_Elements.insertContentById("last_event", message);
	CB_console(message);
}
