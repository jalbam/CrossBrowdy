<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	if (!isset($HTTP_GET_VARS) || isset($_GET)) { $HTTP_GET_VARS = &$_GET; }
	if (!isset($HTTP_SESSION_VARS) || isset($_SESSION)) { $HTTP_SESSION_VARS = &$_SESSION; }
	if (!isset($HTTP_SERVER_VARS) || isset($_SERVER)) { $HTTP_SERVER_VARS = &$_SERVER; }
	
	$PHPExtension = ""; // ".php"
	
	//Language:
	define("LANGUAGES", Array("EN"));
	define("LANGUAGE_DEFAULT", "EN");
	$language = LANGUAGE_DEFAULT;
	$languageTerritory = "en_US";
	
	//Project information:
	$projectName = "CrossBrowdy";
	$projectCopyright = Array
	(
		"EN" => $projectName . ' by <span itemprop="author publisher" itemscope itemtype="http://schema.org/Person"><a href="https://joanalbamaldonado.com/" target="_blank" class="author_link"><span itemprop="name">Joan Alba Maldonado</span></a></span>'
	);
	$projectTitle = Array
	(
		"EN" => Array
		(
			"index" => $projectName . " - Multimedia JavaScript framework",
			"about" => "About " . $projectName . " &amp; FAQ",
			"news" => $projectName . " News",
			"api" => $projectName . " - API",
			"guides" => $projectName . " - Guides &amp; Tutorials",
				"basic_tutorial" => $projectName . " - Basic tutorial",
				"examples" => $projectName . " - Examples",
				//"basic_tutorial_general_getting_started" => $projectName . " - Basic tutorial - General - Getting started",
			"community" => $projectName . " - Community &amp; Get Involved",
			"download" => "Download " . $projectName
		)
	);
	$projectTitleHeader = "";
	if (isset($subcategory) && $subcategory !== "")
	{
		if (isset($basicTutorial[$subcategory])) { $categoryMainArray = $basicTutorial; $category = "basic_tutorial"; }
		else if (isset($examples[$subcategory])) { $categoryMainArray = $examples; $category = "examples"; }
		if (isset($categoryMainArray) && isset($category))
		{
			$projectTitleHeader = $projectTitle[$language][$category] . ": " . $categoryMainArray[$subcategory]["subcategory"][$language];
			if (isset($topic) && $topic !== "" && isset($categoryMainArray[$subcategory]["topics"][$topic]))
			{
				$projectTitleHeader = $projectTitle[$language][$category] . " - " . $categoryMainArray[$subcategory]["subcategory"][$language] . ": " . $categoryMainArray[$subcategory]["topics"][$topic][$language];
			}
		}
	}

	$projectKeywords = Array
	(
		"EN" => "multimedia,games,engine,emulators,hybrid,PWA,apps,gamedev,game development,js,JavaScript,HTML5,DHTML,cross-device,cross-platform,cross-browser"
	);
	$projectDescriptionShort = Array
	(
		"EN" => "Multimedia JavaScript framework"
	);
	$projectDescription = Array
	(
		"EN" => "Open-source JavaScript framework to create cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps"
	);
    $projectDescriptionLong = Array
	(
		"EN" => "Create real cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps.\nCompatible with web browsers, desktop and laptop computers, mobile devices (phones, tablets), desktop and handheld video game consoles, TV sets, smart watches, embedded devices and many others."
	);
	$projectURLDefault = "https://crossbrowdy.com/";
	$projectURLDefault = trim($projectURLDefault, "/") . "/";

	$projectURL = "";
	$projectURLBase = "";
	if (isset($HTTP_SERVER_VARS['HTTP_HOST']) && isset($HTTP_SERVER_VARS['PHP_SELF']))
	{
		$PHP_SELF_sanitized = htmlspecialchars($HTTP_SERVER_VARS['PHP_SELF']);
		$projectURLBase = (isset($HTTP_SERVER_VARS['HTTPS']) ? "https" : "http") . "://" . $HTTP_SERVER_VARS['HTTP_HOST'];
		$projectURL = $projectURLBase . $PHP_SELF_sanitized;
	}
	$projectURL = str_replace("index.php", "", $projectURL);
	$projectURL = trim($projectURL, "/");
	if (trim($projectURL) === "" || trim($HTTP_SERVER_VARS['PHP_SELF']) === "") { $projectURL = trim($projectURLDefault, "/"); }
	if (strpos($projectURL, ".php") === false) { $projectURL .= "/"; }
	$projectURLCurrent = $projectURL;
	if (isset($HTTP_SERVER_VARS["REQUEST_URI"]))
	{
		$projectURLCurrent = $projectURLBase . ltrim($HTTP_SERVER_VARS["REQUEST_URI"]);
		//$projectURLCurrent = rtrim($projectURL, "/") . "/" . ltrim($HTTP_SERVER_VARS["REQUEST_URI"], "/");
	}

	$pagesDescription = Array
	(
		"EN" => Array
		(
			"_DEFAULT" => $projectDescription["EN"],
			"index" => $projectDescription["EN"],
			"about" => "About " . $projectName . " &amp; FAQ, the " . $projectDescription["EN"],
			"news" => "News about " . $projectName . ", the " . lcfirst($projectDescription["EN"]),
			"api" => $projectName . " API, the " . lcfirst($projectDescription["EN"]),
			"guides" => $projectName . " - Guides &amp; Tutorials for the " . lcfirst($projectDescription["EN"]),
				"basic_tutorial" => $projectName . " - Basic tutorial for the " . lcfirst($projectDescription["EN"]),
					
					"basic_tutorial_general_getting_started" => "Basic tutorial topic, explaining how to start using " . $projectName,
					"basic_tutorial_general_options" => "Basic tutorial topic, explaining how to configure and set some options for " . $projectName,
					"basic_tutorial_general_modules" => "Basic tutorial topic, explaining how to create and use modules with " . $projectName,
					"basic_tutorial_general_more" => "Basic tutorial topic, explaining some general things about " . $projectName,
					
					"basic_tutorial_client_client_detection" => "Basic tutorial topic, explaining how to detect the current client and its version using " . $projectName,
					"basic_tutorial_client_language_detection_and_management" => "Basic tutorial topic, explaining how to detect automatically favourite languages and how to manage them using " . $projectName,
					"basic_tutorial_client_features_and_plugin_detection" => "Basic tutorial topic, explaining how to detect some client features as CSS3, native canvas support, plug-ins availability, etc. using " . $projectName,
					"basic_tutorial_client_platform_and_backend_detection" => "Basic tutorial topic, explaining how to detect the back-end features where the current client is running on, using  " . $projectName,
					"basic_tutorial_client_exiting_app_and_address_management" => "Basic tutorial topic, explaining how to manage addresses and how to exit the current application using " . $projectName,
					"basic_tutorial_client_others" => "Basic tutorial topic, explaining some other things about client management using " . $projectName,
					
					"basic_tutorial_input_keyboard" => "Basic tutorial topic, explaining how to manage keyboard input and related things using " . $projectName,
					"basic_tutorial_input_tv_remotes_gamepads_and_others_with_keyboard_events" => "Basic tutorial topic, explaining how to manage input through TV remotes, gamepads and other devices which fire keyboard events, using " . $projectName,
					"basic_tutorial_input_controllers_and_gamepads" => "Basic tutorial topic, explaining how to manage controllers and gamepads input using " . $projectName,
					"basic_tutorial_input_mouse" => "Basic tutorial topic, explaining how to manage mouse input and related things using " . $projectName,
					"basic_tutorial_input_touch_and_gestures" => "Basic tutorial topic, explaining how to manage touch input, gestures and related things using " . $projectName,
					"basic_tutorial_input_pointer" => "Basic tutorial topic, explaining how to manage pointer input and related things using " . $projectName,
					
					"basic_tutorial_device_geolocation" => "Basic tutorial topic, explaining how to manage device's geolocation (through GPS, wifi and others) using " . $projectName,
					"basic_tutorial_device_orientation" => "Basic tutorial topic, explaining how to manage device's orientation and inclination (through compass / magnetometer and gyroscope) using " . $projectName,
					"basic_tutorial_device_motion" => "Basic tutorial topic, explaining how to manage device's motion (through accelerometer) using " . $projectName,
					"basic_tutorial_device_light_sensor" => "Basic tutorial topic, explaining how to manage device's ambient light sensor using " . $projectName,
					"basic_tutorial_device_proximity_sensor" => "Basic tutorial topic, explaining how to manage device's proximity sensor using " . $projectName,
					"basic_tutorial_device_battery" => "Basic tutorial topic, explaining how to manage device's battery using " . $projectName,
					"basic_tutorial_device_vibration" => "Basic tutorial topic, explaining how to manage device's vibration using " . $projectName,
					"basic_tutorial_device_others" => "Basic tutorial topic, explaining how to manage other things related with the current device using " . $projectName,
					
					"basic_tutorial_networking_http_parameters_and_hash" => "Basic tutorial topic, explaining how to manage HTTP parameters and hash using " . $projectName,
					"basic_tutorial_networking_fetch" => "Basic tutorial topic, explaining how to manage Fetch using " . $projectName,
					"basic_tutorial_networking_xhr_and_xdr" => "Basic tutorial topic, explaining how to manage XHR (AJAX) and XDR (cross-domain requests) using " . $projectName,
					"basic_tutorial_networking_rest" => "Basic tutorial topic, explaining how to manage REST using " . $projectName,
					"basic_tutorial_networking_websockets" => "Basic tutorial topic, explaining how to manage WebSockets (through the SockJS client library) using " . $projectName,
					
					"basic_tutorial_data_numbers_formatting_and_base_conversion" => "Basic tutorial topic, explaining how to deal with numbers, formatting and base conversion using " . $projectName,
					"basic_tutorial_data_strings_and_template_rendering" => "Basic tutorial topic, explaining how to manage strings and template rendering using " . $projectName,
					"basic_tutorial_data_arrays" => "Basic tutorial topic, explaining how to manage arrays using " . $projectName,
					"basic_tutorial_data_objects_and_json" => "Basic tutorial topic, explaining how to manage objects and JSON using " . $projectName,
					"basic_tutorial_data_cookies_and_local_storage" => "Basic tutorial topic, explaining how to manage cookies and local storage using " . $projectName,
					"basic_tutorial_data_compression" => "Basic tutorial topic, explaining how to manage data compression using " . $projectName,
					"basic_tutorial_data_others" => "Basic tutorial topic, explaining how to manage other things related with data using " . $projectName,
					
					"basic_tutorial_image_screen" => "Basic tutorial topic, explaining how to manage screens using " . $projectName,
					"basic_tutorial_image_canvas" => "Basic tutorial topic, explaining how to manage canvases and their emulation using " . $projectName,
					"basic_tutorial_image_graphic_sprites" => "Basic tutorial topic, explaining how to manage graphic sprites using " . $projectName,
					"basic_tutorial_image_graphic_sprites_scene" => "Basic tutorial topic, explaining how to manage graphic sprites scenes using " . $projectName,
					
					"basic_tutorial_audio_web_audio_api" => "Basic tutorial topic, explaining how to manage Web Audio API and its emulation using " . $projectName,
					"basic_tutorial_audio_support_detection" => "Basic tutorial topic, explaining how to detect audio API and audio format support using " . $projectName,
					"basic_tutorial_audio_audio_files" => "Basic tutorial topic, explaining how to manage audio files using " . $projectName,
					"basic_tutorial_audio_audio_files_cache" => "Basic tutorial topic, explaining how to manage caches of audio files using " . $projectName,
					"basic_tutorial_audio_audio_sprites" => "Basic tutorial topic, explaining how to manage audio sprites using " . $projectName,
					"basic_tutorial_audio_audio_sprites_pool" => "Basic tutorial topic, explaining how to manage pools of audio sprites using " . $projectName,
					"basic_tutorial_audio_speaker" => "Basic tutorial topic, explaining how to manage speakers using " . $projectName,
					"basic_tutorial_audio_sound_fx" => "Basic tutorial topic, explaining how to create and play sound effects (through the jsfx library) using " . $projectName,
					"basic_tutorial_audio_music_composition" => "Basic tutorial topic, explaining how to compose music and play it (through the Band.js library) using " . $projectName,
					"basic_tutorial_audio_processing_and_synthesizing" => "Basic tutorial topic, explaining how to manage audio processing and audio synthesizing (through the timbre.js and the subcollider.js libraries) using " . $projectName,
					
					"basic_tutorial_others_dom_elements" => "Basic tutorial topic, explaining how to manage DOM elements using " . $projectName,
					"basic_tutorial_others_events" => "Basic tutorial topic, explaining how to manage events using " . $projectName,
					"basic_tutorial_others_collisions" => "Basic tutorial topic, explaining how to manage collisions using " . $projectName,
					"basic_tutorial_others_statistics" => "Basic tutorial topic, explaining how to manage usage statistics using " . $projectName,
					"basic_tutorial_others_more" => "Basic tutorial topic, explaining more things related with " . $projectName,
					
				"examples" => $projectName . " - Examples for the " . lcfirst($projectDescription["EN"]),
					"examples_general_hello_world" => "Example of a &quot;Hello, world!&quot; program, your first app using " . $projectName,
					
					"examples_client_languages_features_plugins_platform_backend" => "Example showing how to manage client's languages, features, plug-ins, platform and back-end using " . $projectName,
					"examples_client_exiting_app_and_address_management" => "Example showing how to manage the address and exiting the app using " . $projectName,
					
					"examples_input_keyboard_tv_remotes_gamepads_and_other_controllers" => "Example showing how to manage input through keyboard, TV remotes, gamepads and other controllers using " . $projectName,
					"examples_input_mouse_touch_and_pointer" => "Example showing how to manage input through mouse, touch and pointer using " . $projectName,
					"examples_input_touch_gestures" => "Example showing how to manage touch gestures using " . $projectName,
					
					"examples_device_geolocation" => "Example showing how to manage device's geolocation (through GPS, wifi and others) using " . $projectName,
					"examples_device_orientation_inclination_and_motion" => "Example showing how to manage orientation, inclination and motion (through compass / magnetometer and gyroscope) using " . $projectName,
					"examples_device_sensors" => "Example showing how to manage device's ambient light and proximity sensors using " . $projectName,
					"examples_device_battery" => "Example showing how to manage device's battery using " . $projectName,
					"examples_device_vibration_and_others" => "Example showing how to manage device's vibration and others using " . $projectName,
					
					"examples_networking_fetch" => "Example showing how to manage Fetch using " . $projectName,
					"examples_networking_xhr_and_xdr" => "Example showing how to manage XHR (AJAX) and XDR (cross-domain requests) using " . $projectName,
					"examples_networking_rest" => "Example showing how to manage REST using " . $projectName,
					"examples_networking_websockets" => "Example showing how to manage WebSockets (through the SockJS client library) using " . $projectName,
					
					"examples_data_numbers_formatting_and_base_conversion" => "Example showing how to deal with numbers, formatting and base conversion using " . $projectName,
					"examples_data_strings_and_template_rendering" => "Example showing how to manage strings and template rendering using " . $projectName,
					"examples_data_arrays_objects_and_json" => "Example showing how to manage arrays, objects and JSON using " . $projectName,
					"examples_data_cookies_and_local_storage" => "Example showing how to manage cookies and local storage using " . $projectName,
					"examples_data_compression" => "Example showing how to manage data compression using " . $projectName,
					
					"examples_image_screen" => "Example showing how to manage screens using " . $projectName,
					"examples_image_canvas" => "Example showing how to manage canvases and their emulation using " . $projectName,
					"examples_image_graphic_sprites_scene" => "Example showing how to manage graphic sprites scenes using " . $projectName,
					
					"examples_audio_support_detection" => "Example showing how to detect audio API and audio format support using " . $projectName,
					"examples_audio_audio_sprites_pool_and_speaker" => "Example showing how to manage audio sprites pools and speakers using " . $projectName,
					"examples_audio_sound_fx" => "Example showing how to create and play sound effects (through the jsfx library) using " . $projectName,
					"examples_audio_music_composition" => "Example showing how to compose music and play it (through the Band.js library) using " . $projectName,
					"examples_audio_processing_and_synthesizing" => "Example showing how to manage audio processing and audio synthesizing (through the timbre.js and the subcollider.js libraries) using " . $projectName,
					
					"examples_others_collisions" => "Example showing how to manage collisions using " . $projectName,
					"examples_others_symmetric_intervals" => "Example showing how to manage symmetric intervals using " . $projectName,
					
					"examples_advanced_graphic_rendering_engine" => "Example showing how to create a graphic rendering engine using " . $projectName,
					"examples_advanced_simple_game_engine" => "Example showing how to create a simple game engine using " . $projectName,
					"examples_advanced_balloon_popping_game" => "Example showing how to create a balloon popping game using " . $projectName,
					"examples_advanced_pong_game" => "Example showing how to create a Pong game using " . $projectName,
					"examples_advanced_sokoban_game" => "Example showing how to create a Sokoban game using " . $projectName,
					"examples_advanced_chip_8_emulator" => "Example showing how to create a CHIP-8 emulator using " . $projectName,

			"community" => $projectName . " - Community &amp; Get Involved with the " . lcfirst($projectDescription["EN"]),
			"download" => "Download " . $projectName . ", the " . lcfirst($projectDescription["EN"])
		)
	);

	$projectKeyPoints = Array
	(
		Array
		(
			"EN" => "Open source and free"
		),
		Array
		(
			"EN" => "Any platform and client",
		),
		Array
		(
			"EN" => "WORA (Write Once, Run Anywhere)",
		),
		Array
		(
			"EN" => "Simple and easy-to-use API",
		),
		Array
		(
			"EN" => "Create new software or improve old one",
		),
		Array
		(
			"EN" => "Features detection",
		),
		Array
		(
			"EN" => "Fall-backs and polyfills",
		),
		Array
		(
			"EN" => "For legacy, present and future",
		),
		Array
		(
			"EN" => "Desktop and PWA compatibility",
		),
		Array
		(
			"EN" => "Supports Apache Cordova and more",
		),
		Array
		(
			"EN" => "Accepts other frameworks and libraries"
		),
		Array
		(
			"EN" => "Enhance UI and UX",
		)
	);

	$projectFeatures = Array
	(
		"EN" => Array
		(
			"Input" => Array("keyboard", "mouse", "pointer", "touch", "pressure", "gestures", "gamepads and other controllers", "remote controls (TV and others)", "sensors"),
			"Device" => Array("geolocation", "orientation", "compass", "motion", "battery", "vibration", "light sensor", "proximity sensor"),
			"Networking" => Array("Fetch", "XHR (Ajax)", "XDR", "proxy", "REST", "WebSockets"),
			"Client" => Array("client detection",  "language detection", "native canvas detection", "CSS3 support detection", "PHP detection", "Node.js detection", "NW.js detection", "Electron detection", "Silverlight detection", "Flash detection", "redirections", "exiting the app"),
			"Audio" => Array("music", "FX", "filters", "synth", "music composition", "processing", "files", "sprites", "cache", "pool", "speakers", "supported formats detection", "supported APIs detection"),
			"Image" => Array("canvas", "viewport", "screens", "sprites", "scenes"),
			"Others" => Array("modules", "JSON", "DOM elements", "arrays", "events", "data storage", "data compression", "base conversion", "template rendering", "lazy load", "collisions", "symmetric intervals"),
			"Future" => Array("speech recognition", "text to speech", "RTC", "webcam", "microphone", "video", "MIDI", "VR", "leap motion", "GraphQL", "databases", "Touch Bar", "CSS Houdini", "physics", "AI", "OpenXR", "WebGPU", "many more")
		)
	);
	

	//Menu:
	$menuButton = Array
	(
		"EN" => "- MENU -"
	);
	
	$menuOptions = Array
	(
		"EN" => Array
		(
			"index" => "Home",
			"about" => "About &amp; FAQ",
			"news" => "News",
			"api" => "API",
			"guides" => "Guides &amp; Tutorials",
				"basic_tutorial" => "Basic tutorial",
				"examples" => "Examples",
			"community" => "Community &amp; Get Involved",
			"download" => "Download"
		)
	);
	
	if (file_exists("_html/_doc/api/"))
	{
		$menuOptionsExternalWindow = Array("api");
	}
	else
	{
		$menuOptionsExternalWindow = Array();
	}
	
	$menuOptionsLink = Array("EN" => Array());

	/*
	$menuOptionsLink = Array
	(
		"EN" => Array
		(
			"api" => "_html/_doc/api/index.html"
		)
	);
	*/
	
	$menuOptionsHidden = Array("basic_tutorial", "examples");
	
	
	//Others:
	define("CATEGORY_DEFAULT", "index");