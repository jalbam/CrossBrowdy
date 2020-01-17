/**
 * @file Main CrossBase module file.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */


//Credits of the module:
var CB_CrossBaseCredits = 
	"[CB] - CrossBase module by Joan Alba Maldonado<br />" +
	"[CB] -- Array.* polyfills by Mozilla Foundation (MDN)<br />" +
	"[CB] -- JSON 3 by Kit Cambridge<br />" +
	"[CB] -- bluebird by Petka Antonov<br />" +
	"[CB] -- BrowserDetect by Peter-Paul Koch<br />" +
	"[CB] -- performance.now polyfill by Paul Irish, Aaron Levine and Joan Alba Maldonado<br />" +
	"[CB] -- requestAnimationFrame polyfill by Erik Moller (fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavic, Darius Bacon, Tim Hall and Joan Alba Maldonado)<br />" +
	"[CB] -- typedarray.js polyfill by Linden Research, Inc. and Joshua Bell<br />" +
	"[CB] -- Base64Binary by Daniel Guerrero<br />" +
	"[CB] -- localStorage polyfill by Morten Houmøller Nygaard<br />" +
	"[CB] -- lz-string (including base64-string) by pieroxy<br />" +
	"[CB] -- Canbox by Robert Inglin<br />" +
	"[CB] -- ExplorerCanvas by Google Inc.<br />" +
	"[CB] -- SLCanvas by David Anson and Jon Davis<br />" +
	"[CB] -- FlashCanvas by Tim Cameron Ryan and Shinya Muramatsu<br />" +
	"[CB] -- canvas-text by Fabien Ménager<br />" +
	"[CB] -- Detect-zoom by yonran (maintained by tombigel)<br />" +
	"[CB] -- AudioContext-MonkeyPatch by Chris Wilson<br />" +
	"[CB] -- WAAPISim by g200kg<br />" +
	"[CB] -- timbre.js and subcollider.js by mohayonao<br />" +
	"[CB] -- Band.js by Cody Lundquist and various contributors<br />" +
	"[CB] -- jsfx by Egon Elbre<br />" +
	"[CB] -- SoundManager 2 by Scott Schiller<br />" +
	"[CB] -- fetch-ie8 by Cam Song<br />" +
	"[CB] -- SockJS-client by Marek, Bryce Kahle, Michael Bridgen, Luigi Pinca and others<br />" +
	"[CB] -- Pressure.js by Stuart Yamartino<br />" +
	"[CB] -- Hammer.js by Jorik Tangelder<br />" +
	"[CB] -- Hammer Time by Alexander Schmitz and other contributors<br />" +
	"[CB] -- wii-js by Ryan McGrath<br />" +
	"[CB] -- gamepad-plus by Chris Van Wiemeersch (MozVR)<br />" +
	"[CB] -- NoSleep.js by Rich Tibbett<br />";

	
//CrossBase constants and variables:
/**
 * Keeps the name of the CrossBase module.
 *	@constant
 *  @type {string}
 *  @default
 */
var CB_BASE_NAME = "CrossBase";


/**
  Property that contains an object with the options for the main script.
  * @namespace CB_Configuration.CrossBase
 */
CB_Configuration[CB_BASE_NAME] =
{
	/**
	 * Path to the CrossBase module, relative to the CrossBrowdy folder.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {string}
	 *  @default {@link CB_BASE_NAME} + "/"
	 */
	SCRIPT_PATH: CB_BASE_NAME + "/",
	
	
	/**
	 * Defines whether to have in mind possible [iframes]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe} that could contain the script or not. Used by some functions of {@link CB_Client}, {@link CB_Events}, etc.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	MIND_IFRAMES: true,
	
	
	/**
	 * Defines whether to allow to extend the DOM if needed or not. If set to true and some methods (as for example [Array.indexOf]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf}, [Array.lastIndexOf]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf}, [Array.isArray]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray}, [Array.forEach]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}, [NodeList.forEach]{@link https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach}, [HTMLCollection.forEach]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}, etc.) are not supported natively, they will be added.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	EXTEND_DOM: false,


	/**
	 * Defines whether to use high precision in the CB_Device.getTime (returning '[window.performance.timing.navigationStart]{@link https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/navigationStart} + [window.performance.now]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance/now}()', where '[window.performance.now]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance/now}' could be polyfilled) or not (returning '[Date.now]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now}()', where '[Date.now]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now}' could be polyfilled).
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {string}
	 *  @default
	 */
	CB_Device_getTime_HIGH_PRECISION: true,


	/**
	 * Defines whether to use cache for the function {@link CB_Elements.id} by default.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Elements_id_USE_CACHE: true,

	
	/**
	 * Defines whether to use cache for the {@link CB_Elements.tag} function by default.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Elements_tag_USE_CACHE: true,
	
	
	/**
	 * Defines whether to use cache for the function {@link CB_Elements.classes} by default.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Elements_classes_USE_CACHE: true,
	
	
	/**
	 * Default language to use for {@link CB_Client} when no language can be detected (very strange case!).
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {string}
	 *  @default
	 */
	CB_Client_language_DEFAULT: "en",


	/**
	 * Default value for the "allowNavigatorLanguages" parameter for {@link CB_Client.getLanguage} and {@link CB_Client.getLanguages} functions.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Client_allowNavigatorLanguages_DEFAULT: false,
	
	
	/**
	 * Tells whether the {@link CB_Client.getLanguage} and {@link CB_Client.getLanguages} functions will use the accepted languages detected by PHP (if any) as the first option by default or not.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Client_PHPAcceptedLanguagesFirst_DEFAULT: true,

	
	/**
	 * Defines whether the URL for the proxy (defined in {@link CB_Configuration.CrossBase.CB_Net_XHR_PROXY_URL}) is relative to the main script folder or not. If it is relative, the "onCall" event of the CrossBase module will append the value of the "scriptPathGiven" parameter at the beginning.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Net_XHR_PROXY_URL_RELATIVE: true,

	
	/**
	 * Defines whether we want to prevent the Firefox bug that affects [SockJS library]{@link https://github.com/sockjs/sockjs-client/} (see {@link https://github.com/sockjs/sockjs-client/issues/18}) or not. Used by {@link CB_Keyboard}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Net_Sockets_PREVENT_FIREFOX_ESC_BUG: true,
	
	
	/**
	 * Defines whether to allow Nintendo Wii codes (from the Wiimote) set in the {@link CB_Keyboard.extended.WII} object to be defined in the key aliases even if they use codes which belong to other keys. Used by {@link CB_Keyboard}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Keyboard_extended_WII_allowDuplicateKeyAliases: true,

	
	/**
	 * Defines whether to allow Sony Playstation 4 codes set in the {@link CB_Keyboard.extended.PS4CB_Keyboard.extended.PS4} object to be defined in the key aliases even if they use codes which belong to other keys. Used by {@link CB_Keyboard}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Keyboard_extended_PS4_allowDuplicateKeyAliases: false,

	
	/**
	 * Defines whether to allow Smart TV codes (from the remote control) and virtual key codes set in the {@link CB_Keyboard.extended.VK} object to be defined in the key aliases even if they use codes which belong to other keys. Used by {@link CB_Keyboard}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Keyboard_extended_VK_allowDuplicateKeyAliases: true,

	
	/**
	 * Defines whether to allow Samsung TV key codes (from the remote control) set in the {@link CB_Keyboard.extended.SAMSUNG_TV} object to be defined in the key aliases even if they use codes which belong to other keys. Used by {@link CB_Keyboard}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Keyboard_extended_SAMSUNG_TV_allowDuplicateKeyAliases: false,
	
	
	/**
	 * Default value for the "avoidProprietary" proprietary when calling different functions of the {@link CB_Controllers} static class, as the {@link CB_Controllers.getButtonsDown}, the {@link CB_Controllers.isButtonDown} and the {@link CB_Controllers.getGamePads} functions, etc.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_Controllers_avoidProprietary_DEFAULT: false,
	
	
	/**
	 * Allowed width margin of the total screen available to consider whether it is in full screen or not. Needed by old web clients without Fullscreen API support, mainly. Used by the {@link CB_Screen.isFullScreen} function.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {float}
	 *  @default
	 */
	CB_Screen_isFullScreen_ALLOWED_WIDTH_MARGIN_PERCENTAGE: 3.9,
	
	
	/**
	 * Allowed height margin of the total screen available to consider whether it is in full screen or not. Needed by old web clients without Fullscreen API support, mainly. Used by the {@link CB_Screen.isFullScreen} function.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {float}
	 *  @default
	 */
	CB_Screen_isFullScreen_ALLOWED_HEIGHT_MARGIN_PERCENTAGE: 3.5,

	
	/**
	 * Defines whether to allow using "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}) emulation (it will use [WAAPISim]{@link https://github.com/g200kg/WAAPISim} if needed) or not.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	WAAPI_EMULATION_ALLOWED: true,

	
	/**
	 * Default volume for CB_Speaker (from 0 to 100).
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {integer}
	 *  @default
	 */
	CB_Speaker_DEFAULT_VOLUME: 100,

	
	/**
	 * Milliseconds that a file is played (with volume set to 0) automatically when an audio file is loaded. Needed for some web clients which cannot find out the duration otherwise. Used by {@link CB_AudioFile}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {integer}
	 *  @default
	 */
	CB_AudioFile_AUTOPLAY_SILENTLY_ON_LOAD_MS: 500,

	
	/**
	 * Milliseconds to wait before declaring a sound as failed if it cannot be loaded before. Used by {@link CB_AudioFile_API.SM2}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {integer}
	 *  @default
	 */
	CB_AudioFile_ONLOAD_TIMEOUT_MS: 15000,

	
	/**
	 * Tells whether CB_AudioFile["AAPI"] uses [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout} (instead of [timeupdate]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event} event) to detect when the given "stopAt" is reached.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_AudioFile_AAPI_USE_TIMEOUT_TO_DETECT_STOPAT: true,

	
	/**
	 * Default value for maximum delay (in milliseconds) to wait for a sound to start playing or start next loop (if the time expires, the sound will never be played).
		Used by {@link CB_AudioFile_API.WAAPI}, {@link CB_AudioFile_API.AAPI}, {@link CB_AudioFile_API.SM2}, {@link CB_AudioFile_API.ACMP} and {@link CB_AudioFileCache}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {integer}
	 *  @default
	 */
	CB_AudioFile_AudioFileCache_ALLOWED_RECURSIVE_DELAY_DEFAULT: 150,

	
	/**
	 * Tells whether to mute or not the audio files when they load or are checking. Note: Audio cache does not work properly on BlackBerry PlayBook's default browser if the sounds are muted when load or are checking.
		Used by {@link CB_AudioFile}, {@link CB_AudioFile_API.WAAPI}, {@link CB_AudioFile_API.AAPI}, {@link CB_AudioFile_API.SM2}, {@link CB_AudioFile_API.ACMP} and {@link CB_AudioFileCache}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default !(navigator.userAgent.indexOf("PlayBook") !== -1 && navigator.userAgent.indexOf("Tablet OS") !== -1)
	 */
	CB_AudioFile_AudioFileCache_MUTE_ON_LOAD_AND_CHECKING: !(navigator.userAgent.indexOf("PlayBook") !== -1 && navigator.userAgent.indexOf("Tablet OS") !== -1), //Audio cache does not work properly on BlackBerry PlayBook's default browser if the sounds are muted when load or are checking.

	
	/**
	 * Defines whether to use {@link CB_Speaker._volume} as default volume. Used by {@link CB_AudioFile}, {@link CB_AudioFile_API.WAAPI}, {@link CB_AudioFile_API.AAPI}, {@link CB_AudioFile_API.SM2}, {@link CB_AudioFile_API.ACMP} and {@link CB_AudioFileCache}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_DEFAULT: true,

	
	/**
	 * Defines whether to use {@link CB_Speaker._volume} as maximum volume. Used by {@link CB_AudioFile}, {@link CB_AudioFile_API.WAAPI}, {@link CB_AudioFile_API.AAPI}, {@link CB_AudioFile_API.SM2} and {@link CB_AudioFile_API.ACMP}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_AudioFile_AudioFileCache_USE_SPEAKER_VOLUME_AS_MAXIMUM: false,


	/**
	 * Array with the default desired canvas emulation methods by order of preference. Used by {@link CB_Canvas}.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {array}
	 *  @default
	 */
	CB_Canvas_PREFERRED_EMULATION_METHODS:
	[
		"FLASH",		//FlashCanvas.
		"VML",			//ExplorerCanvas.
		"DHTML",		//Canbox.
		"SILVERLIGHT"	//SLCanvas.
	],
	

	/**
	 * Value by default when the "allowEmulation" parameter is not provided in the {@link CB_AudioDetector.getPreferredAPI}, the {@link CB_AudioDetector.getSupportedAPIs} or the {@link CB_AudioDetector.isAPISupported} function.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {boolean}
	 *  @default
	 */
	CB_AudioDetector_allowEmulation_DEFAULT: false,
	
	
	/**
	 * Array with the default preferred audio APIs by order of preference. Used by {@link CB_AudioFileCache} and {@link CB_AudioDetector}.
		Possible audio APIs are "WAAPI" ([HTML5 Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}), "SM2" ([SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}), "ACMP" ([Apache Cordova Media Plugin]{@link https://github.com/apache/cordova-plugin-media}) or "AAPI" ([HTML5 Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio}).
		Note: since Internet Explorer 9 works better with SM2 than with AAPI, if it is detected then the default value will be: [ "WAAPI", "SM2", "ACMP", "AAPI" ]
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {array}
	 *  @default ["WAAPI", "AAPI", "ACMP", "SM2"]
	 */
	CB_AudioFileCache_PREFERRED_AUDIO_APIS:
	navigator.appVersion.indexOf("MSIE 9") === -1 ?
		[
			"WAAPI",		//HTML5 Web Audio API.
			"AAPI",			//HTML5 Audio API.
			"ACMP",			//Apache Cordova Media Plugin.
			"SM2"			//SoundManager 2.
		]
	:
	[ "WAAPI", "SM2", "ACMP", "AAPI" ], //IE9 have works better with SM2 than with AAPI.

	
	/**
	 * Array with the default preferred audio formats by order of preference. Used by {@link CB_AudioFileCache} and {@link CB_AudioDetector}.
		NOTE: some web clients do not support to specify codecs so it is better to also provide strings without codecs.
	 *  @memberof CB_Configuration.CrossBase
	 *	@constant
	 *  @type {array}
	 *  @default
	 */
	CB_AudioFileCache_PREFERRED_AUDIO_FORMATS:
	[
		'audio/ogg; codecs="vorbis"',		//audio/ogg with Vorbis codec.
		'audio/ogg; codecs="speex"',		//audio/ogg with Speex codec.
		'audio/ogg; codecs="flac"',			//audio/ogg with FLAC codec.
		'audio/ogg',						//audio/ogg is for .oga, .ogg.
		
		'audio/mpeg; codecs="mp3"',			//audio/mpeg with MP3 codec (?).
		'audio/mpeg',						//audio/mpeg is for .mp1, .mp2, .mp3, .mpg, .mpeg.
	
		'audio/mp4; codecs="mp4a.40.5"',	//audio/mp4 with mp4a.40.5 codec.
		'audio/mp4; codecs="mp4a.40.2"',	//audio/mp4 with mp4a.40.2 codec.
		'audio/mp4; codecs="mp4a.40.05"',	//audio/mp4 with mp4a.40.05 codec.
		'audio/mp4; codecs="mp4a.40.02"',	//audio/mp4 with mp4a.40.02 codec.
		'audio/mp4; codecs="mp4a.69"',		//audio/mp4 with mp4a.69 codec.
		'audio/mp4; codecs="mp4a.6B"',		//audio/mp4 with mp4a.6B codec.
		'audio/mp4; codecs="mp4a.67"',		//audio/mp4 with mp4a.67 codec.
		'audio/mp4; codecs="mp4a.a6"',		//audio/mp4 with mp4a.a6 codec.
		'audio/mp4; codecs="mp4a.a5"',		//audio/mp4 with mp4a.a5 codec.
		'audio/mp4; codecs="aac51"',		//audio/mp4 with aac51 codec.
		'audio/mp4; codecs="ac-3"',			//audio/mp4 with ac-3 codec.
		'audio/mp4; codecs="ec-3"',			//audio/mp4 with ec-3 codec.
		'audio/mp4',						//audio/mp4 is for .mp4, .m4a.
		
		'audio/aac; codecs="aac"',			//audio.aac with AAC codec (?).
		'audio/aac; codecs="mp4a.40.5"',	//audio/aac with mp4a.40.5 codec (?).
		'audio/aac; codecs="vorbis"',		//audio.aac with Vorbis codec (?).
		'audio/aac',						//audio/acc is for .aac.

		'audio/x-aac; codecs="aac"',
		'audio/x-aac',
		
		'audio/x-m4b; codecs="aac"',
		'audio/x-m4b',
		
		'audio/x-m4p; codecs="aac"',
		'audio/x-m4p',

		'audio/webm; codecs="vorbis"',		//audio/webm with Vorbis codec.
		'audio/webm',						//audio/webm is for .webm.

		'audio/3gpp; codecs="samr"',		//audio/3gpp with SAMR codec.
		'audio/3gpp',						//audio/3gpp is for .3gpp.
		
		'audio/wav; codecs="1"',			//audio/wav with 1 codec (?).
		'audio/wav',						//audio/wav is for .wav.
		
		'audio/x-wav; codecs="1"',			//audio/x-wav with 1 codec (?).
		'audio/x-wav',						//audio/x-wav is for .wav.

		'audio/x-pn-wav; codecs="1"',		//audio/x-pn-wav with 1 codec (?).
		'audio/x-pn-wav',					//audio/x-pn-wav is for .wav

		'audio/wave; codecs="1"',			//audio/wave with 1 codec (?).
		'audio/wave',						//audio/wave is for .wav.
		
		'audio/x-wave; codecs="1"',			//audio/x-wave with 1 codec (?).
		'audio/x-wave'						//audio/x-wave is for .wav.
	]
};


