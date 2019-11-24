CB_init(main); //It will call the "main" function when ready.

//Defines the audios in different audio files (providing different formats, paths and data URIs):
//NOTE: CrossBrowdy will choose the best one(s) for the current client automatically.
var currentURL = location.href;
currentURL = currentURL.substring(0, currentURL.lastIndexOf("/") !== -1 ? currentURL.lastIndexOf("/") : currentURL.length) + "/audio/";
var dataURIs = //Here we could define the data URIs for the audios, in their values (but too long for this example):
{
	"numeros.mp3" : null,
	"numeros.ogg" : null,
	"numeros.m4a" : null,
	"numeros.wav" : null,

	"arriba_el_ritmo_valencia.mp3" : null,
	"arriba_el_ritmo_valencia.ogg" : null,
	"arriba_el_ritmo_valencia.m4a" : null,
	"arriba_el_ritmo_valencia.wav" : null
};
var audioURIs =
{
	"numeros" :
	{
		"audio/mpeg" :
		[
			currentURL + "numeros.mp3", //Absolute path.
			"numeros.mp3", //Relative path.
			dataURIs["numeros.mp3"] //Data URI.
		],
		"audio/ogg" :
		[
			currentURL + "numeros.ogg", //Absolute path.
			"numeros.ogg", //Relative path.
			dataURIs["numeros.ogg"] //Data URI.
		],
		"audio/mp4" :
		[
			currentURL + "numeros.m4a", //Absolute path.
			"numeros.m4a", //Relative path.
			dataURIs["numeros.m4a"] //Data URI.
		],
		"audio/wav" :
		[
			currentURL + "numeros.wav", //Absolute path.
			"numeros.wav", //Relative path.
			dataURIs["numeros.wav"] //Data URI.
		]
	},
	"arriba_el_ritmo_valencia" :
	{
		"audio/mpeg" :
		[
			currentURL + "arriba_el_ritmo_valencia.mp3", //Absolute path.
			"arriba_el_ritmo_valencia.mp3", //Relative path.
			dataURIs["arriba_el_ritmo_valencia.mp3"] //Data URI.
		],
		"audio/ogg" :
		[
			currentURL + "arriba_el_ritmo_valencia.ogg", //Absolute path.
			"arriba_el_ritmo_valencia.ogg", //Relative path.
			dataURIs["arriba_el_ritmo_valencia.ogg"] //Data URI.
		],
		"audio/mp4" :
		[
			currentURL + "arriba_el_ritmo_valencia.m4a", //Absolute path.
			"arriba_el_ritmo_valencia.m4a", //Relative path.
			dataURIs["arriba_el_ritmo_valencia.m4a"] //Data URI.
		],
		"audio/wav" :
		[
			currentURL + "arriba_el_ritmo_valencia.wav", //Absolute path.
			"arriba_el_ritmo_valencia.wav", //Relative path.
			dataURIs["arriba_el_ritmo_valencia.wav"] //Data URI.
		]
	}
};

//Defines the sprites information:
/*	NOTE:
	If "startAt" is not provided, it will use the value of 0 (zero) which means that it will start from the beginning.
	If "stopAt" is not provided (not recommended), it will use the whole duration of the file (which means until it reaches its end).
	Due to some possible problems between clients with different audio APIs calculating the duration of an audio file, it is recommended to always set the "stopAt" property even when we want it to stop at the end of the audio.
*/
var audioSprites =
{
	//Sprite group identifiers (case-sensitive):
	"numeros" :
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
	},
	"arriba_el_ritmo_valencia" :
	{
		"ALL" :
		{
			"startAt" : 0,
			"stopAt" : null //Until the end. Note that the recommended way is to always provide the quantity in milliseconds as explained above.
		},
		"Valencia" :
		{
			"startAt" : 13650,
			"stopAt" : 14600
		},
		"let_s_go" :
		{
			"startAt" : 34300,
			"stopAt" : 35200
		},
		"el_ritmo" :
		{
			"startAt" : 51000,
			"stopAt" : 52100
		},
		"arriba" :
		{
			"startAt" : 56600,
			"stopAt" : 57400
		},
		"DJ" :
		{
			"startAt" : 103000,
			"stopAt" : 104200
		},
		"come_on" :
		{
			"startAt" : 128000,
			"stopAt" : 128900
		},
		"todos_a_la_pista" :
		{
			"startAt" : 178200,
			"stopAt" : 179650
		},
		"yi_hi" :
		{
			"startAt" : 196000,
			"stopAt" : 197000
		},
		"que_bueno" :
		{
			"startAt" : 277100,
			"stopAt" : 278200
		},
		"asaco" :
		{
			"startAt" : 294200,
			"stopAt" : 294980
		},
		"no_pare_la_marcha" :
		{
			"startAt" : 295040,
			"stopAt" : 296420
		}
	}
};

//Defines the function to call when an audio file sprites object is created or expanding:
var onCreateSpritesGroup = function(audioFileObjectsToCheck)
{
	printMessage("Audio file sprites object (CB_AudioFileSprites) created or expanding! CB_AudioFile objects that still need to be checked: " + audioFileObjectsToCheck);
	printMessage("CB_AudioFileSprites ID: " + this.id);
	printMessage("CB_AudioFileSprites Status: " + this.getStatusString()); //Same as audioFileSpritesPool.audioFileSprites[this.id].getStatusString().
	if (audioFileObjectsToCheck > 0) { printMessage("You can call the 'audioFileSpritesPool.audioFileSprites['" + this.id + "'].checkPlayingAll' method to check all the CB_AudioFile objects."); }
	this.onLoad = null; //Prevents to execute this function again (otherwise, it could be executed again after the object grows automatically to create more 'CB_AudioFile' objects).
};

