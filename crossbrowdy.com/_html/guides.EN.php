<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }
	
	function guideLinks($contentArray, $linkFunction, $basicTurorialOrExamples)
	{
		global $language;
		$output = "";
		foreach ($contentArray as $subcategory => $subcategoryArray)
		{
			$output .= '<a name="' . strtolower($basicTurorialOrExamples) . '_' . strtolower($subcategoryArray["subcategory"][$language]) . '"></a>';
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

<header><h1 class="category_title">Guides &amp; Tutorials</h1></header>

<a name="basic_tutorial"></a>
<div class="category_text">
	<h2 class="category_subtitle">Basic tutorial</h2>
	<ol>
		<nav>
			<?php echo guideLinks($basicTutorial, "basicTutorialLink", "basic_tutorial"); ?>
		</nav>
	</ol>
</div>

<a name="examples"></a>
<div class="category_text">
	<h1 class="category_subtitle">Examples</h1>
	<ol>
		<nav>
			<?php echo guideLinks($examples, "examplesLink", "examples"); ?>
		</nav>
	</ol>
</div>


<div class="category_text">
	<h1 class="category_subtitle">More</h1>
	<p>
		Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to get more information.
	</p>
</div>