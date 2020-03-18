var Sound = {}; //Class to manage audio.
Sound.FX = {}; //Class to manage sound FX.
Sound.Music = {}; //Class to manage music.



//Prepares sound effects:
Sound.FX._sfx = null; //Global object to play the sounds.
Sound.FX._prepareExecuted = false;
Sound.FX.prepare = function(forceReload)
{
	if (!forceReload && Sound.FX._prepareExecuted) { return; }

	Sound.FX._prepareExecuted = true;

	showMessage("Preparing sound FX" + (forceReload ? " (forcing reload)" : "") + "...");
	
	var jsfxObject = CB_Speaker.getJsfxObject(); //Gets the 'jsfx' object.
	if (jsfxObject !== null)
	{
		//Defines the sound effects:
		var library =
		{
			"start":
				jsfx.Preset.Coin,
			"cannot_move":
				{ "Volume": { "Sustain": 0.05, "Decay": 0.2, "Punch": 1, "Master": 0.25 } },
			"piece_moving":
				{
					"Generator": { "Func": "noise", "A": 0.89, "B": 1 },
					"Volume": { "Sustain": 0.15, "Decay": 0.051, "Punch": 0.11, "Master": 0.23, "Attack": 0.241 }
				},
			"hole_filled":
				{
					"Frequency": { "Start": 1239 },
					"Generator": { "Func": "saw" },
					"Phaser": { "Offset": 0.56, "Sweep": -0.92 },
					"Volume": { "Master": 0.35, "Sustain": 0, "Decay": 0.321 }
				}
		};

		//Loads the sound effects:
		Sound.FX._sfx = CB_AudioDetector.isAPISupported("WAAPI") ? jsfxObject.Live(library) : jsfxObject.Sounds(library); //Uses AudioContext (Web Audio API) if available.
	}
}


//Plays the desired sound effect (by its identifier):
Sound.FX.play = function(id)
{
	if (!Game.data.soundEnabled) { return; }
	else if (!Sound.FX._sfx || typeof(Sound.FX._sfx[id]) !== "function")
	{
		showMessage("Sound FX '" + id + "' cannot be played! An user-driven event might be needed to be fired before being able to play sounds.");
		prepareSoundFx(true); //Forces reloading sounds.
		if (!Sound.FX._sfx || typeof(Sound.FX._sfx[id]) !== "function") { return; }
	}

	showMessage("Playing sound FX: " + id);

	//Note: at least the first time, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	Sound.FX._sfx[id]();
}


//Skips music loader (to play silent mode):
Sound.Music.skipLoading = function()
{
	showMessage("Skipping loading music...");
	Game.data.musicEnabled = false;
	CB_Elements.hideById("music_loader_checker"); //Hides the music loader.
	CB_Elements.showById("start_button"); //Shows the start button.
}


