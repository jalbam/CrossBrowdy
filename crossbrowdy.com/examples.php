<?php
	define("CROSSBROWDY_WEB", "YES");
	
	require_once "_func.php";
	require_once "_config_examples.php";

	$subcategory = strtolower(getGet("subcategory"));
	$topic = strtolower(getGet("topic"));

	require_once "_engine.php";