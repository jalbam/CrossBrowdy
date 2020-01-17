/**
 * @file Audio files management, including abstraction for different audio APIs. Possible audio APIs are "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). Contains the {@link CB_AudioFile} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */

 
/**
 * The constructor is recommended to be called through a user-driven event (as onClick, onTouch, etc.) if the "autoPlay" option is set to true, as some clients may need this at least the first time in order to be able to play the audio.
 *  @class
 *  @classdesc Class to manage an audio file. Internally, it uses one audio API object which belongs to the audio API being used (when the audio API is changed, it keeps the old audio API objects just in case they are needed in the future when the audio API is changed again). Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @param {string} filePath - The path of the audio file or a data URI. NOTE: Only some clients with some audio APIs will support data URIs.
 *  @param {string} [audioId='CB_AudioFile_' + CB_AudioFile._idUnique++] - Desired identifier for the audio object (can be a different element depending on the audio API used). If not provided, an automatic unique ID will be calculated. Note that it is not case sensitive and it should be unique for each object.
 *  @param {CB_AudioFile.OPTIONS} [options={@link CB_AudioFile#DEFAULT_OPTIONS}] - Object with the desired options.
 *  @param {string} [audioAPI=CB_AudioDetector.getPreferredAPI(undefined, false, null) || CB_AudioDetector.getPreferredAPI(undefined, true, null)] - The desired audio API to be used. If not provided, it will try to calculate the best one for the current client by calling the {@link CB_AudioDetector.getPreferredAPI} function internally. Audio API support will depend on the current client being used. All possible ones are defined in {@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}. For example: "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been loaded successfully, being "this" the {@link CB_AudioFile} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been loaded successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile} object itself.
 *  @returns {CB_AudioFile} Returns a new {@link CB_AudioFile} object.
 *  @todo Do not allow to create one object with an "id" which has already been used (unless the value is undefined, null...). Note that the "id" is not case sensitive and it should be unique for each object.
 *  @todo Send the {@link CB_AudioFile} object itself as a parameter when calling both "callbackOk" and "callbackError".
 *  @todo Think about allowing to define 'useXHR' and 'useCache' options (used by {@link CB_AudioFile_API.WAAPI} objects).
 *  @todo Method getCopy and static method filterProperties (similar to the ones from {@link CB_GraphicSprites} and {@link CB_GraphicSpritesScene}).
 */
var CB_AudioFile = function(filePath, audioId, options, audioAPI, callbackOk, callbackError)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_AudioFile)) { return new CB_AudioFile(filePath, audioId, options, audioAPI, callbackOk, callbackError); }
	
	//Constants:
	/**
	 * Keeps the default volume. If the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT} property is true, this will keep the result of calling the {@link CB_Speaker.getVolume} function. Otherwise, it will use the value of the {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME} variable.
	 *	@constant
	 *  @type {number}
	 *  @default CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME
	 */
	CB_AudioFile.prototype.DEFAULT_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME;
	
	/**
	 * Keeps the default options when an object is created. Format: { autoLoad: boolean, autoPlay: boolean, loop: boolean, volume: number }.
	 *	@constant
	 *  @type {CB_AudioFile.OPTIONS}
	 *  @default { autoLoad: true, autoPlay: false, loop: false, volume: [CB_AudioFile.prototype.DEFAULT_VOLUME]{@link CB_AudioFile#DEFAULT_VOLUME} }
	 */
	CB_AudioFile.prototype.DEFAULT_OPTIONS = { autoLoad: true, autoPlay: false, loop: false, volume: CB_AudioFile.prototype.DEFAULT_VOLUME };
	
	
	//Properties and variables:
	/**
	 * Defines whether the file loops by default when the audio is played or not. Its value will be modified automatically whenever the {@link CB_AudioFile#play} method is called, getting the value from the "loop" parameter (but only if contains a boolean).
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default [CB_AudioFile.prototype.DEFAULT_OPTIONS]{@link CB_AudioFile#DEFAULT_OPTIONS}.loop
	 */
	this.loop = CB_AudioFile.prototype.DEFAULT_OPTIONS.loop;

	/**
     * Stores the volume of this audio. Accepted values go from 0 to MAX_VOLUME, where MAX_VOLUME is 100 if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is false or otherwise MAX_VOLUME is the returning value of the {@link CB_Speaker.getVolume} function.
	 *	@var
	 *  @readonly
	 *  @type {number}
	 *  @default [CB_AudioFile.prototype.DEFAULT_OPTIONS]{@link CB_AudioFile#DEFAULT_OPTIONS}.volume
	 */
	this.volume = CB_AudioFile.prototype.DEFAULT_OPTIONS.volume;
	
	/**
     * Stores the identifier for the audio file.
	 *	@var
	 *  @readonly
	 *  @type {string}
	 *  @default 'CB_AudioFile_' + CB_AudioFile._idUnique++
	 */
	this.id = "";
	
	/**
     * Stores the path of the audio file or the data URI. NOTE: Only some clients with some audio APIs will support data URIs.
	 *	@var
	 *  @readonly
	 *  @type {string}
	 *  @default
	 */
	this.filePath = "";
	
	/**
     * Defines the Audio API used for this audio file. Audio API support will depend on the current client being used. All possible ones are defined in {@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}. For example: "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
	 *	@var
	 *  @readonly
	 *  @type {string}
	 *  @default
	 */
	this.audioAPI = null;

	this._onStopFunction = null; //Function to call when the audio stops.

	
	//Fake AudioFile[x] object:
	var that = this;
	CB_AudioFile._audioFileObject_prototype = CB_AudioFile._audioFileObject_prototype ||
	{
		usingPrototype : true,
		status : CB_AudioFile.UNLOADED,
		paused : false,
		stopped : true,
		destructor : function() {},
		getDuration : function() { return 0; },
		checkPlaying :
			function(callbackOk, callbackError)
			{
				if (typeof(callbackError) === "function") { callbackError.call(that, "audioFileObject is not loaded (using CB_AudioFile._audioFileObject_prototype)"); }
				return false;
			},
		play : function() {},
		resume : function() {},
		pause : function() {},
		stop : function() {},
		volume : this.DEFAULT_OPTIONS.volume,
		volumeBeforeMute : this.DEFAULT_OPTIONS.volume,
		setVolume :
			function(volume)
			{
				var MAX_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM ? CB_Speaker.getVolume() : 100;
				if (volume > MAX_VOLUME) { volume = MAX_VOLUME; }
				else if (volume < 0) { volume = 0; }
				this.volume = volume;
				return volume;
			},
		mute :
			function()
			{
				this.volumeBeforeMute = this.volume;
				this.volume = 0;
				return 0;
			},
		unmute :
			function()
			{
				this.volume = this.volumeBeforeMute;
				return this.volume;
			},
		getCurrentTime : function() { return 0; },
		onStop : function() { return false; },
		getProgress : function() { return 0; }
	};
	CB_AudioFile._audioFileObject_prototype.volume = CB_AudioFile.prototype.DEFAULT_OPTIONS.volume; //Updates the property because maybe the volume has changed.
	CB_AudioFile._audioFileObject_prototype.volumeBeforeMute = CB_AudioFile.prototype.DEFAULT_OPTIONS.volume; //Updates the property because maybe the volume has changed.

	/**
     * It will store the created audio file objects for the different audio APIs (for optimization purposes, to avoid creating more than one per API). Being each index the name of the audio API ("WAAPI", "AAPI", "SM2" or "ACMP"), their value will be an object which can be {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). Recommended for internal usage only.
	 *	@var
	 *  @type {Object}
	 *  @default
	 */
	this.audioFileObjects = {}; //It will store the created objects for the different audio APIs (for optimization purposes, to avoid creating more than one per API).
	

	/**
     * It will store the current audio file object for the current audio API. The {@link CB_AudioFile#load} method will set the value of this property only after the audio file object (stored in its value) is loaded properly. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). When no audio API object is being set, it will contain a fake object with same methods and properties (defined in {@link CB_AudioFile._audioFileObject_prototype}). Recommended for internal usage only.
	 *	@var
	 *  @type {CB_AudioFile_API.WAAPI | CB_AudioFile_API.SM2 | CB_AudioFile_API.ACMP | CB_AudioFile_API.AAPI | Object}
	 *  @default
	 */	
	this.audioFileObject = CB_AudioFile._audioFileObject_prototype;

	/**
     * Stores the last audio file object created or reused, for the current API being used. The {@link CB_AudioFile#load} method will set the value of this property before knowing whether the audio file object (stored in its value) will be loaded properly or not. Used by the {@link CB_AudioFile#load} and {@link CB_AudioFile#getProgress} methods. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). When no audio API object is being set, it will contain a fake object with same methods and properties (defined in {@link CB_AudioFile._audioFileObject_prototype}). Recommended for internal usage only.
	 *	@var
	 *  @type {CB_AudioFile_API.WAAPI | CB_AudioFile_API.SM2 | CB_AudioFile_API.ACMP | CB_AudioFile_API.AAPI | Object}
	 *  @default
	 */	
	this.audioFileObjectLast = CB_AudioFile._audioFileObject_prototype;
	
	this._loadingAudioFileObject = false; //Tells when the audio object is being loading.

	//Variables to keep same parameters when API is changed:
	this._avoidDelayedPlayLast = null;
	this._allowedRecursiveDelayLast = null;
	//this._onPlayStartLast = undefined;
	this._onLoadErrorLast = null;
	
	
	//Calls the constructor of the object when creates an instance:
	return this._init(filePath, audioId, options, audioAPI, callbackOk, callbackError);
}