//Prepares background music:
Sound.Music._audioFileSpritesPool = null; //Global 'CB_AudioFileSpritesPool' object to play the music.
Sound.Music._songTitles = []; //Array to keep the title of all the loaded songs.
Sound.Music._prepareExecuted = false;
Sound.Music.prepare = function()
{
	if (!Game.data.musicEnabled) { return; }
	else if (Sound.Music._prepareExecuted) { return; }
	Sound.Music._prepareExecuted = true;
	
	showMessage("Preparing music...");
	
	CB_Elements.hideById("button_load_check_music"); //Hides the music loader button.
	
	//Defines the audios in different audio files (providing different formats and paths):
	//NOTE: CrossBrowdy will choose the best one(s) for the current client automatically.
	var currentURL = location.href;
	currentURL = currentURL.substring(0, currentURL.lastIndexOf("/") !== -1 ? currentURL.lastIndexOf("/") : currentURL.length) + "/";
	var audioURIs =
	{
		//NOTE: not using data URIs to keep the example simpler.
		"black_lark-first_contact" :
		{
			"audio/mpeg" :
			[
				currentURL + "audio/black_lark-first_contact-compressed.mp3", //Absolute path.
				"audio/black_lark-first_contact-compressed.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "audio/black_lark-first_contact-compressed.ogg", //Absolute path.
				"audio/black_lark-first_contact-compressed.ogg" //Relative path.
			],
			"audio/mp4" :
			[
				currentURL + "audio/black_lark-first_contact-compressed.m4a", //Absolute path.
				"audio/black_lark-first_contact-compressed.m4a" //Relative path.
			],
			"audio/wav" :
			[
				currentURL + "audio/black_lark-first_contact-compressed.wav", //Absolute path.
				"audio/black_lark-first_contact-compressed.wav" //Relative path.
			]
		},
		"smokefishe-sorry_for_lying" :
		{
			"audio/mpeg" :
			[
				currentURL + "audio/smokefishe-sorry_for_lying-compressed.mp3", //Absolute path.
				"audio/smokefishe-sorry_for_lying-compressed.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "audio/smokefishe-sorry_for_lying-compressed.ogg", //Absolute path.
				"audio/smokefishe-sorry_for_lying-compressed.ogg" //Relative path.
			],
			"audio/mp4" :
			[
				currentURL + "audio/smokefishe-sorry_for_lying-compressed.m4a", //Absolute path.
				"audio/smokefishe-sorry_for_lying-compressed.m4a" //Relative path.
			],
			"audio/wav" :
			[
				currentURL + "audio/smokefishe-sorry_for_lying-compressed.wav", //Absolute path.
				"audio/smokefishe-sorry_for_lying-compressed.wav" //Relative path.
			]
		},
		"weary_eyes-invisible_hand" :
		{
			"audio/mpeg" :
			[
				currentURL + "audio/weary_eyes-invisible_hand-compressed.mp3", //Absolute path.
				"audio/weary_eyes-invisible_hand-compressed.mp3" //Relative path.
			],
			"audio/ogg" :
			[
				currentURL + "audio/weary_eyes-invisible_hand-compressed.ogg", //Absolute path.
				"audio/weary_eyes-invisible_hand-compressed.ogg" //Relative path.
			],
			"audio/mp4" :
			[
				currentURL + "audio/weary_eyes-invisible_hand-compressed.m4a", //Absolute path.
				"audio/weary_eyes-invisible_hand-compressed.m4a" //Relative path.
			],
			"audio/wav" :
			[
				currentURL + "audio/weary_eyes-invisible_hand-compressed.wav", //Absolute path.
				"audio/weary_eyes-invisible_hand-compressed.wav" //Relative path.
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
		"black_lark-first_contact" :
		{
			//Sprite identifiers (case-sensitive), specifying where they start and where they stop:
			"ALL" :
			{
				"startAt" : 0,
				"stopAt" : null //Until the end. Note that the recommended way is to always provide the quantity in milliseconds as explained above.
			}
		},
		"smokefishe-sorry_for_lying" :
		{
			"ALL" :
			{
				"startAt" : 0,
				"stopAt" : null //Until the end. Note that the recommended way is to always provide the quantity in milliseconds as explained above.
			}
		},
		"weary_eyes-invisible_hand" :
		{
			"ALL" :
			{
				"startAt" : 0,
				"stopAt" : null //Until the end. Note that the recommended way is to always provide the quantity in milliseconds as explained above.
			}
		}
	};

	//Defines the function to call when an audio file sprites object has any error:
	var onErrorSpritesGroup = function(error)
	{
		showMessage("[CB_AudioFileSprites] Audio file sprites object (" + this.id + ") failed: " + error);
	};

	//Defines the function to call when an audio file sprites object is created or expanding:
	var onCreateSpritesGroup = function(audioFileObjectsToCheck)
	{
		showMessage("[CB_AudioFileSprites] Audio file sprites object (CB_AudioFileSprites) with ID " + this.id + " (status: " + this.getStatusString() + ") created or expanding! CB_AudioFile objects that still need to be checked: " + audioFileObjectsToCheck);
		if (CB_Arrays.indexOf(Sound.Music._songTitles, this.id) === -1) { Sound.Music._songTitles[Sound.Music._songTitles.length] = this.id; } //Adds the song to the songs array (if it did not exist yet).
		this.onLoad = null; //Prevents to execute this function again (otherwise, it could be executed again after the object grows automatically to create more 'CB_AudioFile' objects).
	};

	//Defines the function to call when an audio file sprites pool object has any error:
	var onError = function(error)
	{
		showMessage("[CB_AudioFileSpritesPool] Audio file sprites pool object failed: " + error);
		
		//Lets continue anyway:
		Sound.Music.skipLoading();
	};

	//Defines the function to call when the audio file sprites pool object is created:
	var onCreate = function(audioFileObjectsToCheck)
	{
		showMessage("[CB_AudioFileSpritesPool] Audio file sprites pool object with ID " + this.id + " (status: " + this.getStatusString() + ") created! CB_AudioFile objects that still need to be checked: " + audioFileObjectsToCheck);
		if (audioFileObjectsToCheck > 0)
		{
			showMessage("[CB_AudioFileSpritesPool] The 'Sound.Music._audioFileSpritesPool.checkPlayingAll' method can be called now, to check all the CB_AudioFile objects.");
			Game.data.musicLoaded = true;
			Sound.Music.showChecker(); //Shows the music checker.
		}
		this.onLoad = null; //Prevents to execute this function again (otherwise, it could be executed again after the object grows automatically to create more 'CB_AudioFile' objects).
	};

	//Defines the data for the audio file sprites pool object with all possible options:
	var audioFileSpritesPoolData =
	{
		//Identifier for the audio file sprites pool object:
		id: "songs", //Optional. Will be stored in 'Sound.Music._audioFileSpritesPool.id'.

		//Sprites groups (each will create a CB_AudioFileSprites object internally):
		"spritesGroups" :
		{
			//Sprites group "black_lark-first_contact" (it will be used as its ID) which will create a CB_AudioFileSprites object internally:
			"black_lark-first_contact" : //This object has the same format that uses the 'Sound.Music._audioFileSpritesPool.insertSpritesGroup' method (indeed, it is called internally).
			{
				//Defines the same audio but in different audio files (providing different formats, paths and data URIs):
				"URIs" : audioURIs["black_lark-first_contact"],

				//Defines the sprites information:
				"sprites" : audioSprites["black_lark-first_contact"],

				//Sets a function to call when the audio file sprites object is created successfully:
				onLoad: onCreateSpritesGroup, //Optional. Will be stored in 'Sound.Music._audioFileSpritesPool.audioFileSprites["black_lark-first_contact"].onLoad'.

				//Sets a function to call when an error happens with the audio file sprites object:
				onError: onErrorSpritesGroup //Optional. Will be stored in 'Sound.Music._audioFileSpritesPool.audioFileSprites["black_lark-first_contact"].onError'.
			},

			//Sprites group "smokefishe-sorry_for_lying" (it will be used as its ID) which will create a CB_AudioFileSprites object internally:
			"smokefishe-sorry_for_lying" : //This object has the same format that uses the 'Sound.Music._audioFileSpritesPool.insertSpritesGroup' method (indeed, it is called internally).
			{
				//Defines the same audio but in different audio files (providing different formats, paths and data URIs):
				"URIs" : audioURIs["smokefishe-sorry_for_lying"],

				//Defines the sprites information:
				"sprites" : audioSprites["smokefishe-sorry_for_lying"],

				//Sets a function to call when the audio file sprites object is created successfully:
				onLoad: onCreateSpritesGroup, //Optional. Will be stored in 'Sound.Music._audioFileSpritesPool.audioFileSprites["smokefishe-sorry_for_lying"].onLoad'.

				//Sets a function to call when an error happens with the audio file sprites object:
				onError: onErrorSpritesGroup //Optional. Will be stored in 'Sound.Music._audioFileSpritesPool.audioFileSprites["smokefishe-sorry_for_lying"].onError'.
			},
			
			//Sprites group "weary_eyes-invisible_hand" (it will be used as its ID) which will create a CB_AudioFileSprites object internally:
			"weary_eyes-invisible_hand" : //This object has the same format that uses the 'Sound.Music._audioFileSpritesPool.insertSpritesGroup' method (indeed, it is called internally).
			{
				//Defines the same audio but in different audio files (providing different formats, paths and data URIs):
				"URIs" : audioURIs["weary_eyes-invisible_hand"],

				//Defines the sprites information:
				"sprites" : audioSprites["weary_eyes-invisible_hand"],

				//Sets a function to call when the audio file sprites object is created successfully:
				onLoad: onCreateSpritesGroup, //Optional. Will be stored in 'Sound.Music._audioFileSpritesPool.audioFileSprites["weary_eyes-invisible_hand"].onLoad'.

				//Sets a function to call when an error happens with the audio file sprites object:
				onError: onErrorSpritesGroup //Optional. Will be stored in 'Sound.Music._audioFileSpritesPool.audioFileSprites["weary_eyes-invisible_hand"].onError'.
			}
		},

		/* General options for the audio file sprites pool object (can be overridden when they are specified in the options of a sprites group): */

		//Defines whether we want to check all CB_AudioFile objects automatically or manually (we will need to call the 'checkPlayingAll' method):
		checkManually: true, //Optional. Default: CB_AudioFileCache.checkManually_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'Sound.Music._audioFileSpritesPool.checkManually'.

		//Sets a function to call when the audio file sprites pool object is created successfully:
		onLoad: onCreate, //Optional but recommended. Will be stored in 'Sound.Music._audioFileSpritesPool.onLoad'.

		//Sets a function to call when an error happens with the audio file sprites pool object:
		onError: onError, //Optional but recommended. Will be stored in 'Sound.Music._audioFileSpritesPool.onError'.
		
		//As only one sound/sprite (a song) will be played at once, we do not need to cache automatically at all. We can save resources this way:
		
		//Minimum CB_AudioFile objects that will be needed internally:
		minimumAudioFiles: 1, //Optional. Default: CB_AudioFileCache.minimumAudioFiles_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'Sound.Music._audioFileSpritesPool.minimumAudioFiles'.

		//Maximum CB_AudioFile objects that will be created internally:
		maximumAudioFiles: 1, //Optional. Default: CB_AudioFileCache.maximumAudioFiles_DEFAULT. Set to undefined to use the default one. Set to null to have no maximum. Will be stored in 'Sound.Music._audioFileSpritesPool.maximumAudioFiles'.

		//Minimum free CB_AudioFile objects that will be needed internally. One CB_AudioFile object is free when it is not being played.
		minimumAudioFilesFree: 0, //Optional. Default: parseInt(Sound.Music._audioFileSpritesPool.minimumAudioFiles * 0.25 + 0.5). Set to undefined or null to use the default one. Will be stored in 'Sound.Music._audioFileSpritesPool.minimumAudioFilesFree'.

		//Defines the number of new CB_AudioFile objects to create automatically when they are needed:
		newAudioFilesWhenNeeded: 0 //Optional. Default: Math.min(parseInt(Sound.Music._audioFileSpritesPool.minimumAudioFiles * 0.1 + 0.5), 1). Set to undefined or null to use the default one. Will be stored in 'Sound.Music._audioFileSpritesPool.newAudioFilesWhenNeeded'.
	};

	//Creates the audio file sprites pool object:
	//NOTE: it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	Sound.Music._audioFileSpritesPool = new CB_AudioFileSpritesPool(audioFileSpritesPoolData);

	//Checks the status constantly and shows the progress (optional):
	var lastProgress = null, currentProgress = null;
	var lastStatus = null, currentStatus = null;
	var checkLoadingContinue = true;
	var checkLoading = function()
	{
		//Shows the progress (if there were any changes):
		currentProgress = Sound.Music._audioFileSpritesPool.getProgress();
		if (currentProgress !== lastProgress)
		{
			showMessage("[CB_AudioFileSpritesPool] Progress: " + currentProgress);
			CB_Elements.insertContentById("music_progress", "Please, wait. Music loading/checking progress: " + CB_numberFormat(currentProgress, 2, true) + "%"); //Shows the music loading progress.
			lastProgress = currentProgress;
		}

		//Shows the status (if there were any changes):
		//NOTE: it would also be possible to use the 'Sound.Music._audioFileSpritesPool.getStatusString' method which returns a string with the current status.
		currentStatus = Sound.Music._audioFileSpritesPool.getStatus();
		if (currentStatus !== lastStatus)
		{
			if (currentStatus === CB_AudioFileSpritesPool.UNLOADED) { showMessage("[CB_AudioFileSpritesPool] Unloaded"); }
			else if (currentStatus === CB_AudioFileSpritesPool.ABORTED) { showMessage("[CB_AudioFileSpritesPool] Aborted!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileSpritesPool.FAILED) { showMessage("[CB_AudioFileSpritesPool] Failed!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileSpritesPool.LOADING) { showMessage("[CB_AudioFileSpritesPool] Loading..."); }
			else if (currentStatus === CB_AudioFileSpritesPool.UNCHECKED) { showMessage("[CB_AudioFileSpritesPool] Unchecked! The 'Sound.Music._audioFileSpritesPool.checkPlayingAll' method needs to be called."); }
			else if (currentStatus === CB_AudioFileSpritesPool.CHECKING) { showMessage("[CB_AudioFileSpritesPool] Checking..."); }
			else if (currentStatus === CB_AudioFileSpritesPool.LOADED) { showMessage("[CB_AudioFileSpritesPool] Loaded! Now you can use the audio file sprites pool object freely."); checkLoadingContinue = false; }
			lastStatus = currentStatus;
		}

		if (checkLoadingContinue) { checkLoadingInterval = setTimeout(checkLoading, 1); }
	};
	var checkLoadingInterval = setTimeout(checkLoading, 1);
}


//Shows the music checker:
Sound.Music._showCheckerCalled = false; //To prevent showing the checker again.
Sound.Music.showChecker = function()
{
	if (!Game.data.musicEnabled) { return; }
	else if (Sound.Music._showCheckerCalled) { return; }
	Sound.Music._showCheckerCalled = true;
	CB_Elements.insertContentById("music_progress", ""); //Empties the progress shown.
	CB_Elements.insertContentById("button_load_check_music", "Step 2:<br />Check music");
	CB_Events.removeByName(CB_Elements.id("button_load_check_music"), "click"); //Removes the previous event handler from the button.
	CB_Events.on(CB_Elements.id("button_load_check_music"), "click", Sound.Music.check); //Attaches the event to the button to check the music.	
	CB_Elements.showById("button_load_check_music"); //Shows the music checker button.
}


//Checks the music:
Sound.Music.check = function()
{
	if (!Game.data.musicEnabled) { return; }
	else if (!(Sound.Music._audioFileSpritesPool instanceof CB_AudioFileSpritesPool)) { showMessage("[CB_AudioFileSpritesPool] Music cannot be checked because 'Sound.Music._audioFileSpritesPool' is not a 'CB_AudioFileSpritesPool' object!"); return; }
	
	showMessage("[CB_AudioFileSpritesPool] Checking music (status: " + Sound.Music._audioFileSpritesPool.getStatusString() + ")...");
	CB_Elements.hideById("button_load_check_music"); //Hides the music checker button.
	
	//If the "checkManually" option was set to true, we need to check all the CB_AudioFile objects manually (by calling their 'checkPlaying' method):
	Sound.Music._audioFileSpritesPool.checkPlayingAll
	(
		//callbackOk. Optional but recommended:
		function(performedActions, uncheckedObjects)
		{
			showMessage("[CB_AudioFileSpritesPool] Audio file sprites pool object checked successfully!");
			showMessage("[CB_AudioFileSpritesPool] Performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			showMessage("[CB_AudioFileSpritesPool] Unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
			Game.data.musicChecked = true;
			CB_Elements.hideById("music_loader_checker"); //Hides the music checker.
			CB_Elements.showById("start_button"); //Shows the start button.
		},
		//callbackError. Optional but recommended:
		function(errors, performedActions, uncheckedObjects)
		{
			showMessage("[CB_AudioFileSpritesPool] Audio file sprites pool object failed to be checked!");
			for (var spritesGroupID in errors)
			{
				showMessage("[CB_AudioFileSpritesPool] " + spritesGroupID + " => " + errors[spritesGroupID].error);
				showMessage("[CB_AudioFileSpritesPool] * Performed actions (number of CB_AudioFile objects that can be played): " + errors[spritesGroupID].checked);
				showMessage("[CB_AudioFileSpritesPool] * Unchecked CB_AudioFile objects before calling this method: " + errors[spritesGroupID].needed);
			}
			showMessage("[CB_AudioFileSpritesPool] Total performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			showMessage("[CB_AudioFileSpritesPool] Total unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
			
			//Lets continue anyway:
			Sound.Music.skipLoading();
		}
	);	
}


//Plays the song which belongs to the given level:
Sound.Music.playByLevel = function(level)
{
	return Sound.Music.play(Sound.Music._songTitles[level % Sound.Music._songTitles.length]);
}


//Plays the desired song:
Sound.Music.play = function(id)
{
	if (!Game.data.musicEnabled) { return; }
	else if (!(Sound.Music._audioFileSpritesPool instanceof CB_AudioFileSpritesPool)) { showMessage("[CB_AudioFileSpritesPool] Music cannot be played because 'Sound.Music._audioFileSpritesPool' is not a 'CB_AudioFileSpritesPool' object!"); return; }
	
	//Stops any possible song playing currently:
	Sound.Music.stop();

	//Gets the internal CB_AudioFileSprites object that belongs to the desired sprites group (gets the desired song):
	var audioFileSpritesGroup = Sound.Music._audioFileSpritesPool.getSpritesGroup(id); //Returns null if not found.

	if (audioFileSpritesGroup !== null)
	{
		//Plays the sprite desired ("ALL" which corresponds to the whole song):
		audioFileSpritesGroup.playSprite("ALL", true); //Also loops.
	}
}


//Stops any song:
Sound.Music.stop = function()
{
	if (!(Sound.Music._audioFileSpritesPool instanceof CB_AudioFileSpritesPool)) { showMessage("[CB_AudioFileSpritesPool] Music cannot be stopped because 'Sound.Music._audioFileSpritesPool' is not a 'CB_AudioFileSpritesPool' object!"); return; }
	
	//Stops any possible song playing currently:
	Sound.Music._audioFileSpritesPool.stopAll();
}
