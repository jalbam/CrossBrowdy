/**
 * @file Audio files management using "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}). Contains the {@link CB_AudioFile_API.SM2} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */


//We need a limit to prevent Firefox error ("Media resource [URI] could not be decoded") since many calls to play() method would fail:
if (typeof(CB_AudioFile_API_AAPI_SM2_beingLoading) === "undefined") { var CB_AudioFile_API_AAPI_SM2_beingLoading = 0; } //Counts how many objects are loading.
if (typeof(CB_AudioFile_API_AAPI_SM2_maximumLoading) === "undefined") { var CB_AudioFile_API_AAPI_SM2_maximumLoading = 5; } //Maximum of objects that can be loading at the same time.
if (typeof(CB_AudioFile_API_AAPI_SM2_beingChecking) === "undefined") { var CB_AudioFile_API_AAPI_SM2_beingChecking = 0; } //Counts how many objects are loading.
if (typeof(CB_AudioFile_API_AAPI_SM2_maximumChecking) === "undefined") { var CB_AudioFile_API_AAPI_SM2_maximumChecking = CB_AudioFile_API_AAPI_SM2_maximumLoading; } //Maximum of objects that can be loading at the same time.


//Class to manage an audio file with SM2 (SoundManager 2):
if (typeof(CB_AudioFile_API) === "undefined") { var CB_AudioFile_API = {}; }
/**
 *  The constructor is recommended to be called through a user-driven event (as onClick, onTouch, etc.) if the "autoPlay" option is set to true, as some web clients may need this at least the first time in order to be able to play the audio.
 *  @class CB_AudioFile_API.SM2
 *  @memberof! <global>
 *  @classdesc Class to manage an audio file using "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}). Used by the {@link CB_AudioFile} class internally and it shares most of its properties and methods. Recommended for internal usage only.
 *  @param {string} filePath - The path of the audio file or a data URI. NOTE: Only some clients with some audio APIs will support data URIs.
 *  @param {string} [audioId='CB_AUDIOFILE_SM2_' + CB_AudioFile_API.SM2._idUnique++] - Desired identifier for the audio object. If not provided, an automatic unique ID will be calculated. Note that it is not case sensitive and it should be unique for each object.
 *  @param {CB_AudioFile_API.SM2.OPTIONS} [options=CB_AudioFile_API.SM2#DEFAULT_OPTIONS] - Object with the desired options.
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been loaded successfully, being "this" the {@link CB_AudioFile_API.SM2} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been loaded successfully. The first and unique parameter will be a string describing the error found (if could be determined), being "this" the {@link CB_AudioFile_API.SM2} object itself.
 *  @returns {CB_AudioFile_API.SM2} Returns a new {@link CB_AudioFile_API.SM2} object.
 *  @todo Do not allow to create one object with an "id" which has already been used (unless the value is undefined, null...). Note that the "id" is not case sensitive and it should be unique for each object.
 *  @todo Method getCopy and static method filterProperties (similar to the ones from {@link CB_GraphicSprites} and {@link CB_GraphicSpritesScene}).
 */
CB_AudioFile_API["SM2"] = function(filePath, audioId, options, callbackOk, callbackError)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_AudioFile_API["SM2"])) { return new CB_AudioFile_API["SM2"](filePath, audioId, options, callbackOk, callbackError); }
	
	//Constants:
	/**
	 * Keeps the default volume. If the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT} property is true, this will keep the result of calling the {@link CB_Speaker.getVolume} function. Otherwise, it will use the value of the {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME} variable.
	 *	@constant CB_AudioFile_API.SM2#DEFAULT_VOLUME
	 *  @type {number}
	 *  @default CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME
	 */
	CB_AudioFile_API["SM2"].prototype.DEFAULT_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME;

	/**
	 * Keeps the default options when an object is created. Format: { autoLoad: boolean, autoPlay: boolean, loop: boolean, volume: number }.
	 *	@constant CB_AudioFile_API.SM2#DEFAULT_OPTIONS
	 *  @type {CB_AudioFile_API.SM2.OPTIONS}
	 *  @default { autoLoad: true, autoPlay: false, loop: false, volume: [CB_AudioFile_API.SM2.prototype.DEFAULT_VOLUME]{@link CB_AudioFile_API.SM2#DEFAULT_VOLUME} }
	 */
	CB_AudioFile_API["SM2"].prototype.DEFAULT_OPTIONS = { autoLoad: true, autoPlay: false, loop: false, volume: CB_AudioFile_API["SM2"].prototype.DEFAULT_VOLUME };

	//Properties and variables:
	/**
	 * Tells whether the file is unloaded ({@link CB_AudioFile.UNLOADED}), loading ({@link CB_AudioFile.LOADING}), unchecked ({@link CB_AudioFile.UNCHECKED}), checking ({@link CB_AudioFile.CHECKING}), loaded ({@link CB_AudioFile.LOADED}), failed ({@link CB_AudioFile.FAILED}) or aborted ({@link CB_AudioFile.ABORTED}).
	 *	@var CB_AudioFile_API.SM2#status
	 *  @readonly
	 *  @type {integer}
	 *  @default {@link CB_AudioFile.UNLOADED}
	 */
	this.status = CB_AudioFile.UNLOADED;

	/**
	 * Defines whether the file loops by default when the audio is played or not. Its value will be modified automatically whenever the {@link CB_AudioFile_API.SM2#play} method is called, getting the value from the "loop" parameter (but only if contains a boolean).
	 *	@var CB_AudioFile_API.SM2#loop
	 *  @readonly
	 *  @type {boolean}
	 *  @default [CB_AudioFile_API.SM2.prototype.DEFAULT_OPTIONS]{@link CB_AudioFile_API.SM2#DEFAULT_OPTIONS}.loop
	 */
	this.loop = CB_AudioFile_API["SM2"].prototype.DEFAULT_OPTIONS.loop;

	/**
     * Stores the volume of this audio. Accepted values go from 0 to MAX_VOLUME, where MAX_VOLUME is 100 if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is false or otherwise MAX_VOLUME is the returning value of the {@link CB_Speaker.getVolume} function.
	 *	@var CB_AudioFile_API.SM2#volume
	 *  @readonly
	 *  @type {number}
	 *  @default [CB_AudioFile_API.SM2.prototype.DEFAULT_OPTIONS]{@link CB_AudioFile_API.SM2#DEFAULT_OPTIONS}.volume
	 */
	this.volume = CB_AudioFile_API["SM2"].prototype.DEFAULT_OPTIONS.volume;

	/**
     * Stores the volume of this audio before it was muted (to restore it later). Valid values go from 0 to MAX_VOLUME, where MAX_VOLUME is 100 if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is false or otherwise MAX_VOLUME is the returning value of the {@link CB_Speaker.getVolume} function.
	 *	@var CB_AudioFile_API.SM2#volumeBeforeMute
	 *  @readonly
	 *  @type {number}
	 *  @default {@link CB_AudioFile_API.SM2#volume}
	 */
	this.volumeBeforeMute = this.volume;

	/**
     * Stores the identifier for the audio file.
	 *	@var CB_AudioFile_API.SM2#id
	 *  @readonly
	 *  @type {string}
	 *  @default 'CB_AUDIOFILE_SM2_' + CB_AudioFile_API.SM2._idUnique++
	 */
	this.id = "";

	/**
     * Stores the path of the audio file or the data URI. NOTE: Only some clients with some audio APIs will support data URIs.
	 *	@var CB_AudioFile_API.SM2#filePath
	 *  @readonly
	 *  @type {string}
	 *  @default
	 */
	this.filePath = "";

	/**
     * Tells whether the audio is paused or not.
	 *	@var CB_AudioFile_API.SM2#paused
	 *  @readonly
	 *  @type {boolean}
	 *  @default false
	 */
	this.paused = false;

	/**
     * Stores the time (in milliseconds) when the audio has been paused.
	 *	@var CB_AudioFile_API.SM2#pauseTime
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	this.pauseTime = 0;

	/**
     * Tells whether the audio is stopped or not.
	 *	@var CB_AudioFile_API.SM2#stopped
	 *  @readonly
	 *  @type {boolean}
	 *  @default true
	 */
	this.stopped = true;

	/**
     * Function to call when the audio stops.
	 *	@var CB_AudioFile_API.SM2#onStopFunction
	 *  @readonly
	 *  @type {function}
	 *  @default
	 */
	this.onStopFunction = null;

	/**
     * Stores the last "startAt" parameter value used by the {@link CB_AudioFile_API.SM2#play} or the {@link CB_AudioFile_API.SM2#resume} method.
	 *	@var CB_AudioFile_API.SM2#lastStartAt
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	this.lastStartAt = null;

	/**
     * Stores the last "stopAt" parameter value used by the {@link CB_AudioFile_API.SM2#play} or the {@link CB_AudioFile_API.SM2#resume} method.
	 *	@var CB_AudioFile_API.SM2#lastStopAt
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	this.lastStopAt = null;
	
	/**
     * Stores the "SMSound" object (returned by the [createSound]{@link http://schillmania.com/projects/soundmanager2/doc/#soundmanager-createsound} method) of the audio, used by the "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}).
	 *	@var CB_AudioFile_API.SM2#soundObject
	 *  @readonly
	 *  @type {Object}
	 *  @default
	 */
	this.soundObject = null;

	
	//Internal properties:
	this._timeoutWhenStop = null; //Keeps the timeout that is executed when the audio has finished playing (to either stop or loop).
	this._id_internal = null; //Internal id.
	//this._resuming = false;
	this._recursiveCallTimeout = null;
	this._onReadyTimeout = null;
	this._onErrorFunctionTimeout = null;
	this._stopAfterPlayingTimeout = null;
	this._onLoadTimeout = null;
	this._loadingCounterIncreased = false;

	this._checkPlayingTimeout = null;
	this._checkPlayingFinishingTimeout = null;
	this._recursiveCallCheckingTimeout = null;
	this._checkingCounterIncreased = false;

	this._lastDuration = null;
	this._onPlayingErrorFunctionTimeout = null;
	this._onPlayingErrorFunctionExecuting = false;
	this._startPlayingTimeReal = 0;
	
	
	//Calls the constructor of the object when creates an instance:
	return this._init(filePath, audioId, options, callbackOk, callbackError);
}


