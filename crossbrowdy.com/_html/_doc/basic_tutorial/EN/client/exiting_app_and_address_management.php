<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	When using an app (NW.js, Electron, Apache Cordova, PhoneGap, WeChat / Weixin, etc.), we can use CrossBrowdy to try to close it and exit:
	
</p>
	
<pre><code class="language-javascript">
	//Exits the app:
	CB_Client.exit(); //By default, it will use internal fallbacks and workarounds if standard methods fail.
</code></pre>

<p>
	Note that the <a href="localhost/CrossBrowdy/crossbrowdy.com/_html/_doc/api/CB_Client.html#.exit" target="_blank">CB_Client.exit</a> method can use some fallbacks and workarounds internally to try to close the app when standard methods fail. This can be useful when it is running on web browsers and other platforms.
</p>

<p>
	Here are some examples of redirection and address management:
</p>

<pre><code class="language-javascript">
	//Redirect the app:
	CB_Client.redirectTo("http://crossbrowdy.com/"); //Redirects to "http://crossbrowdy.com/".
	CB_Client.redirectTo("http://crossbrowdy.com/?data1=value1", "data2=value2&data3=value3"); //Redirects to "http://crossbrowdy.com/?data1=value1&data2=value2&data3=value3".
	
	//Checks whether it is running locally (using the "file:" protocol):
	if (CB_Client.isRunningLocally()) { CB_console("It is running locally"); }
	else { CB_console("It is NOT running locally"); }
	
	//Knowing the current address (location):
	var currentLocation = CB_Client.getLocation(); //It should return the entire location, including the file if it is present (for example, "http://www.crossbrowdy.com/index.php").
	var currentLocationWithoutFile = CB_Client.getLocationWithoutFile(); //It should return the location without the current file (for example, "http://www.crossbrowdy.com/").
</code></pre>

<p>
	Note that many of the functions support a "mindIframes" parameter to decide whether to have or not into account that it could be running inside one or more <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe" target="_blank">IFRAME</a> elements. Without setting this parameter, by default it will use the value set on the <a href="_html/_doc/api/CB_Configuration.CrossBase.html#.MIND_IFRAMES" target="_blank">CB_Configuration.CrossBase.MIND_IFRAMES</a> constant.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to read more about the <a href="_html/_doc/api/CB_Client.html" target="_blank">CB_Client</a> static class.
</p>