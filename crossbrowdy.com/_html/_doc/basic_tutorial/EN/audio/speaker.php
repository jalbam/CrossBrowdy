<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	The <a href="api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class provides a higher-level layer to manage audio easily.
</p>

<p>
	With this static class you can manage audio files (including groups of sprites), sound effects, music composition, processing, synthesizing, etc.
</p>

<p>
	Note that, most of the times, it is recommended to deal with audio files using always the
	<a href="api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class
	which can contain a
	<a href="api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> object
	(mainly using the
	<a href="api/CB_Speaker.html#.setAudioFileSpritesPool" target="_blank">CB_Speaker.setAudioFileSpritesPool</a> and
	the <a href="api/CB_Speaker.html#.getAudioFileSpritesPool" target="_blank">CB_Speaker.getAudioFileSpritesPool</a>
	functions).
	The <a href="api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> class uses audio files cache
	and provides multiple sprites groups management as well as many other advanced methods.
	Here is an example:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Sets an internal CB_AudioFileSpritesPool object:
	CB_Speaker.setAudioFileSpritesPool(audioFileSpritesPool); //The parameter must be a CB_AudioFileSpritesPool object.
	
	//Gets the current internal CB_AudioFileSpritesPool object:
	var audioFileSpritesPool = CB_Speaker.getAudioFileSpritesPool();
	if (audioFileSpritesPool !== null)
	{
		//Do things with it...
	}
</code></pre>
<p>
	You can read more about the <a href="api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> class in the <a href="<?php echo basicTutorialLink("audio", "audio_sprites_pool"); ?>" target="_blank">Audio sprites pool</a> topic.
</p>

<p>
	Here are some examples of management with the <a href="api/CB_Speaker.html" target="_blank">CB_Speaker</a> class:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Returns the volume sanitized (it does not allow values greater than 100 or lower than 0):
	var volume = CB_Speaker.sanitizeVolume(-20); //Returns 0.
	var volume_2 = CB_Speaker.sanitizeVolume(50); //Returns 50.
	var volume_3 = CB_Speaker.sanitizeVolume(130); //Returns 100.
	
	//Returns the current volume:
	var volumeCurrent = CB_Speaker.getVolume();
	
	//Sets the given volume:
	CB_Speaker.setVolume(80);
	
	//Mutes the speaker:
	CB_Speaker.mute();
	
	//Unmutes the speaker:
	CB_Speaker.unmute();
</code></pre>
<p>
	The functions above will affect the volume of the internal <a href="api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> object (if any).
</p>

<p>
	Here is an example managing sound effects:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Sound effects:
	var jsfxObject = CB_Speaker.getJsfxObject(); //Gets the 'jsfx' object.
	if (jsfxObject !== null)
	{
		//Do things with it...
	}
</code></pre>
<p>
	You can read more about it in the <a href="<?php echo basicTutorialLink("audio", "sound_fx"); ?>" target="_blank">Sound FX</a> topic.
</p>

<p>
	Here is an example managing music composition:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Music composition:
	var bandJSObject = CB_Speaker.getBandJSObject(); //Gets a new 'BandJS' object.
	if (bandJSObject !== null)
	{
		//Do things with it...
	}
</code></pre>
<p>
	You can read more about it in the <a href="<?php echo basicTutorialLink("audio", "music_composition"); ?>" target="_blank">Music composition</a> topic.
</p>
	
<p>
	Here is an example managing processing and synthesizing:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Processing and synthesizing audio:
	var timbreJSObject = CB_Speaker.getTimbreJSObject(); //Gets the 'T' object.
	if (timbreJSObject !== null)
	{
		//Do things with it...
	}
</code></pre>
<p>
	You can read more about it in the <a href="<?php echo basicTutorialLink("audio", "processing_and_synthesizing"); ?>" target="_blank">Processing and synthesizing</a> topic.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class.
</p>