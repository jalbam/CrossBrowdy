/**
 * @file Audio sprites pool management. Contains the {@link CB_AudioFileSpritesPool} class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */


/**
 * Object whose property names the identifiers of each sprite (a case-sensitive string) and their value is a {@link CB_AudioFileSprites.DATA_OBJECT} object.
 * @example
 * {
 *	"sprites_group_id_1" : CB_AudioFileSprites.DATA_OBJECT,
 *	"sprites_group_id_2" : CB_AudioFileSprites.DATA_OBJECT,
 *	"sprites_group_id_3" : CB_AudioFileSprites.DATA_OBJECT,
 *	...
 * }
 *  @memberof CB_AudioFileSpritesPool
 *  @typedef {Object} CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT
 *  @property {CB_AudioFileSprites.DATA_OBJECT} spritesGroupId - Being the name of each property the unique identifier of a sprites group which will use a future internally-created {@link CB_AudioFileSprites} object, the value will always be the {@link CB_AudioFileSprites.DATA_OBJECT} that the {@link CB_AudioFileSprites} object will use to be created (received by its constructor). Some of the missing properties ("preferredAPIs", "preferredFormats", "minimumAudioFiles", "maximumAudioFiles", "minimumAudioFilesFree", "newAudioFilesWhenNeeded", "retries", "checkManually", "checkManuallyOnNeededCreated", "checkManuallyOnPlayingFailed", "checkManuallyOnCheckingFailed" and "disableAutoLoad") will use the value set on the properties of the main {@link CB_AudioFileSpritesPool.DATA_OBJECT} object (if any) used by the {@link CB_AudioFileSpritesPool} object. If a function in the "onError" parameter is given, it will always be wrapped so the main error function set on the {@link CB_AudioFileSpritesPool#onError} parameter will always be called (if any) through the {@link CB_AudioFileSpritesPool#errorFunction} method.
 */

 
/**
 * Object with the desired data and options for the audio sprites. It is almost identical to the {@link CB_AudioFileSprites.DATA_OBJECT} but adding a "spritesGroups" property.
 *  @memberof CB_AudioFileSpritesPool
 *  @typedef {Object} CB_AudioFileSpritesPool.DATA_OBJECT
 *  @property {CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} [spritesGroups] - Object with the desired sprites groups, containing the {@link CB_AudioFileSprites.DATA_OBJECT} objects which will be used to create the {@link CB_AudioFileSprites} objects internally. Each group will have a {@link CB_AudioFileSprites} object. It will be used as the first parameter to call the {@link CB_AudioFileSpritesPool#insertSpritesGroups} method internally. Some of the missing properties ("preferredAPIs", "preferredFormats", "minimumAudioFiles", "maximumAudioFiles", "minimumAudioFilesFree", "newAudioFilesWhenNeeded", "retries", "checkManually", "checkManuallyOnNeededCreated", "checkManuallyOnPlayingFailed", "checkManuallyOnCheckingFailed" and "disableAutoLoad") of the {@link CB_AudioFileSprites.DATA_OBJECT} objects given will use the value set on the other properties of this object (if any).
 *  @property {string} [id=""] - Desired identifier for the object. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#id} property.
 *  @property {array} [preferredAPIs={@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_APIS}] - Array of strings with the preferred audio API or audio APIs, in order of preference. Possible audio APIs are "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}). It will try to calculate and use the best one for the current client. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#preferredAPIs} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "preferredAPIs" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {array} [preferredFormats={@link CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS}] - Array of strings with the preferred audio format or audio formats (they can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"'), in order of preference. It will try to calculate and use the best one for the current client. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#preferredFormats} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "preferredFormats" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {integer} [minimumAudioFiles={@link CB_AudioFileCache.minimumAudioFiles_DEFAULT}] - Minimum {@link CB_AudioFile} objects to create internally. It must be an integer being 1 the minimum. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#minimumAudioFiles} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "minimumAudioFiles" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {integer} [maximumAudioFiles={@link CB_AudioFileCache.maximumAudioFiles_DEFAULT}] - Maximum {@link CB_AudioFile} objects that are to be created internally. If it is set to null, there will not be a maximum (it will be unlimited). If an integer is provided, it must be the same number or greater than the value set in the {@link CB_AudioFileCache#minimumAudioFiles} property (also provided by the "minimumAudioFiles" of this object), allowing 1 minimum. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#maximumAudioFiles} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "maximumAudioFiles" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {integer} [minimumAudioFilesFree=parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.25 + 0.5)] - New {@link CB_AudioFile} objects will be created internally when the number of free {@link CB_AudioFile} objects reaches this limit. If provided, it must be an integer being 0 (zero) the minimum. It will end using a 25% of the {@link CB_AudioFileSpritesPool#minimumAudioFiles} by default, rounded to ceil, allowing 0 (zero) minimum. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#minimumAudioFilesFree} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "minimumAudioFilesFree" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {integer} [newAudioFilesWhenNeeded=Math.min(parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.1 + 0.5), 1)] - Number of new {@link CB_AudioFile} objects to create internally when the minimum limit of free {@link CB_AudioFile} objects ({@link CB_AudioFileSpritesPool#minimumAudioFilesFree}) is reached. If provided, it must be an integer being 0 (zero) the minimum. It will end using a 10% of the {@link CB_AudioFileSpritesPool#minimumAudioFiles} by default, rounded to ceil, allowing 1 minimum. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#newAudioFilesWhenNeeded} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "newAudioFilesWhenNeeded" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {integer} [retries={@link CB_AudioFileCache.retries_DEFAULT}] - Number of retries to try to load a {@link CB_AudioFile} object internally before trying to load the next possible one internally (if any). It must be an integer being 0 the minimum. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#retries} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "retries" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {boolean} [checkManually={@link CB_AudioFileCache.checkManually_DEFAULT}] - Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) by default. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#checkManually} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "checkManually" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {boolean} [checkManuallyOnNeededCreated={@link CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT}] - Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when creates a new {@link CB_AudioFile} object needed. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#checkManuallyOnNeededCreated} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "checkManuallyOnNeededCreated" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {boolean} [checkManuallyOnPlayingFailed={@link CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT}] - Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when playing one has failed and tries to reload it. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#checkManuallyOnPlayingFailed} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "checkManuallyOnPlayingFailed" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {boolean} [checkManuallyOnCheckingFailed={@link CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT}] - Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when checking one has failed and tries to reload it. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#checkManuallyOnCheckingFailed} property. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "checkManuallyOnCheckingFailed" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 *  @property {function} [onLoad] - Desired function to be called once the pool has been loaded. The first and unique parameter will be an integer with the {@link CB_AudioFile} objects that still need to be checked, if any, being "this" the current {@link CB_AudioFileSpritesPool} object. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#onLoad} property.
 *  @property {function} [onError] - Desired function to be called when any kind of error happens. The first and unique parameter will be a string with the error description (if it could be determined), being "this" the current {@link CB_AudioFileSpritesPool} object. If a valid value is given, this will be added to the {@link CB_AudioFileSpritesPool#onError} property. If a function is set, it will always be called through the {@link CB_AudioFileSpritesPool#errorFunction} method whenever the "onError" event of an internally-created {@link CB_AudioFileSprites} object is fired.
 *  @property {boolean} [disableAutoLoad=false] - If set to true, it will not create automatically the {@link CB_AudioFile} objects by calling the {@link CB_AudioFileCache#createAudioFiles} method internally. Internal usage only recommended. If the {@link CB_AudioFileSprites.DATA_OBJECT} object (defined in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object set in the "spritesGroups") of a certain sprites group does not contain the "disableAutoLoad" property, it will use the value of this property instead when creating its {@link CB_AudioFileSprites} object internally.
 */


/**
 *  The constructor is recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio.
 *  @class
 *  @classdesc Class to manage many audio sprites stored in different groups, each with one {@link CB_AudioFileSprites} object (used internally).
 *  @param {CB_AudioFileSpritesPool.DATA_OBJECT} [dataObject] - Object with the desired data and options for the groups of audio sprites. Each group will have a {@link CB_AudioFileSprites} object. Some of its properties ("preferredAPIs", "preferredFormats", "minimumAudioFiles", "maximumAudioFiles", "minimumAudioFilesFree", "newAudioFilesWhenNeeded", "retries", "checkManually", "checkManuallyOnNeededCreated", "checkManuallyOnPlayingFailed", "checkManuallyOnCheckingFailed" and "disableAutoLoad") will be used as the default value to create internally the {@link CB_AudioFileSprites} objects when the value is not given in the {@link CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} object (set as the value of the {@link CB_AudioFileSpritesPool.DATA_OBJECT#spritesGroups} property).
 *  @returns {CB_AudioFileSpritesPool} Returns a new {@link CB_AudioFileSpritesPool} object.
 *  @todo Do not allow to create one object with an "id" which has already been used (unless the value is undefined, null...).
 *  @todo Method getCopy and static method filterProperties (similar to the ones from {@link CB_GraphicSprites} and {@link CB_GraphicSpritesScene}).
 */
var CB_AudioFileSpritesPool = function(dataObject)
{
	//Creates an instance of this object and returns it in the case that it is being called from an unexpected context:
	if (this === window || !(this instanceof CB_AudioFileSpritesPool)) { return new CB_AudioFileSpritesPool(dataObject); }
	
	//Properties and variables:
	/**
     * Stores the identifier for the audio file sprites pool object.
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
	this.preferredAPIs = undefined;

	/**
     * Stores an array of strings with the preferred audio format or audio formats (they can include just the format as 'audio/ogg' or also the codec as for example 'audio/ogg; codecs="vorbis"'), in order of preference. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {array}
	 *  @default CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS
	 */
	this.preferredFormats = undefined;
	
	/**
     * Minimum {@link CB_AudioFile} objects to create internally for each {@link CB_AudioFileSprites} object. It must be an integer being 1 the minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default CB_AudioFileCache.minimumAudioFiles_DEFAULT
	 */
	this.minimumAudioFiles = undefined;

	/**
     * Maximum {@link CB_AudioFile} objects that are to be created internally for each {@link CB_AudioFileSprites} object. If it is set to null, there will not be a maximum (it will be unlimited). If an integer is provided, it must be the same number or greater than the value set in the {@link CB_AudioFileCache#minimumAudioFiles} property, allowing 1 minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer|null}
	 *  @default CB_AudioFileCache.maximumAudioFiles_DEFAULT
	 */
	this.maximumAudioFiles = undefined;
	
	/**
     * New {@link CB_AudioFile} objects will be created internally for each {@link CB_AudioFileSprites} object when the number of free {@link CB_AudioFile} objects reaches this limit. It must be an integer being 0 (zero) the minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.25 + 0.5)
	 */
	this.minimumAudioFilesFree = undefined;
	
	/**
     * Number of new {@link CB_AudioFile} objects to create internally for each {@link CB_AudioFileSprites} object when the minimum limit of free {@link CB_AudioFile} objects ({@link CB_AudioFileCache#minimumAudioFilesFree}) is reached. It must be an integer being 0 (zero) the minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default Math.min(parseInt({@link CB_AudioFileCache#minimumAudioFiles} * 0.1 + 0.5), 1)
	 */
	this.newAudioFilesWhenNeeded = undefined;

	/**
     * Number of retries to try to load a {@link CB_AudioFile} object internally before trying to load the next possible one internally (if any). It must be an integer being 0 the minimum. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {integer}
	 *  @default CB_AudioFileCache.retries_DEFAULT
	 */
	this.retries = undefined;


	/**
     * Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually). Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default CB_AudioFileCache.checkManually_DEFAULT
	 */
	this.checkManually = undefined;

	/**
     * Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when creates a new {@link CB_AudioFile} object needed. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default CB_AudioFileCache.checkManuallyOnNeededCreated_DEFAULT
	 */
	this.checkManuallyOnNeededCreated = undefined;

	/**
     * Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when playing one has failed and tries to reload it. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default CB_AudioFileCache.checkManuallyOnPlayingFailed_DEFAULT
	 */
	this.checkManuallyOnPlayingFailed = undefined;

	/**
     * Tells whether the {@link CB_AudioFile} objects must be checked automatically or not (manually) when checking one has failed and tries to reload it. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default CB_AudioFileCache.checkManuallyOnCheckingFailed_DEFAULT
	 */
	this.checkManuallyOnCheckingFailed = undefined;
	
	/**
     * If set to true, it will not create automatically the {@link CB_AudioFile} objects by calling the {@link CB_AudioFileCache#createAudioFiles} method internally. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {boolean}
	 *  @default false
	 */
	this.disableAutoLoad = undefined;

	/**
     * Desired function to be called once the pool has been loaded. The first and unique parameter will be an integer with the {@link CB_AudioFile} objects that still need to be checked, if any, being "this" the current {@link CB_AudioFileSpritesPool} object.
	 *	@var
	 *  @readonly
	 *  @type {function}
	 *  @default
	 */
	this.onLoad = undefined;

	/**
     * Desired function to be called when any kind of error happens. The first and unique parameter will be a string with the error description (if it could be determined), being "this" the current {@link CB_AudioFileSpritesPool} object. If a function is set, it will always be called through the {@link CB_AudioFileSpritesPool#errorFunction} method whenever the "onError" event of an internally-created {@link CB_AudioFileSprites} object is fired.
	 *	@var
	 *  @readonly
	 *  @type {function}
	 *  @default
	 */
	this.onError = undefined; //Function to call if not all AudioFiles can be loaded.

	/**
     * Stores the internally-created {@link CB_AudioFileSprites} objects, using the name of each property as their group ID and the value being the {@link CB_AudioFileSprites} object itself. Internal usage only recommended.
	 *	@var
	 *  @readonly
	 *  @type {Object}
	 *  @default
	 */
	this.audioFileSprites = {}; //Object with the CB_AudioFileSprites objects.


	//Internal properties:
	this._aborted = false;
	this._checkSpritesGroupsLoadedTimeout = null;	
	this._checkPlayingAllInterval;
	this._checkPlayingAllPerforming = false;
	this._setAudioAPIAllInterval;
	this._setAudioAPIAllPerforming = false;
	this._errorFunctionExecuted = false;

	
	//Calls the constructor of the object when creates an instance:
	return this._init(dataObject);
}