/**
 * URL for the proxy to prevent cross-domain issues through AJAX, used by {@link CB_Net.XHR.callProxy} function. Can be relative to the main script folder or not, depending on {@link CB_Configuration.CrossBase.CB_Net_XHR_PROXY_URL_RELATIVE}.
	<br />
	NOTE: Edit the "CB_proxy.config.php" file to configure the default proxy. Apart from configuring it, adding some security measures is highly recommended.
	Have in mind that, for safety reasons, the default proxy only allows to request the URLs defined in the "$allowedURLs" array in the "CB_proxy.config.php" file. Just edit it to allow other URLs.
 *  @memberof CB_Configuration.CrossBase
 *  @name CB_Net_XHR_PROXY_URL
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "net/proxy/CB_proxy.php"
 */
CB_Configuration[CB_BASE_NAME].CB_Net_XHR_PROXY_URL = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "net/proxy/CB_proxy.php";



CB_Configuration[CB_BASE_NAME].needsWAAPISimLastReturn = null; //Cache to return always the same result.
/**
 * Detects whether the web client needs [WAAPISim]{@link https://github.com/g200kg/WAAPISim} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsWAAPISim
 *  @function
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsWAAPISim = function()
{
	//If the last result is in the cache, we return again the same result:
	if (typeof(CB_Configuration[CB_BASE_NAME].needsWAAPISimLastReturn) !== "undefined" && CB_Configuration[CB_BASE_NAME].needsWAAPISimLastReturn !== null) { return CB_Configuration[CB_BASE_NAME].needsWAAPISimLastReturn; }
	//...otherwise (it is the first time), we calculate if we need it or not:
	else
	{
		var waapisimForceSim = window.waapisimForceSim || undefined;
		CB_Configuration[CB_BASE_NAME].needsWAAPISimLastReturn = //Note: copied from waapisim.js
			//TODO: see what IE versions are compatible.
			(navigator.appVersion.indexOf("MSIE 5") === -1 && navigator.appVersion.indexOf("MSIE 6") === -1 && navigator.appVersion.indexOf("MSIE 7") === -1 && navigator.appVersion.indexOf("MSIE 8") === -1 && navigator.appVersion.indexOf("MSIE 9") === -1)
			&&
			(
				typeof(waapisimForceSim) !== "undefined" && waapisimForceSim
				||
					(
						typeof(window.AudioContext) !== "undefined"
							&& typeof(window.AudioContext.prototype.createOscillator) === "undefined" //Be careful! Pale Moon browser does not have createOscillator method.
							&& (typeof(waapisimForceSimWhenLackOsc) === "undefined" || (typeof(waapisimForceSimWhenLackOsc) !== "undefined" && waapisimForceSimWhenLackOsc))
					)
				||
					(
						typeof(window.webkitAudioContext) !== "undefined"
							&& typeof(window.webkitAudioContext.prototype.createOscillator) === "undefined" //Be careful! Pale Moon browser does not have createOscillator method.
							&& (typeof(waapisimForceSimWhenLackOsc) === "undefined" || (typeof(waapisimForceSimWhenLackOsc) !== "undefined" && waapisimForceSimWhenLackOsc))
					)
				|| typeof(window.AudioContext) === "undefined" && typeof(window.webkitAudioContext) === "undefined"
			);
		return CB_Configuration[CB_BASE_NAME].needsWAAPISimLastReturn;
	}
}


CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn = null; //Cache to return always the same result.
CB_Configuration[CB_BASE_NAME]._supportsCanvasElement = null;
CB_Configuration[CB_BASE_NAME]._supportsCanvas = function()
{
	//If the last result is in the cache, we return again the same result:
	if (typeof(CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn) !== "undefined" && CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn !== null) { return CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn; }
	//...otherwise (it is the first time), we calculate if we need it or not:
	else
	{
		CB_Configuration[CB_BASE_NAME]._supportsCanvasElement = CB_Configuration[CB_BASE_NAME]._supportsCanvasElement || document.createElement("canvas");
		
		//If canvas is supported:
		if (typeof(CB_Configuration[CB_BASE_NAME]._supportsCanvasElement) !== "undefined" && CB_Configuration[CB_BASE_NAME]._supportsCanvasElement !== null)
		{
			if (typeof(CB_Configuration[CB_BASE_NAME]._supportsCanvasElement.getContext) !== "undefined" && CB_Configuration[CB_BASE_NAME]._supportsCanvasElement.getContext !== null)
			{
				try //Uses try-catch to avoid some problems with some web clients (as BeZilla / Bon Echo 2.0.0.22Pre on Haiku OS):
				{
					//If fillText exists:
					if (typeof(CB_Configuration[CB_BASE_NAME]._supportsCanvasElement.getContext("2d")) !== "undefined" && CB_Configuration[CB_BASE_NAME]._supportsCanvasElement.getContext("2d") !== null)
					{
						CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn = true; //Canvas is supported.
						return CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn;
					}
				} catch(E) { CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn = false; return CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn; }
			}
		}
		CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn = false; //If we arrived here, canvas is not supported.
		return CB_Configuration[CB_BASE_NAME]._supportsCanvasLastReturn;
	}
}


CB_Configuration[CB_BASE_NAME].needsCanboxLastReturn = null; //Cache to return always the same result.
/**
 * Detects whether the web client needs [Canbox]{@link https://github.com/robertinglin/CanBox} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsCanbox
 *  @function
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsCanbox = function()
{
	//If the last result is in the cache, we return again the same result:
	if (typeof(CB_Configuration[CB_BASE_NAME].needsCanboxLastReturn) !== "undefined" && CB_Configuration[CB_BASE_NAME].needsCanboxLastReturn !== null) { return CB_Configuration[CB_BASE_NAME].needsCanboxLastReturn; }
	//...otherwise (it is the first time), we calculate if we need it or not:
	else
	{
		//We need it only if canvas is not already supported by the web client (and it is not IE5/5.5 since it doesn't support Canbox):
		//CB_Configuration[CB_BASE_NAME].needsCanboxLastReturn = (typeof(document.createElement("canvas").getContext) === "undefined" && navigator.appVersion.indexOf("MSIE 5") === -1);
		CB_Configuration[CB_BASE_NAME].needsCanboxLastReturn = (!CB_Configuration[CB_BASE_NAME]._supportsCanvas() && navigator.appVersion.indexOf("MSIE 5") === -1);
		return CB_Configuration[CB_BASE_NAME].needsCanboxLastReturn;
	}
}


CB_Configuration[CB_BASE_NAME].needsExplorerCanvasLastReturn = null; //Cache to return always the same result.
/**
 * Detects whether the web client needs [ExplorerCanvas]{@link https://github.com/arv/explorercanvas} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsExplorerCanvas
 *  @function
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsExplorerCanvas = function()
{
	//If the last result is in the cache, we return again the same result:
	if (typeof(CB_Configuration[CB_BASE_NAME].needsExplorerCanvasLastReturn) !== "undefined" && CB_Configuration[CB_BASE_NAME].needsExplorerCanvasLastReturn !== null) { return CB_Configuration[CB_BASE_NAME].needsExplorerCanvasLastReturn; }
	//...otherwise (it is the first time), we calculate if we need it or not:
	else
	{
		//We need it only if canvas is not already supported by the web client and the web client is IE 6, 7, 8 or 9 (IE9 doesn't support canvas in quirks mode and IE5/5.5 doesn't support ExplorerCanvas):
		//CB_Configuration[CB_BASE_NAME].needsExplorerCanvasLastReturn = (typeof(document.createElement("canvas").getContext) === "undefined" && navigator.userAgent.indexOf('MSIE') !== -1 && (navigator.appVersion.indexOf("MSIE 6") !== -1 || navigator.appVersion.indexOf("MSIE 7") !== -1 || navigator.appVersion.indexOf("MSIE 8") !== -1 || navigator.appVersion.indexOf("MSIE 9") !== -1));
		CB_Configuration[CB_BASE_NAME].needsExplorerCanvasLastReturn = (!CB_Configuration[CB_BASE_NAME]._supportsCanvas() && navigator.userAgent.indexOf('MSIE') !== -1 && (navigator.appVersion.indexOf("MSIE 6") !== -1 || navigator.appVersion.indexOf("MSIE 7") !== -1 || navigator.appVersion.indexOf("MSIE 8") !== -1 || navigator.appVersion.indexOf("MSIE 9") !== -1));
		return CB_Configuration[CB_BASE_NAME].needsExplorerCanvasLastReturn;
	}
}


//CB_Configuration[CB_BASE_NAME].needsSLCanvasLastReturn = null; //Cache to return always the same result.
/**
 * Detects whether the web client needs [SLCanvas]{@link https://slcanvas.codeplex.com/} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsSLCanvas
 *  @function
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsSLCanvas = function()
{
	return !CB_Configuration[CB_BASE_NAME]._supportsCanvas();
	/*
	//If the last result is in the cache, we return again the same result:
	if (typeof(CB_Configuration[CB_BASE_NAME].needsSLCanvasLastReturn) !== "undefined" && CB_Configuration[CB_BASE_NAME].needsSLCanvasLastReturn !== null) { return CB_Configuration[CB_BASE_NAME].needsSLCanvasLastReturn; }
	//...otherwise (it is the first time), we calculate if we need it or not:
	else
	{
		//We need it only if canvas is not already supported by the web client:
		//CB_Configuration[CB_BASE_NAME].needsSLCanvasLastReturn = (typeof(document.createElement("canvas").getContext) === "undefined");// && navigator.appVersion.indexOf("MSIE 5") === -1);
		CB_Configuration[CB_BASE_NAME].needsSLCanvasLastReturn = !CB_Configuration[CB_BASE_NAME]._supportsCanvas();// && navigator.appVersion.indexOf("MSIE 5") === -1);
		return CB_Configuration[CB_BASE_NAME].needsSLCanvasLastReturn;
	}
	*/
}


