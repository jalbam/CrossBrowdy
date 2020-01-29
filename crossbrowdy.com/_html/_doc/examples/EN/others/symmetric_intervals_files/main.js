/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

CB_init(start); //It will call the "start" function when ready.


//Stores times information:
var times =
{
	"raf": { min: 1000 / 60, max: null, avg: null, timer: null, lastValues: null, lastValuesPointer: 0, lastTimeCalled: 0 },
	"sym0": { ms: 0, min: null, max: null, avg: null, timer: null, lastValues: null, lastValuesPointer: 0, lastTimeCalled: 0 },
	"sym1": { ms: 1, min: null, max: null, avg: null, timer: null, lastValues: null, lastValuesPointer: 0, lastTimeCalled: 0 },
	"sym2": { ms: 2, min: null, max: null, avg: null, timer: null, lastValues: null, lastValuesPointer: 0, lastTimeCalled: 0 },
	"sym4": { ms: 4, min: null, max: null, avg: null, timer: null, lastValues: null, lastValuesPointer: 0, lastTimeCalled: 0 },
	"sym8": { ms: 8, min: null, max: null, avg: null, timer: null, lastValues: null, lastValuesPointer: 0, lastTimeCalled: 0 },
	"sym16": { ms: 16, min: null, max: null, avg: null, timer: null, lastValues: null, lastValuesPointer: 0, lastTimeCalled: 0 },
	"sym1000": { ms: 1000, min: null, max: null, avg: null, timer: null, lastValues: [], lastValuesPointer: 0, lastTimeCalled: 0 }
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
		times[id].lastValues = [];
		times[id].lastValuesPointer = 0;
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
	
	//Calculate and stores maximum and minimum times:
	var timeDifference = timeCalled - times[id].lastTimeCalled;
	if (timeDifference < times[id].min || times[id].min === null) { times[id].min = timeDifference; printMessage("Minimum set for '" + id + "': " + timeDifference); }
	if (timeDifference > times[id].max || times[id].max === null) { times[id].max = timeDifference; printMessage("Maximum set for '" + id + "': " + timeDifference); }
	times[id].lastTimeCalled = timeCalled;

	//Stores current time as one of the last values:
	times[id].lastValues[times[id].lastValuesPointer] = timeDifference;
	times[id].lastValuesPointer++;
	times[id].lastValuesPointer %= 10;
	
	//Calculates and stores average:
	var timesSum = 0;
	for (var x = times[id].lastValues.length - 1; x >= 0; x--)
	{
		timesSum += times[id].lastValues[x];
	}
	times[id].avg = timesSum / times[id].lastValues.length;
	
	//Shows the times just calculated:
	showTime(id);
}


//Shows times updated:
function showTime(id)
{
	CB_Elements.insertContentById(id + "_min_time", times[id].min);
	CB_Elements.insertContentById(id + "_max_time", times[id].max);
	CB_Elements.insertContentById(id + "_avg_time", times[id].avg);
}


//Shows a message:
function printMessage(message)
{
	message = CB_trim(message);
	if (message === "") { CB_Elements.insertContentById("messages", ""); }
	else { CB_Elements.appendContentById("messages", message + "<br />"); }
	CB_Elements.id("messages").scrollTop = CB_Elements.id("messages").scrollHeight; //Scrolls to the bottom.
}