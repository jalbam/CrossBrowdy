<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }
	$langHTML = strtolower($language);
?><!DOCTYPE html>
<html lang="<?php echo $langHTML; ?>">
	<head>
		<!-- (c) CrossBrowdy by Joan Alba Maldonado (joanalbamaldonado@NO_SPAM_PLEASEgmail.com). Forbidden to publish, copy or modify without mentioning the author's name. -->
		<?php
			$baseName = dirname(trim($_SERVER["SCRIPT_NAME"]));
			$baseName = rtrim($baseName, "/") . "/";
			if (!is_string($baseName) || $baseName === "") { $baseName = $projectURL; }
			if (strpos($baseName, ".php") !== false) { $baseName = substr($baseName, 0, strpos($baseName, ".php")) . "/"; }
			
		?>
		<base href="<?php echo $baseName; ?>" id="document_base">
		
		<meta http-equiv="window-target" content="_top" />
		<meta http-equiv="imagetoolbar" content="no" />
		<meta http-equiv="X-UA-Compatible" content="chrome=1" />

		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
		
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
	
		<meta name="DC.Format" content="text/html" />

		<meta name="DC.language" scheme="RFC1766" content="en" />
		<meta name="language" content="en" />

		<meta name="DC.Type" scheme="DCMIType" content="InteractiveResource" />
		<meta name="VW96.objecttype" content="Document" />
		<meta name="resource-type" content="Document" />
		<meta http-equiv="Resource-Type" content="document" />

		<meta name="DC.RightsHolder" content="Juan Alba Maldonado" />
		<meta name="author" content="Juan Alba Maldonado" />
		<meta name="creator" content="Juan Alba Maldonado" />
		<meta name="DC.Creator" content="Juan Alba Maldonado" />
		<meta name="DC.Publisher" content="Juan Alba Maldonado" />
		<meta name="DC.Source" content="Juan Alba Maldonado" />
		
		<title><?php
			if (!isset($projectTitleHeader) || !is_string($projectTitleHeader) || $projectTitleHeader === "")
			{
				$projectTitleHeader = $projectTitle[$language][$category];
				if (isset($projectTitle[$language][$category . "_" . $subcategory . "_" . $topic])) { $projectTitleHeader = $projectTitle[$language][$category . "_" . $subcategory . "_" . $topic]; }
				else if (isset($projectTitle[$language][$category . "_" . $subcategory])) { $projectTitleHeader = $projectTitle[$language][$category . "_" . $subcategory]; }
			}
			echo $projectTitleHeader;
		?></title>
		
		<meta http-equiv="title" content="<?php echo $projectTitleHeader; ?>" />
		<meta name="title" content="<?php echo $projectTitleHeader; ?>" />
		<meta name="DC.Title" lang="<?php echo $langHTML; ?>" content="<?php echo $projectTitleHeader; ?>" />

		<?php
			$pageDescription = $pagesDescription[$language]["_DEFAULT"];
			if (isset($subcategory) && $subcategory !== "" && isset($topic) && $topic !== "" && isset($pagesDescription[$language][$category . "_" . $subcategory . "_" . $topic]))
			{
				$pageDescription = $pagesDescription[$language][$category . "_" . $subcategory . "_" . $topic];
			}
			else if (isset($subcategory) && $subcategory !== "" && isset($pagesDescription[$language][$category . "_" . $subcategory]))
			{
				$pageDescription = $pagesDescription[$language][$category . "_" . $subcategory];
			}
			else if (isset($pagesDescription[$language][$category]))
			{
				$pageDescription = $pagesDescription[$language][$category];
			}
		?>

		<meta name="description" content="<?php echo $pageDescription; ?>" />
		<meta name="DC.Description" lang="<?php echo $langHTML; ?>" content="<?php echo $pageDescription; ?>" />
		<meta http-equiv="description" content="<?php echo $pageDescription; ?>" />

		<meta name="subject" content="<?php echo $pageDescription; ?>" />
		<meta name="DC.Subject" lang="<?php echo $langHTML; ?>" content="<?php echo $pageDescription; ?>" />

		<meta name="keywords" content="<?php echo $projectKeywords[$language]; ?>" />
		<meta name="DC.Keywords" content="<?php echo $projectKeywords[$language]; ?>" />
		<meta name="htdig-keywords" content="<?php echo $projectKeywords[$language]; ?>" />
		<meta http-equiv="keywords" content="<?php echo $projectKeywords[$language]; ?>" />

		<meta name="DC.Identifier" content="<?php echo $projectURLCurrent; ?>" />
		<meta name="URL" content="<?php echo $projectURLCurrent; ?>" />
		<meta http-equiv="URL" content="<?php echo $projectURLCurrent; ?>" />

		<meta name="distribution" content="global" />
		<meta http-equiv="distribution" content="global" />

		<meta name="robots" content="all" />
		<meta name="GOOGLEBOT" content="all" />

		<meta name="copyright" content="&copy; <?php echo date("Y"); ?> <?php echo $projectName; ?> by Joan Alba Maldonado" />
		<meta name="DC.Rights" content="(c) <?php echo date("Y"); ?> <?php echo $projectName; ?> by Joan Alba Maldonado" lang="<?php echo $langHTML; ?>" />

		<meta http-equiv="Reply-To" content="joanalbamaldonado@NO_SPAM_PLEASEgmail.com" />
		<meta name="htdig-email" content="joanalbamaldonado@NO_SPAM_PLEASEgmail.com" />

		<style type="text/css">
		<!--
			<?php
				require_once "_html/_css.php";
				if ($category === "basic_tutorial" || $category === "examples")
				{
					if (file_exists("_html/_lib/prism/prism.css")) { readfile("_html/_lib/prism/prism.css"); }
				}
			?>
		-->
		</style>

		<?php
			$canonicalURL = $projectURLDefault;
			if (isset($subcategory) && $subcategory !== "" && isset($topic) && $topic !== "")
			{
				$canonicalURL .= $category . "/" . $subcategory . "/" . $topic;
			}
			else if (isset($subcategory) && $subcategory !== "")
			{
				$canonicalURL .= $category . "/" . $subcategory;
			}
			else if ($category !== "index")
			{
				$canonicalURL .= $category;
			}
		?>
		<link rel="canonical" href="<?php echo $canonicalURL; ?>" />
		
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
		<link rel="icon" href="favicon.ico" type="image/x-icon" />

		<link rel="apple-touch-startup-image" href="favicon128.png">
		<link rel="apple-touch-icon" href="favicon128.png">

		<link rel="image_src" type="image/png" href="favicon128.png" />
		
		<meta name="msapplication-tap-highlight" content="no" />
		<?php
			$imageToShare = "favicon300x300.png";
			$imageToShareWidth = 300;
			$imageToShareHeight = 300;
			$snapshotsPath = "img/snapshots/";
			$snapshotsExtension = ".png";
			
			if (isset($subcategory) && $subcategory !== "" && isset($topic) && $topic !== "" && file_exists($snapshotsPath . $category . "." . $subcategory . "." . $topic . "." . strtoupper($language) . $snapshotsExtension))
			{
				$imageToShare = $snapshotsPath . $category . "." . $subcategory . "." . $topic . "." . strtoupper($language) . $snapshotsExtension;
				$imageToShareWidth = 800;
				$imageToShareHeight = 600;
			}
			else if (isset($subcategory) && $subcategory !== "" && file_exists($snapshotsPath . $category . "." . $subcategory . "." . strtoupper($language) . $snapshotsExtension))
			{
				$imageToShare = $snapshotsPath . $category . "." . $subcategory . "." . strtoupper($language) . $snapshotsExtension;
				$imageToShareWidth = 800;
				$imageToShareHeight = 600;
			}
			else if (file_exists($snapshotsPath . $category . "." . strtoupper($language) . $snapshotsExtension))
			{
				$imageToShare = $snapshotsPath . $category . "." . strtoupper($language) . $snapshotsExtension;
				$imageToShareWidth = 800;
				$imageToShareHeight = 600;
			}
			else if (file_exists($snapshotsPath . $category . $snapshotsExtension))
			{
				$imageToShare = $snapshotsPath . $category . $snapshotsExtension;
				$imageToShareWidth = 800;
				$imageToShareHeight = 600;
			}
			
			$imageToShare = $projectURLDefault . $imageToShare;
			
			if (isset($category))
		?>

		<meta property="og:type" content="website" />
		<meta property="og:url" content="<?php echo $canonicalURL; ?>" />
		<meta property="og:title" content="<?php echo $projectTitleHeader; ?>" />
		<meta property="og:site_name" content="<?php echo $projectName; ?>" />
		<meta property="og:image" content="<?php echo $imageToShare; ?>" />
		<meta property="og:image:type" content="image/png"/>
		<meta property="og:image:width" content="<?php echo $imageToShareWidth; ?>"/>
		<meta property="og:image:height" content="<?php echo $imageToShareHeight; ?>"/>
		<meta property="article:author" content="Juan Alba Maldonado" />
		<meta property="article:publisher" content="Juan Alba Maldonado" />
		<meta property="og:locale" content="<?php echo $languageTerritory; ?>" />
		<meta property="og:description" content="<?php echo $pageDescription; ?>"/>

		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content="@CrossBrowdy" />
		<meta name="twitter:creator" content="@jalbam1984" />
		<meta name="twitter:title" content="<?php echo $projectTitleHeader; ?>" />
		<meta name="twitter:description" content="<?php echo $pageDescription; ?>" />
		<meta name="twitter:image" content="<?php echo $imageToShare; ?>" />
		<meta name="twitter:url" content="<?php echo $canonicalURL; ?>" />

		<meta itemprop="name" content="<?php echo $projectName; ?>" />
		<meta itemprop="description" content="<?php echo $pageDescription; ?>" />
		<meta itemprop="image" content="favicon128.png" /> 
		
		<link rel="author" href="https://plus.google.com/101309215015488397249" />
		<link rel="publisher" href="https://plus.google.com/101309215015488397249" />

		<script language="javascript" type="text/javascript">
		<!--
			//If the base element does not have "http" or "https" in its "href" property, adds it (IE6 needs it, for example):
			var documentBaseElement = document.getElementById("document_base");
			if (documentBaseElement !== null)
			{
				var documentBase = documentBaseElement.href;
				if (documentBase.substring(0, 5) !== "http:" && documentBase.substring(0, 6) !== "https://")
				{
					var projectURL = "<?php echo $projectURL; ?>";
					documentBaseElement.href = projectURL.substring(0, projectURL.indexOf(documentBase) + documentBase.length);
				}
				else { documentBaseElement.href = documentBaseElement.href; } //IE8 fix (it does not support relative paths).
			}
			
			function toggleMenu()
			{
				var menuOptions = document.getElementById("menu_options");
				var menuBackground = document.getElementById("menu_background");
				if (menuOptions !== null && menuBackground !== null)
				{
					menuOptions.style.visibility = menuBackground.style.visibility = menuOptions.style.visibility !== "visible" ? "visible" : "hidden";
					menuOptions.style.display = menuBackground.style.display = menuOptions.style.display !== "block" ? "block" : "none";
				}
			}

			function toggleSharingBar()
			{
				var sharingBarIcons = document.getElementsByClassName("sharing_icon");
				
				var visibility = null;
				for (var x = sharingBarIcons.length - 1; x >= 0; x--)
				{
					visibility = visibility || (sharingBarIcons[x].style.visibility !== "visible" ? "visible" : "hidden");
					sharingBarIcons[x].style.visibility = visibility;
				}
				
				var sharingBarButton = document.getElementById("sharing_bar_button");
				if (sharingBarButton !== null)
				{
					if (visibility === "visible") { sharingBarButton.src = "img/sharing/button_close.svg"; }
					else { sharingBarButton.src = "img/sharing/button_open.svg"; }
				}

				var sharingIcons = document.getElementById("sharing_icons");
				if (sharingIcons !== null)
				{
					sharingIcons.style.visibility = visibility;
					if (visibility === "visible") { sharingIcons.style.display = "inline"; }
					else { sharingIcons.style.display = "none"; }
				}
			}
			
			function keyDown(e)
			{
				var keyCode = 0;
				if (e.keyCode) { keyCode = e.keyCode; }
				else if (typeof(event) !== "undefined" && event.keyCode) { keyCode = event.keyCode; }
				else if (window.Event && e.which) { keyCode = e.which; }
				if (keyCode === 27) { toggleMenu(); } //ESC key.
				else if (keyCode === 113 || keyCode === 115 || keyCode === 119) { toggleSharingBar(); } //F2, F4 and F8 keys.
			}
		// -->
		</script>
		<?php
			if (($category === "basic_tutorial" || $category === "examples") && file_exists("_html/_lib/prism/prism.js"))
			{
				?>
				<script language="javascript" type="text/javascript">
				<!--
					try //IE6 gives problems:
					{
						<?php readfile("_html/_lib/prism/prism.js"); ?>
					} catch (E) {}
				// -->
				</script>
				<?php
			}
		?>
	</head>
	<body leftmargin="0" topmargin="0" onKeyDown="keyDown(event);">
		<div id="menu_background" onClick="toggleMenu();"></div>
		<div id="menu">
			<div id="menu_button" onClick="toggleMenu();" title="Menu (ESC)"><?php echo $menuButton[$language]; ?></div>
			<div id="menu_options">
				<nav>
				<?php
					foreach ($menuOptions[$language] as $menuOptionLink => $menuOptionText)
					{
						if (in_array($menuOptionLink, $menuOptionsHidden)) { continue; }
						
						$target = in_array($menuOptionLink, $menuOptionsExternalWindow) ? ' target="_blank"' : '';
						$disabled = $category == $menuOptionLink ? " disabled" : "";
						if (isset($menuOptionsLink[$language]) && isset($menuOptionsLink[$language][$menuOptionLink])) { $menuOptionLink = $menuOptionsLink[$language][$menuOptionLink]; }
						else { $menuOptionLink = $menuOptionLink . $PHPExtension; }
						echo '<div class="menu_item"><a href="' . $menuOptionLink . '" class="menu_item_link' . $disabled . '"' . $target . '>' . $menuOptionText . '</a></div>';
					}
				?>
				</nav>
			</div>
		</div>
		<main>
			<?php
				if (file_exists("_html/" . $category . "." . $language . ".php")) { require_once "_html/" . $category . "." . $language . ".php"; }
				else if (file_exists("_html/" . $category . "." . CATEGORY_DEFAULT . ".php")) { require_once "_html/" . $category . "." . LANGUAGE_DEFAULT . ".php"; }
			?>
		</main>
		
		<hr />

		<div class="category_text">
			<!-- License: -->
			<p class="license">
				<a rel="license" href="http://creativecommons.org/licenses/by/4.0/" target="_blank"><img alt="Creative Commons Attribution 4.0 International License" style="border-width:0" src="img/cc_by_4.0_88x31.gif" width="88" height="31" /></a><br />
				<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">CrossBrowdy web site content (<a href="https://crossbrowdy.com/" target="_blank">crossbrowdy.com</a>, including tutorials and examples)</span> by
				<a xmlns:cc="http://creativecommons.org/ns#" href="https://joanalbamaldonado.com/" property="cc:attributionName" rel="cc:attributionURL" target="_blank">Joan Alba Maldonado (aka Juan Alba Maldonado)</a> is licensed under a
				<a rel="license" href="http://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution 4.0 International License</a>.<br />
				Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://crossbrowdy.com/" rel="dct:source" target="_blank">https://crossbrowdy.com/</a>.<br />
				Permissions beyond the scope of this license may be available at
				<a xmlns:cc="http://creativecommons.org/ns#" href="https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license" rel="cc:morePermissions" target="_blank">https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license</a>.
			</p>
			<p class="license">
				<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title"><a href="https://crossbrowdy.com/api" target="_blank">CrossBrowdy API documentation</a></span> by
				<a xmlns:cc="http://creativecommons.org/ns#" href="https://joanalbamaldonado.com/" property="cc:attributionName" rel="cc:attributionURL" target="_blank">Joan Alba Maldonado (aka Juan Alba Maldonado)</a> is licensed under a
				<a rel="license" href="http://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution 4.0 International License</a>.<br />
				Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://crossbrowdy.com/api" rel="dct:source" target="_blank">https://crossbrowdy.com/api</a>.<br />
				Permissions beyond the scope of this license may be available at
				<a xmlns:cc="http://creativecommons.org/ns#" href="https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license" rel="cc:morePermissions" target="_blank">https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license</a>.
			</p>
			<p class="license">
				The code written by <a href="https://joanalbamaldonado.com/" target="_blank">Joan Alba Maldonado (aka Juan Alba Maldonado)</a>, which genuinely belongs to the CrossBrowdy project, is licensed under the <a href="https://choosealicense.com/licenses/bsd-2-clause/" target="_blank">2-Clause BSD License license</a> (aka &quot;<i>Simplified BSD License</i>&quot; or &quot;<i>FreeBSD License</i>&quot;).<br />
				More information at
				<a href="https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license" target="_blank">https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license</a>.
			</p>
		</div>
		
		<footer><address><div class="author"><?php echo $projectCopyright[$language]; ?></div></address></footer>
		
		<?php
			//If wanted and possible, uses sharing buttons:
			if (SHARING_ENABLED && sizeof($sharingMedias) > 0 && file_exists("_html/_lib/goodshare.js/goodshare.min.js"))
			{
				echo '<!-- Using goodshare.js (https://goodshare.js.org/). Icons from social-share-button (https://github.com/huacnlee/social-share-button). -->';
				echo '<img src="img/sharing/button_open.svg" style="visibility:hidden; display:none;" />';
				echo '<img src="img/sharing/button_close.svg" style="visibility:hidden; display:none;" />';
				echo '<span id="sharing_bar">';
					echo '<span id="sharing_icons">';
						$sharingIconCounter = 1;
						$sharingIconsPerCol = ceil(sizeof($sharingMedias) / 2) < 9 ? ceil(sizeof($sharingMedias) / 2) : 9;
						$sharingIconsCode = Array("first_column" => "", "second_column" => "");
						foreach ($sharingMedias as $sharingMediaIndex => $sharingMedia)
						{
							$sharingIconsCode[$sharingIconCounter <= $sharingIconsPerCol ? "first_column" : "second_column"] .= '<img src="img/sharing/' . $sharingMediaIndex . '.svg" alt="' . $sharingMedia[$language] . '" title="Share on ' . $sharingMedia[$language] . '" class="sharing_icon icon-' . $sharingMediaIndex . '" data-social="' . $sharingMediaIndex . '" data-url="' . $canonicalURL . '" data-image="' . $imageToShare . '" /><br />';
							$sharingIconCounter++;
						}
						echo '<div id="sharing_icons_column_1">' . $sharingIconsCode["first_column"] . '</div>';
						echo '<div id="sharing_icons_column_2">' . $sharingIconsCode["second_column"] . '</div>';
					echo '</span>';
					echo '<img src="img/sharing/button_open.svg" id="sharing_bar_button" onClick="toggleSharingBar();" alt="Share" title="Share (F2)" />';
				echo '</span>';
				?>
				<script language="javascript" type="text/javascript">
				<!--
					try //IE6 gives problems:
					{
						<?php readfile("_html/_lib/goodshare.js/goodshare.min.js"); ?>
					} catch (E) {}
				// -->
				</script>
				<?php
			}
		?>
	</body>
</html>