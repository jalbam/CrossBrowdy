<?php
	define('CROSSBROWDY_WEB', 'YES');
	
	include_once "crossbrowdy.com/_config_basic_tutorial.php";
	include_once "crossbrowdy.com/_config_examples.php";
	include_once "crossbrowdy.com/_config.php";

	$language = "EN";
	$snapshotsURLData = Array
	(
		"index",
		"about",
		"news",
		"api",
		"guides",
		"community",
		"download"
	);
	$snapshotsPath = "crossbrowdy.com/img/snapshots/";
	$snapshotsCommand = '"c:\Program Files\Mozilla Firefox\firefox" -P headless-profile -headless --window-size=800,600 --screenshot ' . $snapshotsPath . '{screenshot_file} {url}';

	function getGuideLinks($contentArray, $basicTurorialOrExamples)
	{
		$links = Array();
		foreach ($contentArray as $subcategory => $subcategoryArray)
		{
			foreach ($subcategoryArray["topics"] as $topic => $topicsArray)
			{
				$links[] = $basicTurorialOrExamples . "/" . $subcategory . "/" . $topic;
			}
		}
		return $links;
	}

	$snapshotsURLData = array_merge($snapshotsURLData, getGuideLinks($basicTutorial, "basic_tutorial"));
	$snapshotsURLData = array_merge($snapshotsURLData, getGuideLinks($examples, "examples"));
	
	$snapshotsTotal = sizeof($snapshotsURLData);
	$snapshotsCurrent = 1;
	foreach ($snapshotsURLData as $url)
	{
		$screenshotFileLoop = str_replace("/", ".", $url) . "." . $language . ".png";
		$commandLoop = str_replace("{url}", $projectURLDefault . $url, str_replace("{screenshot_file}", $screenshotFileLoop, $snapshotsCommand));
		echo "Snapshot #" . $snapshotsCurrent . " of " . $snapshotsTotal . " for: " . $url . "\n";
		echo "* Executing: " . $commandLoop . "\n";
		echo shell_exec($commandLoop);
		echo "\n";
		$snapshotsCurrent++;
	}