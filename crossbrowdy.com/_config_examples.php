<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	//Examples structure:
	$examples = Array
	(
		"general" => Array
		(
			"subcategory" => Array
			(
				"EN" => "General"
			),
			"topics" => Array
			(
				"hello_world" => Array
				(
					"EN" => "Hello, World!"
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
				"languages_features_plugins_platform_backend" => Array
				(
					"EN" => "Languages, features, plug-ins, platform and back-end"
				),
				"exiting_app_and_address_management" => Array
				(
					"EN" => "Exiting the app and address management"
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
				"keyboard_tv_remotes_gamepads_and_other_controllers" => Array
				(
					"EN" => "Keyboard, TV remotes, gamepads and other controllers"
				),
				"mouse_touch_and_pointer" => Array
				(
					"EN" => "Mouse, Touch and Pointer"
				),
				"touch_gestures" => Array
				(
					"EN" => "Touch gestures"
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
					"EN" => "Geolocation"
				),
				"orientation_inclination_and_motion" => Array
				(
					"EN" => "Orientation, inclination and motion"
				),
				"sensors" => Array
				(
					"EN" => "Light and proximity sensors"
				),
				"battery" => Array
				(
					"EN" => "Battery"
				),
				"vibration_and_others" => Array
				(
					"EN" => "Vibration and others"
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
				"arrays_objects_and_json" => Array
				(
					"EN" => "Arrays, Objects and JSON"
				),
				"cookies_and_local_storage" => Array
				(
					"EN" => "Cookies and local storage"
				),
				"compression" => Array
				(
					"EN" => "Compression"
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
				"support_detection" => Array
				(
					"EN" => "Support detection"
				),
				"audio_sprites_pool_and_speaker" => Array
				(
					"EN" => "Audio sprites pool and Speaker"
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
				"collisions" => Array
				(
					"EN" => "Collisions"
				),
				"symmetric_intervals" => Array
				(
					"EN" => "Symmetric intervals"
				)
			)
		),
		"advanced" => Array
		(
			"subcategory" => Array
			(
				"EN" => "Advanced"
			),
			"topics" => Array
			(
				"graphic_rendering_engine" => Array
				(
					"EN" => "Graphic rendering engine"
				),
				"simple_game_engine" => Array
				(
					"EN" => "Simple game engine"
				),
				"balloon_popping_game" => Array
				(
					"EN" => "Balloon popping game"
				),
				"pong_game" => Array
				(
					"EN" => "Pong game"
				),
				"sokoban_game" => Array
				(
					"EN" => "Sokoban game"
				),
				/*"point_and_click_adventure" => Array
				(
					"EN" => "Point-and-click adventure game"
				),*/
				"chip_8_emulator" => Array
				(
					"EN" => "CHIP-8 emulator"
				)
			)
		)
	);