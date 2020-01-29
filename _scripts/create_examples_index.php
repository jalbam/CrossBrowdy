<?php
	define('CROSSBROWDY_WEB', 'YES');
	
	include_once "crossbrowdy.com/_config_examples.php";
	include_once "crossbrowdy.com/_config.php";

	$language = "EN";
	$pathToExamples = "_html/_doc/examples/" . $language . "/";

	$links = "";
	$linkLoop = "";
	foreach ($examples as $subcategory => $subcategoryArray)
	{
		$links .= "\r\n\t\t\t<h2>" . $subcategoryArray["subcategory"][$language] . "</h2>";
		foreach ($subcategoryArray["topics"] as $topic => $topicsArray)
		{
			$linkLoop = $pathToExamples . $subcategory . "/" . $topic . "_files/index.html";
			$links .= "\r\n\t\t\t<a href=\"" . $linkLoop . "\" target=\"_blank\">" . $topicsArray[$language] . "</a><br />";
		}
	}
	$links .= "\r\n\t\t";

	$indexTemplateFile = file_exists("_scripts/examples_index_template.html") ? "_scripts/examples_index_template.html" : "examples_index_template.html";
	if (!file_exists($indexTemplateFile)) { echo "Template index.html file ('" . $indexTemplateFile . "') not found!"; return; }

	$indexTemplate = file_get_contents($indexTemplateFile);
	echo str_replace("{{examples_links}}", $links, $indexTemplate);