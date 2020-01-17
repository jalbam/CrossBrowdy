/**
 * @file Audio files cache management. Contains the {@link CB_AudioFileCache} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */


/**
 * Object whose property names are audio formats (they can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"') and their value is an array of strings with the URIs (audio file paths or audio data URIs) of the audio files in order of preference. The best audio format for the current client will be tried to be calculated and it will use the first working URI (audio file path or data URI). The more audio formats and URIs provided the better, as it will help to maximize the compatibility with as many clients as possible (as some audio APIs and client just support some formats, or use absolute paths instead of relative ones, etc.). Even with different formats, all provided URIs should belong to the same audio (this means same sound or same music, with same length, etc.). NOTE: Only some clients with some audio APIs will support data URIs.
 * @example
 * {
 *	"audio/mp4" : [ "first/path/sound.m4a", "alternative/path/sound.m4a", "alternative/path/2/sound.mp4", ... ],
 *	"audio/ogg" : [ "first/path/sound.opus", "alternative/path/sound.ogg", "alternative/path/2/sound.ogg", ... ],
 *	"audio/mpeg" : [ "first/path/sound.mp3", "alternative/path/sound.mp3", "alternative/path/2/sound.mp3", ... ],
 *	"audio/wav" : [ "first/path/sound.wav", "alternative/path/sound.wav", "alternative/path/2/sound.wav", ... ],
 *	...
 * }
 *  @memberof CB_AudioFileCache
 *  @typedef {Object} CB_AudioFileCache.URIS_OBJECT
 *  @property {array} filePaths - Being the name of each property the audio format (it can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"'), the value will always be a numeric array of strings with the URIs (audio file paths or audio data URIs) of the audio files in order of preference. The best audio format for the current client will be tried to be calculated and it will use the first working URI (audio file path or data URI). The more audio formats and URIs provided the better, as it will help to maximize the compatibility with as many clients as possible (as some audio APIs and client just support some formats, or use absolute paths instead of relative ones, etc.). Even with different formats, all provided URIs should belong to the same audio (this means same sound or same music, with same length, etc.). NOTE: Only some clients with some audio APIs will support data URIs.
 */
 
  
/**
 * Object with the desired data and options for the audio files cache.
 *  @memberof CB_AudioFileCache
 *  @typedef {Object} CB_AudioFileCache.DATA_OBJECT
 *  @property {CB_AudioFileCache.URIS_OBJECT} URIs - Object whose property names audio formats and their value is an array of strings with the URIs (audio file paths or audio data URIs) of the audio files in order of preference. The best audio format for the current client will be tried to be calculated and it will use the first working URI (audio file path or data URI). The more audio formats and URIs provided the better, as it will help to maximize the compatibility with as many clients as possible (as some audio APIs and client just support some formats, or use absolute paths instead of relative ones, etc.). Even with different formats, all provided URIs should belong to the same audio (this means same sound or same music, with same length, etc.). NOTE: Only some clients with some audio APIs will support data URIs. If a valid value is given, this will be added to the {@link CB_AudioFileCache#URIs} property.
 *  @property {string} [id=""] - Desired identifier for the audio files cache. Internal usage only recommended. If a valid value is given, this will be added to the {@link CB_AudioFileCache#id} property.
 *  @property {array} [preferredAPIs={@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}] - Array of strings with the preferred audio API or audio APIs, in order of preference. Possible audio APIs are "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). It will try to calculate and use the best one for the current client. If a valid value is given, this will be added to the {@link CB_AudioFileCache#preferredAPIs} property.
 *  @property {array} [preferredFormats={@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS}] - Array of strings with the preferred audio format or audio formats (they can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"'), in order of preference. It will try to calculate and use the best one for the current client. If a valid value is given, this will be added to the {@link CB_AudioFileCache#preferredFormats} property.
 *  @property {integer} [minimumAudioFiles={@link CB_AudioFileCache.minimumAudioFiles_DEFAULT}] - Minimum {@link CB_AudioFile} objects to create internally. It must be an integer being 1 the minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#minimumAudioFiles} property.
 *  @property {integer|null} [maximumAudioFiles={@link CB_AudioFileCache.maximumAudioFiles_DEFAULT}] - Maximum {@link CB_AudioFile} objects that are allowed to be created internally. If it is set to null, there will not be a maximum (it will be unlimited). If an integer is provided, it must be the same number or greater than the value set in the {@link CB_AudioFileCache#minimumAudioFiles} property (also provided by the "minimumAudioFiles" of this object), allowing 1 minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#maximumAudioFiles} property.
 *  @property {integer} [minimumAudioFilesFree=parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.25 + 0.5)] - New {@link CB_AudioFile} objects will be created internally when the number of free {@link CB_AudioFile} objects reaches this limit. If provided, it must be an integer being 0 (zero) the minimum. It will end using a 25% of the {@link CB_AudioFileCache#minimumAudioFiles} by default, rounded to ceil, allowing 0 (zero) minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#minimumAudioFilesFree} property.
 *  @property {integer} [newAudioFilesWhenNeeded=Math.min(parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.1 + 0.5), 1)] - Number of new {@link CB_AudioFile} objects to create internally when the minimum limit of free {@link CB_AudioFile} objects ({@link CB_AudioFileCache#minimumAudioFilesFree}) is reached. If provided, it must be an integer being 0 (zero) the minimum. It will end using a 10% of the {@link CB_AudioFileCache#minimumAudioFiles} by default, rounded to ceil, allowing 1 minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#newAudioFilesWhenNeeded} property.
 *  @property {integer} [retries={@link CB_AudioFileCache.retries_DEFAULT}] - Number of retries to try to load a {@link CB_AudioFile} object internally before trying to load the next possible one (if any). It must be an integer being 0 the minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#retries} property.
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
 *  @classdesc Class to manage a cache with multiple {@link CB_AudioFile} objects (they should be the same sound although they can be in different formats). This is not only useful for performance purposes but also for being able to play the same sound simultaneously and multiple times in different audio APIs and clients.
 *  @param {CB_AudioFileCache.DATA_OBJECT} [dataObject] - Object with the desired data and options for the audio files cache.
 *  @returns {CB_AudioFileCache} Returns a new {@link CB_AudioFileCache} object.
 *  @todo Do not allow to create one object with an "id" which has already been used (unless the value is undefined, null...).
 *  @todo Method getCopy and static method filterProperties (similar to the ones from {@link CB_GraphicSprites} and {@link CB_GraphicSpritesScene}).
 */
var CB_AudioFileCache = function(dataObject)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_AudioFileCache)) { return new CB_AudioFileCache(dataObject); }
	
	//Static properties and constants:
	/**
	 * Keeps the default volume. If the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT} property is true, this will keep the result of calling the {@link CB_Speaker.getVolume} function. Otherwise, it will use the value of the {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME} variable.
	 *	@constant
	 *  @type {number}
	 *  @default CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME
	 */
	CB_AudioFileCache.prototype.DEFAULT_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME;
	
	//Properties and variables:
	/**
	 * Tells whether the cache is unloaded ({@link CB_AudioFileCache.UNLOADED}), loading ({@link CB_AudioFileCache.LOADING}), unchecked ({@link CB_AudioFileCache.UNCHECKED}), checking ({@link CB_AudioFileCache.CHECKING}), loaded ({@link CB_AudioFileCache.LOADED}), failed ({@link CB_AudioFileCache.FAILED}) or aborted ({@link CB_AudioFileCache.ABORTED}).
	 *	@var CB_AudioFileCache#status
	 *  @readonly
	 *  @type {integer}
	 *  @default {@link CB_AudioFileCache.UNLOADED}
	 */
	this.status = CB_AudioFileCache.UNLOADED;

	/**
     * Stores the identifier for the audio files cache.
	 *	@var
	 *  @readonly
	 *  @type {string}
	 *  @default
	 */
	this.id = "";
		
	/**
     * Stores an array of strings with the preferred audio API or audio APIs, in order of preference. Possible audio APIs are "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {array}
	 *  @default CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS
	 */
	this.preferredAPIs = CB_Configuration[CB_BASE_NAME].CB_AudioFileCache_PREFERRED_AUDIO_APIS;
	
	/**
     * Stores an array of strings with the preferred audio format or audio formats (they can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"'), in order of preference. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {array}
	 *  @default CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS
	 */
	this.preferredFormats = CB_Configuration[CB_BASE_NAME].CB_AudioFileCache_PREFERRED_AUDIO_FORMATS;
	
	/**
     * Object whose property names audio formats and their value is an array of strings with the URIs (audio file paths or audio data URIs) of the audio files in order of preference. The more audio formats and URIs provided the better, as it will help to maximize the compatibility with as many clients as possible (as some audio APIs and client just support some formats, or use absolute paths instead of relative ones, etc.). Even with different formats, all provided URIs should belong to the same audio (this means same sound or same music, with same length, etc.). NOTE: Only some clients with some audio APIs will support data URIs. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {CB_AudioFileCache.URIS_OBJECT}
	 */
	this.URIs = {};
	
	/**
     * Minimum {@link CB_AudioFile} objects to create internally. It must be an integer being 1 the minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default CB_AudioFileCache.minimumAudioFiles_DEFAULT
	 */
	this.minimumAudioFiles = CB_AudioFileCache.minimumAudioFiles_DEFAULT;

	/**
     * Maximum {@link CB_AudioFile} objects that are to be created internally. If it is set to null, there will not be a maximum (it will be unlimited). If an integer is provided, it must be the same number or greater than the value set in the {@link CB_AudioFileCache#minimumAudioFiles} property, allowing 1 minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer|null}
	 *  @default CB_AudioFileCache.maximumAudioFiles_DEFAULT
	 */
	this.maximumAudioFiles = CB_AudioFileCache.maximumAudioFiles_DEFAULT;

	/**
     * New {@link CB_AudioFile} objects will be created internally when the number of free {@link CB_AudioFile} objects reaches this limit. It must be an integer being 0 (zero) the minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.25 + 0.5)
	 */
	this.minimumAudioFilesFree = CB_AudioFileCache._minimumAudioFilesFree_FIRST_VALUE;

	/**
     * Number of new {@link CB_AudioFile} objects to create internally when the minimum limit of free {@link CB_AudioFile} objects ({@link CB_AudioFileCache#minimumAudioFilesFree}) is reached. It must be an integer being 0 (zero) the minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default Math.min(parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.1 + 0.5), 1)
	 */
	this.newAudioFilesWhenNeeded = CB_AudioFileCache._newAudioFilesWhenNeeded_FIRST_VALUE;

	/**
     * Number of retries to try to load a {@link CB_AudioFile} object internally before trying to load the next possible one internally (if any). It must be an integer being 0 the minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default CB_AudioFileCache.retries_DEFAULT
	 */
	this.retries = CB_AudioFileCache.retries_DEFAULT;

	/**
     * Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually). Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default CB_AudioFileCache.checkManually_DEFAULT
	 */
	this.checkManually = CB_AudioFileCache.checkManually_DEFAULT;

	/**
     * Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when creates a new {@link CB_AudioFile} object needed. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT
	 */
	this.checkManuallyOnNeededCreated = CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT;

	/**
     * Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when playing one has failed and tries to reload it. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT
	 */
	this.checkManuallyOnPlayingFailed = CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT;

	/**
     * Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when checking one has failed and tries to reload it. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT
	 */
	this.checkManuallyOnCheckingFailed = CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT;

	/**
     * Desired function to be called once the cache has been loaded. The first and unique parameter will be an integer with the {@link CB_AudioFile} objects that still need to be checked, if any, being "this" the current {@link CB_AudioFileCache} object. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {function}
	 *  @default
	 */
	this.onLoad = null;

	/**
     * Desired function to be called when any kind of error happens. The first and unique parameter will be a string with the error description (if it could be determined), being "this" the current {@link CB_AudioFileCache} object. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {function}
	 *  @default
	 */
	this.onError = null;

	/**
     * Numeric array containing all the {@link CB_AudioFile} objects created internally. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {array}
	 *  @default
	 */
	this.audioFiles = [];

	/**
     * Total number of {@link CB_AudioFile} objects created internally (optimization purposes, to avoid using {@link CB_AudioFileCache#audioFiles}.length). Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default
	 */
	this.audioFilesCreated = 0;

	/**
     * Stack that stores the indexes (belonged to the {@link CB_AudioFileCache#audioFiles} array) of the free {@link CB_AudioFile} objects. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {array}
	 *  @default
	 */
	this.audioFilesFree = [];

	/**
     * Pointer for the {@link CB_AudioFileCache#audioFilesFree} stack (for optimization purposes). Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default
	 */
	this.audioFilesFreePointer = -1;

	/**
     * Object with sound instance identifiers (integers created by the {@link CB_AudioFileCache#play} method) which are going to play (this way we can cancel the sound before it starts playing). Each property name is the identifier of the sound instance and the value will be an object with "cancelled" (boolean, to know whether the sound instance was cancelled or not) and "object" (containing the {@link CB_AudioFile} object used) properties. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {Object}
	 *  @default
	 */
	this.soundInstancesQueued = {};

	/**
     * Stores the minimum duration found among all the {@link CB_AudioFile} objects. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {number}
	 *  @default 0
	 */
	this.duration = 0;

	/**
     * Stores the maximum duration found among all the {@link CB_AudioFile} objects. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {number}
	 *  @default 0
	 */
	this.durationMaximum = 0;
	

	//Internal properties:
	this._URIsListLast = undefined;	
	this._lastSuccededIndexes = {}; //Stores last indexes that were used when an object is created successfully, ordered by URIs and APIs (for optimization purposes).
	this._checkCacheLoadedTimeout = null;
	this._checkCacheLoadedTimeoutMs = 500;
	this._onLoadCalled = false; //Tells whether the onLoad has been called already or not.
	this._existingObjectIds = [];
	this._clearAudioFilesTimeout = null;
	this._createNewAudioFilesIfNeededTimeout = null;
	///////this._callRecursivelyIfNotTooLateCalled = false;
	this._checkingPlaying = false;
	this._settingAPI = false;

	
	//Calls the constructor of the object when creates an instance:
	return this._init(dataObject);
}


//Static properties and constants:
/////CB_AudioFileCache.MAX_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM;
CB_AudioFileCache._soundInstanceIdUnique = 0;

/**
 * Status value for audio file cache which is unloaded. Can be used to compare the value returned by the {@link CB_AudioFileCache#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default 0
 */
CB_AudioFileCache.UNLOADED = 0;

/**
 * Status value for an audio file cache which is loading. Can be used to compare the value returned by the {@link CB_AudioFileCache#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileCache.LOADING = 1;

/**
 * Status value for an audio file cache which has not been checked yet. Can be used to compare the value returned by the {@link CB_AudioFileCache#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileCache.UNCHECKED = 2;

/**
 * Status value for an audio file cache which is being checked currently. Can be used to compare the value returned by the {@link CB_AudioFileCache#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileCache.CHECKING = 3;

/**
 * Status value for an audio file cache which has been loaded. Can be used to compare the value returned by the {@link CB_AudioFileCache#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileCache.LOADED = 4;

/**
 * Status value for an audio file cache which failed to be loaded or failed for any other reason. Can be used to compare the value returned by the {@link CB_AudioFileCache#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileCache.FAILED = 5;

/**
 * Status value for an audio file cache which has been aborted. This will happen when the audio file cache has been destroyed with the {@link CB_AudioFileCache#destructor} method. Can be used to compare the value returned by the {@link CB_AudioFileCache#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileCache.ABORTED = 6;

/**
 * Default value for the {@link CB_AudioFileCache#minimumAudioFiles} property.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileCache.minimumAudioFiles_DEFAULT = 2;

/**
 * Default value for the {@link CB_AudioFileCache#maximumAudioFiles} property.
 *	@constant
 *  @type {integer|null}
 *  @default null
 */
CB_AudioFileCache.maximumAudioFiles_DEFAULT = null;

/**
 * Default value for the {@link CB_AudioFileCache#retries} property.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileCache.retries_DEFAULT = 1;

/**
 * Default value for the {@link CB_AudioFileCache#checkManually} property.
 *	@constant
 *  @type {boolean}
 *  @default false
 */
CB_AudioFileCache.checkManually_DEFAULT = false;

/**
 * Default value for the {@link CB_AudioFileCache#checkManuallyOnNeededCreated} property.
 *	@constant
 *  @type {boolean}
 *  @default false
 */
CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT = false;

/**
 * Default value for the {@link CB_AudioFileCache#checkManuallyOnPlayingFailed} property.
 *	@constant
 *  @type {boolean}
 *  @default false
 */
CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT = false;

/**
 * Default value for the {@link CB_AudioFileCache#checkManuallyOnCheckingFailed} property.
 *	@constant
 *  @type {boolean}
 *  @default false
 */
CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT = false;

CB_AudioFileCache._minimumAudioFilesFree_FIRST_VALUE = 1; //First value for the {@link CB_AudioFileCache#minimumAudioFilesFree} property, although it will end using a 25% of the {@link CB_AudioFileCache#minimumAudioFiles} by default, rounded to ceil, allowing 0 (zero) minimum.
CB_AudioFileCache._newAudioFilesWhenNeeded_FIRST_VALUE = 1; //First value for the {@link CB_AudioFileCache#newAudioFilesWhenNeeded} property, although it will end using a 10% of the {@link CB_AudioFileCache#minimumAudioFiles} by default, rounded to ceil, allowing 1 minimum.


//Constructor:
CB_AudioFileCache.prototype._init = function(dataObject)
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
				[onError : Function]
			};
	*/

	//Tries to load the data (if any):
	this.load(dataObject);
	
	//Returns the object:
	return this;
}


/**
 * Destroys the audio file cache object, including all the internal {@link CB_AudioFile} objects, and frees memory. By default, unless the "preventAbortedStatus" is set to true, sets the current status of the audio file cache object as ABORTED ({@link CB_AudioFileCache.ABORTED} value).
 *  @function
 *  @param {boolean} [stopSounds=false] - Used as the "stopSound" parameter when calling internally the {@link CB_AudioFile#destructor} method for all the {@link CB_AudioFile} objects.
 *  @param {boolean} [preventAbortedStatus=false] - If set to true (not recommended), it will not assign the status of "ABORTED" (it will not assign the value of {@link CB_AudioFileCache.ABORTED} to the {@link CB_AudioFileCache#status} property).
 */
