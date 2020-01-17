<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	//Basic tutorial structure:
	$basicTutorial = Array
	(
		"general" => Array
		(
			"subcategory" => Array
			(
				"EN" => "General"
			),
			"topics" => Array
			(
				"getting_started" => Array
				(
					"EN" => "Getting started"
				),
				"options" => Array
				(
					"EN" => "Options"
				),
				"modules" => Array
				(
					"EN" => "Modules"
				),
				"more" => Array
				(
					"EN" => "More"
				)
			)
		),
		"client" => Array
		(
			"subcategory" => Array
			(
				"EN" => "Client"
			),
			"topics" => Array
			(
				"client_detection" => Array
				(
					"EN" => "Client detection"
				),
				"language_detection_and_management" => Array
				(
					"EN" => "Language detection and management"
				),
				"features_and_plugin_detection" => Array
				(
					"EN" => "Features and plug-in detection (CSS3, native canvas, Silverlight, Flash...)"
				),
				"platform_and_backend_detection" => Array
				(
					"EN" => "Platform and back-end detection (PHP, Node.js, NW.js, Electron...)"
				),
				"exiting_app_and_address_management" => Array
				(
					"EN" => "Exiting the app and address management"
				),
				"others" => Array
				(
					"EN" => "Others"
				)
			)
		),
		"input" => Array
		(
			"subcategory" => Array
			(
				"EN" => "Input"
			),
			"topics" => Array
			(
				"keyboard" => Array
				(
					"EN" => "Keyboard"
				),
				"tv_remotes_gamepads_and_others_with_keyboard_events" => Array
				(
					"EN" => "TV remotes, gamepads and others with keyboard events"
				),
				"controllers_and_gamepads" => Array
				(
					"EN" => "Controllers and Gamepads"
				),
				"mouse" => Array
				(
					"EN" => "Mouse"
				),
				"touch_and_gestures" => Array
				(
					"EN" => "Touch and gestures"
				),
				"pointer" => Array
				(
					"EN" => "Pointer"
				)
			)
		),
		"device" => Array
		(
			"subcategory" => Array
			(
				"EN" => "Device"
			),
			"topics" => Array
			(
				"geolocation" => Array
				(
					"EN" => "Geolocation (GPS, wifi and others)"
				),
				"orientation" => Array
				(
					"EN" => "Orientation and inclination (compass / magnetometer, gyroscope)"
				),
				"motion" => Array
				(
					"EN" => "Motion (accelerometer)"
				),
				"light_sensor" => Array
				(
					"EN" => "Light sensor"
				),
				"proximity_sensor" => Array
				(
					"EN" => "Proximity sensor"
				),
				"battery" => Array
				(
					"EN" => "Battery"
				),
				"vibration" => Array
				(
					"EN" => "Vibration"
				),
				"others" => Array
				(
					"EN" => "Others"
				)
			)
		),
		"networking" => Array
		(
			"subcategory" => Array
			(
				"EN" => "Networking"
			),
			"topics" => Array
			(
				"http_parameters_and_hash" => Array
				(
					"EN" => "HTTP parameters and hash"
				),
				"fetch" => Array
				(
					"EN" => "Fetch"
				),
				"xhr_and_xdr" => Array
				(
					"EN" => "XHR (AJAX) and XDR (Cross-domain requests)"
				),
				"rest" => Array
				(
					"EN" => "REST"
				),
				"websockets" => Array
				(
					"EN" => "WebSockets"
				)
			)
		),
		"data" => Array
		(
			"subcategory" => Array
			(
				"EN" => "Data"
			),
			"topics" => Array
			(
				"numbers_formatting_and_base_conversion" => Array
				(
					"EN" => "Numbers, Formatting and Base conversion"
				),
				"strings_and_template_rendering" => Array
				(
					"EN" => "Strings and Template rendering"
				),
				"arrays" => Array
				(
					"EN" => "Arrays"
				),
				"objects_and_json" => Array
				(
					"EN" => "Objects and JSON"
				),
				"cookies_and_local_storage" => Array
				(
					"EN" => "Cookies and local storage"
				),
				"compression" => Array
				(
					"EN" => "Compression"
				),
				"others" => Array
				(
					"EN" => "Others"
				)
			)
		),
		"image" => Array
		(
			"subcategory" => Array
			(
				"EN" => "Image"
			),
			"topics" => Array
			(
				"screen" => Array
				(
					"EN" => "Screen"
				),
				"canvas" => Array
				(
					"EN" => "Canvas and emulation"
				),
				"graphic_sprites" => Array
				(
					"EN" => "Graphic sprites"
				),
				"graphic_sprites_scene" => Array
				(
					"EN" => "Graphic sprites scene"
				)
			)
		),
		"audio" => Array
		(
			"subcategory" => Array
			(
				"EN" => "Audio"
			),
			"topics" => Array
			(
				"web_audio_api" => Array
				(
					"EN" => "Web Audio API and emulation"
				),
				"support_detection" => Array
				(
					"EN" => "Support detection"
				),
				"audio_files" => Array
				(
					"EN" => "Audio files"
				),
				"audio_files_cache" => Array
				(
					"EN" => "Audio files cache"
				),
				"audio_sprites" => Array
				(
					"EN" => "Audio sprites"
				),
				"audio_sprites_pool" => Array
				(
					"EN" => "Audio sprites pool"
				),
				"speaker" => Array
				(
					"EN" => "Speaker"
				),
				"sound_fx" => Array
				(
					"EN" => "Sound FX"
				),
				"music_composition" => Array
				(
					"EN" => "Music composition"
				),
				"processing_and_synthesizing" => Array
				(
					"EN" => "Processing and synthesizing"
				)
			)
		),
		"others" => Array
		(
			"subcategory" => Array
			(
				"EN" => "Others"
			),
			"topics" => Array
			(
				"dom_elements" => Array
				(
					"EN" => "DOM elements"
				),
				"events" => Array
				(
					"EN" => "Events"
				),
				"collisions" => Array
				(
					"EN" => "Collisions"
				),
				"statistics" => Array
				(
					"EN" => "Statistics"
				),
				"more" => Array
				(
					"EN" => "More"
				)
			)
		)
	);