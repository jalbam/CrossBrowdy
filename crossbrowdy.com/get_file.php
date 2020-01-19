<?php
	define("CROSSBROWDY_WEB", "YES");

	require_once "_func.php";

	//require_once "_config.php";
	
	require_once "_config_download.php";

	$id = strtolower(getGet("id"));
	if ($id === "" || $id === "current" || $id === "last" || $id === "latest") { $id = CB_VERSION_CURRENT; }
	
	if ($id === "examples")
	{
		$fileToDownload = EXAMPLES_FILENAME_PATH_ZIP_REAL;
		$fileToDownloadBeautifulLink = EXAMPLES_FILENAME_PATH_ZIP;
	}
	else
	{
		$fileToDownload = str_replace("{VERSION}", $id, CB_FILENAME_PATH_ZIP_REAL);
		$fileToDownloadBeautifulLink = str_replace("{VERSION}", $id, CB_FILENAME_PATH_ZIP);
	}
	
	if (file_exists($fileToDownload))
	{
		header("Location: " . $fileToDownloadBeautifulLink);
	}
	else
	{
		echo "File not found! Tried to get: " . $fileToDownload;
	}