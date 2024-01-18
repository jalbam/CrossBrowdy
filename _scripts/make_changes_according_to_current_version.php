<?php
	//Modifies the desired file in the desired part:
	function modifyFileVersion($fileToModify, $stringBeginning, $stringEnd, $version)
	{
		echo "Updating " . $fileToModify . " file...\n";
		$fileToModifyContent = file_get_contents($fileToModify);
		$stringBeginningPosition = strpos($fileToModifyContent, $stringBeginning) + strlen($stringBeginning);
		$stringEndPosition = strpos($fileToModifyContent, $stringEnd, $stringBeginningPosition);
		$versionOld = substr($fileToModifyContent, $stringBeginningPosition, $stringEndPosition - $stringBeginningPosition);
		$versionOld = trim($versionOld);
		$fileToModifyContent = substr($fileToModifyContent, 0, $stringBeginningPosition) . $version . substr($fileToModifyContent, $stringBeginningPosition + strlen($versionOld));
		echo "* Version used: \"" . $versionOld . "\"\n";
		file_put_contents($fileToModify, $fileToModifyContent);
	}


	//Gets the current CrossBrowdy version:
	define("AVOID_OUTPUT", true);
	include_once "_scripts/detect_version.php";
	echo "Version detected: \"".$version."\"\n";


	//Starts modifying files:
	modifyFileVersion("package.json", "\"version\": \"", "\",", $version);
	modifyFileVersion("crossbrowdy.com/_config_download.php", "define(\"CB_VERSION_CURRENT\", \"", "\");", $version);