CB_AudioFileCache.prototype.destructor = function(stopSounds, preventAbortedStatus)
{
	clearTimeout(this._checkCacheLoadedTimeout);
	clearTimeout(this._clearAudioFilesTimeout);
	clearTimeout(this._createNewAudioFilesIfNeededTimeout);

	this.cancelSoundInstances(true, true);
	
	//Destroys all sounds:
	this.destroyAll(stopSounds);
	
	//Resets properties to their default value:
	this.preferredAPIs = CB_Configuration[CB_BASE_NAME].CB_AudioFileCache_PREFERRED_AUDIO_APIS;
	this.preferredFormats = CB_Configuration[CB_BASE_NAME].CB_AudioFileCache_PREFERRED_AUDIO_FORMATS;
	this.URIs = {};
	this.minimumAudioFiles = CB_AudioFileCache.minimumAudioFiles_DEFAULT;
	this.maximumAudioFiles = CB_AudioFileCache.maximumAudioFiles_DEFAULT;
	this.minimumAudioFilesFree = CB_AudioFileCache._minimumAudioFilesFree_FIRST_VALUE;
	this.newAudioFilesWhenNeeded = CB_AudioFileCache._newAudioFilesWhenNeeded_FIRST_VALUE;
	this.retries = CB_AudioFileCache.retries_DEFAULT;
	this.checkManually = CB_AudioFileCache.checkManually_DEFAULT;
	this.checkManuallyOnNeededCreated = CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT;
	this.checkManuallyOnPlayingFailed = CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT;
	this.checkManuallyOnCheckingFailed = CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT;
	this.onLoad = null;
	this.onError = null;
	this.audioFiles = [];
	this.audioFilesCreated = 0;
	this.soundInstancesQueued = {};
	this.duration = 0;
	this.durationMaximum = 0;
	
	//Resets the audioFilesFree stack and its pointer:
	this.audioFilesFree = [];
	this.audioFilesFreePointer = -1;
	
	//Sets the status as ABORTED:
	if (!preventAbortedStatus) { this.status = CB_AudioFileCache.ABORTED; }
}


/**
 * Loads the audio file cache with the desired data given. This method is called by the constructor automatically. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio.
 *  @function
 *  @param {CB_AudioFileCache.DATA_OBJECT} dataObject - Object with the desired data and options for the audio files cache.
 *  @returns {CB_AudioFileCache|null} If a "dataObject" is given, it returns the current {@link CB_AudioFileCache} object. Otherwise, it returns null.
 */
CB_AudioFileCache.prototype.load = function(dataObject)
{
	if (typeof(dataObject) === "undefined" || dataObject === null) { return null; }

	this.status = CB_AudioFileCache.LOADING; //The cache is loading.
	
	//Destroys all previous data (if any):
	this.destructor(true, true); //Also stops all sounds.

	//Sanitizes the given data:
	dataObject.id = CB_trim(dataObject.id);
	dataObject.minimumAudioFiles = parseInt(CB_trim(dataObject.minimumAudioFiles));
	if (dataObject.maximumAudioFiles !== null) { dataObject.maximumAudioFiles = parseInt(CB_trim(dataObject.maximumAudioFiles)); }
	dataObject.minimumAudioFilesFree = parseInt(CB_trim(dataObject.minimumAudioFilesFree))
	dataObject.newAudioFilesWhenNeeded = parseInt(CB_trim(dataObject.newAudioFilesWhenNeeded))
	dataObject.retries = parseInt(CB_trim(dataObject.retries));
	
	//Sets the new data:
	if (dataObject.id !== "") { this.id = dataObject.id; }
	if (CB_isArray(dataObject.preferredAPIs) && dataObject.preferredAPIs.length > 0 && CB_trim(dataObject.preferredAPIs.join("")) !== "") { this.preferredAPIs = dataObject.preferredAPIs; }
	if (CB_isArray(dataObject.preferredFormats) && dataObject.preferredFormats.length > 0 && CB_trim(dataObject.preferredFormats.join("")) !== "") { this.preferredFormats = dataObject.preferredFormats; }
	if (typeof(dataObject.URIs) !== "undefined") { this.URIs = dataObject.URIs; }
	if (dataObject.minimumAudioFiles !== "" && !isNaN(dataObject.minimumAudioFiles) && dataObject.minimumAudioFiles >= 1)
	{
		this.minimumAudioFiles = dataObject.minimumAudioFiles;
	}
	if (dataObject.maximumAudioFiles === null || dataObject.maximumAudioFiles !== "" && !isNaN(dataObject.maximumAudioFiles) && dataObject.maximumAudioFiles >= this.minimumAudioFiles)
	{
		this.maximumAudioFiles = dataObject.maximumAudioFiles;
	}
	else { this.maximumAudioFiles = CB_AudioFileCache.maximumAudioFiles_DEFAULT; }
	if (dataObject.minimumAudioFilesFree !== "" && !isNaN(dataObject.minimumAudioFilesFree) && dataObject.minimumAudioFilesFree >= 0)
	{
		this.minimumAudioFilesFree = dataObject.minimumAudioFilesFree;
	}
	else
	{
		//Uses a limit of 25% of the minimum by default:
		this.minimumAudioFilesFree = parseInt(this.minimumAudioFiles * 0.25 + 0.5); //Ceil round.
	}
	if (dataObject.newAudioFilesWhenNeeded !== "" && !isNaN(dataObject.newAudioFilesWhenNeeded) && dataObject.newAudioFilesWhenNeeded >= 0)
	{
		this.newAudioFilesWhenNeeded = dataObject.newAudioFilesWhenNeeded;
	}
	else
	{
		//Creates a 10% of the minimum by default:
		this.newAudioFilesWhenNeeded = parseInt(this.minimumAudioFiles * 0.1 + 0.5); //Ceil round.
		if (this.newAudioFilesWhenNeeded < 1) { this.newAudioFilesWhenNeeded = 1; }
	}

	if (dataObject.retries !== "" && !isNaN(dataObject.retries) && dataObject.retries >= 0)
	{
		this.retries = dataObject.retries;
	}
	
	if (typeof(dataObject.checkManually) !== "undefined" && dataObject.checkManually !== null) { this.checkManually = dataObject.checkManually; }
	if (typeof(dataObject.checkManuallyOnNeededCreated) !== "undefined" && dataObject.checkManuallyOnNeededCreated !== null) { this.checkManuallyOnNeededCreated = dataObject.checkManuallyOnNeededCreated; }
	if (typeof(dataObject.checkManuallyOnPlayingFailed) !== "undefined" && dataObject.checkManuallyOnPlayingFailed !== null) { this.checkManuallyOnPlayingFailed = dataObject.checkManuallyOnPlayingFailed; }
	if (typeof(dataObject.checkManuallyOnCheckingFailed) !== "undefined" && dataObject.checkManuallyOnCheckingFailed !== null) { this.checkManuallyOnCheckingFailed = dataObject.checkManuallyOnCheckingFailed; }
	if (typeof(dataObject.onLoad) === "function") { this.onLoad = dataObject.onLoad; }
	if (typeof(dataObject.onError) === "function") { this.onError = dataObject.onError; }

	//If we want, loads the needed objects (if any):
	var disableAutoLoad = false;
	if (typeof(dataObject.disableAutoLoad) !== "undefined" && dataObject.disableAutoLoad !== null) { disableAutoLoad = dataObject.disableAutoLoad; }
	if (!disableAutoLoad) { this.createAudioFiles(this.minimumAudioFiles); } //Creates the minimum number of objects desired.
	
	return this;
}


/**
 * Creates the desired number of internal {@link CB_AudioFile} objects (inside the {@link CB_AudioFileCache#audioFiles} property). This method is already called by the {@link CB_AudioFileCache#load} method automatically (unless the "disableAutoLoad" property has been set to true in the "dataObject" given). Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio.
 *  @function
 *  @param {integer} minimumAudioFiles - Minimum {@link CB_AudioFile} objects to create internally. It must be an integer being 1 the minimum. If a valid value is given, this will be added to the {@link CB_AudioFileCache#minimumAudioFiles} property.
 *  @param {boolean} [setAsLoaded=false] - If the {@link CB_AudioFile} objects already created internally (before calling this method) does not reach the number given in the "minimumAudioFiles", this parameter will be ignored. Otherwise, if set to true, it will set the {@link CB_AudioFileCache.status} property as "LOADED" (the value of the {@link CB_AudioFileCache#LOADED} property) after reaching the desired number. If set to false, the {@link CB_AudioFileCache.status} property will be set as "LOADED" {@link CB_AudioFileCache#LOADED} property) if the {@link CB_AudioFileCache#checkManually} property is set to true or set as "UNCHECKED" if the {@link CB_AudioFileCache#checkManually} property is set to false. Internal usage only recommended.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects which are intended to be created (they could fail).
 */
CB_AudioFileCache.prototype.createAudioFiles = function(minimumAudioFiles, setAsLoaded)
{
	this.status = CB_AudioFileCache.LOADING; //The cache is loading.
	
	if (typeof(minimumAudioFiles) === "undefined" || minimumAudioFiles === null || isNaN(minimumAudioFiles) || minimumAudioFiles < 1) { minimumAudioFiles = this.minimumAudioFiles; }
	
	//If there is a maximum of files set:
	if (typeof(this.maximumAudioFiles) !== "undefined" && this.maximumAudioFiles !== null && !isNaN(this.maximumAudioFiles) && this.maximumAudioFiles >= 1)
	{
		//If the minimum of files we want is bigger than the maximum, throws an error and exits:
		if (minimumAudioFiles > this.maximumAudioFiles)
		{
			this.errorFunction("Cannot create " + minimumAudioFiles + " audio files. Maximum is " + this.maximumAudioFiles + ".");
			return 0;
		}
	}
	
	//Sets as the minimum objects to create the number given:
	this.minimumAudioFiles = minimumAudioFiles;
	
	//Clears the array of the AudioFiles:
	this.clearAudioFiles();
	
	//Creates the objects if they do not exist already:
	this.audioFilesCreated = 0;
	var audioFilesCreated = 0;
	var audioFilesCreating = 0;
	var audioFile;
	var that = this;
	for (var x = 0; x < minimumAudioFiles; x++)
	{
		//If an object is needed:
		if (typeof(this.audioFiles[x]) === "undefined" || this.audioFiles[x] === null)
		{
			//this.audioFiles[x] = this.createAudioFile(); //If loads correctly, it will increase the audioFilesCreated property.
			//Creates a new object:
			/////setTimeout //Uses a delay to prevent Firefox error ("Media resource [URI] could not be decoded") since AAPI and SM2 call play() method (and many calls to play() method would fail).
			/////(
//////////					function()
				/////{
					audioFile = that.createAudioFile(null, null, null, null, null, null, true); //If loads correctly, it will increase the audioFilesCreated property.
					audioFilesCreating++;
				//////},
				/////////x * 10 + 1
			//////);
			//If no object has been created, throws an error (cache status will be FAILED):
			//////////if (typeof(audioFile) === "undefined" || audioFile === null)
			{
				////////////this.errorFunction("Tried to create the audio object #" + x + " but is undefined or null.");
				////////////return; //Exits the function.
			}
		}
		else { audioFilesCreated++; }

		//If the cache has already failed or is aborted, just exits:
		if (this.status === CB_AudioFileCache.FAILED || this.status === CB_AudioFileCache.ABORTED) { return audioFilesCreating; }
	}
	
	//If the files are already created, the cache has finished loading:
	//if (audioFilesCreated >= minimumAudioFiles) { this.status = CB_AudioFileCache.LOADED; }
	if (audioFilesCreated >= minimumAudioFiles) { this.status = this.checkManually  && !setAsLoaded ? CB_AudioFileCache.UNCHECKED : CB_AudioFileCache.LOADED; }
	
	//Stores the number of files already created:
	this.audioFilesCreated += audioFilesCreated; //It is an addition because some objects could have been created asynchronously.
	
	return audioFilesCreating;
}


/**
 * Creates one internal {@link CB_AudioFile} object (inside the {@link CB_AudioFileCache#audioFiles} property). This method is already called by the {@link CB_AudioFileCache#createAudioFiles} method and other methods automatically. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio. Internal usage only recommended.
 *  @function
 *  @param {CB_AudioFileCache.URIS_OBJECT} [URIs={@link CB_AudioFileCache#URIs}] - Object whose property names audio formats and their value is an array of strings with the URIs (audio file paths or audio data URIs) of the audio files in order of preference. It will try to calculate and use the best audio format for the current client and use the first working URI (audio file path or data URI). The more audio formats and URIs provided the better, as it will help to maximize the compatibility with as many clients as possible (as some audio APIs and client just support some formats, or use absolute paths instead of relative ones, etc.). Even with different formats, all provided URIs should belong to the same audio (this means same sound or same music, with same length, etc.). NOTE: Only some clients with some audio APIs will support data URIs.
 *  @param {array} [preferredAPIs={@link CB_AudioFileCache#preferredAPIs}] - Array of strings with the preferred audio API or audio APIs, in order of preference. Possible audio APIs are "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). It will try to calculate and use the best one for the current client.
 *  @param {array} [preferredFormats={@link CB_AudioFileCache#preferredFormats}] - Array of strings with the preferred audio format or audio formats (they can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"'), in order of preference. It will try to calculate and use the best one for the current client.
 *  @param {CB_AudioFile} [audioObject] - A {@link CB_AudioFile} object that we want to reuse instead of creating a new one (for performance purposes).
 *  @param {function} [callbackOk] - Function with no parameters that will be called once the {@link CB_AudioFile} object is created and loaded successfully (or after it has been checked successfully, depending on the desired option), being "this" the {@link CB_AudioFileCache} object itself.
 *  @param {function} [callbackError] - Function called when any error is produced during creation, loading or checking process, etc. The unique parameter will be a string describing the error (if it was possible to be determined), being "this" the {@link CB_AudioFileCache} object itself.
 *  @param {boolean} [storeURIsList=false] - If set to true, it will store internally the valid supported "URIs" from the given ones (needed by the {@link CB_AudioFileCache#setAudioAPIAll} method, for example). Internal usage only recommended.
 *  @param {boolean} [checkAutomatically=false] - If set to true (not recommended), it will call the {@link CB_AudioFile#checkPlaying} method automatically. Otherwise, it will perform according to the value set at the {@link CB_AudioFileCache#checkManually} property. Internal usage only recommended.
 *  @returns {CB_AudioFile|null} If it fails, it returns null. Otherwise, returns the {@link CB_AudioFile} that has been created or reused.
 */
CB_AudioFileCache.prototype.createAudioFile = function(URIs, preferredAPIs, preferredFormats, audioObject, callbackOk, callbackError, storeURIsList, checkAutomatically)
{
	//If the cache has already failed or is aborted, just exits:
	if (this.status === CB_AudioFileCache.FAILED || this.status === CB_AudioFileCache.ABORTED) { return null; }

	this.status = CB_AudioFileCache.LOADING; //The cache is loading.

	//If not given, uses default parameters:
	if (typeof(URIs) === "undefined" || URIs === null) { URIs = this.URIs; }
	if (!CB_isArray(preferredAPIs) || preferredAPIs.length === 0 || CB_trim(preferredAPIs.join("")) === "") { preferredAPIs = this.preferredAPIs; }
	if (!CB_isArray(preferredFormats) || preferredFormats.length === 0 || CB_trim(preferredFormats.join("")) === "") { preferredFormats = this.preferredFormats; }

	//Filters the audio APIs to just use the supported ones:
	preferredAPIs = CB_AudioDetector.getSupportedAPIs(preferredAPIs);
	//If preferredAPIs is empty, throws the error and exits:
	if (preferredAPIs.length === 0) { this.errorFunction("No API supported from the provided ones."); return null; }

	//Filters the audio formats to just use the supported ones (also orders them with the "probably" ones first):
	var preferredFormatsSupported = CB_AudioDetector.getSupportedAudioFormats(preferredFormats, ["probably", "maybe"]);
	if (preferredFormatsSupported.length > 0) { preferredFormats = preferredFormatsSupported; } //Only uses the filtered ones if there is at least one.
	else { this.errorFunction("No format supported from the provided ones."); return null; }

	//Filters the URIs given to just use the ones whose format is supported:
	var URIsList = [];
	var preferredFormatsLength = preferredFormats.length;
	var y, URIsListCurrentLength, isDataURI;
	for (var x = 0; x < preferredFormatsLength; x++)
	{
		//If the support format has URIs associated:
		if (typeof(URIs[preferredFormats[x]]) !== "undefined" && CB_isArray(URIs[preferredFormats[x]]))
		{
			URIsListCurrentLength = URIs[preferredFormats[x]].length;
			for (y = 0; y < URIsListCurrentLength; y++)
			{
				//Only stores it if this kind of URI (data URI or normal one) is supported by the format:
				if (!CB_isString(URIs[preferredFormats[x]][y])) { continue; }
				isDataURI = (URIs[preferredFormats[x]][y].substring(0, 5).toLowerCase() === "data:");
				if (CB_AudioDetector.isAudioFormatSupported(preferredFormats[x], isDataURI) !== "")
				{
					//Stores the current URI:
					URIsList[URIsList.length] = URIs[preferredFormats[x]][y++];
				}
			}
		}
	}

	//If there are not URIs supported, throws the error and exits:		
	if (URIsList.length === 0) { this.errorFunction("No URI supported from the provided ones."); return null; }
	else if (storeURIsList) { this._URIsListLast = URIsList; }

	//Returns the object created:
	return this._createAudioFileObjectRecursively(URIsList, preferredAPIs, audioObject, callbackOk, callbackError, null, null, null, null, null, checkAutomatically);
}


