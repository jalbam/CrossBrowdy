<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	//TODO: Think about using breadcrumbs: https://developers.google.com/search/docs/data-types/breadcrumb
	
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
<section>
	<div class="category_text">
		<h2 class="category_subtitle">Basic tutorial</h2>
		<ol>
			<nav>
				<?php echo guideLinks($basicTutorial, "basicTutorialLink", "basic_tutorial"); ?>
			</nav>
		</ol>
	</div>
</section>


<a name="examples"></a>
<section>
	<div class="category_text">
		<h1 class="category_subtitle">Examples</h1>
		<ol>
			<nav>
				<?php echo guideLinks($examples, "examplesLink", "examples"); ?>
			</nav>
		</ol>
	</div>
</section>

<section>
	<a name="more"></a>
	<div class="category_text">
		<h1 class="category_subtitle">More</h1>
		<p>
			Check the <a href="api/index.html" target="_blank">API documentation</a> (<a href="api/printable/index.html" target="_blank">more printer-friendly version</a>) to get more information.
		</p>
	</div>
</section>