<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Audio file sprites pool objects (which are created using the <a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> class) allow you to use and reuse different groups of sprites (each sprite group being from the same sound) multiple times and simultaneously.
</p>

<p>
	It is important to have in mind that each group of sprites (each being managed by a <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> object internally) should only contain the same sound (never different ones), although you should provide different audio formats of that sound so the audio file sprites pool object will be able to calculate and use the best one for the current client automatically.
	The more different formats you can provide, the more chances to support more clients.
</p>

<p>
	As some audio formats and some audio APIs are not supported by some clients, audio file sprites pool objects will detect and manage all automatically so you do not need to worry about it.
</p>

<p>
	Internally, each audio file sprites pool object will normally manage one audio file sprites object (which use the <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> class) per each sprites group that will typically contain one <a href="_html/_doc/api/CB_AudioFileCache.html" target="_blank">CB_AudioFileCache</a> and each of them will have multiple <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects. An audio file cache object can grow automatically (expanding itself) in the case it detects it needs more internal <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects (for example, if it detects we want to play more sound instances simultaneously than the ones it currently has). It can also reload <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects automatically in the case they failed internally. During this process, the audio file sprites pool object (<a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> object) will have a 'LOADING' status again and after that the status will be 'LOADED' if all went well or 'FAILED' otherwise. When the 'LOAD' status is reached, the 'onLoad' event function (if any) will be called again (to prevent this, set the 'onLoad' property of the object to something which is not a function once it gets executed).
</p>

<p>
	The main advantage of <a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> objects is that you can manage different groups of sprites and not only one as with <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> objects.
</p>

<p>
	The <a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> objects use a higher abstraction level than the <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a>.
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
	When loading an audio file sprites pool object, it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	Here is an example loading an audio file sprites pool object:
</p>
<pre><code class="language-javascript">
	//Defines the audios in different audio files (providing different formats, paths and data URIs):
	//NOTE: CrossBrowdy will choose the best one(s) for the current client automatically.
	var currentURL = location.href;
	currentURL = currentURL.substring(0, currentURL.lastIndexOf("/") !== -1 ? currentURL.lastIndexOf("/") : currentURL.length) + "/";
	var dataURIs = //Here we could define the data URIs for the audios, in their values (but too long for this example):
	{
		"numeros/numeros.mp3" : null,
		"numeros/numeros.ogg" : null,
		"numeros/numeros.m4a" : null,
		"numeros/numeros.wav" : null,
		
		"arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.mp3" : null,
		"arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.ogg" : null,
		"arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.m4a" : null,
		"arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.wav" : null
	}; 
	var audioURIs =
	{
		"numeros" :
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
		},
		"arriba_el_ritmo_valencia" :
		{
			"audio/mpeg" :
			[
				currentURL + "audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.mp3", //Absolute path.
				"audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.mp3", //Relative path.
				dataURIs["arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.mp3"] //Data URI.
			],
			"audio/ogg" :
			[
				currentURL + "audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.ogg", //Absolute path.
				"audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.ogg", //Relative path.
				dataURIs["arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.ogg"] //Data URI.
			],
			"audio/mp4" :
			[
				currentURL + "audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.m4a", //Absolute path.
				"audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.m4a", //Relative path.
				dataURIs["arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.m4a"] //Data URI.
			],
			"audio/wav" :
			[
				currentURL + "audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.wav", //Absolute path.
				"audio/arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.wav", //Relative path.
				dataURIs["arriba_el_ritmo_valencia/arriba_el_ritmo_valencia.wav"] //Data URI.
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
			"Let's go" :
			{
				"startAt" : 34300,
				"stopAt" : 35200
			},
			"El ritmo" :
			{
				"startAt" : 51000,
				"stopAt" : 52100
			},
			"Arriba" :
			{
				"startAt" : 56600,
				"stopAt" : 57400
			},
			"DJ" :
			{
				"startAt" : 103000,
				"stopAt" : 104200
			},
			"Come on" : 
			{
				"startAt" : 128000,
				"stopAt" : 128900
			},
			"Todos a la pista" : 
			{
				"startAt" : 178200,
				"stopAt" : 179650
			},
			"Yi hi" : 
			{
				"startAt" : 196000,
				"stopAt" : 197000
			},
			"Que bueno" : 
			{
				"startAt" : 277100,
				"stopAt" : 278200
			},
			"Asaco" : 
			{
				"startAt" : 294200,
				"stopAt" : 294980
			},
			"No pare la marcha" : 
			{
				"startAt" : 295040,
				"stopAt" : 296420
			}
		}
	};

	//Defines the function to call when an audio file sprites object is created or expanding:
	var onCreateSpritesGroup = function(audioFileObjectsToCheck)
	{
		CB_console("Audio file sprites object (CB_AudioFileSprites) created or expanding! CB_AudioFile objects that still need to be checked: " + audioFileObjectsToCheck);
		CB_console("CB_AudioFileSprites Identifier: " + this.id);
		CB_console("CB_AudioFileSprites Status: " + this.getStatusString()); //Same as audioFileSpritesPool.audioFileSprites[this.id].getStatusString().
		if (audioFileObjectsToCheck > 0) { CB_console("You can call the 'audioFileSpritesPool.audioFileSprites['" + this.id + "'].checkPlayingAll' method to check all the CB_AudioFile objects."); }
		this.onLoad = null; //Prevents to execute this function again (otherwise, it could be executed again after the object grows automatically to create more 'CB_AudioFile' objects).
	};
	
	//Defines the function to call when the audio file sprites pool object is created:
	var onCreate = function(audioFileObjectsToCheck)
	{
		CB_console("Audio file sprites pool object created! CB_AudioFile objects that still need to be checked: " + audioFileObjectsToCheck);
		CB_console("Identifier: " + this.id); //Same as audioFileSpritesPool.id.
		CB_console("Status: " + this.getStatusString()); //Same as audioFileSpritesPool.getStatusString().
		if (audioFileObjectsToCheck > 0) { CB_console("You can call the 'audioFileSpritesPool.checkPlayingAll' method to check all the CB_AudioFile objects."); }
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
				onError: function(error) { CB_console("Audio file sprites object (" + this.id + ") failed: " + error); }, //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].onError'.
				
				/*
					NOTE:
					The following options will override the general ones of the audio file sprites pool object.
					If any of them was not provided, it would use the value of the option set in the general ones (if any) or the default one otherwise.
					They follow the same rules as the options in the data objects used by the audio file sprites (CB_AudioFileSprites) objects but they do not accept an "id" parameter (the ID used will be the ID of the sprites group):
				*/
				
				//Accepted audio APIs in order of preference. Internally, it will calculate and use the best one(s) for the current client:
				preferredAPIs: ["WAAPI", "AAPI", "SM2", "ACMP"], //Optional. Default: CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].preferredAPIs'.
				
				//Accepted audio formats in order of preference. Internally, it will calculate and use the best one(s) for the current client:
				preferredFormats: null, //Optional. Default: CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].preferredFormats'.
				
				//Minimum CB_AudioFile objects that will be needed internally:
				minimumAudioFiles: 10, //Optional. Default: CB_AudioFileCache.minimumAudioFiles_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].minimumAudioFiles'.
				
				//Maximum CB_AudioFile objects that will be created internally:
				maximumAudioFiles: 30, //Optional. Default: CB_AudioFileCache.maximumAudioFiles_DEFAULT. Set to undefined to use the default one. Set to null to have no maximum. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].maximumAudioFiles'.
				
				//Minimum free CB_AudioFile objects that will be needed internally. One CB_AudioFile object is free when it is not being played.
				minimumAudioFilesFree: 7, //Optional. Default: parseInt(audioFileSpritesPool.audioFileSprites["numeros"].minimumAudioFiles * 0.25 + 0.5). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].minimumAudioFilesFree'.
				
				//Defines the number of new CB_AudioFile objects to create automatically when they are needed:
				newAudioFilesWhenNeeded: 3, //Optional. Default: Math.min(parseInt(audioFileSpritesPool.audioFileSprites["numeros"].minimumAudioFiles * 0.1 + 0.5), 1). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].newAudioFilesWhenNeeded'.
				
				//Defines the number of retries to try to load a CB_AudioFile object internally before trying to load the next possible one (if any):
				retries: 3, //Optional. Default: CB_AudioFileCache.retries_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].retries'.
				
				//Defines whether we want to check all CB_AudioFile objects automatically or manually (we will need to call the 'checkPlayingAll' method):
				checkManually: true, //Optional. Default: CB_AudioFileCache.checkManually_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].checkManually'.
				
				//Defines whether we want to check the CB_AudioFile object automatically when creating a new needed one:
				checkManuallyOnNeededCreated: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].checkManuallyOnNeededCreated'.
				
				//Defines whether we want to check the CB_AudioFile object automatically when it has failed playing and tries to re-load it:
				checkManuallyOnPlayingFailed: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].checkManuallyOnPlayingFailed'.
				
				//Defines whether we want to check the CB_AudioFile object automatically when it has failed checking and tries to re-load it:
				checkManuallyOnCheckingFailed: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["numeros"].checkManuallyOnCheckingFailed'.
				
				//Defines whether to create the CB_AudioFile objects automatically by calling the 'audioFileSpritesPool.audioFileSprites["numeros"].createAudioFiles' method internally (recommended) or not:
				//NOTE: if the 'disableAutoLoad' option is enabled, it is always necessary to call the 'audioFileSpritesPool.audioFileSprites["numeros"].createAudioFiles' manually.
				disableAutoLoad: false //Optional. Default: false. Set to undefined or null to use the default one. Internal usage only recommended.
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
				onError: function(error) { CB_console("Audio file sprites object (" + this.id + ") failed: " + error); }, //Optional. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].onError'.
				
				/*
					NOTE:
					The following options will override the general ones of the audio file sprites pool object.
					If any of them was not provided, it would use the value of the option set in the general ones (if any) or the default one otherwise.
					They follow the same rules as the options in the data objects used by the audio file sprites (CB_AudioFileSprites) objects but they do not accept an "id" parameter (the ID used will be the ID of the sprites group):
				*/
				
				//Accepted audio APIs in order of preference. Internally, it will calculate and use the best one(s) for the current client:
				preferredAPIs: ["WAAPI", "AAPI", "SM2", "ACMP"], //Optional. Default: CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].preferredAPIs'.
				
				//Accepted audio formats in order of preference. Internally, it will calculate and use the best one(s) for the current client:
				preferredFormats: null, //Optional. Default: CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].preferredFormats'.
				
				//Minimum CB_AudioFile objects that will be needed internally:
				minimumAudioFiles: 10, //Optional. Default: CB_AudioFileCache.minimumAudioFiles_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].minimumAudioFiles'.
				
				//Maximum CB_AudioFile objects that will be created internally:
				maximumAudioFiles: 30, //Optional. Default: CB_AudioFileCache.maximumAudioFiles_DEFAULT. Set to undefined to use the default one. Set to null to have no maximum. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].maximumAudioFiles'.
				
				//Minimum free CB_AudioFile objects that will be needed internally. One CB_AudioFile object is free when it is not being played.
				minimumAudioFilesFree: 7, //Optional. Default: parseInt(audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].minimumAudioFiles * 0.25 + 0.5). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].minimumAudioFilesFree'.
				
				//Defines the number of new CB_AudioFile objects to create automatically when they are needed:
				newAudioFilesWhenNeeded: 3, //Optional. Default: Math.min(parseInt(audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].minimumAudioFiles * 0.1 + 0.5), 1). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].newAudioFilesWhenNeeded'.
				
				//Defines the number of retries to try to load a CB_AudioFile object internally before trying to load the next possible one (if any):
				retries: 3, //Optional. Default: CB_AudioFileCache.retries_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].retries'.
				
				//Defines whether we want to check all CB_AudioFile objects automatically or manually (we will need to call the 'checkPlayingAll' method):
				checkManually: true, //Optional. Default: CB_AudioFileCache.checkManually_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].checkManually'.
				
				//Defines whether we want to check the CB_AudioFile object automatically when creating a new needed one:
				checkManuallyOnNeededCreated: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].checkManuallyOnNeededCreated'.
				
				//Defines whether we want to check the CB_AudioFile object automatically when it has failed playing and tries to re-load it:
				checkManuallyOnPlayingFailed: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].checkManuallyOnPlayingFailed'.
				
				//Defines whether we want to check the CB_AudioFile object automatically when it has failed checking and tries to re-load it:
				checkManuallyOnCheckingFailed: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].checkManuallyOnCheckingFailed'.
				
				//Defines whether to create the CB_AudioFile objects automatically by calling the 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].createAudioFiles' method internally (recommended) or not:
				//NOTE: if the 'disableAutoLoad' option is enabled, it is always necessary to call the 'audioFileSpritesPool.audioFileSprites["arriba_el_ritmo_valencia"].createAudioFiles' manually.
				disableAutoLoad: false //Optional. Default: false. Set to undefined or null to use the default one. Internal usage only recommended.
			}
		},

		/* General options for the audio file sprites pool object (can be overridden when they are specified in the options of a sprites group): */
		
		//Accepted audio APIs in order of preference. Internally, it will calculate and use the best one(s) for the current client:
		preferredAPIs: ["WAAPI", "AAPI", "SM2", "ACMP"], //Optional. Default: CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.preferredAPIs'.
		
		//Accepted audio formats in order of preference. Internally, it will calculate and use the best one(s) for the current client:
		preferredFormats: null, //Optional. Default: CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.preferredFormats'.
		
		//Minimum CB_AudioFile objects that will be needed internally:
		minimumAudioFiles: 10, //Optional. Default: CB_AudioFileCache.minimumAudioFiles_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.minimumAudioFiles'.
		
		//Maximum CB_AudioFile objects that will be created internally:
		maximumAudioFiles: 30, //Optional. Default: CB_AudioFileCache.maximumAudioFiles_DEFAULT. Set to undefined to use the default one. Set to null to have no maximum. Will be stored in 'audioFileSpritesPool.maximumAudioFiles'.
		
		//Minimum free CB_AudioFile objects that will be needed internally. One CB_AudioFile object is free when it is not being played.
		minimumAudioFilesFree: 7, //Optional. Default: parseInt(audioFileSpritesPool.minimumAudioFiles * 0.25 + 0.5). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.minimumAudioFilesFree'.
		
		//Defines the number of new CB_AudioFile objects to create automatically when they are needed:
		newAudioFilesWhenNeeded: 3, //Optional. Default: Math.min(parseInt(audioFileSpritesPool.minimumAudioFiles * 0.1 + 0.5), 1). Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.newAudioFilesWhenNeeded'.
		
		//Defines the number of retries to try to load a CB_AudioFile object internally before trying to load the next possible one (if any):
		retries: 3, //Optional. Default: CB_AudioFileCache.retries_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.retries'.
		
		//Defines whether we want to check all CB_AudioFile objects automatically or manually (we will need to call the 'checkPlayingAll' method):
		checkManually: true, //Optional. Default: CB_AudioFileCache.checkManually_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.checkManually'.
		
		//Defines whether we want to check the CB_AudioFile object automatically when creating a new needed one:
		checkManuallyOnNeededCreated: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.checkManuallyOnNeededCreated'.
		
		//Defines whether we want to check the CB_AudioFile object automatically when it has failed playing and tries to re-load it:
		checkManuallyOnPlayingFailed: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.checkManuallyOnPlayingFailed'.
		
		//Defines whether we want to check the CB_AudioFile object automatically when it has failed checking and tries to re-load it:
		checkManuallyOnCheckingFailed: false, //Optional. Default: CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT. Set to undefined or null to use the default one. Will be stored in 'audioFileSpritesPool.checkManuallyOnCheckingFailed'.

		//Sets a function to call when the audio file sprites pool object is created successfully:
		onLoad: onCreate, //Optional but recommended. Will be stored in 'audioFileSpritesPool.onLoad'.
		
		//Sets a function to call when an error happens with the audio file sprites pool object:
		onError: function(error) { CB_console("Audio file sprites pool object failed: " + error); }, //Optional but recommended. Will be stored in 'audioFileSpritesPool.onError'.
		
		//Defines whether to create the CB_AudioFile objects automatically by calling the 'createAudioFiles' of each CB_AudioFileSprites method internally (recommended) or not:
		//NOTE: if the 'disableAutoLoad' option is enabled, it is always necessary to call the 'createAudioFiles' of each CB_AudioFileSprites manually.
		disableAutoLoad: false //Optional. Default: false. Set to undefined or null to use the default one. Internal usage only recommended.
	};
	
	//Creates the audio file sprites pool object:
	//NOTE: it is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
	var audioFileSpritesPool = new CB_AudioFileSpritesPool(audioFileSpritesPoolData);

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
			CB_console("Progress: " + currentProgress);
			lastProgress = currentProgress;
		}
		
		//Shows the status (if there were any changes):
		//NOTE: it would also be possible to use the 'audioFileSpritesPool.getStatusString' method which returns a string with the current status.
		currentStatus = audioFileSpritesPool.getStatus();
		if (currentStatus !== lastStatus)
		{
			if (currentStatus === CB_AudioFileSpritesPool.UNLOADED) { CB_console("Unloaded"); }
			else if (currentStatus === CB_AudioFileSpritesPool.ABORTED) { CB_console("Aborted!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileSpritesPool.FAILED) { CB_console("Failed!"); checkLoadingContinue = false; }
			else if (currentStatus === CB_AudioFileSpritesPool.LOADING) { CB_console("Loading..."); }
			else if (currentStatus === CB_AudioFileSpritesPool.UNCHECKED) { CB_console("Unchecked! The 'audioFileSpritesPool.checkPlayingAll' method needs to be called."); }
			else if (currentStatus === CB_AudioFileSpritesPool.CHECKING) { CB_console("Checking..."); }
			else if (currentStatus === CB_AudioFileSpritesPool.LOADED) { CB_console("Loaded! Now you can use the audio file sprites pool object freely."); checkLoadingContinue = false; }
			lastStatus = currentStatus;
		}
		
		if (checkLoadingContinue) { checkLoadingInterval = setTimeout(checkLoading, 1); }
	};
	var checkLoadingInterval = setTimeout(checkLoading, 1);
</code></pre>

<p>
	In the case that the audio file sprites pool object or any of its sprites groups has the "checkManually" option enabled, we need to check each of its internally-used <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects. We can do that easily by calling the "checkPlayingAll" manually after the audio file sprites pool object has been created. It is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise):
