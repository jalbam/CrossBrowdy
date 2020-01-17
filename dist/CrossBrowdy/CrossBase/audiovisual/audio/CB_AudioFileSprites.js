/**
 * @file Audio sprites management. Contains the {@link CB_AudioFileSprites} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */


/**
 * An object representing an audio sprite which can contain, optionally, the "startAt" and "stopAt" properties with a numeric value (representing when the audio sprite starts and when it stops, respectively). If not set, the default "startAt" value will be 0 (zero) and the default "stopAt" value will be null (which means it will not stop until the end of the audio is reached unless it is paused or stopped before). The "fake" property should never be used as it is used internally to distinguish real sprites from fake ones (generated and returned by the {@link CB_AudioFileSprites#getSprite} method when a requested sprite is not found).
 * @example { startAt: 10, stopAt: 20 }
 *  @memberof CB_AudioFileSprites
 *  @typedef {Object} CB_AudioFileSprites.SPRITE_OBJECT
 *  @property {number} [startAt=0] - The time (in milliseconds) of the audio file where the audio sprite starts. If not provided, it will use the value of 0 (zero) which means that it will start from the beginning.
 *  @property {number} [stopAt={@link CB_AudioFile_API.WAAPI#getDuration}() | {@link CB_AudioFile_API.SM2#getDuration}() | {@link CB_AudioFile_API.ACMP#getDuration}() | {@link CB_AudioFile_API.AAPI#getDuration}()] - The time (in milliseconds) of the audio file where the audio sprite stops. If not provided (not recommended), it will use the whole duration of the file (which means until it reaches its end). NOTE: Due to some possible problems between clients with different audio APIs calculating the duration of an audio file, it is recommended to always set the "stopAt" property even when we want it to stop at the end of the audio.
 */

 
/**
 * Object whose property names the identifiers of each sprite (a case-sensitive string) and their value is a {@link CB_AudioFileSprites.SPRITE_OBJECT} object.
 * @example
 * {
 *	"whole_audio" : {},
 *	"first_sprite" : { stopAt: 10 },
 *	"second_sprite" : { startAt: 10, stopAt: 20 },
 *	"third_sprite" : { startAt: 20 },
 *	...
 * }
 *  @memberof CB_AudioFileSprites
 *  @typedef {Object} CB_AudioFileSprites.SPRITES_OBJECT
 *  @property {CB_AudioFileSprites.SPRITE_OBJECT} spriteInformation - Being the name of each property the identifier of a sprite (a string which cannot be "_WITHOUT_SPRITE_ASSOCIATED" as it is a reserved name), the value will always be a {@link CB_AudioFileSprites.SPRITE_OBJECT} object.
 */


/**
 * Object with the desired data and options for the audio sprites. It is almost identical to the {@link CB_AudioFileCache.DATA_OBJECT} but adding a "sprites" property.
 *  @memberof CB_AudioFileSprites
 *  @typedef {Object} CB_AudioFileSprites.DATA_OBJECT
 *  @property {CB_AudioFileCache.URIS_OBJECT} URIs - Object whose property names audio formats and their value is an array of strings with the URIs (audio file paths or audio data URIs) of the audio files in order of preference. The best audio format for the current client will be tried to be calculated and it will use the first working URI (audio file path or data URI). The more audio formats and URIs provided the better, as it will help to maximize the compatibility with as many clients as possible (as some audio APIs and client just support some formats, or use absolute paths instead of relative ones, etc.). Even with different formats, all provided URIs should belong to the same audio (this means same sound or same music, with same length, etc.). NOTE: Only some clients with some audio APIs will support data URIs. If a valid value is given, this will be added to the {@link CB_AudioFileCache#URIs} property.
 *  @property {CB_AudioFileSprites.SPRITES_OBJECT} [sprites] Object with the desired sprites. It will be used as the first parameter to call the {@link CB_AudioFileSprites#insertSprites} method internally. It will be added (after being processed) to the {@link CB_AudioFileCache#sprites} property.
 *  @property {string} [id=""] - Desired identifier for the audio file sprites object. Internal usage only recommended. If a valid value is given, this will be added to the {@link CB_AudioFileSprites#id} property as well as to the {@link CB_AudioFileCache#id} property of the internally-created {@link CB_AudioFileCache} object.
 *  @property {array} [preferredAPIs={@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}] - Array of strings with the preferred audio API or audio APIs, in order of preference. Possible audio APIs are "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). It will try to calculate and use the best one for the current client. If a valid value is given, this will be added to the {@link CB_AudioFileCache#preferredAPIs} property.
 *  @property {array} [preferredFormats={@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS}] - Array of strings with the preferred audio format or audio formats (they can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"'), in order of preference. It will try to calculate and use the best one for the current client. If a valid value is given, this will be added to the {@link CB_AudioFileCache#preferredFormats} property.
 *  @property {integer} [minimumAudioFiles={@link CB_AudioFileCache.minimumAudioFiles_DEFAULT}] - Minimum {@link CB_AudioFile} objects to create internally. It must be an integer being 1 the minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#minimumAudioFiles} property.
 *  @property {integer} [maximumAudioFiles={@link CB_AudioFileCache.maximumAudioFiles_DEFAULT}] - Maximum {@link CB_AudioFile} objects that are to be created internally. If it is set to null, there will not be a maximum (it will be unlimited). If an integer is provided, it must be the same number or greater than the value set in the {@link CB_AudioFileCache#minimumAudioFiles} property (also provided by the "minimumAudioFiles" of this object), allowing 1 minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#maximumAudioFiles} property.
 *  @property {integer} [minimumAudioFilesFree=parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.25 + 0.5)] - New {@link CB_AudioFile} objects will be created internally when the number of free {@link CB_AudioFile} objects reaches this limit. If provided, it must be an integer being 0 (zero) the minimum. It will end using a 25% of the {@link CB_AudioFileCache#minimumAudioFiles} by default, rounded to ceil, allowing 0 (zero) minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#minimumAudioFilesFree} property.
 *  @property {integer} [newAudioFilesWhenNeeded=Math.min(parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.1 + 0.5), 1)] - Number of new {@link CB_AudioFile} objects to create internally when the minimum limit of free {@link CB_AudioFile} objects ({@link CB_AudioFileCache#minimumAudioFilesFree}) is reached. If provided, it must be an integer being 0 (zero) the minimum. It will end using a 10% of the {@link CB_AudioFileCache#minimumAudioFiles} by default, rounded to ceil, allowing 1 minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#newAudioFilesWhenNeeded} property.
 *  @property {integer} [retries={@link CB_AudioFileCache.retries_DEFAULT}] - Number of retries to try to load a {@link CB_AudioFile} object internally before trying to load the next possible one internally (if any). It must be an integer being 0 the minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#retries} property.
 *  @property {boolean} [checkManually={@link CB_AudioFileCache.checkManually_DEFAULT}] - Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) by default. If a valid value is given, this will be added to the {@link CB_AudioFileCache#checkManually} property.
 *  @property {boolean} [checkManuallyOnNeededCreated={@link CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT}] - Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when creates a new {@link CB_AudioFile} object needed. If a valid value is given, this will be added to the {@link CB_AudioFileCache#checkManuallyOnNeededCreated} property.
 *  @property {boolean} [checkManuallyOnPlayingFailed={@link CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT}] - Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when playing one has failed and tries to reload it. If a valid value is given, this will be added to the {@link CB_AudioFileCache#checkManuallyOnPlayingFailed} property.
 *  @property {boolean} [checkManuallyOnCheckingFailed={@link CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT}] - Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when checking one has failed and tries to reload it. If a valid value is given, this will be added to the {@link CB_AudioFileCache#checkManuallyOnCheckingFailed} property.
 *  @property {function} [onLoad] - Desired function to be called once the cache has been loaded. The first and unique parameter will be an integer with the {@link CB_AudioFile} objects that still need to be checked, if any, being "this" the current {@link CB_AudioFileCache} object. If a valid value is given, this will be added to the {@link CB_AudioFileCache#onLoad} property.
 *  @property {function} [onError] - Desired function to be called when any kind of error happens. The first and unique parameter will be a string with the error description (if it could be determined), being "this" the current {@link CB_AudioFileCache} object. If a valid value is given, this will be added to the {@link CB_AudioFileCache#onError} property.
 *  @property {boolean} [disableAutoLoad=false] - If set to true, it will not create automatically the {@link CB_AudioFile} objects by calling the {@link CB_AudioFileCache#createAudioFiles} method internally. Internal usage only recommended.
 */

 
/**
 *  The constructor is recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio.
 *  @class
 *  @classdesc Class to manage audio sprites of a {@link CB_AudioFileCache} object (used internally).
 *  @param {CB_AudioFileSprites.DATA_OBJECT} [dataObject] - Object with the desired data and options for the audio sprites. Although it can contain a "sprites" property, it will also be used as the first and unique parameter when calling the constructor of the {@link CB_AudioFileCache} object internally.
 *  @returns {CB_AudioFileSprites} Returns a new {@link CB_AudioFileSprites} object.
 *  @todo Do not allow to create one object with an "id" which has already been used (unless the value is undefined, null...).
 *  @todo Think about using wrapper to replace "this" in callbacks (callbackOk, callbackError) to point to the {@link CB_AudioFileSprites} object itself.
 *  @todo Method getCopy and static method filterProperties (similar to the ones from {@link CB_GraphicSprites} and {@link CB_GraphicSpritesScene}).
 */
