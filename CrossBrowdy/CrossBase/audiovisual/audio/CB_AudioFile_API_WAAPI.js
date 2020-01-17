/**
 * @file Audio files management using "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}). Contains the {@link CB_AudioFile_API.WAAPI} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */


//var CB_AudioFile_WAAPI_filePathsLoading = []; //Stores the file paths which are being loaded.
//var CB_AudioFile_WAAPI_BuffersCache = {}; //Cache of buffers for every file path.
//var CB_AudioFile_WAAPI_BuffersCacheMessage = {}; //Cache of buffers for every file path.
//var CB_AudioFile_WAAPI_CheckedCache = {}; //Cache of results of checkPlaying method for every file path.

//We need a limit to prevent out of memory error when many calls to play() are performed:
var CB_AudioFile_API_WAAPI_beingLoading = 0; //Counts how many objects are loading.
var CB_AudioFile_API_WAAPI_maximumLoading = 3; //Maximum of objects that can be loading at the same time.
var CB_AudioFile_API_WAAPI_beingChecking = 0; //Counts how many objects are loading.
var CB_AudioFile_API_WAAPI_maximumChecking = 75; //Maximum of objects that can be loading at the same time.


//Class to manage an audio file with WAAPI (Web Audio API):
if (typeof(CB_AudioFile_API) === "undefined") { var CB_AudioFile_API = {}; }
/**
 * The constructor is recommended to be called through a user-driven event (as onClick, onTouch, etc.) if the "autoPlay" option is set to true, as some web clients may need this at least the first time in order to be able to play the audio.
 *  @class CB_AudioFile_API.WAAPI
 *  @memberof! <global>
 *  @classdesc Class to manage an audio file using "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}). Used by the {@link CB_AudioFile} class internally and it shares most of its properties and methods. Recommended for internal usage only. Uses [Base64Binary]{@link https://gist.github.com/htchaan/108b7aa6b71eb03e38019e64450ea095} internally. Some old clients can use this audio API thanks to [AudioContext-MonkeyPatch]{@link https://github.com/cwilso/AudioContext-MonkeyPatch} and [WAAPISim]{@link https://github.com/g200kg/WAAPISim}.
 *  @param {string} filePath - The path of the audio file or a data URI. NOTE: Only some clients with some audio APIs will support data URIs.
 *  @param {string} [audioId='CB_AUDIOFILE_WAAPI_' + CB_AudioFile_API.WAAPI._idUnique++] - Desired identifier for the audio object. If not provided, an automatic unique ID will be calculated. Note that it is not case sensitive and it should be unique for each object.
 *  @param {CB_AudioFile_API.WAAPI.OPTIONS} [options=CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS] - Object with the desired options.
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been loaded successfully, being "this" the {@link CB_AudioFile_API.WAAPI} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been loaded successfully. The first and unique parameter will be a string describing the error found (if could be determined), being "this" the {@link CB_AudioFile_API.WAAPI} object itself.
 *  @returns {CB_AudioFile_API.WAAPI} Returns a new {@link CB_AudioFile_API.WAAPI} object.
 *  @todo Do not allow to create one object with an "id" which has already been used (unless the value is undefined, null...). Note that the "id" is not case sensitive and it should be unique for each object.
 *  @todo Method getCopy and static method filterProperties (similar to the ones from {@link CB_GraphicSprites} and {@link CB_GraphicSpritesScene}).
 */
CB_AudioFile_API["WAAPI"] = function(filePath, audioId, options, callbackOk, callbackError)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_AudioFile_API["WAAPI"])) { return new CB_AudioFile_API["WAAPI"](filePath, audioId, options, callbackOk, callbackError); }
	
	//Constants:
	/**
	 * Keeps the default volume. If the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT} property is true, this will keep the result of calling the {@link CB_Speaker.getVolume} function. Otherwise, it will use the value of the {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME} variable.
	 *	@constant CB_AudioFile_API.WAAPI#DEFAULT_VOLUME
	 *  @type {number}
	 *  @default CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME
	 */
	CB_AudioFile_API["WAAPI"].prototype.DEFAULT_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME;
	
	/**
	 * Keeps the default options when an object is created. Format: { autoLoad: boolean, autoPlay: boolean, loop: boolean, volume: number }.
	 *	@constant CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS
	 *  @type {CB_AudioFile_API.WAAPI.OPTIONS}
	 *  @default { autoLoad: true, autoPlay: false, loop: false, volume: [CB_AudioFile_API.WAAPI.prototype.DEFAULT_VOLUME]{@link CB_AudioFile_API.WAAPI#DEFAULT_VOLUME} }
	 */
	CB_AudioFile_API["WAAPI"].prototype.DEFAULT_OPTIONS = { autoLoad: true, autoPlay: false, loop: false, volume: CB_AudioFile_API["WAAPI"].prototype.DEFAULT_VOLUME, useXHR: true, useCache: true }; //Default options when the file is created.

	//Properties and variables:
	/**
	 * Tells whether the file is unloaded ({@link CB_AudioFile.UNLOADED}), loading ({@link CB_AudioFile.LOADING}), unchecked ({@link CB_AudioFile.UNCHECKED}), checking ({@link CB_AudioFile.CHECKING}), loaded ({@link CB_AudioFile.LOADED}), failed ({@link CB_AudioFile.FAILED}) or aborted ({@link CB_AudioFile.ABORTED}).
	 *	@var CB_AudioFile_API.WAAPI#status
	 *  @readonly
	 *  @type {integer}
	 *  @default {@link CB_AudioFile.UNLOADED}
	 */
	this.status = CB_AudioFile.UNLOADED;
	
	/**
	 * Defines whether the file loops by default when the audio is played or not. Its value will be modified automatically whenever the {@link CB_AudioFile_API.WAAPI#play} method is called, getting the value from the "loop" parameter (but only if contains a boolean).
	 *	@var CB_AudioFile_API.WAAPI#loop
	 *  @readonly
	 *  @type {boolean}
	 *  @default [CB_AudioFile_API.WAAPI.prototype.DEFAULT_OPTIONS]{@link CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS}.loop
	 */
	this.loop = CB_AudioFile_API["WAAPI"].prototype.DEFAULT_OPTIONS.loop;
	
	/**
     * Stores the volume of this audio. Accepted values go from 0 to MAX_VOLUME, where MAX_VOLUME is 100 if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is false or otherwise MAX_VOLUME is the returning value of the {@link CB_Speaker.getVolume} function.
	 *	@var CB_AudioFile_API.WAAPI#volume
	 *  @readonly
	 *  @type {number}
	 *  @default [CB_AudioFile_API.WAAPI.prototype.DEFAULT_OPTIONS]{@link CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS}.volume
	 */
	this.volume = CB_AudioFile_API["WAAPI"].prototype.DEFAULT_OPTIONS.volume;

	/**
     * Stores the volume of this audio before it was muted (to restore it later). Valid values go from 0 to MAX_VOLUME, where MAX_VOLUME is 100 if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is false or otherwise MAX_VOLUME is the returning value of the {@link CB_Speaker.getVolume} function.
	 *	@var CB_AudioFile_API.WAAPI#volumeBeforeMute
	 *  @readonly
	 *  @type {number}
	 *  @default {@link CB_AudioFile_API.WAAPI#volume}
	 */
	this.volumeBeforeMute = this.volume;
	
	/**
     * Stores the identifier for the audio file.
	 *	@var CB_AudioFile_API.WAAPI#id
	 *  @readonly
	 *  @type {string}
	 *  @default 'CB_AUDIOFILE_WAAPI_' + CB_AudioFile_API.WAAPI._idUnique++
	 */
	this.id = "";

	/**
     * Stores the path of the audio file or the data URI. NOTE: Only some clients with some audio APIs will support data URIs.
	 *	@var CB_AudioFile_API.WAAPI#filePath
	 *  @readonly
	 *  @type {string}
	 *  @default
	 */
	this.filePath = "";

	/**
     * Tells whether the audio is paused or not.
	 *	@var CB_AudioFile_API.WAAPI#paused
	 *  @readonly
	 *  @type {boolean}
	 *  @default false
	 */
	this.paused = false;
	
	/**
     * Stores the time (in milliseconds) when the audio has been paused.
	 *	@var CB_AudioFile_API.WAAPI#pauseTime
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	this.pauseTime = 0;
	
	/**
     * Tells whether the audio is stopped or not.
	 *	@var CB_AudioFile_API.WAAPI#stopped
	 *  @readonly
	 *  @type {boolean}
	 *  @default true
	 */
	this.stopped = true;
	
	/**
     * Function to call when the audio stops.
	 *	@var CB_AudioFile_API.WAAPI#onStopFunction
	 *  @readonly
	 *  @type {function}
	 *  @default
	 */
	this.onStopFunction = null;
	
	/**
     * Stores the last "startAt" parameter value used by the {@link CB_AudioFile_API.WAAPI#play} or the {@link CB_AudioFile_API.WAAPI#resume} method.
	 *	@var CB_AudioFile_API.WAAPI#lastStartAt
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	this.lastStartAt = null;
	
	/**
     * Stores the last "stopAt" parameter value used by the {@link CB_AudioFile_API.WAAPI#play} or the {@link CB_AudioFile_API.WAAPI#resume} method.
	 *	@var CB_AudioFile_API.WAAPI#lastStopAt
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	this.lastStopAt = null;
	
	/**
     * Stores the "source" ([AudioBufferSourceNode]{@link https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode} object) of the audio, used by the "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}).
	 *	@var CB_AudioFile_API.WAAPI#source
	 *  @readonly
	 *  @type {AudioBufferSourceNode}
	 *  @default
	 */
	this.source = null;
	
	/**
     * Stores the "buffer" ([AudioBuffer]{@link https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/buffer} object) of the audio, used by the "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}).
	 *	@var CB_AudioFile_API.WAAPI#buffer
	 *  @readonly
	 *  @type {AudioBuffer}
	 *  @default
	 */
	this.buffer = null;
	
	
	/**
     * Stores the "gain node" ([GainNode]{@link https://developer.mozilla.org/en-US/docs/Web/API/GainNode} object created with the [createGain]{@link https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createGain} method) of the audio, used by the "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}).
	 *	@var CB_AudioFile_API.WAAPI#gainNode
	 *  @readonly
	 *  @type {GainNode}
	 *  @default
	 */
	this.gainNode = null;
	
	/**
     * Progress of the loading process (or downloading through [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest}) the audio data, used by the "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}). Internal usage only recommended (use the {@link CB_AudioFile_API.WAAPI#getProgress} method instead to know the progress).
	 *	@var CB_AudioFile_API.WAAPI#progressDownloading
	 *  @readonly
	 *  @type {number}
	 *  @default 0
	 */
	this.progressDownloading = 0;

	
	//Internal properties:
	this._startTime = 0; //Stores the time when the play starts (used for WAAPI).
	this._timeoutWhenStop = null; //Keeps the timeout that is executed when the audio has finished playing (to either stop or loop).
	this._id_internal = null; //Internal id.
	this._recursiveCallTimeout = null;
	this._checkCurrentTimeChangesTimeout = null;
	this._callbackFunctionOkTimeout = null;
	this._loadingCounterIncreased = false;
	this._checkPlayingFinishingTimeout = null;
	this._recursiveCallCheckingTimeout = null;
	this._checkingCounterIncreased = false;
	this._lastDuration = null;


	//Calls the constructor of the object when creates an instance:
	return this._init(filePath, audioId, options, callbackOk, callbackError);
}


