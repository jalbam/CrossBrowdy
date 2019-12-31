<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Audio file sprites objects (which are created using the <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> class) allow you to use and reuse different sprites from the same sound multiple times and simultaneously.
</p>

<p>
	It is important to have in mind that each audio file sprites object should only contain the same sound (never different ones), although you should provide different audio formats of that sound so the audio file sprites object will be able to calculate and use the best one for the current client automatically.
	The more different formats you can provide, the more chances to support more clients.
</p>

<p>
	As some audio formats and some audio APIs are not supported by some clients, audio file sprites objects will detect and manage all automatically so you do not need to worry about it.
</p>

<p>
	Internally, each audio file sprites object will normally manage one audio file cache object (which use the <a href="_html/_doc/api/CB_AudioFileCache.html" target="_blank">CB_AudioFileCache</a> class) that will typically contain multiple <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects. An audio file cache object can grow automatically (expanding itself) in the case it detects it needs more internal <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects (for example, if it detects we want to play more sound instances simultaneously than the ones it currently has). It can also reload <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects automatically in the case they failed internally. During this process, the audio file sprites object (<a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> object) will have a 'LOADING' status again and after that the status will be 'LOADED' if all went well or 'FAILED' otherwise. When the 'LOAD' status is reached, the 'onLoad' event function (if any) will be called again (to prevent this, set the 'onLoad' property of the object to something which is not a function once it gets executed).
</p>

<p>
	The <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> class could be considered a wrapper for the <a href="_html/_doc/api/CB_AudioFileCache.html" target="_blank">CB_AudioFileCache</a> class which has been enhanced to add sprites management features.
</p>

