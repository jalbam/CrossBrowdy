<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<h1 class="category_title">Guides &amp; Tutorials</h1>

<div class="category_text">
	<h2 class="category_subtitle">Basic tutorial</h2>
	<ol>
		<?php
			foreach ($basicTutorial as $subcategory => $subcategoryArray)
			{
				echo "<li>";
					echo '<b>' . $subcategoryArray["subcategory"][$language] . '</b>';
					echo '<ol>';
						foreach ($subcategoryArray["topics"] as $topic => $topicsArray)
						{
							echo '<li><a href="basic_tutorial.php?subcategory=' . $subcategory . '&topic=' . $topic . '" class="li_link">' . $topicsArray[$language] . '</a></li>';
						}
					echo '</ol>';
				echo "</li>";
				
			}
		?>
	</ol>
</div>