/**
 * Object with the options for an audio file. The format is the following one: { autoLoad: boolean, autoPlay: boolean, loop: boolean, volume: number }.
 *  @memberof CB_AudioFile_API.SM2
 *  @typedef {Object} CB_AudioFile_API.SM2.OPTIONS
 *  @property {boolean} [autoLoad={@link CB_AudioFile_API.SM2#DEFAULT_OPTIONS}.autoLoad] - If set to false, it will not call the {@link CB_AudioFile_API.SM2#load} method internally when the constructor is called (not recommended).
 *  @property {boolean} [autoPlay={@link CB_AudioFile_API.SM2#DEFAULT_OPTIONS}.autoPlay] - Value which will be used as the "autoPlay" parameter when calling the {@link CB_AudioFile_API.SM2#load} method internally, only when the "autoLoad" is set to true (when the constructor is called).
 *  @property {boolean} [loop={@link CB_AudioFile_API.SM2#DEFAULT_OPTIONS}.loop] - Value that will be used for the {@link CB_AudioFile_API.SM2#loop} property.
 *  @property {number} [volume={@link CB_AudioFile_API.SM2#DEFAULT_OPTIONS}.volume] - The desired volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise) that will be used for the {@link CB_AudioFile_API.SM2#volume} property.
 */


//Static properties:
CB_AudioFile_API["SM2"]._counter = 0; //Internal counter.
CB_AudioFile_API["SM2"]._idUnique = 0; //Counter to make the id unique (otherwise SM2 will never create an object with the same id after destroying it).


//Constructor:
CB_AudioFile_API["SM2"].prototype._init = function(filePath, audioId, options, callbackOk, callbackError)
{	
	//If not given, defines the default parameters:
	if (typeof(audioId) === "undefined" || audioId === null) { audioId = "CB_AUDIOFILE_SM2_" + CB_AudioFile_API["SM2"]._idUnique++; } //Uses the file path as default id.
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

	//Sets the internal id:
	if (typeof(this._id_internal) === "undefined" || this._id_internal === null) { this._id_internal = CB_AudioFile_API["SM2"]._counter++; }
	
	//Sets the file path:
	this.filePath = filePath;
	
	//Proceeds according to the options sent:
	this.loop = options.loop;
	this.volume = options.volume;
	this.volumeBeforeMute = this.volume;
	if (options.autoLoad)
	{
		var that = this;
		setTimeout
		(
			function()
			{
				that.load(that.filePath, options.autoPlay, callbackOk, callbackError);
			},
			10
		);
	}
	
	//Returns the object:
	return this;
}


/**
 * Destroys the audio file object and frees memory. Sets its current {@link CB_AudioFile_API.SM2#status} property to ABORTED ({@link CB_AudioFile.ABORTED} value).
 *  @function CB_AudioFile_API.SM2#destructor
 *  @param {boolean} [stopSound=false] - If set to true, it will also call the {@link CB_AudioFile_API.SM2#stop} method.
 *  @param {boolean} [keepStoppedUnaltered=false] - Used internally as the "keepStoppedUnaltered" parameter to call the {@link CB_AudioFile_API.SM2#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 *  @param {boolean} [avoidOnStop=false] - Used internally as the "avoidOnStop" parameter to call the {@link CB_AudioFile_API.SM2#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 *  @param {boolean} [forceOnStop=false] - Used internally as the "forceOnStop" parameter to call the {@link CB_AudioFile_API.SM2#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 */
CB_AudioFile_API["SM2"].prototype.destructor = function(stopSound, keepStoppedUnaltered, avoidOnStop, forceOnStop)
{
	this._lastDuration = null;
	if (typeof(this.soundObject) === "undefined" || this.soundObject === null) { this.status = CB_AudioFile.ABORTED; return; }
	if (stopSound) { this.stop(keepStoppedUnaltered, avoidOnStop, forceOnStop); }
	
	if (typeof(this.soundObject.destruct) !== "undefined" && this.soundObject.destruct !== null)
	{ 
		this.soundObject.destruct();
	}
	
	CB_Elements.remove(this.soundObject);
	
	//if (this.status === CB_AudioFile.LOADING)
	if (this._loadingCounterIncreased)
	{
		this._loadingCounterIncreased = false;
		CB_AudioFile_API_AAPI_SM2_beingLoading--; //Decreases the counter of the objects which are loading.
		if (CB_AudioFile_API_AAPI_SM2_beingLoading < 0) { CB_AudioFile_API_AAPI_SM2_beingLoading = 0; }
	}
	
	if (this._checkingCounterIncreased)
	{
		this._checkingCounterIncreased = false;
		CB_AudioFile_API_AAPI_SM2_beingChecking--; //Decreases the counter of the objects which are checking.
		if (CB_AudioFile_API_AAPI_SM2_beingChecking < 0) { CB_AudioFile_API_AAPI_SM2_beingChecking = 0; }
	}
	
	this.status = CB_AudioFile.ABORTED;
}


