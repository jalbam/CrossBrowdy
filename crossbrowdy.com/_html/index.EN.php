<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<div id="logo_container"><img src="img/logo.png" id="logo_image" /></div>
<h1 class="title"> <?php echo $projectName; ?></h1>
<h2 class="description_short"><?php echo $projectDescriptionShort[$language]; ?></h2>

<div class="keypoints">
<?php
	$keyPointCounter = 0;
	foreach ($projectKeyPoints as $keyPoint)
	{
		echo '<span class="keypoint"><span class="keypoint_content"><span class="keypoint_content_2">' . $keyPoint[$language] . '</span></span></span> ';
	}
?>
</div>
<h3 class="description_long"><?php echo str_replace("\n", "<br />", $projectDescriptionLong[$language]); ?></h3>
<div class="features">
	<?php
		function featuresDisplay($featuresArray, $callLevel = 1)
		{
			$output = "";
			foreach ($featuresArray as $featureGroup => $features)
			{
				if (is_array($features))
				{
					$output .= '<div class="features_box">';
						$output .= '<h' . (3 + $callLevel) . ' class="features_box_title">' . $featureGroup . '</h' . (3 + $callLevel) . '>';
						$output .= featuresDisplay($features, $callLevel + 1);
					$output .= '</div>';
				}
				else { $output .= '<span class="features_box_item">' .  $features . '</span> '; }
			}
			return $output;
		}
		
		echo featuresDisplay($projectFeatures[$language]);
	?>
</div>