</p>
<pre><code class="language-javascript">
	//If the "checkManually" option was set to true, we need to check all the CB_AudioFile objects manually (by calling their 'checkPlaying' method):
	audioFileSpritesPool.checkPlayingAll
	(
		//callbackOk. Optional but recommended:
		function(performedActions, uncheckedObjects)
		{
			CB_console("Audio file sprites pool object checked successfully!");
			CB_console("Performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			CB_console("Unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
		},
		//callbackError. Optional but recommended:
		function(errors, performedActions, uncheckedObjects)
		{
			CB_console("Audio file sprites pool object failed to be checked!");
			for (var spritesGroupID in errors)
			{
				CB_console(spritesGroupID + " => " + errors[spritesGroupID].error);
				CB_console("* Performed actions (number of CB_AudioFile objects that can be played): " + errors[spritesGroupID].checked);
				CB_console("* Unchecked CB_AudioFile objects before calling this method: " + errors[spritesGroupID].needed);
			}
			CB_console("Total performed actions (number of CB_AudioFile objects that can be played): " + performedActions);
			CB_console("Total unchecked CB_AudioFile objects before calling this method: " + uncheckedObjects);
		},
		false, //ignoreQueue. Optional. Default: false. Set to undefined or null to use the default one.
		false //ignoreStatus. Optional. Default: false. Set to undefined or null to use the default one.
	);
</code></pre>

<p>
	After the audio file sprites pool object has been loaded successfully (and after calling "checkPlayingAll" successfully, if it was necessary), we can start using the audio file sprites pool object freely.
	The following way can be used to get the internal <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> object that belong to a desired sprites group to manage it:
</p>
<pre><code class="language-javascript">
	//Gets the internal CB_AudioFileSprites object that belongs to the desired sprites group:
	var audioFileSpritesGroup = audioFileSpritesPool.getSpritesGroup("numeros"); //Returns null if not found.
	
	//Do things with it. For example to play a sprite (by its ID):
	audioFileSpritesGroup.playSprite("tres");
</code></pre>
<p>
	You can read more about the <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> class in the <a href="<?php echo basicTutorialLink("audio", "audio_sprites"); ?>" target="_blank">Audio sprites</a> topic.
</p>

<p>
	It is possible to manage the different sprites groups easily:
</p>
<pre><code class="language-javascript">
	//Gets an object with the sprites:
	var audioFileSprites = audioFileSpritesPool.getSprites(); //All sprites together, not ordered by sprites group.
	var audioFileSprites_2 = audioFileSpritesPool.getSprites(true); //All sprites together, not ordered by sprites group. Includes "_WITHOUT_SPRITE_ASSOCIATED".
	var audioFileSprites_3 = audioFileSpritesPool.getSprites(false, true); //Ordered by sprites group.
	var audioFileSprites_4 = audioFileSpritesPool.getSprites(true, true); //Ordered by sprites group. Includes "_WITHOUT_SPRITE_ASSOCIATED".
	
	//Gets an object with the sprites groups (all the internally-created CB_AudioFileSprites objects), being the name of each property their group ID and the value being the CB_AudioFileSprites object itself:
	//NOTE: The 'audioFileSpritesPool.getSpritesGroup' method can be used to get just one CB_AudioFileSprites object of a specific sprites group.
	var audioFileSpritesGroups = audioFileSpritesPool.getSpritesGroups();
	
	//Inserts the given sprites group to the audio file sprites pool object:
	//Note: remember to call to the 'audioFileSpritesPool.checkPlayingAll' method before using it if it is necessary.
	audioFileSpritesPool.insertSpritesGroup
	(
		"sprites_group_id", //spritesGroupId. Mandatory.
		audioFileSpritesPoolData.spritesGroups.numeros, //dataObject. Optional but recommended.
		undefined //avoidCheckingLoaded. Optional. Default: false. Set to undefined or null to use the default one.
	);
	
	//Inserts the given sprites groups to the audio file sprites pool object:
	//Note: remember to call to the 'audioFileSpritesPool.checkPlayingAll' method before using them if it is necessary.
	audioFileSpritesPool.insertSpritesGroups
	(
		{
			"sprites_group_id_1" : audioFileSpritesPoolData.spritesGroups.numeros,
			"sprites_group_id_2" : audioFileSpritesPoolData.spritesGroups.arriba_el_ritmo_valencia
		}
	);
	
	//Removes a given sprites group from the audio file sprites pool object:
	var removed = audioFileSpritesPool.removeSpritesGroup("sprites_group_id"); //Returns true if it is removed.
	
	//Removes all the sprites groups from the audio file sprites pool object:
	audioFileSpritesPool.removeSpritesGroups();
</code></pre>

<p>
	Some other useful examples:
</p>
<pre><code class="language-javascript">
	//Tells whether any of the internal CB_AudioFile objects is playing:
	if (audioFileSpritesPool.isPlaying()) { CB_console("One or more of the internal CB_AudioFile objects are playing."); }
	else { CB_console("None of the internal CB_AudioFile objects is playing."); }
	
	//Returns the CB_AudioFile objects used by all the sounds instances (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprite' methods of any CB_AudioFileSprites object) currently created:
	var audioFilesUsed = audioFileSpritesPool.getAudioFilesUsed(); //Returns an object with the data.
	var audioFilesUsed_2 = audioFileSpritesPool.getAudioFilesUsed(true); //Returns an array with the data.
	var audioFilesUsed_3 = audioFileSpritesPool.getAudioFilesUsed(false, true); //Returns an object with the data and including the CB_AudioFile objects whose sound instance ID is not associated to any sprite.
	
	//Gets the number of CB_AudioFile objects created (stored in 'CB_AudioFileSprites#audioFileCache.audioFiles' of all the CB_AudioFileSprites objects):
	var audioFilesTotal = audioFileSpritesPool.getAudioFilesNumber(true);

	//Gets all the CB_AudioFile objects created (stored in 'CB_AudioFileSprites#audioFileCache.audioFiles' of all the CB_AudioFileSprites objects):
	var audioFiles = audioFileSpritesPool.getAudioFiles(true); //Returns an object ordered by sprites groups whose values are arrays.
	var audioFiles_2 = audioFileSpritesPool.getAudioFiles(true, true); //Returns an array.

	//Gets the busy CB_AudioFile objects (the objects which are not available and ready to use):	
	var audioFilesBusy = audioFileSpritesPool.getAudioFilesBusy(); //Returns an object ordered by sprites groups whose values are arrays.
	var audioFilesBusy_2 = audioFileSpritesPool.getAudioFilesBusy(true); //Returns an array.
	
	//Gets the current number of free CB_AudioFile objects (the number of objects which are available and ready to use):
	var audioFilesFreeTotal = audioFileSpritesPool.getAudioFilesFreeNumber();
	
	//Gets the free CB_AudioFile objects (the objects which are available and ready to use):
	var audioFilesFree = audioFileSpritesPool.getAudioFilesFree(); //Returns an object ordered by sprites groups whose values are arrays.
	var audioFilesFree_2 = audioFileSpritesPool.getAudioFilesFree(true); //Returns an array.

	//Gets the CB_AudioFile, through its sound instance identifier (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprite' methods of any CB_AudioFileSprites object):
	var soundInstanceId = audioFileSpritesPool.getSpritesGroup("numeros").playSprite("cinco");
	var audioFile = audioFileSpritesPool.getAudioFileBySoundInstanceId(soundInstanceId);
	if (audioFile !== null)
	{
		CB_console("CB_AudioFile object got from the sound instance ID.");
		
		//Do things with it...
	}

	//Returns the ID of all the sound instances (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprite' methods of any CB_AudioFileSprites object) used:
	var soundInstanceIDs = audioFileSpritesPool.getSoundInstancesId(); //Returns an object with the data, ordered by sprites groups.
	var soundInstanceIDs_2 = audioFileSpritesPool.getSoundInstancesId(true); //Returns an array with the data.
	var soundInstanceIDs_3 = audioFileSpritesPool.getSoundInstancesId(true, true); //Returns an array with the data, including the sound instance identifiers which are not associated to any sprite.

	//Cancels (to prevent it starts playing) a sound instance (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprite' methods of any CB_AudioFileSprites object), by its identifier:
	audioFileSpritesPool.cancelSoundInstance(soundInstanceId, true); //Use "false" as the second parameter to enable it again (if it is not too late).

	//Cancels (to prevent it starts playing) all sound instances (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprite' methods of any CB_AudioFileSprites object):
	audioFileSpritesPool.cancelSoundInstances(true); //Use "false" as the first parameter to enable them again (if it is not too late).
	
	//Checks whether a CB_AudioFile object is free (available and ready to use), by its id:
	var audioFileFree = audioFileSpritesPool.getSpritesGroup("numeros").getFreeAudioFile(); //The CB_AudioFile object will not be "popped" (removed) from the 'CB_AudioFileSprites#audioFileCache.audioFilesFree' property.
	if (audioFileSpritesPool.isAudioFileFree(audioFileFree.object.id)) { CB_console("The CB_AudioFile whose ID is " + audioFileFree.object.id + " is free!"); }
	else { CB_console("The CB_AudioFile whose ID is " + audioFileFree.object.id + " is not free (or it does not exist in the audio file sprites pool object)!"); }
</code></pre>

<p>
	One of the most interesting features when managing audio file sprites pool objects with CrossBrowdy is that you can change the audio API of all their internal <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects on the fly (even when they are currently playing!). This can be done easily:
</p>
<pre><code class="language-javascript">
	//Tries to changes the audio API used by all the internal CB_AudioFile objects (this will work even on the fly, when they are currently playing):
	audioFileSpritesPool.setAudioAPIAll
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
		function(errors, errorsHappened, objectsChangedAPI, performedActions, actionsNeeded)
		{
			CB_console("Setting the desired audio API(s) could not be performed!");
			for (var spritesGroupID in errors)
			{
				CB_console(spritesGroupID + " => " + errors[spritesGroupID].error);
				CB_console("* Number of errors that happened (could be greater than 1 if more than one internal call to the CB_AudioFile#setAudioAPI method failed): " + errors[spritesGroupID].errors);
				CB_console("* Number of objects that actually changed its audio API: " + errors[spritesGroupID].changed);
				CB_console("* Number of CB_AudioFile objects that ended with a desired audio API, including those ones which were already using it: " + errors[spritesGroupID].performed);
				CB_console("* Total number of CB_AudioFile objects that were considered to perform the action (it will be undefined if it could not be determined): " + errors[spritesGroupID].needed);
			}
			CB_console("Total number of errors that happened (could be greater than 1 if more than one internal call to the CB_AudioFile#setAudioAPI method failed): " + errorsHappened);
			CB_console("Total number of CB_AudioFile objects that actually changed its audio API: " + objectsChangedAPI);
			CB_console("Total number of CB_AudioFile objects that ended with a desired audio API, including those ones which were already using it: " + performedActions);
			CB_console("Total number of CB_AudioFile objects that were considered to perform the action (it will be undefined if it could not be determined): " + actionsNeeded);
		},
		
		//isMandatory. Optional. Default: false. Set to undefined or null to use the default one:
		false,
		
		//forceReload. Optional. Default: false. Set to undefined or null to use the default one:
		false,
		
		//audioFiles. Optional. Default: CB_AudioFileSprites#audioFileCache.audioFiles. Set to undefined or null to use the default one:
		undefined
	);