/**
 * Object with the options for an audio file. The format is the following one: { autoLoad: boolean, autoPlay: boolean, loop: boolean, volume: number }.
 *  @memberof CB_AudioFile
 *  @typedef {Object} CB_AudioFile.OPTIONS
 *  @property {boolean} [autoLoad={@link CB_AudioFile#DEFAULT_OPTIONS}.autoLoad] - Value which will be used as the "autoLoad" parameter when calling the {@link CB_AudioFile#setAudioAPI} method internally (when the constructor is called).
 *  @property {boolean} [autoPlay={@link CB_AudioFile#DEFAULT_OPTIONS}.autoPlay] - Value which will be used as the "autoPlay" parameter when calling the {@link CB_AudioFile#setAudioAPI} method internally (when the constructor is called).
 *  @property {boolean} [loop={@link CB_AudioFile#DEFAULT_OPTIONS}.loop] - Value that will be used for the {@link CB_AudioFile#loop} property.
 *  @property {number} [volume={@link CB_AudioFile#DEFAULT_OPTIONS}.volume] - The desired volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise) that will be used for the {@link CB_AudioFile#volume} property.
 */


//Static properties and constants:
CB_AudioFile._idUnique = 0; //Counter to make the id unique.

/**
 * Status value for an audio file which is unloaded. Can be used to compare the value returned by the {@link CB_AudioFile#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default 0
 */
CB_AudioFile.UNLOADED = 0;

/**
 * Status value for an audio file which is loading. Can be used to compare the value returned by the {@link CB_AudioFile#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFile.LOADING = 1;

/**
 * Status value for an audio file which has been not checked yet. Can be used to compare the value returned by the {@link CB_AudioFile#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFile.UNCHECKED = 2;

/**
 * Status value for an audio file which is being checked currently. Can be used to compare the value returned by the {@link CB_AudioFile#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFile.CHECKING = 3;

/**
 * Status value for an audio file which has been loaded. Can be used to compare the value returned by the {@link CB_AudioFile#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFile.LOADED = 4;

/**
 * Status value for an audio file which failed to be loaded or failed for any other reason. Can be used to compare the value returned by the {@link CB_AudioFile#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFile.FAILED = 5;

/**
 * Status value for an audio file which has been aborted. This will happen when the audio file has been destroyed with the {@link CB_AudioFile#destructor} method. Can be used to compare the value returned by the {@link CB_AudioFile#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFile.ABORTED = 6;


//Constructor:
CB_AudioFile.prototype._init = function(filePath, audioId, options, audioAPI, callbackOk, callbackError)
{	
	//If not given, defines the default parameters:
	if (typeof(audioId) === "undefined" || audioId === null) { audioId = "CB_AudioFile_" + CB_AudioFile._idUnique++; } //Uses the file path as default id.
	if (typeof(options) === "undefined" || options === null) { options = this.DEFAULT_OPTIONS; }
	else
	{
		if (typeof(options.loop) === "undefined" || options.loop === null) { options.loop = this.DEFAULT_OPTIONS.loop; }
		if (typeof(options.autoLoad) === "undefined" || options.autoLoad === null) { options.autoLoad = this.DEFAULT_OPTIONS.autoLoad; }
		if (typeof(options.autoPlay) === "undefined" || options.autoPlay === null) { options.autoPlay = this.DEFAULT_OPTIONS.autoPlay; }
		if (typeof(options.volume) === "undefined" || options.volume === null) { options.volume = this.DEFAULT_OPTIONS.volume; }
	}

	//Sets the audio ID:
	this.id = CB_trim(audioId).toUpperCase();
	
	//Sets the file path:
	this.filePath = filePath;
	
	//Sets whether it will loop or not:
	this.loop = options.loop;

	//Sets the volume:
	//this.volume = options.volume;
	this.setVolume(options.volume);
	
	//Sets the audio API and proceeds according to the options received:
	this.setAudioAPI(audioAPI, options.autoLoad, options.autoPlay, callbackOk, callbackError); //Will load the audio too.
	
	//Returns the object:
	return this;
}


/**
 * Destroys the audio file object and frees memory. Sets its current status to ABORTED ({@link CB_AudioFile.ABORTED} value).
 *  @function
 *  @param {boolean} [stopSound=false] - If set to true, it will also call the "stop" method of the internal audio file object for the current API (stored in the {@link CB_AudioFile#audioFileObject} property). This method has the same parameters as the {@link CB_AudioFile#stop} method.
 *  @param {boolean} [keepStoppedUnaltered=false] - Used internally as the "keepStoppedUnaltered" parameter to call the "stop" method of the internal audio file object for the current API (stored in the {@link CB_AudioFile#audioFileObject} property). This method has the same parameters as the {@link CB_AudioFile#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 *  @param {boolean} [avoidOnStop=false] - Used internally as the "avoidOnStop" parameter to call the "stop" method of the internal audio file object for the current API (stored in the {@link CB_AudioFile#audioFileObject} property). This method has the same parameters as the {@link CB_AudioFile#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 *  @param {boolean} [forceOnStop=false] - Used internally as the "forceOnStop" parameter to call the "stop" method of the internal audio file object for the current API (stored in the {@link CB_AudioFile#audioFileObject} property). This method has the same parameters as the {@link CB_AudioFile#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 */
