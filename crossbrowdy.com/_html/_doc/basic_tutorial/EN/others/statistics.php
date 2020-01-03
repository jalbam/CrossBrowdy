<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	CrossBrowdy does not keep any statistics of usage at all by default. Despite this, you can manage any desired statistic information yourself by using your own URL and make CrossBrowdy to call it in the beginning.
	Here is an example:
</p>
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Sets desired options before starting:
	/*
		NOTE:
			* If the stats are enabled, the URL defined in 'CB_Configuration.CrossBrowdy.STATS_URL' will be called (by including it as a JavaScript file) as soon as CrossBrowdy gets called (might not be ready yet).
			* The URL will be called (included in the document as a JavaScript file) adding three parameters: "cb" parameter with the CrossBrowdy version as the value, "time" with a timestamp which belongs to the current time of the client and "url" parameter with the current URL visited by the user as the value.
	*/
	var CB_OPTIONS =
	{
		//Options for CrossBrowdy (general options):
		CrossBrowdy:
		{
			STATS: true, //Defines whether to call the URL defined in the 'CB_Configuration.CrossBrowdy.STATS_URL' or not. Default: false.
			STATS_URL: "URL_DESIRED" //URL that will be called (included in the document as a JavaScript file). Default: a link to the "CB_stats.php" example file.
		}
	};
	
	//Starts CrossBrowdy:
	CB_init(main); //It will call the "main" function when ready.
</code></pre>

<p>
	Note that, if the stats are enabled (the 'CB_Configuration.CrossBrowdy.STATS' is set to true), the URL defined in 'CB_Configuration.CrossBrowdy.STATS_URL' will be called (by including it as a JavaScript file) as soon as
	CrossBrowdy gets called (might not be ready yet).
	The URL will be called (included in the document as a JavaScript file) adding three parameters: "cb" parameter with the CrossBrowdy version as the value, "time" with a timestamp which belongs to the current time of the client and "url" parameter with the current URL visited by the user as the value.
</p>

<p>
	The 'CB_Configuration.CrossBrowdy.STATS' parameter does not do anything else, just includes your desired URL (defined in 'CB_Configuration.CrossBrowdy.STATS_URL') as a JavaScript file when CrossBrowdy is called.
</p>

<p>
	Included with the project source code, you can find a "CB_stats.php" file as an example showing how to manage and keep statistics once it is called.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/global.html#CB_OPTIONS" target="_blank">CB_OPTIONS</a> and <a href="api/CB_Configuration.html" target="_blank">CB_Configuration</a> objects.
</p>