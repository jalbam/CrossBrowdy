<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	CrossBrowdy can manage audio files and even audio data URI (depending on the audio API and client used) through the <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> class.
	This class will detect automatically the best API to reproduce the audio but it can also be forced to use a certain audio API.
</p>

<p>
	Depending on the audio API used, the internal audio management will be done through
	the <a href="_html/_doc/api/CB_AudioFile_API.WAAPI.html" target="_blank">CB_AudioFile_API.WAAPI</a>
	(using <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank">HTML5 Web Audio API</a>),
	the <a href="_html/_doc/api/CB_AudioFile_API.AAPI.html" target="_blank">CB_AudioFile_API.AAPI</a>
	(using <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio" target="_blank">HTML5 Audio API</a>),
	the <a href="_html/_doc/api/CB_AudioFile_API.ACMP.html" target="_blank">CB_AudioFile_API.ACMP</a>
	(using <a href="https://github.com/apache/cordova-plugin-media" target="_blank">Apache Cordova Media Plugin</a>) or
	the <a href="_html/_doc/api/CB_AudioFile_API.SM2.html" target="_blank">CB_AudioFile_API.SM2</a>
	(using <a href="http://schillmania.com/projects/soundmanager2/" target="_blank">SoundManager 2</a>)
	classes. You do not need to worry about these classes at all as the internal management will be done automatically.
</p>

<p>
	The <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects use a higher abstraction level than the audio file API objects
	(<a href="_html/_doc/api/CB_AudioFile_API.WAAPI.html" target="_blank">CB_AudioFile_API.WAAPI</a>,
	<a href="_html/_doc/api/CB_AudioFile_API.AAPI.html" target="_blank">CB_AudioFile_API.AAPI</a>,
	<a href="_html/_doc/api/CB_AudioFile_API.ACMP.html" target="_blank">CB_AudioFile_API.ACMP</a>
	and <a href="_html/_doc/api/CB_AudioFile_API.SM2.html" target="_blank">CB_AudioFile_API.SM2</a>)
	but lower than the <a href="_html/_doc/api/CB_AudioFileCache.html" target="_blank">CB_AudioFileCache</a> ones.
</p>

<p>
	Note that, most of the times, it is recommended to deal with audio files using always the
	<a href="_html/_doc/api/CB_Speaker.html" target="_blank">CB_Speaker</a> static class
	which can contain a
	<a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> object
	(mainly using the
	<a href="_html/_doc/api/CB_Speaker.html#.setAudioFileSpritesPool" target="_blank">CB_Speaker.setAudioFileSpritesPool</a> and
	the <a href="_html/_doc/api/CB_Speaker.html#.getAudioFileSpritesPool" target="_blank">CB_Speaker.getAudioFileSpritesPool</a>
	functions).
	The <a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> class uses audio files cache
	and provides multiple sprites groups management as well as many other advanced methods.
</p>

<p>
	Here are some examples loading an audio file or audio data URI with CrossBrowdy:
</p>
<pre><code class="language-javascript">
	//Defines the audio file path (instead of a path, it could also be a string representing a data URI):
	//Note: data URIs and some audio formats are not supported by some clients. Check the 'CB_AudioDetector' static class.
	var filePathOrDataURI = "audio_data_URI_or_path/to/file.ext";
	
	//Creates an audio file object (the best audio API for the current client will be chosen automatically):
	var audioFile = new CB_AudioFile(filePathOrDataURI);

	//Creates an audio file object with a given identifier (the best audio API for the current client will be chosen automatically):
	var audioFile_2 = new CB_AudioFile(filePathOrDataURI, "audio_file_id");
	
	//Creates an audio file object with a given identifier and some options (the best audio API for the current client will be chosen automatically):
	var audioFile_3 = new CB_AudioFile(filePathOrDataURI, "audio_file_id", { autoLoad: true, autoPlay: true });
	
	//Creates an audio file object with a given identifier and some options, forcing a certain audio API (WAAPI):
	var audioFile_4 = new CB_AudioFile(filePathOrDataURI, "audio_file_id", { loop: true, volume: 80 }, "WAAPI"); //Possible audio APIs: WAAPI, AAPI, ACMP or SM2.
	
	//Creates an audio file with all possible parameters:
	var audioFile_5 = new CB_AudioFile
	(
		filePathOrDataURI, //filePath.
		"audio_file_id", //audioId. Optional. Set to undefined or null to use the default one (calculated automatically with an internal counter).
		{ 	//options. Optional. Default: CB_AudioFile.prototype.DEFAULT_OPTIONS. Set to undefined or null to use the default one:
			autoLoad: true, //Defines whether to load the audio automatically or not. Default: CB_AudioFile.prototype.DEFAULT_OPTIONS.autoLoad. Set to undefined or null to use the default one.
			autoPlay: false, //Defines whether to play the audio automatically as soon as it loads or not. Default: CB_AudioFile.prototype.DEFAULT_OPTIONS.autoPlay. Set to undefined or null to use the default one.
			loop: false, //Defines whether to loop the audio as default when playing it or not (this can be changed later). Default: CB_AudioFile.prototype.DEFAULT_OPTIONS.loop. Set to undefined or null to use the default one.
			volume: CB_AudioFile.prototype.DEFAULT_VOLUME //Defines the volume for the audio (this can be changed later). Default: Default: CB_AudioFile.prototype.DEFAULT_OPTIONS.volume. Set to undefined or null to use the default one.
		}, 
		null, //audioAPI. Optional. Set to undefined or null to calculate automatically the best audio API for the current client.
		function() { CB_console("Audio object created!"); }, //callbackOk. Optional but recommended.
		function(error) { CB_console("Audio object failed! Error: " + error); }, //callbackError. Optional but recommended.
	);
</code></pre>

<p>
	It is important to have into account that the "autoPlay" option of the "options" parameter when calling the constructor might not work in some clients unless it has been called through a user-driven event (as "onClick", "onTouchStart", etc.).
	This is a common restriction in some clients with some audio APIs. Some of those clients could even block any audio if it was not created through a user-driven event, preventing it from playing at all even in the future.
	Apart from that, when creating a new audio file object, due to its asynchronous nature, it is highly recommended to define its "callbackOk" and "callbackError" parameters always. Here is a more advanced example:
</p>
<pre><code class="language-javascript">
	//Defines the audio file path (instead of a path, it could also be a string representing a data URI):
	//Note: data URIs and some audio formats are not supported by some clients. Check the 'CB_AudioDetector' static class.
	var filePathOrDataURI = "audio/numeros/numeros.mp3";

	//Defines the function to execute when the audio object has been created successfully:
	var onCreated = function()
	{
		//NOTE: if the "autoPlay" option of the "options" parameter is disabled, the status will remain 'UNCHECKED' until the 'audioFile.checkPlaying' method is called.
		CB_console("Audio object created! Status: " + audioFile.getStatusString());
		CB_console("Identifier: " + this.id); //Same as audioFile.id.
		CB_console("API used: " + this.audioAPI); //Same as audioFile.audioAPI.
		CB_console("File path/data URI: " + audioFile.filePath); //In case of using a data URI, this could be too long!
	};
	
	//Creates an audio file with all possible parameters:
	var audioFile = new CB_AudioFile
	(
		filePathOrDataURI, //filePath.
		null, //audioId. Optional. Set to undefined or null to use the default one (calculated automatically with an internal counter).
		null, //options. Optional. Default: CB_AudioFile.prototype.DEFAULT_OPTIONS. Set to undefined or null to use the default one:
		null, //audioAPI. Optional. Set to undefined or null to calculate automatically the best audio API for the current client.
		onCreated, //callbackOk. Optional but recommended.
		function(error) { CB_console("Audio object failed! Error: " + error); }, //callbackError. Optional but recommended.
	);
	
	//Checks the status constantly and shows the progress (optional):
	var lastProgress = null, currentProgress = null;
	var lastStatus = null, currentStatus = null;
	var checkLoadingContinue = true;
	var checkLoading = function()
	{
		//Shows the progress (if there were any changes):
		currentProgress = audioFile.getProgress();
		if (currentProgress !== lastProgress)
		{
			CB_console("Progress: " + currentProgress);
			lastProgress = currentProgress;
		}
		
		//Shows the status (if there were any changes):
		//NOTE: it would also be possible to use the 'audioFile.getStatusString' method which returns a string with the current status.
		currentStatus = audioFile.getStatus();
		if (currentStatus !== lastStatus)
		{
			if (currentStatus === CB_AudioFile.UNLOADED) { CB_console("Unloaded"); }
			else if (currentStatus === CB_AudioFile.ABORTED) { CB_console("Aborted!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFile.FAILED) { CB_console("Failed!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFile.LOADING) { CB_console("Loading..."); }
			else if (currentStatus === CB_AudioFile.UNCHECKED) { CB_console("Unchecked! The 'audioFile.checkPlaying' method needs to be called."); }
			else if (currentStatus === CB_AudioFile.CHECKING) { CB_console("Checking..."); }
			else if (currentStatus === CB_AudioFile.LOADED) { CB_console("Loaded! Now you can use the audio file object freely."); checkLoadingContinue = false; }
			lastStatus = currentStatus;
		}
		
		if (checkLoadingContinue) { checkLoadingInterval = setTimeout(checkLoading, 1); }
	};
	var checkLoadingInterval = setTimeout(checkLoading, 1);
</code></pre>

<p>
	If the "autoLoad" option of the "options" parameter when calling the constructor is disabled, it will be necessary to load the audio manually. It is highly recommended to do it through a user-driver event (as "onClick", "onTouchStart", etc.):
</p>
<pre><code class="language-javascript">
	//Loads the audio manually:
	audioFile.load();

	//Loads the audio manually with more options:
	var audioFileAPIObject = audioFile.load //Returns the internal audio file API object used (an instance of 'CB_AudioFile_API.WAAPI', 'CB_AudioFile_API.SM2', 'CB_AudioFile_API.ACMP' or 'CB_AudioFile_API.AAPI') or null if it could not be obtained.
	(
		filePathOrDataURI, //filePath. Optional. Default: audioFile.filePath. Set to undefined or null to use the default one.
		"WAAPI", //audioAPI. Optional. Default: audioFile.audioAPI. Set to undefined or null to use the default one.
		false, //autoPlay. Optional. Default: false. If set to false, the 'audioFile.checkPlaying' will need to be called later. Set to undefined or null to use the default one.
		function() { CB_console("Audio OK! Status: " + this.getStatusString()); /* Same as audioFile.getStatusString(). */ }, //callbackOk. Optional but recommended.
		function(error) { CB_console("Audio failed! Error: " + error); }, //callbackError. Optional but recommended.
		false, //ignoreOldValues. Optional. Default: false. Set to undefined or null to use the default one.
		false //forceReload. Optional. Default: false. Set to undefined or null to use the default one.
	);
</code></pre>

<p>
	Once the audio has been created property (remember to use the "callbackOk" parameter with a function), it is recommended to call the "checkPlaying" method before anything else and it is highly recommended to do it through a user-driver event (as "onClick", "onTouchStart", etc.). This should only be done once the status of the audio file object is "UNCHECKED", never before. Calling this method is only necessary if the "autoPlay" option of the "options" parameter when calling the constructor is disabled (when it is enabled, it will call "checkPlaying" automatically internally). It would also be necessary to call this method again in the future if the audio file object had been reloaded, etc. Here is an example:
</p>
<pre><code class="language-javascript">
	//Checks whether the audio can be played or not (needed when its status is "UNCHECKED"):
	audioFile.checkPlaying
	(
		function() { CB_console("Audio checked properly!"); }, //callbackOk. Optional but recommended.
		function(error) { CB_console("Audio failed to be checked! Error: " + error); } //callbackError. Optional but recommended.
		//It also accepts other optional parameters: 'ignoreStatus', 'ignoreQueue' and 'useCache'. Set them to undefined or null to use the default ones.
	);
</code></pre>

<p>
	After the audio file object has been loaded successfully (and after calling "checkPlaying" successfully, if it was necessary), we can start using the audio file object freely:
</p>
<pre><code class="language-javascript">
	//Shows the total duration of the audio (in milliseconds):
	CB_console("Duration (ms): " + audioFile.getDuration());
	
	//Shows the current time, which is the position of the audio where it is being played currently or where it has been paused:
	CB_console("Current time: " + audioFile.getCurrentTime());
	
	//Shows the current volume:
	CB_console(audioFile.getVolume());
	
	//Sets the desired volume (this can also be changed during playing):
	audioFile.setVolume(80, false, function() { CB_console("Volume set!"); }); //Only the first parameter is mandatory.
	
	//Mutes the audio:
	audioFile.mute(function() { CB_console("Audio muted!"); }); //The parameter is optional.
	
	//Shows the volume before it was muted:
	CB_console("Volume before muting it: " + audioFile.getVolumeBeforeMute());
	
	//Unmutes the audio, restoring its previous volume:
	audioFile.unmute(function() { CB_console("Audio unmuted!"); }); //The parameter is optional.
	
	//Sets whether the audio should loop as default or not (this can be overridden when the 'audioFile.play' method is called):
	audioFile.loop = true;
	
	//Plays the audio:
	audioFile.play();
	
	//Plays the audio with more options:
	audioFile.play
	(
		//Time in milliseconds where we want the audio to start at:
		0, //startAt. Optional. Default: 0 | audioFile.audioFileObject.lastStartAt | stopAt. Set to undefined or null to use the default one.
		
		//Time in milliseconds where we want the audio to stop at:
		null, //stopAt. Optional. Default: audioFile.audioFileObject.getDuration(). Set to undefined or null to use the default one.
		
		//Sets whether we want to play the audio looping (starting again and again) or just play it once:
		false, //loop. Optional. Default: audioFile.loop. Set to undefined or null to use the default one.
		
		//Defines whether to allow delayed play:
		//If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay).
		//Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the "stop" method of the used audio API object will be called immediately.
		false, //avoidDelayedPlay. Optional. Default: false. Set to undefined or null to use the default one.
		
		/The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio:
		//If the amount of time is overcome, the audio will not play at all and the "stop" method of the used audio API object will be called immediately.
		//Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed).
		true, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		
		//Function to be called when the audio starts playing successfully:
		function(startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) { CB_console("Audio started playing!"); }, //onPlayStart. Optional.
		
		//Function to be called if the audio cannot be played successfully:
		function(error) { CB_console("Audio could not be played! Error: " + error); } //onLoadError. Optional.
	);
	
	//Gets the values for the "startAt" and "stopAt" parameters used by the last call to the 'audioFile.play' method:
	var audioFileStartAt = audioFile.getStartAt();
	var audioFileStopAt = audioFile.getStopAt();

	//Pauses the audio (if it is currently playing):
	audioFile.pause(function() { CB_console("Audio paused!"); }); //The parameter is optional.

	//Resume the audio after pausing it:
	audioFile.resume();
	
	//Resumes the audio after pausing it with more options:
	audioFile.resume
	(
		true, //loop. Optional. Default: audioFile.loop. Set to undefined or null to use the default one.
		false, //avoidDelayedPlay. Optional. Default: false. Set to undefined or null to use the default one.
		true, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		function(startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) { CB_console("Audio started playing (resumed)!"); }, //onPlayStart. Optional.
		function(error) { CB_console("Audio could not be played (resumed)! Error: " + error); } //onLoadError. Optional.
	);

	//Sets a function to call when the audio is stopped (use "null" as the first parameter to remove them):
	audioFile.onStop(function() { CB_console("Audio stopped! ('onStop' event called)"); });
	
	//Stops the audio (similar to pausing it, but without keeping its current time):
	audioFile.stop();

	//Shows whether the audio is paused, playing or stopped:
	if (audioFile.isPlaying()) { CB_console("The audio is playing."); }
	else if (audioFile.isPaused()) { CB_console("The audio is paused."); }
	else { CB_console("The audio is stopped."); } //You can also use the 'audioFile.isStopped' method.
</code></pre>

<p>
	One of the most interesting features when managing audio file objects with CrossBrowdy is that you can change their audio API on the fly (even when they are currently playing!). This can be done easily:
</p>
<pre><code class="language-javascript">
	//Tries to change the audio API to the preferred one by the current client (this will work even on the fly, when it is currently playing):
	audioFile.setAudioAPI(); //Calls 'CB_AudioDetector.getPreferredAPI(undefined, false)' internally to get the preferred audio API automatically.

	//Tries to change the audio API to the desired one (this will work even on the fly, when it is currently playing):
	audioFile.setAudioAPI("WAAPI"); //Possible audio APIs: WAAPI, AAPI, ACMP or SM2.
	
	//Tries to change the audio API with more options (this will work even on the fly, when it is currently playing):
	audioFile.setAudioAPI
	(
		"AAPI", //audioAPI. Optional. Default: the result of calling 'CB_AudioDetector.getPreferredAPI(undefined, false)' internally. Set to undefined or null to use the default one.
		true, //autoLoad. Optional. Default: true. Set to undefined or null to use the default one.
		false, //autoPlay. Optional. Default: false. Set to undefined or null to use the default one.
		function() { CB_console("Audio API changed successfully!"); }, //callbackOk. Optional but recommended.
		function(error) { CB_console("Audio API failed to be changed! Error: " + error); }, //callbackError. Optional but recommended.
		false, //ignoreOldValues. Optional. Default: false. Set to undefined or null to use the default one.
		null, //filePath. Optional. Default: audioFile.filePath. Set to undefined or null to use the default one.
		false //forceReload. Optional. Default: false. Set to undefined or null to use the default one.
	);
</code></pre>

<p>
	In order to free memory and resources, it is possible to destroy the audio file object:
</p>
<pre><code class="language-javascript">
	//Destroys the audio file object and frees memory and resources:
	audioFile.destructor(); //If it is currently playing, it will not stop it. But if it was looping, it will not loop again.
	
	//Destroys the audio file object and frees memory and resources, with more options:
	audioFile.destructor
	(
		true, //stopSound. Optional. Default: false. Set to undefined or null to use the default one.
		false, //keepStoppedUnaltered. Optional. Default: false. Set to undefined or null to use the default one.
		false, //avoidOnStop. Optional. Default: false. Set to undefined or null to use the default one.
		false //forceOnStop. Optional. Default: false. Set to undefined or null to use the default one.
	);
</code></pre>
<p>
	After destroying an object, it is possible to call its "load" method to try to recover it or reuse it again.
</p>

<p>
	Finally, here are some other interesting examples that you might not need (the most likely):
</p>
<pre><code class="language-javascript">
	//Gets the internal audio file API object being used (an instance of 'CB_AudioFile_API.WAAPI', 'CB_AudioFile_API.SM2', 'CB_AudioFile_API.ACMP' or 'CB_AudioFile_API.AAPI'):
	var audioFileAPIObject = audioFile.audioFileObject; //Current audio file API object being used.
	var audioFileAPIObjectLast = audioFile.audioFileObjectLast; //Last audio file API object created, may be not being used yet (can be different from 'audioFileAPIObject' when changing API, etc.).
	
	//Checks whether the internal audio file object is a real one or just a fake prototype (used when a real one could not be obtained):
	if (audioFileAPIObject.usingPrototype) { CB_console("'audioFileAPIObject' is a fake object, not a real audio file API object."); }
	if (audioFileAPIObjectLast.usingPrototype) { CB_console("'audioFileAPIObjectLast' is a fake object, not a real audio file API object."); }
	
	//Gets an object with all the audio file API objects (instances of 'CB_AudioFile_API.WAAPI', 'CB_AudioFile_API.SM2', 'CB_AudioFile_API.ACMP' or 'CB_AudioFile_API.AAPI') created internally:
	//NOTE: each index will belong to the name of each audio API (for example, "WAAPI") and their value will be the internally-created audio file API object that belongs to that API.
	var audioFileAPIObjects = audioFile.audioFileObjects;
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a>, the <a href="_html/_doc/api/CB_AudioFile_API.WAAPI.html" target="_blank">CB_AudioFile_API.WAAPI</a>, the <a href="_html/_doc/api/CB_AudioFile_API.AAPI.html" target="_blank">CB_AudioFile_API.AAPI</a>, the <a href="_html/_doc/api/CB_AudioFile_API.ACMP.html" target="_blank">CB_AudioFile_API.ACMP</a> and the <a href="_html/_doc/api/CB_AudioFile_API.SM2.html" target="_blank">CB_AudioFile_API.SM2</a> classes.
</p>