//Static properties and constants:
/**
 * Status value for audio file sprites pool which is unloaded. Can be used to compare the value returned by the {@link CB_AudioFileSpritesPool#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default 0
 */
CB_AudioFileSpritesPool.UNLOADED = 0; //Status value for unloaded cache.

/**
 * Status value for an audio file sprites pool which is loading. Can be used to compare the value returned by the {@link CB_AudioFileSpritesPool#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileSpritesPool.LOADING = 1; //Status value for loading cache.

/**
 * Status value for an audio file sprites pool which has not been checked yet. Can be used to compare the value returned by the {@link CB_AudioFileSpritesPool#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileSpritesPool.UNCHECKED = 2; //STatus value for an unchecked cache.

/**
 * Status value for an audio file sprites pool which is being checked currently. Can be used to compare the value returned by the {@link CB_AudioFileSpritesPool#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileSpritesPool.CHECKING = 3; //Status value for checking a cache.

/**
 * Status value for an audio file sprites pool which has been loaded. Can be used to compare the value returned by the {@link CB_AudioFileSpritesPool#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileSpritesPool.LOADED = 4; //Status value for loaded cache.

/**
 * Status value for an audio file sprites pool which failed to be loaded or failed for any other reason. Can be used to compare the value returned by the {@link CB_AudioFileSpritesPool#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileSpritesPool.FAILED = 5; //Status value for failed to load cache.

/**
 * Status value for an audio file sprites pool which has been aborted. This will happen when the audio file sprites pool has been destroyed with the {@link CB_AudioFileSpritesPool#destructor} method. Can be used to compare the value returned by the {@link CB_AudioFileSpritesPool#getStatus} method. Recommended for internal usage only.
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_AudioFileSpritesPool.ABORTED = 6; //Status value for aborted cache.


//Constructor:
CB_AudioFileSpritesPool.prototype._init = function(dataObject)
{
	/*
		FORMAT:
			dataObject =
			{	
				[id : String,]
				[onLoad : Function,]
				[onError : Function,]

				[preferredAPIs : Array<String>,]
				[preferredFormats : Array<String>,]
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

				spritesGroups :
				{
					"sprites_group_id" : CB_AudioFileSprites.DATA_OBJECT
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
 * Destroys the audio file sprites pool object (removing all sprites, etc.), including the internal audio file sprites objects, and frees memory. By default, unless the "preventAbortedStatus" is set to true, sets the current status of all the {@link CB_AudioFileCache} objects as ABORTED ({@link CB_AudioFileCache.ABORTED} value). Internally, calls the {@link CB_AudioFileSprites#destructor} method of all the internally-created {@link CB_AudioFileSprites} objects.
 *  @function
 *  @param {boolean} [stopSounds=false] - Used as the "stopSounds" parameter when calling internally the {@link CB_AudioFileSprites#destructor} method of all the internally-created {@link CB_AudioFileSprites} objects.
 *  @param {boolean} [preventAbortedStatus=false] - If set to true (not recommended), it will not assign the status of "ABORTED" (it will not set the {@link CB_AudioFileSpritesPool#_aborted} property to true}. Used as the "preventAbortedStatus" parameter when calling internally the {@link CB_AudioFileSprites#destructor} method of all the internally-created {@link CB_AudioFileSprites} objects.
 */
CB_AudioFileSpritesPool.prototype.destructor = function(stopSounds, preventAbortedStatus)
{
	clearInterval(this._checkPlayingAllInterval);
	clearInterval(this._setAudioAPIAllInterval);
	clearTimeout(this._checkSpritesGroupsLoadedTimeout);

	//Destroys the CB_AudioFileSprites objects:
	for (var audioFileSpritesObject in this.audioFileSprites)
	{
		this.audioFileSprites[audioFileSpritesObject].destructor(stopSounds, preventAbortedStatus);
	}
	
	//Resets properties to their default value:
	this.preferredAPIs = undefined;
	this.preferredFormats = undefined;
	this.minimumAudioFiles = undefined;
	this.maximumAudioFiles = undefined;
	this.minimumAudioFilesFree = undefined;
	this.newAudioFilesWhenNeeded = undefined;
	this.retries = undefined;
	this.checkManually = undefined;
	this.checkManuallyOnNeededCreated = undefined;
	this.checkManuallyOnPlayingFailed = undefined;
	this.checkManuallyOnCheckingFailed = undefined;
	this.disableAutoLoad = undefined;
	this.onLoad = undefined;
	this.onError = undefined;
	this.audioFileSprites = {};
	
	if (!preventAbortedStatus) { this._aborted = true; }
}


/**
 * Loads the audio file sprites pool with the desired data given. This method is called by the constructor automatically. Recommended to be called through a user-driven event (as onClick, onTouch, etc.), as some clients may need this at least the first time in order to be able to play the audio.
 *  @function
 *  @param {CB_AudioFileSpritesPool.DATA_OBJECT} dataObject - Object with the desired data and options for the audio file sprites.
 *  @returns {CB_AudioFileSpritesPool|null} If a "dataObject" is given, it returns the current {@link CB_AudioFileSpritesPool} object. Otherwise, it returns null.
 */
CB_AudioFileSpritesPool.prototype.load = function(dataObject)
{
	if (typeof(dataObject) === "undefined" || dataObject === null) { return null; }

	//Destroys all previous data (if any):
	this.destructor(true, true); //Also stops all sounds.
	this._aborted = false;
	
	//Sanitizes the given data:
	dataObject.id = CB_trim(dataObject.id);
	
	//Sets the new data:
	if (dataObject.id !== "") { this.id = dataObject.id; }
	if (typeof(dataObject.preferredAPIs) !== "undefined") { this.preferredAPIs = dataObject.preferredAPIs; }
	if (typeof(dataObject.preferredFormats) !== "undefined") { this.preferredFormats = dataObject.preferredFormats; }
	if (typeof(dataObject.minimumAudioFiles) !== "undefined") { this.minimumAudioFiles = dataObject.minimumAudioFiles; }
	if (typeof(dataObject.maximumAudioFiles) !== "undefined") { this.maximumAudioFiles = dataObject.maximumAudioFiles; }
	if (typeof(dataObject.minimumAudioFilesFree) !== "undefined") { this.minimumAudioFilesFree = dataObject.minimumAudioFilesFree; }
	if (typeof(dataObject.newAudioFilesWhenNeeded) !== "undefined") { this.newAudioFilesWhenNeeded = dataObject.newAudioFilesWhenNeeded; }
	if (typeof(dataObject.retries) !== "undefined") { this.retries = dataObject.retries; }
	if (typeof(dataObject.checkManually) !== "undefined") { this.checkManually = dataObject.checkManually; }
	if (typeof(dataObject.checkManuallyOnNeededCreated) !== "undefined") { this.checkManuallyOnNeededCreated = dataObject.checkManuallyOnNeededCreated; }
	if (typeof(dataObject.checkManuallyOnPlayingFailed) !== "undefined") { this.checkManuallyOnPlayingFailed = dataObject.checkManuallyOnPlayingFailed; }
	if (typeof(dataObject.checkManuallyOnCheckingFailed) !== "undefined") { this.checkManuallyOnCheckingFailed = dataObject.checkManuallyOnCheckingFailed; }
	if (typeof(dataObject.disableAutoLoad) !== "undefined") { this.disableAutoLoad = dataObject.disableAutoLoad; }
	
	if (typeof(dataObject.onLoad) !== "undefined") { this.onLoad = dataObject.onLoad; }
	if (typeof(dataObject.onError) !== "undefined") { this.onError = dataObject.onError; }
	
	//Inserts the CB_AudioFileSprites objects:
	if (typeof(dataObject.spritesGroups) !== "undefined" && dataObject.spritesGroups !== null)
	{
		this.removeSpritesGroups();
		this.insertSpritesGroups(dataObject.spritesGroups);
	}
	
	return this;
}


//Checks whether all CB_AudioFileSprites objects are loaded or not:
CB_AudioFileSpritesPool.prototype._checkSpritesGroupsLoaded = function()
{
	clearTimeout(this._checkSpritesGroupsLoadedTimeout);
	
	var allLoaded = true;
	var x;
	for (var audioFileSpritesObject in this.audioFileSprites)
	{
		x++;
		if (!this.audioFileSprites[audioFileSpritesObject].audioFileCache.checkManually && this.audioFileSprites[audioFileSpritesObject].getStatus() !== CB_AudioFileCache.LOADED)
		{
			allLoaded = false;
			break;
		}
		else if (this.audioFileSprites[audioFileSpritesObject].audioFileCache.checkManually && this.audioFileSprites[audioFileSpritesObject].getStatus() !== CB_AudioFileCache.UNCHECKED && this.audioFileSprites[audioFileSpritesObject].getStatus() !== CB_AudioFileCache.LOADED)
		{
			allLoaded = false;
			break;
		}
	}
	if (x === 0) { allLoaded = false; }
	
	var that = this;
	
	if (this.getStatus() === CB_AudioFileSpritesPool.LOADING || this.getStatus() === CB_AudioFileSpritesPool.UNCHECKED)
	{
		if (!allLoaded) { this._checkSpritesGroupsLoadedTimeout = setTimeout(function() { that._checkSpritesGroupsLoaded.call(that); }, 100); }
		else
		{
			if (typeof(this.onLoad) === "function")
			{
				var objectsNeedChecking = 0;
				var audioFiles;
				var audioFilesLength;
				var x;
				for (var audioFileSpritesObject in this.audioFileSprites)
				{
					audioFiles = this.audioFileSprites[audioFileSpritesObject].getAudioFiles(false);
					audioFilesLength = audioFiles.length;
					for (x = 0; x < audioFilesLength; x++) { if (audioFiles[x].getStatus() === CB_AudioFile.UNCHECKED) { objectsNeedChecking++; } }
				}
				this.onLoad.call(this, objectsNeedChecking);
			}
		}
	}
};


/**
 * Removes all the sprites groups ({@link CB_AudioFileSprites} objects) by clearing the {@link CB_AudioFileSpritesPool#audioFileSprites} property.
 *  @function
 */
CB_AudioFileSpritesPool.prototype.removeSpritesGroups = function()
{
	this.audioFileSprites = {};
}


/**
 * Inserts the given sprites groups.
 *  @function
 *  @param {CB_AudioFileSpritesPool.SPRITES_GROUPS_OBJECT} sprites - Object with the desired sprites groups.
 *  @returns {integer} Returns the number of sprites groups inserted.
 */
CB_AudioFileSpritesPool.prototype.insertSpritesGroups = function(spritesGroups)
{
	var inserted = 0;
	var that = this;
	if (typeof(spritesGroups) !== "undefined" && spritesGroups !== null)
	{
		clearTimeout(this._checkSpritesGroupsLoadedTimeout);
		
		for (var spritesGroupId in spritesGroups)
		{
			//Inserts the sprite:
			if (this.insertSpritesGroup(spritesGroupId, spritesGroups[spritesGroupId], true)) { inserted++; }
		}
		
		this._checkSpritesGroupsLoadedTimeout = setTimeout(function() { that._checkSpritesGroupsLoaded.call(that); }, 100);
	}
	return inserted;
}
	

