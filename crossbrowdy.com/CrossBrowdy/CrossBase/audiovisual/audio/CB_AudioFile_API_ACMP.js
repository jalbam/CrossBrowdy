/**
 * @file Audio files management using "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}). Contains the {@link CB_AudioFile_API.ACMP} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */
 

//Class to manage an audio file with ACMP (Apache Cordova Media Plugin):
if (typeof(CB_AudioFile_API) === "undefined") { var CB_AudioFile_API = {}; }
/**
 *  The constructor is recommended to be called through a user-driven event (as onClick, onTouch, etc.) if the "autoPlay" option is set to true, as some web clients may need this at least the first time in order to be able to play the audio.
 *  @class CB_AudioFile_API.ACMP
 *  @memberof! <global>
 *  @classdesc Class to manage an audio file using "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}). Used by the {@link CB_AudioFile} class internally and it shares most of its properties and methods. Recommended for internal usage only.
 *  @param {string} filePath - The path of the audio file or a data URI. NOTE: Only some clients with some audio APIs will support data URIs.
 *  @param {string} [audioId='CB_AUDIOFILE_ACMP_' + CB_AudioFile_API.ACMP._idUnique++] - Desired identifier for the audio object. If not provided, an automatic unique ID will be calculated. Note that it is not case sensitive and it should be unique for each object.
 *  @param {CB_AudioFile_API.ACMP.OPTIONS} [options=CB_AudioFile_API.ACMP#DEFAULT_OPTIONS] - Object with the desired options.
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been loaded successfully, being "this" the {@link CB_AudioFile_API.ACMP} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been loaded successfully. The first and unique parameter will be a string describing the error found (if could be determined), being "this" the {@link CB_AudioFile_API.ACMP} object itself.
 *  @returns {CB_AudioFile_API.ACMP} Returns a new {@link CB_AudioFile_API.ACMP} object.
 *  @todo Do not allow to create one object with an "id" which has already been used (unless the value is undefined, null...). Note that the "id" is not case sensitive and it should be unique for each object.
 */
CB_AudioFile_API["ACMP"] = function(filePath, audioId, options, callbackOk, callbackError)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_AudioFile_API["ACMP"])) { return new CB_AudioFile_API["ACMP"](filePath, audioId, options, callbackOk, callbackError); }
	
	//Constants:
	/**
	 * Keeps the default volume. If the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT} property is true, this will keep the result of calling the {@link CB_Speaker.getVolume} function. Otherwise, it will use the value of the {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME} variable.
	 *	@constant CB_AudioFile_API.ACMP#DEFAULT_VOLUME
	 *  @type {number}
	 *  @default CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME
	 */
	CB_AudioFile_API["ACMP"].prototype.DEFAULT_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME;
	
	/**
	 * Keeps the default options when an object is created. Format: { autoLoad: boolean, autoPlay: boolean, loop: boolean, volume: number }.
	 *	@constant CB_AudioFile_API.ACMP#DEFAULT_OPTIONS
	 *  @type {CB_AudioFile_API.ACMP.OPTIONS}
	 *  @default { autoLoad: true, autoPlay: false, loop: false, volume: [CB_AudioFile_API.ACMP.prototype.DEFAULT_VOLUME]{@link CB_AudioFile_API.ACMP#DEFAULT_VOLUME} }
	 */
	CB_AudioFile_API["ACMP"].prototype.DEFAULT_OPTIONS = { autoLoad: true, autoPlay: false, loop: false, volume: CB_AudioFile_API["ACMP"].prototype.DEFAULT_VOLUME };

	//Properties and variables:
	/**
	 * Tells whether the file is unloaded ({@link CB_AudioFile.UNLOADED}), loading ({@link CB_AudioFile.LOADING}), unchecked ({@link CB_AudioFile.UNCHECKED}), checking ({@link CB_AudioFile.CHECKING}), loaded ({@link CB_AudioFile.LOADED}), failed ({@link CB_AudioFile.FAILED}) or aborted ({@link CB_AudioFile.ABORTED}).
	 *	@var CB_AudioFile_API.ACMP#status
	 *  @readonly
	 *  @type {integer}
	 *  @default {@link CB_AudioFile.UNLOADED}
	 */
	this.status = CB_AudioFile.UNLOADED;

	/**
	 * Defines whether the file loops by default when the audio is played or not. Its value will be modified automatically whenever the {@link CB_AudioFile_API.ACMP#play} method is called, getting the value from the "loop" parameter (but only if contains a boolean).
	 *	@var CB_AudioFile_API.ACMP#loop
	 *  @readonly
	 *  @type {boolean}
	 *  @default [CB_AudioFile_API.ACMP.prototype.DEFAULT_OPTIONS]{@link CB_AudioFile_API.ACMP#DEFAULT_OPTIONS}.loop
	 */
	this.loop = CB_AudioFile_API["ACMP"].prototype.DEFAULT_OPTIONS.loop;

	/**
     * Stores the volume of this audio. Accepted values go from 0 to MAX_VOLUME, where MAX_VOLUME is 100 if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is false or otherwise MAX_VOLUME is the returning value of the {@link CB_Speaker.getVolume} function.
	 *	@var CB_AudioFile_API.ACMP#volume
	 *  @readonly
	 *  @type {number}
	 *  @default [CB_AudioFile_API.ACMP.prototype.DEFAULT_OPTIONS]{@link CB_AudioFile_API.ACMP#DEFAULT_OPTIONS}.volume
	 */
	this.volume = CB_AudioFile_API["ACMP"].prototype.DEFAULT_OPTIONS.volume;

	/**
     * Stores the volume of this audio before it was muted (to restore it later). Valid values go from 0 to MAX_VOLUME, where MAX_VOLUME is 100 if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is false or otherwise MAX_VOLUME is the returning value of the {@link CB_Speaker.getVolume} function.
	 *	@var CB_AudioFile_API.ACMP#volumeBeforeMute
	 *  @readonly
	 *  @type {number}
	 *  @default {@link CB_AudioFile_API.ACMP#volume}
	 */
	this.volumeBeforeMute = this.volume;

	/**
     * Stores the identifier for the audio file.
	 *	@var CB_AudioFile_API.ACMP#id
	 *  @readonly
	 *  @type {string}
	 *  @default
	 */
	this.id = "";

	/**
     * Stores the path of the audio file or the data URI. NOTE: Only some clients with some audio APIs will support data URIs.
	 *	@var CB_AudioFile_API.ACMP#filePath
	 *  @readonly
	 *  @type {string}
	 *  @default
	 */
	this.filePath = "";

	/**
     * Tells whether the audio is paused or not.
	 *	@var CB_AudioFile_API.ACMP#paused
	 *  @readonly
	 *  @type {boolean}
	 *  @default false
	 */
	this.paused = false;

	/**
     * Stores the time (in milliseconds) when the audio has been paused.
	 *	@var CB_AudioFile_API.ACMP#pauseTime
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */	
	this.pauseTime = 0;

	/**
     * Tells whether the audio is stopped or not.
	 *	@var CB_AudioFile_API.ACMP#stopped
	 *  @readonly
	 *  @type {boolean}
	 *  @default true
	 */
	this.stopped = true;

	/**
     * Function to call when the audio stops.
	 *	@var CB_AudioFile_API.ACMP#onStopFunction
	 *  @readonly
	 *  @type {function}
	 *  @default
	 */
	this.onStopFunction = undefined;

	/**
     * Stores the last "startAt" parameter value used by the {@link CB_AudioFile_API.ACMP#play} or the {@link CB_AudioFile_API.ACMP#resume} method.
	 *	@var CB_AudioFile_API.ACMP#lastStartAt
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	this.lastStartAt = null;

	/**
     * Stores the last "stopAt" parameter value used by the {@link CB_AudioFile_API.ACMP#play} or the {@link CB_AudioFile_API.ACMP#resume} method.
	 *	@var CB_AudioFile_API.ACMP#lastStopAt
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	this.lastStopAt = null;

	/**
     * Stores the [Media]{@link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media/} object of the audio, used by the "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}).
	 *	@var CB_AudioFile_API.ACMP#mediaObject
	 *  @readonly
	 *  @type {Object}
	 *  @default
	 */
	this.mediaObject = undefined;
	
	/**
     * Stores the current position (in seconds) where the audio is playing (returned by the [getCurrentPosition]{@link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media/} method), used by the "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}).
	 *	@var CB_AudioFile_API.ACMP#position
	 *  @readonly
	 *  @type {number}
	 *  @default
	 */
	this.position = 0;

	
	//Internal properties:
	this._mediaObjectSwap = null; //Media object for swapping (used for ACMP). Necessary due ACMP issues when looping a sprite near the end of the audio file.
	this._positionSwap = 0; //Keeps the current position (in seconds) for the swap object.
	this._timeoutWhenStop = null; //Keeps the timeout that is executed when the audio has finished playing (to either stop or loop).
	this._id_internal = null; //Internal id.
	this._checkDurationTimeout = null;
	this._swapChecked = false;
	this._updatePositionLoopExecuted = false;
	this._checkPlayingTimeout = null;
	this._checkPlayingFinishingTimeout = null;
	//this._recursiveCallCheckingTimeout = null;
	this._lastDuration = null;
	//this._resuming = false;
	
	
	//Calls the constructor of the object when creates an instance:
	return this._init(filePath, audioId, options, callbackOk, callbackError);
}