var CB_AudioFileSprites = function(dataObject)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_AudioFileSprites)) { return new CB_AudioFileSprites(dataObject); }
	
	//Properties and variables:
	/**
     * Stores the identifier for the audio file sprites object.
	 *	@var
	 *  @readonly
	 *  @type {string}
	 *  @default
	 */
	this.id = "";
	
	/**
     * Object with information about the sprites.
	 *	@var
	 *  @readonly
	 *  @type {CB_AudioFileSprites.SPRITES_OBJECT}
	 *  @default
	 */
	this.sprites = {};
	
	/**
     * Object whose property names are the sprite identifiers (strings), including one called "_WITHOUT_SPRITE_ASSOCIATED" for sound instances without a sprite associated, and their values are an array containing the sound instance identifiers (created by the {@link CB_AudioFileSprites#play} method). Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {Object}
	 *  @default { "_WITHOUT_SPRITE_ASSOCIATED" : [] }
	 */
	this.spriteSoundInstances = { "_WITHOUT_SPRITE_ASSOCIATED" : [] }; //Object with the sound instances associated to each sprite ID.

	
	//If not defined, defines a fake prototype object:
	CB_AudioFileSprites._audioFileCachePrototype = CB_AudioFileSprites._audioFileCachePrototype || 
	{
		DEFAULT_ERROR_MESSAGE : "CB_AudioFileCache object not loaded (using prototype).",
		usingPrototype : true,
		status : CB_AudioFileCache.UNLOADED,
		audioFiles : [],
		audioFilesCreated : 0,
		audioFilesFreePointer : 0,
		soundInstancesQueued : {},
		duration : 0,
		destructor : function() {},
		createAudioFiles : function() { return 0; },
		createAudioFile : function(URIs, preferredAPIs, preferredFormats, audioObject, callbackOk, callbackError)
		{
			if (typeof(callbackError) === "function") { callbackError.call(CB_AudioFileSprites._audioFileCachePrototype, DEFAULT_ERROR_MESSAGE); }
			return null;
		},
		clearAudioFiles : function() { return []; },
		removeAudioFile : function() { return null; },
		purge : function() { return 0; },
		getFreeAudioFile : function() { return { "object" : null, "index" : -1 }; },
		isAudioFileFree : function() { return false; },
		clearSoundInstances : function() { return 0; },
		cancelSoundInstances : function() { return false; },
		cancelSoundInstance : function() { return false; },
		getAudioFileBySoundInstanceId : function() { return null; },
		play : function(startAt, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop)
		{
			if (typeof(onStop) === "function") { onStop(); }
			return null;
		},
		executeFunctionAll : function() { return 0; },
		destroyAll : function() { return 0; },
		checkPlayingAll : function(callbackOk, callbackError)
		{
			if (typeof(callbackError) === "function") { callbackError.call(CB_AudioFileSprites._audioFileCachePrototype, DEFAULT_ERROR_MESSAGE); }
			return 0;
		},
		playAll : function(startAt, stopAt, loop, volume, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onStop)
		{
			if (typeof(onStop) === "function") { onStop(); }
			return 0;
		},
		stopAll : function() { return 0; },
		playAndStopAll : function() { return 0; },
		pauseAll : function() { return 0; },
		resumeAll : function(loop, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop)
		{
			if (typeof(onStop) === "function") { onStop(); }
			return 0;
		},
		muteAll : function() { return 0; },
		unmuteAll : function() { return 0; },
		setVolumeAll : function() { return 0; },
		setAudioAPIAll : function(preferredAPIs, callbackOk, callbackError)
		{
			if (typeof(callbackError) === "function") { callbackError.call(CB_AudioFileSprites._audioFileCachePrototype, DEFAULT_ERROR_MESSAGE); }
			return 0;
		},
		getStatus : function() { return CB_AudioFileCache.UNLOADED; },
		getStatusString : function() { return "UNLOADED"; },
		getAudioFilesFreeNumber : function() { return 0; },
		getAudioFiles : function() { return []; },
		getAudioFilesFree : function() { return []; },
		getAudioFilesBusy : function() { return []; },
		getAudioFilesNumber : function() { return 0; },
		getDuration : function() { return 0; },
		getProgress : function() { return 0; },
		isPlaying : function() { return false; }
	};
		
	
	/**
     * Contains the {@link CB_AudioFileCache} object. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {CB_AudioFileCache}
	 *  @default
	 */
	this.audioFileCache = CB_AudioFileSprites._audioFileCachePrototype; //Keeps the CB_AudioFileCache object.
	

	//Calls the constructor of the object when creates an instance:
	return this._init(dataObject);
}


//Constructor:
CB_AudioFileSprites.prototype._init = function(dataObject)
{	
	/*
		FORMAT:
			dataObject =
			{	
				[id : String,]
				[preferredAPIs : Array<String>,]
				[preferredFormats : Array<String>,]
				URIs : Object,
				[minimumAudioFiles : Integer,]
				[maximumAudioFiles : Integer,]
				[minimumAudioFilesFree : Integer,]
				[newAudioFilesWhenNeeded : Integer,]
				[retries : Integer,]
				[checkManually : Boolean,]
				[checkManuallyOnNeededCreated : Boolean,]
				[checkManuallyOnPlayingFailed : Boolean,]
				[checkManuallyOnCheckingFailed : Boolean,]
				[disableAutoLoad : Boolean,]
				[onLoad : Function,]
				[onError : Function,]
				sprites :
				{
					"sprite_id" :
					{
						[startAt : Integer,]
						[stopAt : Integer,]
					}
					[, ...]
				}
			};
	*/

	//Tries to load the data (if any):
	this.load(dataObject);
	
	//Returns the object:
	return this;
}


/**
 * Destroys the audio file sprites object (removing all sprites, etc.), including the internal audio file cache object, and frees memory. By default, unless the "preventAbortedStatus" is set to true, sets the current status of the {@link CB_AudioFileCache} object as ABORTED ({@link CB_AudioFileCache.ABORTED} value).
 *  @function
 *  @param {boolean} [stopSounds=false] - Used as the "stopSounds" parameter when calling internally the {@link CB_AudioFileCache#destructor} method of the {@link CB_AudioFileCache} object.
 *  @param {boolean} [preventAbortedStatus=false] - If set to true (not recommended), it will not assign the status of "ABORTED" (it will not assign the value of {@link CB_AudioFileCache.ABORTED} to the {@link CB_AudioFileCache#status} property).
 */
CB_AudioFileSprites.prototype.destructor = function(stopSounds, preventAbortedStatus)
{
	//Resets properties to their default value:
	this.sprites = {};
	this.spriteSoundInstances = { "_WITHOUT_SPRITE_ASSOCIATED" : [] };

	//Destroys the CB_AudioFileCache object:
	this.audioFileCache.destructor(stopSounds, preventAbortedStatus);
	this.audioFileCache = CB_AudioFileSprites._audioFileCachePrototype;
}


/**
 * Loads the audio file sprites with the desired data given. This method is called by the constructor automatically. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio.
 *  @function
 *  @param {CB_AudioFileSprites.DATA_OBJECT} dataObject - Object with the desired data and options for the audio file sprites.
 *  @returns {CB_AudioFileSprites|null} If a "dataObject" is given, it returns the current {@link CB_AudioFileSprites} object. Otherwise, it returns null.
 */
CB_AudioFileSprites.prototype.load = function(dataObject)
{
	if (typeof(dataObject) === "undefined" || dataObject === null) { return null; }

	//Destroys all previous data (if any):
	this.destructor(true, true); //Also stops all sounds.
	
	//Sanitizes the given data:
	dataObject.id = CB_trim(dataObject.id);
	
	//Sets the new data:
	if (dataObject.id !== "") { this.id = dataObject.id; }

	//Inserts the sprites:
	if (typeof(dataObject.sprites) !== "undefined" && dataObject.sprites !== null)
	{
		this.removeSprites();
		this.insertSprites(dataObject.sprites);
	}
	
	//Creates the audio file cache object:
	this.audioFileCache = new CB_AudioFileCache(dataObject);
	
	return this;
}


/**
 * Alias for {@link CB_AudioFileSprites#removeSprites}.
 *  @function CB_AudioFileSprites#removeSpritesAll
 *  @see {@link CB_AudioFileSprites#removeSprites}
 */	
/**
 * Removes all the sprites by clearing the {@link CB_AudioFileSprites#sprites} property.
 *  @function
 */
CB_AudioFileSprites.prototype.removeSprites = CB_AudioFileSprites.prototype.removeSpritesAll = function()
{
	this.sprites = {};
}


/**
 * Inserts the given sprites. It will keep the existing ones. If a sprite identifier already existed and it is given again (not recommended), it will be replaced by the new one (but keeping its current sound instances, if any).
 *  @function
 *  @param {CB_AudioFileSprites.SPRITES_OBJECT} sprites - Object with the desired sprites.
 *  @returns {integer} Returns the number of sprites inserted.
 */
CB_AudioFileSprites.prototype.insertSprites = function(sprites)
{
	var inserted = 0;
	if (typeof(sprites) !== "undefined" && sprites !== null)
	{
		for (var spriteId in sprites)
		{
			//Inserts the sprite:
			if (this.insertSprite(sprites[spriteId], spriteId)) { inserted++; }
		}
	}
	return inserted;
}


/**
 * Inserts the given sprite. It will keep the existing ones. If a sprite identifier already existed and it is given again (not recommended), it will be replaced by the new one (but keeping its current sound instances, if any).
 *  @function
 *  @param {CB_AudioFileSprites.SPRITE_OBJECT} sprite - Object with the desired sprite.
 *  @param {string} spriteId - The identifier for the sprite.
 *  @returns {boolean} Returns true if the sprite has been inserted or false otherwise.
 */
CB_AudioFileSprites.prototype.insertSprite = function(sprite, spriteId)
{
	if (typeof(spriteId) === "undefined" || spriteId === null) { return false; }

	this.sprites[spriteId] = {};
	
	this.setStartAtSprite(spriteId, (typeof(sprite.startAt) === "undefined") ? undefined : sprite.startAt);
	this.setStopAtSprite(spriteId, (typeof(sprite.stopAt) === "undefined") ? undefined : sprite.stopAt);
	
	if (typeof(this.spriteSoundInstances[spriteId]) === "undefined" || this.spriteSoundInstances[spriteId] === null)
	{
		this.spriteSoundInstances[spriteId] = [];
	}
	
	return true;
}


/**
 * Sets when a sprite begins (stored in its "startAt" property), by sprite identifier.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {number} startAt - The time (in milliseconds) of the audio file where the audio sprite starts.
 *  @returns {boolean} Returns true if the sprite has been modified or false otherwise.
 */
CB_AudioFileSprites.prototype.setStartAtSprite = function(spriteId, startAt)
{
	if (typeof(this.sprites[spriteId]) === "undefined" || this.sprites[spriteId] === null) { return false; }
	
	this.sprites[spriteId].startAt = 0;
	if (typeof(startAt) !== "undefined" && startAt !== null && !isNaN(startAt) && startAt >= 0 && this.sprites[spriteId].startAt !== startAt)
	{
		this.sprites[spriteId].startAt = startAt;
		return true;
	}
	
	return false;
}


/**
 * Sets when a sprite ends (stored in its "stopAt" property), by sprite identifier.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {number} stopAt - The time (in milliseconds) of the audio file where the audio sprite ends.
 *  @returns {boolean} Returns true if the sprite has been modified or false otherwise.
 */
CB_AudioFileSprites.prototype.setStopAtSprite = function(spriteId, stopAt)
{
	if (typeof(this.sprites[spriteId]) === "undefined" || this.sprites[spriteId] === null) { return false; }
	
	this.sprites[spriteId].stopAt = null;
	if (typeof(stopAt) !== "undefined" && stopAt !== null && !isNaN(stopAt) && stopAt > this.sprites[spriteId].startAt && this.sprites[spriteId].stopAt !== stopAt)
	{
		this.sprites[spriteId].stopAt = stopAt;
		return true;
	}
	
	return false;
}


/**
 * Removes a sprite by its ID.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @returns {boolean} Returns true if the sprite has been deleted or false otherwise.
 */