</code></pre>

<p>
	Apart from some previous methods seen before, it is also possible to perform other bulk actions that will affect all the internal <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects that the audio file sprites pool object uses:
</p>
<pre><code class="language-javascript">
	//Executes a function over all the internal CB_AudioFile objects, being "this" each CB_AudioFile itself:
	//NOTE: same as 'audioFileSpritesPool.executeAll' and 'audioFileSpritesPool.executeFunctionAll'
	audioFileSpritesPool.forEach(function(index) { CB_console("CB_AudioFile ID: " + this.id); });
	audioFileSpritesPool.forEach(function(index) { CB_console("CB_AudioFile ID: " + this.id); }, 100); //Adds a 100 milliseconds delay between each call.

	//Executes a function over all the internal CB_AudioFile objects used by all the sound instances (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprite' methods of any CB_AudioFileSprites object) currently created (being "this" each CB_AudioFile itself):
	//NOTE: Same as 'audioFileSpritesPool.executeAllSprites' and 'audioFileSpritesPool.executeFunctionAllSprites'.
	audioFileSpritesPool.forEachSprite(function(index) { CB_console("CB_AudioFile ID: " + this.id); });
	audioFileSpritesPool.forEachSprite(function(index) { CB_console("CB_AudioFile ID: " + this.id); }, 150); //Adds a 150 milliseconds delay between each call.
	
	//Plays all the CB_AudioFile objects:
	audioFileSpritesPool.playAll
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
	audioFileSpritesPool.setVolumeAll(80, false, function() { CB_console("Volume (80) set for the CB_AudioFile with ID " + this.id); });

	//Mutes all the CB_AudioFile objects:
	audioFileSpritesPool.muteAll(function() { CB_console("CB_AudioFile with ID " + this.id + " muted!"); });
	
	//Unmutes all the CB_AudioFile objects:
	audioFileSpritesPool.unmuteAll(function() { CB_console("CB_AudioFile with ID " + this.id + " unmuted!"); });
	
	//Pauses all the CB_AudioFile objects:
	audioFileSpritesPool.pauseAll(function() { CB_console("CB_AudioFile with ID " + this.id + " paused!"); });
	
	//Resumes all CB_AudioFile objects:
	audioFileSpritesPool.resumeAll
	(
		null, //loop. Optional. Default: CB_AudioFile#loop. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelay. Optional. Default: CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT. Set to undefined or null to use the default one.
		null, //allowedRecursiveDelaySkipping. Optional. Default: CB_AudioFile#lastStopAt-CB_AudioFile#lastStartAt. Set to undefined or null to use the default one.
		function(soundInstanceId, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime) { CB_console("CB_AudioFile with ID " + this.id + " playing"); }, //onPlayStart. Optional.
		function(soundInstanceId) { CB_console("CB_AudioFile with ID " + this.id + " stopped!"); }, //onStop. Optional.
		null, //audioFiles. Optional. Default: CB_AudioFileSprites#audioFileCache.audioFiles. Set to undefined or null to use the default one.
		//Internal usage only recommended:
		undefined //spriteId. Optional. Default: '_WITHOUT_SPRITE_ASSOCIATED'. Set to undefined or null to use the default one.
	);

	//Plays and stops all the CB_AudioFile objects:
	//Note: it can be useful for some clients which need the CB_AudioFile#play method to be called through a user-driven event (as onClick, onTouch, etc.).
	audioFileSpritesPool.playAndStopAll(); //It will not try to play those which are already playing. With the default delay before stopping them (100 milliseconds).
	audioFileSpritesPool.playAndStopAll(true, 500); //It will try to play again even those which are already playing. With a delay of 500 milliseconds before stopping them.
	
	//Stops all the CB_AudioFile objects:
	audioFileSpritesPool.stopAll();