/**
 * Object with the options for an audio file. The format is the following one: { autoLoad: boolean, autoPlay: boolean, loop: boolean, volume: number }.
 *  @memberof CB_AudioFile_API.WAAPI
 *  @typedef {Object} CB_AudioFile_API.WAAPI.OPTIONS
 *  @property {boolean} [autoLoad={@link CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS}.autoLoad] - If set to false, it will not call the {@link CB_AudioFile_API.WAAPI#load} method internally when the constructor is called (not recommended).
 *  @property {boolean} [autoPlay={@link CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS}.autoPlay] - Value which will be used as the "autoPlay" parameter when calling the {@link CB_AudioFile_API.WAAPI#load} method internally, only when the "autoLoad" is set to true (when the constructor is called).
 *  @property {boolean} [loop={@link CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS}.loop] - Value that will be used for the {@link CB_AudioFile_API.WAAPI#loop} property.
 *  @property {number} [volume={@link CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS}.volume] - The desired volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise) that will be used for the {@link CB_AudioFile_API.WAAPI#volume} property.
 */


//Static properties:
CB_AudioFile_API["WAAPI"]._counter = 0; //Internal counter.
CB_AudioFile_API["WAAPI"]._idUnique = 0; //Counter to make the id unique.
CB_AudioFile_API["WAAPI"]._cache = [];
CB_AudioFile_API["WAAPI"].audioContext = null;


//Constructor:
CB_AudioFile_API["WAAPI"].prototype._init = function(filePath, audioId, options, callbackOk, callbackError)
{	
	//If not given, defines the default parameters:
	if (typeof(audioId) === "undefined" || audioId === null) { audioId = "CB_AUDIOFILE_WAAPI_" + CB_AudioFile_API["WAAPI"]._idUnique++; } //Uses the file path as default id.
	if (typeof(options) === "undefined" || options === null) { options = this.DEFAULT_OPTIONS; }
	else
	{
		if (typeof(options.loop) === "undefined" || options.loop === null) { options.loop = this.DEFAULT_OPTIONS.loop; }
		if (typeof(options.autoLoad) === "undefined" || options.autoLoad === null) { options.autoLoad = this.DEFAULT_OPTIONS.autoLoad; }
		if (typeof(options.autoPlay) === "undefined" || options.autoPlay === null) { options.autoPlay = this.DEFAULT_OPTIONS.autoPlay; }
		if (typeof(options.volume) === "undefined" || options.volume === null) { options.volume = this.DEFAULT_OPTIONS.volume; }
		if (typeof(options.useXHR) === "undefined" || options.useXHR === null) { options.useXHR = this.DEFAULT_OPTIONS.useXHR; }
		if (typeof(options.useCache) === "undefined" || options.useCache === null) { options.useCache = this.DEFAULT_OPTIONS.useCache; }
	}

	//Sets the audio ID:
	this.id = CB_trim(audioId).toUpperCase();
	
	//Sets the internal id:
	if (typeof(this._id_internal) === "undefined" || this._id_internal === null) { this._id_internal = CB_AudioFile_API["WAAPI"]._counter++; }
	
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
				that.load(that.filePath, options.autoPlay, callbackOk, callbackError, null, options.useXHR, options.useCache);
			},
			10
		);
	}

	//Returns the object:
	return this;
}


/**
 * Destroys the audio file object and frees memory. Sets its current {@link CB_AudioFile_API.WAAPI#status} property to ABORTED ({@link CB_AudioFile.ABORTED} value).
 *  @function CB_AudioFile_API.WAAPI#destructor
 *  @param {boolean} [stopSound=false] - If set to true, it will also call the {@link CB_AudioFile_API.WAAPI#stop} method.
 *  @param {boolean} [keepStoppedUnaltered=false] - Used internally as the "keepStoppedUnaltered" parameter to call the {@link CB_AudioFile_API.WAAPI#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 *  @param {boolean} [avoidOnStop=false] - Used internally as the "avoidOnStop" parameter to call the {@link CB_AudioFile_API.WAAPI#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 *  @param {boolean} [forceOnStop=false] - Used internally as the "forceOnStop" parameter to call the {@link CB_AudioFile_API.WAAPI#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 */
