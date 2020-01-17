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
		"EN" => $projectName . ' by <a href="https://joanalbamaldonado.com/" target="_blank" class="author_link">Joan Alba Maldonado</a>'
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
				"examples" => $projectName . " - Examples for the " . lcfirst($projectDescription["EN"]),
				//"basic_tutorial_general_getting_started" => $projectName . " - Basic tutorial - General - Getting started",
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
			"Future" => Array("speech recognition", "text to speech", "RTC", "webcam", "microphone", "video", "MIDI", "VR", "leap motion", "GraphQL", "databases", "Touch Bar", "many more")
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