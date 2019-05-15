<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	//Language:
	define("LANGUAGES", Array("EN"));
	define("LANGUAGE_DEFAULT", "EN");
	$language = LANGUAGE_DEFAULT;
	
	//Project information:
	$projectName = "CrossBrowdy";
	$projectCopyright = Array
	(
		"EN" => $projectName . ' by <a href="http://joanalbamaldonado.com/" target="_blank" class="author_link">Joan Alba Maldonado</a>'
	);
	$projectTitle = Array
	(
		"EN" => Array
		(
			"index" => $projectName . " - Multimedia JavaScript framework",
			"about" => "About " . $projectName . " &amp; FAQ",
			"api" => $projectName . " - API",
			"guides" => $projectName . " - Guides &amp; Tutorials",
				"basic_tutorial" => $projectName . " - Basic tutorial",
					//"basic_tutorial_general_getting_started" => $projectName . " - Basic tutorial - General - Getting started",
			"community" => $projectName . " - Community &amp; Get Involved",
			"download" => "Download " . $projectName
		)

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
		"EN" => "Create real cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps.\nCompatible with web browsers, desktop computers, mobile devices (phones, tablets), video game consoles, TV sets and many others."
	);
	$projectKeywords = Array
	(
		"EN" => "multimedia,games,engine,emulators,hybrid,PWA,apps,gamedev,game development,js,JavaScript,HTML5,DHTML,cross-device,cross-platform,cross-browser"
	);
	$projectURLDefault = "http://www.joanalbamaldonado.com/portfolio/";
	$projectURL = "";
	if (isset($HTTP_SERVER_VARS['HTTP_HOST']) && isset($HTTP_SERVER_VARS['PHP_SELF']))
	{
		$PHP_SELF_sanitized = htmlspecialchars($HTTP_SERVER_VARS['PHP_SELF']);
		$projectURL = (isset($HTTP_SERVER_VARS['HTTPS']) ? "https" : "http") . "://" . $HTTP_SERVER_VARS['HTTP_HOST'] . $PHP_SELF_sanitized;
	}
	$projectURL = str_replace("index.php", "", $projectURL);
	$projectURL = trim($projectURL, "/");
	if (trim($projectURL) === "" || trim($HTTP_SERVER_VARS['PHP_SELF']) === "") { $projectURL = trim($projectURLDefault, "/"); }
	$projectURL .= "/";

	$projectKeyPoints = Array
	(
		Array
		(
			"EN" => "Open-source and free"
		),
		Array
		(
			"EN" => "Any platform and client",
		),
		Array
		(
			"EN" => "Code once, deploy everywhere",
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
			"EN" => "Supports Apache Cordova",
		),
		Array
		(
			"EN" => "Supports other libraries and frameworks"
		)
	);

	$projectFeatures = Array
	(
		"EN" => Array
		(
			"Audio" => Array("music", "FX", "filters", "files", "sprites", "cache", "pool", "speakers"),
			"Image" => Array("canvas", "viewport", "screens"),
			"Device" => Array("geolocation", "orientation", "compass", "motion", "battery", "vibration", "light sensor", "proximity sensor"),
			"Client" => Array("client detection",  "language detection", "native canvas detection", "CSS3 support detection", "PHP detection", "Node.js detection", "NW.js detection", "Electron detection", "Silverlight detection", "Flash detection", "redirections", "exiting the app"),
			"Networking" => Array("XHR (Ajax)", "XDR", "proxy", "REST", "WebSockets"),
			"Input" => Array("keyboard", "mouse", "pointer", "touch", "pressure", "gestures", "gamepads", "remote control (TV and other devices)", "sensors"),
			"Others" => Array("elements", "arrays", "events", "data", "lazy load", "basic collisions"),
			"Future" => Array("speech", "text to speech", "RTC", "webcam", "microphone", "MIDI", "VR", "leap motion")
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
			"api" => "API",
			"guides" => "Guides &amp; Tutorials",
				"basic_tutorial" => "Basic tutorial",
			"community" => "Community &amp; Get Involved",
			"download" => "Download"
		)
	);
	
	$menuOptionsExternalWindow = Array("api");
	
	$menuOptionsLink = Array
	(
		"EN" => Array
		(
			"api" => "_html/_doc/api/index.html"
		)
	);
	
	$menuOptionsHidden = Array("basic_tutorial");
	
	
	//Others:
	define("CATEGORY_DEFAULT", "index");