CB_AudioFileSprites.prototype.removeSprite = function(spriteId)
{
	if (typeof(this.sprites[spriteId]) !== "undefined" && this.sprites[spriteId] !== null)
	{
		this.sprites[spriteId] = null;
		var sprites = {};
		var deleted = false;
		for (spriteId in this.sprites)
		{
			if (typeof(this.sprites[spriteId]) !== "undefined" && this.sprites[spriteId] !== null)
			{
				sprites[spriteId] = this.sprites[spriteId];
				deleted = true;
			}
		}
		this.sprites = sprites;
		return deleted;
	}
	return false;
}


/**
 * Returns a sprite by its ID.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @returns {CB_AudioFileSprites.SPRITE_OBJECT} Returns the desired sprite or a fake object if it was not found. The fake object will be this one: { "startAt" : 0, "stopAt" : null, "fake" : true }.
 */
CB_AudioFileSprites.prototype.getSprite = function(spriteId)
{
	if (typeof(this.sprites[spriteId]) !== "undefined")
	{
		return this.sprites[spriteId];
	}
	return { "startAt" : 0, "stopAt" : null, "fake" : true };
}


/**
 * Returns an object with the sprites (and includes "_WITHOUT_SPRITE_ASSOCIATED" if we want to).
 *  @function
 *  @param {boolean} [includeWithoutSpriteAssociated=false] - If set to true, the returning object will also contain a property called "_WITHOUT_SPRITE_ASSOCIATED" whose value will be an empty object (unless the property existed before in the object stored in the {@link CB_AudioFileSprites#sprites} property and had a value which is not an empty object). If set to false, the returning object will not contain the "_WITHOUT_SPRITE_ASSOCIATED" property unless the property existed before in the object stored in the {@link CB_AudioFileSprites#sprites} property.
 *  @returns {CB_AudioFileSprites.SPRITES_OBJECT} Returns an object with the sprites (and includes "_WITHOUT_SPRITE_ASSOCIATED" if we want to).
 */
CB_AudioFileSprites.prototype.getSprites = function(includeWithoutSpriteAssociated)
{
	if (!includeWithoutSpriteAssociated) { return this.sprites; }
	else
	{
		var sprites = {};
		sprites["_WITHOUT_SPRITE_ASSOCIATED"] = {};
		for (var spriteId in this.sprites)
		{
			sprites[spriteId] = this.sprites[spriteId];
		}
		return sprites;
	}
}


/**
 * Returns an array of the sound instance identifiers (created by the {@link CB_AudioFileSprites#play} method) used by the given sprite identifier.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @returns {array} Returns a numeric array of the sound instances (created by the {@link CB_AudioFileSprites#play} method) used by the given sprite identifier.
 */
CB_AudioFileSprites.prototype.getSoundInstancesIdBySpriteId = function(spriteId)
{
	if (typeof(this.spriteSoundInstances[spriteId]) !== "undefined")
	{
		return this.spriteSoundInstances[spriteId];
	}
	return [];
}


/**
 * Returns the sound instances (their ID) used (stored in the {@link CB_AudioFileSprites#spriteSoundInstances} property).
 *  @function
 *  @param {boolean} [oneDimension=false] - If set to true, it will return the {@link CB_AudioFileSprites#spriteSoundInstances} property directly (which includes the "_WITHOUT_SPRITE_ASSOCIATED" property for sound instances without a sprite associated). Otherwise, if it is set to true, it will return a numeric array whose values are the sound instance IDs.
 *  @param {boolean} [includeWithoutSpriteAssociated=false] - If set to true, it will also return the sound instance identifiers which are not associated to any sprite. Used as the "includeWithoutSpriteAssociated" parameter when calling the {@link CB_AudioFileSprites#getSprites} method internally. Only used when the "oneDimension" parameter is set to true.
 *  @returns {Object|array} Returns the sound instances (their ID) used (stored in the {@link CB_AudioFileSprites#spriteSoundInstances} property). If the "oneDimension" parameter is set to false, the property names of the returning object are the sprite identifiers (strings), including one called "_WITHOUT_SPRITE_ASSOCIATED" for sound instances without a sprite associated, and their values are an array containing the sound instance IDs. If the "oneDimension" parameter is set to true, it will return a numeric array whose values are the sound instance identifiers (if the "includeWithoutSpriteAssociated" parameter it set to true, it will also include the sound instances which are not associated to any sprite).
 */
CB_AudioFileSprites.prototype.getSoundInstancesId = function(oneDimension, includeWithoutSpriteAssociated)
{
	if (!oneDimension)
	{
		return this.spriteSoundInstances;
	}
	else
	{
		var soundInstances = [];
		var soundInstancesSprite;
		var soundInstancesSpriteLength;
		var y = 0;
		var x = 0;
		var sprites = this.getSprites(includeWithoutSpriteAssociated);
		for (var spriteId in sprites)
		{
			soundInstancesSprite = this.getSoundInstancesIdBySpriteId(spriteId);
			soundInstancesSpriteLength = soundInstancesSprite.length;
			for (x = 0; x < soundInstancesSpriteLength; x++)
			{
				soundInstances[y++] = soundInstancesSprite[x];
			}
		}
		return soundInstances;
	}
}


/**
 * Returns an array of the {@link CB_AudioFile} objects used by the sound instances that belong to a given sprite identifier.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {boolean} [avoidCancelled=false] - If set to true, it will not return the {@link CB_AudioFile} objects whose sound instance has been cancelled. Used as the "avoidCancelled" parameter when calling the {@link CB_AudioFileSprites#getAudioFileBySoundInstanceId} method internally.
 *  @returns {array} Returns an array of the {@link CB_AudioFile} objects used by the sound instances that belong to the given sprite identifier.
 */
CB_AudioFileSprites.prototype.getAudioFilesUsedBySpriteId = function(spriteId, avoidCancelled)
{
	var soundInstances = this.getSoundInstancesIdBySpriteId(spriteId);
	var audioFiles = [];
	var y = 0;
	
	var soundInstancesLength = soundInstances.length;
	var currentObject = null;
	for (var x = 0; x < soundInstancesLength; x++)
	{
		currentObject = this.getAudioFileBySoundInstanceId(soundInstances[x], avoidCancelled);
		if (currentObject !== null) { audioFiles[y++] = currentObject; }
	}
	
	return audioFiles;
}


/**
 * Object returned by the {@link CB_AudioFileSprites#getAudioFilesUsed} method. Each property names will be the sprites identifiers except the "_WITHOUT_SPRITE_ASSOCIATED" property for sound instances without a sprite associated (if we wanted to include them).
 *  @memberof CB_AudioFileSprites
 *  @typedef {Object} CB_AudioFileSprites.getAudioFilesUsed_OBJECT
 *  @property {CB_AudioFile} spriteId - Each property name will be a sprite identifier (it can be "_WITHOUT_SPRITE_ASSOCIATED" for sound instances without a sprite associated, if we wanted to include them). The value will be a numeric array with the {@link CB_AudioFile} objects used.
 */

/**
 * Returns the {@link CB_AudioFile} objects used by all the sounds instances currently created.
 *  @function
 *  @param {boolean} [oneDimension=false] - If set to false, it will return an object whose property names are the sprite identifiers (including the "_WITHOUT_SPRITE_ASSOCIATED" property for sound instances without a sprite associated, if the "includeWithoutSpriteAssociated" is set to true) and their value will be a numeric array with the {@link CB_AudioFile} objects used. Otherwise, if set to true, it will return a numeric array with the {@link CB_AudioFile} objects used (if the "includeWithoutSpriteAssociated" parameter is set to true, it will also contain the {@link CB_AudioFile} objects whose sound instance ID is not associated to any sprite).
 *  @param {boolean} [includeWithoutSpriteAssociated=false] - If set to true, it will also return the {@link CB_AudioFile} objects whose sound instance ID is not associated to any sprite. Used as the "includeWithoutSpriteAssociated" parameter when calling the {@link CB_AudioFileSprites#getSprites} method internally.
 *  @param {boolean} [avoidCancelled=false] - If set to true, it will not return the {@link CB_AudioFile} objects whose sound instance has been cancelled. Used as the "avoidCancelled" parameter when calling the {@link CB_AudioFileSprites#getAudioFilesUsedBySpriteId} method internally.
 *  @returns {CB_AudioFileSprites.getAudioFilesUsed_OBJECT|array} Returns the {@link CB_AudioFile} objects used by all the sounds instances currently created. If the "oneDimension" parameter is set to false, it will return a {@link CB_AudioFileSprites.getAudioFilesUsed_OBJECT} object whose property names are the sprite identifiers (including the "_WITHOUT_SPRITE_ASSOCIATED" property for sound instances without a sprite associated, if the "includeWithoutSpriteAssociated" is set to true) and their value will be a numeric array with the {@link CB_AudioFile} objects used. Otherwise, if the "oneDimension" parameter set to true, it will return a numeric array with the {@link CB_AudioFile} objects used (if the "includeWithoutSpriteAssociated" parameter is set to true, it will also contain the {@link CB_AudioFile} objects whose sound instance ID is not associated to any sprite).
 */
CB_AudioFileSprites.prototype.getAudioFilesUsed = function(oneDimension, includeWithoutSpriteAssociated, avoidCancelled)
{
	var audioFiles;
	var sprites = this.getSprites(includeWithoutSpriteAssociated);
	if (!oneDimension)
	{
		audioFiles = {};
		for (var spriteId in sprites)
		{
			audioFiles[spriteId] = this.getAudioFilesUsedBySpriteId(spriteId, avoidCancelled);
		}
	}
	else
	{
		audioFiles = [];
		var audioFilesSprite;
		var audioFilesSpriteLength;
		var y = 0;
		var x = 0;
		for (var spriteId in sprites)
		{
			audioFilesSprite = this.getAudioFilesUsedBySpriteId(spriteId, avoidCancelled);
			audioFilesSpriteLength = audioFilesSprite.length;
			for (x = 0; x < audioFilesSpriteLength; x++)
			{
				audioFiles[y++] = audioFilesSprite[x];
			}
		}
	}
	return audioFiles;
}


/**
 * Alias for {@link CB_AudioFileSprites#executeFunctionAllSprite}.
 *  @function CB_AudioFileSprites#executeAllSprite
 *  @see {@link CB_AudioFileSprites#executeFunctionAllSprite}
 */	
 /**
 * Alias for {@link CB_AudioFileSprites#executeFunctionAllSprite}.
 *  @function CB_AudioFileSprites#forEachSpriteById
 *  @see {@link CB_AudioFileSprites#executeFunctionAllSprite}
 */