</code></pre>
<p>
	It is interesting to know that the methods above can also accept an array of <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects as a parameter to only affect those objects instead of all the internal ones.
</p>

<p>
	Some other interesting methods that you might not need:
</p>
<pre><code class="language-javascript">	
	//Clears the sound instances (created by the 'CB_AudioFileSprites#play' and 'CB_AudioFileSprites#playSprite' methods of any CB_AudioFileSprites object) which have been cancelled:
	audioFileSpritesPool.clearSoundInstances();
	
	//Tries to purge each internal CB_AudioFileSprites object until it reaches a desired number of CB_AudioFile objects (set in the 'CB_AudioFileSprites#audioFileCache.audioFiles' property), removing and destroying some of the current CB_AudioFile objects. For performance purposes:
	audioFileSpritesPool.purge(10); //It tries to go down to ten CB_AudioFile objects of each internal CB_AudioFileSprites object.

	//Cleans the 'CB_AudioFileSprites#audioFileCache.audioFiles' array of all the internal CB_AudioFileSprites objects, taking off (destroying and removing) the CB_AudioFile objects which are undefined or null. For performance purposes. Internal usage only recommended:
	audioFileSpritesPool.clearAudioFiles();

	//Calls the error function which should be set in the 'audioFileSpritesPool.onError' property (if any), being "this" the CB_AudioFileSpritesPool object itself. Internal usage only recommended:
	audioFileSpritesPool.errorFunction("Error message"); //Only executes the error function if it was not called before (it could have already been called by any internal process).
	audioFileSpritesPool.errorFunction("Error message", true); //Executes the error function regardless it was executed before or not.