/**
 * Loads the desired audio file with the desired options. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some web clients may need this at least the first time in order to be able to play the audio. This method will be called automatically by the constructor if the "autoLoad" option was set to true in its given "options" parameter.
 * When this method is called, if the {@link CB_AudioFile_API.SM2#status} property already has the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant) and the "forceReload" parameter is not set to true, it will exit calling the given "callbackOk" function (if any) immediately. Otherwise, regardless the status, the status will be set to "LOADING" (defined in the {@link CB_AudioFile.LOADING} constant). After it, it will reach the "UNCHECKED" (defined in the {@link CB_AudioFile.UNCHECKED} constant). If the "autoPlay" parameter is not set to true, this will be the final status (and it will be necessary to call the {@link CB_AudioFile_API.SM2#checkPlaying} method after it). After it and only if the "autoPlay" is set to true, as the {@link CB_AudioFile_API.SM2#checkPlaying} method will be called internally, it will have the "CHECKING" status (defined in the {@link CB_AudioFile.CHECKING} constant) and finally the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant) if all goes well.
 *  @function CB_AudioFile_API.SM2#load
 *  @param {string} [filePath={@link CB_AudioFile_API.SM2#filePath}] - The path of the audio file or a data URI. NOTE: Only some clients with some audio APIs will support data URIs.
 *  @param {string} [autoPlay=false] - If set to true, it will start playing the audio automatically (by calling the {@link CB_AudioFile_API.SM2#play} method internally). If set to true and the {@link CB_AudioFile_API.SM2#status} property reaches to the "UNCHECKED" status (defined in the {@link CB_AudioFile.UNCHECKED} constant), it will also call internally the {@link CB_AudioFile_API.SM2#checkPlaying} method.
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been loaded successfully, being "this" the {@link CB_AudioFile_API.SM2} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been loaded successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.SM2} object itself.
 *  @param {boolean} [forceReload=false] - If set to false, the "filePath" has not been changed from the previously used and the {@link CB_AudioFile_API.SM2#status} property belongs to the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant), it will exit the method without loading the audio file again (calling the "callbackOk" function, if any).
 *  @returns {CB_AudioFile_API.SM2|null} Returns the audio API object (if it was possible to create) or null otherwise.
 */
CB_AudioFile_API["SM2"].prototype.load = function(filePath, autoPlay, callbackOk, callbackError, forceReload)
{
	clearTimeout(this._checkPlayingTimeout);
	clearTimeout(this._onReadyTimeout);
	clearTimeout(this._onErrorFunctionTimeout);
	clearTimeout(this._stopAfterPlayingTimeout);
	clearTimeout(this._onLoadTimeout);
	clearTimeout(this._recursiveCallTimeout);
	clearTimeout(this._checkPlayingFinishingTimeout);
	
	filePath = filePath || this.filePath;
	
	//If the status is LOADED and the file path give is the same as the current one, just exits:
	if (!forceReload && this.status === CB_AudioFile.LOADED && this.filePath === filePath)
	{
		if (typeof(callbackOk) === "function") { callbackOk.call(this); }
		return this;
	}

	this.status = CB_AudioFile.LOADING; //The file is loading.
	
	var that = this;

	//If the maximum of objects loading is reached, calls the function again after some time and exits:
	//if (CB_AudioFile_API_AAPI_SM2_beingLoading >= CB_AudioFile_API_AAPI_SM2_maximumLoading)
	if (autoPlay && CB_AudioFile_API_AAPI_SM2_beingLoading >= CB_AudioFile_API_AAPI_SM2_maximumLoading)
	{
		this._recursiveCallTimeout = setTimeout(function() { that.load(filePath, autoPlay, callbackOk, callbackError, forceReload); }, 10);
		return this;
	}

	if (typeof(this.soundObject) !== "undefined" && this.soundObject !== null)
	{
		//this.soundObject.onload = function() {  };
		this.soundObject.onload = null;
	}
	
	//Destroys previous object (if any):
	this.destructor(true, false, true); //Also stops the sound (if any) and prevents firing onStop.
	
	this.status = CB_AudioFile.LOADING; //The file is loading.
	
	if (!this._loadingCounterIncreased)
	{
		this._loadingCounterIncreased = true;
		CB_AudioFile_API_AAPI_SM2_beingLoading++; //Increases the counter of the objects which are loading (destructor has decreased 1).
	}
	
	this.filePath = filePath;

	var callbackFunctionError =
		function(error, ignoreFailed)
		{
			//Prevents the execution of the function if the object has been declared as LOADED:
			if (that.status === CB_AudioFile.LOADED || that.status === CB_AudioFile.UNCHECKED || that.status === CB_AudioFile.CHECKING) { return; }
		
			if (that.status === CB_AudioFile.ABORTED) { return; } //If it is has been aborted, we exit.

			//If it has already failed before, exits:
			if (!ignoreFailed && that.status === CB_AudioFile.FAILED) { return; }
			
			if (that._loadingCounterIncreased)
			{
				that._loadingCounterIncreased = false;
				CB_AudioFile_API_AAPI_SM2_beingLoading--; //Decreases the counter of the objects which are loading.
				if (CB_AudioFile_API_AAPI_SM2_beingLoading < 0) { CB_AudioFile_API_AAPI_SM2_beingLoading = 0; }
			}
			
			that.status = CB_AudioFile.FAILED; //File failed to load.
			autoPlay = false;
			//var fileName = filePath;
			if (filePath.substring(0, 5).toLowerCase() === "data:") { filePath = filePath.substring(0, 15) + "[...]" + filePath.substring(filePath.length - 2); }
			error = "Error message for " + filePath + " file: " + error;
			if (typeof(callbackError) === "function") { callbackError.call(that, error); } //Calls the Error function back.
		};
	
	try
	{
		if (typeof(soundManager) === "undefined")
		{
			callbackFunctionError("SoundManager 2 not found");
			return null;
		}

		//Creates an object and destroy it because otherwise in Intel XDK emulator and Android test with WebView does not work the second time (strange bug):
		this.soundObject =
			soundManager.createSound
			(
				{
					id: "fake_sound_sm2_" + CB_AudioFile_API["SM2"]._idUnique,
					url: filePath
				}
			);
		this.destructor();
		this.status = CB_AudioFile.LOADING; //The file is loading.
		
		var onLoadCalled = false;
		var onLoad =
			function(success)
			{
				onLoadCalled = true;
				clearTimeout(that._onLoadTimeout);
				
				//Cancels callbackError call (if any) in case onload has been called before with a wrong "success" (happens on Android with WebView):
				clearTimeout(that._onErrorFunctionTimeout);

				//if (this.readyState === 3)
				if (success)
				{
					//Prepares the sound to be playable (and plays it automatically if we want to):
					that._onReadyTimeout = setTimeout(onReadyFunction, 2000); //Gives time to onerror event to be fired before canplaythrough event.
				}
				else
				{
					//Gives a little bit of time because sometimes the onLoad function is called again (on Android with WebView sometimes the first call contains a wrong "success"):
					that._onErrorFunctionTimeout =
						setTimeout
						(
							function()
							{
								callbackFunctionError("Sound could not be loaded");
							},
							1000
						);
				}
			};
		
		//Creates the object:
		this.soundObject =
			soundManager.createSound
			(
				{
					id: this.id + "_" + CB_AudioFile_API["SM2"]._idUnique++,
					url: filePath,
					autoLoad: true,
					onload: onLoad
				}
			);
		
		//Timeout to declare the sound as failed if the onload event is not fired before:
		this._onLoadTimeout = setTimeout(function() { if (!onLoadCalled) { callbackFunctionError("Sound's onload event timeout (not fired after " + CB_Configuration[CB_BASE_NAME].CB_AudioFile_ONLOAD_TIMEOUT_MS + " ms)"); } }, CB_Configuration[CB_BASE_NAME].CB_AudioFile_ONLOAD_TIMEOUT_MS);
		
		//Makes the sound seekable for some iOS versions (strange bug) and forces Firefox for Android to fire canplaythrough event (strange bug too):
		var previousVolume = this.volume; //Stores the current volume.
		if (CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING)
		{
			this.setVolume(0); //Mutes the sound.
		}
		this.soundObject.play({ loops: 1 });
		this._stopAfterPlayingTimeout = setTimeout(function() { that.soundObject.pause(); }, 1);
					
		//Plays the sound during some time because otherwise some web clients, as WebView used by Cordova on Android, receive duration 0 (strange bug):
		var onReadyFunctionExecuted = false;
		var onReadyFunction =
			function()
			{
				//Prevents the execution of the function more than once:
				if (onReadyFunctionExecuted) { return; }
				onReadyFunctionExecuted = true;

				//Prevents to be executed after the onerror event has fired:
				if (that.status === CB_AudioFile.FAILED) { return; }
				
				//Function to execute when all is OK:
				var allIsFine =
					function()
					{
						if (that.status === CB_AudioFile.ABORTED) { return; } //If it is has been aborted, we exit.
						
						if (that._loadingCounterIncreased)
						{
							that._loadingCounterIncreased = false;
							CB_AudioFile_API_AAPI_SM2_beingLoading--; //Decreases the counter of the objects which are loading.
							if (CB_AudioFile_API_AAPI_SM2_beingLoading < 0) { CB_AudioFile_API_AAPI_SM2_beingLoading = 0; }
						}

						//Restores the volume:
						that.setVolume(previousVolume);
						
						if (typeof(callbackOk) === "function") { callbackOk.call(that); } //Calls the OK function back.

						//Plays automatically if we want to:
						if (autoPlay) { that.play(); }
					};
					
				that.status = CB_AudioFile.UNCHECKED; //The file is still unchecked.
				//If we want to play automatically, checks if the currentTime changes (some web clients cannot play if the user did not fire an event to call the play function):
				if (autoPlay)
				{
					that.checkPlaying(function() { allIsFine(); }, function(error) { callbackFunctionError(error, true); }, false, false);
				}
				else { allIsFine(); }
			};
	}
	catch(E)
	{
		callbackFunctionError(E);
		return null;
	}

	return this;
}


