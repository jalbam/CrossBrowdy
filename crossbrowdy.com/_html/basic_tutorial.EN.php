<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	define("SUBCATEGORY_DEFAULT", "general");
	define("TOPIC_DEFAULT", "getting_started");
	define("CATEGORY_MAIN_NAME", "basic_tutorial");
	$categoryMainArray = &$basicTutorial;
	require_once "_basic_tutorial_examples_viewer.php";