CB_Configuration[CB_BASE_NAME].needsFlashCanvasLastReturn = null; //Cache to return always the same result.
/**
 * Detects whether the web client needs [FlashCanvas]{@link https://github.com/everlaat/flashcanvas} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsFlashCanvas
 *  @function
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsFlashCanvas = function()
{
	//If the last result is in the cache, we return again the same result:
	if (typeof(CB_Configuration[CB_BASE_NAME].needsFlashCanvasLastReturn) !== "undefined" && CB_Configuration[CB_BASE_NAME].needsFlashCanvasLastReturn !== null) { return CB_Configuration[CB_BASE_NAME].needsFlashCanvasLastReturn; }
	//...otherwise (it is the first time), we calculate if we need it or not:
	else
	{
		//We need it only if ActiveXObject is available (it has to be IE) and it is not compatible with canvas:
		CB_Configuration[CB_BASE_NAME].needsFlashCanvasLastReturn = (typeof(window.ActiveXObject) !== "undefined" && typeof(window.CanvasRenderingContext2D) === "undefined");
		return CB_Configuration[CB_BASE_NAME].needsFlashCanvasLastReturn;
	}
}


CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn = null; //Cache to return always the same result.
/**
 * Detects whether the web client needs [canvas-text]{@link https://github.com/PhenX/canvas-text} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsCanvasText
 *  @function
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsCanvasText = function()
{
	//If the last result is in the cache, we return again the same result:
	if (typeof(CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn) !== "undefined" && CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn !== null) { return CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn; }
	//...otherwise (it is the first time), we calculate if we need it or not:
	else
	{
		//CB_Configuration[CB_BASE_NAME]._supportsCanvasElement = CB_Configuration[CB_BASE_NAME]._supportsCanvasElement || document.createElement("canvas");
		
		//If canvas is supported:
		//if (typeof(CB_Configuration[CB_BASE_NAME]._supportsCanvasElement) !== "undefined" && CB_Configuration[CB_BASE_NAME]._supportsCanvasElement !== null)
		//{
			//if (typeof(CB_Configuration[CB_BASE_NAME]._supportsCanvasElement.getContext) !== "undefined" && CB_Configuration[CB_BASE_NAME]._supportsCanvasElement.getContext !== null)
			//{
				if (CB_Configuration[CB_BASE_NAME]._supportsCanvas())
				{
					try //Uses try-catch to avoid some problems with some web clients (as BeZilla / Bon Echo 2.0.0.22Pre on Haiku OS).
					{
						//If fillText exists:
						if (typeof(CB_Configuration[CB_BASE_NAME]._supportsCanvasElement.getContext("2d").fillText) !== "undefined" && CB_Configuration[CB_BASE_NAME]._supportsCanvasElement.getContext("2d").fillText !== null)
						{
							CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn = false; //We don't need canvas-text.
							return CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn;
						}
						else { CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn = true; return CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn; }
					} catch(E) { CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn = true; return CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn; }
				}
			//}
		//}
		CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn = false;
		return CB_Configuration[CB_BASE_NAME].needsCanvasTextLastReturn;
	}
}


/**
 * Detects whether the web client needs [timbre.js]{@link https://mohayonao.github.io/timbre.js/} (including [subcollider.js]{@link https://github.com/mohayonao/subcollider}) or not.
 *  @function
 *  @memberof CB_Configuration.CrossBase
 *  @name needsTimbreJS
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsTimbreJS = function()
{
	//TODO: see what IE versions are compatible.
	return (navigator.appVersion.indexOf("MSIE 5") === -1 && navigator.appVersion.indexOf("MSIE 6") === -1 && navigator.appVersion.indexOf("MSIE 7") === -1 && navigator.appVersion.indexOf("MSIE 8") === -1 && navigator.appVersion.indexOf("MSIE 9") === -1);
}


/**
 * Detects whether the web client needs [jsfx]{@link https://github.com/loov/jsfx} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsJsfx
 *  @function
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsJsfx = function()
{
	//TODO: see what IE versions are compatible.
	return (navigator.appVersion.indexOf("MSIE 5") === -1 && navigator.appVersion.indexOf("MSIE 6") === -1 && navigator.appVersion.indexOf("MSIE 7") === -1 && navigator.appVersion.indexOf("MSIE 8") === -1 && navigator.appVersion.indexOf("MSIE 9") === -1);
}


/**
 * Detects whether the web client needs [Pressure.js]{@link https://pressurejs.com/} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsPressureJS
 *  @function
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsPressureJS= function()
{
	//TODO: see what IE versions are compatible.
	return (navigator.appVersion.indexOf("MSIE 5") === -1 && navigator.appVersion.indexOf("MSIE 6") === -1 && navigator.appVersion.indexOf("MSIE 7") === -1 && navigator.appVersion.indexOf("MSIE 8") === -1 && navigator.appVersion.indexOf("MSIE 9") === -1);
}


/**
 * Detects whether the web client needs [Hammer.js]{@link http://hammerjs.github.io/} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsHammerJS
 *  @function
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsHammerJS = function()
{
	//TODO: see what IE versions are compatible.
	return (navigator.appVersion.indexOf("MSIE 5") === -1 && navigator.appVersion.indexOf("MSIE 6") === -1 && navigator.appVersion.indexOf("MSIE 7") === -1 && navigator.appVersion.indexOf("MSIE 8") === -1 && navigator.appVersion.indexOf("MSIE 9") === -1);
}


/**
 * Detects whether the web client needs [gamepad-plus]{@link https://github.com/MozVR/gamepad-plus} or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name needsGamepadPlus
 *  @function
 *  @returns {boolean}
 *  @todo Find a better way for this as old Firefox versions can only detect GamePad API support when the events are fired, so we cannot relay on navigator.getGamepads/navigator.webkitGetGamepads/navigator.webkitGamepads.
 */
CB_Configuration[CB_BASE_NAME].needsGamepadPlus = function()
{
	//TODO: Find a better way for this as old Firefox versions can only detect GamePad API support when the events are fired, so we cannot relay on navigator.getGamepads/navigator.webkitGetGamepads/navigator.webkitGamepads.
	return !!(typeof(navigator) === "object" && navigator !== null && (navigator.getGamepads || navigator.webkitGetGamepads || navigator.webkitGamepads));
}


/**
 * Detects whether the web client needs [NoSleep.js]{@link https://github.com/richtr/NoSleep.js} or not.
 *  @function
 *  @memberof CB_Configuration.CrossBase
 *  @name needsSleepJS
 *  @returns {boolean}
 */
CB_Configuration[CB_BASE_NAME].needsSleepJS = function()
{
	return (navigator.appVersion.indexOf("MSIE 5") === -1 && navigator.appVersion.indexOf("MSIE 6") === -1 && navigator.appVersion.indexOf("MSIE 7") === -1 && navigator.appVersion.indexOf("MSIE 8") === -1);
}



//SockJS parameters:
/**
 * Directory that contains the [SockJS library]{@link https://github.com/sockjs/sockjs-client/} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name SOCKJS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "net/sockets/SockJS/"
 */
CB_Configuration[CB_BASE_NAME].SOCKJS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "net/sockets/SockJS/";


/**
 * The script file path for the [SockJS library]{@link https://github.com/sockjs/sockjs-client/}. As the newer [SockJS library]{@link https://github.com/sockjs/sockjs-client/} versions do not work in old Internet Explorer versions (6, 7 or 8), if they are detected it will use the [SockJS library]{@link https://github.com/sockjs/sockjs-client/} 0.3.4 version instead.
 *  @memberof CB_Configuration.CrossBase
 *  @name SOCKJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration[CB_BASE_NAME].SOCKJS_PATH} + SOCKJS_SCRIPT_FILE, where "SOCKJS_SCRIPT_FILE" is sockjs-0.3.4.min.js (SockJS 0.3.4), sockjs-1.1.1.min.js (SockJS 1.1.1) or sockjs.min.js (last version) depending on the client detected.
 */