/**
 * Checks whether the audio can be played or not. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some web clients may need this at least the first time in order to be able to play the audio. Also recommended to use before calling the {@link CB_AudioFile_API.SM2#play} method the first time. The checking action will only be performed if the value of the {@link CB_AudioFile_API.SM2#status} property belongs to the {@link CB_AudioFile.UNCHECKED} or to the {@link CB_AudioFile.CHECKING} value. After checking, if the audio can be played, the {@link CB_AudioFile_API.SM2#status} of the object will get the value of {@link CB_AudioFile.LOADED}. Otherwise, if it cannot be played, the {@link CB_AudioFile_API.SM2#status} property will get the value of {CB_AudioFile.FAILED}.
 *  @function CB_AudioFile_API.SM2#checkPlaying
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been checked successfully, being "this" the {@link CB_AudioFile_API.SM2} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been checked successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.SM2} object itself.
 *  @param {boolean} [ignoreStatus=false] - If set to false and the {@link CB_AudioFile_API.SM2#status} property does not belong neither to the "UNCHECKED" status (defined in the {@link CB_AudioFile.UNCHECKED} constant) nor to the "CHECKING" status (defined in the {@link CB_AudioFile.CHECKING} constant), it will fail calling the "callbackError" function (if any). If set to true, it will try to perform the checking action regardless the status of the audio.
 *  @param {boolean} [ignoreQueue=false] - If set to false and there is already the maximum number of audio files being checked (defined internally), the function will exit and it will call itself automatically again and again until the checking process can be performed (when its queue turn has been reached). This is done for performance purposes.
 *  @param {boolean} [useCache=false] - This parameter will be ignored in this audio API.
 *  @returns {boolean} Returns false if the checking could not be performed and failed. If it returns true, it can mean either the checking has been processed successfully or it will fail in the future, so it is recommended to ignore the returning value and use the callback functions instead.
 */
CB_AudioFile_API["SM2"].prototype.checkPlaying = function(callbackOk, callbackError, ignoreStatus, ignoreQueue, useCache)
{
	/////clearTimeout(this._recursiveCallCheckingTimeout);
	
	if (!ignoreStatus && this.status !== CB_AudioFile.UNCHECKED && this.status !== CB_AudioFile.CHECKING)
	{
		if (typeof(callbackError) === "function") { callbackError.call(this, "Cannot check if status is not unchecked or checking (status is " + this.status + ")"); }
		return false;
	}

	this.status = CB_AudioFile.CHECKING;
	
	var that = this;

	//If we do not use cache the maximum of objects checking is reached or we use cache but the file path is checking, calls the function again after some time and exits:
	if (!ignoreQueue && CB_AudioFile_API_AAPI_SM2_beingChecking >= CB_AudioFile_API_AAPI_SM2_maximumChecking)
	{
		this._recursiveCallCheckingTimeout = setTimeout(function() { that.checkPlaying(callbackOk, callbackError, ignoreStatus, useCache); }, 10);
		return true;
	}

	////this.status = CB_AudioFile.CHECKING;
	
	if (!this._checkingCounterIncreased)
	{
		this._checkingCounterIncreased = true;
		CB_AudioFile_API_AAPI_SM2_beingChecking++; //Increases the counter of the objects which are checking.
	}
	
	var previousVolume = this.volume;
	var finishedChecking =
		function(ok, error, keepStatus)
		{
			//Stops the file:
			that.soundObject.pause();
			
			//Restores the volume:
			that._checkPlayingFinishingTimeout = //Timeout to prevent hearing the sound in some web clients.
				setTimeout
				(
					function()
					{
						that.setVolume(previousVolume);
						
						//If the file is ok:
						if (ok)
						{
							if (!keepStatus) { that.status = CB_AudioFile.LOADED; }
							if (typeof(callbackOk) === "function") { callbackOk.call(that); }
						} 
						//...otherwise, if the file has failed:
						else
						{
							if (!keepStatus) { that.status = CB_AudioFile.FAILED; }
							if (typeof(callbackError) === "function") { callbackError.call(that, error); }
						}
					},
					10
				);
			
			if (that._checkingCounterIncreased)
			{
				that._checkingCounterIncreased = false;
				CB_AudioFile_API_AAPI_SM2_beingChecking--; //Decreases the counter of the objects which are checking.
				if (CB_AudioFile_API_AAPI_SM2_beingChecking < 0) { CB_AudioFile_API_AAPI_SM2_beingChecking = 0; }
			}
		};
	
	
	try
	{
		//Plays the sound during some time to let some web clients get the duration correctly (strange bug):
		if (CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING)
		{
			this.setVolume(0);
		}
		this.soundObject.play({ loops: 1 });

		var durationDetected = this.getDuration();
		var timesCurrentTimeChecked = 0;
		clearTimeout(this._checkPlayingTimeout);
		clearTimeout(this._checkPlayingFinishingTimeout);

		var checkFunction =
			function(callbackOk, callbackError)
			{
				clearTimeout(that._checkPlayingTimeout);
			
				//If it is has been aborted, we exit:
				if (that.status === CB_AudioFile.ABORTED || that.status === CB_AudioFile.FAILED)
				{
					finishedChecking(false, "Audio file object is " + (that.status === CB_AudioFile.ABORTED ? "ABORTED" : "FAILED") + ".", true);
					return;
				}

				try
				{
					that.status = CB_AudioFile.CHECKING;
					
					//If the duration has changed, it calls the function again because it means the audio is still loading (otherwise, Firefox has issues with data URIs and detects a shorter duration):
					var durationDetectedNow = that.getDuration();
					if (durationDetected !== durationDetectedNow)
					{
						durationDetected = durationDetectedNow;
						that._checkPlayingTimeout = setTimeout(function() { checkFunction(callbackOk, callbackError); }, CB_Configuration[CB_BASE_NAME].CB_AudioFile_AUTOPLAY_SILENTLY_ON_LOAD_MS);
						return;
					}
					
					//If the current time is still 0:
					if (that.soundObject.position == 0)
					{
						//We give it some opportunities more to change current time:
						if (timesCurrentTimeChecked < 1000)
						{
							timesCurrentTimeChecked++;
							if (timesCurrentTimeChecked % 20 === 0)
							{
								that.soundObject.pause();
								try { that.soundObject.setPosition(0); } catch(E) {} //Avoid Firefox complain about using an object which is no longer available.
								that.soundObject.play({ loops: 1 });
								/*
								try
								{
									if (that.soundObject.position != 0)
									{
										that.soundObject.setPosition(0.00000000001); //Executed after play method because otherwise Safari Mobile does not change currentTime.
									}
								} catch(E) {}
								*/
							}
							that._checkPlayingTimeout = setTimeout(function() { checkFunction(callbackOk, callbackError); }, 1);
							return;
						}
						//...if all opportunities failed, we declare it as FAILED and exits:
						else
						{
							finishedChecking(false, "position does not change (it is " + that.soundObject.position + ").");
							return;
						}
					}

					//Only updates the currentTime to 0 if it is not zero already (because otherwise some web clients will fail or have a wrong behaviour):
					if (that.soundObject.position != 0) { that.soundObject.setPosition(0); }

					//If the duration is zero, we declare it as FAILED and exits:
					if (that.getDuration() === 0)
					{
						finishedChecking(false, "Duration is zero");
						return;
					}
					else if (that.soundObject.readyState === 2)
					{
						finishedChecking(false, "readyState is 2 (failed/error)");
						return;
					}
					
					finishedChecking(true);
				}
				catch(E)
				{
					finishedChecking(false, E);
				}
			};
		this._checkPlayingTimeout = setTimeout(function() { checkFunction(callbackOk, callbackError); }, CB_Configuration[CB_BASE_NAME].CB_AudioFile_AUTOPLAY_SILENTLY_ON_LOAD_MS);
		return true;
	}
	catch(E)
	{
		finishedChecking(false, E);
		return false;
	}
}


