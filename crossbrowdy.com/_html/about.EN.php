<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<section itemscope itemtype="https://schema.org/AboutPage">
	<header><h1 class="category_title" itemprop="name">About <?php echo $projectName; ?></h1></header>
	<div class="category_text" itemprop="text">
		<p>
			CrossBrowdy is a free and open-source JavaScript framework that allows to create multimedia apps, emulators, game engines and games that will be compatible with any device.
		</p>
		<p>
			Any software developed with CrossBrowdy should be able to be used in any JavaScript compatible web client (including browser plug-in, add-on, extension, app...) which supports &quot;<i>document.getElementById</i>&quot;.
		</p>
		<p>
			This framework allows any developer to manage easier many different things, such as audio (with Flash fallback, audio pool, etc.), canvas (with DHTML, VML, Flash or Silverlight fallbacks), screen, mouse, keyboard, gamepads, sockets (including PHP proxy fallback), XHR / AJAX (with PHP proxy for cross-domain requests), device sensors (compass / magnetometer, gyroscope, accelerometer, light sensor, proximity sensor...) and many more.
		</p>
		<p>
			It also includes many basic DOM element manipulations, fallbacks and polyfills as well as integration with Apache Cordova (including PhoneGap, Ionic...), desktop apps (PWA, UWP / WinJS, NW.js, Atom...), video game consoles, TV sets, smart watches, embedded devices and so on.
		</p>
		<p>
			CrossBrowdy focuses on cross-browser (including legacy browsers) and cross-platform compatibility. The main target is to allow any app to run in any web client with or without HTML5 compatibility.
		</p>
	</div>
</section>

<section itemscope itemtype="https://schema.org/FAQPage">
	<h1 class="category_title">Frequently Asked Questions</h1>
	<div class="category_text">
		<?php
			$FAQSchemaCode = "";
			foreach ($FAQ[$language] as $questionId => $questionArray)
			{
				echo '<span itemprop="mainEntity" itemscope itemtype="http://schema.org/Question">';
					echo '<a name="' . $questionId . '"></a>';
					echo '<h2 class="category_subtitle" itemprop="name">' . $questionArray["question"] . '</h2>';
					echo '<span itemprop="acceptedAnswer" itemscope itemtype="http://schema.org/Answer"><span itemprop="text">' . $questionArray["answer"] . '</span></span>';
				echo '</span>';
				$FAQSchemaCode .=
				'
					{
						"@type": "Question",
						"name": ' . json_encode(str_replace(Array("\r", "\n", "\t"), "", $questionArray["question"])) . ',
						"acceptedAnswer":
						{
							"@type": "Answer",
							"text": ' . json_encode(str_replace(Array("\r", "\n", "\t"), "", $questionArray["answer"])) . '
						}
					},';
			}
			$FAQSchemaCode = rtrim($FAQSchemaCode, ",");
		?>
	</div>
</section>

<?php
	/*
		<script type="application/ld+json">
			{
				"@context": "https://schema.org",
				"@type": "FAQPage",
				"mainEntity":
				[
					<?php echo $FAQSchemaCode; ?>
				]
			}
		</script>
	*/