/**
 * Executes a desired function for all the {@link CB_AudioFile} objects used by the sound instances currently created that belong to a given sprite (by its ID). It calls the {@link CB_AudioFileSprites#executeFunctionAll} method internally and returns its returning value.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Used as the "functionEach" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - Used as the "delayBetweenEach" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {boolean} [avoidCancelled=false] - If set to true, it will not affect the {@link CB_AudioFile} objects whose sound instance has been cancelled. Used as the "avoidCancelled" parameter when calling the {@link CB_AudioFileSprites#getAudioFilesUsedBySpriteId} method internally.
 *  @param {boolean} [returnSetTimeoutsArray=false] - Used as the "returnSetTimeoutsArray" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - Used as the "delayBetweenEachAffectsFirst" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {CB_Arrays.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array which was looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
 *  @returns {integer|array} If the "returnSetTimeoutsArray" parameter is set to false, it will return the number of calls to the "functionEach" function that were performed (which should be the same number as the {@link CB_AudioFile} objects used by the sound instances that belong to the given sprite identifier). Otherwise, if the "returnSetTimeoutsArray" is set to true, it will return a numeric array with a {@link CB_AudioFileCache.executeFunctionAll_OBJECT} object for each {@link CB_AudioFile} given. The length of this array will also be the number of calls to the "functionEach" function that were performed. Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
 */
CB_AudioFileSprites.prototype.executeFunctionAllSprite = CB_AudioFileSprites.prototype.executeAllSprite = CB_AudioFileSprites.prototype.forEachSpriteById = function(spriteId, functionEach, delayBetweenEach, avoidCancelled, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, finishFunction)
{
	return this.executeFunctionAll(functionEach, delayBetweenEach, this.getAudioFilesUsedBySpriteId(spriteId, avoidCancelled), returnSetTimeoutsArray, delayBetweenEachAffectsFirst, finishFunction);
}


/**
 * Alias for {@link CB_AudioFileSprites#executeFunctionAllSprites}.
 *  @function CB_AudioFileSprites#executeAllSprites
 *  @see {@link CB_AudioFileSprites#executeFunctionAllSprites}
 */	
 /**
 * Alias for {@link CB_AudioFileSprites#executeFunctionAllSprites}.
 *  @function CB_AudioFileSprites#forEachSprite
 *  @see {@link CB_AudioFileSprites#executeFunctionAllSprites}
 */
/**
 * Executes a desired function for all the {@link CB_AudioFile} objects used by all the sound instances currently created. It calls the {@link CB_AudioFileSprites#executeFunctionAll} method internally and returns its returning value.
 *  @function
 *  @param {CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Used as the "functionEach" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - Used as the "delayBetweenEach" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {boolean} [includeWithoutSpriteAssociated=false] - If set to true, it will also affect the {@link CB_AudioFile} objects whose sound instance ID is not associated to any sprite. Used as the "includeWithoutSpriteAssociated" parameter when calling the {@link CB_AudioFileSprites#getAudioFilesUsed} method internally.
 *  @param {boolean} [avoidCancelled=false] - If set to true, it will not affect the {@link CB_AudioFile} objects whose sound instance has been cancelled. Used as the "avoidCancelled" parameter when calling the {@link CB_AudioFileSprites#getAudioFilesUsed} method internally.
 *  @param {boolean} [returnSetTimeoutsArray=false] - Used as the "returnSetTimeoutsArray" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - Used as the "delayBetweenEachAffectsFirst" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {CB_Arrays.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array which was looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
 *  @returns {integer|array} If the "returnSetTimeoutsArray" parameter is set to false, it will return the number of calls to the "functionEach" function that were performed (which should be the same number as the {@link CB_AudioFile} objects used by the sound instances that belong to the sprites). Otherwise, if the "returnSetTimeoutsArray" is set to true, it will return a numeric array with a {@link CB_AudioFileCache.executeFunctionAll_OBJECT} object for each {@link CB_AudioFile} given. The length of this array will also be the number of calls to the "functionEach" function that were performed. Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
 */
CB_AudioFileSprites.prototype.executeFunctionAllSprites = CB_AudioFileSprites.prototype.executeAllSprites = CB_AudioFileSprites.prototype.forEachSprite = function(functionEach, delayBetweenEach, includeWithoutSpriteAssociated, avoidCancelled, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, finishFunction)
{
	return this.executeFunctionAll(functionEach, delayBetweenEach, this.getAudioFilesUsed(true, includeWithoutSpriteAssociated, avoidCancelled), returnSetTimeoutsArray, delayBetweenEachAffectsFirst, finishFunction);
}


/**
 * Tells whether a given sprite (by its ID) is playing or not. Note that there could be more than one sound instance (with a {@CB_AudioFile} object) by each sprite with different status (paused, stopped, etc.) and this method will return true if any of them is playing.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @returns {boolean} Returns whether a given sprite (by its ID) is playing or not.
 */
CB_AudioFileSprites.prototype.isPlayingSprite = function(spriteId)
{
	var audioFiles = this.getAudioFilesUsedBySpriteId(spriteId);
	var audioFilesLength = audioFiles.length;
	for (var x = 0; x < audioFilesLength; x++)
	{
		if (audioFiles[x].isPlaying()) { return true; }
	}
	return false;
}


/**
 * Tells whether a given sprite (by its ID) is paused or not. Note that there could be more than one sound instance (with a {@CB_AudioFile} object) by each sprite with different status (paused, stopped, etc.) and this method will return true if any of them is paused.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @returns {boolean} Returns whether a given sprite (by its ID) is paused or not.
 */
CB_AudioFileSprites.prototype.isPausedSprite = function(spriteId)
{
	var audioFiles = this.getAudioFilesUsedBySpriteId(spriteId);
	var audioFilesLength = audioFiles.length;
	for (var x = 0; x < audioFilesLength; x++)
	{
		if (audioFiles[x].isPaused()) { return true; }
	}
	return false;
}



/**
 * Tells whether a given sprite (by its ID) is stopped or not. Note that there could be more than one sound instance (with a {@CB_AudioFile} object) by each sprite with different status (paused, stopped, etc.) and this method will only return true if all of them are stopped.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {boolean} [checkAudioFileObjects=false] - If set to true, it will check all the {@CB_AudioFile} objects associated to the sprite. Doing so, as internally all stopped {@CB_AudioFile} objects are disassociated from their sound instances, this method should return false normally (unless something went wrong).
 *  @returns {boolean} Returns whether a given sprite (by its ID) is stopped or not. As internally all stopped {@CB_AudioFile} objects are disassociated from their sound instances, this method should return false normally (unless something went wrong).
 */
CB_AudioFileSprites.prototype.isStoppedSprite = function(spriteId, checkAudioFileObjects)
{
	var audioFiles = this.getAudioFilesUsedBySpriteId(spriteId);
	var audioFilesLength = audioFiles.length;
	if (!checkAudioFileObjects)
	{
		return audioFilesLength === 0; //If no audio file is found, it should mean that the sound instances have been stopped.
	}
	else
	{
		
		for (var x = 0; x < audioFilesLength; x++)
		{
			if (audioFiles[x].isStopped()) { return true; }
		}
		return false;
	}
}



/**
 * Plays a sprite by its ID. If the sprite is found, uses the {@link CB_AudioFileSprites#play} method internally and returns its returning value.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite. Used as the "spriteId" parameter when calling the {@link CB_AudioFileSprites#play} method internally.
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Used as the "loop" parameter when calling the {@link CB_AudioFileSprites#play} method internally.
 *  @param {number} [volume=CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME] - Used as the "volume" parameter when calling the {@link CB_AudioFileSprites#play} method internally.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - Used as the "allowedRecursiveDelay" parameter when calling the {@link CB_AudioFileSprites#play} method internally.
 *  @param {boolean} [allowedRecursiveDelaySkipping=stopAt-startAt] - Used as the "allowedRecursiveDelaySkipping" parameter when calling the {@link CB_AudioFileSprites#play} method internally.
 *  @param {function} [onPlayStart] - Used as the "onPlayStart" parameter when calling the {@link CB_AudioFileSprites#play} method internally.
 *  @param {function} [onStop] - Used as the "onStop" parameter when calling the {@link CB_AudioFileSprites#play} method internally.
 *  @returns {integer|null} Returns null if the sprite was not found. Otherwise, returns the sound instance ID used if there was one free or null otherwise. To get a sound instance returned does not mean necessarily that the sound started playing so it is necessary to use a callback function as the "onPlayStart" parameter for checking this. The sound instance created (if any), will be cancelled automatically once the sound is stopped.
 */
CB_AudioFileSprites.prototype.playSprite = function(spriteId, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop)
{
	var sprite = this.getSprite(spriteId);
	var soundInstance = this.play(sprite.startAt, sprite.stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, spriteId);
	return soundInstance;
}


/**
 * Stops all the {@link CB_AudioFile} objects that belong to the sound instances (created by the {@link CB_AudioFileSprites#play} or the {@link CB_AudioFileSprites#playSprite} methods) which are playing used by a given sprite identifier. Uses the {@link CB_AudioFileSprites#stopAll} method internally and returns its returning value.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#stop} method that were performed internally.
 */
CB_AudioFileSprites.prototype.stopSprite = function(spriteId)
{
	return this.stopAll(this.getAudioFilesUsedBySpriteId(spriteId));
}


/**
 * Pauses all the {@link CB_AudioFile} objects that belong to the sound instances (created by the {@link CB_AudioFileSprites#play} or the {@link CB_AudioFileSprites#playSprite} methods) which are playing used by a given sprite identifier. Uses the {@link CB_AudioFileSprites#pauseAll} method internally and returns its returning value.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {function} [onPause] - Function without parameters to be called when the audio is paused successfully, being "this" the {@link CB_AudioFile} object. Used internally as the "onPause" parameter to call the {@link CB_AudioFileSprites#pauseAll} method.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#pause} method that were performed internally.
 */
CB_AudioFileSprites.prototype.pauseSprite = function(spriteId, onPause)
{
	return this.pauseAll(onPause, this.getAudioFilesUsedBySpriteId(spriteId));
}


/**
 * Resumes all the {@link CB_AudioFile} objects that belong to the sound instances (created by the {@link CB_AudioFileSprites#play} or the {@link CB_AudioFileSprites#playSprite} methods) used by a given sprite identifier. Uses the {@link CB_AudioFileSprites#resumeAll} method internally and returns its returning value.
 *  @function
 *  @param {string} spriteId - Used as the "spriteId" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Used as the "loop" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - Used as the "allowedRecursiveDelay" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {boolean} [allowedRecursiveDelaySkipping=stopAt-startAt] - Used as the "allowedRecursiveDelaySkipping" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {function} [onPlayStart] - Used as the "onPlayStart" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {function} [onStop] - Used as the "onStop" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @returns {array} Returns null if the sprite identifier given could not be found. Otherwise, returns a numeric array containing all the return values of each internal call to the {@link CB_AudioFileCache#play} method (called through {@link CB_AudioFileSprites#resumeAll}).
 */
CB_AudioFileSprites.prototype.resumeSprite = function(spriteId, loop, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop)
{
	return this.resumeAll(loop, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, this.getAudioFilesUsedBySpriteId(spriteId), spriteId);
}