//Function that creates an audio file object trying given URIs and given APIs (internal usage only):
CB_AudioFileCache.prototype._createAudioFileObjectRecursively = function(URIsList, preferredAPIs, audioObject, callbackOk, callbackError, URIsListIndex, stopAtURIsListIndex, preferredAPIsIndex, stopAtPreferredAPIsIndex, retryNumber, checkAutomatically)
{
	this.status = CB_AudioFileCache.LOADING; //The cache is loading.
	
	//If there are not URIs supported, throws the error and exits:
	if (!CB_isArray(URIsList) || URIsList.length === 0) { this.errorFunction("The URIs provided are not in an array or its length is 0."); return null; }

	//If not given, uses default parameters:
	if (typeof(URIsListIndex) === "undefined" || URIsListIndex === null || isNaN(URIsListIndex)) { URIsListIndex = 0; }
	if (typeof(preferredAPIsIndex) === "undefined" || preferredAPIsIndex === null || isNaN(preferredAPIsIndex)) { preferredAPIsIndex = 0; }
	if (typeof(retryNumber) === "undefined" || retryNumber === null || isNaN(retryNumber)) { retryNumber = 0; }

	//If it does not exist yet, creates the last succeeded indexes for the given URIs and the given preferred APIs:
	if (typeof(this._lastSuccededIndexes[URIsList]) === "undefined" || this._lastSuccededIndexes[URIsList] === null)
	{
		this._lastSuccededIndexes[URIsList] = {};
	}
	if (typeof(this._lastSuccededIndexes[URIsList][preferredAPIs]) === "undefined" || this._lastSuccededIndexes[URIsList][preferredAPIs] === null)
	{
		this._lastSuccededIndexes[URIsList][preferredAPIs] = { "URIsListIndex" : 0, "preferredAPIsIndex" : 0 }; //The first time, starts at the beginning.
	}
	
	//If this is not a recursive call (stopAtURIsListIndex will still not be created):
	if (typeof(stopAtURIsListIndex) === "undefined" || stopAtURIsListIndex === null)
	{
		//We continue from the last succeeded API and last succeeded URI (optimization purposes):
		URIsListIndex = this._lastSuccededIndexes[URIsList][preferredAPIs]["URIsListIndex"];
		preferredAPIsIndex = this._lastSuccededIndexes[URIsList][preferredAPIs]["preferredAPIsIndex"];
		
		//Calculates when we should stop trying to create the object (the last API and last URI we should try):
		stopAtPreferredAPIsIndex = preferredAPIsIndex;
		stopAtURIsListIndex = URIsListIndex - 1;
		if (stopAtURIsListIndex < 0)
		{
			stopAtURIsListIndex = URIsList.length - 1;
			stopAtPreferredAPIsIndex--;
			if (stopAtPreferredAPIsIndex < 0)
			{
				stopAtPreferredAPIsIndex = preferredAPIs.length - 1;
			}
		}
	}
	
	var that = this;
	
	//Function to call when the object is created successfully:
	var callbackOkFunction =
		function()
		{
			//Stores the API index and the URI index to use the next time (for optimization purposes):
			that._lastSuccededIndexes[URIsList][preferredAPIs]["URIsListIndex"] = URIsListIndex;
			that._lastSuccededIndexes[URIsList][preferredAPIs]["preferredAPIsIndex"] = preferredAPIsIndex;
			
			if (typeof(callbackOk) === "function") { callbackOk.call(that); }
		};
	
	
	//Function to call when the object has failed (has not been created):
	var callbackErrorFunction =
		function(error)
		{
			//If the cache has already failed or is aborted, just exits:
			if (that.status === CB_AudioFileCache.FAILED || that.status === CB_AudioFileCache.ABORTED) { return; }
			///////if (allAttemptsFailed) { return; }

			//If we have already tried all, throws an error (the status of the cache will be set to FAILED):
			if (preferredAPIsIndex === stopAtPreferredAPIsIndex && URIsListIndex === stopAtURIsListIndex && retryNumber === that.retries)
			{
				///////allAttemptsFailed = true;
				that.errorFunction("A new audio object could not be created. All attempts failed. Last message: " + error);
				if (typeof(callbackError) === "function") { callbackError.call(that, "A new audio object could not be created. All attempts failed. Last message: " + error); }
				return;
			}
			//...otherwise, continues trying:
			else
			{
				retryNumber++; //Increases the retries counter.
				
				//If the current retries are more than the allowed ones, passes to try the next method:
				if (retryNumber > that.retries)
				{
					//Sanitizes the indexes for the next recursive call:
					URIsListIndex++;
					URIsListIndex %= URIsList.length;
					if (URIsListIndex === 0)
					{
						preferredAPIsIndex++;
						preferredAPIsIndex %= preferredAPIs.length;
					}
					retryNumber = 0;
				}
				
				//Calls the function again:
				that._createAudioFileObjectRecursively(URIsList, preferredAPIs, audioObject, callbackOk, callbackError, URIsListIndex, stopAtURIsListIndex, preferredAPIsIndex, stopAtPreferredAPIsIndex, retryNumber, checkAutomatically);
				//that._createAudioFileObject(URIsList[URIsListIndex], null, preferredAPIs[preferredAPIsIndex], callbackOk, callbackError, audioObject);
			}
		};
	
	this._onLoadCalled = false; //Forces to call onLoad function again.
	
	audioObject = this._createAudioFileObject(URIsList[URIsListIndex], null, preferredAPIs[preferredAPIsIndex], callbackOkFunction, callbackErrorFunction, audioObject, checkAutomatically);
	
	return audioObject;
}


//Checks and declares whether the cache is completely loaded or not:
CB_AudioFileCache.prototype._checkCacheLoaded = function(objectsNeedChecking)
{
	clearTimeout(this._checkCacheLoadedTimeout);
	
	//If the method checkPlayingAll is executing, exits:
	if (this._checkingPlaying || this._settingAPI) { return; }
	
	//If the cache has failed or has been aborted or it is already loaded, just exits:
	if (this.status === CB_AudioFileCache.FAILED || this.status === CB_AudioFileCache.ABORTED || this.status === CB_AudioFileCache.LOADED) { return; }
	
	//Clears the array of the AudioFiles:
	this.clearAudioFiles(true);
	
	if (typeof(objectsNeedChecking) === "undefined" || objectsNeedChecking === null || isNaN(objectsNeedChecking) || objectsNeedChecking < 0) { objectsNeedChecking = 0; }
	
	//If we don't need more objects, the cache is LOADED:
	if (this.audioFilesCreated >= this.minimumAudioFiles || this.checkManually && this.audioFilesCreated + objectsNeedChecking >= this.minimumAudioFiles)
	{
		//Sets the cache status as loaded:
		//this.status = CB_AudioFileCache.LOADED;
		this.status = (objectsNeedChecking > 0) ? CB_AudioFileCache.UNCHECKED : CB_AudioFileCache.LOADED;
		//If we have not called the onLoad function, calls the onLoad function (if any):
		if (!this._onLoadCalled && typeof(this.onLoad) === "function")
		{
			this._onLoadCalled = true;
			this.onLoad.call(this, objectsNeedChecking);
		}
	}
}


//Function that creates an audio file (internal usage only):
CB_AudioFileCache.prototype._createAudioFileObject = function(filePath, audioId, audioAPI, callbackOk, callbackError, audioObject, checkAutomatically)
{
	this.status = CB_AudioFileCache.LOADING; //The cache is loading.

	//If there is a limit and we have already reached the maximum of objects allowed, throws an error:
	if (typeof(this.maximumAudioFiles) !== "undefined" && this.maximumAudioFiles !== null && !isNaN(this.maximumAudioFiles) && this.maximumAudioFiles >= 1)
	{
		if (this.audioFilesCreated >= this.maximumAudioFiles)
		{
			this.errorFunction("A new object cannot be created. Maximum (" + this.maximumAudioFiles + ") reached.");
			return null;
		}
	}

	var that = this;
	
	//Defines the function to call when the audio object is created successfully:
	var callbackOkFunction =
		function()
		{
			//If the sound needs to be checked, checks it and calls the function again if all is fine:
			if ((!that.checkManually || checkAutomatically) && audioObject.getStatus() === CB_AudioFile.UNCHECKED)
			{
				audioObject.checkPlaying(callbackOkFunction, callbackErrorFunction, false, false, true);
				return;
			}
			
			//Clears the array of the AudioFiles:
			that.clearAudioFiles();
			
			var audioFilesIndex = that.audioFiles.length;
			
			//If the object already exists, gets its index in the array:
			if (CB_indexOf(that._existingObjectIds, audioObject.id) !== -1)
			{
				//Search the object in the array:
				var audioFilesLength = that.audioFiles.length;
				var indexFound = false;
				for (var x = 0; x < audioFilesLength; x++)
				{
					//If the object is defined and not null:
					if (typeof(that.audioFiles[x]) !== "undefined" && that.audioFiles[x] !== null)
					{
						//If the object ID is the same as the current one:
						if (typeof(that.audioFiles[x].id) !== "undefined" && that.audioFiles[x].id === audioObject.id)
						{
							//Gets its index and exists the bucle:
							audioFilesIndex = x;
							
							indexFound = true;
							
							//Exists the bucle:
							break;
						}
					}
				}
				
				//The object already existed but could not be found (which means it has been deleted by the Error function), so exits:
				//if (!indexFound) { return; } //Avoids calling the Ok function if the Error function has already been called.
			}
			
			//Stores the object ID to the existing ones:
			that._existingObjectIds[that._existingObjectIds.length] = audioObject.id;

			//Inserts the object into the array:
			that.audioFiles[audioFilesIndex] = audioObject;

			//The new object is free so we insert its index in the stack for free elements:
			that.audioFilesFree[++that.audioFilesFreePointer] = audioFilesIndex; //Also increases the pointer.
			
			//Increases the counter of the objects created:
			that.audioFilesCreated++;

			//Clears the array of the AudioFiles:
			that.clearAudioFiles();

			//If we don't need more objects, we will check again after some time (before declaring the cache as LOADED) because some objects can still fire onerror (specially with SM2):				
			/*
			clearTimeout(that._checkCacheLoadedTimeout); //Stops the previous timeout to check whether the cache is loaded (if any).
			if (that.audioFilesCreated >= that.minimumAudioFiles)
			{
				that._checkCacheLoadedTimeout = setTimeout(function() { that._checkCacheLoaded.call(that); }, that._checkCacheLoadedTimeoutMs);
			}
			*/
			
			//Stores the minimum and maximum duration found:
			var duration = audioObject.getDuration();
			if (duration > 0 && (that.duration === 0 || duration < that.duration)) { that.duration = duration; }
			if (duration > that.durationMaximum) { that.durationMaximum = duration; }
		
			//Calls the given OK function (if any):
			if (typeof(callbackOk) === "function") { callbackOk.call(that); }
		};
	
	//Defines the function to call when the audio object could not be created (failed):
	var callbackErrorFunction =
		function(error)
		{
			//Clears the array of the AudioFiles:
			that.clearAudioFiles();

			//If the object was already stored in the array (already existed):
			if (CB_indexOf(that._existingObjectIds, audioObject.id) !== -1)
			{
				//Finds its index in the array:
				var audioFilesLength = that.audioFiles.length;
				for (var x = 0; x < audioFilesLength; x++)
				{
					//If the object is defined and not null:
					if (typeof(that.audioFiles[x]) !== "undefined" && that.audioFiles[x] !== null)
					{
						//If the object ID is the same as the current one:
						if (typeof(that.audioFiles[x].id) !== "undefined" && that.audioFiles[x].id === audioObject.id)
						{
							//Deletes the object from the array:
							that.audioFiles[x] = null;
							
							//This object should not count as created anymore:
							that.audioFilesCreated--;
							
							//Clears the array of the AudioFiles:
							that.clearAudioFiles();
							
							//Exists the bucle:
							break;
						}
					}
				}
			}

			//Stores the object ID to the existing ones:
			that._existingObjectIds[that._existingObjectIds.length] = audioObject.id;
			
			//Calls the given error function (if any):
			if (typeof(callbackError) === "function") { callbackError.call(that, error); }
		};
	
	//If it does not exist yet, tries to create the object:
	if (typeof(audioObject) === "undefined" || audioObject === null)
	{
		this.DEFAULT_VOLUME = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME;
		audioObject =
			new CB_AudioFile
			(
				filePath, //filePath.
				null, //audioId.
				{ autoLoad: true, autoPlay: false, loop: false, volume: CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING ? 0 : this.DEFAULT_VOLUME }, //options (volume is zero to prevent hearing the sound in some web clients).
				audioAPI, //audioAPI.
				callbackOkFunction, //callbackOk.
				callbackErrorFunction //callbackError.
			);
	}
	//...otherwise, if the object already exists, loads it again with the new desired options:
	else
	{
		//audioObject.setVolume(0); //Sets volume to zero to prevent hearing the sound in some web clients.
		if (CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING) { audioObject.mute(); } //Sets volume to zero to prevent hearing the sound in some web clients.
		audioObject.load
		(
			filePath, //filePath.
			audioAPI, //audioAPI.
			false, //autoPlay.
			callbackOkFunction, //callbackOk.
			callbackErrorFunction, //callbackError.
			true //ignoreOldValues.
		);
	}
	
	return audioObject;
}


/**
 * Cleans the array of the {@link CB_AudioFile} objects (taking off the undefined or null ones) which is in the {@link CB_AudioFileCache#audioFiles} property, just keeping the valid ones and clearing (destroying and removing) the others. For performance purposes. Internal usage only recommended.
 *  @function
 *  @param {boolean} [avoidCallingCheckCacheLoaded=false] - If set to false and neither the {@link CB_AudioFileCache#checkPlayingAll} nor the {@link CB_AudioFileCache#setAudioAPIAll} methods are being executed, it will call the {@link CB_AudioFileCache#_checkCacheLoaded} internal method which will call the "onLoad" function defined in the {@link CB_AudioFileCache#onLoad} property if the number of needed {@link CB_AudioFile} objects has been reached (after performing the cleaning process). Internal usage only recommended.
 *  @returns {array} Returns the value of the {@link CB_AudioFileCache#audioFiles} property.
 */
CB_AudioFileCache.prototype.clearAudioFiles = function(avoidCallingCheckCacheLoaded)
{
	clearTimeout(this._clearAudioFilesTimeout);

	var audioFilesClean = [];
	var audioFilesFree = [];
	var audioFilesFreePointer = -1;
	var existingIDs = [];
	var someChecking = false;
	var audioFilesLength = this.audioFiles.length;
	var y = 0;
	var objectsLoaded = 0;
	var objectsNeedChecking = 0;
	var duration = 0;
	var durationMaximum = 0;
	var durationCurrent = 0;
	for (var x = 0; x < audioFilesLength; x++)
	{
		//If the object is defined and not null:
		if (typeof(this.audioFiles[x]) !== "undefined" && this.audioFiles[x] !== null)
		{
			//If the object status exists (it means it is a real CB_AudioFile object):
			if (typeof(this.audioFiles[x].getStatus) !== "undefined")
			{
				//If the object is LOADED, LOADING or CHECKING or UNCHECKED, we keep it:
				if (this.audioFiles[x].getStatus() === CB_AudioFile.LOADED || this.audioFiles[x].getStatus() === CB_AudioFile.LOADING || this.audioFiles[x].getStatus() === CB_AudioFile.CHECKING || this.audioFiles[x].getStatus() === CB_AudioFile.UNCHECKED)
				{
					//Only adds if it has not been added before:
					if (CB_indexOf(existingIDs, this.audioFiles[x].id) === -1)
					{
						audioFilesClean[y] = this.audioFiles[x];
						existingIDs[y++] = this.audioFiles[x].id;

						//If the object is still unchecked or checking, we will wait for it:
						if (this.audioFiles[x].getStatus() === CB_AudioFile.CHECKING || this.audioFiles[x].getStatus() === CB_AudioFile.UNCHECKED) { objectsNeedChecking++; someChecking = true; }
						//...otherwise, if it is LOADED, or its LOADING but its internal object is LOADED (it happens when changing API):
						else if (this.audioFiles[x].getStatus() === CB_AudioFile.LOADED || this.audioFiles[x].getStatus() === CB_AudioFile.LOADING && this.audioFiles[x].getStatus(true) === CB_AudioFile.LOADED)
						//|| this.checkManually && (this.audioFiles[x].getStatus() === CB_AudioFile.UNCHECKED || this.audioFiles[x].getStatus() === CB_AudioFile.CHECKING) //, or we want to check manually and it is UNCHECKED or CHECKING, increases the counter for loaded objects
						{
							objectsLoaded++;
							//If the sound is not playing, it is a free object:
							if (!this.audioFiles[x].isPlaying())
							{
								audioFilesFree[++audioFilesFreePointer] = x; //Stores the position of the object in the array.
							}
							
							durationCurrent = this.audioFiles[x].getDuration();
							if (durationCurrent > 0 && (duration === 0 || durationCurrent < duration)) { duration = durationCurrent; }
							if (durationCurrent > durationMaximum) { durationMaximum = durationCurrent; }
						}
					}
				}
				//...otherwise, just destroy it:
				else
				{
					this.audioFiles[x].destructor(true, false, true); //Also stops it and avoids firing its onStop.
					this.audioFiles[x] = null;
				}
			}
		}
	}
	
	//Sets the real audio files created:
	this.audioFilesCreated = objectsLoaded;

	this.audioFiles = audioFilesClean; //Stores the new clean array.
	
	this.audioFilesFree = audioFilesFree; //Stores the free objects encountered.
	this.audioFilesFreePointer = audioFilesFreePointer; //Stores the pointer for the array of the free objects.

	//Stores the minimum and maximum duration found:
	this.duration = duration;
	this.durationMaximum = durationMaximum;
	
	var that = this;

	if (!avoidCallingCheckCacheLoaded && !this._checkingPlaying && !this._settingAPI) //Avoids calling the function if checkPlayingAll or setAudioAPIAll are being executed.
	{
		clearTimeout(this._checkCacheLoadedTimeout); //Stops the previous timeout to check whether the cache is loaded (if any).
		//If minimum objects are loaded or we are using manual checkingn and minimum objects are loaded or unchecked/checking:
		if (this.audioFilesCreated >= this.minimumAudioFiles || this.checkManually && this.audioFilesCreated + objectsNeedChecking >= this.minimumAudioFiles)
		{
			//Calls the function to check whether the cache is loaded or not:
			this._checkCacheLoadedTimeout = setTimeout(function() { that._checkCacheLoaded.call(that, objectsNeedChecking); }, this._checkCacheLoadedTimeoutMs);
		}
	}

	//If some were checking, calls the function again after some time:
	if (!this.checkManually && someChecking)
	{
		this._clearAudioFilesTimeout =
			setTimeout
			(
				function() { that.clearAudioFiles.call(that); },
				1
			);
	}
	
	return this.audioFiles;
}


/**
 * If found, takes a given {@link CB_AudioFile} object off the {@link CB_AudioFileCache#audioFiles} property (and reloads it if we want to). NOTE: It does neither destroy nor remove the {@link CB_AudioFile} object so it can be used for other purposes (and if a {@link CB_AudioFile} object is given, it will be tried to be reused by the {@link CB_AudioFileCache#createAudioFile} method internally if it is called). Internal usage only recommended.
 *  @function
 *  @param {CB_AudioFile|string} audioObjectOrId - The {@link CB_AudioFile} object or a string with its identifier (not case sensitive) that we want to remove from the {@link CB_AudioFileCache#audioFiles} property. If a {@link CB_AudioFile} object is given, its {@link CB_AudioFile#id} property (which should be unique always) must be set as it is used to identify the object. NOTE: It does neither destroy nor remove the {@link CB_AudioFile} object so it can be used for other purposes (and if a {@link CB_AudioFile} object is given, it will be tried to be reused by the {@link CB_AudioFileCache#createAudioFile} method internally if it is called).
 *  @param {boolean} [reload=false] - If it is set to true, the {@link CB_AudioFileCache#createAudioFile} method will be called automatically at the end of the process. If a {@link CB_AudioFile} object has been given (through the "audioObjectOrId" parameter) or found by its identifier, it will be tried to be reused by the {@link CB_AudioFileCache#createAudioFile} method (as its "audioObject" parameter).
 *  @param {boolean} [checkManually=false] - Only used when the "reload" parameter is set to true, to calculate the "checkAutomatically" parameter when calling the {@link CB_AudioFileCache#createAudioFile} method internally.
 *  @returns {boolean|CB_AudioFile|null} Returns null if the given "audioObjectOrId" parameter is not a valid {@link CB_AudioFile} object or its {@link CB_AudioFile#id} property is not set or when the "audioObjectOrId" parameter is an empty string. Returns a {@link CB_AudioFile} object, the given one through the "audioObjectOrId" parameter of the first one removed (it should be the first and unique one removed as the ID must be unique), if the {@link CB_AudioFileCache#createAudioFile} method is called internally (it will reuse this {@link CB_AudioFile} object). Otherwise, returns true if the number of internal {@link CB_AudioFile} objects (inside the {@link CB_AudioFileCache#audioFiles} property) has decreased or false otherwise.
 *  @todo Think about calling the {@link CB_AudioFileCache#createAudioFile} method internally (when the "reload" parameter is set to true) only when the {@link CB_AudioFile} object has been found and removed from the {@link CB_AudioFileCache#audioFiles} property.
 */
