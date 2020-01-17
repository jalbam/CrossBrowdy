<?php
	if (!ini_get("safe_mode")) { @set_time_limit(0); }

	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }
	
	if (!isset($subcategory)) { $subcategory = ""; }
	if (!isset($topic)) { $topic = ""; }
	
	require_once "_config.php";
	
	if (isset($HTTP_SERVER_VARS['PHP_SELF']) && trim($HTTP_SERVER_VARS['PHP_SELF']) != "") { $category = $HTTP_SERVER_VARS['PHP_SELF']; }
	//else if (isset($_SERVER['PHP_SELF']) && trim($_SERVER['PHP_SELF']) != "") { $category = $_SERVER['PHP_SELF']; }
	else { $category = CATEGORY_DEFAULT; }
	$category = str_replace(".php", "", basename(trim($category)));
	if (!array_key_exists($category, $menuOptions[$language]) || !file_exists($category . ".php") || !file_exists("_html/" . $category . "." . $language . ".php") && !file_exists("_html/" . $category . "." . LANGUAGE_DEFAULT . ".php")) { $category = CATEGORY_DEFAULT; }
	
	require_once "_html/_html.php";