CB_AudioFile.prototype.destructor = function(stopSound, keepStoppedUnaltered, avoidOnStop, forceOnStop)
{
	this.audioFileObject.destructor(stopSound, keepStoppedUnaltered, avoidOnStop, forceOnStop);
	this.audioFileObject = CB_AudioFile._audioFileObject_prototype;
	this.audioFileObject.status = CB_AudioFile.ABORTED;
}


/**
 * Sets the desired audio API. This method will also be called automatically by the constructor. If the "autoLoad" parameter is set to true, it will call the {@link CB_AudioFile#load} method internally, changing the audio API on-the-fly, and the audio will try to continue playing if it was playing at the moment of calling this method. Check the {@link CB_AudioFile#load} method documentation for more information. If the "autoLoad" parameter is set to true, it is recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio. The audio API used will be stored in the {@link CB_AudioFile#audioAPI} property.
 *  @function
 *  @param {string} [audioAPI=CB_AudioDetector.getPreferredAPI(undefined, false, null) || CB_AudioDetector.getPreferredAPI(undefined, true, null)] - The desired audio API to be used. If not provided, it will try to calculate the best one for the current client by calling the {@link CB_AudioDetector.getPreferredAPI} function internally. Audio API support will depend on the current client being used. All possible ones are defined in {@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}. For example: "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). Used internally as the "audioAPI" parameter when calling the {@link CB_AudioFile#load} method internally (only when the "autoLoad" parameter is set to true).
 *  @param {string} [autoLoad=true] - If set to false, it will not call the {@link CB_AudioFile#load} method internally and will only set the {@link CB_AudioFile#audioAPI} property (not recommended).
 *  @param {string} [autoPlay=false] - Used internally as the "autoPlay" parameter when calling the {@link CB_AudioFile#load} method internally (only when the "autoLoad" parameter is set to true).
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been loaded successfully, being "this" the {@link CB_AudioFile} object itself. Used internally as the "callbackOk" parameter when calling the {@link CB_AudioFile#load} method internally (only when the "autoLoad" parameter is set to true).
 *  @param {function} [callbackError] - Function to be called if the audio has not been loaded successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile} object itself. Used internally as the "callbackError" parameter when calling the {@link CB_AudioFile#load} method internally (only when the "autoLoad" parameter is set to true).
 *  @param {string} [ignoreOldValues=false] - Used internally as the "ignoreOldValues" parameter when calling the {@link CB_AudioFile#load} method internally (only when the "autoLoad" parameter is set to true).
 *  @param {string} [filePath={@link CB_AudioFile#filePath}] - Used internally as the "filePath" parameter when calling the {@link CB_AudioFile#load} method internally (only when the "autoLoad" parameter is set to true).
 *  @param {string} [forceReload=false] - Used internally as the "forceReload" parameter when calling the {@link CB_AudioFile#load} method internally (only when the "autoLoad" parameter is set to true).
 *  @returns {string} Returns the desired audio API that has been tried to set, in upper case (successfully or not).
 *  @todo Think about using the "forceReload" just after the "callbackError" to match the parameter order of the "load" method of all the audio API objects.
 */
 CB_AudioFile.prototype.setAudioAPI = function(audioAPI, autoLoad, autoPlay, callbackOk, callbackError, ignoreOldValues, filePath, forceReload)
{
	if (typeof(audioAPI) === "undefined" || audioAPI === null) //Uses the preferred API as default.
	{
		audioAPI = CB_AudioDetector.getPreferredAPI(undefined, false, null) || CB_AudioDetector.getPreferredAPI(undefined, true, null);
	}
	
	audioAPI = CB_trim(audioAPI).toUpperCase();
	
	if (!CB_AudioDetector.APIExists(audioAPI))
	{
		if (typeof(callbackError) === "function") { callbackError.call(this, "Audio API given does not exist (" + audioAPI + ")."); }
		return audioAPI;
	}
	
	if (typeof(autoLoad) === "undefined" || autoLoad === null) { autoLoad = true; }
	
	//Since AJAX doesn't allow to load local files, if the file is local we can't use WAAPI:
	//if (CB_isFileLocal(this.filePath)) { if (audioAPI === "WAAPI") { audioAPI = "SM2"; } } //Uses SM2 instead.

	//If it is the same audio API as the current one, we don't need to do more:
	if (this.audioAPI === audioAPI) { if (typeof(callbackOk) === "function") { callbackOk.call(this); } return audioAPI; }
	
	//First time is undefined, so we accept any first value:
	if (typeof(this.audioAPI) === "undefined") { this.audioAPI = audioAPI; }
	
	//We (re)load the audio file if we want to (NOTE: audioAPI will change only if the object is created and loaded successfully):
	if (autoLoad)
	{
		this.load(filePath ? filePath : this.filePath, audioAPI, autoPlay, callbackOk, callbackError, ignoreOldValues, forceReload);
	}
	//...otherwise, we just change the audioAPI property:
	else { this.audioAPI = audioAPI; }
	
	return audioAPI;
}


