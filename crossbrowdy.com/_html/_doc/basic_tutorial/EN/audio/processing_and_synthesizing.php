<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	With the <a href="api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class you can manage audio processing and synthesizing easily. This is done thanks to the
	<a href="https://mohayonao.github.io/timbre.js/" target="_blank">timbre.js library</a> and the <a href="https://mohayonao.github.io/subcollider/" target="_blank">subcollider.js library</a>.
</p>
	
<p>
	Here is an example of audio processing and synthesizing:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Audio processing and synthesizing example (taken from https://mohayonao.github.io/timbre.js/reich.html):
	var timbreJSObject = CB_Speaker.getTimbreJSObject(); //Gets the 'T' object.
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
						if (count &lt; midis.length)
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
				try
				{
					var L = timbreJSObject("buffer", { buffer: result, loop: true });
					var R = timbreJSObject("buffer", { buffer: result, loop: true });
				}
				catch(E) { CB_console("Cannot create buffer. Error: " + E); return; }

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
		);
	}
</code></pre>
<p>
	When playing the audio created, at least the first time (you can do it silently as a trick), it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
</p>

<p>
	You can read more about it in the <a href="https://mohayonao.github.io/timbre.js/" target="_blank">timbre.js library</a> and the <a href="https://mohayonao.github.io/subcollider/" target="_blank">subcollider.js library</a> web sites.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class.
</p>