CB_AudioFile_API["WAAPI"].prototype.destructor = function(stopSound, keepStoppedUnaltered, avoidOnStop, forceOnStop)
{
	this._lastDuration = null;
	//if (typeof(this.audioObject) === "undefined" || this.audioObject === null) { this.status = CB_AudioFile.ABORTED; return; }
	if (stopSound) { this.stop(keepStoppedUnaltered, avoidOnStop, forceOnStop); }
	CB_Elements.remove(this.source);
	CB_Elements.remove(this.buffer);
	CB_Elements.remove(this.gainNode);
	//CB_Elements.remove(this.audioObject);
	
	//if (this.status === CB_AudioFile.LOADING)
	if (this._loadingCounterIncreased)
	{
		this._loadingCounterIncreased = false;
		CB_AudioFile_API_WAAPI_beingLoading--; //Decreases the counter of the objects which are loading.
		if (CB_AudioFile_API_WAAPI_beingLoading < 0) { CB_AudioFile_API_WAAPI_beingLoading = 0; }
	}
	
	if (this._checkingCounterIncreased)
	{
		this._checkingCounterIncreased = false;
		CB_AudioFile_API_WAAPI_beingChecking--; //Decreases the counter of the objects which are checking.
		if (CB_AudioFile_API_WAAPI_beingChecking < 0) { CB_AudioFile_API_WAAPI_beingChecking = 0; }
	}
	
	this.status = CB_AudioFile.ABORTED;
}


//Returns index of the cache of a given filepath or creates a new slot for it:
CB_AudioFile_API["WAAPI"].prototype._getCacheIndex = function(filePath)
{
	var index = -1;
	
	var cacheLength = CB_AudioFile_API["WAAPI"]._cache.length;
	for (var x = 0; x < cacheLength; x++)
	{
		if (CB_AudioFile_API["WAAPI"]._cache[x].filePath === filePath)
		{
			index = x;
			break;
		}
	}
	
	if (index === -1)
	{
		index = CB_AudioFile_API["WAAPI"]._cache.length;
		CB_AudioFile_API["WAAPI"]._cache[index] = [];
		CB_AudioFile_API["WAAPI"]._cache[index].filePath = filePath;
		CB_AudioFile_API["WAAPI"]._cache[index].loading = false;
		CB_AudioFile_API["WAAPI"]._cache[index].buffer = null;
		CB_AudioFile_API["WAAPI"]._cache[index].error = null;
		CB_AudioFile_API["WAAPI"]._cache[index].checkResult = null;
	}
	
	return index;
}


/**
 * Loads the desired audio file with the desired options. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some web clients may need this at least the first time in order to be able to play the audio. Uses [Base64Binary]{@link https://gist.github.com/htchaan/108b7aa6b71eb03e38019e64450ea095} internally. This method will be called automatically by the constructor if the "autoLoad" option was set to true in its given "options" parameter.
 * When this method is called, if the {@link CB_AudioFile_API.WAAPI#status} property already has the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant) and the "forceReload" parameter is not set to true, it will exit calling the given "callbackOk" function (if any) immediately. Otherwise, regardless the status, the status will be set to "LOADING" (defined in the {@link CB_AudioFile.LOADING} constant). After it, it will reach the "UNCHECKED" (defined in the {@link CB_AudioFile.UNCHECKED} constant). If the "autoPlay" parameter is not set to true, this will be the final status (and it will be necessary to call the {@link CB_AudioFile_API.WAAPI#checkPlaying} method after it). After it and only if the "autoPlay" is set to true, as the {@link CB_AudioFile_API.WAAPI#checkPlaying} method will be called internally, it will have the "CHECKING" status (defined in the {@link CB_AudioFile.CHECKING} constant) and finally the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant) if all goes well.
 *  @function CB_AudioFile_API.WAAPI#load
 *  @param {string} [filePath={@link CB_AudioFile_API.WAAPI#filePath}] - The path of the audio file or a data URI. NOTE: Only some clients with some audio APIs will support data URIs.
 *  @param {string} [autoPlay=false] - If set to true, it will start playing the audio automatically (by calling the {@link CB_AudioFile_API.WAAPI#play} method internally). If set to true and the {@link CB_AudioFile_API.WAAPI#status} property reaches the "UNCHECKED" status (defined in the {@link CB_AudioFile.UNCHECKED} constant), it will also call internally the {@link CB_AudioFile_API.WAAPI#checkPlaying} method.
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been loaded successfully, being "this" the {@link CB_AudioFile_API.WAAPI} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been loaded successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.WAAPI} object itself.
 *  @param {boolean} [forceReload=false] - If set to false, the "filePath" has not been changed from the previously used and the {@link CB_AudioFile_API.WAAPI#status} property belongs to the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant), it will exit the method without loading the audio file again (calling the "callbackOk" function, if any).
 *  @param {boolean} [useXHR=[CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS]{@link CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS}.useXHR] - Defines whether to use or not [XHR]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest} ([AJAX]{@link https://en.wikipedia.org/wiki/Ajax_(programming)}) to load the audio file.
 *  @param {boolean} [useCache=[CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS]{@link CB_AudioFile_API.WAAPI#DEFAULT_OPTIONS}.useCache] - Defines whether to try to use or not a cache for performance purposes. If set to true and the audio file was loaded before, it will try to use the cache (if possible) to accelerate the loading process.
 *  @returns {CB_AudioFile_API.WAAPI|null} Returns the audio API object (if it was possible to create) or null otherwise.
 */