/**
 * Object with the options for an audio file. The format is the following one: { autoLoad: boolean, autoPlay: boolean, loop: boolean, volume: number }.
 *  @memberof CB_AudioFile_API.ACMP
 *  @typedef {Object} CB_AudioFile_API.ACMP.OPTIONS
 *  @property {boolean} [autoLoad={@link CB_AudioFile_API.ACMP#DEFAULT_OPTIONS}.autoLoad] - If set to false, it will not call the {@link CB_AudioFile_API.ACMP#load} method internally when the constructor is called (not recommended).
 *  @property {boolean} [autoPlay={@link CB_AudioFile_API.ACMP#DEFAULT_OPTIONS}.autoPlay] - Value which will be used as the "autoPlay" parameter when calling the {@link CB_AudioFile_API.ACMP#load} method internally, only when the "autoLoad" is set to true (when the constructor is called).
 *  @property {boolean} [loop={@link CB_AudioFile_API.ACMP#DEFAULT_OPTIONS}.loop] - Value that will be used for the {@link CB_AudioFile_API.ACMP#loop} property.
 *  @property {number} [volume={@link CB_AudioFile_API.ACMP#DEFAULT_OPTIONS}.volume] - The desired volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise) that will be used for the {@link CB_AudioFile_API.ACMP#volume} property.
 */


//Static properties:
CB_AudioFile_API["ACMP"]._counter = 0; //Internal counter.
CB_AudioFile_API["ACMP"]._idUnique = 0; //Counter to make the id unique.


