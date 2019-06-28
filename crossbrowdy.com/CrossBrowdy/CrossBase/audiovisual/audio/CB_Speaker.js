/**
 * @file Speakers management. Contains the {@link CB_Speaker} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 */

 
/**
 * Static class to manage the speaker or speakers. It will return itself if it is tried to be instantiated. It can also use [timbre.js]{@link https://mohayonao.github.io/timbre.js/}, [Band.js]{@link https://github.com/meenie/band.js/} and [jsfx]{@link https://github.com/loov/jsfx}.
 * @namespace
 * @todo Check whether the path used to play silent sounds as a workaround (through the internal "_playBlankFilesSilently" method) is right or not (now it uses the {@link CB_scriptPath} variable).
 */
var CB_Speaker = CB_Speakers = function() { return CB_Speaker; };
{
	CB_Speaker.initialized = false; //It will tells whether the object has been initialized or not.
	
	CB_Speaker._silentAudioFilePlayed = false; //Defines whether a silent audio file has already been played when the user has clicked (hack for some web clients that doesn't start playing sounds unless the first sound is played when the user has clicked).
	CB_Speaker._silentAudioFilePlayedWAAPI = false; //Defines whether a silent audio file has already been played using WAAPI when the user has clicked (hack for some web clients that doesn't start playing sounds unless the first sound is played when the user has clicked).	
	CB_Speaker._volume = CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME; //Volume of the speaker.
	CB_Speaker._volumeBeforeMute = CB_Speaker._volume; //Stores the volume which was set before muting.
	CB_Speaker._audioFileSpritesPool = null; //CB_AudioFileSpritesPool object.
	CB_Speaker._timbreJSObject = null; //Stores the timbre.js object (if any).
	CB_Speaker._bandJSObject = null; //Stores the Band.js object (if any).
	CB_Speaker._jsfxObject = null; //Stores the jsfx object (if any).
	
	
	//Initializes all values:
	CB_Speaker.init = function()
	{
		if (CB_Speaker.initialized) { return CB_Speaker; }

		//Sets that the object has already been initialized:
		CB_Speaker.initialized = true;
		
		//Plays the blank sound silently, if able (workaround for some web clients):
		try { CB_Speaker._playBlankFilesSilently(); } catch(e) {}
		
		//Gets and stores the timbre.js object (if any):
		CB_Speaker._timbreJSObject = (typeof(T) !== "undefined" && T !== null) ? T : null;
		
		//Gets and stores the Band.js object (if any):
		CB_Speaker._bandJSObject = (typeof(BandJS) !== "undefined" && BandJS !== null) ? BandJS : null;

		//Gets and stores the jsfx object (if any):
		CB_Speaker._jsfxObject = (typeof(jsfx) !== "undefined" && jsfx !== null) ? jsfx : null;
		
		return CB_Speaker;
	}


	//Function that plays a silent sound the first time the user clicks:
	CB_Speaker._playBlankFilesSilently = function() //Note: hack for some web clients that doesn't start playing sounds unless the first sound is played when the user has clicked.
	{
		var silentAudioFiles = new Array(2);
		silentAudioFiles["AAPI"] = new Array(3);
		silentAudioFiles["WAAPI"] = new Array(6);
		
		var destroySilentAudioFile = 
			function(API, extension, needsLoaded)
			{
				setTimeout
				(
					function()
					{
						if (typeof(silentAudioFiles) !== "undefined" && typeof(silentAudioFiles[API]) !== "undefined" && typeof(silentAudioFiles[API][extension]) !== "undefined" && silentAudioFiles[API][extension] !== null)
						{
							if (!needsLoaded || silentAudioFiles[API][extension].getStatusString() === "LOADED")
							{
								silentAudioFiles[API][extension].destructor(true, false, true, false);
								silentAudioFiles[API][extension] = null;
							}
						}
					},
					100
				);
			};
		
		var createSilentAudioFile =
			function(filePath, API, extension, dataURI)
			{
				extension = extension.toLowerCase();
				silentAudioFiles[API][extension] = null;
				if (extension === "mp3" && CB_AudioDetector.isAudioFormatSupported("audio/mpeg;", dataURI) === "") { return; }
				if (extension === "ogg" && CB_AudioDetector.isAudioFormatSupported("audio/ogg", dataURI) === "") { return; }
				if (extension === "wav" && CB_AudioDetector.isAudioFormatSupported("audio/wav", dataURI) === "") { return; }
				
				API = API.toUpperCase();

				silentAudioFiles[API][extension] = new CB_AudioFile
				(
					filePath, //filePath
					"CB_blank_sound_" + API, //id
					{
						autoLoad: true,
						autoPlay: false,//(API === "AAPI"),
						loop: false,
						volume: 1
					}, //options
					API, //API
					function()
					{
						destroySilentAudioFile(API, extension, true);
					}, //callbackOk
					function(error)
					{
						destroySilentAudioFile(API, extension);
					} //callbackError
				);
			};
		
		createSilentAudioFile("data:audio/mpeg;base64,/+MYxAAKK2IBQAgEdwIP//+P/9/9/o0//8jer//U/////5znO/V/U7T6Mc7aTnOedyEnDix6/nIyl/ylPLJ19Z2bn3//8q+2/+MYxBIJC2YcAABHTJcyCOjsDMyORiF3iDM4QSB0UtUNwSAIrB7NiRnrpo///Iv/XYeqPVUJ4FTLUuUTe0LEAi9Ox3/x8uue/+MYxCgMSAYuUABEAltFTREVAxMEDCpuSOUJUV3C90k6gTk9S6Eto//xd3+pOj/2fSN///pnc/fDinSZYWGVjATdhJIbRen//+MYxDEJ2AYySAhEAkaFv3Nq/L7P/Wzdf6tifb1Pdb//V2vF1lWCRy3Acql0khff///MKkIMQma8KhCvkLkL6////////kKE/+MYxEQKaAIuSAhEliEQn4UQvZjCgIEaxvCgI2pMQU1FMy45OS4zqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq/+MYxFUKU2IEIABHFaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", "WAAPI", "mp3", true);
		createSilentAudioFile("data:audio/ogg;base64,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", "WAAPI", "ogg", true);
		createSilentAudioFile("data:audio/wav;base64,UklGRuwgAABXQVZFZm10IBAAAAABAAIAgD4AAAD6AAAEABAAZGF0YcggAAAAAAEAAAD+/wEAAgD+////AgAAAP7/AQACAP////8AAAAAAQAAAP//AAABAAAA//8AAAEAAAD/////AAACAAIA/v/8/wEABQAAAPv///8EAAIA/f/+/wMAAQD9////AgABAP//AAAAAAAAAQAAAAAA///+/wEAAwAAAPz/AAAFAP///P8CAAMA/v/9/wIAAgD+////AgABAP7///8CAAEA/v///wEAAQABAP7//v8DAAIA/f/+/wIAAQAAAAAA/v8AAAMA///+/wIAAQD+////AgABAP3///8EAAIA/P/+/wQAAAD9/wIAAQD9/wEABAD+//z/AgACAP//AAAAAP//AQACAP///v///wEAAwD///3/AQACAAAA/////wAAAgAAAP7/AQAAAP//AQAAAP//AQABAP7/AAADAP7//f8DAAIA/f///wIAAAD//wEAAAD//wEAAQD/////AQABAP////8BAAEA/////wEAAQAAAP///v8CAAMA/f/+/wIAAQAAAP////8AAAIAAQD+//7/AQADAAAA/f8AAAIAAAD//wAAAAD//wAAAQABAAAA/v8AAAMAAAD8////BAABAP3/AAACAP////8CAAAA/v8AAAEAAQAAAP7/AAACAP///v8CAAIA/f///wMA///+/wIAAgD+//7/AgACAP///f///wQAAgD8////BAAAAPz/AAADAAEA///+////AwADAPz/+/8DAAYA/v/6/wEABQAAAP3///8BAAEAAAD//wAAAAD//wIAAgD9//7/AwACAP3//v8DAAIA/f/9/wMABAD+//z/AQAEAAAA/f/+/wIAAgD9////BAAAAPz/AgAFAPz/+/8EAAMA/P///wQA///9/wMAAgD8//7/AwACAP///v8AAAMAAAD9/wAAAgAAAP///////wIAAwD///3/AAACAAAA//8AAAAA//8BAAIA/v///wIA///+/wMAAgD8//7/BAABAPz/AQADAP7///8BAP//AAACAP///v8CAAEA//8AAP//AAACAP///v8CAAEA/f8BAAMA/v///wIA///+/wIAAgD+//7/AQADAAEA/P/+/wUAAgD7////BAD///z/AgAEAP7//f8CAAIA///+////AgACAP7//v8CAAEA//8AAAAA//8AAAEAAAABAP///f8DAAMA/f/9/wIAAwD+////AQD//wAAAgAAAP3/AAADAP///v8BAAEA//8AAAIA///+/wEAAgD///3/AgADAP3//v8DAAIA/f///wMAAAD+/wAAAQAAAP////8CAAIA/f/+/wMAAgD+////AQD//wAAAgD///7/AQABAAEAAQD9////BAAAAPz/AQADAP7//v8DAAEA/f8AAAIAAAD//wAAAAAAAAEA/////wIAAAD+/wEAAgD///7/AAACAAEA/v///wIAAQD+/wAAAQD//wAAAQD/////AgABAP7/AAABAP//AAABAP//AAABAP//AAABAAAA//8AAAEA//8AAAIA///+/wIAAgD9////BAD///v/AgAEAP7//v8DAAEA/P8AAAQA///9/wEAAQD//wAAAQAAAP//AQACAP///f8AAAMAAAD9/wAAAwABAP3//v8DAAIA/f/+/wMAAwD9//z/AgAEAP7//P8CAAMA/////wEAAAD+/wEAAgD+//7/AQABAAAAAQAAAP7/AAACAAAA/v///wEAAQAAAP//AAABAP////8CAAIA/v/9/wEAAwAAAP7///8BAAIAAAD///////8CAAIA/v/+/wIAAQD+/wEAAQD9/wAABAAAAP3/AAABAP//AAACAP///v8CAAIA///+/wAAAQAAAAAAAAAAAP//AAADAAAA/P8AAAQAAAD8/wAAAwAAAP7/AAACAAAA/v8AAAIAAQD+//7/AQACAAAA//8AAAAAAAAAAAAAAAAAAP//AAADAAAA/f///wEAAgD///7/AQACAAAA/v8BAAEA/f8AAAMAAAD9/wAABAAAAP3/AAABAAAA//8AAAEAAAAAAAEA///9/wIABAD9//3/AwACAP7//v8AAAIAAgD9//7/BAABAP3/AAABAP7/AAAEAAAA/P///wMAAgD///7///8BAAEA//8AAAIA///9/wIABAD+//z/AQACAAAAAAAAAP////8CAAEA/v///wEAAgAAAP7///8CAAEA/f8AAAMAAAD9/wAABAAAAP3///8BAAEAAAAAAP//AAACAAAA/v8AAAEA//8AAAIAAAD//wAA//8AAAMAAAD7////BgACAPv///8DAAAA//8BAAAA/f8AAAQAAAD9/wAAAwAAAP3/AAABAAAAAQD/////AwABAPv///8GAAEA+v///wUAAQD8/wAAAwD///7/AgABAP3/AAADAP////8CAAAA/v///wEAAgAAAP3///8EAAIA/P/+/wMAAgD+//7/AQACAAAA/v///wMAAQD9////AgAAAP7/AQACAAAA/////wEAAAD//wAAAQAAAP7/AAACAAEA///+/wEAAgAAAP///v///wMAAgD+////AQAAAAAAAQD+////BAAAAPz/AQADAP7//v8DAAAA/v8CAAAA/v8BAAIA/f/+/wUAAAD7/wIABAD+//3/AgABAP7/AQABAP7///8CAAMA/v/8/wIABAD+//z/AwADAPz///8EAAEA/P///wQAAQD9//7/AgADAP///v8AAAEAAQAAAP////8AAAAAAAACAAAA/f8BAAMA/v/+/wMAAAD8/wEAAwAAAP////8AAAEAAAAAAAAA//8AAAEAAAABAAAA/v///wIAAQD+/wAAAQD//wAAAQAAAP////8AAAIAAQD+////AgABAP7/AAABAP7/AAADAAAA/P8AAAUAAAD8/wEAAgD//wAAAAD+/wAAAwAAAP3/AQACAP7///8CAAEA//8AAAAA//8BAAEA/f/+/wMAAwD///7/AAACAAAA/v8BAAEA/v///wIAAQD+/wAAAgD/////AgABAP7///8AAP//AQADAP7//f8DAAIA/v///wEAAAD//wEAAAD+/wEAAgD+////AwAAAP3/AQACAP7///8CAAAA//8BAAAA//8AAAEAAAD+/wEAAgD+////AgABAP7/AAABAP7/AAADAAAA/P///wUAAgD7//3/BAADAP7//f8AAAQAAQD7//7/BQADAPv//f8EAAMA/v/9/wEAAgD//wAAAQD///7/AQADAP///v8BAAAA//8BAAEA/v/+/wMAAwD+//7/AAAAAAEAAQD+////AgAAAP//AQAAAP7/AQADAP///v8AAAAAAAAAAAAA//8BAAIA/////wEAAAD//wEAAAD9/wEABAD///3/AQABAP//AQABAP7///8DAAEA/f///wEAAAABAAIA/v/9/wMABAD8//v/BAAEAP3//v8CAAEA//8AAAEA///+/wAAAwABAPz/AAAFAAAA+////wQAAQD9////AgACAP////8BAAAA/v8AAAMAAAD8/wAABQAAAPv/AQAEAP7//f8CAAEA//8BAAAA/v8BAAIA///+/wAAAQAAAAAAAAAAAAAA//8AAAIAAAD9/wAAAwAAAP7///8CAAEA/v8AAAEA/////wIAAgD+//7/AAACAAIA/f/9/wQAAwD9////AQD+/wAAAwD///7/AgAAAP7/AgACAP3//f8DAAMA/f/+/wMAAQD9/wAAAwD///3/AAACAAEAAAD/////AQACAP///f8AAAIAAAD//wEAAQD+/wAAAwD///3/AQABAP//AQABAP7///8DAAEA/f///wEAAgAAAP7/AAABAAAA/v8AAAMA///+/wIAAgD+//7/AQABAP////8BAAIAAAD+////AgABAP///////wEAAgAAAP7/AAACAP///v8CAAIA/f/9/wMAAwD+//7/AQABAAAAAAAAAAAA/////wEAAgD///7/AQACAAAA////////AgACAP3//v8EAAIA/P/+/wMAAgD+//3/AQAEAAAA/P8AAAMAAAD+////AQACAAAA/f8AAAMAAAD+////AgACAP7//v8BAAIA///+/wEAAQAAAAAAAAAAAP//AQACAP7//v8CAAAA/f8CAAQA/v/9/wEAAQABAAEA/f/+/wMAAgD///7/AAABAAAAAAAAAAAAAAAAAAAAAAABAAAA/v8AAAIAAAD+/wAAAwAAAPz/AAAEAAAA/f8BAAIA/v///wIAAAD+/wAAAgAAAP7/AQACAP///v8AAAIAAAD//wAA//8AAAIAAAD+/wEAAgD+////AwAAAPz/AAAEAAAA/f8AAAIAAQD+//7/AgACAP///v8AAAEAAAABAAAA/v8AAAIAAAD//wAAAAD//wEAAgD+////AgAAAP//AAABAP////8BAAEAAAD+/wAAAgAAAP////8AAAEAAQD///7/AQADAAAA/f///wIAAAD//wIAAQD9//7/AwADAP7//f8AAAIAAgAAAP7//v8BAAIAAAD///////8BAAMAAAD8////BAACAPz//f8DAAMA/v/9/wIAAwD///7///8BAAIA///9/wEABAD///3/AgABAP7/AAAAAP//AQACAP///v8BAAEA/////wAAAgAAAP7/AAACAAEA/f///wMA/////wMA///8/wIABAD+//7/AgD///7/BAABAPv/AAAEAAAA/v8AAAAA//8CAAEA/f8AAAIAAAAAAP////8CAAEA/f///wQAAQD8////BAACAPz//f8DAAIA/v8AAAEA//8AAAIAAAD9/wAAAwD///3/AgADAP7//v8CAAEA/////wAAAgAAAP3/AQAEAP7//P8CAAMA///+/wAAAQAAAAAAAAAAAP//AAACAAAA/v///wIAAQD+/wAAAQD//wAAAgAAAP3/AAACAAAAAAAAAP//AAABAAAA/////wAAAwABAPz///8EAAEA/P/+/wMAAwD///3/AAADAAAA/f8AAAIAAQD///7/AAACAAEA/v/+/wMAAgD9////AwAAAPz/AAADAAAAAAAAAP7/AAADAAEA/f///wEAAAABAAAA/v8BAAMA///9/wEAAgD///7/AAACAAEA/////wAAAQABAP7//v8DAAIA/f/+/wIAAgD/////AAAAAAEAAAD+////AwACAPz///8FAAAA+/8AAAQAAAD+/wAAAAABAAIA///9/wEABAD///v/AAAFAAIA+//9/wUABAD8//z/AgADAP///v8AAAEAAQAAAP//AAAAAAAAAQAAAP//AAAAAAAAAgAAAPz/AAAFAAAA/P8BAAIA/v8AAAIA/////wEAAAD//wEAAQD//wAAAAD//wEAAgD///3/AQADAP///f8BAAQA/v/7/wMABgD9//v/AwACAP3/AQADAP7//f8CAAIA/////wAAAQAAAP//AgABAPz///8EAAAA/f8BAAIA///+/wEAAgD///7/AQACAP7///8DAP///f8CAAMA/v/9/wEAAwABAP3//v8CAAMA///9/wAAAgACAP///f8AAAIAAQD//wAAAAAAAAEA/////wIAAAD8/wEABgD+//r/AgAFAP///f8BAAEA//8AAAAA//8BAAEA/v8AAAMAAAD9/wAAAwAAAP3/AAACAAAA//8AAAAAAQABAP7//v8CAAMA/v/8/wIABAD///z/AAAEAAAA/P///wQAAQD8/wAABAAAAPz/AAAEAAAA/P///wMAAgD+//7/AgACAP7//v8BAAIAAAD///////8BAAIA///+/wEAAgAAAP////8AAAEA/////wIAAQD+/wAAAQD//wEAAQD9/wAAAwD///7/AgABAP7/AAABAP//AAABAP////8CAAEA/v8AAAIAAAD+////AQABAAAA//8AAAEAAAABAAAA/v///wEAAgD///7/AQACAP///v8CAAEA/f8AAAIAAAAAAAAA/////wIAAgD9//7/AwABAP7/AAACAP///v8CAAIA/f/+/wIAAgD///7/AQABAP////8AAAIAAQD+////AQABAAAA/////wEAAQD//wAAAQD/////AQAAAAAAAQD///7/AgADAP7//f8AAAIAAgD+//3/AQAEAAEA+//+/wUAAwD7//z/BQADAPz///8CAP//AAADAP///P8BAAMA///+/wEAAgAAAP////8AAAEAAAD/////AQADAP///P8BAAUA///7/wEABAD///3/AAACAAEA/////wEAAgD///3/AQACAP////8BAAEA/////wEAAgAAAP3///8CAAEA//8AAAEA//8AAAEA/////wEAAQD//wAAAQAAAAEA///9/wEABAD///v/AQAFAAAA/P8AAAQAAAD8////AwABAP7/AAABAAAAAQABAP7//f8BAAMAAAD///////8CAAMA/v/8/wEAAgAAAAEA///9/wEAAwD///7/AQABAAAAAAD//wAAAQD/////AQABAP////8CAAEA/v///wIAAQD+////AQABAAAA/////wIAAgD9//7/AwACAP7//v8AAAIAAgD+//3/AQADAAAA//8AAP//AAABAAEAAAD+////AgACAP7//v8CAAEA//8AAAEA///+/wEAAgAAAP7///8DAAEA/f///wIAAAD+/wEAAQD//wEAAAD+/wIAAgD9//7/AwABAP3/AAADAAAA/v8AAAEAAAAAAAAA//8AAAEAAAAAAAAAAAAAAP//AAACAAEA/f/+/wQAAQD9/wAAAQAAAAAAAAD//wAAAgD/////AgAAAP////8AAAEAAAAAAAAAAQABAP7///8BAAEA/////wEAAAAAAAEA/////wIAAQD+////AAAAAAEAAAD//wEAAQD//wAAAQAAAP///v8AAAQAAQD8////AgAAAAAAAQD/////AQABAP///v8BAAIA/////wEAAAD//wEAAQD+////AgABAP////8AAAEAAQD///7/AQADAP///f8CAAIA/f8AAAIA/////wEAAQD//wAAAQD//wAAAAAAAAAA//8BAAEA//8AAAAA//8BAAIA/v/9/wIAAwD///3/AAADAAEA/f///wMAAAD9/wAAAgABAP////8BAAEA/////wAA//8AAAMAAAD+/wEAAQD//wAAAAD//wAAAAAAAAMAAAD7/wEABQD+//3/AgABAP7///8CAAEA////////AQACAAAA/f/+/wMAAwD+//3/AgADAP7//f8BAAIAAAD/////AAACAAEA/////wAAAAAAAAEAAQD+//7/AgADAP///f8AAAIAAQD/////AQABAP////8BAAAA//8BAAEA/////wEAAQD/////AAABAAEA/////wEAAAD//wEAAAD+/wEAAwD///3/AQACAP////8BAAEA///+/wIAAwD9//3/AgADAAAA/v///wAAAgABAP3///8DAAEA/f8AAAMA///+/wEAAQD/////AQABAP////8BAAIA///9/wEAAgD/////AQABAP////8BAAEA/////wAAAQABAP///v8AAAMAAQD9/wAAAgAAAP//AAAAAP//AQAAAP//AQABAP////8BAAEAAAD///7/AgACAP3//v8DAAIA/f///wMAAAD+/wEAAQD+////AgABAP////8BAAIA///9/wAAAwABAP7//v8BAAQA///7/wEAAwD//wAAAgD+//3/AgADAP///f8AAAMAAQD+////AAAAAAEAAQD/////AQAAAAAAAgD///3/AQADAP///v8BAAAA//8BAAIA///9/wEAAwD///7/AQABAP////8AAAEAAQAAAP////8AAAEAAgD+//z/AgAEAAAA/f/+/wEAAwABAPz//v8EAAIA/f/+/wEAAQABAAAA/v8AAAMAAAD8/wAAAwAAAP//AQAAAP7/AQACAP7//v8CAAIA/////wEAAAD+/wAAAgAAAP//AAAAAAAAAQAAAP//AAAAAAAAAQABAP7//v8DAAIA/f/+/wIAAgAAAAAA/v///wMAAAD9/wAAAgAAAP//AgABAP7//v8AAAMAAQD8////BQABAPv/AAAEAP///f8CAAIA/v///wIAAgD+//3/AQACAAEA///+/wAAAgACAP///f8AAAIAAQD///7/AAACAAAA//8AAAAAAAABAAAA//8AAAAAAAABAAAA/v///wIAAgD///7/AAACAAEA///+/wAAAgABAP7//v8CAAMA///9/wAAAwAAAP3/AAACAAAA/v8AAAMAAAD9/wAAAgAAAP//AQAAAP7/AQABAP7/AAACAAAA//8AAAEAAAD//wAAAQAAAP//AAABAAAAAAD/////AwACAPz//f8FAAMA+//+/wMAAgD///7/AAABAAEA/////wEAAAAAAAEA///+/wEAAgAAAP//AAAAAAAAAgAAAPz///8EAAIA/P///wMAAAD//wEAAAD+/wAAAgAAAP//AAAAAAAAAQAAAP//AAABAAAA//8BAAAA//8BAAAA//8BAAEA/////wAAAAABAAEA///+/wAAAgABAP////8AAAAAAQAAAP7/AAADAAAA/f8BAAIA/////wAAAQAAAP//AQABAP7//v8EAAIA+////wUAAQD8////AgD//wAAAgD///7/AQACAP////8BAP////8CAAAA/v8BAAIA/v/+/wMAAgD9////AgAAAP//AQAAAP//AQABAP7///8DAAAA/P8BAAUA///7/wEAAwD/////AAAAAAEAAAD//wEAAQD9////BAABAPz///8EAAEA/f///wIAAAD+/wIAAQD9/wEAAwD+//3/AgACAP7///8CAAAA/v8AAAIAAQD9////AwAAAP7/AAABAP////8CAAEA/////wAAAgAAAP3/AAACAAAAAAAAAP7/AAAEAAAA+/8AAAQAAAD+/wAAAAD//wEAAgD///7/AAABAAAAAAABAP7//v8DAAMA///8//7/BAADAP3//f8CAAIA//8AAAAA//8BAAEA/////wAAAQABAP////8BAAAA//8BAAIA/v/9/wMAAwD9//3/AgADAP7//v8CAAEA/v///wIAAQD//wAA/////wIAAQD+////AgABAP////8AAAEAAQD/////AgAAAP3/AQADAP///f8BAAMAAAD+//7/AQACAP////8BAAEAAAD/////AQABAP7///8CAAEA/////wEAAQD/////AAABAAAA/////wAAAwABAP3//v8BAAMAAAD9/wAAAgD/////AwAAAPv/AQAFAP///P8BAAMA/v/+/wMAAQD9////AwAAAP3/AQADAP7//f8EAAMA+//9/wQAAwD9//7/AgAAAAAAAQD/////AQAAAP//AgACAPz//v8FAAEA+v///wUAAgD9//7/AgADAP///P8AAAMA/////wIA///+/wMAAQD9/wAAAQD//wEAAgD+//3/AQAEAAAA+/8AAAUAAAD8/wEAAwD+//7/AQABAAAAAAAAAP//AAABAAAA//8AAAEAAAAAAP////8BAAEA///+/wEABAABAPv//f8FAAMA/P/9/wMAAwD9//7/AwACAP3//v8DAAEA/v8AAAEA/////wIAAQD9////BAAAAPz/AgAEAP3//P8CAAMAAAD+////AgABAP7///8CAAEA/f8AAAMA/////wIA///9/wIAAwD+//7/AQABAAEA///9/wEABAAAAPz///8EAAEA/P///wMAAQD+////AgACAP7//f8BAAMAAAD+/wAAAAAAAAIAAQD9//3/BAAFAPz/+v8DAAYA/v/7/wEABAAAAP3/AAABAAAAAQAAAP7/AAADAAAA/P8AAAQAAAD9/wEAAgD//wAAAAD+/wAAAwAAAP3/AQACAP7/AAADAP///P8BAAQA///8/wAAAwABAP7///8CAAAA/v8BAAEA/////wEAAQD//wAAAQAAAP7///8EAAEA+////wUAAQD8/wAAAgD/////AgABAP3///8DAAEA/v///wEAAQAAAP////8BAAIA///+/wEAAQAAAAAAAAD//wAAAQD//wAAAgD///7/AgABAP7/AQACAP7///8CAAAA//8BAAAA/v8BAAMA/v/9/wIAAwD+//7/AwAAAP3/AgACAPz///8FAP//+/8DAAUA/P/7/wMABAD///3///8DAAIA/f/+/wMAAQD8/wAABAD///7/AgABAP3///8DAAEA/f///wMAAQD+/wAAAQD/////AQABAAAA/v///wMAAQD9////AwABAP3///8DAAEA/f///wIAAQD/////AAABAAIA///9/wEAAwAAAP3///8CAAEAAAD/////AQACAP///f8BAAIA/////wEAAQD//wAAAQD+////AgAAAP//AQAAAP7/AgAEAPv/+/8GAAQA+//+/wQAAAD9/wIAAQD9/wAAAwAAAP7/AAABAAAAAAAAAP//AAACAAAA/f///wMAAgD9//7/AwACAP7//v8BAAIAAAD9////BAABAPz/AAADAAAA//8AAP7/AAAEAAAA/P8AAAMAAAD+/wAAAAD//wIAAgD9//7/BAACAPz//v8CAAAAAAACAP///v8CAAEA/f8AAAQA///7/wEABgAAAPr///8FAAEA/P8AAAQA///8/wEABAD///z/AQADAP////8BAAAAAAAAAP7/AQADAP3//f8DAAIA//8AAAAA/v8AAAMAAQD+//3/AQAEAP7//f8DAAIA/P///wYAAQD6////BAAAAP7/AQAAAP//AQABAP////8BAAEAAAD+/wAABAD///v/AQAFAAAA+////wQAAgD+//7/AAABAAEAAQD+//3/AwAEAP7//P8AAAMAAQD///7///8DAAIA/f/+/wIAAgD///7/AQACAP///v8AAAEAAAAAAAAA//8BAAIA///+/wAAAgAAAP7/AAABAAAAAAABAAAA/v8AAAMAAAD8/wAAAwAAAP//AAAAAAAAAQAAAP//AQD///7/AwADAP3//P8DAAQA/v/9/wAAAgABAP//AAABAAAA//8AAAAA//8BAAEA/v8AAAMAAQD9//7/AgABAP7///8CAAEA//8AAAAAAAAAAP////8CAAEA/f8AAAQAAAD7/wAABQAAAPz///8DAAIA/v/+/wEA", "WAAPI", "wav", true);
		var silentAudioFilePlay =
			function()
			{
				if (!CB_Speaker._silentAudioFilePlayed)
				{
					CB_Speaker._silentAudioFilePlayed = true;
					/////CB_Speaker.playFileBase(CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/audio/sounds/blank");
				  
					if (CB_AudioDetector.isAPISupported("AAPI", false))
					{
						createSilentAudioFile(CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/audio/sounds/blank.mp3", "AAPI", "mp3");
						createSilentAudioFile(CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/audio/sounds/blank.mp3", "AAPI", "ogg");
						createSilentAudioFile(CB_scriptPath + CB_Configuration[CB_BASE_NAME].SCRIPT_PATH + "audiovisual/audio/sounds/blank.mp3", "AAPI", "wav");
					}
				}
				if (!CB_Speaker._silentAudioFilePlayedWAAPI && CB_AudioDetector.isAPISupported("WAAPI", false))
				{
					var extensions = [ "mp3", "ogg", "wav" ];
					var allNull = true;
					for (var x = 0; x < 3; x++)
					{
						if (silentAudioFiles["WAAPI"][extensions[x]] !== null)
						{
							allNull = false;
							if (silentAudioFiles["WAAPI"][extensions[x]].getStatusString() === "UNCHECKED")
							{
								new function(x)
								{
									var finishedChecking =
										function(error, checkedFine)
										{
											silentAudioFiles["WAAPI"][extensions[x]].destructor(true, false, true, false);
											silentAudioFiles["WAAPI"][extensions[x]] = null;
										};
									silentAudioFiles["WAAPI"][extensions[x]].checkPlaying(function() { finishedChecking("", true); }, finishedChecking, false, true, false);
								}(x);
							}
						}
					}
					//If all objects are null it means all have either played or failed:
					if (allNull) { CB_Speaker._silentAudioFilePlayedWAAPI = true; }
				}
			  
			};
		CB_Events.add(document, "click", silentAudioFilePlay, true, true, false);
		/////CB_Events.add(document, "touchstart", silentAudioFilePlay, true, true, false);
	}
	
	
	
	//Applies the current volume to all objects:
	CB_Speaker._applyVolume = function(volume, isMuteOrUnmute, forceSetVolumeProperty, functionToExecute, audioFiles, avoidSanitize)
	{
		//If there is no sprites pool object, just exits:
		if (typeof(CB_Speaker._audioFileSpritesPool) === "undefined" || CB_Speaker._audioFileSpritesPool === null) { return; }
	
		if (!avoidSanitize)
		{
			volume = CB_Speaker.sanitizeVolume(volume, true); //Uses CB_Speaker._volume if the value is not valid.
		}
		
		//If we want either to mute or unmute:
		if (isMuteOrUnmute)
		{
			//If volume is zero, we want to mute:
			if (volume === 0) { CB_Speaker._audioFileSpritesPool.muteAll(functionToExecute, audioFiles); }
			//...otherwise, we want to unmute:
			else { CB_Speaker._audioFileSpritesPool.unmuteAll(functionToExecute, audioFiles); }
		}
		//...otherwise, we just set the volume given:
		else
		{
			CB_Speaker._audioFileSpritesPool.setVolumeAll(volume, forceSetVolumeProperty, functionToExecute, audioFiles);
		}
	}
	
	
	/**
	 * Sanitizes the volume (it does not allow values greater than 100 or lower than 0).
	 *  @function
	 *  @param {number} [volume=CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME|CB_Speaker._volume] - The desired volume to be sanitized. If not given, it will use the current volume if the "useSpeakerVolumeIfNaN" parameter is set to true or the default volume otherwise.
	 *  @param {boolean} [useSpeakerVolumeIfNaN=false] - If it is set to true and no valid volume is received in the "volume" parameter, it will use the current volume ({@link CB_Speaker._volume}). Otherwise, if it is set to false and no valid volume is received in the "volume" parameter, it will use the default volume which is set in the {@link CB_Configuration.CrossBase.CB_Speaker_DEFAULT_VOLUME} constant.
	 *  @returns {number} Returns the volume sanitized (it does not allow values greater than 100 or lower than 0).
	 */
	CB_Speaker.sanitizeVolume = function(volume, useSpeakerVolumeIfNaN)
	{
		volume = parseInt(volume);
		if (isNaN(volume)) { volume = useSpeakerVolumeIfNaN ? CB_Speaker._volume : CB_Configuration[CB_BASE_NAME].CB_Speaker_DEFAULT_VOLUME; }
		
		//Sets the volume within their limits if it is beyond them:
		if (volume > 100) { volume = 100; }
		else if (volume < 0) { volume = 0; }
		
		return volume;
	}
	
	
	/**
	 * Sets the given volume.
	 *  @function
	 *  @param {number} [volume=CB_Speaker._volume] - The desired volume to be used (it will be sanitized internally by calling the {@link CB_Speaker.sanitizeVolume} function with the volume as the unique parameter). If not given, it will use the current volume. If the "avoidApplyingVolume" is set to false and the "isMuteOrUnmute" parameter is false, it will also be used as a parameter to call the {@link CB_AudioFileSpritesPool#setVolumeAll} method of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool} (if any).
	 *  @param {boolean} [avoidApplyingVolume=false] - If it is set to true, the volume will not be applied (by calling the {@link CB_Speaker._applyVolume} internal function, which will also use the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool}, if any) and just the {@link CB_Speaker._volume} internal property will be set.
	 *  @param {boolean} [forceSetVolumeProperty=false] - If the "avoidApplyingVolume" is set to false and the "isMuteOrUnmute" parameter is false, it will be used as a parameter to call the {@link CB_AudioFileSpritesPool#setVolumeAll} method of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool} (if any).
	 *  @param {function} [functionToExecute] - A callback function. If the "avoidApplyingVolume" is set to false and the "isMuteOrUnmute" parameter is false, it will be used as the "onSetVolume" parameter to call the {@link CB_AudioFileSpritesPool#setVolumeAll} method of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool} (if any). If the "avoidApplyingVolume" is set to false and the "isMuteOrUnmute" parameter is true, it will be used as the "onMute" parameter to call the {@link CB_AudioFileSpritesPool#muteAll} method or as the "onUnmute" parameter to call the {@link CB_AudioFileSpritesPool#unmuteAll} method of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool} (if any).
	 *  @param {array} [audioFiles] - An array containing the CB_AudioFile objects that we want to affect (if not set and the "avoidApplyingVolume" is set to false, it will affect all the CB_AudioFile objects of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool}, if any). If the "avoidApplyingVolume" is set to false and the "isMuteOrUnmute" parameter is false, it will be used as the "audioFiles" parameter to call the {@link CB_AudioFileSpritesPool#setVolumeAll} method of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool} (if any). If the "avoidApplyingVolume" is set to false and the "isMuteOrUnmute" parameter is true, it will be used as the "audioFiles" parameter to call the {@link CB_AudioFileSpritesPool#muteAll} method or as the "audioFiles" parameter to call the {@link CB_AudioFileSpritesPool#unmuteAll} method of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool} (if any).
	 *  @param {boolean} [saveForUnmute=false] - If it is set to true, the given volume will be saved to be restored later when the {@link CB_Speaker.unmute} method is called.
	 *  @param {boolean} [isMuteOrUnmute=false] - If it is set to true and the volume given is zero, the action performed internally will be muting (by calling the {@link CB_AudioFileSpritesPool#muteAll} method of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool}, if any). Otherwise, if it is set to true and the volume given is not zero, the action performed internally will be unmuting (by calling the {@link CB_AudioFileSpritesPool#unmuteAll} method of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool}, if any). If it is set to false, the action performed will be set the volume given (by calling the {@link CB_AudioFileSpritesPool#setVolumeAll} method of the internal {@link CB_AudioFileSpritesPool} object defined in {@link CB_Speaker._audioFileSpritesPool}, if any).
	 *  @returns {number} Returns the current volume being used after setting it.
	 *	@todo Also affect BandJS, jsfx and timbre.js.
	 */
	CB_Speaker.setVolume = function(volume, avoidApplyingVolume, forceSetVolumeProperty, functionToExecute, audioFiles, saveForUnmute, isMuteOrUnmute)
	{
		volume = CB_Speaker.sanitizeVolume(volume);
		if (saveForUnmute && CB_Speaker._volume > 0) { CB_Speaker._volumeBeforeMute = CB_Speaker._volume; } //Only saves it if the current volume is more than zero.
		CB_Speaker._volume = volume;
		if (!avoidApplyingVolume) { CB_Speaker._applyVolume(volume, isMuteOrUnmute, forceSetVolumeProperty, functionToExecute, audioFiles, true); }
		return CB_Speaker._volume;
	}
	
	
	/**
	 * Mutes the speaker. Calls the {@link CB_Speaker.setVolume} function internally, with 0 (zero) as the "volume" parmeter, null as the "forceSetVolumeProperty" parameter and true for both "saveForUnmute" and "isMuteOrUnmute" parameters.
	 *  @function
	 *  @param {boolean} [avoidApplyingVolume=false] - Used as a parameter to call the {@link CB_Speaker.setVolume} function internally.
	 *  @param {function} [onMute] - Used as as the "functionToExecute" parameter to call the {@link CB_Speaker.setVolume} function internally.
	 *  @param {array} [audioFiles] - Used as a parameter to call the {@link CB_Speaker.setVolume} function internally.
	 *  @returns {number} Returns the result of the internal call to the {@link CB_Speaker.setVolume} function.
	 *	@todo Also affect BandJS, jsfx and timbre.js.
	 */
	CB_Speaker.mute = function(avoidApplyingVolume, onMute, audioFiles)
	{
		return CB_Speaker.setVolume(0, avoidApplyingVolume, null, onMute, audioFiles, true, true);
	}


	/**
	 * Restores the audio volume after muting it. If the current volume is 0 (zero, muted) or the "ignoreVolume" parameter is set to true, calls the {@link CB_Speaker.setVolume} function internally, with the previously-saved volume before muting it as the "volume" parmeter, null as the "forceSetVolumeProperty" parameter, false for the "saveForUnmute" parameter and true for the "isMuteOrUnmute" parameter.
	 *  @function
	 *  @param {boolean} [avoidApplyingVolume=false] - Used as a parameter to call the {@link CB_Speaker.setVolume} function internally, if the "ignoreVolume" parameter is set to true.
	 *  @param {function} [onUnmute] - Used as as the "functionToExecute" parameter to call the {@link CB_Speaker.setVolume} function internally, if the "ignoreVolume" parameter is set to true.
	 *  @param {array} [audioFiles] - Used as a parameter to call the {@link CB_Speaker.setVolume} function internally, if the "ignoreVolume" parameter is set to true.
	 *  @param {boolean} [ignoreVolume=false] - If set to true, it will try to perform the muting action even when the current volume is not 0 (zero, muted).
	 *  @returns {number} Returns the current volume.
	 *	@todo Also affect BandJS, jsfx and timbre.js.
	 */
	CB_Speaker.unmute = function(avoidApplyingVolume, onUnmute, audioFiles, ignoreVolume)
	{
		if (CB_Speaker._volume === 0 || ignoreVolume)
		{
			CB_Speaker.setVolume(CB_Speaker._volumeBeforeMute, avoidApplyingVolume, null, onUnmute, audioFiles, false, true);
		}
		return CB_Speaker._volume;
	}

	
	/**
	 * Tells the current volume.
	 *  @function
	 *  @param {boolean} [avoidSanitize=false] - If set to true, it will not call the {@link CB_Speaker.sanitizeVolume} function internally before returning the volume.
	 *  @returns {number} Returns the current volume.
	 */
	CB_Speaker.getVolume = function(avoidSanitize)
	{
		if (!avoidSanitize) { CB_Speaker._volume = CB_Speaker.sanitizeVolume(CB_Speaker._volume); }
		return CB_Speaker._volume;
	}
	
	
	/**
	 * Sets the desired {@link CB_AudioFileSpritesPool} object.
	 *  @function
	 *  @param {CB_AudioFileSpritesPool} audioFileSpritesPool - The desired {@link CB_AudioFileSpritesPool} object to manage all audio files.
	 *  @returns {CB_AudioFileSpritesPool|null} Returns the current {@link CB_AudioFileSpritesPool} object after setting it (if any) or null otherwise.
	 */
	CB_Speaker.setAudioFileSpritesPool = function(audioFileSpritesPool)
	{
		//if (typeof(audioFileSpritesPool) !== "undefined" && audioFileSpritesPool !== null && audioFileSpritesPool instanceof CB_AudioFileSpritesPool)
		if (audioFileSpritesPool instanceof CB_AudioFileSpritesPool)
		{
			CB_Speaker._audioFileSpritesPool = audioFileSpritesPool;
		}
		return CB_Speaker._audioFileSpritesPool;
	}


	/**
	 * Returns the current {@link CB_AudioFileSpritesPool} object (if any).
	 *  @function
	 *  @returns {CB_AudioFileSpritesPool|null} Returns the current {@link CB_AudioFileSpritesPool} object (if any) or null otherwise.
	 */
	CB_Speaker.getAudioFileSpritesPool = function()
	{
		return CB_Speaker._audioFileSpritesPool || null;
	}

	
	/**
	 * Returns the [timbre.js]{@link https://mohayonao.github.io/timbre.js/} object (if any). Useful for functional processing and synthesizing audio.
	 *  @function
	 *  @returns {Object|null} Returns the current [timbre.js]{@link https://mohayonao.github.io/timbre.js/} object (if any) or null otherwise.
	 *  @todo timbre.js should have into account the CB_Speaker._volume
	 */
	CB_Speaker.getTimbreJSObject = function()
	{
		return CB_Speaker._timbreJSObject || null;
	}

	
	/**
	 * Returns a new [Band.js]{@link https://github.com/meenie/band.js/} object (if possible). Useful for managing music composition.
	 *  @function
	 *  @returns {Object|null} Returns a new [Band.js]{@link https://github.com/meenie/band.js/} object (if possible) or null otherwise.
	 *  @todo Band.js should have into account the CB_Speaker._volume
	 */
	CB_Speaker.getBandJSObject = function()
	{
		return CB_Speaker._bandJSObject ? new CB_Speaker._bandJSObject() : null;
	}
	

	/**
	 * Returns the [jsfx]{@link https://github.com/loov/jsfx} object (if any). Useful for managing sound effects generation.
	 *  @function
	 *  @returns {Object|null} Returns the current [jsfx]{@link https://github.com/loov/jsfx} object (if any) or null otherwise.
	 *  @todo jsfx should have into account the CB_Speaker._volume
	 */
	CB_Speaker.getJsfxObject = function()
	{
		return CB_Speaker._jsfxObject || null;
	}

	
} //End of the static class CB_Speaker.