CB_AudioFileCache.prototype.removeAudioFile = function(audioObjectOrId, reload, checkManually)
{
	if (typeof(audioObjectOrId) === "undefined" || audioObjectOrId === null) { return null; }
	if (!(audioObjectOrId instanceof CB_AudioFile))
	{
		//If a string or number is given, it will be assumed that it is the "id" desired:
		if (CB_isString(audioObjectOrId) || !isNaN(audioObjectOrId)) { audioObjectOrId = { "id" : audioObjectOrId + "" }; }
		else { return null; }
	}
	
	var id = CB_trim(audioObjectOrId.id).toUpperCase();
	if (id === "") { return null; }
	
	//Looks through the array of the objects:
	var audioFilesNew = [];
	var audioFilesFree = [];
	var audioFilesFreePointer = -1;
	var objectsLoaded = 0;
	var audioFilesLength = this.audioFiles.length;
	var duration = 0;
	var durationMaximum = 0;
	var durationCurrent = 0;
	for (var x = 0; x < audioFilesLength; x++)
	{
		//If the object exists:
		if (typeof(this.audioFiles[x]) !== "undefined" && this.audioFiles[x] !== null)
		{
			//If the object does not have the desired ID:
			if (typeof(this.audioFiles[x].id) !== "undefined")
			{
				//If it is not the desired id, stores it in the new array:
				//if (CB_trim(this.audioFiles[x].id).toUpperCase() !== id)
				if (this.audioFiles[x].id !== id)
				{
					audioFilesNew[audioFilesNew.length] = this.audioFiles[x];

					//If it is LOADED or its LOADING but its internal object is LOADED (it happens when changing API):
					if (this.audioFiles[x].getStatus() === CB_AudioFile.LOADED || this.audioFiles[x].getStatus() === CB_AudioFile.LOADING && this.audioFiles[x].getStatus(true) === CB_AudioFile.LOADED)
					{
						objectsLoaded++; //Increases the counter of files loaded (files successfully created).
						
						//If it is not playing, the sound is free:
						if (!this.audioFiles[x].isPlaying())
						{
							audioFilesFree[++audioFilesFreePointer] = x; //Stores the position of the object in the array.
						}
					}
				}
				//...else, if the CB_AudioFile object has been found and the "audioObjectOrId" is not a CB_AudioFile object (as for example if the "audioObjectOrId" parameter was a string with the id instead of a CB_AudioFile object):
				else if (!(audioObjectOrId instanceof CB_AudioFile)) { audioObjectOrId = this.audioFiles[x]; } //Stores it to call the "this.createAudioFile" method later (if we want to).
				//Stores the minimum and maximum duration found:
				durationCurrent = this.audioFiles[x].getDuration();
				if (durationCurrent > 0 && (duration === 0 || durationCurrent < duration)) { duration = durationCurrent; }
				if (durationCurrent > durationMaximum) { durationMaximum = durationCurrent; }
			}
		}
	}

	//Sets the real audio files created:
	this.audioFilesCreated = objectsLoaded;
	
	//Replaces the audio files array with the new one (which should lacks of the id we wanted to remove):
	this.audioFiles = audioFilesNew;
	
	//Replaces the array of the free audio files and its pointer:
	this.audioFilesFree = audioFilesFree; //Stores the free objects encountered.
	this.audioFilesFreePointer = audioFilesFreePointer; //Stores the pointer for the array of the free objects.

	//Stores the minimum and maximum duration found:
	this.duration = duration;
	this.durationMaximum = durationMaximum;
	
	//Returns whether the number of internal CB_AudioFile objects has decreased or not:
	var returningValue = (this.audioFiles.length < audioFilesLength);

	//If we want to reload the sound, we reload it (and will be returned):
	if (reload) { returningValue = this.createAudioFile(null, null, null, audioObjectOrId instanceof CB_AudioFile ? audioObjectOrId : null, null, null, null, !checkManually); } //Uses the same audio object.
	
	return returningValue;
}


//Removes objects with a given status from the cache until reach a desired number (if able):
CB_AudioFileCache.prototype._purgeObjectsStatus = function(desiredNumber, status, includePlaying, stopSounds)
{
	if (typeof(desiredNumber) === "undefined" || desiredNumber === null || isNaN(desiredNumber) || desiredNumber <= 0) { return 0; }
	
	this.clearAudioFiles(true);
	
	var audioFilesLength = this.audioFiles.length;
	var existingObjects = audioFilesLength;
	
	if (existingObjects <= this.minimumAudioFiles || existingObjects <= desiredNumber) { return 0; }
	
	//First, removes not playing ones:
	for (var x = 0; x < audioFilesLength && existingObjects !== desiredNumber; x++)
	{
		//If the object exists and has the desired status, removes it:
		if (typeof(this.audioFiles[x]) !== "undefined" && this.audioFiles[x] !== null)
		{
			if (this.audioFiles[x].getStatus() === status)
			{
				if (!this.audioFiles[x].isPlaying())
				{
					this.audioFiles[x].destructor(stopSounds, false, true); //Avoids firing onStop.
					this.audioFiles[x] = null;
					existingObjects--;
				}
			}
		}
	}

	//Secondly, removes playing ones (if we want to):
	if (includePlaying)
	{
		for (x = 0; x < audioFilesLength && existingObjects !== desiredNumber; x++)
		{
			//If the object exists and has the desired status, removes it:
			if (typeof(this.audioFiles[x]) !== "undefined" && this.audioFiles[x] !== null)
			{
				if (this.audioFiles[x].getStatus() === status)
				{
					this.audioFiles[x].destructor(stopSounds, false, true); //Avoids firing onStop.
					this.audioFiles[x] = null;
					existingObjects--;
				}
			}
		}
	}
	
	this.clearAudioFiles(true);
	
	return audioFilesLength - existingObjects;
}


/**
 * Tries to purge the audio file cache until it reaches a desired number of {@link CB_AudioFile} objects internally (set in the {@link CB_AudioFileCache#audioFiles} property), by removing and destroying some of the current {@link CB_AudioFile} objects. For performance purposes.
 *  @function
 *  @param {integer} desiredNumber - The desired number of internal {@link CB_AudioFile} objects that we want to keep in the {@link CB_AudioFileCache#audioFiles} property. It mus be 1 or greater.
 *  @param {boolean} [setAsMinimumAudioFiles=false] - If set to true, it will set the value of the "desiredNumber" parameter to the {@link CB_AudioFileCache#minimumAudioFiles} property (only when there is a maximum defined in {@link CB_AudioFileCache#maximumAudioFiles}).
 *  @param {boolean} [includePlaying=false] - If it is set to true and removing non-playing {@link CB_AudioFile} objects was not enough to reach the desired number (defined in the "desiredNumber" parameter), it will also try to remove objects which are being playing currently.
 *  @param {boolean} [stopSounds=false] - Used as the "stopSound" parameter when calling the {@link CB_AudioFile#destructor} method of each {@link CB_AudioFile} object removed.
 *  @param {array} [statuses=Array({@link CB_AudioFile.LOADING}, {@link CB_AudioFile.UNCHECKED}, {@link CB_AudioFile.CHECKING}, {@link CB_AudioFile.LOADED})] - Numeric array containing the statuses of the {@link CB_AudioFile} objects that we want this method to authorize to remove. This means that if the returning value of the {@link CB_AudioFile#getStatus} method of a {@link CB_AudioFile} object is not in this list, it will not be tried to be removed (unless they end removed by the {@link CB_AudioFileCache#clearAudioFiles} method called internally). Have in mind that this method will call the {@link CB_AudioFileCache#clearAudioFiles} method internally, which destroys the {@link CB_AudioFile} objects whose {@link CB_AudioFile#getStatus} method returns {@link CB_AudioFile.ABORTED} and {@link CB_AudioFile.FAILED}, so these two statuses need not be indicated. It will respect the order given. Possible values for this array are: {@link CB_AudioFile.UNLOADED}, {@link CB_AudioFile.LOADING}, {@link CB_AudioFile.UNCHECKED}, {@link CB_AudioFile.CHECKING}, {@link CB_AudioFile.LOADED}, {@link CB_AudioFile.FAILED} and {@link CB_AudioFile.ABORTED}.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects removed.
 */
CB_AudioFileCache.prototype.purge = function(desiredNumber, setAsMinimumAudioFiles, includePlaying, stopSounds, statuses)
{
	desiredNumber = parseInt(CB_trim(desiredNumber));
	
	if (desiredNumber === "" || isNaN(desiredNumber)) { return 0; }
	desiredNumber = parseInt(desiredNumber);
	if (desiredNumber <= 0) { return 0; }
	
	if (setAsMinimumAudioFiles && (typeof(this.maximumAudioFiles) === "undefined" || this.maximumAudioFiles === null || isNaN(this.maximumAudioFiles) || this.maximumAudioFiles === 0 || desiredNumber <= this.maximumAudioFiles))
	{
		this.minimumAudioFiles = desiredNumber;
	}

	var objectsRemoved = 0;
	
	if (typeof(statuses) === "undefined" || statuses === null || !CB_isArray(statuses) || statuses.length <= 0)
	{
		statuses = [ CB_AudioFile.LOADING, CB_AudioFile.UNCHECKED, CB_AudioFile.CHECKING, CB_AudioFile.LOADED ]; //this._purgeObjectStatus will call clearAudioFiles which destroys ABORTED and FAILED.
	}

	var statusesLength = statuses.length;
	for (var x = 0; x < statusesLength; x++)
	{
		objectsRemoved += this._purgeObjectsStatus(desiredNumber, statuses[x], includePlaying, stopSounds);
		if (this.audioFiles.length <= desiredNumber) { break; }
	}
	
	return objectsRemoved;
}


//Creates a new audio file if neeed:
CB_AudioFileCache.prototype._createNewAudioFilesIfNeeded = function()
{
	//If we don't want to create any new file, just exists:
	if (this.newAudioFilesWhenNeeded <= 0) { return; }

	//If it is not LOADED, exits:
	if (this.status !== CB_AudioFileCache.LOADED) { return; }

	//If there is not a minimum limit set, just exits:
	if (typeof(this.minimumAudioFilesFree) === "undefined" || this.minimumAudioFilesFree === null || isNaN(this.minimumAudioFilesFree)) { return; }
	
	//If we have reached the minimum, creates new ones:
	//if (this.audioFilesFreePointer + 1 <= this.minimumAudioFilesFree) //Pointer starts with 0.
	if (this.audioFilesFreePointer < this.minimumAudioFilesFree) //Pointer starts with 0.
	{
		var filesCreated = 0;
		var filesAlreadyCreated = 0;
		//Counts LOADED, LOADING, UNCHECKED and CHECKING as already created ones (in order not to create more than needed):
		var audioFilesLength = this.audioFiles.length;
		for (var x = 0; x < audioFilesLength; x++)
		{
			//If the object exists:
			if (typeof(this.audioFiles[x]) !== "undefined" && this.audioFiles[x] !== null)
			{
				//if (this.audioFiles[x].getStatus() === CB_AudioFile.LOADING || this.audioFiles[x].getStatus() === CB_AudioFile.UNCHECKED || this.audioFiles[x].getStatus() === CB_AudioFile.CHECKING)
				//If it is still LOADED or LOADING but its internal object is LOADED (would happen when changing API), marks the object as free and increments the pointer:
				if (this.audioFiles[x].getStatus() === CB_AudioFile.LOADED || this.audioFiles[x].getStatus() === CB_AudioFile.LOADING && this.audioFiles[x].getStatus(true) === CB_AudioFile.LOADED)
				{
					filesAlreadyCreated++;
				}
				else if (this.audioFiles[x].getStatus() === CB_AudioFile.LOADING || this.audioFiles[x].getStatus() === CB_AudioFile.UNCHECKED || this.audioFiles[x].getStatus() === CB_AudioFile.CHECKING)
				{
					filesCreated++;
				}
			}
		}

		/*
		if (this.status !== CB_AudioFileCache.LOADED)
		{
			if (typeof(this.maximumAudioFiles) === "undefined" || this.maximumAudioFiles === null || this.audioFilesCreated + filesCreated < this.maximumAudioFiles)
			{
				if (filesCreated < this.newAudioFilesWhenNeeded)
				{
					var that = this;
					setTimeout(function() { that._createNewAudioFilesIfNeeded.call(that); }, 1);
				}
			}
			return;
		}
		*/
		
		//Creates the needed files (if any):
		while (typeof(this.maximumAudioFiles) === "undefined" || this.maximumAudioFiles === null || isNaN(this.maximumAudioFiles === null) || this.maximumAudioFiles === 0 || filesAlreadyCreated + filesCreated < this.maximumAudioFiles)
		{
			//Only creates a new file if there is no maximum or it it has not been reached yet:
			if (filesCreated < this.newAudioFilesWhenNeeded)
			{
				this.createAudioFile(null, null, null, null, null, null, null, !this.checkManuallyOnNeededCreated);
				filesCreated++;
			} else { break; }
		}
	}
}


/**
 * Object returned by the {@link CB_AudioFileCache#getFreeAudioFile} method.
 *  @memberof CB_AudioFileCache
 *  @typedef {Object} CB_AudioFileCache.getFreeAudioFile_OBJECT
 *  @property {CB_AudioFile|null} object - Contains the {@link CB_AudioFile} object if found or null otherwise.
 *  @property {string|integer} index - Contains the position of the {@link CB_AudioFile} object inside the {@link CB_AudioFileCache#audioFiles} property if found or "-1" otherwise.
 */

/**
 * Returns a free {@link CB_AudioFile} object, if any (from the {@link CB_AudioFileCache#audioFilesFree} property). Note that this will call the internal {@link CB_AudioFileCache#_createNewAudioFilesIfNeeded} method that could end creating a new {@link CB_AudioFile} object if needed.
 *  @function
 *  @param {boolean} [popIt=false] - If set to true, the {@link CB_AudioFile} object will also be "popped" (removed) from the {@link CB_AudioFileCache#audioFilesFree} property.
 *  @returns {CB_AudioFileCache.getFreeAudioFile_OBJECT} Returns a {@link CB_AudioFileCache.getFreeAudioFile_OBJECT} object.
 */
CB_AudioFileCache.prototype.getFreeAudioFile = function(popIt)
{
	var that = this;
	
	//If there is a free object, just returns it:
	if (this.audioFilesFreePointer > -1)
	{
		//Sets the onStop function (which will mark the sound as free) for the object:
		var audioFilesIndex = this.audioFilesFree[this.audioFilesFreePointer];
		var audioObject = this.audioFiles[audioFilesIndex];

		//If we want, pops the element from the array of the free objects:
		if (popIt)
		{
			//Note: Indeed, setting it to null is not needed because we should only care about the elements before the pointer.
			this.audioFilesFree[this.audioFilesFreePointer--] = null;  //Also decreases the pointer.
		}

		//Calls the function which creates new objects if needed:
		////////clearTimeout(this._createNewAudioFilesIfNeededTimeout);
		this._createNewAudioFilesIfNeededTimeout = setTimeout(function() { that._createNewAudioFilesIfNeeded.call(that); }, 1);
		
		//Returns the object:
		return { "object" : audioObject, "index" : audioFilesIndex };
	}
	
	//Calls the function which creates new objects if needed:
	////////clearTimeout(this._createNewAudioFilesIfNeededTimeout);
	this._createNewAudioFilesIfNeededTimeout = setTimeout(function() { that._createNewAudioFilesIfNeeded.call(that); }, 1);

	//If there is no free object, returns null:
	return { "object" : null, "index" : -1 };
}


/**
 * Tells the position of a desired {@link CB_AudioFile} object (by its identifier) in the {@link CB_AudioFileCache#audioFiles} property or -1 otherwise.
 *  @function
 *  @param {string} id - The identifier of the {@link CB_AudioFile} object (belongs to its {@link CB_AudioFile#id} property) whose position we want to find. Note that the identifier is not case sensitive and it should be unique for each object.
 *  @returns {integer} Returns the position of a desired {@link CB_AudioFile} object (by its identifier) in the {@link CB_AudioFileCache#audioFiles} property or -1 otherwise.
 */
CB_AudioFileCache.prototype.getAudioFilePosition = function(id)
{
	id = CB_trim(id).toUpperCase(); //id = ("" + id).toUpperCase();
	if (id === "") { return -1; }

	//Looks through the array of the objects:
	var audioFilesLength = this.audioFiles.length;
	for (var x = 0; x < audioFilesLength; x++)
	{
		//If the object exists:
		if (typeof(this.audioFiles[x]) !== "undefined" && this.audioFiles[x] !== null)
		{
			//If the object has the desired ID:
			//if (typeof(this.audioFiles[x].id) !== "undefined" && CB_trim(this.audioFiles[x].id).toUpperCase() === id)
			if (typeof(this.audioFiles[x].id) !== "undefined" && this.audioFiles[x].id === id)
			{
				return x; //The "x" is the position. There should be only one with that ID (ID should be unique), so we can exit now.
			}
		}
	}
	
	return -1;
}


/**
 * Tells whether a desired {@link CB_AudioFile} object is free (it is in the {@link CB_AudioFileCache#audioFilesFree} property) or not, by its identifier. A free {@link CB_AudioFile} object is an object which is not being used and it is available to be used.
 *  @function
 *  @param {string} id - The identifier of the {@link CB_AudioFile} object (belongs to its {@link CB_AudioFile#id} property) that we want to check. Note that the identifier is not case sensitive and it should be unique for each object.
 *  @returns {boolean} Returns whether a desired {@link CB_AudioFile} object is free (it is in the {@link CB_AudioFileCache#audioFilesFree} property) or not, by its identifier. A free {@link CB_AudioFile} object is an object which is not being used and it is available to be used.
 */
CB_AudioFileCache.prototype.isAudioFileFree = function(id)
{
	var position = this.getAudioFilePosition(id);
	if (position === -1) { return false; }
	return this.isAudioFileFreeByPosition(position);
}


/**
 * Tells whether a given numeric position of a {@link CB_AudioFile} object in the {@link CB_AudioFileCache#audioFiles} property is stored in the {@link CB_AudioFileCache#audioFilesFree} property or not (this means that the {@link CB_AudioFile} object in that position of the {@link CB_AudioFileCache#audioFiles} property is free). A free {@link CB_AudioFile} object is an object which is not being used and it is available to be used.
 *  @function
 *  @param {integer} position - Position of the {@link CB_AudioFile} object in the {@link CB_AudioFileCache#audioFiles} property that we want to check whether it is in the {@link CB_AudioFileCache#audioFilesFree} property or not.
 *  @returns {boolean} Returns whether the given numeric position of a {@link CB_AudioFile} object in the {@link CB_AudioFileCache#audioFiles} property is stored in the {@link CB_AudioFileCache#audioFilesFree} property or not (this means that the {@link CB_AudioFile} object in that position of the {@link CB_AudioFileCache#audioFiles} property is free). A free {@link CB_AudioFile} object is an object which is not being used and it is available to be used.
 */
CB_AudioFileCache.prototype.isAudioFileFreeByPosition = function(position)
{
	//Looks through the array of the free objects:
	for (var x = 0; x <= this.audioFilesFreePointer; x++)
	{
		if (typeof(this.audioFilesFree[x]) !== "undefined" && this.audioFilesFree[x] === position)
		{
			return true;
		}
	}
	return false;
}


