<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>
<!DOCTYPE html>
<html lang="<?php echo strtolower($language); ?>">
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
		<meta name="DC.Title" lang="en" content="<?php echo $projectTitleHeader; ?>" />

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
		<meta name="DC.Description" lang="en" content="<?php echo $pageDescription; ?>" />
		<meta http-equiv="description" content="<?php echo $pageDescription; ?>" />

		<meta name="subject" content="<?php echo $pageDescription; ?>" />
		<meta name="DC.Subject" lang="en" content="<?php echo $pageDescription; ?>" />

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
		<meta name="DC.Rights" content="(c) <?php echo date("Y"); ?> <?php echo $projectName; ?> by Joan Alba Maldonado" lang="es" />

		<meta http-equiv="Reply-To" content="joanalbamaldonado@NO_SPAM_PLEASEgmail.com" />
		<meta name="htdig-email" content="joanalbamaldonado@NO_SPAM_PLEASEgmail.com" />

		<style type="text/css">
		<!--
			<?php
				require_once "_html/_css.php";
				if ($category === "basic_tutorial" || $category === "examples")
				{
					if (file_exists("_html/_doc/_lib/prism.css")) { readfile("_html/_doc/_lib/prism.css"); }
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
		
		<meta property="og:type" content="website" />
		<meta property="og:url" content="<?php echo $canonicalURL; ?>" />
		<meta property="og:title" content="<?php echo $projectTitleHeader; ?>" />
		<meta property="og:site_name" content="<?php echo $projectName; ?>" />
		<meta property="og:image" content="<?php echo $projectURLDefault; ?>favicon300x300.png" />
		<meta property="og:image:type" content="image/png"/>
		<meta property="og:image:width" content="300"/>
		<meta property="og:image:height" content="300"/>
		<meta property="article:author" content="Juan Alba Maldonado" />
		<meta property="article:publisher" content="Juan Alba Maldonado" />
		<meta property="og:locale" content="<?php echo $languageTerritory; ?>" />
		<meta property="og:description" content="<?php echo $pageDescription; ?>"/>

		<meta name="twitter:card" content="summary" />
		<meta name="twitter:site" content="@CrossBrowdy" />
		<meta name="twitter:creator" content="@jalbam1984" />
		<meta name="twitter:title" content="<?php echo $projectTitleHeader; ?>" />
		<meta name="twitter:description" content="<?php echo $pageDescription; ?>" />
		<meta name="twitter:image" content="<?php echo $projectURLDefault; ?>favicon300x300.png" />
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
			
			function keyDown(e)
			{
				var keyCode = 0;
				if (e.keyCode) { keyCode = e.keyCode; }
				else if (typeof(event) !== "undefined" && event.keyCode) { keyCode = event.keyCode; }
				else if (window.Event && e.which) { keyCode = e.which; }
				if (keyCode === 27) { toggleMenu() }
			}
		// -->
		</script>
		<script language="javascript" type="text/javascript">
		<!--
			try //IE6 gives problems:
			{
				<?php
					if ($category === "basic_tutorial" || $category === "examples")
					{
						if (file_exists("_html/_doc/_lib/prism.js")) { readfile("_html/_doc/_lib/prism.js"); }
					}
				?>
			} catch (E) {}
		// -->
		</script>
	</head>
	<body leftmargin="0" topmargin="0" onKeyDown="keyDown(event);">
		<div id="menu_background" onClick="toggleMenu();"></div>
		<div id="menu">
			<div id="menu_button" onClick="toggleMenu();"><?php echo $menuButton[$language]; ?></div>
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
		<footer><address><div class="author"><?php echo $projectCopyright[$language]; ?></div></address></footer>
	</body>
</html>