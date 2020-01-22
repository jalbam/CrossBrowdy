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

<hr />

<div class="category_text">
	<!-- License: -->
	<p class="license">
		<a rel="license" href="http://creativecommons.org/licenses/by/4.0/" target="_blank"><img alt="Creative Commons Attribution 4.0 International License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" width="88" height="31" /></a><br />
		<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">CrossBrowdy web site content (<a href="https://crossbrowdy.com/" target="_blank">crossbrowdy.com</a>)</span> by
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
		<a xmlns:cc="http://creativecommons.org/ns#" href="https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license" rel="cc:morePermissions" target="_blank">https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license</a>.
	</p>
</div>

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