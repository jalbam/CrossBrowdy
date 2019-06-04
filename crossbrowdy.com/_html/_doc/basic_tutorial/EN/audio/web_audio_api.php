<?php if (!defined("CROSSBROWDY_WEB") || CROSSBROWDY_WEB !== "YES") { exit(); } ?>

<p>
	If the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank">Web Audio API</a> is not supported natively, it will be tried to be polyfilled and emulated automatically if possible (depending on the client).
</p>

<p>
	When needed, CrossBrowdy will use the
	<a href="https://github.com/cwilso/AudioContext-MonkeyPatch" target="_blank">AudioContext monkeypatch</a> and the
	<a href="https://github.com/g200kg/WAAPISim" target="_blank">WAAPISim</a>
	libraries automatically.
</p>

<p>
	Check the <a href="_html/_doc/api/index.html" target="_blank">API documentation</a> to get more information.
</p>