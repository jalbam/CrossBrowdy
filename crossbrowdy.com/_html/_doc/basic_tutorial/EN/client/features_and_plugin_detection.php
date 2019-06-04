<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Some features and plug-ins can be detected by CrossBrowdy. Here is an example:
</p>
	
<pre><code class="language-javascript">
	//Support of native "canvas" element:
	if (CB_Client.supportsCanvas()) { CB_console("The canvas element is supported natively!"); }
	else { CB_console("The canvas element is not supported natively, but it may be emulated with CrossBrowdy luckily"); }
	
	//Support of CSS3 transform:
	if (CB_Client.supportsCSS3Transform()) { CB_console("CSS3 transforms are supported!"); }
	else { CB_console("CSS3 transforms are not supported and probably neither other CSS3 features..."); }
	
	//Flash plug-in detection:
	if (CB_Client.supportsFlash())
	{
		CB_console("Flash plug-in is available. The version is: " + CB_Client.getFlashVersion(true)); //Using "true" to force it to return a string.
	}
	else { CB_console("Flash plug-in does not seem to be available"); }
	
	//Silverlight plug-in detection:
	if (CB_Client.supportsSilverlight())
	{
		CB_console("Silverlight plug-in is available. The version is: " + CB_Client.getSilverlightVersion(true)); //Using "true" to force it to return a string.
	}
	else { CB_console("Silverlight plug-in does not seem to be available"); }
</code></pre>
	

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Client.html" target="_blank">CB_Client</a> static class.
</p>