/**
 * Mutes all the {@link CB_AudioFile} objects that belong to the sound instances (created by the {@link CB_AudioFileSprites#play} or the {@link CB_AudioFileSprites#playSprite} methods) used by a given sprite identifier. Uses the {@link CB_AudioFileSprites#muteAll} method internally and returns its returning value.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {function} [onMute] - Callback function which will be called for each audio file if it has been possible to mute it (or at least it was possible to try it), being "this" the {@link CB_AudioFile} object. Used internally as the "onMute" parameter to call the {@link CB_AudioFileSprites#muteAll} method.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#mute} method that were performed internally.
 */
CB_AudioFileSprites.prototype.muteSprite = function(spriteId, onMute)
{
	return this.muteAll(onMute, this.getAudioFilesUsedBySpriteId(spriteId));
}


/**
 * Unmutes all the {@link CB_AudioFile} objects that belong to the sound instances (created by the {@link CB_AudioFileSprites#play} or the {@link CB_AudioFileSprites#playSprite} methods) used by a given sprite identifier. Uses the {@link CB_AudioFileSprites#unmuteAll} method internally and returns its returning value.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {function} [onUnmute] - Used internally as the "onUnmute" parameter to call the {@link CB_AudioFileSprites#unmuteAll} method.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#unmute} method that were performed internally.
 */
CB_AudioFileSprites.prototype.unmuteSprite = function(spriteId, onUnmute)
{
	return this.unmuteAll(onUnmute, this.getAudioFilesUsedBySpriteId(spriteId));
}


/**
 * Sets the same desired volume to all the {@link CB_AudioFile} objects that belong to the sound instances (created by the {@link CB_AudioFileSprites#play} or the {@link CB_AudioFileSprites#playSprite} methods) used by a given sprite identifier. Uses the {@link CB_AudioFileSprites#setVolumeAll} method internally and returns its returning value.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {number} [volume={@link CB_Speaker.getVolume()} | {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME}] - Used as the "volume" parameter when calling the {@link CB_AudioFileSprites#setVolumeAll} method internally.
 *  @param {boolean} [forceSetVolumeProperty=false] - Used as the "forceSetVolumeProperty" parameter when calling the {@link CB_AudioFileSprites#setVolumeAll} method internally.
 *  @param {function} [onSetVolume] - Used as the "onSetVolume" parameter when calling the {@link CB_AudioFileSprites#setVolumeAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#setVolume} method that were performed internally.
 */
CB_AudioFileSprites.prototype.setVolumeSprite = function(spriteId, volume, forceSetVolumeProperty, onSetVolume)
{
	return this.setVolumeAll(volume, forceSetVolumeProperty, onSetVolume, this.getAudioFilesUsedBySpriteId(spriteId));
}


/**
 * Tries to change the desired audio API of the {@link CB_AudioFile} objects that belong to the sound instances (created by the {@link CB_AudioFileSprites#play} or the {@link CB_AudioFileSprites#playSprite} methods) used by a given sprite identifier. Uses the {@link CB_AudioFileSprites#setAudioAPIAll} method internally and returns its returning value.
 *  @function
 *  @param {string} spriteId - The identifier for the sprite.
 *  @param {array} preferredAPIs - Used as the "preferredAPIs" parameter when calling the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @param {CB_AudioFileCache.setAudioAPIAll_CALLBACK_OK} [callbackOk] - Used as the "callbackOk" parameter when calling the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @param {CB_AudioFileCache.setAudioAPIAll_CALLBACK_ERROR} [callbackError] - Used as the "callbackError" parameter when calling the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @param {boolean} [mandatory=false] - Used as the "mandatory" parameter when calling the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @param {string} [forceReload=false] - Used as the "forceReload" parameter when calling the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#setAudioAPI} method that were performed internally.
 */
CB_AudioFileSprites.prototype.setAudioAPISprite = function(spriteId, preferredAPIs, callbackOk, callbackError, mandatory, forceReload)
{
	return this.setAudioAPIAll(preferredAPIs, callbackOk, callbackError, mandatory, forceReload, this.getAudioFilesUsedBySpriteId(spriteId));
}


/**
 * Creates the desired number of internal {@link CB_AudioFile} objects (inside the {@link CB_AudioFileCache#audioFiles} property). Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio. Uses the {@link CB_AudioFileCache#createAudioFiles} method internally and returns its returning value.
 *  @function
 *  @param {integer} minimumAudioFiles - Used as the "minimumAudioFiles" parameter when calling the {@link CB_AudioFileCache#createAudioFiles} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects which are intended to be created (they could fail).
 */
CB_AudioFileSprites.prototype.createAudioFiles = function(minimumAudioFiles)
{
	return this.audioFileCache.createAudioFiles(minimumAudioFiles);
}


/**
 * Creates one internal {@link CB_AudioFile} object (inside the {@link CB_AudioFileCache#audioFiles} property). Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio. Uses the {@link CB_AudioFileCache#createAudioFile} method internally and returns its returning value. Internal usage only recommended.
 *  @function
 *  @param {CB_AudioFileCache.URIS_OBJECT} [URIs={@link CB_AudioFileCache#URIs}] - Used as the "URIs" parameter when calling the {@link CB_AudioFileCache#createAudioFile} method internally.
 *  @param {array} [preferredAPIs={@link CB_AudioFileCache#preferredAPIs}] - Used as the "preferredAPIs" parameter when calling the {@link CB_AudioFileCache#createAudioFile} method internally.
 *  @param {array} [preferredFormats={@link CB_AudioFileCache#preferredFormats}] - Used as the "preferredFormats" parameter when calling the {@link CB_AudioFileCache#createAudioFile} method internally.
 *  @param {CB_AudioFile} [audioObject] - Used as the "audioObject" parameter when calling the {@link CB_AudioFileCache#createAudioFile} method internally.
 *  @param {function} [callbackOk] - Used as the "callbackOk" parameter when calling the {@link CB_AudioFileCache#createAudioFile} method internally.
 *  @param {function} [callbackError] - Used as the "callbackError" parameter when calling the {@link CB_AudioFileCache#createAudioFile} method internally.
 *  @param {boolean} [storeURIsList=false] - Used as the "storeURIsList" parameter when calling the {@link CB_AudioFileCache#createAudioFile} method internally.
 *  @param {boolean} [checkAutomatically=false] - Used as the "checkAutomatically" parameter when calling the {@link CB_AudioFileCache#createAudioFile} method internally.
 *  @returns {CB_AudioFile|null} If it fails, it returns null. Otherwise, returns the {@link CB_AudioFile} that has been created or reused.
 */
CB_AudioFileSprites.prototype.createAudioFile = function(URIs, preferredAPIs, preferredFormats, audioObject, callbackOk, callbackError, storeURIsList, checkAutomatically)
{
	return this.audioFileCache.createAudioFile(URIs, preferredAPIs, preferredFormats, audioObject, callbackOk, callbackError, storeURIsList, checkAutomatically);
}


/**
 * Cleans the array of the {@link CB_AudioFile} objects (taking off the undefined or null ones) which is in the {@link CB_AudioFileCache#audioFiles} property, just keeping the valid ones and clearing (destroying and removing) the others. For performance purposes. Uses the {@link CB_AudioFileCache#clearAudioFiles} method internally and returns its returning value. Internal usage only recommended.
 *  @function
 *  @param {boolean} [avoidCallingCheckCacheLoaded=false] - Used as the "avoidCallingCheckCacheLoaded" parameter when calling the {@link CB_AudioFileCache#clearAudioFiles} method internally.
 *  @returns {array} Returns the value of the {@link CB_AudioFileCache#audioFiles} property.
 */
CB_AudioFileSprites.prototype.clearAudioFiles = function(avoidCallingCheckCacheLoaded)
{
	return this.audioFileCache.clearAudioFiles(avoidCallingCheckCacheLoaded);
}


/**
 * If found, takes a given {@link CB_AudioFile} object off the {@link CB_AudioFileCache#audioFiles} property (and reloads it if we want to). NOTE: It does neither destroy nor remove the {@link CB_AudioFile} object so it can be used for other purposes (and if a {@link CB_AudioFile} object is given, it will be tried to be reused by the {@link CB_AudioFileCache#createAudioFile} method internally if it is called). Uses the {@link CB_AudioFileCache#removeAudioFile} method internally and returns its returning value. Internal usage only recommended.
 *  @function
 *  @param {CB_AudioFile|string} audioObjectOrId - Used as the "audioObjectOrId" parameter when calling the {@link CB_AudioFileCache#removeAudioFile} method internally.
 *  @param {boolean} [reload=false] - Used as the "reload" parameter when calling the {@link CB_AudioFileCache#removeAudioFile} method internally.
 *  @param {boolean} [checkManually=false] - Used as the "checkManually" parameter when calling the {@link CB_AudioFileCache#removeAudioFile} method internally.
 *  @returns {boolean|CB_AudioFile|null} Returns null if the given "audioObjectOrId" parameter is not a valid {@link CB_AudioFile} object or its {@link CB_AudioFile#id} property is not set or when the "audioObjectOrId" parameter is an empty string. Returns a {@link CB_AudioFile} object, the given one through the "audioObjectOrId" parameter of the first one removed (it should be the first and unique one removed as the ID must be unique), if the {@link CB_AudioFileCache#createAudioFile} method is called internally (it will reuse this {@link CB_AudioFile} object). Otherwise, returns true if all goes well.
 */
CB_AudioFileSprites.prototype.removeAudioFile = function(audioObjectOrId, reload, checkManually)
{
	return this.audioFileCache.removeAudioFile(audioObjectOrId, reload, checkManually);
}


/**
 * Tries to purge the audio file cache until it reaches a desired number of {@link CB_AudioFile} objects internally (set in the {@link CB_AudioFileCache#audioFiles} property), by removing and destroying some of the current {@link CB_AudioFile} objects. For performance purposes. Uses the {@link CB_AudioFileCache#purge} method internally and returns its returning value.
 *  @function
 *  @param {integer} desiredNumber - Used as the "desiredNumber" parameter when calling the {@link CB_AudioFileCache#purge} method internally.
 *  @param {boolean} [setAsMinimumAudioFiles=false] - Used as the "setAsMinimumAudioFiles" parameter when calling the {@link CB_AudioFileCache#purge} method internally.
 *  @param {boolean} [includePlaying=false] - Used as the "includePlaying" parameter when calling the {@link CB_AudioFileCache#purge} method internally.
 *  @param {boolean} [stopSounds=false] - Used as the "stopSounds" parameter when calling the {@link CB_AudioFileCache#purge} method internally.
 *  @param {array} [statuses=Array({@link CB_AudioFile.LOADING}, {@link CB_AudioFile.UNCHECKED}, {@link CB_AudioFile.CHECKING}, {@link CB_AudioFile.LOADED})] - Used as the "statuses" parameter when calling the {@link CB_AudioFileCache#purge} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects removed.
 */