/**
 * Inserts the given sprites group to the audio file sprites pool object.
 *  @function
 *  @param {string} spritesGroupId - The identifier for the sprites group.
 *  @param {CB_AudioFileSprites.DATA_OBJECT} [dataObject] - Object with the data of the sprites group. Optional but recommended.
 *  @param {boolean} [avoidCheckingLoaded=false] - If set to true, it will not check whether all sprites groups has been loaded after inserting the desired one. This is done internally by the {@link CB_AudioFileSpritesPool#_checkSpritesGroupsLoaded} method which will fire the {@link CB_AudioFileSpritesPool#onLoad} function (if any).
 *  @returns {boolean} Returns true if the sprites group has been inserted or false otherwise.
 */
CB_AudioFileSpritesPool.prototype.insertSpritesGroup = function(spritesGroupId, dataObject, avoidCheckingLoaded)
{
	if (typeof(spritesGroupId) === "undefined" || spritesGroupId === null) { return false; }

	if (typeof(dataObject) === "undefined" || dataObject === null) { dataObject = {}; }
	
	if (avoidCheckingLoaded)
	{
		clearTimeout(this._checkSpritesGroupsLoadedTimeout);
	}
	
	var dataObjectCopy = {};
	dataObjectCopy.id = spritesGroupId;
	dataObjectCopy.preferredAPIs = dataObject.preferredAPIs;
	dataObjectCopy.preferredFormats = dataObject.preferredFormats;
	dataObjectCopy.URIs = dataObject.URIs;
	dataObjectCopy.minimumAudioFiles = dataObject.minimumAudioFiles;
	dataObjectCopy.maximumAudioFiles = dataObject.maximumAudioFiles;
	dataObjectCopy.minimumAudioFilesFree = dataObject.minimumAudioFilesFree;
	dataObjectCopy.newAudioFilesWhenNeeded = dataObject.newAudioFilesWhenNeeded;
	dataObjectCopy.retries = dataObject.retries;
	dataObjectCopy.checkManually = dataObject.checkManually;
	dataObjectCopy.checkManuallyOnNeededCreated = dataObject.checkManuallyOnNeededCreated;
	dataObjectCopy.checkManuallyOnPlayingFailed = dataObject.checkManuallyOnPlayingFailed;
	dataObjectCopy.checkManuallyOnCheckingFailed = dataObject.checkManuallyOnCheckingFailed;
	dataObjectCopy.disableAutoLoad = dataObject.disableAutoLoad;
	dataObjectCopy.onLoad = dataObject.onLoad;
	dataObjectCopy.onError = dataObject.onError;
	dataObjectCopy.sprites = dataObject.sprites;
	
	if (typeof(dataObjectCopy.preferredAPIs) === "undefined" && typeof(this.preferredAPIs) !== "undefined") { dataObjectCopy.preferredAPIs = this.preferredAPIs; }
	if (typeof(dataObjectCopy.preferredFormats) === "undefined" && typeof(this.preferredFormats) !== "undefined") { dataObjectCopy.preferredFormats = this.preferredFormats; }
	if (typeof(dataObjectCopy.minimumAudioFiles) === "undefined" && typeof(this.minimumAudioFiles) !== "undefined") { dataObjectCopy.minimumAudioFiles = this.minimumAudioFiles; }
	if (typeof(dataObjectCopy.maximumAudioFiles) === "undefined" && typeof(this.maximumAudioFiles) !== "undefined") { dataObjectCopy.maximumAudioFiles = this.maximumAudioFiles; }
	if (typeof(dataObjectCopy.minimumAudioFilesFree) === "undefined" && typeof(this.minimumAudioFilesFree) !== "undefined") { dataObjectCopy.minimumAudioFilesFree = this.minimumAudioFilesFree; }
	if (typeof(dataObjectCopy.newAudioFilesWhenNeeded) === "undefined" && typeof(this.newAudioFilesWhenNeeded) !== "undefined") { dataObjectCopy.newAudioFilesWhenNeeded = this.newAudioFilesWhenNeeded; }
	if (typeof(dataObjectCopy.retries) === "undefined" && typeof(this.retries) !== "undefined") { dataObjectCopy.retries = this.retries; }
	if (typeof(dataObjectCopy.checkManually) === "undefined" && typeof(this.checkManually) !== "undefined") { dataObjectCopy.checkManually = this.checkManually; }
	if (typeof(dataObjectCopy.checkManuallyOnNeededCreated) === "undefined" && typeof(this.checkManuallyOnNeededCreated) !== "undefined") { dataObjectCopy.checkManuallyOnNeededCreated = this.checkManuallyOnNeededCreated; }
	if (typeof(dataObjectCopy.checkManuallyOnPlayingFailed) === "undefined" && typeof(this.checkManuallyOnPlayingFailed) !== "undefined") { dataObjectCopy.checkManuallyOnPlayingFailed = this.checkManuallyOnPlayingFailed; }
	if (typeof(dataObjectCopy.checkManuallyOnCheckingFailed) === "undefined" && typeof(this.checkManuallyOnCheckingFailed) !== "undefined") { dataObjectCopy.checkManuallyOnCheckingFailed = this.checkManuallyOnCheckingFailed; }
	if (typeof(dataObjectCopy.disableAutoLoad) === "undefined" && typeof(this.disableAutoLoad) !== "undefined") { dataObjectCopy.disableAutoLoad = this.disableAutoLoad; }
	
	//Wraps the error function:
	var that = this;
	var onErrorOld = dataObjectCopy.onError;
	dataObjectCopy.onError =
		function(error)
		{
			if (typeof(onErrorOld) === "function") { onErrorOld.call(this, error); }
			setTimeout(function() { that.errorFunction.call(that, error); }, 100);
		};
	
	this._errorFunctionExecuted = false; //Allows the execution of the error function again.
	
	this.audioFileSprites[spritesGroupId] = new CB_AudioFileSprites(dataObjectCopy);

	if (!avoidCheckingLoaded)
	{
		this._checkSpritesGroupsLoadedTimeout = setTimeout(function() { that._checkSpritesGroupsLoaded.call(that); }, 100);
	}
	
	return true;
}


/**
 * Removes a sprites group by its ID.
 *  @function
 *  @param {string} spritesGroupId - The identifier for the sprites group.
 *  @param {boolean} [destroy=false] - If set to true, it will call the {@link CB_AudioFileSprites#destructor} method of the {@link CB_AudioFileSprites} object which belongs to the desired sprites group.
 *  @param {boolean} [stopSounds=false] - If the "destroy" parameter is set to false, this parameter will be ignored. Used as the "stopSound" parameter when calling internally the {@link CB_AudioFileSprites#destructor} method of the {@link CB_AudioFileSprites} object which belongs to the desired sprites group.
 *  @param {boolean} [preventAbortedStatus=false] - If the "destroy" parameter is set to false, this parameter will be ignored. Used as the "preventAbortedStatus" parameter when calling internally the {@link CB_AudioFileSprites#destructor} method of the {@link CB_AudioFileSprites} object which belongs to the desired sprites group.
 *  @returns {boolean} Returns true if the sprites group has been deleted or false otherwise.
 */
CB_AudioFileSpritesPool.prototype.removeSpritesGroup = function(spritesGroupId, destroy, stopSounds, preventAbortedStatus)
{
	if (typeof(this.audioFileSprites[spritesGroupId]) !== "undefined" && this.audioFileSprites[spritesGroupId] !== null)
	{
		if (destroy)
		{
			this.audioFileSprites[spritesGroupId].destructor(stopSounds, preventAbortedStatus);
		}
		this.audioFileSprites[spritesGroupId] = null;
		
		var audioFileSprites = {};
		for (spritesGroupId in this.audioFileSprites)
		{
			if (typeof(this.audioFileSprites[spritesGroupId]) !== "undefined" && this.audioFileSprites[spritesGroupId] !== null)
			{
				audioFileSprites[spritesGroupId] = this.audioFileSprites[spritesGroupId];
			}
		}
		this.audioFileSprites = audioFileSprites;
		return true;
	}
	return false;
}


/**
 * Returns a sprites group (the {@link CB_AudioFileSprites} object) by its ID.
 *  @function
 *  @param {string} spritesGroupId - The identifier for the sprites group.
 *  @param {boolean} [withoutChecking=false] - If set to true and the sprites group cannot be found, the method will return undefined (or whatever is stored by the given ID) instead of null.
 *  @returns {CB_AudioFileSprites|undefined|*|null} Returns null if the "withoutChecking" parameter is set to true and the sprites group cannot be found. Otherwise, it will return what is stored internally by the given ID which can be a {@link CB_AudioFileSprites} object if found or undefined (or whatever is stored by the given ID) if not found.
 */
CB_AudioFileSpritesPool.prototype.getSpritesGroup = function(spritesGroupId, withoutChecking)
{
	//return this.audioFileSprites[spritesGroupId];
	if (typeof(this.audioFileSprites[spritesGroupId]) !== "undefined" || withoutChecking)
	{
		return this.audioFileSprites[spritesGroupId];
	}
	return null;
}


/**
 * Returns an object with the sprites groups (all the internally-created {@link CB_AudioFileSprites} objects), being the name of each property their group ID and the value being the {@link CB_AudioFileSprites} object itself. Internally, it just returns the {@link CB_AudioFileSpritesPool#audioFileSprites} property.
 *  @function
 *  @returns {Object} Returns an object with the sprites groups (all the internally-created {@link CB_AudioFileSprites} objects), being the name of each property their group ID and the value being the {@link CB_AudioFileSprites} object itself. Internally, it just returns the {@link CB_AudioFileSpritesPool#audioFileSprites} property.
 */
CB_AudioFileSpritesPool.prototype.getSpritesGroups = function()
{
	return this.audioFileSprites;
}


/**
 * Returns an object with the sprites (and includes "_WITHOUT_SPRITE_ASSOCIATED" if we want to). Internally, uses the {@link CB_AudioFileSprites#getSprites} method.
 *  @function
 *  @param {boolean} [includeWithoutSpriteAssociated=false] - If set to true, the returning object will also contain a property called "_WITHOUT_SPRITE_ASSOCIATED" whose value will be an empty object (unless the "orderBySpritesGroup" parameter is set to true and the property existed before in the object stored in the {@link CB_AudioFileSprites#sprites} property and had a value which is not an empty object). If set to false and the "orderBySpritesGroup" parameter is also set to false, the returning object will not contain the "_WITHOUT_SPRITE_ASSOCIATED" property. If set to false and the "orderBySpritesGroup" parameter is set to true, the returning object will not contain the "_WITHOUT_SPRITE_ASSOCIATED" property unless the property existed before in the object stored in the {@link CB_AudioFileSprites#sprites} property.
 *  @param {boolean} [orderBySpritesGroup=false] - If set to false, it will return a {@link CB_AudioFileSprites.SPRITES_OBJECT} object whose properties will be the ID of each sprite (each sprite ID should be unique) and their value will be a {@link CB_AudioFileSprites.SPRITE_OBJECT} object. If set to true, it will return an object whose properties will be the ID of each sprites group and the value will be a {@link CB_AudioFileSprites.SPRITES_OBJECT} object which will include its sprites.
 *  @returns {CB_AudioFileSprites.SPRITES_OBJECT|Object} If the "orderBySpritesGroup" is set to false, it will return a {@link CB_AudioFileSprites.SPRITES_OBJECT} object whose properties will be the ID of each sprite (each sprite ID should be unique) and their value will be a {@link CB_AudioFileSprites.SPRITE_OBJECT} object. If the "orderBySpritesGroup" is set to true, it will return an object whose properties will be the ID of each sprites group and the value will be a {@link CB_AudioFileSprites.SPRITES_OBJECT} object which will include its sprites.
 */
CB_AudioFileSpritesPool.prototype.getSprites = function(includeWithoutSpriteAssociated, orderBySpritesGroup)
{
	var sprites = {};
	
	if (!orderBySpritesGroup)
	{
		if (includeWithoutSpriteAssociated) { sprites["_WITHOUT_SPRITE_ASSOCIATED"] = {}; }
		var spritesLoop;
		var spriteId;
		for (var spritesGroupId in this.audioFileSprites)
		{
			spritesLoop = this.audioFileSprites[spritesGroupId].getSprites(false);
			for (spriteId in spritesLoop)
			{
				sprites[spriteId] = spritesLoop[spriteId];
			}
		}
	}
	else
	{
		for (var spritesGroupId in this.audioFileSprites)
		{
			sprites[spritesGroupId] = this.audioFileSprites[spritesGroupId].getSprites(includeWithoutSpriteAssociated);
		}
	}
	
	return sprites;
}


