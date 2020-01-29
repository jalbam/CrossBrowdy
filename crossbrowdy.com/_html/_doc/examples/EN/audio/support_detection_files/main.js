/* This file belongs to a CrossBrowdy.com example, made by Joan Alba Maldonado. Creative Commons Attribution 4.0 International License. */

CB_init(main); //It will call the "main" function when ready.


//This function will be called when CrossBrowdy is ready:
function main()
{
	var APIs =
	{
		WAAPI: "HTML5 Web Audio API (WAAPI)",
		AAPI: "HTML5 Audio API (AAPI)",
		ACMP: "Apache Cordova Media Plugin (ACMP)",
		SM2: "SoundManager 2 (SM2)"
	};
	
	var output = "";
	for (var API in APIs)
	{
		//Checks whether a given audio API exists in CrossBrowdy (although the current client might not support it):
		output = "";
		if (CB_AudioDetector.APIExists(API)) { output += APIs[API] + ", "; }
		CB_Elements.appendContentById("existing_apis", output);
		
		//Checks whether the current client supports a given audio API:
		output = "";
		if (CB_AudioDetector.isAPISupported(API)) { output += APIs[API] + ", "; }
		CB_Elements.appendContentById("supported_apis", output);
		output = "";
		if (CB_AudioDetector.isAPISupported(API, true)) { output += APIs[API] + ", "; }
		CB_Elements.appendContentById("supported_apis_emulation", output);
	
	}
	CB_Elements.insertContentById("existing_apis", CB_trim(CB_Elements.id("existing_apis").innerHTML, [" ", ","]));
	CB_Elements.insertContentById("supported_apis", CB_trim(CB_Elements.id("supported_apis").innerHTML, [" ", ","]));
	CB_Elements.insertContentById("supported_apis_emulation", CB_trim(CB_Elements.id("supported_apis_emulation").innerHTML, [" ", ","]));
	
	//Gets an array with the audio APIs supported by the current client:
	CB_Elements.insertContentById("supported_apis_array", CB_AudioDetector.getSupportedAPIs());
	CB_Elements.insertContentById("supported_apis_emulation_array", CB_AudioDetector.getSupportedAPIs(undefined, true)); //Returns all supported audio APIs (from all possible ones), allowing emulated ones.

	//Gets the preferred audio API for the current client:
	CB_Elements.insertContentById("preferred_api", CB_AudioDetector.getPreferredAPI()); //Returns the preferred API (from all possible ones), without allowing emulated ones.
	CB_Elements.insertContentById("preferred_api_emulation", CB_AudioDetector.getPreferredAPI(undefined, true)); //Returns the preferred API (from all possible ones), allowing emulated ones.

	//Detects whether WAAPI (HTML5 Web Audio API) is using emulation or not:
	CB_Elements.insertContentById("waapi_emulated", CB_AudioDetector.isWAAPIUsingEmulation() ? "Yes" : "No");

	//Detects whether SoundManager 2 is using Flash or not:
	CB_Elements.insertContentById("sm2_using_flash", CB_AudioDetector.isSM2UsingFlash() ? "Yes" : "No");

	//Prints all existing audio formats (in CrossBrowdy):
	CB_Elements.insertContentById("audio_formats_existing", CB_Configuration.CrossBase.CB_AudioFileCache_PREFERRED_AUDIO_FORMATS);

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
	output = { probably: "", maybe: "", unsupported: "" };
	for (var x = 0; x < audioFormats.length; x++)
	{
		supportLevel = "";
		supportLevel = CB_AudioDetector.isAudioFormatSupported(audioFormats[x], true); //Returns "probably", "maybe" or an empty string which means not supported. Checking support with data URIs.
		if (supportLevel)
		{
			output[supportLevel] += audioFormats[x] + " (with data URIs)<br />"
		}
		else
		{
			supportLevel = CB_AudioDetector.isAudioFormatSupported(audioFormats[x]); //Returns "probably", "maybe" or an empty string which means not supported. Checking support without data URIs.	
			if (supportLevel)
			{
				output[supportLevel] += audioFormats[x] + " (no data URIs)<br />";
			}
			else
			{
				output["unsupported"] += audioFormats[x] + "<br />";
			}
		}
	}
	CB_Elements.insertContentById("audio_formats_support_probably", output.probably);
	CB_Elements.insertContentById("audio_formats_support_maybe", output.maybe);
	CB_Elements.insertContentById("audio_formats_support_unsupported", output.unsupported);

	//Gets an array with the supported audio formats:
	CB_Elements.insertContentById("audio_formats_support_probably_data_uris_array", CB_AudioDetector.getSupportedAudioFormats(undefined, ["probably"], true)); //Returns the supported audio formats (from all possible ones) with "probably" support level, checking data URIs support.
	CB_Elements.insertContentById("audio_formats_support_probably_array", CB_AudioDetector.getSupportedAudioFormats(undefined, ["probably"])); //Returns the supported audio formats (from all possible ones) with "probably" support level.
	CB_Elements.insertContentById("audio_formats_support_maybe_data_uris_array", CB_AudioDetector.getSupportedAudioFormats(undefined, ["maybe"], true)); //Returns the supported audio formats (from all possible ones) with "maybe" support level, checking data URIs support.
	CB_Elements.insertContentById("audio_formats_support_maybe_array", CB_AudioDetector.getSupportedAudioFormats(undefined, ["maybe"])); //Returns the supported audio formats (from all possible ones) with "maybe" support level.
	CB_Elements.insertContentById("audio_formats_support_unsupported_array", CB_AudioDetector.getSupportedAudioFormats(undefined, [""])); //Returns the unsupported audio formats (with or without using data URIs, so it is not important).
}