/**
 * Tells the duration of the audio (in milliseconds). Note that some clients might not calculate the duration correctly and, in this case, a zero (0) value would be returned.
 *  @function CB_AudioFile_API.SM2#getDuration
 *  @returns {number} Returns the duration of the audio (in milliseconds). Note that some clients might not calculate the duration correctly and, in this case, a zero (0) value would be returned.
 */
CB_AudioFile_API["SM2"].prototype.getDuration = function()
{
	var duration;
	
	if (typeof(this.soundObject) !== "undefined" && this.soundObject !== null && typeof(this.soundObject.duration) !== "undefined" && this.soundObject.duration !== null)
	{
		duration = this.soundObject.duration;
	}
	
	if (typeof(duration) === "undefined" || duration === null || isNaN(duration) || duration < 0) { duration = 0; }
	
	return duration;
}


//Executed when there is an error playing:
CB_AudioFile_API["SM2"].prototype._onPlayingErrorFunction = function()
{
	this._onPlayingErrorFunctionExecuting = true;
	clearTimeout(this._onPlayingErrorFunctionTimeout);
	if (this.soundObject.readyState === 2 && this.status === CB_AudioFile.LOADED)
	{
		this.status = CB_AudioFile.FAILED; //Declares it as failed.
		this.stop(false, false, true); //Also fires onStop event.
	}
	if (this.status === CB_AudioFile.LOADED)
	{
		var that = this;
		this._onPlayingErrorFunctionTimeout = setTimeout(function() { that._onPlayingErrorFunction.call(that); }, 1);
	}
	else { this._onPlayingErrorFunctionExecuting = false; }
};


//Executed when the sound stops playing:
CB_AudioFile_API["SM2"].prototype._whenStopFunction = function(startAtNextLoop, stopAt, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, whenStopFunction, onPlayingErrorFunction, flags)
{
	//Just allows executing the function once:
	if (flags.whenStopFunctionExecuted) { return; }
	flags.whenStopFunctionExecuted = true;

	//Removes the event and timeout:
	this.soundObject.clearOnPosition(stopAt, whenStopFunction); //Clears the event:
	clearTimeout(this._timeoutWhenStop); //Clears the previous timeout.

	//If the sound has been stopped or paused or the stop time has changed, exits:
	if (this.stopped || this.paused || this.lastStopAt !== stopAt) { return; }
	//...otherwise, if the stop time has not been reached yet, calls the function again after a while:
	//else if (this.getCurrentTime() < stopAt) { setTimeout(whenStopFunction, 1); return; }
	
	//If the object has failed, just calls the error function and exits:
	if (this.soundObject.readyState === 2)
	{
		clearTimeout(this._onPlayingErrorFunctionTimeout);
		this._onPlayingErrorFunctionTimeout = setTimeout(onPlayingErrorFunction, 1);
		return;
	}
	
	//If we want to loop, loops again:
	if (this.loop)
	{
		//this.stop(true); //Stops the sound without setting its property as stopped.
		this.play(startAtNextLoop, stopAt, true, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, false, true); //Plays again the sound.
	}
	//...otherwise, if we don't want to loop, we stop:
	else { this.stop(); }
};


/**
 * Plays the audio.
 *  @function CB_AudioFile_API.SM2#play
 *  @param {number} [startAt=0 | {@link CB_AudioFile_API.SM2#lastStartAt} | stopAt] - Time in milliseconds where we want the audio to start at. If not provided or it is not a valid number, it will use zero (0) as default which belongs to the beginning of the audio. If the value provided is greater than the "stopAt" provided, it will use the value set in the {@link CB_AudioFile_API.SM2#lastStartAt} property (which belongs to the "startAt" value the last time that this method was called). If, even using the {@link CB_AudioFile_API.SM2#lastStartAt} value is still greather than the "stopAt" provided, it will use the same value as the "stopAt" which means it will not play and will stop immediately.
 *  @param {number} [stopAt={@link CB_AudioFile_API.SM2#getDuration}()] - Time in milliseconds where we want the audio to stop at. If not provided or it is not a valid number, it will use the returning value of the {@link CB_AudioFile_API.SM2#getDuration} method (which should belong to the total duration of the audio, if it was calculated correctly).
 *  @param {boolean} [loop={@link CB_AudioFile_API.SM2#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Note that at the end of each loop the "onStop" function defined (through the {@link CB_AudioFile_API.SM2#onStop} method) will not be called.
 *  @param {boolean} [avoidDelayedPlay=false] - If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay). Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the "stop" method will be called immediately.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all and the {@link CB_AudioFile_API.SM2#stop} method will be called immediately. Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed).
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile_API.SM2} object. If the audio is looping, this will be called only once when the audio starts playing the first time and it will not be called next loops.
 *  @param {function} [onLoadError] - Function to be called if the audio cannot be played successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.SM2} object.
 *  @param {boolean} [isResume=false] - If set to true (not recommended) and it is a looping audio, the next loop will use the value of the {@link CB_AudioFile_API.SM2#lastStartAt} property as the "startAt" parameter when it calls this method again automatically (internally). Recommended for internal usage only.
 *  @param {boolean} [isLooping=false] - Used to determine whether this method was called automatically again by itself because it is looping the audio. Recommended for internal usage only.
 *  @param {integer} [startPlayingTime] - Contains the time when the audio should start playing. Recommended for internal usage only.
 *  @returns {boolean|integer} It returns false if the duration is 0 ("startAt" and "stopAt" are the same number), returns "-1" if the audio cannot be played and an error is detected or returns true otherwise. Note that even when it returns true there can be a non-detectable error and maybe the audio is not played.
 */
