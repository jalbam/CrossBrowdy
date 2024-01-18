<?php
	//Gets the current CrossBrowdy version:
	$CrossBrowdyJSFile = file_get_contents("CrossBrowdy/CrossBrowdy.js");
	$stringBeginning = "var CB_VERSION = \"";
	$stringBeginningPosition = strpos($CrossBrowdyJSFile, $stringBeginning) + strlen($stringBeginning);
	$stringEnd = "\";";
	$stringEndPosition = strpos($CrossBrowdyJSFile, $stringEnd, $stringBeginningPosition);
	$version = substr($CrossBrowdyJSFile, $stringBeginningPosition, $stringEndPosition - $stringBeginningPosition);
	$version = trim($version);
	if (!defined("AVOID_OUTPUT") || !AVOID_OUTPUT)
	{
		echo $version;
	}