CB_AudioFile_API["WAAPI"].prototype.load = function(filePath, autoPlay, callbackOk, callbackError, forceReload, useXHR, useCache)
{
	clearTimeout(this._checkCurrentTimeChangesTimeout);
	clearTimeout(this._callbackFunctionOkTimeout);
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
	
	if (typeof(useCache) === "undefined" || useCache === null) { useCache = this.DEFAULT_OPTIONS.useCache; }
	
	var filePathIndex = this._getCacheIndex(filePath);
	
	//If we do not use cache the maximum of objects loading is reached or we use cache but the file path is loading, calls the function again after some time and exits:
	//if (!useCache && CB_AudioFile_API_WAAPI_beingLoading >= CB_AudioFile_API_WAAPI_maximumLoading || useCache && typeof(CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading) !== "undefined" && CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading)
	if (autoPlay && !useCache && CB_AudioFile_API_WAAPI_beingLoading >= CB_AudioFile_API_WAAPI_maximumLoading || useCache && typeof(CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading) !== "undefined" && CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading)
	{
		this._recursiveCallTimeout = setTimeout(function() { that.load(filePath, autoPlay, callbackOk, callbackError, forceReload, useXHR, useCache); }, 100);
		return this;
	}

	//If the buffer for this file path is still not in the cache, other files will have to wait until it loads:
	if (typeof(CB_AudioFile_API["WAAPI"]._cache[filePathIndex].buffer) === "undefined" || CB_AudioFile_API["WAAPI"]._cache[filePathIndex].buffer === null)
	{
		CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading = true; //The file path is loading.
	}
	
	if (typeof(useXHR) === "undefined" || useXHR === null) { useXHR = this.DEFAULT_OPTIONS.useXHR; }
	
	//Destroys previous object (if any):
	this.destructor(true, false, true); //Also stops the sound (if any) and prevents firing onStop.
	
	this.status = CB_AudioFile.LOADING; //The file is loading.
	
	if (!this._loadingCounterIncreased)
	{
		this._loadingCounterIncreased = true;
		CB_AudioFile_API_WAAPI_beingLoading++; //Increases the counter of the objects which are loading (destructor has decreased 1).
	}
	
	this.filePath = filePath;
	
	//Callback wrapper function when an error happens:
	var callbackFunctionError =
		function(error, failedChecking, avoidRegisteringError)
		{
			if (that.status === CB_AudioFile.ABORTED) { return; } //If it is has been aborted, we exit.

			if (filePath.substring(0, 5).toLowerCase() === "data:") { filePath = filePath.substring(0, 15) + "[...]" + filePath.substring(filePath.length - 2); }
			if (typeof(error) === "undefined" || error === null) { error = "Unknown error for " + filePath + " file"; }
			else if (typeof(error.status) !== "undefined") { error = "XHR request for " + filePath + " file returned " + error.status; }
			else { error = "Error message for " + filePath + " file: " + error; }
			
			//Stores as failed (-1) in the cache (for the next time if any CB_AudioFile_API["WAAPI"] object wants to use cache for the same file path):
			if (!failedChecking) //We do not store in the cache as it has failed if it has failed checking (because maybe the file is fine but just failed checking).
			{
				if (!avoidRegisteringError) { CB_AudioFile_API["WAAPI"]._cache[filePathIndex].error = error; }
				CB_AudioFile_API["WAAPI"]._cache[filePathIndex].buffer = -1;
			} 
			
			if (that._loadingCounterIncreased)
			{
				that._loadingCounterIncreased = false;
				CB_AudioFile_API_WAAPI_beingLoading--; //Decreases the counter of the objects which are loading.
				if (CB_AudioFile_API_WAAPI_beingLoading < 0) { CB_AudioFile_API_WAAPI_beingLoading = 0; }
			}
			
			CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading = false; //The file path is not loading anymore.
			
			that.status = CB_AudioFile.FAILED; //File failed to load.
			autoPlay = false;
			//var fileName = filePath;

			if (typeof(callbackError) === "function") { callbackError.call(that, error); } //Calls the Error function back.
		};
		
	//Callback wrapper function when all goes well:
	var callbackFunctionOk =
		function()
		{
			//Function to execute when all is OK:
			var allIsFine =
				function()
				{
					if (that.status === CB_AudioFile.ABORTED) { return; } //If it is has been aborted, we exit.

					//Stores the buffer in the cache (for the next time if any CB_AudioFile_API["WAAPI"] object wants to use cache for the same file path):
					CB_AudioFile_API["WAAPI"]._cache[filePathIndex].buffer = that.buffer;
					
					if (that._loadingCounterIncreased)
					{
						that._loadingCounterIncreased = false;
						CB_AudioFile_API_WAAPI_beingLoading--; //Decreases the counter of the objects which are loading.
						if (CB_AudioFile_API_WAAPI_beingLoading < 0) { CB_AudioFile_API_WAAPI_beingLoading = 0; }
					}
					
					CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading = false; //The file path is not loading anymore.

					if (typeof(callbackOk) === "function") { callbackOk.call(that); } //Calls the OK function back.
				
					//Plays automatically if we want to:
					if (autoPlay) { that.play(); }
				};
				
			that.status = CB_AudioFile.UNCHECKED; //The file is still unchecked.
			//If we want to play automatically, checks if the currentTime changes (some web clients cannot play if the user did not fire an event to call the play function):
			if (autoPlay)
			{
				that.checkPlaying(function() { allIsFine(); }, function(error) { callbackFunctionError(error, true); }, false, false, useCache);
			}
			else
			{
				//Starts playing and stops immediately the sound (needed for some web clients, as Edge, to be able to play the sound later from the first attempt):
				try
				{
					that.source = CB_AudioFile_API["WAAPI"].audioContext.createBufferSource();
					var source = that.source;
					source.buffer = that.buffer;
					that.gainNode = CB_AudioFile_API["WAAPI"].audioContext.createGain();
					that.source.connect(that.gainNode);
					that.gainNode.connect(CB_AudioFile_API["WAAPI"].audioContext.destination);
					var previousVolume = that.volume;
					if (CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING)
					{
						that.setVolume(0);
					}
					source.loop = false;
					source.start(0, 0);
					that.source.stop(0);
					that.setVolume(previousVolume);
				} catch(E) {}

				//Calls the final function:
				allIsFine();
			}
		}

	try
	{
		//Function that decodes the binary data:
		var callbackFunctionDecode =
			function(binaryData)
			{
				that.progressDownloading = 100; //The file must have been downloaded since we want to decode it now.
				that.decodeAudioData(binaryData, callbackFunctionOk, callbackFunctionError);
			};
			
		if (typeof(window.AudioContext) === "undefined" && typeof(window.webkitAudioContext) === "undefined")
		{
			callbackFunctionError("Web Audio API not found");
			CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading = false; //The file path is not loading.
			return null;
		}
		
		//Just creates an audio context:
		if (typeof(CB_AudioFile_API["WAAPI"].audioContext) === "undefined" || CB_AudioFile_API["WAAPI"].audioContext === null)
		{
			CB_AudioFile_API["WAAPI"].audioContext = new (window.AudioContext || window.webkitAudioContext)();
			//Hack (source: https://stackoverflow.com/questions/56768576/safari-audiocontext-suspended-even-with-onclick-creation/56770254#56770254):
			try { CB_AudioFile_API["WAAPI"].audioContext.createGain(); } catch (createGainError) { CB_console("Error creating a GainNode for the AudioContext: " + createGainError); }
			try { CB_AudioFile_API["WAAPI"].audioContext.resume(); } catch (audioContextResumeError) { CB_console("Error resuming AudioContext: " + audioContextResumeError); }
			if (!CB_AudioFile_API["WAAPI"].audioContext)
			{
				callbackFunctionError("AudioContext/webkitAudioContext object could not be created! Value returned: " + CB_AudioFile_API["WAAPI"].audioContext);
				CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading = false; //The file path is not loading.
				return null;
			}
		}

		if (CB_AudioFile_API["WAAPI"].audioContext && CB_AudioFile_API["WAAPI"].audioContext.state === "suspended")
		{
			CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading = false; //The file path is not loading.
			try
			{
				var readStateHack = CB_AudioFile_API["WAAPI"].audioContext.state; //Hack. Source: https://stackoverflow.com/questions/56768576/safari-audiocontext-suspended-even-with-onclick-creation/56770254#56770254
				CB_AudioFile_API["WAAPI"].audioContext.resume();
				
				//CB_AudioFile_API["WAAPI"].audioContext.onstatechange = function()
				CB_Events.on
				(
					CB_AudioFile_API["WAAPI"].audioContext,
					"statechange",
					function()
					{
						if (CB_AudioFile_API["WAAPI"].audioContext.state === "running")
						{
							that.load(filePath, autoPlay, callbackOk, callbackError, forceReload, useXHR, useCache);
						}
					},
					false, //useCapture.
					true, //keepOldEventFunction.
					true //erasable.
				);
			} catch (resumeOrOnStateChangeError) { CB_console("Error resuming or managing 'onStateChange' event: " + resumeOrOnStateChangeError); }
			return this;
		}

		//If we want to use the cache and the file has already been loaded before, gets the buffer from the cache:
		if (useCache && typeof(CB_AudioFile_API["WAAPI"]._cache[filePathIndex].buffer) !== "undefined" && CB_AudioFile_API["WAAPI"]._cache[filePathIndex].buffer !== null)
		{
			this.buffer = CB_AudioFile_API["WAAPI"]._cache[filePathIndex].buffer;
			this.progressDownloading = 100;
			this._callbackFunctionOkTimeout =
				setTimeout
				(
					(this.buffer === -1)
						? function() { callbackFunctionError("File path from the cache already failed before. Previous message: " + CB_AudioFile_API["WAAPI"]._cache[filePathIndex].error, false, true); }
						: callbackFunctionOk,
					10
				);
		}
		//If we have received a data URI (base64), we don't need to use AJAX (XHR):
		else if (filePath.substring(0, 5).toLowerCase() === "data:")
		{
			if (filePath.indexOf(";base64") !== -1)
			{
				//Note: Base64Binary needs Uint8Array and ArrayBuffer support. But the web client will support it if the Web Audio API is supported.
				var base64Data = filePath.substring(filePath.indexOf(",") + 1); //We just need the data.
				this.progressDownloading = 100;
				var byteArray = Base64Binary.decodeArrayBuffer(base64Data);
				callbackFunctionDecode(byteArray);
			}
			else { callbackFunctionError("Data URI does not contain the ';base64' string"); }
		}
		//...otherwise, we use AJAX (XHR) to load the file given:
		else if (useXHR)
		{
			//When the file is loaded, calls the function to set it as ready and load the buffer too:
			var XHR = CB_Net.XHR.callBinary(filePath, null, null, "arraybuffer", null, function(XHR) { callbackFunctionDecode(XHR.response); }, callbackFunctionError, [200, 206]); //Allows partial content (206 XHR status).
			this.progressDownloading = 0;
			XHR.onprogress =
				function updateProgress (event)
				{
					if (event.lengthComputable)
					{
						that.progressDownloading = event.loaded / event.total * 100;
					}
				};
		}
		//...otherwise, we use WAAPI from an Audio object:
		else
		{
			this.progressDownloading = 0;
			//Function that processes the Audio element:
			var processAudioElement =
				function()
				{
					if (typeof(audioFileObject) !== "undefined" && typeof(audioFileObject.audioObject) !== "undefined" && audioFileObject.audioObject !== null)
					{
						try
						{
							var source = CB_AudioFile_API["WAAPI"].audioContext.createMediaElementSource(audioFileObject.audioObject);
							var gainNode = CB_AudioFile_API["WAAPI"].audioContext.createGain();
							/////source.connect(gainNode);
							/////gainNode.connect(CB_AudioFile_API["WAAPI"].audioContext.destination);
							
							analyser = CB_AudioFile_API["WAAPI"].audioContext.createAnalyser();
							source.connect(analyser);
							analyser.connect(CB_AudioFile_API["WAAPI"].audioContext.destination);
							//source.start(0, 0);
							
							callbackFunctionOk(); //Calls the OK function back.
						}
						catch (error) { callbackFunctionError(error); }
					}
					else { callbackFunctionError("Audio element is undefined or null"); }
				};
			//Creates an Audio object with AAPI:
			var audioFileObject = new CB_AudioFile_API["AAPI"](filePath, "CB_media_" + this.id, { autoLoad: true, autoPlay: false, loop: false }, processAudioElement, callbackFunctionError);
		}
	}
	catch(E)
	{
		callbackFunctionError(E);
		CB_AudioFile_API["WAAPI"]._cache[filePathIndex].loading = false; //The file path is not loading.
		return null;
	}
	
	//Plays automatically if we want to:
	//if (autoPlay) { this.play(); }
	//if (autoPlay) { setTimeout(function() { that.play(); }, 5000); }
	
	return this;
}


