<?php
	define("CROSSBROWDY_WEB", "YES");
	
	if (file_exists("_html/_doc/api/")) { header('Location: _html/_doc/api/'); }
	else { require_once "_engine.php"; }