CB_Configuration[CB_BASE_NAME].SOCKJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].SOCKJS_PATH;
if (navigator.appVersion.indexOf("MSIE 5") !== -1 || navigator.appVersion.indexOf("MSIE 6") !== -1 || navigator.appVersion.indexOf("MSIE 7") !== -1 || navigator.appVersion.indexOf("MSIE 8") !== -1) { CB_Configuration[CB_BASE_NAME].SOCKJS_PATH_SCRIPT_FILE += "sockjs-0.3.4.min.js"; }
else if (navigator.appVersion.indexOf("MSIE 9") !== -1) { CB_Configuration[CB_BASE_NAME].SOCKJS_PATH_SCRIPT_FILE += "sockjs-1.1.1.min.js"; }
else { CB_Configuration[CB_BASE_NAME].SOCKJS_PATH_SCRIPT_FILE += "sockjs.min.js"; }

	
//Intel XDK parameters:
/**
 * Defines whether to load or not intelxdk.js (used by [Intel XDK]{@link https://en.wikipedia.org/wiki/Intel_XDK}).
 *  @memberof CB_Configuration.CrossBase
 *  @name INTELXDKJS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].INTELXDKJS_LOAD = false; //CB_Configuration[CB_BASE_NAME].needsIntelXDKJS();

/**
 * Directory that contains the "intelxdk.js" file (used by [Intel XDK]{@link https://en.wikipedia.org/wiki/Intel_XDK}).
 *  @memberof CB_Configuration.CrossBase
 *  @name INTELXDKJS_PATH
 *	@constant
 *  @type {string}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].INTELXDKJS_PATH = "../";

/**
 * The script file path for intelxdk.js (used by [Intel XDK]{@link https://en.wikipedia.org/wiki/Intel_XDK}).
 *  @memberof CB_Configuration.CrossBase
 *  @name INTELXDKJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.INTELXDKJS_PATH} + "intelxdk.js"
 */
CB_Configuration[CB_BASE_NAME].INTELXDKJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].INTELXDKJS_PATH + "intelxdk.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.INTELXDKJS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name INTELXDKJS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].INTELXDKJS_PATH_ABSOLUTE = false;

/**
 * Defines whether to try to load or not init-dev.js (used by [Intel XDK]{@link https://en.wikipedia.org/wiki/Intel_XDK}).
	If set to true, the checker defined at {@link CB_Configuration.CrossBase.INTELXDK_INITDEVJS_LOAD_CHECKER} will finally decide whether to load it or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name INTELXDK_INITDEVJS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].INTELXDK_INITDEVJS_LOAD = false; //CB_Configuration[CB_BASE_NAME].needsIntelXDKJS();

/**
 * Callback checker to determine whether init-dev.js (used by [Intel XDK]{@link https://en.wikipedia.org/wiki/Intel_XDK}) is needed or not. Requires {@link CB_Configuration.CrossBase.INTELXDK_INITDEVJS_LOAD} set to true.
 *  @memberof CB_Configuration.CrossBase
 *  @name INTELXDK_INITDEVJS_LOAD_CHECKER
 *	@constant
 *  @type {CB_Modules.neededFile_LOAD_CHECKER}
 *  @default false
 */
CB_Configuration[CB_BASE_NAME].INTELXDK_INITDEVJS_LOAD_CHECKER = false; //function(currentPath, info) { return (typeof(dev) === "undefined" || dev === null || typeof(dev.initDeviceReady) !== "function"); };

/**
 * Directory that contains the "init-dev.js" (used by [Intel XDK]{@link https://en.wikipedia.org/wiki/Intel_XDK}).
 *  @memberof CB_Configuration.CrossBase
 *  @name INTELXDK_INITDEVJS_PATH
 *	@constant
 *  @type {string}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].INTELXDK_INITDEVJS_PATH = "../xdk/";

/**
 * The script file path for init-dev.js file (used by [Intel XDK]{@link https://en.wikipedia.org/wiki/Intel_XDK}).
 *  @memberof CB_Configuration.CrossBase
 *  @name INTELXDK_INITDEVJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.INTELXDK_INITDEVJS_PATH} + "init-dev.js"
 */
CB_Configuration[CB_BASE_NAME].INTELXDK_INITDEVJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].INTELXDK_INITDEVJS_PATH + "init-dev.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.INTELXDK_INITDEVJS_PATH} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name INTELXDK_INITDEVJS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].INTELXDK_INITDEVJS_PATH_ABSOLUTE = false;


//PhoneGap parameters:
/**
 * Defines whether to load or not phonegap.js (used by [Adobe PhoneGap]{@link https://phonegap.com/}).
 *  @memberof CB_Configuration.CrossBase
 *  @name PHONEGAPJS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].PHONEGAPJS_LOAD = false; //CB_Configuration[CB_BASE_NAME].needsPhoneGapJS();

/**
 * Directory that contains the "phonegap.js" (used by [Adobe PhoneGap]{@link https://phonegap.com/}) file.
 *  @memberof CB_Configuration.CrossBase
 *  @name PHONEGAPJS_PATH
 *	@constant
 *  @type {string}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].PHONEGAPJS_PATH = "../";

/**
 * The script file path for phonegap.js (used by [Adobe PhoneGap]{@link https://phonegap.com/}).
 *  @memberof CB_Configuration.CrossBase
 *  @name PHONEGAPJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.PHONEGAPJS_PATH} + "phonegap.js"
 */
CB_Configuration[CB_BASE_NAME].PHONEGAPJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].PHONEGAPJS_PATH + "phonegap.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.PHONEGAPJS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name PHONEGAPJS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].PHONEGAPJS_PATH_ABSOLUTE = false;


//Apache Cordova parameters:
/**
 * Defines whether to try to load or not cordova.js (used by [Apache Cordova]{@link https://cordova.apache.org/}). It should not be loaded together with phonegap.js, normally.
	If set to true, the checker defined at {@link CB_Configuration.CrossBase.CORDOVAJS_LOAD_CHECKER} will finally decide whether to load it or not.
 *  @memberof CB_Configuration.CrossBase
 *  @name CORDOVAJS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default !{@link CB_Configuration.CrossBase.PHONEGAPJS_LOAD}
 */
CB_Configuration[CB_BASE_NAME].CORDOVAJS_LOAD = !CB_Configuration[CB_BASE_NAME].PHONEGAPJS_LOAD && window.location && window.location.protocol !== "http:" && window.location.protocol !== "https:"; //CB_Configuration[CB_BASE_NAME].needsCordovaJS();

/**
 * Callback checker to determine whether cordova.js (used by [Apache Cordova]{@link https://cordova.apache.org/}) is needed or not. Requires {@link CB_Configuration.CrossBase.CORDOVAJS_LOAD} set to true.
 *  @memberof CB_Configuration.CrossBase
 *  @name CORDOVAJS_LOAD_CHECKER
 *	@constant
 *  @type {CB_Modules.neededFile_LOAD_CHECKER}
 *  @default function(currentPath, info) { return (typeof(window.cordova) === "undefined"); }
 */
CB_Configuration[CB_BASE_NAME].CORDOVAJS_LOAD_CHECKER = function(currentPath, info) { return (typeof(window.cordova) === "undefined"); };

/**
 * Directory that contains the "cordova.js" file (used by [Apache Cordova]{@link https://cordova.apache.org/}).
 *  @memberof CB_Configuration.CrossBase
 *  @name CORDOVAJS_PATH
 *	@constant
 *  @type {string}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].CORDOVAJS_PATH = "../";

/**
 * The script file path for the cordova.js file (used by [Apache Cordova]{@link https://cordova.apache.org/}).
 *  @memberof CB_Configuration.CrossBase
 *  @name CORDOVAJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.CORDOVAJS_PATH} + "cordova.js"
 */
CB_Configuration[CB_BASE_NAME].CORDOVAJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].CORDOVAJS_PATH + "cordova.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.CORDOVAJS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name CORDOVAJS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].CORDOVAJS_PATH_ABSOLUTE = false;


//localStorage polyfill parameters:
/**
 * Defines whether to load or not [localStorage polyfill]{@link https://github.com/mortzdk/localStorage}.
 *  @memberof CB_Configuration.CrossBase
 *  @name LOCALSTORAGE_POLYFILL_LOAD
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_LOAD = true;

/**
 * Directory that contains the [localStorage polyfill]{@link https://github.com/mortzdk/localStorage} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name LOCALSTORAGE_POLYFILL_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "general/localStorage/"
 */
CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "general/localStorage/";

/**
 * Directory that contains the SWF for [localStorage polyfill]{@link https://github.com/mortzdk/localStorage}. The value of the "scriptPathGiven" parameter will be attached at the beginning automatically. Belongs to the "swfURL" parameter (URL "GET" parameter) of the library when the localStorage script file is attached.
 *  @memberof CB_Configuration.CrossBase
 *  @name LOCALSTORAGE_POLYFILL_PATH_SWF
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.LOCALSTORAGE_POLYFILL_PATH} + "localStorage.swf"
 */
CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_PATH_SWF_FILE = CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_PATH + "localStorage.swf";
//CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_PATH_SWF_FILE = "localStorage.swf";

/**
 * The script file path for [localStorage polyfill]{@link https://github.com/mortzdk/localStorage}.
 *  @memberof CB_Configuration.CrossBase
 *  @name LOCALSTORAGE_POLYFILL_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.LOCALSTORAGE_POLYFILL_PATH} + "localStorage.min.js?swfURL=" + CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_PATH_SWF_FILE
 */
CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_PATH + "localStorage.min.js?swfURL=" + CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_PATH_SWF_FILE;

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.LOCALSTORAGE_POLYFILL_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name LOCALSTORAGE_POLYFILL_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].LOCALSTORAGE_POLYFILL_PATH_ABSOLUTE = false;


//WAAPISim parameters:
/**
 * Defines whether to load or not [WAAPISim]{@link https://github.com/g200kg/WAAPISim}.
 *  @memberof CB_Configuration.CrossBase
 *  @name WAAPISIM_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.WAAPI_EMULATION_ALLOWED} && {@link CB_Configuration.CrossBase.needsWAAPISim}()
 */
CB_Configuration[CB_BASE_NAME].WAAPISIM_LOAD = CB_Configuration[CB_BASE_NAME].WAAPI_EMULATION_ALLOWED && CB_Configuration[CB_BASE_NAME].needsWAAPISim();


/**
 * Directory that contains the [WAAPISim]{@link https://github.com/g200kg/WAAPISim} files (script and SWF).
 *  @memberof CB_Configuration.CrossBase
 *  @name WAAPISIM_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/audio/WAAPISim/"
 */
CB_Configuration[CB_BASE_NAME].WAAPISIM_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/audio/WAAPISim/";

/**
 * The script file path for the [WAAPISim]{@link https://github.com/g200kg/WAAPISim} script file.
 *  @memberof CB_Configuration.CrossBase
 *  @name WAAPISIM_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.WAAPISIM_PATH} + "waapisim.min.js"
 */
CB_Configuration[CB_BASE_NAME].WAAPISIM_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].WAAPISIM_PATH + "waapisim.min.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.WAAPISIM_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name WAAPISIM_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].WAAPISIM_PATH_ABSOLUTE = false;


//timbre.js (including subcollider.js) parameters:
/**
 * Defines whether to load or not [timbre.js]{@link https://mohayonao.github.io/timbre.js/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name TIMBREJS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsTimbreJS}()
 */
CB_Configuration[CB_BASE_NAME].TIMBREJS_LOAD = CB_Configuration[CB_BASE_NAME].needsTimbreJS();