/**
 * Returns the sound instances (their ID) used (stored in the {@link CB_AudioFileSprites#spriteSoundInstances} property of each {@link CB_AudioFileSprites} object).
 *  @function
 *  @param {boolean} [oneDimension=false] - If set to false, it will return an object whose property names will be the ID of each sprites group and their value will be the {@link CB_AudioFileSprites#spriteSoundInstances} property of each {@link CB_AudioFileSprites} object (which includes the "_WITHOUT_SPRITE_ASSOCIATED" property for sound instances without a sprite associated) which belongs to that sprites group. Otherwise, if it is set to true, it will return a numeric array whose values are the sound instance IDs.
 *  @param {boolean} [includeWithoutSpriteAssociated=false] - If set to true, it will also return the sound instance identifiers which are not associated to any sprite. Used as the "includeWithoutSpriteAssociated" parameter when calling the {@link CB_AudioFileSprites#getSoundInstancesId} method internally. Only used when the "oneDimension" parameter is set to true.
 *  @returns {Object|array} Returns the sound instances (their ID) used (stored in the {@link CB_AudioFileSprites#spriteSoundInstances} property). If the "oneDimension" parameter is set to false, it will return an object whose property names will be the ID of each sprites group and their value will be the {@link CB_AudioFileSprites#spriteSoundInstances} property of each {@link CB_AudioFileSprites} object (which includes the "_WITHOUT_SPRITE_ASSOCIATED" property for sound instances without a sprite associated) which belongs to that sprites group. If the "oneDimension" parameter is set to true, it will return a numeric array whose values are the sound instance identifiers (if the "includeWithoutSpriteAssociated" parameter it set to true, it will also include the sound instances which are not associated to any sprite).
 */
CB_AudioFileSpritesPool.prototype.getSoundInstancesId = function(oneDimension, includeWithoutSpriteAssociated)
{
	var soundInstances;
	if (!oneDimension)
	{
		soundInstances = {};
		for (var spritesGroupId in this.audioFileSprites)
		{
			soundInstances[spritesGroupId] = this.audioFileSprites[spritesGroupId].getSoundInstancesId(false, includeWithoutSpriteAssociated);
		}
	}
	else
	{
		soundInstances = [];
		var soundInstancesSpritesGroup;
		var soundInstancesSpritesGroupLength;
		var y = 0;
		var x = 0;
		for (var spritesGroupId in this.audioFileSprites)
		{
			soundInstancesSpritesGroup = this.audioFileSprites[spritesGroupId].getSoundInstancesId(true, includeWithoutSpriteAssociated);
			soundInstancesSpritesGroupLength = soundInstancesSpritesGroup.length;
			for (x = 0; x < soundInstancesSpritesGroupLength; x++)
			{
				soundInstances[y++] = soundInstancesSpritesGroup[x];
			}
		}
	}
	return soundInstances;
}


/**
 * Object returned by the {@link CB_AudioFileSpritesPool#getAudioFilesUsed} method. Each property names will be the the ID of each sprites group and their value will be a {@link CB_AudioFileSprites.getAudioFilesUsed_OBJECT} object.
 *  @memberof CB_AudioFileSpritesPool
 *  @typedef {Object} CB_AudioFileSpritesPool.getAudioFilesUsed_OBJECT
 *  @property {CB_AudioFileSpritesPool.getAudioFilesUsed_OBJECT} spriteId - Each property names will be the the ID of each sprites group and their value will be a {@link CB_AudioFileSprites.getAudioFilesUsed_OBJECT} object.
 */

/**
 * Returns the {@link CB_AudioFile} objects used by all the sounds instances of all the sprites groups.
 *  @function
 *  @param {boolean} [oneDimension=false] - If set to false, it will return an object whose property names will be the ID of each sprites group and their value will be the an object whose property names are the sprite identifiers (including the "_WITHOUT_SPRITE_ASSOCIATED" property for sound instances without a sprite associated, if the "includeWithoutSpriteAssociated" is set to true) and their value will be a numeric array with the {@link CB_AudioFile} objects used. Otherwise, if set to true, it will return a numeric array with the {@link CB_AudioFile} objects used (if the "includeWithoutSpriteAssociated" parameter is set to true, it will also contain the {@link CB_AudioFile} objects whose sound instance ID is not associated to any sprite).
 *  @param {boolean} [includeWithoutSpriteAssociated=false] - If set to true, it will also return the {@link CB_AudioFile} objects whose sound instance ID is not associated to any sprite. Used as the "includeWithoutSpriteAssociated" parameter when calling the {@link CB_AudioFileSprites#getAudioFilesUsed} method internally.
 *  @param {boolean} [avoidCancelled=false] - If set to true, it will not return the {@link CB_AudioFile} objects whose sound instance has been cancelled. Used as the "avoidCancelled" parameter when calling the {@link CB_AudioFileSprites#getAudioFilesUsed} method internally.
 *  @returns {CB_AudioFileSprites.getAudioFilesUsed_OBJECT|array} Returns the {@link CB_AudioFile} objects used by all the sounds instances of all the sprites groups. If the "oneDimension" parameter is set to false, it will return a {@link CB_AudioFileSpritesPool.getAudioFilesUsed_OBJECT} object whose property names will be the ID of each sprites group and their value will be a {@link CB_AudioFileSprites.getAudioFilesUsed_OBJECT} object whose property names are the sprite identifiers (including the "_WITHOUT_SPRITE_ASSOCIATED" property for sound instances without a sprite associated, if the "includeWithoutSpriteAssociated" is set to true) and their value will be a numeric array with the {@link CB_AudioFile} objects used. Otherwise, if the "oneDimension" parameter set to true, it will return a numeric array with the {@link CB_AudioFile} objects used (if the "includeWithoutSpriteAssociated" parameter is set to true, it will also contain the {@link CB_AudioFile} objects whose sound instance ID is not associated to any sprite).
 */
CB_AudioFileSpritesPool.prototype.getAudioFilesUsed = function(oneDimension, includeWithoutSpriteAssociated, avoidCancelled)
{
	var audioFiles;
	if (!oneDimension)
	{
		audioFiles = {};
		for (var spritesGroupId in this.audioFileSprites)
		{
			audioFiles[spritesGroupId] = this.audioFileSprites[spritesGroupId].getAudioFilesUsed(false, includeWithoutSpriteAssociated, avoidCancelled);
		}
	}
	else
	{
		audioFiles = [];
		var audioFilesSpritesGroup;
		var audioFilesSpritesGroupLength;
		var y = 0;
		var x = 0;
		for (var spritesGroupId in this.audioFileSprites)
		{
			audioFilesSpritesGroup = this.audioFileSprites[spritesGroupId].getAudioFilesUsed(true, includeWithoutSpriteAssociated, avoidCancelled);
			audioFilesSpritesGroupLength = audioFilesSpritesGroup.length;
			for (x = 0; x < audioFilesSpritesGroupLength; x++)
			{
				audioFiles[y++] = audioFilesSpritesGroup[x];
			}
		}
	}
	return audioFiles;
}


/**
 * Callback that is used when finishes all iterations after looping through the items. Being "this" an array with all the items.
 *  @memberof CB_AudioFileSpritesPool
 *  @callback CB_AudioFileSpritesPool.executeFunctionAll_ON_FINISH_CALLBACK
 *  @param {array} array - An array with all the items which were being looped.
 *  @param {integer} itemsAffected - The number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null).
 *  @param {integer} delayMaximum - The maximum "delay" used.
 */
 
/**
 * Alias for {@link CB_AudioFileSpritesPool#executeFunctionAllSprites}.
 *  @function CB_AudioFileSpritesPool#executeAllSprites
 *  @see {@link CB_AudioFileSpritesPool#executeFunctionAllSprites}
 */	
 /**
 * Alias for {@link CB_AudioFileSpritesPool#executeFunctionAllSprites}.
 *  @function CB_AudioFileSpritesPool#forEachSprite
 *  @see {@link CB_AudioFileSpritesPool#executeFunctionAllSprites}
 */
/**
 * Executes a desired function for all the {@link CB_AudioFile} objects used by all the sound instances currently created of each sprite group. It calls the {@link CB_AudioFileSprites#executeFunctionAllSprites} method internally.
 *  @function
 *  @param {CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Used as the "functionEach" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAllSprites} method internally.
 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - Used as the "delayBetweenEach" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAllSprites} method internally. Note that each call to the {@link CB_AudioFileSprites#executeFunctionAllSprites} method will be performed sequentially one after the other, without adding a delay.
 *  @param {boolean} [includeWithoutSpriteAssociated=false] - Used as the "includeWithoutSpriteAssociated" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAllSprites} method internally.
 *  @param {boolean} [avoidCancelled=false] - Used as the "avoidCancelled" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAllSprites} method internally.
 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - Used as the "delayBetweenEachAffectsFirst" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAllSprites} method internally. Internal usage only recommended. Note that each call to the {@link CB_AudioFileSprites#executeFunctionAllSprites} method will be performed sequentially one after the other, without adding a delay.
 *  @param {CB_AudioFileSpritesPool.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array containing all the items which were looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
 *  @returns {integer} It will return the number of calls to the "functionEach" function that were performed (which should be the same number as the {@link CB_AudioFile} objects used by the sound instances that belong to the sprites of each sprites group). Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
 *  @todo Think about implementing a "returnSetTimeoutsArray" or similar (as in {@link CB_AudioFileSprites#executeFunctionAllSprites}).
 *  @todo Think about consider executing only one by one (now it will loop {@link CB_AudioFile} objects from different sprites groups simultaneously).
 */
CB_AudioFileSpritesPool.prototype.executeFunctionAllSprites = CB_AudioFileSpritesPool.prototype.executeAllSprites = CB_AudioFileSpritesPool.prototype.forEachSprite = function(functionEach, delayBetweenEach, includeWithoutSpriteAssociated, avoidCancelled, delayBetweenEachAffectsFirst, functionFinish)
{
	var spritesGroups = 0;
	for (var spritesGroupId in this.audioFileSprites) { spritesGroups++; } //Counts the number of sprites groups.
	var functionFinishLoopTimes = 0;
	var functionFinishLoop = function(array, itemsAffected, delay)
	{
		functionFinishLoopTimes++;
		for (var x = 0; x < itemsAffected.length; x++) { arrayAllItems[arrayAllItems.length] = itemsAffected[x]; }
		//If it is the last time, calls the finish function:
		if (spritesGroups === functionFinishLoopTimes && typeof(functionFinish) === "function") { functionFinish.call(arrayAllItems, arrayAllItems, performed, delay); }
	};
	var arrayAllItems = [];
	var performed = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		performed += this.audioFileSprites[spritesGroupId].executeFunctionAllSprites(functionEach, delayBetweenEach, includeWithoutSpriteAssociated, avoidCancelled, false, delayBetweenEachAffectsFirst, functionFinishLoop); //The desired delay (if any) will only start affecting after the first call.
	}
	return performed;
}


/**
 * Cleans the arrays of the {@link CB_AudioFile} objects (taking off the undefined or null ones) which is in the {@link CB_AudioFileCache#audioFiles} property used by each {@link CB_AudioFileSprites} object, just keeping the valid ones and clearing (destroying and removing) the others. For performance purposes. Uses the {@link CB_AudioFileSprites#clearAudioFiles} method internally. Internal usage only recommended.
 *  @function
 *  @param {boolean} [avoidCallingCheckCacheLoaded=false] - Used as the "avoidCallingCheckCacheLoaded" parameter when calling the {@link CB_AudioFileSprites#clearAudioFiles} method internally.
 *  @returns {array} Returns an object whose each property name is the sprites group ID and each value is the returning value of calling internally the {@link CB_AudioFileSprites#clearAudioFiles} method.
 */
CB_AudioFileSpritesPool.prototype.clearAudioFiles = function(avoidCallingCheckCacheLoaded)
{
	var audioFiles = {};
	for (var spritesGroupId in this.audioFileSprites)
	{
		audioFiles[spritesGroupId] = this.audioFileSprites[spritesGroupId].clearAudioFiles(avoidCallingCheckCacheLoaded);
	}
	return audioFiles;
}


