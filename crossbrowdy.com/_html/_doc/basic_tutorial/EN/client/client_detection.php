<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	Current client and its version can be tried to be detected. Here is a simple example:
</p>
	
<pre><code class="language-javascript line-numbers match-braces rainbow-braces">
	CB_console("Client name: " + CB_Client.get());
	CB_console("* version (full): " + CB_Client.getVersion());
	CB_console("* version (main): " + CB_Client.getVersionMain()); //Just the first number.
</code></pre>

<p>
	Note that code execution based on client detection instead of on features detection is normally not recommended and it is often considered a bad practice and also not totally reliable.
</p>

<p>
	Check the <a href="api/index.html" target="_blank">API documentation</a> to read more about the <a href="api/CB_Client.html" target="_blank">CB_Client</a> static class.
</p>