/**
 * Directory that contains the [timbre.js]{@link https://mohayonao.github.io/timbre.js/} files (script and SWF).
 *  @memberof CB_Configuration.CrossBase
 *  @name TIMBREJS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/audio/timbre.js/"
 */
CB_Configuration[CB_BASE_NAME].TIMBREJS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/audio/timbre.js/";

/**
 * The script file path for [timbre.js]{@link https://mohayonao.github.io/timbre.js/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name TIMBREJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.TIMBREJS_PATH} + "timbre.js"
 */
CB_Configuration[CB_BASE_NAME].TIMBREJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].TIMBREJS_PATH + "timbre.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.TIMBREJS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name TIMBREJS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].TIMBREJS_PATH_ABSOLUTE = false;

/**
 * Defines whether to load or not [subcollider.js]{@link https://github.com/mohayonao/subcollider}.
 *  @memberof CB_Configuration.CrossBase
 *  @name SUBCOLLIDERJS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.TIMBREJS_LOAD}
 */
CB_Configuration[CB_BASE_NAME].SUBCOLLIDERJS_LOAD = CB_Configuration[CB_BASE_NAME].TIMBREJS_LOAD;

/**
 * Directory that contains the [subcollider.js]{@link https://github.com/mohayonao/subcollider} script.
 *  @memberof CB_Configuration.CrossBase
 *  @name SUBCOLLIDERJS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.TIMBREJS_PATH} + "subcollider/"
 */
CB_Configuration[CB_BASE_NAME].SUBCOLLIDERJS_PATH = CB_Configuration[CB_BASE_NAME].TIMBREJS_PATH + "subcollider/";

/**
 * The script file path for [subcollider.js]{@link https://github.com/mohayonao/subcollider}.
 *  @memberof CB_Configuration.CrossBase
 *  @name SUBCOLLIDERJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SUBCOLLIDERJS_PATH} + "subcollider.js"
 */
CB_Configuration[CB_BASE_NAME].SUBCOLLIDERJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].SUBCOLLIDERJS_PATH + "subcollider.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.SUBCOLLIDERJS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name SUBCOLLIDERJS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].SUBCOLLIDERJS_PATH_ABSOLUTE = false;


//Band.js parameters:
/**
 * Defines whether to load or not [Band.js]{@link https://github.com/meenie/band.js/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name BANDJS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default typeof(window.AudioContext) !== "undefined" || typeof(window.webkitAudioContext) !== "undefined"
 */
CB_Configuration[CB_BASE_NAME].BANDJS_LOAD = typeof(window.AudioContext) !== "undefined" || typeof(window.webkitAudioContext) !== "undefined";

/**
 * Directory that contains the [Band.js]{@link https://github.com/meenie/band.js/} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name BANDJS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/audio/band.js/"
 */
CB_Configuration[CB_BASE_NAME].BANDJS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/audio/band.js/";

/**
 * The script file path for [Band.js]{@link https://github.com/meenie/band.js/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name BANDJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.BANDJS_PATH} + "band.min.js"
 */
CB_Configuration[CB_BASE_NAME].BANDJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].BANDJS_PATH + "band.min.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.BANDJS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name BANDJS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].BANDJS_PATH_ABSOLUTE = false;


//SoundManager 2 parameters:
/**
 * Defines whether to load or not [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name SM2_LOAD
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].SM2_LOAD = true;

/**
 * Directory that contains the [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name SM2_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/audio/soundmanager2/"
 */
CB_Configuration[CB_BASE_NAME].SM2_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/audio/soundmanager2/";

/**
 * The script file path for [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name SM2_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SM2_PATH} + "script/soundmanager2-nodebug-jsmin.js"
 */
CB_Configuration[CB_BASE_NAME].SM2_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].SM2_PATH + "script/soundmanager2-nodebug-jsmin.js";

/**
 * Directory that contains the SWF's for [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}. The value of the "scriptPathGiven" parameter will be attached at the beginning automatically. Belongs to the "url" parameter of the library when [soundManager.setup]{@link http://www.schillmania.com/projects/soundmanager2/doc/#soundmanager-setup} function is called. More information: http://www.schillmania.com/projects/soundmanager2/doc/#soundmanager-url
 *  @memberof CB_Configuration.CrossBase
 *  @name SM2_PATH_SWF
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SM2_PATH} + "swf/"
 */
CB_Configuration[CB_BASE_NAME].SM2_PATH_SWF = CB_Configuration[CB_BASE_NAME].SM2_PATH + "swf/";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.SM2_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name SM2_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].SM2_PATH_ABSOLUTE = false;

/**
 * Object with the required formats for [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}. If the format is required and the web client doesn't support it, [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/} will use [Flash]{@link https://en.wikipedia.org/wiki/Adobe_Flash_Player}. More information: http://www.schillmania.com/projects/soundmanager2/doc/#soundmanager-audioformats
 *  @memberof CB_Configuration.CrossBase
 *  @name SM2_AUDIO_FORMATS_REQUIRED
 *  @constant
 *  @type {Object}
 *  @property {boolean} mp3=false - Defines MP3 format as required.
 *  @property {boolean} mp4=false - Defines MP4 format as required.
 *  @property {boolean} ogg=false - Defines OGG format as required.
 *  @property {boolean} opus=false - Defines OPUS format as required.
 *  @property {boolean} wav=false - Defines WAV format as required.
 *  @default
 */
CB_Configuration[CB_BASE_NAME].SM2_AUDIO_FORMATS_REQUIRED = { "mp3" : false, "mp4" : false, "ogg" : false, "opus" : false, "wav" : false };

/**
 * Defines whether to use or not high performance mode in [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/} (may cause a flash object to be visible). Belongs to the "useHighPerformance" parameter of the library when [soundManager.setup]{@link http://www.schillmania.com/projects/soundmanager2/doc/#soundmanager-setup} function is called. More information: http://www.schillmania.com/projects/soundmanager2/doc/#soundmanager-highperformance
 *  @memberof CB_Configuration.CrossBase
 *  @name SM2_USE_HIGH_PERFORMANCE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].SM2_USE_HIGH_PERFORMANCE = true;

/**
 * Milliseconds to wait after loading [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/} to define it as not supported if there is no response. Belongs to the "flashLoadTimeout" parameter of the library when [soundManager.setup]{@link http://www.schillmania.com/projects/soundmanager2/doc/#soundmanager-setup} function is called. More information: http://www.schillmania.com/projects/soundmanager2/doc/#soundmanager-flashloadtimeout
 *  @memberof CB_Configuration.CrossBase
 *  @name SM2_TIMEOUT_MS
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].SM2_TIMEOUT_MS = 6000;

//CB_Configuration[CB_BASE_NAME].SM2_USE_FAST_POLLING = true; //Defines whether to use fast polling (useFastPolling) in [SoundManager 2]{@link http://schillmania.com/projects/soundmanager2/}.


//jsfx parameters:
/**
 * Defines whether to load or not [jsfx]{@link https://github.com/loov/jsfx}.
 *  @memberof CB_Configuration.CrossBase
 *  @name JSFX_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsJsfx}()
 */
CB_Configuration[CB_BASE_NAME].JSFX_LOAD = CB_Configuration[CB_BASE_NAME].needsJsfx();

/**
 * Directory that contains the [jsfx]{@link https://github.com/loov/jsfx} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name JSFX_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/audio/jsfx/"
 */
CB_Configuration[CB_BASE_NAME].JSFX_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/audio/jsfx/";

/**
 * The script file path for [jsfx]{@link https://github.com/loov/jsfx}.
 *  @memberof CB_Configuration.CrossBase
 *  @name JSFX_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.JSFX_PATH} + "jsfx.js"
 */
CB_Configuration[CB_BASE_NAME].JSFX_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].JSFX_PATH + "jsfx.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.JSFX_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name JSFX_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].JSFX_PATH_ABSOLUTE = false;


//NoSleep.js parameters:
/**
 * Defines whether to load or not [NoSleep.js]{@link https://github.com/richtr/NoSleep.js}.
 *  @memberof CB_Configuration.CrossBase
 *  @name NOSLEEP_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsSleepJS}()
 */
CB_Configuration[CB_BASE_NAME].NOSLEEP_LOAD = CB_Configuration[CB_BASE_NAME].needsSleepJS();

/**
 * Directory that contains the [NoSleep.js]{@link https://github.com/richtr/NoSleep.js} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name NOSLEEP_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/image/NoSleep/"
 */
CB_Configuration[CB_BASE_NAME].NOSLEEP_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/image/NoSleep/";

/**
 * The script file path for [NoSleep.js]{@link https://github.com/richtr/NoSleep.js}.
 *  @memberof CB_Configuration.CrossBase
 *  @name NOSLEEP_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.NOSLEEP_PATH} + "NoSleep.min.js"
 */
CB_Configuration[CB_BASE_NAME].NOSLEEP_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].NOSLEEP_PATH + "NoSleep.min.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.NOSLEEP_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name NOSLEEP_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].NOSLEEP_PATH_ABSOLUTE = false;


//Pressure.js parameters:
/**
 * Defines whether to load or not [Pressure.js]{@link https://pressurejs.com/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name PRESSUREJS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsPressureJS}()
 */
CB_Configuration[CB_BASE_NAME].PRESSUREJS_LOAD = CB_Configuration[CB_BASE_NAME].needsPressureJS();

/**
 * Directory that contains the [Pressure.js]{@link https://pressurejs.com/} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name PRESSUREJS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "input/pressure.js/"
 */
CB_Configuration[CB_BASE_NAME].PRESSUREJS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/pressure.js/";

/**
 * The script file path for [Pressure.js]{@link https://pressurejs.com/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name PRESSUREJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.PRESSUREJS_PATH} + "pressure.min.js"
 */
CB_Configuration[CB_BASE_NAME].PRESSUREJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].PRESSUREJS_PATH + "pressure.min.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.PRESSUREJS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name PRESSUREJS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].PRESSUREJS_PATH_ABSOLUTE = false;


//Hammer.js and Hammer Time parameters:
/**
 * Defines whether to load or not [Hammer.js]{@link http://hammerjs.github.io/} and [Hammer Time]{@link https://github.com/hammerjs/hammer-time}.
 *  @memberof CB_Configuration.CrossBase
 *  @name HAMMERJS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsHammerJS}()
 */
CB_Configuration[CB_BASE_NAME].HAMMERJS_LOAD = CB_Configuration[CB_BASE_NAME].needsHammerJS();

/**
 * Directory that contains the [Hammer.js]{@link http://hammerjs.github.io/} and [Hammer Time]{@link https://github.com/hammerjs/hammer-time} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name HAMMERJS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "input/hammer.js/"
 */
CB_Configuration[CB_BASE_NAME].HAMMERJS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/hammer.js/";

/**
 * The script file path for [Hammer.js]{@link http://hammerjs.github.io/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name HAMMERJS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.HAMMERJS_PATH} + "hammer.min.js"
 */
CB_Configuration[CB_BASE_NAME].HAMMERJS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].HAMMERJS_PATH + "hammer.min.js";

/**
 * The script file path for [Hammer Time]{@link https://github.com/hammerjs/hammer-time}.
 *  @memberof CB_Configuration.CrossBase
 *  @name HAMMERJS_HAMMER_TIME_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.HAMMERJS_PATH} + "hammer-time/hammer-time.min.js"
 */
CB_Configuration[CB_BASE_NAME].HAMMERJS_HAMMER_TIME_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].HAMMERJS_PATH + "hammer-time/hammer-time.min.js";