//Calls play method play again (in the case it has failed) if the delay is not more than the allowed one:
CB_AudioFileCache.prototype._callRecursivelyIfNotTooLate = function(startAt, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, startPlayingTime, startAtOriginal, soundInstanceId, _callRecursivelyIfNotTooLateCalledObject)
{
	////////if (this._callRecursivelyIfNotTooLateCalled) { return null; }
	///////this._callRecursivelyIfNotTooLateCalled = true;
	if (_callRecursivelyIfNotTooLateCalledObject.called) { return null; }
	_callRecursivelyIfNotTooLateCalledObject.called = true;

	
	//Finds out the duration of the track:
	var startAtReal = startAtOriginal;
	var stopAtReal = stopAt;
	if (CB_trim(startAtReal) === "") { startAtReal = 0; }
	if (CB_trim(stopAtReal) === "") { stopAtReal = 0; }
	startAtReal = parseFloat(startAtReal);
	stopAtReal = parseFloat(stopAtReal);
	if (startAtReal < 0) { startAtReal = 0; }
	if (stopAtReal <= 0 || stopAtReal > this.duration) { stopAtReal = this.duration; }
	if (startAtReal > stopAtReal || isNaN(startAtReal)) { startAtReal = stopAtReal; }
	var durationReal = stopAtReal - startAtReal;
	
	//If the recursive delay is not null and is a valid number:
	if (typeof(allowedRecursiveDelay) === "undefined" || allowedRecursiveDelay === null || isNaN(allowedRecursiveDelay) || allowedRecursiveDelay < 0)
	{
		allowedRecursiveDelay = CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT; //We use default value.
	}
	if (typeof(allowedRecursiveDelaySkipping) === "undefined" || allowedRecursiveDelaySkipping === null || isNaN(allowedRecursiveDelaySkipping) || allowedRecursiveDelaySkipping < 0)
	{
		//////allowedRecursiveDelaySkipping = this.duration - startAtOriginal; //We use duration as default value.
		allowedRecursiveDelaySkipping = durationReal; //We use duration as default value.
		//Apply margins (because some web clients have problems to play files near their end):
		//if (allowedRecursiveDelaySkipping > 500) { allowedRecursiveDelaySkipping -= 500; }
		//else if (allowedRecursiveDelaySkipping > 100) { allowedRecursiveDelaySkipping -= 100; }
		//else if (allowedRecursiveDelaySkipping > 10) { allowedRecursiveDelaySkipping -= 10; }
	}

	var timeNow = CB_Device.getTiming();
	
	var timeExpired = timeNow - startPlayingTime;

	//If it is a loop, it should be played always, so we allow any expired time:
	if (loop) { timeExpired %= durationReal; }
	
	var that = this;
	
	//If the time expired is less or equal to the delay allowed:
	if (timeExpired <= allowedRecursiveDelay)
	{
		//Calls the function again:
		setTimeout
		(
			function()
			{
				that.play.call(that, startAtOriginal, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, startPlayingTime, startAtOriginal, soundInstanceId, _callRecursivelyIfNotTooLateCalledObject);
			},
			1
		);
		return true;
	}
	//...otherwise, if the time expired is less or equal to the allowed recursive delay to play skipping:
	else if (timeExpired <= allowedRecursiveDelaySkipping)
	{
		startAtOriginal = parseFloat(startAtOriginal);
		//Calls the function again:
		setTimeout
		(
			function()
			{
				that.play.call(that, startAtOriginal + timeExpired, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, startPlayingTime, startAtOriginal, soundInstanceId, _callRecursivelyIfNotTooLateCalledObject);
			},
			1
		);
		return true;
	}
	
	return null;
}


/**
 * Clears the sound instances (created by the {@link CB_AudioFileCache#play} method) which have been cancelled.
 *  @function
 *  @param {boolean} [clearWithObjectAssociated=false] - If set to true, it will also clear the sound instances which have a {@link CB_AudioFile} object associated.
 *  @returns {integer} Returns the number of cleared sound instances.
 */
CB_AudioFileCache.prototype.clearSoundInstances = function(clearWithObjectAssociated)
{
	var totalBefore = 0;
	var kept = 0;
	var soundInstancesQueuedNew = {};
	for (var soundInstanceId in this.soundInstancesQueued)
	{
		totalBefore++;
		if (typeof(this.soundInstancesQueued[soundInstanceId]) !== "undefined")
		{
			//If it has not been cancelled or we do not want to clear with associated object and it has an object associated, we keep it:
			if (typeof(this.soundInstancesQueued[soundInstanceId].cancelled) === "undefined" || !this.soundInstancesQueued[soundInstanceId].cancelled || !clearWithObjectAssociated && typeof(this.soundInstancesQueued[soundInstanceId].object) !== "undefined" && this.soundInstancesQueued[soundInstanceId].object !== null)
			{
				kept++;
				soundInstancesQueuedNew[soundInstanceId] = this.soundInstancesQueued[soundInstanceId];
			}
		}
	}
	
	this.soundInstancesQueued = soundInstancesQueuedNew;
	
	return totalBefore - kept;
}


/**
 * Cancels (to prevent they start playing) or enables all sound instances (created by the {@link CB_AudioFileCache#play} method).
 *  @function
 *  @param {boolean} [cancel=false] - Defines whether we want to cancel them or enable them.
 *  @param {boolean} [affectWithObjectAssociated=false] - If set to true, it will also affect the sound instances which have a {@link CB_AudioFile} object associated.
 *  @returns {integer} Returns the number of sound instances modified.
 */
CB_AudioFileCache.prototype.cancelSoundInstances = function(cancel, affectWithObjectAssociated)
{
	var performed = 0;
	for (var soundInstanceId in this.soundInstancesQueued)
	{
		if (this.cancelSoundInstance(soundInstanceId, cancel, affectWithObjectAssociated)) { performed++; }
	}
	return performed;
}


/**
 * Cancels (to prevent it starts playing) or enables a sound instance (created by the {@link CB_AudioFileCache#play} method), by its identifier.
 *  @function
 *  @param {integer} soundInstanceId - The identifier (integer) of the sound instance we want to affect.
 *  @param {boolean} [cancel=false] - Defines whether we want to cancel it or enable it.
 *  @param {boolean} [affectWithObjectAssociated=false] - If set to true, it will also affect the sound instance even it has a {@link CB_AudioFile} object associated.
 *  @returns {boolean} Returns true if the sound instance has been modified or false otherwise.
 */
CB_AudioFileCache.prototype.cancelSoundInstance = function(soundInstanceId, cancel, affectWithObjectAssociated)
{
	//If the sound instance exists and the setting given is not already being used, sets it and returns true:
	cancel = !!cancel;
	if (typeof(this.soundInstancesQueued[soundInstanceId]) !== "undefined" && typeof(this.soundInstancesQueued[soundInstanceId].cancelled) !== "undefined" && this.soundInstancesQueued[soundInstanceId].cancelled !== cancel)
	{
		if (affectWithObjectAssociated || typeof(this.soundInstancesQueued[soundInstanceId].object) === "undefined" || this.soundInstancesQueued[soundInstanceId].object === null)
		{
			this.soundInstancesQueued[soundInstanceId].cancelled = cancel;
			return true;
		}
	}
	return false;
}


/**
 * Gets the {@link CB_AudioFile} object associated to a given sound instance ID (created by the {@link CB_AudioFileCache#play} method), if any, or null otherwise.
 *  @function
 *  @param {integer} soundInstanceId - The identifier (integer) of the sound instance we want to get.
 *  @param {boolean} [avoidCancelled=false] - If set to true, it will not return the {@link CB_AudioFile} object if its sound instance has been cancelled.
 *  @returns {CB_AudioFile|null} Returns the {@link CB_AudioFile} object associated to a given sound instance ID, if any, or null otherwise.
 */
CB_AudioFileCache.prototype.getAudioFileBySoundInstanceId = function(soundInstanceId, avoidCancelled)
{
	//If the sound instance ID has an object associated:
	if (typeof(this.soundInstancesQueued[soundInstanceId]) !== "undefined" && typeof(this.soundInstancesQueued[soundInstanceId].object) !== "undefined")
	{
		if (!avoidCancelled || typeof(this.soundInstancesQueued[soundInstanceId].cancelled) === "undefined" || !this.soundInstancesQueued[soundInstanceId].cancelled)
		{
			return this.soundInstancesQueued[soundInstanceId].object;
		}
	}
	return null;
}


//Function to execute when a sound stops:
CB_AudioFileCache.prototype._onStopDefaultFunction = function(indexObject, thisObject, statusBefore, soundInstanceId, functionWhenError)
{
	var wasCancelled = false;
	if (typeof(soundInstanceId) !== "undefined" && soundInstanceId !== null)
	{
		if (typeof(this.soundInstancesQueued[soundInstanceId]) === "undefined" || this.soundInstancesQueued[soundInstanceId] === null || this.soundInstancesQueued[soundInstanceId].cancelled)
		{
			wasCancelled = true;
		}
		else if (typeof(this.soundInstancesQueued[soundInstanceId]) !== "undefined")
		{
			this.soundInstancesQueued[soundInstanceId].object = null;
			this.soundInstancesQueued[soundInstanceId].cancelled = true;
		}
	}

	if (typeof(thisObject) === "undefined" || thisObject === null) { return; }
	
	//thisObject.setVolume(0); //Sets volume to zero (to prevent hearing the sound in some web clients when checkPlaying is called).
	if (CB_Configuration[CB_BASE_NAME].CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING) { thisObject.mute(); } //Sets volume to zero (to prevent hearing the sound in some web clients when checkPlaying is called).
	
	//If it is still LOADED or LOADING but its internal object is LOADED (would happen when changing API), marks the object as free and increments the pointer:
	if (thisObject.getStatus() === CB_AudioFile.LOADED || thisObject.getStatus() === CB_AudioFile.LOADING && thisObject.getStatus(true) === CB_AudioFile.LOADED)
	{
		//Marks the object as free and increments the pointer:
		this.audioFilesFree[++this.audioFilesFreePointer] = indexObject; //Also increases the pointer ("x" is the position of the object in the array).
		
		//If the status before playing was UNCHECKED (now is LOADED), it has been checked successfully, so it increases the files created counter:
		if (statusBefore === CB_AudioFile.UNCHECKED)
		{
			this.audioFilesCreated++;
			
			//Stores the minimum and maximum duration found:
			var duration = thisObject.getDuration();
			if (duration > 0 && (this.duration === 0 || duration < this.duration)) { this.duration = duration; }
			if (duration > this.durationMaximum) { this.durationMaximum = duration; }
		}
	}
	//...otherwise, if it is FAILED or ABORTED, removes the sound and reloads another one:
	else if (thisObject.getStatus() === CB_AudioFile.FAILED || thisObject.getStatus() === CB_AudioFile.ABORTED || thisObject.getStatus() === CB_AudioFile.UNCHECKED)
	{
		this.removeAudioFile(thisObject, true, this.checkManuallyOnPlayingFailed);
		
		//Sets the sound instance as not cancelled:
		if (!wasCancelled && typeof(soundInstanceId) !== "undefined" && soundInstanceId !== null)
		{
			this.soundInstancesQueued[soundInstanceId] = {};
			this.soundInstancesQueued[soundInstanceId].cancelled = false;
			this.soundInstancesQueued[soundInstanceId].object = null;
		}
		
		if (typeof(functionWhenError) === "function") { functionWhenError(); }
	}
}


/**
 * Plays a sound of the cache (if there is any free). If a sound cannot be played, this method can call itself internally again and again (with most of the given parameters being the same, depending on the circumstances) to try to play the sound until a desired time limit is reached. If a {@link CB_AudioFile} object cannot be played and it is determined necessary, it will try to reload it internally (by calling the {@link CB_AudioFileCache#removeAudioFile} method).
 *  @function
 *  @param {number} [startAt=0 | {@link CB_AudioFile_API.WAAPI#lastStartAt} | {@link CB_AudioFile_API.SM2#lastStartAt} | {@link CB_AudioFile_API.ACMP#lastStartAt} | {@link CB_AudioFile_API.AAPI#lastStartAt} | stopAt] - Time in milliseconds where we want the audio to start at. If not provided or it is not a valid number, it will use zero (0) as default which belongs to the beginning of the audio. If the value provided is greater than the "stopAt" provided, it will use the value set in the "lastStartAt" property of the used audio API object (which belongs to the "startAt" value the last time that the "play" method was called). If, even using the "lastStartAt" value is still greater than the "stopAt" provided, it will use the same value as the "stopAt" which means it will not play and will stop immediately. Used internally as the "startAt" parameter to call the {@link CB_AudioFile#play} method of the free {@link CB_AudioFile} object (if any).
 *  @param {number} [stopAt={@link CB_AudioFile_API.WAAPI#getDuration}() | {@link CB_AudioFile_API.SM2#getDuration}() | {@link CB_AudioFile_API.ACMP#getDuration}() | {@link CB_AudioFile_API.AAPI#getDuration}()] - Time in milliseconds where we want the audio to stop at. If not provided or it is not a valid number, it will use the returning value of the "getDuration" method of the used audio API object (which should belong to the total duration of the audio, if it was calculated correctly). Used internally as the "stopAt" parameter to call the {@link CB_AudioFile#play} method of the free {@link CB_AudioFile} object (if any).
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Used internally as the "loop" parameter to call the {@link CB_AudioFile#play} method of the free {@link CB_AudioFile} object (if any).
 *  @param {number} [volume=CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME] - Desired volume to play the audio. Used internally as the "volume" parameter to call the {@link CB_AudioFile#setVolume} method of the free {@link CB_AudioFile} object (if any), before playing it.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all. Used only when the audio is not able to play immediately.
 *  @param {boolean} [allowedRecursiveDelaySkipping=stopAt-startAt] - If provided (uses milliseconds) and the time expired trying to start playing the sound without success is still inside this amount of time provided, it will try to play the sound but skipping the part of the audio which should have already been played already. In other words, it will try to start playing the sound as if the previous non-played part (which should have been playing during the time which already expired) was already being playing silently. Only used when the time set in the "allowedRecursiveDelay" parameter has been reached and the audio did not start playing yet. The default value is the duration of the sound that we want to play (having in mind the real value of the "startAt" and "stopAt" parameters which are calculated internally and can be different from the provided ones in the case that they had any error).
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "soundInstanceId" (the identifier of the sound instance used), "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile} object used (if any). Used internally as the "onPlayStart" parameter (wrapped in another function) to call the {@link CB_AudioFile#play} method of the free {@link CB_AudioFile} object (if any).
 *  @param {function} [onStop] - Function to call when the sound stops playing, with an unique parameter which belongs to the "soundInstanceId" (the identifier of the sound instance used), being "this" the {@link CB_AudioFile} object (if any). Used internally as the "callbackFunction" parameter (wrapped in a function) to call the {@link CB_AudioFile#onStop} method of the free {@link CB_AudioFile} object (if any), before playing it.
 *  @param {number} [startPlayingTime=CB_Device.getTiming()] - Used internally to calculate the amount of time (in milliseconds) expired without playing the sound. Internal usage only recommended. 
 *  @param {number} [startAtOriginal=startAt] - Used internally to start playing the sound accurately and skipping the part which could not be played before, if the time expired without being played is still inside the amount of time provided in the "allowedRecursiveDelaySkipping" parameter. Internal usage only recommended.
 *  @param {integer} [soundInstanceId=CB_AudioFileCache._soundInstanceIdUnique++] - The identifier of the sound instance that will be played. Used internally when the function is called recursively in the case that the sound could not be played immediately. Internal usage only recommended.
 *  @param {Object} [_callRecursivelyIfNotTooLateCalledObject] - Object with just the "called" property (boolean). Used internally to know whether the current execution thread called already the {@link _callRecursivelyIfNotTooLate} internal method for the same sound instance or not. Internal usage only recommended.
 *  @returns {integer|null} Returns the sound instance ID used if there was one free or null otherwise. To get a sound instance returned does not mean necessarily that the sound started playing so it is necessary to use a callback function as the "onPlayStart" parameter for checking this. The sound instance created (if any), will be cancelled automatically once the sound is stopped.
 */
CB_AudioFileCache.prototype.play = function(startAt, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, startPlayingTime, startAtOriginal, soundInstanceId, _callRecursivelyIfNotTooLateCalledObject)
{
	var that = this;
	
	//The first time, we choose a unique sound instance ID:
	if (typeof(soundInstanceId) === "undefined" || soundInstanceId === null)
	{
		soundInstanceId = CB_AudioFileCache._soundInstanceIdUnique++;
		this.soundInstancesQueued[soundInstanceId] = {};
		this.soundInstancesQueued[soundInstanceId].cancelled = false;
		this.soundInstancesQueued[soundInstanceId].object = null;
		
		//Since it is the first time, it modifies the onPlayStart function to assign the audio object to the sound instance ID:
		var onPlayStartOld = onPlayStart;
		onPlayStart =
			function(startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime)
			{
				that.soundInstancesQueued[soundInstanceId].object = this;
				if (typeof(onPlayStartOld) === "function") { onPlayStartOld.call(this, soundInstanceId, startAt, stopAt, startAtNextLoop, loop, avoidDelayedPlay, allowedRecursiveDelay, startPlayingTime); }
			};
	}

	//If the sound instance has been cancelled, we exit:
	if (typeof(this.soundInstancesQueued[soundInstanceId]) === "undefined" || this.soundInstancesQueued[soundInstanceId] === null || this.soundInstancesQueued[soundInstanceId].cancelled) { return null; }
	
	///////this._callRecursivelyIfNotTooLateCalled[soundInstanceId] = false;
	if (typeof(_callRecursivelyIfNotTooLateCalledObject) === "undefined" || _callRecursivelyIfNotTooLateCalledObject === null) { _callRecursivelyIfNotTooLateCalledObject = {}; }
	_callRecursivelyIfNotTooLateCalledObject.called = false;
	
	//If there is a free audio object, proceeds:
	var freeAudioFile = this.getFreeAudioFile(true);
	if (typeof(freeAudioFile.object) !== "undefined" && freeAudioFile.object !== null)
	{
		var audioObject = freeAudioFile.object;
		
		var statusBefore = audioObject.getStatus();
		
		if (typeof(startPlayingTime) === "undefined" || startPlayingTime === null) { startPlayingTime = CB_Device.getTiming(); }
		if (typeof(startAtOriginal) === "undefined" || startAtOriginal === null) { startAtOriginal = startAt; }
		
		//Sets the onStop function that marks the sound as free:
		audioObject._fireOnStopByUser = true;
		audioObject.onStop
		(
			function()
			{
				that._onStopDefaultFunction.call(that, freeAudioFile.index, audioObject, statusBefore, soundInstanceId, function() { that._callRecursivelyIfNotTooLate.call(that, startAt, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, startPlayingTime, startAtOriginal, soundInstanceId, _callRecursivelyIfNotTooLateCalledObject); });
				if (typeof(onStop) === "function" && audioObject._fireOnStopByUser) { onStop.call(audioObject, soundInstanceId); }
			},
			false //Does not keep any possibly existing onStop function.
		);
		
		/////////////////////////audioObject.onStop(onStop, true); //Keeps the previous function (which marks object as free when it stops).
		
		//audioObject.setVolume((statusBefore === CB_AudioFile.UNCHECKED) ? 0 : volume); //If it is UNCHECKED, sets volume to zero (to prevent hearing the sound in some web clients when checkPlaying is called).
		audioObject.setVolume(volume);
		
		audioObject.audioFileObject.lastStartAt = startAtOriginal; //Next loop should start from the original startAt.
		
		var played =
			audioObject.play
			(
				startAt, //startAt
				stopAt, //stopAt
				loop, //loop
				true, //avoidDelayedPlay
				0, //allowedRecursiveDelay
				onPlayStart, //onPlayStart
				function()
				{
					that.soundInstancesQueued[soundInstanceId].object = null;
					that.removeAudioFile(audioObject, true, that.checkManuallyOnPlayingFailed);
					that._callRecursivelyIfNotTooLate.call(that, startAt, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, startPlayingTime, startAtOriginal, soundInstanceId, _callRecursivelyIfNotTooLateCalledObject);
				}, //onLoadError
				true //isResume (simulates a resume to force next loop (if any) to start from the original startAt).
			);
		
		//If the sound has not been played:
		if (played === -1)
		{
			this.soundInstancesQueued[soundInstanceId].object = null;
			
			//If the sound is FAILED or ABORTED, removes it:
			if (audioObject.getStatus() === CB_AudioFile.FAILED || audioObject.getStatus() === CB_AudioFile.ABORTED) { this.removeAudioFile(audioObject, true, this.checkManuallyOnPlayingFailed); }
			//If we do not allow delayed play, calls play method again (if the maximum allowed delay has still not expired):
			////////if (avoidDelayedPlay)
			////////{
				this._callRecursivelyIfNotTooLate(startAt, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, startPlayingTime, startAtOriginal, soundInstanceId, _callRecursivelyIfNotTooLateCalledObject);
			////////}
		}
		
		//////return audioObject;
	}
	//...otherwise, if there is no object free:
	else
	{
		this.soundInstancesQueued[soundInstanceId].object = null;
		//Calls the same function recursively:
		if (typeof(startPlayingTime) === "undefined" || startPlayingTime === null) { startPlayingTime = CB_Device.getTiming(); }
		if (typeof(startAtOriginal) === "undefined" || startAtOriginal === null) { startAtOriginal = startAt; }
		this._callRecursivelyIfNotTooLate(startAt, stopAt, loop, volume, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, startPlayingTime, startAtOriginal, soundInstanceId, _callRecursivelyIfNotTooLateCalledObject);
		//return null;
	}
	return soundInstanceId;
}


