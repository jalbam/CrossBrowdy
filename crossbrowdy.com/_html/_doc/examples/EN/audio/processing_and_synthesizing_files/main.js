//Using timbre.js library internally: https://mohayonao.github.io/timbre.js/
//Using subcollider.js library internally: https://mohayonao.github.io/subcollider/


CB_init(main); //It will call the "main" function when ready.


//Global 'T' object to play the sounds:
var timbreJSObject = null;

//Global 'result':
var bufferResult = null;


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Audio processing and synthesizing example (taken from https://mohayonao.github.io/timbre.js/reich.html):
	timbreJSObject = CB_Speaker.getTimbreJSObject(); //Gets the 'T' object.
	if (timbreJSObject !== null)
	{
		timbreJSObject.rec
		(
			function(output)
			{
				var midis = [69, 71, 72, 76, 69, 71, 72, 76].scramble();
				var msec  = timbreJSObject.timevalue("bpm120 l8");
				var synth = timbreJSObject
				(
					"OscGen",
					{ env: timbreJSObject("perc", { r: msec, ar: true }) }
				);

				timbreJSObject
				(
					"interval",
					{ interval: msec },
					function(count)
					{
						if (count < midis.length)
						{
							synth.noteOn(midis[count], 100);
						}
						else { output.done(); }
					}
				).start();
				
				output.send(synth);
			}
		).then
		(
			function(result)
			{
				//Shows the controls:
				CB_Elements.showById("controls");
				
				bufferResult = result;
			}
		);
	}
	
}


//Plays the audio:
function play()
{
	var L = timbreJSObject("buffer", { buffer: bufferResult, loop: true });
	var R = timbreJSObject("buffer", { buffer: bufferResult, loop: true });

	var num = 400;
	var duration = L.duration;

	R.pitch = (duration * (num - 1)) / (duration * num);

	//Plays the audio:
	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	timbreJSObject
	(
		"delay",
		{ time: "bpm120 l16", fb: 0.1, cross: true },
		timbreJSObject("pan", { pos: -0.6 }, L),
		timbreJSObject("pan", { pos: +0.6 }, R)
	).play();
}