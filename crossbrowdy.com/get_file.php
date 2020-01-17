<?php
	define("CROSSBROWDY_WEB", "YES");

	require_once "_func.php";

	//require_once "_config.php";
	
	require_once "_config_download.php";

	$version = strtolower(getGet("version"));
	if ($version === "" || $version === "current" || $version === "last" || $version === "latest") { $version = CB_VERSION_CURRENT; }
	
	$fileToDownload = str_replace("{VERSION}", $version, CB_FILENAME_PATH_ZIP_REAL);
	$fileToDownloadBeautifulLink = str_replace("{VERSION}", $version, CB_FILENAME_PATH_ZIP);
	
	if (file_exists($fileToDownload))
	{
		header("Location: " . $fileToDownloadBeautifulLink);
	}
	else
	{
		echo "File not found! Tried to get: " . $fileToDownload;
	}