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
	//$snapshotsCommand = '"c:\Program Files\Mozilla Firefox\firefox" -P headless-profile -headless --window-size=800,600 --screenshot ' . $snapshotsPath . '{screenshot_file} {url}';
	$snapshotsCommand = '"c:\Program Files\Google\Chrome\Application\chrome" --headless --disable-gpu --window-size=800,600 --hide-scrollbars --screenshot=' . getcwd() . '/' . $snapshotsPath . '{screenshot_file} {url}';

	echo "Snapshot for README web site\n";
	$commandLoop = str_replace("{url}", "https://crossbrowdy.tuxfamily.org/", str_replace("{screenshot_file}", "snapshot.png", str_replace($snapshotsPath, "README_website\\img\\", $snapshotsCommand)));
	echo "* Executing: " . $commandLoop . "\n";
	echo shell_exec($commandLoop); //pclose(popen($commandLoop, "r"));

	echo "\n";
	
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