/**
 * Tries to purge the audio file cache of each {@link CB_AudioFileSprites} object until it reaches a desired number of {@link CB_AudioFile} objects internally (set in the {@link CB_AudioFileCache#audioFiles} property), by removing and destroying some of the current {@link CB_AudioFile} objects. Note that the desired number is for each {@link CB_AudioFileSprites} object and not a global number. For performance purposes. Uses the {@link CB_AudioFileSprites#purge} method internally.
 *  @function
 *  @param {integer} desiredNumber - Used as the "desiredNumber" parameter when calling the {@link CB_AudioFileSprites#purge} method internally. Note that the desired number is for each {@link CB_AudioFileSprites} object and not a global number.
 *  @param {boolean} [setAsMinimumAudioFiles=false] - Used as the "setAsMinimumAudioFiles" parameter when calling the {@link CB_AudioFileSprites#purge} method internally.
 *  @param {boolean} [includePlaying=false] - Used as the "includePlaying" parameter when calling the {@link CB_AudioFileSprites#purge} method internally.
 *  @param {boolean} [stopSounds=false] - Used as the "stopSounds" parameter when calling the {@link CB_AudioFileSprites#purge} method internally.
 *  @param {array} [statuses=Array({@link CB_AudioFile.LOADING}, {@link CB_AudioFile.UNCHECKED}, {@link CB_AudioFile.CHECKING}, {@link CB_AudioFile.LOADED})] - Used as the "statuses" parameter when calling the {@link CB_AudioFileSprites#purge} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects removed.
 */
CB_AudioFileSpritesPool.prototype.purge = function(desiredNumber, setAsMinimumAudioFiles, includePlaying, stopSounds, statuses)
{
	var objectsRemoved = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		objectsRemoved += this.audioFileSprites[spritesGroupId].purge(desiredNumber, setAsMinimumAudioFiles, includePlaying, stopSounds, statuses);
	}
	return objectsRemoved;
}


/**
 * Tells whether a desired {@link CB_AudioFile} object is free (it is in the {@link CB_AudioFileCache#audioFilesFree} property of any {@link CB_AudioFileSprites} object) or not, by its identifier. A free {@link CB_AudioFile} object is an object which is not being used and it is available to be used. Uses the {@link CB_AudioFileSprites#isAudioFileFree} method internally.
 *  @function
 *  @param {string} id - Used as the "id" parameter when calling the {@link CB_AudioFileSprites#isAudioFileFree} method internally.
 *  @returns {boolean} Returns whether a desired {@link CB_AudioFile} object is free (it is in the {@link CB_AudioFileCache#audioFilesFree} property of any {@link CB_AudioFileSprites} object) or not, by its identifier. A free {@link CB_AudioFile} object is an object which is not being used and it is available to be used.
 */
CB_AudioFileSpritesPool.prototype.isAudioFileFree = function(id)
{
	for (var spritesGroupId in this.audioFileSprites)
	{
		if (this.audioFileSprites[spritesGroupId].isAudioFileFree(id)) { return true; }
	}
	return false;
}


/**
 * Clears the sound instances (created by the {@link CB_AudioFileCache#play} method) which have been cancelled. Uses the {@link CB_AudioFileSprites#clearSoundInstances} method internally.
 *  @function
 *  @param {boolean} [clearWithObjectAssociated=false] - Used as the "clearWithObjectAssociated" parameter when calling the {@link CB_AudioFileSprites#clearSoundInstances} method internally.
 *  @returns {integer} Returns the number of cleared sound instances.
 */
CB_AudioFileSpritesPool.prototype.clearSoundInstances = function(clearWithObjectAssociated)
{
	var cleared = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		cleared += this.audioFileSprites[spritesGroupId].clearSoundInstances(clearWithObjectAssociated);
	}
	return cleared;
}


/**
 * Cancels (to prevent they start playing) or enables all sound instances (created by the {@link CB_AudioFileCache#play} method). Uses the {@link CB_AudioFileSprites#cancelSoundInstances} method internally.
 *  @function
 *  @param {boolean} [cancel=false] - Used as the "cancel" parameter when calling the {@link CB_AudioFileSprites#cancelSoundInstances} method internally.
 *  @param {boolean} [affectWithObjectAssociated=false] - Used as the "affectWithObjectAssociated" parameter when calling the {@link CB_AudioFileSprites#cancelSoundInstances} method internally.
 *  @returns {integer} Returns the number of sound instances modified.
 */
CB_AudioFileSpritesPool.prototype.cancelSoundInstances = function(cancel, affectWithObjectAssociated)
{
	var performed = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		performed += this.audioFileSprites[spritesGroupId].cancelSoundInstances(cancel, affectWithObjectAssociated);
	}
	return performed;
}


/**
 * Cancels (to prevent it starts playing) or enables a sound instance (created by the {@link CB_AudioFileCache#play} method), by its identifier. Uses the {@link CB_AudioFileSprites#cancelSoundInstance} method internally.
 *  @function
 *  @param {integer} soundInstanceId - Used as the "soundInstanceId" parameter when calling the {@link CB_AudioFileSprites#cancelSoundInstance} method internally.
 *  @param {boolean} [cancel=false] - Used as the "cancel" parameter when calling the {@link CB_AudioFileSprites#cancelSoundInstance} method internally.
 *  @param {boolean} [affectWithObjectAssociated=false] - Used as the "affectWithObjectAssociated" parameter when calling the {@link CB_AudioFileSprites#cancelSoundInstance} method internally.
 *  @returns {boolean} Returns true if the sound instance has been modified or false otherwise.
 */
CB_AudioFileSpritesPool.prototype.cancelSoundInstance = function(soundInstanceId, cancel, affectWithObjectAssociated)
{
	for (var spritesGroupId in this.audioFileSprites)
	{
		if (this.audioFileSprites[spritesGroupId].cancelSoundInstance(soundInstanceId, cancel, affectWithObjectAssociated)) { return true; }
	}
	return false;
}


/**
 * Gets the {@link CB_AudioFile} object associated to a given sound instance ID (created by the {@link CB_AudioFileCache#play} method), if any, or null otherwise. Uses the {@link CB_AudioFileSprites#getAudioFileBySoundInstanceId} method internally.
 *  @function
 *  @param {integer} soundInstanceId - Used as the "soundInstanceId" parameter when calling the {@link CB_AudioFileSprites#getAudioFileBySoundInstanceId} method internally.
 *  @param {boolean} [avoidCancelled=false] - Used as the "avoidCancelled" parameter when calling the {@link CB_AudioFileSprites#getAudioFileBySoundInstanceId} method internally.
 *  @returns {CB_AudioFile|null} Returns the {@link CB_AudioFile} object associated to a given sound instance ID, if any, or null otherwise.
 */
CB_AudioFileSpritesPool.prototype.getAudioFileBySoundInstanceId = function(soundInstanceId, avoidCancelled)
{
	var audioFile;
	for (var spritesGroupId in this.audioFileSprites)
	{
		audioFile = this.audioFileSprites[spritesGroupId].getAudioFileBySoundInstanceId(soundInstanceId, avoidCancelled);
		if (typeof(audioFile) !== "undefined" && audioFile !== null) { return audioFile; }
	}
	return null;
}


/**
 * Alias for {@link CB_AudioFileSpritesPool#executeFunctionAll}.
 *  @function CB_AudioFileSpritesPool#executeAll
 *  @see {@link CB_AudioFileSpritesPool#executeFunctionAll}
 */	
 /**
 * Alias for {@link CB_AudioFileSpritesPool#executeFunctionAll}.
 *  @function CB_AudioFileSpritesPool#forEach
 *  @see {@link CB_AudioFileSpritesPool#executeFunctionAll}
 */	
/**
 * Performs a desired action, using the provided function, on all the existing {@link CB_AudioFile} objects or on the desired ones (if provided). Uses the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @function
 *  @param {CB_Arrays.CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} functionEach - Used as the "functionEach" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {number|CB_Arrays.executeFunctionAll_ON_LOOP_CALLBACK} [delayBetweenEach=0] - Used as the "delayBetweenEach" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally. Note that each call to the {@link CB_AudioFileSprites#executeFunctionAll} method will be performed sequentially one after the other, without adding a delay.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally.
 *  @param {boolean} [returnArrayOfSetTimeoutsArray=false] - If it is set to false, it will return the number of calls to the "functionEach" function that were performed. Otherwise, if it is set to true, it will return a numeric array and each value (which will belong to each sprites group) will be another numeric array with a {@link CB_AudioFileCache.executeFunctionAll_OBJECT} object for each {@link CB_AudioFile} of that sprites group.
 *  @param {boolean} [delayBetweenEachAffectsFirst=false] - Used as the "delayBetweenEachAffectsFirst" parameter when calling the {@link CB_AudioFileSprites#executeFunctionAll} method internally. Note that each call to the {@link CB_AudioFileSprites#executeFunctionAll} method will be performed sequentially one after the other, without adding a delay.
 *  @param {CB_AudioFileSpritesPool.executeFunctionAll_ON_FINISH_CALLBACK} [functionFinish] - Function that will be called for when it has finished looping all the items. The first parameter will be the array containing all the items which were looped, the second parameter will be the number of times that the "functionEach" callback was called (the most likely, matches the number of elements unless they are undefined or null), and the third parameter will be the maximum "delay" used, being "this" the array itself.
 *  @returns {integer|array} If the "returnArrayOfSetTimeoutsArray" parameter is set to false, it will return the number of calls to the "functionEach" function that were performed. Otherwise, if the "returnArrayOfSetTimeoutsArray" is set to true, it will return a numeric array and each value will be another numeric array with a {@link CB_AudioFileCache.executeFunctionAll_OBJECT} object for each {@link CB_AudioFile} given. Note that if a value greater than 0 (zero) for the "delayBetweenEach" parameter has been provided, perhaps not all calls of the "functionEach" function will have been performed yet when exiting this method because of the asynchronous nature of the [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} function.
 *  @todo Think about consider executing only one by one (now it will loop {@link CB_AudioFile} objects from different sprites groups simultaneously).
 */
CB_AudioFileSpritesPool.prototype.executeFunctionAll = CB_AudioFileSpritesPool.prototype.executeAll = CB_AudioFileSpritesPool.prototype.forEach = function(functionEach, delayBetweenEach, audioFiles, returnArrayOfSetTimeoutsArray, delayBetweenEachAffectsFirst, functionFinish)
{
	var spritesGroups = 0;
	for (var spritesGroupId in this.audioFileSprites) { spritesGroups++; } //Counts the number of sprites groups.
	var functionFinishLoopTimes = 0;
	var functionFinishLoop = function(array, itemsAffected, delay)
	{
		functionFinishLoopTimes++;
		for (var x = 0; x < itemsAffected.length; x++) { arrayAllItems[arrayAllItems.length] = itemsAffected[x]; }
		//If it is the last time, calls the finish function:
		if (spritesGroups === functionFinishLoopTimes && typeof(functionFinish) === "function") { functionFinish.call(arrayAllItems, arrayAllItems, performed, delay); }
	};
	var arrayAllItems = [];
	
	if (returnArrayOfSetTimeoutsArray)
	{
		var arrayOfSetTimeoutsObjects = [];
		for (var spritesGroupId in this.audioFileSprites)
		{
			arrayOfSetTimeoutsObjects[arrayOfSetTimeoutsObjects.length] = this.audioFileSprites[spritesGroupId].executeFunctionAll(functionEach, delayBetweenEach, audioFiles, true, delayBetweenEachAffectsFirst, functionFinishLoop); //The desired delay (if any) will only start affecting after the first call.
		}
		return arrayOfSetTimeoutsObjects;
	}
	else
	{
		var performed = 0;
		for (var spritesGroupId in this.audioFileSprites)
		{
			performed += this.audioFileSprites[spritesGroupId].executeFunctionAll(functionEach, delayBetweenEach, audioFiles, false, delayBetweenEachAffectsFirst, functionFinishLoop); //The desired delay (if any) will only start affecting after the first call.
		}
		return performed;
	}
}


/**
 * Destroys all the {@link CB_AudioFile} objects and frees memory, by calling {@link CB_AudioFile#destructor}(stopSounds, false, true). Uses the {@link CB_AudioFileSprites#destroyAll} method internally.
 *  @function
 *  @param {boolean} [stopSounds=false] - Used as the "stopSounds" parameter when calling the {@link CB_AudioFileSprites#destroyAll} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose {@link CB_AudioFile#destructor} has been called.
 */
CB_AudioFileSpritesPool.prototype.destroyAll = function(stopSounds)
{
	var destroyed = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		destroyed += this.audioFileSprites[spritesGroupId].destroyAll(stopSounds);
	}
	return destroyed;
}


