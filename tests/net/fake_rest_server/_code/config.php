<?php
	//Constants:
	define("AUTHORIZATION_CODE", '<?php if (!defined("USING_REST_SERVER") || !USING_REST_SERVER) { return; } ?>');
	//define("DEFAULT_RESPONSE", '{ "planet" : "CARACOLAX", "character_illegal_in_js_string" : "j s" }'); //Default response in the case the path is unknown.