/**
 * Defines whether the paths defined in {@link CB_Configuration.CrossBase.HAMMERJS_PATH_SCRIPT_FILE} and {@link CB_Configuration.CrossBase.HAMMERJS_HAMMER_TIME_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name HAMMERJS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].HAMMERJS_PATH_ABSOLUTE = false;


//wii-js parameters:
/**
 * Defines whether to load or not [wii-js]{@link https://github.com/ryanmcgrath/wii-js}.
 *  @memberof CB_Configuration.CrossBase
 *  @name WII_JS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].WII_JS_LOAD = true;

/**
 * Directory that contains the [wii-js]{@link https://github.com/ryanmcgrath/wii-js} script.
 *  @memberof CB_Configuration.CrossBase
 *  @name WII_JS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "input/controllers/wii-js/"
 */
CB_Configuration[CB_BASE_NAME].WII_JS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/controllers/wii-js/";

/**
 * The script file path for [wii-js]{@link https://github.com/ryanmcgrath/wii-js}.
 *  @memberof CB_Configuration.CrossBase
 *  @name WII_JS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.WII_JS_PATH} + "wii.min.js"
 */
CB_Configuration[CB_BASE_NAME].WII_JS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].WII_JS_PATH + "wii.min.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.WII_JS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name WII_JS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].WII_JS_PATH_ABSOLUTE = false;


//gamepad-plus parameters:
/**
 * Defines whether to load or not [gamepad-plus]{@link https://github.com/MozVR/gamepad-plus}.
 *  @memberof CB_Configuration.CrossBase
 *  @name GAMEPAD_PLUS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsGamepadPlus}()
 */
CB_Configuration[CB_BASE_NAME].GAMEPAD_PLUS_LOAD = CB_Configuration[CB_BASE_NAME].needsGamepadPlus();

/**
 * Directory that contains the [gamepad-plus]{@link https://github.com/MozVR/gamepad-plus} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name GAMEPAD_PLUS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "input/controllers/gamepad-plus/"
 */
CB_Configuration[CB_BASE_NAME].GAMEPAD_PLUS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "input/controllers/gamepad-plus/";

/**
 * The script file path for [gamepad-plus]{@link https://github.com/MozVR/gamepad-plus}.
 *  @memberof CB_Configuration.CrossBase
 *  @name GAMEPAD_PLUS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.GAMEPAD_PLUS_PATH} + "gamepads.js"
 */
CB_Configuration[CB_BASE_NAME].GAMEPAD_PLUS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].GAMEPAD_PLUS_PATH + "gamepads.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.GAMEPAD_PLUS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name GAMEPAD_PLUS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].GAMEPAD_PLUS_PATH_ABSOLUTE = false;


//Canbox parameters:
/**
 * Defines whether to load or not [Canbox]{@link https://github.com/robertinglin/CanBox}.
 *  @memberof CB_Configuration.CrossBase
 *  @name CANBOX_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsCanbox}()
 */
CB_Configuration[CB_BASE_NAME].CANBOX_LOAD = CB_Configuration[CB_BASE_NAME].needsCanbox();

/**
 * Directory that contains the [Canbox]{@link https://github.com/robertinglin/CanBox} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name CANBOX_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/image/canvas/canbox/"
 */
CB_Configuration[CB_BASE_NAME].CANBOX_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/image/canvas/canbox/";

/**
 * The script file path for [Canbox]{@link https://github.com/robertinglin/CanBox}.
 *  @memberof CB_Configuration.CrossBase
 *  @name CANBOX_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.CANBOX_PATH} + "canbox.0.2.1.js"
 */
CB_Configuration[CB_BASE_NAME].CANBOX_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].CANBOX_PATH + "canbox.0.2.1.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.CANBOX_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name CANBOX_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].CANBOX_PATH_ABSOLUTE = false;


//FlashCanvas parameters:
/**
 * Defines whether to load or not [FlashCanvas]{@link https://github.com/everlaat/flashcanvas}.
 *  @memberof CB_Configuration.CrossBase
 *  @name FLASHCANVAS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsFlashCanvas}()
 */
CB_Configuration[CB_BASE_NAME].FLASHCANVAS_LOAD = CB_Configuration[CB_BASE_NAME].needsFlashCanvas();

/**
 * Defines whether to allow to run [FlashCanvas]{@link https://github.com/everlaat/flashcanvas} locally or not (because the ".swf" file folder needs to be added to 'trusted files' in Flash global configuration to work locally in some operating systems).
 *  @memberof CB_Configuration.CrossBase
 *  @name FLASHCANVAS_ALLOW_RUN_LOCALLY_DEFAULT
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].FLASHCANVAS_ALLOW_RUN_LOCALLY_DEFAULT = false;

/**
 * Directory that contains the [FlashCanvas]{@link https://github.com/everlaat/flashcanvas} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name FLASHCANVAS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/image/canvas/FlashCanvas/pro/"
 */
CB_Configuration[CB_BASE_NAME].FLASHCANVAS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/image/canvas/FlashCanvas/pro/";

/**
 * The script file path for [FlashCanvas]{@link https://github.com/everlaat/flashcanvas}.
 *  @memberof CB_Configuration.CrossBase
 *  @name FLASHCANVAS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.FLASHCANVAS_PATH} + "bin/flashcanvas.js"
 */
CB_Configuration[CB_BASE_NAME].FLASHCANVAS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].FLASHCANVAS_PATH + "bin/flashcanvas.js";

/**
 * Directory that contains the SWF's for [FlashCanvas]{@link https://github.com/everlaat/flashcanvas}. The value of the "scriptPathGiven" parameter will be attached at the beginning automatically. Belongs to the "swfPath" parameter of the library set on the "window.FlashCanvasOptions" object. More information: https://web.archive.org/web/20180604011002/http://flashcanvas.net/docs/config
 *  @memberof CB_Configuration.CrossBase
 *  @name FLASHCANVAS_PATH_SWF
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.FLASHCANVAS_PATH} + "bin/"
 */
CB_Configuration[CB_BASE_NAME].FLASHCANVAS_PATH_SWF = CB_Configuration[CB_BASE_NAME].FLASHCANVAS_PATH + "bin/";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.FLASHCANVAS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name FLASHCANVAS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].FLASHCANVAS_PATH_ABSOLUTE = false;

/**
 * Disables the context menu when the right mouse button is clicked on any canvas using [FlashCanvas]{@link https://github.com/everlaat/flashcanvas}' SWF. Belongs to the "disableContextMenu" parameter of the library set on the "window.FlashCanvasOptions" object. More information: https://web.archive.org/web/20180604011002/http://flashcanvas.net/docs/config
 *  @memberof CB_Configuration.CrossBase
 *  @name FLASHCANVAS_DISABLE_CONTEXT_MENU
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].FLASHCANVAS_DISABLE_CONTEXT_MENU = false;

/**
 * Uses turbo mode to speed up [FlashCanvas]{@link https://github.com/everlaat/flashcanvas}. Belongs to the "turbo" parameter of the library set on the "window.FlashCanvasOptions" object. More information: https://web.archive.org/web/20180604011002/http://flashcanvas.net/docs/config
 *  @memberof CB_Configuration.CrossBase
 *  @name FLASHCANVAS_TURBO_MODE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].FLASHCANVAS_TURBO_MODE = true;

/**
 * Maximum size for the image cache used by [FlashCanvas]{@link https://github.com/everlaat/flashcanvas}. Belongs to the "imageCacheSize" parameter of the library set on the "window.FlashCanvasOptions" object. More information: https://web.archive.org/web/20180604011002/http://flashcanvas.net/docs/config
 *  @memberof CB_Configuration.CrossBase
 *  @name FLASHCANVAS_IMAGE_CACHE_SIZE
 *	@constant
 *  @type {integer}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].FLASHCANVAS_IMAGE_CACHE_SIZE = 100;


//SLCanvas parameters:
/**
 * Defines whether to load or not [SLCanvas]{@link https://slcanvas.codeplex.com/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name SLCANVAS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsSLCanvas}()
 */
CB_Configuration[CB_BASE_NAME].SLCANVAS_LOAD = CB_Configuration[CB_BASE_NAME].needsSLCanvas();

/**
 * Directory that contains the [SLCanvas]{@link https://slcanvas.codeplex.com/} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name SLCANVAS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/image/canvas/slcanvas/"
 */
CB_Configuration[CB_BASE_NAME].SLCANVAS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/image/canvas/slcanvas/";

/**
 * The script file path for [SLCanvas]{@link https://slcanvas.codeplex.com/}.
 *  @memberof CB_Configuration.CrossBase
 *  @name SLCANVAS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SLCANVAS_PATH} + "slcanvas.js"
 */
CB_Configuration[CB_BASE_NAME].SLCANVAS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].SLCANVAS_PATH + "slcanvas.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.SLCANVAS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name SLCANVAS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].SLCANVAS_PATH_ABSOLUTE = false;


//ExplorerCanvas parameters:
/**
 * Defines whether to load or not [ExplorerCanvas]{@link https://github.com/arv/explorercanvas}.
 *  @memberof CB_Configuration.CrossBase
 *  @name EXCANVAS_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsExplorerCanvas}()
 */
CB_Configuration[CB_BASE_NAME].EXCANVAS_LOAD = CB_Configuration[CB_BASE_NAME].needsExplorerCanvas();

/**
 * Directory that contains the [ExplorerCanvas]{@link https://github.com/arv/explorercanvas} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name EXCANVAS_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/image/canvas/excanvas_with_canvas_text/"
 */
CB_Configuration[CB_BASE_NAME].EXCANVAS_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/image/canvas/excanvas_with_canvas_text/";

/**
 * The script file path for [ExplorerCanvas]{@link https://github.com/arv/explorercanvas}.
 *  @memberof CB_Configuration.CrossBase
 *  @name EXCANVAS_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.EXCANVAS_PATH} + "excanvas.js"
 */
CB_Configuration[CB_BASE_NAME].EXCANVAS_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].EXCANVAS_PATH + "excanvas.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.EXCANVAS_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name EXCANVAS_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].EXCANVAS_PATH_ABSOLUTE = false;
 

//canvas-text parameters:
/**
 * Defines whether to load or not [canvas-text]{@link https://github.com/PhenX/canvas-text}.
 *  @memberof CB_Configuration.CrossBase
 *  @name CANVAS_TEXT_LOAD
 *	@constant
 *  @type {boolean}
 *  @default {@link CB_Configuration.CrossBase.needsCanvasText}()
 */
CB_Configuration[CB_BASE_NAME].CANVAS_TEXT_LOAD = CB_Configuration[CB_BASE_NAME].needsCanvasText();

/**
 * Directory that contains the [canvas-text]{@link https://github.com/PhenX/canvas-text} files.
 *  @memberof CB_Configuration.CrossBase
 *  @name CANVAS_TEXT_PATH
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.SCRIPT_PATH} + "audiovisual/image/canvas/excanvas_with_canvas_text/"
 */
CB_Configuration[CB_BASE_NAME].CANVAS_TEXT_PATH = CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/image/canvas/excanvas_with_canvas_text/";

/**
 * The script file path for [canvas-text]{@link https://github.com/PhenX/canvas-text}.
 *  @memberof CB_Configuration.CrossBase
 *  @name CANVAS_TEXT_PATH_SCRIPT_FILE
 *	@constant
 *  @type {string}
 *  @default {@link CB_Configuration.CrossBase.CANVAS_TEXT_PATH} + "canvas.text.js"
 */
CB_Configuration[CB_BASE_NAME].CANVAS_TEXT_PATH_SCRIPT_FILE = CB_Configuration[CB_BASE_NAME].CANVAS_TEXT_PATH + "canvas.text.js";

/**
 * Defines whether the path defined in {@link CB_Configuration.CrossBase.CANVAS_TEXT_PATH_SCRIPT_FILE} is either absolute or relative to the CrossBrowdy script path.
 *  @memberof CB_Configuration.CrossBase
 *  @name CANVAS_TEXT_PATH_ABSOLUTE
 *	@constant
 *  @type {boolean}
 *  @default
 */
CB_Configuration[CB_BASE_NAME].CANVAS_TEXT_PATH_ABSOLUTE = false;