/**
 * Decodes binary audio data given. Internal usage only recommended.
 *  @function CB_AudioFile_API.WAAPI#decodeAudioData
 *  @param {ArrayBuffer} binaryData - [ArrayBuffer]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer} with the audio data to be decoded.
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio data has been decoded successfully, being "this" the {@link CB_AudioFile_API.WAAPI} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio data has not been decoded successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.WAAPI} object itself.
 *  @returns {undefined|Promise} Returns the returning value of calling the [BaseAudioContext.decodeAudioData]{@link https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData} function, which returns void (undefined) or a [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise} (whose methods "then" and "catch" will have already been used internally by this function).
 */
CB_AudioFile_API["WAAPI"].prototype.decodeAudioData = function(binaryData, callbackOk, callbackError)
{
	var that = this;

	var callbackCalled = false;
	var callbackDecodedOk =
		function(buffer)
		{
			if (callbackCalled) { return; }
			callbackCalled = true;

			//In case of error:
			//if (typeof(buffer) === "undefined" || buffer === null || !buffer)
			if (!buffer)
			{
				if (typeof(callbackError) === "function")
				{
					callbackError.call(that, "Buffer is not defined or null or empty");
				}
			}
			//...otherwise, the sound has been loaded correctly:
			else
			{
				that.buffer = buffer; //Stores the buffer in this object.
				if (typeof(callbackOk) === "function") { callbackOk.call(that); } //Calls the OK function back.
			}
		};
	
	var callbackDecodedError =
		function(error) //In case of error:
		{
			if (callbackCalled) { return; }
			callbackCalled = true;
			if (typeof(callbackError) === "function") { callbackError.call(that, error); }
		};	
	
	var returningValue = CB_AudioFile_API["WAAPI"].audioContext.decodeAudioData(binaryData, callbackDecodedOk,	callbackDecodedError);
	
	if (typeof(returningValue) !== "undefined" && returningValue !== null && typeof(returningValue.then) === "function")
	{
		returningValue.then(callbackDecodedOk)["catch"](callbackDecodedError);
	}
	
	return returningValue;
}


/**
 * Checks whether the audio can be played or not. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some web clients may need this at least the first time in order to be able to play the audio. Also recommended to use before calling the {@link CB_AudioFile_API.WAAPI#play} method the first time. The checking action will only be performed if the value of the {@link CB_AudioFile_API.WAAPI#status} property belongs to the {@link CB_AudioFile.UNCHECKED} or to the {@link CB_AudioFile.CHECKING} value. After checking, if the audio can be played, the {@link CB_AudioFile_API.WAAPI#status} of the object will get the value of {@link CB_AudioFile.LOADED}. Otherwise, if it cannot be played, the {@link CB_AudioFile_API.WAAPI#status} property will get the value of {CB_AudioFile.FAILED}.
 *  @function CB_AudioFile_API.WAAPI#checkPlaying
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been checked successfully, being "this" the {@link CB_AudioFile_API.WAAPI} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been checked successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.WAAPI} object itself.
 *  @param {boolean} [ignoreStatus=false] - If set to false and the {@link CB_AudioFile_API.WAAPI#status} property does not belong neither to the "UNCHECKED" status (defined in the {@link CB_AudioFile.UNCHECKED} constant) nor to the "CHECKING" status (defined in the {@link CB_AudioFile.CHECKING} constant), it will fail calling the "callbackError" function (if any). If set to true, it will try to perform the checking action regardless the status of the audio.
 *  @param {boolean} [ignoreQueue=false] - If set to false and there is already the maximum number of audio files being checked (defined internally), the function will exit and it will call itself automatically again and again until the checking process can be performed (when its queue turn has been reached). This is done for performance purposes.
 *  @param {boolean} [useCache=false] - If set to true (not recommended) and the same audio file was checked previously, it will not perform the checking process again and it will do the same as the previous call.
 *  @returns {boolean} Returns false if the checking could not be performed and failed. If it returns true, it can mean either the checking has been processed successfully or it will fail in the future, so it is recommended to ignore the returning value and use the callback functions instead.
 */