/**
 * Loads the desired audio file with the desired options. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio. This method will be called automatically if the "autoLoad" option was set to true when calling the {@link CB_AudioFile#setAudioAPI} method. The audio API used will be stored in the {@link CB_AudioFile#audioAPI} property.
 * When this method is called, if the "status" property of the audio API object already has the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant) and the "forceReload" parameter is not set to true, it will exit calling the given "callbackOk" function (if any) immediately. Otherwise, regardless the status, the status will be set to "LOADING" (defined in the {@link CB_AudioFile.LOADING} constant). After it, it will reach the "UNCHECKED" (defined in the {@link CB_AudioFile.UNCHECKED} constant). If the "autoPlay" parameter is not set to true, this will be the final status (and it will be necessary to call the "checkPlaying" method of the audio API object after it). After it and only if the "autoPlay" is set to true, as the "checkPlaying" method of the audio API object will be called internally, it will have the "CHECKING" status (defined in the {@link CB_AudioFile.CHECKING} constant) and finally the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant) if all goes well.
 * Although it is not recommended to do so, if this method is called when the audio API object has the "UNCHECKED" status (defined in the {@link CB_AudioFile.UNCHECKED} constant), it will call the "checkPlaying" method of the audio API object internally.
 * Internally, it can use the {@link CB_AudioFile#audioFileObjects} property as a cache.
 *  @function
 *  @param {string} [filePath={@link CB_AudioFile#filePath}] - The path of the audio file or a data URI. NOTE: Only some clients with some audio APIs will support data URIs.
 *  @param {string} [audioAPI={@link CB_AudioFile#audioAPI}] - The desired audio API to be used. If not provided, it will try to use the previously-set one (in the {@link CB_AudioFile#audioAPI} property). All possible ones are defined in {@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}. For example: "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @param {string} [autoPlay=false] - If set to true, it will start playing the audio automatically (by calling the {@link CB_AudioFile#play} method internally) unless the "ignoreOldValues" parameter is set to false and the previous audio was playing or paused. If set to true and the "status" property of the audio API object reaches to the "UNCHECKED" status (defined in the {@link CB_AudioFile.UNCHECKED} constant), it will also call internally the "checkPlaying" method of the audio API object before anything. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been loaded successfully, being "this" the {@link CB_AudioFile} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been loaded successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile} object itself.
 *  @param {string} [ignoreOldValues=false] - If set to true, it will ignore the old values of the previous used audio API object. This means that it will neither continue playing if it was playing (changing the audio API on-the-fly) nor keep the paused status if it was paused nor copy its "loop" property to the new audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @param {string} [forceReload=false] - Used internally as the "forceReload" parameter when calling the "load" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @returns {CB_AudioFile_API.WAAPI|CB_AudioFile_API.SM2|CB_AudioFile_API.ACMP|CB_AudioFile_API.AAPI|null} Returns the used audio API object or null otherwise. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @todo Think about using the "forceReload" just after the "callbackError" to match the parameter order of the "load" method of all the audio API objects.
 */