CB_AudioFileSprites.prototype.purge = function(desiredNumber, setAsMinimumAudioFiles, includePlaying, stopSounds, statuses)
{
	return this.audioFileCache.purge(desiredNumber, setAsMinimumAudioFiles, includePlaying, stopSounds, statuses);
}


/**
 * Returns a free {@link CB_AudioFile} object, if any (from the {@link CB_AudioFileCache#audioFilesFree} property). Note that this will call the internal {@link CB_AudioFileCache#_createNewAudioFilesIfNeeded} method that could end creating a new {@link CB_AudioFile} object if needed. Uses the {@link CB_AudioFileCache#getFreeAudioFile} method internally and returns its returning value.
 *  @function
 *  @param {boolean} [popIt=false] - Used as the "popIt" parameter when calling the {@link CB_AudioFileCache#getFreeAudioFile} method internally.
 *  @returns {CB_AudioFileCache.getFreeAudioFile_OBJECT} Returns a {@link CB_AudioFileCache.getFreeAudioFile_OBJECT} object.
 */
CB_AudioFileSprites.prototype.getFreeAudioFile = function(popIt)
{
	return this.audioFileCache.getFreeAudioFile(popIt);
}


/**
 * Tells whether a desired {@link CB_AudioFile} object is free (it is in the {@link CB_AudioFileCache#audioFilesFree} property) or not, by its identifier. A free {@link CB_AudioFile} object is an object which is not being used and it is available to be used. Uses the {@link CB_AudioFileCache#isAudioFileFree} method internally and returns its returning value.
 *  @function
 *  @param {string} id - Used as the "id" parameter when calling the {@link CB_AudioFileCache#isAudioFileFree} method internally.
 *  @returns {boolean} Returns whether a desired {@link CB_AudioFile} object is free (it is in the {@link CB_AudioFileCache#audioFilesFree} property) or not, by its identifier. A free {@link CB_AudioFile} object is an object which is not being used and it is available to be used.
 */
CB_AudioFileSprites.prototype.isAudioFileFree = function(id)
{
	return this.audioFileCache.isAudioFileFree(id);
}


/**
 * Clears the sound instances (created by the {@link CB_AudioFileCache#play} method) which have been cancelled. Uses the {@link CB_AudioFileCache#clearSoundInstances} method internally and returns its returning value.
 *  @function
 *  @param {boolean} [clearWithObjectAssociated=false] - Used as the "clearWithObjectAssociated" parameter when calling the {@link CB_AudioFileCache#clearSoundInstances} method internally.
 *  @returns {integer} Returns the number of cleared sound instances.
 */
CB_AudioFileSprites.prototype.clearSoundInstances = function(clearWithObjectAssociated)
{
	//Clears the sound instances in the cache object:
	var cleared = this.audioFileCache.clearSoundInstances(clearWithObjectAssociated);
	
	var soundInstances;
	var soundInstancesLength;
	var spriteSoundInstances = {};
	var sprites = this.getSprites(true);
	var y = 0;
	for (var spriteId in sprites)
	{
		spriteSoundInstances[spriteId] = [];
		y = 0;
		soundInstances = this.getSoundInstancesIdBySpriteId(spriteId);
		soundInstancesLength = soundInstances.length;
		for (var x = 0; x < soundInstancesLength; x++)
		{
			if (typeof(this.audioFileCache.soundInstancesQueued[soundInstances[x]]) !== "undefined")
			{
				spriteSoundInstances[spriteId][y++] = soundInstances[x];
			}
		}
	}
	
	this.spriteSoundInstances = spriteSoundInstances;
	
	return cleared;
}


/**
 * Cancels (to prevent they start playing) or enables all sound instances (created by the {@link CB_AudioFileCache#play} method). Uses the {@link CB_AudioFileCache#cancelSoundInstances} method internally and returns its returning value.
 *  @function
 *  @param {boolean} [cancel=false] - Used as the "cancel" parameter when calling the {@link CB_AudioFileCache#cancelSoundInstances} method internally.
 *  @param {boolean} [affectWithObjectAssociated=false] - Used as the "affectWithObjectAssociated" parameter when calling the {@link CB_AudioFileCache#cancelSoundInstances} method internally.
 *  @returns {integer} Returns the number of sound instances modified.
 */
CB_AudioFileSprites.prototype.cancelSoundInstances = function(cancel, affectWithObjectAssociated)
{
	return this.audioFileCache.cancelSoundInstances(cancel, affectWithObjectAssociated);
}


/**
 * Cancels (to prevent it starts playing) or enables a sound instance (created by the {@link CB_AudioFileCache#play} method), by its identifier. Uses the {@link CB_AudioFileCache#cancelSoundInstance} method internally and returns its returning value.
 *  @function
 *  @param {integer} soundInstanceId - Used as the "soundInstanceId" parameter when calling the {@link CB_AudioFileCache#cancelSoundInstance} method internally.
 *  @param {boolean} [cancel=false] - Used as the "cancel" parameter when calling the {@link CB_AudioFileCache#cancelSoundInstance} method internally.
 *  @param {boolean} [affectWithObjectAssociated=false] - Used as the "affectWithObjectAssociated" parameter when calling the {@link CB_AudioFileCache#cancelSoundInstance} method internally.
 *  @returns {boolean} Returns true if the sound instance has been modified or false otherwise.
 */
CB_AudioFileSprites.prototype.cancelSoundInstance = function(soundInstanceId, cancel, affectWithObjectAssociated)
{
	return this.audioFileCache.cancelSoundInstance(soundInstanceId, cancel, affectWithObjectAssociated);
}


/**
 * Gets the {@link CB_AudioFile} object associated to a given sound instance ID (created by the {@link CB_AudioFileCache#play} method), if any, or null otherwise. Uses the {@link CB_AudioFileCache#getAudioFileBySoundInstanceId} method internally and returns its returning value.
 *  @function
 *  @param {integer} soundInstanceId - Used as the "soundInstanceId" parameter when calling the {@link CB_AudioFileCache#getAudioFileBySoundInstanceId} method internally.
 *  @param {boolean} [avoidCancelled=false] - Used as the "avoidCancelled" parameter when calling the {@link CB_AudioFileCache#getAudioFileBySoundInstanceId} method internally.
 *  @returns {CB_AudioFile|null} Returns the {@link CB_AudioFile} object associated to a given sound instance ID, if any, or null otherwise.
 */
CB_AudioFileSprites.prototype.getAudioFileBySoundInstanceId = function(soundInstanceId, avoidCancelled)
{
	return this.audioFileCache.getAudioFileBySoundInstanceId(soundInstanceId, avoidCancelled);
}


/**
 * Plays a sound of the cache (if there is any free), using a sprite if desired. If a sound cannot be played, this method can call itself internally again and again (with most of the given parameters being the same, depending on the circumstances) to try to play the sound until a desired time limit is reached. If a {@link CB_AudioFile} object cannot be played and it is determined necessary, it will try to reload it internally (by calling the {@link CB_AudioFileCache#removeAudioFile} method). Uses the {@link CB_AudioFileCache#play} method internally and returns its returning value. Internal usage only recommended. To play a sprite, better use the {@link CB_AudioFileSprites#playSprite} method instead.
 *  @function
 *  @param {number} [startAt=0 | {@link CB_AudioFile_API.WAAPI#lastStartAt} | {@link CB_AudioFile_API.SM2#lastStartAt} | {@link CB_AudioFile_API.ACMP#lastStartAt} | {@link CB_AudioFile_API.AAPI#lastStartAt} | stopAt] - Used as the "startAt" parameter when calling the {@link CB_AudioFileCache#play} method internally.
 *  @param {number} [stopAt={@link CB_AudioFile_API.WAAPI#getDuration}() | {@link CB_AudioFile_API.SM2#getDuration}() | {@link CB_AudioFile_API.ACMP#getDuration}() | {@link CB_AudioFile_API.AAPI#getDuration}()] - Used as the "stopAt" parameter when calling the {@link CB_AudioFileCache#play} method internally.
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Used as the "loop" parameter when calling the {@link CB_AudioFileCache#play} method internally.
 *  @param {number} [volume=CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME] - Used as the "volume" parameter when calling the {@link CB_AudioFileCache#play} method internally.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - Used as the "allowedRecursiveDelay" parameter when calling the {@link CB_AudioFileCache#play} method internally.
 *  @param {boolean} [allowedRecursiveDelaySkipping=stopAt-startAt] - Used as the "allowedRecursiveDelaySkipping" parameter when calling the {@link CB_AudioFileCache#play} method internally.
 *  @param {function} [onPlayStart] - Used as the "onPlayStart" parameter when calling the {@link CB_AudioFileCache#play} method internally.
 *  @param {function} [onStop] - Used as the "onStop" parameter when calling the {@link CB_AudioFileCache#play} method internally.
 *  @param {string} [spriteId='_WITHOUT_SPRITE_ASSOCIATED'] - The identifier for the sprite. Internal usage only recommended.
 *  @returns {integer|null} Returns null if a sprite identifier was given but it could not be found. Otherwise, returns the sound instance ID used if there was one free or null otherwise. To get a sound instance returned does not mean necessarily that the sound started playing so it is necessary to use a callback function as the "onPlayStart" parameter for checking this. The sound instance created (if any), will be cancelled automatically once the sound is stopped.
 */
CB_AudioFileSprites.prototype.play = function(startAt, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, spriteId)
{
	if (typeof(spriteId) === "undefined" || spriteId === null) { spriteId = "_WITHOUT_SPRITE_ASSOCIATED"; }
	else if (typeof(this.sprites[spriteId]) === "undefined" || this.sprites[spriteId] === null) { return null; }
	//if (typeof(this.sprites[spriteId]) === "undefined" || this.sprites[spriteId] === null) { return null; }
	
	var soundInstance = this.audioFileCache.play(startAt, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop);
	
	if (typeof(this.spriteSoundInstances[spriteId]) !== "undefined")
	{
		this.spriteSoundInstances[spriteId][this.spriteSoundInstances[spriteId].length] = soundInstance;
	}
	
	return soundInstance;
}


/**
 * Alias for {@link CB_AudioFileSprites#executeFunctionAll}.
 *  @function CB_AudioFileSprites#executeAll
 *  @see {@link CB_AudioFileSprites#executeFunctionAll}
 */	
 /**
 * Alias for {@link CB_AudioFileSprites#executeFunctionAll}.
 *  @function CB_AudioFileSprites#forEach
 *  @see {@link CB_AudioFileSprites#executeFunctionAll}
 */	
