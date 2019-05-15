<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	echo '<h1 class="category_title">';
		if (isset($projectTitle[$language][$category . "_" . $subcategory . "_" . $topic]))
		{
			echo $projectTitle[$language][$category . "_" . $subcategory . "_" . $topic];
		}
		else if (isset($projectTitle[$language][$category . "_" . $subcategory]))
		{
			echo $projectTitle[$language][$category . "_" . $subcategory];
		}
		else
		{
			echo $projectTitle[$language][$category];
		}
	echo '</h1>';
	
	$subcategoryFound = FALSE;
	if (isset($basicTutorial[$subcategory]) && isset($basicTutorial[$subcategory]["subcategory"]) && isset($basicTutorial[$subcategory]["subcategory"][$language]))
	{
		echo '<h2 class="category_title">' . $basicTutorial[$subcategory]["subcategory"][$language] . '</h2>';
		
		if (isset($basicTutorial[$subcategory]["topics"]) && isset($basicTutorial[$subcategory]["topics"][$topic]) && isset($basicTutorial[$subcategory]["topics"][$topic][$language]))
		{
			$subcategoryFound = TRUE;
		
			echo '<h2 class="category_title">' . $basicTutorial[$subcategory]["topics"][$topic][$language] . '</h2>';
		}
	}
		
	echo '<div class="category_text">';
		if (!$subcategoryFound)
		{
			$subcategory = "general";
			$topic = "getting_started";
			echo '<div style="text-align:center;"><p><b>Topic chosen not found. Showing first one instead.</b></p></div>';
		}
		
		if (file_exists("_html/_doc/basic_tutorial/" . $language . "/" . $subcategory . "/" . $topic . ".php"))
		{
			require_once "_html/_doc/basic_tutorial/" . $language . "/" . $subcategory . "/" . $topic . ".php";
		}
		else { echo '<div style="text-align:center;"><p><b>File not found!</b></p></div>'; }
		
	$optionBack = "guides";
	$menuOptionLink = $optionBack . ".php";
	if (isset($menuOptionsLink[$language]) && isset($menuOptionsLink[$language][$optionBack])) { $menuOptionLink = $menuOptionsLink[$language][$optionBack]; }
	echo '<p style="text-align:center;"><a href="' . $menuOptionLink . '">Go back to ' . $menuOptions[$language][$optionBack] . '</a></p>';

echo '</div>';