/**
 * Object used by the {@link CB_AudioFileCache#executeFunctionAll} method when the "returnSetTimeoutsArray" parameter is set to true.
 *  @memberof CB_AudioFileCache
 *  @typedef {Object} CB_AudioFileCache.executeFunctionAll_OBJECT
 *  @property {CB_AudioFile} item - The {@link CB_AudioFile} affected.
 *  @property {integer} setTimeoutReturningValue - The returning value of calling the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} internally or null if it was not called, depending on the "delayBetweenEach" parameter.
 *  @property {number} setTimeoutDelay - The value used as the second parameter when calling the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} internally or zero if it was not called, depending on the "delayBetweenEach" parameter.
 */

/**
 * Alias for {@link CB_AudioFileCache#executeFunctionAll}.
 *  @function CB_AudioFileCache#executeAll
 *  @see {@link CB_AudioFileCache#executeFunctionAll}
 */	
 /**
 * Alias for {@link CB_AudioFileCache#executeFunctionAll}.
 *  @function CB_AudioFileCache#forEach
 *  @see {@link CB_AudioFileCache#executeFunctionAll}
 */	
 /**
 * Performs a desired action, using the provided function, on all the existing {@link CB_AudioFile} objects or on the desired ones (if provided). Calls the {@link CB_Arrays.executeFunctionAll} function internally and returns its returning value.
 *  @function
 *  @param {CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Function that will be called for each {@link CB_AudioFile} object. As the first parameter it receives the {@link CB_AudioFile} object of the "audioFiles" being looped, as the second parameter the position of this {@link CB_AudioFile} object in the "audioFiles" array provided (or, if not provided, in the array of the {@link CB_AudioFileCache#audioFiles} property), the third parameter is the array being looped and the fourth parameter will be the "delayBetweenEach" being used, being "this" the {@link CB_AudioFile} object itself.
 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - If a value greater than zero is used, it will be used as the delay desired between each call to the "functionEach" function (calling them using the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function internally). If not provided or the value is 0 (zero) or lower, each call to the "functionEach" function will be performed immediately one after the other. If a function is provided, it will be called with the same parameters as the "functionEach" function and its returning value will be used as the delay (executed every loop for each {@link CB_AudioFile} object).
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - A numeric array containing the {@link CB_AudioFile} objects that we want to loop. It should contain only {@link CB_AudioFile} objects which are already in the current audio file cache. If not provided, it will use all the {@link CB_AudioFile} objects contained in the cache.
 *  @param {boolean} [returnSetTimeoutsArray=false] - Defines whether we want the method to return an integer or a numeric array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call. Returning an array with information of each [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} call is only useful when the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function is called internally, which happens when the "delayBetweenEach" parameter is greater than 0 (zero).
 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - If set to true, the desired delay (if any) will also affect the first call to the "functionEach" function.
 *  @param {CB_Arrays.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array which was looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
 *  @returns {integer|array} If the "returnSetTimeoutsArray" parameter is set to false, it will return the number of calls to the "functionEach" function that were performed (which should be the same number as the {@link CB_AudioFile} objects given in the "audioFiles" parameter). Otherwise, if the "returnSetTimeoutsArray" is set to true, it will return a numeric array with a {@link CB_AudioFileCache.executeFunctionAll_OBJECT} object for each {@link CB_AudioFile} given. The length of this array will also be the number of calls to the "functionEach" function that were performed. Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
 *  @todo Think about only allowing {@link CB_AudioFile} objects (in the "audioFiles" parameter) which are already in the cache (identify them by their ID), to avoid problems.
 */
CB_AudioFileCache.prototype.executeFunctionAll = CB_AudioFileCache.prototype.executeAll = CB_AudioFileCache.prototype.forEach = function(functionEach, delayBetweenEach, audioFiles, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish)
{
	return CB_Arrays.executeFunctionAll(CB_isArray(audioFiles) ? audioFiles : this.audioFiles, functionEach, delayBetweenEach, returnSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish);
	
	/*
	if (typeof(functionEach) !== "function") { return returnSetTimeoutsArray ? [] : 0; }
	if (typeof(delayBetweenEach) === "undefined" || delayBetweenEach === null || isNaN(delayBetweenEach) || delayBetweenEach < 0) { delayBetweenEach = 0; }
	
	if (typeof(audioFiles) === "undefined" || audioFiles === null || !CB_isArray(audioFiles)) { audioFiles = this.audioFiles; }
	
	var setTimeoutsInformation = [];
	
	var audioFilesLength = audioFiles.length;
	var y = 0;
	var setTimeoutReturningValue = null;
	var setTimeoutDelay = 0;
	for (var x = 0; x < audioFilesLength; x++)
	{
		//If the object exists:
		if (typeof(audioFiles[x]) !== "undefined" && audioFiles[x] !== null)
		{
			//Executes the given function ("this" parameters will point to the current object):
			if (delayBetweenEach === 0)
			{
				functionEach.call(audioFiles[x], x); //"x" is the position of the object in the array.
			}
			else
			{
				new function(x) //Closure to get unique value of "x" variable for each loop.
				{
					setTimeoutDelay = delayBetweenEachAffectsFirst ? delayBetweenEach * (y + 1) : delayBetweenEach * y;
					setTimeoutReturningValue = setTimeout
					(
						function()
						{
							functionEach.call(audioFiles[x], x); //"x" is the position of the object in the array.
						},
						setTimeoutDelay
					);
				}(x);
			}
			setTimeoutsInformation[setTimeoutsInformation.length] = { "item" : audioFiles[x], "setTimeoutReturningValue" : setTimeoutReturningValue, "setTimeoutDelay" : setTimeoutDelay };
			y++;
		}
	}
	
	if (returnSetTimeoutsArray) { return setTimeoutsInformation; }
	else { return y; }
	*/
}


/**
 * Destroys all the {@link CB_AudioFile} objects and frees memory, by calling {@link CB_AudioFile#destructor}(stopSounds, false, true).
 *  @function
 *  @param {boolean} [stopSounds=false] - Used internally as the "stopSound" parameter when calling the {@link CB_AudioFile#destructor} method of each {@link CB_AudioFile} object.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose {@link CB_AudioFile#destructor} has been called.
 *  @todo Think about implementing an "audioFiles" parameter.
 */
CB_AudioFileCache.prototype.destroyAll = function(stopSounds)
{
	//Destroys each object:
	var destroyed = this.executeFunctionAll(function() { this.destructor(stopSounds, false, true); }); //Avoids firing onStop.
	
	//No one is free now:
	this.audioFilesFree = [];
	this.audioFilesFreePointer = -1;
	
	return destroyed;
}


/**
 * Callback function used by the {@link CB_AudioFileCache#checkPlayingAll} method that will be called when all the process was performed successfully.
 *  @memberof CB_AudioFileCache
 *  @callback CB_AudioFileCache.checkPlayingAll_CALLBACK_OK
 *  @param {integer} performedActions - The number of {@link CB_AudioFile} objects that can be played.
 *  @param {integer} uncheckedObjects - The number of {@link CB_AudioFile} objects that needed to be checked before calling this method.
 */
 
/**
 * Callback function used by the {@link CB_AudioFileCache#checkPlayingAll} method that will be called when not all was performed successfully.
 *  @memberof CB_AudioFileCache
 *  @callback CB_AudioFileCache.checkPlayingAll_CALLBACK_ERROR
 *  @param {string} errorMessage - A string describing the error, if it could be determined.
 *  @param {integer} performedActions - The number of {@link CB_AudioFile} objects that can be played.
 *  @param {integer|undefined} uncheckedObjects - The number of {@link CB_AudioFile} objects that needed to be checked before calling this method (it will be undefined if it could not be determined).
 */

/**
 * Checks whether each {@link CB_AudioFile} object whose {@link CB_AudioFile#getStatus} method returns the "unchecked" value (which belongs to the value of the {@link CB_AudioFile#UNCHECKED} property) can be played or not. After checking, if the audio can be played, the status of the {@link CB_AudioFile} object will get the value of {@link CB_AudioFile.LOADED}. Otherwise, if it cannot be played, the status of the {@link CB_AudioFile} object will get the value of {@link CB_AudioFile.FAILED}. If a {@link CB_AudioFile} object cannot be played and it is determined necessary, it will try to reload it internally (by calling the {@link CB_AudioFileCache#removeAudioFile} method). It will call the {@link CB_AudioFileCache#clearAudioFiles} method internally after finishing. Recommended to be called through a user-driven event (as onClick, onTouch, etc.).
 *  @function
 *  @param {CB_AudioFileCache.checkPlayingAll_CALLBACK_OK} [callbackOk] - A function which will be called if all the {@link CB_AudioFile} objects whose {@link CB_AudioFile#getStatus} method returned the "unchecked" value (which belongs to the value of the {@link CB_AudioFile#UNCHECKED} property) could finally be checked successfully and all can be played, being "this" the {@link CB_AudioFileCache} object itself.
 *  @param {CB_AudioFileCache.checkPlayingAll_CALLBACK_ERROR} [callbackError] - A function which will be called if not all the {@link CB_AudioFile} objects whose {@link CB_AudioFile#getStatus} method returned the "unchecked" value (which belongs to the value of the {@link CB_AudioFile#UNCHECKED} property) could finally be checked successfully and any cannot be played, being "this" the {@link CB_AudioFileCache} object itself. This function will be called immediately if the method was previously called and it is still running currently.
 *  @param {boolean} [ignoreQueue=false] - Used internally as the "ignoreQueue" parameter when calling the {@link CB_AudioFile#checkPlaying} method of each {@link CB_AudioFile} object.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose status belonged to the "unchecked" value (the value of the {@link CB_AudioFile#UNCHECKED} property) before the execution of this method. It will return 0 (zero) if the method is tried to be executed while there is another previous call of it still running. It will also return 0 (zero) if the status of the audio file cache is not loaded (the {@link CB_AudioFileCache#status} property does not belong to the value set in the {@link CB_AudioFileCache.LOADED} property) nor unchecked (the {@link CB_AudioFileCache#status} property does not belong to the value set in the {@link CB_AudioFileCache.UNCHECKED} property).
 *  @todo Think about implementing an "audioFiles" parameter.
 */
CB_AudioFileCache.prototype.checkPlayingAll = function(callbackOk, callbackError, ignoreQueue)
{
	if (this._checkingPlaying)
	{
		if (typeof(callbackError) === "function")
		{
			callbackError.call(this, "Method checkPlayingAll cannot be executed again until it finishes.", 0, undefined);
		}
		return 0;
	}
	
	//If the cache status is not LOADED, exits:
	if (this.status !== CB_AudioFileCache.LOADED && this.status !== CB_AudioFileCache.UNCHECKED)
	{
		if (typeof(callbackError) === "function")
		{
			callbackError.call(this, "Cache status is not neither loaded nor unchecked.", 0, undefined);
		}
		return 0;
	}
	
	this._checkingPlaying = true;
	
	var that = this;

	//Counts UNCHECKED objects:
	var uncheckedObjects = 0;
	this.executeFunctionAll
	(
		function()
		{
			if (this.getStatus() === CB_AudioFile.UNCHECKED) { uncheckedObjects++; }
		}
	);
	
	if (uncheckedObjects === 0)
	{
		if (typeof(callbackOk) === "function") { callbackOk.call(this, 0, 0); }
		this._checkingPlaying = false;
		return 0;
	}
	
	var performedActions = 0;
	var errorsHappenend = 0;
	var lastError = "";
	
	//Function to execute when an object fails to be checked:
	var callbackErrorFunction = function(thisObject, error)
	{
		that.removeAudioFile(thisObject, true, that.checkManuallyOnCheckingFailed);
		errorsHappenend++;
		lastError = error;
		if (performedActions + errorsHappenend >= uncheckedObjects)
		{
			that.clearAudioFiles();
			if (typeof(callbackError) === "function")
			{
				callbackError.call(that, "Not all objects could be checked. Message: " + error, performedActions, uncheckedObjects);
				callbackError = null; //Prevents executing again.
			}
			that._checkingPlaying = false;
		}
	};
	
	
	//Function to execute when an object checks successfully:
	var callbackOkFunction =
		function(indexObject, thisObject)
		{
			//If it is LOADED or LOADING but its internal object is LOADED (would happen when changing API), marks the object as free and increments the pointer:
			if (thisObject.getStatus() === CB_AudioFile.LOADED || thisObject.getStatus() === CB_AudioFile.LOADING && thisObject.getStatus(true) === CB_AudioFile.LOADED)
			{
				//Marks the object as free and increments the pointer:
				that.audioFilesFree[++that.audioFilesFreePointer] = indexObject; //Also increases the pointer ("x" is the position of the object in the array).
				
				//Increases the files created counter:
				that.audioFilesCreated++;
				
				performedActions++;
				
				//Stores the minimum and maximum duration found:
				var duration = thisObject.getDuration();
				if (duration > 0 && (that.duration === 0 || duration < that.duration)) { that.duration = duration; }
				if (duration > that.durationMaximum) { that.durationMaximum = duration; }
				
				if (performedActions >= uncheckedObjects)
				{
					that.clearAudioFiles();
					if (that.status === CB_AudioFileCache.UNCHECKED) { that.status = CB_AudioFileCache.LOADED; }
					if (typeof(callbackOk) === "function")
					{
						callbackOk.call(that, performedActions, uncheckedObjects);
						callbackOk = null; //Prevents executing again (although is very unlikely).
					}
					that._checkingPlaying = false;
				}
				else if (performedActions + errorsHappenend >= uncheckedObjects)
				{
					that.clearAudioFiles();
					if (typeof(callbackError) === "function")
					{
						callbackError.call(that, "Not all objects could be checked. Message: " + lastError, performedActions, uncheckedObjects);
						callbackError = null; //Prevents executing again.
					}
					that._checkingPlaying = false;
				}
			}
			//...otherwise, if it is FAILED or ABORTED, calls the error functionn:
			else if (audioObject.getStatus() === CB_AudioFile.FAILED || audioObject.getStatus() === CB_AudioFile.ABORTED)
			{
				callbackErrorFunction("The object status is not LOADED or is not LOADING and internal object LOADED (status: " + audioObject.getStatus() + ", status internal object: " + audioObject.getStatus(true) + ") after checking successfully.");
			}
		};		

	//Executes checkPlaying for all UNCHECKED objects:
	this.executeFunctionAll
	(
		function(object, indexObject)
		{
			if (this.getStatus() === CB_AudioFile.UNCHECKED)
			{
				var thisObject = this;
				
				//Tries to play the sound:
				this.checkPlaying
				(
					function() { callbackOkFunction(indexObject, thisObject); },
					function(error) { callbackErrorFunction(thisObject, error); },
					false,
					ignoreQueue,
					false
				);
			}
		}
	);
	
	return uncheckedObjects;
}


/**
 * Tries to play all the {@link CB_AudioFile} objects by calling their {@link CB_AudioFile#play} method internally. If a {@link CB_AudioFile} object cannot be played and it is determined necessary, it will try to reload it internally (by calling the {@link CB_AudioFileCache#removeAudioFile} method). It does not create sound instances.
 *  @function
 *  @param {number} [startAt=0 | {@link CB_AudioFile_API.WAAPI#lastStartAt} | {@link CB_AudioFile_API.SM2#lastStartAt} | {@link CB_AudioFile_API.ACMP#lastStartAt} | {@link CB_AudioFile_API.AAPI#lastStartAt} | stopAt] - Time in milliseconds where we want the audio to start at. If not provided or it is not a valid number, it will use zero (0) as default which belongs to the beginning of the audio. If the value provided is greater than the "stopAt" provided, it will use the value set in the "lastStartAt" property of the used audio API object (which belongs to the "startAt" value the last time that the "play" method was called). If, even using the "lastStartAt" value is still greater than the "stopAt" provided, it will use the same value as the "stopAt" which means it will not play and will stop immediately. Used internally as the "startAt" parameter to call the {@link CB_AudioFile#play} method of the {@link CB_AudioFile} object.
 *  @param {number} [stopAt={@link CB_AudioFile_API.WAAPI#getDuration}() | {@link CB_AudioFile_API.SM2#getDuration}() | {@link CB_AudioFile_API.ACMP#getDuration}() | {@link CB_AudioFile_API.AAPI#getDuration}()] - Time in milliseconds where we want the audio to stop at. If not provided or it is not a valid number, it will use the returning value of the "getDuration" method of the used audio API object (which should belong to the total duration of the audio, if it was calculated correctly). Used internally as the "stopAt" parameter to call the {@link CB_AudioFile#play} method of the {@link CB_AudioFile} object.
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Sets whether we want to play the audio looping (starting again and again) or just play it once. Note that at the end of each loop the "onStop" function defined will not be called. Used internally as the "loop" parameter to call the {@link CB_AudioFile#play} method of the {@link CB_AudioFile} object.
 *  @param {number} [volume=CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME] - Desired volume to play the audio. Used internally as the "volume" parameter to call the {@link CB_AudioFile#setVolume} method of the {@link CB_AudioFile} object, before playing it.
 *  @param {boolean} [avoidDelayedPlay=false] - If set to false (recommended) and the audio failed previously or was aborted (destroyed), it will try to load it correctly again automatically and play it after that if possible (this can take some time so the audio could start playing after a delay). Otherwise, if set to true and the audio failed or was aborted (destroyed), the audio will not play at all and the "stop" method of the audio file object will be called immediately. Used internally as the "avoidDelayedPlay" parameter to call the {@link CB_AudioFile#play} method of the {@link CB_AudioFile} object.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - The maximum amount of time (in milliseconds) of delay that we accept before start playing the audio. If the amount of time is overcome, the audio will not play at all and the "stop" method will be called immediately. Used only when the "avoidDelayedPlay" parameter is set to false and the audio needs to be loaded because it failed previously or was aborted (destroyed). Used internally as the "allowedRecursiveDelay" parameter to call the {@link CB_AudioFile#play} method of the {@link CB_AudioFile} object.
 *  @param {function} [onPlayStart] - Function to be called when the audio starts playing successfully. The function will be called with the following parameters (in order): "startAt", "stopAt", "startAtNextLoop", "loop", "avoidDelayedPlay", "allowedRecursiveDelay" and "startPlayingTime", being "this" the {@link CB_AudioFile} object. Used internally as the "onPlayStart" parameter to call the {@link CB_AudioFile#play} method of the {@link CB_AudioFile} object.
 *  @param {function} [onStop] - Function that will be called each time that a {@link CB_AudioFile} object stops playing. Used internally as the "callbackFunction" parameter to call the {@link CB_AudioFile#onStop} method of the {@link CB_AudioFile} object, before playing it.
 *  @param {boolean} [includingPlaying=false] - If set to true, it will call the {@link CB_AudioFile#play} method even for those {@link CB_AudioFile} objects which are currently playing.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose {@link CB_AudioFile#play} method did not return the value of "-1" (this does not mean necessarily that they could be played successfully).
 *  @todo Think about implementing an "audioFiles" parameter.
 */