<p>
	The <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> objects use a higher abstraction level than the <a href="_html/_doc/api/CB_AudioFileCache.html" target="_blank">CB_AudioFileCache</a> but lower than the <a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> ones.
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
	When loading an audio file sprites object, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	Here is an example loading an audio file sprites object:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Defines the same audio but in different audio files (providing different formats, paths and data URIs):
	//NOTE: CrossBrowdy will choose the best one(s) for the current client automatically.
	var currentURL = location.href;
	currentURL = currentURL.substring(0, currentURL.lastIndexOf("/") !== -1 ? currentURL.lastIndexOf("/") : currentURL.length) + "/";
	var dataURIs = //Here we could define the data URIs for the audios, in their values (but too long for this example):
	{
		"numeros/numeros.mp3" : null,
		"numeros/numeros.ogg" : null,
		"numeros/numeros.m4a" : null,
		"numeros/numeros.wav" : null
	}; 
	var audioURIs =
	{
		"audio/mpeg" :
		[
			currentURL + "audio/numeros/numeros.mp3", //Absolute path.
			"audio/numeros/numeros.mp3", //Relative path.
			dataURIs["numeros/numeros.mp3"] //Data URI.
		],
		"audio/ogg" :
		[
			currentURL + "audio/numeros/numeros.ogg", //Absolute path.
			"audio/numeros/numeros.ogg", //Relative path.
			dataURIs["numeros/numeros.ogg"] //Data URI.
		],
		"audio/mp4" :
		[
			currentURL + "audio/numeros/numeros.m4a", //Absolute path.
			"audio/numeros/numeros.m4a", //Relative path.
			dataURIs["numeros/numeros.m4a"] //Data URI.
		],
		"audio/wav" :
		[
			currentURL + "audio/numeros/numeros.wav", //Absolute path.
			"audio/numeros/numeros.wav", //Relative path.
			dataURIs["numeros/numeros.wav"] //Data URI.
		]
	};

	//Defines the sprites information:
	/*	NOTE:
		If "startAt" is not provided, it will use the value of 0 (zero) which means that it will start from the beginning.
		If "stopAt" is not provided (not recommended), it will use the whole duration of the file (which means until it reaches its end).
		Due to some possible problems between clients with different audio APIs calculating the duration of an audio file, it is recommended to always set the "stopAt" property even when we want it to stop at the end of the audio.
	*/
	var audioSprites =
	{
		//Sprite identifiers (case-sensitive), specifying where they start and where they stop:
		"ALL" :
		{
			"startAt" : 0,
			"stopAt" : null //Until the end. Note that the recommended way is to always provide the quantity in milliseconds as explained above.
		},
		"uno" :
		{
			"startAt" : 600,
			"stopAt" : 1050
		},
		"dos" :
		{
			"startAt" : 1680,
			"stopAt" : 2350
		},
		"tres" :
		{
			"startAt" : 2900,
			"stopAt" : 3620
		},
		"cuatro" :
		{
			"startAt" : 4150,
			"stopAt" : 4920
		},
		"cinco" :
		{
			"startAt" : 5610,
			"stopAt" : 6500
		},
		"seis" :
		{
			"startAt" : 7000,
			"stopAt" : 7900
		},
		"siete" :
		{
			"startAt" : 8300,
			"stopAt" : 9300
		},
		"ocho" :
		{
			"startAt" : 9900,
			"stopAt" : 10650
		},
		"nueve" :
		{
			"startAt" : 11100,
			"stopAt" : 11800
		},
		"diez" :
		{
			"startAt" : 12300,
			"stopAt" : 13150
		}
	};
	
	//Defines the function to call when the audio file sprites object is created or expanding:
	var onCreate = function(audioFileObjectsToCheck)
	{
		CB_console("Audio file sprites object created or expanding! CB_AudioFile objects that still need to be checked: " + audioFileObjectsToCheck);
		CB_console("Identifier: " + this.id); //Same as audioFileSprites.id.
		CB_console("Status: " + this.getStatusString()); //Same as audioFileSprites.getStatusString().
		if (audioFileObjectsToCheck > 0) { CB_console("You can call the 'audioFileSprites.checkPlayingAll' method to check all the CB_AudioFile objects."); }
		this.onLoad = null; //Prevents to execute this function again (otherwise, it could be executed again after the object grows automatically to create more 'CB_AudioFile' objects).
	};
	
	//Defines the data for the audio file sprites object with all possible options:
	var audioFileSpritesData =
	{
		//File paths and/or data URIs for the audio files (always using the same audio):
		URIs: audioURIs, //Unique mandatory option. Will be stored in 'audioFileSprites.audioFileCache.URIs'.
		
		sprites: audioSprites, //Optional but recommended. Will be stored in 'audioFileSprites.sprites' (after being processed).
		
		//Identifier for the audio file sprites object:
		id: "audio_file_sprites_id", //Optional. Will be stored in 'audioFileSprites.id' and 'audioFileSprites.audioFileCache.id'.
		
		//Accepted audio APIs in order of preference. Internally, it will calculate and use the best one(s) for the current client:
		preferredAPIs: ["WAAPI", "AAPI", "SM2", "ACMP"], //Optional. Default: CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS. Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.preferredAPIs'.
		
		//Accepted audio formats in order of preference. Internally, it will calculate and use the best one(s) for the current client:
		preferredFormats: null, //Optional. Default: CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS. Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.preferredFormats'.
		
		//Minimum CB_AudioFile objects that will be needed internally:
		minimumAudioFiles: 10, //Optional. Default: CB_AudioFileCache.minimumAudioFiles_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.minimumAudioFiles'.
		
		//Maximum CB_AudioFile objects that will be created internally:
		maximumAudioFiles: 30, //Optional. Default: CB_AudioFileCache.maximumAudioFiles_DEFAULT. Set to undefined to use the default one. Set to null to have no maximum. Will be stored in 'audioFileSprites.audioFileCache.maximumAudioFiles'.
		
		//Minimum free CB_AudioFile objects that will be needed internally. One CB_AudioFile object is free when it is not being played.
		minimumAudioFilesFree: 7, //Optional. Default: parseInt(audioFileSprites.audioFileCache.minimumAudioFiles * 0.25 + 0.5). Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.minimumAudioFilesFree'.
		
		//Defines the number of new CB_AudioFile objects to create automatically when they are needed:
		newAudioFilesWhenNeeded: 3, //Optional. Default: Math.min(parseInt(audioFileSprites.audioFileCache.minimumAudioFiles * 0.1 + 0.5), 1). Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.newAudioFilesWhenNeeded'.
		
		//Defines the number of retries to try to load a CB_AudioFile object internally before trying to load the next possible one (if any):
		retries: 3, //Optional. Default: CB_AudioFileCache.retries_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.retries'.
		
		//Defines whether we want to check all CB_AudioFile objects automatically or manually (we will need to call the 'checkPlayingAll' method):
		checkManually: true, //Optional. Default: CB_AudioFileCache.checkManually_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.checkManually'.
		
		//Defines whether we want to check the CB_AudioFile object automatically when creating a new needed one:
		checkManuallyOnNeededCreated: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.checkManuallyOnNeededCreated'.
		
		//Defines whether we want to check the CB_AudioFile object automatically when it has failed playing and tries to re-load it:
		checkManuallyOnPlayingFailed: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.checkManuallyOnPlayingFailed'.
		
		//Defines whether we want to check the CB_AudioFile object automatically when it has failed checking and tries to re-load it:
		checkManuallyOnCheckingFailed: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSprites.audioFileCache.checkManuallyOnCheckingFailed'.
		
		//Sets a function to call when the audio file sprites object is created successfully:
		onLoad: onCreate, //Optional but recommended. Will be stored in 'audioFileSprites.audioFileCache.onLoad'.
		
		//Sets a function to call when an error happens with the audio file sprites object:
		onError: function(error) { CB_console("Audio file sprites object failed: " + error); }, //Optional but recommended. Will be stored in 'audioFileSprites.audioFileCache.onError'.
		
		//Defines whether to create the CB_AudioFile objects automatically by calling the 'audioFileSprites.createAudioFiles' method internally (recommended) or not:
		//NOTE: if the 'disableAutoLoad' option is enabled, it is always necessary to call the 'audioFileSprites.createAudioFiles' manually.
		disableAutoLoad: false //Optional. Default: false. Set to undefined or null to use the default one. Internal usage only recommended.
	};

	//Creates the audio file sprites object:
	//NOTE: it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	var audioFileSprites = new CB_AudioFileSprites(audioFileSpritesData);

	//Checks the status constantly and shows the progress (optional):
	var lastProgress = null, currentProgress = null;
	var lastStatus = null, currentStatus = null;
	var checkLoadingContinue = true;
	var checkLoading = function()
	{
		//Shows the progress (if there were any changes):
		currentProgress = audioFileSprites.getProgress();
		if (currentProgress !== lastProgress)
		{
			CB_console("Progress: " + currentProgress);
			lastProgress = currentProgress;
		}
		
		//Shows the status (if there were any changes):
		//NOTE: it would also be possible to use the 'audioFileSprites.getStatusString' method which returns a string with the current status.
		currentStatus = audioFileSprites.getStatus();
		if (currentStatus !== lastStatus)
		{
			if (currentStatus === CB_AudioFileCache.UNLOADED) { CB_console("Unloaded"); }
			else if (currentStatus === CB_AudioFileCache.ABORTED) { CB_console("Aborted!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileCache.FAILED) { CB_console("Failed!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileCache.LOADING) { CB_console("Loading..."); }
			else if (currentStatus === CB_AudioFileCache.UNCHECKED) { CB_console("Unchecked! The 'audioFileSprites.checkPlayingAll' method needs to be called."); }
			else if (currentStatus === CB_AudioFileCache.CHECKING) { CB_console("Checking..."); }
			else if (currentStatus === CB_AudioFileCache.LOADED) { CB_console("Loaded! Now you can use the audio file sprites object freely."); checkLoadingContinue = false; }
			lastStatus = currentStatus;
		}
		
		if (checkLoadingContinue) { checkLoadingInterval = setTimeout(checkLoading, 1); }
	};
	var checkLoadingInterval = setTimeout(checkLoading, 1);
</code></pre>

<p>
	In the case that the audio file sprites object has the "checkManually" option enabled, we need to check each of its internally-used <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects. We can do that easily by calling the "checkPlayingAll" manually after the audio file sprites object has been created. It is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise):
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//If the "checkManually" option was set to true, we need to check all the CB_AudioFile objects manually (by calling their 'checkPlaying' method):
	audioFileSprites.checkPlayingAll
	(
		//callbackOk. Optional but recommended:
		function(performedActions, uncheckedObjects)
		{
			CB_console("Audio file sprites object checked successfully!");
			CB_console("Performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			CB_console("Unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
		},
		//callbackError. Optional but recommended:
		function(error, performedActions, uncheckedObjects)
		{
			CB_console("Audio file sprites object failed to be checked! Error: " + error);
			CB_console("Performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			CB_console("Unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
		},
		false //ignoreQueue. Optional. Default: false. Set to undefined or null to use the default one.
	);
</code></pre>

<p>
	After the audio file sprites object has been loaded successfully (and after calling "checkPlayingAll" successfully, if it was necessary), we can start using the audio file sprites object freely:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets the duration calculated among all the internal CB_AudioFile objects (as it can contain different formats, sometimes the duration may vary slightly):
	var audioFileSpritesDurationMinimum = audioFileSprites.getDuration(); //Minimum duration calculated among all the internal CB_AudioFile objects.
	var audioFileSpritesDurationMaximum = audioFileSprites.getDuration(true); //Maximum duration calculated among all the internal CB_AudioFile objects.

	//Defines a function to manage the CB_AudioFile when it is played:
	var manageAudioFile = function(soundInstanceId)
	{
		//Gets the CB_AudioFile used (through its sound instance identifier):
		var audioFile = audioFileSprites.getAudioFileBySoundInstanceId(soundInstanceId); //NOTE: This is just an example and not necessary, since "this" will already contain the used CB_AudioFile (if any).
		if (audioFile !== null)
		{
			CB_console("CB_AudioFile object got from the sound instance ID.");
			
			//Do things with it...
		}
	};
	
	//Plays one CB_AudioFile (if no one is free, it will create automatically a new one depending on the audio file sprites object options):
	var soundInstanceId = audioFileSprites.play
	(
		//Time in milliseconds where we want the audio to start at:
		0, //startAt. Optional. Default: 0 | CB_AudioFile#audioFileObject.lastStartAt | stopAt. Set to undefined or null to use the default one.
		
		//Time in milliseconds where we want the audio to stop at:
		null, //stopAt. Optional. Default: CB_AudioFile#audioFileObject.getDuration(). Set to undefined or null to use the default one.
		
		//Sets whether we want to play the audio looping (starting again and again) or just play it once:
		false, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.
		
		//Volume desired when playing the audio (this can also be changed on the fly, during playing):
		60, //volume. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME. Set to undefined or null to use the default one.
		
		//The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all. Used only when the audio is not able to play immediately:
		125, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		
		//Defines the maximum amount of time (in milliseconds) to allow delayed play by skipping a part of the audio:
		/*	NOTE:
			If provided and the time expired trying to start playing the sound without success is still inside this amount of time provided, it will try to play the sound but skipping the part of the audio which should have already been played already.
			In other words, it will try to start playing the sound as if the previous non-played part (which should have been playing during the time which already expired) was already being playing silently.
			Only used when the time set in the "allowedRecursiveDelay" parameter has been reached and the audio did not start playing yet.
		*/
		null, //allowedRecursiveDelaySkipping. Optional. Default: stopAt-startAt. Set to undefined or null to use the default one.
		
		//Function to be called when the audio starts playing successfully:
		function(soundInstanceId, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) //onPlayStart. Optional.
		{
			CB_console("Audio started playing!");
			
			//Manages the CB_AudioFile being used:
			manageAudioFile.call(this, soundInstanceId); //Note that "this" will contain the used CB_AudioFile (if any).
		},
		
		//Function to call when the sound stops playing:
		function(soundInstanceId) { CB_console("Audio stopped playing!"); }, //onStop. Optional.
		
		//Internal usage only recommended:
		undefined //spriteId. Optional. Default: '_WITHOUT_SPRITE_ASSOCIATED'. Set to undefined or null to use the default one.
	);

	//Tells whether any of the internal CB_AudioFile objects is playing:
	if (audioFileSprites.isPlaying()) { CB_console("One or more of the internal CB_AudioFile objects are playing."); }
	else { CB_console("None of the internal CB_AudioFile objects is playing."); }

	//Cancels (to prevent it starts playing) a sound instance (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods), by its identifier:
	audioFileSprites.cancelSoundInstance(soundInstanceId, true); //Use "false" as the second parameter to enable it again (if it is not too late).
	
	//Cancels (to prevent it starts playing) all sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods):
	audioFileSprites.cancelSoundInstances(true); //Use "false" as the first parameter to enable them again (if it is not too late).

	//Returns the CB_AudioFile objects used by all the sounds instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) currently created:
	var audioFilesUsed = audioFileSprites.getAudioFilesUsed(); //Returns an object with the data.
	var audioFilesUsed_2 = audioFileSprites.getAudioFilesUsed(true); //Returns an array with the data.
	var audioFilesUsed_3 = audioFileSprites.getAudioFilesUsed(false, true); //Returns an object with the data and including the CB_AudioFile objects whose sound instance ID is not associated to any sprite.
	
	//Returns an array of the CB_AudioFile objects used by the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) that belong to a given sprite identifier:
	var audioFilesUsed_4 = audioFileSprites.getAudioFilesUsedBySpriteId("uno");
	
	//Gets the number of CB_AudioFile objects created (stored in 'audioFileSprites.audioFileCache.audioFiles'):
	var audioFilesTotal = audioFileSprites.getAudioFilesNumber(true);
	
	//Gets an array with all the CB_AudioFile objects created (stored in 'audioFileSprites.audioFileCache.audioFiles'):
	var audioFiles = audioFileSprites.getAudioFiles(true);

	//Gets an array with the busy CB_AudioFile objects (the objects which are not available and ready to use):	
	var audioFilesBusy = audioFileSprites.getAudioFilesBusy();
	
	//Gets the current number of free CB_AudioFile objects (the number of objects which are available and ready to use):
	var audioFilesFreeTotal = audioFileSprites.getAudioFilesFreeNumber();
	
	//Gets an array with the free CB_AudioFile objects (the objects which are available and ready to use):
	var audioFilesFree = audioFileSprites.getAudioFilesFree();

	//Gets a single CB_AudioFile from the ones which are free (available and ready to use):
	//Note that the object returned will contain two properties: 'index' (the position of the CB_AudioFile object inside the 'audioFileSprites.audioFileCache.audioFiles' property if found or -1 otherwise) and 'object' (with the CB_AudioFile object if found or null otherwise).
	var audioFileFree = audioFileSprites.getFreeAudioFile(); //The CB_AudioFile object will not be "popped" (removed) from the 'audioFileSprites.audioFileCache.audioFilesFree' property.
	var audioFileFree_2 = audioFileSprites.getFreeAudioFile(true); //The CB_AudioFile object will also be "popped" (removed) from the 'audioFileSprites.audioFileCache.audioFilesFree' property.
	
	//Checks whether a CB_AudioFile object is free (available and ready to use), by its id:
	if (audioFileSprites.isAudioFileFree(audioFileFree.object.id)) { CB_console("The CB_AudioFile whose ID is " + audioFileFree.object.id + " is free!"); }
	else { CB_console("The CB_AudioFile whose ID is " + audioFileFree.object.id + " is not free (or it does not exist in the audio file sprites object)!"); }
</code></pre>

<p>
	One of the key points of the audio file sprites objects is to manage audio sprites:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Plays a sprite by its ID (calls the 'audioFileSprites.play' method internally and returns the same, so it can also generate sound instances):
	var soundInstanceId = audioFileSprites.playSprite
	(
		"cinco", //spriteId. Unique mandatory parameter.

		//Sets whether we want to play the audio looping (starting again and again) or just play it once:
		false, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.
		
		//Volume desired when playing the audio (this can also be changed on the fly, during playing):
		60, //volume. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME. Set to undefined or null to use the default one.

		//The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all. Used only when the audio is not able to play immediately:
		125, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		
		//Defines the maximum amount of time (in milliseconds) to allow delayed play by skipping a part of the audio:
		/*	NOTE:
			If provided and the time expired trying to start playing the sound without success is still inside this amount of time provided, it will try to play the sound but skipping the part of the audio which should have already been played already.
			In other words, it will try to start playing the sound as if the previous non-played part (which should have been playing during the time which already expired) was already being playing silently.
			Only used when the time set in the "allowedRecursiveDelay" parameter has been reached and the audio did not start playing yet.
		*/
		null, //allowedRecursiveDelaySkipping. Optional. Default: stopAt-startAt. Set to undefined or null to use the default one.

		//Function to be called when the audio starts playing successfully:
		function(soundInstanceId, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) //onPlayStart. Optional.
		{
			CB_console("Audio started playing!");
			
			//Manages the CB_AudioFile being used:
			manageAudioFile.call(this, soundInstanceId); //Note that "this" will contain the used CB_AudioFile (if any).
		},
		
		//Function to call when the sound stops playing:
		function(soundInstanceId) { CB_console("Audio stopped playing!"); } //onStop. Optional.
	);
	
	//Tells whether a given sprite (by its ID) is playing:
	//Note: there could be more than one sound instance (with a 'CB_AudioFile' object) by each sprite with different status (paused, stopped, etc.) and this method will return true if any of them is playing.
	if (audioFileSprites.isPlayingSprite("cinco")) { CB_console("The sprite is playing."); }
	else { CB_console("The sprite is not playing."); }

	//Tells whether a given sprite (by its ID) is paused:
	//Note: there could be more than one sound instance (with a 'CB_AudioFile' object) by each sprite with different status (paused, stopped, etc.) and this method will return true if any of them is paused.
	if (audioFileSprites.isPausedSprite("cinco")) { CB_console("The sprite is paused."); }
	else { CB_console("The sprite is not paused."); }

	//Tells whether a given sprite (by its ID) is stopped:
	//Note: there could be more than one sound instance (with a 'CB_AudioFile' object) by each sprite with different status (paused, stopped, etc.) and this method will only return true if all of them are stopped.
	if (audioFileSprites.isStoppedSprite("cinco")) { CB_console("The sprite is stopped."); }
	else { CB_console("The sprite is not stopped."); }

	//Returns the ID of all the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) used:
	var soundInstanceIDs = audioFileSprites.getSoundInstancesId(); //Returns an object with the data.
	var soundInstanceIDs_2 = audioFileSprites.getSoundInstancesId(true); //Returns an array with the data.
	var soundInstanceIDs_3 = audioFileSprites.getSoundInstancesId(true, true); //Returns an array with the data, including the sound instance identifiers which are not associated to any sprite.

	//Returns an array of the sound instance identifiers (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) used by the given sprite identifier:
	var soundInstanceIDs_4 = audioFileSprites.getSoundInstancesIdBySpriteId("cinco");

	//Sets the desired volume to all the CB_AudioFile objects that belong to the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) used by a given sprite identifier:
	audioFileSprites.setVolumeSprite("cinco", 80, false, function() { CB_console("Volume (80) set for the CB_AudioFile with ID " + this.id); });
	
	//Mutes all the CB_AudioFile objects that belong to the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) used by a given sprite identifier:
	audioFileSprites.muteSprite("cinco", function() { CB_console("CB_AudioFile with ID " + this.id + " muted!"); });
	
	//Unmutes all the CB_AudioFile objects that belong to the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) used by a given sprite identifier:
	audioFileSprites.unmuteSprite("cinco", function() { CB_console("CB_AudioFile with ID " + this.id + " unmuted!"); });
	
	//Pauses all the CB_AudioFile objects that belong to the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) which are playing used by a given sprite identifier:
	audioFileSprites.pauseSprite("cinco", function() { CB_console("CB_AudioFile with ID " + this.id + " paused!"); });
	
	//Resumes all the CB_AudioFile objects that belong to the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) used by a given sprite identifier:
	audioFileSprites.resumeSprite
	(
		"cinco", //spriteId. Unique mandatory parameter.
		null, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelaySkipping. Optional. Default: stopAt-startAt. Set to undefined or null to use the default one.
		function(soundInstanceId, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) { CB_console("CB_AudioFile with ID " + this.id + " playing"); }, //onPlayStart. Optional.
		function(soundInstanceId) { CB_console("CB_AudioFile with ID " + this.id + " stopped!"); }, //onStop. Optional.
	);
	
	//Stops all the CB_AudioFile objects that belong to the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) which are playing used by a given sprite identifier:
	audioFileSprites.stopSprite("cinco");
</code></pre>

<p>
	Some more advanced sprites management examples:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets a sprite by its ID:
	//NOTE: if not found, the returning object will contain a property named "fake" whose value will be set to true.
	var sprite = audioFileSprites.getSprite("dos"); //Returns an object with 'startAt' and 'stopAt' properties.
	
	//Gets all the sprites:
	var sprites = audioFileSprites.getSprites(); //Returns an object whose property names is each sprite ID and the value is an object with 'startAt' and 'stopAt' properties.
	
	//Inserts a sprite, keeping the existing ones. If a sprite ID already existed and it is given again (not recommended), it will be replaced by the new one (but keeping its current sound instances, if any):
	audioFileSprites.insertSprite({ startAt : 123, stopAt: 678 }, "sprite_id");
	
	//Sets the 'startAt' and 'stopAt' properties of a sprite (by its ID):
	audioFileSprites.setStartAtSprite("sprite_id", 99);
	audioFileSprites.setStopAtSprite("sprite_id", 12345);

	//Inserts sprites, keeping the existing ones. If a sprite ID already existed and it is given again (not recommended), it will be replaced by the new one (but keeping its current sound instances, if any):
	audioFileSprites.insertSprites({ "sprite_id_1" : { startAt: 12, stopAt: 100 }, "sprite_id_2" : { startAt: 110, stopAt: 200 } });
	
	//Remove a sprite by its ID:
	var removed = audioFileSprites.removeSprite("sprite_id"); //Returns true if it gets removed.
	
	//Removes all the sprites:
	audioFileSprites.removeSprites();
</code></pre>

<p>
	In case we need it, we can also get the internal <a href="_html/_doc/api/CB_AudioFileCache.html" target="_blank">CB_AudioFileCache</a> object to manage it:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Gets the internal CB_AudioFileCache object:
	var audioFileCache = audioFileSprites.audioFileCache;
	
	//Do things with it...
</code></pre>
<p>
	You can read more about the <a href="_html/_doc/api/CB_AudioFileCache.html" target="_blank">CB_AudioFileCache</a> class in the <a href="<?php echo basicTutorialLink("audio", "audio_files_cache"); ?>" target="_blank">Audio files cache</a> topic.
</p>

<p>
	Although the <a href="_html/_doc/api/CB_AudioFileCache.html" target="_blank">CB_AudioFileCache</a> object (used internally by <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> objects) can automatically create new internal <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects or remove them when needed, it is also possible to create new ones or remove current ones manually:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Tries to create a new internal CB_AudioFile object:
	//NOTE: it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	var audioFile = audioFileSprites.createAudioFile
	(
		null, //URIs. Optional. Default: audioFileSprites.audioFileCache.URIs. Set to undefined or null to use the default one.
		["WAAPI", "AAPI", "SM2", "ACMP"], //preferredAPIs. Optional. Default: audioFileSprites.audioFileCache.preferredAPIs. Set to undefined or null to use the default one.
		null, //preferredFormats. Optional. Default: audioFileSprites.audioFileCache.preferredFormats. Set to undefined or null to use the default one.
		null, //audioObject. Optional. Set to undefined or null to create a new one instead of reusing the given one.
		function() { CB_console("CB_AudioFile object created!"); }, //callbackOk. Optional but recommended.
		function(error) { CB_console("CB_AudioFile object could not be created! Error: " + error); }, //callbackError. Optional but recommended.
		//Other parameters. Internal usage only recommended:
		undefined, //storeURIsList. Optional. Default: false. Set to undefined or null to use the default one.
		undefined //checkAutomatically. Optional. Default: false. Set to undefined or null to use the default one.
	);

	//Tries to create new internal CB_AudioFile objects until reaching the minimum given (if not reached yet):
	/*	NOTE:
		It is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
		If the 'disableAutoLoad' option is enabled, it is always necessary to call the 'audioFileSprites.createAudioFiles' manually.
	*/
	audioFileSprites.createAudioFiles(8); //The given number will be stored in 'audioFileSprites.audioFileCache.minimumAudioFiles'.
	
	//Removes the desired internal CB_AudioFile object:
	audioFileSprites.removeAudioFile("audio_file_object_id"); //As the first parameter it accepts either a CB_AudioFile object or its ID.
</code></pre>

<p>
	One of the most interesting features when managing audio file sprites objects with CrossBrowdy is that you can change the audio API of all their internal <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects on the fly (even when they are currently playing!). This can be done easily:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Tries to changes the audio API used by all the internal CB_AudioFile objects (this will work even on the fly, when they are currently playing):
	audioFileSprites.setAudioAPIAll
	(
		//preferredAPIs. Unique mandatory parameter:
		["AAPI", "SM2"], //Array of strings with order of preference or a single string with the unique desired API.
		
		//callbackOk. Optional but recommended:
		function(objectsChangedAPI, performedActions, actionsNeeded)
		{
			CB_console("Setting the desired audio API(s) succeeded!");
			CB_console("Number of CB_AudioFile objects that actually changed its audio API: " + objectsChangedAPI);
			CB_console("Number of CB_AudioFile objects that ended with a desired audio API, including those ones which were already using it: " + performedActions);
			CB_console("Total number of CB_AudioFile objects that were considered to perform the action (it will be undefined if it could not be determined): " + actionsNeeded);
		},
		
		//callbackError. Optional but recommended:
		function(error, errorsHappened, objectsChangedAPI, performedActions, actionsNeeded)
		{
			CB_console("Setting the desired audio API(s) could not be performed! Error: " + error);
			CB_console("Number of errors that happened (could be greater than 1 if more than one internal call to the CB_AudioFile#setAudioAPI method failed): " + errorsHappened);
			CB_console("Number of CB_AudioFile objects that actually changed its audio API: " + objectsChangedAPI);
			CB_console("Number of CB_AudioFile objects that ended with a desired audio API, including those ones which were already using it: " + performedActions);
			CB_console("Total number of CB_AudioFile objects that were considered to perform the action (it will be undefined if it could not be determined): " + actionsNeeded);
		},
		
		//isMandatory. Optional. Default: false. Set to undefined or null to use the default one:
		false,
		
		//forceReload. Optional. Default: false. Set to undefined or null to use the default one:
		false,
		
		//audioFiles. Optional. Default: audioFileSprites.audioFileCache.audioFiles. Set to undefined or null to use the default one:
		undefined
	);
	
	//Tries to change the audio API used by all the internal CB_AudioFile objects that belong to the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) used by a given sprite identifier:
	audioFileSprites.setAudioAPISprite
	(
		"dos", //spriteId. Mandatory.
		
		//preferredAPIs. Mandatory:
		["WAAPI", "AAPI"], //In order of preference.
		
		//callbackOk. Optional but recommended:
		function(objectsChangedAPI, performedActions, actionsNeeded)
		{
			CB_console("Setting the desired audio API(s) succeeded!");
			CB_console("Number of CB_AudioFile objects that actually changed its audio API: " + objectsChangedAPI);
			CB_console("Number of CB_AudioFile objects that ended with a desired audio API, including those ones which were already using it: " + performedActions);
			CB_console("Total number of CB_AudioFile objects that were considered to perform the action (it will be undefined if it could not be determined): " + actionsNeeded);
		},
		
		//callbackError. Optional but recommended:
		function(error, errorsHappened, objectsChangedAPI, performedActions, actionsNeeded)
		{
			CB_console("Setting the desired audio API(s) could not be performed! Error: " + error);
			CB_console("Number of errors that happened (could be greater than 1 if more than one internal call to the CB_AudioFile#setAudioAPI method failed): " + errorsHappened);
			CB_console("Number of CB_AudioFile objects that actually changed its audio API: " + objectsChangedAPI);
			CB_console("Number of CB_AudioFile objects that ended with a desired audio API, including those ones which were already using it: " + performedActions);
			CB_console("Total number of CB_AudioFile objects that were considered to perform the action (it will be undefined if it could not be determined): " + actionsNeeded);
		},
		
		//isMandatory. Optional. Default: false. Set to undefined or null to use the default one:
		false,
		
		//forceReload. Optional. Default: false. Set to undefined or null to use the default one:
		false
	);
</code></pre>

<p>
	Apart from some previous methods seen before, it is also possible to perform other bulk actions that will affect all the internal <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects that the audio file sprites object uses:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Executes a function over all the internal CB_AudioFile objects (being "this" each CB_AudioFile itself):
	//Note: same as 'audioFileSprites.executeAll' and 'audioFileSprites.executeFunctionAll'.
	audioFileSprites.forEach(function(index) { CB_console("CB_AudioFile ID: " + this.id); });
	audioFileSprites.forEach(function(index) { CB_console("CB_AudioFile ID: " + this.id); }, 100); //Adds a 100 milliseconds delay between each call.

	//Executes a function over all the internal CB_AudioFile objects used by all the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) currently created (being "this" each CB_AudioFile itself):
	//Note: same as 'audioFileSprites.executeAllSprites' and 'audioFileSprites.executeFunctionAllSprites'.
	audioFileSprites.forEachSprite(function(index) { CB_console("CB_AudioFile ID: " + this.id); });
	audioFileSprites.forEachSprite(function(index) { CB_console("CB_AudioFile ID: " + this.id); }, 150); //Adds a 150 milliseconds delay between each call.
	
	//Executes a function over all the internal CB_AudioFile objects used by the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) that belong to a given sprite, by its ID (being "this" each CB_AudioFile itself):
	//Note: same as 'audioFileSprites.executeAllSprite' and 'audioFileSprites.executeFunctionAllSprite'.
	audioFileSprites.forEachSpriteById("tres", function(index) { CB_console("CB_AudioFile ID: " + this.id); });
	audioFileSprites.forEachSpriteById("tres", function(index) { CB_console("CB_AudioFile ID: " + this.id); }, 200); //Adds a 200 milliseconds delay between each call.

	//Plays all the CB_AudioFile objects:
	audioFileSprites.playAll
	(
		0, //startAt. Optional. Default: 0 | CB_AudioFile#audioFileObject.lastStartAt | stopAt. Set to undefined or null to use the default one.
		null, //stopAt. Optional. Default: CB_AudioFile#audioFileObject.getDuration(). Set to undefined or null to use the default one.
		null, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.
		null, //volume. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME. Set to undefined or null to use the default one.
		false, //avoidDelayedPlay. Optional. Default: false. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		function(startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) { CB_console("CB_AudioFile with ID " + this.id + " playing"); }, //onPlayStart. Optional.
		function() { CB_console("CB_AudioFile with ID " + this.id + " stopped!"); }, //onStop. Optional.
		false //includingPlaying. Optional. Default: false. Set to undefined or null to use the default one.
	);

	//Sets the desired volume to all the CB_AudioFile objects:
	audioFileSprites.setVolumeAll(80, false, function() { CB_console("Volume (80) set for the CB_AudioFile with ID " + this.id); });
	
	//Mutes all the CB_AudioFile objects:
	audioFileSprites.muteAll(function() { CB_console("CB_AudioFile with ID " + this.id + " muted!"); });
	
	//Unmutes all the CB_AudioFile objects:
	audioFileSprites.unmuteAll(function() { CB_console("CB_AudioFile with ID " + this.id + " unmuted!"); });
	
	//Pauses all the CB_AudioFile objects:
	audioFileSprites.pauseAll(function() { CB_console("CB_AudioFile with ID " + this.id + " paused!"); });
	
	//Resumes all CB_AudioFile objects:
	audioFileSprites.resumeAll
	(
		null, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelaySkipping. Optional. Default: CB_AudioFile#lastStopAt-CB_AudioFile#lastStartAt. Set to undefined or null to use the default one.
		function(soundInstanceId, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) { CB_console("CB_AudioFile with ID " + this.id + " playing"); }, //onPlayStart. Optional.
		function(soundInstanceId) { CB_console("CB_AudioFile with ID " + this.id + " stopped!"); }, //onStop. Optional.
		null, //audioFiles. Optional. Default: audioFileSprites.audioFileCache.audioFiles. Set to undefined or null to use the default one.
		//Internal usage only recommended:
		undefined //spriteId. Optional. Default: '_WITHOUT_SPRITE_ASSOCIATED'. Set to undefined or null to use the default one.
	);

	//Plays and stops all the CB_AudioFile objects:
	//Note: it can be useful for some clients which need the CB_AudioFile#play method to be called through a user-driven event (as onClick, onTouch, etc.).
	audioFileSprites.playAndStopAll(); //It will not try to play those which are already playing. With the default delay before stopping them (100 milliseconds).
	audioFileSprites.playAndStopAll(true, 500); //It will try to play again even those which are already playing. With a delay of 500 milliseconds before stopping them.
	
	//Stops all the CB_AudioFile objects:
	audioFileSprites.stopAll();
</code></pre>
<p>
	It is interesting to know that the methods above can also accept an array of <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects as a parameter to only affect those objects instead of all the internal ones.
</p>

<p>
	Some other interesting methods that you might not need:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Clears the sound instances (created by the 'audioFileSprites.play' and 'audioFileSprites.playSprite' methods) which have been cancelled:
	audioFileSprites.clearSoundInstances();
	
	//Tries to purge the audio file sprites object until it reaches a desired number of CB_AudioFile objects (set in the 'audioFileSprites.audioFileCache.audioFiles' property), removing and destroying some of the current CB_AudioFile objects. For performance purposes:
	audioFileSprites.purge(10); //It tries to go down to ten CB_AudioFile objects.

	//Cleans the 'audioFileSprites.audioFileCache.audioFiles' array, taking off (destroying and removing) the CB_AudioFile objects which are undefined or null. For performance purposes. Internal usage only recommended:
	audioFileSprites.clearAudioFiles();
</code></pre>

<p>
	In order to free memory and resources, it is possible to destroy the audio file sprites object and its internal <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Destroys all the internal CB_AudioFile objects (but neither the audio file cache object nor the audio file sprites object) by calling 'audioFileSprites.audioFileCache.destroyAll' internally, and frees memory:
	audioFileSprites.destroyAll();
	audioFileSprites.destroyAll(true); //Also stops sounds.
	
	//Destroys the audio file sprites object and its audio file cache object, including all the internal CB_AudioFile objects, and frees memory (already calls the 'audioFileSprites.audioFileCache.destroyAll' method internally):
	audioFileSprites.destructor();
	audioFileSprites.destructor(true); //Also stops sounds.
</code></pre>

<p>
	It is also possible to re-load again an audio file sprites object:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Loads the audio file sprites object again with the data given:
	/*	NOTE:
		It is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
		If the 'disableAutoLoad' option is enabled, it is always necessary to call the 'audioFileSprites.createAudioFiles' manually.
	*/
	audioFileSprites.load(audioFileSpritesData); //The object in the parameter has the same format that the one used by the constructor of the CB_AudioFileSprites class.
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> class.
</p>