CB_AudioFile.prototype.load = function(filePath, audioAPI, autoPlay, callbackOk, callbackError, ignoreOldValues, forceReload)
{
	//Defines the default parameters:
	if (typeof(audioAPI) === "undefined" || audioAPI === null)
	{
		audioAPI = this.audioAPI; //Uses the previously set Audio API as default.
		//if (typeof(audioAPI) === "undefined" || audioAPI === null) { audioAPI = CB_AudioDetector.getPreferredAPI(undefined, false, null) || CB_AudioDetector.getPreferredAPI(undefined, true, null); } //Uses the preferred API as default.
	} 
	
	audioAPI = CB_trim(audioAPI).toUpperCase();

	filePath = filePath || this.filePath;
	
	var that = this;

	var callbackErrorFunction =
		function(error)
		{
			that._loadingAudioFileObject = false; //The audio object is not being loaded anymore.
			
			that.audioFileObjectLast = that.audioFileObject;
			
			//If we are using the prototype (no real audio object adopted), and the audio API requested has been set or the audio API was never set (first time), status is failed:
			if (that.audioFileObject.usingPrototype && (audioAPI === that.audioAPI || that.audioAPI === null)) //This way, we avoid setting as FAILED if the audio API has not been changed.
			{
				that.audioFileObject.status = CB_AudioFile.FAILED;
			}
			
			//Calls the error function (if any):
			if (typeof(callbackError) === "function") { callbackError.call(that, error); }
		};
	
	//Creates the audio object depending on the API chosen:
	if (typeof(CB_AudioFile_API) !== "undefined" && typeof(CB_AudioFile_API[audioAPI]) !== "undefined")
	{
		this._loadingAudioFileObject = true; //The audio object is being loaded.
		var callbackOkFunction =
			function()
			{
				//If there is an object already:
				var wasPlaying = false;
				var wasPaused = false;
				
				//If we wanto to play automatically and the status of the new object is unchecked, checks the file and the function will be called when finishes:
				if (autoPlay && audioFileObject.status === CB_AudioFile.UNCHECKED && typeof(audioFileObject.checkPlaying) !== "undefined")
				{
					audioFileObject.checkPlaying(callbackOkFunction, callbackErrorFunction, false, false, false);
					return;
				}
				
				//If we do not want to ignore old values and the previous audio file object used was not a prototype (it was a real one):
				if (!ignoreOldValues && typeof(that.audioFileObject.usingPrototype) === "undefined")
				{
					//If the status of the new object is unchecked, checks the file and the function will be called when finishes:
					if (audioFileObject.status === CB_AudioFile.UNCHECKED && typeof(audioFileObject.checkPlaying) !== "undefined")
					{
						audioFileObject.checkPlaying(callbackOkFunction, callbackErrorFunction, false, false, false);
						return;
					}
					
					//var status = that.getStatus();
					var status = that.audioFileObject.status;
					
					//audioFileObject.status = LOADED;
					//If the audio was LOADED:
					if (status === CB_AudioFile.LOADED)
					{
						//Stores the startAt:
						audioFileObject.lastStartAt = that.audioFileObject.lastStartAt;
						
						//Stores the stopAt:
						audioFileObject.lastStopAt = that.audioFileObject.lastStopAt;
						
						//Stores loop:
						that.loop = audioFileObject.loop = that.audioFileObject.loop;
						
						//If the sound is playing, pauses it:
						if (that.isPlaying())
						{
							//Stops it:
							that.pause();
							wasPlaying = true;
						}
						else if (that.audioFileObject.paused)
						{
							wasPaused = true;
						}
						
						//Stores the pause time (if any):
						audioFileObject.pauseTime = that.audioFileObject.pauseTime;
						
						//If it was using WAAPI and not now, we need to substract the startTime:
						/*
						if (that.audioAPI === "WAAPI" && audioAPI !== "WAAPI" && typeof(that.audioFileObject.startTime) !== "undefined" && that.audioFileObject.startTime !== null && !isNaN(that.audioFileObject.startTime))
						{
							audioFileObject.pauseTime -= that.audioFileObject.startTime * 1000;
						}
						*/
					}
				}

				
				//If we changed the API (this means the object will have changed too):
				if (that.audioAPI !== audioAPI)
				{
					//Stops and destroys previous object (if any) and declares it as ABORTED:
					//////that.destructor(true, false, true); //Stops the object (avoiding to fire onStop) and destroys the object (sets status as ABORTED).
				}
				
				//Stores the volume:
				that.volume = audioFileObject.volume = that.getVolume();
				
				//Stores the new audio object:
				that.audioFileObject = audioFileObject;
				
				//If it was playing, continues playing from the same point:
				if (!ignoreOldValues && (wasPlaying || wasPaused))
				{
					that.audioFileObject.stopped = false;
					that.audioFileObject.paused = true;
					
					//that.resume(that.loop);
					//that.resume(that.loop, that._avoidDelayedPlayLast, that._allowedRecursiveDelayLast, that._onPlayStartLast, that._onLoadErrorLast);
					that.resume(that.loop, that._avoidDelayedPlayLast, that._allowedRecursiveDelayLast, null, that._onLoadErrorLast);
					
					if (wasPaused) { that.pause(); }
				}
				//...otherwise, if we wanted to play automatically, we start playing:
				else if (autoPlay)
				{
					that.play();
				}
				
				//Now the new API can be accepted:
				that.audioAPI = audioAPI;
			
				//Sets the file path:
				that.filePath = filePath;
			
				//Set the desired onStop event (if any):
				/////////that.onStop(that.onStopFunction, false);
				that.onStop(that._onStopFunction, false);
				
				that._loadingAudioFileObject = false; //The audio object has been loaded already.
				
				//Calls the OK function (if any):
				if (typeof(callbackOk) === "function") { callbackOk.call(that); }
			};
		
		//Creates a new CB_AudioFile[x] object or uses the existing one (if available):
		var audioFileObject;
		if (typeof(this.audioFileObjects[audioAPI]) !== "undefined" && this.audioFileObjects[audioAPI] !== null)
		{
			//Gets the existing object:
			audioFileObject = this.audioFileObjects[audioAPI];
			
			//Sets the desired options:
			////if (typeof(this.id) === "undefined" || this.id === null) { audioFileObject.id = filePath; } //Uses the file path as default id.
			if (typeof(this.id) === "undefined" || this.id === null) { audioFileObject.id = CB_trim("CB_AudioFile_" + CB_AudioFile._idUnique++).toUpperCase(); } //Uses the file path as default id.
			else { audioFileObject.id = this.id; }
			audioFileObject.loop = this.loop;
			//audioFileObject.setVolume(this.volume);
			//audioFileObject.setVolume(0); //Sets volume to zero to prevent hearing the sound in some web clients when checkPlaying is called.
			if (CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING) { audioFileObject.mute(); } //Sets volume to zero to prevent hearing the sound in some web clients when checkPlaying is called.
			
			//Calls the load method of the object (load method also calls the destructor method):
			audioFileObject.load(filePath, false, callbackOkFunction, callbackErrorFunction, forceReload);
		}
		else
		{
			//Creates the new object and stores it (sets volume to zero to prevent hearing the sound in some web clients when checkPlaying is called):
			//audioFileObject = new CB_AudioFile_API[audioAPI](filePath, this.id, { autoLoad: true, autoPlay: autoPlay, loop: this.loop, volume: this.volume }, callbackOkFunction, callbackErrorFunction);
			this.DEFAULT_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME;
			audioFileObject = new CB_AudioFile_API[audioAPI](filePath, this.id, { autoLoad: true, autoPlay: false, loop: this.loop, volume: CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING ? 0 : this.DEFAULT_VOLUME }, callbackOkFunction, callbackErrorFunction);
			this.audioFileObjects[audioAPI] = audioFileObject;
		}
		
		this.audioFileObjectLast = this.audioFileObjects[audioAPI];
		
		return audioFileObject;
	}
	else
	{
		callbackErrorFunction("CB_AudioFile_API['" + audioAPI + "'] not found");
		return null;
	}
}



/**
 * Checks whether the audio can be played or not. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio. Also recommended to use before calling the {@link CB_AudioFile#play} method the first time. Internally, uses the "checkPlaying" method of the used audio API object. The checking action will only be performed if the value of the "status" property of the used audio API object belongs to the {@link CB_AudioFile.UNCHECKED} or to the {@link CB_AudioFile.CHECKING} value. After checking, if the audio can be played, the "status" property of the used audio API object will get the value of {@link CB_AudioFile.LOADED}. Otherwise, if it cannot be played, the "status" property of the used audio API object will get the value of {CB_AudioFile.FAILED}. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been checked successfully, being "this" the {@link CB_AudioFile} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been checked successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile} object itself.
 *  @param {boolean} [ignoreStatus=false] - If set to false and the audio status is neither "UNCHECKED" nor "CHECKING", it will fail calling the "callbackError" function (if any). If set to true, it will try to perform the checking action regardless the status of the audio.
 *  @param {boolean} [ignoreQueue=false] - If set to false and there is already the maximum number of audio files being checked (defined internally, depending on the audio API), the function will exit and it will call itself automatically again and again until the checking process can be performed (when its queue turn has been reached). This is done for performance purposes. Some audio APIs will ignore this parameter as they do not use checking queues.
 *  @param {boolean} [useCache=false] - If set to true (not recommended) and the same audio file was checked previously, it will not perform the checking process again and it will do the same as the previous call. Some audio APIs will ignore this parameter as they do not use cache.
 *  @returns {boolean} Returns false if the checking could not be performed and failed. If it returns true, it can mean either the checking has been processed successfully or it will fail in the future, so it is recommended to ignore the returning value and use the callback functions instead.
 */
CB_AudioFile.prototype.checkPlaying = function(callbackOk, callbackError, ignoreStatus, ignoreQueue, useCache)
{
	var that = this;
	return this.audioFileObject.checkPlaying
	(
		function() { if (typeof(callbackOk) === "function") { callbackOk.call(that); } }, //callbackOk.
		function(error) { if (typeof(callbackError) === "function") { callbackError.call(that, error); } }, //callbackError.
		ignoreStatus,
		ignoreQueue,
		useCache
	);
}


/**
 * Tells the duration of the audio (in milliseconds). Note that some clients might not calculate the duration correctly and, in this case, a zero (0) value would be returned. Internally, uses the "getDuration" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @returns {number} Returns the duration of the audio (in milliseconds). Note that some clients might not calculate the duration correctly and, in this case, a zero (0) value would be returned.
 */