</code></pre>

<p>
	In order to free memory and resources, it is possible to destroy the audio file sprites pool object and its internal <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a> and <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a> objects:
</p>	
<pre><code class="language-javascript">	
	//Destroys all the internal CB_AudioFile objects (but not the internal audio file sprites objects) by calling 'CB_AudioFileSprites#audioFileCache.destroyAll' of each internal CB_AudioFileSprites object, and frees memory:
	audioFileSpritesPool.destroyAll();
	audioFileSpritesPool.destroyAll(true); //Also stops sounds.
	
	//Destroys the audio file sprites pool object (removing all sprites, etc.), including the internal audio file sprites objects, and frees memory (already calls the 'audioFileSpritesPool.destroyAll' method internally):
	audioFileSpritesPool.destructor();
	audioFileSpritesPool.destructor(true); //Also stops sounds.
</code></pre>

<p>
	It is also possible to re-load again an audio file sprites pool object:
</p>
<pre><code class="language-javascript">	
	//Loads the audio file sprites pool object again with the data given:
	/*	NOTE:
		It is recommended to do it through a user-driven event (as "onClick", "onTouchStart", etc.) in order to maximize compatibility (as some clients could block sounds otherwise).
		If the 'disableAutoLoad' option is enabled, it is always necessary to call the 'createAudioFiles' of each CB_AudioFileSprites manually.
	*/
	audioFileSpritesPool.load(audioFileSpritesPoolData);
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a> class.
</p>