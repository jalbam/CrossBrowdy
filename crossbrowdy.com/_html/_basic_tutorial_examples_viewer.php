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
	$topicFound = FALSE;
	if (isset($categoryMainArray[$subcategory]) && isset($categoryMainArray[$subcategory]["subcategory"]) && isset($categoryMainArray[$subcategory]["subcategory"][$language]))
	{
		echo '<h2 class="category_title">' . $categoryMainArray[$subcategory]["subcategory"][$language] . '</h2>';
		$subcategoryFound = TRUE;
		
		if (isset($categoryMainArray[$subcategory]["topics"]) && isset($categoryMainArray[$subcategory]["topics"][$topic]) && isset($categoryMainArray[$subcategory]["topics"][$topic][$language]))
		{
			$topicFound = TRUE;
			echo '<h2 class="category_title">' . $categoryMainArray[$subcategory]["topics"][$topic][$language] . '</h2>';
		}
		else
		{
			foreach ($categoryMainArray[$subcategory]["topics"] as $firstTopic => $firstTopicArray)
			{
				echo '<h2 class="category_title">' . $categoryMainArray[$subcategory]["topics"][$firstTopic][$language] . '</h2>';
				break;
			}
			$topic = $firstTopic;
		}
	}
	else
	{
		$subcategory = SUBCATEGORY_DEFAULT;
		$topic = TOPIC_DEFAULT;
		echo '<h2 class="category_title">' . $categoryMainArray[$subcategory]["subcategory"][$language] . '</h2>';
		echo '<h2 class="category_title">' . $categoryMainArray[$subcategory]["topics"][$topic][$language] . '</h2>';
	}


	//Displays the content:
	echo '<div class="' . CATEGORY_MAIN_NAME . '_text">';
		if (!$subcategoryFound)
		{
			echo '<div style="text-align:center;"><p><b>Category chosen not found. Showing first one instead.</b></p></div>';
		}
		else if (!$topicFound)
		{
			echo '<div style="text-align:center;"><p><b>Topic chosen not found. Showing first one of the category instead.</b></p></div>';
		}
		
		if (file_exists("_html/_doc/" . CATEGORY_MAIN_NAME . "/" . $language . "/" . $subcategory . "/" . $topic . ".php"))
		{
			require_once "_html/_doc/" . CATEGORY_MAIN_NAME . "/" . $language . "/" . $subcategory . "/" . $topic . ".php";
		}
		else { echo '<div style="text-align:center;"><p><b>File not found!</b></p></div>'; }
		
		//Displays the option to go back:
		$optionBack = "guides";
		$menuOptionLink = $optionBack . $PHPExtension . "#" . $category . "_" . $subcategory;
		if (isset($menuOptionsLink[$language]) && isset($menuOptionsLink[$language][$optionBack])) { $menuOptionLink = $menuOptionsLink[$language][$optionBack]; }
		echo '<p style="text-align:center; padding-top:20px;"><a href="' . $menuOptionLink . '">Go back to ' . $menuOptions[$language][$optionBack] . '</a></p>';
	echo '</div>';

	//Displays the navigation bar:
	$previousTopicLink = "";
	$previousTopicLinkFound = FALSE;
	$nextTopicLink = "";
	$nextTopicLinkFound = FALSE;
	$linkLoop = "";
	foreach ($categoryMainArray as $subcategoryLoop => $subcategoryArray)
	{
		foreach ($subcategoryArray["topics"] as $topicLoop => $topicsArray)
		{
			if ($subcategoryLoop === $subcategory && $topicLoop === $topic) { $previousTopicLink = $linkLoop; $previousTopicLinkFound = TRUE; }
			else
			{
				$linkLoop = guideLink(CATEGORY_MAIN_NAME, $subcategoryLoop, $topicLoop);
				if ($previousTopicLinkFound) { $nextTopicLink = $linkLoop; $nextTopicLinkFound = TRUE; break; }
			}
		}
		if ($nextTopicLinkFound) { break; }
	}

	echo '<nav><div id="' . CATEGORY_MAIN_NAME . '_navbar">';
		echo '<span class="item">';
			if (trim($previousTopicLink) !== "") { echo '<a href="' . $previousTopicLink . '">&#171; Prev</a>'; }
		echo '</span>';
		echo '<span class="item">';
			echo '<a href="' . $menuOptionLink . '">Return</a>';
		echo '</span>';
		echo '<span class="item">';
			if (trim($nextTopicLink) !== "") { echo '<a href="' . $nextTopicLink . '">Next &#187;</a>'; }
		echo '</span>';
	echo '</div></nav>';
	
	//If it is an example, shows the "try me" floating button:
	if (CATEGORY_MAIN_NAME === "examples") { echo getTryExampleButton(); }