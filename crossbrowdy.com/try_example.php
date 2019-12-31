<?php
	define("CROSSBROWDY_WEB", "YES");

	require_once "_func.php";
	require_once "_config.php";

	$subcategory = strtolower(getGet("subcategory"));
	$topic = strtolower(getGet("topic"));
	
	$exampleURL = substr($projectURLCurrent, 0, strpos($projectURLCurrent, '/examples/')) . "/_html/_doc/examples/" . $language . "/" . $subcategory . "/" . $topic . "_files/";
	
	if (file_exists("_html/_doc/examples/" . $language . "/" . $subcategory . "/" . $topic . "_files/")) { header('Location: ' . $exampleURL); }
	else { echo "Example not found: _html/_doc/examples/" . $language . "/" . $subcategory . "/" . $topic . "_files/ (URL: " . $exampleURL . ")"; }