CB_AudioFile_API["SM2"].prototype.play = function(startAt, stopAt, loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, isResume, isLooping, startPlayingTime)
{
	var that = this;

	var duration = this.getDuration();
	
	if (typeof(startPlayingTime) === "undefined" || startPlayingTime === null) { startPlayingTime = CB_Device.getTiming(); }
	
	var onPlayingErrorFunction = function() { that._onPlayingErrorFunction.call(that); };
	
	//If the sound is not ready yet, calls the function again but later:
	/*if (this.status !== CB_AudioFile.LOADED || this.getDuration() === 0) //Duration must be greater than zero.
	{
		this.stopped = true;
		this.paused = false;
		//If it has not failed or aborted, calls the function again but later:
		if (this.status !== CB_AudioFile.FAILED && this.status !== CB_AudioFile.ABORTED) { setTimeout(function() { that.play(startAt, stopAt, loop, allowOverlapping, avoidDelayedPlay, onLoadError, isResume, isLooping); }, 1); }
		//...otherwise, if it has failed, sets it as stopped:
		//else { this.stopped = true; }
		return -1;
	}*/
	if (this.status !== CB_AudioFile.LOADED || duration === 0 || this.soundObject.readyState === 2) //Duration must be greater than zero.
	{
		this.stopped = true;
		this.paused = false;
		
		//If it has not failed or aborted:
		if (this.status !== CB_AudioFile.FAILED && this.status !== CB_AudioFile.ABORTED) //It must be UNLOADED, LOADING, LOADED, UNCHECKED or CHECKING.
		{
			//Function that calls the play method recursively (unless the maximum time allowed has expired):
			var playLaterFunctionCalled = false;
			var playLaterFunction =
				function()
				{
					if (playLaterFunctionCalled) { return; }
					playLaterFunctionCalled = true;
					
					//If the recursive delay is not null and is a valid number:
					if (typeof(allowedRecursiveDelay) === "undefined" || allowedRecursiveDelay === null || isNaN(allowedRecursiveDelay) || allowedRecursiveDelay < 0)
					{
						allowedRecursiveDelay = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT; //We use default value.
					}
					var timeNow = CB_Device.getTiming();
					
					//If the time expired is less or equal to the delay allowed:
					if (timeNow - startPlayingTime <= allowedRecursiveDelay)
					{
						//Calls play method again:
						that.play(startAt, stopAt, loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, isResume, isLooping, startPlayingTime);
					}
					//...otherwise, just stops the sound:
					///////else { that.stop(false, false); } //Sets as stopped and fires onStop function (if any).
					else { that.stop(false, false, true); } //Sets as stopped and fires onStop function (if any).
				};

			//Function to execute when the sound loads successfully (or finishes checking successfully):
			var onLoad =
				function()
				{
					//If we allow delayed play, plays the sound:
					if (!avoidDelayedPlay) { playLaterFunction(); }
					//...otherwise, just stops the sound (to fire onStop function):
					////////else { that.stop(false, false); } //Sets as stopped and fires onStop function (if any).
					else { that.stop(false, false, true); } //Sets as stopped and fires onStop function (if any).
				};

			//If it is UNLOADED or we had a duration before but not now and it is not LOADING, loads the file again:
			if (this.status === CB_AudioFile.UNLOADED || this.status !== CB_AudioFile.LOADING && this._lastDuration !== null && duration === 0 || this.soundObject.readyState === 2)
			{
				this.load(this.filePath, false, onLoad, onLoadError, true);
			}
			//...otherwise, if it is UNCHECKED, we call the checking function:
			else if (this.status === CB_AudioFile.UNCHECKED)
			{
				this.checkPlaying(onLoad, onLoadError, false, true, false);
			}
			//...otherwise, if it is not CHECKING (it must be LOADING or LOADED with duration 0 from the beginning), we will not reload the sound:
			else if (this.status !== CB_AudioFile.CHECKING)
			{
				//If we allow delayed play, calls the play method again but after some time:
				if (!avoidDelayedPlay) { setTimeout(playLaterFunction, 1); }
				//...otherwise, just stops the sound (to fire onStop function):
				//////else { this.stop(false, false); } //Sets as stopped and fires onStop function (if any).
				else { this.stop(false, false, true); } //Sets as stopped and fires onStop function (if any).
			}
		}
		return -1;
	}

	this._lastDuration = duration;
	
	//Defines the default parameters:
	if (CB_trim(startAt) === "") { startAt = 0; } //Starts at the beginning as default.
	if (CB_trim(stopAt) === "") { stopAt = 0; } //If it is not a number, default is zero.
	if (typeof(loop) === "undefined" || loop === null) { loop = this.loop; } //If not set, uses the default (or last one used).
	else { this.loop = loop; } //...otherwise, stores the new setting given.
	
	//Sanitizes startAt and stopAt:
	startAt = parseFloat(startAt);
	stopAt = parseFloat(stopAt);
	if (startAt < 0) { startAt = 0; }
	if (stopAt <= 0 || stopAt > duration) { stopAt = duration; } //If the stopAt is not correct, plays until the end of the file.
	if (startAt > stopAt) { startAt = this.lastStartAt; } //In the case start time is than stop time, starts as the previous time.
	
	if (startAt > stopAt || isNaN(startAt)) { startAt = stopAt; }
	
	//If the duration is zero (startAt and stopAt are equal), exits:
	if (startAt === stopAt) { this.stop(); return false; }
	
	//Next loop (if any) it will start at the same time by default:
	var startAtNextLoop = startAt;
	//If it is a resume, next loop we should start from the previous startAt used:
	if (isResume) { startAtNextLoop = this.lastStartAt; }
	//...otherwise, if it is not a resume, stores the startAt used:
	else { this.lastStartAt = startAt; }
	this.lastStopAt = stopAt; //Stores stopAt used.
	
	//Adds the event to check when the file reaches the stop time:
	var whenStopFunction = function() { that._whenStopFunction.call(that, startAtNextLoop, stopAt, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, whenStopFunction, onPlayingErrorFunction, flags); };
	var flags = { "whenStopFunctionExecuted" : false };
	
	//Clears the previous timeout (if any):
	clearTimeout(this._timeoutWhenStop);
	
	//If it is looping or does not allow overlapping and it is not paused, stops the possible previous sound:
	//if (isLooping || !allowOverlapping && !this.paused) { this.stop(true); } //Stops the sound without setting its property as stopped.
	this.stop(true, true); //Stops the sound without setting its property as stopped.
	
	//Applies the current volume:
	this.setVolume(this.volume);

	//If it is not a loop (it is the first call to the play method) or we do not want to loop:
	if (!isLooping || !loop) { CB_symmetricCallClear("SM2_AUDIO_FILE" + this._id_internal); } //We clean the cache of setTimeoutSynchronized for the loop function.
	
	
	//If defined, starts at the given position (ms):
	var currentTime = startAt;
	//Only updates the currentTime to 0 if it is not zero already (because otherwise some web clients will fail or have a wrong behaviour):
	if (currentTime !== 0 || this.soundObject.position != 0)
	{
		this.soundObject.setPosition(currentTime);
	}
	//this.soundObject.setPosition(startAt);
	
	//Plays the file:
	this.soundObject.play({ loops: 99999999, onfinish: whenStopFunction }); //We will use our own way to loop. Many loops (although seems that 2 would be enough) because Android WebView returns position as 0 the second loop if the file is played completely.

	//If defined, starts at the given position (ms):
	//Only updates the currentTime to 0 if it is not zero already (because otherwise some web clients will fail or have a wrong behaviour):
	if (currentTime !== 0 || this.soundObject.position != 0)
	{
		this.soundObject.setPosition(currentTime + 0.00000000001);
	}
	//this.soundObject.setPosition(startAt); //Executed after play method because otherwise Intel XDK emulator and Android WebView kit does not perform setPosition.
	
	//Sets the event and timeout for when the sound finishes:
	this.soundObject.onPosition(stopAt, whenStopFunction);
	var msToFinish = stopAt - startAt;
	this._timeoutWhenStop = CB_symmetricCall(whenStopFunction, msToFinish, "SM2_AUDIO_FILE" + this._id_internal);
	
	//The sound is neither paused nor stopped:
	this._startPlayingTimeReal = CB_Device.getTiming(); //Useful to calculate approximate currentTime when position returns 0 (SM2 bug).
	this.paused = this.stopped = false;
	
	//If it is has failed, calls the onPlayingError function:
	if (!this._onPlayingErrorFunctionExecuting)
	{
		clearTimeout(this._onPlayingErrorFunctionTimeout);
		this._onPlayingErrorFunctionTimeout = setTimeout(onPlayingErrorFunction, 1);
	}
	if (this.soundObject.readyState === 2) { return -1; }
	
	//If it is the first time (not a loop) and there is a function to call when the play starts, we call it:
	if (!isLooping && typeof(onPlayStart) === "function") { onPlayStart.call(this, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime); onPlayStart = null; } //Prevents execution again.
	
	return true;
}


