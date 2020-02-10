<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- (c) CrossBrowdy by Joan Alba Maldonado (joanalbamaldonado@NO_SPAM_PLEASEgmail.com). Forbidden to publish, copy or modify without mentioning the author's name. -->

		<base target="_blank">
		
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
		
		<title>CrossBrowdy - Multimedia JavaScript framework - README file</title>
		
		<meta http-equiv="title" content="CrossBrowdy - Multimedia JavaScript framework - README file" />
		<meta name="title" content="CrossBrowdy - Multimedia JavaScript framework - README file" />
		<meta name="DC.Title" lang="en" content="CrossBrowdy - Multimedia JavaScript framework - README file" />

		
		<meta name="description" content="Open-source JavaScript framework to create cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps" />
		<meta name="DC.Description" lang="en" content="Open-source JavaScript framework to create cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps" />
		<meta http-equiv="description" content="Open-source JavaScript framework to create cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps" />

		<meta name="subject" content="Open-source JavaScript framework to create cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps" />
		<meta name="DC.Subject" lang="en" content="Open-source JavaScript framework to create cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps" />

		<meta name="keywords" content="multimedia,games,engine,emulators,hybrid,PWA,apps,gamedev,game development,js,JavaScript,HTML5,DHTML,cross-device,cross-platform,cross-browser" />
		<meta name="DC.Keywords" content="multimedia,games,engine,emulators,hybrid,PWA,apps,gamedev,game development,js,JavaScript,HTML5,DHTML,cross-device,cross-platform,cross-browser" />
		<meta name="htdig-keywords" content="multimedia,games,engine,emulators,hybrid,PWA,apps,gamedev,game development,js,JavaScript,HTML5,DHTML,cross-device,cross-platform,cross-browser" />
		<meta http-equiv="keywords" content="multimedia,games,engine,emulators,hybrid,PWA,apps,gamedev,game development,js,JavaScript,HTML5,DHTML,cross-device,cross-platform,cross-browser" />

		<meta name="DC.Identifier" content="https://crossbrowdy.tuxfamily.org/" />
		<meta name="URL" content="https://crossbrowdy.tuxfamily.org/" />
		<meta http-equiv="URL" content="https://crossbrowdy.tuxfamily.org/" />

		<meta name="distribution" content="global" />
		<meta http-equiv="distribution" content="global" />

		<meta name="robots" content="all" />
		<meta name="GOOGLEBOT" content="all" />

		<meta name="copyright" content="&copy; 2020 CrossBrowdy by Joan Alba Maldonado" />
		<meta name="DC.Rights" content="(c) 2020 CrossBrowdy by Joan Alba Maldonado" lang="en" />

		<meta http-equiv="Reply-To" content="joanalbamaldonado@NO_SPAM_PLEASEgmail.com" />
		<meta name="htdig-email" content="joanalbamaldonado@NO_SPAM_PLEASEgmail.com" />

		<style type="text/css">
		<!--
			body
			{
				background-color:#dddddd;
				font-family:verdana, times, serif;
				
				margin-left:20px;
				margin-right:20px;
				margin-top:0px;
				margin-bottom:0px;

				background-image:-webkit-gradient(
					linear,
					left bottom,
					left bottom,
					color-stop(0.6, rgb(255,255,255)),
					color-stop(0.9, rgb(230,230,230))
				);
				background-image:linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
				background-image:-moz-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
				background-image:-o-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
				background-image:-khtml-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
				background-image:-webkit-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
				background-image:-ms-linear-gradient(bottom, rgb(230,230,230) 1%, rgb(255,255,255) 60%);
				
				background-repeat:no-repeat;
			}

			a.title_link
			{
				text-align:center;
				
				margin-top:0px;
				
				color:#007700;
				
				font-size:48px;
				font-size:3em;
				font-size:300%;
				
				font-weight:bold;
			}

			a.title_link:hover
			{
				color:#00aa00;
				text-decoration:none;
			}
			
			#logo_image
			{
				width:160px; height:160px;
				
				transform:scale(0.8);
				-o-transform:scale(0.8);
				-ms-transform:scale(0.8);
				-khtml-transform:scale(0.8);
				-webkit-transform:scale(0.8);
			}
			#logo_image.final
			{
				width:160px; height:160px;
				
				transform:scale(1) rotate(720deg);
				-o-transform:scale(1) rotate(720deg);
				-ms-transform:scale(1) rotate(720deg);
				-khtml-transform:scale(1) rotate(720deg);
				-webkit-transform:scale(1) rotate(720deg);
				
				transition:all 1000ms;
				-moz-transition:all 1000ms;
				-webkit-transition:all 1000ms;
				-o-transition:all 1000ms;
				-khtml-transition:all 1000ms;
				-ms-transition:all 1000ms;
			}

			h2.title
			{
				text-align:center;
				margin-top:30px;
				color:#005500;
				
				font-size:32px;
				font-size:2em;
				font-size:200%;
			}

			h1
			{
				margin-top:40px;
				color:#cc0000;
			}

			h2, h3, h4, h5, h6
			{
				margin-top:30px;
				color:#990000;
			}

			p
			{
				font-size:18px;
				font-size:1.10em;
				font-size:110%;
			}
			
			code.language-html
			{
				font-size:11px !important;
				font-size:0.70em !important;
				font-size:70% !important;
			}

			a
			{
				color:#2345fd;
				text-decoration:none;
			}
			a:hover
			{
				color:#000000;
				text-decoration:underline;
			}
			
			.author
			{
				position:fixed;
				right:10px;
				bottom:10px;
				
				text-align:right;

				font-family:arial;
				font-weight:normal;
				color:#bbbbbb;
				
				font-size:20px;
				font-size:0.7em;
				font-size:70%;
				font-size:2.1vmin;
			}
			@media (orientation: portrait)
			{
				.author
				{
					font-size:12px;
					font-size:0.6em;
					font-size:60%;
					font-size:3vmin;
				}
			}

			.author_link
			{
				font-weight:bold;
				color:#bbbbbb;
			}
			.author_link:hover
			{
				color:#cccccc;
			}

			#fork_me_on_github
			{
				filter:alpha(opacity=85);
				opacity:0.85;
				-moz-opacity:0.85;
				-khtml-opacity:0.85;
				-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=85)";
			}

			<?php
				if (file_exists("_lib/prism/prism.css")) { readfile("_lib/prism/prism.css"); }
			?>
		-->
		</style>

		<link rel="canonical" href="https://crossbrowdy.tuxfamily.org/" />
		
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
		<link rel="icon" href="favicon.ico" type="image/x-icon" />

		<link rel="apple-touch-startup-image" href="https://crossbrowdy.tuxfamily.org/favicon128.png">
		<link rel="apple-touch-icon" href="https://crossbrowdy.tuxfamily.org/favicon128.png">

		<link rel="image_src" type="image/png" href="https://crossbrowdy.tuxfamily.org/favicon128.png" />
		
		<meta name="msapplication-tap-highlight" content="no" />
		
		<meta property="og:type" content="website" />
		<meta property="og:url" content="https://crossbrowdy.tuxfamily.org/" />
		<meta property="og:title" content="CrossBrowdy - Multimedia JavaScript framework - README file" />
		<meta property="og:site_name" content="CrossBrowdy" />
		<meta property="og:image" content="https://crossbrowdy.tuxfamily.org/img/snapshot.png" />
		<meta property="og:image:type" content="image/png"/>
		<meta property="og:image:width" content="800"/>
		<meta property="og:image:height" content="600"/>
		<meta property="article:author" content="Juan Alba Maldonado" />
		<meta property="article:publisher" content="Juan Alba Maldonado" />
		<meta property="og:locale" content="en_US" />
		<meta property="og:description" content="Open-source JavaScript framework to create cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps"/>

		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content="@CrossBrowdy" />
		<meta name="twitter:creator" content="@jalbam1984" />
		<meta name="twitter:title" content="CrossBrowdy - Multimedia JavaScript framework - README file" />
		<meta name="twitter:description" content="Open-source JavaScript framework to create cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps" />
		<meta name="twitter:image" content="https://crossbrowdy.tuxfamily.org/img/snapshot.png" />
		<meta name="twitter:url" content="https://crossbrowdy.tuxfamily.org/" />

		<meta itemprop="name" content="CrossBrowdy" />
		<meta itemprop="description" content="Open-source JavaScript framework to create cross-platform and hybrid game engines, games, emulators, multimedia libraries and apps" />
		<meta itemprop="image" content="https://crossbrowdy.tuxfamily.org/favicon128.png" /> 
		
		<link rel="author" href="https://plus.google.com/101309215015488397249" />
		<link rel="publisher" href="https://plus.google.com/101309215015488397249" />
		
		<script language="javascript" type="text/javascript">
		<!--
			try //IE6 gives problems:
			{
				<?php readfile("_lib/prism/prism.js"); ?>
			} catch (E) {}
		// -->
		</script>
	</head>
	<body leftmargin="0" topmargin="0">
		<header>
			<center>
				<a href="https://crossbrowdy.com/" target="_blank" class="title_link">
					<img src="img/logo.png" id="logo_image" onLoad="this.className = 'final';" /><br />
					<u>CrossBrowd</u>y
				</a>
			</center>
			<h2 class="title">README file</h2>
		</header>
		<main>
			<?php
				require_once "_lib/Parsedown/Parsedown.php";
				$markdownFile = trim(@file_get_contents("README.md"));
				if ($markdownFile === FALSE || $markdownFile === "") { echo "File '" . $markdownFile . "' not found or content empty!"; exit; }
				$Parsedown = new Parsedown();
				echo $Parsedown->text($markdownFile);
			?>
			<aside><a href="https://github.com/jalbam/crossbrowdy" target="_blank"><img style="position:fixed; top:0; right:0; border:0;" src="img/github_fork_me_right_upper.gif" alt="Fork me on GitHub" id="fork_me_on_github"></a></aside>
			<br />
			<br />
		</main>
		<footer><address><div class="author"><a href="https://crossbrowdy.com/" target="_blank" class="author_link">CrossBrowdy</a> by <span itemprop="author publisher" itemscope itemtype="http://schema.org/Person"><a href="https://joanalbamaldonado.com/" target="_blank" class="author_link"><span itemprop="name">Joan Alba Maldonado</span></a></span></div></address></footer>
	</body>
</html>