//Constructor:
CB_AudioFile_API["ACMP"].prototype._init = function(filePath, audioId, options, callbackOk, callbackError)
{	
	//If not given, defines the default parameters:
	if (typeof(audioId) === "undefined" || audioId === null) { audioId = "CB_AUDIOFILE_ACMP_" + CB_AudioFile_API["ACMP"]._idUnique++; } //Uses the file path as default id.
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
	if (typeof(this._id_internal) === "undefined" || this._id_internal === null) { this._id_internal = CB_AudioFile_API["ACMP"]._counter++; }
	
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
 * Destroys the audio file object and frees memory. Sets its current {@link CB_AudioFile_API.ACMP#status} property to ABORTED ({@link CB_AudioFile.ABORTED} value).
 *  @function CB_AudioFile_API.ACMP#destructor
 *  @param {boolean} [stopSound=false] - If set to true, it will also call the {@link CB_AudioFile_API.ACMP#stop} method.
 *  @param {boolean} [keepStoppedUnaltered=false] - Used internally as the "keepStoppedUnaltered" parameter to call the {@link CB_AudioFile_API.ACMP#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 *  @param {boolean} [avoidOnStop=false] - Used internally as the "avoidOnStop" parameter to call the {@link CB_AudioFile_API.ACMP#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 *  @param {boolean} [forceOnStop=false] - Used internally as the "forceOnStop" parameter to call the {@link CB_AudioFile_API.ACMP#stop} method. If the "stopSound" parameter is not set to true, this parameter will be ignored as the "stop" method will not be called.
 */
CB_AudioFile_API["ACMP"].prototype.destructor = function(stopSound, keepStoppedUnaltered, avoidOnStop, forceOnStop)
{
	try
	{
		if (typeof(this._mediaObjectSwap) !== "undefined" && this._mediaObjectSwap !== null)
		{
			this._mediaObjectSwap.release();
			CB_Elements.remove(this.mediaObject);
		}
	} catch (e)	{}

	this._lastDuration = null;
	if (typeof(this.mediaObject) === "undefined" || this.mediaObject === null) { this.status = CB_AudioFile.ABORTED; return; }
	if (stopSound) { this.stop(keepStoppedUnaltered, avoidOnStop, forceOnStop); }
	
	try
	{
		this.mediaObject.release();
		CB_Elements.remove(this.mediaObject);
	} catch (e) {}
	
	this.status = CB_AudioFile.ABORTED;
}


/**
 * Loads the desired audio file with the desired options. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some web clients may need this at least the first time in order to be able to play the audio. This method will be called automatically by the constructor if the "autoLoad" option was set to true in its given "options" parameter.
 * When this method is called, if the {@link CB_AudioFile_API.ACMP#status} property already has the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant) and the "forceReload" parameter is not set to true, it will exit calling the given "callbackOk" function (if any) immediately. Otherwise, regardless the status, the status will be set to "LOADING" (defined in the {@link CB_AudioFile.LOADING} constant). After it, it will reach the "UNCHECKED" (defined in the {@link CB_AudioFile.UNCHECKED} constant). If the "autoPlay" parameter is not set to true, this will be the final status (and it will be necessary to call the {@link CB_AudioFile_API.ACMP#checkPlaying} method after it). After it and only if the "autoPlay" is set to true, as the {@link CB_AudioFile_API.ACMP#checkPlaying} method will be called internally, it will have the "CHECKING" status (defined in the {@link CB_AudioFile.CHECKING} constant) and finally the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant) if all goes well.
 *  @function CB_AudioFile_API.ACMP#load
 *  @param {string} [filePath={@link CB_AudioFile_API.ACMP#filePath}] - The path of the audio file or a data URI. NOTE: Only some clients with some audio APIs will support data URIs.
 *  @param {string} [autoPlay=false] - If set to true, it will start playing the audio automatically (by calling the {@link CB_AudioFile_API.ACMP#play} method internally). If set to true and the {@link CB_AudioFile_API.ACMP#status} property reaches to the "UNCHECKED" status (defined in the {@link CB_AudioFile.UNCHECKED} constant), it will also call internally the {@link CB_AudioFile_API.ACMP#checkPlaying} method.
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been loaded successfully, being "this" the {@link CB_AudioFile_API.ACMP} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been loaded successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.ACMP} object itself.
 *  @param {boolean} [forceReload=false] - If set to false, the "filePath" has not been changed from the previously used and the {@link CB_AudioFile_API.ACMP#status} property belongs to the "LOADED" status (defined in the {@link CB_AudioFile.LOADED} constant), it will exit the method without loading the audio file again (calling the "callbackOk" function, if any).
 *  @returns {CB_AudioFile_API.ACMP|null} Returns the audio API object (if it was possible to create) or null otherwise.
 */
CB_AudioFile_API["ACMP"].prototype.load = function(filePath, autoPlay, callbackOk, callbackError, forceReload)
{
	clearTimeout(this._checkDurationTimeout);
	clearTimeout(this._checkPlayingTimeout);
	clearTimeout(this._checkPlayingFinishingTimeout);
	
	filePath = filePath || this.filePath;
	
	//If the status is LOADED and the file path give is the same as the current one, just exits:
	if (!forceReload && this.status === CB_AudioFile.LOADED && this.filePath === filePath)
	{
		if (typeof(callbackOk) === "function") { callbackOk.call(this); }
		return this;
	}

	//Destroys previous object (if any):
	this.destructor(true, false, true); //Also stops the sound (if any) and prevents firing onStop.

	this.status = CB_AudioFile.LOADING; //The file is loading.
	this.filePath = filePath;

	var that = this;
	
	var anyCallbackFunctionCalled = false;

	this._swapChecked = false;
	this.position = this._positionSwap = 0;
	
	var callbackFunctionError =
		function(error)
		{
			if (that.status === CB_AudioFile.ABORTED) { return; } //If it is has been aborted, we exit.
		
			//If the success function has been called already (sound is loaded), ignores the fail:
			if (anyCallbackFunctionCalled) { return; }
			anyCallbackFunctionCalled = true;
			that.status = CB_AudioFile.FAILED; //File failed to load.
			autoPlay = false;
			//var fileName = filePath;
			if (filePath.substring(0, 5).toLowerCase() === "data:") { filePath = filePath.substring(0, 15) + "[...]" + filePath.substring(filePath.length - 2); }
			if (!CB_isString(error) && typeof(error) !== "undefined" && (typeof(error.message) !== "undefined" || typeof(error.code) !== "undefined"))
			{
				error = "Error for " + filePath + " file: " + error.message + " [code: " + error.code + "]";
			}
			else
			{
				error = "Error for " + filePath + " file: " + error;
			}
			
			try
			{
				if (typeof(that.mediaObject) !== "undefined" && that.mediaObject !== null) { that.mediaObject.release(); }
				if (typeof(that._mediaObjectSwap) !== "undefined" && that._mediaObjectSwap !== null) { that._mediaObjectSwap.release(); }
			} catch (e) {}
			
			if (typeof(callbackError) === "function") { callbackError.call(that, error); } //Calls the Error function back.
		};
	
	try
	{
		var timesChecked = 0;
		var callbackFunctionSuccess =
			function()
			{
				if (that.status === CB_AudioFile.ABORTED) { return; } //If it is has been aborted, we exit.
			
				//If the success function has been called already (sound is loaded), exits:
				if (anyCallbackFunctionCalled) { return; }
			
				//Success callback is called all the time the file plays successfully in ACMP, so we need to call callbackOk just once:
				if (that.status !== CB_AudioFile.LOADED)
				{
					//Checks for the duration and fails after some attempts:
					if (that.getDuration() === 0)
					{
						if (++timesChecked < 1000) { that._checkDurationTimeout = setTimeout(callbackFunctionSuccess, 1); }
						else { callbackFunctionError("Duration is zero"); }
						return;
					}
				
					anyCallbackFunctionCalled = true;
					
					//Function to execute when all is OK:
					var allIsFine =
						function()
						{
							if (that.status === CB_AudioFile.ABORTED) { return; } //If it is has been aborted, we exit.
							
							//Restores the volume:
							that.setVolume(previousVolume);

							var checkSwapFinished =
								function()
								{
									if (typeof(callbackOk) === "function") { callbackOk.call(that); } //Calls the OK function back.

									//Plays automatically if we want to:
									if (autoPlay) { that.play(); }
								};

							//Function that checks swap object:
							var checkSwapObject =
								function()
								{
									//If the swap object has been created successfully:
									if (that._mediaObjectSwap !== null && !that._swapChecked)
									{
										var updatePositionSwap =
											function()
											{
												var callAgain = true;
												if (!that._swapChecked && typeof(that._mediaObjectSwap) !== "undefined" && that._mediaObjectSwap !== null)
												{
													that._mediaObjectSwap.getCurrentPosition
													(
														function(positionSwap)
														{
															that._positionSwap = positionSwap;
															if (isNaN(that._positionSwap) || that._positionSwap < 0) { that._positionSwap = 0; }
														}
													);
													setTimeout(updatePositionSwap, 1);
												}
												else { that._positionSwap = 0; }
											};
										updatePositionSwap();
										that.checkPlaying(checkSwapFinished, function() { that._mediaObjectSwap = null; checkSwapFinished(); }, false, false, false, true);
									}
								};
								
							//Creates the second mediaObject for swapping:
							var swapFunctionCalled = false;
							that._mediaObjectSwap =
								new Media
								(
									filePath,
									function()
									{
										if (swapFunctionCalled) { return; }
										swapFunctionCalled = true;
										
										//Checks the swap object:
										checkSwapObject();
									},
									function()
									{
										if (swapFunctionCalled) { return; }
										swapFunctionCalled = true;
										try
										{
											if (typeof(that._mediaObjectSwap) !== "undefined" && that._mediaObjectSwap !== null) { that._mediaObjectSwap.release(); }
										} catch (e) {}
										that._mediaObjectSwap = null;
									}
								);
							that._mediaObjectSwap.play(); //Needs to be played to fire events.
							that._mediaObjectSwap.stop();
						};
					
					that.status = CB_AudioFile.UNCHECKED; //The file is still unchecked.
					
					//If we want to play automatically, checks if the currentTime changes (some web clients cannot play if the user did not fire an event to call the play function):
					if (autoPlay)
					{
						that.checkPlaying(function() { allIsFine(); }, function(error) { callbackFunctionError(error, true); }, false, false, false);
					}
					else { allIsFine(); }
				}
			};
		if (typeof(Media) === "undefined")
		{
			callbackFunctionError("Apache Cordova Media plugin not found");
			return null;
		}
									
		this.mediaObject = new Media(filePath, callbackFunctionSuccess, callbackFunctionError);
		
		var previousVolume = this.volume;
		if (CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING)
		{
			this.setVolume(0);
		}
		
		//Media object needs to be played to fire events, so we call play method and stop it immediately:
		this.mediaObject.play();
		//this.mediaObject.seekTo(0);
		this.mediaObject.stop();
		
		//Starts the interval that will update the position all the time:
		if (!this._updatePositionLoopExecuted)
		{
			this._updatePositionLoopExecuted = true;
			var updatePosition =
				function()
				{
					if (typeof(that.mediaObject) !== "undefined" && that.mediaObject !== null)
					{
						that.mediaObject.getCurrentPosition
						(
							function(position)
							{
								that.position = position;
								if (isNaN(that.position) || that.position < 0) { that.position = 0; }
							}
						);
					}
					else { that.position = 0; }
					setTimeout(updatePosition, 1);
				};
			updatePosition();
		}
	}
	catch (e)
	{
		callbackFunctionError(e);
		return null;
	}
	
	return this;
}


/**
 * Checks whether the audio can be played or not. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some web clients may need this at least the first time in order to be able to play the audio. Also recommended to use before calling the {@link CB_AudioFile_API.ACMP#play} method the first time. The checking action will only be performed if the value of the {@link CB_AudioFile_API.ACMP#status} property belongs to the {@link CB_AudioFile.UNCHECKED} or to the {@link CB_AudioFile.CHECKING} value. After checking, if the audio can be played, the {@link CB_AudioFile_API.ACMP#status} of the object will get the value of {@link CB_AudioFile.LOADED}. Otherwise, if it cannot be played, the {@link CB_AudioFile_API.ACMP#status} property will get the value of {CB_AudioFile.FAILED}.
 *  @function CB_AudioFile_API.ACMP#checkPlaying
 *  @param {function} [callbackOk] - Function with no parameters to be called when the audio has been checked successfully, being "this" the {@link CB_AudioFile_API.ACMP} object itself.
 *  @param {function} [callbackError] - Function to be called if the audio has not been checked successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.ACMP} object itself.
 *  @param {boolean} [ignoreStatus=false] - If set to false and the {@link CB_AudioFile_API.ACMP#status} property does not belong neither to the "UNCHECKED" status (defined in the {@link CB_AudioFile.UNCHECKED} constant) nor to the "CHECKING" status (defined in the {@link CB_AudioFile.CHECKING} constant), it will fail calling the "callbackError" function (if any). If set to true, it will try to perform the checking action regardless the status of the audio.
 *  @param {boolean} [ignoreQueue=false] - This parameter will be ignored in this audio API.
 *  @param {boolean} [useCache=false] - This parameter will be ignored in this audio API.
 *  @param {boolean} [isSwapObject=false] - Defines whether the [Media]{@link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media/} object to check is a swap object or the normal one (a swap object is stored internally as it is necessary due ACMP issues when looping a sprite near the end of the audio file). Internal usage only recommended.
 *  @returns {boolean} Returns false if the checking could not be performed and failed. If it returns true, it can mean either the checking has been processed successfully or it will fail in the future, so it is recommended to ignore the returning value and use the callback functions instead.
 */
CB_AudioFile_API["ACMP"].prototype.checkPlaying = function(callbackOk, callbackError, ignoreStatus, ignoreQueue, useCache, isSwapObject)
{
	/////clearTimeout(this._recursiveCallCheckingTimeout);
	
	if (!ignoreStatus && this.status !== CB_AudioFile.UNCHECKED && this.status !== CB_AudioFile.CHECKING)
	{
		if (typeof(callbackError) === "function") { callbackError.call(this, "cannot check if status is not unchecked or checking (status is " + this.status + ")"); }
		return false;
	}
	
	var that = this;
	
	var mediaObject = this.mediaObject;
	if (isSwapObject)
	{
		mediaObject = this._mediaObjectSwap;
	}
	else
	{
		this.status = CB_AudioFile.CHECKING;	
	}
	
	var previousVolume = this.volume;
	var finishedChecking =
		function(ok, error, keepStatus)
		{
			if (isSwapObject) { that._swapChecked = true; }
		
			//Stops the file:
			mediaObject.pause();
			
			//Restores the volume:
			that._checkPlayingFinishingTimeout = //Timeout to prevent hearing the sound in some web clients.
				setTimeout
				(
					function()
					{
						that.setVolume(previousVolume, false, null, false, isSwapObject ? that._mediaObjectSwap : null);
						
						//If the file is ok:
						if (ok)
						{
							if (!keepStatus && !isSwapObject) { that.status = CB_AudioFile.LOADED; }
							if (typeof(callbackOk) === "function") { callbackOk.call(that); }
						} 
						//...otherwise, if the file has failed:
						else
						{
							if (!keepStatus && !isSwapObject) { that.status = CB_AudioFile.FAILED; }
							if (typeof(callbackError) === "function") { callbackError.call(that, error); }
						}
					},
					10
				);
		};
	
	try
	{
		//Plays the sound during some time to let some web clients get the duration correctly (strange bug):
		if (CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING)
		{
			this.setVolume(0, false, null, false, isSwapObject ? this._mediaObjectSwap : null);
		}
		
		mediaObject.play();

		var durationDetected = this.getDuration(isSwapObject ? this._mediaObjectSwap : null);
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
					if (!isSwapObject) { that.status = CB_AudioFile.CHECKING; }
					
					//If the duration has changed, it calls the function again because it means the audio is still loading (otherwise, Firefox has issues with data URIs and detects a shorter duration):
					var durationDetectedNow = that.getDuration(isSwapObject ? that._mediaObjectSwap : null);
					if (durationDetected !== durationDetectedNow)
					{
						durationDetected = durationDetectedNow;
						that._checkPlayingTimeout = setTimeout(function() { checkFunction(callbackOk, callbackError); }, CB_Configuration[CB_BASE_NAME].CB_AudioFile_AUTOPLAY_SILENTLY_ON_LOAD_MS);
						return;
					}
					
					//If the current time is still 0:
					if (!isSwapObject && that.position == 0 || isSwapObject && that._positionSwap == 0)
					{
						//We give it some opportunities more to change current time:
						if (timesCurrentTimeChecked < 100)
						{
							timesCurrentTimeChecked++;
							if (timesCurrentTimeChecked % 20 === 0)
							{
								mediaObject.pause();
								mediaObject.play();
								try { mediaObject.seekTo(0); } catch (e) {} //Executed after play method because otherwise Intel XDK emulator and Android WebView kit does not perform seekTo.
							}
							that._checkPlayingTimeout = setTimeout(function() { checkFunction(callbackOk, callbackError); }, 1);
							return;
						}
						//...if all opportunities failed, we declare it as FAILED and exits:
						else
						{
							finishedChecking(false, "position does not change (it is " + (isSwapObject ? that._positionSwap : that.position) + ").");
							return;
						}
					}

					//Only updates the currentTime to 0 if it is not zero already (because otherwise some web clients will fail or have a wrong behaviour):
					if (!isSwapObject && that.position != 0 || isSwapObject && that._positionSwap != 0) { mediaObject.seekTo(0); }
					
					//If the duration is zero, we declare it as FAILED and exits:
					if (that.getDuration(isSwapObject ? that._mediaObjectSwap : null) === 0)
					{
						finishedChecking(false, "Duration is zero");
						return;
					}
					
					finishedChecking(true);
				}
				catch (e)
				{
					finishedChecking(false, e);
				}
			};
		checkFunction(callbackOk, callbackError);
		return true;
	}
	catch (e)
	{
		finishedChecking(false, e);
		return false;
	}
}


/**
 * Tells the duration of the audio (in milliseconds). Note that some clients might not calculate the duration correctly and, in this case, a zero (0) value would be returned.
 *  @function CB_AudioFile_API.ACMP#getDuration
 *  @param {Object} [mediaObject={@link CB_AudioFile_API.ACMP#mediaObject}] - [Media]{@link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media/} object whose audio duration we want to check. Used internally to check either normal or swap [Media]{@link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media/} object (a swap object is stored internally as it is necessary due ACMP issues when looping a sprite near the end of the audio file). Internal usage only recommended.
 *  @returns {number} Returns the duration of the audio (in milliseconds). Note that some clients might not calculate the duration correctly and, in this case, a zero (0) value would be returned.
 */
CB_AudioFile_API["ACMP"].prototype.getDuration = function(mediaObject)
{
	var duration;
	
	if (typeof(mediaObject) === "undefined" || mediaObject === null) { mediaObject = this.mediaObject; }
	
	if (typeof(mediaObject) !== "undefined" && mediaObject !== null && typeof(mediaObject.getDuration) !== "undefined" && mediaObject.getDuration !== null)
	{
		duration = mediaObject.getDuration() * 1000;
	}
	
	if (typeof(duration) === "undefined" || duration === null || isNaN(duration) || duration < 0) { duration = 0; }
	
	return duration;
}


/**
 * Plays the audio.
 *  @function CB_AudioFile_API.ACMP#play
 *  @param {number} [startAt=0 | {@link CB_AudioFile_API.ACMP#lastStartAt} | stopAt] - Time in milliseconds where we want the audio to start at. If not provided or it is not a valid number, it will use zero (0) as default which belongs to the beginning of the audio. If the value provided is greater than the "stopAt" provided, it will use the value set in the {@link CB_AudioFile_API.ACMP#lastStartAt} property (which belongs to the "startAt" value the last time that this method was called). If, even using the {@link CB_AudioFile_API.ACMP#lastStartAt} value is still greather than the "stopAt" provided, it will use the same value as the "stopAt" which means it will not play and will stop immediately.
 *  @param {number} [stopAt={@link CB_AudioFile_API.ACMP#getDuration}()] - Time in milliseconds where we want the audio to stop at. If not provided or it is not a valid number, it will use the returning value of the {@link CB_AudioFile_API.ACMP#getDuration} method (which should belong to the total duration of the audio, if it was calculated correctly).
 *  @param {boolean} [loop={@link CB_AudioFile_API.ACMP#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Note that at the end of each loop the "onStop" function defined (through the {@link CB_AudioFile_API.ACMP#onStop} method) will not be called.
 *  @param {boolean} [avoidDelayedPlay=false] - If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay). Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the "stop" method will be called immediately.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all and the {@link CB_AudioFile_API.ACMP#stop} method will be called immediately. Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed).
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile_API.ACMP} object. If the audio is looping, this will be called only once when the audio starts playing the first time and it will not be called next loops.
 *  @param {function} [onLoadError] - Function to be called if the audio cannot be played successfully. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.ACMP} object.
 *  @param {boolean} [isResume=false] - If set to true (not recommended) and it is a looping audio, the next loop will use the value of the {@link CB_AudioFile_API.ACMP#lastStartAt} property as the "startAt" parameter when it calls this method again automatically (internally). Recommended for internal usage only.
 *  @param {boolean} [isLooping=false] - Used to determine whether this method was called automatically again by itself because it is looping the audio. Recommended for internal usage only.
 *  @param {integer} [startPlayingTime] - Contains the time when the audio should start playing. Recommended for internal usage only.
 *  @returns {boolean|integer} It returns false if the duration is 0 ("startAt" and "stopAt" are the same number), returns "-1" if the audio cannot be played and an error is detected or returns true otherwise. Note that even when it returns true there can be a non-detectable error and maybe the audio is not played.
 */
CB_AudioFile_API["ACMP"].prototype.play = function(startAt, stopAt, loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, isResume, isLooping, startPlayingTime)
{
	var that = this;
	
	var duration = this.getDuration();
	
	if (typeof(startPlayingTime) === "undefined" || startPlayingTime === null) { startPlayingTime = Date.now(); }
	
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
					var timeNow = Date.now();
					
					//If the time expired is less or equal to the delay allowed:
					if (timeNow - startPlayingTime <= allowedRecursiveDelay)
					{
						//Calls play method again:
						that.play(startAt, stopAt, loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, isResume, isLooping, startPlayingTime);
					}
					//...otherwise, just stops the sound:
					//////else { that.stop(false, false); } //Sets as stopped and fires onStop function (if any).
					else { that.stop(false, false, true); } //Sets as stopped and fires onStop function (if any).
				};

			//Function to execute when the sound loads successfully:
			var onLoad =
				function()
				{
					//If we allow delayed play, plays the sound:
					if (!avoidDelayedPlay) { playLaterFunction(); }
					//...otherwise, just stops the sound (to fire onStop function):
					///////else { that.stop(false, false); } //Sets as stopped and fires onStop function (if any).
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
				///////else { this.stop(false, false); } //Sets as stopped and fires onStop function (if any).
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
	var whenStopFunction =
		function()
		{
			//Removes the event and timeout:
			clearTimeout(that._timeoutWhenStop); //Clears the previous timeout.

			//If the sound has been stopped or paused or the stop time has changed, exits:
			if (that.stopped || that.paused || that.lastStopAt !== stopAt) { return; }
			//...otherwise, if the stop time has not been reached yet, calls the function again after a while:
			//else if (that.getCurrentTime() < stopAt) { setTimeout(whenStopFunction, 1); return; }
			
			//If we want to loop, loops again:
			if (that.loop)
			{
				if (that._mediaObjectSwap !== null && that._swapChecked)
				{
					var temp = that.mediaObject; 
					that.stop(true, true);
					that.mediaObject = that._mediaObjectSwap;
					that._mediaObjectSwap = temp;
				}
			
				//that.stop(true); //Stops the sound without setting its property as stopped.
				that.play(startAtNextLoop, stopAt, true, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError, false, true); //Plays again the sound.
			}
			//...otherwise, if we don't want to loop, we stop:
			else { that.stop(); }
		};

	//Clears the previous timeout (if any):
	clearTimeout(this._timeoutWhenStop);
	
	//If it is looping or does not allow overlapping and it is not paused, stops the possible previous sound:
	//if (isLooping || !allowOverlapping && !this.paused) { this.stop(true); } //Stops the sound without setting its property as stopped.
	//if (isLooping || !allowOverlapping) { this.stop(true); } //Stops the sound without setting its property as stopped.
	//Stop because otherwise Android with WebView takes long time to perform play again if stopAt is near the total duration (so next loop would take long time to start):
	this.stop(true, true); //Stops the sound without setting its property as stopped.
	
	//If defined, starts at the given position (ms):
	////this.mediaObject.seekTo(startAt);

	//Applies the current volume:
	this.setVolume(this.volume);

	//If it is not a loop (it is the first call to the play method) or we do not want to loop:
	if (!isLooping || !loop) { CB_symmetricCallClear("ACMP_AUDIO_FILE" + this._id_internal); } //We clean the cache of setTimeoutSynchronized for the loop function.
	
	//Plays the file:
	//this.mediaObject.play({ numberOfLoops: 9999999999 }); //We will use our own way to loop, so we don't need the normal way.
	this.mediaObject.play(); //We will use our own way to loop, so we don't need the normal way.

	this.mediaObject.seekTo(startAt); //Executed after play method because otherwise Intel XDK emulator and Android WebView kit does not perform seekTo.
	
	//Sets the event and timeout for when the sound finishes:
	var msToFinish = stopAt - startAt;
	this._timeoutWhenStop = CB_symmetricCall(whenStopFunction, msToFinish, "ACMP_AUDIO_FILE" + this._id_internal);
	
	//The sound is neither paused nor stopped:
	this.paused = this.stopped = false;
	
	//If it is the first time (not a loop) and there is a function to call when the play starts, we call it:
	if (!isLooping && typeof(onPlayStart) === "function") { onPlayStart.call(this, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime); onPlayStart = null; } //Prevents execution again.
	
	return true;
}


/**
 * Resumes the audio (after being paused), starting from the same point it was paused previously.
 *  @function CB_AudioFile_API.ACMP#resume
 *  @param {boolean} [loop={@link CB_AudioFile_API.ACMP#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Note that at the end of each loop the "onStop" function defined (through the {@link CB_AudioFile_API.ACMP#onStop} method) will not be called.
 *  @param {boolean} [avoidDelayedPlay=false] - If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay). Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the {@link CB_AudioFile_API.ACMP#stop} method will be called immediately.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all and the {@link CB_AudioFile_API.ACMP#stop} method will be called immediately. Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed).
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile_API.ACMP} object. If the audio is looping, this will be called only once when the audio starts playing the first time and it will not be called next loops.
 *  @param {function} [onLoadError] - Function to be called if the audio cannot be played successfully. It will not be called if the audio is not paused or is stopped. The first and unique parameter will be a string describing the error found (if it could be determined), being "this" the {@link CB_AudioFile_API.ACMP} object.
 *  @returns {boolean|integer} Returns the returning value of the {@link CB_AudioFile_API.ACMP#play} method which is called internally. It returns false if the audio is not paused or it is stopped, returns "-1" if the audio cannot be played and an error is detected or returns true otherwise. Note that even when it returns true there can be a non-detectable error and maybe the audio is not played.
 */
CB_AudioFile_API["ACMP"].prototype.resume = function(loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onLoadError)
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
 *  @function CB_AudioFile_API.ACMP#pause
 *  @param {function} [onPause] - Function without parameters to be called when the audio is paused successfully, being "this" the {@link CB_AudioFile_API.ACMP} object.
 *  @param {boolean} [keepPausedUnaltered=false] - If set to true (not recommended), the {@link CB_AudioFile_API.ACMP#paused} property will not be set to true and it will remain with its current value.
 *  @returns {boolean} It returns false if the audio is already paused or it is stopped or if it cannot be paused. Returns true otherwise.
 */
CB_AudioFile_API["ACMP"].prototype.pause = function(onPause, keepPausedUnaltered)
{
	//If it already paused or stopped, exits the function:
	if (this.paused || this.stopped) { return false; }

	//this._resuming = false;
	
	if (typeof(this.mediaObject) !== "undefined" && this.mediaObject !== null)
	{
		clearTimeout(this._timeoutWhenStop); //Prevents that the file is set as stopped or to be executed again. 
		this.mediaObject.pause();
		this.pauseTime = this.getCurrentTime();
		if (!keepPausedUnaltered) { this.paused = true; }
		if (typeof(onPause) === "function") { onPause.call(this); }
		return true;
	}
	
	return false;
}


/**
 * Stops the audio.
 *  @function CB_AudioFile_API.ACMP#stop
 *  @param {boolean} [keepStoppedUnaltered=false] - If set to true (not recommended), the {@link CB_AudioFile_API.ACMP#stopped} property will not be set to true and it will remain with its current value.
 *  @param {boolean} [avoidOnStop=false] - If set to false and there is an "onStop" function defined (through the {@link CB_AudioFile_API.ACMP#onStop} method), it will be called after stopping the audio (or after trying to do it, at least) but only if either the "forceOnStop" parameter is set to true or if the "keepStoppedUnaltered" parameter is set to false and the audio was not already stopped before. If set to true, the "onStop" function (if any) will not be called at all.
 *  @param {boolean} [forceOnStop=false] - If it is set to true and the "avoidOnStop" parameter is set to false and there is an "onStop" function defined (through the {@link CB_AudioFile_API.ACMP#onStop} method), it will be called regardless the audio was stopped before or not. If set to false, the "onStop" function (if any) will only be called if the "keepStoppedUnaltered" parameter is set to false and the audio was not already stopped before. This parameter will be ignored if the "avoidOnStop" parameter is set to true.
 *  @returns {boolean} It returns false if the stopping action cannot be performed at all (this could happen when the audio has not been loaded properly, for example). Returns true otherwise (this only means that it has been tried to be stopped but it could not be successfully).
 */
CB_AudioFile_API["ACMP"].prototype.stop = function(keepStoppedUnaltered, avoidOnStop, forceOnStop)
{
	if (typeof(this.mediaObject) !== "undefined" && this.mediaObject !== null)
	{
		///////clearTimeout(this._timeoutWhenStop); //Prevents that the file is set as stopped or to be executed again. 
		this.mediaObject.seekTo(0);
		this.mediaObject.stop();
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
 *  @function CB_AudioFile_API.ACMP#setVolume
 *  @param {number} [volume={@link CB_Speaker.getVolume()} | {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME}] - Desired volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 *  @param {boolean} [forceSetVolumeProperty=false] - If set to true (not recommended), it will change the {@link CB_AudioFile_API.ACMP#volume} property even when the volume failed to be changed.
 *  @param {function} [onSetVolume] - Callback function which will be called if it has been possible to set the volume (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile_API.ACMP} object.
 *  @param {boolean} [saveForUnmute=false] - If set to true (not recommended), it will save internally the current volume before setting it so it will restore the same volume again after calling the {@link CB_AudioFile_API.ACMP#unmute} method. Internal usage only recommended.
 *  @param {Object} [mediaObject={@link CB_AudioFile_API.ACMP#mediaObject}] - [Media]{@link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media/} object whose volume we want to set. Used internally to affect either normal or swap [Media]{@link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media/} object (a swap object is stored internally as it is necessary due ACMP issues when looping a sprite near the end of the audio file). Internal usage only recommended.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 */
CB_AudioFile_API["ACMP"].prototype.setVolume = function(volume, forceSetVolumeProperty, onSetVolume, saveForUnmute, mediaObject)
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
	
	var originalObject = false;
	if (typeof(mediaObject) === "undefined" || mediaObject === null) { mediaObject = this.mediaObject; originalObject = true; }
	
	if (typeof(mediaObject) !== "undefined" && mediaObject !== null)
	{
		mediaObject.setVolume(volume / 100);
		if (originalObject)
		{
			if (saveForUnmute) { this.volumeBeforeMute = this.volume; }
			this.volume = volume;
			if (typeof(onSetVolume) === "function") { onSetVolume.call(this); }
		}
	}
	
	if (forceSetVolumeProperty) { this.volume = volume; }
	
	return this.volume;
}


/**
 * Mutes the audio file.
 *  @function CB_AudioFile_API.ACMP#mute
 *  @param {function} [onMute] - Callback function which will be called if it has been possible to mute the audio file (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile_API.ACMP} object.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise). If all goes well, the returning value should be zero (0). Note that, even when it returns a zero (0) value, this does not always mean that the mute has been applied successfully.
 */
CB_AudioFile_API["ACMP"].prototype.mute = function(onMute)
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
 *  @function CB_AudioFile_API.ACMP#unmute
 *  @param {function} [onUnmute] - Callback function which will be called if it has been possible to unmute the audio file (or at least it was possible to try it). It will not receive any parameters, being "this" the {@link CB_AudioFile_API.ACMP} object.
 *  @returns {number} Returns the current volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise).
 */
CB_AudioFile_API["ACMP"].prototype.unmute = function(onUnmute)
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
 *  @function CB_AudioFile_API.ACMP#getCurrentTime
 *  @returns {number} Returns the current time (in milliseconds). Note that some audio APIs and clients could give wrong values.
 */
CB_AudioFile_API["ACMP"].prototype.getCurrentTime = function()
{
	var currentTime;

	/*
	if (typeof(this.mediaObject) !== "undefined" && this.mediaObject !== null)
	{
		currentTime = this.mediaObject.position * 1000;
	}
	*/
	currentTime = this.position * 1000;

	if (typeof(currentTime) === "undefined" || currentTime === null || isNaN(currentTime) || currentTime < 0) { currentTime = 0; }
	
	return currentTime;
}


/**
 * Sets a function to execute when the audio file stops playing or removes it.
 *  @function CB_AudioFile_API.ACMP#onStop
 *  @param {function|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. No parameters will be received, being "this" the {@link CB_AudioFile_API.ACMP} object. If a null value is used, the event will be removed.
 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener or not.
 *  @returns {boolean} Returns whether the event has been set or not (removed).
 */
CB_AudioFile_API["ACMP"].prototype.onStop = function(callbackFunction, keepOldFunction)
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
 *  @function CB_AudioFile_API.ACMP#getProgress
 *  @returns {number} Returns a number representing the percentage of the loading progress for the audio file (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable.
 */
CB_AudioFile_API["ACMP"].prototype.getProgress = function()
{
	if (this.status === CB_AudioFile.LOADED || this.status === CB_AudioFile.UNCHECKED || this.status === CB_AudioFile.CHECKING) { return 100; }
	else if (this.status === CB_AudioFile.UNLOADED) { return 0; }
	
	var progress = 0;
	
	//Calculates the progress (only if it is LOADING, FAILED or ABORTED):
		//TODO: use onProgress method from Apache Cordova Media Plugin when it is finally available (it is not usable yet).
		
	
	return progress;
}