/**
 * Resumes the audio (after being paused), starting from the same point it was paused previously.
 *  @function CB_AudioFile_API.SM2#resume
 *  @param {boolean} [loop={@link CB_AudioFile_API.SM2#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Note that at the end of each loop the "onStop" function defined (through the {@link CB_AudioFile_API.SM2#onStop} method) will not be called.
 *  @param {boolean} [avoidDelayedPlay=false] - If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay). Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the {@link CB_AudioFile_API.SM2#stop} method will be called immediately.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all and the {@link CB_AudioFile_API.SM2#stop} method will be called immediately. Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed).
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile_API.SM2} object. If the audio is looping, this will be called only once when the audio starts playing the first time and it will not be called next loops.
 *  @param {function} [onLoadError] - Function to be called if the audio cannot be played successfully. It will not be called if the audio is not paused or is stopped. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.SM2} object.
 *  @returns {boolean|integer} Returns the returning value of the {@link CB_AudioFile_API.SM2#play} method which is called internally. It returns false if the audio is not paused or it is stopped, returns "-1" if the audio cannot be played and an error is detected or returns true otherwise. Note that even when it returns true there can be a non-detectable error and maybe the audio is not played.
 */
CB_AudioFile_API["SM2"].prototype.resume = function(loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError)
{
	//If it not paused or it is stopped, exits the function:
	if (!this.paused || this.stopped) { return false; }

	//this._resuming = true;
	
	var startAt = this.pauseTime;
	
	//If it has been paused after the stop time (happens sometimes when the sound was nearly to finish):
	if (startAt >= this.lastStopAt)
	{
		startAt = this.lastStopAt - 1; //We will begin just 1 millisecond before (otherwise the play method would begin again from lastStartAt).
	}
	
	return this.play(startAt, this.lastStopAt, loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, true, false);
}


/**
 * Pauses the audio when it is being played.
 *  @function CB_AudioFile_API.SM2#pause
 *  @param {function} [onPause] - Function without parameters to be called when the audio is paused successfully, being "this" the {@link CB_AudioFile_API.SM2} object.
 *  @param {boolean} [keepPausedUnaltered=false] - If set to true (not recommended), the {@link CB_AudioFile_API.SM2#paused} property will not be set to true and it will remain with its current value.
 *  @returns {boolean} It returns false if the audio is already paused or it is stopped or if it cannot be paused. Returns true otherwise.
 */
CB_AudioFile_API["SM2"].prototype.pause = function(onPause, keepPausedUnaltered)
{
	//If it already paused or stopped, exits the function:
	if (this.paused || this.stopped) { return false; }

	//this._resuming = false;
	
	if (typeof(this.soundObject) !== "undefined" && this.soundObject !== null)
	{
		clearTimeout(this._timeoutWhenStop); //Prevents that the file is set as stopped or to be executed again. 
		this.soundObject.pause();
		this.pauseTime = this.getCurrentTime();
		
		//Bug fix: sometimes SM2 returns position as 0 (getCurrentTime returns 0) and pauseTime is 0. 
		if (this.pauseTime === 0)
		{
			var timeNow = CB_Device.getTiming();
			var pauseTime = this.lastStartAt + (timeNow - this._startPlayingTimeReal);
			if (pauseTime > this.lastStopAt)
			{
				pauseTime = this.lastStartAt;
			}
			this.pauseTime = pauseTime;
		}
		
		if (!keepPausedUnaltered) { this.paused = true; }
		if (typeof(onPause) === "function") { onPause.call(this); }
		return true;
	}
	
	return false;
}


/**
 * Stops the audio.
 *  @function CB_AudioFile_API.SM2#stop
 *  @param {boolean} [keepStoppedUnaltered=false] - If set to true (not recommended), the {@link CB_AudioFile_API.SM2#stopped} property will not be set to true and it will remain with its current value.
 *  @param {boolean} [avoidOnStop=false] - If set to false and there is an "onStop" function defined (through the {@link CB_AudioFile_API.SM2#onStop} method), it will be called after stopping the audio (or after trying to do it, at least) but only if either the "forceOnStop" parameter is set to true or if the "keepStoppedUnaltered" parameter is set to false and the audio was not already stopped before. If set to true, the "onStop" function (if any) will not be called at all.
 *  @param {boolean} [forceOnStop=false] - If it is set to true and the "avoidOnStop" parameter is set to false and there is an "onStop" function defined (through the {@link CB_AudioFile_API.SM2#onStop} method), it will be called regardless the audio was stopped before or not. If set to false, the "onStop" function (if any) will only be called if the "keepStoppedUnaltered" parameter is set to false and the audio was not already stopped before. This parameter will be ignored if the "avoidOnStop" parameter is set to true.
 *  @returns {boolean} It returns false if the stopping action cannot be performed at all (this could happen when the audio has not been loaded properly, for example). Returns true otherwise (this only means that it has been tried to be stopped but it could not be successfully).
 */
CB_AudioFile_API["SM2"].prototype.stop = function(keepStoppedUnaltered, avoidOnStop, forceOnStop)
{
	if (typeof(this.soundObject) !== "undefined" && this.soundObject !== null)
	{
		///////clearTimeout(this._timeoutWhenStop); //Prevents that the file is set as stopped or to be executed again. 
		this.soundObject.stop();
		//Only updates the currentTime to 0 if it is not zero already (because otherwise some web clients will fail or have a wrong behaviour):
		if (this.soundObject.position != 0)
		{
			this.soundObject.setPosition(0);
		}
		var stoppedBefore = this.stopped;
		if (!keepStoppedUnaltered) { this.stopped = true; }
		this.paused = false; //If it is stopped, it is not paused.
		//If we do not want to avoid onStop, it was not stopped before but it is now and onStop has a valid function assigned, we execute it:
		if (!avoidOnStop && (!stoppedBefore && this.stopped || forceOnStop) && typeof(this.onStopFunction) === "function") { this.onStopFunction.call(this); }
		return true;
	}
	return false;
}