CB_AudioFileCache.prototype.playAll = function(startAt, stopAt, loop, volume, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onStop, includingPlaying)
{
	//Takes all objects out of the array of the free ones:
	this.audioFilesFree = [];
	this.audioFilesFreePointer = -1;
	
	var that = this;
					
	//Executes play for all:
	var performed = 0;
	this.executeFunctionAll
	(
		function(object, indexObject)
		{
			if (includingPlaying || !this.isPlaying())
			{
				var thisObject = this;
				
				var statusBefore = thisObject.getStatus();
				
				//Function that removes the sound (executed when play method fails to reload it or when sound is FAILED or ABORTED):
				this.onStop
				(
					function()
					{
						that._onStopDefaultFunction.call(that, indexObject, thisObject, statusBefore);
						if (typeof(onStop) === "function") { onStop.call(thisObject); }
					},
					false //Does not keep any possibly existing onStop function.
				);
				
				////////////this.onStop(onStop, true); //Keeps the previous function (which marks object as free when it stops).
				
				this.setVolume(volume, true); //Forces to set volume property because unchecked objects which use WAAPI still does not have gainNode created.
				
				//Tries to play the sound:
				var played = this.play(startAt, stopAt, loop, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, function() { that.removeAudioFile(thisObject, true, that.checkManuallyOnPlayingFailed); });
				
				//If the sound has not been played:
				if (played === -1)
				{
					//If the sound is FAILED or ABORTED, removes it:
					if (this.getStatus() === CB_AudioFile.FAILED || this.getStatus() === CB_AudioFile.ABORTED) { that.removeAudioFile(this, true, that.checkManuallyOnPlayingFailed); }
				}
				else { performed++; }
			}
		}
	);
	
	return performed;
}


/**
 * Tries to stops all the existing {@link CB_AudioFile} objects or the desired ones (if provided), which are being played, by calling their {@link CB_AudioFile#stop} method internally.
 *  @function
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - A numeric array containing the {@link CB_AudioFile} objects that we want to affect. It should contain only {@link CB_AudioFile} objects which are already in the current audio file cache. If not provided, it will use all the {@link CB_AudioFile} objects contained in the cache.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#stop} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileCache.prototype.stopAll = function(audioFiles)
{
	return this.executeFunctionAll(function() { this.stop(); }, 0, audioFiles);
}


/**
 * Plays silently and stops all {@link CB_AudioFile} objects after a desired time. It can be useful for some clients which need the {@link CB_AudioFile#play} method to be called through a user-driven event (as onClick, onTouch, etc.). Internally, it calls {@link CB_AudioFileCache#playAll}(0, null, false, 0, true, null, null, null, includingPlaying) and, after a desired delay, calls the {@link CB_AudioFileCache#stopAll} method.
 *  @function
 *  @param {boolean} [includingPlaying=false] - If set to true, it will call the {@link CB_AudioFile#play} method even for those {@link CB_AudioFile} objects which are currently playing.
 *  @param {number} [delayBeforeStop=100] - Delay (in milliseconds) before stopping the audio, that will be used as the second parameter of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function when calling the {@link CB_AudioFileCache#stopAll} method.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose {@link CB_AudioFile#play} method did not return the value of "-1" (this does not mean necessarily that they could be played successfully).
 *  @todo Think about implementing an "audioFiles" parameter.
 */
CB_AudioFileCache.prototype.playAndStopAll = function(includingPlaying, delayBeforeStop)
{
	if (typeof(delayBeforeStop) === "undefined" || delayBeforeStop === null || isNaN(delayBeforeStop) || delayBeforeStop < 0) { delayBeforeStop = 100; }
	var played = this.playAll(0, null, false, 0, true, null, null, null, includingPlaying); //Plays silently.
	var that = this;
	setTimeout(function() { that.stopAll.call(that); }, delayBeforeStop); //Stops the sound after the delay desired.
	return played;
}


/**
 * Tries to pause all the existing {@link CB_AudioFile} objects or the desired ones (if provided), which are being played, by calling their {@link CB_AudioFile#pause} method internally.
 *  @function
 *  @param {function} [onPause] - Function without parameters to be called when the audio is paused successfully, being "this" the {@link CB_AudioFile} object. Used internally as the "onPause" parameter to call the {@link CB_AudioFile#pause} method of the {@link CB_AudioFile} object.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - A numeric array containing the {@link CB_AudioFile} objects that we want to affect. It should contain only {@link CB_AudioFile} objects which are already in the current audio file cache. If not provided, it will use all the {@link CB_AudioFile} objects contained in the cache.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#pause} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileCache.prototype.pauseAll = function(onPause, audioFiles)
{
	return this.executeFunctionAll(function() { this.pause(onPause); }, 0, audioFiles);
}


/**
 * Resumes all the existing {@link CB_AudioFile} objects or the desired ones (if provided), which are paused (and not stopped). It uses the {@link CB_AudioFileCache#play} method internally.
 *  @function
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Used internally as the "loop" parameter to call the {@link CB_AudioFileCache#play} method.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - Used internally as the "allowedRecursiveDelay" parameter to call the {@link CB_AudioFileCache#play} method.
 *  @param {boolean} [allowedRecursiveDelaySkipping=CB_AudioFile#lastStopAt-CB_AudioFile#lastStartAt] - Used internally as the "allowedRecursiveDelaySkipping" parameter to call the {@link CB_AudioFileCache#play} method.
 *  @param {function} [onPlayStart] - Used internally as the "onPlayStart" parameter to call the {@link CB_AudioFileCache#play} method.
 *  @param {function} [onStop] - Used internally as the "onStop" parameter to call the {@link CB_AudioFileCache#play} method.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - A numeric array containing the {@link CB_AudioFile} objects that we want to affect. It should contain only {@link CB_AudioFile} objects which are already in the current audio file cache. If not provided, it will use all the {@link CB_AudioFile} objects contained in the cache.
 *  @returns {array} Returns a numeric array containing all the return values of each internal call to the {@link CB_AudioFileCache#play} method.
 */
CB_AudioFileCache.prototype.resumeAll = function(loop, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, audioFiles)
{
	var that = this;
	var startAt;
	var startAtOriginal;
	var soundInstances = [];
	//var soundInstance;
	this.executeFunctionAll
	(
		function()
		{
			if (this.isPaused() && !this.isStopped())
			{
				//Gets the data needed for the resume:
				startAt = this.audioFileObject.pauseTime;
				startAtOriginal = this.audioFileObject.lastStartAt;

				if (startAt >= this.audioFileObject.lastStopAt)
				{
					startAt = this.audioFileObject.lastStopAt - 1; //We will begin just 1 millisecond before (otherwise the play method would begin again from lastStartAt).
				}
				
				//Maybe the object which will be played (resumed) will not be this one, so we stop it and declare it as not paused (no one paused should remain):
				this._fireOnStopByUser = false;
				this.stop(false, false, true); //This way we also make it free (firing onStop).
				this._fireOnStopByUser = true;
				
				//var loopSet = loop;
				//if (typeof(loopSet) === "undefined" || loopSet === null) { loopSet = this.loop; } //By default, uses the previous loop used.
				if (typeof(loop) === "undefined" || loop === null) { loop = this.loop; } //By default, uses the previous loop used.
				
				//Plays a sound (maybe not the same object) which will simulate a resume with the data we have:
				soundInstances[soundInstances.length] = that.play(startAt, this.audioFileObject.lastStopAt, loop /*loopSet*/, this.audioFileObject.volumeBeforeMute, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, null, startAtOriginal);
				//this.resume(loop, null, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, function() { that.removeAudioFile(thisObject, true); });
				
				//soundInstances[soundInstances.length] = soundInstance;
			}
		},
		0,
		audioFiles
	);
	return soundInstances;
}


/**
 * Mutes all the existing {@link CB_AudioFile} objects or the desired ones (if provided). It uses the {@link CB_AudioFile#mute} method internally.
 *  @function
 *  @param {function} [onMute] - Callback function which will be called for each audio file if it has been possible to mute it (or at least it was possible to try it), being "this" the {@link CB_AudioFile} object. Used internally as the "onMute" parameter to call the {@link CB_AudioFile#mute} method.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - A numeric array containing the {@link CB_AudioFile} objects that we want to affect. It should contain only {@link CB_AudioFile} objects which are already in the current audio file cache. If not provided, it will use all the {@link CB_AudioFile} objects contained in the cache.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#mute} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileCache.prototype.muteAll = function(onMute, audioFiles)
{
	return this.executeFunctionAll(function() { this.mute(onMute); }, 0, audioFiles);
}


/**
 * Unmutes all the existing {@link CB_AudioFile} objects or the desired ones (if provided). It uses the {@link CB_AudioFile#unmute} method internally.
 *  @function
 *  @param {function} [onUnmute] - Callback function which will be called for each audio file if it has been possible to unmute it (or at least it was possible to try it), being "this" the {@link CB_AudioFile} object. Used internally as the "onUnmute" parameter to call the {@link CB_AudioFile#unmute} method.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - A numeric array containing the {@link CB_AudioFile} objects that we want to affect. It should contain only {@link CB_AudioFile} objects which are already in the current audio file cache. If not provided, it will use all the {@link CB_AudioFile} objects contained in the cache.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#unmute} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileCache.prototype.unmuteAll = function(onUnmute, audioFiles)
{
	return this.executeFunctionAll(function() { this.unmute(onUnmute); }, 0, audioFiles);
}


/**
 * Sets the same volume for all the existing {@link CB_AudioFile} objects or the desired ones (if provided). It uses the {@link CB_AudioFile#setVolume} method internally.
 *  @function
 *  @param {number} [volume={@link CB_Speaker.getVolume()} | {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME}] - Desired volume (from 0 to the maximum value, where the maximum value will be the returning value of calling the {@link CB_Speaker.getVolume} function if the {@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM} property is set to true or it will be 100 otherwise). Used internally as the "volume" parameter to call the {@link CB_AudioFile#setVolume} method.
 *  @param {boolean} [forceSetVolumeProperty=false] - If set to true (not recommended), it will change the "volume" property of the used audio API object even when the volume was failed to be changed. Used internally as the "forceSetVolumeProperty" parameter to call the {@link CB_AudioFile#setVolume} method.
 *  @param {function} [onSetVolume] - Callback function which will be called if it has been possible to set the volume (or at least it was possible to try it), being "this" the {@link CB_AudioFile} object. Used internally as the "onSetVolume" parameter to call the {@link CB_AudioFile#setVolume} method.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - A numeric array containing the {@link CB_AudioFile} objects that we want to affect. It should contain only {@link CB_AudioFile} objects which are already in the current audio file cache. If not provided, it will use all the {@link CB_AudioFile} objects contained in the cache.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#setVolume} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileCache.prototype.setVolumeAll = function(volume, forceSetVolumeProperty, onSetVolume, audioFiles)
{
	return this.executeFunctionAll(function() { this.setVolume(volume, forceSetVolumeProperty, onSetVolume); }, 0, audioFiles);
}


/**
 * Callback function used by the {@link CB_AudioFileCache#setAudioAPIAll} method that will be called when all the process was performed successfully.
 *  @memberof CB_AudioFileCache
 *  @callback CB_AudioFileCache.setAudioAPIAll_CALLBACK_OK
 *  @param {integer} objectsChangedAPI - The number of {@link CB_AudioFile} objects that actually changed its audio API.
 *  @param {integer} performedActions - The number of {@link CB_AudioFile} objects that ended with a desired audio API, including those ones which were already using it.
 *  @param {integer} actionsNeeded - The total number of {@link CB_AudioFile} objects  that were considered to perform the action (it will be undefined if it could not be determined).
 */

 /**
 * Callback function used by the {@link CB_AudioFileCache#setAudioAPIAll} method that will be called when any error happened.
 *  @memberof CB_AudioFileCache
 *  @callback CB_AudioFileCache.setAudioAPIAll_CALLBACK_ERROR
 *  @param {string} error - A string describing the error, if it was possible to be determined.
 *  @param {integer} errorsHappened - The number of errors that happened, which could be greater than 1 if more than one internal call to the {@link CB_AudioFile#setAudioAPI} method failed.
 *  @param {integer} objectsChangedAPI - The number of {@link CB_AudioFile} objects that actually changed its audio API.
 *  @param {integer} performedActions - The number of {@link CB_AudioFile} objects that ended with a desired audio API, including those ones which were already using it.
 *  @param {integer} actionsNeeded - The total number of {@link CB_AudioFile} objects  that were considered to perform the action (it will be undefined if it could not be determined).
 */ 
 
 /**
 * Tries to change the audio API for all the existing {@link CB_AudioFile} objects or the desired ones (if provided). Uses the {@link CB_AudioFile#setAudioAPI} method internally. This method is not allowed to be called if a previous call to it did not finish yet. The function defined in the "callbackError" parameter, if any, will be called immediately if the method was previously called and it is still running currently.
 *  @function
 *  @param {array|string} preferredAPIs - Array of strings with the preferred audio API or audio APIs, in order of preference. It also accepts a string with only one audio API. If more than one audio API is provided and setting an audio API fails for a {@link CB_AudioFile} object, it will try setting the next one and so on (this means that some of the {@link CB_AudioFile} objects could end with a different audio API). Possible audio APIs are "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
 *  @param {CB_AudioFileCache.setAudioAPIAll_CALLBACK_OK} [callbackOk] - Function that will be called when all the process was performed successfully, being "this" the {@link CB_AudioFileCache} object.
 *  @param {CB_AudioFileCache.setAudioAPIAll_CALLBACK_ERROR} [callbackError] - Function that will be called when any error happened, being "this" the {@link CB_AudioFileCache} object. This function will be called immediately if the method was previously called and it is still running currently.
 *  @param {boolean} [mandatory=false] - If set to true and any {@link CB_AudioFile} object could not perform successfully any call to its {@link CB_AudioFile#setAudioAPI} method for all desired audio APIs provided in the "preferredAPIs" parameter (this means that, internally, all the {@link CB_AudioFile#setAudioAPI} calls, one per desired audio API, have fired an error by calling the function defined in its "callbackError" parameter), the audio file cache will be set as "FAILED" (the {@link CB_AudioFileCache#status} property will be set to the value of {@link CB_AudioFileCache.FAILED}).
 *  @param {string} [forceReload=false] - Used internally as the "forceReload" parameter when calling the {@link CB_AudioFile#setAudioAPI} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - A numeric array containing the {@link CB_AudioFile} objects that we want to affect. It should contain only {@link CB_AudioFile} objects which are already in the current audio file cache. If not provided, it will use all the {@link CB_AudioFile} objects contained in the cache.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#setAudioAPI} method that were performed (which should be the same number as the {@link CB_AudioFile} objects in the "audioFiles" parameter).
 */