CB_AudioFile.prototype.getDuration = function()
{
	return this.audioFileObject.getDuration();
}


/**
 * Plays the audio. Internally, uses the "play" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {number} [startAt=0 | {@link CB_AudioFile_API.WAAPI#lastStartAt} | {@link CB_AudioFile_API.SM2#lastStartAt} | {@link CB_AudioFile_API.ACMP#lastStartAt} | {@link CB_AudioFile_API.AAPI#lastStartAt} | stopAt] - Time in milliseconds where we want the audio to start at. If not provided or it is not a valid number, it will use zero (0) as default which belongs to the beginning of the audio. If the value provided is greater than the "stopAt" provided, it will use the value set in the "lastStartAt" property of the used audio API object (which belongs to the "startAt" value the last time that the "play" method was called). If, even using the "lastStartAt" value is still greather than the "stopAt" provided, it will use the same value as the "stopAt" which means it will not play and will stop immediately. Used internally as the "startAt" parameter to call the "play" method of the audio API object.
 *  @param {number} [stopAt={@link CB_AudioFile_API.WAAPI#getDuration}() | {@link CB_AudioFile_API.SM2#getDuration}() | {@link CB_AudioFile_API.ACMP#getDuration}() | {@link CB_AudioFile_API.AAPI#getDuration}()] - Time in milliseconds where we want the audio to stop at. If not provided or it is not a valid number, it will use the returning value of the "getDuration" method of the used audio API object (which should belong to the total duration of the audio, if it was calculated correctly). Used internally as the "stopAt" parameter to call the "play" method of the audio API object.
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Note that at the end of each loop the "onStop" function defined (through the {@link CB_AudioFile#onStop} method) will not be called. Used internally as the "loop" parameter to call the "play" method of the audio API object.
 *  @param {boolean} [avoidDelayedPlay=false] - If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay). Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the "stop" method of the used audio API object will be called immediately. Used internally as the "avoidDelayedPlay" parameter to call the "play" method of the audio API object.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all and the "stop" method of the used audio API object will be called immediately. Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed). Used internally as the "allowedRecursiveDelay" parameter to call the "play" method of the audio API object.
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile} object. If the audio is looping, this will be called only once when the audio starts playing the first time and it will not be called next loops. Used internally as the "onPlayStart" parameter to call the "play" method of the audio API object.
 *  @param {function} [onLoadError] - Function to be called if the audio cannot be played successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile} object. Used internally as the "onLoadError" parameter to call the "play" method of the audio API object.
 *  @param {boolean} [isResume=false] - If set to true (not recommended) and it is a looping audio, the next loop will use the value of the "lastStartAt" property of the audio API object as the "startAt" parameter when it calls the "play" method again automatically (internally). Recommended for internal usage only. Used internally as the "isResume" parameter to call the "play" method of the audio API object.
 *  @returns {boolean|integer} Returns the returning value of the "play" method of the audio API object. It returns false if the duration is 0 ("startAt" and "stopAt" are the same number), returns "-1" if the audio cannot be played and an error is detected or returns true otherwise. Note that even when it returns true there can be a non-detectable error and maybe the audio is not played. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 */
CB_AudioFile.prototype.play = function(startAt, stopAt, loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, isResume)
{
	if (typeof(loop) === "undefined" || loop === null) { loop = this.loop; } //If not set, uses the default (or last one used).
	else { this.loop = loop; } //...otherwise, stores the new setting given.
	
	//Backups the parameters given:
	this._avoidDelayedPlayLast = avoidDelayedPlay;
	this._allowedRecursiveDelayLast = allowedRecursiveDelay;
	//this._onPlayStartLast = onPlayStart;
	this._onLoadErrorLast = onLoadError;
	
	var that = this;
	
	//Plays the sound:
	return this.audioFileObject.play
	(
		startAt,
		stopAt,
		loop,
		avoidDelayedPlay,
		allowedRecursiveDelay,
		function(startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime)
		{
			if (typeof(onPlayStart) === "function") { onPlayStart.call(that, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime); }
		},
		function (error) { if (typeof(onPlayStart) === "function") { onLoadError.call(that, error); } },
		isResume,
		false
	);
}


/**
 * Resumes the audio (after being paused), starting from the same point it was paused previously. Internally, uses the "resume" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Note that at the end of each loop the "onStop" function defined (through the {@link CB_AudioFile#onStop} method) will not be called. Used internally as the "loop" parameter to call the "resume" method of the audio API object.
 *  @param {boolean} [avoidDelayedPlay=false] - If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay). Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the "stop" method of the used audio API object will be called immediately. Used internally as the "avoidDelayedPlay" parameter to call the "resume" method of the audio API object.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all and the "stop" method of the used audio API object will be called immediately. Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed). Used internally as the "allowedRecursiveDelay" parameter to call the "resume" method of the audio API object.
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile} object. If the audio is looping, this will be called only once when the audio starts playing the first time and it will not be called next loops. Used internally as the "onPlayStart" parameter to call the "resume" method of the audio API object.
 *  @param {function} [onLoadError] - Function to be called if the audio cannot be played successfully. It will not be called if the audio is not paused or is stopped. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile} object. Used internally as the "onLoadError" parameter to call the "resume" method of the audio API object.
 *  @returns {boolean|integer} Returns the returning value of the "resume" method of the audio API object. It returns false if the audio is not paused or it is stopped, returns "-1" if the audio cannot be played and an error is detected or returns true otherwise. Note that even when it returns true there can be a non-detectable error and maybe the audio is not played. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 */
//CB_AudioFile.prototype.resume = function(stopAt, loop, /*startAtNextLoop,*/ allowOverlapping)
CB_AudioFile.prototype.resume = function(loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError)
{
	/////////if (typeof(loop) === "undefined" || loop === null) { loop = this.DEFAULT_OPTIONS.loop; }
	if (typeof(loop) === "undefined" || loop === null) { loop = this.loop; } //If not set, uses the default (or last one used).
	this.loop = loop;

	//return this.audioFileObject.resume(stopAt, loop, /*startAtNextLoop,*/ allowOverlapping);
	
	//Backups the parameters given:
	this._avoidDelayedPlayLast = avoidDelayedPlay;
	this._allowedRecursiveDelayLast = allowedRecursiveDelay;
	//this._onPlayStartLast = onPlayStart;
	this._onLoadErrorLast = onLoadError;
	
	var that = this;
	
	//Resumes the sound:
	return this.audioFileObject.resume
	(
		loop,
		avoidDelayedPlay,
		allowedRecursiveDelay,
		//////function() { if (typeof(onPlayStart) === "function") { onPlayStart.call(that); } },
		function(startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime)
		{
			if (typeof(onPlayStart) === "function") { onPlayStart.call(that, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime); }
		},
		function (error) { if (typeof(onPlayStart) === "function") { onLoadError.call(that, error); } }
	);
}


