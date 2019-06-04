<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Here are some examples of events management:
</p>
<pre><code class="language-javascript">
	//Adds an event handler on a target element:
	var eventHandler = function(e) { CB_console("Scrolling!"); };
	CB_Events.on //Equivalent to 'CB_Events.add'.
	(
		window, //eventTarget.
		"scroll", //eventName.
		eventHandler, //eventFunction.
		false, //useCapture. Optional. Default: false. Defines whether to use capture.
		true, //keepOldEventFunction. Optional. Default: true. Defines whether to keep previous handlers or not.
		true //erasable. Optional. Default: true. Mark it as erasable or not.
	);
	
	//Removes an event handler from a target element (even an erasable one):
	CB_Events.remove
	(
		window, //eventTarget.
		"scroll", //eventName.
		eventHandler, //eventFunction.
		false //useCapture. Optional. Default: false.
	);
	
	//Removes all events handlers of a desired type from a given target element:
	CB_Events.removeByName
	(
		window, //eventTarget.
		"scroll", //eventName.
		false //forceDelete. Optional. Default: false. Defines whether to force deletion of erasable handlers.
	);
	
	//Removes all events handlers of any type from all targets:
	CB_Events.removeAll(false); //First parameter ("forceDelete") optional (defines whether to force deletion of erasable handlers). Default: false.
	
	//Returns an array with all events of the desired type on a given target element:
	var eventsArray = CB_Events.getByName
	(
		window, //eventTarget.
		"scroll", //eventName.
		false //onlyWithFunction. Optional. Default: false. Defines whether to return only event handlers with a valid function.
	);
	
	//Returns an array with all events of all targets:
	var allEventsArray = CB_Events.getAll();
	
	//Executes all event handlers of a desired type of a given target element:
	var result = CB_Events.executeByName //The result is calculated with an AND operator with "true" and of all the return values of each event handler executed or returns the value of the "returnOnNothingExecuted" parameter otherwise.
	(
		window, //eventTarget.
		"scroll", //eventName.
		e, //Optional. Default: undefined. Contains the event object which will be passed to the event handlers as their first parameter.
		returnOnNothingExecuted //Optional. Default: undefined. Defines the value returned when no handler is executed.
	);
	
	//Returns the given event object normalized, attaching to it some events and properties if they were not present (as preventDefault, stopPropagation, target, etc.):
	var e = CB_Events.normalize(e); //The new attached methods and properties may include polyfills, etc.
	
	//Gets the type of a given event object (returns an empty string if it was not possible to determine):
	var eventType = CB_Events.getType(e);
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Events.html" target="_blank">CB_Events</a> static class.
</p>