CB_AudioFileCache.prototype.setAudioAPIAll = function(preferredAPIs, callbackOk, callbackError, mandatory, forceReload, audioFiles)
{
	//No sound object should be free now (because all are changing their API):
	///////this.audioFilesFree = [];
	///////this.audioFilesFreePointer = -1;
	
	if (this._settingAPI)
	{
		if (typeof(callbackError) === "function")
		{
			callbackError.call(this, "Method setAudioAPIAll cannot be executed again until it finishes.", 1, 0, 0, undefined);
		}
		return 0;
	}
	
	this._settingAPI = true;
	
	var that = this;
	
	//Function to execute when all APIs fail to apply to a single object:
	var objectsChangedAPI = 0;
	var errorsHappened = 0;
	var errorFunction =
		function(error, avoidFailing, callErrorFunction)
		{
			errorsHappened++;
			
			//If all actions have performed (fine or with an error), sets the cache as LOADED and clears the array:
			if (performedActions + errorsHappened >= actionsNeeded)
			{
				that.status = CB_AudioFileCache.LOADED;
				that.clearAudioFiles();
				callErrorFunction = true;
			}
			
			//If it was mandatory and we do not want to avoid failing, sets the cache as FAILED:
			if (mandatory && !avoidFailing) { that.status = CB_AudioFileCache.FAILED; }
			
			//Calls the error function (if any):
			if (callErrorFunction)
			{
				if (typeof(callbackError) === "function")
				{
					callbackError.call(that, error, errorsHappened, objectsChangedAPI, performedActions, actionsNeeded);
					callbackError = null; //Prevents calling the function again.
				}
				that._settingAPI = false;
			}
		};
	
	var performedActions = 0;
	var actionsNeeded = undefined;
	
	//If no preferred APIs are sent, throws an error and exits:
	if (typeof(preferredAPIs) === "undefined" || preferredAPIs === null) { errorFunction("No APIs given.", true, true); return 0; } //Avoid setting status to FAILED.
	//...otherwise, if the API sent is not an array, turns it into an array:
	else if (!CB_isArray(preferredAPIs)) { preferredAPIs = [CB_trim(preferredAPIs)]; }
	
	//Filters the audio APIs to just use the supported ones:
	preferredAPIs = CB_AudioDetector.getSupportedAPIs(preferredAPIs);
	//If preferredAPIs is empty, calls the OK function and exits:
	//if (preferredAPIs.length === 0) { callbackOkFunction(null, true); return 0; }
	//If preferredAPIs is empty, calls the error function and exits:
	if (preferredAPIs.length === 0) { errorFunction("No APIs supported from the provided ones.", true, true); return 0; }
	
	//If the URI list has no elements, exits:
	if (typeof(this._URIsListLast) === "undefined" || !CB_isArray(this._URIsListLast) || this._URIsListLast.length === 0) { errorFunction("URIs list is undefined or empty.", true, true); return 0; }

	//If the cache status is not LOADED, exits:
	if (this.status !== CB_AudioFileCache.LOADED) { errorFunction("Cache is not loaded.", true, true); return 0; }
	
	//Defines how many actions will have to be performed:
	
	if (typeof(audioFiles) === "undefined" || audioFiles === null || !CB_isArray(audioFiles)) { audioFiles = this.audioFiles; }
	else if (audioFiles.length === 0)
	{
		if (typeof(callbackOk) === "function") { callbackOk.call(this, 0, 0, undefined); }
		this._settingAPI = false;
		return 0;
	}
	
	this.status = CB_AudioFileCache.LOADING; //The cache is loading.
	
	actionsNeeded = 0;
	var audioFilesLength = audioFiles.length;
	for (var x = 0; x < audioFilesLength; x++)
	{
		//If the object exists:
		if (typeof(audioFiles[x]) !== "undefined" && audioFiles[x] !== null)
		{
			actionsNeeded++;
		}
	}
	
	//Function to execute when the audio object has changed the API successfully:
	var callbackOkFunction =
		function(indexObject, sameAPI)
		{
			if (!sameAPI) { objectsChangedAPI++; }
			
			//The audio object is free now:
			///////that.audioFilesFree[++that.audioFilesFreePointer] = indexObject;
			
			//Increments the counter of objects that have performed the action well:
			performedActions++;
			
			//Stores the minimum and maximum duration found:
			var duration = this.getDuration();
			if (duration > 0 && (that.duration === 0 || duration < that.duration)) { that.duration = duration; }
			if (duration > that.durationMaximum) { that.durationMaximum = duration; }
			
			//If all objects have performed their action well:
			if (performedActions >= actionsNeeded)
			{
				that.clearAudioFiles();

				//The cache finished loading:
				that.status = CB_AudioFileCache.LOADED;

				//We call the OK function (if any):
				if (typeof(callbackOk) === "function")
				{
					callbackOk.call(that, objectsChangedAPI, performedActions, actionsNeeded);
					callbackOk = null; //Prevents calling the function again.
				}
				that._settingAPI = false;
			}
			//...otherwise, if all actions have performed (fine or with an error), sets the cache as LOADED and clears the array:
			else if (performedActions + errorsHappened >= actionsNeeded)
			{
				that.status = CB_AudioFileCache.LOADED;
				that.clearAudioFiles();

				//If it was mandatory, sets the cache as FAILED:
				if (mandatory) { that.status = CB_AudioFileCache.FAILED; }
				
				//Calls the error function (if any):
				if (typeof(callbackError) === "function")
				{
					callbackError.call(that, error, errorsHappened, objectsChangedAPI, performedActions, actionsNeeded);
					callbackError = null; //Prevents calling the function again.
				}
				that._settingAPI = false;
			}
		};
	
	//Function to execute when the audio object has failed to change the API:
	var callbackErrorFunction =
		function(error, indexObject, preferredAPIs, URIsList, URIsIndex, currentRetry, APIsTried)
		{
			/////that.clearAudioFiles();

			var thisObject = this;
			
			//If it is the last URI and last API we can try, fails:
			if (URIsIndex + 1 >= URIsList.length && preferredAPIs.length <= 1)
			{
				thisObject.settingAPI = false;
				
				//Calls the error function:
				errorFunction(error);
				return;
			}
			//...otherwise, continues trying the next desired API:
			else
			{
				//If the desired number of retries have been executed, passes to the next URI:
				if (++currentRetry > that.retries)
				{
					currentRetry = 0;
					//If all URIs have been tried, passes to the next API:
					if (++URIsIndex >= URIsList.length)
					{
						URIsIndex = 0;
						preferredAPIs = preferredAPIs.slice(1); //Takes out the first API (the one we have already tried).
					}
				}
				//Calls the function again to try again:
				setTimeout
				(
					function()
					{
						setAPIEach.call(thisObject, thisObject, indexObject, undefined, undefined, preferredAPIs, URIsList, URIsIndex, currentRetry, APIsTried);
					},
					(currentRetry === 0) ? 100 : 1000 //Delay is bigger if we are still trying the same API (to avoid problems with Firefox and AAPI or SM2).
				);
			}
		};


	/////this.clearAudioFiles();			
	
	//Function to execute to change API for a single object:
	var setAPIEach =
		function(object, indexObject, array, delay, preferredAPIsLocal, URIsList, URIsIndex, currentRetry, APIsTried)
		{
			if (typeof(preferredAPIsLocal) === "undefined" || preferredAPIsLocal === null) { preferredAPIsLocal = preferredAPIs; }
			
			if (typeof(URIsList) === "undefined" || URIsList === null) { URIsList = that._URIsListLast; }
			if (typeof(URIsIndex) === "undefined" || URIsIndex === null) { URIsIndex = 0; }
			if (typeof(currentRetry) === "undefined" || currentRetry === null) { currentRetry = 0; }
			if (typeof(APIsTried) === "undefined" || APIsTried === null) { APIsTried = []; }

			//If the API used is already being used, just calls the OK function and exits:
			if (this.audioAPI === preferredAPIsLocal[0]) { callbackOkFunction.call(this, indexObject, true); return; }
			
			//If it is the first time we try the API:
			if (CB_indexOf(APIsTried, preferredAPIsLocal[0]) === -1)
			{
				//Stores the new API that we are going to try:
				APIsTried[APIsTried.length] = preferredAPIsLocal[0];
				
				//If the current object has already loaded the current API before, gets its URI:
				if (typeof(this.audioFileObjects) !== "undefined" && typeof(this.audioFileObjects[preferredAPIsLocal[0]]) !== "undefined")
				{
					if (typeof(this.audioFileObjects[preferredAPIsLocal[0]].status) !== "undefined" && this.audioFileObjects[preferredAPIsLocal[0]].status === CB_AudioFile.LOADED)
					{
						if (typeof(this.audioFileObjects[preferredAPIsLocal[0]].filePath) !== "undefined" && this.audioFileObjects[preferredAPIsLocal[0]].filePath !== null)
						{
							var firstURI = this.audioFileObjects[preferredAPIsLocal[0]].filePath;
							
							//If the currently used URI is in the URIs list:
							if (CB_indexOf(URIsList, firstURI) !== -1)
							{
								//Places the URI used at the beginning:
								var URIsListNew = [];
								URIsListNew[0] = firstURI;
								
								//Refills the array with the rest of the URIs:
								var URIsListLength = URIsList.length;
								for (var x = 0; x < URIsListLength; x++)
								{
									if (URIsList[x] !== firstURI)
									{
										URIsListNew[URIsListNew.length] = URIsList[x];
									}
								}
								
								//Saves the new order:
								URIsList = URIsListNew;
							}
						}
					}
				}
			}
			
			var thisObject = this;
			
			thisObject.settingAPI = true;

			//Tries to change the API:
			this.setAudioAPI
			(
				preferredAPIsLocal[0], //audioAPI.
				true, //audoLoad.
				false, //autoPlay.
				function() { thisObject.settingAPI = false; callbackOkFunction.call(thisObject, indexObject); }, //callbackOk.
				function(error) { callbackErrorFunction.call(thisObject, error, indexObject, preferredAPIsLocal, URIsList, URIsIndex, currentRetry, APIsTried); }, //callbackError,
				false, //ignoreOldValues.
				URIsList[URIsIndex], //filePath.
				forceReload //forceReload
			);
			
			/////that.clearAudioFiles();
		};
	
	//Tries to change the API for all objects:
	///////this.executeFunctionAll(setAPIEach, 10);
	//return this.executeFunctionAll(setAPIEach);
	return this.executeFunctionAll(setAPIEach, 0, audioFiles);
}


/**
 * Tells whether any of the {@link CB_AudioFile} objects is playing or not. It uses the {@link CB_AudioFile#isPlaying} method internally.
 *  @function
 *  @returns {boolean} Returns whether any of the {@link CB_AudioFile} objects is playing or not.
 */
CB_AudioFileCache.prototype.isPlaying = function()
{
	var audioFilesLength = this.audioFiles.length;
	for (var x = 0; x < audioFilesLength; x++)
	{
		if (typeof(this.audioFiles[x]) !== "undefined" && typeof(this.audioFiles[x].isPlaying) !== "undefined" && this.audioFiles[x].isPlaying())
		{
			return true;
		}
	}
	return false;
}


/**
 * Tells the current number of free {@link CB_AudioFile} objects (the number of objects which are available and ready to use).
 *  @function
 *  @returns {integer} Returns the current number of free {@link CB_AudioFile} objects (the number of objects which are available and ready to use).
 */
CB_AudioFileCache.prototype.getAudioFilesFreeNumber = function()
{
	return this.audioFilesFreePointer + 1;
}


/**
 * Gets an array with all the {@link CB_AudioFile} objects.
 *  @function
 *  @param {boolean} [copy=false] - If set to true, instead of returning the {@link CB_AudioFileCache#audioFiles} property directly, it will return a new copy of it.
 *  @returns {array} Returns an array with all the {@link CB_AudioFile} objects.
 */
CB_AudioFileCache.prototype.getAudioFiles = function(copy)
{
	if (copy)
	{
		var audioFiles = [];
		var audioFilesLength = this.audioFiles.length;
		var y = 0;
		for (var x = 0; x < audioFilesLength; x++)
		{
			if (typeof(this.audioFiles[x]) !== "undefined" && this.audioFiles[x] !== null)
			{
				audioFiles[y++] = this.audioFiles[x];
			}
		}
		return audioFiles;
	}
	else { return this.audioFiles; }
}


/**
 * Gets an array with the free {@link CB_AudioFile} objects (the objects which are available and ready to use).
 *  @function
 *  @returns {array} Returns an array with the free {@link CB_AudioFile} objects (the objects which are available and ready to use).
 */
CB_AudioFileCache.prototype.getAudioFilesFree = function()
{
	var audioFiles = [];
	var audioFilesLength = this.audioFiles.length;
	var y = 0;
	for (var x = 0; x < audioFilesLength; x++)
	{
		if (typeof(this.audioFiles[x]) !== "undefined" && this.audioFiles[x] !== null && this.isAudioFileFreeByPosition(x)) //"x" is the position.
		{
			audioFiles[y++] = this.audioFiles[x];
		}
	}
	return audioFiles;
}


/**
 * Gets an array with the busy {@link CB_AudioFile} objects (the objects which are not available and ready to use).
 *  @function
 *  @returns {array} Returns an array with the busy {@link CB_AudioFile} objects (the objects which are not available and ready to use).
 */
CB_AudioFileCache.prototype.getAudioFilesBusy = function()
{
	var audioFiles = [];
	var audioFilesLength = this.audioFiles.length;
	var y = 0;
	for (var x = 0; x < audioFilesLength; x++)
	{
		if (typeof(this.audioFiles[x]) !== "undefined" && this.audioFiles[x] !== null && !this.isAudioFileFreeByPosition(x)) //"x" is the position.
		{
			audioFiles[y++] = this.audioFiles[x];
		}
	}
	return audioFiles;
}


/**
 * Tells the number of {@link CB_AudioFile} objects created.
 *  @function
 *  @param {boolean} [real=false] - If set to true, instead of returning the value of the {@link CB_AudioFileCache#audioFilesCreated} property, it will return the value of the "length" property of the {@link CB_AudioFileCache#audioFiles} array which are the real number of {@link CB_AudioFile} objects used. If all went well, the returning value should be always the same regardless of this parameter.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects created.
 */
CB_AudioFileCache.prototype.getAudioFilesNumber = function(real)
{
	if (real) { return this.audioFiles.length; }
	else { return this.audioFilesCreated; }
}


/**
 * Tells the duration (minimum or maximum) of the sound stored (in milliseconds). Although the audio file cache should always be used to cache the same sound only, the duration might not always be the same due the usage of different formats, file paths, etc. So this method returns either the minimum or the maximum duration found among all the {@link CB_AudioFile} objects.
 *  @function
 *  @param {boolean} [maximum=false] - If set to true, instead of returning the value of the {@link CB_AudioFileCache#duration} property (which belongs to the minimum duration found among all the {@link CB_AudioFile} objects), it will return the value of {@link CB_AudioFileCache#durationMaximum} property (which belongs to the maximum duration found among all the {@link CB_AudioFile} objects).
 *  @returns {number} Returns the duration (minimum or maximum) of the sound stored (in milliseconds). Although the audio file cache should always be used to cache the same sound only, the duration might not always be the same due the usage of different formats, file paths, etc. So this method returns either the minimum or the maximum duration found among all the {@link CB_AudioFile} objects.
 */
CB_AudioFileCache.prototype.getDuration = function(maximum)
{
	if (maximum) { return this.durationMaximum; }
	else { return this.duration; }
}


/**
 * Returns a number representing the percentage of the loading progress for the audio file cache (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable.
 *  @function
 *  @param {boolean} [countLoadedObjects=false] - If set to true, it will count the {@link CB_AudioFile} objects whose {@link CB_AudioFile#getStatus} method returns "LOADED" (the value of the {@link CB_AudioFile#LOADED} property), instead of just using the array's "length" of the {@link CB_AudioFileCache#audioFiles} property.
 *  @param {boolean} [alsoUncheckedAndCheckingObjects=false] - If set to true and the "countLoadedObjects" parameter is also true, it will also count the {@link CB_AudioFile} objects whose {@link CB_AudioFile#getStatus} method returns "UNCHECKED" (the value of the {@link CB_AudioFile#UNCHECKED} property) or "CHECKING" (the value of the {@link CB_AudioFile#CHECKING} property). If the "countLoadedObjects" parameter is false, this parameter will be ignored.
 *  @returns {number} Returns a number representing the percentage of the loading progress for the audio file cache (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable.
 *  @todo Although it would be more accurate, it does not use the {@link CB_AudioFile#getProgress} method internally because the {@link CB_AudioFile} objects are not added to the {@link CB_AudioFileCache#audioFiles} property until they are loaded. It would be nice to code a way to be able to use it (perhaps a property where the {@link CB_AudioFile} objects loading are kept temporarily).
 */
CB_AudioFileCache.prototype.getProgress = function(countLoadedObjects, alsoUncheckedAndCheckingObjects)
{
	//var objectsLoaded = (this.audioFiles.length < this.audioFilesCreated) ? this.audioFiles.length : this.audioFilesCreated; //Takes the smallest number.
	var objectsLoaded = this.audioFiles.length;
	if (countLoadedObjects)
	{
		var audioFilesLength = this.audioFiles.length;
		var objectsReallyLoaded = 0;
		for (var x = 0; x < audioFilesLength; x++)
		{
			if (typeof(this.audioFiles[x]) !== "undefined" && typeof(this.audioFiles[x].getStatus) !== "undefined")
			//if (typeof(this.audioFiles[x]) !== "undefined" && typeof(this.audioFiles[x].getStatus) !== "undefined")
			{
				if (typeof(this.audioFiles[x].settingAPI) === "undefined" || !this.audioFiles[x].settingAPI)
				{
					if (this.audioFiles[x].getStatus() === CB_AudioFile.LOADED) { objectsReallyLoaded++; }
					else if (alsoUncheckedAndCheckingObjects && (this.audioFiles[x].getStatus() === CB_AudioFile.UNCHECKED || this.audioFiles[x].getStatus() === CB_AudioFile.CHECKING)) { objectsReallyLoaded++; }
				}
				/*
				//LOADED counts as one:
				if (this.audioFiles[x].getStatus() === CB_AudioFile.LOADED)
				{
					objectsReallyLoaded++;
				}
				//UNCHECKED and CHECKING counts as 50%:
				else if (this.audioFiles[x].getStatus() === CB_AudioFile.UNCHECKED || this.audioFiles[x].getStatus() === CB_AudioFile.CHECKING)
				{
					objectsReallyLoaded += 0.5;
				}
				//LOADING counts as 50% when the progress is 100%:
				else if (this.audioFiles[x].getStatus() === CB_AudioFile.LOADING)
				{
					objectsReallyLoaded += this.audioFiles[x].getProgress() / 200; //It will be 0.5 when the object is loaded completely (getProgress returns 100).
				}
				*/
			}
		}
		//objectsLoaded = (objectsLoaded < objectsReallyLoaded) ? objectsLoaded : objectsReallyLoaded; //Takes the smallest number.
		objectsLoaded = objectsReallyLoaded;
	}
	var objectsNeeded = this.minimumAudioFiles;
	var progress = (objectsLoaded / objectsNeeded) * 100;
	if (progress > 100) { progress = 100; }
	else if (progress < 0) { progress = 0; }
	//if (progress === 100 && this.status === CB_AudioFileCache.LOADING) { progress = 99.99; }
	return progress;
}


/**
 * Gets the current status of the audio file cache.
 *  @function
 *  @returns {number} Returns the current status of the audio file cache. It is a number, which should match the value of the {@link CB_AudioFileCache.UNLOADED} (still unloaded), {@link CB_AudioFileCache.LOADING} (loading), {@link CB_AudioFileCache.UNCHECKED} (not checked by calling the {@link CB_AudioFileCache#checkPlayingAll} method yet), {@link CB_AudioFileCache.CHECKING} (being checked by the {@link CB_AudioFileCache#checkPlayingAll} method), {@link CB_AudioFileCache.LOADED} (loaded), {@link CB_AudioFileCache.FAILED} (failed loading or failed to play or by any other reason) or {@link CB_AudioFileCache.ABORTED} (aborted because it was destroyed with the "destructor" method) property.
 */
CB_AudioFileCache.prototype.getStatus = function()
{
	return this.status;
}


/**
 * Gets the current status of the audio file cache, as a string.
 *  @function
 *  @returns {string} Returns the current status of the audio file cache, as a string. Possible return values are "UNLOADED", "LOADING", "UNCHECKED", "CHECKING", "LOADED", "FAILED", "ABORTED" or "UNKNOWN (UNKNOWN_STATUS)" (where "UNKNOWN_STATUS" will be a value from the {@link CB_AudioFileCache#status} property not recognized as any possible status).
 */
CB_AudioFileCache.prototype.getStatusString = function()
{
	var status = this.getStatus();
	var statuses = [ "UNLOADED", "LOADING", "UNCHECKED", "CHECKING", "LOADED", "FAILED", "ABORTED" ];
	if (typeof(statuses[status]) !== "undefined") { return statuses[status]; }
	else { return "UNKNOWN (" + status + ")"; }
}


/**
 * Calls the error function which should be set in the {@link CB_AudioFileCache#onError} property (if any), being "this" the {@link CB_AudioFileCache} object itself. Internal usage only recommended.
 *  @function
 *  @param {string} [message] - The message describing the error that will be sent to the set {@link CB_AudioFileCache#onError} function (if any) as the first and unique parameter.
 *  @param {boolean} [avoidFailing=false] - If set to true, it will not set the {@link CB_AudioFileCache#status} property to "FAILED" (the value of the {@link CB_AudioFile#FAILED} property).
 *  @returns {boolean} Returns true if the {@link CB_AudioFileCache#onError} function could be called or false otherwise.
 */
CB_AudioFileCache.prototype.errorFunction = function(message, avoidFailing)
{
	if (!avoidFailing) { this.status = CB_AudioFileCache.FAILED; }
	if (typeof(this.onError) === "function") { this.onError.call(this, message); return true; }
	return false;
}