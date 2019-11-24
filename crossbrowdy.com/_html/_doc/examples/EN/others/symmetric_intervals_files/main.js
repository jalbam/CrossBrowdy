CB_init(start); //It will call the "start" function when ready.


//Stores times information:
var times =
{
	"raf": { min: 1000 / 60, max: null, timer: null, lastTimeCalled: 0 },
	"sym8": { ms: 8, min: null, max: null, timer: null, lastTimeCalled: 0 },
	"sym16": { ms: 16, min: null, max: null, timer: null, lastTimeCalled: 0 },
	"sym1000": { ms: 1000, min: null, max: null, timer: null, lastTimeCalled: 0 }
};


//Starts timers (will also be called when CrossBrowdy is ready):
function start()
{
	//Clears any previous timers and stored internal data and start timers:
	for (var id in times)
	{
		if (id === "raf") { cancelAnimationFrame(times[id].timer); }
		else
		{
			clearTimeout(times[id].timer);
			CB_symmetricCallClear(id); //Clears the stored last time used by 'CB_symmetricCall' for a given symmetric interval identifiers.
		}
		times[id].min = null;
		times[id].max = null;
		times[id].lastTimeCalled = null;
		
		CB_Elements.insertContentById(id + "_min_time", "Calculating...");
		CB_Elements.insertContentById(id + "_max_time", "Calculating...");
		
		printMessage("Starting timer for '" + id + (times[id].ms ? "' using " + times[id].ms + " milliseconds" : "'") + "...");
		loop(null, id, times[id].ms);
	}
}


//Loop function:
function loop(timeCalled, id, ms)
{
	calculateTime(id, timeCalled);
	if (id === "raf") { times[id].timer = requestAnimationFrame(function(time) { loop(time, id); }); }
	else { times[id].timer = CB_symmetricCall(function(time) { loop(time, id, ms); }, ms, id); } //Similar to 'requestAnimationFrame'.
}

//Calculates and stores times:
function calculateTime(id, timeCalled)
{
	if (typeof(timeCalled) === "undefined" || timeCalled === null) { return; }
	else if (times[id].lastTimeCalled === null) { times[id].lastTimeCalled = timeCalled; return; }
	
	//Calculate times:
	var timeDifference = timeCalled - times[id].lastTimeCalled;
	if (timeDifference < times[id].min || times[id].min === null) { times[id].min = timeDifference; printMessage("Minimum set for '" + id + "': " + timeDifference); }
	if (timeDifference > times[id].max || times[id].max === null) { times[id].max = timeDifference; printMessage("Maximum set for '" + id + "': " + timeDifference); }
	times[id].lastTimeCalled = timeCalled;
	
	//Shows the times:
	showTime(id);
}


//Shows times updated:
function showTime(id)
{
	CB_Elements.insertContentById(id + "_min_time", times[id].min);
	CB_Elements.insertContentById(id + "_max_time", times[id].max);
}


//Shows a message:
function printMessage(message)
{
	message = CB_trim(message);
	if (message === "") { CB_Elements.insertContentById("messages", ""); }
	else { CB_Elements.appendContentById("messages", message + "<br />"); }
	CB_Elements.id("messages").scrollTop = CB_Elements.id("messages").scrollHeight; //Scrolls to the bottom.
}