//Defines the function to call when the audio file sprites pool object is created:
var onCreate = function(audioFileObjectsToCheck)
{
	printMessage("Audio file sprites pool object created! CB_AudioFile objects that still need to be checked: " + audioFileObjectsToCheck);
	printMessage("ID: " + this.id); //Same as audioFileSpritesPool.id.
	printMessage("Status: " + this.getStatusString()); //Same as audioFileSpritesPool.getStatusString().
	if (audioFileObjectsToCheck > 0)
	{
		printMessage("You can call the 'audioFileSpritesPool.checkPlayingAll' method to check all the CB_AudioFile objects.");
		
		//Hides the loading message:
		CB_Elements.hideById("loading");
		
		//Shows the button for checking the CB_AudioFile objects:
		CB_Elements.showById("check");
	}
	this.onLoad = null; //Prevents to execute this function again (otherwise, it could be executed again after the object grows automatically to create more 'CB_AudioFile' objects).
};

//Defines the data for the audio file sprites pool object with all possible options:
var audioFileSpritesPoolData =
{
	//Identifier for the audio file sprites pool object:
	id: "audio_file_sprites_pool_id", //Optional. Will be stored in 'audioFileSpritesPool.id'.

	//Sprites groups (each will create a CB_AudioFileSprites object internally):
	"spritesGroups" :
	{
		//Sprites group "numeros" (it will be used as its ID) which will create a CB_AudioFileSprites object internally:
		"numeros" : //This object has the same format that uses the 'audioFileSpritesPool.insertSpritesGroup' method (indeed, it is called internally).
		{
			//Defines the same audio but in different audio files (providing different formats, paths and data URIs):
			"URIs" : audioURIs["numeros"],

			//Defines the sprites information:
			"sprites" : audioSprites["numeros"],

			//Sets a function to call when the audio file sprites object is created successfully:
			onLoad: onCreateSpritesGroup, //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].onLoad'.

			//Sets a function to call when an error happens with the audio file sprites object:
			onError: function(error) { printMessage("Audio file sprites object (" + this.id + ") failed: " + error); } //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].onError'.
		},

		//Sprites group "arriba_el_ritmo_valencia" (it will be used as its ID) which will create a CB_AudioFileSprites object internally:
		"arriba_el_ritmo_valencia" : //This object has the same format that uses the 'audioFileSpritesPool.insertSpritesGroup' method (indeed, it is called internally).
		{
			//Defines the same audio but in different audio files (providing different formats, paths and data URIs):
			"URIs" : audioURIs["arriba_el_ritmo_valencia"],

			//Defines the sprites information:
			"sprites" : audioSprites["arriba_el_ritmo_valencia"],

			//Sets a function to call when the audio file sprites object is created successfully:
			onLoad: onCreateSpritesGroup, //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].onLoad'.

			//Sets a function to call when an error happens with the audio file sprites object:
			onError: function(error) { printMessage("Audio file sprites object (" + this.id + ") failed: " + error); } //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].onError'.
		}
	},

	/* General options for the audio file sprites pool object (can be overridden when they are specified in the options of a sprites group): */

	//Minimum CB_AudioFile objects that will be needed internally:
	minimumAudioFiles: 10, //Optional. Default: CB_AudioFileCache.minimumAudioFiles_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.minimumAudioFiles'.

	//Maximum CB_AudioFile objects that will be created internally:
	maximumAudioFiles: 30, //Optional. Default: CB_AudioFileCache.maximumAudioFiles_DEFAULT. Set to undefined to use the default one. Set to null to have no maximum. Will be stored in 'audioFileSpritesPool.maximumAudioFiles'.

	//Minimum free CB_AudioFile objects that will be needed internally. One CB_AudioFile object is free when it is not being played.
	minimumAudioFilesFree: 7, //Optional. Default: parseInt(audioFileSpritesPool.minimumAudioFiles * 0.25 + 0.5). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.minimumAudioFilesFree'.

	//Defines the number of new CB_AudioFile objects to create automatically when they are needed:
	newAudioFilesWhenNeeded: 3, //Optional. Default: Math.min(parseInt(audioFileSpritesPool.minimumAudioFiles * 0.1 + 0.5), 1). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.newAudioFilesWhenNeeded'.

	//Defines whether we want to check all CB_AudioFile objects automatically or manually (we will need to call the 'checkPlayingAll' method):
	checkManually: true, //Optional. Default: CB_AudioFileCache.checkManually_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.checkManually'.

	//Sets a function to call when the audio file sprites pool object is created successfully:
	onLoad: onCreate, //Optional but recommended. Will be stored in 'audioFileSpritesPool.onLoad'.

	//Sets a function to call when an error happens with the audio file sprites pool object:
	onError: //Optional but recommended. Will be stored in 'audioFileSpritesPool.onError'.
		function(error)
		{
			printMessage("Audio file sprites pool object failed: " + error);
			
			//Hides the loading message:
			CB_Elements.hideById("loading");

			//Show the button for creating the audio sprites pool object again:
			CB_Elements.showById("create");
		}
};

var audioFileSpritesPool = null; //It will store the audio sprites pool object.


//This function will be called when CrossBrowdy is ready:
function main()
{
	//Shows the current speaker volume:
	CB_Elements.id("volume_speaker").value = CB_Speaker.getVolume();
	
	//Hides the loading message:
	CB_Elements.hideById("loading");

	//Show the button for creating the audio sprites pool object:
	CB_Elements.showById("create");
}


