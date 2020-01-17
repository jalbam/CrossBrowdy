/**
 * @file Keyboard management (and other devices which also fire [keyboard events]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent} as TV remote controls, game consoles' gamepads, etc.). Contains the {@link CB_Keyboard} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */

/**
 * Static class to manage the keyboard and other input devices that generate key codes. It will return itself if it is tried to be instantiated.
 * @namespace
 */
var CB_Keyboard = function() { return CB_Keyboard; };
{
	//CB_Keyboard.onKeyPressFunction; //Function that is executed when a key is pressed (onKeyPress event).
	//CB_Keyboard.onKeyDownFunction; //Function that is executed when a key is down (onKeyDown event).
	//CB_Keyboard.onKeyUpFunction; //Function that is executed when a key is released (onKeyUp event).
	//CB_Keyboard.firstEvent = ""; //Defines wheter the first event captured is onKeyDown or onKeyPress (compatibility reasons).
	//CB_Keyboard.onKeyDownOrPressFunction; //Function that is executed when either a key is down os pressed (onKeyDown or onKeyPress event)

	/**
	 * Object that will store the status for each key detected, using the key code as index and a boolean as their value (true when down or false when released).
	 *	@var
	 *  @readonly
	 *  @type {Object}
	 *  @default
	 */
	CB_Keyboard.keysDown = {};

	
	/**
	 * Array with the codes of the keys pressed recently (it will be cleared after the chosen milliseconds set with the {@link CB_Keyboard.setKeysPressedExpiration} function).
	 *	@var
	 *  @readonly
	 *  @type {array}
	 *  @default
	 */
	CB_Keyboard.keysPressed = [];
	CB_Keyboard._keysPressedExpiration = 500; //Milliseconds before keys pressed array expires.
	CB_Keyboard._keysPressedExpirationTimeout = null; //It will store the timeout that clears the keys pressed array.
	
	
	/**
	 * Array with the codes of the string typed recently (it will be cleared after the chosen milliseconds set with the {@link CB_Keyboard.setTypedStringExpiration} function).
	 *	@var
	 *  @readonly
	 *  @type {array}
	 *  @default
	 */
	CB_Keyboard.typedStringCodes = [];

	
	/**
	 * Stores the string typed recently (it will be cleared after the chosen milliseconds set with the {@link CB_Keyboard.setTypedStringExpiration} function).
	 *	@var
	 *  @readonly
	 *  @type {string}
	 *  @default
	 */
	CB_Keyboard.typedString = ""; //Stores the string typed (it will be cleared after some milliseconds).
	CB_Keyboard._typedStringExpiration = 500; //Milliseconds before typed string expires.
	CB_Keyboard._typedStringExpirationTimeout = null; //It will store the timeout that clears the typed string.
	
	
	CB_Keyboard.initialized = false; //It will tells whether the object has been initialized or not.

	
	/**
	  Property that keeps extended key codes for different systems and platforms.
	  * @namespace CB_Keyboard.extended
	 */
	 CB_Keyboard.extended = {};
	
	/**
	 * Smart TV Alliance and virtual keyboard key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name VK
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @todo Consider adding more (found in {@link https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx} and {@link http://nehe.gamedev.net/article/msdn_virtualkey_codes/15009/})
	 *  @property {number} ENTER - ENTER key.
	 *  @property {number} PAUSE - PAUSE key.
	 *  @property {number} PAGE_UP - PAGE UP key.
	 *  @property {number} PAGE_DOWN - PAGE DOWN key.
	 *  @property {number} LEFT - LEFT key.
	 *  @property {number} UP - UP key.
	 *  @property {number} RIGHT - RIGHT key.
	 *  @property {number} DOWN - DOWN key.
	 *  @property {number} _0 - 0 (zero) key.
	 *  @property {number} _1 - 1 key.
	 *  @property {number} _2 - 2 key.
	 *  @property {number} _3 - 3 key.
	 *  @property {number} _4 - 4 key.
	 *  @property {number} _5 - 5 key.
	 *  @property {number} _6 - 6 key.
	 *  @property {number} _7 - 7 key.
	 *  @property {number} _8 - 8 key.
	 *  @property {number} _9 - 9 key.
	 *  @property {number} 0 - Alias for {@link CB_Keyboard.extended.VK._0}.
	 *  @property {number} 1 - Alias for {@link CB_Keyboard.extended.VK._1}.
	 *  @property {number} 2 - Alias for {@link CB_Keyboard.extended.VK._2}.
	 *  @property {number} 3 - Alias for {@link CB_Keyboard.extended.VK._3}.
	 *  @property {number} 4 - Alias for {@link CB_Keyboard.extended.VK._4}.
	 *  @property {number} 5 - Alias for {@link CB_Keyboard.extended.VK._5}.
	 *  @property {number} 6 - Alias for {@link CB_Keyboard.extended.VK._6}.
	 *  @property {number} 7 - Alias for {@link CB_Keyboard.extended.VK._7}.
	 *  @property {number} 8 - Alias for {@link CB_Keyboard.extended.VK._8}.
	 *  @property {number} 9 - Alias for {@link CB_Keyboard.extended.VK._9}.
	 *  @property {number} REWIND - RW (REWIND) key.
	 *  @property {number} STOP - STOP key.
	 *  @property {number} PLAY - PLAY key.
	 *  @property {number} FAST_FWD - FF (FAST FORWARD) key.
	 *  @property {number} BACK - BACK key.
	 *  @property {number} PREV - PREVIOUS key.
	 *  @property {number} NEXT - NEXT key.
	 *  @property {number} INFO - INFORMATION key.
	 *  @property {number} RED - RED key.
	 *  @property {number} GREEN - GREEN key.
	 *  @property {number} YELLOW - YELLOW key.
	 *  @property {number} BLUE - BLUE key.
	 *  @property {number} SPACE - SPACE key.
	 *  @property {number} BACK_SPACE - BACK SPACE key.
	 *  @property {number} A - A key.
	 *  @property {number} B - B key.
	 *  @property {number} C - C key.
	 *  @property {number} D - D key.
	 *  @property {number} E - E key.
	 *  @property {number} F - F key.
	 *  @property {number} G - G key.
	 *  @property {number} H - H key.
	 *  @property {number} I - I key.
	 *  @property {number} J - J key.
	 *  @property {number} K - K key.
	 *  @property {number} L - L key.
	 *  @property {number} M - M key.
	 *  @property {number} N - N key.
	 *  @property {number} O - O key.
	 *  @property {number} P - P key.
	 *  @property {number} Q - Q key.
	 *  @property {number} R - R key.
	 *  @property {number} S - S key.
	 *  @property {number} T - T key.
	 *  @property {number} U - U key.
	 *  @property {number} V - V key.
	 *  @property {number} W - W key.
	 *  @property {number} X - X key.
	 *  @property {number} Y - Y key.
	 *  @property {number} Z - Z key.
	 *  @property {number} VOLUME_UP - VOLUME UP key.
	 *  @property {number} VOLUME_DOWN - VOLUME DOWN key.
	 *  @property {number} MUTE - MUTE key.
	 *  @property {number} PLAY_PAUSE - PLAY/PAUSE key.
	 *  @property {number} HELP - HELP key.
	 *  @property {number} SUBTITLE - SUBTITLE key.
	 *  @property {number} SEARCH - SEARCH key.
	 *  @property {number} AUDIODESCRIPTION - AUDIODESCRIPTION key.
	 *  @property {number} HD - HD (High Definition) key.
	 */
	CB_Keyboard.extended.VK =
	{	
		//* Source: http://smarttv-alliance.org/Markets/Developers.aspx
		ENTER: window.VK_ENTER || 13,
		PAUSE: window.VK_PAUSE || 19,
		PAGE_UP: window.VK_PAGE_UP || 33,
		PAGE_DOWN: window.VK_PAGE_DOWN || 34,
		LEFT: window.VK_LEFT || 37,
		UP: window.VK_UP || 38,
		RIGHT: window.VK_RIGHT || 39,
		DOWN: window.VK_DOWN || 40,
		_0: window.VK_0 || 48,
		_1: window.VK_1 || 49,
		_2: window.VK_2 || 50,
		_3: window.VK_3 || 51,
		_4: window.VK_4 || 52,
		_5: window.VK_5 || 53,
		_6: window.VK_6 || 54,
		_7: window.VK_7 || 55,
		_8: window.VK_8 || 56,
		_9: window.VK_9 || 57,
		REWIND: window.VK_REWIND || 412,
		STOP: window.VK_STOP || 413,
		PLAY: window.VK_PLAY || 415,
		FAST_FWD: window.VK_FAST_FWD || 417,
		BACK: window.VK_BACK || 461,
		PREV: window.VK_PREV || 424,
		NEXT: window.VK_NEXT || 425,
		INFO: window.VK_INFO || 457,
		RED: window.VK_RED || 403,
		GREEN: window.VK_GREEN || 404,
		YELLOW: window.VK_YELLOW || 405,
		BLUE: window.VK_BLUE || 406,
		
		//More virtual keyboard keys:
		//* Source: https://fmtvp.github.io/tal/jsdoc/symbols/src/antie_static_script_events_keyevent.js.html
		SPACE: window.VK_SPACE || 32,
		BACK_SPACE: window.VK_BACK_SPACE || 8,
		A: window.VK_A || 65,
		B: window.VK_B || 66,
		C: window.VK_C || 67,
		D: window.VK_D || 68,
		E: window.VK_E || 69,
		F: window.VK_F || 70,
		G: window.VK_G || 71,
		H: window.VK_H || 72,
		I: window.VK_I || 73,
		J: window.VK_J || 74,
		K: window.VK_K || 75,
		L: window.VK_L || 76,
		M: window.VK_M || 77,
		N: window.VK_N || 78,
		O: window.VK_O || 79,
		P: window.VK_P || 80,
		Q: window.VK_Q || 81,
		R: window.VK_R || 82,
		S: window.VK_S || 83,
		T: window.VK_T || 84,
		U: window.VK_U || 85,
		V: window.VK_V || 86,
		W: window.VK_W || 87,
		X: window.VK_X || 88,
		Y: window.VK_Y || 89,
		Z: window.VK_Z || 90,
		VOLUME_UP: window.VK_VOLUME_UP || 447,
		VOLUME_DOWN: window.VK_VOLUME_DOWN || 448,
		MUTE: window.VK_MUTE || 449,
		PLAY_PAUSE: window.VK_PLAY_PAUSE || 402,
		HELP: window.VK_HELP || 156,
		SUBTITLE: window.VK_SUBTITLE || 460,
		SEARCH: window.VK_SEARCH || 112, //112 is the same code as the F1 key.
		AUDIODESCRIPTION: window.VK_AUDIODESCRIPTION || 113, //113 is the same code as the F2 key.
		HD: window.VK_HD || 114 //114 is the same code as the F3 key.
	};
	CB_Keyboard.extended.VK[0] = CB_Keyboard.extended.VK._0;
	CB_Keyboard.extended.VK[1] = CB_Keyboard.extended.VK._1;
	CB_Keyboard.extended.VK[2] = CB_Keyboard.extended.VK._2;
	CB_Keyboard.extended.VK[3] = CB_Keyboard.extended.VK._3;
	CB_Keyboard.extended.VK[4] = CB_Keyboard.extended.VK._4;
	CB_Keyboard.extended.VK[5] = CB_Keyboard.extended.VK._5;
	CB_Keyboard.extended.VK[6] = CB_Keyboard.extended.VK._6;
	CB_Keyboard.extended.VK[7] = CB_Keyboard.extended.VK._7;
	CB_Keyboard.extended.VK[8] = CB_Keyboard.extended.VK._8;
	CB_Keyboard.extended.VK[9] = CB_Keyboard.extended.VK._9;
	CB_Keyboard.extended.VK._allowDuplicateKeyAliases = CB_Configuration[CB_BASE_NAME].CB_Keyboard_extended_VK_allowDuplicateKeyAliases;
	
	
	/**
	 * Samsung Tizen TV key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name SAMSUNG_TIZEN_TV
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} UP - UP button.
	 *  @property {number} DOWN - DOWN button.
	 *  @property {number} LEFT - LEFT button.
	 *  @property {number} RIGHT - RIGHT button.
	 *  @property {number} ENTER - ENTER button.
	 *  @property {number} MEDIA_PLAY_PAUSE - PLAY/PAUSE MEDIA button.
	 *  @property {number} MEDIA_REWIND - RW (REWIND) MEDIA button.
	 *  @property {number} MEDIA_FORWARD - FW (FORWARD) MEDIA button.
	 *  @property {number} MEDIA_PLAY - PLAY MEDIA button.
	 *  @property {number} MEDIA_PAUSE - PAUSE MEDIA button.
	 *  @property {number} MEDIA_STOP - STOP MEDIA button.
	 *  @property {number} RETURN - RETURN button.
	 *  @property {number} MEDIA_RECORD - RECORD MEDIA button.
	 *  @property {number} MEDIA_TRACK_PREVIOUS - PREVIOUS TRACK MEDIA button.
	 *  @property {number} MEDIA_TRACK_NEXT - NEXT TRACK MEDIA button.
	 *  @property {number} VOLUME_UP - VOLUME UP button.
	 *  @property {number} VOLUME_DOWN - VOLUME DOWN button.
	 *  @property {number} MUTE - MUTE button.
	 *  @property {number} _0 - 0 (zero) button.
	 *  @property {number} _1 - 1 button.
	 *  @property {number} _2 - 2 button.
	 *  @property {number} _3 - 3 button.
	 *  @property {number} _4 - 4 button.
	 *  @property {number} _5 - 5 button.
	 *  @property {number} _6 - 6 button.
	 *  @property {number} _7 - 7 button.
	 *  @property {number} _8 - 8 button.
	 *  @property {number} _9 - 9 button.
	 *  @property {number} 0 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._0}.
	 *  @property {number} 1 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._1}.
	 *  @property {number} 2 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._2}.
	 *  @property {number} 3 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._3}.
	 *  @property {number} 4 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._4}.
	 *  @property {number} 5 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._5}.
	 *  @property {number} 6 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._6}.
	 *  @property {number} 7 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._7}.
	 *  @property {number} 8 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._8}.
	 *  @property {number} 9 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._9}.
	 *  @property {number} RED - RED button.
	 *  @property {number} GREEN - GREEN button.
	 *  @property {number} YELLOW - YELLOW button.
	 *  @property {number} BLUE - BLUE button.
	 *  @property {number} INFO - INFORMATION button.
	 *  @property {number} EXIT - EXIT button.
	 *  @property {number} MINUS - MINUS button.
	 *  @property {number} CAPTION - CAPTION button.
	 *  @property {number} CH_UP - CHANNEL UP button.
	 *  @property {number} CH_DOWN - CHANNEL DOWN button.
	 *  @property {number} CH_PREVIOUS - PREVIOUS CHANNEL button.
	 *  @property {number} CH_LIST - CHANNEL LIST button.
	 *  @property {number} E_MANUAL - E-MANUAL button.
	 *  @property {number} SEARCH - SEARCH button.
	 *  @property {number} _3D - 3D button.
	 *  @property {number} 3D - Alias for {@link CB_Keyboard.extended.SAMSUNG_TIZEN_TV._3D}.
	 *  @property {number} GUIDE - GUIDE button.
	 *  @property {number} SOURCE - SOURCE button.
	 *  @property {number} PICTURE_SIZE - PICTURE SIZE button.
	 *  @property {number} EXTRA - EXTRA button.
	 *  @property {number} SOCCER - SOCCER button.
	 *  @property {number} MTS - MTS (Multichannel Television Sound) button.
	 *  @property {number} TELETEXT - TELETEXT button.
	 *  @property {number} MENU - MENU button.
	 *  @property {number} TOOLS - TOOLS button.
	 */
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV =
	{
		UP:	38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		ENTER: 13,
		MEDIA_PLAY_PAUSE: 10252,
		MEDIA_REWIND: 412,
		MEDIA_FORWARD: 417,
		MEDIA_PLAY: 415,
  	  	MEDIA_PAUSE: 19,
		MEDIA_STOP:	413,
		RETURN:	10009,
		MEDIA_RECORD: 416,
		MEDIA_TRACK_PREVIOUS: 10232,
		MEDIA_TRACK_NEXT: 10233,
		VOLUME_UP: 447,
		VOLUME_DOWN: 448,
		MUTE: 449,
		_0: 48,
		_1: 49,
		_2: 50,
  	  	_3: 51,
		_4: 52,
		_5: 53,
		_6: 54,
		_7: 55,
  	  	_8: 56,
		_9: 57,
		RED: 403,
		GREEN: 404,
		YELLOW: 405,
		BLUE: 406,
		INFO: 457,
		EXIT: 10182,
  	  	MINUS: 189,
		CAPTION: 10221,
		CH_UP: 427,
		CH_DOWN: 428,
		CH_PREVIOUS: 10190,
		CH_LIST: 10073,
		E_MANUAL: 10146,
		SEARCH: 10225,
		_3D: 10199,
		GUIDE: 458,
  	  	SOURCE: 10072,
		PICTURE_SIZE: 10140,
		EXTRA: 10253,
		SOCCER: 10228,
		MTS: 10195,
		TELETEXT: 10200,
  	  	MENU: 457,
  	  	TOOLS: 10135
	};
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[0] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._0;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[1] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._1;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[2] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._2;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[3] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._3;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[4] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._4;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[5] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._5;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[6] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._6;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[7] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._7;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[8] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._8;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV[9] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._9;
	CB_Keyboard.extended.SAMSUNG_TIZEN_TV["3D"] = CB_Keyboard.extended.SAMSUNG_TIZEN_TV._3D;
	
	
	try { var tvKey = new Common.API.TVKeyValue(); } catch(E) { try { tvKey = sf.key; } catch(E) { tvKey = {}; } }
	/**
	 * Samsung TV key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name SAMSUNG_TV
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} TOOLS - TOOLS button.
	 *  @property {number} EMODE - EMODE button.
	 *  @property {number} DMA - DMA (Digital Media Adapter) button.
	 *  @property {number} SOURCE - SOURCE button.
	 *  @property {number} CHDOWN - CHANNEL DOWN button.
	 *  @property {number} CHUP - CHANNEL UP button.
	 *  @property {number} PANEL_CH_UP - CHANNEL UP PANEL button #1.
	 *  @property {number} PANEL_CH_DOWN - CHANNEL DOWN PANEL button #1.
	 *  @property {number} PANEL_CHUP - CHANNEL UP PANEL button #2.
	 *  @property {number} PANEL_CHDOWN - CHANNEL DOWN PANEL button #2.
	 *  @property {number} PIP_CHUP - CHANNEL UP PIP (Picture In Picture) button.
	 *  @property {number} PIP_CHDOWN - CHANNEL DOWN PIP (Picture In Picture) button.
	 *  @property {number} PRECH - PRE-CHANNEL (PREVIOUS CHANNEL) button.
	 *  @property {number} FAVCH - FAVOURITE CHANNEL button.
	 *  @property {number} CHLIST - CHANNEL LIST button.
	 *  @property {number} TTX_MIX - TELETEXT button.
	 *  @property {number} GUIDE - GUIDE button.
	 *  @property {number} ASPECT - ASPECT button.
	 *  @property {number} DOLBY_SRR - DOLBY SRR (SuRroundRight) button.
	 *  @property {number} MTS - MTS (Multichannel Television Sound) button.
	 *  @property {number} WHEELDOWN - WHEEL DOWN #1.
	 *  @property {number} WHEEL_DOWN - WHEEL DOWN #2.
	 *  @property {number} WHEELUP - WHEEL UP #1.
	 *  @property {number} WHEEL_UP - WHEEL UP #2.
	 *  @property {number} WHEELLEFT - WHEEL LEFT #1.
	 *  @property {number} WHEEL_LEFT - WHEEL LEFT #2.
	 *  @property {number} WHEELRIGHT - WHEEL RIGHT #1.
	 *  @property {number} WHEEL_RIGHT - WHEEL RIGHT #2.
	 *  @property {number} SMART - SMART TV button.
	 *  @property {number} EXIT - EXIT button.
	 *  @property {number} POWER - POWER button.
	 *  @property {number} PANEL_POWER - POWER PANEL button.
	 *  @property {number} POWEROFF - POWER OFF button.
	 *  @property {number} POWERON - POWER ON button.
	 *  @property {number} CONTENT - CONTENT button.
	 *  @property {number} WLINK - WLINK (Wiselink) button #1.
	 *  @property {number} W_LINK - WLINK (Wiselink) button #2.
	 *  @property {number} EMPTY - EMPTY button.
	 *  @property {number} CC - CC (Closed Captioning) button.
	 *  @property {number} REC - REC button.
	 *  @property {number} VOLUP - VOLUME UP button #1.
	 *  @property {number} VOL_UP - VOLUME UP button #2.
	 *  @property {number} VOLDOWN - VOLUME DOWN button #1.
	 *  @property {number} VOL_DOWN - VOLUME DOWN button #2.
	 *  @property {number} PANEL_VOLUP - PANEL VOLUME UP button #1.
	 *  @property {number} PANEL_VOL_UP - PANEL VOLUME UP button #2.
	 *  @property {number} PANEL_VOLDOW - PANEL VOLUME DOWN button #1.
	 *  @property {number} PANEL_VOLDOWN - PANEL VOLUME DOWN button #2.
	 *  @property {number} PANEL_VOL_DOWN - PANEL VOLUME DOWN button #3.
	 *  @property {number} MUTE - MUTE button.
	 *  @property {number} INFO - INFORMATION button.
	 *  @property {number} INFOLINK - INFOLINK button.
	 *  @property {number} MENU - MENU button.
	 *  @property {number} SUBTITLE - SUBTITLE button #1.
	 *  @property {number} SUB_TITLE - SUBTITLE button #2.
	 *  @property {number} PANEL_SOURCE - SOURCE PANEL button.
	 *  @property {number} _0 - 0 (zero) button.
	 *  @property {number} _1 - 1 button.
	 *  @property {number} _2 - 2 button.
	 *  @property {number} _3 - 3 button.
	 *  @property {number} _4 - 4 button.
	 *  @property {number} _5 - 5 button.
	 *  @property {number} _6 - 6 button.
	 *  @property {number} _7 - 7 button.
	 *  @property {number} _8 - 8 button.
	 *  @property {number} _9 - 9 button.
	 *  @property {number} _10 - 10 button.
	 *  @property {number} _11 - 11 button.
	 *  @property {number} _12 - 12 button.
	 *  @property {number} 0 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._0}.
	 *  @property {number} 1 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._1}.
	 *  @property {number} 2 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._2}.
	 *  @property {number} 3 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._3}.
	 *  @property {number} 4 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._4}.
	 *  @property {number} 5 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._5}.
	 *  @property {number} 6 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._6}.
	 *  @property {number} 7 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._7}.
	 *  @property {number} 8 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._8}.
	 *  @property {number} 9 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._9}.
	 *  @property {number} 10 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._10}.
	 *  @property {number} 11 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._11}.
	 *  @property {number} 12 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._12}.
	 *  @property {number} RED - RED button.
	 *  @property {number} GREEN - GREEN button.
	 *  @property {number} YELLOW - YELLOW button.
	 *  @property {number} BLUE - BLUE button.
	 *  @property {number} CYAN - CYAN button.
	 *  @property {number} RW - RW (REWIND) button #1.
	 *  @property {number} REWIND - RW (REWIND) button #2.
	 *  @property {number} REWIND_ - RW (REWIND) button #3.
	 *  @property {number} FF - FF (FAST FORWARD) button #1.
	 *  @property {number} FF_ - FF (FAST FORWARD) button #2.
	 *  @property {number} PAUSE - PAUSE button.
	 *  @property {number} PLAY - PLAY button.
	 *  @property {number} STOP - STOP button.
	 *  @property {number} SEARCH - SEARCH button.
	 *  @property {number} UP - UP button.
	 *  @property {number} DOWN - DOWN button.
	 *  @property {number} LEFT - LEFT button.
	 *  @property {number} RIGHT - RIGHT button.
	 *  @property {number} CH_UP - CHANNEL UP button.
	 *  @property {number} CH_DOWN - CHANNEL DOWN button.
	 *  @property {number} DISC_MENU - DISC MENU button.
	 *  @property {number} _3D - 3D button.
	 *  @property {number} 3D - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._3D}.
	 *  @property {number} PIP_ONOFF - PIP (Picture In Picture) ON/OFF button.
	 *  @property {number} AD - AD (Audio Description) button.
	 *  @property {number} PMODE - PICTURE MODE button.
	 *  @property {number} SMODE - SOUND MODE button.
	 *  @property {number} SLEEP - SLEEP button.
	 *  @property {number} D_AUDIO - DIGITAL AUDIO button.
	 *  @property {number} D_FRONT_PLAY - DIGITAL FRONT PLAY button.
	 *  @property {number} D_VIEW_MODE - DIGITAL VIEW MODE button.
	 *  @property {number} STEP - STEP button.
	 *  @property {number} CALLER_ID - CALLED ID button.
	 *  @property {number} ANTENNA - ANTENNA button.
	 *  @property {number} ZOOM_MOVE - MOVE ZOOM button.
	 *  @property {number} ZOOM1 - ZOOM 1 button.
	 *  @property {number} ZOOM2 - ZOOM 2 button.
	 *  @property {number} ZOOM_IN - ZOOM IN button.
	 *  @property {number} ZOOM_OUT - ZOOM OUT button.
	 *  @property {number} RETURN - RETURN button.
	 *  @property {number} PANEL_RETURN - RETURN PANEL button.
	 *  @property {number} ENTER - ENTER button.
	 *  @property {number} PANEL_ENTER - ENTER PANEL button.
	 *  @property {number} PANEL_MENU - MENU PANEL button.
	 *  @property {number} ADDDEL - ADD/DEL button.
	 *  @property {number} PIP_SWAP - PIP (Picture In Picture) SWAP button.
	 *  @property {number} PLUS100 - SAMSUNG AUTO MOTION PLUS 100 HZ button.
	 *  @property {number} CAPTION - CAPTION button.
	 *  @property {number} PICTURE_SIZE - PICTURE SIZE button.
	 *  @property {number} PIP_SIZE - PIP (Picture In Picture) SIZE button.
	 *  @property {number} MAGIC_CHANNEL - MAGIC CHANNEL button.
	 *  @property {number} PIP_SCAN - PIP (Picture In Picture) SCAN button.
	 *  @property {number} DEVICE_CONNECT - DEVICE CONNECT button.
	 *  @property {number} HELP - HELP button.
	 *  @property {number} CONVERGENCE - CONVERGENCE button.
	 *  @property {number} AUTO_PROGRAM - AUTO PROGRAM button.
	 *  @property {number} FACTORY - FACTORY button.
	 *  @property {number} _3SPEED - 3SPEED button.
	 *  @property {number} 3SPEED - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._3SPEED}.
	 *  @property {number} RSURF - R.SURF button.
	 *  @property {number} TOPMENU - TOP MENU button.
	 *  @property {number} GAME - GAME button.
	 *  @property {number} QUICK_REPLAY - QUICK REPLAY button.
	 *  @property {number} STILL_PICTURE - STILL PICTURE button.
	 *  @property {number} DTV - DTV (Digital Television) button.
	 *  @property {number} INSTANT_REPLAY - INSTANT REPLAY button.
	 *  @property {number} LINK - LINK button.
	 *  @property {number} ANGLE - ANGLE button.
	 *  @property {number} RESERVED1 - RESERVED1 button.
	 *  @property {number} RESERVED5 - RESERVED5 button.
	 *  @property {number} PROGRAM - PROGRAM button.
	 *  @property {number} BOOKMARK - BOOKMARK button.
	 *  @property {number} PRINT - PRINT button.
	 *  @property {number} CLEAR - CLEAR button.
	 *  @property {number} VCHIP - V-CHIP button.
	 *  @property {number} REPEAT - REPEAT button.
	 *  @property {number} DOOR - DOOR button.
	 *  @property {number} OPEN - OPEN button.
	 *  @property {number} TURBO - TURBO button.
	 *  @property {number} DVR_MENU - DVR (Digital Video Recorder) MENU button.
	 *  @property {number} TTX_SUBFACE - Teletext Subface button.
	 *  @property {number} CH_LIST - CHANNEL LIST button.
	 *  @property {number} DNIe - DNIe (Digital Natural Image Engine) button.
	 *  @property {number} DNSe - DNSe (Digital Natural Sound Engine) button.
	 *  @property {number} SRS - SRS (Sound Retrieval System) button.
	 *  @property {number} CONVERT_AUDIO_MAINSUB - CONVERT AUDIO MAIN/SUB button.
	 *  @property {number} MDC - MDC button.
	 *  @property {number} SEFFECT - SOUND EFFECT button.
	 *  @property {number} DVR - DVR (Digital Video Recorder) button.
	 *  @property {number} DTV_SIGNAL - DTV (Digital Television) SIGNAL button.
	 *  @property {number} LIVE - LIVE button.
	 *  @property {number} PERPECT_FOCUS - PERPECT FOCUS button.
	 *  @property {number} HOME - HOME button.
	 *  @property {number} ESAVING - ENERGY SAVING button.
	 *  @property {number} CONTENTS - CONTENTS button.
	 *  @property {number} SCALE - SCALE button.
	 *  @property {number} CLOCK_DISPLAY - CLOCK DISPLAY button.
	 *  @property {number} SETUP_CLOCK_TIMER - SETUP CLOCK TIMER button.
	 *  @property {number} MAGIC_BRIGHT - MAGIC BRIGHT button.
	 *  @property {number} FM_RADIO - FM RADIO button.
	 *  @property {number} VCR_MODE - VCR MODE button.
	 *  @property {number} CATV_MODE - CATV (Community Antenna Television) MODE button.
	 *  @property {number} DSS_MODE - DSS MODE button.
	 *  @property {number} DVD_MODE - DVD MODE button.
	 *  @property {number} STB_MODE - STB (Set-Top Box) MODE button.
	 *  @property {number} PCMODE - PC MODE button.
	 *  @property {number} TV_MODE - TV MODE button.
	 *  @property {number} TV - TV button.
	 *  @property {number} AV1 - AV #1 button.
	 *  @property {number} AV2 - AV #2 button.
	 *  @property {number} AV3 - AV #3 button.
	 *  @property {number} SVIDEO1 - S-VIDEO (Separated-Video) #1 button.
	 *  @property {number} SVIDEO2 - S-VIDEO (Separated-Video) #2 button.
	 *  @property {number} SVIDEO3 - S-VIDEO (Separated-Video) #3 button.
	 *  @property {number} COMPONENT1 - COMPONENT #1 button.
	 *  @property {number} COMPONENT2 - COMPONENT #2 button.
	 *  @property {number} DVI - DVI (Digital Visual Interface) button.
	 *  @property {number} HDMI - HDMI button.
	 *  @property {number} HDMI1 - HDMI #1 button.
	 *  @property {number} HDMI2 - HDMI #2 button.
	 *  @property {number} HDMI3 - HDMI #3 button.
	 *  @property {number} HDMI4 - HDMI #4 button.
	 *  @property {number} DTV_LINK - DTVLINK (DIGITAL TELEVISION LINK) button.
	 *  @property {number} APP_LIST - APP LIST button.
	 *  @property {number} BACK_MHP - BACK MHP (Multimedia Home Platform) button.
	 *  @property {number} ALT_MHP - ALTERNATE MHP (Multimedia Home Platform) button.
	 *  @property {number} RSS - RSS button.
	 *  @property {number} ENTERTAINMENT - ENTERTAINMENT button.
	 *  @property {number} ID_INPUT - ID INPUT button.
	 *  @property {number} ID_SETUP - ID SETUP button.
	 *  @property {number} ANYNET - ANYNET button.
	 *  @property {number} ANYVIEW - ANYVIEW button.
	 *  @property {number} MS - MS button.
	 *  @property {number} MORE - MORE button.
	 *  @property {number} _4_3 - 4:3 button.
	 *  @property {number} 4_3 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._4_3}.
	 *  @property {number} _16_9 - 16:9 button.
	 *  @property {number} 16_9 - Alias for {@link CB_Keyboard.extended.SAMSUNG_TV._16_9}.
	 *  @property {number} PANORAMA - PICTURE MODE PANORAMA button.
	 *  @property {number} DYNAMIC - PICTURE MODE DYNAMIC button.
	 *  @property {number} STANDARD - PICTURE MODE STANDARD button.
	 *  @property {number} MOVIE1 - PICTURE MODE MOVIE1 button.
	 *  @property {number} CUSTOM - PICTURE MODE CUSTOM button.
	 *  @property {number} AUTO_ARC_RESET - AUTO ARC (Audio Return Channel) RESET button.
	 *  @property {number} AUTO_ARC_LNA_ON - AUTO ARC (Audio Return Channel) LNA (Low Noise Amplifier) ON button.
	 *  @property {number} AUTO_ARC_LNA_OFF - AUTO ARC (Audio Return Channel) LNA (Low Noise Amplifier) OFF button.
	 *  @property {number} AUTO_ARC_ANYNET_MODE_OK - AUTO ARC (Audio Return Channel) ANYNET MODE OK button.
	 *  @property {number} AUTO_ARC_ANYNET_AUTO_START - AUTO ARC (Audio Return Channel) ANYNET AUTO START button.
	 *  @property {number} AUTO_ARC_CAPTION_ON - AUTO ARC (Audio Return Channel) CAPTION ON button.
	 *  @property {number} AUTO_ARC_CAPTION_OFF - AUTO ARC (Audio Return Channel) CAPTION OFF button.
	 *  @property {number} AUTO_ARC_PIP_DOUBLE - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) DOUBLE button.
	 *  @property {number} AUTO_ARC_PIP_LARGE - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) LARGE button.
	 *  @property {number} AUTO_ARC_PIP_SMALL - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) SMALL button.
	 *  @property {number} AUTO_ARC_PIP_WIDE - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) WIDE button.
	 *  @property {number} AUTO_ARC_PIP_LEFT_TOP - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) LEFT TOP button.
	 *  @property {number} AUTO_ARC_PIP_RIGHT_TOP - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) RIGHT TOP button.
	 *  @property {number} AUTO_ARC_PIP_LEFT_BOTTOM - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) LEFT BOTTOM button.
	 *  @property {number} AUTO_ARC_PIP_RIGHT_BOTTOM - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) RIGHT BOTTOM button.
	 *  @property {number} AUTO_ARC_PIP_CH_CHANGE - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) CHANNEL CHANGE button.
	 *  @property {number} AUTO_ARC_PIP_SOURCE_CHANGE - AUTO ARC (Audio Return Channel) PIP (Picture In Picture) SOURCE CHANGE button.
	 *  @property {number} AUTO_ARC_AUTOCOLOR_SUCCESS - AUTO ARC (Audio Return Channel) AUTOCOLOR SUCCESS button.
	 *  @property {number} AUTO_ARC_AUTOCOLOR_FAIL - AUTO ARC (Audio Return Channel) AUTOCOLOR FAIL button.
	 *  @property {number} AUTO_ARC_C_FORCE_AGING - AUTO ARC (Audio Return Channel) C-FORCE AGING button.
	 *  @property {number} AUTO_ARC_USBJACK_INSPECT - AUTO ARC (Audio Return Channel) USB JACK INSPECT button.
	 *  @property {number} AUTO_ARC_JACK_IDENT - AUTO ARC (Audio Return Channel) JACK IDENT button.
	 *  @property {number} AUTO_ARC_CAPTION_KOR - AUTO ARC (Audio Return Channel) CAPTION KOREAN button.
	 *  @property {number} AUTO_ARC_CAPTION_ENG - AUTO ARC (Audio Return Channel) CAPTION ENGLISH button.
	 *  @property {number} AUTO_ARC_ANTENNA_AIR - AUTO ARC (Audio Return Channel) ANTENNA AIR button.
	 *  @property {number} AUTO_ARC_ANTENNA_CABLE - AUTO ARC (Audio Return Channel) ANTENNA CABLE button.
	 *  @property {number} AUTO_ARC_ANTENNA_SATELLITE - AUTO ARC (Audio Return Channel) ANTENNA SATELLITE button.
	 *  @property {number} AUTO_FORMAT - AUTO FORMAT button.
     *  @property {number} DNET - D-NET button.
	 *  @property {number} NINE_SEPARATE - NINE SEPARATE button.
	 *  @property {number} MIC - MIC (MICROPHONE) button.
	 *  @property {number} EXT1 - EXT1 button.
	 *  @property {number} EXT2 - EXT2 button.
	 *  @property {number} EXT3 - EXT3 button.
	 *  @property {number} EXT4 - EXT4 button.
	 *  @property {number} EXT5 - EXT5 button.
	 *  @property {number} EXT6 - EXT6 button.
	 *  @property {number} EXT7 - EXT7 button.
	 *  @property {number} EXT8 - EXT8 button.
	 *  @property {number} EXT9 - EXT9 button.
	 *  @property {number} EXT10 - EXT10 button.
	 *  @property {number} EXT11 - EXT11 button.
	 *  @property {number} EXT12 - EXT12 button.
	 *  @property {number} EXT13 - EXT13 button.
	 *  @property {number} EXT14 - EXT14 button.
	 *  @property {number} EXT15 - EXT15 button.
	 *  @property {number} EXT16 - EXT16 button.
	 *  @property {number} EXT17 - EXT17 button.
	 *  @property {number} EXT18 - EXT18 button.
	 *  @property {number} EXT19 - EXT19 button.
	 *  @property {number} EXT20 - EXT20 button.
	 *  @property {number} EXT21 - EXT21 button.
	 *  @property {number} EXT22 - EXT22 button.
	 *  @property {number} EXT23 - EXT23 button.
	 *  @property {number} EXT24 - EXT24 button.
	 *  @property {number} EXT25 - EXT25 button.
	 *  @property {number} EXT26 - EXT26 button.
	 *  @property {number} EXT27 - EXT27 button.
	 *  @property {number} EXT28 - EXT28 button.
	 *  @property {number} EXT29 - EXT29 button.
	 *  @property {number} EXT30 - EXT30 button.
	 *  @property {number} EXT31 - EXT31 button.
	 *  @property {number} EXT32 - EXT32 button.
	 *  @property {number} EXT33 - EXT33 button.
	 *  @property {number} EXT34 - EXT34 button.
	 *  @property {number} EXT35 - EXT35 button.
	 *  @property {number} EXT36 - EXT36 button.
	 *  @property {number} EXT37 - EXT37 button.
	 *  @property {number} EXT38 - EXT38 button.
	 *  @property {number} EXT39 - EXT39 button.
	 *  @property {number} EXT40 - EXT40 button.
	 *  @property {number} EXT41 - EXT41 button.
	 */
	//* Source: https://forum.samygo.tv/viewtopic.php?t=1792 and http://www.openremote.org/pages/viewpage.action?pageId=19434990 and https://github.com/Ape/samsungctl/issues/87
	CB_Keyboard.extended.SAMSUNG_TV =
	{
		TOOLS: tvKey.KEY_TOOLS || tvKey.TOOLS, //Same code as "K" key (75).
		EMODE: tvKey.KEY_EMODE || tvKey.EMODE, //148
		DMA: tvKey.KEY_DMA || tvKey.DMA, //260
		SOURCE: tvKey.KEY_SOURCE || tvKey.SOURCE, //222
		CHDOWN: tvKey.KEY_CHDOWN || tvKey.CHDOWN,
		CHUP: tvKey.KEY_CHUP || tvKey.CHUP,
		PANEL_CH_UP: tvKey.KEY_PANEL_CH_UP || tvKey.PANEL_CH_UP, //105 (same code as "9" in the numeric pad).
		PANEL_CH_DOWN: tvKey.KEY_PANEL_CH_DOWN || tvKey.PANEL_CH_DOWN, //106 (same code as asterisk ("*") in the numeric pad).
		PANEL_CHUP: tvKey.KEY_PANEL_CHUP || tvKey.KEY_PANNEL_CHUP || tvKey.PANEL_CHUP || tvKey.PANNEL_CHUP,
		PANEL_CHDOWN: tvKey.KEY_PANEL_CHDOWN || tvKey.KEY_PANNEL_CHDOWN || tvKey.PANEL_CHDOWN || tvKey.PANNEL_CHDOWN,
		PIP_CHUP: tvKey.KEY_PIP_CHUP || tvKey.PIP_CHUP, //1050
		PIP_CHDOWN: tvKey.KEY_PIP_CHDOWN || tvKey.PIP_CHDOWN, //1051
		PRECH: tvKey.KEY_PRECH || tvKey.PRECH, //259
		FAVCH: tvKey.KEY_FAVCH || tvKey.FAVCH, //256
		CHLIST: tvKey.KEY_CHLIST || tvKey.CHLIST, //84 (same code as "T" key).
		TTX_MIX: tvKey.KEY_TTX_MIX || tvKey.TTX_MIX, //650
		GUIDE: tvKey.KEY_GUIDE || tvKey.GUIDE, //651
		ASPECT: tvKey.KEY_ASPECT || tvKey.ASPECT, //653
		DOLBY_SRR: tvKey.KEY_DOLBY_SRR || tvKey.DOLBY_SRR, //654
		MTS: tvKey.KEY_MTS || tvKey.MTS, //655
		WHEELDOWN: tvKey.KEY_WHEELDOWN || tvKey.WHEELDOWN, //29469
		WHEEL_DOWN: tvKey.KEY_WHEEL_DOWN || tvKey.WHEEL_DOWN,
		WHEELUP: tvKey.KEY_WHEELUP || tvKey.WHEELUP, //29468
		WHEEL_UP: tvKey.KEY_WHEEL_UP || tvKey.WHEEL_UP,
		WHEELLEFT: tvKey.KEY_WHEELLEFT || tvKey.WHEELLEFT,
		WHEEL_LEFT: tvKey.KEY_WHEEL_LEFT || tvKey.WHEEL_LEFT,
		WHEELRIGHT: tvKey.KEY_WHEELRIGHT || tvKey.WHEELRIGHT,
		WHEEL_RIGHT: tvKey.KEY_WHEEL_RIGHT || tvKey.WHEEL_RIGHT,
		SMART: tvKey.KEY_SMART || tvKey.SMART,
		EXIT: tvKey.KEY_EXIT || tvKey.EXIT, //Same code as INS key (45).
		POWER: tvKey.KEY_POWER || tvKey.POWER, //76 (same code as "L" key).
		PANEL_POWER: tvKey.KEY_PANEL_POWER || tvKey.KEY_PANNEL_POWER || tvKey.PANEL_POWER || tvKey.PANNEL_POWER, //614
		POWEROFF: tvKey.KEY_POWEROFF || tvKey.POWEROFF,
		POWERON: tvKey.KEY_POWERON || tvKey.POWERON,
		CONTENT: tvKey.KEY_CONTENT || tvKey.CONTENT, //261
		WLINK: tvKey.KEY_WLINK || tvKey.WLINK, //115 (same code as F4 key)
		W_LINK: tvKey.KEY_W_LINK || tvKey.W_LINK,
		EMPTY: tvKey.KEY_EMPTY || tvKey.EMPTY, //0
		CC: tvKey.KEY_CC || tvKey.CC, //118 (same code as F7 key)
		REC: tvKey.KEY_REC || tvKey.REC, //192
		VOLUP: tvKey.KEY_VOLUP || tvKey.VOLUP,
		VOL_UP: tvKey.KEY_VOL_UP || tvKey.VOL_UP, //7
		VOLDOWN: tvKey.KEY_VOLDOWN || tvKey.VOLDOWN,
		VOL_DOWN: tvKey.KEY_VOL_DOWN || tvKey.VOL_DOWN, //1
		PANEL_VOLUP: tvKey.KEY_PANEL_VOLUP || tvKey.KEY_PANNEL_VOLUP || tvKey.PANEL_VOLUP || tvKey.PANNEL_VOLUP,
		PANEL_VOL_UP: tvKey.KEY_PANEL_VOL_UP || tvKey.PANEL_VOL_UP, //203
		PANEL_VOLDOW: tvKey.KEY_PANEL_VOLDOW || tvKey.KEY_PANNEL_VOLDOW || tvKey.PANEL_VOLDOW || tvKey.PANNEL_VOLDOW,
		PANEL_VOLDOWN: tvKey.KEY_PANEL_VOLDOWN || tvKey.KEY_PANNEL_VOLDOWN || tvKey.PANEL_VOLDOWN || tvKey.PANNEL_VOLDOWN,
		PANEL_VOL_DOWN: tvKey.KEY_PANEL_VOL_DOWN || tvKey.PANEL_VOL_DOWN, //204
		MUTE: tvKey.KEY_MUTE || tvKey.MUTE, //Same code as ESC key (27).
		INFO: tvKey.KEY_INFO || tvKey.INFO, //31
		INFOLINK: tvKey.KEY_INFOLINK || tvKey.INFOLINK, //147
		MENU: tvKey.KEY_MENU || tvKey.MENU, //262
		SUBTITLE: tvKey.KEY_SUBTITLE || tvKey.SUBTITLE, //652
		SUB_TITLE: tvKey.KEY_SUB_TITLE || tvKey.SUB_TITLE, //1089
		PANEL_SOURCE: tvKey.KEY_PANEL_SOURCE || tvKey.KEY_PANNEL_SOURCE || tvKey.PANEL_SOURCE || tvKey.PANNEL_SOURCE, //612
		_0: tvKey.KEY_0 || tvKey.N0 || tvKey._0 || tvKey["0"], //17 (same code as CTRL or META key, depending on the system).
		_1: tvKey.KEY_1 || tvKey.N1 || tvKey._1 || tvKey["1"], //101 (same code as "5" in the numeric pad).
		_2: tvKey.KEY_2 || tvKey.N2 || tvKey._2 || tvKey["2"], //98 (same code as "2" in the numeric pad).
		_3: tvKey.KEY_3 || tvKey.N3 || tvKey._3 || tvKey["3"], //6
		_4: tvKey.KEY_4 || tvKey.N4 || tvKey._4 || tvKey["4"], //8
		_5: tvKey.KEY_5 || tvKey.N5 || tvKey._5 || tvKey["5"], //9
		_6: tvKey.KEY_6 || tvKey.N6 || tvKey._6 || tvKey["6"], //10
		_7: tvKey.KEY_7 || tvKey.N7 || tvKey._7 || tvKey["7"], //12
		_8: tvKey.KEY_8 || tvKey.N8 || tvKey._8 || tvKey["8"], //13
		_9: tvKey.KEY_9 || tvKey.N9 || tvKey._9 || tvKey["9"], //14
		_10: tvKey.KEY_10 || tvKey.N10 || tvKey._10 || tvKey["10"],
		_11: tvKey.KEY_11 || tvKey.N11 || tvKey._11 || tvKey["11"],
		_12: tvKey.KEY_12 || tvKey.N12 || tvKey._12 || tvKey["12"], //1057
		RED: tvKey.KEY_RED || tvKey.RED, //Same code as SEPARATOR key (108).
		GREEN: tvKey.KEY_GREEN || tvKey.GREEN, //Same code as CAPS_LOCK key (20).
		YELLOW: tvKey.KEY_YELLOW || tvKey.YELLOW, //21
		BLUE: tvKey.KEY_BLUE || tvKey.BLUE, //22
		CYAN: tvKey.KEY_CYAN || tvKey.CYAN,
		RW: tvKey.KEY_RW || tvKey.RW, //69 (same code as "E" key).
		PAUSE: tvKey.KEY_PAUSE || tvKey.PAUSE, //74 (same code as "J" key).
		FF: tvKey.KEY_FF || tvKey.FF, //72 (same code as "H" key).
		FF_: tvKey.KEY_FF_ || tvKey.FF_, //1078
		REWIND: tvKey.KEY_REWIND || tvKey.REWIND,
		REWIND_: tvKey.KEY_REWIND_ || tvKey.REWIND_, //1080
		PLAY: tvKey.KEY_PLAY || tvKey.PLAY, //71 (same code as "G" key).
		STOP: tvKey.KEY_STOP || tvKey.STOP, //70 (same code as "F" key).
		SEARCH: tvKey.KEY_SEARCH || tvKey.SEARCH,
		UP: tvKey.KEY_UP || tvKey.UP, //29460.
		DOWN: tvKey.KEY_DOWN || tvKey.DOWN, //29461
		LEFT: tvKey.KEY_LEFT || tvKey.LEFT, //4
		RIGHT: tvKey.KEY_RIGHT || tvKey.RIGHT, //5
		CH_UP: tvKey.KEY_CH_UP || tvKey.CH_UP, //68 (same code as "D" key)
		CH_DOWN: tvKey.KEY_CH_DOWN || tvKey.CH_DOWN, //65 (same code as "A" key)
		DISC_MENU: tvKey.KEY_DISC_MENU || tvKey.DISC_MENU, //1086
		_3D: tvKey.KEY_3D || tvKey._3D || tvKey["3D"], //1219
		PIP_ONOFF: tvKey.KEY_PIP_ONOFF || tvKey.PIP_ONOFF, //1032
		AD: tvKey.KEY_AD || tvKey.AD, //1039
		PMODE: tvKey.KEY_PMODE || tvKey.PMODE, //1040
		SMODE: tvKey.KEY_SMODE || tvKey.SMODE, //1043
		SLEEP: tvKey.KEY_SLEEP || tvKey.SLEEP, //1097
		D_AUDIO: tvKey.KEY_D_AUDIO || tvKey.D_AUDIO, //1236
		D_FRONT_PLAY: tvKey.KEY_D_FRONT_PLAY || tvKey.D_FRONT_PLAY, //1243 (for BD)
		D_VIEW_MODE: tvKey.KEY_D_VIEW_MODE || tvKey.D_VIEW_MODE, //1249
		STEP: tvKey.KEY_STEP || tvKey.STEP, //1023 (REC PAUSE(BD))
		CALLER_ID: tvKey.KEY_CALLER_ID || tvKey.CALLER_ID, //1128 (FULL SCREEN (BD))
		ANTENNA: tvKey.KEY_ANTENA || tvKey.ANTENA || tvKey.KEY_ANTENNA || tvKey.ANTENNA, //1054 (for CN)
		ZOOM_MOVE: tvKey.KEY_ZOOM_MOVE || tvKey.ZOOM_MOVE,
		ZOOM1: tvKey.KEY_ZOOM1 || tvKey.ZOOM1, //1083
		ZOOM2: tvKey.KEY_ZOOM2 || tvKey.ZOOM2,
		ZOOM_IN: tvKey.KEY_ZOOM_IN || tvKey.ZOOM_IN,
		ZOOM_OUT: tvKey.KEY_ZOOM_OUT || tvKey.ZOOM_OUT,
		RETURN: tvKey.KEY_RETURN || tvKey.RETURN, //Same code as "X" key (88).
		PANEL_RETURN: tvKey.KEY_PANEL_RETURN || tvKey.PANEL_RETURN,
		ENTER: tvKey.KEY_ENTER || tvKey.ENTER, //29443
		PANEL_ENTER: tvKey.KEY_PANEL_ENTER || tvKey.KEY_PANNEL_ENTER || tvKey.PANEL_ENTER || tvKey.PANNEL_ENTER, //309
		PANEL_MENU: tvKey.KEY_PANEL_MENU || tvKey.KEY_PANNEL_MENU || tvKey.PANEL_MENU || tvKey.PANNEL_MENU, //613
		ADDDEL: tvKey.KEY_ADDDEL || tvKey.ADDDEL,
		PIP_SWAP: tvKey.KEY_PIP_SWAP || tvKey.PIP_SWAP,
		PLUS100: tvKey.KEY_PLUS100 || tvKey.PLUS100,
		CAPTION: tvKey.KEY_CAPTION || tvKey.CAPTION,
		PICTURE_SIZE: tvKey.KEY_PICTURE_SIZE || tvKey.PICTURE_SIZE,
		PIP_SIZE: tvKey.KEY_PIP_SIZE || tvKey.PIP_SIZE,
		MAGIC_CHANNEL: tvKey.KEY_MAGIC_CHANNEL || tvKey.MAGIC_CHANNEL,
		PIP_SCAN: tvKey.KEY_PIP_SCAN || tvKey.PIP_SCAN,
		DEVICE_CONNECT: tvKey.KEY_DEVICE_CONNECT || tvKey.DEVICE_CONNECT,
		HELP: tvKey.KEY_HELP || tvKey.HELP,
		CONVERGENCE: tvKey.KEY_CONVERGENCE || tvKey.CONVERGENCE,
		AUTO_PROGRAM: tvKey.KEY_AUTO_PROGRAM || tvKey.AUTO_PROGRAM,
		FACTORY: tvKey.KEY_FACTORY || tvKey.FACTORY,
		_3SPEED: tvKey.KEY_3SPEED || tvKey._3SPEED || tvKey["3SPEED"],
		RSURF: tvKey.KEY_RSURF || tvKey.RSURF,
		TOPMENU: tvKey.KEY_TOPMENU || tvKey.TOPMENU,
		GAME: tvKey.KEY_GAME || tvKey.GAME,
		QUICK_REPLAY: tvKey.KEY_QUICK_REPLAY || tvKey.QUICK_REPLAY,
		STILL_PICTURE: tvKey.KEY_STILL_PICTURE || tvKey.STILL_PICTURE,
		DTV: tvKey.KEY_DTV || tvKey.DTV,
		INSTANT_REPLAY: tvKey.KEY_INSTANT_REPLAY || tvKey.INSTANT_REPLAY,
		LINK: tvKey.KEY_LINK || tvKey.LINK,
		ANGLE: tvKey.KEY_ANGLE || tvKey.ANGLE,
		RESERVED1: tvKey.KEY_RESERVED1 || tvKey.RESERVED1,
		RESERVED5: tvKey.KEY_RESERVED5 || tvKey.RESERVED5,
		PROGRAM: tvKey.KEY_PROGRAM || tvKey.PROGRAM,
		BOOKMARK: tvKey.KEY_BOOKMARK || tvKey.BOOKMARK,
		PRINT: tvKey.KEY_PRINT || tvKey.PRINT,
		CLEAR: tvKey.KEY_CLEAR || tvKey.CLEAR,
		VCHIP: tvKey.KEY_VCHIP || tvKey.VCHIP,
		REPEAT: tvKey.KEY_REPEAT || tvKey.REPEAT,
		DOOR: tvKey.KEY_DOOR || tvKey.DOOR,
		OPEN: tvKey.KEY_OPEN || tvKey.OPEN,
		TURBO: tvKey.KEY_TURBO || tvKey.TURBO,
		DVR_MENU: tvKey.KEY_DVR_MENU || tvKey.DVR_MENU,
		TTX_SUBFACE: tvKey.KEY_TTX_SUBFACE || tvKey.TTX_SUBFACE,
		CH_LIST: tvKey.KEY_CH_LIST || tvKey.CH_LIST,
		DNIe: tvKey.KEY_DNIe || tvKey.KEY_DNIE || tvKey.DNIe || tvKey.DNIE,
		DNSe: tvKey.KEY_DNSe || tvKey.KEY_DNSE || tvKey.DNSe || tvKey.DNSE,
		SRS: tvKey.KEY_SRS || tvKey.SRS,
		CONVERT_AUDIO_MAINSUB: tvKey.KEY_CONVERT_AUDIO_MAINSUB || tvKey.CONVERT_AUDIO_MAINSUB,
		MDC: tvKey.KEY_MDC || tvKey.MDC,
		SEFFECT: tvKey.KEY_SEFFECT || tvKey.SEFFECT,
		DVR: tvKey.KEY_DVR || tvKey.DVR,
		DTV_SIGNAL: tvKey.KEY_DTV_SIGNAL || tvKey.DTV_SIGNAL,
		LIVE: tvKey.KEY_LIVE || tvKey.LIVE,
		PERPECT_FOCUS: tvKey.KEY_PERPECT_FOCUS || tvKey.PERPECT_FOCUS,
		HOME: tvKey.KEY_HOME || tvKey.HOME,
		ESAVING: tvKey.KEY_ESAVING || tvKey.ESAVING,
		CONTENTS: tvKey.KEY_CONTENTS || tvKey.CONTENTS,
		SCALE: tvKey.KEY_SCALE || tvKey.SCALE,
		CLOCK_DISPLAY: tvKey.KEY_CLOCK_DISPLAY || tvKey.CLOCK_DISPLAY,
		SETUP_CLOCK_TIMER: tvKey.KEY_SETUP_CLOCK_TIMER || tvKey.SETUP_CLOCK_TIMER,
		MAGIC_BRIGHT: tvKey.KEY_MAGIC_BRIGHT || tvKey.MAGIC_BRIGHT,
		FM_RADIO: tvKey.KEY_FM_RADIO || tvKey.FM_RADIO,
		VCR_MODE: tvKey.KEY_VCR_MODE || tvKey.VCR_MODE,
		CATV_MODE: tvKey.KEY_CATV_MODE || tvKey.CATV_MODE,
		DSS_MODE: tvKey.KEY_DSS_MODE || tvKey.DSS_MODE,
		DVD_MODE: tvKey.KEY_DVD_MODE || tvKey.DVD_MODE,
		STB_MODE: tvKey.KEY_STB_MODE || tvKey.STB_MODE,
		PCMODE: tvKey.KEY_PCMODE || tvKey.PCMODE,
		TV_MODE: tvKey.KEY_TV_MODE || tvKey.TV_MODE,
		TV: tvKey.KEY_TV || tvKey.TV, //77
		AV1: tvKey.KEY_AV1 || tvKey.AV1,
		AV2: tvKey.KEY_AV2 || tvKey.AV2,
		AV3: tvKey.KEY_AV3 || tvKey.AV3,
		SVIDEO1: tvKey.KEY_SVIDEO1 || tvKey.SVIDEO1,
		SVIDEO2: tvKey.KEY_SVIDEO2 || tvKey.SVIDEO2,
		SVIDEO3: tvKey.KEY_SVIDEO3 || tvKey.SVIDEO3,
		COMPONENT1: tvKey.KEY_COMPONENT1 || tvKey.COMPONENT1,
		COMPONENT2: tvKey.KEY_COMPONENT2 || tvKey.COMPONENT2,
		DVI: tvKey.KEY_DVI || tvKey.DVI,
		HDMI: tvKey.KEY_HDMI || tvKey.HDMI,
		HDMI1: tvKey.KEY_HDMI1 || tvKey.HDMI1,
		HDMI2: tvKey.KEY_HDMI2 || tvKey.HDMI2,
		HDMI3: tvKey.KEY_HDMI3 || tvKey.HDMI3,
		HDMI4: tvKey.KEY_HDMI4 || tvKey.HDMI4,
		DTV_LINK: tvKey.KEY_DTV_LINK || tvKey.DTV_LINK,
		APP_LIST: tvKey.KEY_APP_LIST || tvKey.APP_LIST,
		BACK_MHP: tvKey.KEY_BACK_MHP || tvKey.BACK_MHP,
		ALT_MHP: tvKey.KEY_ALT_MHP || tvKey.ALT_MHP,
		RSS: tvKey.KEY_RSS || tvKey.RSS,
		ENTERTAINMENT: tvKey.KEY_ENTERTAINMENT || tvKey.ENTERTAINMENT,
		ID_INPUT: tvKey.KEY_ID_INPUT || tvKey.ID_INPUT,
		ID_SETUP: tvKey.KEY_ID_SETUP || tvKey.ID_SETUP,
		ANYNET: tvKey.KEY_ANYNET || tvKey.ANYNET,
		ANYVIEW: tvKey.KEY_ANYVIEW || tvKey.ANYVIEW,
		MS: tvKey.KEY_MS || tvKey.MS,
		MORE: tvKey.KEY_MORE || tvKey.MORE,
		_4_3: tvKey.KEY_4_3 || tvKey._4_3 || tvKey["4_3"],
		_16_9: tvKey.KEY_16_9 || tvKey._16_9 || tvKey["16_9"],
		PANORAMA: tvKey.KEY_PANORAMA || tvKey.PANORAMA,
		DYNAMIC: tvKey.KEY_DYNAMIC || tvKey.DYNAMIC,
		STANDARD: tvKey.KEY_STANDARD || tvKey.STANDARD,
		MOVIE1: tvKey.KEY_MOVIE1 || tvKey.MOVIE1,
		CUSTOM: tvKey.KEY_CUSTOM || tvKey.CUSTOM,
		AUTO_ARC_RESET: tvKey.KEY_AUTO_ARC_RESET || tvKey.AUTO_ARC_RESET,
		AUTO_ARC_LNA_ON: tvKey.KEY_AUTO_ARC_LNA_ON || tvKey.AUTO_ARC_LNA_ON,
		AUTO_ARC_LNA_OFF: tvKey.KEY_AUTO_ARC_LNA_OFF || tvKey.AUTO_ARC_LNA_OFF,
		AUTO_ARC_ANYNET_MODE_OK: tvKey.KEY_AUTO_ARC_ANYNET_MODE_OK || tvKey.AUTO_ARC_ANYNET_MODE_OK,
		AUTO_ARC_ANYNET_AUTO_START: tvKey.KEY_AUTO_ARC_ANYNET_AUTO_START || tvKey.AUTO_ARC_ANYNET_AUTO_START,
		AUTO_ARC_CAPTION_ON: tvKey.KEY_AUTO_ARC_CAPTION_ON || tvKey.AUTO_ARC_CAPTION_ON,
		AUTO_ARC_CAPTION_OFF: tvKey.KEY_AUTO_ARC_CAPTION_OFF || tvKey.AUTO_ARC_CAPTION_OFF,
		AUTO_ARC_PIP_DOUBLE: tvKey.KEY_AUTO_ARC_PIP_DOUBLE || tvKey.AUTO_ARC_PIP_DOUBLE,
		AUTO_ARC_PIP_LARGE: tvKey.KEY_AUTO_ARC_PIP_LARGE || tvKey.AUTO_ARC_PIP_LARGE,
		AUTO_ARC_PIP_SMALL: tvKey.KEY_AUTO_ARC_PIP_SMALL || tvKey.AUTO_ARC_PIP_SMALL,
		AUTO_ARC_PIP_WIDE: tvKey.KEY_AUTO_ARC_PIP_WIDE || tvKey.AUTO_ARC_PIP_WIDE,
		AUTO_ARC_PIP_LEFT_TOP: tvKey.KEY_AUTO_ARC_PIP_LEFT_TOP || tvKey.AUTO_ARC_PIP_LEFT_TOP,
		AUTO_ARC_PIP_RIGHT_TOP: tvKey.KEY_AUTO_ARC_PIP_RIGHT_TOP || tvKey.AUTO_ARC_PIP_RIGHT_TOP,
		AUTO_ARC_PIP_LEFT_BOTTOM: tvKey.KEY_AUTO_ARC_PIP_LEFT_BOTTOM || tvKey.AUTO_ARC_PIP_LEFT_BOTTOM,
		AUTO_ARC_PIP_RIGHT_BOTTOM: tvKey.KEY_AUTO_ARC_PIP_RIGHT_BOTTOM || tvKey.AUTO_ARC_PIP_RIGHT_BOTTOM,
		AUTO_ARC_PIP_CH_CHANGE: tvKey.KEY_AUTO_ARC_PIP_CH_CHANGE || tvKey.AUTO_ARC_PIP_CH_CHANGE,
		AUTO_ARC_PIP_SOURCE_CHANGE: tvKey.KEY_AUTO_ARC_PIP_SOURCE_CHANGE || tvKey.AUTO_ARC_PIP_SOURCE_CHANGE,
		AUTO_ARC_AUTOCOLOR_SUCCESS: tvKey.KEY_AUTO_ARC_AUTOCOLOR_SUCCESS || tvKey.AUTO_ARC_AUTOCOLOR_SUCCESS,
		AUTO_ARC_AUTOCOLOR_FAIL: tvKey.KEY_AUTO_ARC_AUTOCOLOR_FAIL || tvKey.AUTO_ARC_AUTOCOLOR_FAIL,
		AUTO_ARC_C_FORCE_AGING: tvKey.KEY_AUTO_ARC_C_FORCE_AGING || tvKey.AUTO_ARC_C_FORCE_AGING,
		AUTO_ARC_USBJACK_INSPECT: tvKey.KEY_AUTO_ARC_USBJACK_INSPECT || tvKey.AUTO_ARC_USBJACK_INSPECT,
		AUTO_ARC_JACK_IDENT: tvKey.KEY_AUTO_ARC_JACK_IDENT || tvKey.AUTO_ARC_JACK_IDENT,
		AUTO_ARC_CAPTION_KOR: tvKey.KEY_AUTO_ARC_CAPTION_KOR || tvKey.AUTO_ARC_CAPTION_KOR,
		AUTO_ARC_CAPTION_ENG: tvKey.KEY_AUTO_ARC_CAPTION_ENG || tvKey.AUTO_ARC_CAPTION_ENG,
		AUTO_ARC_ANTENNA_AIR: tvKey.KEY_AUTO_ARC_ANTENNA_AIR || tvKey.AUTO_ARC_ANTENNA_AIR,
		AUTO_ARC_ANTENNA_CABLE: tvKey.KEY_AUTO_ARC_ANTENNA_CABLE || tvKey.AUTO_ARC_ANTENNA_CABLE,
		AUTO_ARC_ANTENNA_SATELLITE: tvKey.KEY_AUTO_ARC_ANTENNA_SATELLITE || tvKey.AUTO_ARC_ANTENNA_SATELLITE,
		AUTO_FORMAT: tvKey.KEY_AUTO_FORMAT || tvKey.AUTO_FORMAT,
		DNET: tvKey.KEY_DNET || tvKey.DNET,
		NINE_SEPARATE: tvKey.KEY_NINE_SEPERATE || tvKey.NINE_SEPERATE || tvKey.KEY_NINE_SEPARATE || tvKey.NINE_SEPARATE,
		MIC: tvKey.KEY_MIC || tvKey.MIC,
		EXT1: tvKey.KEY_EXT1 || tvKey.EXT1,
		EXT2: tvKey.KEY_EXT2 || tvKey.EXT2,
		EXT3: tvKey.KEY_EXT3 || tvKey.EXT3,
		EXT4: tvKey.KEY_EXT4 || tvKey.EXT4,
		EXT5: tvKey.KEY_EXT5 || tvKey.EXT5,
		EXT6: tvKey.KEY_EXT6 || tvKey.EXT6,
		EXT7: tvKey.KEY_EXT7 || tvKey.EXT7,
		EXT8: tvKey.KEY_EXT8 || tvKey.EXT8,
		EXT9: tvKey.KEY_EXT9 || tvKey.EXT9,
		EXT10: tvKey.KEY_EXT10 || tvKey.EXT10,
		EXT11: tvKey.KEY_EXT11 || tvKey.EXT11,
		EXT12: tvKey.KEY_EXT12 || tvKey.EXT12,
		EXT13: tvKey.KEY_EXT13 || tvKey.EXT13,
		EXT14: tvKey.KEY_EXT14 || tvKey.EXT14,
		EXT15: tvKey.KEY_EXT15 || tvKey.EXT15,
		EXT16: tvKey.KEY_EXT16 || tvKey.EXT16,
		EXT17: tvKey.KEY_EXT17 || tvKey.EXT17,
		EXT18: tvKey.KEY_EXT18 || tvKey.EXT18,
		EXT19: tvKey.KEY_EXT19 || tvKey.EXT19,
		EXT20: tvKey.KEY_EXT20 || tvKey.EXT20,
		EXT21: tvKey.KEY_EXT21 || tvKey.EXT21,
		EXT22: tvKey.KEY_EXT22 || tvKey.EXT22,
		EXT23: tvKey.KEY_EXT23 || tvKey.EXT23,
		EXT24: tvKey.KEY_EXT24 || tvKey.EXT24,
		EXT25: tvKey.KEY_EXT25 || tvKey.EXT25,
		EXT26: tvKey.KEY_EXT26 || tvKey.EXT26,
		EXT27: tvKey.KEY_EXT27 || tvKey.EXT27,
		EXT28: tvKey.KEY_EXT28 || tvKey.EXT28,
		EXT29: tvKey.KEY_EXT29 || tvKey.EXT29,
		EXT30: tvKey.KEY_EXT30 || tvKey.EXT30,
		EXT31: tvKey.KEY_EXT31 || tvKey.EXT31,
		EXT32: tvKey.KEY_EXT32 || tvKey.EXT32,
		EXT33: tvKey.KEY_EXT33 || tvKey.EXT33,
		EXT34: tvKey.KEY_EXT34 || tvKey.EXT34,
		EXT35: tvKey.KEY_EXT35 || tvKey.EXT35,
		EXT36: tvKey.KEY_EXT36 || tvKey.EXT36,
		EXT37: tvKey.KEY_EXT37 || tvKey.EXT37,
		EXT38: tvKey.KEY_EXT38 || tvKey.EXT38,
		EXT39: tvKey.KEY_EXT39 || tvKey.EXT39,
		EXT40: tvKey.KEY_EXT40 || tvKey.EXT40,
		EXT41: tvKey.KEY_EXT41 || tvKey.EXT41
	};
	CB_Keyboard.extended.SAMSUNG_TV[0] = CB_Keyboard.extended.SAMSUNG_TV._0;
	CB_Keyboard.extended.SAMSUNG_TV[1] = CB_Keyboard.extended.SAMSUNG_TV._1;
	CB_Keyboard.extended.SAMSUNG_TV[2] = CB_Keyboard.extended.SAMSUNG_TV._2;
	CB_Keyboard.extended.SAMSUNG_TV[3] = CB_Keyboard.extended.SAMSUNG_TV._3;
	CB_Keyboard.extended.SAMSUNG_TV[4] = CB_Keyboard.extended.SAMSUNG_TV._4;
	CB_Keyboard.extended.SAMSUNG_TV[5] = CB_Keyboard.extended.SAMSUNG_TV._5;
	CB_Keyboard.extended.SAMSUNG_TV[6] = CB_Keyboard.extended.SAMSUNG_TV._6;
	CB_Keyboard.extended.SAMSUNG_TV[7] = CB_Keyboard.extended.SAMSUNG_TV._7;
	CB_Keyboard.extended.SAMSUNG_TV[8] = CB_Keyboard.extended.SAMSUNG_TV._8;
	CB_Keyboard.extended.SAMSUNG_TV[9] = CB_Keyboard.extended.SAMSUNG_TV._9;
	CB_Keyboard.extended.SAMSUNG_TV[10] = CB_Keyboard.extended.SAMSUNG_TV._10;
	CB_Keyboard.extended.SAMSUNG_TV[11] = CB_Keyboard.extended.SAMSUNG_TV._11;
	CB_Keyboard.extended.SAMSUNG_TV[12] = CB_Keyboard.extended.SAMSUNG_TV._12;
	CB_Keyboard.extended.SAMSUNG_TV["3D"] = CB_Keyboard.extended.SAMSUNG_TV._3D;
	CB_Keyboard.extended.SAMSUNG_TV["3SPEED"] = CB_Keyboard.extended.SAMSUNG_TV._3SPEED;
	CB_Keyboard.extended.SAMSUNG_TV["4_3"] = CB_Keyboard.extended.SAMSUNG_TV._4_3;
	CB_Keyboard.extended.SAMSUNG_TV["16_9"] = CB_Keyboard.extended.SAMSUNG_TV._16_9;
	CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases = CB_Configuration[CB_BASE_NAME].CB_Keyboard_extended_SAMSUNG_TV_allowDuplicateKeyAliases;
	

	/**
	 * Amazon Fire TV remote control key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name AMAZON_FIRE_TV_REMOTE
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} UP - UP button.
	 *  @property {number} DOWN - DOWN button.
	 *  @property {number} LEFT - LEFT button.
	 *  @property {number} RIGHT - RIGHT button.
	 *  @property {number} SELECT - SELECT button.
	 *  @property {number} PLAY_PAUSE - PLAY/PAUSE button.
	 *  @property {number} RW - RW (REWIND) button.
	 *  @property {number} FF - FF (FAST FORWARD) button.
	 */
	CB_Keyboard.extended.AMAZON_FIRE_TV_REMOTE =
	{
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		SELECT: 13,
		PLAY_PAUSE: 179,
		RW: 227,
		FF: 228
	};
	

	/**
	 * Amazon Fire TV game controller key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name AMAZON_FIRE_TV_GAME_CONTROLLER
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} UP - UP button.
	 *  @property {number} DOWN - DOWN button.
	 *  @property {number} LEFT - LEFT button.
	 *  @property {number} RIGHT - RIGHT button.
	 *  @property {number} A - "A" button.
	 *  @property {number} B - "B" button.
	 *  @property {number} X - "X" button.
	 *  @property {number} Y - "Y" button.
	 */
	CB_Keyboard.extended.AMAZON_FIRE_TV_GAME_CONTROLLER =
	{
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		A: 13,
		B: 8, //Same as BACKSPACE.
		X: 13, //Same code as A button.
		Y: 13 //Same code as A button.
	}
	

	/**
	 * Nintendo Wii (Wiimote) key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name WII
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} UP - D-PAD UP button.
	 *  @property {number} DOWN - D-PAD DOWN button.
	 *  @property {number} LEFT - D-PAD LEFT button.
	 *  @property {number} RIGHT - D-PAD RIGHT button.
	 *  @property {number} A - "A" button.
	 *  @property {number} B - "B" button.
 	 *  @property {number} MINUS - MINUS ("-") button.
	 *  @property {number} PLUS - PLUS ("+") button.
 	 *  @property {number} ONE - "1" button.
	 *  @property {number} _1 - Alias for {@link CB_Keyboard.extended.WII.ONE}.
	 *  @property {number} 1 - Alias for {@link CB_Keyboard.extended.WII.ONE}.
	 *  @property {number} TWO - "2" button.
	 *  @property {number} _2 - Alias for {@link CB_Keyboard.extended.WII.TWO}.
	 *  @property {number} 2 - Alias for {@link CB_Keyboard.extended.WII.TWO}.
 	 *  @property {number} HOME - HOME button.
	 */
	//* Source: tomy @ https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
	CB_Keyboard.extended.WII =
	{
		UP: 175, //D-PAD: UP (also scrolls up). Note: same code as "VOL_UP" key.
		DOWN: 176, //D-PAD DOWN (also scrolls down). Note: same code as "MEDIA_FORWARD" key.
		LEFT: 178, //D-PAD LEFT (also scrolls left). Note: same code as "MEDIA_STOP" key.
		RIGHT: 177, //D-PAD RIGHT (also scrolls right). Note: same code as "MEDIA_BACK" key.
		A: 13, //"A" button. Note: same code as ENTER key.
		B: 171, //"B" button. Note: same code as BROWSER_FAVORITES key and PLUS ("+") in Firefox browser.
		MINUS: 170, //Minus ("-") button (also zooms out). Note: same code as BROWSER_SEARCH key.
		PLUS: 174, //Plus ("+") button (also zooms in). Note: same code as VOL_DOWN key.
		ONE: 172, //"1" button. Note: same code as BROWSER_HOME key.
		TWO: 173, //"2" button (also splits screen into single column mode). Note: same code as MUTE key and MINUS ("-") in Firefox browser.
		HOME: 2 //Home button (also leaves the browser).
	};
	CB_Keyboard.extended.WII[1] = CB_Keyboard.extended.WII._1 = CB_Keyboard.extended.WII.ONE; //"1" button. Note: same code as BROWSER_HOME key.
	CB_Keyboard.extended.WII[2] = CB_Keyboard.extended.WII._2 = CB_Keyboard.extended.WII.TWO; //"2" button (also splits screen into single column mode). Note: same code as MUTE key and MINUS ("-") in Firefox browser.
	CB_Keyboard.extended.WII._allowDuplicateKeyAliases = CB_Configuration[CB_BASE_NAME].CB_Keyboard_extended_WII_allowDuplicateKeyAliases;
	

	/**
	 * Sony PlayStation 3 key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name PS3
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} UP - UP button.
	 *  @property {number} DOWN - DOWN button.
	 *  @property {number} LEFT - LEFT button.
	 *  @property {number} RIGHT - RIGHT button.
	 *  @property {number} CROSS - CROSS button.
	 */
	//* Source: tomy @ https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
	CB_Keyboard.extended.PS3 =
	{
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		CROSS: 63 //Caution, also clicks! Note: same code as "?" symbol key.
		//CIRCLE: 27 //Not sure.
	};

	
	/**
	 * Sony PlayStation 4 key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name PS4
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} UP - D-PAD UP button.
	 *  @property {number} DOWN - D-PAD DOWN button.
	 *  @property {number} LEFT - D-PAD LEFT button.
	 *  @property {number} RIGHT - D-PAD RIGHT button.
	 *  @property {number} TRIANGLE - TRIANGLE button.
	 *  @property {number} SQUARE - SQUARE button.
	 *  @property {number} CIRCLE - CIRCLE button.
	 *  @property {number} L1 - L1 button.
	 *  @property {number} L2 - L2 button.
	 *  @property {number} R1 - R1 button.
	 *  @property {number} R2 - R2 button.
	 *  @property {number} LEFT_STICK_CLICK - LEFT STICK CLICK button.
	 *  @property {number} RIGHT_STICK_CLICK - RIGHT STICK CLICK button.
	 *  @property {number} OPTIONS - OPTIONS button.
	 */
	//* Source: http://coding.vdhdesign.co.nz/?p=351 (https://web.archive.org/web/20140222065645/http://coding.vdhdesign.co.nz/?p=351)
	CB_Keyboard.extended.PS4 =
	{
		UP: 38, //D-PAD: UP.
		DOWN: 40, //D-PAD: DOWN.
		LEFT: 37, //D-PAD: LEFT.
		RIGHT: 39, //D-PAD: RIGHT.
		TRIANGLE: 112, //Also initiates search bar. Note: same code as F1 key.
		SQUARE: 113, //Also initiates full screen mode. Note: same code as F2 key.
		CIRCLE: 27, //Browser history back. Note: same code as ESC key.
		//CROSS: undefined, //No keycode event was fired for this button, as this is used as a mouse left click.
		L1: 116, //History Back. It seems the web browser does not send any event for L1 button. Note: same codes as F5 key.
		L2: 118, //Goes to browser tab to the left. Note: same codes as F7 key.
		R1: 117, //History Forward. Note: same codes as F6 key.
		R2: 119, //Goes to browser tab to the right. Note: same codes as F8 key.
		LEFT_STICK_CLICK: 120, //Zooms browser out. Note: same codes as F9 key.
		RIGHT_STICK_CLICK: 121, //Zooms browser In. Note: same codes as F10 key.
		OPTIONS: 114 //Opens up options menu. Note: same codes as F3 key.
		//SHARE: undefined //Share Button (goes directly to a native application, no key code was fires).
	};
	CB_Keyboard.extended.PS4._allowDuplicateKeyAliases = CB_Configuration[CB_BASE_NAME].CB_Keyboard_extended_PS4_allowDuplicateKeyAliases;
	

	/**
	 * Sony PlayStation Vita key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name PSVITA
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} UP - UP button.
	 *  @property {number} DOWN - DOWN button.
	 *  @property {number} LEFT - LEFT button.
	 *  @property {number} RIGHT - RIGHT button.
	 */
	//* Source: https://github.com/goldenratio/console-browsers-gamepad/tree/master/playstation
	CB_Keyboard.extended.PSVITA =
	{
		UP: 38, //UP.
		DOWN: 40, //DOWN.
		LEFT: 37, //LEFT.
		RIGHT: 39 //RIGHT.
	};
	
	
	/**
	 * LG Smart TV (Linux 35230) key codes.
	 *  @memberof CB_Keyboard.extended
	 *  @name LG_SMART_TV_LINUX_35230
	 *  @constant
	 *  @type {Object}
	 *  @default
	 *  @property {number} _0 - 0 (zero) button.
	 *  @property {number} _1 - 1 button.
	 *  @property {number} _2 - 2 button.
	 *  @property {number} _3 - 3 button.
	 *  @property {number} _4 - 4 button.
	 *  @property {number} _5 - 5 button.
	 *  @property {number} _6 - 6 button.
	 *  @property {number} _7 - 7 button.
	 *  @property {number} _8 - 8 button.
	 *  @property {number} _9 - 9 button.
	 *  @property {number} 0 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._0}.
	 *  @property {number} 1 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._1}.
	 *  @property {number} 2 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._2}.
	 *  @property {number} 3 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._3}.
	 *  @property {number} 4 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._4}.
	 *  @property {number} 5 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._5}.
	 *  @property {number} 6 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._6}.
	 *  @property {number} 7 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._7}.
	 *  @property {number} 8 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._8}.
	 *  @property {number} 9 - Alias for {@link CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._9}.
	 *  @property {number} FORWARD - FORWARD button.
	 *  @property {number} REWIND - REWIND button.
	 *  @property {number} PLAY - PLAY button.
	 *  @property {number} PAUSE - PAUSE button.
	 */
	//* Source: tomy @ https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230 = 
	{
		//TODO: add more codes (if there is any more) and use them in CB_Keyboard.keys.
		_0: 48,
		_1: 49,
		_2: 50,
  	  	_3: 51,
		_4: 52,
		_5: 53,
		_6: 54,
		_7: 55,
  	  	_8: 56,
		_9: 57,
		FORWARD: 417, //Forward button.
		REWIND: 412, //Rewind button.
		PLAY: 445, //Play button.
		PAUSE: 19 //Pause button.
	};
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[0] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._0;
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[1] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._1;
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[2] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._2;
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[3] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._3;
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[4] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._4;
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[5] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._5;
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[6] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._6;
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[7] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._7;
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[8] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._8;
	CB_Keyboard.extended.LG_SMART_TV_LINUX_35230[9] = CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._9;
	
	
	/**
	 * Object whose properties are aliases for key codes (each property can contain an array with one or more integers which belong to the key codes).
	 *  @namespace
	 *  @type {Object}
	 */
	CB_Keyboard.keys =
	{
		/**
		 * The Escape (ESC) key.
		 *  @type {array}
		 *  @default
		 */
		"ESC" : [27],

		/**
		 * The F1 key.
		 *  @type {array}
		 *  @default
		 */
		"F1" : [112],
		
		/**
		 * The F2 key.
		 *  @type {array}
		 *  @default
		 */
		"F2" : [113],
		
		/**
		 * The F3 key.
		 *  @type {array}
		 *  @default
		 */
		"F3" : [114],
		
		/**
		 * The F4 key.
		 *  @type {array}
		 *  @default
		 */
		"F4" : [115],
		
		/**
		 * The F5 key.
		 *  @type {array}
		 *  @default
		 */
		"F5" : [116],
		
		/**
		 * The F6 key.
		 *  @type {array}
		 *  @default
		 */
		"F6" : [117],

		/**
		 * The F7 key.
		 *  @type {array}
		 *  @default
		 */
		"F7" : [118],

		/**
		 * The F8 key.
		 *  @type {array}
		 *  @default
		 */
		"F8" : [119],

		/**
		 * The F9 key.
		 *  @type {array}
		 *  @default
		 */
		"F9" : [120],
		
		/**
		 * The F10 key.
		 *  @type {array}
		 *  @default
		 */
		"F10" : [121],

		/**
		 * The F11 key.
		 *  @type {array}
		 *  @default
		 */
		"F11" : [122],
		
		/**
		 * The F12 key.
		 *  @type {array}
		 *  @default
		 */
		"F12" : [123],
		
		/**
		 * The Control key.
		 *  @type {array}
		 *  @default
		 */
		"CTRL" : [17, 162, 163],
		
		/**
		 * The Alt key.
		 *  @type {array}
		 *  @default
		 */
		"ALT" : [18],

		/**
		 * The Shift (left or right) key.
		 *  @type {array}
		 *  @default
		 */
		"SHIFT" : [16, 160, 161],

		/**
		 * The meta (Windows Start, Apple Command, etc.) key.
		 *  @type {array}
		 *  @default
		 */
		"META" : [/*17,*/ 91, 92, 219, 220, 224],
		
		/**
		 * The up arrow key.
		 *  @type {array}
		 *  @default
		 */
		"UP" :
		[
			38,
			CB_Keyboard.extended.WII._allowDuplicateKeyAliases ? CB_Keyboard.extended.WII.UP : null, //Note: same code as "VOL_UP" key (175).
			CB_Keyboard.extended.VK.UP, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV.UP, //29460
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.UP,
			CB_Keyboard.extended.AMAZON_FIRE_TV_REMOTE.UP,
			CB_Keyboard.extended.AMAZON_FIRE_TV_GAME_CONTROLLER.UP,
			CB_Keyboard.extended.PS3.UP,
			CB_Keyboard.extended.PS4.UP,
			CB_Keyboard.extended.PSVITA.UP
		],
		
		/**
		 * The down arrow key.
		 *  @type {array}
		 *  @default
		 */
		"DOWN" :
		[
			40,
			CB_Keyboard.extended.WII._allowDuplicateKeyAliases ? CB_Keyboard.extended.WII.DOWN : null, //Note: same code as "MEDIA_FORWARD" key (176).
			CB_Keyboard.extended.VK.DOWN, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV.DOWN, //29461
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.DOWN,
			CB_Keyboard.extended.AMAZON_FIRE_TV_REMOTE.DOWN,
			CB_Keyboard.extended.AMAZON_FIRE_TV_GAME_CONTROLLER.DOWN,
			CB_Keyboard.extended.PS3.DOWN,
			CB_Keyboard.extended.PS4.DOWN,
			CB_Keyboard.extended.PSVITA.DOWN
		],
		
		/**
		 * The left arrow key.
		 *  @type {array}
		 *  @default
		 */
		"LEFT" :
		[
			37,
			CB_Keyboard.extended.WII._allowDuplicateKeyAliases ? CB_Keyboard.extended.WII.LEFT : null, //Note: same code as "MEDIA_STOP" key (178).
			CB_Keyboard.extended.VK.LEFT, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV.LEFT, //4
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.LEFT,
			CB_Keyboard.extended.AMAZON_FIRE_TV_REMOTE.LEFT,
			CB_Keyboard.extended.AMAZON_FIRE_TV_GAME_CONTROLLER.LEFT,
			CB_Keyboard.extended.PS3.LEFT,
			CB_Keyboard.extended.PS4.LEFT,
			CB_Keyboard.extended.PSVITA.LEFT
		],
		
		/**
		 * The right arrow key.
		 *  @type {array}
		 *  @default
		 */
		"RIGHT" :
		[
			39,
			CB_Keyboard.extended.WII._allowDuplicateKeyAliases ? CB_Keyboard.extended.WII.RIGHT : null, //Note: same code as "MEDIA_BACK" key (177).
			CB_Keyboard.extended.VK.RIGHT, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV.RIGHT, //5
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.RIGHT,
			CB_Keyboard.extended.AMAZON_FIRE_TV_REMOTE.RIGHT,
			CB_Keyboard.extended.AMAZON_FIRE_TV_GAME_CONTROLLER.RIGHT,
			CB_Keyboard.extended.PS3.RIGHT,
			CB_Keyboard.extended.PS4.RIGHT,
			CB_Keyboard.extended.PSVITA.RIGHT
		],
		
		/**
		 * The Enter (Return) key.
		 *  @type {array}
		 *  @default
		 */
		"ENTER" :
		[
			13,
			//10, //Safari Mobile (probaby old). Source: http://mscerts.programming4.us/programming/coding%20javascript%20for%20mobile%20browsers%20%28part%2011%29.aspx
			CB_Keyboard.extended.VK.ENTER, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV.ENTER, //29443
			CB_Keyboard.extended.SAMSUNG_TV.PANEL_ENTER, //309
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.ENTER,
			CB_Keyboard.extended.PS3.CROSS, //Caution, also clicks! Note: same code as "?" symbol key.
			CB_Keyboard.extended.PS4._allowDuplicateKeyAliases ? CB_Keyboard.extended.PS4.SQUARE : null //Also initiates full screen mode. Note: same code as F2 key.
		],
		
		/**
		 * The Backspace key.
		 *  @type {array}
		 *  @default
		 */
		"BACKSPACE" :
		[
			8,
			127, //Safari Mobile (probaby old). Source: http://mscerts.programming4.us/programming/coding%20javascript%20for%20mobile%20browsers%20%28part%2011%29.aspx
			CB_Keyboard.extended.VK.BACK_SPACE
		],

		/**
		 * The Spacebar key.
		 *  @type {array}
		 *  @default
		 */
		"SPACEBAR" :
		[
			32,
			CB_Keyboard.extended.VK.SPACE
		],

		/**
		 * The Tabulator (Tab) key.
		 *  @type {array}
		 *  @default
		 */
		"TAB" : [9],

		/**
		 * The Caps Lock key.
		 *  @type {array}
		 *  @default
		 */
		"CAPS_LOCK" : [20],
		
		/**
		 * The Num Lock (Numeric Lock) key.
		 *  @type {array}
		 *  @default
		 */

		"NUM_LOCK" : [144],

		/**
		 * The Scroll Lock key.
		 *  @type {array}
		 *  @default
		 */
		"SCROLL_LOCK" : [145],

		
		/**
		 * Alias for {@link CB_Keyboard.keys.0}.
		 *  @var CB_Keyboard.keys._0
		 *  @see {@link CB_Keyboard.keys.0}
		 */	
		/**
		 * The 0 (zero) key.
		 *  @type {array}
		 *  @default
		 */
		"0" :
		[
			48, //For keydown for normal keyboard and for keypress.
			96, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._0, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV._0 : null, //17 (same code as CTRL or META key, depending on the system).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._0,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._0
		],
		
		/**
		 * Alias for {@link CB_Keyboard.keys.1}.
		 *  @var CB_Keyboard.keys._1
		 *  @see {@link CB_Keyboard.keys.1}
		 */	
		/**
		 * The 1 key.
		 *  @type {array}
		 *  @default
		 */
		"1" :
		[
			49, //For keydown for normal keyboard and for keypress.
			97, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._1, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV._1 : null, //101 (same code as "5" in the numeric pad).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._1,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._1
		],
		
		/**
		 * Alias for {@link CB_Keyboard.keys.2}.
		 *  @var CB_Keyboard.keys._2
		 *  @see {@link CB_Keyboard.keys.2}
		 */	
		/**
		 * The 2 key.
		 *  @type {array}
		 *  @default
		 */
		"2" :
		[
			50, //For keydown for normal keyboard and for keypress.
			98, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._2, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV._2 : null, //98 (same code as "2" in the numeric pad).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._2,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._2
		],
		
		/**
		 * Alias for {@link CB_Keyboard.keys.3}.
		 *  @var CB_Keyboard.keys._3
		 *  @see {@link CB_Keyboard.keys.3}
		 */	
		/**
		 * The 3 key.
		 *  @type {array}
		 *  @default
		 */
		"3" :
		[
			51, //For keydown for normal keyboard and for keypress.
			99, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._3, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._3, //6
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._3,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._3
		],
		
		/**
		 * Alias for {@link CB_Keyboard.keys.4}.
		 *  @var CB_Keyboard.keys._4
		 *  @see {@link CB_Keyboard.keys.4}
		 */	
		/**
		 * The 4 key.
		 *  @type {array}
		 *  @default
		 */
		"4" :
		[
			52, //For keydown for normal keyboard and for keypress.
			100, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._4, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._4, //8
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._4,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._4
		],
		
		/**
		 * Alias for {@link CB_Keyboard.keys.5}.
		 *  @var CB_Keyboard.keys._5
		 *  @see {@link CB_Keyboard.keys.5}
		 */	
		/**
		 * The 5 key.
		 *  @type {array}
		 *  @default
		 */
		"5" :
		[
			53, //For keydown for normal keyboard and for keypress.
			101, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._5, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._5, //9
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._5,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._5
		],
		
		/**
		 * Alias for {@link CB_Keyboard.keys.6}.
		 *  @var CB_Keyboard.keys._6
		 *  @see {@link CB_Keyboard.keys.6}
		 */	
		/**
		 * The 6 key.
		 *  @type {array}
		 *  @default
		 */
		"6" :
		[
			54, //For keydown for normal keyboard and for keypress.
			102, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._6, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._6, //10
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._6,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._6
		],
		
		/**
		 * Alias for {@link CB_Keyboard.keys.7}.
		 *  @var CB_Keyboard.keys._7
		 *  @see {@link CB_Keyboard.keys.7}
		 */	
		/**
		 * The 7 key.
		 *  @type {array}
		 *  @default
		 */
		"7" :
		[
			55, //For keydown for normal keyboard and for keypress.
			103, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._7, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._7, //12
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._7,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._7
		],
		
		/**
		 * Alias for {@link CB_Keyboard.keys.8}.
		 *  @var CB_Keyboard.keys._8
		 *  @see {@link CB_Keyboard.keys.8}
		 */	
		/**
		 * The 8 key.
		 *  @type {array}
		 *  @default
		 */
		"8" :
		[
			56, //For keydown for normal keyboard and for keypress.
			104, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._8, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._8, //13
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._8,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._8
		],
		
		/**
		 * Alias for {@link CB_Keyboard.keys.9}.
		 *  @var CB_Keyboard.keys._9
		 *  @see {@link CB_Keyboard.keys.9}
		 */	
		/**
		 * The 9 key.
		 *  @type {array}
		 *  @default
		 */
		"9" :
		[
			57, //For keydown for normal keyboard and for keypress.
			105, //For keydown for numeric pad.
			CB_Keyboard.extended.VK._9, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._9, //14
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV._9,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230._9
		],
		
		/**
		 * The "+" (plus) symbol key. NOTE: In some keyboards (for example in Chinese ones), you have to press EQUAL (code 61) with SHIFT to access to "+".
		 *  @type {array}
		 *  @default
		 */
		"PLUS" :
		[
			107, //For keydown for numeric pad.
			171, //For keydown for normal keyboard in Firefox.
			187 //For keydown for normal keyboard in Chrome and IE8.
		], 

		/**
		 * The "-" (minus) symbol key.
		 *  @type {array}
		 *  @default
		 */
		"MINUS" :
		[
			109, //For keydown for numeric pad.
			173, //For keydown for normal keyboard in Firefox. Note: 173 is also used for "MUTE"
			189, //For keydown for normal keyboard in Chrome and IE8.
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MINUS
		],
		
		/**
		 * The "&#42;" (asterisk) symbol key. NOTE: In some keyboards (for example in Spanish for Spain ones), you have to press PLUS (code 187) with SHIFT to access to "*".
		 *  @type {array}
		 *  @default
		 */
		"ASTERISK" :
		[
			//Note: For * and #, Nokia and Samsung report a keyCode of 56/51, Sony Ericsson reports a keyCode of 83/72, onkeypress Nokia, Samsung and Sony Ericsson report both as 42/35.
			//* Source: http://www.quirksmode.org/m/table.html
			106 //For keydown for numeric pad.
		],

		/**
		 * The "/" (slash) symbol key. NOTE: In some keyboards (for example in Spanish for Spain ones), you have to press 7 (code 55) with SHIFT to access to "/".
		 *  @type {array}
		 *  @default
		 */
		"SLASH" :
		[
			111 //For keydown for numeric pad.
		],

		/**
		 * The "." (dot) symbol key.
		 *  @type {array}
		 *  @default
		 */
		"DOT" :
		[
			190 //For keydown for normal keyboard.
		],

		/**
		 * The "," (comma) symbol key.
		 *  @type {array}
		 *  @default
		 */
		"COMMA" :
		[
			188 //For keydown for normal keyboard.
		],
		
		/**
		 * The Home key.
		 *  @type {array}
		 *  @default
		 */
		"HOME" :
		[
			36,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.HOME : null
		],

		/**
		 * The End key.
		 *  @type {array}
		 *  @default
		 */
		"END" : [35],
		
		/**
		 * The Page Up key.
		 *  @type {array}
		 *  @default
		 */
		"PAGE_UP" :
		[
			33,
			CB_Keyboard.extended.VK.PAGE_UP
		],
		
		/**
		 * The Page Down key.
		 *  @type {array}
		 *  @default
		 */
		"PAGE_DOWN" :
		[
			34,
			CB_Keyboard.extended.VK.PAGE_DOWN
		],
		
		/**
		 * The Ins (Insert) key.
		 *  @type {array}
		 *  @default
		 */
		"INS" : [45],

		/**
		 * The Del (Delete) key.
		 *  @type {array}
		 *  @default
		 */
		"DEL" : [46],

		/**
		 * The "A" key.
		 *  @type {array}
		 *  @default
		 */
		"A" : [65, CB_Keyboard.extended.VK.A],

		/**
		 * The "B" key.
		 *  @type {array}
		 *  @default
		 */
		"B" : [66, CB_Keyboard.extended.VK.B],
		
		/**
		 * The "C" key.
		 *  @type {array}
		 *  @default
		 */
		"C" : [67, CB_Keyboard.extended.VK.C],
		
		/**
		 * The "D" key.
		 *  @type {array}
		 *  @default
		 */
		"D" : [68, CB_Keyboard.extended.VK.D],
		
		/**
		 * The "E" key.
		 *  @type {array}
		 *  @default
		 */
		"E" : [69, CB_Keyboard.extended.VK.E],
		
		/**
		 * The "F" key.
		 *  @type {array}
		 *  @default
		 */
		"F" : [70, CB_Keyboard.extended.VK.F],
		
		/**
		 * The "G" key.
		 *  @type {array}
		 *  @default
		 */
		"G" : [71, CB_Keyboard.extended.VK.G],
		
		/**
		 * The "H" key.
		 *  @type {array}
		 *  @default
		 */
		"H" : [72, CB_Keyboard.extended.VK.H],
		
		/**
		 * The "I" key.
		 *  @type {array}
		 *  @default
		 */
		"I" : [73, CB_Keyboard.extended.VK.I],
		
		/**
		 * The "J" key.
		 *  @type {array}
		 *  @default
		 */
		"J" : [74, CB_Keyboard.extended.VK.J],
		
		/**
		 * The "K" key.
		 *  @type {array}
		 *  @default
		 */
		"K" : [75, CB_Keyboard.extended.VK.K],
		
		/**
		 * The "L" key.
		 *  @type {array}
		 *  @default
		 */
		"L" : [76, CB_Keyboard.extended.VK.L],
		
		/**
		 * The "M" key.
		 *  @type {array}
		 *  @default
		 */
		"M" : [77, CB_Keyboard.extended.VK.M],
		
		/**
		 * The "N" key.
		 *  @type {array}
		 *  @default
		 */
		"N" : [78, CB_Keyboard.extended.VK.N],
		
		/**
		 * The "O" key.
		 *  @type {array}
		 *  @default
		 */
		"O" : [79, CB_Keyboard.extended.VK.O],
		
		/**
		 * The "P" key.
		 *  @type {array}
		 *  @default
		 */
		"P" : [80, CB_Keyboard.extended.VK.P],
		
		/**
		 * The "Q" key.
		 *  @type {array}
		 *  @default
		 */
		"Q" : [81, CB_Keyboard.extended.VK.Q],
		
		/**
		 * The "R" key.
		 *  @type {array}
		 *  @default
		 */
		"R" : [82, CB_Keyboard.extended.VK.R],
		
		/**
		 * The "S" key.
		 *  @type {array}
		 *  @default
		 */
		"S" : [83, CB_Keyboard.extended.VK.S],
		
		/**
		 * The "T" key.
		 *  @type {array}
		 *  @default
		 */
		"T" : [84, CB_Keyboard.extended.VK.T],
		
		/**
		 * The "U" key.
		 *  @type {array}
		 *  @default
		 */
		"U" : [85, CB_Keyboard.extended.VK.U],
		
		/**
		 * The "V" key.
		 *  @type {array}
		 *  @default
		 */
		"V" : [86, CB_Keyboard.extended.VK.V],
		
		/**
		 * The "W" key.
		 *  @type {array}
		 *  @default
		 */
		"W" : [87, CB_Keyboard.extended.VK.W],
		
		/**
		 * The "X" key.
		 *  @type {array}
		 *  @default
		 */
		"X" : [88, CB_Keyboard.extended.VK.X],
		
		/**
		 * The "Y" key.
		 *  @type {array}
		 *  @default
		 */
		"Y" : [89, CB_Keyboard.extended.VK.Y],
		
		/**
		 * The "Z" key.
		 *  @type {array}
		 *  @default
		 */
		"Z" : [90, CB_Keyboard.extended.VK.Z],
		
		/**
		 * The Pause key.
		 *  @type {array}
		 *  @default
		 */
		"PAUSE" :
		[
			19,
			CB_Keyboard.extended.VK.PAUSE, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.PAUSE : null, //74 (same code as "J" key).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MEDIA_PAUSE,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230.PAUSE
		],
		
		/**
		 * The Clear key.
		 *  @type {array}
		 *  @default
		 */
		"CLEAR" :
		[
			12,
			254,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.CLEAR : null
		],
		
		/**
		 * The Select key (for Windows' Virtual keyboard).
		 *  @type {array}
		 *  @default
		 */
		"SELECT" : [41],

		/**
		 * The Print key.
		 *  @type {array}
		 *  @default
		 */
		"PRINT" :
		[
			42,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.PRINT : null
		],
		
		/**
		 * The Print Screen key.
		 *  @type {array}
		 *  @default
		 */
		"PRINT_SCREEN" : [44], //Print screen key. Note: 44 is the same code as comma (",") keypress code.
		
		/**
		 * The Execute key.
		 *  @type {array}
		 *  @default
		 */
		"EXECUTE" : [43], //Execute key. Note: 43 is the same code as plus ("+") keypress code.
		
		/**
		 * The Help key.
		 *  @type {array}
		 *  @default
		 */
		"HELP" : //Help key. Note: 47 is the same code as slash ("/") keypress code:
		[
			47,
			CB_Keyboard.extended.VK.HELP,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.HELP : null
		],
		
		/**
		 * The Apps (Applications) key.
		 *  @type {array}
		 *  @default
		 */
		"APPS" : [93],
		
		/**
		 * The Sleep key.
		 *  @type {array}
		 *  @default
		 */
		"SLEEP" :
		[
			95,
			CB_Keyboard.extended.SAMSUNG_TV.SLEEP //1097
		],
		
		/**
		 * The Separator key.
		 *  @type {array}
		 *  @default
		 */
		"SEPARATOR" : [108], //Separator key. Note: 108 is the same code as L lowercase ("l") keypress code.
		
		/**
		 * The Decimal key (for numeric pads). NOTE: In some decimal systems, as in Spanish, it is a comma (","). Normally, numeric keypads in Spanish for Spain keyboards show a dot (".") but others as German keyboards shows a comma (",").
		 *  @type {array}
		 *  @default
		 */
		"DECIMAL" : [110],
		
		/**
		 * The Menu key.
		 *  @type {array}
		 *  @default
		 */
		"MENU" :
		[
			164,
			165,
			CB_Keyboard.extended.SAMSUNG_TV.MENU, //262
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.PANEL_MENU : null,
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MENU
		],
		
		/**
		 * The mouse's left button (for Windows' Virtual Keyboard).
		 *  @type {array}
		 *  @default
		 */
		"MOUSE_LEFT_BUTTON" : [1],
		
		/**
		 * The mouse's middle button (for Windows' Virtual Keyboard).
		 *  @type {array}
		 *  @default
		 */
		"MOUSE_MIDDLE_BUTTON" : [4],
		
		/**
		 * The mouse's right button (for Windows' Virtual Keyboard).
		 *  @type {array}
		 *  @default
		 */
		"MOUSE_RIGHT_BUTTON" : [2], //For Windows' Virtual keyboard.
		
		/**
		 * The mouse's X1 button (for Windows' Virtual Keyboard).
		 *  @type {array}
		 *  @default
		 */
		"MOUSE_X1_BUTTON" : [5], //For Windows' Virtual keyboard.
		
		/**
		 * The mouse's X2 button (for Windows' Virtual Keyboard).
		 *  @type {array}
		 *  @default
		 */
		"MOUSE_X2_BUTTON" : [6], //For Windows' Virtual keyboard.
		
		/**
		 * The Mute key.
		 *  @type {array}
		 *  @default
		 */
		"MUTE" : //Mute key. Note: 173 is the same code as minus ("-" symbol) in normal keyboard in Firefox:
		[
			173,
			181,
			CB_Keyboard.extended.VK.MUTE,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.MUTE : null, //Same code as ESC key (27).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MUTE
		],
		
		/**
		 * The Volume Up key.
		 *  @type {array}
		 *  @default
		 */
		"VOL_UP" : //Volume up key. Note: 175 is same code as "UP" for Wii (Wiimote) D-PAD:
		[
			175,
			183,
			CB_Keyboard.extended.VK.VOLUME_UP,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.VOLUP : null,
			CB_Keyboard.extended.SAMSUNG_TV.VOL_UP, //7
			CB_Keyboard.extended.SAMSUNG_TV.PANEL_VOL_UP, //203
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.PANEL_VOLUP : null,
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.VOLUME_UP
		], 

		/**
		 * The Volume Down key.
		 *  @type {array}
		 *  @default
		 */
		"VOL_DOWN" :
		[
			174,
			182,
			CB_Keyboard.extended.VK.VOLUME_DOWN,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.VOLDOWN : null,
			CB_Keyboard.extended.SAMSUNG_TV.VOL_DOWN, //1
			CB_Keyboard.extended.SAMSUNG_TV.PANEL_VOL_DOWN, //204
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.PANEL_VOLDOW : null,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.PANEL_VOLDOWN : null,
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.VOLUME_DOWN
		], 
		
		/**
		 * The Multimedia Forward key.
		 *  @type {array}
		 *  @default
		 */
		"MEDIA_FORWARD" : //Multimedia forward key. Note: 176 is same code as "DOWN" for Wii (Wiimote) D-PAD:
		[
			176,
			228,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230.FORWARD, //LG Smart TV (Linux 35230).
			CB_Keyboard.extended.VK.FAST_FWD, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV.FF_, //1078
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.FF : null, //72 (same code as "H" key).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MEDIA_FORWARD,
			CB_Keyboard.extended.AMAZON_FIRE_TV_REMOTE.FF
		],
		
		/**
		 * The Multimedia Rewind key.
		 *  @type {array}
		 *  @default
		 */
		"MEDIA_REWIND" : //Multimedia rewind key. Note: 177 is same code as "RIGHT" for Wii (Wiimote) D-PAD:
		[
			177,
			227,
			CB_Keyboard.extended.VK.REWIND, //Smart TV Alliance.
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230.REWIND, //LG Smart TV (Linux 35230).
			CB_Keyboard.extended.SAMSUNG_TV.REWIND_, //1080
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.RW : null, //69 (same code as "E" key).
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.REWIND : null,
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MEDIA_REWIND,
			CB_Keyboard.extended.AMAZON_FIRE_TV_REMOTE.RW
		],
		
		/**
		 * The Multimedia Stop key.
		 *  @type {array}
		 *  @default
		 */
		"MEDIA_STOP" : //Multimedia stop key. Note: 178 is same code as "LEFT" for Wii (Wiimote) D-PAD:
		[
			178,
			CB_Keyboard.extended.VK.STOP, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.STOP : null, //70 (same code as "F" key).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MEDIA_STOP
		],
		
		/**
		 * The Multimedia Play/Pause key.
		 *  @type {array}
		 *  @default
		 */
		"MEDIA_PLAY_PAUSE" :
		[
			179,
			CB_Keyboard.extended.VK.PLAY_PAUSE,
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MEDIA_PLAY_PAUSE,
			CB_Keyboard.extended.AMAZON_FIRE_TV_REMOTE.PLAY_PAUSE
		],
		
		/**
		 * The Browser's Back key.
		 *  @type {array}
		 *  @default
		 */
		"BROWSER_BACK" :
		[
			166,
			CB_Keyboard.extended.VK.PREV, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.RETURN : null, //Same code as "X" key (88).
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.PANEL_RETURN : null,
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.RETURN,
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MEDIA_TRACK_PREVIOUS,
			CB_Keyboard.extended.VK.BACK //Smart TV Alliance.
		],
		
		/**
		 * The Browser's Forward key.
		 *  @type {array}
		 *  @default
		 */
		"BROWSER_FORWARD" :
		[
			167,
			CB_Keyboard.extended.VK.NEXT, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MEDIA_TRACK_NEXT
		],
		
		/**
		 * The Browser's Refresh (Reload) key.
		 *  @type {array}
		 *  @default
		 */
		"BROWSER_REFRESH" : [168],
		
		/**
		 * The Browser's Stop key.
		 *  @type {array}
		 *  @default
		 */
		"BROWSER_STOP" : [169],
		
		/**
		 * The Browser's Search key.
		 *  @type {array}
		 *  @default
		 */
		"BROWSER_SEARCH" :
		[
			170,
			CB_Keyboard.extended.VK._allowDuplicateKeyAliases ? CB_Keyboard.extended.VK.SEARCH : null,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.SEARCH : null,
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.SEARCH
		],
		
		/**
		 * The Browser's Favorites key.
		 *  @type {array}
		 *  @default
		 */
		"BROWSER_FAVORITES" : [171], //Browser favourites key. Note: 171 is the same code as plus ("+") in normal keyboard in Firefox.
		
		/**
		 * The Browser's Home key.
		 *  @type {array}
		 *  @default
		 */
		"BROWSER_HOME" :
		[
			172
		],
		
		/**
		 * The Mail key.
		 *  @type {array}
		 *  @default
		 */
		"MAIL" : [180],
		
		/**
		 * The Select Media key.
		 *  @type {array}
		 *  @default
		 */
		"MEDIA_SELECT" : [181], //Select media key. Note: 181 is the same code as mute key.
		
		/**
		 * The App1 key.
		 *  @type {array}
		 *  @default
		 */
		"APP1" : [182], //App1 key. Note: 182 is the same code as volume down key.
		
		/**
		 * The App2 key.
		 *  @type {array}
		 *  @default
		 */
		"APP2" : [183], //App2 key. Note: 182 is the same code as volume up key.
		
		/**
		 * The Attn key.
		 *  @type {array}
		 *  @default
		 */
		"ATTN" : [246],
		
		/**
		 * The CrSel key.
		 *  @type {array}
		 *  @default
		 */
		"CRSEL" : [247],
		
		/**
		 * The ExSel key.
		 *  @type {array}
		 *  @default
		 */
		"EXSEL" : [248],
		
		/**
		 * The EREOF (Erase EOF) key.
		 *  @type {array}
		 *  @default
		 */
		"EREOF" : [249],
		
		/**
		 * The Play key.
		 *  @type {array}
		 *  @default
		 */
		"PLAY" :
		[
			250,
			CB_Keyboard.extended.LG_SMART_TV_LINUX_35230.PLAY, //LG Smart TV (Linux 35230).
			CB_Keyboard.extended.VK.PLAY, //Smart TV Alliance.
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.PLAY : null, //71 (same code as "G" key).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.MEDIA_PLAY
		],
		
		/**
		 * The Zoom key.
		 *  @type {array}
		 *  @default
		 */
		"ZOOM" :
		[
			251,
			CB_Keyboard.extended.SAMSUNG_TV.ZOOM1, //1083
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.ZOOM2 : null,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.ZOOM_IN : null//,
			//CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.ZOOM_OUT : null
		],
		
		/**
		 * The PA1 key.
		 *  @type {array}
		 *  @default
		 */
		"PA1" : [253],
		
		/**
		 * The Info (Information) key.
		 *  @type {array}
		 *  @default
		 */
		"INFO" :
		[
			CB_Keyboard.extended.VK.INFO,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.INFO : null, //31
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.INFO
		],
		
		/**
		 * The Audio Description key.
		 *  @type {array}
		 *  @default
		 */
		"AUDIODESCRIPTION" :
		[
			CB_Keyboard.extended.VK._allowDuplicateKeyAliases ? CB_Keyboard.extended.VK.AUDIODESCRIPTION : null,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.CAPTION : null,
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.CAPTION
		],
		
		/**
		 * The Subtitle key.
		 *  @type {array}
		 *  @default
		 */
		"SUBTITLE" :
		[
			CB_Keyboard.extended.VK.SUBTITLE,
			CB_Keyboard.extended.SAMSUNG_TV.SUBTITLE, //652
			CB_Keyboard.extended.SAMSUNG_TV.SUB_TITLE //1089
		],
		
		/**
		 * The HD (High Definition) key.
		 *  @type {array}
		 *  @default
		 */
		"HD" :
		[
			CB_Keyboard.extended.VK._allowDuplicateKeyAliases ? CB_Keyboard.extended.VK.HD : null
		],
		
		/**
		 * The Red colour button.
		 *  @type {array}
		 *  @default
		 */
		"RED" :
		[
			CB_Keyboard.extended.VK.RED,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.RED : null, //Same code as SEPARATOR key (108).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.RED
		],
		
		/**
		 * The Green colour button.
		 *  @type {array}
		 *  @default
		 */
		"GREEN" :
		[
			CB_Keyboard.extended.VK.GREEN,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.GREEN : null, //Same code as CAPS_LOCK key (20).
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.GREEN
		],
		
		/**
		 * The Yellow colour button.
		 *  @type {array}
		 *  @default
		 */
		"YELLOW" :
		[
			CB_Keyboard.extended.VK.YELLOW,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.YELLOW : null, //21
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.YELLOW
		],
		
		/**
		 * The Blue colour button.
		 *  @type {array}
		 *  @default
		 */
		"BLUE" :
		[
			CB_Keyboard.extended.VK.BLUE,
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.BLUE : null, //22
			CB_Keyboard.extended.SAMSUNG_TIZEN_TV.BLUE
		],
		
		/**
		 * The Cyan colour button.
		 *  @type {array}
		 *  @default
		 */
		"CYAN" :
		[
			CB_Keyboard.extended.SAMSUNG_TV._allowDuplicateKeyAliases ? CB_Keyboard.extended.SAMSUNG_TV.CYAN : null
		]
	};
	for (CB_Keyboard._x = 0; CB_Keyboard._x < 10; CB_Keyboard._x++) { CB_Keyboard.keys["_" + CB_Keyboard._x] = CB_Keyboard.keys[CB_Keyboard._x]; } //Sets CB_Keyboard.keys._NUMBER = CB_Keyboard.keys[NUMBER] from 0 to 9.
	CB_Keyboard._x = undefined;

	/**
	 * Object whose properties are aliases for char codes (each property can contain an array with one or more integers which belong to the char codes).
	 *  @namespace
	 *  @type {Object}
	 */
	CB_Keyboard.chars =
	{
		/**
		 * The "0" (zero) character.
		 *  @type {array}
		 *  @default
		 */
		"0" : [48],
		
		/**
		 * The "1" character.
		 *  @type {array}
		 *  @default
		 */
		"1" : [49],
		
		/**
		 * The "2" character.
		 *  @type {array}
		 *  @default
		 */
		"2" : [50],
		
		/**
		 * The "3" character.
		 *  @type {array}
		 *  @default
		 */
		"3" : [51],
		
		/**
		 * The "4" character.
		 *  @type {array}
		 *  @default
		 */
		"4" : [52],
		
		/**
		 * The "5" character.
		 *  @type {array}
		 *  @default
		 */
		"5" : [53],
		
		/**
		 * The "6" character.
		 *  @type {array}
		 *  @default
		 */
		"6" : [54],
		
		/**
		 * The "7" character.
		 *  @type {array}
		 *  @default
		 */
		"7" : [55],
		
		/**
		 * The "8" character.
		 *  @type {array}
		 *  @default
		 */
		"8" : [56],
		
		/**
		 * The "9" character.
		 *  @type {array}
		 *  @default
		 */
		"9" : [57],
		
		/**
		 * The "+" (plus) character.
		 *  @type {array}
		 *  @default
		 */
		"PLUS" : [43],
		
		/**
		 * The "-" (minus) character.
		 *  @type {array}
		 *  @default
		 */
		"MINUS" : [45],
		
		/**
		 * The "*" (asterisk) character.
		 *  @type {array}
		 *  @default
		 */
		"ASTERISK" : [42],
		
		/**
		 * The "/" (slash) character.
		 *  @type {array}
		 *  @default
		 */
		"SLASH" : [47],
		
		/**
		 * The "." (dot) character.
		 *  @type {array}
		 *  @default
		 */
		"DOT" : [46],
		
		/**
		 * The "," (comma) character.
		 *  @type {array}
		 *  @default
		 */
		"COMMA" : [44],
		
		/**
		 * The "A" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"A" : [65],
		
		/**
		 * The "a" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"a" : [97],
		
		/**
		 * The "B" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"B" : [66],
		
		/**
		 * The "b" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"b" : [98],
		
		/**
		 * The "C" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"C" : [67],

		/**
		 * The "c" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"c" : [99],
		
		/**
		 * The "D" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"D" : [68],
		
		/**
		 * The "d" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"d" : [100],
		
		/**
		 * The "E" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"E" : [69],
		
		/**
		 * The "e" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"e" : [101],
		
		/**
		 * The "F" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"F" : [70],
		
		/**
		 * The "f" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"f" : [102],
		
		/**
		 * The "G" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"G" : [71],
		
		/**
		 * The "g" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"g" : [103],

		/**
		 * The "H" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"H" : [72],
		
		/**
		 * The "h" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"h" : [104],

		/**
		 * The "I" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"I" : [73],
		
		/**
		 * The "i" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"i" : [105],

		/**
		 * The "J" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"J" : [74],
		
		/**
		 * The "j" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"j" : [106],

		/**
		 * The "K" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"K" : [75],
		
		/**
		 * The "k" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"k" : [107],

		/**
		 * The "L" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"L" : [76],
		
		/**
		 * The "l" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"l" : [108],

		/**
		 * The "M" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"M" : [77],
		
		/**
		 * The "m" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"m" : [109],

		/**
		 * The "N" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"N" : [78],
		
		/**
		 * The "n" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"n" : [110],

		/**
		 * The "O" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"O" : [79],
		
		/**
		 * The "o" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"o" : [111],

		/**
		 * The "P" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"P" : [80],
		
		/**
		 * The "p" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"p" : [112],

		/**
		 * The "Q" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"Q" : [81],
		
		/**
		 * The "q" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"q" : [113],

		/**
		 * The "R" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"R" : [82],
		
		/**
		 * The "r" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"r" : [114],

		/**
		 * The "S" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"S" : [83],
		
		/**
		 * The "s" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"s" : [115],

		/**
		 * The "T" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"T" : [84],
		
		/**
		 * The "t" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"t" : [116],

		/**
		 * The "U" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"U" : [85],
		
		/**
		 * The "u" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"u" : [117],

		/**
		 * The "V" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"V" : [86],
		
		/**
		 * The "v" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"v" : [118],

		/**
		 * The "W" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"W" : [87],
		
		/**
		 * The "w" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"w" : [119],

		/**
		 * The "X" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"X" : [88],
		
		/**
		 * The "x" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"x" : [120],

		/**
		 * The "Y" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"Y" : [89],
		
		/**
		 * The "y" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"y" : [121],

		/**
		 * The "Z" letter, upper case (capitalized).
		 *  @type {array}
		 *  @default
		 */
		"Z" : [90],
		
		/**
		 * The "z" letter, lower case.
		 *  @type {array}
		 *  @default
		 */
		"z" : [122]
	};
	
	
	//Initializes all values:
	CB_Keyboard.init = function()
	{
		if (CB_Keyboard.initialized) { return CB_Keyboard; }

		//The object has been initialized:
		CB_Keyboard.initialized = true;
		
		//Removes possible key codes duplicated or not really defined (undefined or null):
		for (var k in CB_Keyboard.keys)
		{
			CB_Keyboard.keys[k] = CB_Arrays.removeDuplicated(CB_Keyboard.keys[k], function(v) { return (typeof(v) === "undefined" || v === null || isNaN(v)); });
		}

		//Every time that focus is lost, it will clear the keysDown array:
		////CB_Events.add(window, "blur", function() { CB_Keyboard.keysDown = {}; }, true, true, false);
		try //using catch due some web clients doesn't allow to manipulate the window object of parent iframes:
		{
			//CB_Events.add(CB_Client.getWindow(), "blur", function() { CB_Keyboard.keysDown = {}; }, true, true, false);
			CB_Events.add(CB_Client.getWindow(), "blur", CB_Keyboard.clearKeysDown, true, true, false);
		}
		catch(E)
		{
			//CB_Events.add(window, "blur", function() { CB_Keyboard.keysDown = {}; }, true, true, false);
			CB_Events.add(window, "blur", CB_Keyboard.clearKeysDown, true, true, false);
		}

		//Every time that visibility is changed, it will clear the array:
		//CB_Screen.onVisibilityChange(function() { CB_Keyboard.keysDown = {}; });

		//Sets the default keyboard events:
		CB_Keyboard._setDefaultEvents();
		
		return CB_Keyboard;
	}

	
	//Sets the default Keyboard events to an object (document by default):
	CB_Keyboard._setDefaultEvents = function(target)
	{
		if (typeof(target) === "undefined" || target === null) { target = document; }
	
		var keyDownCallbackFunction = undefined;
		//If we want to prevent the Firefox bug that affects SockJS library (see https://github.com/sockjs/sockjs-client/issues/18):
		if (CB_Configuration[CB_BASE_NAME].CB_Net_Sockets_PREVENT_FIREFOX_ESC_BUG) { keyDownCallbackFunction = function(e, keyDown, updateKeysPressed, callbackFunction, keyCode) { if (keyCode === 27) { e.preventDefault(); } }; }

		//Sets the event that will check if a key is down:
		CB_Events.add(target, "keydown", function(e) { /*e = CB_Events.normalize(e);*/ CB_Keyboard._updateKeysDown(e, true, true, keyDownCallbackFunction); }, true, true, false);
		
		//Prevents F11 key if the web client is compatible with Fullscreen API:
		//CB_Events.add(target, "keydown", function(e) { e = CB_Events.normalize(e); CB_Keyboard.preventF11Key(e); }, true, true, false);
		
		//Sets the event that will check if a key is released:
		CB_Events.add(target, "keyup", function(e) { /*e = CB_Events.normalize(e);*/ CB_Keyboard._updateKeysDown(e, false, true); }, true, true, false);
		
		//Sets the event that will store the typed string (or clear it):
		//CB_Events.add(target, "keydown", function(e) { /*e = CB_Events.normalize(e);*/ CB_Keyboard._updateTypedString(e); }, true, true, false);
		CB_Events.add(target, "keypress", function(e) { /*e = CB_Events.normalize(e);*/ CB_Keyboard._updateTypedString(e); }, true, true, false);
	}
	
	
	/**
	 * Tries to return the given [keyboard event]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent} with some properties normalized (since different clients can use different values) and perhaps some new properties added (in the case they were missing), when possible. The new attached methods and properties may include polyfills, etc. It also calls the {@link CB_Events.normalize} function internally. Some properties added or affected could be [keyCode]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode}, [location]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location}, [ctrlKey]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey}, [altKey]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey}, [shiftKey]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey}, etc.
	 *  @function
	 *  @param {Event} e - [Keyboard event]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent} object. If not provided, it will use the value of "event", "window.event", "Event" or an empty object ("{}").
	 *  @returns {Event} Returns the [keyboard event]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent} object normalized.
	 *  @todo Calculate (if possible) the values for location, ctrlKey, altKey, etc. when added, to simulate the expected behaviour.
	 */
	CB_Keyboard.normalizeEvent = function(e)
	{
		e = CB_Events.normalize(e);

		//If the web client doesn't support it, sets the keyCode property:
		if (typeof(e.keyCode) === "undefined" || e.keyCode === null)
		{
			e.keyCode = CB_Keyboard.getKeyCode(e, true);
		}
		
		//Sometimes the property keyCode cannot be overwritten, so we defines this function:
		e.getKeyCode = e.getKeyCode || function() { return CB_Keyboard.getKeyCode(this); };

		//If the web client doesn't support it, sets the location property:
		if (typeof(e.location) === "undefined" || e.location === null)
		{
			e.location = e.keyLocation ? e.keyLocation : 0;
		}
		
		//If the web client doesn't support it, determines whether the CTRL, ALT, SHIFT or META keys are pressed:
		if (typeof(e.ctrlKey) === "undefined" || e.ctrlKey === null)
		{
			e.ctrlKey = CB_Keyboard.isKeyDown(CB_Keyboard.keys.CTRL);
		}
		if (typeof(e.altKey) === "undefined" || e.altKey === null)
		{
			e.altKey = CB_Keyboard.isKeyDown(CB_Keyboard.keys.ALT);
		}
		if (typeof(e.shiftKey) === "undefined" || e.shiftKey === null)
		{
			e.shiftKey = CB_Keyboard.isKeyDown(CB_Keyboard.keys.SHIFT);
		}
		/*if (typeof(e.metaKey) === "undefined" || e.metaKey === null)
		{
			e.metaKey = CB_Keyboard.isKeyDown(CB_Keyboard.keys.META);
		}*/

		return e;
	}
	
	

	/**
	 * Returns the key code that is contained in the given [keyboard event]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent}.
	 *  @function
	 *  @param {Event} e - [Keyboard event]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent} object.
	 *  @param {boolean} [avoidNormalize=false] - If it is not set to true, it will call the {@link CB_Events.normalize} function internally before.
	 *  @returns {integer} Returns the key code.
	 *  @todo Have in mind that [keyCode]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode} is deprecated.
	 */
	CB_Keyboard.getKeyCode = function(e, avoidNormalize)
	{
		if (!avoidNormalize) { e = CB_Events.normalize(e); }
		var keyCode = null;
		if (e.keyCode) { keyCode = e.keyCode; }
		else if (e.key && typeof(e.key) === "number") { keyCode = e.key; } //For SLCanvas.
		else if (window.Event && e.which) { keyCode = e.which; }
		else if (typeof(e.charCode) === "number") { keyCode = e.charCode; }

		return keyCode;
	}
	
	
	//Updates array keysDown (this is called whenever a key is down or released):
	CB_Keyboard._updateKeysDown = function(e, keyDown, updateKeysPressed, callbackFunction)
	{
		//By default, updates keys pressed array:
		if (typeof(updateKeysPressed) === "undefined" || updateKeysPressed === null) { updateKeysPressed = true; }
	
		//Defines the code of the key pressed:
		//e = CB_Events.normalize(e);
		e = CB_Keyboard.normalizeEvent(e);
		//var keyCode = CB_Keyboard.getKeyCode(e);
		//var keyCode = e.keyCode;
		var keyCode = e.getKeyCode();

		//If the key code is defined:
		if (keyCode !== null)
		{
			//Sets the status of the key (being pressed/down or relased):
			CB_Keyboard.keysDown[keyCode] = keyDown;
			
			//If pressed, stores the key code pressed in the keys pressed array:
			if (updateKeysPressed && keyDown)
			{
				CB_Keyboard._updateKeysPressed(keyCode);
			}
			
			if (typeof(callbackFunction) === "function") { callbackFunction(e, keyDown, updateKeysPressed, callbackFunction, keyCode); }
		}
	}


	/**
	 * Clears (empties totally or partially) the {@link CB_Keyboard.keysDown} object which contains the detected keys pressed or released.
	 *  @function
	 *  @param {boolean} keepPressed - If set to true, it will keep the pressed keys.
	 */
	CB_Keyboard.clearKeysDown = function(keepPressed)
	{
		if (!keepPressed) { CB_Keyboard.keysDown = {}; }
		else
		{
			var keysDown = {};
			for (var keyCode in CB_Keyboard.keysDown)
			{
				if (CB_Keyboard.keysDown[keyCode]) { keysDown[keyCode] = true; }
			}
			CB_Keyboard.keysDown = keysDown;
		}
	}
	

	/**
	 * Returns the {@link CB_Keyboard.keysDown} object which contains the detected keys pressed or released.
	 *  @function
	 *  @returns {Object} Returns the {@link CB_Keyboard.keysDown} object.
	 */
	CB_Keyboard.getKeysDown = function()
	{
		return CB_Keyboard.keysDown;
	}

	
	/**
	 * Returns whether the given key codes are being pressed (any of them or all at the same time, depending on the "allPressed" parameter).
	 *  @function
	 *  @param {integer|array|Object} keyCodes - An integer with the key code or a numeric array with the key codes that we want to check. It can also be an array of arrays, being each element a numeric array with the key codes that we want to check. Although not recommended (for performance purposes), this parameter can also support an object whose indexes are the keycodes (it will be converted to a numeric array internally).
	 *  @param {boolean} [allPressed=false] - If set true, the function will only return true in the case that all given key codes are currently being pressed. Otherwise, if set to false, the function will return true in the case that any of the given key codes is currently being pressed. When the "keyCodes" is an array of arrays with key codes, it will be considered that all keys are being pressed if each single array (all of them) has at least one of its key codes pressed.
	 *  @returns {boolean} If "allPressed" parameter is set to true, returns true in the case that all given key codes are currently being pressed. If "allPressed" parameter is set to false, returns true in the case that any of the given key codes is currently being pressed. In all other cases, it returns false.
	 */
	CB_Keyboard.isKeyDown = function(keyCodes, allPressed)
	{
		var isDown = false;
		
		//If the parameter given is not an array, we force it to be an array:
		if (!isNaN(keyCodes)) { keyCodes = [parseInt(keyCodes)]; } //If a number has been received, it will be the first and unique element of the array. Note that parseInt could return a NaN.
		if (!CB_isArray(keyCodes)) //If we have received an object which is not an array:
		{
			var keyCodesArray = [];
			for (var keyCode in keyCodes)
			{
				if (!isNaN(keyCode)) { keyCodesArray[keyCodesArray.length] = parseInt(keyCode); } //Only stores 
			}
			keyCodes = keyCodesArray;
		}

		var keysDown = CB_Keyboard.getKeysDown();
		var keyCodesLength = keyCodes.length;
		for (var x = 0; x < keyCodesLength; x++)
		{
			//If the code given is a number, it exists in the keysDown array and it is being pressed:
			if (typeof(keyCodes[x]) !== "undefined" && keyCodes[x] !== null && !isNaN(keyCodes[x]) && typeof(keysDown[keyCodes[x]]) !== "undefined" && keysDown[keyCodes[x]])
			{
				isDown = true;
				//if (!allPressed) { break; } 
			}
			//...otherwise, if the value belongs to an array, calls itself recursively:
			else if (CB_isArray(keyCodes[x]))
			{
				isDown = CB_Keyboard.isKeyDown(keyCodes[x], false); //If any key is pressed is enough.
			}
			//...otherwise, if the user wanted to know whether all given keys were pressed:
			else if (allPressed)
			{
				//Not all given keys are pressed so it exits:
				isDown = false;
				//break;
			}
			
			if (allPressed && !isDown) { break; }
			else if (!allPressed && isDown) { break; } //If the user does not want to know whether all are keys given are pressed, with one is enough so it exits.
		}
		
		return isDown;
	}

	
	//Updates the keys pressed array:
	CB_Keyboard._updateKeysPressed = function(keyCode)
	{
		//Clears the timeout that clears the keys pressed:
		clearTimeout(CB_Keyboard._keysPressedExpirationTimeout);

		//Updates the keys pressed and its codes:
		CB_Keyboard.keysPressed[CB_Keyboard.keysPressed.length] = keyCode;
		
		//Sets the timeout that clears the array after some milliseconds:
		CB_Keyboard._keysPressedExpirationTimeout =
			setTimeout
			(
				function()
				{
					CB_Keyboard.keysPressed = [];
				},
				CB_Keyboard._keysPressedExpiration
			);
	
	}


	/**
	 * Clears (empties totally or partially) the {@link CB_Keyboard.keysPressed} array which contains the key codes pressed recently.
	 *  @function
     *  @param {boolean} keepPressed - If set to true, it will keep the pressed keys (taken from the {@link CB_Keyboard.keysDown} object).
	 */
	CB_Keyboard.clearKeysPressed = function(keepPressed)
	{
		//Clears the timeout that clears the keys pressed:
		clearTimeout(CB_Keyboard._keysPressedExpirationTimeout);
		
		if (!keepPressed) { CB_Keyboard.keysPressed = []; }
		else
		{
			var keysPressed = [];
			for (var keyCode in CB_Keyboard.keysDown)
			{
				if (CB_Keyboard.keysDown[keyCode]) { keysPressed[keysPressed.length] = keyCode; }
			}
			CB_Keyboard.keysPressed = keysPressed;
		}
	}
	
	
	/**
	 * Returns the {@link CB_Keyboard.keysPressed} array which contains the key codes pressed recently (it will be cleared after the chosen milliseconds set with the {@link CB_Keyboard.setKeysPressedExpiration} function).
	 *  @function
	 *  @returns {array} Returns the {@link CB_Keyboard.keysPressed} array.
	 */
	CB_Keyboard.getKeysPressed = function()
	{
		return CB_Keyboard.keysPressed;
	}


	/**
	 * Sets the milliseconds after which the {@link CB_Keyboard.keysPressed} array is always cleared (emptied). The time always starts counting from zero when a key is pressed ([onKeyDown]{@link https://developer.mozilla.org/en-US/docs/Web/Events/keydown} event is fired).
	 *  @function
	 *  @param {integer} keysPressedExpiration - An integer greater than 0 (zero) representing the milliseconds after which we desire that the {@link CB_Keyboard.keysPressed} array is cleared (emptied), if no key is pressed during this time.
	 *  @returns {boolean} Returns true if the given time could be applied or false otherwise.
	 */
	CB_Keyboard.setKeysPressedExpiration = function(keysPressedExpiration)
	{
		//Only allows numbers greater than zero:
		if (typeof(keysPressedExpiration) !== "undefined" && keysPressedExpiration !== null && !isNaN(keysPressedExpiration) && keysPressedExpiration > 0)
		{
			CB_Keyboard._keysPressedExpiration = parseInt(keysPressedExpiration);
			return true;
		}
		return false;
	}


	/**
	 * Returns the milliseconds after which the {@link CB_Keyboard.keysPressed} array is always cleared (emptied). The time always starts counting from zero again when a key is pressed ([onKeyDown]{@link https://developer.mozilla.org/en-US/docs/Web/Events/keydown} event is fired).
	   To define this amount of time, the {@link CB_Keyboard.setKeysPressedExpiration} method must be used.
	 *  @function
	 *  @returns {integer} Returns the milliseconds of expiration defined for the {@link CB_Keyboard.keysPressed} array.
	 */
	CB_Keyboard.getKeysPressedExpiration = function()
	{
		return CB_Keyboard._keysPressedExpiration;
	}


	//Updates the string typed (CAUTION: using String.fromCharCode(keyCode) internally as keyCode was a char code and it is not!):
	CB_Keyboard._updateTypedString = function(e)
	{
		//Clears the timeout that clears the typed string:
		clearTimeout(CB_Keyboard._typedStringExpirationTimeout);

		//Defines the code of the key pressed:
		//e = CB_Events.normalize(e);
		e = CB_Keyboard.normalizeEvent(e);
		
		//var keyCode = CB_Keyboard.getKeyCode(e);
		var keyCode = e.getKeyCode();
		//var keyCode = e.keyCode;

		if (keyCode !== null)
		{
			//Gets the character typed:
			var characterTyped = String.fromCharCode(keyCode); //CAUTION: using keyCode as it was a char code and it is not!
			//var charCode = keyCode - 48 * Math.floor(keyCode / 48);
			//var characterTyped = String.fromCharCode((keyCode > 96) ? keyCode : charCode);
		
			//Updates the string typed and its codes:
			CB_Keyboard.typedStringCodes[CB_Keyboard.typedStringCodes.length] = keyCode;
			CB_Keyboard.typedString += characterTyped;

			//Easter egg:
			if (CB_Keyboard.typedString.substring(CB_Keyboard.typedString.length - 11) === "CrossBrowdy")
			{
				setTimeout
				(
					function()
					{
						alert("Congratulations, you have found a CrossBrowdy Eastern egg!!! ;)");
						CB_Keyboard.typedStringCodes = []; //Clears the typed string codes.
						CB_Keyboard.typedString = ""; //Clears the typed string.
					},
					100
				); //Executes the function after some milliseconds allowing others get the typed string updated.
			}
			
			//Sets the timeout that clears the string after some milliseconds:
			CB_Keyboard._typedStringExpirationTimeout =
				setTimeout
				(
					function()
					{
						CB_Keyboard.typedStringCodes = [];
						CB_Keyboard.typedString = "";
					},
					CB_Keyboard._typedStringExpiration
				);
		}
	}

	
	/**
	 * Clears (empties totally or partially) the {@link CB_Keyboard.typedString} string and the {@link CB_Keyboard.typedStringCodes} array.
	 *  @function
	 *  @param {boolean} keepPressed - If set to true, it will keep the values belonging to the currently-pressed keys (taken from the {@link CB_Keyboard.keysDown} object).
	 */
	CB_Keyboard.clearTypedString = function(keepPressed) //CAUTION: using String.fromCharCode(keyCode) internally as keyCode was a char code and it is not!
	{
		//Clears the timeout that clears the typed string:
		clearTimeout(CB_Keyboard._typedStringExpirationTimeout);
		
		if (!keepPressed)
		{
			CB_Keyboard.typedStringCodes = [];
			CB_Keyboard.typedString = "";
		}
		else
		{
			var typedStringCodes = [];
			var typedString = "";
			var characterTyped = null;
			var keyCode = null;
			
			var typedStringCodesLength = CB_Keyboard.typedStringCodes.length;
			for (var x = 0; x < typedStringCodesLength; x++)
			{
				keyCode = CB_Keyboard.typedStringCodes[x];
				if (CB_Keyboard.keysDown[keyCode])
				{
					typedStringCodes[typedStringCodes.length] = keyCode;
					characterTyped = String.fromCharCode(keyCode); //CAUTION: using keyCode as it was a char code and it is not!
					typedString += characterTyped;
				}
			}
			
			/*
			for (var keyCode in CB_Keyboard.keysDown)
			{
				if (CB_Keyboard.keysDown[keyCode])
				{
					typedStringCodes[typedStringCodes.length] = keyCode;
					characterTyped = String.fromCharCode(keyCode); //CAUTION: using keyCode as it was a char code and it is not!
					typedString += characterTyped;
				}
			}
			*/
			CB_Keyboard.typedStringCodes = typedStringCodes;
			CB_Keyboard.typedString = typedString;
		}
	}
	

	/**
	 * Returns the {@link CB_Keyboard.typedString} string which contains the string typed recently (it will be cleared after the chosen milliseconds set with the {@link CB_Keyboard.setTypedStringExpiration} function).
	 *  @function
	 *  @returns {string} Returns the {@link CB_Keyboard.typedString} string.
	 */
	CB_Keyboard.getTypedString = function()
	{
		return CB_Keyboard.typedString;
	}


	/**
	 * Returns the {@link CB_Keyboard.typedStringCodes} array which contains the key codes pressed that belongs to the string typed recently (it will be cleared after the chosen milliseconds set with the {@link CB_Keyboard.setTypedStringExpiration} function).
	 *  @function
	 *  @returns {array} Returns the {@link CB_Keyboard.typedStringCodes} array.
	 */
	CB_Keyboard.getTypedStringCodes = function()
	{
		return CB_Keyboard.typedStringCodes;
	}


	/**
	 * Sets the milliseconds after which the {@link CB_Keyboard.typedString} string and the {@link CB_Keyboard.typedStringCodes} array are always cleared (emptied). The time always starts counting from zero when a key is pressed ([onKeyPress]{@link https://developer.mozilla.org/en-US/docs/Web/Events/keypress} event is fired).
	 *  @function
	 *  @param {integer} keysPressedExpiration - An integer greater than 0 (zero) representing the milliseconds after which we desire that the {@link CB_Keyboard.typedString} string and the {@link CB_Keyboard.typedStringCodes} array are cleared (emptied), if no key is pressed during this time.
	 *  @returns {boolean} Returns true if the given time could be applied or false otherwise.
	 */
	CB_Keyboard.setTypedStringExpiration = function(typedStringExpiration)
	{
		//Only allows numbers greater than zero:
		if (typeof(typedStringExpiration) !== "undefined" && typedStringExpiration !== null && !isNaN(typedStringExpiration) && typedStringExpiration > 0)
		{
			CB_Keyboard._typedStringExpiration = parseInt(typedStringExpiration);
			return true;
		}
		return false;
	}


	/**
	 * Returns the milliseconds after which the {@link CB_Keyboard.typedString} string and the {@link CB_Keyboard.typedStringCodes} array are always cleared (emptied). The time always starts counting from zero again when a key is pressed ([onKeyPress]{@link https://developer.mozilla.org/en-US/docs/Web/Events/keypress} event is fired).
	   To define this amount of time, the {@link CB_Keyboard.setTypedStringExpiration} method must be used.
	 *  @function
	 *  @returns {integer} Returns the milliseconds of expiration defined for the {@link CB_Keyboard.typedString} string and the {@link CB_Keyboard.typedStringCodes} array.
	 */
	CB_Keyboard.getTypedStringExpiration = function()
	{
		return CB_Keyboard._typedStringExpiration;
	}

	
	/**
	 * Tries to prevent the default behaviour that would produce the "F11" key of a given [keyboard event]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent} when the client is compatible with the HTML5 Fullscreen API and uses it to toggle (enable or disable) the fullscreen mode. It calls the {@link CB_Keyboard.normalizeEvent} function internally.
	 *  @function
	 *  @param {Event} e - [Keyboard event]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent} object.
	 */
	CB_Keyboard.preventF11Key = function(e)
	{
		//e = CB_Events.normalize(e);
		e = CB_Keyboard.normalizeEvent(e);
		//var keyCode = CB_Keyboard.getKeyCode(e);
		//var keyCode = e.keyCode;
		var keyCode = e.getKeyCode();
		
		//If the F11 key has been pressed:
		if (CB_Keyboard.keys.F11.indexOf(keyCode) !== -1)
		{
			//If it's compatible with the FullScreen API, Prevents the use of F11 key and uses FullScreen API instead:
			if (CB_Screen.isFullScreenAPICompatible() && typeof(e.preventDefault) !== "undefined" && e.preventDefault !== null)
			{
				//If it's in fullscreen mode, we cancel it:
				if (CB_Screen.isFullScreen())
				{

					//setTimeout(function(){CB_Screen.setFullScreen(false);},100);
					CB_Screen.setFullScreen(false);
				}
				//...otherwise, we request fullscreen mode:
				else
				{
					//setTimeout(function(){CB_Screen.setFullScreen();},100);
					CB_Screen.setFullScreen();
				}
				e.preventDefault();
			}
		}
	}
	
	
	/**
	 * Callback that is called before loading a file and should return true if we want to load the file or false otherwise.
	 *  @memberof CB_Keyboard
	 *  @callback CB_Keyboard.EVENT_CALLBACK
	 *  @param {Event} e - [Keyboard event]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent} object.
	 *  @param {integer} keyCode - Key code which fired the event.
	 */


	/**
	 * Sets a function to execute when a key is pressed ([onKeyPress]{@link https://developer.mozilla.org/en-US/docs/Web/Events/keypress} event) or removes it.
	 *  @function
	 *  @param {CB_Keyboard.EVENT_CALLBACK|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first parameter received for this function will be the event object (already normalized by the {@link CB_Keyboard.normalizeEvent} function) and the second one will be the key code associated. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Keyboard.onKeyPress = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Keyboard._setEvent("keypress", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when a key is down ([onKeyDown]{@link https://developer.mozilla.org/en-US/docs/Web/Events/keydown} event) or removes it.
	 *  @function
	 *  @param {CB_Keyboard.EVENT_CALLBACK|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first parameter received for this function will be the event object (already normalized by the {@link CB_Keyboard.normalizeEvent} function) and the second one will be the key code associated. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Keyboard.onKeyDown = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Keyboard._setEvent("keydown", callbackFunction, keepOldFunction, useCapture, target);
	}


	/**
	 * Sets a function to execute when a key is released ([onKeyUp]{@link https://developer.mozilla.org/en-US/docs/Web/Events/keyup} event) or removes it.
	 *  @function
	 *  @param {CB_Keyboard.EVENT_CALLBACK|null} callbackFunction - The function (event listener) that we want to execute when the event is fired. The first parameter received for this function will be the event object (already normalized by the {@link CB_Keyboard.normalizeEvent} function) and the second one will be the key code associated. If a null value is used, the event will be removed.
	 *  @param {boolean} [keepOldFunction=true] - Defines whether we want to keep any possible previous event listener for the same target and event name or not.
	 *  @param {boolean} [useCapture=false] - Defines whether the event we want to add will use capture or not. This parameter will be effective only if the current client supports the [addEventListener]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener} method and will be used as its third parameter.
	 *  @param {Object} [target=document] - The target where we want to attach the event listener.
	 */
	CB_Keyboard.onKeyUp = function(callbackFunction, keepOldFunction, useCapture, target)
	{
		return CB_Keyboard._setEvent("keyup", callbackFunction, keepOldFunction, useCapture, target);
	}


	//Sets a function to execute when a keyboard event happens:
	CB_Keyboard._setEvent = function(eventName, eventFunction, keepOldFunction, useCapture, target)
	{
		//If they are not set, use default values for optional parameters:
		if (typeof(keepOldFunction) === "undefined" || keepOldFunction === null) { keepOldFunction = true; } //If not set, it keeps old function by default.
		if (typeof(target) === "undefined" || target === null) { target = document; }
		
		//If a function has been sent:
		if (typeof(eventFunction) === "function")
		{
			//If able, adds the function given to the event:
			//eventFunctionHolder = functionToAdd;
			CB_Events.add
			(
				target,
				eventName,
				function(e)
				{
					//e = CB_Events.normalize(e);
					e = CB_Keyboard.normalizeEvent(e);
					if (eventName === "keydown" || eventName === "keyup")
					{
						CB_Keyboard._updateKeysDown(e, (eventName === "keydown"), false); //Updates keys down.
					}
					//var keyCode = CB_Keyboard.getKeyCode(e);
					if (typeof(eventFunction) === "function")
					{
						//return eventFunction(e, e.keyCode);
						return eventFunction(e, e.getKeyCode());
					}
					return true;
				},
				useCapture,
				keepOldFunction,
				true
			);
		}
		//...but if the function given is null, it will cancel the event:
		else if (eventFunction === null)// && eventFunctionHolder !== null)
		{
			//CB_Events.remove(target, eventName, eventFunctionHolder, useCapture);
			CB_Events.removeByName(target, eventName);
			//eventFunctionHolder = null;
		}
	}

} //End of the static class CB_Keyboard.