/**
 * Pauses the audio when it is being played. Internally, uses the "pause" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {function} [onPause] - Function without parameters to be called when the audio is paused successfully, being "this" the {@link CB_AudioFile} object. Used internally as the "onPause" parameter (with a wrapper function) to call the "pause" method of the audio API object.
 *  @param {boolean} [keepPausedUnaltered=false] - If set to true (not recommended), the "paused" property of the audio API object will not be set to true and it will remain with its current value. Used internally as the "keepPausedUnaltered" parameter to call the "pause" method of the audio API object.
 *  @returns {boolean} Returns the returning value of the "pause" method of the audio API object. It returns false if the audio is already paused or it is stopped or if it cannot be paused. Returns true otherwise. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 */
CB_AudioFile.prototype.pause = function(onPause, keepPausedUnaltered)
{
	var that = this;
	return this.audioFileObject.pause(function() { if (typeof(onPause) === "function") { onPause.call(that); } }, keepPausedUnaltered);
}


/**
 * Stops the audio. Internally, uses the "stop" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {boolean} [keepStoppedUnaltered=false] - If set to true (not recommended), the "stopped" property of the audio API object will not be set to true and it will remain with its current value. Used internally as the "keepStoppedUnaltered" parameter to call the "stop" method of the audio API object.
 *  @param {boolean} [avoidOnStop=false] - If set to false and there is an "onStop" function defined (through the {@link CB_AudioFile#onStop} method), it will be called after stopping the audio (or after trying to do it, at least) but only if either the "forceOnStop" parameter is set to true or if the "keepStoppedUnaltered" parameter is set to false and the audio was not already stopped before. If set to true, the "onStop" function (if any) will not be called at all. Used internally as the "avoidOnStop" parameter to call the "stop" method of the audio API object.
 *  @param {boolean} [forceOnStop=false] - If it is set to true and the "avoidOnStop" parameter is set to false and there is an "onStop" function defined (through the {@link CB_AudioFile#onStop} method), it will be called regardless the audio was stopped before or not. If set to false, the "onStop" function (if any) will only be called if the "keepStoppedUnaltered" parameter is set to false and the audio was not already stopped before. This parameter will be ignored if the "avoidOnStop" parameter is set to true. Used internally as the "forceOnStop" parameter to call the "stop" method of the audio API object.
 *  @returns {boolean} Returns the returning value of the "stop" method of the audio API object. It returns false if the stopping action cannot be performed at all (this could happen with the internal audio API has not been loaded properly, for example). Returns true otherwise (this only means that it has been tried to be stopped but it could not be successfully). Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 */
CB_AudioFile.prototype.stop = function(keepStoppedUnaltered, avoidOnStop, forceOnStop)
{
	return this.audioFileObject.stop(keepStoppedUnaltered, avoidOnStop, forceOnStop);
}


/**
 * Returns the volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise) that was set before the audio was muted. Internally, uses the "volumeBeforeMute" property of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @returns {number} Returns the volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise) that was set before the audio was muted. If the audio was not muted before, it will contain the default volume used in the "volume" property of the used audio API object.
 */
CB_AudioFile.prototype.getVolumeBeforeMute = function()
{
	return this.audioFileObject.volumeBeforeMute;
}


/**
 * Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise). Internally, uses the "volume" property of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 */
CB_AudioFile.prototype.getVolume = function()
{
	this.volume = this.audioFileObject.volume;
	return this.volume;
}


/**
 * Sets the desired volume for the audio file (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise). Internally, uses the "setVolume" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {number} [volume={@link CB_Speaker.getVolume()} | {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME}] - Desired volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise). Used internally as the "volume" parameter to call the "setVolume" method of the audio API object.
 *  @param {boolean} [forceSetVolumeProperty=false] - If set to true (not recommended), it will change the "volume" property of the used audio API object even when the volume failed to be changed. Used internally as the "forceSetVolumeProperty" parameter to call the "setVolume" method of the audio API object.
 *  @param {function} [onSetVolume] - Callback function which will be called if it has been possible to set the volume (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile} object. Used internally as the "onSetVolume" parameter (with a wrapper function) to call the "setVolume" method of the audio API object.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 */
CB_AudioFile.prototype.setVolume = function(volume, forceSetVolumeProperty, onSetVolume)
{
	var that = this;
	this.volume = this.audioFileObject.setVolume(volume, forceSetVolumeProperty, function() { if (typeof(onSetVolume) === "function") { onSetVolume.call(that); } }, false);
	return this.volume;
}


/**
 * Mutes the audio file. Internally, uses the "mute" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {function} [onMute] - Callback function which will be called if it has been possible to mute the audio file (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile} object. Used internally as the "onMute" parameter (with a wrapper function) to call the "mute" method of the audio API object.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise). If all goes well, the returning value should be zero (0). Note that, even when it returns a zero (0) value, this does not always mean that the mute has been applied successfully.
 */
CB_AudioFile.prototype.mute = function(onMute)
{
	var that = this;
	this.volume = this.audioFileObject.mute(function() { if (typeof(onMute) === "function") { onMute.call(that); } });
	return this.volume;
}


/**
 * Restores audio after muting it (unmutes it). Internally, uses the "unmute" method of the used audio API object which uses its own "volumeBeforeMute" property. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {function} [onUnmute] - Callback function which will be called if it has been possible to unmute the audio file (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile} object. Used internally as the "onUnmute" parameter (with a wrapper function) to call the "unmute" method of the audio API object.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 */
CB_AudioFile.prototype.unmute = function(onUnmute)
{
	var that = this;
	this.volume = this.audioFileObject.unmute(function() { if (typeof(onUnmute) === "function") { onUnmute.call(that); } });
	return this.volume;
}


/**
 * Gets the current time (in milliseconds) which belongs to the position where the audio is currently playing or where it has been paused. Note that some audio APIs and clients could give wrong values. Internally, uses the "getCurrentTime" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @returns {number} Returns the current time (in milliseconds). Note that some audio APIs and clients could give wrong values.
 */
CB_AudioFile.prototype.getCurrentTime = function()
{
	return this.audioFileObject.getCurrentTime();
}


/**
 * Gets the current status of the audio file.
 *  @function
 *  @param {boolean} [realStatus=false] - If set to true, it will return the "status" property of the used audio API object instead of the "status" property of the current CB_AudioFile object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @returns {number} Returns the current status of the audio file. It is a number, which should match the value of the CB_AudioFile.UNLOADED (still unloaded), CB_AudioFile.LOADING (loading), CB_AudioFile.UNCHECKED (not checked by calling the "checkPlaying" method yet), CB_AudioFile.CHECKING (being checked by the "checkPlaying" method), CB_AudioFile.LOADED (loaded), CB_AudioFile.FAILED (failed loading or failed to play or by any other reason) or CB_AudioFile.ABORTED (aborted because it was destroyed with the "destructor" method) property.
 */