//Sets the volume desired for the speaker (it will affect all sounds):
function setVolumeSpeaker()
{
	//Returns the current volume:
	var volumeCurrent = CB_Speaker.getVolume();

	var volume = CB_Speaker.sanitizeVolume(CB_Elements.id("volume_speaker").value);
	printMessage("Current speaker volume is " + volumeCurrent + ". Setting volume " + volume + " to the speaker (it will affect all CB_AudioFile objects from the CB_AudioFileSpritesPool object stored in CB_Speaker)...");
	
	var volumeSanitized = CB_Speaker.sanitizeVolume(volume);
	if (parseFloat(volume) !== volumeSanitized) { printMessage("Volume was sanitized from " + volume + " to " + volumeSanitized); }

	//Sets the given volume:
	CB_Speaker.setVolume(volumeSanitized);
	
	CB_Elements.id("volume_speaker").value = CB_Speaker.getVolume();
}


//Mutes the speaker (it will affect all sounds):
function muteSpeaker()
{
	printMessage("Muting the speaker (it will affect all CB_AudioFile objects from the CB_AudioFileSpritesPool object stored in CB_Speaker)...");
	
	//Mutes the speaker:
	CB_Speaker.mute();
	
	CB_Elements.id("volume_speaker").value = CB_Speaker.getVolume();
}


//Unmutes the speaker (it will affect all sounds):
function unmuteSpeaker()
{
	printMessage("Unmuting the speaker (it will affect all CB_AudioFile objects from the CB_AudioFileSpritesPool object stored in CB_Speaker)...");
	
	//Unmutes the speaker:
	CB_Speaker.unmute();
	
	CB_Elements.id("volume_speaker").value = CB_Speaker.getVolume();
}


//Clears all the sound instances which are not used anymore:
function clearSoundInstances()
{
	audioFileSpritesPool.clearSoundInstances();
}


//Plays all the CB_AudioFile objects:
function playAll()
{
	var volume = CB_Elements.id("volume_all").value;
	printMessage("Playing all the CB_AudioFile objects (volume " + volume + ")...");
	
	var volumeSanitized = CB_Speaker.sanitizeVolume(volume);
	if (parseFloat(volume) !== volumeSanitized) { printMessage("Volume was sanitized from " + volume + " to " + volumeSanitized); }
	
	audioFileSpritesPool.playAll
	(
		0, //startAt. Optional. Default: 0 | CB_AudioFile#audioFileObject.lastStartAt | stopAt. Set to undefined or null to use the default one.
		null, //stopAt. Optional. Default: CB_AudioFile#audioFileObject.getDuration(). Set to undefined or null to use the default one.
		null, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.
		volumeSanitized, //volume. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME. Set to undefined or null to use the default one.
		false, //avoidDelayedPlay. Optional. Default: false. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		function(startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) { printMessage("CB_AudioFile with ID " + this.id + " playing! (volume: " + this.getVolume() + ")"); }, //onPlayStart. Optional.
		function() { printMessage("CB_AudioFile with ID " + this.id + " stopped!"); }, //onStop. Optional.
		false //includingPlaying. Optional. Default: false. Set to undefined or null to use the default one.
	);
}


//Sets the desired volume to all the CB_AudioFile objects:
function setVolumeAll()
{
	var volume = CB_Speaker.sanitizeVolume(CB_Elements.id("volume_all").value);
	printMessage("Set volume " + volume + " to all the CB_AudioFile objects...");
	
	var volumeSanitized = CB_Speaker.sanitizeVolume(volume);
	if (parseFloat(volume) !== volumeSanitized) { printMessage("Volume was sanitized from " + volume + " to " + volumeSanitized); }
	
	audioFileSpritesPool.setVolumeAll(volumeSanitized, false, function() { printMessage("Volume (" + this.getVolume() + ") set for the CB_AudioFile with ID " + this.id); CB_Elements.id("volume_all").value = this.getVolume(); });
}


//Mutes all the CB_AudioFile objects:
function muteAll()
{
	printMessage("Muting all the CB_AudioFile objects...");
	audioFileSpritesPool.muteAll(function() { printMessage("CB_AudioFile with ID " + this.id + " muted!"); CB_Elements.id("volume_all").value = this.getVolume(); });
}


//Unmutes all the CB_AudioFile objects:
function unmuteAll()
{
	printMessage("Unmuting all the CB_AudioFile objects...");
	audioFileSpritesPool.unmuteAll(function() { printMessage("CB_AudioFile with ID " + this.id + " unmuted!"); CB_Elements.id("volume_all").value = this.getVolume(); });
}


//Pauses all the CB_AudioFile objects:
function pauseAll()
{
	printMessage("Pausing all the CB_AudioFile objects...");
	audioFileSpritesPool.pauseAll(function() { printMessage("CB_AudioFile with ID " + this.id + " paused!"); });
}


//Resumes all CB_AudioFile objects:
function resumeAll()
{
	printMessage("Resuming all the CB_AudioFile objects...");
	audioFileSpritesPool.resumeAll
	(
		null, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelaySkipping. Optional. Default: CB_AudioFile#lastStopAt-CB_AudioFile#lastStartAt. Set to undefined or null to use the default one.
		function(soundInstanceId, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) { printMessage("CB_AudioFile with ID " + this.id + " playing"); }, //onPlayStart. Optional.
		function(soundInstanceId) { printMessage("CB_AudioFile with ID " + this.id + " stopped!"); }, //onStop. Optional.
		null, //audioFiles. Optional. Default: CB_AudioFileSprites#audioFileCache.audioFiles. Set to undefined or null to use the default one.
		//Internal usage only recommended:
		undefined //spriteId. Optional. Default: '_WITHOUT_SPRITE_ASSOCIATED'. Set to undefined or null to use the default one.
	);
}