/**
 * Callback function used by the {@link CB_AudioFileSpritesPool#checkPlayingAll} method that will be called when all the process was performed successfully.
 *  @memberof CB_AudioFileSpritesPool
 *  @callback CB_AudioFileSpritesPool.checkPlayingAll_CALLBACK_OK
 *  @param {integer} performedActions - The number of {@link CB_AudioFile} objects that can be played.
 *  @param {integer} uncheckedObjects - The number of {@link CB_AudioFile} objects that needed to be checked before calling this method.
 */

 /**
 * Callback function used by the {@link CB_AudioFileSpritesPool#checkPlayingAll} method that will be called when not all was performed successfully.
 *  @memberof CB_AudioFileSpritesPool
 *  @callback CB_AudioFileSpritesPool.checkPlayingAll_CALLBACK_ERROR
 *  @param {Object} errorsObject - Object whose property names are the ID of each sprites group or "GENERAL_ERROR" if the error is not related to any sprites group and their value will be a {@link CB_AudioFileSpritesPool.checkPlayingAll_CALLBACK_ERROR_OBJECT} object.
 *  @param {integer} performedActions - The number of {@link CB_AudioFile} objects that can be played).
 *  @param {integer|undefined} uncheckedObjects - The number of {@link CB_AudioFile} objects that needed to be checked before calling this method (it will be undefined if it could not be determined).
 */

/**
 * An object with errors, used by the {@link CB_AudioFileSpritesPool.checkPlayingAll_CALLBACK_ERROR} callback (used by the {@link CB_AudioFileSpritesPool#checkPlayingAll} method).
 *  @memberof CB_AudioFileSpritesPool
 *  @typedef {Object} CB_AudioFileSpritesPool.checkPlayingAll_CALLBACK_ERROR_OBJECT
 *  @property {string} error - A string describing the error (if it was possible to be determined).
 *  @property {integer} checked - The number of {@link CB_AudioFile} objects that can be played.
 *  @property {integer|undefined} needed - The number of {@link CB_AudioFile} objects that needed to be checked before calling this method (it will be undefined if it could not be determined).
 */
 
/**
 * Checks whether each {@link CB_AudioFile} object whose {@link CB_AudioFile#getStatus} method returns the "unchecked" value (which belongs to the value of the {@link CB_AudioFile#UNCHECKED} property) can be played or not. After checking, if the audio can be played, the status of the {@link CB_AudioFile} object will get the value of {@link CB_AudioFile.LOADED}. Otherwise, if it cannot be played, the status of the {@link CB_AudioFile} object will get the value of {@link CB_AudioFile.FAILED}. If a {@link CB_AudioFile} object cannot be played and it is determined necessary, it will try to reload it internally (by calling the {@link CB_AudioFileCache#removeAudioFile} method). It will call the {@link CB_AudioFileCache#clearAudioFiles} method internally after finishing each call to the {@link CB_AudioFileSprites#checkPlayingAll} method. Uses the {@link CB_AudioFileSprites#checkPlayingAll} method internally. Recommended to be called through a user-driven event (as onClick, onTouch, etc.).
 *  @function
 *  @param {CB_AudioFileSpritesPool.checkPlayingAll_CALLBACK_OK} [callbackOk] - A function which will be called if all the {@link CB_AudioFile} objects whose {@link CB_AudioFile#getStatus} method returned the "unchecked" value (which belongs to the value of the {@link CB_AudioFile#UNCHECKED} property) could finally be checked successfully and all can be played, being "this" the {@link CB_AudioFileSpritesPool} object itself.
 *  @param {CB_AudioFileSpritesPool.checkPlayingAll_CALLBACK_ERROR} [callbackError] - A function which will be called if not all the {@link CB_AudioFile} objects whose {@link CB_AudioFile#getStatus} method returned the "unchecked" value (which belongs to the value of the {@link CB_AudioFile#UNCHECKED} property) could finally be checked successfully and any cannot be played, being "this" the {@link CB_AudioFileSpritesPool} object itself. This function will be called immediately if the method was previously called and it is still running currently.
 *  @param {boolean} [ignoreQueue=false] - Used as the "ignoreQueue" parameter when calling the {@link CB_AudioFileSprites#checkPlayingAll} method internally.
 *  @param {boolean} [ignoreStatus=false] - If it is set to false and the sprites pool object is loaded (the {@link CB_AudioFileSpritesPool#getStatus} method returns the value set in the {@link CB_AudioFileSpritesPool.LOADED} property), it will exit returning an error. Otherwise, if it is set to true, it will ignore the current sprites pool object status.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose status belonged to the "unchecked" value (the value of the {@link CB_AudioFile#UNCHECKED} property) before the execution of this method. It will return 0 (zero) if the method is tried to be executed while there is another previous call of it still running. It will also return 0 (zero) if the status of audio sprites pool is neither loaded (the {@link CB_AudioFileSpritesPool#getStatus} method does not returns the value set in the {@link CB_AudioFileSpritesPool.LOADED} property) nor unchecked (the {@link CB_AudioFileSpritesPool#status} method does not return the value set in the {@link CB_AudioFileSpritesPool.UNCHECKED} property).
 */
CB_AudioFileSpritesPool.prototype.checkPlayingAll = function(callbackOk, callbackError, ignoreQueue, ignoreStatus)
{
	var errorMessage = "";
	if (this._checkPlayingAllPerforming)
	{
		errorMessage = "Method checkPlayingAll is being processed. Cannot be called again until it finishes.";
	}
	else if (!ignoreStatus && this.getStatus() !== CB_AudioFileSpritesPool.LOADED && this.getStatus() !== CB_AudioFileSpritesPool.UNCHECKED)
	{
		errorMessage = "Sprites pool is not loaded.";
	}

	if (errorMessage !== "")
	{
		if (typeof(callbackError) === "function")
		{
			callbackError.call
			(
				this,
				{
					"GENERAL_ERROR" :
					{
						"error" : errorMessage,
						"checked" : 0
					}
				},
				0,
				undefined
			);
		}
		return 0;
	}

	this._checkPlayingAllPerforming = true;
	
	clearInterval(this._checkPlayingAllInterval);
	
	var uncheckedObjects = 0;
	var failed = 0;
	var succeeded = 0;
	var needed = 0;
	var objectsChecked = 0;
	var errorsChecking = {};
	for (var spritesGroupId in this.audioFileSprites)
	{
		uncheckedObjects +=
			this.audioFileSprites[spritesGroupId].checkPlayingAll
			(
				function(performedActions) //callbackOk:
				{
					objectsChecked += performedActions;
					succeeded++;
				},
				function(error, performedActions, needed) //callbackError:
				{
					objectsChecked += performedActions;
					failed++;
					errorsChecking[spritesGroupId] = {};
					errorsChecking[spritesGroupId].error = error;
					errorsChecking[spritesGroupId].checked = performedActions;
					errorsChecking[spritesGroupId].needed = needed;
				},
				ignoreQueue //ignoreQueue.
			);
		needed++;
	}
	
	var that = this;
	this._checkPlayingAllInterval =
		setInterval
		(
			function()
			{
				if (succeeded >= needed)
				{
					if (typeof(callbackOk) === "function") { callbackOk.call(that, objectsChecked, uncheckedObjects); }
					clearInterval(that._checkPlayingAllInterval);
					that._checkPlayingAllPerforming = false;
				}
				else if (succeeded + failed >= needed)
				{
					if (typeof(callbackError) === "function") { callbackError.call(that, errorsChecking, objectsChecked, uncheckedObjects); }
					clearInterval(that._checkPlayingAllInterval);
					that._checkPlayingAllPerforming = false;
				}
			}
		, 100);
	
	return uncheckedObjects;
}


/**
 * Tries to play all the {@link CB_AudioFile} objects by calling their {@link CB_AudioFile#play} method internally. If a {@link CB_AudioFile} object cannot be played and it is determined necessary, it will try to reload it internally (by calling the {@link CB_AudioFileCache#removeAudioFile} method). Uses the {@link CB_AudioFileSprites#playAll} method internally.
 *  @function
 *  @param {number} [startAt=0 | {@link CB_AudioFile_API.WAAPI#lastStartAt} | {@link CB_AudioFile_API.SM2#lastStartAt} | {@link CB_AudioFile_API.ACMP#lastStartAt} | {@link CB_AudioFile_API.AAPI#lastStartAt} | stopAt] - Used as the "startAt" parameter when calling the {@link CB_AudioFileSprites#playAll} method internally.
 *  @param {number} [stopAt={@link CB_AudioFile_API.WAAPI#getDuration}() | {@link CB_AudioFile_API.SM2#getDuration}() | {@link CB_AudioFile_API.ACMP#getDuration}() | {@link CB_AudioFile_API.AAPI#getDuration}()] - Used as the "stopAt" parameter when calling the {@link CB_AudioFileSprites#playAll} method internally.
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Used as the "loop" parameter when calling the {@link CB_AudioFileSprites#playAll} method internally.
 *  @param {number} [volume=CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT ? CB_Speaker.getVolume() : CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME] - Used as the "volume" parameter when calling the {@link CB_AudioFileSprites#playAll} method internally.
 *  @param {boolean} [avoidDelayedPlay=false] - Used as the "avoidDelayedPlay" parameter when calling the {@link CB_AudioFileSprites#playAll} method internally.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - Used as the "allowedRecursiveDelay" parameter when calling the {@link CB_AudioFileSprites#playAll} method internally.
 *  @param {function} [onPlayStart] - Used as the "onPlayStart" parameter when calling the {@link CB_AudioFileSprites#playAll} method internally.
 *  @param {function} [onStop] - Used as the "onStop" parameter when calling the {@link CB_AudioFileSprites#playAll} method internally.
 *  @param {boolean} [includingPlaying=false] - Used as the "includingPlaying" parameter when calling the {@link CB_AudioFileSprites#playAll} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose {@link CB_AudioFile#play} method did not return the value of "-1" (this does not mean necessarily that they could be played successfully).
 */
CB_AudioFileSpritesPool.prototype.playAll = function(startAt, stopAt, loop, volume, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onStop, includingPlaying)
{
	var played = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		played += this.audioFileSprites[spritesGroupId].playAll(startAt, stopAt, loop, volume, avoidDelayedPlay, allowedRecursiveDelay, onPlayStart, onStop, includingPlaying);
	}
	return played;
}


/**
 * Tries to stops all the existing {@link CB_AudioFile} objects or the desired ones (if provided), which are being played, by calling their {@link CB_AudioFile#stop} method internally. Uses the {@link CB_AudioFileSprites#stopAll} method internally.
 *  @function
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileSprites#stopAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#stop} method that were performed.
 */
CB_AudioFileSpritesPool.prototype.stopAll = function(audioFiles)
{
	var performed = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		performed += this.audioFileSprites[spritesGroupId].stopAll(audioFiles);
	}
	return performed;
}


/**
 * Plays silently and stops all {@link CB_AudioFile} objects after a desired time. It can be useful for some clients which need the {@link CB_AudioFile#play} method to be called through a user-driven event (as onClick, onTouch, etc.). Internally, it calls {@link CB_AudioFileCache#playAll}(0, null, false, 0, true, null, null, null, includingPlaying) and, after a desired delay, calls the {@link CB_AudioFileCache#stopAll} method. Uses the {@link CB_AudioFileSprites#playAndStopAll} method internally.
 *  @function
 *  @param {boolean} [includingPlaying=false] - Used as the "includingPlaying" parameter when calling the {@link CB_AudioFileSprites#playAndStopAll} method internally.
 *  @param {number} [delayBeforeStop=100] - Used as the "delayBeforeStop" parameter when calling the {@link CB_AudioFileSprites#playAndStopAll} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects whose {@link CB_AudioFile#play} method did not return the value of "-1" (this does not mean necessarily that they could be played successfully).
 */
CB_AudioFileSpritesPool.prototype.playAndStopAll = function(includingPlaying, delayBeforeStop)
{
	var played = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		played += this.audioFileSprites[spritesGroupId].playAndStopAll(includingPlaying, delayBeforeStop);
	}
	return played;
}


/**
 * Tries to pause all the existing {@link CB_AudioFile} objects or the desired ones (if provided), which are being played, by calling their {@link CB_AudioFile#pause} method internally. Uses the {@link CB_AudioFileSprites#pauseAll} method internally.
 *  @function
 *  @param {function} [onPause] - Used as the "onPause" parameter when calling the {@link CB_AudioFileSprites#pauseAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileSprites#pauseAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#pause} method that were performed.
 */
CB_AudioFileSpritesPool.prototype.pauseAll = function(onPause, audioFiles)
{
	var performed = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		performed += this.audioFileSprites[spritesGroupId].pauseAll(onPause, audioFiles);
	}
	return performed;
}