/**
 * Performs a desired action, using the provided function, on all the existing {@link CB_AudioFile} objects or on the desired ones (if provided). Uses the {@link CB_AudioFileCache#executeFunctionAll} method internally and returns its returning value.
 *  @function
 *  @param {CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Used as the "functionEach" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - Used as the "delayBetweenEach" parameter when calling the {@link CB_AudioFileCache#executeFunctionAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileCache#executeFunctionAll} method internally.
 *  @param {boolean} [returnSetTimeoutsArray=false] - Used as the "returnSetTimeoutsArray" parameter when calling the {@link CB_AudioFileCache#executeFunctionAll} method internally.
 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - Used as the "delayBetweenEachAffectsFirst" parameter when calling the {@link CB_AudioFileCache#executeFunctionAll} method internally.
 *  @param {CB_Arrays.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array which was looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
 *  @returns {integer|array} If the "returnSetTimeoutsArray" parameter is set to false, it will return the number of calls to the "functionEach" function that were performed (which should be the same number as the {@link CB_AudioFile} objects given in the "audioFiles" parameter). Otherwise, if the "returnSetTimeoutsArray" is set to true, it will return a numeric array with a {@link CB_AudioFileCache.executeFunctionAll_OBJECT} object for each {@link CB_AudioFile} given. The length of this array will also be the number of calls to the "functionEach" function that were performed. Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
 */
CB_AudioFileSprites.prototype.executeFunctionAll = CB_AudioFileSprites.prototype.executeAll = CB_AudioFileSprites.prototype.forEach = function(functionEach, delayBetweenEach, audioFiles, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, finishFunction)
{
	return this.audioFileCache.executeFunctionAll(functionEach, delayBetweenEach, audioFiles, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, finishFunction);
}


/**
 * Destroys all the {@link CB_AudioFile} objects and frees memory, by calling {@link CB_AudioFile#destructor}(stopSounds, false, true). Uses the {@link CB_AudioFileCache#destroyAll} method internally and returns its returning value.
 *  @function
 *  @param {boolean} [stopSounds=false] - Used as the "stopSounds" parameter when calling the {@link CB_AudioFileCache#destroyAll} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose {@link CB_AudioFile#destructor} has been called.
 */
CB_AudioFileSprites.prototype.destroyAll = function(stopSounds)
{
	return this.audioFileCache.destroyAll(stopSounds);
}


/**
 * Checks whether each {@link CB_AudioFile} object whose {@link CB_AudioFile#getStatus} method returns the "unchecked" value (which belongs to the value of the {@link CB_AudioFile#UNCHECKED} property) can be played or not. After checking, if the audio can be played, the status of the {@link CB_AudioFile} object will get the value of {@link CB_AudioFile.LOADED}. Otherwise, if it cannot be played, the status of the {@link CB_AudioFile} object will get the value of {@link CB_AudioFile.FAILED}. If a {@link CB_AudioFile} object cannot be played and it is determined necessary, it will try to reload it internally (by calling the {@link CB_AudioFileCache#removeAudioFile} method). It will call the {@link CB_AudioFileCache#clearAudioFiles} method internally after finishing. Uses the {@link CB_AudioFileCache#checkPlayingAll} method internally and returns its returning value. Recommended to be called through a user-driven event (as onClick, onTouch, etc.).
 *  @function
 *  @param {CB_AudioFileCache.checkPlayingAll_CALLBACK_OK} [callbackOk] - Used as the "callbackOk" parameter when calling the {@link CB_AudioFileCache#checkPlayingAll} method internally.
 *  @param {CB_AudioFileCache.checkPlayingAll_CALLBACK_ERROR} [callbackError] - Used as the "callbackError" parameter when calling the {@link CB_AudioFileCache#checkPlayingAll} method internally.
 *  @param {boolean} [ignoreQueue=false] - Used as the "ignoreQueue" parameter when calling the {@link CB_AudioFileCache#checkPlayingAll} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose status belonged to the "unchecked" value (the value of the {@link CB_AudioFile#UNCHECKED} property) before the execution of this method. It will return 0 (zero) if the method is tried to be executed while there is another previous call of it still running. It will also return 0 (zero) if the status of the audio file cache is not loaded (the {@link CB_AudioFileCache#status} property does not belong to the value set in the {@link CB_AudioFileCache.LOADED} property).
 */
CB_AudioFileSprites.prototype.checkPlayingAll = function(callbackOk, callbackError, ignoreQueue)
{
	return this.audioFileCache.checkPlayingAll(callbackOk, callbackError, ignoreQueue);
}


/**
 * Tries to play all the {@link CB_AudioFile} objects by calling their {@link CB_AudioFile#play} method internally. If a {@link CB_AudioFile} object cannot be played and it is determined necessary, it will try to reload it internally (by calling the {@link CB_AudioFileCache#removeAudioFile} method). Uses the {@link CB_AudioFileCache#playAll} method internally and returns its returning value.
 *  @function
 *  @param {number} [startAt=0 | {@link CB_AudioFile_API.WAAPI#lastStartAt} | {@link CB_AudioFile_API.SM2#lastStartAt} | {@link CB_AudioFile_API.ACMP#lastStartAt} | {@link CB_AudioFile_API.AAPI#lastStartAt} | stopAt] - Used as the "startAt" parameter when calling the {@link CB_AudioFileCache#playAll} method internally.
 *  @param {number} [stopAt={@link CB_AudioFile_API.WAAPI#getDuration}() | {@link CB_AudioFile_API.SM2#getDuration}() | {@link CB_AudioFile_API.ACMP#getDuration}() | {@link CB_AudioFile_API.AAPI#getDuration}()] - Used as the "stopAt" parameter when calling the {@link CB_AudioFileCache#playAll} method internally.
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Used as the "loop" parameter when calling the {@link CB_AudioFileCache#playAll} method internally.
 *  @param {number} [volume=CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME] - Used as the "volume" parameter when calling the {@link CB_AudioFileCache#playAll} method internally.
 *  @param {boolean} [avoidDelayedPlay=false] - Used as the "avoidDelayedPlay" parameter when calling the {@link CB_AudioFileCache#playAll} method internally.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - Used as the "allowedRecursiveDelay" parameter when calling the {@link CB_AudioFileCache#playAll} method internally.
 *  @param {function} [onPlayStart] - Used as the "onPlayStart" parameter when calling the {@link CB_AudioFileCache#playAll} method internally.
 *  @param {function} [onStop] - Used as the "onStop" parameter when calling the {@link CB_AudioFileCache#playAll} method internally.
 *  @param {boolean} [includingPlaying=false] - Used as the "includingPlaying" parameter when calling the {@link CB_AudioFileCache#playAll} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose {@link CB_AudioFile#play} method did not return the value of "-1" (this does not mean necessarily that they could be played successfully).
 */
CB_AudioFileSprites.prototype.playAll = function(startAt, stopAt, loop, volume, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onStop, includingPlaying)
{
	return this.audioFileCache.playAll(startAt, stopAt, loop, volume, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onStop, includingPlaying);
}


/**
 * Tries to stops all the existing {@link CB_AudioFile} objects or the desired ones (if provided), which are being played, by calling their {@link CB_AudioFile#stop} method internally. Uses the {@link CB_AudioFileCache#stopAll} method internally and returns its returning value.
 *  @function
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileCache#stopAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#stop} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileSprites.prototype.stopAll = function(audioFiles)
{
	return this.audioFileCache.stopAll(audioFiles);
}


/**
 * Plays silently and stops all {@link CB_AudioFile} objects after a desired time. It can be useful for some clients which need the {@link CB_AudioFile#play} method to be called through a user-driven event (as onClick, onTouch, etc.). Internally, it calls {@link CB_AudioFileCache#playAll}(0, null, false, 0, true, null, null, null, includingPlaying) and, after a desired delay, calls the {@link CB_AudioFileCache#stopAll} method. Uses the {@link CB_AudioFileCache#playAndStopAll} method internally and returns its returning value.
 *  @function
 *  @param {boolean} [includingPlaying=false] - Used as the "includingPlaying" parameter when calling the {@link CB_AudioFileCache#playAndStopAll} method internally.
 *  @param {number} [delayBeforeStop=100] - Used as the "delayBeforeStop" parameter when calling the {@link CB_AudioFileCache#playAndStopAll} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose {@link CB_AudioFile#play} method did not return the value of "-1" (this does not mean necessarily that they could be played successfully).
 */
CB_AudioFileSprites.prototype.playAndStopAll = function(includingPlaying, delayBeforeStop)
{
	return this.audioFileCache.playAndStopAll(includingPlaying, delayBeforeStop);
}


/**
 * Tries to pause all the existing {@link CB_AudioFile} objects or the desired ones (if provided), which are being played, by calling their {@link CB_AudioFile#pause} method internally. Uses the {@link CB_AudioFileCache#pauseAll} method internally and returns its returning value.
 *  @function
 *  @param {function} [onPause] - Used as the "onPause" parameter when calling the {@link CB_AudioFileCache#pauseAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileCache#pauseAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#pause} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileSprites.prototype.pauseAll = function(onPause, audioFiles)
{
	return this.audioFileCache.pauseAll(onPause, audioFiles);
}


/**
 * Resumes all the existing {@link CB_AudioFile} objects or the desired ones (if provided), which are paused (and not stopped). Can be focused on just one sprite identifier if desired. Uses the {@link CB_AudioFileCache#resumeAll} method internally and returns its returning value. Internal usage only recommended. To resume a sprite, better use the {@link CB_AudioFileSprites#resumeSprite} method instead.
 *  @function
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Used as the "loop" parameter when calling the {@link CB_AudioFileCache#resumeAll} method internally.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - Used as the "allowedRecursiveDelay" parameter when calling the {@link CB_AudioFileCache#resumeAll} method internally.
 *  @param {boolean} [allowedRecursiveDelaySkipping=CB_AudioFile#lastStopAt-CB_AudioFile#lastStartAt] - Used as the "allowedRecursiveDelaySkipping" parameter when calling the {@link CB_AudioFileCache#resumeAll} method internally.
 *  @param {function} [onPlayStart] - Used as the "onPlayStart" parameter when calling the {@link CB_AudioFileCache#resumeAll} method internally.
 *  @param {function} [onStop] - Used as the "onStop" parameter when calling the {@link CB_AudioFileCache#resumeAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileCache#resumeAll} method internally.
 *  @param {string} [spriteId='_WITHOUT_SPRITE_ASSOCIATED'] - The identifier for the sprite. Internal usage only recommended.
 *  @returns {array} Returns null if a sprite identifier was given but it could not be found. Otherwise, returns a numeric array containing all the return values of each internal call to the {@link CB_AudioFileCache#play} method.
 */