//Plays and stops all the CB_AudioFile objects:
function playAndStopAll()
{
	printMessage("Playing and then stopping all the CB_AudioFile objects...");
	//Note: it can be useful for some clients which need the CB_AudioFile#play method to be called through a user-driven event (as onClick, onTouch, etc.).
	audioFileSpritesPool.playAndStopAll(); //It will not try to play those which are already playing. With the default delay before stopping them (100 milliseconds).
}


//Stops all the CB_AudioFile objects:
function stopAll()
{
	printMessage("Stopping all the CB_AudioFile objects...");
	audioFileSpritesPool.stopAll();
}	


//Changes the audio API to the desired ones (in order of preference):
function setAudioAPIAll(audioAPIs)
{
	printMessage("Trying to set the following audio API(s) in order of preference: " + audioAPIs);
	
	//Tries to changes the audio API used by all the internal CB_AudioFile objects (this will work even on the fly, when they are currently playing):
	audioFileSpritesPool.setAudioAPIAll
	(
		//preferredAPIs. Unique mandatory parameter:
		audioAPIs, //Array of strings with order of preference or a single string with the unique desired API.

		//callbackOk. Optional but recommended:
		function(objectsChangedAPI, performedActions, actionsNeeded)
		{
			printMessage("Setting the desired audio API(s) succeeded!");
			printMessage("Number of CB_AudioFile objects that actually changed its audio API: " + objectsChangedAPI);
			printMessage("Number of CB_AudioFile objects that ended with a desired audio API, including those ones which were already using it: " + performedActions);
			printMessage("Total number of CB_AudioFile objects that were considered to perform the action (it will be undefined if it could not be determined): " + actionsNeeded);
		},

		//callbackError. Optional but recommended:
		function(errors, errorsHappened, objectsChangedAPI, performedActions, actionsNeeded)
		{
			printMessage("Setting the desired audio API(s) could not be performed!");
			for (var spritesGroupID in errors)
			{
				printMessage(spritesGroupID + " => " + errors[spritesGroupID].error);
				printMessage("* Number of errors that happened (could be greater than 1 if more than one internal call to the CB_AudioFile#setAudioAPI method failed): " + errors[spritesGroupID].errors);
				printMessage("* Number of objects that actually changed its audio API: " + errors[spritesGroupID].changed);
				printMessage("* Number of CB_AudioFile objects that ended with a desired audio API, including those ones which were already using it: " + errors[spritesGroupID].performed);
				printMessage("* Total number of CB_AudioFile objects that were considered to perform the action (it will be undefined if it could not be determined): " + errors[spritesGroupID].needed);
			}
			printMessage("Total number of errors that happened (could be greater than 1 if more than one internal call to the CB_AudioFile#setAudioAPI method failed): " + errorsHappened);
			printMessage("Total number of CB_AudioFile objects that actually changed its audio API: " + objectsChangedAPI);
			printMessage("Total number of CB_AudioFile objects that ended with a desired audio API, including those ones which were already using it: " + performedActions);
			printMessage("Total number of CB_AudioFile objects that were considered to perform the action (it will be undefined if it could not be determined): " + actionsNeeded);
		},

		//isMandatory. Optional. Default: false. Set to undefined or null to use the default one:
		false,

		//forceReload. Optional. Default: false. Set to undefined or null to use the default one:
		false,

		//audioFiles. Optional. Default: CB_AudioFileSprites#audioFileCache.audioFiles. Set to undefined or null to use the default one:
		undefined
	);
}


//Destroys the audio file sprites pool object:
function destructor()
{
	printMessage("Destroying the 'CB_AudioFileSpritesPool' object...");
	//Destroys the audio file sprites pool object (removing all sprites, etc.), including the internal audio file sprites objects, and frees memory (already calls the 'audioFileSpritesPool.destroyAll' method internally):
	audioFileSpritesPool.destructor(true); //Also stops sounds.
}


//Prints a message:
var lineNumber = 0;
function printMessage(message)
{
	message = CB_trim(message);
	if (message === "") { CB_Elements.insertContentById('messages', ""); CB_Elements.hideById("clear_messages"); }
	else { CB_Elements.appendContentById('messages', '<span class="line_number">[' + (++lineNumber) + ']</span> ' + message + '<br />'); CB_Elements.showById("clear_messages", "inline"); }
	CB_Elements.id("messages").scrollTop = CB_Elements.id("messages").scrollHeight; //Scrolls to the bottom.
}


