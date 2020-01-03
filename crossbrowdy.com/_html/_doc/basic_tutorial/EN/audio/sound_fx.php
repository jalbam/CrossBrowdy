<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	With the <a href="api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class you can manage sound effects easily. This is done thanks to the
	<a href="https://github.com/loov/jsfx" target="_blank">jsfx library</a>.
</p>

<p>
	Here is an example managing sound effects:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Sound effects example:
	var jsfxObject = CB_Speaker.getJsfxObject(); //Gets the 'jsfx' object.
	if (jsfxObject !== null)
	{
		//Defines the sound effects:
		var library =
		{
			"select":
			{
				"Volume":
				{
					"Sustain": 0.1,
					"Decay": 0.15,
					"Punch": 0.55
				}
			},
			"jump":
			{
				"Frequency":
				{
					"Start": 632.5719976385375,
					"Slide": 0.23934902059283936
				},
				"Generator":
				{
					"Func": "square",
					"A": 0.4414022634702427
				},
				"Filter":
				{
					"HP":0.08955229309222913
				},
				"Volume":
				{
					"Sustain": 0.3053579728670927,
					"Decay": 0.23659526483594398
				}
			},
			"dynamic":
				function()
				{
					return { "Frequency": { "Start": Math.random() * 440 + 220 } };
				},
			"coin":
				jsfx.Preset.Coin
		};
		
		//Loads the sound effects:
		var sfx = CB_AudioDetector.isAPISupported("WAAPI") ? jsfxObject.Live(library) : jsfxObject.Sounds(library); //Uses AudioContext (Web Audio API) if available.
		
		//Plays the sound effects:
		//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
		try
		{
			sfx.select();
			sfx.jump();
			sfx.dynamic();
			sfx.coin();
		}
		catch(E) { CB_console("Error playing sound: " + E); }
	}
</code></pre>
<p>
	When playing sound effects, at least the first time (you can do it silently as a trick), it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
</p>

<p>
	You can read more about sound effects management in the <a href="https://github.com/loov/jsfx" target="_blank">jsfx library</a> web site.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class.
</p>