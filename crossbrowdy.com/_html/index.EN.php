<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<header>
	<div id="logo_container"><img src="img/logo.png" id="logo_image" onLoad="this.className = 'final';" /></div>
	<h1 class="title"> <?php echo $projectName; ?></h1>
	<h2 class="description_short"><?php echo $projectDescriptionShort[$language]; ?></h2>
</header>

<main>
	<div class="keypoints">
	<?php
		$keyPointCounter = 0;
		foreach ($projectKeyPoints as $keyPoint)
		{
			echo '<span class="keypoint"><span class="keypoint_content"><span class="keypoint_content_2">' . $keyPoint[$language] . '</span></span></span> ';
		}
	?>
	</div>

	<?php
		$projectDescriptionLongArray = explode("\n", $projectDescriptionLong[$language]);
		foreach ($projectDescriptionLongArray as $projectDescriptionLongSentence)
		{
			echo '<h3 class="description_long">' . $projectDescriptionLongSentence . '</h3>';
		}
	?>

	<div class="features">
		<?php
			function featuresDisplay($featuresArray, $callLevel = 1)
			{
				global $category, $PHPExtension;
				$output = "";
				foreach ($featuresArray as $featureGroup => $features)
				{
					if (is_array($features))
					{
						$output .= '<div class="features_box">';
							$output .= '<h' . (3 + $callLevel) . ' class="features_box_title">' . $featureGroup . '</h' . (3 + $callLevel) . '>';
							$output .= featuresDisplay($features, $callLevel + 1);
						if (is_string($featureGroup) && strtolower($featureGroup) !== "future")
						{
							$featureLink = 'guides' . $PHPExtension . '#basic_tutorial_' . strtolower($featureGroup);
							$output .= '<a href="' . $featureLink . '" class="features_box_link">more...</a>';
						}
						$output .= '</div>';
					}
					else { $output .= '<span class="features_box_item">' .  $features . '</span> '; }
				}
				return $output;
			}
			
			echo featuresDisplay($projectFeatures[$language]);
		?>
	</div>

	<div id="features_unavailable">
		* Some features might not be available on certain clients
	</div>
</main>