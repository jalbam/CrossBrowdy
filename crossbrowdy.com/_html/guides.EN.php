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
<main>
	<div class="category_text">
		<p>
			Apart from the <a href="<?php echo "guides" . $PHPExtension; ?>#basic_tutorial">Basic tutorial</a>,
			you can check the <a href="<?php echo "guides" . $PHPExtension; ?>#examples">Examples section below</a>
			and <a href="<?php echo "guides" . $PHPExtension; ?>#more">more things</a>.
		</p>
	</div>

	<a name="basic_tutorial"></a>
	<section>
		<div class="category_text">
			<header><h2 class="category_subtitle">Basic tutorial</h2></header>
			<nav>
				<ol>
					<?php echo guideLinks($basicTutorial, "basicTutorialLink", "basic_tutorial"); ?>
				</ol>
			</nav>
		</div>
	</section>

	<a name="examples"></a>
	<section>
		<div class="category_text">
			<header><h1 class="category_subtitle">Examples</h1></header>
			<nav>
				<ol>
					<?php echo guideLinks($examples, "examplesLink", "examples"); ?>
				</ol>
			</nav>
			All the examples together can be downloaded <a href="get_file<?php echo $PHPExtension; ?>?id=examples">here</a>.
		</div>
	</section>

	<section>
		<a name="real_projects"></a>
		<div class="category_text">
			<header><h1 class="category_subtitle">Real projects</h1></header>
			<p>
				Have you created an app, game or anything else using CrossBrowdy? Please, take a loot at the <a href="about<?php echo $PHPExtension; ?>#may_i_add_my_creation_here" target="_blank" class="faq_link">May I add my creation here?</a>
				question from the <a href="about<?php echo $PHPExtension; ?>" target="_blank">FAQ page</a>.
			</p>
		</div>
	</section>

	<section>
		<a name="more"></a>
		<div class="category_text">
			<header><h1 class="category_subtitle">More</h1></header>
			<p>
				Check the <a href="api/index.html" target="_blank">API documentation</a> (<a href="api/printable/index.html" target="_blank">more printer-friendly version here</a>) to get more information.
			</p>
		</div>
	</section>
</main>