CB_AudioFileSprites.prototype.resumeAll = function(loop, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, audioFiles, spriteId)
{
	if (typeof(spriteId) === "undefined" || spriteId === null) { spriteId = "_WITHOUT_SPRITE_ASSOCIATED"; }
	else if (typeof(this.sprites[spriteId]) === "undefined" || this.sprites[spriteId] === null) { return null; }
	//if (typeof(this.sprites[spriteId]) === "undefined" || this.sprites[spriteId] === null) { return null; }

	var soundInstances = this.audioFileCache.resumeAll(loop, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, audioFiles);
	
	if (typeof(this.spriteSoundInstances[spriteId]) !== "undefined")
	{
		//Stores the sound instances used by the resume (if any):
		var soundInstancesLength = soundInstances.length;
		for (var x = 0; x < soundInstancesLength; x++)
		{
			this.spriteSoundInstances[spriteId][this.spriteSoundInstances[spriteId].length] = soundInstances[x];
		}
	}
	
	return soundInstances;
}


/**
 * Mutes all the existing {@link CB_AudioFile} objects or the desired ones (if provided). Uses the {@link CB_AudioFileCache#muteAll} method internally and returns its returning value.
 *  @function
 *  @param {function} [onMute] - Used as the "onMute" parameter when calling the {@link CB_AudioFileCache#muteAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileCache#muteAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#mute} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileSprites.prototype.muteAll = function(onMute, audioFiles)
{
	return this.audioFileCache.muteAll(onMute, audioFiles);
}


/**
 * Unmutes all the existing {@link CB_AudioFile} objects or the desired ones (if provided). Uses the {@link CB_AudioFileCache#unmuteAll} method internally and returns its returning value.
 *  @function
 *  @param {function} [onUnmute] - Used as the "onUnmute" parameter when calling the {@link CB_AudioFileCache#unmuteAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileCache#unmuteAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#unmute} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileSprites.prototype.unmuteAll = function(onUnmute, audioFiles)
{
	return this.audioFileCache.unmuteAll(onUnmute, audioFiles);
}


/**
 * Sets the same volume for all the existing {@link CB_AudioFile} objects or the desired ones (if provided). Uses the {@link CB_AudioFileCache#setVolumeAll} method internally and returns its returning value.
 *  @function
 *  @param {number} [volume={@link CB_Speaker.getVolume()} | {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME}] - Used as the "volume" parameter when calling the {@link CB_AudioFileCache#setVolumeAll} method internally.
 *  @param {boolean} [forceSetVolumeProperty=false] - Used as the "forceSetVolumeProperty" parameter when calling the {@link CB_AudioFileCache#setVolumeAll} method internally.
 *  @param {function} [onSetVolume] - Used as the "onSetVolume" parameter when calling the {@link CB_AudioFileCache#setVolumeAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileCache#setVolumeAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#setVolume} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileSprites.prototype.setVolumeAll = function(volume, forceSetVolumeProperty, onSetVolume, audioFiles)
{
	return this.audioFileCache.setVolumeAll(volume, forceSetVolumeProperty, onSetVolume, audioFiles);
}


/**
 * Tries to change the audio API for all the existing {@link CB_AudioFile} objects or the desired ones (if provided). This method is not allowed to be called if a previous call to it did not finish yet. The function defined in the "callbackError" parameter, if any, will be called immediately if the method was previously called and it is still running currently. Uses the {@link CB_AudioFileCache#setAudioAPIAll} method internally and returns its returning value.
 *  @function
 *  @param {array|string} preferredAPIs - Used as the "preferredAPIs" parameter when calling the {@link CB_AudioFileCache#setAudioAPIAll} method internally.
 *  @param {CB_AudioFileCache.setAudioAPIAll_CALLBACK_OK} [callbackOk] - Used as the "callbackOk" parameter when calling the {@link CB_AudioFileCache#setAudioAPIAll} method internally.
 *  @param {CB_AudioFileCache.setAudioAPIAll_CALLBACK_ERROR} [callbackError] - Used as the "callbackError" parameter when calling the {@link CB_AudioFileCache#setAudioAPIAll} method internally.
 *  @param {boolean} [mandatory=false] - Used as the "mandatory" parameter when calling the {@link CB_AudioFileCache#setAudioAPIAll} method internally.
 *  @param {string} [forceReload=false] - Used as the "forceReload" parameter when calling the {@link CB_AudioFileCache#setAudioAPIAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileCache#setAudioAPIAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#setAudioAPI} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileSprites.prototype.setAudioAPIAll = function(preferredAPIs, callbackOk, callbackError, mandatory, forceReload, audioFiles)
{
	return this.audioFileCache.setAudioAPIAll(preferredAPIs, callbackOk, callbackError, mandatory, forceReload, audioFiles);
}


/**
 * Tells whether any of the {@link CB_AudioFile} objects is playing or not. Uses the {@link CB_AudioFileCache#isPlaying} method internally and returns its returning value.
 *  @function
 *  @returns {boolean} Returns whether any of the {@link CB_AudioFile} objects is playing or not.
 */
CB_AudioFileSprites.prototype.isPlaying = function()
{
	return this.audioFileCache.isPlaying();
}


/**
 * Tells the current number of free {@link CB_AudioFile} objects (the number of objects which are available and ready to use). Uses the {@link CB_AudioFileCache#getAudioFilesFreeNumber} method internally and returns its returning value.
 *  @function
 *  @returns {integer} Returns the current number of free {@link CB_AudioFile} objects (the number of objects which are available and ready to use).
 */
CB_AudioFileSprites.prototype.getAudioFilesFreeNumber = function()
{
	return this.audioFileCache.getAudioFilesFreeNumber();
}


/**
 * Gets an array with all the {@link CB_AudioFile} objects. Uses the {@link CB_AudioFileCache#getAudioFiles} method internally and returns its returning value.
 *  @function
 *  @param {boolean} [copy=false] - Used as the "copy" parameter when calling the {@link CB_AudioFileCache#getAudioFiles} method internally.
 *  @returns {array} Returns an array with all the {@link CB_AudioFile} objects.
 */
CB_AudioFileSprites.prototype.getAudioFiles = function(copy)
{
	return this.audioFileCache.getAudioFiles(copy);
}


/**
 * Gets an array with the free {@link CB_AudioFile} objects (the objects which are available and ready to use). Uses the {@link CB_AudioFileCache#getAudioFilesFree} method internally and returns its returning value.
 *  @function
 *  @returns {array} Returns an array with the free {@link CB_AudioFile} objects (the objects which are available and ready to use).
 */
CB_AudioFileSprites.prototype.getAudioFilesFree = function()
{
	return this.audioFileCache.getAudioFilesFree();
}


/**
 * Gets an array with the busy {@link CB_AudioFile} objects (the objects which are not available and ready to use). Uses the {@link CB_AudioFileCache#getAudioFilesBusy} method internally and returns its returning value.
 *  @function
 *  @returns {array} Returns an array with the busy {@link CB_AudioFile} objects (the objects which are not available and ready to use).
 */
CB_AudioFileSprites.prototype.getAudioFilesBusy = function()
{
	return this.audioFileCache.getAudioFilesBusy();
}


/**
 * Tells the number of {@link CB_AudioFile} objects created. Uses the {@link CB_AudioFileCache#getAudioFilesNumber} method internally and returns its returning value.
 *  @function
 *  @param {boolean} [real=false] - Used as the "real" parameter when calling the {@link CB_AudioFileCache#getAudioFilesNumber} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects created.
 */
CB_AudioFileSprites.prototype.getAudioFilesNumber = function(real)
{
	return this.audioFileCache.getAudioFilesNumber(real);
}


/**
 * Tells the duration (minimum or maximum) of the sound stored (in milliseconds). Although the audio file cache should always be used to cache the same sound only, the duration might not always be the same due the usage of different formats, file paths, etc. So this method returns either the minimum or the maximum duration found among all the {@link CB_AudioFile} objects. Uses the {@link CB_AudioFileCache#getDuration} method internally and returns its returning value.
 *  @function
 *  @param {boolean} [maximum=false] - Used as the "maximum" parameter when calling the {@link CB_AudioFileCache#getDuration} method internally.
 *  @returns {number} Returns the duration (minimum or maximum) of the sound stored (in milliseconds). Although the audio file cache should always be used to cache the same sound only, the duration might not always be the same due the usage of different formats, file paths, etc. So this method returns either the minimum or the maximum duration found among all the {@link CB_AudioFile} objects.
 */
CB_AudioFileSprites.prototype.getDuration = function(maximum)
{
	return this.audioFileCache.getDuration(maximum);
}


/**
 * Returns a number representing the percentage of the loading progress for the audio file sprites object (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable. Uses the {@link CB_AudioFileCache#getProgress} method internally and returns its returning value.
 *  @function
 *  @param {boolean} [countLoadedObjects=false] - Used as the "countLoadedObjects" parameter when calling the {@link CB_AudioFileCache#getProgress} method internally.
 *  @param {boolean} [alsoUncheckedAndCheckingObjects=false] - Used as the "alsoUncheckedAndCheckingObjects" parameter when calling the {@link CB_AudioFileCache#getProgress} method internally.
 *  @returns {number} Returns a number representing the percentage of the loading progress for the audio file sprites object (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable.
 */
CB_AudioFileSprites.prototype.getProgress = function(countLoadedObjects, alsoUncheckedAndCheckingObjects)
{
	return this.audioFileCache.getProgress(countLoadedObjects, alsoUncheckedAndCheckingObjects);
}


/**
 * Gets the current status of the audio file sprites object. Uses the {@link CB_AudioFileCache#getStatus} method internally and returns its returning value.
 *  @function
 *  @returns {number} Returns the current status of the audio file sprites object. It is a number, which should match the value of the {@link CB_AudioFileCache.UNLOADED} (still unloaded), {@link CB_AudioFileCache.LOADING} (loading), {@link CB_AudioFileCache.UNCHECKED} (not checked by calling the {@link CB_AudioFileCache#checkPlayingAll} method yet), {@link CB_AudioFileCache.CHECKING} (being checked by the {@link CB_AudioFileCache#checkPlayingAll} method), {@link CB_AudioFileCache.LOADED} (loaded), {@link CB_AudioFileCache.FAILED} (failed loading or failed to play or by any other reason) or {@link CB_AudioFileCache.ABORTED} (aborted because it was destroyed with the "destructor" method) property.
 */
CB_AudioFileSprites.prototype.getStatus = function()
{
	return this.audioFileCache.getStatus();
}


/**
 * Gets the current status of the audio file sprites, as a string. Uses the {@link CB_AudioFileCache#getStatusString} method internally and returns its returning value.
 *  @function
 *  @returns {string} Returns the current status of the audio file sprites, as a string. Possible return values are "UNLOADED", "LOADING", "UNCHECKED", "CHECKING", "LOADED", "FAILED", "ABORTED" or "UNKNOWN (UNKNOWN_STATUS)" (where "UNKNOWN_STATUS" will be a value from the {@link CB_AudioFileCache#status} property not recognized as any possible status).
 */
CB_AudioFileSprites.prototype.getStatusString = function()
{
	return this.audioFileCache.getStatusString();
}