//Creates/reloads the audio sprites pool:
function createAudioSpritesPool()
{
	//Hides the button for creating the audio sprites pool object:
	CB_Elements.hideById("create");

	//Hides the controls:
	CB_Elements.hideById("controls");

	//Shows the loading message:
	CB_Elements.insertContentById("loading", "Loading...");
	CB_Elements.showById("loading");
	
	//Gets the current internal CB_AudioFileSpritesPool object (if any):
	audioFileSpritesPool = CB_Speaker.getAudioFileSpritesPool();
	
	//If it was not created before, creates the object:
	if (audioFileSpritesPool === null)
	{
		//Creates the audio file sprites pool object:
		//NOTE: it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
		audioFileSpritesPool = new CB_AudioFileSpritesPool(audioFileSpritesPoolData);
		
		//Sets an internal CB_AudioFileSpritesPool object:
		CB_Speaker.setAudioFileSpritesPool(audioFileSpritesPool); //The parameter must be a CB_AudioFileSpritesPool object.
	}
	//...otherwise, reloads it:
	else
	{
		//Loads the audio file sprites pool object again with the data given:
		/*	NOTE:
			It is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
			If the 'disableAutoLoad' option is enabled, it is always necessary to call the 'createAudioFiles' of each CB_AudioFileSprites manually.
		*/
		audioFileSpritesPool.load(audioFileSpritesPoolData);
	}
	
	//Checks the status constantly and shows the progress (optional):
	var lastProgress = null, currentProgress = null;
	var lastStatus = null, currentStatus = null;
	var checkLoadingContinue = true;
	var checkLoading = function()
	{
		//Shows the progress (if there were any changes):
		currentProgress = audioFileSpritesPool.getProgress();
		if (currentProgress !== lastProgress)
		{
			printMessage("Progress: " + currentProgress);
			lastProgress = currentProgress;
			CB_Elements.insertContentById("loading", "Loading progress: " + currentProgress + "%");
		}

		//Shows the status (if there were any changes):
		//NOTE: it would also be possible to use the 'audioFileSpritesPool.getStatusString' method which returns a string with the current status.
		currentStatus = audioFileSpritesPool.getStatus();
		if (currentStatus !== lastStatus)
		{
			if (currentStatus === CB_AudioFileSpritesPool.UNLOADED) { printMessage("Unloaded"); }
			else if (currentStatus === CB_AudioFileSpritesPool.ABORTED) { printMessage("Aborted!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileSpritesPool.FAILED) { printMessage("Failed!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileSpritesPool.LOADING) { printMessage("Loading..."); }
			else if (currentStatus === CB_AudioFileSpritesPool.UNCHECKED) { printMessage("Unchecked! The 'audioFileSpritesPool.checkPlayingAll' method needs to be called."); }
			else if (currentStatus === CB_AudioFileSpritesPool.CHECKING) { printMessage("Checking..."); }
			else if (currentStatus === CB_AudioFileSpritesPool.LOADED) { printMessage("Loaded! Now you can use the audio file sprites pool object freely."); checkLoadingContinue = false; }
			lastStatus = currentStatus;
		}

		if (checkLoadingContinue) { checkLoadingInterval = setTimeout(checkLoading, 1); }
	};
	var checkLoadingInterval = setTimeout(checkLoading, 1);
	
	//Shows the information about the CB_AudioFileSpritesPool object constantly:
	showPoolInfo();
}


//Shows the information about the CB_AudioFileSpritesPool object constantly:
function showPoolInfo()
{
	var output = "";
	
	//Gets the current internal CB_AudioFileSpritesPool object (if any):
	audioFileSpritesPool = CB_Speaker.getAudioFileSpritesPool();
	
	//If the pool was not created yet, informs:
	if (audioFileSpritesPool === null)
	{
		output += "<b>CB_AudioFileSpritesPool object not created yet!</b>";
	}
	else
	{
		output += "<b>CB_AudioFileSpritesPool object exists. Status: </b>" + audioFileSpritesPool.getStatusString() + "<br />";
		
		//Tells whether any of the internal CB_AudioFile objects is playing:
		output += "<b>Any CB_AudioFile object playing</b>: " + (audioFileSpritesPool.isPlaying() ? "Yes" : "No");

		//Returns the CB_AudioFile objects used by all the sounds instances (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprites' methods of any CB_AudioFileSprites object) currently created:
		var audioFilesUsed = audioFileSpritesPool.getAudioFilesUsed(true, true); //Returns an array with the data and including the CB_AudioFile objects whose sound instance ID is not associated to any sprite.
		output += "<br /><b>CB_AudioFile objects being used by a sprite</b>: " + (audioFilesUsed.length === 0 ? "None" : CB_Arrays.forEach(audioFilesUsed, function(audioFile, index, array) { array[index] = audioFile.id; }));

		//Gets the number of CB_AudioFile objects created (stored in 'CB_AudioFileSprites#audioFileCache.audioFiles' of all the CB_AudioFileSprites objects):
		var audioFilesTotal = audioFileSpritesPool.getAudioFilesNumber(true);
		output += "<br /><b>Total number of CB_AudioFile objects created</b>: " + audioFilesTotal;

		//Gets all the CB_AudioFile objects created (stored in 'CB_AudioFileSprites#audioFileCache.audioFiles' of all the CB_AudioFileSprites objects):
		var audioFiles = audioFileSpritesPool.getAudioFiles(true, true); //Returns an array.
		output += "<br /><b>CB_AudioFile objects created</b>: " + (audioFiles.length === 0 ? "None" : CB_Arrays.forEach(audioFiles, function(audioFile, index, array) { array[index] = audioFile.id; }));

		//Gets the busy CB_AudioFile objects (the objects which are not available and ready to use):
		var audioFilesBusy = audioFileSpritesPool.getAudioFilesBusy(true); //Returns an array.
		output += "<br /><b>CB_AudioFile busy</b>: " + (audioFilesBusy.length === 0 ? "None" : CB_Arrays.forEach(audioFilesBusy, function(audioFile, index, array) { array[index] = audioFile.id; }));

		//Gets the current number of free CB_AudioFile objects (the number of objects which are available and ready to use):
		var audioFilesFreeTotal = audioFileSpritesPool.getAudioFilesFreeNumber();
		output += "<br /><b>Number of CB_AudioFile free</b>: " + audioFilesFreeTotal;

		//Gets the free CB_AudioFile objects (the objects which are available and ready to use):
		var audioFilesFree = audioFileSpritesPool.getAudioFilesFree(true); //Returns an array.
		output += "<br /><b>CB_AudioFile free</b>: " + (audioFilesFree.length === 0 ? "None" : CB_Arrays.forEach(audioFilesFree, function(audioFile, index, array) { array[index] = audioFile.id; }));

		//Executes a function over all the internal CB_AudioFile objects, being "this" each CB_AudioFile itself:
		//NOTE: same as 'audioFileSpritesPool.executeAll' and 'audioFileSpritesPool.executeFunctionAll'
		output += "<br /><b>Audio API used by each CB_AudioFile object</b>: ";
		var audioFilesAPIs = "";
		audioFileSpritesPool.forEach(function(index) { audioFilesAPIs += this.id + ": " + this.audioAPI + ", "; });
		if (audioFilesAPIs === "") { output += "None"; }
		else { audioFilesAPIs = CB_rtrim(audioFilesAPIs, ", "); output += audioFilesAPIs; }

		//Executes a function over all the internal CB_AudioFile objects used by all the sound instances (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprites' methods of any CB_AudioFileSprites object) currently created (being "this" each CB_AudioFile itself):
		//NOTE: Same as 'audioFileSpritesPool.executeAllSprites' and 'audioFileSpritesPool.executeFunctionAllSprites'.
		output += "<br /><b>Audio API used by each CB_AudioFile object which is currently playing a sprite</b>: ";
		audioFilesAPIs = "";
		audioFileSpritesPool.forEachSprite(function(index) { audioFilesAPIs += this.id + ": " + this.audioAPI + ", "; });
		if (audioFilesAPIs === "") { output += "None"; }
		else { audioFilesAPIs = CB_rtrim(audioFilesAPIs, ", "); output += audioFilesAPIs; }

		//Returns the ID of all the sound instances (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprites' methods of any CB_AudioFileSprites object) used:
		var soundInstanceIDs = audioFileSpritesPool.getSoundInstancesId(true, true); //Returns an array with the data, including the sound instance identifiers which are not associated to any sprite.
		output += "<br /><b>Sound instances created</b>: " + (soundInstanceIDs.length === 0 ? "None" : soundInstanceIDs);
		
		//If it has not been aborted (destructor was called) or failed, allows to call the destructor:
		if (audioFileSpritesPool.getStatus() !== CB_AudioFileSpritesPool.ABORTED)
		{
			CB_Elements.hideById("reload_sprites_pool");
			CB_Elements.showById("destructor_pool", "inline");
		}
		//...otherwise, if it has been aborted, it allows to reload it:
		else
		{
			CB_Elements.hideById("destructor_pool");
			CB_Elements.showById("reload_sprites_pool", "inline");
		}
	}

	CB_Elements.insertContentById("sprites_pool_info", output);

	//Calls itself again:
	setTimeout(showPoolInfo, 1);
}


//Checks all the CB_AudioFile objects:
function checkPlayingAll()
{
	//Hides the button for checking the CB_AudioFile objects:
	CB_Elements.hideById("check");
	
	//Shows the checking message:
	CB_Elements.insertContentById("loading", "Checking...");
	CB_Elements.showById("loading");
	
	//If the "checkManually" option was set to true, we need to check all the CB_AudioFile objects manually (by calling their 'checkPlaying' method):
	audioFileSpritesPool.checkPlayingAll
	(
		//callbackOk. Optional but recommended:
		function(performedActions, uncheckedObjects)
		{
			printMessage("Audio file sprites pool object checked successfully!");
			printMessage("Performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			printMessage("Unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
			
			//Hides the checking message:
			CB_Elements.hideById("loading");
			
			//Builds the audio sprites controls:
			createSpritesControls();
			
			//Shows all the controls:
			CB_Elements.showById("controls");
		},
		//callbackError. Optional but recommended:
		function(errors, performedActions, uncheckedObjects)
		{
			printMessage("Audio file sprites pool object failed to be checked!");
			for (var spritesGroupID in errors)
			{
				printMessage(spritesGroupID + " => " + errors[spritesGroupID].error);
				printMessage("* Performed actions (number of CB_AudioFile objects that can be played): " + errors[spritesGroupID].checked);
				printMessage("* Unchecked CB_AudioFile objects before calling this method: " + errors[spritesGroupID].needed);
			}
			printMessage("Total performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			printMessage("Total unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
			
			//Hides the checking message:
			CB_Elements.hideById("loading");
			
			//Shows the button for checking the CB_AudioFile objects again:
			CB_Elements.showById("check");
		},
		false, //ignoreQueue. Optional. Default: false. Set to undefined or null to use the default one.
		false //ignoreStatus. Optional. Default: false. Set to undefined or null to use the default one.
	);
}


//Creates and shows the audio sprites controls:
function createSpritesControls()
{
	//Gets an object with the sprites:
	var sprites = audioFileSpritesPool.getSprites(false, true); //Ordered by sprites group.
	
	var output = "";
	for (var spritesGroupId in sprites)
	{
		output += "<h3>Sprites group: <b>" + spritesGroupId + "</b> (total duration: " + audioFileSpritesPool.getSpritesGroup(spritesGroupId).getDuration() + ")</h3>";
		for (var spriteId in sprites[spritesGroupId])
		{
			output += "<b>" + spriteId + "</b>: ";
			output += '<button id="' + spritesGroupId + '_' + spriteId + '_play" onClick="playSprite(\'' + spritesGroupId + '\', \'' + spriteId + '\');">Play</button>';
			output += '<button id="' + spritesGroupId + '_' + spriteId + '_pause" onClick="pauseSprite(\'' + spritesGroupId + '\', \'' + spriteId + '\');" style="visibility:hidden; display:none;">Pause</button>';
			output += '<button id="' + spritesGroupId + '_' + spriteId + '_resume" onClick="resumeSprite(\'' + spritesGroupId + '\', \'' + spriteId + '\');" style="visibility:hidden; display:none;">Resume</button>';
			output += '<button id="' + spritesGroupId + '_' + spriteId + '_stop" onClick="stopSprite(\'' + spritesGroupId + '\', \'' + spriteId + '\');" style="visibility:hidden; display:none;">Stop</button>';
			output += ' <span id="' + spritesGroupId + '_' + spriteId + '_volume_controls">Volume (0 to 100): <input type="text" id="' + spritesGroupId + '_' + spriteId + '_volume" size="5" maxlength="5" value="100"><button id="' + spritesGroupId + '_' + spriteId + '_set_volume" onClick="setVolumeSprite(\'' + spritesGroupId + '\', \'' + spriteId + '\');" style="visibility:hidden; display:none;">Set volume</button></span>';
			output += '<button id="' + spritesGroupId + '_' + spriteId + '_mute" onClick="muteSprite(\'' + spritesGroupId + '\', \'' + spriteId + '\');" style="visibility:hidden; display:none;">Mute</button>';
			output += '<button id="' + spritesGroupId + '_' + spriteId + '_unmute" onClick="unmuteSprite(\'' + spritesGroupId + '\', \'' + spriteId + '\');" style="visibility:hidden; display:none;">Unmute</button>';
			output += ' - <span id="' + spritesGroupId + '_' + spriteId + '_info"></span>';
			output += "<br />";
			
			//Sets a function to constantly update the information of this sprite:
			showSpriteInfo(spritesGroupId, spriteId);
		}
		output += "<br />";
	}
	CB_Elements.appendContentById("sprites_controls", output);
}


//Shows information about a sprite, constantly:
function showSpriteInfo(spritesGroupId, spriteId)
{
	var output = "";
	
	//If the object has been aborted (destructor has been called):
	if (audioFileSpritesPool.getStatus() === CB_AudioFileSpritesPool.ABORTED)
	{
		//Hides the audio sprites controls:
		CB_Elements.hideById("sprites_controls");
	}
	//...otherwise, gets its information:
	else
	{
		//Shows the audio sprites controls:
		CB_Elements.showById("sprites_controls");
		
		//Note: there could be more than one sound instance (with a 'CB_AudioFile' object) by each sprite with different status (paused, stopped, etc.).
		//If the sprite is paused:
		if (audioFileSpritesPool.getSpritesGroup(spritesGroupId).isPausedSprite(spriteId))
		{
			output = "Paused";
			
			//Hides the play and pause buttons:
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_play");
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_pause");
			
			//Shows the resume and stop buttons:
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_resume", "inline");
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_stop", "inline");
			
			//Shows the volume controls as well as the mute and unmute buttons:
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_volume_controls", "inline");
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_set_volume", "inline");
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_mute", "inline");
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_unmute", "inline");
		}
		//...otherwise, if it is playing:
		else if (audioFileSpritesPool.getSpritesGroup(spritesGroupId).isPlayingSprite(spriteId))
		{
			output = "Playing...";
			
			//Hides the resume button:
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_resume");
			
			//Shows the play, pause and stop buttons:
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_play", "inline");
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_pause", "inline");
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_stop", "inline");
			
			//Shows the volume controls as well as the mute and unmute buttons:
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_volume_controls", "inline");
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_set_volume", "inline");
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_mute", "inline");
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_unmute", "inline");
		}
		//...otherwise, if the sprite is nor playing nor paused:
		else
		{
			output += "Stopped";
			
			//Hides the pause, resume and stop buttons:
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_pause");
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_resume");
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_stop");
			
			//Hides the volume controls as well as the mute and unmute buttons:
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_volume_controls");
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_set_volume");
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_mute");
			CB_Elements.hideById(spritesGroupId + "_" + spriteId + "_unmute");
			
			//Shows the play button:
			CB_Elements.showById(spritesGroupId + "_" + spriteId + "_play", "inline");
		}
		
		output += " - CB_AudioFile objects: ";
		var audioFiles = audioFileSpritesPool.getSpritesGroup(spritesGroupId).getAudioFilesUsedBySpriteId(spriteId);
		var audioFilesLength = audioFiles.length;
		if (audioFilesLength === 0) { output += "None"; }
		else
		{
			for (var x = 0; x < audioFilesLength; x++) { output += audioFiles[x].id + " (current time: " + CB_numberFormat(audioFiles[x].getCurrentTime(), 5, true) + "), "; }
			output = CB_rtrim(output, ", ");
		}
	}
	
	//Shows the information:
	CB_Elements.insertContentById(spritesGroupId + "_" + spriteId + "_info", output);
	
	//Calls itself again:
	setTimeout(function() { showSpriteInfo(spritesGroupId, spriteId); }, 1);
}


//Plays a desired sprite:
function playSprite(spritesGroupId, spriteId)
{
	var volume = CB_Elements.id(spritesGroupId + "_" + spriteId + "_volume").value;
	printMessage("Trying to use volume " + volume + " for the sprite ID '" + spriteId + "'...");
	
	var volumeSanitized = CB_Speaker.sanitizeVolume(volume);
	if (parseFloat(volume) !== volumeSanitized) { printMessage("Volume was sanitized from " + volume + " to " + volumeSanitized); }
	
	printMessage("Trying to play the sprite ID '" + spriteId + "'...");
	var soundInstanceId = audioFileSpritesPool.getSpritesGroup(spritesGroupId).playSprite
	(
		spriteId, //spriteId. Unique mandatory parameter.
		
		//Sets whether we want to play the audio looping (starting again and again) or just play it once:
		false, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.

		//Volume desired when playing the audio (this can also be changed on the fly, during playing):
		volumeSanitized, //volume. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME. Set to undefined or null to use the default one.

		//The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all. Used only when the audio is not able to play immediately:
		undefined, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		
		//Defines the maximum amount of time (in milliseconds) to allow delayed play by skipping a part of the audio:
		/*	NOTE:
			If provided and the time expired trying to start playing the sound without success is still inside this amount of time provided, it will try to play the sound but skipping the part of the audio which should have already been played already.
			In other words, it will try to start playing the sound as if the previous non-played part (which should have been playing during the time which already expired) was already being playing silently.
			Only used when the time set in the "allowedRecursiveDelay" parameter has been reached and the audio did not start playing yet.
		*/
		undefined, //allowedRecursiveDelaySkipping. Optional. Default: stopAt-startAt. Set to undefined or null to use the default one.

		//Function to be called when the audio starts playing successfully:
		function(soundInstanceId, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) //onPlayStart. Optional.
		{
			printMessage("Audio started playing! Volume: " + this.getVolume() + ", Sprite ID: '" + spriteId + "', CB_AudioFile ID: '" + this.id + "'");
		},
		
		//Function to call when the sound stops playing:
		function(soundInstanceId) { printMessage("Audio stopped! Sprite ID: '" + spriteId + "', CB_AudioFile ID: '" + this.id + "'"); } //onStop. Optional.
	);
	
	
	//Gets the CB_AudioFile, through its sound instance identifier (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprites' methods of any CB_AudioFileSprites object):
	printMessage("Sound instance with ID '" + soundInstanceId + "' generated by the 'play' method.");
	var audioFile = audioFileSpritesPool.getAudioFileBySoundInstanceId(soundInstanceId);
	if (audioFile !== null)
	{
		printMessage("CB_AudioFile object with ID '" + audioFile.id + "' associated to the sound instance ID '" + soundInstanceId + "' to play the '" + spriteId + "' sprite.");
	}
}


//Pauses a desired sprite:
function pauseSprite(spritesGroupId, spriteId)
{
	printMessage("Trying to pause the sprite ID '" + spriteId + "'...");
	audioFileSpritesPool.getSpritesGroup(spritesGroupId).pauseSprite(spriteId, function() { printMessage("Audio paused at " + this.getCurrentTime() + "! Sprite ID: '" + spriteId + "', CB_AudioFile ID: '" + this.id + "'"); });
}


//Resumes a desired sprite:
function resumeSprite(spritesGroupId, spriteId)
{
	printMessage("Trying to resume the sprite ID '" + spriteId + "'...");
	audioFileSpritesPool.getSpritesGroup(spritesGroupId).resumeSprite
	(
		spriteId, //spriteId. Unique mandatory parameter.
		undefined, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.
		undefined, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		undefined, //allowedRecursiveDelaySkipping. Optional. Default: stopAt-startAt. Set to undefined or null to use the default one.
		function(soundInstanceId, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) //onPlayStart. Optional.
		{
			printMessage("Audio resumed (from " + startAt + " to " + stopAt + ")! Volume: " + this.getVolume() + ", Sprite ID: '" + spriteId + "', CB_AudioFile ID: '" + this.id + "'");
		},
		undefined //onStop. Optional.
	);
}


//Stops a desired sprite:
function stopSprite(spritesGroupId, spriteId)
{
	printMessage("Trying to stop the sprite ID '" + spriteId + "'...");
	audioFileSpritesPool.getSpritesGroup(spritesGroupId).stopSprite(spriteId);
}


//Sets the desired volume of a sprite:
function setVolumeSprite(spritesGroupId, spriteId)
{
	var volume = CB_Elements.id(spritesGroupId + "_" + spriteId + "_volume").value;
	printMessage("Trying to set volume " + volume + " for the sprite ID '" + spriteId + "'...");
	var volumeSanitized = CB_Speaker.sanitizeVolume(volume);
	if (parseFloat(volume) !== volumeSanitized) { printMessage("Volume was sanitized from " + volume + " to " + volumeSanitized); }
	audioFileSpritesPool.getSpritesGroup(spritesGroupId).setVolumeSprite
	(
		spriteId,
		volumeSanitized,
		false,
		function()
		{
			printMessage("Set volume " + this.getVolume() + " for Sprite ID: '" + spriteId + "', CB_AudioFile ID: '" + this.id + "'");
			CB_Elements.id(spritesGroupId + "_" + spriteId + "_volume").value = this.getVolume();
		}
	);
}


//Mutes the desired sprite:
function muteSprite(spritesGroupId, spriteId)
{
	printMessage("Trying to mute the sprite ID '" + spriteId + "'...");
	audioFileSpritesPool.getSpritesGroup(spritesGroupId).muteSprite
	(
		spriteId,
		function()
		{
			printMessage("Muted volume for Sprite ID: '" + spriteId + "', CB_AudioFile ID: '" + this.id + "'");
			CB_Elements.id(spritesGroupId + "_" + spriteId + "_volume").value = this.getVolume();
		}
	);
}


//Unmutes the desired sprite:
function unmuteSprite(spritesGroupId, spriteId)
{
	printMessage("Trying to unmute the sprite ID '" + spriteId + "'...");
	audioFileSpritesPool.getSpritesGroup(spritesGroupId).unmuteSprite
	(
		spriteId,
		function()
		{
			printMessage("Unmuted volume for Sprite ID: '" + spriteId + "' (current volume: " + this.getVolume() + "), CB_AudioFile ID: '" + this.id + "'");
			CB_Elements.id(spritesGroupId + "_" + spriteId + "_volume").value = this.getVolume();
		}
	);
}