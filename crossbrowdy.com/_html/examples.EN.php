<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }
	
	define("SUBCATEGORY_DEFAULT", "general");
	define("TOPIC_DEFAULT", "hello_world");
	define("CATEGORY_MAIN_NAME", "examples");
	$categoryMainArray = &$examples;
	require_once "_file_viewer.php";
	require_once "_basic_tutorial_examples_viewer.php";