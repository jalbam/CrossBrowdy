<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }
	
	function guideLinks($contentArray, $linkFunction)
	{
		global $language;
		$output = "";
		foreach ($contentArray as $subcategory => $subcategoryArray)
		{
			$output .= "<li>";
				$output .= '<b>' . $subcategoryArray["subcategory"][$language] . '</b>';
				$output .= '<ol>';
					foreach ($subcategoryArray["topics"] as $topic => $topicsArray)
					{
						$output .= '<li><a href="' . $linkFunction($subcategory, $topic) . '" class="li_link">' . $topicsArray[$language] . '</a></li>';
					}
				$output .= '</ol>';
			$output .= "</li>";
		}
		return $output;
	}
?>

<h1 class="category_title">Guides &amp; Tutorials</h1>
<div class="category_text">
	<h2 class="category_subtitle">Basic tutorial</h2>
	<ol>
		<?php echo guideLinks($basicTutorial, "basicTutorialLink"); ?>
	</ol>
</div>


<div class="category_text">
	<h1 class="category_subtitle">Examples</h1>
	<ol>
		<?php echo guideLinks($examples, "examplesLink"); ?>
	</ol>
</div>


<div class="category_text">
	<h1 class="category_subtitle">More</h1>
	Coming soon
</div>