CB_AudioFile_API["WAAPI"].prototype.checkPlaying = function(callbackOk, callbackError, ignoreStatus, ignoreQueue, useCache)
{
	/////clearTimeout(this._recursiveCallCheckingTimeout);
	
	if (!ignoreStatus && this.status !== CB_AudioFile.UNCHECKED && this.status !== CB_AudioFile.CHECKING)
	{
		if (typeof(callbackError) === "function") { callbackError.call(this, "Cannot check if status is not unchecked or checking (status is " + this.status + ")"); }
		return false;
	}

	this.status = CB_AudioFile.CHECKING;
	
	var that = this;
	
	var filePathIndex = this._getCacheIndex(this.filePath);
	
	if (useCache && typeof(CB_AudioFile_API["WAAPI"]._cache[filePathIndex].checkResult) !== "undefined" && CB_AudioFile_API["WAAPI"]._cache[filePathIndex].checkResult !== null)
	{
		if (CB_AudioFile_API["WAAPI"]._cache[filePathIndex].checkResult)
		{
			this.status = CB_AudioFile.LOADED;
			if (typeof(callbackOk) === "function") {  callbackOk.call(that); }
			return true;
		}
		else
		{
			this.status = CB_AudioFile.FAILED;
			if (typeof(callbackError) === "function") { callbackError.call(that, "File path from the cache already failed checking before."); }
			return false;
		}
	}
	
	//If we do not use cache the maximum of objects checking is reached or we use cache but the file path is checking, calls the function again after some time and exits:
	if (!ignoreQueue && CB_AudioFile_API_WAAPI_beingChecking >= CB_AudioFile_API_WAAPI_maximumChecking)
	{
		this._recursiveCallCheckingTimeout = setTimeout(function() { that.checkPlaying(callbackOk, callbackError, ignoreStatus, useCache); }, 10);
		return true;
	}

	//////this.status = CB_AudioFile.CHECKING;
	
	if (!this._checkingCounterIncreased)
	{
		this._checkingCounterIncreased = true;
		CB_AudioFile_API_WAAPI_beingChecking++; //Increases the counter of the objects which are checking.
	}
	
	var previousVolume = this.volume;
	var finishedChecking =
		function(ok, error, keepStatus)
		{
			//Stops the file:
			that.source.stop(0);

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
				CB_AudioFile_API_WAAPI_beingChecking--; //Decreases the counter of the objects which are checking.
				if (CB_AudioFile_API_WAAPI_beingChecking < 0) { CB_AudioFile_API_WAAPI_beingChecking = 0; }
			}
			
			CB_AudioFile_API["WAAPI"]._cache[filePathIndex].checkResult = ok; //Stores the result in the cache.
		};		
	
	
	try
	{
		//Tries to play it silently and checks whether current time has changed. If it has not changed, the file has not been loaded properly.
		//Note: In Opera with Android sometimes it doesn't throw any error and status is "playing" but currentTime is always zero and no sound can be heard.
		this.source = CB_AudioFile_API["WAAPI"].audioContext.createBufferSource();
		var source = this.source;
		source.buffer = this.buffer;
		this.gainNode = CB_AudioFile_API["WAAPI"].audioContext.createGain();
		this.source.connect(this.gainNode);
		this.gainNode.connect(CB_AudioFile_API["WAAPI"].audioContext.destination);
		if (CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING)
		{
			this.setVolume(0);
		}
		source.loop = false;
		source.start(0, 0);
		var currentTime = CB_AudioFile_API["WAAPI"].audioContext.currentTime;
		var timesChecked = 0;
		clearTimeout(this._checkCurrentTimeChangesTimeout);
		clearTimeout(this._checkPlayingFinishingTimeout);

		var checkCurrentTimeChanges =
			function(callbackOk, callbackError)
			{
				if (that.status === CB_AudioFile.ABORTED || that.status === CB_AudioFile.FAILED)
				{
					finishedChecking(false, "Audio file object is " + (that.status === CB_AudioFile.ABORTED ? "ABORTED" : "FAILED") + ".", true);
					return;
				}
				try
				{
					that.status = CB_AudioFile.CHECKING;
					clearTimeout(that._checkCurrentTimeChangesTimeout);
					var currentTimeNow = CB_AudioFile_API["WAAPI"].audioContext.currentTime;
					//We check whther the currentTime has changed or not, until a certain number of times:
					if (currentTime === currentTimeNow)
					{
						if (timesChecked < 1000)
						{
							timesChecked++;
							that._checkCurrentTimeChangesTimeout = setTimeout(function() { checkCurrentTimeChanges(callbackOk, callbackError); }, 1);
							return;
						}
						else
						{
							finishedChecking(false, "currentTime does not change (it is " + currentTime + ").");
						}
					}
					else
					{
						/////that.status = CB_AudioFile.LOADED; //The file has been loaded.
						finishedChecking(true);
					}
				}
				catch(E)
				{
					finishedChecking(false, E);
				}
			};
		checkCurrentTimeChanges(callbackOk, callbackError);
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
 *  @function CB_AudioFile_API.WAAPI#getDuration
 *  @returns {number} Returns the duration of the audio (in milliseconds). Note that some clients might not calculate the duration correctly and, in this case, a zero (0) value would be returned.
 */
CB_AudioFile_API["WAAPI"].prototype.getDuration = function()
{
	var duration;
	
	if (typeof(this.buffer) !== "undefined" && this.buffer !== null)
	{
		duration = this.buffer.duration * 1000;
	}
	
	if (typeof(duration) === "undefined" || duration === null || isNaN(duration) || duration < 0) { duration = 0; }
	
	return duration;
}


/**
 * Plays the audio.
 *  @function CB_AudioFile_API.WAAPI#play
 *  @param {number} [startAt=0 | {@link CB_AudioFile_API.WAAPI#lastStartAt} | stopAt] - Time in milliseconds where we want the audio to start at. If not provided or it is not a valid number, it will use zero (0) as default which belongs to the beginning of the audio. If the value provided is greater than the "stopAt" provided, it will use the value set in the {@link CB_AudioFile_API.WAAPI#lastStartAt} property (which belongs to the "startAt" value the last time that this method was called). If, even using the {@link CB_AudioFile_API.WAAPI#lastStartAt} value is still greather than the "stopAt" provided, it will use the same value as the "stopAt" which means it will not play and will stop immediately.
 *  @param {number} [stopAt={@link CB_AudioFile_API.WAAPI#getDuration}()] - Time in milliseconds where we want the audio to stop at. If not provided or it is not a valid number, it will use the returning value of the {@link CB_AudioFile_API.WAAPI#getDuration} method (which should belong to the total duration of the audio, if it was calculated correctly).
 *  @param {boolean} [loop={@link CB_AudioFile_API.WAAPI#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Note that at the end of each loop the "onStop" function defined (through the {@link CB_AudioFile_API.WAAPI#onStop} method) will not be called.
 *  @param {boolean} [avoidDelayedPlay=false] - If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay). Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the "stop" method will be called immediately.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all and the {@link CB_AudioFile_API.WAAPI#stop} method will be called immediately. Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed).
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile_API.WAAPI} object. If the audio is looping, this will be called only once when the audio starts playing the first time and it will not be called next loops.
 *  @param {function} [onLoadError] - Function to be called if the audio cannot be played successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.WAAPI} object.
 *  @param {boolean} [isResume=false] - If set to true (not recommended) and it is a looping audio, the next loop will use the value of the {@link CB_AudioFile_API.WAAPI#lastStartAt} property as the "startAt" parameter when it calls this method again automatically (internally). Recommended for internal usage only.
 *  @param {boolean} [isLooping=false] - Used to determine whether this method was called automatically again by itself because it is looping the audio. Recommended for internal usage only.
 *  @param {integer} [startPlayingTime] - Contains the time when the audio should start playing. Recommended for internal usage only.
 *  @returns {boolean|integer} It returns false if the duration is 0 ("startAt" and "stopAt" are the same number), returns "-1" if the audio cannot be played and an error is detected or returns true otherwise. Note that even when it returns true there can be a non-detectable error and maybe the audio is not played.
 */
CB_AudioFile_API["WAAPI"].prototype.play = function(startAt, stopAt, loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, isResume, isLooping, startPlayingTime)
{
	var that = this;
	
	var duration = this.getDuration();
	
	if (typeof(startPlayingTime) === "undefined" || startPlayingTime === null) { startPlayingTime = CB_Device.getTiming(); }
	
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
	if (this.status !== CB_AudioFile.LOADED || duration === 0) //Duration must be greater than zero.
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
					/////else { that.stop(false, false); } //Sets as stopped and fires onStop function (if any).
					else { that.stop(false, false, true); } //Sets as stopped and fires onStop function (if any).
				};

			//Function to execute when the sound loads successfully (or finishes checking successfully):
			var onLoad =
				function()
				{
					//If we allow delayed play, plays the sound:
					if (!avoidDelayedPlay) { playLaterFunction(); }
					//...otherwise, just stops the sound (to fire onStop function):
					else { that.stop(false, false, true); } //Sets as stopped and fires onStop function (if any).
				};
				
			//If it is UNLOADED or we had a duration before but not now and it is not LOADING, loads the file again:
			if (this.status === CB_AudioFile.UNLOADED || this.status !== CB_AudioFile.LOADING && this._lastDuration !== null && duration === 0)
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
				/////else { this.stop(false, false); } //Sets as stopped and fires onStop function (if any).
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
	if (startAt > stopAt) { startAt = this.lastStartAt; } //In the case start time is greater than the stop time, starts as the previous time.

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
	var whenStopFunction =
		function()
		{
			//Removes the event and timeout:
			clearTimeout(that._timeoutWhenStop); //Clears the previous timeout.
			//CB_Events.remove(source, "ended", whenStopFunction, false);
			//CB_Events.remove(source, "webkitended", whenStopFunction, false);
			
			//If the sound has been stopped or paused or the stop time has changed, exits:
			if (that.stopped || that.paused || that.lastStopAt !== stopAt) { return; }
			//...otherwise, if the stop time has not been reached yet, calls the function again after a while:
			///////else if (that.getCurrentTime() < stopAt) { setTimeout(whenStopFunction, 1); return; }
			
			//If we want to loop, loops again:
			if (that.loop)
			{
				//that.stop(true); //Stops the sound without setting its property as stopped.
				that.play(startAtNextLoop, stopAt, true, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, false, true); //Plays again the sound.
			}
			//...otherwise, if we don't want to loop, we stop:
			else { that.stop(); }
		};

	//Clears the previous timeout (if any):
	clearTimeout(this._timeoutWhenStop);
	
	//If it is not a loop (it is the first call to the play method) or we do not want to loop:
	if (!isLooping || !loop) { CB_symmetricCallClear("WAAPI_AUDIO_FILE" + this._id_internal); } //We clean the cache of setTimeoutSynchronized for the loop function.

	//If it is looping or does not allow overlapping and it is not paused, stops the possible previous sound:
	//if (isLooping || !allowOverlapping && !this.paused) { this.stop(true); } //Stops the sound without setting its property as stopped.
	this.stop(true, true); //Stops the sound without setting its property as stopped.
	
	//Prepares the mystical stuff:
	this.source = CB_AudioFile_API["WAAPI"].audioContext.createBufferSource();
	var source = this.source;
	source.buffer = this.buffer;
	
	//Creates a gain node to be able to set the volume later:
	this.gainNode = CB_AudioFile_API["WAAPI"].audioContext.createGain();
	this.source.connect(this.gainNode);
	this.gainNode.connect(CB_AudioFile_API["WAAPI"].audioContext.destination);

	//Applies the current volume:
	this.setVolume(this.volume);

	//Plays the sound:
	source.loop = false; //We will use our own way to loop, so we don't need the normal way.
	source.start(0, startAt / 1000, (stopAt - startAt) / 1000); //WAAPI needs seconds.

	//Stores the start time (useful for pause/resume):
	this._startTime = CB_AudioFile_API["WAAPI"].audioContext.currentTime - (startAt / 1000); //WAAPI needs seconds.

	//Sets the event and timeout for when the sound finishes:
	//if (typeof(source.onended) !== "undefined") { CB_Events.add(source, "ended", whenStopFunction, false, true, true); }
	//else if (typeof(source.webkitended) !== "undefined") { CB_Events.add(source, "webkitended", whenStopFunction, false, true, true); }
	//else
	//{
		var msToFinish = stopAt - startAt;
		this._timeoutWhenStop = CB_symmetricCall(whenStopFunction, msToFinish, "WAAPI_AUDIO_FILE" + this._id_internal);
	//}

	//The sound is neither paused nor stopped:
	this.paused = this.stopped = false;
	
	//If it is the first time (not a loop) and there is a function to call when the play starts, we call it:
	if (!isLooping && typeof(onPlayStart) === "function") { onPlayStart.call(this, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime); onPlayStart = null; } //Prevents execution again.
	
	return true;
}


