<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	With the <a href="_html/_doc/api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class you can manage music composition easily. This is done thanks to the
	<a href="https://github.com/meenie/band.js" target="_blank">Band.js library</a>.
</p>

<p>
	Here is an example managing music composition:
</p>

<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Music composition example (taken from https://github.com/meenie/band.js):
	var bandJSObject = CB_Speaker.getBandJSObject(); //Gets a new 'BandJS' object.
	if (bandJSObject !== null)
	{
		//Sets a time signature:
		bandJSObject.setTimeSignature(4, 4);
		
		//Sets the tempo:
		bandJSObject.setTempo(80);

		//Creates an instrument and adds notes:
		var piano = bandJSObject.createInstrument();
		piano.note("quarter", "C4");
		piano.note("quarter", "D4");
		piano.note("quarter", "E4");
		piano.note("quarter", "F4");

		//Finishes and plays it:
		//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
		var player = bandJSObject.finish();
		player.play()
	}
</code></pre>
<p>
	When playing music composed, at least the first time (you can do it silently as a trick), it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
</p>

<p>
	You can read more about it in the <a href="https://github.com/meenie/band.js" target="_blank">Band.js library</a> web site.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class.
</p>