CB_AudioFile.prototype.getStatus = function(realStatus)
{
	if (this._loadingAudioFileObject && !realStatus) { return CB_AudioFile.LOADING; }
	return this.audioFileObject.status;
}


/**
 * Gets the current status of the audio file, as a string.
 *  @function
 *  @param {boolean} [realStatus=false] - If set to true, it will have in mind the "status" property of the used audio API object instead of the "status" property of the current CB_AudioFile object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @returns {string} Returns the current status of the audio file, as a string. Possible return values are "UNLOADED", "LOADING", "UNCHECKED", "CHECKING", "LOADED", "FAILED", "ABORTED" or "UNKNOWN (UNKNOWN_STATUS)" (where "UNKNOWN_STATUS" will be a value from the "status" property not recognized as any possible status).
 */
CB_AudioFile.prototype.getStatusString = function(realStatus)
{
	var status = this.getStatus(realStatus);
	var statuses = [ "UNLOADED", "LOADING", "UNCHECKED", "CHECKING", "LOADED", "FAILED", "ABORTED" ];
	if (typeof(statuses[status]) !== "undefined") { return statuses[status]; }
	else { return "UNKNOWN (" + status + ")"; }
}


/**
 * Tells whether the audio file is playing or not. Internally, uses the {@link CB_AudioFile#isStopped} and {@link CB_AudioFile#isPaused} methods.
 *  @function
 *  @returns {boolean} Returns whether the audio file is playing or not.
 */
CB_AudioFile.prototype.isPlaying = function()
{
	return (!this.isStopped() && !this.isPaused());
}


/**
 * Tells whether the audio is paused or not. Internally, uses the "paused" property of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @returns {boolean} Returns whether the audio is paused or not.
 */
CB_AudioFile.prototype.isPaused = function()
{
	return this.audioFileObject.paused;
}


/**
 * Tells whether the audio file is stopped or not. Internally, uses the "stopped" property of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @returns {boolean} Returns whether the audio file is stopped or not.
 */
CB_AudioFile.prototype.isStopped = function()
{
	return this.audioFileObject.stopped;
}


/*
//Returns the bytes loaded of the file:
CB_AudioFile.prototype.getBytesLoaded = function()
{
	return this.audioFileObject.getBytesLoaded();
}


//Returns the total bytes of the file:
CB_AudioFile.prototype.getBytesTotal = function()
{
	return this.audioFileObject.getBytesTotal();
}
*/

/**
 * Sets a function to execute when the audio file stops playing or removes it. Internally, uses the "onStop" method of the used audio API object (wrapping the given function).
 *  @function
 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. No parameters will be received, being "this" the {@link CB_AudioFile} object. If a null value is used, the event will be removed.
 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
 *  @returns {boolean} Returns whether the event has been set or not (removed).
 */
CB_AudioFile.prototype.onStop = function(callbackFunction, keepOldFunction)
{
	//If not set, it keeps old function by default:
	if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; }

	if (typeof(callbackFunction) !== "function") { this._onStopFunction = null; return false; }
	
	var that = this;
	
	//If we don't want to keep the old function:
	if (!keepOldFunction)
	{
		this._onStopFunction = callbackFunction;
	}
	//...otherwise if we want to keep the old function, we keep it:
	else
	{
		//Stores old function:
		var oldFunction = this._onStopFunction; //Stores old function of eventFunctionHolder.
		this._onStopFunction =
			function()
			{
			   if (typeof(oldFunction) === "function") { oldFunction.call(that); }
			   callbackFunction.call(that);
			};
	}
	
	////return this.audioFileObject.onStop(callbackFunction, false); //We have already kept the function (if desired).
	return this.audioFileObject.onStop(function() { if (typeof(that._onStopFunction) === "function") { that._onStopFunction.call(that); } }, false); //We have already kept the function (if desired).
}


/**
 * Tells the last "startAt" parameter value used by the {@link CB_AudioFile#play} or the {@link CB_AudioFile#resume} method (or used by the equivalents methods of the same name from the used audio API object). Internally, uses the "lastStartAt" property of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {boolean} [numeric=false] - If set to true, it will sanitize the returning value by returning zero instead of undefined, null or any other non-numeric value.
 *  @returns {number|*} Returns the last "startAt" value used by the {@link CB_AudioFile#play} or the {@link CB_AudioFile#resume} method (or used by the equivalents methods of the same name from the used audio API object). If we want it to be numeric always, the "numeric" parameter should be set to true.
 */
CB_AudioFile.prototype.getStartAt = function(numeric)
{
	var value = undefined;
	if (typeof(this.audioFileObject.lastStartAt) !== "undefined") { value = this.audioFileObject.lastStartAt; }
	if (numeric && (typeof(value) === "undefined" || value === null || isNaN(value))) { value = 0; }
	return value;
}


/**
 * Tells the last "stopAt" parameter value used by the {@link CB_AudioFile#play} or the {@link CB_AudioFile#resume} method (or used by the equivalents methods of the same name from the used audio API object). Internally, uses the "lastStopAt" property of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @param {boolean} [numeric=false] - If set to true, it will sanitize the returning value by returning zero instead of undefined, null or any other non-numeric value.
 *  @returns {number|*} Returns the last "stopAt" value used by the {@link CB_AudioFile#play} or the {@link CB_AudioFile#resume} method (or used by the equivalents methods of the same name from the used audio API object). If we want it to be numeric always, the "numeric" parameter should be set to true.
 */
CB_AudioFile.prototype.getStopAt = function(numeric)
{
	var value = undefined;
	if (typeof(this.audioFileObject.lastStopAt) !== "undefined") { value = this.audioFileObject.lastStopAt; }
	if (numeric && (typeof(value) === "undefined" || value === null || isNaN(value))) { value = 0; }
	return value;
}


/**
 * Returns a number representing the percentage of the loading progress for the audio file (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable. Internally, uses the "getProgress" method of the used audio API object. Possible internal audio API objects are {@link CB_AudioFile_API.WAAPI} object for "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), {@link CB_AudioFile_API.SM2} object for "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), {@link CB_AudioFile_API.ACMP} object for "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or {@link CB_AudioFile_API.AAPI} object for "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @function
 *  @returns {number} Returns a number representing the percentage of the loading progress for the audio file (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable.
 */
CB_AudioFile.prototype.getProgress = function()
{
	return this.audioFileObjectLast.getProgress();
}