/**
 * Resumes the audio (after being paused), starting from the same point it was paused previously.
 *  @function CB_AudioFile_API.WAAPI#resume
 *  @param {boolean} [loop={@link CB_AudioFile_API.WAAPI#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Note that at the end of each loop the "onStop" function defined (through the {@link CB_AudioFile_API.WAAPI#onStop} method) will not be called.
 *  @param {boolean} [avoidDelayedPlay=false] - If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay). Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the {@link CB_AudioFile_API.WAAPI#stop} method will be called immediately.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all and the {@link CB_AudioFile_API.WAAPI#stop} method will be called immediately. Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed).
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile_API.WAAPI} object. If the audio is looping, this will be called only once when the audio starts playing the first time and it will not be called next loops.
 *  @param {function} [onLoadError] - Function to be called if the audio cannot be played successfully. It will not be called if the audio is not paused or is stopped. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.WAAPI} object.
 *  @returns {boolean|integer} Returns the returning value of the {@link CB_AudioFile_API.WAAPI#play} method which is called internally. It returns false if the audio is not paused or it is stopped, returns "-1" if the audio cannot be played and an error is detected or returns true otherwise. Note that even when it returns true there can be a non-detectable error and maybe the audio is not played.
 */
CB_AudioFile_API["WAAPI"].prototype.resume = function(loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError)
{
	//If it not paused or it is stopped, exits the function:
	if (!this.paused || this.stopped) { return false; }

	//var startAt = this.pauseTime - (this._startTime * 1000);
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
 *  @function CB_AudioFile_API.WAAPI#pause
 *  @param {function} [onPause] - Function without parameters to be called when the audio is paused successfully, being "this" the {@link CB_AudioFile_API.WAAPI} object.
 *  @param {boolean} [keepPausedUnaltered=false] - If set to true (not recommended), the {@link CB_AudioFile_API.WAAPI#paused} property will not be set to true and it will remain with its current value.
 *  @returns {boolean} It returns false if the audio is already paused or it is stopped or if it cannot be paused. Returns true otherwise.
 */
CB_AudioFile_API["WAAPI"].prototype.pause = function(onPause, keepPausedUnaltered)
{
	//If it already paused or stopped, exits the function:
	if (this.paused || this.stopped) { return false; }

	if (typeof(CB_AudioFile_API["WAAPI"].audioContext) !== "undefined" && CB_AudioFile_API["WAAPI"].audioContext !== null)
	{
		if (typeof(this.source) !== "undefined" && this.source !== null)
		{
			clearTimeout(this._timeoutWhenStop); //Prevents that the file is set as stopped or to be executed again. 
			if (!keepPausedUnaltered) { this.paused = true; }
			//Prevents error on Safari Mobile ("InvalidStateError: DOM Exception 11: An attempt was made to use an object that is not, or is no longer, usable."):
			try
			{
				this.source.stop(0);
			} catch(E) {}
			//this.pauseTime = CB_AudioFile_API["WAAPI"].audioContext.currentTime * 1000;
			this.pauseTime = (CB_AudioFile_API["WAAPI"].audioContext.currentTime - this._startTime) * 1000;
			if (typeof(onPause) === "function") { onPause.call(this); }
			return true;
		}
	}
	return false;
}


/**
 * Stops the audio.
 *  @function CB_AudioFile_API.WAAPI#stop
 *  @param {boolean} [keepStoppedUnaltered=false] - If set to true (not recommended), the {@link CB_AudioFile_API.WAAPI#stopped} property will not be set to true and it will remain with its current value.
 *  @param {boolean} [avoidOnStop=false] - If set to false and there is an "onStop" function defined (through the {@link CB_AudioFile_API.WAAPI#onStop} method), it will be called after stopping the audio (or after trying to do it, at least) but only if either the "forceOnStop" parameter is set to true or if the "keepStoppedUnaltered" parameter is set to false and the audio was not already stopped before. If set to true, the "onStop" function (if any) will not be called at all.
 *  @param {boolean} [forceOnStop=false] - If it is set to true and the "avoidOnStop" parameter is set to false and there is an "onStop" function defined (through the {@link CB_AudioFile_API.WAAPI#onStop} method), it will be called regardless the audio was stopped before or not. If set to false, the "onStop" function (if any) will only be called if the "keepStoppedUnaltered" parameter is set to false and the audio was not already stopped before. This parameter will be ignored if the "avoidOnStop" parameter is set to true.
 *  @returns {boolean} It returns false if the stopping action cannot be performed at all (this could happen when the audio has not been loaded properly, for example). Returns true otherwise (this only means that it has been tried to be stopped but it could not be successfully).
 */
CB_AudioFile_API["WAAPI"].prototype.stop = function(keepStoppedUnaltered, avoidOnStop, forceOnStop)
{
	if (typeof(this.source) !== "undefined" && this.source !== null)
	{
		///////clearTimeout(this._timeoutWhenStop); //Prevents that the file is set as stopped or to be executed again. 
		var stoppedBefore = this.stopped;
		if (!keepStoppedUnaltered) { this.stopped = true; }
		this.paused = false; //If it is stopped, it is not paused.
		//Prevents error on Safari Mobile ("InvalidStateError: DOM Exception 11: An attempt was made to use an object that is not, or is no longer, usable."):
		try
		{
			this.source.stop(0);
		} catch(E) {}
		//If we do not want to avoid onStop, it was not stopped before but it is now and onStop has a valid function assigned, we execute it:
		if (!avoidOnStop && (!stoppedBefore && this.stopped || forceOnStop) && typeof(this.onStopFunction) === "function") { this.onStopFunction.call(this); }
		return true;
	}
	return false;
}


/**
 * Sets the desired volume for the audio file (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 *  @function CB_AudioFile_API.WAAPI#setVolume
 *  @param {number} [volume={@link CB_Speaker.getVolume()} | {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME}] - Desired volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 *  @param {boolean} [forceSetVolumeProperty=false] - If set to true (not recommended), it will change the {@link CB_AudioFile_API.WAAPI#volume} property even when the volume failed to be changed.
 *  @param {function} [onSetVolume] - Callback function which will be called if it has been possible to set the volume (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile_API.WAAPI} object.
 *  @param {boolean} [saveForUnmute=false] - If set to true (not recommended), it will save internally the current volume before setting it so it will restore the same volume again after calling the {@link CB_AudioFile_API.WAAPI#unmute} method. Internal usage only recommended.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 */
CB_AudioFile_API["WAAPI"].prototype.setVolume = function(volume, forceSetVolumeProperty, onSetVolume, saveForUnmute)
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
	
	if (typeof(this.gainNode) !== "undefined" && this.gainNode !== null)
	{
		if (typeof(this.gainNode.gain.setValueAtTime) !== "undefined") { this.gainNode.gain.setValueAtTime(volume / 100, CB_AudioFile_API["WAAPI"].audioContext.currentTime); }
		else { this.gainNode.gain.value = volume / 100; } //fraction * fraction;
		if ((saveForUnmute || volume === 0) && this.volume > 0) { this.volumeBeforeMute = this.volume; } //Also saves the previous volume if the desired one is zero (muted).
		this.volume = volume;
		if (typeof(onSetVolume) === "function") { onSetVolume.call(this); }
	}

	if (forceSetVolumeProperty) { this.volume = volume; }
	
	return this.volume;
}


/**
 * Mutes the audio file.
 *  @function CB_AudioFile_API.WAAPI#mute
 *  @param {function} [onMute] - Callback function which will be called if it has been possible to mute the audio file (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile_API.WAAPI} object.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise). If all goes well, the returning value should be zero (0). Note that, even when it returns a zero (0) value, this does not always mean that the mute has been applied successfully.
 */
CB_AudioFile_API["WAAPI"].prototype.mute = function(onMute)
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
 *  @function CB_AudioFile_API.WAAPI#unmute
 *  @param {function} [onUnmute] - Callback function which will be called if it has been possible to unmute the audio file (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile_API.WAAPI} object.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 */
CB_AudioFile_API["WAAPI"].prototype.unmute = function(onUnmute)
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
 *  @function CB_AudioFile_API.WAAPI#getCurrentTime
 *  @returns {number} Returns the current time (in milliseconds). Note that some audio APIs and clients could give wrong values.
 */
CB_AudioFile_API["WAAPI"].prototype.getCurrentTime = function()
{
	var currentTime;

	if (typeof(CB_AudioFile_API["WAAPI"].audioContext) !== "undefined" && CB_AudioFile_API["WAAPI"].audioContext !== null)
	{
		if (this.stopped)
		{
			currentTime = 0;
		}
		else if (this.paused)
		{
			//currentTime = this.pauseTime - (this._startTime * 1000);
			currentTime = this.pauseTime;
		}
		else
		{
			currentTime = (CB_AudioFile_API["WAAPI"].audioContext.currentTime - this._startTime) * 1000;
		}
		
		//Maybe it is a loop:
		var duration = this.getDuration();
		if (duration > 0) //Avoids division by zero.
		{
			currentTime %= duration;
		}
	}

	if (typeof(currentTime) === "undefined" || currentTime === null || isNaN(currentTime) || currentTime < 0) { currentTime = 0; }
	
	return currentTime;
}


/**
 * Sets a function to execute when the audio file stops playing or removes it.
 *  @function CB_AudioFile_API.WAAPI#onStop
 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. No parameters will be received, being "this" the {@link CB_AudioFile_API.WAAPI} object. If a null value is used, the event will be removed.
 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
 *  @returns {boolean} Returns whether the event has been set or not (removed).
 */
CB_AudioFile_API["WAAPI"].prototype.onStop = function(callbackFunction, keepOldFunction)
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
 *  @function CB_AudioFile_API.WAAPI#getProgress
 *  @returns {number} Returns a number representing the percentage of the loading progress for the audio file (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable.
 */
CB_AudioFile_API["WAAPI"].prototype.getProgress = function()
{
	if (this.status === CB_AudioFile.LOADED || this.status === CB_AudioFile.UNCHECKED || this.status === CB_AudioFile.CHECKING) { return 100; }
	else if (this.status === CB_AudioFile.UNLOADED) { return 0; }
	
	var progress = 0;
	
	//Calculates the progress (only if it is LOADING, FAILED or ABORTED):
		//TODO: if decodeAudioData method gets a way to know its progress in the future, use that way here.

	//Progress downloading is considered as the 50% of the process (the other 50% would be te decodinng by decodeAudioData method):
	progress = this.progressDownloading / 2;
	
	return progress;
}