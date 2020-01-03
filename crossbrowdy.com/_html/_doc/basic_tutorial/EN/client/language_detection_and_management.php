<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	CrossBrowdy can try to detect the preferred language or languages supported by the client. By default, it will give priority to the languages detected through the back-end when possible as they are considered to be more reliable than the ones detected through the front-end (JavaScript).
</p>

<p>
	Here is a simple example:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	//String with the first preferred language detected, with the default options:
	var language = CB_Client.getLanguage();
	
	//String with the first preferred language detected, without allowing to use "window.navigator.languages" for the detection and without giving priority to the language calculation in the back-end (not recommended):
	var language_2 = CB_Client.getLanguage(false, false);
	
	//String with the first preferred language detected, allowing to use "window.navigator.languages" for the detection (not recommended) and without giving priority to the language calculation in the back-end (not recommended):
	var language_3 = CB_Client.getLanguage(true, false);

	//Array of strings with the supported languages detected, with the default options:
	var languagesArray = CB_Client.getLanguages();

	//Array of strings with the supported languages detected, without allowing to use "window.navigator.languages" for the detection and without giving priority to the language calculation in the back-end (not recommended):
	var languagesArray_2 = CB_Client.getLanguages(false, false);
	
	//Array of strings with the supported languages detected, allowing to use "window.navigator.languages" for the detection (not recommended) and without giving priority to the language calculation in the back-end (not recommended):
	var languagesArray_3 = CB_Client.getLanguages(true, false);
	
	//Setting a function to call whenever the client language is changed (use "null" as the first parameter to remove them):
	CB_Client.onLanguageChanges(function(e) { CB_console("Language changed!"); });
</code></pre>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Client.html" target="_blank">CB_Client</a> static class.
</p>