//Applies the options set by the user (if any):
CB_applyOptions(CB_BASE_NAME, this);


//Module basic configuration:
CB_Modules.modules[CB_BASE_NAME] =
{
	//Name of the module:
	"name" : CB_BASE_NAME,
	//Status (UNKNOWN, UNLOADED, LOADING, LOADED, READY or FAILED):
	"status" : CB_Modules.STATUSES.UNLOADED,
	//Function to call as soon as the module is called (before loading its scripts):
	"onCall" : 
		function(scriptPathGiven)
		{
			if (CB_Configuration[CB_BASE_NAME].CB_Net_XHR_PROXY_URL_RELATIVE) { CB_Configuration[CB_BASE_NAME].CB_Net_XHR_PROXY_URL = scriptPathGiven + CB_Configuration[CB_BASE_NAME].CB_Net_XHR_PROXY_URL; }
			if (CB_Configuration[CB_BASE_NAME].FLASHCANVAS_LOAD) { CB_prepareFlashCanvas(scriptPathGiven); }
			CB_Modules.setStatus("CrossBase", CB_Modules.STATUSES.LOADED);
		},
	//Callback function to call when the module has been loaded successfully:
	"onLoad" :
		function(scriptPathGiven)
		{
			var checkReadyFunction =
				function()
				{
					var loopAgain = true;
					if (CB_Configuration[CB_BASE_NAME].SM2_LOAD && !CB_startSoundManager2Called) { CB_startSoundManager2(scriptPathGiven); }
					if (typeof(detectZoom) !== "undefined" && detectZoom !== null && detectZoom && typeof(detectZoom.device) !== "undefined" && detectZoom.device !== null && detectZoom.device && typeof(detectZoom.device) === "function")
					{
						if (typeof(BrowserDetect) !== "undefined" && BrowserDetect !== null && typeof(BrowserDetect.browser) !== "undefined" && BrowserDetect.browser !== null)
						{
							if (CB_soundManager2Loaded || !CB_Configuration[CB_BASE_NAME].SM2_LOAD) //If SM2 has been loaded or we don't need it:
							{
								if (window.localStorage) //Needed for safe use of localStorage polyfill.
								{
									if (CB_initializeStaticObjects()) //Initializes all static objects (returns false until it loads totally).
									{
										CB_Modules.setStatus("CrossBase", CB_Modules.STATUSES.READY);
										loopAgain = false;
									}
								}
							}
						}
					}
					if (loopAgain) { setTimeout(checkReadyFunction, 1); }
				};
			checkReadyFunction();
		},
	//Callback function to call when the module is ready:
	"onReady" : null,
	//Callback function to call when module has not been loaded successfully:
	//"onFail" => null,
	//Needed files:
		//Following files doesn't support IE5.0:
		//	detect_zoom.js, CB_others.js, CB_events.js, CB_Screen.js, CB_Configuration[CB_BASE_NAME].FLASHCANVAS_PATH_SCRIPT_FILE,
		//	CB_Configuration[CB_BASE_NAME].CANVAS_TEXT_PATH_SCRIPT_FILE, CB_Configuration[CB_BASE_NAME].SM2_PATH_SCRIPT_FILE
	"neededFiles" :
		{	//Format: "needed_file" : { load: needs_to_be_loaded, [mandatory: needed_to_begin_CrossBrowdy], [absolutePath: relative_to_CrossBrowdy_path_or_absolute], [loadChecker: function that will be called and return true if the file needs to be loaded], [id: file_identifier_string], [requires: array_with_required_ids_of_files_required] }
			//Mandatory files:
			"CrossBase/general/others/BrowserDetect.js" : { load: true, mandatory: true }, //BrowserDetect by Peter-Paul Koch.
			"CrossBase/general/others/performanceAndrequestAnimationFrame.js" : { load: true, mandatory: true, id: "performanceAndrequestAnimationFrame" }, //performance.now polyfill by Paul Irish, Aaron Levine and Joan Alba Maldonado, requestAnimationFrame polyfill by Erik Moller (fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavic, Darius Bacon, Tim Hall and Joan Alba Maldonado).
			"CrossBase/general/others/typedarray.js" : { load: true, mandatory: true, id: "typedarray" }, //typedarray.js polyfill by Linden Research, Inc. and Joshua Bell and Joshua Bell.
			"CrossBase/general/others/base64-binary.js" : { load: true, mandatory: true }, //Base64Binary by Daniel Guerrero.
			"CrossBase/general/lz-string/lz-string.min.js" : { load: true, mandatory: true }, //lz-string (including base64-string) by pieroxy.
			"CrossBase/general/lz-string/base64-string.js" : { load: true, mandatory: true }, //lz-string (including base64-string) by pieroxy.
			"CrossBase/general/bluebird/bluebird.min.js" : { load: typeof(window.Promise) === "undefined", mandatory: true }, //bluebird by Petka Antonov.
			"CrossBase/general/JSON3/json3.min.js" : { load: true, mandatory: true, id: "json3" }, //JSON3 by Kit Cambridge.
			"CrossBase/audiovisual/image/detect_zoom/detect_zoom.js" : { load: true, mandatory: true }, //Detect-zoom by yonran (maintained by tombigel).
			"CrossBase/audiovisual/audio/AudioContextMonkeyPatch/AudioContextMonkeyPatch.js" : { load: true, mandatory: true }, //AudioContext-MonkeyPatch by Chris Wilson.
			"CrossBase/general/CB_others.js" : { load: true, mandatory: true }, //Other functions (such as trim(), etc).
			"CrossBase/general/CB_Arrays.js" : { load: true, mandatory: true }, //Arrays functions.
			"CrossBase/general/CB_Client.js" : { load: true, mandatory: true }, //Functions related with the client (browser, WebView, etc.).
			"CrossBase/general/CB_data.js" : { load: true, mandatory: true }, //Functions related with data (cookies, URL parameters, etc.).
			"CrossBase/general/CB_Elements.js" : { load: true, mandatory: true }, //Elements functions.
			"CrossBase/general/CB_Events.js" : { load: true, mandatory: true }, //Event functions.
			"CrossBase/general/CB_Collisions.js" : { load: true, mandatory: true }, //Collisions detection.
			"CrossBase/device/CB_Device.js" : { load: true, mandatory: true }, //CB_Device static class.
			"CrossBase/audiovisual/image/CB_Screen.js" : { load: true, mandatory: true }, //CB_Screen static class.
			"CrossBase/audiovisual/image/CB_GraphicSprites.js" : { load: true, mandatory: true }, //CB_GraphicSprites class.
			"CrossBase/audiovisual/image/CB_GraphicSpritesScene.js" : { load: true, mandatory: true }, //CB_GraphicSpritesScene class.
			"CrossBase/audiovisual/image/canvas/CB_Canvas.js" : { load: true, mandatory: true }, //CB_Canvas class.
			"CrossBase/input/CB_Keyboard.js" : { load: true, mandatory: true }, //CB_Keyboard static class.
			"CrossBase/input/CB_Mouse.js" : { load: true, mandatory: true }, //CB_Mouse static class.
			"CrossBase/input/CB_Touch.js" : { load: true, mandatory: true }, //CB_Touch static class.
			"CrossBase/input/CB_Pointer.js" : { load: true, mandatory: true }, //CB_Pointer static class.
			"CrossBase/input/controllers/CB_Controllers_Proprietary_WII.js" : { load: true, mandatory: true, requires: ["performanceAndrequestAnimationFrame"] }, //CB_Controllers_Proprietary_WII.js static class.
			"CrossBase/input/controllers/CB_Controllers_Proprietary_WII_U.js" : { load: true, mandatory: true, requires: ["performanceAndrequestAnimationFrame"] }, //CB_Controllers_Proprietary_WII_U.js static class.
			"CrossBase/input/controllers/CB_Controllers.js" : { load: true, mandatory: true }, //CB_Controllers static class.
			"CrossBase/net/fetch/fetch-ie8/fetch.js" : { load: typeof(window.fetch) === "undefined", mandatory: true }, //fetch-ie8 by Cam Song.
			"CrossBase/net/CB_Net.js" : { load: true, mandatory: true }, //CB_Net.
			"CrossBase/net/fetch/CB_Net_Fetch.js" : { load: true, mandatory: true }, //CB_Net.Fetch static class.
			"CrossBase/net/XHR/CB_Net_XHR.js" : { load: true, mandatory: true }, //CB_Net.XHR static class (AJAX).
			"CrossBase/net/sockets/CB_Net_Sockets.js" : { load: true, mandatory: true }, //CB_Net.Sockets static class.
			"CrossBase/net/REST/CB_Net_REST.js" : { load: true, mandatory: true }, //CB_Net.REST static class.
			"CrossBase/audiovisual/audio/CB_AudioDetector.js" : { load: true, mandatory: true }, //CB_AudioDetector static class.
			"CrossBase/audiovisual/audio/CB_AudioFile.js" : { load: true, mandatory: true }, //CB_AudioFile class.
			"CrossBase/audiovisual/audio/CB_AudioFile_API_WAAPI.js" : { load: true, mandatory: true }, //CB_AudioFile_API["WAAPI"] class.
			"CrossBase/audiovisual/audio/CB_AudioFile_API_AAPI.js" : { load: true, mandatory: true }, //CB_AudioFile_API["AAPI"] class.
			"CrossBase/audiovisual/audio/CB_AudioFile_API_SM2.js" : { load: CB_Configuration[CB_BASE_NAME].SM2_LOAD, mandatory: true }, //CB_AudioFile_API["SM2"] class.
			//"CrossBase/audiovisual/audio/CB_AudioFile_API_IXDKPP.js" : { load: true, mandatory: true }, //CB_AudioFile_API["IXDKPP"] class.
			"CrossBase/audiovisual/audio/CB_AudioFile_API_ACMP.js" : { load: true, mandatory: true }, //CB_AudioFile_API["ACMP"] class.
			"CrossBase/audiovisual/audio/CB_AudioFileCache.js" : { load: true, mandatory: true }, //CB_AudioFileCache class.
			"CrossBase/audiovisual/audio/CB_AudioFileSprites.js" : { load: true, mandatory: true }, //CB_AudioFileSprites class.
			"CrossBase/audiovisual/audio/CB_AudioFileSpritesPool.js" : { load: true, mandatory: true }, //CB_AudioFileSpritesPool class.
			"CrossBase/audiovisual/audio/CB_Speaker.js" : { load: true, mandatory: true }, //CB_Speaker static class.
			"CrossBase/general/PHP/PHP_detector.php" : { load: true, mandatory: true },

			//Dynamic filepath:
			"VALUEOF_CB_Configuration.CrossBase.LOCALSTORAGE_POLYFILL_PATH_SCRIPT_FILE" : { load: true, mandatory: true }, //localStorage polyfill by Morten Houmøller Nygaard.
			"VALUEOF_CB_Configuration.CrossBase.SOCKJS_PATH_SCRIPT_FILE" : { load: true, mandatory: true, requires: ["json3"] }, //SockJS-client by Marek, Bryce Kahle, Michael Bridgen, Luigi Pinca and others.
			
			//Optional files:
			"VALUEOF_CB_Configuration.CrossBase.CANBOX_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].CANBOX_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].CANBOX_PATH_ABSOLUTE }, //Canbox by Robert Inglin.
			"VALUEOF_CB_Configuration.CrossBase.SLCANVAS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].SLCANVAS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].SLCANVAS_PATH_ABSOLUTE }, //SLCanvas by David Anson and Jon Davis.
			"VALUEOF_CB_Configuration.CrossBase.FLASHCANVAS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].FLASHCANVAS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].FLASHCANVAS_PATH_ABSOLUTE }, //FlashCanvas by Tim Cameron Ryan and Shinya Muramatsu.
			"VALUEOF_CB_Configuration.CrossBase.EXCANVAS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].EXCANVAS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].EXCANVAS_PATH_ABSOLUTE }, //ExplorerCanvas by Google Inc.
			"VALUEOF_CB_Configuration.CrossBase.CANVAS_TEXT_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].CANVAS_TEXT_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].CANVAS_TEXT_PATH_ABSOLUTE }, //canvas-text by Fabien Menager.
			"VALUEOF_CB_Configuration.CrossBase.SM2_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].SM2_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].SM2_PATH_ABSOLUTE }, //SoundManager 2 by Scott Schiller.
			"VALUEOF_CB_Configuration.CrossBase.NOSLEEP_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].NOSLEEP_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].NOSLEEP_PATH_ABSOLUTE }, //NoSleep.js by Rich Tibbett.
			"VALUEOF_CB_Configuration.CrossBase.PHONEGAPJS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].PHONEGAPJS_LOAD, mandatory: false, absolutePath: CB_Configuration[CB_BASE_NAME].PHONEGAPJS_PATH_ABSOLUTE }, //Script necessary for PhoneGap.
			"VALUEOF_CB_Configuration.CrossBase.CORDOVAJS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].CORDOVAJS_LOAD, loadChecker: CB_Configuration[CB_BASE_NAME].CORDOVAJS_LOAD_CHECKER, mandatory: false, absolutePath: CB_Configuration[CB_BASE_NAME].CORDOVAJS_PATH_ABSOLUTE }, //Script necessary for Apache Cordova.
			"VALUEOF_CB_Configuration.CrossBase.INTELXDKJS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].INTELXDKJS_LOAD, mandatory: false, absolutePath: CB_Configuration[CB_BASE_NAME].INTELXDKJS_PATH_ABSOLUTE }, //Script necessary for Intel XDK.
			"VALUEOF_CB_Configuration.CrossBase.INTELXDK_INITDEVJS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].INTELXDK_INITDEVJS_LOAD, loadChecker: CB_Configuration[CB_BASE_NAME].INTELXDK_INITDEVJS_LOAD_CHECKER, mandatory: false, absolutePath: CB_Configuration[CB_BASE_NAME].INTELXDK_INITDEVJS_PATH_ABSOLUTE }, //Script necessary for Intel XDK.
			"VALUEOF_CB_Configuration.CrossBase.TIMBREJS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].TIMBREJS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].TIMBREJS_PATH_ABSOLUTE, id: "timbrejs", requires: ["typedarray"] }, //timbre.js by mohayonao.
			"VALUEOF_CB_Configuration.CrossBase.SUBCOLLIDERJS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].SUBCOLLIDERJS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].SUBCOLLIDERJS_PATH_ABSOLUTE, requires: ["timbrejs"] }, //subcollider.js by mohayonao.
			"VALUEOF_CB_Configuration.CrossBase.WAAPISIM_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].WAAPISIM_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].WAAPISIM_PATH_ABSOLUTE }, //WAAPISim by g200kg.
			"VALUEOF_CB_Configuration.CrossBase.BANDJS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].BANDJS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].BANDJS_PATH_ABSOLUTE }, //Band.js by Cody Lundquist and various contributors.
			"VALUEOF_CB_Configuration.CrossBase.JSFX_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].JSFX_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].JSFX_PATH_ABSOLUTE }, //jsfx by Egon Elbre.
			"VALUEOF_CB_Configuration.CrossBase.PRESSUREJS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].PRESSUREJS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].PRESSUREJS_PATH_ABSOLUTE }, //Pressure.js by Stuart Yamartino.
			"VALUEOF_CB_Configuration.CrossBase.HAMMERJS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].HAMMERJS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].HAMMERJS_PATH_ABSOLUTE }, //Hammer.js by Jorik Tangelder.
			"VALUEOF_CB_Configuration.CrossBase.HAMMERJS_HAMMER_TIME_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].HAMMERJS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].HAMMERJS_PATH_ABSOLUTE }, //Hammer Time by Alexander Schmitz and other contributors.
			"VALUEOF_CB_Configuration.CrossBase.WII_JS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].WII_JS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].WII_JS_PATH_ABSOLUTE }, //wii-js by Ryan McGrath.
			"VALUEOF_CB_Configuration.CrossBase.GAMEPAD_PLUS_PATH_SCRIPT_FILE" : { load: CB_Configuration[CB_BASE_NAME].GAMEPAD_PLUS_LOAD, mandatory: true, absolutePath: CB_Configuration[CB_BASE_NAME].GAMEPAD_PLUS_PATH_ABSOLUTE, requires: ["performanceAndrequestAnimationFrame"] } //gamepad-plus by Chris Van Wiemeersch (MozVR).
			
			//TODO: think about requiring xhr.js
		},
	//Needed modules:
	"neededModules" : null,
	//Credits:
	"credits" : CB_CrossBaseCredits
};