/**
 * Sets the desired volume for the audio file (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 *  @function CB_AudioFile_API.SM2#setVolume
 *  @param {number} [volume={@link CB_Speaker.getVolume()} | {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME}] - Desired volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 *  @param {boolean} [forceSetVolumeProperty=false] - If set to true (not recommended), it will change the {@link CB_AudioFile_API.SM2#volume} property even when the volume failed to be changed.
 *  @param {function} [onSetVolume] - Callback function which will be called if it has been possible to set the volume (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile_API.SM2} object.
 *  @param {boolean} [saveForUnmute=false] - If set to true (not recommended), it will save internally the current volume before setting it so it will restore the same volume again after calling the {@link CB_AudioFile_API.SM2#unmute} method. Internal usage only recommended.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 */
CB_AudioFile_API["SM2"].prototype.setVolume = function(volume, forceSetVolumeProperty, onSetVolume, saveForUnmute)
{
	//Defines the default parameters:
	volume = parseInt(volume);
	if (isNaN(volume))
	{
		this.DEFAULT_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME;
		volume = this.DEFAULT_VOLUME;
	}
	
	//Sets the volume within their limits if it is beyond them:
	var MAX_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM ? CB_Speaker.getVolume() : 100;
	if (volume > MAX_VOLUME) { volume = MAX_VOLUME; }
	else if (volume < 0) { volume = 0; }
	
	if (typeof(this.soundObject) !== "undefined" && this.soundObject !== null)
	{
		this.soundObject.setVolume(volume);
		if ((saveForUnmute || volume === 0) && this.volume > 0) { this.volumeBeforeMute = this.volume; } //Also saves the previous volume if the desired one is zero (muted).
		this.volume = volume;
		if (typeof(onSetVolume) === "function") { onSetVolume.call(this); }
	}

	if (forceSetVolumeProperty) { this.volume = volume; }
	
	return this.volume;
}


/**
 * Mutes the audio file.
 *  @function CB_AudioFile_API.SM2#mute
 *  @param {function} [onMute] - Callback function which will be called if it has been possible to mute the audio file (or at least it was possible to try it).
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise). If all goes well, the returning value should be zero (0). Note that, even when it returns a zero (0) value, this does not always mean that the mute has been applied successfully.
 */
CB_AudioFile_API["SM2"].prototype.mute = function(onMute)
{
	//Only mutes the sound if it is not muted already:
	if (this.volume > 0)
	{
		//Mutes the audio:
		this.setVolume(0, false, onMute, true); //It modifies this.volumeBeforeMute.
	}
	return this.volume;
}


/**
 * Restores audio after muting it (unmutes it).
 *  @function CB_AudioFile_API.SM2#unmute
 *  @param {function} [onUnmute] - Callback function which will be called if it has been possible to unmute the audio file (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile_API.SM2} object.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 */
CB_AudioFile_API["SM2"].prototype.unmute = function(onUnmute)
{
	//Only unmutes if it is still muted:
	if (this.volume === 0)
	{
		//Restores the volume before muting:
		this.setVolume(this.volumeBeforeMute, false, onUnmute);
	}
	return this.volume;
}


/**
 * Gets the current time (in milliseconds) which belongs to the position where the audio is currently playing or where it has been paused. Note that some audio APIs and clients could give wrong values.
 *  @function CB_AudioFile_API.SM2#getCurrentTime
 *  @returns {number} Returns the current time (in milliseconds). Note that some audio APIs and clients could give wrong values.
 */
CB_AudioFile_API["SM2"].prototype.getCurrentTime = function()
{
	var currentTime;

	if (this.status !== CB_AudioFile.LOADED) { return 0; }

	if (typeof(this.soundObject) !== "undefined" && this.soundObject !== null)
	{
		currentTime = this.soundObject.position;
	}

	if (typeof(currentTime) === "undefined" || currentTime === null || isNaN(currentTime) || currentTime < 0) { currentTime = 0; }
	
	return currentTime;
}


/*
//Returns the bytes loaded of the file:
CB_AudioFile_API["SM2"].prototype.getBytesLoaded = function()
{
	var bytesLoaded;
	
	if (typeof(this.soundObject) !== "undefined" && this.soundObject !== null)
	{
		bytesLoaded = this.soundObject.bytesLoaded;
	}
	
	if (typeof(bytesLoaded) === "undefined" || bytesLoaded === null || isNaN(bytesLoaded)) { bytesLoaded = 0; }
	
	return bytesLoaded;
}


//Returns the total bytes of the file:
CB_AudioFile_API["SM2"].prototype.getBytesTotal = function()
{
	var bytesTotal;
	
	if (typeof(this.soundObject) !== "undefined" && this.soundObject !== null)
	{
		bytesTotal = this.soundObject.bytesTotal;
	}
	
	if (typeof(bytesTotal) === "undefined" || bytesTotal === null || isNaN(bytesTotal)) { bytesTotal = 0; }
	
	return bytesTotal;
}
*/	


/**
 * Sets a function to execute when the audio file stops playing or removes it.
 *  @function CB_AudioFile_API.SM2#onStop
 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. No parameters will be received, being "this" the {@link CB_AudioFile_API.SM2} object. If a null value is used, the event will be removed.
 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
 *  @returns {boolean} Returns whether the event has been set or not (removed).
 */
CB_AudioFile_API["SM2"].prototype.onStop = function(callbackFunction, keepOldFunction)
{
	//If not set, it keeps old function by default:
	if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; }

	if (typeof(callbackFunction) !== "function") { this.onStopFunction = null; return false; }
	
	//If we don't want to keep the old function:
	if (!keepOldFunction)
	{
		this.onStopFunction = callbackFunction;
	}
	//...otherwise if we want to keep the old function, we keep it:
	else
	{
		var that = this;
		//Stores old function:
		var oldFunction = this.onStopFunction; //Stores old function of eventFunctionHolder.
		this.onStopFunction =
			function()
			{
			   if (typeof(oldFunction) === "function") { oldFunction.call(that); }
			   callbackFunction.call(that);
			};
	}
	
	return true;
}


/**
 * Returns a number representing the percentage of the loading progress for the audio file (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable.
 *  @function CB_AudioFile_API.SM2#getProgress
 *  @returns {number} Returns a number representing the percentage of the loading progress for the audio file (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable.
 */
CB_AudioFile_API["SM2"].prototype.getProgress = function()
{
	if (this.status === CB_AudioFile.LOADED || this.status === CB_AudioFile.UNCHECKED || this.status === CB_AudioFile.CHECKING) { return 100; }
	else if (this.status === CB_AudioFile.UNLOADED) { return 0; }
	
	var progress = 0;
	
	//Calculates the progress (only if it is LOADING, FAILED or ABORTED):
	if (typeof(this.soundObject) !== "undefined" && this.soundObject !== null && typeof(this.soundObject.buffered) !== "undefined")
	{
		var duration = this.getDuration();
		
		var bufferedLength = this.soundObject.buffered.length;
		var secondsBuffered = 0;
		for (var x = 0; x < bufferedLength; x++)
		{
			secondsBuffered += this.soundObject.buffered[x].end - this.soundObject.buffered[x].start;
		}
		
		if (duration === 0)
		{
			if (secondsBuffered > 0) { return 100; }
			else { return 0; }
		}
		else { progress = secondsBuffered / duration * 100; }
		
		if (progress > 100) { progress = 100; }
		else if (progress < 0) { progress = 0; }
	}
	
	return progress;
}