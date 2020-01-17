/**
 * @file Audio formats and audio APIs support detection. Contains the {@link CB_AudioDetector} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */
 

/**
 * Static class to detect audio API and formats supported. Possible audio APIs are "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). It will return itself if it is tried to be instantiated.
 * @namespace
 */
var CB_AudioDetector = function() { return CB_AudioDetector; };
{
	CB_AudioDetector.initialized = false; //It will tells whether the object has been initialized or not.


	//Initializes all values:
	CB_AudioDetector.init = function()
	{
		if (CB_AudioDetector.initialized) { return CB_AudioDetector; }

		//Sets that the object has already been initialized:
		CB_AudioDetector.initialized = true;
		
		//TODO.
		
		return CB_AudioDetector;
	}


	CB_AudioDetector._getSupportedAudioFormatsReturnCache = {};
	/**
	 * Returns an array of strings with the audio formats that are supported (from an array if it is given) by the current client and ordered by support level. Uses the {@link CB_AudioDetector.isAudioFormatSupported} function internally.
	 *  @function
	 *  @param {array} [audioFormats=CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS] - An array of strings with the audio format or audio formats (they can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"') that we want to check.
	 *  @param {array} [supportLevels=['probably', 'maybe']] - An array with the support level or support levels allowed. Two possible levels: "probably" and "maybe". The "probably" audio formats are more likely to be supported than the "maybe" ones.
	 *  @param {boolean} [dataURI=false] - Specifies whether we want to check the support for data URI audios or just for normal audio files.
	 *  @returns {array} Returns an array of strings with the audio formats that are supported (from an array if it is given) and ordered by support level.
	 */
	CB_AudioDetector.getSupportedAudioFormats = function(audioFormats, supportLevels, dataURI)
	{
		//If not given any APIs, uses the default ones with the default order:
		if (typeof(audioFormats) === "undefined" || audioFormats === null || !CB_isArray(audioFormats)) { audioFormats = CB_Configuration[CB_BASE_NAME].CB_AudioFileCache_PREFERRED_AUDIO_FORMATS; }

		//If not given, it will return "probably" and "maybe" ones and in that order ("probably" are more likely to be supported than "maybe" ones):
		if (!CB_isArray(supportLevels)) { supportLevels = ["probably", "maybe"]; }
		
		//If it is not the first time, returns the same as the first time (from the cache):
		if (typeof(CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats]) !== "undefined" && CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats] !== null)
		{
			if (typeof(CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats][supportLevels]) !== "undefined" && CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats][supportLevels] !== null)
			{
				if (typeof(CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats][supportLevels][dataURI]) !== "undefined" && CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats][supportLevels][dataURI] !== null)
				{
					return CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats][supportLevels][dataURI];
				}
			}
		}

		var supportedAudioFormats = [];

		var audioFormatsLength = audioFormats.length;
		
		//Checks the different support levels by order of preference ("probably" are more likely to be supported than "maybe" ones):
		var supportLevelsLength = supportLevels.length;
		var y;
		for (var x = 0; x < supportLevelsLength; x++)
		{
			for (y = 0; y < audioFormatsLength; y++)
			{
				if (CB_AudioDetector.isAudioFormatSupported(audioFormats[y], dataURI) === supportLevels[x])
				{
					if (CB_indexOf(supportedAudioFormats, audioFormats[y]) === -1)
					{
						supportedAudioFormats[supportedAudioFormats.length] = audioFormats[y];
					}
				}
			}
		}
		
		//Stores the result in the cache for the next time:
		if (typeof(CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats]) === "undefined")
		{
			CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats] = {};
		}
		if (typeof(CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats][supportLevels]) === "undefined")
		{
			CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats][supportLevels] = {};
		}
		CB_AudioDetector._getSupportedAudioFormatsReturnCache[audioFormats][supportLevels][dataURI] = supportedAudioFormats;
		
		return supportedAudioFormats;
	}
	
	
	CB_AudioDetector._isAudioFormatSupportedReturnCache = {};
	CB_AudioDetector._audioObject = null;
	/**
	 * Returns the support level of a given audio format by the current client.
	 *  @function
	 *  @param {string} audioFormat - The audio format (it can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"') that we want to check.
	 *  @param {boolean} [dataURI=false] - Specifies whether we want to check the support for data URI audios or just for normal audio files.
	 *  @returns {string} Returns the support level of the given audio format (it will return "probably", "maybe" or an empty string which means not supported). The "probably" audio formats are more likely to be supported than the "maybe" ones.
	 *  @todo Think about using MediaSource.isTypeSupported().
	 *  @todo Some web clients does not support data URIs for Audio element so we should take this into account.
	 *  @todo Take into account that data URIs may not be supported when WAAPI is being emulated.
	 */
	CB_AudioDetector.isAudioFormatSupported = function(audioFormat, dataURI)
	{
		audioFormat = CB_trim(audioFormat).toLowerCase();
		
		//If it is not the first time, returns the same as the first time (from the cache):
		if (typeof(CB_AudioDetector._isAudioFormatSupportedReturnCache[audioFormat]) !== "undefined" && CB_AudioDetector._isAudioFormatSupportedReturnCache[audioFormat] !== null)
		{
			if (typeof(CB_AudioDetector._isAudioFormatSupportedReturnCache[audioFormat][dataURI]) !== "undefined" && CB_AudioDetector._isAudioFormatSupportedReturnCache[audioFormat][dataURI] !== null)
			{
				return CB_AudioDetector._isAudioFormatSupportedReturnCache[audioFormat][dataURI];
			}
		}

		var isSupported = "";

		//TODO: think about using MediaSource.isTypeSupported().
		
		if (CB_AudioDetector.isAPISupported("AAPI", false))
		{
			if (CB_AudioDetector._audioObject === null)
			{
				CB_AudioDetector._audioObject = new Audio();
			}
			
			//TODO: some web clients does not support data URIs for Audio element so we should take this into account.
			
			if (CB_AudioDetector._audioObject !== null && typeof(CB_AudioDetector._audioObject.canPlayType) === "function")
			{
				isSupported = CB_AudioDetector._audioObject.canPlayType(audioFormat);
			}
		}
		//...otherwise, if SoundManager 2 is loaded and it is using Flash:
		else if (CB_AudioDetector.isAPISupported("SM2", false) && CB_AudioDetector.isSM2UsingFlash())
		{
			//SoundManager 2 using Flash supports MP3 only and does not support data URIs:
			if (!dataURI && audioFormat.substring(0, 10) === "audio/mpeg") { isSupported = "maybe"; }
		}
		
		//Stores the result in the cache for the next time:
		if (typeof(CB_AudioDetector._isAudioFormatSupportedReturnCache[audioFormat]) === "undefined")
		{
			CB_AudioDetector._isAudioFormatSupportedReturnCache[audioFormat] = {};
		}
		CB_AudioDetector._isAudioFormatSupportedReturnCache[audioFormat][dataURI] = isSupported;
		
		return ("" + isSupported).toLowerCase();
	}
	
	
	/**
	 * Returns whether a given audio API exists or not (without keeping into account whether it is supported or not). All existing ones are defined in {@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}.
	 *  @function
	 *  @param {string} audioAPI - The audio API that we want to check. All existing ones are defined in {@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}. For example: "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
	 *  @param {boolean} [sanitize=true] - If set to true, the "audioAPI" given will be trimmed and converted to upper case.
	 *  @returns {boolean} Returns whether the given audio API exists or not (without keeping into account whether it is supported or not).
	 */
	CB_AudioDetector.APIExists = function(audioAPI, sanitize)
	{
		if (typeof(sanitize) === "undefined" || sanitize === null) { sanitize = true; }
		if (sanitize) { audioAPI = CB_trim(audioAPI).toUpperCase(); }
		return (CB_indexOf(CB_Configuration[CB_BASE_NAME].CB_AudioFileCache_PREFERRED_AUDIO_APIS, audioAPI) !== -1);
	}
	
	
	CB_AudioDetector._getPreferredAPIReturnCache = {};
	/**
	 * Calculates and returns the preferred audio API (from an array if it is given) for the current client, if any.
	 *  @function
	 *  @param {array} [audioAPIs=CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS] - An array of strings with the audio APIs that we want to check, in order of preference. All existing ones are defined in {@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}. For example: "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
	 *  @param {boolean} [allowEmulation=!!CB_Configuration[CB_BASE_NAME].CB_AudioDetector_allowEmulation_DEFAULT] - If set to true, it will also detect as supported emulated audio APIs (as "WAAPI" using [waapisim.js]{@link https://github.com/g200kg/WAAPISim} instead of supported natively).
	 *  @param {boolean} [returnOnEmpty=undefined] - If set to true and no audio API is supported, it will return the value of this parameter instead of null.
	 *  @returns {string|*} Returns a string with the preferred audio API (from an array if it is given) for the current client, if any. If no audio API is supported, it will return the value set in the "returnOnEmpty" parameter.
	 */
	CB_AudioDetector.getPreferredAPI = function(audioAPIs, allowEmulation, returnOnEmpty)
	{
		audioAPIs = CB_AudioDetector.getSupportedAPIs(audioAPIs, allowEmulation);

		if (allowEmulation !== true && allowEmulation !== false) { allowEmulation = !!CB_Configuration[CB_BASE_NAME].CB_AudioDetector_allowEmulation_DEFAULT; }

		//If it is not the first time, returns the same as the first time (from the cache):
		if (typeof(CB_AudioDetector._getPreferredAPIReturnCache[audioAPIs]) !== "undefined" && CB_AudioDetector._getPreferredAPIReturnCache[audioAPIs] !== null)
		{
			if (typeof(CB_AudioDetector._getPreferredAPIReturnCache[audioAPIs][allowEmulation]) !== "undefined" && CB_AudioDetector._getPreferredAPIReturnCache[audioAPIs][allowEmulation] !== null)
			{
				return CB_AudioDetector._getPreferredAPIReturnCache[audioAPIs][allowEmulation];
			}
			else if (CB_AudioDetector._getPreferredAPIReturnCache[audioAPIs][allowEmulation] === null)
			{
				return returnOnEmpty;
			}
		}
		else
		{
			CB_AudioDetector._getPreferredAPIReturnCache[audioAPIs] = {};
		}
		
		var preferredAPI = null;
		
		if (audioAPIs.length > 0) { preferredAPI = audioAPIs[0]; }

		//Stores the result in the cache for the next time:
		CB_AudioDetector._getPreferredAPIReturnCache[audioAPIs][allowEmulation] = preferredAPI;
		
		if (preferredAPI === null) { preferredAPI = returnOnEmpty; }
		
		return preferredAPI;
	}
	
	
	CB_AudioDetector._getSupportedAPIsReturnCache = {};
	/**
	 * Calculates and returns an array with the audio APIs supported (from an array if it is given) for the current client, if any.
	 *  @function
	 *  @param {array} [audioAPIs=CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS] - An array of strings with the audio APIs that we want to check. All existing ones are defined in {@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}. For example: "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
	 *  @param {boolean} [allowEmulation=!!CB_Configuration[CB_BASE_NAME].CB_AudioDetector_allowEmulation_DEFAULT] - If set to true, it will also detect as supported emulated audio APIs (as "WAAPI" using [waapisim.js]{@link https://github.com/g200kg/WAAPISim} instead of supported natively).
	 *  @returns {array} Returns an array with the audio APIs supported (from an array if it is given) for the current client, if any. If no audio API is supported, an empty array will be returned.
	 */
	CB_AudioDetector.getSupportedAPIs = function(audioAPIs, allowEmulation)
	{
		//If not given any APIs, uses the default ones with the default order:
		if (typeof(audioAPIs) === "undefined" || audioAPIs === null || !CB_isArray(audioAPIs)) { audioAPIs = CB_Configuration[CB_BASE_NAME].CB_AudioFileCache_PREFERRED_AUDIO_APIS; }

		if (allowEmulation !== true && allowEmulation !== false) { allowEmulation = !!CB_Configuration[CB_BASE_NAME].CB_AudioDetector_allowEmulation_DEFAULT; }

		//If it is not the first time, returns the same as the first time (from the cache):
		if (typeof(CB_AudioDetector._getSupportedAPIsReturnCache[audioAPIs]) !== "undefined" && CB_AudioDetector._getSupportedAPIsReturnCache[audioAPIs] !== null)
		{
			if (typeof(CB_AudioDetector._getSupportedAPIsReturnCache[audioAPIs][allowEmulation]) !== "undefined" && CB_AudioDetector._getSupportedAPIsReturnCache[audioAPIs][allowEmulation] !== null)
			{
				return CB_AudioDetector._getSupportedAPIsReturnCache[audioAPIs][allowEmulation];
			}
		}
		else
		{
			CB_AudioDetector._getSupportedAPIsReturnCache[audioAPIs] = {};
		}

		
		var supportedAudioAPIs = [];
		
		var audioAPIsLength = audioAPIs.length;
		for (var x = 0; x < audioAPIsLength; x++)
		{
			if (CB_AudioDetector.isAPISupported(audioAPIs[x], allowEmulation))
			{
				if (CB_indexOf(supportedAudioAPIs, audioAPIs[x]) === -1)
				{
					supportedAudioAPIs[supportedAudioAPIs.length] = audioAPIs[x];
				}
			}
		}
		
		//Stores the result in the cache for the next time:
		CB_AudioDetector._getSupportedAPIsReturnCache[audioAPIs][allowEmulation] = supportedAudioAPIs;
		
		return supportedAudioAPIs;
	}
	
	
	CB_AudioDetector._isAPISupportedReturnCache = {};
	/**
	 * Tells whether a given audio API is supported or not by the current client.
	 *  @function
	 *  @param {string} audioAPI - The audio API that we want to check. All existing ones are defined in {@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}. For example: "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
	 *  @param {boolean} [allowEmulation=!!CB_Configuration[CB_BASE_NAME].CB_AudioDetector_allowEmulation_DEFAULT] - If set to true, it will detect as supported also emulated audio APIs (as "WAAPI" using [waapisim.js]{@link https://github.com/g200kg/WAAPISim} instead of supported natively).
	 *  @returns {boolean} Returns whether the given audio API is supported or not.
	 *  @todo Have into account allowEmulation and detect whether emulation is being used if so (for example, detect whether [waapisim.js]{@link https://github.com/g200kg/WAAPISim} is being used).
	 */
	CB_AudioDetector.isAPISupported = function(audioAPI, allowEmulation)
	{
		audioAPI = CB_trim(audioAPI).toUpperCase();
		
		if (allowEmulation !== true && allowEmulation !== false) { allowEmulation = !!CB_Configuration[CB_BASE_NAME].CB_AudioDetector_allowEmulation_DEFAULT; }
		
		//If it is not the first time, returns the same as the first time (from the cache):
		if (typeof(CB_AudioDetector._isAPISupportedReturnCache[audioAPI]) !== "undefined" && CB_AudioDetector._isAPISupportedReturnCache[audioAPI] !== null)
		{
			if (typeof(CB_AudioDetector._isAPISupportedReturnCache[audioAPI][allowEmulation]) !== "undefined" && CB_AudioDetector._isAPISupportedReturnCache[audioAPI][allowEmulation] !== null)
			{
				return CB_AudioDetector._isAPISupportedReturnCache[audioAPI][allowEmulation];
			}
		}
		else
		{
			CB_AudioDetector._isAPISupportedReturnCache[audioAPI] = {};
		}

		var isSupported = false;

		//TODO: Have into account allowEmulation and detect whether emulation is being used if so (for example, detect whether waapisim.js is being used).
		
		//Detects whether it is supported or not:
		if (audioAPI === "WAAPI") //Web Audio API.
		{
			isSupported = (allowEmulation || !CB_AudioDetector.isWAAPIUsingEmulation()) && (typeof(window.AudioContext) !== "undefined" || typeof(window.webkitAudioContext) !== "undefined");
		}
		else if (audioAPI === "ACMP") //Apache Cordova Media Plugin.
		{
			isSupported = (typeof(Media) !== "undefined");
		}
		else if (audioAPI === "AAPI") //Audio API.
		{
			isSupported = (typeof(window.Audio) !== "undefined");
		}
		else if (audioAPI === "SM2") //SoundManager 2.
		{
			//SM2 needs either Audio API or Flash:
			isSupported = CB_soundManager2Supported && (CB_AudioDetector.isAPISupported("AAPI", false) || CB_AudioDetector.isSM2UsingFlash() && CB_Client.supportsFlash());
		}
		
		//Stores the result in the cache for the next time:
		CB_AudioDetector._isAPISupportedReturnCache[audioAPI][allowEmulation] = isSupported;
		
		return isSupported;
	}

	
	/**
	 * Tells whether "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}) is using emulation (through [WAAPISim]{@link https://github.com/g200kg/WAAPISim}) or not.
	 *  @function
	 *  @returns {boolean} Returns whether "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}) is using emulation (through [WAAPISim]{@link https://github.com/g200kg/WAAPISim}) or not.
	 */
	CB_AudioDetector.isWAAPIUsingEmulation = function()
	{
		return CB_Configuration[CB_BASE_NAME].WAAPISIM_LOAD;
	}
	
	
	/**
	 * Tells whether [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/} is using [Adobe Flash (formerly Macromedia Flash)]{@link https://en.wikipedia.org/wiki/Adobe_Flash_Player} to emulate sound or not.
	 *  @function
	 *  @returns {boolean} Returns whether [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/} is using [Adobe Flash (formerly Macromedia Flash)]{@link https://en.wikipedia.org/wiki/Adobe_Flash_Player} to emulate sound or not.
	 */
	CB_AudioDetector.isSM2UsingFlash = function()
	{
		return (typeof(soundManager) !== "undefined" && soundManager !== null && typeof(soundManager.html5) !== "undefined" && soundManager.html5 !== null && soundManager.html5.usingFlash);
	}
	
	
} //End of the static class CB_AudioDetector.