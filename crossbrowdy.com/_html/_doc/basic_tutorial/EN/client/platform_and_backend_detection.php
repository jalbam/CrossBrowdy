<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Some platforms and back-end features can be detected by CrossBrowdy. Here is an example:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//Node.js detection:
	if (CB_Client.supportsNodeJS())
	{
		CB_console("Node.js is available. The version is: " + CB_Client.getNodeJSVersion(true)); //Using "true" to force it to return a string.
	}
	else { CB_console("Node.js does not seem to be available"); }

	//PHP detection:
	if (CB_Client.supportsPHP())
	{
		CB_console("PHP is available. The version is: " + CB_Client.getPHPVersion(true)); //Using "true" to force it to return a string.
	}
	else { CB_console("PHP does not seem to be available."); }

	//Electron detection:
	if (CB_Client.isRunningOnElectron()) { CB_console("It is running on Electron"); }
	else { CB_console("It does not seem to be running on Electron"); }

	//NW.js (formerly node-webkit) detection:
	if (CB_Client.isRunningOnNWjs()) { CB_console("It is running on NW.js"); }
	else { CB_console("It does not seem to be running on NW.js"); }
</code></pre>
	

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Client.html" target="_blank">CB_Client</a> static class.
</p>