/**
 * Resumes all the existing {@link CB_AudioFile} objects or the desired ones (if provided), which are paused (and not stopped). Can be focused on just one sprite ID if desired. Uses the {@link CB_AudioFileSprites#resumeAll} method internally. Internal usage only recommended. To resume a sprite, better use the {@link CB_AudioFileSprites#resumeSprite} method instead.
 *  @function
 *  @param {boolean} [loop={@link CB_AudioFile#loop}] - Used as the "loop" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {boolean} [allowedRecursiveDelay={@link CB_Configuration.CrossBase.CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT}] - Used as the "allowedRecursiveDelay" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {boolean} [allowedRecursiveDelaySkipping=stopAt-startAt] - Used as the "allowedRecursiveDelaySkipping" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {function} [onPlayStart] - Used as the "onPlayStart" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {function} [onStop] - Used as the "onStop" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileSprites#resumeAll} method internally.
 *  @param {string} [spriteId='_WITHOUT_SPRITE_ASSOCIATED'] - Used as the "spriteId" when calling the {@link CB_AudioFileSprites#resumeAll} method internally. Internal usage only recommended.
 *  @returns {Object} Returns an object whose property names will be the ID of each sprites group and their value will be the returning value of the internal call to the {@link CB_AudioFileSprites#resumeAll} method.
 */
CB_AudioFileSpritesPool.prototype.resumeAll = function(loop, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, audioFiles, spriteId)
{
	var soundInstances = {};
	for (var spritesGroupId in this.audioFileSprites)
	{
		soundInstances[spritesGroupId] = this.audioFileSprites[spritesGroupId].resumeAll(loop, allowedRecursiveDelay, allowedRecursiveDelaySkipping, onPlayStart, onStop, audioFiles, spriteId);
	}
	return soundInstances;
}


/**
 * Mutes all the existing {@link CB_AudioFile} objects or the desired ones (if provided). Uses the {@link CB_AudioFileSprites#muteAll} method internally.
 *  @function
 *  @param {function} [onMute] - Used as the "onMute" parameter when calling the {@link CB_AudioFileSprites#muteAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileSprites#muteAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#mute} method that were performed.
 */
CB_AudioFileSpritesPool.prototype.muteAll = function(onMute, audioFiles)
{
	var performed = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		performed += this.audioFileSprites[spritesGroupId].muteAll(onMute, audioFiles);
	}
	return performed;
}


/**
 * Unmutes all the existing {@link CB_AudioFile} objects or the desired ones (if provided). Uses the {@link CB_AudioFileSprites#unmuteAll} method internally.
 *  @function
 *  @param {function} [onUnmute] - Used as the "onUnmute" parameter when calling the {@link CB_AudioFileSprites#unmuteAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileSprites#unmuteAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#unmute} method that were performed.
 */
CB_AudioFileSpritesPool.prototype.unmuteAll = function(onUnmute, audioFiles)
{
	var performed = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		performed += this.audioFileSprites[spritesGroupId].unmuteAll(onUnmute, audioFiles);
	}
	return performed;
}


/**
 * Sets the same volume for all the existing {@link CB_AudioFile} objects or the desired ones (if provided). Uses the {@link CB_AudioFileSprites#setVolumeAll} method internally.
 *  @function
 *  @param {number} [volume={@link CB_Speaker.getVolume()} | {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME}] - Used as the "volume" parameter when calling the {@link CB_AudioFileSprites#setVolumeAll} method internally.
 *  @param {boolean} [forceSetVolumeProperty=false] - Used as the "forceSetVolumeProperty" parameter when calling the {@link CB_AudioFileSprites#setVolumeAll} method internally.
 *  @param {function} [onSetVolume] - Used as the "onSetVolume" parameter when calling the {@link CB_AudioFileSprites#setVolumeAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileSprites#setVolumeAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#setVolume} method that were performed internally.
 */
CB_AudioFileSpritesPool.prototype.setVolumeAll = function(volume, forceSetVolumeProperty, onSetVolume, audioFiles)
{
	var performed = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		performed += this.audioFileSprites[spritesGroupId].setVolumeAll(volume, forceSetVolumeProperty, onSetVolume, audioFiles);
	}
	return performed;
}


/**
 * Callback function used by the {@link CB_AudioFileSpritesPool#setAudioAPIAll} method that will be called when all the process was performed successfully.
 *  @memberof CB_AudioFileSpritesPool
 *  @callback CB_AudioFileSpritesPool.setAudioAPIAll_CALLBACK_OK
 *  @param {integer} objectsChangedAPI - The number of {@link CB_AudioFile} objects that actually changed its audio API.
 *  @param {integer} performedActions - The number of {@link CB_AudioFile} objects that ended with a desired audio API, including those ones which were already using it.
 *  @param {integer} actionsNeeded - The total number of {@link CB_AudioFile} objects  that were considered to perform the action (it will be undefined if it could not be determined).
 */

 /**
 * Callback function used by the {@link CB_AudioFileCache#setAudioAPIAll} method that will be called when any error happened.
 *  @memberof CB_AudioFileSpritesPool
 *  @callback CB_AudioFileSpritesPool.setAudioAPIAll_CALLBACK_ERROR
 *  @param {Object} errorsObject - Object whose property names are the ID of each sprites group or "GENERAL_ERROR" if the error is not related to any sprites group and their value will be a {@link CB_AudioFileSpritesPool.setAudioAPIAll_CALLBACK_ERROR_OBJECT} object each.
 *  @param {integer} errorsHappened - The number of errors that happened, which could be greater than 1 if more than one internal call to the {@link CB_AudioFile#setAudioAPI} method failed.
 *  @param {integer} objectsChangedAPI - The number of {@link CB_AudioFile} objects that actually changed its audio API.
 *  @param {integer} performedActions - The number of {@link CB_AudioFile} objects that ended with a desired audio API, including those ones which were already using it.
 *  @param {integer|undefined} actionsNeeded - The total number of {@link CB_AudioFile} objects  that were considered to perform the action (it will be undefined if it could not be determined).
 */ 

 /**
 * Object used by the {@link CB_AudioFileSpritesPool.setAudioAPIAll_CALLBACK_ERROR} callback. Unless it belongs to a general error, its information will only be regarding a certain sprites group.
 *  @memberof CB_AudioFileSpritesPool
 *  @typedef {Object} CB_AudioFileSpritesPool.setAudioAPIAll_CALLBACK_ERROR_OBJECT
 *  @property {string} error - A string describing the error, if it was possible to be determined.
 *  @property {integer} errors - The number of errors that happened, which could be greater than 1 if more than one internal call to the {@link CB_AudioFile#setAudioAPI} method failed.
 *  @property {integer} changed - The number of objects that actually changed its audio API.
 *  @property {integer} performed - The number of {@link CB_AudioFile} objects that ended with a desired audio API, including those ones which were already using it.
 *  @property {integer|undefined} needed - The total number of {@link CB_AudioFile} objects  that were considered to perform the action (it will be undefined if it could not be determined).
 */
 
/**
 * Tries to change the audio API for all the existing {@link CB_AudioFile} objects or the desired ones (if provided). This method is not allowed to be called if a previous call to it did not finish yet. The function defined in the "callbackError" parameter, if any, will be called immediately if the method was previously called and it is still running currently. Uses the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @function
 *  @param {array|string} preferredAPIs - Used as the "preferredAPIs" parameter when calling the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @param {CB_AudioFileSpritesPool.setAudioAPIAll_CALLBACK_OK} [callbackOk] - Function that will be called when all the process was performed successfully, being "this" the {@link CB_AudioFileSpritesPool} object.
 *  @param {CB_AudioFileSpritesPool.setAudioAPIAll_CALLBACK_ERROR} [callbackError] - Function that will be called when any error happened, being "this" the {@link CB_AudioFileSpritesPool} object. This function will be called immediately if the method was previously called and it is still running currently.
 *  @param {boolean} [mandatory=false] - Used as the "mandatory" parameter when calling the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @param {string} [forceReload=false] - Used as the "forceReload" parameter when calling the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @param {array} [audioFiles={@link CB_AudioFileCache#audioFiles}] - Used as the "audioFiles" parameter when calling the {@link CB_AudioFileSprites#setAudioAPIAll} method internally.
 *  @returns {integer} Returns the number of calls to the {@link CB_AudioFile#setAudioAPI} method that were performed.
 */
CB_AudioFileSpritesPool.prototype.setAudioAPIAll = function(preferredAPIs, callbackOk, callbackError, mandatory, forceReload, audioFiles, ignoreStatus)
{
	var errorMessage = "";
	if (this._setAudioAPIAllPerforming)
	{
		errorMessage = "Method setAudioAPIAll is being processed. Cannot be called again until it finishes.";
	}
	else if (!ignoreStatus && this.getStatus() !== CB_AudioFileSpritesPool.LOADED)
	{
		errorMessage = "Sprites pool is not loaded.";
	}

	if (errorMessage !== "")
	{
		if (typeof(callbackError) === "function")
		{
			callbackError.call
			(
				this,
				{
					"GENERAL_ERROR" :
					{
						"error" : errorMessage,
						"errors" : 1,
						"changed" : 0,
						"performed" : 0,
						"needed" : undefined
					}
				},
				1,
				0,
				0,
				undefined
			);
		}
		return 0;
	}

	this._setAudioAPIAllPerforming = true;
	
	clearInterval(this._setAudioAPIAllInterval);
	
	var performedReturn = 0;
	var failed = 0;
	var succeeded = 0;
	var needed = 0;
	var objectsChanged = 0;
	var errorsChecking = {};
	var errors = 0;
	var performed = 0;
	var neededTotal = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		performedReturn +=
			this.audioFileSprites[spritesGroupId].setAudioAPIAll
			(
				preferredAPIs, //preferredAPIs.
				function(objectsChangedAPI, performedActions, actionsNeeded) //callbackOk:
				{
					objectsChanged += objectsChangedAPI;
					performed += performedActions;
					actionsNeeded = parseInt(actionsNeeded); //It could be undefined.
					neededTotal += actionsNeeded;
					succeeded++;
				},
				function(error, errorsHappened, objectsChangedAPI, performedActions, actionsNeeded) //callbackError:
				{
					failed++;
					
					actionsNeeded = parseInt(actionsNeeded); //It could be undefined.
					
					errors += errorsHappened;
					objectsChanged += objectsChangedAPI;
					performed += performedActions;
					neededTotal += actionsNeeded;
					
					errorsChecking[spritesGroupId] = {};
					errorsChecking[spritesGroupId].error = error;
					errorsChecking[spritesGroupId].errors = errorsHappened;
					errorsChecking[spritesGroupId].changed = objectsChangedAPI;
					errorsChecking[spritesGroupId].performed = performedActions;
					errorsChecking[spritesGroupId].needed = actionsNeeded;
				},
				mandatory, //mandatory.
				forceReload, //forceReload.
				audioFiles //audioFiles
			);
		needed++;
	}
	
	var that = this;
	this._setAudioAPIAllInterval =
		setInterval
		(
			function()
			{
				if (succeeded >= needed)
				{
					if (typeof(callbackOk) === "function") { callbackOk.call(that, objectsChanged, performed, neededTotal); }
					clearInterval(that._setAudioAPIAllInterval);
					that._setAudioAPIAllPerforming = false;
				}
				else if (succeeded + failed >= needed)
				{
					if (typeof(callbackError) === "function") { callbackError.call(that, errorsChecking, errors, objectsChanged, performed, neededTotal); }
					clearInterval(that._setAudioAPIAllInterval);
					that._setAudioAPIAllPerforming = false;
				}
			}
		, 100);
	
	return performedReturn;
}


/**
 * Tells whether any of the {@link CB_AudioFile} objects is playing or not. Uses the {@link CB_AudioFileSprites#isPlaying} method internally.
 *  @function
 *  @returns {boolean} Returns whether any of the {@link CB_AudioFile} objects is playing or not.
 */
CB_AudioFileSpritesPool.prototype.isPlaying = function()
{
	for (var spritesGroupId in this.audioFileSprites)
	{
		if (this.audioFileSprites[spritesGroupId].isPlaying()) { return true; } 
	}
	return false;
}


/**
 * Tells the current number of free {@link CB_AudioFile} objects (the number of objects which are available and ready to use). Uses the {@link CB_AudioFileSprites#getAudioFilesFreeNumber} method internally.
 *  @function
 *  @returns {integer} Returns the current number of free {@link CB_AudioFile} objects (the number of objects which are available and ready to use).
 */
CB_AudioFileSpritesPool.prototype.getAudioFilesFreeNumber = function()
{
	var number = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		number += this.audioFileSprites[spritesGroupId].getAudioFilesFreeNumber();
	}
	return number;
}


