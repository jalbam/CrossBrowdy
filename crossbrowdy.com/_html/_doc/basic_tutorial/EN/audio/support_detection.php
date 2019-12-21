<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	With CrossBrowdy, we can detect the audio formats that the current client supports as well as the audio APIs that it can manage.
</p>

<p>
	The audio APIs will be used by classes such as
	the <a href="_html/_doc/api/CB_Speaker.html" target="_blank">CB_Speaker</a> (static class),
	the <a href="_html/_doc/api/CB_AudioFileSpritesPool.html" target="_blank">CB_AudioFileSpritesPool</a>,
	the <a href="_html/_doc/api/CB_AudioFileSprites.html" target="_blank">CB_AudioFileSprites</a>,
	the <a href="_html/_doc/api/CB_AudioFileCache.html" target="_blank">CB_AudioFileCache</a>,
	the <a href="_html/_doc/api/CB_AudioFile.html" target="_blank">CB_AudioFile</a>,
	the <a href="_html/_doc/api/CB_AudioFile_API.WAAPI.html" target="_blank">CB_AudioFile_API.WAAPI</a>
	(using <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank">HTML5 Web Audio API</a>),
	the <a href="_html/_doc/api/CB_AudioFile_API.AAPI.html" target="_blank">CB_AudioFile_API.AAPI</a>
	(using <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio" target="_blank">HTML5 Audio API</a>),
	the <a href="_html/_doc/api/CB_AudioFile_API.ACMP.html" target="_blank">CB_AudioFile_API.ACMP</a>
	(using <a href="https://github.com/apache/cordova-plugin-media" target="_blank">Apache Cordova Media Plugin</a>) and
	the <a href="_html/_doc/api/CB_AudioFile_API.SM2.html" target="_blank">CB_AudioFile_API.SM2</a>
	(using <a href="http://schillmania.com/projects/soundmanager2/" target="_blank">SoundManager 2</a>),
	etc.
	Among these classes, the ones which are not related with a specific audio API already provide automatic detection of the best audio API
	for the current client so we do not need to worry about it when using them.
</p>

<p>
	Here is an example of audio support detection and management with CrossBrowdy:
</p>
<pre><code class="language-javascript">
	//Checks whether a given audio API exists in CrossBrowdy (although the current client might not support it):
	if (CB_AudioDetector.APIExists("WAAPI")) { CB_console("HTML5 Web Audio API exists!"); }
	if (CB_AudioDetector.APIExists("AAPI")) { CB_console("HTML5 Audio API exists!"); }
	if (CB_AudioDetector.APIExists("ACMP")) { CB_console("Apache Cordova Media Plugin exists!"); }
	if (CB_AudioDetector.APIExists("SM2")) { CB_console("SoundManager 2 exists!"); }

	//Detects whether WAAPI (HTML5 Web Audio API) is using emulation or not:
	if (CB_AudioDetector.isWAAPIUsingEmulation()) { CB_console("HTML5 Web Audio API is using emulation!"); }
	else { CB_console("HTML5 Web Audio API is not using emulation!"); }
	
	//Detects whether SoundManager 2 is using Flash or not:
	if (CB_AudioDetector.isSM2UsingFlash()) { CB_console("SoundManager 2 is using Flash!"); }
	else { CB_console("SoundManager 2 is not using Flash!"); }
	
	//Checks whether the current client supports a given audio API:
	if (CB_AudioDetector.isAPISupported("WAAPI")) { CB_console("HTML5 Web Audio API is supported!"); }
	if (CB_AudioDetector.isAPISupported("WAAPI", true)) { CB_console("HTML5 Web Audio API is supported (maybe it is being emulated)!"); }
	if (CB_AudioDetector.isAPISupported("AAPI")) { CB_console("HTML5 Audio API is supported!"); }
	if (CB_AudioDetector.isAPISupported("ACMP")) { CB_console("Apache Cordova Media Plugin is supported!"); }
	if (CB_AudioDetector.isAPISupported("SM2")) { CB_console("SoundManager 2 is supported!"); }
	
	//Gets an array with the audio APIs supported by the current client:
	var audioAPIsSupported = CB_AudioDetector.getSupportedAPIs(); //Returns all supported audio APIs (from all possible ones), without allowing emulated ones.
	var audioAPIsSupported_2 = CB_AudioDetector.getSupportedAPIs(undefined, true); //Returns all supported audio APIs (from all possible ones), allowing emulated ones.
	var audioAPIsSupported_3 = CB_AudioDetector.getSupportedAPIs(["WAAPI", "ACMP"]); //Returns the supported audio APIs from the given ones, without allowing emulated ones.
	var audioAPIsSupported_4 = CB_AudioDetector.getSupportedAPIs(["WAAPI", "ACMP"], true); //Returns the supported audio APIs from the given ones, allowing emulated ones.
	
	//Gets the preferred audio API for the current client:
	var audioAPIPreferred = CB_AudioDetector.getPreferredAPI(); //Returns the preferred API (from all possible ones), without allowing emulated ones.
	var audioAPIPreferred_2 = CB_AudioDetector.getPreferredAPI(undefined, true); //Returns the preferred API (from all possible ones), allowing emulated ones.
	var audioAPIPreferred_3 = CB_AudioDetector.getPreferredAPI(["WAAPI", "ACMP"]); //Returns the preferred API from the given ones, without allowing emulated ones.
	var audioAPIPreferred_4 = CB_AudioDetector.getPreferredAPI(["WAAPI", "ACMP"], true); //Returns the preferred API from the given ones, allowing emulated ones.
	
	//Checks support level for a given audio format (support level can be "probably", "maybe" or an empty string which means not supported):
	//NOTE: the "probably" audio formats are more likely to be supported than the "maybe" ones.
	var audioFormats = //Note: we could use the 'CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS' array instead which contains many audio formats in order of preference.
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
	];
	var audioFormatSupportLevel = "";
	var audioFormatNoDataURIsSupportLevel = "";
	for (var x = 0; x &lt; audioFormats.length; x++)
	{
		audioFormatSupportLevel = CB_AudioDetector.isAudioFormatSupported(audioFormats[x], true); //Returns "probably", "maybe" or an empty string which means not supported. Checking support with data URIs.
		audioFormatNoDataURIsSupportLevel = CB_AudioDetector.isAudioFormatSupported(audioFormats[x]); //Returns "probably", "maybe" or an empty string which means not supported. Checking support without data URIs.
		if (audioFormatSupportLevel) { CB_console(audioFormats[x] + " supported! (even using data URIs). Support level: " + audioFormatSupportLevel); }
		else if (audioFormatNoDataURIsSupportLevel) { CB_console(audioFormats[x] + " supported! (but without using data URIs). Support level: " + audioFormatNoDataURIsSupportLevel); }
	}
	
	//Gets an array with the supported audio formats:
	var audioFormatsSupported = CB_AudioDetector.getSupportedAudioFormats(); //Returns the supported audio formats (from all possible ones) with "probably" and "maybe" support levels, without checking data URIs support.
	var audioFormatsSupported_2 = CB_AudioDetector.getSupportedAudioFormats(undefined, undefined, true); //Returns the supported audio formats (from all possible ones) with "probably" and "maybe" support levels, checking data URIs support.
	var audioFormatsSupported_3 = CB_AudioDetector.getSupportedAudioFormats(undefined, ["probably"]); //Returns the supported audio formats (from all possible ones) with "probably" support level, without checking data URIs support.
	var audioFormatsSupported_4 = CB_AudioDetector.getSupportedAudioFormats(['audio/ogg; codecs="vorbis"', 'audio/wave']); //Returns the supported audio formats (from the given ones) with "probably" and "maybe" support levels, without checking data URIs support.
	var audioFormatsSupported_5 = CB_AudioDetector.getSupportedAudioFormats(['audio/ogg; codecs="vorbis"', 'audio/wave'], ["maybe"]); //Returns the supported audio formats (from the given ones) with "maybe" support level, without checking data URIs support.
	var audioFormatsSupported_6 = CB_AudioDetector.getSupportedAudioFormats(['audio/ogg; codecs="vorbis"', 'audio/wave'], ["probably"], true); //Returns the supported audio formats (from the given ones) with "probably" support level, checking data URIs support.
	var audioFormatsNotSupported = CB_AudioDetector.getSupportedAudioFormats(undefined, [""]); //Returns the unsupported audio formats (with or without using data URIs, so it is not important).
</code></pre>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_AudioDetector.html" target="_blank">CB_AudioDetector</a> static class.
</p>