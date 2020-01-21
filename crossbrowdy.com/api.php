<?php
	define("CROSSBROWDY_WEB", "YES");
	
	if (!isset($HTTP_SERVER_VARS) || isset($_SERVER)) { $HTTP_SERVER_VARS = &$_SERVER; }
	$pathBeginning = isset($_SERVER["REQUEST_URI"]) && (substr($_SERVER["REQUEST_URI"], -1) === "/") ? "../" : "";
	
	$pathEnding = "";
	if (isset($_SERVER["REQUEST_URI"]) && strpos($_SERVER["REQUEST_URI"], "/api/") !== false)
	{
		$pathEnding = substr($_SERVER["REQUEST_URI"], strpos($_SERVER["REQUEST_URI"], "/api/") + 5);
		if (substr($_SERVER["REQUEST_URI"], -14) === "/api/printable") { $pathBeginning = "../"; $pathEnding .= "/"; }
		else if (strpos($_SERVER["REQUEST_URI"], "/api/printable") !== false) { $pathBeginning = "../../"; }
		else if (substr($_SERVER["REQUEST_URI"], -5) === ".html") { $pathBeginning = "../"; }
	}
	
	if (file_exists("_html/_doc/api/")) { header('Location: ' . $pathBeginning . '_html/_doc/api/' . $pathEnding); }
	else { require_once "_engine.php"; }