/**
 * Gets an object with arrays or a one-dimension array with all the {@link CB_AudioFile} objects. Uses the {@link CB_AudioFileSprites#getAudioFiles} method internally.
 *  @function
 *  @param {boolean} [copy=false] - Used as the "copy" parameter when calling the {@link CB_AudioFileSprites#getAudioFiles} method internally.
 *  @param {boolean} [oneDimension=false] - If it is set to true, the method will return an array with all the {@link CB_AudioFile} objects. Otherwise, if it is set to false, the method will return an object whose property names will be the ID of each sprites group and their value will be an array with all the {@link CB_AudioFile} objects that belong to that sprites group.
 *  @returns {Object|array} If the "oneDimension" parameter is set to true, returns an array with all the {@link CB_AudioFile} objects. Otherwise, if the "oneDimension" parameter is set to false, it will return an object whose property names will be the ID of each sprites group and their value will be an array with all the {@link CB_AudioFile} objects that belong to that sprites group.
 */
CB_AudioFileSpritesPool.prototype.getAudioFiles = function(copy, oneDimension)
{
	var audioFiles;
	if (!oneDimension)
	{
		audioFiles = {};
		for (var spritesGroupId in this.audioFileSprites)
		{
			audioFiles[spritesGroupId] = this.audioFileSprites[spritesGroupId].getAudioFiles(copy);
		}
	}
	else
	{
		audioFiles = [];
		var audioFilesSpritesGroup;
		var audioFilesSpritesGroupLength;
		var y = 0;
		var x = 0;
		for (var spritesGroupId in this.audioFileSprites)
		{
			audioFilesSpritesGroup = this.audioFileSprites[spritesGroupId].getAudioFiles(copy);
			audioFilesSpritesGroupLength = audioFilesSpritesGroup.length;
			for (x = 0; x < audioFilesSpritesGroupLength; x++)
			{
				audioFiles[y++] = audioFilesSpritesGroup[x];
			}
		}
	}
	return audioFiles;
}


/**
 * Gets an object with arrays or a one-dimension array with the free {@link CB_AudioFile} objects (the objects which are available and ready to use). Uses the {@link CB_AudioFileSprites#getAudioFilesFree} method internally.
 *  @function
 *  @param {boolean} [oneDimension=false] - If it is set to true, the method will return an array with the free {@link CB_AudioFile} objects. Otherwise, if it is set to false, the method will return an object whose property names will be the ID of each sprites group and their value will be an array with the free {@link CB_AudioFile} objects that belong to that sprites group.
 *  @returns {Object|array} If the "oneDimension" parameter is set to true, returns an array with the free {@link CB_AudioFile} objects. Otherwise, if the "oneDimension" parameter is set to false, it will return an object whose property names will be the ID of each sprites group and their value will be an array with the free {@link CB_AudioFile} objects that belong to that sprites group.
 */
CB_AudioFileSpritesPool.prototype.getAudioFilesFree = function(oneDimension)
{
	var audioFiles;
	if (!oneDimension)
	{
		audioFiles = {};
		for (var spritesGroupId in this.audioFileSprites)
		{
			audioFiles[spritesGroupId] = this.audioFileSprites[spritesGroupId].getAudioFilesFree();
		}
	}
	else
	{
		audioFiles = [];
		var audioFilesSpritesGroup;
		var audioFilesSpritesGroupLength;
		var y = 0;
		var x = 0;
		for (var spritesGroupId in this.audioFileSprites)
		{
			audioFilesSpritesGroup = this.audioFileSprites[spritesGroupId].getAudioFilesFree();
			audioFilesSpritesGroupLength = audioFilesSpritesGroup.length;
			for (x = 0; x < audioFilesSpritesGroupLength; x++)
			{
				audioFiles[y++] = audioFilesSpritesGroup[x];
			}
		}
	}
	return audioFiles;
}


/**
 * Gets an object with arrays or a one-dimension array with the busy {@link CB_AudioFile} objects (the objects which are not available and ready to use). Uses the {@link CB_AudioFileSprites#getAudioFilesBusy} method internally.
 *  @function
 *  @param {boolean} [oneDimension=false] - If it is set to true, the method will return an array with the busy {@link CB_AudioFile} objects. Otherwise, if it is set to false, the method will return an object whose property names will be the ID of each sprites group and their value will be an array with the busy {@link CB_AudioFile} objects that belong to that sprites group.
 *  @returns {Object|array} If the "oneDimension" parameter is set to true, returns an array with the busy {@link CB_AudioFile} objects. Otherwise, if the "oneDimension" parameter is set to false, it will return an object whose property names will be the ID of each sprites group and their value will be an array with the busy {@link CB_AudioFile} objects that belong to that sprites group.
 */
CB_AudioFileSpritesPool.prototype.getAudioFilesBusy = function(oneDimension)
{
	var audioFiles;
	if (!oneDimension)
	{
		audioFiles = {};
		for (var spritesGroupId in this.audioFileSprites)
		{
			audioFiles[spritesGroupId] = this.audioFileSprites[spritesGroupId].getAudioFilesBusy();
		}
	}
	else
	{
		audioFiles = [];
		var audioFilesSpritesGroup;
		var audioFilesSpritesGroupLength;
		var y = 0;
		var x = 0;
		for (var spritesGroupId in this.audioFileSprites)
		{
			audioFilesSpritesGroup = this.audioFileSprites[spritesGroupId].getAudioFilesBusy();
			audioFilesSpritesGroupLength = audioFilesSpritesGroup.length;
			for (x = 0; x < audioFilesSpritesGroupLength; x++)
			{
				audioFiles[y++] = audioFilesSpritesGroup[x];
			}
		}
	}
	return audioFiles;
}


/**
 * Tells the number of {@link CB_AudioFile} objects created. Uses the {@link CB_AudioFileSprites#getAudioFilesNumber} method internally.
 *  @function
 *  @param {boolean} [real=false] - Used as the "real" parameter when calling the {@link CB_AudioFileSprites#getAudioFilesNumber} method internally.
 *  @returns {integer} Returns the number of {@link CB_AudioFile} objects created.
 */
CB_AudioFileSpritesPool.prototype.getAudioFilesNumber = function(real)
{
	var number = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		number += this.audioFileSprites[spritesGroupId].getAudioFilesNumber(real);
	}
	return number;
}


/**
 * Returns a number representing the percentage of the loading progress for the audio sprites pool object (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable. Uses the {@link CB_AudioFileSprites#getProgress} method internally.
 *  @function
 *  @param {boolean} [countLoadedObjects=false] - Used as the "countLoadedObjects" parameter when calling the {@link CB_AudioFileSprites#getProgress} method internally.
 *  @param {boolean} [alsoUncheckedAndCheckingObjects=false] - Used as the "alsoUncheckedAndCheckingObjects" parameter when calling the {@link CB_AudioFileSprites#getProgress} method internally.
 *  @returns {number} Returns a number representing the percentage of the loading progress for the audio sprites pool object (from 0 to 100, being 100 a complete loading progress). The way to calculate it internally may differ from one audio API to another and it is not totally reliable.
 */
CB_AudioFileSpritesPool.prototype.getProgress = function(countLoadedObjects, alsoUncheckedAndCheckingObjects)
{
	var progress = 0;
	var spritesGroups = 0;
	for (var spritesGroupId in this.audioFileSprites)
	{
		progress += this.audioFileSprites[spritesGroupId].getProgress(countLoadedObjects, alsoUncheckedAndCheckingObjects);
		spritesGroups++;
	}
	if (spritesGroups !== 0) { progress /= spritesGroups; }
	return progress;
}


/**
 * Gets the current status of the audio file sprites pool object. Uses the {@link CB_AudioFileSprites#getStatus} method internally.
 *  @function
 *  @returns {number} Returns the current status of the audio file sprites pool object. It is a number, affected by the returning value of the {@link CB_AudioFileSprites#getStatus} method of each {@link CB_AudioFileSprites} object used internally, which should match the value of the {@link CB_AudioFileCache.UNLOADED} (still unloaded), {@link CB_AudioFileCache.LOADING} (loading), {@link CB_AudioFileCache.UNCHECKED} (not checked by calling the {@link CB_AudioFileCache#checkPlayingAll} method yet), {@link CB_AudioFileCache.CHECKING} (being checked by the {@link CB_AudioFileCache#checkPlayingAll} method), {@link CB_AudioFileCache.LOADED} (loaded), {@link CB_AudioFileCache.FAILED} (failed loading or failed to play or by any other reason) or {@link CB_AudioFileCache.ABORTED} (aborted because it was destroyed with the "destructor" method) property.
 */
CB_AudioFileSpritesPool.prototype.getStatus = function()
{
	var status = null;
	
	var allLoaded = false;
	var loaded = 0;
	
	var anyUnloaded = false;
	var anyLoading = false;
	var anyUnchecked = false;
	var anyChecking = false;
	var anyFailed = false;
	var anyAborted = false;
	
	for (var audioFileSpritesObject in this.audioFileSprites)
	{
		if (this.audioFileSprites[audioFileSpritesObject].getStatus() === CB_AudioFileCache.UNLOADED) { anyUnloaded = true; }
		else if (this.audioFileSprites[audioFileSpritesObject].getStatus() === CB_AudioFileCache.LOADING) { anyLoading = true; }
		else if (this.audioFileSprites[audioFileSpritesObject].getStatus() === CB_AudioFileCache.UNCHECKED) { anyUnchecked = true; }
		else if (this.audioFileSprites[audioFileSpritesObject].getStatus() === CB_AudioFileCache.CHECKING) { anyChecking = true; }
		else if (this.audioFileSprites[audioFileSpritesObject].getStatus() === CB_AudioFileCache.FAILED) { anyFailed = true; }
		else if (this.audioFileSprites[audioFileSpritesObject].getStatus() === CB_AudioFileCache.ABORTED) { anyAborted = true; }
		else { loaded++; }
	}

	if (anyUnloaded) { status = CB_AudioFileSpritesPool.UNLOADED; }
	else if (anyLoading) { status = CB_AudioFileSpritesPool.LOADING; }
	else if (anyUnchecked) { status = CB_AudioFileSpritesPool.UNCHECKED; }
	else if (anyChecking) { status = CB_AudioFileSpritesPool.CHECKING; }
	else if (anyFailed) { status = CB_AudioFileSpritesPool.FAILED; }
	else if (anyAborted) { status = CB_AudioFileSpritesPool.ABORTED; }
	
	if (status === null)
	{
		if (loaded > 0) { status = CB_AudioFileSpritesPool.LOADED; }
		else if (this._aborted) { status = CB_AudioFileSpritesPool.ABORTED; }
		else { status = CB_AudioFileSpritesPool.UNLOADED; }
	}
	
	return status;
}


/**
 * Gets the current status of the audio file sprites pool object, as a string.
 *  @function
 *  @returns {string} Returns the current status of the audio file sprites pool object, as a string. Possible return values are "UNLOADED", "LOADING", "UNCHECKED", "CHECKING", "LOADED", "FAILED", "ABORTED" or "UNKNOWN (UNKNOWN_STATUS)" (where "UNKNOWN_STATUS" will be a returning value from the {@link CB_AudioFileSpritesPool#getStatus} method not recognized as any possible status).
 */
CB_AudioFileSpritesPool.prototype.getStatusString = function()
{
	var status = this.getStatus();
	var statuses = [ "UNLOADED", "LOADING", "UNCHECKED", "CHECKING", "LOADED", "FAILED", "ABORTED" ];
	if (typeof(statuses[status]) !== "undefined") { return statuses[status]; }
	else { return "UNKNOWN (" + status + ")"; }
}


/**
 * Calls the error function which should be set in the {@link CB_AudioFileSprites#onError} property (if any), being "this" the {@link CB_AudioFileSpritesPool} object itself. Internal usage only recommended.
 *  @function
 *  @param {string} [message] - The message describing the error that will be sent to the set {@link CB_AudioFileSprites#onError} function (if any) as the first and unique parameter. 
 *  @param {boolean} [ignorePreviousExecution=false] - If it is set to false, the function set in the {@link CB_AudioFileSprites#onError} property (if any) will only be called if it was not executed previously.
 *  @returns {boolean} Returns true if the {@link CB_AudioFileSprites#onError} function could be called or false otherwise.
 */
CB_AudioFileSpritesPool.prototype.errorFunction = function(message, ignorePreviousExecution)
{
	if (ignorePreviousExecution || !this._errorFunctionExecuted)
	{
		if (typeof(this.onError) === "function") { this._errorFunctionExecuted = true; this.onError.call(this, message); return true; }
	}
	return false;
}