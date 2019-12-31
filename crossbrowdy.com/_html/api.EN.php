<?php
	if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); }

	if (file_exists("_html/_doc/api/"))
	{
		?>
		<span id="api_iframe_container">
			<iframe src="_html/_doc/api/index.html" id="api_iframe" width="100%" height="100%" scrolling="yes" frameborder="0"><p class="general_text" style="text-align:center;">IFRAME element not supported! Click here to access to the <a href="_html/_doc/api/index.html" target="_blank">API</a>.</p></iframe>
		</span>
		<?php
	}
	else { echo '<p class="general_text" style="text-align:center;">API documentation not found.</p>'; }