//Adds the credits to the default ones:
CB_addCredits(CB_Modules.modules["CrossBase"]["credits"]);


//Function that initializes (builds) all static objects required (returns true when finishes totally):
var CB_initializeStaticObjects_LOADED =
{
	"CB_Arrays" : false, //CB_Arrays static class.
	"CB_Elements" : false, //CB_Elements static class.
	"CB_Events" : false, //CB_Events static class.
	"CB_Client" : false, //CB_Client static class.
	"CB_Device" : false, //CB_Device static class.
	"CB_Net" : false, //CB_Net static class.
	"CB_Net.Fetch" : false, //CB_Net.Fetch static class.
	"CB_Net.XHR" : false, //CB_Net.XHR static class.
	"CB_Net.REST" : false, //CB_Net.REST static class.
	"CB_Net.Sockets" : false, //CB_Net.Sockets static class.
	"CB_Screen" : false, //CB_Screen static class.
 	"CB_Collisions" : false, //CB_Collisions static class.
	"CB_Keyboard" : false, //CB_Keyboard static class.
 	"CB_Mouse" : false, //CB_Mouse static class.
 	"CB_Touch" : false, //CB_Touch static class.
	"CB_Pointer" : false, //CB_Pointer static class.
	"CB_Controllers" : false, //CB_Controllers static class.
	"CB_Speaker" : false, //CB_Speaker static class.
	"CB_AudioDetector" : false //CB_AudioDetector static class.
};
function CB_initializeStaticObjects(containerObject)
{
	if (typeof(containerObject) === "undefined" || containerObject === null) { containerObject = CB_this || window; }
	
	var allIndexes = null;
	var allIndexesLength = null;
	var currentObject = null;
	
	for (var staticObject in CB_initializeStaticObjects_LOADED)
	{
		if (!CB_initializeStaticObjects_LOADED[staticObject])
		{
			allIndexes = staticObject.split(".");
			allIndexesLength = allIndexes.length;
			currentObject = containerObject[allIndexes[0]];
			for (var x = 1; x < allIndexesLength; x++)
			{
				if (typeof(currentObject[allIndexes[x]]) !== "undefined" && currentObject[allIndexes[x]] !== null)
				{
					currentObject = currentObject[allIndexes[x]];
				}
				else { return false; }
			}
			
			if (currentObject && typeof(currentObject.init) === "function")
			{
				currentObject.init();
				CB_initializeStaticObjects_LOADED[staticObject] = true;
			}
			else { return false; }
		}
	}
	
	return true;
}


//Function that prepares FlashCanvas options (it needs to be done before loading the FlashCanvas script):
function CB_prepareFlashCanvas(scriptPathGiven)
{
	document.createElement("canvas"); //According to FlashCanvas web site: ensure that document.createElement("canvas") is executed before any canvas element appears.
	window.FlashCanvasOptions =
	{
		swfPath: scriptPathGiven + CB_Configuration[CB_BASE_NAME].FLASHCANVAS_PATH_SWF,
		disableContextMenu: CB_Configuration[CB_BASE_NAME].FLASHCANVAS_DISABLE_CONTEXT_MENU,
		turbo: CB_Configuration[CB_BASE_NAME].FLASHCANVAS_TURBO_MODE,
		imageCacheSize: CB_Configuration[CB_BASE_NAME].FLASHCANVAS_IMAGE_CACHE_SIZE
	};
}


//Function that starts SoundManager 2:
var CB_startSoundManager2Called = false; //Defines whether CB_startSoundManager2 function has been called or not.
var CB_soundManager2Loaded = false; //Defines whether SoundManager 2 has been loaded successfully or not.
var CB_soundManager2Supported = false; //Defines whether SoundManager 2 is supported or not.
function CB_startSoundManager2(scriptPathGiven)
{
	CB_startSoundManager2Called = true;

	var CB_soundManager2TimeoutFunction =
		function()
		{
			CB_soundManager2Loaded = true; //SoundManager 2 has been loaded succesfully (but is not supported).
			CB_soundManager2Supported = false; //SoundManager 2 is not supported.
		};

	
	var CB_startSoundManager2Function =
		function()
		{
			if (typeof(soundManager) !== "undefined" && soundManager !== null)
			{
				//If the browser can't play the formats required using HTML5, it will force to load Flash:
				soundManager.audioFormats =
				{
					'mp3':
					{
						'type': ['audio/mpeg; codecs="mp3"', 'audio/mpeg', 'audio/mp3', 'audio/MPA', 'audio/mpa-robust'],
						'required': CB_Configuration[CB_BASE_NAME].SM2_AUDIO_FORMATS_REQUIRED["mp3"]
					},

					'mp4':
					{
						'related': ['aac', 'm4a'],
						'type': ['audio/mp4; codecs="mp4a.40.2"', 'audio/aac', 'audio/x-m4a', 'audio/MP4A-LATM', 'audio/mpeg4-generic'],
						'required': CB_Configuration[CB_BASE_NAME].SM2_AUDIO_FORMATS_REQUIRED["mp4"]
					},

					'ogg':
					{
						'type': ['audio/ogg; codecs=vorbis'],
						'required': CB_Configuration[CB_BASE_NAME].SM2_AUDIO_FORMATS_REQUIRED["ogg"]
					},

					'opus':
					{
						'type': ['audio/ogg; codecs=opus', 'audio/opus'],
						'required': CB_Configuration[CB_BASE_NAME].SM2_AUDIO_FORMATS_REQUIRED["opus"]
					},
					
					'wav':
					{
						'type': ['audio/wav; codecs="1"', 'audio/wav', 'audio/wave', 'audio/x-wav'],
						'required': CB_Configuration[CB_BASE_NAME].SM2_AUDIO_FORMATS_REQUIRED["wav"]
					}
				};

				soundManager.setup(
				{
					debugMode: false,
					flashLoadTimeout: CB_Configuration[CB_BASE_NAME].SM2_TIMEOUT_MS,
					useHighPerformance: CB_Configuration[CB_BASE_NAME].SM2_USE_HIGH_PERFORMANCE,
					//useFastPolling: CB_Configuration[CB_BASE_NAME].SM2_USE_FAST_POLLING,
					url: scriptPathGiven + CB_Configuration[CB_BASE_NAME].SM2_PATH_SWF,
					onready: function()
					{
						clearTimeout(CB_soundManager2Timeout);
						CB_soundManager2Loaded = true; //SoundManager 2 has been loaded succesfully (and is supported).
						CB_soundManager2Supported = true; //SoundManager 2 is supported.
					},
					ontimeout: CB_soundManager2TimeoutFunction
				});

				//Ensure start-up in case document.readyState and/or DOMContentLoaded are unavailable:
				soundManager.beginDelayedInit();
			}
			else if (!CB_soundManager2Loaded) { setTimeout(CB_startSoundManager2Function, 1); }
		};
	
		CB_startSoundManager2Function();

		//Since ontimeout event of SoundManager 2 seems not working on some platforms using Intel XDK (and maybe other Cordova-based engines), we have our own onntimeout:
		var CB_soundManager2Timeout = setTimeout(CB_soundManager2TimeoutFunction, CB_Configuration[CB_BASE_NAME].SM2_TIMEOUT_MS);
}